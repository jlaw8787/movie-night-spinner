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

function titleSize(t){const n=t.length;return n<=10?78:n<=16?70:n<=24?60:n<=36?54:48}

function genreCard(f,menu,poster,stills,opts){
  opts=opts||{};
  const root=opts.root||"";
  const tag=clean(opts.tag||f.T||""),cue=clean(opts.cue||f.P||"");
  const yy=String(f.year).slice(-2);
  const lab=["Snacks","Mains","Treats","Drinks"];
  const keys=["s","m","w","d"];
  const tz=tiers(menu);
  const good=(stills||[]).filter(s=>s&&s[0]&&(+s[1]||0)>=1200);
  const hasStill=good.length>0;

  /* the picture: real TMDB stills when the film has them, else the poster in a lobby frame */
  const frame=(src,w,h,pos,rot,cap)=>`<div style="background:#fff;padding:10px 10px 0;box-shadow:0 3px 10px rgba(29,42,82,.28),0 0 0 1px rgba(29,42,82,.08);transform:rotate(${rot}deg);width:${w+20}px;box-sizing:border-box">
    <div style="width:${w}px;height:${h}px;overflow:hidden;background:#dfe6f3;outline:4px solid ${C.blue};outline-offset:-4px"><img crossorigin="anonymous" alt="" src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};display:block"></div>
    <div style="font:700 16px/1.25 ${BODY};color:${C.soft};padding:8px 2px 10px;text-align:center">${cap}</div></div>`;
  let pic;
  if(hasStill){
    const a=good[0],b=good[Math.min(good.length-1,Math.max(1,Math.floor(good.length/3)))];
    pic=frame(IMG+"w1280"+a[0],340,300,"center 40%",-1.6,"Friday night on our big screen")
      +(b&&b!==a?`<div style="margin:-6px 0 0 22px">${frame(IMG+"w780"+b[0],300,170,"center",1.8,"A favourite scene, our regulars agree")}</div>`:"");
  }else if(poster){
    pic=frame(IMG+"w780"+poster,348,500,"center top",-1.4,"Tonight's feature, on the big screen");
  }else{
    pic=`<div style="width:360px;height:520px;background:${C.blue};color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font:700 40px/1.1 ${DISP};padding:30px;box-sizing:border-box;transform:rotate(-1.4deg)">${esc(f.title)}</div>`;
  }

  /* the menu: two balanced columns, dish and price on one line, the film note under it */
  const item=(k,it,i)=>`<div style="break-inside:avoid;padding:0 0 ${tz.gap}px">
    <div style="display:flex;align-items:baseline;gap:12px"><span data-fit="dish" style="flex:1;font:700 ${tz.dish}px/1.08 ${DISP};color:${C.ink}">${esc(dry(it.n))}</span><span data-fit="dish" style="font:700 ${tz.dish}px/1 ${DISP};color:${C.red}">${price(k,i,yy)}</span></div>
    ${it.note?`<div data-fit="note" style="font:600 ${tz.note}px/1.25 ${BODY};color:${C.soft};margin-top:4px">${esc(sentence(dry(it.note)))}</div>`:""}</div>`;
  const course=(k,j)=>{const its=menu[k]||[];if(!its.length)return"";
    return `<div style="break-inside:avoid-column;break-after:avoid"><div data-fit="head" style="display:inline-block;background:${j%2?C.red:C.blue};color:#fff;font:700 ${tz.head}px/1 ${DISP};letter-spacing:.04em;text-transform:uppercase;padding:9px 18px 8px;border-radius:999px;box-shadow:3px 3px 0 ${C.yellow};margin:0 0 12px">${lab[j]}</div></div>${its.map((it,i)=>item(k,it,i)).join("")}`};
  const courses=keys.map(course).join("");

  /* word search, all type */
  const N=9,cell=24,ws=wordSearch(f,menu,N);
  const grid=`<div style="display:grid;grid-template-columns:repeat(${N},${cell}px);border:3px solid ${C.blue};border-radius:6px;overflow:hidden;background:#fff;width:${N*cell}px">${ws.g.flat().map((ch,i)=>`<div style="height:${cell}px;display:flex;align-items:center;justify-content:center;font:800 17px/1 ${BODY};color:${C.ink};${i%N<N-1?`border-right:1px solid #c9d8f1;`:""}${i<N*(N-1)?`border-bottom:1px solid #c9d8f1;`:""}">${ch}</div>`).join("")}</div>`;
  const tsz=titleSize(f.title);

  const grain=`${root}assets/era/_shared/paper-grain.webp`;
  return `<div data-genre="kids" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:repeating-conic-gradient(${C.red} 0 25%,#fff7ea 0 50%) 0 0/36px 36px;font-family:${BODY};color:${C.ink}">
  <div style="position:absolute;left:24px;top:24px;right:24px;bottom:24px;background:${C.paper};border-radius:26px;box-shadow:0 0 0 5px ${C.yellow};overflow:hidden">
    <div style="position:absolute;inset:0;background:url('${grain}');background-size:600px;opacity:.35;mix-blend-mode:multiply;pointer-events:none"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(255,255,255,0) 60%,rgba(214,170,90,.18) 100%);pointer-events:none"></div>

    <div style="position:absolute;left:30px;top:26px;width:372px;bottom:62px;display:flex;flex-direction:column;align-items:flex-start">
      <div style="font:700 19px/1 ${BODY};letter-spacing:.24em;color:${C.red};text-transform:uppercase">Pip's Family Kitchen</div>
      <div style="font:700 44px/1 ${DISP};color:${C.blue};text-transform:uppercase;margin:6px 0 2px;letter-spacing:.01em">Kids' Menu</div>
      <div style="font:800 16px/1.2 ${BODY};color:${C.soft};margin-bottom:22px">Ages 12 and under. Movie included.</div>
      ${pic}
    </div>
    ${f.D?`<div style="position:absolute;left:30px;width:372px;bottom:66px;box-sizing:border-box;background:#fff;border:3px solid ${C.red};border-radius:10px;padding:10px 14px 11px;box-shadow:3px 3px 0 ${C.yellow}">
      <div style="font:800 15px/1 ${BODY};letter-spacing:.2em;color:${C.red}">TONIGHT'S STORY</div>
      <div data-fit="story" style="font:700 16px/1.3 ${BODY};color:${C.ink};margin-top:6px">${esc(sentence(f.D))}</div></div>`:""}

    <div style="position:absolute;left:432px;top:26px;right:30px;bottom:178px;display:flex;flex-direction:column">
     <div style="position:relative;flex:none">
      <div style="font:800 18px/1 ${BODY};letter-spacing:.22em;color:${C.red};text-transform:uppercase">Tonight's movie night menu, inspired by</div>
      <div data-fit="title" style="font:700 ${tsz}px/1 ${DISP};color:${C.ink};text-transform:uppercase;letter-spacing:.005em;margin:10px 180px 0 0;line-height:1.08;max-height:${Math.round(tsz*2.2)}px;overflow:hidden">${esc(f.title)}</div>
      ${tag?`<div data-fit="tag" style="font:800 22px/1.25 ${BODY};color:${C.blue};margin:10px 260px 0 0">${esc(sentence(tag))}</div>`:""}
      <div style="position:absolute;right:0;top:-4px;width:150px;height:150px;border-radius:50%;background:${C.yellow};box-shadow:0 0 0 5px #fff,0 0 0 8px ${C.red};display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(8deg);text-align:center">
        <div style="font:800 15px/1.1 ${BODY};letter-spacing:.14em;color:${C.ink}">NOW SHOWING</div>
        <div style="font:700 46px/1 ${DISP};color:${C.red};margin:4px 0">${esc(f.year)}</div>
        <div style="font:800 15px/1.1 ${BODY};letter-spacing:.14em;color:${C.ink}">KIDS EAT FREE*</div>
      </div>
     </div>
     <div data-fit="menu" style="flex:1;min-height:0;margin-top:26px;width:590px;column-count:2;column-gap:32px;column-fill:balance;overflow:hidden">${courses}</div>
    </div>

    <div style="position:absolute;left:432px;width:600px;bottom:66px;height:96px;background:${C.blue};border-radius:10px;display:flex;align-items:center;color:#fff;box-sizing:border-box;overflow:hidden">
      <div style="width:120px;align-self:stretch;border-right:3px dashed rgba(255,255,255,.6);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none">
        <div style="font:800 14px/1.1 ${BODY};letter-spacing:.18em">ADMIT</div><div style="font:700 30px/1 ${DISP};color:${C.yellow}">ONE KID</div></div>
      <div style="padding:0 20px">
        <div style="font:800 15px/1 ${BODY};letter-spacing:.2em;color:${C.yellow}">SHOWTIME CUE</div>
        <div data-fit="cue" style="font:700 ${cue.length>95?17:19}px/1.25 ${BODY};margin-top:6px">${esc(sentence(cue))}</div></div>
    </div>

    <div style="position:absolute;right:30px;top:214px;width:${N*cell}px;bottom:66px">
      <div style="font:700 26px/1 ${DISP};color:${C.red};text-transform:uppercase">Word Search</div>
      <div style="font:800 15px/1.25 ${BODY};color:${C.soft};margin:6px 0 10px">Find tonight's words, across and down.</div>
      ${grid}
      <div style="display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:12px;font:800 15px/1.2 ${BODY};color:${C.ink};letter-spacing:.06em">${ws.placed.map(w=>`<span>${w}</span>`).join("")}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;background:${C.yellow};border-radius:8px;padding:14px 16px 12px;transform:rotate(-1.5deg);box-shadow:0 2px 6px rgba(29,42,82,.2)">
        <div style="font:700 21px/1 ${DISP};color:${C.ink};text-transform:uppercase;white-space:nowrap">Clean Plate Club</div>
        <div style="font:700 15px/1.3 ${BODY};color:${C.ink};margin:6px 0 8px">Tick each one you finish, then ask for your sticker.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;font:800 15px/1 ${BODY};color:${C.ink}">${lab.filter((l,j)=>(menu[keys[j]]||[]).length).map(l=>`<span style="display:flex;align-items:center;gap:7px"><i style="width:16px;height:16px;border:2.5px solid ${C.ink};border-radius:3px;background:#fff;flex:none"></i>${l}</span>`).join("")}</div>
      </div>
    </div>

    <div style="position:absolute;left:30px;right:30px;bottom:22px;font:700 15px/1.2 ${BODY};color:${C.soft};display:flex;justify-content:space-between;gap:20px;white-space:nowrap">
      <span>*With a grown-up's meal. Prices subject to change. Every drink at this table is alcohol-free. Crayons not needed, pencils at the counter.</span>
      <span>Form KM-${esc(f.year)}${hasStill?" / Stills: TMDB":" / Poster: TMDB"}</span>
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
  const t=el.querySelector('[data-fit="title"]');
  if(t)shrink('[data-fit="title"]',t,36);
  const c=el.querySelector('[data-fit="cue"]');
  if(c&&c.parentNode.parentNode)shrink('[data-fit="cue"]',c.parentNode.parentNode,14);
}

const api={card:genreCard,fit:genreFit,size:[W,H]};
(window.GENRE=window.GENRE||{}).kids=api;
})();
