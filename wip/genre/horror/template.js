/* Genre menu: horror. Venue: an all-night roadside diner in a storm, renamed per film from data/film-flavour.json.
   genreCard(f, menu, poster, stills, {logo, palette, flavour}) returns the faces as HTML, inline styles only:
   front cover (rain on the window, neon raceway sign, a still over 40 percent of the face, the film's logo plate)
   and a laminated back menu (a still over 25 percent, two columns, cue slip, the character's note), plus hidden
   continued faces. horrorFit(root) runs after fonts and images load: logo plate, title, menu fit and overflow. */
(function(root){
const HORROR_ASSETS=(root.HORROR_ASSETS||"wip/genre/horror/");
const IMG="https://image.tmdb.org/t/p/";
const C={night:"#0d1014",ink:"#161a20",red:"#c42f27",neon:"#ff4b3e",paper:"#ebe6d8",bone:"#d8d1bf",mute:"#5a5d63"};
const DISP="'League Gothic','Oswald',Impact,sans-serif",SANS="'Libre Franklin','Helvetica Neue',Arial,sans-serif",SERIF="'Source Serif 4',Georgia,serif",HAND="'Homemade Apple',cursive";
const ESC=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
/* lower-case a wink only when it opens with an article, so names keep their capitals */
const low=w=>/^(The|A|An) /.test(w)?w.charAt(0).toLowerCase()+w.slice(1):w;
const yy=f=>String(f.year||"").slice(-2).padStart(2,"0");
/* diner prices: dollars from the dish name, cents are always the film's year */
const PRICE={s:[4,4],m:[9,6],w:[4,3],d:[2,3]};
const price=(f,k,n)=>{const [a,r]=PRICE[k];return (a+hash(n)%r)+"."+yy(f)};
/* per-film colour: the poster accent drives rules, prices, frames and the neon, if it is dark enough for paper,
   light enough to glow on black, and saturated enough to read as a colour. Otherwise the genre red. */
const hex2=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h||"");if(!m)return null;const n=parseInt(m[1],16);return [n>>16&255,n>>8&255,n&255]};
const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const sat=([r,g,b])=>{const mx=Math.max(r,g,b)/255,mn=Math.min(r,g,b)/255,l=(mx+mn)/2;return mx===mn?0:(mx-mn)/(1-Math.abs(2*l-1))};
const mix=([r,g,b],t)=>"#"+[r,g,b].map(v=>Math.round(v+(255-v)*t).toString(16).padStart(2,"0")).join("");
const rgba=([r,g,b],a)=>`rgba(${r},${g},${b},${a})`;
function colours(pal){
  const a=hex2(pal&&pal.accent),ok=!!(a&&lum(a)>=.05&&lum(a)<=.24&&sat(a)>=.3);
  const c=ok?a:hex2(C.red);let neon=mix(c,.3);for(let t=.3;lum(hex2(neon))<.2&&t<.8;t+=.1)neon=mix(c,t);
  return {red:ok?pal.accent:C.red,neon,glow:`0 0 2px ${mix(c,.85)},0 0 8px ${neon},0 0 22px ${rgba(c,.8)},0 0 46px ${rgba(c,.55)}`,film:ok}}
let K=colours(null);

/* title size: largest that wraps into maxLines at this width (League Gothic is about 0.4em a character) */
function titleSize(t,width,maxLines,hi,lo){
  const words=String(t).toUpperCase().split(/\s+/);
  for(let s=hi;s>=lo;s-=2){
    const per=Math.floor(width/(s*0.41));let lines=1,cur=0;
    for(const w of words){const L=w.length;if(L>per){lines+=Math.ceil(L/per)-1}
      if(cur&&cur+1+L>per){lines++;cur=L}else cur+=cur?1+L:L}
    if(lines<=maxLines)return s}
  return lo}

/* the four venue sections, mapped from the app's s, m, w, d courses */
const SECTIONS=[["s","Before Midnight","to start"],["m","The Night Shift","off the grill"],["w","The Pie Case","under glass"],["d","Behind the Counter","to drink"]];

/* best stills first: no-language (no baked-in title text) and 1280 wide or more, in TMDB's listed order */
function pickStills(st){
  if(!st||!st.length)return [];
  const big=st.filter(x=>x&&x[0]&&(+x[1]||0)>=1280),pool=big.length?big:st.filter(x=>x&&x[0]);
  return pool.filter(x=>x[3]==null).concat(pool.filter(x=>x[3]!=null)).slice(0,6)}

