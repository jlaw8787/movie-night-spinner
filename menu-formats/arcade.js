const _ROOT_arcade=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: arcade. An arcade prize counter board, one landscape face 1344x960.
   Top: the marquee (venue in neon tube lettering, sign underneath) with the logo panel.
   Left: the poster as the hero, whole, in a cabinet bezel (scan lines on the bezel only, never on the poster).
   Right (signature): the prize counter. Every dish is priced in tickets. Foot: the token strip, the high score table and
   the top shelf of prizes (the film's winks, priced in tickets), plus the overheard line from the change machine.
   Era sets cabinet colours, neon and type; tone sets wear and photo. */
(function(){
const ID="arcade",_ROOT=_ROOT_arcade;

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
/* logo in its own colours straight on the dark panel, no box. Each pixel is judged by its contrast against the dark panel
   (relative luminance, so a saturated red or yellow reads and only near-black, navy or dark grey fails). A logo that is
   mostly unreadable is hidden and the film title in the layout's type shows instead. */
const SAMPLE="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,a=0,b=0,g=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;var L=.2126*g(d[k])+.7152*g(d[k+1])+.0722*g(d[k+2]);if(L<.09)a++;else b++}if(a>b*1.2){i.style.display='none';var t=i.nextElementSibling;if(t)t.style.display='block'}}catch(e){}";
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
const TIERS=[{d:30,n:21,g:16,h:34,nl:2},{d:28,n:20,g:14,h:32,nl:2},{d:26,n:19,g:12,h:30,nl:2},{d:24,n:18,g:10,h:27,nl:2},{d:22,n:17,g:8,h:25,nl:2},{d:21,n:16,g:7,h:24,nl:2},{d:20,n:16,g:6,h:23,nl:2},{d:22,n:17,g:8,h:25,nl:1},{d:20,n:15,g:6,h:22,nl:1},{d:19,n:14,g:5,h:21,nl:1},{d:18,n:14,g:4,h:20,nl:1},{d:17,n:14,g:3,h:19,nl:1},{d:16,n:14,g:2,h:18,nl:1},{d:20,n:15,g:6,h:22,nl:0},{d:18,n:14,g:4,h:20,nl:0},{d:16,n:14,g:3,h:18,nl:0}];
/* every note gets the lines its estimate needs (up to three) and the estimate (cw .40, measured on Oswald) is close to the real type,
   so a tier is only chosen when all notes print in full; the 17 and 16px tiers keep notes on before any tier that drops them */
/* sections into up to maxCols columns at the biggest type that fits; returns tier, column split and column width */
function fit(o){
  const {C,items,tx,W,H,gap=24,cw=.5,cwd=.56,caps=0,maxCols=2,minCols=1,maxItems=4,headX=14}=o;const priceW=o.priceW||(d=>d*2.6+10);
  const hh=o.headH||(tr=>tr.h*1.3+headX);let dmax=3,CW=W;
  const cH=(tr,k)=>hh(tr)+items[k].slice(0,maxItems).reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),cwd*(caps?1.12:1)));const nl=tr.nl?Math.min(3,wrapLines(tx(it.note),tr.n,CW-(o.indent||0),cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g+(o.itemX||0)},0);
  const splits=n=>{if(n===1)return [[C.length]];const out=[];if(n===2)for(let a=1;a<C.length;a++)out.push([a,C.length]);if(n===3)for(let a=1;a<C.length;a++)for(let b=a+1;b<C.length;b++)out.push([a,b,C.length]);return out};
  const tryTier=(tr,n)=>{CW=(W-gap*(n-1))/n;let best=null;for(const s of splits(n)){let st=0,m=0;const cols=[],hs=[];for(const e of s){const sec=C.slice(st,e);cols.push(sec);const h=sec.reduce((x,[k])=>x+cH(tr,k),0);hs.push(h);m=Math.max(m,h);st=e}if(!best||m<best.m)best={m,cols,hs}}return best};
  for(const tr of TIERS)for(let n=minCols;n<=Math.min(maxCols,C.length);n++){const q=tryTier(tr,n);if(q&&q.m*1.02<=H)return {tr,cols:q.cols,hs:q.hs,CW,dmax,spare:H-q.m*1.02,n}}
  dmax=2;const tr=TIERS[TIERS.length-1],n=Math.min(maxCols,C.length),q=tryTier(tr,n);return {tr,cols:q.cols,hs:q.hs,CW,dmax,spare:0,n};
}
/* one course: heading plus dishes; o sets fonts, colours and the heading/row style */
function course(sec,items,pr,R,o){
  const [k,label]=sec,{tr,CW,dmax}=R;
  return `<div style="margin-bottom:${o.cgap||12}px;">${o.head(label,tr,k)}${items[k].slice(0,o.maxItems||4).map((it,i)=>{const nl=tr.nl?Math.min(3,wrapLines(o.tx(it.note),tr.n,CW-(o.indent||0),o.cw||.5)):0;
    const lead=o.leader?`<span style="flex:1;min-width:16px;border-bottom:2px dotted ${o.lead||o.soft};transform:translateY(-6px)"></span>`:"";
    return `<div style="margin-bottom:${tr.g}px;${o.indent?`padding-left:${o.indent}px;position:relative`:""}">${o.pre?o.pre(k,i,tr):""}
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="${o.leader?"flex:0 1 auto":"flex:1"};font:${o.nw||700} ${tr.d}px/1.15 ${o.nf};color:${o.ink};${o.caps?"text-transform:uppercase;letter-spacing:.04em;":""}${clamp(dmax)}">${esc(o.tx(it.n))}</span>${lead}<span style="font:${o.pw||700} ${tr.d+(o.pp||2)}px/1 ${o.pf||o.nf};color:${o.pc||o.ink};white-space:nowrap">${o.price?o.price(pr[k][i],k,i):pr[k][i]}</span></div>
      ${nl?`<div style="font:${o.ns||"400"} ${tr.n}px/1.3 ${o.bf};color:${o.soft};margin-top:3px;${clamp(nl)}">${esc(cap(o.tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
}
function sections(ctx,F,labels){return [["s",labels[0]],["m",labels[1]],["w",labels[2]],["d",F.drinks||labels[3]]].filter(([k])=>(ctx.menu[k]||[]).length)}
function itemsOf(ctx){const o={};for(const k of ["s","m","w","d"])o[k]=(ctx.menu[k]||[]).slice(0,4);return o}
function cueLine(F,bf,ink,acc,size){return F.cue?`<div data-fit="cue" style="font:italic 400 ${size||15}px/1.3 ${bf};color:${ink};${clamp(2)}"><b style="font-style:normal;color:${acc}">Showtime:</b> ${esc(cap(F.cue))}</div>`:""}
function logoOr(ctx,F,maxW,maxH,df,color,dw,keepDark){const lg=logoImg(ctx,maxW,maxH);const ts=F.title.length>40?Math.round(maxH*.26):F.title.length>24?Math.round(maxH*.34):F.title.length>12?Math.round(maxH*.44):Math.round(maxH*.56);
  return lg?`<img src="${lg.src}" crossorigin="anonymous" ${keepDark?"":`onload="${SAMPLE}"`} style="width:${lg.w}px;height:${lg.h}px;object-fit:contain">`:`<div style="font:${dw||700} ${Math.max(18,ts)}px/1.05 ${df};color:${color};text-align:center;${clamp(3)}">${esc(F.title)}</div>`}
const grainOf=(ctx,root)=>(ctx.root!=null?ctx.root:root)+"assets/era/_shared/paper-grain.webp";
const credit=F=>`Prices subject to change.${F.fam?" No alcohol served.":""} Images: TMDB.`;

const W=1344,H=960;
const E=[
 {bg:"#1b1414",panel:"#2a1f1d",ink:"#fbf3e4",soft:"#d9c8ad",neon:"#ff6a3d",neon2:"#ffd36e",disp:"'Monoton',cursive",dw:"400",body:"'Oswald',sans-serif",mono:"'Oswald',sans-serif",cw:.40,cwd:.44},
 {bg:"#1d1410",panel:"#2c1e15",ink:"#fbefdc",soft:"#dcc3a0",neon:"#ff8c1a",neon2:"#ffd84a",disp:"'Bungee Shade',cursive",dw:"400",body:"'Oswald',sans-serif",mono:"'Share Tech Mono',monospace",cw:.40,cwd:.44},
 {bg:"#0d0b1f",panel:"#17143a",ink:"#f5f3ff",soft:"#c3bfe6",neon:"#ff3fa4",neon2:"#33e1ff",disp:"'Press Start 2P',cursive",dw:"400",body:"'Oswald',sans-serif",mono:"'Press Start 2P',cursive",cw:.40,cwd:.44},
 {bg:"#0b0e14",panel:"#141a24",ink:"#f2f6fa",soft:"#b9c4d0",neon:"#3dff9a",neon2:"#ff4fd8",disp:"'Audiowide',cursive",dw:"400",body:"'Oswald',sans-serif",mono:"'Share Tech Mono',monospace",cw:.40,cwd:.44}
];
loadFonts(["Monoton","Bungee+Shade","Press+Start+2P","Audiowide","Oswald:wght@500;700","Share+Tech+Mono"]);
const glow=(c,r)=>`text-shadow:0 0 ${r*.3}px #fff,0 0 ${r*.6}px ${c},0 0 ${r}px ${c},0 0 ${r*2}px ${c}`;

window.MENU_FORMATS[ID]=ctx=>{
  const F=film(ctx,t=>t.length<=18?t+" Arcade":"Game Zone","Tokens at the change machine",{text:"Two tokens a game, and the claw machine is not rigged. Mostly.",by:"The Change Machine"});
  const e=E[F.b],t=F.t,grain=grainOf(ctx,_ROOT),DF=e.disp,BF=e.body,MF=e.mono;
  /* per-film arcade flavour (data/film-flavour.json "arcade"): counter, redeem, sections[4], tokens, shelf, insert;
     space: starfield and a ringed planet on the marquee and the tokens; logoDark: keep the logo on the dark panel (a bright logo the sampler reads as dark); noLogo: no logo panel in the marquee (the poster carries it), the film title and year sit there instead; quote {text, by}: a line in the cabinet above the coin slot; panel: see the board; still: {i, title} swaps the high score table for a real film still */
  const A=(ctx.flavour||{}).arcade||{},AL=k=>A[k]?clean(A[k]):"";
  const svgImg=(inner,w,h,vb,css)=>`<div style="width:${w}px;height:${h}px;background:url(&quot;data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='${vb||`0 0 ${w} ${h}`}'>${inner.replace(/"/g,"'")}</svg>`)}&quot;) center/100% 100% no-repeat;${css||""}"></div>`;
  const neon=F.pal.accent&&lum(F.pal.accent)>.18?F.pal.accent:e.neon,neon2=e.neon2;
  const stars=A.space?svgImg(Array.from({length:90},(_,i)=>{const x=(i*373+97)%W,y=(i*211+53)%H,r=i%7?1.1:2.2;return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${i%3?.35:.7}"/>`}).join(""),W,H,0,"position:absolute;left:0;top:0"):"";
  const planet=(sz,body,ring)=>svgImg(`<circle cx="20" cy="20" r="11" fill="${body}"/><circle cx="16" cy="16" r="3" fill="#ffffff" opacity=".25"/><ellipse cx="20" cy="21" rx="19" ry="5.5" fill="none" stroke="${ring}" stroke-width="2.6" transform="rotate(-18 20 21)"/>`,sz,sz,"0 0 40 40","flex:0 0 auto");
  const bg=`<div style="position:absolute;inset:0;background:${e.bg}"></div><div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 0%,${mix(neon,e.bg,.82)},rgba(0,0,0,0) 55%),radial-gradient(ellipse at 90% 100%,${mix(neon2,e.bg,.86)},rgba(0,0,0,0) 50%)"></div>
    <div style="position:absolute;inset:0;background:url(${grain}) center/1000px auto;opacity:${(.08+t.wear*.4).toFixed(2)};mix-blend-mode:screen"></div>${stars}`;

  /* marquee */
  const MH=122,M=28;
  const pix=F.b===2;const vS=pix?(F.venue.length>24?20:F.venue.length>16?26:F.venue.length>10?32:44):(F.venue.length>28?34:F.venue.length>18?42:52);
  const LGW=270;
  /* the poster beside the marquee already carries the logo, so with a poster the marquee prints the title and year (arcade.logo: true keeps the logo);
     with no poster the logo sits straight on the panel with a soft glow, and falls back to the title if it cannot read there */
  const noLogo=A.noLogo||(!!F.posSrc&&!A.logo);
  const lg=noLogo?null:logoImg(ctx,LGW-20,MH-48);
  const ttl=`<div style="font:700 ${F.title.length>24?18:F.title.length>12?24:30}px/1.1 ${BF};letter-spacing:.08em;text-transform:uppercase;color:#fff;text-align:center;${glow(neon,8)};${clamp(2)}">${esc(F.title)}</div>`;
  const marquee=`<div style="position:absolute;left:${M}px;top:${M}px;width:${W-2*M}px;height:${MH}px;background:${e.panel};border:3px solid ${mix(neon,e.panel,.4)};box-sizing:border-box;box-shadow:0 0 22px ${mix(neon,e.bg,.6)},inset 0 0 18px rgba(0,0,0,.6)">
    <div style="position:absolute;left:26px;top:0;bottom:0;right:${noLogo?300:LGW+40}px;display:flex;flex-direction:column;justify-content:center">
      <div style="display:flex;align-items:center;gap:14px"><div style="font:${e.dw} ${vS}px/1.3 ${DF};color:#fff;${glow(neon,14)};white-space:nowrap;overflow:hidden;padding:30px;margin:-30px;min-width:0">${esc(F.venue)}</div>${A.space?planet(Math.round(vS*1.25),neon,neon2):""}</div>
      <div style="font:700 17px/1.2 ${BF};letter-spacing:.22em;text-transform:uppercase;color:${neon2};margin-top:4px;${clamp(1)}">${esc(F.sign)}</div></div>
    ${noLogo?`<div style="position:absolute;right:28px;top:0;bottom:0;display:flex;align-items:center;font:700 18px/1.2 ${BF};letter-spacing:.26em;text-transform:uppercase;color:${e.soft};white-space:nowrap">${esc(F.title)}, ${esc(F.year)}</div>`:""}${noLogo?"":`<div style="position:absolute;right:16px;top:14px;width:${LGW}px;height:${MH-34}px;display:flex;align-items:center;justify-content:center;padding:6px 10px;box-sizing:border-box">${lg?`<img src="${lg.src}" crossorigin="anonymous" alt="" ${A.logoDark?"":`onload="${SAMPLE}"`} style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(255,255,255,.18))"><div style="display:none;width:100%">${ttl}</div>`:ttl}</div>`}</div>`;

  /* cabinet bezel with the poster */
  const BY=M+MH+20,BW=448,BH=H-M-BY;const PA=posterFit(BW-56,BH-110);
  /* arcade.still {i, title}: a real film still (TMDB, by its number in the film's stills) in place of the high score table, note under it */
  const stl=A.still&&(ctx.stills||[])[A.still.i]?ctx.img(ctx.stills[A.still.i],"w780"):"";
  /* no arcade.quote: the film's note goes in the bezel under the poster (and leaves the high score table), at a size that fits the space */
  const nb=F.note,bzAvail=BH-84-(28+PA.h+12);let bzFs=0;
  if(!(A.quote&&A.quote.text)&&!stl)for(const fs of [18,17,16,15]){if(wrapLines(`"${nb.text}" ${nb.by}`,fs,BW-40,.47)*fs*1.3<=bzAvail){bzFs=fs;break}}
  const bzQuote=A.quote&&A.quote.text?{text:clean(A.quote.text),by:clean(A.quote.by||""),fs:18}:bzFs?{text:nb.text,by:nb.by,fs:bzFs}:null;
  const bezel=`<div style="position:absolute;left:${M}px;top:${BY}px;width:${BW}px;height:${BH}px;background:linear-gradient(180deg,${mix(e.panel,"#000000",.2)},#050505);border-radius:16px;box-shadow:inset 0 0 0 3px ${mix(neon,"#000000",.5)},0 10px 26px rgba(0,0,0,.6);overflow:hidden">
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.04) 0 2px,rgba(0,0,0,0) 2px 4px)"></div>
    <div style="position:absolute;left:${Math.round((BW-PA.w)/2)}px;top:28px;width:${PA.w}px;height:${PA.h}px;background:#000;box-shadow:0 0 0 6px #000,0 0 18px ${mix(neon,"#000000",.4)};overflow:hidden">${hero(F,PA.w,PA.h,t.photo)}</div>
    <div style="position:absolute;left:0;right:0;bottom:22px;text-align:center;font:400 ${pix?14:20}px/1.2 ${MF};color:${neon2};letter-spacing:.12em;${glow(neon2,6)}">${esc(AL("insert")||"INSERT TOKEN")}</div>
    ${bzQuote?`<div style="position:absolute;left:20px;right:20px;bottom:84px;text-align:center;font:italic 400 ${bzQuote.fs}px/1.3 ${BF};color:#e6e6e6">"${esc(bzQuote.text)}" <span style="font-style:normal;color:${neon2}">${esc(bzQuote.by)}</span></div>`:""}
    <div style="position:absolute;left:50%;bottom:58px;margin-left:-26px;width:52px;height:14px;border-radius:7px;background:#000;box-shadow:inset 0 0 0 2px ${mix(neon2,"#000000",.4)}"></div></div>`;

  /* prize counter board */
  const RX=M+BW+22,RW=W-M-RX,FH=212,RH=H-M-BY-FH-18,cueH=F.cue?44:0;
  const C=sections(ctx,F,(A.sections&&A.sections.length===4?A.sections.map(clean):["Quick Plays","Main Games","Bonus Round","Refills"])),items=itemsOf(ctx);
  const BWd=RW-48,BHd=RH-56-cueH-22;
  /* heading as drawn (the pixel font runs at .62 of the tier size) plus the 12px every course keeps under it, so the spread gaps never push the last line off the board */
  const fitNow=()=>fit({C,items,tx:F.tx,W:BWd,H:BHd,maxCols:2,gap:28,cw:e.cw,cwd:e.cwd,priceW:d=>d*3.6+10,headH:tr=>(pix?Math.round(tr.h*.62):tr.h)*1.3+13+12});
  /* notes always print: when the board only fits with notes off, card extras (dishes off the printed menu, not cooked tonight) come off
     one at a time, last course and last dish first, never a course's only dish, until the notes fit. The card then matches the Prep sheet */
  /* arcade.extras: false keeps every card extra off, so the board and the Prep sheet list the same dishes */
  if(A.extras===false)for(const k in items){const L=items[k].filter(x=>!(x&&x.extra&&!x.house));if(L.length)items[k]=L}
  let R=fitNow();
  /* the course with the most dishes gives one up first (ties: last course first), so no course is left thin while another keeps four */
  while(!R.tr.nl){let hit=null;for(const k of ["d","w","m","s"].sort((a,b)=>(items[b]||[]).length-(items[a]||[]).length)){const L=items[k]||[];if(L.length<2)continue;for(let i=L.length-1;i>=0;i--)if(L[i]&&L[i].extra&&!L[i].house){hit=[k,i];break}if(hit)break}
    if(!hit)break;items[hit[0]]=items[hit[0]].filter((x,i)=>i!==hit[1]);R=fitNow()}
  const pr0=prices(items,F.ei,F.egg);
  /* tickets, not money: a main runs a few hundred, a snack less, and the hidden number stays in the last digits */
  const pr={};for(const k in pr0)pr[k]=pr0[k].map(v=>{let x=parseFloat(String(v).replace(/^\./,"0."))/BASE[F.ei];return Math.max(20,Math.round(x*220/10)*10)});
  /* house standards price at the foot of their course, no two items in a course share a price, and dessert stays under the mains */
  if(pr.m&&pr.m.length&&pr.w&&pr.w.length){const mm=Math.min(...pr.m),mw=Math.max(...pr.w);if(mw>=mm){const f=(mm-20)/mw;pr.w=pr.w.map(v=>Math.max(20,Math.round(v*f/10)*10))}}
  for(const k in pr){const it=items[k]||[],L=pr[k];const own=L.filter((v,i)=>!(it[i]&&it[i].house));const lo=own.length?Math.min(...own):0;
    if(lo)L.forEach((v,i)=>{if(it[i]&&it[i].house&&v>=lo)L[i]=Math.max(20,lo-10)});
    const used=new Set();L.forEach((v,i)=>{if(it[i]&&it[i].house)return;while(used.has(v))v+=10;used.add(v);L[i]=v});
    L.forEach((v,i)=>{if(!(it[i]&&it[i].house))return;while(used.has(v)&&v>20)v-=10;while(used.has(v))v+=10;used.add(v);L[i]=v})}
  /* rule 8: within a course the dearest dish prints first and house lines sit at the foot. The dishes move with their prices
     (not the prices up the list), so a card extra priced under tonight's cooked main keeps its own price */
  for(const k in pr){const it=items[k]||[],L=pr[k];if(!it.length)continue;
    const ord=it.map((x,i)=>i).sort((a,b)=>(it[a]&&it[a].house?1:0)-(it[b]&&it[b].house?1:0)||L[b]-L[a]||a-b);
    items[k]=ord.map(i=>it[i]);pr[k]=ord.map(i=>L[i])}
  for(const k in pr)pr[k]=pr[k].map(String);
  const head=(l,tr)=>`<div style="font:${pix?"400":"700"} ${pix?Math.round(tr.h*.62):tr.h}px/1.3 ${pix?MF:BF};color:${neon2};${pix?"":"text-transform:uppercase;letter-spacing:.08em;"}margin-bottom:8px;border-bottom:2px solid ${mix(neon2,e.panel,.55)};padding-bottom:3px">${esc(l)}</div>`;
  /* review 27: arcade.unit renames the ticket price tag for a venue that doesn't run on tickets (a fruit machine shop plays for credits) */
  const o={head,tx:F.tx,nf:BF,bf:BF,ink:e.ink,soft:e.soft,pc:neon,cw:e.cw,leader:1,lead:mix(e.soft,e.panel,.5),pp:0,price:v=>`${v}<span style="font-size:.55em;letter-spacing:.06em;margin-left:4px">${esc(AL("unit")||"TIX")}</span>`,cgap:12+Math.min(30,R.spare/Math.max(1,C.length))};
  /* arcade.panel {head, text, by}: a quote card at the foot of the shorter column, so a long first course leaves no bare gap */
  const colH=R.cols.map(col=>col.reduce((x,[k])=>x+(items[k]||[]).slice(0,4).length*2+1,0));
  const shortCol=R.cols.length<2?-1:A.panel?colH.indexOf(Math.min(...colH)):R.hs.indexOf(Math.min(...R.hs));
  /* the shorter column's own spare height, after the even course gaps every column gets */
  const gx=Math.min(30,R.spare/Math.max(1,C.length)),scSpare=shortCol<0?0:Math.max(0,BHd-R.hs[shortCol]*1.02-R.cols[shortCol].length*gx);
  /* arcade.panel.img: a real film still (TMDB path) in the card instead of a quote, head as its label, text as the caption under it */
  const panImg=A.panel&&A.panel.img?`<div style="margin-top:auto;border:2px solid ${mix(neon,e.panel,.45)};border-radius:10px;overflow:hidden;background:#000;position:relative"><div style="position:relative;height:${A.panel.h||150}px;overflow:hidden">${photo(ctx.img(A.panel.img,"w780"),t.photo,A.panel.pos||"center 40%")}</div><div style="position:absolute;left:8px;top:8px;padding:3px 8px;background:rgba(0,0,0,.72);font:400 ${pix?11:15}px/1.2 ${MF};color:${neon2};letter-spacing:.08em">${esc(clean(A.panel.head||""))}</div>${A.panel.text?`<div style="padding:6px 12px 8px;font:italic 400 15px/1.3 ${BF};color:#cfd3d8">${esc(clean(A.panel.text))}</div>`:""}</div>`:"";
  /* quote card: a long line sets in the body face at the biggest size that fits the column's spare height (19 down to 15px), with tighter padding */
  const qCard=(hd,tx2,by,av)=>{const lng=tx2.length>60;let fs=19;if(lng)for(fs=19;fs>15;fs--){if(60+wrapLines(`"${tx2}"`,fs,R.CW-32,.4)*fs*1.3<=av)break}
    return `<div style="margin-top:auto;border:2px solid ${mix(neon,e.panel,.45)};border-radius:10px;padding:${lng?"8px 12px 9px":"10px 14px 11px"};background:${mix(neon,e.panel,.9)}"><div style="font:700 ${lng?12:13}px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${e.soft}">${esc(hd)}</div><div style="font:${lng?`italic 500 ${fs}px/1.3 ${BF}`:`400 ${pix?16:24}px/1.25 ${pix?MF:DF}`};color:#fff;margin-top:${lng?4:6}px;${glow(neon,lng?3:6)}">"${esc(tx2)}"</div><div style="font:italic 400 ${lng?14:15}px/1.3 ${BF};color:${neon2};margin-top:${lng?2:4}px">${esc(by)}</div></div>`};
  /* no arcade.panel: a gap of more than about 100px left in the shorter column takes a real film still (TMDB) labelled with the title, else the film's quote card */
  /* the still starts at the estimated spare height (90px at least) and grows into whatever the column really has left (the line
     estimate runs a little long, so the real gap is often bigger), up to 240px, so the foot of the column is never left bare */
  const dStill=(ctx.stills||[]).filter(Boolean)[F.posSrc?0:1],dH=Math.max(90,Math.min(200,Math.round(scSpare-24)));
  const panDef=A.panel||scSpare<=100?"":dStill?`<div style="margin-top:auto;border:2px solid ${mix(neon,e.panel,.45)};border-radius:10px;overflow:hidden;background:#000;position:relative;flex:1 0 ${dH}px;max-height:240px">${photo(ctx.img(dStill,"w780"),t.photo,"center 40%")}<div style="position:absolute;left:8px;top:8px;padding:3px 8px;background:rgba(0,0,0,.72);font:400 ${pix?11:15}px/1.2 ${MF};color:${neon2};letter-spacing:.08em">Now playing</div></div>`
    :!bzFs&&scSpare>150?qCard("Overheard",F.note.text,F.note.by,scSpare):"";
  /* what is still bare in the shorter column (no card) spreads over its own item and course gaps, capped so it never looks stretched */
  const scN=shortCol<0?0:R.cols[shortCol].reduce((x,[k])=>x+(items[k]||[]).slice(0,4).length,0),scAdd=A.panel||panDef||scN<2?0:Math.min(16,Math.floor(scSpare/(scN-1)));
  const Rs=scAdd?Object.assign({},R,{tr:Object.assign({},R.tr,{g:R.tr.g+scAdd})}):R;
  const pan=panImg||(A.panel&&A.panel.text?qCard(clean(A.panel.head||""),clean(A.panel.text),clean(A.panel.by||""),scSpare):"");
  const board=`<div style="position:absolute;left:${RX}px;top:${BY}px;width:${RW}px;height:${RH}px;background:${e.panel};box-sizing:border-box;border:3px solid ${mix(neon2,e.panel,.5)};box-shadow:0 10px 24px rgba(0,0,0,.5)">
    <div style="position:absolute;left:24px;right:24px;top:14px;height:32px;display:flex;justify-content:space-between;align-items:center"><div style="font:400 ${pix?16:22}px/1 ${pix?MF:DF};color:#fff;${glow(neon,8)}">${esc(AL("counter")||"PRIZE COUNTER")}</div><div style="font:700 15px/1 ${BF};letter-spacing:.18em;color:${e.soft}">${esc(AL("redeem")||"REDEEM TICKETS HERE")}</div></div>
    <div style="position:absolute;left:24px;top:56px;width:${BWd}px;height:${BHd}px;display:flex;gap:28px;overflow:hidden">${R.cols.map((col,ci)=>`<div style="flex:0 0 ${R.CW}px;display:flex;flex-direction:column">${col.map(s=>course(s,items,pr,ci===shortCol?Rs:R,o)).join("")}${ci===shortCol?(pan||panDef):""}</div>`).join("")}</div>
    ${F.cue?`<div style="position:absolute;left:24px;right:24px;bottom:12px;height:${cueH-8}px;border-top:1px solid ${mix(e.soft,e.panel,.6)};padding-top:6px">${cueLine(F,BF,e.soft,neon2,15)}</div>`:""}</div>`;

  /* foot: tokens, high scores, top shelf */
  const FY=H-M-FH,TW=230,HW=300,SW=RW-TW-HW-36;
  /* the film's prop (rule 5): a printed slip from the change machine under its kind label (BET SLIP, TICKET), title and lines in the mono face;
     a row of small tokens sits under it when there is room */
  const KIND={ticket:"TICKET",stub:"TICKET STUB",card:"CARD",receipt:"RECEIPT",slip:"SLIP",badge:"BADGE",tag:"TAG",token:"TOKEN",coupon:"COUPON",voucher:"VOUCHER"};
  const pk=F.prop&&F.fl.prop?String(F.fl.prop.kind||"").toLowerCase():"",pkL=KIND[pk]||(pk?pk.toUpperCase():"");
  /* a title that already names the object (Bet Slip, Medal Receipt, Pizza Planet Token) is the label itself */
  const pTitleIs=F.prop&&new RegExp("\\b("+[pk,...Object.keys(KIND)].filter(Boolean).join("|")+")s?\\b","i").test(F.prop.title);
  const pLab=F.prop?(pTitleIs?F.prop.title.toUpperCase():pkL||"PRIZE SLIP"):"",pTitle=F.prop&&!pTitleIs?F.prop.title:"",pLines=F.prop?F.prop.lines.slice(0,3):[];
  const SM="'Share Tech Mono',monospace",slW=TW-24-24,slH=F.prop?20+(pTitle?wrapLines(pTitle,17,slW,.5)*20+4:0)+pLines.reduce((a,l)=>a+wrapLines(l,16,slW,.5)*19+3,0):0;
  const coinRow=F.prop&&15+10+slH+10+50<=FH-24;
  const coin=sz=>`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f7e7a6,#c9a43b 60%,#8a6c1c);box-shadow:inset 0 0 0 3px rgba(0,0,0,.18),0 2px 4px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center">${A.space?planet(Math.round(sz*.62),"#8a6c1c","#4a3608"):`<div style="font:700 9px/1 ${BF};letter-spacing:.12em;color:#4a3608">TOKEN</div>`}</div>`;
  const tokProp=F.prop?`<div style="position:absolute;left:${RX}px;top:${FY}px;width:${TW}px;height:${FH}px;background:${e.panel};box-sizing:border-box;border:3px solid ${mix(neon,e.panel,.5)};padding:12px;overflow:hidden;display:flex;flex-direction:column">
    <div style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${e.soft};text-align:center">${esc(pLab)}</div>
    <div style="margin-top:10px;background:#f4ecd6;color:#2a2219;border:2px dashed #b9a77c;border-radius:4px;padding:8px 10px;box-shadow:0 3px 8px rgba(0,0,0,.45);transform:rotate(${(t.tilt*.4).toFixed(2)}deg)">
      ${pTitle?`<div style="font:700 17px/1.15 ${BF};text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">${esc(pTitle)}</div>`:""}
      ${pLines.map(l=>`<div style="font:400 16px/1.2 ${SM};margin-top:3px">${esc(l)}</div>`).join("")}</div>
    ${coinRow?`<div style="margin-top:auto;display:flex;gap:10px;justify-content:center">${[1,2,3].map(()=>coin(50)).join("")}</div>`:""}</div>`:"";
  const tok=tokProp||`<div style="position:absolute;left:${RX}px;top:${FY}px;width:${TW}px;height:${FH}px;background:${e.panel};box-sizing:border-box;border:3px solid ${mix(neon,e.panel,.5)};padding:12px;overflow:hidden">
    <div style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${e.soft};text-align:center">${esc(AL("tokens")||"TOKENS")}</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:12px">${[1,2,3,4].map(i=>`<div style="width:78px;height:78px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f7e7a6,#c9a43b 60%,#8a6c1c);box-shadow:inset 0 0 0 4px rgba(0,0,0,.18),0 3px 6px rgba(0,0,0,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4a3608">${A.space?planet(36,"#8a6c1c","#4a3608"):`<div style="font:700 26px/1 ${BF}">${i}</div>`}<div style="font:700 11px/1.3 ${BF};letter-spacing:.14em">TOKEN</div></div>`).join("")}</div></div>`;
  /* the top initials: three or more words give their initials (TCM), else the first three letters of the last word (Turkish TUR, Wreck-It Ralph RAL);
     arcade.scores ["BRK","TOM","YOU"] lets a film name its own three players */
  const n=F.note,wds=n.by.replace(/[^A-Za-z ]/g,"").split(/\s+/).filter(Boolean),ini=(wds.length>=3?wds.map(w=>w[0]).join(""):((wds[wds.length-1]||"")+"AAA")).slice(0,3).toUpperCase(),base=(+F.num||7)*1000+F.year.length*111;
  const own=(A.scores||[]).map(s=>clean(s).replace(/[^A-Za-z0-9]/g,"").slice(0,3).toUpperCase()).filter(Boolean);
  const scores=[[own[0]||ini,base+87650],[own[1]||"CPU",base+51200],[own[2]||"YOU",base+990]];
  const hs=`<div style="position:absolute;left:${RX+TW+18}px;top:${FY}px;width:${HW}px;height:${FH}px;background:#000;box-sizing:border-box;border:3px solid ${mix(neon2,"#000000",.4)};padding:12px 14px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between">
    <div style="font:400 ${pix?14:20}px/1 ${MF};color:${neon2};text-align:center;letter-spacing:.1em;${glow(neon2,6)}">HIGH SCORES</div>
    ${scores.map((s,i)=>`<div style="display:flex;justify-content:space-between;font:400 ${pix?14:20}px/1.2 ${MF};color:${i?"#e6e6e6":neon}"><span>${i+1}. ${esc(s[0])}</span><span>${String(s[1]).padStart(7,"0")}</span></div>`).join("")}
    ${bzFs?"":`<div style="font:italic 400 15px/1.3 ${BF};color:#cfd3d8;border-top:1px solid #333;padding-top:6px;${clamp(3)}">"${esc(n.text)}" <span style="font-style:normal;color:${neon2}">${esc(n.by)}</span></div>`}</div>`;
  const still=stl?`<div style="position:absolute;left:${RX+TW+18}px;top:${FY}px;width:${HW}px;height:${FH}px;background:#000;box-sizing:border-box;border:3px solid ${mix(neon2,"#000000",.4)};overflow:hidden">
    <div style="position:absolute;left:0;right:0;top:0;height:138px;overflow:hidden">${photo(stl,t.photo,"center 40%")}</div>
    <div style="position:absolute;left:8px;top:8px;padding:3px 8px;background:rgba(0,0,0,.72);font:400 ${pix?11:15}px/1.2 ${MF};color:${neon2};letter-spacing:.08em">${esc(clean(A.still.title||"NOW PLAYING"))}</div>
    <div style="position:absolute;left:12px;right:12px;bottom:8px;font:italic 400 15px/1.3 ${BF};color:#cfd3d8;${clamp(2)}">"${esc(n.text)}" <span style="font-style:normal;color:${neon2}">${esc(n.by)}</span></div></div>`:"";
  /* the shelf: arcade.prizes (real objects you could win) priced in tickets; a film that names its own shelf (arcade.shelf) and has no prize list
     keeps its winks as the prizes, written as such; otherwise the shelf lists the film's winks (up to five) under a scene label, no prices.
     The credit sits in the flow at the foot, so nothing runs into it */
  const prizeList=(A.prizes||[]).map(clean).filter(Boolean).slice(0,3),winkMode=!prizeList.length&&!A.shelf&&F.winks.length>0;
  const shW=SW-28-6;let wk=[],wFs=15;
  if(winkMode){const room=FH-24-6-15-18-20;for(const fs of [15,14,13]){let h=0,n=0;for(const w of F.winks.slice(0,5)){const add=wrapLines(w,fs,shW-14,.47)*fs*1.25+5;if(h+add>room)break;h+=add;n++}if(n>wk.length||n===Math.min(5,F.winks.length)){wk=F.winks.slice(0,n);wFs=fs}if(n===Math.min(5,F.winks.length))break}}
  const prizes=prizeList.length?prizeList:F.winks.slice(0,3);
  const shelfRows=winkMode?wk.map(w=>`<div style="display:flex;gap:7px;align-items:baseline;margin-top:5px;font:500 ${wFs}px/1.25 ${BF};color:${e.ink}"><span style="flex:0 0 auto;color:${neon};font-size:.8em">&#9656;</span><span>${esc(w)}</span></div>`).join("")
    :(prizes.length?prizes:["Mystery prize"]).map((w,i)=>`<div style="display:flex;gap:8px;justify-content:space-between;align-items:baseline;margin-top:8px;font:500 15px/1.25 ${BF};color:${e.ink}"><span>${esc(w)}</span><b style="flex:0 0 auto;color:${neon}">${(5+i*5)*1000}</b></div>`).join("");
  const shelf=`<div style="position:absolute;left:${RX+TW+HW+36}px;top:${FY}px;width:${SW}px;height:${FH}px;background:${e.panel};box-sizing:border-box;border:3px solid ${mix(neon,e.panel,.5)};padding:12px 14px 8px;overflow:hidden;display:flex;flex-direction:column">
    <div style="font:700 15px/1 ${BF};letter-spacing:.2em;color:${e.soft}">${esc(winkMode?"WATCH FOR":AL("shelf")||"TOP SHELF")}</div>
    ${shelfRows}
    <div style="margin-top:auto;padding-top:6px;font:400 14px/1.2 ${BF};color:${e.soft}">${esc(winkMode?credit(F).replace("Prices subject to change. ",""):credit(F).replace("Prices subject to change.","Prizes subject to change."))}</div></div>`;
  const vig=`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 62%,rgba(0,0,0,${(t.vig*.7).toFixed(2)}) 100%)"></div>`;
  return {w:W,h:H,faces:[`<div style="position:absolute;inset:0;overflow:hidden">${bg}${marquee}${bezel}${board}${tok}${still||hs}${shelf}${vig}</div>`]};
};
})();
