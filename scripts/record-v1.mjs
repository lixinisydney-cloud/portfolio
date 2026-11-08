import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const shots='docs/screenshots/v1',out='docs/recordings/adrift-dynamics';await mkdir(shots,{recursive:true});await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:'/tmp/sydney-v1-video',size:{width:1440,height:900}}});
const page=await context.newPage();
try{
 await page.goto(process.env.CAPTURE_URL||'http://127.0.0.1:4174/');await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.anchors);
 await page.screenshot({path:`${shots}/desktop.png`});
 const anchors=await page.locator('canvas').evaluate(c=>JSON.parse(c.dataset.anchors));
 for(let i=0;i<40;i++){await page.mouse.move(160+i*26,300+Math.sin(i*.3)*40);await page.waitForTimeout(35);}
 await page.mouse.move(1400,850);
 const scroll=async(from,to,steps)=>{for(let i=0;i<=steps;i++){await page.evaluate(y=>scrollTo(0,y),from+(to-from)*i/steps);await page.waitForTimeout(65);}};
 await scroll(0,anchors[0].scroll,30);
 for(let i=1;i<anchors.length;i++){await scroll(anchors[i-1].scroll,anchors[i].scroll,30);await page.waitForTimeout(250);}
 await page.locator('#contact').scrollIntoViewIfNeeded();await page.waitForTimeout(500);await page.screenshot({path:`${shots}/footer.png`});
 await page.waitForTimeout(700);await scroll(anchors.at(-1).scroll,0,180);await page.waitForTimeout(500);
 const video=page.video();await context.close();execFileSync('ffmpeg',['-v','error','-i',await video.path(),'-an','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-y',`${out}/06-v1-all-nine-anchors.mp4`]);
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await mobile.goto(process.env.CAPTURE_URL||'http://127.0.0.1:4174/');await mobile.waitForFunction(()=>document.querySelector('canvas')?.dataset.anchors);await mobile.screenshot({path:`${shots}/mobile.png`});
 const y=await mobile.locator('canvas').evaluate(c=>JSON.parse(c.dataset.anchors)[1].scroll);await mobile.evaluate(y=>scrollTo(0,y),y);await mobile.waitForTimeout(250);await mobile.screenshot({path:`${shots}/mobile-anger.png`});
 console.log('V1 recording and desktop/mobile screenshots saved.');
}finally{await browser.close();}