const TEX=n=>`${HORROR_ASSETS}${n}`;
const grain=`<div style="position:absolute;inset:0;background:url('${TEX("paper-grain.png")}') center/cover;mix-blend-mode:multiply;opacity:.55;pointer-events:none"></div>`;
function face(bg,inner,n,over){
  return `<div class="fx-face" data-face="${n}" data-horror="face" style="${n===3?"display:none;":""}position:relative;width:816px;height:1056px;overflow:hidden;background:${bg};box-sizing:border-box;flex:none">${inner}${grain}${over||""}</div>`}

/* neon tubes on a dark raceway: bright core, coloured halo, the tube's shadow on the board. One tube is dead. */
function neon(text,size,dead){
  const t=String(text);let k=-1;
  if(dead){const idx=[...t].map((c,i)=>/[A-Z]/.test(c)?i:-1).filter(i=>i>0);k=idx.length?idx[hash(t)%idx.length]:-1}
  const lit=`color:#fff6f2;-webkit-text-stroke:1px ${K.neon};text-shadow:0 7px 7px rgba(0,0,0,.75),${K.glow}`;
  const off=`color:#3a3536;-webkit-text-stroke:1px #5d5455;text-shadow:0 6px 6px rgba(0,0,0,.7)`;
  return [...t].map((c,i)=>i===k?`<span style="${off}">${ESC(c)}</span>`:ESC(c)).join("").replace(/^/,`<span style="${lit}">`)+"</span>"}

const laminate=`<div style="position:absolute;inset:0;background:url('${TEX("laminate-wear.png")}') center/cover;pointer-events:none"></div>
  <div style="position:absolute;inset:0;border:12px solid #17191e;pointer-events:none"></div>
  <div style="position:absolute;inset:6px;border:1.5px dashed rgba(235,230,216,.42);pointer-events:none"></div>`;

