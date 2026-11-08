// Review evidence from the running production build; no simulated animation.
import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const dir='docs/recordings/adrift-dynamics';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:'/tmp/sydney-anchor-video',size:{width:1440,height:900}}});
const page=await context.newPage();
try{
 await page.goto(process.env.CAPTURE_URL||'http://127.0.0.1:4174/');await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>document.querySelector('canvas').dataset.anchorEnd);
 const {start,end}=await page.locator('canvas').evaluate(c=>({start:+c.dataset.anchorStart,end:+c.dataset.anchorEnd}));
 await page.evaluate(()=>{const note=document.createElement('div');note.id='review-caption';note.style.cssText='position:fixed;bottom:18px;left:24px;z-index:1000;background:#111e;border:1px solid #eeece555;color:#fff;padding:12px;font:12px Arial;pointer-events:none';document.body.append(note);});
 const caption=text=>page.locator('#review-caption').evaluate((e,t)=>e.textContent=t,text);
 const scroll=async(a,b)=>{for(let i=0;i<=120;i++){await page.evaluate(y=>scrollTo(0,y),a+(b-a)*i/120);await page.waitForTimeout(55);}};
 await caption('M / THE MAKING OF PETS — fixed letter anchor');
 await page.evaluate(y=>scrollTo(0,y),start-100);await page.waitForTimeout(800);
 await page.mouse.move(150,520);await page.mouse.move(240,470,{steps:20});await page.waitForTimeout(500);
 await caption('SCROLL DOWN / outline glyphs connect M → A');await scroll(start-100,end);
 await caption('A / ANGER MARKET — outline becomes solid; image portal opens');await page.waitForTimeout(1500);
 await page.screenshot({path:'/tmp/anchor-arrival.png'});
 await caption('SCROLL UP / same trajectory and portal reverse');await scroll(end,start-100);
 await page.waitForTimeout(800);
 const video=page.video();await context.close();
 execFileSync('ffmpeg',['-v','error','-i',await video.path(),'-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart','-y',`${dir}/05-letter-anchors-m-a.mp4`]);
 console.log(`${dir}/05-letter-anchors-m-a.mp4`);
}finally{await browser.close();}
