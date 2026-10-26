/* Format: stadium. A stadium concession scorecard, two landscape faces 1344x816.
   Front: hero still (58 percent), venue, logo panel, scoreboard in type (signature), ticket stub, fine print.
   Back: section map of stills (2x2 grid labelled by section), concessions in two columns, manager note with script signature.
   Era sets type pairing, paper (cream scorecard to black gloss), scoreboard tech (hand turned, bulbs, LED, video) and label style; tone sets wear, photo and voice. */
(function(){
const ID="stadium",W=1344,H=816;

/* ---------- shared helpers ---------- */
const clean=s=>String(s==null?"":s).replace(/\s*[–—]\s*/g,", ").replace(/\s+-\s+/g,", ");
const esc=s=>clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cap=s=>{s=clean(s).trim();return s?s.charAt(0).toUpperCase()+s.slice(1):""};
const hex=h=>{h=String(h||"").replace("#","");return /^[0-9a-f]{6}$/i.test(h)?[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)):null};
const toHex=a=>"#"+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const mix=(a,b,t)=>toHex(hex(a).map((v,i)=>v+(hex(b)[i]-v)*t));
const lum=h=>{const a=hex(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
/* push a film colour away from the paper until it reads, else fall back */
function readable(c,paper,min,fb){if(!hex(c))return fb;const dark=lum(paper)>.4;let x=c;for(let i=0;i<10&&cr(x,paper)<min;i++)x=mix(x,dark?"#000000":"#ffffff",.15);return cr(x,paper)>=min?x:fb}
const clamp=n=>`display:-webkit-box;-webkit-line-clamp:${n};-webkit-box-orient:vertical;overflow:hidden`;
function wrapLines(t,fs,w,cw){t=clean(t).trim();if(!t)return 0;const per=Math.max(4,Math.floor(w/(fs*cw)));let n=1,c=0;for(const wd of t.split(/\s+/)){const L=wd.length;if(!c)c=L;else if(c+1+L<=per)c+=1+L;else{n++;c=L}}return n}
const FAMILY=new Set(["kids","fairytale","xmas","wizard"]);
const DRY=[[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beer\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|gin|liqueur|martini)\b/gi,"soda"]];
const dry=s=>DRY.reduce((t,[re,to])=>t.replace(re,to),clean(s));
function loadFonts(fams){const k="fmt-"+ID+"-fonts";if(document.getElementById(k))return;const l=document.createElement("link");l.id=k;l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?"+fams.map(f=>"family="+f).join("&")+"&display=swap";document.head.appendChild(l)}
/* logo in its own colours: dark panel by default, switched to the light panel when the logo itself is mostly dark */
const SAMPLE="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,a=0,b=0;for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;var L=.2126*d[k]+.7152*d[k+1]+.0722*d[k+2];if(L<95)a++;else if(L>165)b++}if(a>b*1.2){var p=i.parentNode;p.style.background=p.getAttribute('data-light')}}catch(e){}";
function logoImg(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a);if(h<34)return null;return{src:ctx.img(L[0],"w500"),w:Math.round(h*a),h:Math.round(h)}}
function photo(src,filter,pos,extra){return `<img src="${src}" crossorigin="anonymous" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 35%"};filter:${filter}">${extra||""}`}

/* ---------- era and tone ---------- */
const ERAS=["1930s-40s","1950s","1960s","1970s","1980s","1990s","2000s","modern"];
const E=[
 {disp:"'Graduate',serif",dw:400,body:"'Roboto Slab',serif",sig:"'Mrs Saint Delafield',cursive",paper:"#efe5c9",ink:"#1d3324",acc:"#9b2226",board:"manual",photo:"grayscale(1) contrast(1.12) brightness(1.04)",bar:"grid",cw:.56,cwd:.6,base:.25,secs:["Grandstand","Bleachers","Box Seats","Press Box"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Graduate',serif",dw:400,body:"'Roboto Slab',serif",sig:"'Allura',cursive",paper:"#f3ead3",ink:"#1f2a44",acc:"#b3261e",board:"manual",photo:"saturate(.72) sepia(.2) contrast(1.05)",bar:"grid",cw:.56,cwd:.6,base:.45,secs:["Grandstand","Bleachers","Box Seats","Press Box"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Changa One',sans-serif",dw:400,body:"'Roboto Condensed',sans-serif",sig:"'Allura',cursive",paper:"#f4efe2",ink:"#23324a",acc:"#d4572a",board:"bulb",photo:"saturate(1.12) sepia(.08) contrast(1.06)",bar:"pill",cw:.43,cwd:.46,base:.9,dots:1,secs:["Field Level","Mezzanine","Upper Deck","Bleachers"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Changa One',sans-serif",dw:400,body:"'Roboto Condensed',sans-serif",sig:"'Allura',cursive",paper:"#f2e0bd",ink:"#3b2412",acc:"#c1561a",board:"bulb",photo:"saturate(1.18) sepia(.22) contrast(1.04)",bar:"pill",cw:.43,cwd:.46,base:1.25,dots:1,secs:["Field Level","Mezzanine","Upper Deck","Bleachers"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Russo One',sans-serif",dw:400,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#f7f7f4",ink:"#121a2e",acc:"#d0202e",board:"led",photo:"saturate(1.06) contrast(1.05)",bar:"skew",cw:.43,cwd:.46,base:2.5,secs:["Lower Bowl","Club Level","Upper Deck","Courtside"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Russo One',sans-serif",dw:400,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#fbfbf9",ink:"#0f1d33",acc:"#0a6ab8",board:"led",photo:"saturate(1.08) contrast(1.05)",bar:"skew",cw:.43,cwd:.46,base:3.5,secs:["Lower Bowl","Club Level","Upper Deck","Courtside"],cols:["Snacks","Hot Stand","Sweets","Cold Drinks"]},
 {disp:"'Chakra Petch',sans-serif",dw:700,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#16181d",ink:"#f2f2f2",acc:"#22a3e0",board:"video",photo:"saturate(1.08) contrast(1.06)",bar:"led",cw:.43,cwd:.46,base:6,secs:["Lower Bowl","Club Level","Upper Deck","Suites"],cols:["Snacks","Grill","Sweets","Drinks"]},
 {disp:"'Chakra Petch',sans-serif",dw:700,body:"'Roboto Condensed',sans-serif",sig:"'Caveat',cursive",paper:"#101318",ink:"#f5f5f5",acc:"#e8b100",board:"video",photo:"saturate(1.05) contrast(1.06)",bar:"led",cw:.43,cwd:.46,base:9,secs:["Lower Bowl","Club Level","Upper Deck","Suites"],cols:["Snacks","Grill","Sweets","Drinks"]}
];
const T={
 gritty:{wear:.55,vig:.38,photo:"contrast(1.1) saturate(.82)",paperTo:"#c9b48c",pt:.12,tilt:-1.5,hawk:"Cash at the stand. No refunds after the first whistle.",gate:"Cheap seats, loud crowd"},
 glossy:{wear:.03,vig:.06,photo:"saturate(1.1) contrast(1.04)",shine:1,tilt:0,hawk:"Seat service in every section.",gate:"Premium seating"},
 warm:{wear:.2,vig:.22,photo:"sepia(.1) saturate(1.06) brightness(1.03)",tilt:-1,hawk:"Hawkers in every aisle. Holler and wave.",gate:"Home sweet home"},
 eerie:{wear:.3,vig:.55,photo:"saturate(.6) brightness(.9) hue-rotate(-8deg)",paperTo:"#9aa6ad",pt:.16,tilt:0,hawk:"Stands close when the lights go out.",gate:"Lights out at the final whistle"},
 playful:{wear:.06,vig:.1,photo:"saturate(1.2) brightness(1.04)",tilt:-3,hawk:"Hawkers in every aisle. Catch it if you can.",gate:"Make some noise"},
 grand:{wear:.1,vig:.2,photo:"contrast(1.06) saturate(1.05)",tilt:0,hawk:"Served in the grandstand with full honours.",gate:"Championship night"},
 tender:{wear:.16,vig:.2,photo:"saturate(.9) brightness(1.06) contrast(.96)",tilt:-1,hawk:"Take your time. The game will wait.",gate:"Same seats every season"},
 tense:{wear:.24,vig:.4,photo:"contrast(1.2) saturate(.78)",paperTo:"#b9b2a2",pt:.1,tilt:0,hawk:"Grab it now. Nobody leaves their seat in the last minute.",gate:"Sudden death"},
 scrappy:{wear:.6,vig:.28,photo:"grayscale(.35) contrast(1.28)",paperTo:"#d8d0bc",pt:.2,tilt:-3.5,hawk:"Cash only. Bring your own cushion.",gate:"Bleacher bums welcome"}
};
loadFonts(["Graduate","Changa+One","Russo+One","Chakra+Petch:wght@600;700","Roboto+Slab:wght@400;700","Roboto+Condensed:ital,wght@0,400;0,700;1,400","Mrs+Saint+Delafield","Allura","Caveat:wght@600"]);

function money(v,ei){if(v<1&&ei<2)return String(Math.round(v*100))+"c";return v.toFixed(2)}
function prices(menu,e,ei,egg){
  const mult={s:.6,m:1,w:.5,d:.4},out={};let hid=false;
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).map((it,i)=>{let v=e.base*mult[k]*(1+i*.15);v=ei<2?Math.max(.05,Math.round(v*20)/20):Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"&&ei>=2){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)});
  return out;
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},ei=Math.max(0,ERAS.indexOf(ctx.era)),e=E[ei],t=T[ctx.tone]||T.warm;
  const fam=FAMILY.has(f.theme),tx=s=>fam?dry(s):clean(s);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature"),year=f.year||"";
  const venue=clean(fl.venue||(title.length<=22?title+" Concessions":"Stadium Concessions")),sign=clean(fl.sign||t.gate);
  const note=fl.note&&fl.note.text?{text:fl.note.text,by:fl.note.by||"The Manager"}:{text:"Grab a seat, grab a bite, and stay for the whole game. The stands are open till the final whistle.",by:"The Stand Manager"};
  const winks=(fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?fl.prop:{title:"General Admission",lines:["Good for one game","Keep this stub"]};
  const num=String(fl.number||"").replace(/\D/g,"")||String(year).slice(-2)||"7";
  const egg=String(fl.number||year).replace(/\D/g,"").slice(-2)||"";
  let paper=t.paperTo&&lum(e.paper)>.4?mix(e.paper,t.paperTo,t.pt):e.paper;
  const darkPaper=lum(paper)<.2;
  const pal=ctx.palette||{};
  const ink=darkPaper?e.ink:readable(pal.dark&&lum(pal.dark)<.06?pal.dark:e.ink,paper,9,e.ink);
  const acc=readable(pal.accent||e.acc,paper,4.5,e.acc);
  const soft=mix(ink,paper,.3);
  const band=darkPaper?mix(paper,"#000000",.4):readable(pal.dark||e.ink,"#ffffff",8,e.ink);
  const bandText=darkPaper?ink:mix(paper,"#ffffff",.6);
  const grain=(ctx.root!=null?ctx.root:"../../../")+"wip/print/jurassic/paper-grain.png";
  const stills=(ctx.stills||[]).filter(Boolean);
  const poster=ctx.poster||(typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id||`${f.title} (${f.year})`])||null;
  const pf=e.photo+" "+t.photo;
  const DF=e.disp,BF=e.body,SF=e.sig;
  const kick=(s,c,size)=>`<div style="font:700 ${size||16}px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${c||acc};${clamp(1)}">${esc(s)}</div>`;
  const tex=()=>`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(40,25,10,${darkPaper?t.vig*.5:t.vig}) 100%)"></div><div style="position:absolute;inset:0;pointer-events:none;background:url(${grain}) center/1400px auto;opacity:${((darkPaper?.1:.25)+t.wear*1.1).toFixed(2)}"></div>`;
  const overlay=()=>(e.dots?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.16) 1px,transparent 1.4px) 0 0/4px 4px;mix-blend-mode:multiply"></div>`:"")+(t.shine||ei>=6?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,0) 38%)"></div>`:"");
  const W2=W;

  /* ---------- FRONT ---------- */
  const HX=790;
  const heroSrc=stills[0]?ctx.img(stills[0],"w1280"):poster?ctx.img(poster,"w780"):"";
  const tagline=clean(f.T||"");
  const hero=`<div style="position:absolute;left:0;top:0;width:${HX}px;height:${H}px;overflow:hidden;background:#222">${heroSrc?photo(heroSrc,pf,stills[0]?"center 40%":"center 25%",overlay()):""}
    <div style="position:absolute;left:0;top:0;bottom:0;width:${HX}px;box-shadow:inset -10px 0 0 ${acc}"></div>
    ${tagline?`<div style="position:absolute;left:0;right:10px;bottom:0;padding:50px 34px 24px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.75))">${kick("Tonight",mix(acc,"#ffffff",.75),16)}<div style="font:italic 400 22px/1.3 ${BF};color:#fbf6ea;margin-top:6px;${clamp(2)}">${esc(tagline)}</div></div>`:""}</div>`;
  const RW=W-HX-60;
  const vSize=venue.length>28?30:venue.length>18?36:42;
  const lg=logoImg(ctx,RW-40,96);
  const tSize=title.length>40?24:title.length>24?30:title.length>12?38:48;
  const panelDark=mix(band,"#000000",.3),panelLight=darkPaper?"#f2f2ee":mix(paper,"#ffffff",.6);
  const logo=`<div data-dark="${panelDark}" data-light="${panelLight}" style="position:relative;height:120px;background:${panelDark};display:flex;align-items:center;justify-content:center;border-bottom:5px solid ${acc};flex:none">
    ${lg?`<img src="${lg.src}" crossorigin="anonymous" onload="${SAMPLE}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))">`
       :`<div style="font:${e.dw} ${tSize}px/1.08 ${DF};color:#fbf6ea;text-align:center;padding:0 20px;text-transform:uppercase;${clamp(3)}">${esc(title)}</div>`}
    <div style="position:absolute;right:10px;bottom:6px;font:700 14px/1 ${BF};letter-spacing:.2em;color:${mix(acc,"#ffffff",.6)}">${esc(year)}</div></div>`;
  /* signature: the scoreboard, set in type */
  const C=[["s",e.cols[0]],["m",e.cols[1]],["w",e.cols[2]],["d",e.cols[3]]].filter(([k])=>(ctx.menu[k]||[]).length);
  const items={};C.forEach(([k])=>items[k]=(ctx.menu[k]||[]).slice(0,4));
  const total=C.reduce((a,[k])=>a+items[k].length,0);
  const B={manual:{bg:"#24432f",cell:"#183022",dig:"#f4f1e6",lab:"#f4f1e6",glow:"none",font:DF},
           bulb:{bg:"#141210",cell:"#060505",dig:"#ffb347",lab:"#f3e2c4",glow:"0 0 6px rgba(255,170,60,.85)",font:DF},
           led:{bg:"#0b0b0b",cell:"#000",dig:"#ff4433",lab:"#f2f2f2",glow:"0 0 6px rgba(255,60,40,.8)",font:DF},
           video:{bg:"linear-gradient(#0d1a3a,#05080f)",cell:"rgba(255,255,255,.06)",dig:"#ffffff",lab:"#cfd8e6",glow:`0 0 8px ${acc}`,font:DF}}[e.board];
  const cellBg=e.board==="led"?`${B.cell} radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.5px) 0 0/5px 5px`:B.cell;
  const cell=(v,wd)=>`<div style="flex:0 0 ${wd||46}px;height:46px;display:flex;align-items:center;justify-content:center;background:${cellBg};font:${e.dw} 30px/1 ${B.font};color:${B.dig};text-shadow:${B.glow}">${v}</div>`;
  const lab=(v)=>`<div style="flex:1;font:700 18px/1 ${BF};letter-spacing:.14em;color:${B.lab};text-transform:uppercase">${v}</div>`;
  const hdr=`<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">${lab("Stand")}${[1,2,3,4].map(n=>`<div style="flex:0 0 46px;text-align:center;font:700 16px/1 ${BF};color:${B.lab}">${n}</div>`).join("")}<div style="flex:0 0 60px;text-align:center;font:700 16px/1 ${BF};color:${B.lab}">R</div></div>`;
  const cnt=k=>items[k]?items[k].length:"";
  const board=`<div style="background:${B.bg};padding:14px 16px 12px;border:${e.board==="manual"?"6px solid #1a3022":"4px solid #2a2a2a"};box-shadow:0 4px 12px rgba(0,0,0,.35);flex:none">
    ${hdr}
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">${lab("Home")}${["s","m","w","d"].map(k=>cell(cnt(k))).join("")}${cell(total,60)}</div>
    <div style="display:flex;gap:6px;align-items:center">${lab("Guests")}${[0,0,0,0].map(v=>cell(v)).join("")}${cell(0,60)}</div>
    <div style="display:flex;justify-content:space-between;margin-top:9px;font:700 15px/1.2 ${BF};letter-spacing:.14em;color:${B.lab};text-transform:uppercase"><span>Att ${esc(num.slice(0,6))}</span><span>Now serving: ${esc(C[0]?C[0][1]:"Snacks")}</span></div></div>`;
  /* ticket */
  const sec=(num+"101").slice(0,3),row=(title.replace(/[^A-Z]/gi,"").charAt(0)||"A").toUpperCase(),seat=String(total||1);
  const ticket=`<div style="display:flex;transform:rotate(${t.tilt*.5}deg);background:${darkPaper?"#f2efe6":mix(paper,"#ffffff",.55)};box-shadow:0 3px 10px rgba(0,0,0,.3);border-top:6px solid ${acc};flex:none">
    <div style="flex:1;padding:12px 16px;min-width:0">
      ${kick("Admit one",acc,14)}
      <div style="font:${e.dw} 26px/1.05 ${DF};color:#15171c;margin:4px 0 4px;text-transform:uppercase;${clamp(2)}">${esc(prop.title)}</div>
      ${(prop.lines||[]).slice(0,2).map(l=>`<div style="font:400 16px/1.25 ${BF};color:#3a3d44;${clamp(1)}">${esc(l)}</div>`).join("")}</div>
    <div style="flex:0 0 132px;border-left:3px dashed ${mix("#15171c","#ffffff",.6)};padding:12px 12px;display:flex;flex-direction:column;justify-content:center;gap:4px">
      ${[["Sec",sec],["Row",row],["Seat",seat]].map(([a,b])=>`<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:700 14px/1 ${BF};letter-spacing:.14em;color:#5a5d66;text-transform:uppercase">${a}</span><span style="font:${e.dw} 24px/1 ${DF};color:#15171c">${esc(b)}</span></div>`).join("")}</div></div>`;
  const right=`<div style="position:absolute;left:${HX+30}px;width:${RW}px;top:26px;bottom:22px;display:flex;flex-direction:column;justify-content:space-between">
    <div>${kick(sign,acc,15)}<div style="font:${e.dw} ${vSize}px/1.05 ${DF};color:${ink};margin-top:6px;text-transform:uppercase;${clamp(2)}">${esc(venue)}</div></div>
    ${logo}${board}${ticket}
    <div style="display:flex;justify-content:space-between;font:400 15px/1.2 ${BF};color:${soft}"><span>Concession Scorecard</span><span>Form SC-${esc(num.slice(-4))}</span></div></div>`;
  const front=`<div style="position:absolute;inset:0;background:${paper};overflow:hidden">${tex()}${hero}${right}</div>`;

  /* ---------- BACK: section map of stills, concessions ---------- */
  const MX=660;
  let pool=stills.slice(1,5);if(pool.length<4&&stills[0]&&!pool.includes(stills[0]))pool.push(stills[0]);
  let srcs=pool.map(s=>ctx.img(s,"w780"));if(srcs.length<4&&poster)srcs.push(ctx.img(poster,"w780"));
  const n=srcs.length>=4?4:srcs.length>=2?2:srcs.length;
  const gx=28,gy=96,gw=MX-gx-24,gh=H-gy-30,gap=12;
  const tiles=[];
  for(let i=0;i<n;i++){const tw=n===4?(gw-gap)/2:gw,th=n===1?gh:(gh-gap)/2,x=gx+(n===4?(i%2)*(tw+gap):0),y=gy+(n===4?Math.floor(i/2)*(th+gap):n===2?i*(th+gap):0);
    tiles.push(`<div style="position:absolute;left:${x}px;top:${y}px;width:${tw}px;height:${th}px;overflow:hidden;background:#222;outline:3px solid ${acc}">${photo(srcs[i],pf,"center 35%",overlay())}
      <div style="position:absolute;left:0;top:0;background:${band};color:${bandText};font:${e.dw} 20px/1 ${DF};padding:8px 12px;letter-spacing:.04em">SEC ${100+(i+1)}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;padding:24px 12px 8px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.7));font:700 15px/1.2 ${BF};letter-spacing:.14em;text-transform:uppercase;color:#fbf6ea">${e.secs[i]}</div></div>`)}
  const mapHead=`<div style="position:absolute;left:${gx}px;top:26px;width:${gw}px">${kick(t.gate,acc,15)}<div style="font:${e.dw} 38px/1.05 ${DF};color:${ink};margin-top:4px;text-transform:uppercase">Section Map</div></div>`;
  /* menu */
  const CX=MX+30,CWall=W-CX-34,colGap=26;
  const pr=prices(items,e,ei,egg);
  const mTop=118,noteH=winks.length?186:150,menuH=H-mTop-noteH-26;
  const tiers=[{d:30,n:22,g:18,h:32,nl:2},{d:28,n:21,g:16,h:30,nl:2},{d:26,n:19,g:14,h:26,nl:2},{d:24,n:18,g:11,h:24,nl:2},{d:22,n:17,g:9,h:22,nl:1},{d:21,n:16,g:7,h:21,nl:1},{d:20,n:15,g:6,h:20,nl:0},{d:18,n:14,g:5,h:18,nl:0}];
  const priceW=d=>d*2.4+8;
  let CW=(CWall-colGap)/2;
  const cH=(tr,k)=>tr.h*1.3+14+items[k].reduce((a,it)=>{const dl=Math.min(3,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),e.cwd));const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.3+(nl?3:0)+tr.g},0);
  /* best split of the courses into two columns, in order; one wide column when that fits bigger type */
  const split=tr=>{let best=null;for(let s=1;s<=C.length;s++){const a=C.slice(0,s).reduce((x,[k])=>x+cH(tr,k),0),b=C.slice(s).reduce((x,[k])=>x+cH(tr,k),0),m=Math.max(a,b);if(!best||m<best.m)best={s,m}}return best};
  let tr=tiers[tiers.length-1],sp=null,one=false;
  for(const x of tiers){CW=CWall;const h1=C.reduce((a,[k])=>a+cH(x,k),0);if(h1*1.04<=menuH){tr=x;sp={s:C.length,m:h1};one=true;break}
    CW=(CWall-colGap)/2;const q=split(x);if(q.m*1.04<=menuH){tr=x;sp=q;break}}
  if(!sp){CW=(CWall-colGap)/2;sp=split(tr)}
  const cgap=14+Math.min(30,Math.max(0,menuH-sp.m*1.04)/3);
  const head=l=>{
    if(e.bar==="grid")return `<div style="border:2px solid ${ink};padding:4px 10px;font:${e.dw} ${tr.h}px/1.1 ${DF};color:${ink};margin-bottom:8px;text-transform:uppercase;display:flex;justify-content:space-between"><span>${l}</span><span style="color:${acc};font-size:max(14px,.7em)">No. ${esc(num.slice(-2))}</span></div>`;
    if(e.bar==="pill")return `<div style="display:inline-block;background:${acc};color:${paper};border-radius:999px;padding:4px 16px;font:${e.dw} ${tr.h}px/1.1 ${DF};margin-bottom:8px;text-transform:uppercase">${l}</div>`;
    if(e.bar==="skew")return `<div style="display:inline-block;background:${band};color:${bandText};transform:skewX(-12deg);padding:3px 16px;margin-bottom:8px;border-left:8px solid ${acc}"><div style="transform:skewX(12deg);font:${e.dw} ${tr.h}px/1.1 ${DF};text-transform:uppercase">${l}</div></div>`;
    return `<div style="font:${e.dw} ${tr.h}px/1.1 ${DF};color:${acc};text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid ${acc};padding-bottom:4px;margin-bottom:8px;text-shadow:0 0 10px ${acc}">${l}</div>`;
  };
  const course=([k,l])=>`<div style="margin-bottom:${cgap}px">${head(l)}${items[k].map((it,i)=>{const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return `<div style="margin-bottom:${tr.g}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span style="flex:1;font:700 ${tr.d}px/1.15 ${BF};color:${ink};${clamp(3)}">${esc(tx(it.n))}</span><span style="font:${e.dw} ${tr.d}px/1.15 ${DF};color:${acc};white-space:nowrap">${pr[k][i]}</span></div>
      ${nl?`<div style="font:400 ${tr.n}px/1.3 ${BF};color:${soft};margin-top:3px;${clamp(nl)}">${esc(cap(tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`;
  const colA=C.slice(0,sp.s).map(course).join(""),colB=C.slice(sp.s).map(course).join("");
  const menuHead=`<div style="position:absolute;left:${CX}px;width:${CWall}px;top:26px">${kick(t.hawk,acc,15)}<div style="font:${e.dw} 44px/1.05 ${DF};color:${ink};margin-top:4px;text-transform:uppercase">Concessions</div></div>`;
  const menu=`<div style="position:absolute;left:${CX}px;width:${CWall}px;top:${mTop}px;height:${menuH}px;display:flex;gap:${colGap}px;overflow:hidden"><div style="flex:0 0 ${CW}px">${colA}</div>${one?"":`<div style="flex:0 0 ${CW}px">${colB}</div>`}</div>`;
  const nLen=clean(note.text).length,nSize=nLen>120?18:20;
  const noteBox=`<div style="position:absolute;left:${CX}px;width:${CWall}px;bottom:24px;border-top:3px solid ${acc};padding-top:10px">
    <div style="display:flex;gap:18px;align-items:flex-end"><div style="flex:1;font:italic 400 ${nSize}px/1.34 ${BF};color:${ink};${clamp(3)}">"${esc(note.text)}"</div>
    <div style="flex:none;font:400 ${ei<2?38:34}px/1 ${SF};color:${acc};max-width:230px;text-align:right">${esc(note.by)}</div></div>
    ${winks.length?`<div style="font:400 15px/1.3 ${BF};color:${soft};margin-top:8px;${clamp(1)}">On the big screen tonight: ${esc(winks.slice(0,2).join(". "))}.</div>`:""}
    <div style="font:400 15px/1.3 ${BF};color:${soft};margin-top:4px">Prices subject to change.${fam?" All drinks alcohol free.":""} ${esc(title.length>40?"":title+", "+year+". ")}Images: TMDB.</div></div>`;
  const back=`<div style="position:absolute;inset:0;background:${paper};overflow:hidden">${tex()}${mapHead}${tiles.join("")}<div style="position:absolute;left:${MX}px;top:30px;bottom:30px;width:2px;background:${mix(ink,paper,.7)}"></div>${menuHead}${menu}${noteBox}</div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
