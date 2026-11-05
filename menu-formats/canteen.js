/* Format: canteen. A school or office canteen tray card, one landscape face 1056x816.
   Timetable strip across the top (winks as lessons, lunch time from the film number), the hero still over 40 percent
   of the face with the logo panel and a lunch ticket clipped to its corner, a ruled note card with a script signature
   and a type-only prop card under it, and the menu set into a moulded tray: main tray, starters and pudding side by
   side, drinks. Era sets paper, tray material, strip (ruled, offset band, green-bar printout, laser band), type and
   photo; tone sets wear, tint, contrast and copy voice. Inline styles only; the fitter below shrinks boxes after load. */
(function(){
const ID="canteen",A="data-"+ID;
const FONT_URL="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@600;700&family=Asap+Condensed:wght@800&family=Bai+Jamjuree:ital,wght@0,700;1,700&family=Lexend:wght@600;800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat:wght@600;700&display=swap";
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
 {key:"mimeo",disp:"'Zilla Slab',serif",dw:700,body:"'Atkinson Hyperlegible',sans-serif",paper:"#efe4c6",ink:"#2a2418",tray:"#a9cdb8",acc:"#8c2f23",photo:"grayscale(1) sepia(.35) contrast(1.05)",print:"Duplicated in the school office",radius:10},
 {key:"offset",disp:"'Asap Condensed',sans-serif",dw:800,body:"'Atkinson Hyperlegible',sans-serif",paper:"#f2dcae",ink:"#3a2614",tray:"#d27a2c",acc:"#7b4a12",photo:"sepia(.3) saturate(.85) contrast(.95) brightness(1.04)",print:"Offset printed for the canteen",radius:22},
 {key:"greenbar",disp:"'Bai Jamjuree',sans-serif",dw:700,body:"'Atkinson Hyperlegible',sans-serif",paper:"#ecebe5",ink:"#1f2328",tray:"#8ea2b4",acc:"#1d5fa8",photo:"contrast(1.04) saturate(.92) brightness(1.02)",print:"Run off on the office printer",radius:14},
 {key:"laser",disp:"'Lexend',sans-serif",dw:800,body:"'Atkinson Hyperlegible',sans-serif",paper:"#f7f6f3",ink:"#16181b",tray:"#d5d9dc",acc:"#e0482f",photo:"contrast(1.08) saturate(1.08)",print:"Printed by facilities",radius:18}];
const TONE={
 gritty:{wear:.8,photo:"contrast(1.2) saturate(.72)",vig:.45,rot:-2,tint:"rgba(120,90,50,.10)",voice:["No seconds. No exceptions.","Trays back to the window"]},
 glossy:{wear:0,photo:"saturate(1.15) contrast(1.06)",vig:.08,rot:0,gloss:1,voice:["Fresh from the line today","Specials change daily"]},
 warm:{wear:.3,photo:"sepia(.14) saturate(1.06)",vig:.22,rot:-2,tint:"rgba(255,160,80,.10)",voice:["Lunch is on, come and get it","Made fresh by the kitchen crew"]},
 eerie:{wear:.5,photo:"saturate(.5) brightness(.92) contrast(1.1)",vig:.5,rot:2,tint:"rgba(40,130,110,.16)",voice:["Lunch is served at the usual time","Nobody remembers who cooks"]},
 playful:{wear:.1,photo:"saturate(1.25) brightness(1.05)",vig:.1,rot:-4,voice:["Tray up, it's lunchtime","Seconds if you ask nicely"]},
 grand:{wear:.08,photo:"contrast(1.06) saturate(1.05)",vig:.18,rot:0,gilt:1,voice:["Luncheon in the great hall","Served at the long tables"]},
 tender:{wear:.2,photo:"brightness(1.06) saturate(.88) contrast(.94)",vig:.15,rot:-2,tint:"rgba(255,190,170,.08)",voice:["Save a seat for a friend","Made with care, every day"]},
 tense:{wear:.4,photo:"contrast(1.3) saturate(.68)",vig:.4,rot:1,tint:"rgba(160,20,20,.08)",voice:["Eat fast, keep your head down","Lunch ends when the bell goes"]},
 scrappy:{wear:.65,photo:"grayscale(1) contrast(1.6) brightness(1.06)",vig:.2,rot:4,xerox:1,voice:["Whatever's left on the line","Trays sticky, food hot"]}};
const BASE={"1930s-40s":.10,"1950s":.20,"1960s":.35,"1970s":.60,"1980s":1.10,"1990s":1.80,"2000s":2.80,"modern":4.50};
const FAMILY=new Set(["kids","fairytale"]);
function priceFor(era,year,number){const b=BASE[era]||2.8,M={s:1,m:2.2,w:1,d:.7};
  const yy=(+year||0)%100,num=/^\d{2,3}$/.test(String(number||""))?+number:null;
  return (k,i)=>{let p=b*M[k]*(1+i*.15);p=Math.max(.05,Math.round(p*20)/20);
    /* the film number only sets the cents, on the period price */
    if(k==="m"&&i===0&&num&&p>=1)p=Math.floor(p)+(num%100)/100;
    return p}}
const money=(p,era)=>p<1&&ERA_G[era]<2?Math.round(p*100)+"c":p.toFixed(2);

/* fitter: shrinks [data-canteen-box] (via --k), then clamps and drops notes; [data-canteen-text] shrinks one line block */
function over(e){return e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1}
function fitBox(b){b.style.setProperty("--k","1");const notes=[...b.querySelectorAll(`[${A}-note]`)],drops=[...b.querySelectorAll(`[${A}-drop]`)];
  const names=[...b.querySelectorAll(`[${A}-name]`)];names.forEach(n=>{n.style.display="";n.style.webkitLineClamp="";n.style.overflow=""});notes.forEach(n=>{n.style.display="-webkit-box";n.style.webkitLineClamp="2"});drops.forEach(d=>d.style.display="");
  const min=+b.getAttribute(A+"-min")||.68;let k=1;
  while(over(b)&&k>min){k=Math.round((k-.02)*100)/100;b.style.setProperty("--k",k)}
  /* house lines go first, then whole notes from the bottom up: a note is shown in full or not at all, never cut to "mozzarell..." */
  for(let i=drops.length-1;i>=0&&over(b);i--)drops[i].style.display="none";
  for(let i=notes.length-1;i>=0&&over(b);i--)notes[i].style.display="none";
  if(over(b)){names.forEach(n=>{n.style.display="-webkit-box";n.style.webkitBoxOrient="vertical";n.style.webkitLineClamp="1";n.style.overflow="hidden"})}
  while(over(b)&&k>.5){k=Math.round((k-.02)*100)/100;b.style.setProperty("--k",k)}}
function fitText(e){let s=+e.getAttribute(A+"-text");const lo=+e.getAttribute(A+"-lo")||16;e.style.fontSize=s+"px";e.style.letterSpacing="";while(over(e)&&s>lo){s-=1;e.style.fontSize=s+"px"}
  /* still too wide at its smallest size (a long sign like "Monumental Pictures: Talkies Soon"): close up the tracking, then go a little smaller, so the last word is never cut */
  if(over(e)){const ls=parseFloat(getComputedStyle(e).letterSpacing)/s||0;for(let t=ls;over(e)&&t>.04;t-=.02)e.style.letterSpacing=t.toFixed(2)+"em";while(over(e)&&s>Math.max(10,lo*.7)){s-=.5;e.style.fontSize=s+"px"}}}
function logoInit(img){if(img.dataset.seen)return;img.dataset.seen="1";const panel=img.closest(`[${A}-panel]`),fb=panel&&panel.querySelector(`[${A}-fallback]`);
  const fail=()=>{img.style.display="none";if(fb){fb.style.display="flex";fitText(fb.firstElementChild)}};
  const ok=()=>{if(!img.naturalWidth)return fail();try{const c=document.createElement("canvas"),w=c.width=64,h=c.height=Math.max(1,Math.round(64*img.naturalHeight/img.naturalWidth));const g=c.getContext("2d");g.drawImage(img,0,0,w,h);const d=g.getImageData(0,0,w,h).data;
    /* light, dark or multicolour logo: 15th percentile contrast (the worst-reading ink decides) of its inked pixels against each panel, keep the panel that reads better */
    const P=x=>{const m=String(x).match(/[\d.]+/g).map(Number);return lumA(m.slice(0,3))},Ld=P(panel?panel.getAttribute(A+"-dark"):"0,0,0"),Ll=P(panel?panel.getAttribute(A+"-light"):"255,255,255"),cd=[],cl=[];
    for(let i=0;i<d.length;i+=4)if(d[i+3]>140){const L=lumA([d[i],d[i+1],d[i+2]]);cd.push((Math.max(L,Ld)+.05)/(Math.min(L,Ld)+.05));cl.push((Math.max(L,Ll)+.05)/(Math.min(L,Ll)+.05))}
    const med=a=>a.sort((x,y)=>x-y)[Math.floor(a.length*.15)]||1;if(panel&&cd.length){panel.style.background=med(cl)>med(cd)*1.08?panel.getAttribute(A+"-light"):panel.getAttribute(A+"-dark")}}catch(e){}};
  if(img.complete)(img.naturalWidth?ok():fail());else{img.addEventListener("load",ok);img.addEventListener("error",fail)}}
let pend=0;function fitAll(){pend=0;document.querySelectorAll(`[${A}-face]`).forEach(f=>{f.querySelectorAll(`img[${A}-logo]`).forEach(logoInit);f.querySelectorAll(`[${A}-text]`).forEach(fitText);f.querySelectorAll(`[${A}-box]`).forEach(fitBox)})}
function soon(){if(!pend){pend=1;requestAnimationFrame(()=>setTimeout(fitAll,30))}}
if(!window["__fit_"+ID]){window["__fit_"+ID]=1;new MutationObserver(m=>{if(m.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches(`[${A}-face]`)||n.querySelector&&n.querySelector(`[${A}-face]`))))){fitAll();soon()}}).observe(document.documentElement,{childList:true,subtree:true});
  if(document.fonts){document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",soon);document.fonts.ready.then(soon)}[400,1200,2200].forEach(t=>setTimeout(soon,t))}

/* the format */
window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  loadFonts();
  const W=1056,H=816,f=ctx.f||{},menu=ctx.menu||{},era=ERA_G[ctx.era]!=null?ctx.era:"modern",gi=ERA_G[era],g=G[gi],t=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),fl=ctx.flavour||{},yr=f.year||"";
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id])||null;
  const stills=(ctx.stills||[]).filter(Boolean);
  const heroSrc=poster?ctx.img(poster,"w780"):stills[0]?ctx.img(stills[0],"w1280"):"";
  const heroPoster=!!poster;
  const sideSrc=poster&&stills[0]?ctx.img(stills[0],"w1280"):"";
  const venue=fl.venue||"The Canteen",sign=fl.sign||"Lunch served daily";
  /* which kind of canteen: a prison or an army mess gets its own day, not school periods ("Mess Hall" is not a school hall) */
  const vs=venue+" "+sign,prison=/prison|jail|gaol|cell block|block [a-z]\b|alcatraz|belle reve|shawshank|penitentiary/i.test(vs),
    mess=!prison&&/\bmess\b|\bbase\b|\bfort\b|barracks|\brig\b|nui dat|rebel|army|navy|squadron/i.test(vs)&&!/police academy/i.test(vs),
    school=!prison&&!mess&&(/school|academy|high|primary|college|class|camp|university|campus|dining hall|\bhall\b(?! block)/i.test(vs)||(!fl.venue&&FAMILY.has(f.theme)));
  const accRaw=ctx.palette&&ctx.palette.accent;
  const paper=hx(accRaw)&&sat(accRaw)>.22?mix(g.paper,accRaw,.07):g.paper;
  const ink=g.ink;
  const acc=pickAccent(accRaw,paper,4.5,g.acc);
  const tray=hx(accRaw)&&sat(accRaw)>.22&&gi!==3?mix(g.tray,accRaw,.18):g.tray;
  const cell=mix(tray,"#ffffff",gi===3?.6:.55);
  const cellInk=lum(cell)>.35?"#1b1b1b":"#f6f2ea";
  const cAcc=pickAccent(acc,cell,4.5,g.acc);
  const sub=mix(cellInk,cell,.3);
  const number=fl.number||(String(yr).slice(-2)==="00"?String(yr):String(yr).slice(-2))||"1";/* a 2000 film reads "No. 2000", never "No. 00" (review 12) */
  const price=priceFor(era,yr,fl.number);
  const C=school?{s:"Starters",m:"Main tray",w:"Pudding",d:"Drinks"}:{s:"Starters",m:"Hot line",w:"Sweets",d:"Drinks"};
  /* prices that make sense on their own card: every main above every starter and sweet, and a drink with spirits above a plain beer or soft drink */
  const PR={},rnd=v=>Math.max(.05,Math.round(v*20)/20),SPIRIT=/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|mezcal|brandy|cognac|cocktail|martini|boilermaker|negroni|margarita|spritz|old fashioned|manhattan|sour|daiquiri|mojito|julep|highball|shots?|liqueur|schnapps|vodka)\b/i;for(const k of ["s","m","w","d"])PR[k]=(menu[k]||[]).slice(0,4).map((x,i)=>price(k,i));
  {const sw=Math.max(0,...PR.s,...PR.w);PR.m=PR.m.map(v=>v>sw?v:rnd(sw*1.3+(v%1)*.1));
   const ds=(menu.d||[]).slice(0,4),plain=Math.max(0,...ds.map((x,i)=>SPIRIT.test(x.n+" "+(x.note||""))?0:PR.d[i]));PR.d=PR.d.map((v,i)=>SPIRIT.test(ds[i].n+" "+(ds[i].note||""))&&v<=plain?rnd(plain*1.3):v)}
  const items=k=>(menu[k]||[]).slice(0,4).map((x,i)=>({n:dry(x.n,fam),note:dry(x.note,fam),p:PR[k][i]}));
  const I={s:items("s"),m:items("m"),w:items("w"),d:items("d")};
  /* then the shared check, so a cocktail also sits above the sweets (Police Academy's blue lagoon) */
  if(window.priceSense){const P={},M={};for(const k in I){M[k]=I[k];P[k]=I[k].map(x=>money(x.p,era))}const Q=window.priceSense(M,P);for(const k in I)I[k].forEach((x,i)=>{x.ps=Q[k][i]})}
  const photoF=`${g.photo} ${t.photo}`;
  const winks=(fl.winks||[]).slice(0,5);
  const voice=t.voice;

  /* paper, wear */
  const tex=[noise(.8,gi===0?.10:gi===1?.08:.05,gi<2?"#7a5a30":"#606060",3),noise(.02,.10,gi<2?"#8a6a40":"#808080",2),t.wear>.5?noise("0.02 0.3",(t.wear*.12).toFixed(3),"#5a4a30",2):null].filter(Boolean).join(",");
  const vign=`radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(60,40,20,${t.vig}) 100%)`;
  const xerox=t.xerox?`<div style="position:absolute;inset:0;background:${noise(1.3,.12,"#000000",1)};mix-blend-mode:multiply;pointer-events:none"></div>`:"";
  const gilt=t.gilt?`<div style="position:absolute;inset:8px;border:2px solid ${acc};box-shadow:inset 0 0 0 4px ${paper},inset 0 0 0 5px ${acc};pointer-events:none"></div>`:"";

  /* timetable strip */
  const slots=school?["Period 1","Period 2","Lunch","Period 4","Period 5"]:mess?["0600","0900","Chow","1500","2200"]:prison?["0600","0900","Chow","1400","2100"]:["9:00","10:30","Lunch","2:00","3:30"];
  const fall=school?["Assembly","Maths","",  "Library","Sport"]:mess?["Reveille","Drill","","Duty roster","Lights out"]:prison?["Count","Yard","","Work detail","Lock-up"]:["Briefing","Meetings","","Reports","Home time"];
  const lunchAt=`12:${String((parseInt(number,10)||0)%60).padStart(2,"0")}`;
  /* a long wink keeps a whole phrase (cut at a comma, "and" or "with"), never a fragment like "Bruce Bogtrotter and the"; if no clean phrase fits, the plain subject is used */
  const cut=(w,n)=>{if(!w||w.length<=n)return w;for(const sep of [", "," and "," with "," at "," in "," on "]){const i=w.indexOf(sep);if(i>3&&i<=n)return w.slice(0,i)}return null};
  /* timetable slots are lessons or duties: a wink that is mostly people's names falls back to the slot's own label */
  const named=w=>{const ws=String(w||"").split(/\s+/).filter(Boolean);return ws.length&&ws.filter(x=>/^[A-Z]/.test(x)).length/ws.length>.5};
  const sl=(w,i)=>{const c=cut(w,30);return !c||named(c)?fall[i]:c};
  const subj=[sl(winks[0],0)||fall[0],sl(winks[1],1),lunchAt,sl(winks[2],3),sl(winks[3],4)];
  const stripBg=gi===0?`background:${mix(paper,"#000000",.04)};border-bottom:3px double ${ink};`
    :gi===1?`background:${mix(ink,acc,.25)};`
    :gi===2?`background:repeating-linear-gradient(0deg,${mix(paper,"#9fc9a4",.55)} 0 18px,${paper} 18px 36px);border-bottom:2px solid ${mix(ink,paper,.4)};`
    :`background:${acc};`;
  const stripInk=gi===1||gi===3?(lum(gi===1?mix(ink,acc,.25):acc)>.4?"#111111":"#ffffff"):ink;
  const strip=`<div style="position:absolute;left:0;top:0;width:${W}px;height:80px;${stripBg}display:flex">
    ${slots.map((s,i)=>{const L=i===2;return `<div style="flex:${L?.8:1};min-width:0;padding:9px 14px 0;box-sizing:border-box;${i?`border-left:1px ${gi===2?"dashed":"solid"} ${rgba(hx(stripInk)?stripInk:"#000000",.35)};`:""}${L?`background:${gi===3?"#ffffff":acc};color:${gi===3?acc:(lum(acc)>.4?"#111111":"#ffffff")};`:`color:${stripInk};`}">
      <div style="font:700 14px/1.1 ${g.body};letter-spacing:.18em;text-transform:uppercase;opacity:${L?1:.8}">${esc(s)}</div>
      <div style="margin-top:4px;font:${L?`${g.dw} 28px/1 ${g.disp}`:`600 15px/1.22 ${g.body}`};display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden">${esc(subj[i])}</div></div>`}).join("")}</div>`;

  /* hero */
  const photo=()=>{
    if(!heroSrc)return `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:${tray}"><div style="font:${g.dw} 56px/1 ${g.disp};color:${cellInk};text-align:center;padding:0 40px">${esc(venue)}</div></div>`;
    if(heroPoster)return `<img crossorigin="anonymous" alt="${esc((f.title||"")+" poster")}" src="${heroSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block"><div style="position:absolute;inset:0;box-shadow:inset 0 0 26px rgba(0,0,0,${.08+t.vig*.3})"></div>`;
    const tint=t.tint?`<div style="position:absolute;inset:0;background:${t.tint};mix-blend-mode:multiply"></div>`:"";
    const gloss=t.gloss?`<div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.18),rgba(255,255,255,0) 40%)"></div>`:"";
    const half=gi===1?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.2) 30%,transparent 32%) 0 0/4px 4px;mix-blend-mode:multiply;opacity:.55"></div>`:"";
    const inner=heroPoster?`<div style="position:absolute;inset:-40px;background:url('${heroSrc}') center/cover;filter:blur(22px) brightness(.6) saturate(.8)"></div><img src="${heroSrc}" style="position:absolute;left:50%;top:0;height:100%;transform:translateX(-50%);filter:${photoF};box-shadow:0 0 30px rgba(0,0,0,.5)">`
      :`<img crossorigin="anonymous" src="${heroSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;filter:${photoF}">`;
    return inner+half+tint+gloss};
  const heroFrame=gi===0?`border:2px solid ${ink};box-shadow:0 0 0 5px ${paper},0 0 0 6px ${ink};`:gi===1?`border-radius:0 0 26px 0;`:gi===2?`border:1px solid ${mix(ink,paper,.5)};`:``;
  const bw=gi===0?2:gi===2?1:0,pw=gi===0?468:474,hH=heroPoster?pw*3/2+bw*2:(gi===0?558:568),hW=heroPoster?pw+bw*2:(gi===0?612:620),hL=gi===0?10:0,colX=hL+hW+18;
  const hero=`<div style="position:absolute;left:${hL}px;top:${heroPoster?(gi===0?90:88):(gi===0?90:80)}px;width:${hW}px;height:${hH}px;overflow:hidden;background:${heroPoster?"transparent":"#000"};box-sizing:border-box;${heroFrame}">${photo()}</div>`;
  /* poster layout: head and logo across the top of the right region, tray beside a narrow side column (ticket, prop, note) */
  const RX=colX,RR=1046,SW=172,SX=RR-SW,TW=SX-14-RX,LW=SW;
  const CX=heroPoster?SX:30,CW=heroPoster?SW:340;
  const sideFrame=gi===0?`border:2px solid ${ink};box-shadow:0 0 0 4px ${paper},0 0 0 5px ${ink};`:gi===2?`border:1px solid ${mix(ink,paper,.5)};`:"";
  const sidePic=sideSrc?`<div style="position:absolute;left:${CX}px;top:430px;width:${CW}px;height:206px;overflow:hidden;background:#000;box-sizing:border-box;${sideFrame}"><img crossorigin="anonymous" alt="" src="${sideSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;filter:${photoF}"></div>`:"";

  /* logo panel */
  const lp="#f6f3ec",dp=mix(ink,"#000000",.35);
  const titleType=`<div ${A}-text="40" ${A}-lo="18" style="width:100%;max-height:92px;overflow:hidden;text-align:center;font:${g.dw} 40px/1.04 ${g.disp};color:${lp}">${esc(f.title||venue)}</div>`;
  const logoPanel=`<div ${A}-panel ${A}-light="${rgba(lp,.94)}" ${A}-dark="${rgba(dp,.86)}" style="position:absolute;left:${CX}px;top:${heroPoster?88:106}px;width:${CW}px;height:${heroPoster?106:116}px;box-sizing:border-box;padding:${heroPoster?"10px 12px":"12px 16px"};background:${rgba(dp,.86)};display:flex;align-items:center;justify-content:center;border-radius:${g.radius/2}px;box-shadow:0 6px 18px rgba(0,0,0,.35);${t.gilt?`outline:2px solid ${acc};outline-offset:-6px;`:""}">
    ${ctx.logo?`<img ${A}-logo crossorigin="anonymous" src="${ctx.img(ctx.logo[0],"w500")}" style="max-width:100%;max-height:${heroPoster?80:88}px;object-fit:contain"><div ${A}-fallback style="display:none;position:absolute;inset:10px 16px;align-items:center;justify-content:center;background:${dp}">${titleType}</div>`
      :`<div style="position:absolute;inset:0;padding:10px 16px;display:flex;align-items:center;justify-content:center;background:${dp};border-radius:inherit">${titleType}</div>`}</div>`;

  /* lunch ticket over the hero corner */
  const tkBg=gi===3?"#ffffff":mix(paper,"#fff6d8",.5);
  const tkAcc=pickAccent(acc,tkBg,4.5,g.acc);
  const cue=f.P||"";
  const ticket=`<div style="position:absolute;left:${heroPoster?CX+8:400}px;top:${heroPoster?214:500}px;width:${heroPoster?CW-16:206}px;height:${heroPoster?150:160}px;box-sizing:border-box;padding:${heroPoster?"10px 8px":"12px 14px"};background-color:${tkBg};background-image:${noise(.8,.08,"#6a5a40",2)};border:2px dashed ${tkAcc};outline:6px solid ${tkBg};box-shadow:0 8px 20px rgba(0,0,0,.4);transform:rotate(${t.rot}deg);color:${ink}">
     <div ${A}-box ${A}-min=".85" style="width:100%;height:100%;overflow:hidden;--k:1;text-align:center">
       <div style="font:700 max(14px,calc(14px*var(--k))) ${g.body};letter-spacing:.2em;text-transform:uppercase;color:${tkAcc}">${school?"Lunch ticket":mess?"Mess chit":prison?"Meal tray":"Meal voucher"}</div>
       <div style="font:${g.dw} max(22px,calc(34px*var(--k)))/1.05 ${g.disp};margin:2px 0 4px">No. ${esc(number)}</div>
       <div style="font:600 max(14px,calc(15px*var(--k)))/1.25 ${g.body}">Admit one to the line</div>
       ${cue?`<div ${A}-drop style="margin-top:3px;font:500 max(14px,calc(15px*var(--k)))/1.25 ${g.body};color:${mix(ink,tkBg,.25)}">${esc(cue)}</div>`:""}</div></div>`;

  /* note card and prop card */
  const note=fl.note&&fl.note.text?fl.note:{text:f.T||voice[1],by:fl.note&&fl.note.by||(school?"The lunch lady":mess?"The cook":prison?"The kitchen detail":"The kitchen")};
  const prop=fl.prop&&fl.prop.title?fl.prop:(school?{kind:"pass",title:"Hall pass",lines:["Out of class: lunch","Signed, the office"]}:mess?{kind:"pass",title:"Mess pass",lines:["One tray, one sitting","Signed, duty officer"]}:prison?{kind:"pass",title:"Kitchen pass",lines:["Escorted to the line","Signed, the guard"]}:{kind:"badge",title:"Staff ID",lines:["Canteen access","Level 2"]});
  const ruled=gi===0?"":`repeating-linear-gradient(180deg,rgba(0,0,0,0) 0 27px,${rgba("#6a9bd1",.35)} 27px 28px),`;
  const noteCard=`<div style="position:absolute;left:${heroPoster?SX:18}px;top:${heroPoster?528:662}px;width:${heroPoster?SW:364}px;height:${heroPoster?228:140}px;box-sizing:border-box;padding:10px ${heroPoster?12:16}px;background-color:#fbf8ef;background-image:${ruled}${noise(.8,.06,"#6a5a40",2)};${gi===0?"":`border-top:3px solid ${rgba("#d9534f",.55)};`}box-shadow:0 4px 12px rgba(0,0,0,.25);transform:rotate(${-t.rot/3}deg)">
    <div ${A}-box ${A}-min=".78" style="width:100%;height:100%;overflow:hidden;--k:1;color:#24211b">
      <div style="font:italic 500 max(15px,calc(19px*var(--k)))/1.32 ${g.body}">"${esc(note.text)}"</div>
      <div style="text-align:right;padding-right:8px;font:700 max(20px,calc(30px*var(--k)))/1 'Caveat',cursive;color:${pickAccent(acc,"#fbf8ef",4.5,g.acc)}">${esc(note.by)}</div></div></div>`;
  const pBg=gi===1?mix(acc,"#ffffff",.82):gi===2?"#ffffff":mix(paper,"#ffffff",.5);
  const pAcc=pickAccent(acc,pBg,4.5,g.acc);
  const propCard=`<div style="position:absolute;left:${heroPoster?SX:398}px;top:${heroPoster?384:676}px;width:${heroPoster?SW:212}px;height:${heroPoster?130:126}px;box-sizing:border-box;padding:10px ${heroPoster?12:14}px;background:${pBg};border:2px solid ${pAcc};border-radius:${g.radius/2}px;box-shadow:0 4px 12px rgba(0,0,0,.22)">
    <div ${A}-box ${A}-min=".72" style="width:100%;height:100%;overflow:hidden;--k:1;color:${ink}">
      <div style="font:700 max(14px,calc(14px*var(--k))) ${g.body};letter-spacing:.2em;text-transform:uppercase;color:${pAcc}">${esc(prop.kind||"card")}</div>
      <div style="font:${g.dw} max(17px,calc(24px*var(--k)))/1.05 ${g.disp};margin:2px 0 3px">${esc(prop.title)}</div>
      ${(prop.lines||[]).slice(0,3).reduce((a,l)=>{/* a line that ends on a comma runs on into the next, so the pair shows or goes together (review 12: The Santa Clause) */if(a.length&&/,\s*$/.test(a[a.length-1]))a[a.length-1]+=" "+l;else a.push(l);return a},[]).map(l=>`<div ${A}-drop style="font:600 max(12px,calc(15px*var(--k)))/1.2 ${g.body}">${esc(l)}</div>`).join("")}</div></div>`;

  /* tray */
  const row=it=>`<div style="margin:0 0 calc(8px*var(--k))"><div style="display:flex;align-items:baseline;gap:10px">
      <span ${A}-name style="flex:1;font:700 max(16px,calc(25px*var(--k)))/1.12 ${g.body};color:${cellInk}">${esc(it.n)}</span>
      <span style="font:${g.dw} max(16px,calc(25px*var(--k)))/1.1 ${g.disp};color:${cAcc};white-space:nowrap">${it.ps||money(it.p,era)}</span></div>
    ${it.note?`<div ${A}-note style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin-top:2px;font:500 max(14px,calc(19px*var(--k)))/1.25 ${g.body};color:${sub}">${esc(it.note)}</div>`:""}</div>`;
  const comp=(k,grow)=>I[k].length?`<div data-well style="flex:${grow} 1 0;min-width:0;box-sizing:border-box;padding:calc(12px*var(--k)) 16px calc(8px*var(--k));background:${cell};border-radius:${g.radius}px;box-shadow:inset 0 3px 8px rgba(0,0,0,.28),inset 0 -2px 0 rgba(255,255,255,.5)">
      <div style="margin-bottom:calc(6px*var(--k));font:700 max(14px,calc(17px*var(--k))) ${g.body};letter-spacing:.2em;text-transform:uppercase;color:${cAcc}">${esc(C[k])}</div>${I[k].map(row).join("")}</div>`:"";
  /* compartments stack full width (the tray column is too narrow to split without one word per line); each grows to share the spare depth */
  const trayInner=["m","s","w","d"].map(k=>comp(k,1)).filter(Boolean).map(x=>`<div style="display:flex;flex:${1} 1 auto">${x}</div>`).join("");
  /* first-paint estimate of the tray scale, so the card is close to fitted before the fitter runs */
  const lines=(t,cpl)=>Math.max(1,Math.ceil(String(t||"").length/cpl));
  const estTray=["m","s","w","d"].filter(k=>I[k].length).reduce((h,k)=>h+12+46+I[k].reduce((a,it)=>a+lines(it.n,19)*28+(it.note?Math.min(2,lines(it.note,34))*24+2:0)+8,0),0);
  const k0=Math.max(.68,Math.min(1,Math.floor(536/estTray*100)/100));
  const trayBox=`<div style="position:absolute;left:${heroPoster?RX:634}px;top:198px;width:${heroPoster?TW:408}px;height:${heroPoster?558:560}px;box-sizing:border-box;padding:12px;background:${tray};background-image:${gi===3?"linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,0) 40%,rgba(0,0,0,.06)),":""}${noise(.9,.06,"#ffffff",2)};border-radius:${g.radius+10}px;box-shadow:0 6px 16px rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.4)">
    <div ${A}-box style="width:100%;height:100%;overflow:hidden;--k:${k0};display:flex;flex-direction:column;gap:12px">${trayInner}</div></div>`;

  const head=`<div ${A}-text="17" ${A}-lo="14" style="position:absolute;left:${heroPoster?RX+6:640}px;width:${heroPoster?SX-14-RX-6:396}px;top:${heroPoster?88:84}px;height:24px;overflow:hidden;white-space:nowrap;color:${acc};font:700 17px/24px ${g.body};letter-spacing:.2em;text-transform:uppercase">${esc(sign)}</div>
    <div ${A}-text="44" ${A}-lo="20" style="position:absolute;left:${heroPoster?RX+6:640}px;width:${heroPoster?SX-14-RX-6:396}px;top:${heroPoster?114:110}px;height:${heroPoster?80:82}px;overflow:hidden;display:flex;align-items:center;color:${ink};font:${g.dw} 44px/1 ${g.disp};${gi===2?"font-style:italic;":""}">${esc(venue)}</div>`;
  const fine=`<div ${A}-box ${A}-min=".93" style="position:absolute;left:${heroPoster?RX+6:640}px;width:${heroPoster?RR-RX-6:396}px;top:764px;height:44px;overflow:hidden;--k:1;color:${mix(ink,paper,.3)};font:500 max(14px,calc(15px*var(--k)))/1.3 ${g.body}">
    <span>${esc(voice[0].replace(/[.!]$/,""))}. Prices subject to change. Form ${school?"SC":"CF"}-${esc(number)}. ${esc(yr)}.${fam?" All drinks alcohol free.":""} </span>${winks[4]&&winks[4].length<=44&&(voice[0].length+winks[4].length+60+(fam?25:0)+String(number).length)<=102?`<span ${A}-drop>Overheard at lunch: ${esc(winks[4])}.</span>`:""}</div>`;

  const face=`<div ${A}-face style="position:absolute;inset:0;background-color:${paper};background-image:${tex};overflow:hidden;font-family:${g.body}">
    ${hero}${heroPoster?"":sidePic}${strip}${logoPanel}${ticket}${noteCard}${propCard}${head}${trayBox}${fine}${gilt}
    <div data-vig style="position:absolute;inset:0;background:${vign};pointer-events:none"></div>${xerox}</div>`;
  return {w:W,h:H,faces:[face]};
};
/* fonts ready: the app awaits .ready before it renders, so the fitter measures with the real faces and text never spills at a late font swap */
function fontSpecs(url){const o=[];String(url||"").replace(/family=([^&:]+)(?::([a-z,]+)@([^&]+))?/g,(m,fam,ax,vals)=>{fam=decodeURIComponent(fam.replace(/\+/g," "));
  if(!ax){o.push(`400 20px "${fam}"`);return m}const a=ax.split(",");vals.split(";").forEach(v=>{const p=v.split(","),g=n=>a.indexOf(n)<0?null:p[a.indexOf(n)];o.push(`${g("ital")==="1"?"italic ":""}${g("wght")||400} 20px "${fam}"`)});return m});return o}
function fontsReady(links){return Promise.all(links.filter(Boolean).map(l=>new Promise(r=>{if(l.sheet)return r();l.addEventListener("load",r);l.addEventListener("error",r);setTimeout(r,3500)})
  .then(()=>Promise.all(fontSpecs(l.getAttribute("href")).map(s=>document.fonts.load(s).catch(()=>0)))))).then(()=>document.fonts.ready).catch(()=>0)}
loadFonts();window.MENU_FORMATS[ID].ready=fontsReady([document.getElementById("fmt-font-"+ID)]);
})();
