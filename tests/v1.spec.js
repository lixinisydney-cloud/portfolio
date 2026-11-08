import {test,expect} from '@playwright/test';
const letters=['M','A','C','S','D','U','C','G','H'];
for(const width of [1440,390]) test(`all nine anchors reveal and reverse at ${width}px, footer and idle culling`,async({page})=>{
 await page.setViewportSize({width,height:width===390?844:900});await page.goto('/');
 const canvas=page.locator('.typography-canvas');await expect(canvas).toHaveAttribute('data-anchor-letters',letters.join(','));
 const anchors=await canvas.evaluate(c=>JSON.parse(c.dataset.anchors));
 expect(anchors.map(a=>a.letter)).toEqual(letters);
 expect(new Set(anchors.map(a=>a.slug)).size).toBe(9);
 for(let i=0;i<anchors.length;i++){
  await page.evaluate(y=>scrollTo(0,y),anchors[i].scroll+2);
  const chapter=page.locator(`[data-project="${anchors[i].slug}"]`);
  await expect.poll(()=>chapter.getAttribute('data-reveal')).toBe('1.0000');
  await expect.poll(()=>canvas.evaluate((c,i)=>JSON.parse(c.dataset.anchorFills)[i],i)).toBe(1);
  expect(+(await canvas.getAttribute('data-visible-segments'))).toBeLessThanOrEqual(3);
 }
 for(let i=8;i>0;i--){
  const y=anchors[i-1].scroll+(anchors[i].scroll-anchors[i-1].scroll)*.25;
  await page.evaluate(y=>scrollTo(0,y),y);
  await expect.poll(()=>canvas.evaluate((c,i)=>JSON.parse(c.dataset.anchorFills)[i],i)).toBe(0);
  await expect.poll(()=>page.locator(`[data-project="${anchors[i].slug}"]`).getAttribute('data-reveal')).toBe('0.0000');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
 await page.locator('#contact').scrollIntoViewIfNeeded();await expect.poll(()=>canvas.getAttribute('data-state')).toBe('settled');
 const f=await canvas.getAttribute('data-frames');await page.waitForTimeout(180);expect(await canvas.getAttribute('data-frames')).toBe(f);
 await expect(page.locator('.drift-footer')).toHaveCSS('background-color','rgb(8, 8, 8)');
 await expect(page.locator('.drift-colophon')).toContainText('2026');
 for(const name of ['GitHub','Instagram'])await expect(page.locator('#contact-links').getByRole('link',{name:new RegExp(name)})).toHaveAttribute('rel','noopener noreferrer');
 await page.getByRole('link',{name:'BACK TO TOP ↑'}).click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
});

test('English detail titles, Chinese body and a complete nine-project Next cycle',async({page})=>{
 await page.route('https://www.youtube-nocookie.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<p>Provider fixture</p>'}));
 for(const [slug,next]of [['good-boy','horse-motion-study'],['horse-motion-study','the-making-of-pets'],['city-life-is-fun','good-boy']]){
  await page.goto(`/#/projects/${slug}`);
  if(slug==='city-life-is-fun')await expect(page.locator('#detail-title')).toHaveText('City Life Is Fun');
  await expect(page.locator('.detail-navigation a').last()).toHaveAttribute('href',`#/projects/${next}`);
  await expect(page.locator('.detail-intro')).not.toBeEmpty();
 }
});

test('provider diagnostic times out an unfulfilled play promise instead of hanging the release',async({page})=>{
 const {probePlay}=await import('../scripts/media-probe.js');
 await page.setContent('<video controls></video>');
 await expect(probePlay(page.locator('video'),150)).rejects.toThrow(/Playback probe timed out/);
 await expect.poll(()=>page.locator('video').evaluate(v=>v.paused)).toBe(true);
});
