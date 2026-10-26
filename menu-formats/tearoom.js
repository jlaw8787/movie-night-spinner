/* Format: tearoom. A department store holiday tearoom card: two faces 672x1056.
   Front: the store band, the window display (TMDB still in a shop-window frame, about 41 percent), the logo on a plaque,
   a hanging gift tag (type only) and the character's note. Back: luncheon and tea list, a second still (26 to 30 percent)
   with the film's prop as a paper ticket, the showtime bell and the overheard winks.
   Era sets display face, stock, band, window frame, tag stock and price scale (cents to dollars); tone sets wear,
   photo treatment, tag swing and the house line. Inline styles only; fitting runs in the page. */
(function(){
const ID="tearoom",W=672,H=1056;
const BASE=(window.MENU_FORMAT_BASE!=null)?window.MENU_FORMAT_BASE:(/\/wip\/genre\//.test(location.pathname)?"../../../":"");
const GRAIN=BASE+"assets/era/_shared/paper-grain.webp";
if(!document.getElementById("fmt-font-"+ID)){const l=document.createElement("link");l.id="fmt-font-"+ID;l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Forum&family=Lora:ital,wght@0,400;0,600;1,400&family=Arvo:wght@700&family=Libre+Franklin:ital,wght@0,400;0,600;1,400&family=Rufina:wght@700&family=Montserrat:ital,wght@0,400;0,600;1,400&family=Young+Serif&family=Karla:ital,wght@0,400;0,600;1,400&family=Great+Vibes&display=swap";
  document.head.appendChild(l)}

/* ---------- shared bits ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=s=>String(s||"").replace(/\s*[\u2013\u2014]\s*/g,", ").replace(/\s+/g," ").trim();
const sent=s=>{s=clean(s);if(!s)return "";s=s[0].toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};
const hex=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const lum=c=>{const v=c.map(x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const toHex=c=>"#"+c.map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,"0")).join("");
function inkOn(h,paper,min){let c=hex(h);if(!c)return null;if(Math.max(...c)-Math.min(...c)<40)return null;const P=hex(paper);
  for(let i=0;i<14&&ratio(c,P)<min;i++)c=c.map(x=>x*.86);return ratio(c,P)>=min?toHex(c):null}
const band=e=>/193|194|1950/.test(e)?"P":/196|197/.test(e)?"S":/198|199/.test(e)?"E":"M";
const yr2=y=>String(y||"").slice(-2);
function hash(s){let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h}
function price(f,fl,ci,ii,name,scale){
  const base=[3,8,4,2][ci]+(ii>1?1:0);let c=["25","40","50","65","75","95"][hash(name)%6];
  if(ci===1&&ii===0&&/\d\d$/.test(String(f.year)))c=yr2(f.year);
  if(ci===3&&ii===0&&fl&&/^\d{1,2}$/.test(String(fl.number||"")))c=String(fl.number).padStart(2,"0");
  return scale(base,c);
}
/* logo on a panel that suits it: dark by default; the onload check flips it to the light panel when the logo itself is dark */
function logoPanel(ctx,o){
  const L=ctx.logo,t=clean(ctx.f.title);
  const ts=t.length<=12?o.typeSize:t.length<=24?Math.round(o.typeSize*.78):Math.round(o.typeSize*.6);
  const fb=`<div style="font-family:${o.font};font-weight:800;font-size:${ts}px;line-height:1.05;color:${o.typeInk};text-transform:uppercase;max-width:${o.maxW}px;overflow-wrap:break-word">${esc(t)}</div>`;
  if(!L||!L[0]||!L[1]||!L[2])return {html:`<div style="${o.wrap};background:${o.light};padding:14px 18px">${fb.replace(o.typeInk,o.lightInk)}</div>`};
  const a=L[1]/L[2];let w=o.maxW,h=w/a;if(h>o.maxH){h=o.maxH;w=h*a}
  if(h<34)return {html:`<div style="${o.wrap};background:${o.light};padding:14px 18px">${fb.replace(o.typeInk,o.lightInk)}</div>`};
  const chk="(function(i){try{var c=document.createElement('canvas'),w=c.width=60,h=c.height=Math.max(6,Math.round(60*i.naturalHeight/i.naturalWidth)),x=c.getContext('2d');x.drawImage(i,0,0,w,h);var d=x.getImageData(0,0,w,h).data,s=0,n=0;for(var k=0;k<d.length;k+=4){if(d[k+3]>140){s+=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];n++}}if(n&&s/n<105){i.parentNode.style.background=i.parentNode.getAttribute('data-light')}}catch(e){}})(this)";
  const err="this.style.display='none';this.nextElementSibling.style.display='block'";
  return {html:`<div data-light="${o.light}" style="${o.wrap};background:${o.dark};padding:14px 18px"><img crossorigin="anonymous" src="${ctx.img(L[0],"w500")}" alt="${esc(t)}" onload="${chk}" onerror="${err}" style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain"><div style="display:none">${fb}</div></div>`};
}
/* in-page fit: shrink a block's em base until it fits its box, then drop optional blocks, clamp notes, hide notes */
if(!window.__fmtFitTearoom)window.__fmtFitTearoom=function(t){
  const face=t.parentNode;
  const run=()=>{
    face.querySelectorAll("[data-fitw]").forEach(e=>{let s=+e.getAttribute("data-fitw"),n=0;e.style.fontSize=s+"px";const lo=+(e.getAttribute("data-min")||16);while(e.scrollWidth>e.clientWidth+1&&s>lo&&n++<60){s-=1;e.style.fontSize=s+"px"}});
    face.querySelectorAll("[data-fit]").forEach(e=>{
      const b=+e.getAttribute("data-fit");const over=()=>e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1;
      e.querySelectorAll("[data-drop],[data-drop2]").forEach(d=>d.style.display="");
      e.querySelectorAll("[data-note]").forEach(d=>{d.style.display="";d.style.webkitLineClamp="";d.style.overflow=""});
      const shrink=(lo)=>{let k=1;e.style.fontSize=b+"px";while(over()&&k>lo){k-=.025;e.style.fontSize=(b*k)+"px"}return k};
      let k=shrink(.52);
      if((k<.8||over())&&e.querySelector("[data-drop]")){e.querySelectorAll("[data-drop]").forEach(d=>d.style.display="none");k=shrink(.52)}
      if(over())e.querySelectorAll("[data-note]").forEach(d=>{d.style.display="-webkit-box";d.style.webkitBoxOrient="vertical";d.style.webkitLineClamp="1";d.style.overflow="hidden"});
      if(over())e.querySelectorAll("[data-drop2]").forEach(d=>d.style.display="none");
      if(over())e.querySelectorAll("[data-note]").forEach(d=>d.style.display="none");
    });
  };
  run();if(document.fonts){if(document.fonts.ready)document.fonts.ready.then(run);if(document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",run)}setTimeout(run,500);setTimeout(run,1600);setTimeout(run,3200);
};
const PIX="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/* ---------- era and tone ---------- */
const ERA={
  P:{paper:"#f4ecd9",ink:"#22201b",band:"#1f4536",accent:"#8a2a22",gilt:"#a8843a",disp:"'Forum',Georgia,serif",dw:400,up:true,body:"'Lora',Georgia,serif",
     frame:"border:2px solid #a8843a;outline:1px solid #a8843a;outline-offset:-8px",win:"border:10px solid #a8843a;box-shadow:inset 0 0 0 2px #6d5422,0 0 0 2px #6d5422",tag:"#efe1bd",radius:0,photo:"sepia(.22) saturate(.85)",
     coin:(b,c)=>b+c[1]+"¢"},
  S:{paper:"#e8f0e2",ink:"#1d2a22",band:"#c2452d",accent:"#b23a24",gilt:"#c2452d",disp:"'Arvo',Georgia,serif",dw:700,up:false,body:"'Libre Franklin',Arial,sans-serif",
     frame:"border:6px solid #c2452d;border-radius:22px",win:"border:12px solid #fff;outline:3px solid #c2452d;border-radius:14px",tag:"#d9473a",radius:14,photo:"saturate(1.12) sepia(.08)",
     coin:(b,c)=>b>=6?"$1."+c:c+"¢"},
  E:{paper:"#fdfbf6",ink:"#1a1414",band:"#9e1a2c",accent:"#9e1a2c",gilt:"#c9a548",disp:"'Rufina',Georgia,serif",dw:700,up:false,body:"'Montserrat',Arial,sans-serif",
     frame:"border:1px solid #c9a548;outline:3px double #c9a548;outline-offset:-10px",win:"border:4px solid #c9a548;outline:1px solid #c9a548;outline-offset:5px",tag:"#d8b85c",radius:2,photo:"contrast(1.05) saturate(1.05)",
     coin:(b,c)=>"$"+b+"."+c},
  M:{paper:"#fbf6ee",ink:"#1e1b18",band:"#26302b",accent:"#a3402a",gilt:"#26302b",disp:"'Young Serif',Georgia,serif",dw:400,up:false,body:"'Karla',Arial,sans-serif",
     frame:"border:1px solid #26302b",win:"border:1px solid #26302b",tag:"#c9a777",radius:0,photo:"",
     coin:(b,c)=>"$"+(b+4)+"."+c}
};
const TONE={
  gritty:{f:"contrast(1.14) saturate(.85)",wear:.6,tilt:-6,kick:"Top floor views at bargain basement prices."},
  glossy:{f:"saturate(1.12) contrast(1.05)",wear:.1,tilt:-3,kick:"Gloves optional. Smiles required."},
  warm:{f:"sepia(.1) saturate(1.1) brightness(1.03)",wear:.3,tilt:-5,kick:"Mind the cake trolley on your way in."},
  eerie:{f:"saturate(.72) contrast(1.12) brightness(.96)",wear:.45,tilt:-9,kick:"The lights dim at closing. Do keep together."},
  playful:{f:"saturate(1.22) brightness(1.04)",wear:.15,tilt:7,kick:"Children's tea served with a wink."},
  grand:{f:"contrast(1.08) saturate(1.06)",wear:.15,tilt:-2,kick:"A grand tea for a grand season."},
  tender:{f:"brightness(1.05) saturate(.92) sepia(.08)",wear:.25,tilt:-4,kick:"Save a seat for someone special."},
  tense:{f:"contrast(1.15) saturate(.86)",wear:.35,tilt:-3,kick:"Last orders before the doors lock."},
  scrappy:{f:"grayscale(.2) contrast(1.18)",wear:.7,tilt:-10,kick:"Odd cups, even kinder company."}
};
const LAB=["Sandwiches and savouries","Luncheon","From the cake trolley","Pots and cups"];

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,E=ERA[band(ctx.era||"modern")],T=TONE[ctx.tone]||TONE.warm;
  const paper=E.paper,ink=(ctx.palette&&hex(ctx.palette.dark)&&ratio(hex(ctx.palette.dark),hex(paper))>=9)?ctx.palette.dark:E.ink;
  const acc=(ctx.palette&&inkOn(ctx.palette.accent,paper,4.6))||E.accent;
  /* the store band takes the film's dark colour when it is dark and coloured enough to carry paper text */
  const pd=ctx.palette&&hex(ctx.palette.dark);
  const bandC=(pd&&ratio(pd,hex(paper))>=7&&Math.max(...pd)-Math.min(...pd)>=30)?ctx.palette.dark:E.band;
  const darkPanel=(pd&&lum(pd)<.04)?ctx.palette.dark:"#1b1714";
  const xmas=f.theme==="xmas";
  const venue=clean(fl&&fl.venue)||"The Tea Room",sign=clean(fl&&fl.sign)||"Fourth floor, take the lift";
  const num=String((fl&&fl.number)||yr2(f.year)||"07").replace(/[^0-9A-Za-z]/g,"").slice(0,6)||"07";
  const stills=(ctx.stills||[]).slice(),poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&f.id)?TMDB_POSTERS[f.id]:null)||null;
  const posterSrc=poster?ctx.img(poster,"w780"):"";
  const s1=posterSrc||(stills[0]?ctx.img(stills[0],"w1280"):"");
  const s2=stills[1]?ctx.img(stills[1],"w1280"):(stills[0]?ctx.img(stills[0],"w1280"):posterSrc);
  const B=E.body,D=E.disp,w=T.wear,pf=[E.photo,T.f].filter(Boolean).join(" ")||"none";
  const nItems=["s","m","w","d"].reduce((a,k)=>a+Math.min(4,((ctx.menu||{})[k]||[]).length),0);
  const by=clean(fl&&fl.note&&fl.note.by)||"The Manageress";
  const up=E.up?"text-transform:uppercase;letter-spacing:.06em;":"";
  const bg=`background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 60%,rgba(70,50,20,${(.08+.2*w).toFixed(2)}) 100%),url(${GRAIN}) center/520px,${paper};background-blend-mode:normal,multiply`;
  const ppw=Math.round((470-30)*2/3);
  const photo=(src,fit)=>src?(fit==="poster"
    ?`<img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;left:-30px;top:-30px;width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover;filter:blur(16px) brightness(.5)"><img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain">`
    :fit==="posterL"
    ?`<img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;left:-30px;top:-30px;width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover;filter:blur(16px) brightness(.5)"><img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;left:14px;top:0;width:${ppw}px;height:100%;object-fit:contain">`
    :`<img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${pf}">`):`<div style="position:absolute;inset:0;background:${darkPanel}"></div>`;
  const fitImg=()=>`<img src="${PIX}" alt="" style="position:absolute;width:1px;height:1px;opacity:0" onload="window.__fmtFitTearoom&&window.__fmtFitTearoom(this)">`;

  /* ---------- front: store band, window display, logo, gift tag, note ---------- */
  const bandH=132;
  const vs=venue.length<=14?52:venue.length<=22?44:36;
  const bandHtml=`<div style="position:absolute;left:0;right:0;top:0;height:${bandH}px;background:${bandC};color:${paper};text-align:center;border-bottom:4px solid ${E.gilt}">
    <div style="margin-top:22px;font:600 15px/1.2 ${B};letter-spacing:.24em;text-transform:uppercase;opacity:.92;white-space:nowrap;overflow:hidden;padding:0 30px">${esc(sign)}</div>
    <div data-fitw="${vs}" data-min="24" style="margin:8px 30px 0;font-family:${D};font-weight:${E.dw};font-size:${vs}px;line-height:1.08;white-space:nowrap;overflow:hidden;${up}">${esc(venue)}</div>
    <div style="margin-top:6px;font:italic 400 17px/1.2 ${B};opacity:.92">The Tea Room, top floor</div></div>`;
  const WX=24,WY=bandH+52,WW=672-2*WX,WH=470;
  const winLabel=`<div data-fitw="24" data-min="16" style="position:absolute;left:${WX}px;width:${WW-200}px;top:${bandH+14}px;text-align:center;white-space:nowrap;overflow:hidden;font-family:${D};font-weight:${E.dw};font-size:24px;line-height:1.1;color:${acc};${up}">${xmas?"Our Christmas windows":"In the windows this season"}</div>`;
  const logo=logoPanel(ctx,{font:D,typeSize:42,typeInk:"#f7f1e4",lightInk:ink,maxW:posterSrc?224:330,maxH:104,dark:darkPanel,light:"#f7f1e4",
    wrap:posterSrc?`position:absolute;right:26px;bottom:26px;box-shadow:0 4px 16px rgba(0,0,0,.35);border:2px solid ${E.gilt};border-radius:${E.radius}px;z-index:2`:`position:absolute;left:50%;bottom:-46px;transform:translateX(-50%);box-shadow:0 4px 16px rgba(0,0,0,.35);border:2px solid ${E.gilt};border-radius:${E.radius}px;z-index:2`});
  const win=`<div style="position:absolute;left:${WX}px;top:${WY}px;width:${WW}px;height:${WH}px">
    <div style="position:absolute;inset:0;${E.win};box-sizing:border-box;overflow:hidden;background:#111">${photo(s1,posterSrc?"posterL":"still")}<div style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.16) 0,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08) 100%)"></div></div>
    ${logo.html}</div>`;
  /* gift tag: a paper tag with a punched eyelet, type only */
  const tag=`<div style="position:absolute;right:14px;top:${WY-30}px;width:178px;transform:rotate(${T.tilt}deg);transform-origin:50% 0;z-index:3;filter:drop-shadow(0 4px 8px rgba(0,0,0,.35))">
    <div style="background:${E.tag};clip-path:polygon(22% 0,78% 0,100% 13%,100% 100%,0 100%,0 13%);padding:40px 14px 14px;text-align:center;color:#1d1a16;position:relative">
      <div style="position:absolute;left:50%;top:12px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:${paper};box-shadow:inset 0 0 0 2px rgba(0,0,0,.25)"></div>
      <div style="font:600 14px/1.2 ${B};letter-spacing:.2em;text-transform:uppercase">To</div>
      <div style="font:400 26px/1.1 'Great Vibes',cursive">everyone at the table</div>
      <div style="margin:5px 0 3px;border-top:1px solid rgba(0,0,0,.35)"></div>
      <div style="font:600 14px/1.2 ${B};letter-spacing:.2em;text-transform:uppercase">From</div>
      <div data-fitw="26" data-min="18" style="font-family:'Great Vibes',cursive;font-size:26px;line-height:1.15;white-space:nowrap;overflow:hidden">${esc(by)}</div>
      <div style="margin-top:4px;font:600 14px/1.2 ${B};letter-spacing:.14em">No. ${esc(num)}</div></div></div>`;
  const note=fl&&fl.note&&clean(fl.note.text);
  const NY=WY+WH+(posterSrc?34:64);
  const noteHtml=`<div data-fit="23" style="position:absolute;left:48px;right:48px;top:${NY}px;height:${1056-NY-92}px;overflow:hidden;text-align:center;font-size:23px;display:flex;flex-direction:column;justify-content:center">
    <div style="font:600 max(14px,.66em)/1.2 ${B};letter-spacing:.2em;text-transform:uppercase;color:${acc}">A note from ${esc(by)}</div>
    <div style="font-family:${B};font-style:italic;font-size:max(16px,1em);line-height:1.35;color:${ink};margin-top:.3em">"${esc(note||"Do come up for tea. Coats on the stand, parcels under the table, and the cake trolley comes round twice.")}"</div>
    <div style="font:400 max(30px,1.7em)/1.1 'Great Vibes',cursive;color:${ink};margin-top:.15em">${esc(by)}</div></div>`;
  const frontFoot=`<div style="position:absolute;left:30px;right:30px;bottom:24px;text-align:center;color:${ink}">
    <div style="border-top:1px solid ${E.gilt};padding-top:8px;font:400 16px/1.3 ${B};white-space:nowrap;overflow:hidden">Luncheon 11.30 till 2.30. Afternoon tea from 3.</div>
    <div data-fitw="15" data-min="14" style="font:italic 400 15px/1.3 ${B};opacity:.85;white-space:nowrap;overflow:hidden">${esc(T.kick)}</div></div>`;
  const front=`<div style="position:absolute;inset:0;${bg};font-family:${B}">
    <div style="position:absolute;inset:8px;${E.frame};pointer-events:none"></div>
    ${bandHtml}${winLabel}${win}${tag}${noteHtml}${frontFoot}${fitImg()}</div>`;

  /* ---------- back: luncheon list, second still, prop, cue ---------- */
  const m=ctx.menu||{};
  const secHead=t=>`<div style="break-inside:avoid;break-after:avoid;margin:0 0 .3em;text-align:center"><span style="font-family:${D};font-weight:${E.dw};font-size:max(18px,1.06em);line-height:1.1;color:${acc};${up}">${esc(t)}</span><div style="margin:.2em auto 0;width:3em;border-top:2px solid ${E.gilt}"></div></div>`;
  function row(it,ci,ii){
    const n=clean(it.n),p=price(f,fl,ci,ii,n,E.coin);
    return `<div style="break-inside:avoid;margin:0 0 .5em"><div style="display:flex;gap:.6em;align-items:baseline"><span style="flex:1;font-family:${D};font-weight:${E.dw};font-size:max(15px,1em);line-height:1.15;color:${ink}">${esc(n)}</span><span style="flex:none;font:600 max(15px,.86em)/1.15 ${B};color:${acc}">${esc(p)}</span></div>
      ${it.note?`<div data-note="1" style="font:italic 400 max(14px,.72em)/1.3 ${B};color:${ink};opacity:.88;margin-top:.1em">${esc(sent(it.note))}</div>`:""}</div>`;
  }
  let flow="";
  ["s","m","w","d"].forEach((k,ci)=>{const items=(m[k]||[]).slice(0,4);if(!items.length)return;
    flow+=`<div style="break-inside:avoid">${secHead(LAB[ci])}${row(items[0],ci,0)}</div>`+items.slice(1).map((it,ii)=>row(it,ci,ii+1)).join("")+`<div style="height:.4em"></div>`});
  if(f.P)flow+=`<div data-drop2="1" style="break-inside:avoid;text-align:center;font-size:max(15px,.74em);line-height:1.35;color:${ink};margin:.1em 0 .4em"><span style="font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${acc}">The bell for the picture </span><span style="font-style:italic">${esc(sent(f.P))}</span></div>`;
  const winks=((fl&&fl.winks)||[]).slice(0,5).map(clean).filter(Boolean);
  if(winks.length)flow+=`<div data-drop="1" style="break-inside:avoid;text-align:center;font-size:max(14px,.62em);line-height:1.35;color:${ink};opacity:.9"><span style="font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${acc}">Overheard at the next table </span>${winks.map(esc).join(". ")}.</div>`;
  const SH=nItems>10?300:nItems>7?320:340, SY=1056-58-SH;
  const two=nItems>8;
  const bHead=`<div style="position:absolute;left:36px;right:36px;top:34px;text-align:center">
    <div style="font:600 15px/1.2 ${B};letter-spacing:.22em;text-transform:uppercase;color:${acc};white-space:nowrap;overflow:hidden">${esc(venue)}</div>
    <div style="font-family:${D};font-weight:${E.dw};font-size:40px;line-height:1.05;color:${ink};margin-top:6px;${up}">Luncheon and Tea</div>
    <div style="margin:10px auto 0;width:120px;border-top:3px double ${E.gilt}"></div></div>`;
  const MY=150;
  const menu=`<div data-fit="25" style="position:absolute;left:44px;right:44px;top:${MY}px;height:${SY-MY-22}px;overflow:hidden;font-size:25px;${two?"column-count:2;column-gap:30px;column-fill:auto;":""}">${flow}</div>`;
  const pr=(fl&&fl.prop&&(fl.prop.title||"").trim())?fl.prop:{title:"Parcel Ticket",lines:["Collect on the ground floor","Wrapped with care"]};
  const prop=`<div style="position:absolute;left:14px;bottom:14px;width:236px;transform:rotate(${(T.tilt/3).toFixed(1)}deg);background:#fffdf7;box-shadow:0 3px 12px rgba(0,0,0,.35);border-top:6px solid ${acc};padding:9px 14px 10px">
    <div style="font-family:${D};font-weight:${E.dw};font-size:20px;line-height:1.1;color:${ink};white-space:nowrap;overflow:hidden">${esc(clean(pr.title))}</div>
    ${(pr.lines||[]).slice(0,2).map(l=>`<div style="font:400 15px/1.3 ${B};color:${ink};white-space:nowrap;overflow:hidden">${esc(clean(l))}</div>`).join("")}
    <div style="font:600 14px/1.2 ${B};letter-spacing:.16em;color:${acc};margin-top:3px">COUNTER ${esc(num)}</div></div>`;
  const still2=`<div style="position:absolute;left:24px;right:24px;top:${SY}px;height:${SH}px">
    <div style="position:absolute;inset:0;${E.win};box-sizing:border-box;overflow:hidden;background:#111">${photo(s2,(stills[1]||stills[0])?"still":"poster")}</div>${prop}
    <div style="position:absolute;right:12px;bottom:12px;background:${paper};color:${ink};font:italic 400 15px/1.2 ${B};padding:5px 10px">Now showing, ${esc(f.year||"")}</div></div>`;
  const backFoot=`<div style="position:absolute;left:30px;right:30px;bottom:24px;text-align:center;font:400 14px/1.3 ${B};color:${ink};white-space:nowrap;overflow:hidden">Prices include tea for one. Form TR-${esc(num)}. Images: TMDB</div>`;
  const back=`<div style="position:absolute;inset:0;${bg};font-family:${B}">
    <div style="position:absolute;inset:8px;${E.frame};pointer-events:none"></div>
    ${bHead}${menu}${still2}${backFoot}${fitImg()}</div>`;
  return {w:672,h:1056,faces:[front,back]};
};
})();
