
const _ROOT_diningcar=((document.currentScript&&document.currentScript.src)||"").replace(/menu-formats\/[^/]*$/,"");/* Format: diningcar. A railway dining car menu, two tall faces 600x1056.
   Front: railroad header, carriage photo (hero still), logo panel, steward's note, dinner timetable (signature), fine print.
   Back: window strip photo with a punched ticket (type only), bill of fare, lounge car fine print.
   Era sets type pairing, paper, border and print process; tone sets wear, photo treatment and copy voice. */
(function(){
const ID="diningcar",W=600,H=1056;

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
const SAMPLE="try{var i=this,c=document.createElement('canvas');c.width=64;c.height=Math.max(8,Math.round(64*i.naturalHeight/i.naturalWidth));var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);var d=x.getImageData(0,0,c.width,c.height).data,p=i.parentNode,f=function(h){h=h.replace('#','');return [0,2,4].map(function(j){var v=parseInt(h.substr(j,2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)})},Y=function(a){return .2126*a[0]+.7152*a[1]+.0722*a[2]},Ld=Y(f(p.getAttribute('data-dark'))),Ll=Y(f(p.getAttribute('data-light'))),cd=[],cl=[];for(var k=0;k<d.length;k+=4){if(d[k+3]<128)continue;var L=Y([d[k],d[k+1],d[k+2]].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}));cd.push((Math.max(L,Ld)+.05)/(Math.min(L,Ld)+.05));cl.push((Math.max(L,Ll)+.05)/(Math.min(L,Ll)+.05))}var m=function(a){a.sort(function(x,y){return x-y});return a[Math.floor(a.length*.15)]||1};if(cd.length&&m(cl)>m(cd)*1.08)p.style.background=p.getAttribute('data-light')}catch(e){}";
function logoImg(ctx,maxW,maxH){const L=ctx.logo;if(!L||!L[0]||!L[1]||!L[2])return null;const a=L[1]/L[2];let h=Math.min(maxH,maxW/a);if(h<34)return null;return{src:ctx.img(L[0],"w500"),w:Math.round(h*a),h:Math.round(h)}}
function photo(src,filter,pos,extra){return `<img src="${src}" crossorigin="anonymous" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos||"center 35%"};filter:${filter}">${extra||""}`}

/* self-fit: the tier is picked from a generous estimate; once fonts load, any course block that would clip is eased down a few percent (never below 88 percent) */
const FIT=`<img alt="" src="data:," style="display:none" onerror="var b=this.parentNode;this.remove();(document.fonts?document.fonts.ready:Promise.resolve()).then(function(){var k=[].slice.call(b.children).filter(function(c){return c.style.flex!=='1 1 auto'&&c.tagName!=='IMG'}),z=1;while(b.scrollHeight>b.clientHeight+1&&z>.89){z-=.02;k.forEach(function(c){c.style.zoom=z})}})">`;
/* ---------- era and tone ---------- */
const ERAS=["1930s-40s","1950s","1960s","1970s","1980s","1990s","2000s","modern"];
const E=[
 {disp:"'Noto Serif Display',serif",dw:900,body:"'Libre Baskerville',serif",sig:"'Mrs Saint Delafield',cursive",paper:"#efe3c4",ink:"#2b2118",acc:"#7a1f1f",border:"double",photo:"grayscale(1) contrast(1.12) brightness(1.04)",bar:"rule",cw:.62,cwd:.66,base:.55,clock:12,tt:"Dining Car Service",fare:"Bill of Fare",process:"letterpress"},
 {disp:"'Domine',serif",dw:700,body:"'Libre Baskerville',serif",sig:"'Allura',cursive",paper:"#f3e9d2",ink:"#2a2620",acc:"#8c2a1c",border:"double",photo:"saturate(.72) sepia(.2) contrast(1.05)",bar:"ribbon",cw:.6,cwd:.64,base:1.1,clock:12,tt:"Dining Car Service",fare:"Dinner Menu",process:"letterpress"},
 {disp:"'Mohave',sans-serif",dw:700,body:"'Source Serif 4',serif",sig:"'Allura',cursive",paper:"#f2f0e8",ink:"#1d2b2f",acc:"#0f6c74",border:"bands",photo:"saturate(1.12) sepia(.08) contrast(1.06)",bar:"block",cw:.54,cwd:.58,base:1.6,clock:12,tt:"Dining Car",fare:"Dinner Menu",process:"offset",dots:1},
 {disp:"'Mohave',sans-serif",dw:700,body:"'Source Serif 4',serif",sig:"'Allura',cursive",paper:"#f1e2c2",ink:"#3a2414",acc:"#c25a1c",border:"stripes",photo:"saturate(1.18) sepia(.22) contrast(1.04)",bar:"block",cw:.54,cwd:.58,base:2.4,clock:12,tt:"Cafe Car",fare:"Dinner Menu",process:"offset",dots:1},
 {disp:"'IBM Plex Sans Condensed',sans-serif",dw:700,body:"'Barlow',sans-serif",sig:"'Caveat',cursive",paper:"#f6f5f0",ink:"#1c1f26",acc:"#1d4e9e",border:"keyline",photo:"saturate(1.05) contrast(1.04)",bar:"tab",cw:.5,cwd:.54,base:4.5,clock:12,tt:"Cafe and Dining Car",fare:"Today's Menu",process:"laser"},
 {disp:"'IBM Plex Sans Condensed',sans-serif",dw:700,body:"'Barlow',sans-serif",sig:"'Caveat',cursive",paper:"#fafaf7",ink:"#16202a",acc:"#2c6b4f",border:"keyline",photo:"saturate(1.08) contrast(1.05)",bar:"tab",cw:.5,cwd:.54,base:6.5,clock:12,tt:"Dining Car",fare:"Today's Menu",process:"laser"},
 {disp:"'Sora',sans-serif",dw:700,body:"'Figtree',sans-serif",sig:"'Caveat',cursive",paper:"#ffffff",ink:"#14171c",acc:"#c8102e",border:"none",photo:"saturate(1.06) contrast(1.06)",bar:"line",cw:.56,cwd:.61,base:9,clock:24,tt:"Onboard Dining",fare:"Menu",process:"glossy"},
 {disp:"'Sora',sans-serif",dw:700,body:"'Figtree',sans-serif",sig:"'Caveat',cursive",paper:"#f3f3f0",ink:"#111418",acc:"#0b6e8a",border:"none",photo:"saturate(1.04) contrast(1.05)",bar:"line",cw:.56,cwd:.61,base:14,clock:24,tt:"Onboard Dining",fare:"Menu",process:"matte"}
];
const T={
 gritty:{wear:.55,vig:.38,photo:"contrast(1.1) saturate(.82)",paperTo:"#c9b48c",pt:.12,tilt:-1.5,hello:"Pay the steward. No credit past Chicago.",cap:"Out the window, somewhere past the yards.",lounge:"Heard in the smoking car"},
 glossy:{wear:.03,vig:.06,photo:"saturate(1.1) contrast(1.04)",shine:1,tilt:0,hello:"Fine dining at full speed.",cap:"Out the window, first class all the way.",lounge:"Heard in the club car"},
 warm:{wear:.2,vig:.22,photo:"sepia(.1) saturate(1.06) brightness(1.03)",tilt:-.8,hello:"Welcome aboard. Supper is on.",cap:"Out the window, the long way round.",lounge:"Heard in the lounge car"},
 eerie:{wear:.3,vig:.55,photo:"saturate(.6) brightness(.9) hue-rotate(-8deg)",paperTo:"#9aa6ad",pt:.16,tilt:0,hello:"Doors close without warning. Stay in your car.",cap:"Out the window. Do not open it.",lounge:"Heard between the cars"},
 playful:{wear:.06,vig:.1,photo:"saturate(1.2) brightness(1.04)",tilt:-3,hello:"All aboard, the kitchen is rolling.",cap:"Out the window, nearly there.",lounge:"Heard in the club car"},
 grand:{wear:.1,vig:.2,photo:"contrast(1.06) saturate(1.05)",tilt:0,hello:"With the compliments of the line.",cap:"Out the window, with the compliments of the line.",lounge:"Heard in the observation car"},
 tender:{wear:.16,vig:.2,photo:"saturate(.9) brightness(1.06) contrast(.96)",tilt:-1,hello:"Take your time. The view is the point.",cap:"Out the window, going home.",lounge:"Heard in the sleeper car"},
 tense:{wear:.24,vig:.4,photo:"contrast(1.2) saturate(.78)",paperTo:"#b9b2a2",pt:.1,tilt:0,hello:"Keep your ticket on you at all times.",cap:"Out the window. Someone is watching.",lounge:"Heard in the club car"},
 scrappy:{wear:.6,vig:.28,photo:"grayscale(.35) contrast(1.28)",paperTo:"#d8d0bc",pt:.2,tilt:-3.5,hello:"Cash only. Mind the gap between the cars.",cap:"Out the window, wherever this thing goes.",lounge:"Heard in the last car"}
};
loadFonts(["Noto+Serif+Display:wght@700;900","Domine:wght@700","Mohave:wght@600;700","IBM+Plex+Sans+Condensed:wght@600;700","Sora:wght@600;700","Libre+Baskerville:ital,wght@0,400;0,700;1,400","Source+Serif+4:ital,wght@0,400;0,700;1,400","Barlow:ital,wght@0,400;0,600;0,700;1,400","Figtree:ital,wght@0,400;0,700;1,400","Mrs+Saint+Delafield","Allura","Caveat:wght@600"]);

/* ---------- prices ---------- */
function money(v,ei){if(v<1&&ei<2)return "."+String(Math.round(v*100)).padStart(2,"0");return v.toFixed(2)}
function prices(menu,e,ei,egg){
  const mult={s:.55,m:1,w:.42,d:.28},out={};let hid=false;
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).map((it,i)=>{let v=e.base*mult[k]*(1+i*.12);v=ei<2?Math.round(v*20)/20:Math.floor(v)+(v%1<.5?.5:.95);
    if(!hid&&egg&&k==="w"){hid=true;v=Math.max(1,Math.floor(v))+(+egg)/100}return money(v,ei)});
  return out;
}

window.MENU_FORMATS[ID]=ctx=>{
  const f=ctx.f||{},ei=Math.max(0,ERAS.indexOf(ctx.era)),e=E[ei<0?7:ei],t=T[ctx.tone]||T.warm;
  const fam=FAMILY.has(f.theme),tx=s=>fam?dry(s):clean(s);
  const fl=ctx.flavour||{};
  const title=clean(f.title||"Tonight's Feature"),year=f.year||"";
  const venue=clean(fl.venue||(title.length<=20?title+" Dining Car":"The Dining Car")),sign=clean(fl.sign||"Dinner served at your seat");
  const note=fl.note&&fl.note.text?{text:fl.note.text,by:fl.note.by||"The Steward"}:{text:"Sit back and let the line look after you. Supper is served from the first call until the last stop.",by:"Your Steward"};
  const winks=(fl.winks||[]).map(clean).filter(Boolean);
  const prop=fl.prop&&fl.prop.title?fl.prop:{title:"Dining Car Seat",lines:["Present to the steward","One seat, one sitting"]};
  const num=String(fl.number||"").replace(/\D/g,"")||String(year).slice(-2)||"7";
  const egg=String(fl.number||year).replace(/\D/g,"").slice(-2)||"";
  /* paper and colours */
  let paper=t.paperTo?mix(e.paper,t.paperTo,t.pt):e.paper;
  const pal=ctx.palette||{};
  const ink=readable(pal.dark&&lum(pal.dark)<.06?pal.dark:e.ink,paper,9,e.ink);
  const acc=readable(pal.accent||e.acc,paper,4.5,e.acc);
  const soft=mix(ink,paper,.28);
  const band=readable(pal.dark||e.ink,"#ffffff",8,e.ink);
  const bandText=mix(paper,"#ffffff",.5);
  const grain=(ctx.root!=null?ctx.root:_ROOT_diningcar)+"assets/era/_shared/paper-grain.webp";
  const stills=(ctx.stills||[]).filter(Boolean);
  /* harness note: TMDB_POSTERS is a top-level const, so window.TMDB_POSTERS is undefined and ctx.poster arrives null */
  const poster=ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&TMDB_POSTERS[f.id||`${f.title} (${f.year})`])||null;
  /* the poster is the hero; stills only feed the secondary photos. No poster: first still in the poster slot. */
  const heroSrc=poster?ctx.img(poster,"w780"):stills[0]?ctx.img(stills[0],"w1280"):"";
  const heroIsPoster=!!poster;
  const backSrc=stills[1]?ctx.img(stills[1],"w1280"):stills[0]?ctx.img(stills[0],"w1280"):poster?ctx.img(poster,"w780"):"";
  const backIsPoster=!stills[1]&&!stills[0]&&!!poster;
  const heroPos=heroIsPoster?"center 22%":"center 40%",backPos="50% 50%";
  const pf=e.photo+" "+t.photo;
  const DF=e.disp,BF=e.body,SF=e.sig;
  const up=ei<6;  /* older cards set display in caps */
  const kick=(s,c,size)=>`<div style="font:700 ${size||15}px/1.2 ${BF};letter-spacing:${ei<6?".22em":".14em"};text-transform:uppercase;color:${c||acc};${clamp(1)}">${esc(s)}</div>`;
  const tex=(op)=>`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(40,25,10,${t.vig}) 100%)"></div><div style="position:absolute;inset:0;pointer-events:none;background:url(${grain}) center/1100px auto;opacity:${(op==null?.25+t.wear*1.1:op).toFixed(2)}"></div>`;
  const overlay=()=>(e.dots?`<div style="position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.16) 1px,transparent 1.4px) 0 0/4px 4px;mix-blend-mode:multiply"></div>`:"")+(t.shine||e.process==="glossy"?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 38%)"></div>`:"");
  const frame=()=>e.border==="double"?`<div style="position:absolute;inset:12px;border:4px double ${acc};pointer-events:none"></div>`:e.border==="keyline"?`<div style="position:absolute;inset:10px;border:2px solid ${acc};pointer-events:none"></div>`:"";

  /* ---------- FRONT ---------- */
  const inset=(e.border==="double"||e.border==="keyline")?22:0;
  const hdrH=92,PAD=9,pw=396,ph=594,heroH=ph+2*PAD,logoH=76;
  const sSize=sign.length>30?18:sign.length>20?20:22;
  const vSize=venue.length>26?28:venue.length>18?34:40;
  const header=`<div style="position:absolute;left:${inset}px;right:${inset}px;top:${inset}px;height:${hdrH}px;background:${band};display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 22px;box-sizing:border-box">
    ${e.border==="stripes"?`<div style="position:absolute;left:0;right:0;bottom:-18px;height:18px;background:linear-gradient(${acc} 0 6px,${mix(acc,"#e8b04a",.5)} 6px 12px,${mix(acc,"#f4d58a",.75)} 12px 18px)"></div>`:""}
    <div style="font:700 ${sSize-4}px/1.2 ${BF};letter-spacing:.2em;text-transform:uppercase;color:${mix(acc,"#ffffff",.55)};${clamp(1)}">${esc(sign)}</div>
    <div style="font:${e.dw} ${vSize}px/1.05 ${DF};color:${bandText};margin-top:6px;${up?"text-transform:uppercase;letter-spacing:.03em;":""}${clamp(2)}">${esc(venue)}</div></div>`;
  const heroTop=inset+hdrH+(e.border==="stripes"?18:0);
  const tagline=clean(f.T||"");
  const heroW=pw+2*PAD,colX=inset+heroW+16,colW=W-inset-colX-(inset?18:14);
  const hero=`<div style="position:absolute;left:${inset}px;width:${heroW}px;top:${heroTop}px;height:${heroH}px;overflow:hidden;background:${band}">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(0,0,0,0) 60%)"></div>
    <div style="position:absolute;left:${PAD}px;top:${PAD}px;width:${pw}px;height:${ph}px;overflow:hidden;background:#222;box-shadow:0 0 0 3px ${mix(paper,"#ffffff",.3)},0 0 0 4px ${acc},0 8px 18px rgba(0,0,0,.5)">
    ${heroSrc?(heroIsPoster?`<img src="${heroSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">${t.shine||e.process==="glossy"?`<div style="position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 38%)"></div>`:""}`:photo(heroSrc,pf,heroPos,overlay())):""}</div></div>`;
  const nLen0=clean(note.text).length,qSize=nLen0>130?15:16;
  const side=`<div style="position:absolute;left:${colX}px;width:${colW}px;top:${heroTop}px;height:${heroH}px;display:flex;flex-direction:column;justify-content:center;overflow:hidden">
      <div style="font:700 14px/1.2 ${BF};letter-spacing:.16em;text-transform:uppercase;color:${acc}">Now showing</div>
      <div style="height:2px;background:${acc};margin:8px 0 8px"></div>
      <div style="font:${e.dw} 40px/1 ${DF};color:${ink}">${esc(year)}</div>
      <div style="font:italic 400 ${qSize}px/1.32 ${BF};color:${ink};margin-top:14px;${clamp(9)}">"${esc(note.text)}"</div>
      <div style="font:400 ${ei<2?32:28}px/1 ${SF};color:${acc};text-align:right;margin-top:2px;${clamp(1)}">${esc(note.by)}</div>
      <div style="height:2px;background:${acc};margin-top:10px"></div>
      <div style="font:700 14px/1.2 ${BF};letter-spacing:.14em;text-transform:uppercase;color:${soft};margin-top:8px">${esc(e.tt)}</div></div>`;
  const lg=logoImg(ctx,W-2*inset-80,logoH-28);
  const tSize=title.length>40?24:title.length>24?32:title.length>12?40:50;
  const panelDark=mix(band,"#000000",.25),panelLight=mix(paper,"#ffffff",.5);
  const logo=`<div data-dark="${panelDark}" data-light="${panelLight}" style="position:absolute;left:${inset}px;right:${inset}px;top:${heroTop+heroH}px;height:${logoH}px;background:${panelDark};display:flex;align-items:center;justify-content:center;border-bottom:4px solid ${acc}">
    ${lg?`<img src="${lg.src}" crossorigin="anonymous" onload="${SAMPLE}" style="width:${lg.w}px;height:${lg.h}px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))">`
       :`<div style="font:${e.dw} ${tSize}px/1.05 ${DF};color:#fbf6ea;text-align:center;padding:0 24px;${up?"text-transform:uppercase;":""}${clamp(3)}">${esc(title)}</div>`}
    <div style="position:absolute;right:${12}px;bottom:6px;font:700 14px/1 ${BF};letter-spacing:.2em;color:${mix(acc,"#ffffff",.6)}">${esc(year)}</div></div>`;
  /* the steward's note */
  const noteTop=heroTop+heroH+logoH+4;/* note now sits beside the poster */
  const nLen=clean(note.text).length,nSize=nLen>130?17:nLen>90?18:19;
  const noteBox=`<div style="margin-bottom:4px">
    ${kick(t.hello,acc,14)}
    <div style="font:italic 400 ${nSize}px/1.34 ${BF};color:${ink};margin-top:6px;${clamp(3)}">"${esc(note.text)}"</div>
    <div style="font:400 ${ei<2?36:30}px/1 ${SF};color:${acc};text-align:right;margin-top:0">${esc(note.by)}</div></div>`;
  /* signature: the dinner timetable */
  const C=[["s",ei<2?"Relishes":"Starters"],["m",ei<2?"Entrees":"Mains"],["w","Desserts"],["d",ei<2?"Beverages":"Drinks"]].filter(([k])=>(ctx.menu[k]||[]).length);
  const tm=(h,m)=>e.clock===24?`${h+12}:${String(m).padStart(2,"0")}`:`${h}.${String(m).padStart(2,"0")} PM`;
  const times=[[5,30],[6,45],[8,0],[8,40]];
  const calls=["1st call","2nd call","3rd call","Last call"];
    const rows=C.map(([k,l],i)=>`<div style="display:flex;align-items:baseline;border-bottom:1px solid ${mix(ink,paper,.75)};padding:3px 0">
     <span style="flex:0 0 118px;font:700 15px/1.2 ${BF};letter-spacing:.12em;text-transform:uppercase;color:${soft}">${calls[i]}</span>
     <span style="flex:1;font:700 18px/1.2 ${BF};color:${ink}">${l}</span>
     <span style="font:${e.dw} 22px/1 ${DF};color:${acc}">${tm(...times[i])}</span></div>`).join("");
  const cue=clean(f.P||"");
  const timetable=`<div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid ${ink};padding-bottom:4px">
      <span style="font:${e.dw} 24px/1 ${DF};color:${ink};${up?"text-transform:uppercase;letter-spacing:.04em":""}">Dinner Timetable</span>
      <span style="font:700 15px/1 ${BF};letter-spacing:.16em;color:${acc}">TRAIN ${esc(num.slice(0,4))}</span></div>
    ${rows}
    ${cue?`<div style="font:italic 400 16px/1.35 ${BF};color:${soft};margin-top:7px;${clamp(1)}">Arriving: ${esc(cue.replace(/^./,c=>c.toLowerCase()))}</div>`:""}</div>`;
  const fine1=`<div style="position:absolute;left:${inset+30}px;right:${inset+30}px;bottom:${inset+12}px;font:400 15px/1.2 ${BF};color:${soft};display:flex;justify-content:space-between;gap:10px"><span style="${clamp(1)}">${esc(title.length>34?title.slice(0,32).replace(/\W+\w*$/,"")+"..." :title)}, ${esc(year)}</span><span>Form DC-${esc(num.slice(-4))}</span></div>`;
  const front=`<div style="position:absolute;inset:0;background:${paper};overflow:hidden">${tex()}${header}${hero}${side}${logo}<div style="position:absolute;left:${inset+30}px;right:${inset+30}px;top:${noteTop+6}px;bottom:${inset+34}px;overflow:hidden;display:flex;flex-direction:column;justify-content:center">${timetable}</div>${fine1}${frame()}</div>`;

  /* ---------- BACK ---------- */
  const SW=176;
  const tk=prop.title?clean(prop.title):"Dining Car Seat";
  const punch=Array.from({length:12},(_,i)=>i+1);
  const pIdx=(+num%12)||5;
  const ticket=`<div style="position:absolute;left:12px;width:${SW-24}px;bottom:58px;transform:rotate(${t.tilt}deg);background:${mix(paper,"#fff6d8",.4)};box-shadow:0 3px 10px rgba(0,0,0,.45);padding:12px 12px 10px;box-sizing:border-box;border-top:6px solid ${acc}">
    <div style="font:700 14px/1.2 ${BF};letter-spacing:.14em;text-transform:uppercase;color:${acc}">Ticket</div>
    <div style="font:${e.dw} 21px/1.05 ${DF};color:${ink};margin:4px 0 6px;${up?"text-transform:uppercase;":""}${clamp(3)}">${esc(tk)}</div>
    ${(prop.lines||[]).slice(0,2).map(l=>`<div style="font:400 14px/1.25 ${BF};color:${ink};${clamp(2)}">${esc(l)}</div>`).join("")}
    <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:8px">${punch.map(n=>`<span style="flex:0 0 22px;height:22px;display:flex;align-items:center;justify-content:center;font:700 14px/1 ${BF};${n===pIdx?`background:${band};color:${bandText};border-radius:50%`:`color:${soft};border:1px solid ${mix(ink,paper,.6)}`}">${n}</span>`).join("")}</div></div>`;
  const strip=`<div style="position:absolute;left:0;top:0;bottom:0;width:${SW}px;overflow:hidden;background:#222">${backSrc?(backIsPoster?`<img src="${backSrc}" crossorigin="anonymous" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block">`:photo(backSrc,pf,backPos,overlay())):""}
    <div style="position:absolute;inset:0;box-shadow:inset 0 0 0 10px ${band},inset 0 0 0 12px ${acc}"></div>
    <div style="position:absolute;left:10px;right:10px;top:10px;padding:10px 10px 30px;background:linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,0));font:italic 400 15px/1.3 ${BF};color:#fbf6ea">${esc(t.cap)}</div>
    ${ticket}</div>`;
  /* menu */
  const CX=SW+26,CW=W-CX-26-(e.border==="none"?0:10);
  const items={};C.forEach(([k])=>items[k]=(ctx.menu[k]||[]).slice(0,4));
  const pr=prices(items,e,ei,egg);
  const menuTop=118,lounge=winks.slice(0,2),fineTxt="Write your order on the check. Prices subject to change."+(fam?" All drinks alcohol free.":"")+" Images: TMDB.";
  const fineH=(lounge.length?26+lounge.length*20:0)+8+wrapLines(fineTxt,15,CW,e.cw+.04)*19.5+(e.border==="none"?20:26),menuH=H-menuTop-fineH-18;
  const tiers=[{d:30,n:22,g:20,h:38,nl:3},{d:28,n:21,g:18,h:34,nl:2},{d:26,n:19,g:14,h:30,nl:2},{d:24,n:18,g:11,h:28,nl:2},{d:22,n:17,g:9,h:26,nl:1},{d:21,n:16,g:7,h:24,nl:1},{d:20,n:15,g:6,h:22,nl:0},{d:18,n:14,g:5,h:20,nl:0},{d:16,n:14,g:3,h:18,nl:0}];
  let dmax=3;const priceW=d=>d*2.6+8;
  const heightOf=tr=>C.reduce((s,[k])=>s+tr.h*1.3+12+items[k].reduce((a,it)=>{const dl=Math.min(dmax,wrapLines(tx(it.n),tr.d,CW-priceW(tr.d),e.cwd));const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return a+dl*tr.d*1.15+nl*tr.n*1.32+(nl?3:0)+tr.g},0),0);
  let tr=null;for(const x of tiers)if(heightOf(x)*.9<=menuH){tr=x;break}
  if(!tr){tr=tiers[tiers.length-1];dmax=2}
  /* fill the column: when the bill of fare is short, a window photo takes the spare depth (flex, so it sizes to what is really left) */
  const est=heightOf(tr),spare0=Math.max(0,menuH-est);
  const winSrc=stills[2]?ctx.img(stills[2],"w1280"):stills[0]&&stills[1]?ctx.img(stills[0],"w1280"):"";
  const winPos=stills[2]?"50% 40%":heroPos;
  const usePhoto=winSrc&&spare0>230;
  const spare=usePhoto?Math.min(spare0,60):spare0,cgap=12+Math.min(usePhoto?20:56,spare/Math.max(1,C.length));
  const head=l=>{
    if(e.bar==="ribbon")return `<div style="display:inline-block;background:${acc};color:${paper};font:${e.dw} ${tr.h}px/1.15 ${DF};padding:2px 14px 3px;margin-bottom:8px;${up?"text-transform:uppercase;letter-spacing:.04em;":""}">${l}</div>`;
    if(e.bar==="block")return `<div style="background:${band};color:${bandText};font:${e.dw} ${tr.h}px/1.1 ${DF};padding:3px 10px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">${l}</div>`;
    if(e.bar==="tab")return `<div style="border-left:8px solid ${acc};padding-left:10px;font:${e.dw} ${tr.h}px/1.1 ${DF};color:${ink};margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">${l}</div>`;
    if(e.bar==="line")return `<div style="display:flex;align-items:center;gap:10px;font:${e.dw} ${tr.h-4}px/1.2 ${DF};color:${acc};margin-bottom:8px">${l}<span style="flex:1;height:2px;background:${acc}"></span></div>`;
    return `<div style="text-align:center;font:${e.dw} ${tr.h}px/1.15 ${DF};color:${ink};margin-bottom:8px;border-bottom:1px solid ${acc};padding-bottom:4px;text-transform:uppercase;letter-spacing:.06em">${l}</div>`;
  };
  const menuHtml=C.map(([k,l])=>`<div style="margin-bottom:${cgap}px">${head(l)}${items[k].map((it,i)=>{const nl=tr.nl?Math.min(tr.nl,wrapLines(tx(it.note),tr.n,CW,e.cw)):0;return `<div style="margin-bottom:${tr.g}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><span style="flex:1;font:700 ${tr.d}px/1.15 ${BF};color:${ink};${clamp(dmax)}">${esc(tx(it.n))}</span><span style="font:700 ${tr.d}px/1.15 ${BF};color:${acc};white-space:nowrap">${pr[k][i]}</span></div>
      ${nl?`<div style="font:${ei<2?"italic ":""}400 ${tr.n}px/1.32 ${BF};color:${soft};margin-top:3px;${clamp(nl)}">${esc(cap(tx(it.note)))}</div>`:""}</div>`}).join("")}</div>`).join("");
  const fH=e.fare;
  const backHead=`<div style="position:absolute;left:${CX}px;width:${CW}px;top:${e.border==="none"?30:34}px">
    ${kick(sign.length>26?"Served at your seat":sign,acc,14)}
    <div style="font:${e.dw} 44px/1.05 ${DF};color:${ink};margin-top:6px;${up?"text-transform:uppercase;letter-spacing:.03em;":""}">${fH}</div></div>`;
  const winPhoto=usePhoto?`<div style="flex:1 1 auto;min-height:0;position:relative;overflow:hidden;background:#222;box-shadow:0 0 0 2px ${acc};margin:4px 2px 2px">${photo(winSrc,pf,winPos,overlay())}<div style="position:absolute;left:0;right:0;bottom:0;padding:22px 12px 8px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.7));font:700 14px/1.2 ${BF};letter-spacing:.18em;text-transform:uppercase;color:#fbf6ea">${esc(e.tt)}, car ${esc(num.slice(-2))}</div></div>`:"";
  const menuBox=`<div data-est="${Math.round(est)}" data-tier="${tr.d}" style="position:absolute;left:${CX}px;width:${CW}px;top:${menuTop}px;height:${menuH}px;overflow:hidden;display:flex;flex-direction:column${usePhoto?"":";justify-content:space-between"}">${menuHtml.replace(new RegExp("margin-bottom:"+cgap+"px","g"),usePhoto?"margin-bottom:"+cgap+"px;flex:none":"flex:none")}${winPhoto}${FIT}</div>`;
  const fine2=`<div style="position:absolute;left:${CX}px;width:${CW}px;bottom:${e.border==="none"?20:26}px">
    ${lounge.length?`<div style="border-top:1px solid ${mix(ink,paper,.6)};padding-top:8px">${kick(t.lounge,acc,14)}${lounge.map(w=>`<div style="font:italic 400 15px/1.3 ${BF};color:${soft};margin-top:3px;${clamp(1)}">${esc(w)}.</div>`).join("")}</div>`:""}
    <div style="font:400 15px/1.3 ${BF};color:${soft};margin-top:8px">${esc(fineTxt)}</div></div>`;
  const back=`<div style="position:absolute;inset:0;background:${paper};overflow:hidden">${tex()}${strip}${backHead}${menuBox}${fine2}${e.border==="none"?"":`<div style="position:absolute;left:${SW+10}px;right:10px;top:10px;bottom:10px;border:${e.border==="double"?`4px double ${acc}`:`2px solid ${acc}`};pointer-events:none;${e.border==="bands"||e.border==="stripes"?"display:none":""}"></div>`}${e.border==="bands"||e.border==="stripes"?`<div style="position:absolute;left:${SW}px;right:0;top:0;height:14px;background:${band}"></div><div style="position:absolute;left:${SW}px;right:0;bottom:0;height:10px;background:${acc}"></div>`:""}</div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
