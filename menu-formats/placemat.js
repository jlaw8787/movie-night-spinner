/* shared picture helper (same block in placemat, stadium, prom, kiosk, invite; first file to load wins).
   still: a still that is mostly blank white or near black is swapped for the next candidate, the least bad one is kept,
          a dark keeper gets lifted; a failed still falls through to the next one, then the poster.
   logo: transparent padding is trimmed and the logo is sized by area into its max box, so the panel wraps the logo.
   place: props and logo panels on a photo go to the candidate spot that covers the least face and detail
          (skin tone weighted edges), and the crop can slide to give faces room. */
(function(){
const CPI=[[1880,.07],[1900,.065],[1915,.08],[1920,.15],[1930,.13],[1940,.11],[1950,.19],[1960,.23],[1970,.30],[1980,.63],[1990,1],[2000,1.32],[2010,1.68],[2020,1.98],[2025,2.4]];
function cpi(y){y=+y||1990;if(y<=CPI[0][0])return CPI[0][1];for(let i=1;i<CPI.length;i++){const [a,va]=CPI[i-1],[b,vb]=CPI[i];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return CPI[CPI.length-1][1]}
function eraPrice(str,year,baseYear){const v=+str;if(!isFinite(v))return str;const x=v*cpi(year)/cpi(baseYear);if(x<.975)return String(Math.max(5,Math.round(x*20)*5))+"¢";const c=String(str).split(".")[1]||"00";return Math.floor(x)+"."+c}
window.cpi=window.cpi||cpi;window.eraPrice=window.eraPrice||eraPrice;

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
/* Format: placemat. A restaurant's printed paper placemat, one landscape face, 1344x960.
   Ported from the kids pilot (wip/genre/kids). Era sets type pairing, paper, border, print process and photo
   treatment; tone sets wear, contrast and photo mood. Film logo, palette, stills and flavour sit on top.
   Fonts: Patua One + Libre Franklin (1930s to 1950s), Bagel Fat One + Cabin (1960s, 1970s),
   Fredoka + Nunito (1980s, 1990s), Bricolage Grotesque + Figtree (2000s, modern), Caveat or Yellowtail signatures. */
(function(){
const W=1344,H=960;
if(!document.getElementById("fmt-placemat-fonts")){
  const l=document.createElement("link");l.id="fmt-placemat-fonts";l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Cabin:wght@500;600;700&family=Caveat:wght@700&family=Figtree:wght@500;600;700;800&family=Fredoka:wght@700&family=Libre+Franklin:ital,wght@0,500;0,600;0,800;1,600&family=Nunito:ital,wght@0,600;0,700;0,800;1,700&family=Patua+One&family=Yellowtail&display=swap";
  document.head.appendChild(l);
}

/* ---------- text safety ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[\u2013\u2014]\s*/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s).trim();if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?"]$/.test(s)?s:s+"."};
const DRY=[
/* kids' mode: whole drink names become named mocktails and cooking uses just lose the alcohol word, before any single-word swap (no "syrup Alexander") */
...(()=>{const cap=(m,v)=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v;const W="beer|stout|ale|guinness|lager|red wine|white wine|wine|cider|bourbon|whisky|whiskey|rum|brandy|sherry|marsala|tequila|vodka|sake|champagne";
 return [[/\bbrandy alexanders?\b/gi,m=>cap(m,"vanilla nutmeg milk")],[/\b(brandy|bourbon|whisky|whiskey|rum) milk punch\b/gi,m=>cap(m,"vanilla milk punch")],
  [new RegExp("\\b("+W+")[- ](battered)\\b","gi"),m=>cap(m,"crisp battered")],[new RegExp("\\b("+W+")[- ](braised|stewed)\\b","gi"),(m,a,b)=>cap(m,"slow-"+b.toLowerCase())],
  [new RegExp("\\b("+W+")[- ](glazed)\\b","gi"),m=>cap(m,"sticky glazed")],[new RegExp("\\b("+W+")[- ](marinated|poached|steamed|soaked|infused|spiked|cured)\\b","gi"),(m,a,b)=>cap(m,b.toLowerCase())],
  [/\b(red wine|white wine|rice wine|sherry|cider|champagne|malt) vinegar\b/gi,m=>m.replace(/(wine|sherry|cider|champagne|malt)/i,w=>w[0]+"\u200B"+w.slice(1))],
  [new RegExp("\\b("+W+"|port)[- ](jus|sauce|gravy|reduction|butter|glaze)\\b","gi"),(m,a,b)=>cap(m,"rich "+b.toLowerCase())],
  [/\brum balls?\b/gi,m=>cap(m,"choc coconut balls")],[/\birish coffee\b/gi,m=>cap(m,"Irish-style hot chocolate")],[/\bmimosas?\b/gi,m=>cap(m,"orange fizz")],
  [/\bshandy\b/gi,m=>cap(m,"lemon squash")],[/\b(gin|vodka) and tonic\b/gi,m=>cap(m,"lime and tonic")],[/\bmint juleps?\b/gi,m=>cap(m,"mint lemonade")],
  [/\bold fashioneds?\b/gi,m=>cap(m,"orange and cherry soda")],[/\bboilermakers?\b/gi,m=>cap(m,"ginger beer float")]]})(),
[/\bred wine\b|\bwhite wine\b|\bwine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktail(?! franks)\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur)\b/gi,"syrup"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
const FAMILY=new Set(["kids","fairytale","wizard"]);

/* ---------- colour ---------- */
const hex=h=>{h=String(h||"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(h))return null;return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);

/* ---------- era looks ---------- */
const ERA_GROUP={"1930s-40s":"e40","1950s":"e40","1960s":"e70","1970s":"e70","1980s":"e90","1990s":"e90","2000s":"now","modern":"now"};
const LOOK={
  e40:{paper:"#f1e3c4",ink:"#2b2117",soft:"#5b4a38",red:"#b3322a",hi:"#e9c46a",fallback:"#2f5d62",
    disp:"'Patua One',Georgia,serif",body:"'Libre Franklin',Arial,sans-serif",sig:"'Yellowtail',cursive",dispW:400,caps:true,track:".02em",
    border:"double",radius:4,photo:"sepia(.38) saturate(.78) contrast(1.08)",halftone:true,printSpread:true,
    rule:"double",headStyle:"plate",kick:"Est. ",nowShowing:"NOW SHOWING"},
  e70:{paper:"#f3dcab",ink:"#3a2415",soft:"#6a4a30",red:"#d0602a",hi:"#e9a93a",fallback:"#7a4a22",
    disp:"'Bagel Fat One','Cooper Black',serif",body:"'Cabin',Arial,sans-serif",sig:"'Caveat',cursive",dispW:400,caps:false,track:"0",
    border:"stripes",radius:26,photo:"sepia(.22) saturate(.9) brightness(1.03) contrast(.96)",halftone:false,printSpread:false,
    rule:"bands",headStyle:"pill",kick:"Since ",nowShowing:"Now showing"},
  e90:{paper:"#fffaf0",ink:"#1d2a52",soft:"#4a5577",red:"#e5392c",hi:"#ffc93c",fallback:"#1f6fd1",
    disp:"'Fredoka','Nunito',sans-serif",body:"'Nunito',sans-serif",sig:"'Caveat',cursive",dispW:700,caps:true,track:".01em",
    border:"checker",radius:22,photo:"saturate(1.1) contrast(1.05)",halftone:false,printSpread:false,
    rule:"line",headStyle:"line",kick:"",nowShowing:"NOW SHOWING"},
  now:{paper:"#fbfaf7",ink:"#16181d",soft:"#4b5059",red:"#d8452f",hi:"#f2c14e",fallback:"#2a6f97",
    disp:"'Bricolage Grotesque',Arial,sans-serif",body:"'Figtree',Arial,sans-serif",sig:"'Caveat',cursive",dispW:800,caps:false,track:"-.01em",
    border:"keyline",radius:0,photo:"saturate(1.04) contrast(1.03)",halftone:false,printSpread:false,
    rule:"thin",headStyle:"tag",kick:"",nowShowing:"Now showing"}
};
/* tone: wear, photo mood, contrast, copy voice */
const TONE={
  gritty:{tex:.75,photo:" contrast(1.15) saturate(.85)",vig:.34,tilt:2.4,voice:"Eat up. Nobody leaves hungry."},
  scrappy:{tex:.8,photo:" contrast(1.12) brightness(1.02)",vig:.28,tilt:3.2,voice:"Cheap eats, big screen."},
  glossy:{tex:.18,photo:" saturate(1.15) contrast(1.06)",vig:.08,tilt:1,voice:"Sit back. Tonight is on us.",sheen:true},
  eerie:{tex:.5,photo:" saturate(.55) brightness(.92) contrast(1.12) hue-rotate(-8deg)",vig:.42,tilt:1.5,voice:"Lights low. Plates full."},
  playful:{tex:.35,photo:" saturate(1.14)",vig:.12,tilt:3,voice:"Grab a seat and dig in."},
  grand:{tex:.3,photo:" contrast(1.05)",vig:.18,tilt:.8,voice:"Dinner is served.",gold:true},
  tender:{tex:.35,photo:" sepia(.12) brightness(1.04) saturate(.95)",vig:.16,tilt:1.4,voice:"Pull up a chair. Stay a while."},
  tense:{tex:.45,photo:" contrast(1.2) saturate(.9)",vig:.36,tilt:1.2,voice:"Eat fast. Keep your eyes on the door."},
  warm:{tex:.4,photo:" sepia(.08) saturate(1.04)",vig:.18,tilt:1.8,voice:"Come in, sit down, eat well."}
};

const NOISE="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45  0 0 0 0 .36  0 0 0 0 .22  0 0 0 .55 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>").replace(/'/g,"%27");
const BLOTCH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.006' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 .62  0 0 0 0 .5  0 0 0 0 .3  0 0 0 .32 0'/></filter><rect width='900' height='900' filter='url(#b)'/></svg>").replace(/'/g,"%27");
const HALFTONE="radial-gradient(rgba(40,25,10,.22) 30%,transparent 32%) 0 0/5px 5px";

function price(k,i,yy){
  if(k==="s")return["3.50","4.25","3.95","4.75"][i%4];
  if(k==="m")return["6.95","7.50","6.50","7.25"][i%4];
  if(k==="w")return i?"2.50":"2.25";
  return i?"1.75":"1.50";
}
/* menu sizes from the estimated height of the 404px column */
function sizes(menu,avail){
  let h=0;
  for(const k of ["s","m","w","d"]){const its=menu[k]||[];if(!its.length)continue;h+=54;
    for(const it of its)h+=Math.ceil((clean(it.n).length+5)/26)*29+(it.note?Math.ceil(clean(it.note).length/38)*25+4:0)+14}
  const s=Math.min(1,avail/h);
  return{dish:Math.max(18,Math.round(27*s)),note:Math.max(16,Math.round(20*s)),gap:Math.max(6,Math.round(14*s)),head:Math.max(18,Math.round(24*s))};
}

/* ---------- runtime fit, run from an onload hook once fonts are in ---------- */
window.__placematFit=window.__placematFit||function(trigger){
  const el=trigger.closest("[data-pm]");if(!el||el.dataset.fitted)return;
  document.fonts.ready.then(()=>{
    el.dataset.fitted="1";
    const over=b=>b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1;
    const step=(nodes,box,min)=>{for(let k=0;k<14&&over(box);k++){let ch=false;nodes.forEach(n=>{const s=parseFloat(getComputedStyle(n).fontSize);if(s>min){n.style.fontSize=(s-1)+"px";ch=true}});if(!ch)break}};
    const menu=el.querySelector('[data-fit="menu"]');
    if(menu){step([...menu.querySelectorAll('[data-fit="dish"],[data-fit="note"],[data-fit="head"]')],menu,16);
      for(const n of [2,1])if(over(menu))menu.querySelectorAll('[data-fit="note"]').forEach(e=>{e.style.display="-webkit-box";e.style.webkitBoxOrient="vertical";e.style.webkitLineClamp=String(n);e.style.overflow="hidden"});
      if(over(menu))menu.querySelectorAll('[data-fit="note"]').forEach(e=>e.style.display="none")}
    const sign=el.querySelector('[data-fit="signbox"]'),vn=el.querySelector('[data-fit="venue"]');
    for(let k=0;sign&&vn&&k<20&&(over(sign)||vn.offsetHeight>parseFloat(getComputedStyle(vn).fontSize)*2.3);k++)vn.style.fontSize=(parseFloat(getComputedStyle(vn).fontSize)-2)+"px";
    const tp=el.querySelector('[data-fit="lpanel"]'),tt=el.querySelector('[data-fit="title"]');
    for(let k=0;tp&&tt&&k<20&&(tp.offsetHeight>250||over(tt));k++)tt.style.fontSize=(parseFloat(getComputedStyle(tt).fontSize)-2)+"px";
    const side=el.querySelector('[data-fit="side"]');
    if(side)step([...side.querySelectorAll('[data-fit="story"],[data-fit="cue"]')],side,15);
    const fine=el.querySelector('[data-fit="finebox"]');
    if(fine)step([...fine.querySelectorAll('[data-fit="fine"]')],fine,14);
    const pr=el.querySelector('[data-fit="prop"]');
    if(pr)step([...pr.querySelectorAll('[data-fit="ptitle"]')],pr,15);
  });
};
/* logo keeps its own colours: a dark logo gets light stock, a light logo dark stock; a failed logo falls back to type */
window.__placematLogo=window.__placematLogo||function(img,ok){
  const panel=img.closest('[data-fit="lpanel"]');if(!panel)return;
  if(!ok){img.remove();const fb=panel.querySelector('[data-fallback]');if(fb){fb.style.display="";fb.dataset.fit="title"}return}
  try{const cv=document.createElement("canvas");cv.width=96;cv.height=Math.max(8,Math.round(96*img.naturalHeight/img.naturalWidth));
    const cx=cv.getContext("2d");cx.drawImage(img,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;
    let s=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>128){s+=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];n++}
    if(n&&s/n<110){panel.style.background=panel.dataset.light;const k=panel.querySelector('[data-pk]');if(k)k.style.color=panel.dataset.lightink}
  }catch(e){}
};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS.placemat=ctx=>{
  const f=ctx.f,menu=ctx.menu||{s:[],m:[],w:[],d:[]},fl=ctx.flavour||null,logo=ctx.logo||null;
  const L=LOOK[ERA_GROUP[ctx.era]||"now"],T=TONE[ctx.tone]||TONE.warm,eg=ERA_GROUP[ctx.era]||"now";
  const family=FAMILY.has(f.theme);
  const dry=s=>family?DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s)):clean(s);
  const img=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");

  /* film colours with contrast checks, era-tinted */
  let acc=ctx.palette&&hex(ctx.palette.accent);
  if(!acc||Math.max(...acc)-Math.min(...acc)<40||contrast(acc,hex(L.paper))<1.6)acc=hex(L.fallback);
  if(eg==="e40")acc=mix(acc,[120,90,60],.3);
  if(eg==="e70")acc=mix(acc,[200,120,40],.25);
  let lab=acc;for(let k=0;k<12&&contrast(lab,hex(L.paper))<4.6;k++)lab=mix(lab,[0,0,0],.12);
  const K={acc:toHex(acc),lab:toHex(lab),deep:toHex(mix(acc,[0,0,0],.52)),glow:toHex(mix(acc,[255,255,255],.3))};

  const tag=clean(f.T||""),cue=clean(f.P||"");
  const yy=String(f.year).slice(-2);
  const num=fl&&/^\d{1,4}$/.test(String(fl.number||""))?String(fl.number):"";
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const venue=clean(fl&&fl.venue||"The Corner Table");
  const sign=clean(fl&&fl.sign||"Dinner and a movie");
  const lab4=["Snacks","Mains","Treats","Drinks"],keys=["s","m","w","d"];
  const kicker=family?"Kids' menu":(eg==="e40"?"Bill of fare":eg==="e70"?"Our menu":"Tonight's menu");
  const tz=sizes(menu,590);
  const stills=(ctx.stills||[]).filter(Boolean);
  /* the film's number only sets the cents of the first main, on the period price */
  const pr=(k,i)=>{const v=eraPrice(price(k,i,yy),f.year,1985);if(k==="m"&&i===0&&num){const d=String(v).match(/^(\d+)\.\d\d$/);if(d)return d[1]+"."+num.slice(-2).padStart(2,"0")}return v};
  const caps=L.caps?"text-transform:uppercase;":"";
  const spread=L.printSpread?"text-shadow:0 0 .6px currentColor;":"";
  const tex=op=>`<div style="position:absolute;inset:0;background:url('${NOISE}') 0 0/300px;opacity:${op};mix-blend-mode:multiply;pointer-events:none"></div>`;
  const photoFilter=L.photo+T.photo;

  /* photos: still, or the poster on its own blurred bed when the film has no stills */
  const photo=(p,pos,isPoster,alts)=>{
    const src=img(p,isPoster?"w780":"w1280");if(!src)return"";
    const pick=`data-pick data-alts="${(alts||[]).map(a=>img(a,"w1280")).join("|")}" data-last="${ctx.poster?img(ctx.poster,"w780"):""}"${isPoster?' data-done="1"':""} onload="window.__PICK&&__PICK.still(this)" onerror="window.__PICK&&__PICK.fail(this)"`;
    const base=isPoster
      ?`<img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:-30px;width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover;filter:blur(18px) ${photoFilter} brightness(.7)"><img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:right center;filter:${photoFilter}" ${pick}>`
      :`<img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:${photoFilter}" ${pick}>`;
    return base
      +(L.halftone?`<div style="position:absolute;inset:0;background:${HALFTONE};mix-blend-mode:multiply;opacity:.55"></div>`:"")
      +(T.sheen?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.22),rgba(255,255,255,0) 38%)"></div>`:"")
      +(T.tex>=.7?`<div style="position:absolute;inset:0;background:url('${NOISE}') 0 0/220px;mix-blend-mode:multiply;opacity:.9"></div><div style="position:absolute;inset:0;background:url('${BLOTCH}') 0 0/700px;mix-blend-mode:multiply;opacity:.8"></div>`:"")
      +`<div style="position:absolute;inset:0;box-shadow:inset 0 0 ${60+T.vig*120}px rgba(0,0,0,${.15+T.vig*.6})"></div>`;
  };
  const heroP=stills[0]||ctx.poster,heroIsPoster=!stills[0];
  const secondP=stills[1]||null;

  /* logo panel */
  const lr=logo&&logo[0]&&logo[1]&&logo[2]?logo[1]/logo[2]:0;
  let lh=lr?Math.min(140,Math.sqrt(40000/lr)):0,lw=lh*lr;const LMX=ctx.poster?236:480;if(lw>LMX){lw=LMX;lh=lw/lr}lw=Math.round(lw);lh=Math.round(lh);
  const tl=f.title.length,tsz=tl<=10?72:tl<=20?60:tl<=34?48:tl<=48?40:36;
  const dark=eg==="now"?"rgba(16,18,24,.74)":`${K.deep}e0`,light=eg==="e40"?"rgba(241,227,196,.95)":"rgba(255,251,242,.94)";
  const titleType=`font:${L.dispW} ${tsz}px/1.04 ${L.disp};color:#fff;${caps}letter-spacing:${L.track};text-shadow:3px 3px 0 ${L.red}`;
  const lpanel=`<div data-fit="lpanel" data-lpanel data-sp="logo" data-dark="${dark}" data-light="${light}" data-lightink="${L.red}" style="${ctx.poster?"position:relative;max-width:100%":"position:absolute;left:22px;bottom:22px;max-width:540px"};padding:${ctx.poster?"14px 18px 12px":"16px 22px 14px"};border-radius:${Math.min(L.radius,14)}px;background:${dark};box-shadow:0 6px 18px rgba(0,0,0,.35),inset 0 0 0 2px rgba(255,255,255,.16)${T.gold?",inset 0 0 0 5px rgba(201,162,74,.8)":""}">
      ${lr?`<span data-lmax="${LMX},140" data-larea="40000" style="display:block;width:${lw}px;height:${lh}px"><img crossorigin="anonymous" alt="${esc(f.title)}" src="${img(logo[0],"w500")}" onload="window.__PICK&&__PICK.logo(this)" onerror="this.parentNode.style.display='none';window.__placematLogo&&__placematLogo(this,false)" style="display:block;height:${lh}px;width:${lw}px;object-fit:contain"></span><div data-fallback style="display:none;${titleType}">${esc(f.title)}</div>`
          :`<div data-fit="title" style="${titleType}">${esc(f.title)}</div>`}
      <div data-pk style="font:800 15px/1 ${L.body};letter-spacing:${ctx.poster?".08em":".24em"};color:${L.hi};margin-top:10px;text-transform:uppercase;white-space:nowrap">${esc(L.nowShowing)} &nbsp;/&nbsp; ${esc(f.year)}</div>
    </div>`;

  /* menu */
  const head=(j)=>{const c=j%2?L.red:K.lab;
    if(L.headStyle==="plate")return `<div style="margin:0 0 10px;text-align:center;border-top:3px double ${c};border-bottom:3px double ${c};padding:5px 0 4px"><span data-fit="head" style="font:400 ${tz.head}px/1 ${L.disp};letter-spacing:.14em;text-transform:uppercase;color:${c};${spread}">${lab4[j]}</span></div>`;
    if(L.headStyle==="pill")return `<div style="margin:0 0 10px"><span data-fit="head" style="display:inline-block;font:400 ${tz.head}px/1 ${L.disp};color:#fff8ea;background:${c};padding:7px 18px 8px;border-radius:999px">${lab4[j]}</span></div>`;
    if(L.headStyle==="tag")return `<div style="margin:0 0 10px;display:flex;align-items:baseline;gap:10px"><span style="font:800 15px/1 ${L.body};color:${c}">0${j+1}</span><span data-fit="head" style="font:800 ${tz.head}px/1 ${L.disp};color:${L.ink};letter-spacing:-.01em">${lab4[j]}</span><i style="flex:1;height:1px;background:${L.ink};opacity:.3"></i></div>`;
    return `<div style="display:flex;align-items:center;gap:12px;margin:0 0 10px"><span data-fit="head" style="font:700 ${tz.head}px/1 ${L.disp};letter-spacing:.06em;text-transform:uppercase;color:${c}">${lab4[j]}</span><i style="flex:1;height:3px;background:${c};opacity:.55;border-radius:2px"></i></div>`};
  const item=(k,it,i)=>`<div style="padding:0 0 ${tz.gap}px">
    <div style="display:flex;align-items:baseline;gap:12px"><span data-fit="dish" style="flex:1;font:${L.dispW} ${tz.dish}px/1.1 ${L.disp};color:${L.ink};${spread}">${esc(dry(it.n))}</span><span data-fit="dish" style="font:${L.dispW} ${tz.dish}px/1 ${L.disp};color:${L.red};${spread}">${pr(k,i)}</span></div>
    ${it.note?`<div data-fit="note" style="font:600 ${tz.note}px/1.25 ${L.body};color:${L.soft};margin-top:3px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const courses=keys.map((k,j)=>(menu[k]||[]).length?head(j)+(menu[k]||[]).map((it,i)=>item(k,it,i)).join(""):"").join("");

  /* note with script signature, or the story when there is no flavour */
  const note=fl&&fl.note&&fl.note.text?fl.note:null;
  const noteHTML=note
    ?`<div style="font:800 14px/1 ${L.body};letter-spacing:.22em;color:${L.red}">A WORD FROM THE HOUSE</div>
      <div data-fit="story" style="font:italic 600 18px/1.32 ${L.body};color:${L.ink};margin-top:8px">"${esc(dry(note.text))}"</div>
      <div style="font:400 ${L.sig.includes("Yellowtail")?28:32}px/1 ${L.sig};font-weight:${L.sig.includes("Yellowtail")?400:700};color:${K.lab};transform:rotate(-3deg);margin-top:6px;text-align:right">${esc(note.by)}</div>`
    :`<div style="font:800 14px/1 ${L.body};letter-spacing:.22em;color:${L.red}">TONIGHT'S STORY</div>
      <div data-fit="story" style="font:600 18px/1.32 ${L.body};color:${L.ink};margin-top:8px">${esc(sentence(f.D||tag||T.voice))}</div>`;

  /* prop: type-only paper object */
  const p=fl&&fl.prop&&fl.prop.title?fl.prop:{kind:"ticket",title:"Movie night",lines:["One seat, one plate","Keep this stub"]};
  const pk=p.kind||"card";
  const pbg=eg==="e40"?"#efe0bd":eg==="e70"?"#f6e2b4":"#fffdf7";
  const propStyle={
    ticket:`background:${L.hi};border-radius:6px;-webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;`,
    stub:`background:${L.hi};border-radius:6px;border-left:3px dashed ${L.ink};`,
    badge:`background:${pbg};border-radius:18px;box-shadow:inset 0 0 0 4px ${K.lab},inset 0 0 0 7px ${pbg},inset 0 0 0 9px ${L.hi},0 4px 12px rgba(0,0,0,.35);`,
    tag:`background:#f3e3c0;border-radius:6px 30px 30px 6px;`,
    slip:`background:${pbg};border-top:6px solid ${K.lab};border-radius:3px;`,
    receipt:`background:${pbg};border-radius:2px;`,
    card:`background:${pbg};border-radius:6px;border-bottom:8px solid ${K.lab};`
  }[pk]||`background:${pbg};border-radius:6px;border-bottom:8px solid ${K.lab};`;
  const propHTML=`<div data-fit="prop" data-sp="prop" style="${ctx.poster?"position:relative;align-self:center;flex:none;":"position:absolute;right:14px;top:14px;"}width:214px;max-height:200px;box-sizing:border-box;${propStyle}padding:13px 18px 12px;transform:rotate(${T.tilt}deg);box-shadow:0 4px 12px rgba(0,0,0,.35);overflow:hidden">
      ${tex(.35)}
      <div style="position:relative;font:800 14px/1 ${L.body};letter-spacing:.18em;color:${K.lab};text-transform:uppercase">${esc(pk==="badge"?"Official badge":pk==="ticket"||pk==="stub"?"Admit one":pk==="receipt"?"Receipt":"Keep this")}</div>
      <div data-fit="ptitle" style="position:relative;font:${L.dispW} 20px/1.05 ${L.disp};color:${L.ink};${caps}margin:6px 0 6px">${esc(p.title)}</div>
      ${(p.lines||[]).slice(0,3).map(l=>`<div data-fit="ptitle" style="position:relative;font:700 14px/1.3 ${L.body};color:${L.ink}">${esc(dry(l))}</div>`).join("")}
    </div>`;

  const fine=`${family?"*With a grown-up's meal. Every drink is alcohol-free. ":""}Prices subject to change.${winks[0]?` Table talk: ${winks[0].replace(/\.$/,"")}.`:""} Form PM-${num||f.year}. Images: TMDB.`;

  /* border by era, wear by tone */
  const outer={
    checker:`repeating-conic-gradient(${K.lab} 0 25%,#fff4e2 0 50%) 0 0/36px 36px`,
    stripes:`linear-gradient(${L.paper},${L.paper})`,
    double:`linear-gradient(${L.paper},${L.paper})`,
    keyline:`linear-gradient(${L.paper},${L.paper})`
  }[L.border];
  const inset=L.border==="checker"?24:L.border==="stripes"?30:L.border==="double"?26:18;
  const frame=L.border==="stripes"
    ?`box-shadow:0 0 0 7px ${L.hi},0 0 0 14px ${L.red},0 0 0 21px ${K.deep};`
    :L.border==="double"?`box-shadow:0 0 0 3px ${L.paper},0 0 0 6px ${L.red},0 0 0 10px ${L.paper},0 0 0 12px ${L.red};`
    :L.border==="keyline"?`box-shadow:0 0 0 2px ${K.lab};`
    :`box-shadow:0 0 0 5px ${L.hi},0 0 0 7px rgba(0,0,0,.08);`;
  const gut=eg==="now"?3:5,gc=eg==="now"?L.paper:L.hi;
  const IW=W-2*inset,IH=H-2*inset;
  const heroW=Math.round(IW*.679),heroH=Math.round(IH*.647),sideX=heroW+gut;
  const secW=Math.round(heroW*.636);
  const pW=Math.round(heroH*2/3),stillH=Math.round(heroH*.5);

  const html=`<div data-pm style="position:absolute;inset:0;overflow:hidden;background:${outer};font-family:${L.body};color:${L.ink}">
  ${tex(T.tex*.6)}
  <img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onload="window.__placematFit&&__placematFit(this)" style="position:absolute;width:1px;height:1px;opacity:0">
  <div style="position:absolute;left:${inset}px;top:${inset}px;width:${IW}px;height:${IH}px;background:${L.paper};border-radius:${L.radius}px;${frame}overflow:hidden">
    <div style="position:absolute;inset:0;background:url('${BLOTCH}') 0 0/900px;mix-blend-mode:multiply;opacity:${.25+T.tex*.5};pointer-events:none"></div>
    ${tex(T.tex)}
    <div style="position:absolute;inset:0;box-shadow:inset 0 0 ${80+T.vig*160}px rgba(110,80,40,${T.vig*.6});pointer-events:none"></div>

    ${ctx.poster?`<div style="position:absolute;left:0;top:0;width:${heroW}px;height:${heroH}px;overflow:hidden;background:${K.deep}">
      <div style="position:absolute;left:0;top:0;width:${pW}px;height:${heroH}px;overflow:hidden;background:${K.deep}"><img crossorigin="anonymous" alt="${esc(f.title)} (${esc(f.year)}) poster" src="${img(ctx.poster,"w780")}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block"><div style="position:absolute;inset:0;box-shadow:inset 0 0 ${30+T.vig*50}px rgba(0,0,0,${.1+T.vig*.3})"></div></div>
      <div style="position:absolute;left:${pW}px;top:0;width:${gut}px;height:${heroH}px;background:${gc}"></div>
      <div style="position:absolute;left:${pW+gut}px;top:0;right:0;height:${heroH}px;overflow:hidden;display:flex;flex-direction:column">
        ${stills[0]?`<div style="position:relative;flex:none;height:${stillH}px;overflow:hidden;background:${K.deep}">${photo(stills[0],"50% 40%",false,stills.slice(5,8))}</div><div style="flex:none;height:${gut}px;background:${gc}"></div>`:""}
        <div style="position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:18px;background:${K.deep}">${lpanel}</div>
      </div></div>`
    :`<div data-safe='${JSON.stringify({pos:[[50,40],[50,22],[50,60],[30,40],[70,40]],items:[{q:"[data-sp=logo]",c:[["l",22,"b",22],["r",22,"b",22],["l",22,"t",22],["r",22,"t",22]]}]})}' style="position:absolute;left:0;top:0;width:${heroW}px;height:${heroH}px;overflow:hidden;background:${K.deep}">
      ${photo(heroP,"50% 40%",heroIsPoster,stills.slice(5,8))}
      ${lpanel}
    </div>`}
    <div style="position:absolute;left:0;top:${heroH}px;width:${heroW}px;height:${gut}px;background:${gc}"></div>
    <div style="position:absolute;left:${heroW}px;top:0;width:${gut}px;bottom:0;background:${gc}"></div>

    <div style="position:absolute;left:0;top:${heroH+gut}px;width:${secW}px;bottom:0;background:${K.deep}">
      <div ${secondP?`data-safe='${JSON.stringify({pos:[[50,45],[50,25],[50,70],[35,45],[65,45]],fixed:["[data-sp=lab]"],items:[{q:"[data-sp=prop]",c:[["r",14,"t",14],["l",14,"t",14],["r",14,"b",14],["c",0,"t",14]]}]})}'`:""} style="position:absolute;inset:0;overflow:hidden">${secondP?photo(secondP,"50% 45%",false,stills.slice(2,5))
        :`<div style="position:absolute;inset:0;padding:30px 230px 30px 30px;display:flex;align-items:center;font:${L.dispW} 30px/1.15 ${L.disp};color:#fff;${caps}">${esc(sentence(tag||T.voice))}</div>`}
        ${secondP?`<div data-sp="lab" style="position:absolute;left:14px;bottom:14px;background:rgba(255,253,247,.92);padding:6px 12px;border-radius:${Math.min(L.radius,4)}px;font:800 14px/1.2 ${L.body};letter-spacing:.06em;color:${L.ink};box-shadow:0 2px 6px rgba(0,0,0,.3)">ON THE BIG SCREEN TONIGHT</div>`:""}
      ${propHTML}</div>
    </div>
    <div style="position:absolute;left:${secW}px;top:${heroH+gut}px;width:${gut}px;bottom:0;background:${gc}"></div>

    <div data-fit="side" style="position:absolute;left:${secW+gut+24}px;top:${heroH+gut+22}px;width:${heroW-secW-gut-46}px;bottom:20px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
      <div>${noteHTML}</div>
      <div style="border-top:3px ${eg==="now"?"solid":"dashed"} ${L.red};padding-top:10px">
        <div style="font:800 14px/1 ${L.body};letter-spacing:.22em;color:${L.red}">SHOWTIME CUE</div>
        <div data-fit="cue" style="font:600 ${cue.length>80?16:17}px/1.28 ${L.body};color:${L.ink};margin-top:6px">${esc(sentence(cue||T.voice))}</div></div>
    </div>

    <div data-fit="signbox" style="position:absolute;left:${sideX}px;top:0;right:0;height:176px;background:${eg==="now"?K.lab:K.deep};overflow:hidden">
      ${eg==="now"?"":`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 20% 0%,${K.glow}55,rgba(255,255,255,0) 65%),linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18))"></div>`}
      ${tex(T.tex*.8)}
      ${eg==="now"?"":`<div style="position:absolute;inset:12px;border:${eg==="e40"?`3px double ${L.hi}`:`2px solid ${L.hi}`};border-radius:${Math.min(L.radius,12)}px"></div>`}
      ${T.gold?`<div style="position:absolute;inset:18px;border:1px solid rgba(201,162,74,.9);border-radius:8px"></div>`:""}
      <div style="position:absolute;left:32px;right:28px;top:24px;bottom:22px;display:flex;flex-direction:column;justify-content:center">
        <div style="font:800 15px/1 ${L.body};letter-spacing:.26em;color:${L.hi};text-transform:uppercase">${esc(kicker)}${L.kick&&!family?` &nbsp;/&nbsp; ${esc(L.kick+f.year)}`:""}</div>
        <div data-fit="venue" style="font:${L.dispW} ${venue.length>20?32:40}px/1.04 ${L.disp};color:#fff;${caps}letter-spacing:${L.track};margin-top:7px;text-shadow:0 2px 0 rgba(0,0,0,.3)">${esc(venue)}</div>
        <div style="font:700 17px/1.2 ${L.body};color:${L.hi};margin-top:6px">${esc(sign)}</div>
      </div>
    </div>
    <div style="position:absolute;left:${sideX}px;right:0;top:176px;height:${eg==="now"?0:5}px;background:${L.red}"></div>

    <div style="position:absolute;left:${sideX+26}px;right:24px;top:198px;bottom:104px;display:flex;flex-direction:column">
      ${tag?`<div data-fit="tag" style="font:${L.dispW} 24px/1.12 ${L.disp};color:${K.lab};margin:0 0 16px;flex:none">${esc(sentence(tag))}</div>`:""}
      <div data-fit="menu" style="flex:1;min-height:0;overflow:hidden">${courses}</div>
    </div>
    <div data-fit="finebox" style="position:absolute;left:${sideX+26}px;right:24px;bottom:14px;height:82px;display:flex;align-items:flex-end;overflow:hidden"><div data-fit="fine" style="font:600 14px/1.3 ${L.body};color:${L.soft}">${esc(fine)}</div></div>
  </div>
</div>`;

  /* poster layout: the poster is the main picture, full height of the face, hugged by its frame */
  const PW=Math.round(IH*2/3),RX=PW+gut,sideW=272,sideL=IW-18-sideW,menuX=RX+26,menuW=sideL-18-menuX;
  const htmlP=`<div data-pm style="position:absolute;inset:0;overflow:hidden;background:${outer};font-family:${L.body};color:${L.ink}">
  ${tex(T.tex*.6)}
  <img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onload="window.__placematFit&&__placematFit(this)" style="position:absolute;width:1px;height:1px;opacity:0">
  <div style="position:absolute;left:${inset}px;top:${inset}px;width:${IW}px;height:${IH}px;background:${L.paper};border-radius:${L.radius}px;${frame}overflow:hidden">
    <div style="position:absolute;inset:0;background:url('${BLOTCH}') 0 0/900px;mix-blend-mode:multiply;opacity:${.25+T.tex*.5};pointer-events:none"></div>
    ${tex(T.tex)}
    <div style="position:absolute;left:0;top:0;width:${PW}px;height:${IH}px;overflow:hidden;background:${K.deep}"><img crossorigin="anonymous" alt="${esc(f.title)} (${esc(f.year)}) poster" src="${img(ctx.poster,"w780")}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block"></div>
    <div style="position:absolute;left:${PW}px;top:0;width:${gut}px;height:${IH}px;background:${gc}"></div>

    <div data-fit="signbox" style="position:absolute;left:${RX}px;top:0;right:0;height:176px;background:${eg==="now"?K.lab:K.deep};overflow:hidden">
      ${eg==="now"?"":`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 20% 0%,${K.glow}55,rgba(255,255,255,0) 65%),linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18))"></div>`}
      ${tex(T.tex*.8)}
      ${eg==="now"?"":`<div style="position:absolute;inset:12px;border:${eg==="e40"?`3px double ${L.hi}`:`2px solid ${L.hi}`};border-radius:${Math.min(L.radius,12)}px"></div>`}
      ${T.gold?`<div style="position:absolute;inset:18px;border:1px solid rgba(201,162,74,.9);border-radius:8px"></div>`:""}
      <div style="position:absolute;left:32px;right:28px;top:24px;bottom:22px;display:flex;flex-direction:column;justify-content:center">
        <div style="font:800 15px/1 ${L.body};letter-spacing:.26em;color:${L.hi};text-transform:uppercase">${esc(kicker)}${L.kick&&!family?` &nbsp;/&nbsp; ${esc(L.kick+f.year)}`:""}</div>
        <div data-fit="venue" style="font:${L.dispW} ${venue.length>20?32:40}px/1.04 ${L.disp};color:#fff;${caps}letter-spacing:${L.track};margin-top:7px;text-shadow:0 2px 0 rgba(0,0,0,.3)">${esc(venue)}</div>
        <div style="font:700 17px/1.2 ${L.body};color:${L.hi};margin-top:6px">${esc(sign)}</div>
      </div>
    </div>
    <div style="position:absolute;left:${RX}px;right:0;top:176px;height:${eg==="now"?0:5}px;background:${L.red}"></div>

    <div style="position:absolute;left:${menuX}px;width:${menuW}px;top:198px;bottom:104px;display:flex;flex-direction:column">
      ${tag?`<div data-fit="tag" style="font:${L.dispW} 24px/1.12 ${L.disp};color:${K.lab};margin:0 0 16px;flex:none">${esc(sentence(tag))}</div>`:""}
      <div data-fit="menu" style="flex:1;min-height:0;overflow:hidden">${courses}</div>
    </div>
    <div data-fit="finebox" style="position:absolute;left:${menuX}px;width:${menuW}px;bottom:14px;height:82px;display:flex;align-items:flex-end;overflow:hidden"><div data-fit="fine" style="font:600 14px/1.3 ${L.body};color:${L.soft}">${esc(fine)}</div></div>

    <div data-fit="side" style="position:absolute;left:${sideL}px;width:${sideW}px;top:${eg==="now"?196:206}px;bottom:18px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;overflow:hidden">
      ${lpanel}
      ${propHTML}
      <div>${noteHTML}</div>
      <div style="border-top:3px ${eg==="now"?"solid":"dashed"} ${L.red};padding-top:8px">
        <div style="font:800 14px/1 ${L.body};letter-spacing:.22em;color:${L.red}">SHOWTIME CUE</div>
        <div data-fit="cue" style="font:600 ${cue.length>80?16:17}px/1.28 ${L.body};color:${L.ink};margin-top:6px">${esc(sentence(cue||T.voice))}</div></div>
    </div>
  </div>
</div>`;
  return {w:W,h:H,faces:[ctx.poster?htmlP:html]};
};
})();
