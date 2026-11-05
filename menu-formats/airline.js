/* Menu format: airline. Registers window.MENU_FORMATS["airline"]. Inline styles only; era and tone drive type, paper, print process, border, photo treatment and wear. */
(function(){
/* ---- lift helpers (identical block in cafe, bistro, motel, airline, campfire) ----
   trim: crops baked-in letterbox bars and dead flat edges off a still, then cover-fits what is left.
   logo: scores a title logo against a dark and a light panel (20th percentile contrast, so multicolour
   logos read in every part) and returns the better panel; a weak best score gets a fine halo, never a recolour. */
if(!window.__fmtLift||window.__fmtLift.v<2)window.__fmtLift={v:2,
  px(img,w){const cv=document.createElement("canvas");cv.width=w;cv.height=Math.max(8,Math.round(w*img.naturalHeight/img.naturalWidth));
    const cx=cv.getContext("2d");cx.drawImage(img,0,0,cv.width,cv.height);return{d:cx.getImageData(0,0,cv.width,cv.height).data,w:cv.width,h:cv.height}},
  trim(img,tries){try{
    if(!img.naturalWidth||img.dataset.trim==="1")return;
    const box=img.parentElement,bw=+img.dataset.bw||box.clientWidth,bh=+img.dataset.bh||box.clientHeight;
    if(!bw||!bh){if((tries||0)<6)setTimeout(()=>window.__fmtLift.trim(img,(tries||0)+1),400);return}
    img.dataset.trim="1";
    const{d,w,h}=window.__fmtLift.px(img,160),L=(x,y)=>{const i=(y*w+x)*4;return .2126*d[i]+.7152*d[i+1]+.0722*d[i+2]};
    const dead=(n,get)=>{let dk=0,s=0,s2=0;for(let j=0;j<n;j++){const l=get(j);if(l<28)dk++;s+=l;s2+=l*l}const m=s/n,v=s2/n-m*m;return dk/n>.94||(dk/n>.74&&m<34)||(v<30&&(m<46||m>238))};
    const col=x=>dead(h,y=>L(x,y)),row=y=>dead(w,x=>L(x,y));
    let l=0,r=w-1,t=0,b=h-1;
    while(l<w*.42&&col(l))l++;while(r>w*.58&&col(r))r--;while(t<h*.3&&row(t))t++;while(b>h*.7&&row(b))b--;
    if(l<2&&w-1-r<2&&t<2&&h-1-b<2)return;
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
/* ---- shared helpers (identical block in bistro.js, hotel.js, airline.js) ---- */
const clean=s=>String(s==null?"":s).replace(/\s*[‒–—―−]\s*/g,", ").replace(/\s+-+\s+/g,", ").replace(/\s{2,}/g," ").trim();
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"]$/.test(s)?s:s+"."};
const FAMILY=new Set(["kids","fairytale","wizard"]);
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
[/\bred wine\b|\bwhite wine\b|\bwine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bmartini\b/gi,"mocktail"],[/\bcocktail(?! franks| onions?)\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|gin|sake)\b/gi,"syrup"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
const dryer=fam=>s=>fam?DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s)):clean(s);

const hex=h=>{h=String(h||"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(h))return null;return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const rgba=(h,a)=>{const c=hex(h)||[0,0,0];return`rgba(${c[0]},${c[1]},${c[2]},${a})`};

/* film colours on this stock: accent must reach 3.2:1 on the paper, text ink 7:1, else the format's own colours */
function filmColours(pal,paper,ink,fbAcc,fbDeep){
  const P=hex(paper),W=[255,255,255],B=[0,0,0],darkPaper=lum(P)<.2;
  let acc=pal&&hex(pal.accent);
  if(!acc||Math.max(...acc)-Math.min(...acc)<38)acc=hex(fbAcc);
  for(let k=0;k<14&&contrast(acc,P)<3.2;k++)acc=mix(acc,darkPaper?W:B,.12);
  let deep=pal&&hex(pal.dark);
  if(!deep||lum(deep)>.06)deep=hex(fbDeep);
  if(Math.max(...deep)-Math.min(...deep)<10&&lum(deep)<.004)deep=mix(hex(fbDeep),deep,.35);
  let txt=hex(ink);if(contrast(txt,P)<7)txt=darkPaper?mix(W,P,.08):mix(B,P,.12);
  const on=a=>contrast(a,W)>=contrast(a,B)?"#fffaf0":"#141414";
  return{acc:toHex(acc),deep:toHex(deep),ink:toHex(txt),onAcc:on(acc),onDeep:on(deep),soft:toHex(mix(txt,P,.3)),light:toHex(mix(acc,W,.55))};
}

const ERAS=["1930s-40s","1950s","1960s","1970s","1980s","1990s","2000s","modern"];
function eraIndex(e){e=String(e||"").toLowerCase();if(/193|194|30s|40s/.test(e))return 0;if(/195|50s/.test(e))return 1;if(/196|60s/.test(e))return 2;if(/197|70s/.test(e))return 3;if(/198|80s/.test(e))return 4;if(/199|90s/.test(e))return 5;if(/200|2000/.test(e))return 6;return 7}
/* print process per era: photo treatment, border, halftone, gloss */
const PROCESS=[
  {press:"letterpress",photo:"grayscale(1) contrast(1.12) brightness(1.05)",border:"deco",half:false,sheen:false,ink:.9},
  {press:"letterpress",photo:"sepia(.28) saturate(.82) contrast(1.05) brightness(1.04)",border:"double",half:false,sheen:false,ink:.6},
  {press:"offset",photo:"saturate(1.15) contrast(1.06)",border:"band",half:true,sheen:false,ink:.3},
  {press:"offset",photo:"sepia(.2) saturate(1.25) contrast(.97) brightness(1.03)",border:"round",half:true,sheen:false,ink:.3},
  {press:"gloss",photo:"saturate(1.25) contrast(1.1)",border:"pin",half:false,sheen:true,ink:0},
  {press:"laser",photo:"saturate(1.06) contrast(1.04)",border:"hair",half:false,sheen:false,ink:0},
  {press:"digital",photo:"saturate(1.1) contrast(1.06) brightness(1.03)",border:"bleed",half:false,sheen:true,ink:0},
  {press:"digital",photo:"saturate(1.03)",border:"none",half:false,sheen:false,ink:0}];
const TONES={
  gritty:{wear:.85,photo:"contrast(1.18) saturate(.8)",rot:-2.5,dark:false},
  glossy:{wear:.04,photo:"saturate(1.12) contrast(1.06)",rot:0,dark:false,sheen:true},
  warm:{wear:.35,photo:"sepia(.12) saturate(1.08)",rot:-1.5,dark:false},
  eerie:{wear:.55,photo:"saturate(.55) contrast(1.15) brightness(.96) hue-rotate(-8deg)",rot:1,dark:true},
  playful:{wear:.12,photo:"saturate(1.25) brightness(1.04)",rot:-4,dark:false},
  grand:{wear:.2,photo:"contrast(1.05) saturate(1.05)",rot:0,dark:false,gilt:true},
  tender:{wear:.3,photo:"brightness(1.06) saturate(.9) contrast(.96)",rot:-2,dark:false},
  tense:{wear:.45,photo:"contrast(1.2) saturate(.85)",rot:2,dark:true},
  scrappy:{wear:.75,photo:"grayscale(1) contrast(1.45) brightness(1.05)",rot:-5,dark:false,copy:true}};
const toneOf=t=>TONES[String(t||"").toLowerCase()]?String(t).toLowerCase():"warm";

/* paper: grain asset plus procedural fibre and mottle (textures, not pictures) */
const NOISE="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .4  0 0 0 0 .33  0 0 0 0 .22  0 0 0 .55 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>");
const BLOTCH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.006' numOctaves='4' seed='11'/><feColorMatrix values='0 0 0 0 .58  0 0 0 0 .46  0 0 0 0 .28  0 0 0 .35 0'/></filter><rect width='900' height='900' filter='url(#b)'/></svg>");
const TONER="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='t'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='1' seed='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 1.2'/></filter><rect width='240' height='240' filter='url(#t)'/></svg>");
const GRAIN="assets/era/_shared/paper-grain.webp";
function root(){const s=[...document.scripts].find(x=>/wip\/genre\/formats\//.test(x.src||x.getAttribute("src")||""));if(s){const u=s.src;const i=u.indexOf("wip/genre/formats/");return i>0?u.slice(0,i):""}return""}
function paperLayers(t,dark,wh){
  const w=TONES[t].wear,R=root();
  return `<div style="position:absolute;inset:0;background:url('${R}${GRAIN}') 0 0/520px,url(&quot;${NOISE}&quot;) 0 0/300px;opacity:${dark?.22:.3+w*.35};mix-blend-mode:${dark?"screen":"multiply"};pointer-events:none"></div>
  ${w>.2?`<div style="position:absolute;inset:0;background:url(&quot;${BLOTCH}&quot;) 0 0/900px;opacity:${(w*.7).toFixed(2)};mix-blend-mode:multiply;pointer-events:none"></div>`:""}
  ${TONES[t].copy?`<div style="position:absolute;inset:0;background:url(&quot;${TONER}&quot;) 0 0/240px;opacity:.16;pointer-events:none"></div>`:""}
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${Math.round(40+w*120)}px rgba(${dark?"0,0,0":"92,62,24"},${(.12+w*.4).toFixed(2)});pointer-events:none"></div>
`;
}
/* the card's printed border, set by era (rules only) and gilt for grand */
function borderHTML(style,col,gilt,radius){
  const c=gilt?"#b48a35":col,hi=gilt?";box-shadow:inset 0 0 0 1px rgba(255,236,170,.6),0 0 0 1px rgba(90,60,10,.35)":"";
  switch(style){
    case"deco":return`<div style="position:absolute;inset:14px;border:5px double ${c};pointer-events:none${hi}"></div><div style="position:absolute;inset:26px;border:1px solid ${c};pointer-events:none"></div><div style="position:absolute;left:10px;right:10px;top:50%;height:0"></div>`;
    case"double":return`<div style="position:absolute;inset:14px;border:3px solid ${c};border-radius:${radius}px;pointer-events:none${hi}"></div><div style="position:absolute;inset:21px;border:1px solid ${c};border-radius:${Math.max(0,radius-4)}px;pointer-events:none"></div>`;
    case"band":return`<div style="position:absolute;left:0;right:0;top:0;height:14px;background:${c}${hi}"></div><div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:${c}${hi}"></div>`;
    case"round":return`<div style="position:absolute;inset:12px;border:5px solid ${c};border-radius:28px;pointer-events:none${hi}"></div>`;
    case"pin":return`<div style="position:absolute;inset:12px;border:2px solid ${c};pointer-events:none${hi}"></div><div style="position:absolute;inset:17px;border:1px solid ${c};pointer-events:none"></div><div style="position:absolute;inset:21px;border:1px solid ${c};opacity:.6;pointer-events:none"></div>`;
    case"hair":return`<div style="position:absolute;inset:16px;border:1px solid ${c};pointer-events:none${hi}"></div>`;
    case"bleed":return`<div style="position:absolute;left:0;top:0;bottom:0;width:10px;background:${c}${hi}"></div>`;
    default:return gilt?`<div style="position:absolute;inset:14px;border:2px solid ${c};pointer-events:none${hi}"></div>`:"";
  }
}
/* one photo: era process plus tone treatment, halftone or gloss over it */
function photoHTML(src,pos,era,t){
  if(!src)return"";const P=PROCESS[era],T=TONES[t];
  return`<img crossorigin="anonymous" alt="" onload="window.__fmtLift&&__fmtLift.trim(this)" onerror="window.__fmtLift&&__fmtLift.cors(this)" src="${src}" style="position:absolute;inset:0;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:${P.photo} ${T.photo}">
  ${P.half?`<div style="position:absolute;inset:0;background:radial-gradient(circle,rgba(0,0,0,.5) 28%,transparent 32%) 0 0/4px 4px;opacity:.13;mix-blend-mode:multiply"></div>`:""}
  ${(P.sheen||T.sheen)?`<div style="position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,0) 38%,rgba(255,255,255,.2) 50%,rgba(255,255,255,0) 62%)"></div>`:""}
  ${T.copy?`<div style="position:absolute;inset:0;background:url(&quot;${TONER}&quot;) 0 0/240px;opacity:.22"></div>`:""}
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${Math.round(30+T.wear*60)}px rgba(0,0,0,${(.1+T.wear*.3).toFixed(2)})"></div>`;
}
/* fonts: one link per family set, loaded once */
const FONTLINKS=window.__fmtFontLinks=window.__fmtFontLinks||{};
function loadFonts(spec){
  if(FONTLINKS[spec])return FONTLINKS[spec];
  const l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+spec+"&display=block";
  FONTLINKS[spec]=new Promise(res=>{l.onload=()=>res();l.onerror=()=>res();setTimeout(res,3000)});
  document.head.appendChild(l);return FONTLINKS[spec];
}
const fam=f=>"family="+f.replace(/ /g,"+");

/* the film poster is the hero; stills only feed the secondary photo. No poster: first still in the hero slot. */
function photos(ctx){
  /* the harness map is a top-level const, not on window: read the global binding when ctx.poster is empty */
  let pp=ctx.poster;try{if(!pp&&(typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER))pp=TMDB_POSTERS[ctx.f.id||`${ctx.f.title} (${ctx.f.year})`]||null}catch(e){}
  const st=(ctx.stills||[]).filter(Boolean),po=pp?ctx.img(pp,"w780"):"";
  const sec=st[1]||st[0]||"";
  return{hero:po||(st[0]?ctx.img(st[0],"w1280"):""),heroPos:"center 40%",isPoster:!!po,
    second:sec?ctx.img(sec,"w1280"):po,secondPos:"center 45%",secondPoster:!sec&&!!po};
}
/* the whole poster, uncropped, untinted: light paper wear on top only (a still in the hero slot keeps the era print process) */
function posterHTML(src,isPoster,pos,era,t,cover){
  if(!src)return"";
  if(!isPoster||cover)return photoHTML(src,pos,era,t);
  const P=PROCESS[era],T=TONES[t];
  return`<img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">
  ${(P.sheen||T.sheen)?`<div style="position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.14) 50%,rgba(255,255,255,0) 60%)"></div>`:""}
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${Math.round(8+T.wear*14)}px rgba(0,0,0,${(.05+T.wear*.1).toFixed(2)})"></div>`;
}

/* runtime fit: runs after the faces are mounted and fonts are in. Shrinks in 1px steps, never under data-fs, then clamps notes */
const FX=window.__fmtBHA=window.__fmtBHA||{
  over:b=>b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1,
  fit(el){
    el.querySelectorAll("[data-fline]").forEach(n=>{const lines=+n.dataset.fline||1,min=+n.dataset.fs||16;
      for(let k=0;k<60;k++){const fs=parseFloat(getComputedStyle(n).fontSize),lh=parseFloat(getComputedStyle(n).lineHeight)||fs*1.1;
        if(fs<=min||(n.scrollWidth<=n.clientWidth+1&&n.offsetHeight<=lh*lines+3))break;n.style.fontSize=(fs-1)+"px"}});
    el.querySelectorAll("[data-fbox]").forEach(box=>{
      const nodes=[...box.querySelectorAll("[data-fs]")];
      for(let k=0;k<40&&FX.over(box);k++){let ch=false;
        nodes.forEach(n=>{const s=parseFloat(getComputedStyle(n).fontSize),m=+n.dataset.fs;if(s>m){n.style.fontSize=(s-1)+"px";ch=true}});
        box.querySelectorAll("[data-gap]").forEach(g=>{const p=parseFloat(g.style.paddingBottom)||0;if(p>3){g.style.paddingBottom=(p-1)+"px";ch=true}});
        if(!ch)break}
      for(const n of [2,1])if(FX.over(box))box.querySelectorAll("[data-clamp]").forEach(e=>{e.style.display="-webkit-box";e.style.webkitBoxOrient="vertical";e.style.webkitLineClamp=String(n);e.style.overflow="hidden"});
      /* review 14: notes go one at a time from the bottom, not all at once */{const ns=[...box.querySelectorAll("[data-clamp]")];for(let i=ns.length-1;i>=0&&FX.over(box);i--)ns[i].style.display="none"}
      if(FX.over(box))box.querySelectorAll("[data-drop]").forEach(e=>e.style.display="none");
      /* last resort for extreme menus: everything down to the 14px floor */
      for(let k=0;k<30&&FX.over(box);k++){let ch=false;nodes.forEach(n=>{const s=parseFloat(getComputedStyle(n).fontSize);if(s>14){n.style.fontSize=(s-1)+"px";ch=true}});if(!ch)break}
      /* still too much: drop trailing items, always keeping the first */
      const its=[...box.querySelectorAll("[data-gap]")];for(let i=its.length-1;i>0&&FX.over(box);i--)its[i].style.display="none";
    });
  },
  fitAll(){document.querySelectorAll("[data-fmtface]").forEach(f=>FX.fit(f))},
  /* logo keeps its own colours: a dark logo gets a light panel, a light logo a dark one */
  logo(img){try{const p=img.closest("[data-lpanel]");if(!p)return;
    const cv=document.createElement("canvas");cv.width=96;cv.height=Math.max(8,Math.round(96*img.naturalHeight/img.naturalWidth));
    const cx=cv.getContext("2d");cx.drawImage(img,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;
    let s=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>128){s+=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];n++}
    const darkLogo=n&&s/n<105;p.style.background=darkLogo?p.dataset.light:p.dataset.dark;
    p.querySelectorAll("[data-lk]").forEach(k=>k.style.color=darkLogo?p.dataset.lightk:p.dataset.darkk);
  }catch(e){}},
  nologo(img){const p=img.closest("[data-lpanel]");img.remove();if(p){const fb=p.querySelector("[data-logofb]");if(fb)fb.style.display="block";FX.fit(p.closest("[data-fmtface]")||p)}},
  schedule(p){[0,300,900,1600].forEach(t=>setTimeout(()=>FX.fitAll(),t));Promise.resolve(p).then(()=>document.fonts&&document.fonts.ready).then(()=>{FX.fitAll();setTimeout(()=>FX.fitAll(),200)})}
};

/* logo panel: TMDB logo in its own colours, set type fallback */
function logoPanel(ctx,o){
  const lg=ctx.logo&&ctx.logo[0]&&ctx.logo[1]&&ctx.logo[2]?ctx.logo:null,title=clean(ctx.f.title||"");
  const r=lg?lg[1]/lg[2]:0;let lh=lg?Math.min(o.maxH,Math.round(o.maxW/r)):0,lw=Math.round(lh*r);
  const fb=`<div data-logofb data-fline="3" data-fs="22" style="display:${lg?"none":"block"};font:${o.titleFont};font-size:${title.length>40?30:title.length>22?38:46}px;line-height:1.02;color:${o.titleCol};max-width:${o.maxW}px">${esc(title)}</div>`;
  return`<div data-lpanel data-dark="${o.dark}" data-light="${o.light}" data-darkk="${o.darkk}" data-lightk="${o.lightk}" style="${o.style};background:${lg?o.dark:o.fbBg}">
    ${lg?`<img data-logo crossorigin="anonymous" alt="${esc(title)}" src="${ctx.img(lg[0],"w500")}" onload="(function(i){var p=i.closest('[data-lpanel]'),w=p&&window.__fmtLift&&__fmtLift.logo(i);if(!w)return;var dk=w==='dark';p.style.background=dk?p.dataset.dark:p.dataset.light;p.querySelectorAll('[data-lk]').forEach(function(k){k.style.color=dk?p.dataset.darkk:p.dataset.lightk})})(this)" onerror="window.__fmtBHA&&__fmtBHA.nologo(this)" style="display:block;height:${lh}px;width:${lw}px;object-fit:contain;margin:${o.center?"0 auto":"0"}">`:""}${fb}
    ${o.under?`<div data-lk style="font:${o.underFont};color:${lg?o.darkk:o.fbK};margin-top:9px;text-align:${o.center?"center":"left"}">${o.under}</div>`:""}</div>`;
}
/* film flavour with theme-neutral fallbacks */
function flavourOf(ctx,neutral){
  const fl=ctx.flavour||{};const d=x=>clean(x);
  const winks=(fl.winks||[]).map(d).filter(Boolean);
  return{venue:d(fl.venue)||neutral.venue,sign:d(fl.sign)||neutral.sign,
    note:fl.note&&fl.note.text?{text:d(fl.note.text),by:d(fl.note.by)||neutral.by}:{text:d(neutral.noteText(ctx)),by:neutral.by},
    winks:winks.length?winks:neutral.winks(ctx),prop:fl.prop&&fl.prop.title?{kind:fl.prop.kind||"card",title:d(fl.prop.title),lines:(fl.prop.lines||[]).map(d).filter(Boolean).slice(0,3)}:neutral.prop(ctx),
    num:/^\d{1,4}$/.test(String(fl.number||""))?String(fl.number):"",has:!!ctx.flavour};
}
/* prices scale with the era of the printed object */
const ERA_PRICE=[.07,.11,.16,.3,.55,.75,.9,1];
function money(v,era){const x=v*ERA_PRICE[era];if(ERA_PRICE[era]<.5||x<5)return x<.975?String(Math.max(5,Math.round(x*20)*5))+"¢":(Math.round(x*4)/4).toFixed(2);const r=Math.round(x*2)/2;return r.toFixed(2)}
/* the film's number or year hidden in one price */
function eggPrice(base,num,yy,era){if(!num)return money(base,era);const p=money(base,era);const whole=p.split(".")[0];
  if(num&&num.length===3&&+num[0]>0)return ERA_PRICE[era]<.2?num[0]+"."+num.slice(1):num.slice(0,2)+"."+num[2]+"0";
  if(num&&num.length===2)return whole+"."+num;return p}
function propPaper(kind,col,paper){
  return({ticket:`background:${paper};border-radius:6px;-webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;`,
    stub:`background:${paper};border-radius:5px;border-left:3px dotted ${col};`,
    tag:`background:${paper};border-radius:5px 26px 26px 5px;`,
    slip:`background:${paper};border-top:6px solid ${col};border-radius:2px;`,
    badge:`background:${paper};border-radius:14px;box-shadow:inset 0 0 0 3px ${col},0 4px 12px rgba(0,0,0,.35);`,
    receipt:`background:${paper};border-radius:2px;`})[kind]||`background:${paper};border-radius:4px;border-bottom:7px solid ${col};`;
}
/* ---- airline: in-flight meal card, front and back, 600x900 each ---- */
const W=600,H=900,ID="airline";
const LOOK=[
  {disp:"Antic Didone",dw:400,body:"Crimson Text",paper:"#f2ead8",ink:"#1c2333",acc:"#1f4e8c",caps:true,ls:".08em"},
  {disp:"Viga",dw:400,body:"Nunito Sans",paper:"#f7f1e1",ink:"#1b2a3a",acc:"#c8322b",caps:false,ls:"0",ital:false},
  {disp:"League Spartan",dw:800,body:"Work Sans",paper:"#ffffff",ink:"#10243e",acc:"#e0742a",caps:true,ls:".04em"},
  {disp:"Days One",dw:400,body:"Hind",paper:"#efe2c6",ink:"#3a2412",acc:"#c46a17",caps:false,ls:"0"},
  {disp:"Turret Road",dw:800,body:"Barlow",paper:"#f1f3f6",ink:"#121a2c",acc:"#d0262e",caps:true,ls:".02em",ital:true},
  {disp:"Archivo Narrow",dw:700,body:"Source Sans 3",paper:"#f5f6f2",ink:"#1d2529",acc:"#1e6aa8",caps:true,ls:".03em"},
  {disp:"Comfortaa",dw:700,body:"Open Sans",paper:"#ffffff",ink:"#1f2a36",acc:"#0f8fbf",caps:false,ls:"0"},
  {disp:"Onest",dw:800,body:"Onest",paper:"#f3f2ee",ink:"#161616",acc:"#c2412d",caps:false,ls:"-.02em"}];
const SIG="Allura";
const VOICE={grand:"First class service",glossy:"First class service",warm:"Welcome aboard",tender:"Welcome aboard",eerie:"Night flight",tense:"Please remain seated",gritty:"Please remain seated",playful:"Snacks at cruising altitude",scrappy:"Snacks at cruising altitude"};
const NEUTRAL={venue:"Flight Kitchen",sign:"Economy and first class",by:"Your Captain",
  noteText:c=>"Good evening from the flight deck. Sit back, lights down, and enjoy tonight's feature. "+(c.f.T?sentence(c.f.T):""),
  winks:c=>[clean(c.f.T),clean(c.f.P)].filter(Boolean),
  prop:c=>({kind:"ticket",title:"Boarding pass",lines:["Gate 7, now boarding","Window seat, row by the wing"]})};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const era=eraIndex(ctx.era),t=toneOf(ctx.tone),L=LOOK[era],P=PROCESS[era],T=TONES[t];
  const dark=T.dark;
  const pd=ctx.palette&&hex(ctx.palette.dark),darkBase=pd&&lum(pd)<.05?pd:hex("#11151d");
  const paper=dark?toHex(mix(darkBase,[30,34,44],.42)):(T.copy?"#f3f2ee":L.paper);
  const K=filmColours(ctx.palette,paper,dark?"#eef0f2":L.ink,L.acc,"#14213a");
  const fontsP=loadFonts(`${fam(L.disp)}:ital,wght@0,${L.dw}${L.ital?";1,"+L.dw:""}&${fam(L.body)}:ital,wght@0,400;0,700;1,400&${fam(SIG)}`);
  const D=`'${L.disp}',Arial,sans-serif`,B=`'${L.body}',Arial,sans-serif`,S=`'${SIG}',cursive`;
  const fm=FAMILY.has(ctx.f.theme),dry=dryer(fm),F=flavourOf(ctx,NEUTRAL),yy=String(ctx.f.year).slice(-2);
  const ph=photos(ctx),menu=ctx.menu||{};
  const inkSpread=P.ink?`text-shadow:0 0 ${P.ink}px ${rgba(K.ink,.5)};`:"";
  const dispStyle=`font-family:${D};font-weight:${L.dw};letter-spacing:${L.ls};${L.caps?"text-transform:uppercase;":""}${L.ital?"font-style:italic;":""}`;
  const flight=F.num||String(100+(+yy*7)%800);
  const row=F.num?(+F.num.slice(-2)%40||12):(+yy%38)+1,seat=row+"A";
  const liv=toHex(mix(hex(K.deep),hex(K.acc),era===3||era===4?.25:.08)),onLiv="#fffaf0";
  const face=inner=>`<div data-fmtface="${ID}" style="position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;background:${paper};color:${K.ink};font-family:${B}">
    ${paperLayers(t,dark,H)}${inner}${P.border==="band"||P.border==="bleed"||G==="jet"?"":borderHTML(P.border==="deco"?"double":P.border,K.acc,T.gilt,P.border==="round"?18:0).replace(/inset:1[246]px/g,"inset:8px").replace(/inset:21px/g,"inset:13px").replace(/inset:17px/g,"inset:11px").replace(/inset:26px/g,"inset:16px")}</div>`;
  const price=(k,i)=>{if(k==="m"||k==="w")return"Included";
    const base={s:[6,7,5,8],d:[5,7,6,8]}[k][i%4];if(k==="d"&&i===0)return eggPrice(base,"",yy,Math.max(era,0));return money(base,era)};
  const kick=(s,col,al)=>`<div data-fs="14" style="font:700 16px/1.15 ${B};letter-spacing:.2em;text-transform:uppercase;color:${col||K.acc};text-align:${al||"left"}">${esc(s)}</div>`;
  /* era family sets the whole build of the card, not just its colours:
     prop (30s to 50s): printed on cream, arched cabin window, double keylines, seat on a stub.
     jet (60s, 70s): photo bleeds off the top, livery block and diagonal stripes, seat on a white tile.
     wide (80s, 90s): dark livery strip, bezelled rounded window.
     mod (2000s on): white header, slim rule, wide soft window, livery tail down the edge. */
  /* tone moves the build too, so two films from one era are different printed objects:
     glossy and grand get the bleed brochure, gritty, tense and eerie the dark livery strip, scrappy the plain header */
  const G0=era<=1?"prop":era<=3?"jet":era<=5?"wide":"mod";
  const G=G0==="prop"?"prop":/glossy|grand/.test(t)?"jet":/gritty|tense|eerie/.test(t)?"wide":t==="playful"?(era>=6?"jet":"mod"):t==="scrappy"?"mod":G0;
  const stripes=(top,diag)=>{const n=era===3?3:era===4||era===2?2:1,cols=[K.acc,K.light,K.acc];
    return Array.from({length:n},(_,i)=>`<div style="position:absolute;left:-20px;right:-20px;top:${top+i*(diag?13:9)}px;height:${i?(diag?8:5):(diag?11:7)}px;background:${cols[i]};${diag?"transform:skewY(-4deg);transform-origin:0 0;box-shadow:0 1px 0 rgba(0,0,0,.15);":""}z-index:1"></div>`).join("")};
  const seatTile=(x,y,bg,fg,sub,bd)=>`<div style="position:absolute;right:${x}px;top:${y}px;width:118px;padding:8px 0 7px;text-align:center;background:${bg};${bd||""};z-index:3">
      <div style="font:700 14px/1 ${B};letter-spacing:.24em;color:${sub}">SEAT</div>
      <div style="${dispStyle}font-size:${seat.length>3?44:52}px;line-height:1.02;color:${fg};font-style:normal;margin-top:3px">${seat}</div>
      <div style="font:700 14px/1 ${B};letter-spacing:.14em;color:${sub}">WINDOW</div></div>`;
  const heading=(col,sub,acc,al)=>`${kick(`Flight ${flight} · Now boarding`,acc,al)}
        <div data-fline="2" data-fs="20" style="${dispStyle}font-size:${F.venue.length>22?(G==="prop"?30:27):(G==="prop"?36:32)}px;line-height:1.04;color:${col};margin-top:5px;text-align:${al||"left"};${G==="prop"?inkSpread:""}">${esc(F.venue)}</div>
        <div data-fs="14" style="font:${G==="prop"?"italic ":""}400 16px/1.2 ${B};color:${sub};margin-top:4px;text-align:${al||"left"}">${esc(F.sign)}</div>`;
  let strip,winTop,winH,winW,winRad,frame,winExtra="";
  if(G==="prop"){
    strip=`<div data-fbox style="position:absolute;left:30px;right:164px;top:26px;height:104px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${heading(K.ink,K.soft,K.acc)}</div>
      ${seatTile(30,28,"transparent",K.ink,K.acc,`border:2px solid ${K.acc};box-shadow:inset 0 0 0 3px ${paper},inset 0 0 0 4px ${rgba(K.acc,.6)}`)}
      <div style="position:absolute;left:30px;right:30px;top:140px;border-top:4px double ${K.acc}"></div>`;
    winTop=158;winH=560;winRad="32px 32px 6px 6px";
    frame=`0 0 0 5px ${paper},0 0 0 6px ${K.acc},0 0 0 9px ${paper},0 0 0 10px ${rgba(K.acc,.6)},0 8px 18px 8px rgba(60,40,10,.18)`;
  }else if(G==="jet"){
    strip=`<div style="position:absolute;left:0;top:0;width:410px;height:128px;background:${liv};z-index:3;box-shadow:0 4px 14px rgba(0,0,0,.3)">
        <div data-fbox style="position:absolute;left:26px;right:18px;top:12px;bottom:10px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${heading(onLiv,"rgba(255,250,240,.82)",K.light)}</div></div>
      ${seatTile(22,18,"#fffaf0",K.ink,K.acc,"box-shadow:0 6px 16px rgba(0,0,0,.35)")}`;
    winTop=0;winH=706;winW=W;winRad="0";frame="none";
    winExtra=stripes(660,true);
  }else if(G==="wide"){
    strip=`<div style="position:absolute;left:0;right:0;top:0;height:120px;background:${era===4?`linear-gradient(180deg,${toHex(mix(hex(liv),[255,255,255],.12))},${liv} 45%,${toHex(mix(hex(liv),[0,0,0],.3))})`:liv};overflow:hidden">
      <div style="position:absolute;inset:0;background:url(&quot;${NOISE}&quot;) 0 0/300px;opacity:.2;mix-blend-mode:screen"></div>
      <div data-fbox style="position:absolute;left:26px;right:168px;top:14px;bottom:10px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${heading(onLiv,"rgba(255,250,240,.82)",K.light)}</div>
      <div style="position:absolute;right:22px;top:16px;width:128px;bottom:14px;border-left:1px solid rgba(255,250,240,.35)"></div>
    </div>${seatTile(27,8,"transparent",onLiv,K.light,"")}${stripes(120)}`;
    {const n=era===3?3:era===4||era===2?2:1;winTop=[147,154,163][n-1]}winH=560;winRad="32px";
    const bez=dark?"#3a3d44":"#e4e1d9";
    frame=`0 0 0 8px ${bez},0 0 0 9px rgba(0,0,0,.18),0 0 0 14px ${rgba(bez,.55)},0 6px 16px 8px rgba(0,0,0,.18)`;
  }else{
    strip=`<div data-fbox style="position:absolute;left:${era===6?44:30}px;right:166px;top:22px;height:92px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${heading(K.ink,K.soft,K.acc)}</div>
      ${seatTile(30,22,"transparent",K.acc,K.soft,`border:2px solid ${rgba(K.acc,.7)};border-radius:14px`)}
      <div style="position:absolute;left:${era===6?44:30}px;right:30px;top:126px;height:2px;background:${K.acc}"></div>
      ${era===6?`<div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:linear-gradient(180deg,${K.acc},${K.light} 60%,${K.acc})"></div>`:""}`;
    winTop=146;winH=572;winRad="32px";
    const bez=dark?"#3a3d44":"#edeae4";
    frame=`0 0 0 9px ${bez},0 0 0 10px rgba(0,0,0,.12),0 10px 22px 4px rgba(0,0,0,.16)`;
  }
  /* the poster is the hero: whole, 2:3, on the cabin wall inside the window frame; the logo sits in the column beside it */
  const PD=10,pH=G==="jet"?552:winH-2*PD,pW=Math.round(pH*2/3);
  if(G!=="jet")winW=pW+2*PD;
  const winL=G==="jet"?0:G==="wide"?30:(G==="mod"&&era===6?36:30);
  const posL=G==="jet"?24:PD,posT=G==="jet"?140:PD;
  const wall=G==="jet"?`linear-gradient(180deg,${liv},${K.deep})`:K.deep;
  const posterBox=`<div style="position:absolute;left:${posL}px;top:${posT}px;width:${pW}px;height:${pH}px;overflow:hidden;background:#222;z-index:2;box-shadow:0 0 0 ${G==="jet"?4:2}px #fffaf0,0 6px 16px rgba(0,0,0,.45)">
        ${posterHTML(ph.hero,ph.isPoster,ph.heroPos,era,t,false)}</div>`;
  const win=`<div style="position:absolute;left:${winL}px;top:${winTop}px;width:${winW}px;height:${winH}px;border-radius:${winRad};overflow:hidden;background:${wall};box-shadow:${frame}">
      ${winExtra}${posterBox}</div>`;
  const ring=G==="jet"?0:G==="wide"?14:10;
  const colX=G==="jet"?posL+pW+26:winL+winW+ring+14,colW=W-24-colX,onWall=G==="jet";
  const bz=G==="jet"?730:winTop+winH+ring+10;
  const lp=logoPanel(ctx,{maxW:colW-24,maxH:90,center:true,dark:rgba(K.deep,.92),light:rgba(dark?"#f1efe9":"#fffdf8",.96),darkk:K.light,lightk:K.acc,fbBg:rgba(dark?"#f1efe9":"#fffdf8",.95),fbK:K.acc,
    titleFont:`${L.dw} 40px ${D}`,titleCol:"#141414",under:`${esc(ctx.f.year)}`,underFont:`700 14px/1.2 ${B};letter-spacing:.16em;text-transform:uppercase`,
    style:`position:relative;box-sizing:border-box;padding:12px 12px 10px;text-align:center;border-radius:${era>=6?14:G==="prop"?0:4}px;box-shadow:0 6px 16px rgba(0,0,0,.4)${G==="prop"?`,inset 0 0 0 3px ${rgba(K.acc,.5)}`:""}`});
  const col=`<div style="position:absolute;left:${colX}px;width:${colW}px;top:${G==="jet"?posT:winTop}px;height:${G==="jet"?pH:winH}px;display:flex;flex-direction:column;justify-content:center;gap:14px;z-index:4">
      ${kick("Now showing",onWall?K.light:K.acc,"center")}${lp}</div>`;
  const note=`<div data-fbox style="position:absolute;left:28px;width:270px;top:${bz}px;bottom:${P.border==="none"||P.border==="band"||P.border==="bleed"?24:30}px;overflow:hidden">
    ${kick("From the flight deck")}
    <div data-fs="14" style="font:italic 400 18px/1.3 ${B};color:${K.ink};margin-top:7px">"${esc(dry(F.note.text))}"</div>
    <div data-fs="20" style="font:400 32px/1.05 ${S};color:${K.acc};text-align:right;margin-top:2px">${esc(F.note.by)}</div></div>`;
  const drinks=(menu.d||[]).slice(0,3);
  const trolley=`<div style="position:absolute;left:314px;right:28px;top:${bz-6}px;bottom:${P.border==="none"||P.border==="band"||P.border==="bleed"?22:28}px;border-left:1px solid ${rgba(K.ink,.3)};padding-left:16px">
    <div data-fbox style="position:absolute;left:16px;right:0;top:6px;bottom:0;overflow:hidden">
    ${kick(fm?"From the juice trolley":"From the trolley")}
    ${drinks.map((it,i)=>`<div data-gap style="padding-bottom:8px;margin-top:8px"><div style="display:flex;gap:8px;align-items:baseline"><span data-fs="16" style="flex:1;font:700 22px/1.12 ${B};color:${K.ink};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden">${esc(dry(it.n)).replace(/(\S) (\d{1,3})(?=$|\s)/g,"$1\u00a0$2")/* a number in a drink name stays with its word ("French 75"), so it never wraps under the price */}</span><span data-fs="16" style="font:700 22px/1 ${B};color:${K.acc}">${price("d",i)}</span></div>
      ${it.note?`<div data-clamp data-fs="14" style="font:400 17px/1.25 ${B};color:${K.soft};margin-top:3px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`).join("")}
    ${drinks.length?"":`<div data-fs="14" style="font:400 18px/1.3 ${B};color:${K.soft};margin-top:8px">Tea, coffee and juice served throughout the flight.</div>`}</div></div>`;
  const front=face(strip+win+col+note+trolley);

  /* ---- back: meal header, framed still, the film's prop, the meal, fine print ---- */
  let top,sTop,sH,sFrame,sRad;
  if(G==="prop"){
    top=`<div style="position:absolute;left:30px;right:30px;top:24px;height:46px;display:flex;align-items:center;gap:14px;border-bottom:4px double ${K.acc}">
        <div data-fline="1" data-fs="18" style="flex:1;min-width:0;${dispStyle}font-size:26px;color:${K.ink};white-space:nowrap;${inkSpread}">${esc(VOICE[t])}</div>
        <div style="flex:none;font:700 15px/1 ${B};letter-spacing:.16em;color:${K.acc}">SEAT ${seat}</div></div>`;
    sTop=96;sH=258;sFrame=`box-shadow:0 0 0 6px ${paper},0 0 0 7px ${K.acc}`;sRad="0";
  }else if(G==="jet"){
    top=`<div style="position:absolute;left:0;top:0;padding:14px 26px 12px;background:${liv};z-index:3;max-width:420px">
        <div data-fline="1" data-fs="14" style="font:700 16px/1.1 ${B};letter-spacing:.18em;text-transform:uppercase;color:${onLiv};white-space:nowrap">${esc(VOICE[t])}</div></div>
      <div style="position:absolute;right:0;top:0;padding:14px 22px 12px;background:#fffaf0;z-index:3;font:700 16px/1.1 ${B};letter-spacing:.16em;color:${K.acc}">SEAT ${seat}</div>`;
    sTop=0;sH=318;sFrame="";sRad="0";
  }else if(G==="wide"){
    top=`<div style="position:absolute;left:0;right:0;top:0;height:62px;background:${liv}">
      <div style="position:absolute;left:28px;right:28px;top:0;bottom:0;display:flex;align-items:center;gap:16px">
        <div data-fline="1" data-fs="14" style="flex:1;min-width:0;font:700 16px/1.1 ${B};letter-spacing:.18em;text-transform:uppercase;color:${onLiv};white-space:nowrap">${esc(VOICE[t])}</div>
        <div style="flex:none;font:700 16px/1 ${B};letter-spacing:.16em;color:${K.light}">SEAT ${seat}</div></div></div>${stripes(62)}`;
    sTop=92;sH=254;sFrame=`outline:1px solid ${K.acc};outline-offset:4px`;sRad=era===3?"12px":"0";
  }else{
    top=`<div style="position:absolute;left:${era===6?44:30}px;right:30px;top:22px;height:44px;display:flex;align-items:center;gap:16px;border-bottom:2px solid ${K.acc}">
        <div data-fline="1" data-fs="14" style="flex:1;min-width:0;font:700 16px/1.1 ${B};letter-spacing:.18em;text-transform:uppercase;color:${K.ink};white-space:nowrap">${esc(VOICE[t])}</div>
        <div style="flex:none;font:700 16px/1 ${B};letter-spacing:.16em;color:${K.acc}">SEAT ${seat}</div></div>
      ${era===6?`<div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:linear-gradient(180deg,${K.acc},${K.light} 60%,${K.acc})"></div>`:""}`;
    sTop=88;sH=262;sFrame="";sRad="22px";
  }
  const sL=G==="jet"?0:era===6?44:28,sR=G==="jet"?0:28;
  const still=`<div style="position:absolute;left:${sL}px;right:${sR}px;top:${sTop}px;height:${sH}px;overflow:hidden;background:${K.deep};${sFrame};border-radius:${sRad}">
      ${ph.secondPoster?posterHTML(ph.second,true,"",era,t):photoHTML(ph.second,ph.secondPos,era,t)}
      <div style="position:absolute;left:12px;bottom:${G==="jet"?26:12}px;background:${rgba("#fffaf0",.92)};padding:6px 10px;font:700 14px/1.2 ${B};letter-spacing:.12em;text-transform:uppercase;color:#1c1712">Now showing</div></div>${G==="jet"?stripes(sTop+sH-12,true):""}`;
  const pr=F.prop,pk=pr.kind;
  const prop=`<div style="position:absolute;right:20px;top:${sTop+sH-66}px;width:206px;transform:rotate(${(-T.rot*.7+2).toFixed(1)}deg);${propPaper(pk,K.acc,"#fffcf4")}box-shadow:0 4px 12px rgba(0,0,0,.35);overflow:hidden;z-index:2">
    <div data-fbox style="position:relative;padding:11px 16px 10px;max-height:110px;overflow:hidden">
      <div data-fs="14" style="font:700 14px/1 ${B};letter-spacing:.2em;text-transform:uppercase;color:${K.acc}">${pk==="ticket"||pk==="stub"?"Admit one":pk==="tag"?"Luggage tag":"Keep this"}</div>
      <div data-fs="15" style="${dispStyle}font-size:20px;line-height:1.05;color:#1c1712;margin:6px 0 5px">${esc(pr.title)}</div>
      ${pr.lines.map(l=>`<div data-fs="14" style="font:700 14px/1.3 ${B};color:#2a2420">${esc(dry(l))}</div>`).join("")}</div></div>`;
  const labels=["To begin","Main course","Dessert"];
  const keys=["s","m","w"];
  const item=(k,it,i)=>`<div data-gap style="padding-bottom:12px">
    <div style="display:flex;align-items:baseline;gap:12px"><span data-fs="17" style="flex:1;font:700 26px/1.12 ${B};color:${K.ink}">${esc(dry(it.n))}</span><span data-fs="15" style="font:700 ${price(k,i)==="Included"?18:26}px/1 ${B};color:${K.acc};${price(k,i)==="Included"?"letter-spacing:.08em;text-transform:uppercase":""}">${price(k,i)}</span></div>
    ${it.note?`<div data-clamp data-fs="14" style="font:400 20px/1.28 ${B};color:${K.soft};margin-top:3px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const course=(k,j)=>{const its=(menu[k]||[]).slice(0,4);if(!its.length)return"";
    return`<div style="display:flex;align-items:center;gap:12px;margin:2px 0 8px"><span data-fs="20" style="${dispStyle}font-size:34px;line-height:1.05;color:${K.acc};${inkSpread}">${esc(labels[j])}</span><i style="flex:1;height:2px;background:${K.acc};opacity:.45"></i></div>${its.map((it,i)=>item(k,it,i)).join("")}`};
  const menuBox=`<div data-fbox style="position:absolute;left:36px;right:36px;top:${sTop+sH+60}px;bottom:106px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${keys.map(course).join("")}</div>`;
  const wk=F.winks.slice(1,3).map(w=>w.replace(/\.$/,"")).join(". ");
  const fine=`<div data-fbox style="position:absolute;left:36px;right:36px;bottom:${P.border==="none"||P.border==="band"||P.border==="bleed"?20:26}px;height:74px;overflow:hidden;border-top:1px solid ${rgba(K.ink,.35)};padding-top:8px">
    <div data-fs="14" style="font:400 15px/1.35 ${B};color:${K.soft}">Meals subject to availability. Trolley prices in local currency. ${fm?"Every drink is alcohol free. ":""}${wk?esc(wk)+". ":""}Card ${esc(flight)}/${esc(ctx.f.year)}. Images: TMDB.</div></div>`;
  const back=face(top+still+prop+menuBox+fine);
  FX.schedule(fontsP);
  return{w:W,h:H,faces:[front,back]};
};
})();
