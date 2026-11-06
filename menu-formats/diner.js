/* Format: diner. An all-night diner menu, two faces 816x1056 (cover, laminated menu), plus continued faces when a
   long menu would need type below the rule 4 minimums. Ported from the horror pilot (wip/genre/horror).
   Era sets the type pairing, sign, border and print: classic (1930s-40s, 1950s, 1960s) chrome diner with a script
   sign; retro (1970s, 1980s) neon gothic on a laminated card; modern (1990s, 2000s, modern) condensed sans, crisp card.
   Tone sets day or night and the wear: eerie, tense, gritty are night (eerie adds rain on the glass and a dead neon
   tube); warm, tender, playful, glossy, grand, scrappy are day (enamel sign, cream stock, warm photo).
   Layout fitting runs after the faces are mounted (fonts and logo loaded): logo plate, title, menu type levels,
   still growth, and flowing 2 item chunks onto continued faces. Inline styles only. No drawn art. */
(function(){
const SRC=(document.currentScript&&document.currentScript.src)||"";
const BASE=SRC.replace(/[^/]*$/,"")+"assets/diner/";
/* the fitter must wait for this stylesheet: fonts.load() resolves at once for a family whose @font-face is not known yet */
let CSS_READY=Promise.resolve();
if(!document.querySelector('link[data-fmt="diner"]')){const l=document.createElement("link");l.rel="stylesheet";l.dataset.fmt="diner";
  CSS_READY=new Promise(r=>{l.onload=r;l.onerror=r;setTimeout(r,4000)});
  CSS_READY.then(()=>FONTS.forEach(fn=>document.fonts.load(fn).catch(()=>0)));
  l.href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Oleo+Script:wght@400;700&family=Barlow+Condensed:wght@600;700&family=Barlow:wght@500;700&family=Libre+Franklin:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400;1,8..60,600&family=Homemade+Apple&display=swap";
  document.head.appendChild(l)}
const FONTS=['400 44px "League Gothic"','400 40px "Oleo Script"','700 40px "Oleo Script"','700 36px "Barlow Condensed"','600 18px "Barlow Condensed"','700 28px "Barlow"','500 18px "Barlow"',
  '600 18px "Libre Franklin"','700 28px "Libre Franklin"','400 20px "Source Serif 4"','600 20px "Source Serif 4"','italic 400 20px "Source Serif 4"','italic 600 20px "Source Serif 4"','400 22px "Homemade Apple"'];

const ESC=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const low=w=>/^(The|A|An) /.test(w)?w.charAt(0).toLowerCase()+w.slice(1):w;
const hex2=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h||"");if(!m)return null;const n=parseInt(m[1],16);return [n>>16&255,n>>8&255,n&255]};
const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const sat=([r,g,b])=>{const mx=Math.max(r,g,b)/255,mn=Math.min(r,g,b)/255,l=(mx+mn)/2;return mx===mn?0:(mx-mn)/(1-Math.abs(2*l-1))};
const mix=([r,g,b],t)=>"#"+[r,g,b].map(v=>Math.round(v+(255-v)*t).toString(16).padStart(2,"0")).join("");
const rgba=([r,g,b],a)=>`rgba(${r},${g},${b},${a})`;

const SANS="'Libre Franklin','Helvetica Neue',Arial,sans-serif",SERIF="'Source Serif 4',Georgia,serif",HAND="'Homemade Apple',cursive";
const ERA={
  classic:{disp:"'Oleo Script',Georgia,serif",dw:700,cw:.5,caps:false,head:"'Oleo Script',Georgia,serif",hw:700,hs:40,dish:SANS,ls:".01em",fb:"#c8102e"},
  retro:{disp:"'League Gothic',Impact,sans-serif",dw:400,cw:.41,caps:true,head:"'League Gothic',Impact,sans-serif",hw:400,hs:44,dish:SANS,ls:".05em",fb:"#c42f27"},
  modern:{disp:"'Barlow Condensed','Arial Narrow',sans-serif",dw:700,cw:.46,caps:true,head:"'Barlow Condensed','Arial Narrow',sans-serif",hw:700,hs:36,dish:"'Barlow',"+SANS,ls:".03em",fb:"#1f5f8b"}};
const eraOf=e=>/30s|40s|1950|1960/.test(e||"")?"classic":/1970|1980/.test(e||"")?"retro":"modern";
const PHOTO={eerie:"saturate(.82) hue-rotate(-8deg) brightness(.97)",tense:"contrast(1.14) saturate(.9)",gritty:"contrast(1.2) saturate(.62)",
  warm:"sepia(.12) saturate(1.1)",tender:"sepia(.1) saturate(.95) brightness(1.04)",playful:"saturate(1.25) contrast(1.05)",glossy:"saturate(1.15) contrast(1.08)",
  grand:"contrast(1.06) saturate(1.05)",scrappy:"grayscale(.3) contrast(1.15)"};
