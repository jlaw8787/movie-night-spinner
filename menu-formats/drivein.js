const _ROOT_drivein=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: drivein. A drive-in carhop tray card, one landscape face 1344x960.
   Left: the big screen at dusk with the poster on it as the hero, whole, on its posts.
   Right (signature): the carhop menu card clipped to a window tray: neon script venue, the menu with dot leaders,
   then the order slip with the bay number and the line heard over the speaker post (the overheard quote).
   Era sets sky, card and type; tone sets wear and photo. */
(function(){
const ID="drivein",_ROOT=_ROOT_drivein;

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
  /* count down: the first cooked dish is dearest, house lines sit under the cooked ones */
  for(const k of ["s","m","w","d"]){const its=menu[k]||[],cooked=its.filter(x=>!x.house).length;let ci=0;
   out[k]=its.map((it,i)=>{const r=it.house?-1:(cooked-1-ci++);let v=BASE[ei]*mult[k]*(1+Math.max(-.5,r)*.15);v=ei<2?Math.max(.05,Math.round(v*20)/20):ei>=6?Math.max(3,Math.round(v)):Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"&&ei>=2&&ei<6){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)})}
  return tidyPrices(menu,window.priceSense?window.priceSense(menu,out):out);
}
/* after the shared pass: a dearer dish (steak, lobster, prawns, prime rib, surf and turf) never costs less than a plainer one in its course,
   no two items in a course share a price, and every sweet sits below the cheapest main */
const DEAR=/\b(lobster|steaks?|prime rib|surf and turf|prawns?|shrimp|scallops?|crab|rib ?eye|sirloin|t-bone|filet|fillet mignon|wagyu)\b/i;
function tidyPrices(menu,P){
  const val=x=>{const n=parseFloat(String(x).replace(/[^\d.]/g,""));return isNaN(n)?null:n};
  const fmt=(v,o)=>{o=String(o);const pre=(o.match(/^[^\d.]*/)||[""])[0],post=(o.match(/[^\d.]*$/)||[""])[0];if(/^\D*\.\d\d/.test(o)&&v<1)return pre+"."+String(Math.round(v*100)).padStart(2,"0")+post;return pre+(/\./.test(o)?v.toFixed(2):String(Math.round(v)))+post};
  const out={},order={};
  for(const k of ["s","m","w","d"]){const L=(P[k]||[]).slice(),its=menu[k]||[];order[k]=its.map((_,i)=>i);if(!L.length){out[k]=L;continue}
    const v=L.map(val);if(v.some(x=>x==null)){out[k]=L;continue}
    const dec=L.some(x=>/\./.test(String(x))),step=dec?(v[0]<1?.05:.5):1;
    const isDear=i=>its[i]&&DEAR.test(its[i].n||"");
    const plainMax=Math.max(0,...v.filter((x,i)=>!isDear(i)));
    v.forEach((x,i)=>{if(isDear(i)&&x<=plainMax)v[i]=plainMax+step});
    /* print order (rule 8): cooked dishes dearest first, house lines last; each line costs less than the one above it */
    const ord=its.map((_,i)=>i).filter(i=>i<v.length&&!its[i].house).sort((a,b)=>v[b]-v[a]||a-b).concat(its.map((_,i)=>i).filter(i=>i<v.length&&its[i].house));
    const nv=ord.map(i=>v[i]);for(let j=1;j<nv.length;j++)if(nv[j]>nv[j-1]-step/2)nv[j]=nv[j-1]-step;
    const lo=dec?step:1;if(nv[nv.length-1]<lo-1e-6){nv[nv.length-1]=lo;for(let j=nv.length-2;j>=0;j--)nv[j]=Math.max(nv[j],nv[j+1]+step)}
    order[k]=ord;out[k]=nv.map((x,j)=>fmt(Math.round(x*100)/100,L[ord[j]]))}
  /* sweets below mains */
  const mMin=Math.min(...(out.m||[]).map(val).filter(x=>x!=null));
  if(isFinite(mMin)&&out.w&&out.w.length){const wv=out.w.map(val);const top=Math.max(...wv);if(top>=mMin){const sc=(mMin*.8)/top,st=mMin<1?.05:/\./.test(String(out.w[0]))?.5:1;const nw=wv.map(x=>Math.max(st,Math.round(x*sc/st)*st));
    /* keep the order and no repeats after the scale-down */
    for(let j=nw.length-2;j>=0;j--)if(nw[j]<nw[j+1]+st/2)nw[j]=nw[j+1]+st;out.w=out.w.map((x,i)=>fmt(Math.round(nw[i]*100)/100,x))}}
  /* the dishes in print order, to match the prices */
  const items={};for(const k of ["s","m","w","d"])items[k]=(order[k]||[]).map(i=>(menu[k]||[])[i]).filter(Boolean);
  return {pr:out,items};
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
  const hh=o.headH||(tr=>tr.h*1.3+headX);let dmax=3,CW=W;const TL=o.tiers||TIERS;const nlOf=o.nlOf||((it,tr,w)=>tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,w,cw)):0);
  const cH=(tr,k)=>hh(tr)+items[k].slice(0,maxItems).reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),cwd*(caps?1.12:1)));const nl=nlOf(it,tr,CW-(o.indent||0));return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g+(o.itemX||0)},0);
  const splits=n=>{if(n===1)return [[C.length]];const out=[];if(n===2)for(let a=1;a<C.length;a++)out.push([a,C.length]);if(n===3)for(let a=1;a<C.length;a++)for(let b=a+1;b<C.length;b++)out.push([a,b,C.length]);return out};
  const tryTier=(tr,n)=>{CW=(W-gap*(n-1))/n;let best=null;for(const s of splits(n)){let st=0,m=0;const cols=[];for(const e of s){const sec=C.slice(st,e);cols.push(sec);m=Math.max(m,sec.reduce((x,[k])=>x+cH(tr,k),0));st=e}if(!best||m<best.m)best={m,cols}}return best};
  for(const tr of TL)for(let n=minCols;n<=Math.min(maxCols,C.length);n++){const q=tryTier(tr,n);if(q&&q.m*1.02<=H)return {tr,cols:q.cols,CW,dmax,spare:H-q.m*1.02,n}}
  dmax=2;const tr=TL[TL.length-1],n=Math.min(maxCols,C.length),q=tryTier(tr,n);return {tr,cols:q.cols,CW,dmax,spare:0,n};
}
/* one course: heading plus dishes; o sets fonts, colours and the heading/row style.
   Notes print in full (o.nlOf gives the lines they need, no clamp). A name that wraps drops its dot leader and the price sits on its last line. */
