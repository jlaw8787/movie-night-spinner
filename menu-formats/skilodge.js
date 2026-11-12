const _ROOT_skilodge=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: skilodge. A ski lodge menu with a lift ticket, one landscape face 1344x960.
   Left: the poster as the hero, whole, in a timber frame, a ticket prop hangs off the corner on its wire wicket; any other prop is a paper slip tacked to the timber.
   Right (signature): the lodge menu card. Courses graded like the runs: snacks green circle, mains blue square,
   sweets black diamond, drinks double black. Foot: the snow report board (the film's winks as scenes to watch for) and the lodge note
   (the overheard quote). Era sets timber, card and type; tone sets wear and photo. */
(function(){
const ID="skilodge",_ROOT=_ROOT_skilodge;

/* ---------- shared helpers ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[\u2013\u2014]\s*/g,", ").replace(/\s+-\s+/g,", ");
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
  const ps=window.priceSense?window.priceSense(menu,out):out;return tidyPrices(menu,ps,ei);
}
/* review 25: after the shared priceSense, keep each course honest: dearer dishes at or above the plainer ones, no two items
   in a course on the same price, dessert under the cheapest main. Steps keep the era's endings (.50/.95, nickels, whole dollars) */
const DEAR=/\b(lobster|steak|prime rib|surf and turf|prawns?|crayfish|scallops?|oysters?|wagyu|eye fillet|ribeye|t-bone|porterhouse)\b/i;
function tidyPrices(menu,P,ei){
  const num=x=>parseFloat(String(x).replace(/[^0-9.]/g,""))||0;
  const norm=v=>ei<2?Math.max(.05,Math.round(v*20)/20):ei>=6?Math.max(3,Math.round(v)):Math.floor(v)+(v%1<.001?0:v%1<=.5?.5:.95);
  const up=v=>ei<2?norm(v+.05):ei>=6?norm(v+1):(v%1>.9?Math.floor(v)+1.5:Math.floor(v)+.95);
  const down=v=>ei<2?Math.max(.05,norm(v-.05)):ei>=6?Math.max(1,norm(v-1)):(v%1>.9?Math.floor(v)+.5:Math.max(.5,Math.floor(v)-1+.95));
  const out={};const V={};
  for(const k of ["s","m","w","d"]){const L=(menu[k]||[]);const v=(P[k]||[]).map(num);
    /* dearer dishes sit at or above everything plain in the course */
    const plainMax=Math.max(0,...v.filter((x,i)=>!DEAR.test((L[i]&&L[i].n)||"")));
    v.forEach((x,i)=>{if(DEAR.test((L[i]&&L[i].n)||"")&&x<plainMax){let y=plainMax;y=up(y);v[i]=y}});
    /* no shared prices: bump the later item */
    for(let i=1;i<v.length;i++){let g=0;while(v.slice(0,i).some(x=>Math.abs(x-v[i])<.001)&&g++<20)v[i]=up(v[i])}
    V[k]=v}
  /* dessert under the cheapest main */
  if(V.m&&V.m.length&&V.w&&V.w.length){const minM=Math.min(...V.m);for(let i=0;i<V.w.length;i++){let g=0;while(V.w[i]>=minM&&g++<40)V.w[i]=down(V.w[i])}
    for(let i=1;i<V.w.length;i++){let g=0;while(V.w.slice(0,i).some(x=>Math.abs(x-V.w[i])<.001)&&g++<20)V.w[i]=down(V.w[i])}}
  /* review 26: starters under the cheapest main too, and a house line under every cooked dish in its own course,
     so the layout can print each course dearest first with the house line at the foot */
  if(V.m&&V.m.length&&V.s&&V.s.length){const minM=Math.min(...V.m);for(let i=0;i<V.s.length;i++){let g=0;while(V.s[i]>=minM&&g++<40)V.s[i]=down(V.s[i])}}
  for(const k of ["s","m","w","d"]){const L=menu[k]||[],v=V[k]||[];const own=v.filter((x,i)=>!(L[i]&&L[i].house));if(!own.length)continue;const lo=Math.min(...own);
    v.forEach((x,i)=>{if(!(L[i]&&L[i].house))return;let g=0;while(v[i]>=lo&&g++<40)v[i]=down(v[i])})}
  for(const k of ["s","m","w","d"]){const v=V[k]||[];for(let i=1;i<v.length;i++){let g=0;while(v.slice(0,i).some(x=>Math.abs(x-v[i])<.001)&&g++<20)v[i]=down(v[i])}}
  for(const k of ["s","m","w","d"])out[k]=(V[k]||[]).map((v,i)=>{const o=String((P[k]||[])[i]);/* keep the hidden egg price as priceSense left it */
    return Math.abs(num(o)-v)<.001?o:money(v,ei)});
  return out;
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
  const cH=(tr,k)=>hh(tr)+items[k].slice(0,maxItems).reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),cwd*(caps?1.12:1)));const nl=wrapLines(tx(it.note),tr.n,CW-(o.indent||0),cw*1.08);return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g+(o.itemX||0)},0);
  const splits=n=>{if(n===1)return [[C.length]];const out=[];if(n===2)for(let a=1;a<C.length;a++)out.push([a,C.length]);if(n===3)for(let a=1;a<C.length;a++)for(let b=a+1;b<C.length;b++)out.push([a,b,C.length]);return out};
  /* review 25: every note prints in full, so only the tiers that print notes, each note given all the lines it needs, plus the course gap */
  const TN=TIERS.filter(t=>t.nl),secH=(tr,k)=>cH(tr,k)+(o.cgap||12);const fin=(tr,q,n)=>({tr,cols:q.cols,CW,dmax,spare:Math.max(0,H-q.m*1.02),n,colH:col=>col.reduce((x,[k])=>x+secH(tr,k),0)});
  const tryT=(tr,n)=>{CW=(W-gap*(n-1))/n;let best=null;for(const s of splits(n)){let st=0,m=0;const cols=[];for(const e of s){const sec=C.slice(st,e);cols.push(sec);m=Math.max(m,sec.reduce((x,[k])=>x+secH(tr,k),0));st=e}if(!best||m<best.m)best={m,cols}}return best};
  for(const tr of TN)for(let n=minCols;n<=Math.min(maxCols,C.length);n++){const q=tryT(tr,n);if(q&&q.m*1.02<=H)return fin(tr,q,n)}
  dmax=2;const tr=TN[TN.length-1],n=Math.min(maxCols,C.length),q=tryT(tr,n);return fin(tr,q,n);
}
/* one course: heading plus dishes; o sets fonts, colours and the heading/row style */
function course(sec,items,pr,R,o){
  const [k,label]=sec,{tr,CW,dmax}=R;
  return `<div style="flex:0 0 auto;margin-bottom:${o.cgap||12}px">${o.head(label,tr,k)}${items[k].slice(0,o.maxItems||4).map((it,i)=>{const nl=String(it.note||"").trim()?1:0;
    const lead=o.leader?`<span style="flex:1;min-width:16px;border-bottom:2px dotted ${o.lead||o.soft};transform:translateY(-6px)"></span>`:"";
    return `<div style="margin-bottom:${tr.g}px;${o.indent?`padding-left:${o.indent}px;position:relative`:""}">${o.pre?o.pre(k,i,tr):""}
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="${o.leader?"flex:0 1 auto":"flex:1"};font:${o.nw||700} ${tr.d}px/1.15 ${o.nf};color:${o.ink};${o.caps?"text-transform:uppercase;letter-spacing:.04em;":""}${clamp(dmax)}">${esc(o.tx(it.n))}</span>${lead}<span style="font:${o.pw||700} ${tr.d+(o.pp||2)}px/1 ${o.pf||o.nf};color:${o.pc||o.ink};white-space:nowrap">${o.price?o.price(pr[k][i],k,i):pr[k][i]}</span></div>
      ${nl?`<div style="font:${o.ns||"400"} ${tr.n}px/1.3 ${o.bf};color:${o.soft};margin-top:3px">${esc(cap(o.tx(it.note)).replace(/[.\s]+$/,""))}</div>`:""}</div>`}).join("")}</div>`;
}
function sections(ctx,F,labels){return [["s",labels[0]],["m",labels[1]],["w",labels[2]],["d",F.drinks||labels[3]]].filter(([k])=>(ctx.menu[k]||[]).length)}
function itemsOf(ctx){const o={};for(const k of ["s","m","w","d"])o[k]=(ctx.menu[k]||[]).slice(0,4);return o}
function cueLine(F,bf,ink,acc,size){return F.cue?`<div data-fit="cue" style="font:italic 400 ${size||15}px/1.3 ${bf};color:${ink};${clamp(2)}"><b style="font-style:normal;color:${acc}">Showtime:</b> ${esc(cap(F.cue))}</div>`:""}
function logoOr(ctx,F,maxW,maxH,df,color,dw){const lg=logoImg(ctx,maxW,maxH);const ts=F.title.length>40?Math.round(maxH*.26):F.title.length>24?Math.round(maxH*.34):F.title.length>12?Math.round(maxH*.44):Math.round(maxH*.56);
  return lg?`<img src="${lg.src}" crossorigin="anonymous" onload="${SAMPLE}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain">`:`<div style="font:${dw||700} ${Math.max(18,ts)}px/1.05 ${df};color:${color};text-align:center;${clamp(3)}">${esc(F.title)}</div>`}
