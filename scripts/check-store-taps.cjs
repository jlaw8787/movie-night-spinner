/* Phone store: every aisle sign on the shop photo has at least 44px of tap height (checked with elementFromPoint, review 11), and a tap above the Horror sign walks to the Horror aisle.
   NODE_PATH=$(npm root -g) node scripts/check-store-taps.cjs */
const {chromium}=require('playwright');const {spawn}=require('child_process');
const R=require('path').join(__dirname,'..'),port=4713;const srv=spawn('python3',['-m','http.server',port,'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});
(async()=>{await new Promise(r=>setTimeout(r,1000));const b=await chromium.launch({executablePath:process.env.MNS_BROWSER||undefined,args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,serviceWorkers:'block'});await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
const p=await ctx.newPage();await p.goto(`http://127.0.0.1:${port}/#shop`);await p.waitForTimeout(4000);
const r=await p.evaluate(async()=>{const out=[];const pan=document.querySelector('#viewShop .sv-aisles');pan.scrollIntoView();
 for(const btn of document.querySelectorAll('#viewShop .sv-hang')){let bx=btn.getBoundingClientRect();pan.scrollLeft=Math.max(0,bx.left+pan.scrollLeft-100);await new Promise(r=>setTimeout(r,50));
  const b2=btn.getBoundingClientRect(),x=b2.left+b2.width/2;let hit=0;for(let y=Math.floor(b2.top-40);y<b2.bottom+40;y++){const e=document.elementFromPoint(x,y);if(e&&(e===btn||btn.contains(e)||(e.classList.contains('sv-hit')&&e.dataset.for===btn.dataset.go)))hit++}
  out.push(btn.dataset.go+': box '+Math.round(b2.width)+'x'+Math.round(b2.height)+', tap height '+hit)}return out.join('\n')});
console.log(r);const bad=r.split('\n').filter(l=>+l.split('tap height ')[1]<44);if(bad.length){console.error('FAIL',bad);process.exitCode=1}
// a tap on the Horror pad, above the sign, walks to Horror
const hb=await p.evaluate(()=>{const b=document.querySelector('#viewShop .sv-hang[data-go="Horror"]');const pan=document.querySelector('#viewShop .sv-aisles');pan.scrollLeft=Math.max(0,b.offsetLeft-100);const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top-12}});
await p.touchscreen.tap(hb.x,hb.y);await p.waitForTimeout(1500);{const top=await p.evaluate(()=>{const t=document.querySelector('#shopAisles .aisle[data-name="Horror"]');return t?t.getBoundingClientRect().top:9999});if(!(top>-50&&top<844)){console.error('FAIL: tap above Horror did not walk to the aisle');process.exitCode=1}else console.log('PASS: store sign taps')}
await b.close();srv.kill();process.exit(process.exitCode||0)})().catch(e=>{console.error(e);srv.kill();process.exit(1)});
