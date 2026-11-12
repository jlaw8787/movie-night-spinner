const _ROOT_skilodge=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: skilodge. A ski lodge menu with a lift ticket, one landscape face 1344x960.
   Left: the poster as the hero, whole, in a timber frame, the lift ticket on its wire wicket hanging off the corner (prop and number).
   Right (signature): the lodge menu card. Courses graded like the runs: snacks green circle, mains blue square,
   sweets black diamond, drinks double black. Foot: the snow report board (the film's winks) and ski patrol's note
   (the overheard quote). Era sets timber, card and type; tone sets wear and photo. */
(function(){
const ID="skilodge",_ROOT=_ROOT_skilodge;

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
 {wood:"#5a3a22",wood2:"#4a2f1b",card:"#f7f1e3",ink:"#2a1f17",soft:"#5f5245",acc:"#a3322a",disp:"'Alfa Slab One',serif",dw:"400",body:"'Lora',serif",cw:.5,cwd:.56},
 {wood:"#6b4426",wood2:"#583720",card:"#f6ead2",ink:"#3a2614",soft:"#6a543d",acc:"#d06a1f",disp:"'Shrikhand',cursive",dw:"400",body:"'Barlow',sans-serif",cw:.48,cwd:.53},
 {wood:"#3f3a46",wood2:"#34303a",card:"#f8f8f6",ink:"#1f2233",soft:"#4f5468",acc:"#e2367a",disp:"'Bungee',cursive",dw:"400",body:"'Barlow Semi Condensed',sans-serif",cw:.44,cwd:.49},
 {wood:"#463a30",wood2:"#3a3028",card:"#fbfbf9",ink:"#1a1c1e",soft:"#50565c",acc:"#e0582a",disp:"'Familjen Grotesk',sans-serif",dw:"700",body:"'Inter Tight',sans-serif",cw:.5,cwd:.55}
];
loadFonts(["Alfa+Slab+One","Shrikhand","Bungee","Familjen+Grotesk:wght@500;700","Lora:ital,wght@0,400;0,700;1,400","Barlow:ital,wght@0,500;0,700;1,500","Barlow+Semi+Condensed:ital,wght@0,500;0,700;1,500","Inter+Tight:ital,wght@0,400;0,700;1,400","Caveat:wght@600"]);
/* trail markers, drawn as the signs are: a green circle, a blue square, a black diamond, two black diamonds */
const MARK={s:["#1f8a3d","circle"],m:["#1f5fb4","square"],w:["#111111","diamond"],d:["#111111","double"]};
function marker(k,size){const [c,sh]=MARK[k]||MARK.s,s=size;
  if(sh==="circle")return `<span style="display:inline-block;flex:0 0 ${s}px;width:${s}px;height:${s}px;border-radius:50%;background:${c}"></span>`;
  if(sh==="square")return `<span style="display:inline-block;flex:0 0 ${s}px;width:${s}px;height:${s}px;background:${c}"></span>`;
  const d=`<span style="display:inline-block;flex:0 0 ${Math.round(s*.78)}px;width:${Math.round(s*.78)}px;height:${Math.round(s*.78)}px;background:${c};transform:rotate(45deg);margin:0 ${Math.round(s*.14)}px"></span>`;
  return sh==="double"?`<span style="display:inline-flex;flex:0 0 auto;gap:${Math.round(s*.18)}px">${d}${d}</span>`:d}

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Lodge":"The Ski Lodge","Lifts open nine till four",{text:"Last chair goes at four. Hot chocolate is on till the fire burns out.",by:"Ski Patrol"});
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
  const pr2=F.prop,TX=LX+Math.round((PA.w+40)/2)-20,TY=36+PA.h+40+44;
  const ticket=`<div style="position:absolute;left:${TX}px;top:${TY-34}px;width:4px;height:44px;background:#9aa0a6;transform:rotate(4deg);transform-origin:top"></div>
    <div style="position:absolute;left:${TX-140}px;top:${TY}px;width:320px;height:176px;background:#ffffff;border-radius:8px;box-shadow:0 6px 14px rgba(0,0,0,.45);transform:rotate(${(3+t.tilt).toFixed(1)}deg);overflow:hidden;box-sizing:border-box">
      <div style="height:42px;background:${acc};display:flex;align-items:center;justify-content:center;font:700 16px/1 ${BF};letter-spacing:.26em;color:${lum(acc)>.4?"#111":"#fff"}">LIFT TICKET</div>
      <div style="padding:8px 12px;text-align:center">
        <div style="font:700 22px/1.1 ${BF};color:#15171a;text-transform:uppercase;${clamp(2)}">${esc(pr2?pr2.title:"All Mountain")}</div>
        <div style="font:400 15px/1.25 ${BF};color:#4a4f55;margin-top:4px;${clamp(2)}">${esc(pr2&&pr2.lines.length?pr2.lines.slice(0,2).join(". "):"Valid today only")}</div>
        <div style="font:700 26px/1 ${DF};color:${acc};margin-top:8px">No. ${esc(F.num.slice(-4))}</div></div></div>`;

  /* right: the lodge menu card */
  const RX=LX+LW+28,RW=W-RX-36,CT=36,FH=196,CH=H-CT-36-FH-20;
  const HH=104,cueH=F.cue?44:0;
  const vS=F.venue.length>28?30:F.venue.length>18?36:44;
  const C=sections(ctx,F,["Green Runs","Blue Runs","Black Runs","Double Black"]),items=itemsOf(ctx),pr=prices(items,F.ei,F.egg);
  const MW=RW-48,MH=CH-HH-cueH-34;
  const R=fit({C,items,tx:F.tx,W:MW,H:MH,maxCols:2,gap:28,cw:e.cw,cwd:e.cwd});
  const head=(l,tr,k)=>`<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;border-bottom:2px solid ${mix(e.ink,e.card,.75)};padding-bottom:5px">${marker(k,Math.round(tr.h*.8))}<span style="font:${e.dw} ${tr.h}px/1.15 ${DF};color:${e.ink}">${esc(l)}</span></div>`;
  const o={head,tx:F.tx,nf:BF,bf:BF,ink:e.ink,soft:e.soft,pc:acc,cw:e.cw,leader:1,lead:mix(e.soft,e.card,.5),cgap:12+Math.min(30,R.spare/Math.max(1,C.length))};
  const card=`<div style="position:absolute;left:${RX}px;top:${CT}px;width:${RW}px;height:${CH}px;background:${e.card};box-shadow:${shadow}">
    <div style="position:absolute;inset:0;background:url(${grain}) center/1100px auto;opacity:${(.12+t.wear*.5).toFixed(2)};mix-blend-mode:multiply"></div>
    <div style="position:absolute;left:24px;right:24px;top:18px;height:${HH-26}px;display:flex;align-items:center;gap:18px;border-bottom:4px double ${e.ink}">
      <div style="flex:1;min-width:0"><div style="font:${e.dw} ${vS}px/1.2 ${DF};color:${acc};white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
        <div style="font:700 15px/1.2 ${BF};letter-spacing:.18em;text-transform:uppercase;color:${e.soft};margin-top:3px;${clamp(1)}">${esc(F.sign)}</div></div>
      <div data-dark="${mix(e.wood,"#000000",.3)}" data-light="${e.card}" style="flex:0 0 220px;height:${HH-40}px;background:${mix(e.wood,"#000000",.3)};display:flex;align-items:center;justify-content:center;padding:6px 10px;box-sizing:border-box;margin-bottom:8px">${logoOr(ctx,F,200,HH-52,DF,"#fff",e.dw)}</div></div>
    <div style="position:absolute;left:24px;top:${HH+10}px;width:${MW}px;height:${MH}px;display:flex;gap:28px;overflow:hidden">${R.cols.map(col=>`<div style="flex:0 0 ${R.CW}px">${col.map(s=>course(s,items,pr,R,o)).join("")}</div>`).join("")}</div>
    ${F.cue?`<div style="position:absolute;left:24px;right:24px;bottom:14px;height:${cueH-10}px;border-top:1px solid ${mix(e.soft,e.card,.6)};padding-top:6px">${cueLine(F,BF,e.soft,acc,15)}</div>`:""}</div>`;

  /* foot: snow report and ski patrol */
  const FY=H-36-FH,SW=Math.round(RW*.46);
  const rep=F.winks.slice(0,3),labs=["Base","Top","Lifts"];
  const report=`<div style="position:absolute;left:${RX}px;top:${FY}px;width:${SW}px;height:${FH}px;background:#1d2a33;box-shadow:${shadow};box-sizing:border-box;padding:12px 16px;overflow:hidden;border:6px solid ${mix(e.wood,"#000000",.2)}">
    <div style="font:700 15px/1 ${BF};letter-spacing:.24em;color:#9fd4ff">SNOW REPORT</div>
    ${(rep.length?rep:["Fresh powder overnight","Groomed and fast","All open"]).map((r,i)=>`<div style="display:flex;gap:10px;margin-top:9px;font:400 15px/1.25 ${BF};color:#eef4f7"><b style="flex:0 0 52px;color:#ffd36e">${labs[i]}</b><span style="${clamp(2)}">${esc(r)}</span></div>`).join("")}</div>`;
  const n=F.note,nS=n.text.length>140?24:n.text.length>90?27:30;
  const patrol=`<div style="position:absolute;left:${RX+SW+18}px;top:${FY}px;width:${RW-SW-18}px;height:${FH}px;background:${e.card};box-shadow:${shadow};box-sizing:border-box;padding:12px 16px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border-top:8px solid ${acc}">
    <div style="font:700 15px/1 ${BF};letter-spacing:.22em;color:${acc}">SKI PATROL SAYS</div>
    <div style="font:600 ${nS}px/1.12 'Caveat',cursive;color:${e.ink};${clamp(3)}">"${esc(n.text)}"</div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span style="font:700 15px/1.2 ${BF};color:${e.soft};${clamp(1)}">${esc(n.by)}</span><span style="font:400 14px/1 ${BF};color:${e.soft};white-space:nowrap">${esc(credit(F).replace("Prices subject to change. ",""))}</span></div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(10,6,2,${(t.vig*.7).toFixed(2)}) 100%)"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${wood}${frame}${ticket}${card}${report}${patrol}${vig}</div>`]};
};
})();