const ERAPHOTO={classic:e=>/30s|40s/.test(e)?"grayscale(1) sepia(.28) contrast(1.1) ":"sepia(.1) ",retro:()=>"",modern:()=>""};
const VOICE={
  eerie:{sub:"Coffee, pie and shelter from the storm.",note:"STORM NOTICE",noteTxt:w=>`Phone lines down since ten. Kitchen open till the lights go.${w?` Last seen out on the road: ${w}.`:" Bridge out past mile 13."}`,kick:"OPEN TILL THE STORM PASSES",fine:"Prices subject to change without notice, like everything after midnight.",foot:["Doors lock at 3:00 a.m.","Booth service till dawn"]},
  tense:{sub:"Coffee's hot. Keep your back to the wall.",note:"LAST CALL",noteTxt:w=>`Kitchen closes at 3:00 a.m. Pay at the register before you go.${w?` Somebody asked about ${w}.`:""}`,kick:"OPEN ALL NIGHT",fine:"Prices subject to change. Settle up before you leave.",foot:["Open all night","Pay at the register"]},
  gritty:{sub:"Coffee all night. Cash only.",note:"CASH ONLY",noteTxt:w=>`No checks, no tabs, no credit. The booth by the door is taken.${w?` Word around here: ${w}.`:""}`,kick:"OPEN ALL NIGHT",fine:"Prices subject to change. Cash only.",foot:["Open all night","Cash only"]}};
const DAY={sub:{warm:"Hot coffee, homemade pie, booths by the window.",tender:"Pie made fresh every morning.",playful:"Pie so good it ought to be a crime.",glossy:"Shakes, burgers and the best pie on the strip.",grand:"Fine diner fare, served all day.",scrappy:"Cheap coffee, honest pie."},
  note:{warm:"TODAY'S SPECIAL",tender:"PIE OF THE DAY",playful:"ASK ABOUT PIE",glossy:"TODAY'S SPECIAL",grand:"CHEF'S SPECIAL",scrappy:"TODAY'S SPECIAL"},
  kick:"SERVED ALL DAY",fine:"Prices subject to change. Pie while it lasts.",foot:["Open 6 a.m. to midnight","Booth service"]};
const NIGHT=t=>/eerie|tense|gritty/.test(t||"");
const SECTIONS_N=[["s","Before Midnight","to start"],["m","The Night Shift","off the grill"],["w","The Pie Case","under glass"],["d","Behind the Counter","to drink"]];
const SECTIONS_D=[["s","Starters","to begin"],["m","Blue Plates","hot and hearty"],["w","The Pie Case","baked today"],["d","The Fountain","to drink"]];

function titleSize(t,width,maxLines,hi,lo,cw){
  const words=String(t).toUpperCase().split(/\s+/);
  for(let s=hi;s>=lo;s-=2){const per=Math.floor(width/(s*cw));let lines=1,cur=0;
    for(const w of words){const L=w.length;if(L>per)lines+=Math.ceil(L/per)-1;if(cur&&cur+1+L>per){lines++;cur=L}else cur+=cur?1+L:L}
    if(lines<=maxLines)return s}
  return lo}
