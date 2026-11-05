/* Format: galley. A ship or spacecraft galley ration card, two faces 672x1056 on technical grid paper.
   Front: a drawing title block (sign, venue, sheet, deck, form number from the film, year), a deck plan photo panel
   (still over 40 percent of the face, grid overlay, A to E and 1 to 4 coordinates, corner ticks, callout), the logo
   panel, rations 1 and 2 with type-only ration stamps. Back: second still panel (over 25 percent), rations 3 and 4,
   the note from the bridge or wheelhouse with a script signature, a type-only crew tag carrying the film prop, a
   mess call strip with the showtime cue, fine print. Setting (space or sea) is read from theme and flavour: space
   is a dark card priced in credits, sea is a light chart-paper card. Era sets type, paper, frame and photo; tone
   sets wear, tint, stamp angle and copy voice. Inline styles only; the fitter below shrinks boxes after load. */
(function(){
const ID="galley",BODY="'IBM Plex Sans Condensed',sans-serif",A="data-"+ID;
const FONT_URL="https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@700&family=Aldrich&family=Chakra+Petch:wght@600;700&family=Oxanium:wght@600;800&family=IBM+Plex+Sans+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cedarville+Cursive&display=swap";
function loadFonts(){if(document.getElementById("fmt-font-"+ID))return;const l=document.createElement("link");l.id="fmt-font-"+ID;l.rel="stylesheet";l.href=FONT_URL;document.head.appendChild(l)}

/* colour helpers */
const hx=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return h.length!==6||isNaN(n)?null:[n>>16&255,n>>8&255,n&255]};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lumA=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const lum=h=>lumA(hx(h));
const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>{const p=hx(a),q=hx(b);return toHex(p.map((v,i)=>v+(q[i]-v)*t))};
const sat=h=>{const a=hx(h).map(v=>v/255),mx=Math.max(...a),mn=Math.min(...a);return mx===0?0:(mx-mn)/mx};
function pickAccent(c,bg,min,fb){const t=lum(bg)>.4?"#000000":"#ffffff";
  const go=x=>{if(!x||!hx(x)||sat(x)<.22)return null;for(let i=0;i<14&&cr(x,bg)<min;i++)x=mix(x,t,.12);return cr(x,bg)>=min?x:null};
  return go(c)||go(fb)||(lum(bg)>.4?"#1a1a1a":"#f3eee2")}
const rgba=(h,a)=>{const p=hx(h);return `rgba(${p[0]},${p[1]},${p[2]},${a})`};

/* text helpers */
const esc=s=>String(s==null?"":s).replace(/[\u2013\u2014]/g,", ").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
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
[/\bmichelada\b/gi,"chilli lime cooler"],[/\bmargaritas?\b/gi,"lime slushie"],[/\bmartinis?\b/gi,"mocktail"],[/\bcocktails?\b/gi,"mocktail"],[/\bchampagne\b/gi,"sparkling apple"],[/\bprosecco\b/gi,"sparkling grape"],[/\bwine\b/gi,"grape juice"],[/\blagers?\b/gi,"ginger beer"],[/\bbeers?\b/gi,"root beer"],[/\bale\b/gi,"ginger ale"],[/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|brandy|schnapps|liqueur|sake)\b/gi,"soda"],[/\bpunch\b/gi,"punch"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
const dry=(s,fam)=>fam?DRY.reduce((t,[r,v])=>t.replace(r,v),String(s||"")):String(s||"");
const noise=(freq,alpha,col,oct)=>{const c=hx(col||"#ffffff");const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct||3}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${(c[0]/255).toFixed(3)} 0 0 0 0 ${(c[1]/255).toFixed(3)} 0 0 0 0 ${(c[2]/255).toFixed(3)} 0 0 0 ${alpha} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g,"%27")}')`};

