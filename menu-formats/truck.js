
const _ROOT_truck=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: truck. A food truck menu board, one landscape face 1344x960.
   Left: truck side lettering (venue and sign) over the truck photo (hero still, 44 percent), logo on its own panel.
   Right: the menu board (signature; enamel sign, felt letterboard, chalkboard or matte board by era, prices in chalk or sign paint),
   then the order window: cook note card with script signature and a now serving ticket.
   Era sets type pairing, board material, truck paint and prices; tone sets wear, photo and voice. */
(function(){
const ID="truck",W=1344,H=960;

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
const DRY=[[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|gin|liqueur|martini)\b/gi,"soda"]];
const dry=s=>DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s));
function loadFonts(fams){const k="fmt-"+ID+"-fonts";if(document.getElementById(k))return;const l=document.createElement("link");l.id=k;l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+fams.map(f=>"family="+f).join("&")+"&display=swap";document.head.appendChild(l)}
/* logo in its own colours: dark panel by default, switched to the light panel when the logo itself is mostly dark */
const SAMPLE="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,a=0,b=0;for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;var L=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];if(L<95)a++;else if(L>165)b++}if(a>b*1.2){var p=i.parentNode;p.style.background=p.getAttribute('data-light')}}catch(e){}";
function logoImg(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a);if(h<34)return null;return{src:ctx.img(L[0],"w500"),w:Math.round(h*a),h:Math.round(h)}}
function photo(src,filter,pos,extra){return `<img src="${src}" crossorigin="anonymous" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 35%"};filter:${filter}">${extra||""}`}

