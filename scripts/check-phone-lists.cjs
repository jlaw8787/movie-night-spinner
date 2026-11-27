/* Phone list swipes (26 to 27 Nov): for each film at 390x844, which full-width lists get a list swipe (pvReadViews' listViews in app.js)
   and which are refused, and by which check (faint, cut, overlap, squeezed, pictures, thin, noanc = no block to copy). It serves app.js
   with logging lines patched in, so the repo code is untouched; if a patch line stops matching, update P below. TMDB images load, as on
   a phone (without them some cards lay out differently). Timing noise: a film's result can flip with run order (Kingsman, Hot Fuzz), on
   main too. APPJS=/path/app.js compares another version (git show main:app.js > /tmp/a.js).
     NODE_PATH=$(npm root -g) node scripts/check-phone-lists.cjs . [from] [count] out.json ["Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const fs=require('fs'),path=require('path');
const [REPO,FROM0,COUNT0,OUT,...NAMED]=process.argv.slice(2);const FROM=+FROM0||0,COUNT=+COUNT0||1e9,port=6600+Math.floor(Math.random()*300);
const P=[
 ['if(bad){w.remove();','if(bad){window.__pvR&&__pvR.push({r:bad,t:w.textContent.replace(/\\s+/g," ").trim().slice(0,70)});w.remove();'],
 ['const listViews=L=>{try{const A=flowAnc(L);if(!A)return null;','const listViews=L=>{try{const A=flowAnc(L);if(!A){window.__pvR&&__pvR.push({r:"noanc",t:L.slice(0,5).map(b=>String(b[5]).trim()).join(" | ").slice(0,70)});return null}'],
 ['return R}catch(e){return null}};','return R}catch(e){window.__pvR&&__pvR.push({r:"err:"+e.message});return null}};'],
 ['const LV=listViews(L);if(LV){','const LV=listViews(L);if(LV){window.__pvR&&__pvR.push({r:"ok",n:LV.length});'],
 ['catch(e){out=base}if(!swipeW())out=pvCover(out)','catch(e){window.__pvR&&__pvR.push({r:"RVERR "+String(e.stack).slice(0,300)});out=base}if(!swipeW())out=pvCover(out)'],
 ['flowAnc(L)))continue;wideRow=1;','flowAnc(L)))continue;if(listOn&&x1-x0+28>=.75*v.w)window.__pvR&&__pvR.push({r:"wide-noanc",t:L.slice(0,5).map(b=>String(b[5]).trim()).join(" | ").slice(0,70)});wideRow=1;'],
];
let src=fs.readFileSync(process.env.APPJS||path.join(REPO,'app.js'),'utf8');for(const [a,b] of P){if(src.split(a).length!==2)throw new Error('patch miss: '+a);src=src.replace(a,b)}
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:REPO,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({executablePath:process.env.MNS_BROWSER||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='127.0.0.1'&&u.pathname==='/app.js')return r.fulfill({body:src,contentType:'application/javascript'});return u.hostname==='127.0.0.1'||u.hostname==='image.tmdb.org'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(3600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const ids=await p.evaluate(([F,C,N])=>N.length?N:FILMS.map(f=>f.id).slice(F,F+C),[FROM,COUNT,NAMED]);const out=[];
 for(const id of ids){let r;
  try{r=await p.evaluate(async id=>{const f=FILMS.find(x=>x.id===id);if(!f)return null;await ensureExact(f);await show(f,true);
    if(typeof tab!=='undefined'&&tab!=='menu'&&typeof setTab==='function')try{setTab('menu')}catch(e){}
    await document.fonts.ready;await Promise.race([Promise.all([...card.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r}))),new Promise(r=>setTimeout(r,4000))]);await new Promise(r=>setTimeout(r,250));scalePreview();await new Promise(r=>setTimeout(r,60));
    window.__pvR=[];card._pvr=null;const V=cardFaces();const R=window.__pvR;window.__pvR=null;
    return {id,fmt:f._lib?f._lib.fmt:'own',cls:card.className,views:V.length,lists:V.filter(v=>v.list).length,log:R}},id)}catch(e){r={id,err:String(e).slice(0,120)}}
  if(r)out.push(r)}
 fs.writeFileSync(OUT,JSON.stringify(out));console.log('done',out.length);await b.close();process.exit(0)})();
