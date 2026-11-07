// Start the Vite dev server first; CAPTURE_URL can point at a production preview.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch(process.env.CI ? {} : { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
await mkdir('docs/screenshots', { recursive: true });
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 800, hasTouch: width < 800 });
    const page = await context.newPage();
    await page.goto(process.env.CAPTURE_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.locator('#scene img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `docs/screenshots/phase3b-home-${width}x${height}.png` });
    await context.close();
  }
} finally { await browser.close(); }
