/* shared helper (same block in home, invite, precinct; first file to load wins) */
(function(){
if(window.__MNS)return;
const M=window.__MNS={};
const seen=new Set();
M.font=q=>{if(!q||seen.has(q))return;seen.add(q);const l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family="+q+"&display=swap";document.head.appendChild(l)};
M.clean=s=>String(s==null?"":s).replace(/\s*[\u2012\u2013\u2014\u2015]\s*/g,", ").replace(/\s+-+\s+/g,", ").replace(/--+/g,", ").trim();
M.esc=s=>M.clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
M.sent=s=>{s=M.clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};
const DRY=[[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beers?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|gin|sake|baijiu)\b/gi,"syrup"]];
M.family=f=>["kids","fairytale","xmas"].includes(f&&f.theme);
M.dry=(s,on)=>on?DRY.reduce((t,[r,to])=>t.replace(r,to),M.clean(s)):M.clean(s);
M.courses=(menu,fam)=>["s","m","w","d"].map(k=>({k,items:((menu&&menu[k])||[]).filter(it=>it&&it.n).slice(0,4).map(it=>({n:M.dry(it.n,fam),note:M.sent(M.dry(it.note,fam))}))})).filter(c=>c.items.length);
M.hex=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return h.length!==6||isNaN(n)?null:[n>>16&255,n>>8&255,n&255]};
M.toHex=c=>"#"+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
M.lum=c=>{const a=c.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
M.cr=(a,b)=>{const A=M.lum(a),B=M.lum(b);return(Math.max(A,B)+.05)/(Math.min(A,B)+.05)};
/* film accent nudged until it reads on the stock (min contrast), else the format's own colour */
M.accent=(pal,bg,fb,min)=>{min=min||3.2;const B=M.hex(bg);let c=pal&&M.hex(pal.accent);if(!c||!B)return fb;
  const s=Math.max(...c)-Math.min(...c);if(s<40)return fb;const down=M.lum(B)>.35;
  for(let i=0;i<14&&M.cr(c,B)<min;i++)c=c.map(v=>down?v*.86:v+(255-v)*.18);return M.cr(c,B)>=min?M.toHex(c):fb};
M.darkOf=(pal,fb)=>{const c=pal&&M.hex(pal.dark);return c&&M.lum(c)<.08?M.toHex(c):fb};
/* poster path: ctx first, else the page-level TMDB_POSTERS const (not on window) */
M.poster=ctx=>ctx.poster||(typeof TMDB_POSTERS!=="undefined"&&ctx.f&&TMDB_POSTERS[ctx.f.id])||null;
M.num=(n,y)=>{const d=String(n||"").replace(/[^0-9]/g,"");return d||String(y||"").slice(-2)||"7"};
M.noise=op=>"url('data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .12 0 0 0 0 .1 0 0 0 0 .08 0 0 0 ${op} 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`)+"')";
/* logo keeps its own colours: sample it, then give its panel the opposite stock */
M.logoTone=img=>{try{const c=document.createElement("canvas"),w=c.width=72,h=c.height=Math.max(8,Math.round(72*img.naturalHeight/img.naturalWidth)),x=c.getContext("2d");x.drawImage(img,0,0,w,h);
  const d=x.getImageData(0,0,w,h).data;let s=0,n=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;s+=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;n++}
  const L=n?s/n:.5,p=img.closest("[data-lpanel]");if(p)p.style.background=L>.46?p.dataset.dark:p.dataset.light}catch(e){}};
M.logoFail=img=>{const p=img.closest("[data-lpanel]");img.style.display="none";const t=p&&p.querySelector("[data-ltype]");if(t)t.style.display="block";if(p)p.style.background=p.dataset.type||p.style.background;M.fitAll()};
/* shrink-to-fit: [data-fit=min px] boxes have a fixed size and em-sized children */
const over=el=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;
M.fitAll=()=>document.querySelectorAll("[data-fit]").forEach(el=>{if(!el.isConnected||!el.getClientRects().length)return;
  const base=+(el.dataset.base||(el.dataset.base=parseFloat(el.style.fontSize)||20)),min=+el.dataset.fit||14;
  el.querySelectorAll("[data-opt],[data-item]").forEach(n=>n.style.display="");
  const shrink=()=>{let s=base,g=0;el.style.fontSize=s+"px";while(over(el)&&s>min&&g++<120){s=Math.max(min,s-.5);el.style.fontSize=s+"px"}};
  shrink();if(!over(el))return;
  /* still too much at the 14px floor: drop notes from the end, then whole items (first item per course stays), then grow back */
  const opts=[...el.querySelectorAll("[data-opt]")],its=[...el.querySelectorAll("[data-item]:not([data-keep])")];
  while(over(el)&&opts.length)opts.pop().style.display="none";
  while(over(el)&&its.length)its.pop().style.display="none";
  shrink()});
const run=()=>{cancelAnimationFrame(M.raf);M.raf=requestAnimationFrame(M.fitAll)};
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
if(document.fonts){document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",run);document.fonts.ready.then(run)}
[300,900,1600,2200].forEach(t=>setTimeout(run,t));
})();
/* format: home. A home kitchen fridge door: family photo print, the cook's note, recipe cards held by letter magnets.
   2 faces, 816x1056. Era sets fridge enamel, print stock, type pairing; tone sets wear, tilt, photo treatment, voice. */
