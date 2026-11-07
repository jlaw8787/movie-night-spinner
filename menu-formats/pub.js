/* Format: pub. An Australian country pub counter meal board, one portrait face 1056x1344.
   Top: the painted verandah fascia with the pub's name. Middle: the verandah photo (hero still) with the film logo on a panel.
   Bottom: a framed blackboard of counter meal specials in chalk, and beside it a raffle ticket and a pinned note with a script signature.
   Era sets the fascia paint and lettering, wall material, board frame, type pairing and photo treatment.
   Tone sets wear, chalk smudge, tilt, photo mood and the copy voice.
   Fonts (fmt-pub in wip/print/FONTS.md): DM Serif Display, Ranchers, Poller One, Sansita, Kanit, Saira Extra Condensed,
   Sofia Sans Extra Condensed, Schibsted Grotesk. Bodies Source Serif 4, Karla, Cabin, Barlow, Work Sans; signature Homemade Apple. */
(function(){
/* period prices: what the dish would have cost in the film's year (US CPI shape, 1990 = 1), with real menu endings */
const CPI=[[1880,.07],[1900,.065],[1915,.08],[1920,.15],[1930,.13],[1940,.11],[1950,.19],[1960,.23],[1970,.30],[1980,.63],[1990,1],[2000,1.32],[2010,1.68],[2020,1.98],[2025,2.4]];
function cpi(y){y=+y||1990;if(y<=CPI[0][0])return CPI[0][1];for(let i=1;i<CPI.length;i++){const [a,va]=CPI[i-1],[b,vb]=CPI[i];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return CPI[CPI.length-1][1]}
function periodPrice(base1990,year,seed){const x=base1990*cpi(year)*(0.88+((seed>>>3)%25)/100);
  if(x<.975)return String(Math.max(5,Math.round(x*20)*5))+"¢";
  const ends=x<10?[".95",".50",".25",".75"]:[".95",".50",".00"];const w=Math.floor(x);return w+ends[seed%ends.length]}

const W=1056,H=1344,ID="pub";
if(!document.getElementById("fmt-pub-fonts")){
  const l=document.createElement("link");l.id="fmt-pub-fonts";l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Ranchers&family=Poller+One&family=Sansita:wght@900&family=Kanit:ital,wght@1,800&family=Saira+Extra+Condensed:wght@800&family=Sofia+Sans+Extra+Condensed:wght@800&family=Schibsted+Grotesk:wght@900&family=Source+Serif+4:ital,wght@0,500;0,700;1,500&family=Karla:ital,wght@0,500;0,800;1,500&family=Cabin:ital,wght@0,500;0,700;1,500&family=Barlow:ital,wght@0,500;0,700;1,500&family=Work+Sans:ital,wght@0,500;0,700;1,500&family=Homemade+Apple&display=swap";
  /* warm every face as soon as the sheet lands, so menu fitting measures with real metrics */
  l.onload=()=>{try{["DM Serif Display", "Ranchers", "Poller One", "Sansita", "Kanit", "Saira Extra Condensed", "Sofia Sans Extra Condensed", "Schibsted Grotesk", "Source Serif 4", "Karla", "Cabin", "Barlow", "Work Sans", "Homemade Apple"].forEach(f=>{document.fonts.load(`800 20px "${f}"`);document.fonts.load(`500 20px "${f}"`);document.fonts.load(`italic 500 20px "${f}"`)})}catch(e){}};
  document.head.appendChild(l);
}
/* ---------- text safety ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[‒-―−]\s*/g,", ").replace(/(\w)-(?=\w)/g,"$1 ").replace(/\s+-+\s+/g,", ").replace(/\s+/g," ").trim();
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"']$/.test(s)?s:s+"."};
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
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
[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beers?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|schnapps)\b/gi,"syrup"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
const dry=s=>DRY.reduce((a,[r,t])=>a.replace(r,t),s);
const trunc=(s,n)=>{s=clean(s);if(s.length<=n)return s;const c=s.slice(0,n);const i=c.lastIndexOf(" ");const o=(i>n*.5?c.slice(0,i):c).replace(/[,;:]$/,"");return typeof noDangle==="function"?noDangle(o):o};
/* notes that do not fit are cut back to their first clause, or left off; never cut mid thought */
const clip=(s,n)=>{s=clean(s);if(s.length<=n)return s;const p=s.split(/(?<=[.!?;])\s/)[0].replace(/[.;]$/,"").trim();return p.length<=n&&p.length>=12?p:""};
/* real layout height of a block at a given width, measured off screen; null when there is no document */
const domH=(html,w)=>{try{const b=document.body;if(!b)return null;const d=document.createElement("div");d.style.cssText=`position:absolute;left:-12000px;top:0;width:${w}px;visibility:hidden;display:flow-root`;d.innerHTML=html;b.appendChild(d);const h=d.getBoundingClientRect().height;b.removeChild(d);return h}catch(e){return null}};

/* ---------- colour ---------- */
const rgb=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const hx=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=lum(rgb(a)),y=lum(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>hx(rgb(a).map((v,i)=>v+(rgb(b)[i]-v)*t));
const sat=a=>{const c=rgb(a),mx=Math.max(...c),mn=Math.min(...c);return mx?(mx-mn)/mx:0};
const fit=(c,bg,fb,min)=>{if(!rgb(c))c=fb;const to=lum(rgb(bg))>.35?"#000000":"#ffffff";let x=c;for(let i=0;i<10&&cr(x,bg)<min;i++)x=mix(x,to,.15);return cr(x,bg)>=min?x:fb};
const rgba=(h,a)=>{const c=rgb(h)||[0,0,0];return `rgba(${c[0]},${c[1]},${c[2]},${a})`};

/* ---------- measuring (estimates; every width is padded) ---------- */
const lines=(s,size,w,cw)=>{const words=clean(s).split(" ");let n=1,x=0;const sp=size*cw;for(const wd of words){const ww=wd.length*sp;if(x&&x+sp+ww>w){n++;x=ww}else x+=(x?sp:0)+ww}return n};
const fitType=(s,w,h,cw,max,min,lh=1.08,maxL=3)=>{for(let z=max;z>=min;z-=1){const n=lines(s,z,w,cw);if(n<=maxL&&n*z*lh<=h)return {z,n}}return {z:min,n:lines(s,min,w,cw)}};

/* grain: real noise texture (svg turbulence), fine fibre plus sparse speckle */
const grain=(a,light,freq,sparse)=>{const c=light?"1 ":"0.22 ",k=sparse?(9*a).toFixed(3):(1.4*a).toFixed(3),o=sparse?(-5.6*a).toFixed(3):(-.35*a).toFixed(3);
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${sparse?7:3}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} ${k} 0 0 0 ${o}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url(&quot;data:image/svg+xml,${encodeURIComponent(svg)}&quot;)`};
/* a real photo (still or poster); posters sit contained over a blurred copy of themselves */
function photo(src,w,h,o){
  o=o||{};const f=o.filter||"none";
  if(!src)return `<div style="width:${w}px;height:${h}px;background:linear-gradient(160deg,#333,#111)"></div>`;
  const inner=o.poster
    ?`<img src="${src}" alt="" style="position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(14px) brightness(.55) ${f}">
      <img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:${f}">`
    :`<img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${o.pos||"50% 40%"};filter:${f}">`;
  const dots=o.halftone?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.5) 28%,transparent 32%) 0 0/3px 3px;mix-blend-mode:multiply;opacity:.14"></div>`:"";
  return `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;border-radius:${o.radius||0}px;background:#111">${inner}${dots}<div style="position:absolute;inset:0;box-shadow:inset 0 0 ${o.vig||30}px rgba(0,0,0,.25)"></div></div>`;
}


