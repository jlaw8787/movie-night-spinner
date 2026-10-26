/* Format: prom. A school dance or party night card, two faces 600x900.
   Front: gym banner with the venue sign, big hero still with the film logo on a panel, admit one ticket, a note with a script signature.
   Back: photo booth strip of stills down the left, the menu, showtime cue and fine print on the right.
   Era sets type pairing, paper stock, print process, banner shape, photo frame and booth strip tint.
   Tone sets wear, tilt, contrast, photo mood and the copy voice.
   Fonts (fmt-prom in wip/print/FONTS.md): Chonburi, Leckerli One, Chicle, Sonsie One, Russo One, Bowlby One, Permanent Marker, Unbounded.
   Bodies Libre Baskerville, Karla, Josefin Sans, Cabin, Montserrat, Archivo, Archivo Narrow, Manrope; signatures Pinyon Script, Caveat. */
(function(){
const W=600,H=900,ID="prom";
if(!document.getElementById("fmt-prom-fonts")){
  const l=document.createElement("link");l.id="fmt-prom-fonts";l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Chonburi&family=Leckerli+One&family=Chicle&family=Sonsie+One&family=Russo+One&family=Bowlby+One&family=Permanent+Marker&family=Unbounded:wght@800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Karla:ital,wght@0,500;0,800;1,500&family=Josefin+Sans:ital,wght@0,500;0,700;1,500&family=Cabin:ital,wght@0,500;0,700;1,500&family=Montserrat:ital,wght@0,500;0,800;1,500&family=Archivo:ital,wght@0,500;0,800;1,500&family=Archivo+Narrow:ital,wght@0,500;0,700;1,500&family=Manrope:wght@500;800&family=Pinyon+Script&family=Caveat:wght@700&display=swap";
  document.head.appendChild(l);
}

/* ---------- text safety ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[‒-―−]\s*/g,", ").replace(/(\w)-(?=\w)/g,"$1 ").replace(/\s+-+\s+/g,", ").replace(/\s+/g," ").trim();
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"']$/.test(s)?s:s+"."};
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
const DRY=[[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beers?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|schnapps)\b/gi,"syrup"]];
const dry=s=>DRY.reduce((a,[r,t])=>a.replace(r,t),s);
const trunc=(s,n)=>{s=clean(s);if(s.length<=n)return s;const c=s.slice(0,n);const i=c.lastIndexOf(" ");return (i>n*.5?c.slice(0,i):c).replace(/[,;:]$/,"")};

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

