import { test, expect } from '@playwright/test';
import { createStaticServer } from './support/static-server.js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import projects from '../content/projects-draft.json' with { type: 'json' };

let server;
let base;
// Serve actual build files under a repository prefix, with no SPA fallback.
test.beforeAll(async () => {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build']);
  const root = resolve('dist');
  server = createStaticServer(root);
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
      await test.step(`${project.slug}: ${project.videos[index].src}`, async () => {
        await button.click();
        const video = page.locator(`#${id} video`);
        await expect.poll(() => video.evaluate(el => ({ ready: el.readyState, error: el.error?.message || null })), {
          message: `Decode ${project.videos[index].src}`,
        }).toMatchObject({ ready: expect.any(Number), error: null });
        await expect.poll(() => video.evaluate(el => el.readyState), { message: project.videos[index].src }).toBeGreaterThanOrEqual(2);
        await expect.poll(() => video.evaluate(el => el.currentTime), { message: `Playback must advance: ${project.videos[index].src}` }).toBeGreaterThan(0);
        await video.evaluate(el => el.pause());
      });
    }
  }
  expect(failures).toEqual([]);
});


test('static video server supports partial, suffix, HEAD and unsatisfiable ranges', async ({ request }) => {
  const path = 'assets/phase3b-references/city-life-motion-10s.mp4';
  const file = await readFile(resolve('dist', path));
  const head = await request.head(`${base}${path}`);
  expect(head.headers()['content-length']).toBe(String(file.length));
  expect(head.headers()['accept-ranges']).toBe('bytes');
  for (const range of ['bytes=0-31', 'bytes=-128', 'bytes=32-']) {
    const response = await request.get(`${base}${path}`, { headers: { Range: range } });
    expect(response.status()).toBe(206);
    const start = range === 'bytes=-128' ? file.length - 128 : range === 'bytes=0-31' ? 0 : 32;
    const end = range === 'bytes=0-31' ? 32 : file.length;
    expect(response.headers()['content-range']).toBe(`bytes ${start}-${end - 1}/${file.length}`);
    expect((await response.body()).equals(file.subarray(start, end))).toBe(true);
  }
  const invalid = await request.get(`${base}${path}`, { headers: { Range: `bytes=${file.length}-` } });
  expect(invalid.status()).toBe(416);
  expect(invalid.headers()['content-range']).toBe(`bytes */${file.length}`);
  // The large original clip must expose metadata before media payload, even on
  // hosts where a browser has to read sequentially instead of requesting ranges.
  expect(file.indexOf(Buffer.from('moov'))).toBeLessThan(file.indexOf(Buffer.from('mdat')));
});