/* ---------- era and tone ---------- */
const ERAS=["1930s-40s","1950s","1960s","1970s","1980s","1990s","2000s","modern"];
const E=[
 {disp:"'Yellowtail',cursive",dw:"400",body:"'Lora',serif",sig:"'Mrs Saint Delafield',cursive",price:"'Lora',serif",pw:"700",board:"enamel",bbg:"#f1ead6",btx:"#1d1a16",bacc:"#a3201c",frame:"14px solid #26231f",truck:"#e9e1cc",tink:"#2a211a",acc:"#a3201c",photo:"grayscale(1) contrast(1.12) brightness(1.04)",cw:.55,cwd:.6,base:.3,caps:0,cols:["Snacks","Hot Plates","Pie and Sweets","Drinks"],board_t:"Today's Lunch"},
 {disp:"'Yellowtail',cursive",dw:"400",body:"'Lora',serif",sig:"'Allura',cursive",price:"'Lora',serif",pw:"700",board:"enamel",bbg:"#f4ecd6",btx:"#1d2433",bacc:"#b22a1e",frame:"14px solid #1d2433",truck:"#e3d9bf",tink:"#1d2433",acc:"#b22a1e",photo:"saturate(.72) sepia(.2) contrast(1.05)",cw:.55,cwd:.6,base:.55,caps:0,cols:["Snacks","Hot Plates","Pie and Sweets","Drinks"],board_t:"Today's Lunch"},
 {disp:"'Knewave',cursive",dw:"400",body:"'Archivo Narrow',sans-serif",sig:"'Allura',cursive",price:"'Archivo Narrow',sans-serif",pw:"700",board:"letter",bbg:"#2a211c",btx:"#f4f1ea",bacc:"#f2c14e",frame:"14px solid #b9b7ae",truck:"#e9b949",tink:"#2b1d10",acc:"#c0392b",photo:"saturate(1.12) sepia(.08) contrast(1.06)",dots:1,cw:.5,cwd:.54,base:.9,caps:1,cols:["Snacks","Grill","Sweets","Drinks"],board_t:"Menu"},
 {disp:"'Knewave',cursive",dw:"400",body:"'Archivo Narrow',sans-serif",sig:"'Allura',cursive",price:"'Archivo Narrow',sans-serif",pw:"700",board:"letter",bbg:"#2a1d16",btx:"#f6efe2",bacc:"#ff9f43",frame:"14px solid #a9a59a",truck:"#d98a2b",tink:"#2b1609",acc:"#7a2e0e",photo:"saturate(1.18) sepia(.22) contrast(1.04)",dots:1,cw:.5,cwd:.54,base:1.5,caps:1,cols:["Snacks","Grill","Sweets","Drinks"],board_t:"Menu"},
 {disp:"'Cabin Sketch',cursive",dw:"700",body:"'Nunito Sans',sans-serif",sig:"'Caveat',cursive",price:"'Cabin Sketch',cursive",pw:"700",board:"chalk",bbg:"#1f2a24",btx:"#f2efe6",bacc:"#ffd36e",frame:"16px solid #6b4a2b",truck:"#f4f4f2",tink:"#1b1e24",acc:"#c62828",photo:"saturate(1.06) contrast(1.05)",cw:.52,cwd:.56,base:3,caps:0,cols:["Starters","Off the Grill","Sweet Stuff","Cold Drinks"],board_t:"Today's Board"},
 {disp:"'Cabin Sketch',cursive",dw:"700",body:"'Nunito Sans',sans-serif",sig:"'Caveat',cursive",price:"'Cabin Sketch',cursive",pw:"700",board:"chalk",bbg:"#232323",btx:"#f4f2ec",bacc:"#8fd3ff",frame:"16px solid #7a5532",truck:"#e8eef2",tink:"#18202a",acc:"#1565c0",photo:"saturate(1.08) contrast(1.05)",cw:.52,cwd:.56,base:4.5,caps:0,cols:["Starters","Off the Grill","Sweet Stuff","Cold Drinks"],board_t:"Today's Board"},
 {disp:"'Familjen Grotesk',sans-serif",dw:"700",body:"'Familjen Grotesk',sans-serif",sig:"'Caveat',cursive",price:"'Cabin Sketch',cursive",pw:"700",board:"matte",bbg:"#141414",btx:"#ffffff",bacc:"#7ee0a1",frame:"12px solid #3a3a3a",truck:"#1b1d21",tink:"#f2f2f2",acc:"#2bb673",photo:"saturate(1.08) contrast(1.06)",cw:.52,cwd:.57,base:8,caps:0,cols:["Small","Big","Sweet","Sips"],board_t:"Menu"},
 {disp:"'Familjen Grotesk',sans-serif",dw:"700",body:"'Familjen Grotesk',sans-serif",sig:"'Caveat',cursive",price:"'Cabin Sketch',cursive",pw:"700",board:"matte",bbg:"#111214",btx:"#ffffff",bacc:"#ffcf33",frame:"12px solid #34363b",truck:"#2a2d33",tink:"#f2f2f2",acc:"#ffb703",photo:"saturate(1.05) contrast(1.06)",cw:.52,cwd:.57,base:12,caps:0,cols:["Small","Big","Sweet","Sips"],board_t:"Menu"}
];
const T={
 gritty:{wear:.55,vig:.38,photo:"contrast(1.1) saturate(.82)",tilt:-1.5,win:"Cash only. No change given."},
 glossy:{wear:.03,vig:.06,photo:"saturate(1.1) contrast(1.04)",shine:1,tilt:0,win:"Order ahead and skip the line."},
 warm:{wear:.2,vig:.22,photo:"sepia(.1) saturate(1.06) brightness(1.03)",tilt:-1,win:"Cooked fresh at the window."},
 eerie:{wear:.3,vig:.55,photo:"saturate(.6) brightness(.9) hue-rotate(-8deg)",tilt:0,win:"Open after dark. Knock once."},
 playful:{wear:.06,vig:.1,photo:"saturate(1.2) brightness(1.04)",tilt:-3,win:"Honk if you're hungry."},
 grand:{wear:.1,vig:.2,photo:"contrast(1.06) saturate(1.05)",tilt:0,win:"The finest window on the block."},
 tender:{wear:.16,vig:.2,photo:"saturate(.9) brightness(1.06) contrast(.96)",tilt:-1,win:"Made like home. Eat it on the curb."},
 tense:{wear:.24,vig:.4,photo:"contrast(1.2) saturate(.78)",tilt:0,win:"Grab it and go. Don't look back."},
 scrappy:{wear:.6,vig:.28,photo:"grayscale(.35) contrast(1.28)",tilt:-3.5,win:"When it's gone, it's gone."}
};
loadFonts(["Yellowtail","Knewave","Cabin+Sketch:wght@700","Familjen+Grotesk:wght@500;700","Lora:ital,wght@0,400;0,700;1,400","Archivo+Narrow:ital,wght@0,500;0,700;1,500","Nunito+Sans:ital,wght@0,400;0,700;0,800;1,400","Mrs+Saint+Delafield","Allura","Caveat:wght@600"]);