/* ---------- era: type pairing, paper, process, frames ---------- */
const ERA={
 "1930s-40s":{disp:"Chonburi",dcw:.66,body:"Libre Baskerville",bcw:.56,sig:"Pinyon Script",paper:"#efe3c6",ink:"#2b2016",band:"#6e1c28",proc:"letterpress",kick:"FORMAL DINNER DANCE",photo:"sepia(.28) contrast(1.04)",booth:"grayscale(1) sepia(.45) contrast(1.05)",frame:"deckle",radius:0,menu:"Bill of Fare"},
 "1950s":{disp:"Leckerli One",dcw:.56,body:"Karla",bcw:.52,sig:"Pinyon Script",paper:"#f8e3e1",ink:"#2c2230",band:"#c43a52",proc:"letterpress",kick:"SOCK HOP",photo:"sepia(.12) saturate(.95)",booth:"grayscale(1) sepia(.25)",frame:"round",radius:14,menu:"Snack Bar"},
 "1960s":{disp:"Chicle",dcw:.45,body:"Josefin Sans",bcw:.52,sig:"Caveat",paper:"#dcefe4",ink:"#173a31",band:"#1f6b5a",proc:"offset",kick:"SPRING FORMAL",photo:"saturate(1.12) contrast(1.02)",booth:"grayscale(1) contrast(1.1)",frame:"white",radius:4,menu:"Refreshments"},
 "1970s":{disp:"Sonsie One",dcw:.82,body:"Cabin",bcw:.52,sig:"Caveat",paper:"#f2d7a0",ink:"#46270f",band:"#a8461a",proc:"offset",kick:"SENIOR PROM",photo:"sepia(.25) saturate(1.1) contrast(.97)",booth:"grayscale(1) sepia(.3)",frame:"round",radius:22,menu:"Buffet"},
 "1980s":{disp:"Russo One",dcw:.64,body:"Montserrat",bcw:.58,sig:"Caveat",paper:"#16111c",ink:"#f6eef8",band:"#2a1838",proc:"glossy",kick:"PROM NIGHT",photo:"contrast(1.08) saturate(1.22)",booth:"saturate(1.15) contrast(1.05)",frame:"neon",radius:0,menu:"Dinner"},
 "1990s":{disp:"Bowlby One",dcw:.72,body:"Archivo",bcw:.55,sig:"Caveat",paper:"#fbfaf5",ink:"#18181b",band:"#1d2a6b",proc:"laser",kick:"SPRING FLING",photo:"contrast(1.05) saturate(1.08)",booth:"grayscale(1) contrast(1.15)",frame:"thin",radius:0,menu:"Food"},
 "2000s":{disp:"Permanent Marker",dcw:.62,body:"Archivo Narrow",bcw:.47,sig:"Caveat",paper:"#f3f3ee",ink:"#121212",band:"#111111",proc:"photocopy",kick:"THE PARTY",photo:"contrast(1.12) saturate(1.04)",booth:"grayscale(1) contrast(1.35) brightness(1.08)",frame:"copy",radius:0,menu:"The Spread"},
 "modern":{disp:"Unbounded",dcw:.74,body:"Manrope",bcw:.56,sig:"Caveat",paper:"#ffffff",ink:"#141418",band:"#141418",proc:"clean",kick:"FORMAL",photo:"saturate(1.05)",booth:"saturate(1.05)",frame:"none",radius:18,menu:"Menu"}
};
/* ---------- tone: wear, tilt, mood, voice ---------- */
const TONE={
 gritty:{wear:.8,tilt:-2.2,photo:"contrast(1.14) saturate(.86)",kick:"NO REFUNDS AT THE DOOR",ticket:"No re entry",close:"Security on the door all night."},
 glossy:{wear:.08,tilt:0,photo:"saturate(1.1) brightness(1.03)",kick:"AN EVENING OF ELEGANCE",ticket:"Black tie",close:"Photographs available from the front office."},
 warm:{wear:.35,tilt:-1.2,photo:"sepia(.08) saturate(1.05)",kick:"COME AS YOU ARE",ticket:"Bring a friend",close:"Thank you to every parent who baked."},
 eerie:{wear:.5,tilt:1.4,photo:"saturate(.8) contrast(1.1)",kick:"A NIGHT NO ONE WILL FORGET",ticket:"Doors lock at midnight",close:"Please stay in the gym after dark."},
 playful:{wear:.22,tilt:-3,photo:"saturate(1.2) brightness(1.03)",kick:"WEAR YOUR DANCING SHOES",ticket:"Dancing compulsory",close:"Best moves win the spot prize."},
 grand:{wear:.14,tilt:0,photo:"contrast(1.06)",kick:"THE EVENT OF THE YEAR",ticket:"Formal dress",close:"The committee thanks you for your attendance."},
 tender:{wear:.3,tilt:-1,photo:"brightness(1.04) saturate(.95)",kick:"SAVE ME THE LAST DANCE",ticket:"Keep this one",close:"Slow dance at eleven."},
 tense:{wear:.45,tilt:1,photo:"contrast(1.16)",kick:"DOORS CLOSE AT MIDNIGHT",ticket:"Chaperones present",close:"No one leaves before the last song."},
 scrappy:{wear:.9,tilt:-3.5,photo:"contrast(1.12)",kick:"PARENTS NOT INVITED",ticket:"Tell no one",close:"If the cops come, you were never here."}
};
const SEC={s:"Before the Dance",m:"The Main Event",w:"Last Dance Sweets",d:"The Punch Bowl"};

