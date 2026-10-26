/* Genre menu template: hero.
   Venue: a city newsstand lunch counter that prints its menu as a newspaper front page.
   genreCard(f, menu, poster, stills) returns two US Letter faces (816 x 1056): the front page (masthead, banner
   headline, a TMDB still across a third of the page, the counterman's note, the late bulletin) and Page 2
   (the full menu as newspaper sections, with a second still). Inline styles only.
   Per-film lift: optional 5th argument x = {logo, palette, flavour}, the film's entries from data/film-logos.json
   ([path, w, h]), data/film-palette.json ({dark, accent}) and data/film-flavour.json ({venue, sign, note, winks, prop, number}).
   Each part falls back to the genre default when missing.
   f: film record ({title, year, T tagline, D description, P showtime cue}; pass the edition tagline and cue in T and P when one exists)
   menu: {s, m, w, d} arrays of {n, note}
   poster: TMDB poster path ("/abc.jpg") or null
   stills: data/film-stills.json entry for the film ([[path, w, h, lang], ...]) or undefined */
(function(root){
const W=816,H=1056,PX=40,PY=30,IW=W-2*PX,G=26,CW=(IW-2*G)/3;
const C={paper:"#f2ecde",ink:"#1b1a17",red:"#c3241a",soft:"#5d584f",head:"#1b1a17"};
const GENRE_RED="#c3241a";
/* contrast against the newsprint; accents that are too light get darkened until they read */
const hex=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const lum=c=>{const v=c.map(x=>{x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const toHex=c=>"#"+c.map(x=>Math.round(x).toString(16).padStart(2,"0")).join("");
function inkFor(h,min){
  let c=hex(h);if(!c)return null;const P=hex(C.paper);
  const sat=Math.max(...c)-Math.min(...c);if(sat<40)return null;   /* grey accents carry no film colour */
  for(let i=0;i<12&&ratio(c,P)<min;i++)c=c.map(x=>x*.85);
  return ratio(c,P)>=min?toHex(c):null;
}
const FD="'Oswald','Arial Narrow',Impact,sans-serif";
const FS="'Homemade Apple',cursive";
const FB="'Source Serif 4',Georgia,'Times New Roman',serif";
const FM="'UnifrakturMaguntia','Old English Text MT',serif";
const FONTS="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Homemade+Apple&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=UnifrakturMaguntia&display=swap";
const IMG="https://image.tmdb.org/t/p/";
const LAB=(typeof COURSE_LABEL!=="undefined"&&COURSE_LABEL.hero)||["Origin snacks","Main event","Sweet victory","Power-up"];
const SEC=["A","B","C","D"];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=s=>String(s||"").replace(/\s*[\u2013\u2014]\s*/g,", ").replace(/\s+/g," ").trim();
const sentence=s=>{s=clean(s);if(!s)return "";s=s[0].toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};

/* width estimates (em per character); they run 5 to 10 percent wide of the real faces, so text always has room */
/* Oswald 700, uppercase; measured against canvas, about 3 percent wide */
const gw=(s,z)=>{let w=0;for(const ch of s.toUpperCase())w+=" ".includes(ch)?.24:".,:;'!".includes(ch)?.25:"IJ1".includes(ch)?.3:"MW".includes(ch)?.72:"&".includes(ch)?.6:.54;return w*z};
const sw=(s,z,it)=>{let w=0;for(const ch of s)w+=" .,;:'!i".includes(ch)?.27:"lfjtr".includes(ch)?.33:/[A-Z]/.test(ch)?(ch==="M"||ch==="W"?.9:.66):/[mw]/.test(ch)?.78:/[0-9]/.test(ch)?.52:.5;return w*z*(it?.93:1)};
function wrap(text,maxW,meas){
  const words=clean(text).split(" ").filter(Boolean);if(!words.length)return [];
  const lines=[];let cur="";
  for(const w of words){const t=cur?cur+" "+w:w;if(cur&&meas(t)>maxW){lines.push(cur);cur=w}else cur=t}
  lines.push(cur);return lines;
}

/* the banner headline: one line when it can be big, else two balanced lines */
function banner(title,max){
  const t=clean(title).toUpperCase(),one=gw(t,1);
  const s1=(IW-4)/one;
  if(s1>=72||!t.includes(" "))return {lines:[t],size:Math.floor(Math.max(44,Math.min(max,s1)))};
  const ws=t.split(" ");let best=null;
  for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(" "),b=ws.slice(i).join(" "),m=Math.max(gw(a,1),gw(b,1));if(!best||m<best.m)best={a,b,m}}
  return {lines:[best.a,best.b],size:Math.floor(Math.max(44,Math.min(76,(IW-4)/best.m)))};
}

/* prices: a lunch counter in dollars and cents; the first main carries the film's year as its cents */
function price(f,ci,ii,name){
  const base=[3,7,4,2][ci]+(ii>1?1:0);
  if(ci===1&&ii===0&&/\d\d$/.test(String(f.year)))return base+"."+String(f.year).slice(-2);
  let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))>>>0;
  return base+"."+["25","40","50","65","75","95"][h%6];
}

/* type tiers, biggest first: dish name, description, course head. Tiers 0 to 4 keep STYLE-LOCK sizes; tier 5 (24/18) is the front-page squeeze; 6+ only on Page 2 */
const TIERS=[[30,21,38],[28,21,38],[28,20,36],[26,20,36],[26,19,34],[24,18,32],[22,17,30],[20,16,28]];
const ITEM_GAP=13,CONT_H=26;
const NARROW=300;
const headH=(t,cw)=>t[2]+23;
function itemH(it,cw,t){
  const [dz,nz]=t,pw=gw("0.00",dz)+14;
  const nl=wrap(it.n,cw-pw,s=>gw(s,dz)*.96).length; /* dish names set in Oswald 500, a touch narrower than the 700 table */
  const dl=it.note?wrap(sentence(it.note),cw,s=>sw(s,nz)).length:0;
  return nl*Math.ceil(dz*1.12)+(dl?4+dl*Math.ceil(nz*1.3):0)+ITEM_GAP;
}
const unitH=(courses,u,cw,t)=>itemH(courses[u.ci].items[u.ii],cw,t)+(u.ii===0?headH(t,cw):0);
/* fill columns in order; each course head travels with its first dish; a column that starts mid-course gets a "continued" line */
function flow(courses,list,slots,t,caps){
  const cols=slots.map(()=>[]);let k=0,used=0,i=0;
  for(;i<list.length;i++){
    let placed=false;
    while(k<slots.length){
      const u=list[i],h=unitH(courses,u,slots[k].w,t)+(used===0&&u.ii>0?CONT_H:0);
      if(used+h<=(caps?caps[k]:slots[k].h)){cols[k].push(u);used+=h;placed=true;break}
      k++;used=0;
    }
    if(!placed)break;
  }
  return {cols,rest:list.slice(i)};
}
/* smallest even bottom line: caps grow together until everything fits */
function balance(courses,list,slots,t,lead){
  const lo=lead||slots.map(()=>0);
  for(let T=0;T<=1100;T+=6){
    const caps=slots.map((s,i)=>Math.min(s.h,lo[i]+T));
    const r=flow(courses,list,slots,t,caps);
    if(!r.rest.length)return r;
    if(caps.every((c,i)=>c>=slots[i].h))return null;
  }
  return null;
}

function courseHead(label,sec,t,cw){
  if(cw<NARROW){
    const z=Math.min(t[2],Math.floor((cw-30)/(gw(label,1)*1.03)));
    return `<div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};display:flex;align-items:flex-end;justify-content:space-between;padding:5px 0 3px;margin-bottom:9px;height:${t[2]}px;line-height:1">
    <span style="font-family:${FD};font-weight:700;font-size:${z}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink};white-space:nowrap">${esc(label)}</span>
    <span style="font-family:${FD};font-weight:700;font-size:${z}px;line-height:1;color:${C.red}">${sec}</span></div>`;
  }
  return `<div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};display:flex;align-items:flex-end;justify-content:space-between;padding:5px 0 3px;margin-bottom:9px;height:${t[2]}px;line-height:1">
    <span style="font-family:${FD};font-weight:700;font-size:${t[2]}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink}">${esc(label)}</span>
    <span style="font-family:${FB};font-size:15px;line-height:1;font-weight:700;letter-spacing:.16em;color:${C.red};padding-bottom:5px">SECTION ${sec}</span></div>`;
}
function itemHTML(f,it,ci,ii,t){
  const [dz,nz]=t;
  return `<div style="margin-bottom:${ITEM_GAP}px">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.12;font-weight:500;text-transform:uppercase;letter-spacing:.005em;color:${C.ink}">${esc(clean(it.n))}</span>
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.12;font-weight:500;color:${C.red};white-space:nowrap">${price(f,ci,ii,it.n)}</span></div>
    ${it.note?`<div style="font-family:${FB};font-size:${nz}px;line-height:1.3;color:${C.ink};margin-top:4px">${esc(sentence(it.note))}</div>`:""}</div>`;
}
const redLine=(txt)=>`<div style="font-family:${FB};font-size:15px;line-height:18px;font-weight:700;letter-spacing:.14em;color:${C.red};text-transform:uppercase;margin-bottom:8px">${esc(txt)}</div>`;
function columnHTML(f,courses,col,t,cw){
  return col.map((u,j)=>{
    const c=courses[u.ci];let s="";
    if(j===0&&u.ii>0)s+=redLine(c.label+", continued");
    if(u.ii===0)s+=courseHead(c.label,SEC[c.sec],t,cw);
    return s+itemHTML(f,c.items[u.ii],c.sec,u.ii,t);
  }).join("");
}
const ruled=(w,first,inner)=>`<div style="width:${w}px;flex:none;box-sizing:content-box;${first?"":`margin-left:${G/2}px;padding-left:${G/2-1}px;border-left:1px solid ${C.ink};`}">${inner}</div>`;

/* stills arrive no-language first, then by votes: take the first two that are 1280 wide or more and landscape */
function pickStills(stills){
  const all=(stills||[]).filter(s=>s&&s[0]);
  const ok=all.filter(s=>(!s[1]||s[1]>=1280)&&(!s[2]||(s[1]/s[2]>1.55&&s[1]/s[2]<2.4))&&!s[3]).slice(0,8);
  const pool=ok.length?ok:all;
  return [pool[0]&&pool[0][0]||null,pool[1]&&pool[1][0]||null];
}
pickStills.nth=(stills,i)=>{const all=(stills||[]).filter(s=>s&&s[0]&&!s[3]&&(!s[1]||s[1]>=1280));return all[i]?all[i][0]:null};

/* newsprint: a real paper scan (newsprint.jpg, built from the shared paper grain), soft vignette and the fold across the middle */
const ASSETS=()=>typeof root.GENRE_HERO_ASSETS==="string"?root.GENRE_HERO_ASSETS:"wip/genre/hero/";
const PAPER=()=>`background:linear-gradient(180deg,transparent 49.4%,rgba(70,60,40,.13) 50%,rgba(255,255,255,.28) 50.35%,transparent 51.1%),radial-gradient(ellipse 85% 80% at 50% 46%,rgba(255,252,240,0) 60%,rgba(110,95,60,.20) 100%),url('${ASSETS()}newsprint.jpg') center/cover,${C.paper}`;
const face=(n,inner)=>`<div data-face="${n}" style="position:relative;width:${W}px;height:${H}px;box-sizing:border-box;padding:${PY}px ${PX}px;${PAPER()};color:${C.ink};overflow:hidden">${inner}</div>`;
const fine=(year,right,num)=>`<div style="display:flex;justify-content:space-between;gap:16px;padding-top:6px;border-top:1px solid ${C.ink};font-family:${FB};font-size:15px;line-height:19px;color:${C.soft}">
      <span>Prices subject to change. Printed at the counter every morning. Form DS-${esc(num||year)}.</span><span style="white-space:nowrap">${right}</span></div>`;

function genreCard(f,menu,poster,stills,x){
  x=x||{};const fl=x.flavour||null,logo=x.logo||null,pal=x.palette||{};
  C.red=inkFor(pal.accent,4.8)||GENRE_RED;
  const dk=hex(pal.dark);C.head=dk&&ratio(dk,hex(C.paper))>=9?pal.dark:C.ink;
  const year=String(f.year||"");
  const num=clean(fl&&fl.number)||year;
  const venue=clean(fl&&fl.venue)||"The Daily Special";
  const sign=clean(fl&&fl.sign).toUpperCase()||"CITY NEWSSTAND AND LUNCH COUNTER";
  const winks=(fl&&fl.winks||[]).map(clean).filter(Boolean);
  const courses=[["s",0],["m",1],["w",2],["d",3]].map(([k,i])=>({label:LAB[i],sec:i,items:(menu&&menu[k]||[]).filter(x=>x&&x.n)})).filter(c=>c.items.length);
  const list=[];courses.forEach((c,ci)=>c.items.forEach((it,ii)=>list.push({ci,ii})));
  const [s1,s2]=pickStills(stills);
  const stillN=i=>{const v=pickStills.nth(stills,i);return v?IMG+"w1280"+v:null};
  const pic1=s1?IMG+"w1280"+s1:poster?IMG+"w780"+poster:null;
  const pic2=s2?IMG+"w1280"+s2:poster?IMG+"w780"+poster:pic1;
  const isPoster=u=>u&&u.includes("/w780");
  /* press photo: full colour, a touch of contrast, a fine halftone screen on top and a hairline frame */
  const photo=(src,w,h,alt,pos)=>`<div style="position:relative;width:${w}px;height:${h}px;border:1px solid ${C.ink};box-sizing:border-box;overflow:hidden;background:${C.ink}">
    ${src?`<img crossorigin="anonymous" src="${esc(src)}" alt="${esc(alt)}" style="width:100%;height:100%;object-fit:${isPoster(src)?"contain":"cover"};object-position:50% ${pos};display:block;filter:contrast(1.07) saturate(.94)">`:""}
    <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(20,16,10,.55) 22%,transparent 26%);background-size:3px 3px;mix-blend-mode:multiply;opacity:.16"></div>
    <div style="position:absolute;inset:0;box-shadow:inset 0 0 0 4px rgba(242,236,222,.0),inset 0 0 40px rgba(0,0,0,.18)"></div></div>`;
  const pick=k=>{const c=courses.find(c=>c.sec===k);return c?clean(c.items[0].n):""};

  /* ---------- front page ---------- */
  const MAST=136;
  /* the film's own title logo in its own colours, on a panel that suits it: dark panel for light logos, white panel for dark ones */
  let LG=null;
  if(logo&&logo[0]&&logo[1]&&logo[2]){const a=logo[1]/logo[2];let h=Math.min(a<4?104:86,(IW-48)/a);if(h>=44&&a>=1.1)LG={src:IMG+"original"+logo[0],h:Math.round(h),w:Math.round(h*a)}}
  /* x.logoTone.panel comes from logo-tone.json: the panel (dark, light or mid) on which the fewest logo pixels lose contrast */
  const panel=x.logoTone&&x.logoTone.panel||"dark";
  const darkPanel=panel!=="light";
  const panelBg=panel==="mid"?"#7d776c":darkPanel?(hex(pal.dark)&&lum(hex(pal.dark))<.04?pal.dark:"#151412"):"#fbf9f3";
  const B=banner(f.title||"",96);
  const tag=clean(f.T);
  const deckZ=22,deckL=tag?Math.min(2,wrap(sentence(tag),IW-40,s=>sw(s,deckZ,1)).length):0;
  const HEAD=8+22+8+(LG?LG.h+22:B.lines.length*Math.ceil(B.size*1.08))+(deckL?10+deckL*28:0)+10;
  const FOOT=36;
  const BODY=H-PY*2-MAST-HEAD-FOOT;
  const capZ=16,capH=30;

  const by=clean(fl&&fl.note&&fl.note.by)||"Sal";
  const main=pick(1),sweet=pick(2),drink=pick(3),snack=pick(0);
  const noteTxt=fl&&fl.note&&fl.note.text?sentence(fl.note.text):[ "Big night on the corner, folks.",
    main?`On the grill: ${main}.`:snack?`Up first: ${snack}.`:"",
    drink?`${drink}, first one on the house.`:"" ].filter(Boolean).join(" ");
  const LW=2*CW+G,cue=sentence(f.P);
  /* below the fold: try roomy type first, then tighter, so the photo keeps its 40 percent */
  let noteZ=18,cueZ=18,below=0;
  for(const z of [18,17,16,15]){
    noteZ=z;cueZ=z;
    const noteH=20+wrap(noteTxt,LW,s=>sw(s,z,1)*1.04).length*Math.ceil(z*1.3)+44;
    const cueH=cue?4+30+8+18+wrap(cue,CW-22,s=>sw(s,z)*1.04).length*Math.ceil(z*1.28)+6:0;
    below=Math.max(noteH,cueH)+22;
    if(BODY-capH-below>=456)break;
  }
  const P1=Math.max(456,Math.min(540,BODY-capH-below)); /* the front still runs 12px into each margin: 760 x 456 or more is over 40 percent of the face */

  /* prop: the film's own paper object (ticket, slip, card), type only, tucked over the corner of the photo */
  const pr=fl&&fl.prop&&fl.prop.title?fl.prop:{kind:"slip",title:"Late Edition",lines:["Hot off the grill","Full menu inside"]};
  const ptitle=clean(pr.title).toUpperCase(),plines=(pr.lines||[]).map(clean).filter(Boolean).slice(0,3);
  const tz=Math.max(16,Math.min(24,Math.floor(170/gw(ptitle,1))));
  const edge=pr.kind==="ticket"?`border:1px solid ${C.ink};border-left:3px dashed ${C.ink};border-right:3px dashed ${C.ink}`:pr.kind==="card"?`border:2px solid ${C.ink}`:`border:1px solid ${C.ink}`;
  const slip=`<div style="position:absolute;right:16px;bottom:18px;transform:rotate(${pr.kind==="card"?-2.5:3}deg);width:200px;background:#fbf7ec;${edge};box-shadow:0 4px 10px rgba(30,22,10,.35);padding:8px 12px 9px;box-sizing:border-box;text-align:center;font-family:${FB};color:${C.ink}">
    <div style="border-top:2px solid ${C.red};border-bottom:2px solid ${C.red};padding:3px 0;font-family:${FD};font-weight:700;font-size:${tz}px;line-height:${tz+4}px;color:${C.red};letter-spacing:.03em;white-space:nowrap">${esc(ptitle)}</div>
    <div style="font-size:15px;line-height:19px;margin-top:5px">${plines.map(esc).join("<br>")}</div>
    <div style="font-family:${FD};font-weight:700;font-size:22px;line-height:28px;margin-top:3px">${fl&&fl.number?`No. ${esc(fl.number)}`:"5 CENTS"}</div></div>`;

  const capsSm=`font-family:${FB};font-size:14px;line-height:18px;font-weight:700;letter-spacing:.16em`;
  const front=face("front",`
  <header style="height:${MAST}px;box-sizing:border-box">
    <div style="display:flex;justify-content:space-between;${capsSm};color:${C.ink};height:18px"><span>LUNCH EDITION <span style="color:${C.red}">&#9679;</span> FULL MENU INSIDE, PAGE 2</span><span>WEATHER: CLEAR. LOOK UP.</span></div>
    <div style="border-top:6px solid ${C.head};margin-top:5px"></div>
    <div style="height:72px;display:flex;align-items:center;justify-content:center;font-family:${FM};font-size:${Math.max(30,Math.min(70,Math.floor(700/(venue.length*.53))))}px;line-height:1;color:${C.head};white-space:nowrap;overflow:hidden">${esc(venue)}</div>
    <div style="background:${C.head};color:#f6f1e4;height:30px;display:flex;justify-content:space-between;align-items:center;padding:0 12px;font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.14em;white-space:nowrap;overflow:hidden">
      <span>VOL. ${esc(year.slice(-2))}, No. ${esc(num)}</span><span style="overflow:hidden;max-width:430px;${sign.length>30?"font-size:14px;letter-spacing:.06em":""}">${esc(sign.length>42?sign.slice(0,42).replace(/[ ,]+\S*$/,""):sign)}</span><span>FIVE CENTS</span></div>
    <div style="border-top:1px solid ${C.head};margin-top:3px"></div>
  </header>
  <section style="height:${HEAD}px;box-sizing:border-box;padding-top:8px;text-align:center">
    <div style="display:flex;justify-content:space-between;font-family:${FB};font-size:17px;font-weight:700;letter-spacing:.2em;color:${C.red};height:22px;line-height:22px"><span>EXTRA! EXTRA!</span><span>TONIGHT'S FEATURE, ${esc(year)}</span></div>
    ${LG?`<h1 style="margin:8px 0 0;height:${LG.h+22}px;box-sizing:border-box;padding:11px 0;background:${panelBg};${darkPanel?"":`border:2px solid ${C.head};`}font-size:0;line-height:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,${darkPanel?.08:0})"><img crossorigin="anonymous" src="${esc(LG.src)}" alt="${esc(f.title)}" style="height:${LG.h}px;width:${LG.w}px;object-fit:contain"></h1>`
      :`<h1 style="margin:8px 0 0;font-weight:700;font-family:${FD};font-size:${B.size}px;line-height:1.06;letter-spacing:-.005em;color:${C.head};white-space:nowrap">${B.lines.map(esc).join("<br>")}</h1>`}
    ${tag?`<div style="margin:10px 20px 0;font-family:${FB};font-style:italic;font-size:${deckZ}px;line-height:28px;height:${deckL*28}px;overflow:hidden;color:${C.ink}">${esc(sentence(tag))}</div>`:""}
  </section>
  <main style="height:${BODY}px">
    <div style="position:relative;margin:0 -12px">${photo(pic1,IW+24,P1,`${f.title} (${year}) film still`,"38%")}${slip}</div>
    <div style="display:flex;justify-content:space-between;gap:16px;height:${capH}px;align-items:center;font-family:${FB};font-size:${capZ}px;color:${C.ink};white-space:nowrap;overflow:hidden">
      <span><b style="letter-spacing:.06em">TONIGHT'S FEATURE.</b> <i>A still from tonight's picture, ${esc(year)}.</i></span><span style="font-size:14px;letter-spacing:.12em;color:${C.soft}">STAFF PHOTO / TMDB</span></div>
    <div style="display:flex;border-top:3px solid ${C.head};padding-top:10px">
      ${ruled(LW,true,`<div style="${capsSm};color:${C.red};margin-bottom:2px">${fl?`A WORD FROM ${esc(by.toUpperCase())}`:"A WORD FROM THE COUNTER"}</div>
        <div style="font-family:${FB};font-style:italic;font-size:${noteZ}px;line-height:${Math.ceil(noteZ*1.3)}px;color:${C.ink}">${esc(noteTxt)}</div>
        <div style="display:flex;align-items:center;gap:12px;height:42px;white-space:nowrap;overflow:hidden"><span style="font-family:${FS};font-size:${Math.min(24,Math.floor(330/Math.max(4,by.length*.75)))}px;line-height:42px;color:#22305a">${esc(by)}</span><span style="font-family:${FB};font-size:15px;color:${C.soft}">${fl?`at ${esc(venue)}`:"Sal, behind the counter"}</span></div>`)}
      ${ruled(CW,false,cue?`<div style="border:2px solid ${C.ink};background:rgba(255,253,246,.55)">
        <div style="background:${C.red};color:#f6f1e4;font-family:${FD};font-weight:700;font-size:22px;line-height:30px;height:30px;text-align:center;letter-spacing:.03em">STOP PRESS</div>
        <div style="padding:5px 10px 7px;font-family:${FB};color:${C.ink}"><div style="${capsSm};color:${C.red}">SHOWTIME CUE</div>
        <div style="font-size:${cueZ}px;line-height:${Math.ceil(cueZ*1.28)}px">${esc(cue)}</div></div></div>`:"")}
    </div>
  </main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${fine(year,"Read it. Eat it. Fold it.",num)}</footer>`);

  /* ---------- Page 2 (and Page 3 only if needed): the menu, each page with its own still ---------- */
  const FOL=74,P2=H-2*PY-FOL-FOOT-14,SAFE2=P2-16;
  let WH=0;
  const cap2=`Another frame from ${clean(f.title)}.`;
  const rest=winks.slice(0,5);
  const winksTxt=rest.length?"ALSO IN THIS EDITION: "+rest.map(w=>w.replace(/[.]$/,"")).join(". ")+".":"";
  const WL=winksTxt?wrap(winksTxt,IW,s=>sw(s,15)*1.06).length:0;WH=WL?WL*19+8:0;
  const winksLine=WL?`<div style="font-family:${FB};font-size:15px;line-height:19px;color:${C.soft};margin-bottom:8px"><b style="color:${C.red};letter-spacing:.1em">ALSO IN THIS EDITION:</b> ${esc(winksTxt.slice(22))}</div>`:"";
  const cap2L=wrap("ON THE BEAT. "+cap2+" STAFF PHOTO / TMDB",IW,s=>sw(s,capZ)*1.04).length,cap2H=8+cap2L*22+14;
  const pages=[];let left=list;
  while(left.length&&pages.length<6){
    const last=pages.length>=5;let fit=null;
    /* a full-width still on top, then the menu in three balanced columns; the photo gives way before the type does */
    for(const tt of TIERS.slice(2,last?8:6)){
      for(const p of [430,400,380,368]){
        const r=balance(courses,left,[0,1,2].map(()=>({w:CW,h:SAFE2-WH-p-cap2H})),tt);
        if(r){fit={t:tt,p,r};break}
      }
      if(fit)break;
    }
    if(!fit&&!last){const tt=TIERS[3],p=368;fit={t:tt,p,r:flow(courses,left,[0,1,2].map(()=>({w:CW,h:SAFE2-WH-p-cap2H-CONT_H})),tt)}}
    if(!fit){const tt=TIERS[TIERS.length-1],p=368;fit={t:tt,p,r:balance(courses,left,[0,1,2].map(()=>({w:CW,h:99999})),tt)}}
    if(!fit.r.cols.some(c=>c.length))break;
    pages.push(fit);left=fit.r.rest||[];
  }
  const n=pages.length+1;
  const inner=pages.map((fit,k)=>{
    const t=fit.t,cols=fit.r.cols,pg=k+2,more=k<pages.length-1?redLine(`Continued on Page ${pg+1}`):"";
    const pic=k===0?pic2:(stillN(k+2)||pic2);
    const lastCol=cols[2].length?2:cols[1].length?1:0;
    return face("page-"+pg,`
  <header style="height:${FOL}px;box-sizing:border-box;border-bottom:4px solid ${C.head};display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:8px;gap:14px">
    <span style="font-family:${FM};font-size:${Math.max(24,Math.min(40,Math.floor(330/(venue.length*.47))))}px;line-height:1;color:${C.head};white-space:nowrap">${esc(venue)}</span>
    <span style="font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.16em;color:${C.red}">${k?`CONTINUED FROM PAGE ${pg-1}`:"THE LUNCH COUNTER MENU"}</span>
    <span style="font-family:${FD};font-weight:700;font-size:30px;line-height:1">PAGE ${pg}</span></header>
  <main style="height:${P2}px;padding-top:14px;box-sizing:border-box">
    ${photo(pic,IW,fit.p,`${f.title} (${year}) film still`,"40%")}
    <div style="margin:8px 0 14px;font-family:${FB};font-size:${capZ}px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">ON THE BEAT.</b> <i>${esc(cap2)}</i> <span style="font-size:14px;letter-spacing:.12em;color:${C.soft};white-space:nowrap">STAFF PHOTO / TMDB</span></div>
    <div style="display:flex">${cols.map((c,i)=>ruled(CW,i===0,columnHTML(f,courses,c,t,CW)+(i===lastCol?more:""))).join("")}</div>
  </main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${winksLine}${fine(year,`Page ${pg} of ${n}`,num)}</footer>`);
  }).join("");
  return `<link rel="stylesheet" href="${FONTS}">`+front+inner;
}
root.genreCard=genreCard;root.genreCardHero=genreCard;
})(typeof window!=="undefined"?window:globalThis);