/* ---------- era: fascia, wall, frame, type ---------- */
const ERA={
 "1930s-40s":{disp:"DM Serif Display",dw:"",dcw:.56,up:true,body:"Source Serif 4",bcw:.52,fascia:"#e9dfc4",fink:"#1e3b2a",wall:"#c9b48c",wallK:"weather",frame:"#5a3a1e",photo:"sepia(.32) contrast(1.05)",est:"EST.",kick:"HOTEL, ACCOMMODATION AND COUNTER MEALS"},
 "1950s":{disp:"Ranchers",dw:"",dcw:.56,up:false,body:"Karla",bcw:.52,fascia:"#8f1f1c",fink:"#f4e6c4",wall:"#d9cba6",wallK:"weather",frame:"#6b4422",photo:"sepia(.14) saturate(.98)",est:"Since",kick:"COUNTER MEALS AND COLD DRINKS"},
 "1960s":{disp:"Poller One",dw:"",dcw:.7,up:true,body:"Cabin",bcw:.52,fascia:"#d9a52b",fink:"#2a1d0e",wall:"#e8e0cd",wallK:"brick",frame:"#4a3018",photo:"saturate(1.1) contrast(1.03)",est:"Since",kick:"COUNTER MEALS DAILY"},
 "1970s":{disp:"Sansita",dw:"900 ",dcw:.56,up:false,body:"Cabin",bcw:.52,fascia:"#6b3a1a",fink:"#f5c66b",wall:"#b98a55",wallK:"panel",frame:"#3a2210",photo:"sepia(.24) saturate(1.1) contrast(.97)",est:"Est.",kick:"BISTRO AND COUNTER MEALS"},
 "1980s":{disp:"Kanit",dw:"italic 800 ",dcw:.6,up:true,body:"Barlow",bcw:.5,fascia:"#13294b",fink:"#f2c230",wall:"#d7d2c6",wallK:"brick",frame:"#2a2a2a",photo:"contrast(1.08) saturate(1.2)",est:"Est.",kick:"BISTRO, BOTTLESHOP, COUNTER MEALS"},
 "1990s":{disp:"Saira Extra Condensed",dw:"800 ",dcw:.42,up:true,body:"Barlow",bcw:.5,fascia:"#1d5a3a",fink:"#f6f1e3",wall:"#efe7d6",wallK:"weather",frame:"#40301e",photo:"contrast(1.05) saturate(1.08)",est:"Est.",kick:"COUNTER MEALS 7 DAYS"},
 "2000s":{disp:"Sofia Sans Extra Condensed",dw:"800 ",dcw:.42,up:true,body:"Work Sans",bcw:.55,fascia:"#161616",fink:"#f3f0e8",wall:"#e7e3da",wallK:"render",frame:"#1d1d1d",photo:"contrast(1.06) saturate(1.1)",est:"Est.",kick:"BISTRO AND COUNTER MEALS"},
 "modern":{disp:"Schibsted Grotesk",dw:"900 ",dcw:.6,up:false,body:"Work Sans",bcw:.55,fascia:"#f4f1ea",fink:"#151515",wall:"#ebe6dc",wallK:"render",frame:"#a77b4f",photo:"saturate(1.05)",est:"Est.",kick:"COUNTER MEALS"}
};
const TONE={
 gritty:{wear:.85,smudge:.8,tilt:-2,photo:"contrast(1.15) saturate(.86)",kick:"Locals and blow ins",raffle:"Meat tray raffle, Friday",close:"No boots on the bar. Cash preferred."},
 glossy:{wear:.08,smudge:.15,tilt:0,photo:"saturate(1.1) brightness(1.03)",kick:"Fine country dining",raffle:"Members draw, Friday",close:"Bookings taken at the front bar."},
 warm:{wear:.4,smudge:.45,tilt:-1.4,photo:"sepia(.08) saturate(1.06)",kick:"Come in out of the heat",raffle:"Meat tray raffle, Friday",close:"Kids and dogs welcome on the verandah."},
 eerie:{wear:.55,smudge:.6,tilt:1.6,photo:"saturate(.78) contrast(1.12)",kick:"Last stop for a long way",raffle:"Raffle drawn at dark",close:"Don't go wandering after closing."},
 playful:{wear:.25,smudge:.35,tilt:-3,photo:"saturate(1.2) brightness(1.04)",kick:"Trivia every Wednesday",raffle:"Chook raffle, Friday",close:"Spot prize for the worst joke."},
 grand:{wear:.15,smudge:.2,tilt:0,photo:"contrast(1.06)",kick:"The grandest pub in the district",raffle:"Members draw, Saturday",close:"Dining room open from six."},
 tender:{wear:.3,smudge:.35,tilt:-1,photo:"brightness(1.04) saturate(.95)",kick:"Always a seat for you",raffle:"Hospital fund raffle",close:"Raising money for the local school."},
 tense:{wear:.5,smudge:.5,tilt:1,photo:"contrast(1.16)",kick:"Strangers served, watched",raffle:"Raffle drawn at nine sharp",close:"Phone at the end of the bar. Use it."},
 scrappy:{wear:.9,smudge:.85,tilt:-3.5,photo:"contrast(1.1)",kick:"Kitchen open till the cook leaves",raffle:"Meat tray raffle, maybe Friday",close:"Pay at the bar. Tab on the wall."}
};
const SEC={s:"Starters",m:"Counter Meals",w:"Puddings",d:"From the Bar"};

