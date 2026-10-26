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
   a pixel is lost when it would read under 3:1 on that stock; ties and mid tones stay on dark with a soft halo */
P.logo=img=>{
  const wrap=img.parentNode;
  try{const mx=(wrap.dataset.lmax||"300,110").split(",").map(Number),A=+wrap.dataset.larea||mx[0]*mx[1]*.5;
    const g=grab(img,Math.min(360,img.naturalWidth||360)),w=g.w,h=g.h,d=g.d;let x0=w,y0=h,x1=-1,y1=-1,dk=0,lt=0;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>28){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
      if(d[i+3]>128){const lin=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)},Y=.2126*lin(d[i])+.7152*lin(d[i+1])+.0722*lin(d[i+2]);if(Y<.124)dk++;if(Y>.277)lt++}}
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
/* Format: prom. A school dance or party night card, two faces 600x900.
   Front: gym banner with the venue sign, big hero still with the film logo on a panel, admit one ticket, a note with a script signature.
   Back: photo booth strip of stills down the left, the menu, showtime cue and fine print on the right.
   Era sets type pairing, paper stock, print process, banner shape, photo frame and booth strip tint.
   Tone sets wear, tilt, contrast, photo mood and the copy voice.
   Fonts (fmt-prom in wip/print/FONTS.md): Chonburi, Leckerli One, Chicle, Sonsie One, Russo One, Bowlby One, Permanent Marker, Unbounded.
   Bodies Libre Baskerville, Karla, Josefin Sans, Cabin, Montserrat, Archivo, Archivo Narrow, Manrope; signatures Pinyon Script, Caveat. */
