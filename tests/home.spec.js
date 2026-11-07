import { test, expect } from '@playwright/test';
test('desktop projects, mouse parallax, keyboard dialog and navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.world-object')).toHaveCount(5);
  await expect(page.locator('.work-card')).toHaveCount(6);
  await page.mouse.move(200, 200);
  await page.waitForTimeout(500);
  const before = await page.locator('.object-good-boy').evaluate(el => el.style.transform);
  await page.mouse.move(1200, 700);
  await page.waitForTimeout(500);
  expect(await page.locator('.object-good-boy').evaluate(el => el.style.transform)).not.toBe(before);
  const first = page.locator('.world-object').first();
  await first.focus();
  await expect(first.locator('.object-label')).toHaveCSS('opacity', '1');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#preview-title')).toHaveText('GOOD BOY');
  await page.keyboard.press('Escape');
  await expect(first).toBeFocused();
  for (const card of await page.locator('.work-card').all()) {
    await card.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close project preview' }).click();
    await expect(card).toBeFocused();
  }
  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/#about$/);
  expect(errors).toEqual([]);
});
test('touch layout exposes every title and opens preview without hover', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const button of await page.locator('.world-object').all()) {
    await expect(button.locator('.object-label')).toHaveCSS('opacity', '1');
    await button.tap();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close project preview' }).tap();
  }
  expect(await page.locator('.object-good-boy').evaluate(el => el.style.transform)).toBe('');
  await context.close();
});
test('reduced motion disables parallax', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.mouse.move(900, 500);
  expect(await page.locator('.object-good-boy').evaluate(el => el.style.transform)).toBe('');
});
