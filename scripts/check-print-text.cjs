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
     /* where the letters' ink really is: the browser's own measure of the text in its font (Oleo Script's font box runs 6px past its letters,
        a "p" or "J" reaches below the baseline), from the first line's baseline up and the last line's baseline down */
     const ink=(()=>{const cx=(window.__inkCx=window.__inkCx||document.createElement('canvas').getContext('2d'));cx.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      /* the descenders that matter are the last line's: its characters are found by walking back from the end while they sit on that line */
      const lastTxt=(()=>{const tn=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());let out='',top=null;
       for(let ni=tn.length-1;ni>=0;ni--){const t=tn[ni].textContent;for(let ci=t.length-1;ci>=0;ci--){if(/\s/.test(t[ci])){out=t[ci]+out;continue}const rg=document.createRange();rg.setStart(tn[ni],ci);rg.setEnd(tn[ni],ci+1);
        const r=rg.getClientRects()[0];if(!r)continue;if(top===null)top=r.top;else if(Math.abs(r.top-top)>2)return out.trim();out=t[ci]+out}}return out.trim()})()||own;
      const tt0=cs.textTransform==='uppercase'?own.toUpperCase():cs.textTransform==='lowercase'?own.toLowerCase():own,lt=cs.textTransform==='uppercase'?lastTxt.toUpperCase():lastTxt,m0=cx.measureText(tt0),m1=cx.measureText(lt);
      const m={fontBoundingBoxAscent:m0.fontBoundingBoxAscent,fontBoundingBoxDescent:m0.fontBoundingBoxDescent,actualBoundingBoxAscent:m0.actualBoundingBoxAscent,actualBoundingBoxDescent:rs.length>1?m1.actualBoundingBoxDescent:m0.actualBoundingBoxDescent},fa=m.fontBoundingBoxAscent,fd=m.fontBoundingBoxDescent,fh=fa+fd;
      const top=Math.min(...rs.map(r=>r.top)),bot=Math.max(...rs.map(r=>r.bottom)),h0=rs[0].height,pad0=(h0-fh*k)/2;
      const one=rs.length===1;return {t:top+pad0+(fa-m.actualBoundingBoxAscent)*k,b:bot-pad0-(fd-m.actualBoundingBoxDescent)*k,
       l:one?rs[0].left-m0.actualBoundingBoxLeft*k:tb.l,r:one?rs[0].left+m0.actualBoundingBoxRight*k:tb.r}})();
     const pan=e.closest('.fx-panel');if(pan&&pan!==e){const pb=pan.getBoundingClientRect().bottom;if(tb.b>pb+tol+slack){res.push(`${f.id}: text runs ${Math.round((tb.b-pb)/k)}px below its panel, "${txt}"`);continue}}
     for(let a=e;a&&a!==card.parentElement;a=a.parentElement){const ac=getComputedStyle(a);if(!/hidden|clip/.test(ac.overflow+ac.overflowX+ac.overflowY))continue;
      const ar=a.getBoundingClientRect();if(tb.t>=ar.bottom||tb.b<=ar.top||tb.l>=ar.right||tb.r<=ar.left)break;
      /* review 18: a clipping box cuts a descender at 2 to 3px (Nightmare 3's badge "Hospital"): the bottom edge counts from the descenders' ink
         (the font box less 0.08em), not past the line's empty descent, and the limit is tighter than a panel's edge */
      /* sideways, both the letters' advance and their ink must run past the box: a price's overshoot alone (Speed's 3.95) is not a cut */
      const cut=Math.max(ar.top-ink.t,ink.b-ar.bottom,Math.min(ar.left-ink.l,ar.left-tb.l),Math.min(ink.r-ar.right,tb.r-ar.right));if(cut>1.5*k){res.push(`${f.id}: text cut ${Math.round(cut/k)}px by its box, "${txt}"`);break}}}return res};
   /* review 18: words running into other words (Money Train's photo caption wrapped onto the footer line), not only out of their panel.
      Each line box of text is compared with every other element's; a stamp or label laid over a line on purpose carries aria-hidden or is rotated */
   const overList=()=>{const res=[],k=card.getBoundingClientRect().width/(card.offsetWidth||1)||1,boxes=[];
    for(const e of card.querySelectorAll('*')){if(e.closest('[aria-hidden="true"]'))continue;const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(own.length<3)continue;
     const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity<.2||e.closest('[style*="display: none"]'))continue;
     let rot=false;for(let a=e;a&&a!==card;a=a.parentElement){const t=getComputedStyle(a).transform;if(t&&t!=='none'&&!/^matrix\(1, 0, 0, 1,/.test(t)&&!/^matrix\([\d.]+, 0, 0, [\d.]+,/.test(t)){rot=true;break}}if(rot)continue;
     const rs=[];for(const n of e.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);rs.push(...[...rg.getClientRects()].filter(r=>r.width>2&&r.height>2))}
     const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.2,fz=parseFloat(cs.fontSize);
     /* the ink of a line is about its font size tall, centred in the line box; display type (24px and up) about 0.7 of it, since stacked headings
        set tight on purpose ("My Cousin" over "Vinny", "No Rats" over its strapline) touch only at the descenders and are not faults */
     for(const r of rs){const ink=Math.min(r.height,fz*(fz>=24?.7:1)*k),pad=(r.height-ink)/2;boxes.push({e,l:r.left,r:r.right,t:r.top+pad,b:r.bottom-pad,txt:own.slice(0,40)})}}
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(a.e===b.e||a.e.contains(b.e)||b.e.contains(a.e))continue;
     const ox=Math.min(a.r,b.r)-Math.max(a.l,b.l),oy=Math.min(a.b,b.b)-Math.max(a.t,b.t);if(ox>3*k&&oy>3*k)res.push(`${f.id}: text runs into other text, "${a.txt}" over "${b.txt}"`)}
    return [...new Set(res)]};
   /* review 19: a price pushed past the right edge of its column by a long dish name (Home Alone 2's "4.50" beside "Hot apple sparkling apple juice") */
   const priceOut=()=>{const res=[],k=card.getBoundingClientRect().width/(card.offsetWidth||1)||1;for(const e of card.querySelectorAll('*')){if(e.children.length||!price(e.textContent)||!/\d/.test(e.textContent))continue;
     const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||e.closest('[style*="display: none"]')||e.closest('[aria-hidden="true"]'))continue;const p=e.parentElement;if(!p)continue;
     const pc=getComputedStyle(p);if(!/flex|grid|block/.test(pc.display))continue;const rg=document.createRange();rg.selectNodeContents(e);const rs=[...rg.getClientRects()].filter(r=>r.width>1);if(!rs.length)continue;
     const pr=p.getBoundingClientRect(),edge=pr.right-(parseFloat(pc.paddingRight)+parseFloat(pc.borderRightWidth))*k,over=Math.max(...rs.map(r=>r.right))-edge;
     if(over>2*k)res.push(`${f.id}: price runs ${Math.round(over/k)}px past its column, "${e.textContent.trim()}" beside "${p.textContent.replace(e.textContent,'').trim().slice(0,40)}"`)}return res};
   {const p1=priceOut();if(p1.length){await new Promise(r=>setTimeout(r,2000));const p2=new Set(priceOut().map(m=>m.replace(/\d+px/,'')));out.push(...p1.filter(m=>p2.has(m.replace(/\d+px/,''))))}}
   {const o1=overList();if(o1.length){await new Promise(r=>setTimeout(r,2000));const o2=new Set(overList());out.push(...o1.filter(m=>o2.has(m)))}}
   /* a layout's fit pass can still be settling when a long run reaches it: a cut is only reported if it is still there two seconds later */
   {const key=m=>m.replace(/\d+px/,'');let c1=cutList();if(c1.length){await new Promise(r=>setTimeout(r,2000));const c2=cutList(),k2=new Set(c2.map(key));out.push(...c2.filter(m=>new Set(c1.map(key)).has(key(m))))}}
   const faces=[...card.querySelectorAll('.fx-face')];const srcs=faces.length?faces.map(fc=>{const el=card.cloneNode(false);el.className=card.className;const w=parseFloat(fc.style.width)||794,h=parseFloat(fc.style.height)||1123;
     el.style.cssText=`position:fixed;left:-30000px;top:0;width:${w}px;height:${h}px`;el.dataset.w=w;el.dataset.h=h;el.innerHTML=fc.innerHTML.replace(/\s(onload|onerror)="[^"]*"/g,"");document.body.appendChild(el);return el}):[card];
   const solid=c=>{const m=c&&c.match(/rgba?\(([^)]*)\)/);if(!m)return false;const q=m[1].split(/[\s,/]+/).filter(Boolean).map(Number);return q.length<4||q[3]>.05};
   /* review 18: words on the card that never reach the Save PDF copy (club's "On stage tonight" tag was wiped with the masked photo it sat on).
      Every visible run of text on the face must still be visible somewhere in the copy html2canvas is handed. */
   const norm=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'');
   const visTexts=root=>{const o=[];for(const e of root.querySelectorAll('*')){if(e.closest('[aria-hidden="true"]'))continue;const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();if(own.length<3)continue;
     const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0||e.closest('[style*="display: none"]'))continue;const n=norm(own);if(n.length>=3)o.push([n,own.slice(0,50)])}return o};
   /* review 19: Coming to America's rounded card printed on a white border, so its navy frame came out in the edge colour with white corners.
      A card whose outer corners are rounded must print on the surround the screen shows */
   const wall=!faces.length&&card.classList.contains('fmt')?[...card.children].find(c=>!c.classList.contains('fx-back')&&getComputedStyle(c).display!=='none'):null,
    surround=wall&&parseFloat(getComputedStyle(wall).borderTopLeftRadius)>=8?getComputedStyle(card).backgroundColor:null;
   for(const s of srcs){seen=null;const want=visTexts(s);try{await renderCanvas(s,true)}catch(e){out.push(`${f.id}: export failed, ${e}`)}if(s!==card)s.remove();if(!seen)continue;
    const st=document.createElement('div');st.style.cssText='position:fixed;left:-20000px;top:0';st.appendChild(seen);document.body.appendChild(st);
    if(surround&&s===card){const bg=getComputedStyle(seen).backgroundColor;if(bg!==surround)out.push(`${f.id}: rounded card prints on ${bg}, not the screen's surround ${surround}`)}
    {const got=visTexts(seen).map(x=>x[0]).join('|');for(const [n,t] of want)if(!got.includes(n))out.push(`${f.id}: text missing from the Save PDF copy, "${t}"`)}
    for(const el of seen.querySelectorAll('*')){const cs=getComputedStyle(el);
     if(/^inline-(block|flex)$/.test(cs.display)&&el.textContent.trim()&&(solid(cs.backgroundColor)||cs.backgroundImage!=='none')&&[...el.children].some(c=>/^(block|flex|grid|table)$/.test(getComputedStyle(c).display)))out.push(`${f.id}: filled ${cs.display} with text, "${el.textContent.trim().slice(0,40)}"`);
     /* review 15: html2canvas ignores line clamps, so a clamp still cutting text in the copy prints words the screen hides */
     if(!el.children.length&&cs.webkitLineClamp&&cs.webkitLineClamp!=='none'&&cs.display!=='none'&&el.scrollHeight>el.clientHeight+(parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.2)*.5)out.push(`${f.id}: clamped text the PDF would print in full, "${el.textContent.trim().slice(0,40)}"`);
     if((cs.webkitBackgroundClip==='text'||cs.backgroundClip==='text')&&el.textContent.trim())out.push(`${f.id}: clip-text lettering, "${el.textContent.trim().slice(0,40)}"`);
     /* review 18: html2canvas smears a blurred inset shadow across its box and cannot draw repeating stripes (tiki's woven mat printed as a flat dark
        bar): in the copy it is handed, both must already be baked into pictures */
     if(el.offsetWidth&&el.offsetHeight&&/inset/.test(cs.boxShadow)&&cs.boxShadow.split(/,(?![^(]*\))/).some(sh=>{if(!/inset/.test(sh))return false;const n=(sh.replace(/rgba?\([^)]*\)/g,'').match(/-?[\d.]+px/g)||[]).map(parseFloat);return n.length>=3&&n[2]>=2&&!/rgba\([^)]*,\s*0\)/.test(sh)}))
      out.push(`${f.id}: blurred inset shadow left for the PDF (${el.offsetWidth}x${el.offsetHeight})`);
     if(/repeating-linear-gradient\((0deg|90deg|180deg|270deg|to (top|right|bottom|left))?/.test(cs.backgroundImage)&&cs.backgroundImage!=='none'){const rg=(cs.backgroundImage.match(/repeating-linear-gradient\(([^,]*)/g)||[]).filter(x=>!/\d+deg/.test(x)||/\((0|90|180|270)deg/.test(x));
      if(rg.length&&el.offsetWidth&&el.offsetHeight)out.push(`${f.id}: straight stripes left for html2canvas (${el.offsetWidth}x${el.offsetHeight})`)}
     /* review 18: html2canvas skips outlines (Role Models' dashed badge stitch) and small radial tiles (Scream's stamp perforations) */
     if(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0&&el.offsetWidth)out.push(`${f.id}: outline left for html2canvas (${el.offsetWidth}x${el.offsetHeight})`);
     if(/radial-gradient/.test(cs.backgroundImage)&&(()=>{const L=(t=>{const o=[];let d=0,c='';for(const ch of t){if(ch==='(')d++;if(ch===')')d--;if(ch===','&&!d){o.push(c.trim());c=''}else c+=ch}o.push(c.trim());return o})(cs.backgroundImage),Z=cs.backgroundSize.split(/,\s*/);
       return L.some((g,i)=>/^radial-gradient/.test(g)&&/^[\d.]+px [\d.]+px$/.test((Z[i]||'').trim())&&parseFloat(Z[i])<=400)})()&&el.offsetWidth)out.push(`${f.id}: small radial tile left for html2canvas`);
     /* review 18: a ring frame the copy lays over a box must sit on that box (Despicable Me 2's logo ring framed the whole column) */
     if(el.tagName==='I'&&cs.position==='absolute'&&parseFloat(cs.borderTopWidth)>0&&el.parentElement&&el.offsetParent&&el.offsetParent!==el.parentElement)out.push(`${f.id}: export frame laid on the wrong box (${el.offsetWidth}x${el.offsetHeight})`);
     const mk=cs.webkitMaskImage||cs.maskImage;if(mk&&mk!=='none'&&(el.querySelector('img')||/url\(/.test(cs.backgroundImage)))out.push(`${f.id}: masked photo left for the PDF`);
     /* review 19: html2canvas skips CSS masks, so a masked box holding words prints solid (every hotel door hanger lost its hole, airline tickets
        their punched notches): in the copy it is handed, the mask must already be baked into a picture */
     else if(mk&&mk!=='none'&&el.textContent.trim()&&el.offsetWidth)out.push(`${f.id}: mask left for html2canvas on a box with text, "${el.textContent.trim().slice(0,40)}"`);
     /* review 19: at print scale html2canvas pushes every outer box shadow off the page (canvas shadow offsets are not scaled), and it skips
        drop-shadow filters, so lifted photos, trays and stamps printed flat: both must already be pictures in the copy */
     if(el.offsetWidth&&cs.boxShadow&&cs.boxShadow!=='none'&&cs.boxShadow.split(/,(?![^(]*\))/).some(sh=>{if(/\binset\b/.test(sh)||/rgba\([^)]*,\s*0\)/.test(sh))return false;const n=(sh.replace(/rgba?\([^)]*\)/g,'').match(/-?[\d.]+px/g)||[]).map(parseFloat);return n.length>=3&&(n[0]||n[1]||n[2])}))
      out.push(`${f.id}: outer shadow left for html2canvas (${el.offsetWidth}x${el.offsetHeight})`);
     if(el.offsetWidth&&el.tagName!=='IMG'&&/drop-shadow/.test(cs.filter||''))out.push(`${f.id}: drop-shadow filter left for html2canvas (${el.offsetWidth}x${el.offsetHeight})`)}
    st.remove()}}
  return {n:list.length,out:[...new Set(out)]}},[N,NAMED]);
 console.log(`${r.n} printed menus read`);if(r.out.length){console.log(r.out.join('\n'));console.log('FAIL');process.exit(1)}
 console.log('PASS: no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops');await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