/* grain: real noise texture (svg turbulence), fine fibre plus sparse speckle */
const grain=(a,light,freq,sparse)=>{const c=light?"1 ":"0.22 ",k=sparse?(9*a).toFixed(3):(1.4*a).toFixed(3),o=sparse?(-5.6*a).toFixed(3):(-.35*a).toFixed(3);
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${sparse?7:3}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} ${k} 0 0 0 ${o}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url(&quot;data:image/svg+xml,${encodeURIComponent(svg)}&quot;)`};
/* paper: base stock, vignette and grain scaled by wear, plus the print process */
function paper(E,T){
  const dk=lum(rgb(E.paper))<.2,w=T.wear;
  const L=[`radial-gradient(ellipse at 50% 45%,transparent 55%,${dk?"rgba(0,0,0,"+(.25+.35*w)+")":"rgba(90,60,25,"+(.08+.26*w)+")"} 100%)`,
    grain(.1+.12*w,dk,.9,false),grain(.12+.2*w,dk,.55,true)];
  if(E.proc==="letterpress")L.push(`repeating-linear-gradient(90deg,rgba(80,60,30,.022) 0 1px,transparent 1px 4px)`);
  if(E.proc==="glossy")L.push(`linear-gradient(128deg,rgba(255,255,255,.09),transparent 38%,rgba(255,255,255,.05) 62%,transparent 80%)`);
  if(E.proc==="photocopy")L.push(`linear-gradient(90deg,rgba(0,0,0,${.1+.12*w}),transparent 5%,transparent 95%,rgba(0,0,0,${.1+.12*w}))`,grain(.2+.15*w,false,1.4,true));
  if(E.proc==="offset")L.push(`linear-gradient(180deg,rgba(255,255,255,.12),transparent 30%,rgba(0,0,0,.03))`);
  if(E.proc==="clean")L.push(`linear-gradient(160deg,rgba(0,0,0,.015),transparent)`);
  return L.join(",")+`,${E.paper}`;
}

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

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),C=s=>fam?dry(clean(s)):clean(s);
  const year=String(f.year||"").slice(0,4)||"1999",yy=year.slice(-2);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature");
  const venue=C(fl.venue)||"The School Gym";
  const sign=C(fl.sign)||venue;
  const note={text:C(fl.note&&fl.note.text)||sentence(f.T)||"Thanks for coming. Eat up, then everyone on the dance floor.",by:C(fl.note&&fl.note.by)||"The Dance Committee"};
  const winks=(fl.winks||[]).map(C).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?{title:C(fl.prop.title),lines:(fl.prop.lines||[]).map(C).filter(Boolean).slice(0,2)}:{title:"Admit One",lines:["Doors open at seven",T.ticket]};
  const num=String(fl.number||"").replace(/\D/g,"")||year;
  const poster=ctx.poster||(typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id])||null;
  const img=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");
  const stills=(ctx.stills||[]).slice();
  const hero=stills[0]?{src:img(stills[0],"w1280"),poster:false}:{src:img(poster,"w780"),poster:true};
  const booth=[];for(let i=0;i<4;i++){const s=stills.length>1?stills[(i+1)%stills.length]:null;booth.push(s?{src:img(s,"w780"),poster:false}:{src:img(poster,"w500"),poster:true})}

  /* colour: film palette for accents, checked against this era's paper */
  const P=ctx.palette||{},dkPaper=lum(rgb(E.paper))<.2;
  let acc=rgb(P.accent)&&sat(P.accent)>.18?P.accent:E.band;
  const ACC=fit(acc,E.paper,E.ink,3.2);
  let band=rgb(P.accent)?P.accent:E.band;band=dkPaper?fit(band,"#ffffff","#ffffff",1)&&mix(band,"#000000",.35):band;
  const bandText=dkPaper?"#ffffff":E.paper;
  band=fit(band,bandText,E.band,4.6);
  const DARK=rgb(P.dark)&&lum(rgb(P.dark))<.06?P.dark:"#141414";
  const ink=E.ink,soft=rgba(ink,.72);
  const bg=paper(E,T);
  const photoF=`${E.photo} ${T.photo}`;
  const disp=`'${E.disp}',sans-serif`,body=`'${E.body}',sans-serif`,sig=`'${E.sig}',cursive`;
  const caps=(z,c,ls=.18)=>`font:800 ${z}px/1.2 ${body};letter-spacing:${ls}em;text-transform:uppercase;color:${c}`;
  const fp=E.proc==="glossy"?`text-shadow:0 0 14px ${rgba(ACC,.55)}`:E.proc==="letterpress"?`text-shadow:0 0 .7px ${rgba(ink,.6)}`:"";

  /* ===== FRONT ===== */
  const BH=172,SY=BH,SH=440;
  /* gym banner: shape follows the era */
  const kick=`${E.kick}, CLASS OF ${year}`;
  const sT=fitType(sign,W-96,92,E.dcw,56,24,1.04,2);
  let banner;
  const signHtml=`<div style="${caps(18,E.proc==="letterpress"||E.proc==="offset"?mix(bandText,band,.15):ACC==band?bandText:bandText,.22)};text-align:center">${esc(kick)}</div>
     <div style="font:${E.disp==="Unbounded"?"800 ":""}${sT.z}px/1.04 ${disp};color:${bandText};text-align:center;margin-top:8px;${E.proc==="glossy"?`text-shadow:0 0 18px ${rgba(ACC,.7)},0 0 2px #fff`:""}">${esc(sign)}</div>`;
  if(E.frame==="deckle"){ /* felt pennant banner, double rule, letterpress */
    banner=`<div style="position:absolute;left:18px;top:18px;width:${W-36}px;height:${BH-30}px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18)),repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 5px),${band};border:3px double ${E.paper};outline:2px solid ${band};box-shadow:0 3px 8px rgba(0,0,0,.25);display:flex;flex-direction:column;justify-content:center;padding:0 28px;box-sizing:border-box">${signHtml}</div>`;
  }else if(E.proc==="photocopy"){ /* marker band on copy paper, a bit crooked */
    banner=`<div style="position:absolute;left:10px;top:20px;width:${W-20}px;height:${BH-36}px;transform:rotate(${T.tilt*.4}deg);background:linear-gradient(175deg,rgba(255,255,255,.07),rgba(0,0,0,.1)),${band};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box;box-shadow:0 0 0 2px ${rgba(band,.4)}">${signHtml}</div>`;
  }else if(E.proc==="glossy"){ /* foil banner with a sheen */
    banner=`<div style="position:absolute;left:0;top:0;width:${W}px;height:${BH}px;background:linear-gradient(170deg,rgba(255,255,255,.18),transparent 45%,rgba(255,255,255,.08) 70%,transparent),${band};border-bottom:3px solid ${ACC};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box">${signHtml}</div>`;
  }else{ /* crepe paper banner hung across the gym, swag edge from the photo border */
    banner=`<div style="position:absolute;left:0;top:0;width:${W}px;height:${BH}px;background:linear-gradient(180deg,rgba(255,255,255,.14),transparent 40%,rgba(0,0,0,.14)),repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 3px,rgba(0,0,0,.05) 3px 7px),${band};border-radius:${E.radius?`0 0 ${E.radius*2}px ${E.radius*2}px`:"0"};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box">${signHtml}</div>`;
  }
  /* hero still with era frame */
  const fr={deckle:`border:12px solid #f7f0dc;box-shadow:0 2px 8px rgba(0,0,0,.3)`,round:`border:9px solid #fffaf2;box-shadow:0 3px 10px rgba(0,0,0,.25)`,white:`border:8px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,.2)`,neon:`border:3px solid ${ACC};box-shadow:0 0 18px ${rgba(ACC,.6)}`,thin:`border:2px solid ${ink}`,copy:`border:3px solid #111`,none:``}[E.frame];
  const inset=E.frame==="none"||E.proc==="glossy"?0:20;
  const hw=W-inset*2,hh=SH-(inset?12:0);
  const bw={deckle:12,round:9,white:8,neon:3,thin:2,copy:3,none:0}[E.frame];
  const heroHtml=`<div style="position:absolute;left:${inset}px;top:${SY+(inset?4:0)}px;width:${hw}px;height:${hh}px;box-sizing:border-box;${fr};border-radius:${E.radius}px;overflow:hidden;${inset&&T.tilt&&E.proc!=="clean"?`transform:rotate(${(T.tilt*.25).toFixed(2)}deg)`:""}">
      ${photo(hero.src,hw-bw*2,hh-bw*2,{filter:photoF,poster:hero.poster,halftone:E.proc==="offset",radius:Math.max(0,E.radius-bw),pos:"50% 35%"})}</div>`;
  /* logo in its own colours on a dark panel with a soft light halo, or set type */
  let logoHtml;const LG=ctx.logo;
  const panelBg=rgba(DARK,.84);
  if(LG&&LG[0]&&LG[1]&&LG[2]){
    const a=LG[1]/LG[2];let lw=Math.min(300,120*a),lh=lw/a;if(lh>110){lh=110;lw=lh*a}
    logoHtml=`<div style="position:absolute;left:${inset+18}px;top:${SY+hh-lh-58}px;padding:14px 18px;background:${panelBg};border-radius:${Math.min(E.radius,10)}px;box-shadow:0 4px 14px rgba(0,0,0,.35)">
      <img src="${img(LG[0],"w500")}" alt="${esc(title)}" style="display:block;width:${Math.round(lw)}px;height:${Math.round(lh)}px;object-fit:contain;filter:drop-shadow(0 0 1.5px rgba(255,255,255,.55))"></div>`;
  }else{
    const tT=fitType(title,300,124,E.dcw,46,20,1.06,4);
    logoHtml=`<div style="position:absolute;left:${inset+18}px;top:${SY+hh-24-(tT.n*tT.z*1.06)-40}px;width:300px;padding:14px 18px;background:${panelBg};border-radius:${Math.min(E.radius,10)}px;font:${E.disp==="Unbounded"?"800 ":""}${tT.z}px/1.06 ${disp};color:#ffffff">${esc(title)}</div>`;
  }
  const cap=`<div style="position:absolute;right:${inset+14}px;top:${SY+hh-44}px;max-width:${hw-60}px;background:${rgba(DARK,.78)};padding:5px 12px;${caps(15,"#ffffff",.16)}">Now showing, ${esc(year)}</div>`;
  /* ticket prop: admit one with a perforated stub */
  const ty=SY+SH+22,tw=262,th=196;
  const pT=fitType(prop.title,tw-86,60,E.dcw,30,18,1.05,2);
  const ticket=`<div style="position:absolute;left:22px;top:${ty}px;width:${tw}px;height:${th}px;transform:rotate(${(T.tilt*.8).toFixed(2)}deg);background:linear-gradient(160deg,rgba(255,255,255,.35),transparent 50%),${dkPaper?"#f3ecd9":mix(E.paper,ACC,.12)};border:2px solid ${ACC};box-shadow:0 3px 9px rgba(0,0,0,.22);display:flex;color:#231d18">
      <div style="flex:1;padding:14px 14px 10px 16px;display:flex;flex-direction:column;gap:5px;overflow:hidden">
        <div style="${caps(15,fit(ACC,"#f3ecd9","#5a2a1a",3.2),.2)}">Admit one</div>
        <div style="font:${E.disp==="Unbounded"?"800 ":""}${pT.z}px/1.05 ${disp};color:#1e1a16">${esc(prop.title)}</div>
        ${prop.lines.map(l=>`<div style="font:500 16px/1.25 ${body};color:#3a322a">${esc(trunc(l,44))}</div>`).join("")}
        <div style="margin-top:auto;font:700 15px/1.2 ${body};color:#3a322a">${esc(T.ticket)}</div></div>
      <div style="width:58px;border-left:2px dashed ${rgba("#231d18",.45)};display:flex;align-items:center;justify-content:center">
        <div style="transform:rotate(-90deg);white-space:nowrap;font:800 17px/1 ${body};letter-spacing:.12em;color:#231d18">No. ${esc(num.padStart(4,"0"))}</div></div></div>`;
  /* note with script signature */
  const nx=306,nw=W-nx-22;
  const nT=fitType(note.text,nw-8,150,E.bcw,21,16,1.36,6);
  const noteHtml=`<div style="position:absolute;left:${nx}px;top:${ty-4}px;width:${nw}px;color:${ink}">
      <div style="${caps(15,ACC,.2)};margin-bottom:8px">${esc(T.kick)}</div>
      <div style="font:italic 500 ${nT.z}px/1.36 ${body};color:${ink}">"${esc(note.text)}"</div>
      <div style="font:${E.sig==="Caveat"?"700 ":""}${E.sig==="Caveat"?36:38}px/1.1 ${sig};color:${ACC};margin-top:6px;text-align:right">${esc(trunc(note.by,24))}</div></div>`;
  /* fine print with winks */
  let fine=`${T.close} ${winks.length?"Tonight: "+winks.slice(0,1).map(s=>trunc(s,50)).join("")+".":""}`;
  const frontFine=`<div style="position:absolute;left:24px;right:24px;bottom:16px;font:500 15px/1.3 ${body};color:${soft}">${esc(trunc(fine,96))}</div>`;
  const front=`<div style="position:absolute;inset:0;background:${bg};${fp}">${banner}${heroHtml}${logoHtml}${cap}${ticket}${noteHtml}${frontFine}</div>`;

  /* ===== BACK ===== */
  const SX=18,SW=176,STY=18,STH=H-36;
  const fh=Math.floor((STH-16-44-3*8)/4);
  const strip=`<div style="position:absolute;left:${SX}px;top:${STY}px;width:${SW}px;height:${STH}px;background:linear-gradient(180deg,#ffffff,#f1efe9);box-shadow:0 3px 10px rgba(0,0,0,.28);transform:rotate(${(T.tilt*.35).toFixed(2)}deg);padding:8px 8px 0;box-sizing:border-box">
      ${booth.map(b=>`<div style="margin-bottom:8px">${photo(b.src,SW-16,fh,{filter:`${E.booth} ${T.photo}`,poster:b.poster,pos:"50% 30%",vig:20})}</div>`).join("")}
      <div style="${caps(15,"#2a2622",.18)};text-align:center;padding-top:2px">Photo booth</div></div>`;
  const RX=SX+SW+22,RW=W-RX-20;
  /* menu courses */
  const m=ctx.menu||{};let ci=0;
  const courses=["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(i=>i&&i.n).slice(0,4)})).filter(c=>c.items.length);
  const cents=yy;
  const numPrice=num.length>=3&&num.length<=4?`${+num.slice(0,-2)}.${num.slice(-2)}`:num.length<=2?`${+num}.00`:null;
  courses.forEach((c,i)=>c.items=c.items.map((it,j)=>{const base=[6,14,7,3][["s","m","w","d"].indexOf(c.k)]+j*2;
    return {n:C(it.n),note:C(it.note),p:(c.k==="m"&&j===0&&numPrice)?numPrice:`${base}.${cents}`}}));
  /* header block */
  const hdrKick=venue.toUpperCase();
  const hk=fitType(hdrKick,RW,44,.62,17,15,1.2,2);
  const head=`<div style="${caps(hk.z,ACC,.16)}">${esc(hdrKick)}</div><div style="font:${E.disp==="Unbounded"?"800 ":""}44px/1.05 ${disp};color:${ink};margin-top:6px;${fp}">${esc(E.menu)}</div>`;
  const headH=hk.n*hk.z*1.2+6+48;
  /* cue and fine print at the foot */
  const cue=sentence(C(f.P));
  const cT=fitType(cue,RW,100,E.bcw,19,15,1.3,5);
  const fineW=winks.length>1?[winks[winks.length-1]]:[];
  const backFine=`${fineW.map(s=>trunc(s,46)).join(". ")}${fineW.length?". ":""}Prices subject to change. Form PD ${num}${num===year?"":". "+year}.`;
  const fT=fitType(backFine,RW,64,.52,15,14,1.3,4);
  const footH=(cue?20+8+cT.n*cT.z*1.3+14:0)+fT.n*fT.z*1.3;
  const MH=H-24-headH-18-footH-24;
  /* fit the menu into the space left */
  const dcw=E.bcw+.04;
  let FS=null;
  outer:for(let s=1.07;s>=.55;s-=.05){
    const D=Math.max(17,Math.round(28*s)),N=Math.max(15,Math.round(21*s)),S=Math.max(18,Math.round(26*s)),G=Math.max(4,Math.round(14*s));
    for(const nl of [2,1,0]){
      let t=0;courses.forEach((c,i)=>{t+=S*1.3+8+(i?G+4:0);c.items.forEach(it=>{t+=lines(it.n,D,RW-D*2.9,dcw)*D*1.12;if(nl&&it.note)t+=Math.min(nl,lines(it.note,N,RW,E.bcw))*N*1.3+2;t+=G})});
      if(t<=MH){FS={D,N,S,G,nl,t};break outer}
      if(s>.75)break;
    }
  }
  FS=FS||{D:17,N:15,S:18,G:4,nl:0,t:MH};
  /* spare room under a short menu becomes an Also Tonight list of winks */
  const spare=MH-FS.t,aw=winks.slice(1,4);
  const also=spare>150&&aw.length?aw.slice(0,Math.max(1,Math.min(aw.length,Math.floor((spare-60)/34)))):[];
  const barStyle={letterpress:`border-top:2px solid ${ink};border-bottom:1px solid ${ink};padding:3px 0`,offset:`background:${band};color:${bandText};padding:4px 10px;border-radius:${Math.min(E.radius,12)}px`,glossy:`border-left:4px solid ${ACC};padding-left:10px;color:${ACC}`,laser:`background:${band};color:${bandText};padding:3px 10px`,photocopy:`border-bottom:3px solid ${ink};padding-bottom:2px`,clean:`border-bottom:2px solid ${ACC};padding-bottom:4px`}[E.proc];
  const secCol={letterpress:ink,offset:bandText,glossy:ACC,laser:bandText,photocopy:ink,clean:ink}[E.proc];
  const menuHtml=courses.map((c,i)=>`<div style="margin-top:${i?FS.G+4:0}px">
      <div style="font:${E.disp==="Unbounded"?"800 ":""}${FS.S}px/1.25 ${disp};color:${secCol};${barStyle};margin-bottom:8px">${esc(SEC[c.k])}</div>
      ${c.items.map(it=>{const maxC=FS.nl?Math.floor(FS.nl*RW/(FS.N*E.bcw)*.9):0;return `<div style="margin-bottom:${FS.G}px">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:baseline"><span style="font:800 ${FS.D}px/1.12 ${body};color:${ink}">${esc(it.n)}</span><span style="font:800 ${FS.D}px/1.12 ${body};color:${ACC};white-space:nowrap">${esc(it.p)}</span></div>
        ${FS.nl&&it.note?`<div style="font:500 ${FS.N}px/1.3 ${body};color:${soft};margin-top:2px">${esc(sentence(trunc(it.note,maxC)))}</div>`:""}</div>`}).join("")}</div>`).join("");
  const right=`<div style="position:absolute;left:${RX}px;top:24px;width:${RW}px;height:${H-48}px;display:flex;flex-direction:column">
      <div>${head}</div>
      <div style="margin-top:18px;height:${Math.floor(MH)}px;display:flex;flex-direction:column"><div>${menuHtml}</div>
        ${also.length?`<div style="margin-top:auto;margin-bottom:14px;border:2px solid ${ACC};border-radius:${Math.min(E.radius,10)}px;padding:12px 14px"><div style="${caps(15,ACC,.2)};margin-bottom:6px">Also tonight</div>${also.map(w=>`<div style="font:600 17px/1.3 ${body};color:${ink};margin-top:4px">${esc(sentence(trunc(w,60)))}</div>`).join("")}</div>`:""}</div>
      <div style="margin-top:auto">
        ${cue?`<div style="border-top:1px solid ${rgba(ink,.35)};padding-top:10px;margin-bottom:14px"><div style="${caps(15,ACC,.2)};margin-bottom:6px">Showtime cue</div><div style="font:500 ${cT.z}px/1.3 ${body};color:${ink}">${esc(cue)}</div></div>`:""}
        <div style="font:500 ${fT.z}px/1.3 ${body};color:${soft}">${esc(backFine)}</div></div></div>`;
  const back=`<div style="position:absolute;inset:0;background:${bg};${fp}">${strip}${right}</div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
