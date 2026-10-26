/* Format: club. A nightclub or casino card on black gloss stock (two tall faces, 600x1200).
   Front: the stage photo (over half the face), the club's name, the host's note and a VIP member card.
   Back: a second still, the supper and bar list, the house rules in fine print.
   Era sets the stock and finish (deco lacquer with gilt double rule, Vegas lounge script, mod stripes,
   disco chrome, 80s neon, 90s matte with foil, 2000s casino gloss, modern hairline), the type pairing,
   the photo process and the VIP card material. Tone sets photo treatment, light falloff, wear, tilt and voice.
   Fonts (fmt-club): Forum, Norican, Syne, Bungee Shade, Exo 2, Unica One, Jura, Young Serif. */
(function(){
const W=600,H=1200;
/* ---------- shared helpers ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[‐-―−]\s*/g,", ").replace(/\s+-\s+/g,", ").replace(/--+/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cap=s=>{s=clean(s).trim();return s?s.charAt(0).toUpperCase()+s.slice(1):""};
const sent=s=>{s=cap(s);return !s?"":/[.!?]$/.test(s)?s:s+"."};
const DRY=[[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|gin|kir)\b/gi,"syrup"]];
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
const hex=h=>{h=String(h||"").replace("#","");if(/^[0-9a-f]{3}$/i.test(h))h=h.replace(/./g,"$&$&");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=c=>{const a=hex(c);if(!a)return 0;const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(a[0])+.7152*f(a[1])+.0722*f(a[2])};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>{const x=hex(a),y=hex(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t))};
const sat=c=>{const a=hex(c);if(!a)return 0;const mx=Math.max(...a),mn=Math.min(...a);return mx?(mx-mn)/mx:0};
function readable(c,bg,min,fb){if(!hex(c)||sat(c)<.18)c=fb;if(cr(c,bg)>=min)return c;const to=lum(bg)<.3?"#ffffff":"#000000";for(let t=.08;t<.95;t+=.08){const m=mix(c,to,t);if(cr(m,bg)>=min)return m}return to}
function loadFonts(id,fams){const k="fmt-font-"+id;if(document.getElementById(k))return;const l=document.createElement("link");l.id=k;l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?"+fams.map(f=>"family="+f.replace(/ /g,"+")).join("&")+"&display=swap";document.head.appendChild(l)}
const svgUrl=s=>`url('data:image/svg+xml,${encodeURIComponent(s)}')`;
const noise=(rgb,a,freq,size)=>{const[r,g,b]=hex(rgb).map(v=>(v/255).toFixed(3));return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${(a*3).toFixed(2)} 0 0 0 ${(-a*1.2).toFixed(2)}"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`)};
const CHALKSOFT=svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="m"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 0 0 0 2.5"/></filter><rect width="100%" height="100%" filter="url(#m)"/></svg>`);
const CHALKMASK=svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="m"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3.2 0 0 0 2.75"/></filter><rect width="100%" height="100%" filter="url(#m)"/></svg>`);
/* runtime fit: every [data-fit] box scales its type (CSS var --k) until nothing overflows; notes drop as a last resort */
const FIT=`<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="position:absolute;width:1px;height:1px;opacity:0;left:0;top:0" onload="(function(r){function f(){r.querySelectorAll('[data-fit]').forEach(function(b){var k=1;b.style.setProperty('--k',1);b.style.removeProperty('--nd');b.style.removeProperty('--ql');b.style.removeProperty('--dl');var o=function(){return b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1};while(o()&&k>.56){k-=.04;b.style.setProperty('--k',k.toFixed(2))}if(o())b.style.setProperty('--nd','none');if(o())b.style.setProperty('--dl','1');var q=8;while(o()&&q>1&&b.hasAttribute('data-q')){b.style.setProperty('--ql',q);q--}})}f();if(document.fonts)document.fonts.ready.then(f);setTimeout(f,900);setTimeout(f,2200)})(this.parentNode)">`;
const fs=(px,min)=>`font-size:max(${min||14}px,calc(${px}px * var(--k,1)))`;
/* logo panel tone: a dark logo flips its panel to the light stock */
const LOGOTONE=`onload="(function(i){try{var c=document.createElement('canvas'),w=c.width=72,h=c.height=Math.max(8,Math.round(72*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,w,h);var d=x.getImageData(0,0,w,h).data,s=0,n=0,q=0;for(var k=0;k<d.length;k+=4){if(d[k+3]>140){var y=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];s+=y;if(y<90)q++;n++}}var p=i.closest('[data-lp]');if(n&&p&&(s/n<90||q/n>.3)===(p.dataset.dark==='1')){p.style.background=p.dataset.alt;p.style.boxShadow=p.dataset.altsh}}catch(e){}})(this)"`;
function logoBox(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a),w=h*a;
  return{w:Math.round(w),h:Math.round(h),html:`<img crossorigin="anonymous" alt="${esc(ctx.f.title)}" src="${ctx.img(L[0],"w500")}" ${LOGOTONE} style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain">`}}
function posterOf(ctx){if(ctx.poster)return ctx.poster;try{return(typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[ctx.f.id])||null}catch(e){return null}}
function photo(ctx,path,w,h,filter,pos){const poster=posterOf(ctx);
  if(path)return `<img alt="" src="${ctx.img(path,"w1280")}" style="position:absolute;inset:0;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos||"50% 40%"};filter:${filter}">`;
  if(poster)return `<img alt="" src="${ctx.img(poster,"w780")}" style="position:absolute;inset:-30px;width:${w+60}px;height:${h+60}px;object-fit:cover;filter:blur(18px) brightness(.7) ${filter}"><img alt="" src="${ctx.img(poster,"w780")}" style="position:absolute;left:50%;top:0;height:${h}px;transform:translateX(-50%);filter:${filter};box-shadow:0 0 40px rgba(0,0,0,.5)">`;
  return `<div style="position:absolute;inset:0;background:#333"></div>`}
function yy(f){return String(f.year||"").slice(-2)||"00"}
function numOf(fl,f){const n=fl&&String(fl.number||"").replace(/[^0-9A-Za-z]/g,"");return n||String(f.year||"")}
function courses(ctx,family){const m=ctx.menu||{};const fix=s=>family?DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s)):clean(s);
  return["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(it=>it&&it.n).slice(0,4).map(it=>({n:cap(fix(it.n)),note:sent(fix(it.note))}))})).filter(c=>c.items.length)}
const pick=(arr,seed)=>arr[Math.abs([...String(seed)].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%arr.length];


const TONE={
  gritty:{f:"contrast(1.16) saturate(.82)",vig:.7,wear:.8,tilt:-4,kick:"Cash at the door. No questions",noteH:"From the back office"},
  glossy:{f:"saturate(1.18) contrast(1.06) brightness(1.04)",vig:.35,wear:0,tilt:-2,kick:"Tonight, live on stage",noteH:"Your host for the evening"},
  warm:{f:"saturate(1.1) sepia(.12) brightness(1.04)",vig:.45,wear:.3,tilt:-3,kick:"Every night, a table for you",noteH:"A word from the house"},
  eerie:{f:"saturate(.7) brightness(.92) contrast(1.1) hue-rotate(-8deg)",vig:.8,wear:.6,tilt:-1.5,kick:"The show starts when the lights go out",noteH:"Left on your table"},
  playful:{f:"saturate(1.3) brightness(1.06)",vig:.3,wear:.2,tilt:-6,kick:"Doors open, the floor is yours",noteH:"Psst, from the stage"},
  grand:{f:"contrast(1.08) saturate(1.06)",vig:.55,wear:.1,tilt:-2,kick:"An evening of the finest kind",noteH:"With the compliments of"},
  tender:{f:"brightness(1.05) saturate(.9) contrast(.96)",vig:.4,wear:.3,tilt:-3,kick:"One more song before closing",noteH:"For the last table"},
  tense:{f:"contrast(1.22) saturate(.78)",vig:.75,wear:.5,tilt:3,kick:"Members only. Watch the door",noteH:"Read it, then lose it"},
  scrappy:{f:"contrast(1.24) saturate(.75) brightness(1.05)",vig:.5,wear:1,tilt:-8,kick:"Cover at the door, no dress code",noteH:"Scribbled on a coaster"}};
const ERA={
  "1930s-40s":{disp:"Forum",body:"Cormorant Garamond",bw:"500;600;700",sig:"Pinyon Script",up:true,ls:".14em",stock:"#0c0b09",ink:"#efe6d0",acc0:"#c9a24a",
    border:"deco",photoF:"grayscale(1) contrast(1.15) brightness(1.06)",card:"linear-gradient(135deg,#7a5a1c,#e8c66a 35%,#b38a34 55%,#f3dc8e 75%,#8a6a24)",cardInk:"#2a1d06",P:{s:[35,45,40,50],m:[1.25,1.5,1.35,1.75],w:[25,35,30,40],d:[45,50,40,60]},cents:true},
  "1950s":{disp:"Norican",body:"Raleway",bw:"500;700;800",sig:"Pinyon Script",up:false,ls:"0",stock:"#120a0c",ink:"#fbeee6",acc0:"#ff5d8f",acc2:"#47d6c9",
    border:"round",photoF:"saturate(1.18) sepia(.1) contrast(1.05)",card:"linear-gradient(135deg,#1c6f6a,#47d6c9 45%,#1c6f6a)",cardInk:"#06201e",P:{s:[.85,1.1,.95,1.25],m:[2.95,3.5,3.25,3.75],w:[.65,.75,.6,.8],d:[.75,.9,.8,1]}},
  "1960s":{disp:"Syne",dw:800,body:"Work Sans",bw:"400;600;700",sig:"Pinyon Script",up:true,ls:".02em",stock:"#0d0d0f",ink:"#f6f4ef",acc0:"#ff7a1a",
    border:"stripes",photoF:"contrast(1.14) saturate(1.2)",card:"linear-gradient(135deg,#f6f4ef,#d9d6cf)",cardInk:"#0d0d0f",P:{s:[1.25,1.5,1.35,1.75],m:[3.95,4.5,4.25,4.95],w:[.95,1.1,.85,1.25],d:[1,1.25,1.1,1.5]}},
  "1970s":{disp:"Bungee Shade",body:"Montserrat",bw:"400;600;700",sig:"Allura",up:true,ls:".02em",stock:"#0b0a10",ink:"#f3eefc",acc0:"#e6b94a",
    border:"chrome",photoF:"saturate(1.1) contrast(1.02) brightness(1.08) sepia(.12)",bloom:true,card:"linear-gradient(135deg,#8b8b93,#f2f2f6 30%,#a3a3ad 50%,#ffffff 70%,#7c7c86)",cardInk:"#16161c",P:{s:[1.95,2.5,2.25,2.75],m:[5.95,6.5,6.25,6.95],w:[1.5,1.75,1.25,1.95],d:[1.5,2,1.75,2.25]}},
  "1980s":{disp:"Exo 2",dw:"900",ital:true,body:"Rajdhani",bw:"500;600;700",sig:"Allura",up:true,ls:".01em",stock:"#07070c",ink:"#ffffff",acc0:"#ff2e9a",acc2:"#21e4ff",
    border:"neon",photoF:"contrast(1.12) saturate(1.25)",card:"linear-gradient(135deg,#1a0630,#3a0a5e 50%,#0a2a4a)",cardInk:"#ffffff",P:{s:[4.5,5.5,4.95,5.95],m:[12.5,14.95,13.5,15.95],w:[3.95,4.5,3.75,4.95],d:[3.5,4.5,3.95,4.75]}},
  "1990s":{disp:"Unica One",body:"Manrope",bw:"400;600;700",sig:"Allura",up:true,ls:".12em",stock:"#141416",ink:"#ececea",acc0:"#b9c3cc",
    border:"foil",photoF:"contrast(1.06) saturate(.95) hue-rotate(-4deg)",card:"linear-gradient(135deg,#2a2d31,#4a4f55 50%,#1d1f22)",cardInk:"#ececea",P:{s:[6,8,7,9],m:[16,19,17,22],w:[6,7,5.5,8],d:[5,6,5.5,7]}},
  "2000s":{disp:"Jura",dw:700,body:"Exo 2",bw:"400;600;700",sig:"Allura",up:true,ls:".06em",stock:"#060608",ink:"#f5f5f5",acc0:"#d4af37",
    border:"gloss",photoF:"saturate(1.12) contrast(1.1)",card:"linear-gradient(135deg,#050505,#2b2b2b 45%,#0a0a0a 55%,#3a3a3a)",cardInk:"#f5f5f5",P:{s:[9,12,11,14],m:[24,29,26,32],w:[9,11,10,12],d:[8,10,9,12]}},
  "modern":{disp:"Young Serif",body:"Manrope",bw:"400;600;700",sig:"Allura",up:false,ls:"0",stock:"#0e0e0e",ink:"#f1ede4",acc0:"#c8a46a",
    border:"hair",photoF:"none",card:"linear-gradient(135deg,#1b1b1b,#0c0c0c)",cardInk:"#f1ede4",P:{s:[12,16,14,18],m:[28,34,31,38],w:[12,14,11,15],d:[11,13,12,15]}}};
function eraOf(e){e=String(e||"").toLowerCase();if(ERA[e])return e;if(/30|40/.test(e))return"1930s-40s";if(/2000|00s/.test(e))return"2000s";const m=e.match(/(19)?([5-9])0/);if(m)return"19"+m[2]+"0s";return"modern"}
function money(era,k,i,f){const e=ERA[era],v=e.P[k][i%4],y=yy(f);
  if(k==="d"&&i===0)return e.cents?y+"¢":Math.floor(v)+"."+y;
  if(e.cents&&v<1)return Math.round(v)+"¢";if(e.cents)return v>=1?v.toFixed(2):v+"¢";
  return era==="modern"&&Number.isInteger(v)?String(v):v.toFixed(2)}

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS["club"]=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,era=eraOf(ctx.era),e=ERA[era],T=TONE[ctx.tone]||TONE.warm;
  loadFonts("club-"+era,[e.disp+(e.dw?(e.ital?":ital,wght@1,":":wght@")+e.dw:""),e.body+":wght@"+e.bw,e.sig]);
  const family=FAMILY.has(f.theme);
  const pal=ctx.palette||{};
  const STOCK=e.stock,INK=e.ink;
  const ACC=readable(pal.accent,STOCK,4.5,e.acc0);
  const ACC2=e.acc2?e.acc2:ACC;
  const venue=clean(fl&&fl.venue)||"The Club";
  const sign=clean(fl&&fl.sign)||"Supper, music and a late show";
  const note=fl&&fl.note&&fl.note.text?{t:sent(fl.note.text),by:clean(fl.note.by)}:{t:sent(f.T||"Sit close to the stage. The best seats in the house are the ones nobody asks for."),by:"The Management"};
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl&&fl.prop&&fl.prop.title?fl.prop:null;
  const num=numOf(fl,f);
  const C=courses(ctx,family);
  const s0=ctx.stills&&ctx.stills[0],s1=ctx.stills&&(ctx.stills[1]||ctx.stills[0]);
  const BODY=`'${e.body}',sans-serif`,DISP=`'${e.disp}',serif`;
  const dispW=e.dw||400,dispSt=(e.ital?"font-style:italic;":"")+(e.up?"text-transform:uppercase;":"")+`letter-spacing:${e.ls};`;
  const filt=`${e.photoF==="none"?"":e.photoF} ${T.f}`;
  const LABEL={s:"Small Plates",m:"Supper",w:"After the Show",d:family?"Coolers and Floats":"From the Bar"};

  /* stock: black gloss with sheen and fine grain; era decides border */
  const stock=`<div style="position:absolute;inset:0;background:${STOCK}"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(165deg,rgba(255,255,255,${era==="1990s"||era==="modern"?.03:.09}) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 68%,rgba(255,255,255,${era==="1990s"||era==="modern"?.02:.05}) 100%)"></div>
    <div style="position:absolute;inset:0;background-image:${noise("#ffffff",.05+T.wear*.06,.9,200)}"></div>`;
  const border=(()=>{switch(e.border){
    case"deco":return `<div style="position:absolute;inset:14px;border:3px double ${ACC};pointer-events:none"></div><div style="position:absolute;inset:24px;border:1px solid ${ACC}88;pointer-events:none"></div>`;
    case"round":return `<div style="position:absolute;inset:14px;border:2px solid ${ACC};border-radius:28px;pointer-events:none"></div>`;
    case"stripes":return `<div style="position:absolute;left:0;top:0;bottom:0;width:30px;background:linear-gradient(90deg,${ACC} 0 8px,transparent 8px 11px,${mix(ACC,"#ffffff",.4)} 11px 17px,transparent 17px 20px,${mix(ACC,"#000000",.3)} 20px 26px,transparent 26px)"></div>`;
    case"chrome":return `<div style="position:absolute;inset:10px;border:4px solid transparent;border-image:linear-gradient(180deg,#f4f4f8,#7a7a84 30%,#ffffff 50%,#6a6a74 70%,#e8e8ee) 1;pointer-events:none"></div>`;
    case"neon":return `<div style="position:absolute;inset:16px;border:3px solid ${ACC};border-radius:14px;box-shadow:0 0 10px ${ACC},0 0 26px ${ACC}aa,inset 0 0 10px ${ACC}88;pointer-events:none"></div>`;
    case"foil":return `<div style="position:absolute;left:24px;right:24px;top:20px;height:2px;background:linear-gradient(90deg,#6f757b,#e9edf0,#7b8187)"></div><div style="position:absolute;left:24px;right:24px;bottom:20px;height:2px;background:linear-gradient(90deg,#6f757b,#e9edf0,#7b8187)"></div>`;
    case"gloss":return `<div style="position:absolute;inset:12px;border:1.5px solid ${ACC};pointer-events:none"></div><div style="position:absolute;inset:18px;border:1px solid ${ACC}55;pointer-events:none"></div>`;
    default:return `<div style="position:absolute;inset:22px;border:1px solid ${ACC}66;pointer-events:none"></div>`}})();
  const PAD=e.border==="stripes"?48:40;

  /* ---------- front ---------- */
  const PH=650;
  const LB=logoBox(ctx,W-2*PAD-40,ctx.logo&&ctx.logo[1]/ctx.logo[2]<2.2?170:120);
  const bloom=e.bloom&&s0?`<img alt="" src="${ctx.img(s0,"w780")}" style="position:absolute;inset:0;width:${W}px;height:${PH}px;object-fit:cover;filter:blur(14px) brightness(1.1) ${filt};mix-blend-mode:screen;opacity:.55">`:"";
  const lamps=`<div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 30%,rgba(0,0,0,0) 30%,rgba(0,0,0,${T.vig}) 100%)"></div>`;
  const neonEdge=e.border==="neon"?`box-shadow:0 0 0 3px ${ACC2},0 0 22px ${ACC2}`:`box-shadow:0 10px 30px rgba(0,0,0,.6)`;
  const fade=`-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 100%);mask-image:linear-gradient(180deg,#000 62%,transparent 100%);`;
  const photoBox=`<div style="position:absolute;left:0;top:0;width:${W}px;height:${PH}px;overflow:hidden;${fade}">${photo(ctx,s0,W,PH,filt,"50% 30%")}${bloom}${lamps}</div>`;
  const logo=LB?`<div data-lp data-dark="1" data-alt="rgba(245,241,232,.94)" data-altsh="0 8px 24px rgba(0,0,0,.6)" style="position:absolute;left:50%;transform:translateX(-50%);top:${PH-LB.h-70}px;padding:14px 20px;background:rgba(0,0,0,.55);border-radius:${e.border==="round"||e.border==="neon"?16:2}px;${e.border==="deco"?`border:1px solid ${ACC};`:""}">${LB.html}</div>`
    :`<div data-fit style="position:absolute;left:${PAD}px;right:${PAD}px;top:${PH-190}px;height:150px;overflow:hidden;display:flex;align-items:flex-end;justify-content:center;text-align:center"><div style="font-family:${DISP};font-weight:${dispW};${dispSt}color:#fff;line-height:1.02;${fs(f.title&&f.title.length>20?44:64,18)};text-shadow:0 4px 18px rgba(0,0,0,.8)">${esc(f.title)}</div></div>`;
  const vlen=venue.length;
  const vSize=Math.max(30,Math.min(e.up?58:66,Math.floor((W-2*PAD)/(Math.max(8,vlen)*(e.up?.62:.5)))));
  const neonTxt=e.border==="neon"?`text-shadow:0 0 6px ${ACC},0 0 18px ${ACC},0 0 34px ${ACC}aa;color:#fff;`:e.border==="chrome"?`background:linear-gradient(180deg,#ffffff,#9a9aa4 45%,#f6f6fa 55%,#8a8a94);-webkit-background-clip:text;background-clip:text;color:transparent;`:`color:${era==="1950s"?ACC:INK};`;
  const head=`<div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${PH+6}px;text-align:center">
      <div style="font-family:${BODY};font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:${ACC};font-size:16px;line-height:1.3">${esc(T.kick)}</div>
      <div data-fit style="height:${Math.round(vSize*2.2)}px;overflow:hidden;display:flex;align-items:center;justify-content:center"><div style="font-family:${DISP};font-weight:${dispW};${dispSt}${neonTxt}line-height:1.04;${fs(vSize,24)}">${esc(venue)}</div></div>
      <div style="font-family:${BODY};font-weight:600;color:${mix(INK,STOCK,.2)};font-size:18px;letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(sign)}</div></div>`;
  const noteTop=PH+40+Math.round(vSize*2.2)+40;
  const cardH=176,cardTop=H-cardH-46;
  const noteBox=`<div data-fit data-q style="position:absolute;left:${PAD+6}px;right:${PAD+6}px;top:${noteTop}px;height:${cardTop-noteTop-18-Math.ceil(150*Math.abs(Math.sin(T.tilt*Math.PI/180)))-6}px;overflow:hidden;text-align:center;display:flex;flex-direction:column;justify-content:safe center">
      <div style="font-family:${BODY};font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${ACC};${fs(15,14)};margin-bottom:6px">${esc(T.noteH)}</div>
      <div style="font-family:${BODY};${e.body==="Cormorant Garamond"?"font-style:italic;font-weight:500;":""}color:${INK};line-height:1.32;${fs(e.body==="Cormorant Garamond"?24:21,14)};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--ql,12);overflow:hidden;flex:none">“${esc(note.t)}”</div>
      <div style="font-family:'${e.sig}',cursive;color:${ACC};${fs(40,22)};line-height:1.15;margin-top:2px">${esc(note.by)}</div></div>`;
  const ci=e.cardInk;
  const card=`<div style="position:absolute;left:${(W-300)/2}px;top:${cardTop}px;width:300px;height:${cardH}px;border-radius:14px;background:${e.card};transform:rotate(${T.tilt}deg);box-shadow:0 14px 30px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.35);padding:14px 18px;box-sizing:border-box;color:${ci};display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
      <div style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,0) 35%,rgba(255,255,255,.22) 45%,rgba(255,255,255,0) 55%)"></div>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:baseline;gap:8px"><div style="font-family:${BODY};font-weight:700;font-size:14px;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(venue)}</div></div>
      <div style="position:relative;font-family:${DISP};font-weight:${dispW};${e.ital?"font-style:italic;":""}font-size:58px;line-height:.9;letter-spacing:.06em;${e.border==="neon"?`text-shadow:0 0 8px ${ACC2},0 0 20px ${ACC2};`:""}">VIP</div>
      <div style="position:relative;font-family:${BODY};font-size:14px;line-height:1.25">
        <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(prop?prop.title:"Members and guests")}</div>
        <div style="display:flex;justify-content:space-between;gap:8px;white-space:nowrap"><span style="overflow:hidden;text-overflow:ellipsis">${esc(prop&&prop.lines&&prop.lines[0]?prop.lines[0]:"Admit the bearer")}</span><span>No. ${esc(String(num).slice(0,9))}</span></div></div></div>`;
  const face0=`<div style="position:absolute;inset:0;overflow:hidden">${stock}${photoBox}${border}${logo}${head}${noteBox}${card}${FIT}</div>`;

  /* ---------- back ---------- */
  const SH=330;
  const n=C.reduce((a,c)=>a+c.items.length,0);
  const dish=n<=6?28:n<=10?26:24,desc=n<=6?21:20;
  const secH=label=>{switch(e.border){
    case"deco":return `<div style="display:flex;align-items:center;gap:12px;margin:0 0 8px"><div style="flex:1;border-top:3px double ${ACC}"></div><div style="font-family:${DISP};${dispSt}color:${ACC};${fs(26,15)}">${esc(label)}</div><div style="flex:1;border-top:3px double ${ACC}"></div></div>`;
    case"neon":return `<div style="font-family:${DISP};font-weight:${dispW};${dispSt}color:#fff;text-shadow:0 0 6px ${ACC2},0 0 16px ${ACC2};${fs(30,16)};margin:0 0 8px">${esc(label)}</div>`;
    case"stripes":return `<div style="display:inline-block;background:${ACC};color:${STOCK};font-family:${DISP};font-weight:${dispW};${dispSt}${fs(26,15)};padding:4px 14px 2px;margin:0 0 8px">${esc(label)}</div>`;
    case"chrome":return `<div style="font-family:${BODY};font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:${ACC};${fs(20,14)};border-bottom:2px solid ${ACC}66;padding-bottom:4px;margin:0 0 8px">${esc(label)}</div>`;
    case"round":return `<div style="font-family:${DISP};font-weight:${dispW};color:${ACC};${fs(36,18)};line-height:1;margin:0 0 6px">${esc(label)}</div>`;
    default:return `<div style="display:flex;align-items:baseline;gap:12px;margin:0 0 8px"><div style="font-family:${DISP};font-weight:${dispW};${dispSt}color:${ACC};${fs(26,15)}">${esc(label)}</div><div style="flex:1;border-top:1px solid ${ACC}77"></div></div>`}};
  const centered=e.border==="deco";
  const menu=C.map(c=>`<div style="margin:0 0 ${n<=6?20:10}px">${secH(LABEL[c.k])}${c.items.map((it,i)=>`<div style="margin:0 0 ${n<=6?12:6}px;${centered?"text-align:center;":""}">
      ${centered?`<div style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--dl,3);overflow:hidden;font-family:${BODY};font-weight:700;color:${INK};line-height:1.15;${fs(dish,14)}">${esc(it.n)} <span style="color:${ACC};white-space:nowrap">${money(era,c.k,i,f)}</span></div>`
        :`<div style="display:flex;align-items:baseline;gap:12px"><div style="flex:1;min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--dl,3);overflow:hidden;font-family:${BODY};font-weight:700;color:${INK};line-height:1.15;${fs(dish,14)}">${esc(it.n)}</div><div style="font-family:${BODY};font-weight:700;color:${c.k==="d"?ACC2:ACC};${fs(dish,14)};white-space:nowrap">${money(era,c.k,i,f)}</div></div>`}
      <div style="display:var(--nd,block);font-family:${BODY};${e.body==="Cormorant Garamond"?"font-style:italic;":""}color:${mix(INK,STOCK,.3)};line-height:1.28;${fs(desc,14)};margin-top:2px">${esc(it.note)}</div></div>`).join("")}</div>`).join("");
  const rules=[family?"Minimum one dessert per table":"Two drink minimum at the stage tables","Cover charge after nine",winks[0]?"No discussing "+winks[0].charAt(0).toLowerCase()+winks[0].slice(1)+" at the tables":"",`Card No. ${num}`].filter(Boolean).join(". ")+".";
  const face1=`<div style="position:absolute;inset:0;overflow:hidden">${stock}
    <div style="position:absolute;left:0;top:0;width:${W}px;height:${SH}px;overflow:hidden;${fade}">${photo(ctx,s1,W,SH,filt,"50% 40%")}${lamps}
      <div style="position:absolute;right:${PAD}px;top:${PAD-6}px;font-family:${BODY};font-weight:700;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.6);padding:5px 10px">On stage tonight</div></div>
    ${border}
    <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${SH-30}px;bottom:${PAD+4}px;display:flex;flex-direction:column">
      <div style="text-align:center;margin-bottom:14px"><div data-fit style="height:${venue.length>18?92:50}px;overflow:hidden;display:flex;align-items:center;justify-content:center"><div style="font-family:${DISP};font-weight:${dispW};${dispSt}${neonTxt}${fs(venue.length>18?36:40,20)};line-height:1.08">${esc(venue)}</div></div>
        <div style="font-family:${BODY};font-size:17px;color:${mix(INK,STOCK,.25)};margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(f.T?sent(f.T):sign)}</div></div>
      <div data-fit style="flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between">${menu}</div>
      <div style="font-family:${BODY};font-size:15px;line-height:1.3;color:${mix(INK,STOCK,.4)};margin-top:8px;text-align:center;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden">${esc(rules)}${f.P?" "+esc(sent("Showtime: "+clean(f.P).replace(/\.$/,""))):""}</div>
    </div>${FIT}</div>`;
  return{w:W,h:H,faces:[face0,face1]};
};
})();
