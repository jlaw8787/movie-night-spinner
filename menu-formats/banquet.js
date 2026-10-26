/* Format: banquet. A palace or castle banquet bill of fare, two faces 816x1056.
   Front: gilt border, arched crest panel cut from the film's still, logo on its own panel, host's note, order of toasts.
   Back: the courses in procession, a framed second still, a place card (type only).
   Era sets type pairing, print process and border. Tone sets stock, wear and photo treatment. */
(function(){
const ID="banquet",W=816,H=1056;
/* ---------- shared helpers ---------- */
const IMG="https://image.tmdb.org/t/p/";
const clean=s=>String(s==null?"":s).replace(/\s*[–—]\s*/g,", ").replace(/\s+-\s+/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sent=s=>{s=clean(s).trim();if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};
const DRY=[[/\bred wine\b|\bwhite wine\b|\bmulled wine\b|\bwine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b|\bbubbly\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bale\b/gi,"cider punch"],[/\bcocktails?\b/gi,"mocktail"],[/\bpunch\b(?! bowl)/gi,"fruit punch"],[/\b(rum|vodka|gin|whisky|whiskey|bourbon|tequila|brandy|sherry|liqueur|mead|sake|schnapps|cognac)\b/gi,"syrup"]];
const dry=s=>DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s));
const hex=h=>{h=String(h||"").replace("#","");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const readable=(fg,bg,r)=>{let a=hex(fg),b=hex(bg);const to=lum(b)>.35?[0,0,0]:[255,255,255];for(let k=0;k<16&&contrast(a,b)<r;k++)a=mix(a,to,.12);return toHex(a)};
const eraGroup=e=>/19[345]0/.test(e)?"old":/19[67]0/.test(e)?"mid":/19[89]0/.test(e)?"late":"new";
const NOISE="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .4  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .5 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>");
const BLOTCH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.005' numOctaves='4' seed='3'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .25  0 0 0 .38 0'/></filter><rect width='900' height='900' filter='url(#b)'/></svg>");
function loadFonts(key,fams){const id="fmt-font-"+key;if(document.getElementById(id))return;const l=document.createElement("link");l.id=id;l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+fams.map(f=>"family="+f).join("&")+"&display=block";document.head.appendChild(l)}
/* shrink-to-fit: any [data-fit] box scales its own font-size (children use em) until nothing overflows; data-min is the floor */
if(!window.__fmtFit){
  window.__fmtFit=()=>document.querySelectorAll("[data-fit]").forEach(el=>{
    if(!el.dataset.base)el.dataset.base=parseFloat(el.style.fontSize)||16;
    let fs=+el.dataset.base;const min=+el.dataset.min||14;el.style.fontSize=fs+"px";
    const over=()=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;
    for(let n=0;n<60&&over()&&fs>min;n++){fs=Math.max(min,fs*.97);el.style.fontSize=fs+"px"}});
  const run=()=>{try{window.__fmtFit()}catch(e){}};
  window.__fmtFitLater=()=>{[0,300,1200,2000].forEach(t=>setTimeout(run,t));if(document.fonts){document.fonts.ready.then(run);document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",run)}};
}
/* logo panel: sample the logo's own colours and put it on whichever stock reads */
if(!window.__fmtLogo){
  window.__fmtLogo=im=>{try{const p=im.closest("[data-lpanel]");if(!p)return;const c=document.createElement("canvas"),w=80,h=Math.max(8,Math.round(80*im.naturalHeight/im.naturalWidth));c.width=w;c.height=h;
    const g=c.getContext("2d");g.drawImage(im,0,0,w,h);const d=g.getImageData(0,0,w,h).data;let s=0,n=0;
    for(let i=0;i<d.length;i+=4)if(d[i+3]>140){s+=lum([d[i],d[i+1],d[i+2]]);n++}
    if(!n)return;const L=s/n;p.style.background=L>.28?p.dataset.dark:p.dataset.light;p.style.color=L>.28?p.dataset.darkink:p.dataset.lightink}catch(e){}};
  window.__fmtLogoFail=im=>{im.style.display="none";const t=im.nextElementSibling;if(t)t.style.display="block";try{window.__fmtFit()}catch(e){}};
}
const rootPath=ctx=>ctx.root!=null?ctx.root:(/\/wip\//.test(location.pathname)?"../../../":"");
const isFamily=f=>/^(kids|fairytale|xmas)$/.test(f.theme||"")||/^(G|PG)$/.test(((window.RATINGS||{})[f.id])||"");
/* ---------- banquet ---------- */
const ERA={
  old:{disp:"'IM Fell DW Pica SC',serif",body:"'IM Fell DW Pica',serif",fonts:["IM+Fell+DW+Pica+SC","IM+Fell+DW+Pica:ital@0;1"],dw:400,upper:false,track:".04em",
       print:"letterpress",border:"rule",photo:"sepia(.18) contrast(1.06)",bodyW:400},
  mid:{disp:"'Instrument Serif',serif",body:"'Lora',serif",fonts:["Instrument+Serif:ital@0;1","Lora:ital,wght@0,400;0,600;1,400"],dw:400,upper:false,track:"0",
       print:"offset",border:"band",photo:"saturate(1.12) contrast(1.04)",bodyW:400},
  late:{disp:"'Libre Bodoni',serif",body:"'Libre Baskerville',serif",fonts:["Libre+Bodoni:ital,wght@0,700;1,700","Libre+Baskerville:ital,wght@0,400;0,700;1,400"],dw:700,upper:false,track:"0",
       print:"gloss",border:"foil",photo:"saturate(1.12) contrast(1.06)",bodyW:400},
  new:{disp:"'Castoro Titling',serif",body:"'EB Garamond',serif",fonts:["Castoro+Titling","EB+Garamond:ital,wght@0,500;0,600;1,500"],dw:400,upper:true,track:".08em",
       print:"laser",border:"hair",photo:"saturate(1.06) contrast(1.04)",bodyW:500}
};
/* stock: dark or light card per tone, wear level and photo mood */
const TONE={
  grand:{dark:true,paper:d=>mix(mix(d,[24,14,6],.45),[0,0,0],.25),ink:[244,231,198],wear:.25,photo:"",kick:"By command of the house",toast:"Order of toasts"},
  eerie:{dark:true,paper:d=>mix(mix(d,[20,20,24],.7),[0,0,0],.2),ink:[214,208,194],wear:.55,photo:" saturate(.7) brightness(.95)",kick:"The doors are barred at midnight",toast:"Whispered at table"},
  tense:{dark:false,paper:()=>[238,235,228],ink:[22,20,20],wear:.3,photo:" contrast(1.12) saturate(.9)",kick:"Guests will be seated in order of rank",toast:"Before the table"},
  warm:{dark:false,paper:()=>[244,232,206],ink:[58,36,20],wear:.35,photo:" sepia(.08)",kick:"You are most welcome at our table",toast:"Order of toasts"},
  tender:{dark:false,paper:()=>[246,236,230],ink:[74,48,54],wear:.2,photo:" brightness(1.04) saturate(.95)",kick:"A table laid with care",toast:"Remembered tonight"},
  playful:{dark:false,paper:(d,a)=>mix(a,[255,255,255],.86),ink:null,wear:.1,photo:" saturate(1.15) brightness(1.03)",kick:"Come one, come all, to the feast",toast:"Toasts and tomfoolery"},
  glossy:{dark:false,paper:()=>[251,250,246],ink:[18,18,20],wear:0,photo:" saturate(1.1)",kick:"The honour of your company",toast:"Order of toasts"},
  gritty:{dark:false,paper:()=>[226,212,180],ink:[43,33,24],wear:.85,photo:" contrast(1.12) saturate(.85)",kick:"Eat while the fires still burn",toast:"Talk of the hall"},
  scrappy:{dark:false,paper:()=>[236,230,214],ink:[34,34,34],wear:.7,photo:" contrast(1.2) saturate(.8)",kick:"All hands to the long table",toast:"Talk of the hall"}
};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},E=ERA[eraGroup(ctx.era||"modern")],T=TONE[ctx.tone]||TONE.grand,root=rootPath(ctx);
  loadFonts(ID+"-"+eraGroup(ctx.era||"modern"),E.fonts.concat(["Pinyon+Script"]));
  const fam=isFamily(f),fl=ctx.flavour||null,menu=ctx.menu||{};
  const D=dry;const txt=s=>fam?D(s):clean(s);
  /* colours: film dark and accent, checked against the stock */
  const pd=hex(ctx.palette&&ctx.palette.dark)||[40,24,16],pa0=hex(ctx.palette&&ctx.palette.accent);
  const pa=pa0&&Math.max(...pa0)-Math.min(...pa0)>=35?pa0:[150,40,40];
  const paper=T.paper(pd,pa),ink=T.ink||(lum(pd)<.08?pd:mix(pd,[0,0,0],.6));
  const P=toHex(paper),INK=toHex(ink);
  const GOLD=T.dark?"#c9a55a":(lum(paper)>.8?"#a8832f":"#94712a");
  const ACC=readable(toHex(pa),P,T.dark?3.2:3.6);
  const SOFT=toHex(mix(ink,paper,.28));
  const BAND=T.dark?toHex(mix(pa,[0,0,0],.35)):toHex(lum(pd)<.2?pd:mix(pd,[0,0,0],.5));
  const BANDINK=readable("#f3e7c8",BAND,5);
  const yy=String(f.year||"").slice(-2),num=String(fl&&fl.number||"").replace(/\D/g,"").slice(0,4);
  const venue=clean(fl&&fl.venue||"The Great Hall");
  const sign=clean(fl&&fl.sign||"A feast in honour of tonight's picture");
  const note=fl&&fl.note&&fl.note.text?{t:txt(fl.note.text),by:clean(fl.note.by||"The Steward")}:{t:"Be seated and be welcome. The hall is lit, the table is long, and nobody leaves hungry tonight.",by:"The Steward"};
  const winks=(fl&&fl.winks||[]).map(txt).filter(Boolean);
  const toasts=(winks.length?winks.slice(0,3):[clean(f.T||"To tonight's picture"),"To the cooks below stairs","To absent friends"]).map(sent);
  const prop=fl&&fl.prop&&fl.prop.title?{title:clean(fl.prop.title),lines:(fl.prop.lines||[]).map(clean).slice(0,2)}:{title:"Guest of Honour",lines:["Seat at the long table","Kept by the house"]};
  const stills=(ctx.stills||[]).filter(Boolean);
  if(!ctx.poster&&typeof TMDB_POSTERS!=="undefined")ctx.poster=TMDB_POSTERS[f.id]||null;
  const posterSrc=ctx.poster?IMG+"w780"+ctx.poster:"";
  const heroIsPoster=!!posterSrc;
  const hero=posterSrc||(stills[0]?IMG+"w1280"+stills[0]:"");
  const second=stills[1]?IMG+"w1280"+stills[1]:(stills[0]?IMG+"w1280"+stills[0]:posterSrc);
  const secIsPoster=!stills.length&&!!posterSrc;
  const heroPos="50% 38%",secPos=stills[1]?"50% 45%":"50% 30%";

  /* paper and print process */
  const grain=`${root}assets/era/_shared/paper-grain.webp`;
  const wear=T.wear;
  const laid=E.print==="letterpress"?`repeating-linear-gradient(0deg,rgba(0,0,0,.035) 0 1px,transparent 1px 5px),`:"";
  const sheen=E.print==="gloss"&&!T.dark?`<div style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.35) 46%,rgba(255,255,255,0) 60%);pointer-events:none"></div>`:"";
  const stock=()=>`<div style="position:absolute;inset:0;background:${laid}${P}"></div>
    <div style="position:absolute;inset:0;background:url('${grain}') 0 0/520px,url(&quot;${NOISE}&quot;) 0 0/300px;opacity:${T.dark?.1:.12+wear*.12};pointer-events:none"></div>
    ${wear>.3?`<div style="position:absolute;inset:0;background:url(&quot;${BLOTCH}&quot;) 0 0/900px;opacity:${wear*.3};pointer-events:none"></div>`:""}
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(${T.dark?"0,0,0":"90,60,20"},0) 55%,rgba(${T.dark?"0,0,0":"90,60,20"},${(.18+wear*.3).toFixed(2)}) 100%);pointer-events:none"></div>${sheen}`;
  /* the border changes with the era: ruled letterpress, coloured band, gold foil, hairline */
  const foil=`linear-gradient(135deg,#7a5a1e,#e9cf86 22%,#a47b2e 40%,#f4e2a6 58%,#8c6a26 78%,#d9b66a)`;
  const border=()=>{
    if(E.border==="rule")return`<div style="position:absolute;inset:20px;border:3px double ${INK};opacity:.85"></div><div style="position:absolute;inset:30px;border:1px solid ${INK};opacity:.55"></div>`;
    if(E.border==="band")return`<div style="position:absolute;inset:16px;border:12px solid ${BAND}"></div><div style="position:absolute;inset:32px;border:2px solid ${GOLD}"></div>`;
    if(E.border==="foil")return`<div style="position:absolute;inset:16px;padding:8px;background:${foil};-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)"></div><div style="position:absolute;inset:30px;border:1px solid ${GOLD}"></div>`;
    return`<div style="position:absolute;inset:22px;border:1px solid ${GOLD}"></div><div style="position:absolute;inset:28px;border:1px solid ${GOLD};opacity:.6"></div>`;
  };
  const press=E.print==="letterpress"?`text-shadow:0 0 .7px ${INK};`:E.print==="gloss"&&!T.dark?`text-shadow:0 1px 0 rgba(255,255,255,.7),0 -1px 0 rgba(0,0,0,.12);`:"";
  const half=E.print==="offset"?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.18) 30%,transparent 32%) 0 0/5px 5px;mix-blend-mode:multiply;opacity:.35"></div>`:"";
  const frame=E.border==="foil"?foil:E.border==="band"?BAND:E.border==="rule"?INK:GOLD;
  const photo=(src,pos)=>!src?`<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,${toHex(mix(pd,[255,255,255],.18))},${toHex(mix(pd,[0,0,0],.4))});display:flex;align-items:center;justify-content:center;padding:40px;box-sizing:border-box"><div style="font:italic ${E.dw} 40px/1.15 ${E.disp};color:#f3e7c8;text-align:center">${esc(sign)}</div></div>`:`<img alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:${E.photo}${T.photo}">${half}<div style="position:absolute;inset:0;box-shadow:inset 0 0 50px rgba(0,0,0,.28)"></div>`;
  /* the whole poster, never cropped: mounted on a panel of the house's own dark stock with a gilt keyline */
  const stage=src=>`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,${toHex(mix(pd,[0,0,0],.3))},${toHex(mix(pd,[0,0,0],.72))});display:flex;align-items:center;justify-content:center"><img crossorigin="anonymous" alt="" src="${src}" style="display:block;height:calc(100% - 24px);width:auto;max-width:90%;object-fit:contain;border:3px solid ${GOLD};box-shadow:0 8px 22px rgba(0,0,0,.55)"></div>`;
  const kick=(s,c)=>`<div style="font:600 18px/1.2 ${E.body};letter-spacing:.3em;text-transform:uppercase;color:${c||ACC};text-align:center">${esc(s)}</div>`;
  const dispCase=E.upper?"uppercase":"none";

  /* logo in its own colours on a panel that suits it, set type if missing */
  const lg=ctx.logo,lr=lg&&lg[0]&&lg[1]&&lg[2]?lg[1]/lg[2]:0;
  const lh=lr?Math.min(110,Math.round(196/lr)):0,lw=lr?Math.round(lh*lr):0;
  const tlen=clean(f.title).length,tsz=tlen<=10?42:tlen<=20?34:tlen<=32?28:24;
  const darkPanel=toHex(mix(pd,[0,0,0],.55)),lightPanel=T.dark?"#f4ecd8":toHex(mix(paper,[255,255,255],.6));
  const titleType=c=>`<div style="font:${E.dw} ${tsz}px/1.05 ${E.disp};text-transform:${dispCase};letter-spacing:${E.track};color:${c};text-align:center;max-width:196px;overflow-wrap:anywhere">${esc(f.title)}</div>`;
  const logoPanel=`<div data-lpanel data-dark="${darkPanel}" data-light="${lightPanel}" data-darkink="#f3e7c8" data-lightink="${INK}" style="flex:none;width:220px;box-sizing:border-box;padding:14px 12px;background:${darkPanel};color:#f3e7c8;border:3px solid ${GOLD};box-shadow:0 8px 22px rgba(0,0,0,.4);text-align:center">
     ${lr?`<img crossorigin="anonymous" alt="${esc(f.title)}" src="${IMG}w500${lg[0]}" onload="window.__fmtLogo&&__fmtLogo(this)" onerror="window.__fmtLogoFail&&__fmtLogoFail(this)" style="display:block;height:${lh}px;width:${lw}px;max-width:100%;object-fit:contain;margin:0 auto"><div style="display:none">${titleType("currentColor")}</div>`:titleType("currentColor")}
   </div>`;

  /* ---------- front ---------- */
  const PW=462,PH=693;
  const heroBox=heroIsPoster
    ?`<img crossorigin="anonymous" alt="" src="${hero}" style="display:block;width:100%;height:100%;object-fit:contain">`
    :`<div style="position:relative;width:100%;height:100%;overflow:hidden;background:#222">${photo(hero,heroPos)}</div>`;
  const front=`${stock()}${border()}
   <div style="position:absolute;left:60px;right:60px;top:46px">${kick(T.kick)}</div>
   <div data-fit data-min="30" style="position:absolute;left:60px;right:60px;top:74px;height:56px;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:46px">
     <div style="font:${E.dw} 1em/1.02 ${E.disp};text-transform:${dispCase};letter-spacing:${E.track};color:${INK};text-align:center;${press}">${esc(venue)}</div></div>
   <div style="position:absolute;left:50px;top:136px;width:${PW+12}px;height:${PH+12}px;padding:6px;box-sizing:border-box;background:${frame};box-shadow:0 10px 26px rgba(0,0,0,.3)">${heroBox}</div>
   <div style="position:absolute;left:546px;top:136px;width:220px;height:${PH+12}px;display:flex;flex-direction:column;gap:16px">
     ${logoPanel}
     <div data-fit data-min="16" style="flex:none;height:170px;overflow:hidden;font-size:20px;text-align:center;color:${SOFT}">
       <div style="font:italic 1em/1.3 ${E.body}">${esc(sign)}${f.T?`. ${esc(sent(f.T))}`:""}</div></div>
     <div data-fit data-min="15" style="flex:1 1 0;min-height:0;overflow:hidden;font-size:19px;color:${INK};border-top:1px solid ${GOLD};padding-top:10px">
       <div style="font:600 16px/1.2 ${E.body};letter-spacing:.2em;text-transform:uppercase;color:${ACC};margin-bottom:.4em">${esc(fam&&/toast/i.test(T.toast)?"Order of cheers":T.toast)}</div>
       ${toasts.map((t,i)=>`<div style="font:${E.bodyW} 1em/1.28 ${E.body};margin-bottom:.32em"><span style="color:${ACC};font-weight:700">${["I","II","III"][i]}.</span> ${esc(t)}</div>`).join("")}</div>
   </div>
   <div style="position:absolute;left:96px;right:96px;top:852px;height:1px;background:${GOLD};opacity:.8"></div>
   <div data-fit data-min="15" style="position:absolute;left:66px;right:66px;top:866px;height:130px;overflow:hidden;font-size:21px;color:${INK}">
     <div style="font:600 16px/1.2 ${E.body};letter-spacing:.24em;text-transform:uppercase;color:${ACC};margin-bottom:.4em">From the host</div>
     <div style="font:italic ${E.bodyW} 1em/1.34 ${E.body}">${esc(sent(note.t))}</div>
     <div style="font:400 1.6em/1.1 'Pinyon Script',cursive;color:${ACC};text-align:right;margin-top:.1em">${esc(note.by)}</div></div>
   <div style="position:absolute;left:60px;right:60px;top:1006px;font:500 16px/1 ${E.body};letter-spacing:.18em;text-transform:uppercase;color:${SOFT};text-align:center">${esc(f.year)} &nbsp;·&nbsp; Covers laid for ${esc(num||yy||"12")}</div>`;

  /* ---------- back: courses in procession ---------- */
  const LAB=fam?{s:"To Begin",m:"The Remove",w:"Entremets",d:"The Cordials"}:{s:"To Begin",m:"The Remove",w:"Entremets",d:"From the Cellar"};
  const keys=["s","m","w","d"].filter(k=>(menu[k]||[]).length);
  const nIt=keys.reduce((a,k)=>a+menu[k].length,0),heavy=nIt>8;
  const clamp=n=>`display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${n};overflow:hidden;`;
  const course=(k,ci)=>`<div style="margin:0 0 ${heavy?".3em":".5em"}">
      <div style="display:flex;align-items:center;justify-content:center;gap:.6em;margin-bottom:.3em">
        <span style="flex:none;width:${heavy?"1em":"2.2em"};height:1px;background:${GOLD}"></span>
        <span style="font:600 .7em/1.2 ${E.body};font-size:max(15px,.7em);letter-spacing:${heavy?".18em":".3em"};white-space:nowrap;text-transform:uppercase;color:${ACC}">${heavy?"":["First","Second","Third","Fourth"][ci]+" Course &nbsp;·&nbsp; "}${esc(LAB[k])}</span>
        <span style="flex:none;width:${heavy?"1em":"2.2em"};height:1px;background:${GOLD}"></span></div>
      ${(menu[k]||[]).map((it,ii)=>`<div style="margin:0 0 ${heavy?".22em":".36em"}">
        <div style="font:${E.dw} 1.04em/1.12 ${E.disp};text-transform:${dispCase};letter-spacing:${E.upper?".04em":"0"};color:${INK};${press}${heavy?clamp(2):""}">${esc(txt(it.n))}</div>
        ${it.note&&!(nIt>12&&ii>1)?`<div style="font:italic ${E.bodyW} .76em/1.3 ${E.body};font-size:max(15px,.76em);color:${SOFT};margin-top:.12em;${heavy?clamp(1):""}">${esc(sent(txt(it.note)))}</div>`:""}</div>`).join("")}
    </div>`;
  let courses;
  if(heavy){const half=[];let a=0,best=1,bd=1e9;for(let i=1;i<keys.length;i++){a+=menu[keys[i-1]].length;const d=Math.abs(nIt-2*a);if(d<bd){bd=d;best=i}}
    courses=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 26px;align-items:start"><div>${keys.slice(0,best).map((k,i)=>course(k,i)).join("")}</div><div>${keys.slice(best).map((k,i)=>course(k,i+best)).join("")}</div></div>`}
  else courses=keys.map(course).join("");
  const fee=num?(num.length>=3?num.slice(0,-2)+"."+num.slice(-2):num+"."+yy):"19."+yy;
  const back=`${stock()}${border()}
   <div style="position:absolute;left:60px;right:60px;top:50px">${kick("The courses in procession")}</div>
   <div style="position:absolute;left:60px;right:60px;top:78px;font:${E.dw} 50px/1.05 ${E.disp};text-transform:${dispCase};letter-spacing:${E.track};color:${INK};text-align:center;${press}">Bill of Fare</div>
   <div data-fit data-min="${heavy?14:17}" style="position:absolute;left:64px;right:64px;top:${heavy?136:150}px;height:${heavy?486:470}px;overflow:hidden;font-size:${heavy?20:28}px;text-align:center;display:flex;flex-direction:column">
     <div style="margin:auto 0">${courses}</div></div>
   <div style="position:absolute;left:64px;right:64px;top:626px;display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid ${GOLD};padding-top:8px">
     <span style="font:600 20px/1.2 ${E.body};color:${INK}">The whole feast, per cover</span><span style="font:700 26px/1 ${E.body};color:${ACC}">${esc(fee)}</span></div>
   <div data-fit data-min="14" style="position:absolute;left:64px;width:440px;top:668px;height:28px;overflow:hidden;font-size:16px;color:${SOFT}">
     <div style="font:${E.bodyW} 1em/1.3 ${E.body}">${winks[3]?`At table: ${esc(winks[3].replace(/\.$/,""))}. `:""}Form BF ${esc(num||yy)}. Poster and stills: TMDB.</div></div>
   <div style="position:absolute;left:43px;top:698px;width:730px;height:296px;padding:5px;box-sizing:border-box;background:${frame};box-shadow:0 8px 20px rgba(0,0,0,.28)">
     <div style="position:relative;width:100%;height:100%;overflow:hidden;background:#222">${secIsPoster?stage(second):photo(second,secPos)}</div></div>
   <div style="position:absolute;left:48px;right:48px;top:1000px;font:italic 16px/1.2 ${E.body};color:${SOFT};text-align:center">${esc(venue)}, laid for tonight</div>
   <div style="position:absolute;right:54px;top:688px;width:236px;padding:12px 16px 12px;background:${T.dark?"#f4ecd8":toHex(mix(paper,[255,255,255],.55))};border:1px solid ${GOLD};box-shadow:0 6px 14px rgba(0,0,0,.3);transform:rotate(-2.5deg);text-align:center;color:#2a2018">
     <div style="font:600 14px/1.2 ${E.body};letter-spacing:.26em;text-transform:uppercase;color:${readable(toHex(pa),"#fbf6ea",4.5)}">Place card</div>
     <div data-fit data-min="16" style="height:62px;overflow:hidden;font-size:26px;display:flex;align-items:center;justify-content:center"><div style="font:400 1em/1.05 'Pinyon Script',cursive">${esc(prop.title)}</div></div>
     ${prop.lines.map(l=>`<div style="font:${E.bodyW} 15px/1.3 ${E.body}">${esc(l)}</div>`).join("")}</div>`;

  window.__fmtFitLater();
  return {w:W,h:H,faces:[front,back]};
};
})();
