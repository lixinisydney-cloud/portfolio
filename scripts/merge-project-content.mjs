// Run from any directory: node scripts/merge-project-content.mjs [--check]
// Only canonical content files are updated. No assets are renamed or removed.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = 'planning/phase3a/03_project_content_v3.json';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const draft = read('content/projects-draft.json');
const incoming = read(source);
function assertUnique(items, name) {
  const slugs = items.map(p => p.slug);
  if (slugs.some(slug => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) || new Set(slugs).size !== slugs.length) throw new Error(`Invalid/duplicate slug: ${name}`);
}
assertUnique(draft, 'existing');
assertUnique(incoming.projects, 'incoming');
const bySlug = new Map(draft.map(p => [p.slug, p]));
const posterNames = {
  '6AQrL53uet8': 'pets-film.webp',
  FRyUeWUroQE: 'anger-film-01.webp',
  QLGBUlh2MRM: 'anger-film-02.webp',
  xEc4Kw6O3hY: 'chroma-film.webp',
  'itmUY-1dSg8': 'stubborn-horse-film.svg',
  '8aRfY_WLNl0': 'dragon-dance-film.svg',
  '1chPTqrWrQw': 'oracle-film.svg',
};
const key = video => video.src || video.url;
const merged = incoming.projects.map(copy => {
  const old = bySlug.get(copy.slug);
  const videos = new Map((old?.videos || []).map(v => [key(v), { ...v, kind: v.kind || 'local' }]));
  for (const video of copy.videos) {
    const previous = videos.get(key(video));
    videos.set(key(video), { ...previous, ...video, poster: video.poster ?? previous?.poster ?? null });
  }
  // Local media from the old schema are retained even when not in the new copy.
  if (old?.previewVideo && !videos.has(old.previewVideo)) videos.set(old.previewVideo, { kind: 'local', src: old.previewVideo, label: '作品片段' });
  const finalVideos = [...videos.values()].map(video => {
    const poster = video.kind === 'youtube' ? posterNames[video.videoId] : `${copy.slug}-${path.basename(video.src, '.mp4')}.webp`;
    return { ...video, poster: video.poster || `posters/${poster}`, posterType: video.kind === 'local' ? 'video-frame' : poster.endsWith('.svg') ? 'text' : 'project-image', source };
  });
  return {
    ...(old || { slug: copy.slug, cover: null, sceneObject: null, gallery: [], previewVideo: null }),
    title: copy.title, titleCn: copy.titleCn, category: copy.category,
    summary: copy.short, detailZh: copy.detail, technologies: copy.tech,
    priority: copy.priority, collection: copy.slug === 'horse-motion-study' ? 'experiment' : 'main',
    group: copy.group, isTeam: copy.isTeam,
    responsibility: copy.isTeam ? null : copy.responsibility,
    // Review notes remain internal and are never passed to a visitor-facing block.
    responsibilityReviewNote: copy.responsibilityReviewNote,
    links: copy.links, videos: finalVideos, year: copy.year,
    sources: { editorial: source, media: old?.sources ? old.sources.media : (old ? 'phase2-existing-assets' : null), review: 'planning/phase3a/02_project_copy_cn.md' },
  };
});
// Unknown existing works must survive a later editorial import.
for (const old of draft) if (!incoming.projects.some(copy => copy.slug === old.slug)) merged.push(old);
for (const p of merged) {
  const paths = [p.cover, p.sceneObject, p.previewVideo, ...p.gallery, ...p.videos.flatMap(v => [v.src, v.poster])].filter(Boolean);
  for (const file of paths) {
    const full = path.resolve(root, 'public/assets', file);
    if (!full.startsWith(path.join(root, 'public/assets/')) || !fs.existsSync(full)) throw new Error(`Missing or unsafe asset for ${p.slug}: ${file}`);
  }
}
const outputs = { 'content/projects-draft.json': merged, 'content/site.json': { ...incoming.site, source } };
for (const [file, value] of Object.entries(outputs)) {
  const next = JSON.stringify(value, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(path.join(root, file), 'utf8') !== next) throw new Error(`Content needs migration: ${file}`);
  } else fs.writeFileSync(path.join(root, file), next);
}
console.log(`Slug merge ${process.argv.includes('--check') ? 'verified' : 'saved'}: ${merged.length} projects; existing image/local-video paths retained.`);
