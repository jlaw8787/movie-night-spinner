// Real browser regression for the shared modal lifecycle. Run from repo root.
// MNS_BROWSER and PLAYWRIGHT_MODULE may point to an existing Chromium / Playwright installation.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(process.env.MNS_APP_SOURCE||'app.js','utf8');
const start=source.indexOf('/* Native modal dialogs contain keyboard focus');
assert.ok(start>=0,'modal lifecycle helper present');
const end=source.indexOf("/* each film's full menu",start);assert.ok(end>start);
const helper=source.slice(start,end);
const callers=['openTrolley','openSlip','openChute','openDouble','openSyncForm','openCase','showWelcome','showOverlay'];
for(const name of callers){const m=source.match(new RegExp('(?:async )?function '+name+'\\([^]*?(?=\\n(?:async )?function \\w+\\(|$)'));assert.ok(m,name);assert.ok(m[0].includes('createElement("dialog")'),name+' uses native dialog');assert.ok(m[0].includes('mountModal(o,'),name+' mounts through lifecycle');assert.ok(!m[0].includes('document.addEventListener("keydown"'),name+' has no competing Escape handler')}
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await playwright.chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage();
 await page.setContent('<button id="trigger">Open</button><button id="background">Background action</button><style>dialog{background:white}button{padding:10px}</style>');
 await page.addScriptTag({content:helper+`\nwindow.makeTestModal=(id,trigger,html)=>{const d=document.createElement('dialog');d.id=id;d.innerHTML=html;mountModal(d,'button',trigger,()=>{window.closeLog=(window.closeLog||[]).concat(id)});return d};`});
 await page.focus('#trigger');
 await page.evaluate(()=>window.makeTestModal('parent',document.activeElement,'<button id="first">First</button><button disabled>Disabled</button><div hidden><button>Hidden</button></div><button id="nested">Shopping list</button>'));
 assert.equal(await page.locator('#parent').evaluate(e=>e.open),true);
 await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'nested','backwards wrap stays inside');
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'first','forwards wrap stays inside');
 await page.evaluate(()=>document.querySelector('#background').focus());assert.ok(await page.locator('#parent').evaluate(e=>e.contains(document.activeElement)),'native modal blocks background programmatic focus');
 await page.focus('#nested');
 await page.evaluate(()=>window.makeTestModal('child',document.activeElement,'<button id="childFirst">One</button><button id="childLast">Two</button>'));
 await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'childLast');
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'childFirst');
 await page.keyboard.press('Escape');assert.equal(await page.locator('#child').count(),0);assert.equal(await page.locator('#parent').count(),1,'Escape closes only top modal');assert.equal(await page.evaluate(()=>document.activeElement.id),'nested','restore actual nested trigger');
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);assert.equal(await page.evaluate(()=>document.activeElement.id),'trigger','restore original trigger');
 await page.evaluate(()=>{const d=window.makeTestModal('done',document.activeElement,'<button>Done</button>');dismissModal(d);dismissModal(d)});
 assert.deepEqual(await page.evaluate(()=>window.closeLog),['child','parent','done'],'completion callback runs once after button or Escape close');
 await page.evaluate(()=>{const d=window.makeTestModal('native',document.activeElement,'<button>Close</button>');d.close()});
 await page.waitForFunction(()=>!document.querySelector('#native'));assert.equal(await page.evaluate(()=>document.activeElement.id),'trigger','native close also cleans up');
 assert.equal(await page.evaluate(()=>modalStack.length),0);
 console.log('PASS native modal focus wrapping, background isolation, nested Escape, actual-trigger restoration and cleanup');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
