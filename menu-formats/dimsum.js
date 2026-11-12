const _ROOT_dimsum=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: dimsum. A yum cha order tick sheet on the table, one landscape face 1344x960.
   Left: the restaurant's header card with its logo panel and the poster as the hero, whole, under a lacquer red frame.
   Right (signature): the tick sheet. Table number in pen, then a ruled grid of dish, price and quantity boxes,
   tonight's dishes ticked off in pen, the trolley stamp in the margin column. Foot: the tea pot tag (prop) and the line
   heard from the trolley (the overheard quote). Era sets paper, ink and type; tone sets wear and photo. */
(function(){
const ID="dimsum",_ROOT=_ROOT_dimsum;

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
 {table:"#7d1c1a",paper:"#fbf6ea",ink:"#2a1a14",soft:"#62504a",red:"#b3211d",gold:"#c9a24a",disp:"'Marcellus SC',serif",body:"'Alegreya',serif",cw:.48,cwd:.54},
 {table:"#6e2a17",paper:"#f8efdc",ink:"#3a2412",soft:"#6a5038",red:"#c0391b",gold:"#d4a24a",disp:"'Marcellus SC',serif",body:"'Alegreya',serif",cw:.48,cwd:.54},
 {table:"#5e1420",paper:"#fdf9f1",ink:"#1f1a22",soft:"#57505e",red:"#c2183a",gold:"#d1a750",disp:"'Marcellus SC',serif",body:"'Source Sans 3',sans-serif",cw:.48,cwd:.53},
 {table:"#2b2a2a",paper:"#ffffff",ink:"#181818",soft:"#555555",red:"#d32f2f",gold:"#bfa36a",disp:"'Cormorant SC',serif",body:"'Inter Tight',sans-serif",cw:.5,cwd:.55}
];
loadFonts(["Marcellus+SC","Cormorant+SC:wght@500;700","Alegreya:ital,wght@0,400;0,700;1,400","Source+Sans+3:ital,wght@0,400;0,700;1,400","Inter+Tight:ital,wght@0,400;0,700;1,400","Caveat:wght@600"]);
const PEN="'Caveat',cursive";

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Tea House":"Golden Dragon Tea House","Yum cha daily from ten",{text:"Tick what you want, wave down the trolley, and never pour your own tea first.",by:"The Trolley Lady"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  const red=readable(F.pal.accent&&lum(F.pal.accent)<.3?F.pal.accent:e.red,e.paper,4.5,e.red),gold=e.gold;
  const table=`<div style="position:absolute;inset:0;background:${e.table}"></div><div style="position:absolute;inset:0;background:radial-gradient(ellipse at 40% 40%,rgba(255,255,255,.12),rgba(0,0,0,.25) 80%)"></div>
    <div style="position:absolute;inset:0;background:url(${grain}) center/900px auto;opacity:${(.2+t.wear*.4).toFixed(2)};mix-blend-mode:multiply"></div>`;
  const shadow="0 10px 22px rgba(0,0,0,.45)";

  /* left: header card and poster */
  const LX=34,LW=440,HT=34,HHt=150;
  const vS=F.venue.length>28?24:F.venue.length>18?28:34;
  const head=`<div style="position:absolute;left:${LX}px;top:${HT}px;width:${LW}px;height:${HHt}px;background:${e.paper};box-shadow:${shadow};box-sizing:border-box;padding:10px 16px;border-top:8px solid ${red};text-align:center">
    <div style="font:400 ${vS}px/1.2 ${DF};color:${red};letter-spacing:.04em;white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
    <div style="font:italic 400 16px/1.25 ${BF};color:${e.soft};${clamp(1)}">${esc(F.sign)}</div>
    <div data-dark="${e.ink}" data-light="${mix(e.paper,"#ffffff",.5)}" style="margin:8px auto 0;width:${LW-120}px;height:62px;background:${e.ink};display:flex;align-items:center;justify-content:center;padding:4px 10px;box-sizing:border-box">${logoOr(ctx,F,LW-140,54,DF,e.paper,"400")}</div></div>`;
  const PY=HT+HHt+20,PA=posterFit(LW-28,H-PY-34-28);
  const poster=`<div style="position:absolute;left:${LX+Math.round((LW-PA.w-28)/2)}px;top:${PY}px;width:${PA.w+28}px;height:${PA.h+28}px;background:linear-gradient(135deg,${mix(red,"#000000",.1)},${mix(red,"#000000",.45)});box-shadow:${shadow},inset 0 0 0 3px ${gold}">
    <div style="position:absolute;left:14px;top:14px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div></div>`;

  /* right: the tick sheet */
  const SX=LX+LW+30,SW=W-SX-34,ST=26,FH=170,SH=H-ST-26-FH-18;
  const TOPH=74,COLH=34,cueH=F.cue?42:0,STAMP=52,PRW=84,QTY=70;
  const C=sections(ctx,F,["Small Plates","Steamed and Fried","Sweet","Tea and Drinks"]),items=itemsOf(ctx),pr=prices(items,F.ei,F.egg);
  const GH=SH-TOPH-COLH-cueH-14,DW=SW-24-STAMP-PRW-QTY,NW=Math.round(DW*.4),TW2=DW-NW-24;
  /* one wide sheet: the dish on the left of its box, the note beside it, so notes never get squeezed out */
  let NLMAX=3;const rowH=(tr,it)=>{const dl=Math.min(3,wrapLines(F.tx(it.n),tr.d,NW-24,e.cwd*1.15)),nl=Math.min(NLMAX,wrapLines(F.tx(it.note),tr.n,TW2-24,e.cw*1.2));return Math.max(dl*tr.d*1.15,nl*tr.n*1.3)+14};
  const tot=tr=>C.reduce((a,[k])=>a+Math.round(tr.h*.9)+12+items[k].reduce((x,it)=>x+rowH(tr,it),0),0);
  let tr=null;for(const m of [3,2,1]){NLMAX=m;for(const x of TIERS){if(!x.nl)continue;if(tot(x)*1.08<=GH){tr=x;break}}if(tr)break}if(!tr)tr=TIERS.filter(x=>x.nl).slice(-1)[0];
  const spare=Math.max(0,GH-tot(tr)*1.08),nIt=C.reduce((a,[k])=>a+items[k].length,0),pad=6+Math.min(10,Math.floor(spare/Math.max(1,nIt)/2));
  const bl=`1.5px solid ${mix(red,e.paper,.55)}`;
  const rows=C.map(([k,l])=>`<div style="display:flex;height:${Math.round(tr.h*.9)+8}px;align-items:center;background:${mix(red,e.paper,.88)};border-bottom:${bl};margin-top:4px"><div style="flex:0 0 ${STAMP}px"></div><div style="flex:1;font:400 ${Math.round(tr.h*.72)}px/1 ${DF};color:${red};letter-spacing:.08em">${esc(l)}</div></div>`+
    items[k].map((it,i)=>{const nl=Math.min(NLMAX,wrapLines(F.tx(it.note),tr.n,TW2-24,e.cw*1.2));
      return `<div style="display:flex;border-bottom:${bl};align-items:stretch">
        <div style="flex:0 0 ${STAMP}px;border-right:${bl};display:flex;align-items:center;justify-content:center;font:700 15px/1 ${BF};color:${e.soft}">${String.fromCharCode(65+"smwd".indexOf(k))}${i+1}</div>
        <div style="flex:0 0 ${NW}px;box-sizing:border-box;padding:${pad}px 12px;display:flex;align-items:center"><div style="font:700 ${tr.d}px/1.15 ${BF};color:${e.ink};${clamp(3)}">${esc(F.tx(it.n))}</div></div>
        <div style="flex:1;min-width:0;padding:${pad}px 12px;display:flex;align-items:center"><div style="font:italic 400 ${tr.n}px/1.3 ${BF};color:${e.soft};${clamp(nl)}">${esc(cap(F.tx(it.note)))}</div></div>
        <div style="flex:0 0 ${PRW}px;border-left:${bl};display:flex;align-items:center;justify-content:center;font:700 ${tr.d}px/1 ${BF};color:${e.ink}">${pr[k][i]}</div>
        <div style="flex:0 0 ${QTY}px;border-left:${bl};display:flex;align-items:center;justify-content:center"><div style="width:38px;height:${Math.min(36,Math.round(tr.d*1.5))}px;border:2px solid ${mix(e.ink,e.paper,.4)};display:flex;align-items:center;justify-content:center;font:600 ${Math.round(tr.d*1.3)}px/1 ${PEN};color:#1f3fa0">${i===0?"&#10003;":""}</div></div></div>`}).join("")).join("");
  const colHead=`<div style="height:${COLH}px;display:flex;font:700 14px/${COLH}px ${BF};letter-spacing:.14em;color:${e.soft};border-bottom:2px solid ${red}"><div style="flex:0 0 ${STAMP}px;text-align:center">NO.</div><div style="flex:0 0 ${NW}px;padding-left:12px;box-sizing:border-box">DISH</div><div style="flex:1;padding-left:12px">FROM THE KITCHEN</div><div style="flex:0 0 ${PRW}px;text-align:center">PRICE</div><div style="flex:0 0 ${QTY}px;text-align:center">QTY</div></div>`;
  const grid=`<div style="position:absolute;left:12px;width:${SW-24}px;top:${TOPH}px;height:${GH+COLH}px;overflow:hidden">${colHead}${rows}</div>`;
  const sheet=`<div style="position:absolute;left:${SX}px;top:${ST}px;width:${SW}px;height:${SH}px;background:${e.paper};box-shadow:${shadow};overflow:hidden">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.1+t.wear*.4).toFixed(2)};mix-blend-mode:multiply"></div>
    <div style="position:absolute;left:12px;right:12px;top:10px;height:${TOPH-14}px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px double ${red}">
      <div style="font:400 30px/1.2 ${DF};color:${red};letter-spacing:.1em">ORDER SHEET</div>
      <div style="display:flex;align-items:baseline;gap:10px"><span style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${e.soft}">TABLE</span><span style="font:600 44px/1 ${PEN};color:#1f3fa0;border-bottom:2px solid ${e.soft};min-width:70px;text-align:center">${esc(F.num.slice(-2))}</span></div></div>
    ${grid}
    ${F.cue?`<div style="position:absolute;left:24px;right:24px;bottom:8px;height:${cueH-8}px">${cueLine(F,BF,e.soft,red,15)}</div>`:""}
    <div style="position:absolute;left:290px;top:14px;width:150px;height:46px;border:3px solid ${mix(red,e.paper,.15)};border-radius:6px;transform:rotate(-6deg);opacity:.6;display:flex;align-items:center;justify-content:center;font:400 17px/1 ${DF};color:${red};letter-spacing:.08em">TROLLEY CHECKED</div></div>`;

  /* foot: tea tag and the trolley line */
  const FY=H-26-FH,TW=290,pr2=F.prop,n=F.note,nS=n.text.length>130?16:n.text.length>80?18:20;
  const foot=`<div style="position:absolute;left:${SX}px;top:${FY}px;width:${TW}px;height:${FH}px;background:${mix(gold,"#ffffff",.55)};box-shadow:${shadow};box-sizing:border-box;padding:14px 16px 12px 46px;border-radius:6px;transform:rotate(${(t.tilt*.6).toFixed(2)}deg);overflow:hidden">
      <div style="position:absolute;left:14px;top:50%;margin-top:-10px;width:20px;height:20px;border-radius:50%;background:${e.table}"></div>
      <div style="font:700 14px/1 ${BF};letter-spacing:.22em;color:${mix(gold,"#000000",.55)}">TEA FOR THE TABLE</div>
      <div style="font:400 26px/1.15 ${DF};color:${e.ink};margin-top:8px;${clamp(2)}">${esc(pr2?pr2.title:"Jasmine")}</div>
      <div style="font:italic 400 15px/1.25 ${BF};color:${e.soft};margin-top:4px;${clamp(2)}">${esc(pr2&&pr2.lines.length?pr2.lines.slice(0,2).join(". "):"Lid off the pot for a refill")}</div></div>
    <div style="position:absolute;left:${SX+TW+20}px;top:${FY}px;width:${SW-TW-20}px;height:${FH}px;background:${e.paper};box-shadow:${shadow};box-sizing:border-box;padding:12px 18px;border-left:8px solid ${red};display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
      <div style="font:700 14px/1 ${BF};letter-spacing:.22em;color:${red}">FROM THE TROLLEY</div>
      <div style="font:italic 400 ${nS}px/1.32 ${BF};color:${e.ink};${clamp(3)}">"${esc(n.text)}"</div>
      <div style="display:flex;justify-content:space-between;gap:10px;font:400 14px/1.2 ${BF};color:${e.soft}"><b style="${clamp(1)}">${esc(n.by)}</b><span style="white-space:nowrap">${esc(credit(F))}</span></div></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${table}${head}${poster}${sheet}${foot}</div>`]};
};
})();
