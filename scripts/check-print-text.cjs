/* Printed menu text that the eye catches and the tone check cannot (review 14).
   On screen, after the fit passes settle: no dish name (a line with a price beside it) is hidden.
   In the Save PDF copy (renderCanvas, with html2canvas stood in for so nothing is drawn): no filled inline-block holding text blocks
   (The Warriors' station labels printed as black boxes), no clip-text lettering (Cruella's chrome heading printed as a bare bar),
   and no masked photo left for html2canvas to print with a hard edge (club).
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-print-text.cjs [N | "Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),N=A[0]&&/^\d+$/.test(A[0])?+A[0]:0,NAMED=A.filter(a=>!/^\d+$/.test(a)),port=5300+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),...(PX?{proxy:{server:PX,bypass:'127.0.0.1,localhost'}}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',ignoreHTTPSErrors:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 /* web fonts load (the fit passes depend on them); photos and the export libraries are not needed */
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async([N,NAMED])=>{const out=[];const list=NAMED.length?NAMED.map(i=>FILMS.find(f=>f.id===i)).filter(Boolean):N?FILMS.slice(0,N):FILMS;
  const price=t=>/^\s*[$£€¢]?\d{0,3}[.,]?\d{1,2}\s*(¢|c|cr|crowns?|silver|gold|[sd])?\s*$/i.test(t)&&t.trim().length<12;
  let seen=null;window.html2canvas=async clone=>{seen=clone;const c=document.createElement('canvas');c.width=c.height=2;return c};
  for(const f of list){try{await ensureExact(f);await show(f,true)}catch(e){continue}await document.fonts.ready;await new Promise(r=>setTimeout(r,1700));
   for(const e of card.querySelectorAll('*')){if(e.style.display!=='none'||!e.style.webkitLineClamp)continue;const sib=e.parentElement?[...e.parentElement.children].filter(c=>c!==e):[];
    if(sib.some(c=>price(c.textContent)))out.push(`${f.id}: dish name hidden, "${e.textContent.trim().slice(0,50)}"`)}
   const faces=[...card.querySelectorAll('.fx-face')];const srcs=faces.length?faces.map(fc=>{const el=card.cloneNode(false);el.className=card.className;const w=parseFloat(fc.style.width)||794,h=parseFloat(fc.style.height)||1123;
     el.style.cssText=`position:fixed;left:-30000px;top:0;width:${w}px;height:${h}px`;el.dataset.w=w;el.dataset.h=h;el.innerHTML=fc.innerHTML.replace(/\s(onload|onerror)="[^"]*"/g,"");document.body.appendChild(el);return el}):[card];
   const solid=c=>{const m=c&&c.match(/rgba?\(([^)]*)\)/);if(!m)return false;const q=m[1].split(/[\s,/]+/).filter(Boolean).map(Number);return q.length<4||q[3]>.05};
   for(const s of srcs){seen=null;try{await renderCanvas(s,true)}catch(e){out.push(`${f.id}: export failed, ${e}`)}if(s!==card)s.remove();if(!seen)continue;
    const st=document.createElement('div');st.style.cssText='position:fixed;left:-20000px;top:0';st.appendChild(seen);document.body.appendChild(st);
    for(const el of seen.querySelectorAll('*')){const cs=getComputedStyle(el);
     if(cs.display==='inline-block'&&el.textContent.trim()&&(solid(cs.backgroundColor)||cs.backgroundImage!=='none')&&[...el.children].some(c=>/^(block|flex|grid|table)$/.test(getComputedStyle(c).display)))out.push(`${f.id}: filled inline-block with text, "${el.textContent.trim().slice(0,40)}"`);
     if((cs.webkitBackgroundClip==='text'||cs.backgroundClip==='text')&&el.textContent.trim())out.push(`${f.id}: clip-text lettering, "${el.textContent.trim().slice(0,40)}"`);
     const mk=cs.webkitMaskImage||cs.maskImage;if(mk&&mk!=='none'&&(el.querySelector('img')||/url\(/.test(cs.backgroundImage)))out.push(`${f.id}: masked photo left for the PDF`)}
    st.remove()}}
  return {n:list.length,out:[...new Set(out)]}},[N,NAMED]);
 console.log(`${r.n} printed menus read`);if(r.out.length){console.log(r.out.join('\n'));console.log('FAIL');process.exit(1)}
 console.log('PASS: no dish name hidden, and the Save PDF copy has none of the shapes html2canvas drops');await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
