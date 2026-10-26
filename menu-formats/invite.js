/* shared picture helper (same block in placemat, stadium, prom, kiosk, invite; first file to load wins).
   still: a still that is mostly blank white or near black is swapped for the next candidate, the least bad one is kept,
          a dark keeper gets lifted; a failed still falls through to the next one, then the poster.
   logo: transparent padding is trimmed and the logo is sized by area into its max box, so the panel wraps the logo.
   place: props and logo panels on a photo go to the candidate spot that covers the least face and detail
          (skin tone weighted edges), and the crop can slide to give faces room. */
(function(){
if(window.__PICK)return;
const P=window.__PICK={};
const grab=(img,w)=>{const c=document.createElement("canvas");c.width=w;c.height=Math.max(4,Math.round(w*img.naturalHeight/img.naturalWidth));const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(img,0,0,c.width,c.height);return {w:c.width,h:c.height,d:x.getImageData(0,0,c.width,c.height).data}};
P.stats=img=>{const g=grab(img,64),d=g.d;let n=0,wh=0,bl=0,s=0;for(let i=0;i<d.length;i+=4){const r=d[i],gg=d[i+1],b=d[i+2],L=.2126*r+.7152*gg+.0722*b,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);n++;s+=L;if(L>228&&mx-mn<34)wh++;if(L<26)bl++}return {white:wh/n,black:bl/n,mean:s/n}};
P.bad=st=>st.white>.28||st.black>.48||st.mean<42;
P.score=st=>st.white*2+st.black+Math.max(0,70-st.mean)/70;
P.still=img=>{
  if(img.dataset.done){P.place(img);return}
  let st;try{st=P.stats(img)}catch(e){img.dataset.done="1";P.place(img);return}
  const sc=P.score(st);if(!img.__best||sc<img.__best.sc)img.__best={sc,src:img.src,st};
  const alts=(img.dataset.alts||"").split("|").filter(Boolean),tries=+(img.dataset.tries||0);
  if(P.bad(st)&&alts.length&&tries<4){img.dataset.tries=tries+1;img.dataset.alts=alts.slice(1).join("|");img.src=alts[0];return}
  const b=img.__best;img.dataset.done="1";
  if(b.st.mean<72&&!img.dataset.lift){img.dataset.lift="1";img.style.filter=(img.style.filter||"")+" brightness("+(b.st.mean<45?1.45:1.25)+")"}
  if(b.src!==img.src){img.src=b.src;return}
  P.place(img)};
P.fail=img=>{const alts=(img.dataset.alts||"").split("|").filter(Boolean);
  if(alts.length){img.dataset.alts=alts.slice(1).join("|");img.src=alts[0];return}
  if(img.dataset.last&&img.src!==img.dataset.last){img.dataset.done="1";img.src=img.dataset.last}};
/* saliency grid: edges, boosted where the colour is skin, lightly blurred so faces read as solid blocks */
P.sal=img=>{
  if(img.__sal&&img.__sal.src===img.src)return img.__sal;
  const g=grab(img,96),w=g.w,h=g.h,d=g.d,N=w*h,L=new Float32Array(N),S=new Float32Array(N);
  for(let i=0,p=0;i<d.length;i+=4,p++){const r=d[i],gg=d[i+1],b=d[i+2];L[p]=.299*r+.587*gg+.114*b;const cb=128-.1687*r-.3313*gg+.5*b,cr=128+.5*r-.4187*gg-.0813*b;S[p]=(cb>=77&&cb<=127&&cr>=137&&cr<=175&&L[p]>40&&L[p]<240)?1:0}
  const E=new Float32Array(N);let em=0;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x,e=Math.abs(L[p+1]-L[p-1])+Math.abs(L[p+w]-L[p-w]);E[p]=e;em+=e}
  em=em/N||1;const R=new Float32Array(N);
  for(let p=0;p<N;p++)R[p]=Math.min(3,E[p]/em)*(.35+1.65*S[p]);
  const G=new Float32Array(N);let tot=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let s=0,n=0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const yy=y+j,xx=x+i;if(yy<0||xx<0||yy>=h||xx>=w)continue;s+=R[yy*w+xx];n++}G[y*w+x]=s/n;tot+=s/n}
  return img.__sal={src:img.src,w,h,G,tot:tot||1}};
