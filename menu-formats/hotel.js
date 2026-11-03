/* Menu format: hotel. Registers window.MENU_FORMATS["hotel"]. Inline styles only; era and tone drive type, paper, print process, border, photo treatment and wear. */
(function(){
/* ---- shared helpers (identical block in bistro.js, hotel.js, airline.js) ---- */
const clean=s=>String(s==null?"":s).replace(/\s*[‒–—―−]\s*/g,", ").replace(/\s+-+\s+/g,", ").replace(/\s{2,}/g," ").trim();
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"]$/.test(s)?s:s+"."};
const FAMILY=new Set(["kids","fairytale","wizard"]);
const DRY=[[/\bred wine\b|\bwhite wine\b|\bwine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bmartini\b/gi,"mocktail"],[/\bcocktail(?! franks| onions?)\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|gin|sake)\b/gi,"syrup"]];
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
  return`<img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:${P.photo} ${T.photo}">
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
      if(FX.over(box))box.querySelectorAll("[data-clamp]").forEach(e=>e.style.display="none");
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
    ${lg?`<img data-logo crossorigin="anonymous" alt="${esc(title)}" src="${ctx.img(lg[0],"w500")}" onload="window.__fmtBHA&&__fmtBHA.logo(this)" onerror="window.__fmtBHA&&__fmtBHA.nologo(this)" style="display:block;height:${lh}px;width:${lw}px;object-fit:contain;margin:${o.center?"0 auto":"0"}">`:""}${fb}
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
function money(v,era){const x=v*ERA_PRICE[era];if(ERA_PRICE[era]<.5||x<5)return x<1?String(Math.max(5,Math.round(x*20)*5))+"¢":(Math.round(x*4)/4).toFixed(2);const r=Math.round(x*2)/2;return r%1?r.toFixed(2):String(r)}
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
/* ---- hotel: grand hotel room service folder, front and back, 672x1344 each ---- */
const W=672,H=1344,ID="hotel";
const LOOK=[
  {disp:"Bellefair",dw:400,body:"EB Garamond",paper:"#f1e8d4",ink:"#1f1a14",acc:"#7b1e22",caps:true,ls:".1em"},
  {disp:"Oranienbaum",dw:400,body:"Libre Baskerville",paper:"#e9efe4",ink:"#1e2b26",acc:"#9a6f22",caps:false,ls:".01em"},
  {disp:"Jost",dw:700,body:"Jost",paper:"#fbfaf6",ink:"#13213a",acc:"#d0582a",caps:true,ls:".16em"},
  {disp:"Lustria",dw:400,body:"Raleway",paper:"#e9dcc4",ink:"#3b2616",acc:"#9c5b1a",caps:false,ls:"0"},
  {disp:"Rosarivo",dw:400,body:"Karla",paper:"#f3eef0",ink:"#1d1a2b",acc:"#8a2142",caps:true,ls:".08em",ital:true},
  {disp:"Cardo",dw:400,body:"Mulish",paper:"#f6f3ec",ink:"#212121",acc:"#2a4e7a",caps:false,ls:"0",ital:true},
  {disp:"Montserrat",dw:600,body:"Montserrat",paper:"#ffffff",ink:"#222222",acc:"#a77c26",caps:true,ls:".2em"},
  {disp:"Newsreader",dw:500,body:"Inter Tight",paper:"#f2efe9",ink:"#1b1b1b",acc:"#8a6a3c",caps:false,ls:"-.01em",ital:true}];
const SIG="Pinyon Script";
const VOICE={grand:"In-room dining",glossy:"In-room dining",warm:"With our compliments",tender:"With our compliments",eerie:"Room service, all hours",tense:"Service at any hour, no questions",gritty:"Service at any hour, no questions",playful:"Hungry? Dial zero",scrappy:"Hungry? Dial zero"};
const NEUTRAL={venue:"The Grand Hotel",sign:"In-room dining, day and night",by:"The Concierge",
  noteText:c=>"Welcome. Draw the curtains, dim the lamps and ring down whenever you like. "+(c.f.T?sentence(c.f.T):""),
  winks:c=>[clean(c.f.T),clean(c.f.P)].filter(Boolean),
  prop:c=>({kind:"tag",title:"Do not disturb",lines:["Film in progress","Knock after the credits"]})};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const era=eraIndex(ctx.era),t=toneOf(ctx.tone),L=LOOK[era],P=PROCESS[era],T=TONES[t];
  const dark=T.dark||(t==="glossy"&&era===4);
  const pd=ctx.palette&&hex(ctx.palette.dark),darkBase=pd&&lum(pd)<.05?pd:hex("#16141a");
  const paper=dark?toHex(mix(darkBase,[34,30,40],.4)):(T.copy?"#f3f2ee":L.paper);
  const K=filmColours(ctx.palette,paper,dark?"#f1e9d8":L.ink,L.acc,"#22202a");
  const fontsP=loadFonts(`${fam(L.disp)}:ital,wght@0,${L.dw}${L.ital?";1,"+L.dw:""}&${fam(L.body)}:ital,wght@0,400;0,700;1,400&${fam(SIG)}`);
  const D=`'${L.disp}',Georgia,serif`,B=`'${L.body}',Georgia,serif`,S=`'${SIG}',cursive`;
  const fm=FAMILY.has(ctx.f.theme),dry=dryer(fm),F=flavourOf(ctx,NEUTRAL),yy=String(ctx.f.year).slice(-2);
  const ph=photos(ctx),menu=ctx.menu||{};
  const inkSpread=P.ink?`text-shadow:0 0 ${P.ink}px ${rgba(K.ink,.55)};`:"";
  const dispStyle=`font-family:${D};font-weight:${L.dw};letter-spacing:${L.ls};${L.caps?"text-transform:uppercase;":""}`;
  const room=F.num||("4"+yy);
  const gold=T.gilt||era===0||era===6;
  const rule=gold?"#b48a35":K.acc;
  const face=inner=>`<div data-fmtface="${ID}" style="position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;background:${paper};color:${K.ink};font-family:${B}">
    ${paperLayers(t,dark,H)}${borderHTML(P.border,rule,gold,P.border==="double"?12:0)}${inner}</div>`;
  const price=(k,i)=>{const base={s:[16,18,15,21],m:[38,44,36,48],w:[14,16,13,17],d:[14,18,12,16]}[k][i%4];
    if(k==="m"&&i===0&&F.num)return eggPrice(base,F.num,yy,era);if(k==="w"&&i===0)return eggPrice(base,"",yy,era);return money(base,era)};
  const kick=(s,col,al)=>`<div data-fs="14" style="font:700 18px/1.15 ${B};letter-spacing:.24em;text-transform:uppercase;color:${col||K.acc};text-align:${al||"left"}">${esc(s)}</div>`;

  /* ---- front: monogram crest (type and rules), venue, suite photo, logo, note, door hanger ---- */
  const words=F.venue.split(/\s+/).filter(w=>!/^(the|hotel|of|and|at|&)$/i.test(w));
  const mono=(words[0]||"H").charAt(0)+((words[1]||"").charAt(0)||"");
  const crest=`<div style="position:absolute;left:50%;top:28px;width:84px;height:84px;margin-left:-42px;border-radius:50%;border:${era===2?4:3}px solid ${rule};box-shadow:inset 0 0 0 5px ${paper},inset 0 0 0 6px ${rule};display:flex;align-items:center;justify-content:center">
    <span style="font-family:${D};font-weight:${L.dw};font-size:${mono.length>1?32:40}px;line-height:1;color:${rule};letter-spacing:.02em;${L.ital?"font-style:italic;":""}${inkSpread}">${esc(mono.toUpperCase())}</span></div>`;
  const header=`<div data-fbox style="position:absolute;left:44px;right:44px;top:120px;height:130px;text-align:center;display:flex;flex-direction:column;justify-content:safe center;overflow:hidden">
    ${kick(VOICE[t],K.acc,"center")}
    <div data-fline="2" data-fs="26" style="${dispStyle}font-size:${F.venue.length>24?42:50}px;line-height:1.04;color:${K.ink};margin-top:8px;${inkSpread}">${esc(F.venue)}</div>
    <div data-fs="15" style="font:italic 400 20px/1.2 ${B};color:${K.soft};margin-top:7px">${esc(F.sign)}</div></div>`;
  const heroTop=262,heroH=720,posW=480,colW=360;
  const lp=logoPanel(ctx,{maxW:colW-36,maxH:74,center:true,dark:rgba(K.deep,.86),light:rgba(dark?"#f4ecdc":paper,.94),darkk:K.light,lightk:K.acc,fbBg:rgba(dark?"#f4ecdc":paper,.93),fbK:K.acc,
    titleFont:`${L.dw} 46px ${D}`,titleCol:"#1c1712",under:`In your suite ${esc(ctx.f.year)}`,underFont:`700 14px/1.3 ${B};letter-spacing:.14em;text-transform:uppercase`,
    style:`position:absolute;left:38px;top:1004px;width:${colW}px;box-sizing:border-box;padding:10px 14px 9px;text-align:center;border-radius:${era===3?16:2}px;box-shadow:0 6px 18px rgba(0,0,0,.38)`});
  const hero=`<div style="position:absolute;left:96px;top:${heroTop}px;width:${posW}px;height:${heroH}px;overflow:hidden;background:${K.deep};outline:1px solid ${rule};outline-offset:6px;border-radius:${era===3?18:0}px;box-shadow:0 6px 16px rgba(0,0,0,.3)">
    ${posterHTML(ph.hero,ph.isPoster,ph.heroPos,era,t)}</div>${lp}`;
  const note=`<div data-fbox style="position:absolute;left:38px;width:360px;top:1130px;height:196px;overflow:hidden;display:flex;flex-direction:column">
    ${kick("From the front desk")}
    <div data-fs="15" style="font:italic 400 22px/1.34 ${B};color:${K.ink};margin-top:12px">"${esc(dry(F.note.text))}"</div>
    <div data-fs="24" style="font:400 40px/1.1 ${S};color:${K.acc};margin-top:8px;transform:rotate(-2deg);transform-origin:left">${esc(F.note.by)}</div>
    ${ctx.f.P?`<div data-drop data-fs="14" style="margin-top:auto;padding-top:14px;font:400 18px/1.32 ${B};color:${K.ink}"><span style="font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:14px;color:${K.acc};display:block;margin-bottom:4px">Ring down when</span>${esc(sentence(dry(ctx.f.P)))}</div>`:""}
    <div data-drop data-fs="14" style="margin-top:${ctx.f.P?14:0}px;padding-top:12px;border-top:1px solid ${rgba(K.ink,.3)};font:700 16px/1.3 ${B};color:${K.soft};letter-spacing:.04em">Dial 0 for the kitchen. Open all night.</div></div>`;
  /* door hanger: a die-cut card with a hole, type only */
  const hg=mix(hex(K.acc),[0,0,0],dark?0:.08),hgc=contrast(hg,[255,255,255])>=4.5?"#fffaf0":"#161412";
  const box=`<span style="display:inline-block;width:15px;height:15px;border:2px solid ${hgc};margin-right:9px;vertical-align:-2px;flex:none"></span>`;
  const pick=[(menu.s||[])[0],(menu.m||[])[0],(menu.d||[])[0]].filter(Boolean);
  const hanger=`<div style="position:absolute;left:414px;top:1008px;width:226px;height:312px;transform:rotate(${(T.rot*.5).toFixed(1)}deg);filter:drop-shadow(0 5px 8px rgba(0,0,0,.35))">
    <div style="position:absolute;inset:0;background:${toHex(hg)};border-radius:${era===3||era===6?22:6}px;-webkit-mask:radial-gradient(circle 33px at 50% 56px,transparent 97%,#000 100%);mask:radial-gradient(circle 33px at 50% 56px,transparent 97%,#000 100%);overflow:hidden">
      <div style="position:absolute;inset:0;background:url(&quot;${NOISE}&quot;) 0 0/300px;opacity:.28;mix-blend-mode:multiply"></div>
      <div style="position:absolute;left:50%;top:89px;width:1px;height:0"></div>
      <div data-fbox style="position:absolute;left:18px;right:16px;top:102px;bottom:14px;overflow:hidden;color:${hgc}">
        <div data-fs="14" style="font:700 14px/1.2 ${B};letter-spacing:.2em;text-transform:uppercase">Order by 2 am</div>
        <div data-fs="18" style="${dispStyle}font-size:26px;line-height:1.05;margin:6px 0 8px">Room ${esc(room)}</div>
        ${pick.map(it=>`<div data-fs="14" style="display:flex;align-items:flex-start;font:700 15px/1.25 ${B};margin-bottom:6px">${box}<span style="flex:1;min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden">${esc(dry(it.n))}</span></div>`).join("")}
        <div data-fs="14" style="font:700 14px/1.3 ${B};margin-top:4px;letter-spacing:.06em">GUESTS &nbsp;${box}1 &nbsp;${box}2</div></div></div></div>`;
  const front=face(crest+header+hero+note+hanger);

  /* ---- back: second still full bleed, the film's prop, the menu, fine print ---- */
  const secH=400;
  const pr=F.prop,pk=pr.kind;
  const prop=`<div style="position:absolute;right:34px;top:${secH-82}px;width:226px;transform:rotate(${(-T.rot*.7+1.5).toFixed(1)}deg);${propPaper(pk,K.acc,"#fffcf4")}box-shadow:0 4px 12px rgba(0,0,0,.35);overflow:hidden;z-index:2">
    <div data-fbox style="position:relative;padding:13px 18px 12px;max-height:126px;overflow:hidden">
      <div data-fs="14" style="font:700 14px/1 ${B};letter-spacing:.2em;text-transform:uppercase;color:${K.acc}">${pk==="ticket"||pk==="stub"?"Admit one":pk==="tag"?"Hang on your door":"Front desk"}</div>
      <div data-fs="15" style="${dispStyle}font-size:23px;line-height:1.05;color:#1c1712;margin:7px 0 6px">${esc(pr.title)}</div>
      ${pr.lines.map(l=>`<div data-fs="14" style="font:700 15px/1.3 ${B};color:#2a2420">${esc(dry(l))}</div>`).join("")}</div></div>`;
  const second=`<div style="position:absolute;left:0;right:0;top:0;height:${secH}px;overflow:hidden;background:${K.deep}">
    ${ph.secondPoster?posterHTML(ph.second,true,"",era,t):photoHTML(ph.second,ph.secondPos,era,t)}
    <div style="position:absolute;left:30px;bottom:18px;background:${rgba("#fffaf0",.92)};padding:7px 12px;font:700 14px/1.2 ${B};letter-spacing:.14em;text-transform:uppercase;color:#1c1712">${esc(F.venue)}</div></div>
    <div style="position:absolute;left:0;right:0;top:${secH}px;height:8px;background:${rule}"></div>`;
  const labels=era<2?["Appetisers","From the grill","Desserts",fm?"Fountain service":"Bar service"]:["To begin","From the kitchen","Something sweet",fm?"From the fountain":"From the bar"];
  const keys=["s","m","w","d"];
  const item=(k,it,i)=>`<div data-gap style="padding-bottom:18px">
    <div style="display:flex;align-items:baseline;gap:16px"><span data-fs="18" style="flex:1;font:700 28px/1.12 ${B};color:${K.ink}">${esc(dry(it.n))}</span><span data-fs="18" style="font:700 28px/1 ${B};color:${K.acc}">${price(k,i)}</span></div>
    ${it.note?`<div data-clamp data-fs="14" style="font:400 21px/1.3 ${B};color:${K.soft};margin-top:4px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const course=(k,j)=>{const its=(menu[k]||[]).slice(0,4);if(!its.length)return"";
    return`<div style="margin:2px 0 12px;${era===2||era===6?`border-top:3px solid ${rule};padding-top:8px`:`border-bottom:1px solid ${rule};padding-bottom:6px`}"><span data-fs="22" style="${dispStyle}font-size:40px;line-height:1.05;color:${K.acc};${L.ital&&!L.caps?"font-style:italic;":""}${inkSpread}">${esc(labels[j])}</span></div>${its.map((it,i)=>item(k,it,i)).join("")}`};
  const tag=ctx.f.T?`<div data-drop data-fs="16" style="font:italic 400 23px/1.28 ${B};color:${K.ink};margin:0 0 18px">${esc(sentence(dry(ctx.f.T)))}</div>`:"";
  const menuBox=`<div data-fbox style="position:absolute;left:48px;right:48px;top:${secH+84}px;bottom:150px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${tag}${keys.map(course).join("")}</div>`;
  const wk=F.winks.slice(1,3).map(w=>w.replace(/\.$/,"")).join(". ");
  const fine=`<div data-fbox style="position:absolute;left:48px;right:48px;bottom:36px;height:100px;overflow:hidden;border-top:1px solid ${rgba(K.ink,.35)};padding-top:10px">
    <div data-fs="14" style="font:400 16px/1.38 ${B};color:${K.soft}">A tray charge applies to every order. Prices subject to change. ${fm?"Every drink is alcohol free. ":""}${wk?esc(wk)+". ":""}Form RS ${esc(room)}. Images: TMDB.</div></div>`;
  const back=face(second+prop+menuBox+fine);
  FX.schedule(fontsP);
  return{w:W,h:H,faces:[front,back]};
};
})();