function front(f,poster,stills,x){
  const fl=x.flavour,W=fl&&fl.winks||[],venue=(fl&&fl.venue||"Last Light Diner").toUpperCase();
  const signTxt=fl&&fl.sign?ESC(fl.sign):"Route 13 &nbsp;/&nbsp; Mile 66";
  const vs=titleSize(venue,690,1,96,48),ks=Math.max(14,Math.min(18,Math.floor(728/(((fl&&fl.sign||"Route 13 / Mile 66").length+17)*.92))));
  const still=stills[0]&&stills[0][0],title=ESC(f.title),tag=ESC(f.T||""),desc=ESC(f.D||"");
  const bgSrc=still?IMG+"w780"+still:poster?IMG+"w342"+poster:"";
  const num=String(fl&&fl.number||"").replace(/\D/g,"");
  /* looking out through the diner window: the film's own image, blurred and dark, with rain on the glass */
  const storm=`${bgSrc?`<img alt="" crossorigin="anonymous" src="${bgSrc}" style="position:absolute;left:-60px;top:-60px;width:936px;height:1176px;object-fit:cover;filter:blur(18px) brightness(.34) saturate(.6)">`:""}
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 18% 0%,rgba(190,210,235,.2),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 45%,transparent 40%,rgba(5,7,10,.85) 100%)"></div>
    <div style="position:absolute;inset:0;background:url('${TEX("rain-glass.png")}') center/cover;opacity:.9"></div>`;
  const sign=`<div style="position:absolute;left:0;right:0;top:26px;text-align:center;white-space:nowrap;font:600 ${ks}px/1 ${SANS};letter-spacing:.26em;color:${C.bone};opacity:.85;text-transform:uppercase">${signTxt} &nbsp;/&nbsp; Open all night</div>
    <div style="position:absolute;left:34px;right:34px;top:54px;height:110px;border-radius:4px;background:linear-gradient(#1a1c21,#0c0d10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -2px 0 rgba(0,0,0,.6),0 10px 24px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;white-space:nowrap;font:400 ${vs}px/1 ${DISP};letter-spacing:.05em">${neon(venue,vs,true)}</div>
    <div style="position:absolute;left:0;right:0;top:176px;text-align:center;font:italic 400 21px/1 ${SERIF};color:${C.bone}">Coffee, pie and shelter from the storm. Est. ${ESC(f.year)}.</div>`;
  /* hero: 744 x 470 of picture, over 40 percent of the face */
  const heroImg=still?`<img alt="Still from ${title} (${ESC(f.year)})" crossorigin="anonymous" src="${IMG}w1280${still}" style="width:100%;height:100%;object-fit:cover;display:block">`
    :poster?`<img alt="" crossorigin="anonymous" src="${IMG}w342${poster}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(12px) brightness(.5)"><img alt="${title} (${ESC(f.year)}) film poster" crossorigin="anonymous" src="${IMG}w500${poster}" style="position:relative;height:100%;display:block;margin:0 auto">`:"";
  const hero=`<div style="position:absolute;left:28px;top:208px;width:760px;padding:8px 8px 0;box-sizing:border-box;background:${C.paper};box-shadow:0 16px 36px rgba(0,0,0,.65)">
      <div style="position:relative;outline:2px solid ${K.red};outline-offset:-2px;height:470px;overflow:hidden;background:#222">${heroImg}</div>
      <div style="font:italic 400 17px/1 ${SERIF};color:${C.ink};padding:9px 4px 10px;display:flex;justify-content:space-between"><span>Channel 13, the late show. The set behind the counter stays on all night.</span><span style="font:700 14px/17px ${SANS};letter-spacing:.14em;color:${C.mute};font-style:normal">${still?"STILL":"POSTER"}: TMDB</span></div></div>`;
  const P=fl&&fl.prop,prop=P?`<div style="position:absolute;left:14px;top:236px;width:214px;box-sizing:border-box;transform:rotate(-3deg);z-index:3;padding:10px 13px;box-shadow:0 8px 20px rgba(0,0,0,.55);${
      P.kind==="badge"?`background:${C.paper};border:2px solid ${K.red};outline:1px solid ${K.red};outline-offset:-7px;border-radius:10px;text-align:center`
      :P.kind==="receipt"?`background:#fbfaf6;border-top:1.5px dashed ${C.mute};border-bottom:1.5px dashed ${C.mute}`
      :`background:${C.paper};border-left:6px solid ${K.red}`}">
      <div style="font:400 26px/1 ${DISP};letter-spacing:.05em;color:${K.red};text-transform:uppercase">${ESC(P.title)}</div>
      ${(P.lines||[]).slice(0,3).map(l=>`<div style="font:600 15px/1.3 ${SANS};color:${C.ink};margin-top:4px">${ESC(l)}</div>`).join("")}</div>`:"";
  /* the film's own logo in its own colours, on a dark plate or a light enamel plate (horrorFit picks); set type if no logo */
  const lg=x.logo&&x.logo[0]?x.logo:null,ts=titleSize(f.title,420,2,80,40);
  let logoHTML="";
  if(lg){const ar=(+lg[1]||4)/(+lg[2]||1),w=Math.min(318,96*ar),h=w/ar;
    logoHTML=`<div data-h="plate" style="display:inline-block;padding:10px 16px;border-radius:3px;background:rgba(6,8,10,.62);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)"><img data-h="logo" alt="${title}" crossorigin="anonymous" src="${IMG}w500${lg[0]}" style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain"></div>`}
  const info=`<div data-h="info" style="position:absolute;left:44px;right:296px;top:738px;bottom:50px;display:flex;flex-direction:column;justify-content:center;gap:10px">
      <div style="white-space:nowrap;font:700 17px/1 ${SANS};letter-spacing:.18em;color:${K.neon};text-transform:uppercase">Tonight on the late show</div>
      <div style="display:flex;align-items:flex-end;gap:16px">${logoHTML}<div data-h="${lg?"alt":"title"}" data-max="${ts}" style="${lg?"display:none;":""}font:400 ${ts}px/.95 ${DISP};letter-spacing:.02em;color:${C.paper};text-transform:uppercase">${title}</div><span style="font:400 40px/1 ${DISP};color:${K.neon};letter-spacing:.08em;flex:none">${ESC(f.year)}</span></div>
      <div style="font:italic 600 24px/1.25 ${SERIF};color:#fff">${tag}</div>
      <div data-h="fdesc" style="font:400 20px/1.36 ${SERIF};color:${C.bone}">${desc}</div></div>`;
  const notice=`<div style="position:absolute;top:748px;right:30px;width:240px;box-sizing:border-box;transform:rotate(2.5deg);background:${C.paper};color:${C.ink};padding:13px 15px;box-shadow:0 8px 22px rgba(0,0,0,.55);border-top:6px solid ${K.red}">
    <div style="font:400 30px/1 ${DISP};letter-spacing:.06em;color:${K.red}">STORM NOTICE</div>
    <div style="font:400 17px/1.32 ${SERIF};margin-top:6px">Phone lines down since ten. Kitchen open till the lights go.${W[3]&&W[3].length<=48?` Last seen out on the road: ${ESC(low(W[3]))}.`:" Bridge out past mile 13."}</div>
    <div style="font:700 14px/1 ${SANS};letter-spacing:.18em;margin-top:9px;color:${C.mute}">THE MANAGEMENT</div></div>`;
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:20px;display:flex;justify-content:space-between;font:600 15px/1 ${SANS};letter-spacing:.14em;color:${C.bone};opacity:.75;text-transform:uppercase">
    <span>Doors lock at 3:00 a.m.</span><span>Booth service till dawn</span><span>Form No. ${num||"13-"+yy(f)}</span></div>`;
  return face(C.night,storm+sign+hero+prop+info+notice+foot,1);
}

/* the back: a laminated menu in a stitched vinyl sleeve, a full-width still across the top (over 25 percent of the face) */
function topStill(src,h,venue,kick,head,size){
  return `<div data-h="band" style="position:absolute;left:12px;right:12px;top:12px;height:${h}px;overflow:hidden;background:${C.night}">
    ${src?`<img alt="" crossorigin="anonymous" src="${IMG}w1280${src}" style="width:100%;height:100%;object-fit:cover;display:block">`:""}
    <div style="position:absolute;left:0;right:0;bottom:0;height:55%;background:linear-gradient(transparent,rgba(8,10,13,.88))"></div>
    <div style="position:absolute;left:32px;bottom:22px">
      <div style="font:600 16px/1 ${SANS};letter-spacing:.3em;color:${C.bone};margin-bottom:10px">${kick}</div>
      <div style="font:400 ${size}px/1 ${DISP};letter-spacing:.04em">${neon(head,size,false)}</div></div>
    ${src?`<div style="position:absolute;right:20px;bottom:18px;max-width:300px;text-align:right;font:italic 400 15px/1.3 ${SERIF};color:#e9e4d6;text-shadow:0 1px 3px rgba(0,0,0,.9)">The window booth at ${ESC(venue)}, after midnight.<br><span style="font:700 14px/1.6 ${SANS};letter-spacing:.14em;font-style:normal">STILL: TMDB</span></div>`:""}</div>`}

function back(f,menu,poster,stills,x){
  const fl=x.flavour,W=fl&&fl.winks||[],N=fl&&fl.note,num=String(fl&&fl.number||"").replace(/\D/g,"");
  const venue=fl&&fl.venue||"the Last Light Diner";
  /* the film's number hides in one price: 2 digits as the cents of the first drink, 3 or 4 as the first main */
  const special={};if(num.length===2&&menu.d&&menu.d[0])special["d0"]=(2+hash(menu.d[0].n)%3)+"."+num;
  if((num.length===3||num.length===4)&&menu.m&&menu.m[0])special["m0"]=(+num/100).toFixed(2);
  const s2=(stills[1]||stills[0]||[])[0];
  const band=topStill(s2,296,venue,"OPEN TILL THE STORM PASSES","THE MENU",88);
  const item=(k,it)=>`<div data-h="item" style="break-inside:avoid;padding-bottom:16px">
      <div style="display:flex;align-items:baseline;gap:10px"><b data-h="dish" style="font:700 28px/1.12 ${SANS};color:${C.ink};flex:1 1 auto;min-width:0">${ESC(it.n)}</b><span data-h="price" style="font:700 28px/1 ${SANS};color:${K.red};flex:none">${special[k+((menu[k]||[]).indexOf(it))]||price(f,k,it.n)}</span></div>
      ${it.note?`<div data-h="desc" style="font:400 21px/1.3 ${SERIF};color:#3a3d43;margin-top:4px">${ESC(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`;
  const sec=([k,name,sub],its=menu[k]||[])=>its.length?`<div data-h="secblock"><div style="break-inside:avoid"><div data-h="sec" style="break-inside:avoid;display:flex;align-items:baseline;gap:12px;border-bottom:2px solid ${C.ink};box-shadow:0 3px 0 ${C.paper},0 4px 0 ${C.ink};margin:0 0 14px;padding-bottom:4px">
      <span data-h="sech" style="white-space:nowrap;font:400 44px/1 ${DISP};letter-spacing:.05em;color:${C.ink};text-transform:uppercase">${name}</span><span style="white-space:nowrap;font:italic 400 17px/1 ${SERIF};color:${K.red}">${sub}</span></div>
      ${item(k,its[0])}</div>${its.slice(1).map(it=>item(k,it)).join("")}<div data-h="gap" style="height:14px"></div></div>`:"";
  const chunks=SECTIONS.map(([k,name,sub])=>{const its=menu[k]||[],out=[];
    for(let i=0;i<its.length;i+=2)out.push(sec([k,name,i?"continued":sub],its.slice(i,i+2)));return out.join("")}).join("");
  const body=`<template data-h="chunks">${chunks}</template><div data-h="menu" style="position:absolute;left:44px;right:44px;top:334px;bottom:230px;column-count:2;column-gap:40px;column-fill:balance;column-rule:1px solid rgba(22,26,32,.25)">${SECTIONS.map(x=>sec(x)).join("")}</div>`;
  const props=`<div data-h="props" style="position:absolute;left:40px;right:40px;bottom:64px;height:150px;display:flex;gap:24px;align-items:stretch">
    <div style="flex:1.15;background:#fff;padding:14px 18px;box-shadow:0 4px 12px rgba(0,0,0,.18);border-left:6px solid ${K.red};transform:rotate(-.6deg);display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 15px/1 ${SANS};letter-spacing:.24em;color:${K.red}">ORDER UP WHEN</div>
      <div data-h="cue" style="font:400 20px/1.3 ${SERIF};color:${C.ink};margin-top:7px">${ESC(f.P||"")}</div></div>
    <div data-h="dot" style="flex:1;padding:12px 16px;border:1.5px solid ${C.ink};outline:1px solid ${C.ink};outline-offset:3px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 14px/1 ${SANS};letter-spacing:.2em;color:${K.red};margin-bottom:6px">LEFT ON THE COUNTER</div>
      <div style="font:400 ${N&&N.text.length>95?16:18}px/1.3 ${SERIF};color:${C.ink}">${N?ESC(N.text):"Lock the door behind you, hon. Sit where you can see the road, and don't answer the tapping on the glass."}</div>
      <div style="font:400 20px/1.5 ${HAND};color:#23324f;margin-top:2px;white-space:nowrap">${N?ESC(N.by):"Dot, nights"}</div></div></div>`;
  const foot=`<div style="position:absolute;left:40px;right:40px;bottom:18px;font:400 15px/19px ${SANS};color:${C.mute}">
    ${W[4]?`<div style="font-style:italic;font-family:${SERIF};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Overheard at the counter: ${ESC(low(W[4]))}.</div>`:""}
    <div style="display:flex;justify-content:space-between"><span>Prices subject to change without notice, like everything after midnight.</span><span>Form No. ${num||"13-"+yy(f)}</span></div></div>`;
  return face(C.paper,band+body+props+foot,2,laminate);
}

/* continued faces: hidden unless horrorFit needs them at the rule 4 minimum sizes */
function cont(f,stills,x){
  const fl=x.flavour,venue=fl&&fl.venue||"the Last Light Diner";
  const band=topStill((stills[2]||stills[1]||stills[0]||[])[0],240,venue,"STILL OPEN, STILL RAINING","THE MENU, CONTINUED",72);
  const body=`<div data-h="menu" style="position:absolute;left:44px;right:44px;top:282px;bottom:64px;column-count:2;column-gap:40px;column-fill:balance;column-rule:1px solid rgba(22,26,32,.25)"></div>`;
  const foot=`<div style="position:absolute;left:40px;right:40px;bottom:24px;font:400 15px/1 ${SANS};color:${C.mute}">${ESC(fl&&fl.venue||"Last Light Diner, Route 13")}. Turn over for the cover.</div>`;
  return face(C.paper,band+body+foot,3,laminate);
}

/* x: {logo, palette, flavour} for this film (data/film-logos.json, film-palette.json, film-flavour.json); any can be missing */
function genreCard(f,menu,poster,stills,x){
  x=x||{};const st=pickStills(stills);K=colours(x.palette);
  const out=`<div data-horror="card" style="display:flex;flex-wrap:wrap;gap:24px">${front(f,poster,st,x)}${back(f,menu,poster,st,x)}${cont(f,st,x)}</div>`;
  K=colours(null);return out}

const LEVELS=[
  {dish:28,price:28,desc:21,sech:44,pad:16,gap:14,mb:14},
  {dish:27,price:27,desc:20,sech:42,pad:12,gap:10,mb:10},
  {dish:26,price:26,desc:20,sech:40,pad:9,gap:6,mb:8}];
function horrorFit(rootEl){
  const fits=m=>m.scrollWidth<=m.clientWidth+1&&m.scrollHeight<=m.clientHeight+1;
  rootEl.querySelectorAll('[data-horror="card"]').forEach(card=>{
    const [fr,bk,f3]=card.querySelectorAll('[data-horror="face"]');
    const box=fr.querySelector('[data-h="info"]'),over=()=>box.scrollHeight>box.clientHeight+1;
    /* logo plate: light enamel for a dark logo, dark glass for a light one; set type if it never loaded */
    const lg=fr.querySelector('[data-h="logo"]'),plate=fr.querySelector('[data-h="plate"]');
    if(lg){
      if(!(lg.complete&&lg.naturalWidth)){plate.style.display="none";const a=fr.querySelector('[data-h="alt"]');a.style.display="";a.dataset.h="title"}
      else{try{const cv=document.createElement("canvas");cv.width=96;cv.height=Math.max(8,Math.round(96*lg.naturalHeight/lg.naturalWidth));
        const cx=cv.getContext("2d");cx.drawImage(lg,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;let sum=0,n=0;
        for(let i=0;i<d.length;i+=4)if(d[i+3]>128){sum+=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;n++}
        if(n&&sum/n<.4){plate.style.background="#ece6d6";plate.style.boxShadow="0 6px 16px rgba(0,0,0,.55),inset 0 0 0 1px rgba(0,0,0,.15)"}}catch(e){}
        const ar=lg.naturalWidth/lg.naturalHeight;let h=lg.offsetHeight;
        while(over()&&h>56){h-=8;lg.style.height=h+"px";lg.style.width=Math.min(318,Math.round(h*ar))+"px"}}}
    const t=fr.querySelector('[data-h="title"]');
    if(t){let s=+t.dataset.max;while((over()||t.scrollWidth>t.clientWidth+1)&&s>34){s-=2;t.style.fontSize=s+"px"}}
    const fd=fr.querySelector('[data-h="fdesc"]');let fs=20;while(over()&&fs>17){fs--;fd.style.fontSize=fs+"px"}
    const m=bk.querySelector('[data-h="menu"]'),blank=f3.cloneNode(true);
    const set=(sel,fn)=>card.querySelectorAll(`[data-h="${sel}"]`).forEach(fn);
    const apply=L=>{
      set("dish",e=>e.style.fontSize=L.dish+"px");set("price",e=>e.style.fontSize=L.price+"px");
      set("desc",e=>e.style.fontSize=L.desc+"px");set("sech",e=>e.style.fontSize=L.sech+"px");
      set("item",e=>e.style.paddingBottom=L.pad+"px");set("gap",e=>e.style.height=L.gap+"px");
      set("sec",e=>e.style.marginBottom=L.mb+"px")};
    /* short menus: grow the top still (296 up to 470 tall) as far as the menu allows at full size */
    const band=bk.querySelector('[data-h="band"]');let L=LEVELS[0],grown=false;apply(L);
    for(let h=470;h>296;h-=16){band.style.height=h+"px";m.style.top=(h+38)+"px";if(fits(m)){grown=true;break}}
    if(!grown){band.style.height="296px";m.style.top="334px";for(L of LEVELS){apply(L);if(fits(m))break}}
    /* still too long at dish 26 / note 20: never shrink further. Split sections into 2 item chunks
       (header repeated as "continued") and flow the last chunks onto as many continued faces as needed */
    if(!fits(m)){
      m.innerHTML=bk.querySelector('[data-h="chunks"]').innerHTML;apply(L);
      let cur=bk,next=f3,n=3;
      while(!fits(cur.querySelector('[data-h="menu"]'))){
        const cm=cur.querySelector('[data-h="menu"]'),blocks=cm.querySelectorAll('[data-h="secblock"]');
        if(blocks.length<2)break;
        next.style.display="block";
        next.querySelector('[data-h="menu"]').prepend(blocks[blocks.length-1]);
        if(fits(cm)){cur=next;const nb=blank.cloneNode(true);nb.dataset.face=++n;next.after(nb);next=nb}
      }
    }
  })}

root.genreCard=genreCard;root.horrorFit=horrorFit;root.HORROR_GENRE={genreCard,horrorFit,SECTIONS};
})(typeof window!=="undefined"?window:globalThis);
