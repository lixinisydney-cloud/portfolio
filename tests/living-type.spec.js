import { test, expect } from '@playwright/test';
import projects from '../content/projects-draft.json' with { type: 'json' };

test('canvas pixels move at idle, proximity/velocity deform glyphs and departure recovers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const canvas = page.locator('.typography-canvas');
  await expect(canvas).toBeVisible();
  const pixels = () => canvas.evaluate(c => c.toDataURL());
  const before = await pixels();
  await expect.poll(pixels).not.toBe(before);
  await page.mouse.move(50,750);
  await page.mouse.move(700,290,{steps:20});
  await page.mouse.move(850,330,{steps:8});
  await expect.poll(async () => Number(await canvas.getAttribute('data-energy'))).toBeGreaterThan(1);
  const pointerPixels = await pixels();
  expect(pointerPixels).not.toBe(before);
  await page.mouse.move(1400,850);
  await expect.poll(async () => Number(await canvas.getAttribute('data-energy'))).toBeLessThan(.3);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName("SYDNEY'S WORLD");
});

test('scroll drives curved trail and first portal together and reverses without resetting', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const canvas = page.locator('canvas');
  const portal = page.locator('.portal-visual').first();
  await page.evaluate(()=>scrollTo(0,650));
  await expect.poll(async()=>Number(await canvas.getAttribute('data-progress'))).toBeGreaterThan(.3);
  const first = await canvas.evaluate(c=>c.toDataURL());
  const clip = await portal.evaluate(e=>getComputedStyle(e).clipPath);
  await page.evaluate(()=>scrollTo(0,1100));
  await expect.poll(async()=>Number(await canvas.getAttribute('data-progress'))).toBeGreaterThan(.7);
  await expect.poll(()=>portal.evaluate(e=>getComputedStyle(e).clipPath)).not.toBe(clip);
  expect(await canvas.evaluate(c=>c.toDataURL())).not.toBe(first);
  await page.evaluate(()=>scrollTo(0,350));
  await expect.poll(async()=>Number(await canvas.getAttribute('data-progress'))).toBeLessThan(.4);
  await page.evaluate(()=>scrollTo(0,0));
  await expect.poll(async()=>Number(await canvas.getAttribute('data-progress'))).toBeLessThan(.001);
  await page.locator('.portal-link').first().focus();await page.keyboard.press('Enter');
  await expect(canvas).toBeHidden();
  const frames=await canvas.getAttribute('data-frames');
  await page.waitForTimeout(150);
  expect(await canvas.getAttribute('data-frames')).toBe(frames);
  await page.goBack();await expect(canvas).toBeVisible();
});

test('resize and reduced motion preserve static accessible title and stop frames', async ({ page }) => {
  await page.goto('/');
  const canvas=page.locator('canvas');
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(canvas).toBeHidden();
  await expect(page.locator('#intro-title')).not.toHaveCSS('color','rgba(0, 0, 0, 0)');
  const frame=await canvas.getAttribute('data-frames');await page.waitForTimeout(150);
  expect(await canvas.getAttribute('data-frames')).toBe(frame);
});

test('new details have native videos and direct responsive embeds, without cover gates', async ({ page }) => {
  await page.route('https://www.youtube-nocookie.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<p>Provider fixture</p>'}));
  for(const p of projects){
    await page.goto(`/#/projects/${p.slug}`);
    await expect(page.locator('#detail-title')).toHaveText(p.title);
    await expect(page.locator('.load-video,.video-poster,.video-play-label')).toHaveCount(0);
    await expect(page.locator('.direct-media')).toHaveCount(p.videos.length);
    for(const [i,v] of p.videos.entries()){
      const media=page.locator('.direct-media').nth(i);
      if(v.kind==='youtube'){
        await expect(media.locator('iframe')).toHaveAttribute('src',new RegExp(v.videoId));
        await expect(media.getByRole('link',{name:/Watch Online/})).toHaveAttribute('href',v.url);
      }else{
        const video=media.locator('video');
        await expect(video).toHaveAttribute('controls','');
        await expect(video).not.toHaveAttribute('poster',/.+/);
        await video.scrollIntoViewIfNeeded();
        await video.evaluate(v=>v.play());
        await expect.poll(()=>video.evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(2);
        await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0);
        await video.evaluate(v=>v.pause());
      }
    }
    expect(await page.locator('.detail-tools').count()).toBe(1);
    if(p.videos.length) expect(await page.locator('.detail-videos').evaluate(e=>e.compareDocumentPosition(document.querySelector('.detail-gallery')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  }
});
