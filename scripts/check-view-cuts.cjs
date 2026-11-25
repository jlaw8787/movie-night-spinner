/* Review 53: on a phone, the printed menu's views (cardFaces in app.js: whole pages, panels and reading views) never slice a line of text
   in half. For each view, any text line whose box crosses the view's top or bottom edge (inside the view's width) by more than a quarter of
   its height is listed (review 52: Anchorman's page 2 ended part way through "D3 Iced tea").
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-view-cuts.cjs [from] [count] ["Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),NUM=A.filter(a=>/^\d+$/.test(a)).map(Number),NAMED=A.filter(a=>!/^\d+$/.test(a)),port=6600+Math.floor(Math.random()*300);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const bad=await p.evaluate(async ([NUM,NAMED])=>{const L=NAMED.length?NAMED.map(i=>FILMS.find(f=>f.id===i)).filter(Boolean):NUM.length?FILMS.slice(NUM[0],NUM[0]+(NUM[1]||FILMS.length)):FILMS,out=[];
  for(const f of L){try{await ensureExact(f);await show(f,true)}catch(e){out.push(f.id+': '+e);continue}await document.fonts.ready;await new Promise(r=>setTimeout(r,500));
   let V=[];try{V=cardFaces()}catch(e){continue}if(!V||V.length<2)continue;
   const cb=card.getBoundingClientRect(),ck=cb.width/(card.offsetWidth||1)||1,rg=document.createRange();
   const lines=[];const tw=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);let t;
   while((t=tw.nextNode())){const s=t.textContent.trim();if(!s)continue;const el=t.parentElement;if(!el||el.closest('[aria-hidden=true]'))continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')continue;
    rg.selectNodeContents(t);for(const r of rg.getClientRects()){if(!r.width||!r.height)continue;lines.push({x0:(r.left-cb.left)/ck,x1:(r.right-cb.left)/ck,y0:(r.top-cb.top)/ck,y1:(r.bottom-cb.top)/ck,s})}}
   V.forEach((v,i)=>{if(!v.read&&!v.panel)return;const vx=v.x||0,vy=v.y||0,vx1=vx+v.w,vy1=vy+v.h;
    for(const l of lines){const cx=(l.x0+l.x1)/2;if(cx<vx||cx>vx1)continue;const h=l.y1-l.y0;
     for(const e of [vy,vy1]){const over=Math.min(l.y1-e,e-l.y0);if(over>h*.25)out.push(`${f.id}: view ${i+1}/${V.length} edge at ${Math.round(e)} cuts "${l.s.slice(0,40)}"`)}}})}
  return [...new Set(out)]},[NUM,NAMED]);
 console.log(bad.join('\n'));console.log(`${bad.length} cut lines`);await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
