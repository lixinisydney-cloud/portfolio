// A local review artifact, never a deployment. Open the generated HTML directly.
import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname } from 'node:path';
const projects = JSON.parse(await readFile('content/projects-draft.json', 'utf8'));
const paths = new Set(projects.flatMap(p => [p.cover, ...p.gallery, ...p.videos.flatMap(v => [v.src, v.poster])]).filter(Boolean));
const mime = { '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
const assets = {};
for (const path of paths) assets[path] = `data:${mime[extname(path)]};base64,${(await readFile(`public/assets/${path}`)).toString('base64')}`;
const result = await build({
  configFile: false, publicDir: false, base: './', logLevel: 'warn',
  plugins: [{ name: 'offline-assets-only', transform(code, id) {
    if (id.endsWith('/src/projects.js')) return code.replace('export const assetUrl = path =>', 'export const assetUrl = path => globalThis.__previewAssets?.[path] ||');
  } }],
  build: { write: false, minify: true, lib: { entry: 'src/main.js', name: 'SydneyPreview', formats: ['iife'] }, rollupOptions: { output: { inlineDynamicImports: true } } },
});
const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output);
const js = outputs.filter(o => o.type === 'chunk').map(o => o.code).join('\n');
const css = outputs.filter(o => o.fileName.endsWith('.css')).map(o => o.source).join('\n');
const html = (await readFile('index.html', 'utf8')).replace('</head>', `<style>${css}</style></head>`)
  .replace('<script type="module" src="/src/main.js"></script>', `<script>globalThis.__previewAssets=${JSON.stringify(assets)};${js.replaceAll('</script', '<\\/script')}</script>`);
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/sydneys-world-round1-preview.html', html);
console.log('Offline browser preview: artifacts/sydneys-world-round1-preview.html');
