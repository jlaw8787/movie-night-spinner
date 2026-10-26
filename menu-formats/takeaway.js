/* Format: takeaway. A takeaway menu folded into a box lid: trifold, two landscape faces 1344x816, three 448px panels each with fold lines.
   Outside: delivery panel with phone and fortune slip (type only), a wraparound still across the back and cover, the cover block and logo, the kitchen note.
   Inside: a photo band, then numbered dishes across three panels and a set dinner for two.
   Era sets print process (one-colour letterpress on manila, two-colour offset, photocopy with a spot colour, glossy full colour) and type pairing. Tone sets wear, tint and voice. */
(function(){
const ID="takeaway",W=1344,H=816;
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
/* ---------- takeaway ---------- */
const ERA={
  old:{disp:"'Bree Serif',serif",body:"'Domine',serif",fonts:["Bree+Serif","Domine:wght@400;600;700"],dw:400,stock:[234,216,172],print:"letterpress",photo:"sepia(.2) saturate(.9) contrast(1.05)",caps:false},
  mid:{disp:"'Carter One',sans-serif",body:"'Cabin',sans-serif",fonts:["Carter+One","Cabin:ital,wght@0,500;0,700;1,500"],dw:400,stock:[247,237,214],print:"offset",photo:"saturate(1.15) contrast(1.04)",caps:false},
  late:{disp:"'Francois One',sans-serif",body:"'Archivo',sans-serif",fonts:["Francois+One","Archivo:ital,wght@0,500;0,700;1,500"],dw:400,stock:[250,250,247],print:"copy",photo:"contrast(1.15) saturate(1.05)",caps:true},
  new:{disp:"'Syne',sans-serif",body:"'DM Sans',sans-serif",fonts:["Syne:wght@700;800","DM+Sans:ital,wght@0,500;0,700;1,500"],dw:800,stock:null,print:"gloss",photo:"saturate(1.12) contrast(1.04)",caps:false}
};
const TONE={
  playful:{wear:.1,photo:" saturate(1.1) brightness(1.03)",tint:.1,run:"Hot, fast and to your door",fort:"Your fortune"},
  glossy:{wear:0,photo:" saturate(1.08)",tint:0,run:"Delivered hot to your door",fort:"Your fortune"},
  warm:{wear:.3,photo:" sepia(.05)",tint:.04,run:"Family owned, cooked to order",fort:"Your fortune"},
  tender:{wear:.2,photo:" brightness(1.04) saturate(.95)",tint:.06,run:"Cooked slow, packed with care",fort:"Your fortune"},
  grand:{wear:.15,photo:" contrast(1.05)",tint:0,run:"The finest kitchen in the district",fort:"Your fortune"},
  eerie:{wear:.5,photo:" saturate(.7) brightness(.94)",tint:-.25,run:"Open till the small hours",fort:"Read it if you dare"},
  tense:{wear:.3,photo:" contrast(1.12) saturate(.88)",tint:-.05,run:"Thirty minutes or less. No questions",fort:"Your fortune"},
  gritty:{wear:.8,photo:" contrast(1.12) saturate(.85)",tint:-.12,run:"Open late. Cash only",fort:"Your fortune"},
  scrappy:{wear:.65,photo:" contrast(1.18) saturate(.9)",tint:-.04,run:"Cheap, hot and quick",fort:"Your fortune"}
};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},eg=eraGroup(ctx.era||"modern"),E=ERA[eg],T=TONE[ctx.tone]||TONE.warm,root=rootPath(ctx);
  loadFonts(ID+"-"+eg,E.fonts.concat(["Caveat:wght@600"]));
  const fam=isFamily(f),fl=ctx.flavour||null,menu=ctx.menu||{};
  const txt=s=>fam?dry(s):clean(s);
  if(!ctx.poster&&typeof TMDB_POSTERS!=="undefined")ctx.poster=TMDB_POSTERS[f.id]||null;
  const pd=hex(ctx.palette&&ctx.palette.dark)||[30,20,20],pa0=hex(ctx.palette&&ctx.palette.accent);
  const pa=pa0&&Math.max(...pa0)-Math.min(...pa0)>=35?pa0:[200,40,30];
  /* stock and inks per print process */
  const dark=eg==="new"||T.tint<-.2;
  let paper=E.stock?mix(E.stock,T.tint>0?mix(pa,[255,255,255],.6):[40,40,40],Math.abs(T.tint)):mix(pd,[8,8,10],.5);
  if(dark&&E.stock)paper=mix(pd,[14,14,16],.55);
  const P=toHex(paper);
  const INK=dark?"#f6f3ec":eg==="old"?readable(toHex(mix(pa,[60,10,10],.35)),P,7):eg==="mid"?readable("#4a2a14",P,8):"#141414";
  const SPOT=readable(eg==="old"?INK:toHex(pa),P,dark?4.5:3.4);
  const SOFT=toHex(mix(hex(INK),paper,.25));
  const BAR=dark?toHex(mix(pa,[0,0,0],.15)):eg==="old"?INK:toHex(mix(pa,[0,0,0],eg==="late"?.1:.3));
  const BARINK=readable(dark?"#ffffff":toHex(paper),BAR,4.8);
  const yy=String(f.year||"").slice(-2),num=String(fl&&fl.number||"").replace(/\D/g,"").slice(0,4);
  const venue=clean(fl&&fl.venue||"Golden Door Kitchen");
  const sign=clean(fl&&fl.sign||"Takeaway and delivery, open late");
  const note=fl&&fl.note&&fl.note.text?{t:txt(fl.note.text),by:clean(fl.note.by||"The Cook")}:{t:"Everything here is cooked when you ring, packed hot and sent straight out. Thanks for ordering in tonight.",by:"The Cook"};
  const winks=(fl&&fl.winks||[]).map(txt).filter(Boolean);
  const prop=fl&&fl.prop&&fl.prop.title?{title:clean(fl.prop.title),lines:(fl.prop.lines||[]).map(clean).slice(0,2)}:{title:"Good things arrive hot",lines:["Order again soon"]};
  const stills=(ctx.stills||[]).filter(Boolean);
  const hero=stills[0]?IMG+"w1280"+stills[0]:(ctx.poster?IMG+"w780"+ctx.poster:"");
  const second=stills[1]?IMG+"w1280"+stills[1]:(stills[0]?IMG+"w1280"+stills[0]:(ctx.poster?IMG+"w780"+ctx.poster:""));
  const grain=`${root}assets/era/_shared/paper-grain.webp`;
  const up=E.caps?"uppercase":"none";

  /* paper, print process and the two folds */
  const press=E.print==="letterpress"?`text-shadow:0 0 .8px ${INK};`:"";
  const stock=`<div style="position:absolute;inset:0;background:${P}"></div>
    <div style="position:absolute;inset:0;background:url('${grain}') 0 0/520px,url(&quot;${NOISE}&quot;) 0 0/300px;opacity:${(dark?.18:.3)+T.wear*.3};mix-blend-mode:${dark?"overlay":"multiply"}"></div>
    ${E.print==="copy"?`<div style="position:absolute;inset:0;background:url(&quot;${NOISE}&quot;) 0 0/120px;opacity:${.12+T.wear*.25};mix-blend-mode:multiply;filter:contrast(3)"></div>`:""}
    ${T.wear>.3?`<div style="position:absolute;inset:0;background:url(&quot;${BLOTCH}&quot;) 0 0/900px;opacity:${T.wear*.55};mix-blend-mode:multiply"></div>`:""}`;
  const folds=`<div style="position:absolute;left:441px;top:0;bottom:0;width:14px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,${.1+T.wear*.08}) 50%,rgba(255,255,255,.14) 52%,rgba(0,0,0,0));pointer-events:none"></div>
    <div style="position:absolute;left:889px;top:0;bottom:0;width:14px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(255,255,255,.14) 48%,rgba(0,0,0,${.1+T.wear*.08}) 50%,rgba(0,0,0,0));pointer-events:none"></div>`;
  const half=E.print==="offset"?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.2) 30%,transparent 32%) 0 0/4px 4px;opacity:.3;mix-blend-mode:multiply"></div>`:"";
  const photo=(src,pos)=>src?`<img alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:${E.photo}${T.photo}">${half}`
    :`<div style="position:absolute;inset:0;background:radial-gradient(circle at 60% 40%,${toHex(mix(pa,[255,255,255],.2))},${toHex(mix(pa,[0,0,0],.45))})"></div>`;
  const kick=(s,c)=>`<div style="font:700 18px/1.2 ${E.body};letter-spacing:.24em;text-transform:uppercase;color:${c||SPOT}">${esc(s)}</div>`;

  /* logo on a panel that suits its colours, set type if missing */
  const lg=ctx.logo,lr=lg&&lg[0]&&lg[1]&&lg[2]?lg[1]/lg[2]:0;
  const lh=lr?Math.min(118,Math.round(340/lr)):0,lw=lr?Math.round(lh*lr):0;
  const tl=clean(f.title).length,tsz=tl<=14?54:tl<=26?42:tl<=40?32:28;
  const titleType=`<div style="font:${E.dw} ${tsz}px/1.04 ${E.disp};text-transform:uppercase;color:currentColor">${esc(f.title)}</div>`;
  const logoPanel=`<div data-lpanel data-dark="rgba(12,10,10,.82)" data-light="rgba(252,249,242,.92)" data-darkink="#fff" data-lightink="#151515" style="position:absolute;left:918px;right:26px;bottom:26px;padding:16px 20px 14px;background:rgba(12,10,10,.82);color:#fff;border-radius:${eg==="new"?14:3}px;box-shadow:0 6px 18px rgba(0,0,0,.4);text-align:center">
      ${lr?`<img crossorigin="anonymous" alt="${esc(f.title)}" src="${IMG}w500${lg[0]}" onload="__fmtLogo(this)" onerror="__fmtLogoFail(this)" style="display:block;height:${lh}px;width:${lw}px;max-width:356px;object-fit:contain;margin:0 auto"><div style="display:none">${titleType}</div>`:titleType}
      <div style="font:700 15px/1 ${E.body};letter-spacing:.24em;text-transform:uppercase;margin-top:10px;opacity:.9">Movie night order &nbsp;·&nbsp; ${esc(f.year)}</div></div>`;

  /* ---------- outside: delivery panel, wraparound photo, cover ---------- */
  const phone="555 0"+(num?num.padStart(3,"0").slice(-3):(yy||"00")+"1");
  const run=(winks.length?winks.slice(0,3):["Every street in town","Hot or it is free","Napkins in every bag"]).map(w=>esc(w.replace(/\.$/,"")));
  const lucky=[num||"8",yy||"16","23",String((+(num||7)*3)%90+4)].join("  ");
  const outside=`${stock}
   <div style="position:absolute;left:448px;top:0;width:896px;height:816px;overflow:hidden;background:#111">${photo(hero,stills[0]?"50% 40%":"50% 25%")}</div>
   <div data-fit data-min="14" style="position:absolute;left:30px;top:30px;width:388px;height:24px;overflow:hidden;white-space:nowrap;font-size:18px"><div style="font:700 1em/1.2 ${E.body};letter-spacing:.2em;text-transform:uppercase;color:${SPOT}">${esc(T.run)}</div></div>
   <div data-fit data-min="34" style="position:absolute;left:30px;top:60px;width:388px;height:70px;overflow:hidden;white-space:nowrap;font-size:64px"><div style="font:${E.dw} 1em/1.05 ${E.disp};text-transform:uppercase;color:${INK};${press}">We deliver</div></div>
   <div style="position:absolute;left:30px;top:138px;width:388px;background:${BAR};color:${BARINK};padding:12px 16px;box-sizing:border-box;${eg==="new"?"border-radius:10px;":""}">
     <div style="font:700 15px/1 ${E.body};letter-spacing:.24em;text-transform:uppercase">Phone your order</div>
     <div style="font:${E.dw} 44px/1.1 ${E.disp};margin-top:4px;white-space:nowrap">${phone}</div></div>
   <div style="position:absolute;left:30px;top:236px;width:388px;font:500 20px/1.35 ${E.body};color:${INK}">Open 5 pm till late, seven nights.<br>Free delivery over 25.${yy||"00"}.</div>
   <div style="position:absolute;left:30px;top:310px;width:388px;height:1px;background:${SOFT};opacity:.6"></div>
   <div data-fit data-min="15" style="position:absolute;left:30px;top:322px;width:388px;height:220px;overflow:hidden;font-size:20px;color:${INK}">
     <div style="font:700 15px/1.2 ${E.body};letter-spacing:.22em;text-transform:uppercase;color:${SPOT};margin-bottom:.4em">Talk on the delivery run</div>
     ${run.map(r=>`<div style="font:500 1em/1.3 ${E.body};margin-bottom:.4em;padding-left:1em;text-indent:-1em"><span style="color:${SPOT};font-weight:700">+</span> ${r}</div>`).join("")}</div>
   <div style="position:absolute;left:34px;top:572px;width:372px;height:200px;background:#fbfaf6;color:#222;box-shadow:0 5px 14px rgba(0,0,0,.3);transform:rotate(-2.5deg);padding:14px 20px;box-sizing:border-box;display:flex;flex-direction:column">
     <div style="font:700 14px/1 ${E.body};letter-spacing:.26em;text-transform:uppercase;color:${readable(toHex(pa),"#fbfaf6",4.5)}">${esc(T.fort)}</div>
     <div data-fit data-min="16" style="flex:1;min-height:0;overflow:hidden;font-size:26px;display:flex;flex-direction:column;justify-content:center;text-align:center"><div style="font:italic 500 1em/1.2 ${E.body}">${esc(sent(prop.title))}</div>
       ${prop.lines.length?`<div style="font:500 .7em/1.3 ${E.body};font-size:max(15px,.7em);margin-top:.3em">${prop.lines.map(l=>esc(sent(l))).join(" ")}</div>`:""}</div>
     <div style="font:700 15px/1 ${E.body};letter-spacing:.14em;text-align:center">LUCKY NUMBERS &nbsp;${lucky}</div></div>
   <div style="position:absolute;left:896px;top:0;width:448px;padding:26px 28px 22px;box-sizing:border-box;background:${dark?toHex(mix(paper,[0,0,0],.2)):P};${dark?"":`border-bottom:6px solid ${BAR};`}">
     ${kick("Takeaway menu")}
     <div data-fit data-min="26" style="height:104px;overflow:hidden;font-size:50px;display:flex;align-items:center;margin-top:4px"><div style="font:${E.dw} 1em/1.02 ${E.disp};text-transform:uppercase;color:${INK};${press}">${esc(venue)}</div></div>
     <div data-fit data-min="16" style="height:50px;overflow:hidden;font-size:20px;margin-top:4px"><div style="font:italic 500 1em/1.25 ${E.body};color:${SOFT}">${esc(sign)}</div></div></div>
   ${logoPanel}
   <div style="position:absolute;left:478px;top:500px;width:380px;height:286px;background:#fbfaf6;color:#222;box-shadow:0 6px 16px rgba(0,0,0,.35);padding:16px 22px;box-sizing:border-box;display:flex;flex-direction:column">
     <div style="font:700 15px/1 ${E.body};letter-spacing:.22em;text-transform:uppercase;color:${readable(toHex(pa),"#fbfaf6",4.5)}">A word from the kitchen</div>
     <div data-fit data-min="16" style="flex:1;min-height:0;overflow:hidden;font-size:21px;margin-top:8px"><div style="font:500 1em/1.32 ${E.body}">${esc(sent(note.t))}</div></div>
     <div style="font:600 36px/1 'Caveat',cursive;color:${readable(toHex(pa),"#fbfaf6",4.5)};text-align:right">${esc(note.by)}</div></div>
   ${folds}`;

  /* ---------- inside: photo band, three panels of numbered dishes ---------- */
  const LAB=fam?{s:"Starters",m:"Mains",w:"Sweets",d:"Drinks"}:{s:"Starters",m:"Mains",w:"Sweets",d:"Drinks"};
  const BASE={s:1,m:20,w:40,d:60};
  const PR={s:["6.50","7.20","5.90","6.80"],m:["14.90","16.50","13.80","15.20"],w:["6.40","5.90","6.80","5.50"],d:["4.50","3.90","4.80","4.20"]};
  const price=(k,i)=>k==="w"&&i===0&&yy?"6."+yy:k==="m"&&i===0&&num&&num.length<=2?"1"+num.padStart(2,"0")[0]+"."+num.padStart(2,"0")[1]+"0":PR[k][i%4];
  const keys=["s","m","w","d"].filter(k=>(menu[k]||[]).length);
  const nIt=keys.reduce((a,k)=>a+menu[k].length,0),heavy=nIt>9;
  const wt=k=>menu[k].reduce((a,it)=>a+1.4+Math.ceil(clean(it.n).length/26)+(it.note?Math.ceil(clean(it.note).length/34):0),0)+1.5;
  /* split the courses into three panels in order, keeping the heaviest panel as light as possible (panel three also holds the set dinner) */
  let best=null;const n=keys.length;
  const splits=n<=1?[[keys,[],[]]]:n===2?[[[keys[0]],[keys[1]],[]]]:n===3?[[[keys[0]],[keys[1]],[keys[2]]]]:[[keys.slice(0,1),keys.slice(1,2),keys.slice(2)],[keys.slice(0,1),keys.slice(1,3),keys.slice(3)],[keys.slice(0,2),keys.slice(2,3),keys.slice(3)]];
  for(const sp of splits){const m=Math.max(sp[0].reduce((a,k)=>a+wt(k),0),sp[1].reduce((a,k)=>a+wt(k),0),sp[2].reduce((a,k)=>a+wt(k),0)+5);if(!best||m<best.m)best={m,sp}}
  const clamp=c=>`display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${c};overflow:hidden;`;
  const course=k=>`<div style="margin-bottom:.5em">
     <div style="display:flex;justify-content:space-between;align-items:center;background:${BAR};color:${BARINK};padding:.14em .5em .1em;${eg==="new"?"border-radius:8px;":""}margin-bottom:.32em">
       <span style="font:${E.dw} .9em/1.15 ${E.disp};font-size:max(18px,.9em);text-transform:uppercase;letter-spacing:.04em">${esc(LAB[k])}</span>
       <span style="font:700 .55em/1 ${E.body};font-size:max(14px,.55em);letter-spacing:.2em;text-transform:uppercase">No. ${BASE[k]}${menu[k].length>1?" to "+(BASE[k]+menu[k].length-1):""}</span></div>
     ${menu[k].map((it,i)=>`<div style="display:flex;gap:.4em;margin:0 0 ${heavy?".22em":".42em"}">
       <span style="flex:none;min-width:1.5em;margin-right:.2em;font:${E.dw} 1em/1.1 ${E.disp};color:${SPOT}">${BASE[k]+i}.</span>
       <div style="flex:1;min-width:0">
         <div style="display:flex;justify-content:space-between;gap:.5em;align-items:baseline">
           <span style="font:700 1em/1.12 ${E.body};color:${INK};text-transform:${up};${heavy?clamp(2):""}">${esc(txt(it.n))}</span>
           <span style="flex:none;font:700 1em/1.1 ${E.body};color:${INK}">${price(k,i)}</span></div>
         ${it.note&&!(nIt>12&&i>1)?`<div style="font:italic 500 .76em/1.28 ${E.body};font-size:max(15px,.76em);color:${SOFT};margin-top:.1em;${heavy?clamp(1):""}">${esc(sent(txt(it.note)))}</div>`:""}</div></div>`).join("")}</div>`;
  const setNo=num||(yy?"8"+yy[1]:"88");
  const setDinner=`<div style="border:2px ${eg==="late"?"dashed":"solid"} ${SPOT};padding:.4em .6em;margin-top:.2em;${eg==="new"?"border-radius:10px;":""}">
     <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:${E.dw} .92em/1.1 ${E.disp};font-size:max(18px,.92em);color:${SPOT};text-transform:uppercase">No. ${esc(setNo)} Movie night for two</span><span style="flex:none;font:700 1em/1 ${E.body};color:${INK};margin-left:.4em">32.${yy||"50"}</span></div>
     <div style="font:500 .74em/1.3 ${E.body};font-size:max(15px,.74em);color:${INK};margin-top:.2em">One of every course, packed in one bag, ready by the opening credits.</div></div>`;
  const pnl=(i,inner)=>`<div data-fit data-min="${heavy?14:18}" style="position:absolute;left:${i*448+26}px;top:250px;width:396px;height:${i===2?452:540}px;overflow:hidden;font-size:${heavy?20:28}px;display:flex;flex-direction:column"><div style="margin-bottom:auto">${inner}</div></div>`;
  const cue=clean(f.P||"");
  const inside=`${stock}
   <div style="position:absolute;left:0;top:0;width:1344px;height:226px;overflow:hidden;background:#111">${photo(second,stills[1]?"50% 42%":"50% 30%")}
     <div style="position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(0deg,rgba(0,0,0,.6),rgba(0,0,0,0))"></div>
     <div style="position:absolute;left:28px;bottom:14px;font:${E.dw} 34px/1 ${E.disp};color:#fff;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap">${esc(venue.length>34?"The menu":venue)}</div>
     <div style="position:absolute;right:28px;bottom:16px;font:700 16px/1 ${E.body};color:#fff;letter-spacing:.2em;text-transform:uppercase;text-shadow:0 2px 6px rgba(0,0,0,.7)">Order by number</div></div>
   <div style="position:absolute;left:0;right:0;top:226px;height:6px;background:${BAR}"></div>
   ${pnl(0,best.sp[0].map(course).join(""))}
   ${pnl(1,best.sp[1].map(course).join(""))}
   ${pnl(2,best.sp[2].map(course).join("")+setDinner)}
   <div data-fit data-min="14" style="position:absolute;left:922px;top:712px;width:396px;height:86px;overflow:hidden;font-size:16px;color:${SOFT}">
     <div style="font:500 1em/1.3 ${E.body}">${cue?`Kitchen tip: ${esc(sent(cue))} `:""}${winks[3]?`Overheard: ${esc(sent(winks[3]))} `:""}Prices subject to change. Form TK ${esc(num||yy)}. Stills: TMDB.</div></div>
   ${folds}`;

  window.__fmtFitLater();
  return {w:W,h:H,faces:[outside,inside]};
};
})();
