const _ROOT_bowling=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: bowling. A bowling alley snack bar menu printed as a score sheet, one landscape face 1344x960.
   Header: the lanes' sign (venue and sign), logo panel and the lane number box.
   Left: the poster as the hero, whole, with the film's prop (or a shoe rental tag) under it.
   Right (signature): the score sheet. A frame number strip, then one row per course: the course is the bowler,
   each dish sits in its own frame with its price in the little ball box, all in pencil and print.
   Under the courses: a ruled row of the film's winks and a ruled showtime row.
   Foot: lane notes (the overheard quote) and the total box. Era sets paper, ruling and type; tone sets wear and photo. */
(function(){
const ID="bowling",_ROOT=_ROOT_bowling;

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
function loadFonts(fams){const k="fmt-"+ID+"-fonts";if(document.getElementById(k))return;const l=document.createElement("link");l.id=k;l.rel="stylesheet";l.href=rdFontHref(fams.map(f=>"family="+f).join("&"),"swap");document.head.appendChild(l)}
/* logo in its own colours: dark panel by default, switched to the light panel when the logo itself is mostly dark */
const SAMPLE="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,a=0,b=0;for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;var L=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];if(L<95)a++;else if(L>165)b++}if(a>b*1.2){var p=i.parentNode;p.style.background=p.getAttribute('data-light')}}catch(e){}";
function logoImg(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a);if(h<34)return null;return{src:ctx.img(L[0],"w500"),w:Math.round(h*a),h:Math.round(h)}}
function photo(src,filter,pos,extra){return `<img src="${src}" crossorigin="anonymous" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 35%"};filter:${filter}">${extra||""}`}

/* ---------- shared kit for the venue formats added 12 Nov (foodcourt to hospital) ---------- */
const ERAS=["1930s-40s","1950s","1960s","1970s","1980s","1990s","2000s","modern"];
const BASE=[.3,.55,.9,1.5,3,4.5,8,12];
/* four looks per format: 0 up to the 60s, 1 the 70s, 2 the 80s and 90s, 3 the 2000s on */
const band=ei=>ei<=2?0:ei===3?1:ei<=5?2:3;
const TONE={
 gritty:{wear:.5,vig:.36,photo:"contrast(1.1) saturate(.85)",tilt:-1.4},
 glossy:{wear:.04,vig:.08,photo:"saturate(1.08) contrast(1.04)",tilt:0},
 warm:{wear:.2,vig:.2,photo:"sepia(.08) saturate(1.05)",tilt:-1},
 eerie:{wear:.3,vig:.5,photo:"saturate(.7) brightness(.92)",tilt:0},
 playful:{wear:.06,vig:.1,photo:"saturate(1.15) brightness(1.03)",tilt:-2.5},
 grand:{wear:.1,vig:.18,photo:"contrast(1.05) saturate(1.04)",tilt:0},
 tender:{wear:.15,vig:.18,photo:"saturate(.92) brightness(1.05)",tilt:-1},
 tense:{wear:.24,vig:.38,photo:"contrast(1.16) saturate(.8)",tilt:0},
 scrappy:{wear:.55,vig:.26,photo:"contrast(1.2) saturate(.85)",tilt:-3}
};
function money(v,ei){if(v<1&&ei<2)return "."+String(Math.round(v*100)).padStart(2,"0");if(ei>=6)return String(Math.round(v));return v.toFixed(2)}
const DEAR=/\b(lobster|steak|prime rib|surf and turf|prawns?|shrimp|crab|scallops?|wagyu|oysters?|crayfish|rib ?eye|sirloin|filet|fillet mignon|t-bone|porterhouse)\b/i;
const pval=x=>{const n=parseFloat(String(x).replace(/[^\d.]/g,""));return isNaN(n)?0:n};
function prices(menu,ei,egg,mult){
  mult=mult||{s:.55,m:1,w:.45,d:.3};const out={};let hid=false;
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).map((it,i)=>{let v=BASE[ei]*mult[k]*(1+i*.15);v=ei<2?Math.max(.05,Math.round(v*20)/20):ei>=6?Math.max(3,Math.round(v)):Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"&&ei>=2&&ei<6){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)});
  const ps=window.priceSense?window.priceSense(menu,out):out;
  /* review 25 (copied from deli for review 26): a dearer dish (lobster, steak, prawns) never sits under a plainer one in its course, and no two items in a course share a price */
  const val=pval;
  for(const k of ["s","m","w","d"]){const its=menu[k]||[],P=(ps[k]||[]).slice();if(P.length<2)continue;
    const nudge=v=>{if(ei>=6)return v+1;if(ei<2)return Math.round((v+.05)*100)/100;const fl=Math.floor(v),c=Math.round((v-fl)*100);return c<50?fl+.5:c<95?fl+.95:fl+1.5};
    const seen=new Set();P.forEach((x,i)=>{let v=val(x);while(seen.has(v.toFixed(2)))v=nudge(v);seen.add(v.toFixed(2));if(v!==val(x))P[i]=String(x).replace(/[\d.]+/,money(v,ei))});
    const dear=its.map((it,i)=>DEAR.test((it&&it.n)||"")?i:-1).filter(i=>i>=0);
    if(dear.length&&dear.length<P.length){const sorted=P.map((x,i)=>[val(x),x]).sort((a,b)=>b[0]-a[0]),plain=its.map((_,i)=>i).filter(i=>!dear.includes(i));
      const top=sorted.slice(0,dear.length).map(a=>a[1]),rest=sorted.slice(dear.length).map(a=>a[1]);
      const restInOrder=plain.map(i=>[i,val(P[i])]).sort((a,b)=>a[1]-b[1]).map(a=>a[0]);rest.sort((a,b)=>val(a)-val(b));
      dear.forEach((i,j)=>{P[i]=top[dear.length-1-j]});restInOrder.forEach((i,j)=>{P[i]=rest[j]})}
    ps[k]=P}
  return ps;
}
/* everything a format needs from the film, with safe fallbacks */
function film(ctx,dVenue,dSign,dNote){
  const f=ctx.f||{},fl=ctx.flavour||{},fam=FAMILY.has(f.theme),tx=s=>fam?dry(s):clean(s);
  const title=clean(f.title||"Tonight's Feature"),year=String(f.year||"");
  const ei=Math.max(0,ERAS.indexOf(ctx.era));
  const num=String(fl.number||"").replace(/\D/g,"")||(year.slice(-2)==="00"?year:year.slice(-2))||"7";
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id||`${f.title} (${f.year})`])||null;
  const stills=(ctx.stills||[]).filter(Boolean);
  return {f,fl,fam,tx,title,year,ei,b:band(ei),t:TONE[ctx.tone]||TONE.warm,
    venue:clean(fl.venue||dVenue(title)),sign:clean(fl.sign||dSign),
    note:fl.note&&fl.note.text?{text:clean(fl.note.text),by:clean(fl.note.by||"The House")}:dNote,
    winks:(fl.winks||[]).map(clean).filter(Boolean),prop:fl.prop&&fl.prop.title?{title:clean(fl.prop.title),lines:(fl.prop.lines||[]).map(clean).filter(Boolean)}:null,
    num,egg:String(fl.number||"").replace(/\D/g,"").slice(-2)||"",pal:ctx.palette||{},
    posSrc:poster?ctx.img(poster,"w780"):"",stillSrc:stills[0]?ctx.img(stills[0],"w1280"):"",still2:stills[1]?ctx.img(stills[1],"w780"):"",
    cue:fam?dry(f.P||"").trim():clean(f.P||"").trim(),drinks:clean(fl.drinksHeading||"")};
}
/* the poster is the hero: whole, uncropped, nothing over it. No poster: the first still fills the same frame */
function hero(F,w,h,filter){const src=F.posSrc||F.stillSrc;if(!src)return `<div style="position:absolute;inset:0;background:#2a2622"></div>`;
  return F.posSrc?`<img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">`
    :`<img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;filter:${filter||"none"}">`}
