/* Review 53: the desktop full size view (openMenuZoom in app.js) at 1280x800. Every page is turned; each line of printed text must land
   whole on at least one page at 12px or more (review 52 found the pub sign split across Left side and Right side, and hospital, prom,
   food court, dim sum and kiosk side panels only ever at 5.6 to 9.9px).
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-fullsize.cjs [from] [count] ["Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),NUM=A.filter(a=>/^\d+$/.test(a)).map(Number),NAMED=A.filter(a=>!/^\d+$/.test(a)),port=6900+Math.floor(Math.random()*300);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:800},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const ids=await p.evaluate(([NUM,NAMED])=>(NAMED.length?NAMED:NUM.length?FILMS.slice(NUM[0],NUM[0]+(NUM[1]||FILMS.length)).map(f=>f.id):FILMS.map(f=>f.id)),[NUM,NAMED]);
 const bad=[];let n=0;
 for(const id of ids){
  const r=await p.evaluate(async id=>{const f=FILMS.find(x=>x.id===id);try{await ensureExact(f);await show(f,true)}catch(e){return ['load '+e]}await document.fonts.ready;await new Promise(r=>setTimeout(r,600));
   if(typeof openMenuZoom!=='function')return ['no zoom'];openMenuZoom();await new Promise(r=>setTimeout(r,300));const o=document.querySelector('dialog.mzoom');if(!o)return [];
   const best=new Map(),rg=document.createRange();const nx=o.querySelector('.mz-next');let guard=0;
   const measure=()=>{const sh=o.querySelector('.mz-sheet').getBoundingClientRect();const tw=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);let t;
     while((t=tw.nextNode())){const s=t.textContent.trim();if(!s||s.length<2)continue;const el=t.parentElement;if(!el||el.closest('[aria-hidden=true]'))continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)continue;
      rg.selectNodeContents(t);const rs=[...rg.getClientRects()].filter(r=>r.width&&r.height);if(!rs.length)continue;
      const whole=rs.every(r=>r.left>=sh.left-1&&r.right<=sh.right+1&&r.top>=sh.top-1&&r.bottom<=sh.bottom+1);
      const k=card.getBoundingClientRect().width/(card.offsetWidth||1),px=parseFloat(cs.fontSize)*k;const key=s.slice(0,60);const prev=best.get(key)||0;if(whole&&px>prev)best.set(key,px);else if(!best.has(key))best.set(key,0)}};
   measure();while(nx&&!nx.disabled&&guard++<20){nx.click();await new Promise(r=>setTimeout(r,120));measure()}
   o.querySelector('.mz-fit');try{dismissModal(o)}catch(e){o.close();o.remove()}await new Promise(r=>setTimeout(r,150));
   return [...best].filter(([s,px])=>px<12).map(([s,px])=>`"${s}" ${px?px.toFixed(1)+'px':'never whole'}`)},id);
  if(r.length)bad.push(id+': '+r.slice(0,8).join(' | ')+(r.length>8?` (+${r.length-8})`:''));
  if(++n%50===0)process.stderr.write(`${n}/${ids.length}\n`)}
 console.log(bad.join('\n'));console.log(`${bad.length} films with text that never reads whole at 12px`);await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