function wallBg(E,T){
  const w=T.wear,L=[`radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(40,25,10,${.15+.3*w}) 100%)`,grain(.1+.14*w,false,.8,false),grain(.12+.2*w,false,.5,true)];
  if(E.wallK==="weather")L.push(`repeating-linear-gradient(180deg,rgba(255,255,255,.18) 0 2px,transparent 2px 30px,rgba(0,0,0,.14) 30px 34px)`);
  if(E.wallK==="brick")L.push(`repeating-linear-gradient(180deg,transparent 0 30px,rgba(0,0,0,.12) 30px 33px)`,`repeating-linear-gradient(90deg,transparent 0 64px,rgba(0,0,0,.08) 64px 67px)`);
  if(E.wallK==="panel")L.push(`repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 96px),repeating-linear-gradient(90deg,rgba(0,0,0,.035) 0 1px,transparent 1px 7px)`);
  if(E.wallK==="render")L.push(`linear-gradient(170deg,rgba(255,255,255,.12),transparent 50%)`);
  return L.join(",")+`,${E.wall}`;
}
/* blackboard: slate with chalk dust and wiped smears, timber frame */
function boardBg(T){
  const s=T.smudge;
  return [`radial-gradient(ellipse 60% 30% at 30% 25%,rgba(255,255,255,${.04+.07*s}),transparent 70%)`,`radial-gradient(ellipse 50% 25% at 70% 70%,rgba(255,255,255,${.03+.06*s}),transparent 70%)`,
    `linear-gradient(100deg,transparent 20%,rgba(255,255,255,${.02+.04*s}) 35%,transparent 50%)`,grain(.18+.1*s,true,.7,false),grain(.12+.12*s,true,.45,true),
    `radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.35) 100%)`,"#1f2623"].join(",");
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),C=s=>fam?dry(clean(s)):clean(s);
  const year=String(f.year||"").slice(0,4)||"1999",yy=year.slice(-2);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature");
  const venue=C(fl.venue)||"The Royal Hotel";
  const sign=C(fl.sign)||"";
  const note={text:C(fl.note&&fl.note.text)||sentence(f.T)||"Pull up a stool. Kitchen's open and the specials are on the board.",by:C(fl.note&&fl.note.by)||"The Publican"};
  const winks=(fl.winks||[]).map(C).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?{title:C(fl.prop.title),lines:(fl.prop.lines||[]).map(C).filter(Boolean).slice(0,2)}:{title:fam?"Friday Raffle":T.raffle.replace(/,.*$/,""),lines:["Drawn at the front bar","Must be present to win"]};
  const num=String(fl.number||"").replace(/\D/g,"")||year;
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id])||null;
  const img=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");
  const stills=ctx.stills||[];
  const PM=!!poster; /* poster mode: the whole poster is the hero, the first still is only the fallback */
  const hero=PM?{src:img(poster,"w780"),poster:true}:{src:img(stills[0],"w1280"),poster:false};
  const sec=Object.assign({},SEC,fam?{d:"Soft Drinks"}:{});

  const P=ctx.palette||{};
  const BOARD="#1f2623",CHALK="#f1efe6";
  let acc=rgb(P.accent)&&sat(P.accent)>.15?P.accent:"#e8b04a";
  /* chalk accent: the film accent lifted to a pastel that reads on slate */
  const CA=fit(mix(acc,"#ffffff",.25),BOARD,"#f2cf6b",5.5);
  const WA=fit(acc,E.wall,E.fink===E.fascia?"#222":"#3a2a1a",3.4);
  const DARK=rgb(P.dark)&&lum(rgb(P.dark))<.06?P.dark:"#151515";
  const disp=`'${E.disp}',sans-serif`,body=`'${E.body}',sans-serif`,sig=`'Homemade Apple',cursive`;
  const caps=(z,c,ls=.16)=>`font:800 ${z}px/1.2 ${body};letter-spacing:${ls}em;text-transform:uppercase;color:${c}`;
  const chalk=`text-shadow:0 0 1px rgba(255,255,255,.45),0 0 6px rgba(255,255,255,${.08+.08*T.smudge})`;
  const up=s=>E.up?s.toUpperCase():s;

  /* ===== verandah fascia ===== */
  const FH=150;
  const vT=fitType(up(venue),W-120,86,E.dcw*(E.up?1.12:1),78,34,1.0,2);
  /* 7 Nov: a period film (number is a story year before release, Phar Lap 1930) gets a pub that already stood then */const sy=+String((fl&&fl.number)||"").replace(/\D/g,""),estY=sy>1800&&sy<+year?String(sy-60):year;const fasciaKick=`${E.kick}, ${E.est} ${estY}`;
  const fascia=`<div style="position:absolute;left:0;top:0;width:${W}px;height:${FH}px;background:linear-gradient(180deg,rgba(255,255,255,.14),transparent 30%,rgba(0,0,0,.2)),repeating-linear-gradient(180deg,transparent 0 42px,rgba(0,0,0,.14) 42px 44px,rgba(255,255,255,.08) 44px 46px),${grain(.12+.15*T.wear,lum(rgb(E.fascia))<.2,.6,true)},${E.fascia};border-bottom:10px solid ${E.frame};box-shadow:0 6px 14px rgba(0,0,0,.35);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 60px;box-sizing:border-box;text-align:center">
      <div style="font:${E.dw}${vT.z}px/1.0 ${disp};color:${E.fink};letter-spacing:${E.up?".03em":"0"};text-shadow:0 2px 0 ${rgba("#000",.18)}">${esc(up(venue))}</div>
      <div style="${caps(17,E.fink,.22)};margin-top:10px;opacity:.9">${esc(fasciaKick)}</div></div>`;
  /* ===== the poster: the main picture, about 37 percent of the face, whole at 2:3, pinned straight to the wall ===== */
  const PX=24,PY=FH+26,PIW=590,PIH=885,PB=8,PFW=PIW+2*PB,PFH=PIH+2*PB;
  const photoHtml=PM?`<div style="position:absolute;left:${PX}px;top:${PY}px;width:${PFW}px;height:${PFH}px;box-sizing:border-box;border:${PB}px solid #fbf8f0;background:#fbf8f0;box-shadow:0 8px 22px rgba(0,0,0,.5);transform:rotate(${(T.tilt*.3).toFixed(2)}deg)"><img src="${hero.src}" crossorigin="anonymous" alt="" style="display:block;width:100%;height:100%;object-fit:contain">
        <div style="position:absolute;left:50%;top:-${PB+6}px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff8,transparent 45%),${WA};box-shadow:0 2px 3px rgba(0,0,0,.5)"></div></div>`
    :`<div style="position:absolute;left:${PX}px;top:${PY}px;width:${PFW}px;height:${PFH}px;box-shadow:0 8px 22px rgba(0,0,0,.5)">${photo(hero.src,PFW,PFH,{filter:`${E.photo} ${T.photo}`,poster:false,pos:"50% 40%",vig:70})}</div>`;
  const ZY=PY+PFH+22; /* strip under the poster: tag, then the film logo */
  let logoHtml;const LG=ctx.logo;
  if(LG&&LG[0]&&LG[1]&&LG[2]){
    const a=LG[1]/LG[2];let lw=Math.min(PFW-44,104*a),lh=lw/a;if(lh>104){lh=104;lw=lh*a}
    logoHtml=`<div style="position:absolute;left:${PX}px;top:${ZY+38}px;padding:17px 22px;background:${rgba(DARK,.82)};box-shadow:0 4px 16px rgba(0,0,0,.35)"><img src="${img(LG[0],"w500")}" alt="${esc(title)}" style="display:block;width:${Math.round(lw)}px;height:${Math.round(lh)}px;object-fit:contain;filter:drop-shadow(0 0 1.5px rgba(255,255,255,.55))"></div>`;
  }else{
    const tT=fitType(title,PFW-44,104,E.dcw,56,26,1.05,2);
    logoHtml=`<div style="position:absolute;left:${PX}px;top:${ZY+38}px;max-width:${PFW}px;box-sizing:border-box;padding:17px 22px;background:${rgba(DARK,.82)};font:${E.dw}${tT.z}px/1.05 ${disp};color:#ffffff">${esc(title)}</div>`;
  }
  const capTxt=PM?`Now showing, ${year}`:sign&&sign.toLowerCase()!==venue.toLowerCase()?sign:`${venue}, from the verandah`;
  const capHtml=`<div style="position:absolute;left:${PX}px;top:${ZY}px;max-width:${PFW}px;background:${rgba(DARK,.8)};padding:7px 14px;${caps(15,"#ffffff",.14)}">${esc(trunc(capTxt,46))}</div>`;

  /* ===== blackboard ===== */
  const BX=PX+PFW+22,BW=W-24-BX,BY=PY,FR=18,BH=640,NB=H-74;
  const IX=BX+FR+20,IW=BW-2*FR-40,IY=BY+FR+16,IH=BH-2*FR-32;
  const head=`<div><div style="font:${E.dw}44px/1 ${disp};color:${CHALK};${chalk}">${esc(up("Specials"))}</div><div style="${caps(15,CA,.16)};margin-top:6px;${chalk}">${fam?"Counter meals 12 to 2 and 5 to 8":"Counter meals 12 to 2 and 6 to 8"}</div></div>`;
  const headH=76;
  const cue=sentence(C(f.P));
  const cT=fitType(cue,IW,72,E.bcw,19,15,1.3,3);
  const footH=cue?(20+6+cT.n*cT.z*1.3+6):0;
  let MH=IH-headH-footH-16;
  const m=ctx.menu||{};
  const numCents=(pv,n)=>{const d=String(pv).match(/^(\D*)(\d+)\.(\d\d)$/),c=String(n||"").replace(/\D/g,"");return d&&c.length>=2&&!/^(18|19|20)\d\d$/.test(c)&&+c.slice(-2)%5===0?d[1]+d[2]+"."+c.slice(-2):pv};/* review 12: on a shared card the film number only sets the cents of the first main, and only on a price ending (5 or 0), as diner does; it never prices a whole dish (Finding Nemo's 42.00) */
