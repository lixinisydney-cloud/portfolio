// Legacy regression: the preserved phase-B page remains at legacy.html.
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import projects from '../content/projects-draft.json' with { type: 'json' };
import baseline from './fixtures/phase2-media.json' with { type: 'json' };
import source from '../planning/phase3a/03_project_content_v3.json' with { type: 'json' };

// Independent phase-2 snapshot protects assets against an editorial overwrite.
test('slug migration is repeatable and retains all phase-2 image/local MP4 paths', () => {
  execFileSync(process.execPath, ['scripts/merge-project-content.mjs', '--check']);
  for (const old of baseline) {
    const project = projects.find(p => p.slug === old.slug);
    for (const key of ['sceneObject', 'previewVideo']) expect(project[key]).toEqual(old[key]);
    expect(project.gallery).toEqual(expect.arrayContaining(old.gallery));
    if (old.slug === 'city-life-is-fun') {
      expect(project.cover).toBe('phase3b-references/city-life-final-poster.webp');
      expect(existsSync(`public/assets/${old.cover}`)).toBe(true);
    } else expect(project.cover).toBe(old.cover);
    for (const video of old.videos || []) expect(project.videos.some(v => v.src === video.src)).toBe(true);
  }
  expect(projects.filter(p => p.collection === 'main')).toHaveLength(8);
  expect(projects.filter(p => p.collection === 'experiment').map(p => p.slug)).toEqual(['horse-motion-study']);
  expect(new Set(projects.map(p => p.slug)).size).toBe(9);
  for (const p of projects) {
    expect(p.year).toBeNull();
    expect(p.sources.editorial).toBe('planning/phase3a/03_project_content_v3.json');
    if (p.isTeam) expect(p.responsibility).toBeNull();
    for (const v of p.videos) expect(existsSync(`public/assets/${v.poster}`)).toBe(true);
  }
});

test('Chinese-first nine project entries, separate horse pages and reviewed project covers', async ({ page }) => {
  const missing = [];
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('/assets/')) missing.push(response.url()); });
  await page.goto('/legacy.html');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('#work-grid .work-card')).toHaveCount(8);
  await expect(page.locator('#experiment-grid .work-card')).toHaveCount(1);
  await expect(page.locator('#work-grid .work-card').first()).toHaveAttribute('data-project', 'the-making-of-pets');
  await expect(page.locator('#about-copy')).toHaveText(source.site.aboutZh);
  await expect(page.locator('#contact-links a').first()).toHaveAttribute('href', `mailto:${source.site.contact.email}`);
  for (const slug of ['stubborn-horse', 'dragon-dance', 'the-uncertain-oracle']) {
    const card = page.locator(`#work-grid [data-project="${slug}"]`);
    await expect(card.locator('img')).toHaveCount(1);
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => card.locator('img').evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
    await page.goto(`/legacy.html#/projects/${slug}`);
    await expect(page.locator('.responsibility')).toHaveCount(slug === 'stubborn-horse' ? 1 : 0);
    if (slug === 'the-uncertain-oracle') await expect(page.locator('.demo-hint').first()).toContainText('摄像头权限');
    await expect(page.locator('body')).not.toContainText(/coming soon|待确认|临时封面|low resolution|provisional|mediaStatus/i);
    await page.goto('/legacy.html');
  }
  await page.goto('/legacy.html#/projects/horse-motion-study');
  await expect(page.locator('#detail-title')).toHaveText('马的算法运动研究');
  await expect(page.locator('.cta-live')).toHaveCount(0);
  for (const link of await page.locator('a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
  }
  expect(missing).toEqual([]);
});

test('YouTube uses local posters and no iframe/network until clicked, with fallback links', async ({ page }) => {
  const external = [];
  page.on('request', r => { if (/youtube|ytimg/.test(r.url())) external.push(r.url()); });
  // Exercise the UI with a deterministic blocked-provider response, not a real
  // third-party request or a claim that YouTube plays in every interview network.
  await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ status: 503, contentType: 'text/html', body: 'Unavailable' }));
  await page.goto('/legacy.html#/projects/anger-market');
  await expect(page.locator('.load-video')).toHaveCount(2);
  await expect(page.locator('iframe')).toHaveCount(0);
  for (const img of await page.locator('.load-video img').all()) {
    await expect(img).toHaveAttribute('src', /^(?:\.\/|\/)assets\/posters\//);
  }
  expect(external).toEqual([]);
  await page.locator('.load-video').first().click();
  await expect(page.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/FRyUeWUroQE/);
  await expect(page.locator('.video-fallback').first().getByRole('link')).toHaveAttribute('href', 'https://www.youtube.com/watch?v=FRyUeWUroQE');
  await expect(page.locator('.video-status').first()).toContainText('新窗口');
  await page.locator('.back-to-work').first().click();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('watch CTA keeps hash detail route and keyboard can start video', async ({ page }) => {
  await page.goto('/legacy.html#/projects/city-life-is-fun');
  await page.getByRole('button', { name: '观看影片', exact: true }).click();
  await expect(page).toHaveURL(/#\/projects\/city-life-is-fun$/);
  const button = page.locator('.load-video').first();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.locator('video').first().evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
});