function money(v,ei){if(v<1&&ei<2)return "."+String(Math.round(v*100)).padStart(2,"0");if(ei>=6)return String(Math.round(v));return v.toFixed(2)}
function prices(menu,e,ei,egg){
  const mult={s:.55,m:1,w:.45,d:.3},out={};let hid=false;
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).map((it,i)=>{let v=e.base*mult[k]*(1+i*.15);v=ei<2?Math.max(.05,Math.round(v*20)/20):ei>=6?Math.max(3,Math.round(v)):Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"&&ei>=2&&ei<6){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)});
  return out;
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},ei=Math.max(0,ERAS.indexOf(ctx.era)),e=E[ei],t=T[ctx.tone]||T.warm;
  const fam=FAMILY.has(f.theme),tx=s=>fam?dry(s):clean(s);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature"),year=f.year||"";
  const venue=clean(fl.venue||(title.length<=20?title+" Truck":"The Lunch Truck")),sign=clean(fl.sign||"Hot food from the window");
  const note=fl.note&&fl.note.text?{text:fl.note.text,by:fl.note.by||"The Cook"}:{text:"Everything on the board is cooked to order. Wait by the window and we'll call your number.",by:"The Cook"};
  const winks=(fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?fl.prop:{title:"Order Ticket",lines:["Keep this ticket","We call your number"]};
  const num=String(fl.number||"").replace(/\D/g,"")||String(year).slice(-2)||"7";
  const egg=String(fl.number||"").replace(/\D/g,"").slice(-2)||"";
  const pal=ctx.palette||{};
  const truck=e.truck,darkTruck=lum(truck)<.2;
  const tink=e.tink;
  const acc=readable(pal.accent||e.acc,truck,4.5,e.acc);
  const bacc=readable(pal.accent&&e.board!=="enamel"?mix(pal.accent,"#ffffff",.35):pal.accent||e.bacc,e.bbg,4.5,e.bacc);
  const bsoft=mix(e.btx,e.bbg,.3);
  const grain=(ctx.root!=null?ctx.root:_ROOT_truck)+"assets/era/_shared/paper-grain.webp";
  const stills=(ctx.stills||[]).filter(Boolean);
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id||`${f.title} (${f.year})`])||null;
  const pf=e.photo+" "+t.photo;
  const DF=e.disp,BF=e.body,SF=e.sig,PF=e.price;
  const UP=s=>e.caps?`text-transform:uppercase;letter-spacing:.06em;`:"";
  const kick=(s,c,size)=>`<div style="font:700 ${size||16}px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${c};${clamp(1)}">${esc(s)}</div>`;
  const overlay=()=>(e.dots?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.16) 1px,transparent 1.4px) 0 0/4px 4px;mix-blend-mode:multiply"></div>`:"")+(t.shine||ei>=6?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,0) 38%)"></div>`:"");

  /* left: the poster is the hero, whole and uncropped, pasted on the truck side; no poster: first still in the same frame */
  const HX=648,RW=W-HX,BH=96;
  const vSize=venue.length>26?30:venue.length>18?36:44;
  const signBand=`<div style="position:absolute;left:${HX}px;top:0;width:${RW}px;height:${BH}px;background:${acc};display:flex;flex-direction:column;justify-content:center;padding:0 30px;box-sizing:border-box;border-bottom:6px solid ${mix(acc,"#000000",.35)}">
    <div style="font:${e.dw} ${vSize}px/1.05 ${DF};color:${lum(acc)>.35?"#15171c":"#fffaf0"};${clamp(1)}">${esc(venue)}</div>
    <div style="font:700 15px/1.2 ${BF};letter-spacing:.18em;text-transform:uppercase;color:${lum(acc)>.35?"#2a2a2a":mix(acc,"#ffffff",.75)};margin-top:4px;${clamp(1)}">${esc(sign)}</div></div>`;
  const posSrc=poster?ctx.img(poster,"w780"):"";
  const heroSrc=posSrc||(stills[0]?ctx.img(stills[0],"w1280"):"");
  const lg=logoImg(ctx,322,76);
  const tSize=title.length>40?16:title.length>24?20:title.length>12?26:32;
  const panelDark="rgba(12,12,14,.84)",panelLight="rgba(250,248,242,.92)";
  const PWI=588,PHI=882,PB=6,PXL=Math.round((HX-PWI-2*PB)/2),PTOP=Math.round((H-PHI-2*PB)/2);
  const hero=`<div style="position:absolute;left:0;top:0;width:${HX}px;height:${H}px;overflow:hidden;background:${truck}">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.2+t.wear).toFixed(2)}"></div>
    <div style="position:absolute;left:${PXL}px;top:${PTOP}px;width:${PWI}px;height:${PHI}px;border:${PB}px solid ${darkTruck?"#e9e5d8":"#fbf7ec"};background:#222;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.4)">${heroSrc?(posSrc?`<img src="${posSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">${t.shine||ei>=6?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 38%)"></div>`:""}`:photo(heroSrc,pf,"center 40%",overlay())):""}</div></div>`;

  /* right: the board (signature) */
  const RX=HX,boardH=560;
  const C=[["s",e.cols[0]],["m",e.cols[1]],["w",e.cols[2]],["d",e.cols[3]]].filter(([k])=>(ctx.menu[k]||[]).length);
  const items={};C.forEach(([k])=>items[k]=(ctx.menu[k]||[]).slice(0,4));
  const pr=prices(items,e,ei,egg);
  const fw=parseInt(e.frame)||14,pad=26;
  const CWall=RW-2*fw-2*pad-8,colGap=24,mTop=96,menuH=boardH-2*fw-mTop-18;
  const tiers=[{d:30,n:21,g:16,h:34,nl:2},{d:28,n:20,g:14,h:32,nl:2},{d:26,n:19,g:12,h:30,nl:2},{d:24,n:18,g:10,h:27,nl:1},{d:22,n:17,g:8,h:25,nl:1},{d:20,n:15,g:6,h:22,nl:0},{d:18,n:14,g:4,h:20,nl:0},{d:16,n:14,g:3,h:18,nl:0}];
  let dmax=3;const priceW=d=>d*(ei>=6?1.5:2.5)+8;
  let CW=CWall;
  const cH=(tr,k)=>tr.h*1.3+14+items[k].reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),e.cwd*(e.caps?1.12:1)));const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g},0);
  const split=tr=>{let best=null;for(let s=1;s<=C.length;s++){const a=C.slice(0,s).reduce((x,[k])=>x+cH(tr,k),0),b=C.slice(s).reduce((x,[k])=>x+cH(tr,k),0),m=Math.max(a,b);if(!best||m<best.m)best={s,m}}return best};
  let tr=tiers[tiers.length-1],sp=null,one=false;
  for(const x of tiers){CW=CWall;const h1=C.reduce((a,[k])=>a+cH(x,k),0);if(h1*1.08<=menuH){tr=x;sp={s:C.length,m:h1};one=true;break}
    CW=(CWall-colGap)/2;const q=split(x);if(q.m*1.08<=menuH){tr=x;sp=q;break}}
  if(!sp){dmax=2;CW=(CWall-colGap)/2;sp=split(tr)}
  const cgap=12+Math.min(48,Math.max(0,menuH-sp.m*1.08)/Math.max(1,C.length));
  const head=l=>e.board==="enamel"?`<div style="font:${e.dw} ${tr.h}px/1.1 ${DF};color:${bacc};border-bottom:3px double ${bacc};padding-bottom:2px;margin-bottom:8px">${l}</div>`
    :e.board==="letter"?`<div style="font:700 ${tr.h}px/1.1 ${BF};color:${bacc};text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px">${l}</div>`
    :e.board==="chalk"?`<div style="font:700 ${tr.h}px/1.1 ${PF};color:${bacc};margin-bottom:8px;border-bottom:2px solid ${mix(bacc,e.bbg,.4)};padding-bottom:3px">${l}</div>`
    :`<div style="display:inline-block;font:700 ${tr.h-4}px/1.1 ${DF};color:${e.bbg};background:${bacc};padding:4px 12px;margin-bottom:10px;border-radius:6px">${l}</div>`;
  const course=([k,l])=>`<div style="margin-bottom:${cgap}px">${head(l)}${items[k].map((it,i)=>{const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return `<div style="margin-bottom:${tr.g}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="flex:1;font:700 ${tr.d}px/1.15 ${BF};color:${e.btx};${UP()}${clamp(dmax)}">${esc(tx(it.n))}</span><span style="font:${e.pw} ${tr.d+4}px/1 ${PF};color:${e.board==="enamel"?bacc:e.btx};white-space:nowrap">${pr[k][i]}</span></div>
      ${nl?`<div style="font:400 ${tr.n}px/1.3 ${BF};color:${bsoft};margin-top:3px;${clamp(nl)}">${esc(cap(tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
  const colA=C.slice(0,sp.s).map(course).join(""),colB=C.slice(sp.s).map(course).join("");
  const boardTex=e.board==="letter"?`<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,0) 2px 10px)"></div>`
    :e.board==="chalk"?`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.08),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 70% 80%,rgba(255,255,255,.06),rgba(255,255,255,0) 55%)"></div><div style="position:absolute;inset:0;background:url(${grain}) center/900px auto;opacity:.9;mix-blend-mode:screen;filter:invert(1)"></div>`
    :e.board==="enamel"?`<div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.3+t.wear).toFixed(2)}"></div>`:"";
  const boardTitle=e.board==="chalk"?`font:700 46px/1 ${PF}`:e.board==="letter"?`font:700 40px/1 ${BF};text-transform:uppercase;letter-spacing:.14em`:`font:${e.dw} 46px/1 ${DF}`;
  const board=`<div style="position:absolute;left:${RX}px;top:${BH}px;width:${RW}px;height:${boardH}px;box-sizing:border-box;border:${e.frame};background:${e.bbg};overflow:hidden;${e.board==="matte"?"border-radius:0 0 0 0;":""}box-shadow:inset 0 0 30px rgba(0,0,0,${e.board==="enamel"?.15:.5})">
    ${boardTex}
    <div style="position:absolute;left:${pad}px;right:${pad}px;top:22px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:${e.board==="enamel"?`3px solid ${e.btx}`:`2px solid ${mix(e.btx,e.bbg,.6)}`};padding-bottom:10px">
      <div style="${boardTitle};color:${e.btx}">${e.board_t}</div>${kick(t.win.length>34?"Order at the window":t.win,bacc,14)}</div>
    <div style="position:absolute;left:${pad}px;width:${CWall}px;top:${mTop}px;height:${menuH}px;display:flex;gap:${colGap}px;overflow:hidden"><div style="flex:0 0 ${CW}px">${colA}</div>${one?"":`<div style="flex:0 0 ${CW}px">${colB}</div>`}</div></div>`;

  /* order window: note, logo panel, now serving ticket */
  const WY=BH+boardH,WH=H-WY;
  const nLen=clean(note.text).length,nSize=nLen>150?16:nLen>110?17:nLen>80?18:19;
  const CWD=280,C2X=RX+20+CWD+16,C2W=RW-20-CWD-16-20,LH=96,TH=WH-40-LH-14;
  const card=`<div style="position:absolute;left:${RX+20}px;top:${WY+20}px;width:${CWD}px;height:${WH-40}px;box-sizing:border-box;padding:14px 18px 10px;background:#fbf7ec;transform:rotate(${t.tilt*.6}deg);box-shadow:0 4px 12px rgba(0,0,0,.35);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
    <div>${kick(t.win,acc,14).replace(clamp(1),clamp(2))}<div style="font:italic 400 ${nSize}px/1.34 ${e.board==="enamel"?BF:"'Lora',serif"};color:#22201c;margin-top:6px;${clamp(7)}">"${esc(note.text)}"</div></div>
    <div style="font:400 ${ei<2?36:32}px/1 ${SF};color:${acc};text-align:right">${esc(note.by)}</div></div>`;
  const logoPanel=`<div data-dark="${panelDark}" data-light="${panelLight}" style="position:absolute;left:${C2X}px;top:${WY+20}px;width:${C2W}px;height:${LH}px;padding:10px 20px;box-sizing:border-box;background:${panelDark};display:flex;align-items:center;justify-content:center;border-left:6px solid ${acc};box-shadow:0 4px 14px rgba(0,0,0,.4)">
      ${lg?`<img src="${lg.src}" crossorigin="anonymous" onload="${SAMPLE}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain">`
         :`<div style="font:${e.dw} ${tSize}px/1.08 ${DF};color:#fbf6ea;text-align:center;${clamp(3)}">${esc(title)}</div>`}</div>`;
  const tick=`<div style="position:absolute;left:${C2X}px;top:${WY+20+LH+14}px;width:${C2W}px;height:${TH}px;box-sizing:border-box;padding:10px 14px;background:${darkTruck?"#f3f0e6":"#ffffff"};border-top:8px solid ${acc};box-shadow:0 4px 12px rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
    <div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between">
    <div style="flex:0 0 auto">${kick("Now serving",acc,14)}<div style="font:${e.dw} ${num.slice(-4).length>=4?36:num.slice(-4).length===3?42:48}px/1 ${DF};color:#15171c;margin-top:4px;white-space:nowrap">No. ${esc(num.slice(-4))}</div></div>
    <div style="flex:1;min-width:0;text-align:right"><div style="font:700 15px/1.15 ${BF};color:#15171c;text-transform:uppercase;letter-spacing:.06em;${clamp(1)}">${esc(prop.title)}</div>
    ${(prop.lines||[]).slice(0,2).map(l=>`<div style="font:400 14px/1.25 ${BF};color:#44464d;${clamp(1)}">${esc(l)}</div>`).join("")}</div></div>
    <div style="font:400 14px/1.25 ${BF};color:#5a5d66;border-top:1px dashed #9a9ca3;padding-top:4px;${clamp(2)}">${winks[0]?esc(winks[0])+". ":""}Prices subject to change.${fam?" No alcohol served.":""} Images: TMDB.</div></div>`;
  const windowArea=`<div style="position:absolute;left:${RX}px;top:${WY}px;width:${RW}px;height:${WH}px;background:${truck};overflow:hidden">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1200px auto;opacity:${(.2+t.wear).toFixed(2)}"></div>
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 1px,rgba(0,0,0,0) 1px 60px)"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:10px;background:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,0))"></div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(20,12,4,${t.vig*.7}) 100%)"></div>`;
  const face=`<div style="position:absolute;inset:0;background:${truck};overflow:hidden">${hero}${signBand}${board}${windowArea}${card}${logoPanel}${tick}${vig}</div>`;
  return {w:W,h:H,faces:[face]};
};
})();
