const _ROOT_clubhouse=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: clubhouse. A golf club's 19th hole menu set out as a scorecard, one landscape face 1344x960.
   Left: the card's cover in club colours: logo panel, the venue as the club name, the poster as the hero, whole, with a gilt rule.
   Right (signature): the scorecard. Hole, dish and par columns; courses run as Front Nine, The Turn, Back Nine and 19th Hole,
   dishes numbered as holes, prices as par with one pencilled in. Foot: local rules (the film's winks) and the marker's line
   (the overheard quote, signed in pencil). Era sets club colours and type; tone sets wear and photo. */
(function(){
const ID="clubhouse",_ROOT=_ROOT_clubhouse;

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
    winks:(fl.winks||[]).map(clean).filter(Boolean),prop:fl.prop&&fl.prop.title?{kind:clean(fl.prop.kind||""),title:clean(fl.prop.title),lines:(fl.prop.lines||[]).map(clean).filter(Boolean)}:null,
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

/* prices (review 25): the dearer dish in a course never costs less than a plainer one (surf and turf over prime rib over a frank),
   no two dishes in a course share a price, and a house line stays at the foot of its course. Runs after the shared priceSense. */
const DEAR=[[/lobster|surf and turf|crayfish|caviar/i,3],[/prime rib|steak|fillet|sirloin|rib ?eye|t-bone|wagyu|prawns?|shrimp|scallops?|oysters?/i,2],[/beef|lamb|veal|duck|salmon|fish|crab|pork|ham|chicken|chuck|mince|burger|patt/i,1]];
/* a drink served by the pitcher or jug is a bigger pour than a glass: it prices dearer and sits above the glasses */
const BIG=/\b(pitchers?|jugs?)\b/i,bigOf=(k,it)=>k==="d"&&BIG.test((it&&it.n)||"")?1:0;
/* card order inside a course (review 26): dearest dish first, house lines last, otherwise the film's own order */
const clubOrder=(k,list)=>{const L=(list||[]).map((it,i)=>({it,i}));const key=x=>x.it.house?-1:dearOf(x.it)*2+bigOf(k,x.it);return L.sort((a,b)=>key(b)-key(a)||a.i-b.i).map(x=>x.it)};
const dearOf=it=>{const s=(it&&it.n||"")+" "+(it&&it.note||"");for(const [re,v] of DEAR)if(re.test(s))return v;return 0};
const pval=x=>{const n=parseFloat(String(x).replace(/[^\d.]/g,""));return isNaN(n)?null:n};
const pfmt=(v,o)=>{o=String(o);const pre=(o.match(/^[^\d.]*/)||[""])[0],post=(o.match(/[^\d.]*$/)||[""])[0];if(!/\./.test(o))return pre+String(Math.round(v))+post;if(/^\D*\.\d\d/.test(o)&&v<1)return pre+"."+String(Math.round(v*100)).padStart(2,"0")+post;return pre+v.toFixed(2)+post};
const bump=(v,o)=>{if(!/\./.test(String(o)))return Math.round(v)+1;if(v<1)return Math.round((v+.05)*100)/100;const f=v%1;return f<.495?Math.floor(v)+.5:f<.945?Math.floor(v)+.95:Math.floor(v)+1.5};
/* one printed price step down: a dollar, five cents under a dollar, else .95 to .50 to the dollar below's .95 */
const down=(v,o)=>{if(!/\./.test(String(o)))return Math.max(1,Math.round(v)-1);if(v<=1)return Math.max(.05,Math.round((v-.05)*100)/100);const f=Math.round((v%1)*100);return f>50?Math.floor(v)+.5:f>0?Math.floor(v)-.05:v-.05};
/* a price rounded the way the card prints it: whole dollars, five cents under a dollar, else .50 or .95 */
const rnd=(v,o)=>{if(!/\./.test(String(o)))return Math.max(1,Math.round(v));if(v<1)return Math.max(.05,Math.round(v*20)/20);return Math.floor(v)+(v%1<.5?.5:.95)};
/* walk a course from its foot up so every row costs more than the one under it */
const climb=(p,idx,fm)=>{let prev=-1;idx.slice().reverse().forEach(i=>{let v=pval(p[i]);if(v<=prev+.001)v=bump(prev,fm);prev=v;p[i]=pfmt(v,fm)})};
function clubPrices(items,ei,egg){
  /* review 26: a 1990s tour clubhouse main sits nearer a real club price */
  const pr=prices(items,ei,egg,{s:.6,m:ei===5?1.6:1.3,w:.45,d:.3});
  for(const k of ["s","m","w","d"]){const its=items[k]||[],p=(pr[k]||[]).slice();if(!its.length)continue;
    /* a pitcher or jug is priced as a jug (about .5 of a main), not as a glass (.3) */
    its.forEach((it,i)=>{const v=pval(p[i]);if(v!=null&&bigOf(k,it))p[i]=pfmt(rnd(v*5/3,p[i]),p[i])});
    /* rows are already in card order (dearest first): the dearest price goes to the top row and prices fall down the course */
    const idx=its.map((_,i)=>i).filter(i=>!its[i].house&&pval(p[i])!=null),vals=idx.map(i=>pval(p[i])).sort((a,b)=>b-a),fm=idx.length?p[idx[0]]:"";
    idx.forEach((i,j)=>{p[i]=pfmt(vals[j],fm)});climb(p,idx,fm);
    const order=idx;
    /* house lines sit at the foot (review 26b): cheaper than every other dish in the course, stepped down off any price already taken */
    const seen=order.map(i=>pval(p[i])),lo=seen.length?Math.min(...seen):Infinity;
    its.forEach((_,i)=>{if(order.includes(i))return;let v=pval(p[i]);if(v==null)return;if(v>=lo-.001)v=rnd(lo*.85,p[i]);if(v>=lo-.001)v=rnd(lo-.5,p[i]);
      let g=0;while((seen.some(s=>Math.abs(s-v)<.001)||v>=lo-.001)&&g++<20)v=down(v,p[i]);seen.push(v);p[i]=pfmt(v,p[i])});
    pr[k]=p}
  /* every main above every starter, the dearer main still on top */
  {const sMax=Math.max(-1,...(pr.s||[]).map(pval).filter(v=>v!=null)),its=items.m||[],p=(pr.m||[]).slice();let cur=sMax;
   its.map((_,i)=>i).filter(i=>pval(p[i])!=null).sort((a,b)=>pval(p[a])-pval(p[b])||a-b).forEach(i=>{let v=pval(p[i]);if(v<=cur+.001)v=bump(cur,p[i]);cur=v;p[i]=pfmt(v,p[i])});pr.m=p}
  /* dessert always below the cheapest main */
  const mMin=Math.min(...(pr.m||[]).map(pval).filter(v=>v!=null));
  if(isFinite(mMin)&&(pr.w||[]).length){const its=items.w||[],p=pr.w.slice(),idx=its.map((_,i)=>i).filter(i=>!its[i].house&&pval(p[i])!=null),top=Math.max(-1,...idx.map(i=>pval(p[i])));
    /* the dearest dessert drops to just over half the cheapest main, the rest scale with it and still fall down the course */
    if(top>=mMin&&idx.length){const f=mMin*.55/top;idx.forEach(i=>{p[i]=pfmt(rnd(Math.max(.05,pval(p[i])*f),p[i]),p[i])});climb(p,idx,p[idx[0]]);
      /* the film's number stays hidden in the top dessert's cents (the pencil ring sits on it) */
      if(egg&&ei>=2&&ei<6){const v=Math.floor(pval(p[idx[0]]))+(+egg)/100;if(v>=1&&v<mMin&&(idx.length<2||v>pval(p[idx[1]])))p[idx[0]]=pfmt(v,p[idx[0]])}}
    its.forEach((_,i)=>{if(!its[i].house)return;const v=pval(p[i]);if(v!=null&&v>=mMin)p[i]=pfmt(rnd(mMin*.5,p[i]),p[i])});pr.w=p}
  return pr}
/* a logo with no box: kept only when it reads on the club colour by contrast or chroma, else the title in the club's type shows instead */
const LOGOREAD=c=>`try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,g=0,n=0,B=[${hex(c).join(",")}];function L(r,gg,b){var a=[r,gg,b].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}var lb=L(B[0],B[1],B[2]);for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;n++;var l=L(d[k],d[k+1],d[k+2]),cr=(Math.max(l,lb)+.05)/(Math.min(l,lb)+.05),ch=Math.max(d[k],d[k+1],d[k+2])-Math.min(d[k],d[k+1],d[k+2]);if(cr>=3||(cr>=2&&ch>110))g++}if(n&&g/n<.5){i.style.display='none';var f=i.nextElementSibling;if(f)f.style.display='block'}}catch(e){}`;

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=16?t+" Country Club":"The Clubhouse","Members and guests",{text:"Replace your divots, rake the bunkers, and settle up at the bar.",by:"The Club Captain"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body;
  /* the film's dark only when it carries some colour (review 26): a plain black or grey cover reads as a cinema frame, so the era's club green holds */
  const chroma=c=>{const a=hex(c);return a?Math.max(...a)-Math.min(...a):0};
  const club=F.pal.dark&&hex(F.pal.dark)&&lum(F.pal.dark)<.08&&chroma(F.pal.dark)>20?F.pal.dark:e.club,gilt=e.gilt,acc=readable(F.pal.accent||"#b33a2a",e.paper,4.5,"#a3322a");
  const giltT=mix(gilt,"#ffffff",.25),giltS=mix(gilt,club,.25);

  /* left: the cover. With a poster the poster carries the film's logo, so the club prints the title and year in its own type (review 25);
     no poster: the logo with no box when it reads on the club colour, else the title. Stack spread down the whole panel, no empty band. */
  const LW=468,P=30;
  const vS=F.venue.length>28?26:F.venue.length>18?32:38;
  const ttl=`<div style="font:${e.dw} ${F.title.length>28?22:28}px/1.15 ${DF};color:${giltT};text-align:center;${clamp(2)}">${esc(F.title)}</div><div style="font:700 13px/1 ${BF};letter-spacing:.3em;color:${giltS};text-align:center;margin-top:6px">${esc(F.year)}</div>`;
  let top;
  if(F.posSrc)top=`<div style="max-width:${LW-2*P-40}px">${ttl}</div>`;
  else{const lg=logoImg(ctx,LW-2*P-60,100);top=lg?`<div style="max-width:${LW-2*P-40}px;text-align:center"><img src="${lg.src}" crossorigin="anonymous" alt="${esc(F.title)}" onload="${LOGOREAD(club)}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 0 10px rgba(0,0,0,.35))"><div style="display:none">${ttl}</div></div>`:`<div style="max-width:${LW-2*P-40}px">${ttl}</div>`}
  const topH=F.posSrc?(F.title.length>28?72:56):110;
  /* the film's prop (rule 5) hangs on the cover as a bag tag: its kind as the label, the title, then its lines */
  const PR=F.prop,pLine=PR?PR.lines.join(" \u00b7 "):"",pNL=pLine?Math.min(2,wrapLines(pLine,15,LW-2*P-70-70,.52)):0,tagH=PR?60+pNL*19:0;
  const tag=PR?`<div style="position:relative;flex:0 0 auto;width:${LW-2*P-70}px;box-sizing:border-box;border:2px solid ${gilt};border-radius:10px 22px 22px 10px;background:${mix(club,"#ffffff",.06)};padding:7px 18px 7px 44px;text-align:center">
      <span style="position:absolute;left:14px;top:50%;width:14px;height:14px;margin-top:-7px;border-radius:50%;border:2px solid ${gilt};background:${club}"></span>
      <div style="font:700 12px/1 ${BF};letter-spacing:.3em;text-transform:uppercase;color:${giltS}">${esc(cap(PR.kind||"Bag tag"))}</div>
      <div style="font:${e.dw} 22px/1.15 ${DF};color:${giltT};margin-top:4px;white-space:nowrap;overflow:hidden">${esc(PR.title)}</div>
      ${pLine?`<div style="font:italic 400 15px/1.25 ${BF};color:${giltS};margin-top:3px;${clamp(2)}">${esc(pLine)}</div>`:""}</div>`:"";
  const PA=posterFit(LW-2*P-20,H-2*P-topH-150-(PR?tagH+14:0));
  const cover=`<div style="position:absolute;left:0;top:0;width:${LW}px;height:${H}px;background:${club}">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.1+t.wear*.6).toFixed(2)};mix-blend-mode:screen"></div>
    <div style="position:absolute;inset:14px;border:2px solid ${gilt};opacity:.85"></div><div style="position:absolute;inset:20px;border:1px solid ${gilt};opacity:.5"></div>
    <div style="position:absolute;left:${P}px;right:${P}px;top:${P+4}px;bottom:${P+4}px;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly">
      ${top}
      <div style="position:relative;flex:0 0 auto;width:${PA.w+12}px;height:${PA.h+12}px;background:${gilt}"><div style="position:absolute;left:6px;top:6px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div></div>
      ${tag}
      <div style="width:100%;text-align:center"><div style="font:${e.dw} ${vS}px/1.2 ${DF};color:${giltT};${clamp(2)}">${esc(F.venue)}</div>
        <div style="font:italic 400 17px/1.3 ${BF};color:${giltS};margin-top:6px;${clamp(1)}">${esc(F.sign)}</div></div></div></div>`;

  /* right: the scorecard */
  const RX=LW+28,RW=W-RX-28,TOP=28;
  const FH=176,cueH=F.cue?42:0,HDR=40;
  const C=sections(ctx,F,e.cols),items=itemsOf(ctx);for(const k in items)items[k]=clubOrder(k,items[k]);const pr=clubPrices(items,F.ei,F.egg);
  const HOLE=52,PAR=82,GAP=18,PADY=6,DMAX=3;
  /* the Yds column and the Out / In line (review 26) print when the card has room for them; a full card drops the Out line first, then Yds */
  let YDS=50,OUTH=30,MH=0;
  /* own fit (review 25): every note prints in full, so a tier is tried with each note's real line count; notes get their lines
     before any spare height goes into gaps. The note width estimate (cw) is the era's, a touch wide of the real italic so it never overflows. */
  const barH=tr=>Math.round(tr.h*.8)+12;
  const dishW=cw=>cw-HOLE-YDS-PAR-24-5;
  /* the estimate runs on 95% of the real width: narrow two column cards lose more to word breaks than the per-letter guess allows */
  const rowH=(it,tr,dw)=>{dw=dw*.95;const dl=Math.min(DMAX,wrapLines(F.tx(it.n),tr.d,dw,e.cwd));const nl=wrapLines(F.tx(it.note),tr.n,dw,e.cw);return dl*tr.d*1.15+(nl?nl*tr.n*1.3+2:0)+2*PADY+1.5};
  const colH=(col,tr,cw)=>col.reduce((a,[k])=>a+barH(tr)+4+items[k].reduce((b,it)=>b+rowH(it,tr,dishW(cw)),0),0);
  const SIZES=[];TIERS.forEach(x=>{if(!SIZES.some(y=>y.d===x.d&&y.n===x.n))SIZES.push(x)});SIZES.sort((a,b)=>b.n-a.n||b.d-a.d);
  let R=null;
  const bestOf=(tr,n)=>{const cw=n>1?Math.floor((RW-GAP)/2):RW;const splits=n===1?[[C]]:C.slice(1).map((_,a)=>[C.slice(0,a+1),C.slice(a+1)]);
      let best=null;for(const cols of splits){const hs=cols.map(c=>colH(c,tr,cw)),m=Math.max(...hs),bal=m-Math.min(...hs);if(!best||m<best.m-1||(Math.abs(m-best.m)<=1&&bal<best.bal))best={m,bal,cols,hs,cw}}return best};
  /* the Out line goes first, then Yds, before a card would overflow */
  for(const [yd,oh,floor] of [[50,30,0],[50,0,0],[0,0,0]]){YDS=yd;OUTH=oh;MH=H-TOP-FH-24-HDR-cueH-10-OUTH;
    for(const tr of SIZES){if(tr.n<floor)break;for(let n=1;n<=Math.min(2,C.length);n++){const b=bestOf(tr,n);if(b.m<=MH){R={tr,n,cw:b.cw,cols:b.cols,hs:b.hs};break}}if(R)break}if(R)break}
  if(!R){const tr=SIZES[SIZES.length-1],n=Math.min(2,C.length),b=bestOf(tr,n);R={tr,n,cw:b.cw,cols:b.cols,hs:b.hs}}
  const tr=R.tr,colW=R.cw,bl=`1.5px solid ${e.rule}`;
  let ring=["m",0];if(F.egg&&items.w&&items.w.length)ring=["w",0];
  const SUB={s:"Starters",m:"Mains",w:"Dessert",d:"Drinks"};
  /* each column spends its own spare height: course gaps first (capped), rows then share what is left by flex (capped);
     more than about 100px still left and the card ends at its content, with a real film still under it */
  const plan=R.cols.map((col,ci)=>{const nb=col.length,nr=col.reduce((a,[k])=>a+items[k].length,0);let spare=MH-R.hs[ci];
    const gapX=nb>1?Math.min(18,Math.max(0,Math.floor(spare*.3/(nb-1)))):0;spare-=gapX*(nb-1);
    const stretch=Math.min(spare,nr*16);const left=spare-stretch;let still=0;
    if(left>100&&F.stillSrc){still=Math.min(left+stretch-20,Math.round(colW*9/16)+34);if(still<110)still=0}
    return {gapX,still,inner:MH-(still?still+12:0)}});
  /* holes follow golf (review 26): Front Nine from 1, The Turn from 9, Back Nine from 10 (or after The Turn), the bar is the 19th (19A, 19B when it pours more than one) */
  const nm=(items.m||[]).length,holeOf=(k,i)=>k==="s"?i+1:k==="m"?9+i:k==="w"?Math.max(10,nm?9+nm:10)+i:(items.d||[]).length>1?"19"+String.fromCharCode(65+i):"19";
  /* yardage is the joke: a hole's length is its par (price) times a hundred */
  const yds=x=>{const v=pval(x);return v==null?"":Math.round(v*100)};
  const rowsOf=(col,ci)=>col.map(([k,l],bi)=>`<div style="flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;height:${barH(tr)}px;background:${club};color:${gilt};font:700 ${Math.round(tr.h*.62)}px/1 ${BF};letter-spacing:.2em;text-transform:uppercase;padding:0 14px;margin-top:${bi?4+plan[ci].gapX:4}px"><span>${esc(l)}</span>${SUB[k]&&clean(l).toLowerCase()!==SUB[k].toLowerCase()?`<span style="font:italic 400 ${Math.max(13,Math.round(tr.h*.55))}px/1 ${BF};letter-spacing:.04em;text-transform:none;color:${giltS}">${SUB[k]}</span>`:""}</div>`+
    items[k].map((it,i)=>{const hole=holeOf(k,i),rg=ring[0]===k&&ring[1]===i,last=bi===col.length-1&&i===items[k].length-1;
      return `<div style="flex:1 1 auto;display:flex;${last?"":`border-bottom:${bl};`}align-items:stretch">
        <div style="flex:0 0 ${HOLE}px;border-right:${bl};display:flex;align-items:center;justify-content:center;font:700 ${Math.round(tr.d*.9)}px/1 ${BF};color:${e.soft}">${hole}</div>
        <div style="flex:1;min-width:0;padding:${PADY}px 12px;display:flex;flex-direction:column;justify-content:center">
          <div style="font:700 ${tr.d}px/1.15 ${BF};color:${e.ink};${clamp(DMAX)}">${esc(F.tx(it.n))}</div>
          ${clean(it.note).trim()?`<div style="font:italic 400 ${tr.n}px/1.3 ${BF};color:${e.soft};margin-top:2px">${esc(cap(F.tx(it.note)))}</div>`:""}</div>
        ${YDS?`<div style="flex:0 0 ${YDS}px;border-left:${bl};display:flex;align-items:center;justify-content:center;font:400 ${Math.round(tr.d*.78)}px/1 ${BF};color:${e.soft}">${yds(pr[k][i])}</div>`:""}
        <div style="flex:0 0 ${PAR}px;border-left:${bl};display:flex;align-items:center;justify-content:center;position:relative;font:700 ${tr.d}px/1 ${BF};color:${e.ink}">${pr[k][i]}${rg?`<span style="position:absolute;left:50%;top:50%;width:${PAR-14}px;height:${Math.round(tr.d*1.9)}px;margin:-${Math.round(tr.d*.95)}px 0 0 -${(PAR-14)/2}px;border:2.5px solid ${acc};border-radius:50%;transform:rotate(${(-8+(t.tilt||0)*1.5).toFixed(1)}deg);opacity:.85"></span>`:""}</div></div>`}).join("")).join("");
  const hdr=`<div style="display:flex;height:${HDR}px;background:${mix(e.rule,e.paper,.75)};border-bottom:2px solid ${club};font:700 15px/${HDR}px ${BF};letter-spacing:.16em;color:${club};text-transform:uppercase"><div style="flex:0 0 ${HOLE}px;text-align:center;border-right:${bl}">Hole</div><div style="flex:1;padding-left:12px;white-space:nowrap;overflow:hidden">Dish</div>${YDS?`<div style="flex:0 0 ${YDS}px;text-align:center;border-left:${bl}">Yds</div>`:""}<div style="flex:0 0 ${PAR}px;text-align:center;border-left:${bl}">Par</div></div>`;
  /* the scorecard's Out / In line under each column: holes played and the yards walked */
  const outRow=(col,ci)=>{if(!OUTH)return "";const n=col.reduce((a,[k])=>a+items[k].length,0),y=col.reduce((a,[k])=>a+items[k].reduce((b,_,i)=>b+(+yds(pr[k][i])||0),0),0);
    /* the par total (review 26b): the column's prices added up, printed the way the card prints a price */
    const pfm=col.map(([k])=>(pr[k]||[]).find(x=>pval(x)!=null)).find(Boolean)||"",par=col.reduce((a,[k])=>a+(pr[k]||[]).reduce((b,x)=>b+(pval(x)||0),0),0);
    return `<div style="display:flex;height:${OUTH}px;background:${mix(e.rule,e.paper,.75)};border-top:2px solid ${club};font:700 14px/${OUTH-2}px ${BF};letter-spacing:.14em;color:${club};text-transform:uppercase"><div style="flex:0 0 ${HOLE}px;text-align:center;border-right:${bl}">${R.cols.length>1?(ci?"In":"Out"):"Tot"}</div><div style="flex:1;padding-left:12px;white-space:nowrap;overflow:hidden;letter-spacing:.08em;text-transform:none;font-weight:400;font-style:italic">${n} ${n===1?"hole":"holes"} played</div>${YDS?`<div style="flex:0 0 ${YDS}px;text-align:center;border-left:${bl};letter-spacing:0">${y||""}</div>`:""}<div style="flex:0 0 ${PAR}px;border-left:${bl};text-align:center;letter-spacing:0;font-size:15px">${par?pfmt(Math.round(par*100)/100,pfm):""}</div></div>`};
  const card=R.cols.map((col,ci)=>{const x=RX+ci*(colW+GAP),pl=plan[ci];
    return `<div style="position:absolute;left:${x}px;top:${TOP}px;width:${colW}px;height:${pl.inner+HDR+OUTH+5}px;box-sizing:border-box;border:2.5px solid ${club};background:${e.paper};overflow:hidden">${hdr}<div style="height:${pl.inner}px;overflow:hidden;display:flex;flex-direction:column">${rowsOf(col,ci)}</div>${outRow(col,ci)}</div>`+
      (pl.still?`<div style="position:absolute;left:${x}px;top:${TOP+pl.inner+HDR+OUTH+5+12}px;width:${colW}px;height:${pl.still-5}px;box-sizing:border-box;border:2.5px solid ${club};background:${club};overflow:hidden">
        <div style="position:absolute;left:0;right:0;top:0;bottom:28px;overflow:hidden">${photo(F.stillSrc,t.photo,"center 40%")}</div>
        <div style="position:absolute;left:0;right:0;bottom:0;height:28px;display:flex;align-items:center;justify-content:center;font:italic 400 14px/1 ${BF};color:${giltT};white-space:nowrap;overflow:hidden">On the clubhouse wall: ${esc(F.title)}, ${esc(F.year)}</div></div>`:"")}).join("")+
    (F.cue?`<div style="position:absolute;left:${RX}px;width:${RW}px;top:${TOP+MH+HDR+OUTH+12}px;height:${cueH-8}px">${cueLine(F,BF,e.soft,acc,15)}</div>`:"");

  /* foot: local rules (the film's winks, up to five, as many as fit at one size) and the marker's line */
  const FY=H-28-FH,RLW=Math.round(RW*.5);
  const ruleW=RLW-12-28-22;let rules=[],rS=15;
  for(const sz of [15,14,13]){const room=FH-20-15-24,pick=[];let used=0;for(const w of F.winks.slice(0,5)){const h=Math.min(2,wrapLines(w,sz,ruleW,.5))*sz*1.25+6;if(used+h>room)break;used+=h;pick.push(w)}
    if(pick.length>rules.length){rules=pick;rS=sz}if(pick.length>=Math.min(5,F.winks.length))break}
  const n=F.note,quoted=!!(F.fl.note&&F.fl.note.text&&F.fl.note.kind==="quote"),nS=n.text.length>130?26:n.text.length>80?29:32;
  const foot=`<div style="position:absolute;left:${RX}px;top:${FY}px;width:${RLW-12}px;height:${FH}px;box-sizing:border-box;border:2px solid ${club};background:${e.paper};padding:10px 14px;overflow:hidden">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px"><span style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${club};text-transform:uppercase">Local Rules</span>${rules.length?`<span style="font:italic 400 13px/1 ${BF};color:${e.soft};white-space:nowrap">scenes to watch for</span>`:""}</div>
      ${(rules.length?rules:["Members' bar closes at sundown"]).map((r,i)=>`<div style="display:flex;gap:8px;margin-top:6px;font:400 ${rS}px/1.25 ${BF};color:${e.ink}"><b style="flex:0 0 auto;color:${acc}">${i+1}.</b><span style="${clamp(2)}">${esc(r)}</span></div>`).join("")}<div style="position:absolute;left:14px;bottom:8px;font:400 14px/1 ${BF};color:${e.soft}">${esc(credit(F))}</div></div>
    <div style="position:absolute;left:${RX+RLW}px;top:${FY}px;width:${RW-RLW}px;height:${FH}px;box-sizing:border-box;border:2px solid ${club};background:${e.paper};padding:10px 14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;${t.tilt?`transform:rotate(${(t.tilt*.3).toFixed(2)}deg);box-shadow:2px 3px 0 ${mix(e.rule,e.paper,.5)}`:""}">
      <div style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${club};text-transform:uppercase">Marker's Note</div>
      <div style="font:400 ${nS}px/1.1 ${PEN};color:${e.ink};${clamp(3)}">${quoted?`"${esc(n.text)}"`:esc(n.text)}</div>
      <div style="display:flex;align-items:flex-end;gap:10px;border-top:1px solid ${e.rule};padding-top:4px"><span style="font:700 14px/1 ${BF};letter-spacing:.14em;color:${e.soft}">SIGNED</span><span style="flex:1;font:400 26px/1.2 ${PEN};color:${acc};white-space:nowrap;overflow:hidden">${esc(n.by)}</span></div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 60% 50%,rgba(0,0,0,0) 64%,rgba(10,20,10,${(t.vig*.5).toFixed(2)}) 100%)"></div>`;
  const bg=`<div style="position:absolute;inset:0;background:${mix(e.paper,club,.08)}"></div><div style="position:absolute;inset:0;background:url(${grain}) center/1200px auto;opacity:${(.1+t.wear).toFixed(2)};mix-blend-mode:multiply"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${bg}${cover}${card}${foot}${vig}</div>`]};
};
})();
