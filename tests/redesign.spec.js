import { test, expect } from '@playwright/test';
import projects from '../content/projects-draft.json' with { type: 'json' };
const order = ['the-making-of-pets','anger-market','chroma-residences','stubborn-horse','dragon-dance','the-uncertain-oracle','city-life-is-fun','good-boy','horse-motion-study'];

test('new homepage keeps exact 8+1 order, images only, no summaries or legacy assets', async ({ page }) => {
  const requests = [];
  page.on('request', r => requests.push(r.url()));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('navigation').getByRole('link')).toHaveText(['Work','About','Contact']);
  await expect(page.locator('.project-chapter')).toHaveCount(9);
  expect(await page.locator('.project-chapter').evaluateAll(els => els.map(el => el.dataset.project))).toEqual(order);
  await expect(page.locator('#work-stream .portal-link')).toHaveCount(8);
  await expect(page.locator('#experiment-stream .portal-link')).toHaveCount(1);
  await expect(page.locator('dialog, #scene, .pearl-link, iframe, video')).toHaveCount(0);
  for (const p of projects) await expect(page.locator('#home-view')).not.toContainText(p.summary);
  expect(requests.filter(url => /\/world\/|\/ui\/|\.mp4|youtube/.test(url))).toEqual([]);
  for (const link of await page.locator('.portal-link').all()) {
    await link.scrollIntoViewIfNeeded();
    await expect.poll(() => link.locator('img').evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
  }
});

test('all nine images go straight to the correct detail and survive refresh', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const slug of order) {
    await page.goto('/');
    const link = page.locator(`[data-project-link="${slug}"]`);
    await link.scrollIntoViewIfNeeded();
    await link.focus(); // Also fully exposes the portal for keyboard access.
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#/projects/${slug}$`));
    await expect(page.locator('#project-detail')).toBeVisible();
    await expect(page.locator('dialog')).toHaveCount(0);
    const p = projects.find(p => p.slug === slug);
    await expect(page.locator('#detail-title')).toHaveText(p.title);
    await expect(page.locator('.detail-intro')).toContainText(p.detailZh);
    await page.reload();
    await expect(page.locator('#detail-title')).toHaveText(p.title);
  }
  expect(errors).toEqual([]);
});

test('image pointer navigation and back restore the image focus and scroll position', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('[data-project-link="anger-market"]');
  await image.scrollIntoViewIfNeeded();
  await page.evaluate(() => addEventListener('pointerdown', () => { window.clickedAtY = scrollY; }, { once: true }));
  await image.click();
  const before = await page.evaluate(() => window.clickedAtY);
  await expect(page.locator('#project-detail')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#home-view')).toBeVisible();
  await expect(image).toBeFocused();
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(5);
});

test('native scroll changes portal reveal and type, reduced motion removes masking', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const chapter = page.locator('.project-chapter').first();
  await page.evaluate(() => scrollTo(0, document.querySelector('.project-chapter').offsetTop - innerHeight * .7));
  const visual = chapter.locator('.portal-visual');
  await expect.poll(() => visual.evaluate(e => getComputedStyle(e).clipPath)).not.toBe('none');
  const before = await visual.evaluate(e => getComputedStyle(e).clipPath);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => visual.evaluate(e => getComputedStyle(e).clipPath)).not.toBe(before);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(visual).toHaveCSS('clip-path', 'none');
  await expect(chapter.locator('.line-1')).toHaveCSS('transform', 'none');
});

test('mobile touch scroll and image entry, About and Contact remain usable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  const image = page.locator('[data-project-link="city-life-is-fun"]');
  await image.scrollIntoViewIfNeeded();
  await expect(image.locator('img')).toBeVisible();
  await image.tap();
  await expect(page).toHaveURL(/#\/projects\/city-life-is-fun$/);
  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
  await expect(page.locator('#home-view')).toBeVisible();
  await expect(page.locator('#about')).toBeInViewport();
  await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click();
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.getByRole('link', { name: /lixinisydney@163.com/ })).toHaveAttribute('href', 'mailto:lixinisydney@163.com');
  await context.close();
});
