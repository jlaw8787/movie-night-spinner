/* Genre menu template: hero.
   Venue: a city newsstand lunch counter that prints its menu as a newspaper front page.
   genreCard(f, menu, poster, stills) returns one US Letter face (816 x 1056) as HTML. Inline styles only.
   f: film record ({title, year, T tagline, D description, P showtime cue}; pass the edition tagline and cue in T and P when one exists)
   menu: {s, m, w, d} arrays of {n, note}
   poster: TMDB poster path ("/abc.jpg") or null
   stills: data/film-stills.json entry for the film ([[path, w, h, lang], ...]) or undefined */
(function(root){
const W=816,H=1056,PX=40,PY=30,IW=W-2*PX,G=26;
const C={paper:"#f2ecde",ink:"#1b1a17",red:"#c3241a",soft:"#5d584f"};
const FD="'League Gothic','Arial Narrow',Impact,sans-serif";
const FB="'Source Serif 4',Georgia,'Times New Roman',serif";
const FM="'UnifrakturMaguntia','Old English Text MT',serif";
const FONTS="https://fonts.googleapis.com/css2?family=League+Gothic&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=UnifrakturMaguntia&display=swap";
const IMG="https://image.tmdb.org/t/p/";
const LAB=(typeof COURSE_LABEL!=="undefined"&&COURSE_LABEL.hero)||["Origin snacks","Main event","Sweet victory","Power-up"];
const SEC=["A","B","C","D"];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=s=>String(s||"").replace(/[–—]/g,", ").replace(/\s+/g," ").trim();
const sentence=s=>{s=clean(s);if(!s)return "";s=s[0].toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};

/* width estimates (em per character), calibrated against the real faces in the harness */
const gw=(s,z)=>{let w=0;for(const ch of s.toUpperCase())w+=" .,:;'!".includes(ch)?.19:"IJ1".includes(ch)?.24:"MW".includes(ch)?.55:"&".includes(ch)?.5:.395;return w*z};
const sw=(s,z,it)=>{let w=0;for(const ch of s)w+=" .,;:'!i".includes(ch)?.27:"lfjtr".includes(ch)?.33:/[A-Z]/.test(ch)?(ch==="M"||ch==="W"?.9:.66):/[mw]/.test(ch)?.78:/[0-9]/.test(ch)?.52:.5;return w*z*(it?.93:1)};
function wrap(text,maxW,meas){
  const words=clean(text).split(" ").filter(Boolean);if(!words.length)return [];
  const lines=[];let cur="";
  for(const w of words){const t=cur?cur+" "+w:w;if(cur&&meas(t)>maxW){lines.push(cur);cur=w}else cur=t}
  lines.push(cur);return lines;
}

/* the banner headline: one line when it can be big, else two balanced lines */
function banner(title){
  const t=clean(title).toUpperCase(),one=gw(t,1);
  const s1=Math.min(118,(IW-4)/one);
  if(s1>=76||!t.includes(" "))return {lines:[t],size:Math.max(50,Math.floor(Math.min(s1,118)))};
  const ws=t.split(" ");let best=null;
  for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(" "),b=ws.slice(i).join(" "),m=Math.max(gw(a,1),gw(b,1));if(!best||m<best.m)best={a,b,m}}
  return {lines:[best.a,best.b],size:Math.max(48,Math.floor(Math.min(100,(IW-4)/best.m)))};
}

/* prices: a lunch counter in cents; the first main carries the film's year as its cents */
function price(f,ci,ii,name){
  const base=[3,7,4,2][ci]+(ii>1?1:0);
  if(ci===1&&ii===0)return base+"."+String(f.year).slice(-2);
  let h=0;for(const ch of name)h=(h*31+ch.charCodeAt(0))>>>0;
  return base+"."+["25","40","50","65","75","95"][h%6];
}

/* type tiers, biggest first: dish name, description, course head */
const TIERS=[[30,21,38],[28,21,38],[28,20,36],[26,20,36],[26,19,34],[24,18,32],[22,17,30],[20,16,28]];
const ITEM_GAP=13,HEAD_PAD=16,CONT_H=24;
function itemH(it,cw,t){
  const [dz,nz]=t,pw=gw("0.00",dz)+14;
  const nl=wrap(it.n,cw-pw,s=>gw(s,dz)).length;
  const dl=it.note?wrap(sentence(it.note),cw,s=>sw(s,nz)).length:0;
  return nl*dz*1.02+(dl?4+dl*nz*1.3:0)+ITEM_GAP;
}
const headH=t=>t[2]*1.0+HEAD_PAD;
/* units: each course head travels with its first dish; later dishes can move to the next column */
function units(courses,cw,t){
  const u=[];
  courses.forEach((c,ci)=>c.items.forEach((it,ii)=>u.push({ci,ii,h:itemH(it,cw,t)+(ii===0?headH(t):0)})));
  return u;
}
/* fill columns in order; a column that starts mid-course gets a small "continued" line */
function pack(courses,slots,t,balance){
  const cols=slots.map(()=>[]);let k=0,used=0;
  const all=units(courses,slots[0].w,t),total=all.reduce((a,b)=>a+b.h,0);
  const cap=i=>balance?Math.min(slots[i].h,balance):slots[i].h;
  for(let i=0;i<all.length;i++){
    const u=units(courses,slots[Math.min(k,slots.length-1)].w,t)[i];
    let h=u.h+(used===0&&u.ii>0?CONT_H:0);
    while(k<slots.length&&used+h>cap(k)&&used>0){k++;used=0;h=u.h+(u.ii>0?CONT_H:0)}
    if(k>=slots.length||used+h>slots[k].h)return null;
    cols[k].push(u);used+=h;
  }
  return cols;
}
function balanced(courses,slots,t){
  const total=units(courses,slots[0].w,t).reduce((a,b)=>a+b.h,0);
  for(let b=Math.ceil(total/slots.length);b<=slots[0].h;b+=8){const r=pack(courses,slots,t,b);if(r)return r}
  return null;
}

function courseHead(label,sec,t,first){
  return `<div style="border-top:${first?3:3}px solid ${C.ink};border-bottom:1px solid ${C.ink};display:flex;align-items:baseline;justify-content:space-between;padding:5px 0 3px;margin-bottom:9px">
    <span style="font-family:${FD};font-size:${t[2]}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink}">${esc(label)}</span>
    <span style="font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.16em;color:${C.red}">SECTION ${sec}</span></div>`;
}
function itemHTML(f,it,ci,ii,t){
  const [dz,nz]=t;
  return `<div style="margin-bottom:${ITEM_GAP}px">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.02;text-transform:uppercase;letter-spacing:.012em;color:${C.ink}">${esc(clean(it.n))}</span>
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.02;color:${C.red};white-space:nowrap">${price(f,ci,ii,it.n)}</span></div>
    ${it.note?`<div style="font-family:${FB};font-size:${nz}px;line-height:1.3;color:${C.ink};margin-top:4px">${esc(sentence(it.note))}</div>`:""}</div>`;
}
function columnHTML(f,courses,col,t){
  return col.map((u,j)=>{
    const c=courses[u.ci];let s="";
    if(j===0&&u.ii>0)s+=`<div style="font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.14em;color:${C.red};text-transform:uppercase;height:${CONT_H-6}px;margin-bottom:6px">${esc(c.label)}, continued</div>`;
    if(u.ii===0)s+=courseHead(c.label,SEC[u.ci],t);
    return s+itemHTML(f,c.items[u.ii],u.ci,u.ii,t);
  }).join("");
}

function pickStill(stills){
  if(!stills||!stills.length)return null;
  const ok=stills.filter(s=>s&&s[0]&&(!s[1]||s[1]>=1200)&&(!s[2]||s[1]/s[2]>1.5)&&!s[3]);
  return (ok[0]||stills[0])[0];
}

function genreCard(f,menu,poster,stills){
  const year=String(f.year||"");
  const courses=[["s",0],["m",1],["w",2],["d",3]].map(([k,i])=>({label:LAB[i],items:(menu&&menu[k]||[]).filter(x=>x&&x.n)})).filter(c=>c.items.length);
  const still=pickStill(stills);
  const pic=still?IMG+"w1280"+still:poster?IMG+"w780"+poster:null;

  /* fixed blocks */
  const MAST=150;
  const B=banner(f.title||"");
  const tag=clean(f.T);
  const deckZ=25,deckL=tag?wrap(tag,IW-40,s=>sw(s,deckZ,1)).length:0;
  const HEAD=26+B.lines.length*Math.round(B.size*.94)+8+(deckL?deckL*Math.round(deckZ*1.25)+10:0)+16;
  const cue=clean(f.P);
  const FOOT=136;
  const BODY=H-PY*2-MAST-HEAD-FOOT;

  /* body layout: wide still across the page, or the poster down the left like a front-page photo */
  let body="",fit=null;
  const capText=sentence(f.D);
  if(still||!pic){
    const cw=(IW-2*G)/3;
    for(const t of TIERS){
      for(const ph of (pic?[350,330,310,290,270,250,230]:[0])){
        const capZ=17,capL=pic?wrap((still?"SCENE OF THE ACTION. ":"")+capText,IW,s=>sw(s,capZ)).length:0;
        const top=pic?ph+10+capL*22+16:0;
        const cols=balanced(courses,[0,1,2].map(()=>({w:cw,h:BODY-top})),t);
        if(cols){fit={t,ph,cols,capZ};break}
      }
      if(fit)break;
    }
    if(!fit)fit={t:TIERS[TIERS.length-1],ph:220,cols:[units(courses,cw,TIERS[TIERS.length-1])],capZ:16};
    const t=fit.t;
    body=`${pic?`<div style="width:${IW}px;height:${fit.ph}px;border:1px solid ${C.ink};box-sizing:border-box;overflow:hidden;background:#222">
        <img crossorigin="anonymous" src="${esc(pic)}" alt="${esc(f.title)} (${esc(year)}) film still" style="width:100%;height:100%;object-fit:cover;object-position:50% 35%;display:block;filter:contrast(1.04) saturate(1.04)"></div>
      <div style="display:flex;justify-content:space-between;gap:18px;margin:8px 0 16px;font-family:${FB};font-size:${fit.capZ}px;line-height:22px;color:${C.ink}">
        <span><b style="letter-spacing:.06em">SCENE OF THE ACTION.</b> <i>${esc(capText)}</i></span><span style="font-size:14px;color:${C.soft};white-space:nowrap">Photo: TMDB</span></div>`:""}
      <div style="display:flex;gap:0">${fit.cols.map((col,i)=>`<div style="width:${cw}px;${i?`margin-left:${G/2}px;padding-left:${G/2-1}px;border-left:1px solid ${C.ink};`:""}box-sizing:content-box">${columnHTML(f,courses,col,t)}</div>`).join("")}</div>`;
  }else{
    const PW=318,RW=IW-PW-G;
    for(const t of TIERS){
      for(const ph of [477,450,420,390,360,330]){
        const capZ=17,capL=wrap("NOW SHOWING. "+capText,PW,s=>sw(s,capZ)).length;
        const under=BODY-ph-10-capL*22-18;
        const cols=pack(courses,[{w:RW,h:BODY},{w:PW,h:under}],t,0);
        if(cols){fit={t,ph,cols,capZ,under};break}
      }
      if(fit)break;
    }
    if(!fit){const t=TIERS[TIERS.length-1];fit={t,ph:330,cols:[units(courses,RW,t),[]],capZ:16}}
    const t=fit.t,pw=Math.round(fit.ph*2/3);
    body=`<div style="display:flex;gap:0;height:${BODY}px">
      <div style="width:${PW}px;flex:none">
        <div style="width:${pw}px;height:${fit.ph}px;margin:0 auto;border:1px solid ${C.ink};box-sizing:border-box;overflow:hidden;background:#222">
          <img crossorigin="anonymous" src="${esc(pic)}" alt="${esc(f.title)} (${esc(year)}) film poster" style="width:100%;height:100%;object-fit:cover;display:block"></div>
        <div style="margin:8px 0 18px;font-family:${FB};font-size:${fit.capZ}px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">NOW SHOWING.</b> <i>${esc(capText)}</i> <span style="font-size:14px;color:${C.soft};white-space:nowrap">Poster: TMDB</span></div>
        ${columnHTML(f,courses,fit.cols[1],t)}
      </div>
      <div style="width:${RW}px;margin-left:${G/2}px;padding-left:${G/2-1}px;border-left:1px solid ${C.ink}">${columnHTML(f,courses,fit.cols[0],t)}</div>
    </div>`;
  }

  const noise=`url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .12 0 0 0 0 .1 0 0 0 0 .07 0 0 0 .11 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`;
  const bg=`${noise},linear-gradient(180deg,transparent 49.6%,rgba(90,70,40,.10) 50%,rgba(255,255,255,.25) 50.25%,transparent 50.9%),radial-gradient(ellipse 80% 75% at 50% 46%,rgba(255,252,240,.35) 0%,rgba(255,252,240,0) 55%,rgba(128,100,52,.20) 100%),${C.paper}`;
  const ear=(k,l1,l2)=>`<div style="width:136px;border:1px solid ${C.ink};padding:7px 8px;box-sizing:border-box;text-align:center;align-self:center">
    <div style="font-family:${FB};font-size:14px;font-weight:700;letter-spacing:.16em;color:${C.red}">${k}</div>
    <div style="font-family:${FB};font-size:15px;line-height:19px;color:${C.ink};margin-top:3px">${l1}<br>${l2}</div></div>`;

  return `<link rel="stylesheet" href="${FONTS}"><div data-face="hero" style="position:relative;width:${W}px;height:${H}px;box-sizing:border-box;padding:${PY}px ${PX}px;background:${bg};background-size:260px 260px,100% 100%,100% 100%;color:${C.ink};overflow:hidden">
  <header style="height:${MAST}px;box-sizing:border-box">
    <div style="display:flex;justify-content:space-between;align-items:center;height:96px">
      ${ear("LUNCH EDITION","Counter open","6 AM till the last show")}
      <div style="font-family:${FM};font-size:66px;line-height:1;color:${C.ink};white-space:nowrap;text-align:center;flex:1;padding-top:4px">The Daily Special</div>
      ${ear("WEATHER","Clear skies. Keep","an eye on the rooftops")}
    </div>
    <div style="border-top:1px solid ${C.ink};margin-top:8px;display:flex;justify-content:space-between;align-items:center;height:30px;font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.14em;color:${C.ink}">
      <span>VOL. ${esc(year.slice(-2))}, No. ${esc(year)}</span><span>CITY NEWSSTAND AND LUNCH COUNTER</span><span>FIVE CENTS</span></div>
    <div style="border-top:4px solid ${C.ink};border-bottom:1px solid ${C.ink};height:3px"></div>
  </header>
  <section style="height:${HEAD}px;box-sizing:border-box;padding-top:8px;text-align:center">
    <div style="display:flex;justify-content:space-between;font-family:${FB};font-size:18px;font-weight:700;letter-spacing:.2em;color:${C.red};height:22px;line-height:22px"><span>EXTRA! EXTRA!</span><span>TONIGHT'S FEATURE, ${esc(year)}</span></div>
    <h1 style="margin:4px 0 0;font-weight:400;font-family:${FD};font-size:${B.size}px;line-height:.94;letter-spacing:.005em;color:${C.ink};white-space:nowrap">${B.lines.map(esc).join("<br>")}</h1>
    ${tag?`<div style="border-top:1px solid ${C.ink};margin:8px 20px 0;padding-top:8px;font-family:${FB};font-style:italic;font-size:${deckZ}px;line-height:${Math.round(deckZ*1.25)}px;color:${C.ink}">${esc(sentence(tag))}</div>`:""}
  </section>
  <main style="height:${BODY}px;overflow:visible">${body}</main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px;height:${FOOT-12}px">
    <div style="display:flex;border:2px solid ${C.ink};height:84px;box-sizing:border-box;background:rgba(255,253,246,.55)">
      <div style="background:${C.red};color:${C.paper};width:150px;flex:none;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:${FD};font-size:32px;line-height:.95;text-align:center">LATE<br>BULLETIN</div>
      <div style="padding:8px 14px;display:flex;flex-direction:column;justify-content:center;font-family:${FB};color:${C.ink}">
        <div style="font-size:14px;font-weight:700;letter-spacing:.16em;color:${C.red}">SHOWTIME CUE</div>
        <div style="font-size:${cue.length>110?17:20}px;line-height:1.25">${esc(sentence(cue))}</div></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:6px;border-top:1px solid ${C.ink};font-family:${FB};font-size:15px;color:${C.soft}">
      <span>Prices subject to change. Printed at the counter every morning. Form DS-${esc(year)}.</span><span>Read it. Eat it. Fold it.</span></div>
  </footer>
</div>`;
}
root.genreCard=genreCard;root.genreCardHero=genreCard;
})(typeof window!=="undefined"?window:globalThis);
