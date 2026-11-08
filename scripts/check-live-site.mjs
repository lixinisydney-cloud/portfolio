// Run unchanged against Vite HTTP or the deployed Pages HTTPS origin.
// Site regressions fail the job; provider/network diagnostics are reported
// separately because a third-party playback restriction is not a site pass.
import {chromium} from '@playwright/test';
import {readFile,mkdir,writeFile,appendFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const url=process.env.LIVE_SITE_URL||'http://127.0.0.1:4174/';
const output=process.env.LIVE_REPORT_DIR||'artifacts/live-check';await mkdir(output,{recursive:true});
const projects=JSON.parse(await readFile('content/projects-draft.json','utf8'));
const report={url,checkedAt:new Date().toISOString(),projects:[],externalLinks:[],youtube:[]};
const browser=await chromium.launch(process.env.CI?{}:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.setDefaultTimeout(15000);
const referers=new Map();
page.on('request',r=>{if(r.url().includes('youtube-nocookie.com/embed/'))referers.set(r.url(),r.headers().referer||null)});
try{
 const response=await page.goto(url,{waitUntil:'domcontentloaded'});assert(response.ok(),`Homepage HTTP ${response.status()}`);
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.anchorLetters==='M,A,C,S,D,U,C,G,H');
 await page.screenshot({path:`${output}/desktop.png`});
 for(const p of projects){
  await page.goto(`${url}#/projects/${p.slug}`,{waitUntil:'domcontentloaded'});
  await page.locator('#detail-title').waitFor();
  await page.waitForFunction(text=>document.querySelector('.detail-intro')?.textContent.includes(text),p.detailZh);
  assert(await page.locator('.detail-intro').innerText().then(t=>t.includes(p.detailZh)),`${p.slug}: Chinese introduction`);
  for(const image of await page.locator('.detail-gallery img').all()){
   await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());
  }
  for(const video of await page.locator('video').all()){
   await video.scrollIntoViewIfNeeded();await video.evaluate(v=>{v.muted=true;return v.play()});
   await page.waitForFunction(v=>v.readyState>=2&&v.currentTime>0,await video.elementHandle());await video.evaluate(v=>v.pause());
  }
  for(const [i,v] of p.videos.entries())if(v.kind==='youtube'){
   const iframe=page.locator('.direct-media').nth(i).locator('iframe');await iframe.scrollIntoViewIfNeeded();
   const result={project:p.slug,id:v.videoId,watch:v.url,referrerPolicy:await iframe.getAttribute('referrerpolicy')};
   try{
    const frame=await iframe.elementHandle().then(e=>e.contentFrame());
    await frame.locator('video').waitFor({timeout:7000});
    await frame.locator('video').evaluate(v=>{v.muted=true;return v.play()});
    await frame.waitForFunction(()=>document.querySelector('video')?.currentTime>0,{},{timeout:5000});
    result.status='playing';
   }catch(error){
    result.status='not-confirmed';
    const frame=await iframe.elementHandle().then(e=>e.contentFrame());
    result.message=((await frame?.locator('body').innerText({timeout:1000}).catch(()=>''))||error.message).slice(0,600);
    console.log(`::warning title=YouTube ${p.slug} ${v.videoId}::Playback not confirmed; Watch Online retained. ${result.message.replaceAll('\n',' ').replaceAll('%','%25')}`);
   }
   result.observedReferer=referers.get(await iframe.getAttribute('src'))||null;
   report.youtube.push(result);
  }
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('#detail-title').waitFor();
  report.projects.push({slug:p.slug,status:'passed',nativeVideos:p.videos.filter(v=>v.kind==='local').length});
 }
 for(const link of [...new Set(projects.flatMap(p=>p.links.map(l=>l.url)))]){
  try{const r=await page.request.get(link,{timeout:20000});report.externalLinks.push({url:link,status:r.status()});}
  catch(error){report.externalLinks.push({url:link,status:'not-confirmed',message:error.message.slice(0,200)});}
 }
 await page.setViewportSize({width:390,height:844});await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.anchorLetters);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
 await page.screenshot({path:`${output}/mobile.png`});
 report.site='passed';
}finally{
 await browser.close();await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
 if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,`## Live site verification\n\nOrigin: ${url}\n\nSite: ${report.site||'failed'}; project routes: ${report.projects.length}/9.\n\nYouTube playback confirmed: ${report.youtube.filter(x=>x.status==='playing').length}/${report.youtube.length}. See live-site-verification artifact for individual provider errors and external-link responses.\n`);
}
console.log(JSON.stringify(report,null,2));