/* eras and tones */
const ERA_G={"1930s-40s":0,"1950s":0,"1960s":1,"1970s":1,"1980s":2,"1990s":2,"2000s":3,"modern":3};
const G=[
 {key:"stencil",disp:"'Stardos Stencil',serif",dw:700,track:".06em",sea:"#e6dcc2",space:"#1c2128",inkL:"#1f2a33",inkD:"#e9e2cf",acc:"#a8321f",grid:.10,photo:"grayscale(1) sepia(.35) contrast(1.08)",print:"Letterpress, ship's printer",frame:"double"},
 {key:"offset",disp:"'Aldrich',sans-serif",dw:400,track:".08em",sea:"#efe5cc",space:"#15181b",inkL:"#2b2620",inkD:"#e8e2d4",acc:"#d9822b",grid:.13,photo:"sepia(.25) saturate(.85) contrast(1.02) brightness(1.03)",print:"Offset, issue 2",frame:"brackets"},
 {key:"dotmatrix",disp:"'Chakra Petch',sans-serif",dw:700,track:".04em",sea:"#e4e9eb",space:"#0b1317",inkL:"#18242b",inkD:"#d9eef0",acc:"#2a8fb0",grid:.16,photo:"contrast(1.06) saturate(.9) brightness(1.02)",print:"Printed by the ship's system",frame:"dashed"},
 {key:"laser",disp:"'Oxanium',sans-serif",dw:800,track:".03em",sea:"#f2f4f5",space:"#090d13",inkL:"#11161c",inkD:"#eef3f7",acc:"#f0a020",grid:.12,photo:"contrast(1.1) saturate(1.08)",print:"Laser issue, fleet standard",frame:"notch"}];
const TONE={
 gritty:{wear:.8,photo:"contrast(1.2) saturate(.72)",vig:.6,rot:-6,tint:"rgba(120,90,50,.10)",voice:["Eat what's issued","No complaints to the cook"]},
 glossy:{wear:0,photo:"saturate(1.15) contrast(1.06)",vig:.2,rot:-4,gloss:1,voice:["Served on the observation deck","Compliments of the captain"]},
 warm:{wear:.3,photo:"sepia(.14) saturate(1.06)",vig:.35,rot:-5,tint:"rgba(255,160,80,.10)",voice:["All hands to the galley","Hot food, full crew"]},
 eerie:{wear:.5,photo:"saturate(.5) brightness(.9) contrast(1.12)",vig:.75,rot:-3,tint:"rgba(40,130,110,.16)",voice:["Mess call, all crew report","Headcount at every meal"]},
 playful:{wear:.1,photo:"saturate(1.25) brightness(1.05)",vig:.15,rot:-9,voice:["Chow's up, crew","Seconds if the cook likes you"]},
 grand:{wear:.08,photo:"contrast(1.06) saturate(1.05)",vig:.3,rot:-3,gilt:1,voice:["The captain's table","Officers and crew dine together"]},
 tender:{wear:.2,photo:"brightness(1.06) saturate(.88) contrast(.94)",vig:.25,rot:-4,tint:"rgba(255,190,170,.08)",voice:["Save a seat for the night watch","Long way from home, eat well"]},
 tense:{wear:.4,photo:"contrast(1.3) saturate(.68)",vig:.65,rot:-7,tint:"rgba(160,20,20,.08)",voice:["Eat fast, stay at your station","Keep the hatch sealed"]},
 scrappy:{wear:.65,photo:"grayscale(1) contrast(1.6) brightness(1.06)",vig:.35,rot:-11,xerox:1,voice:["Whatever survived the trip","Tins, mostly"]}};
const BASE={"1930s-40s":.30,"1950s":.55,"1960s":1,"1970s":2,"1980s":4,"1990s":6,"2000s":8.5,"modern":12};
const FAMILY=new Set(["kids","fairytale"]);
const SPACE_RX=/\b(space|star|galaxy|galactic|orbit|planet|moon|lunar|mars|station|nostromo|alien|hypersleep|kyln|starship|spaceship|asteroid|warp|droid)/i;
function priceFor(era,year,number,space){const b=BASE[era]||8.5,M={s:1,m:2,w:1,d:.75};
  const yy=(+year||0)%100,num=/^\d{2,4}$/.test(String(number||""))?+number:null;
  return (k,i)=>{let p=b*M[k]*(1+i*.15);
    if(space){p=Math.max(1,Math.round(p*3));if(k==="m"&&i===0&&num&&num<1000)p=num;return p}
    p=b<1?Math.round(p*20)/20:Math.round(p*4)/4;
    if(k==="m"&&i===0&&num){const c=[num/1000,num/100,num/10,num].sort((x,y)=>Math.abs(x-p)-Math.abs(y-p));p=c[0]}
    return p}}
const money=(p,era,space)=>space?p+" cr":p<1&&ERA_G[era]<2?Math.round(p*100)+"c":p.toFixed(2);

