// Legacy regression: the preserved phase-B page remains at legacy.html.
import { test, expect } from '@playwright/test';
import source from '../planning/phase3a/03_project_content_v3.json' with { type: 'json' };
import projects from '../content/projects-draft.json' with { type: 'json' };

test('original island and four reachable semantic destinations at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/legacy.html');
  await expect(page.locator('.main-island')).toHaveAttribute('src', /assets\/world\/island-main\.webp$/);
  await expect.poll(() => page.locator('.main-island').evaluate(i => i.complete && i.naturalWidth === 1738)).toBe(true);
  await expect(page.locator('.hotspot')).toHaveCount(4);
  for (const hotspot of await page.locator('.hotspot').all()) {
    const slug = await hotspot.getAttribute('data-project');
    const project = projects.find(p => p.slug === slug);
    const box = await hotspot.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.y + box.height).toBeLessThanOrEqual(900);
    const reachable = await hotspot.evaluate(el => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); });
    expect(reachable).toBe(true);
    await hotspot.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#preview-title')).toHaveText(project.titleCn);
    await page.keyboard.press('Escape');
    await expect(hotspot).toBeFocused();
  }
});

test('390x844 scene stays compact and does not download desktop ornaments or videos', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const requests = [];
  page.on('request', r => requests.push(r.url()));
  await page.goto('/legacy.html');
  await expect(page.locator('#scene img')).toHaveCount(1);
  await expect(page.locator('.world-island')).not.toHaveAttribute('style', /translate3d/);
  const top = await page.locator('#work').evaluate(el => el.getBoundingClientRect().top);
  expect(top).toBeLessThan(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(requests.filter(url => /flying-cow|flying-deer|dream-flora|crystal-flora|\.mp4/.test(url))).toEqual([]);
  for (const hotspot of await page.locator('.hotspot').all()) {
    expect((await hotspot.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await hotspot.tap();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: '关闭作品预览' }).tap();
  }
  await context.close();
});

test('phase A editorial copy, links, roles and media actions remain intact', async ({ page }) => {
  for (const original of source.projects) {
    const project = projects.find(p => p.slug === original.slug);
    expect(project.summary).toBe(original.short);
    expect(project.detailZh).toBe(original.detail);
    expect(project.technologies).toEqual(original.tech);
    expect(project.links).toEqual(original.links);
    expect(project.responsibility).toBe(original.responsibility);
    for (const video of original.videos) expect(project.videos.some(v => video.src ? v.src === video.src : v.url === video.url)).toBe(true);
  }
  for (const slug of ['stubborn-horse', 'dragon-dance', 'the-uncertain-oracle']) {
    await page.goto(`/legacy.html#/projects/${slug}`);
    await expect(page.locator('.detail-hero img')).toHaveAttribute('src', /phase3b-references/);
    await expect(page.locator('.video-poster .load-video img')).toHaveAttribute('src', /phase3b-references/);
    await expect(page.locator('.cta-live')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(page.locator('.cta-github')).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.goto('/legacy.html#/projects/city-life-is-fun');
  await expect(page.locator('.detail-hero img')).toHaveAttribute('src', /city-life-final-poster/);
  await expect(page.locator('.load-video')).toHaveCount(5);
  await expect(page.locator('video')).toHaveCount(0);
  await page.locator('.load-video').last().click();
  await expect.poll(() => page.locator('video').evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
});

test('all seven external video entries mount the correct embed only on click', async ({ page }) => {
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Provider test fixture</p>' }));
  for (const project of projects) {
    const youtubeVideos = project.videos.map((video, index) => ({ ...video, index })).filter(v => v.kind === 'youtube');
    if (!youtubeVideos.length) continue;
    await page.goto(`/legacy.html#/projects/${project.slug}`);
    await expect(page.locator('iframe')).toHaveCount(0);
    for (const video of youtubeVideos) {
      const figure = page.locator('.video-poster').nth(video.index);
      await figure.getByRole('button', { name: `播放影片：${video.label}`, exact: true }).click();
      await expect(figure.locator('iframe')).toHaveAttribute('src', `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`);
      await expect(figure.locator('.video-fallback a').first()).toHaveAttribute('href', video.url);
    }
    await page.locator('.back-to-work').first().click();
    await expect(page.locator('iframe')).toHaveCount(0);
  }
});
