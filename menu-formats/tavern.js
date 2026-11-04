/* Format: tavern. A fantasy inn or tavern bill of fare on parchment: one face 816x1056.
   Signature: the map plate (TMDB still in a compass-lettered frame, about 41 percent of the face) and a round seal
   medallion that is a real photo (poster crop) in a wax coloured rim. No drawn art.
   Era sets display face (blackletter, uncial, 80s fantasy, engraved caps), parchment stock, frame and ornament; tone sets
   burn and mottling, photo treatment, seal tilt and the innkeeper's line. Inline styles only; fitting runs in the page. */
(function(){
const ID="tavern",W=816,H=1056;
const BASE=(window.MENU_FORMAT_BASE!=null)?window.MENU_FORMAT_BASE:(/\/wip\/genre\//.test(location.pathname)?"../../../":"");
const GRAIN=BASE+"assets/era/_shared/paper-grain.webp";
if(!document.getElementById("fmt-font-"+ID)){const l=document.createElement("link");l.id="fmt-font-"+ID;l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=IM+Fell+DW+Pica:ital@0;1&family=Uncial+Antiqua&family=Alegreya:ital,wght@0,400;0,600;1,400;1,600&family=MedievalSharp&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&family=Cinzel:wght@700&family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Pinyon+Script&display=swap";
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
const yr2=y=>{const s=String(y||"").slice(-2);return s==="00"?String(y):s}; /* a 2000 film is "2000", never "00" */
function hash(s){let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h}
function price(f,fl,ci,ii,name,scale){
  const base=[3,8,4,2][ci]+(ii>1?1:0);let c=["25","40","50","65","75","95"][hash(name)%6];
  /* the film number sets the first drink's pennies only when it reads like a price */
  if(ci===3&&ii===0&&fl&&/^\d{1,2}$/.test(String(fl.number||""))&&+fl.number%5===0)c=String(fl.number).padStart(2,"0");
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
if(!window.__fmtFitTavern)window.__fmtFitTavern=function(t){
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
  P:{paper:"#e4cf9f",edge:"70,40,12",ink:"#2b1d12",accent:"#7a1f12",disp:"'UnifrakturCook','Old English Text MT',serif",dw:700,up:false,body:"'IM Fell DW Pica',Georgia,serif",
     frame:"border:4px double #2b1d12;outline:1px solid rgba(43,29,18,.5);outline-offset:6px",plate:"border:3px double #2b1d12;padding:5px",photo:"sepia(.32) saturate(.85)",orn:"❦",coin:(b,c)=>b+"s "+(+c%12)+"d"},
  S:{paper:"#ead49b",edge:"96,60,10",ink:"#3a2414",accent:"#4f5e1f",disp:"'Uncial Antiqua',Georgia,serif",dw:400,up:false,body:"'Alegreya',Georgia,serif",
     frame:"border:6px solid #3a2414",plate:"border:6px solid #3a2414",photo:"sepia(.18) saturate(1.05)",orn:"❧",coin:(b,c)=>b+" silver"},
  E:{paper:"#e8d3aa",edge:"80,46,20",ink:"#2a1a10",accent:"#8c2a1a",disp:"'MedievalSharp',Georgia,serif",dw:400,up:false,body:"'Crimson Pro',Georgia,serif",
     frame:"border:2px solid #2a1a10;box-shadow:inset 0 0 0 5px transparent,inset 0 0 0 6px #2a1a10",plate:"border:2px solid #2a1a10;outline:1px solid #2a1a10;outline-offset:4px",photo:"saturate(1.08)",orn:"❖",coin:(b,c)=>b+" gp "+c},
  M:{paper:"#f0e4c6",edge:"110,80,30",ink:"#231a12",accent:"#7d5e14",disp:"'Cinzel',Georgia,serif",dw:700,up:true,body:"'EB Garamond',Georgia,serif",
     frame:"border:1px solid #7d5e14;outline:1px solid #7d5e14;outline-offset:-8px",plate:"border:1px solid #7d5e14;padding:6px;background:rgba(255,255,255,.25)",photo:"",orn:"✦",coin:(b,c)=>b+"."+c+" crowns"}
};
const TONE={
  gritty:{f:"contrast(1.16) saturate(.82)",wear:.85,tilt:-4,kick:"Mind your purse and your manners."},
  glossy:{f:"saturate(1.12) contrast(1.05)",wear:.25,tilt:-2,kick:"The finest table this side of the mountains."},
  warm:{f:"sepia(.12) saturate(1.1) brightness(1.03)",wear:.5,tilt:-3,kick:"The fire is lit and the stew is on."},
  eerie:{f:"saturate(.7) contrast(1.1) brightness(.96)",wear:.7,tilt:-6,kick:"Bar the door after dark."},
  playful:{f:"saturate(1.22) brightness(1.04)",wear:.35,tilt:5,kick:"No dragons in the kitchen. Mostly."},
  grand:{f:"contrast(1.08) saturate(1.06)",wear:.35,tilt:0,kick:"A feast for the whole realm. All are welcome."},
  tender:{f:"brightness(1.05) saturate(.92) sepia(.1)",wear:.45,tilt:-2,kick:"A warm seat for the weary traveller."},
  tense:{f:"contrast(1.15) saturate(.86)",wear:.6,tilt:-1,kick:"Keep your hood up and your voice down."},
  scrappy:{f:"grayscale(.25) contrast(1.2)",wear:.95,tilt:-7,kick:"Pay in coin, pay in kind, but pay."}
};
const LAB=["To begin","From the hearth","Sweet things","Mugs and cups"];

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},fl=ctx.flavour||null,E=ERA[band(ctx.era||"modern")],T=TONE[ctx.tone]||TONE.warm;
  const paper=E.paper,ink=(ctx.palette&&hex(ctx.palette.dark)&&ratio(hex(ctx.palette.dark),hex(paper))>=9)?ctx.palette.dark:E.ink;
  const acc=(ctx.palette&&inkOn(ctx.palette.accent,paper,4.6))||E.accent;
  const darkPanel=(ctx.palette&&hex(ctx.palette.dark)&&lum(hex(ctx.palette.dark))<.04)?ctx.palette.dark:"#1d140c";
  const venue=clean(fl&&fl.venue)||"The Wayfarer's Rest",sign=clean(fl&&fl.sign)||"Beds, board and a warm hearth";
  const num=String((fl&&fl.number)||yr2(f.year)||"07").replace(/[^0-9A-Za-z]/g,"").slice(0,6)||"07";
  const stills=(ctx.stills||[]).slice(),poster=ctx.poster||(((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&f.id)?TMDB_POSTERS[f.id]:null)||null;
  const posterSrc=poster?ctx.img(poster,"w780"):"";
  const heroSrc=posterSrc||(stills[0]?ctx.img(stills[0],"w1280"):"");
  const sealSrc=stills[1]?ctx.img(stills[1],"w780"):(stills[0]?ctx.img(stills[0],"w780"):"");
  const B=E.body,D=E.disp,w=T.wear,pf=[E.photo,T.f].filter(Boolean).join(" ")||"none";
  const nItems=["s","m","w","d"].reduce((a,k)=>a+Math.min(4,((ctx.menu||{})[k]||[]).length),0);
  const sealRed=(()=>{const c=hex(acc);return c&&c[0]>c[1]*1.4&&c[0]>c[2]*1.4?acc:"#8e1b12"})();

  /* parchment: stock, mottling, burnt edge, shared grain */
  const mott=`radial-gradient(circle at 22% 30%,rgba(${E.edge},${(.06+.08*w).toFixed(2)}) 0,transparent 22%),radial-gradient(circle at 78% 62%,rgba(${E.edge},${(.05+.08*w).toFixed(2)}) 0,transparent 26%),radial-gradient(circle at 40% 88%,rgba(${E.edge},${(.04+.07*w).toFixed(2)}) 0,transparent 20%)`;
  const burn=`radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 58%,rgba(${E.edge},${(.22+.3*w).toFixed(2)}) 92%,rgba(40,20,5,${(.45+.35*w).toFixed(2)}) 100%)`;
  const bg=`background:${burn},${mott},url(${GRAIN}) center/520px,${paper};background-blend-mode:normal,normal,normal,normal,multiply`;

  /* header: venue, sign, ornament rule */
  const venueSize=venue.length<=16?54:venue.length<=24?48:42;
  const head=`<div style="position:absolute;left:60px;right:60px;top:26px;text-align:center">
    <div data-fitw="${venueSize}" data-min="28" style="font-family:${D};font-weight:${E.dw};font-size:${venueSize}px;line-height:1.05;color:${ink};white-space:nowrap;overflow:hidden;${E.up?"text-transform:uppercase;letter-spacing:.06em":""}">${esc(venue)}</div>
    <div style="margin-top:6px;font:italic 400 20px/1.2 ${B};color:${acc};white-space:nowrap;overflow:hidden">${esc(sign)}</div>
    <div style="margin-top:6px;display:flex;align-items:center;gap:12px;color:${acc}"><div style="flex:1;border-top:1px solid ${ink};opacity:.6"></div><div style="font:400 20px/1 ${B}">${E.orn}</div><div style="flex:1;border-top:1px solid ${ink};opacity:.6"></div></div>
  </div>`;

  /* map plate: the still, compass letters set in type at the edges */
  const bb=band(ctx.era||"modern"),bw={P:8,S:6,E:2,M:7}[bb];
  const PX=52,PY=152,ph=684,pw=456,PW=pw+2*bw,PH=ph+2*bw;
  const heroImg=posterSrc
    ?`<img src="${posterSrc}" crossorigin="anonymous" alt="" style="position:absolute;left:0;top:0;width:${pw}px;height:${ph}px;object-fit:contain">`
    :(heroSrc?`<img src="${heroSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:${pf}">`:`<div style="position:absolute;inset:0;background:${darkPanel}"></div>`);
  const bear=(t,pos)=>`<div style="position:absolute;${pos};font:${E.dw} 20px/1 ${D};color:${acc};width:24px;text-align:center">${t}</div>`;
  /* logo sits in the foot band, never over the poster */
  const logo=logoPanel(ctx,{font:D,typeSize:36,typeInk:"#f4ead2",lightInk:ink,maxW:210,maxH:84,dark:darkPanel,light:"#f3e8cc",
    wrap:`position:absolute;left:44px;top:892px;box-shadow:0 3px 14px rgba(0,0,0,.4);border:1px solid rgba(255,240,200,.35)`});
  const by=clean(fl&&fl.note&&fl.note.by)||"The Innkeeper";
  /* the seal: a real photo (poster crop) pressed into a round medallion with a wax coloured rim; no drawn art */
  const sealAlt=stills[0]?ctx.img(stills[0],"w780"):"";
  const seal=!sealSrc?"":`<div data-seal="1" style="position:absolute;right:52px;top:884px;width:104px;height:104px;transform:rotate(${T.tilt}deg);z-index:3">
    <div style="position:absolute;inset:0;border-radius:50%;border:7px solid ${sealRed};box-shadow:0 4px 12px rgba(0,0,0,.45),inset 0 0 14px rgba(0,0,0,.55);overflow:hidden;background:${sealRed}">${sealSrc?`<img src="${sealSrc}" alt="" data-alt="${sealAlt}" onerror="var a=this.getAttribute('data-alt');if(a){this.removeAttribute('data-alt');this.src=a}else{this.closest('[data-seal]').style.display='none'}" style="width:100%;height:100%;object-fit:cover;object-position:50% 28%;filter:sepia(.35) saturate(1.1) contrast(1.05)">`:""}</div>
    <div style="position:absolute;left:50%;bottom:-14px;transform:translateX(-50%);background:${sealRed};color:#f6e6c8;font:${E.dw} 15px/1 ${D};letter-spacing:.04em;padding:4px 8px 3px;white-space:nowrap">No. ${esc(num)}</div></div>`;
  const plate=`<div style="position:absolute;left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px">
    ${bear("S","left:50%;bottom:-26px;margin-left:-12px")}${bear("W","left:-30px;top:50%;margin-top:-10px")}${bear("E","right:-30px;top:50%;margin-top:-10px")}
    <div style="position:absolute;inset:0;${E.plate};box-sizing:border-box;padding:${bb==="P"?5:bb==="M"?6:0}px"><div style="position:relative;width:${pw}px;height:${ph}px;overflow:hidden;background:#1a120a">${heroImg}</div></div>
    <div style="position:absolute;left:50%;top:-31px;transform:translateX(-50%);z-index:2;background:${paper};border:1px solid ${ink};padding:3px 9px 2px;font:${E.dw} 20px/1 ${D};color:${acc}">N</div>
    </div>${logo.html}${seal}`;

  /* bill of fare: two columns with a rule between, dotted leaders to coin prices */
  const m=ctx.menu||{};
  const secHead=t=>`<div style="break-inside:avoid;text-align:center;white-space:nowrap;margin:0 0 .3em;font-family:${D};font-weight:${E.dw};font-size:max(18px,1.08em);line-height:1.1;color:${acc};${E.up?"text-transform:uppercase;letter-spacing:.1em":""}">${E.up&&t.length>12?esc(t):`${E.orn} ${esc(t)} ${E.orn}`}</div>`;
  function row(it,ci,ii){
    const n=clean(it.n),p=price(f,fl,ci,ii,n,fl&&fl.coin?(b=>b+" "+fl.coin):E.coin);
    return `<div style="break-inside:avoid;margin:0 0 .45em"><div style="display:flex;align-items:baseline;gap:.3em"><span style="font:600 max(15px,1em)/1.15 ${B};color:${ink}">${esc(n)}</span><span style="flex:1;min-width:1em;border-bottom:2px dotted ${ink};opacity:.45;transform:translateY(-.2em)"></span><span style="flex:none;font:italic 600 max(15px,.86em)/1.15 ${B};color:${acc}">${esc(p)}</span></div>
      ${it.note?`<div data-note="1" style="font:italic 400 max(14px,.74em)/1.28 ${B};color:${ink};opacity:.9;margin-top:.08em">${esc(sent(it.note))}</div>`:""}</div>`;
  }
  let flow="";
  ["s","m","w","d"].forEach((k,ci)=>{const items=(m[k]||[]).slice(0,4);if(!items.length)return;
    flow+=`<div style="break-inside:avoid">${secHead(LAB[ci])}${row(items[0],ci,0)}</div>`+items.slice(1).map((it,ii)=>row(it,ci,ii+1)).join("")+`<div style="height:.35em"></div>`});
  const note=fl&&fl.note&&clean(fl.note.text);
  const wordBox=`<div data-fit="22" style="position:absolute;left:310px;top:888px;width:340px;height:108px;overflow:hidden;text-align:center;font-size:22px;border-top:1px solid ${ink};border-bottom:1px solid ${ink};padding:.2em 0;box-sizing:border-box">
    <div style="font:400 max(14px,.64em)/1.2 ${B};letter-spacing:.18em;text-transform:uppercase;color:${acc}">A word from ${esc(by)}</div>
    <div data-note="1" style="font:italic 400 max(15px,.8em)/1.25 ${B};color:${ink};margin-top:.1em">"${esc(note||"Wipe your boots, warm your hands and sit where you like. The kettle is always on and the hearth never goes out.")}"</div>
    <div data-drop="1" style="font:400 max(26px,1.3em)/1.05 'Pinyon Script',cursive;color:${ink}">${esc(by)}</div></div>`;
  if(f.P)flow+=`<div data-drop2="1" style="margin:0 0 .5em;text-align:center;font-size:max(15px,.76em);line-height:1.3;color:${ink}"><span style="font-family:${D};font-weight:${E.dw};color:${acc}">When the bell rings: </span><span style="font-style:italic">${esc(sent(f.P))}</span></div>`;
  const winks=((fl&&fl.winks)||[]).slice(0,5).map(clean).filter(Boolean);
  if(winks.length)flow+=`<div data-drop="1" style="break-inside:avoid;text-align:center;font-size:max(14px,.64em);line-height:1.3;color:${ink}"><span style="letter-spacing:.16em;text-transform:uppercase;color:${acc}">Heard by the fire </span>${winks.map(esc).join(` ${E.orn} `)}</div>`;

  const MX=PX+PW+40,MY=PY,MH=PH+8;
  const menu=`<div data-fit="26" style="position:absolute;left:${MX}px;top:${MY}px;width:${W-MX-36}px;height:${MH}px;overflow:hidden;font-size:26px">${flow}</div>`;
  /* rooms and stabling only for a real inn (the Prancing Pony, the Three Broomsticks), not a workshop, castle kitchen or ball (Rise of the Guardians, A Christmas Carol) */
  const inn=/\b(inn|tavern|alehouse|beds|rooms)\b/i.test(venue+" "+sign);
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:20px;text-align:center;font:italic 400 15px/1.2 ${B};color:${ink};white-space:nowrap;overflow:hidden">${inn?"Rooms above, stabling round the back. ":""}Coin of the realm only. Bill No. ${esc(num)}, ${esc(f.year||"")}. Images: TMDB</div>`;

  const face=`<div style="position:absolute;inset:0;${bg};font-family:${B}">
    <div style="position:absolute;inset:14px;${E.frame};pointer-events:none;opacity:.75"></div>
    ${head}${plate}${menu}${wordBox}${foot}
    <img src="${PIX}" alt="" style="position:absolute;width:1px;height:1px;opacity:0" onload="window.__fmtFitTavern&&window.__fmtFitTavern(this)">
  </div>`;
  return {w:W,h:H,faces:[face]};
};
})();