/* fitter: shrinks [data-galley-box] (via --k), then clamps and drops notes; [data-galley-text] shrinks one line block */
function over(e){return e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1}
function overH(e){return e.scrollHeight>e.clientHeight+1}
function fitBox(b){b.style.setProperty("--k","1");const notes=[...b.querySelectorAll(`[${A}-note]`)],drops=[...b.querySelectorAll(`[${A}-drop]`)];
  const names=[...b.querySelectorAll(`[${A}-name]`)];names.forEach(n=>{n.style.display="";n.style.webkitLineClamp="";n.style.overflow=""});const rows=[...b.querySelectorAll(`[${A}-rows]`)];rows.forEach(r=>{r.style.display="";r.style.gridTemplateColumns="";r.style.columnGap=""});notes.forEach(n=>{n.style.display="-webkit-box";n.style.webkitLineClamp="2"});drops.forEach(d=>d.style.display="");
  const min=+b.getAttribute(A+"-min")||.68;let k=1;
  while(overH(b)&&k>min){k=Math.round((k-.02)*100)/100;b.style.setProperty("--k",k)}
  if(overH(b)){notes.forEach(n=>n.style.webkitLineClamp="1")}
  for(let i=drops.length-1;i>=0&&overH(b);i--)drops[i].style.display="none";
  if(overH(b)){notes.forEach(n=>n.style.display="none")}
  if(overH(b)){names.forEach(n=>{n.style.display="-webkit-box";n.style.webkitBoxOrient="vertical";n.style.webkitLineClamp="1";n.style.overflow="hidden"})}
  if(overH(b)){rows.forEach(r=>{if(r.children.length>1){r.style.display="grid";r.style.gridTemplateColumns="1fr 1fr";r.style.columnGap="18px"}})}
  while(overH(b)&&k>.5){k=Math.round((k-.02)*100)/100;b.style.setProperty("--k",k)}}
function fitText(e){let s=+e.getAttribute(A+"-text");const lo=+e.getAttribute(A+"-lo")||16;e.style.fontSize=s+"px";while(over(e)&&s>lo){s-=1;e.style.fontSize=s+"px"}}
function logoInit(img){if(img.dataset.seen)return;img.dataset.seen="1";const panel=img.closest(`[${A}-panel]`),fb=panel&&panel.querySelector(`[${A}-fallback]`);
  const fail=()=>{img.style.display="none";if(fb){fb.style.display="flex";fitText(fb.firstElementChild)}};
  const ok=()=>{if(!img.naturalWidth)return fail();try{const c=document.createElement("canvas"),w=c.width=64,h=c.height=Math.max(1,Math.round(64*img.naturalHeight/img.naturalWidth));const g=c.getContext("2d");g.drawImage(img,0,0,w,h);const d=g.getImageData(0,0,w,h).data;let s=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>140){s+=lumA([d[i],d[i+1],d[i+2]]);n++}
    const L=n?s/n:.5;if(panel){panel.style.background=L<.2?panel.getAttribute(A+"-light"):panel.getAttribute(A+"-dark")}}catch(e){}};
  if(img.complete)(img.naturalWidth?ok():fail());else{img.addEventListener("load",ok);img.addEventListener("error",fail)}}
let pend=0;function fitAll(){pend=0;document.querySelectorAll(`[${A}-face]`).forEach(f=>{f.querySelectorAll(`img[${A}-logo]`).forEach(logoInit);f.querySelectorAll(`[${A}-text]`).forEach(fitText);f.querySelectorAll(`[${A}-box]`).forEach(fitBox)});
  /* one item size across both sheets: every dish box on a menu takes the smallest scale any of them needed */
  const groups=new Map();document.querySelectorAll(`[${A}-box]`).forEach(b=>{const root=b.closest(".mcard")||b.closest(`[${A}-face]`).parentElement;if(!groups.has(root))groups.set(root,[]);groups.get(root).push(b)});
  groups.forEach(bs=>{if(bs.length<2)return;const k=Math.min(...bs.map(b=>+b.style.getPropertyValue("--k")||1));bs.forEach(b=>{if((+b.style.getPropertyValue("--k")||1)>k)b.style.setProperty("--k",k)})})}
