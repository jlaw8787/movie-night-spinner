/* Phone text menu at 390 wide (review 13, fix 3): no tab or line wider than its box, and no sideways scroll, on every film.
   Loads the web fonts (the wide display faces are what cut "Starters" off), so it needs the network or a proxy.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-phone-fit.cjs [N | "Film (Year)" ...]
   MNS_PROXY_HTTPS=1 passes only https to the proxy and keeps local http direct.
   Exit 0 clean pass, 1 faults, 2 passed but some films could not be checked (listed). */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),N=A[0]&&/^\d+$/.test(A[0])?+A[0]:0,NAMED=A.filter(a=>!/^\d+$/.test(a)),port=4900+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 /* review 21: MNS_PROXY_HTTPS=1 sends only https through the proxy, for a proxy that Chrome still hands local http to despite the bypass */
 const HO=!!process.env.MNS_PROXY_HTTPS;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),...(PX&&!HO?{proxy:{server:PX,bypass:'127.0.0.1,localhost'}}:{}),args:['--no-sandbox',...(PX&&HO?['--proxy-server=https='+new URL(PX).host]:[])]});
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block',ignoreHTTPSErrors:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||u.protocol==='data:'?r.continue():r.abort()});
 /* review 21: one page held all 900 films and was killed for memory part way, which left the run waiting forever. Now a fresh page
    reads 40 films at a time, says how far it has got, and a page that crashes is tried once more before its films are reported */
 const open=async()=>{const p=await ctx.newPage();p.setDefaultTimeout(600000);
  await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>{try{return typeof show==='function'&&!!current}catch(e){return false}});return p};
 let p=await open();const all=await p.evaluate(([N,NAMED])=>NAMED.length?NAMED.filter(i=>FILMS.some(f=>f.id===i)):(N?FILMS.slice(0,N):FILMS).map(f=>f.id),[N,NAMED]);
 if(NAMED.length&&all.length<NAMED.length){console.log('FAIL: not in films.js: '+NAMED.filter(i=>!all.includes(i)).join(', '));await b.close();process.exit(1)}
 if(!all.length){console.log('FAIL: no films to check (check the film names)');await b.close();process.exit(1)}
 const r={n:all.length,out:[],skip:[]};
 for(let k=0;k<all.length;k+=40){const ids=all.slice(k,k+40);let got=null;
  let last='';for(let t=0;t<2&&!got;t++){try{if(!p||p.isClosed())p=await open();
    got=await Promise.race([p.evaluate(async ids=>{const out=[];const list=ids.map(i=>FILMS.find(f=>f.id===i)).filter(Boolean);
  const skip=[];for(const f of list){try{await ensureExact(f);await show(f,true)}catch(e){skip.push(f.id+' (menu did not open)');continue}await document.fonts.ready;await new Promise(r=>setTimeout(r,150));
   const ph=document.getElementById('fmtPhone');if(!ph||ph.hidden){skip.push(f.id+' (no phone menu)');continue}
   for(const t of ph.querySelectorAll('.fp-tab')){const g=document.createRange();g.selectNodeContents(t);if(g.getBoundingClientRect().width>t.clientWidth-4)out.push(`${f.id}: tab "${t.textContent.trim()}" does not fit`)}
   for(const el of ph.querySelectorAll('h1,h2,h3,h4,p,b')){if(!el.clientWidth||el.children.length>2)continue;if(el.scrollWidth>el.clientWidth+2&&getComputedStyle(el).overflowX!=='visible')out.push(`${f.id}: "${el.textContent.trim().slice(0,40)}" is cut`)}
   if(document.documentElement.scrollWidth>innerWidth+1)out.push(`${f.id}: page scrolls sideways`)}
  return {n:list.length,out,skip}},ids),new Promise((_,no)=>p.once('crash',()=>no(Error('page crashed')))),
    /* page.evaluate ignores the default timeout, so a stuck batch is caught here instead of hanging the run */
    new Promise((_,no)=>setTimeout(()=>no(Error('batch timed out')),+process.env.MNS_BATCH_TIMEOUT||900000))])}
   catch(e){last=e.message.split("\n")[0];console.log(`films ${k+1} to ${k+ids.length}: ${last}`);await p?.close().catch(()=>{});p=null}}
  if(got){r.out.push(...got.out);r.skip.push(...got.skip)}else r.out.push(...ids.map(i=>`${i}: not read, tried twice (${last})`));
  await p?.close().catch(()=>{});p=null;console.log(`${Math.min(k+40,all.length)} of ${all.length} read, ${r.out.length} faults so far`)}
 const read=r.n-r.skip.length;console.log(`${read} of ${r.n} phone menus read at 390 wide`);if(r.skip.length)console.log(`${r.skip.length} not checked:\n  `+r.skip.join('\n  '));await b.close();
 if(r.out.length){console.log('FAIL:\n  '+r.out.join('\n  '));process.exit(1)}
 if(!read){console.log('FAIL: no phone menu was measured');process.exit(1)}
 /* a skipped film was not measured, so the run is not a clean pass */
 if(r.skip.length){console.log(`PASS on the ${read} read, ${r.skip.length} not checked (see above)`);process.exit(2)}
 console.log('PASS: every phone tab and line fits');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
