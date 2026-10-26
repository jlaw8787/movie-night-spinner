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
/* format: invite. A party or wedding invitation with its menu card: invitation front with photo, menu back with place card and RSVP.
   2 faces, 600x900. Era sets stock, border, print process and type pairing; tone sets wear, photo, wording. */
(function(){
const M=window.__MNS,W=600,H=900;
const SIG="'Pinyon Script',cursive",SIGQ="Pinyon+Script";
const ERA={
 "1930s-40s":{d:"'Forum',serif",dq:"Forum",b:"'Cormorant Garamond',serif",bq:"Cormorant+Garamond:ital,wght@0,500;0,700;1,500",dw:400,up:1,ls:".08em",
   paper:"#f2e9d3",ink:"#2a2216",acc:"#7a5a1e",border:"double",press:"letter",photo:"sepia(.55) grayscale(.5) contrast(1.05)",deckle:1},
 "1950s":{d:"'Rufina',serif",dq:"Rufina:wght@700",b:"'Libre Baskerville',serif",bq:"Libre+Baskerville:ital,wght@0,400;0,700;1,400",dw:700,up:0,ls:"0",
   paper:"#fbf5ea",ink:"#2a2230",acc:"#9c3550",border:"dots",press:"offset",photo:"saturate(.8) sepia(.2) contrast(1.04)",deckle:1},
 "1960s":{d:"'Josefin Sans',sans-serif",dq:"Josefin+Sans:wght@700",b:"'Josefin Slab',serif",bq:"Josefin+Slab:ital,wght@0,400;0,700;1,400",dw:700,up:1,ls:".12em",
   paper:"#ffffff",ink:"#16161a",acc:"#c2185b",border:"mod",press:"offset",photo:"sepia(.2) saturate(1.1) hue-rotate(-6deg)",deckle:0},
 "1970s":{d:"'Sansita Swashed',cursive",dq:"Sansita+Swashed:wght@800",b:"'Lora',serif",bq:"Lora:ital,wght@0,400;0,700;1,400",dw:800,up:0,ls:"0",
   paper:"#f3e3c6",ink:"#3a2412",acc:"#a8451a",border:"round",press:"offset",photo:"sepia(.35) saturate(1.15) contrast(.95)",deckle:0},
 "1980s":{d:"'Philosopher',sans-serif",dq:"Philosopher:wght@700",b:"'Quattrocento Sans',sans-serif",bq:"Quattrocento+Sans:ital,wght@0,400;0,700;1,400",dw:700,up:1,ls:".06em",
   paper:"#f8e8e6",ink:"#2b1f2c",acc:"#8c3f72",border:"pearl",press:"gloss",photo:"brightness(1.06) contrast(.96) saturate(1.05)",deckle:0},
 "1990s":{d:"'Playfair Display',serif",dq:"Playfair+Display:ital,wght@0,800;1,700",b:"'EB Garamond',serif",bq:"EB+Garamond:ital,wght@0,400;0,700;1,400",dw:800,up:0,ls:"0",
   paper:"#fbf8f0",ink:"#1f1a14",acc:"#8a6a28",border:"gilt",press:"emboss",photo:"saturate(1.05) contrast(1.03)",deckle:1},
 "2000s":{d:"'Raleway',sans-serif",dq:"Raleway:ital,wght@0,400;0,800;1,400",b:"'Raleway',sans-serif",bq:"",dw:800,up:1,ls:".1em",
   paper:"#ffffff",ink:"#1d1d22",acc:"#2f6f8f",border:"band",press:"laser",photo:"saturate(1.08) contrast(1.05)",deckle:0},
 "modern":{d:"'Young Serif',serif",dq:"Young+Serif",b:"'Inter',sans-serif",bq:"Inter:ital,wght@0,400;0,700;1,400",dw:400,up:0,ls:"0",
   paper:"#f4efe6",ink:"#1a1a1a",acc:"#a24a2c",border:"none",press:"deboss",photo:"none",deckle:0}
};
const TONE={
 gritty:{wear:.4,vig:.3,photo:"contrast(1.15) saturate(.8)",k:"Be there",lead:"for dinner and a film at"},
 glossy:{wear:.04,vig:.1,photo:"saturate(1.12) contrast(1.05)",k:"You are cordially invited",lead:"to an evening of dinner and a film at"},
 warm:{wear:.16,vig:.2,photo:"sepia(.1) saturate(1.05)",k:"Come and eat with us",lead:"for dinner and a film at"},
 eerie:{wear:.3,vig:.5,photo:"saturate(.55) brightness(.93) contrast(1.1)",k:"You are expected",lead:"after dark, for dinner and a film at"},
 playful:{wear:.08,vig:.08,photo:"saturate(1.2) brightness(1.03)",k:"You're invited!",lead:"to eat, laugh and watch a film at"},
 grand:{wear:.1,vig:.22,photo:"contrast(1.08) sepia(.08)",k:"The honour of your presence",lead:"is requested for dinner and a film at"},
 tender:{wear:.14,vig:.22,photo:"brightness(1.05) saturate(.92) sepia(.1)",k:"Please join us",lead:"for a quiet dinner and a film at"},
 tense:{wear:.24,vig:.38,photo:"contrast(1.2) saturate(.72)",k:"Your attendance is requested",lead:"for dinner and a film, promptly, at"},
 scrappy:{wear:.38,vig:.18,photo:"contrast(1.22) saturate(.88)",k:"Party at ours",lead:"food, a film, bring a chair, at"}
};
const LABEL={s:"First Course",m:"Main Course",w:"Dessert",d:"To Toast"};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS.invite=function(ctx){
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm,x=M.esc,fam=M.family(f);
  [E.dq,E.bq,SIGQ].forEach(M.font);
  const fl=ctx.flavour||{},nt=fl.note&&fl.note.text?fl.note:{text:"Come as you are, bring your appetite, and stay for the film. We have saved you a seat.",by:"Your hosts"};
  const venue=fl.venue||"The Dining Room",sign=fl.sign||"Dinner and a film";
  const winks=(fl.winks||[]).map(w=>M.dry(w,fam));
  const num=M.num(fl.number,f.year);
  const ink=E.ink,paper=E.paper,acc=M.accent(ctx.palette,paper,E.acc,3.6),dark=M.darkOf(ctx.palette,"#1a1714");
  const st=ctx.stills||[],pos=M.poster(ctx)?ctx.img(M.poster(ctx),"w780"):"";
  const hero=st[0]?ctx.img(st[0],"w1280"):pos,second=st[1]?ctx.img(st[1],"w1280"):(pos||hero);
  const C=M.courses(ctx.menu,fam);
  const bd=E.b,dd=E.d,up=E.up?"text-transform:uppercase;":"";
  /* print process: letterpress bite, embossed or debossed lift, offset flat, laser crisp */
  const press={letter:"text-shadow:0 0 .6px currentColor,0 1px 0 rgba(255,255,255,.5);",emboss:"text-shadow:0 1px 0 rgba(255,255,255,.9),0 -1px 0 rgba(0,0,0,.12);",deboss:"text-shadow:0 1px 1px rgba(255,255,255,.8),0 -1px 0 rgba(0,0,0,.18);",gloss:"",offset:"",laser:""}[E.press]||"";
  const stock=`<div style="position:absolute;inset:0;background:${paper}"></div>
    ${E.border==="pearl"?`<div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.55),transparent 35%,rgba(255,255,255,.35) 60%,transparent 85%)"></div>`:""}
    <div style="position:absolute;inset:0;background-image:${M.noise(T.wear+.04)}"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 58%,rgba(70,50,20,${(T.vig*.55).toFixed(2)}) 100%)"></div>
    ${E.deckle?`<div style="position:absolute;inset:0;box-shadow:inset 0 0 0 3px rgba(255,255,255,.5),inset 0 0 18px rgba(90,70,30,.35)"></div>`:""}`;
  const border=({
    double:`<div style="position:absolute;inset:12px;border:3px double ${acc}"></div><div style="position:absolute;inset:20px;border:1px solid ${acc};opacity:.6"></div>`,
    dots:`<div style="position:absolute;inset:12px;border:3px dotted ${acc};border-radius:14px"></div>`,
    mod:`<div style="position:absolute;inset:0 0 auto 0;height:12px;background:${acc}"></div><div style="position:absolute;inset:auto 0 0 0;height:12px;background:${acc}"></div>`,
    round:`<div style="position:absolute;inset:10px;border:6px solid ${acc};border-radius:26px"></div>`,
    pearl:`<div style="position:absolute;inset:12px;border:2px solid ${acc};border-radius:4px;box-shadow:0 0 0 4px rgba(255,255,255,.7),0 0 0 5px ${acc}"></div>`,
    gilt:`<div style="position:absolute;inset:12px;border:2px solid #b08d3c;box-shadow:inset 0 0 0 1px rgba(255,240,200,.8),0 0 0 1px rgba(120,90,30,.5)"></div>`,
    band:`<div style="position:absolute;left:0;top:0;bottom:0;width:12px;background:${acc}"></div>`,
    none:``}[E.border])||"";
  const photo=(src,l,t,w,h,op)=>`<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;overflow:hidden;background:#222;outline:1px solid ${acc};outline-offset:4px;border-radius:${E.border==="round"?"14px":E.border==="dots"?"8px":"0"}">
     ${src?`<img src="${src}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;object-position:${op};filter:${E.photo==="none"?"":E.photo} ${T.photo}">`:""}
     <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(0,0,0,${(T.vig*.7).toFixed(2)}) 100%)${E.press==="gloss"?",linear-gradient(150deg,rgba(255,255,255,.22),transparent 45%)":""}"></div>
   </div>`;
  const kick=(t,s)=>`<div style="font:700 ${s||".72em"}/1.25 ${bd};letter-spacing:.22em;text-transform:uppercase;color:${acc}">${x(t)}</div>`;
  const rule=`<div style="width:90px;height:2px;background:${acc};margin:.55em auto"></div>`;

  /* logo in its own colours on a panel that suits it */
  const lg=ctx.logo,lr=lg&&lg[1]&&lg[2]?lg[1]/lg[2]:0,lw=lr?Math.min(400,90*lr):0,lh=lr?lw/lr:0;
  const logo=`<div style="position:absolute;left:0;right:0;top:${lr?Math.round(440-lh-28):360}px;display:flex;justify-content:center">
    <div data-lpanel data-dark="rgba(18,16,20,.88)" data-light="rgba(253,250,244,.94)" data-type="${dark}" style="padding:12px 20px;background:${lr?"rgba(18,16,20,.88)":dark};box-shadow:0 8px 20px rgba(0,0,0,.35);border-radius:${E.border==="round"?"14px":"2px"}">
     ${lr?`<img src="${ctx.img(lg[0],"w500")}" crossorigin="anonymous" alt="${x(f.title)}" onload="__MNS.logoTone(this)" onerror="__MNS.logoFail(this)" style="display:block;width:${lw}px;height:${lh}px;object-fit:contain">`:""}
     <div data-ltype data-fit="20" style="display:${lr?"none":"block"};width:440px;height:96px;overflow:hidden;text-align:center;font:${E.dw} 40px/1.08 ${dd};${up}color:#fff;font-size:40px">${x(f.title)}</div>
    </div></div>`;

  const front=`${stock}${border}
   ${photo(hero,34,34,532,416,st[0]?"center 40%":"center 22%")}
   ${logo}
   <div data-fit="18" style="position:absolute;left:44px;top:472px;width:512px;height:236px;overflow:hidden;display:flex;flex-direction:column;justify-content:center;text-align:center;font-size:21px;color:${ink};${press}">
     ${kick(T.k,".82em")}
     <div style="margin-top:.35em;font:italic 1em/1.35 ${bd}">${x(T.lead)}</div>
     <div style="margin-top:.2em;font:${E.dw} 2.05em/1.05 ${dd};${up}letter-spacing:${E.ls};color:${ink}">${x(venue)}</div>
     <div style="margin-top:.35em;font:700 .9em/1.3 ${bd};letter-spacing:.12em;text-transform:uppercase;color:${acc}">${x(sign)}</div>
     ${f.T?`<div style="margin-top:.45em;font:italic 1em/1.35 ${bd}">${x(f.T)}</div>`:""}
   </div>
   <div style="position:absolute;left:58px;right:58px;top:720px;height:150px;box-sizing:border-box;padding:12px 18px 6px;border-top:1px solid ${acc};border-bottom:1px solid ${acc};text-align:center;color:${ink}">
     <div data-fit="14" style="height:78px;overflow:hidden;font:italic 19px/1.35 ${bd};font-size:19px">${x(nt.text)}</div>
     <div style="font:38px/1.1 ${SIG};color:${acc};white-space:nowrap;overflow:hidden">${x(nt.by)}</div>
   </div>`;

  const course=c=>`<div style="margin-bottom:.5em">${kick(LABEL[c.k],".7em")}
     ${c.items.map((it,i)=>`<div data-item${i?"":" data-keep"} style="margin-top:.2em"><div style="font:${E.dw} 1em/1.15 ${dd};${up}letter-spacing:${E.up?".03em":"0"};color:${ink}">${x(it.n)}</div>${it.note?`<div data-opt style="font:italic .78em/1.3 ${bd};color:${ink};opacity:.85">${x(it.note)}</div>`:""}</div>`).join("")}</div>`;
  const back=`${stock}${border}
   ${photo(second,24,24,552,246,st[1]?"center 40%":"center 60%")}
   <div style="position:absolute;left:0;right:0;top:282px;text-align:center;font:${E.dw} 40px/1 ${dd};${up}letter-spacing:${E.up?".2em":"0"};color:${ink};${press}">Menu</div>
   <div style="position:absolute;left:0;right:0;top:330px">${rule}</div>
   <div data-fit="20" style="position:absolute;left:40px;top:346px;width:520px;height:398px;overflow:hidden;text-align:center;font-size:26px;${press}">
     ${C.length?C.map(course).join(""):`<div style="font:italic .8em/1.4 ${bd};color:${ink}">The kitchen will surprise you.</div>`}
   </div>
   <div style="position:absolute;left:40px;top:756px;width:232px;height:116px;box-sizing:border-box;padding:12px 14px;background:${E.paper==="#ffffff"?"#f6f4ef":"#fffdf8"};box-shadow:0 4px 10px rgba(0,0,0,.18);text-align:center;transform:rotate(-1.5deg)">
     <div style="position:absolute;left:0;right:0;top:38px;height:1px;background:rgba(0,0,0,.12)"></div>
     ${kick("Place card","15px")}
     <div style="margin-top:10px;font:${E.dw} 30px/1 ${dd};${up}color:${ink}">Table ${x(num)}</div>
     <div data-fit="14" style="height:36px;overflow:hidden;margin-top:4px;font:15px/1.2 ${bd};font-size:15px;color:${ink}">${x(winks[1]?`Seated near: ${winks[1]}`:"Your seat, saved")}</div>
   </div>
   <div style="position:absolute;left:286px;top:756px;width:274px;height:116px;box-sizing:border-box;padding:10px 14px;border:1px solid ${acc};text-align:left;color:${ink}">
     <div style="display:flex;justify-content:space-between;align-items:baseline">${kick("R.S.V.P.","15px")}<span style="font:15px/1 ${bd};opacity:.8">${x(f.year||"")}</span></div>
     <div data-fit="14" style="height:76px;overflow:hidden;margin-top:4px;font:16px/1.3 ${bd};font-size:16px">${x(f.P?`Showtime: ${M.sent(f.P)}`:"Kindly reply before the film starts.")}${winks[0]?` <i>Also on the list: ${x(winks[0])}.</i>`:""}${fam?" All drinks alcohol free.":""}</div>
   </div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
