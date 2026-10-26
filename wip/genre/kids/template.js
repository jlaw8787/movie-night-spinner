/* Genre menu: kids. A family restaurant's printed kids' placemat (landscape 1344x960, one face).
   genreCard(f, menu, poster, stills, opts) returns the face HTML (inline styles only).
   f: film row (title, year, T, P). menu: {s,m,w,d} of {n,note}. poster: TMDB poster path or null.
   stills: array of [path,w,h,..] from data/film-stills.json, or null.
   opts: {tag, cue, root} optional. tag/cue override f.T / f.P (edition tagline and cue); root prefixes asset paths.
   genreFit(faceEl) shrinks the menu type if anything still spills after layout. Fonts: Fredoka 700, Nunito 600/800. */
(function(){
const W=1344,H=960;
const C={paper:"#fffaf0",ink:"#1d2a52",red:"#e5392c",blue:"#1f6fd1",yellow:"#ffc93c",soft:"#4a5577"};
const DISP="'Fredoka','Nunito',sans-serif",BODY="'Nunito',sans-serif";
const IMG="https://image.tmdb.org/t/p/";

/* no em or en dashes reach the page, whatever the data holds */
const clean=s=>String(s==null?"":s).replace(/\s*[\u2013\u2014]\s*/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sentence=s=>{s=clean(s).trim();if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};

/* alcohol-free table: obvious grown-up drink words are swapped for kid versions (flagged in NOTES.md) */
const DRY=[[/\bred wine\b|\bwhite wine\b|\bwine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktail(?! franks)\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur)\b/gi,"syrup"]];
const dry=s=>DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s));

