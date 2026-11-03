/* Format: lab. A lab or base mess clipboard sheet: one face 816x1056.
   Signature: the specimen plate (TMDB still, about 41 percent of the face) and a laminated access badge whose ID photo is a second still.
   Era sets type pairing, paper, border and print process; tone sets wear, photo treatment, badge tilt, stamp and copy voice.
   Inline styles only. Text fitting runs in the page (window.__fmtFitLab) after fonts load. */
(function(){
const ID="lab",W=816,H=1056,M=28;
const BASE=(window.MENU_FORMAT_BASE!=null)?window.MENU_FORMAT_BASE:(/\/wip\/genre\//.test(location.pathname)?"../../../":"");
const GRAIN=BASE+"assets/era/_shared/paper-grain.webp";
if(!document.getElementById("fmt-font-"+ID)){const l=document.createElement("link");l.id="fmt-font-"+ID;l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Spectral+SC:wght@600;700&family=Spectral:ital,wght@0,400;0,600;1,400&family=Saira+Condensed:wght@600;800&family=Saira:wght@400;600&family=Fira+Sans+Extra+Condensed:wght@700;800&family=IBM+Plex+Sans:wght@400;600&family=Manrope:wght@700;800&family=Inter:wght@400;600&family=Caveat:wght@600&display=swap";
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
  const lw=Math.max(...t.split(/\s+/).map(x=>x.length),1);const ts=Math.max(16,Math.min(t.length<=12?o.typeSize:t.length<=24?Math.round(o.typeSize*.78):Math.round(o.typeSize*.6),Math.floor(o.maxW/(lw*.74))));
  const fb=`<div style="font-family:${o.font};font-weight:800;font-size:${ts}px;line-height:1.05;color:${o.typeInk};text-transform:uppercase;max-width:${o.maxW}px;overflow-wrap:normal">${esc(t)}</div>`;
  if(!L||!L[0]||!L[1]||!L[2])return {html:`<div style="${o.wrap};background:${o.light};padding:14px 18px">${fb.replace(o.typeInk,o.lightInk)}</div>`};
  const a=L[1]/L[2];let w=o.maxW,h=w/a;if(h>o.maxH){h=o.maxH;w=h*a}
  if(h<34)return {html:`<div style="${o.wrap};background:${o.light};padding:14px 18px">${fb.replace(o.typeInk,o.lightInk)}</div>`};
  const chk="(function(i){try{var c=document.createElement('canvas'),w=c.width=60,h=c.height=Math.max(6,Math.round(60*i.naturalHeight/i.naturalWidth)),x=c.getContext('2d');x.drawImage(i,0,0,w,h);var d=x.getImageData(0,0,w,h).data,s=0,n=0,q=0,l=0;for(var k=0;k<d.length;k+=4){if(d[k+3]>140){var y=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];s+=y;if(y<95)q++;if(y>170)l++;n++}}if(n&&(s/n<105||q/n>.3&&q>l)){i.parentNode.style.background=i.parentNode.getAttribute('data-light')}}catch(e){}})(this)";
  const err="this.style.display='none';this.nextElementSibling.style.display='block'";
  return {html:`<div data-light="${o.light}" style="${o.wrap};background:${o.dark};padding:14px 18px"><img crossorigin="anonymous" src="${ctx.img(L[0],"w500")}" alt="${esc(t)}" onload="${chk}" onerror="${err}" style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain"><div style="display:none">${fb}</div></div>`};
}
/* in-page fit: shrink a block's em base until it fits its box, then drop optional blocks, clamp notes, hide notes */
if(!window.__fmtFitLab)window.__fmtFitLab=function(t){
  const face=t.parentNode;
  const run=()=>{
    face.querySelectorAll("[data-fitw]").forEach(e=>{let s=+e.getAttribute("data-fitw"),n=0;e.style.fontSize=s+"px";const lo=+(e.getAttribute("data-min")||16);while(e.scrollWidth>e.clientWidth+1&&s>lo&&n++<60){s-=1;e.style.fontSize=s+"px"}});
    face.querySelectorAll("[data-fith]").forEach(e=>{let s=+e.getAttribute("data-fith"),n=0;e.style.fontSize=s+"px";const lo=+(e.getAttribute("data-min")||14);while((e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)&&s>lo&&n++<60){s-=.5;e.style.fontSize=s+"px"}});
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
  P:{paper:"#ece0c2",ink:"#24283a",accent:"#8a2a1e",disp:"'Spectral SC',Georgia,serif",dw:700,body:"'Spectral',Georgia,serif",
     frame:"border:5px double #24283a",head:"double",process:"letterpress",photo:"grayscale(.25) sepia(.18)",grid:"",scale:(b,c)=>"0."+c,cur:"$"},
  S:{paper:"#e2ead6",ink:"#1e2a22",accent:"#b0551b",disp:"'Saira Condensed','Arial Narrow',sans-serif",dw:800,body:"'Saira',Arial,sans-serif",
     frame:"border:3px solid #1e2a22",head:"box",process:"offset",photo:"saturate(.9) sepia(.08)",grid:"repeating-linear-gradient(0deg,rgba(40,90,70,.10) 0 1px,transparent 1px 26px),",scale:(b,c)=>(b/2).toFixed(0)+"."+c,cur:"$"},
  E:{paper:"#f0f0eb",ink:"#141414",accent:"#c0281c",disp:"'Fira Sans Extra Condensed','Arial Narrow',sans-serif",dw:800,body:"'IBM Plex Sans',Arial,sans-serif",
     frame:"border:2px solid #141414",head:"bar",process:"photocopy",photo:"contrast(1.06)",grid:"",scale:(b,c)=>b+"."+c,cur:"$"},
  M:{paper:"#fbfbf9",ink:"#16191d",accent:"#1f6fd1",disp:"'Manrope',Arial,sans-serif",dw:800,body:"'Inter',Arial,sans-serif",
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
  const stills=(ctx.stills||[]).slice(),poster=ctx.poster||(((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&f.id)?TMDB_POSTERS[f.id]:null)||null;
  const posterSrc=poster?ctx.img(poster,"w780"):"";
  const heroSrc=posterSrc||(stills[0]?ctx.img(stills[0],"w1280"):"");
  const idSrc=stills[1]?ctx.img(stills[1],"w780"):(stills[0]?ctx.img(stills[0],"w780"):"");
  const B=E.body,D=E.disp,wearA=T.wear;
  const pf=[E.photo,T.f].filter(Boolean).join(" ")||"none";

  /* paper: stock colour, shared grain, era ruling, tone-driven vignette */
  const bg=`background:${E.grid}radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,40,10,${(.10+.22*wearA).toFixed(2)}) 100%),url(${GRAIN}) center/600px,${paper};background-blend-mode:${E.grid?"normal,":""}normal,multiply`;

  /* hero: specimen plate. The poster is the main picture: whole, 2:3, frame hugs it, nothing over it */
  const PY=146,PW=456,PH=684,RX=M+PW+22,RW=W-M-RX;
  const heroImg=posterSrc
    ?`<img src="${posterSrc}" crossorigin="anonymous" alt="" style="position:absolute;left:0;top:0;width:${PW}px;height:${PH}px;object-fit:contain">`
    :(heroSrc?`<img src="${heroSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${pf}">`:`<div style="position:absolute;inset:0;background:${darkPanel}"></div>`);
  const crop=(pos)=>`<div style="position:absolute;${pos};width:22px;height:22px"></div>`;
  const marks=["top:-10px;left:-10px;border-top:2px solid "+ink+";border-left:2px solid "+ink,"top:-10px;right:-10px;border-top:2px solid "+ink+";border-right:2px solid "+ink,"bottom:-10px;left:-10px;border-bottom:2px solid "+ink+";border-left:2px solid "+ink,"bottom:-10px;right:-10px;border-bottom:2px solid "+ink+";border-right:2px solid "+ink].map(p=>crop(p)).join("");
  const logo=logoPanel(ctx,{font:D,typeSize:46,typeInk:"#f4f1ea",lightInk:ink,maxW:RW-36,maxH:84,dark:darkPanel,light:"#f6f3ea",
    wrap:`position:relative;flex:none;align-self:flex-start;max-width:${RW}px;box-sizing:border-box;box-shadow:0 3px 14px rgba(0,0,0,.35);border-radius:${E.head==="line"?8:2}px`});
  const plateTab=`<div style="flex:none;color:${ink};font:600 15px/1.2 ${B};letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;overflow:hidden;margin-top:12px">Plate A <span style="letter-spacing:.04em;text-transform:none;font-style:italic;font-weight:400">Now showing, ${esc(f.year||"")}</span></div>`;
  const stamp=`<div style="flex:none;align-self:flex-start;max-width:${RW-12}px;box-sizing:border-box;margin:12px 0 0 6px;transform:rotate(${T.tilt-4}deg);border:3px solid ${acc};color:${acc};font:${E.dw} 18px/1.1 ${D};letter-spacing:.1em;padding:6px 10px 5px;text-transform:uppercase;background:${paper};opacity:.93">${esc(T.stamp)}</div>`;
  const hero=`<div style="position:absolute;left:${M}px;top:${PY}px;width:${PW}px;height:${PH}px">${marks}<div style="position:absolute;inset:0;overflow:hidden;background:#111;outline:1px solid ${ink}">${heroImg}</div></div>`;
  const cap="";

  /* badge: laminated access card, ID photo from a second still */
  const by=clean(fl&&fl.note&&fl.note.by)||"Duty Officer";
  const badge=`<div style="position:absolute;right:${M+4}px;top:16px;width:178px;height:236px;transform:rotate(${T.tilt}deg);background:linear-gradient(160deg,rgba(255,255,255,.55),rgba(255,255,255,0) 40%),#fbfbf7;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.32);border:1px solid rgba(0,0,0,.18);overflow:hidden;z-index:3">
    <div style="background:${acc};color:#fff;font:${E.dw} 18px/1 ${D};letter-spacing:.1em;text-transform:uppercase;padding:9px 12px 8px;display:flex;justify-content:space-between;white-space:nowrap"><span>Access</span><span>Lv ${esc(num.slice(-2))}</span></div>
    <div style="display:flex;gap:10px;padding:10px 10px 0">
      <div style="width:76px;height:84px;flex:none;overflow:hidden;border:1px solid #888;background:#222">${idSrc?`<img src="${idSrc}" crossorigin="anonymous" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 30%;filter:${pf}">`:posterSrc?`<img src="${posterSrc}" crossorigin="anonymous" alt="" style="width:100%;height:100%;object-fit:contain">`:""}</div>
      <div style="font:600 14px/1.2 ${B};color:#222;text-transform:uppercase;letter-spacing:.06em;min-width:0">Badge<br>No. ${esc(num)}<br><span style="color:${acc}">All areas</span></div>
    </div>
    <div data-fith="22" data-min="14" style="margin:4px 10px 0;height:44px;display:flex;align-items:center;font-family:${D};font-weight:${E.dw};font-size:22px;line-height:1.05;color:#111;text-transform:uppercase;overflow:hidden;overflow-wrap:normal;word-break:normal"><div style="min-width:0;max-width:100%">${esc(by)}</div></div>
    <div style="margin:6px 10px 0;border-top:1px solid #999;padding-top:4px;font:400 14px/1.15 ${B};color:#333;height:34px;overflow:hidden">${esc(venue)}</div>
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
  const secs=["s","m","w","d"].map((k,ci)=>({ci,items:(m[k]||[]).slice(0,4)})).filter(x=>x.items.length);
  const tot=secs.reduce((a,x)=>a+x.items.length,0);let seen=0,flowA="",flow="";
  secs.forEach(x=>{
    const h=`<div style="break-inside:avoid">${secHead(LAB[x.ci])}`+x.items.slice(0,1).map((it,ii)=>row(it,x.ci,ii)).join("")+`</div>`+x.items.slice(1).map((it,ii)=>row(it,x.ci,ii+1)).join("")+`<div style="height:.45em"></div>`;
    if(seen<tot/2)flowA+=h;else flow+=h;seen+=x.items.length;
  });
  function row(it,ci,ii){
    const n=clean(it.n),p=price(f,fl,ci,ii,n,E.scale);
    return `<div style="break-inside:avoid;margin:0 0 .5em;display:flex;gap:.4em"><div style="flex:none;width:.62em;height:.62em;border:1.5px solid ${ink};margin-top:.28em"></div><div style="flex:1;min-width:0">
      <div style="display:flex;gap:.5em;align-items:baseline"><span style="flex:1;font:600 max(15px,1em)/1.15 ${B};color:${ink}">${esc(n)}</span><span style="flex:none;font:${E.dw} max(15px,1em)/1.15 ${D};color:${acc}">${cur}${esc(p)}</span></div>
      ${it.note?`<div data-note="1" style="font:400 max(14px,.74em)/1.3 ${B};color:${ink};opacity:.88;margin-top:.12em">${esc(sent(it.note))}</div>`:""}
    </div></div>`;
  }
  const MY=PY+PH+20,MH=H-MY-58;
  const menu=`<div data-fit="27" style="position:absolute;left:${M}px;top:${MY}px;width:${W-2*M}px;height:${MH}px;overflow:hidden;column-count:2;column-gap:30px;column-fill:auto;font-size:27px">${flow}</div>`;
  const side=`<div style="position:absolute;left:${RX}px;top:268px;width:${RW}px;height:${PY+PH-268}px;display:flex;flex-direction:column">${logo.html}${stamp}${plateTab}<div data-fit="24" style="flex:1;min-height:0;margin-top:12px;overflow:hidden;font-size:24px">${flowA}</div></div>`;
  const foot=`<div style="position:absolute;left:${M}px;right:${M}px;bottom:16px;border-top:1px solid ${ink};padding-top:7px;display:flex;justify-content:space-between;gap:16px;font:400 15px/1.2 ${B};color:${ink};white-space:nowrap;overflow:hidden">
    <span style="overflow:hidden;text-overflow:clip">Form ${esc(ID.toUpperCase())}${esc(num)}, rev. ${esc(f.year||"")}. Return tray to the hatch. Rations subject to supply.</span><span>Sheet 1 of 1. Images: TMDB</span></div>`;

  const face=`<div style="position:absolute;inset:0;${bg};font-family:${B}">
    <div style="position:absolute;inset:10px;${E.frame};pointer-events:none;opacity:.8"></div>
    ${head}${hrule}${hero}${cap}${badge}${side}${menu}${foot}
    <img src="${PIX}" alt="" style="position:absolute;width:1px;height:1px;opacity:0" data-labfit="1" onload="if(!this.dataset.fitted){this.dataset.fitted=1;window.__fmtFitLab&&window.__fmtFitLab(this)}">
  </div>`;
  return {w:W,h:H,faces:[face]};
};
/* fonts ready: the app awaits .ready before it renders, so the fitter measures with the real faces and text never spills at a late font swap */
function fontSpecs(url){const o=[];String(url||"").replace(/family=([^&:]+)(?::([a-z,]+)@([^&]+))?/g,(m,fam,ax,vals)=>{fam=decodeURIComponent(fam.replace(/\+/g," "));
  if(!ax){o.push(`400 20px "${fam}"`);return m}const a=ax.split(",");vals.split(";").forEach(v=>{const p=v.split(","),g=n=>a.indexOf(n)<0?null:p[a.indexOf(n)];o.push(`${g("ital")==="1"?"italic ":""}${g("wght")||400} 20px "${fam}"`)});return m});return o}
function fontsReady(links){return Promise.all(links.filter(Boolean).map(l=>new Promise(r=>{if(l.sheet)return r();l.addEventListener("load",r);l.addEventListener("error",r);setTimeout(r,3500)})
  .then(()=>Promise.all(fontSpecs(l.getAttribute("href")).map(s=>document.fonts.load(s).catch(()=>0)))))).then(()=>document.fonts.ready).catch(()=>0)}
window.MENU_FORMATS[ID].ready=fontsReady([document.getElementById("fmt-font-"+ID)]);
/* fit in the same turn the face lands, not only when the pixel loads */
if(!window.__fitLabSync){window.__fitLabSync=1;new MutationObserver(m=>m.forEach(r=>[...r.addedNodes].forEach(n=>{if(n.nodeType!==1||!n.querySelectorAll)return;[...(n.matches("img[data-labfit]")?[n]:[]),...n.querySelectorAll("img[data-labfit]")].forEach(i=>{if(!i.dataset.fitted){i.dataset.fitted="1";window.__fmtFitLab(i)}})}))).observe(document.documentElement,{childList:true,subtree:true})}
})();
