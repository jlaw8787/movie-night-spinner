/* Format: newspaper. A newsstand lunch counter that prints its menu as a newspaper: front page plus page 2.
   Registers window.MENU_FORMATS.newspaper = ctx => ({w:816, h:1056, faces:[front, page2]}). Contract: wip/genre/lib/harness.html.
   Era sets the paper: 1930s-40s and 1950s print a letterpress broadsheet (blackletter nameplate, Playfair headlines,
   black and white halftone photos, yellowed stock); 1960s to 1990s print an offset tabloid (red masthead block,
   Oswald headlines, punchy colour photos); 2000s and modern print a free commuter paper (Inter Tight, clean white
   stock, glossy photos, rounded panels). Tone sets wear, contrast, photo treatment and the edition wording.
   Ported from the hero pilot (wip/genre/hero/template.js). Inline styles only; no drawn art. */
(function(){
const CPI=[[1880,.07],[1900,.065],[1915,.08],[1920,.15],[1930,.13],[1940,.11],[1950,.19],[1960,.23],[1970,.30],[1980,.63],[1990,1],[2000,1.32],[2010,1.68],[2020,1.98],[2025,2.4]];
function cpi(y){y=+y||1990;if(y<=CPI[0][0])return CPI[0][1];for(let i=1;i<CPI.length;i++){const [a,va]=CPI[i-1],[b,vb]=CPI[i];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return CPI[CPI.length-1][1]}
function eraPrice(str,year,baseYear){const v=+str;if(!isFinite(v))return str;const x=v*cpi(year)/cpi(baseYear);if(x<.975)return String(Math.max(5,Math.round(x*20)*5))+"¢";const c=String(str).split(".")[1]||"00";return Math.floor(x)+"."+c}

const root=window;root.MENU_FORMATS=root.MENU_FORMATS||{};
const BASE=(document.currentScript&&document.currentScript.src||"").replace(/[^/]*$/,"");
if(!document.getElementById("fmt-newspaper-fonts")){const l=document.createElement("link");l.id="fmt-newspaper-fonts";l.rel="stylesheet";
  l.href=rdFontHref("family=Oswald:wght@500;700&family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Inter+Tight:ital,wght@0,400;0,600;0,800;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=UnifrakturMaguntia&family=Homemade+Apple","swap");
  document.head.appendChild(l)}
const W=816,H=1056,PX=40,PY=30,IW=W-2*PX,G=26,CW=(IW-2*G)/3;
const C={paper:"#f2ecde",ink:"#1b1a17",red:"#c3241a",soft:"#5d584f",head:"#1b1a17"};
const GENRE_RED="#c3241a";
let FD="'Oswald','Arial Narrow',Impact,sans-serif",FB="'Source Serif 4',Georgia,serif";
const FM="'UnifrakturMaguntia','Old English Text MT',serif",FS="'Homemade Apple',cursive";
/* comic-book section names only for superhero films; the rest get plain newspaper ones */
const LAB_HERO=["Origin snacks","Main event","Sweet victory","Power-up"],LAB_NEWS=["Early edition","Front page","Sweet stuff","Late extra"],SEC=["A","B","C","D"];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=s=>String(s||"").replace(/\s*[\u2013\u2014]\s*/g,", ").replace(/\s+/g," ").trim();
const sentence=s=>{s=clean(s);if(!s)return "";s=s[0].toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};
const hex=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const lum=c=>{const v=c.map(x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const toHex=c=>"#"+c.map(x=>Math.round(x).toString(16).padStart(2,"0")).join("");
function inkFor(h,min){
  let c=hex(h);if(!c)return null;const P=hex(C.paper);
  const sat=Math.max(...c)-Math.min(...c);if(sat<40)return null;   /* grey accents carry no film colour */
  for(let i=0;i<12&&ratio(c,P)<min;i++)c=c.map(x=>x*.85);
  return ratio(c,P)>=min?toHex(c):null;
}

/* width estimates (em per character); they run 5 to 10 percent wide of the real faces, so text always has room */
/* Oswald 700, uppercase; measured against canvas, about 3 percent wide */
let GWK=1;
const gw=(s,z)=>{let w=0;for(const ch of s.toUpperCase())w+=" ".includes(ch)?.24:".,:;'!".includes(ch)?.25:"IJ1".includes(ch)?.3:"MW".includes(ch)?.72:"&".includes(ch)?.6:.54;return w*z*GWK};
const sw=(s,z,it)=>{let w=0;for(const ch of s)w+=" .,;:'!i".includes(ch)?.27:"lfjtr".includes(ch)?.33:/[A-Z]/.test(ch)?(ch==="M"||ch==="W"?.9:.66):/[mw]/.test(ch)?.78:/[0-9]/.test(ch)?.52:.5;return w*z*(it?.93:1)};
function wrap(text,maxW,meas){
  const words=clean(text).split(" ").filter(Boolean);if(!words.length)return [];
  const lines=[];let cur="";
  for(const w of words){const t=cur?cur+" "+w:w;if(cur&&meas(t)>maxW){lines.push(cur);cur=w}else cur=t}
  lines.push(cur);return lines;
}

/* the banner headline: one line when it can be big, else two balanced lines */
function banner(title,max){
  const t=clean(title).toUpperCase(),one=gw(t,1);
  const s1=(IW-4)/one;
  if(s1>=72||!t.includes(" "))return {lines:[t],size:Math.floor(Math.max(44,Math.min(max,s1)))};
  const ws=t.split(" ");let best=null;
  for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(" "),b=ws.slice(i).join(" "),m=Math.max(gw(a,1),gw(b,1));if(!best||m<best.m)best={a,b,m}}
  return {lines:[best.a,best.b],size:Math.floor(Math.max(44,Math.min(76,(IW-4)/best.m)))};
}

/* prices: a lunch counter in dollars and cents; the first main carries the film's year as its cents */
function price(f,ci,ii,name){
  const base=[3,7,4,2][ci]+(ii>1?1:0);
  let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))>>>0;
  return eraPrice(base+"."+["25","40","50","65","75","95"][h%6],f.year,1985);
}

/* type tiers, biggest first: dish name, description, course head. Tiers 0 to 4 keep STYLE-LOCK sizes; tier 5 (24/18) is the front-page squeeze; 6+ only on Page 2 */
const TIERS=[[30,21,38],[28,21,38],[28,20,36],[26,20,36],[26,19,34],[24,18,32],[22,17,30],[20,16,28],[18,15,24],[16,14,22]];
const ITEM_GAP=13,CONT_H=26;
let DW=500,HW=700,DUP=true;
const NARROW=300;
const headH=(t,cw)=>t[2]+23;
function itemH(it,cw,t){
  const [dz,nz]=t,pw=gw("0.00",dz)+14;
  const nl=wrap(it.n,cw-pw,s=>DUP?gw(s,dz)*.96:sw(s,dz)*1.08).length; /* dish names set in Oswald 500, a touch narrower than the 700 table */
  const dl=it.note?wrap(sentence(it.note),cw,s=>sw(s,nz)).length:0;
  return nl*Math.ceil(dz*1.12)+(dl?4+dl*Math.ceil(nz*1.3):0)+ITEM_GAP;
}
const unitH=(courses,u,cw,t)=>itemH(courses[u.ci].items[u.ii],cw,t)+(u.ii===0?headH(t,cw):0);
/* fill columns in order; each course head travels with its first dish; a column that starts mid-course gets a "continued" line */
function flow(courses,list,slots,t,caps){
  const cols=slots.map(()=>[]);let k=0,used=0,i=0;
  for(;i<list.length;i++){
    let placed=false;
    while(k<slots.length){
      const u=list[i],h=unitH(courses,u,slots[k].w,t)+(used===0&&u.ii>0?CONT_H:0);
      if(used+h<=(caps?caps[k]:slots[k].h)){cols[k].push(u);used+=h;placed=true;break}
      k++;used=0;
    }
    if(!placed)break;
  }
  return {cols,rest:list.slice(i)};
}
/* smallest even bottom line: caps grow together until everything fits */
function balance(courses,list,slots,t,lead){
  const lo=lead||slots.map(()=>0);
  for(let T=0;T<=1100;T+=6){
    const caps=slots.map((s,i)=>Math.min(s.h,lo[i]+T));
    const r=flow(courses,list,slots,t,caps);
    if(!r.rest.length)return r;
    if(caps.every((c,i)=>c>=slots[i].h))return null;
  }
  return null;
}

function courseHead(label,sec,t,cw){
  if(cw<NARROW){
    const z=Math.min(t[2],Math.floor((cw-30)/(gw(label,1)*1.03)));
    return `<div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};display:flex;align-items:flex-end;justify-content:space-between;padding:5px 0 3px;margin-bottom:9px;height:${t[2]}px;line-height:1">
    <span style="font-family:${FD};font-weight:${HW};font-size:${z}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink};white-space:nowrap">${esc(label)}</span>
    <span style="font-family:${FD};font-weight:700;font-size:${z}px;line-height:1;color:${C.red}">${sec}</span></div>`;
  }
  return `<div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};display:flex;align-items:flex-end;justify-content:space-between;padding:5px 0 3px;margin-bottom:9px;height:${t[2]}px;line-height:1">
    <span style="font-family:${FD};font-weight:${HW};font-size:${t[2]}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink}">${esc(label)}</span>
    <span style="font-family:${FB};font-size:15px;line-height:1;font-weight:700;letter-spacing:.16em;color:${C.red};padding-bottom:5px">SECTION ${sec}</span></div>`;
}
function itemHTML(f,it,ci,ii,t){
  const [dz,nz]=t;
  return `<div style="margin-bottom:${ITEM_GAP}px">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.12;font-weight:${DW};text-transform:${DUP?"uppercase":"none"};letter-spacing:.005em;color:${C.ink}">${esc(clean(it.n))}</span>
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.12;font-weight:${DW};color:${C.red};white-space:nowrap">${price(f,ci,ii,it.n)}</span></div>
    ${it.note?`<div style="font-family:${FB};font-size:${nz}px;line-height:1.3;color:${C.ink};margin-top:4px">${esc(sentence(it.note))}</div>`:""}</div>`;
}
const redLine=(txt)=>`<div style="font-family:${FB};font-size:15px;line-height:18px;font-weight:700;letter-spacing:.14em;color:${C.red};text-transform:uppercase;margin-bottom:8px">${esc(txt)}</div>`;
function columnHTML(f,courses,col,t,cw){
  return col.map((u,j)=>{
    const c=courses[u.ci];let s="";
    if(j===0&&u.ii>0)s+=redLine(c.label+", continued");
    if(u.ii===0)s+=courseHead(c.label,SEC[c.sec],t,cw);
    return s+itemHTML(f,c.items[u.ii],c.sec,u.ii,t);
  }).join("");
}
const ruled=(w,first,inner)=>`<div style="width:${w}px;flex:none;box-sizing:content-box;${first?"":`margin-left:${G/2}px;padding-left:${G/2-1}px;border-left:1px solid ${C.ink};`}">${inner}</div>`;


/* banner type: 1 line when it can be big, else the best 2 or 3 line split */
function bannerN(title,max){
  const t=clean(title).toUpperCase(),ws=t.split(" ");
  const fit=lines=>Math.floor((IW-8)/Math.max(...lines.map(l=>gw(l,1))));
  const s1=fit([t]);if(s1>=64||ws.length<2)return {lines:[t],size:Math.max(30,Math.min(max,s1))};
  let best=null;
  for(let i=1;i<ws.length;i++){const L=[ws.slice(0,i).join(" "),ws.slice(i).join(" ")],z=fit(L);if(!best||z>best.size)best={lines:L,size:z}}
  if(best.size>=46||ws.length<3)return {lines:best.lines,size:Math.max(30,Math.min(max-16,best.size))};
  let b3=null;
  for(let i=1;i<ws.length-1;i++)for(let k=i+1;k<ws.length;k++){const L=[ws.slice(0,i).join(" "),ws.slice(i,k).join(" "),ws.slice(k).join(" ")],z=fit(L);if(!b3||z>b3.size)b3={lines:L,size:z}}
  return {lines:b3.lines,size:Math.max(30,Math.min(60,b3.size))};
}

/* logo panel tone, decided at render time from the logo's own pixels: the panel (dark, light or mid) on which
   the fewest logo pixels drop under 2.2:1 contrast. Runs from the logo's onload; stays dark if the canvas is blocked. */
root.__npLogo=function(img){
  try{
    const w=120,h=Math.max(1,Math.round(120*img.naturalHeight/img.naturalWidth)),cv=document.createElement("canvas");cv.width=w;cv.height=h;
    const g=cv.getContext("2d");g.drawImage(img,0,0,w,h);const d=g.getImageData(0,0,w,h).data;
    const L=(r,gg,b)=>lum([r,gg,b]);const P={dark:L(21,20,18),light:L(251,249,243),mid:L(125,119,108)},bad={dark:0,light:0,mid:0};let n=0;
    for(let i=0;i<d.length;i+=4){if(d[i+3]<40)continue;const l=L(d[i],d[i+1],d[i+2]);n++;for(const k in P){const a=Math.max(l,P[k]),b=Math.min(l,P[k]);if((a+.05)/(b+.05)<2.2)bad[k]++}}
    if(!n)return;let pick=bad.dark<=bad.light?"dark":"light";if(bad[pick]/n>.2&&bad.mid<bad[pick])pick="mid";
    const p=img.parentElement;p.style.background=p.dataset[pick];p.style.borderColor=pick==="light"?p.dataset.rule:"transparent";p.dataset.tone=pick;
  }catch(e){}
};

const ERAS={
  "1930s-40s":{kind:"classic",gwk:1.27,tint:"rgba(200,160,70,.22)",photo:"grayscale(1) contrast(1.2) brightness(1.04)",dot:4,dotA:.26,label:"Set in hot metal at the counter."},
  "1950s":{kind:"classic",gwk:1.27,tint:"rgba(205,175,100,.14)",photo:"grayscale(1) contrast(1.12) brightness(1.05)",dot:4,dotA:.2,label:"Set in hot metal at the counter."},
  "1960s":{kind:"tabloid",gwk:1,tint:"rgba(215,180,110,.14)",photo:"sepia(.14) saturate(1.02) contrast(1.06)",dot:3,dotA:.2,label:"Printed offset at the counter."},
  "1970s":{kind:"tabloid",gwk:1,tint:"rgba(210,170,100,.12)",photo:"sepia(.1) saturate(1.08) contrast(1.08)",dot:3,dotA:.18,label:"Printed offset at the counter."},
  "1980s":{kind:"tabloid",gwk:1,tint:"rgba(200,200,200,.10)",photo:"saturate(1.18) contrast(1.1)",dot:3,dotA:.14,label:"Printed offset at the counter."},
  "1990s":{kind:"tabloid",gwk:1,tint:"rgba(230,230,230,.16)",photo:"saturate(1.15) contrast(1.08)",dot:3,dotA:.12,label:"Printed offset at the counter."},
  "2000s":{kind:"modern",gwk:1.22,tint:"rgba(255,255,255,.45)",photo:"contrast(1.04) saturate(1.04)",dot:0,dotA:0,label:"Printed on recycled stock."},
  "modern":{kind:"modern",gwk:1.22,tint:"rgba(255,255,255,.58)",photo:"contrast(1.03)",dot:0,dotA:0,label:"Printed on recycled stock."}
};
const TONES={
  gritty:{wear:.9,vig:.34,ph:"contrast(1.1) brightness(.96)",ed:"LATE CITY FINAL",rot:2},
  tense:{wear:.5,vig:.28,ph:"contrast(1.1)",ed:"BULLETIN EDITION",rot:2},
  eerie:{wear:.6,vig:.36,ph:"brightness(.94) saturate(.85)",ed:"NIGHT EDITION",rot:-2,cool:1},
  glossy:{wear:0,vig:.08,ph:"brightness(1.03)",ed:"WEEKEND EDITION",rot:2},
  grand:{wear:.1,vig:.12,ph:"brightness(1.02)",ed:"SPECIAL EDITION",rot:1.5},
  warm:{wear:.3,vig:.18,ph:"sepia(.06)",ed:"LUNCH EDITION",rot:3},
  tender:{wear:.25,vig:.14,ph:"brightness(1.02) saturate(.95)",ed:"HOME EDITION",rot:2.5},
  playful:{wear:.2,vig:.12,ph:"saturate(1.12)",ed:"EXTRA! EXTRA!",rot:5},
  scrappy:{wear:.7,vig:.24,ph:"contrast(1.08)",ed:"STREET EDITION",rot:-4}
};

root.MENU_FORMATS.newspaper=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,logo=ctx.logo||null,pal=ctx.palette||{};
  const E=ERAS[ctx.era]||ERAS.modern,T=TONES[ctx.tone]||TONES.warm,K=E.kind;
  /* era type pairing */
  FD=K==="classic"?"'Playfair Display',Georgia,serif":K==="modern"?"'Inter Tight','Helvetica Neue',Arial,sans-serif":"'Oswald','Arial Narrow',Impact,sans-serif";
  FB=K==="modern"?"'Inter Tight','Helvetica Neue',Arial,sans-serif":"'Source Serif 4',Georgia,serif";
  GWK=E.gwk;DUP=K!=="modern";DW=K==="classic"?700:K==="modern"?600:500;HW=K==="classic"?900:K==="modern"?800:700;
  C.paper=K==="modern"?"#f7f6f2":"#f2ecde";
  C.red=inkFor(pal.accent,4.8)||GENRE_RED;
  const dk=hex(pal.dark);C.head=dk&&ratio(dk,hex(C.paper))>=9?pal.dark:C.ink;
  const year=String(f.year||""),num=clean(fl&&fl.number)||year;
  const venue=clean(fl&&fl.venue)||"The Daily Special";
  const sign=clean(fl&&fl.sign).toUpperCase()||"CITY NEWSSTAND AND LUNCH COUNTER";
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const menu=ctx.menu||{};
  const courses=[["s",0],["m",1],["w",2],["d",3]].map(([k,i])=>({label:((ctx.f||{}).theme==="hero"?LAB_HERO:LAB_NEWS)[i],sec:i,items:(menu[k]||[]).filter(x=>x&&x.n)})).filter(c=>c.items.length);
  const list=[];courses.forEach((c,ci)=>c.items.forEach((it,ii)=>list.push({ci,ii})));
  const img=ctx.img||((p,s)=>p?"https://image.tmdb.org/t/p/"+(s||"w1280")+p:"");
  const st=(ctx.stills||[]).filter(Boolean);
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&f.id&&TMDB_POSTERS[f.id])||null;
  /* front hero is the film's poster, whole (2:3). Stills are secondary: the right-hand photo beside it and page 2. */
  const posterSrc=poster?img(poster,"w780"):null;
  const pic1=posterSrc||(st[0]?img(st[0],"w1280"):null);
  const sideSrc=st[0]?img(st[0],"w1280"):null;
  const pic2=st[1]?img(st[1],"w1280"):st[0]?img(st[0],"w1280"):posterSrc;
  const isPoster=u=>u&&u.includes("/w780");
  const R=K==="modern"?8:0;
  const pick=k=>{const c=courses.find(c=>c.sec===k);return c?clean(c.items[0].n):""};

  /* paper: real newsprint scan, era tint, tone wear (vignette, fold, creases) */
  const wear=T.wear;
  const tint=T.cool?"rgba(170,185,200,.16)":E.tint;
  const creases=wear>.45?`linear-gradient(104deg,transparent 31.8%,rgba(60,50,30,${.07*wear}) 32%,transparent 32.4%),linear-gradient(77deg,transparent 66.6%,rgba(255,255,255,${.25*wear}) 66.8%,rgba(60,50,30,${.06*wear}) 67%,transparent 67.3%),`:"";
  const paperBg=`background:${creases}linear-gradient(180deg,transparent 49.4%,rgba(70,60,40,${.06+.1*wear}) 50%,rgba(255,255,255,.28) 50.35%,transparent 51.1%),radial-gradient(ellipse 85% 80% at 50% 46%,rgba(0,0,0,0) 58%,rgba(100,82,48,${T.vig}) 100%),linear-gradient(${tint},${tint}),url('${BASE}newspaper-newsprint.jpg') center/cover,${C.paper}`;
  const face=(n,inner)=>`<div data-face-name="${n}" style="position:relative;width:${W}px;height:${H}px;box-sizing:border-box;padding:${PY}px ${PX}px;${paperBg};color:${C.ink};overflow:hidden">${inner}</div>`;
  const fine=right=>`<div style="display:flex;justify-content:space-between;gap:16px;padding-top:6px;border-top:1px solid ${C.ink};font-family:${FB};font-size:15px;line-height:19px;color:${C.soft};white-space:nowrap;overflow:hidden">
      <span>Prices subject to change. ${E.label} Form DS-${esc(num)}.</span><span>${right}</span></div>`;
  const photo=(src,w,h,alt,pos)=>`<div style="position:relative;width:${w}px;height:${h}px;${K==="modern"?"":`border:1px solid ${C.ink};`}border-radius:${R}px;box-sizing:border-box;overflow:hidden;background:${C.head}">
    ${src?"":`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#f3eee2;text-align:center;padding:20px"><div style="font-family:${FD};font-weight:${HW};font-size:${Math.min(64,Math.round(h/5))}px;line-height:1.05;text-transform:uppercase">Picture to follow</div><div style="font-family:${FB};font-size:18px;letter-spacing:.14em">IN THE LATE EDITION</div></div>`}
    ${src?`<img crossorigin="anonymous" src="${esc(src)}" alt="${esc(alt)}" style="width:100%;height:100%;object-fit:${isPoster(src)?"contain":"cover"};object-position:50% ${pos};display:block;filter:${E.photo} ${T.ph}">`:""}
    ${E.dot?`<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(20,16,10,.6) 22%,transparent 27%);background-size:${E.dot}px ${E.dot}px;mix-blend-mode:multiply;opacity:${E.dotA}"></div>`:""}
    <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${K==="modern"?0:40}px rgba(0,0,0,${.12+.12*wear})"></div></div>`;

  /* the poster, whole, no filter, in the paper's own frame; w x h is 2:3 or it sits on the dark panel */
  const posterFrame=(src,w,h,alt)=>`<div style="position:relative;width:${w}px;height:${h}px;${K==="modern"?"":`border:1px solid ${C.ink};`}border-radius:${R}px;box-sizing:border-box;overflow:hidden;background:${C.head}">
    <img crossorigin="anonymous" src="${esc(src)}" alt="${esc(alt)}" style="position:absolute;left:50%;top:0;height:100%;width:auto;max-width:100%;transform:translateX(-50%);object-fit:contain;display:block">
    <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${K==="modern"?0:18}px rgba(0,0,0,${.08+.1*wear})"></div></div>`;

  /* ---------- front page ---------- */
  const capsSm=`font-family:${FB};font-size:14px;line-height:18px;font-weight:700;letter-spacing:.16em`;
  const signTxt=sign.length>42?sign.slice(0,42).replace(/[ ,]+\S*$/,""):sign;
  let mast="",MAST=136;
  if(K==="classic"){
    const ear=(k,l1,l2)=>`<div style="width:128px;flex:none;border:3px double ${C.ink};padding:5px 4px;box-sizing:border-box;text-align:center;white-space:nowrap;overflow:hidden">
      <div style="${capsSm};color:${C.red}">${k}</div><div style="font-family:${FB};font-size:15px;line-height:18px;margin-top:2px">${l1}<br>${l2}</div></div>`;
    mast=`<div style="display:flex;align-items:center;gap:10px;height:84px">
        ${ear(T.ed.split(" ")[0].replace("!",""),"Edition. Menu","inside, page 2")}
        <div style="flex:1;min-width:0;text-align:center;font-family:${FM};font-size:${Math.max(28,Math.min(64,Math.floor(470/(venue.length*.53))))}px;line-height:1;color:${C.head};white-space:nowrap;overflow:hidden">${esc(venue)}</div>
        ${ear("WEATHER","Clear skies.","Look up.")}</div>
      <div style="border-top:1px solid ${C.ink};border-bottom:3px double ${C.ink};margin-top:8px;height:30px;display:flex;justify-content:space-between;align-items:center;font-family:${FB};font-size:14px;font-weight:700;letter-spacing:.12em;white-space:nowrap;overflow:hidden">
        <span>VOL. ${esc(year.slice(-2))}, No. ${esc(num)}</span><span style="color:${C.red}">${esc(signTxt)}</span><span>TWO CENTS</span></div>`;
  }else if(K==="tabloid"){
    const block=inkFor(pal.accent,1)&&ratio(hex(inkFor(pal.accent,1)),[255,255,255])>=4.5?inkFor(pal.accent,1):"#c8161d";
    mast=`<div style="background:${block};height:92px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;gap:12px;overflow:hidden">
        <div style="min-width:0;font-family:'Oswald',Impact,sans-serif;font-weight:700;font-size:${Math.max(30,Math.min(70,Math.floor(560/(venue.length*.56))))}px;line-height:1;color:#fff;text-transform:uppercase;letter-spacing:-.005em;white-space:nowrap;overflow:hidden">${esc(venue)}</div>
        <div style="flex:none;background:#fff;color:${block};font-family:'Oswald',Impact,sans-serif;font-weight:700;font-size:20px;line-height:24px;padding:6px 10px;text-align:center;transform:rotate(-3deg)">${/EDITION/.test(T.ed)?`${esc(T.ed.replace(" EDITION",""))}<br>EDITION`:`${esc(T.ed)}<br>LATE NEWS`}</div></div>
      <div style="background:#ffd23a;height:30px;margin-top:6px;display:flex;justify-content:space-between;align-items:center;padding:0 12px;font-family:'Oswald',sans-serif;font-weight:500;font-size:17px;letter-spacing:.06em;color:#141210;white-space:nowrap;overflow:hidden">
        <span>No. ${esc(num)}</span><span>${esc(signTxt)}</span><span>${year<"1975"?"15 CENTS":"35 CENTS"}</span></div>`;
  }else{
    mast=`<div style="display:flex;align-items:flex-end;justify-content:space-between;height:86px;gap:14px">
        <div style="min-width:0;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:${Math.max(30,Math.min(62,Math.floor(560/(venue.length*.6))))}px;line-height:1;letter-spacing:-.03em;color:${C.head};white-space:nowrap;overflow:hidden">${esc(venue)}</div>
        <div style="flex:none;background:${C.red};color:#fff;border-radius:999px;font-family:'Inter Tight',sans-serif;font-weight:800;font-size:18px;line-height:22px;padding:7px 14px;margin-bottom:6px">FREE. TAKE ONE.</div></div>
      <div style="height:6px;background:${C.red};margin-top:8px;border-radius:3px"></div>
      <div style="height:30px;display:flex;justify-content:space-between;align-items:center;font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:600;color:${C.soft};white-space:nowrap;overflow:hidden">
        <span>Issue ${esc(num)}</span><span>${esc(clean(fl&&fl.sign)||"City newsstand and lunch counter")}</span><span>${esc(T.ed.charAt(0)+T.ed.slice(1).toLowerCase())}</span></div>`;
  }

  /* ---------- front layout: poster whole on the left (about 40 percent of the face), everything else in a narrow right column ---------- */
  const FOOT=36,MAXB=H-PY*2-MAST-FOOT,capH=30;
  const P1=Math.min(736,MAXB-capH-6),PW=Math.round(P1*2/3),COL=IW-PW-16;
  const panelDark=hex(pal.dark)&&lum(hex(pal.dark))<.04?pal.dark:"#151412";
  const panelBorder=K==="classic"?`border:3px double ${C.ink};`:K==="modern"?"border:2px solid transparent;":`border:2px solid transparent;`;
  let LG=null;
  if(logo&&logo[0]&&logo[1]&&logo[2]){const a=logo[1]/logo[2];const iw=COL-16;let h=Math.min(a<4?100:84,iw/a);if(h>=34&&a>=1.1)LG={src:img(logo[0],"original"),h:Math.round(h),w:Math.round(h*a)}}
  /* set-type title for the narrow column: biggest size whose wrapped lines all fit */
  const setTitle=()=>{const t=clean(f.title||"").toUpperCase(),ws=t.split(" ");
    for(let z=(K==="classic"?44:48);z>=24;z-=2){const lines=[];let cur="";
      for(const w of ws){const x=cur?cur+" "+w:w;if(cur&&gw(x,z)>COL-4){lines.push(cur);cur=w}else cur=x}
      lines.push(cur);if(lines.length<=4&&lines.every(l=>gw(l,z)<=COL-4))return {lines,size:z}}
    return {lines:ws,size:24}};
  const B=setTitle();
  const tag=clean(f.T);
  const by=clean(fl&&fl.note&&fl.note.by)||"Sal";
  const main=pick(1),drink=pick(3),snack=pick(0);
  let noteTxt=fl&&fl.note&&fl.note.text?sentence(fl.note.text):["Big night on the corner, folks.",main?`On the grill: ${main}.`:snack?`Up first: ${snack}.`:"",drink?`${drink}, first one on the house.`:""].filter(Boolean).join(" ");
  const cue=sentence(f.P);

  /* prop: the film's own paper object, type only */
  const pr=fl&&fl.prop&&fl.prop.title?fl.prop:{kind:"slip",title:"Late Edition",lines:["Hot off the grill","Full menu inside"]};
  const ptitle=clean(pr.title).toUpperCase(),plines=(pr.lines||[]).map(clean).filter(Boolean).slice(0,3);
  const tz=Math.max(16,Math.min(24,Math.floor(170/gw(ptitle,1))));
  const edge=pr.kind==="ticket"?`border:1px solid ${C.ink};border-left:3px dashed ${C.ink};border-right:3px dashed ${C.ink}`:pr.kind==="card"?`border:2px solid ${C.ink}`:`border:1px solid ${C.ink}`;
  const SLW=Math.min(206,COL-14);
  const slipL=wrap(ptitle,SLW-24,s=>gw(s,tz)).length;
  const slipH=14+slipL*(tz+5)+10+plines.length*19+31+14;
  const slip=`<div style="position:relative;align-self:center;transform:rotate(${pr.kind==="card"?-T.rot:T.rot}deg);width:${SLW}px;flex:none;background:${K==="modern"?"#ffffff":"#fbf7ec"};${edge};border-radius:${K==="modern"?6:0}px;box-shadow:0 4px 10px rgba(30,22,10,.35);padding:8px 12px 9px;box-sizing:border-box;text-align:center;font-family:${FB};color:${C.ink}">
    <div style="border-top:2px solid ${C.red};border-bottom:2px solid ${C.red};padding:3px 0;font-family:${FD};font-weight:${HW};font-size:${tz}px;line-height:${tz+5}px;color:${C.red};white-space:normal;overflow:hidden">${esc(ptitle)}</div>
    <div style="font-size:15px;line-height:19px;margin-top:5px">${plines.map(esc).join("<br>")}</div>
    <div style="font-family:${FD};font-weight:${HW};font-size:21px;line-height:28px;margin-top:3px">${fl&&fl.number?`No. ${esc(fl.number)}`:"5 CENTS"}</div></div>`;

  /* height budget for the right column; if it runs over, drop the deck, then trim the note */
  const edH=22+22,logoH=LG?LG.h+22:B.lines.length*Math.ceil(B.size*1.08);
  const tagZ=18,tagL=tag?wrap(sentence(tag),COL,s=>sw(s,tagZ,1)*1.06).length:0;
  let useTag=tagL>0&&tagL<=5,noteZ=16,cueZ=16;
  const byZ=Math.max(16,Math.min(22,Math.floor((COL-10)/Math.max(4,by.length*.8)))),byH=byZ+8+17+6;
  const noteH=()=>{const nl=wrap(noteTxt,COL,s=>sw(s,noteZ,1)*1.06).length;return 12+3+18+nl*Math.ceil(noteZ*1.3)+byH};
  const cueH=cue?(2+30+5+18+wrap(cue,COL-22,s=>sw(s,cueZ)*1.06).length*Math.ceil(cueZ*1.28)+7+12):0;
  const total=()=>edH+8+logoH+(useTag?12+tagL*24:0)+14+noteH()+(cue?14+cueH:0)+14+slipH;
  if(total()>MAXB)useTag=false;
  for(let g=0;g<5&&total()>MAXB;g++){const parts=noteTxt.match(/[^.!?]+[.!?]+/g)||[noteTxt];if(parts.length<2)break;noteTxt=parts.slice(0,-1).join("").trim()}

  const capsSm2=`font-family:${FB};font-size:15px;line-height:18px;font-weight:700;letter-spacing:.12em`;
  const headline=LG?`<h1 data-dark="${panelDark}" data-light="#fbf9f3" data-mid="#7d776c" data-rule="${C.head}" style="margin:8px 0 0;height:${LG.h+22}px;box-sizing:border-box;padding:9px 0;background:${panelDark};${panelBorder}border-radius:${R+2}px;font-size:0;line-height:0;text-align:center"><img crossorigin="anonymous" onload="window.__npLogo&&window.__npLogo(this)" src="${esc(LG.src)}" alt="${esc(f.title)}" style="height:${LG.h}px;width:${LG.w}px;max-width:100%;object-fit:contain"></h1>`
    :`<h1 style="margin:8px 0 0;font-weight:${HW};font-family:${FD};font-size:${B.size}px;line-height:1.08;letter-spacing:${K==="modern"?"-.02em":"0"};color:${C.head};white-space:nowrap">${B.lines.map(esc).join("<br>")}</h1>`;

  const heroHTML=posterSrc?posterFrame(posterSrc,PW,P1,`${f.title||""} (${year}) film poster`):photo(pic1,PW,P1,`${f.title||""} (${year}) film still`,"38%");

  const front=face("front",`
  <header style="height:${MAST}px;box-sizing:border-box">${mast}</header>
  <main style="height:${MAXB}px;display:flex;gap:16px;align-items:flex-start">
    <div style="width:${PW}px;flex:none">${heroHTML}
      <div style="display:flex;flex-direction:column;justify-content:center;height:${capH}px;margin-top:4px;font-family:${FB};font-size:15px;line-height:18px;color:${C.ink};white-space:nowrap;overflow:hidden"><span><b style="letter-spacing:.06em">TONIGHT'S FEATURE.</b> <i>Now showing, ${esc(year)}.</i></span></div></div>
    <div style="width:${COL}px;flex:none;height:${MAXB}px;display:flex;flex-direction:column;overflow:hidden">
      <div style="${capsSm2};color:${C.red};height:${edH}px;white-space:nowrap;overflow:hidden">${esc(T.ed)}<br>TONIGHT'S FEATURE</div>
      <div style="text-align:center">${headline}</div>
      ${useTag?`<div style="margin-top:12px;font-family:${FB};font-style:italic;font-size:${tagZ}px;line-height:24px;color:${C.ink};text-align:center">${esc(sentence(tag))}</div>`:""}
      <div style="margin-top:14px;border-top:3px solid ${C.head};padding-top:10px">
        <div style="${capsSm2};color:${C.red};margin-bottom:3px">${fl&&fl.note?`A WORD FROM ${esc(by.toUpperCase())}`:"A WORD FROM THE COUNTER"}</div>
        <div style="font-family:${FB};font-style:italic;font-size:${noteZ}px;line-height:${Math.ceil(noteZ*1.3)}px;color:${C.ink}">${esc(noteTxt)}</div>
        <div style="display:flex;flex-direction:column;justify-content:center;height:${byH}px;overflow:hidden"><span style="font-family:${FS};font-size:${byZ}px;line-height:${byZ+8}px;color:#22305a;white-space:nowrap">${esc(by)}</span><span style="font-family:${FB};font-size:14px;line-height:17px;color:${C.soft};white-space:nowrap;overflow:hidden">${fl?`at ${esc(venue)}`:"behind the counter"}</span></div></div>
      ${cue?`<div style="margin-top:14px;border:2px solid ${C.ink};border-radius:${R}px;overflow:hidden;background:rgba(255,253,246,.55)">
        <div style="background:${C.red};color:#fff;font-family:${FD};font-weight:${HW};font-size:21px;line-height:30px;height:30px;text-align:center">STOP PRESS</div>
        <div style="padding:5px 10px 7px;font-family:${FB};color:${C.ink}"><div style="${capsSm};color:${C.red}">SHOWTIME CUE</div>
        <div style="font-size:${cueZ}px;line-height:${Math.ceil(cueZ*1.28)}px">${esc(cue)}</div></div></div>`:""}
      <div style="margin-top:auto;padding-top:14px;display:flex;flex-direction:column">${slip}</div>
    </div>
  </main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${fine("Read it. Eat it. Fold it.")}</footer>`);

  /* ---------- page 2: the menu under a second still; capped at two faces ---------- */
  const FOL=74,P2=H-2*PY-FOL-FOOT-14,SAFE2=P2-16;
  const cap2=`Another frame from ${clean(f.title)}.`;
  const winksTxt=winks.length?winks.slice(0,5).map(w=>w.replace(/[.]$/,"")).join(". ")+".":"";
  const WL=winksTxt?wrap("ALSO IN THIS EDITION: "+winksTxt,IW,s=>sw(s,15)*1.08).length:0,WH=WL?WL*19+8:0;
  const winksLine=WL?`<div style="font-family:${FB};font-size:15px;line-height:19px;color:${C.soft};margin-bottom:8px"><b style="color:${C.red};letter-spacing:.1em">ALSO IN THIS EDITION:</b> ${esc(winksTxt)}</div>`:"";
  const capL=s=>wrap("ON THE BEAT. "+cap2+" STAFF PHOTO / TMDB",s,x=>sw(x,16)*1.06).length;
  let fit=null;
  const tryFit=(ps,tiers,ncol,gap)=>{
    const cw=(IW-(ncol-1)*gap)/ncol;
    for(const tt of tiers)for(const p of ps){
      const cH=8+capL(IW)*22+14,r=balance(courses,list,Array.from({length:ncol},()=>({w:cw,h:SAFE2-WH-p-cH})),tt);
      if(r)return {t:tt,p,r,ncol,cw,gap};
    }
    return null;
  };
  fit=tryFit([430,400,380,368],TIERS.slice(K==="modern"?3:2,6),3,G)            /* full size still, 25 percent or more */
    ||tryFit([300,260,220],TIERS.slice(2,8),3,G)                  /* smaller still */
    ||tryFit([200,180],TIERS.slice(6),4,18);                      /* dense: four columns of small type */
  /* last resort for very long menus: notes trimmed to their first 70 characters at a word, still four dense columns; no dish is ever dropped */
  if(!fit){
    courses.forEach(c=>c.items=c.items.map(it=>({...it,note:it.note&&it.note.length>70?it.note.slice(0,70).replace(/[ ,;]+\S*$/,""):it.note})));
    fit=tryFit([160,140],TIERS.slice(8),4,18);
  }
  if(!fit){const t=TIERS[TIERS.length-1],cw=(IW-54)/4;fit={t,p:140,ncol:4,cw,gap:18,r:balance(courses,list,Array.from({length:4},()=>({w:cw,h:99999})),t)}}
  const rule4=(w,first,inner)=>`<div style="width:${w}px;flex:none;box-sizing:content-box;${first?"":`margin-left:${fit.gap/2}px;padding-left:${fit.gap/2-1}px;border-left:1px solid ${C.ink};`}">${inner}</div>`;
  const folio=K==="tabloid"?`<span style="font-family:'Oswald',sans-serif;font-weight:700;font-size:${Math.max(22,Math.min(36,Math.floor(330/(venue.length*.56))))}px;line-height:1;text-transform:uppercase;color:${C.red};white-space:nowrap;overflow:hidden;min-width:0">${esc(venue)}</span>`
    :K==="modern"?`<span style="font-family:'Inter Tight',sans-serif;font-weight:800;font-size:${Math.max(22,Math.min(34,Math.floor(330/(venue.length*.6))))}px;line-height:1;letter-spacing:-.03em;color:${C.head};white-space:nowrap;overflow:hidden;min-width:0">${esc(venue)}</span>`
    :`<span style="font-family:${FM};font-size:${Math.max(22,Math.min(40,Math.floor(330/(venue.length*.47))))}px;line-height:1;color:${C.head};white-space:nowrap;overflow:hidden;min-width:0">${esc(venue)}</span>`;
  const page2=face("page-2",`
  <header style="height:${FOL}px;box-sizing:border-box;border-bottom:${K==="modern"?`6px solid ${C.red}`:K==="classic"?`4px double ${C.head}`:`5px solid ${C.head}`};display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:8px;gap:14px">
    ${folio}
    <span style="font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.16em;color:${C.red};white-space:nowrap">THE LUNCH COUNTER MENU</span>
    <span style="font-family:${FD};font-weight:${HW};font-size:30px;line-height:1;white-space:nowrap">PAGE 2</span></header>
  <main style="height:${P2}px;padding-top:14px;box-sizing:border-box">
    ${photo(pic2,IW,fit.p,`${f.title||""} (${year}) film still`,"40%")}
    <div style="margin:8px 0 14px;font-family:${FB};font-size:16px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">ON THE BEAT.</b> <i>${esc(cap2)}</i> <span style="font-size:14px;letter-spacing:.12em;color:${C.soft};white-space:nowrap">STAFF PHOTO / TMDB</span></div>
    <div style="display:flex">${fit.r.cols.map((c,i)=>rule4(fit.cw,i===0,columnHTML(f,courses,c,fit.t,fit.cw))).join("")}</div>
  </main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${winksLine}${fine("Page 2 of 2")}</footer>`);
  return {w:W,h:H,faces:[front,page2]};
};
})();
