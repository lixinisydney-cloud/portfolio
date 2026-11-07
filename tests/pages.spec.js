import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import projects from '../content/projects-draft.json' with { type: 'json' };

let server;
let base;
// Serve actual build files under a repository prefix, with no SPA fallback.
test.beforeAll(async () => {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build']);
  const root = resolve('dist');
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.svg': 'image/svg+xml' };
  server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith('/portfolio/')) { res.writeHead(404).end(); return; }
    const file = resolve(root, path.slice('/portfolio/'.length) || 'index.html');
    if (!file.startsWith(`${root}/`)) { res.writeHead(403).end(); return; }
    try { const body = await readFile(file); res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }).end(body); }
    catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/portfolio/`;
});
test.afterAll(async () => { if (server) await new Promise(resolve => server.close(resolve)); });

test('built site works under GitHub Pages repository path, including every asset and video', async ({ page, request }) => {
  const failures = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  const paths = new Set(projects.flatMap(p => [p.sceneObject, p.cover, ...p.gallery, ...(p.videos || []).flatMap(v => [v.src, v.poster])]).filter(Boolean));
  for (const path of paths) {
    const response = await request.get(`${base}assets/${path}`);
    expect(response.ok(), path).toBe(true);
    expect((await response.body()).length).toBeGreaterThan(0);
  }
  await page.goto(base);
  await expect(page.locator('.world-object')).toHaveCount(4);
  for (const img of await page.locator('.scene-image').all()) {
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await img.getAttribute('src')).toMatch(/^\.\/assets\//);
  }
  await page.locator('.world-object').first().click();
  await page.getByRole('link', { name: '查看作品' }).click();
  await page.reload();
  await expect(page.locator('#detail-title')).toHaveText('制作宠物');
  await page.getByRole('link', { name: '返回作品', exact: false }).first().click();
  await page.goBack();
  await expect(page.locator('#detail-title')).toHaveText('制作宠物');
  for (const project of projects.filter(p => p.videos?.some(v => v.kind === 'local'))) {
    await page.goto(`${base}#/projects/${project.slug}`);
    for (const button of await page.locator('.load-video').all()) {
      const index = Number(await button.getAttribute('data-video-index'));
      if (project.videos[index].kind !== 'local') continue;
      const id = await button.getAttribute('aria-controls');
      await button.click();
      const video = page.locator(`#${id} video`);
      await expect.poll(() => video.evaluate(el => el.readyState)).toBeGreaterThanOrEqual(2);
      await expect.poll(() => video.evaluate(el => el.error)).toBeNull();
      await video.evaluate(el => el.pause());
    }
  }
  expect(failures).toEqual([]);
});
