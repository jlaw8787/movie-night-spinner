/* Menu format: bistro. Registers window.MENU_FORMATS["bistro"]. Inline styles only; era and tone drive type, paper, print process, border, photo treatment and wear. */
(function(){
/* ---- shared helpers (identical block in bistro.js, hotel.js, airline.js) ---- */
const clean=s=>String(s==null?"":s).replace(/\s*[‒–—―−]\s*/g,", ").replace(/\s+-+\s+/g,", ").replace(/\s{2,}/g," ").trim();
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"]$/.test(s)?s:s+"."};
const FAMILY=new Set(["kids","fairytale"]);
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

/* stills: hero is the first still, else the poster; second is the next still, else the poster again */
function photos(ctx){
  const st=(ctx.stills||[]).filter(Boolean),po=ctx.poster?ctx.img(ctx.poster,"w780"):"";
  return{hero:st[0]?ctx.img(st[0],"w1280"):po,heroPos:st[0]?"center 40%":"center 30%",
    second:st[1]?ctx.img(st[1],"w1280"):(st[0]&&po?po:(po||"")),secondPos:st[1]?"center 45%":"center 22%",fromPoster:!st[0]};
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
    ${lg?`<img data-logo crossorigin="anonymous" alt="${esc(title)}" src="${ctx.img(lg[0],"w500")}" onload="__fmtBHA.logo(this)" onerror="__fmtBHA.nologo(this)" style="display:block;height:${lh}px;width:${lw}px;object-fit:contain;margin:${o.center?"0 auto":"0"}">`:""}${fb}
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
function money(v,era){const x=v*ERA_PRICE[era];if(ERA_PRICE[era]<.5||x<5)return x.toFixed(2);const r=Math.round(x*2)/2;return r%1?r.toFixed(2):String(r)}
/* the film's number or year hidden in one price */
function eggPrice(base,num,yy,era){const p=money(base,era);const whole=p.split(".")[0];
  if(num&&num.length===3&&+num[0]>0)return ERA_PRICE[era]<.2?num[0]+"."+num.slice(1):num.slice(0,2)+"."+num[2]+"0";
  if(num&&num.length===2)return whole+"."+num;return whole+"."+yy}
function propPaper(kind,col,paper){
  return({ticket:`background:${paper};border-radius:6px;-webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;`,
    stub:`background:${paper};border-radius:5px;border-left:3px dotted ${col};`,
    tag:`background:${paper};border-radius:5px 26px 26px 5px;`,
    slip:`background:${paper};border-top:6px solid ${col};border-radius:2px;`,
    badge:`background:${paper};border-radius:14px;box-shadow:inset 0 0 0 3px ${col},0 4px 12px rgba(0,0,0,.35);`,
    receipt:`background:${paper};border-radius:2px;`})[kind]||`background:${paper};border-radius:4px;border-bottom:7px solid ${col};`;
}
/* ---- bistro: a bistro card for two, front and back, 672x960 each ---- */
const W=672,H=960,ID="bistro";
/* era: display face, text face, paper stock, ink, fallback accent */
const LOOK=[
  {disp:"Forum",dw:400,body:"Crimson Pro",paper:"#efe5cf",ink:"#231a12",acc:"#8c1c13",caps:true,ls:".08em"},
  {disp:"Playfair Display",dw:900,body:"Lora",paper:"#f5ecd8",ink:"#2a1d16",acc:"#a3262a",caps:false,ls:"0",ital:true},
  {disp:"DM Serif Display",dw:400,body:"Source Serif 4",paper:"#fbf7ee",ink:"#1d2430",acc:"#c0392b",caps:false,ls:"-.01em"},
  {disp:"Young Serif",dw:400,body:"Libre Franklin",paper:"#ead8b4",ink:"#3a2412",acc:"#b5531c",caps:false,ls:"0"},
  {disp:"Rufina",dw:700,body:"Karla",paper:"#f6ebe6",ink:"#2b1b24",acc:"#9b2d5a",caps:true,ls:".05em"},
  {disp:"Spectral",dw:800,body:"Work Sans",paper:"#f7f4ec",ink:"#1f2421",acc:"#2f6b4f",caps:false,ls:"-.01em",ital:true},
  {disp:"Josefin Sans",dw:700,body:"Lato",paper:"#ffffff",ink:"#202020",acc:"#c43b2f",caps:true,ls:".14em"},
  {disp:"Instrument Serif",dw:400,body:"Inter",paper:"#f4f0e8",ink:"#1b1b1b",acc:"#b6452c",caps:false,ls:"-.01em",ital:true}];
const SIG="Mrs Saint Delafield";
const VOICE={warm:"A table for two",tender:"A table for two",grand:"Dîner pour deux",glossy:"Dîner pour deux",gritty:"Late service",tense:"Late service, quiet tables",eerie:"Open after dark",playful:"Two forks, one table",scrappy:"Two forks, one table"};
const NEUTRAL={venue:"The Corner Bistro",sign:"Dinner for two, every evening",by:"The Chef",
  noteText:c=>c.f.T?sentence(c.f.T)+" Sit anywhere, we'll find you.":"Sit anywhere you like. The kitchen is open until the credits roll.",
  winks:c=>[clean(c.f.T),clean(c.f.P)].filter(Boolean),
  prop:c=>({kind:"card",title:"Coat check",lines:["One coat, one umbrella","Collect after the film"]})};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const era=eraIndex(ctx.era),t=toneOf(ctx.tone),L=LOOK[era],P=PROCESS[era],T=TONES[t];
  const dark=T.dark;
  const pd=ctx.palette&&hex(ctx.palette.dark),darkBase=pd&&lum(pd)<.05?pd:hex("#1a1714");
  const paper=dark?toHex(mix(darkBase,[40,34,28],.35)):(T.copy?"#f3f2ee":L.paper);
  const K=filmColours(ctx.palette,paper,dark?"#f3ead8":L.ink,L.acc,"#2a2018");
  const fontsP=loadFonts(`${fam(L.disp)}:ital,wght@0,${L.dw}${L.ital?";1,"+L.dw:""}&${fam(L.body)}:ital,wght@0,400;0,700;1,400&${fam(SIG)}`);
  const D=`'${L.disp}',Georgia,serif`,B=`'${L.body}',Georgia,serif`,S=`'${SIG}',cursive`;
  const fm=FAMILY.has(ctx.f.theme),dry=dryer(fm),F=flavourOf(ctx,NEUTRAL),yy=String(ctx.f.year).slice(-2);
  const ph=photos(ctx),menu=ctx.menu||{};
  const inkSpread=P.ink?`text-shadow:0 0 ${P.ink}px ${rgba(K.ink,.55)};`:"";
  const dispStyle=`font-family:${D};font-weight:${L.dw};letter-spacing:${L.ls};${L.caps?"text-transform:uppercase;":""}`;
  const table=F.num||String((+yy%24)+1);
  const time=["7:30","8:00","8:30","9:15","10:45","11:30"][(+yy)%6]+" pm";
  const rot=T.rot;
  const face=(inner)=>`<div data-fmtface="${ID}" style="position:absolute;inset:0;width:${W}px;height:${H}px;overflow:hidden;background:${paper};color:${K.ink};font-family:${B}">
    ${paperLayers(t,dark,H)}${borderHTML(P.border,K.acc,T.gilt,P.border==="double"?10:0)}${inner}</div>`;
  const price=(k,i)=>{const base={s:[11,13,12,15],m:[26,29,24,32],w:[10,12,11,13],d:[8,10,9,12]}[k][i%4];
    if(k==="m"&&i===0&&F.num)return eggPrice(base,F.num,yy,era);if(k==="w"&&i===0)return eggPrice(base,"",yy,era);return money(base,era)};
  const kick=(s,col)=>`<div data-fs="14" style="font:700 18px/1.15 ${B};letter-spacing:.22em;text-transform:uppercase;color:${col||K.acc}">${esc(s)}</div>`;

  /* ---- front: sign, hero still, logo panel, specials board, house note, reservation card ---- */
  const header=`<div data-fbox style="position:absolute;left:44px;right:44px;top:38px;height:122px;text-align:center;display:flex;flex-direction:column;justify-content:safe center;overflow:hidden">
    ${kick(VOICE[t])}
    <div data-fline="2" data-fs="26" style="${dispStyle}font-size:${F.venue.length>26?40:48}px;line-height:1.02;color:${K.ink};margin-top:6px;${inkSpread}${L.ital&&!L.caps?"font-style:italic;":""}">${esc(F.venue)}</div>
    <div data-fs="15" style="font:italic 400 19px/1.2 ${B};color:${K.soft};margin-top:6px">${esc(F.sign)}</div></div>`;
  const heroH=446,heroTop=170;
  const lightPanel=rgba(dark?"#f4ecdc":paper,.94),darkPanel=rgba(K.deep,.86);
  const lp=logoPanel(ctx,{maxW:330,maxH:96,center:false,dark:darkPanel,light:lightPanel,darkk:K.light,lightk:K.acc,fbBg:rgba(paper,.93),fbK:K.acc,
    titleFont:`${L.dw} 46px ${D}`,titleCol:K.ink,under:`Now showing &nbsp;/&nbsp; ${esc(ctx.f.year)}`,underFont:`700 15px/1 ${B};letter-spacing:.2em;text-transform:uppercase`,
    style:`position:absolute;left:18px;bottom:18px;max-width:380px;padding:14px 18px 12px;border-radius:${era===3?14:3}px;box-shadow:0 6px 18px rgba(0,0,0,.35)`});
  const hero=`<div style="position:absolute;left:30px;right:30px;top:${heroTop}px;height:${heroH}px;overflow:hidden;background:${K.deep};outline:1px solid ${K.acc};outline-offset:5px;border-radius:${era===3?16:0}px">
    ${photoHTML(ph.hero,ph.heroPos,era,t)}${lp}</div>`;

  /* specials board: the sweets course chalked up on a dark slate panel (set type, no chalk font) */
  const sw=(menu.w||[]).slice(0,4);
  const boardItems=sw.length?sw.map((it,i)=>`<div data-gap style="padding-bottom:12px">
      <div style="display:flex;gap:10px;align-items:baseline"><span data-fs="17" style="flex:1;${dispStyle}font-size:27px;line-height:1.08;color:#f6efe0">${esc(dry(it.n))}</span><span data-fs="17" style="font:700 26px/1 ${D};color:${K.light}">${price("w",i)}</span></div>
      ${it.note?`<div data-clamp data-fs="14" style="font:400 19px/1.25 ${B};color:rgba(246,239,224,.82);margin-top:4px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`).join("")
    :`<div data-fs="16" style="${dispStyle}font-size:26px;line-height:1.15;color:#f6efe0">${esc(sentence(ctx.f.T||"Ask your server"))}</div>`;
  const board=`<div style="position:absolute;left:30px;top:640px;width:330px;height:286px;background:${toHex(mix(hex(K.deep),[24,28,26],.5))};border-radius:4px;box-shadow:inset 0 0 0 7px ${rgba(era===0||T.gilt?"#b48a35":"#6b4a2b",.9)},inset 0 0 40px rgba(0,0,0,.45),0 4px 10px rgba(0,0,0,.25);overflow:hidden">
    <div style="position:absolute;inset:0;background:url(&quot;${NOISE}&quot;) 0 0/300px;opacity:.25;mix-blend-mode:screen"></div>
    <div data-fbox style="position:absolute;left:24px;right:22px;top:20px;bottom:18px;overflow:hidden">
      ${kick("On the board tonight",K.light)}<div style="height:2px;background:${K.light};opacity:.5;margin:10px 0 12px"></div>${boardItems}
      ${ctx.f.P?`<div data-drop data-fs="14" style="font:italic 400 17px/1.25 ${B};color:rgba(246,239,224,.75)">${esc(sentence(dry(ctx.f.P)))}</div>`:""}</div></div>`;
  const note=`<div data-fbox style="position:absolute;left:382px;right:32px;top:640px;height:164px;overflow:hidden">
    ${kick("From the house")}
    <div data-fs="14" style="font:italic 400 19px/1.3 ${B};color:${K.ink};margin-top:8px">"${esc(dry(F.note.text))}"</div>
    <div data-fs="22" style="font:400 32px/1.1 ${S};color:${K.acc};text-align:right;margin-top:4px;transform:rotate(-3deg)">${esc(F.note.by)}</div></div>`;
  const resv=`<div style="position:absolute;left:390px;top:818px;width:248px;height:106px;transform:rotate(${(rot*.6).toFixed(1)}deg);background:${dark?"#f4ecdc":"#fffdf8"};box-shadow:0 3px 10px rgba(0,0,0,.28);border-top:5px solid ${K.acc};overflow:hidden">
    ${paperLayers("glossy",false,106)}
    <div data-fbox style="position:absolute;inset:10px 14px 8px;text-align:center;overflow:hidden">
      <div data-fs="18" style="${dispStyle}font-size:26px;line-height:1;color:${dark?"#1c1712":K.ink};letter-spacing:.2em;text-transform:uppercase">Reserved</div>
      <div data-fs="14" style="font:700 16px/1.3 ${B};color:${dark?"#1c1712":K.ink};margin-top:7px">Table ${esc(table)} &middot; for two &middot; ${time}</div>
      <div data-fs="14" style="font:italic 400 15px/1.2 ${B};color:#555;margin-top:2px">${esc(F.winks[0]||"Kept until the opening credits")}</div></div></div>`;
  const front=face(header+hero+board+note+resv);

  /* ---- back: second still, the menu, the film's own prop, fine print ---- */
  const secH=248;
  const pr=F.prop,pk=pr.kind;
  const prop=`<div style="position:absolute;right:30px;top:${secH-74}px;width:214px;transform:rotate(${(-rot*.8+1).toFixed(1)}deg);${propPaper(pk,K.acc,dark?"#f4ecdc":"#fffcf4")}box-shadow:0 4px 12px rgba(0,0,0,.35);overflow:hidden;z-index:2">
    <div data-fbox style="position:relative;padding:12px 18px 11px;max-height:112px;overflow:hidden">
      <div data-fs="14" style="font:700 14px/1 ${B};letter-spacing:.2em;text-transform:uppercase;color:${K.acc}">${pk==="ticket"||pk==="stub"?"Admit one":pk==="tag"?"Room tag":"Keep this"}</div>
      <div data-fs="15" style="${dispStyle}font-size:21px;line-height:1.05;color:#1c1712;margin:6px 0 5px">${esc(pr.title)}</div>
      ${pr.lines.map(l=>`<div data-fs="14" style="font:700 14px/1.3 ${B};color:#2a2420">${esc(dry(l))}</div>`).join("")}</div></div>`;
  const second=`<div style="position:absolute;left:0;right:0;top:0;height:${secH}px;overflow:hidden;background:${K.deep}">
    ${photoHTML(ph.second,ph.secondPos,era,t)}
    <div style="position:absolute;left:30px;bottom:16px;background:${rgba(dark?"#f4ecdc":paper,.92)};padding:6px 11px;font:700 14px/1.2 ${B};letter-spacing:.12em;text-transform:uppercase;color:${dark?"#1c1712":K.ink}">On screen tonight</div></div>
    <div style="position:absolute;left:0;right:0;top:${secH}px;height:6px;background:${K.acc}"></div>`;
  const labels=fm||t==="playful"?["To start","The plates","Sweet things","To drink"]:era<2?["Hors d'oeuvres","Plats du jour","Desserts","The cellar"]:["To start","The plates","Sweet things","From the bar"];
  const keys=["s","m","d"],labIdx={s:0,m:1,w:2,d:3};
  const item=(k,it,i)=>`<div data-gap style="padding-bottom:16px">
    <div style="display:flex;align-items:baseline;gap:10px"><span data-fs="18" style="font:700 28px/1.12 ${B};color:${K.ink}">${esc(dry(it.n))}</span><span style="flex:1;min-width:20px;border-bottom:2px dotted ${rgba(K.ink,.4)};transform:translateY(-6px)"></span><span data-fs="18" style="font:700 28px/1 ${B};color:${K.acc}">${price(k,i)}</span></div>
    ${it.note?`<div data-clamp data-fs="14" style="font:italic 400 21px/1.28 ${B};color:${K.soft};margin-top:4px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const course=k=>{const its=(menu[k]||[]).slice(0,4);if(!its.length)return"";
    return`<div style="display:flex;align-items:center;gap:14px;margin:4px 0 12px"><i style="flex:1;height:1px;background:${K.acc};opacity:.6"></i><span data-fs="22" style="${dispStyle}font-size:38px;line-height:1.05;color:${K.acc};${inkSpread}${L.ital&&!L.caps?"font-style:italic;":""}">${esc(labels[labIdx[k]])}</span><i style="flex:1;height:1px;background:${K.acc};opacity:.6"></i></div>${its.map((it,i)=>item(k,it,i)).join("")}`};
  const tag=ctx.f.T?`<div data-drop data-fs="16" style="font:italic 400 22px/1.25 ${B};color:${K.ink};text-align:center;margin:0 0 14px">${esc(sentence(dry(ctx.f.T)))}</div>`:"";
  const menuBox=`<div data-fbox style="position:absolute;left:46px;right:46px;top:${secH+92}px;bottom:118px;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center">${tag}${keys.map(course).join("")}</div>`;
  const wk=F.winks.slice(1,3).map(w=>w.replace(/\.$/,"")).join(". ");
  const fine=`<div data-fbox style="position:absolute;left:46px;right:46px;bottom:34px;height:74px;overflow:hidden;border-top:1px solid ${rgba(K.ink,.35)};padding-top:8px;text-align:center">
    <div data-fs="14" style="font:400 16px/1.35 ${B};color:${K.soft}">Prices subject to change. Service included. ${fm?"Every drink is alcohol free. ":""}${wk?esc(wk)+". ":""}Carte no. ${esc(F.num||ctx.f.year)}. Images: TMDB.</div></div>`;
  const back=face(second+prop+menuBox+fine);
  FX.schedule(fontsP);
  return{w:W,h:H,faces:[front,back]};
};
})();