/* poster box sized to the poster's 2:3 inside a w x h area */
function posterFit(w,h){const pw=Math.min(w,Math.round(h*2/3));return {w:pw,h:Math.round(pw*3/2)>h?h:Math.round(pw*3/2)}}
const TIERS=[{d:30,n:21,g:16,h:34,nl:2},{d:28,n:20,g:14,h:32,nl:2},{d:26,n:19,g:12,h:30,nl:2},{d:24,n:18,g:10,h:27,nl:2},{d:22,n:17,g:8,h:25,nl:2},{d:21,n:16,g:7,h:24,nl:2},{d:20,n:16,g:6,h:23,nl:2},{d:22,n:17,g:8,h:25,nl:1},{d:20,n:15,g:6,h:22,nl:1},{d:19,n:14,g:5,h:21,nl:1},{d:18,n:14,g:4,h:20,nl:1},{d:20,n:15,g:6,h:22,nl:0},{d:18,n:14,g:4,h:20,nl:0},{d:16,n:14,g:3,h:18,nl:0}];
/* sections into up to maxCols columns at the biggest type that fits; returns tier, column split and column width */
function fit(o){
  const {C,items,tx,W,H,gap=24,cw=.5,cwd=.56,caps=0,maxCols=2,minCols=1,maxItems=4,headX=14}=o;const priceW=o.priceW||(d=>d*2.6+10);
  const hh=o.headH||(tr=>tr.h*1.3+headX);let dmax=3,CW=W;
  const cH=(tr,k)=>hh(tr)+items[k].slice(0,maxItems).reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),cwd*(caps?1.12:1)));const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW-(o.indent||0),cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g+(o.itemX||0)},0);
  const splits=n=>{if(n===1)return [[C.length]];const out=[];if(n===2)for(let a=1;a<C.length;a++)out.push([a,C.length]);if(n===3)for(let a=1;a<C.length;a++)for(let b=a+1;b<C.length;b++)out.push([a,b,C.length]);return out};
  const tryTier=(tr,n)=>{CW=(W-gap*(n-1))/n;let best=null;for(const s of splits(n)){let st=0,m=0;const cols=[];for(const e of s){const sec=C.slice(st,e);cols.push(sec);m=Math.max(m,sec.reduce((x,[k])=>x+cH(tr,k),0));st=e}if(!best||m<best.m)best={m,cols}}return best};
  for(const tr of TIERS)for(let n=minCols;n<=Math.min(maxCols,C.length);n++){const q=tryTier(tr,n);if(q&&q.m*1.02<=H)return {tr,cols:q.cols,CW,dmax,spare:H-q.m*1.02,n}}
  dmax=2;const tr=TIERS[TIERS.length-1],n=Math.min(maxCols,C.length),q=tryTier(tr,n);return {tr,cols:q.cols,CW,dmax,spare:0,n};
}
/* one course: heading plus dishes; o sets fonts, colours and the heading/row style */
function course(sec,items,pr,R,o){
  const [k,label]=sec,{tr,CW,dmax}=R;
  return `<div style="margin-bottom:${o.cgap||12}px">${o.head(label,tr,k)}${items[k].slice(0,o.maxItems||4).map((it,i)=>{const nl=tr.nl?Math.min(tr.nl,wrapLines(o.tx(it.note),tr.n,CW-(o.indent||0),o.cw||.5)):0;
    const lead=o.leader?`<span style="flex:1;min-width:16px;border-bottom:2px dotted ${o.lead||o.soft};transform:translateY(-6px)"></span>`:"";
    return `<div style="margin-bottom:${tr.g}px;${o.indent?`padding-left:${o.indent}px;position:relative`:""}">${o.pre?o.pre(k,i,tr):""}
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="${o.leader?"flex:0 1 auto":"flex:1"};font:${o.nw||700} ${tr.d}px/1.15 ${o.nf};color:${o.ink};${o.caps?"text-transform:uppercase;letter-spacing:.04em;":""}${clamp(dmax)}">${esc(o.tx(it.n))}</span>${lead}<span style="font:${o.pw||700} ${tr.d+(o.pp||2)}px/1 ${o.pf||o.nf};color:${o.pc||o.ink};white-space:nowrap">${o.price?o.price(pr[k][i],k,i):pr[k][i]}</span></div>
      ${nl?`<div style="font:${o.ns||"400"} ${tr.n}px/1.3 ${o.bf};color:${o.soft};margin-top:3px;${clamp(nl)}">${esc(cap(o.tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
}
function sections(ctx,F,labels){return [["s",labels[0]],["m",labels[1]],["w",labels[2]],["d",F.drinks||labels[3]]].filter(([k])=>(ctx.menu[k]||[]).length)}
function itemsOf(ctx){const o={};for(const k of ["s","m","w","d"])o[k]=(ctx.menu[k]||[]).slice(0,4);return o}
function cueLine(F,bf,ink,acc,size){return F.cue?`<div data-fit="cue" style="font:italic 400 ${size||15}px/1.3 ${bf};color:${ink};${clamp(2)}"><b style="font-style:normal;color:${acc}">Showtime:</b> ${esc(cap(F.cue))}</div>`:""}
function logoOr(ctx,F,maxW,maxH,df,color,dw){const lg=logoImg(ctx,maxW,maxH);const ts=F.title.length>40?Math.round(maxH*.26):F.title.length>24?Math.round(maxH*.34):F.title.length>12?Math.round(maxH*.44):Math.round(maxH*.56);
  return lg?`<img src="${lg.src}" crossorigin="anonymous" onload="${SAMPLE}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain">`:`<div style="font:${dw||700} ${Math.max(18,ts)}px/1.05 ${df};color:${color};text-align:center;${clamp(3)}">${esc(F.title)}</div>`}
const grainOf=(ctx,root)=>(ctx.root!=null?ctx.root:root)+"assets/era/_shared/paper-grain.webp";
const credit=F=>`Prices subject to change.${F.fam?" No alcohol served.":""} Images: TMDB.`;

const W=1344,H=960;
const E=[
 {paper:"#fbf8ef",ink:"#23302a",soft:"#52605a",rule:"#7aa38b",acc:"#b8322a",band:"#23302a",disp:"'Lobster',cursive",dw:"400",body:"'Barlow Condensed',sans-serif",cols:["Snacks","Hot Plates","Pie Case","Fountain"]},
 {paper:"#fbf3e2",ink:"#3a2414",soft:"#6a4c33",rule:"#d98b3a",acc:"#c4521c",band:"#3a2414",disp:"'Shrikhand',cursive",dw:"400",body:"'Barlow Condensed',sans-serif",cols:["Snacks","Hot Plates","Sweets","Drinks"]},
 {paper:"#f6f8f4",ink:"#1c2240",soft:"#4b5170",rule:"#5b7fbf",acc:"#e0457b",band:"#1c2240",disp:"'Bungee',cursive",dw:"400",body:"'Barlow Condensed',sans-serif",cols:["Snacks","Hot Plates","Sweets","Drinks"]},
 {paper:"#ffffff",ink:"#15181d",soft:"#4f555e",rule:"#9aa3ad",acc:"#ff4d2e",band:"#15181d",disp:"'Unbounded',sans-serif",dw:"700",body:"'Barlow Condensed',sans-serif",cols:["Small","Big","Sweet","Drinks"]}
];
const PEN="'Reenie Beanie',cursive";
loadFonts(["Lobster","Shrikhand","Bungee","Unbounded:wght@700","Barlow+Condensed:wght@500;700","Reenie+Beanie"]);

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Lanes":"Strike Lanes","Snack bar open till the last frame",{text:"Shoes back at the counter, and nobody steps over the line.",by:"The Front Desk"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  const acc=readable(F.pal.accent||e.acc,e.paper,4.5,e.acc),rule=e.rule;
  const paper=`<div style="position:absolute;inset:0;background:${e.paper}"></div><div style="position:absolute;inset:0;background:url(${grain}) center/1200px auto;opacity:${(.12+t.wear).toFixed(2)};mix-blend-mode:multiply"></div>`;

  /* header: lanes sign, logo, lane box */
  /* review 26b: the band sits M in from the top and sides, so the outside of the face is paper all round and the Save PDF bleed takes the paper, not navy */
  const M=26,BT=M,BH=100,HH=BT+BH;
  const vS=F.venue.length>30?28:F.venue.length>22?34:F.venue.length>14?40:46;
  const LBW=150,LGW=260;
  /* the poster beside it already carries the logo, so the header prints the title and year in the sign's type.
     No poster: the logo sits straight on the band with a soft glow; if it cannot read on the band it gives way to the title */
  const tS=F.title.length>22?24:F.title.length>14?30:F.title.length>8?36:42;
  const tText=`<div data-t style="text-align:center;color:#fff"><div style="font:${e.dw} ${tS}px/1.1 ${DF};${clamp(2)}">${esc(F.title)}</div>${F.year?`<div style="font:700 15px/1 ${BF};letter-spacing:.24em;color:${mix(acc,"#ffffff",.55)};margin-top:6px">${esc(F.year)}</div>`:""}</div>`;
  const lg=F.posSrc?null:logoImg(ctx,LGW-20,BH-24);
  const CHK=`try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,n=0,s=0;function l(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;n++;var L=.2126*l(d[k])+.7152*l(d[k+1])+.0722*l(d[k+2]);if((L+.05)/(${lum(e.band).toFixed(4)}+.05)>=3)s++}if(n&&s<n*.5){i.style.display='none';i.nextSibling.style.display='block'}}catch(e){}`;
  const titleBlock=lg?`<img src="${lg.src}" crossorigin="anonymous" alt="${esc(F.title)}" onload="${CHK}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(255,255,255,.35))"><div style="display:none">${tText}</div>`:tText;
  const BX=M+14;/* inner padding of the band */
  const header=`<div style="position:absolute;left:${M}px;top:${BT}px;width:${W-2*M}px;height:${BH}px;background:${e.band};border-radius:6px"></div>
    <div style="position:absolute;left:${BX+8}px;top:${BT+10}px;width:${W-2*BX-8-LBW-LGW-40}px;height:${BH-20}px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:${e.dw} ${vS}px/1.25 ${DF};color:#fff;white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
      <div style="font:700 17px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${mix(acc,"#ffffff",.55)};margin-top:6px;${clamp(1)}">${esc(F.sign)}</div></div>
    <div style="position:absolute;left:${W-BX-LBW-20-LGW}px;top:${BT+8}px;width:${LGW}px;height:${BH-16}px;display:flex;align-items:center;justify-content:center;box-sizing:border-box">${titleBlock}</div>
    <div style="position:absolute;left:${W-BX-LBW}px;top:${BT+8}px;width:${LBW}px;height:${BH-16}px;background:${e.paper};border:4px solid ${acc};box-sizing:border-box;text-align:center">
      <div style="font:700 15px/1 ${BF};letter-spacing:.24em;color:${e.soft};margin-top:7px">LANE</div>
      <div style="font:400 56px/1 ${PEN};color:${e.ink};margin-top:1px">${esc(F.num.slice(-2))}</div></div>`;

  /* left: poster and shoe hire tag */
  const LW=430,PY=HH+16;const PA=posterFit(LW-16,600);
  const pBox=`<div style="position:absolute;left:${M}px;top:${PY}px;width:${PA.w+16}px;height:${PA.h+16}px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.25);transform:rotate(${(t.tilt*.4).toFixed(2)}deg)"><div style="position:absolute;left:8px;top:8px;width:${PA.w}px;height:${PA.h}px;background:#222;overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div></div>`;
  const TY=PY+PA.h+40,TH=H-M-TY;const pr2=F.prop;
  const KIND={ticket:"TICKET",stub:"TICKET STUB",card:"CARD",receipt:"RECEIPT",slip:"SLIP",badge:"BADGE",tag:"TAG"};
  const pk=pr2&&F.fl.prop?String(F.fl.prop.kind||"").toLowerCase():"";
  const usePr=!!(pr2&&KIND[pk]);
  const tLab=usePr?KIND[pk]:"SHOE RENTAL",tTitle=usePr?pr2.title:"Size "+(+F.num%6+7),tLines=usePr?pr2.lines.slice(0,2):["Return at the counter"];
  const tag=`<div style="position:absolute;left:${M+16}px;top:${TY}px;width:${LW-40}px;height:${TH}px;box-sizing:border-box;background:${mix(acc,"#ffffff",.82)};border:2px solid ${acc};border-radius:10px;padding:12px 16px 10px 54px;transform:rotate(${(-t.tilt*.5).toFixed(2)}deg);box-shadow:0 3px 8px rgba(0,0,0,.18);overflow:hidden">
    <div style="position:absolute;left:16px;top:50%;width:22px;height:22px;margin-top:-11px;border-radius:50%;background:${e.paper};border:2px solid ${acc}"></div>
    <div style="font:700 15px/1 ${BF};letter-spacing:.22em;color:${acc}">${tLab}</div>
    <div style="font:700 ${tLines.length>1?24:26}px/1.1 ${BF};color:${e.ink};margin-top:6px;text-transform:uppercase;${clamp(tLines.length>1?1:2)}">${esc(tTitle)}</div>
    ${tLines.map(l=>`<div style="font:400 ${tLines.length>1?25:26}px/1.05 ${PEN};color:${e.soft};margin-top:3px;${clamp(1)}">${esc(l)}</div>`).join("")}</div>`;

  /* right: the score sheet */
  const GX=M+LW+18,GW=W-M-GX,GY=HH+16;
  /* review 26b: the lane notes box takes the height its quote needs (the total box needs 124), the sheet gets the rest */
  const nS=F.note.text.length>140?28:F.note.text.length>90?31:34,TW=210;
  const nLines=Math.min(3,wrapLines('"'+F.note.text+'" '+F.note.by,nS,GW-TW-14-32,.42));
  const NH=Math.max(124,Math.round(44+nLines*nS*1.05)),GH=H-M-GY-NH-12;
  const LBL=124,STRIP=34;
  /* a film can name its own course labels in film-flavour "labels" {s,m,w,d}, used only where set */
  const LB=(F.fl.labels&&typeof F.fl.labels==="object")?F.fl.labels:{},COLS=["s","m","w","d"].map((k,i)=>LB[k]?clean(LB[k]):e.cols[i]);
  const C0=sections(ctx,F,COLS),items0=itemsOf(ctx);
  /* review 26b (rule 8): the dearest dish prints first in its course. A luxury dish (DEAR) moves to the front of its course, then the prices run high to low */
  for(const k of Object.keys(items0)){const its=items0[k];items0[k]=its.filter(it=>DEAR.test((it&&it.n)||"")).concat(its.filter(it=>!DEAR.test((it&&it.n)||"")))}
  const pr0=prices(items0,F.ei,F.egg);
  for(const k of Object.keys(pr0)){const P=pr0[k];if(P&&P.length>1)pr0[k]=P.slice().sort((a,b)=>pval(b)-pval(a))}
  /* a course with four dishes takes two rows (three frames is the most that read well) */
  const C=[],items={},pr={};C0.forEach(([k,l])=>{const its=items0[k];if(its.length<=3){C.push([k,l]);items[k]=its;pr[k]=pr0[k];return}
    const a=Math.ceil(its.length/2);C.push([k,l]);items[k]=its.slice(0,a);pr[k]=pr0[k].slice(0,a);C.push([k+"2",""]);items[k+"2"]=its.slice(a);pr[k+"2"]=pr0[k].slice(a)});
  /* 14 Nov (menu scan): two courses of one dish each in a row (Kingpin's Sweets and Drinks) share one row, a frame each, so neither prints half empty */
  for(let i=0;i+1<C.length;i++){const [k1,l1]=C[i],[k2,l2]=C[i+1];if(l1&&l2&&items[k1].length===1&&items[k2].length===1){const k=k1+"+"+k2;items[k]=items[k1].concat(items[k2]);pr[k]=pr[k1].concat(pr[k2]);C.splice(i,2,[k,l1+" & "+l2])}}
  /* ruled rows under the courses: the film's winks (scene nods to watch for) and the showtime cue, at print size */
  const WK=F.winks.slice(0,5),CUEF=19,cueH=F.cue?Math.round(16+2*CUEF*1.3):0;
  const wkH=WK.length?Math.round(14+Math.ceil(WK.join(" /   ").length*12.5/(GW-LBL-24))*30):0;
  const NCW=.47;/* Barlow Condensed 500 note width per em, a touch generous so the note always gets its lines */
  const cellH=(tr,k)=>{const n=items[k].length,cw=(GW-LBL)/n;let m=0;items[k].forEach(it=>{const dl=Math.min(4,wrapLines(F.tx(it.n),tr.d,cw-26-(tr.d*2.2+14),.5));const nl=tr.nl?wrapLines(F.tx(it.note),tr.n,cw-24,NCW):0;m=Math.max(m,26+dl*tr.d*1.12+(nl?6+nl*tr.n*1.25:0))});return Math.max(m,tr.d*2.4)};
  /* only tiers that print notes: every note prints in full, and spare height goes to the rows after that */
  const NT=TIERS.filter(x=>x.nl);let tr=NT[NT.length-1];for(const x of NT){const tot=C.reduce((a,[k])=>a+cellH(x,k),0)+STRIP+cueH+wkH;if(tot<=GH-4){tr=x;break}}
  const rows=C.map(([k])=>cellH(tr,k));const extra=Math.max(0,GH-4-STRIP-cueH-wkH-rows.reduce((a,b)=>a+b,0));const add=Math.min(40,extra/Math.max(1,C.length));
  /* still left over: a real still from the film fills it, captioned */
  const left=Math.floor(extra-add*C.length),stH=left>100&&F.stillSrc?left:0;
  const bline=`1.5px solid ${rule}`;
  const strip=`<div style="display:flex;height:${STRIP}px;border-bottom:${bline};background:${mix(rule,e.paper,.82)}"><div style="flex:0 0 ${LBL}px;border-right:${bline};font:700 14px/${STRIP}px ${BF};letter-spacing:.2em;color:${e.soft};text-align:center">BOWLER</div>
    ${Array.from({length:10},(_,i)=>`<div style="flex:1;border-right:${i<9?bline:"0"};font:700 15px/${STRIP}px ${BF};color:${e.soft};text-align:center">${i+1}</div>`).join("")}</div>`;
  const rowHTML=([k,l],ri)=>{const its=items[k],h=Math.round(rows[ri]+add),cw=(GW-LBL)/its.length;
    return `<div style="display:flex;height:${h}px;border-bottom:${bline}">
      <div style="flex:0 0 ${LBL}px;border-right:${bline};display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:6px"><div style="font:400 ${l.length>9?30:36}px/1.1 ${PEN};color:${acc};text-align:center;transform:rotate(-4deg);${clamp(2)}">${esc(l)}</div></div>
      ${its.map((it,i)=>{const nl=tr.nl?wrapLines(F.tx(it.note),tr.n,cw-24,NCW):0,pb=Math.round(tr.d*2.2+14);return `<div style="flex:0 0 ${cw}px;position:relative;box-sizing:border-box;padding:10px 12px 8px;border-right:${i<its.length-1?bline:"0"};overflow:hidden">
        <div style="position:absolute;right:0;top:0;width:${pb}px;height:${Math.round(tr.d*1.5)}px;border-left:${bline};border-bottom:${bline};font:400 ${tr.d+8}px/${Math.round(tr.d*1.5)}px ${PEN};color:${e.ink};text-align:center">${pr[k][i]}</div>
        <div style="font:700 ${tr.d}px/1.12 ${BF};color:${e.ink};text-transform:uppercase;letter-spacing:.02em;margin-right:${pb-6}px;${clamp(3)}">${esc(F.tx(it.n))}</div>
        ${nl?`<div style="font:500 ${tr.n}px/1.25 ${BF};color:${e.soft};margin-top:6px;${clamp(nl+1)}">${esc(cap(F.tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`};
  const lab=(txt,sz)=>`<div style="flex:0 0 ${LBL}px;border-right:${bline};display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:6px"><div style="font:400 ${sz}px/1.05 ${PEN};color:${acc};text-align:center;transform:rotate(-4deg)">${txt}</div></div>`;
  const wkRow=WK.length?`<div style="display:flex;height:${wkH}px;border-bottom:${bline}">${lab("Watch<br>for",28)}<div style="flex:1;padding:8px 12px;box-sizing:border-box;font:400 30px/30px ${PEN};color:${e.ink};overflow:hidden">${WK.map((w,i)=>`<span style="white-space:nowrap">${esc(cap(w))}${i<WK.length-1?`<span style="color:${acc};margin:0 6px 0 10px">/</span>`:""}</span>`).join(" ")}</div></div>`:"";
  const stRow=stH?`<div style="display:flex;height:${stH}px;border-bottom:${bline}">${lab("On<br>screen",28)}<div style="flex:1;position:relative;margin:8px 12px;overflow:hidden">${photo(F.stillSrc,t.photo)}<div style="position:absolute;left:0;bottom:0;padding:3px 10px;background:rgba(0,0,0,.6);color:#fff;font:500 14px/1.2 ${BF}">${esc(F.title)}${F.year?" ("+esc(F.year)+")":""}</div></div></div>`:"";
  const cueRow=F.cue?`<div style="display:flex;height:${cueH}px">${lab("Notes",28)}<div style="flex:1;display:flex;align-items:center;padding:4px 12px;box-sizing:border-box">${cueLine(F,BF,e.soft,acc,CUEF)}</div></div>`:"";
  const sheet=`<div style="position:absolute;left:${GX}px;top:${GY}px;width:${GW}px;height:${GH}px;box-sizing:border-box;border:2.5px solid ${e.ink};background:${e.paper};overflow:hidden">${strip}${C.map(rowHTML).join("")}${stRow}${wkRow}${cueRow}</div>`;

  /* foot: lane notes and total */
  const NY=H-M-NH,n=F.note;
  const notes=`<div style="position:absolute;left:${GX}px;top:${NY}px;width:${GW-TW-14}px;height:${NH}px;box-sizing:border-box;border:2px solid ${rule};padding:8px 14px;background:repeating-linear-gradient(${e.paper} 0 31px,${mix(rule,e.paper,.6)} 31px 32px);overflow:hidden">
    <div style="font:700 14px/1 ${BF};letter-spacing:.2em;color:${e.soft}">LANE NOTES</div>
    <div style="font:400 ${nS}px/1.05 ${PEN};color:${e.ink};margin-top:4px;${clamp(3)}">"${esc(n.text)}" <span style="color:${acc};white-space:nowrap">${esc(n.by)}</span></div></div>
  <div style="position:absolute;left:${GX+GW-TW}px;top:${NY}px;width:${TW}px;height:${NH}px;box-sizing:border-box;border:2.5px solid ${e.ink};background:${e.paper};text-align:center;display:flex;flex-direction:column;justify-content:space-between;padding:8px 6px">
    <div style="font:700 14px/1 ${BF};letter-spacing:.22em;color:${e.soft}">TOTAL</div>
    <div style="font:400 56px/1 ${PEN};color:${acc}">300</div>
    <div style="font:500 13px/1.25 ${BF};color:${e.soft}">Prices subject to change.<br>${F.fam?"No alcohol served. ":""}Images: TMDB.</div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 62%,rgba(20,20,30,${(t.vig*.6).toFixed(2)}) 100%)"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden;background:${e.paper}">${paper}${header}${pBox}${tag}${sheet}${notes}${vig}</div>`]};
};
})();
