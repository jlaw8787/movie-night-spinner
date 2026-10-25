/* Genre menu: horror. Venue: the Last Light Diner, an all-night roadside diner on Route 13, on a stormy night.
   genreCard(f, menu, poster, stills) returns two 816x1056 faces (front cover, back menu) as HTML, inline styles only.
   f: film record (title, year, T tagline, D description, P showtime cue). menu: {s,m,w,d} arrays of {n,note}.
   poster: TMDB poster path or null. stills: array of [path,w,h,...] from data/film-stills.json, or null.
   horrorFit(root) runs after the faces are in the DOM and steps type down until nothing spills. */
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
const fillArt=(src,cap,n)=>src?`<div data-h="fill" style="display:none;position:absolute;left:44px;right:44px;padding:8px 8px 0;background:#fff;box-shadow:0 8px 20px rgba(0,0,0,.25);box-sizing:border-box">
    <div data-h="fillimg" style="outline:2px solid ${K.red};outline-offset:-2px;height:200px;overflow:hidden"><img alt="" crossorigin="anonymous" src="${IMG}w1280${src}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;font:italic 400 17px/1.25 ${SERIF};color:${C.ink};padding:9px 4px 10px"><span>${cap}</span><span style="white-space:nowrap;font:700 14px/1 ${SANS};letter-spacing:.14em;color:${C.mute};font-style:normal">STILL: TMDB</span></div></div>`:"";

function face(bg,inner,n){
  return `<div class="fx-face" data-face="${n}" data-horror="face" style="${n===3?"display:none;":""}position:relative;width:816px;height:1056px;overflow:hidden;background:${bg};box-sizing:border-box;flex:none">${inner}
  <div style="position:absolute;inset:0;background:url('${HORROR_ASSETS}paper-grain.png') center/cover;mix-blend-mode:multiply;opacity:.55;pointer-events:none"></div></div>`}

