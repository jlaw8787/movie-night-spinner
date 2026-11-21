/* Review 34: dump what every card really prints, so word checks read the card and not the data.
   For each film: layout, printed card text (each face), the print list (dish, note, course), the phone menu text and the prep sheet text.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/dump-cards.cjs OUT.json [START COUNT | "Film (Year)" ...]
   MNS_PHOTOS=0 blocks the TMDB photos for a quick text run (fit passes run without them, so use a photo run for cut checks). */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),OUT=A.shift(),NUM=A.filter(a=>/^\d+$/.test(a)).map(Number),NAMED=A.filter(a=>!/^\d+$/.test(a)),port=5500+Math.floor(Math.random()*400);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox',...(PX?['--proxy-server=https='+PX.replace(/^https?:\/\//,'')]:[])]});
 const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',ignoreHTTPSErrors:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0');window.__mnsNoDesk=1});/* review 35: checks read the whole card, not the desktop page or half view */
 const PHOTOS=process.env.MNS_PHOTOS!=='0';
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||(PHOTOS&&u.hostname==='image.tmdb.org')||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const ids=await p.evaluate(([NUM,NAMED])=>{const L=NAMED.length?NAMED.map(i=>FILMS.find(f=>f.id===i)).filter(Boolean):NUM.length?FILMS.slice(NUM[0],NUM[0]+(NUM[1]||FILMS.length)):FILMS;return L.map(f=>f.id)},[NUM,NAMED]);
 const out={};let n=0;const t0=Date.now();
 for(const id of ids){
  const r=await p.evaluate(async id=>{const f=FILMS.find(x=>x.id===id);try{await ensureExact(f);await show(f,true)}catch(e){return {err:String(e)}}await document.fonts.ready;
   {const t0=Date.now();while(Date.now()-t0<8000&&[...card.querySelectorAll('img')].some(i=>i.getAttribute('src')&&!i.complete))await new Promise(r=>setTimeout(r,120))}
   await new Promise(r=>setTimeout(r,900));
   const vis=(e,all)=>{const out=[];const walk=n=>{if(n.nodeType===3){const t=n.textContent.replace(/\s+/g,' ').trim();if(t)out.push(t);return}if(n.nodeType!==1)return;const s=getComputedStyle(n);if(!all&&(s.display==='none'||s.visibility==='hidden'||n.getAttribute('aria-hidden')==='true'))return;if(/^(SCRIPT|STYLE)$/.test(n.tagName))return;for(const c of n.childNodes)walk(c);if(/^(DIV|P|LI|H\d|TR|BR|SECTION|ARTICLE|HEADER|FOOTER|TD|TH|DT|DD)$/.test(n.tagName)||s.display==='block'||s.display==='flex'||s.display==='grid')out.push('\n')};walk(e);return out.join(' ').replace(/ *\n[ \n]*/g,'\n').replace(/ ([,.;:!?])(?=\s|$)/g,'$1').trim()};/* review 36: inline spans joined with a space printed "$8.25 , with" in the dump only */
   const faces=[...card.querySelectorAll(':scope > *')].map(vis).filter(Boolean);
   const pm=current.printMenu||null,list=[];
   if(pm)for(const k of ['s','m','w','d'])for(const it of (pm[k]||[]))if(it&&it.n)list.push({c:k,n:it.n,note:it.note||'',d:it.d||it.desc||'',house:!!it.house,extra:!!it.extra});
   const fl=f._lib||null;
   return {fmt:fl?fl.fmt:(fmtSpec(f)||{}).fmt||'card',faces,list,phone:vis(fmtPhone,1),prep:vis(prep,1),cue:f.P||'',venue:fl&&fl.flavour&&fl.flavour.venue||''}},id);
  out[id]=r;n++;if(n%25===0)process.stderr.write(`${n}/${ids.length} ${Math.round((Date.now()-t0)/1000)}s\n`);
 }
 fs.writeFileSync(OUT,JSON.stringify(out));await b.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
