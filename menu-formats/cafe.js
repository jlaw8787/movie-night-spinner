/* Format: cafe. A coffee shop chalkboard menu on the wall behind the counter (one face, 1056x1344).
   Counter photo across the top (40 percent of the face), the venue lettered over it, the board below,
   a paper loyalty card tucked into the frame. Era sets the board material (black glass, felt peg board,
   green slate, brown board, marker board, espresso slate, vinyl lettering, painted steel), the type pairing
   and the frame. Tone sets photo treatment, chalk dust and wear, card tilt and the copy voice.
   Fonts (fmt-cafe): Rufina, Pathway Gothic One, Cabin Sketch, Original Surfer, Rock Salt, Amatic SC,
   Josefin Sans, Domine. */
(function(){
/* ---- lift helpers (identical block in cafe, bistro, motel, airline, campfire) ----
   trim: crops baked-in letterbox bars and dead flat edges off a still, then cover-fits what is left.
   logo: scores a title logo against a dark and a light panel (20th percentile contrast, so multicolour
   logos read in every part) and returns the better panel; a weak best score gets a fine halo, never a recolour. */
if(!window.__fmtLift||window.__fmtLift.v<3)window.__fmtLift={v:3,
  px(img,w){const cv=document.createElement("canvas");cv.width=w;cv.height=Math.max(8,Math.round(w*img.naturalHeight/img.naturalWidth));
    const cx=cv.getContext("2d");cx.drawImage(img,0,0,cv.width,cv.height);return{d:cx.getImageData(0,0,cv.width,cv.height).data,w:cv.width,h:cv.height}},
  trim(img,tries){try{
    if(!img.naturalWidth||img.dataset.trim==="1")return;
    const box=img.parentElement,bw=+img.dataset.bw||box.clientWidth,bh=+img.dataset.bh||box.clientHeight;
    if(!bw||!bh){if((tries||0)<6)setTimeout(()=>window.__fmtLift.trim(img,(tries||0)+1),400);return}
    /* review 21: iPhone Safari draws a photo that has not decoded yet as nothing, so the sample came back blank, every edge read as a black
       bar, and the photo was blown up to its middle (the zoomed stills on Logan and Role Models). A blank sample waits and tries again,
       and a crop that would throw away over half the picture is never made */
    const smp=window.__fmtLift.px(img,160);{let op=0;for(let i=3;i<smp.d.length;i+=4*37)if(smp.d[i]>8)op++;if(op<smp.d.length/(4*37)*.5){if((tries||0)<8)setTimeout(()=>window.__fmtLift.trim(img,(tries||0)+1),350);return}}
    img.dataset.trim="1";
    const{d,w,h}=smp,L=(x,y)=>{const i=(y*w+x)*4;return .2126*d[i]+.7152*d[i+1]+.0722*d[i+2]};
    const dead=(n,get)=>{let dk=0,s=0,s2=0;for(let j=0;j<n;j++){const l=get(j);if(l<28)dk++;s+=l;s2+=l*l}const m=s/n,v=s2/n-m*m;return dk/n>.94||(dk/n>.74&&m<34)||(v<30&&(m<46||m>238))};
    const col=x=>dead(h,y=>L(x,y)),row=y=>dead(w,x=>L(x,y));
    let l=0,r=w-1,t=0,b=h-1;
    while(l<w*.42&&col(l))l++;while(r>w*.58&&col(r))r--;while(t<h*.3&&row(t))t++;while(b>h*.7&&row(b))b--;
    if(l<2&&w-1-r<2&&t<2&&h-1-b<2)return;
    if((r-l+1)*(b-t+1)<w*h*.5)return;
    l=l?l+1:0;t=t?t+1:0;r=r<w-1?r-1:r;b=b<h-1?b-1:b;
    const kx=img.naturalWidth/w,ky=img.naturalHeight/h,x0=l*kx,y0=t*ky,cw=(r+1)*kx-x0,ch=(b+1)*ky-y0;
    const s=Math.max(bw/cw,bh/ch),pp=(getComputedStyle(img).objectPosition||"50% 40%").split(" ").map(v=>/%$/.test(v)?parseFloat(v)/100:v==="center"?.5:v==="top"||v==="left"?0:v==="bottom"||v==="right"?1:.5);
    const fx=pp[0]==null?.5:pp[0],fy=pp[1]==null?.4:pp[1];
    Object.assign(img.style,{objectFit:"fill",objectPosition:"0 0",inset:"auto",right:"auto",bottom:"auto",maxWidth:"none",maxHeight:"none",
      left:(-x0*s+(bw-cw*s)*fx).toFixed(1)+"px",top:(-y0*s+(bh-ch*s)*fy).toFixed(1)+"px",width:(img.naturalWidth*s).toFixed(1)+"px",height:(img.naturalHeight*s).toFixed(1)+"px"});
  }catch(e){}},
  cors(img){if(img.crossOrigin){img.removeAttribute("crossorigin");img.dataset.trim="1";img.src=img.src}},
  rl(l){l/=255;return l<=.03928?l/12.92:Math.pow((l+.055)/1.055,2.4)},
  logo(img,darkLum,lightLum){try{
    const{d}=window.__fmtLift.px(img,120),ls=[];
    for(let i=0;i<d.length;i+=4)if(d[i+3]>140)ls.push(.2126*window.__fmtLift.rl(d[i])+.7152*window.__fmtLift.rl(d[i+1])+.0722*window.__fmtLift.rl(d[i+2]));
    if(!ls.length)return null;
    const sc=P=>{const c=ls.map(x=>(Math.max(x,P)+.05)/(Math.min(x,P)+.05)).sort((a,b)=>a-b);return c[Math.floor(c.length*.2)]};
    const sd=sc(darkLum==null?.012:darkLum),sl=sc(lightLum==null?.86:lightLum),panel=sd>=sl?"dark":"light",best=Math.max(sd,sl);
    if(best<3)img.style.filter=panel==="dark"?"drop-shadow(0 0 1.2px rgba(255,255,255,.95)) drop-shadow(0 0 5px rgba(255,255,255,.35))":"drop-shadow(0 0 1.2px rgba(0,0,0,.9)) drop-shadow(0 0 4px rgba(0,0,0,.25))";
    return panel;
  }catch(e){return null}}};
const W=1056,H=1344,FR=26,PH=600;

/* ---------- shared helpers ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[‐-―−]\s*/g,", ").replace(/\s+-\s+/g,", ").replace(/--+/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cap=s=>{s=clean(s).trim();return s?s.charAt(0).toUpperCase()+s.slice(1):""};
const sent=s=>{s=cap(s);return !s?"":/[.!?]$/.test(s)?s:s+"."};
const DRY=[
/* kids' mode: whole drink names become named mocktails and cooking uses just lose the alcohol word, before any single-word swap (no "syrup Alexander") */
...(()=>{const cap=(m,v)=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v;const W="beer|stout|ale|guinness|lager|red wine|white wine|wine|cider|bourbon|whisky|whiskey|rum|brandy|sherry|marsala|tequila|vodka|sake|champagne";
 return [[/\bbrandy alexanders?\b/gi,m=>cap(m,"vanilla nutmeg milk")],[/\b(brandy|bourbon|whisky|whiskey|rum) milk punch\b/gi,m=>cap(m,"vanilla milk punch")],
  [new RegExp("\\b("+W+")[- ](battered)\\b","gi"),m=>cap(m,"crisp battered")],[new RegExp("\\b("+W+")[- ](braised|stewed)\\b","gi"),(m,a,b)=>cap(m,"slow-"+b.toLowerCase())],
  [new RegExp("\\b("+W+")[- ](glazed)\\b","gi"),m=>cap(m,"sticky glazed")],[new RegExp("\\b("+W+")[- ](marinated|poached|steamed|soaked|infused|spiked|cured)\\b","gi"),(m,a,b)=>cap(m,b.toLowerCase())],
  [/\b(red wine|white wine|rice wine|sherry|cider|champagne|malt) vinegar\b/gi,m=>m.replace(/(wine|sherry|cider|champagne|malt)/i,w=>w[0]+"\u200B"+w.slice(1))],
  [new RegExp("\\b("+W+"|port)[- ](jus|sauce|gravy|reduction|butter|glaze)\\b","gi"),(m,a,b)=>cap(m,"rich "+b.toLowerCase())],
  [/\brum balls?\b/gi,m=>cap(m,"choc coconut balls")],[/\birish coffee\b/gi,m=>cap(m,"Irish-style hot chocolate")],[/\bmimosas?\b/gi,m=>cap(m,"orange fizz")],
  [/\bshandy\b/gi,m=>cap(m,"lemon squash")],[/\b(gin|vodka) and tonic\b/gi,m=>cap(m,"lime and tonic")],[/\bmint juleps?\b/gi,m=>cap(m,"mint lemonade")],
  [/\bold fashioneds?\b/gi,m=>cap(m,"orange and cherry soda")],[/\bboilermakers?\b/gi,m=>cap(m,"ginger beer float")]]})(),
[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|gin|kir)\b/gi,"syrup"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
const hex=h=>{h=String(h||"").replace("#","");if(/^[0-9a-f]{3}$/i.test(h))h=h.replace(/./g,"$&$&");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=c=>{const a=hex(c);if(!a)return 0;const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(a[0])+.7152*f(a[1])+.0722*f(a[2])};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>{const x=hex(a),y=hex(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t))};
const sat=c=>{const a=hex(c);if(!a)return 0;const mx=Math.max(...a),mn=Math.min(...a);return mx?(mx-mn)/mx:0};
function readable(c,bg,min,fb){if(!hex(c)||sat(c)<.18)c=fb;if(cr(c,bg)>=min)return c;const to=lum(bg)<.3?"#ffffff":"#000000";for(let t=.08;t<.95;t+=.08){const m=mix(c,to,t);if(cr(m,bg)>=min)return m}return to}
function loadFonts(id,fams){const k="fmt-font-"+id;if(document.getElementById(k))return;const l=document.createElement("link");l.id=k;l.rel="stylesheet";
  l.href=rdFontHref(fams.map(f=>"family="+f.replace(/ /g,"+")).join("&"),"swap");document.head.appendChild(l)}
const svgUrl=s=>`url('data:image/svg+xml,${encodeURIComponent(s)}')`;
const noise=(rgb,a,freq,size)=>{const[r,g,b]=hex(rgb).map(v=>(v/255).toFixed(3));return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${(a*3).toFixed(2)} 0 0 0 ${(-a*1.2).toFixed(2)}"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`)};
const CHALKSOFT=svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="m"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 0 0 0 2.5"/></filter><rect width="100%" height="100%" filter="url(#m)"/></svg>`);
const CHALKMASK=svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="m"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3.2 0 0 0 2.75"/></filter><rect width="100%" height="100%" filter="url(#m)"/></svg>`);
/* runtime fit: every [data-fit] box scales its type (CSS var --k) until nothing overflows; notes drop as a last resort */
const FIT=`<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="position:absolute;width:1px;height:1px;opacity:0;left:0;top:0" onload="(function(r){function f(){var cs=r.querySelectorAll('[data-ccol]'),i;for(i=0;i<cs.length;i++)cs[i].style.removeProperty('--xg');f0();if(window.__fmtCafeBal2)window.__fmtCafeBal2(r,f0);for(i=0;i<cs.length;i++){var c=cs[i],ss=c.querySelectorAll('[data-csec]'),n=c.querySelectorAll('[data-citem]').length+ss.length;if(!ss.length)continue;var l=ss[ss.length-1],sp=c.parentNode.clientHeight-(l.offsetTop+l.offsetHeight-c.offsetTop);if(sp>12)c.style.setProperty('--xg',Math.min(12,Math.floor((sp-4)/n))+'px')}}function f0(){r.querySelectorAll('[data-fit]').forEach(function(b){var k=1;b.style.setProperty('--k',1);b.style.removeProperty('--nd');b.style.removeProperty('--dl');if(window.__fmtTrimReset)window.__fmtTrimReset(b);var ns=b.querySelectorAll('[data-cnote]');for(var j=0;j<ns.length;j++)ns[j].style.display='';var o=function(){return b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1};while(o()&&k>.56){k-=.04;b.style.setProperty('--k',k.toFixed(2))}if(window.__fmtTrim)window.__fmtTrim(Array.prototype.slice.call(ns),o);else for(var i=ns.length-1;i>=0&&o();i--)ns[i].style.display='none';if(o())b.style.setProperty('--dl','1')})}f();if(document.fonts)document.fonts.ready.then(f);setTimeout(f,900);setTimeout(f,2200)})(this.parentNode)">`;
/* 11 Nov: once the split is settled, a column that ends short of the board spreads its spare height between its dishes (--xg, 12px a gap
   at most), so the board has no empty patch under one column (Wish, Clerks III) */
/* review 16: the two menu columns are first split by a length guess, before anything is measured. Once the fonts are in, every split of the
   sections across the columns is tried (the first section always top left, each column in menu order), and the one that clamps no dish name, hides the fewest notes, then shortens the fewest, then keeps the
   biggest type wins. The first split wins a tie, so a menu that already fits is left alone */
if(!window.__fmtCafeBal2)window.__fmtCafeBal2=function(r,fit){
  const cols=r.querySelectorAll("[data-ccol]");if(cols.length!==2)return;const box=cols[0].closest("[data-fit]");if(!box)return;
  if(!box.__secs){box.__secs=[...box.querySelectorAll("[data-csec]")].sort((a,b)=>+a.dataset.csec-+b.dataset.csec).map(x=>x.outerHTML);box.__first=[...cols[0].querySelectorAll("[data-csec]")].map(x=>+x.dataset.csec)}
  const S=box.__secs;if(S.length<2)return;
  const lay=a=>{cols[0].innerHTML=S.filter((_,i)=>a.includes(i)).join("");cols[1].innerHTML=S.filter((_,i)=>!a.includes(i)).join("")};
  const score=()=>{const ns=[...box.querySelectorAll("[data-cnote]")],k=parseFloat(box.style.getPropertyValue("--k"))||1;
    return [box.style.getPropertyValue("--dl")?1:0,box.style.getPropertyValue("--nd")?ns.length:ns.filter(n=>n.style.display==="none").length,ns.filter(n=>n.dataset.full&&n.textContent!==n.dataset.full).length,-k]};
  const better=(x,y)=>{for(let i=0;i<4;i++){if(Math.abs(x[i]-y[i])>1e-6)return x[i]<y[i]}return false};
  const cands=[box.__first];for(let m=1;m<(1<<S.length)-1;m+=2){const a=S.map((_,i)=>i).filter(i=>m>>i&1);if(a.join()!==box.__first.join())cands.push(a)}
  let best=null,bi=0;cands.forEach((a,i)=>{lay(a);fit();const sc=score();if(!best||better(sc,best)){best=sc;bi=i}});
  lay(cands[bi]);fit()};
const fs=(px,min)=>`font-size:max(${min||14}px,calc(${px}px * var(--k,1)))`;
/* logo panel tone: a dark logo flips its panel to the light stock */
const LOGOTONE=`onload="(function(i){var p=i.closest('[data-lp]'),w=window.__fmtLift&&__fmtLift.logo(i,+((p&&p.dataset.dl)||.012),+((p&&p.dataset.ll)||.86));if(p&&w&&(w==='light')===(p.dataset.dark==='1')){p.style.background=p.dataset.alt;p.style.boxShadow=p.dataset.altsh}})(this)"`;
function logoBox(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a),w=h*a;
  return{w:Math.round(w),h:Math.round(h),html:`<img crossorigin="anonymous" alt="${esc(ctx.f.title)}" src="${ctx.img(L[0],"w500")}" ${LOGOTONE} style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain">`}}
function posterOf(ctx){if(ctx.poster)return ctx.poster;try{return((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[ctx.f.id])||null}catch(e){return null}}
function photo(ctx,path,w,h,filter,pos){const poster=posterOf(ctx);
  if(path)return `<img alt="" crossorigin="anonymous" data-bw="${w}" data-bh="${h}" onload="window.__fmtLift&&__fmtLift.trim(this)" onerror="window.__fmtLift&&__fmtLift.cors(this)" src="${ctx.img(path,"w1280")}" style="position:absolute;inset:0;left:0;top:0;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos||"50% 40%"};filter:${filter}">`;
  if(poster)return `<img alt="" src="${ctx.img(poster,"w780")}" style="position:absolute;inset:-30px;width:${w+60}px;height:${h+60}px;object-fit:cover;filter:blur(18px) brightness(.7) ${filter}"><img alt="" src="${ctx.img(poster,"w780")}" style="position:absolute;left:50%;top:0;height:${h}px;transform:translateX(-50%);filter:${filter};box-shadow:0 0 40px rgba(0,0,0,.5)">`;
  return `<div style="position:absolute;inset:0;background:#333"></div>`}
function yy(f){const y=String(f.year||"");return y.slice(-2)==="00"?y:y.slice(-2)||"1"}/* 2000 reads "2000", never "00" (review 12) */
function numOf(fl,f){const n=fl&&String(fl.number||"").replace(/[^0-9A-Za-z]/g,"");return n||String(f.year||"")}
function courses(ctx,family){const m=ctx.menu||{};const fix=s=>family?DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s)):clean(s);
  return["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(it=>it&&it.n).slice(0,4).map(it=>({n:cap(fix(it.n)),note:sent(fix(it.note))}))})).filter(c=>c.items.length)}
const pick=(arr,seed)=>arr[Math.abs([...String(seed)].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%arr.length];

/* ---------- tone: photo, wear, tilt, voice ---------- */
const TONE={
  gritty:{f:"contrast(1.14) saturate(.82)",dust:.34,vig:.6,tilt:-3,wear:1,kick:"Coffee's hot. Don't ask twice",noteH:"Left by the register",card:"Ten stamps, one free cup. No arguments."},
  glossy:{f:"saturate(1.14) contrast(1.05) brightness(1.03)",dust:.1,vig:.25,tilt:-1,wear:0,kick:"Fresh roasted, poured to order",noteH:"From the owner",card:"Collect ten stamps for a cup on the house."},
  warm:{f:"saturate(1.08) sepia(.12) brightness(1.03)",dust:.2,vig:.35,tilt:-2.5,wear:.4,kick:"Come in, the pot's always on",noteH:"A note from the counter",card:"Ten stamps and your next cup is on us."},
  eerie:{f:"saturate(.68) brightness(.94) contrast(1.08) hue-rotate(-8deg)",dust:.26,vig:.7,tilt:-1.5,wear:.7,kick:"Open late. Mind the quiet corner",noteH:"Found under the sugar jar",card:"Ten stamps. Nobody remembers the tenth."},
  playful:{f:"saturate(1.28) brightness(1.05)",dust:.16,vig:.2,tilt:-4,wear:.3,kick:"Good coffee, better company",noteH:"Psst, from behind the counter",card:"Fill the card, win a cup. Easy."},
  grand:{f:"contrast(1.08) saturate(1.05)",dust:.12,vig:.5,tilt:-1,wear:.2,kick:"The finest cup in town",noteH:"With the compliments of",card:"Ten visits earns a pot for the table."},
  tender:{f:"brightness(1.06) saturate(.9) contrast(.96)",dust:.18,vig:.3,tilt:-2,wear:.35,kick:"Stay as long as you like",noteH:"A note for you",card:"Ten small visits, one cup to share."},
  tense:{f:"contrast(1.2) saturate(.78)",dust:.24,vig:.65,tilt:2,wear:.6,kick:"Order fast. Pay at the counter",noteH:"Read this, then sit down",card:"Ten stamps. Keep the card on you."},
  scrappy:{f:"contrast(1.24) saturate(.7) brightness(1.04)",dust:.4,vig:.45,tilt:-5,wear:1,kick:"Cash only. Mugs might not match",noteH:"Scrawled on the back of a docket",card:"Ten stamps gets a cup. Probably."}};

/* ---------- era: board material, type, frame, course heads, prices ---------- */
const ERA={
  "1930s-40s":{disp:"Rufina",dw:700,body:"Lora",sig:"Pinyon Script",ratio:.56,dr:.7,up:true,chalk:false,
    board:"#141414",ink:"#f1e3bf",acc0:"#d4a94a",frame:"linear-gradient(135deg,#5a2a16,#3a170b 40%,#6b341b 60%,#2c1208)",frameIn:"inset 0 0 0 3px #b8893a,inset 0 0 0 7px #141414,inset 0 0 0 8px #b8893a",
    sheen:"linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,0) 40%)",card:"#efe4c8",cardInk:"#2a1d10",
    photoF:"grayscale(1) contrast(1.12) brightness(1.05)",head:"deco",cents:true,P:{s:[15,20,25,15],m:[45,55,65,50],w:[10,15,10,15],d:[5,10,5,10]}},
  "1950s":{disp:"Pathway Gothic One",body:"Pathway Gothic One",sig:"Pinyon Script",ratio:.42,dr:.46,up:true,chalk:false,
    board:"#1c1c1d",grooves:true,ink:"#f4f4ef",acc0:"#d8302a",frame:"linear-gradient(180deg,#e3e6ea,#9ea3aa 45%,#d7dade 55%,#7d828a)",frameIn:"inset 0 2px 4px rgba(0,0,0,.6)",
    card:"#fbf7ec",cardInk:"#1c1c1d",photoF:"saturate(1.15) sepia(.1) contrast(1.04)",head:"peg",cents:true,P:{s:[25,35,30,40],m:[85,95,75,90],w:[20,25,20,25],d:[10,15,10,15]}},
  "1960s":{disp:"Cabin Sketch",dw:700,body:"Patrick Hand",sig:"Caveat",ratio:.5,dr:.6,up:false,chalk:true,
    board:"#2c4636",ink:"#f2f4ea",acc0:"#f2d36b",frame:"repeating-linear-gradient(90deg,#9a6a35 0 4px,#8a5b2a 4px 9px,#a8773f 9px 15px)",frameIn:"inset 0 0 12px rgba(0,0,0,.55)",
    card:"#fffdf4",cardInk:"#233528",photoF:"saturate(1.3) contrast(1.05)",head:"chalkline",P:{s:[.45,.6,.5,.55],m:[1.25,1.5,1.35,1.4],w:[.35,.4,.3,.45],d:[.15,.2,.25,.2]}},
  "1970s":{disp:"Original Surfer",body:"Kalam",bw:700,sig:"Caveat",ratio:.5,dr:.66,up:false,chalk:true,
    board:"#33241b",ink:"#f7e7c6",acc0:"#f0a23a",frame:"repeating-linear-gradient(90deg,#4b2c17 0 6px,#5a3820 6px 10px,#3f2412 10px 18px)",frameIn:"inset 0 0 0 4px #c76b2a,inset 0 0 14px rgba(0,0,0,.6)",
    card:"#f3e2bb",cardInk:"#3a2414",photoF:"sepia(.22) saturate(.95) contrast(.94) brightness(1.06)",head:"pill",P:{s:[.95,1.25,1.1,1.35],m:[2.95,3.5,3.25,3.75],w:[.85,.95,.75,.9],d:[.35,.45,.5,.4]}},
  "1980s":{disp:"Rock Salt",body:"Kalam",bw:700,sig:"Caveat",ratio:.5,dr:.64,up:true,chalk:false,
    board:"#101012",ink:"#ffffff",acc0:"#ff3fa4",acc2:"#29e6f0",frame:"linear-gradient(180deg,#3a3a40,#16161a)",frameIn:"inset 0 0 0 2px #55555e",
    card:"#ffffff",cardInk:"#101012",photoF:"contrast(1.12) saturate(1.22)",head:"marker",P:{s:[1.95,2.5,2.25,2.75],m:[4.95,5.5,5.25,5.95],w:[1.75,1.95,1.5,1.85],d:[.95,1.25,1.1,1.5]}},
  "1990s":{disp:"Amatic SC",dw:700,body:"Architects Daughter",sig:"Caveat",ratio:.52,dr:.42,up:false,chalk:true,
    board:"#23272b",ink:"#f3f1ea",acc0:"#e9b44c",acc2:"#8fd0c6",frame:"linear-gradient(180deg,#5b5f63,#2f3236)",frameIn:"inset 0 0 0 3px #1a1c1e",
    card:"#e8dcc4",cardInk:"#2b2117",photoF:"contrast(1.05) saturate(1.06)",head:"chalkline",P:{s:[3.25,3.95,3.5,4.25],m:[7.5,8.95,7.95,8.5],w:[2.95,3.5,2.75,3.25],d:[1.95,2.5,2.25,2.75]}},
  "2000s":{disp:"Josefin Sans",dw:700,body:"Josefin Sans",bw:600,sig:"Caveat",ratio:.52,dr:.62,up:true,chalk:false,
    board:"#2a1f1a",ink:"#f6eadb",acc0:"#c98b4e",frame:"repeating-linear-gradient(90deg,#3a2618 0 5px,#2f1e13 5px 11px)",frameIn:"inset 0 0 0 2px #c98b4e",
    card:"#f6efe3",cardInk:"#2a1f1a",photoF:"saturate(1.05) contrast(1.08)",head:"bar",P:{s:[4.5,5.25,4.95,5.75],m:[9.95,11.5,10.5,12.25],w:[3.95,4.5,3.75,4.25],d:[2.95,3.75,3.25,4.15]}},
  "modern":{disp:"Domine",dw:700,body:"DM Sans",bw:"400;700",sig:"Caveat",ratio:.5,dr:.56,up:false,chalk:false,
    board:"#1f2326",ink:"#f4f3ef",acc0:"#d9a066",frame:"linear-gradient(180deg,#141618,#0b0c0d)",frameIn:"inset 0 0 0 1px #3a3f44",
    card:"#f4f1ea",cardInk:"#1f2326",photoF:"none",head:"hair",P:{s:[7,9,8,10],m:[18,22,19,24],w:[8,9,7,10],d:[5,6,4.5,7]}}};
const ERAS=Object.keys(ERA);
function eraOf(e){e=String(e||"").toLowerCase();if(ERA[e])return e;if(/30|40/.test(e))return"1930s-40s";if(/2000|00s/.test(e))return"2000s";const m=e.match(/(19)?([5-9])0/);if(m)return"19"+m[2]+"0s";return"modern"}
function fam(e){const list=[e.disp+(e.dw?":wght@"+e.dw:""),e.body+(e.bw?":wght@"+e.bw:(e.body===e.disp?"":"")),e.sig];
  if(e.body==="Lora")list[1]="Lora:ital,wght@0,400;0,600;1,400";if(e.body==="Kalam")list[1]="Kalam:wght@400;700";if(e.body==="Josefin Sans")list[1]="Josefin Sans:wght@400;600;700";
  if(e.disp===e.body)list.splice(1,1);if(e.disp==="Domine")list.push("DM Sans:wght@400;700");return[...new Set(list)]}

function money(era,k,i,f,fl){const e=ERA[era],v=e.P[k][i%4];
  const egg=false, y=yy(f);
  if(e.cents){if(egg)return y+"¢";return v<100?v+"¢":(v/100).toFixed(2)}
  if(egg){const w=Math.floor(v);return w+"."+y}
  return v.toFixed(2)}

const LABEL={s:"From the Counter",m:"Plates",w:"The Cake Case",d:"Cups"};
const LABEL_FAMILY={d:"Cups and Shakes"};

function secHead(e,era,label,ACC,INK){
  const t=esc(e.up||era==="1990s"?label.toUpperCase():label);
  switch(e.head){
    case"deco":return `<div style="display:flex;align-items:center;gap:12px;margin:0 0 8px"><div style="flex:1;border-top:3px double ${ACC}"></div><div style="font-family:'${e.disp}',serif;font-weight:900;letter-spacing:.14em;color:${ACC};${fs(24,15)}">${t}</div><div style="flex:1;border-top:3px double ${ACC}"></div></div>`;
    case"peg":return `<div style="font-family:'${e.disp}';font-weight:700;letter-spacing:.2em;color:${ACC};${fs(26,15)};margin:0 0 6px;text-shadow:0 2px 0 rgba(0,0,0,.6)">${t}</div>`;
    case"pill":return `<div style="display:inline-block;padding:4px 18px 2px;border-radius:30px;background:${ACC};color:${e.board};font-family:'${e.disp}';${fs(26,15)};margin:0 0 8px">${t}</div>`;
    case"marker":return `<div style="display:inline-block;padding:2px 12px;border:3px solid ${ACC};transform:rotate(-1.2deg);font-family:'${e.disp}';color:${ACC};${fs(26,15)};margin:0 0 10px">${t}</div>`;
    case"bar":return `<div style="background:${ACC};color:${e.board};font-family:'${e.disp}';font-weight:700;letter-spacing:.16em;padding:6px 12px 3px;${fs(20,14)};margin:0 0 8px">${t}</div>`;
    case"hair":return `<div style="display:flex;align-items:baseline;gap:12px;margin:0 0 8px"><div style="font-family:'${e.disp}';color:${ACC};${fs(30,16)}">${t}</div><div style="flex:1;border-top:1px solid ${ACC};opacity:.6"></div></div>`;
    default:return `<div style="font-family:'${e.disp}';font-weight:700;color:${ACC};${fs(era==="1990s"?40:32,16)};margin:0 0 6px;padding-bottom:2px;border-bottom:3px dashed ${ACC}88;${e.chalk?`-webkit-mask-image:${CHALKSOFT};mask-image:${CHALKSOFT}`:""}">${t}</div>`}}

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS["cafe"]=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,era=eraOf(ctx.era),e=ERA[era],T=TONE[ctx.tone]||TONE.warm;
  loadFonts("cafe-"+era,fam(e));
  const family=FAMILY.has(f.theme);
  const BOARD=e.board,INK=e.ink;
  const pal=ctx.palette||{};
  let ACC=readable(pal.accent,BOARD,4.5,e.acc0);
  if(e.chalk)ACC=mix(ACC,"#ffffff",.25);
  const ACC2=e.acc2?readable(e.acc2,BOARD,4.5,e.acc2):ACC;
  const venue=clean(fl&&fl.venue)||"The Corner Coffee Shop";
  const sign=clean(fl&&fl.sign)||"Coffee, cake and a good seat";
  const note=fl&&fl.note&&fl.note.text?{t:sent(fl.note.text),by:clean(fl.note.by)}:{t:sent(f.T||"Sit anywhere. Somebody will be right with you."),by:"The House"};
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl&&fl.prop&&fl.prop.title?fl.prop:null;
  const num=numOf(fl,f);
  const C=courses(ctx,family);
  const still=ctx.stills&&ctx.stills[0],poster=posterOf(ctx),hasP=!!poster;
  const bodyF=`'${e.body}',${e.chalk?"cursive":"sans-serif"}`;
  const dispUp=e.up?"text-transform:uppercase;":"";
  const chalkTxt=e.chalk?`-webkit-mask-image:${CHALKSOFT};mask-image:${CHALKSOFT};`:"";

  /* venue lettering on the photo: size from length, two lines at most, with real line spacing when it runs to two (Beverly Palm Hotel) */
  /* review 15: the board under a poster held about 380px, so most cafe menus (30 of 34) hid their dish notes. A longer menu now takes height
     from the poster panel: the poster shrinks in proportion and the side column keeps its width */
  const nItems=C.reduce((a,c)=>a+c.items.length,0),noteLen=C.reduce((a,c)=>a+c.items.reduce((b,it)=>b+String(it.note||"").length,0),0);
  const PHP=nItems>=7||noteLen>420?786:nItems>=5||noteLen>300?846:906,PT=PHP-36,PW=Math.round(PT*2/3);
  const vlen=venue.length,CW=(W-2*FR)-(12+PW+12+24)-24,vw=hasP?CW:W-2*FR-80;
  let vs=Math.min(e.up?78:86,Math.floor(vw/(Math.max(vlen,6)*e.dr)));let vlines=1;
  if(hasP){for(let L=2;vs<52&&L<=3;L++){vlines=L;vs=Math.min(64,Math.floor(.9*L*vw/(vlen*e.dr)))}vs=Math.max(30,vs)}
  else{if(vs<52){vs=Math.min(64,Math.floor(2*vw/(vlen*e.dr)));vlines=2}vs=Math.max(40,vs)}

  /* logo on its own panel at the foot of the photo; fallback is set type */
  const LB=logoBox(ctx,430,118);
  const darkPanel="rgba(12,12,14,.78)",lightPanel="rgba(250,247,240,.93)";
  const LB2=hasP?logoBox(ctx,300,104):null;
  const logoHtml=hasP?(LB2?`<div data-lp data-dark="1" data-alt="${lightPanel}" data-altsh="0 8px 24px rgba(0,0,0,.45)" style="flex:none;align-self:flex-start;padding:16px 20px;background:${darkPanel};box-shadow:0 8px 24px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.14);border-radius:${era==="1930s-40s"?0:era==="1970s"?18:6}px">${LB2.html}</div>`
    :`<div data-fit style="flex:none;width:${CW}px;height:130px;overflow:hidden;padding:14px 20px;box-sizing:border-box;background:${darkPanel};display:flex;flex-direction:column;justify-content:center"><div style="font-family:'${e.disp}',serif;font-weight:${e.dw||400};${dispUp}color:#fff;line-height:1.02;${fs(f.title&&f.title.length>24?34:46,18)}">${esc(f.title)}</div><div style="font-family:${bodyF};color:${mix(ACC,"#ffffff",.3)};letter-spacing:.2em;${fs(16,14)};margin-top:6px">NOW SHOWING ${esc(f.year)}</div></div>`)
    :LB?`<div data-lp data-dark="1" data-alt="${lightPanel}" data-altsh="0 8px 24px rgba(0,0,0,.45)" style="position:absolute;left:${FR+26}px;top:${FR+PH-LB.h-62}px;padding:18px 22px;background:${darkPanel};box-shadow:0 8px 24px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.14);border-radius:${era==="1930s-40s"?0:era==="1970s"?18:6}px">${LB.html}</div>`
    :`<div data-fit style="position:absolute;left:${FR+26}px;top:${FR+PH-190}px;width:${hasP?500:560}px;height:150px;overflow:hidden;padding:16px 22px;box-sizing:border-box;background:${darkPanel};display:flex;flex-direction:column;justify-content:center"><div style="font-family:'${e.disp}',serif;font-weight:${e.dw||400};${dispUp}color:#fff;line-height:1.02;${fs(f.title&&f.title.length>24?40:56,18)}">${esc(f.title)}</div><div style="font-family:${bodyF};color:${mix(ACC,"#ffffff",.3)};letter-spacing:.2em;${fs(16,14)};margin-top:6px">NOW SHOWING ${esc(f.year)}</div></div>`;

  /* photo with venue lettering and caption */
  const PHH=hasP?PHP:PH;
  const photoFn=()=>`<div style="position:absolute;left:${FR}px;top:${FR}px;width:${W-2*FR}px;height:${PHH}px;overflow:hidden;background:#222">
    ${hasP?`<div style="position:absolute;inset:0;background:${BOARD}"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 75% 50%,rgba(255,255,255,.1),rgba(0,0,0,.35) 90%)"></div>
    <div style="position:absolute;left:12px;top:12px;width:${PW+12}px;height:${PT+12}px;background:#f4efe3;padding:6px;box-sizing:border-box;box-shadow:0 14px 34px rgba(0,0,0,.65)"><img alt="" crossorigin="anonymous" src="${ctx.img(poster,"w780")}" style="display:block;width:${PW}px;height:${PT}px;object-fit:contain;background:#f4efe3"></div>`
    :`${photo(ctx,still,W-2*FR,PH,`${e.photoF==="none"?"":e.photoF} ${T.f}`,"50% 35%")}
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 45%,rgba(0,0,0,${T.vig}) 100%)"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:${vlines>1?300:250}px;background:linear-gradient(180deg,rgba(0,0,0,.82),rgba(0,0,0,.5) 55%,rgba(0,0,0,0))"></div>`}
    ${hasP?`<div style="position:absolute;left:${12+PW+12+24}px;top:22px;width:${CW}px;height:${PHP-34}px;display:flex;flex-direction:column;justify-content:space-between;gap:12px">`:""}
    <div style="${hasP?"flex:none":"position:absolute;left:40px;right:40px;top:30px"}">
      <div style="font-family:${bodyF};font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:${mix(ACC,"#ffffff",.15)};font-size:18px;margin-bottom:8px">${esc(T.kick)}</div>
      <div data-fit style="${hasP?"max-height":"height"}:${Math.ceil(vs*(vlines>1||hasP&&vlen>12?1.48:1.1)*Math.max(vlines,hasP&&vlen>12?2:1))+6}px;overflow:hidden;font-family:'${e.disp}',serif;font-weight:${e.dw||400};${dispUp}color:#fff;line-height:${vlines>1||hasP&&vlen>12?1.42:1.06};${fs(vs,30)};text-shadow:0 3px 14px rgba(0,0,0,.6);${era==="1950s"?"letter-spacing:.06em;":""}">${esc(venue)}</div>
      <div style="font-family:${bodyF};${e.body==="Lora"?"font-style:italic;":""}color:#f2efe6;font-size:22px;margin-top:6px;${hasP?"":"white-space:nowrap;overflow:hidden;text-overflow:ellipsis"}">${esc(sign)}</div>
    </div>
    ${hasP?`${logoHtml}${noteHtml}${card}</div>`:""}
    ${hasP?"":`    <div style="position:absolute;right:20px;bottom:18px;max-width:430px;text-align:right;font-family:${bodyF};font-size:16px;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.55);padding:6px 12px">${esc(hasP||!still?"Now showing":"Behind the counter")}, ${esc(f.year)}</div>`}
  </div>`;

  /* the board */
  const BT=FR+PHH, BH=H-FR-BT;
  const cols=[[],[]];
  {const wt=c=>c.items.reduce((a,it)=>a+1.1+Math.ceil(it.n.length/28)+Math.ceil(it.note.length/40),1.4);let a=0,b=0;
   const ordered=C.slice();ordered.forEach((c,i)=>{const w=wt(c);if(i===0||(a<=b&&!(i===ordered.length-1&&cols[1].length===0))){cols[0].push(c);a+=w}else{cols[1].push(c);b+=w}});
   if(!cols[1].length&&cols[0].length>1)cols[1].push(cols[0].pop())}
  const n=C.reduce((a,c)=>a+c.items.length,0);
  const PQ=(()=>{const P={},M={};C.forEach(c=>{M[c.k]=c.items;P[c.k]=c.items.map((it,i)=>money(era,c.k,i,f,fl))});return window.priceSense?window.priceSense(M,P):P})();
  const dish=n<=6?30:n<=9?28:26,desc=n<=6?22:21,gap=n<=6?16:n<=10?11:8;
  const itemHtml=(c,it,i)=>`<div data-citem style="margin:0 0 calc(${gap}px + var(--xg,0px))">
      <div style="display:flex;align-items:baseline;gap:14px"><div style="flex:1;min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--dl,3);overflow:hidden;font-family:${bodyF};font-weight:${e.bw?"700":"400"};color:${INK};line-height:1.14;${fs(dish,18)};${e.up&&era!=="1930s-40s"?"text-transform:uppercase;letter-spacing:.03em;":""}">${esc(it.n)}</div>
      <div style="font-family:${bodyF};font-weight:700;color:${c.k==="d"?ACC2:ACC};${fs(dish,18)};white-space:nowrap">${PQ[c.k][i]}</div></div>
      <div data-cnote style="display:var(--nd,block);font-family:${bodyF};${e.body==="Lora"?"font-style:italic;":""}color:${mix(INK,BOARD,.12)};line-height:1.28;${fs(desc,14)};margin-top:3px">${esc(it.note)}</div></div>`;
  const colHtml=list=>list.map(c=>`<div data-csec="${C.indexOf(c)}" style="margin:0 0 calc(${gap+6}px + var(--xg,0px))">${secHead(e,era,(family&&LABEL_FAMILY[c.k])||LABEL[c.k],c.k==="d"?ACC2:ACC,INK)}${c.items.map((it,i)=>itemHtml(c,it,i)).join("")}</div>`).join("");

  /* loyalty card: paper, stamps are spaced type, never icons */
  const stamped=Math.min(9,Math.max(3,(String(num).replace(/\D/g,"").split("").reduce((a,d)=>a+ +d,0)%7)+3));
  /* a real stamp is a short word: the film's own word if it fits the box, else the till's PAID */
  const stampWord=i=>{const w=((winks[i%Math.max(1,winks.length)]||"").replace(/^(the|a|an)\s+/i,"").split(/\s+/)[0]||"").replace(/[^A-Za-z0-9]/g,"");return (w.length>=2&&w.length<=5?w:"PAID").toUpperCase()};
  const cardInk=e.cardInk,cardAcc=readable(pal.accent,e.card,4.5,e.acc0==="#f2d36b"?"#7a5a10":e.acc0);
  const boxes=Array.from({length:10},(_,i)=>`<div style="height:44px;border:1.5px solid ${cardInk}55;border-radius:${era==="1970s"||era==="1950s"?22:3}px;display:flex;align-items:center;justify-content:center;position:relative;font-family:'${e.body}',sans-serif;font-size:15px;color:${cardInk}88">${i<stamped?`<span style="max-width:100%;overflow:hidden;white-space:nowrap;transform:rotate(${(i%3-1)*9-6}deg);color:${cardAcc};font-weight:700;letter-spacing:.04em;font-size:14px;border:2px solid ${cardAcc};padding:1px 3px;opacity:.85">${esc(stampWord(i))}</span>`:i===9?`<span style="font-weight:700;color:${cardInk}">FREE</span>`:String(i+1)}</div>`).join("");
  const card=`<div style="width:340px;flex:none;align-self:flex-start;transform:rotate(${T.tilt}deg);margin-top:${hasP?0:4}px;${hasP?"margin-left:6px;":""}background:${e.card};background-image:${noise("#5a4a30",.16,.9,180)};box-shadow:0 10px 22px rgba(0,0,0,.5);padding:14px 16px 12px;box-sizing:border-box;color:${cardInk};border-radius:${era==="modern"||era==="2000s"?10:4}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><div style="font-family:'${e.disp}',serif;font-weight:${e.dw||400};font-size:22px;line-height:1;${dispUp}white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${cardAcc}">${esc(prop?prop.title:"Coffee Card")}</div><div style="font-family:${bodyF};font-size:14px;white-space:nowrap">No. ${esc(num)}</div></div>
      <div style="font-family:${bodyF};font-size:15px;line-height:1.25;margin:6px 0 8px">${esc(prop&&prop.lines&&prop.lines[0]?sent(prop.lines[0])+" ":"")}${esc(T.card)}</div>
      <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px">${boxes}</div>
    </div>`;

  /* 11 Nov: beside a poster the note keeps its own height (it still gives way when the column is full), so spare height is shared
     between the blocks of the column instead of sitting in one gap (Despicable Me 2) */
  const noteHtml=`<div style="${hasP?"flex:0 1 auto;min-height:0":"flex:1"};min-width:0;display:flex;flex-direction:column">
      <div style="font-family:${bodyF};font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${ACC};font-size:17px;margin-bottom:6px">${esc(T.noteH)}</div>
      <div data-fit style="flex:${hasP?"0 1 auto;padding-bottom:10px":"1"};min-height:0;overflow:hidden">
        <div style="font-family:${bodyF};${e.body==="Lora"?"font-style:italic;":""}color:${INK};line-height:1.3;${fs(22,15)}">“${esc(note.t)}”</div>
        <div style="font-family:'${e.sig}',cursive;color:${ACC};${fs(e.sig==="Pinyon Script"?40:42,22)};line-height:1.1;margin-top:4px;padding-right:12px;text-align:right">${esc(note.by)}</div>
      </div></div>`;

  const fine=[`Prices subject to change`,f.P?`Showtime: ${clean(f.P).replace(/\.$/,"")}`:"",winks[1]?`Lost and found: ${winks[1]}`:"",`Board No. ${num}`].filter(Boolean).join(". ")+".";

  const board=`<div style="position:absolute;left:${FR}px;top:${BT}px;width:${W-2*FR}px;height:${BH}px;background:${BOARD};overflow:hidden">
    ${e.grooves?`<div style="position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(0,0,0,.55) 0 2px,rgba(255,255,255,.035) 2px 3px,transparent 3px 14px)"></div>`:""}
    <div style="position:absolute;inset:0;background-image:${noise("#ffffff",T.dust*(e.chalk?1:.45),.7,240)}"></div>
    ${e.chalk?`<div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 30% at 30% 35%,rgba(255,255,255,${(.05+T.wear*.05).toFixed(2)}),transparent 70%),radial-gradient(ellipse 50% 25% at 75% 70%,rgba(255,255,255,${(.04+T.wear*.05).toFixed(2)}),transparent 70%)"></div>`:""}
    ${e.sheen?`<div style="position:absolute;inset:0;background:${e.sheen}"></div>`:""}
    <div style="position:absolute;left:34px;right:34px;top:22px;bottom:16px;display:flex;flex-direction:column">
      ${!hasP&&f.T&&n<=10?`<div style="font-family:${bodyF};${e.body==="Lora"?"font-style:italic;":""}color:${ACC};font-size:24px;line-height:1.2;text-align:center;margin-bottom:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${chalkTxt}">${esc(sent(f.T))}</div>`:""}
      <div data-fit style="flex:1;min-height:0;overflow:hidden;display:flex;gap:40px">
        <div data-ccol style="flex:1;min-width:0">${colHtml(cols[0])}</div>
        ${cols[1].length?`<div style="width:2px;background:${INK};opacity:.18"></div><div data-ccol style="flex:1;min-width:0">${colHtml(cols[1])}</div>`:""}
      </div>
      ${hasP?"":`<div style="display:flex;gap:30px;height:${n>8?196:226}px;flex:none;margin-top:8px;padding-top:14px;border-top:1px solid ${INK}33">${noteHtml}${card}</div>`}
      <div style="font-family:${bodyF};font-size:16px;color:${mix(INK,BOARD,.35)};margin-top:8px;line-height:1.25;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden">${esc(fine)}</div>
    </div>
  </div>`;

  /* frame rings drawn as borders, not inset shadows (the PDF export fills inset shadows solid) */
  const rings=[...e.frameIn.matchAll(/inset 0 0 0 (\d+)px (#[0-9a-f]{3,8})/gi)].map(m=>[+m[1],m[2]]).sort((x,y)=>x[0]-y[0]);
  const ringHtml=rings.map((r,i)=>{const p0=i?rings[i-1][0]:0;return `<div style="position:absolute;inset:${p0}px;border:${r[0]-p0}px solid ${r[1]};box-sizing:border-box"></div>`}).join("");
  const frame=`<div style="position:absolute;inset:0;background:${e.frame}"></div>${ringHtml}<div style="position:absolute;inset:0;background-image:${noise("#000000",.25,.6,200)};opacity:.6"></div>`;
  const face=`<div style="position:absolute;inset:0;overflow:hidden;background:#1a1a1a">${frame}${photoFn()}<div style="position:absolute;left:${FR}px;right:${FR}px;top:${BT-3}px;height:6px;background:${ACC};z-index:2"></div>${board}${hasP?"":logoHtml}${FIT}</div>`;
  return{w:W,h:H,faces:[face]};
};
})();