function front(f,poster,stills,x){
  const fl=x.flavour,W=fl&&fl.winks||[],venue=(fl&&fl.venue||"Last Light Diner").toUpperCase(),signTxt=fl&&fl.sign?ESC(fl.sign):"Route 13 &nbsp;/&nbsp; Mile 66";
  const vs=titleSize(venue,728,1,118,52),ks=Math.max(14,Math.min(18,Math.floor(728/(((fl&&fl.sign||"Route 13 / Mile 66").length+17)*.92))));
  const still=stills[0]&&stills[0][0];
  const bgSrc=still?IMG+"w780"+still:poster?IMG+"w342"+poster:"";
  const title=ESC(f.title),tag=ESC(f.T||""),desc=ESC(f.D||"");
  /* rain on the window: the film's own image, blurred and dark, behind everything */
  const storm=`${bgSrc?`<img alt="" crossorigin="anonymous" src="${bgSrc}" style="position:absolute;left:-60px;top:-60px;width:936px;height:1176px;object-fit:cover;filter:blur(18px) brightness(.32) saturate(.55)">`:""}
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 18% 0%,rgba(190,210,235,.22),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 45%,transparent 40%,rgba(5,7,10,.85) 100%)"></div>`;
  const sign=`<div style="position:absolute;left:0;right:0;top:40px;text-align:center">
    <div style="white-space:nowrap;font:600 ${ks}px/1 ${SANS};letter-spacing:.26em;color:${C.bone};opacity:.85;text-transform:uppercase">${signTxt} &nbsp;/&nbsp; Open all night</div>
    <div style="height:124px;display:flex;align-items:center;justify-content:center;margin-top:6px;white-space:nowrap;font:400 ${vs}px/1 ${DISP};letter-spacing:.04em;color:#fff2ee;text-shadow:${K.glow}">${ESC(venue)}</div>
    <div style="font:italic 400 23px/1.2 ${SERIF};color:${C.bone};margin-top:4px">Coffee, pie and shelter from the storm. Est. ${ESC(f.year)}.</div>
  </div>`;
  const kicker=`<div style="white-space:nowrap;font:700 17px/1 ${SANS};letter-spacing:.18em;color:${K.neon};text-transform:uppercase">Channel 13, the late show</div>`;
  const notice=(top,right,rot)=>`<div style="position:absolute;top:${top}px;right:${right}px;width:244px;box-sizing:border-box;transform:rotate(${rot}deg);background:${C.paper};color:${C.ink};padding:14px 16px 14px;box-shadow:0 8px 22px rgba(0,0,0,.55);border-top:6px solid ${K.red}">
    <div style="font:400 30px/1 ${DISP};letter-spacing:.06em;color:${K.red}">STORM NOTICE</div>
    <div style="font:400 17px/1.32 ${SERIF};margin-top:6px">Phone lines down since ten. Kitchen open till the lights go.${W[3]&&W[3].length<=48?` Last seen out on the road: ${ESC(low(W[3]))}.`:" Bridge out past mile 13."}</div>
    <div style="font:700 14px/1 ${SANS};letter-spacing:.18em;margin-top:9px;color:${C.mute}">THE MANAGEMENT</div></div>`;
  const lg=x.logo,num=String(fl&&fl.number||"").replace(/\D/g,"");
  const logo=(bw,bh)=>{if(!lg||!lg[0])return "";const ar=(+lg[1]||4)/(+lg[2]||1);let w=Math.min(bw,bh*ar);const h=w/ar;
    return `<img data-h="logo" alt="${title}" crossorigin="anonymous" src="${IMG}w500${lg[0]}" style="display:none;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain;object-position:left center;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))">`};
  const P=fl&&fl.prop,prop=P?`<div style="position:absolute;left:22px;top:226px;width:228px;box-sizing:border-box;transform:rotate(-3deg);z-index:3;padding:12px 14px;box-shadow:0 8px 20px rgba(0,0,0,.55);${
      P.kind==="badge"?`background:${C.paper};border:2px solid ${K.red};outline:1px solid ${K.red};outline-offset:-7px;border-radius:10px;text-align:center`
      :P.kind==="receipt"?`background:#fbfaf6;border-top:1.5px dashed ${C.mute};border-bottom:1.5px dashed ${C.mute}`
      :`background:${C.paper};border-left:6px solid ${K.red}`}">
      <div style="font:400 28px/1 ${DISP};letter-spacing:.05em;color:${K.red};text-transform:uppercase">${ESC(P.title)}</div>
      ${(P.lines||[]).slice(0,3).map(l=>`<div style="font:600 16px/1.3 ${SANS};color:${C.ink};margin-top:5px">${ESC(l)}</div>`).join("")}</div>`:"";
  let hero,info;
  if(still){
    const ts=titleSize(f.title,450,2,88,40);
    hero=`<div style="position:absolute;left:40px;top:252px;width:736px;padding:8px;background:${C.paper};box-shadow:0 14px 34px rgba(0,0,0,.6)">
      <div style="outline:2px solid ${K.red};outline-offset:-2px;height:396px;overflow:hidden;background:#222"><img alt="Still from ${title} (${ESC(f.year)})" crossorigin="anonymous" src="${IMG}w1280${still}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      <div style="font:italic 400 18px/1 ${SERIF};color:${C.ink};padding:10px 4px 2px;display:flex;justify-content:space-between"><span>${W[0]?ESC(W[0])+".":"The set behind the counter stays on all night."}</span><span style="font:700 14px/18px ${SANS};letter-spacing:.14em;color:${C.mute}">STILL: TMDB</span></div></div>
      ${notice(764,40,2.5)}`;
    info=`<div data-h="info" style="position:absolute;left:44px;right:310px;top:712px;bottom:62px;display:flex;flex-direction:column;justify-content:center;gap:10px">
      ${kicker}
      <div style="display:flex;align-items:flex-end;gap:16px">${logo(400,128)}<div data-h="title" data-max="${ts}" style="font:400 ${ts}px/.95 ${DISP};letter-spacing:.02em;color:${C.paper};text-transform:uppercase">${title}</div><span style="font:400 40px/1 ${DISP};color:${K.neon};letter-spacing:.08em;flex:none">${ESC(f.year)}</span></div>
      <div style="font:italic 600 26px/1.25 ${SERIF};color:#fff">${tag}</div>
      <div style="font:400 20px/1.38 ${SERIF};color:${C.bone}">${desc}</div></div>`;
  }else{
    const ts=titleSize(f.title,388,3,96,40);
    hero=`<div style="position:absolute;left:40px;top:256px;width:300px;padding:8px;background:${C.paper};transform:rotate(-1.2deg);box-shadow:0 14px 34px rgba(0,0,0,.65)">
      <div style="outline:2px solid ${K.red};outline-offset:-2px;height:441px;overflow:hidden;background:#222">${poster?`<img alt="${title} (${ESC(f.year)}) film poster" crossorigin="anonymous" src="${IMG}w500${poster}" style="width:100%;height:100%;object-fit:cover;display:block">`:""}</div>
      <div style="font:italic 400 17px/1.2 ${SERIF};color:${C.ink};padding:9px 2px 1px">Taped up by the register. Poster: TMDB</div></div>`;
    info=`<div data-h="info" style="position:absolute;left:384px;right:40px;top:262px;height:470px;display:flex;flex-direction:column;justify-content:center;gap:14px">
      ${kicker}
      ${logo(388,180)}<div data-h="title" data-max="${ts}" style="font:400 ${ts}px/.95 ${DISP};letter-spacing:.02em;color:${C.paper};text-transform:uppercase;overflow-wrap:anywhere">${title}</div>
      <div style="font:400 40px/1 ${DISP};letter-spacing:.12em;color:${K.neon}">${ESC(f.year)}</div>
      <div style="font:italic 600 25px/1.25 ${SERIF};color:#fff">${tag}</div></div>
      <div style="position:absolute;left:44px;right:300px;top:768px;bottom:66px;display:flex;flex-direction:column;justify-content:center;gap:10px">
        <div style="font:700 18px/1 ${SANS};letter-spacing:.3em;color:${K.neon}">TONIGHT'S PICTURE</div>
        <div style="font:400 21px/1.42 ${SERIF};color:${C.bone}">${desc}</div></div>
      ${notice(778,40,2.5)}`;
  }
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:28px;display:flex;justify-content:space-between;font:600 15px/1 ${SANS};letter-spacing:.14em;color:${C.bone};opacity:.75;text-transform:uppercase">
    <span>Doors lock at 3:00 a.m.</span><span>Booth service till dawn</span><span>Form No. ${num||"13-"+yy(f)}</span></div>`;
  return face(C.night,storm+sign+hero+prop+info+foot,1);
}

