const _ROOT_deli=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: deli. A New York style deli wall board over the counter, one landscape face 1344x960.
   Top: the red "now serving" sign with its number and the venue in white board letters.
   Left: the poster as the hero, whole, taped to the board.
   Centre (signature): the felt letter board menu in white push-in letters, prices to the right.
   Right: the take-a-number ticket (prop), the stacking chart for the first main (its own shopping list, bread top and bottom)
   or the signed photos on the wall (the film's winks), and the receipt with the line heard at the counter.
   Era sets board, sign and type; tone sets wear and photo. */
(function(){
const ID="deli",_ROOT=_ROOT_deli;

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
 {board:"#1d1c1b",letters:"#f4f1e8",soft:"#bdb6a6",red:"#c8282b",disp:"'Oswald',sans-serif",body:"'Oswald',sans-serif",note:"'Lora',serif",cw:.46,cwd:.46},
 {board:"#2a1f18",letters:"#f6efe0",soft:"#c9b89c",red:"#c8432b",disp:"'Oswald',sans-serif",body:"'Oswald',sans-serif",note:"'Lora',serif",cw:.46,cwd:.46},
 {board:"#191a1d",letters:"#f3f4f6",soft:"#b5b9c0",red:"#d0262f",disp:"'Oswald',sans-serif",body:"'Oswald',sans-serif",note:"'Barlow',sans-serif",cw:.46,cwd:.46},
 {board:"#141414",letters:"#ffffff",soft:"#b8b8b8",red:"#e0362c",disp:"'Oswald',sans-serif",body:"'Oswald',sans-serif",note:"'Inter Tight',sans-serif",cw:.46,cwd:.46}
];
loadFonts(["Oswald:wght@500;700","Lora:ital,wght@0,400;0,700;1,400","Barlow:ital,wght@0,500;0,700;1,500","Inter+Tight:ital,wght@0,400;0,700;1,400","Share+Tech+Mono","Courier+Prime:wght@400;700"]);
const BREAD=/\b(bread|rye|roll|bun|bagel|baguette|sourdough|bialy|challah|hero|sub|wrap|pita|toast|loaf)\b/i;

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Deli":"Corner Deli","Take a number. We'll call it.",{text:"Take a number, know your order, and don't ask for mayo on the pastrami.",by:"The Counterman"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body,NF=e.note;
  const red=e.red,lt=e.letters;
  const board=`<div style="position:absolute;inset:0;background:${e.board}"></div>
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 2px,rgba(0,0,0,0) 2px 12px)"></div>
    <div style="position:absolute;inset:0;background:url(${grain}) center/900px auto;opacity:${(.18+t.wear*.4).toFixed(2)};mix-blend-mode:screen;filter:invert(1)"></div>
    <div style="position:absolute;inset:0;border:16px solid #6b4a2b;box-shadow:inset 0 0 0 3px #3e2a17"></div>`;

  /* top: venue and now serving */
  const M=34,HH=120,NW=250;
  const vS=F.venue.length>30?36:F.venue.length>20?44:54;
  const top=`<div style="position:absolute;left:${M}px;top:${M-4}px;width:${W-2*M-NW-30}px;height:${HH}px;display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 ${vS}px/1.2 ${DF};color:${lt};text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;overflow:hidden">${esc(F.venue)}</div>
      <div style="font:500 17px/1.2 ${BF};color:${e.soft};text-transform:uppercase;letter-spacing:.24em;${clamp(1)}">${esc(F.sign)}</div></div>
    <div style="position:absolute;right:${M}px;top:${M}px;width:${NW}px;height:${HH-14}px;background:${red};border-radius:8px;box-shadow:0 6px 14px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:space-between;padding:0 16px;box-sizing:border-box">
      <div style="font:700 17px/1.1 ${BF};color:#fff;letter-spacing:.12em">NOW<br>SERVING</div>
      <div style="background:#120606;padding:6px 10px;border-radius:4px;font:400 50px/1 'Share Tech Mono',monospace;color:#ff5a3c;text-shadow:0 0 8px #ff3a1c">${esc(String(F.num).slice(-2).padStart(2,"0"))}</div></div>`;

  /* left: poster taped up */
  const PY=M+HH+14,LW=400,PA=posterFit(LW-20,H-PY-M-10);
  const tape=(x,y,r)=>`<div style="position:absolute;left:${x}px;top:${y}px;width:96px;height:30px;background:rgba(240,232,200,.75);transform:rotate(${r}deg);box-shadow:0 1px 2px rgba(0,0,0,.3)"></div>`;
  const PX=M+Math.round((LW-PA.w)/2);
  const poster=`<div style="position:absolute;left:${PX}px;top:${PY}px;width:${PA.w}px;height:${PA.h}px;background:#111;box-shadow:0 8px 18px rgba(0,0,0,.6);transform:rotate(${(t.tilt*.5).toFixed(2)}deg);overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div>${tape(PX-30,PY-14,-24)}${tape(PX+PA.w-66,PY-14,22)}`;

  /* right column */
  const RW=290,RX=W-M-RW;
  const pr2=F.prop;
  const ticket=`<div style="position:absolute;left:${RX}px;top:${PY}px;width:${RW}px;height:150px;background:${mix(red,"#ffffff",.08)};box-sizing:border-box;padding:12px 16px;transform:rotate(${(-t.tilt*.6).toFixed(2)}deg);box-shadow:0 6px 12px rgba(0,0,0,.5);overflow:hidden">
    <div style="position:absolute;left:-12px;top:63px;width:24px;height:24px;border-radius:50%;background:${e.board}"></div><div style="position:absolute;right:-12px;top:63px;width:24px;height:24px;border-radius:50%;background:${e.board}"></div><div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 14px/1 ${BF};letter-spacing:.22em;color:#fff">TAKE A NUMBER</span><span style="font:700 34px/1 ${BF};color:#fff">${esc(String(+F.num%100+1).padStart(2,"0"))}</span></div>
    <div style="font:700 24px/1.15 ${BF};color:#fff;text-transform:uppercase;margin-top:8px;${clamp(2)}">${esc(pr2?pr2.title:"Next in line")}</div>
    <div style="font:400 15px/1.25 ${NF};color:${mix(red,"#ffffff",.8)};margin-top:4px;${clamp(1)}">${esc(pr2&&pr2.lines[0]?pr2.lines[0]:"Please wait to be called")}</div></div>`;
  /* stacking chart from the first main's shopping list, bread on the outside */
  const m0=(ctx.menu.m||[])[0],shop=m0&&Array.isArray(m0.shop)?m0.shop.map(s=>clean(String(s).split("@")[0])).filter(Boolean):[];
  const bread=shop.find(s=>BREAD.test(s)),fill=shop.filter(s=>s!==bread).slice(0,4);
  const SY=PY+172,SH=280;
    const stack=bread&&fill.length>=2?`<div style="position:absolute;left:${RX}px;top:${SY}px;width:${RW}px;height:${SH}px;box-sizing:border-box;border:2px solid ${e.soft};padding:10px 14px;overflow:hidden">
      <div style="font:700 14px/1 ${BF};letter-spacing:.2em;color:${e.soft}">HOW WE STACK IT</div>
      <div style="font:700 17px/1.2 ${BF};color:${lt};text-transform:uppercase;margin:6px 0 8px;${clamp(1)}">${esc(F.tx(m0.n))}</div>
      ${[bread,...fill,bread].map((s,i,a)=>{const out=i===0||i===a.length-1;return `<div style="margin-top:4px;border:2px solid ${out?"#d9b47a":mix(e.soft,e.board,.3)};border-radius:${i===0?"16px 16px 3px 3px":i===a.length-1?"3px 3px 10px 10px":"3px"};background:${out?"rgba(217,180,122,.18)":"transparent"};padding:3px 10px;font:${out?700:500} 15px/1.25 ${BF};color:${lt};text-transform:uppercase;letter-spacing:.05em;text-align:center;${clamp(1)}">${esc(s)}</div>`}).join("")}</div>`
    :`<div style="position:absolute;left:${RX}px;top:${SY}px;width:${RW}px;height:${SH}px;box-sizing:border-box;border:2px solid ${e.soft};padding:10px 14px;overflow:hidden">
      <div style="font:700 14px/1 ${BF};letter-spacing:.2em;color:${e.soft}">SIGNED ON THE WALL</div>
      ${(F.winks.length?F.winks.slice(0,4):["Regulars only"]).map(w=>`<div style="font:400 16px/1.25 ${NF};font-style:italic;color:${lt};margin-top:10px;padding-left:10px;border-left:3px solid ${red};${clamp(2)}">${esc(w)}</div>`).join("")}</div>`;
  const n=F.note,RY=SY+SH+20,RH=H-M-RY-6,nS=n.text.length>130?15:n.text.length>80?16:18;
  const receipt=`<div style="position:absolute;left:${RX+10}px;top:${RY}px;width:${RW-20}px;height:${RH}px;background:#fbfaf4;box-sizing:border-box;padding:10px 14px;transform:rotate(${(t.tilt*.8).toFixed(2)}deg);box-shadow:0 6px 12px rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
    <div style="font:700 14px/1 'Courier Prime',monospace;color:#333;letter-spacing:.1em;text-align:center">HEARD AT THE COUNTER</div>
    <div style="font:400 ${nS}px/1.3 'Courier Prime',monospace;color:#222;${clamp(5)}">"${esc(n.text)}"</div>
    <div style="font:700 14px/1.2 'Courier Prime',monospace;color:#333;text-align:right;${clamp(1)}">${esc(n.by)}</div>
    <div style="font:400 14px/1.2 'Courier Prime',monospace;color:#666;border-top:1px dashed #999;padding-top:4px;${clamp(2)}">${esc(credit(F))}</div></div>`;

  /* centre: the letter board */
  const MX=M+LW+24,MW=RX-24-MX,MY=PY,cueH=F.cue?44:0,LGH=96,MH=H-M-MY-cueH-LGH-26;
  const C=sections(ctx,F,["Starters","Sandwiches","From the Case","Drinks"]),items=itemsOf(ctx),pr=prices(items,F.ei,F.egg);
  const R=fit({C,items,tx:F.tx,W:MW,H:MH,maxCols:1,cw:.46,cwd:.5,caps:1});
  const head=(l,tr)=>`<div style="font:700 ${tr.h}px/1.2 ${DF};color:${red};text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px;background:${lt};display:inline-block;padding:0 10px">${esc(l)}</div>`;
  const o={head,tx:F.tx,nf:BF,bf:NF,ink:lt,soft:e.soft,pc:lt,cw:e.cw,caps:1,nw:500,pw:500,leader:1,lead:mix(e.soft,e.board,.5),cgap:12+Math.min(30,R.spare/Math.max(1,C.length))};
  const menu=`<div style="position:absolute;left:${MX}px;top:${MY}px;width:${MW}px;height:${MH}px;overflow:hidden">${C.map(s=>course(s,items,pr,R,o)).join("")}</div>
    ${F.cue?`<div style="position:absolute;left:${MX}px;width:${MW}px;top:${MY+MH+6}px;height:${cueH-8}px">${cueLine(F,NF,e.soft,red,15)}</div>`:""}
    <div data-dark="rgba(0,0,0,.45)" data-light="#efece4" style="position:absolute;left:${MX}px;width:${MW}px;top:${H-M-LGH-6}px;height:${LGH}px;background:rgba(0,0,0,.45);border:2px solid ${mix(e.soft,e.board,.5)};display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box">${logoOr(ctx,F,MW-40,LGH-20,DF,lt,"700")}</div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 60%,rgba(0,0,0,${(t.vig*.7).toFixed(2)}) 100%)"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${board}${top}${poster}${menu}${ticket}${stack}${receipt}${vig}</div>`]};
};
})();
