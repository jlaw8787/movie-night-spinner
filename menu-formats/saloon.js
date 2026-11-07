/* Format: saloon. Registers window.MENU_FORMATS["saloon"]. Inline styles only; a post-mount fit pass shrinks type so nothing spills. Built for the Movie Night Spinner format library. */
(()=>{
const ID="saloon";
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
[/\b(whiskey|whisky|bourbon)\b|\bscotch\b(?! (eggs?|bonnets?|broth|fillets?|finger|pancakes?|pies?|mist|tape))/gi,"butterscotch"],[/\bmai tais?\b/gi,"lagoon cooler"],[/\bpi[nñ]a coladas?\b/gi,"pineapple colada"],[/\bmargaritas?\b/gi,"lime slushie"],[/\brum\b/gi,"coconut"],[/\b(wine|sangria)s?\b/gi,"grape juice"],[/\b(champagne|prosecco)\b/gi,"sparkling apple"],[/\b(beer|ale|lager|stout)s?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(vodka|gin|tequila|brandy|liqueur|sake|grog)\b/gi,"fizz"],[/\b(spiked|boozy)\b/gi,"fizzy"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
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
  if(v>=10)return (Math.round(v*2)/2).toFixed(2);
  return (Math.round(v*4)/4).toFixed(2);
}
function heroes(ctx){
  const im=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");
  const st=(ctx.stills||[]).filter(Boolean).map(p=>im(p,"w1280"));
  /* tmdb-posters.js declares a top level const, so window.TMDB_POSTERS is empty: read the binding directly */
  let pp=ctx.poster;if(!pp){try{pp=(typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&ctx.f&&TMDB_POSTERS[ctx.f.id||`${ctx.f.title} (${ctx.f.year})`]}catch(e){}}
  const post=pp?im(pp,"w780"):"";
  return{list:st,poster:post,hero:post||st[0],heroIsPoster:!!post,second:st[1]||st[0]||post,isPoster:!st.length};
}
function logoUrl(ctx){const l=ctx.logo;if(!l||!l[0])return"";const im=ctx.img||((p,s)=>`https://image.tmdb.org/t/p/${s}${p}`);return im(l[0],"w500")}
function flav(ctx,fb){
  const v=ctx.flavour||{};const note=v.note&&v.note.text?v.note:null;
  const winks=(v.winks||[]).filter(Boolean);
  return{venue:v.venue||fb.venue,sign:v.sign||fb.sign,note:note?{text:note.text,by:note.by||fb.by}:{text:fb.noteText(ctx),by:fb.by},
    winks:winks.length?winks:fb.winks,prop:v.prop&&v.prop.title?v.prop:fb.prop,
    number:String(v.number||"").replace(/[^0-9a-z]/gi,"").slice(0,6)||((y=>y.slice(-2)==="00"?y:y.slice(-2))(String(ctx.f&&ctx.f.year||"")))/* a 2000 film reads "2000", never "REWARD $00" (review 12) */||"7",has:!!ctx.flavour};
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
function fitRoot(root){fitRoot0(root);
  const hid=()=>[...root.querySelectorAll('[data-col] [data-note]')].filter(n=>n.style.display==="none").length;
  root.querySelectorAll('[data-col="1"]').forEach(L=>{if(L.dataset.moved||!L.querySelector('[data-course="m"]')||L.querySelectorAll("[data-course]").length<2)return;const h1=hid();if(!h1)return;
    L.dataset.moved="1";fitRoot0(root);if(hid()>=h1){L.dataset.moved="0";fitRoot0(root)}})}
function fitRoot0(root){
  root.querySelectorAll("[data-fs]").forEach(n=>{n.style.fontSize=n.dataset.fs+"px"});
  if(window.__fmtTrimReset)window.__fmtTrimReset(root);root.querySelectorAll("[data-note]").forEach(n=>{n.style.display="";n.style.webkitLineClamp="";n.style.overflow=""});
  root.querySelectorAll("[data-drop]").forEach(n=>{n.style.display=""});
  root.querySelectorAll("[data-line]").forEach(n=>{for(let k=0;k<80&&n.scrollWidth>n.clientWidth+1;k++){const s=parseFloat(n.style.fontSize);if(s<=+(n.dataset.min||14))break;n.style.fontSize=(s-1)+"px"}});
  /* review 15: the left column (starters and mains, under the poster) hid notes while the right one had room (Tombstone, Unforgiven).
     The mains move across to the top of the right column when the left will not hold them and the right will */
  root.querySelectorAll('[data-col="1"]').forEach(L=>{const R=L.parentElement.querySelector('[data-col="2"]');if(!R)return;
    [...R.querySelectorAll('[data-course="s"],[data-course="m"]')].forEach(c=>L.appendChild(c));
    const m=L.querySelector('[data-course="m"]');if(L.dataset.moved==="1"&&m&&L.querySelectorAll("[data-course]").length>1)R.insertBefore(m,R.firstChild)});
  root.querySelectorAll("[data-box]").forEach(box=>{
    if(box.offsetParent===null&&getComputedStyle(box).position!=="fixed")return;
    const nodes=[...box.querySelectorAll("[data-fs]")].filter(n=>!n.hasAttribute("data-line"));
    for(let k=0;k<60&&over(box);k++){let ch=false;nodes.forEach(n=>{const s=parseFloat(n.style.fontSize),m=+(n.dataset.min||16);if(s>m){n.style.fontSize=(s-1)+"px";ch=true}});if(!ch)break}
    if(over(box)){const ns=[...box.querySelectorAll("[data-note]")];
      /* review 15: no clamped notes (the screen showed "..." where the PDF printed the note in full); each note from the bottom is shortened at a break, and hidden only if that still will not fit */
      (window.__fmtTrim?window.__fmtTrim(ns,()=>over(box)):(()=>{for(let i=ns.length-1;i>=0&&over(box);i--)ns[i].style.display="none"})())}
    /* last resort: drop extra items (highest index first, later courses first), then fine print extras */
    const dr=[...box.querySelectorAll("[data-drop]")].filter(e=>e.parentElement.closest("[data-box]")===box||e.closest("[data-box]")===box).map((e,i)=>[+(e.dataset.drop||0),i,e]).sort((x,y)=>x[0]-y[0]||x[1]-y[1]);
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
/* ---- saloon: frontier saloon bill of fare, wood type poster, 1 face 816x1344 ---- */
const W=816,H=1344;
loadFonts("family=Ewert&family=IM+Fell+DW+Pica:ital@0;1&family=IM+Fell+DW+Pica+SC&family=Smokum&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Diplomata+SC&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Podkova:wght@400;600;800&family=Homemade+Apple&family=Mr+Dafoe&family=Caveat:wght@600;700",
  ["Ewert","IM Fell DW Pica","IM Fell DW Pica SC","Smokum","Old Standard TT","Diplomata SC","Libre Baskerville","Podkova","Homemade Apple","Mr Dafoe","Caveat"]);
watch();
/* era pairing: 1880s style wood type, 60s western revival, 80s/90s engraved card, modern slab */
const TYPE=[
  {disp:"'Ewert',serif",dw:400,body:"'IM Fell DW Pica',serif",bw:400,caps:"'IM Fell DW Pica SC',serif",cw:400,dish:"'IM Fell DW Pica',serif",dishW:400,sig:"'Homemade Apple',cursive",sigS:22,dispLs:".02em"},
  {disp:"'Smokum',serif",dw:400,body:"'Old Standard TT',serif",bw:400,caps:"'Old Standard TT',serif",cw:700,dish:"'Old Standard TT',serif",dishW:700,sig:"'Mr Dafoe',cursive",sigS:34,dispLs:".03em"},
  {disp:"'Diplomata SC',serif",dw:400,body:"'Libre Baskerville',serif",bw:400,caps:"'Libre Baskerville',serif",cw:700,dish:"'Libre Baskerville',serif",dishW:700,sig:"'Mr Dafoe',cursive",sigS:34,dispLs:"0"},
  {disp:"'Podkova',serif",dw:800,body:"'Podkova',serif",bw:400,caps:"'Podkova',serif",cw:600,dish:"'Podkova',serif",dishW:600,sig:"'Caveat',cursive",sigS:34,dispLs:".01em"}
];
const PAPER=[
  {bg:"#e6d6b2",fox:[150,105,50],fib:[120,95,60],ink:"#21170e"},
  {bg:"#e9d3a2",fox:[170,110,40],fib:[130,96,50],ink:"#2a1a0c"},
  {bg:"#efe4c9",fox:[150,120,80],fib:[120,100,70],ink:"#1f1810"},
  {bg:"#f2ebdc",fox:[140,125,100],fib:[110,100,86],ink:"#1b1814"}
];
const VOICE={
  gritty:{k:"Hot grub, no credit",w:"Wanted for supper",c:"When the bell rings"},
  glossy:{k:"Fine dining west of the river",w:"Wanted at the table",c:"Served promptly"},
  warm:{k:"Hot meals, warm welcome",w:"Wanted at the table",c:"Supper bell"},
  eerie:{k:"Open past midnight",w:"Last seen at supper",c:"When the lamps go low"},
  playful:{k:"Beans served nightly",w:"Wanted for second helpings",c:"Dinner bell"},
  grand:{k:"By appointment to the territory",w:"Wanted at the head table",c:"The bill of fare"},
  tender:{k:"Home cooking for travellers",w:"Wanted home for supper",c:"Supper bell"},
  tense:{k:"Check your guns at the door",w:"Wanted, dead hungry",c:"At high noon"},
  scrappy:{k:"Grub, cheap",w:"Wanted: one hungry stranger",c:"Grub's up"}
};
const LABEL={s:"Lunch Counter",m:"From the Kitchen",w:"Sweets",d:"At the Bar"};
const LABEL_DRY={d:"Sarsaparilla Bar"};
const FB={venue:"The Long Bar",sign:"Hot meals and rooms upstairs",by:"The Management",
  noteText:c=>(c.f&&c.f.T)||"Wipe your boots, hang your hat, and sit where you like.",
  winks:["Rooms upstairs","Fresh water out back","Stable round the side"],prop:{kind:"slip",title:"House Rules",lines:["No credit","Hats off at supper"]}};

function border(tone,C,P){
  if(/grand|glossy/.test(tone))return`<div style="position:absolute;inset:14px;border:10px solid ${C.ink};pointer-events:none"></div><div style="position:absolute;inset:30px;border:2px solid ${C.ink};pointer-events:none"></div>`;
  if(/warm|tender|playful/.test(tone))return`<div style="position:absolute;inset:16px;border:4px solid ${C.ink};pointer-events:none"></div><div style="position:absolute;inset:24px;border:1px solid ${C.ink};pointer-events:none"></div>`;
  if(/eerie|tense/.test(tone))return`<div style="position:absolute;inset:18px;border:2px solid ${P.ink};pointer-events:none"></div>`;
  return"";
}
function stock(P,tone,seed){
  const wear=TONE[tone].wear;
  return`background-color:${P.bg};background-image:radial-gradient(ellipse at 50% 50%,rgba(90,55,15,0) 50%,rgba(90,55,15,${(.15+wear*.35).toFixed(2)}) 100%),${noise(".02",4,P.fox,.3+wear*.45,seed,800)},${noise(".8 .05",2,P.fib,.35,seed+2)},${noise(".6",2,P.fox,.18+wear*.2,seed+4)}`;
}
function wearLayer(P,tone,seed){
  const w=TONE[tone].wear,lt=mix(hex(P.bg),WHITE,.15);
  let s=`<div style="position:absolute;inset:0;pointer-events:none;background-image:${noise(".05 .09",3,lt,1,seed+9,600)},${noise(".9",1,lt,.9,seed+11)};opacity:${(w*.5).toFixed(2)}"></div>`;
  if(w>.45)s+=`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 33.2%,rgba(0,0,0,.1) 33.4%,rgba(255,255,255,.2) 33.6%,transparent 33.9%,transparent 66.4%,rgba(0,0,0,.1) 66.6%,rgba(255,255,255,.2) 66.8%,transparent 67.1%)"></div>`;
  return s;
}
function rule(C,w){return`<div style="display:flex;align-items:center;gap:8px;justify-content:center"><span style="width:${w}px;border-top:3px solid ${C};"></span><span style="width:${w}px;border-top:1px solid ${C}"></span></div>`}
function menuCol(keys,cs,era,ty,C,fam){
  return keys.filter(k=>cs[k].length).map(k=>`<div data-course="${k}" style="margin:0 0 12px">
    <div style="text-align:center;border-top:2px solid ${C.ink};border-bottom:2px solid ${C.ink};padding:3px 0 2px;margin-bottom:4px"><span data-fs="22" data-min="16" style="font:${ty.cw} 22px ${ty.caps};letter-spacing:.16em;text-transform:uppercase;color:${C.ink}">${fam&&LABEL_DRY[k]||LABEL[k]}</span></div>
    ${cs[k].map((it,i)=>`<div ${i?`data-drop="${i+1}"`:""}><div style="display:flex;gap:10px;align-items:baseline;margin-top:5px"><span data-fs="26" data-min="18" style="flex:1;font:${ty.dishW} 26px ${ty.dish};line-height:1.1">${T(it.n)}</span><span data-fs="26" data-min="18" style="font:${ty.dishW} 26px ${ty.dish};white-space:nowrap;color:${C.ink}">${(cs._p?cs._p[k][i]:price(k,i,era))}</span></div>
      ${it.note?`<div data-note data-fs="20" data-min="16" style="font:italic ${ty.bw} 20px ${ty.body};line-height:1.2;opacity:.85">${T(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`).join("")}
  </div>`).join("");
}

window.MENU_FORMATS[ID]=ctx=>{
  const era=eraOf(ctx.era),tone=toneOf(ctx.tone),E=ERA[era],TN=TONE[tone];
  const ty=TYPE[E.g],P=PAPER[E.g];
  const C=inks(ctx.palette,P.bg,"#8c2a1a");
  const fam=isFamily(ctx.f),cs=courses(ctx.menu,fam),F=flav(ctx,FB),V=VOICE[tone];
  /* review 15: the two menu columns under the poster are only about 260px tall and hid notes on 8 of 12 films. A heavy menu takes height from the poster,
     which keeps its 2:3 shape */
  const loadS=ks=>ks.reduce((a,k)=>a+(cs[k]||[]).reduce((b,it)=>b+1.4+String(it.note||"").length/42,0)+1.2,0),ld=Math.max(loadS(["s","m"]),loadS(["w","d"]));
  const cutS=ld>9?170:ld>7.5?130:ld>6?90:ld>5?50:0;
  /* the shared price check: Doc's rye old fashioned never sits under the peach pie (Tombstone) */
  if(window.priceSense){const P={};for(const k of ["s","m","w","d"])P[k]=cs[k].map((x,i)=>price(k,i,era));cs._p=window.priceSense(cs,P)}
  const ph=heroes(ctx),year=String(ctx.f.year||"");
  const seed=[...String(ctx.f.title||"x")].reduce((a,c)=>a+c.charCodeAt(0),0)%97;
  const filt=`${E.photo} ${TN.photo} ${E.g<2?"sepia(.25)":""}`;
  const mis=E.mis?`text-shadow:3px 2px 0 ${rgba(C.accA,.45)};`:"";
  const vlen=String(F.venue).length,vs=vlen>36?54:vlen>24?64:vlen>14?78:92;
  const url=logoUrl(ctx),title=T(ctx.f.title||"");
  const fb=Math.max(14,Math.min(title.length>40?20:title.length>22?24:30,Math.floor(150/(Math.max(...String(title).replace(/<[^>]*>/g,"").split(/\s+/).map(w=>w.length),1)*.7))));
  const reward=/^\d+$/.test(F.number)?`$${F.number}`:F.number;
  const lpDark=`position:relative;display:block;width:100%;max-width:182px;padding:10px 12px;box-sizing:border-box;background-color:${C.dark};background-image:${noise(".02 .5",3,[255,235,200],.16,seed,500)},${noise(".9",2,[255,255,255],.07,seed+1)};box-shadow:0 6px 14px rgba(0,0,0,.4)`;
  const lpLight=lpDark.replace(`background-color:${C.dark}`,`background-color:${toHex(mix(hex(P.bg),WHITE,.5))}`);
  const face=`<div data-fmt="${ID}" style="position:absolute;inset:0;overflow:hidden;${stock(P,tone,seed)};color:${P.ink};font-family:${ty.body}">
    ${wearLayer(P,tone,seed)}
    ${border(tone,C,P)}
    <div style="position:absolute;left:44px;right:44px;top:40px;bottom:38px;display:flex;flex-direction:column">
    <div data-box style="flex:none;max-height:170px;overflow:hidden;text-align:center">
      <div data-line data-fs="20" data-min="14" style="font:${ty.cw} 20px ${ty.caps};letter-spacing:.24em;text-transform:uppercase;color:${C.ink};white-space:nowrap;overflow:hidden">${T(F.sign)}</div>
      <div data-fs="${Math.min(vs,70)}" data-min="30" style="margin-top:4px;font:${ty.dw} ${Math.min(vs,70)}px ${ty.disp};line-height:.98;letter-spacing:${ty.dispLs};text-transform:uppercase;color:${P.ink};${mis}">${T(F.venue)}</div>
      <div style="margin-top:6px">${rule(C.ink,150)}</div>
      <div data-line data-fs="24" data-min="18" style="margin-top:2px;font:${ty.dw} 24px ${ty.disp};letter-spacing:.12em;text-transform:uppercase;color:${C.ink};white-space:nowrap;overflow:hidden">Bill of Fare</div>
    </div>
    <div style="flex:none;margin-top:10px;display:flex;gap:16px;height:${792-cutS}px">
      <div style="flex:none;position:relative;width:${Math.round(520*(780-cutS)/780)}px;height:${780-cutS}px;border:6px solid ${P.ink};box-shadow:0 0 0 3px ${P.bg},0 0 0 5px ${C.ink};overflow:hidden;background:#1e140c">
        ${ph.heroIsPoster?`<img crossorigin="anonymous" alt="" src="${ph.hero}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">`:`<div style="position:absolute;inset:0;background:url('${ph.hero}') center 35%/cover no-repeat;filter:${filt}"></div>
        ${E.half?HALFTONE(E.half):""}${E.sheen?SHEEN(E.sheen):""}
        <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${60+TN.wear*80}px rgba(30,15,0,${.25+TN.wear*.4})"></div>`}
      </div>
      <div data-box style="flex:1;min-width:0;height:${792-cutS}px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center">
        <div>
          <div data-fs="24" data-min="16" style="font:${ty.dw} 24px ${ty.disp};line-height:1.08;letter-spacing:.04em;text-transform:uppercase">${V.w}</div>
          <div style="margin-top:6px;font:${ty.cw} 18px ${ty.caps};letter-spacing:.12em;text-transform:uppercase;color:${C.ink}">Reward ${esc(reward)}</div>
        </div>
        <div data-lpanel data-dark="${esc(lpDark)}" data-light="${esc(lpLight)}" style="${lpDark}">
          ${url?`<img data-logo crossorigin="anonymous" src="${url}" alt="" style="display:block;max-width:150px;max-height:96px;object-fit:contain">`:""}
          <div data-title-fb data-box style="${url?"display:none;":""}width:150px;max-height:120px;overflow:hidden;text-align:center"><div data-fs="${fb}" data-min="16" style="font:${ty.dw} ${fb}px ${ty.disp};line-height:1.02;text-transform:uppercase;color:${C.onDark};overflow-wrap:normal;word-break:keep-all">${title}</div></div>
        </div>
        <div>
          <div style="font:${ty.dw} 16px ${ty.disp};line-height:1.25;text-transform:uppercase;color:${C.ink}">Now showing</div>
          <div style="font:${ty.dw} 30px ${ty.disp};line-height:1.1;color:${C.ink}">${esc(year)}</div>
        </div>
        <div data-box style="width:100%;height:250px;overflow:hidden">
          <div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.12em;text-transform:uppercase;color:${C.ink}">${V.c}, ${esc(year)}</div>
          <div data-fs="17" data-min="14" style="font:italic ${ty.bw} 17px ${ty.body};line-height:1.22;margin-top:3px">${T(ctx.f.P||"Supper is served at sundown.")}</div>
          <div data-fs="17" data-min="14" style="margin-top:10px;font:italic ${ty.bw} 17px ${ty.body};line-height:1.22">\u201c${T(F.note.text)}\u201d <span data-fs="${ty.sigS-8}" data-min="16" style="font:${ty.sigS-8}px ${ty.sig};color:${C.ink};font-style:normal">${T(F.note.by)}</span></div>
        </div>
        <div data-box style="width:100%;height:auto;min-height:80px;max-height:130px;overflow:hidden;box-sizing:border-box;padding:5px 8px;background:${toHex(mix(hex(P.bg),WHITE,.55))};border:2px solid ${C.ink};outline:1px solid ${C.ink};outline-offset:-6px;transform:rotate(${TN.tilt*.8}deg);text-align:center">
          <div data-fs="16" data-min="14" style="font:${ty.cw} 16px ${ty.caps};letter-spacing:.1em;text-transform:uppercase;color:${C.ink};line-height:1.15">${T(F.prop.title)}</div>
          ${propLines(F.prop).map(l=>`<div data-drop="-1" data-fs="16" data-min="14" style="font:${ty.bw} 16px ${ty.body};line-height:1.2">${T(l)}</div>`).join("")}
        </div>
      </div>
    </div>
    <div style="flex:none;margin-top:6px">${rule(C.ink,300)}</div>
    <div style="flex:1;min-height:0;margin-top:8px;display:flex;gap:28px">
      <div data-box data-col="1" style="flex:1;overflow:hidden">${menuCol(["s","m"],cs,era,ty,C,fam)}</div>
      <div style="width:0;border-left:1px solid ${C.ink};opacity:.6"></div>
      <div data-box data-col="2" style="flex:1;overflow:hidden">${menuCol(["w","d"],cs,era,ty,C,fam)}</div>
    </div>
    <div data-box style="flex:none;height:22px;margin-top:4px;overflow:hidden;text-align:center;white-space:nowrap;font:${ty.bw} 15px ${ty.body};opacity:.85">
      <span data-fs="15" data-min="14">${fam?"No liquor served. ":""}Poster and stills: TMDB. Bill no. ${esc(F.number)}.</span>${F.winks.slice(0,4).map((w,i)=>` <span data-drop data-fs="15" data-min="14">${i?"":"Talk of the town: "}${T(w)}.</span>`).join("")}
    </div>
    </div>
  </div>`;
  return{w:W,h:H,faces:[face]};
};
})();
