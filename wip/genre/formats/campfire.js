/* Format: campfire. Registers window.MENU_FORMATS["campfire"]. Inline styles only; a post-mount fit pass shrinks type so nothing spills. Built for the Movie Night Spinner format library. */
(()=>{
const ID="campfire";
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
const noise=(freq,oct,rgb,a,seed=1,size=320)=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${(rgb[0]/255).toFixed(3)}  0 0 0 0 ${(rgb[1]/255).toFixed(3)}  0 0 0 0 ${(rgb[2]/255).toFixed(3)}  0 0 0 ${a} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`;
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
  const post=ctx.poster?im(ctx.poster,"w780"):"";
  return{list:st,poster:post,hero:st[0]||post,second:st[1]||st[0]||post,isPoster:!st.length};
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
    const dr=[...box.querySelectorAll("[data-drop]")].map((e,i)=>[+(e.dataset.drop||0),i,e]).sort((x,y)=>x[0]-y[0]||x[1]-y[1]);
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
/* ---- campfire: camp or scout mess card on kraft, 2 faces 672x960 ---- */
const W=672,H=960;
loadFonts("family=Stardos+Stencil:wght@400;700&family=Special+Elite&family=Coustard:wght@400;900&family=Cabin:wght@400;600;700&family=Cabin+Condensed:wght@500;600;700&family=Graduate&family=Saira+Stencil+One&family=Caveat:wght@600;700&family=Homemade+Apple",
  ["Stardos Stencil","Special Elite","Coustard","Cabin","Cabin Condensed","Graduate","Saira Stencil One","Caveat","Homemade Apple"]);
watch();
/* type pairing by era: stencilled depot card, 70s camp brochure, varsity camp, modern stencil kit */
const TYPE=[
  {disp:"'Stardos Stencil',serif",dw:700,up:1,body:"'Special Elite',monospace",bw:400,dish:"'Special Elite',monospace",dishW:400,caps:"'Stardos Stencil',serif",cw:700,sig:"'Homemade Apple',cursive",sigS:24},
  {disp:"'Coustard',serif",dw:900,up:0,body:"'Cabin',sans-serif",bw:400,dish:"'Coustard',serif",dishW:400,caps:"'Cabin',sans-serif",cw:700,sig:"'Caveat',cursive",sigS:34},
  {disp:"'Graduate',serif",dw:400,up:1,body:"'Cabin',sans-serif",bw:400,dish:"'Cabin',sans-serif",dishW:700,caps:"'Graduate',serif",cw:400,sig:"'Caveat',cursive",sigS:34},
  {disp:"'Saira Stencil One',sans-serif",dw:400,up:1,body:"'Cabin Condensed',sans-serif",bw:500,dish:"'Cabin Condensed',sans-serif",dishW:700,caps:"'Cabin Condensed',sans-serif",cw:700,sig:"'Caveat',cursive",sigS:34}
];
/* kraft stock by era: dark depot kraft, orange camp kraft, manila card, grey recycled */
const PAPER=[
  {bg:"#a47c4e",fib:[66,42,18],spk:[232,208,165],ink:"#24160a",print:"#efe5cf"},
  {bg:"#bb8a53",fib:[96,58,22],spk:[240,214,170],ink:"#2b1a0b",print:"#f6ecd6"},
  {bg:"#caa671",fib:[120,86,40],spk:[246,230,196],ink:"#271b0e",print:"#fbf7ee"},
  {bg:"#b3a084",fib:[84,72,56],spk:[236,228,214],ink:"#1f1b16",print:"#ffffff"}
];
const VOICE={
  gritty:{t:"Chow Line",n:"Nailed to the mess hall door",b:"Earned the hard way"},
  glossy:{t:"Camp Kitchen",n:"From the director's desk",b:"Badges this session"},
  warm:{t:"Supper Is Served",n:"Pinned to the notice board",b:"Merit badges on offer"},
  eerie:{t:"Supper Before Dark",n:"Found under the cabin door",b:"Stay with the group for"},
  playful:{t:"Grub's Up",n:"Scribbled on the bunk wall",b:"Badges up for grabs"},
  grand:{t:"The Lodge Table",n:"From the lodge",b:"Honours of the session"},
  tender:{t:"Round the Fire",n:"Left on your pillow",b:"Badges worth keeping"},
  tense:{t:"Head Count Supper",n:"Orders from the cabin",b:"Required before lights out"},
  scrappy:{t:"Chow Line",n:"Taped to the canteen",b:"Badges, maybe"}
};
const LABEL={s:"Trail Snacks",m:"Mess Hall Mains",w:"Campfire Treats",d:"Canteen Drinks"};
const FB={venue:"The Camp Mess Hall",sign:"Lights out at ten",by:"The Camp Director",
  noteText:c=>(c.f&&c.f.T)||"Wash up, line up, and save room for the campfire.",
  winks:["Early riser","Campfire cook","Clean plate"],prop:{kind:"ticket",title:"Mess Ticket",lines:["Admit one camper","Seconds on request"]}};

function border(tone,col){
  if(/warm|tender|playful/.test(tone))return`<div style="position:absolute;inset:14px;border:3px dashed ${col};border-radius:12px;opacity:.7;pointer-events:none"></div>`;
  if(/grand|glossy/.test(tone))return`<div style="position:absolute;inset:12px;border:7px double ${col};pointer-events:none"></div>`;
  if(/eerie|tense/.test(tone))return`<div style="position:absolute;inset:16px;border:2px solid ${col};opacity:.8;pointer-events:none"></div>`;
  return"";
}
function stock(P,tone,seed){
  const wear=TONE[tone].wear;
  return`background-color:${P.bg};background-image:${noise(".5 .02",3,P.fib,1.1,seed)},${noise(".9 .05",2,P.spk,.8,seed+1)},${noise(".8",2,P.spk,.55,seed+3)},${noise(".012",4,P.fib,.6+wear*.35,seed+5,700)};box-shadow:inset 0 0 ${50+wear*70}px rgba(40,22,6,${.25+wear*.4})`;
}
function wearLayer(P,tone,seed){
  const w=TONE[tone].wear,lt=mix(hex(P.bg),WHITE,.25);
  let s=`<div style="position:absolute;inset:0;pointer-events:none;background-image:${noise(".045 .07",3,lt,1,seed+9,600)},${noise(".95",1,lt,.9,seed+11)};opacity:${(w*.42).toFixed(2)}"></div>`;
  if(w>.7)s+=`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(94deg,transparent 49.4%,rgba(255,255,255,.16) 49.7%,rgba(0,0,0,.14) 50.1%,transparent 50.5%)"></div>`;
  return s;
}
function photo(url,o){
  return`<div style="position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;padding:${o.pad}px;box-sizing:border-box;background:${o.print};transform:rotate(${o.rot}deg);box-shadow:0 10px 20px rgba(20,10,0,.4),0 1px 0 rgba(0,0,0,.2)">
  <div style="position:relative;width:100%;height:100%;overflow:hidden;background:#2a2016">
    <div style="position:absolute;inset:0;background:url('${url}') ${o.pos||"center 30%"}/cover no-repeat;filter:${o.filter}"></div>
    ${o.half?HALFTONE(o.half):""}${o.sheen?SHEEN(o.sheen):""}${o.extra||""}
  </div></div>`;
}
function logoPanel(ctx,x,y,maxW,ty,C,P,year){
  const url=logoUrl(ctx),title=T(ctx.f.title||"");
  const dark=`position:absolute;left:${x}px;top:${y}px;max-width:${maxW}px;padding:14px 20px 10px;box-sizing:border-box;background-color:${C.dark};background-image:${noise(".8",2,[255,255,255],.08,4)};border-radius:6px;box-shadow:0 8px 18px rgba(0,0,0,.45);transform:rotate(${(TONE[ctx.tone]||TONE.warm).tilt*.4}deg)`;
  const light=dark.replace(`background-color:${C.dark}`,`background-color:${P.print}`);
  const fbSize=title.length>40?26:title.length>24?32:title.length>12?40:48;
  return`<div data-lpanel data-dark="${esc(dark)}" data-light="${esc(light)}" style="${dark}">
    ${url?`<img data-logo crossorigin="anonymous" src="${url}" alt="" style="display:block;max-width:${maxW-40}px;max-height:96px;object-fit:contain">`:""}
    <div data-title-fb data-box style="${url?"display:none;":""}width:${maxW-40}px;max-height:110px;overflow:hidden"><div data-fs="${fbSize}" data-min="20" style="font:${ty.dw} ${fbSize}px ${ty.disp};line-height:1.02;color:${C.onDark};${ty.up?"text-transform:uppercase;":""}">${title}</div></div>
    <div data-pink data-pink-l="${C.ink}" data-pink-d="${C.onDark}" style="margin-top:8px;font:${ty.cw} 16px ${ty.caps};letter-spacing:.22em;text-transform:uppercase;color:${C.onDark}">Session of ${esc(year)}</div>
  </div>`;
}
function prop(p,ty,C,P,x,y,w,h){
  const L=propLines(p);
  return`<div data-box style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;box-sizing:border-box;padding:8px 12px 6px 18px;background:${P.print};border-left:3px dashed ${C.ink};box-shadow:0 4px 10px rgba(0,0,0,.3);transform:rotate(2deg);color:#2a2219">
    <div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.12em;text-transform:uppercase;color:${C.ink};line-height:1.15">${T(p.title)}</div>
    ${L.map(l=>`<div data-fs="16" data-min="14" data-drop style="font:${ty.bw} 16px ${ty.body};line-height:1.2">${T(l)}</div>`).join("")}
  </div>`;
}
function menuHTML(cs,era,ty,C,tone){
  const rule=/warm|tender|playful/.test(tone)?"dashed":"solid";
  return["s","m","w","d"].filter(k=>cs[k].length).map(k=>`<div style="margin:0 0 10px">
    <div style="display:flex;align-items:center;gap:12px"><span data-fs="22" data-min="16" style="font:${ty.cw} 22px ${ty.caps};letter-spacing:.14em;text-transform:uppercase;color:${C.ink};white-space:nowrap">${LABEL[k]}</span><span style="flex:1;border-top:2px ${rule} ${C.ink};opacity:.6"></span></div>
    ${cs[k].map((it,i)=>`<div ${i?`data-drop="${i+1}"`:""}><div style="display:flex;gap:14px;align-items:baseline;margin-top:5px"><span data-fs="26" data-min="19" style="flex:1;font:${ty.dishW} 26px ${ty.dish};line-height:1.12">${T(it.n)}</span><span data-fs="26" data-min="19" style="font:${ty.dishW} 26px ${ty.dish};white-space:nowrap;color:${C.ink}">${price(k,i,era)}</span></div>
      ${it.note?`<div data-note data-fs="20" data-min="16" style="font:${ty.bw} 20px ${ty.body};line-height:1.22;opacity:.86">${T(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`).join("")}
  </div>`).join("");
}

window.MENU_FORMATS[ID]=ctx=>{
  const era=eraOf(ctx.era),tone=toneOf(ctx.tone),E=ERA[era],TN=TONE[tone];
  const ty=TYPE[E.g],P=PAPER[E.g];
  const C=inks(ctx.palette,P.bg,"#7a2e1c");
  const fam=isFamily(ctx.f),cs=courses(ctx.menu,fam),F=flav(ctx,FB),V=VOICE[tone];
  const ph=heroes(ctx),year=String(ctx.f.year||"");
  const seed=[...String(ctx.f.title||"x")].reduce((a,c)=>a+c.charCodeAt(0),0)%97;
  const filt=`${E.photo} ${TN.photo}`;
  const mis=E.mis?`text-shadow:3px 2px 0 ${rgba(C.accA,.4)};`:"";
  const vlen=String(F.venue).length,vs=vlen>34?34:vlen>22?40:46;
  const badges=F.winks.slice(0,3),rest=F.winks.slice(3);
  const sigCol=C.ink;
  const front=`<div data-fmt="${ID}" style="position:absolute;inset:0;overflow:hidden;${stock(P,tone,seed)};color:${P.ink};font-family:${ty.body}">
    ${border(tone,C.ink)}
    <div data-box style="position:absolute;left:38px;top:34px;width:596px;height:112px;overflow:hidden">
      <div data-line data-fs="18" data-min="14" style="font:${ty.cw} 18px ${ty.caps};letter-spacing:.2em;text-transform:uppercase;color:${C.ink};white-space:nowrap;overflow:hidden">${T(F.sign)}</div>
      <div data-fs="${vs}" data-min="24" style="margin-top:6px;font:${ty.dw} ${vs}px ${ty.disp};line-height:1.02;${ty.up?"text-transform:uppercase;":""}color:${P.ink};${mis}transform:rotate(${TN.tilt*.3}deg);transform-origin:left">${T(F.venue)}</div>
    </div>
    ${photo(ph.hero,{x:18,y:150,w:636,h:492,pad:10,print:P.print,rot:TN.tilt*.5,filter:filt,half:E.half,sheen:E.sheen,pos:ph.isPoster?"center 22%":"center 35%"})}
    ${logoPanel(ctx,34,560,400,ty,C,P,year)}
    <div data-box style="position:absolute;left:38px;top:708px;width:596px;height:118px;overflow:hidden">
      <div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.18em;text-transform:uppercase;color:${C.ink}">${V.n}</div>
      <div data-fs="20" data-min="16" style="margin-top:4px;font:${ty.bw} 20px ${ty.body};line-height:1.25">“${T(F.note.text)}”</div>
      <div data-fs="${ty.sigS}" data-min="18" style="text-align:right;font:700 ${ty.sigS}px ${ty.sig};color:${sigCol};line-height:1.15;margin-top:2px;transform:rotate(-2deg)">${T(F.note.by)}</div>
    </div>
    <div style="position:absolute;left:38px;top:832px;width:596px;height:96px">
      <div data-line data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.18em;text-transform:uppercase;color:${C.ink};white-space:nowrap;overflow:hidden;width:596px">${V.b}</div>
      <div style="display:flex;gap:12px;margin-top:6px">${badges.map((b,i)=>`<div data-box style="flex:1;height:68px;overflow:hidden;box-sizing:border-box;padding:6px 10px;border-radius:12px;background-color:${i%2?C.dark:C.deep};background-image:${noise(".7",3,[255,255,255],.12,seed+i)};outline:2px dashed ${rgba(mix(C.accA,WHITE,.6),.85)};outline-offset:-6px;display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(${(i-1)*1.2*(TN.tilt?1:0)}deg)"><div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};line-height:1.12;color:#fbf3e2;letter-spacing:.04em">${T(b)}</div></div>`).join("")}</div>
    </div>
    ${wearLayer(P,tone,seed)}
  </div>`;
  const stampRot=-4+TN.tilt;
  const back=`<div data-fmt="${ID}" style="position:absolute;inset:0;overflow:hidden;${stock(P,tone,seed+20)};color:${P.ink};font-family:${ty.body}">
    ${border(tone,C.ink)}
    <div data-box style="position:absolute;left:38px;top:34px;width:430px;height:72px;overflow:hidden">
      <div data-line data-fs="42" data-min="26" style="font:${ty.dw} 42px ${ty.disp};line-height:1.05;${ty.up?"text-transform:uppercase;":""}white-space:nowrap;overflow:hidden;${mis}">${V.t}</div>
      <div data-line data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.16em;text-transform:uppercase;color:${C.ink};white-space:nowrap;overflow:hidden">${T(F.venue)}</div>
    </div>
    <div style="position:absolute;right:40px;top:36px;padding:6px 14px;border:3px solid ${C.ink};border-radius:4px;color:${C.ink};font:${ty.cw} 16px ${ty.caps};letter-spacing:.16em;text-transform:uppercase;text-align:center;transform:rotate(${stampRot}deg);opacity:.88;line-height:1.25">Card no.<br><span style="font:${ty.dw} 28px ${ty.disp};letter-spacing:.04em">${T(F.number)}</span></div>
    ${photo(ph.second,{x:20,y:112,w:632,h:288,pad:8,print:P.print,rot:-TN.tilt*.4,filter:filt,half:E.half,sheen:E.sheen,pos:ph.isPoster?"center 30%":"center 40%",
      extra:`<div style="position:absolute;left:12px;bottom:12px;padding:5px 12px;background:${P.print};color:#2a2219;font:${ty.cw} 16px ${ty.caps};letter-spacing:.16em;text-transform:uppercase">Tonight's feature, ${esc(year)}</div>`})}
    <div data-box style="position:absolute;left:38px;top:418px;width:596px;height:378px;overflow:hidden">${menuHTML(cs,era,ty,C,tone)}</div>
    <div data-box style="position:absolute;left:38px;top:808px;width:370px;height:86px;overflow:hidden">
      <div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.18em;text-transform:uppercase;color:${C.ink}">Bugle call</div>
      <div data-fs="18" data-min="14" style="font:${ty.bw} 18px ${ty.body};line-height:1.25;margin-top:2px">${T(ctx.f.P||"Serve the mains when the campfire is lit.")}</div>
    </div>
    ${prop(F.prop,ty,C,P,428,804,210,92)}
    <div data-box style="position:absolute;left:38px;top:900px;width:596px;height:40px;overflow:hidden;font:${ty.bw} 15px ${ty.body};line-height:1.3;opacity:.85">
      <span data-fs="15" data-min="14">${fam?"Every drink is alcohol free. ":""}Images: TMDB. Form CM ${esc(F.number)}.</span>${rest.map(w=>` <span data-drop data-fs="15" data-min="14">Ask the cook about: ${T(w)}.</span>`).join("")}
    </div>
    ${wearLayer(P,tone,seed+20)}
  </div>`;
  return{w:W,h:H,faces:[front,back]};
};
})();
