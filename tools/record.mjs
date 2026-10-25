// Captures the real DOM + Canvas game while the normal simulation runs at 1x.
// Only the setup is fast-forwarded; no health, damage, cooldown or loadout cheats.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
const require=createRequire(import.meta.url);let pw;try{pw=require('playwright')}catch{pw=require('C:/Users/onego/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}
const browser=await pw.chromium.launch({headless:true,...(process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});
const page=await browser.newPage({viewport:{width:1200,height:800},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://localhost:5187/?test=1');await page.waitForFunction(()=>window.__loom);
await page.evaluate(()=>{window.__loom.start(12);window.__loom.pilot(true,'storm')});
console.log('Advancing a normal seeded run to the final chapter…');
const setup=await page.evaluate(()=>window.__loom.advance(651));console.log('Setup',JSON.stringify(setup));
if(setup.state==='lost')throw Error('The genuine run failed before the recording');
await page.evaluate(()=>{document.getElementById('dismiss-tutorial').click();window.__loom.pilot(true);window.__loom.render();window.__frameTimes=[];let last=performance.now();function count(now){window.__frameTimes.push(now-last);last=now;if(window.__frameTimes.length<1800)requestAnimationFrame(count)}requestAnimationFrame(count)});
await page.waitForTimeout(400);
await fs.mkdir('tmp/capture',{recursive:true});
const started=performance.now(),frames=[],pending=[];
const cdp=await page.context().newCDPSession(page);
let lastAt=-1000;
cdp.on('Page.screencastFrame',ev=>{
  const at=performance.now()-started;
  if(at-lastAt>80&&at<32000){const n=frames.length;lastAt=at;frames.push({index:n,at});pending.push(fs.writeFile(`tmp/capture/${String(n).padStart(4,'0')}.jpg`,Buffer.from(ev.data,'base64')))}
  cdp.send('Page.screencastFrameAck',{sessionId:ev.sessionId}).catch(()=>{});
});
await cdp.send('Page.startScreencast',{format:'jpeg',quality:85,maxWidth:1200,maxHeight:800,everyNthFrame:1});
await new Promise(r=>setTimeout(r,32000));
await cdp.send('Page.stopScreencast');await Promise.all(pending);
await page.screenshot({path:'docs/boss.png'});
const ending=await page.evaluate(()=>window.__loom.snapshot());
const metrics=await page.evaluate(()=>{const a=window.__frameTimes.filter(n=>n>0&&n<500).sort((a,b)=>a-b);return{frames:a.length,medianMs:a[Math.floor(a.length*.5)],p95Ms:a[Math.floor(a.length*.95)],meanMs:a.reduce((a,b)=>a+b,0)/a.length}});
await fs.writeFile('docs/recording.json',JSON.stringify({date:new Date().toISOString(),durationMs:performance.now()-started,description:'Actual browser gameplay at normal speed, automated movement/upgrade selection, normal seeded run fast-forwarded only before recording; no stat changes.',setup,ending,metrics,frames,errors},null,2));
console.log('Recorded',JSON.stringify({frames:frames.length,ending,metrics,errors}));
// Continue the same real run to verify the ending screen, replay and defeat UI.
await page.evaluate(()=>window.__loom.advance(100));await page.waitForTimeout(700);await page.screenshot({path:'docs/ending.png'});
const final=await page.evaluate(()=>window.__loom.snapshot());if(final.state!=='won')throw Error('Final boss was not defeated');
await page.locator('#retry').click();const retry=await page.evaluate(()=>window.__loom.snapshot());if(retry.level!==1||retry.kills!==0)throw Error('Retry did not reset');
await page.evaluate(()=>{const g=window.__loom.game;g.player.inv=0;g.hurt(10000,g.player.x,g.player.y)});
// A test-triggered loss must process the event exactly as a normal loss.
await page.evaluate(()=>window.__loom.advance(0));await page.waitForTimeout(500);await page.screenshot({path:'docs/defeat.png'});
await fs.writeFile('docs/ending-qa.json',JSON.stringify({final,retry,loss:await page.evaluate(()=>window.__loom.snapshot()),errors},null,2));
await browser.close();
