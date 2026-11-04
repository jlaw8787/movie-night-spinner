
const _ROOT_stadium=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* shared picture helper (same block in placemat, stadium, prom, kiosk, invite; first file to load wins).
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
/* Format: stadium. A stadium concession scorecard, two landscape faces 1344x816.
   Front: hero still (58 percent), venue, logo panel, scoreboard in type (signature), ticket stub, fine print.
   Back: section map of stills (2x2 grid labelled by section), concessions in two columns, manager note with script signature.
   Era sets type pairing, paper (cream scorecard to black gloss), scoreboard tech (hand turned, bulbs, LED, video) and label style; tone sets wear, photo and voice. */
(function(){
const ID="stadium",W=1344,H=816;

/* ---------- shared helpers ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[–—]\s*/g,", ").replace(/\s+-\s+/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cap=s=>{s=clean(s).trim();return s?s.charAt(0).toUpperCase()+s.slice(1):""};
const hex=h=>{h=String(h||"").replace("#","");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const mix=(a,b,t)=>toHex(hex(a).map((v,i)=>v+(hex(b)[i]-v)*t));
const lum=h=>{const a=hex(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
/* push a film colour away from the paper until it reads, else fall back */
function readable(c,paper,min,fb){if(!hex(c))return fb;const dark=lum(paper)>.4;let x=c;for(let i=0;i<10&&cr(x,paper)<min;i++)x=mix(x,dark?"#000000":"#ffffff",.15);return cr(x,paper)>=min?x:fb}
const clamp=n=>`display:-webkit-box;-webkit-line-clamp:${n};-webkit-box-orient:vertical;overflow:hidden`;
function wrapLines(t,fs,w,cw){t=clean(t).trim();if(!t)return 0;const per=Math.max(4,Math.floor(w/(fs*cw)));let n=1,c=0;for(const wd of t.split(/\s+/)){const L=wd.length;if(!c)c=L;else if(c+1+L<=per)c+=1+L;else{n++;c=L}}return n}
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
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
[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|gin|liqueur|martini)\b/gi,"soda"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
const dry=s=>DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s));
function loadFonts(fams){const k="fmt-"+ID+"-fonts";if(document.getElementById(k))return;const l=document.createElement("link");l.id=k;l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+fams.map(f=>"family="+f).join("&")+"&display=swap";document.head.appendChild(l)}
/* logo in its own colours: dark panel by default, switched to the light panel when the logo itself is mostly dark */
const SAMPLE="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,a=0,b=0;for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;var L=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];if(L<95)a++;else if(L>165)b++}if(a>b*1.2){var p=i.parentNode;p.style.background=p.getAttribute('data-light')}}catch(e){}";
function logoImg(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a);if(h<34)return null;return{src:ctx.img(L[0],"w500"),w:Math.round(h*a),h:Math.round(h)}}
function photo(src,filter,pos,extra,alts,last){return `<img src="${src}" crossorigin="anonymous" data-pick data-alts="${(alts||[]).join("|")}" data-last="${last||""}" onload="window.__PICK&&__PICK.still(this)" onerror="window.__PICK&&__PICK.fail(this)" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 35%"};filter:${filter}">${extra||""}`}

/* ---------- era and tone ---------- */
const ERAS=["1930s-40s","1950s","1960s","1970s","1980s","1990s","2000s","modern"];
const E=[
 {disp:"'Graduate',serif",dw:400,body:"'Roboto Slab',serif",sig:"'Mrs Saint Delafield',cursive",paper:"#efe5c9",ink:"#1d3324",acc:"#9b2226",board:"manual",photo:"grayscale(1) contrast(1.12) brightness(1.04)",bar:"grid",cw:.56,cwd:.6,base:.25,secs:["Grandstand","Bleachers","Box Seats","Press Box"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Graduate',serif",dw:400,body:"'Roboto Slab',serif",sig:"'Allura',cursive",paper:"#f3ead3",ink:"#1f2a44",acc:"#b3261e",board:"manual",photo:"saturate(.72) sepia(.2) contrast(1.05)",bar:"grid",cw:.56,cwd:.6,base:.45,secs:["Grandstand","Bleachers","Box Seats","Press Box"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Sigmar One',sans-serif",dw:400,body:"'Roboto Condensed',sans-serif",sig:"'Allura',cursive",paper:"#f4efe2",ink:"#23324a",acc:"#d4572a",board:"bulb",photo:"saturate(1.12) sepia(.08) contrast(1.06)",bar:"pill",cw:.41,cwd:.44,base:.9,dots:1,secs:["Field Level","Mezzanine","Upper Deck","Bleachers"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Sigmar One',sans-serif",dw:400,body:"'Roboto Condensed',sans-serif",sig:"'Allura',cursive",paper:"#f2e0bd",ink:"#3b2412",acc:"#c1561a",board:"bulb",photo:"saturate(1.18) sepia(.22) contrast(1.04)",bar:"pill",cw:.41,cwd:.44,base:1.25,dots:1,secs:["Field Level","Mezzanine","Upper Deck","Bleachers"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Orbitron',sans-serif",dw:800,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#f7f7f4",ink:"#121a2e",acc:"#d0202e",board:"led",photo:"saturate(1.06) contrast(1.05)",bar:"skew",cw:.41,cwd:.44,base:2.5,secs:["Lower Bowl","Club Level","Upper Deck","Courtside"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Orbitron',sans-serif",dw:800,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#fbfbf9",ink:"#0f1d33",acc:"#0a6ab8",board:"led",photo:"saturate(1.08) contrast(1.05)",bar:"skew",cw:.41,cwd:.44,base:3.5,secs:["Lower Bowl","Club Level","Upper Deck","Courtside"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Rajdhani',sans-serif",dw:700,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#16181d",ink:"#f2f2f2",acc:"#22a3e0",board:"video",photo:"saturate(1.08) contrast(1.06)",bar:"led",cw:.41,cwd:.44,base:6,secs:["Lower Bowl","Club Level","Upper Deck","Suites"],cols:["Snacks","Grill","Sweets","Drinks"]},
 {disp:"'Rajdhani',sans-serif",dw:700,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#101318",ink:"#f5f5f5",acc:"#e8b100",board:"video",photo:"saturate(1.05) contrast(1.06)",bar:"led",cw:.41,cwd:.44,base:9,secs:["Lower Bowl","Club Level","Upper Deck","Suites"],cols:["Snacks","Grill","Sweets","Drinks"]}
];
const T={
 gritty:{wear:.55,vig:.38,photo:"contrast(1.1) saturate(.82)",paperTo:"#c9b48c",pt:.12,tilt:-1.5,hawk:"Cash at the stand. No refunds after the first whistle.",gate:"Cheap seats, loud crowd"},
 glossy:{wear:.03,vig:.06,photo:"saturate(1.1) contrast(1.04)",shine:1,tilt:0,hawk:"Seat service in every section.",gate:"Premium seating"},
 warm:{wear:.2,vig:.22,photo:"sepia(.1) saturate(1.06) brightness(1.03)",tilt:-1,hawk:"Hawkers in every aisle. Holler and wave.",gate:"Home sweet home"},
 eerie:{wear:.3,vig:.55,photo:"saturate(.6) brightness(.9) hue-rotate(-8deg)",paperTo:"#9aa6ad",pt:.16,tilt:0,hawk:"Stands close when the lights go out.",gate:"Lights out at the final whistle"},
 playful:{wear:.06,vig:.1,photo:"saturate(1.2) brightness(1.04)",tilt:-3,hawk:"Hawkers in every aisle. Catch it if you can.",gate:"Make some noise"},
 grand:{wear:.1,vig:.2,photo:"contrast(1.06) saturate(1.05)",tilt:0,hawk:"Served in the grandstand with full honours.",gate:"Championship night"},
 tender:{wear:.16,vig:.2,photo:"saturate(.9) brightness(1.06) contrast(.96)",tilt:-1,hawk:"Take your time. The game will wait.",gate:"Same seats every season"},
 tense:{wear:.24,vig:.4,photo:"contrast(1.2) saturate(.78)",paperTo:"#b9b2a2",pt:.1,tilt:0,hawk:"Grab it now. Nobody leaves their seat in the last minute.",gate:"Sudden death"},
 scrappy:{wear:.6,vig:.28,photo:"grayscale(.35) contrast(1.28)",paperTo:"#d8d0bc",pt:.2,tilt:-3.5,hawk:"Cash only. Bring your own cushion.",gate:"Bleacher bums welcome"}
};
loadFonts(["Graduate","Sigmar+One","Orbitron:wght@700;800","Rajdhani:wght@600;700","Roboto+Slab:wght@400;700","Roboto+Condensed:ital,wght@0,400;0,700;1,400","Mrs+Saint+Delafield","Allura","Caveat:wght@600"]);

function money(v,ei){if(v<1&&ei<2)return String(Math.round(v*100))+"c";return v.toFixed(2)}
function prices(menu,e,ei,egg){
  const mult={s:.6,m:1,w:.5,d:.4},out={};let hid=false;
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).map((it,i)=>{let v=e.base*mult[k]*(1+i*.15);v=ei<2?Math.max(.05,Math.round(v*20)/20):Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"&&ei>=2){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)});
  return out;
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},ei=Math.max(0,ERAS.indexOf(ctx.era)),e=E[ei],t=T[ctx.tone]||T.warm;
  const fam=FAMILY.has(f.theme),tx=s=>fam?dry(s):clean(s);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature"),year=f.year||"";
  const venue=clean(fl.venue||(title.length<=22?title+" Concessions":"Stadium Concessions")),sign=clean(fl.sign||t.gate);
  const note=fl.note&&fl.note.text?{text:fl.note.text,by:fl.note.by||"The Manager"}:{text:"Grab a seat, grab a bite, and stay for the whole game. The stands are open till the final whistle.",by:"The Stand Manager"};
  const winks=(fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?fl.prop:{title:"General Admission",lines:["Good for one game","Keep this stub"]};
  const num=String(fl.number||"").replace(/\D/g,"")||String(year).slice(-2)||"7";
  const egg=String(fl.number||"").replace(/\D/g,"").slice(-2)||"";
  let paper=t.paperTo&&lum(e.paper)>.4?mix(e.paper,t.paperTo,t.pt):e.paper;
  const darkPaper=lum(paper)<.2;
  const pal=ctx.palette||{};
  const ink=darkPaper?e.ink:readable(pal.dark&&lum(pal.dark)<.06?pal.dark:e.ink,paper,9,e.ink);
  const acc=readable(pal.accent||e.acc,paper,4.5,e.acc);
  const soft=mix(ink,paper,.3);
  const band=darkPaper?mix(paper,"#000000",.4):readable(pal.dark||e.ink,"#ffffff",8,e.ink);
  const bandText=darkPaper?ink:mix(paper,"#ffffff",.6);
  const grain=(ctx.root!=null?ctx.root:_ROOT_stadium)+"assets/era/_shared/paper-grain.webp";
  const stills=(ctx.stills||[]).filter(Boolean);
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id||`${f.title} (${f.year})`])||null;
  const pf=e.photo+" "+t.photo;
  const DF=e.disp,BF=e.body,SF=e.sig;
  const kick=(s,c,size)=>`<div style="font:700 ${size||16}px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${c||acc};${clamp(1)}">${esc(s)}</div>`;
  const tex=()=>`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(40,25,10,${darkPaper?t.vig*.5:t.vig}) 100%)"></div><div style="position:absolute;inset:0;pointer-events:none;background:url(${grain}) center/1400px auto;opacity:${((darkPaper?.1:.25)+t.wear*1.1).toFixed(2)}"></div>`;
  const overlay=()=>(e.dots?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.16) 1px,transparent 1.4px) 0 0/4px 4px;mix-blend-mode:multiply"></div>`:"")+(t.shine||ei>=6?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,0) 38%)"></div>`:"");
  const W2=W;

  /* ---------- FRONT ---------- */
  const HX=553;
  /* the poster is the hero, whole and uncropped, on the scoreboard-green/black stand wall; stills only feed the section map */
  const posSrc=poster?ctx.img(poster,"w780"):"";
  const heroSrc=posSrc||(stills[0]?ctx.img(stills[0],"w1280"):"");
  const PH=796,PW=Math.round(PH*2/3),PX=18;
  const hero=`<div style="position:absolute;left:0;top:0;width:${HX}px;height:${H}px;overflow:hidden">
    <div style="position:absolute;left:${PX}px;top:10px;width:${PW}px;height:${PH}px;overflow:hidden;background:#222;box-shadow:0 0 0 3px ${paper},0 0 0 6px ${acc},0 10px 22px rgba(0,0,0,.5)">${heroSrc?(posSrc?`<img src="${posSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">${t.shine||ei>=6?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 38%)"></div>`:""}`:photo(heroSrc,pf,"center 40%",overlay(),stills.slice(5,8).map(s=>ctx.img(s,"w1280")),"")):""}</div></div>`;
  const RW=W-HX-60;
  const vSize=venue.length>28?30:venue.length>18?36:42;
  const LMW=RW-44,LMH=150,LA=41000;
  const lg=(()=>{const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(LMH,Math.sqrt(LA/a)),w=h*a;if(w>LMW){w=LMW;h=w/a}return{src:ctx.img(L[0],"w500"),w:Math.round(w),h:Math.round(h)}})();
  const tSize=title.length>40?24:title.length>24?30:title.length>12?38:48;
  const panelDark=mix(band,"#000000",.3),panelLight=darkPaper?"#f2f2ee":mix(paper,"#ffffff",.6);
  const logo=lg?`<div data-lpanel data-dark="${panelDark}" data-light="${panelLight}" data-lightink="${darkPaper?"#5a5d66":acc}" data-type="${panelDark}" style="position:relative;align-self:flex-start;max-width:${RW}px;box-sizing:border-box;padding:16px 22px 26px;background:${panelDark};display:flex;align-items:center;justify-content:center;border-bottom:5px solid ${acc};flex:none;box-shadow:0 3px 10px rgba(0,0,0,.18)">
    <span data-lmax="${LMW},${LMH}" data-larea="${LA}" style="display:block;width:${lg.w}px;height:${lg.h}px"><img src="${lg.src}" crossorigin="anonymous" onload="window.__PICK&&__PICK.logo(this)" onerror="this.parentNode.style.display='none';window.__PICK&&__PICK.logoFail(this)" style="display:block;width:${lg.w}px;height:${lg.h}px;object-fit:contain"></span>
    <div data-ltype style="font:${e.dw} ${tSize}px/1.08 ${DF};color:#fbf6ea;text-align:center;padding:0 20px;text-transform:uppercase;width:${RW-44}px;${clamp(3)};display:none">${esc(title)}</div>
    <div data-pk style="position:absolute;right:10px;bottom:6px;font:700 14px/1 ${BF};letter-spacing:.2em;color:${mix(acc,"#ffffff",.6)}">${esc(year)}</div></div>`
    :`<div style="position:relative;height:120px;background:${panelDark};display:flex;align-items:center;justify-content:center;border-bottom:5px solid ${acc};flex:none">
       <div style="font:${e.dw} ${tSize}px/1.08 ${DF};color:#fbf6ea;text-align:center;padding:0 20px;text-transform:uppercase;${clamp(3)}">${esc(title)}</div>
    <div style="position:absolute;right:10px;bottom:6px;font:700 14px/1 ${BF};letter-spacing:.2em;color:${mix(acc,"#ffffff",.6)}">${esc(year)}</div></div>`;
  /* signature: the scoreboard, set in type */
  const C=[["s",e.cols[0]],["m",e.cols[1]],["w",e.cols[2]],["d",e.cols[3]]].filter(([k])=>(ctx.menu[k]||[]).length);
  const items={};C.forEach(([k])=>items[k]=(ctx.menu[k]||[]).slice(0,4));
  const total=C.reduce((a,[k])=>a+items[k].length,0);
  /* the board suits the event: a race card, a fight, a golf round, an expo hall or a concert set instead of innings (flavour sport) */
  const SB={team:["Stand","Home","Guests","T","Att"],race:["Race","Starters","Scratched","T","Crowd"],fight:["Round","Red corner","Blue corner","T","Crowd"],golf:["Hole","Strokes","Par","T","Gallery"],expo:["Hall","On show","Sold out","T","Visitors"],concert:["Set","Songs","Encores","T","Crowd"]}[(ctx.flavour||{}).sport]||["Stand","Home","Guests","T","Att"];
  const B={manual:{bg:"#24432f",cell:"#183022",dig:"#f4f1e6",lab:"#f4f1e6",glow:"none",font:DF},
           bulb:{bg:"#141210",cell:"#060505",dig:"#ffb347",lab:"#f3e2c4",glow:"0 0 6px rgba(255,170,60,.85)",font:DF},
           led:{bg:"#0b0b0b",cell:"#000",dig:"#ff4433",lab:"#f2f2f2",glow:"0 0 6px rgba(255,60,40,.8)",font:DF},
           video:{bg:"linear-gradient(#0d1a3a,#05080f)",cell:"rgba(255,255,255,.06)",dig:"#ffffff",lab:"#cfd8e6",glow:`0 0 8px ${acc}`,font:DF}}[e.board];
  const cellBg=e.board==="led"?`${B.cell} radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.5px) 0 0/5px 5px`:B.cell;
  const cell=(v,wd)=>`<div style="flex:0 0 ${wd||46}px;height:46px;display:flex;align-items:center;justify-content:center;background:${cellBg};font:${e.dw} 30px/1 ${B.font};color:${B.dig};text-shadow:${B.glow}">${v}</div>`;
  const lab=(v)=>`<div style="flex:1;font:700 18px/1 ${BF};letter-spacing:.14em;color:${B.lab};text-transform:uppercase">${v}</div>`;
  const hdr=`<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">${lab(SB[0])}${[1,2,3,4].map(n=>`<div style="flex:0 0 46px;text-align:center;font:700 16px/1 ${BF};color:${B.lab}">${n}</div>`).join("")}<div style="flex:0 0 60px;text-align:center;font:700 16px/1 ${BF};color:${B.lab}">${SB[3]}</div></div>`;
  const cnt=k=>items[k]?items[k].length:"";
  const board=`<div style="background:${B.bg};padding:14px 16px 12px;border:${e.board==="manual"?"6px solid #1a3022":"4px solid #2a2a2a"};box-shadow:0 4px 12px rgba(0,0,0,.35);flex:none">
    ${hdr}
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">${lab(SB[1])}${["s","m","w","d"].map(k=>cell(cnt(k))).join("")}${cell(total,60)}</div>
    <div style="display:flex;gap:6px;align-items:center">${lab(SB[2])}${[0,0,0,0].map(v=>cell(v)).join("")}${cell(0,60)}</div>
    <div style="display:flex;justify-content:space-between;margin-top:9px;font:700 15px/1.2 ${BF};letter-spacing:.14em;color:${B.lab};text-transform:uppercase"><span>${SB[4]} ${esc(num.slice(0,6))}</span><span>Now serving: ${esc(C[0]?C[0][1]:"Snacks")}</span></div></div>`;
  /* ticket */
  const sec=(num+"101").slice(0,3),row=(title.replace(/[^A-Z]/gi,"").charAt(0)||"A").toUpperCase(),seat=String(total||1);
  const ticket=`<div style="display:flex;transform:rotate(${t.tilt*.5}deg);background:${darkPaper?"#f2efe6":mix(paper,"#ffffff",.55)};box-shadow:0 3px 10px rgba(0,0,0,.3);border-top:6px solid ${acc};flex:none">
    <div style="flex:1;padding:12px 16px;min-width:0">
      ${kick("Admit one",acc,14)}
      <div style="font:${e.dw} 26px/1.05 ${DF};color:#15171c;margin:4px 0 4px;text-transform:uppercase;${clamp(2)}">${esc(prop.title)}</div>
      ${(prop.lines||[]).slice(0,2).map(l=>`<div style="font:400 16px/1.25 ${BF};color:#3a3d44;${clamp(1)}">${esc(l)}</div>`).join("")}</div>
    <div style="flex:0 0 132px;border-left:3px dashed ${mix("#15171c","#ffffff",.6)};padding:12px 12px;display:flex;flex-direction:column;justify-content:center;gap:4px">
      ${[["Sec",sec],["Row",row],["Seat",seat]].map(([a,b])=>`<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:700 14px/1 ${BF};letter-spacing:.14em;color:#5a5d66;text-transform:uppercase">${a}</span><span style="font:${e.dw} 24px/1 ${DF};color:#15171c">${esc(b)}</span></div>`).join("")}</div></div>`;
  const right=`<div style="position:absolute;left:${HX+30}px;width:${RW}px;top:26px;bottom:22px;display:flex;flex-direction:column;justify-content:space-between">
    <div>${kick(sign,acc,15)}<div style="font:${e.dw} ${vSize}px/1.05 ${DF};color:${ink};margin-top:6px;text-transform:uppercase;${clamp(2)}">${esc(venue)}</div></div>
    ${logo}${board}${ticket}
    <div style="display:flex;justify-content:space-between;font:400 15px/1.2 ${BF};color:${soft}"><span>Concession Scorecard</span><span>Form SC-${esc(num.slice(-4))}</span></div></div>`;
  const front=`<div style="position:absolute;inset:0;background:${paper};overflow:hidden">${tex()}${hero}${right}</div>`;

  /* ---------- BACK: section map of stills, concessions ---------- */
  const MX=660;
  let pool=stills.slice(0,4);
  let srcs=pool.map(s=>ctx.img(s,"w780"));if(srcs.length<4&&poster)srcs.push(ctx.img(poster,"w780"));
  const pSrc=poster?ctx.img(poster,"w780"):"";
  const n=srcs.length>=4?4:srcs.length>=2?2:srcs.length;
  const gx=28,gy=96,gw=MX-gx-24,gh=H-gy-30,gap=12;
  const tiles=[];
  for(let i=0;i<n;i++){const tw=n===4?(gw-gap)/2:gw,th=n===1?gh:(gh-gap)/2,x=gx+(n===4?(i%2)*(tw+gap):0),y=gy+(n===4?Math.floor(i/2)*(th+gap):n===2?i*(th+gap):0);
    tiles.push(`<div style="position:absolute;left:${x}px;top:${y}px;width:${tw}px;height:${th}px;overflow:hidden;background:#222;outline:3px solid ${acc}">${srcs[i]===pSrc?`<img src="${pSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">`:photo(srcs[i],pf,"center 35%",overlay(),[],pSrc)}
      <div style="position:absolute;left:0;top:0;background:${band};color:${bandText};font:${e.dw} 20px/1 ${DF};padding:8px 12px;letter-spacing:.04em">SEC ${100+(i+1)}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;padding:24px 12px 8px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.7));font:700 15px/1.2 ${BF};letter-spacing:.14em;text-transform:uppercase;color:#fbf6ea">${e.secs[i]}</div></div>`)}
  const mapHead=`<div style="position:absolute;left:${gx}px;top:26px;width:${gw}px">${kick(t.gate,acc,15)}<div style="font:${e.dw} 38px/1.05 ${DF};color:${ink};margin-top:4px;text-transform:uppercase">Section Map</div></div>`;
  /* menu */
  const CX=MX+30,CWall=W-CX-34,colGap=26;
  const pr=prices(items,e,ei,egg);
  const mTop=118,noteH=winks.length?186:150,menuH=H-mTop-noteH-26;
  const tiers=[{d:30,n:22,g:18,h:32,nl:2},{d:28,n:21,g:16,h:30,nl:2},{d:26,n:19,g:14,h:26,nl:2},{d:24,n:18,g:11,h:24,nl:2},{d:22,n:17,g:9,h:22,nl:1},{d:21,n:16,g:7,h:21,nl:1},{d:20,n:15,g:6,h:20,nl:0},{d:18,n:14,g:5,h:18,nl:0}];
  let dmax=3;const priceW=d=>d*2.4+8;
  let CW=(CWall-colGap)/2;
  const cH=(tr,k)=>tr.h*1.3+14+items[k].reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),e.cwd));const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g},0);
  /* best split of the courses into two columns, in order; one wide column when that fits bigger type */
  const split=tr=>{let best=null;for(let s=1;s<=C.length;s++){const a=C.slice(0,s).reduce((x,[k])=>x+cH(tr,k),0),b=C.slice(s).reduce((x,[k])=>x+cH(tr,k),0),m=Math.max(a,b);if(!best||m<best.m)best={s,m}}return best};
  let tr=tiers[tiers.length-1],sp=null,one=false;
  for(const x of tiers){CW=CWall;const h1=C.reduce((a,[k])=>a+cH(x,k),0);if(h1*1.04<=menuH){tr=x;sp={s:C.length,m:h1};one=true;break}
    CW=(CWall-colGap)/2;const q=split(x);if(q.m*1.04<=menuH){tr=x;sp=q;break}}
  if(!sp){dmax=2;CW=(CWall-colGap)/2;sp=split(tr)}
  const cgap=14+Math.min(30,Math.max(0,menuH-sp.m*1.04)/3);
  const head=l=>{
    if(e.bar==="grid")return `<div style="border:2px solid ${ink};padding:4px 10px;font:${e.dw} ${tr.h}px/1.1 ${DF};color:${ink};margin-bottom:8px;text-transform:uppercase;display:flex;justify-content:space-between"><span>${l}</span><span style="color:${acc};font-size:max(14px,.7em)">No. ${esc(num.slice(-2))}</span></div>`;
    if(e.bar==="pill")return `<div style="display:inline-block;background:${acc};color:${paper};border-radius:999px;padding:4px 16px;font:${e.dw} ${tr.h}px/1.1 ${DF};margin-bottom:8px;text-transform:uppercase">${l}</div>`;
    if(e.bar==="skew")return `<div style="display:inline-block;background:${band};color:${bandText};transform:skewX(-12deg);padding:3px 16px;margin-bottom:8px;border-left:8px solid ${acc}"><div style="transform:skewX(12deg);font:${e.dw} ${tr.h}px/1.1 ${DF};text-transform:uppercase">${l}</div></div>`;
    return `<div style="font:${e.dw} ${tr.h}px/1.1 ${DF};color:${acc};text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid ${acc};padding-bottom:4px;margin-bottom:8px;text-shadow:0 0 10px ${acc}">${l}</div>`;
  };
  const course=([k,l])=>`<div style="margin-bottom:${cgap}px">${head(l)}${items[k].map((it,i)=>{const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return `<div style="margin-bottom:${tr.g}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span style="flex:1;font:700 ${tr.d}px/1.15 ${BF};color:${ink};${clamp(dmax)}">${esc(tx(it.n))}</span><span style="font:${e.dw} ${tr.d}px/1.15 ${DF};color:${acc};white-space:nowrap">${pr[k][i]}</span></div>
      ${nl?`<div style="font:400 ${tr.n}px/1.3 ${BF};color:${soft};margin-top:3px;${clamp(nl)}">${esc(cap(tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
  const colA=C.slice(0,sp.s).map(course).join(""),colB=C.slice(sp.s).map(course).join("");
  const menuHead=`<div style="position:absolute;left:${CX}px;width:${CWall}px;top:26px">${kick(t.hawk,acc,15)}<div style="font:${e.dw} 44px/1.05 ${DF};color:${ink};margin-top:4px;text-transform:uppercase">Concessions</div></div>`;
  const menu=`<div style="position:absolute;left:${CX}px;width:${CWall}px;top:${mTop}px;height:${menuH}px;display:flex;gap:${colGap}px;overflow:hidden"><div style="flex:0 0 ${CW}px">${colA}</div>${one?"":`<div style="flex:0 0 ${CW}px">${colB}</div>`}</div>`;
  const nLen=clean(note.text).length,nSize=nLen>120?18:20;
  const noteBox=`<div style="position:absolute;left:${CX}px;width:${CWall}px;bottom:24px;border-top:3px solid ${acc};padding-top:10px">
    <div style="display:flex;gap:18px;align-items:flex-end"><div style="flex:1;font:italic 400 ${nSize}px/1.34 ${BF};color:${ink};${clamp(3)}">"${esc(note.text)}"</div>
    <div style="flex:none;font:400 ${ei<2?38:34}px/1 ${SF};color:${acc};max-width:230px;text-align:right">${esc(note.by)}</div></div>
    ${winks.length?`<div style="font:400 15px/1.3 ${BF};color:${soft};margin-top:8px;${clamp(1)}">On the big screen tonight: ${esc(winks.slice(0,2).join(". "))}.</div>`:""}
    <div style="font:400 15px/1.3 ${BF};color:${soft};margin-top:4px">Prices subject to change.${fam?" All drinks alcohol free.":""} ${esc(title.length>40?"":title+", "+year+". ")}Images: TMDB.</div></div>`;
  const back=`<div style="position:absolute;inset:0;background:${paper};overflow:hidden">${tex()}${mapHead}${tiles.join("")}<div style="position:absolute;left:${MX}px;top:30px;bottom:30px;width:2px;background:${mix(ink,paper,.7)}"></div>${menuHead}${menu}${noteBox}</div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
