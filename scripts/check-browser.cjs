/* Functional regression only. External images/fonts are blocked, so these checks do not measure visual quality or performance. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {spawn}=require('child_process');
const fs=require('fs'),path=require('path'),http=require('http');
const REPO=path.resolve(__dirname,'..');
const ORIGIN='http://127.0.0.1:4184';
const OUTPUT=process.env.REGRESSION_PROOF||path.join(require('os').tmpdir(),'movie-night-browser-regression.json');
const report={scope:'Functional browser checks only; external fonts/images blocked. No visual or performance grade.',started:new Date().toISOString(),viewports:[],unexpectedExternalWrites:0};
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const server=spawn('python3',['-m','http.server','4184','--bind','127.0.0.1'],{cwd:REPO,stdio:'ignore'});
let browser;
process.on('exit',()=>server.kill());
async function serverReady(){for(let i=0;i<60;i++){const ok=await new Promise(resolve=>{const r=http.get(ORIGIN+'/index.html',res=>{res.resume();resolve(res.statusCode===200)});r.on('error',()=>resolve(false));r.setTimeout(300,()=>{r.destroy();resolve(false)})});if(ok)return;await new Promise(r=>setTimeout(r,50))}throw Error('Local regression server did not start')}
async function assertFocused(locator,message){assert(await locator.evaluate(el=>document.activeElement===el),message)}
async function trap(page,modal){
  const tabbables=modal.locator('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])');
  const valid=[];for(let i=0;i<await tabbables.count();i++){const item=tabbables.nth(i);if(await item.isVisible())valid.push(item)}
  assert(valid.length>0,'Dialog has no visible controls');
  await valid[valid.length-1].focus();await page.keyboard.press('Tab');
  assert(await modal.evaluate(el=>el.contains(document.activeElement)),'Tab escaped the top dialog');
  await assertFocused(valid[0],'Tab did not wrap to first dialog control');
  await valid[0].focus();await page.keyboard.press('Shift+Tab');
  assert(await modal.evaluate(el=>el.contains(document.activeElement)),'Shift+Tab escaped the top dialog');
  await assertFocused(valid[valid.length-1],'Shift+Tab did not wrap to last dialog control');
  for(let i=0;i<valid.length+2;i++){await page.keyboard.press('Tab');assert(await modal.evaluate(el=>el.contains(document.activeElement)),'Sequential Tab left the top dialog')}
  return valid.length;
}
async function closeAll(page){for(let i=0;i<6;i++){if(!await page.locator('[role="dialog"]').count())break;await page.keyboard.press('Escape')} }
(async()=>{
 await serverReady();
 browser=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),headless:true,args:['--no-sandbox']});
 for(const width of [390,1280]){
  const result={width,height:950,checks:[]};report.viewports.push(result);
  const context=await browser.newContext({viewport:{width,height:950},serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',route=>{const request=route.request(),url=new URL(request.url());if(url.origin===ORIGIN||url.protocol==='data:')return route.continue();if(!['GET','HEAD'].includes(request.method()))report.unexpectedExternalWrites++;return route.abort()});
  await context.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-view','wheel');localStorage.setItem('mns-sound','0');window.__regressionClipboard=[];Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__regressionClipboard.push(text)}}})});
  const page=await context.newPage();page.setDefaultTimeout(12000);
  await page.goto(ORIGIN+'/?film='+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof openTrolley==='function'&&typeof current!=='undefined'&&current&&current.id==='Home Alone (1990)');
  async function check(name,fn){try{const details=await fn();result.checks.push({name,pass:true,...details});console.log(width,name,'PASS')}catch(err){result.checks.push({name,pass:false,error:err.message});console.log(width,name,'FAIL',err.message);await closeAll(page).catch(()=>{})}}
  await check('welcome keyboard containment, Escape, trigger restore',async()=>{const trigger=page.locator('#howBtn');await trigger.click();const modal=page.locator('.welcome[role="dialog"]');await modal.waitFor({state:'visible'});if(process.env.REGRESSION_SCREENSHOTS_DIR){fs.mkdirSync(process.env.REGRESSION_SCREENSHOTS_DIR,{recursive:true});await modal.screenshot({path:path.join(process.env.REGRESSION_SCREENSHOTS_DIR,'welcome-'+width+'.png')})}const controls=await trap(page,modal);await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});await assertFocused(trigger,'Welcome did not restore How it works focus');assert(await page.evaluate(()=>localStorage.getItem('mns-welcome'))==='1','Welcome dismissal not saved');return{controls}});
  await check('welcome button dismissal and repeated cleanup',async()=>{const trigger=page.locator('#howBtn');for(let i=0;i<2;i++){await trigger.click();const modal=page.locator('.welcome[role="dialog"]');await modal.locator('button').click();await modal.waitFor({state:'detached'});await assertFocused(trigger,'Welcome button did not restore trigger focus')}return{reopens:2}});
  await check('unlocked shopping ticks, remaining-item share, reset',async()=>{
   await page.locator('#weekSet').focus();await page.evaluate(()=>openTrolley(current));const modal=page.locator('.trolley[role="dialog"]').last();await modal.waitFor({state:'visible'});const items=modal.locator('input[type="checkbox"][data-k]'),total=await items.count();assert(total>2,'Shopping list missing items');const checkedKey=await items.first().getAttribute('data-k'),remainingKey=await items.nth(1).getAttribute('data-k');await items.first().check();assert((await modal.locator('#tProg').innerText()).startsWith('1 of '+total),'Unlocked shopping progress did not increment');await modal.locator('[data-a="share"]').click();await page.waitForFunction(()=>window.__regressionClipboard.length>0);const text=await page.evaluate(()=>window.__regressionClipboard.at(-1));assert(!text.split('\n').includes('- '+checkedKey),'Shared list includes the checked item');assert(text.split('\n').includes('- '+remainingKey),'Shared list omitted an unchecked item');await modal.locator('[data-a="reset"]').click();assert(await modal.locator('input:checked').count()===0,'Reset left an unlocked item checked');assert((await modal.locator('#tProg').innerText()).startsWith('0 of '+total),'Unlocked reset progress incorrect');await trap(page,modal);await modal.locator('[data-a="done"]').click();await modal.waitFor({state:'detached'});await assertFocused(page.locator('#weekSet'),'Shopping did not restore original focused control');return{total,entry:'Actual openTrolley(current) function; no unlocked shopping UI trigger exists'};
  });
  await check('locked shopping persists on close, reopen and reload',async()=>{
   await page.locator('#weekSet').click();await page.locator('#weekShop').click();let modal=page.locator('.trolley[role="dialog"]').last();const item=modal.locator('input[data-k]').first();const key=await item.getAttribute('data-k');await item.check();await modal.locator('[data-a="done"]').click();await page.locator('#weekShop').click();modal=page.locator('.trolley[role="dialog"]').last();assert(await modal.locator('input[data-k]').first().isChecked(),'Locked item lost after close/reopen');assert((await modal.locator('#tProg').innerText()).startsWith('1 of '),'Locked progress lost after reopen');await modal.locator('[data-a="done"]').click();await page.reload({waitUntil:'domcontentloaded'});await page.locator('#weekShop').click();modal=page.locator('.trolley[role="dialog"]').last();assert(await modal.locator('input[data-k]').first().isChecked(),'Locked item lost after reload');const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mns-week')));assert(saved.ticks[key]===true,'Tick absent from saved week');await modal.locator('[data-a="reset"]').click();assert(await modal.locator('input:checked').count()===0,'Locked reset failed');await modal.locator('[data-a="done"]').click();await assertFocused(page.locator('#weekShop'),'Locked shopping did not restore week trigger');return{persistedAcrossReload:true};
  });
  await check('rental dialog keyboard containment and shelf trigger restore',async()=>{
   await page.locator('#viewShopBtn').click();await page.locator('#shopSearch').fill('Home Alone');const trigger=page.locator('#shopAisles .tape[data-id="Home Alone (1990)"]').first();await trigger.click();const caseModal=page.locator('.counter[role="dialog"]').last();await caseModal.locator('.rent').click();const modal=page.locator('.counter[role="dialog"]').last();await modal.locator('.slip').waitFor({state:'visible'});const controls=await trap(page,modal);await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});await assertFocused(trigger,'Rental Escape did not restore shelf trigger');await trigger.click();await page.locator('.counter .rent').click();const again=page.locator('.counter[role="dialog"]').last();await again.locator('[data-a="back"]').click();await again.waitFor({state:'detached'});await assertFocused(trigger,'Rental Put it back did not restore shelf trigger');return{controls,rentalConfirmed:false};
  });
  await check('nested double feature shopping closes only top dialog and restores both triggers',async()=>{
   await page.locator('#viewWheelBtn').click();const trigger=page.locator('#dfBtn');await trigger.click();const parent=page.locator('.trolley[aria-label="Double feature"]');await parent.waitFor({state:'visible'});await trap(page,parent);const shoppingTrigger=parent.locator('[data-a="shop"]');await shoppingTrigger.click();const child=page.locator('.trolley[role="dialog"]').filter({has:page.locator('#tProg')});await child.waitFor({state:'visible'});assert(await parent.count()===1,'Opening shopping removed the double feature');await trap(page,child);await page.keyboard.press('Escape');await child.waitFor({state:'detached'});assert(await parent.count()===1,'Escape closed parent as well as child');await assertFocused(shoppingTrigger,'Child dismissal did not restore parent Shopping list focus');await trap(page,parent);await page.keyboard.press('Escape');await parent.waitFor({state:'detached'});await assertFocused(trigger,'Parent dismissal did not restore Double feature trigger');return{nestedEscapeLevels:2};
  });
  await context.close();
 }
 report.finished=new Date().toISOString();report.pass=report.viewports.every(v=>v.checks.every(c=>c.pass))&&report.unexpectedExternalWrites===0;
 fs.writeFileSync(OUTPUT,JSON.stringify(report,null,2)+'\n');console.log('Proof:',OUTPUT);if(!report.pass)process.exitCode=1;
})().catch(err=>{report.fatal=err.message;report.pass=false;fs.writeFileSync(OUTPUT,JSON.stringify(report,null,2)+'\n');console.error(err.message);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.kill()});
