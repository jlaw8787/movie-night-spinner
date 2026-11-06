/* Fact and vibe audit, step 1: what each film's menu actually says and looks like (7 Nov 2026).
   For every film (or the films named) writes audit/cards/<slug>.json with the printed card's words line by line, the phone text menu,
   the showtime cue, tagline, venue and sign, the cooked dishes, the layout, and the source fields the words come from;
   and audit/shots/<slug>-<face>.jpg, a half-size picture of each printed face (not in git, rebuild any time).
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/audit-extract.cjs [N | "Film (Year)" ...]
   Photos load through the proxy when HTTPS_PROXY is set. See docs/AUDIT.md for the whole audit. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),N=A[0]&&/^\d+$/.test(A[0])?+A[0]:0,NAMED=A.filter(a=>!/^\d+$/.test(a));
const OUT=path.join(R,'audit/cards'),SHOT=path.join(R,'audit/shots');fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(SHOT,{recursive:true});
const port=5600+Math.floor(Math.random()*200);const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
const FMT=JSON.parse(fs.readFileSync(path.join(R,'data/film-format.json'),'utf8')),FLV=JSON.parse(fs.readFileSync(path.join(R,'data/film-flavour.json'),'utf8'));
let HOUSE={};try{HOUSE=JSON.parse(fs.readFileSync(path.join(R,'data/film-house.json'),'utf8'))}catch(e){}
(async()=>{await new Promise(r=>setTimeout(r,1200));const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),...(PX?{proxy:{server:PX,bypass:'127.0.0.1,localhost'}}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',ignoreHTTPSErrors:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||u.hostname==='image.tmdb.org'||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const ids=await p.evaluate(([N,NAMED])=>(NAMED.length?NAMED:N?FILMS.slice(0,N).map(f=>f.id):FILMS.map(f=>f.id)),[N,NAMED]);
 let n=0;
 for(const id of ids){const s=slug(id);
  const d=await p.evaluate(async id=>{const f=FILMS.find(x=>x.id===id);if(!f)return null;try{await ensureExact(f);await show(f,true)}catch(e){return null}await document.fonts.ready;
   {const t0=Date.now();while(Date.now()-t0<10000&&[...card.querySelectorAll('img')].some(i=>i.getAttribute('src')&&!i.complete))await new Promise(r=>setTimeout(r,150))}
   await new Promise(r=>setTimeout(r,1200));
   const faces=[...card.querySelectorAll('.fx-face')];const src=faces.length?faces:[card];
   const lines=src.map(fc=>{const seen=new Set();return fc.innerText.split('\n').map(x=>x.replace(/\s+/g,' ').trim()).filter(x=>x.length>1&&!seen.has(x)&&seen.add(x))});
   const ph=document.getElementById('fmtPhone');let cooked=[];try{cooked=planPicked(f).filter(x=>!x.extra).map(x=>x.orig||x.n)}catch(e){}
   return {title:f.title,year:f.year,theme:f.theme,tagline:f.T||'',about:f.D||'',cue:f.P||'',faces:lines,phone:ph?ph.innerText.replace(/\n{3,}/g,'\n\n').trim():'',cooked,
    dishes:["S","M","W","K"].flatMap(k=>(f[k]||[]).map(r=>({course:k,name:r[0],note:r[1]})))}},id);
  if(!d){console.log('skip',id);continue}
  const fm=FMT[id]&&FMT[id].format;
  const rec={id,slug:s,layout:fm||'hand-built',...d,venue:FLV[id]?{venue:FLV[id].venue,sign:FLV[id].sign,note:FLV[id].note,winks:FLV[id].winks}:null,house:HOUSE[id]||null,
   sources:{dishes_and_cue:'data/films.json (S starters, M mains, W sweets, K drinks: [name, note, method, shopping]; P cue, T tagline, D about)',
    dish_notes:'data/dish-notes.json',recipes:`data/recipes2/${s}.json (cooked versions)`,venue_sign_note_winks:'data/film-flavour.json',house_lines:'data/film-house.json',
    layout:fm?`menu-formats/${fm}.js (shared layout ${fm})`:'formats.js (hand-built menu, search the film id) or movie-menus.js (editions)'}};
  fs.writeFileSync(path.join(OUT,s+'.json'),JSON.stringify(rec,null,1));
  /* a half-size picture of each face, as the screen draws it */
  const k=await p.evaluate(()=>card.querySelectorAll('.fx-face').length||1);
  for(let i=0;i<k;i++){const box=await p.evaluate(i=>{const fs=[...card.querySelectorAll('.fx-face')],fc=fs[i];let el;
     if(fc){el=card.cloneNode(false);el.className=card.className;el.style.cssText=`width:${fc.style.width};height:${fc.style.height}`;el.innerHTML=fc.innerHTML.replace(/\s(onload|onerror)="[^"]*"/g,'')}else{el=card.cloneNode(true);el.style.transform='none'}
     const st=document.createElement('div');st.id='__au';st.style.cssText=`position:fixed;left:0;top:0;z-index:2147483647;background:${STY[current.theme].mg}`;st.appendChild(el);document.body.appendChild(st);return {w:el.offsetWidth,h:el.offsetHeight}},i);
   await p.setViewportSize({width:Math.max(1440,box.w),height:Math.max(900,box.h)});await p.evaluate(()=>Promise.all([...document.querySelectorAll('#__au img')].map(i=>i.decode().catch(()=>{}))));await p.waitForTimeout(250);
   await p.screenshot({path:path.join(SHOT,`${s}-${i}.jpg`),type:'jpeg',quality:70,scale:'css',clip:{x:0,y:0,width:box.w,height:box.h}});
   await p.evaluate(()=>document.getElementById('__au').remove());await p.setViewportSize({width:1440,height:900})}
  if(++n%25===0)console.log(n,'films');}
 console.log('done',n);await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
