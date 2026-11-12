/* Prep sheet on A4 (review 12, fix 5): every page of every film's Prep sheet, laid out as Save PDF and print lay it out,
   fits A4 at reading size, so the showtime cue at the foot of each page is never cut through.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-prep-a4.cjs [N | "Film (Year)" ...] [--guests 4]
   Exit 0 clean pass, 1 faults, 2 passed but some films could not be checked (listed). */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),gi=A.indexOf('--guests'),G=gi>=0?+A[gi+1]:4,rest=gi>=0?A.filter((x,i)=>i!==gi&&i!==gi+1):A;
const N=rest[0]&&/^\d+$/.test(rest[0])?+rest[0]:1e9,NAMED=rest.filter(x=>!/^\d+$/.test(x)),port=4600+Math.floor(Math.random()*200);
/* the app is ready once show() exists and a film is on screen. If app.js failed to load (a busy local server), 'current' never
   exists, so wait a minute, reload once, and say what the page reported */
const appReady=async p=>{if(!p.__err){p.__err=1;p.on('pageerror',e=>console.log('page error: '+String(e.message||e).split('\n')[0]))}
 for(let t=0;t<2;t++){try{await p.waitForFunction(()=>{try{return typeof show==='function'&&!!current}catch(e){return false}},null,{timeout:60000});return}
  catch(e){if(t)throw Error('app did not start after a reload');await p.reload({waitUntil:'domcontentloaded'})}}};
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 /* review 21: one page held all 900 films and was killed for memory part way, which left the run waiting forever. Now a fresh page
    reads 40 films at a time, says how far it has got, and a page that crashes is tried once more before its films are reported */
 const open=async()=>{const p=await ctx.newPage();p.setDefaultTimeout(600000);
  await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
  await appReady(p);return p};
 let p=await open();const all=await p.evaluate(([N,NAMED])=>NAMED.length?NAMED.filter(i=>FILMS.some(f=>f.id===i)):FILMS.map(f=>f.id).slice(0,N),[N,NAMED]);
 if(NAMED.length&&all.length<NAMED.length){console.log('FAIL: not in films.js: '+NAMED.filter(i=>!all.includes(i)).join(', '));await b.close();process.exit(1)}
 if(!all.length){console.log('FAIL: no films to check (check the film names)');await b.close();process.exit(1)}
 const r={films:0,pages:0,bad:[],skip:[]};
 for(let k=0;k<all.length;k+=40){const ids=all.slice(k,k+40);let got=null;
  let last='';for(let t=0;t<2&&!got;t++){try{if(!p||p.isClosed())p=await open();
    got=await Promise.race([p.evaluate(async ([ids,G])=>{PLAN.guests=G;
  const bad=[],skip=[];let pages=0,films=0;
  for(const id of ids){const f=FILMS.find(x=>x.id===id);if(!f)continue;try{await ensureExact(f);await show(f,true);setTab('prep')}catch(e){skip.push(id+' (menu did not open)');continue}
   await new Promise(r=>setTimeout(r,30));if(!prep||!prep.querySelector('.pp-cols')){skip.push(id+' (no Prep sheet)');continue}films++;
   const parts=prepParts();
   parts.forEach((el,k)=>{pages++;const st=document.createElement('div');st.style.cssText='position:fixed;left:-20000px;top:0;width:794px;height:1123px';
    const c=el.cloneNode(true);c.hidden=false;c.style.transform='none';prepClean(c);st.appendChild(c);document.body.appendChild(st);fitPrep(c);
    const i=c.querySelector('.mc-in'),cols=c.querySelector('.pp-cols'),over=i?i.scrollHeight-i.clientHeight:0,fs=cols?parseFloat(cols.style.fontSize)||16:16;st.remove();
    if(over>1||fs<PREP_MIN_FS)bad.push(`${id}: page ${k+1} of ${parts.length} ${over>1?'runs '+over+'px past A4':'shrinks to '+fs+'px'}`)})}
  return {films,pages,bad,skip}},[ids,G]),new Promise((_,no)=>p.once('crash',()=>no(Error('page crashed')))),
    /* page.evaluate ignores the default timeout, so a stuck batch is caught here instead of hanging the run */
    new Promise((_,no)=>setTimeout(()=>no(Error('batch timed out')),+process.env.MNS_BATCH_TIMEOUT||900000))])}
   catch(e){last=e.message.split("\n")[0];console.log(`films ${k+1} to ${k+ids.length}: ${last}`);await p?.close().catch(()=>{});p=null}}
  if(got){r.films+=got.films;r.pages+=got.pages;r.bad.push(...got.bad);r.skip.push(...got.skip)}else r.bad.push(...ids.map(i=>`${i}: not read, tried twice (${last})`));
  await p?.close().catch(()=>{});p=null;console.log(`${Math.min(k+40,all.length)} of ${all.length} read, ${r.bad.length} faults so far`)}
 console.log(`${r.films} Prep sheets, ${r.pages} A4 pages at ${G} guests`);if(r.skip.length)console.log(`${r.skip.length} not checked:\n  `+r.skip.join('\n  '));
 await b.close();if(r.bad.length){console.log('FAIL:\n  '+r.bad.join('\n  '));process.exit(1)}
 if(!r.films){console.log('FAIL: no Prep sheet was measured');process.exit(1)}
 if(r.skip.length){console.log(`PASS on the ${r.films} read, ${r.skip.length} not checked (see above)`);process.exit(2)}console.log('PASS: every Prep sheet page fits A4 at reading size');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
