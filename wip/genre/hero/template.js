/* Genre menu template: hero.
   Venue: a city newsstand lunch counter that prints its menu as a newspaper front page.
   genreCard(f, menu, poster, stills) returns two US Letter faces (816 x 1056): the front page (masthead, banner
   headline, a TMDB still across a third of the page, the counterman's note, the late bulletin) and Page 2
   (the full menu as newspaper sections, with a second still). Inline styles only.
   f: film record ({title, year, T tagline, D description, P showtime cue}; pass the edition tagline and cue in T and P when one exists)
   menu: {s, m, w, d} arrays of {n, note}
   poster: TMDB poster path ("/abc.jpg") or null
   stills: data/film-stills.json entry for the film ([[path, w, h, lang], ...]) or undefined */
(function(root){
const W=816,H=1056,PX=40,PY=30,IW=W-2*PX,G=26,CW=(IW-2*G)/3;
const C={paper:"#f2ecde",ink:"#1b1a17",red:"#c3241a",soft:"#5d584f"};
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

/* newsprint: warm stock, fine grain, soft vignette and the fold across the middle */
const NOISE="url('data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .12 0 0 0 0 .1 0 0 0 0 .07 0 0 0 .13 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>").replace(/'/g,"%27")+"')";
const PAPER=`background:${NOISE},linear-gradient(180deg,transparent 49.5%,rgba(90,70,40,.09) 50%,rgba(255,255,255,.22) 50.3%,transparent 51%),radial-gradient(ellipse 80% 75% at 50% 46%,rgba(255,252,240,.35) 0%,rgba(255,252,240,0) 55%,rgba(128,100,52,.22) 100%),${C.paper};background-size:260px 260px,100% 100%,100% 100%`;
const face=(n,inner)=>`<div data-face="${n}" style="position:relative;width:${W}px;height:${H}px;box-sizing:border-box;padding:${PY}px ${PX}px;${PAPER};color:${C.ink};overflow:hidden">${inner}</div>`;
const fine=(year,right)=>`<div style="display:flex;justify-content:space-between;gap:16px;padding-top:6px;border-top:1px solid ${C.ink};font-family:${FB};font-size:15px;line-height:19px;color:${C.soft}">
      <span>Prices subject to change. Printed at the counter every morning. Form DS-${esc(year)}.</span><span style="white-space:nowrap">${right}</span></div>`;

function genreCard(f,menu,poster,stills){
  const year=String(f.year||"");
  const courses=[["s",0],["m",1],["w",2],["d",3]].map(([k,i])=>({label:LAB[i],sec:i,items:(menu&&menu[k]||[]).filter(x=>x&&x.n)})).filter(c=>c.items.length);
  const list=[];courses.forEach((c,ci)=>c.items.forEach((it,ii)=>list.push({ci,ii})));
  const [s1,s2]=pickStills(stills);
  const stillN=i=>{const v=pickStills.nth(stills,i);return v?IMG+"w1280"+v:null};
  const pic1=s1?IMG+"w1280"+s1:poster?IMG+"w780"+poster:null;
  const pic2=s2?IMG+"w1280"+s2:poster?IMG+"w780"+poster:pic1;
  const isPoster=u=>u&&u.includes("/w780");
  const photo=(src,w,h,alt,pos)=>`<div style="width:${w}px;height:${h}px;border:1px solid ${C.ink};box-sizing:border-box;overflow:hidden;background:${C.ink}">
    ${src?`<img crossorigin="anonymous" src="${esc(src)}" alt="${esc(alt)}" style="width:100%;height:100%;object-fit:${isPoster(src)?"contain":"cover"};object-position:50% ${pos};display:block">`:""}</div>`;
  const pick=k=>{const c=courses.find(c=>c.sec===k);return c?clean(c.items[0].n):""};

  /* ---------- front page ---------- */
  const MAST=138;
  const B=banner(f.title||"",104);
  const tag=clean(f.T);
  const deckZ=25,deckL=tag?wrap(sentence(tag),IW-40,s=>sw(s,deckZ,1)).length:0;
  const HEAD=30+B.lines.length*Math.ceil(B.size*1.08)+(deckL?17+deckL*Math.round(deckZ*1.25):0)+12;
  const FOOT=40;
  const BODY=H-PY*2-MAST-HEAD-FOOT;
  const capText=sentence(f.D),capZ=17;
  const capL=wrap("SCENE OF THE ACTION. "+capText+" Photo: TMDB",IW,s=>sw(s,capZ)*1.04).length;
  const capH=8+capL*22+12;

  /* the counterman's note, built from the film's own tagline and dishes */
  const main=pick(1),sweet=pick(2),drink=pick(3),snack=pick(0);
  const noteTxt=[ "Big night on the corner, folks.",
    tag?sentence(tag):"",
    main?`On the grill: ${main}.`:snack?`Up first: ${snack}.`:"",
    sweet?`In the pie case: ${sweet}.`:"",
    drink?`${drink}, first one on the house.`:"",
    "Grab a paper and a stool." ].filter(Boolean).join(" ");
  const LW=2*CW+G,noteZ=18;
  const noteH=22+wrap(noteTxt,LW,s=>sw(s,noteZ,1)*1.04).length*24+6+40+26;
  const cue=sentence(f.P),cueZ=18;
  const cueH=cue?4+34+12+18+wrap(cue,CW-24,s=>sw(s,cueZ)*1.04).length*Math.ceil(cueZ*1.28)+4:0;
  const below=Math.max(noteH,cueH)+16;
  const P1=Math.max(240,Math.min(430,BODY-capH-below-10));

  const ear=(k,l1,l2)=>`<div style="width:132px;flex:none;border:1px solid ${C.ink};padding:7px 6px;box-sizing:border-box;text-align:center">
    <div style="font-family:${FB};font-size:14px;line-height:17px;font-weight:700;letter-spacing:.14em;color:${C.red}">${k}</div>
    <div style="font-family:${FB};font-size:15px;line-height:19px;color:${C.ink};margin-top:3px;white-space:nowrap">${l1}<br>${l2}</div></div>`;
  /* prop: the late edition slip the stand tucks over the corner of the photo (type only) */
  const slip=`<div style="position:absolute;right:14px;top:14px;transform:rotate(3deg);width:178px;background:#fbf7ec;border:1px solid ${C.ink};box-shadow:0 3px 8px rgba(40,30,15,.28);padding:8px 10px 9px;box-sizing:border-box;text-align:center;font-family:${FB};color:${C.ink}">
    <div style="border-top:2px solid ${C.red};border-bottom:2px solid ${C.red};padding:3px 0;font-family:${FD};font-weight:700;font-size:24px;line-height:28px;color:${C.red};letter-spacing:.04em">LATE EDITION</div>
    <div style="font-size:15px;line-height:19px;margin-top:5px">Hot off the grill<br>Full menu inside</div>
    <div style="font-family:${FD};font-weight:700;font-size:26px;line-height:30px;margin-top:2px">5 CENTS</div></div>`;

  const front=face("front",`
  <header style="height:${MAST}px;box-sizing:border-box">
    <div style="display:flex;justify-content:space-between;align-items:center;height:88px;gap:10px">
      ${ear("LUNCH EDITION","Counter open","6 AM to late")}
      <div style="font-family:${FM};font-size:60px;line-height:1;color:${C.ink};white-space:nowrap;text-align:center;flex:1">The Daily Special</div>
      ${ear("WEATHER","Clear skies.","Look up.")}
    </div>
    <div style="border-top:1px solid ${C.ink};margin-top:8px;display:flex;justify-content:space-between;align-items:center;height:30px;font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.14em;color:${C.ink}">
      <span>VOL. ${esc(year.slice(-2))}, No. ${esc(year)}</span><span>CITY NEWSSTAND AND LUNCH COUNTER</span><span>FIVE CENTS</span></div>
    <div style="border-top:4px solid ${C.ink};border-bottom:1px solid ${C.ink};height:3px"></div>
  </header>
  <section style="height:${HEAD}px;box-sizing:border-box;padding-top:8px;text-align:center">
    <div style="display:flex;justify-content:space-between;font-family:${FB};font-size:18px;font-weight:700;letter-spacing:.2em;color:${C.red};height:22px;line-height:22px"><span>EXTRA! EXTRA!</span><span>TONIGHT'S FEATURE, ${esc(year)}</span></div>
    <h1 style="margin:4px 0 0;font-weight:700;font-family:${FD};font-size:${B.size}px;line-height:1.06;letter-spacing:-.005em;color:${C.ink};white-space:nowrap">${B.lines.map(esc).join("<br>")}</h1>
    ${tag?`<div style="border-top:1px solid ${C.ink};margin:8px 20px 0;padding-top:8px;font-family:${FB};font-style:italic;font-size:${deckZ}px;line-height:${Math.round(deckZ*1.25)}px;color:${C.ink}">${esc(sentence(tag))}</div>`:""}
  </section>
  <main style="height:${BODY}px">
    <div style="position:relative">${photo(pic1,IW,P1,`${f.title} (${year}) film still`,"38%")}${slip}</div>
    <div style="margin:8px 0 12px;font-family:${FB};font-size:${capZ}px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">SCENE OF THE ACTION.</b> <i>${esc(capText)}</i> <span style="font-size:14px;color:${C.soft};white-space:nowrap">Photo: TMDB</span></div>
    <div style="display:flex;border-top:3px solid ${C.ink};padding-top:12px">
      ${ruled(LW,true,`<div style="font-family:${FB};font-size:14px;line-height:18px;font-weight:700;letter-spacing:.16em;color:${C.red};margin-bottom:4px">A WORD FROM THE COUNTER</div>
        <div style="font-family:${FB};font-style:italic;font-size:${noteZ}px;line-height:24px;color:${C.ink}">${esc(noteTxt)}</div>
        <div style="display:flex;align-items:baseline;gap:12px;margin-top:4px;height:42px"><span style="font-family:${FS};font-size:24px;line-height:42px;color:#22305a">Sal</span><span style="font-family:${FB};font-size:15px;color:${C.soft}">Sal, behind the counter since the first edition</span></div>
        <div style="font-family:${FB};font-size:15px;line-height:20px;font-weight:700;letter-spacing:.14em;color:${C.red}">TODAY'S MENU: SECTIONS A TO D, PAGE 2</div>`)}
      ${ruled(CW,false,cue?`<div style="border:2px solid ${C.ink};background:rgba(255,253,246,.5)">
        <div style="background:${C.red};color:${C.paper};font-family:${FD};font-weight:700;font-size:24px;line-height:34px;height:34px;text-align:center;letter-spacing:.03em">STOP PRESS</div>
        <div style="padding:6px 11px 8px;font-family:${FB};color:${C.ink}"><div style="font-size:14px;line-height:18px;font-weight:700;letter-spacing:.16em;color:${C.red}">SHOWTIME CUE</div>
        <div style="font-size:${cueZ}px;line-height:${Math.ceil(cueZ*1.28)}px">${esc(cue)}</div></div></div>`:"")}
    </div>
  </main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${fine(year,"Read it. Eat it. Fold it.")}</footer>`);

  /* ---------- Page 2 (and Page 3 only if needed): the menu, each page with its own still ---------- */
  const FOL=74,P2=H-2*PY-FOL-FOOT-14,SAFE2=P2-16;
  const cap2L=wrap("ON THE BEAT. Another look from tonight's feature. Photo: TMDB",IW,s=>sw(s,capZ)*1.04).length,cap2H=8+cap2L*22+14;
  const pages=[];let left=list;
  while(left.length&&pages.length<4){
    const last=pages.length>=1;let fit=null;
    /* a full-width still on top, then the menu in three balanced columns; the photo gives way before the type does */
    for(const tt of TIERS.slice(2,last?8:6)){
      for(const p of [360,330,300,270,240,210]){
        const r=balance(courses,left,[0,1,2].map(()=>({w:CW,h:SAFE2-p-cap2H})),tt);
        if(r){fit={t:tt,p,r};break}
      }
      if(fit)break;
    }
    if(!fit&&!last){const tt=TIERS[3],p=240;fit={t:tt,p,r:flow(courses,left,[0,1,2].map(()=>({w:CW,h:SAFE2-p-cap2H-CONT_H})),tt)}}
    if(!fit){const tt=TIERS[TIERS.length-1],p=150;fit={t:tt,p,r:balance(courses,left,[0,1,2].map(()=>({w:CW,h:99999})),tt)}}
    if(!fit.r.cols.some(c=>c.length))break;
    pages.push(fit);left=fit.r.rest||[];
  }
  const n=pages.length+1;
  const inner=pages.map((fit,k)=>{
    const t=fit.t,cols=fit.r.cols,pg=k+2,more=k<pages.length-1?redLine(`Continued on Page ${pg+1}`):"";
    const pic=k===0?pic2:(stillN(k+2)||pic2);
    const lastCol=cols[2].length?2:cols[1].length?1:0;
    return face("page-"+pg,`
  <header style="height:${FOL}px;box-sizing:border-box;border-bottom:4px solid ${C.ink};display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:8px">
    <span style="font-family:${FM};font-size:40px;line-height:1">The Daily Special</span>
    <span style="font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.16em;color:${C.red}">${k?`CONTINUED FROM PAGE ${pg-1}`:"THE LUNCH COUNTER MENU"}</span>
    <span style="font-family:${FD};font-weight:700;font-size:30px;line-height:1">PAGE ${pg}</span></header>
  <main style="height:${P2}px;padding-top:14px;box-sizing:border-box">
    ${photo(pic,IW,fit.p,`${f.title} (${year}) film still`,"40%")}
    <div style="margin:8px 0 14px;font-family:${FB};font-size:${capZ}px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">ON THE BEAT.</b> <i>Another look from tonight's feature.</i> <span style="font-size:14px;color:${C.soft};white-space:nowrap">Photo: TMDB</span></div>
    <div style="display:flex">${cols.map((c,i)=>ruled(CW,i===0,columnHTML(f,courses,c,t,CW)+(i===lastCol?more:""))).join("")}</div>
  </main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${fine(year,`Page ${pg} of ${n}`)}</footer>`);
  }).join("");
  return `<link rel="stylesheet" href="${FONTS}">`+front+inner;
}
root.genreCard=genreCard;root.genreCardHero=genreCard;
})(typeof window!=="undefined"?window:globalThis);
