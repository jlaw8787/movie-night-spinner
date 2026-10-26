/* Format: motel. A roadside motel postcard pair (two faces, 816x600): the picture side, and the back
   with the coffee shop menu on the message half, the postage stamp (a real still), the guest's note in
   hand, and the room key tag. Era sets the postcard process (hand-tinted linen with big letters, chrome
   photo with script strip, Kodachrome band, faded 70s print, 80s multi-view, 90s boxed caption, 2000s
   gloss, modern minimal), the type pairing, the card stock and the key (paper tag, diamond fob, plastic
   tag, key card). Tone sets photo treatment, wear, postmark, tilt and copy voice.
   Fonts (fmt-motel): Sigmar One, Yellowtail, Atomic Age, Calistoga, Orbitron, Days One, Sarpanch,
   Instrument Serif. */
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
const W=816,H=600;
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
const FIT=`<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="position:absolute;width:1px;height:1px;opacity:0;left:0;top:0" onload="(function(r){function f(){r.querySelectorAll('[data-fit]').forEach(function(b){var k=1;b.style.setProperty('--k',1);b.style.removeProperty('--nd');var o=function(){return b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1};while(o()&&k>.56){k-=.04;b.style.setProperty('--k',k.toFixed(2))}if(o())b.style.setProperty('--nd','none');if(o())b.style.setProperty('--dl','1')})}f();if(document.fonts)document.fonts.ready.then(f);setTimeout(f,900);setTimeout(f,2200)})(this.parentNode)">`;
const fs=(px,min)=>`font-size:max(${min||14}px,calc(${px}px * var(--k,1)))`;
/* logo panel tone: a dark logo flips its panel to the light stock */
const LOGOTONE=`onload="(function(i){var p=i.closest('[data-lp]'),w=window.__fmtLift&&__fmtLift.logo(i,+((p&&p.dataset.dl)||.012),+((p&&p.dataset.ll)||.86));if(p&&w&&(w==='light')===(p.dataset.dark==='1')){p.style.background=p.dataset.alt;p.style.boxShadow=p.dataset.altsh}})(this)"`;
function logoBox(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a),w=h*a;
  return{w:Math.round(w),h:Math.round(h),html:`<img crossorigin="anonymous" alt="${esc(ctx.f.title)}" src="${ctx.img(L[0],"w500")}" ${LOGOTONE} style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain">`}}
function posterOf(ctx){if(ctx.poster)return ctx.poster;try{return(typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[ctx.f.id])||null}catch(e){return null}}
function photo(ctx,path,w,h,filter,pos){const poster=posterOf(ctx);
  if(path)return `<img alt="" crossorigin="anonymous" data-bw="${w}" data-bh="${h}" onload="window.__fmtLift&&__fmtLift.trim(this)" onerror="window.__fmtLift&&__fmtLift.cors(this)" src="${ctx.img(path,"w1280")}" style="position:absolute;inset:0;left:0;top:0;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos||"50% 40%"};filter:${filter}">`;
  if(poster)return `<img alt="" src="${ctx.img(poster,"w780")}" style="position:absolute;inset:-30px;width:${w+60}px;height:${h+60}px;object-fit:cover;filter:blur(18px) brightness(.7) ${filter}"><img alt="" src="${ctx.img(poster,"w780")}" style="position:absolute;left:50%;top:0;height:${h}px;transform:translateX(-50%);filter:${filter};box-shadow:0 0 40px rgba(0,0,0,.5)">`;
  return `<div style="position:absolute;inset:0;background:#333"></div>`}
function yy(f){return String(f.year||"").slice(-2)||"00"}
function numOf(fl,f){const n=fl&&String(fl.number||"").replace(/[^0-9A-Za-z]/g,"");return n||String(f.year||"")}
function courses(ctx,family){const m=ctx.menu||{};const fix=s=>family?DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s)):clean(s);
  return["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(it=>it&&it.n).slice(0,4).map(it=>({n:cap(fix(it.n)),note:sent(fix(it.note))}))})).filter(c=>c.items.length)}
const pick=(arr,seed)=>arr[Math.abs([...String(seed)].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))%arr.length];


