/* Phone printed menu (review 31, items 16 and 20). At 390 wide, for every film: the printed menu opens on a page or panel with a dish on it,
   and the dish names on that view are drawn at 6px or more (a portrait A4 page at phone width sits at 7 to 8, tap to zoom; review 31 found wide cards at 3). Wide pages split into panels along clear gutters (pvPanels in app.js);
   a card with no clear gutter stays whole and is listed, so it can be given gutters or a phone panel of its own.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-phone-panels.cjs [from] [count] ["Film (Year)" ...] [--json out.json] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),ji=A.indexOf('--json'),JOUT=ji>=0?A.splice(ji,2)[1]:null;
const NUM=A.filter(a=>/^\d+$/.test(a)).map(Number),NAMED=A.filter(a=>!/^\d+$/.test(a)),FROM=NUM[0]||0,COUNT=NUM[1]||1e9,port=6200+Math.floor(Math.random()*300);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(3600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async ([FROM,COUNT,NAMED])=>{
  const ids=NAMED.length?NAMED:FILMS.map(f=>f.id).slice(FROM,FROM+COUNT),out=[];
  const norm=s=>String(s||'').toLowerCase().replace(/[-‐–]/g,' ').replace(/\s+/g,' ').trim();
  for(const id of ids){const f=FILMS.find(x=>x.id===id);if(!f)continue;
   try{await ensureExact(f);await show(f,true)}catch(e){out.push({id,bad:'render'});continue}
   await new Promise(r=>setTimeout(r,40));scalePreview();
   const fs=cardFaces(),m=current.printMenu||current.menu||{},names=['s','m','w','d'].flatMap(k=>(m[k]||[]).filter(Boolean).map(x=>norm(x.label||x.n))).filter(n=>n.length>3);
   const pr=preview.getBoundingClientRect(),rg=document.createRange();let hit=0,minPx=1e9;
   for(const e of card.querySelectorAll('*'))for(const n of e.childNodes){if(n.nodeType!==3)continue;const t=norm(n.textContent);if(!names.some(x=>t===x||t.startsWith(x)))continue;
     rg.selectNodeContents(n);const r2=rg.getBoundingClientRect();if(!r2.width)continue;const cx=(r2.left+r2.right)/2,cy=(r2.top+r2.bottom)/2;
     if(cx<pr.left||cx>pr.right||cy<pr.top||cy>pr.bottom)continue;hit++;
     const tr=(card.style.transform.match(/scale\(([\d.]+)\)/)||[])[1];minPx=Math.min(minPx,parseFloat(getComputedStyle(e).fontSize)*(+tr||1))}
   const bad=[];if(!hit)bad.push('opens on a view with no dish');else if(minPx<6)bad.push(`dish names drawn at ${minPx.toFixed(1)}px`);
   if(bad.length)out.push({id,fmt:f._lib?f._lib.fmt:'own',views:fs.length,bad})}
  return out},[FROM,COUNT,NAMED]);
 for(const x of r)console.log(`${x.id} [${x.fmt}, ${x.views} views]: ${[].concat(x.bad).join('; ')}`);
 console.log(`${r.length} films with a phone menu problem`);if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(r,null,1));
 await b.close();process.exit(0)})();
