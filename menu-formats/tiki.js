/* Format: tiki. Registers window.MENU_FORMATS["tiki"]. Inline styles only; a post-mount fit pass shrinks type so nothing spills. Built for the Movie Night Spinner format library. */
(()=>{
const ID="tiki";
/* ---- shared helpers (copied into each format so the file stands alone) ---- */
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nodash=s=>String(s==null?"":s).replace(/\s*[\u2012-\u2015]\s*/g,", ").replace(/\s+-\s+/g,", ");
const T=s=>esc(nodash(s));
const hex=h=>{h=String(h||"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(h))return null;return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const rgba=(a,o)=>`rgba(${a.map(Math.round).join(",")},${o})`;
const WHITE=[255,255,255],BLACK=[0,0,0];
/* film accent, checked against the paper; grey or washed out accents fall back to the format colour */
function inks(pal,paper,fallback){
  const P=hex(paper);let acc=pal&&hex(pal.accent);
  if(!acc||Math.max(...acc)-Math.min(...acc)<38||contrast(acc,P)<1.5)acc=hex(fallback);
  let ink=acc;for(let k=0;k<14&&contrast(ink,P)<4.6;k++)ink=mix(ink,BLACK,.12);
  let onDark=mix(acc,WHITE,.55);
  let deep=mix(acc,BLACK,.55);for(let k=0;k<10&&contrast(WHITE,deep)<7;k++)deep=mix(deep,BLACK,.15);
  let dark=pal&&hex(pal.dark);if(!dark||lum(dark)>.08)dark=mix(acc,BLACK,.78);
  return{acc:toHex(acc),ink:toHex(ink),deep:toHex(deep),dark:toHex(dark),light:toHex(mix(acc,WHITE,.82)),onDark:toHex(onDark),accA:acc,deepA:deep};
}
function rng(seed){let h=2166136261;for(const ch of String(seed))h=Math.imul(h^ch.charCodeAt(0),16777619);return()=>{h=Math.imul(h^h>>>15,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
/* procedural paper and ink texture (filters, never pictures of things) */
const noise=(freq,oct,rgb,a,seed=1,size=320)=>`url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${(rgb[0]/255).toFixed(3)}  0 0 0 0 ${(rgb[1]/255).toFixed(3)}  0 0 0 0 ${(rgb[2]/255).toFixed(3)}  0 0 0 ${a} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`).replace(/'/g,"%27")}')`;
const HALFTONE=(o,step=4)=>`<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(0,0,0,${o}) 32%,transparent 36%);background-size:${step}px ${step}px;mix-blend-mode:multiply;pointer-events:none"></div>`;
const SHEEN=o=>`<div style="position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,${o}) 0%,rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,${o*.5}) 100%);pointer-events:none"></div>`;
/* era: type pairing group, print process, photo handling, price level */
const ERA={
  "1930s-40s":{g:0,photo:"grayscale(.75) sepia(.6) contrast(1.12)",half:.22,mis:0,sheen:0,price:.2,yr:"1938"},
  "1950s":{g:0,photo:"grayscale(.35) sepia(.3) contrast(1.06) saturate(.9)",half:.16,mis:0,sheen:0,price:.45,yr:"1956"},
  "1960s":{g:1,photo:"sepia(.22) saturate(1.15) contrast(1.02)",half:.12,mis:1,sheen:0,price:.8,yr:"1964"},
  "1970s":{g:1,photo:"sepia(.3) saturate(1.2) contrast(.96) brightness(1.02)",half:.08,mis:1,sheen:0,price:1.4,yr:"1975"},
  "1980s":{g:2,photo:"saturate(1.18) contrast(1.06)",half:0,mis:0,sheen:.16,price:3,yr:"1986"},
  "1990s":{g:2,photo:"saturate(1.06) contrast(1.06)",half:0,mis:0,sheen:.12,price:4.5,yr:"1994"},
  "2000s":{g:3,photo:"saturate(1.02) contrast(1.08)",half:0,mis:0,sheen:.06,price:6.5,yr:"2004"},
  "modern":{g:3,photo:"contrast(1.03)",half:0,mis:0,sheen:0,price:9,yr:"2024"}
};
/* tone: wear, contrast, photo treatment, tilt */
const TONE={
  gritty:{wear:.8,photo:"contrast(1.25) saturate(.72) brightness(.93)",tilt:-.6},
  glossy:{wear:.04,photo:"saturate(1.18) contrast(1.08)",tilt:0},
  warm:{wear:.38,photo:"sepia(.16) saturate(1.1) brightness(1.03)",tilt:-.8},
  eerie:{wear:.55,photo:"saturate(.42) brightness(.84) contrast(1.15) hue-rotate(-12deg)",tilt:.4},
  playful:{wear:.22,photo:"saturate(1.3) brightness(1.04)",tilt:-1.8},
  grand:{wear:.12,photo:"contrast(1.12) saturate(1.04)",tilt:0},
  tender:{wear:.28,photo:"brightness(1.06) saturate(.85) contrast(.95)",tilt:-1},
  tense:{wear:.5,photo:"contrast(1.32) saturate(.58) brightness(.9)",tilt:.3},
  scrappy:{wear:.95,photo:"grayscale(.75) contrast(1.55) brightness(1.06)",tilt:-2.2}
};
const eraOf=e=>ERA[e]?e:"modern",toneOf=t=>TONE[t]?t:"warm";
const FAMILY_THEMES=new Set(["kids","fairytale"]);
const isFamily=f=>!!(f&&(f.family||FAMILY_THEMES.has(f.theme)));
const DRY=[[/\b(whiskey|whisky|bourbon|scotch)\b/gi,"butterscotch"],[/\bmai tais?\b/gi,"lagoon cooler"],[/\bpi[nñ]a coladas?\b/gi,"pineapple colada"],[/\bmargaritas?\b/gi,"lime slushie"],[/\brum\b/gi,"coconut"],[/\b(wine|sangria)s?\b/gi,"grape juice"],[/\b(champagne|prosecco)\b/gi,"sparkling apple"],[/\b(beer|ale|lager|stout)s?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(vodka|gin|tequila|brandy|liqueur|sake|grog)\b/gi,"fizz"],[/\b(spiked|boozy)\b/gi,"fizzy"]];
const dry=s=>DRY.reduce((t,[r,w])=>t.replace(r,w),String(s||""));
function courses(menu,fam){
  const m=menu||{};const out={};
  for(const k of ["s","m","w","d"])out[k]=(m[k]||[]).filter(x=>x&&x.n).slice(0,4).map(x=>({n:fam?dry(x.n):x.n,note:fam?dry(x.note||""):(x.note||"")}));
  return out;
}
const BASE={s:1,m:2.4,w:.9,d:.6};
function price(k,i,era){
  const v=BASE[k]*ERA[era].price*(1+i*.14);
  if(v<1)return Math.max(5,Math.round(v*20)*5)+"¢";
  if(v>=10)return String(Math.round(v));
  return (Math.round(v*4)/4).toFixed(2);
}
function heroes(ctx){
  const im=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");
  const st=(ctx.stills||[]).filter(Boolean).map(p=>im(p,"w1280"));
  /* tmdb-posters.js declares a top level const, so window.TMDB_POSTERS is empty: read the binding directly */
  let pp=ctx.poster;if(!pp){try{pp=typeof TMDB_POSTERS!=="undefined"&&ctx.f&&TMDB_POSTERS[ctx.f.id||`${ctx.f.title} (${ctx.f.year})`]}catch(e){}}
  const post=pp?im(pp,"w780"):"";
  return{list:st,poster:post,hero:post||st[0],heroIsPoster:!!post,second:st[1]||st[0]||post,isPoster:!st.length};
}
function logoUrl(ctx){const l=ctx.logo;if(!l||!l[0])return"";const im=ctx.img||((p,s)=>`https://image.tmdb.org/t/p/${s}${p}`);return im(l[0],"w500")}
function flav(ctx,fb){
  const v=ctx.flavour||{};const note=v.note&&v.note.text?v.note:null;
  const winks=(v.winks||[]).filter(Boolean);
  return{venue:v.venue||fb.venue,sign:v.sign||fb.sign,note:note?{text:note.text,by:note.by||fb.by}:{text:fb.noteText(ctx),by:fb.by},
    winks:winks.length?winks:fb.winks,prop:v.prop&&v.prop.title?v.prop:fb.prop,
    number:String(v.number||"").replace(/[^0-9a-z]/gi,"").slice(0,6)||String(ctx.f&&ctx.f.year||"").slice(-2)||"7",has:!!ctx.flavour};
}
/* fonts: one link per format */
let fontsReady=Promise.resolve();
function loadFonts(query,fams){
  const id="fmt-font-"+ID;
  fontsReady=new Promise(res=>{
    const done=()=>Promise.all(fams.flatMap(f=>["400","700"].map(w=>document.fonts.load(`${w} 40px "${f}"`).catch(()=>0)))).then(res,res);
    let l=document.getElementById(id);
    if(!l){l=document.createElement("link");l.id=id;l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+query+"&display=block";
      l.onload=done;l.onerror=res;document.head.appendChild(l)}else done();
    setTimeout(res,5000);
  });
}
/* fit: reset to base sizes, then shrink inside each box until nothing overflows */
const over=b=>b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1;
function fitRoot(root){
  root.querySelectorAll("[data-fs]").forEach(n=>{n.style.fontSize=n.dataset.fs+"px"});
  root.querySelectorAll("[data-note]").forEach(n=>{n.style.display="";n.style.webkitLineClamp="";n.style.overflow=""});
  root.querySelectorAll("[data-drop]").forEach(n=>{n.style.display=""});
  root.querySelectorAll("[data-line]").forEach(n=>{for(let k=0;k<80&&n.scrollWidth>n.clientWidth+1;k++){const s=parseFloat(n.style.fontSize);if(s<=+(n.dataset.min||14))break;n.style.fontSize=(s-1)+"px"}});
  root.querySelectorAll("[data-box]").forEach(box=>{
    if(box.offsetParent===null&&getComputedStyle(box).position!=="fixed")return;
    const nodes=[...box.querySelectorAll("[data-fs]")].filter(n=>!n.hasAttribute("data-line"));
    for(let k=0;k<60&&over(box);k++){let ch=false;nodes.forEach(n=>{const s=parseFloat(n.style.fontSize),m=+(n.dataset.min||16);if(s>m){n.style.fontSize=(s-1)+"px";ch=true}});if(!ch)break}
    if(over(box)){const ns=[...box.querySelectorAll("[data-note]")];
      for(const L of [2,1]){if(!over(box))break;ns.forEach(e=>{e.style.display="-webkit-box";e.style.webkitBoxOrient="vertical";e.style.webkitLineClamp=String(L);e.style.overflow="hidden"})}
      if(over(box))ns.forEach(e=>{e.style.display="none"})}
    /* last resort: drop extra items (highest index first, later courses first), then fine print extras */
    const dr=[...box.querySelectorAll("[data-drop]")].filter(e=>e.closest("[data-box]")===box).map((e,i)=>[+(e.dataset.drop||0),i,e]).sort((x,y)=>x[0]-y[0]||x[1]-y[1]);
    while(over(box)&&dr.length)dr.pop()[2].style.display="none";
  });
}
/* logo keeps its own colours: sample it, give a dark logo the light panel, swap to set type if it fails */
function logoPass(root){
  root.querySelectorAll("img[data-logo]").forEach(lg=>{
    if(lg.dataset.done)return;
    const go=()=>{if(lg.dataset.done)return;lg.dataset.done="1";const panel=lg.closest("[data-lpanel]");
      if(!lg.naturalWidth){lg.style.display="none";const fb=panel&&panel.querySelector("[data-title-fb]");if(fb)fb.style.display="";fitRoot(root);return}
      try{const cv=document.createElement("canvas");cv.width=120;cv.height=Math.max(8,Math.round(120*lg.naturalHeight/lg.naturalWidth));
        const cx=cv.getContext("2d");cx.drawImage(lg,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;
        let s=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>128){s+=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];n++}
        if(panel&&n){const L=s/n;const want=L<118?"light":"dark";if(panel.dataset[want])panel.setAttribute("style",panel.dataset[want]);
          panel.querySelectorAll("[data-pink]").forEach(e=>{e.style.color=want==="light"?e.dataset.pinkL:e.dataset.pinkD})}
      }catch(e){}
    };
    if(lg.complete)go();else{lg.addEventListener("load",go,{once:true});lg.addEventListener("error",go,{once:true})}
  });
}
function watch(){
  const run=()=>document.querySelectorAll(`[data-fmt="${ID}"]:not([data-fitted])`).forEach(r=>{r.dataset.fitted="1";
    const pass=()=>{logoPass(r);fitRoot(r)};pass();fontsReady.then(pass);[350,1100,1900].forEach(t=>setTimeout(pass,t))});
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});run();
}
window.MENU_FORMAT_FIT=window.MENU_FORMAT_FIT||{};
window.MENU_FORMAT_FIT[ID]=r=>{logoPass(r);fitRoot(r)};
window.MENU_FORMATS=window.MENU_FORMATS||{};
/* the prop is a paper object made of type and rules only */
const propLines=p=>(p&&p.lines||[]).slice(0,3);
/* ---- tiki: tiki bar fold-out, 2 faces 600x1200 ---- */
const W=600,H=1200;
loadFonts("family=Fontdiner+Swanky&family=Josefin+Sans:wght@400;600;700&family=Original+Surfer&family=Karla:ital,wght@0,400;0,700;1,400&family=Lemon&family=Nunito+Sans:ital,wght@0,400;0,700;0,800;1,400&family=Alice&family=DM+Sans:ital,wght@0,400;0,700;1,400&family=Caveat:wght@600;700&family=Yellowtail",
  ["Fontdiner Swanky","Josefin Sans","Original Surfer","Karla","Lemon","Nunito Sans","Alice","DM Sans","Caveat","Yellowtail"]);
watch();
/* era pairing: 50s supper club tiki, 60s/70s surf, 80s/90s resort gloss, modern island hotel */
const TYPE=[
  {disp:"'Fontdiner Swanky',serif",dw:400,up:0,body:"'Josefin Sans',sans-serif",bw:400,caps:"'Josefin Sans',sans-serif",cw:700,dish:"'Josefin Sans',sans-serif",dishW:700,sig:"'Yellowtail',cursive",sigS:32},
  {disp:"'Original Surfer',sans-serif",dw:400,up:0,body:"'Karla',sans-serif",bw:400,caps:"'Karla',sans-serif",cw:700,dish:"'Karla',sans-serif",dishW:700,sig:"'Yellowtail',cursive",sigS:32},
  {disp:"'Lemon',serif",dw:400,up:1,body:"'Nunito Sans',sans-serif",bw:400,caps:"'Nunito Sans',sans-serif",cw:800,dish:"'Nunito Sans',sans-serif",dishW:800,sig:"'Caveat',cursive",sigS:34},
  {disp:"'Alice',serif",dw:400,up:0,body:"'DM Sans',sans-serif",bw:400,caps:"'DM Sans',sans-serif",cw:700,dish:"'DM Sans',sans-serif",dishW:700,sig:"'Caveat',cursive",sigS:34}
];
/* card stock and lagoon water by era */
const PAPER=[
  {bg:"#f1e2bd",fib:[150,110,60],ink:"#2a1c10",mat:[120,82,40],water:"#1d5a5a"},
  {bg:"#f2d9a6",fib:[160,110,50],ink:"#2b1a0a",mat:[140,90,40],water:"#13616e"},
  {bg:"#fbf3e3",fib:[150,130,100],ink:"#1c1a18",mat:[150,105,55],water:"#0e6c8a"},
  {bg:"#efe8dc",fib:[120,110,95],ink:"#1b1a17",mat:[125,100,70],water:"#1a5866"}
];
const VOICE={
  gritty:{bar:"From the Back Bar",map:"Charted the hard way",note:"Scrawled on a coaster"},
  glossy:{bar:"From the Lagoon Bar",map:"Tonight's islands",note:"From the host"},
  warm:{bar:"From the Lagoon Bar",map:"Islands of the evening",note:"A word from the host"},
  eerie:{bar:"From the Dark Lagoon",map:"Waters uncharted",note:"Washed up on the beach"},
  playful:{bar:"From the Lagoon Bar",map:"Island hopping",note:"Pinned to the bamboo"},
  grand:{bar:"The Grand Lagoon Bar",map:"The archipelago",note:"With the compliments of"},
  tender:{bar:"From the Lagoon Bar",map:"Islands for two",note:"A note at the table"},
  tense:{bar:"Last Call at the Lagoon",map:"Watch the reef",note:"Left with the bartender"},
  scrappy:{bar:"Shack Bar",map:"Rough map, roughly right",note:"Written on a napkin"}
};
const ISLE={s:"Snack Cay",m:"Main Isle",w:"Sweet Reef"};
const LABEL={s:"Pupu Platters",m:"From the Fire Pit",w:"Sweet Reef"};
const FB={venue:"The Lagoon Room",sign:"Island time, all night",by:"The Host",
  noteText:c=>(c.f&&c.f.T)||"Shoes off, feet in the sand, and leave the clock at the door.",
  winks:["Torches lit at sundown","Table by the water","Island time"],prop:{kind:"tag",title:"Lagoon Token",lines:["Good for one cooler","Island time only"]}};

function mat(P,seed){/* woven pandanus mat: crossed slats with fibre noise */
  const a=P.mat;
  return`background-color:${toHex(mix(a,WHITE,.25))};background-image:${noise(".9 .05",2,mix(a,BLACK,.5),.9,seed)},${noise(".05 .9",2,mix(a,WHITE,.5),.5,seed+1)},repeating-linear-gradient(90deg,${rgba(mix(a,BLACK,.45),.75)} 0 2px,${rgba(mix(a,WHITE,.2),.25)} 2px 4px,transparent 4px 26px),repeating-linear-gradient(0deg,${rgba(mix(a,WHITE,.45),.55)} 0 13px,${rgba(mix(a,BLACK,.35),.55)} 13px 26px)`;
}
function stock(P,tone,seed){
  const wear=TONE[tone].wear;
  return`background-color:${P.bg};background-image:radial-gradient(ellipse at 50% 50%,rgba(80,50,10,0) 50%,rgba(80,50,10,${(.14+wear*.3).toFixed(2)}) 100%),${noise(".7",2,P.fib,.22+wear*.2,seed)},${noise(".015",4,P.fib,.18+wear*.35,seed+4,700)}`;
}
function wearLayer(P,tone,seed,folds){
  const w=TONE[tone].wear,lt=mix(hex(P.bg),WHITE,.2);
  let s=`<div style="position:absolute;inset:0;pointer-events:none;background-image:${noise(".05 .08",3,lt,1,seed+9,600)},${noise(".9",1,lt,.9,seed+11)};opacity:${(w*.45).toFixed(2)}"></div>`;
  /* fold-out creases at the thirds */
  if(folds)s+=`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 33.1%,rgba(0,0,0,${.06+w*.1}) 33.3%,rgba(255,255,255,${.15+w*.1}) 33.5%,transparent 33.8%,transparent 66.4%,rgba(0,0,0,${.06+w*.1}) 66.6%,rgba(255,255,255,${.15+w*.1}) 66.8%,transparent 67.1%)"></div>`;
  return s;
}
function img(url,o){
  return`<div style="position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;overflow:hidden;${o.shape||""};background:#123;${o.frame||""}">
    <img alt="" crossorigin="anonymous" src="${url}" style="position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:${o.contain?"contain":"cover"};object-position:${o.pos||"center 35%"};${o.contain?"":`filter:${o.filter};`}">
    ${o.contain?"":o.half?HALFTONE(o.half):""}${o.sheen?SHEEN(o.sheen):""}${o.extra||""}</div>`;
}
function items(list,k,era,ty,C,big){
  const ds=big?30:26,ns=big?21:20;
  return list.map((it,i)=>`<div ${i?`data-drop="${i+1}"`:""}><div style="display:flex;gap:12px;align-items:baseline;margin-top:${big?8:5}px"><span data-fs="${ds}" data-min="19" style="flex:1;font:${ty.dishW} ${ds}px ${ty.dish};line-height:1.12">${T(it.n)}</span><span data-fs="${ds}" data-min="19" style="font:${ty.dishW} ${ds}px ${ty.dish};white-space:nowrap;color:${C.ink}">${price(k,i,era)}</span></div>
    ${it.note?`<div data-note data-fs="${ns}" data-min="16" style="font:italic ${ty.bw} ${ns}px ${ty.body};line-height:1.22;opacity:.86">${T(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`).join("");
}

window.MENU_FORMATS[ID]=ctx=>{
  const era=eraOf(ctx.era),tone=toneOf(ctx.tone),E=ERA[era],TN=TONE[tone];
  const ty=TYPE[E.g],P=PAPER[E.g];
  const C=inks(ctx.palette,P.bg,"#c2502a");
  const fam=isFamily(ctx.f),cs=courses(ctx.menu,fam),F=flav(ctx,FB),V=VOICE[tone];
  const ph=heroes(ctx),year=String(ctx.f.year||"");
  const seed=[...String(ctx.f.title||"x")].reduce((a,c)=>a+c.charCodeAt(0),0)%97;
  const filt=`${E.photo} ${TN.photo}`;
  const mis=E.mis?`text-shadow:3px 2px 0 ${rgba(C.accA,.45)};`:"";
  const up=ty.up?"text-transform:uppercase;":"";
  const url=logoUrl(ctx),title=T(ctx.f.title||"");
  const PO=ph.heroIsPoster;/* poster layout: big whole poster on top, everything else reflowed below it */
  const fbS=PO?(title.length>40?22:title.length>22?28:36):(title.length>40?26:title.length>22?34:44);
  const Y=PO?{mat:696,matH:104,lp:706,ven:808,venH:92,dr:906,drH:136,nt:1048,ntH:116,ft:1170}:{mat:610,matH:200,lp:536,ven:676,venH:126,dr:826,drH:204,nt:1040,ntH:120,ft:1166};
  const vlen=String(F.venue).length,vs=vlen>30?36:vlen>18?42:50;
  const lpDark=`position:absolute;left:50%;top:${Y.lp}px;transform:translateX(-50%) rotate(${TN.tilt*.5}deg);max-width:470px;padding:${PO?10:14}px 24px;box-sizing:border-box;background-color:${C.dark};background-image:${noise(".8",2,[255,255,255],.07,seed)};border-radius:${E.g===2?"18px":"6px"};box-shadow:0 10px 24px rgba(0,0,0,.45)`;
  const lpLight=lpDark.replace(`background-color:${C.dark}`,`background-color:${P.bg}`);
  const drinks=cs.d.length?cs.d:[{n:"House lagoon cooler",note:"Pineapple, lime and crushed ice"}];
  const waterF=hex(P.water);
  const waterBgF=`background-color:${P.water};background-image:${noise(".012 .03",4,mix(waterF,WHITE,.5),.55,seed+2,700)},${noise(".09 .3",2,mix(waterF,WHITE,.7),.35,seed+3,400)};`;
  const front=`<div data-fmt="${ID}" style="position:absolute;inset:0;overflow:hidden;${stock(P,tone,seed)};color:${P.ink};font-family:${ty.body}">
    ${ph.heroIsPoster?`<div style="position:absolute;left:0;top:0;width:600px;height:${Y.mat}px;${waterBgF}overflow:hidden"></div>
    <div style="position:absolute;left:74px;top:12px;width:452px;height:672px;box-sizing:border-box;border:6px solid ${toHex(mix(hex(P.bg),[230,205,150],.5))};box-shadow:0 0 0 5px ${rgba(mix(hex(P.water),WHITE,.35),.6)},0 10px 30px rgba(0,0,0,.5);background:${toHex(mix(hex(P.bg),[230,205,150],.5))}"><img crossorigin="anonymous" alt="" src="${ph.hero}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block"></div>`:img(ph.hero,{x:0,y:0,w:600,h:610,filter:filt,half:E.half,sheen:E.sheen,pos:"center 40%",
      extra:`<div style="position:absolute;left:0;right:0;bottom:0;height:140px;background:linear-gradient(180deg,transparent,${rgba(hex(P.water),.55)})"></div>`})}
    <div style="position:absolute;left:0;top:${Y.mat}px;width:600px;height:${Y.matH}px;${mat(P,seed)};box-shadow:inset 0 8px 14px rgba(0,0,0,.35),inset 0 -2px 0 ${rgba(BLACK,.25)}"></div>
    <div data-lpanel data-dark="${esc(lpDark)}" data-light="${esc(lpLight)}" style="${lpDark}">
      ${url?`<img data-logo crossorigin="anonymous" src="${url}" alt="" style="display:block;max-width:420px;max-height:${PO?60:92}px;object-fit:contain;margin:0 auto">`:""}
      <div data-title-fb data-box style="${url?"display:none;":""}width:420px;max-height:${PO?64:96}px;overflow:hidden;text-align:center"><div data-fs="${fbS}" data-min="20" style="font:${ty.dw} ${fbS}px ${ty.disp};line-height:1.04;color:${C.onDark};${up}">${title}</div></div>
    </div>
    <div data-box style="position:absolute;left:30px;top:${Y.ven}px;width:540px;height:${Y.venH}px;overflow:hidden;text-align:center;padding:8px 14px 6px;box-sizing:border-box;background:${rgba(hex(P.bg),.9)};border-radius:4px;box-shadow:0 4px 10px rgba(0,0,0,.3)">
      <div data-fs="${vs}" data-min="24" style="font:${ty.dw} ${vs}px ${ty.disp};line-height:1.02;color:${C.ink};${up}${mis}">${T(F.venue)}</div>
      <div data-line data-fs="18" data-min="14" style="margin-top:6px;font:${ty.cw} 18px ${ty.caps};letter-spacing:.2em;text-transform:uppercase;white-space:nowrap;overflow:hidden">${T(F.sign)}</div>
    </div>
    <div data-box style="position:absolute;left:34px;top:${Y.dr}px;width:532px;height:${Y.drH}px;overflow:hidden">
      <div style="display:flex;align-items:baseline;gap:12px"><span data-fs="34" data-min="22" style="font:${ty.dw} 34px ${ty.disp};color:${P.ink};${up}white-space:nowrap">${fam?"Lagoon Coolers":V.bar}</span><span style="flex:1;border-top:3px double ${C.ink}"></span></div>
      ${items(drinks,"d",era,ty,C,true)}
    </div>
    <div data-box style="position:absolute;left:34px;top:${Y.nt}px;width:532px;height:${Y.ntH}px;overflow:hidden;border-top:1px solid ${rgba(hex(P.ink),.35)};padding-top:8px;box-sizing:border-box">
      <div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.18em;text-transform:uppercase;color:${C.ink}">${V.note}</div>
      <div data-fs="20" data-min="15" style="font:italic ${ty.bw} 20px ${ty.body};line-height:1.24;margin-top:3px">“${T(F.note.text)}” <span data-fs="${ty.sigS}" data-min="18" style="font:${ty.sigS}px ${ty.sig};color:${C.ink};font-style:normal;white-space:nowrap;margin-left:6px">${T(F.note.by)}</span></div>
    </div>
    <div data-line data-fs="15" data-min="14" style="position:absolute;left:34px;top:${Y.ft}px;width:532px;font:${ty.bw} 15px ${ty.body};white-space:nowrap;overflow:hidden;opacity:.8;text-align:center">${fam?"Every cooler is alcohol free. ":""}Unfold for the island map. Poster and stills: TMDB.</div>
    ${wearLayer(P,tone,seed,true)}
  </div>`;
  /* back: island map of stills on the lagoon, then the kitchen */
  const L=ph.list,main=L[1]||L[0]||ph.poster,isleA=L[2]||L[0]||ph.poster,isleB=L[3]||L[1]||ph.poster;
  const water=hex(P.water);
  const waterBg=`background-color:${P.water};background-image:${noise(".012 .03",4,mix(water,WHITE,.5),.55,seed+2,700)},${noise(".09 .3",2,mix(water,WHITE,.7),.35,seed+3,400)};`;
  const shore=`box-shadow:0 0 0 5px ${rgba(mix(hex(P.bg),[230,205,150],.5),.95)},0 0 0 12px ${rgba(mix(water,WHITE,.35),.6)},0 10px 30px rgba(0,0,0,.45)`;
  const tag=(t,x,y,r)=>`<div style="position:absolute;left:${x}px;top:${y}px;padding:4px 12px;background:${P.bg};color:${P.ink};font:${ty.cw} 16px ${ty.caps};letter-spacing:.14em;text-transform:uppercase;transform:rotate(${r}deg);box-shadow:0 3px 6px rgba(0,0,0,.35);white-space:nowrap">${t}</div>`;
  const pl=propLines(F.prop);
  const back=`<div data-fmt="${ID}" style="position:absolute;inset:0;overflow:hidden;${stock(P,tone,seed+20)};color:${P.ink};font-family:${ty.body}">
    <div style="position:absolute;left:0;top:0;width:600px;height:640px;${waterBg}overflow:hidden">
      <div data-box style="position:absolute;left:24px;top:18px;width:552px;height:56px;overflow:hidden;color:#fff8e8;display:flex;align-items:baseline;justify-content:space-between;gap:14px">
        <span data-fs="36" data-min="22" style="font:${ty.dw} 36px ${ty.disp};${up}white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.4)">${V.map}</span>
        <span data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.16em;text-transform:uppercase;white-space:nowrap">Chart ${esc(F.number)}</span>
      </div>
      ${img(main,{contain:main===ph.poster,x:10,y:80,w:580,h:402,filter:filt,half:E.half,sheen:E.sheen,shape:"border-radius:46% 54% 42% 58% / 52% 44% 56% 48%",frame:shore,pos:"center 38%"})}
      ${tag(ISLE.m,60,440,-3)}
      ${img(isleA,{contain:isleA===ph.poster,x:26,y:494,w:210,h:126,filter:filt,half:E.half,shape:"border-radius:55% 45% 50% 50% / 48% 58% 42% 52%",frame:shore,pos:"center 35%"})}
      ${tag(ISLE.s,44,596,2)}
      ${img(isleB,{contain:isleB===ph.poster,x:364,y:492,w:210,h:128,filter:filt,half:E.half,shape:"border-radius:44% 56% 58% 42% / 55% 45% 55% 45%",frame:shore,pos:"center 35%"})}
      ${tag(ISLE.w,404,596,-2)}
      <div data-box style="position:absolute;left:246px;top:500px;width:112px;height:112px;overflow:hidden;box-sizing:border-box;padding:6px 6px;background:${P.bg};border:2px dashed ${C.ink};border-radius:8px;text-align:center;transform:rotate(${TN.tilt}deg)">
        <div data-fs="15" data-min="14" style="font:${ty.cw} 15px ${ty.caps};letter-spacing:.06em;text-transform:uppercase;color:${C.ink};line-height:1.1">${T(F.prop.title)}</div>
        ${pl.map(l=>`<div data-drop data-fs="14" data-min="14" style="font:${ty.bw} 14px ${ty.body};line-height:1.15;margin-top:2px">${T(l)}</div>`).join("")}
      </div>
    </div>
    <div data-box style="position:absolute;left:34px;top:660px;width:532px;height:430px;overflow:hidden">
      ${["s","m","w"].filter(k=>cs[k].length).map(k=>`<div style="margin-bottom:10px"><div style="display:flex;align-items:baseline;gap:10px"><span data-fs="26" data-min="18" style="font:${ty.dw} 26px ${ty.disp};${up}white-space:nowrap;color:${P.ink}">${LABEL[k]}</span><span data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.14em;text-transform:uppercase;color:${C.ink};white-space:nowrap">${k==="w"?"":"see "+ISLE[k]}</span><span style="flex:1;border-top:2px solid ${C.ink};opacity:.5"></span></div>${items(cs[k],k,era,ty,C,false)}</div>`).join("")}
    </div>
    <div data-box style="position:absolute;left:34px;top:1098px;width:532px;height:84px;overflow:hidden;border-top:3px double ${C.ink};padding-top:6px;box-sizing:border-box">
      <div data-fs="17" data-min="14" style="font:${ty.bw} 17px ${ty.body};line-height:1.25"><b style="font-weight:${ty.cw};color:${C.ink};letter-spacing:.1em;text-transform:uppercase">Ring the gong:</b> ${T(ctx.f.P||"Serve the mains when the torches are lit.")}</div>
      <div style="font:${ty.bw} 15px ${ty.body};line-height:1.3;opacity:.82;margin-top:2px"><span data-fs="15" data-min="14">Poster and stills: TMDB.</span>${F.winks.slice(0,4).map(w=>` <span data-drop data-fs="15" data-min="14">Overheard at the bar: ${T(w)}.</span>`).join("")}</div>
    </div>
    ${wearLayer(P,tone,seed+20,true)}
  </div>`;
  return{w:W,h:H,faces:[front,back]};
};
})();