/* review 25: the logo never sits on a box. It shows bare when enough of it reads on the card (contrast, or strong colour with some contrast);
   otherwise it hides and the film title prints in the layout's type */
function logoBare(ctx,F,maxW,maxH,df,color,dw,card){const lg=logoImg(ctx,maxW,maxH);const ts=F.title.length>40?Math.round(maxH*.26):F.title.length>24?Math.round(maxH*.34):F.title.length>12?Math.round(maxH*.44):Math.round(maxH*.56);
  const ttl=on=>`<div style="display:${on?"block":"none"};max-width:${maxW}px"><div style="font:${dw||700} ${Math.max(18,ts)}px/1.05 ${df};color:${color};text-align:center;${clamp(3)}">${esc(F.title)}</div></div>`;
  if(!lg)return ttl(1);const c=hex(card)||[255,255,255];
  const chk="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,P=["+c.join(",")+"],n=0,g=0;function L(r,gg,b){var a=[r,gg,b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}var lp=L(P[0],P[1],P[2]);for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;n++;var l=L(d[k],d[k+1],d[k+2]),cr=(Math.max(l,lp)+.05)/(Math.min(l,lp)+.05),ch=Math.max(d[k],d[k+1],d[k+2])-Math.min(d[k],d[k+1],d[k+2]);if(cr>=3||(ch>90&&cr>=1.8))g++}if(n&&g/n<.45){i.style.display='none';i.nextSibling.style.display='block'}}catch(e){}";
  return `<img src="${lg.src}" crossorigin="anonymous" onload="${chk}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain">${ttl(0)}`}