const numPrice=(!String(fl.number||"").replace(/\D/g,"")||/^(18|19|20)\d\d$/.test(num))?null:num.length>=3&&num.length<=4?`${+num.slice(0,-2)}.${num.slice(-2)}`:num.length<=2?`${+num}.00`:null;
  let courses=["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(i=>i&&i.n).slice(0,4).map((it,j)=>({n:C(it.n),note:C(it.note),p:(k==="m"&&j===0)?numCents(periodPrice([4.5,8.95,3.95,2.2][["s","m","w","d"].indexOf(k)]*(1+j*.12),f.year,[...String(it.n)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7)),num):periodPrice([4.5,8.95,3.95,2.2][["s","m","w","d"].indexOf(k)]*(1+j*.12),f.year,[...String(it.n)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7))}))})).filter(c=>c.items.length);
  const total=courses.reduce((a,c)=>a+c.items.length,0);
  const cols=1,GAP=24,colW=cols===2?(IW-GAP)/2:IW;
  let splits=cols===2?courses.slice(1).map((_,i)=>[courses.slice(0,i+1),courses.slice(i+1)]):[[courses]];
  let colsArr=splits[0];
  const dcw=E.bcw+.05;
  const colHtml=(cs,FS)=>cs.map((c,i)=>`<div style="margin-top:${i?FS.G+6:0}px">
      <div style="${caps(FS.S,CA,.12)};line-height:1.15;margin-bottom:6px;${chalk}">${esc(sec[c.k])}</div>
      ${c.items.map(it=>`<div style="margin-bottom:${FS.G}px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
        <span style="font:700 ${FS.D}px/1.12 ${body};color:${CHALK};${chalk}">${esc(it.n)}</span><span style="font:${E.dw}${Math.round(FS.D*1.08)}px/1 ${disp};color:${CA};white-space:nowrap;${chalk}">$${esc(it.p)}</span></div>
        ${FS.nl&&it.note?`<div style="font:500 ${FS.N}px/1.3 ${body};color:${rgba(CHALK,.78)};margin-top:2px;${chalk}">${esc(sentence(clip(it.note,Math.floor(FS.nl*colW/(FS.N*E.bcw)*.95))))}</div>`:""}</div>`).join("")}</div>`).join("");
  const est=(cs,FS)=>{let t=0;cs.forEach((c,i)=>{t+=FS.S*1.15+6+(i?FS.G+6:0);c.items.forEach(it=>{t+=lines(it.n,FS.D,colW-FS.D*2.7,dcw)*FS.D*1.12;if(FS.nl&&it.note)t+=Math.min(FS.nl,lines(it.note,FS.N,colW,E.bcw))*FS.N*1.3+2;t+=FS.G})});return t};
  const measure=(cs,FS)=>{const h=domH(colHtml(cs,FS),colW);return h==null?est(cs,FS):h*1.04};
  let FS=null;
  /* the film's notes come first: try every size with two-line then one-line notes before any size without them */
  outer:for(const nl of [2,1,0])for(let s=1.07;s>=(nl?.6:.55);s-=.05){
    const base={D:Math.max(17,Math.round(28*s)),N:Math.max(15,Math.round(21*s)),S:Math.max(19,Math.round(27*s)),G:Math.max(4,Math.round(16*s))};
    {const FSx=Object.assign({},base,{nl});
      let best=null;for(const sp of splits){const t=Math.max(...sp.map(cs=>measure(cs,FSx)));if(!best||t<best.t)best={t,sp}}if(best.t<=MH){FS=Object.assign(FSx,{t:best.t});colsArr=best.sp;break outer}}
  }
  /* rescue for very long menus: give the cue's room to the menu, then smallest legal type, then fewer items per course */
  let dropCue=false;
  if(!FS){dropCue=!!cue;MH+=footH;
    for(const cap of [4,3,2]){courses=courses.map(c=>Object.assign({},c,{items:c.items.slice(0,cap)}));
      splits=cols===2?courses.slice(1).map((_,i)=>[courses.slice(0,i+1),courses.slice(i+1)]):[[courses]];colsArr=splits[0];
      for(const D of [17,16,15]){const FSx={D,N:15,S:D+1,G:3,nl:0};let best=null;for(const sp of splits){const t=Math.max(...sp.map(cs=>measure(cs,FSx)));if(!best||t<best.t)best={t,sp}}
        if(best.t<=MH){FS=Object.assign(FSx,{t:best.t});colsArr=best.sp;break}}
      if(FS)break}
    FS=FS||{D:15,N:15,S:16,G:3,nl:0,t:MH}}

  const spare=MH-FS.t,aw=winks.slice(1,4);
  const also=spare>150&&aw.length?aw.slice(0,Math.max(1,Math.min(aw.length,Math.floor((spare-64)/32)))):[];
  const board=`<div style="position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;box-sizing:border-box;border:${FR}px solid ${E.frame};background:${boardBg(T)};box-shadow:0 8px 20px rgba(0,0,0,.4),inset 0 0 0 2px rgba(0,0,0,.4);border-image:none">
      <div style="position:absolute;inset:-${FR}px;border:${FR}px solid transparent;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,rgba(0,0,0,.25)) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) padding-box exclude,linear-gradient(#000 0 0);pointer-events:none"></div></div>
    <div style="position:absolute;left:${IX}px;top:${IY}px;width:${IW}px;height:${IH}px;display:flex;flex-direction:column">
      <div>${head}</div>
      <div style="margin-top:16px;height:${Math.floor(MH)}px;display:flex;flex-direction:column">
        <div style="display:flex;gap:${GAP}px">${colsArr.map(cs=>`<div style="width:${colW}px">${colHtml(cs,FS)}</div>`).join("")}</div>
        ${also.length?`<div style="margin-top:auto;margin-bottom:8px;border-top:2px solid ${rgba(CHALK,.4)};padding-top:10px"><div style="${caps(15,CA,.2)};margin-bottom:4px;${chalk}">Overheard at the bar</div>${also.map(w=>`<div style="font:500 18px/1.3 ${body};color:${CHALK};margin-top:3px;${chalk}">${esc(sentence(trunc(w,56)))}</div>`).join("")}</div>`:""}
      </div>
      ${cue&&!dropCue?`<div style="margin-top:auto;border-top:2px solid ${rgba(CHALK,.4)};padding-top:8px"><div style="${caps(15,CA,.2)};${chalk}">From the kitchen</div><div style="font:500 ${cT.z}px/1.3 ${body};color:${CHALK};margin-top:4px;${chalk}">${esc(cue)}</div></div>`:""}
    </div>`;

  /* ===== right of the board: raffle ticket and pinned note ===== */
  const RX=BX,RW=BW;
  const rT=fitType(prop.title,RW-80,64,.6,30,18,1.05,2);
  const raffle=`<div style="position:relative;flex:none;width:${RW}px;transform:rotate(${(T.tilt*.5).toFixed(2)}deg);background:linear-gradient(165deg,rgba(255,255,255,.35),transparent 55%),${mix("#f7e7c2",acc,.22)};box-shadow:0 5px 14px rgba(0,0,0,.3);display:flex;color:#211a12">
      <div style="width:62px;border-right:2px dashed rgba(33,26,18,.45);display:flex;align-items:center;justify-content:center"><div style="transform:rotate(-90deg);white-space:nowrap;font:800 18px/1 ${body};letter-spacing:.1em">No. ${esc(num.padStart(4,"0"))}</div></div>
      <div style="flex:1;padding:14px 16px 14px;min-width:0">
        <div style="${caps(15,"#4a3a24",.16)}">${esc(fl.prop&&fl.prop.title?"Keep this":fam?"Friday raffle":T.raffle)}</div>
        <div style="font:${E.dw}${rT.z}px/1.05 ${disp};color:#1b150e;margin:6px 0">${esc(up(prop.title))}</div>
        ${prop.lines.map(l=>`<div style="font:500 16px/1.3 ${body};color:#3a2f22">${esc(trunc(l,28))}</div>`).join("")}
        </div></div>`;
  const nh=NB-(BY+BH+20)-150-20;
  const nT=fitType(note.text,RW-44,nh-90,E.bcw,21,16,1.36,9);
  const noteHtml=`<div style="position:relative;flex:1;margin-top:22px;width:${RW}px;box-sizing:border-box;padding:20px 22px;transform:rotate(${(-T.tilt*.5).toFixed(2)}deg);background:linear-gradient(175deg,#fffdf5,#f1e9d6);box-shadow:0 6px 16px rgba(0,0,0,.3);color:#1d1913">
      <div style="position:absolute;left:50%;top:-8px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff8,transparent 45%),${WA};box-shadow:0 2px 3px rgba(0,0,0,.4)"></div>
      <div style="${caps(15,fit(WA,"#f8f2e3","#5a3a1a",3.4),.16)};margin-bottom:10px">${esc(T.kick)}</div>
      <div style="font:italic 500 ${nT.z}px/1.36 ${body};color:#1d1913">"${esc(note.text)}"</div>
      <div style="position:absolute;right:22px;bottom:18px;font:26px/1.5 ${sig};color:${fit(acc,"#f8f2e3","#1d3a6a",4)}">${esc(trunc(note.by,20))}</div></div>`;
  const fine=`${fam?"Kids welcome. ":""}${T.close} ${winks[0]?sentence(trunc(winks[0],60))+" ":""}Prices subject to change. Licence ${num}.`;
  const fT=fitType(fine,W-60,44,.5,16,14,1.3,2);
  const fineHtml=`<div style="position:absolute;left:30px;right:30px;bottom:18px;font:500 ${fT.z}px/1.3 ${body};color:${rgba("#1d1610",.82)};text-shadow:0 1px 0 rgba(255,255,255,.3)">${esc(fine)}</div>`;

  const face=`<div style="position:absolute;inset:0;background:${wallBg(E,T)}">${photoHtml}${logoHtml}${capHtml}${fascia}${board}<div style="position:absolute;left:${RX}px;top:${BY+BH+20}px;width:${RW}px;height:${NB-(BY+BH+20)}px;display:flex;flex-direction:column">${raffle}${noteHtml}</div>${fineHtml}</div>`;
  return {w:W,h:H,faces:[face]};
};
})();