function soon(){if(!pend){pend=1;requestAnimationFrame(()=>setTimeout(fitAll,30))}}
if(!window["__fit_"+ID]){window["__fit_"+ID]=1;new MutationObserver(m=>{if(m.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches(`[${A}-face]`)||n.querySelector&&n.querySelector(`[${A}-face]`)))))soon()}).observe(document.documentElement,{childList:true,subtree:true});
  if(document.fonts){document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",soon);document.fonts.ready.then(soon)}[400,1200,2200].forEach(t=>setTimeout(soon,t))}

/* the format */
window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  loadFonts();
  const W=672,H=1056,P=28,f=ctx.f||{},menu=ctx.menu||{},era=ERA_G[ctx.era]!=null?ctx.era:"modern",gi=ERA_G[era],g=G[gi],t=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),fl=ctx.flavour||{},yr=f.year||"";
  const space=f.theme==="scifi"||f.theme==="galaxy"||SPACE_RX.test([fl.venue,fl.sign,(fl.winks||[]).join(" "),fl.prop&&fl.prop.title,(fl.prop&&fl.prop.lines||[]).join(" ")].join(" "));
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id])||null;
  const stills=(ctx.stills||[]).filter(Boolean);
  const heroSrc=poster?ctx.img(poster,"w780"):stills[0]?ctx.img(stills[0],"w1280"):"";
  const heroPoster=!!poster;
  const sideSrc=poster&&stills[0]?ctx.img(stills[0],"w1280"):"";
  const s2i=stills.length>1?stills[Math.min(3,stills.length-1)]:null;
  const s2Src=s2i?ctx.img(s2i,"w1280"):stills[0]?ctx.img(stills[0],"w1280"):poster?ctx.img(poster,"w780"):heroSrc;
  const s2Poster=!s2i&&!stills[0]&&!!poster;
  const dark=hx(ctx.palette&&ctx.palette.dark)?ctx.palette.dark:null;
  const paper=space?(dark?mix(g.space,dark,.3):g.space):g.sea;
  const ink=space?g.inkD:g.inkL;
  const acc=pickAccent(ctx.palette&&ctx.palette.accent,paper,4.5,g.acc);
  const sub=mix(ink,paper,.3);
  const gridC=space?mix(paper,acc,.6):mix(paper,"#2d6fa3",.7);
  const venue=fl.venue||(space?"Crew Galley":"Ship's Galley"),sign=fl.sign||(space?"Deck 2, crew quarters":"Below decks, aft");
  const number=fl.number||(String(yr).slice(-2)==="00"?String(yr):String(yr).slice(-2))||"1";/* 2000 reads "2000", never "00" (review 12) */
  const price=priceFor(era,yr,fl.number,space);
  const C={s:["Ration 1","Starters"],m:["Ration 2","Mains"],w:["Ration 3","Sweets"],d:[fam?"Fresh water":"Ration 4","Drinks"]};
  const STAMP={s:"Issued",m:space?"Crew only":"All hands",w:"Rationed",d:"Logged"};
  const items=k=>(menu[k]||[]).slice(0,4).map((x,i)=>({n:dry(x.n,fam),note:dry(x.note,fam),p:price(k,i)}));
  const I={s:items("s"),m:items("m"),w:items("w"),d:items("d")};
  /* the shared price check: mains over starters and sweets, spirits over plain drinks (Solo's 12 cr pork knuckle was the cheapest thing on the card) */
  if(window.priceSense){const P={},M={};for(const k in I){M[k]=I[k];P[k]=I[k].map(x=>money(x.p,era,space))}const Q=window.priceSense(M,P);for(const k in I)I[k].forEach((x,i)=>{x.ps=Q[k][i]})}
  const photoF=`${g.photo} ${t.photo}`;
  const voice=t.voice,winks=(fl.winks||[]).slice(0,5);
  const deck="DECK "+((parseInt(number,10)||2)%9+1);

  /* technical grid paper and wear */
  const grid=`repeating-linear-gradient(0deg,${rgba(gridC,g.grid*2.2)} 0 1px,transparent 1px 120px),repeating-linear-gradient(90deg,${rgba(gridC,g.grid*2.2)} 0 1px,transparent 1px 120px),repeating-linear-gradient(0deg,${rgba(gridC,g.grid)} 0 1px,transparent 1px 24px),repeating-linear-gradient(90deg,${rgba(gridC,g.grid)} 0 1px,transparent 1px 24px)`;
  const tex=[noise(.8,space?.05:.08,space?"#ffffff":"#7a6a50",3),noise(.018,space?.08:.10,space?"#9fb8c8":"#8a7a5a",2),t.wear>.5?noise("0.02 0.35",(t.wear*.13).toFixed(3),space?"#ffffff":"#5a4a30",2):null].filter(Boolean).join(",");
  const vign=`radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,${space?t.vig:t.vig*.55}) 100%)`;
  const xerox=t.xerox?`<div style="position:absolute;inset:0;background:${noise(1.3,.12,"#000000",1)};mix-blend-mode:multiply;pointer-events:none"></div>`:"";
  const faceBg=`background-color:${paper};background-image:${tex},${grid};`;
  const frame=g.frame==="double"?`<div style="position:absolute;inset:12px;border:3px double ${rgba(ink,.75)};pointer-events:none"></div>`
    :g.frame==="brackets"?[["left","top"],["right","top"],["left","bottom"],["right","bottom"]].map(([x,y])=>`<div style="position:absolute;${x}:12px;${y}:12px;width:46px;height:46px;border-${x}:6px solid ${acc};border-${y}:6px solid ${acc};pointer-events:none"></div>`).join("")
    :g.frame==="dashed"?`<div style="position:absolute;inset:12px;border:2px dashed ${rgba(ink,.45)};pointer-events:none"></div>`
    :`<div style="position:absolute;inset:14px;border:1px solid ${rgba(ink,.55)};clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);pointer-events:none"></div>`;
  const gilt=t.gilt?`<div style="position:absolute;inset:5px;border:2px solid ${acc};pointer-events:none"></div>`:"";
  const over_=`<div style="position:absolute;inset:0;background:${vign};pointer-events:none"></div>${xerox}`;

  /* deck plan photo panel: grid overlay, coordinates, corner ticks, callout */
  const panel=(src,isPoster,x,y,w,h,callout,pos)=>{
    const tint=!isPoster&&t.tint?`<div style="position:absolute;inset:0;background:${t.tint};mix-blend-mode:multiply"></div>`:"";
    const gloss=!isPoster&&t.gloss?`<div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,0) 40%)"></div>`:"";
    const img=!src?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:${mix(paper,acc,.25)}"><div style="font:${g.dw} 44px/1 ${g.disp};color:${ink};text-align:center;padding:0 30px;text-transform:uppercase">${esc(venue)}</div></div>`
      :isPoster?`<div style="position:absolute;inset:0;background:${mix(paper,"#000000",.4)}"></div><img crossorigin="anonymous" alt="${esc((f.title||"")+" poster")}" src="${src}" style="position:absolute;left:50%;top:0;height:100%;width:auto;transform:translateX(-50%)">`
      :`<img crossorigin="anonymous" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 40%"};filter:${photoF}">`;
    const ov=isPoster?"":`<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,${rgba("#ffffff",.13)} 0 1px,transparent 1px ${Math.round(h/4)}px),repeating-linear-gradient(90deg,${rgba("#ffffff",.13)} 0 1px,transparent 1px ${Math.round(w/5)}px)"></div>`;
    const cols="ABCDE".split("").map((c,i)=>`<div style="position:absolute;top:-22px;left:${Math.round(w/5*i+w/10)-6}px;font:600 14px/1 ${BODY};color:${sub}">${c}</div>`).join("");
    const rows=[1,2,3,4].map((r,i)=>`<div style="position:absolute;left:-18px;top:${Math.round(h/4*i+h/8)-7}px;font:600 14px/1 ${BODY};color:${sub}">${r}</div>`).join("");
    const ticks=[["left","top"],["right","top"],["left","bottom"],["right","bottom"]].map(([a,b])=>`<div style="position:absolute;${a}:-8px;${b}:-8px;width:22px;height:22px;border-${a}:2px solid ${acc};border-${b}:2px solid ${acc}"></div>`).join("");
    const co=callout?`<div style="position:absolute;right:16px;top:16px;padding:5px 10px;background:${rgba(space?"#000000":"#ffffff",.72)};border:1px solid ${acc};color:${space?"#ffffff":"#111111"};font:600 15px/1.2 ${BODY};letter-spacing:.14em;text-transform:uppercase;max-width:${w-60}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(callout)}</div>`:"";
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px">${cols}${rows}${ticks}
      <div style="position:absolute;inset:0;overflow:hidden;background:#000;outline:1px solid ${rgba(ink,.6)}">${img}${tint}${gloss}${ov}${co}</div></div>`};

  /* ration stamp, type only */
  const stamp=(txt,rot)=>`<div style="flex:none;transform:rotate(${rot}deg);padding:3px 10px;border:3px double ${acc};color:${acc};font:${g.dw} 16px/1.1 ${g.disp};letter-spacing:.12em;text-transform:uppercase;opacity:.88;text-align:center">${esc(txt)}<div style="font:600 14px/1.1 ${BODY};letter-spacing:.1em">DAY ${esc(String(number).slice(-3))}</div></div>`;
  const label=(k,i)=>`<div style="display:flex;align-items:center;gap:12px;margin:0 0 calc(8px*var(--k))">
      <div style="flex:1;min-width:0;display:flex;align-items:baseline;gap:10px;border-bottom:2px solid ${ink};padding-bottom:4px">
        <span style="font:${g.dw} max(18px,calc(30px*var(--k)))/1 ${g.disp};letter-spacing:${g.track};text-transform:uppercase;color:${ink}">${esc(C[k][0])}</span>
        <span style="font:600 max(14px,calc(17px*var(--k)))/1 ${BODY};letter-spacing:.2em;text-transform:uppercase;color:${acc}">${esc(C[k][1])}</span></div>
      ${stamp(STAMP[k],t.rot+(i%2?5:0))}</div>`;
  const row=(it,i)=>`<div style="display:flex;gap:12px;margin:0 0 calc(10px*var(--k))">
      <div style="flex:none;width:34px;font:600 max(14px,calc(16px*var(--k)))/1.7 ${BODY};color:${sub}">${String.fromCharCode(65+i)}${i+1}</div>
      <div style="flex:1;min-width:0"><div style="display:flex;align-items:baseline;gap:10px">
        <span ${A}-name style="flex:1;font:700 max(16px,calc(26px*var(--k)))/1.12 ${BODY};color:${ink}">${esc(it.n)}</span>
        <span style="font:${g.dw} max(16px,calc(25px*var(--k)))/1.1 ${g.disp};color:${acc};white-space:nowrap">${it.ps||money(it.p,era,space)}</span></div>
      ${it.note?`<div ${A}-note style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;margin-top:2px;font:400 max(14px,calc(20px*var(--k)))/1.26 ${BODY};color:${sub}">${esc(it.note)}</div>`:""}</div></div>`;
  let ci=0;const course=k=>I[k].length?`<div style="margin:0 0 calc(12px*var(--k))">${label(k,ci++)}<div ${A}-rows>${I[k].map(row).join("")}</div></div>`:"";

  /* title block and logo */
  const lp="#f4f2ec",dp=mix(space?paper:"#1b232a","#000000",.3);
  const titleType=`<div ${A}-text="40" ${A}-lo="18" style="width:100%;max-height:84px;overflow:hidden;text-align:center;font:${g.dw} 40px/1.04 ${g.disp};letter-spacing:${g.track};color:${lp};text-transform:uppercase">${esc(f.title||venue)}</div>`;
  const logoPanel=`<div ${A}-panel ${A}-light="${lp}" ${A}-dark="${dp}" style="position:absolute;left:${heroPoster?P+20+296:P+60}px;top:${heroPoster?(sideSrc?534:424):598}px;width:${heroPoster?W-2*P-20-296:W-2*P-120}px;height:100px;box-sizing:border-box;padding:12px 18px;background:${dp};display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.4);border:1px solid ${acc};${t.gilt?`outline:2px solid ${acc};outline-offset:3px;`:""}">
    ${ctx.logo?`<img ${A}-logo crossorigin="anonymous" src="${ctx.img(ctx.logo[0],"w500")}" style="max-width:100%;max-height:74px;object-fit:contain"><div ${A}-fallback style="display:none;position:absolute;inset:0;padding:8px 16px;align-items:center;justify-content:center;background:${dp}">${titleType}</div>`
      :`<div style="position:absolute;inset:0;padding:8px 16px;display:flex;align-items:center;justify-content:center;background:${dp}">${titleType}</div>`}</div>`;
  const cell=(lab,val,w,extra)=>`<div style="${w?`width:${w}px;flex:none;`:"flex:1;min-width:0;"}box-sizing:border-box;padding:6px 10px;border-left:1px solid ${rgba(ink,.5)};${extra||""}"><div style="font:600 14px/1.1 ${BODY};letter-spacing:.16em;text-transform:uppercase;color:${sub}">${esc(lab)}</div><div style="margin-top:3px;font:${g.dw} 19px/1.1 ${g.disp};color:${ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(val)}</div></div>`;
  const titleBlock=`<div style="position:absolute;left:${P}px;right:${P}px;top:30px;height:148px;border:2px solid ${ink};box-sizing:border-box;display:flex;flex-direction:column">
      <div style="flex:1;padding:8px 14px 4px;min-height:0">
        <div ${A}-text="16" ${A}-lo="14" style="height:22px;overflow:hidden;white-space:nowrap;font:600 16px/22px ${BODY};letter-spacing:.22em;text-transform:uppercase;color:${acc}">${esc(sign)}</div>
        <div ${A}-text="46" ${A}-lo="20" style="height:62px;overflow:hidden;display:flex;align-items:center;font:${g.dw} 46px/1 ${g.disp};letter-spacing:${g.track};text-transform:uppercase;color:${ink}">${esc(venue)}</div></div>
      <div style="display:flex;border-top:2px solid ${ink};height:52px">${cell("Sheet","1 of 2",96,"border-left:0")}${cell("Plan",deck+" / Galley")}${cell("Form","G-"+String(number).slice(-4),120)}${cell("Year",String(yr),90)}</div></div>`;

  /* poster layout: poster 420x630 on the left, title block and logo stacked in a right column */
  const PX=P+20,PY=52,PW=420,PH=630,CX=PX+PW+16,CW=W-P-CX;
  const sideCell=(lab,val)=>`<div style="height:47px;box-sizing:border-box;padding:4px 10px;border-top:1px solid ${rgba(ink,.5)}"><div style="font:600 14px/1.1 ${BODY};letter-spacing:.16em;text-transform:uppercase;color:${sub}">${esc(lab)}</div><div style="margin-top:3px;font:${g.dw} 19px/1.1 ${g.disp};color:${ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(val)}</div></div>`;
  const sideTitle=`<div style="position:absolute;left:${CX}px;top:${PY}px;width:${CW}px;height:440px;border:2px solid ${ink};box-sizing:border-box;display:flex;flex-direction:column">
      <div style="flex:1;min-height:0;padding:10px 12px 6px;display:flex;flex-direction:column">
        <div ${A}-text="15" ${A}-lo="14" style="height:76px;flex:none;overflow:hidden;font:600 15px/1.25 ${BODY};letter-spacing:.14em;text-transform:uppercase;color:${acc}">${esc(sign)}</div>
        <div ${A}-text="36" ${A}-lo="12" style="flex:1;min-height:0;overflow:hidden;display:flex;align-items:center;font:${g.dw} 36px/1.05 ${g.disp};letter-spacing:${g.track};text-transform:uppercase;color:${ink}">${esc(venue)}</div></div>
      ${sideCell("Sheet","1 of 2")}${sideCell("Plan",deck)}${sideCell("Form","G-"+String(number).slice(-4))}${sideCell("Year",String(yr))}</div>`;
  const sideLogo=`<div ${A}-panel ${A}-light="${lp}" ${A}-dark="${dp}" style="position:absolute;left:${CX}px;top:${PY+440+16}px;width:${CW}px;height:120px;box-sizing:border-box;padding:10px 12px;background:${dp};display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.4);border:1px solid ${acc};${t.gilt?`outline:2px solid ${acc};outline-offset:3px;`:""}">
    ${ctx.logo?`<img ${A}-logo crossorigin="anonymous" src="${ctx.img(ctx.logo[0],"w500")}" style="max-width:100%;max-height:96px;object-fit:contain"><div ${A}-fallback style="display:none;position:absolute;inset:0;padding:8px 10px;align-items:center;justify-content:center;background:${dp}">${titleType}</div>`
      :`<div style="position:absolute;inset:0;padding:8px 10px;display:flex;align-items:center;justify-content:center;background:${dp}">${titleType}</div>`}</div>`;
  const sideNow=`<div style="position:absolute;left:${CX}px;top:${PY+440+16+120+14}px;width:${CW}px;font:600 15px/1.25 ${BODY};letter-spacing:.14em;text-transform:uppercase;color:${acc}">Now showing, ${esc(String(yr))}</div>`;

  /* front */
  const f0=`<div ${A}-face style="position:absolute;inset:0;${faceBg}overflow:hidden;font-family:${BODY}">
    ${frame}${gilt}${heroPoster?sideTitle:titleBlock}
    ${heroPoster?panel(heroSrc,true,PX,PY,PW,PH,""):panel(heroSrc,false,P+20,214,W-2*P-20,420,deck+", galley")}
    ${heroPoster?sideNow+sideLogo:logoPanel}
    <div ${A}-box style="position:absolute;left:${P+6}px;top:716px;width:${W-2*P-12}px;height:278px;overflow:hidden;--k:1;display:flex;flex-direction:column;justify-content:safe center">${course("s")}${course("m")}</div>
    <div style="position:absolute;left:${P+6}px;right:${P+6}px;top:1004px;padding-top:6px;border-top:1px solid ${rgba(ink,.5)};display:flex;justify-content:space-between;color:${sub};font:600 15px/1.2 ${BODY};letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;overflow:hidden"><span>${esc(voice[0])}</span><span>Turn over</span></div>
    ${over_}</div>`;

  /* back */
  const note=fl.note&&fl.note.text?fl.note:{text:f.T||voice[1],by:fl.note&&fl.note.by||(space?"The quartermaster":"Cook")};
  const prop=fl.prop&&fl.prop.title?fl.prop:{kind:"tag",title:space?"Crew tag":"Mess tag",lines:[space?"Galley access":"Galley duty",deck]};
  const cue=f.P||"";
  const tagBg=space?mix(paper,"#ffffff",.88):"#fbf9f2",tagInk="#1a1d21",tagAcc=pickAccent(acc,tagBg,4.5,g.acc);
  const tag=`<div style="position:absolute;left:404px;top:668px;width:212px;height:196px;box-sizing:border-box;padding:16px 16px 12px 16px;background-color:${tagBg};background-image:${noise(.8,.07,"#6a6050",2)};clip-path:polygon(22px 0,100% 0,100% 100%,0 100%,0 22px);box-shadow:0 5px 14px rgba(0,0,0,.4);transform:rotate(${(t.rot/3).toFixed(1)}deg)">
     <div style="position:absolute;right:14px;top:12px;width:16px;height:16px;border-radius:50%;box-shadow:inset 0 2px 4px rgba(0,0,0,.5);background:${paper}"></div>
     <div ${A}-box ${A}-min=".8" style="width:100%;height:100%;overflow:hidden;--k:1;color:${tagInk}">
       <div style="font:600 max(14px,calc(14px*var(--k))) ${BODY};letter-spacing:.2em;text-transform:uppercase;color:${tagAcc}">${esc(prop.kind||"tag")}</div>
       <div style="margin:4px 0 6px;font:${g.dw} max(18px,calc(26px*var(--k)))/1.02 ${g.disp};text-transform:uppercase;letter-spacing:${g.track}">${esc(prop.title)}</div>
       ${(prop.lines||[]).slice(0,3).map(l=>`<div ${A}-drop style="font:600 max(14px,calc(16px*var(--k)))/1.25 ${BODY};border-top:1px dashed ${rgba(tagInk,.35)};padding-top:3px;margin-top:3px">${esc(l)}</div>`).join("")}</div></div>`;
  const f1=`<div ${A}-face style="position:absolute;inset:0;${faceBg}overflow:hidden;font-family:${BODY}">
    ${frame}${gilt}
    ${panel(s2Src,s2Poster,P+20,52,W-2*P-20,284,space?"Crew quarters":"Ship's mess","center 32%")}
    <div ${A}-box style="position:absolute;left:${P+6}px;top:356px;width:${W-2*P-12}px;height:294px;overflow:hidden;--k:1;display:flex;flex-direction:column;justify-content:safe center">${course("w")}${course("d")}</div>
    <div ${A}-box ${A}-min=".8" style="position:absolute;left:${P+6}px;top:664px;width:350px;height:204px;overflow:hidden;--k:1;color:${ink}">
      <div style="font:600 max(14px,calc(16px*var(--k))) ${BODY};letter-spacing:.2em;text-transform:uppercase;color:${acc};margin-bottom:6px">${space?"From the bridge":"From the wheelhouse"}</div>
      <div style="font:italic 400 max(15px,calc(21px*var(--k)))/1.3 ${BODY}">"${esc(note.text)}"</div>
      <div style="margin-top:4px;padding-right:8px;text-align:right;font:400 max(22px,calc(32px*var(--k)))/1.15 'Cedarville Cursive',cursive;color:${acc}">${esc(note.by)}</div></div>
    ${tag}
    <div style="position:absolute;left:${P+6}px;right:${P+6}px;top:882px;height:66px;box-sizing:border-box;padding:6px 12px;border:2px solid ${acc};display:flex;gap:14px;align-items:center">
      <div style="flex:none;font:${g.dw} 22px/1 ${g.disp};color:${acc};letter-spacing:${g.track};text-transform:uppercase">Mess call</div>
      <div ${A}-box ${A}-min=".9" style="flex:1;min-width:0;height:50px;overflow:hidden;--k:1;display:flex;align-items:center;font:500 max(14px,calc(17px*var(--k)))/1.25 ${BODY};color:${ink}"><span>${esc(cue||voice[1])}</span></div></div>
    <div ${A}-box ${A}-min=".92" style="position:absolute;left:${P+6}px;right:${P+6}px;top:958px;height:70px;overflow:hidden;--k:1;color:${sub};font:400 max(14px,calc(15px*var(--k)))/1.3 ${BODY}">
      <span>${esc(voice[1])}. Prices subject to change${space?", paid in ship's credit":""}. ${esc(g.print)}. Form G-${esc(String(number).slice(-4))}, sheet 2 of 2. ${esc(yr)}.${fam?" All drinks alcohol free.":""} </span>${winks.length?`<span ${A}-drop>Crew notes: ${esc(winks.slice(0,3).join(". "))}.</span>`:""}</div>
    ${over_}</div>`;
  return {w:W,h:H,faces:[f0,f1]};
};
})();