(function(){
const M=window.__MNS,W=816,H=1056;
const SIG="'Nothing You Could Do',cursive",SIGQ="Nothing+You+Could+Do";
/* era: d display, b body, fridge [mid, edge], card stock, ink, print border, photo process, magnet colours */
const ERA={
 "1930s-40s":{d:"'Sedan SC',serif",dq:"Sedan+SC",b:"'Crimson Pro',serif",bq:"Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400",dw:400,up:1,
   fridge:["#e8e1cf","#c9bfa6"],card:"#f4ead2",ink:"#2c2416",acc:"#8a3b22",pr:{bg:"#f3ecdc",pad:"14px 14px 34px",r:"3px",ir:"2px"},photo:"sepia(.6) grayscale(.45) contrast(1.06)",cap:1,mag:["#8a3b22","#2f4b3a","#6b5a2e"]},
 "1950s":{d:"'Oleo Script',cursive",dq:"Oleo+Script:wght@700",b:"'Libre Baskerville',serif",bq:"Libre+Baskerville:ital,wght@0,400;0,700;1,400",dw:700,up:0,
   fridge:["#cfe8de","#a5ccbe"],card:"#fffaf0",ink:"#1f2a36",acc:"#c2423c",pr:{bg:"#fbf7ee",pad:"16px 16px 30px",r:"10px",ir:"6px"},photo:"saturate(.78) sepia(.22) contrast(1.04)",cap:1,mag:["#e0473f","#2b7bb9","#f2b632"]},
 "1960s":{d:"'Chonburi',serif",dq:"Chonburi",b:"'Karla',sans-serif",bq:"Karla:ital,wght@0,400;0,700;1,400",dw:400,up:0,
   fridge:["#d9a06b","#b5774a"],card:"#fdf6e8",ink:"#2a1d14",acc:"#b0461e",pr:{bg:"#f7f1e4",pad:"16px",r:"14px",ir:"12px"},photo:"sepia(.28) saturate(1.12) hue-rotate(-8deg)",cap:0,mag:["#1e7f86","#f0c419","#d6452c"]},
 "1970s":{d:"'Coustard',serif",dq:"Coustard:wght@400;900",b:"'Nunito Sans',sans-serif",bq:"Nunito+Sans:ital,wght@0,400;0,700;1,400",dw:900,up:0,
   fridge:["#a6a24c","#7f7b33"],card:"#f8eed6",ink:"#33240f",acc:"#b5521b",pr:{bg:"#efe6d0",pad:"14px 14px 40px",r:"8px",ir:"6px"},photo:"sepia(.38) saturate(1.2) contrast(.95)",cap:1,mag:["#e07a1f","#c8372d","#f3c623"]},
 "1980s":{d:"'Kanit',sans-serif",dq:"Kanit:wght@800",b:"'Work Sans',sans-serif",bq:"Work+Sans:ital,wght@0,400;0,700;1,400",dw:800,up:1,
   fridge:["#efe7d5","#d2c7ae"],card:"#fffdf8",ink:"#1d1b28",acc:"#c2185b",pr:{bg:"#ffffff",pad:"12px",r:"2px",ir:"0"},photo:"saturate(1.15) contrast(1.06)",stamp:1,mag:["#e5197d","#18a3c9","#f6c90e"]},
 "1990s":{d:"'Bree Serif',serif",dq:"Bree+Serif",b:"'Source Sans 3',sans-serif",bq:"Source+Sans+3:ital,wght@0,400;0,700;1,400",dw:400,up:0,
   fridge:["#f7f7f3","#d6d6cf"],card:"#fffdf7",ink:"#1b2433",acc:"#1f5fa8",pr:{bg:"#ffffff",pad:"0",r:"3px",ir:"3px"},photo:"saturate(1.1) contrast(1.04)",stamp:1,mag:["#d7262e","#1f5fa8","#2e9b48"]},
 "2000s":{d:"'Baloo 2',sans-serif",dq:"Baloo+2:wght@800",b:"'Mulish',sans-serif",bq:"Mulish:ital,wght@0,400;0,800;1,400",dw:800,up:0,
   fridge:["#d4d7db","#a9aeb4"],brushed:1,card:"#ffffff",ink:"#1c2128",acc:"#d1491f",pr:{bg:"#ffffff",pad:"10px",r:"0",ir:"0"},photo:"saturate(1.06) contrast(1.06) brightness(1.02)",cap:0,mag:["#ff6a13","#7ac143","#00a3e0"]},
 "modern":{d:"'DM Serif Display',serif",dq:"DM+Serif+Display",b:"'DM Sans',sans-serif",bq:"DM+Sans:ital,wght@0,400;0,700;1,400",dw:400,up:0,
   fridge:["#3b3d40","#25272a"],card:"#fbf9f4",ink:"#16181b",acc:"#b8452a",pr:{bg:"#fbfaf6",pad:"8px",r:"2px",ir:"0"},photo:"none",cap:0,mag:["#f2efe8","#e0b23c","#c9503a"]}
};
/* tone: wear (grain), tilt, vignette, photo treatment, the cook's voice */
const TONE={
 gritty:{wear:.5,rot:1.2,vig:.35,photo:"contrast(1.15) saturate(.8)",k:"House rules",lst:"Before you sit down"},
 glossy:{wear:.06,rot:.4,vig:.12,photo:"saturate(1.12) contrast(1.05)",k:"Tonight's table",lst:"For tonight"},
 warm:{wear:.2,rot:1,vig:.22,photo:"sepia(.1) saturate(1.05)",k:"Stuck on the fridge",lst:"Don't forget"},
 eerie:{wear:.32,rot:.6,vig:.55,photo:"saturate(.55) brightness(.93) contrast(1.1)",k:"Left on the fridge for you",lst:"Do not forget"},
 playful:{wear:.12,rot:2.2,vig:.1,photo:"saturate(1.2) brightness(1.03)",k:"Read me before the fridge",lst:"Don't forget!"},
 grand:{wear:.14,rot:.3,vig:.25,photo:"contrast(1.08) sepia(.08)",k:"Tonight we feast",lst:"The plan"},
 tender:{wear:.2,rot:1,vig:.25,photo:"brightness(1.05) saturate(.92) sepia(.12)",k:"With love, from the kitchen",lst:"Remember"},
 tense:{wear:.3,rot:.5,vig:.42,photo:"contrast(1.22) saturate(.7)",k:"Dinner at seven sharp",lst:"Check twice"},
 scrappy:{wear:.45,rot:2.8,vig:.2,photo:"contrast(1.25) saturate(.85)",k:"Dinner, sorted",lst:"Grab on the way"}
};
const LABEL={s:"To Start",m:"Mains",w:"Something Sweet",d:"To Drink"};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS.home=function(ctx){
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm,x=M.esc,fam=M.family(f);
  [E.dq,E.bq,SIGQ].forEach(M.font);
  const fl=ctx.flavour||{},nt=fl.note&&fl.note.text?fl.note:{text:"Dinner is on the table at seven. Plates in the sink before the film starts, and no talking in the good bits.",by:"The cook"};
  const venue=fl.venue||"Family Kitchen",sign=fl.sign||"Home cooking, film night";
  const winks=(fl.winks&&fl.winks.length?fl.winks:["Popcorn after mains","Napkins by the couch","Phones off when the lights go down"]).slice(0,5).map(w=>M.dry(w,fam));
  const num=M.num(fl.number,f.year),yy=String(f.year||"").slice(-2);
  const ink=E.ink,acc=M.accent(ctx.palette,E.card,E.acc,3.4),dark=M.darkOf(ctx.palette,"#15161a");
  const st=ctx.stills||[],pos=M.poster(ctx)?ctx.img(M.poster(ctx),"w780"):"";
  const hero=st[0]?ctx.img(st[0],"w1280"):pos,second=st[1]?ctx.img(st[1],"w1280"):(pos||hero);
  const heroPos=st[0]?"center 40%":"center 22%",secPos=st[1]?"center 40%":"center 62%";
  const C=M.courses(ctx.menu,fam);
  const bd=E.b,dd=E.d,up=E.up?"text-transform:uppercase;":"";
  const grain=`background-image:${M.noise(T.wear)};`;
  /* the fridge door: enamel with side light, grain by tone, brushed steel in the 2000s */
  const door=`<div style="position:absolute;inset:0;background:linear-gradient(90deg,${E.fridge[1]} 0%,${E.fridge[0]} 16%,${E.fridge[0]} 74%,${E.fridge[1]} 100%)"></div>
   ${E.brushed?`<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 1px,rgba(0,0,0,.035) 1px 2px,transparent 2px 4px)"></div>`:""}
   <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 38% 30%,rgba(255,255,255,.22),transparent 55%),radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,${T.vig}) 100%)"></div>
   <div style="position:absolute;inset:0;${grain}opacity:.8"></div>`;
  /* a photo print stuck on the door */
  const print=(src,l,t,w,h,rot,op,cap)=>`<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;box-sizing:border-box;padding:${E.pr.pad};background:${E.pr.bg};border-radius:${E.pr.r};transform:rotate(${rot}deg);box-shadow:0 14px 28px rgba(0,0,0,.34),0 2px 5px rgba(0,0,0,.25)">
     <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:${E.pr.ir};background:#222">
      ${src?`<img src="${src}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;object-position:${op};filter:${E.photo==="none"?"":E.photo} ${T.photo}">`:""}
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(0,0,0,${(T.vig*.7).toFixed(2)}) 100%),linear-gradient(160deg,rgba(255,255,255,${E.stamp?.16:.05}),transparent 40%)"></div>
      ${E.stamp?`<div style="position:absolute;right:18px;bottom:12px;font:700 22px/1 ${bd};letter-spacing:3px;color:#ff8a1c;text-shadow:0 0 4px rgba(255,120,0,.7)">'${x(yy)} 10 26</div>`:""}
     </div>
     ${cap&&E.cap?`<div style="position:absolute;left:0;right:0;bottom:2px;text-align:right;padding-right:26px;font:30px/1.1 ${SIG};color:#3a3326">${x(cap)}</div>`:""}
   </div>`;
  /* plastic letter magnets, type only */
  const mags=(word,l,t,size)=>`<div style="position:absolute;left:${l}px;top:${t}px;display:flex;gap:2px;transform:rotate(${-T.rot*1.4}deg)">${[...word].map((ch,i)=>ch===" "?`<span style="width:${size*.35}px"></span>`:`<span style="font:900 ${size}px/1 'Baloo 2',${dd};color:${E.mag[i%E.mag.length]};transform:rotate(${((i*37)%9-4)*T.rot*.9}deg);display:inline-block;text-shadow:0 2px 0 rgba(0,0,0,.28),0 6px 8px rgba(0,0,0,.3)">${x(ch)}</span>`).join("")}</div>`;
  M.font("Baloo+2:wght@800");

  /* logo in its own colours on a stuck-on card that suits it */
  const lg=ctx.logo,lr=lg&&lg[1]&&lg[2]?lg[1]/lg[2]:0;
  const lw=lr?Math.min(400,108*lr):0,lh=lr?lw/lr:0;
  const typeT=`<div data-ltype data-fit="22" style="display:${lr?"none":"block"};width:400px;height:112px;overflow:hidden;font:${E.dw} 46px/1.02 ${dd};${up}color:#fff;font-size:46px">${x(f.title)}</div>`;
  const logo=`<div data-lpanel data-dark="rgba(20,20,24,.9)" data-light="rgba(252,250,244,.94)" data-type="${dark}" style="position:absolute;left:46px;top:500px;padding:14px 20px;border-radius:${E.pr.r};background:${lr?"rgba(20,20,24,.9)":dark};box-shadow:0 10px 22px rgba(0,0,0,.35);transform:rotate(${-T.rot*.8}deg);max-width:440px">
     ${lr?`<img src="${ctx.img(lg[0],"w500")}" crossorigin="anonymous" alt="${x(f.title)}" onload="window.__MNS&&__MNS.logoTone(this)" onerror="window.__MNS&&__MNS.logoFail(this)" style="display:block;width:${lw}px;height:${lh}px;object-fit:contain">`:""}
     ${typeT}
   </div>`;

  const kick=(t,c)=>`<div style="font:700 .9em/1.2 ${bd};letter-spacing:.2em;text-transform:uppercase;color:${c||acc}">${x(t)}</div>`;
  const lined=`background:${E.card};background-image:repeating-linear-gradient(to bottom,transparent 0 33px,rgba(70,110,180,.16) 33px 34px);`;
  /* front */
  const front=`${door}
   ${print(hero,28,48,760,560,-T.rot*.5,heroPos,`Film night, ${f.year||""}`)}
   ${mags("EAT",604,20,58)}
   ${logo}
   <div style="position:absolute;left:34px;top:656px;width:372px;height:368px;box-sizing:border-box;padding:46px 26px 20px;${lined}transform:rotate(${T.rot*1.1}deg);box-shadow:0 10px 22px rgba(0,0,0,.28),inset 0 0 ${30*T.wear}px rgba(120,90,40,${T.wear*.6})">
     <div style="position:absolute;left:0;right:0;top:0;height:30px;background:${acc}"></div>
     <div data-fit="17" style="height:226px;overflow:hidden;font-size:22px;color:${ink}">
       ${kick(T.k)}
       <div style="margin-top:.45em;font:italic 1.05em/1.4 ${bd}">${x(nt.text)}</div>
     </div>
     <div style="font:40px/1.1 ${SIG};color:#24407a;margin-top:6px;white-space:nowrap;overflow:hidden">${x(nt.by)}</div>
   </div>
   <div style="position:absolute;left:428px;top:640px;width:356px;height:390px;box-sizing:border-box;padding:22px 24px 18px;background:${E.card};transform:rotate(${-T.rot*.7}deg);box-shadow:0 10px 22px rgba(0,0,0,.28),inset 0 0 ${30*T.wear}px rgba(120,90,40,${T.wear*.6})">
     <div style="height:3px;background:${acc};margin-bottom:4px"></div>
     <div style="height:1px;background:rgba(60,100,170,.45);margin-bottom:14px"></div>
     <div data-fit="16" style="height:322px;overflow:hidden;font-size:20px;color:${ink}">
       ${kick(`Recipe box no. ${num}`)}
       <div style="margin-top:.25em;font:${E.dw} 2em/1.04 ${dd};${up}color:${ink}">${x(venue)}</div>
       <div style="margin-top:.35em;font:700 1em/1.3 ${bd};color:${acc}">${x(sign)}</div>
       ${f.T?`<div style="margin-top:.6em;font:italic 1.05em/1.35 ${bd}">${x(f.T)}</div>`:""}
       ${f.P?`<div style="margin-top:.8em;padding-top:.6em;border-top:1px solid rgba(0,0,0,.18)">${kick("Showtime")}<div style="margin-top:.2em;font:1em/1.35 ${bd}">${x(M.sent(f.P))}</div></div>`:""}
     </div>
   </div>`;

  /* back: second print, magnet list of winks, two recipe cards for the courses */
  const half=Math.ceil(C.length/2),cardA=C.slice(0,half),cardB=C.slice(half);
  const course=c=>`<div style="margin-bottom:.55em">
      <div style="font:${E.dw} 1.3em/1.1 ${dd};${up}color:${acc};margin-bottom:.25em">${LABEL[c.k]}</div>
      ${c.items.map((it,i)=>`<div data-item${i?"":" data-keep"} style="margin-bottom:.42em"><div style="font:700 1em/1.15 ${bd};color:${ink}">${x(it.n)}</div>${it.note?`<div data-opt style="font:.76em/1.3 ${bd};color:${ink};opacity:.85;margin-top:.1em">${x(it.note)}</div>`:""}</div>`).join("")}
    </div>`;
  const rcard=(cs,l,t,rot,head,foot)=>`<div style="position:absolute;left:${l}px;top:${t}px;width:370px;height:476px;box-sizing:border-box;padding:18px 22px 14px;background:${E.card};transform:rotate(${rot}deg);box-shadow:0 12px 24px rgba(0,0,0,.3),inset 0 0 ${30*T.wear}px rgba(120,90,40,${T.wear*.6});display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:baseline;font:700 17px/1.2 ${bd};letter-spacing:.18em;text-transform:uppercase;color:${acc}"><span>Recipe</span><span>${x(head)}</span></div>
      <div style="height:3px;background:${acc};margin:6px 0 3px"></div><div style="height:1px;background:rgba(60,100,170,.45);margin-bottom:12px"></div>
      <div data-fit="19" style="flex:1;min-height:0;overflow:hidden;font-size:28px">${cs.length?cs.map(course).join(""):`<div style="font:italic .8em/1.4 ${bd};color:${ink}">Whatever is in the fridge, served with the film.</div>`}</div>
      <div style="font:15px/1.3 ${bd};color:${ink};opacity:.8;margin-top:6px">${foot}</div>
    </div>`;
  const back=`${door}
   ${print(second,282,30,508,502,T.rot*.6,secPos,"")}
   <div style="position:absolute;left:30px;top:52px;width:236px;height:440px;box-sizing:border-box;padding:40px 18px 16px;${lined}transform:rotate(${-T.rot}deg);box-shadow:0 10px 20px rgba(0,0,0,.26)">
     <div style="position:absolute;left:0;right:0;top:0;height:24px;background:${E.mag[1]}"></div>
     <div data-fit="15" style="height:380px;overflow:hidden;font-size:20px;color:${ink}">
       <div style="font:${E.dw} 1.35em/1.05 ${dd};${up}color:${acc};margin-bottom:.4em">${x(T.lst)}</div>
       ${winks.map((w,i)=>`<div style="display:flex;gap:.4em;font:1em/1.3 ${bd};margin-bottom:.45em"><span style="font-weight:700;color:${acc}">${i+1}.</span><span>${x(w)}</span></div>`).join("")}
     </div>
   </div>
   ${mags(String(num).slice(0,3),110,22,52)}
   ${rcard(cardA,26,552,-T.rot*.6,`No. ${num}`,`From the ${x(venue.replace(/^the\s+/i,""))}.`)}
   ${rcard(cardB,420,548,T.rot*.5,f.year?String(f.year):"",`Serves everyone on the couch. ${fam?"Every drink alcohol free. ":""}Photos: TMDB.`)}`;
  return {w:W,h:H,faces:[front,back]};
};
/* fonts ready: the app awaits .ready before it renders, so the fitter measures with the real faces and text never spills at a late font swap */
function fontSpecs(url){const o=[];String(url||"").replace(/family=([^&:]+)(?::([a-z,]+)@([^&]+))?/g,(m,fam,ax,vals)=>{fam=decodeURIComponent(fam.replace(/\+/g," "));
  if(!ax){o.push(`400 20px "${fam}"`);return m}const a=ax.split(",");vals.split(";").forEach(v=>{const p=v.split(","),g=n=>a.indexOf(n)<0?null:p[a.indexOf(n)];o.push(`${g("ital")==="1"?"italic ":""}${g("wght")||400} 20px "${fam}"`)});return m});return o}
function fontsReady(links){return Promise.all(links.filter(Boolean).map(l=>new Promise(r=>{if(l.sheet)return r();l.addEventListener("load",r);l.addEventListener("error",r);setTimeout(r,3500)})
  .then(()=>Promise.all(fontSpecs(l.getAttribute("href")).map(s=>document.fonts.load(s).catch(()=>0)))))).then(()=>document.fonts.ready).catch(()=>0)}
{const qs=new Set([SIGQ,"Baloo+2:wght@800"]);Object.values(ERA).forEach(e=>{qs.add(e.dq);qs.add(e.bq)});qs.forEach(M.font);
  const links=[...qs].map(q=>[...document.querySelectorAll("link[rel=stylesheet]")].find(l=>l.getAttribute("href")==="https://fonts.googleapis.com/css2?family="+q+"&display=swap"));
  window.MENU_FORMATS.home.ready=fontsReady(links)}
/* fit in the same turn the faces land, so no frame shows unfitted text */
if(!window.__fitHomeSync){window.__fitHomeSync=1;new MutationObserver(m=>{if(m.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches("[data-fit]")||n.querySelector&&n.querySelector("[data-fit]")))))M.fitAll()}).observe(document.documentElement,{childList:true,subtree:true})}
})();