P.place=img=>{
  const box=img.closest("[data-safe]");if(!box||!img.naturalWidth)return;
  let cfg;try{cfg=JSON.parse(box.dataset.safe)}catch(e){return}
  let sal;try{sal=P.sal(img)}catch(e){return}
  const bw=box.clientWidth,bh=box.clientHeight;if(!bw||!bh)return;
  const ib={x:img.offsetLeft,y:img.offsetTop,w:img.clientWidth||bw,h:img.clientHeight||bh};
  const contain=getComputedStyle(img).objectFit==="contain";
  const items=(cfg.items||[]).map(it=>({it,el:box.querySelector(it.q)})).filter(o=>o.el&&o.el.offsetWidth);
  const fixed=(cfg.fixed||[]).map(q=>box.querySelector(q)).filter(Boolean).map(el=>({x:el.offsetLeft,y:el.offsetTop,w:el.offsetWidth,h:el.offsetHeight}));
  const pos=cfg.pos&&cfg.pos.length&&!contain?cfg.pos:[[50,50]];
  const p0=pos[0];let best=null;
  for(const [px,py] of pos){
    const s=contain?Math.min(ib.w/sal.w,ib.h/sal.h):Math.max(ib.w/sal.w,ib.h/sal.h),dw=sal.w*s,dh=sal.h*s,ox=ib.x+(ib.w-dw)*px/100,oy=ib.y+(ib.h-dh)*py/100;
    const sum=(x0,y0,x1,y1)=>{const i0=Math.max(0,Math.floor((x0-ox)/s)),i1=Math.min(sal.w-1,Math.ceil((x1-ox)/s)),j0=Math.max(0,Math.floor((y0-oy)/s)),j1=Math.min(sal.h-1,Math.ceil((y1-oy)/s));let t=0;
      for(let j=j0;j<=j1;j++){const cy=oy+(j+.5)*s;if(cy<y0||cy>y1)continue;for(let i=i0;i<=i1;i++){const cx=ox+(i+.5)*s;if(cx>=x0&&cx<=x1)t+=sal.G[j*sal.w+i]}}return t};
    const vis=sum(0,0,bw,bh);let cost=-.35*vis/sal.tot+(Math.abs(px-p0[0])+Math.abs(py-p0[1]))/500;
    /* every combination of spots is tried (a handful of items, a few spots each), overlaps ruled out */
    const opts=items.map(({it,el})=>{const w=el.offsetWidth,h=el.offsetHeight;return it.c.map((c,ci)=>{const x=c[0]==="l"?c[1]:c[0]==="r"?bw-w-c[1]:(bw-w)/2+(c[1]||0),y=c[2]==="t"?c[3]:c[2]==="b"?bh-h-c[3]:(bh-h)/2+(c[3]||0);
      let k=sum(x,y,x+w,y+h)/sal.tot*(it.w||1)+ci*.004;for(const r of fixed)if(x<r.x+r.w+6&&x+w+6>r.x&&y<r.y+r.h+6&&y+h+6>r.y)k+=10;return {k,c,x,y,w,h,el}})});
    let bp=null;const cur=[];
    const go=(n,acc)=>{if(bp&&acc>=bp.k)return;if(n===opts.length){bp={k:acc,pick:cur.slice()};return}
      for(const o of opts[n]){let bad=false;for(const r of cur)if(o.x<r.x+r.w+6&&o.x+o.w+6>r.x&&o.y<r.y+r.h+6&&o.y+o.h+6>r.y){bad=true;break}
        if(bad)continue;cur.push(o);go(n+1,acc+o.k);cur.pop()}};
    go(0,0);if(!bp)continue;cost+=bp.k;const pick=bp.pick;
    if(!best||cost<best.cost)best={cost,px,py,pick}}
  if(!best)return;
  if(!contain&&cfg.pos){const v=best.px+"% "+best.py+"%";img.style.objectPosition=v;box.querySelectorAll("[data-follow]").forEach(e=>e.style.objectPosition=v)}
  for(const {el,c} of best.pick){const st=el.style;st.left=st.right=st.top=st.bottom="auto";
    if(c[0]==="l")st.left=c[1]+"px";else if(c[0]==="r")st.right=c[1]+"px";else st.left=`calc(50% - ${el.offsetWidth/2}px + ${c[1]||0}px)`;
    if(c[2]==="t")st.top=c[3]+"px";else if(c[2]==="b")st.bottom=c[3]+"px";else st.top=`calc(50% - ${el.offsetHeight/2}px + ${c[3]||0}px)`}};