const grainOf=(ctx,root)=>(ctx.root!=null?ctx.root:root)+"assets/era/_shared/paper-grain.webp";
const credit=F=>`Prices subject to change.${F.fam?" No alcohol served.":""} Images: TMDB.`;

const W=1344,H=960;
const E=[
 {wood:"#5a3a22",wood2:"#4a2f1b",card:"#f7f1e3",ink:"#2a1f17",soft:"#5f5245",acc:"#a3322a",disp:"'Alfa Slab One',serif",dw:"400",body:"'Lora',serif",cw:.5,cwd:.56},
 {wood:"#6b4426",wood2:"#583720",card:"#f6ead2",ink:"#3a2614",soft:"#6a543d",acc:"#d06a1f",disp:"'Shrikhand',cursive",dw:"400",body:"'Barlow',sans-serif",cw:.48,cwd:.53},
 {wood:"#5b3b24",wood2:"#4b301c",card:"#f8f8f6",ink:"#1f2233",soft:"#4f5468",acc:"#e2367a",disp:"'Bungee',cursive",dw:"400",body:"'Barlow Semi Condensed',sans-serif",cw:.44,cwd:.49},
 {wood:"#463a30",wood2:"#3a3028",card:"#fbfbf9",ink:"#1a1c1e",soft:"#50565c",acc:"#e0582a",disp:"'Familjen Grotesk',sans-serif",dw:"700",body:"'Inter Tight',sans-serif",cw:.5,cwd:.55}
];
loadFonts(["Alfa+Slab+One","Shrikhand","Bungee","Familjen+Grotesk:wght@500;700","Lora:ital,wght@0,400;0,700;1,400","Barlow:ital,wght@0,500;0,700;1,500","Barlow+Semi+Condensed:ital,wght@0,500;0,700;1,500","Inter+Tight:ital,wght@0,400;0,700;1,400","Caveat:wght@600","Courier+Prime:wght@400;700"]);
/* trail markers, drawn as the signs are: a green circle, a blue square, a black diamond, two black diamonds */
const MARK={s:["#1f8a3d","circle"],m:["#1f5fb4","square"],w:["#111111","diamond"],d:["#111111","double"]};
function marker(k,size){const [c,sh]=MARK[k]||MARK.s,s=size;
  if(sh==="circle")return `<span style="display:inline-block;flex:0 0 ${s}px;width:${s}px;height:${s}px;border-radius:50%;background:${c}"></span>`;
  if(sh==="square")return `<span style="display:inline-block;flex:0 0 ${s}px;width:${s}px;height:${s}px;background:${c}"></span>`;
  const d=`<span style="display:inline-block;flex:0 0 ${Math.round(s*.78)}px;width:${Math.round(s*.78)}px;height:${Math.round(s*.78)}px;background:${c};transform:rotate(45deg);margin:0 ${Math.round(s*.14)}px"></span>`;
  return sh==="double"?`<span style="display:inline-flex;flex:0 0 auto;gap:${Math.round(s*.18)}px">${d}${d}</span>`:d}

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Lodge":"The Ski Lodge","Lifts open nine till four",{text:"Last chair goes at four. Hot chocolate is on till the fire burns out.",by:"The lodge"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  const acc=readable(F.pal.accent||e.acc,e.card,4.5,e.acc);
  const wood=`<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,${e.wood} 0 58px,${e.wood2} 58px 61px,${mix(e.wood,"#000000",.1)} 61px 120px,${e.wood2} 120px 123px)"></div>
    <div style="position:absolute;inset:0;background:url(${grain}) center/900px auto;opacity:${(.35+t.wear*.5).toFixed(2)};mix-blend-mode:multiply"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 40% 35%,rgba(255,190,110,.18),rgba(0,0,0,0) 60%)"></div>`;
  const shadow="0 10px 22px rgba(0,0,0,.45)";

  /* left: poster in a timber frame, lift ticket on the corner */
  const LX=36,LW=440,PA=posterFit(LW-40,H-72-40-236);
  const frame=`<div style="position:absolute;left:${LX}px;top:36px;width:${PA.w+40}px;height:${PA.h+40}px;background:linear-gradient(135deg,${mix(e.wood,"#ffffff",.12)},${mix(e.wood,"#000000",.35)});box-shadow:${shadow}">
    <div style="position:absolute;left:20px;top:20px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div></div>`;
  /* review 26: the film's prop always prints on the wire, under a label from its kind (a receipt reads RECEIPT, a ticket stays a lift ticket).
     The number row shows only on a ticket or pass, and drops out when the number already shows in the ticket's words */
  const pk=String((F.fl.prop&&F.fl.prop.kind)||"").toLowerCase(),pr2=F.prop||null,isTk=!pr2||/ticket|pass|stub|admission/.test(pk);
  const tTitle=pr2?pr2.title:"All Mountain",tLines=pr2&&pr2.lines.length?pr2.lines.slice(0,2).join(". "):"Valid today only";
  const tHead=!isTk&&pk?clean(pk).toUpperCase():/lift|ski pass/i.test(tTitle)?"ADMIT ONE":pk==="pass"&&pr2?"LIFT PASS":"LIFT TICKET",tNum=F.num.slice(-4),showNum=isTk&&!(tTitle+" "+tLines).includes(tNum);
  const TX=LX+Math.round((PA.w+40)/2)-20,TY=36+PA.h+40+44;
  /* review 26b: only a ticket or pass hangs on the lift wicket wire. Any other prop (a receipt, a bill, a note) is a paper slip
     tacked to the timber: typewriter type, a torn zigzag foot (small turned squares, since the PDF export cannot draw clip-path), a dashed rule above the amount due line, and no empty band */
  const MONO="'Courier Prime','Courier New',monospace";
  const slipLines=pr2&&pr2.lines.length?pr2.lines.slice(0,3):[tLines];
  const slipH=Math.min(176,58+30+slipLines.length*24+8),zz=Array.from({length:22},(_,i)=>`<span style="position:absolute;left:${i*14-3}px;bottom:-5px;width:10px;height:10px;background:#fbf8f0;transform:rotate(45deg)"></span>`).join("");
  const ticket=isTk?`<div style="position:absolute;left:${TX}px;top:${TY-34}px;width:4px;height:44px;background:#9aa0a6;transform:rotate(4deg);transform-origin:top"></div>
    <div style="position:absolute;left:${TX-140}px;top:${TY}px;width:320px;height:176px;background:#ffffff;border-radius:8px;box-shadow:0 6px 14px rgba(0,0,0,.45);transform:rotate(${(3+t.tilt).toFixed(1)}deg);overflow:hidden;box-sizing:border-box">
      <div style="height:42px;background:${acc};display:flex;align-items:center;justify-content:center;font:700 16px/1 ${BF};letter-spacing:.26em;color:${lum(acc)>.4?"#111":"#fff"}">${tHead}</div>
      <div style="height:134px;box-sizing:border-box;padding:8px 12px;text-align:center;display:flex;flex-direction:column;justify-content:center">
        <div style="font:700 22px/1.1 ${BF};color:#15171a;text-transform:uppercase;${clamp(2)}">${esc(tTitle)}</div>
        <div style="margin-top:4px">${(pr2&&pr2.lines.length?pr2.lines.slice(0,2):[tLines]).map(l=>`<div style="font:400 15px/1.25 ${BF};color:#4a4f55">${esc(l)}</div>`).join("")}</div>
        ${showNum?`<div style="font:700 26px/1 ${DF};color:${acc};margin-top:8px">No. ${esc(tNum)}</div>`:""}</div></div>`
  :`<div style="position:absolute;left:${TX-130}px;top:${TY-10}px;width:300px;height:${slipH}px;transform:rotate(${(-2+t.tilt).toFixed(1)}deg);filter:drop-shadow(0 5px 8px rgba(0,0,0,.45))">
      <div style="position:absolute;inset:0;background:#fbf8f0;box-sizing:border-box;padding:22px 20px 18px;font-family:${MONO};color:#26231f">
        <div style="font:700 15px/1 ${MONO};letter-spacing:.3em;text-align:center">${esc(tHead)}</div>
        <div style="border-top:1px dashed #8a8378;margin:8px 0 7px"></div>
        <div style="font:700 18px/1.15 ${MONO};text-transform:uppercase;text-align:center;${clamp(1)}">${esc(tTitle)}</div>
        <div style="margin-top:6px">${slipLines.map(l=>/^(amount|total|balance)\b/i.test(l)
          ?`<div style="border-top:1px dashed #8a8378;margin-top:6px;padding-top:5px;font:700 15px/1.3 ${MONO}">${esc(l)}</div>`
          :`<div style="font:400 15px/1.3 ${MONO}">${esc(l)}</div>`).join("")}</div></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:0;overflow:visible">${zz}</div>
      <div style="position:absolute;left:50%;top:6px;width:13px;height:13px;margin-left:-6px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e8e2d6,#8c8478 60%,#4a453e);box-shadow:0 2px 3px rgba(0,0,0,.5)"></div></div>`;

  /* right: the lodge menu card */
  const RX=LX+LW+28,RW=W-RX-36,CT=36,FH=196,CH=H-CT-36-FH-20;
  const HH=104,cueH=F.cue?44:0;
  const vS=F.venue.length>28?30:F.venue.length>18?36:44;
  const C=sections(ctx,F,["Green Runs","Blue Runs","Black Runs","Double Black"]),items=itemsOf(ctx),pr=prices(items,F.ei,F.egg);
  /* review 26 (rule 8): each course prints dearest first, house lines at the foot */
  for(const k of ["s","m","w","d"]){const L=items[k]||[];if(L.length<2)continue;const pv=x=>parseFloat(String(x).replace(/[^0-9.]/g,""))||0;
    const ix=L.map((x,i)=>i).sort((a,b)=>(!!L[a].house-!!L[b].house)||(pv(pr[k][b])-pv(pr[k][a]))||a-b);items[k]=ix.map(i=>L[i]);pr[k]=ix.map(i=>pr[k][i])}
  const MW=RW-48,MH=CH-HH-cueH-34;
  /* review 26 (rule 4): the poster on the left already carries the film's logo, so the header prints the title and year in the display face */
  const tAv=HH-44-(F.year?18:0);let tS=26;while(tS>15&&wrapLines(F.title,tS,200,e.cwd*1.1)*tS*1.08>tAv)tS--;
  const titleBlock=`<div style="width:200px;text-align:center"><div style="font:${e.dw} ${tS}px/1.05 ${DF};color:${acc}">${esc(F.title)}</div>${F.year?`<div style="font:700 14px/1 ${BF};letter-spacing:.2em;color:${e.soft};margin-top:4px">${esc(F.year)}</div>`:""}</div>`;
  const R=fit({C,items,tx:F.tx,W:MW,H:MH,maxCols:2,gap:28,cw:e.cw,cwd:e.cwd,cgap:12});
  const head=(l,tr,k)=>`<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;border-bottom:2px solid ${mix(e.ink,e.card,.75)};padding-bottom:5px">${marker(k,Math.round(tr.h*.8))}<span style="font:${e.dw} ${tr.h}px/1.15 ${DF};color:${e.ink}">${esc(l)}</span></div>`;
  const o={head,tx:F.tx,nf:BF,bf:BF,ink:e.ink,soft:e.soft,pc:acc,cw:e.cw,leader:1,lead:mix(e.soft,e.card,.5),cgap:12};
  /* review 25: each column spends its own spare height in its course gaps (flex spacers, capped at GAPMAX so nothing looks stretched);
     a column still left with more than about 100px gets a real still from the film, sized by flex to the room left */
  const GAPMAX=30,stl=[F.stillSrc,F.still2].filter(Boolean);let si=0;
  const colHtml=col=>{const left=MH-R.colH(col)*1.02-(col.length-1)*GAPMAX,src=left>120&&stl[si]?stl[si++]:"";
    const sp=`<div style="flex:1 1 0;min-height:0;max-height:${GAPMAX}px"></div>`;
    const still=src?`<div style="flex:1 1 0;min-height:96px;margin-top:4px;position:relative;overflow:hidden;background:#111;border:3px solid ${mix(e.wood,"#000000",.2)};box-sizing:border-box">${photo(src,t.photo,"center 35%")}
      <div style="position:absolute;left:0;right:0;bottom:0;padding:5px 9px;background:linear-gradient(0deg,rgba(0,0,0,.72),rgba(0,0,0,0));font:italic 500 13px/1.2 ${BF};color:#fff;${clamp(1)}">From the film, ${esc(F.title)}${F.year?` (${esc(F.year)})`:""}</div></div>`:"";
    /* no still: what the capped gaps cannot take goes a little into the gaps between dishes (up to 8px each, 20px kept back for safety) */
    const nI=col.reduce((x,[k])=>x+Math.min(4,(items[k]||[]).length),0),xg=!src&&left>20&&nI?Math.min(8,Math.floor((left-20)/nI)):0,RC=xg?Object.assign({},R,{tr:Object.assign({},R.tr,{g:R.tr.g+xg})}):R;
    return `<div style="flex:0 0 ${R.CW}px;height:${MH}px;display:flex;flex-direction:column;min-height:0">${col.map(s=>course(s,items,pr,RC,o)).join(sp)}${src?sp+still:""}</div>`};
  const card=`<div style="position:absolute;left:${RX}px;top:${CT}px;width:${RW}px;height:${CH}px;background:${e.card};box-shadow:${shadow}">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.12+t.wear*.5).toFixed(2)};mix-blend-mode:multiply"></div>
    <div style="position:absolute;left:24px;right:24px;top:18px;height:${HH-26}px;display:flex;align-items:center;gap:18px;border-bottom:4px double ${e.ink}">
      <div style="flex:1;min-width:0"><div style="font:${e.dw} ${vS}px/1.2 ${DF};color:${acc};white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
        <div style="font:700 15px/1.2 ${BF};letter-spacing:.18em;text-transform:uppercase;color:${e.soft};margin-top:3px;${clamp(1)}">${esc(F.sign)}</div></div>
      <div style="flex:0 0 220px;height:${HH-40}px;display:flex;align-items:center;justify-content:center;padding:6px 10px;box-sizing:border-box;margin-bottom:8px">${F.posSrc?titleBlock:logoBare(ctx,F,200,HH-52,DF,acc,e.dw,e.card)}</div></div>
    <div style="position:absolute;left:24px;top:${HH+10}px;width:${MW}px;height:${MH}px;display:flex;gap:28px;overflow:hidden">${R.cols.map(colHtml).join("")}</div>
    ${F.cue?`<div style="position:absolute;left:24px;right:24px;bottom:14px;height:${cueH-10}px;border-top:1px solid ${mix(e.soft,e.card,.6)};padding-top:6px">${cueLine(F,BF,e.soft,acc,15)}</div>`:""}</div>`;

  /* foot: snow report and ski patrol */
  const FY=H-36-FH,SW=Math.round(RW*.46);
  /* review 25: the board carries the film's winks (up to five that fit), marked with the run signs and labelled as scenes to watch for */
  const RIN=FH-12-24-15-8-17,rW=SW-12-32-26;let rep=[],used=0;
  for(const wk of F.winks.slice(0,5)){const h=wrapLines(wk,15,rW,e.cw*1.08)*19+4;if(used+h>RIN)break;rep.push(wk);used+=h}
  const report=`<div style="position:absolute;left:${RX}px;top:${FY}px;width:${SW}px;height:${FH}px;background:#1d2a33;box-shadow:${shadow};box-sizing:border-box;padding:12px 16px;overflow:hidden;border:6px solid ${mix(e.wood,"#000000",.2)};display:flex;flex-direction:column">
    <div style="font:700 15px/1 ${BF};letter-spacing:.24em;color:#9fd4ff">SNOW REPORT</div>
    <div style="font:italic 500 14px/1.2 ${BF};color:#ffd36e;margin-top:8px">${rep.length?"Watch for tonight":"Conditions tonight"}</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly">${(rep.length?rep:["Fresh powder overnight","Groomed runs, all lifts open","Fire lit in the lodge"]).map((r,i)=>`<div style="display:flex;align-items:center;gap:10px;font:400 15px/1.25 ${BF};color:#eef4f7"><span style="flex:0 0 16px;display:flex;justify-content:center"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#eef4f7"></span></span><span>${esc(r)}</span></div>`).join("")}</div></div>`;
  const n=F.note,isQ=!!(F.fl.note&&F.fl.note.text&&F.fl.note.kind==="quote"),nS=n.text.length>140?24:n.text.length>90?27:30;
  const patrol=`<div style="position:absolute;left:${RX+SW+18}px;top:${FY}px;width:${RW-SW-18}px;height:${FH}px;background:${e.card};box-shadow:${shadow};box-sizing:border-box;padding:12px 16px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border-top:8px solid ${acc}">
    <div style="font:700 15px/1 ${BF};letter-spacing:.22em;color:${acc}">${isQ?"OVERHEARD":"FROM THE LODGE"}</div>
    <div style="font:600 ${nS}px/1.12 'Caveat',cursive;color:${e.ink};${clamp(3)}">${isQ?`"${esc(n.text)}"`:esc(n.text)}</div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span style="font:700 15px/1.2 ${BF};color:${e.soft};${clamp(1)}">${esc(n.by)}</span><span style="font:400 14px/1 ${BF};color:${e.soft};white-space:nowrap">${esc(credit(F).replace("Prices subject to change. ",""))}</span></div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(10,6,2,${(t.vig*.7).toFixed(2)}) 100%)"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${wood}${frame}${ticket}${card}${report}${patrol}${vig}</div>`]};
};
})();