/* tiny seeded random so a film always gets the same word search */
function rng(seed){let h=2166136261;for(const ch of seed)h=Math.imul(h^ch.charCodeAt(0),16777619);return()=>{h=Math.imul(h^h>>>15,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}

const STOP=new Set("WITH ALWAYS VERY JUST ACROSS ABOUT AGAIN BEING THEIR NEXT DOOR STRICTLY THE AND WITH FOR FROM INTO YOUR THAT THIS ONE TWO OUR ITS HIS HER ARE BIG LITTLE MINI EXTRA HOMEMADE THEMED STYLE BITES".split(" "));
function searchWords(f,menu,winks){
  const pick=[],seen=new Set();
  const add=(s,max)=>String(s).toUpperCase().replace(/[^A-Z ]/g," ").split(/\s+/).forEach(w=>{if(w.length>=3&&w.length<=8&&!STOP.has(w)&&!seen.has(w)&&pick.length<(max||6)){seen.add(w);pick.push(w)}});
  add(f.title,2);
  /* names from the winks first (capitalised words), then the rest of the winks, then the dishes */
  (winks||[]).forEach(w=>add((w.match(/\b[A-Z][a-z]+/g)||[]).slice(w.match(/^[A-Z]/)&&/^(The|A|An)\b/.test(w)?1:0).join(" "),5));
  (winks||[]).forEach(w=>add(w,6));
  ["m","s","w","d"].forEach(k=>(menu[k]||[]).forEach(it=>add(it.n)));
  ["MOVIE","POPCORN","PLATE"].forEach(w=>add(w));
  return pick.slice(0,6);
}
function wordSearch(f,menu,N,winks){
  const r=rng(f.title+f.year),g=Array.from({length:N},()=>Array(N).fill("")),placed=[];
  for(const w of searchWords(f,menu,winks)){
    let ok=false;
    for(let t=0;t<80&&!ok;t++){
      const down=r()<.45,x=Math.floor(r()*(down?N:N-w.length+1)),y=Math.floor(r()*(down?N-w.length+1:N));
      if(x<0||y<0)break;
      if([...w].every((ch,i)=>{const c=g[y+(down?i:0)][x+(down?0:i)];return!c||c===ch})){[...w].forEach((ch,i)=>g[y+(down?i:0)][x+(down?0:i)]=ch);ok=true}
    }
    if(ok)placed.push(w);
  }
  const AZ="ABCDEFGHIJKLMNOPRSTUWY";
  for(const row of g)for(let i=0;i<N;i++)if(!row[i])row[i]=AZ[Math.floor(r()*AZ.length)];
  return{g,placed};
}

/* prices a kids' placemat would print, with the film's year hidden in the treats */
function price(k,i,yy){
  if(k==="s")return["3.50","4.25","3.95","4.75"][i%4];
  if(k==="m")return["6.95","7.50","6.50","7.25"][i%4];
  if(k==="w")return i?"2.50":"2."+yy;
  return i?"1.75":"1."+yy;
}

/* size tiers from how much text there is, so most films fit without any runtime shrink */
function tiers(menu){
  let load=0,n=0;
  for(const k of ["s","m","w","d"])for(const it of menu[k]||[]){n++;load+=1.2+Math.ceil(clean(it.n).length/20)+Math.ceil(clean(it.note).length/28)}
  load+=["s","m","w","d"].filter(k=>(menu[k]||[]).length).length*1.4;
  if(load<=26)return{dish:28,note:21,gap:16,head:30};
  if(load<=33)return{dish:26,note:20,gap:12,head:28};
  return{dish:24,note:18,gap:9,head:26};
}

function titleSize(t){const n=t.length;return n<=6?84:n<=12?72:n<=18?62:n<=26?54:n<=36?46:42}

/* stills: no-language first, 1280 wide or more, in the order TMDB lists them */
function pickStills(stills){
  const ok=(stills||[]).filter(s=>s&&s[0]&&(+s[1]||0)>=1280);
  return ok.filter(s=>!s[3]).concat(ok.filter(s=>s[3]));
}

/* colour helpers: contrast checks so the film's palette never makes the menu hard to read */
const hex=h=>{h=String(h||"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(h))return null;return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const lum=a=>{const c=a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function filmColours(pal){
  const white=[255,255,255],black=[0,0,0];
  let acc=pal&&hex(pal.accent);
  /* too grey or too pale: use the genre blue */
  if(!acc||Math.max(...acc)-Math.min(...acc)<40||contrast(acc,hex(C.paper))<1.6)acc=hex(C.blue);
  let lab=acc;for(let k=0;k<10&&contrast(lab,white)<4.2;k++)lab=mix(lab,black,.12);
  return{acc:toHex(acc),lab:toHex(lab),deep:toHex(mix(acc,black,.5)),glow:toHex(mix(acc,white,.25))};
}

/* real paper: fibre noise (procedural, not a picture) under the shared grain */
const NOISE="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45  0 0 0 0 .36  0 0 0 0 .22  0 0 0 .55 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>");
const BLOTCH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.006' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 .62  0 0 0 0 .5  0 0 0 0 .3  0 0 0 .32 0'/></filter><rect width='900' height='900' filter='url(#b)'/></svg>");

/* menu sizes from the estimated height of a single 404px column */
function sizes(menu,avail){
  let h=0;
  for(const k of ["s","m","w","d"]){const its=menu[k]||[];if(!its.length)continue;h+=54;
    for(const it of its)h+=Math.ceil((clean(it.n).length+5)/26)*29+(it.note?Math.ceil(clean(it.note).length/38)*25+4:0)+14}
  const s=Math.min(1,avail/h);
  return{dish:Math.max(18,Math.round(27*s)),note:Math.max(16,Math.round(20*s)),gap:Math.max(6,Math.round(14*s)),head:Math.max(18,Math.round(24*s))};
}

function genreCard(f,menu,poster,stills,opts){
  opts=opts||{};
  const root=opts.root||"";
  const fl=opts.flavour||null,logo=opts.logo||null,K=filmColours(opts.palette);
  const tag=clean(opts.tag||f.T||""),cue=clean(opts.cue||f.P||"");
  const yy=String(f.year).slice(-2);
  const num=fl&&/^\d{1,4}$/.test(String(fl.number||""))?String(fl.number):"";
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const venue=clean(fl&&fl.venue||"Pip's Family Kitchen");
  const sign=clean(fl&&fl.sign||"Kids' movie night menu");
  const lab=["Snacks","Mains","Treats","Drinks"];
  const keys=["s","m","w","d"];
  const tz=sizes(menu,590);
  const st=pickStills(stills);
  const grain=`${root}assets/era/_shared/paper-grain.webp`;
  const tex=(op)=>`<div style="position:absolute;inset:0;background:url('${grain}') 0 0/520px,url("${NOISE}") 0 0/300px;opacity:${op};mix-blend-mode:multiply;pointer-events:none"></div>`;
  const pr=(k,i)=>{if(k==="m"&&i===0&&num.length===2)return num[0]+"."+num[1]+"0";if(k==="m"&&i===0&&num.length===3)return num[0]+"."+num.slice(1);return price(k,i,yy)};
  const lc=w=>/^(The|A|An)\b/.test(w)?w.charAt(0).toLowerCase()+w.slice(1):w;

  const hero=st[0]?IMG+"w1280"+st[0][0]:(poster?IMG+"w780"+poster:"");
  const second=st[1]?IMG+"w1280"+st[1][0]:"";
  const photo=(src,pos)=>`<img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:saturate(1.1) contrast(1.05)"><div style="position:absolute;inset:0;box-shadow:inset 0 0 60px rgba(0,0,0,.22)"></div>`;

  /* logo in its own colours on a panel; genreFit() picks dark or light stock for it */
  const lr=logo&&logo[0]&&logo[1]&&logo[2]?logo[1]/logo[2]:0;
  const lh=lr?Math.min(120,Math.round(330/lr)):0,lw=lr?Math.round(lh*lr):0;
  const tsz=titleSize(f.title);
  const logoPanel=`<div data-lpanel style="position:absolute;left:22px;bottom:22px;max-width:520px;padding:16px 22px 14px;border-radius:14px;background:rgba(14,16,28,.72);box-shadow:0 6px 18px rgba(0,0,0,.35),inset 0 0 0 2px rgba(255,255,255,.18);backdrop-filter:blur(3px)">
      ${lr?`<img data-logo crossorigin="anonymous" alt="${esc(f.title)}" src="${IMG}w500${logo[0]}" style="display:block;height:${lh}px;width:${lw}px;object-fit:contain">
      <div data-title-fallback style="display:none;font:700 ${tsz}px/1.02 ${DISP};color:#fff;text-transform:uppercase">${esc(f.title)}</div>`
      :`<div data-fit="title" style="font:700 ${tsz}px/1.02 ${DISP};color:#fff;text-transform:uppercase;text-shadow:3px 3px 0 ${C.red}">${esc(f.title)}</div>`}
      <div data-ink="pk" style="font:800 15px/1 ${BODY};letter-spacing:.24em;color:${C.yellow};margin-top:10px">NOW SHOWING &nbsp;/&nbsp; ${esc(f.year)}</div>
    </div>`;

  /* the menu: one column, dish and price on one line, the film note under it */
  const item=(k,it,i)=>`<div style="padding:0 0 ${tz.gap}px">
    <div style="display:flex;align-items:baseline;gap:12px"><span data-fit="dish" style="flex:1;font:700 ${tz.dish}px/1.08 ${DISP};color:${C.ink}">${esc(dry(it.n))}</span><span data-fit="dish" style="font:700 ${tz.dish}px/1 ${DISP};color:${C.red}">${pr(k,i)}</span></div>
    ${it.note?`<div data-fit="note" style="font:600 ${tz.note}px/1.25 ${BODY};color:${C.soft};margin-top:3px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const course=(k,j)=>{const its=menu[k]||[];if(!its.length)return"";
    return `<div style="display:flex;align-items:center;gap:12px;margin:0 0 10px"><span data-fit="head" style="font:700 ${tz.head}px/1 ${DISP};letter-spacing:.06em;text-transform:uppercase;color:${j%2?C.red:K.lab}">${lab[j]}</span><i style="flex:1;height:3px;background:${j%2?C.red:K.lab};opacity:.55;border-radius:2px"></i></div>${its.map((it,i)=>item(k,it,i)).join("")}`};
  const courses=keys.map(course).join("");

  /* the character's note, signed in script */
  const note=fl&&fl.note&&fl.note.text?fl.note:null;
  const noteHTML=note
    ?`<div style="font:800 14px/1 ${BODY};letter-spacing:.22em;color:${C.red}">A WORD FROM THE HOUSE</div>
      <div data-fit="story" style="font:italic 700 18px/1.32 ${BODY};color:${C.ink};margin-top:8px">"${esc(note.text)}"</div>
      <div style="font:700 32px/1 'Caveat',cursive;color:${K.lab};transform:rotate(-3deg);margin-top:6px;text-align:right">${esc(note.by)}</div>`
    :`<div style="font:800 14px/1 ${BODY};letter-spacing:.22em;color:${C.red}">TONIGHT'S STORY</div>
      <div data-fit="story" style="font:700 18px/1.32 ${BODY};color:${C.ink};margin-top:8px">${esc(sentence(f.D||tag))}</div>`;

  /* the film's own prop, type only, tucked on the corner of the second photo */
  const p=fl&&fl.prop&&fl.prop.title?fl.prop:{kind:"card",title:"Clean Plate Club",lines:["Finish your plate,","ask for a sticker."]};
  const pk=p.kind||"card";
  const propStyle={
    ticket:`background:${C.yellow};border-radius:6px;-webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;`,
    stub:`background:${C.yellow};border-radius:6px;border-left:3px dashed ${C.ink};`,
    badge:`background:#fffdf7;border-radius:18px;box-shadow:inset 0 0 0 4px ${K.lab},inset 0 0 0 7px #fffdf7,inset 0 0 0 9px ${C.yellow},0 4px 12px rgba(0,0,0,.35);`,
    tag:`background:#f6e7c8;border-radius:6px 30px 30px 6px;`,
    slip:`background:#fffdf7;border-top:6px solid ${K.lab};border-radius:3px;`,
    receipt:`background:#fffdf7;border-radius:2px;`,
    card:`background:#fffdf7;border-radius:6px;border-bottom:8px solid ${K.lab};`
  }[pk]||`background:#fffdf7;border-radius:6px;border-bottom:8px solid ${K.lab};`;
  const propHTML=`<div style="position:absolute;right:-10px;top:-14px;width:214px;box-sizing:border-box;${propStyle}padding:13px 18px 12px;transform:rotate(3deg);box-shadow:0 4px 12px rgba(0,0,0,.35);overflow:hidden">
      ${tex(.3)}
      <div style="position:relative;font:800 13px/1 ${BODY};letter-spacing:.2em;color:${K.lab};text-transform:uppercase">${esc(pk==="badge"?"Official badge":pk==="ticket"||pk==="stub"?"Admit one":pk==="receipt"?"Receipt":"Keep this")}</div>
      <div data-fit="prop" style="position:relative;font:700 20px/1.05 ${DISP};color:${C.ink};text-transform:uppercase;margin:6px 0 6px">${esc(p.title)}</div>
      ${(p.lines||[]).slice(0,3).map(l=>`<div style="position:relative;font:700 14px/1.3 ${BODY};color:${C.ink}">${esc(l)}</div>`).join("")}
    </div>`;

  const fine=`*With a grown-up's meal. Ages 12 and under. Prices subject to change. Every drink is alcohol-free.${winks[0]?` Table talk: ${winks[0].replace(/\.$/,"")}.`:""} Form KM-${num||f.year}. Images: TMDB.`;

  return `<div data-genre="kids" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:repeating-conic-gradient(${K.lab} 0 25%,#fff4e2 0 50%) 0 0/36px 36px;font-family:${BODY};color:${C.ink}">
  ${tex(.45)}
  <div style="position:absolute;left:24px;top:24px;right:24px;bottom:24px;background:${C.paper};border-radius:22px;box-shadow:0 0 0 5px ${C.yellow},0 0 0 7px rgba(0,0,0,.08);overflow:hidden">
    <div style="position:absolute;inset:0;background:url("${BLOTCH}") 0 0/900px;mix-blend-mode:multiply;opacity:.5;pointer-events:none"></div>

    <div style="position:absolute;left:0;top:0;width:880px;height:590px;overflow:hidden;background:${K.deep}">
      ${hero?photo(hero,"center 40%"):""}
      ${logoPanel}
    </div>
    <div style="position:absolute;left:0;top:590px;width:880px;height:5px;background:${C.yellow}"></div>
    <div style="position:absolute;left:880px;top:0;width:5px;bottom:0;background:${C.yellow}"></div>

    <div style="position:absolute;left:0;top:595px;width:560px;bottom:0;background:${K.deep}">
      <div style="position:absolute;inset:0;overflow:hidden">${second?photo(second,"center"):""}
        <div style="position:absolute;left:14px;bottom:14px;background:rgba(255,253,247,.92);padding:6px 12px;border-radius:4px;font:800 14px/1.2 ${BODY};letter-spacing:.06em;color:${C.ink};box-shadow:0 2px 6px rgba(0,0,0,.3)">ON THE BIG SCREEN TONIGHT</div></div>
      ${propHTML}
    </div>
    <div style="position:absolute;left:560px;top:595px;width:5px;bottom:0;background:${C.yellow}"></div>

    <div style="position:absolute;left:589px;top:617px;width:270px;bottom:20px;display:flex;flex-direction:column;justify-content:space-between">
      <div>${noteHTML}</div>
      <div style="border-top:3px dashed ${C.red};padding-top:10px">
        <div style="font:800 14px/1 ${BODY};letter-spacing:.22em;color:${C.red}">SHOWTIME CUE</div>
        <div data-fit="cue" style="font:700 ${cue.length>80?16:17}px/1.28 ${BODY};color:${C.ink};margin-top:6px">${esc(sentence(cue))}</div></div>
    </div>

    <div style="position:absolute;left:885px;top:0;right:0;height:176px;background:${K.deep};overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 20% 0%,${K.glow}55,rgba(255,255,255,0) 65%),linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.18))"></div>
      ${tex(.55)}
      <div style="position:absolute;inset:12px;border:2px solid ${C.yellow};border-radius:10px;box-shadow:inset 0 0 0 4px rgba(0,0,0,.18)"></div>
      <div style="position:absolute;left:32px;right:28px;top:26px;bottom:24px;display:flex;flex-direction:column;justify-content:center" data-band-in>
        <div style="font:800 15px/1 ${BODY};letter-spacing:.26em;color:${C.yellow}">KIDS' MENU</div>
        <div data-fit="venue" style="font:700 ${venue.length>20?32:40}px/1.02 ${DISP};color:#fff;text-transform:uppercase;margin-top:7px;text-shadow:0 2px 0 rgba(0,0,0,.3)">${esc(venue)}</div>
        <div style="font:800 17px/1.2 ${BODY};color:${C.yellow};margin-top:6px">${esc(sign)}</div>
      </div>
    </div>
    <div style="position:absolute;left:885px;right:0;top:176px;height:5px;background:${C.red}"></div>

    <div style="position:absolute;left:911px;right:24px;top:200px;bottom:84px;display:flex;flex-direction:column">
      ${tag?`<div data-fit="tag" style="font:700 24px/1.12 ${DISP};color:${K.lab};margin:0 0 16px;flex:none">${esc(sentence(tag))}</div>`:""}
      <div data-fit="menu" style="flex:1;min-height:0;overflow:hidden">${courses}</div>
    </div>
    <div data-fit-box="fine" style="position:absolute;left:911px;right:24px;bottom:16px;height:58px;display:flex;align-items:flex-end"><div data-fit="fine" style="font:700 14px/1.3 ${BODY};color:${C.soft}">${esc(fine)}</div></div>
  </div>
</div>`;
}

/* runtime safety: shrink menu type a step at a time until nothing spills, then the title and cue */
function genreFit(el){
  const shrink=(sel,box,min)=>{
    const nodes=[...el.querySelectorAll(sel)];
    const over=()=>box.scrollHeight>box.clientHeight+1||box.scrollWidth>box.clientWidth+1;
    for(let k=0;k<12&&over();k++){
      let changed=false;
      nodes.forEach(n=>{const s=parseFloat(getComputedStyle(n).fontSize);if(s>min){n.style.fontSize=(s-1)+"px";changed=true}});
      if(!changed)break;
    }
  };
  const menu=el.querySelector('[data-fit="menu"]');
  if(menu){shrink('[data-fit="dish"],[data-fit="note"],[data-fit="head"]',menu,16);
    /* last resort for extreme menus: notes wrap to two lines, then one */
    for(const n of [2,1])if(menu.scrollHeight>menu.clientHeight+1||menu.scrollWidth>menu.clientWidth+1)
      menu.querySelectorAll('[data-fit="note"]').forEach(e=>{e.style.display="-webkit-box";e.style.webkitBoxOrient="vertical";e.style.webkitLineClamp=String(n);e.style.overflow="hidden"});
    /* still too much: drop the notes, dish names and prices always stay */
    if(menu.scrollHeight>menu.clientHeight+1||menu.scrollWidth>menu.clientWidth+1)menu.querySelectorAll('[data-fit="note"]').forEach(e=>e.style.display="none");}
  /* logo keeps its own colours; a dark logo gets a light panel, a light logo a dark one */
  const lg=el.querySelector('[data-logo]'),panel=el.querySelector('[data-lpanel]');
  if(lg&&panel){
    if(lg.complete&&!lg.naturalWidth){lg.remove();const fb=el.querySelector('[data-title-fallback]');if(fb){fb.style.display="";fb.dataset.fit="title"}}
    else if(lg.naturalWidth){try{
      const cv=document.createElement("canvas");cv.width=96;cv.height=Math.max(8,Math.round(96*lg.naturalHeight/lg.naturalWidth));
      const cx=cv.getContext("2d");cx.drawImage(lg,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;
      let sum=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>128){sum+=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];n++}
      if(n&&sum/n<110){panel.style.background="rgba(255,250,238,.93)";panel.style.boxShadow="0 6px 18px rgba(0,0,0,.35),inset 0 0 0 2px rgba(0,0,0,.08)";
        const k=panel.querySelector('[data-ink="pk"]');if(k)k.style.color="#e5392c"}
    }catch(e){/* canvas blocked: keep the dark panel */}}
  }
  /* title type (no logo): at most two lines and inside the band */
  const t=el.querySelector('[data-fit="title"]');
  for(let k=0;t&&k<30;k++){const fs=parseFloat(getComputedStyle(t).fontSize),bi=t.parentNode;
    if(fs<=36||(t.offsetHeight<=fs*1.02*2+4&&bi.scrollHeight<=bi.clientHeight+1&&t.scrollWidth<=t.clientWidth+1))break;t.style.fontSize=(fs-2)+"px"}
  const bi=el.querySelector('[data-band-in]'),vn=el.querySelector('[data-fit="venue"]');
  for(let k=0;bi&&vn&&k<20&&(bi.scrollHeight>bi.clientHeight+1||vn.scrollWidth>vn.clientWidth+1||vn.offsetHeight>parseFloat(getComputedStyle(vn).fontSize)*2.2);k++)vn.style.fontSize=(parseFloat(getComputedStyle(vn).fontSize)-2)+"px";
  const fb=el.querySelector('[data-fit-box="fine"]');
  if(fb)shrink('[data-fit="fine"]',fb,14);
  const sx=el.querySelector('[data-fit="story"]');
  if(sx){const col=sx.parentNode.parentNode;for(let k=0;k<6&&col.scrollHeight>col.clientHeight+1;k++)sx.style.fontSize=(parseFloat(getComputedStyle(sx).fontSize)-1)+"px"}
  const pp=el.querySelector('[data-fit="prop"]');
  if(pp)for(let k=0;k<8&&pp.parentNode.scrollHeight>pp.parentNode.clientHeight+1;k++)pp.style.fontSize=(parseFloat(getComputedStyle(pp).fontSize)-1)+"px";
  const c=el.querySelector('[data-fit="cue"]');
  if(c&&c.parentNode.parentNode)shrink('[data-fit="cue"]',c.parentNode.parentNode,14);
}

const api={card:genreCard,fit:genreFit,size:[W,H]};
(window.GENRE=window.GENRE||{}).kids=api;
})();
