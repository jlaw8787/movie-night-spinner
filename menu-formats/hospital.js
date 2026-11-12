const _ROOT_hospital=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: hospital. A patient meal order card on a clipboard, one landscape face 1344x960.
   Top: the patient wristband across the card (barcode, ward and bed) and the hospital's header with its logo panel.
   Left: the poster as the hero, whole, clipped to the clipboard.
   Right (signature): the meal order form. "Please tick your choices", a tick box beside every dish,
   tonight's picks ticked in pen. Foot: the nurse's note (a real film line prints quoted under "Overheard on the ward") and the kitchen's stamp.
   The film's winks sit on a slip under the poster; a column left well short takes a real film still.
   Era sets form colour and type; tone sets wear and photo. */
(function(){
const ID="hospital",_ROOT=_ROOT_hospital;

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
/* logo in its own colours, straight on the form paper at the top right with no box. The sampler judges each opaque pixel by its contrast
   with the paper (so a coloured logo is judged by how it reads, not by raw brightness); when under half of it reads, the logo hides and
   the film title and year (already there, hidden) show instead. A film whose poster carries the same logo sets hospital.noLogo */
const SAMPLE="try{var i=this,P=+i.getAttribute('data-pl'),c=document.createElement('canvas');c.width=96;c.height=Math.max(8,Math.round(96*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,n=0,ok=0,f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;n++;var L=.2126*f(d[k])+.7152*f(d[k+1])+.0722*f(d[k+2]);if((Math.max(L,P)+.05)/(Math.min(L,P)+.05)>=3)ok++}if(n&&ok<n*.5){i.style.display='none';var t=i.nextElementSibling;if(t)t.style.display='block'}}catch(e){}";
/* a wide logo is a real logo: it may come out as short as 22px before the title text takes over */
function logoImg(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a);if(h<22)return null;return{src:ctx.img(L[0],"w500"),w:Math.round(h*a),h:Math.round(h)}}
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
/* prices that make sense on one card: inside a course a dearer dish (lobster, steak, prawns...) never costs less than a plainer one,
   no two dishes in a course share a price, and dessert stays under the cheapest main. The house line keeps its spot at the bottom of
   its course (the list order is not touched). The film number hides in a dessert price only when it still fits those rules */
const DEAR=[[/\b(lobster|surf and turf|prime rib|wagyu|caviar|crayfish)\b/i,3],[/\b(steaks?|sirloin|rib ?eye|porterhouse|t-bone|fillet mignon|filet|veal|lamb rack|rack of lamb|scallops?|crab|oysters?)\b/i,2],[/\b(prawns?|shrimp|salmon|duck|lamb|pork belly|ribs|brisket|roast beef)\b/i,1]];
const dearness=it=>{const t=clean((it&&it.n)||"");for(const [re,v] of DEAR)if(re.test(t))return v;return 0};
function priceSteps(ei){/* the price endings this era prints, in order */
  if(ei<2)return v=>Math.max(.05,Math.ceil(v*20-1e-9)/20);if(ei>=6)return v=>Math.max(3,Math.ceil(v-1e-9));
  return v=>{const f=Math.floor(v),r=v-f;const e=[0,.25,.5,.75,.95].find(x=>x>=r-1e-9);return e===undefined?f+1:f+e}}
function money(v,ei){if(v<1&&ei<2)return "."+String(Math.round(v*100)).padStart(2,"0");if(ei>=6)return String(Math.round(v));return v.toFixed(2)}
function prices(menu,ei,egg,mult){
  mult=mult||{s:.55,m:1,w:.45,d:.3};const up=priceSteps(ei),step=ei<2?.05:ei>=6?1:.25;const val={};
  const ladder=(k,lo)=>{const its=menu[k]||[];const ord=its.map((it,i)=>i).sort((a,b)=>dearness(its[a])-dearness(its[b])||(its[b]&&its[b].extra?1:0)-(its[a]&&its[a].extra?1:0)||a-b);/* plain first, dear last; at the same level a card extra sits under a dish cooked tonight, as the shared priceSense wants */
    const v=[];let last=-1;ord.forEach((i,r)=>{let x=up(Math.max(BASE[ei]*mult[k]*(1+r*.15+dearness(its[i])*.2),lo||0));
      if(x<=last+1e-9)x=up(last+step);v[i]=x;last=x});return v};
  val.s=ladder("s");val.m=ladder("m",Math.max(0,...val.s)+step);
  const minM=Math.min(...(val.m.length?val.m:[Infinity]));
  val.w=ladder("w");if(val.w.length&&Math.max(...val.w)>=minM){/* squeeze dessert under the mains, keeping its order */
    const ord=(menu.w||[]).map((it,i)=>i).sort((a,b)=>dearness(menu.w[a])-dearness(menu.w[b])||a-b),n=ord.length;
    ord.forEach((i,r)=>{val.w[i]=Math.max(ei<2?.05:step,Math.round((minM-(n-r)*step)*100)/100)})}
  val.d=ladder("d");
  if(egg&&ei>=2&&ei<6&&val.w.length){const x=Math.max(1,Math.floor(val.w[0]))+(+egg)/100;if(+egg%5===0&&x<minM&&!val.w.slice(1).includes(x)&&(val.w.length<2||x<Math.min(...val.w.slice(1))||dearness(menu.w[0])>0))val.w[0]=x}
  const out={};for(const k of ["s","m","w","d"])out[k]=(val[k]||[]).map(v=>money(v,ei));
  const ps=window.priceSense?window.priceSense(menu,out):out;
  /* the shared pass can land two dishes of a course on one price: move the plainer one down a step, else the dearer one up */
  const num=x=>parseFloat(String(x).replace(/[^\d.]/g,"")),fix=v=>money(Math.round(v*100)/100,ei);
  for(const k of ["s","m","w","d"]){const a=ps[k]||[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(num(a[i])===num(a[j])){
    const lo=dearness((menu[k]||[])[i])<=dearness((menu[k]||[])[j])?i:j,hi=lo===i?j:i,dn=num(a[lo])-step,upv=num(a[hi])+step,vals=a.map(num);
    if(dn>0&&!vals.includes(Math.round(dn*100)/100)&&(k!=="m"||dn>Math.max(0,...(ps.s||[]).map(num),...(ps.w||[]).map(num))))a[lo]=fix(dn);else a[hi]=fix(upv)}}
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
/* notes print in full (fit counts every line a note needs, up to four); the small note tiers come before any tier that drops notes */
const TIERS=[{d:30,n:21,g:16,h:34,nl:2},{d:28,n:20,g:14,h:32,nl:2},{d:26,n:19,g:12,h:30,nl:2},{d:24,n:18,g:10,h:27,nl:2},{d:22,n:17,g:8,h:25,nl:2},{d:21,n:16,g:7,h:24,nl:2},{d:20,n:16,g:6,h:23,nl:2},{d:22,n:17,g:8,h:25,nl:1},{d:20,n:15,g:6,h:22,nl:1},{d:19,n:14,g:5,h:21,nl:1},{d:18,n:14,g:4,h:20,nl:1},{d:17,n:13,g:3,h:19,nl:2},{d:16,n:13,g:3,h:18,nl:2},{d:15,n:12,g:2,h:17,nl:2},{d:20,n:15,g:6,h:22,nl:0},{d:18,n:14,g:4,h:20,nl:0},{d:16,n:14,g:3,h:18,nl:0}];
/* sections into up to maxCols columns at the biggest type that fits; returns tier, column split and column width */
function fit(o){
  const {C,items,tx,W,H,gap=24,cw=.5,cwd=.56,caps=0,maxCols=2,minCols=1,maxItems=4,headX=14}=o;const priceW=o.priceW||(d=>d*2.6+10);
  const hh=o.headH||(tr=>tr.h*1.3+headX);let dmax=3,CW=W;
  const cH=(tr,k)=>hh(tr)+items[k].slice(0,maxItems).reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),cwd*(caps?1.12:1)));const nl=tr.nl?Math.min(4,wrapLines(tx(it.note),tr.n,CW-(o.indent||0),cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g+(o.itemX||0)},0);
  const splits=n=>{if(n===1)return [[C.length]];const out=[];if(n===2)for(let a=1;a<C.length;a++)out.push([a,C.length]);if(n===3)for(let a=1;a<C.length;a++)for(let b=a+1;b<C.length;b++)out.push([a,b,C.length]);return out};
  const tryTier=(tr,n)=>{CW=(W-gap*(n-1))/n;let best=null;for(const s of splits(n)){let st=0,m=0;const cols=[];const hs=[];for(const e of s){const sec=C.slice(st,e);cols.push(sec);const h=sec.reduce((x,[k])=>x+cH(tr,k),0);hs.push(h);m=Math.max(m,h);st=e}if(!best||m<best.m)best={m,cols,hs}}return best};
  for(const tr of TIERS)for(let n=minCols;n<=Math.min(maxCols,C.length);n++){const q=tryTier(tr,n);if(q&&q.m*1.02<=H)return {tr,cols:q.cols,hs:q.hs,CW,dmax,spare:H-q.m*1.02,n}}
  dmax=2;const tr=TIERS[TIERS.length-1],n=Math.min(maxCols,C.length),q=tryTier(tr,n);return {tr,cols:q.cols,hs:q.hs,CW,dmax,spare:0,n};
}
/* one course: heading plus dishes; o sets fonts, colours and the heading/row style */
function course(sec,items,pr,R,o){
  const [k,label]=sec,{tr,CW,dmax}=R;
  return `<div style="margin-bottom:${o.cgap||12}px">${o.head(label,tr,k)}${items[k].slice(0,o.maxItems||4).map((it,i)=>{const nl=tr.nl?Math.min(4,wrapLines(o.tx(it.note),tr.n,CW-(o.indent||0),o.cw||.5)):0;
    const lead=o.leader?`<span style="flex:1;min-width:16px;border-bottom:2px dotted ${o.lead||o.soft};transform:translateY(-6px)"></span>`:"";
    return `<div style="margin-bottom:${tr.g+(o.ig||0)}px;${o.indent?`padding-left:${o.indent}px;position:relative`:""}">${o.pre?o.pre(k,i,tr):""}
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="${o.leader?"flex:0 1 auto":"flex:1"};font:${o.nw||700} ${tr.d}px/1.15 ${o.nf};color:${o.ink};${o.caps?"text-transform:uppercase;letter-spacing:.04em;":""}${clamp(dmax)}">${esc(o.tx(it.n))}</span>${lead}<span style="font:${o.pw||700} ${tr.d+(o.pp||2)}px/1 ${o.pf||o.nf};color:${o.pc||o.ink};white-space:nowrap">${o.price?o.price(pr[k][i],k,i):pr[k][i]}</span></div>
      ${nl?`<div style="font:${o.ns||"400"} ${tr.n}px/1.3 ${o.bf};color:${o.soft};margin-top:3px;${clamp(nl+1)}">${esc(cap(o.tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
}
function sections(ctx,F,labels){return [["s",labels[0]],["m",labels[1]],["w",labels[2]],["d",F.drinks||labels[3]]].filter(([k])=>(ctx.menu[k]||[]).length)}
function itemsOf(ctx){const o={};for(const k of ["s","m","w","d"])o[k]=(ctx.menu[k]||[]).slice(0,4);return o}
function cueLine(F,bf,ink,acc,size){return F.cue?`<div data-fit="cue" style="font:italic 400 ${size||15}px/1.3 ${bf};color:${ink};${clamp(2)}"><b style="font-style:normal;color:${acc}">Showtime:</b> ${esc(cap(F.cue))}</div>`:""}
/* title and year in the layout's type, sized by its length so a short title stays on one line */
function titleText(F,maxW,maxH,df,color,dw,hidden){const t=F.title,L=t.length,one=Math.floor(maxW/(L*.56)),two=Math.floor(maxW/(Math.ceil(L*.55)*.56));
  const fs=one>=18?Math.min(Math.round(maxH*.5),one):Math.max(16,Math.min(Math.round(maxH*.34),two)),lines=one>=18?1:2;
  return `<div style="display:${hidden?"none":"block"};text-align:right"><div style="font:${dw||700} ${fs}px/1.05 ${df};color:${color};${lines===1?"white-space:nowrap":clamp(2)}">${esc(t)}</div>${F.year?`<div style="font:700 13px/1 ${df};color:${color};opacity:.75;letter-spacing:.3em;margin-top:5px">${esc(F.year)}</div>`:""}</div>`}
function logoOr(ctx,F,maxW,maxH,df,color,dw,panel,noLogo){const lg=noLogo?null:logoImg(ctx,maxW,maxH);
  return lg?`<img src="${lg.src}" crossorigin="anonymous" alt="${esc(F.title)}" data-pl="${lum(panel).toFixed(4)}" onload="${SAMPLE}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 0 5px rgba(255,255,255,.6))">${titleText(F,maxW,maxH,df,color,dw,1)}`:titleText(F,maxW,maxH,df,color,dw)}
const grainOf=(ctx,root)=>(ctx.root!=null?ctx.root:root)+"assets/era/_shared/paper-grain.webp";
const credit=F=>`Prices subject to change.${F.fam?" No alcohol served.":""} Images: TMDB.`;

const W=1344,H=960;
/* cw and cwd: average glyph width per px of font for notes and bold names, measured off proofs (Libre Franklin about .43 and .45,
   Plex Sans Condensed about .36 and .37) with a margin. Too high and the shorter column is left with a big blank */
const E=[
 {form:"#eef4ee",ink:"#1f2a24",soft:"#55635a",rule:"#8fb59b",acc:"#2f7a52",band:"#ffffff",disp:"'Libre Franklin',sans-serif",body:"'Libre Franklin',sans-serif",cw:.47,cwd:.5},
 {form:"#f3efdc",ink:"#2c2614",soft:"#62593e",rule:"#c2ad6a",acc:"#8a6a1c",band:"#fffdf3",disp:"'Libre Franklin',sans-serif",body:"'Libre Franklin',sans-serif",cw:.47,cwd:.5},
 {form:"#eaf2f7",ink:"#18263a",soft:"#4d5c70",rule:"#8fb0cc",acc:"#1f5fa8",band:"#ffffff",disp:"'IBM Plex Sans Condensed',sans-serif",body:"'IBM Plex Sans Condensed',sans-serif",cw:.44,cwd:.46},
 {form:"#f2f6f8",ink:"#13202b",soft:"#4a5866",rule:"#a7bccb",acc:"#0d7a8a",band:"#ffffff",disp:"'Inter Tight',sans-serif",body:"'Inter Tight',sans-serif",cw:.47,cwd:.5}
];
loadFonts(["Libre+Franklin:ital,wght@0,400;0,700;1,400","IBM+Plex+Sans+Condensed:ital,wght@0,400;0,700;1,400","Inter+Tight:ital,wght@0,400;0,700;1,400","Caveat:wght@600","Courier+Prime:wght@400;700"]);
const PEN="'Caveat',cursive";

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" General":"County General","Patient meal service",{text:"Ring the buzzer if you want the jelly, not because you're bored.",by:"Ward Nurse"});
  /* per-film hospital settings (data/film-flavour.json "hospital"): noLogo: the title and year sit in the sign panel instead of the logo;
     returnBy: the line at the top right of the order form (default "Hand to the duty nurse") */
  const HS=F.fl.hospital||{};
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  const acc=readable(F.pal.accent&&lum(F.pal.accent)<.35?F.pal.accent:e.acc,e.form,4.5,e.acc),rule=e.rule;
  const bg=`<div style="position:absolute;inset:0;background:#8a6a48"></div><div style="position:absolute;inset:0;background:url(${grain}) center/900px auto;opacity:.5;mix-blend-mode:multiply"></div>
    <div style="position:absolute;left:18px;top:18px;right:18px;bottom:18px;background:${e.form};box-shadow:0 8px 20px rgba(0,0,0,.4)"></div>
    <div style="position:absolute;left:18px;top:18px;right:18px;bottom:18px;background:url(${grain}) center/1100px auto;opacity:${(.08+t.wear*.4).toFixed(2)};mix-blend-mode:multiply"></div>`;

  /* top: header and wristband. The second line never repeats the venue */
  const M=40,HH=96,PW=300;
  const vS=F.venue.length>30?28:F.venue.length>20?34:40;
  const low=x=>x.toLowerCase().replace(/[^a-z0-9 ]/g,"").trim(),sg0=low(F.sign.split(",")[0]);
  const sign=(sg0&&(low(F.venue).includes(sg0)||sg0.includes(low(F.venue))))?"Patient meal service":F.sign;
  const header=`<div style="position:absolute;left:${M}px;top:${M}px;width:${W-2*M-PW-20}px;height:${HH}px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 ${vS}px/1.2 ${DF};color:${acc};white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
      <div style="font:700 15px/1.2 ${BF};letter-spacing:.22em;text-transform:uppercase;color:${e.soft};${clamp(1)}">${esc(sign.replace(/[.\s]+$/,""))} &middot; Meal order</div></div>
    <div style="position:absolute;right:${M}px;top:${M}px;width:${PW}px;height:${HH}px;display:flex;align-items:center;justify-content:flex-end;box-sizing:border-box">${logoOr(ctx,F,PW,HH-20,DF,e.ink,"700",e.form,HS.noLogo)}</div>`;
  const WY=M+HH+8,WBH=56;/* wristband name: flavour "patient" (a person in the film), else a blank to fill in */
  const band=`<div style="position:absolute;left:0;top:${WY}px;width:${W}px;height:${WBH}px;background:${e.band};border-top:2px solid ${mix(rule,"#ffffff",.3)};border-bottom:2px solid ${mix(rule,"#ffffff",.3)};box-shadow:0 3px 6px rgba(0,0,0,.15);display:flex;align-items:center;gap:22px;padding:0 ${M+10}px;box-sizing:border-box">
    <div style="flex:0 0 190px;height:34px;background:repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 7px,transparent 7px 9px,#111 9px 10px,transparent 10px 13px)"></div>
    <div style="flex:1;min-width:0;font:700 17px/1.2 'Courier Prime',monospace;color:#222;white-space:nowrap;overflow:hidden">PATIENT: ${F.fl.patient?esc(clean(F.fl.patient).toUpperCase()):"________________"}</div>
    <div style="flex:0 0 auto;font:700 17px/1.2 'Courier Prime',monospace;color:#222">WARD ${esc(String.fromCharCode(65+(+F.num||0)%6))}</div>
    <div style="flex:0 0 auto;font:700 17px/1.2 'Courier Prime',monospace;color:#fff;background:${acc};padding:4px 10px">BED ${esc(F.num.slice(-2))}</div></div>`;

  /* left: clipboard with the poster, and the film's winks on a slip under it */
  const CY=WY+WBH+24,CW=420,CH=H-M-CY+10,SLW=CW-44,WK=F.winks.slice(0,5).map(F.tx);
  const wkL=WK.map(w=>wrapLines(w,14,SLW-44,.56)),SH=WK.length?34+wkL.reduce((a,b)=>a+b,0)*18+WK.length*3+10:0;
  const PA=posterFit(CW-44,CH-80-(SH?SH+14:0));
  const slip=SH?`<div style="position:absolute;left:22px;top:${56+PA.h+14}px;width:${SLW}px;height:${SH}px;box-sizing:border-box;background:#fffef6;box-shadow:0 2px 5px rgba(0,0,0,.3);padding:9px 14px">
      <div style="font:700 12px/1 ${BF};letter-spacing:.2em;color:${e.soft};margin-bottom:7px">SCENES TO WATCH FOR</div>
      ${WK.map(w=>`<div style="position:relative;padding-left:18px;margin-bottom:3px;font:400 14px/18px ${BF};color:${e.ink}"><span style="position:absolute;left:0;top:-1px;font:600 18px/18px ${PEN};color:#1f3fa0">&#10003;</span>${esc(cap(w))}</div>`).join("")}</div>`:"";
  const clip=`<div style="position:absolute;left:${M-6}px;top:${CY}px;width:${CW}px;height:${CH}px;background:linear-gradient(135deg,#a77d52,#7e5a37);border-radius:12px;box-shadow:0 8px 18px rgba(0,0,0,.35)">
    <div style="position:absolute;left:${Math.round((CW-PA.w)/2)}px;top:56px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.4)">${hero(F,PA.w,PA.h,t.photo)}</div>${slip}
    <div style="position:absolute;left:${CW/2-90}px;top:-10px;width:180px;height:48px;border-radius:10px;background:linear-gradient(180deg,#e8ebee,#9aa1a8 60%,#c4c9ce);box-shadow:0 3px 6px rgba(0,0,0,.4)"></div></div>`;

  /* right: the form */
  const FX=M+CW+24,FW=W-M-FX,FY0=CY,NH=150,FHt=H-M-FY0-NH-16,cueH=F.cue?42:0,BOX=34;
  const C=sections(ctx,F,["Starters","Main Meal","Dessert","Drinks"]),items=itemsOf(ctx),pr=prices(items,F.ei,F.egg);
  const MW=FW-36,MH=FHt-56-cueH-12;
  const R=fit({C,items,tx:F.tx,W:MW,H:MH,maxCols:2,gap:26,cw:e.cw,cwd:e.cwd,indent:BOX+12,priceW:d=>BOX+12+d*2.6+10});
  const head=(l,tr)=>`<div style="font:700 ${Math.round(tr.h*.8)}px/1.2 ${DF};color:${acc};text-transform:uppercase;letter-spacing:.12em;border-bottom:2px solid ${rule};padding-bottom:3px;margin-bottom:8px">${esc(l)}</div>`;
  const pre=(k,i,tr)=>`<div style="position:absolute;left:0;top:2px;width:${BOX-6}px;height:${BOX-6}px;border:2.5px solid ${e.ink};background:#fff;display:flex;align-items:center;justify-content:center;font:600 ${BOX+6}px/1 ${PEN};color:#1f3fa0">${i===0?"&#10003;":""}</div>`;
  const o={head,pre,indent:BOX+12,tx:F.tx,nf:BF,bf:BF,ink:e.ink,soft:e.soft,pc:e.soft,pw:400,pp:-2,cw:e.cw,leader:1,lead:mix(e.soft,e.form,.55)};
  /* each column spends its own spare height on its own course gaps (capped), and a big patch still left takes a film still */
  let stillUsed=false;
  const colHtml=(col,ci)=>{const spare=Math.max(0,MH-(R.hs?R.hs[ci]:MH)*1.02-30),/* 30px held back: the height estimate runs up to about 20px either way */nIt=col.reduce((a,[k])=>a+Math.min(4,items[k].length),0),ig=Math.min(10,spare*.4/Math.max(1,nIt)),
      gaps=col.length-1,add=gaps?Math.min(28,(spare-ig*nIt)/gaps):0,left=spare-ig*nIt-add*gaps;/* the gap after a column's last course is blank, not spacing */
    const oc=Object.assign({},o,{cgap:12+add,ig}),ol=Object.assign({},o,{cgap:12,ig});let still="";
    if(left+30>100&&F.stillSrc&&!stillUsed){stillUsed=true;const sh=Math.min(300,Math.round(left-4));
      still=`<div style="margin-top:2px;height:${sh}px;box-sizing:border-box;background:#fff;padding:6px 6px 0;box-shadow:0 2px 5px rgba(0,0,0,.25);display:flex;flex-direction:column">
        <div style="flex:1;position:relative;overflow:hidden;background:#111">${photo(F.stillSrc,t.photo,"center 35%")}</div>
        <div style="flex:0 0 22px;font:400 13px/22px ${BF};color:${e.soft};white-space:nowrap;overflow:hidden">${esc(F.title)}${F.year?` (${esc(F.year)})`:""}, film still</div></div>`}
    return `<div style="flex:0 0 ${R.CW}px">${col.map((s,si)=>course(s,items,pr,R,si===col.length-1?ol:oc)).join("")}${still}</div>`};
  const form=`<div style="position:absolute;left:${FX}px;top:${FY0}px;width:${FW}px;height:${FHt}px;box-sizing:border-box;border:2px solid ${rule};background:${mix(e.form,"#ffffff",.5)}">
    <div style="position:absolute;left:18px;right:18px;top:12px;height:34px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${e.ink}"><span style="font:700 19px/1 ${DF};color:${e.ink}">Please tick your choices</span><span style="font:400 15px/1 ${BF};color:${e.soft}">${esc(HS.returnBy||"Hand to the duty nurse")}</span></div>
    <div style="position:absolute;left:18px;top:56px;width:${MW}px;height:${MH}px;display:flex;gap:26px;overflow:hidden">${R.cols.map(colHtml).join("")}</div>
    ${F.cue?`<div style="position:absolute;left:18px;right:18px;bottom:8px;height:${cueH-8}px;border-top:1px solid ${rule};padding-top:5px">${cueLine(F,BF,e.soft,acc,15)}</div>`:""}</div>`;
  /* foot: a real line from the film prints in quote marks under "Overheard"; house copy prints plain as the nurse's note */
  const n=F.note,isQ=!!(F.fl.note&&F.fl.note.kind==="quote"),NY=H-M-NH,nS=n.text.length>130?24:n.text.length>80?27:30,SW2=200;
  const note=`<div style="position:absolute;left:${FX}px;top:${NY}px;width:${FW-SW2-16}px;height:${NH}px;box-sizing:border-box;border:2px solid ${rule};background:repeating-linear-gradient(#fffef6 0 29px,${mix(rule,"#ffffff",.5)} 29px 30px);padding:8px 14px;overflow:hidden">
      <div style="font:700 14px/1 ${BF};letter-spacing:.2em;color:${e.soft}">${isQ?"OVERHEARD ON THE WARD":"NURSE'S NOTE"}</div>
      <div style="font:600 ${nS}px/1.1 ${PEN};color:#1f3fa0;margin-top:4px;${clamp(3)}">${isQ?`&ldquo;${esc(n.text)}&rdquo;`:esc(n.text)} <span style="color:${acc}">${esc(n.by)}</span></div></div>
    <div style="position:absolute;left:${FX+FW-SW2}px;top:${NY}px;width:${SW2}px;height:${NH}px;box-sizing:border-box;border:2px solid ${rule};background:${mix(e.form,"#ffffff",.5)};display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:10px">
      <div style="width:150px;height:76px;border:3px solid ${acc};border-radius:6px;transform:rotate(-6deg);display:flex;flex-direction:column;align-items:center;justify-content:center;font:700 15px/1.2 ${BF};color:${acc};letter-spacing:.12em;opacity:.8;text-align:center">WARD KITCHEN<br><span style="font-size:14px">${esc(F.year||"")}</span></div>
      <div style="font:400 14px/1.2 ${BF};color:${e.soft};text-align:center;${clamp(2)}">${esc(credit(F))}</div></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${bg}${header}${band}${clip}${form}${note}</div>`]};
};
})();