/* period prices: what the dish would have cost in the film's year (US CPI shape, 1990 = 1), with real menu endings */
const CPI=[[1880,.07],[1900,.065],[1915,.08],[1920,.15],[1930,.13],[1940,.11],[1950,.19],[1960,.23],[1970,.30],[1980,.63],[1990,1],[2000,1.32],[2010,1.68],[2020,1.98],[2025,2.4]];
function cpi(y){y=+y||1990;if(y<=CPI[0][0])return CPI[0][1];for(let i=1;i<CPI.length;i++){const [a,va]=CPI[i-1],[b,vb]=CPI[i];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return CPI[CPI.length-1][1]}
function periodPrice(base1990,year,seed){const x=base1990*cpi(year)*(0.88+((seed>>>3)%25)/100);
  if(x<.975)return String(Math.max(5,Math.round(x*20)*5))+"¢";
  const ends=x<10?[".95",".50",".25",".75"]:[".95",".50",".00"];const w=Math.floor(x);return w+ends[seed%ends.length]}
const PRICE={s:3.95,m:6.95,w:2.95,d:1.25};

let SEQ=0;
window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS.diner=ctx=>{
  const {f,menu,poster,flavour:fl,era,tone}=ctx,img=ctx.img||((p,s="w1280")=>p?`https://image.tmdb.org/t/p/${s}${p}`:"");
  const stills=(ctx.stills||[]).map(s=>Array.isArray(s)?s[0]:s).filter(Boolean);
  const E=ERA[eraOf(era)],ek=eraOf(era),night=NIGHT(tone),T=tone||"warm";
  /* the diner opened before the story: a film set in an earlier decade than its release (The Iron Giant's 1957, Stand by Me's 1959)
     says Est. one to eight years before that decade starts, never the release year; a diner in its own decade keeps the film's year */
  const eraD=+((String(era||"").match(/(\d{4})s/)||[])[1]||0),estYear=eraD&&eraD+10<=+f.year?eraD-1-(hash(f.title)%8):f.year;
  const V=night?VOICE[T]||VOICE.eerie:null;
  const token="d"+(++SEQ)+"-"+(hash(f.id||f.title)%9999);
  /* colour: the poster accent if it holds up on paper and in the dark, else the era's diner colour */
  const pa=hex2(ctx.palette&&ctx.palette.accent),ok=!!(pa&&lum(pa)>=.05&&lum(pa)<=.24&&sat(pa)>=.3);
  const c=ok?pa:hex2(night&&ek!=="modern"?"#c42f27":E.fb),red="#"+c.map(v=>v.toString(16).padStart(2,"0")).join("");
  let neon=mix(c,.3);for(let t=.3;lum(hex2(neon))<.2&&t<.8;t+=.1)neon=mix(c,t);
  const glow=`0 0 2px ${mix(c,.85)},0 0 8px ${neon},0 0 22px ${rgba(c,.8)},0 0 46px ${rgba(c,.55)}`;
  const K={night:"#0d1014",ink:"#161a20",paper:night?"#ebe6d8":ek==="modern"?"#fbfaf6":"#f4ead2",bone:"#d8d1bf",mute:"#5a5d63"};
  const yy=String(f.year||"").slice(-2).padStart(2,"0"),num=String(fl&&fl.number||"").replace(/\D/g,"");
  const price=(k,n)=>periodPrice(PRICE[k],f.year,hash(n));
  const special={};if(num.length===2&&menu.d&&menu.d[0]){const pv=String(price("d",menu.d[0].n)),d=pv.match(/^(\d+)\./);if(+num%5===0)special.d0=d?d[1]+"."+num:/¢$/.test(pv)?(+num)+"¢":pv}
  /* a film number only sets the cents of the special, on the period price, and only when it reads like a price ("1945" on a 1.25 main reads 1.45); one that does not ("1957") goes on the plate in the day note instead ("Plate No. 57.") */
  if((num.length===3||num.length===4)&&menu.m&&menu.m[0]){const pv=String(price("m",menu.m[0].n)),d=pv.match(/^(\d+)\./);if(d&&+num.slice(-2)%5===0)special.m0=d[1]+"."+num.slice(-2)}
  const W=fl&&fl.winks||[],venue=(fl&&fl.venue)||(night?"Last Light Diner":"Blue Plate Diner"),signTxt=fl&&fl.sign?ESC(fl.sign):"Route 13 &nbsp;/&nbsp; Mile 66";
  const photo=(ERAPHOTO[ek](era||"")+(PHOTO[T]||"")).trim();
  const wear=T==="gritty"||T==="scrappy"?1:T==="eerie"?.85:night?.6:.35;
  const tilt=T==="playful"||T==="scrappy"?1.8:1;
  const grain=`<div style="position:absolute;inset:0;background:url('${BASE}paper-grain.webp') center/cover;mix-blend-mode:multiply;opacity:${night?.55:.4};pointer-events:none"></div>`;
  const root=(role,bg,inner,over)=>`<div data-diner="${token}" data-role="${role}" style="position:relative;width:816px;height:1056px;overflow:hidden;background:${bg};box-sizing:border-box">${inner}${grain}${over||""}</div>`;
  const disp=s=>`font:${E.dw} ${s}px/1 ${E.disp};letter-spacing:${E.ls};${E.caps?"text-transform:uppercase;":""}`;

  /* the sign: neon tubes on a raceway at night (one dead tube when eerie), an enamel plate by day */
  function neonTxt(t,dead){let k=-1;
    if(dead){const idx=[...t].map((ch,i)=>/[A-Za-z]/.test(ch)?i:-1).filter(i=>i>0);k=idx.length?idx[hash(t)%idx.length]:-1}
    const lit=`color:#fff6f2;-webkit-text-stroke:1px ${neon};text-shadow:0 7px 7px rgba(0,0,0,.75),${glow}`,off=`color:#3a3536;-webkit-text-stroke:1px #5d5455;text-shadow:0 6px 6px rgba(0,0,0,.7)`;
    return `<span style="${lit}">`+[...t].map((ch,i)=>i===k?`<span style="${off}">${ESC(ch)}</span>`:ESC(ch)).join("")+"</span>"}
  const vText=E.caps?venue.toUpperCase():venue,vs=titleSize(vText,690,1,E.caps?96:84,44,E.cw);
  const signBox=night
    ?`<div style="position:absolute;left:34px;right:34px;top:54px;height:110px;border-radius:4px;background:linear-gradient(#1a1c21,#0c0d10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -2px 0 rgba(0,0,0,.6),0 10px 24px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;white-space:nowrap;${disp(vs)}">${neonTxt(vText,T==="eerie")}</div>`
    :`<div style="position:absolute;left:34px;right:34px;top:54px;height:110px;border-radius:${ek==="classic"?"55px":"6px"};background:${red};box-shadow:inset 0 2px 0 rgba(255,255,255,.25),inset 0 -3px 0 rgba(0,0,0,.25),0 8px 18px rgba(0,0,0,.28);outline:2px solid ${K.paper};outline-offset:-9px;display:flex;align-items:center;justify-content:center;white-space:nowrap;${disp(vs)};color:${K.paper};text-shadow:0 2px 0 rgba(0,0,0,.28)">${ESC(vText)}</div>`;
  const chrome=`linear-gradient(180deg,#f7f8fa 0%,#a9adb3 22%,#e9ebee 45%,#7d8288 70%,#d5d8dc 100%)`;
  const ks=Math.max(14,Math.min(18,Math.floor(728/(((fl&&fl.sign||"Route 13 / Mile 66").length+17)*.92))));
  const fg=night?K.bone:K.ink;

  /* ---------- front ---------- */
  const s0=stills[0],bgSrc=s0?img(s0,"w780"):poster?img(poster,"w342"):"";
  const backdrop=night
    ?`${bgSrc?`<img alt="" crossorigin="anonymous" src="${bgSrc}" style="position:absolute;left:-60px;top:-60px;width:936px;height:1176px;object-fit:cover;filter:blur(18px) brightness(.34) saturate(.6)">`:""}
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 18% 0%,rgba(190,210,235,.2),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 45%,transparent 40%,rgba(5,7,10,.85) 100%)"></div>
      ${T!=="tense"?`<div style="position:absolute;inset:0;background:url('${BASE}rain-glass.webp') center/cover;opacity:${T==="eerie"?.9:.55}"></div>`:""}`
    :`<div style="position:absolute;inset:0;background:radial-gradient(ellipse 120% 80% at 50% 40%,transparent 55%,rgba(90,70,40,.22) 100%)"></div>
      ${ek==="classic"?`<div style="position:absolute;left:0;right:0;top:0;height:16px;background:${chrome}"></div><div style="position:absolute;left:0;right:0;bottom:0;height:16px;background:${chrome}"></div>`
        :`<div style="position:absolute;left:0;right:0;top:0;height:12px;background:${red}"></div><div style="position:absolute;left:0;right:0;bottom:0;height:12px;background:${red}"></div>`}`;
  const sign=`<div style="position:absolute;left:0;right:0;top:26px;text-align:center;white-space:nowrap;font:600 ${ks}px/1 ${SANS};letter-spacing:.26em;color:${fg};opacity:.85;text-transform:uppercase">${signTxt}${/open/i.test(fl&&fl.sign||"")?"":` &nbsp;/&nbsp; ${night?"Open all night":"Open every day"}`}</div>
    ${signBox}
    <div style="position:absolute;left:0;right:0;top:176px;text-align:center;font:italic 400 21px/1 ${SERIF};color:${fg}">${ESC(night?V.sub:DAY.sub[T]||DAY.sub.warm)} Est. ${ESC(estYear)}.</div>`;
  const heroImg=s0?`<img alt="Still from ${ESC(f.title)} (${ESC(f.year)})" crossorigin="anonymous" src="${img(s0,"w1280")}" style="width:100%;height:100%;object-fit:cover;display:block;filter:${photo}">`
    :poster?`<img alt="" crossorigin="anonymous" src="${img(poster,"w342")}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(12px) brightness(.5)"><img alt="${ESC(f.title)} poster" crossorigin="anonymous" src="${img(poster,"w500")}" style="position:relative;height:100%;display:block;margin:0 auto;filter:${photo}">`
    :`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:40px;${disp(64)};line-height:1.05;color:${K.paper};white-space:normal">${ESC(f.title)}</div>`;
  const heroOld=`<div style="position:absolute;left:28px;top:208px;width:760px;padding:8px 8px 0;box-sizing:border-box;background:${night?K.paper:"#fff"};box-shadow:0 16px 36px rgba(0,0,0,${night?.65:.25})">
      <div style="position:relative;outline:2px solid ${red};outline-offset:-2px;height:470px;overflow:hidden;background:#222">${heroImg}</div>
      <div style="font:italic 400 17px/1 ${SERIF};color:${K.ink};padding:9px 4px 10px;display:flex;justify-content:space-between"><span>${night?"Channel 13, the late show. The set behind the counter stays on all night.":"On the set above the counter tonight."}</span><span style="font:700 14px/17px ${SANS};letter-spacing:.14em;color:${K.mute};font-style:normal">${s0?"STILL":"POSTER"}: TMDB</span></div></div>`;
  /* hero: the poster, whole (2:3), in a polaroid mat. A still rides beside it as the secondary photo. No poster: the old still hero. */
  const posterOn=!!poster,stillSrc=s0?img(s0,"w1280"):"";
  const matBg=night?K.paper:"#fff",matSh=`0 16px 36px rgba(0,0,0,${night?.65:.25})`;
  const hero=posterOn
    ?`<div style="position:absolute;left:28px;top:204px;width:496px;padding:8px 8px 0;box-sizing:border-box;background:${matBg};box-shadow:${matSh};transform:rotate(${-.6*tilt}deg)">
      <div style="position:relative;outline:2px solid ${red};outline-offset:-2px;height:720px;overflow:hidden;background:#222"><img alt="${ESC(f.title)} (${ESC(f.year)}) poster" crossorigin="anonymous" src="${img(poster,"w780")}" style="width:100%;height:100%;object-fit:contain;display:block"></div>
      <div style="font:italic 400 17px/1 ${SERIF};color:${K.ink};padding:8px 4px 8px;display:flex;justify-content:space-between;align-items:baseline"><span>Now showing</span><span style="font:700 14px/17px ${SANS};letter-spacing:.14em;color:${K.mute};font-style:normal">POSTER: TMDB</span></div></div>`
    :heroOld;
  const P=fl&&fl.prop,propAt=(L,T0,W0,R0)=>P?`<div style="position:absolute;left:${L}px;top:${T0}px;width:${W0}px;box-sizing:border-box;transform:rotate(${R0*tilt}deg);z-index:3;padding:10px 13px;box-shadow:0 8px 20px rgba(0,0,0,.45);${
      P.kind==="badge"?`background:${K.paper};border:2px solid ${red};outline:1px solid ${red};outline-offset:-7px;border-radius:10px;text-align:center`
      :P.kind==="receipt"?`background:#fbfaf6;border-top:1.5px dashed ${K.mute};border-bottom:1.5px dashed ${K.mute}`
      :`background:${night?K.paper:"#fffdf6"};border-left:6px solid ${red}`}">
      <div style="${disp(26)};color:${red}">${ESC(P.title)}</div>
      ${(P.lines||[]).slice(0,3).map(l=>`<div style="font:600 15px/1.3 ${SANS};color:${K.ink};margin-top:4px">${ESC(l)}</div>`).join("")}</div>`:"";
  const prop=posterOn?propAt(552,868,236,-2):propAt(14,236,214,-3);
  const lg=ctx.logo&&ctx.logo[0]?ctx.logo:null,ts=titleSize(f.title,230,3,E.caps?64:54,34,E.cw);
  let logoHTML="";
  if(lg){const ar=(+lg[1]||4)/(+lg[2]||1),w=Math.min(posterOn?224:318,96*ar),h=w/ar;
    logoHTML=`<div data-h="plate" style="display:inline-block;padding:10px 16px;border-radius:3px;background:${night?"rgba(6,8,10,.62)":"transparent"}"><img data-h="logo" alt="${ESC(f.title)}" crossorigin="anonymous" src="${img(lg[0],"w500")}" style="display:block;width:${Math.round(w)}px;height:${Math.round(h)}px;object-fit:contain"></div>`}
  const firstMain=menu.m&&menu.m[0];
  const noteTxt=night?V.noteTxt(W[3]&&W[3].length<=48?ESC(low(W[3])):""):firstMain?`${!special.m0&&(num.length===3||num.length===4)?`Plate No. ${num.length===4?num.slice(-2):num}. `:""}${ESC(firstMain.n)}, ${special.m0||price("m",firstMain.n)}, with a cup of coffee and a slice from the pie case.`:"Ask at the counter for today's plate.";
  const info=`<div data-h="info" style="position:absolute;left:${posterOn?552:44}px;right:${posterOn?26:296}px;top:${posterOn?208:738}px;bottom:${posterOn?(P?424:330):50}px;display:flex;flex-direction:column;justify-content:${posterOn?"flex-start":"center"};gap:10px;overflow:hidden">
      <div style="white-space:${posterOn?"normal":"nowrap"};font:700 17px/1.15 ${SANS};letter-spacing:${posterOn?".1em":".18em"};color:${night?neon:red};text-transform:uppercase">${night?"Tonight on the late show":"Now showing above the counter"}</div>
      <div style="display:flex;${posterOn?"flex-direction:column;align-items:flex-start;gap:8px":"align-items:flex-end;gap:16px"}">${logoHTML}<div data-h="${lg?"alt":"title"}" data-max="${ts}" style="${lg?"display:none;":""}${disp(ts)};line-height:.95;color:${night?K.paper:K.ink}">${ESC(f.title)}</div><span style="${disp(40)};color:${night?neon:red};flex:none">${ESC(f.year)}</span></div>
      <div style="font:italic 600 24px/1.25 ${SERIF};color:${night?"#fff":K.ink}">${ESC(f.T||"")}</div>
      <div data-h="fdesc" style="font:400 20px/1.36 ${SERIF};color:${night?K.bone:"#3a3d43"}">${ESC(f.D||"")}</div></div>`;
  const notice=`<div style="position:absolute;top:${posterOn?(P?640:730):748}px;right:${posterOn?26:30}px;width:${posterOn?240:240}px;box-sizing:border-box;transform:rotate(${2.5*tilt}deg);background:${night?K.paper:"#fffdf6"};color:${K.ink};padding:13px 15px;box-shadow:0 8px 22px rgba(0,0,0,${night?.55:.25});border-top:6px solid ${red}">
    <div style="${disp(ek==="classic"?28:30)};color:${red}">${night?V.note:DAY.note[T]||DAY.note.warm}</div>
    <div style="font:400 17px/1.32 ${SERIF};margin-top:6px">${noteTxt}</div>
    <div style="font:700 14px/1 ${SANS};letter-spacing:.18em;margin-top:9px;color:${K.mute}">THE MANAGEMENT</div></div>`;
  const ft=night?V.foot:DAY.foot;
  const foot=`<div style="position:absolute;left:44px;right:44px;bottom:22px;display:flex;justify-content:space-between;font:600 15px/1 ${SANS};letter-spacing:.14em;color:${fg};opacity:.75;text-transform:uppercase">
    <span>${ft[0]}</span><span>${ft[1]}</span><span>Form No. ${num||"13-"+yy}</span></div>`;
  const front=root("front",night?K.night:K.paper,backdrop+sign+hero+prop+info+notice+foot);

  /* ---------- back and last face: laminated menu (vinyl at night, chrome or accent edging by day) ----------
     Laid out synchronously here: an offscreen copy is measured so the full faces array is returned at once.
     Two faces if the menu fits the back; otherwise three, with as many items as fit on the back, the rest on the
     last face, the order slip and the note moved there if the back needs the room, and the last face's still grown
     to fill whatever is left. Never more than three faces, never type under dish 26 / note 20. */
  const SECTIONS=night?SECTIONS_N:SECTIONS_D;
  const edge=night?`<div style="position:absolute;inset:0;border:12px solid #17191e;pointer-events:none"></div><div style="position:absolute;inset:6px;border:1.5px dashed rgba(235,230,216,.42);pointer-events:none"></div>`
    :ek==="classic"?`<div style="position:absolute;inset:0;border:12px solid transparent;border-image:${chrome} 1;pointer-events:none"></div><div style="position:absolute;inset:16px;border:1.5px solid ${red};pointer-events:none"></div>`
    :`<div style="position:absolute;inset:0;border:12px solid ${red};pointer-events:none"></div><div style="position:absolute;inset:6px;border:1.5px dashed rgba(255,255,255,.5);pointer-events:none"></div>`;
  const lam=`<div style="position:absolute;inset:0;background:url('${BASE}laminate-wear.webp') center/cover;opacity:${wear};pointer-events:none"></div>${edge}`;
  const topStill=(src,h,kick,head,size,cap)=>`<div data-h="band" style="position:absolute;left:12px;right:12px;top:12px;height:${h}px;overflow:hidden;background:${K.night}">
    ${src?`<img alt="" crossorigin="anonymous" src="${img(src,"w1280")}" style="width:100%;height:100%;object-fit:cover;display:block;filter:${photo}">`:poster?`<img alt="" crossorigin="anonymous" src="${img(poster,"w780")}" style="width:100%;height:100%;object-fit:cover;object-position:50% 25%;display:block;filter:${photo}">`:""}
    <div style="position:absolute;left:0;right:0;bottom:0;height:${Math.min(170,Math.round(h*.6))}px;background:linear-gradient(transparent,rgba(8,10,13,.88))"></div>
    <div style="position:absolute;left:32px;bottom:${h<160?14:22}px">
      ${h<160?"":`<div style="font:600 16px/1 ${SANS};letter-spacing:.3em;color:${K.bone};margin-bottom:10px">${kick}</div>`}
      <div style="white-space:nowrap;${disp(h<160?Math.min(size,54):size)}">${night?neonTxt(E.caps?head.toUpperCase():head,false):`<span style="color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.6)">${ESC(E.caps?head.toUpperCase():head)}</span>`}</div></div>
    ${cap?`<div style="position:absolute;right:20px;bottom:18px;max-width:300px;text-align:right;font:italic 400 15px/1.3 ${SERIF};color:#e9e4d6;text-shadow:0 1px 3px rgba(0,0,0,.9)">${cap}<br><span style="font:700 14px/1.6 ${SANS};letter-spacing:.14em;font-style:normal">${src?"STILL":"POSTER"}: TMDB</span></div>`
      :(src||poster)?`<div style="position:absolute;right:20px;top:16px;font:700 14px/1 ${SANS};letter-spacing:.14em;color:#e9e4d6;text-shadow:0 1px 3px rgba(0,0,0,.9)">${src?"STILL":"POSTER"}: TMDB</div>`:""}</div>`;
  const item=(k,it,i,L)=>`<div data-h="item" style="break-inside:avoid;padding-bottom:${L.pad}px">
      <div style="display:flex;align-items:baseline;gap:10px"><b data-h="dish" style="font:700 ${L.dish}px/1.12 ${E.dish};color:${K.ink};flex:1 1 auto;min-width:0">${ESC(it.n)}</b><span data-h="price" style="font:700 ${L.dish}px/1 ${E.dish};color:${red};flex:none">${special[k+i]||price(k,it.n)}</span></div>
      ${it.note?`<div data-h="desc" style="font:400 ${L.desc}px/${L.lh} ${SERIF};color:#3a3d43;margin-top:4px">${ESC(it.note.charAt(0).toUpperCase()+it.note.slice(1))}</div>`:""}</div>`;
  const head=(name,sub,L)=>{const hs=Math.round(E.hs*L.k);return ek==="modern"
    ?`<div data-h="sec" style="break-inside:avoid;display:flex;align-items:baseline;justify-content:space-between;gap:10px;background:${red};padding:6px 10px 5px;margin:0 0 ${L.mb}px"><span data-h="sech" data-base="${E.hs}" style="white-space:nowrap;min-width:0;overflow:hidden;padding-bottom:.2em;margin-bottom:-.2em;${disp(hs)};color:#fff">${name}</span><span data-opt style="white-space:nowrap;min-width:0;overflow:hidden;flex:0 1 auto;padding-right:.25em;padding-bottom:.3em;margin-bottom:-.3em;font:italic 400 17px/1 ${SERIF};color:#fff">${sub}</span></div>`
    :`<div data-h="sec" style="break-inside:avoid;display:flex;align-items:baseline;gap:12px;border-bottom:2px solid ${K.ink};box-shadow:0 3px 0 ${K.paper},0 4px 0 ${K.ink};margin:0 0 ${L.mb}px;padding-bottom:4px"><span data-h="sech" data-base="${E.hs}" style="white-space:nowrap;min-width:0;overflow:hidden;padding-bottom:.2em;margin-bottom:-.2em;flex:0 0 auto;max-width:100%;font:${E.hw} ${hs}px/1.05 ${E.head};letter-spacing:${E.ls};color:${ek==="classic"?red:K.ink};${E.caps?"text-transform:uppercase;":""}">${name}</span><span data-opt style="white-space:nowrap;min-width:0;overflow:hidden;flex:0 1 auto;padding-right:.25em;padding-bottom:.3em;margin-bottom:-.3em;font:italic 400 17px/1 ${SERIF};color:${red}">${sub}</span></div>`};
  /* every item in order, so a run [a,b) can be laid out on any face; a section split across faces repeats its head as "continued" */
  const flat=[];SECTIONS.forEach(([k,name,sub],si)=>(menu[k]||[]).forEach((it,ii)=>flat.push({k,name,sub,si,ii,it})));
  const run=(a,b,L)=>{let h="",i=a;while(i<b){const g=flat[i].si,grp=[];while(i<b&&flat[i].si===g)grp.push(flat[i++]);const x=grp[0];
      h+=`<div data-h="secblock"><div style="break-inside:avoid">${head(x.name,x.ii?"continued":x.sub,L)}${item(x.k,x.it,x.ii,L)}</div>${grp.slice(1).map(y=>item(y.k,y.it,y.ii,L)).join("")}<div data-h="gap" style="height:${L.gap}px"></div></div>`}
    return h};
  const N=fl&&fl.note;
  const props=bottom=>`<div data-h="props" style="position:absolute;left:40px;right:40px;bottom:${bottom}px;height:150px;display:flex;gap:24px;align-items:stretch">
    <div style="flex:1.15;background:#fff;padding:14px 18px;box-shadow:0 4px 12px rgba(0,0,0,.18);border-left:6px solid ${red};transform:rotate(${-.6*tilt}deg);display:flex;flex-direction:column;justify-content:center">
      <div style="font:700 15px/1 ${SANS};letter-spacing:.24em;color:${red}">ORDER UP WHEN</div>
      <div style="font:400 20px/1.3 ${SERIF};color:${K.ink};margin-top:7px">${ESC(f.P||"Order up when the opening credits roll.")}</div></div>
    <div style="flex:1;padding:12px 16px;border:1.5px solid ${K.ink};outline:1px solid ${K.ink};outline-offset:3px;display:flex;flex-direction:column;justify-content:center;background:${night?"transparent":"rgba(255,255,255,.35)"}">
      <div style="font:700 14px/1 ${SANS};letter-spacing:.2em;color:${red};margin-bottom:6px">LEFT ON THE COUNTER</div>
      <div style="font:400 ${N&&N.text.length>95?16:18}px/1.3 ${SERIF};color:${K.ink}">${N?ESC(N.text):night?"Lock the door behind you, hon. Sit where you can see the road.":"Coffee's on the house if you finish the pie, hon."}</div>
      <div style="font:400 20px/1.5 ${HAND};color:#23324f;margin-top:2px;white-space:nowrap">${N?ESC(N.by):"Dot, the counter"}</div></div></div>`;
  const backFoot=`<div style="position:absolute;left:40px;right:40px;bottom:20px;font:400 15px/19px ${SANS};color:${K.mute}">
    ${W[4]?`<div style="font-style:italic;font-family:${SERIF};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Overheard at the counter: ${ESC(low(W[4]))}.</div>`:""}
    <div style="display:flex;justify-content:space-between"><span>${night?V.fine:DAY.fine}</span><span>Form No. ${num||"13-"+yy}</span></div></div>`;
  const lastFoot=`<div style="position:absolute;left:40px;right:40px;bottom:26px;display:flex;justify-content:space-between;font:400 15px/1 ${SANS};color:${K.mute}"><span>${ESC(venue)}. Turn over for the cover.</span><span>Form No. ${num||"13-"+yy}</span></div>`;
  const s1=stills[1]||stills[0],s2=stills[2]||stills[1]||stills[0];
  const cap1=`The window booth at ${ESC(venue)}${night?", after midnight":""}.`;
  const menuBox=(top,bottom,html)=>`<div data-h="menu" style="position:absolute;left:44px;right:44px;top:${top}px;bottom:${bottom}px;column-count:2;column-gap:40px;column-fill:balance;column-rule:1px solid rgba(22,26,32,.25)">${html}</div>`;
  /* back: band height bh, props on the back or not */
  const backHTML=(bh,withProps,html)=>root("back",K.paper,topStill(s1,bh,night?V.kick:DAY.kick,"The Menu",ek==="classic"?80:88,cap1)+menuBox(bh+38,withProps?230:64,html)+(withProps?props(64):"")+backFoot,lam);
  const lastHTML=(bh,withProps,html)=>root("cont",K.paper,topStill(s2,bh,night?"STILL OPEN":"STILL SERVING","The Menu, continued",ek==="classic"?64:72,"")+menuBox(bh+38,withProps?226:60,html)+(withProps?props(62):"")+lastFoot,lam);

  /* offscreen measuring */
  const host=document.createElement("div");host.style.cssText="position:absolute;left:-30000px;top:0;width:816px;visibility:hidden;pointer-events:none";document.body.appendChild(host);
  /* an 8px safety margin: measure in a box 8px shorter than the real one (a column box overflows sideways, not down) */
  const fitsHTML=h=>{host.innerHTML=h;const m=host.querySelector('[data-h="menu"]');m.style.bottom=(parseFloat(m.style.bottom)+8)+"px";return m.scrollWidth<=m.clientWidth+1&&m.scrollHeight<=m.clientHeight+1};
  const n=flat.length;let faces;
  try{
    /* two faces: grow the back still as far as the menu allows, at the largest type that fits */
    let two=null;
    for(const L of LEVELS){const html=run(0,n,L);
      for(let bh=600;bh>=232;bh-=16)if(fitsHTML(backHTML(bh,true,html))){two=backHTML(bh,true,html);break}
      if(two)break}
    if(two)faces=[front,two];
    else{
      /* three faces: most items on the back, the rest on the last face, whose still then grows to fill it */
      const VARIANTS=[{bb:296,bp:true,lp:false,lb:240},{bb:296,bp:false,lp:true,lb:240},{bb:220,bp:false,lp:true,lb:150},{bb:150,bp:false,lp:true,lb:96}];
      let pick=null;
      outer:for(const L of LEVELS)for(const V of VARIANTS){
        let k=n-1;while(k>0&&!fitsHTML(backHTML(V.bb,V.bp,run(0,k,L))))k--;
        if(k<1)continue;
        if(fitsHTML(lastHTML(V.lb,V.lp,run(k,n,L)))){pick={L,V,k};break outer}}
      if(!pick){const L=LEVELS[LEVELS.length-1],V=VARIANTS[VARIANTS.length-1];let k=n-1;while(k>1&&!fitsHTML(backHTML(V.bb,V.bp,run(0,k,L))))k--;pick={L,V,k}}
      /* balance the split: move items to the last face while both stills can grow, so neither face is left with a dead band */
      const {L,V}=pick;
      const grow=(mk,hi,lo,html)=>{for(let h=hi;h>=lo;h-=16)if(fitsHTML(mk(h,html)))return h;return 0};
      let best=null;
      for(let kk=pick.k;kk>=Math.max(1,Math.ceil(n/2)-1);kk--){
        const bh=grow((h,x)=>backHTML(h,V.bp,x),600,V.bb,run(0,kk,L)),lh=grow((h,x)=>lastHTML(h,V.lp,x),620,V.lb,run(kk,n,L));
        if(!bh||!lh)continue;const sc=Math.min(bh,lh);if(!best||sc>best.sc)best={sc,kk,bh,lh}}
      if(best)faces=[front,backHTML(best.bh,V.bp,run(0,best.kk,L)),lastHTML(best.lh,V.lp,run(best.kk,n,L))];
      else{const {k}=pick,rest=run(k,n,L);let lb=V.lb;
        for(let h=620;h>V.lb;h-=16)if(fitsHTML(lastHTML(h,V.lp,rest))){lb=h;break}
        faces=[front,backHTML(V.bb,V.bp,run(0,k,L)),lastHTML(lb,V.lp,rest)]}
    }
  }finally{host.remove()}
  schedule(token,night);
  return {w:816,h:1056,faces};
};

/* resolves once the diner fonts are loaded; callers that can wait should await it so the synchronous layout measures real fonts */
window.MENU_FORMATS.diner.ready=CSS_READY.then(()=>Promise.all(FONTS.map(fn=>document.fonts.load(fn).catch(()=>0))));

/* ---------- after mount: logo plate, front title fit, and a safety step down if real fonts differ ---------- */
const LEVELS=[{dish:28,desc:21,k:1,pad:16,gap:14,mb:14,lh:1.3},{dish:27,desc:20,k:.95,pad:12,gap:10,mb:10,lh:1.3},{dish:26,desc:20,k:.9,pad:9,gap:6,mb:8,lh:1.28},
  /* last resort for very long menus: same minimum sizes, tighter leading and spacing */
  {dish:26,desc:20,k:.85,pad:5,gap:3,mb:5,lh:1.2}];
function schedule(token,night){
  let tries=0;
  const tick=async()=>{
    const faces=[...document.querySelectorAll(`[data-diner="${token}"]`)];
    if(faces.length<2){if(++tries<250)setTimeout(tick,40);return}
    await CSS_READY;
    await Promise.all(FONTS.map(fn=>document.fonts.load(fn).catch(()=>0)));
    const lg=faces[0].querySelector('[data-h="logo"]');
    if(lg&&!lg.complete)await new Promise(r=>{lg.addEventListener("load",r,{once:true});lg.addEventListener("error",r,{once:true});setTimeout(r,1500)});
    try{fit(faces,night)}catch(e){console.error("diner fit",e)}
    faces[0].dataset.fitted="1";
  };
  setTimeout(tick,0);
}
function fit(faces,night){
  const fr=faces[0];
  const fits=m=>m.scrollWidth<=m.clientWidth+1&&m.scrollHeight<=m.clientHeight+1;
  const box=fr.querySelector('[data-h="info"]'),over=()=>box.scrollHeight>box.clientHeight+1;
  const lg=fr.querySelector('[data-h="logo"]'),plate=fr.querySelector('[data-h="plate"]');
  if(lg){
    if(!(lg.complete&&lg.naturalWidth)){plate.style.display="none";const a=fr.querySelector('[data-h="alt"]');a.style.display="";a.dataset.h="title"}
    else{try{const cv=document.createElement("canvas");cv.width=96;cv.height=Math.max(8,Math.round(96*lg.naturalHeight/lg.naturalWidth));
      const cx=cv.getContext("2d");cx.drawImage(lg,0,0,cv.width,cv.height);const d=cx.getImageData(0,0,cv.width,cv.height).data;let s=0,n=0;
      let dk=0,lt=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>128){const y=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;s+=y;if(y<.36)dk++;if(y>.8)lt++;n++}
      const L=n?s/n:.5,DK=n?dk/n:0,LT=n?lt/n:0;
      /* the logo keeps its own colours; the plate behind it changes so it reads */
      if(night&&(L<.4||DK>.3&&DK>LT)){plate.style.background="#ece6d6";plate.style.boxShadow="0 6px 16px rgba(0,0,0,.55),inset 0 0 0 1px rgba(0,0,0,.15)"}
      if(!night&&(L>.62||LT>.5&&LT>DK)){plate.style.background="#16191f";plate.style.boxShadow="0 6px 16px rgba(0,0,0,.3)"}}catch(e){}
      const ar=lg.naturalWidth/lg.naturalHeight;let h=lg.offsetHeight;
      while(over()&&h>56){h-=8;lg.style.height=h+"px";lg.style.width=Math.min(318,Math.round(h*ar))+"px"}}}
  const t=fr.querySelector('[data-h="title"]');
  if(t){let s=+t.dataset.max;while((over()||t.scrollWidth>t.clientWidth+1)&&s>34){s-=2;t.style.fontSize=s+"px"}}
  const fd=fr.querySelector('[data-h="fdesc"]');let fs=20;while(over()&&fs>16){fs--;fd.style.fontSize=fs+"px"}
  if(over()&&fd)fd.style.display="none";
  /* if the layout was measured before the web fonts arrived and now runs long, tighten spacing, then step type to the floor */
  faces.slice(1).forEach(fc=>{const m=fc.querySelector('[data-h="menu"]');if(!m||fits(m))return;
    for(const L of LEVELS){
      fc.querySelectorAll('[data-h="dish"],[data-h="price"]').forEach(e=>e.style.fontSize=Math.min(parseFloat(e.style.fontSize),L.dish)+"px");
      fc.querySelectorAll('[data-h="desc"]').forEach(e=>e.style.fontSize=Math.min(parseFloat(e.style.fontSize),L.desc)+"px");
      fc.querySelectorAll('[data-h="item"]').forEach(e=>e.style.paddingBottom=Math.min(parseFloat(e.style.paddingBottom),L.pad)+"px");
      fc.querySelectorAll('[data-h="gap"]').forEach(e=>e.style.height=Math.min(parseFloat(e.style.height),L.gap)+"px");
      if(fits(m))break}});
}
})();