function course(sec,items,pr,R,o){
  const [k,label]=sec,{tr,CW,dmax}=R,nlOf=o.nlOf||((it,tr,w)=>tr.nl?Math.min(tr.nl,wrapLines(o.tx(it.note),tr.n,w,o.cw||.5)):0);
  const its=items[k].slice(0,o.maxItems||4);
  return `<div style="margin-bottom:${o.last?0:(o.cgap||12)}px">${o.head(label,tr,k)}${its.map((it,i)=>{const nl=nlOf(it,tr,CW-(o.indent||0));
    const wraps=wrapLines(o.tx(it.n),tr.d,CW-(o.priceW||(tr.d*2.6+10)),o.cwd||.56)>1;
    const lead=o.leader&&!wraps?`<span style="flex:1;min-width:16px;border-bottom:2px dotted ${o.lead||o.soft};transform:translateY(-${Math.round(tr.d*.22)}px)"></span>`:"";
    return `<div style="margin-bottom:${i===its.length-1?0:tr.g+(o.ig||0)}px;${o.indent?`padding-left:${o.indent}px;position:relative`:""}">${o.pre?o.pre(k,i,tr):""}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px"><span style="${lead?"flex:0 1 auto":"flex:1"};font:${o.nw||700} ${tr.d}px/1.15 ${o.nf};color:${o.ink};${o.caps?"text-transform:uppercase;letter-spacing:.04em;":""}${clamp(dmax)}">${esc(o.tx(it.n))}</span>${lead}<span style="font:${o.pw||700} ${tr.d+(o.pp||2)}px/1.1 ${o.pf||o.nf};color:${o.pc||o.ink};white-space:nowrap">${o.price?o.price(pr[k][i],k,i):pr[k][i]}</span></div>
      ${nl?`<div style="font:${o.ns||"400"} ${tr.n}px/1.3 ${o.bf};color:${o.soft};margin-top:3px">${esc(cap(o.tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
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
 {sky1:"#0f1b3a",sky2:"#e98b5a",card:"#fbf5e6",ink:"#2a1d16",soft:"#5e4d40",acc:"#d1342b",acc2:"#1f8a8a",disp:"'Yellowtail',cursive",dw:"400",body:"'Arvo',serif",cw:.54,cwd:.58,cols:["Starters","From the Kitchen","Sweets","Shakes and Sodas"]},
 {sky1:"#1a1430",sky2:"#e2773a",card:"#f8ecd2",ink:"#3a2412",soft:"#6a5038",acc:"#d4561c",acc2:"#8a5a1e",disp:"'Shrikhand',cursive",dw:"400",body:"'Barlow',sans-serif",cw:.48,cwd:.53,cols:["Starters","Grill","Sweets","Drinks"]},
 {sky1:"#120c2c",sky2:"#e2508f",card:"#fbf8f2",ink:"#1d1b33",soft:"#4b4968",acc:"#e2367a",acc2:"#1fa3b0",disp:"'Pacifico',cursive",dw:"400",body:"'Barlow Semi Condensed',sans-serif",cw:.44,cwd:.49,cols:["Starters","Grill","Sweets","Drinks"]},
 {sky1:"#0d1424",sky2:"#e07a4a",card:"#ffffff",ink:"#1a1c20",soft:"#50555c",acc:"#f0483e",acc2:"#2b6cb0",disp:"'Lobster',cursive",dw:"400",body:"'DM Sans',sans-serif",cw:.5,cwd:.55,cols:["Starters","Grill","Sweets","Drinks"]}
];
loadFonts(["Yellowtail","Shrikhand","Pacifico","Lobster","Arvo:ital,wght@0,400;0,700;1,400","Barlow:ital,wght@0,500;0,700;1,500","Barlow+Semi+Condensed:ital,wght@0,500;0,700;1,500","DM+Sans:ital,wght@0,400;0,700;1,400"]);

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Drive-In":"Starlite Drive-In","Carhop service at every bay",{text:"Lights on for service, lights off for the picture, and keep the speaker inside the car.",by:"The Carhop"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  const acc=readable(F.pal.accent||e.acc,e.card,4.5,e.acc),acc2=e.acc2;
  const sky=`<div style="position:absolute;inset:0;background:linear-gradient(180deg,${e.sky1} 0%,${mix(e.sky1,e.sky2,.35)} 55%,${e.sky2} 78%,${mix(e.sky2,"#1a1410",.6)} 79%,#16120f 100%)"></div>
    <div style="position:absolute;inset:0;background:url(${grain}) center/1000px auto;opacity:${(.1+t.wear*.4).toFixed(2)};mix-blend-mode:overlay"></div>`;

  /* left: the screen on its posts */
  const SX=34,SW=470,SY=34,PA=posterFit(SW-40,H-SY-150);
  /* the film's winks on a marquee board bolted to the posts, labelled as scenes so they never read as prizes or bay names */
  const MQT=SY+PA.h+58,MQH=H-24-MQT,wk=F.winks.slice(0,5);
  /* winks never cut: the biggest size where every wink fits, a long one wrapping to a second line if it must (inner box 444px wide) */
  const wkIn=MQH-30-20,wkW=444,wkLines=s=>wk.reduce((a,w)=>a+wrapLines(cap(w),s,wkW,e.cw),0);
  let wkS=wk.length>4?16:17;while(wkS>12&&wkLines(wkS)*wkS*1.3+(wk.length-1)*4>wkIn)wkS--;
  const marquee=wk.length&&MQH>90?`<div style="position:absolute;left:${SX-10}px;top:${MQT}px;width:${SW+20}px;height:${MQH}px;box-sizing:border-box;background:#1d1916;border:3px solid ${mix(e.sky2,"#ffffff",.25)};border-radius:6px;box-shadow:0 0 18px ${mix(e.sky2,"#000000",.3)}88,inset 0 0 0 4px #1d1916,inset 0 0 0 6px ${mix(e.sky2,"#000000",.45)};padding:12px 20px;display:flex;flex-direction:column;justify-content:center;gap:4px">
      <div style="font:700 13px/1.2 ${BF};letter-spacing:.24em;text-transform:uppercase;color:${mix(e.sky2,"#ffffff",.35)};margin-bottom:4px">Scenes to watch for</div>
      ${wk.map(w=>`<div style="font:500 ${wkS}px/1.3 ${BF};color:#f6efe2">${esc(cap(w))}</div>`).join("")}</div>`
    :`<div style="position:absolute;left:${SX-10}px;top:${SY+PA.h+70}px;width:${SW+20}px;height:12px;background:#2a2420"></div>`;
  const screen=`<div style="position:absolute;left:${SX}px;top:${SY}px;width:${SW}px;height:${PA.h+40}px;background:#f4f1ea;box-shadow:0 0 50px rgba(255,240,210,.35),0 10px 24px rgba(0,0,0,.5)">
      <div style="position:absolute;left:${Math.round((SW-PA.w)/2)}px;top:20px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div></div>
    ${[60,SW/2-8,SW-76].map(x=>`<div style="position:absolute;left:${SX+x}px;top:${SY+PA.h+40}px;width:16px;height:${H-SY-PA.h-40}px;background:linear-gradient(90deg,#2a2420,#4a4038,#2a2420)"></div>`).join("")}
    ${marquee}`;

  /* right: tray and card */
  const TX=SX+SW+34,TW=W-TX-30,TY=24,TH=H-48;
  const tray=`<div style="position:absolute;left:${TX}px;top:${TY}px;width:${TW}px;height:${TH}px;border-radius:18px;background:linear-gradient(135deg,#d9dde1,#9aa1a8 45%,#c9ced3);box-shadow:0 12px 28px rgba(0,0,0,.55)"></div>`;
  const CX=TX+18,CW=TW-36,CY=TY+18,CHt=TH-36;
  const HH=118,SL=176,cueH=F.cue?44:0;
  /* venue size from its width: the neon script runs about half an em a letter in the 466px beside the title */
  const vS=Math.max(30,Math.min(56,Math.floor(466/(Math.max(1,F.venue.length)*.5))));
  const C=sections(ctx,F,e.cols),PI=prices(itemsOf(ctx),F.ei,F.egg),items=PI.items,pr=PI.pr;
  const MW=CW-48,MH=CHt-HH-SL-cueH-30;
  /* notes always print whole: budget every line a note needs (up to 4) and only use tiers that show notes */
  const nlOf=(it,tr,w)=>tr.nl?Math.min(4,wrapLines(F.tx(it.note),tr.n,w,e.cw*1.1)):0;
  const NCW=e.cwd*1.1;
  const R=fit({C,items,tx:F.tx,W:MW,H:MH-8,maxCols:2,gap:26,cw:e.cw,cwd:NCW,nlOf,tiers:TIERS.filter(t=>t.nl===2).concat([{d:19,n:15,g:5,h:22,nl:2},{d:18,n:14,g:5,h:21,nl:2},{d:17,n:14,g:4,h:20,nl:2},{d:16,n:13,g:3,h:19,nl:2},{d:15,n:12,g:3,h:18,nl:2}])});
  /* height of one column as course() draws it: no gap after the last item or the last course */
  const headH=tr=>Math.round(tr.h*.82)*1.2+6+8;
  const colParts=col=>{let h=0,ni=0;col.forEach(([k])=>{h+=headH(R.tr);const its=items[k].slice(0,4);its.forEach((it,i)=>{const dl=Math.min(R.dmax,wrapLines(F.tx(it.n),R.tr.d,R.CW-(R.tr.d*2.6+10),NCW));const nl=nlOf(it,R.tr,R.CW);h+=Math.max(dl*R.tr.d*1.15,(R.tr.d+2)*1.1)+(nl?nl*R.tr.n*1.3+3:0)+(i<its.length-1?R.tr.g:0)});ni+=Math.max(0,its.length-1)});return {h,ni,nc:col.length}};
  const head=(l,tr)=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="font:700 ${Math.round(tr.h*.82)}px/1.2 ${BF};text-transform:uppercase;letter-spacing:.1em;color:#fff;background:${acc2};padding:3px 12px;border-radius:4px">${esc(l)}</span></div>`;
  const o={head,tx:F.tx,nf:BF,bf:BF,ink:e.ink,soft:e.soft,pc:acc,cw:e.cw,cwd:NCW,leader:1,lead:mix(e.soft,e.card,.5),nlOf};
  /* each column spends its own spare height on its own gaps, capped so it never looks stretched; a hole over 100px left after that takes a still */
  let stillUsed=0;const stillList=(ctx.stills||[]).map(x=>Array.isArray(x)?x[0]:x).filter(x=>x&&x!==ctx.poster);
  const colHtml=col=>{const p=colParts(col);let spare=Math.max(0,MH-6-p.h-(p.nc-1)*12);
    const cg=p.nc>1?Math.min(30,spare*.5/(p.nc-1)):0;spare-=cg*(p.nc-1);const ig=p.ni?Math.min(14,spare/p.ni):0;spare-=ig*p.ni;
    let pic="";if(spare>100&&stillList[stillUsed]){const src=ctx.img(stillList[stillUsed++],"w780"),ph=Math.round(spare-34);
      pic=`<div style="margin-top:14px;height:${ph}px;position:relative;overflow:hidden;border:4px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3);box-sizing:border-box">${photo(src,t.photo,"center 40%")}</div><div style="font:italic 400 13px/1.3 ${BF};color:${e.soft};margin-top:4px;${clamp(1)}">From ${esc(F.title)}${F.year?" ("+esc(F.year)+")":""}</div>`}
    return `<div style="flex:0 0 ${R.CW}px">${col.map((sec,i)=>course(sec,items,pr,R,{...o,cgap:12+cg,ig,last:i===col.length-1})).join("")}${pic}</div>`};
  const PK=/^(slip|ticket|receipt|card|order|stub|voucher|coupon|tag)$/i,pk=F.fl.prop&&F.fl.prop.kind;
  /* a two-line prop prints whole; only a longer one drops a line the sign or venue already says */
  const pLines=!F.prop?[]:F.prop.lines.length<3?F.prop.lines:F.prop.lines.filter(l=>!F.sign.toLowerCase().includes(l.toLowerCase())&&!F.venue.toLowerCase().includes(l.toLowerCase()));
  /* the label comes from prop.kind: the title when it names the kind ("Ghost trap slip"), else the kind itself */
  const KL={slip:"Order slip",ticket:"Ticket",receipt:"Receipt",card:"Card",order:"Order",stub:"Stub",voucher:"Voucher",coupon:"Coupon",tag:"Tag"};
  const pLab=F.prop?(pk&&KL[String(pk).toLowerCase()]&&!new RegExp("\\b"+String(pk).toLowerCase()+"\\b").test(F.prop.title.toLowerCase())?KL[String(pk).toLowerCase()]:F.prop.title):"";
  const propHtml=F.prop&&pLines.length&&(!pk||PK.test(pk))?`<div style="font:700 11px/1.2 ${BF};letter-spacing:.14em;text-transform:uppercase;color:${acc2};${clamp(1)}">${esc(pLab)}</div><div style="font:400 14px/1.25 ${BF};color:${e.soft};margin-top:2px;${clamp(2)}">${pLines.slice(0,2).map(esc).join("<br>")}</div>`
    :`<div style="font:400 14px/1.25 ${BF};color:${e.soft};${clamp(2)}">Flash your lights for service</div>`;
  const lg=F.posSrc?null:logoImg(ctx,200,HH-42);
  const tS=F.title.length>34?17:F.title.length>22?20:F.title.length>12?24:28;
  const titleTxt=`<div data-logo-alt style="${lg?"display:none;":""}text-align:right;width:100%"><div style="font:700 ${tS}px/1.1 ${BF};color:#fff;text-transform:uppercase;letter-spacing:.04em;${clamp(3)}">${esc(F.title)}</div>${F.year?`<div style="font:700 14px/1.3 ${BF};letter-spacing:.2em;color:${mix(e.sky2,"#ffffff",.4)};margin-top:2px">${esc(F.year)}</div>`:""}</div>`;
  /* logo check: share of solid pixels that read on the header by contrast, or by chroma for strong colours; under half and it gives way to the title */
  const LCHK=`try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,bg=[${hex(e.sky1).join(",")}],f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)},Lb=.2126*f(bg[0])+.7152*f(bg[1])+.0722*f(bg[2]),n=0,ok=0;for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;n++;var L=.2126*f(d[k])+.7152*f(d[k+1])+.0722*f(d[k+2]),r=(Math.max(L,Lb)+.05)/(Math.min(L,Lb)+.05),ch=Math.max(d[k],d[k+1],d[k+2])-Math.min(d[k],d[k+1],d[k+2]);if(r>=3||(ch>90&&r>=1.8))ok++}if(!n||ok/n<.5){i.style.display='none';i.parentNode.querySelector('[data-logo-alt]').style.display='block'}}catch(e){}`;
  const titleBlock=lg?`<img src="${lg.src}" crossorigin="anonymous" alt="${esc(F.title)}" onload="${LCHK}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(255,255,255,.18))">${titleTxt}`:titleTxt;
  const n=F.note,nS=n.text.length>130?16:n.text.length>80?18:20;
  const card=`<div style="position:absolute;left:${CX}px;top:${CY}px;width:${CW}px;height:${CHt}px;background:${e.card};overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.25)">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.1+t.wear*.5).toFixed(2)};mix-blend-mode:multiply"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:${HH}px;background:${e.sky1};display:flex;align-items:center;gap:16px;padding:0 24px;box-sizing:border-box">
      <div style="flex:1;min-width:0"><div style="font:${e.dw} ${vS}px/1.3 ${DF};color:#fff;text-shadow:0 0 4px #fff,0 0 12px ${acc},0 0 24px ${acc};white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
        <div style="font:700 15px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${mix(e.sky2,"#ffffff",.4)};${clamp(1)}">${esc(F.sign)}</div></div>
      <div style="flex:0 0 210px;height:${HH-30}px;display:flex;align-items:center;justify-content:center;padding:6px 0;box-sizing:border-box;position:relative">${titleBlock}</div></div>
    <div style="position:absolute;left:24px;top:${HH+16}px;width:${MW}px;height:${MH}px;display:flex;gap:26px;overflow:hidden">${R.cols.map(colHtml).join("")}</div>
    ${F.cue?`<div style="position:absolute;left:24px;right:24px;top:${HH+16+MH+4}px;height:${cueH-6}px">${cueLine(F,BF,e.soft,acc,15)}</div>`:""}
    <div style="position:absolute;left:0;right:0;bottom:0;height:${SL}px;border-top:3px dashed ${mix(e.soft,e.card,.4)};display:flex">
      <div style="flex:0 0 190px;border-right:2px solid ${mix(e.soft,e.card,.6)};text-align:center;padding:14px 10px;box-sizing:border-box">
        <div style="font:700 14px/1 ${BF};letter-spacing:.22em;color:${e.soft}">BAY</div>
        <div style="font:${e.dw} 72px/1.1 ${DF};color:${acc}">${esc(F.num.slice(-2))}</div>
        ${propHtml}</div>
      <div style="flex:1;min-width:0;padding:14px 20px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
        <div style="font:700 14px/1 ${BF};letter-spacing:.22em;color:${acc2}">OVER THE SPEAKER</div>
        <div style="font:italic 400 ${nS}px/1.32 ${BF};color:${e.ink};${clamp(3)}">"${esc(n.text)}"</div>
        <div style="display:flex;justify-content:space-between;gap:10px;font:400 14px/1.2 ${BF};color:${e.soft}"><b style="${clamp(1)}">${esc(n.by)}</b><span style="white-space:nowrap">${esc(credit(F))}</span></div></div></div></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${sky}${screen}${tray}${card}</div>`]};
};
})();
