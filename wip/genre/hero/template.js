/* Genre menu template: hero.
   Venue: a city newsstand lunch counter that prints its menu as a newspaper front page.
   genreCard(f, menu, poster, stills) returns the face HTML: one US Letter face (816 x 1056), plus a
   "Page 2" face only when the menu is too long for the front. Inline styles only.
   f: film record ({title, year, T tagline, D description, P showtime cue}; pass the edition tagline and cue in T and P when one exists)
   menu: {s, m, w, d} arrays of {n, note}
   poster: TMDB poster path ("/abc.jpg") or null
   stills: data/film-stills.json entry for the film ([[path, w, h, lang], ...]) or undefined */
(function(root){
const W=816,H=1056,PX=40,PY=30,IW=W-2*PX,G=26,CW=(IW-2*G)/3;
const C={paper:"#f2ecde",ink:"#1b1a17",red:"#c3241a",soft:"#5d584f"};
const FD="'League Gothic','Arial Narrow',Impact,sans-serif";
const FB="'Source Serif 4',Georgia,'Times New Roman',serif";
const FM="'UnifrakturMaguntia','Old English Text MT',serif";
const FONTS="https://fonts.googleapis.com/css2?family=League+Gothic&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=UnifrakturMaguntia&display=swap";
const IMG="https://image.tmdb.org/t/p/";
const LAB=(typeof COURSE_LABEL!=="undefined"&&COURSE_LABEL.hero)||["Origin snacks","Main event","Sweet victory","Power-up"];
const SEC=["A","B","C","D"];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=s=>String(s||"").replace(/\s*[–—]\s*/g,", ").replace(/\s+/g," ").trim();
const sentence=s=>{s=clean(s);if(!s)return "";s=s[0].toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};

/* width estimates (em per character); they run 5 to 10 percent wide of the real faces, so text always has room */
const gw=(s,z)=>{let w=0;for(const ch of s.toUpperCase())w+=" .,:;'!".includes(ch)?.19:"IJ1".includes(ch)?.24:"MW".includes(ch)?.55:"&".includes(ch)?.5:.395;return w*z};
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
  return {lines:[best.a,best.b],size:Math.floor(Math.max(44,Math.min(max-12,(IW-4)/best.m)))};
}

/* prices: a lunch counter in dollars and cents; the first main carries the film's year as its cents */
function price(f,ci,ii,name){
  const base=[3,7,4,2][ci]+(ii>1?1:0);
  if(ci===1&&ii===0&&/\d\d$/.test(String(f.year)))return base+"."+String(f.year).slice(-2);
  let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))>>>0;
  return base+"."+["25","40","50","65","75","95"][h%6];
}

