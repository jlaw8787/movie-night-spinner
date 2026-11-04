/* Format: bartab. A dive bar menu and running tab, two slim faces 528x1056.
   Front: the bar's sign, a full-width still (over 40 percent), the film logo on a panel, bar snacks and plates,
   carried over subtotal. Back: second still (over 25 percent), brought forward, afters and drinks, the running tab
   total, the barkeep's note with a script signature, a type-only coaster carrying the film prop, fine print.
   Era sets board, type pairing, print process and photo treatment; tone sets wear, contrast, tint and copy voice.
   Inline styles only. A small fitter (below) shrinks text boxes after fonts and images load. */
(function(){
const ID="bartab",A="data-"+ID;
const FONT_URL="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@800&family=Coustard:wght@400;900&family=Cabin+Condensed:wght@600;700&family=Krona+One&family=Barlow:ital,wght@0,500;0,600;0,700;1,500&family=Caveat+Brush&display=swap";
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
 {key:"letterpress",disp:"'Abhaya Libre',serif",dw:800,ds:"normal",dtrack:".02em",body:"'Barlow',sans-serif",board:"#191510",ink:"#efe3c8",acc:"#c9a24a",photo:"grayscale(1) sepia(.4) contrast(1.08)",print:"Letterpress on black cover stock"},
 {key:"offset",disp:"'Coustard',serif",dw:900,ds:"normal",dtrack:"0",body:"'Barlow',sans-serif",board:"#2b1711",ink:"#f7e2bf",acc:"#e2832f",photo:"sepia(.32) saturate(.85) contrast(.95) brightness(1.04)",print:"Offset on board"},
 {key:"chalk",disp:"'Cabin Condensed',sans-serif",dw:700,ds:"italic",dtrack:".01em",body:"'Barlow',sans-serif",board:"#1c2420",ink:"#f1f0e8",acc:"#f2c94c",photo:"contrast(1.05) saturate(.95)",print:"Chalked fresh daily"},
 {key:"laser",disp:"'Krona One',sans-serif",dw:400,ds:"normal",dtrack:"-.01em",body:"'Barlow',sans-serif",board:"#0e0e10",ink:"#f5f4f1",acc:"#ff5a3c",photo:"contrast(1.1) saturate(1.06)",print:"Laser printed in house"}];
const TONE={
 gritty:{wear:.85,photo:"contrast(1.2) saturate(.72)",vig:.75,rot:-1.5,tint:"rgba(120,90,50,.10)",voice:["Cash or tab. No exceptions.","Settle up before you leave"]},
 glossy:{wear:0,photo:"saturate(1.15) contrast(1.06)",vig:.25,rot:0,gloss:1,voice:["Members and their guests","Your tab, kept by the house"]},
 warm:{wear:.3,photo:"sepia(.14) saturate(1.06)",vig:.45,rot:-2,tint:"rgba(255,160,80,.10)",voice:["Pull up a stool, stay a while","Your tab is safe with us"]},
 eerie:{wear:.55,photo:"saturate(.5) brightness(.9) contrast(1.1)",vig:.85,rot:3,tint:"rgba(40,130,110,.16)",voice:["Last orders were hours ago","Nobody remembers opening this tab"]},
 playful:{wear:.12,photo:"saturate(1.25) brightness(1.05)",vig:.2,rot:-5,voice:["Ring the bell, shout the room","Tab runs till the credits"]},
 grand:{wear:.08,photo:"contrast(1.06) saturate(1.05)",vig:.35,rot:0,gilt:1,voice:["The long bar","Kept in the house ledger"]},
 tender:{wear:.2,photo:"brightness(1.06) saturate(.88) contrast(.94)",vig:.3,rot:-2,tint:"rgba(255,190,170,.08)",voice:["For the regulars","On the house, almost"]},
 tense:{wear:.4,photo:"contrast(1.32) saturate(.68)",vig:.75,rot:1,tint:"rgba(160,20,20,.08)",voice:["Keep your back to the wall","Pay before the lights go out"]},
 scrappy:{wear:.7,photo:"grayscale(1) contrast(1.6) brightness(1.06)",vig:.45,rot:4,xerox:1,voice:["Tab's chalked on the wall","Whatever's left in the kitchen"]}};
const BASE={"1930s-40s":.35,"1950s":.6,"1960s":1.1,"1970s":2.25,"1980s":4.5,"1990s":6.5,"2000s":9,"modern":14};
const FAMILY=new Set(["kids","fairytale"]);

function priceFor(era,year,number){const b=BASE[era]||9,M={s:1,m:1.9,w:1.05,d:.8};
  const yy=(+year||0)%100,num=/^\d{2,3}$/.test(String(number||""))?+number:null;
  return (k,i)=>{let p=b*M[k]*(1+i*.14);p=b<1?Math.round(p*20)/20:Math.round(p*4)/4;
    /* the film number only sets the cents, on the period price */
    if(k==="m"&&i===0&&num&&p>=1)p=Math.floor(p)+(num%100)/100;
    return p}}
const money=(p,era)=>p<1&&(era==="1930s-40s"||era==="1950s"||era==="1960s")?Math.round(p*100)+"c":p.toFixed(2);

/* fitter: shrinks [data-bartab-box] (via --k), then clamps and drops notes; [data-bartab-text] shrinks one line block */
function over(e){return e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1}
function fitBox(b){b.style.setProperty("--k","1");const notes=[...b.querySelectorAll(`[${A}-note]`)],drops=[...b.querySelectorAll(`[${A}-drop]`)];
  notes.forEach(n=>{n.style.display="-webkit-box";n.style.webkitLineClamp="2"});drops.forEach(d=>d.style.display="");
  const min=+b.getAttribute(A+"-min")||.68;let k=1;
  while(over(b)&&k>min){k=Math.round((k-.02)*100)/100;b.style.setProperty("--k",k)}
  if(over(b)){notes.forEach(n=>n.style.webkitLineClamp="1")}
  for(let i=drops.length-1;i>=0&&over(b);i--)drops[i].style.display="none";
  /* notes go one at a time from the bottom, house lines first, not all at once (Beerfest, Blade) */
  const order=notes.filter(n=>n.getAttribute(A+"-note")==="h").reverse().concat(notes.filter(n=>n.getAttribute(A+"-note")!=="h").reverse());
  for(const n of order){if(!over(b))break;n.style.display="none"}
  while(over(b)&&k>.5){k=Math.round((k-.02)*100)/100;b.style.setProperty("--k",k)}}
function fitText(e){let s=+e.getAttribute(A+"-text");const lo=+e.getAttribute(A+"-lo")||16;e.style.fontSize=s+"px";while(over(e)&&s>lo){s-=1;e.style.fontSize=s+"px"}}
function logoInit(img){if(img.dataset.seen)return;img.dataset.seen="1";const panel=img.closest(`[${A}-panel]`),fb=panel&&panel.querySelector(`[${A}-fallback]`);
  const fail=()=>{img.style.display="none";if(fb){fb.style.display="flex";fitText(fb.firstElementChild)}};
  const ok=()=>{if(!img.naturalWidth)return fail();try{const c=document.createElement("canvas"),w=c.width=64,h=c.height=Math.max(1,Math.round(64*img.naturalHeight/img.naturalWidth));const g=c.getContext("2d");g.drawImage(img,0,0,w,h);const d=g.getImageData(0,0,w,h).data;let s=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>140){s+=lumA([d[i],d[i+1],d[i+2]]);n++}
    const L=n?s/n:.5;if(panel){panel.style.background=L<.2?panel.getAttribute(A+"-light"):panel.getAttribute(A+"-dark")}}catch(e){}};
  if(img.complete)(img.naturalWidth?ok():fail());else{img.addEventListener("load",ok);img.addEventListener("error",fail)}}
