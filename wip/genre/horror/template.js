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
const yy=f=>String(f.year||"").slice(-2).padStart(2,"0");
/* diner prices: dollars from the dish name, cents are always the film's year */
const PRICE={s:[4,4],m:[9,6],w:[4,3],d:[2,3]};
const price=(f,k,n)=>{const [a,r]=PRICE[k];return (a+hash(n)%r)+"."+yy(f)};
const NEON=`0 0 2px #ffd9d2,0 0 8px ${C.neon},0 0 22px rgba(255,60,48,.75),0 0 46px rgba(196,47,39,.55)`;

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

function face(bg,inner,n){
  return `<div class="fx-face" data-face="${n}" data-horror="face" style="position:relative;width:816px;height:1056px;overflow:hidden;background:${bg};box-sizing:border-box;flex:none">${inner}
  <div style="position:absolute;inset:0;background:url('${HORROR_ASSETS}paper-grain.png') center/cover;mix-blend-mode:multiply;opacity:.55;pointer-events:none"></div></div>`}

function front(f,poster,stills){
  const still=stills&&stills[0]&&stills[0][0];
  const bgSrc=still?IMG+"w780"+still:poster?IMG+"w342"+poster:"";
  const title=ESC(f.title),tag=ESC(f.T||""),desc=ESC(f.D||"");
  /* rain on the window: the film's own image, blurred and dark, behind everything */
  const storm=`${bgSrc?`<img alt="" crossorigin="anonymous" src="${bgSrc}" style="position:absolute;left:-60px;top:-60px;width:936px;height:1176px;object-fit:cover;filter:blur(18px) brightness(.32) saturate(.55)">`:""}
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 18% 0%,rgba(190,210,235,.22),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 45%,transparent 40%,rgba(5,7,10,.85) 100%)"></div>`;
  const sign=`<div style="position:absolute;left:0;right:0;top:40px;text-align:center">
    <div style="font:600 18px/1 ${SANS};letter-spacing:.34em;color:${C.bone};opacity:.85">ROUTE 13 &nbsp;/&nbsp; MILE 66 &nbsp;/&nbsp; OPEN ALL NIGHT</div>
    <div style="font:400 118px/1 ${DISP};letter-spacing:.04em;color:#ffe9e4;text-shadow:${NEON};margin-top:18px">LAST LIGHT DINER</div>
    <div style="font:italic 400 23px/1.2 ${SERIF};color:${C.bone};margin-top:10px">Coffee, pie and shelter from the storm. Est. ${ESC(f.year)}.</div>
  </div>`;
  const kicker=`<div style="font:700 18px/1 ${SANS};letter-spacing:.3em;color:${C.neon};text-transform:uppercase">Channel 13, the late show</div>`;
  const notice=(top,right,rot)=>`<div style="position:absolute;top:${top}px;right:${right}px;width:236px;transform:rotate(${rot}deg);background:${C.paper};color:${C.ink};padding:14px 16px 14px;box-shadow:0 8px 22px rgba(0,0,0,.55);border-top:6px solid ${C.red}">
    <div style="font:400 30px/1 ${DISP};letter-spacing:.06em;color:${C.red}">STORM NOTICE</div>
    <div style="font:400 17px/1.32 ${SERIF};margin-top:6px">Bridge out past mile 13. Phone lines down since ten. Kitchen open till the lights go.</div>
    <div style="font:700 14px/1 ${SANS};letter-spacing:.18em;margin-top:9px;color:${C.mute}">THE MANAGEMENT</div></div>`;
  let hero,info;
  if(still){
    const ts=titleSize(f.title,450,2,88,40);
    hero=`<div style="position:absolute;left:40px;top:252px;width:736px;padding:8px;background:${C.paper};box-shadow:0 14px 34px rgba(0,0,0,.6)">
      <div style="outline:2px solid ${C.red};outline-offset:-2px;height:396px;overflow:hidden;background:#222"><img alt="Still from ${title} (${ESC(f.year)})" crossorigin="anonymous" src="${IMG}w1280${still}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      <div style="font:italic 400 18px/1 ${SERIF};color:${C.ink};padding:10px 4px 2px;display:flex;justify-content:space-between"><span>The set behind the counter stays on all night.</span><span style="font:700 14px/18px ${SANS};letter-spacing:.14em;color:${C.mute}">STILL: TMDB</span></div></div>
      ${notice(764,40,2.5)}`;
    info=`<div style="position:absolute;left:44px;right:310px;top:712px;bottom:62px;display:flex;flex-direction:column;justify-content:center;gap:10px">
      ${kicker}
      <div data-h="title" data-max="${ts}" style="font:400 ${ts}px/.95 ${DISP};letter-spacing:.02em;color:${C.paper};text-transform:uppercase">${title} <span style="color:${C.neon};font-size:.5em;letter-spacing:.08em;vertical-align:.5em">${ESC(f.year)}</span></div>
      <div style="font:italic 600 26px/1.25 ${SERIF};color:#fff">${tag}</div>
      <div style="font:400 20px/1.38 ${SERIF};color:${C.bone}">${desc}</div></div>`;
  }else{
    const ts=titleSize(f.title,388,3,96,40);
    hero=`<div style="position:absolute;left:40px;top:256px;width:300px;padding:8px;background:${C.paper};transform:rotate(-1.2deg);box-shadow:0 14px 34px rgba(0,0,0,.65)">
      <div style="outline:2px solid ${C.red};outline-offset:-2px;height:441px;overflow:hidden;background:#222">${poster?`<img alt="${title} (${ESC(f.year)}) film poster" crossorigin="anonymous" src="${IMG}w500${poster}" style="width:100%;height:100%;object-fit:cover;display:block">`:""}</div>
      <div style="font:italic 400 17px/1.2 ${SERIF};color:${C.ink};padding:9px 2px 1px">Taped up by the register. Poster: TMDB</div></div>`;
    info=`<div style="position:absolute;left:384px;right:40px;top:262px;height:470px;display:flex;flex-direction:column;justify-content:center;gap:14px">
      ${kicker}
      <div data-h="title" data-max="${ts}" style="font:400 ${ts}px/.95 ${DISP};letter-spacing:.02em;color:${C.paper};text-transform:uppercase;overflow-wrap:anywhere">${title}</div>
      <div style="font:400 40px/1 ${DISP};letter-spacing:.12em;color:${C.neon}">${ESC(f.year)}</div>
      <div style="font:italic 600 25px/1.25 ${SERIF};color:#fff">${tag}</div></div>
      <div style="position:absolute;left:44px;right:300px;top:768px;bottom:66px;display:flex;flex-direction:column;justify-content:center;gap:10px">
        <div style="font:700 18px/1 ${SANS};letter-spacing:.3em;color:${C.neon}">TONIGHT'S PICTURE</div>
        <div style="font:400 21px/1.42 ${SERIF};color:${C.bone}">${desc}</div></div>
      ${notice(778,40,2.5)}`;
  }
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:28px;display:flex;justify-content:space-between;font:600 15px/1 ${SANS};letter-spacing:.14em;color:${C.bone};opacity:.75;text-transform:uppercase">
    <span>Doors lock at 3:00 a.m.</span><span>Booth service till dawn</span><span>Form 13-${yy(f)}</span></div>`;
  return face(C.night,storm+sign+hero+info+foot,1);
}

function back(f,menu,poster,stills){
  const s2=stills&&(stills[1]||stills[0]);
  const art=s2?`<div style="position:absolute;right:40px;top:18px;width:300px;padding:7px 7px 6px;background:#fff;transform:rotate(2deg);box-shadow:0 10px 24px rgba(0,0,0,.45);z-index:2">
      <div style="outline:2px solid ${C.red};outline-offset:-2px;height:142px;overflow:hidden"><img alt="Still from ${ESC(f.title)}" crossorigin="anonymous" src="${IMG}w780${s2[0]}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
      <div style="font:italic 400 16px/1.2 ${SERIF};color:${C.ink};padding:7px 2px 0">Booth four, 2:40 a.m. Nobody saw them leave.</div></div>`
    :poster?`<div style="position:absolute;right:48px;top:16px;width:210px;padding:6px 6px 5px;background:#fff;transform:rotate(2.5deg);box-shadow:0 10px 24px rgba(0,0,0,.45);z-index:2">
      <div style="outline:2px solid ${C.red};outline-offset:-2px;height:142px;overflow:hidden"><img alt="" crossorigin="anonymous" src="${IMG}w342${poster}" style="width:100%;height:100%;object-fit:cover;object-position:50% 28%;display:block"></div>
      <div style="font:italic 400 15px/1.2 ${SERIF};color:${C.ink};padding:6px 2px 0">Left in booth four.</div></div>`:"";
  const band=`<div style="position:absolute;left:0;right:0;top:0;height:196px;background:${C.night}">
    <div style="position:absolute;left:44px;top:34px;font:600 17px/1 ${SANS};letter-spacing:.32em;color:${C.bone}">OPEN TILL THE STORM PASSES</div>
    <div style="position:absolute;left:42px;top:62px;font:400 92px/1 ${DISP};letter-spacing:.04em;color:#ffe9e4;text-shadow:${NEON}">THE MENU</div>
    <div style="position:absolute;left:44px;top:160px;font:italic 400 19px/1 ${SERIF};color:${C.bone}">Tonight's late show: <b style="font-style:normal;font-weight:600;color:#fff">${ESC(f.title)}</b></div></div>`;
  const item=(k,it)=>`<div data-h="item" style="break-inside:avoid;padding-bottom:16px">
      <div style="display:flex;align-items:baseline;gap:10px"><b data-h="dish" style="font:700 28px/1.12 ${SANS};color:${C.ink};flex:1 1 auto;min-width:0">${ESC(it.n)}</b><span data-h="price" style="font:700 28px/1 ${SANS};color:${C.red};flex:none">${price(f,k,it.n)}</span></div>
      ${it.note?`<div data-h="desc" style="font:400 21px/1.3 ${SERIF};color:#3a3d43;margin-top:4px">${ESC(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`;
  const sec=([k,name,sub])=>(menu[k]||[]).length?`<div style="break-inside:avoid"><div data-h="sec" style="break-inside:avoid;display:flex;align-items:baseline;gap:12px;border-bottom:2px solid ${C.ink};box-shadow:0 3px 0 ${C.paper},0 4px 0 ${C.ink};margin:0 0 14px;padding-bottom:4px">
      <span data-h="sech" style="white-space:nowrap;font:400 44px/1 ${DISP};letter-spacing:.05em;color:${C.ink};text-transform:uppercase">${name}</span><span style="white-space:nowrap;font:italic 400 17px/1 ${SERIF};color:${C.red}">${sub}</span></div>
      ${item(k,menu[k][0])}</div>${menu[k].slice(1).map(it=>item(k,it)).join("")}<div data-h="gap" style="height:14px"></div>`:"";
  const body=`<div data-h="menu" style="position:absolute;left:44px;right:44px;top:228px;bottom:232px;column-count:2;column-gap:40px;column-fill:balance;column-rule:1px solid rgba(22,26,32,.25)">${SECTIONS.map(sec).join("")}</div>`;
  const props=`<div data-h="props" style="position:absolute;left:44px;right:44px;bottom:62px;height:150px;display:flex;gap:24px;align-items:stretch">
    <div style="flex:1.15;background:#fff;padding:14px 18px;box-shadow:0 4px 12px rgba(0,0,0,.18);border-left:6px solid ${C.red};transform:rotate(-.6deg);display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 15px/1 ${SANS};letter-spacing:.24em;color:${C.red}">ORDER UP WHEN</div>
      <div data-h="cue" style="font:400 20px/1.3 ${SERIF};color:${C.ink};margin-top:7px">${ESC(f.P||"")}</div></div>
    <div data-h="dot" style="flex:1;padding:12px 16px;border:1.5px solid ${C.ink};outline:1px solid ${C.ink};outline-offset:3px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:400 19px/1.3 ${SERIF};color:${C.ink}">Lock the door behind you, hon. Sit where you can see the road, and don't answer the tapping on the glass.</div>
      <div style="font:400 22px/1.5 ${HAND};color:#23324f;margin-top:4px">Dot, nights</div></div></div>`;
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:24px;display:flex;justify-content:space-between;font:400 15px/1 ${SANS};color:${C.mute}">
    <span>Prices subject to change without notice, like everything after midnight.</span><span>No refunds after 3:00 a.m.</span></div>`;
  return face(C.paper,band+art+body+props+foot,2);
}

function genreCard(f,menu,poster,stills){
  return `<div data-horror="card" style="display:flex;flex-wrap:wrap;gap:24px">${front(f,poster,stills)}${back(f,menu,poster,stills)}</div>`}

/* step down until the menu columns and the title fit their boxes; nothing below 14px */
const LEVELS=[
  {dish:30,price:30,desc:22,sech:48,pad:30,gap:34,mb:18,props:1},
  {dish:29,price:29,desc:22,sech:46,pad:22,gap:24,mb:16,props:1},
  {dish:28,price:28,desc:21,sech:44,pad:16,gap:14,mb:14,props:1},
  {dish:27,price:27,desc:20,sech:42,pad:12,gap:10,mb:10,props:1},
  {dish:26,price:26,desc:20,sech:40,pad:9,gap:6,mb:8,props:1},
  {dish:26,price:26,desc:20,sech:40,pad:9,gap:6,mb:8,props:0},
  {dish:24,price:24,desc:18,sech:36,pad:6,gap:4,mb:6,props:0},
  {dish:22,price:22,desc:17,sech:32,pad:5,gap:3,mb:5,props:0},
  {dish:20,price:20,desc:16,sech:30,pad:4,gap:2,mb:4,props:0},
  {dish:18,price:18,desc:15,sech:28,pad:3,gap:2,mb:3,props:0},
  {dish:20,price:20,desc:0,sech:30,pad:6,gap:4,mb:4,props:0}];
function horrorFit(rootEl){
  rootEl.querySelectorAll('[data-horror="card"]').forEach(card=>{
    const [fr,bk]=card.querySelectorAll('[data-horror="face"]');
    const t=fr.querySelector('[data-h="title"]');
    if(t){const box=t.parentElement;let s=+t.dataset.max;
      const over=()=>box.scrollHeight>box.clientHeight+1||t.scrollWidth>t.clientWidth+1;
      while(over()&&s>34){s-=2;t.style.fontSize=s+"px"}}
    const m=bk.querySelector('[data-h="menu"]'),props=bk.querySelector('[data-h="props"]');
    const set=(sel,fn)=>bk.querySelectorAll(`[data-h="${sel}"]`).forEach(fn);
    for(const L of LEVELS){
      set("dish",e=>e.style.fontSize=L.dish+"px");set("price",e=>e.style.fontSize=L.price+"px");
      set("desc",e=>{e.style.display=L.desc?"":"none";if(L.desc)e.style.fontSize=L.desc+"px"});set("sech",e=>e.style.fontSize=L.sech+"px");
      set("item",e=>e.style.paddingBottom=L.pad+"px");set("gap",e=>e.style.height=L.gap+"px");
      set("sec",e=>e.style.marginBottom=L.mb+"px");
      bk.querySelector('[data-h="dot"]').style.display=L.props?"flex":"none";
      props.style.height=L.props?"150px":"104px";m.style.bottom=L.props?"232px":"186px";
      if(m.scrollWidth<=m.clientWidth+1&&m.scrollHeight<=m.clientHeight+1)break}
  })}

root.genreCard=genreCard;root.horrorFit=horrorFit;root.HORROR_GENRE={genreCard,horrorFit,SECTIONS};
})(typeof window!=="undefined"?window:globalThis);