const TONE={
  gritty:{f:"contrast(1.14) saturate(.85)",wear:.9,vig:.5,tilt:-6,kick:"Made it this far, from",ink:"#3b3b3b",msgH:"Rough night. Wrote this anyway."},
  glossy:{f:"saturate(1.18) contrast(1.05) brightness(1.03)",wear:.1,vig:.15,tilt:-3,kick:"Stay a night at",ink:"#1f3f8a",msgH:"Having a lovely time."},
  warm:{f:"saturate(1.1) sepia(.1) brightness(1.04)",wear:.45,vig:.3,tilt:-5,kick:"Greetings from",ink:"#23408e",msgH:"Wish you were here."},
  eerie:{f:"saturate(.7) brightness(.93) contrast(1.1) hue-rotate(-6deg)",wear:.7,vig:.65,tilt:-2,kick:"Vacancy at",ink:"#2e2e2e",msgH:"Quiet night. Very quiet."},
  playful:{f:"saturate(1.3) brightness(1.05)",wear:.3,vig:.15,tilt:-8,kick:"Having a swell time at",ink:"#1d4fb0",msgH:"You would not believe this place."},
  grand:{f:"contrast(1.08) saturate(1.08)",wear:.2,vig:.4,tilt:-3,kick:"Welcome to",ink:"#2a2a5e",msgH:"The view alone was worth the drive."},
  tender:{f:"brightness(1.06) saturate(.92) contrast(.96)",wear:.4,vig:.25,tilt:-4,kick:"Thinking of you from",ink:"#3a4f8a",msgH:"Thinking of you."},
  tense:{f:"contrast(1.2) saturate(.8)",wear:.6,vig:.6,tilt:4,kick:"Last stop before",ink:"#2b2b2b",msgH:"Keep this card. Tell no one."},
  scrappy:{f:"contrast(1.22) saturate(.78) brightness(1.04)",wear:1,vig:.4,tilt:-10,kick:"Greetings, sort of, from",ink:"#1a1a1a",msgH:"Long story. Send money."}};
const ERA={
  "1930s-40s":{disp:"Sigmar One",body:"Libre Franklin",bw:"400;600;800",sig:"Mr Dafoe",paper:"#efe5cc",ink:"#2d2418",acc0:"#b0352a",border:18,bcol:"#f4ecd6",rad:0,cap:"big",linen:true,tag:"paper",
    photoF:"saturate(1.5) sepia(.3) contrast(.95) brightness(1.05)",P:{s:[15,20,25,15],m:[35,45,40,50],w:[10,15,10,15],d:[5,10,5,10]},cents:true,dr:.82},
  "1950s":{disp:"Yellowtail",body:"Archivo Narrow",bw:"400;600;700",sig:"Mr Dafoe",paper:"#fbfaf4",ink:"#1d2430",acc0:"#d23a2c",border:16,bcol:"#ffffff",rad:0,cap:"strip",tag:"diamond",
    photoF:"saturate(1.2) contrast(1.05)",P:{s:[25,35,30,40],m:[85,95,75,90],w:[20,25,20,25],d:[10,15,10,15]},cents:true,dr:.5},
  "1960s":{disp:"Atomic Age",body:"Archivo Narrow",bw:"400;600;700",sig:"Caveat",paper:"#f8f3e6",ink:"#1d2a38",acc0:"#0f8a8a",border:0,rad:0,cap:"band",tag:"diamond",
    photoF:"saturate(1.32) contrast(1.06)",P:{s:[.45,.6,.5,.55],m:[1.25,1.5,1.35,1.4],w:[.35,.4,.3,.45],d:[.15,.2,.25,.2]},dr:.62},
  "1970s":{disp:"Calistoga",body:"Archivo",bw:"400;600;700",sig:"Caveat",paper:"#efe0bf",ink:"#3a2616",acc0:"#d0661f",border:18,bcol:"#f6ecd4",rad:22,cap:"strip",tag:"diamond",
    photoF:"sepia(.24) saturate(.92) contrast(.92) brightness(1.07)",P:{s:[.95,1.25,1.1,1.35],m:[2.95,3.5,3.25,3.75],w:[.85,.95,.75,.9],d:[.35,.45,.5,.4]},dr:.55},
  "1980s":{disp:"Orbitron",dw:800,body:"Archivo",bw:"400;600;700",sig:"Caveat",paper:"#ffffff",ink:"#16161c",acc0:"#e6327a",border:0,rad:0,cap:"multi",tag:"rect",
    photoF:"contrast(1.12) saturate(1.25)",P:{s:[1.95,2.5,2.25,2.75],m:[4.95,5.5,5.25,5.95],w:[1.75,1.95,1.5,1.85],d:[.95,1.25,1.1,1.5]},dr:.78},
  "1990s":{disp:"Days One",body:"Archivo",bw:"400;600;700",sig:"Caveat",paper:"#f6f6f1",ink:"#1b2228",acc0:"#2a7bc0",border:0,rad:0,cap:"box",tag:"rect",
    photoF:"contrast(1.06) saturate(1.08)",P:{s:[3.25,3.95,3.5,4.25],m:[6.5,7.95,6.95,7.5],w:[2.95,3.5,2.75,3.25],d:[1.25,1.5,1.35,1.75]},dr:.68},
  "2000s":{disp:"Sarpanch",dw:800,body:"Saira",bw:"400;600;700",sig:"Caveat",paper:"#ffffff",ink:"#1a1d22",acc0:"#e0791f",border:0,rad:0,cap:"overlay",tag:"card",
    photoF:"saturate(1.08) contrast(1.08)",P:{s:[4.5,5.25,4.95,5.75],m:[8.95,10.5,9.5,11.25],w:[3.95,4.5,3.75,4.25],d:[1.95,2.5,2.25,2.75]},dr:.44},
  "modern":{disp:"Instrument Serif",body:"Inter",bw:"400;600;700",sig:"Caveat",paper:"#f4f1ea",ink:"#1d1f22",acc0:"#c4562e",border:14,bcol:"#f4f1ea",rad:0,cap:"minimal",tag:"card",
    photoF:"none",P:{s:[7,9,8,10],m:[16,19,17,21],w:[7,8,6.5,9],d:[4,5,4.5,6]},dr:.45}};