/* type tiers, biggest first: dish name, description, course head. Tiers 0 to 4 keep STYLE-LOCK sizes; 5+ only on Page 2 */
const TIERS=[[30,21,38],[28,21,38],[28,20,36],[26,20,36],[26,19,34],[24,18,32],[22,17,30],[20,16,28]];
const ITEM_GAP=13,CONT_H=26;
const NARROW=300;
const headH=(t,cw)=>t[2]+23;
function itemH(it,cw,t){
  const [dz,nz]=t,pw=gw("0.00",dz)+14;
  const nl=wrap(it.n,cw-pw,s=>gw(s,dz)*1.03).length;
  const dl=it.note?wrap(sentence(it.note),cw,s=>sw(s,nz)).length:0;
  return nl*Math.ceil(dz*1.02)+(dl?4+dl*Math.ceil(nz*1.3):0)+ITEM_GAP;
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
    <span style="font-family:${FD};font-size:${z}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink};white-space:nowrap">${esc(label)}</span>
    <span style="font-family:${FD};font-size:${z}px;line-height:1;color:${C.red}">${sec}</span></div>`;
  }
  return `<div style="border-top:3px solid ${C.ink};border-bottom:1px solid ${C.ink};display:flex;align-items:flex-end;justify-content:space-between;padding:5px 0 3px;margin-bottom:9px;height:${t[2]}px;line-height:1">
    <span style="font-family:${FD};font-size:${t[2]}px;line-height:1;text-transform:uppercase;letter-spacing:.01em;color:${C.ink}">${esc(label)}</span>
    <span style="font-family:${FB};font-size:15px;line-height:1;font-weight:700;letter-spacing:.16em;color:${C.red};padding-bottom:5px">SECTION ${sec}</span></div>`;
}
function itemHTML(f,it,ci,ii,t){
  const [dz,nz]=t;
  return `<div style="margin-bottom:${ITEM_GAP}px">
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.02;text-transform:uppercase;letter-spacing:.012em;color:${C.ink}">${esc(clean(it.n))}</span>
      <span style="font-family:${FD};font-size:${dz}px;line-height:1.02;color:${C.red};white-space:nowrap">${price(f,ci,ii,it.n)}</span></div>
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

function pickStill(stills){
  if(!stills||!stills.length)return null;
  const ok=stills.filter(s=>s&&s[0]&&(!s[1]||s[1]>=1200)&&(!s[2]||s[1]/s[2]>1.5)&&!s[3]);
  return (ok[0]||stills[0])[0];
}

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
  const still=pickStill(stills);
  const pic=still?IMG+"w1280"+still:poster?IMG+"w780"+poster:null;
  const wide=!!still||!pic;

  /* fixed blocks */
  const MAST=138;
  const B=banner(f.title||"",wide?90:110);
  const tag=clean(f.T);
  const deckZ=25,deckL=tag?wrap(sentence(tag),IW-40,s=>sw(s,deckZ,1)).length:0;
  const HEAD=30+B.lines.length*Math.ceil(B.size*.94)+(deckL?17+deckL*Math.round(deckZ*1.25):0)+14;
  const cue=sentence(f.P);
  const FOOT=wide?128:44;
  const BODY=H-PY*2-MAST-HEAD-FOOT;
  const capText=sentence(f.D);

  let body="",rest=[],t=null;
  if(wide){
    /* the still runs across two columns; the lead column sits beside it and the other two run under it */
    const PWW=2*CW+G,capZ=17;
    const capL=pic?wrap("SCENE OF THE ACTION. "+capText+" Photo: TMDB",PWW,s=>sw(s,capZ)*1.04).length:0;
    const capH=pic?10+capL*22+14:0;
    let fit=null;
    for(const tt of TIERS.slice(0,5)){
      for(const p of (pic?[330,310,290,270,250,230,210]:[0])){
        const top=p+capH,under=BODY-top;if(under<60&&pic)continue;
        const slots=[{w:CW,h:BODY},{w:CW,h:under},{w:CW,h:under}];
        const r=balance(courses,list,slots,tt,[top,0,0]);
        if(r){fit={t:tt,p,r};break}
      }
      if(fit)break;
    }
    if(!fit){
      const tt=TIERS[3],p=pic?290:0,under=BODY-(p+capH)-CONT_H;
      const r=flow(courses,list,[{w:CW,h:BODY-CONT_H},{w:CW,h:under},{w:CW,h:under}],tt);
      fit={t:tt,p,r};rest=r.rest;
    }
    t=fit.t;const cols=fit.r.cols,more=rest.length?redLine("Continued on Page 2"):"";
    const lastCol=cols[2].length?2:cols[1].length?1:0;
    const colH=i=>columnHTML(f,courses,cols[i],t,CW)+(i===lastCol?more:"");
    body=`<div style="display:flex">
      <div style="width:${PWW}px;flex:none">
        ${pic?`<div style="width:${PWW}px;height:${fit.p}px;border:1px solid ${C.ink};box-sizing:border-box;overflow:hidden;background:#222">
          <img crossorigin="anonymous" src="${esc(pic)}" alt="${esc(f.title)} (${esc(year)}) film still" style="width:100%;height:100%;object-fit:cover;object-position:50% 38%;display:block"></div>
        <div style="margin:10px 0 14px;font-family:${FB};font-size:${capZ}px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">SCENE OF THE ACTION.</b> <i>${esc(capText)}</i> <span style="font-size:14px;color:${C.soft};white-space:nowrap">Photo: TMDB</span></div>`:""}
        <div style="display:flex">${ruled(CW,true,colH(1))}${ruled(CW,false,colH(2))}</div>
      </div>
      ${ruled(CW,false,colH(0))}
    </div>`;
  }else{
    /* the poster runs down the left like a front-page photo; the menu takes the right column, then the space under the poster */
    const PW=318,RW=IW-PW-G,capZ=17;
    const capL=wrap("NOW SHOWING. "+capText+" Poster: TMDB",PW,s=>sw(s,capZ)*1.04).length;
    const capH=10+capL*22+16;
    const cueZ=19,cueH=cue?90+wrap(cue,PW-28,s=>sw(s,cueZ)*1.04).length*Math.ceil(cueZ*1.28):0;
    let fit=null;
    for(const tt of TIERS.slice(0,5)){
      for(const p of [477,450,420,390,360,330,300]){
        if(p+capH+cueH>BODY)continue;
        const r=flow(courses,list,[{w:RW,h:BODY},{w:PW,h:BODY-p-capH-cueH}],tt);
        if(!r.rest.length){fit={t:tt,p,r};break}
      }
      if(fit)break;
    }
    if(!fit){
      const tt=TIERS[3],p=Math.max(240,Math.min(420,BODY-capH-cueH-80));
      const r=flow(courses,list,[{w:RW,h:BODY-CONT_H},{w:PW,h:BODY-p-capH-cueH-CONT_H}],tt);
      fit={t:tt,p,r};rest=r.rest;
    }
    t=fit.t;const cols=fit.r.cols,pw=Math.round(fit.p*2/3),more=rest.length?redLine("Continued on Page 2"):"";
    body=`<div style="display:flex;height:${BODY}px">
      <div style="width:${PW}px;flex:none">
        <div style="width:${pw}px;height:${fit.p}px;margin:0 auto;border:1px solid ${C.ink};box-sizing:border-box;overflow:hidden;background:#222">
          <img crossorigin="anonymous" src="${esc(pic)}" alt="${esc(f.title)} (${esc(year)}) film poster" style="width:100%;height:100%;object-fit:cover;display:block"></div>
        <div style="margin:10px 0 16px;font-family:${FB};font-size:${capZ}px;line-height:22px;color:${C.ink}"><b style="letter-spacing:.06em">NOW SHOWING.</b> <i>${esc(capText)}</i> <span style="font-size:14px;color:${C.soft};white-space:nowrap">Poster: TMDB</span></div>
        ${cue?`<div style="border:2px solid ${C.ink};background:rgba(255,253,246,.5);margin-bottom:18px">
          <div style="background:${C.red};color:${C.paper};font-family:${FD};font-size:30px;line-height:34px;height:34px;text-align:center">LATE BULLETIN</div>
          <div style="padding:6px 12px 8px;font-family:${FB};color:${C.ink}"><div style="font-size:14px;line-height:18px;font-weight:700;letter-spacing:.16em;color:${C.red}">SHOWTIME CUE</div>
          <div style="font-size:${cueZ}px;line-height:${Math.ceil(cueZ*1.28)}px">${esc(cue)}</div></div></div>`:""}
        ${columnHTML(f,courses,cols[1],t,PW)}${cols[1].length?more:""}
      </div>
      ${ruled(RW,false,columnHTML(f,courses,cols[0],t,RW)+(cols[1].length?"":more))}
    </div>`;
  }

  const ear=(k,l1,l2)=>`<div style="width:132px;flex:none;border:1px solid ${C.ink};padding:7px 6px;box-sizing:border-box;text-align:center">
    <div style="font-family:${FB};font-size:14px;line-height:17px;font-weight:700;letter-spacing:.14em;color:${C.red}">${k}</div>
    <div style="font-family:${FB};font-size:15px;line-height:19px;color:${C.ink};margin-top:3px;white-space:nowrap">${l1}<br>${l2}</div></div>`;

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
    <h1 style="margin:4px 0 0;font-weight:400;font-family:${FD};font-size:${B.size}px;line-height:.94;letter-spacing:.005em;color:${C.ink};white-space:nowrap">${B.lines.map(esc).join("<br>")}</h1>
    ${tag?`<div style="border-top:1px solid ${C.ink};margin:8px 20px 0;padding-top:8px;font-family:${FB};font-style:italic;font-size:${deckZ}px;line-height:${Math.round(deckZ*1.25)}px;color:${C.ink}">${esc(sentence(tag))}</div>`:""}
  </section>
  <main style="height:${BODY}px">${body}</main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px;height:${FOOT-14}px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px">
    ${cue&&wide?`<div style="display:flex;border:2px solid ${C.ink};height:80px;box-sizing:border-box;background:rgba(255,253,246,.5)">
      <div style="background:${C.red};color:${C.paper};width:140px;flex:none;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:${FD};font-size:32px;line-height:.95;text-align:center">LATE<br>BULLETIN</div>
      <div style="padding:6px 14px;display:flex;flex-direction:column;justify-content:center;font-family:${FB};color:${C.ink}">
        <div style="font-size:14px;line-height:18px;font-weight:700;letter-spacing:.16em;color:${C.red}">SHOWTIME CUE</div>
        <div style="font-size:${cue.length>104?17:20}px;line-height:1.24">${esc(cue)}</div></div>
    </div>`:""}
    ${fine(year,"Read it. Eat it. Fold it.")}
  </footer>`);
  if(!rest.length)return `<link rel="stylesheet" href="${FONTS}">`+front;

  /* Page 2: only when the menu is longer than the front page can hold */
  const P2=H-2*PY-74-44;
  let r2=null,t2=t;
  for(const tt of TIERS.slice(TIERS.indexOf(t))){r2=balance(courses,rest,[0,1,2].map(()=>({w:CW,h:P2})),tt);t2=tt;if(r2)break}
  if(!r2)r2=flow(courses,rest,[0,1,2].map(()=>({w:CW,h:P2})),t2);
  const page2=face("page-2",`
  <header style="height:74px;box-sizing:border-box;border-bottom:4px solid ${C.ink};display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:8px">
    <span style="font-family:${FM};font-size:40px;line-height:1">The Daily Special</span>
    <span style="font-family:${FB};font-size:15px;font-weight:700;letter-spacing:.16em;color:${C.red}">CONTINUED FROM PAGE 1</span>
    <span style="font-family:${FD};font-size:34px;line-height:1">PAGE 2</span></header>
  <main style="height:${P2}px;padding-top:14px;box-sizing:border-box;display:flex">${r2.cols.map((c,i)=>ruled(CW,i===0,columnHTML(f,courses,c,t2,CW))).join("")}</main>
  <footer style="position:absolute;left:${PX}px;right:${PX}px;bottom:${PY}px">${fine(year,"Page 2 of 2")}</footer>`);
  return `<link rel="stylesheet" href="${FONTS}">`+front+page2;
}
root.genreCard=genreCard;root.genreCardHero=genreCard;
})(typeof window!=="undefined"?window:globalThis);
