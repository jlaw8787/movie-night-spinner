/* Format: candybar. A cinema candy bar board, one landscape face 1344x816.
   Left: the lightbox (backlit still with the logo on its own panel), then the projection booth note and two ticket stubs (type only).
   Right: the venue header, one priced board per course, the combo line and the coming attractions fine print.
   Era sets the board (letter board felt, backlit acrylic, neon edged, digital screen), type pairing and frame. Tone sets lighting, wear and voice. */
(function(){
const ID="candybar",W=1344,H=816;
/* ---------- shared helpers ---------- */
const IMG="https://image.tmdb.org/t/p/";
const clean=s=>String(s==null?"":s).replace(/\s*[–—]\s*/g,", ").replace(/\s+-\s+/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sent=s=>{s=clean(s).trim();if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};
const DRY=[[/\bred wine\b|\bwhite wine\b|\bmulled wine\b|\bwine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b|\bbubbly\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bale\b/gi,"cider punch"],[/\bcocktails?\b/gi,"mocktail"],[/\bpunch\b(?! bowl)/gi,"fruit punch"],[/\b(rum|vodka|gin|whisky|whiskey|bourbon|tequila|brandy|sherry|liqueur|mead|sake|schnapps|cognac)\b/gi,"syrup"]];
const dry=s=>DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s));
const hex=h=>{h=String(h||"").replace("#","");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const readable=(fg,bg,r)=>{let a=hex(fg),b=hex(bg);const to=lum(b)>.35?[0,0,0]:[255,255,255];for(let k=0;k<16&&contrast(a,b)<r;k++)a=mix(a,to,.12);return toHex(a)};
const eraGroup=e=>/19[345]0/.test(e)?"old":/19[67]0/.test(e)?"mid":/19[89]0/.test(e)?"late":"new";
const NOISE="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .4  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>");
const BLOTCH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.005' numOctaves='4' seed='3'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .25  0 0 0 .38 0'/></filter><rect width='900' height='900' filter='url(#b)'/></svg>");
function loadFonts(key,fams){const id="fmt-font-"+key;if(document.getElementById(id))return;const l=document.createElement("link");l.id=id;l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+fams.map(f=>"family="+f).join("&")+"&display=block";document.head.appendChild(l)}
/* shrink-to-fit: any [data-fit] box scales its own font-size (children use em) until nothing overflows; data-min is the floor */
if(!window.__fmtFit){
  window.__fmtFit=()=>document.querySelectorAll("[data-fit]").forEach(el=>{
    if(!el.dataset.base)el.dataset.base=parseFloat(el.style.fontSize)||16;
    let fs=+el.dataset.base;const min=+el.dataset.min||14;el.style.fontSize=fs+"px";
    const over=()=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;
    for(let n=0;n<60&&over()&&fs>min;n++){fs=Math.max(min,fs*.97);el.style.fontSize=fs+"px"}});
  const run=()=>{try{window.__fmtFit()}catch(e){}};
  window.__fmtFitLater=()=>{[0,300,1200,2000].forEach(t=>setTimeout(run,t));if(document.fonts){document.fonts.ready.then(run);document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",run)}};
}
/* logo panel: sample the logo's own colours and put it on whichever stock reads */
if(!window.__fmtLogo){
  window.__fmtLogo=im=>{try{const p=im.closest("[data-lpanel]");if(!p)return;const c=document.createElement("canvas"),w=80,h=Math.max(8,Math.round(80*im.naturalHeight/im.naturalWidth));c.width=w;c.height=h;
    const g=c.getContext("2d");g.drawImage(im,0,0,w,h);const d=g.getImageData(0,0,w,h).data;let s=0,n=0;
    for(let i=0;i<d.length;i+=4)if(d[i+3]>140){s+=lum([d[i],d[i+1],d[i+2]]);n++}
    if(!n)return;const L=s/n;p.style.background=L>.28?p.dataset.dark:p.dataset.light;p.style.color=L>.28?p.dataset.darkink:p.dataset.lightink}catch(e){}};
  window.__fmtLogoFail=im=>{im.style.display="none";const t=im.nextElementSibling;if(t)t.style.display="block";try{window.__fmtFit()}catch(e){}};
}
const rootPath=ctx=>ctx.root!=null?ctx.root:(/\/wip\//.test(location.pathname)?"../../../":"");
const isFamily=f=>/^(kids|fairytale|xmas)$/.test(f.theme||"")||/^(G|PG)$/.test(((window.RATINGS||{})[f.id])||"");
/* ---------- candybar ---------- */
const ERA={
  old:{disp:"'Josefin Sans',sans-serif",body:"'Josefin Slab',serif",fonts:["Josefin+Sans:wght@600;700","Josefin+Slab:wght@500;700"],dw:700,it:"normal",
       board:"felt",frame:"linear-gradient(135deg,#8d8d8d,#f4f4f4 25%,#9a9a9a 45%,#ffffff 62%,#7c7c7c 85%,#d8d8d8)",wall:[92,22,30],photo:"saturate(1.05) contrast(1.05) sepia(.08)"},
  mid:{disp:"'Chivo',sans-serif",body:"'Chivo',sans-serif",fonts:["Chivo:ital,wght@0,400;0,700;0,900;1,400"],dw:900,it:"normal",
       board:"acrylic",frame:"linear-gradient(135deg,#6b5a3a,#d9c89a 30%,#8a744a 55%,#e6d6aa 75%,#6b5a3a)",wall:[86,52,28],photo:"saturate(1.18) contrast(1.04)"},
  late:{disp:"'Exo 2',sans-serif",body:"'Exo 2',sans-serif",fonts:["Exo+2:ital,wght@0,500;0,700;1,800;1,900"],dw:800,it:"italic",
       board:"neon",frame:"linear-gradient(180deg,#3a3a40,#15151a)",wall:[14,12,20],photo:"saturate(1.2) contrast(1.08)"},
  new:{disp:"'Encode Sans Condensed',sans-serif",body:"'Barlow',sans-serif",fonts:["Encode+Sans+Condensed:wght@700;800","Barlow:wght@500;600;700"],dw:700,it:"normal",
       board:"screen",frame:"linear-gradient(180deg,#26272b,#0c0c0e)",wall:[26,27,31],photo:"saturate(1.1) contrast(1.04)"}
};
const TONE={
  playful:{light:1.25,wear:.1,photo:" saturate(1.12) brightness(1.04)",glow:1,kick:"Snacks before the show",coming:"Coming soon"},
  glossy:{light:1.1,wear:0,photo:" saturate(1.08)",glow:1,kick:"Now showing, main house",coming:"Coming attractions"},
  warm:{light:1.1,wear:.3,photo:" sepia(.06)",glow:.8,kick:"Refreshments in the lobby",coming:"Coming attractions"},
  tender:{light:1.05,wear:.2,photo:" brightness(1.04) saturate(.95)",glow:.7,kick:"Something sweet first",coming:"Next week"},
  grand:{light:1,wear:.15,photo:" contrast(1.05)",glow:.9,kick:"The palace of the pictures",coming:"Coming attractions"},
  eerie:{light:.7,wear:.5,photo:" saturate(.75) brightness(.95)",glow:.45,kick:"Late show, doors lock soon",coming:"Midnight next week"},
  tense:{light:.85,wear:.3,photo:" contrast(1.12) saturate(.9)",glow:.7,kick:"No talking in the picture",coming:"Coming attractions"},
  gritty:{light:.85,wear:.8,photo:" contrast(1.1) saturate(.85)",glow:.55,kick:"Cash only, no refunds",coming:"Held over"},
  scrappy:{light:.95,wear:.7,photo:" contrast(1.15) saturate(.9)",glow:.6,kick:"Under new management",coming:"Coming soon, probably"}
};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},eg=eraGroup(ctx.era||"modern"),E=ERA[eg],T=TONE[ctx.tone]||TONE.playful,root=rootPath(ctx);
  loadFonts(ID+"-"+eg,E.fonts.concat(["Nothing+You+Could+Do"]));
  const fam=isFamily(f),fl=ctx.flavour||null,menu=ctx.menu||{};
  const txt=s=>fam?dry(s):clean(s);
  if(!ctx.poster&&typeof TMDB_POSTERS!=="undefined")ctx.poster=TMDB_POSTERS[f.id]||null;
  const pd=hex(ctx.palette&&ctx.palette.dark)||[30,20,20],pa0=hex(ctx.palette&&ctx.palette.accent);
  const pa=pa0&&Math.max(...pa0)-Math.min(...pa0)>=35?pa0:[214,58,46];
  /* lobby wall: the era's wall colour, pulled toward the film's dark, lit by the tone */
  const wall=mix(mix(E.wall,pd,.35),[0,0,0],Math.max(0,1-T.light)*.6);
  const WALL=toHex(wall),WALL2=toHex(mix(wall,[255,255,255],.12*T.light));
  /* lit accent for glow and prices: push the film accent bright and saturated */
  let lit=pa;for(let k=0;k<8&&lum(lit)<.32;k++)lit=mix(lit,[255,240,200],.14);
  const LIT=toHex(lit);
  const yy=String(f.year||"").slice(-2),num=String(fl&&fl.number||"").replace(/\D/g,"").slice(0,3);
  const venue=clean(fl&&fl.venue||"The Picture House");
  const sign=clean(fl&&fl.sign||"Tonight's feature on the big screen");
  const note=fl&&fl.note&&fl.note.text?{t:txt(fl.note.text),by:clean(fl.note.by||"The Manager")}:{t:"Grab a seat, grab a box, and keep the noise down once the lights go out. Enjoy the picture.",by:"The Manager"};
  const winks=(fl&&fl.winks||[]).map(txt).filter(Boolean);
  const prop=fl&&fl.prop&&fl.prop.title?{kind:clean(fl.prop.kind||"ticket"),title:clean(fl.prop.title),lines:(fl.prop.lines||[]).map(clean).slice(0,2)}:{kind:"ticket",title:"Admit One",lines:["Good for tonight's feature","Keep this stub"]};
  const stills=(ctx.stills||[]).filter(Boolean);
  const heroIsPoster=!!ctx.poster;
  const hero=heroIsPoster?IMG+"w780"+ctx.poster:(stills[0]?IMG+"w1280"+stills[0]:"");
  const heroPos="50% 40%";
  const grain=`${root}assets/era/_shared/paper-grain.webp`;

  /* ---------- the boards: one per course, priced, combo number in the header ---------- */
  const LAB=fam?{s:"Snack Bar",m:"Hot Counter",w:"Candy Case",d:"Fountain"}:{s:"Snack Bar",m:"Hot Counter",w:"Candy Case",d:"Fountain and Bar"};
  const keys=["s","m","w","d"].filter(k=>(menu[k]||[]).length);
  const nIt=keys.reduce((a,k)=>a+menu[k].length,0),heavy=nIt>8;
  const PR={s:["4.50","5.25","3.95","4.75"],m:["7.95","8.50","6.95","7.25"],w:["3.25","3.75","2.95","3.50"],d:["3.50","2.95","3.95","3.25"]};
  const price=(k,i)=>k==="w"&&i===0&&yy?"2."+yy:k==="m"&&i===0&&num?(num.length===1?num+".95":num.length===2?num[0]+"."+num[1]+"5":num[0]+"."+num.slice(1)):PR[k][i%4];
  const combo="12."+(yy||"50");
  let boardBg,boardInk,boardEdge,boardHead,headInk,priceInk,noteInk;
  if(E.board==="felt"){boardBg=`repeating-linear-gradient(180deg,#141414 0 7px,#0a0a0a 7px 9px)`;boardInk="#f5f2ea";boardEdge=`6px solid #2a2a2a;outline:2px solid #8f8f8f`;boardHead=toHex(mix(pa,[0,0,0],.25));headInk=readable("#f5f2ea",toHex(mix(pa,[0,0,0],.25)),4.5);priceInk="#f5f2ea";noteInk="#cfc9bb"}
  else if(E.board==="acrylic"){const bg=mix(lit,[255,248,225],.55);boardBg=`radial-gradient(ellipse at 50% 40%,${toHex(mix(bg,[255,255,255],.35))},${toHex(bg)})`;boardInk=readable("#3a2210",toHex(bg),7);boardEdge=`5px solid #3b2a18`;boardHead=toHex(mix(pa,[0,0,0],.45));headInk=readable("#fff1d6",toHex(mix(pa,[0,0,0],.45)),4.5);priceInk=readable(toHex(mix(pa,[0,0,0],.4)),toHex(bg),4.5);noteInk=readable("#5a3e24",toHex(bg),4.5)}
  else if(E.board==="neon"){boardBg=`linear-gradient(180deg,#0b0b10,#050507)`;boardInk="#ffffff";boardEdge=`2px solid ${LIT};box-shadow:0 0 ${14*T.glow}px ${LIT}`;boardHead="transparent";headInk=LIT;priceInk=LIT;noteInk="#c9c9d6"}
  else {boardBg=`linear-gradient(180deg,#141519,#0b0c0e)`;boardInk="#f4f5f7";boardEdge=`3px solid #2c2d32`;boardHead=toHex(mix(pa,[0,0,0],.15));headInk=readable("#ffffff",toHex(mix(pa,[0,0,0],.15)),4.5);priceInk=readable(LIT,"#121316",4.5);noteInk="#b9bcc4"}
  const up=E.board==="felt"?"uppercase":"none",trk=E.board==="felt"?".06em":"0";
  const clamp=n=>`display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${n};overflow:hidden;`;
  const boards=keys.map((k,ci)=>`<div style="background:${boardBg};border:${boardEdge};margin-bottom:.32em;${E.board==="screen"?"border-radius:6px;":""}">
     <div style="display:flex;justify-content:space-between;align-items:baseline;background:${boardHead};padding:.16em .5em .12em;${E.board==="neon"?`border-bottom:1px solid ${LIT}66;`:""}">
       <span style="font:${E.it} ${E.dw} .8em/1.1 ${E.disp};font-size:max(16px,.8em);letter-spacing:.12em;text-transform:uppercase;color:${headInk}${E.board==="neon"?`;text-shadow:0 0 ${8*T.glow}px ${LIT}`:""}">${esc(LAB[k])}</span>
       <span style="font:700 .62em/1 ${E.body};font-size:max(14px,.62em);letter-spacing:.2em;text-transform:uppercase;color:${headInk}">Board ${ci+1}</span></div>
     <div style="padding:.22em .5em .26em">
     ${(menu[k]||[]).map((it,ii)=>`<div style="margin:.1em 0 ${heavy?".1em":".2em"}">
        <div style="display:flex;justify-content:space-between;gap:.6em;align-items:baseline">
          <span style="font:${E.it} ${E.dw} 1em/1.1 ${E.disp};text-transform:${up};letter-spacing:${trk};color:${boardInk};${heavy?clamp(1):""}">${esc(txt(it.n))}</span>
          <span style="flex:none;font:${E.it} ${E.dw} 1em/1.1 ${E.disp};color:${priceInk}${E.board==="neon"?`;text-shadow:0 0 ${6*T.glow}px ${LIT}`:""}">${price(k,ii)}</span></div>
        ${it.note&&!(nIt>12&&ii>0)?`<div style="font:500 .74em/1.25 ${E.body};font-size:max(15px,.74em);color:${noteInk};margin-top:.08em;${heavy?clamp(1):""}">${esc(sent(txt(it.note)))}</div>`:""}</div>`).join("")}
     </div></div>`).join("");

  /* ---------- the wall and the lightbox ---------- */
  const wallTex=`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 35%,${WALL2},${WALL} 70%)"></div>
    ${eg==="old"?`<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px 64px);opacity:.5"></div>`:""}
    ${eg==="mid"?`<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,220,160,.07) 0 30px,rgba(0,0,0,.08) 30px 60px)"></div>`:""}
    <div style="position:absolute;inset:0;background:url('${grain}') 0 0/520px,url(&quot;${NOISE}&quot;) 0 0/300px;opacity:${.25+T.wear*.35};mix-blend-mode:overlay;pointer-events:none"></div>
    ${T.wear>.3?`<div style="position:absolute;inset:0;background:url(&quot;${BLOTCH}&quot;) 0 0/900px;opacity:${T.wear*.6};mix-blend-mode:multiply"></div>`:""}`;
  const half=eg==="mid"?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.2) 30%,transparent 32%) 0 0/4px 4px;opacity:.25;mix-blend-mode:multiply"></div>`:"";
  const posterBox=hero=>`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,${toHex(mix(lit,[255,244,214],.25))}55,rgba(0,0,0,0) 62%),linear-gradient(180deg,#1a1512,#0d0b0a);display:flex;align-items:center;padding:0 16px 0 14px;box-sizing:border-box;gap:22px">
      <img crossorigin="anonymous" alt="" src="${hero}" style="flex:none;display:block;height:calc(100% - 28px);width:auto;border:3px solid #f1ead8;box-shadow:0 0 ${30*T.glow}px rgba(255,240,210,${.35*T.glow}),0 6px 16px rgba(0,0,0,.6)">
      <div style="flex:1;min-width:0;display:flex;justify-content:center">@@LOGO@@</div></div>
`;
  const photo=heroIsPoster&&hero?posterBox(hero):hero?`<img alt="" src="${hero}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${heroPos};display:block;filter:${E.photo}${T.photo} brightness(${(1+.06*T.glow).toFixed(2)})">${half}
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(255,255,255,${.1*T.glow}),rgba(255,255,255,0) 60%);mix-blend-mode:screen"></div>
      <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${30+40*(1-T.glow)}px rgba(0,0,0,${.25+.3*(1-T.glow)})"></div>`
    :`<div style="position:absolute;inset:0;background:radial-gradient(circle,${toHex(mix(pa,[255,255,255],.3))},${toHex(mix(pa,[0,0,0],.4))});display:flex;align-items:center;justify-content:center"><div style="font:${E.it} ${E.dw} 54px/1.1 ${E.disp};color:#fff;text-align:center;padding:40px">${esc(sign)}</div></div>`;
  const frameW=eg==="new"?8:eg==="late"?14:16;
  const lg=ctx.logo,lr=lg&&lg[0]&&lg[1]&&lg[2]?lg[1]/lg[2]:0;
  const LW=heroIsPoster?236:400;
  const lh=lr?Math.min(120,Math.round(LW/lr)):0,lw=lr?Math.round(lh*lr):0;
  const tl=clean(f.title).length,tsz=tl<=14?60:tl<=26?46:tl<=40?36:30;
  const titleType=`<div style="font:${E.it} ${E.dw} ${tsz}px/1.02 ${E.disp};text-transform:uppercase;color:currentColor;max-width:${LW+40}px">${esc(f.title)}</div>`;
  const logoPanel=(abs)=>`<div data-lpanel data-dark="rgba(10,10,14,.8)" data-light="rgba(250,247,240,.9)" data-darkink="#fff" data-lightink="#151515" style="${abs?`position:absolute;left:${frameW+22}px;bottom:${frameW+22}px;max-width:470px;`:"position:relative;max-width:100%;box-sizing:border-box;"}padding:16px 22px 14px;background:rgba(10,10,14,.8);color:#fff;border-radius:${eg==="new"?10:4}px;box-shadow:0 6px 18px rgba(0,0,0,.45)">
      ${lr?`<img crossorigin="anonymous" alt="${esc(f.title)}" src="${IMG}w500${lg[0]}" onload="window.__fmtLogo&&__fmtLogo(this)" onerror="window.__fmtLogoFail&&__fmtLogoFail(this)" style="display:block;height:${lh}px;width:${lw}px;max-width:${LW+26}px;object-fit:contain"><div style="display:none">${titleType}</div>`:titleType}
      <div style="font:700 15px/1 ${E.body};letter-spacing:.26em;text-transform:uppercase;margin-top:10px;opacity:.9">Now showing &nbsp;·&nbsp; ${esc(f.year)}</div></div>`;
  const lightbox=`<div style="position:absolute;left:22px;top:22px;width:806px;height:574px;padding:${frameW}px;box-sizing:border-box;background:${E.frame};border-radius:${eg==="new"?12:eg==="late"?4:2}px;box-shadow:0 0 ${50*T.glow}px rgba(255,240,210,${.35*T.glow}),0 12px 30px rgba(0,0,0,.5)">
      <div style="position:relative;width:100%;height:100%;overflow:hidden;background:#111;border-radius:${eg==="new"?5:0}px">${heroIsPoster?photo.replace("@@LOGO@@",logoPanel(false)):photo}</div>
      ${heroIsPoster?"":logoPanel(true)}</div>`;

  /* ---------- stubs and the manager's note ---------- */
  const perf=c=>`background:radial-gradient(circle at 0 50%,${c} 0 9px,transparent 10px),radial-gradient(circle at 100% 50%,${c} 0 9px,transparent 10px);`;
  const stubCol=eg==="old"?[196,48,48]:eg==="mid"?[236,168,52]:eg==="late"?[232,232,236]:[246,246,242];
  const STUB=toHex(mix(stubCol,lit,.25)),STUBINK=readable("#1a1a1a",toHex(mix(stubCol,lit,.25)),7);
  const stub=(kick,title,lines,w,rot,th,tf)=>`<div style="position:relative;flex:none;width:${w}px;height:168px;transform:rotate(${rot}deg)">
     <div style="position:absolute;inset:0;background:${STUB};box-shadow:0 5px 14px rgba(0,0,0,.45);-webkit-mask:radial-gradient(circle at 0 50%,transparent 11px,#000 12px) left/51% 100% no-repeat,radial-gradient(circle at 100% 50%,transparent 11px,#000 12px) right/51% 100% no-repeat;mask:radial-gradient(circle at 0 50%,transparent 11px,#000 12px) left/51% 100% no-repeat,radial-gradient(circle at 100% 50%,transparent 11px,#000 12px) right/51% 100% no-repeat"></div>
     <div style="position:absolute;left:12px;right:12px;top:10px;bottom:10px;border:1.5px dashed ${STUBINK}66"></div>
     <div style="position:absolute;left:24px;right:24px;top:18px;bottom:16px;color:${STUBINK};text-align:center;display:flex;flex-direction:column">
       <div style="font:700 14px/1.1 ${E.body};letter-spacing:.26em;text-transform:uppercase;white-space:nowrap">${esc(kick)}</div>
       <div data-fit data-min="18" style="font-size:${tf}px;height:${th}px;overflow:hidden;display:flex;align-items:center;justify-content:center;margin:2px 0;flex:none"><div style="font:${E.it} ${E.dw} 1em/1.02 ${E.disp};text-transform:uppercase">${esc(title)}</div></div>
       <div data-fit data-min="14" style="font-size:15px;flex:1;min-height:0;overflow:hidden"><div style="font:500 1em/1.25 ${E.body}">${lines.map(esc).join("<br>")}</div></div></div></div>`;
  const cue=clean(f.P||"");
  const noteCard=`<div style="position:relative;flex:none;width:300px;height:172px;background:#f7f3e8;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(1.2deg);padding:12px 16px;box-sizing:border-box;color:#232323">
     <div style="font:700 14px/1 ${E.body};letter-spacing:.22em;text-transform:uppercase;color:${readable(toHex(pa),"#f7f3e8",4.5)}">From the booth</div>
     <div data-fit data-min="15" style="font-size:19px;height:96px;overflow:hidden;margin-top:6px"><div style="font:500 1em/1.28 ${E.body}">${esc(sent(note.t))}</div></div>
     <div style="font:400 26px/1 'Nothing You Could Do',cursive;color:${readable(toHex(pa),"#f7f3e8",4.5)};text-align:right;margin-top:2px">${esc(note.by)}</div></div>`;

  const comingList=(winks.length?winks.slice(0,3):[clean(f.T||"Tonight's feature, held over by popular demand")]).map(w=>esc(w.replace(/\.$/,"")));
  const faceOld=`${wallTex}${lightbox}
   <div style="position:absolute;left:22px;top:614px;width:808px;height:184px;display:flex;gap:14px;align-items:center">
     ${noteCard}
     ${stub(prop.kind==="ticket"||prop.kind==="stub"?"Admit one":"Keep this "+prop.kind,prop.title,prop.lines,236,-2,68,28)}
     ${stub("Seat "+(num||yy||"7")+" · 7.15 pm","Tonight",[cue?"Cue: "+sent(cue):sign],230,2.2,34,26)}
   </div>
   <div style="position:absolute;left:850px;top:22px;width:472px;height:122px;background:${E.board==="acrylic"?boardBg:"#0c0c0f"};border:${boardEdge};box-sizing:border-box;padding:10px 16px;display:flex;flex-direction:column;justify-content:center;${E.board==="screen"?"border-radius:6px;":""}">
     <div style="font:700 15px/1.1 ${E.body};letter-spacing:.24em;text-transform:uppercase;color:${E.board==="acrylic"?priceInk:LIT}">${esc(T.kick)}</div>
     <div data-fit data-min="22" style="font-size:44px;height:58px;overflow:hidden;margin-top:4px;display:flex;align-items:center"><div style="font:${E.it} ${E.dw} 1em/1.04 ${E.disp};text-transform:uppercase;color:${E.board==="acrylic"?boardInk:"#fff"};${E.board==="acrylic"?"":`text-shadow:0 0 ${10*T.glow}px ${LIT}`}">${esc(venue)}</div></div>
     <div data-fit data-min="15" style="font-size:17px;height:22px;overflow:hidden;white-space:nowrap"><div style="font:500 1em/1.2 ${E.body};color:${E.board==="acrylic"?noteInk:"#d8d8de"}">${esc(sign)}</div></div></div>
   <div data-fit data-min="${heavy?14:17}" style="position:absolute;left:850px;top:156px;width:472px;height:${heavy?560:520}px;overflow:hidden;font-size:${heavy?20:26}px">${boards}</div>
   <div style="position:absolute;left:850px;top:${heavy?722:684}px;width:472px;display:flex;justify-content:space-between;align-items:baseline;background:${E.board==="acrylic"?boardHead:"#0c0c0f"};border:${E.board==="neon"?`2px solid ${LIT}`:`2px solid ${E.board==="acrylic"?"#3b2a18":"#2c2d32"}`};box-sizing:border-box;padding:8px 14px">
     <span style="font:${E.it} ${E.dw} 22px/1.1 ${E.disp};color:#fff;text-transform:uppercase">Combo ${esc(num||yy||"1")}: one of each board</span><span style="font:${E.it} ${E.dw} 26px/1 ${E.disp};color:${E.board==="acrylic"?"#fff1d6":LIT}">${combo}</span></div>
   ${heavy?"":`<div data-fit data-min="14" style="position:absolute;left:850px;top:736px;width:472px;height:62px;overflow:hidden;font-size:16px;color:${lum(wall)>.3?"#1c1c1c":"#e6e2d8"}">
     <div style="font:500 1em/1.3 ${E.body}"><b style="letter-spacing:.14em;text-transform:uppercase">${esc(T.coming)}:</b> ${comingList.join(". ")}. Prices subject to change. Poster and stills: TMDB.</div></div>`}`;

  /* poster front: the poster is the picture, framed tight on the left; logo, note and stubs in a middle column; boards on the right */
  const PH=774,PW=516,PF=eg==="new"?8:10,PX=14,PY=Math.round((H-PH-2*PF)/2);
  const posterFront=`<div style="position:absolute;left:${PX}px;top:${PY}px;width:${PW+2*PF}px;height:${PH+2*PF}px;padding:${PF}px;box-sizing:border-box;background:${E.frame};border-radius:${eg==="new"?10:2}px;box-shadow:0 0 ${40*T.glow}px rgba(255,240,210,${.35*T.glow}),0 12px 30px rgba(0,0,0,.5)">
      <img crossorigin="anonymous" alt="" src="${hero}" style="display:block;width:${PW}px;height:${PH}px;object-fit:cover;border-radius:${eg==="new"?4:0}px"></div>`;
  const MX=PX+PW+2*PF+22,MW=292,RX=MX+MW+20,RW=W-22-RX;
  const col=`<div style="position:absolute;left:${MX}px;top:${PY}px;width:${MW}px;height:${PH+2*PF}px;display:flex;flex-direction:column;justify-content:space-between;align-items:center">
     <div style="width:100%">${logoPanel(false)}</div>
     ${noteCard.replace("width:300px","width:"+(MW-4)+"px")}
     ${stub(prop.kind==="ticket"||prop.kind==="stub"?"Admit one":"Keep this "+prop.kind,prop.title,prop.lines,236,-2,68,28)}
     ${stub("Seat "+(num||yy||"7")+" · 7.15 pm","Tonight",[cue?"Cue: "+sent(cue):sign],230,2.2,34,26)}</div>`;
  const right=`<div style="position:absolute;left:${RX}px;top:22px;width:${RW}px;height:122px;background:${E.board==="acrylic"?boardBg:"#0c0c0f"};border:${boardEdge};box-sizing:border-box;padding:10px 16px;display:flex;flex-direction:column;justify-content:center;${E.board==="screen"?"border-radius:6px;":""}">
     <div style="font:700 15px/1.1 ${E.body};letter-spacing:.24em;text-transform:uppercase;color:${E.board==="acrylic"?priceInk:LIT}">${esc(T.kick)}</div>
     <div data-fit data-min="22" style="font-size:44px;height:58px;overflow:hidden;margin-top:4px;display:flex;align-items:center"><div style="font:${E.it} ${E.dw} 1em/1.04 ${E.disp};text-transform:uppercase;color:${E.board==="acrylic"?boardInk:"#fff"};${E.board==="acrylic"?"":`text-shadow:0 0 ${10*T.glow}px ${LIT}`}">${esc(venue)}</div></div>
     <div data-fit data-min="15" style="font-size:17px;height:22px;overflow:hidden;white-space:nowrap"><div style="font:500 1em/1.2 ${E.body};color:${E.board==="acrylic"?noteInk:"#d8d8de"}">${esc(sign)}</div></div></div>
   <div data-fit data-min="${heavy?14:17}" style="position:absolute;left:${RX}px;top:156px;width:${RW}px;height:${heavy?560:520}px;overflow:hidden;font-size:${heavy?20:26}px">${boards}</div>
   <div style="position:absolute;left:${RX}px;top:${heavy?722:684}px;width:${RW}px;display:flex;justify-content:space-between;align-items:baseline;background:${E.board==="acrylic"?boardHead:"#0c0c0f"};border:${E.board==="neon"?`2px solid ${LIT}`:`2px solid ${E.board==="acrylic"?"#3b2a18":"#2c2d32"}`};box-sizing:border-box;padding:8px 14px">
     <span style="font:${E.it} ${E.dw} 20px/1.1 ${E.disp};color:#fff;text-transform:uppercase">Combo ${esc(num||yy||"1")}: one of each</span><span style="font:${E.it} ${E.dw} 26px/1 ${E.disp};color:${E.board==="acrylic"?"#fff1d6":LIT}">${combo}</span></div>
   ${heavy?"":`<div data-fit data-min="14" style="position:absolute;left:${RX}px;top:736px;width:${RW}px;height:62px;overflow:hidden;font-size:16px;color:${lum(wall)>.3?"#1c1c1c":"#e6e2d8"}">
     <div style="font:500 1em/1.3 ${E.body}"><b style="letter-spacing:.14em;text-transform:uppercase">${esc(T.coming)}:</b> ${comingList.join(". ")}. Prices subject to change. Poster and stills: TMDB.</div></div>`}`;
  const face=heroIsPoster?`${wallTex}${posterFront}${col}${right}`:faceOld;

  window.__fmtFitLater();
  return {w:W,h:H,faces:[face]};
};
})();
