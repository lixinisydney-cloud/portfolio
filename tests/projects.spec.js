import { test, expect } from '@playwright/test';
import projects from '../content/projects-draft.json' with { type: 'json' };

test('all six details support refresh, history, factual data and lazy galleries', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.locator('.world-object').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('link', { name: 'View Project' }).click();
  await expect(page).toHaveURL(/#\/projects\/good-boy$/);
  await expect(page.locator('#detail-title')).toHaveText('GOOD BOY');
  await page.reload();
  await expect(page.locator('#detail-title')).toHaveText('GOOD BOY');
  await page.goBack();
  await expect(page.locator('#home-view')).toBeVisible();
  await page.goForward();
  await expect(page.locator('#detail-title')).toHaveText('GOOD BOY');
  for (const project of projects) {
    await page.goto(`/#/projects/${project.slug}`);
    await expect(page.locator('#detail-title')).toHaveText(project.title);
    await expect(page.locator('.detail-intro')).toContainText(project.summary);
    await expect(page.locator('.tech-tags li')).toHaveText(project.technologies);
    await expect(page.locator('.gallery-grid img')).toHaveCount(project.gallery.length);
    for (const img of await page.locator('.gallery-grid img').all()) {
      await expect(img).toHaveAttribute('loading', 'lazy');
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    for (const link of project.externalLinks) {
      await expect(page.getByRole('link', { name: link.label, exact: false })).toHaveAttribute('href', link.url);
    }
    await expect(page.locator('.card-year')).toHaveCount(0);
    await page.locator('.back-to-work').first().click();
    await expect(page.locator('#work')).toBeVisible();
    await expect(page.locator('.work-card')).toHaveCount(6);
  }
  await expect(page.locator('#scene [data-project="horse-motion-study"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('video downloads start only on request and stop on navigation', async ({ page }) => {
  const videos = [];
  page.on('request', request => { if (request.url().includes('.mp4')) videos.push(request.url()); });
  await page.goto('/');
  await page.goto('/#/projects/city-life-is-fun');
  await expect(page.locator('.load-video')).toHaveCount(4);
  await expect(page.locator('video[src]')).toHaveCount(0);
  expect(videos).toEqual([]);
  await page.locator('.load-video').first().click();
  await expect.poll(() => page.locator('video').first().evaluate(el => el.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => videos.length).toBeGreaterThan(0);
  await page.locator('.back-to-work').first().click();
  await expect(page.locator('video')).toHaveCount(0);
});

test('missing images, missing project and video failure have usable fallbacks', async ({ page }) => {
  await page.route('**/projects/good-boy/cover.webp', route => route.abort());
  await page.goto('/#/projects/good-boy');
  await expect(page.locator('.detail-hero .media-fallback')).toHaveText('Image unavailable');
  await expect(page.locator('#detail-title')).toHaveText('GOOD BOY');
  await page.goto('/#/projects/missing');
  await expect(page.locator('#detail-title')).toHaveText('Project not found');
  await page.getByRole('link', { name: 'Back to selected works', exact: true }).click();
  await expect(page.locator('#work')).toBeVisible();
  await page.route('**/*.mp4', route => route.abort());
  await page.goto('/#/projects/horse-motion-study');
  await page.locator('.load-video').click();
  await expect(page.locator('.video-status')).toContainText(/Open MP4/);
});

test('mobile project navigation and focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.world-object').last().click();
  await page.getByRole('link', { name: 'View Project' }).click();
  await expect(page.locator('#detail-title')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.locator('#home-view')).toBeVisible();
});