/* logo: trim transparent padding, size by area inside [maxW,maxH], then pick the stock that loses the fewest logo pixels:
   each pixel scores its shortfall from 4.5:1 on that stock, the lower total wins; ties stay on dark with a soft halo */
P.logo=img=>{
  const wrap=img.parentNode;
  try{const mx=(wrap.dataset.lmax||"300,110").split(",").map(Number),A=+wrap.dataset.larea||mx[0]*mx[1]*.5;
    const g=grab(img,Math.min(360,img.naturalWidth||360)),w=g.w,h=g.h,d=g.d;let x0=w,y0=h,x1=-1,y1=-1,dk=0,lt=0;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>28){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
      if(d[i+3]>128){const lin=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)},Y=.2126*lin(d[i])+.7152*lin(d[i+1])+.0722*lin(d[i+2]);dk+=Math.max(0,4.5-(Y+.05)/.058)/4.5;lt+=Math.max(0,4.5-.98/(Y+.05))/4.5}}
    if(x1>=0){const fw=(x1-x0+1)/w,fh=(y1-y0+1)/h,a=fw*img.naturalWidth/(fh*img.naturalHeight);
      let lh=Math.min(mx[1],Math.sqrt(A/a)),lw=lh*a;if(lw>mx[0]){lw=mx[0];lh=lw/a}
      const W=lw/fw,H=lh/fh;
      Object.assign(wrap.style,{position:"relative",overflow:"hidden",width:Math.round(lw)+"px",height:Math.round(lh)+"px",display:"block",flex:"none"});
      Object.assign(img.style,{position:"absolute",maxWidth:"none",maxHeight:"none",left:(-x0/w*W)+"px",top:(-y0/h*H)+"px",width:W+"px",height:H+"px",objectFit:"fill",display:"block"})}
    const p=img.closest("[data-lpanel]");
    if(p&&p.dataset.light&&p.dataset.dark){const light=dk>lt;p.style.background=light?p.dataset.light:p.dataset.dark;img.style.filter=light?"drop-shadow(0 0 1px rgba(0,0,0,.3))":"drop-shadow(0 0 1.5px rgba(255,255,255,.45))";
      p.querySelectorAll("[data-pk]").forEach(e=>{if(!e.dataset.ink0)e.dataset.ink0=e.style.color;e.style.color=light&&p.dataset.lightink?p.dataset.lightink:e.dataset.ink0})}
  }catch(e){}
  const box=img.closest("[data-safe]");if(box){const s=box.querySelector("[data-pick]");if(s&&s.dataset.done)P.place(s)}};
