/* shared picture helper (same block in placemat, stadium, prom, kiosk, invite; first file to load wins).
   still: a still that is mostly blank white or near black is swapped for the next candidate, the least bad one is kept,
          a dark keeper gets lifted; a failed still falls through to the next one, then the poster.
   logo: transparent padding is trimmed and the logo is sized by area into its max box, so the panel wraps the logo.
   place: props and logo panels on a photo go to the candidate spot that covers the least face and detail
          (skin tone weighted edges), and the crop can slide to give faces room. */
(function(){
const CPI=[[1880,.07],[1900,.065],[1915,.08],[1920,.15],[1930,.13],[1940,.11],[1950,.19],[1960,.23],[1970,.30],[1980,.63],[1990,1],[2000,1.32],[2010,1.68],[2020,1.98],[2025,2.4]];
function cpi(y){y=+y||1990;if(y<=CPI[0][0])return CPI[0][1];for(let i=1;i<CPI.length;i++){const [a,va]=CPI[i-1],[b,vb]=CPI[i];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return CPI[CPI.length-1][1]}
function periodPrice(base1990,year,seed){const x=base1990*cpi(year)*(0.88+((seed>>>3)%25)/100);
  if(x<1)return String(Math.max(5,Math.round(x*20)*5))+"¢";
  const ends=x<10?[".95",".50",".25",".75"]:[".95",".50",".00"];const w=Math.floor(x);return w+ends[seed%ends.length]}
const strSeed=s=>[...String(s)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
window.cpi=window.cpi||cpi;window.periodPrice=window.periodPrice||periodPrice;window.strSeed=window.strSeed||strSeed;

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
/* Format: kiosk. A beach or surf kiosk board, one landscape face 1344x960.
   Left: the beach photo (hero still) with the film logo on a panel, a pinned note with a script signature and a hire tag.
   Right: the kiosk board with the venue sign, big board prices and the showtime cue. Bottom: a surf report strip.
   Era sets the board material (painted timber, pastel plank, varnished woodie, sun faded, neon laminate, corflute, vinyl, birch ply),
   type pairing and photo treatment. Tone sets sun bleach and wear, tilt, photo mood and the copy voice.
   Fonts (fmt-kiosk in wip/print/FONTS.md): Rokkitt, Paytone One, Fugaz One, Modak, Goldman, Dela Gothic One, Changa One, Space Grotesk.
   Bodies Libre Franklin, Karla, Josefin Sans, Cabin, Barlow, Archivo, Work Sans; signature Nothing You Could Do. */
(function(){
const W=1344,H=960,ID="kiosk";
if(!document.getElementById("fmt-kiosk-fonts")){
  const l=document.createElement("link");l.id="fmt-kiosk-fonts";l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Rokkitt:wght@800&family=Paytone+One&family=Fugaz+One&family=Modak&family=Goldman:wght@700&family=Dela+Gothic+One&family=Changa+One&family=Space+Grotesk:wght@700&family=Libre+Franklin:ital,wght@0,500;0,800;1,500&family=Karla:ital,wght@0,500;0,800;1,500&family=Josefin+Sans:ital,wght@0,500;0,700;1,500&family=Cabin:ital,wght@0,500;0,700;1,500&family=Barlow:ital,wght@0,500;0,800;1,500&family=Archivo:ital,wght@0,500;0,800;1,500&family=Work+Sans:ital,wght@0,500;0,800;1,500&family=Nothing+You+Could+Do&display=swap";
  /* warm every face as soon as the sheet lands, so menu fitting measures with real metrics */
  l.onload=()=>{try{["Rokkitt", "Paytone One", "Fugaz One", "Modak", "Goldman", "Dela Gothic One", "Changa One", "Space Grotesk", "Libre Franklin", "Karla", "Josefin Sans", "Cabin", "Barlow", "Archivo", "Work Sans", "Nothing You Could Do"].forEach(f=>{document.fonts.load(`800 20px "${f}"`);document.fonts.load(`500 20px "${f}"`);document.fonts.load(`italic 500 20px "${f}"`)})}catch(e){}};
  document.head.appendChild(l);
}
/* ---------- text safety ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[‒-―−]\s*/g,", ").replace(/(\w)-(?=\w)/g,"$1 ").replace(/\s+-+\s+/g,", ").replace(/\s+/g," ").trim();
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"']$/.test(s)?s:s+"."};
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
const DRY=[[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beers?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|schnapps)\b/gi,"syrup"]];
const dry=s=>DRY.reduce((a,[r,t])=>a.replace(r,t),s);
const trunc=(s,n)=>{s=clean(s);if(s.length<=n)return s;const c=s.slice(0,n);const i=c.lastIndexOf(" ");return (i>n*.5?c.slice(0,i):c).replace(/[,;:]$/,"")};
/* notes that do not fit are cut back to their first clause, or left off; never cut mid thought */
const clip=(s,n)=>{s=clean(s);if(s.length<=n)return s;const p=s.split(/(?<=[.!?;])\s/)[0].replace(/[.;]$/,"").trim();return p.length<=n&&p.length>=12?p:""};
/* real layout height of a block at a given width, measured off screen; null when there is no document */
const domH=(html,w)=>{try{const b=document.body;if(!b)return null;const d=document.createElement("div");d.style.cssText=`position:absolute;left:-12000px;top:0;width:${w}px;visibility:hidden;display:flow-root`;d.innerHTML=html;b.appendChild(d);const h=d.getBoundingClientRect().height;b.removeChild(d);return h}catch(e){return null}};

/* ---------- colour ---------- */
const rgb=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const hx=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=lum(rgb(a)),y=lum(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>hx(rgb(a).map((v,i)=>v+(rgb(b)[i]-v)*t));
const sat=a=>{const c=rgb(a),mx=Math.max(...c),mn=Math.min(...c);return mx?(mx-mn)/mx:0};
const fit=(c,bg,fb,min)=>{if(!rgb(c))c=fb;const to=lum(rgb(bg))>.35?"#000000":"#ffffff";let x=c;for(let i=0;i<10&&cr(x,bg)<min;i++)x=mix(x,to,.15);return cr(x,bg)>=min?x:fb};
const rgba=(h,a)=>{const c=rgb(h)||[0,0,0];return `rgba(${c[0]},${c[1]},${c[2]},${a})`};

/* ---------- measuring (estimates; every width is padded) ---------- */
const lines=(s,size,w,cw)=>{const words=clean(s).split(" ");let n=1,x=0;const sp=size*cw;for(const wd of words){const ww=wd.length*sp;if(x&&x+sp+ww>w){n++;x=ww}else x+=(x?sp:0)+ww}return n};
const fitType=(s,w,h,cw,max,min,lh=1.08,maxL=3)=>{for(let z=max;z>=min;z-=1){const n=lines(s,z,w,cw);if(n<=maxL&&n*z*lh<=h)return {z,n}}return {z:min,n:lines(s,min,w,cw)}};

/* grain: real noise texture (svg turbulence), fine fibre plus sparse speckle */
const grain=(a,light,freq,sparse)=>{const c=light?"1 ":"0.22 ",k=sparse?(9*a).toFixed(3):(1.4*a).toFixed(3),o=sparse?(-5.6*a).toFixed(3):(-.35*a).toFixed(3);
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${sparse?7:3}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} ${k} 0 0 0 ${o}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url(&quot;data:image/svg+xml,${encodeURIComponent(svg)}&quot;)`};
/* a real photo (still or poster); posters sit contained over a blurred copy of themselves */
function photo(src,w,h,o){
  o=o||{};const f=o.filter||"none";
  if(!src)return `<div style="width:${w}px;height:${h}px;background:linear-gradient(160deg,#333,#111)"></div>`;
  const inner=o.poster
    ?`<img src="${src}" alt="" style="position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(14px) brightness(.55) ${f}">
      <img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:${f}">`
    :`<img src="${src}" alt="" crossorigin="anonymous" data-pick data-alts="${(o.alts||[]).join("|")}" data-last="${o.last||""}" onload="window.__PICK&&__PICK.still(this)" onerror="window.__PICK&&__PICK.fail(this)" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${o.pos||"50% 40%"};filter:${f}">`;
  const dots=o.halftone?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.5) 28%,transparent 32%) 0 0/3px 3px;mix-blend-mode:multiply;opacity:.14"></div>`:"";
  return `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;border-radius:${o.radius||0}px;background:#111">${inner}${dots}<div style="position:absolute;inset:0;box-shadow:inset 0 0 ${o.vig||30}px rgba(0,0,0,.25)"></div></div>`;
}


/* ---------- era: board material, type pairing, photo ---------- */
const ERA={
 "1930s-40s":{disp:"Rokkitt",dw:"800 ",dcw:.6,body:"Libre Franklin",bcw:.55,board:"#ece5d3",plank:"wood",ink:"#1d2a33",strip:"#1d2a33",photo:"sepia(.3) contrast(1.04)",radius:0,kick:"BATHING PAVILION KIOSK",rep:"Beach conditions"},
 "1950s":{disp:"Paytone One",dw:"",dcw:.6,body:"Karla",bcw:.52,board:"#bfe3d8",plank:"wood",ink:"#183a3a",strip:"#e85d4a",photo:"sepia(.1) saturate(1.05)",radius:10,kick:"SNACK SHACK",rep:"Surf conditions"},
 "1960s":{disp:"Fugaz One",dw:"",dcw:.6,body:"Josefin Sans",bcw:.52,board:"#8a5a32",plank:"varnish",ink:"#fbf1dc",strip:"#173f5a",photo:"saturate(1.15) contrast(1.03)",radius:6,kick:"SURF SHACK",rep:"Surf report"},
 "1970s":{disp:"Modak",dw:"",dcw:.62,body:"Cabin",bcw:.52,board:"#e9a24c",plank:"faded",ink:"#3b1d0c",strip:"#6b2f12",photo:"sepia(.22) saturate(1.12) contrast(.97)",radius:22,kick:"BEACH KIOSK",rep:"Surf report"},
 "1980s":{disp:"Goldman",dw:"700 ",dcw:.64,body:"Barlow",bcw:.52,board:"#141820",plank:"laminate",ink:"#f2fbff",strip:"#0d0f14",photo:"contrast(1.08) saturate(1.25)",radius:0,kick:"BEACH BAR AND GRILL",rep:"Surf report"},
 "1990s":{disp:"Dela Gothic One",dw:"",dcw:.78,body:"Archivo",bcw:.55,board:"#fbfbf6",plank:"corflute",ink:"#13171c",strip:"#0a4f9e",photo:"contrast(1.05) saturate(1.1)",radius:0,kick:"KIOSK",rep:"Surf report"},
 "2000s":{disp:"Changa One",dw:"",dcw:.58,body:"Barlow",bcw:.52,board:"#fff6df",plank:"vinyl",ink:"#1a1a1a",strip:"#e4572e",photo:"contrast(1.06) saturate(1.12)",radius:12,kick:"BEACH KIOSK",rep:"Surf report"},
 "modern":{disp:"Space Grotesk",dw:"700 ",dcw:.6,body:"Work Sans",bcw:.55,board:"#e8d7b8",plank:"ply",ink:"#141414",strip:"#141414",photo:"saturate(1.05)",radius:16,kick:"KIOSK",rep:"Surf report"}
};
const TONE={
 gritty:{wear:.8,bleach:.1,tilt:-2,photo:"contrast(1.14) saturate(.88)",kick:"No shirt, no service",cond:"Rips running, swim between the flags",close:"Cash only. No change for the phone."},
 glossy:{wear:.08,bleach:0,tilt:0,photo:"saturate(1.12) brightness(1.03)",kick:"Beachfront dining",cond:"Glassy and clean all morning",close:"Umbrellas and loungers from the front desk."},
 warm:{wear:.35,bleach:.08,tilt:-1.5,photo:"sepia(.08) saturate(1.06)",kick:"Fresh every morning",cond:"Small and clean, perfect for learners",close:"Thanks for keeping the beach clean."},
 eerie:{wear:.5,bleach:.04,tilt:1.5,photo:"saturate(.8) contrast(1.1)",kick:"Closed after dark",cond:"Murky water, low visibility",close:"Lifeguard off duty from five."},
 playful:{wear:.25,bleach:.06,tilt:-3,photo:"saturate(1.22) brightness(1.04)",kick:"Sandy feet welcome",cond:"Fun waves, bring the boogie board",close:"Spot prize for the best sandcastle."},
 grand:{wear:.12,bleach:0,tilt:0,photo:"contrast(1.06)",kick:"The finest on the coast",cond:"Long clean lines on the point",close:"Service to your deckchair on request."},
 tender:{wear:.3,bleach:.1,tilt:-1,photo:"brightness(1.05) saturate(.95)",kick:"See you at sunset",cond:"Gentle swell easing towards evening",close:"Open until the sun goes down."},
 tense:{wear:.45,bleach:.04,tilt:1,photo:"contrast(1.16)",kick:"Beach closed? Kiosk open",cond:"Sighting reported, stay inside the flags",close:"Listen for the siren."},
 scrappy:{wear:.9,bleach:.14,tilt:-3.5,photo:"contrast(1.1)",kick:"Honesty box if we're out",cond:"Messy onshore slop, paddle out anyway",close:"Back in five. Maybe ten."}
};
/* the same kiosk away from the water (a backyard, a town square, a tournament): no surf, swell or lifeguard */
const LAND={
 gritty:{kick:"No shirt, no service",cond:"Hot and dusty, water on the counter",close:"Cash only. No change for the phone."},
 glossy:{kick:"Fresh and fast",cond:"Fine and clear all day",close:"Table service on request."},
 warm:{kick:"Fresh every morning",cond:"Fine, light breeze, a good day for it",close:"Thanks for coming by."},
 eerie:{kick:"Closed after dark",cond:"Fog rolling in, keep to the path",close:"Shutters down at dusk."},
 playful:{kick:"Sticky fingers welcome",cond:"Sunny with a chance of fun",close:"Spot prize for the loudest cheer."},
 grand:{kick:"The finest in town",cond:"Clear skies, a fine evening ahead",close:"Service to your table on request."},
 tender:{kick:"See you at sunset",cond:"Warm, easing to a mild evening",close:"Open until the sun goes down."},
 tense:{kick:"Stay close to the counter",cond:"Stay indoors if you can",close:"Listen for the siren."},
 scrappy:{kick:"Honesty box if we're out",cond:"Patchy, bring a jacket",close:"Back in five. Maybe ten."}
};
const BEACH_RE=/\b(beach|surf|boardwalk|reef|lighthouse|coast|ocean|shore|dock|pier|island|lagoon|bay|harbou?r|sea|marine|coorong|amity)\b/i;
const SEC={s:"Snacks",m:"Hot Food",w:"Ices and Sweets",d:"Cold Drinks"};

/* board material: planks, varnish, laminate, corflute or ply; texture from gradients plus noise grain */
function boardBg(E,T){
  const dk=lum(rgb(E.board))<.25,w=T.wear;
  const L=[];
  if(T.bleach)L.push(`linear-gradient(200deg,rgba(255,255,255,${T.bleach*1.6}),transparent 55%)`);
  L.push(`radial-gradient(ellipse at 50% 40%,transparent 50%,rgba(0,0,0,${(dk?.3:.12)+.22*w}) 100%)`,grain(.1+.14*w,dk,.8,false),grain(.12+.18*w,dk,.5,true));
  if(E.plank==="wood"||E.plank==="faded"||E.plank==="varnish"){
    L.push(`repeating-linear-gradient(180deg,transparent 0 118px,rgba(0,0,0,${E.plank==="varnish"?.35:.16}) 118px 121px,rgba(255,255,255,.12) 121px 123px)`,
      `repeating-linear-gradient(178.6deg,rgba(0,0,0,.035) 0 2px,transparent 2px 9px,rgba(255,255,255,.03) 9px 11px,transparent 11px 23px)`);
    if(E.plank==="varnish")L.push(`linear-gradient(160deg,rgba(255,220,160,.18),transparent 40%,rgba(0,0,0,.18))`);
  }
  if(E.plank==="laminate")L.push(`linear-gradient(125deg,rgba(255,255,255,.1),transparent 30%,rgba(255,255,255,.04) 60%,transparent)`);
  if(E.plank==="corflute")L.push(`repeating-linear-gradient(90deg,rgba(0,0,0,.035) 0 1px,transparent 1px 7px)`);
  if(E.plank==="vinyl")L.push(`linear-gradient(180deg,rgba(255,255,255,.2),transparent 20%,rgba(0,0,0,.05))`);
  if(E.plank==="ply")L.push(`repeating-linear-gradient(176deg,rgba(120,80,30,.05) 0 3px,transparent 3px 14px,rgba(120,80,30,.04) 14px 16px,transparent 16px 31px)`);
  return L.join(",")+`,${E.board}`;
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),C=s=>fam?dry(clean(s)):clean(s);
  const year=String(f.year||"").slice(0,4)||"1999",yy=year.slice(-2);
  const fl=ctx.flavour||{};
  /* beach kit only where the film has a beach: flavour beach true or false decides, otherwise the venue and sign do */
  const beach=typeof fl.beach==="boolean"?fl.beach:BEACH_RE.test(String(fl.venue||"")+" "+String(fl.sign||""));
  const TK=beach?T:Object.assign({},T,LAND[ctx.tone]||LAND.warm);
  const KICK=beach?E.kick:E.kick==="SURF SHACK"?"SNACK SHACK":E.kick.replace(/^(BATHING PAVILION|BEACH) /,"");
  const title=clean(f.title||"Tonight's Feature");
  const venue=C(fl.venue)||(beach?"The Beach Kiosk":"The Kiosk");
  const sign=C(fl.sign)||venue;
  const note={text:C(fl.note&&fl.note.text)||sentence(f.T)||(beach?"Grab a bite, grab a towel and get down to the water.":"Grab a bite and pull up a seat."),by:C(fl.note&&fl.note.by)||"The Kiosk"};
  const winks=(fl.winks||[]).map(C).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?{title:C(fl.prop.title),lines:(fl.prop.lines||[]).map(C).filter(Boolean).slice(0,2)}:beach?{title:"Board Hire",lines:["One hour, wax included","Back by sunset"]}:{title:"Lost Property",lines:["Ask at the counter","Claim it by closing"]};
  const num=String(fl.number||"").replace(/\D/g,"")||year,realNum=String(fl.number||"").replace(/\D/g,"");
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id])||null;
  const img=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");
  const stills=ctx.stills||[];
  const PM=!!poster; /* poster mode: the whole poster is the hero, the first still is only the fallback */
  const hero=PM?{src:img(poster,"w780"),poster:true}:{src:img(stills[0],"w1280"),poster:false};

  const P=ctx.palette||{},dkB=lum(rgb(E.board))<.25;
  const ink=E.ink,soft=rgba(ink,.74);
  let acc=rgb(P.accent)&&sat(P.accent)>.18?P.accent:E.strip;
  const ACC=fit(acc,E.board,ink,3.4);
  const DARK=rgb(P.dark)&&lum(rgb(P.dark))<.06?P.dark:"#121417";
  const stripBg=fit(rgb(P.dark)&&lum(rgb(P.dark))<.06&&E.plank!=="laminate"?mix(E.strip,P.dark,.35):E.strip,"#ffffff",E.strip,5);
  const disp=`'${E.disp}',sans-serif`,body=`'${E.body}',sans-serif`,sig=`'Nothing You Could Do',cursive`;
  const caps=(z,c,ls=.16)=>`font:800 ${z}px/1.2 ${body};letter-spacing:${ls}em;text-transform:uppercase;color:${c}`;
  const glow=E.plank==="laminate"?`text-shadow:0 0 14px ${rgba(ACC,.6)}`:"";
  const photoF=`${E.photo} ${T.photo}`;

  /* ===== surf report strip ===== */
  const SH=84,PH=H-SH,PW=PM?593:740;
  const swell=(+num%5)+2,water=(+yy%7)+17,tideH=(+yy%12)||12;
  const cells=beach?[[E.rep,""],["Swell",`${swell} ft`],["Wind",["offshore","light offshore","cross shore","onshore"][+num%4]],["Water",`${water} C`],["High tide",`${tideH}:${String(+yy%60).padStart(2,"0")}`]]
    :[["Out front",""],["Sky",ctx.tone==="eerie"?"Fog":["Fine","Clear","Cloudy","Overcast"][+num%4]],["Wind",["still","light breeze","gusty","fresh"][+num%4]],["Temp",`${water+4} C`],["Last orders",`${(+yy%3)+8}:${["00","15","30","45"][+num%4]}`]];
  const cw=c=>c[1]?Math.max(c[0].length*15*.78,c[1].length*20*(E.bcw+.06))+36:c[0].length*24*(E.dcw+.04)+36;
  const room=W-48-cells.reduce((a,c)=>a+cw(c),0)-4;
  const tail=[[beach?"Conditions":"Forecast",TK.cond]];if(winks[0]&&room>=560)tail.push(["Spotted",trunc(winks[0],44)]);
  const tailW=tail.length===2?[room*.5,room*.5]:[room];
  const tailZ=tail.map((c,i)=>fitType(c[1],tailW[i]-40,46,E.bcw+.06,20,15,1.15,2));
  const NT=cells.length;cells.push(...tail);
  const stripHtml=`<div style="position:absolute;left:0;top:${PH}px;width:${W}px;height:${SH}px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18)),${grain(.12,true,.9,false)},${stripBg};display:flex;align-items:center;gap:0;padding:0 24px;box-sizing:border-box;color:#ffffff">
      ${cells.map((c,i)=>`<div style="padding:0 17px;${i?`border-left:1px solid rgba(255,255,255,.3)`:""};${i>=NT?`flex:none;width:${Math.floor(tailW[i-NT])}px;box-sizing:border-box`:"flex:none"}">
        ${i===0?`<div style="font:${E.dw}24px/1.05 ${disp};color:#ffffff;white-space:nowrap">${esc(c[0])}</div>`:
        `<div style="${caps(15,"rgba(255,255,255,.78)",.16)};white-space:nowrap">${esc(c[0])}</div><div style="font:800 ${i>=NT?tailZ[i-NT].z:20}px/1.15 ${body};color:#ffffff;${i>=NT?"":"white-space:nowrap"}">${esc(c[1])}</div>`}</div>`).join("")}</div>`;

  /* ===== beach photo ===== */
  let logoHtml,logoH;const LG=ctx.logo;
  if(LG&&LG[0]&&LG[1]&&LG[2]){
    const a=LG[1]/LG[2];const LA=PM?20000:30000,LX=PM?260:400;let lh=Math.min(140,Math.sqrt(LA/a)),lw=lh*a;if(lw>LX){lw=LX;lh=lw/a}logoH=lh+32;
    const tT=fitType(title,PM?260:360,170,E.dcw,52,24,1.05,3);
    logoHtml=`<div data-lpanel data-dark="${rgba(DARK,.82)}" data-light="rgba(252,250,244,.94)" data-type="${rgba(DARK,.82)}" style="display:inline-block;padding:16px 20px;background:${rgba(DARK,.82)};border-radius:${Math.min(E.radius,12)}px;box-shadow:0 4px 16px rgba(0,0,0,.35)"><span data-lmax="${LX},140" data-larea="${LA}" style="display:block;width:${Math.round(lw)}px;height:${Math.round(lh)}px"><img src="${img(LG[0],"w500")}" crossorigin="anonymous" alt="${esc(title)}" onload="window.__PICK&&__PICK.logo(this)" onerror="window.__PICK&&__PICK.logoFail(this)" style="display:block;width:${Math.round(lw)}px;height:${Math.round(lh)}px;object-fit:contain;filter:drop-shadow(0 0 1.5px rgba(255,255,255,.55))"></span><div data-ltype style="display:none;width:${PM?260:360}px;font:${E.dw}${tT.z}px/1.05 ${disp};color:#ffffff">${esc(title)}</div></div>`;
  }else{
    const tT=fitType(title,PM?260:360,170,E.dcw,PM?44:58,24,1.05,4);logoH=tT.n*tT.z*1.05+32;
    logoHtml=`<div style="width:${PM?300:360}px;box-sizing:border-box;padding:16px 20px;background:${rgba(DARK,.82)};border-radius:${Math.min(E.radius,12)}px;font:${E.dw}${tT.z}px/1.05 ${disp};color:#ffffff">${esc(title)}</div>`;
  }
  /* pinned note card and a hire tag on the photo's lower edge */
  const nw=PM?252:360,nT=fitType(note.text,nw-44,PM?330:140,.5,PM?20:21,16,1.35,PM?12:6);
  const nh=Math.round(30+20+nT.n*nT.z*1.35+56+26);
  const noteHtml=`<div data-sp="note" style="position:absolute;left:${PM?466:28}px;bottom:26px;width:${nw}px;height:${nh}px;box-sizing:border-box;padding:18px 22px;transform:rotate(${(T.tilt*.6).toFixed(2)}deg);background:linear-gradient(170deg,#fffdf6,#f3ecdb),#fffaf0;box-shadow:0 6px 18px rgba(0,0,0,.35);color:#1d1a16">
      <div style="${caps(15,fit(ACC,"#fbf6ea","#5b3a1a",3.4),.18)};margin-bottom:8px">${esc(TK.kick)}</div>
      <div style="font:italic 500 ${nT.z}px/1.35 ${body};color:#1d1a16">"${esc(note.text)}"</div>
      <div style="font:36px/1.2 ${sig};color:${fit(ACC,"#fbf6ea","#1d3a6a",3.4)};text-align:right;margin-top:4px">${esc(trunc(note.by,24))}</div></div>`;
  /* poster mode: the note is a compact pinned card on the board, the hire tag is dropped */
  const nwP=316,noteTxt=clip(note.text,150)||note.text;
  const nTp=fitType(noteTxt,nwP-44,100,.5,18,16,1.35,5);
  const noteH=Math.round(14+22+nTp.n*nTp.z*1.35+42+14);
  const notePM=`<div data-sp="note" style="flex:none;width:${nwP}px;height:${noteH}px;box-sizing:border-box;padding:14px 22px;transform:rotate(${(T.tilt*.5).toFixed(2)}deg);background:linear-gradient(170deg,#fffdf6,#f3ecdb),#fffaf0;box-shadow:0 6px 18px rgba(0,0,0,.35);color:#1d1a16">
      <div style="${caps(15,fit(ACC,"#fbf6ea","#5b3a1a",3.4),.18)};margin-bottom:6px">${esc(TK.kick)}</div>
      <div style="font:italic 500 ${nTp.z}px/1.35 ${body};color:#1d1a16">"${esc(noteTxt)}"</div>
      <div style="font:32px/1.3 ${sig};color:${fit(ACC,"#fbf6ea","#1d3a6a",3.4)};text-align:right">${esc(trunc(note.by,24))}</div></div>`;
  const tw=250,th=150,pT=fitType(prop.title,tw-40,56,.6,26,17,1.05,2);
  const tagHtml=`<div data-sp="tag" style="position:absolute;left:${PM?30:nw+52}px;bottom:${PM?34:40}px;width:${tw}px;height:${th}px;transform:rotate(${(-T.tilt*.9+2).toFixed(2)}deg);background:linear-gradient(160deg,rgba(255,255,255,.4),transparent 60%),${mix("#fff4d8",ACC,.18)};border-radius:10px 10px 10px 10px;box-shadow:0 5px 14px rgba(0,0,0,.35);padding:14px 18px 12px 34px;box-sizing:border-box;color:#221c14;overflow:hidden">
      <div style="position:absolute;left:10px;top:${th/2-8}px;width:14px;height:14px;border-radius:50%;background:${rgba("#000",.55)};box-shadow:inset 0 1px 2px rgba(0,0,0,.6)"></div>
      <div style="${caps(15,"#4a3a28",.16)}">Tag No. ${esc(num)}</div>
      <div style="font:${E.dw}${pT.z}px/1.05 ${disp};color:#1b1712;margin:4px 0 4px">${esc(prop.title)}</div>
      ${prop.lines.map(l=>`<div style="font:500 16px/1.25 ${body};color:#3a2f22">${esc(trunc(l,30))}</div>`).join("")}</div>`;
  const capHtml=`<div style="display:inline-block;margin-top:12px;max-width:${PM?300:PW-80}px;background:${rgba(DARK,.78)};padding:6px 12px;${caps(15,"#ffffff",.16)}">${PM?"Now showing, "+esc(year):esc(trunc(venue,34))+", out the front"}</div>`;

  /* beach photo with everything that sits on it; the logo, note and tag go where they cover the least face, the crop slides to suit */
  const safe=JSON.stringify({pos:[[50,40],[30,40],[70,40],[10,40],[90,40],[50,22]],items:[
    {q:"[data-sp=logo]",c:[["l",28,"t",28],["r",28,"t",28]]},
    {q:"[data-sp=note]",w:1.2,c:[["l",28,"b",26],["r",28,"b",26],["r",28,"t",28],["l",28,"t",28]]},
    {q:"[data-sp=tag]",c:[["l",nw+52,"b",40],["r",nw+52,"b",40],["l",40,"b",nh+46],["r",40,"b",nh+46],["r",36,"t",40],["l",36,"t",40],["r",36,"c",0],["l",36,"c",0]]}]});
  const posterPanel=`${grain(.1,dkB,.8,false)},linear-gradient(180deg,rgba(255,255,255,.05),rgba(0,0,0,.2)),${mix(E.board,dkB?"#ffffff":"#000000",dkB?.06:.3)}`;
  const photoHtml=PM?`<div style="position:absolute;left:0;top:0;width:${PW}px;height:${PH}px;overflow:hidden;background:${posterPanel};box-shadow:inset -6px 0 14px rgba(0,0,0,.2)">
    <div style="position:absolute;left:8px;top:8px;width:577px;height:860px;box-sizing:border-box;border:6px solid #fbf8f0;background:#fbf8f0;box-shadow:0 8px 22px rgba(0,0,0,.45);transform:rotate(${(T.tilt*.12).toFixed(2)}deg)"><img src="${hero.src}" crossorigin="anonymous" alt="" style="display:block;width:100%;height:100%;object-fit:contain"></div></div>`
    :`<div data-safe='${safe}' style="position:absolute;left:0;top:0;width:${PW}px;height:${PH}px;overflow:hidden">${photo(hero.src,PW,PH,{filter:photoF,poster:hero.poster,pos:"50% 40%",vig:60,alts:stills.slice(5,8).map(s=>img(s,"w1280")),last:poster?img(poster,"w780"):""})}
    ${T.bleach?`<div style="position:absolute;inset:0;background:linear-gradient(200deg,rgba(255,250,235,${T.bleach*1.4}),transparent 60%)"></div>`:""}
    <div data-sp="logo" style="position:absolute;left:28px;top:28px;max-width:${PW-56}px">${logoHtml}<br>${capHtml}</div>${noteHtml}${tagHtml}</div>`;

  /* ===== the board ===== */
  const BX=PW,BW=W-PW,pad=34,IW=BW-pad*2;
  const leftW=PM?IW-320:IW,sT=fitType(sign,leftW,128,E.dcw,PM?56:64,30,1.0,2);
  const kickN=PM?lines(KICK+", since "+year,17,leftW,.8):1;
  const hdrL=`<div style="${caps(17,ACC,.2)}">${esc(KICK)}, since ${esc(year)}</div>
     <div style="font:${E.dw}${sT.z}px/1.0 ${disp};color:${ink};margin-top:8px;${glow}">${esc(sign)}</div>`;
  const hdr=PM?`<div style="display:flex;align-items:flex-start;gap:20px"><div style="flex:1;min-width:0">${hdrL}</div><div style="flex:none">${logoHtml}<br>${capHtml}</div></div>`:hdrL;
  const hdrH=PM?Math.max(kickN*21+8+sT.n*sT.z*1.0+16,logoH+54):22+8+sT.n*sT.z*1.0+16;
  const cue=sentence(C(f.P));
  const cueW=PM?IW-316-28:IW;
  const cT=fitType(cue,cueW-24,PM?150:80,E.bcw,19,15,1.3,PM?8:4);
  const fine=`${TK.close} Prices subject to change. Kiosk licence ${num}.`;
  const fT=fitType(fine,IW,44,.52,15,14,1.3,3);
  const cueH=cue?16+18+6+cT.n*cT.z*1.3+14:0,footTail=fT.n*fT.z*1.3+8,footH=(PM?Math.max(cueH,noteH+12):cueH)+footTail;
  let MH=PH-pad-hdrH-14-footH-pad;
  /* menu courses, priced like a kiosk board */
  const m=ctx.menu||{};
  const numPrice=(!String(fl.number||"").replace(/\D/g,"")||/^(18|19|20)\d\d$/.test(num))?null:num.length>=3&&num.length<=4?`${+num.slice(0,-2)}.${num.slice(-2)}`:num.length<=2?`${+num}.00`:null;
  let courses=["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(i=>i&&i.n).slice(0,4).map((it,j)=>({n:C(it.n),note:C(it.note),p:(k==="m"&&j===0&&numPrice)?numPrice:periodPrice([3.5,7.5,2.75,1.75][["s","m","w","d"].indexOf(k)]*(1+j*.12),f.year,strSeed(it.n))}))})).filter(c=>c.items.length);
  const total=courses.reduce((a,c)=>a+c.items.length,0);
  const cols=total>8&&courses.length>1?2:1,GAP=26;
  const colW=cols===2?(IW-GAP)/2:IW;
  let splits=cols===2?courses.slice(1).map((_,i)=>[courses.slice(0,i+1),courses.slice(i+1)]):[[courses]];
  let colsArr=splits[0];
  const dcw=E.bcw+.05;
  const secStyle={wood:`border-bottom:3px solid ${ACC}`,varnish:`border-bottom:2px solid ${rgba(ink,.6)}`,faded:`background:${rgba(ACC,.92)};color:${E.board};padding:2px 12px;border-radius:30px;display:inline-block`,laminate:`color:${ACC};${glow}`,corflute:`background:${ink};color:${E.board};padding:2px 10px;display:inline-block`,vinyl:`background:${ACC};color:#fff;padding:2px 12px;border-radius:8px;display:inline-block`,ply:`border-bottom:2px solid ${ink}`}[E.plank];
  const secC={faded:fit(E.board,ACC,"#ffffff",3),corflute:E.board,vinyl:"#ffffff"}[E.plank]||ink;
  const colHtml=(cs,FS)=>cs.map((c,i)=>`<div style="margin-top:${i?FS.G+6:0}px">
      <div style="margin-bottom:8px"><span style="font:${E.dw}${FS.S}px/1.15 ${disp};${secStyle};color:${secC}">${esc(SEC[c.k])}</span></div>
      ${c.items.map(it=>`<div style="margin-bottom:${FS.G}px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
        <span style="font:800 ${FS.D}px/1.12 ${body};color:${ink}">${esc(it.n)}</span><span style="font:${E.dw}${Math.round(FS.D*1.08)}px/1 ${disp};color:${ACC};white-space:nowrap;${glow}">${esc(it.p)}</span></div>
        ${FS.nl&&it.note?`<div style="font:500 ${FS.N}px/1.3 ${body};color:${soft};margin-top:2px">${esc(sentence(clip(it.note,Math.floor(FS.nl*colW/(FS.N*E.bcw)*.95))))}</div>`:""}</div>`).join("")}</div>`).join("");
  const est=(cs,FS)=>{let t=0;cs.forEach((c,i)=>{t+=FS.S*1.15+8+(i?FS.G+6:0);c.items.forEach(it=>{t+=lines(it.n,FS.D,colW-FS.D*2.6,dcw)*FS.D*1.12;if(FS.nl&&it.note)t+=Math.min(FS.nl,lines(it.note,FS.N,colW,E.bcw))*FS.N*1.3+2;t+=FS.G})});return t};
  const measure=(cs,FS)=>{const h=domH(colHtml(cs,FS),colW);return h==null?est(cs,FS):h*1.04};
  let FS=null;
  outer:for(let s=1.07;s>=.55;s-=.05){
    const base={D:Math.max(17,Math.round(28*s)),N:Math.max(15,Math.round(21*s)),S:Math.max(20,Math.round(30*s)),G:Math.max(4,Math.round(16*s))};
    for(const nl of [2,1,0]){if(nl===0&&s>.72)continue;const FSx=Object.assign({},base,{nl});
      let best=null;for(const sp of splits){const t=Math.max(...sp.map(cs=>measure(cs,FSx)));if(!best||t<best.t)best={t,sp}}if(best.t<=MH){FS=Object.assign(FSx,{t:best.t});colsArr=best.sp;break outer}}
  }
  /* rescue for very long menus: give the cue's room to the menu, then smallest legal type, then fewer items per course */
  let dropCue=false;
  if(!FS){dropCue=!!cue;MH+=PM?footH-(noteH+12)-footTail:footH;
    for(const cap of [4,3,2]){courses=courses.map(c=>Object.assign({},c,{items:c.items.slice(0,cap)}));
      splits=cols===2?courses.slice(1).map((_,i)=>[courses.slice(0,i+1),courses.slice(i+1)]):[[courses]];colsArr=splits[0];
      for(const D of [17,16,15]){const FSx={D,N:15,S:D+1,G:3,nl:0};let best=null;for(const sp of splits){const t=Math.max(...sp.map(cs=>measure(cs,FSx)));if(!best||t<best.t)best={t,sp}}
        if(best.t<=MH){FS=Object.assign(FSx,{t:best.t});colsArr=best.sp;break}}
      if(FS)break}
    FS=FS||{D:15,N:15,S:16,G:3,nl:0,t:MH}}

  const spare=MH-FS.t,aw=winks.slice(1,4);
  const also=spare>150&&aw.length?aw.slice(0,Math.max(1,Math.min(aw.length,Math.floor((spare-64)/32)))):[];
  const boardHtml=`<div style="position:absolute;left:${BX}px;top:0;width:${BW}px;height:${PH}px;background:${boardBg(E,T)};box-shadow:inset 8px 0 18px rgba(0,0,0,.25);border-radius:0">
    <div style="position:absolute;left:${pad}px;top:${pad}px;width:${IW}px;height:${PH-pad*2}px;display:flex;flex-direction:column">
      <div>${hdr}</div>
      <div style="margin-top:14px;height:${Math.floor(MH)}px;display:flex;flex-direction:column">
        <div style="display:flex;gap:${GAP}px">${colsArr.map(cs=>`<div style="width:${colW}px">${colHtml(cs,FS)}</div>`).join("")}</div>
        ${also.length?`<div style="margin-top:auto;margin-bottom:12px;border-top:2px solid ${ACC};padding-top:10px"><div style="${caps(15,ACC,.2)};margin-bottom:4px">${beach?"Seen on the beach":"Seen out front"}</div>${also.map(w=>`<div style="font:600 18px/1.3 ${body};color:${ink};margin-top:3px">${esc(sentence(trunc(w,60)))}</div>`).join("")}</div>`:""}
      </div>
      <div style="margin-top:auto">
        ${PM?`<div style="display:flex;align-items:flex-end;gap:28px;margin-bottom:12px">${cue&&!dropCue?`<div style="width:${cueW}px;box-sizing:border-box;border-left:4px solid ${ACC};padding:2px 0 2px 16px"><div style="${caps(15,ACC,.2)};margin-bottom:6px">Showtime cue</div><div style="font:500 ${cT.z}px/1.3 ${body};color:${ink}">${esc(cue)}</div></div>`:""}${notePM}</div>`:cue&&!dropCue?`<div style="border-left:4px solid ${ACC};padding:2px 0 2px 16px;margin-bottom:14px"><div style="${caps(15,ACC,.2)};margin-bottom:6px">Showtime cue</div><div style="font:500 ${cT.z}px/1.3 ${body};color:${ink}">${esc(cue)}</div></div>`:""}
        <div style="font:500 ${fT.z}px/1.3 ${body};color:${soft}">${esc(fine)}</div></div></div></div>`;

  const face=`<div style="position:absolute;inset:0;background:#111">${boardHtml}${photoHtml}${stripHtml}</div>`;
  return {w:W,h:H,faces:[face]};
};
})();