function eraOf(e){e=String(e||"").toLowerCase();if(ERA[e])return e;if(/30|40/.test(e))return"1930s-40s";if(/2000|00s/.test(e))return"2000s";const m=e.match(/(19)?([5-9])0/);if(m)return"19"+m[2]+"0s";return"modern"}
function money(era,k,i,f){const e=ERA[era],v=e.P[k][i%4],y=yy(f);if(k==="d"&&i===0)return e.cents?y+"¢":Math.floor(v)+"."+y;if(e.cents)return v<100?v+"¢":(v/100).toFixed(2);return v.toFixed(2)}
const LABEL={s:"Starters",m:"Blue Plates",w:"Pie and Sweets",d:"Coffee and Pop"};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS["motel"]=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,era=eraOf(ctx.era),e=ERA[era],T=TONE[ctx.tone]||TONE.warm;
  const sigF=era==="1930s-40s"||era==="1950s"?"Mr Dafoe":"Caveat";
  loadFonts("motel-"+era,[e.disp+(e.dw?":wght@"+e.dw:""),e.body+":wght@"+e.bw,"Caveat:wght@500;700",...(sigF==="Mr Dafoe"?["Mr Dafoe"]:[])]);
  const family=FAMILY.has(f.theme);
  const pal=ctx.palette||{};
  const ACC=readable(pal.accent,e.paper,4.5,e.acc0);
  const DARK=hex(pal.dark)&&lum(pal.dark)<.08?pal.dark:"#16161a";
  const venue=clean(fl&&fl.venue)||"Roadside Motor Court";
  const sign=clean(fl&&fl.sign)||"Clean rooms, hot coffee, open all night";
  const note=fl&&fl.note&&fl.note.text?{t:sent(fl.note.text),by:clean(fl.note.by)}:{t:sent(f.T||"Arrived safe. The coffee shop here is better than it looks."),by:"A traveller"};
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl&&fl.prop&&fl.prop.title?fl.prop:null;
  const num=numOf(fl,f);
  const room=(String(fl&&fl.number||"").replace(/\D/g,"").slice(0,3))||String(f.year||"12").slice(-2);
  const C=courses(ctx,family);
  const s0=ctx.stills&&ctx.stills[0],s1=ctx.stills&&(ctx.stills[1]||ctx.stills[0]);
  const BODY=`'${e.body}',sans-serif`,DISP=`'${e.disp}',sans-serif`;
  const filt=`${e.photoF==="none"?"":e.photoF} ${T.f}`;
  const linen=`repeating-linear-gradient(0deg,rgba(255,255,255,.13) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(80,60,30,.12) 0 1px,transparent 1px 3px)`;
  const wearFront=`<div style="position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 ${30+T.wear*40}px rgba(60,40,10,${(.1+T.wear*.25).toFixed(2)});background-image:${noise("#ffffff",.08+T.wear*.12,.9,200)}"></div>`;

  /* ---------- front: the picture side ---------- */
  const B=e.border,PW=W-2*B,PHh=H-2*B;
  const LB=logoBox(ctx,era==="1930s-40s"?250:300,era==="1930s-40s"?78:96);
  /* old postcards get a printed card panel (cream or sepia brown), later eras a plain dark or light one; the logo picks */
  const OLD=era==="1930s-40s"||era==="1950s"||era==="1970s";
  const pDark=OLD?"rgba(44,30,18,.9)":"rgba(10,10,12,.78)",pLight=OLD?"rgba(246,238,216,.95)":"rgba(250,248,242,.94)";
  const pEdge=OLD?`,inset 0 0 0 3px ${e.paper},inset 0 0 0 4px ${mix(ACC,"#000000",.2)}`:"";
  const lp=(x,y,anchor,lb)=>(lb=lb||LB)?`<div data-lp data-dark="1" data-dl="${OLD?.016:.006}" data-ll="${OLD?.84:.92}" data-alt="${pLight}" data-altsh="0 6px 18px rgba(0,0,0,.4)${pEdge}" style="${anchor==="flow"?"position:relative;align-self:flex-start;flex:none;":`position:absolute;${anchor}:${x}px;top:${y}px;`}padding:12px 16px;background:${pDark};border-radius:${e.rad?12:4}px;box-shadow:0 6px 18px rgba(0,0,0,.4)${pEdge}">${lb.html}</div>`
    :`<div style="${anchor==="flow"?"position:relative;align-self:flex-start;flex:none;":`position:absolute;${anchor}:${x}px;top:${y}px;`}max-width:330px;padding:10px 16px;background:${pDark};color:#fff;font-family:${DISP};font-weight:${e.dw||400};font-size:${f.title&&f.title.length>22?22:30}px;line-height:1.05;border-radius:4px">${esc(f.title)}</div>`;
  let front="";
  const PO=posterOf(ctx),hasP=!!PO;
  /* poster postcard: the whole 2:3 poster sits on the card stock beside the lettering; stills stay for the small photos only */
  function posterFront(){
    const below=false,multi=e.cap==="multi",SHb=e.cap==="strip"?96:92;
    const ix=multi?0:B,iy=multi?0:B,iw=multi?556:W-2*B,ih=multi?H:below?H-B-SHb:H-2*B;
    const pad=14,ph=ih-2*pad,pw=Math.round(ph*2/3),px=multi?ix+Math.round((iw-pw)/2):ix+iw-pad-pw,py=iy+pad;
    const posterEl=`<div style="position:absolute;left:${px}px;top:${py}px;width:${pw}px;height:${ph}px;background:${OLD?e.bcol:"#ffffff"};padding:6px;box-sizing:border-box;box-shadow:0 8px 20px rgba(40,30,10,.45);transform:rotate(${(T.tilt*.25).toFixed(1)}deg)"><img alt="" crossorigin="anonymous" src="${ctx.img(PO,"w780")}" style="display:block;width:100%;height:100%;object-fit:contain"></div>`;
    const panel=`<div style="position:absolute;left:${ix}px;top:${iy}px;width:${iw}px;height:${ih}px;overflow:hidden;border-radius:${e.rad}px;box-sizing:border-box;border:1px solid ${mix(e.ink,e.paper,.75)};background:${e.paper}">${e.linen?`<div style="position:absolute;inset:0;background-image:${linen}"></div>`:""}</div>`;
    if(multi){
      const s2=ctx.stills&&ctx.stills[2]||s1,s3=ctx.stills&&ctx.stills[3]||s0,LBm=logoBox(ctx,200,64);
      return `<div style="position:absolute;inset:0;background:${DARK}"></div>${panel}${posterEl}
      <div style="position:absolute;left:562px;top:0;width:254px;height:${H/2-3}px;overflow:hidden">${photo(ctx,s2,254,H/2-3,filt)}</div>
      <div style="position:absolute;left:562px;top:${H/2+3}px;width:254px;height:${H/2-3}px;overflow:hidden">${photo(ctx,s3,254,H/2-3,filt)}</div>
      ${lp(574,14,"left",LBm)}
      <div data-fit style="position:absolute;left:570px;bottom:14px;width:240px;height:150px;overflow:hidden;padding:10px 14px;box-sizing:border-box;background:linear-gradient(90deg,${ACC},${mix(ACC,"#3a1060",.45)});color:#fff;display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${BODY};font-weight:700;${fs(14,14)};letter-spacing:.16em;text-transform:uppercase">${esc(T.kick)}</div>
        <div style="font-family:${DISP};${fs(28,16)};line-height:1.1;text-transform:uppercase">${esc(venue)}</div></div>`}
    const zx=ix+24,zw=px-zx-26,zy=iy+22,zh=ih-44,lbh=LB?LB.h+24:60;
    let mid="";
    if(!below){
      const box={band:`background:${mix(ACC,"#000000",.15)};color:#fff;padding:14px 20px;box-shadow:0 0 0 4px ${e.paper},0 0 0 6px ${mix(ACC,"#000000",.15)}`,
        box:`background:${e.paper};color:${e.ink};padding:14px 20px;border:2px solid ${e.ink};box-shadow:8px 8px 0 ${ACC}`,
        overlay:`background:linear-gradient(90deg,rgba(0,0,0,.85),rgba(0,0,0,.55));color:#fff;padding:14px 20px;border-left:8px solid ${ACC}`}[e.cap]||`padding:0 0 0 2px;color:${e.ink}`;
      const plain=!({band:1,box:1,overlay:1})[e.cap];
      mid=`<div data-fit style="flex:0 1 auto;max-height:${zh-lbh-70}px;width:100%;box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;justify-content:center;${box}">
        <div style="font-family:${BODY};font-weight:700;${fs(16,14)};letter-spacing:.2em;text-transform:uppercase;color:${plain?ACC:"inherit"}">${esc(T.kick)}</div>
        <div style="font-family:${DISP};font-weight:${e.dw||400};${fs(e.cap==="big"?60:46,18)};line-height:1.06;margin:4px 0;color:${plain?ACC:"inherit"};${e.cap==="overlay"||e.cap==="big"?"text-transform:uppercase;":""}${e.cap==="big"?"text-shadow:3px 3px 0 rgba(42,26,12,.35);":""}">${esc(venue)}</div>
        <div style="font-family:${BODY};font-weight:600;${fs(16,14)};letter-spacing:.12em;text-transform:uppercase">${esc(sign)}</div></div>`}
    const foot=`<div style="font-family:${BODY};font-weight:700;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:${mix(e.ink,e.paper,.2)}">Now showing, ${esc(f.year)}</div>`;
    /* a framed scene snapshot takes the spare card space between the name panel and the footer, so the front never sits half empty */
    const snapP=!below&&ctx.stills&&ctx.stills.find(x=>x&&x!==PO);
    const snap=snapP?`<div style="flex:1 1 0;min-height:118px;width:${Math.min(zw,420)}px;max-height:300px;margin:18px 0 14px 6px;padding:7px 7px 7px;box-sizing:border-box;background:#ffffff;box-shadow:0 6px 16px rgba(40,30,10,.35);transform:rotate(${(-T.tilt*.35).toFixed(1)}deg)"><img alt="" crossorigin="anonymous" src="${ctx.img(snapP,"w780")}" style="display:block;width:100%;height:100%;object-fit:cover${filt.trim()?`;filter:${filt.trim()}`:""}"></div>`:"";
    const zone=`<div style="position:absolute;left:${zx}px;top:${zy}px;width:${zw}px;height:${zh}px;display:flex;flex-direction:column;justify-content:${below?"center":"space-between"};gap:${below?22:0}px;align-items:flex-start">${lp(0,0,"flow")}${snap?`<div style="height:18px;flex:none"></div>`:""}${mid}${snap}${foot}</div>`;
    const cap=below?(e.cap==="strip"?`<div data-fit style="position:absolute;left:${B+10}px;right:${B+10}px;bottom:8px;height:${SHb-12}px;overflow:hidden;display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${DISP};font-weight:${e.dw||400};color:${ACC};${fs(era==="1950s"?46:36,18)};line-height:1.05;white-space:nowrap">${esc(venue)}</div>
        <div style="font-family:${BODY};font-weight:600;color:${e.ink};${fs(17,14)};letter-spacing:.14em;text-transform:uppercase;white-space:nowrap">${esc(sign)}</div></div>`
      :`<div data-fit style="position:absolute;left:${B}px;bottom:0;height:${SHb}px;right:${B}px;overflow:hidden;padding:10px 20px;box-sizing:border-box;color:${e.ink};display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${BODY};font-weight:600;${fs(16,14)};letter-spacing:.2em;text-transform:uppercase;color:${ACC}">${esc(T.kick)}</div>
        <div style="font-family:${DISP};font-weight:${e.dw||400};${fs(44,18)};line-height:1.04;white-space:nowrap">${esc(venue)}</div></div>`):"";
    return `<div style="position:absolute;inset:0;background:${e.bcol||DARK}"></div>${panel}${posterEl}${zone}${cap}`}
  const vshort=venue.replace(/^(the)\s+/i,"");
  if(hasP){front=posterFront()}
  else if(e.cap==="big"){
    /* big letter postcard: the venue's name cut from a second still */
    const words=vshort.split(/\s+/);let big=words.length>2?words.slice(0,2).join(" "):vshort;if(big.length>18)big=words[0];big=big.slice(0,18);
    const bs=Math.max(44,Math.min(104,Math.floor((PW-80)/(big.length*e.dr))));
    /* linen postcard letters: hand tinted in the film's colour, cream keyline, block shadow; sit low so faces stay clear */
    const tint=mix(ACC,"#c9a46a",.25),tintHi=mix(tint,"#fff4dc",.4),tintLo=mix(tint,"#2a1a0c",.35);
    front=`<div style="position:absolute;inset:0;background:${e.bcol}"></div>
      <div style="position:absolute;left:${B}px;top:${B}px;width:${PW}px;height:${PHh}px;overflow:hidden">${photo(ctx,s0,PW,PHh,filt)}<div style="position:absolute;inset:0;background:${linen};mix-blend-mode:multiply"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 40%,rgba(0,0,0,${T.vig}) 100%)"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:${Math.round(bs*1.1)+90}px;background:linear-gradient(180deg,rgba(40,26,12,0),rgba(40,26,12,.55))"></div></div>
      <div style="position:absolute;left:${B+24}px;top:${B+18}px;font-family:'${sigF}',cursive;font-size:44px;color:#fff8e6;text-shadow:0 2px 6px rgba(0,0,0,.7)">${esc(T.kick)}</div>
      <div style="position:absolute;left:${B}px;right:${B}px;top:${H-B-52-Math.round(bs*1.1)}px;text-align:center;font-family:${DISP};font-size:${bs}px;line-height:1.1;text-transform:uppercase;letter-spacing:.02em;white-space:nowrap;
        background:linear-gradient(180deg,${tintHi},${tint} 55%,${tintLo});-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:2.5px #fff4dc;filter:drop-shadow(4px 5px 0 rgba(42,26,12,.85)) drop-shadow(0 4px 8px rgba(0,0,0,.4))">${esc(big)}</div>
      <div style="position:absolute;left:${B}px;right:${B}px;bottom:${B+14}px;text-align:center;font-family:${BODY};font-weight:800;font-size:18px;letter-spacing:.22em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff4dc;text-shadow:0 2px 6px rgba(0,0,0,.8)">${esc(sign)}</div>
      ${lp(B+18,B+14,"right")}`;
  }else if(e.cap==="strip"){
    const SH=96;
    front=`<div style="position:absolute;inset:0;background:${e.bcol}"></div>
      <div style="position:absolute;left:${B}px;top:${B}px;width:${PW}px;height:${H-B-SH}px;overflow:hidden;border-radius:${e.rad}px">${photo(ctx,s0,PW,H-B-SH,filt)}
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 45%,rgba(0,0,0,${T.vig}) 100%)"></div></div>
      ${lp(B+16,B+16,"left")}
      <div data-fit style="position:absolute;left:${B+10}px;right:${B+10}px;bottom:8px;height:${SH-12}px;overflow:hidden;display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${DISP};font-weight:${e.dw||400};color:${ACC};${fs(era==="1950s"?46:36,18)};line-height:1.05;white-space:nowrap">${esc(venue)}</div>
        <div style="font-family:${BODY};font-weight:600;color:${e.ink};${fs(17,14)};letter-spacing:.14em;text-transform:uppercase;white-space:nowrap">${esc(sign)}</div></div>`;
  }else if(e.cap==="band"){
    front=`<div style="position:absolute;inset:0;overflow:hidden">${photo(ctx,s0,W,H,filt)}<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(0,0,0,${T.vig}) 100%)"></div></div>
      ${lp(22,22,"right")}
      <div data-fit style="position:absolute;left:0;right:0;bottom:44px;height:118px;overflow:hidden;background:${mix(ACC,"#000000",.15)};box-shadow:0 0 0 6px rgba(255,255,255,.85);padding:12px 28px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;transform:skewY(-2deg)">
        <div style="font-family:${BODY};font-weight:700;color:#fff;${fs(17,14)};letter-spacing:.22em;text-transform:uppercase">${esc(T.kick)}</div>
        <div style="font-family:${DISP};color:#fff;${fs(52,20)};line-height:1;white-space:nowrap">${esc(venue)}</div></div>
      <div style="position:absolute;left:28px;bottom:10px;font-family:${BODY};font-size:16px;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.9);letter-spacing:.1em">${esc(sign)}</div>`;
  }else if(e.cap==="multi"){
    const s2=ctx.stills&&ctx.stills[2]||s1,s3=ctx.stills&&ctx.stills[3]||s0;
    front=`<div style="position:absolute;inset:0;background:${DARK}"></div>
      <div style="position:absolute;left:0;top:0;width:556px;height:${H}px;overflow:hidden">${photo(ctx,s0,556,H,filt)}</div>
      <div style="position:absolute;left:562px;top:0;width:254px;height:${H/2-3}px;overflow:hidden">${photo(ctx,s2,254,H/2-3,filt)}</div>
      <div style="position:absolute;left:562px;top:${H/2+3}px;width:254px;height:${H/2-3}px;overflow:hidden">${photo(ctx,s3,254,H/2-3,filt)}</div>
      ${lp(18,18,"left")}
      <div data-fit style="position:absolute;left:18px;bottom:18px;width:520px;height:110px;overflow:hidden;padding:10px 18px;box-sizing:border-box;background:linear-gradient(90deg,${ACC},${mix(ACC,"#3a1060",.45)});color:#fff;display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${BODY};font-weight:700;${fs(16,14)};letter-spacing:.2em;text-transform:uppercase">${esc(T.kick)}</div>
        <div style="font-family:${DISP};${fs(30,16)};line-height:1.1;text-transform:uppercase">${esc(venue)}</div></div>`;
  }else{
    /* box, overlay, minimal */
    const inset=e.border;
    const boxBg=e.cap==="box"?`background:${e.paper};color:${e.ink};box-shadow:8px 8px 0 ${ACC}`:e.cap==="overlay"?`background:linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.35));color:#fff;border-left:8px solid ${ACC}`:`background:transparent;color:${e.ink}`;
    const capH=e.cap==="minimal"?92:118;
    front=`<div style="position:absolute;inset:0;background:${e.bcol||DARK}"></div>
      <div style="position:absolute;left:${inset}px;top:${inset}px;width:${W-2*inset}px;height:${H-2*inset-(e.cap==="minimal"?capH-inset:0)}px;overflow:hidden">${photo(ctx,s0,W-2*inset,H-2*inset-(e.cap==="minimal"?capH-inset:0),filt)}
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 50%,rgba(0,0,0,${T.vig}) 100%)"></div></div>
      ${lp(inset+16,inset+16,e.cap==="box"?"right":"left")}
      <div data-fit style="position:absolute;left:${e.cap==="minimal"?inset:inset+24}px;${e.cap==="minimal"?`bottom:0;height:${capH}px;right:${inset}px`:`bottom:${inset+24}px;height:${capH}px;max-width:560px`};overflow:hidden;padding:10px 20px;box-sizing:border-box;${boxBg};display:flex;flex-direction:column;justify-content:center">
        <div style="font-family:${BODY};font-weight:600;${fs(16,14)};letter-spacing:.2em;text-transform:uppercase;color:${e.cap==="minimal"?ACC:"inherit"}">${esc(T.kick)}</div>
        <div style="font-family:${DISP};font-weight:${e.dw||400};${fs(e.cap==="minimal"?44:40,18)};line-height:1.04;white-space:nowrap;${e.cap==="overlay"?"text-transform:uppercase;":""}">${esc(venue)}</div></div>`;
  }
  const front0=`<div style="position:absolute;inset:0;overflow:hidden">${front}${hasP?"":wearFront}${FIT}</div>`;

  /* ---------- back: menu, stamp, message, key tag ---------- */
  const n=C.reduce((a,c)=>a+c.items.length,0);
  const dish=n<=6?23:n<=9?21:20,desc=n<=6?17:16;
  const LW=470;
  const menuHtml=C.map(c=>`<div style="margin:0 0 ${n<=6?12:7}px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><div style="font-family:${BODY};font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${ACC};${fs(15,14)};white-space:nowrap">${esc(LABEL[c.k])}</div><div style="flex:1;border-top:1.5px ${era==="1970s"||era==="1960s"?"dotted":"solid"} ${ACC}88"></div></div>
      ${c.items.map((it,i)=>`<div style="margin:0 0 5px"><div style="display:flex;align-items:baseline;gap:10px"><div style="flex:1;min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--dl,3);overflow:hidden;font-family:${BODY};font-weight:700;color:${e.ink};line-height:1.15;${fs(dish,14)}">${esc(it.n)}</div><div style="font-family:${BODY};font-weight:700;color:${e.ink};${fs(dish,14)};white-space:nowrap">${money(era,c.k,i,f)}</div></div>
        <div style="display:var(--nd,block);font-family:${BODY};color:${mix(e.ink,e.paper,.3)};line-height:1.25;${fs(desc,14)}">${esc(it.note)}</div></div>`).join("")}</div>`).join("");

  const stillStamp=s1||s0;
  const stamp=`<div style="position:absolute;right:20px;top:18px;width:132px;height:160px;padding:8px;box-sizing:border-box;background:radial-gradient(circle,transparent 3px,#fbf8f0 3.5px) -5px -5px/10px 10px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><div style="position:absolute;inset:5px;background:#fbf8f0"></div>
      <div style="position:relative;width:116px;height:116px;overflow:hidden">${photo(ctx,stillStamp,116,118,filt,"50% 30%")}</div>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:baseline;font-family:${BODY};font-weight:800;color:${ACC};font-size:15px;margin-top:4px;white-space:nowrap;overflow:hidden"><span>${esc(e.P&&e.cents?yy(f)+"¢":"POST")}</span><span style="font-size:14px">${esc(String(f.year||""))}</span></div></div>`;
  const town=clean(sign.split(",").slice(-1)[0]).slice(0,26).toUpperCase();
  const postmark=`<div style="position:absolute;right:110px;top:110px;transform:rotate(-14deg);border:2.5px solid ${T.ink}aa;border-radius:6px;padding:3px 10px;font-family:${BODY};font-weight:700;font-size:14px;letter-spacing:.14em;color:${T.ink}bb;text-align:center;line-height:1.25;white-space:nowrap;opacity:${(.65+T.wear*.3).toFixed(2)}">${esc(town||"ROUTE "+room)}<br>${esc(String(f.year||""))}</div>`;

  /* key tag: shape by era, type only */
  const tagCol=mix(ACC,"#000000",.1),tagTxt=lum(tagCol)<.35?"#ffffff":"#111111";
  const tagInner=`<div style="font-family:${BODY};font-weight:800;font-size:14px;letter-spacing:.16em;text-transform:uppercase;opacity:.9">Room</div><div style="font-family:${DISP};font-weight:${e.dw||400};font-size:${room.length>2?40:52}px;line-height:.95">${esc(room)}</div><div style="font-family:${BODY};font-weight:600;font-size:14px;line-height:1.15;max-width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(venue)}</div>`;
  let tag;
  if(e.tag==="diamond")tag=`<div style="position:absolute;right:18px;bottom:22px;width:250px;height:132px;transform:rotate(${T.tilt}deg);filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))"><div style="position:absolute;inset:0;clip-path:polygon(0 50%,22% 0,78% 0,100% 50%,78% 100%,22% 100%);background:linear-gradient(160deg,${mix(tagCol,"#ffffff",.25)},${tagCol} 45%,${mix(tagCol,"#000000",.25)});color:${tagTxt};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">${tagInner}<div style="font-family:${BODY};font-size:14px;opacity:.85;white-space:nowrap">Drop in any mailbox</div></div><div style="position:absolute;left:14px;top:58px;width:16px;height:16px;border-radius:50%;background:${e.paper};box-shadow:inset 0 1px 3px rgba(0,0,0,.6)"></div></div>`;
  else if(e.tag==="paper")tag=`<div style="position:absolute;right:20px;bottom:22px;width:230px;height:122px;transform:rotate(${T.tilt}deg);background:#e9d9a8;background-image:${noise("#6b5320",.2,.8,160)};clip-path:polygon(14% 0,100% 0,100% 100%,14% 100%,0 70%,0 30%);box-shadow:0 4px 8px rgba(0,0,0,.3);color:#3a2a10;display:flex;flex-direction:column;justify-content:center;padding-left:46px;box-sizing:border-box">${tagInner}<div style="position:absolute;left:14px;top:50px;width:18px;height:18px;border-radius:50%;border:4px solid #c9b47a;background:${e.paper};box-sizing:border-box"></div></div>`;
  else if(e.tag==="rect")tag=`<div style="position:absolute;right:18px;bottom:22px;width:236px;height:118px;transform:rotate(${T.tilt}deg);border-radius:59px 14px 14px 59px;background:linear-gradient(170deg,${mix(tagCol,"#ffffff",.3)},${tagCol} 40%,${mix(tagCol,"#000000",.2)});color:${tagTxt};box-shadow:0 6px 10px rgba(0,0,0,.35);display:flex;flex-direction:column;justify-content:center;padding-left:66px;box-sizing:border-box">${tagInner}<div style="position:absolute;left:20px;top:45px;width:26px;height:26px;border-radius:50%;background:${e.paper};box-shadow:inset 0 2px 4px rgba(0,0,0,.5)"></div></div>`;
  else tag=`<div style="position:absolute;right:18px;bottom:22px;width:242px;height:150px;transform:rotate(${T.tilt}deg);border-radius:12px;background:linear-gradient(135deg,${DARK},${mix(DARK,ACC,.45)});color:#fff;box-shadow:0 6px 12px rgba(0,0,0,.35);padding:12px 16px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
      <div style="font-family:${BODY};font-weight:700;font-size:14px;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(venue)}</div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between"><div style="font-family:${DISP};font-weight:${e.dw||400};font-size:46px;line-height:.9">${esc(room)}</div><div style="font-family:${BODY};font-size:14px;text-align:right;line-height:1.2">Insert this way<br>Checkout 11</div></div>
      <div style="height:14px;background:repeating-linear-gradient(90deg,#d8d8d8 0 2px,#9a9a9a 2px 4px);border-radius:2px;opacity:.85"></div></div>`;

  const papBg=`${e.paper}`;
  const back=`<div style="position:absolute;inset:0;overflow:hidden;background:${papBg}">
    <div style="position:absolute;inset:0;background-image:${noise("#6b5a3a",.12+T.wear*.1,.85,200)}${e.linen?","+linen:""}"></div>
    <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${24+T.wear*40}px rgba(90,70,30,${(.08+T.wear*.2).toFixed(2)})"></div>
    <div style="position:absolute;left:26px;top:20px;width:${LW}px;bottom:20px;display:flex;flex-direction:column">
      ${n<=10?`<div style="font-family:${BODY};font-weight:700;font-size:15px;letter-spacing:.3em;color:${mix(e.ink,e.paper,.35)}">POST CARD</div>`:""}
      <div style="font-family:${DISP};font-weight:${e.dw||400};color:${ACC};font-size:${venue.length>24?26:32}px;line-height:1.05;margin:4px 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(venue)}</div>
      ${n<=10?`<div style="font-family:${BODY};font-weight:600;color:${e.ink};font-size:16px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px">Coffee shop, open early and late</div>`:`<div style="height:6px"></div>`}
      <div data-fit style="flex:1;min-height:0;overflow:hidden">${menuHtml}</div>
      <div style="font-family:${BODY};font-size:14px;line-height:1.25;color:${mix(e.ink,e.paper,.3)};margin-top:6px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden">${esc(["Prices subject to change",winks[0]?"Ask the desk about "+winks[0].charAt(0).toLowerCase()+winks[0].slice(1):"",`Card No. ${num}`].filter(Boolean).join(". ")+".")}</div>
    </div>
    <div style="position:absolute;left:${LW+46}px;top:26px;bottom:26px;width:2px;background:${mix(e.ink,e.paper,.55)}"></div>
    ${stamp}${postmark}
    <div style="position:absolute;left:${LW+64}px;right:24px;top:190px;height:${e.tag==="card"?186:204}px;display:flex;flex-direction:column" data-fit>
      <div style="font-family:'Caveat',cursive;font-weight:700;color:${T.ink};${fs(25,15)};line-height:1.05">${esc(T.msgH)}</div>
      <div style="font-family:'Caveat',cursive;font-weight:500;color:${T.ink};${fs(23,15)};line-height:1.1;margin-top:2px">${esc(note.t)}</div>
      <div style="font-family:'${sigF}',cursive;color:${T.ink};${fs(sigF==="Mr Dafoe"?34:30,18)};line-height:1.1;text-align:right;margin-top:2px">${esc(note.by)}</div>
      ${prop?`<div style="font-family:${BODY};${fs(14,14)};color:${e.ink};border-top:1px solid ${mix(e.ink,e.paper,.6)};padding-top:3px;margin-top:4px;line-height:1.2">${esc(prop.title)}: ${esc((prop.lines||[]).join(", "))}</div>`:""}
    </div>
    ${tag}${FIT}</div>`;
  return{w:W,h:H,faces:[front0,back]};
};
})();
