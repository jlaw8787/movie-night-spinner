const _ROOT_clubhouse=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: clubhouse. A golf club's 19th hole menu set out as a scorecard, one landscape face 1344x960.
   Left: the card's cover in club colours: logo panel, the venue as the club name, the poster as the hero, whole, with a gilt rule.
   Right (signature): the scorecard. Hole, dish and par columns; courses run as Front Nine, The Turn, Back Nine and 19th Hole,
   dishes numbered as holes, prices as par with one pencilled in. Foot: local rules (the film's winks) and the marker's line
   (the overheard quote, signed in pencil). Era sets club colours and type; tone sets wear and photo. */
(function(){
const ID="clubhouse",_ROOT=_ROOT_clubhouse;

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
function prices(menu,ei,egg,mult){
  mult=mult||{s:.55,m:1,w:.45,d:.3};const out={};let hid=false;
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).map((it,i)=>{let v=BASE[ei]*mult[k]*(1+i*.15);v=ei<2?Math.max(.05,Math.round(v*20)/20):ei>=6?Math.max(3,Math.round(v)):Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"&&ei>=2&&ei<6){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)});
  return window.priceSense?window.priceSense(menu,out):out;
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
 {club:"#1f3d2b",gilt:"#c9a85a",paper:"#fbf8ee",ink:"#1d2a22",soft:"#55635a",rule:"#7c9a84",disp:"'Playfair Display SC',serif",dw:"700",body:"'Lora',serif",cw:.5,cwd:.55,cols:["Front Nine","The Turn","Back Nine","19th Hole"]},
 {club:"#2c4a2a",gilt:"#d8a64a",paper:"#f8f1df",ink:"#2c2416",soft:"#655a44",rule:"#a8925c",disp:"'Coustard',serif",dw:"900",body:"'Lora',serif",cw:.5,cwd:.55,cols:["Front Nine","The Turn","Back Nine","19th Hole"]},
 {club:"#173b33",gilt:"#d4b062",paper:"#fafaf4",ink:"#16261f",soft:"#4f5f57",rule:"#7fa093",disp:"'Cormorant SC',serif",dw:"700",body:"'Libre Franklin',sans-serif",cw:.52,cwd:.56,cols:["Front Nine","The Turn","Back Nine","19th Hole"]},
 {club:"#14231c",gilt:"#c8b07a",paper:"#ffffff",ink:"#121815",soft:"#4b544f",rule:"#a4b0aa",disp:"'Fraunces',serif",dw:"700",body:"'Inter Tight',sans-serif",cw:.5,cwd:.55,cols:["Front Nine","The Turn","Back Nine","19th Hole"]}
];
const PEN="'Nothing You Could Do',cursive";
loadFonts(["Playfair+Display+SC:wght@400;700","Coustard:wght@400;900","Cormorant+SC:wght@500;700","Fraunces:wght@700","Lora:ital,wght@0,400;0,700;1,400","Libre+Franklin:ital,wght@0,400;0,700;1,400","Inter+Tight:ital,wght@0,400;0,700;1,400","Nothing+You+Could+Do"]);

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=16?t+" Country Club":"The Clubhouse","Members and guests",{text:"Replace your divots, rake the bunkers, and settle up at the bar.",by:"The Club Captain"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  const club=F.pal.dark&&lum(F.pal.dark)<.08?F.pal.dark:e.club,gilt=e.gilt,acc=readable(F.pal.accent||"#b33a2a",e.paper,4.5,"#a3322a");

  /* left: the cover */
  const LW=468,P=30;
  const lgH=110,PY=P+lgH+16;
  const vS=F.venue.length>28?26:F.venue.length>18?32:38;
  const PA=posterFit(LW-2*P-20,H-PY-150);
  const cover=`<div style="position:absolute;left:0;top:0;width:${LW}px;height:${H}px;background:${club}">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.1+t.wear*.6).toFixed(2)};mix-blend-mode:screen"></div>
    <div style="position:absolute;inset:14px;border:2px solid ${gilt};opacity:.85"></div><div style="position:absolute;inset:20px;border:1px solid ${gilt};opacity:.5"></div>
    <div data-dark="rgba(0,0,0,.25)" data-light="rgba(250,246,234,.92)" style="position:absolute;left:${P+10}px;top:${P+6}px;width:${LW-2*P-20}px;height:${lgH}px;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box">${logoOr(ctx,F,LW-2*P-40,lgH-16,DF,gilt,e.dw)}</div>
    <div style="position:absolute;left:${Math.round((LW-PA.w)/2)-6}px;top:${PY}px;width:${PA.w+12}px;height:${PA.h+12}px;background:${gilt}"><div style="position:absolute;left:6px;top:6px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div></div>
    <div style="position:absolute;left:${P+10}px;right:${P+10}px;top:${PY+PA.h+26}px;text-align:center">
      <div style="font:${e.dw} ${vS}px/1.2 ${DF};color:${mix(gilt,"#ffffff",.25)};${clamp(2)}">${esc(F.venue)}</div>
      <div style="font:italic 400 17px/1.3 ${BF};color:${mix(gilt,club,.25)};margin-top:6px;${clamp(1)}">${esc(F.sign)}</div></div></div>`;

  /* right: the scorecard */
  const RX=LW+28,RW=W-RX-28,TOP=28;
  const FH=176,cueH=F.cue?42:0,HDR=40;
  const C=sections(ctx,F,e.cols),items=itemsOf(ctx),pr=prices(items,F.ei,F.egg);
  const HOLE=66,PAR=96;
  const MH=H-TOP-FH-24-HDR-cueH-10;
  const GAP=18,R=fit({C,items,tx:F.tx,itemX:14,W:RW,H:MH,maxCols:2,gap:GAP+HOLE+PAR+8,cw:e.cw,cwd:e.cwd,priceW:()=>0,headH:tr=>Math.round(tr.h*.8)+16});
  /* two cards side by side when it needs them: front nine on the left, back nine on the right, as a real scorecard folds out */
  const colW=R.n>1?Math.floor((RW-GAP)/2):RW;
  const tr=R.tr,bl=`1.5px solid ${e.rule}`;
  let ring=["m",0];if(F.egg&&items.w&&items.w.length)ring=["w",0];
  let hole=0;const nIt=Math.max(...R.cols.map(col=>col.reduce((a,[k])=>a+items[k].length,0)));const pad=6+Math.max(0,Math.min(8,Math.floor(R.spare/Math.max(1,nIt)/2)));
  const rowsOf=col=>col.map(([k,l])=>`<div style="display:flex;align-items:center;height:${Math.round(tr.h*.8)+12}px;background:${club};color:${gilt};font:700 ${Math.round(tr.h*.62)}px/1 ${BF};letter-spacing:.2em;text-transform:uppercase;padding:0 14px;margin-top:4px">${esc(l)}</div>`+
    items[k].map((it,i)=>{hole++;const nl=tr.nl?Math.min(tr.nl,wrapLines(F.tx(it.note),tr.n,colW-HOLE-PAR-30,e.cw)):0,rg=ring[0]===k&&ring[1]===i;
      return `<div style="display:flex;border-bottom:${bl};align-items:stretch">
        <div style="flex:0 0 ${HOLE}px;border-right:${bl};display:flex;align-items:center;justify-content:center;font:700 ${Math.round(tr.d*.9)}px/1 ${BF};color:${e.soft}">${hole}</div>
        <div style="flex:1;min-width:0;padding:${pad}px 12px">
          <div style="font:700 ${tr.d}px/1.15 ${BF};color:${e.ink};${clamp(R.dmax)}">${esc(F.tx(it.n))}</div>
          ${nl?`<div style="font:italic 400 ${tr.n}px/1.3 ${BF};color:${e.soft};margin-top:2px;${clamp(nl)}">${esc(cap(F.tx(it.note)))}</div>`:""}</div>
        <div style="flex:0 0 ${PAR}px;border-left:${bl};display:flex;align-items:center;justify-content:center;position:relative;font:700 ${tr.d}px/1 ${BF};color:${e.ink}">${pr[k][i]}${rg?`<span style="position:absolute;left:50%;top:50%;width:${PAR-18}px;height:${Math.round(tr.d*1.9)}px;margin:-${Math.round(tr.d*.95)}px 0 0 -${(PAR-18)/2}px;border:2.5px solid ${acc};border-radius:50%;transform:rotate(-8deg);opacity:.85"></span>`:""}</div></div>`}).join("")).join("");
  const hdr=`<div style="display:flex;height:${HDR}px;background:${mix(e.rule,e.paper,.75)};border-bottom:2px solid ${club};font:700 15px/${HDR}px ${BF};letter-spacing:.16em;color:${club};text-transform:uppercase"><div style="flex:0 0 ${HOLE}px;text-align:center;border-right:${bl}">Hole</div><div style="flex:1;padding-left:12px;white-space:nowrap;overflow:hidden">At the 19th</div><div style="flex:0 0 ${PAR}px;text-align:center;border-left:${bl}">Par</div></div>`;
  const card=R.cols.map((col,ci)=>`<div style="position:absolute;left:${RX+ci*(colW+GAP)}px;top:${TOP}px;width:${colW}px;height:${MH+HDR+(F.cue?0:0)+5}px;box-sizing:border-box;border:2.5px solid ${club};background:${e.paper};overflow:hidden">${hdr}<div style="height:${MH}px;overflow:hidden">${rowsOf(col)}</div></div>`).join("")+
    (F.cue?`<div style="position:absolute;left:${RX}px;width:${RW}px;top:${TOP+MH+HDR+12}px;height:${cueH-8}px">${cueLine(F,BF,e.soft,acc,15)}</div>`:"");

  /* foot: local rules and the marker's line */
  const FY=H-28-FH,RLW=Math.round(RW*.5);
  const rules=F.winks.slice(0,3);const n=F.note,nS=n.text.length>130?26:n.text.length>80?29:32;
  const foot=`<div style="position:absolute;left:${RX}px;top:${FY}px;width:${RLW-12}px;height:${FH}px;box-sizing:border-box;border:2px solid ${club};background:${e.paper};padding:10px 14px;overflow:hidden">
      <div style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${club};text-transform:uppercase">Local Rules</div>
      ${(rules.length?rules:["Members' bar closes at sundown"]).map((r,i)=>`<div style="display:flex;gap:8px;margin-top:7px;font:400 15px/1.25 ${BF};color:${e.ink}"><b style="flex:0 0 auto;color:${acc}">${i+1}.</b><span style="${clamp(2)}">${esc(r)}</span></div>`).join("")}<div style="position:absolute;left:14px;bottom:8px;font:400 14px/1 ${BF};color:${e.soft}">${esc(credit(F))}</div></div>
    <div style="position:absolute;left:${RX+RLW}px;top:${FY}px;width:${RW-RLW}px;height:${FH}px;box-sizing:border-box;border:2px solid ${club};background:${e.paper};padding:10px 14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
      <div style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${club};text-transform:uppercase">Marker's Note</div>
      <div style="font:400 ${nS}px/1.1 ${PEN};color:${e.ink};${clamp(3)}">"${esc(n.text)}"</div>
      <div style="display:flex;align-items:flex-end;gap:10px;border-top:1px solid ${e.rule};padding-top:4px"><span style="font:700 14px/1 ${BF};letter-spacing:.14em;color:${e.soft}">SIGNED</span><span style="flex:1;font:400 26px/1.2 ${PEN};color:${acc};white-space:nowrap;overflow:hidden">${esc(n.by)}</span></div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 60% 50%,rgba(0,0,0,0) 64%,rgba(10,20,10,${(t.vig*.5).toFixed(2)}) 100%)"></div>`;
  const bg=`<div style="position:absolute;inset:0;background:${mix(e.paper,club,.08)}"></div><div style="position:absolute;inset:0;background:url(${grain}) center/1200px auto;opacity:${(.1+t.wear).toFixed(2)};mix-blend-mode:multiply"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${bg}${cover}${card}${foot}${vig}</div>`]};
};
})();
