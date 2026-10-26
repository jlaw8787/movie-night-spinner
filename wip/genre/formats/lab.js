/* Format: lab. A lab or base mess clipboard sheet: one face 816x1056.
   Signature: the specimen plate (TMDB still, about 41 percent of the face) and a laminated access badge whose ID photo is a second still.
   Era sets type pairing, paper, border and print process; tone sets wear, photo treatment, badge tilt, stamp and copy voice.
   Inline styles only. Text fitting runs in the page (window.__fmtFitLab) after fonts load. */
(function(){
const ID="lab",W=816,H=1056,M=28;
const BASE=(window.MENU_FORMAT_BASE!=null)?window.MENU_FORMAT_BASE:(/\/wip\/genre\//.test(location.pathname)?"../../../":"");
const GRAIN=BASE+"assets/era/_shared/paper-grain.webp";
if(!document.getElementById("fmt-font-"+ID)){const l=document.createElement("link");l.id="fmt-font-"+ID;l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Spectral+SC:wght@600;700&family=Spectral:ital,wght@0,400;0,600;1,400&family=Saira+Condensed:wght@600;800&family=Saira:wght@400;600&family=Barlow+Condensed:ital,wght@0,700;0,800;1,800&family=IBM+Plex+Sans:wght@400;600&family=Inter+Tight:wght@700;800&family=Inter:wght@400;600&family=Caveat:wght@600&display=swap";
  document.head.appendChild(l)}

/* ---------- shared bits ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=s=>String(s||"").replace(/\s*[–—]\s*/g,", ").replace(/\s+/g," ").trim();
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
if(!window.__fmtFitLab)window.__fmtFitLab=function(t){
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
  run();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run);setTimeout(run,500);setTimeout(run,1600);
};
const PIX="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/* ---------- era and tone ---------- */
const ERA={
  P:{paper:"#ece0c2",ink:"#24283a",accent:"#8a2a1e",disp:"'Spectral SC',Georgia,serif",dw:700,body:"'Spectral',Georgia,serif",
     frame:"border:5px double #24283a",head:"double",process:"letterpress",photo:"grayscale(.25) sepia(.18)",grid:"",scale:(b,c)=>"0."+c,cur:"$"},
  S:{paper:"#e2ead6",ink:"#1e2a22",accent:"#b0551b",disp:"'Saira Condensed','Arial Narrow',sans-serif",dw:800,body:"'Saira',Arial,sans-serif",
     frame:"border:3px solid #1e2a22",head:"box",process:"offset",photo:"saturate(.9) sepia(.08)",grid:"repeating-linear-gradient(0deg,rgba(40,90,70,.10) 0 1px,transparent 1px 26px),",scale:(b,c)=>(b/2).toFixed(0)+"."+c,cur:"$"},
  E:{paper:"#f0f0eb",ink:"#141414",accent:"#c0281c",disp:"'Barlow Condensed','Arial Narrow',sans-serif",dw:800,body:"'IBM Plex Sans',Arial,sans-serif",
     frame:"border:2px solid #141414",head:"bar",process:"photocopy",photo:"contrast(1.06)",grid:"",scale:(b,c)=>b+"."+c,cur:"$"},
  M:{paper:"#fbfbf9",ink:"#16191d",accent:"#1f6fd1",disp:"'Inter Tight',Arial,sans-serif",dw:800,body:"'Inter',Arial,sans-serif",
     frame:"border:1px solid #c9ccd1",head:"line",process:"laser",photo:"",grid:"",scale:(b,c)=>(b+3)+"."+c,cur:"$"}
};
const TONE={
  gritty:{f:"contrast(1.18) saturate(.82)",wear:.75,tilt:-3,stamp:"HANDLE WITH CARE",kick:"Hot food. Eat it fast."},
  glossy:{f:"saturate(1.12) contrast(1.05)",wear:.15,tilt:0,stamp:"CLEARED",kick:"Today's issue, fresh off the line."},
  warm:{f:"sepia(.12) saturate(1.08) brightness(1.03)",wear:.35,tilt:-2,stamp:"MESS OPEN",kick:"Hot, filling and plenty of it."},
  eerie:{f:"saturate(.72) contrast(1.1) brightness(.97)",wear:.55,tilt:-1,stamp:"QUARANTINE",kick:"Eat with your own spoon."},
  playful:{f:"saturate(1.25) brightness(1.04)",wear:.2,tilt:4,stamp:"EXPERIMENT IN PROGRESS",kick:"Results may vary. Seconds encouraged."},
  grand:{f:"contrast(1.08) saturate(1.05)",wear:.2,tilt:0,stamp:"PRIORITY ONE",kick:"Served to every rank on the base."},
  tender:{f:"brightness(1.05) saturate(.92) sepia(.08)",wear:.3,tilt:-2,stamp:"NIGHT SHIFT",kick:"Something warm for the long watch."},
  tense:{f:"contrast(1.16) saturate(.86)",wear:.45,tilt:0,stamp:"RESTRICTED",kick:"Clearance required past this line."},
  scrappy:{f:"grayscale(.3) contrast(1.22)",wear:.85,tilt:-5,stamp:"PROVISIONAL",kick:"Whatever is left in the store room."}
};
const LAB=["Rations","Hot mess","Sweet issue","Canteen"];

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,E=ERA[band(ctx.era||"modern")],T=TONE[ctx.tone]||TONE.warm;
  const paper=E.paper,ink=(ctx.palette&&hex(ctx.palette.dark)&&ratio(hex(ctx.palette.dark),hex(paper))>=9)?ctx.palette.dark:E.ink;
  const acc=(ctx.palette&&inkOn(ctx.palette.accent,paper,4.6))||E.accent;
  const darkPanel=(ctx.palette&&hex(ctx.palette.dark)&&lum(hex(ctx.palette.dark))<.04)?ctx.palette.dark:"#15171b";
  const venue=clean(fl&&fl.venue)||"Staff Mess Hall",sign=clean(fl&&fl.sign)||"Research station, all personnel";
  const num=String((fl&&fl.number)||yr2(f.year)||"07").replace(/[^0-9A-Za-z]/g,"").slice(0,6)||"07";
  const stills=(ctx.stills||[]).slice(),poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&f.id)?TMDB_POSTERS[f.id]:null)||null;
  const heroSrc=stills[0]?ctx.img(stills[0],"w1280"):(poster?ctx.img(poster,"w780"):"");
  const idSrc=stills[1]?ctx.img(stills[1],"w780"):(stills[0]?ctx.img(stills[0],"w780"):(poster?ctx.img(poster,"w342"):""));
  const B=E.body,D=E.disp,wearA=T.wear;
  const pf=[E.photo,T.f].filter(Boolean).join(" ")||"none";

  /* paper: stock colour, shared grain, era ruling, tone-driven vignette */
  const bg=`background:${E.grid}radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,40,10,${(.10+.22*wearA).toFixed(2)}) 100%),url(${GRAIN}) center/600px,${paper};background-blend-mode:${E.grid?"normal,":""}normal,multiply`;

  /* hero: specimen plate */
  const nItems=["s","m","w","d"].reduce((a,k)=>a+Math.min(4,((ctx.menu||{})[k]||[]).length),0);
  const PY=150,PH=nItems>10?392:nItems>8?430:458,PW=W-2*M;
  const heroImg=stills[0]
    ?`<img src="${heroSrc}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${pf}">`
    :(poster?`<img src="${heroSrc}" alt="" style="position:absolute;inset:-30px;width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover;filter:blur(18px) brightness(.7)"><img src="${heroSrc}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:${pf}">`:`<div style="position:absolute;inset:0;background:${darkPanel}"></div>`);
  const crop=(pos)=>`<div style="position:absolute;${pos};width:22px;height:22px"></div>`;
  const marks=["top:-10px;left:-10px;border-top:2px solid "+ink+";border-left:2px solid "+ink,"top:-10px;right:-10px;border-top:2px solid "+ink+";border-right:2px solid "+ink,"bottom:-10px;left:-10px;border-bottom:2px solid "+ink+";border-left:2px solid "+ink,"bottom:-10px;right:-10px;border-bottom:2px solid "+ink+";border-right:2px solid "+ink].map(p=>crop(p)).join("");
  const logo=logoPanel(ctx,{font:D,typeSize:46,typeInk:"#f4f1ea",lightInk:ink,maxW:300,maxH:112,dark:darkPanel,light:"#f6f3ea",
    wrap:`position:absolute;left:18px;bottom:18px;box-shadow:0 3px 14px rgba(0,0,0,.35);border-radius:${E.head==="line"?8:2}px`});
  const plateTab=`<div style="position:absolute;left:0;top:0;background:${paper};color:${ink};font:600 15px/1 ${B};letter-spacing:.18em;padding:8px 12px 7px;text-transform:uppercase;max-width:${PW-340}px;white-space:nowrap;overflow:hidden">Plate A <span style="letter-spacing:.04em;text-transform:none;font-style:italic;font-weight:400">Field photograph, ${esc(f.year||"")}</span></div>`;
  const stamp=`<div style="position:absolute;left:auto;right:206px;top:58px;transform:rotate(${T.tilt-4}deg);border:3px solid ${acc};color:${acc};font:${E.dw} 20px/1 ${D};letter-spacing:.12em;padding:6px 10px 5px;text-transform:uppercase;background:${paper};opacity:.93">${esc(T.stamp)}</div>`;
  const pr=(fl&&fl.prop&&(fl.prop.title||"").trim())?fl.prop:{title:"Mess Chit",lines:["One hot meal","Valid this shift"]};
  const prop=`<div style="position:absolute;right:16px;bottom:16px;width:232px;transform:rotate(${(-T.tilt/2).toFixed(1)}deg);background:${paper};border:1.5px dashed ${ink};box-shadow:0 3px 10px rgba(0,0,0,.35);padding:9px 12px 8px">
    <div style="font:${E.dw} 18px/1.1 ${D};text-transform:uppercase;letter-spacing:.06em;color:${ink};white-space:nowrap;overflow:hidden">${esc(clean(pr.title))}</div>
    ${(pr.lines||[]).slice(0,2).map(l=>`<div style="font:400 15px/1.3 ${B};color:${ink};white-space:nowrap;overflow:hidden">${esc(clean(l))}</div>`).join("")}
    <div style="font:${E.dw} 16px/1.2 ${D};color:${acc};letter-spacing:.1em;margin-top:2px">No. ${esc(num)}</div></div>`;
  const hero=`<div style="position:absolute;left:${M}px;top:${PY}px;width:${PW}px;height:${PH}px">${marks}<div style="position:absolute;inset:0;overflow:hidden;background:#111;outline:1px solid ${ink}">${heroImg}</div>${plateTab}${logo.html}${prop}${stamp}</div>`;
  const cap="";

  /* badge: laminated access card, ID photo from a second still */
  const by=clean(fl&&fl.note&&fl.note.by)||"Duty Officer";
  const badge=`<div style="position:absolute;right:${M+4}px;top:16px;width:178px;height:214px;transform:rotate(${T.tilt}deg);background:linear-gradient(160deg,rgba(255,255,255,.55),rgba(255,255,255,0) 40%),#fbfbf7;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.32);border:1px solid rgba(0,0,0,.18);overflow:hidden;z-index:3">
    <div style="background:${acc};color:#fff;font:${E.dw} 18px/1 ${D};letter-spacing:.1em;text-transform:uppercase;padding:9px 12px 8px;display:flex;justify-content:space-between;white-space:nowrap"><span>Access</span><span>Lv ${esc(num.slice(-2))}</span></div>
    <div style="display:flex;gap:10px;padding:10px 10px 0">
      <div style="width:76px;height:84px;flex:none;overflow:hidden;border:1px solid #888;background:#222">${idSrc?`<img src="${idSrc}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 30%;filter:${pf}">`:""}</div>
      <div style="font:600 14px/1.2 ${B};color:#222;text-transform:uppercase;letter-spacing:.06em;min-width:0">Badge<br>No. ${esc(num)}<br><span style="color:${acc}">All areas</span></div>
    </div>
    <div data-fitw="22" data-min="14" style="margin:8px 10px 0;font-family:${D};font-weight:${E.dw};font-size:22px;line-height:1.1;color:#111;text-transform:uppercase;white-space:nowrap;overflow:hidden">${esc(by)}</div>
    <div style="margin:6px 10px 0;border-top:1px solid #999;padding-top:5px;font:400 14px/1.15 ${B};color:#333;height:34px;overflow:hidden">${esc(venue)}</div>
  </div>`;

  /* header */
  const head=`<div style="position:absolute;left:${M}px;top:${M}px;width:${W-2*M-200}px">
    <div style="font:600 16px/1.2 ${B};letter-spacing:.2em;text-transform:uppercase;color:${acc};white-space:nowrap;overflow:hidden">${esc(sign)}</div>
    <div data-fitw="50" style="margin-top:4px;font-family:${D};font-weight:${E.dw};font-size:50px;line-height:1;text-transform:uppercase;color:${ink};white-space:nowrap;overflow:hidden;letter-spacing:${E.head==="double"?".02em":"0"}">${esc(venue)}</div>
    <div data-fitw="20" data-min="15" style="margin-top:6px;font-family:${B};font-weight:400;font-size:20px;line-height:1.2;color:${ink};white-space:nowrap;overflow:hidden">Ration sheet. ${esc(T.kick)}</div>
  </div>`;
  const rule=E.head==="double"?`border-top:2px solid ${ink};border-bottom:2px solid ${ink};height:3px`:E.head==="bar"?`background:${ink};height:8px`:E.head==="box"?`background:${acc};height:5px`:`background:${acc};height:2px`;
  const hrule=`<div style="position:absolute;left:${M}px;top:${M+104}px;width:${W-2*M-200}px;${rule}"></div>`;

  /* menu: two-column flow, sized in em so the fitter can shrink it */
  const m=ctx.menu||{};
  const secHead=(t)=>{
    const s=`font-family:${D};font-weight:${E.dw};text-transform:uppercase;letter-spacing:.08em;font-size:max(18px,1.05em);line-height:1.1`;
    if(E.head==="bar")return `<div style="${s};background:${ink};color:${paper};padding:.22em .4em .16em;margin:0 0 .35em">${esc(t)}</div>`;
    if(E.head==="box")return `<div style="${s};border:2px solid ${acc};color:${acc};padding:.18em .4em .12em;margin:0 0 .35em;display:inline-block">${esc(t)}</div>`;
    if(E.head==="double")return `<div style="${s};color:${acc};border-bottom:3px double ${ink};padding-bottom:.12em;margin:0 0 .35em">${esc(t)}</div>`;
    return `<div style="${s};color:${acc};border-bottom:1px solid ${acc};padding-bottom:.15em;margin:0 0 .35em">${esc(t)}</div>`;
  };
  const cur=E.cur;
  let flow="";
  ["s","m","w","d"].forEach((k,ci)=>{
    const items=(m[k]||[]).slice(0,4);if(!items.length)return;
    flow+=`<div style="break-inside:avoid">${secHead(LAB[ci])}`+items.slice(0,1).map((it,ii)=>row(it,ci,ii)).join("")+`</div>`+items.slice(1).map((it,ii)=>row(it,ci,ii+1)).join("");
    flow+=`<div style="height:.45em"></div>`;
  });
  function row(it,ci,ii){
    const n=clean(it.n),p=price(f,fl,ci,ii,n,E.scale);
    return `<div style="break-inside:avoid;margin:0 0 .5em;display:flex;gap:.4em"><div style="flex:none;width:.62em;height:.62em;border:1.5px solid ${ink};margin-top:.28em"></div><div style="flex:1;min-width:0">
      <div style="display:flex;gap:.5em;align-items:baseline"><span style="flex:1;font:600 max(15px,1em)/1.15 ${B};color:${ink}">${esc(n)}</span><span style="flex:none;font:${E.dw} max(15px,1em)/1.15 ${D};color:${acc}">${cur}${esc(p)}</span></div>
      ${it.note?`<div data-note="1" style="font:400 max(14px,.74em)/1.3 ${B};color:${ink};opacity:.88;margin-top:.12em">${esc(sent(it.note))}</div>`:""}
    </div></div>`;
  }
  const note=fl&&fl.note&&clean(fl.note.text);
  if(note)flow+=`<div data-drop2="1" style="break-inside:avoid;margin:.3em 0 .6em;padding:.5em .6em;border-left:4px solid ${acc};background:rgba(255,255,255,.45)">
      <div style="font:600 max(14px,.62em)/1.2 ${B};letter-spacing:.16em;text-transform:uppercase;color:${acc}">Memo from ${esc(by)}</div>
      <div style="font:italic 400 max(15px,.8em)/1.3 ${B};color:${ink};margin-top:.2em">"${esc(note)}"</div>
      <div style="font:600 max(22px,1.25em)/1 'Caveat',cursive;color:${ink};text-align:right;margin-top:.1em">${esc(by)}</div></div>`;
  else flow+=`<div data-drop2="1" style="break-inside:avoid;margin:.3em 0 .6em;padding:.5em .6em;border-left:4px solid ${acc};background:rgba(255,255,255,.45)"><div style="font:italic 400 max(15px,.8em)/1.3 ${B};color:${ink}">"Sign in, wash up and take a tray. The kitchen closes when the last shift is fed."</div><div style="font:600 max(22px,1.25em)/1 'Caveat',cursive;color:${ink};text-align:right">The Cook</div></div>`;
  if(f.P)flow+=`<div data-drop2="1" style="break-inside:avoid;margin:0 0 .6em;font-size:max(15px,.76em);line-height:1.3"><span style="font-family:${D};font-weight:${E.dw};letter-spacing:.12em;text-transform:uppercase;color:${acc}">Protocol </span><span style="font-family:${B};color:${ink}">${esc(sent(f.P))}</span></div>`;
  const winks=((fl&&fl.winks)||[]).slice(0,5).map(clean).filter(Boolean);
  if(winks.length)flow+=`<div data-drop="1" style="break-inside:avoid;margin:0"><div style="font:600 max(14px,.6em)/1.2 ${B};letter-spacing:.16em;text-transform:uppercase;color:${acc}">Observations logged</div>${winks.map((w,i)=>`<div style="font:400 max(14px,.64em)/1.3 ${B};color:${ink}">${i+1}. ${esc(w)}</div>`).join("")}</div>`;

  const MY=PY+PH+22,MH=H-MY-58;
  const menu=`<div data-fit="27" style="position:absolute;left:${M}px;top:${MY}px;width:${W-2*M}px;height:${MH}px;overflow:hidden;column-count:2;column-gap:30px;column-fill:auto;font-size:27px">${flow}</div>`;
  const foot=`<div style="position:absolute;left:${M}px;right:${M}px;bottom:16px;border-top:1px solid ${ink};padding-top:7px;display:flex;justify-content:space-between;gap:16px;font:400 15px/1.2 ${B};color:${ink};white-space:nowrap;overflow:hidden">
    <span style="overflow:hidden;text-overflow:clip">Form ${esc(ID.toUpperCase())}${esc(num)}, rev. ${esc(f.year||"")}. Return tray to the hatch. Rations subject to supply.</span><span>Sheet 1 of 1. Images: TMDB</span></div>`;

  const face=`<div style="position:absolute;inset:0;${bg};font-family:${B}">
    <div style="position:absolute;inset:10px;${E.frame};pointer-events:none;opacity:.8"></div>
    ${head}${hrule}${hero}${cap}${badge}${menu}${foot}
    <img src="${PIX}" alt="" style="position:absolute;width:1px;height:1px;opacity:0" onload="window.__fmtFitLab&&window.__fmtFitLab(this)">
  </div>`;
  return {w:W,h:H,faces:[face]};
};
})();