function back(f,menu,poster,stills,x){
  const fl=x.flavour,W=fl&&fl.winks||[],N=fl&&fl.note,num=String(fl&&fl.number||"").replace(/\D/g,"");
  /* the film's number hides in one price: 2 digits as the cents of the first drink, 3 or 4 as the first main */
  const special={};if(num.length===2&&menu.d&&menu.d[0])special["d0"]=(2+hash(menu.d[0].n)%3)+"."+num;
  if((num.length===3||num.length===4)&&menu.m&&menu.m[0])special["m0"]=(+num/100).toFixed(2);
  const s2=stills[1]||stills[0];
  const art=s2?`<div style="position:absolute;right:40px;top:18px;width:300px;padding:7px 7px 6px;background:#fff;transform:rotate(2deg);box-shadow:0 10px 24px rgba(0,0,0,.45);z-index:2">
      <div style="outline:2px solid ${K.red};outline-offset:-2px;height:142px;overflow:hidden"><img alt="Still from ${ESC(f.title)}" crossorigin="anonymous" src="${IMG}w780${s2[0]}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      <div style="font:italic 400 16px/1.2 ${SERIF};color:${C.ink};padding:7px 2px 0">${W[1]?ESC(W[1])+".":"Booth four, 2:40 a.m. Nobody saw them leave."}</div></div>`
    :poster?`<div style="position:absolute;right:48px;top:16px;width:210px;padding:6px 6px 5px;background:#fff;transform:rotate(2.5deg);box-shadow:0 10px 24px rgba(0,0,0,.45);z-index:2">
      <div style="outline:2px solid ${K.red};outline-offset:-2px;height:142px;overflow:hidden"><img alt="" crossorigin="anonymous" src="${IMG}w342${poster}" style="width:100%;height:100%;object-fit:cover;object-position:50% 28%;display:block"></div>
      <div style="font:italic 400 15px/1.2 ${SERIF};color:${C.ink};padding:6px 2px 0">Left in booth four.</div></div>`:"";
  const band=`<div style="position:absolute;left:0;right:0;top:0;height:196px;background:${C.night}">
    <div style="position:absolute;left:44px;top:34px;font:600 17px/1 ${SANS};letter-spacing:.32em;color:${C.bone}">OPEN TILL THE STORM PASSES</div>
    <div style="position:absolute;left:42px;top:62px;font:400 92px/1 ${DISP};letter-spacing:.04em;color:#ffe9e4;text-shadow:${K.glow}">THE MENU</div>
    <div style="position:absolute;left:44px;top:160px;font:italic 400 19px/1 ${SERIF};color:${C.bone}">Tonight's late show: <b style="font-style:normal;font-weight:600;color:#fff">${ESC(f.title)}</b></div></div>`;
  const item=(k,it)=>`<div data-h="item" style="break-inside:avoid;padding-bottom:16px">
      <div style="display:flex;align-items:baseline;gap:10px"><b data-h="dish" style="font:700 28px/1.12 ${SANS};color:${C.ink};flex:1 1 auto;min-width:0">${ESC(it.n)}</b><span data-h="price" style="font:700 28px/1 ${SANS};color:${K.red};flex:none">${special[k+((menu[k]||[]).indexOf(it))]||price(f,k,it.n)}</span></div>
      ${it.note?`<div data-h="desc" style="font:400 21px/1.3 ${SERIF};color:#3a3d43;margin-top:4px">${ESC(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`;
  const sec=([k,name,sub],its=menu[k]||[])=>its.length?`<div data-h="secblock"><div style="break-inside:avoid"><div data-h="sec" style="break-inside:avoid;display:flex;align-items:baseline;gap:12px;border-bottom:2px solid ${C.ink};box-shadow:0 3px 0 ${C.paper},0 4px 0 ${C.ink};margin:0 0 14px;padding-bottom:4px">
      <span data-h="sech" style="white-space:nowrap;font:400 44px/1 ${DISP};letter-spacing:.05em;color:${C.ink};text-transform:uppercase">${name}</span><span style="white-space:nowrap;font:italic 400 17px/1 ${SERIF};color:${K.red}">${sub}</span></div>
      ${item(k,its[0])}</div>${its.slice(1).map(it=>item(k,it)).join("")}<div data-h="gap" style="height:14px"></div></div>`:"";
  const chunks=SECTIONS.map(([k,name,sub])=>{const its=menu[k]||[],out=[];
    for(let i=0;i<its.length;i+=2)out.push(sec([k,name,i?"continued":sub],its.slice(i,i+2)));return out.join("")}).join("");
  const body=`<template data-h="chunks">${chunks}</template><div data-h="menu" style="position:absolute;left:44px;right:44px;top:228px;bottom:232px;column-count:2;column-gap:40px;column-fill:balance;column-rule:1px solid rgba(22,26,32,.25)">${SECTIONS.map(x=>sec(x)).join("")}</div>`;
  const props=`<div data-h="props" style="position:absolute;left:44px;right:44px;bottom:62px;height:150px;display:flex;gap:24px;align-items:stretch">
    <div style="flex:1.15;background:#fff;padding:14px 18px;box-shadow:0 4px 12px rgba(0,0,0,.18);border-left:6px solid ${K.red};transform:rotate(-.6deg);display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 15px/1 ${SANS};letter-spacing:.24em;color:${K.red}">ORDER UP WHEN</div>
      <div data-h="cue" style="font:400 20px/1.3 ${SERIF};color:${C.ink};margin-top:7px">${ESC(f.P||"")}</div></div>
    <div data-h="dot" style="flex:1;padding:12px 16px;border:1.5px solid ${C.ink};outline:1px solid ${C.ink};outline-offset:3px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 14px/1 ${SANS};letter-spacing:.2em;color:${K.red};margin-bottom:6px">LEFT ON THE COUNTER</div>
      <div style="font:400 ${N&&N.text.length>95?16:18}px/1.3 ${SERIF};color:${C.ink}">${N?ESC(N.text):"Lock the door behind you, hon. Sit where you can see the road, and don't answer the tapping on the glass."}</div>
      <div style="font:400 20px/1.5 ${HAND};color:#23324f;margin-top:2px;white-space:nowrap">${N?ESC(N.by):"Dot, nights"}</div></div></div>`;
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:12px;font:400 15px/19px ${SANS};color:${C.mute}">
    ${W[4]?`<div style="font-style:italic;font-family:${SERIF};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Overheard at the counter: ${ESC(low(W[4]))}.</div>`:""}
    <div style="display:flex;justify-content:space-between"><span>Prices subject to change without notice, like everything after midnight.</span><span>Form No. ${num||"13-"+yy(f)}</span></div></div>`;
  const fill=fillArt((stills[2]||stills[1]||[])[0],W[2]?ESC(W[2])+".":"From the window booth, just before the lights went.");
  return face(C.paper,band+art+body+fill+props+foot,2);
}

/* face 3 stays hidden unless horrorFit needs it for overflow at the rule 4 minimum sizes */
function cont(f,stills){
  const band=`<div style="position:absolute;left:0;right:0;top:0;height:132px;background:${C.night}">
    <div style="position:absolute;left:42px;top:26px;font:400 72px/1 ${DISP};letter-spacing:.04em;color:#ffe9e4;text-shadow:${K.glow}">THE MENU, CONTINUED</div></div>`;
  const body=`<div data-h="menu" style="position:absolute;left:44px;right:44px;top:166px;bottom:62px;column-count:2;column-gap:40px;column-fill:balance;column-rule:1px solid rgba(22,26,32,.25)"></div>`;
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:24px;font:400 15px/1 ${SANS};color:${C.mute}">Last Light Diner, Route 13. Turn over for the cover.</div>`;
  return face(C.paper,band+body+fillArt((stills[3]||stills[2]||[])[0],"Route 13 after midnight. Keep your headlights on.")+foot,3);
}

/* x: {logo, palette, flavour} for this film (data/film-logos.json, film-palette.json, film-flavour.json); any can be missing */
function genreCard(f,menu,poster,stills,x){
  x=x||{};const st=pickStills(stills);K=colours(x.palette);
  const out=`<div data-horror="card" style="display:flex;flex-wrap:wrap;gap:24px">${front(f,poster,st,x)}${back(f,menu,poster,st,x)}${cont(f,st)}</div>`;
  K=colours(null);return out}

/* step down until the menu columns and the title fit their boxes; nothing below 14px */
const LEVELS=[
  {dish:28,price:28,desc:21,sech:44,pad:16,gap:14,mb:14,props:1},
  {dish:27,price:27,desc:20,sech:42,pad:12,gap:10,mb:10,props:1},
  {dish:26,price:26,desc:20,sech:40,pad:9,gap:6,mb:8,props:1},
];
function horrorFit(rootEl){
  const fits=m=>m.scrollWidth<=m.clientWidth+1&&m.scrollHeight<=m.clientHeight+1;
  rootEl.querySelectorAll('[data-horror="card"]').forEach(card=>{
    const [fr,bk,f3]=card.querySelectorAll('[data-horror="face"]');
    /* real title logo if it reads on the dark cover (mean luminance of its opaque pixels), else the set type stays */
    const lg=fr.querySelector('[data-h="logo"]');
    if(lg&&lg.complete&&lg.naturalWidth){try{const cv=document.createElement("canvas");cv.width=96;cv.height=Math.max(8,Math.round(96*lg.naturalHeight/lg.naturalWidth));
      const cx=cv.getContext("2d");cx.drawImage(lg,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;let sum=0,n=0;
      for(let i=0;i<d.length;i+=4)if(d[i+3]>128){sum+=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;n++}
      if(n>40&&sum/n>=.3){lg.style.display="block";const tt=fr.querySelector('[data-h="title"]');tt.style.display="none";tt.removeAttribute("data-h");
        /* shrink a tall logo until its text block fits */
        const box=lg.closest('[data-h="info"]'),ar=lg.naturalWidth/lg.naturalHeight;let h=lg.offsetHeight;
        while(box&&box.scrollHeight>box.clientHeight+1&&h>64){h-=8;lg.style.height=h+"px";lg.style.width=Math.round(h*ar)+"px"}}}catch(e){}}
    const t=fr.querySelector('[data-h="title"]');
    if(t){const box=t.closest('[data-h="info"]')||t.parentElement;let s=+t.dataset.max;
      const over=()=>box.scrollHeight>box.clientHeight+1||t.scrollWidth>t.clientWidth+1;
      while(over()&&s>34){s-=2;t.style.fontSize=s+"px"}}
    const m=bk.querySelector('[data-h="menu"]'),blank=f3.cloneNode(true);
    const set=(sel,fn)=>card.querySelectorAll(`[data-h="${sel}"]`).forEach(fn);
    const apply=L=>{
      set("dish",e=>e.style.fontSize=L.dish+"px");set("price",e=>e.style.fontSize=L.price+"px");
      set("desc",e=>e.style.fontSize=L.desc+"px");set("sech",e=>e.style.fontSize=L.sech+"px");
      set("item",e=>e.style.paddingBottom=L.pad+"px");set("gap",e=>e.style.height=L.gap+"px");
      set("sec",e=>e.style.marginBottom=L.mb+"px")};
    /* short menus: reserve a band above the props for a large still, biggest band at the biggest type that fits */
    const fill2=bk.querySelector('[data-h="fill"]');let L,placed=false;
    if(fill2)outer:for(L of LEVELS){apply(L);for(let fh=360;fh>=200;fh-=40){m.style.bottom=(232+fh)+"px";
      if(fits(m)){fill2.style.display="block";fill2.style.top=(1056-232-fh+16)+"px";fill2.querySelector('[data-h="fillimg"]').style.height=(fh-16-18-48)+"px";placed=true;break outer}}}
    if(!placed){m.style.bottom="232px";for(L of LEVELS){apply(L);if(fits(m))break}
      /* no room for a full band: put the still under whichever column ends higher */
      if(fill2&&fits(m)){const fr2=bk.getBoundingClientRect(),mid=m.getBoundingClientRect().left+m.clientWidth/2,cb=[228,228];
        m.querySelectorAll('[data-h="item"],[data-h="sec"]').forEach(e=>{for(const r of e.getClientRects())cb[r.left<mid?0:1]=Math.max(cb[r.left<mid?0:1],r.bottom-fr2.top)});
        const c=cb[0]<=cb[1]?0:1,top=cb[c]+22,h=1056-232-30-top;
        if(h>=200){Object.assign(fill2.style,{display:"block",top:top+"px",left:c?"428px":"44px",right:c?"44px":"428px"});
          fill2.querySelector('[data-h="fillimg"]').style.height=(h-74)+"px";placed=true}}}
    /* still too long at dish 26 / note 20: never shrink further. Split sections into 2 item chunks
       (header repeated as "continued") and flow the last chunks onto as many continued faces as needed */
    const faces=placed?[]:[bk];
    if(!fits(m)){
      m.innerHTML=bk.querySelector('[data-h="chunks"]').innerHTML;apply(L);
      let cur=bk,next=f3,n=3;
      while(!fits(cur.querySelector('[data-h="menu"]'))){
        const cm=cur.querySelector('[data-h="menu"]'),blocks=cm.querySelectorAll('[data-h="secblock"]');
        if(blocks.length<2)break;
        if(next.style.display==="none"){next.style.display="block";faces.push(next)}
        next.querySelector('[data-h="menu"]').prepend(blocks[blocks.length-1]);
        if(fits(cm)){cur=next;const nb=blank.cloneNode(true);nb.dataset.face=++n;next.after(nb);next=nb}
      }
    }
    /* fill the empty space under short menus with a framed still */
    faces.forEach(fc=>{
      const fill=fc.querySelector('[data-h="fill"]'),mm=fc.querySelector('[data-h="menu"]');
      if(!fill||fc.style.display==="none")return;
      const top0=fc.getBoundingClientRect().top;let bottom=mm.getBoundingClientRect().top-top0;
      mm.querySelectorAll('[data-h="item"],[data-h="sec"]').forEach(e=>{for(const r of e.getClientRects())bottom=Math.max(bottom,r.bottom-top0)});
      const props=fc.querySelector('[data-h="props"]'),limit=props?props.offsetTop-26:1056-70;
      const h=limit-(bottom+18);
      if(h>=170){fill.style.display="block";fill.style.top=(bottom+18)+"px";fill.querySelector('[data-h="fillimg"]').style.height=Math.min(h-48,420)+"px"}
    });
  })}

root.genreCard=genreCard;root.horrorFit=horrorFit;root.HORROR_GENRE={genreCard,horrorFit,SECTIONS};
})(typeof window!=="undefined"?window:globalThis);