let pend=0;function fitAll(){pend=0;document.querySelectorAll(`[${A}-face]`).forEach(f=>{f.querySelectorAll(`img[${A}-logo]`).forEach(logoInit);f.querySelectorAll(`[${A}-text]`).forEach(fitText);f.querySelectorAll(`[${A}-box]`).forEach(fitBox)})}
function soon(){if(!pend){pend=1;requestAnimationFrame(()=>setTimeout(fitAll,30))}}
if(!window["__fit_"+ID]){window["__fit_"+ID]=1;new MutationObserver(m=>{if(m.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches(`[${A}-face]`)||n.querySelector&&n.querySelector(`[${A}-face]`))))){fitAll();soon()}}).observe(document.documentElement,{childList:true,subtree:true});
  if(document.fonts){document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",soon);document.fonts.ready.then(soon)}[400,1200,2200].forEach(t=>setTimeout(soon,t))}

/* the format */
window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  loadFonts();
  const W=528,H=1056,P=26,f=ctx.f||{},menu=ctx.menu||{},era=ERA_G[ctx.era]!=null?ctx.era:"modern",g=G[ERA_G[era]],t=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),fl=ctx.flavour||{},yr=f.year||"";
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id])||null;
  const stills=(ctx.stills||[]).filter(Boolean);
  const heroSrc=poster?ctx.img(poster,"w780"):stills[0]?ctx.img(stills[0],"w1280"):"";
  const heroPoster=!!poster;
  const s2i=stills.length>1?stills[Math.min(3,stills.length-1)]:null;
  const s2Src=s2i?ctx.img(s2i,"w1280"):stills[0]?ctx.img(stills[0],"w1280"):poster?ctx.img(poster,"w780"):heroSrc;
  const s2Poster=!s2i&&!stills[0]&&!!poster;
  const dark=hx(ctx.palette&&ctx.palette.dark)?ctx.palette.dark:null;
  const board=dark?mix(g.board,dark,.38):g.board;
  const ink=g.ink;
  const acc=pickAccent(ctx.palette&&ctx.palette.accent,board,4.5,g.acc);
  const sub=mix(ink,board,.28);
  const venue=fl.venue||"The Back Bar",sign=fl.sign||"Open till the credits roll";
  const voice=t.voice;
  const number=fl.number||String(yr).slice(-2)||"00";
  const price=priceFor(era,yr,fl.number);
  const C={s:"Bar snacks",m:"Plates",w:"Afters",d:fam?"From the fountain":"Behind the bar"};
  /* prices that make sense on their own card: every main above every starter and sweet, and a drink with spirits above a plain beer or soft drink */
  const PR={},rnd=v=>v<1?Math.round(v*20)/20:Math.round(v*4)/4,SPIRIT=/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|mezcal|brandy|cognac|cocktail|martini|boilermaker|negroni|margarita|spritz|old fashioned|manhattan|sour|daiquiri|mojito|julep|highball|shots?|liqueur|schnapps|vodka)\b/i;for(const k of ["s","m","w","d"])PR[k]=(menu[k]||[]).slice(0,4).map((x,i)=>price(k,i));
  {const sw=Math.max(0,...PR.s,...PR.w);PR.m=PR.m.map(v=>v>sw?v:rnd(sw*1.3+(v%1)*.1));
   const ds=(menu.d||[]).slice(0,4),plain=Math.max(0,...ds.map((x,i)=>SPIRIT.test(x.n+" "+(x.note||""))?0:PR.d[i]));PR.d=PR.d.map((v,i)=>SPIRIT.test(ds[i].n+" "+(ds[i].note||""))&&v<=plain?rnd(plain*1.3):v)}
  /* every price lands on a price ending before the tab adds up, so the totals stay true (the film number on the first main only when it reads like a price) */
  if(window.priceEnd)for(const k of ["s","m","w","d"])PR[k]=PR[k].map(v=>window.priceEnd(v));
  const items=k=>(menu[k]||[]).slice(0,4).map((x,i)=>({n:dry(x.n,fam),note:dry(x.note,fam),p:PR[k][i],house:!!x.house}));
  const I={s:items("s"),m:items("m"),w:items("w"),d:items("d")};
  /* the photo gives way to the dishes: estimate the height the front's names and notes need at a slightly shrunk size,
     and take it off the poster or still first, so names, prices and the film's own notes still show (Blade, An American Werewolf) */
  const needFront=(()=>{let h=0;for(const k of ["s","m"]){if(!I[k].length)continue;h+=48;for(const it of I[k])h+=41+(it.note?Math.min(2,Math.ceil(it.note.length/50))*26:0)}return Math.round(h*.84)})();
  const PH=Math.max(330,Math.min(558,770-needFront)),PW=Math.round(PH*2/3);
  const SH=Math.max(250,Math.min(440,440-(needFront-290))),shift=440-SH;
  const LT=heroPoster?110+PH+10:556-shift,BT=heroPoster?LT+82:676-shift,BH=heroPoster?970-BT:966-BT;
  const sum=a=>a.reduce((x,y)=>x+y.p,0);
  const front=sum(I.s)+sum(I.m),total=front+sum(I.w)+sum(I.d);
  const photoF=`${g.photo} ${t.photo}`;
  const glow=g.key==="letterpress"?`text-shadow:0 0 .7px ${ink};`:g.key==="chalk"?`text-shadow:0 0 1.5px ${rgba(ink,.55)};`:"";

  /* board texture per print process and wear per tone */
  const tex=[
    g.key==="chalk"?`${noise(.9,.10,"#ffffff",2)},${noise(.012,.18,"#ffffff",2)}`:g.key==="letterpress"?`${noise(.75,.07,"#e8dcc0",3)}`:g.key==="offset"?`${noise(.6,.06,"#ffd9a0",3)}`:`${noise(.9,.035,"#ffffff",2)}`,
    t.wear>.5?noise("0.015 0.35",(t.wear*.16).toFixed(3),"#ffffff",2):null].filter(Boolean).join(",");
  const vign=`radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 52%,rgba(0,0,0,${t.vig}) 100%)`;
  const border=g.key==="letterpress"?`<div style="position:absolute;inset:12px;border:3px double ${rgba(ink,.8)};pointer-events:none"></div>`
    :g.key==="offset"?`<div style="position:absolute;left:0;right:0;top:0;height:14px;background:${acc}"></div><div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:${acc}"></div>`
    :g.key==="chalk"?`<div style="position:absolute;inset:0;box-shadow:inset 0 0 0 10px #3a2a1c,inset 0 0 0 12px rgba(0,0,0,.5),inset 0 0 24px 14px rgba(0,0,0,.45);pointer-events:none"></div>`
    :`<div style="position:absolute;inset:16px;border:1px solid ${rgba(acc,.85)};pointer-events:none"></div>`;
  const gilt=t.gilt?`<div style="position:absolute;inset:6px;border:2px solid ${acc};box-shadow:inset 0 0 0 4px ${board},inset 0 0 0 5px ${acc};pointer-events:none"></div>`:"";
  const wearLayer=`<div style="position:absolute;inset:0;background:${vign};pointer-events:none"></div>`+(t.xerox?`<div style="position:absolute;inset:0;background:${noise(1.4,.14,"#000000",1)};mix-blend-mode:multiply;pointer-events:none"></div>`:"");
  const faceBg=`background-color:${board};background-image:${tex};`;

  const photo=(src,isPoster,h,pos)=>{
    if(!src)return `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:${mix(board,acc,.25)}"><div style="font:${g.dw} 40px/1.05 ${g.disp};color:${ink};text-align:center;padding:0 30px;text-transform:uppercase">${esc(venue)}</div></div>`;
    if(isPoster)return `<div style="position:absolute;inset:0;background:${mix(board,"#000000",.42)}"></div><img crossorigin="anonymous" alt="${esc((f.title||"")+" poster")}" src="${src}" style="position:absolute;left:50%;top:${h>400?8:Math.round(h*.03)}px;height:${h>400?h-44:Math.round(h*.94)}px;width:auto;transform:translateX(-50%);box-shadow:0 0 0 2px ${rgba(acc,.85)},0 6px 18px rgba(0,0,0,.6)">`;
    const tint=t.tint?`<div style="position:absolute;inset:0;background:${t.tint};mix-blend-mode:multiply"></div>`:"";
    const gloss=t.gloss?`<div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,0) 38%)"></div>`:"";
    const half=g.key==="offset"?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.18) 30%,transparent 32%) 0 0/4px 4px;mix-blend-mode:multiply;opacity:.6"></div>`:"";
    const inner=isPoster?`<div style="position:absolute;inset:-30px;background:url('${src}') center/cover;filter:blur(20px) brightness(.5)"></div><img src="${src}" style="position:absolute;left:50%;top:0;height:100%;transform:translateX(-50%);filter:${photoF};box-shadow:0 0 30px rgba(0,0,0,.6)">`
      :`<img crossorigin="anonymous" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 38%"};filter:${photoF}">`;
    return inner+half+tint+gloss};

  const label=(txt)=>{
    const L=esc(txt);
    if(g.key==="letterpress")return `<div style="display:flex;align-items:center;gap:12px;margin:0 0 8px;color:${acc};font:600 max(15px,calc(19px*var(--k))) ${g.body};letter-spacing:.26em;text-transform:uppercase"><span style="flex:1;border-top:1px solid ${rgba(acc,.7)}"></span>${L}<span style="flex:1;border-top:1px solid ${rgba(acc,.7)}"></span></div>`;
    if(g.key==="offset")return `<div style="display:inline-block;margin:0 0 8px;padding:3px 14px 4px;background:${acc};color:${board};font:900 max(16px,calc(22px*var(--k))) ${g.disp};letter-spacing:.04em;text-transform:uppercase;border-radius:3px">${L}</div>`;
    if(g.key==="chalk")return `<div style="margin:0 0 6px;color:${acc};font:italic 800 max(18px,calc(30px*var(--k))) ${g.disp};text-transform:uppercase;letter-spacing:.02em;border-bottom:2px dashed ${rgba(acc,.6)};padding-bottom:2px;${glow}">${L}</div>`;
    return `<div style="margin:0 0 8px;padding-left:12px;border-left:6px solid ${acc};color:${ink};font:800 max(15px,calc(20px*var(--k))) ${g.disp};letter-spacing:.06em;text-transform:uppercase">${L}</div>`};
  const row=(it)=>`<div style="margin:0 0 calc(12px*var(--k))">
      <div style="display:flex;align-items:baseline;gap:8px;color:${ink};${glow}">
        <span style="font:700 max(16px,calc(26px*var(--k)))/1.12 ${g.key==="chalk"?g.disp:g.body};${g.key==="chalk"?"font-weight:800;":""}">${esc(it.n)}</span>
        <span style="flex:1;min-width:16px;border-bottom:2px dotted ${rgba(ink,.35)};transform:translateY(-6px)"></span>
        <span style="font:700 max(16px,calc(26px*var(--k)))/1.1 ${g.body};color:${acc};white-space:nowrap">${money(it.p,era)}</span></div>
      ${it.note?`<div ${A}-note="${it.house?"h":""}" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin-top:2px;color:${sub};font:500 max(14px,calc(20px*var(--k)))/1.28 ${g.body}">${esc(it.note)}</div>`:""}</div>`;
  const course=k=>I[k].length?`<div style="margin:0 0 calc(10px*var(--k))">${label(C[k])}${I[k].map(row).join("")}</div>`:"";
  const ledger=(lab,val,strong)=>`<div style="display:flex;align-items:baseline;gap:10px;color:${ink};font:${strong?800:600} ${strong?24:19}px/1.1 ${g.body};letter-spacing:.1em;text-transform:uppercase;${strong?`border-top:3px double ${rgba(ink,.7)};padding-top:8px;`:`border-top:1px solid ${rgba(ink,.35)};padding-top:6px;`}"><span>${esc(lab)}</span><span style="flex:1"></span><span style="color:${acc};letter-spacing:.02em">${money(val,era)}</span></div>`;

  /* logo panel */
  const lp=g.key==="laser"?"#f2f0ea":mix(ink,"#ffffff",.3), dp=mix(board,"#000000",.45);
  const titleType=`<div ${A}-text="46" ${A}-lo="20" style="width:100%;max-height:84px;overflow:hidden;text-align:center;font:${g.dw} 46px/1.02 ${g.disp};color:${ink};text-transform:uppercase;letter-spacing:${g.dtrack}">${esc(f.title||venue)}</div>`;
  const logoPanel=`<div ${A}-panel ${A}-light="${lp}" ${A}-dark="${dp}" style="position:absolute;left:${P}px;top:${LT}px;width:${W-2*P}px;height:${heroPoster?72:104}px;box-sizing:border-box;padding:${heroPoster?"8px 18px":"12px 18px"};background:${dp};box-shadow:0 6px 18px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;${g.key==="offset"?"border-radius:6px;":""}${t.gilt?`outline:2px solid ${acc};outline-offset:-6px;`:""}">
    ${ctx.logo?`<img ${A}-logo crossorigin="anonymous" src="${ctx.img(ctx.logo[0],"w500")}" style="max-width:100%;max-height:${heroPoster?56:78}px;object-fit:contain">`
      +`<div ${A}-fallback style="display:none;position:absolute;inset:10px 18px;align-items:center;justify-content:center">${titleType}</div>`
      :`<div style="position:absolute;inset:10px 18px;display:flex;align-items:center;justify-content:center;background:${dp}">${titleType}</div>`}
  </div>`;

  /* front */
  const f0=`<div ${A}-face style="position:absolute;inset:0;${faceBg}overflow:hidden;font-family:${g.body}">
    ${border}${gilt}
    <div ${A}-text="17" ${A}-lo="14" style="position:absolute;left:${P+8}px;right:${P+8}px;top:${heroPoster?26:30}px;height:24px;overflow:hidden;white-space:nowrap;text-align:center;color:${acc};font:600 17px/24px ${g.body};letter-spacing:.24em;text-transform:uppercase">${esc(sign)}</div>
    <div ${A}-text="46" ${A}-lo="22" style="position:absolute;left:${P+8}px;right:${P+8}px;top:${heroPoster?50:56}px;height:${heroPoster?54:78}px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;color:${ink};font:${g.ds} ${g.dw} 46px/1 ${g.disp};letter-spacing:${g.dtrack};text-transform:uppercase;${glow}">${esc(venue)}</div>
    ${heroPoster?`<div style="position:absolute;left:${(W-PW)/2}px;top:110px;width:${PW}px;height:${PH}px;box-shadow:0 0 0 2px ${rgba(acc,.85)},0 6px 18px rgba(0,0,0,.6)"><img crossorigin="anonymous" alt="${esc((f.title||"")+" poster")}" src="${heroSrc}" style="display:block;width:100%;height:100%;object-fit:fill"></div>`:`<div style="position:absolute;left:0;top:144px;width:${W}px;height:${SH}px;overflow:hidden;background:#000">${photo(heroSrc,heroPoster,SH)}</div>`}
    ${logoPanel}
    <div ${A}-box style="position:absolute;left:${P+6}px;top:${BT}px;width:${W-2*P-12}px;height:${BH}px;overflow:hidden;--k:1;display:flex;flex-direction:column;justify-content:safe center">${course("s")}${course("m")}</div>
    <div style="position:absolute;left:${P+6}px;right:${P+6}px;top:${heroPoster?980:976}px">${ledger("Carried over",front)}</div>
    <div style="position:absolute;left:${P+6}px;right:${P+6}px;top:${heroPoster?1020:1014}px;color:${sub};font:500 16px/1.2 ${g.body};letter-spacing:.14em;text-transform:uppercase;text-align:center;white-space:nowrap;overflow:hidden">Tab No. ${esc(number)} &middot; ${esc(voice[0])}</div>
    ${wearLayer}</div>`;

  /* back */
  const note=fl.note&&fl.note.text?fl.note:{text:f.T||voice[1],by:fl.note&&fl.note.by||"The barkeep"};
  const prop=fl.prop&&fl.prop.title?fl.prop:{title:"House rules",lines:["Tabs settle at the credits","No phones on the bar"]};
  const winks=(fl.winks||[]).slice(0,5);
  const cue=f.P||"";
  const coasterBg=g.key==="laser"?"#f4f1ea":mix(ink,"#d9c9a6",.35);
  const coasterInk=mix(board,"#000000",.2);
  const cAcc=pickAccent(acc,coasterBg,4.5,"#8a1c1c");
  const coaster=`<div style="position:absolute;left:300px;top:778px;width:202px;height:202px;border-radius:50%;background-color:${coasterBg};background-image:${noise(.7,.12,"#7a5a30",3)},radial-gradient(circle at 50% 50%,rgba(0,0,0,0) 58%,rgba(90,60,20,.18) 72%,rgba(0,0,0,0) 74%);box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(${t.rot}deg)">
     <div style="position:absolute;inset:9px;border-radius:50%;border:2px solid ${cAcc}"></div>
     <div ${A}-box ${A}-min=".8" style="position:absolute;left:28px;top:34px;width:146px;height:134px;overflow:hidden;--k:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:${coasterInk}">
       <div style="font:700 max(14px,calc(15px*var(--k)))/1.1 ${g.body};letter-spacing:.2em;text-transform:uppercase;color:${cAcc}">${esc(prop.kind||"coaster")}</div>
       <div style="margin:4px 0;font:${g.dw} max(16px,calc(23px*var(--k)))/1.02 ${g.disp};text-transform:uppercase">${esc(prop.title)}</div>
       ${(prop.lines||[]).slice(0,3).map(l=>`<div ${A}-drop style="font:600 max(14px,calc(15px*var(--k)))/1.2 ${g.body}">${esc(l)}</div>`).join("")}
     </div></div>`;
  const f1=`<div ${A}-face style="position:absolute;inset:0;${faceBg}overflow:hidden;font-family:${g.body}">
    ${border}${gilt}
    <div style="position:absolute;left:0;top:0;width:${W}px;height:300px;overflow:hidden;background:#000">${photo(s2Src,s2Poster,300,"center 30%")}
      <div style="position:absolute;left:${P}px;bottom:14px;max-width:${W-2*P-20}px;padding:5px 12px;background:${rgba(board,.86)};color:${ink};font:600 16px/1.25 ${g.body};letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(fl.sign||venue)}</div></div>
    <div style="position:absolute;left:${P+6}px;right:${P+6}px;top:318px">${ledger("Brought forward",front)}</div>
    <div ${A}-box style="position:absolute;left:${P+6}px;top:362px;width:${W-2*P-12}px;height:300px;overflow:hidden;--k:1;display:flex;flex-direction:column;justify-content:safe center">${course("w")}${course("d")}</div>
    <div style="position:absolute;left:${P+6}px;right:${P+6}px;top:676px">${ledger("Running tab",total,1)}</div>
    <div ${A}-box ${A}-min=".8" style="position:absolute;left:${P+6}px;top:736px;width:258px;height:236px;overflow:hidden;--k:1;color:${ink}">
      <div style="color:${acc};font:600 max(14px,calc(16px*var(--k))) ${g.body};letter-spacing:.2em;text-transform:uppercase;margin-bottom:6px">${fam?"From the counter":"From the bar"}</div>
      <div style="font:italic 500 max(15px,calc(20px*var(--k)))/1.3 ${g.body}">"${esc(note.text)}"</div>
      <div style="margin-top:4px;font:400 max(22px,calc(32px*var(--k)))/1.05 'Caveat Brush',cursive;color:${acc};text-align:right">${esc(note.by)}</div></div>
    ${coaster}
    <div ${A}-box ${A}-min=".9" style="position:absolute;left:${P+6}px;right:${P+6}px;top:990px;height:52px;overflow:hidden;--k:1;color:${sub};font:500 max(14px,calc(15px*var(--k)))/1.3 ${g.body}">
      ${cue?`<span ${A}-drop>Last call: ${esc(cue)} </span>`:""}${winks.length?`<span ${A}-drop>Bar talk: ${esc(winks.slice(0,3).join(". "))}. </span>`:""}<span>Prices subject to change. ${esc(g.print)}. Tab No. ${esc(number)}. ${esc(yr)}.${fam?" Every drink alcohol free.":""}</span></div>
    ${wearLayer}</div>`;
  return {w:W,h:H,faces:[f0,f1]};
};
/* fonts ready: the app awaits .ready before it renders, so the fitter measures with the real faces and text never spills at a late font swap */
function fontSpecs(url){const o=[];String(url||"").replace(/family=([^&:]+)(?::([a-z,]+)@([^&]+))?/g,(m,fam,ax,vals)=>{fam=decodeURIComponent(fam.replace(/\+/g," "));
  if(!ax){o.push(`400 20px "${fam}"`);return m}const a=ax.split(",");vals.split(";").forEach(v=>{const p=v.split(","),g=n=>a.indexOf(n)<0?null:p[a.indexOf(n)];o.push(`${g("ital")==="1"?"italic ":""}${g("wght")||400} 20px "${fam}"`)});return m});return o}
function fontsReady(links){return Promise.all(links.filter(Boolean).map(l=>new Promise(r=>{if(l.sheet)return r();l.addEventListener("load",r);l.addEventListener("error",r);setTimeout(r,3500)})
  .then(()=>Promise.all(fontSpecs(l.getAttribute("href")).map(s=>document.fonts.load(s).catch(()=>0)))))).then(()=>document.fonts.ready).catch(()=>0)}
loadFonts();window.MENU_FORMATS[ID].ready=fontsReady([document.getElementById("fmt-font-"+ID)]);
})();
