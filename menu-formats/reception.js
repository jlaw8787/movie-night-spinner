const _ROOT_reception=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: reception. A wedding reception table set on linen, one landscape face 1344x960.
   Left: the welcome sign on its easel, the poster as the hero, whole, under a "Welcome to" card.
   Centre (signature): the menu card, letterpress on cream with a deckled edge; courses in procession, script headings, no prices.
   Right: the place card tent (prop), the seating plan strip (tables named for the film's winks), the toast (overheard quote)
   and the logo on the cake table card. Era sets card stock, ink and type pairing; tone sets wear and photo. */
(function(){
const ID="reception",_ROOT=_ROOT_reception;

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
 {linen:"#efebe2",card:"#fffdf6",ink:"#2b2622",soft:"#5e554c",acc:"#a8863f",script:"'Pinyon Script',cursive",serif:"'Cormorant Garamond',serif",caps:"'Cormorant SC',serif",cw:.42,cwd:.5,cols:["To Begin","The Main Event","Something Sweet","To Toast"]},
 {linen:"#efe5d2",card:"#fbf3e1",ink:"#3a2a1c",soft:"#6b5642",acc:"#9a5a2b",script:"'Great Vibes',cursive",serif:"'Lora',serif",caps:"'Cormorant SC',serif",cw:.5,cwd:.56,cols:["To Begin","The Main Event","Something Sweet","To Toast"]},
 {linen:"#f1ebee",card:"#fffafc",ink:"#2f2430",soft:"#634f60",acc:"#b04a76",script:"'Parisienne',cursive",serif:"'Playfair Display',serif",caps:"'Playfair Display SC',serif",cw:.5,cwd:.56,cols:["To Begin","The Main Event","Something Sweet","To Toast"]},
 {linen:"#eef0ec",card:"#ffffff",ink:"#22261f",soft:"#56604f",acc:"#6f7d6a",script:"'Allura',cursive",serif:"'EB Garamond',serif",caps:"'Cormorant SC',serif",cw:.44,cwd:.5,cols:["To Begin","The Main Event","Something Sweet","To Toast"]}
];
loadFonts(["Pinyon+Script","Great+Vibes","Parisienne","Allura","Cormorant+Garamond:ital,wght@0,500;0,700;1,500","Cormorant+SC:wght@500;700","Lora:ital,wght@0,400;0,700;1,400","Playfair+Display:ital,wght@0,400;0,700;1,400","Playfair+Display+SC:wght@400;700","EB+Garamond:ital,wght@0,400;0,600;1,400"]);

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Reception":"The Reception","Dinner, dancing and speeches",{text:"Eat, drink and be kind to whoever ends up next to you on the dance floor.",by:"The Best Man"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),S=e.script,SF=e.serif,CF=e.caps;
  const acc=readable(F.pal.accent&&lum(F.pal.accent)<.45?F.pal.accent:e.acc,e.card,3.2,e.acc);
  const linen=`<div style="position:absolute;inset:0;background:${e.linen}"></div>
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.22) 0 2px,rgba(0,0,0,0) 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.025) 0 1px,rgba(0,0,0,0) 1px 4px)"></div>
    <div style="position:absolute;inset:0;background:url(${grain}) center/1200px auto;opacity:${(.08+t.wear*.6).toFixed(2)};mix-blend-mode:multiply"></div>`;
  const shadow="0 10px 24px rgba(40,30,20,.22),0 2px 4px rgba(40,30,20,.12)";

  /* left: the welcome sign */
  const LX=34,LW=412,WT=34,WH=118;
  const vS=F.venue.length>28?24:F.venue.length>18?28:34;
  const welcome=`<div style="position:absolute;left:${LX}px;top:${WT}px;width:${LW}px;height:${WH}px;background:${e.card};box-shadow:${shadow};box-sizing:border-box;padding:10px 18px;text-align:center;border:1px solid ${mix(acc,e.card,.5)}">
    <div style="font:400 44px/1.15 ${S};color:${acc}">Welcome to</div>
    <div style="font:700 ${vS}px/1.2 ${CF};color:${e.ink};letter-spacing:.04em;white-space:nowrap;overflow:hidden">${esc(F.venue)}</div></div>`;
  const PY=WT+WH+20,PA=posterFit(LW-36,H-PY-60-36);
  const frame=`<div style="position:absolute;left:${LX+Math.round((LW-PA.w-36)/2)}px;top:${PY}px;width:${PA.w+36}px;height:${PA.h+36}px;background:linear-gradient(135deg,${mix(acc,"#ffffff",.35)},${acc} 45%,${mix(acc,"#000000",.25)});box-shadow:${shadow}">
    <div style="position:absolute;left:18px;top:18px;width:${PA.w}px;height:${PA.h}px;background:#111;overflow:hidden;box-shadow:inset 0 0 0 2px rgba(0,0,0,.3)">${hero(F,PA.w,PA.h,t.photo)}</div></div>
    <div style="position:absolute;left:${LX+LW/2-90}px;top:${PY+PA.h+36}px;width:180px;height:${H-PY-PA.h-36}px;background:linear-gradient(90deg,rgba(0,0,0,0) 0 40px,${mix(acc,"#000000",.35)} 40px 50px,rgba(0,0,0,0) 50px 130px,${mix(acc,"#000000",.35)} 130px 140px,rgba(0,0,0,0) 140px)"></div>`;

  /* centre: the menu card */
  const MX=LX+LW+34,MW=470,MT=26,MH=H-52;
  const C=sections(ctx,F,e.cols),items=itemsOf(ctx);
  const head0=88,cueH=F.cue?50:0,innerW=MW-90,innerH=MH-head0-cueH-70;
  const R=fit({C,items,tx:F.tx,W:innerW,H:innerH,maxCols:1,cw:e.cw,cwd:e.cwd,priceW:()=>0,headH:tr=>Math.round(tr.h*1.25)+14,itemX:4});
  const tr=R.tr,gap=Math.min(26,R.spare/Math.max(1,C.length+1));
  const menuBody=C.map(([k,l])=>`<div style="margin-bottom:${10+gap}px"><div style="font:400 ${Math.round(tr.h*1.25)}px/1.1 ${S};color:${acc};margin-bottom:6px">${esc(l)}</div>`+
    items[k].map(it=>{const nl=tr.nl?Math.min(tr.nl,wrapLines(F.tx(it.note),tr.n,innerW,e.cw)):0;return `<div style="margin-bottom:${tr.g+4}px">
      <div style="font:700 ${tr.d}px/1.15 ${CF};color:${e.ink};letter-spacing:.03em;${clamp(R.dmax)}">${esc(F.tx(it.n))}</div>
      ${nl?`<div style="font:italic 400 ${tr.n}px/1.3 ${SF};color:${e.soft};margin-top:2px;${clamp(nl)}">${esc(cap(F.tx(it.note)))}</div>`:""}</div>`}).join("")+`</div>`).join(`<div style="width:60px;height:1px;background:${mix(acc,e.card,.4)};margin:0 auto ${8+gap/2}px"></div>`);
  const deckle=`radial-gradient(circle at 50% 0,rgba(0,0,0,0) 3px,${e.card} 3.5px) 0 0/9px 9px repeat-x`;
  const menuCard=`<div style="position:absolute;left:${MX}px;top:${MT}px;width:${MW}px;height:${MH}px;background:${e.card};box-shadow:${shadow};transform:rotate(${(t.tilt*.25).toFixed(2)}deg)">
    <div style="position:absolute;inset:16px;border:1px solid ${mix(acc,e.card,.35)}"></div><div style="position:absolute;inset:21px;border:1px solid ${mix(acc,e.card,.65)}"></div>
    <div style="position:absolute;left:0;right:0;top:34px;text-align:center"><div style="font:700 15px/1 ${CF};letter-spacing:.34em;color:${e.soft}">THE WEDDING BREAKFAST</div>
      <div style="font:italic 400 18px/1.3 ${SF};color:${e.soft};margin-top:8px;padding:0 50px;${clamp(1)}">${esc(F.sign)}</div></div>
    <div style="position:absolute;left:45px;width:${innerW}px;top:${head0+18}px;height:${innerH}px;overflow:hidden;text-align:center">${menuBody}</div>
    ${F.cue?`<div style="position:absolute;left:50px;right:50px;bottom:34px;height:${cueH-10}px;text-align:center">${cueLine(F,SF,e.soft,acc,15)}</div>`:""}
    <div style="position:absolute;left:0;right:0;bottom:-4px;height:9px;background:${deckle};transform:rotate(180deg)"></div></div>`;

  /* right: place card, seating plan, toast, logo */
  const RX=MX+MW+30,RW=W-RX-30;
  const pc=F.prop,guest=pc?pc.title:F.title;
  const place=`<div style="position:absolute;left:${RX}px;top:34px;width:${RW}px;height:150px;background:${e.card};box-shadow:${shadow};box-sizing:border-box;padding:16px 16px 12px;text-align:center;transform:rotate(${(-t.tilt*.6).toFixed(2)}deg)">
    <div style="position:absolute;left:0;right:0;top:44%;border-top:1px dashed ${mix(e.soft,e.card,.6)}"></div>
    <div style="font:700 14px/1 ${CF};letter-spacing:.3em;color:${e.soft}">TABLE ${esc(F.num.slice(-2))}</div>
    <div style="font:400 ${guest.length>18?30:38}px/1.25 ${S};color:${e.ink};margin-top:6px;white-space:nowrap;overflow:hidden">${esc(guest)}</div>
    <div style="font:italic 400 15px/1.3 ${SF};color:${e.soft};margin-top:20px;${clamp(2)}">${esc(pc&&pc.lines.length?pc.lines.slice(0,2).join(". "):"Seated with the bride's side")}</div></div>`;
  const tabs=F.winks.slice(0,4),ST=210,SH=270;
  const seat=`<div style="position:absolute;left:${RX}px;top:${ST}px;width:${RW}px;height:${SH}px;background:${e.card};box-shadow:${shadow};box-sizing:border-box;padding:14px 16px;overflow:hidden">
    <div style="font:400 30px/1.1 ${S};color:${acc};text-align:center">Seating Plan</div>
    ${(tabs.length?tabs:["Family","Friends","Work","Plus ones"]).map((w,i)=>`<div style="display:flex;gap:10px;align-items:baseline;border-top:1px solid ${mix(acc,e.card,.7)};padding:7px 0 0;margin-top:7px"><span style="flex:0 0 auto;font:700 14px/1 ${CF};letter-spacing:.14em;color:${acc}">TABLE ${i+1}</span><span style="flex:1;font:400 15px/1.25 ${SF};color:${e.ink};${clamp(2)}">${esc(w)}</span></div>`).join("")}</div>`;
  const n=F.note,TT=ST+SH+22,TH=230,nS=n.text.length>140?16:n.text.length>90?18:20;
  const toast=`<div style="position:absolute;left:${RX}px;top:${TT}px;width:${RW}px;height:${TH}px;background:${mix(e.card,acc,.06)};box-shadow:${shadow};box-sizing:border-box;padding:14px 18px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
    <div style="font:700 14px/1 ${CF};letter-spacing:.28em;color:${e.soft};text-align:center">FROM THE TOASTS</div>
    <div style="font:italic 400 ${nS}px/1.35 ${SF};color:${e.ink};text-align:center;${clamp(5)}">"${esc(n.text)}"</div>
    <div style="font:400 28px/1.2 ${S};color:${acc};text-align:center;white-space:nowrap;overflow:hidden">${esc(n.by)}</div></div>`;
  const LT=TT+TH+22,LH=H-30-LT;
  const logo=`<div data-dark="${mix(e.ink,"#000000",.2)}" data-light="${e.card}" style="position:absolute;left:${RX}px;top:${LT}px;width:${RW}px;height:${LH-22}px;background:${mix(e.ink,"#000000",.2)};box-shadow:${shadow};display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box">${logoOr(ctx,F,RW-24,LH-44,CF,e.card,"700")}</div>
    <div style="position:absolute;left:${RX}px;width:${RW}px;top:${H-44}px;font:400 14px/1.2 ${SF};color:${e.soft};text-align:center;${clamp(1)}">${esc(credit(F).replace("Prices subject to change. ",""))}</div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${linen}${frame}${welcome}${menuCard}${place}${seat}${toast}${logo}</div>`]};
};
})();
