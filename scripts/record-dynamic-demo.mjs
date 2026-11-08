// Real Playwright video capture. The cursor ring and captions are review-only
// overlays; glyph deformation, portals and scrolling are the running site.
import { chromium } from '@playwright/test';
import { mkdir, rename } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const output='docs/recordings/adrift-dynamics';await mkdir(output,{recursive:true});
const browser=await chromium.launch(process.env.CI?{}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
async function scroll(page,from,to,steps=80){
 for(let i=0;i<=steps;i++){await page.evaluate(y=>scrollTo(0,y),from+(to-from)*i/steps);await page.waitForTimeout(55);}
 await page.waitForTimeout(450);
}
async function record(name,label,setup,act){
 const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:'/tmp/sydney-recordings',size:{width:1440,height:900}}});
 const page=await context.newPage();await page.goto(process.env.CAPTURE_URL||'http://127.0.0.1:5173/');await page.evaluate(()=>document.fonts.ready);await setup(page);
 await page.evaluate(text=>{
  const caption=document.createElement('div');caption.textContent=text;caption.style.cssText='position:fixed;left:20px;bottom:16px;z-index:1000;padding:10px 15px;background:#171715e8;color:#fff;font:12px Arial;letter-spacing:1px;pointer-events:none;border:1px solid #ff6345';document.body.append(caption);
  const cursor=document.createElement('div');cursor.style.cssText='position:fixed;left:-100px;top:-100px;width:20px;height:20px;border:2px solid #ff6345;border-radius:50%;translate:-50% -50%;z-index:1001;pointer-events:none';document.body.append(cursor);addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';});
 },label);
 await page.waitForTimeout(500);await act(page);await page.waitForTimeout(650);
 const video=page.video();await context.close();const file=await video.path();
 execFileSync('ffmpeg',['-v','error','-i',file,'-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart','-y',`${output}/${name}.mp4`]);
 console.log(`${output}/${name}.mp4`);
}
try{
 await record('01-pointer','01 / POINTER DISTANCE + SPEED',async()=>{},async p=>{
  for(const y of [285,495]) for(let i=0;i<36;i++){await p.mouse.move(170+i*28,y+Math.sin(i*.34)*45);await p.waitForTimeout(55);}
  await p.mouse.move(1410,840);await p.waitForTimeout(1000);
 });
 await record('02-scroll-trails','02 / SCROLL-SAMPLED GLYPH TRAILS',async()=>{},p=>scroll(p,0,1000));
 await record('03-image-portal','03 / SHARED TYPOGRAPHY + IMAGE PROGRESS',p=>p.evaluate(()=>scrollTo(0,680)),p=>scroll(p,680,1500));
 await record('04-reverse','04 / REVERSE SCROLL — SAME PATH',p=>p.evaluate(()=>scrollTo(0,1300)),p=>scroll(p,1300,0));
}finally{await browser.close();}
