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

const STOP=new Set("THE AND WITH FOR FROM INTO YOUR THAT THIS ONE TWO OUR ITS HIS HER ARE BIG LITTLE MINI EXTRA HOMEMADE THEMED STYLE BITES".split(" "));
function searchWords(f,menu){
  const pick=[],seen=new Set();
  const add=s=>String(s).toUpperCase().replace(/[^A-Z ]/g," ").split(/\s+/).forEach(w=>{if(w.length>=3&&w.length<=8&&!STOP.has(w)&&!seen.has(w)&&pick.length<6){seen.add(w);pick.push(w)}});
  add(f.title);["m","s","w","d"].forEach(k=>(menu[k]||[]).forEach(it=>add(it.n)));
  ["MOVIE","POPCORN","PLATE"].forEach(add);
  return pick.slice(0,6);
}
function wordSearch(f,menu,N){
  const r=rng(f.title+f.year),g=Array.from({length:N},()=>Array(N).fill("")),placed=[];
  for(const w of searchWords(f,menu)){
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

function titleSize(t){const n=t.length;return n<=6?104:n<=12?92:n<=18?80:n<=26?66:n<=36?58:52}

/* stills: no-language first, 1280 wide or more, in the order TMDB lists them */
function pickStills(stills){
  const ok=(stills||[]).filter(s=>s&&s[0]&&(+s[1]||0)>=1280);
  return ok.filter(s=>!s[3]).concat(ok.filter(s=>s[3]));
}

/* real paper: fibre noise (procedural, not a picture) under the shared grain */
const NOISE="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45  0 0 0 0 .36  0 0 0 0 .22  0 0 0 .55 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>");
const BLOTCH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='b'><feTurbulence type='fractalNoise' baseFrequency='.006' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 .62  0 0 0 0 .5  0 0 0 0 .3  0 0 0 .32 0'/></filter><rect width='900' height='900' filter='url(#b)'/></svg>");

function genreCard(f,menu,poster,stills,opts){
  opts=opts||{};
  const root=opts.root||"";
  const tag=clean(opts.tag||f.T||""),cue=clean(opts.cue||f.P||"");
  const yy=String(f.year).slice(-2);
  const lab=["Snacks","Mains","Treats","Drinks"];
  const keys=["s","m","w","d"];
  const tz=tiers(menu);
  const st=pickStills(stills);
  const grain=`${root}assets/era/_shared/paper-grain.webp`;
  const tex=(op)=>`<div style="position:absolute;inset:0;background:url('${grain}') 0 0/520px,url("${NOISE}") 0 0/300px;opacity:${op};mix-blend-mode:multiply;pointer-events:none"></div>`;

  /* framed photo print */
  const print=(src,w,h,pos,rot,cap,capSize)=>`<div style="position:relative;background:#fffdf7;padding:11px 11px 0;box-shadow:0 1px 0 rgba(0,0,0,.05),0 6px 14px rgba(29,42,82,.30);transform:rotate(${rot}deg);width:${w+22}px;box-sizing:border-box">
    <div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#cfd9ea;box-shadow:inset 0 0 0 5px ${C.blue}"><img crossorigin="anonymous" alt="" src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};display:block;filter:saturate(1.08) contrast(1.04)"><div style="position:absolute;inset:0;box-shadow:inset 0 0 0 5px ${C.blue},inset 0 0 40px rgba(0,0,0,.18)"></div></div>
    <div style="padding:9px 4px 11px">${cap}</div></div>`;
  const hero=st[0]?IMG+"w1280"+st[0][0]:(poster?IMG+"w780"+poster:"");
  const second=st[1]?IMG+"w780"+st[1][0]:"";
  const storyCap=`<div style="font:800 15px/1 ${BODY};letter-spacing:.2em;color:${C.red}">TONIGHT'S STORY</div><div data-fit="story" style="font:700 17px/1.3 ${BODY};color:${C.ink};margin-top:5px">${esc(sentence(f.D||tag))}</div>`;

  /* the menu: two balanced columns, dish and price on one line, the film note under it */
  const item=(k,it,i)=>`<div style="break-inside:avoid;padding:0 0 ${tz.gap}px">
    <div style="display:flex;align-items:baseline;gap:12px"><span data-fit="dish" style="flex:1;font:700 ${tz.dish}px/1.08 ${DISP};color:${C.ink}">${esc(dry(it.n))}</span><span data-fit="dish" style="font:700 ${tz.dish}px/1 ${DISP};color:${C.red}">${price(k,i,yy)}</span></div>
    ${it.note?`<div data-fit="note" style="font:600 ${tz.note}px/1.25 ${BODY};color:${C.soft};margin-top:4px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const course=(k,j)=>{const its=menu[k]||[];if(!its.length)return"";
    return `<div style="break-inside:avoid-column;break-after:avoid"><div data-fit="head" style="display:inline-block;background:${j%2?C.red:C.blue};color:#fff;font:700 ${tz.head}px/1 ${DISP};letter-spacing:.04em;text-transform:uppercase;padding:9px 18px 8px;border-radius:999px;box-shadow:3px 3px 0 ${C.yellow};margin:0 0 12px">${lab[j]}</div></div>${its.map((it,i)=>item(k,it,i)).join("")}`};
  const courses=keys.map(course).join("");

  /* word search, all type */
  const N=9,cell=22,ws=wordSearch(f,menu,N);
  const grid=`<div style="display:grid;grid-template-columns:repeat(${N},${cell}px);border:3px solid ${C.blue};border-radius:6px;overflow:hidden;background:#fffdf7;width:${N*cell}px;flex:none">${ws.g.flat().map((ch,i)=>`<div style="height:${cell}px;display:flex;align-items:center;justify-content:center;font:800 16px/1 ${BODY};color:${C.ink};${i%N<N-1?`border-right:1px solid #c9d8f1;`:""}${i<N*(N-1)?`border-bottom:1px solid #c9d8f1;`:""}">${ch}</div>`).join("")}</div>`;
  const tsz=titleSize(f.title);

  return `<div data-genre="kids" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:repeating-conic-gradient(${C.red} 0 25%,#fff4e2 0 50%) 0 0/36px 36px;font-family:${BODY};color:${C.ink}">
  ${tex(.45)}
  <div style="position:absolute;left:24px;top:24px;right:24px;bottom:24px;background:${C.paper};border-radius:26px;box-shadow:0 0 0 5px ${C.yellow},0 0 0 7px rgba(0,0,0,.08);overflow:hidden">
    <div style="position:absolute;inset:0;background:url("${BLOTCH}") 0 0/900px;mix-blend-mode:multiply;opacity:.55;pointer-events:none"></div>

    <div style="position:absolute;left:0;top:0;right:0;height:172px;background:${C.blue};overflow:hidden">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(0,0,0,.10))"></div>
      ${tex(.5)}
      <div style="position:absolute;left:30px;top:22px;right:220px;bottom:14px;display:flex;flex-direction:column;justify-content:center">
        <div style="font:800 18px/1 ${BODY};letter-spacing:.26em;color:${C.yellow};text-transform:uppercase">Pip's Family Kitchen &nbsp;/&nbsp; Kids' movie night menu</div>
        <div data-fit="title" style="font:700 ${tsz}px/1.02 ${DISP};color:#fff;text-transform:uppercase;letter-spacing:.005em;margin-top:8px;text-shadow:4px 4px 0 ${C.red},5px 6px 0 rgba(0,0,0,.18)">${esc(f.title)}</div>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;top:172px;height:7px;background:${C.yellow}"></div>
    <div style="position:absolute;left:0;right:0;top:179px;height:4px;background:${C.red}"></div>

    <div style="position:absolute;right:26px;top:22px;width:168px;height:168px;border-radius:50%;background:${C.yellow};box-shadow:0 0 0 6px #fffdf7,0 0 0 10px ${C.red},0 8px 16px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(8deg);text-align:center;overflow:hidden">
      ${tex(.35)}
      <div style="font:800 15px/1.1 ${BODY};letter-spacing:.14em;color:${C.ink}">NOW SHOWING</div>
      <div style="font:700 52px/1 ${DISP};color:${C.red};margin:4px 0">${esc(f.year)}</div>
      <div style="font:800 15px/1.1 ${BODY};letter-spacing:.14em;color:${C.ink}">KIDS EAT FREE*</div>
    </div>

    <div style="position:absolute;left:28px;top:206px;width:612px">
      ${hero?print(hero,590,302,"center 35%",-1.2,storyCap):""}
    </div>

    <div style="position:absolute;left:30px;bottom:64px;width:300px;height:226px">
      <div style="font:700 25px/1 ${DISP};color:${C.red};text-transform:uppercase">Word Search</div>
      <div style="display:flex;gap:14px;margin-top:8px">${grid}
        <div style="display:flex;flex-direction:column;gap:6px;font:800 15px/1.1 ${BODY};color:${C.ink};letter-spacing:.06em;padding-top:2px">${ws.placed.map(w=>`<span>${w}</span>`).join("")}</div></div>
    </div>
    ${second?`<div style="position:absolute;left:346px;bottom:64px;width:292px">${print(second,270,152,"center",2,`<div style="font:700 15px/1.2 ${BODY};color:${C.soft};text-align:center">Friday night on our big screen</div>`)}</div>`:""}

    <div style="position:absolute;left:672px;top:206px;width:594px;bottom:190px;display:flex;flex-direction:column">
      ${tag?`<div data-fit="tag" style="font:700 30px/1.1 ${DISP};color:${C.red};margin:0 0 18px;flex:none">${esc(sentence(tag))}</div>`:""}
      <div data-fit="menu" style="flex:1;min-height:0;column-count:2;column-gap:32px;column-fill:balance;overflow:hidden">${courses}</div>
    </div>

    <div style="position:absolute;left:672px;width:370px;bottom:56px;height:116px;background:${C.red};border-radius:10px;display:flex;align-items:center;color:#fff;box-sizing:border-box;overflow:hidden;box-shadow:0 3px 8px rgba(29,42,82,.22)">
      ${tex(.4)}
      <div style="position:relative;width:96px;align-self:stretch;border-right:3px dashed rgba(255,255,255,.65);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none">
        <div style="font:800 14px/1.1 ${BODY};letter-spacing:.18em">ADMIT</div><div style="font:700 26px/1 ${DISP};color:${C.yellow};text-align:center">ONE<br>KID</div></div>
      <div style="position:relative;padding:0 16px">
        <div style="font:800 14px/1 ${BODY};letter-spacing:.2em;color:${C.yellow}">SHOWTIME CUE</div>
        <div data-fit="cue" style="font:700 ${cue.length>80?16:18}px/1.25 ${BODY};margin-top:6px">${esc(sentence(cue))}</div></div>
    </div>

    <div style="position:absolute;right:28px;width:206px;bottom:58px;background:${C.yellow};border-radius:8px;padding:12px 14px 12px;transform:rotate(-1.8deg);box-shadow:0 3px 8px rgba(29,42,82,.25);overflow:hidden">
      ${tex(.35)}
      <div style="position:relative;font:700 20px/1 ${DISP};color:${C.ink};text-transform:uppercase;white-space:nowrap">Clean Plate Club</div>
      <div style="position:relative;font:700 14px/1.25 ${BODY};color:${C.ink};margin:6px 0 8px">Tick each one, then ask for your sticker.</div>
      <div style="position:relative;display:grid;grid-template-columns:1fr 1fr;gap:6px 8px;font:800 14px/1 ${BODY};color:${C.ink}">${lab.filter((l,j)=>(menu[keys[j]]||[]).length).map(l=>`<span style="display:flex;align-items:center;gap:6px"><i style="width:14px;height:14px;border:2.5px solid ${C.ink};border-radius:3px;background:#fff;flex:none"></i>${l}</span>`).join("")}</div>
    </div>

    <div style="position:absolute;left:30px;right:30px;bottom:20px;font:700 15px/1.2 ${BODY};color:${C.soft};display:flex;justify-content:space-between;gap:20px;white-space:nowrap">
      <span>*With a grown-up's meal. Ages 12 and under. Prices subject to change. Every drink at this table is alcohol-free.</span>
      <span>Form KM-${esc(f.year)} / ${st[0]?"Stills":"Poster"}: TMDB</span>
    </div>
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
      menu.querySelectorAll('[data-fit="note"]').forEach(e=>{e.style.display="-webkit-box";e.style.webkitBoxOrient="vertical";e.style.webkitLineClamp=String(n);e.style.overflow="hidden"});}
  /* title: at most two lines and inside the band */
  const t=el.querySelector('[data-fit="title"]');
  for(let k=0;t&&k<30;k++){const fs=parseFloat(getComputedStyle(t).fontSize),band=t.parentNode;
    if(fs<=36||(t.offsetHeight<=fs*1.02*2+4&&band.scrollHeight<=band.clientHeight+1&&t.scrollWidth<=t.clientWidth+1))break;t.style.fontSize=(fs-2)+"px"}
  const c=el.querySelector('[data-fit="cue"]');
  if(c&&c.parentNode.parentNode)shrink('[data-fit="cue"]',c.parentNode.parentNode,14);
}

const api={card:genreCard,fit:genreFit,size:[W,H]};
(window.GENRE=window.GENRE||{}).kids=api;
})();