(function(){
const W=600,H=900,ID="prom";
if(!document.getElementById("fmt-prom-fonts")){
  const l=document.createElement("link");l.id="fmt-prom-fonts";l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Chonburi&family=Leckerli+One&family=Chicle&family=Sonsie+One&family=Russo+One&family=Bowlby+One&family=Permanent+Marker&family=Unbounded:wght@800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Karla:ital,wght@0,500;0,800;1,500&family=Josefin+Sans:ital,wght@0,500;0,700;1,500&family=Cabin:ital,wght@0,500;0,700;1,500&family=Montserrat:ital,wght@0,500;0,800;1,500&family=Archivo:ital,wght@0,500;0,800;1,500&family=Archivo+Narrow:ital,wght@0,500;0,700;1,500&family=Manrope:wght@500;800&family=Pinyon+Script&family=Caveat:wght@700&display=swap";
  /* warm every face as soon as the sheet lands, so menu fitting measures with real metrics */
  l.onload=()=>{try{["Chonburi", "Leckerli One", "Chicle", "Sonsie One", "Russo One", "Bowlby One", "Permanent Marker", "Unbounded", "Libre Baskerville", "Karla", "Josefin Sans", "Cabin", "Montserrat", "Archivo", "Archivo Narrow", "Manrope", "Pinyon Script", "Caveat"].forEach(f=>{document.fonts.load(`800 20px "${f}"`);document.fonts.load(`500 20px "${f}"`);document.fonts.load(`italic 500 20px "${f}"`)})}catch(e){}};
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
const clip=(s,n)=>{s=clean(s);if(s.length<=n)return s;const p=s.split(/[,;:.]/)[0].trim();return p.length<=n&&p.length>=12?p:""};
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

/* ---------- era: type pairing, paper, process, frames ---------- */
const ERA={
 "1930s-40s":{disp:"Chonburi",dcw:.66,body:"Libre Baskerville",bcw:.56,sig:"Pinyon Script",paper:"#efe3c6",ink:"#2b2016",band:"#6e1c28",proc:"letterpress",kick:"FORMAL DINNER DANCE",photo:"sepia(.28) contrast(1.04)",booth:"grayscale(1) sepia(.45) contrast(1.05)",frame:"deckle",radius:0,menu:"Bill of Fare"},
 "1950s":{disp:"Leckerli One",dcw:.56,body:"Karla",bcw:.52,sig:"Pinyon Script",paper:"#f8e3e1",ink:"#2c2230",band:"#c43a52",proc:"letterpress",kick:"SOCK HOP",photo:"sepia(.12) saturate(.95)",booth:"grayscale(1) sepia(.25)",frame:"round",radius:14,menu:"Snack Bar"},
 "1960s":{disp:"Chicle",dcw:.45,body:"Josefin Sans",bcw:.52,sig:"Caveat",paper:"#dcefe4",ink:"#173a31",band:"#1f6b5a",proc:"offset",kick:"SPRING FORMAL",photo:"saturate(1.12) contrast(1.02)",booth:"grayscale(1) contrast(1.1)",frame:"white",radius:4,menu:"Refreshments"},
 "1970s":{disp:"Sonsie One",dcw:.82,body:"Cabin",bcw:.52,sig:"Caveat",paper:"#f2d7a0",ink:"#46270f",band:"#a8461a",proc:"offset",kick:"SENIOR PROM",photo:"sepia(.25) saturate(1.1) contrast(.97)",booth:"grayscale(1) sepia(.3)",frame:"round",radius:22,menu:"Buffet"},
 "1980s":{disp:"Russo One",dcw:.64,body:"Montserrat",bcw:.58,sig:"Caveat",paper:"#16111c",ink:"#f6eef8",band:"#2a1838",proc:"glossy",kick:"PROM NIGHT",photo:"contrast(1.08) saturate(1.22)",booth:"saturate(1.15) contrast(1.05)",frame:"neon",radius:0,menu:"Dinner"},
 "1990s":{disp:"Bowlby One",dcw:.72,body:"Archivo",bcw:.55,sig:"Caveat",paper:"#fbfaf5",ink:"#18181b",band:"#1d2a6b",proc:"laser",kick:"SPRING FLING",photo:"contrast(1.05) saturate(1.08)",booth:"grayscale(1) contrast(1.15)",frame:"thin",radius:0,menu:"Food"},
 "2000s":{disp:"Permanent Marker",dcw:.62,body:"Archivo Narrow",bcw:.47,sig:"Caveat",paper:"#f3f3ee",ink:"#121212",band:"#111111",proc:"photocopy",kick:"THE PARTY",photo:"contrast(1.12) saturate(1.04)",booth:"grayscale(1) contrast(1.35) brightness(1.08)",frame:"copy",radius:0,menu:"The Spread"},
 "modern":{disp:"Unbounded",dcw:.74,body:"Manrope",bcw:.56,sig:"Caveat",paper:"#ffffff",ink:"#141418",band:"#141418",proc:"clean",kick:"FORMAL",photo:"saturate(1.05)",booth:"saturate(1.05)",frame:"none",radius:18,menu:"Menu"}
};
/* ---------- tone: wear, tilt, mood, voice ---------- */
const TONE={
 gritty:{wear:.8,tilt:-2.2,photo:"contrast(1.14) saturate(.86)",kick:"NO REFUNDS AT THE DOOR",ticket:"No re entry",close:"Security on the door all night."},
 glossy:{wear:.08,tilt:0,photo:"saturate(1.1) brightness(1.03)",kick:"AN EVENING OF ELEGANCE",ticket:"Black tie",close:"Photographs available from the front office."},
 warm:{wear:.35,tilt:-1.2,photo:"sepia(.08) saturate(1.05)",kick:"COME AS YOU ARE",ticket:"Bring a friend",close:"Thank you to every parent who baked."},
 eerie:{wear:.5,tilt:1.4,photo:"saturate(.8) contrast(1.1)",kick:"A NIGHT NO ONE WILL FORGET",ticket:"Doors lock at midnight",close:"Please stay in the gym after dark."},
 playful:{wear:.22,tilt:-3,photo:"saturate(1.2) brightness(1.03)",kick:"WEAR YOUR DANCING SHOES",ticket:"Dancing compulsory",close:"Best moves win the spot prize."},
 grand:{wear:.14,tilt:0,photo:"contrast(1.06)",kick:"THE EVENT OF THE YEAR",ticket:"Formal dress",close:"The committee thanks you for your attendance."},
 tender:{wear:.3,tilt:-1,photo:"brightness(1.04) saturate(.95)",kick:"SAVE ME THE LAST DANCE",ticket:"Keep this one",close:"Slow dance at eleven."},
 tense:{wear:.45,tilt:1,photo:"contrast(1.16)",kick:"DOORS CLOSE AT MIDNIGHT",ticket:"Chaperones present",close:"No one leaves before the last song."},
 scrappy:{wear:.9,tilt:-3.5,photo:"contrast(1.12)",kick:"PARENTS NOT INVITED",ticket:"Tell no one",close:"If the cops come, you were never here."}
};
const SEC={s:"Before the Dance",m:"The Main Event",w:"Last Dance Sweets",d:"The Punch Bowl"};

/* grain: real noise texture (svg turbulence), fine fibre plus sparse speckle */
const grain=(a,light,freq,sparse)=>{const c=light?"1 ":"0.22 ",k=sparse?(9*a).toFixed(3):(1.4*a).toFixed(3),o=sparse?(-5.6*a).toFixed(3):(-.35*a).toFixed(3);
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${sparse?7:3}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} ${k} 0 0 0 ${o}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return `url(&quot;data:image/svg+xml,${encodeURIComponent(svg)}&quot;)`};
/* paper: base stock, vignette and grain scaled by wear, plus the print process */
function paper(E,T){
  const dk=lum(rgb(E.paper))<.2,w=T.wear;
  const L=[`radial-gradient(ellipse at 50% 45%,transparent 55%,${dk?"rgba(0,0,0,"+(.25+.35*w)+")":"rgba(90,60,25,"+(.08+.26*w)+")"} 100%)`,
    grain(.1+.12*w,dk,.9,false),grain(.12+.2*w,dk,.55,true)];
  if(E.proc==="letterpress")L.push(`repeating-linear-gradient(90deg,rgba(80,60,30,.022) 0 1px,transparent 1px 4px)`);
  if(E.proc==="glossy")L.push(`linear-gradient(128deg,rgba(255,255,255,.09),transparent 38%,rgba(255,255,255,.05) 62%,transparent 80%)`);
  if(E.proc==="photocopy")L.push(`linear-gradient(90deg,rgba(0,0,0,${.1+.12*w}),transparent 5%,transparent 95%,rgba(0,0,0,${.1+.12*w}))`,grain(.2+.15*w,false,1.4,true));
  if(E.proc==="offset")L.push(`linear-gradient(180deg,rgba(255,255,255,.12),transparent 30%,rgba(0,0,0,.03))`);
  if(E.proc==="clean")L.push(`linear-gradient(160deg,rgba(0,0,0,.015),transparent)`);
  return L.join(",")+`,${E.paper}`;
}

/* a real photo (still or poster); posters sit contained over a blurred copy of themselves */
function photo(src,w,h,o){
  o=o||{};const f=o.filter||"none";
  if(!src)return `<div style="width:${w}px;height:${h}px;background:linear-gradient(160deg,#333,#111)"></div>`;
  const inner=o.poster
    ?`<img src="${src}" alt="" style="position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(14px) brightness(.55) ${f}">
      <img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;filter:${f}">`
    :`<img src="${src}" alt="" crossorigin="anonymous" data-pick data-alts="${(o.alts||[]).join("|")}" data-last="${o.last||""}" onload="window.__PICK&&__PICK.still(this)" onerror="window.__PICK&&__PICK.fail(this)" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${o.pos||"50% 40%"};filter:${f}">`;
  const dots=o.halftone?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.5) 28%,transparent 32%) 0 0/3px 3px;mix-blend-mode:multiply;opacity:.14"></div>`:"";
  return `<div ${o.safe?`data-safe='${o.safe}'`:""} style="position:relative;width:${w}px;height:${h}px;overflow:hidden;border-radius:${o.radius||0}px;background:#111">${inner}${dots}<div style="position:absolute;inset:0;box-shadow:inset 0 0 ${o.vig||30}px rgba(0,0,0,.25)"></div>${o.extra||""}</div>`;
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm;
  const fam=FAMILY.has(f.theme),C=s=>fam?dry(clean(s)):clean(s);
  const year=String(f.year||"").slice(0,4)||"1999",yy=year.slice(-2);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature");
  const venue=C(fl.venue)||"The School Gym";
  const sign=C(fl.sign)||venue;
  const note={text:C(fl.note&&fl.note.text)||sentence(f.T)||"Thanks for coming. Eat up, then everyone on the dance floor.",by:C(fl.note&&fl.note.by)||"The Dance Committee"};
  const winks=(fl.winks||[]).map(C).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?{title:C(fl.prop.title),lines:(fl.prop.lines||[]).map(C).filter(Boolean).slice(0,2)}:{title:"Dance Ticket",lines:["Doors open at seven","Supper served at nine"]};
  const num=String(fl.number||"").replace(/\D/g,"")||year;
  const poster=ctx.poster||(typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id])||null;
  const img=ctx.img||((p,s)=>p?`https://image.tmdb.org/t/p/${s||"w1280"}${p}`:"");
  const stills=(ctx.stills||[]).slice();
  const hero=stills[0]?{src:img(stills[0],"w1280"),poster:false}:{src:img(poster,"w780"),poster:true};
  const booth=[];for(let i=0;i<4;i++){const s=stills.length>1?stills[(i+1)%stills.length]:null;booth.push(s?{src:img(s,"w780"),poster:false}:{src:img(poster,"w500"),poster:true})}

  /* colour: film palette for accents, checked against this era's paper */
  const P=ctx.palette||{},dkPaper=lum(rgb(E.paper))<.2;
  let acc=rgb(P.accent)&&sat(P.accent)>.18?P.accent:E.band;
  const ACC=fit(acc,E.paper,E.ink,3.2);
  let band=rgb(P.accent)?P.accent:E.band;band=dkPaper?fit(band,"#ffffff","#ffffff",1)&&mix(band,"#000000",.35):band;
  const bandText=dkPaper?"#ffffff":E.paper;
  band=fit(band,bandText,E.band,4.6);
  const DARK=rgb(P.dark)&&lum(rgb(P.dark))<.06?P.dark:"#141414";
  const ink=E.ink,soft=rgba(ink,.72);
  const bg=paper(E,T);
  const photoF=`${E.photo} ${T.photo}`;
  const disp=`'${E.disp}',sans-serif`,body=`'${E.body}',sans-serif`,sig=`'${E.sig}',cursive`;
  const caps=(z,c,ls=.18)=>`font:800 ${z}px/1.2 ${body};letter-spacing:${ls}em;text-transform:uppercase;color:${c}`;
  const fp=E.proc==="glossy"?`text-shadow:0 0 14px ${rgba(ACC,.55)}`:E.proc==="letterpress"?`text-shadow:0 0 .7px ${rgba(ink,.6)}`:"";

  /* ===== FRONT ===== */
  const BH=172,SY=BH,SH=440;
  /* gym banner: shape follows the era */
  const kick=`${E.kick}, CLASS OF ${year}`;
  const sT=fitType(sign,W-96,92,E.dcw,56,24,1.04,2);
  let banner;
  const signHtml=`<div style="${caps(18,E.proc==="letterpress"||E.proc==="offset"?mix(bandText,band,.15):ACC==band?bandText:bandText,.22)};text-align:center">${esc(kick)}</div>
     <div style="font:${E.disp==="Unbounded"?"800 ":""}${sT.z}px/1.04 ${disp};color:${bandText};text-align:center;margin-top:8px;${E.proc==="glossy"?`text-shadow:0 0 18px ${rgba(ACC,.7)},0 0 2px #fff`:""}">${esc(sign)}</div>`;
  if(E.frame==="deckle"){ /* felt pennant banner, double rule, letterpress */
    banner=`<div style="position:absolute;left:18px;top:18px;width:${W-36}px;height:${BH-30}px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18)),repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 5px),${band};border:3px double ${E.paper};outline:2px solid ${band};box-shadow:0 3px 8px rgba(0,0,0,.25);display:flex;flex-direction:column;justify-content:center;padding:0 28px;box-sizing:border-box">${signHtml}</div>`;
  }else if(E.proc==="photocopy"){ /* marker band on copy paper, a bit crooked */
    banner=`<div style="position:absolute;left:10px;top:20px;width:${W-20}px;height:${BH-36}px;transform:rotate(${T.tilt*.4}deg);background:linear-gradient(175deg,rgba(255,255,255,.07),rgba(0,0,0,.1)),${band};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box;box-shadow:0 0 0 2px ${rgba(band,.4)}">${signHtml}</div>`;
  }else if(E.proc==="glossy"){ /* foil banner with a sheen */
    banner=`<div style="position:absolute;left:0;top:0;width:${W}px;height:${BH}px;background:linear-gradient(170deg,rgba(255,255,255,.18),transparent 45%,rgba(255,255,255,.08) 70%,transparent),${band};border-bottom:3px solid ${ACC};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box">${signHtml}</div>`;
  }else{ /* crepe paper banner hung across the gym, swag edge from the photo border */
    banner=`<div style="position:absolute;left:0;top:0;width:${W}px;height:${BH}px;background:linear-gradient(180deg,rgba(255,255,255,.14),transparent 40%,rgba(0,0,0,.14)),repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 3px,rgba(0,0,0,.05) 3px 7px),${band};border-radius:${E.radius?`0 0 ${E.radius*2}px ${E.radius*2}px`:"0"};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box">${signHtml}</div>`;
  }
  /* logo in its own colours plus the now showing line, one panel inside the photo, parked on the side with the least face */
  let logoHtml;const LG=ctx.logo;
  const panelBg=rgba(DARK,.86);
  const nowLine=`<div data-pk style="${caps(15,"#ffffff",.16)};margin-top:10px;white-space:nowrap">Now showing, ${esc(year)}</div>`;
  const pr=Math.min(E.radius,10);
  if(LG&&LG[0]&&LG[1]&&LG[2]){
    const a=LG[1]/LG[2];let lh=Math.min(120,Math.sqrt(21000/a)),lw=lh*a;if(lw>320){lw=320;lh=lw/a}
    const tT=fitType(title,300,124,E.dcw,40,20,1.06,3);
    logoHtml=`<div data-sp="logo" data-lpanel data-dark="${panelBg}" data-light="rgba(251,249,243,.95)" data-lightink="#2a2420" data-type="${panelBg}" style="position:absolute;left:16px;bottom:16px;max-width:${W-120}px;padding:14px 18px 12px;background:${panelBg};border-radius:${pr}px;box-shadow:0 4px 14px rgba(0,0,0,.35)">
      <span data-lmax="320,120" data-larea="21000" style="display:block;width:${Math.round(lw)}px;height:${Math.round(lh)}px"><img src="${img(LG[0],"w500")}" crossorigin="anonymous" alt="${esc(title)}" onload="window.__PICK&&__PICK.logo(this)" onerror="window.__PICK&&__PICK.logoFail(this)" style="display:block;width:${Math.round(lw)}px;height:${Math.round(lh)}px;object-fit:contain;filter:drop-shadow(0 0 1.5px rgba(255,255,255,.45))"></span>
      <div data-ltype style="display:none;width:300px;font:${E.disp==="Unbounded"?"800 ":""}${tT.z}px/1.06 ${disp};color:#ffffff">${esc(title)}</div>${nowLine}</div>`;
  }else{
    const tT=fitType(title,300,124,E.dcw,46,20,1.06,4);
    logoHtml=`<div data-sp="logo" style="position:absolute;left:16px;bottom:16px;width:300px;padding:14px 18px 12px;background:${panelBg};border-radius:${pr}px;box-shadow:0 4px 14px rgba(0,0,0,.35)"><div style="font:${E.disp==="Unbounded"?"800 ":""}${tT.z}px/1.06 ${disp};color:#ffffff">${esc(title)}</div>${nowLine}</div>`;
  }
  /* hero still with era frame */
  const fr={deckle:`border:12px solid #f7f0dc;box-shadow:0 2px 8px rgba(0,0,0,.3)`,round:`border:9px solid #fffaf2;box-shadow:0 3px 10px rgba(0,0,0,.25)`,white:`border:8px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,.2)`,neon:`border:3px solid ${ACC};box-shadow:0 0 18px ${rgba(ACC,.6)}`,thin:`border:2px solid ${ink}`,copy:`border:3px solid #111`,none:``}[E.frame];
  const inset=E.frame==="none"||E.proc==="glossy"?0:20;
  const hw=W-inset*2,hh=SH-(inset?12:0);
  const bw={deckle:12,round:9,white:8,neon:3,thin:2,copy:3,none:0}[E.frame];
  const heroHtml=`<div style="position:absolute;left:${inset}px;top:${SY+(inset?4:0)}px;width:${hw}px;height:${hh}px;box-sizing:border-box;${fr};border-radius:${E.radius}px;overflow:hidden;${inset&&T.tilt&&E.proc!=="clean"?`transform:rotate(${(T.tilt*.25).toFixed(2)}deg)`:""}">
      ${photo(hero.src,hw-bw*2,hh-bw*2,{filter:photoF,poster:hero.poster,halftone:E.proc==="offset",radius:Math.max(0,E.radius-bw),pos:"50% 35%",alts:stills.slice(5,8).map(s=>img(s,"w1280")),last:poster?img(poster,"w780"):"",extra:logoHtml,
        safe:JSON.stringify({pos:[[50,35],[50,20],[32,35],[68,35],[50,55]],items:[{q:"[data-sp=logo]",c:[["l",16,"b",16],["r",16,"b",16],["l",16,"t",16],["r",16,"t",16]]}]})})}</div>`;
  /* ticket prop: admit one with a perforated stub */
  const ty=SY+SH+22,tw=262,th=196;
  const pT=fitType(prop.title,tw-86,60,E.dcw,30,18,1.05,2);
  const ticket=`<div style="position:absolute;left:22px;top:${ty}px;width:${tw}px;height:${th}px;transform:rotate(${(T.tilt*.8).toFixed(2)}deg);background:linear-gradient(160deg,rgba(255,255,255,.35),transparent 50%),${dkPaper?"#f3ecd9":mix(E.paper,ACC,.12)};border:2px solid ${ACC};box-shadow:0 3px 9px rgba(0,0,0,.22);display:flex;color:#231d18">
      <div style="flex:1;padding:14px 14px 10px 16px;display:flex;flex-direction:column;gap:5px;overflow:hidden">
        <div style="${caps(15,fit(ACC,"#f3ecd9","#5a2a1a",3.2),.2)}">Admit one</div>
        <div style="font:${E.disp==="Unbounded"?"800 ":""}${pT.z}px/1.05 ${disp};color:#1e1a16">${esc(prop.title)}</div>
        ${prop.lines.map(l=>`<div style="font:500 16px/1.25 ${body};color:#3a322a">${esc(trunc(l,44))}</div>`).join("")}
        <div style="margin-top:auto;font:700 15px/1.2 ${body};color:#3a322a">${esc(T.ticket)}</div></div>
      <div style="width:58px;border-left:2px dashed ${rgba("#231d18",.45)};display:flex;align-items:center;justify-content:center">
        <div style="transform:rotate(-90deg);white-space:nowrap;font:800 17px/1 ${body};letter-spacing:.12em;color:#231d18">No. ${esc(num.padStart(4,"0"))}</div></div></div>`;
  /* note with script signature */
  const nx=306,nw=W-nx-22;
  const nT=fitType(note.text,nw-8,150,E.bcw,21,16,1.36,6);
  const noteHtml=`<div style="position:absolute;left:${nx}px;top:${ty-4}px;width:${nw}px;color:${ink}">
      <div style="${caps(15,ACC,.2)};margin-bottom:8px">${esc(T.kick)}</div>
      <div style="font:italic 500 ${nT.z}px/1.36 ${body};color:${ink}">"${esc(note.text)}"</div>
      <div style="font:${E.sig==="Caveat"?"700 ":""}${E.sig==="Caveat"?36:38}px/1.1 ${sig};color:${ACC};margin-top:6px;text-align:right">${esc(trunc(note.by,24))}</div></div>`;
  /* fine print with winks */
  let fine=`${T.close} ${winks.length?"Tonight: "+winks.slice(0,1).map(s=>trunc(s,50)).join("")+".":""}`;
  const frontFine=`<div style="position:absolute;left:24px;right:24px;bottom:16px;font:500 15px/1.3 ${body};color:${soft}">${esc(trunc(fine,96))}</div>`;
  const front=`<div style="position:absolute;inset:0;background:${bg};${fp}">${banner}${heroHtml}${ticket}${noteHtml}${frontFine}</div>`;

  /* ===== BACK ===== */
  const SX=18,SW=176,STY=18,STH=H-36;
  const fh=Math.floor((STH-16-44-3*8)/4);
  const strip=`<div style="position:absolute;left:${SX}px;top:${STY}px;width:${SW}px;height:${STH}px;background:linear-gradient(180deg,#ffffff,#f1efe9);box-shadow:0 3px 10px rgba(0,0,0,.28);transform:rotate(${(T.tilt*.35).toFixed(2)}deg);padding:8px 8px 0;box-sizing:border-box">
      ${booth.map(b=>`<div style="margin-bottom:8px">${photo(b.src,SW-16,fh,{filter:`${E.booth} ${T.photo}`,poster:b.poster,pos:"50% 30%",vig:20,last:poster?img(poster,"w500"):""})}</div>`).join("")}
      <div style="${caps(15,"#2a2622",.18)};text-align:center;padding-top:2px">Photo booth</div></div>`;
  const RX=SX+SW+22,RW=W-RX-20;
  /* menu courses */
  const m=ctx.menu||{};let ci=0;
  const courses=["s","m","w","d"].map(k=>({k,items:(m[k]||[]).filter(i=>i&&i.n).slice(0,4)})).filter(c=>c.items.length);
  const cents=yy;
  const numPrice=num.length>=3&&num.length<=4?`${+num.slice(0,-2)}.${num.slice(-2)}`:num.length<=2?`${+num}.00`:null;
  courses.forEach((c,i)=>c.items=c.items.map((it,j)=>{const base=[6,14,7,3][["s","m","w","d"].indexOf(c.k)]+j*2;
    return {n:C(it.n),note:C(it.note),p:(c.k==="m"&&j===0&&numPrice)?numPrice:`${base}.${cents}`}}));
  /* header block */
  const hdrKick=venue.toUpperCase();
  const hk=fitType(hdrKick,RW,44,.62,17,15,1.2,2);
  const head=`<div style="${caps(hk.z,ACC,.16)}">${esc(hdrKick)}</div><div style="font:${E.disp==="Unbounded"?"800 ":""}44px/1.05 ${disp};color:${ink};margin-top:6px;${fp}">${esc(E.menu)}</div>`;
  const headH=hk.n*hk.z*1.2+6+48;
  /* cue and fine print at the foot */
  const cue=sentence(C(f.P));
  const cT=fitType(cue,RW,100,E.bcw,19,15,1.3,5);
  const fineW=winks.length>1?[winks[winks.length-1]]:[];
  const backFine=`${fineW.map(s=>trunc(s,46)).join(". ")}${fineW.length?". ":""}Prices subject to change. Form PD ${num}${num===year?"":". "+year}.`;
  const fT=fitType(backFine,RW,64,.52,15,14,1.3,4);
  const footH=(cue?20+8+cT.n*cT.z*1.3+14:0)+fT.n*fT.z*1.3;
  let MH=H-24-headH-18-footH-24;
  const barStyle={letterpress:`border-top:2px solid ${ink};border-bottom:1px solid ${ink};padding:3px 0`,offset:`background:${band};color:${bandText};padding:4px 10px;border-radius:${Math.min(E.radius,12)}px`,glossy:`border-left:4px solid ${ACC};padding-left:10px;color:${ACC}`,laser:`background:${band};color:${bandText};padding:3px 10px`,photocopy:`border-bottom:3px solid ${ink};padding-bottom:2px`,clean:`border-bottom:2px solid ${ACC};padding-bottom:4px`}[E.proc];
  const secCol={letterpress:ink,offset:bandText,glossy:ACC,laser:bandText,photocopy:ink,clean:ink}[E.proc];
  const menuFor=FS=>courses.map((c,i)=>`<div style="margin-top:${i?FS.G+4:0}px">
      <div style="font:${E.disp==="Unbounded"?"800 ":""}${FS.S}px/1.25 ${disp};color:${secCol};${barStyle};margin-bottom:8px">${esc(SEC[c.k])}</div>
      ${c.items.map(it=>{const maxC=FS.nl?Math.floor(FS.nl*RW/(FS.N*E.bcw)*.95):0;return `<div style="margin-bottom:${FS.G}px">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:baseline"><span style="font:800 ${FS.D}px/1.12 ${body};color:${ink}">${esc(it.n)}</span><span style="font:800 ${FS.D}px/1.12 ${body};color:${ACC};white-space:nowrap">${esc(it.p)}</span></div>
        ${FS.nl&&it.note?`<div style="font:500 ${FS.N}px/1.3 ${body};color:${soft};margin-top:2px">${esc(sentence(clip(it.note,maxC)))}</div>`:""}</div>`}).join("")}</div>`).join("");
  /* fit the menu into the space left: measured in the page where possible, estimated otherwise */
  const dcw=E.bcw+.04;
  const est=(FS)=>{let t=0;courses.forEach((c,i)=>{t+=FS.S*1.3+8+(i?FS.G+4:0);c.items.forEach(it=>{t+=lines(it.n,FS.D,RW-FS.D*2.9,dcw)*FS.D*1.12;if(FS.nl&&it.note)t+=Math.min(FS.nl,lines(it.note,FS.N,RW,E.bcw))*FS.N*1.3+2;t+=FS.G})});return t};
  const measure=FS=>{const h=domH(menuFor(FS),RW);return h==null?est(FS):h*1.04};
  let FS=null;
  outer:for(let s=1.07;s>=.55;s-=.05){
    const base={D:Math.max(17,Math.round(28*s)),N:Math.max(15,Math.round(21*s)),S:Math.max(18,Math.round(26*s)),G:Math.max(4,Math.round(14*s))};
    for(const nl of [2,1,0]){if(nl===0&&s>.72)continue;const FSx=Object.assign({},base,{nl});const t=measure(FSx);if(t<=MH){FS=Object.assign(FSx,{t});break outer}}
  }
  /* rescue for very long menus: give the cue's room to the menu, then smallest legal type, then fewer items per course */
  let dropCue=false;
  if(!FS){dropCue=!!cue;MH+=cue?20+8+cT.n*cT.z*1.3+14:0;
    for(const cap of [4,3,2]){courses.forEach(c=>c.items=c.items.slice(0,cap));
      for(const D of [17,16,15]){const FSx={D,N:15,S:D+1,G:3,nl:0};const t=measure(FSx);if(t<=MH){FS=Object.assign(FSx,{t});break}}
      if(FS)break}
    FS=FS||{D:15,N:15,S:16,G:3,nl:0,t:MH}}
  /* spare room under a short menu becomes an Also Tonight list of winks */
  const spare=MH-FS.t,aw=winks.slice(1,4);
  const also=spare>150&&aw.length?aw.slice(0,Math.max(1,Math.min(aw.length,Math.floor((spare-60)/34)))):[];
  const right=`<div style="position:absolute;left:${RX}px;top:24px;width:${RW}px;height:${H-48}px;display:flex;flex-direction:column">
      <div>${head}</div>
      <div style="margin-top:18px;height:${Math.floor(MH)}px;display:flex;flex-direction:column"><div>${menuFor(FS)}</div>
        ${also.length?`<div style="margin-top:auto;margin-bottom:14px;border:2px solid ${ACC};border-radius:${Math.min(E.radius,10)}px;padding:12px 14px"><div style="${caps(15,ACC,.2)};margin-bottom:6px">Also tonight</div>${also.map(w=>`<div style="font:600 17px/1.3 ${body};color:${ink};margin-top:4px">${esc(sentence(trunc(w,60)))}</div>`).join("")}</div>`:""}</div>
      <div style="margin-top:auto">
        ${cue&&!dropCue?`<div style="border-top:1px solid ${rgba(ink,.35)};padding-top:10px;margin-bottom:14px"><div style="${caps(15,ACC,.2)};margin-bottom:6px">Showtime cue</div><div style="font:500 ${cT.z}px/1.3 ${body};color:${ink}">${esc(cue)}</div></div>`:""}
        <div style="font:500 ${fT.z}px/1.3 ${body};color:${soft}">${esc(backFine)}</div></div></div>`;
  const back=`<div style="position:absolute;inset:0;background:${bg};${fp}">${strip}${right}</div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