P.logoFail=img=>{const p=img.closest("[data-lpanel]");img.style.display="none";const wrap=img.parentNode;if(wrap&&wrap.dataset.lmax){wrap.style.width="auto";wrap.style.height="auto"}
  const t=p&&p.querySelector("[data-ltype]");if(t)t.style.display="";if(p&&p.dataset.type)p.style.background=p.dataset.type;
  const box=img.closest("[data-safe]");if(box){const s=box.querySelector("[data-pick]");if(s&&s.dataset.done)P.place(s)}};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>setTimeout(()=>document.querySelectorAll("img[data-pick]").forEach(i=>{if(i.dataset.done)P.place(i)}),60));
})();
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
  const hero=pos?"":(st[0]?ctx.img(st[0],"w1280"):""),second=st[1]?ctx.img(st[1],"w1280"):(st[0]?ctx.img(st[0],"w1280"):"");
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
  const photo=(src,l,t,w,h,op,o)=>{o=o||{};return `<div ${o.safe?`data-safe='${o.safe}'`:""} style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;overflow:hidden;background:#222;outline:1px solid ${acc};outline-offset:4px;border-radius:${E.border==="round"?"14px":E.border==="dots"?"8px":"0"}">
     ${src?`<img src="${src}" alt="" crossorigin="anonymous" data-pick data-alts="${(o.alts||[]).join("|")}" data-last="${pos||""}" onload="window.__PICK&&__PICK.still(this)" onerror="window.__PICK&&__PICK.fail(this)" style="position:absolute;left:0;top:0;display:block;width:100%;height:100%;object-fit:cover;object-position:${op};filter:${E.photo==="none"?"":E.photo} ${T.photo}">`:""}
     <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 60%,rgba(0,0,0,${(T.vig*.7).toFixed(2)}) 100%)${E.press==="gloss"?",linear-gradient(150deg,rgba(255,255,255,.22),transparent 45%)":""}"></div>${o.extra||""}
   </div>`};
  /* poster in a landscape slot: whole poster contained on a blurred, darkened copy of itself */
  const posterBand=(l,t,w,h)=>`<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;overflow:hidden;background:#222;outline:1px solid ${acc};outline-offset:4px;border-radius:${E.border==="round"?"14px":E.border==="dots"?"8px":"0"}">
     <img src="${pos}" alt="" crossorigin="anonymous" style="position:absolute;left:-24px;top:-24px;width:${w+48}px;height:${h+48}px;object-fit:cover;filter:blur(16px) brightness(.55)">
     <img src="${pos}" alt="" crossorigin="anonymous" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain"></div>`;
  const kick=(t,s)=>`<div style="font:700 ${s||".72em"}/1.25 ${bd};letter-spacing:.22em;text-transform:uppercase;color:${acc}">${x(t)}</div>`;
  const rule=`<div style="width:90px;height:2px;background:${acc};margin:.55em auto"></div>`;

  /* logo in its own colours on a panel that suits it */
  const lg=ctx.logo,lr=lg&&lg[1]&&lg[2]?lg[1]/lg[2]:0;let lh=lr?Math.min(120,Math.sqrt(26000/lr)):0,lw=lh*lr;if(lw>400){lw=400;lh=lw/lr}lw=Math.round(lw);lh=Math.round(lh);
  /* logo panel sits inside the photo, on whichever edge covers the least face */
  const logo=`<div data-sp="logo" data-lpanel data-dark="rgba(18,16,20,.88)" data-light="rgba(253,250,244,.94)" data-type="${dark}" style="position:absolute;left:${lr?Math.round((532-lw-40)/2):26}px;bottom:18px;padding:12px 20px;background:${lr?"rgba(18,16,20,.88)":dark};box-shadow:0 8px 20px rgba(0,0,0,.35);border-radius:${E.border==="round"?"14px":"2px"}">
     ${lr?`<span data-lmax="400,120" data-larea="26000" style="display:block;width:${lw}px;height:${lh}px"><img src="${ctx.img(lg[0],"w500")}" crossorigin="anonymous" alt="${x(f.title)}" onload="window.__PICK&&__PICK.logo(this)" onerror="this.parentNode.style.display='none';window.__MNS&&__MNS.logoFail(this)" style="display:block;width:${lw}px;height:${lh}px;object-fit:contain"></span>`:""}
     <div data-ltype data-fit="20" style="display:${lr?"none":"block"};width:440px;height:96px;overflow:hidden;text-align:center;font:${E.dw} 40px/1.08 ${dd};${up}color:#fff;font-size:40px">${x(f.title)}</div>
    </div>`;

  /* poster front: big whole 2:3 poster on the left in a frame that hugs it, logo panel and kicker in the slim column beside it */
  const PWID=372,PX=34,PY=34,PH=558,CX=PX+PWID+20,CW=566-CX;
  let plh=lr?Math.min(100,Math.sqrt(7000/lr)):0,plw=plh*lr;if(plw>CW-20){plw=CW-20;plh=plw/lr}plw=Math.round(plw);plh=Math.round(plh);
  const bdr=E.border==="round"?"14px":E.border==="dots"?"8px":"0";
  const posterFront=`<div style="position:absolute;left:${PX}px;top:${PY}px;width:${PWID}px;height:${PH}px;overflow:hidden;outline:1px solid ${acc};outline-offset:4px;border-radius:${bdr}">
     <img src="${pos}" alt="" crossorigin="anonymous" style="position:absolute;left:0;top:0;width:${PWID}px;height:${PH}px;object-fit:contain;display:block">
     <div style="position:absolute;inset:0;background:linear-gradient(150deg,rgba(255,255,255,${E.press==="gloss"?.2:0}),transparent 45%)"></div>
    </div>
    <div style="position:absolute;left:${CX}px;top:${PY}px;width:${CW}px;height:${PH}px;display:flex;flex-direction:column;gap:16px">
     <div data-lpanel data-lightink="#2a2a2a" data-dark="rgba(18,16,20,1)" data-light="rgba(253,250,244,1)" data-type="${dark}" style="box-sizing:border-box;width:${CW}px;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${lr?"rgba(18,16,20,1)":dark};border-radius:${E.border==="round"?"14px":"2px"}">
      ${lr?`<span data-lmax="${CW-20},100" data-larea="7000" style="display:block;width:${plw}px;height:${plh}px"><img src="${ctx.img(lg[0],"w500")}" crossorigin="anonymous" alt="${x(f.title)}" onload="window.__PICK&&__PICK.logo(this)" onerror="this.parentNode.style.display='none';window.__MNS&&__MNS.logoFail(this)" style="display:block;width:${plw}px;height:${plh}px;object-fit:contain"></span>`:""}
      <div data-ltype data-fit="14" style="display:${lr?"none":"block"};width:${CW-20}px;height:96px;overflow:hidden;text-align:center;font:${E.dw} 28px/1.08 ${dd};${up}color:#fff;font-size:28px">${x(f.title)}</div>
     </div>
     <div data-fit="14" style="flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;justify-content:center;text-align:center;font-size:17px;color:${ink};${press}">
      ${kick(T.k,".95em")}
      <div style="margin-top:.7em;font:700 .9em/1.2 ${bd};letter-spacing:.14em;text-transform:uppercase;color:${acc}">Now showing</div>
     </div>
    </div>`;
  const front=`${stock}${border}
   ${pos?posterFront:photo(hero,34,34,532,416,st[0]?"50% 40%":"50% 22%",{alts:st.slice(5,8).map(s=>ctx.img(s,"w1280")),extra:logo,
     safe:JSON.stringify({pos:[[50,40],[50,22],[50,60],[30,40],[70,40]],items:[{q:"[data-sp=logo]",c:[["c",0,"b",18],["c",0,"t",18],["l",18,"b",18],["r",18,"b",18],["l",18,"t",18],["r",18,"t",18]]}]})})}
   <div data-fit="14" style="position:absolute;left:44px;top:${pos?606:472}px;width:512px;height:${pos?112:236}px;overflow:hidden;display:flex;flex-direction:column;justify-content:center;text-align:center;font-size:${pos?19:21}px;color:${ink};${press}">
     ${pos?"":kick(T.k,".82em")}
     <div style="margin-top:.35em;font:italic 1em/1.35 ${bd}">${x(T.lead)}</div>
     <div style="margin-top:.2em;font:${E.dw} 2.05em/1.05 ${dd};${up}letter-spacing:${E.ls};color:${ink}">${x(venue)}</div>
     <div style="margin-top:.35em;font:700 max(14px,.9em)/1.3 ${bd};letter-spacing:.12em;text-transform:uppercase;color:${acc}">${x(sign)}</div>
     ${f.T?`<div style="margin-top:.45em;font:italic 1em/1.35 ${bd}">${x(f.T)}</div>`:""}
   </div>
   <div style="position:absolute;left:58px;right:58px;top:${pos?728:720}px;height:${pos?144:150}px;box-sizing:border-box;padding:${pos?"8px 18px 4px":"12px 18px 6px"};border-top:1px solid ${acc};border-bottom:1px solid ${acc};text-align:center;color:${ink}">
     <div data-fit="14" style="height:${pos?76:78}px;overflow:hidden;font:italic 19px/1.35 ${bd};font-size:19px">${x(nt.text)}</div>
     <div style="font:38px/1.1 ${SIG};color:${acc};white-space:nowrap;overflow:hidden">${x(nt.by)}</div>
   </div>`;

  const course=c=>`<div style="margin-bottom:.5em">${kick(LABEL[c.k],".7em")}
     ${c.items.map((it,i)=>`<div data-item${i?"":" data-keep"} style="margin-top:.2em"><div style="font:${E.dw} 1em/1.15 ${dd};${up}letter-spacing:${E.up?".03em":"0"};color:${ink}">${x(it.n)}</div>${it.note?`<div data-opt style="font:italic .78em/1.3 ${bd};color:${ink};opacity:.85">${x(it.note)}</div>`:""}</div>`).join("")}</div>`;
  const back=`${stock}${border}
   ${second?photo(second,24,24,552,246,"50% 40%",{alts:st.slice(2,5).map(s=>ctx.img(s,"w1280"))}):pos?posterBand(24,24,552,246):""}
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
