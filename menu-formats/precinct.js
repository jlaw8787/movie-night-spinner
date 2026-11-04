/* shared helper (same block in home, invite, precinct; first file to load wins) */
(function(){
if(window.__MNS)return;
const M=window.__MNS={};
const seen=new Set();
M.font=q=>{if(!q||seen.has(q))return;seen.add(q);const l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family="+q+"&display=swap";document.head.appendChild(l)};
M.clean=s=>String(s==null?"":s).replace(/\s*[\u2012\u2013\u2014\u2015]\s*/g,", ").replace(/\s+-+\s+/g,", ").replace(/--+/g,", ").trim();
M.esc=s=>M.clean(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
M.sent=s=>{s=M.clean(s);if(!s)return"";s=s.charAt(0).toUpperCase()+s.slice(1);return /[.!?]$/.test(s)?s:s+"."};
const DRY=[
/* kids' mode: whole drink names become named mocktails and cooking uses just lose the alcohol word, before any single-word swap (no "syrup Alexander") */
...(()=>{const cap=(m,v)=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v;const W="beer|stout|ale|guinness|lager|red wine|white wine|wine|cider|bourbon|whisky|whiskey|rum|brandy|sherry|marsala|tequila|vodka|sake|champagne";
 return [[/\bbrandy alexanders?\b/gi,m=>cap(m,"vanilla nutmeg milk")],[/\b(brandy|bourbon|whisky|whiskey|rum) milk punch\b/gi,m=>cap(m,"vanilla milk punch")],
  [new RegExp("\\b("+W+")[- ](battered)\\b","gi"),m=>cap(m,"crisp battered")],[new RegExp("\\b("+W+")[- ](braised|stewed)\\b","gi"),(m,a,b)=>cap(m,"slow-"+b.toLowerCase())],
  [new RegExp("\\b("+W+")[- ](glazed)\\b","gi"),m=>cap(m,"sticky glazed")],[new RegExp("\\b("+W+")[- ](marinated|poached|steamed|soaked|infused|spiked|cured)\\b","gi"),(m,a,b)=>cap(m,b.toLowerCase())],
  [/\b(red wine|white wine|rice wine|sherry|cider|champagne|malt) vinegar\b/gi,m=>m.replace(/(wine|sherry|cider|champagne|malt)/i,w=>w[0]+"\u200B"+w.slice(1))],
  [new RegExp("\\b("+W+"|port)[- ](jus|sauce|gravy|reduction|butter|glaze)\\b","gi"),(m,a,b)=>cap(m,"rich "+b.toLowerCase())],
  [/\brum balls?\b/gi,m=>cap(m,"choc coconut balls")],[/\birish coffee\b/gi,m=>cap(m,"Irish-style hot chocolate")],[/\bmimosas?\b/gi,m=>cap(m,"orange fizz")],
  [/\bshandy\b/gi,m=>cap(m,"lemon squash")],[/\b(gin|vodka) and tonic\b/gi,m=>cap(m,"lime and tonic")],[/\bmint juleps?\b/gi,m=>cap(m,"mint lemonade")],
  [/\bold fashioneds?\b/gi,m=>cap(m,"orange and cherry soda")],[/\bboilermakers?\b/gi,m=>cap(m,"ginger beer float")]]})(),
[/\b(red |white )?wine\b/gi,"grape juice"],[/\bchampagne\b|\bprosecco\b/gi,"sparkling apple"],[/\b(?<!root |ginger )beers?\b/gi,"root beer"],[/\bcocktails?\b/gi,"mocktail"],[/\b(rum|vodka|whisky|whiskey|bourbon|tequila|brandy|liqueur|gin|sake|baijiu)\b/gi,"syrup"]];
/* single-word swaps keep the capital at the start of a name ("Sparkling apple punch") */
DRY.forEach(r=>{const v=r[1];if(typeof v==="string"&&!v.includes("$"))r[1]=m=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v});
M.family=f=>["kids","fairytale","xmas"].includes(f&&f.theme);
M.dry=(s,on)=>on?DRY.reduce((t,[r,to])=>t.replace(r,to),M.clean(s)):M.clean(s);
M.courses=(menu,fam)=>["s","m","w","d"].map(k=>({k,items:((menu&&menu[k])||[]).filter(it=>it&&it.n).slice(0,4).map(it=>({n:M.dry(it.n,fam),note:M.sent(M.dry(it.note,fam))}))})).filter(c=>c.items.length);
M.hex=h=>{h=String(h||"").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return h.length!==6||isNaN(n)?null:[n>>16&255,n>>8&255,n&255]};
M.toHex=c=>"#"+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
M.lum=c=>{const a=c.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
M.cr=(a,b)=>{const A=M.lum(a),B=M.lum(b);return(Math.max(A,B)+.05)/(Math.min(A,B)+.05)};
/* film accent nudged until it reads on the stock (min contrast), else the format's own colour */
M.accent=(pal,bg,fb,min)=>{min=min||3.2;const B=M.hex(bg);let c=pal&&M.hex(pal.accent);if(!c||!B)return fb;
  const s=Math.max(...c)-Math.min(...c);if(s<40)return fb;const down=M.lum(B)>.35;
  for(let i=0;i<14&&M.cr(c,B)<min;i++)c=c.map(v=>down?v*.86:v+(255-v)*.18);return M.cr(c,B)>=min?M.toHex(c):fb};
M.darkOf=(pal,fb)=>{const c=pal&&M.hex(pal.dark);return c&&M.lum(c)<.08?M.toHex(c):fb};
/* poster path: ctx first, else the page-level TMDB_POSTERS const (not on window) */
M.poster=ctx=>ctx.poster||((typeof TMDB_POSTERS!=="undefined"&&!window.LIB_NO_POSTER)&&ctx.f&&TMDB_POSTERS[ctx.f.id])||null;
M.num=(n,y)=>{const d=String(n||"").replace(/[^0-9]/g,"");const t=String(y||"").slice(-2);return d||(t==="00"?String(y):t)||"7"};
M.noise=op=>"url('data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .12 0 0 0 0 .1 0 0 0 0 .08 0 0 0 ${op} 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`)+"')";
/* logo keeps its own colours: sample it, then give its panel the opposite stock */
M.logoTone=img=>{try{const c=document.createElement("canvas"),w=c.width=72,h=c.height=Math.max(8,Math.round(72*img.naturalHeight/img.naturalWidth)),x=c.getContext("2d");x.drawImage(img,0,0,w,h);
  const d=x.getImageData(0,0,w,h).data;let s=0,n=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;s+=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;n++}
  const L=n?s/n:.5,p=img.closest("[data-lpanel]");if(p)p.style.background=L>.46?p.dataset.dark:p.dataset.light}catch(e){}};
M.logoFail=img=>{const p=img.closest("[data-lpanel]");img.style.display="none";const t=p&&p.querySelector("[data-ltype]");if(t)t.style.display="block";if(p)p.style.background=p.dataset.type||p.style.background;M.fitAll()};
/* shrink-to-fit: [data-fit=min px] boxes have a fixed size and em-sized children */
const over=el=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;
M.fitAll=()=>document.querySelectorAll("[data-fit]").forEach(el=>{if(!el.isConnected||!el.getClientRects().length)return;
  const base=+(el.dataset.base||(el.dataset.base=parseFloat(el.style.fontSize)||20)),min=+el.dataset.fit||14;
  el.querySelectorAll("[data-opt],[data-item]").forEach(n=>n.style.display="");
  const shrink=()=>{let s=base,g=0;el.style.fontSize=s+"px";while(over(el)&&s>min&&g++<120){s=Math.max(min,s-.5);el.style.fontSize=s+"px"}};
  shrink();if(!over(el))return;
  /* still too much at the 14px floor: drop notes from the end, then whole items (first item per course stays), then grow back */
  const opts=[...el.querySelectorAll("[data-opt]")],its=[...el.querySelectorAll("[data-item]:not([data-keep])")];
  while(over(el)&&opts.length)opts.pop().style.display="none";
  while(over(el)&&its.length)its.pop().style.display="none";
  shrink()});
const run=()=>{cancelAnimationFrame(M.raf);M.raf=requestAnimationFrame(M.fitAll)};
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
if(document.fonts){document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",run);document.fonts.ready.then(run)}
[300,900,1600,2200].forEach(t=>setTimeout(run,t));
})();
/* format: precinct. A police precinct case file: folder front with evidence photo, file label and memo; inside sheet is the breakroom duty roster.
   2 faces, 816x1056. Era sets folder stock, form type, photo print; tone sets wear, stamps, contrast, voice. */
(function(){
const M=window.__MNS,W=816,H=1056;
const SIG="'Covered By Your Grace',cursive",SIGQ="Covered+By+Your+Grace";
const ERA={
 "1930s-40s":{d:"'Bitter',serif",dq:"Bitter:wght@400;700;800",b:"'Bitter',serif",bq:"",dw:800,folder:"#d6bd86",tab:"#cbb078",paper:"#f3ead6",ink:"#29231a",acc:"#7d2a1c",photo:"grayscale(1) sepia(.25) contrast(1.12)",pb:"14px 14px 30px",dept:"Homicide Bureau"},
 "1950s":{d:"'Zilla Slab',serif",dq:"Zilla+Slab:wght@700",b:"'Libre Franklin',sans-serif",bq:"Libre+Franklin:ital,wght@0,400;0,700;1,400",dw:700,folder:"#d9c591",tab:"#ccb680",paper:"#f7f2e3",ink:"#1f2228",acc:"#1f4f8a",photo:"grayscale(.92) contrast(1.15)",pb:"12px",dept:"Detective Division"},
 "1960s":{d:"'Pathway Gothic One',sans-serif",dq:"Pathway+Gothic+One",b:"'Public Sans',sans-serif",bq:"Public+Sans:ital,wght@0,400;0,700;1,400",dw:400,folder:"#cfb27a",tab:"#c3a56d",paper:"#f5f2e8",ink:"#24211c",acc:"#2d6a4f",photo:"sepia(.25) saturate(.8) contrast(1.05)",pb:"12px",dept:"Robbery Squad"},
 "1970s":{d:"'Sofia Sans Extra Condensed',sans-serif",dq:"Sofia+Sans+Extra+Condensed:wght@900",b:"'IBM Plex Sans',sans-serif",bq:"IBM+Plex+Sans:ital,wght@0,400;0,700;1,400",dw:900,folder:"#c6a66a",tab:"#b9985d",paper:"#f1e8d0",ink:"#2b2014",acc:"#a04015",photo:"sepia(.32) saturate(1.1) contrast(.96)",pb:"12px 12px 28px",dept:"Narcotics Unit"},
 "1980s":{d:"'Barlow Condensed',sans-serif",dq:"Barlow+Condensed:wght@800",b:"'Barlow',sans-serif",bq:"Barlow:ital,wght@0,400;0,700;1,400",dw:800,folder:"#e2c27c",tab:"#d6b46c",paper:"#fbf8ee",ink:"#1b1b22",acc:"#b3261e",photo:"saturate(1.1) contrast(1.1)",pb:"12px",dept:"Major Crimes"},
 "1990s":{d:"'Saira Condensed',sans-serif",dq:"Saira+Condensed:wght@800",b:"'Libre Franklin',sans-serif",bq:"Libre+Franklin:ital,wght@0,400;0,700;1,400",dw:800,folder:"#8eabc6",tab:"#7d9cb9",paper:"#ffffff",ink:"#17202b",acc:"#1d4e89",photo:"saturate(1.05) contrast(1.05)",pb:"10px",dept:"Special Investigations"},
 "2000s":{d:"'Encode Sans Condensed',sans-serif",dq:"Encode+Sans+Condensed:wght@800",b:"'Arimo',sans-serif",bq:"Arimo:ital,wght@0,400;0,700;1,400",dw:800,folder:"#c45a4c",tab:"#b54e41",paper:"#ffffff",ink:"#1a1a1d",acc:"#b0342a",photo:"contrast(1.12) saturate(.95)",pb:"8px",dept:"Precinct Desk"},
 "modern":{d:"'Inter Tight',sans-serif",dq:"Inter+Tight:wght@900",b:"'Inter',sans-serif",bq:"Inter:ital,wght@0,400;0,700;1,400",dw:900,folder:"#a3a9ae",tab:"#959ba1",paper:"#ffffff",ink:"#121417",acc:"#c23a2b",photo:"none",pb:"6px",dept:"Case Management"}
};
const TONE={
 gritty:{wear:.55,vig:.4,photo:"contrast(1.18) saturate(.75)",tilt:1.2,stamp:"Case open",memo:"From the desk of"},
 glossy:{wear:.08,vig:.12,photo:"saturate(1.1) contrast(1.05)",tilt:.3,stamp:"Priority",memo:"Office of"},
 warm:{wear:.22,vig:.2,photo:"sepia(.08)",tilt:.8,stamp:"Lunch approved",memo:"From the desk of"},
 eerie:{wear:.35,vig:.55,photo:"saturate(.5) brightness(.92) contrast(1.12)",tilt:.6,stamp:"Unsolved",memo:"Found on the desk of"},
 playful:{wear:.12,vig:.1,photo:"saturate(1.18) brightness(1.03)",tilt:2,stamp:"Case closed, mostly",memo:"Urgent memo from"},
 grand:{wear:.14,vig:.25,photo:"contrast(1.08)",tilt:.3,stamp:"Commendation",memo:"Office of"},
 tender:{wear:.18,vig:.22,photo:"brightness(1.04) sepia(.1)",tilt:.6,stamp:"Personal",memo:"A word from"},
 tense:{wear:.32,vig:.42,photo:"contrast(1.25) saturate(.65)",tilt:.6,stamp:"Clock is running",memo:"From the desk of"},
 scrappy:{wear:.45,vig:.2,photo:"contrast(1.28) saturate(.8)",tilt:2.4,stamp:"Paperwork pending",memo:"Sticky note from"}
};
const SHIFT={s:["Day Watch","Starters"],m:["Swing Shift","Mains"],w:["Graveyard","Sweets"],d:["Desk Duty","Drinks"]};

window.MENU_FORMATS=window.MENU_FORMATS||{};
window.MENU_FORMATS.precinct=function(ctx){
  const f=ctx.f||{},E=ERA[ctx.era]||ERA.modern,T=TONE[ctx.tone]||TONE.warm,x=M.esc,fam=M.family(f);
  [E.dq,E.bq,SIGQ].forEach(M.font);
  const fl=ctx.flavour||{},nt=fl.note&&fl.note.text?fl.note:{text:"Eat at your desk if you have to, but eat. The paperwork will still be here after the film.",by:"The Captain"};
  const venue=fl.venue||"Precinct Breakroom",sign=fl.sign||"Open all shifts";
  const winks=(fl.winks&&fl.winks.length?fl.winks:["Coffee pot on all night","Fresh doughnuts by the sergeant's desk","Lights out at roll call"]).slice(0,5).map(w=>M.dry(w,fam));
  const num=M.num(fl.number,f.year),yy=String(f.year||"").slice(-2);
  const ink=E.ink,paper=E.paper,acc=M.accent(ctx.palette,paper,E.acc,4),dark=M.darkOf(ctx.palette,"#16171b");
  const st=ctx.stills||[],pos=M.poster(ctx)?ctx.img(M.poster(ctx),"w780"):"";
  const st0=st[0]?ctx.img(st[0],"w1280"):"",hero=pos||st0,heroP=!!pos,second=st[1]?ctx.img(st[1],"w1280"):(st0||pos),secP=!st[1]&&!st0&&!!pos;
  const C=M.courses(ctx.menu,fam);
  const bd=E.b,dd=E.d;
  /* coin-op breakroom prices with the film's number hidden in the cents */
  const n2=+(String(num).slice(-2))||48;
  /* mains always above starters and sweets (4 to 6 against 1 to 3), and a drink with spirits two dollars above the rest */
  const price=(k,i,n)=>{const base={s:1,m:4,w:1,d:1}[k],c=(n2+i*17+(k==="m"?25:k==="d"?60:0))%100,sp=k==="d"&&/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|mezcal|brandy|cognac|cocktail|martini|boilermaker|negroni|margarita|spritz|old fashioned|manhattan|sour|daiquiri|mojito|julep|highball|shots?|liqueur|schnapps|vodka)\b/i.test(String(n||""))?2:0;return `${base+(i%3)+sp}.${String(c).padStart(2,"0")}`};
  const grain=M.noise(T.wear);
  /* manila folder: stock colour, tab, grain, wear on the edges */
  const folder=(tabTxt,tabLeft)=>`<div style="position:absolute;inset:0;background:#3a3631"></div>
    <div style="position:absolute;left:${tabLeft}px;top:8px;width:300px;height:64px;background:${E.tab};border-radius:12px 12px 0 0;box-shadow:inset 0 2px 0 rgba(255,255,255,.25)"></div>
    <div style="position:absolute;left:${tabLeft+22}px;top:20px;width:256px;height:36px;box-sizing:border-box;padding:0 12px;background:#fdfbf4;display:flex;align-items:center;font:700 18px/1 ${bd};letter-spacing:.12em;text-transform:uppercase;color:${ink};white-space:nowrap;overflow:hidden">${tabTxt}</div>
    <div style="position:absolute;left:0;right:0;top:56px;bottom:0;background:${E.folder};border-radius:4px 4px 0 0"></div>
    <div style="position:absolute;left:0;right:0;top:56px;bottom:0;background-image:${grain};opacity:.9"></div>
    <div style="position:absolute;left:0;right:0;top:56px;bottom:0;box-shadow:inset 0 0 ${40+60*T.wear}px rgba(80,50,10,${(.25+T.wear*.5).toFixed(2)})"></div>
    <div style="position:absolute;left:0;right:0;top:56px;bottom:0;background:radial-gradient(ellipse at 50% 40%,transparent 60%,rgba(0,0,0,${(T.vig*.5).toFixed(2)}) 100%)"></div>`;
  const stamp=(t,r,tp,rot,col,size)=>`<div style="position:absolute;right:${r}px;top:${tp}px;max-width:224px;white-space:normal;text-align:center;transform:rotate(${rot}deg);padding:6px 14px;border:4px double ${col};color:${col};font:${E.dw} ${size||30}px/1 ${dd};letter-spacing:.08em;text-transform:uppercase;opacity:.82;mix-blend-mode:multiply">${x(t)}</div>`;
  const kick=(t,c)=>`<div style="font:700 16px/1.2 ${bd};letter-spacing:.2em;text-transform:uppercase;color:${c||acc}">${x(t)}</div>`;

  /* poster frame hugs a 2:3 poster; right column holds logo and memo */
  const pv=E.pb.split(" ").map(v=>parseFloat(v)),pT=pv[0],pR=pv[1]==null?pT:pv[1],pB=pv[2]==null?pT:pv[2];
  const IH=690,FH=IH+pT+pB,FW=Math.round(IH*2/3+2*pR),FT=108,RX=36+FW+22,RW=780-RX,FB=FT+FH;
  /* logo in its own colours on a case label that suits it */
  const lg=ctx.logo,lr=lg&&lg[1]&&lg[2]?lg[1]/lg[2]:0,lw=lr?(heroP?Math.min(RW-40,96*lr):Math.min(330,96*lr)):0,lh=lr?lw/lr:0;
  const lpH=heroP?(lr?Math.round(lh+28):104+28):0;
  const logo=`<div data-lpanel data-dark="rgba(16,16,20,.9)" data-light="rgba(252,250,244,.94)" data-type="${dark}" style="position:absolute;left:${heroP?RX:64}px;top:${heroP?FT+4:(lr?Math.round(640-lh-40):520)}px;max-width:${heroP?RW:340}px;box-sizing:border-box;padding:14px 20px;background:${lr?"rgba(16,16,20,.9)":dark};box-shadow:0 8px 20px rgba(0,0,0,.4);transform:rotate(${-T.tilt*.5}deg)">
     ${lr?`<img src="${ctx.img(lg[0],"w500")}" crossorigin="anonymous" alt="${x(f.title)}" onload="window.__MNS&&__MNS.logoTone(this)" onerror="window.__MNS&&__MNS.logoFail(this)" style="display:block;width:${lw}px;height:${lh}px;object-fit:contain">`:""}
     <div data-ltype data-fit="22" style="display:${lr?"none":"block"};width:${heroP?RW-40:440}px;height:104px;overflow:hidden;font:${E.dw} 48px/1 ${dd};text-transform:uppercase;color:#fff;font-size:48px">${x(f.title)}</div>
   </div>`;
  const evid=(src,l,t,w,h,rot,op,tag,pad,isP)=>`<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;box-sizing:border-box;padding:${pad||E.pb};background:#fbfaf6;transform:rotate(${rot}deg);box-shadow:0 14px 30px rgba(0,0,0,.4),0 2px 4px rgba(0,0,0,.3)">
     <div style="position:relative;width:100%;height:100%;overflow:hidden;background:#222">
      ${src&&isP?`<img src="${src}" crossorigin="anonymous" alt="" style="position:absolute;left:-20px;top:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(16px) brightness(.55)"><img src="${src}" crossorigin="anonymous" alt="" style="position:relative;display:block;width:100%;height:100%;object-fit:contain">`:src?`<img src="${src}" crossorigin="anonymous" alt="" style="display:block;width:100%;height:100%;object-fit:cover;object-position:${op};filter:${E.photo==="none"?"":E.photo} ${T.photo}">`:""}
      ${isP?"":`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 58%,rgba(0,0,0,${(T.vig*.8).toFixed(2)}) 100%)"></div>`}
     </div>
     <div style="position:absolute;left:-10px;top:${isP?-36:-14}px;padding:6px 12px;background:#fffdf5;box-shadow:0 3px 8px rgba(0,0,0,.3);transform:rotate(-3deg);font:${E.dw} 22px/1 ${dd};letter-spacing:.08em;text-transform:uppercase;color:${ink}">${x(tag)}</div>
   </div>`;

  const field=(k,v)=>`<div style="display:flex;gap:.6em;align-items:baseline;border-bottom:1px solid rgba(0,0,0,.18);padding:.18em 0"><span style="flex:none;width:6.6em;font:700 .8em/1.2 ${bd};letter-spacing:.14em;text-transform:uppercase;color:${acc}">${x(k)}</span><span style="font:1em/1.25 ${bd};color:${ink}">${v}</span></div>`;
  const pbv=E.pb.split(" ").map(v=>parseFloat(v)),pbT=pbv[0],pbR=pbv[1]==null?pbT:pbv[1],pbB=pbv[2]==null?pbT:pbv[2];
  const PW=Math.round((532-pbT-pbB)*2/3+2*pbR);
  const fields=`${field("Location",`<b>${x(venue)}</b>`)}${field("Posted",x(sign))}${field("Division",`${x(E.dept)}, ${x(f.year||"")}`)}${field("On file",x(winks[0]||"")+(winks[1]?`<span data-item>; ${x(winks[1])}</span>`:""))}`;
  const front=`${folder(fl.number?`Case ${x(num)}-${x(yy)}`:`Case file ${x(f.year||"")}`,40)}
   ${heroP?evid(hero,36,FT,FW,FH,-T.tilt*.4,"center","Now showing",null,true):evid(hero,36,96,744,548,-T.tilt*.4,"center 40%","Exhibit A")}
   ${logo}
   ${heroP?"":`<div style="position:absolute;left:40px;top:672px;width:736px;height:166px;box-sizing:border-box;padding:12px 18px;background:#fffdf6;box-shadow:0 4px 12px rgba(0,0,0,.25);transform:rotate(${T.tilt*.2}deg)">
     <div data-fit="14" style="height:142px;overflow:hidden;font-size:20px">
      ${fields}
     </div>
   </div>
   <div style="position:absolute;left:44px;top:846px;width:500px;height:186px;box-sizing:border-box;padding:12px 18px;background:${T.memo==="Sticky note from"?"#fbe98a":"#fffef8"};box-shadow:0 6px 14px rgba(0,0,0,.3);transform:rotate(${-T.tilt*.7}deg)">
     ${kick(`${T.memo} ${nt.by}`)}
     <div data-fit="14" style="height:92px;overflow:hidden;margin-top:6px;font:20px/1.32 ${bd};font-size:20px;color:${ink}">${x(nt.text)}</div>
     <div style="font:34px/1 ${SIG};color:#1d3a8a;text-align:right;white-space:nowrap;overflow:hidden">${x(nt.by)}</div>
   </div>
   ${stamp(T.stamp,28,872,-8+T.tilt,acc,T.stamp.length>14?22:30)}
   ${stamp(`Breakroom copy`,40,976,4-T.tilt,"#2b2b2b",18)}`}
   ${heroP?(()=>{const mT=FT+4+lpH+22,mH=FB-mT,sT=FB+18,sH=Math.min(166,1040-sT);return `<div style="position:absolute;left:${RX}px;top:${mT}px;width:${RW}px;height:${mH}px;box-sizing:border-box;padding:12px 16px;display:flex;flex-direction:column;background:${T.memo==="Sticky note from"?"#fbe98a":"#fffef8"};box-shadow:0 6px 14px rgba(0,0,0,.3);transform:rotate(${-T.tilt*.5}deg)">
     <div style="flex:none">${kick(`${T.memo} ${nt.by}`)}</div>
     <div data-fit="14" style="flex:1 1 0;min-height:0;overflow:hidden;margin:8px 0;font:20px/1.32 ${bd};font-size:20px;color:${ink}">${x(nt.text)}</div>
     <div style="flex:none;font:30px/1 ${SIG};color:#1d3a8a;text-align:right;white-space:nowrap;overflow:hidden">${x(nt.by)}</div>
   </div>
   <div style="position:absolute;left:40px;top:${sT}px;width:480px;height:${sH}px;box-sizing:border-box;padding:12px 18px;background:#fffdf6;box-shadow:0 4px 12px rgba(0,0,0,.25);transform:rotate(${T.tilt*.2}deg)">
     <div data-fit="14" style="height:${sH-24}px;overflow:hidden;font-size:20px">
      ${fields}
     </div>
   </div>
   ${stamp(T.stamp,28,sT+6,-8+T.tilt,acc,T.stamp.length>14?22:30)}
   ${stamp(`Breakroom copy`,40,sT+sH-52,4-T.tilt,"#2b2b2b",18)}`})():""}`;

  const shift=c=>`<div style="margin-bottom:.6em">
     <div style="display:flex;justify-content:space-between;align-items:baseline;background:${dark};color:#fbf7ee;padding:.18em .45em;margin-bottom:.3em"><span style="font:${E.dw} 1.15em/1.1 ${dd};text-transform:uppercase;letter-spacing:.04em">${SHIFT[c.k][0]}</span><span style="flex:none;margin-left:.5em;font:.72em/1.2 ${bd};letter-spacing:.14em;text-transform:uppercase">${SHIFT[c.k][1]}</span></div>
     ${c.items.map((it,i)=>`<div data-item${i?"":" data-keep"} style="padding:.15em .1em .3em;border-bottom:1px solid rgba(0,0,0,.12)"><div style="display:flex;gap:.5em;justify-content:space-between;align-items:baseline"><span style="font:700 1em/1.15 ${bd};color:${ink}">${x(it.n)}</span><span style="flex:none;font:700 1em/1.15 ${bd};color:${acc}">${price(c.k,i,it.n)}</span></div>${it.note?`<div data-opt style="font:.76em/1.3 ${bd};color:${ink};opacity:.85">${x(it.note)}</div>`:""}</div>`).join("")}
   </div>`;
  const half=Math.ceil(C.length/2);
  const col=cs=>`<div data-fit="20" style="width:344px;height:100%;overflow:hidden;font-size:26px">${cs.map(shift).join("")}</div>`;
  const back=`${folder(`Duty roster ${x(yy)}`,476)}
   <div style="position:absolute;left:26px;top:74px;width:764px;height:966px;background:${paper};box-shadow:0 6px 16px rgba(0,0,0,.35);transform:rotate(${T.tilt*.15}deg)">
     <div style="position:absolute;inset:0;background-image:${M.noise(T.wear*.5)}"></div>
     <div style="position:absolute;left:26px;right:26px;top:20px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${ink};padding-bottom:8px">
       <div style="max-width:470px"><div style="font:${E.dw} 54px/.95 ${dd};text-transform:uppercase;color:${ink}">Duty Roster</div>
         <div style="font:700 18px/1.25 ${bd};letter-spacing:.14em;text-transform:uppercase;color:${acc};margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:clip">${x(venue)}</div></div>
       <div style="text-align:right;font:16px/1.35 ${bd};color:${ink}">Form ${x(num)}-B<br>Breakroom, all shifts<br>Coins only</div>
     </div>
     ${evid(second,26,128,712,340,-T.tilt*.3,"center 40%","Surveillance","10px",secP)}
     <div style="position:absolute;left:26px;top:490px;width:712px;height:424px;display:flex;justify-content:space-between">
       ${C.length?col(C.slice(0,half))+col(C.slice(half)):`<div style="font:22px/1.4 ${bd};color:${ink}">Breakroom closed. Try the vending machine.</div>`}
     </div>
     <div style="position:absolute;left:26px;right:26px;bottom:14px;border-top:1px solid rgba(0,0,0,.25);padding-top:6px;font:16px/1.3 ${bd};color:${ink};opacity:.85">Prices subject to change. Exact change only. ${fam?"Every drink alcohol free. ":""}Photos: TMDB. Filed ${x(f.year||"")}.</div>
   </div>`;
  return {w:W,h:H,faces:[front,back]};
};
})();
