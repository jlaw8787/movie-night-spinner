/* Phone text menu at 390 wide (review 13, fix 3): no tab or line wider than its box, and no sideways scroll, on every film.
   Loads the web fonts (the wide display faces are what cut "Starters" off), so it needs the network or a proxy.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-phone-fit.cjs [N | "Film (Year)" ...]
   MNS_PROXY_HTTPS=1 passes only https to the proxy and keeps local http direct. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),N=A[0]&&/^\d+$/.test(A[0])?+A[0]:0,NAMED=A.filter(a=>!/^\d+$/.test(a)),port=4900+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 /* review 21: MNS_PROXY_HTTPS=1 sends only https through the proxy, for a proxy that Chrome still hands local http to despite the bypass */
 const HO=!!process.env.MNS_PROXY_HTTPS;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),...(PX&&!HO?{proxy:{server:PX,bypass:'127.0.0.1,localhost'}}:{}),args:['--no-sandbox',...(PX&&HO?['--proxy-server=https='+PX.replace('http://','')]:[])]});
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block',ignoreHTTPSErrors:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async([N,NAMED])=>{const out=[];const list=NAMED.length?NAMED.map(i=>FILMS.find(f=>f.id===i)).filter(Boolean):N?FILMS.slice(0,N):FILMS;
  for(const f of list){try{await ensureExact(f);await show(f,true)}catch(e){continue}await document.fonts.ready;await new Promise(r=>setTimeout(r,150));
   const ph=document.getElementById('fmtPhone');if(!ph||ph.hidden)continue;
   for(const t of ph.querySelectorAll('.fp-tab')){const g=document.createRange();g.selectNodeContents(t);if(g.getBoundingClientRect().width>t.clientWidth-4)out.push(`${f.id}: tab "${t.textContent.trim()}" does not fit`)}
   for(const el of ph.querySelectorAll('h1,h2,h3,h4,p,b')){if(!el.clientWidth||el.children.length>2)continue;if(el.scrollWidth>el.clientWidth+2&&getComputedStyle(el).overflowX!=='visible')out.push(`${f.id}: "${el.textContent.trim().slice(0,40)}" is cut`)}
   if(document.documentElement.scrollWidth>innerWidth+1)out.push(`${f.id}: page scrolls sideways`)}
  return {n:list.length,out}},[N,NAMED]);
 console.log(`${r.n} phone menus read at 390 wide`);await b.close();
 if(r.out.length){console.log('FAIL:\n  '+r.out.join('\n  '));process.exit(1)}console.log('PASS: every phone tab and line fits');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
