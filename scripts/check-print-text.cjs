/* Printed menu text that the eye catches and the tone check cannot (review 14).
   On screen, after the fit passes settle: no dish name (a line with a price beside it) and no dish note is hidden (review 15).
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
 /* web fonts and the TMDB photos load: the fit passes depend on both (review 16: Mad Max 2's lab poster is taller with its photo in,
    and the check passed without it while the note was hidden). MNS_PHOTOS=0 blocks the photos for a quick run. The export libraries are not needed. */
 const PHOTOS=process.env.MNS_PHOTOS!=='0';
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||(PHOTOS&&u.hostname==='image.tmdb.org')||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(7200000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async([N,NAMED])=>{const out=[];const list=NAMED.length?NAMED.map(i=>FILMS.find(f=>f.id===i)).filter(Boolean):N?FILMS.slice(0,N):FILMS;
  const price=t=>/^\s*[$£€¢]?\d{0,3}[.,]?\d{1,2}\s*(¢|c|cr|crowns?|silver|gold|[sd])?\s*$/i.test(t)&&t.trim().length<12;
  let seen=null;window.html2canvas=async clone=>{seen=clone;const c=document.createElement('canvas');c.width=c.height=2;return c};
  for(const f of list){try{await ensureExact(f);await show(f,true)}catch(e){continue}await document.fonts.ready;
   /* wait for every photo on the card to arrive or fail (up to 12 seconds), then for the fit passes that run on image load */
   {const t0=Date.now();while(Date.now()-t0<12000&&[...card.querySelectorAll('img')].some(i=>i.getAttribute('src')&&!i.complete))await new Promise(r=>setTimeout(r,150))}
   await new Promise(r=>setTimeout(r,1700));
   for(const e of card.querySelectorAll('*')){if(e.style.display!=='none'||!e.style.webkitLineClamp)continue;
    /* stadium: the title in type ([data-ltype]) is the logo's stand-in, hidden while the logo picture shows; not a dish name */
    if(e.hasAttribute('data-ltype')){const lp=e.closest('[data-lpanel]'),im=lp&&lp.querySelector('img');if(im&&im.complete&&im.naturalWidth&&im.style.display!=='none')continue}const sib=e.parentElement?[...e.parentElement.children].filter(c=>c!==e):[];
    if(sib.some(c=>price(c.textContent)))out.push(`${f.id}: dish name hidden, "${e.textContent.trim().slice(0,50)}"`)}
   /* review 15: no dish note hidden by a fit pass (campfire and canteen hid them on every film) */
   for(const e of card.querySelectorAll('*')){if(e.style.display!=='none')continue;const note=[...e.attributes].some(a=>a.name==='data-note'||a.name==='data-clamp'||a.name==='data-cnote'||/-note$/.test(a.name))||e.getAttribute('data-fit')==='note';
    if(note&&e.textContent.trim()&&!(e.parentElement&&e.parentElement.closest('[style*="display: none"]')))out.push(`${f.id}: note hidden, "${e.textContent.trim().slice(0,50)}"`)}
   /* review 17: words the film wrote that run off the bottom of their panel (The Big Lebowski's showtime cue and third house rule sat under
      the rug band) or are cut by a box that hides its overflow. Cues, side panels and footers, not only dish names and notes. */
   const cutList=()=>{const res=[];const k=card.getBoundingClientRect().width/(card.offsetWidth||1)||1,tol=4*k;
    for(const e of card.querySelectorAll('*')){if(e.closest('[aria-hidden="true"]'))continue;const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(own.length<3)continue;
     const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0||e.closest('[style*="display: none"]'))continue;
     const rg=document.createRange();rg.selectNodeContents(e);const rs=[...rg.getClientRects()].filter(r=>r.width>1&&r.height>1);if(!rs.length)continue;
     const tb={l:Math.min(...rs.map(r=>r.left)),t:Math.min(...rs.map(r=>r.top)),r:Math.max(...rs.map(r=>r.right)),b:Math.max(...rs.map(r=>r.bottom))},txt=e.textContent.trim().slice(0,50);
     /* a line's font box is taller than its line when the line height is tight: that empty ascent and descent is not ink, so a vertical cut
        only counts past it (Coneheads' "Something Sweet" heading is not cut by its 2px of spare ascent) */
     const lhp=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.2,slack=Math.max(0,(Math.max(...rs.map(r=>r.height))-lhp*k)/2);
     const pan=e.closest('.fx-panel');if(pan&&pan!==e){const pb=pan.getBoundingClientRect().bottom;if(tb.b>pb+tol+slack){res.push(`${f.id}: text runs ${Math.round((tb.b-pb)/k)}px below its panel, "${txt}"`);continue}}
     for(let a=e.parentElement;a&&a!==card.parentElement;a=a.parentElement){const ac=getComputedStyle(a);if(!/hidden|clip/.test(ac.overflow+ac.overflowX+ac.overflowY))continue;
      const ar=a.getBoundingClientRect();if(tb.t>=ar.bottom||tb.b<=ar.top||tb.l>=ar.right||tb.r<=ar.left)break;
      const cut=Math.max(ar.top-tb.t-slack,tb.b-ar.bottom-slack,ar.left-tb.l,tb.r-ar.right);if(cut>tol){res.push(`${f.id}: text cut ${Math.round(cut/k)}px by its box, "${txt}"`);break}}}return res};
   /* a layout's fit pass can still be settling when a long run reaches it: a cut is only reported if it is still there two seconds later */
   {const key=m=>m.replace(/\d+px/,'');let c1=cutList();if(c1.length){await new Promise(r=>setTimeout(r,2000));const c2=cutList(),k2=new Set(c2.map(key));out.push(...c2.filter(m=>new Set(c1.map(key)).has(key(m))))}}
   const faces=[...card.querySelectorAll('.fx-face')];const srcs=faces.length?faces.map(fc=>{const el=card.cloneNode(false);el.className=card.className;const w=parseFloat(fc.style.width)||794,h=parseFloat(fc.style.height)||1123;
     el.style.cssText=`position:fixed;left:-30000px;top:0;width:${w}px;height:${h}px`;el.dataset.w=w;el.dataset.h=h;el.innerHTML=fc.innerHTML.replace(/\s(onload|onerror)="[^"]*"/g,"");document.body.appendChild(el);return el}):[card];
   const solid=c=>{const m=c&&c.match(/rgba?\(([^)]*)\)/);if(!m)return false;const q=m[1].split(/[\s,/]+/).filter(Boolean).map(Number);return q.length<4||q[3]>.05};
   for(const s of srcs){seen=null;try{await renderCanvas(s,true)}catch(e){out.push(`${f.id}: export failed, ${e}`)}if(s!==card)s.remove();if(!seen)continue;
    const st=document.createElement('div');st.style.cssText='position:fixed;left:-20000px;top:0';st.appendChild(seen);document.body.appendChild(st);
    for(const el of seen.querySelectorAll('*')){const cs=getComputedStyle(el);
     if(/^inline-(block|flex)$/.test(cs.display)&&el.textContent.trim()&&(solid(cs.backgroundColor)||cs.backgroundImage!=='none')&&[...el.children].some(c=>/^(block|flex|grid|table)$/.test(getComputedStyle(c).display)))out.push(`${f.id}: filled ${cs.display} with text, "${el.textContent.trim().slice(0,40)}"`);
     /* review 15: html2canvas ignores line clamps, so a clamp still cutting text in the copy prints words the screen hides */
     if(!el.children.length&&cs.webkitLineClamp&&cs.webkitLineClamp!=='none'&&cs.display!=='none'&&el.scrollHeight>el.clientHeight+(parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.2)*.5)out.push(`${f.id}: clamped text the PDF would print in full, "${el.textContent.trim().slice(0,40)}"`);
     if((cs.webkitBackgroundClip==='text'||cs.backgroundClip==='text')&&el.textContent.trim())out.push(`${f.id}: clip-text lettering, "${el.textContent.trim().slice(0,40)}"`);
     const mk=cs.webkitMaskImage||cs.maskImage;if(mk&&mk!=='none'&&(el.querySelector('img')||/url\(/.test(cs.backgroundImage)))out.push(`${f.id}: masked photo left for the PDF`)}
    st.remove()}}
  return {n:list.length,out:[...new Set(out)]}},[N,NAMED]);
 console.log(`${r.n} printed menus read`);if(r.out.length){console.log(r.out.join('\n'));console.log('FAIL');process.exit(1)}
 console.log('PASS: no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops');await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
