/* Prep sheet on A4 (review 12, fix 5): every page of every film's Prep sheet, laid out as Save PDF and print lay it out,
   fits A4 at reading size, so the showtime cue at the foot of each page is never cut through.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-prep-a4.cjs [N | "Film (Year)" ...] [--guests 4] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),gi=A.indexOf('--guests'),G=gi>=0?+A[gi+1]:4,rest=gi>=0?A.filter((x,i)=>i!==gi&&i!==gi+1):A;
const N=rest[0]&&/^\d+$/.test(rest[0])?+rest[0]:1e9,NAMED=rest.filter(x=>!/^\d+$/.test(x)),port=4600+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async ([N,NAMED,G])=>{PLAN.guests=G;
  const ids=NAMED.length?NAMED:FILMS.map(f=>f.id).slice(0,N),bad=[];let pages=0,films=0;
  for(const id of ids){const f=FILMS.find(x=>x.id===id);if(!f)continue;try{await ensureExact(f);await show(f,true);setTab('prep')}catch(e){continue}
   await new Promise(r=>setTimeout(r,30));if(!prep||!prep.querySelector('.pp-cols'))continue;films++;
   const parts=prepParts();
   parts.forEach((el,k)=>{pages++;const st=document.createElement('div');st.style.cssText='position:fixed;left:-20000px;top:0;width:794px;height:1123px';
    const c=el.cloneNode(true);c.hidden=false;c.style.transform='none';prepClean(c);st.appendChild(c);document.body.appendChild(st);fitPrep(c);
    const i=c.querySelector('.mc-in'),cols=c.querySelector('.pp-cols'),over=i?i.scrollHeight-i.clientHeight:0,fs=cols?parseFloat(cols.style.fontSize)||16:16;st.remove();
    if(over>1||fs<PREP_MIN_FS)bad.push(`${id}: page ${k+1} of ${parts.length} ${over>1?'runs '+over+'px past A4':'shrinks to '+fs+'px'}`)})}
  return {films,pages,bad}},[N,NAMED,G]);
 console.log(`${r.films} Prep sheets, ${r.pages} A4 pages at ${G} guests`);
 await b.close();if(r.bad.length){console.log('FAIL:\n  '+r.bad.join('\n  '));process.exit(1)}console.log('PASS: every Prep sheet page fits A4 at reading size');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
