/* offline: a photo that isn't saved on this device shows a plain tinted frame in its slot, never a broken image icon.
   The frame is a real picture drawn here, so Save PDF and Print show the same frame. Grey at low strength suits dark and light cards alike */
const IMG_PH={};
function imgPhSrc(r){const k=r>1.3?"wide":r<.85?"tall":"sq";if(IMG_PH[k])return IMG_PH[k];
  const W=k==="wide"?640:400,H=k==="wide"?360:k==="tall"?600:400,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  x.fillStyle="rgba(128,128,128,.2)";x.fillRect(0,0,W,H);x.strokeStyle="rgba(128,128,128,.32)";x.lineWidth=4;x.strokeRect(2,2,W-4,H-4);
  /* a small strip of film in the middle */
  const g=Math.min(W,H)*.2,fw=g*1.5,fh=g,fx=(W-fw)/2,fy=(H-fh)/2;x.fillStyle="rgba(128,128,128,.4)";x.fillRect(fx,fy,fw,fh);
  x.globalCompositeOperation="destination-out";x.fillRect(fx+fw*.12,fy+fh*.24,fw*.76,fh*.52);const hw=fw/11;for(let i=0;i<5;i++){x.fillRect(fx+hw*(1+2*i),fy+fh*.06,hw,fh*.1);x.fillRect(fx+hw*(1+2*i),fy+fh*.84,hw,fh*.1)}
  return IMG_PH[k]=c.toDataURL("image/png")}
function imgRatio(im){const a=+im.getAttribute("width"),b=+im.getAttribute("height");if(a&&b)return a/b;
  const r=im.getBoundingClientRect();if(r.width>40&&r.height>40)return r.width/r.height;
  const s=im.getAttribute("src")||"";return /\/w(780|1280|original)\/|still|backdrop/i.test(s+im.className)?16/9:/\/w92\/|snacks\/|logo/i.test(s+im.className)?1:2/3}
function imgPh(im){if(im.classList.contains("img-ph")&&/^data:/.test(im.src))return;const r=imgRatio(im);
  im.removeAttribute("srcset");im.removeAttribute("sizes");if(im.parentElement&&im.parentElement.tagName==="PICTURE")im.parentElement.querySelectorAll("source").forEach(x=>x.remove());
  im.classList.add("img-ph");if(!im.style.objectFit)im.style.objectFit="cover";im.src=imgPhSrc(r)}
document.addEventListener("error",e=>{const t=e.target;if(t&&t.tagName==="IMG"&&(t.getAttribute("src")||"").length)imgPh(t)},true);
document.querySelectorAll("img").forEach(im=>{if(im.complete&&!im.naturalWidth&&(im.getAttribute("src")||"").length)imgPh(im)});

/* a note cut short never ends on a joining word ("with yellow mustard and."): those come off, and a lone word left after a comma goes with them */
window.noDangle=function(t){t=String(t||"");const D=/\s+(and|with|of|in|the|a|an|is|to|for|or|on|at|by|from|into|under|over|but|so|as|its|his|her|their|our|your|my)$/i;
  let s=t.replace(/[\s.,;:]+$/,"");const s0=s;for(let n=0;n<4&&D.test(s);n++)s=s.replace(D,"").replace(/[\s,;:]+$/,"");
  if(s===s0)return t;s=s.replace(/,\s*\S+$/,"");return s+(/[.!?]\s*$/.test(t)?".":"")};
/* prices that make sense on their own card, for shared layouts: every main above every starter and sweet, a drink with spirits above every plain drink and sweet; a raised price keeps its own cents (the film's number lives there) and the card's price style, and nothing prints as 100 cents */
window.priceSense=function(menu,P){const SP=/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|mezcal|brandy|cognac|cocktail|martini|boilermaker|negroni|margarita|spritz|old fashioned|manhattan|daiquiri|mojito|julep|highball|shots?|liqueur|schnapps|colada|sangria|champagne|prosecco|wine|toddy|rob roy|sazerac|sidecar|gimlet|mai tai|grog|mead|sake|bellini|cosmopolitan|collins|sherry|blue lagoon|curacao|mimosa|bellini|shandy)\b/i;
  const all=[].concat(...["s","m","w","d"].map(k=>P[k]||[])).map(String),cents=all.some(x=>/¢|\dc$/.test(x)),csym=all.some(x=>/\dc$/.test(x))?"c":"¢",dot=all.some(x=>/^\D*\.\d\d$/.test(x));
  const val=x=>{x=String(x);const n=parseFloat(x.replace(/[^\d.]/g,""));return isNaN(n)?null:/¢|\dc$/.test(x)?n/100:n};
  const fmt=(v,o)=>{o=String(o);const pre=(o.match(/^[^\d.]*/)||[""])[0].replace("¢",""),post=/¢|\dc$/.test(o)?"":(o.match(/[^\d.]*$/)||[""])[0];
    if(v<.975){const c=Math.max(5,Math.ceil(v*20)*5);return cents?c+csym:dot?pre+"."+String(c).padStart(2,"0"):pre+"0."+String(c).padStart(2,"0")}
    if(!/\./.test(o)&&!/¢|\dc$/.test(o))return pre+String(Math.ceil(v))+post;
    return pre+v.toFixed(2)+post};
  /* a raised price keeps its cents only when they read like a price (.95, .50, .25); otherwise it lands on one of those, never .12 or .31 */
  const lift=(t,o)=>{const ov=val(o),oc=Math.round((ov%1)*100);let fr=ov>=1&&oc%5===0?oc/100:[.25,.5,.95][Math.round(t*7)%3],v=Math.floor(t)+fr;if(v<t-1e-9)v+=1;if(t<.975)v=t;return fmt(v,o)};
  const out={};for(const k of ["s","m","w","d"])out[k]=(P[k]||[]).map(x=>{const v=val(x);return v!=null&&/¢|\dc$/.test(String(x))&&v>=.975?fmt(v,"1.00"):x});
  const nums=k=>(out[k]||[]).map(val).filter(v=>v!=null),sw=Math.max(0,...nums("s"),...nums("w"));
  out.m=(out.m||[]).map((x,i)=>{const v=val(x);return v!=null&&sw&&v<=sw?lift(sw*(1.15+.08*i),x):x});
  /* a card extra (no tested recipe) never prices above the mains cooked tonight, unless it is a premium dish (13 Nov, Josh): steak, seafood,
     a roast or surf and turf may sit above a plain cooked main, and only steps under a premium one. Prices here come from list place, not the
     film, so a plain extra (pizza, dogs, a fry-up) still sits under the cooked mains; before, a lobster roll or surf and turf did too */
  {const PREM=/\b(steaks?|sirloin|rib ?eye|ribeye|t-bone|porterhouse|new york strip|strip steak|filet|fillet steak|eye fillet|wagyu|prime rib|surf and turf|lobster|crayfish|crab|prawns?|shrimp|scallops?|oysters?|salmon|barramundi|barra|snapper|duck|lamb (rack|cutlets?|shanks?|leg)|rack of lamb|roast (beef|lamb|pork|leg)|sunday roast|beef wellington|wellington|veal|venison|chateaubriand|seafood|bourguignon)\b/i;
   const ms=(menu.m||[]),prem=i=>!!ms[i]&&PREM.test((ms[i].n||"")+" "+(ms[i].note||""));
   const top=pr=>Math.max(0,...(out.m||[]).map((x,i)=>ms[i]&&!ms[i].extra&&(!pr||prem(i))?val(x)||0:0));
   const cmAll=top(false),cmPrem=top(true);
   out.m=(out.m||[]).map((x,i)=>{const v=val(x),cm=prem(i)?cmPrem:cmAll;if(!cm||!ms[i]||!ms[i].extra||v==null||v<cm)return x;const t=Math.max(sw*1.05,cm*(.88-.04*i));if(t>=cm)return x;let w=Math.floor(t)+(t%1<.5?.5:.95);if(w>=cm)w=Math.floor(t);return fmt(cm>=2&&w>sw?w:t,x)});
   /* two mains on one price: the later one moves to the next price ending, down for an extra held under the cooked mains (so it stays
      under them), up otherwise */
   for(let g=0;g<4;g++){const F=(out.m||[]).map(val);let hit=false;F.forEach((v,i)=>{if(v==null||!F.slice(0,i).includes(v))return;hit=true;
     const held=ms[i]&&ms[i].extra&&!(prem(i)&&!cmPrem);let d=null;
     if(held){for(const t of [v*.93,v*.86,v*.8]){const w=v>=2?Math.floor(t)+(t%1<.5?.5:.95):t,x=fmt(w>=v?Math.floor(t):w,out.m[i]),xv=val(x);if(xv!=null&&xv<v&&xv>sw&&!F.includes(xv)){d=x;break}}
       /* no room under it (the starters sit just below): a price between it and the cooked main above, if one is free (Better Off Dead 3.25) */
       const cm=prem(i)?cmPrem:cmAll;if(!d&&cm>v)for(let b=Math.floor(v);b<=Math.floor(cm)&&!d;b++)for(const c of [.25,.5,.75,.95]){const w=b+c;if(w>v&&w<cm&&!F.includes(w)){d=fmt(w,out.m[i]);break}}}
     out.m[i]=d||lift(v+.01,out.m[i])});if(!hit)break}}
  const it=k=>(menu[k]||[]),isSp=i=>{const d=it("d")[i];return !!d&&SP.test((d.n||"")+" "+(d.note||""))};
  const plain=Math.max(0,...(out.d||[]).map((x,i)=>isSp(i)?0:val(x)||0),...nums("w"));
  out.d=(out.d||[]).map((x,i)=>{const v=val(x);return isSp(i)&&v!=null&&plain&&v<=plain?lift(plain*(1.2+.05*i),x):x});
  /* any price left with odd cents (a film number like 28.12) goes up to the next ending that reads like a price */
  for(const k of ["s","m","w","d"])out[k]=(out[k]||[]).map(x=>{const m=String(x).match(/^(\D*)(\d+)\.(\d\d)(\D*)$/);if(!m||+m[3]%5===0)return x;const c=[25,50,75,95].find(e=>e>=+m[3]);return c?m[1]+m[2]+"."+c+m[4]:m[1]+(+m[2]+1)+".00"+m[4]});
  return out};
/* a price that reads like a price: cents a multiple of 5, and odd cents (8.57, a film number) go up to .25, .50, .75 or .95 */
window.priceEnd=v=>{if(v==null||isNaN(v))return v;if(v<1)return Math.max(.05,Math.ceil(v*20-1e-9)/20);const c=Math.round((v%1)*100);if(c%5===0)return Math.round(v*100)/100;const e=[25,50,75,95].find(x=>x>=c);return e?Math.floor(v)+e/100:Math.floor(v)+1};
/* one price style per card and no odd cents, on every shared layout: reads each price that is a whole text node on the card's pages
   ("8.57", "$6.32", "12¢", "60c"); odd cents go up to a price ending, and a card that prints dollar prices shows its cent prices
   in dollars too ("0.85" beside "1.95", "$0.75" beside "$1.25"). Precinct evidence tags keep their own cents. */
window.priceTidy=(faces,fmt)=>{if(fmt==="precinct")return faces;
  const DOL=/>(\s*)(\$|£)?(\d{1,3})\.(\d\d)(\s*)</g,CEN=/>(\s*)(\d{1,2})(¢|c)(\s*)</g,all=faces.join("");
  const dol=[...all.matchAll(DOL)],big=dol.filter(m=>+m[3]>=1),mixed=big.length>0&&CEN.test(all);CEN.lastIndex=0;
  const pre=big.filter(m=>m[2]).length*2>big.length?(big.find(m=>m[2])||[])[2]||"":"";
  return faces.map(h=>h.replace(DOL,(m0,a,cur,d,c,b)=>{const v=+d+ +c/100;if(+c%5===0)return m0;return ">"+a+(cur||"")+window.priceEnd(v).toFixed(2)+b+"<"})
    .replace(CEN,(m0,a,c,sym,b)=>{const n=Math.max(5,Math.ceil(+c/5)*5);if(n>=100)return ">"+a+pre+"1.00"+b+"<";return mixed?">"+a+pre+"0."+String(n).padStart(2,"0")+b+"<":">"+a+n+sym+b+"<"}))};
const low1=w=>/^(The|A|An|Some|Every|His|Her|Their|Its|One|Two|Three|That|This|How|Why|What|Where|When) /.test(w)?w.charAt(0).toLowerCase()+w.slice(1):w; /* names keep their capitals */
const T={"redsauce": {"name": "Little Italy Sunday Gravy"}, "pizza": {"name": "Brooklyn Slice Joint"}, "deli": {"name": "Manhattan Deli Counter"}, "street": {"name": "Bodega and Street Cart"}, "cop": {"name": "Stakeout Snacks"}, "soul": {"name": "Soul Food Kitchen"}, "xmas": {"name": "Christmas in the City"}, "aussie": {"name": "Arvo in the Outback"}, "asian": {"name": "Chinatown Late Night"}, "scifi": {"name": "Mission Control Rations"}, "hero": {"name": "Rooftop Patrol"}, "kids": {"name": "Family Matinee"}, "teen": {"name": "Mall Food Court"}, "diner": {"name": "Roadside Diner"}, "mex": {"name": "Cantina Night"}, "tiki": {"name": "Beach House Luau"}, "uptown": {"name": "Uptown Steakhouse"}, "horror": {"name": "Midnight Monster Feast"}, "western": {"name": "Chuckwagon BBQ"}, "philly": {"name": "Philly Fight Night"}, "galaxy": {"name": "Galactic Cantina"}, "wizard": {"name": "Great Hall Feast"}, "adventure": {"name": "Explorer's Field Rations"}, "fairytale": {"name": "Storybook Banquet"}, "romcom": {"name": "Rom-Com Date Night"}};
/* every film has its own menu: T tagline, D description, P serve cue, S snacks, M mains, W sweet, K drink */
const $=id=>document.getElementById(id);
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sel=$("themeSel");
/* Josh's call (5 Nov): titles written with a spaced hyphen read with a comma on screen and paper ("Mission: Impossible, Fallout").
   The id keeps the official title, so saved lists, links and data files still match */
FILMS.forEach(f=>{if(/ - /.test(f.title))f.title=f.title.replace(/ - /g,", ")});
sel.innerHTML=`<option value="all">Everything (${FILMS.length} films)</option>`+
  Object.entries(T).sort((a,b)=>a[1].name.localeCompare(b[1].name)).map(([k,t])=>`<option value="${k}">${t.name} (${FILMS.filter(f=>f.theme===k).length})</option>`).join("");

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- sound: a tick per wedge and a little fanfare, off by default ---------- */
let audio=null,soundOn=false;
/* silent until someone taps the speaker (or Settings); after that their choice is remembered */
try{soundOn=localStorage.getItem("mns-sound")==="1"}catch(e){}
function setSoundLabel(){const b=$("sound");b.setAttribute("aria-pressed",soundOn);b.textContent=soundOn?"Sound on":"Sound off";const q=document.getElementById("quickMute");if(q){q.setAttribute("aria-pressed",String(!soundOn));q.setAttribute("aria-label",soundOn?"Mute sound":"Turn sound on");q.classList.toggle("off",!soundOn)}}
function ac(){if(!audio){const C=window.AudioContext||window.webkitAudioContext;if(C)audio=new C()}return audio}
function tick(){if(!soundOn||!ac())return;const t=audio.currentTime;const src=audio.createBufferSource();src.buffer=noiseBuf();const f=audio.createBiquadFilter();f.type="bandpass";f.frequency.value=2400;f.Q.value=2.5;const g=audio.createGain();g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.0001,t+.035);src.connect(f).connect(g).connect(audio.destination);src.start(t,Math.random()*1.5,.05)}
function fanfare(){if(!soundOn||!ac())return;const t=audio.currentTime;[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.09);g.gain.linearRampToValueAtTime(.12,t+i*.09+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.09+.9);o.connect(g).connect(audio.destination);o.start(t+i*.09);o.stop(t+i*.09+1)})}

/* nostalgia sounds, all made on the fly: projector whirr, VHS clunk, ticket printer, popcorn, curtain swish */
let _nb=null;function noiseBuf(){if(_nb)return _nb;const a=ac(),n=a.sampleRate*2,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return _nb=b}
function nburst(t,dur,type,freq,q,vol,dec){const a=audio,s=a.createBufferSource();s.buffer=noiseBuf();const f=a.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+(dec||dur));s.connect(f).connect(g).connect(a.destination);s.start(t,Math.random()*1.5,dur+.05);return s}
function thump(t,freq,vol,dec){const o=audio.createOscillator(),g=audio.createGain();o.type="sine";o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.5,t+dec);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dec);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+dec+.02)}
const sfx={
  _whirr:null,
  whirrStart(){if(!soundOn||!ac()||this._whirr)return;const a=audio,t=a.currentTime,s=a.createBufferSource();s.buffer=noiseBuf();s.loop=true;const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=900;f.Q.value=.8;
    const flick=a.createGain();flick.gain.value=.5;const lfo=a.createOscillator();lfo.frequency.value=24;const lg=a.createGain();lg.gain.value=.35;lfo.connect(lg).connect(flick.gain);
    const g=a.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.11,t+.4);
    const hum=a.createOscillator();hum.type="sawtooth";hum.frequency.value=50;const hg=a.createGain();hg.gain.value=.018;const hf=a.createBiquadFilter();hf.type="lowpass";hf.frequency.value=220;hum.connect(hf).connect(hg).connect(g);
    s.connect(f).connect(flick).connect(g).connect(a.destination);s.start(t);lfo.start(t);hum.start(t);this._whirr={s,lfo,hum,g}},
  whirrStop(){const w=this._whirr;if(!w)return;this._whirr=null;const t=audio.currentTime;w.g.gain.cancelScheduledValues(t);w.g.gain.setValueAtTime(w.g.gain.value,t);w.g.gain.exponentialRampToValueAtTime(.0001,t+.6);[w.s,w.lfo,w.hum].forEach(n=>n.stop(t+.65))},
  beep(){if(!soundOn||!ac())return;const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type="sine";o.frequency.value=1000;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.005);g.gain.setValueAtTime(.16,t+.045);g.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.08)},
  clunk(){if(!soundOn||!ac())return;const t=audio.currentTime;nburst(t,.03,"highpass",2500,.7,.35);thump(t+.02,110,.5,.18);nburst(t+.12,.04,"bandpass",1400,3,.25);thump(t+.16,70,.35,.14);nburst(t+.3,.7,"bandpass",420,1.2,.05,.7)},
  print(){if(!soundOn||!ac())return;const t=audio.currentTime;for(let i=0;i<14;i++)nburst(t+i*.045,.02,"bandpass",3200,4,.16);nburst(t+.7,.18,"highpass",1800,.5,.18,.2)},
  pop(){if(!soundOn||!ac())return;const t=audio.currentTime;for(let i=0;i<7;i++){const d=Math.random()*1.1;nburst(t+d,.025,"bandpass",900+Math.random()*1400,1.5,.3+Math.random()*.25)}},
  chime(){if(!soundOn||!ac())return;const t=audio.currentTime;[[1318.5,0],[987.8,.32]].forEach(([f,d])=>{const o=audio.createOscillator(),g=audio.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.12,t+d+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d+1.4);o.connect(g).connect(audio.destination);o.start(t+d);o.stop(t+d+1.5)})},
  swish(){if(!soundOn||!ac())return;const a=audio,t=a.currentTime,s=a.createBufferSource();s.buffer=noiseBuf();const f=a.createBiquadFilter();f.type="lowpass";f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(2200,t+.5);f.frequency.exponentialRampToValueAtTime(400,t+1.1);const g=a.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.35);g.gain.exponentialRampToValueAtTime(.0001,t+1.15);s.connect(f).connect(g).connect(a.destination);s.start(t,0,1.2)}
};
/* phones only allow sound after a tap: wake the audio on the first touch */
if(typeof addEventListener!=="undefined")addEventListener("pointerdown",function wake(){if(soundOn&&ac()&&audio.state==="suspended")audio.resume();removeEventListener("pointerdown",wake)},{once:true});
$("sound").addEventListener("click",()=>{soundOn=!soundOn;try{localStorage.setItem("mns-sound",soundOn?"1":"0")}catch(e){}setSoundLabel();if(soundOn&&ac()&&audio.state==="suspended")audio.resume();tick()});
{const q=document.getElementById("quickMute");if(q)q.addEventListener("click",()=>$("sound").click())}
setSoundLabel();

/* ---------- the wheel: 24 lit wedges, each showing a film from tonight's programme ---------- */
const N=24,A=Math.PI*2/N;
const WEDGE=["#7a2331","#e3d4b8","#1f4b4f","#c8962e","#38405e","#b35a3c","#4b2f48","#5f7356"];
const WEDGE_INK=["#f6e9da","#2a1d12","#e6f0ee","#24180a","#e9ecf6","#fbeee6","#f3e6f1","#eef2ea"];
let list=[],wedges=[],rot=0,spinning=false,winner=-1,current=null,phase=0,kick=0;
const canvas=$("wheel"),ctx=canvas.getContext("2d");

/* Watched status uses the existing title/year IDs, independently of recent spins. */
let watched=new Set(),skipWatched=true;
try{
  const saved=JSON.parse(localStorage.getItem("mns-watched")||"[]");
  if(Array.isArray(saved))watched=new Set(saved.filter(id=>FILMS.some(f=>f.id===id)));
  skipWatched=localStorage.getItem("mns-skip-watched")!=="0";
}catch(e){$("watchSave").textContent="Saved ticks couldn't be loaded. Changes may only last for this visit."}
$("skipWatched").checked=skipWatched;
function saveWatched(){
  try{
    localStorage.setItem("mns-watched",JSON.stringify([...watched]));
    localStorage.setItem("mns-skip-watched",skipWatched?"1":"0");
    $("watchSave").textContent="";
    if(typeof queueSync==="function")queueSync();
  }catch(e){$("watchSave").textContent="This browser couldn't save your ticks. They'll last for this visit only."}
}
let kidsMode=false;
try{kidsMode=localStorage.getItem("mns-kids")==="1"}catch(e){}
const ratingOf=f=>(typeof RATINGS!=="undefined"&&RATINGS[f.id])||"";
const isKidSafe=f=>{const r=ratingOf(f);return r?(r==="G"||r==="PG"):(f.theme==="kids"||f.theme==="fairytale")};
function programmeFilms(){return sel.value==="all"?FILMS:FILMS.filter(f=>f.theme===sel.value)}
function updateWatchButton(){
  const b=$("watchCurrent"),done=current&&watched.has(current.id);
  b.disabled=!current||spinning;b.textContent=done?"Watched · undo":"Mark as watched";
  const ws=$("weekSet");if(ws){ws.disabled=!current||spinning;ws.textContent=current&&typeof week!=="undefined"&&week&&week.id===current.id?"Locked in for this week":"Lock in for this week"}
  b.setAttribute("aria-pressed",done?"true":"false");
  b.setAttribute("aria-label",current?`${done?"Mark as unwatched":"Mark as watched"}: ${current.title} (${current.year})`:"Mark as watched");
}
function renderWatchList(){
  const q=$("watchSearch").value.trim().toLocaleLowerCase(),filter=$("watchFilter").value;
  const films=programmeFilms().filter(f=>(f.title+" "+f.year).toLocaleLowerCase().includes(q))
    .filter(f=>filter==="all"||(filter==="watched"?watched.has(f.id):!watched.has(f.id)))
    .slice().sort((a,b)=>a.title.localeCompare(b.title)||a.year.localeCompare(b.year));
  $("watchSummary").textContent=`My movie checklist · ${watched.size} / ${FILMS.length} watched`;
  $("watchResults").textContent=`${films.length} ${films.length===1?"film":"films"} shown in this programme`;
  const box=$("watchList");box.replaceChildren();
  if(!films.length){const p=document.createElement("p");p.textContent="No films match. Try another search, filter or programme.";box.appendChild(p)}
  films.forEach(f=>{
    const row=document.createElement("label");row.className="watch-row"+(watched.has(f.id)?" is-watched":"");
    const input=document.createElement("input");input.type="checkbox";input.checked=watched.has(f.id);input.disabled=spinning;
    input.setAttribute("aria-label",`Watched: ${f.title} (${f.year})`);
    const title=document.createElement("span");title.textContent=f.title+" ";
    const year=document.createElement("small");year.textContent=`(${f.year})`;title.appendChild(year);
    input.addEventListener("change",()=>setWatched(f,input.checked));row.append(input,title);box.appendChild(row);
  });
}
function setWatched(f,done){
  if(spinning)return;
  const restoreFocus=$("watchPanel").contains(document.activeElement);
  if(done)watched.add(f.id);else watched.delete(f.id);
  saveWatched();setList();updateWatchButton();
  // Keep keyboard focus on the same checkbox if it remains in the filtered list.
  if(restoreFocus){
    const label=`Watched: ${f.title} (${f.year})`;
    const input=Array.from($("watchList").querySelectorAll("input")).find(el=>el.getAttribute("aria-label")===label);
    if(input)input.focus();else $("watchFilter").focus();
  }
}
function setList(){
  if(spinning)return;
  const films=programmeFilms();
  list=shuffle(films.filter(f=>(!skipWatched||!watched.has(f.id))&&(!kidsMode||isKidSafe(f))&&(typeof onSvc==="undefined"||onSvc(f,svc))));
  wedges=list.length?Array.from({length:N},(_,i)=>list[i%list.length]):[];
  rot=0;winner=-1;
  ctx.clearRect(0,0,canvas.width,canvas.height);draw();
  $("spin").disabled=!list.length;
  $("count").textContent=list.length?`${list.length} films in tonight's programme${skipWatched?" · unwatched only":""}${kidsMode?" · kids mode":""}`:
    "You've watched every film in this programme. Choose another programme, untick a film or turn off ‘Skip watched’.";
  renderWatchList();
}
$("watchSearch").addEventListener("input",renderWatchList);
$("watchFilter").addEventListener("change",renderWatchList);
$("skipWatched").addEventListener("change",()=>{if(spinning)return;skipWatched=$("skipWatched").checked;saveWatched();setList()});
$("watchCurrent").addEventListener("click",()=>{if(!current)return;const now=!watched.has(current.id);setWatched(current,now);if(now)openRate(current)});

if(typeof ResizeObserver!=="undefined")new ResizeObserver(()=>{if(canvas.getBoundingClientRect().width)size()}).observe(canvas);
function size(){
  const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);draw();
}
function fitText(t,max){
  if(ctx.measureText(t).width<=max)return t;
  let s=t;while(s.length>3&&ctx.measureText(s+"...").width>max)s=s.slice(0,-1);
  /* cut at a word, not mid-word, unless that loses more than half */
  const sp=s.lastIndexOf(" ");if(sp>s.length/2&&!/\s/.test(t[s.length]||" "))s=s.slice(0,sp);
  return s.trim().replace(/[,:;-]$/,"")+"...";
}
const wheelTex=typeof Image!=="undefined"?new Image():{complete:false};if(wheelTex.src!==undefined||typeof Image!=="undefined"){wheelTex.src="assets/hero/paper.webp";wheelTex.onload=()=>{try{draw()}catch(e){}}}
function draw(){
  const W=canvas.width;if(!W||!wedges.length)return;
  const c=W/2,Ro=c*0.8,Rr=c*0.795,R=c*0.79;
  ctx.clearRect(0,0,W,W);
  /* rim: a slim dark bezel with a fine brass line */
  let g;
  ctx.beginPath();ctx.arc(c,c,Ro,0,Math.PI*2);ctx.fillStyle="#1b1613";ctx.fill();
  ctx.beginPath();ctx.arc(c,c,Rr,0,Math.PI*2);ctx.fillStyle="#0c0a09";ctx.fill();
  /* wedges */
  for(let i=0;i<N;i++){
    const s=rot+i*A-Math.PI/2;
    ctx.beginPath();ctx.moveTo(c,c);ctx.arc(c,c,R,s,s+A);ctx.closePath();
    const col=WEDGE[i%WEDGE.length];
    const wg=ctx.createRadialGradient(c,c,R*.2,c,c,R);
    wg.addColorStop(0,shade(col,-.18));wg.addColorStop(1,col);
    ctx.fillStyle=wg;ctx.fill();
    if(i===winner){ctx.fillStyle="rgba(255,244,220,.5)";ctx.fill()}
    ctx.strokeStyle="rgba(12,10,9,.9)";ctx.lineWidth=Math.max(1,W/420);ctx.stroke();
  }
  /* labels along each wedge */
  const fs=Math.max(9,R*0.052);
  ctx.font=`500 ${fs*1.06}px Jost, Futura, "Helvetica Neue", Arial, sans-serif`;ctx.textAlign="right";ctx.textBaseline="middle";
  for(let i=0;i<N;i++){
    const f=wedges[i];if(!f)continue;
    const ang=rot+(i+.5)*A-Math.PI/2,left=Math.cos(ang)<0;
    ctx.save();ctx.translate(c,c);ctx.rotate(left?ang+Math.PI:ang);
    ctx.fillStyle=i===winner?"#1d1404":WEDGE_INK[i%WEDGE.length];
    /* short form first (drop a subtitle), then a smaller size, and only then cut it */
    let t=f.title.replace(/&amp;/g,"&"),max=R*0.6;
    if(ctx.measureText(t).width>max){const parts=t.split(/: | - |, /),sh=parts[0];
      /* two films in the same series on the wheel (both "Jumanji"): show the subtitle, so the wedges differ */
      const twin=sh.length>=4&&wedges.some((g,j)=>j!==i&&g&&g.title!==f.title&&g.title.replace(/&amp;/g,"&").split(/: | - |, /)[0]===sh);
      if(sh.length>=4)t=twin&&parts.length>1?parts.slice(1).join(": "):sh}
    /* still too long and another wedge starts the same way ("Harry Potter and the..."): drop the shared words so each wedge reads differently */
    if(ctx.measureText(t).width>max*1.34){const w=t.split(" ");let n=0;
      for(const g of wedges){if(!g||g.title===f.title)continue;const o=g.title.replace(/&amp;/g,"&").split(" ");let m=0;while(m<w.length-1&&o[m]===w[m])m++;n=Math.max(n,m)}
      if(n>=2)t=w.slice(n).join(" ").replace(/^./,ch=>ch.toUpperCase())}
    let shrink=ctx.measureText(t).width>max&&ctx.measureText(t).width<=max*1.34;
    if(shrink)ctx.font=`500 ${fs*1.06/1.34}px Jost, Futura, "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign=left?"left":"right";
    ctx.fillText(fitText(t,max),left?-R*0.94:R*0.94,0);
    if(shrink)ctx.font=`500 ${fs*1.06}px Jost, Futura, "Helvetica Neue", Arial, sans-serif`;
    ctx.restore();
  }
  /* printed-card texture and a little wear over the slices */
  if(wheelTex.complete&&wheelTex.naturalWidth){ctx.save();ctx.beginPath();ctx.arc(c,c,R,0,Math.PI*2);ctx.clip();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=.7;
    const pat=ctx.createPattern(wheelTex,"repeat");ctx.fillStyle=pat;ctx.fillRect(0,0,W,W);ctx.restore()}
  /* inner ring and shade */
  g=ctx.createRadialGradient(c,c,R*.22,c,c,R);
  g.addColorStop(0,"rgba(0,0,0,.5)");g.addColorStop(.4,"rgba(0,0,0,0)");g.addColorStop(.92,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.35)");
  ctx.beginPath();ctx.arc(c,c,R,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();

}
function shade(hex,k){
  const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
  const f=v=>Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function indexAt(r){const p=((-r)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);return Math.floor(p/A)%N}



const pointer=$("pointer");
function setPointer(){pointer.style.transform=`rotate(${-kick*26}deg)`}

/* offline, a spin only lands on films whose menus are already saved on this device */
const SAVED=new Set();
async function savedScan(){try{if(!("caches" in window))return;SAVED.clear();for(const k of await caches.keys()){const c=await caches.open(k);for(const r of await c.keys()){const m=new URL(r.url).pathname.match(/data\/film\/[^/]+\.json$/);if(m)SAVED.add(m[0])}}}catch(e){}}
addEventListener("offline",savedScan);if(navigator.onLine===false)savedScan();
function spinPool(){if(navigator.onLine!==false)return list;const ok=list.filter(f=>SAVED.has(filmPath(f)));return ok}
/* tap to skip: a tap on the wheel or the curtain while it spins or counts down jumps straight to the menu */
var skipReq=false;
function spin(){
  if(spinning||!list.length)return;
  if(navigator.onLine===false&&!spinPool().length){const st=$("status");if(st)st.textContent="You're offline and no menus are saved on this device yet. Open a few films while you're online and they'll be here next time.";savedScan();return}
  spinning=true;sel.disabled=true;$("skipWatched").disabled=true;updateWatchButton();renderWatchList();$("spin").disabled=true;winner=-1;document.body.classList.add("spinning");document.body.classList.remove("winner");
  if(soundOn&&ac()&&audio.state==="suspended")audio.resume();
  /* refresh the wedges on the far side so every spin shows new titles, and plant the winner there */
  const far=[];for(let i=0;i<N;i++){const ang=((rot+(i+.5)*A)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);if(ang>Math.PI*.6&&ang<Math.PI*1.4)far.push(i)}
  const L=spinPool(),pool=shuffle(list);far.forEach((i,k)=>{wedges[i]=pool[k%pool.length]});
  const w=pick(far),f=L.length?pick(L):wedges[w];wedges[w]=f;
  closeCurtains();sfx.whirrStart();
  const target=-(w+0.5+(Math.random()-0.5)*0.55)*A;
  const turns=reduce?1:5+Math.floor(Math.random()*3);
  const start=rot,delta=((target-start)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)+turns*Math.PI*2;
  const over=reduce?0:A*0.45,dur=reduce?900:6200,t0=performance.now();
  const easeOut=x=>1-Math.pow(1-x,4),easeIO=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  let last=indexAt(rot);
  skipReq=false;
  function frame(now){
    const p=skipReq?1:Math.min(1,(now-t0)/dur);
    rot=p<.88?start+(delta+over)*easeOut(p/.88):start+delta+over*(1-easeIO((p-.88)/.12));
    const i=indexAt(rot);
    if(i!==last){last=i;kick=1;tick();if(globalThis.REEL_NATIVE)REEL.haptic("tick");$("now").textContent=wedges[i].title;phase++}
    kick*=0.86;setPointer();draw();
    if(p<1)requestAnimationFrame(frame);
    else{
      rot=((rot%(Math.PI*2))+Math.PI*2)%(Math.PI*2);winner=indexAt(rot);kick=0;setPointer();draw();
      spinning=false;sel.disabled=false;$("skipWatched").disabled=false;renderWatchList();document.body.classList.remove("spinning");
      /* the hub stays visibly off until the curtain is up: a press during the countdown skips it rather than silently doing nothing */
      const hubOn=()=>{$("spin").disabled=false};
      const win=wedges[winner];
      $("now").textContent=win.title;
      document.body.classList.add("winner");setTimeout(()=>document.body.classList.remove("winner"),1500);
      sfx.whirrStop();fanfare();
      buzz([30,50,90]);show(win,true).then(()=>{announceFilm(win,kbSpin);leader(()=>{openCurtains();hubOn()})},hubOn);setTimeout(hubOn,8000);addHistory(win);
      /* an instant jump: a smooth glide while the bulbs flash and the menu builds left phones drawing a blank screen for half a second */if(window.innerWidth<900)theatre.scrollIntoView({behavior:"auto",block:"start"});
      /* desktop: glide down to the result once it is ready, unless the whole menu is already in view */
      else setTimeout(()=>{const r=$("easel").getBoundingClientRect();if(r.bottom>innerHeight-20){const tb=document.querySelector(".side .tabs")||theatre;window.scrollTo({top:scrollY+tb.getBoundingClientRect().top-12,behavior:reduce?"auto":"smooth"})}},reduce?0:600);
    }
  }
  requestAnimationFrame(frame);
}

/* say which film landed, and after a keyboard spin put focus on it so a keyboard or screen reader user lands on the result */
let kbSpin=false,lastKey=false;
addEventListener("keydown",e=>{if(!e.altKey&&!e.ctrlKey&&!e.metaKey)lastKey=true},true);
addEventListener("pointerdown",()=>{lastKey=false},true);
function announceFilm(f,focus){const h=$("nowShowing");if(!h)return;h.textContent="Now showing: "+f.title+" ("+f.year+")";if(focus)h.focus({preventScroll:true});kbSpin=false}
document.getElementById("skipLink").addEventListener("click",e=>{e.preventDefault();const v=!$("viewShop").hidden?"viewShop":!$("viewCrave").hidden?"viewCrave":null;
  const t=v?$(v).querySelector("input,button,select"):$("spin");if(t){t.focus();t.scrollIntoView({block:"center"})}});
/* touch screens say Tap, mouse screens say Click */
const isTouch=()=>matchMedia("(pointer:coarse), (hover:none), (max-width:700px)").matches;
const tapWord=t=>isTouch()?t:String(t).replace(/\bTap\b/,"Click").replace(/\btap\b/,"click");
{const gh=document.querySelector(".gv-head small");if(gh)gh.textContent=tapWord(gh.textContent)}
if(!isTouch())document.querySelectorAll(".cb-k,.sv-tap,.skip-k,[data-tap]").forEach(e=>{e.textContent=tapWord(e.textContent)});
/* ---------- curtains and the easel tilt ---------- */
const theatre=$("theatre"),easel=$("easel");
function closeCurtains(){theatre.classList.add("closed");$("tease").textContent=pick(["Setting the table","Warming the plates","Popping the corn","Chilling the glasses","Lighting the candles"])}
/* the old film-leader countdown on the curtain before it opens */
function leader(done){
  const t=$("tease");if(reduce||!theatre.classList.contains("closed")){done();return}
  t.classList.add("leader");let n=3;const step=()=>{if(n===0||skipReq){skipReq=false;t.classList.remove("leader");done();return}t.innerHTML=`<span class="ld"><b>${n}</b></span>`;tick();n--;setTimeout(step,420)};step();
}
function openCurtains(){setTimeout(()=>{if(theatre.classList.contains("closed"))sfx.swish();theatre.classList.remove("closed")},reduce?0:250)}
const canTilt=!reduce&&window.matchMedia("(hover:hover) and (pointer:fine)").matches;
if(canTilt){
  theatre.addEventListener("pointermove",e=>{
    const r=theatre.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    easel.style.transform=`perspective(1300px) rotateY(${(x-.5)*9}deg) rotateX(${(.5-y)*7}deg) translateZ(0)`;
    easel.style.setProperty("--gx",(x*100)+"%");easel.style.setProperty("--gy",(y*100)+"%");
  });
  theatre.addEventListener("pointerleave",()=>{easel.style.transform=""});
}

/* Native modal dialogs contain keyboard focus and isolate the background, including nested dialogs. */
const modalStack=[];
const modalState=new WeakMap();
function finishModal(o){
  const state=modalState.get(o);if(!state)return;
  /* step history back a moment later, so a pop-up that replaces this one straight away (hire case to rental slip) can take over its entry instead of racing it */
  try{if(o._hist&&!o._popped){o._hist=false;clearTimeout(window.__histHandoff);window.__histHandoff=setTimeout(()=>{window.__histHandoff=0;window.__ignorePop=(window.__ignorePop||0)+1;history.back()},0)}}catch(e){}
  const wasTop=modalStack[modalStack.length-1]===o;
  modalState.delete(o);const i=modalStack.indexOf(o);if(i!==-1)modalStack.splice(i,1);
  if(!o.hasAttribute("data-keep"))o.remove();if(state.onClose)state.onClose();
  if(!wasTop)return;
  const parent=modalStack[modalStack.length-1];
  const target=state.trigger;
  if(target&&target.isConnected&&typeof target.focus==="function"&&(!parent||parent.contains(target)))target.focus({preventScroll:true});
  else if(parent){const next=parent.querySelector("button:not(:disabled),input:not(:disabled),a[href],[tabindex='0']");if(next)next.focus({preventScroll:true})}
}
function dismissModal(o){if(o.open)o.close();finishModal(o)}
function mountModal(o,initial,trigger,onClose){
  modalState.set(o,{trigger,onClose});modalStack.push(o);
  /* the phone's Back button closes a pop-up instead of leaving the app */
  try{if(typeof history!=="undefined"&&history.pushState&&!o.dataset.keep){if(window.__histHandoff){clearTimeout(window.__histHandoff);window.__histHandoff=0}else history.pushState(Object.assign({},history.state||{},{m:1}),"");o._hist=true}}catch(e){}
  /* Neutralise native dialog sizing; existing overlay classes keep their padding and visual treatment. */
  Object.assign(o.style,{margin:"0",border:"0",maxWidth:"none",maxHeight:"none",width:"100%",height:"100%",boxSizing:"border-box",color:"inherit"});
  if(o._mm){document.body.appendChild(o);if(!o.open)o.showModal();const f=initial&&o.querySelector(initial);if(f)f.focus({preventScroll:true});return}
  o._mm=1;
  /* one close X in the same corner on every pop-up (the box art case keeps its own) */
  const addX=()=>{if(o.querySelector(".x,.modal-x"))return;const b=document.createElement("button");b.type="button";b.className="modal-x";b.setAttribute("aria-label","Close");b.textContent="×";b.addEventListener("click",()=>dismissModal(o));o.append(b)};
  addX();if(window.MutationObserver)new MutationObserver(addX).observe(o,{childList:true});
  o.addEventListener("cancel",e=>{e.preventDefault();dismissModal(o)});
  o.addEventListener("close",()=>finishModal(o));
  o.tabIndex=-1;
  o.addEventListener("keydown",e=>{
    if(e.key!=="Tab"||modalStack[modalStack.length-1]!==o)return;
    const items=[...o.querySelectorAll('a[href],button,input:not([type="hidden"]),select,textarea,iframe,[tabindex]')].filter(el=>el.tabIndex>=0&&!el.matches(":disabled")&&!el.closest("[hidden],[inert]")&&el.getClientRects().length);
    const index=items.indexOf(document.activeElement);
    if(!items.length){e.preventDefault();o.focus()}
    else if(e.shiftKey&&index<=0){e.preventDefault();items[items.length-1].focus()}
    else if(!e.shiftKey&&(index===items.length-1||index<0)){e.preventDefault();items[0].focus()}
  });
  document.body.appendChild(o);o.showModal();
  const first=initial&&o.querySelector(initial);if(first)first.focus({preventScroll:true});
}

/* each film's full menu (tagline, blurb, methods, shopping, and its finished poster menu or exact recipe)
   lives in its own small file and is fetched the first time the film is opened */
const EDITIONS={},RECIPE_MENUS={};
const movieEdition=f=>EDITIONS[f.id]||null;
const movieRecipe=f=>RECIPE_MENUS[f.id]||null;
const filmPath=f=>"data/film/"+f.id.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".json";
/* the ?v fingerprint changes only when that film's file changes, so an updated film is fetched fresh on first open */
const filmFile=f=>filmPath(f)+(f.v?"?v="+f.v:"");
const _filmLoads={};
function ensureExact(f){
  if(f._full)return Promise.resolve();
  if(!_filmLoads[f.id])_filmLoads[f.id]=(async()=>{
    for(let tryN=0;tryN<2;tryN++){
      try{const r=await fetch(filmFile(f));if(!r.ok)break;const d=await r.json();
        Object.assign(f,{T:d.T,D:d.D,P:d.P,S:d.S,M:d.M,W:d.W,K:d.K,_full:true});
        if(d.edition)EDITIONS[f.id]=d.edition;if(d.recipe)RECIPE_MENUS[f.id]=d.recipe;if(d.lib)f._lib=d.lib;if(d.kit)f._kit=d.kit;if(d.r2)f._r2=d.r2;if(d.diet)f._diet=d.diet;return}
      catch(e){}
    }
    delete _filmLoads[f.id];
    f.T=f.T||"";f.D=f.D||"";f.P=f.P||"";
  })();
  return _filmLoads[f.id];
}
/* warm the next likely films in the background so opening them is instant */
function prefetchFilms(list){const go=()=>list.slice(0,6).forEach(f=>ensureExact(f));(window.requestIdleCallback||setTimeout)(go,{timeout:3000})}
const exactMenu=f=>{const e=movieEdition(f);return e?e.menu:movieRecipe(f)};
const toItem=([n,note,how,shop])=>({n,note,how,shop});
function makeMenu(f,first){const m=baseMenu(f,first);return typeof dietMenu==="function"?dietMenu(f,m):m}
function baseMenu(f,first){
  const exact=exactMenu(f);
  if(exact)return JSON.parse(JSON.stringify(exact));
  if(first)return {s:f.S.slice(0,2).map(toItem),m:f.M.map(toItem),w:f.W.map(toItem),d:f.K.map(toItem)};
  return {s:shuffle(f.S).slice(0,2).map(toItem),m:shuffle(f.M).slice(0,Math.random()<.5?1:2).map(toItem),w:f.W.map(toItem),d:f.K.map(toItem)};
}

const svg=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const checker=(a,b,z)=>svg(`<svg xmlns='http://www.w3.org/2000/svg' width='${z*2}' height='${z*2}'><rect width='${z*2}' height='${z*2}' fill='${a}'/><rect width='${z}' height='${z}' fill='${b}'/><rect x='${z}' y='${z}' width='${z}' height='${z}' fill='${b}'/></svg>`);
const gingham=c=>svg(`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><rect width='28' height='28' fill='#fff'/><rect width='14' height='28' fill='${c}' fill-opacity='.55'/><rect width='28' height='14' fill='${c}' fill-opacity='.55'/></svg>`);
const stripes=(a,b,w)=>svg(`<svg xmlns='http://www.w3.org/2000/svg' width='${w*2}' height='40'><rect width='${w*2}' height='40' fill='${a}'/><rect width='${w}' height='40' fill='${b}'/></svg>`);
const dots=(c,bg,z,r)=>svg(`<svg xmlns='http://www.w3.org/2000/svg' width='${z}' height='${z}'><rect width='${z}' height='${z}' fill='${bg}'/><circle cx='${z/2}' cy='${z/2}' r='${r}' fill='${c}'/></svg>`);
const stars=(bg)=>{let s=`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><rect width='220' height='220' fill='${bg}'/>`;const p=[[12,30,1.4],[60,10,1],[110,48,1.8],[170,22,1.1],[200,90,1.4],[30,120,1],[90,150,1.2],[140,110,1],[190,170,1.8],[50,200,1.3],[120,195,1],[15,70,.8],[160,60,.9],[100,90,.7]];p.forEach(([x,y,r])=>s+=`<circle cx='${x}' cy='${y}' r='${r}' fill='#ffffff' fill-opacity='.8'/>`);return svg(s+"</svg>")};
const bunting=cols=>{let s=`<svg xmlns='http://www.w3.org/2000/svg' width='${cols.length*40}' height='36'>`;cols.forEach((c,i)=>s+=`<polygon points='${i*40+2},0 ${i*40+38},0 ${i*40+20},34' fill='${c}'/>`);return svg(s+"</svg>")};
const snow=bg=>svg(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='${bg}'/><circle cx='20' cy='24' r='2' fill='#fff' fill-opacity='.35'/><circle cx='80' cy='60' r='2.5' fill='#fff' fill-opacity='.3'/><circle cx='40' cy='96' r='1.6' fill='#fff' fill-opacity='.35'/><circle cx='104' cy='14' r='1.4' fill='#fff' fill-opacity='.3'/></svg>`);

const STY={
redsauce:{eye:"Tonight's feature",md:"Lobster",mb:"Lora",bw:"ital,wght@0,400;0,700;1,400",mg:"#fbf5e9",mi:"#2b1d16",ma:"#b3261e",m2:"#2f6b3a",mf:"3px solid #b3261e",sh:"30px",strip:gingham("#b3261e"),ssz:"28px 28px",
 intro:"Long lunch rules apply. Everything is made for sharing, nobody leaves hungry and the sauce has been on since morning.",tags:["Pull up a chair. The gravy's been on since nine.","Family dinner. Attendance is not optional.","An offer you can't refuse: seconds."]},
pizza:{eye:"Hot and fresh",md:"Bowlby One SC",mb:"Barlow Condensed",bw:"ital,wght@0,400;0,700;1,400",mg:"#ffffff",mi:"#1b1b1b",ma:"#d7261e",m2:"#1f7a3a",mf:"4px solid #1b1b1b",sh:"24px",strip:stripes("#ffffff","#d7261e",22),ssz:"44px 24px",
 intro:"Slices are big, folding is mandatory and the last piece goes to whoever spun the wheel.",tags:["Hot, fresh and foldable.","Extra cheese. No arguments.","If it's not on a paper plate, is it even pizza night?"]},
deli:{eye:"Now serving",md:"Abril Fatface",mb:"Libre Franklin",bw:"ital,wght@0,400;0,700;1,400",mg:"#efe3cf",mi:"#1d2a44",ma:"#a33a2b",m2:"#b07b1e",mf:"7px double #1d2a44",
 intro:"Take a number. Sandwiches are stacked higher than they need to be and the pickles are free.",tags:["Order at the counter. Eat like you mean it.","Rye, mustard, no substitutions.","Cheesecake is not optional."]},
street:{eye:"Open all night",md:"Bebas Neue",mb:"IBM Plex Mono",bw:"ital,wght@0,400;0,700;1,400",mg:"#f4f1e6",mi:"#111111",ma:"#111111",m2:"#9a7a00",mf:"5px solid #111111",sh:"30px",strip:checker("#111111","#f5c518",15),ssz:"30px 30px",mls:".02em",
 intro:"No tables, no plates, no fuss. Cart food and bodega runs, eaten standing up.",tags:["Grab it, fold it, walk it.","Open all night. Cash only.","Mind the doors. Don't drop your hot dog."]},
cop:{eye:"Evidence log",md:"Special Elite",mb:"Courier Prime",bw:"ital,wght@0,400;0,700;1,400",mg:"#e7d3a1",mi:"#2b2b2b",ma:"#b0201b",m2:"#555555",mf:"2px dashed #2b2b2b",stamp:"Case file",
 intro:"Stakeout rations. Everything here survives a long night in a parked car and a short temper.",tags:["Two cops. One box of doughnuts.","Too old for this? Not for dessert.","Book 'em. Then feed 'em."]},
soul:{eye:"Sunday supper",md:"Shrikhand",mb:"Lora",bw:"ital,wght@0,400;0,700;1,400",mg:"#f3d27a",mi:"#3b2412",ma:"#a8321f",m2:"#2e5a3a",mf:"4px solid #3b2412",
 intro:"Sunday best cooking. Low and slow, plenty of butter, and a plate you'll still be thinking about tomorrow.",tags:["Come hungry. Leave happy.","You eat what's put in front of you.","Turn the music up and pass the cornbread."]},
xmas:{eye:"Christmas special",md:"Mountains of Christmas",mdw:"700",mb:"Cormorant Garamond",bw:"ital,wght@0,400;0,700;1,400",mg:"#14402e",mpat:snow("#14402e"),mpsz:"120px 120px",mi:"#f6efdf",ma:"#e2b34a",m2:"#e8665e",mf:"7px double #e2b34a",
 intro:"Lights on, air con on, everyone in their trackies. A proper Aussie Christmas spread for movie night.",tags:["The halls are decked. The ham is glazed.","Ho ho hold the remote.","Santa's watching. So are we."]},
aussie:{eye:"Arvo tucker",md:"Holtwood One SC",mb:"Work Sans",bw:"ital,wght@0,400;0,700;1,400",mg:"#f2e3c6",mi:"#3a2416",ma:"#c25b28",m2:"#5d7d4e",mf:"4px solid #3a2416",sh:"18px",strip:dots("#c25b28","#f2e3c6",18,4),ssz:"18px 18px",
 intro:"Grab a tinnie, throw another snag on, and nobody touches the last lamington.",tags:["Fair dinkum feed.","She'll be right. Bring a plate.","Tell 'em they're dreaming."]},
asian:{eye:"Late night order",md:"Kaushan Script",mb:"Noto Sans",bw:"ital,wght@0,400;0,700;1,400",mg:"#b11d1d",mi:"#fff3d6",ma:"#f4c542",m2:"#ffd98a",mf:"3px solid #f4c542",mf2:"1px solid #f4c542",
 intro:"Order too much, share everything, fight over the last dumpling. Chopsticks optional.",tags:["Hungry for adventure. Hungry for dumplings.","The night is young. The noodles are long.","Fortune favours the hungry."]},
scifi:{eye:"Mission briefing",md:"Orbitron",mdw:"800",mb:"Share Tech Mono",bw:"",mg:"#0b1230",mpat:stars("#0b1230"),mpsz:"220px 220px",mi:"#dfe8ff",ma:"#33e1ed",m2:"#ff4fa3",mf:"2px solid #33e1ed",mfill:"rgba(11,18,48,.82)",mtt:"uppercase",
 intro:"Rations for a long trip. Everything here is cleared for zero gravity and minimal crumbs.",tags:["In space, nobody can hear you crunch.","Fuel up. Launch in T minus one movie.","The future is delicious."]},
hero:{eye:"Issue #1",md:"Bangers",mb:"Comic Neue",bw:"ital,wght@0,400;0,700;1,400",mg:"#ffd23f",mpat:dots("#f2a900","#ffd23f",14,3),mpsz:"14px 14px",mi:"#111111",ma:"#e2231a",m2:"#1d4fd8",mf:"6px solid #111111",mfill:"#fffbe8",mls:".03em",
 intro:"Fuel for saving the city. Eat on the rooftop and keep one hand free for swinging.",tags:["With great snacks comes great responsibility.","Every hero needs a sidekick. This one's a sauce.","Saving the day takes carbs."]},
kids:{eye:"Family matinee",md:"Fredoka",mdw:"700",mb:"Nunito",bw:"ital,wght@0,400;0,700;1,400",mg:"#e7f6ff",mi:"#23305a",ma:"#ff5a5f",m2:"#2a9d8f",mf:"6px dotted #ff5a5f",sh:"26px",strip:stripes("#ffb703","#8ecae6",26),ssz:"52px 26px",
 intro:"Matinee rules: blankets on the floor, popcorn in your lap and no peeking at the ending.",tags:["Snacks for the whole family. Even the dog.","Lights down. Popcorn up.","Once upon a time, there was a sundae."]},
teen:{eye:"Food court special",md:"Monoton",mb:"Kanit",bw:"ital,wght@0,400;0,700;1,400",mg:"#1b1036",mi:"#fdf2ff",ma:"#ff3cac",m2:"#2ce0d0",mf:"4px solid #2ce0d0",mf2:"2px solid #ff3cac",sh:"22px",strip:stripes("#ff3cac","#2ce0d0",22),ssz:"44px 22px",
 intro:"Like hanging at the food court on a Saturday, minus the security guard telling you to move on.",tags:["Totally tubular eats.","Detention never tasted this good.","Skip class. Never skip snacks."]},
diner:{eye:"Blue plate special",md:"Pacifico",mb:"Arvo",bw:"ital,wght@0,400;0,700;1,400",mg:"#c9ebe0",mi:"#1e2a2a",ma:"#d83a3a",m2:"#1e2a2a",mf:"4px solid #1e2a2a",mfill:"#f8fbf6",sh:"28px",strip:checker("#1e2a2a","#ffffff",14),ssz:"28px 28px",
 intro:"Booth seating, bottomless coffee and someone who calls everyone love. Pie is mandatory.",tags:["Open 24 hours. Pie is always on.","Slide into a booth. Order the lot.","Coffee's hot. Road's long."]},
mex:{eye:"Cantina menu",md:"Sancreek",mb:"Cabin",bw:"ital,wght@0,400;0,700;1,400",mg:"#fff6e5",mi:"#2a1a3a",ma:"#e83f7a",m2:"#1c9c8c",mf:"4px solid #2a1a3a",sh:"36px",strip:bunting(["#e83f7a","#ffc93c","#1c9c8c","#7b4bd1","#ff7a2f"]),ssz:"200px 36px",
 intro:"Squeeze lime on everything. Salsa heat is optional. A second round of margaritas is not.",tags:["Tacos at dawn.","Bring an appetite. Bring a friend.","Hot salsa. Cool heads."]},
tiki:{eye:"Luau menu",md:"Luckiest Guy",mb:"Quicksand",bw:"wght@400;700",mg:"#f4e3b5",mi:"#2f2414",ma:"#e06a2b",m2:"#1e8f86",mf:"4px solid #2f2414",sh:"26px",strip:stripes("#c9a25a","#a77b34",12),ssz:"24px 26px",
 intro:"Shoes off, shirt loud, drink with an umbrella in it. Tropical tucker for a lazy night in.",tags:["Sun's down. Tiki's up.","Island time starts now.","Paradise, served on a skewer."]},
uptown:{eye:"Dinner is served",md:"Cormorant Garamond",mdw:"700",mb:"Cormorant Garamond",bw:"ital,wght@0,400;0,700;1,400",mg:"#0e0e0e",mi:"#efe6cf",ma:"#c9a54b",m2:"#c9a54b",mf:"2px solid #c9a54b",mf2:"1px solid #c9a54b",mtt:"uppercase",mls:".08em",
 intro:"Dress code: whatever you like, but sit up straight. Expense account dining with the lights down low.",tags:["Greed is good. So is the steak.","Shaken, never stirred. Like the guests.","Dinner for people who already have everything."]},
horror:{eye:"Midnight feast",md:"Creepster",mb:"Crimson Text",bw:"ital,wght@0,400;0,700;1,400",mg:"#140d1c",mi:"#e9e3f2",ma:"#8bd14b",m2:"#f28c28",mf:"3px solid #8bd14b",
 intro:"Lights off, doors locked, and nobody goes down to the basement for more chips. Eat at your own risk.",tags:["Don't fall asleep before dessert.","It came from the kitchen.","Some snacks never die."]},
western:{eye:"Wanted: big appetites",md:"Rye",mb:"Old Standard TT",bw:"ital,wght@0,400;0,700;1,400",mg:"#ead8b1",mi:"#3a2717",ma:"#8a2e1d",m2:"#3a2717",mf:"7px double #3a2717",
 intro:"Chuckwagon cooking. Smoke, fire and enough meat to feed the whole posse.",tags:["This kitchen ain't big enough for leftovers.","Ride in hungry. Ride out full.","Draw first. Eat faster."]},
galaxy:{eye:"From a galaxy far, far away",md:"Audiowide",mb:"Exo 2",bw:"ital,wght@0,400;0,700;1,400",mg:"#05060f",mpat:stars("#05060f"),mpsz:"220px 220px",mi:"#f1ead2",ma:"#ffd23a",m2:"#6ec1ff",mf:"2px solid #ffd23a",mf2:"1px solid #6ec1ff",mfill:"rgba(5,6,15,.78)",mtt:"uppercase",mls:".06em",
 intro:"",tags:[]},
wizard:{eye:"Served in the Great Hall",md:"IM Fell English SC",mb:"IM Fell English",bw:"ital@0;1",mg:"#efe1bd",mpat:dots("#d9c38f","#efe1bd",22,1.4),mpsz:"22px 22px",mi:"#3b2414",ma:"#7a1e1e",m2:"#1f4e3d",mf:"7px double #3b2414",mf2:"1px solid #7a1e1e",mfill:"#f6ead0",
 intro:"",tags:[]},
adventure:{eye:"Expedition rations",xf:"Caveat",md:"Bevan",mb:"Libre Baskerville",bw:"ital,wght@0,400;0,700;1,400",mg:"#d8c49a",mi:"#2b1d10",ma:"#b5401f",m2:"#4b5d33",mf:"3px dashed #2b1d10",mfill:"#e9dbb6",sh:"22px",strip:stripes("#4b5d33","#d8c49a",18),ssz:"36px 22px",stamp:"Field journal",
 intro:"",tags:[]},
fairytale:{eye:"Once upon a menu",md:"Berkshire Swash",mb:"Spectral",bw:"ital,wght@0,400;0,700;1,400",mg:"#fbeef8",mpat:dots("#f3c9e4","#fbeef8",26,2.2),mpsz:"26px 26px",mi:"#3d2a5c",ma:"#c2408c",m2:"#3c8fb0",mf:"3px solid #d4a83a",mf2:"1px solid #c2408c",mfill:"#fff8fd",
 intro:"",tags:[]},
romcom:{eye:"A table for two",md:"Playfair Display",mdspec:"ital,wght@0,700;1,700",mdw:"700",mb:"Jost",bw:"ital,wght@0,400;0,600;1,400",xf:"Caveat",mg:"#f7dcd9",mi:"#3a1d2b",ma:"#b0284f",m2:"#5f7f5a",
 intro:"",tags:[]},
philly:{eye:"Fight night card",md:"Anton",mb:"Oswald",bw:"wght@400;700",mg:"#f3ead7",mi:"#151515",ma:"#c4161c",m2:"#151515",mf:"6px solid #151515",sh:"20px",strip:stripes("#c4161c","#151515",40),ssz:"80px 20px",mtt:"uppercase",mls:".02em",
 intro:"Twelve rounds of eating. Train hard, then reward yourself with a cheesesteak the size of your forearm.",tags:["Go the distance. Then get dessert.","Eye on the prize. The prize is pie.","Every champ needs a cheesesteak."]}
};

const ESC=s=>String(s).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
const loadedFonts=new Set();
function ensureFonts(st){
  const fams=[[st.md,st.mdspec||(st.mdw?`wght@${st.mdw}`:"")],[st.mb,st.bw]];
  if(st.xf)fams.push([st.xf,"wght@400"]);
  const reqs=[];
  fams.forEach(([f,w])=>{
    const key=f+w;
    if(!loadedFonts.has(key)){
      loadedFonts.add(key);
      const l=document.createElement("link");l.rel="stylesheet";
      l.href=rdFontHref(`family=${f.replace(/ /g,"+")}${w?":"+w:""}`,"swap");
      document.head.appendChild(l);
      reqs.push(new Promise(r=>{l.onload=r;l.onerror=r}));
    }
  });
  const loads=[document.fonts.load(`${st.mdw||400} 60px "${st.md}"`,"Aa"),document.fonts.load(`700 20px "${st.mb}"`,"Aa"),document.fonts.load(`400 20px "${st.mb}"`,"Aa")];
  if(st.mdspec)loads.push(document.fonts.load(`italic ${st.mdw||400} 60px "${st.md}"`,"Aa"));
  if(st.xf)loads.push(document.fonts.load(`400 24px "${st.xf}"`,"Aa"));
  return Promise.all(reqs).then(()=>Promise.race([Promise.all(loads),new Promise(r=>setTimeout(r,3500))])).catch(()=>{});
}
const ORN={redsauce:"❧ ❦ ☙",pizza:"● ● ●",deli:"✶ ✶ ✶",street:"▰▱▰▱▰",cop:"✕ CASE CLOSED ✕",soul:"✿ ✿ ✿",xmas:"❄ ✦ ❄",aussie:"✺ ✺ ✺",asian:"❀ ❀ ❀",scifi:"◇ ◆ ◇",hero:"★ POW ★",kids:"✩ ✩ ✩",teen:"▲ ● ■",diner:"◆ ◆ ◆",mex:"✹ ✹ ✹",tiki:"✾ ✾ ✾",uptown:"◈ ◈ ◈",horror:"☾ ✝ ☽",western:"✯ ✯ ✯",philly:"■ ROUND ONE ■",galaxy:"✦ · ✧ · ✦",wizard:"⚘ ✧ ⚘",adventure:"⟡ X MARKS THE SPOT ⟡",fairytale:"♛ ✧ ♛",romcom:"♡ ♡ ♡"};
const shortHow=s=>{const i=s.indexOf(". ");return i>0&&i<s.length-1?s.slice(0,i+1):s};
/* the menu card shows the dish's short description, not the first step of the 4-person method */
function cardBlurb(f,it){
  /* the small line under a dish: its menu line, or the film moment when the menu line is already showing as the note */
  const same=(a,b)=>(a||"").replace(/[^a-z0-9]/gi,"").toLowerCase()===(b||"").replace(/[^a-z0-9]/gi,"").toLowerCase();
  for(const k of ["S","M","W","K"])for(const d of f[k]||[])if(d[0]===it.n&&d[2]){const b=shortHow(d[2]);if(!same(b,it.note))return b;return d[1]&&!same(d[1],it.note)?d[1].charAt(0).toUpperCase()+d[1].slice(1)+(/[.!?]$/.test(d[1])?"":"."):""}
  const b=it.how?shortHow(it.how):"";return same(b,it.note)?"":b}
const AISLES=["Meat","Seafood","Deli","Produce","Dairy","Bakery","Frozen","Pantry","Lollies and snacks","Drinks","Bottle shop","For the extras, buy to suit","Too late to make, buy ready-made"],READY=AISLES[AISLES.length-1];
const TASTE="For the extras, buy to suit";
function shopGroups(menu){
  const groups={};
  const shopping=[...(menu.shopping||[...menu.s,...menu.m,...menu.w,...menu.d].flatMap(it=>it.shop||[])),...(menu.counter||[])];
  /* lists put together from several dishes add up the same item: 2 garlic cloves + 5 garlic cloves = 7 garlic cloves */
  const merge=!menu.shopping,UNIT={g:["g",1],kg:["g",1000],ml:["ml",1],l:["ml",1000],L:["ml",1000]};
  const tally={},order=[];
  /* review 24: a stored list added two packs up and put the plural on the food as well as the pack ("6 slices provolones", "2 rashers bacons").
     When the dishes' own lines name it in the singular ("6 slices provolone"), the list line follows them */
  const known=new Set([...(menu.s||[]),...(menu.m||[]),...(menu.w||[]),...(menu.d||[])].flatMap(it=>it.shop||[]).map(x=>String(x).split("@")[0].trim().replace(/^\d+(?:\.\d+)?\s*(kg|g|ml|L|l)?\s+/,"").toLowerCase()));
  const packTidy=x=>{const m=!merge&&known.size&&typeof planSing==="function"&&x.match(/^(\d+(?:\.\d+)?\s+)(\S+s)( .*?)(\S+s)(@.*)?$/);if(!m||!(PL_CONT.test(m[2])||/^(litres|cups|shots)$/i.test(m[2])))return x;
    const one=planSing(m[4]),lo=s=>s.toLowerCase(),s1=planSing(m[2]);if(one===m[4]||known.has(lo(m[2]+m[3]+m[4]))||known.has(lo(s1+m[3]+m[4])))return x;
    return known.has(lo(m[2]+m[3]+one))||known.has(lo(s1+m[3]+one))?m[1]+m[2]+m[3]+one+(m[5]||""):x};
  shopping.map(packTidy).forEach(x=>{
    const [name,aisle]=x.split("@");const a=AISLES.includes((aisle||"").trim())?aisle.trim():"Pantry";const n=name.trim();
    const m=merge&&n.match(/^(\d+(?:\.\d+)?)\s*(kg|g|ml|L|l)?\s+(.+)$/);
    const key=m?a+"|"+(m[2]?UNIT[m[2]][0]:"#")+"|"+m[3].toLowerCase().replace(/(es|s)$/,""):a+"|="+n;
    if(!tally[key]){tally[key]={a,n,m:m?{q:+m[1]*(m[2]?UNIT[m[2]][1]:1),u:m[2]?UNIT[m[2]][0]:"",what:m[3]}:null};order.push(key)}
    else if(m&&tally[key].m){const t=tally[key].m;t.q+=+m[1]*(m[2]?UNIT[m[2]][1]:1);if(!m[2]&&/s$/.test(m[3]))t.what=m[3]}
  });
  order.forEach(k=>{const t=tally[k];let label=t.n;
    if(t.m){const {q,u,what}=t.m;const amt=u==="g"&&q>=1000?(q/1000)+"kg":u==="ml"&&q>=1000?(q/1000)+"L":Math.round(q*100)/100+u;label=amt+" "+what}
    (groups[t.a]=groups[t.a]||new Set()).add(label)});
  return AISLES.filter(a=>groups[a]).map(a=>[a,[...groups[a]]]);
}

/* ================= MENU DESIGN v2: layouts, artwork, texture ================= */
const svgURI=s=>"data:image/svg+xml,"+encodeURIComponent(s).replace(/'/g,"%27");
const GRAIN=svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0 0 0 -0.12'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`);
const FIBRE=svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.012 .09' numOctaves='4' seed='4'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0.16 0 0 0 -0.05'/></filter><rect width='100%' height='100%' filter='url(#f)'/></svg>`);

/* which page layout each theme uses */
const LAYOUT={redsauce:"trattoria",pizza:"trattoria",deli:"docket",asian:"docket",street:"docket",cop:"casefile",hero:"comic",western:"poster",philly:"poster",soul:"poster",diner:"placemat",teen:"placemat",aussie:"placemat",adventure:"journal",wizard:"scroll",galaxy:"hud",scifi:"hud",fairytale:"storybook",kids:"storybook",uptown:"deco",horror:"spooky",tiki:"tropic",mex:"tropic",xmas:"festive",romcom:"loveletter"};

/* ---------- original header artwork, one per theme ---------- */
function ART(t,c){
  const A=c.a,B=c.b,I=c.i,G=c.g,P=c.p||"#fff";
  const W=(inner,vb="0 0 600 240")=>`<svg xmlns='http://www.w3.org/2000/svg' width='${vb.split(' ')[2]}' height='${vb.split(' ')[3]}' viewBox='${vb}'>${inner}</svg>`;
  const star=(x,y,r,f)=>`<path d='M${x} ${y-r}L${x+r*.3} ${y-r*.3}L${x+r} ${y}L${x+r*.3} ${y+r*.3}L${x} ${y+r}L${x-r*.3} ${y+r*.3}L${x-r} ${y}L${x-r*.3} ${y-r*.3}Z' fill='${f}'/>`;
  const S={
  redsauce:W(`<defs><pattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='#fff'/><rect width='20' height='40' fill='${A}' opacity='.55'/><rect width='40' height='20' fill='${A}' opacity='.55'/></pattern></defs>
   <path d='M0 170 L600 170 L600 240 L0 240Z' fill='url(#g)'/><path d='M0 170 L600 170' stroke='${I}' stroke-width='3' opacity='.3'/>
   <g transform='translate(250 18)'><path d='M30 0h20v40c18 12 28 30 28 52v20H2V92c0-22 10-40 28-52z' fill='${B}'/><path d='M2 112h76v40c0 10-8 18-18 18H20c-10 0-18-8-18-18z' fill='#c9a25a'/><path d='M8 120h64M8 132h64M8 144h64M8 156h64' stroke='#8a6a2e' stroke-width='3'/><rect x='26' y='60' width='28' height='34' rx='3' fill='${P}'/><rect x='30' y='-6' width='20' height='10' fill='${A}'/></g>
   <g transform='translate(360 70)'><path d='M0 0h50c0 34-10 52-25 56v36h18v8H7v-8h18V56C10 52 0 34 0 0z' fill='${A}' opacity='.9'/><path d='M3 6h44' stroke='#fff' stroke-width='2' opacity='.6'/></g>
   <g transform='translate(150 120)' fill='#e7d9b0' stroke='#b89552' stroke-width='3'><ellipse cx='40' cy='40' rx='48' ry='14'/><path d='M0 30 Q40 0 80 30' fill='none'/></g>
   <circle cx='175' cy='132' r='9' fill='${A}'/><circle cx='200' cy='138' r='8' fill='${A}'/><circle cx='188' cy='124' r='7' fill='${B}'/>`),
  pizza:W(`<circle cx='300' cy='130' r='104' fill='#e9b35f'/><circle cx='300' cy='130' r='88' fill='${A}'/><circle cx='300' cy='130' r='86' fill='#f6d27a' opacity='.55'/>
   ${[[260,100],[330,90],[350,150],[280,170],[310,130],[240,145],[355,110]].map(([x,y])=>`<circle cx='${x}' cy='${y}' r='13' fill='#b8261e'/><circle cx='${x-3}' cy='${y-3}' r='4' fill='#d9584f'/>`).join('')}
   <path d='M300 130 L404 130 A104 104 0 0 1 385 190Z' fill='${G}'/><g transform='translate(400 120) rotate(18)'><path d='M0 0 L110 0 A110 110 0 0 1 92 60Z' fill='#e9b35f'/><path d='M8 6 L100 6 A96 96 0 0 1 84 54Z' fill='${A}'/><circle cx='50' cy='22' r='10' fill='#b8261e'/><path d='M40 60 q4 30 0 50 M70 52 q6 26 2 44' stroke='#f6d27a' stroke-width='6' fill='none' stroke-linecap='round'/></g>
   <path d='M150 60c10-14-6-24 4-38M175 56c10-14-6-24 4-38' stroke='${I}' stroke-width='4' fill='none' opacity='.25' stroke-linecap='round'/>`),
  deli:W(`<g transform='translate(190 40)'><rect x='0' y='110' width='220' height='34' rx='16' fill='#c88a3c'/><path d='M-6 112 q30-16 60 0 q30 16 60 0 q30-16 60 0 q30 16 60 0 l0-14 H-6Z' fill='#e45c6c'/><rect x='-4' y='70' width='228' height='28' rx='6' fill='#f3d38a'/><path d='M-8 66 q28-12 56 0 q28 12 56 0 q28-12 56 0 q28 12 56 0 l0-16 H-8Z' fill='#d2475a'/><path d='M-10 52 q30-14 60 0 q30 14 60 0 q30-14 60 0 q30 14 60 0 l0-12 H-10Z' fill='#7fb35a'/><rect x='0' y='0' width='220' height='40' rx='18' fill='#c88a3c'/><circle cx='40' cy='16' r='3' fill='#7a4f1d'/><circle cx='90' cy='10' r='3' fill='#7a4f1d'/><circle cx='150' cy='18' r='3' fill='#7a4f1d'/><path d='M110 -40 v60' stroke='#9b7a45' stroke-width='4'/><path d='M110 -40 l34 10 -34 10z' fill='${A}'/></g>
   <g transform='translate(460 150) rotate(-24)'><ellipse cx='0' cy='0' rx='22' ry='56' fill='#6f8f2f'/><path d='M-8 -40v80M8 -30v60' stroke='#4b6a1c' stroke-width='3'/></g>`),
  street:W(`<rect width='600' height='240' fill='none'/>${[[20,90,60],[90,60,50],[150,110,70],[230,40,48],[290,80,64],[365,30,56],[430,100,60],[500,70,80]].map(([x,y,w])=>`<rect x='${x}' y='${y}' width='${w}' height='${240-y}' fill='${I}' opacity='.9'/>${Array.from({length:6},(_,k)=>`<rect x='${x+8+(k%2)*(w/2-4)}' y='${y+14+Math.floor(k/2)*26}' width='10' height='14' fill='${A}' opacity='${k%3?0.9:0.35}'/>`).join('')}`).join('')}
   <g transform='translate(110 26)' fill='${I}'><rect x='0' y='22' width='26' height='34'/><path d='M-4 22 L13 4 L30 22Z'/><path d='M4 56v10M22 56v10' stroke='${I}' stroke-width='3'/></g><g transform='translate(395 4)' fill='${I}'><rect x='0' y='16' width='22' height='26'/><path d='M-4 16 L11 2 L26 16Z'/></g>
   <g transform='translate(170 180)'><rect x='0' y='10' width='200' height='40' rx='10' fill='#f5c518'/><path d='M30 10 L56 -14 H140 L166 10Z' fill='#f5c518'/><rect x='62' y='-8' width='34' height='16' fill='#9bd2f0'/><rect x='102' y='-8' width='34' height='16' fill='#9bd2f0'/><rect x='70' y='22' width='60' height='10' fill='#111'/><path d='M74 22h6v10h-6zM86 22h6v10h-6zM98 22h6v10h-6zM110 22h6v10h-6z' fill='#f5c518'/><circle cx='40' cy='50' r='14' fill='#111'/><circle cx='160' cy='50' r='14' fill='#111'/><rect x='88' y='-22' width='24' height='10' rx='2' fill='#111'/></g>`),
  cop:W(`<g transform='translate(170 30)'><path d='M90 0 L112 26 L150 18 L144 56 L176 78 L144 98 L150 138 L112 128 L90 156 L68 128 L30 138 L36 98 L4 78 L36 56 L30 18 L68 26Z' fill='#d8b14a' stroke='#8a6a1c' stroke-width='4'/><circle cx='90' cy='78' r='34' fill='#f2d675' stroke='#8a6a1c' stroke-width='3'/>${star(90,78,22,'#8a6a1c')}</g>
   <g transform='translate(380 120)'><circle cx='50' cy='50' r='50' fill='#e0a458'/><circle cx='50' cy='50' r='44' fill='#f7b6c8'/><circle cx='50' cy='50' r='16' fill='${G}'/>${[[20,30],[70,24],[80,62],[30,74],[52,84],[64,40]].map(([x,y],k)=>`<rect x='${x}' y='${y}' width='9' height='3' rx='1.5' fill='${['#5ec2e6','#fff176','#a5d76e','#ff8a65'][k%4]}' transform='rotate(${k*37} ${x} ${y})'/>`).join('')}</g>
   <g transform='translate(70 150)'><rect x='0' y='0' width='60' height='70' rx='6' fill='#fff' opacity='.9'/><path d='M60 14 q20 0 20 20 t-20 20' stroke='#fff' stroke-width='8' fill='none' opacity='.9'/><path d='M10 -10c4-10-4-14 0-24M30 -10c4-10-4-14 0-24' stroke='${I}' stroke-width='3' fill='none' opacity='.4'/></g>`),
  soul:W(`<g transform='translate(160 60)'><ellipse cx='140' cy='120' rx='150' ry='30' fill='${I}' opacity='.25'/><path d='M0 70 Q0 140 140 140 Q280 140 280 70Z' fill='#222'/><ellipse cx='140' cy='70' rx='140' ry='34' fill='#3a3a3a'/><ellipse cx='140' cy='72' rx='122' ry='26' fill='#1b1b1b'/><rect x='270' y='60' width='110' height='18' rx='9' fill='#222'/>
   ${[[70,60],[120,52],[170,58],[210,66],[100,74],[150,76]].map(([x,y])=>`<path d='M${x-24} ${y} q10-18 26-16 q20 2 22 18 q-6 14-24 12 q-22-2-24-14z' fill='#c9792e'/><path d='M${x-14} ${y-6} q8 -4 14 0' stroke='#e8a95c' stroke-width='3' fill='none'/>`).join('')}
   <path d='M90 20c8-16-6-22 2-40M140 14c8-16-6-22 2-40M190 20c8-16-6-22 2-40' stroke='${I}' stroke-width='4' fill='none' opacity='.35' stroke-linecap='round'/></g>`),
  xmas:W(`<path d='M0 20 Q150 70 300 30 Q450 -10 600 40' stroke='#2e6b3a' stroke-width='10' fill='none'/>${[[60,40,A],[150,52,'#e2b34a'],[240,40,B],[330,28,A],[420,22,'#e2b34a'],[510,30,B]].map(([x,y,f])=>`<line x1='${x}' y1='${y}' x2='${x}' y2='${y+40}' stroke='#e2b34a' stroke-width='2'/><circle cx='${x}' cy='${y+62}' r='22' fill='${f}'/><rect x='${x-6}' y='${y+36}' width='12' height='8' fill='#e2b34a'/><circle cx='${x-7}' cy='${y+55}' r='6' fill='#fff' opacity='.5'/>`).join('')}
   <g transform='translate(250 150)'><path d='M50 0 L100 80 H0Z' fill='#2e6b3a'/><path d='M50 -20 L80 40 H20Z' fill='#3f8a4b'/><rect x='42' y='80' width='16' height='16' fill='#7a4f1d'/>${star(50,-26,12,'#e2b34a')}</g>
   ${[[40,200],[120,170],[480,180],[560,140],[200,120],[420,130]].map(([x,y])=>`<circle cx='${x}' cy='${y}' r='3' fill='#fff' opacity='.7'/>`).join('')}`),
  aussie:W(`<circle cx='300' cy='150' r='90' fill='${A}' opacity='.9'/><path d='M0 170 Q120 150 220 168 T420 160 T600 172 V240 H0Z' fill='#8a3b1d'/><path d='M0 196 Q150 180 300 196 T600 190 V240 H0Z' fill='#5e2a12'/>
   <g transform='translate(390 70)'><path d='M40 0 L80 40 L40 80 L0 40Z' fill='#f2c230' stroke='#222' stroke-width='4'/><path d='M22 54 q6-20 22-22 q4-12 12-10 q-2 8-6 12 q8 6 8 18 h-6 l-2-8 l-10 10 h-8 l6-8 q-8 2-16 8z' fill='#222'/></g><path d='M430 150 v20' stroke='#555' stroke-width='5'/>
   <g transform='translate(120 70)'><path d='M30 100 V30' stroke='#6b4a2a' stroke-width='7'/><path d='M30 34 q-30-10-36-30 q24 0 36 22 q8-24 34-26 q-6 22-34 34' fill='#6b8f3a'/></g>`),
  asian:W(`<g transform='translate(220 30)'><path d='M20 60 L160 60 L140 200 L40 200Z' fill='#fff'/><path d='M20 60 L60 20 H120 L160 60Z' fill='#f2f2f2'/><path d='M40 200 L20 60' stroke='#ddd' stroke-width='3'/><path d='M60 20 Q90 -10 120 20' stroke='#999' stroke-width='4' fill='none'/><circle cx='90' cy='130' r='30' fill='${G}'/><text x='90' y='142' font-size='36' text-anchor='middle' fill='${A}' font-family='serif'>福</text></g>
   <g transform='translate(390 10) rotate(18)'><rect x='0' y='0' width='10' height='190' rx='4' fill='#c9a25a'/><rect x='18' y='6' width='10' height='190' rx='4' fill='#b38b45'/></g>
   ${[[120,170],[150,150],[90,140]].map(([x,y])=>`<path d='M${x-18} ${y} q18-26 36 0 q-18 14-36 0z' fill='#f3e6c8' stroke='#c9a25a' stroke-width='2'/>`).join('')}`),
  scifi:W(`<circle cx='430' cy='110' r='70' fill='${B}' opacity='.85'/><ellipse cx='430' cy='110' rx='120' ry='22' fill='none' stroke='${A}' stroke-width='5' transform='rotate(-14 430 110)'/>
   <g transform='translate(150 40) rotate(30)'><path d='M30 0 Q60 40 60 110 H0 Q0 40 30 0Z' fill='#e8ecf5'/><circle cx='30' cy='54' r='13' fill='${A}' stroke='#9aa4b8' stroke-width='4'/><path d='M0 80 L-22 128 H0Z M60 80 L82 128 H60Z' fill='${B}'/><path d='M8 110 L30 160 L52 110Z' fill='#ffb347'/><path d='M18 110 L30 140 L42 110Z' fill='#fff176'/></g>
   ${Array.from({length:22},(_,k)=>`<circle cx='${(k*97)%600}' cy='${(k*53)%230}' r='${k%4?1.5:3}' fill='#fff' opacity='.8'/>`).join('')}`),
  hero:W(`${[[0,150,70],[60,110,60],[120,140,50],[420,100,64],[490,130,50],[540,90,60]].map(([x,y,w])=>`<rect x='${x}' y='${y}' width='${w}' height='${240-y}' fill='${I}'/>`).join('')}
   <path d='M300 10 L330 70 L395 45 L362 100 L430 120 L362 140 L392 200 L330 170 L300 235 L270 170 L208 200 L238 140 L170 120 L238 100 L205 45 L270 70Z' fill='${A}' stroke='${I}' stroke-width='6'/><path d='M300 40 L320 85 L365 70 L345 108 L392 120 L345 132 L365 172 L320 155 L300 200 L280 155 L235 172 L255 132 L208 120 L255 108 L235 70 L280 85Z' fill='#fff'/>
   <text x='300' y='138' text-anchor='middle' font-family='Bangers, Impact, sans-serif' font-size='54' fill='${B}' stroke='${I}' stroke-width='2' transform='rotate(-8 300 120)'>POW!</text>`),
  kids:W(`<g transform='translate(200 40)'><path d='M20 60 L180 60 L160 200 L40 200Z' fill='#fff'/>${[0,1,2,3,4].map(k=>`<path d='M${20+k*32+4} 60 L${20+k*32+28} 60 L${40+k*24+20} 200 L${40+k*24} 200Z' fill='${A}' opacity='${k%2?0:1}'/>`).join('')}${Array.from({length:14},(_,k)=>`<circle cx='${30+(k*13)%150}' cy='${40+(k%3)*-14+Math.sin(k)*8}' r='15' fill='#fff7d6' stroke='#e9cf7a' stroke-width='2'/>`).join('')}</g>
   <g transform='translate(70 60)'><circle cx='40' cy='40' r='40' fill='${B}'/>${[0,1,2,3,4,5].map(k=>`<circle cx='${40+24*Math.cos(k*1.047)}' cy='${40+24*Math.sin(k*1.047)}' r='9' fill='${G}'/>`).join('')}<circle cx='40' cy='40' r='6' fill='${G}'/></g>
   ${star(470,70,26,'#ffcf3f')}${star(520,150,16,A)}${star(430,170,12,B)}`),
  teen:W(`<g transform='translate(150 40)'><rect x='0' y='30' width='300' height='150' rx='16' fill='${I}' stroke='${A}' stroke-width='6'/><circle cx='70' cy='110' r='46' fill='#222' stroke='${B}' stroke-width='6'/><circle cx='70' cy='110' r='16' fill='${B}'/><circle cx='230' cy='110' r='46' fill='#222' stroke='${B}' stroke-width='6'/><circle cx='230' cy='110' r='16' fill='${B}'/><rect x='120' y='60' width='60' height='30' rx='4' fill='${A}'/><rect x='30' y='0' width='240' height='14' rx='7' fill='${A}'/><path d='M40 0 V30 M260 0 V30' stroke='${A}' stroke-width='8'/></g>
   <path d='M40 40 l20 20 -20 20 M560 160 l-20 20 20 20' stroke='${B}' stroke-width='6' fill='none'/><circle cx='520' cy='50' r='16' fill='none' stroke='${A}' stroke-width='6'/><path d='M60 190 h40 l-20 -34z' fill='none' stroke='${A}' stroke-width='6'/>`),
  diner:W(`<g transform='translate(130 20)'><rect x='0' y='0' width='190' height='110' rx='26' fill='#1e2a2a' stroke='${A}' stroke-width='6'/><text x='95' y='80' text-anchor='middle' font-family='Pacifico, cursive' font-size='60' fill='${A}'>Eat</text><path d='M95 110v40' stroke='#1e2a2a' stroke-width='6'/></g>
   <g transform='translate(360 30)'><path d='M10 40 H110 L96 200 H24Z' fill='#fff' stroke='#ccc' stroke-width='3'/><path d='M14 60 H106 L96 200 H24Z' fill='#f7a9b8'/><circle cx='60' cy='40' r='34' fill='#fff'/><circle cx='42' cy='28' r='18' fill='#fff'/><circle cx='80' cy='28' r='18' fill='#fff'/><circle cx='60' cy='4' r='10' fill='${A}'/><path d='M60 -6 q8-20 20-24' stroke='#3a6' stroke-width='3' fill='none'/><path d='M80 -10 L96 -60' stroke='${A}' stroke-width='8' stroke-linecap='round'/></g>`),
  mex:W(`${Array.from({length:6},(_,k)=>`<path d='M${k*100} 0 h100 v60 l-50 22 l-50 -22z' fill='${[A,B,'#ffc93c','#7b4bd1','#ff7a2f','#1c9c8c'][k]}'/><circle cx='${k*100+50}' cy='30' r='10' fill='${G}'/><path d='M${k*100+20} 50 h60' stroke='${G}' stroke-width='4' stroke-dasharray='6 6'/>`).join('')}
   <g transform='translate(250 100)'><rect x='40' y='0' width='30' height='130' rx='15' fill='#3f8a4b'/><rect x='0' y='40' width='22' height='60' rx='11' fill='#3f8a4b'/><rect x='88' y='30' width='22' height='50' rx='11' fill='#3f8a4b'/><path d='M10 96 H44 M66 76 H100' stroke='#3f8a4b' stroke-width='16' stroke-linecap='round'/><circle cx='56' cy='-4' r='10' fill='${A}'/></g>
   <g transform='translate(420 140) rotate(-20)'><path d='M0 20 q60-40 120 0 q-20 40-60 40 q-40 0-60-40z' fill='#d62f2f'/><path d='M0 20 q-10-10-4-22' stroke='#3f8a4b' stroke-width='6' fill='none'/></g>`),
  tiki:W(`<circle cx='300' cy='150' r='80' fill='#ffb347' opacity='.8'/><path d='M0 180 Q300 150 600 180 V240 H0Z' fill='${B}' opacity='.6'/>
   <g transform='translate(110 20)'><path d='M30 220 Q40 120 20 40' stroke='#8a5a2b' stroke-width='12' fill='none'/>${[[-60,-10],[60,-20],[-40,30],[70,30],[0,-40]].map(([dx,dy])=>`<path d='M20 40 Q${20+dx/2} ${40+dy-30} ${20+dx} ${40+dy}' stroke='#2e7d4f' stroke-width='14' fill='none' stroke-linecap='round'/>`).join('')}</g>
   <g transform='translate(400 60)'><rect x='0' y='0' width='80' height='150' rx='10' fill='#a0522d'/><rect x='10' y='20' width='24' height='16' fill='#3a1f0f'/><rect x='46' y='20' width='24' height='16' fill='#3a1f0f'/><rect x='18' y='60' width='44' height='40' rx='6' fill='#3a1f0f'/><path d='M22 70 h36 M22 80 h36 M22 90 h36' stroke='#e9d9b0' stroke-width='3'/><path d='M0 120 h80' stroke='#3a1f0f' stroke-width='4'/><path d='M60 -10 l18 -40' stroke='${A}' stroke-width='5'/><path d='M66 -46 q20 -10 30 6 q-14 2 -30 -6' fill='#ff6f91'/></g>`),
  uptown:W(`${Array.from({length:19},(_,k)=>`<path d='M300 240 L${300+300*Math.cos(Math.PI*(k/18))} ${240-300*Math.sin(Math.PI*(k/18))}' stroke='${A}' stroke-width='${k%2?1:3}' opacity='.55'/>`).join('')}<path d='M120 240 A180 180 0 0 1 480 240' fill='none' stroke='${A}' stroke-width='4'/><path d='M180 240 A120 120 0 0 1 420 240' fill='${G}' stroke='${A}' stroke-width='3'/>
   <g transform='translate(260 80)'><path d='M0 0 H80 L40 50Z' fill='none' stroke='${A}' stroke-width='5'/><path d='M8 6 H72 L40 44Z' fill='${A}' opacity='.3'/><path d='M40 50 V120 M16 120 H64' stroke='${A}' stroke-width='5'/><circle cx='52' cy='18' r='7' fill='#7da84b'/><path d='M52 18 L78 -20' stroke='${I}' stroke-width='2'/></g>`),
  horror:W(`<circle cx='440' cy='70' r='56' fill='#f3e9b8'/><circle cx='420' cy='60' r='8' fill='#d9cf98'/><circle cx='456' cy='86' r='12' fill='#d9cf98'/>
   <path d='M0 240 V170 L60 170 L60 120 L90 90 L120 120 L120 170 L170 170 L170 140 L210 110 L250 140 L250 240Z' fill='#0c0712'/><rect x='80' y='130' width='14' height='18' fill='#ffcf5a'/><rect x='200' y='150' width='12' height='16' fill='#ffcf5a'/>
   <path d='M260 240 Q300 200 330 230 Q360 180 400 230 Q440 200 470 240Z' fill='#0c0712'/><path d='M500 240 V200 h14 v-14 h10 v14 h14 v40Z' fill='#0c0712'/>
   ${[[300,60],[340,90],[260,100]].map(([x,y])=>`<path d='M${x-22} ${y} q8-10 14-2 q4-10 8-2 q4-8 8 2 q6-8 14 2 q-14-2-22 8 q-8-10-22-8z' fill='#0c0712'/>`).join('')}`),
  western:W(`<circle cx='300' cy='120' r='70' fill='#f2a33a' opacity='.85'/><path d='M0 170 L80 170 L100 120 L200 120 L220 170 L380 170 L400 140 L470 140 L490 170 L600 170 V240 H0Z' fill='#8a2e1d' opacity='.85'/><path d='M0 200 H600 V240 H0Z' fill='#5c1e12'/>
   <g transform='translate(120 70)' fill='#3a5f2a'><rect x='20' y='0' width='22' height='130' rx='11'/><rect x='-4' y='40' width='16' height='44' rx='8'/><rect x='52' y='24' width='16' height='44' rx='8'/><path d='M4 80 H24 M40 64 H60' stroke='#3a5f2a' stroke-width='12' stroke-linecap='round'/></g>
   <g transform='translate(430 40)'>${star(40,40,40,'#c9a24a')}<circle cx='40' cy='40' r='12' fill='#8a6a1c'/></g>`),
  philly:W(`<g transform='translate(160 40)'><path d='M30 20 q0-30 50-30 q60 0 60 50 v60 q0 30-30 30 H50 q-30 0-30-30Z' fill='${A}'/><rect x='34' y='130' width='92' height='40' rx='8' fill='#f3ead7'/><path d='M20 50 q-24 0-24 26 q0 26 30 26' fill='${A}'/><path d='M60 20 q20-6 40 0' stroke='#fff' stroke-width='5' opacity='.5' fill='none'/></g>
   <g transform='translate(320 60) scale(-1 1) translate(-160 0)'><path d='M30 20 q0-30 50-30 q60 0 60 50 v60 q0 30-30 30 H50 q-30 0-30-30Z' fill='${I}'/><rect x='34' y='130' width='92' height='40' rx='8' fill='#f3ead7'/><path d='M20 50 q-24 0-24 26 q0 26 30 26' fill='${I}'/></g>
   <path d='M120 20 Q300 -10 480 20' stroke='${I}' stroke-width='3' fill='none'/>`),
  galaxy:W(`${Array.from({length:40},(_,k)=>`<circle cx='${(k*137)%600}' cy='${(k*71)%240}' r='${k%5?1.2:2.6}' fill='#fff' opacity='${.4+(k%3)*.2}'/>`).join('')}
   <circle cx='120' cy='150' r='48' fill='#f2a33a'/><circle cx='190' cy='120' r='30' fill='#ffd23a'/><path d='M0 200 Q150 170 300 200 T600 196 V240 H0Z' fill='#c99a5b' opacity='.8'/>
   <circle cx='470' cy='80' r='44' fill='#4b6fb5'/><ellipse cx='470' cy='80' rx='80' ry='14' fill='none' stroke='#9fc4ff' stroke-width='4' transform='rotate(-18 470 80)'/>
   <g transform='translate(300 60) rotate(-12)'><path d='M0 20 L70 0 L90 20 L70 40Z' fill='#d7dbe3'/><path d='M20 12 L0 -14 H18 L36 8Z M20 28 L0 54 H18 L36 32Z' fill='#9aa4b8'/><path d='M-30 16 H0 M-30 24 H0' stroke='${B}' stroke-width='4'/><circle cx='70' cy='20' r='6' fill='${B}'/></g>`),
  wizard:W(`<circle cx='480' cy='60' r='34' fill='#f6ead0'/><circle cx='494' cy='54' r='30' fill='${G}'/>
   <g fill='${I}'><rect x='180' y='100' width='240' height='140'/><rect x='160' y='60' width='50' height='180'/><path d='M150 60 L185 0 L220 60Z'/><rect x='390' y='40' width='50' height='200'/><path d='M380 40 L415 -20 L450 40Z'/><rect x='270' y='70' width='60' height='170'/><path d='M262 70 L300 0 L338 70Z'/><path d='M180 100 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20'/></g>
   ${[[180,110],[180,150],[290,110],[300,160],[405,90],[405,140],[230,150],[350,180],[260,200]].map(([x,y])=>`<rect x='${x}' y='${y}' width='10' height='16' rx='5' fill='#ffcf5a'/>`).join('')}
   ${[[60,160],[100,190],[530,170]].map(([x,y])=>`<rect x='${x}' y='${y}' width='14' height='50' fill='#f6ead0'/><path d='M${x+7} ${y-4} q-6-10 0-18 q6 8 0 18' fill='#ffcf5a'/>`).join('')}`),
  adventure:W(`<rect x='40' y='14' width='520' height='216' rx='6' fill='#e9d8a8' stroke='#8a6a3a' stroke-width='3'/><path d='M40 60 Q120 40 180 80 T340 70 T560 100' stroke='#b9a06b' stroke-width='2' fill='none'/><path d='M80 200 Q120 120 220 150 Q300 180 340 110 Q380 50 480 70' stroke='${A}' stroke-width='5' fill='none' stroke-dasharray='12 10'/>
   <path d='M470 56 l24 24 M494 56 l-24 24' stroke='${A}' stroke-width='8' stroke-linecap='round'/><g transform='translate(110 70)'><circle r='38' fill='#f4e8c4' stroke='#8a6a3a' stroke-width='3'/><path d='M0 -32 L8 0 L0 32 L-8 0Z' fill='${A}'/><path d='M-32 0 L0 -6 L32 0 L0 6Z' fill='#8a6a3a'/><text y='-42' text-anchor='middle' font-size='14' fill='#8a6a3a' font-family='serif'>N</text></g>
   <g transform='translate(300 150)' fill='#4b5d33'><path d='M0 50 q4-30 0-50' stroke='#7a5a2a' stroke-width='5' fill='none'/><path d='M0 0 q-24-6-36 6 q14-16 36-6 q-10-22-34-22 q24-4 34 22 q10-26 32-22 q-22 4-32 22 q22-10 36 4 q-20-8-36-4z'/></g>
   <path d='M380 190 l10 -14 l10 14 l10 -14 l10 14' stroke='#8a6a3a' stroke-width='3' fill='none'/>`),
  fairytale:W(`${Array.from({length:12},(_,k)=>`${star(40+k*48,30+(k%3)*22,k%2?6:10,k%2?A:'#d4a83a')}`).join('')}
   <g fill='${B}' opacity='.9'><rect x='210' y='110' width='180' height='130'/><rect x='190' y='70' width='40' height='170'/><path d='M180 70 L210 10 L240 70Z' fill='${A}'/><rect x='370' y='70' width='40' height='170'/><path d='M360 70 L390 10 L420 70Z' fill='${A}'/><rect x='275' y='50' width='50' height='190'/><path d='M265 50 L300 -30 L335 50Z' fill='${A}'/><path d='M280 240 v-40 q20-26 40 0 v40Z' fill='${G}'/></g>
   <g transform='translate(460 150)'><path d='M0 30 L10 0 L25 20 L40 0 L55 20 L70 0 L80 30Z' fill='#d4a83a'/><rect x='0' y='30' width='80' height='14' fill='#d4a83a'/><circle cx='40' cy='26' r='5' fill='${A}'/></g>`),
  romcom:(()=>{const pts=Array.from({length:15},(_,k)=>{const t=k/14;return[(1-t)*(1-t)*40+2*(1-t)*t*300+t*t*560,(1-t)*(1-t)*24+2*(1-t)*t*92+t*t*24]});
   const cup=(x,flip)=>`<g transform='translate(${x} 128)${flip?" scale(-1 1)":""}'><ellipse cx='0' cy='40' rx='46' ry='9' fill='#fff' stroke='${I}' stroke-width='2' opacity='.95'/><path d='M-30 0 H30 Q30 38 0 40 Q-30 38 -30 0Z' fill='#fff' stroke='${I}' stroke-width='2'/><path d='M30 8 q16 0 16 12 t-18 12' fill='none' stroke='${I}' stroke-width='3'/><ellipse cx='0' cy='1' rx='29' ry='6' fill='#a8754a'/><path d='M0 5 c-6-6-12 0-6 4 l6 4 l6-4 c6-4 0-10-6-4z' fill='#f6e7d6'/></g>`;
   return W(`<path d='M40 24 Q300 160 560 24' stroke='${I}' stroke-width='2' fill='none' opacity='.45'/>${pts.slice(1,14).map(([x,y],k)=>`<circle cx='${x.toFixed(1)}' cy='${(y+6).toFixed(1)}' r='7' fill='#ffd98a' opacity='.95'/><circle cx='${x.toFixed(1)}' cy='${(y+6).toFixed(1)}' r='14' fill='#ffd98a' opacity='.18'/>`).join('')}
   <ellipse cx='300' cy='186' rx='200' ry='28' fill='${B}' opacity='.9'/><ellipse cx='300' cy='180' rx='200' ry='26' fill='#fff7f2' stroke='${A}' stroke-width='3'/><path d='M120 186 Q300 214 480 186' stroke='${A}' stroke-width='2' stroke-dasharray='6 8' fill='none' opacity='.6'/>
   ${cup(215,false)}${cup(385,true)}
   <g transform='translate(300 92)'><path d='M-10 86 q-6-30 4-52 h12 q10 22 4 52z' fill='#cfe3e8' stroke='${I}' stroke-width='2' opacity='.9'/><path d='M0 36 q-4-30 2-52' stroke='${B}' stroke-width='4' fill='none'/><path d='M2 0 q-18 -8 -10 -26 q8 -12 22 -4 q10 10 2 24 q-6 8 -14 6z' fill='${A}'/><path d='M4 -8 q-6 -6 0 -14 q8 2 6 10' stroke='#7a1430' stroke-width='2' fill='none'/><path d='M-2 18 q-16 -2 -20 -14 q14 0 20 10z' fill='${B}'/></g>
   <path d='M206 112 c-4-14 8-18 6-30 M222 110 c-4-14 8-18 6-30 M378 112 c-4-14 8-18 6-30 M394 110 c-4-14 8-18 6-30' stroke='${I}' stroke-width='2.5' fill='none' opacity='.3' stroke-linecap='round'/>`)})(),
  };
  return svgURI(S[t]||S.kids);
}

/* ---------- per-layout decorations (background and foreground layers) ---------- */
function DECO(L,c,f){
  const A=c.a,B=c.b,I=c.i,G=c.g;
  const zig=(fill,flip)=>svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='12'><path d='${flip?'M0 0 L12 12 L24 0Z':'M0 12 L12 0 L24 12Z'}' fill='${fill}'/></svg>`);
  const scallop=fill=>svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='30'><path d='M0 0 H60 V10 A15 15 0 0 1 30 10 A15 15 0 0 1 0 10Z' fill='${fill}'/></svg>`);
  switch(L){
  case "trattoria":return{bg:`<div class="d-awning" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='90'><rect width='40' height='70' fill='${A}'/><rect x='40' width='40' height='70' fill='#fffaf0'/><path d='M0 70 A20 20 0 0 0 40 70Z' fill='${A}'/><path d='M40 70 A20 20 0 0 0 80 70Z' fill='#fffaf0'/></svg>`)}')"></div><div class="d-cloth" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect width='44' height='44' fill='#fff'/><rect width='22' height='44' fill='${A}' opacity='.5'/><rect width='44' height='22' fill='${A}' opacity='.5'/></svg>`)}')"></div>`,fg:`<div class="d-label"><span>Casa</span><b>${f.year}</b><span>Vino della casa</span></div>`};
  case "docket":return{bg:`<div class="d-paper"><i class="d-zig top" style="background-image:url('${zig("#fffdf6",0)}')"></i><i class="d-zig bot" style="background-image:url('${zig("#fffdf6",1)}')"></i></div>`,fg:`<div class="d-barcode" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='50'>${Array.from({length:60},(_,k)=>`<rect x='${k*5}' width='${[1,2,3,1,2][k%5]}' height='50' fill='#222'/>`).join('')}</svg>`)}')"></div><div class="d-stub">ORDER NO. ${String(Math.abs([...f.title].reduce((h,ch)=>h*31+ch.charCodeAt(0)|0,7))%9000+1000)}</div>`};
  case "casefile":return{bg:`<div class="d-desk"></div><div class="d-folder"><i class="d-tab">CASE FILE &nbsp; ${f.year}-${(f.title.length*37)%900+100}</i></div>`,fg:`<div class="d-clip" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='160'><path d='M18 150 V30 a12 12 0 0 1 24 0 V130 a20 20 0 0 1 -40 0 V20 a28 28 0 0 1 56 0 V120' fill='none' stroke='#9aa0a6' stroke-width='6' stroke-linecap='round'/></svg>`)}')"></div><div class="d-stamp">Classified</div><div class="d-coffee"></div>`};
  case "comic":return{bg:`<div class="d-halftone"></div>`,fg:`<div class="d-burst"><span>Tonight!</span></div>`};
  case "poster":{const tear=fl=>svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='90' height='14'><path d='${fl?"M0 0 H90 V4 L84 9 L76 5 L69 12 L60 6 L52 10 L44 4 L37 11 L29 6 L21 12 L13 5 L6 10 L0 6Z":"M0 14 H90 V10 L84 5 L76 9 L69 2 L60 8 L52 4 L44 10 L37 3 L29 8 L21 2 L13 9 L6 4 L0 8Z"}' fill='${c.m}'/></svg>`);return{bg:`<div class="d-sheet" style="background-color:${c.m}"><i class="d-tear top" style="background-image:url('${tear(0)}')"></i><i class="d-tear bot" style="background-image:url('${tear(1)}')"></i></div>`,fg:`<div class="d-nails"><i></i><i></i><i></i><i></i></div>`}}
  case "placemat":return{bg:`<div class="d-checker" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='36' height='36' fill='${A}'/><rect width='18' height='18' fill='#fff'/><rect x='18' y='18' width='18' height='18' fill='#fff'/></svg>`)}')"></div><div class="d-mat"></div>`,fg:`<div class="d-ring"></div><div class="d-sticker"><b>${c.n}</b><span>Est. ${f.year}</span></div>`};
  case "journal":return{bg:`<div class="d-kraft"></div><div class="d-page"></div><div class="d-route" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='700' height='1000' viewBox='0 0 700 1000'><path d='M40 980 C 200 800, 80 640, 300 560 S 620 420, 520 220 S 300 60, 660 20' stroke='${A}' stroke-width='4' fill='none' stroke-dasharray='14 12' opacity='.18'/><path d='M640 10 l24 24 M664 10 l-24 24' stroke='${A}' stroke-width='6' opacity='.5'/></svg>`)}')"></div>`,fg:`<i class="d-tape t1"></i><i class="d-tape t2"></i><div class="d-note">Pack: ${low1(f.S[0][0])}, ${low1(f.K[0][0])}, torch.</div>`};
  case "scroll":return{bg:`<div class="d-parch"><i class="d-roll top"></i><i class="d-roll bot"></i></div>`,fg:`<div class="d-seal"><span>${f.title.replace(/^(The|A) /,'').charAt(0)}</span></div><div class="d-ribbon"></div>`};
  case "hud":return{bg:`<div class="d-grid"></div><div class="d-scan"></div>`,fg:`<i class="d-corner tl"></i><i class="d-corner tr"></i><i class="d-corner bl"></i><i class="d-corner br"></i><div class="d-readout">SECTOR ${f.year} &nbsp;/&nbsp; RATIONS LOADED &nbsp;/&nbsp; ${f.id.length*13} KCAL OF FUN</div>`};
  case "storybook":return{bg:`<div class="d-arch"></div>`,fg:`<i class="d-flour tl"></i><i class="d-flour tr"></i><i class="d-flour bl"></i><i class="d-flour br"></i>`};
  case "deco":return{bg:`<div class="d-decoframe"><i></i></div><div class="d-fan" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'>${Array.from({length:13},(_,k)=>`<path d='M100 100 L${100+100*Math.cos(Math.PI*k/12)} ${100-100*Math.sin(Math.PI*k/12)}' stroke='${A}' stroke-width='${k%2?0.6:1.4}'/>`).join('')}</svg>`)}')"></div>`,fg:`<i class="d-dc tl"></i><i class="d-dc tr"></i><i class="d-dc bl"></i><i class="d-dc br"></i>`};
  case "spooky":return{bg:`<div class="d-night"></div><div class="d-drip" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='90'><path d='M0 0 H120 V20 Q110 20 108 50 Q106 70 100 50 Q96 22 80 24 Q70 26 68 70 Q66 86 60 70 Q56 26 44 26 Q30 26 28 44 Q26 58 20 44 Q16 22 0 22Z' fill='${A}'/></svg>`)}')"></div><div class="d-card"></div>`,fg:`<div class="d-bats" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='120' viewBox='0 0 300 120'>${[[40,40],[120,20],[230,60]].map(([x,y])=>`<path d='M${x-30} ${y} q12-16 22-4 q6-14 8-2 q2-12 8 2 q10-12 22 4 q-20-4-30 12 q-10-16-30-12z' fill='#0c0712'/>`).join('')}</svg>`)}')"></div>`};
  case "tropic":return{bg:`<div class="d-sunset"></div><div class="d-bamboo"></div>`,fg:`<div class="d-leaf l"></div><div class="d-leaf r"></div><div class="d-flower"></div>`};
  case "loveletter":return{bg:`<div class="d-blush"></div><div class="d-env"></div>`,fg:`<div class="d-post"><i></i></div><div class="d-mark"></div><div class="d-wax"></div><div class="d-ps">P.S. Save me the last bite.</div>`};
  case "festive":return{bg:`<div class="d-wrap"></div><i class="d-ribv"></i><i class="d-ribh"></i>`,fg:`<div class="d-bow"></div><div class="d-tag"><span>To: the couch</span><span>From: ${f.title.length>18?'the film':f.title}</span></div>`};
  }
  return{bg:"",fg:""};
}

/* palette helper for a film */
function pal(f){const st=STY[f.theme];return{a:st.ma,b:st.m2,i:st.mi,g:st.mg,m:st.mg,p:"#fff",n:T[f.theme].name}}

const COURSE_LABEL={redsauce:["Antipasti","Secondi","Dolci","Da bere"],pizza:["Starters","Pies","Sweet","Pour"],deli:["Counter","Sandwich board","Bakery case","Fountain"],asian:["Small eats","Big plates","Sweet","Pot of tea"],street:["Off the cart","Heroes","Sweet","Cold one"],cop:["Exhibit A","Exhibit B","Evidence: sweet","Evidence: liquid"],hero:["Origin snacks","Main event","Sweet victory","Power-up"],western:["Grub","Chuckwagon","Sweet","Saloon"],philly:["Round one","Main event","Sweet","Corner"],soul:["Starters","Supper","Sweet","Drinks"],diner:["Starters","Blue plate specials","Pie case","Fountain"],teen:["Snacks","Food court","Sweet","Slurp"],aussie:["Nibbles","Off the barbie","Sweet","In the esky"],adventure:["Trail snacks","Camp supper","Sweet","Canteen"],wizard:["To begin","The feast","Pudding","Goblets"],galaxy:["Rations","Main course","Sweet","Cantina"],scifi:["Rations","Main course","Sweet","Fuel"],fairytale:["Once upon a snack","The royal feast","Happily ever after","Potions"],kids:["Snacks","Mains","Treat","Drinks"],uptown:["Hors d'oeuvres","Entrées","Dessert","Bar"],horror:["Appetisers","Main slaughter","Afterlife","Potion"],tiki:["Pupu platter","Luau","Sweet","Tiki bar"],mex:["Botanas","Platos","Postre","Bebidas"],xmas:["Nibbles","The feast","Pudding","Cheer"],romcom:["The meet-cute","The big date","Sweet nothings","A toast"]};

const TMDB_IMG="https://image.tmdb.org/t/p/";
function lobbyPoster(f){return typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id]||null}
function lobbyHTML(f,menu,tag,path){
  const lab=COURSE_LABEL[f.theme]||["Snacks","Mains","Something sweet","To drink"];
  const item=it=>`<div class="mc-item"><b>${ESC(it.n)}</b>${it.note?`<span class="mc-note">${ESC(it.note)}</span>`:""}${cardBlurb(f,it)?`<span class="mc-how">${ESC(cardBlurb(f,it))}</span>`:""}</div>`;
  const course=(cls,label,items)=>items.length?`<div class="mc-course ${cls}"><h3><span>${label}</span></h3>${items.map(item).join("")}</div>`:"";
  return `<img class="lb-bg" crossorigin="anonymous" alt="" src="${TMDB_IMG}w342${ESC(path)}"><div class="lb-shade"></div><div class="mc-grain" style="background-image:url('${GRAIN}')"></div>
  <div class="mc-in">
    <header class="lb-head">
      <div class="lb-frame"><img class="lb-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(path)}" alt="${ESC(f.title)} (${ESC(f.year)}) film poster"></div>
      <div class="lb-info">
        <div class="mc-eye">Now showing</div>
        <div class="mc-title"><span>${ESC(f.title)}</span></div>
        <div class="mc-year">${f.year}</div>
        <p class="mc-tag">${ESC(tag)}</p>
        <p class="mc-desc">${ESC(f.D)}</p>
      </div>
    </header>
    <section class="lb-menu">
      <h2 class="lb-menu-h">Movie night menu</h2>
      <div class="mc-orn">${ORN[f.theme]||"• • •"}</div>
      <section class="mc-courses">
        ${course("c-s",lab[0],menu.s)}${course("c-m",lab[1],menu.m)}${course("c-w",lab[2],menu.w)}${course("c-d",lab[3],menu.d)}
      </section>
      <div class="mc-cue"><b>Showtime cue</b><span>${ESC(dietCue(f,(movieEdition(f)||{}).cue||f.P))}</span></div>
      <div class="mc-foot">${ESC(T[f.theme].name)} &nbsp;/&nbsp; full methods and shopping list on the prep sheet</div>
    </section>
  </div>
  <div class="lb-credit">Poster: TMDB</div>`;
}

/* mode: true = real poster lobby card, falling back to the edition art; "edition" = edition art only; false = themed card */
function cardHTML(f,menu,tag,usePoster=true){
  const edition=movieEdition(f);
  const lp=usePoster===true&&lobbyPoster(f);
  if(lp)return lobbyHTML(f,menu,tag,lp);
  /* the app never shows the generated poster menus (docs/ARTWORK-RIGHTS.md): it falls through to the themed card */
  if(edition&&usePoster&&!globalThis.REEL_APP){
    const sections=[["Snacks",menu.s],["Main",menu.m],["Dessert",menu.w],["Drink",menu.d]];
    return `<img class="poster-art" src="${ESC(edition.poster)}" alt="${ESC(f.title)} (${ESC(f.year)}) movie-night menu"><div class="sr"><h2>${ESC(f.title)} movie-night menu</h2>${sections.map(([label,items])=>`<section><h3>${label}</h3>${items.map(it=>`<p><b>${ESC(it.n)}</b> ${ESC(it.note)}</p>`).join("")}</section>`).join("")}</div>`;
  }
  const st=STY[f.theme],L=LAYOUT[f.theme]||"storybook",c=pal(f),d=DECO(L,c,f);
  const lab=COURSE_LABEL[f.theme]||["Snacks","Mains","Something sweet","To drink"];
  const item=it=>`<div class="mc-item"><b>${ESC(it.n)}</b>${it.note?`<span class="mc-note">${ESC(it.note)}</span>`:""}${cardBlurb(f,it)?`<span class="mc-how">${ESC(cardBlurb(f,it))}</span>`:""}</div>`;
  const course=(cls,label,items)=>items.length?`<div class="mc-course ${cls}"><h3><span>${label}</span></h3>${items.map(item).join("")}</div>`:"";
  return `<div class="mc-bg">${d.bg}</div><div class="mc-grain" style="background-image:url('${GRAIN}')"></div>
  <div class="mc-in">
    <header class="mc-head">
      <img class="mc-art" alt="" src="${ART(f.theme,c)}">
      <div class="mc-eye">${ESC(st.eye)}</div>
      <div class="mc-title"><span>${ESC(f.title)}</span></div>
      <div class="mc-year">${f.year}</div>
      <p class="mc-tag">${ESC(tag)}</p>
      <p class="mc-desc">${ESC(f.D)}</p>
    </header>
    <div class="mc-orn">${ORN[f.theme]||"• • •"}</div>
    <section class="mc-courses">
      ${course("c-s",lab[0],menu.s)}${course("c-m",lab[1],menu.m)}${course("c-w",lab[2],menu.w)}${course("c-d",lab[3],menu.d)}
    </section>
    <div class="mc-cue"><b>Showtime cue</b><span>${ESC(dietCue(f,f.P))}</span></div>
    <div class="mc-foot">${ESC(T[f.theme].name)} &nbsp;/&nbsp; full methods and shopping list on the prep sheet</div>
  </div>
  <div class="mc-fg">${d.fg}</div>`;
}

/* the Prep sheet gets the same dry pass as the card (method lines and the showtime cue), so kids' mode never reads "Serve beside frozen vodka" */
function prepHTML(f,menu){const h=prepHTML0(f,menu);if(typeof document==='undefined'||!dryNow(f))return h;try{const t=document.createElement('template');t.innerHTML=h;kidsDryDom(t.content,f);const d=document.createElement('div');d.appendChild(t.content);return d.innerHTML}catch(e){return h}}
function prepHTML0(f,menu){
  if(f._r2&&f._r2.dishes&&f._r2.dishes.length)return prepHTML2(f,menu);
  const edition=movieEdition(f);
  const L=LAYOUT[f.theme]||"storybook",c=pal(f),d=DECO(L,c,f);
  const shop=shopGroups(menu).map(([a,list])=>`<div class="pp-aisle"><h4>${a}</h4><ul>${list.map(x=>`<li><span class="pp-box"></span>${ESC(x)}</li>`).join("")}</ul></div>`).join("");
  const secs=[["Snack",menu.s],["Main",menu.m],["Sweet",menu.w],["Drink",menu.d]];
  const steps=secs.map(([l,items])=>items.map(it=>`<li><b>${ESC(it.n)}</b><em>${l}</em><span>${ESC(degC(it.how||""))}</span></li>`).join("")).join("");
  return `<div class="mc-bg">${d.bg}</div><div class="mc-grain" style="background-image:url('${GRAIN}')"></div>
  <div class="mc-in pp">
    <div class="mc-eye">Prep sheet</div>
    <div class="pp-title">${ESC(f.title)}</div>
    ${menu.shopping?`<p class="pp-serves">Serves ${edition?edition.servings:4} &nbsp;/&nbsp; exact quantities</p>`:""}
    <div class="pp-cols"><div class="pp-shop"><h3>Shopping list</h3>${shop}</div><div class="pp-method"><h3>How to make it</h3><ol>${steps}</ol></div></div>
    <div class="mc-cue"><b>Showtime cue</b><span>${ESC(dietCue(f,edition&&edition.cue||f.P))}</span></div>
  </div>`;
}

function styleCard(el,f){
  el.style.width="";el.style.height="";delete el.dataset.w;delete el.dataset.h;
  const st=STY[f.theme];
  const vars={"--mg":st.mg,"--mi":st.mi,"--ma":st.ma,"--m2":st.m2,
    "--md":`"${st.md}",Georgia,serif`,"--mb":`"${st.mb}",Georgia,serif`,"--mdw":st.mdw,"--mtt":st.mtt,"--mls":st.mls,
    "--mpat":st.mpat,"--mpsz":st.mpsz,"--fibre":`url("${FIBRE}")`,"--xf":st.xf?`"${st.xf}",cursive`:null};
  el.removeAttribute("style");
  el.className="mcard L-"+(LAYOUT[f.theme]||"storybook")+" T-"+f.theme;
  for(const [k,v] of Object.entries(vars))if(v)el.style.setProperty(k,v);
}

/* shrink the title, art and type until the menu fits the A4 page */
function fit(el){
  if(el.classList.contains("poster-edition"))return;
  const title=el.querySelector(".mc-title"),inner=el.querySelector(".mc-in"),art=el.querySelector(".mc-art");
  const panel=el.querySelector(".lb-menu");
  const over=()=>inner.scrollHeight>inner.clientHeight+1||(panel&&panel.scrollHeight>panel.clientHeight+1);
  title.style.fontSize="";if(art){art.style.height="";art.style.width=""}
  el.querySelectorAll("[data-base]").forEach(n=>n.style.fontSize="");
  el.querySelectorAll(".mc-desc,.mc-how").forEach(n=>n.style.display="");
  let fs=parseFloat(getComputedStyle(title).fontSize)||80;
  const setT=v=>{fs=v;title.style.fontSize=v+"px"};
  const lh=()=>parseFloat(getComputedStyle(title).lineHeight)||fs*1.05;
  const maxL=el.classList.contains("L-lobby")?3.2:2.3;
  while(fs>34&&(title.scrollHeight>lh()*maxL||title.scrollWidth>title.clientWidth+2))setT(fs-3);
  const fsFit=fs,artH=art?art.offsetHeight:0;
  const nodes=[...el.querySelectorAll(".mc-item b,.mc-note,.mc-how,.mc-cue,.mc-tag,.mc-desc,.mc-course h3,.mc-eye,.mc-orn")];
  nodes.forEach(n=>n.dataset.base=n.dataset.base||parseFloat(getComputedStyle(n).fontSize));
  let k=1;
  while(over()&&k>0.5){
    k-=0.025;
    nodes.forEach(n=>n.style.fontSize=(n.dataset.base*k)+"px");
    if(art&&artH){art.style.width="auto";art.style.height=Math.max(64,artH*(0.25+0.75*k))+"px"}
    setT(Math.max(30,fsFit*Math.max(0.6,k)));
  }
  if(over()){const d=el.querySelector(".mc-desc");if(d)d.style.display="none"}
  if(over())el.querySelectorAll(".mc-how").forEach(n=>n.style.display="none");
}
function fitPrep(el){
  /* section headings stay on one line: wide display faces step down until they fit their column */
  try{el.querySelectorAll(".pp-cols h3").forEach(h=>{h.style.fontSize="";h.style.whiteSpace="nowrap";let k=1;const base=parseFloat(getComputedStyle(h).fontSize);
    while(k>.62&&h.scrollWidth>h.clientWidth+1){k-=.04;h.style.fontSize=(base*k)+"px"}h.style.whiteSpace=""})}catch(e){}
  const inner=el.querySelector(".mc-in"),cols=el.querySelector(".pp-cols");
  if(!inner||!cols)return;
  /* on screen the sheet is a normal page at reading size; only the A4 copy for save, PDF and print gets fitted */
  if(el.closest(".preview")){cols.style.fontSize="";return}
  let fs=16;cols.style.fontSize=fs+"px";
  while(inner.scrollHeight>inner.clientHeight+1&&fs>9){fs-=0.5;cols.style.fontSize=fs+"px"}
}
/* an A4 copy of the prep sheet, fitted off screen, for print */
/* a long Prep sheet runs onto more A4 pages instead of shrinking below reading size or losing its last dishes:
   page one keeps the header and shopping list, later pages carry on the method full width */
const PREP_MIN_FS=9.5;
function prepFit(el){const st=document.createElement("div");st.style.cssText="position:fixed;left:-20000px;top:0;width:794px;height:1123px";
  /* measured exactly as renderCanvas draws it */
  const c=el.cloneNode(true);c.hidden=false;c.style.transform="none";prepClean(c);st.appendChild(c);document.body.appendChild(st);fitPrep(c);
  const i=c.querySelector(".mc-in"),cols=c.querySelector(".pp-cols"),fs=cols?parseFloat(cols.style.fontSize)||16:16,ok=!i||i.scrollHeight<=i.clientHeight+1;st.remove();return ok&&fs>=PREP_MIN_FS}
function prepParts(){
  const base=prep.cloneNode(true);if(prepFit(base))return [prep];
  /* review 12: a page holds a run of shopping aisles, then a run of method steps, as many as fit on A4 at a readable size.
     A long shopping list no longer pushes the showtime cue off page 1: the steps move over, and if the list alone is too long, its last aisles do too */
  const A=base.querySelectorAll(".pp-shop>.pp-aisle").length,o0=base.querySelector(".pp-method>ol"),n=o0?o0.children.length:0,N=A+n;
  if(N<2)return [prep];
  const page=(i,j,first)=>{const c=prep.cloneNode(true),sh=c.querySelector(".pp-shop"),me=c.querySelector(".pp-method"),o=me&&me.querySelector("ol");
    if(sh)[...sh.querySelectorAll(":scope>.pp-aisle")].forEach((x,k)=>{if(k<i||k>=j)x.remove()});
    if(o)[...o.children].forEach((li,k)=>{if(k+A<i||k+A>=j)li.remove()});
    const hasA=i<A,hasS=j>A;
    if(!first)c.classList.add("pp-cont");
    if(sh&&!hasA)sh.remove();else if(sh&&!first){const h=sh.querySelector("h3");if(h)h.textContent="Shopping list, continued"}
    if(me&&!hasS){me.remove();c.classList.add("pp-shoponly")}else if(o){const s0=Math.max(0,i-A);if(s0)o.setAttribute("start",s0+1);if(s0>0){const h=me.querySelector("h3");if(h)h.textContent="How to make it, continued"}}
    return c};
  const cuts=[];let i=0;
  while(i<N){let j=N;while(j>i+1&&!prepFit(page(i,j,!cuts.length)))j--;cuts.push([i,j]);i=j}
  /* review 26: filling each page to the brim could leave the last recipe step alone on a nearly empty page. The last two pages now share
     their items: steps move back onto the last page, while it still fits, until it holds about half */
  if(cuts.length>1){const L=cuts.length,[p0]=cuts[L-2],half=Math.ceil((N-p0)/2);let s=cuts[L-1][0];
    /* the shopping list never splits to make room: aisles that sat together on the page before stay there */
    const keep=s>=A?Math.max(p0+1,A):p0+1;
    while(s-1>=keep&&s-1>p0&&N-(s-1)<=half&&prepFit(page(s-1,N,false)))s--;cuts[L-2][1]=s;cuts[L-1][0]=s}
  return cuts.map(([a,b],k)=>page(a,b,k===0));
}
async function prepCanvases(){const out=[];for(const el of prepParts()){out.push(await renderCanvas(el))}return out}
function prepA4(){
  const stage=document.createElement("div");stage.style.cssText="position:fixed;left:-20000px;top:0;width:794px;height:1123px";
  const c=prep.cloneNode(true);c.style.transform="none";c.hidden=false;c.classList.add("pp-a4");prepClean(c);stage.appendChild(c);document.body.appendChild(stage);
  fitPrep(c);stage.remove();return c;
}
document.documentElement.style.setProperty("--grain",`url("${GRAIN}")`);
const preview=$("preview");
const card=document.createElement("div");card.className="mcard";preview.appendChild(card);
const prep=document.createElement("div");prep.className="mcard";prep.hidden=true;preview.appendChild(prep);
/* phones: a menu with more than one page shows one page per screen, swipe or tap a dot to turn */
const swipeW=()=>matchMedia("(max-width:600px)").matches;
let pvFace=0,pvDrag=0;
function cardFaces(){
  if(!card.innerHTML.trim()||!card.classList.contains("fmt"))return [];
  const fs=card.classList.contains("fx-paper")?[...card.querySelectorAll(".fx-face")]:[];
  if(fs.length>=2){const w=parseFloat(fs[0].style.width),h=parseFloat(fs[0].style.height),row=h>w,g=typeof FMT_GAP!=="undefined"?FMT_GAP:28;
    return fs.map((el,i)=>({el,w,h,x:row?i*(w+g):0,y:row?0:i*(h+g),row}))}
  /* one wide page (a landscape placemat, canteen tray or bill of fare): on a phone it shows as two overlapping views, left then right,
     each a little over half the page, so the type is readable and nothing is lost at the join */
  const el=fs[0]||card,w=parseFloat(el.style.width)||+card.dataset.w||1123,h=parseFloat(el.style.height)||+card.dataset.h||794;
  if(!(w>h*1.15))return [];
  const vw=Math.round(w*.56);return [{el,w:vw,h,x:0,y:0,row:true,part:1},{el,w:vw,h,x:w-vw,y:0,row:true,part:2}];
}
const pvDots=document.createElement("div");pvDots.className="pv-dots";pvDots.hidden=true;$("easel").after(pvDots);
pvDots.addEventListener("click",e=>{const b=e.target.closest("button[data-i]");if(b)pvGo(+b.dataset.i)});
function paintDots(n){
  if(n<2){pvDots.hidden=true;pvDots.innerHTML="";return}
  if(pvDots.children.length!==n)pvDots.innerHTML=Array.from({length:n},(_,i)=>`<button type="button" data-i="${i}" aria-label="Page ${i+1} of ${n}"><i></i></button>`).join("");
  [...pvDots.children].forEach((b,i)=>b.setAttribute("aria-current",i===pvFace?"true":"false"));pvDots.hidden=false;
}
/* animate only a page turn, never the first layout of a new menu */
let pvT=0;function pvTurn(){preview.classList.add("pv-turn");clearTimeout(pvT);pvT=setTimeout(()=>preview.classList.remove("pv-turn"),340)}
function pvGo(i){
  const fs=cardFaces();if(!fs.length)return;i=Math.max(0,Math.min(fs.length-1,i));
  if(i===pvFace||fs[0].row||reduce){pvTurn();pvFace=i;scalePreview();return}
  /* pages stacked top to bottom on the sheet: fade across instead of sliding */
  card.style.transition="opacity .15s";card.style.opacity="0";
  setTimeout(()=>{pvFace=i;card.style.transition="none";scalePreview();requestAnimationFrame(()=>{card.style.transition="opacity .15s";card.style.opacity="";setTimeout(()=>{card.style.transition=""},200)})},150);
}
/* half views of a wide page: text the view edge cuts so that less than 60% shows ("Parr", "DUMB") is hidden, so the edge reads as a clean peek */
function pvMask(f,k){const key=f&&f.part?f.part+"|"+card.innerHTML.length:"";if(card.dataset.pvm===key)return;card.dataset.pvm=key;
  card.querySelectorAll(".pv-off").forEach(e=>e.classList.remove("pv-off"));if(!key)return;
  const b=f.el.getBoundingClientRect(),lo=f.x,hi=f.x+f.w,off=[];
  const rg=document.createRange();
  for(const e of f.el.querySelectorAll("*")){const tn=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());if(!tn.length)continue;
    /* measure the words themselves, not the box around them */
    let l=1e9,rt=-1e9;for(const n of tn){rg.selectNodeContents(n);for(const r of rg.getClientRects()){if(r.width){l=Math.min(l,r.left);rt=Math.max(rt,r.right)}}}
    if(rt<l)continue;l=(l-b.left)/k;rt=(rt-b.left)/k;const w=rt-l,seen=Math.min(rt,hi)-Math.max(l,lo);
    /* review 21: only a short fragment (a word or two of a heading) steps aside. A dish name or note runs on past the edge as a peek; hiding
       every long line left Nativity!'s main tray an empty box on the phone, since most of its names cross the fold */
    const words=tn.map(n=>n.textContent.trim()).join(" ").split(/\s+/).length;
    /* 13 Nov: a long line (three words or more) only steps aside when under about two words of it show (48px); a share of its width hid
       the drive-in Showtime line whole (24% in view) while the dish lines beside it ran on past the edge */
    if(seen<w-1&&(seen<=0||(words<=2||seen<48)&&(seen/w<.6||(l+rt)/2<lo||(l+rt)/2>hi)))off.push(e)}
  off.forEach(e=>e.classList.add("pv-off"))}
function scalePreview(){if(card.parentNode!==preview)return;const pw=preview.clientWidth;if(!pw)return;try{if(IOS_SAFARI)setTimeout(()=>iosBakeFilters(card),80)}catch(e){}
  const fs=tab==="menu"&&swipeW()?cardFaces():[];paintDots(fs.length);
  if(fs.length){pvFace=Math.min(pvFace,fs.length-1);const f=fs[pvFace],k=pw/f.w;preview.classList.add("pv-swipe");
    card.style.transform=`translate(${-f.x*k+pvDrag}px,${-f.y*k}px) scale(${k})`;prep.style.transform="none";preview.style.height=f.h*k+"px";pvMask(f,k);preview.dataset.part=f.part||"";
    preview.setAttribute("aria-label",`Printed menu, page ${pvFace+1} of ${fs.length}. Open it full size`);return}
  pvMask(null);delete preview.dataset.part;if(preview.classList.contains("pv-swipe")){preview.classList.remove("pv-swipe");preview.setAttribute("aria-label","Open the printed menu full size")}
  const land=card.classList.contains("fmt"),cw=+card.dataset.w||(land?1123:794),ch=+card.dataset.h||(land?794:1123),kc=pw/cw,kp=pw/794;card.style.transform=`scale(${kc})`;prep.style.transform="none";preview.style.height=tab==="prep"?"auto":ch*kc+"px"}
let tab="menu";
function setTab(t){tab=t;{const pb=$("planner");if(pb)pb.hidden=!(pb.dataset.has&&t==="prep")}if(t==="menu")phoneOn=true;card.hidden=t!=="menu";prep.hidden=t!=="prep";$("tabMenu").classList.toggle("on",t==="menu");$("tabPrep").classList.toggle("on",t==="prep");$("tabMenu").setAttribute("aria-selected",t==="menu");$("tabPrep").setAttribute("aria-selected",t==="prep");if(window.__spinbarUpd)setTimeout(window.__spinbarUpd,0);if(t==="prep"&&current){if(!prep.querySelector(".pp-cols")&&current.menu){try{styleCard(prep,current);prep.classList.add("pp-sheet");prep.innerHTML=prepHTML(current,current.menu)}catch(e){}}fitPrep(prep)}scalePreview();applyPhone()}
$("tabMenu").addEventListener("click",()=>setTab("menu"));
$("tabPrep").addEventListener("click",()=>setTab("prep"));
window.addEventListener("resize",()=>{scalePreview();applyPhone()});
/* era formats: phones get the big-type menu, the printed spread is one tap away */
const fmtPhone=$("fmtPhone");let phoneOn=true;
const narrow=()=>matchMedia("(max-width:700px)").matches;
/* phones: the printed menu first, tap it to read it full size, the big-type text menu underneath */
function applyPhone(){
  const has=!!fmtPhone.innerHTML,on=has&&narrow()&&tab==="menu";
  fmtPhone.hidden=!on;$("easel").hidden=false;$("fmtBack").hidden=true;
  scalePreview();if(on)fitPhoneTitle();
  {const has=tab==="menu"&&!!card.innerHTML.trim()&&!document.body.classList.contains("staged");preview.tabIndex=has?0:-1;if(has)preview.removeAttribute("aria-hidden")}const zh=$("zoomHint");if(zh){const ok=tab==="menu"&&!!card.innerHTML.trim();zh.hidden=!ok;preview.style.cursor=ok?"":"auto";const tap=isTouch()?"tap":"click";zh.textContent=ok&&cardFaces().length&&swipeW()?`Swipe to turn, ${tap} to zoom`:`${tap[0].toUpperCase()+tap.slice(1)} the menu to read it full size`}
}
/* the phone text menu uses the Prep sheet's own recipe for a dish: same amounts for tonight's guests, same method */
function phoneRecipe(f,it){try{if(!f||!f._r2||!f._r2.dishes||!it)return null;const LB=planLabels(f),want=[it.orig,it.n,it.label].filter(Boolean).map(x=>String(x).toLowerCase());
  const altN=d=>Object.values(d.alt||{}).map(a=>String(a&&a.n||"").replace(/\s*\((vegetarian|alcohol[- ]free|vegetarian, alcohol[- ]free)\)\s*$/i,"").toLowerCase()).filter(Boolean);
  const d=f._r2.dishes.find(d=>want.includes(String(d.n).toLowerCase())||(LB[d.n]&&want.includes(String(LB[d.n]).toLowerCase())))||f._r2.dishes.find(d=>altN(d).some(n=>want.includes(n)));if(!d)return null;
  /* a film that always prints dry shows the written alcohol-free method on the phone too, when there is one */
  const only=dietMenuOnly(f);let x=dietMenuDish(f,d);if(x.blocked){if(!only)return null;x=d}
  const k=phoneGuests(f)/((f._r2&&f._r2.serves)||4);
  return {ing:dishIngList(x,k),steps:(x.ingredients||[]).filter(baseOf).map(i=>baseOf(i).step(baseG(i.q,i)*k,i)).concat((x.steps||[]).map(s=>degC(scaleStep(s.text,k))))}}catch(e){return null}}
const phoneGuests=f=>typeof current!=="undefined"&&current===f?PLAN.guests:USUAL;
let pvArgs=null;function phoneRefresh(){if(pvArgs&&pvArgs[0]===current&&fmtPhone.innerHTML)phoneView(...pvArgs)}
function phoneView(f,spec,menu){
  pvArgs=f?[f,spec,menu]:null;
  if(!f){fmtPhone.innerHTML="";applyPhone();return}
  setTimeout(()=>{try{kidsDryDom(fmtPhone,f)}catch(e){}},0);
  fmtPhone.innerHTML=spec.fmt==="lib"?fmtPhoneHTML(f,spec,menu):dietPhone(f,fmtPhoneHTML(f,spec,menu));fmtPhoneWire(fmtPhone);
  {const fb=fmtPhone.querySelector(".fp-flip");fb.textContent="Read the printed menu full size";fb.addEventListener("click",()=>openMenuZoom(fb))}
  applyPhone();
}
$("fmtBack").addEventListener("click",()=>{phoneOn=true;applyPhone()});
/* full size printed menu: the card itself moves into a pop-up you can zoom and pan, then goes back.
   Phones open one page at a time at fit to width: pinch to zoom, swipe or use the arrows to turn the page. */
function openMenuZoom(trigger){
  if(tab!=="menu"||!card.innerHTML.trim())return;
  const land=card.classList.contains("fmt"),cw=+card.dataset.w||(land?1123:794),ch=+card.dataset.h||(land?794:1123);
  const phone=narrow(),faces=phone?cardFaces():[],paged=faces.length>1;let fi=paged?Math.min(pvFace,faces.length-1):0;
  const fw=()=>paged?faces[fi].w:cw,fh=()=>paged?faces[fi].h:ch;
  const o=document.createElement("dialog");o.className="mzoom"+(paged?" mz-paged":"");o.setAttribute("aria-label","Printed menu, full size");
  o.innerHTML=`<div class="mz-bar"><button type="button" class="mz-out" aria-label="Zoom out">−</button><button type="button" class="mz-fit">Fit</button><button type="button" class="mz-in" aria-label="Zoom in">+</button></div><div class="mz-scroll"><div class="mz-sheet"></div></div>`+
    (paged?`<div class="mz-pages"><button type="button" class="mz-prev" aria-label="Previous page"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="mz-pg" aria-live="polite"></span><button type="button" class="mz-next" aria-label="Next page"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`:"")+
    (phone&&fw()>fh()*1.15?`<p class="mz-turn">Turn your phone sideways for a bigger view</p>`:"");
  const sc=o.querySelector(".mz-scroll"),sheet=o.querySelector(".mz-sheet");
  const home=card.nextSibling,keepT=card.style.transform;sheet.appendChild(card);card.style.transformOrigin="0 0";card.style.transition="none";card.style.opacity="";
  const fit=()=>phone?Math.min(2,((sc.clientWidth||innerWidth)-16)/fw()):Math.min(1.4,(innerWidth-80)/cw,(innerHeight-120)/ch);
  let k=1;
  const paint=()=>{const f=paged?faces[fi]:{x:0,y:0};card.style.transform=`translate(${-f.x*k}px,${-f.y*k}px) scale(${k})`;sheet.style.width=fw()*k+"px";sheet.style.height=fh()*k+"px"};
  /* zoom around a point on screen (the middle by default, or between two fingers) */
  const set=(v,px=sc.clientWidth/2,py=sc.clientHeight/2)=>{const cx=(sc.scrollLeft+px)/k,cy=(sc.scrollTop+py)/k;k=Math.max(Math.min(.25,fit()),Math.min(2.5,v));paint();sc.scrollLeft=cx*k-px;sc.scrollTop=cy*k-py};
  const toFit=()=>{k=fit();paint();sc.scrollLeft=0;sc.scrollTop=0};
  const go=i=>{if(!paged||i<0||i>=faces.length||i===fi)return;fi=i;pvFace=i;paint();sc.scrollLeft=0;sc.scrollTop=0;
    o.querySelector(".mz-pg").textContent=faces[0].part?(fi?"Right side":"Left side"):`Page ${fi+1} of ${faces.length}`;o.querySelector(".mz-prev").disabled=fi===0;o.querySelector(".mz-next").disabled=fi===faces.length-1};
  o.querySelector(".mz-in").addEventListener("click",()=>set(k*1.25));
  o.querySelector(".mz-out").addEventListener("click",()=>set(k/1.25));
  o.querySelector(".mz-fit").addEventListener("click",toFit);
  if(paged){o.querySelector(".mz-prev").addEventListener("click",()=>go(fi-1));o.querySelector(".mz-next").addEventListener("click",()=>go(fi+1))}
  o.addEventListener("keydown",e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;
    if(paged&&(e.key==="ArrowRight"||e.key==="ArrowLeft")&&sc.scrollWidth<=sc.clientWidth+2){e.preventDefault();go(fi+(e.key==="ArrowRight"?1:-1))}
    else if(e.key==="+"||e.key==="="){e.preventDefault();set(k*1.25)}else if(e.key==="-"){e.preventDefault();set(k/1.25)}});
  /* pinch to zoom, and a sideways swipe turns the page when the page fits the screen */
  {let pz=null,sw=null;const mid=(a,b)=>{const r=sc.getBoundingClientRect();return [(a.clientX+b.clientX)/2-r.left,(a.clientY+b.clientY)/2-r.top]},gap=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    sc.addEventListener("touchstart",e=>{if(e.touches.length===2){pz={d:gap(e.touches[0],e.touches[1])||1,k0:k};sw=null}else if(e.touches.length===1&&!pz){const t=e.touches[0];sw={x:t.clientX,y:t.clientY,fits:sc.scrollWidth<=sc.clientWidth+2}}},{passive:true});
    sc.addEventListener("touchmove",e=>{if(!pz||e.touches.length!==2)return;e.preventDefault();const [a,b]=e.touches;set(pz.k0*gap(a,b)/pz.d,...mid(a,b))},{passive:false});
    sc.addEventListener("touchend",e=>{if(pz){if(e.touches.length<2)pz=null;sw=null;return}
      if(sw&&sw.fits&&paged&&e.changedTouches.length){const t=e.changedTouches[0],dx=t.clientX-sw.x,dy=t.clientY-sw.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(fi+(dx<0?1:-1))}sw=null});
    /* trackpad pinch on a laptop */
    sc.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();const r=sc.getBoundingClientRect();set(k*Math.exp(-e.deltaY/200),e.clientX-r.left,e.clientY-r.top)},{passive:false})}
  o.addEventListener("click",e=>{if(e.target===o||e.target===sc)dismissModal(o)});
  mountModal(o,".mz-fit",trigger||preview,()=>{card.style.transform=keepT;card.style.transformOrigin="";card.style.transition="";preview.insertBefore(card,home&&home.parentNode===preview?home:preview.firstChild);scalePreview()});
  toFit();if(paged){const f0=fi;fi=-1;go(f0)}
  /* turning the phone: stay at fit if it was at fit */
  const onRz=()=>{if(!o.isConnected){removeEventListener("resize",onRz);return}const t=o.querySelector(".mz-turn");if(t)t.hidden=innerWidth>innerHeight;if(Math.abs(k-fitWas)<.01){toFit();fitWas=k}};let fitWas=k;
  addEventListener("resize",onRz);o.querySelector(".mz-fit").addEventListener("click",()=>{fitWas=k});
}
preview.setAttribute("role","button");preview.tabIndex=-1;preview.setAttribute("aria-label","Open the printed menu full size");
preview.addEventListener("click",e=>{if(tab==="menu"&&!e.target.closest("a,button,input,select,textarea"))openMenuZoom(preview)});
preview.addEventListener("keydown",e=>{if(tab!=="menu"||e.target!==preview)return;
  if(e.key==="Enter"||e.key===" "){e.preventDefault();openMenuZoom(preview)}
  else if(preview.classList.contains("pv-swipe")&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){e.preventDefault();pvGo(pvFace+(e.key==="ArrowRight"?1:-1))}});
/* swipe the page on a phone: the page follows your finger, a short flick turns it */
{let s=null,moved=false;
  preview.addEventListener("pointerdown",e=>{moved=false;if(!preview.classList.contains("pv-swipe")||e.button)return;s={x:e.clientX,y:e.clientY,id:e.pointerId,on:false}});
  preview.addEventListener("pointermove",e=>{if(!s||e.pointerId!==s.id)return;const dx=e.clientX-s.x,dy=e.clientY-s.y;
    if(!s.on){if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){s.on=moved=true;card.style.transition="none";try{preview.setPointerCapture(e.pointerId)}catch(_){}}else{if(Math.abs(dy)>10)s=null;return}}
    const n=cardFaces().length;pvDrag=(pvFace===0&&dx>0)||(pvFace===n-1&&dx<0)?dx*.3:dx;scalePreview()});
  const end=e=>{if(!s||e.pointerId!==s.id)return;const on=s.on,dx=pvDrag;s=null;pvDrag=0;card.style.transition="";if(!on)return;
    const step=dx<-50?1:dx>50?-1:0,fs=cardFaces();if(step&&fs.length&&!fs[0].row){scalePreview();pvGo(pvFace+step)}else{pvTurn();pvFace=Math.max(0,Math.min(fs.length-1,pvFace+step));scalePreview()}};
  preview.addEventListener("pointerup",end);preview.addEventListener("pointercancel",end);
  /* a swipe is not a tap: don't open the full size view after one */
  preview.addEventListener("click",e=>{if(moved){moved=false;e.stopImmediatePropagation();e.preventDefault()}},true)}
/* library menus: the same big-type phone menu, coloured and set from the printed card it sits under */
function libPhonePal(root){
  const rgb=c=>{const m=/rgba?\(([^)]+)\)/.exec(c||"");if(!m)return null;const v=m[1].split(",").map(Number);return v.length>3&&v[3]<.9?null:v.slice(0,3)};
  const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
  const con=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
  const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  const hex=a=>"#"+a.map(v=>v.toString(16).padStart(2,"0")).join("");
  const fam=s=>(s||"").split(",")[0].trim();
  let paper=null,area=0,big=null,bigSize=0;const ink={},font={};
  root.querySelectorAll("*").forEach(e=>{
    const cs=getComputedStyle(e);if(cs.display==="none"||cs.visibility==="hidden")return;const r=e.getBoundingClientRect();
    const bg=rgb(cs.backgroundColor);if(bg&&r.width*r.height>area){area=r.width*r.height;paper=bg}
    const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(" ");if(!own||r.width<1)return;
    const c=rgb(cs.color),fs=parseFloat(cs.fontSize)||0,k=c&&c.join(",");
    if(c){ink[k]=(ink[k]||0)+own.length;font[cs.fontFamily]=(font[cs.fontFamily]||0)+own.length}
    if(c&&fs>bigSize&&own.length>2){bigSize=fs;big={c,f:cs.fontFamily}}
  });
  const top1=o=>Object.keys(o).sort((a,b)=>o[b]-o[a])[0];
  let P=paper||[244,236,220],I=(top1(ink)||"34,26,20").split(",").map(Number),A=big?big.c:I;
  if(lum(P)<.35){P=mix([246,239,226],A,.06);I=[34,26,20]}
  for(let i=0;i<10&&con(I,P)<7;i++)I=mix(I,lum(P)>.4?[0,0,0]:[255,255,255],.25);
  if(con(I,P)<4.5)I=[34,26,20];
  if(con(A,P)<3)A=I;
  let T=A;for(let i=0;i<12&&lum(T)>.06;i++)T=mix(T,[0,0,0],.25);
  const q=v=>String(v).replace(/"/g,"'");
  const fancy=/marker|script|hand|caveat|kalam|pacifico|lobster|dafoe|grace|apple|satisfy|sacramento|allura|yellowtail|courgette|damion|fraktur|pirata|unifraktur|gotisch|blackletter|texturina|germania|rye|smokum|ewert|monoton|bungee shade/i;
  let body=q(top1(font)||"var(--f-body)");if(fancy.test(body))body="var(--f-body)";
  const disp=big?q(big.f):body;
  const wide=f=>{try{const x=document.createElement("canvas").getContext("2d");x.font="20px "+f;return x.measureText("Spider Rider corn dogs").width/(20*22)>.6}catch(e){return false}};
  const name=wide(disp)?body:disp,soft=mix(I,P,.38);
  return {top:hex(T),topInk:hex(P),paper:hex(P),ink:hex(I),soft:hex(con(soft,P)<4.5?mix(I,P,.22):soft),accent:hex(con(A,P)<3?I:A),tab:hex(mix(P,A,.15)),
    disp,name,body,price:body,title:disp,note:body};
}
const LIB_COURSE={s:"Starters",m:"Mains",w:"Sweets",d:"Drinks"};
/* review 27: the phone lists each course in the order the printed card does (dearest first, house lines last) and under the
   card's own heading (Snacks, Quick Plays, To start), so a guest moving between the two finds the same menu.
   Read off the rendered card's text: a dish sorts by where its name first prints; a course takes the nearest short line
   above its first dish. A dish the card doesn't print (a phone-only extra) keeps its place after the card's dishes. */
function libCardOrder(root,pm){
  const out={courses:{}};if(!root)return out;
  const tx=[],w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let nd;
  while(nd=w.nextNode()){const t=nd.textContent.replace(/\s+/g," ").trim();if(t)tx.push(t)}
  const low=tx.map(t=>t.toLowerCase());
  /* a name can print twice (an order slip up top, then the menu): the menu copy is the one with its price just after it */
  const priced=i=>low.slice(i+1,i+3).some(t=>/^[$£€¥]?\s?\d{1,4}([.,]\d{1,2})?(\s?[a-z]{1,4})?$/.test(t));
  const at=lab=>{const l=String(lab||"").toLowerCase().trim();if(!l)return -1;
    let hits=low.map((t,i)=>t===l?i:-1).filter(i=>i>=0);if(!hits.length)hits=low.map((t,i)=>t.length<l.length+12&&t.includes(l)?i:-1).filter(i=>i>=0);
    return hits.length?(hits.find(priced)??hits[0]):-1};
  const names=new Set();for(const c in pm)for(const it of pm[c])names.add(String(it.label).toLowerCase());
  /* a line under the heading in small type ("to begin", "see Snack Cay") starts lower case: the heading sits above it.
     Edge marks (✦ To begin ✦) drop; "First Course · To Begin" keeps its first part so the tab stays short */
  const cap=s=>s.replace(/^\S/,x=>x.toUpperCase());
  const head=i=>{let sub="";for(let j=i-1,seen=0;j>=0&&seen<8;j--,seen++){const l=low[j];
      if(names.has(l))break;
      if(/\d/.test(tx[j]))continue;
      let t=tx[j].replace(/^[^\p{L}"“]+|[^\p{L}.!?:"”)]+$/gu,"").split(/\s+[·•|]\s+/)[0].trim();
      if(t.length<3)continue;
      const n=t.split(" ").length;if(n>5||/[.!?:"“”]$/.test(t)||/^["“]/.test(t))break;
      if(t===t.toUpperCase())t=t.toLowerCase().replace(/(^|\s)\S/g,s=>s.toUpperCase());
      if(/^\p{Ll}/u.test(t)){if(!sub)sub=t;continue}
      return t}
    return sub?cap(sub):""};
  for(const c in pm){const pos=pm[c].map((it,k)=>[at(it.label),k,it]);
    pos.sort((a,b)=>(a[0]<0)-(b[0]<0)||(a[0]<0?a[1]-b[1]:a[0]-b[0]||a[1]-b[1]));
    pm[c]=pos.map(p=>p[2]);const first=pos.find(p=>p[0]>=0);if(first){const h=head(first[0]);if(h)out.courses[c]=h}}
  /* two courses never share a tab name: keep the plain word for the later one */
  const used=new Set();for(const c of ["s","m","w","d"]){const h=out.courses[c];if(!h)continue;if(used.has(h.toLowerCase()))delete out.courses[c];else used.add(h.toLowerCase())}
  return out}
function libPhoneView(f,menu,L,root){
  const fl=L.flavour||{},pm={};let any=false;
  for(const c of ["s","m","w","d"]){pm[c]=(menu[c]||[]).filter(it=>it&&it.n).map(it=>({label:it.n,orig:it.orig,extra:!!it.extra,desc:it.d||it.desc||"",film:it.note||"",how:it.house?"A house standard, not part of tonight's cook.":degC(it.how||"Not on tonight's cook.")}));if(pm[c].length)any=true}
  if(!any){phoneView(null);return}
  let co={courses:{}};try{co=libCardOrder(root,pm)}catch(e){}
  {const ea=$("easel"),was=ea.hidden;ea.hidden=false;try{FMT_PHONE.lib=libPhonePal(root)}finally{ea.hidden=was}}
  phoneView(f,{fmt:"lib",brand:fl.venue||"",tag:ESC(current&&current.tag||f.T),phoneTitle:f.title,courses:co.courses},pm);
}
function fitPhoneTitle(){
  const t=fmtPhone.querySelector(".fp-lib .fp-title");if(!t||!t.offsetWidth)return;
  let z=34;t.style.fontSize=z+"px";
  while(z>18&&(t.scrollWidth>t.clientWidth+1||t.offsetHeight>z*3.3)){z-=2;t.style.fontSize=z+"px"}
}

let renderId=0;
/* ---------- plan the night: tick dishes, set guests, scaled shopping and real times (data/recipes2) ---------- */
const PLAN={guests:4,off:{},on:{}};
let USUAL=(()=>{try{const g=+localStorage.getItem("mns-guests");return g>=1&&g<=60?g:4}catch(e){return 4}})();
function planLoad(f){PLAN.guests=USUAL;PLAN.off={};PLAN.on={};try{const s=JSON.parse(localStorage.getItem("mns-plan-"+f.id)||"null");if(s){PLAN.guests=Math.min(60,Math.max(1,+s.g||USUAL));PLAN.off=s.off||{};PLAN.on=s.on||{}}}catch(e){}}
function planSave(f){try{localStorage.setItem("mns-plan-"+f.id,JSON.stringify({g:PLAN.guests,off:PLAN.off,on:PLAN.on}))}catch(e){}}
/* diet: vegetarian and no alcohol, kept for every film. A dish that doesn't fit swaps to its written alternative
   (data/recipes2 dish.alt.veg, .af, .veg_af); one with no alternative is left off unless the cook ticks it back */
const DIET=(()=>{try{const d=JSON.parse(localStorage.getItem("mns-diet")||"{}");return {veg:!!d.veg,af:!!d.af}}catch(e){return {veg:false,af:false}}})();
function dietSave(){try{localStorage.setItem("mns-diet",JSON.stringify(DIET))}catch(e){}}
/* kids mode always plans the alcohol-free versions */
const dietAF=()=>DIET.af||(typeof kidsMode!=="undefined"&&kidsMode);
const dietBooze=x=>x.af===false||(x.ingredients||[]).some(i=>i.aisle==="Bottle shop");
const dietMeat=x=>x.veg===false;
function dietDish(d,af=dietAF()){
  const alt=d.alt||{};let x=d,tag="";
  if(DIET.veg&&dietMeat(d)){if(af&&alt.veg_af){return Object.assign({},d,alt.veg_af,{orig:d.n,tag:"veg",af:true})}if(alt.veg){x=Object.assign({},d,alt.veg,{orig:d.n,af:alt.veg.af});tag="veg"}else return Object.assign({},d,{orig:d.n,blocked:"meat"})}
  if(af&&dietBooze(x)){if(!tag&&alt.af){x=Object.assign({},d,alt.af,{orig:d.n,af:true});tag="af"}else return Object.assign({},x,{orig:d.n,blocked:"alcohol",tag})}
  return tag?Object.assign({},x,{tag}):x;
}
/* the printed menu follows the diet too: a swapped dish takes its own name, menu line, method and shopping, and film copy that names meat or drink is reworded */
function dietKey(){const v=DIET.veg,a=dietAF();return v&&a?"veg_af":v?"veg":a?"af":""}
/* family and Christmas films always print dry: their menus take the written alcohol-free versions (name, menu line, film copy) before the word swaps,
   but only on the menus, so the plan, prep sheet and shopping keep the cook's own diet settings and no dish is left off */
const DRY_THEMES=["kids","fairytale","xmas","wizard"];
const dietMenuOnly=f=>!dietKey()&&!!f&&DRY_THEMES.includes(f.theme);
/* 13 Nov: with Vegetarian on, a dry film's menus read vegetarian and alcohol-free (Bad Santa printed the bourbon highball) */
const dietKeyF=f=>{const k=dietKey(),dry=!!f&&DRY_THEMES.includes(f.theme);return k==="veg"&&dry?"veg_af":k||(dry?"af":"")};
/* the dish a menu shows: a dry film takes the written alcohol-free version whatever the diet. One with none keeps what the cook's settings give (the dry words still swap) */
function dietMenuDish(f,d){const dry=!!f&&DRY_THEMES.includes(f.theme);let x=dietDish(d,dry||dietAF());if(x.blocked==="alcohol"&&dry&&!dietAF())x=dietDish(d,false);return x}
function dietWhich(d,x){const alt=d.alt||{};if(!x.tag)return "";if(x.tag==="af")return "af";return alt.veg_af&&x.n===alt.veg_af.n?"veg_af":"veg"}
function dietShop(x){return (x.ingredients||[]).map(i=>`${i.u?planQty(i.q,i.u):planQty(i.q,"")} ${i.item}@${i.aisle||"Other"}`.trim())}
function dietItem(f,it){
  const r2=f&&f._r2&&f._r2.dishes;if(!r2||!it||!dietKeyF(f))return it;
  const d=r2.find(z=>z.n===(it.k||it.n));if(!d)return it;
  const only=dietMenuOnly(f),x=dietMenuDish(f,d);if(x.blocked)return only?it:Object.assign({},it,{blocked:x.blocked,orig:d.n});
  if(!x.tag)return it;
  const v=dietWhich(d,x),N=(f._diet&&f._diet.notes&&f._diet.notes[d.n])||{};
  const note=N[v]||(v==="veg_af"?N.veg:"")||"";
  const nm=String(x.n).replace(/\s*\((vegetarian|alcohol[- ]free|vegetarian, alcohol[- ]free)\)\s*$/i,"");
  return Object.assign({},it,it.label!=null&&it.label===d.n?{label:dietText(f,d.n)!==d.n?dietText(f,d.n):nm.length<=d.n.length+2?nm:d.n}:{},{n:String(x.n).replace(/\s*\((vegetarian|alcohol[- ]free|vegetarian, alcohol[- ]free)\)\s*$/i,""),note:note||(only?it.note:""),orig:d.n},only?{}:{how:(x.steps||[]).map(t=>t.text).join(" "),shop:dietShop(x)},{diet:v});
}
function dietMenu(f,menu){
  if(!menu||!f||!dietKeyF(f)||!f._r2)return menu;
  const m=Object.assign({},menu);for(const c of ["s","m","w","d"])if(Array.isArray(menu[c]))m[c]=menu[c].map(it=>dietItem(f,it));
  if(Array.isArray(menu.all))m.all=menu.all.map(it=>dietItem(f,it));
  if(Array.isArray(menu.shopping))m.shopping=[...m.s,...m.m,...m.w,...m.d].flatMap(it=>Array.isArray(it.shop)?it.shop:[]);
  m.diet=dietKey();return m;
}
/* film copy reworded for the diet: data/diet/<film>.json "text" holds [from, to] pairs per diet */
function dietText(f,str){
  const k=dietKeyF(f);if(!k||typeof str!=="string"||!f||!f._diet||!f._diet.text)return str;
  const T=f._diet.text,lists=k==="veg_af"?[T.veg_af,T.veg,T.af]:[T[k]];let out=str;
  const pairs=[];for(const L of lists)for(const [a,b] of (L||[]))if(a)pairs.push([a,b]);
  pairs.forEach(([a],i)=>{if(out.includes(a))out=out.split(a).join("\u0001"+i+"\u0002")});
  return out.replace(/\u0001(\d+)\u0002/g,(m,i)=>pairs[+i][1]);
}
/* review 15: on a vegetarian night the showtime cue named the meat dish the cook is not making ("Serve the lobster when Madison eats it whole").
   The thing served is named by its course instead; the film's moment after "when" keeps its words */
const CUE_MEAT=/\b(beef|steaks?|pork|ham|bacon|chicken|turkey|lamb|veal|sausages?|meatballs?|meatball subs?|meat|brisket|ribs?|wings|burgers?|cheeseburgers?|hot ?dogs?|chilli dogs?|franks|duck|goose|fish|salmon|tuna|prawns?|shrimps?|lobsters?|crabs?|oysters?|clams?|calamari|prawn cocktail|shrimp cocktail|crab cakes?|fish and chips|fish fingers|jerky)\b/i;
function dietCue(f,str){str=dietText(f,str);if(typeof str!=="string"||!DIET.veg||!f)return str;
  return str.replace(/^(\s*(?:Serve|Bring out|Hand round|Plate up|Put out) )(the |some |a |your )?([^.,;]*?)(?=\s+(?:when|as|while|during|at|right|whenever|once|before|after|just)\b)/i,(m,v,art,thing)=>{
    if(!CUE_MEAT.test(thing)||/\b(snacks|mains|starters|dessert|sweets|drinks|food|feast|dinner|lunch|supper)\b/i.test(thing))return m;
    const w=thing.match(CUE_MEAT)[0].toLowerCase(),lists=[["snacks",f.S],["mains",f.M],["dessert",f.W],["drinks",f.K]];
    let c="";for(const [lab,L] of lists)if((L||[]).some(r=>new RegExp("\\b"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","i").test(String(r&&r[0]||""))))c=c||lab;
    return v+"the "+(c||(/pies?$/.test(w)?"pies":"mains"))})}
/* the hand-built menus are finished artwork with the words baked in, so the same swaps run over the page itself */
function dietHTML(f,html){
  const k=dietKeyF(f);if(!k||typeof html!=="string"||!f||!f._diet||!f._diet.text)return html;
  const T=f._diet.text,lists=k==="veg_af"?[T.veg_af,T.veg,T.af]:[T[k]];let out=html;
  const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  /* each swap lands once: matches become placeholders first, so wording that contains the old wording is never swapped again */
  const pairs=[],miss=[];for(const L of lists)for(const [a,b] of (L||[]))if(a)pairs.push([a,b]);
  pairs.forEach(([a,b],i)=>{const tok="\u0001"+i+"\u0002";let hit=false;
    for(const [x] of new Map([[a],[esc(a)],[esc(a).replace(/'/g,"&#39;")],[esc(a).replace(/'/g,"&#x27;")],[esc(a).replace(/"/g,"&quot;")]].map(v=>[v[0],1])))if(out.includes(x)){out=out.split(x).join(tok);hit=true}
    if(!hit)miss.push(i)});
  /* words written with character codes in the artwork: swap them in the page's own text */
  if(miss.length&&typeof document!=="undefined"&&document.createElement){try{const t=document.createElement("template");t.innerHTML=out;const w=document.createTreeWalker(t.content,NodeFilter.SHOW_TEXT);let n,ch=false;
    while(n=w.nextNode()){let v=n.nodeValue;for(const i of miss){const a=pairs[i][0];if(v.includes(a))v=v.split(a).join("\u0001"+i+"\u0002")}if(v!==n.nodeValue){n.nodeValue=v;ch=true}}if(ch)out=t.innerHTML}catch(e){}}
  return out.replace(/\u0001(\d+)\u0002/g,(m,i)=>{const b=pairs[+i][1];return esc(b)});
}
/* review 14: the phone text menu on a hand-built film splits each printed line into a name and a note ("Roast pork, whole-pig style" / "Carried in on a board at the feast"),
   so the card's whole-line swaps never matched it and Vegetarian left the meat names over a pumpkin recipe. The phone runs the same list, also sentence by sentence */
function dietPhone(f,html){if(!dietKeyF(f)||!f||!f._diet||!f._diet.text)return html;const T=f._diet.text,x={};
  for(const k of Object.keys(T)){const out=[];for(const [a,b] of (T[k]||[])){if(!a)continue;out.push([a,b]);if(/[’‘]/.test(a))out.push([a.replace(/[’‘]/g,"'"),b]);const sa=String(a).split(/(?<=[.!?])\s+/),sb=String(b).split(/(?<=[.!?])\s+/);
    if(sa.length>1&&sa.length===sb.length)sa.forEach((t,i)=>{const u=t.replace(/[.!?]$/,""),v=sb[i].replace(/[.!?]$/,"");if(u!==v&&u.length>3)out.push([u,v])})}
    x[k]=out.sort((p,q)=>q[0].length-p[0].length)}
  return dietHTML(Object.assign(Object.create(f),{_diet:Object.assign({},f._diet,{text:x})}),html)}
function dietDeep(f,o){if(typeof o==="string")return dietText(f,o);if(Array.isArray(o))return o.map(x=>dietDeep(f,x));if(o&&typeof o==="object"){const r={};for(const k in o)r[k]=k==="k"?o[k]:dietDeep(f,o[k]);return r}return o}
const _dietSpecs=new WeakMap();
function dietSpec(f,spec){if(!spec||!dietKeyF(f)||!f._diet)return spec;let c=_dietSpecs.get(spec);if(!c){c={};_dietSpecs.set(spec,c)}const k=dietKeyF(f);return c[k]||(c[k]=dietDeep(f,spec))}
function dietStamp(){const b=$("dietNote");if(!b)return;const t=dietLabel();b.textContent=t?t+" menu":"";b.hidden=!t}
function dietLabel(){const k=dietKey();return k==="veg_af"?"Vegetarian · Alcohol-free":k==="veg"?"Vegetarian":k==="af"?"Alcohol-free":""}
/* lazy night: plan only the dishes left on the cut-down menu */
/* cook five: a tested recipe for a dish that isn't one of tonight's five (a card extra the sweep gave a recipe) is offered unticked */
const planCooked=f=>{const src=(typeof EDITIONS!=="undefined"&&EDITIONS[f.id]&&EDITIONS[f.id].menu)||(typeof RECIPE_MENUS!=="undefined"&&RECIPE_MENUS[f.id])||null;
  return src?new Set(["s","m","w","d"].flatMap(k=>(src[k]||[]).map(it=>String(it.n||"").toLowerCase()))):null};
/* the five a printed menu cooks when its old recipe names no longer match the recipe files (hand-built menus: Ghostbusters, Pulp Fiction):
   from the printed menu, two starters, a main, a sweet and a drink that have a recipe, topped up to five from the rest it prints */
function planFive(f,r2){const have=new Set(r2.map(d=>String(d.orig||d.n).toLowerCase()));let byC=null;
  try{const sp=typeof fmtSpec==="function"&&fmtSpec(f);if(sp){const m=fmtMenu(f,sp);byC={};for(const c of ["s","m","w","d"])byC[c]=(m[c]||[]).map(it=>String(it.orig||it.n||"").toLowerCase())}}catch(e){}
  if(!byC){byC={s:[],m:[],w:[],d:[]};for(const d of r2)(byC[d.course]||byC.s).push(String(d.orig||d.n).toLowerCase())}
  /* within a course the film card's own order leads (Stay Puft s'mores before the marshmallow skewers) */
  /* a dish the showtime cue names comes first, so the cue always has its dish (Ghostbusters: "Serve the takeaway boxes") */
  const cue=String((typeof EDITIONS!=="undefined"&&EDITIONS[f.id]&&EDITIONS[f.id].cue)||f.P||"").toLowerCase(),
    named=x=>x.split(/[^a-z']+/).some(w=>w.length>=5&&!/^(serve|with|their|after|first)$/.test(w)&&new RegExp("\\b"+w+"\\b").test(cue));
  const card=[...f.S||[],...f.M||[],...f.W||[],...f.K||[]].map(r=>String(r[0]).toLowerCase()),rank=x=>(named(x)?-1000:0)+(card.indexOf(x)<0?999:card.indexOf(x));
  for(const c in byC)byC[c]=byC[c].map((x,i)=>[x,i]).sort((a,b)=>rank(a[0])-rank(b[0])||a[1]-b[1]).map(z=>z[0]);
  const out=new Set();for(const [c,n] of [["s",2],["m",1],["w",1],["d",1]]){let k=0;for(const x of byC[c])if(k<n&&have.has(x)&&!out.has(x)){out.add(x);k++}}
  for(const c of ["s","m","w","d"])for(const x of byC[c])if(out.size<5&&have.has(x))out.add(x);
  return out.size?out:null}
/* review 17, Josh (6 Nov): "show all dishes, cook 5" on every film. A menu whose cooked list names six or seven dishes (Paddington 2, Hot Fuzz)
   cooks the five planFive picks from those; the others stay on the list unticked */
function planTrim(f,r2,ck0){const inn=r2.filter(d=>ck0.has(String(d.orig||d.n).toLowerCase()));if(inn.length<=5)return ck0;return planFive(f,inn)||ck0}
/* a dry card (kids, fairytale, Christmas and wizard films) cooks and shops the same alcohol-free versions it prints */
const planDish=(f,d)=>dietDish(d,dietAF()||DRY_THEMES.includes(f&&f.theme));
const planAll=f=>{const ck0=planCooked(f),r2=((f._r2&&f._r2.dishes)||[]).map(d=>planDish(f,d)),
    /* every cooked dish found by name: those are tonight's five. Otherwise the card picks them (planFive), so extras start unticked on hand-built menus too */
    ok=ck0&&ck0.size&&r2.filter(d=>ck0.has(String(d.orig||d.n).toLowerCase())).length>=Math.min(5,ck0.size),ck=ok?planTrim(f,r2,ck0):r2.length>5?planFive(f,r2):null,
    hit=d=>ck.has(String(d.orig||d.n).toLowerCase()),sp=!!ck,all=sp?r2.map(d=>hit(d)?d:Object.assign({},d,{spare:true})):r2,m=f.menu||(typeof current!=="undefined"&&current===f?current.menu:null);
  let out=all;if(m&&m.lazy){const keep=new Set([...m.s,...m.m,...m.w,...m.d].map(it=>it.orig||it.n)),few=all.filter(d=>keep.has(d.orig||d.n));if(few.length)out=few}
  return out.concat(planExtras(f).map(d=>planDish(f,d))).concat(snackDishes(f).map(d=>planDish(f,d)))};
/* the film's other printed dishes: offered in the planner unticked, so every dish on the printed menu can go on the shopping list.
   Method and shopping come from the menu itself (no quantities), and the tonight's-five recipes stay the default cook. */
/* what the printed card actually shows for a film, so the planner lists exactly those dishes, under the card's own names */
function planCard(f){try{const sp=typeof fmtSpec==="function"&&fmtSpec(f),m=(typeof current!=="undefined"&&current===f&&current.menu)?current.menu:(sp?fmtMenu(f,sp):makeMenu(f));
  const full=f._lib?fullMenu(f,m,f._lib.fmt):m;return ["s","m","w","d"].flatMap(k=>(full[k]||[]).map(it=>Object.assign({},it,{course:k})))}catch(e){return []}}
function planExtras(f){if(!f||!f._full)return [];const have=new Set(((f._r2&&f._r2.dishes)||[]).map(d=>String(d.n).toLowerCase())),out=[];
  /* only the film's other dishes the card prints (a layout shows as many as fit) */
  for(const it of planCard(f)){if(!it.extra)continue;const key=String(it.n||"").toLowerCase();if(!it.n||have.has(key))continue;have.add(key);
    const src=[["S","s"],["M","m"],["W","w"],["K","d"]].map(([K])=>(f[K]||[]).find(r=>String(r[0]).toLowerCase()===key)).find(Boolean);const d=src?toItem(src):it;if(!d.how)continue;
    out.push({n:it.n,course:it.course,extra:true,prep_min:0,cook_min:0,ingredients:(d.shop||[]).map(x=>{const [item,aisle]=String(x).split("@");return {q:null,u:"",item,aisle:aisle||"Pantry"}}),
      steps:String(d.how).split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map(t=>t.trim()).filter(Boolean).map(text=>({text}))})}
  return out}
/* the card's own name for a dish (hand-built menus print "Antipasto, wedding style" for the "Wedding antipasto" recipe) */
function planLabels(f){const L={};for(const it of planCard(f)){if(it.n&&it.label&&it.label!==it.n)L[it.n]=it.label}return L}
const planHouse=f=>planCard(f).filter(it=>it.house);
const planOn=x=>x.blocked||x.extra||x.spare?!!PLAN.on[x.orig||x.n]:!PLAN.off[x.orig||x.n];
const planPicked=f=>planAll(f).filter(planOn);
/* review 18: a picked make-ahead dish that can no longer be done before the locked-in showtime is off the plan: unticked, off the shopping list
   and the method, with a ready-made line on the list instead. The pick itself is kept, so moving the night a week brings the dish back.
   Returns a Map of the dish's key to the name the card prints. */
let planLateMemo={k:"",v:new Map()};
function planLate(f){const none=new Map();try{if(!f||typeof week==="undefined"||!week||(week.id!==f.id&&week.double!==f.id)||typeof calPlan!=="function")return none;
  const show=weekShow(),now=new Date();if(!(show>now))return none;
  const key=[f.id,show.getTime(),Math.floor(now.getTime()/6e4),PLAN.guests,JSON.stringify(PLAN.off),JSON.stringify(PLAN.on),DIET.veg?1:0,dietAF()?1:0].join("|");if(planLateMemo.k===key)return planLateMemo.v;
  const sv=(f._r2&&f._r2.serves)||4,LB=planLabels(f),ds=planPicked(f).filter(x=>!x.extra);
  const cd=ds.map(x=>{const T=dishTimes(x,x.snack?PLAN.guests/4:PLAN.guests/sv);return {x,n:LB[x.orig||x.n]&&!x.tag?LB[x.orig||x.n]:x.n,active:T.active,wait:T.wait,...calNight(x,T),words:T.wait>=CAL_LONG?waitWords(x):""}});
  const p=calPlan(show,cd,now),v=new Map();if(p.late){for(const d of p.late.dishes)v.set(d.x.orig||d.x.n,d.n);v.plan=p}
  planLateMemo={k:key,v};return v}catch(e){return none}}
const planDishes=f=>{const L=planLate(f);return planPicked(f).filter(d=>!L.has(d.orig||d.n))};
const FRAC=[[0,""],[0.25,"1/4"],[1/3,"1/3"],[0.5,"1/2"],[2/3,"2/3"],[0.75,"3/4"],[1,""]];
function fracText(q){const w=Math.floor(q),r=q-w;let best=FRAC[0];for(const x of FRAC)if(Math.abs(x[0]-r)<Math.abs(best[0]-r))best=x;const W=best[0]===1?w+1:w;return (W?String(W):"")+(best[1]?(W?" ":"")+best[1]:"")||"1/4"}
function planQty(q,u){
  /* review 24: bunches and pinches keep their word ("1 bunch tarragon", never "1 tarragon"), bought and used whole; a capital L is litres */
  if(u==="bunch"||u==="pinch"){const n=Math.max(1,Math.ceil(q-0.05));return n+" "+u+(n>1?"es":"")}
  if(u==="L")u="l";
  if(u==="g"&&q>=1000){q/=1000;u="kg"}else if(u==="ml"&&q>=1000){q/=1000;u="l"}else if(u==="kg"&&q<1){q*=1000;u="g"}else if(u==="l"&&q<1){q*=1000;u="ml"}
  if(u==="g"||u==="ml")return (q>=50?Math.round(q/5)*5:Math.max(1,Math.round(q)))+u;
  if(u==="kg"||u==="l")return (q>=1?Math.round(q*10)/10:Math.round(q*100)/100)+(u==="l"?" L":u);
  /* spoons that pile up turn into the next measure: 9 tsp is 3 tbsp, 20 tbsp is 1 1/4 cups */
  if(u==="tsp"&&q>6){q/=3;u="tbsp"}
  if(u==="tbsp"&&q>8){q/=16;u="cup"}
  if(u==="cup"){const t=fracText(q);return t+(/^(1|\d\/\d)$/.test(t)?" cup":" cups")}
  /* spoons never read in thirds: up to the next quarter under one, the next half above (review 12) */
  if(u==="tsp"||u==="tbsp"){q=q<1?Math.ceil(q*4-0.01)/4:Math.ceil(q*2-0.01)/2;return fracText(q)+" "+u}
  return String(q<1?fracText(q):Math.ceil(q-0.01));
}
const UNITB={g:["g",1],kg:["g",1000],ml:["ml",1],l:["ml",1000],L:["ml",1000]};
const PL_CONT=/^(bag|can|tin|bottle|jar|packet|pack|bunch|bunche|clove|rasher|slice|sprig|stick|sheet|block|head|stalk|punnet|loaf|loave|fillet|piece|wedge|strip|scoop|shot|glass|glasse|cup|leaf|leave|tray|box|boxe|carton|tub|round|ball|sachet|pinch|pinche|handful|drop|dash|dashe|tube|splash|splashe|knob|dollop|cube|wheel|twist|square|ear|stem|rib|cob|sprinkle|log|disc|tablet|envelope|tray|container|pot|roll)s?$/i;
const PL_MASS=/(thyme|rosemary|mint|parsley|basil|coriander|dill|chives|oregano|sage|tarragon|paprika|cinnamon|nutmeg|cumin|turmeric|allspice|colouring|coloring|paste|sauce|syrup|honey|vinegar|stock|yoghurt|yogurt|mayonnaise|mustard|ketchup|jam|chocolate|cocoa|spinach|garlic|ginger|salt|ice cream|custard|gravy|cordial|lemonade|chilli flakes|seasoning|spice|zest|ice)$/i;
function planPlural(item,q){if(!(q>1))return item;if(/^cob loa(f|ves)\b/i.test(item))return String(item).replace(/^cob loa(f|ves)/i,"cob loaves");let [head,...rest]=String(item).split(",");const par=head.indexOf(" (");if(par>0){rest=[head.slice(par)+(rest.length?","+rest.join(","):"")];head=head.slice(0,par);return planPlural(head,q)+rest[0]}const w=head.trim().split(" ");
  const pl=x=>/(s|ice|milk|water|juice|sugar|flour|rice|bread|butter|cream|cheese|fish|corn|meat|oil|salt|pepper|mince|beef|pork|lamb|chicken|bacon|ham|tea|coffee|soda)$/i.test(x)?x:/(ch|sh|x)$/i.test(x)?x+"es":/(tomato|potato|mango|avocado)$/i.test(x)?x+"es":/[^aeiou]y$/i.test(x)?x.slice(0,-1)+"ies":/f$/i.test(x)&&/loaf|leaf|half/i.test(x)?x.slice(0,-1)+"ves":x+"s";
  /* "rib eye", "ear of corn" style names are the food, not a container: "rib" only counts when it is "rib of" or "ribs" */
  const ci=w.slice(0,3).findIndex((x,i)=>planCont(w,i));
  /* the head noun takes the plural, before any "in", "with" or "from": "3 chipotles in adobo", not "3 chipotle in adobos" */
  const pi=w.findIndex((x,i)=>i>0&&/^(in|with|from|on)$/i.test(x));
  if(ci>=0){if(!/s$/i.test(w[ci]))w[ci]=pl(w[ci]);if(w.length>ci+1&&w[ci+1]!=="of")w[ci]+=" of"}else if(pi>0){if(!PL_MASS.test(w[pi-1]))w[pi-1]=pl(w[pi-1])}else if(!PL_MASS.test(head.trim()))w[w.length-1]=pl(w[w.length-1]);return [w.join(" "),...rest].join(",")}
/* "rib eye", "round steak", "ear of corn": rib, round, square, disc, ear, head, wheel and log are the food's own name, not a container,
   unless "of" follows or the word ends the name ("4 pastry rounds"). So "9 thin beef round steaks", never "beef rounds of steaks" */
const planCont=(w,i)=>PL_CONT.test(w[i])&&!(i>0&&/^fillets?$/i.test(w[i]))&&!(/^(rib|ear|head|wheel|log|round|square|disc)$/i.test(w[i])&&w[i+1]&&w[i+1]!=="of"&&w[i+1]!=="celery")&&!(/^cobs?$/i.test(w[i])&&/^loa(f|ves)$/i.test(w[i+1]||""));
/* one of something stays singular even when the recipe wrote it plural: "1 clove garlic", not "1 cloves garlic" */
function planOne(item){let [head,...rest]=String(item).split(",");const par=head.indexOf(" (");let tail="";if(par>0){tail=head.slice(par);head=head.slice(0,par)}
  /* only the first container word counts: "1 handful mint leaves" and "1 packet banana leaves" keep their leaves */
  const w=head.split(" ");const c0=w.slice(0,3).findIndex((x,j)=>planCont(w,j)),i=c0>=0&&/s$/i.test(w[c0])?c0:-1,hasCont=c0>=0;
  if(i>=0)w[i]=planSing(w[i]);
  else if(hasCont){}
  /* "1 lemons", "1 brown onions": a plain plural noun at the end goes singular too */
  else{const L=w.length-1;if(/[a-z]{3,}s$/i.test(w[L])&&!/(ss|us|is|ous|chips|peas|oats|greens|noodles|grits|molasses|leaves|lollies|sprinkles|crumbs|breadcrumbs|flakes|seeds)$/i.test(w[L])&&!PL_MASS.test(head))w[L]=planSing(w[L]).replace(/^(loave)$/i,"loaf")}
  return [w.join(" ")+tail,...rest].join(",")}
/* one shopping line per ingredient: the same item from two dishes is added up, and a mix of units shows as "100g + 2 tbsp" */
/* irregular ones first (review 12): chillies are a chilli, leaves a leaf, cookies a cookie, never "chilly", "leave" or "cooky" */
const PL_IRREG={chillies:"chilli",chilies:"chili",leaves:"leaf",loaves:"loaf",halves:"half",knives:"knife",shelves:"shelf",calves:"calf",cookies:"cookie",brownies:"brownie",smoothies:"smoothie",pies:"pie",lollies:"lolly",zombies:"zombie",veggies:"veggie",birdies:"birdie",hoodies:"hoodie",ties:"tie",oreos:"oreo",goodies:"goodie",sweeties:"sweetie",movies:"movie",cheeses:"cheese",pieces:"piece",slices:"slice",sauces:"sauce",juices:"juice",spices:"spice",prices:"price",dices:"dice",courses:"course",houses:"house",purees:"puree",purées:"purée"};
const planSing=w=>{const lo=String(w).toLowerCase();if(PL_IRREG[lo]){const v=PL_IRREG[lo];return /^[A-Z]/.test(w)?v[0].toUpperCase()+v.slice(1):v}
  return /ies$/.test(w)?w.slice(0,-3)+"y":/(ch|sh|x|ss|o)es$/.test(w)?w.slice(0,-2):/[^s]s$/.test(w)?w.slice(0,-1):w};
const planKey=item=>String(item).toLowerCase().split(/,| \(/)[0].replace(/\s+/g," ").trim().replace(/^((cold|chilled|fresh|warm|hot|room temperature|softened|melted|extra|full cream|whole|unsalted|salted|free-range|large|medium|ripe)\s+)+/,"").replace(/\s+(slices|sliced|pieces)$/,"").split(" ").map(planSing).join(" ");
function planShopping(f){const k=PLAN.guests/((f._r2&&f._r2.serves)||4),ds=planDishes(f),base=ds.filter(d=>!d.extra);
  /* the card's extra dishes list shop lines like "100g butter" with no tested scaling: the amount is split out so anything a measured recipe
     already buys merges into that one line; the rest gets its own group so the main list stays exact */
  const have=new Set(base.flatMap(d=>(d.ingredients||[]).map(i=>planKey(i.item)))),add=[],taste=[],seen=new Set();
  for(const d of ds.filter(d=>d.extra))for(const i of d.ingredients||[]){
    const m=String(i.item).match(/^(\d+(?:\.\d+)?)\s*(kg|g|ml|l|L)?\s+(.+)$/),q=m?+m[1]:null,u=m&&m[2]?m[2].toLowerCase():"",item=m?m[3]:i.item,key=planKey(item);
    if(have.has(key)){if(q!=null)add.push({q,u,item,aisle:i.aisle});continue}
    if(seen.has(key))continue;seen.add(key);taste.push(i.item+"@"+TASTE)}
  const ready=[...planLate(f).values()].map(n=>`${n}@${READY}`);
  return shopLines(base.map(d=>({d,k})).concat(add.length?[{d:{ingredients:add},k}]:[])).concat(taste,ready)}
const WHOLE_RE=/^(bags?|packets?|tins?|cans?|bottles?|jars?|tubs?|loa(f|ves)|punnets?|box(es)?|cartons?|blocks?|rolls?|sheets?|tubes?|sachets?)\b/i;
/* things a recipe uses ready-made that no shop sells: shopped as what you actually buy, with a first step to make them */
const baseG=(q,i)=>/^cups? /i.test(i.item)?q*185:i.u==="g"?q:i.u==="kg"?q*1000:null;
const BASES=[
 {re:/^(cold )?cooked risotto/i,buy:g=>[[g*.4,"g","arborio rice","Pantry"],[g*1.25,"ml","chicken or vegetable stock","Pantry"],[g*.075,"g","parmesan","Dairy"],[g*.05,"g","butter","Dairy"]],
  step:g=>`Make the risotto the day before: soften ${planQty(g*.4,"g")} arborio in the butter, add ${planQty(g*1.25,"ml")} hot stock a ladle at a time over about 20 minutes, stir in the parmesan, then spread it on a tray and chill overnight.`},
 {re:/^(cups? )?(cold )?cooked (cold )?(jasmine |long grain |white )?rice|^(jasmine |long grain )?rice, cooked/i,buy:(g,i)=>[[g/2.5,"g",(/jasmine/i.test(i.item)?"jasmine":/long grain/i.test(i.item)?"long grain":"white")+" rice","Pantry"]],
  step:(g,i)=>`Cook ${planQty(g/2.5,"g")} ${/jasmine/i.test(i.item)?"jasmine ":""}rice ahead (the day before is best), spread it out and chill. Cold rice fries and holds better.`},
 {re:/^mashed potato/i,buy:g=>[[g*1.15,"g","floury potatoes","Produce"],[g*.08,"g","butter","Dairy"],[g*.1,"ml","milk","Dairy"]],
  step:g=>`For the mash: boil ${planQty(g*1.15,"g")} peeled floury potatoes until soft, drain well and mash with the butter and milk.`},
 {re:/^(cooked (spaghetti|macaroni|penne|rigatoni|ziti)|(spaghetti|macaroni|penne|rigatoni|ziti|egg noodles), cooked)/i,buy:(g,i)=>{const n=i.item.toLowerCase().match(/spaghetti|macaroni|penne|rigatoni|ziti|egg noodles/)[0];return [[g/2.2,"g",n==="egg noodles"?"dried egg noodles":"dried "+n,"Pantry"]]},
  step:(g,i)=>{const n=i.item.toLowerCase().match(/spaghetti|macaroni|penne|rigatoni|ziti|egg noodles/)[0];return `Cook ${planQty(g/2.2,"g")} dried ${n} in well salted water until just tender, then drain.`}}];
const baseOf=i=>i&&i.q!=null&&baseG(i.q,i)!=null&&BASES.find(b=>b.re.test(String(i.item)));
/* tap water is never on the shopping list; soda, tonic, mineral and coconut water are */
const WATER_RE=/^((cold|hot|boiling|iced|ice|warm|fresh|filtered|tap)\s+)?water\b(?!\s*(crackers?|chestnuts?))|^(boiling|hot|cold) and (cold|hot) water|^water or (soda|stock)/i;
const EACH_G=[[/potato/i,200],[/marshmallow/i,7],[/almond/i,1.2],[/raspberr/i,4],[/strawberr/i,15],[/steak/i,250],[/onion/i,150],[/carrot/i,120],[/tomato/i,120],[/apple/i,150],[/lemon/i,100],[/lime/i,70],[/banana/i,120],[/blueberr/i,1]];
const packFirst=i=>{const pk=!i.u&&String(i.item).match(/^(.+?) \((\d+(?:\.\d+)?\s?(?:g|kg|ml|L))\s+(tins?|cans?|jars?|packets?|bags?|bottles?|tubs?)\)$/i);return pk?`${pk[2]} ${pk[3].replace(/s$/,"")} ${pk[1]}`:i.item};
function shopLines(list){
  const tally={},order=[];
  const flat=[];for(const {d,k} of list)for(const i of d.ingredients||[]){if(WATER_RE.test(String(i.item))&&!/stock/i.test(i.item))continue;
    const bs=baseOf(i);if(bs){const g=baseG(i.q,i);for(const [q,u,item,aisle] of bs.buy(g,i))flat.push({i:{q,u,item,aisle},k});continue}/* review 13: "lychees (565g tin)" bought by the tin reads "a 565g tin lychees", never "1 lychee (565g tin)" */
    flat.push({i:Object.assign({},i,{item:packNote(packFirst(i),k)}),k})}
  /* "a pinch of chilli powder" beside "1/2 tsp chilli powder" is one line: a pinch is an eighth of a teaspoon (review 12) */
  {const keys=new Set(flat.map(({i})=>planKey(i.item)));for(const x of flat){const m=String(x.i.item).match(/^(?:a )?(pinch(?:es)?|dash(?:es)?)(?: of)? (.+)$/i);
    if(m&&keys.has(planKey(m[2]))&&(x.i.q==null||!x.i.u)){x.i=Object.assign({},x.i,{item:m[2],u:"tsp",q:(x.i.q||1)/8})}}}
  for(const {i,k} of flat){
    const b=UNITB[i.u]||[i.u||"#",1],a=AISLES.includes(i.aisle)?i.aisle:"Pantry";
    const key=a+"|"+planKey(i.item);
    if(!tally[key]){tally[key]={a,item:i.item,items:new Set(),parts:{},order:[],open:false};order.push(key)}
    const t=tally[key];t.items.add(String(i.item));
    if(i.q==null){t.open=true;continue}
    const u=b[0]==="#"?"":b[0];if(!(u in t.parts)){t.parts[u]=0;t.order.push(u)}if(fryOil(i)){t.fry=t.fry||{};t.fry[u]=Math.max(t.fry[u]||0,ingQ(i,k)*b[1])}else t.parts[u]+=ingQ(i,k)*b[1];
  }
  const lines=order.map(key=>{const t=tally[key];
    /* two different cuts of the same thing ("lemon, juiced" and "lemons") share the plain name; prep words ("shredded", "juiced", "to taste") stay in the method */
    let item=t.items.size>1?String(t.item).split(/,| \(/)[0].trim():t.item;
    for(let g=0;g<4&&PREP_TAIL.test(item);g++)item=item.replace(PREP_TAIL,"");
    /* salt and pepper are in every kitchen: listed so you check, never measured */
    if(STAPLE_RE.test(planKey(item)))return item+"@"+t.a;
    for(const u of ["tsp","tbsp"])if(u in t.parts){const q=t.parts[u];t.parts[u]=q<1?Math.ceil(q*4-0.01)/4:Math.ceil(q*2-0.01)/2}
    if("tsp" in t.parts&&"tbsp" in t.parts){t.parts.tbsp=Math.ceil((t.parts.tbsp+t.parts.tsp/3)*2-0.01)/2;delete t.parts.tsp;t.order=t.order.filter(u=>u!=="tsp")}/* thirds round up to a half: "4 1/2 tbsp", never "4 1/3 tbsp" */
    /* spoons and cups next to a weight or volume fold into it, so the line reads as one amount ("375g caster sugar", not "1 tsp + 370g") */
    for(const base of ["ml","g"])if(base in t.parts){const per=base==="ml"?{tsp:5,tbsp:15,cup:250}:{tsp:4,tbsp:12,cup:200};
      for(const u of ["tsp","tbsp","cup"])if(u in t.parts){t.parts[base]+=t.parts[u]*per[u];delete t.parts[u];t.order=t.order.filter(x=>x!==u)}}
    /* the frying pot covers a splash of the same oil for the pan: 2 L for frying plus 4 tbsp to fry the onions still reads "2 L", at any guest count (Raiders at 9 was "2.1 L") */
    if(t.fry)for(const u in t.fry){const pot=t.fry[u],extra=t.parts[u]||0;t.parts[u]=extra<=pot*.1?pot:pot+extra;if(!t.order.includes(u))t.order.push(u)}
    for(const u of ["tsp","tbsp","cup"])if(t.fry&&t.fry.ml&&u in t.parts){const per={tsp:5,tbsp:15,cup:250};if(t.parts[u]*per[u]<=t.fry.ml*.1){delete t.parts[u];t.order=t.order.filter(x=>x!==u)}}
    /* the same thing in grams and millilitres (sour cream, ice cream) adds up as grams; spoons alongside cups fold into cups */
    if("g" in t.parts&&"ml" in t.parts){t.parts.g+=t.parts.ml;delete t.parts.ml;t.order=t.order.filter(x=>x!=="ml")}
    if("cup" in t.parts)for(const [u,d] of [["tbsp",16],["tsp",48]])if(u in t.parts){t.parts.cup+=t.parts[u]/d;delete t.parts[u];t.order=t.order.filter(x=>x!==u)}
    /* a count next to a weight ("1 potato + 800g") becomes one weight, using a standard size */
    if(""in t.parts&&"g" in t.parts){const w=EACH_G.find(([re])=>re.test(item));if(w){t.parts.g+=t.parts[""]*w[1];delete t.parts[""];t.order=t.order.filter(x=>x!=="")}}
    /* herb leaves are bought by the bunch: about a cup of leaves, or 20 leaves, to a bunch */
    {const hm=String(item).match(/^(fresh )?(mint|basil|coriander|parsley|dill|sage|thyme|tarragon|oregano|curry|kaffir lime|makrut lime|shiso|perilla|thai basil)( leaves|,.*leaves)/i);
     if(hm&&(""in t.parts||"cup" in t.parts)&&!("g" in t.parts)){const b=Math.max(1,Math.ceil((t.parts[""]||0)/20+(t.parts.cup||0)-0.05));return `${b} bunch${b>1?"es":""} ${hm[2].toLowerCase()}@${t.a}`}}
    /* nobody buys half an egg or half a lemon: counts round up on the shopping list */
    if(""in t.parts&&!WHOLE_RE.test(item))t.parts[""]=Math.max(1,Math.ceil(t.parts[""]-0.05));
    if(!t.order.length)return item+"@"+t.a;
    /* ice by the cup rounds up to whole cups, and a lot of it is a bag from the servo (a bag is about 20 cups): "1 bag ice (about 14 cups)" */
    if(/^(crushed |cubed )?ice( cubes)?$/i.test(item)&&t.order.length===1&&"cup" in t.parts){const c=Math.ceil(t.parts.cup-0.05);if(c>=8){const b=Math.ceil(c/20);return `${b} bag${b>1?"s":""} ${item} (about ${c} cups)@${t.a}`}t.parts.cup=c}
    /* bags, jars, tins and the like are bought whole */
    if(""in t.parts&&WHOLE_RE.test(item))t.parts[""]=Math.ceil(t.parts[""]-0.05);
    let count=""in t.parts?planQty(t.parts[""],"")+" "+(t.parts[""]>1.01?planPlural(item,t.parts[""]):planOne(item)):"";
    /* a size in front of the pack reads "a 565g can", "2 x 565g cans", never "1 565g can" */
    count=count.replace(/^1 (\d+(?:\.\d+)?\s?(?:g|kg|ml|L|l)\b)/,"a $1").replace(/^(\d+) (\d+(?:\.\d+)?\s?(?:g|kg|ml|L|l)\b)/,"$1 x $2");
    const rest=t.order.filter(u=>u!=="").map(u=>planQty(t.parts[u],u)).join(" + ");
    return (count?count+(rest?" + "+rest:""):rest+" "+item)+"@"+t.a});
  /* green and ripe of the same fruit share one line: "3 mangoes, 1 green" */
  for(let i=0;i<lines.length;i++){const m=lines[i].match(/^(\d+) green (mango(es)?|papayas?|tomato(es)?|bananas?|apples?|capsicums?)@(.+)$/i);if(!m)continue;
    const base=planSing(m[2].toLowerCase()).replace(/^mangoe$/,"mango").replace(/^tomatoe$/,"tomato"),j=lines.findIndex((l,x)=>x!==i&&new RegExp("^(\\d+) "+base+"(e?s)?@"+m[5]+"$","i").test(l));if(j<0)continue;
    const n=+lines[j].match(/^\d+/)[0]+ +m[1];lines[j]=`${n} ${planPlural(base,n)}, ${m[1]} green@${m[5]}`;lines.splice(i,1);i--}
  /* a herb bought by the bunch covers the spoonfuls of it in other dishes: "1 bunch chives", not "2 tbsp chives" and "1 bunch chives" (review 12) */
  for(const H of ["chives","parsley","coriander","mint","basil","dill","thyme","rosemary","sage","oregano","tarragon","flat-leaf parsley","italian parsley","spring onions","green onions","shallots","scallions"]){
    const bunch=lines.find(l=>new RegExp("^\\d+( small| large)? bunch(es)? (of )?(fresh )?"+H+"( leaves)?@","i").test(l));if(!bunch)continue;
    for(let i=lines.length-1;i>=0;i--)if(lines[i]!==bunch&&new RegExp("^[\\d\\/ ]+ ((tsp|tbsp|cups?|handfuls? of|handfuls?|sprigs? of|sprigs?) )?(fresh )?((finely |roughly )?chopped )?"+H+"( leaves| sprigs)?(,[^@]*)?@","i").test(lines[i]))lines.splice(i,1)}
  /* two lines that come out the same ("3 bunches of dill" from sprigs and from leaves) add up */
  for(let i=0;i<lines.length;i++){const m=lines[i].match(/^(\d+)( small| large)? (bunch(?:es)?)( of)? (.+)$/);if(!m)continue;
    for(let j=lines.length-1;j>i;j--){const n=lines[j].match(/^(\d+)( small| large)? (bunch(?:es)?)( of)? (.+)$/);if(n&&n[5]===m[5]){const t=+m[1]+ +n[1];lines[i]=`${t}${m[2]||""} ${t>1?"bunches":"bunch"}${m[4]||""} ${m[5]}`;lines.splice(j,1)}}}
  /* salt is one line: "salt", "pinch of salt" and "salt flakes" read "salt and salt flakes" */
  {const sl=lines.map((l,i)=>[l,i]).filter(([l])=>/^((a )?pinch(es)? of )?((sea|table|cooking|fine|kosher|flaky) )?salt( flakes?)?@/i.test(l));
   const sp=lines.some(l=>/^salt and (freshly ground )?(black )?pepper@/i.test(l));
   if(sl.length>1||sp&&sl.length){const fl=sl.some(([l])=>/flak/i.test(l)),pl=!sp&&sl.some(([l])=>!/flak/i.test(l)),at=sl[0][0].split("@")[1];
     for(let k=sl.length-1;k>=0;k--)lines.splice(sl[k][1],1);if(pl||fl)lines.splice(sl[0][1],0,(pl&&fl?"salt and salt flakes":fl?"salt flakes":"salt")+"@"+at)}}
  /* "salt and pepper" already covers a plain "salt" or "pepper" line (Casino Royale listed both) */
  {const sp=lines.find(l=>/^salt and (freshly ground )?(black )?pepper@/i.test(l));if(sp)for(let i=lines.length-1;i>=0;i--)if(lines[i]!==sp&&/^((sea |table |cooking |fine )?salt|(ground |cracked )?(black )?pepper)@/i.test(lines[i]))lines.splice(i,1)}
  return lines;
}
const PREP_TAIL=/,\s*((finely|thinly|roughly|coarsely|lightly|freshly|very)\s+)?(shredded|juiced|zested|sliced|chopped|diced|grated|halved|quartered|peeled|minced|crushed|torn|cubed|julienned|deseeded|seeded|cored|trimmed|picked|rinsed|drained|beaten|melted|softened|to taste|to serve|for serving|plus extra|cut into [^,]+|at room temperature)(\s+and\s+(shredded|juiced|zested|sliced|chopped|diced|grated|halved|quartered|peeled|minced|crushed|deseeded|cored|trimmed))?\s*$/i;
const STAPLE_RE=/^(salt|sea salt|table salt|cooking salt|fine salt|kosher salt|flaky salt|salt flake|sea salt flake|pepper|black pepper|ground black pepper|cracked black pepper|white pepper|salt and pepper|salt and black pepper|salt and freshly ground black pepper)$/;
/* waiting time (chilling, soaking, resting, setting) is shown apart from hands-on and cooking time */
const WAIT_RE=/^(chill|refrigerate|freeze|soak|marinate|rest|cool|prove|steep|leave|let|set aside|stand|infuse|steep|drain|set|churn|rise)\b|\b(in the fridge|overnight|to set|until set|to rest|to cool|to chill|to prove|to rise|to soak|to marinate|to steep|to infuse|to drain|until doubled|doubled in size|an hour before|hours before|an hour ahead|hours ahead|to room temperature for|come to room temperature|wait for|chill until|until firm|until cold|until solid|for the setting)\b|\b(and|then) (chill|refrigerate|freeze|set|leave to set|cool)\b|\bin the freezer\b|\bdoubled\b|\b(chill|refrigerate|rest|set|freeze|soak|marinate|drain) (\d+|an?|one|two|three) (hours?|hrs?|minutes?|mins?)\b|\b(cure|age|ferment|pickle|steep|infuse|macerate)\w*\b[^.]{0,40}\bfor (\d+|an?|one|two|three|several)( to \d+)? (days?|weeks?)\b|\b(dry|leave|cool) (it |them )?in the (turned-off |switched-off )?oven\b|\boven (off|turned off)\b|\b(part|half|semi)[- ]?freez\w*|\b(leave|keep|store|rest|sit)\b[^.]{0,30}\b(a|one|two|three|four|\d+) (weeks?|days?)\b\b|\b(drain|chill|refrigerat|freez|set|rest|soak|marinat|prove|rise|stand|steep|infus|churn|cool)\w*\b[^.]{0,50}\bfor (at least |about |up to )?(\d+|an?|one|two|three|four|five|six|several)( to \d+)? (hours?|hrs?|minutes?|mins?|days?)\b/i;
/* hands-on time grows by half for each extra batch (k = guests / serves); cooking and waiting stay the same */
/* a note for non-drinkers or kids is a tip, not a timed step */
const TIP_RE=/\b(for the kids|for kids|non-drinkers?|for drivers|alcohol-free (version|ones?|jug)|to make (it|them|this|one) (alcohol-free|non-alcoholic|booze-free)|soda only for|without the (rum|vodka|gin|whisky|bourbon|tequila|wine|beer|booze))\b/i;
/* split a step into the instruction and any tip sentence; a step that is only a tip has no time */
/* a bake scaled past one and a half times goes in batches: same tins, same time, not one overloaded tin */
const BAKE_RE=/\b(cake tins?|loaf tins?|baking (tin|dish|tray)|pie dish|tart tin|springform|muffin tin|lamington tin|slice tin|sandwich tins?|tins?)\b/i;
const batchTip=(x,k)=>{if(!(k>1.5)||!(x.steps||[]).some(s=>BAKE_RE.test(s.text)&&/\bbake\b/i.test(s.text)))return "";const n=Math.ceil(k-0.05);return `For this many, make it in ${n===2?"two":n===3?"three":n} batches: same tins and baking time for each.`};
const stepParts=t=>{const ss=String(t).split(/(?<=[.!?])\s+(?=[A-Z])/),tip=ss.filter(x=>TIP_RE.test(x)),main=ss.filter(x=>!TIP_RE.test(x));return {main:main.join(" "),tip:tip.join(" ")}};
/* a step is waiting if it says so, or if it runs over four hours without heat: nobody does four hours of hands-on prep */
const isWaitStep=t=>(t.min||0)>=10&&(WAIT_RE.test(String(t.text).trim())||((t.min||0)>=240&&!HEAT_RE.test(String(t.text))));
function dishTimes(x,k){const st=(x.steps||[]).filter(t=>stepParts(t.text).main);let wait=0;for(const t of st)if(isWaitStep(t))wait+=t.min;
  const prep=x.prep_min||0,cook=x.cook_min||0;wait=Math.min(wait,prep+cook);
  /* split by the steps themselves when their minutes add up to the recipe's total: hands-on, heat and waiting each counted where they happen */
  const isW=isWaitStep,isH=t=>!isW(t)&&HEAT_RE.test(String(t.text));
  const heat=st.filter(isH).reduce((a,t)=>a+(t.min||0),0),sum=st.reduce((a,t)=>a+(t.min||0),0);
  let c2,p2;
  if(st.length&&st.every(t=>t.min>0)&&Math.abs(sum-(prep+cook))<=Math.max(5,(prep+cook)*.25)){c2=heat;p2=Math.max(0,sum-heat-wait)}
  else{/* otherwise take the waiting off cooking, but never below the heat steps, and the rest off prep */
    c2=Math.max(heat,cook-wait);p2=Math.max(0,prep+cook-c2-wait)}/* someone always has to chop, season or mix: prep is never shown as 0 */
  if(st.length&&p2<5)p2=5;
  const p3=k>1.01?Math.round(p2*(1+(k-1)/2)/5)*5:p2;return {prep:p3,cook:c2,wait,active:p3+c2}}
/* frying oil is set by the pot, not the guests: never less than the recipe's own amount */
/* pack notes inside an item follow the guests: "750ml lager (4 stubbies)" for 4 is "(9 stubbies)" for 9 */
/* so do the notes after the name: "(about 10 limes)" is "(about 22 limes)" for 9, "about 600g" and a split ("80ml for the mash, 125ml for the coating") scale too.
   A size per piece ("about 250g each", "330ml each", "per glass"), a temperature or a length, and the size of a tin, jar or bag stay put */
const packAbout=(item,k)=>{const c=item.search(/,|\(/);if(c<0||WHOLE_RE.test(item))return item;
  const tail=item.slice(c).replace(/\b(\d+) (dashes|drops|splashes|shakes)\b/gi,(m,n,w)=>`${Math.max(1,Math.ceil(+n*k-0.05))} ${w}`)/* bitters scale with the guests: "8 dashes" for 4 is "18 dashes" for 9 */.replace(/\(about (\d+) ([a-z]+)/gi,(m,n,w)=>{if(/^(cm|mm|c|ml|g|kg|l)$/i.test(w))return m;const v=Math.max(1,Math.ceil(+n*k-0.05));return `(about ${v} ${v>1?(/s$/i.test(w)?w:planPlural(w,v)):planSing(w)}`})
    .replace(/\b(\d+(?:\.\d+)?)\s?(ml|g|kg|l)\b(?![^,(]*\b(each|per)\b)/gi,(m,n,u,e,o,all)=>/\b(of|x)\s*$|\(\s*$/i.test(all.slice(0,o))&&!/about\s*$/i.test(all.slice(0,o))||/^\s*(tins?|cans?|jars?|bottles?|packets?)\b/i.test(all.slice(o+m.length))?m:planQty(+n*k,u.toLowerCase()).replace(" L","\u00a0L"));
  return item.slice(0,c)+tail};
const packNote=(item,k)=>!k||Math.abs(k-1)<.01?item:packAbout(String(item),k).replace(/\((\d+)\s+(stubbies|stubby|cans?|bottles?|tins?|jars?|packets?|bags?|tinnies|slabs?|longnecks?)([^)]*)\)/i,(m,n,u,rest)=>{const v=Math.max(1,Math.ceil(+n*k-0.05));return `(${v} ${v===1?u.replace(/ies$/,"y").replace(/s$/,""):/y$/.test(u)?u.replace(/y$/,"ies"):/s$/.test(u)?u:u+"s"}${rest})`});
const FRY_RE=/\bfor (deep[- ])?frying\b/i;
/* frying oil is one pot whatever the guest count: it never scales, and dishes on the same sheet share it (the list takes the biggest pot, not the sum).
   Half a litre or more of plain oil is always a frying pot, whatever the recipe calls it ("2 L vegetable oil" for sesame balls) */
const fryOil=i=>FRY_RE.test(i.item)||/\boil\b/i.test(i.item)&&!/\b(sesame|chilli|chili|truffle|infused)\b|\bfor the\b/i.test(i.item)&&(/^l$/i.test(i.u)&&i.q>=0.5||i.u==="ml"&&i.q>=500||i.u==="cup"&&i.q>=2);
const ingQ=(i,k)=>fryOil(i)?i.q:i.q*k;
/* a dish's own ingredients, scaled to the guests */
function dishIng(x,k){return dishIngList(x,k).join(", ")}
function dishIngList(x,k){return (x.ingredients||[]).map(i0=>{const i=Object.assign({},i0,{item:packNote(packFirst(i0),k)});if(i.q==null)return i.item;let q=ingQ(i,k);if(!i.u&&(/^eggs?\b|^egg yolks?|^egg whites?|\bloa(f|ves)\b|^(pinch|dash|sprig|splash|drop|handful)(es|s)?\b/i.test(i.item)||WHOLE_RE.test(i.item)))q=Math.max(1,Math.ceil(q-0.05));if(!i.u)return (planQty(q,"")+" "+(q>1.01?planPlural(i.item,q):planOne(i.item))).replace(/^1 (\d+(?:\.\d+)?\s?(?:g|kg|ml|L|l)\b)/,"a $1").replace(/^(\d+) (\d+(?:\.\d+)?\s?(?:g|kg|ml|L|l)\b)/,"$1 x $2");return planQty(q,i.u)+" "+i.item})}
/* counts in a method step follow the guests: "fill four tall glasses" for 4 becomes "fill eight tall glasses" for 8; times, heat and sizes stay put */
const NUMW=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
const STEP_NOUN="lemons?|limes?|oranges?|onions?|potatoes|potato|tomatoes|tomato|apples?|bananas?|avocados?|cloves?|cubes?|chunks?|strips?|rounds?|discs?|logs?|eggs?|glass|glasses|cup|cups|mug|mugs|bowl|bowls|plate|plates|meatballs?|patties|patty|burgers?|skewers?|kebabs?|balls?|rolls?|buns?|tacos?|tortillas?|wraps?|portions?|pieces?|slices?|wedges?|squares?|triangles?|fingers?|cookies?|biscuits?|cupcakes?|muffins?|scones?|pancakes?|crepes?|sandwiches|sandwich|toasties?|pies?|tarts?|parcels?|dumplings?|rissoles?|fritters?|cakes?|bars?|cones?|scoops?|shots?|jars?|ramekins?|moulds?|molds?|serves|servings|people|pizzas?|bases|nests|stacks?|sliders?|hot dogs?|dogs?|sausages?|chops?|steaks?|fillets?|cutlets?|wings?|drumsticks?|lollies|lolly|ice blocks?|popsicles?|lettuce cups";
const STEP_RE=new RegExp("\\b(\\d{1,3}|"+NUMW.slice(1).join("|")+")((?:\\s+[a-z-]+){0,2}?)\\s+("+STEP_NOUN+")\\b","gi");
const STEP_AMT=/\b(\d+(?:\.\d+)?)\s?(kg|g|ml|l)\b(?!\s*(?:tin|can|jar|bottle|packet|pack|tub|block|bag)s?\b)/gi;
function scaleStep(t,k){if(!k||Math.abs(k-1)<0.01)return t;return String(t).split(/(?<=[.!?])\s+/).map(sn=>scaleOne(sn,k)).join(" ")}
/* a count about one serve stays as written: "for each drink, 45ml tequila", "cut each sheet into four squares", "two patties per bun", "three scoops to each" */
const PER_BEFORE=/\b(each|per|every)\b(?!\s+of\b)/i,PER_AFTER=/^\s*(?:of\s+(?:[a-z-]+\s+){0,3})?(per|to each|in each|on each|into each|for each|each|apiece|a head)\b/i;
function scaleOne(t,k){const keep=(m,off)=>PER_BEFORE.test(t.slice(0,off))||PER_AFTER.test(t.slice(off+m.length));
  return String(t).replace(STEP_AMT,(m,n,u,off)=>keep(m,off)?m:planQty(+n*k,u.toLowerCase())).replace(STEP_RE,(m,n,mid,noun,off,all)=>{if(keep(m,off))return m;const w=NUMW.indexOf(n.toLowerCase());const v=w>0?w:+n;if(!(v>0))return m;if(/^(\s+(minutes?|mins?|hours?|hrs?|seconds?|cm|mm|degrees?|c|f|inch|inches))/i.test(mid))return m;
  const nv=Math.max(1,Math.round(v*k));let out=w>0&&nv<=20?NUMW[nv]:String(nv);if(/^[A-Z]/.test(n))out=out[0].toUpperCase()+out.slice(1);
  let nn=noun;if(nv>1&&v===1)nn=/(ch|sh|x|s)$/i.test(noun)?noun+"es":/y$/i.test(noun)&&!/(ay|ey|oy)$/i.test(noun)?noun.slice(0,-1)+"ies":noun+"s";if(nv===1&&v>1)nn=planSing(noun);return out+mid+" "+nn})}
/* hands-on and cooking are always plain hours and minutes; only waiting talks about days */
const planDur=m=>m>=60?Math.floor(m/60)+" hr"+(m%60?" "+m%60+" min":""):m+" min";
/* a wait: its length, and on its own when to start (review 13: "12 hr, start the day before wait" read back to front) */
const planMin=m=>m>=1440?(d=>d+(d===1?" day":" days"))(Math.round(m/1440)):m>=600?(Math.round(m/60))+" hr":m>=60?Math.floor(m/60)+" hr"+(m%60?" "+m%60+" min":""):m+" min";
const planWhen=m=>m>=1440?(d=>`, start ${d===1?"the day":d+" days"} before`)(Math.round(m/1440)):m>=600?", start the day before":"";
/* review 14: the dish list in Director's cut reads the same kids' and alcohol-free words as the card and Prep sheet ("Rye and jasmine tea highball" in kids' mode) */
function planHTML(f){const h=planHTML0(f);if(typeof document==='undefined'||!dryNow(f))return h;try{const t=document.createElement('template');t.innerHTML=h;kidsDryDom(t.content,f);const d=document.createElement('div');d.appendChild(t.content);return d.innerHTML}catch(e){return h}}
function planHTML0(f){
  const LT=planLate(f),r=f._r2,k=PLAN.guests/(r.serves||4),C={s:"Snacks",m:"Mains",w:"Sweets",d:"Drinks",c:"From the candy bar"},all=planAll(f);
  const TAG={veg:"vegetarian version",af:"alcohol-free version"},BLK={meat:"has meat or fish",alcohol:"has alcohol"};
  return `<div class="pl-row"><span class="pl-l">Guests</span><button type="button" class="pl-b" data-pl="-" aria-label="Fewer guests">−</button><output class="pl-g" aria-live="polite">${PLAN.guests}</output><button type="button" class="pl-b" data-pl="+" aria-label="More guests">+</button></div>
  <div class="pl-row pl-diet"><label class="pl-t"><input type="checkbox" data-diet="veg"${DIET.veg?" checked":""}><span>Vegetarian</span></label><label class="pl-t"><input type="checkbox" data-diet="af"${dietAF()?" checked":""}${kidsMode?" disabled":""}><span>No alcohol${kidsMode?" (kids mode)":""}</span></label></div>
  <details class="pl-pick"${planOpen()?" open":""}><summary><span class="pl-sum">${planCount(r)}</span><span class="pl-tw">Choose dishes</span></summary>
  <p class="pl-hint">Tick what you want to make tonight. The prep sheet, shopping list and times follow your picks.${DIET.veg||dietAF()?" Dishes that don't fit are swapped for their own version, or left off so you can choose.":""}</p>
  ${LT.plan?`<p class="pl-late-note" role="note">${ESC(planLateText(LT.plan))} <button type="button" class="pl-move" data-plmove>Move to ${ESC(calDay(LT.plan.late.next))}</button></p>`:""}
  ${(()=>{const LB=planLabels(f),HS=planHouse(f);return ["s","m","w","d","c"].map(c=>{const ds=all.filter(d=>d.course===c),hs=HS.filter(h=>h.course===c);return ds.length||hs.length?`<fieldset class="pl-c"><legend>${C[c]}</legend>${ds.map(d=>{const late=LT.has(d.orig||d.n);return `<label class="pl-d${late?" pl-late":""}"><input type="checkbox" data-dish="${ESC(d.orig||d.n)}"${planOn(d)&&!late?" checked":""}${late?" disabled":""}><span>${ESC(LB[d.orig||d.n]&&!d.tag?LB[d.orig||d.n]:d.n)}${d.tag&&!/alcohol-free|vegetarian/i.test(d.n)?`<em class="pl-tag">${TAG[d.tag]}</em>`:""}${d.blocked?`<em class="pl-tag pl-no">${BLK[d.blocked]}</em>`:""}${late?`<em class="pl-tag pl-no">too late for this night, buy ready-made</em>`:""}</span><small>${d.extra?"From the menu":(t=>planDur(t.active)+(t.wait?" + "+planMin(t.wait)+" wait"+planWhen(t.wait):""))(dishTimes(d,PLAN.guests/((f._r2&&f._r2.serves)||4)))}</small></label>`}).join("")}${hs.map(h=>`<p class="pl-d pl-house"><span>${ESC(h.n)}<em class="pl-tag">house standard</em></span><small>Served as is</small></p>`).join("")}</fieldset>`:""}).join("")})()}</details>`;
}
function planCount(r){const f=current,LT=f?planLate(f):new Map(),all=f?planAll(f).filter(d=>d.course!=="c"):r.dishes.map(d=>dietDish(d)),on=all.filter(d=>planOn(d)&&!LT.has(d.orig||d.n)).length;return `${on} of ${all.length} dishes picked`}
function planOpen(){try{return localStorage.getItem("mns-plan-open")==="1"}catch(e){return false}}
/* 175C reads as 175°C, and a lone litre is written "1 L" so it never reads as eleven */
const degC=t=>String(t).replace(/(\d{2,3})\s?C\b/g,"$1°C").replace(/(\d(?:\.\d+)?)\s?l\b/g,"$1\u00a0L").replace(/(\d[\d.]*)\s+to\s+(\d[\d.]*)/g,"$1\u00a0to\u00a0$2");
/* the kind of waiting a dish needs, in plain words: "to chill", "to marinate and rest" */
/* review 17: cures, brines and pickles say so too ("Ninety-year feast dill gravlax, 2 days to cure"), never a bare "waiting" */
const WAIT_WORD=/\b(chill|refrigerate|freeze|soak|marinate|rest|cool|prove|rise|set|steep|infuse|cure|brine|pickle|ferment|macerate|thaw|defrost|drain|firm|sit|stand)(?=s?\b|ed\b|ing\b|d\b)/i,
  WAIT_TO={refrigerate:"chill",rise:"prove",sit:"rest",stand:"rest",defrost:"thaw"};
function waitWords(x){const w=[],put=v=>{if(!w.includes(v))w.push(v)};
  for(const t of x.steps||[])if((t.min||0)>=10&&WAIT_RE.test(String(t.text).trim())){const tx=String(t.text),sw=[];
    for(const m of tx.matchAll(new RegExp(WAIT_WORD.source,"gi"))){const v=WAIT_TO[m[1].toLowerCase()]||m[1].toLowerCase();if(!sw.includes(v))sw.push(v)}
    /* a bare "rest" says least: the step's own clue wins ("Rest the chicken in the buttermilk" marinates, "leave in the fridge" chills) */
    if(!sw.length||(sw.length===1&&sw[0]==="rest")){const c=/\bdry\b[^.]*\b(fridge|uncovered)|uncovered[^.]*\bfridge/i.test(tx)?"dry":/\b(buttermilk|marinade|brine)\b/i.test(tx)?"marinate":/\buntil sour\b/i.test(tx)?"pickle":
      /\b(fridge|refrigerat\w*)\b/i.test(tx)?"chill":/\bfreezer\b/i.test(tx)?"freeze":/\bsyrupy\b/i.test(tx)?"steep":"rest";sw.length=0;sw.push(c)}
    sw.forEach(put)}
  return w.length?"to "+(w.length>1?w.slice(0,-1).join(", ")+" and "+w[w.length-1]:w[0]):"to rest"}
/* only heat counts as cooking: a drink that is stirred or a tartare that is chopped is all prep */
const HEAT_RE=/\b(oven|bake|baking|fry|fried|grill|boil|simmer|roast|sear|toast|heat|cook|pan|barbecue|bbq|microwave|poach|steam|saut|caramel|flame|reduce|melt|char|braise|broil|smoke)/i;
/* review 16: the locked-in film's Prep sheet carries its showtime and when to start, worked out the same way as the calendar reminder */
function prepWhen(f,ds,TT){if(typeof week==="undefined"||!week||(week.id!==f.id&&week.double!==f.id)||typeof calPlan!=="function")return [];
  try{const show=weekShow(),now=new Date(),live=show>now,p=calPlan(show,calDishes(f),live?now:undefined);
    const when=d=>weekDateKey(d)===weekDateKey(show)?calClock(d):`${calDay(d)} ${calClock(d)}`;
    const out=[`Showtime ${calClock(show)}`,p.startNow?"start cooking now":`start cooking ${when(p.start)}`,p.early?(p.early.now?"make ahead now":`make ahead from ${calClock(p.early.at)}`):"",
      p.before?(p.before.now?"prep ahead now":`prep ahead ${calDay(p.before.at)} ${calClock(p.before.at)}`):"",
      p.before2?(p.before2.now?"prep ahead now":`prep ahead ${calDay(p.before2.at)} ${calClock(p.before2.at)}`):""].filter(Boolean);
    /* review 17: a make-ahead that no longer fits before this showtime is said in words, under the chips */
    if(p.late)out.late=planLateText(p);return out}catch(e){return []}}
/* review 18: on the planner and Prep sheet a too-late dish is already off the plan and on the list as ready-made */
const planLateText=p=>p&&p.late?`Too late to make ahead for this night: ${calList(p.late)}. ${p.late.dishes.length>1?"They're":"It's"} off the plan and on the shopping list to buy ready-made, or move movie night to ${calDay(p.late.next)} to make ${p.late.dishes.length>1?"them":"it"}.`:"";
/* the dishes as the calendar reads them: picked, timed, with what is left on the night */
function prepNight(ds,TT){return ds.map((x,i)=>x.extra?null:{n:x.n,active:TT[i].active,wait:TT[i].wait,...calNight(x,TT[i]),words:TT[i].wait>=CAL_LONG?waitWords(x):""}).filter(Boolean)}
/* the Prep sheet's shopping list by aisle; Copy text lists the same (13 Nov: it used the card's own lines, unscaled and merged differently) */
function prepShopGroups(f){const g={};for(const x of planShopping(f)){const [n,a]=x.split("@");(g[a]=g[a]||[]).push(n)}return AISLES.filter(a=>g[a]).map(a=>[a,g[a]])}
function prepHTML2(f,menu){
  const edition=movieEdition(f),L=LAYOUT[f.theme]||"storybook",c=pal(f),d=DECO(L,c,f);
  const ds=planDishes(f);
  const tk=sharedTicks(f);
  /* a dry list folds lines that dry to the same drink into one, amounts added, as the shopping dialog and Copy text do (dryJoin).
     Only folded lines print already dried; the rest stay raw for kidsDryDom. The folded line's tick carries the others (data-of) */
  const dryP=typeof dryNow==="function"&&dryNow(f);
  const shop=prepShopGroups(f).map(([a,l])=>`<div class="pp-aisle"><h4>${a}</h4><ul>${(dryP?dryJoin(l.map(x=>[x,dryText(x,true)])):l.map(x=>({x,of:[x],text:x}))).map(e=>{const x=e.x,k=tickKey(x),on=!!tk[k],more=e.of.slice(1).map(tickKey);return `<li role="checkbox" tabindex="0" aria-checked="${on}" data-k="${ESC(k)}"${more.length?` data-of="${ESC(more.join("\n"))}"`:""}${on?' class="pp-done"':""}><span class="pp-box"></span>${ESC(more.length?e.text:x)}</li>`}).join("")}</ul></div>`).join("");
  const TT=ds.map(x=>dishTimes(x,x.snack?PLAN.guests/4:PLAN.guests/((f._r2&&f._r2.serves)||4))),hands=TT.reduce((s,x)=>s+x.prep,0),aheadAt=ds.map((x,i)=>!x.extra&&aheadWhole(x)&&TT[i].wait>=CAL_LONG),waitMax=TT.reduce((m,x,i)=>aheadAt[i]?m:Math.max(m,x.wait),0),aheadN=(LB0=>ds.filter((x,i)=>aheadAt[i]).map(x=>LB0[x.orig||x.n]&&!x.tag?LB0[x.orig||x.n]:x.n))(planLabels(f)),PWN=prepWhen(f,ds,TT);
  const L2={s:"Snack",m:"Main",w:"Sweet",d:"Drink",c:"Candy bar"},K=PLAN.guests/((f._r2&&f._r2.serves)||4);const LBp=planLabels(f);
  const steps=ds.filter(x=>(x.steps||[]).length).map((x,i)=>{const kk=x.snack?PLAN.guests/4:K,T=dishTimes(x,kk),hot=(x.steps||[]).some(s=>HEAT_RE.test(s.text));
    const time=x.extra?"From the printed menu, buy to suit":hot&&T.cook?`Prep ${planDur(T.prep)}, cook ${planDur(T.cook)}`:`Takes ${planDur(T.prep+T.cook)}`;
    const ing=dishIngList(x,kk);
    return `<li><b>${ESC(LBp[x.orig||x.n]&&!x.tag?LBp[x.orig||x.n]:x.n)}</b><em>${L2[x.course]||""}</em><span class="pp-time">${time}${T.wait?`, then ${planMin(T.wait)} ${waitWords(x)}${planWhen(T.wait)}`:""}</span>${x.make_ahead?`<span class="pp-ahead"><b>Make ahead</b> ${ESC(degC(x.make_ahead))}</span>`:""}${ing.length?`<div class="pp-ing"><b>You need</b><ul>${ing.map(g=>`<li>${ESC(degC(g))}</li>`).join("")}</ul></div>`:""}${batchTip(x,kk)?`<p class="pp-tip"><b>Tip</b> ${ESC(batchTip(x,kk))}</p>`:""}<ol class="pp-steps">${(x.ingredients||[]).filter(baseOf).map(i=>`<li>${ESC(baseOf(i).step(baseG(i.q,i)*kk,i))}</li>`).join("")}${(x.steps||[]).filter(s=>stepParts(s.text).main).map(s=>`<li>${ESC(degC(scaleStep(stepParts(s.text).main,kk)))}${s.min?` <span class="pp-t">${planDur(s.min)}</span>`:""}</li>`).join("")}</ol>${(x.steps||[]).map(s=>stepParts(s.text).tip).filter(Boolean).map(t=>`<p class="pp-tip"><b>Tip</b> ${ESC(degC(scaleStep(t,kk)))}</p>`).join("")}</li>`}).join("");
  return `<div class="mc-bg">${d.bg}</div><div class="mc-grain" style="background-image:url('${GRAIN}')"></div>
  <div class="mc-in pp">
    <div class="mc-eye">Prep sheet</div>
    <div class="pp-title">${ESC(f.title)}</div>
    <p class="pp-serves">${((PW,LD,ND)=>{/* review 27: a short wait is already inside "longest on the night", and a long one that fits while the longest dish cooks
      adds nothing, so neither prints as a second total. Only a wait that starts before the night's cooking says how much earlier */
      const XT=ND.filter(d=>!d.ahead&&d.wait>=CAL_LONG&&d.wait<600).reduce((m,d)=>Math.max(m,d.active+d.wait-LD.lead),0);return [...PW,`Serves ${PLAN.guests}`,DIET.veg||dietAF()?[DIET.veg&&"vegetarian",dietAF()&&"alcohol-free"].filter(Boolean).join(", "):"",`${ds.length} dish${ds.length===1?"":"es"}`,`hands-on ${planDur(hands)}`,LD.lead?`longest on the night ${planDur(LD.lead)}`:"",waitMax&&!PW.length?(waitMax>=2880?`start ${Math.round(waitMax/1440)} days ahead`:waitMax>=600?"start the day before":XT>0?`start ${planDur(XT)} earlier, for waiting`:""):"",aheadN.length&&!PW.length?`make ahead: ${aheadN.length>1?aheadN.length+" dishes":aheadN[0]}`:""]})(PWN,calLead(prepNight(ds,TT)),prepNight(ds,TT)).filter(Boolean).map(x=>`<span class="pp-chip">${x.replace(/ /g,"&nbsp;")}</span>`).join(" ")}</p>${PWN.late?`<p class="pp-late" role="note">${ESC(PWN.late)}</p>`:""}
    <div class="pp-cols"><div class="pp-shop"><h3>Shopping list</h3>${shop||"<p>Tick at least one dish.</p>"}</div><div class="pp-method"><h3>How to make it</h3><ol>${steps}</ol></div></div>
    <div class="mc-cue"><b>Showtime cue</b><span>${ESC(dietCue(f,edition&&edition.cue||f.P))}</span></div>
  </div>`;
}
function planWire(f){
  const box=$("planner");if(!box)return;
  if(!f||!f._r2||!f._r2.dishes||!f._r2.dishes.length){box.hidden=true;box.dataset.has="";box.innerHTML="";return}
  planLoad(f);box.dataset.has="1";box.hidden=tab!=="prep";box.innerHTML=planHTML(f);
  const redo=()=>{planSave(f);box.querySelector(".pl-g").textContent=PLAN.guests;{const n=box.querySelector(".pl-sum");if(n)n.textContent=planCount(f._r2)}prep.innerHTML=prepHTML(f,current.menu);const b=prep.hidden;prep.hidden=false;fitPrep(prep);prep.hidden=b};
  box.onclick=e=>{/* review 18: the planner's own "Move to" for a too-late dish, as the calendar panel's */
    if(e.target.closest("[data-plmove]")){const L=planLate(f);if(L.plan){week.date=weekDateKey(L.plan.late.next);saveWeek();renderWeek();refreshPlan();
      $("status").textContent=`Movie night moved to ${calDay(L.plan.late.next)}: ${[...L.values()].join(", ")} back on the plan.`}return}
    const b=e.target.closest("[data-pl]");if(!b)return;PLAN.guests=Math.min(60,Math.max(1,PLAN.guests+(b.dataset.pl==="+"?1:-1)));redo();phoneRefresh()};
  const wireToggle=()=>{const dt=box.querySelector(".pl-pick");if(dt)dt.addEventListener("toggle",()=>{try{localStorage.setItem("mns-plan-open",dt.open?"1":"0")}catch(e){}})};wireToggle();
  box.onchange=e=>{const dk=e.target.dataset.diet;if(dk){DIET[dk]=e.target.checked;dietSave();try{setSync()}catch(_){}const op=box.querySelector(".pl-pick"),was=op&&op.open;box.innerHTML=planHTML(f);if(was){const o2=box.querySelector(".pl-pick");if(o2)o2.open=true}wireToggle();redo();if(f===current)dietRedraw(dk);return}
    const n=e.target.dataset.dish;if(n==null)return;const x=planAll(f).find(d=>(d.orig||d.n)===n);
    if(x&&(x.blocked||x.extra||x.spare)){if(e.target.checked)PLAN.on[n]=1;else delete PLAN.on[n]}else{if(e.target.checked)delete PLAN.off[n];else PLAN.off[n]=1}redo();phoneRefresh()};
}
/* long dish notes are cut back at a natural break so no format has to clip them mid-sentence */
function libTrim(t,max){t=String(t||"").trim();if(t.length<=max)return t;const cut=t.slice(0,max);let i=Math.max(cut.lastIndexOf(", "),cut.lastIndexOf("; "),cut.lastIndexOf(". "));if(i<max*0.45)i=cut.lastIndexOf(" ");return noDangle(t.slice(0,i).replace(/[,;:\s]+$/,""))+"."}
/* one photo rule for every library menu (owner, Oct 26): the poster is shown whole, never blurred into a smear, never under the title logo,
   and no photo appears twice. Runs after the format renders, so all 30 styles follow the same rule. */
function libPhotoPass(card,L,poster){
  const faces=[...card.querySelectorAll(".fx-face")];if(!faces.length)return;
  const fa=faces[0].getBoundingClientRect(),FA=fa.width*fa.height||1;
  const path=i=>((i.getAttribute("src")||"").match(/\/t\/p\/[^/]+(\/[^?#]+)/)||[])[1]||"";
  const imgs=[...card.querySelectorAll(".fx-face img")];
  const logoP=L.logo&&L.logo[0]||"";
  const area=e=>{const r=e.getBoundingClientRect();return r.width*r.height};
  const blurred=i=>/blur\(/.test(getComputedStyle(i).filter||"");
  const dark=(L.palette&&L.palette.dark)||"#14110f";
  /* 1. poster: hide blurred copies (fill their frame with the poster's own dark tone), show the main one whole */
  const pimgs=imgs.filter(i=>poster&&path(i)===poster);
  pimgs.filter(blurred).forEach(i=>{i.style.visibility="hidden";if(i.parentElement)i.parentElement.style.background=dark});
  const sharp=pimgs.filter(i=>!blurred(i)).sort((a,b)=>area(b)-area(a));
  const main=sharp[0];if(main){main.style.objectFit="contain";main.style.objectPosition="center"}
  /* 2. title logo laid over the poster: take the logo card off, the poster already carries the title */
  if(main&&logoP){const mr=main.getBoundingClientRect();
    imgs.filter(i=>path(i)===logoP).forEach(l=>{const r=l.getBoundingClientRect(),ix=Math.max(0,Math.min(r.right,mr.right)-Math.max(r.left,mr.left)),iy=Math.max(0,Math.min(r.bottom,mr.bottom)-Math.max(r.top,mr.top));
      if(ix*iy>r.width*r.height*0.25){let e=l;while(e.parentElement&&!e.parentElement.contains(main)&&area(e.parentElement)<FA*0.3)e=e.parentElement;e.style.visibility="hidden"}})}
  /* 3. no photo twice, and the poster never doubles as a scene photo: swap in an unused still, or leave that frame out */
  const used=new Set(),spare=(L.stills||[]).filter(x=>x!==poster);
  const shown=imgs.filter(i=>i.style.visibility!=="hidden"&&path(i)&&path(i)!==logoP&&i!==main&&!blurred(i));
  if(main)used.add(poster);
  shown.forEach(i=>{const k=path(i);if(!used.has(k)){used.add(k);return}
    const nx=spare.find(x=>!used.has(x));
    if(nx){used.add(nx);i.removeAttribute("srcset");i.src=TMDB_IMG+"w780"+nx}
    /* the frame goes, never the text around it (takeaway's third panel held the drinks and went with its photo tile: Screwed) */
    else{let e=i;while(e.parentElement&&area(e.parentElement)<FA*0.4&&e.parentElement.querySelectorAll("img").length===1&&!(e.parentElement.textContent||"").trim())e=e.parentElement;e.style.visibility="hidden"}});
  /* 4. a very thin frame (a window strip, a booth strip) shows only a sliver of a wide still, so a face there is always cut in half:
     give it an unused still with no faces in it (a place, not a person) */
  const foc=L.focus||{},faceless=spare.filter(x=>!foc[x]&&!used.has(x));
  shown.forEach(i=>{if(i.style.visibility==="hidden")return;const k=path(i);if(!foc[k])return;
    const bw=i.clientWidth,bh=i.clientHeight,a=foc[k][2]||1.778;if(!bw||!bh)return;
    const vis=Math.min(bw/Math.max(bw,bh*a),bh/Math.max(bh,bw/a));if(vis>=0.4)return;
    const nx=faceless.shift();if(!nx)return;used.add(nx);i.removeAttribute("srcset");i.src=TMDB_IMG+"w780"+nx});
  /* 5. a still swapped in above gets aimed at its faces too */
  libAim(card,L);
  /* 6. black and white films (flavour mono:true) print every photo and the poster in black and white; the Save PDF copy bakes the filter in */
  if(L.flavour&&L.flavour.mono)card.querySelectorAll(".fx-face img").forEach(i=>{const f=i.style.filter||"";if(!/grayscale\(1\)/.test(f))i.style.filter=(f&&f!=="none"?f+" ":"")+"grayscale(1)"});
  /* 7. iPhone and iPad Safari draw a CSS-filtered photo inside the scaled card as a blurry, zoomed-in corner (Josh's E.T. still, 8 Nov).
     There, every filtered photo is baked into a plain picture of its frame, the same way Save PDF does it, and the filter comes off. */
  if(IOS_SAFARI)iosBakeFilters(card);
}
const IOS_SAFARI=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
/* review 21: Josh still saw blurry, zoomed-in stills on his iPhone (Logan's strip and hero, 11 Nov). Two gaps in the 8 Nov fix:
   only filtered photos were baked, but iPhone Safari also draws an object-fit: cover photo inside the scaled card as a zoomed corner;
   and the copy for the canvas was fetched with CORS from a cache that may hold the plain (no CORS) copy, so it failed quietly and the
   photo kept its filter. Now every cropped photo is baked to its frame, the CORS copy is fetched fresh, and if that still fails the
   filter comes off, so the photo shows whole and sharp in plain colour rather than zoomed. */
let iosQ=Promise.resolve();
/* review 21: and a photo placed while the card is still settling can be painted from a stale, zoomed tile. A border nudge a moment later
   (an outline does not do it) makes Safari paint the photo again; the border is taken straight back off */
function iosRepaint(n){[200,900].forEach(ms=>setTimeout(()=>{if(!n.isConnected)return;n.style.border="0.5px solid transparent";requestAnimationFrame(()=>requestAnimationFrame(()=>{n.style.border=""}))},ms))}
function iosBakeFilters(card){
  card.querySelectorAll(".fx-face img").forEach(i=>{if(i._bsrc&&i._bsrc===i.src)return;
    const cs=getComputedStyle(i),filt=cs.filter&&cs.filter!=="none",crop=/cover|contain|none|scale-down/.test(cs.objectFit);if(!filt&&!crop)return;
    if(!i.complete||!i.naturalWidth){if(!i.dataset.bwait){i.dataset.bwait="1";i.addEventListener("load",()=>{delete i.dataset.bwait;iosBakeFilters(card)},{once:true})}return}
    /* review 21: the real cause of Role Models' zoomed strip. A layout's own trim (campfire's __fmtLift.trim, which crops black bars by sizing
       the photo up) ran after the bake, on the baked copy, read its pale vignette as bars and blew it up. So a photo waits for its trim to
       finish before it is baked, and the baked copy is marked trimmed and carries no onload, so the trim never runs on it */
    if(/__fmtLift/.test(i.getAttribute("onload")||"")&&i.dataset.trim!=="1"){setTimeout(()=>iosBakeFilters(card),500);return}
    const fw=i.offsetWidth||parseFloat(cs.width),fh=i.offsetHeight||parseFloat(cs.height);
    /* review 21: a face that is not laid out yet (the curtain is still shut after a spin) has no size; it is baked on the next layout, never skipped for good */
    if(!fw||!fh||!isFinite(fw)||!isFinite(fh))return;
    const big=fw*fh>2.5e6;if(big&&!filt)return;/* full-page textures are not cropped photos */
    /* review 21: baked at exactly the frame size. iPhone Safari sometimes paints a photo in a turned, scaled frame at its own natural size,
       ignoring the frame (the zoomed corner); a picture the same size as its frame looks right either way */
    const k=1,snap={filter:filt?cs.filter:"brightness(1)",width:fw*k+"px",height:fh*k+"px",objectFit:cs.objectFit,objectPosition:cs.objectPosition};/* twice the frame size for a sharp phone screen, unless that is a very big canvas */
    const src=i.currentSrc||i.src;if(!src||/^data:/.test(src))return;
    i._bsrc=i.src;i.dataset.baked="1";
    const give=()=>{if(filt)i.style.filter="none"};
    /* one at a time, so a menu's photos never hold several big canvases at once */
    iosQ=iosQ.then(()=>new Promise(done=>{const im=new Image();im.crossOrigin="anonymous";
      im.onload=()=>{try{const u=pdfFiltered(im,snap);if(!u)give();else{
        /* review 21: Safari kept painting the old, zoomed picture when the source changed in place inside a turned frame on the scaled card
           (Role Models' taped strip, seen in WebKit too). The baked picture goes into a fresh img that replaces the old one once it has decoded */
        const n=i.cloneNode(false);n.removeAttribute("srcset");n.removeAttribute("onload");n.removeAttribute("onerror");n.dataset.trim="1";n.style.filter="none";n.style.objectFit="fill";n.style.objectPosition="50% 50%";n.src=u;n._bsrc=n.src;
        const put=()=>{if(i.isConnected)i.replaceWith(n);iosRepaint(n)};(n.decode?n.decode().then(put,put):put())}}catch(e){give()}done()};
      im.onerror=()=>{give();done()};
      im.src=/^https?:/.test(src)&&!src.startsWith(location.origin)?src+(src.includes("?")?"&":"?")+"cors=1":src}))});
}
/* aim cropped scene photos at the faces in them, so a tight frame shows a face, not half of one.
   Runs straight after the faces are drawn, before any photo loads, so a format's own load-time trim takes the same aim */
/* audit, 7 Nov (Josh's call): the signed note on a shared menu is the character's real line only when the data says so (note.kind "quote").
   Every other note is something the character wrote: printed with no quote marks, and an "Overheard at the ..." heading reads "A note from the ..." */
/* the intermission cards print a signed note in quote marks, with "said", only when it is the character's real line (note.kind "quote") */
const kitQ=n=>n&&n.kind==="quote"?`"${ESC(n.text)}"`:ESC(n&&n.text);
const kitSaid=(n,verb)=>n.kind==="quote"?(verb==="said"?`"${ESC(n.text)}" said ${ESC(n.by)}.`:`"${ESC(n.text)}" ${ESC(n.by)} told this paper.`):`A note from ${ESC(n.by)}: ${ESC(n.text)}`;
function libNoteKind(h,fl){const n=fl&&fl.note;if(!n||!n.text||n.kind==="quote")return h;
  const e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const head=String(n.text).trim().slice(0,18),alt=[head,e(head),e(head).replace(/&quot;/g,'"'),head.replace(/'/g,"&#39;")].filter((v,i,A)=>A.indexOf(v)===i).map(rx).join("|");
  h=h.replace(new RegExp(`(["\u201c]|&quot;|&ldquo;|&#8220;)((?:${alt})[^<]*?)(["\u201d]|&quot;|&rdquo;|&#8221;)(?=\\s*(<|$))`,"g"),"$2");
  return h.replace(/>(\s*)Overheard at the ([a-z]+(?: [a-z]+)?)(\s*)</gi,(m,a,w,b)=>`>${a}A note from the ${w}${b}<`)}
function libAim(card,L){const foc=L&&L.focus;if(!foc)return;
  card.querySelectorAll(".fx-face img").forEach(i=>{if(i.dataset.trim==="1"&&i.dataset.aim)return;
    const m=(i.getAttribute("src")||"").match(/\/t\/p\/[^/]+(\/[^?#]+)/),f=m&&foc[m[1]];if(!f)return;
    const fit=getComputedStyle(i).objectFit;if(fit!=="cover"&&i.dataset.trim!=="1"&&!/onload/.test(i.outerHTML.slice(0,400)))return;
    const bw=i.clientWidth,bh=i.clientHeight,a=f[2]||1.778;if(!bw||!bh)return;
    const W=Math.max(bw,bh*a),H=Math.max(bh,bw/a),c=(v,n)=>Math.min(1,Math.max(0,v));
    const px=W-bw>1?c((f[0]*W-bw/2)/(W-bw)):.5,py=H-bh>1?c((f[1]*H-bh/2)/(H-bh)):.4;
    if(i.dataset.trim==="1")return;
    i.dataset.aim="1";i.style.objectPosition=(px*100).toFixed(1)+"% "+(py*100).toFixed(1)+"%"})}
/* after a format's own fitter: any clamped or ellipsis text that still hides words shrinks (to 14px at most) until it shows in full */
/* one-line boxes whose words run past the edge (subtitles, heading tags, stamp names): shrink the type in small steps,
   never under 65% of its size, so nothing reads "Curry before the clock hits MID". Works on every printed menu. */
/* kids' mode, alcohol-free, and family films: one dry pass over the finished card and phone menu, on every layout and hand-built menu alike.
   Whole drink names first, then single words; cooking phrases lose just the alcohol word; vinegars and root, ginger and butter beer are left alone. */
const dryNow=f=>dietAF()||DRY_THEMES.includes(f&&f.theme);
const KDRY=(()=>{const cap=(m,v)=>v&&/[A-Z]{2}/.test(m)&&m===m.toUpperCase()?v.toUpperCase():v&&/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v,W="beer|stout|ale|guinness|lager|red wine|white wine|wine|cider|bourbon|whisk(?:e)?y|rum|brandy|sherry|marsala|tequila|vodka|sake|champagne|port";
  const r=(re,v)=>[re,typeof v==="function"?v:m=>cap(m,v)];
  /* a proper name swapped mid-sentence goes lower case ("a nice grape juice", not "a nice Grape juice"); capitals and sentence starts stay */
  const capAt=v=>(m,...a)=>{const str=a[a.length-1],off=a[a.length-2];if(/[A-Z]{2}/.test(m)&&m===m.toUpperCase())return v.toUpperCase();return typeof off==="number"&&(off===0||/[.:!?·]\s*$/.test(str.slice(0,off)))?v[0].toUpperCase()+v.slice(1):v};
  /* review 27: "alcohol free lager" (no hyphen) dried to "alcohol free ginger beer" (Old School); shop counts of stubbies kept "4 ginger beer of 375 ml" (The Castle) */
  return [[/\b(alcohol free|non alcoholic)\b(?=\s+[a-z])/gi,m=>m.replace(" ","-")],[/\b(\d+) (stubbies|tinnies|longnecks)(?= of\b)/gi,(m,n)=>n+" bottles"],
   r(/[^.]*\bmust be (18|19|21)( or over)? to (order|drink)\b[^.]*\.?\s*/gi,""),r(/\b(18\+|over 18s?) only\.?\s*/gi,""),
   r(/\bbrandy alexanders?\b/gi,"vanilla nutmeg milk"),r(/\bhot buttered (rum|syrup|whisky|whiskey)\b/gi,"hot spiced apple"),r(/\bmulled wine\b/gi,"mulled grape punch"),
   r(/\b(brandy|bourbon|whisky|whiskey|rum) milk punch\b/gi,"vanilla milk punch"),r(/\birish coffee\b/gi,"Irish-style hot chocolate"),r(/\bmimosas?\b/gi,"orange fizz"),
   r(/\blime shandy\b/gi,"lime squash"),r(/\bshandy\b/gi,"lemon squash"),r(/\b(gin|vodka) and tonic\b/gi,"lime and tonic"),r(/\bmint juleps?\b/gi,"mint lemonade"),r(/\bold fashioneds?\b/gi,"orange and cherry soda"),
   r(/\bboilermakers?\b/gi,"ginger beer float"),r(/\bmargaritas\b/gi,"lime crushes"),r(/\bmargarita\b/gi,"lime crush"),r(/\bmojitos?\b/gi,"mint and lime fizz"),r(/\bmartinis?\b/gi,"mocktail"),r(/\bdaiquiris?\b/gi,"strawberry slushie"),
   r(/\bpi[nñ]a coladas?\b/gi,"pineapple colada"),r(/\bblue lagoons?\b(?! mocktail)/gi,"blue lagoon mocktail"),r(/\bsangria\b/gi,"fruit punch"),r(/\bspritz(es)?\b/gi,"soda spritz"),r(/\bnegronis?\b/gi,"blood orange soda"),
   [/\b(red wine|white wine|rice wine|sherry|cider|champagne|malt) vinegar\b/gi,m=>m.replace(/(wine|sherry|cider|champagne|malt)/i,w=>w[0]+"\u200B"+w.slice(1))],
   r(/\b(alcohol-free|non-alcoholic) (beer|lager|stout|ale)[- ]battered\b/gi,"crisp battered"),[new RegExp("\\b("+W+")[- ](battered)\\b","gi"),m=>cap(m,"crisp battered")],[new RegExp("\\b("+W+")[- ](braised|stewed)\\b","gi"),(m,a,b)=>cap(m,"slow-"+b.toLowerCase())],
   [new RegExp("\\b("+W+")[- ](glazed)\\b","gi"),m=>cap(m,"sticky glazed")],[new RegExp("\\b("+W+")[- ](jus|sauce|gravy|reduction|butter|glaze)\\b","gi"),(m,a,b)=>cap(m,"rich "+b.toLowerCase())],
   [new RegExp("\\b("+W+")[- ](marinated|poached|steamed|soaked|infused|spiked|cured)\\b","gi"),(m,a,b)=>cap(m,b.toLowerCase())],
   r(/(?<!(shrimp|prawn|seafood|crab|lobster|fruit) )\bcocktails?\b(?! (franks?|onions?|sauce|sausages?|frankfurts?|cups?|cherr(y|ies)|sticks?|dressing|blinis?))/gi,"mocktail"),
   /* review 24: an alcohol-free wine, beer or spirit is still a grown-up's drink, so a kids' card pours what a child drinks, the same drink the card names:
      sparkling apple juice, grape juice, ginger beer, cucumber or blood orange juice. Wine by name goes the same way as wine */
   r(/\b(alcohol-free|non-alcoholic) (sparkling (wine|ros[ée]|white|red)|champagne|prosecco|spumante|cava|bubbly|bubbles|sparkling)(?![\w\u00C0-\u024F])/gi,"sparkling apple juice"),r(/\b(alcohol-free|non-alcoholic) bellinis?\b|\bbellinis?\b(?! mocktail)/gi,"peach fizz"),
   r(/\b(alcohol-free|non-alcoholic) ((red|white) )?(wines?|ros[ée])(?![\w\u00C0-\u024F])/gi,"grape juice"),r(/\b(alcohol-free|non-alcoholic) gin\b/gi,"cucumber juice"),r(/\b(alcohol-free|non-alcoholic) ((spiced|dark|white|golden) )?rum\b/gi,"coconut water"),
   r(/\b(alcohol-free|non-alcoholic) ((bitter|red|orange) )*(aperitifs?|aperitivos?|amaro|bitters?)\b/gi,"blood orange juice"),r(/\b((bitter|red|orange) )*(aperitifs?|aperitivos?)\b/gi,"blood orange juice"),
   [/\b(Bordeaux|claret|Chianti|Merlot|Shiraz|Pinot (Noir|Grigio|Gris)|Chardonnay|Riesling|Sauvignon Blanc|Cabernet Sauvignon|Cabernet|Rioja|Lambrusco|Beaujolais|Chablis|Moscato|Montepulciano|Malbec|Zinfandel|grappa)\b(?! vinegar)/gi,capAt("grape juice")],
   r(/\b(anisette|sambuca|ouzo)\b/gi,"aniseed"),r(/\blimoncello\b/gi,"lemon syrup"),[/\bWhite Russians\b/gi,capAt("vanilla iced coffees")],[/\bWhite Russian\b/gi,capAt("vanilla iced coffee")],
   r(/\b(champagne|prosecco|sparkling wine|bubbly)\b/gi,"sparkling apple"),
   r(/\b(red |white |rosé |rose )?wines?\b(?! glass)/gi,"grape juice"),r(/\balcohol-free (beers?|lagers?|ales?) and lemonade\b/gi,"lemon squash"),r(/\balcohol-free (beer|lager|stout|ale) batter\b/gi,"soda water batter"),r(/\b(alcohol-free |ginger |root )?beer onions\b/gi,"sticky onions"),r(/\b(alcohol-free |non-alcoholic )?(beer|lager|ale) (cheddar |cheese )(sauce|dip)\b/gi,(m,a,b,c,d)=>cap(m,c+d)),r(/\b(alcohol-free|non-alcoholic) (beer|lager|ale) and (mustard|cheddar|cheese)\b/gi,(m,a,b,c)=>cap(m,c)),r(/\b(alcohol-free|non-alcoholic) (beer|lager|ale) cheese\b/gi,"cheese sauce"),
   r(/\b(cold |ice-cold |crisp )?(alcohol-free|non-alcoholic) ((pale|wheat|dark|English|Irish|craft) )?(beers?|lagers?|stouts?|ales?|pilsners?)\b(?! (and (cheese|cheddar|mustard|onions?)|or|sauce|gravy|glaze|marinade|cheese|cheddar|mustard)\b)/gi,"ginger beer"),r(/\b(?<!(root|ginger|butter|alcohol-free) )(beers?|ales?)\b/gi,"ginger beer"),r(/\b(?<!alcohol-free )(lagers?|stouts?|pilsners?|longnecks?|stubbies|tinnies|guinness)\b/gi,"ginger beer"),
   r(new RegExp("\\b(beside|with) (a |some )?(frozen |cold |ice-cold |chilled )?(shots? of )?("+W+"|absinthe|grog)s?\\b","gi"),(m,a)=>a.toLowerCase()+" a cold drink"),r(new RegExp("\\b(pour|serve|open|crack open|hand round) the ("+W+"|absinthe|grog)s?\\b","gi"),(m,a)=>cap(m,a.toLowerCase()+" the drinks")),r(new RegExp("\\ba (bottle|glass|shot|pint|jug|can|flask|round) of ("+W+"|absinthe|grog)\\b","gi"),(m,a)=>"a "+a.toLowerCase()+" of lemonade"),r(/\b(green )?absinthe\b/gi,"green cordial"),r(/\bgrog\b/gi,"fruit punch"),
   /* review 19: "Hot apple cider" read "Hot apple sparkling apple juice" (Home Alone 2): the apple is already named, and a hot one is not sparkling */
   r(/\b(hot|warm|warmed|mulled|spiced) (spiced )?apple ciders?\b/gi,(m,a)=>cap(m,a.toLowerCase()+" spiced apple juice")),r(/\b(hot|warm|mulled) (spiced )?ciders?\b/gi,(m,a)=>cap(m,a.toLowerCase()+" spiced apple juice")),r(/\b(apple|pear) ciders?\b/gi,(m,a)=>cap(m,"sparkling "+a.toLowerCase()+" juice")),
   /* review 20: a Bloody Mary keeps its name on a kids' card without the vodka (Get Shorty) */
   r(/\bBloody Marys?\b/gi,"Virgin Mary"),
   r(/\bciders?\b/gi,"sparkling apple juice"),
   /* review 12: hand-built drink names. A Manhattan is the drink only beside a cocktail, a cherry, a spirit or a price, never the island */
   ...[/\b(bourbon |rye |whisk(?:e)?y )?Manhattan (cock|mock)tails?\b/gi,/\bManhattans?(?=\s*\$?\d+\.\d\d\b)/g,/\b(bourbon|rye|whisk(?:e)?y) Manhattans?\b/gi,/\bManhattans?(?= with a cherry)/g,/^\s*Manhattans?\s*$/g].map(re=>[re,(m,...a)=>{const str=a[a.length-1],off=a[a.length-2],v=typeof off==="number"&&(off===0||/[.:!?]\s*$/.test(str.slice(0,off)))?"Cherry cola":"cherry cola";return /[A-Z]{2}/.test(m)&&m===m.toUpperCase()?v.toUpperCase():v}]),
   r(/\balcohol-free (beers?|lagers?|ales?) and lemonade\b/gi,"lemon squash"),r(/\bhighballs?\b/gi,"cooler"),
   /* review 13: a Gibson is a gin cocktail by name, even when the glass holds verjuice (North by Northwest) */r(/\b([Vv]erjuice )?Gibson(?= with (a )?cocktail onion)/g,(m,v)=>v?v+"sour":"Cucumber sour"),r(/\bbar tabs?\b/gi,"snack tab"),
   r(/\b(canadian )?(rye )?(whisk(e)?y)\b|\bbourbon\b|\bscotch\b(?! (eggs?|bonnets?|broth|fillets?|finger|pancakes?|pies?|mist|tape))/gi,"butterscotch"),
   /* rye on its own is the spirit unless it is the bread: on rye, dark rye, rye crackers and the like stay */
   r(/(?<!\b(on|dark|light|buttered|toasted|seeded|black|marble|of|sliced?|slices|pumpernickel|caraway|thin|deli|Swiss) )\brye\b(?! (bread|loaf|loaves|crackers?|squares?|toast|batter|flour|crisp(s|bread)?|slices?|into|rounds?|sourdough|bagels?|rolls?|buns?|croutons?|crumbs?|grains?|berries|and swiss))/gi,"ginger"),r(/\brum\b/gi,"coconut"),r(/\bgin\b/gi,"cucumber"),
   r(/\b(vodka|tequila|mezcal)\b/gi,"lime"),r(/\b(brandy|cognac)\b/gi,"vanilla"),r(/\b(liqueurs?|schnapps|amaretto|kahlua|baileys)\b/gi,"syrup"),r(/\bsweet vermouth and (a dash of )?bitters\b/gi,"cherry syrup and orange"),r(/(?<!lime and |lime & )\b(a dash of |dashes of )?(angostura |orange )?bitters\b/gi,"orange zest"),r(/\bvermouth\b/gi,"bitter orange"),r(/(?<!\b(goodness|heaven|pete|god|christ|old times)(['’]s?|s['’])? |\bthe )\bsake\b/gi,"yuzu soda"),
   r(/\b(port|sherry|marsala)\b(?= (and|or|,|glass|wine|by the|\.))/gi,"grape juice"),
   /* review 27: a drink swapped for a child's drink is no longer just for the grown-ups ("cucumber juice, for the grown-ups", Fantastic Beasts) */
   [/\b(cucumber juice|grape juice|sparkling apple juice|ginger beer|coconut water|blood orange juice), for the grown-ups\b/gi,(m,a)=>a]]})();
/* the layouts' own family swaps run first and can over-reach ("for goodness' syrup", "root root beer", "mocktail franks"): these put the phrase back,
   before and after the shared pass, and run on every card since a layout dries PG films too */
const KFIX=(()=>{const cap=(m,v)=>/^[A-Z]/.test(m)?v[0].toUpperCase()+v.slice(1):v;
  return [[/\b(goodness|heaven|pete|god|christ)((['’]s?|s['’])?) (syrup|yuzu soda)\b/gi,(m,a,b)=>a+b+" sake"],
   [/\bmocktail (franks?|frankfurts?|sausages?|cherr(y|ies)|onions?|sauce|sticks?|dressing|blinis?)\b/gi,(m,a)=>cap(m,"cocktail "+a)],[/\b(prawn|shrimp|seafood|crab|lobster|fruit) mocktails?\b/gi,m=>m.replace(/mock(?=tail)/i,w=>/^M/.test(w)?"Cock":"cock")],
   [/\bgrape juice (glass(es)?)\b/gi,(m,a)=>cap(m,"wine "+a)],
   /* It's a Wonderful Life: the housewarming is for the Martini family, and the martini swap turned them into "Mocktail' new house" */
   [/\bmocktail(?=['\u2019] new house)/gi,()=>"Martinis"],
   /* review 15: "with Marsala wine" went through two swaps and read "with a cold drink grape juice" (The Godfather, Vegetarian with No alcohol) */
   [/\ba cold drink (grape juice)\b/gi,(m,a)=>a],
   [/\b(root|ginger|butter) (root|ginger) beer\b/gi,(m,a)=>a+" beer"],
   /* review 24: two swaps that land on the same drink read once ("anisette or sambuca", a shandy of lager topped with ginger beer,
      Shaun of the Dead's "Chill the ale and lager", Lethal Weapon 2's "Pour in the lager, top with ginger beer"), and take "a" (Rocky V's "An ice-cold lager") */
   [/\b(aniseed|grape juice|ginger beer|sparkling apple juice) (?:or|and) \1\b/gi,(m,a)=>a],[/\b(ginger beer),? (?:topped|mixed|top) with (?:cold |chilled )?ginger beer\b/gi,(m,a)=>a],
   [/\b([Aa])n (?=(ginger beer|grape juice|sparkling apple juice|blood orange juice|cucumber juice)\b)/g,(m,a)=>a+" "],
   /* review 21: a recipe that offers root beer beside the beer read "Pour the root beer, or the root beer for anyone who prefers it" once the beer was swapped (Shaun of the Dead) */
   [/\b((?:[A-Z][a-z]+ )?(?:root|ginger) beer),? or (?:the )?(?:root|ginger) beer(?: for anyone who prefers it)?,?/g,(m,a)=>a],
   /* review 21: the town keeps its name, but a dish named for it keeps no whiskey on a kids' card (Unforgiven) */
   [/\bBig (?:Butterscotch|Whiskey) bread pudding\b/gi,m=>cap(m,"saloon bread pudding")],[/\balcohol-free (root|ginger) beer\b/gi,m=>cap(m,"alcohol-free beer")],
   [/\b(mocktail|syrup|grape juice|sparkling apple|root beer|ginger beer|rich|soda|sticky|crisp|slow-braised|slow-stewed|butterscotch|coconut|cucumber|lime|vanilla|fizz|punch|lemonade|juice)( \1)+\b/gi,(m,a)=>a]]})();
/* any word a swap doubles ("lemon shandy" to "lemon lemon squash", "strawberry daiquiri slushie") folds to one; doubles the film wrote itself (huli huli, Nai Nai) stay */
const dryFold=(out,src)=>{const had=new Set([...src.matchAll(/\b([\p{L}']+)( \1)+\b/giu)].map(m=>m[0].toLowerCase()));let x=out,prev;do{prev=x;x=x.replace(/\b([\p{L}']+)((?: \1)+)\b/giu,(m,a)=>had.has(m.toLowerCase())?m:(m.split(' ').find(w=>new RegExp('\\b'+w+'\\b','u').test(src))||a))}while(x!==prev);return x};
/* review 20: places keep their names in kids' mode ("Big Whiskey, Wyoming", "Greely's Beer Garden" on Unforgiven): a town or a named venue
   is held aside while the word pass runs */
const KKEEP=/\bBig Whiskey\b(?! bread pudding)|\bBIG WHISKEY\b|\b[A-Z][A-Za-z]+['’][sS] (?:Beer|Whiskey|Rum|Wine|Gin|BEER|WHISKEY|RUM|WINE|GIN) (?:Garden|Hall|House|Saloon|Cellar|Room|GARDEN|HALL|HOUSE|SALOON|CELLAR|ROOM)\b/g;
const dryKeep=(t,fn)=>{const kept=[];const m=String(t).replace(KKEEP,x=>{kept.push(x);return `\uE000${kept.length-1}\uE001`});return kept.length?fn(m).replace(/\uE000(\d+)\uE001/g,(x,i)=>kept[+i]):fn(t)};
/* the zero-width space that guards malt vinegar and the like during the swaps never reaches the page (Cruella) */
const dryText=(t,on)=>dryText0(t,on).replace(/\u200B/g,"");
const dryText0=(t,on)=>{const v=KFIX.reduce((a,[re,to])=>a.replace(re,to),t);return on?dryKeep(v,u=>dryFold(KFIX.reduce((a,[re,to])=>a.replace(re,to),KDRY.reduce((a,[re,to])=>a.replace(re,to),u)),u)):v};
/* review 27: two lines that dry to the same drink ("1 L ginger beer" from the ale and again from the lager, Shaun of the Dead) read once, amounts added.
   Takes [raw, shown] pairs; returns {x, text, of} with x the first raw line and of every raw line folded into it */
const dryKeyOf=s=>{const m=String(s).replace(/^\[ \] /,"").match(/^(\d+(?:\.\d+)?)\s?(ml|l|L|g|kg)?\s+(.+)$/);return m?(m[2]||"").toLowerCase()+"|"+m[3]:"="+s};
/* only lines that drying made the same fold: two lines that were already the same item stay as they are (Ghost's two honey lines) */
const dryJoin=ps=>{const out=[],at=new Map();for(const [x,s] of ps){const m=String(s).match(/^(\d+(?:\.\d+)?)\s?(ml|l|L|g|kg)?\s+(.+)$/),key=m?(m[2]||"").toLowerCase()+"|"+m[3]:"="+s,rk=dryKeyOf(x),p=at.get(key);
  if(p&&(!m||p.m)&&!p.rk.has(rk)){p.of.push(x);p.rk.add(rk);if(m)p.q+=+m[1];continue}if(p){out.push({x,s,m,q:0,of:[x],rk:new Set([rk])});continue}const e={x,s,m,q:m?+m[1]:0,of:[x],rk:new Set([rk])};at.set(key,e);out.push(e)}
  /* the sum rolls 1000ml up to litres and 1000g up to kilos, the way the rest of the list writes them */
  return out.map(e=>{if(e.of.length<2||!e.m)return {x:e.x,of:e.of,text:e.s};let q=e.q,u=e.m[2]||"";if(/^ml$/i.test(u)&&q>=1000){q=q/1000;u="L"}else if(u==="g"&&q>=1000){q=q/1000;u="kg"}
    return {x:e.x,of:e.of,text:e.s.replace(/^\d+(?:\.\d+)?\s?(ml|l|L|g|kg)?/,String(Math.round(q*100)/100)+(u?(/^l$/i.test(u)?" L":u):""))}})};
function kidsDryDom(root,f){if(!root)return;const on=dryNow(f||current);const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const todo=[];
  /* a name can arrive split across text nodes ("Caribbean cruise prawn" + "cocktail"): each node is read with the end of the one before and the start of the one after, and only its own part is kept */
  const nodes=[];while(n=tw.nextNode()){const p=n.parentElement;if(!p||/^(SCRIPT|STYLE)$/.test(p.tagName))continue;nodes.push(n)}
  nodes.forEach((n,i)=>{const t=n.nodeValue;if(!/[a-z]/i.test(t))return;const pv=i?nodes[i-1].nodeValue.slice(-24):"",nx=i<nodes.length-1?nodes[i+1].nodeValue.slice(0,24):"",gl=(a,b)=>a&&b&&!/\s$/.test(a)&&!/^\s/.test(b)?" ":"";
    const pre=pv+gl(pv,t),post=gl(t,nx)+nx,all=dryText(pre+t+post,on);let v=dryText(t,on);
    if(all.startsWith(dryText(pre,on)===pre?pre:"\u0000")&&all.endsWith(post)&&all.length>=pre.length+post.length)v=all.slice(pre.length,all.length-post.length||undefined);
    if(v!==t)todo.push([n,v])});
  for(const [n,v] of todo)n.nodeValue=v}
function fitLines(card){fitLines0(card);try{descRoom(card)}catch(e){}}
/* review 18: a box that hides its overflow and sets its lines tight cuts the tails of g, j, p, q and y (Nightmare 3's badge "Hospital", diner
   kickers, "Biker bar pickled eggs") or a tall accent (piña colada). Where only the letters spill (no whole line is hidden), the box gets that much room,
   taken back with a negative margin so nothing else on the card moves. Worked out from the box's own starting padding every time. */
let descCx=null;
function descRoom(card){const k=card.getBoundingClientRect().width/(card.offsetWidth||1)||1;descCx=descCx||document.createElement("canvas").getContext("2d");
  for(const e of card.querySelectorAll(".fx-face *")){
    if(e.dataset.dsc){const o=JSON.parse(e.dataset.dsc);Object.assign(e.style,o);delete e.dataset.dsc}
    const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join("").trim();if(own.length<2)continue;
    const cs=getComputedStyle(e);if(!/hidden|clip/.test(cs.overflow+cs.overflowY)||cs.display==="none"||cs.visibility==="hidden")continue;
    const rs=[];for(const n of e.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);rs.push(...[...rg.getClientRects()].filter(r=>r.width>1&&r.height>1))}if(!rs.length)continue;
    const tt=cs.textTransform==="uppercase"?own.toUpperCase():own;descCx.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;const m=descCx.measureText(tt),fa=m.fontBoundingBoxAscent,fd=m.fontBoundingBoxDescent,fh=fa+fd;
    const last=rs.reduce((a,r)=>r.bottom>a.bottom?r:a),first=rs.reduce((a,r)=>r.top<a.top?r:a),padL=(last.height-fh*k)/2,padF=(first.height-fh*k)/2;
    const inkB=last.bottom-padL-(fd-m.actualBoundingBoxDescent)*k,inkT=first.top+padF+(fa-m.actualBoundingBoxAscent)*k;
    const box=e.getBoundingClientRect(),fz=parseFloat(cs.fontSize),cutB=(inkB-(box.bottom-(parseFloat(cs.borderBottomWidth)||0)*k))/k,cutT=((box.top+(parseFloat(cs.borderTopWidth)||0)*k)-inkT)/k;
    /* a single line set nowrap can also lose a swash on its right (Great Vibes' "r" in Mad Hatter): the ink's right edge from the measure */
    const one=/^(nowrap|pre)/.test(cs.whiteSpace)&&rs.length===1&&cs.textAlign!=="right"&&cs.textAlign!=="end",cutR=one?((rs[0].left+m.actualBoundingBoxRight*k)-(box.right-(parseFloat(cs.borderRightWidth)||0)*k-(parseFloat(cs.paddingRight)||0)*k))/k:0;
    const addR=cutR>.5&&cutR<=fz*.3&&e.scrollWidth<=e.clientWidth+1?Math.ceil(cutR)+1:0;
    const addB=cutB>.5&&cutB<=fz*.4?Math.ceil(cutB)+1:0,addT=cutT>.5&&cutT<=fz*.4?Math.ceil(cutT)+1:0;if(!addB&&!addT&&!addR)continue;
    /* a whole hidden line (a real clamp or fit) is left alone: only the letters' spill is let out */
    {const lh=parseFloat(cs.lineHeight)||fz*1.2;if(!/^(nowrap|pre)/.test(cs.whiteSpace)&&e.scrollHeight-e.clientHeight-addB-addT>lh*.6)continue}
    e.dataset.dsc=JSON.stringify({paddingBottom:e.style.paddingBottom,marginBottom:e.style.marginBottom,paddingTop:e.style.paddingTop,marginTop:e.style.marginTop,height:e.style.height,paddingRight:e.style.paddingRight,marginRight:e.style.marginRight});
    if(addR){e.style.paddingRight=((parseFloat(cs.paddingRight)||0)+addR)+"px";e.style.marginRight=((parseFloat(cs.marginRight)||0)-addR)+"px"}
    if(addB){e.style.paddingBottom=((parseFloat(cs.paddingBottom)||0)+addB)+"px";e.style.marginBottom=((parseFloat(cs.marginBottom)||0)-addB)+"px"}
    if(addT){e.style.paddingTop=((parseFloat(cs.paddingTop)||0)+addT)+"px";e.style.marginTop=((parseFloat(cs.marginTop)||0)-addT)+"px"}
    if(cs.boxSizing==="border-box"&&e.style.height&&/px$/.test(e.style.height))e.style.height=(parseFloat(e.style.height)+addB+addT)+"px"}}
function fitLines0(card){try{kidsDryDom(card)}catch(e){}
  const els=[...card.querySelectorAll("*")].filter(e=>{if(!e.firstChild||!e.offsetWidth)return false;const cs=getComputedStyle(e);
    if(!/^(nowrap|pre)/.test(cs.whiteSpace)&&cs.textOverflow!=="ellipsis")return false;if(cs.overflow==="visible"&&cs.overflowX==="visible")return false;
    if(cs.webkitLineClamp&&cs.webkitLineClamp!=="none")return false;return (e.scrollWidth>e.clientWidth+1||e.dataset.fl0)&&e.textContent.trim().length>1});
  /* review 18: the base size is taken again when a layout's own fit pass has changed the type since this pass last set it. Before, the first
     size seen stuck: on a second film in the same visit the placemat fit had not run yet, so every later pass put its dishes back to full size
     and the last drink was cut off (Jingle All the Way, The Incredibles) */
  for(const e of els){const sized=[e,...e.querySelectorAll("*")].filter(x=>x.textContent.trim());
    const base=sized.map(x=>{const now=x.style.fontSize;if(x.dataset.fl0&&x.dataset.flset!==undefined&&now!==x.dataset.flset)delete x.dataset.fl0;return +(x.dataset.fl0||(x.dataset.fl0=parseFloat(getComputedStyle(x).fontSize)||0))});
    const put=(x,v)=>{x.style.fontSize=v;x.dataset.flset=x.style.fontSize};
    sized.forEach((x,i)=>{if(base[i])put(x,base[i]+"px")});for(let k=.97;k>=.65&&e.scrollWidth>e.clientWidth+1;k-=.03)sized.forEach((x,i)=>{if(base[i])put(x,(base[i]*k).toFixed(2)+"px")});
    /* a decorative tag (data-opt) that still will not fit steps aside rather than show half a word */
    if(e.hasAttribute("data-opt")&&e.scrollWidth>e.clientWidth+1)e.style.visibility="hidden"}
  /* review 19: a flex row whose one-line dish name pushes the price past the row's edge (Pulp Fiction's "Mamie's devilled eggs ... 2.95"):
     the name's type steps down, never under 65%, until the row fits. Rows that fit are not touched */
  card.querySelectorAll("*").forEach(r=>{if(!r.offsetWidth||r.children.length<2)return;const rc=getComputedStyle(r);if(!/flex/.test(rc.display)||/column/.test(rc.flexDirection)||rc.flexWrap!=="nowrap")return;
    const nm=[...r.children].find(c=>c.textContent.trim().length>2&&/^(nowrap|pre)/.test(getComputedStyle(c).whiteSpace));if(!nm)return;
    const edge=()=>{const q=r.getBoundingClientRect(),k=q.width/(r.offsetWidth||1)||1;return Math.max(...[...r.children].map(c=>c.getBoundingClientRect().right))-(q.right-(parseFloat(rc.paddingRight)+parseFloat(rc.borderRightWidth))*k)};
    if(edge()<=1)return;const base=+(nm.dataset.fr0||(nm.dataset.fr0=parseFloat(getComputedStyle(nm).fontSize)));for(let k=.97;k>=.65&&edge()>1;k-=.03)nm.style.fontSize=(base*k).toFixed(2)+"px"});
  /* decorative tags pushed past their row's edge by a layout's own sizing step aside too */
  card.querySelectorAll("[data-opt]").forEach(e=>{const p=e.parentElement;if(!p||!e.offsetWidth)return;const r=e.getBoundingClientRect(),pr=p.getBoundingClientRect();
    e.style.visibility=(e.scrollWidth>e.clientWidth+1||r.right>pr.right+1)?"hidden":""})
}
/* fold-out menus (tiki): a dish row sitting on a crease is nudged just below it, so nothing folds in half.
   Measured in the menu's own units (offsetTop), so it works on the scaled preview too. If that runs the
   block out of room, its type steps down a little, never under each line's own minimum, and no dish is dropped. */
function foldClear(card){
  if(!card.classList.contains("lib-tiki"))return;
  const topIn=(el,root)=>{let y=0;for(let e=el;e&&e!==root;e=e.offsetParent)y+=e.offsetTop;return y};
  card.querySelectorAll(".fx-face").forEach(face=>{const H=face.offsetHeight,creases=[H/3,2*H/3];
    face.querySelectorAll("[data-box]").forEach(box=>{if(box.offsetHeight<200)return;const bt=topIn(box,face);
      if(!creases.some(c=>c>bt&&c<bt+box.offsetHeight))return;
      const rows=[...box.children].flatMap(c=>[c,...c.children]).filter(e=>e.offsetHeight&&e.offsetHeight<120);
      const fsEls=[...box.querySelectorAll("[data-fs]")],base=fsEls.map(e=>+(e.dataset.fc0||(e.dataset.fc0=parseFloat(getComputedStyle(e).fontSize))));
      fsEls.forEach((e,i)=>e.style.fontSize=base[i]+"px");
      const push=()=>{rows.forEach(r=>{if(r.dataset.mt0==null)r.dataset.mt0=r.style.marginTop||"";r.style.marginTop=r.dataset.mt0});
        for(const c of creases){const r=rows.filter(r=>r.offsetHeight<80).find(r=>{const t=topIn(r,face);return t<c-2&&t+r.offsetHeight>c+2})||rows.find(r=>{const t=topIn(r,face);return t<c-2&&t+r.offsetHeight>c+2});
          if(r)r.style.marginTop=((parseFloat(getComputedStyle(r).marginTop)||0)+(c-topIn(r,face))+8)+"px"}};
      for(let step=0;step<16;step++){push();if(box.scrollHeight<=box.clientHeight+1)break;
        fsEls.forEach((e,i)=>{const min=+e.dataset.min||14;e.style.fontSize=Math.max(min,base[i]*(1-.025*(step+1)))+"px"})}
      push();
      /* review 18: still over after the type has stepped down (The Jungle Book's last note sat under the box edge): notes are shortened at a break,
         from the bottom, and the rows pushed again; a note is never hidden here */
      {const over=()=>box.scrollHeight>box.clientHeight+1;
        /* first the island map above gives up more height, 16px at a time, as the tiki fit does (data-t0, data-h0 from its own pass) */
        if(over()&&box.hasAttribute("data-menu")){const map=face.querySelector("[data-map]"),mn=face.querySelector("[data-main]"),sh=[...face.querySelectorAll("[data-mshift]")];
          if(map&&mn&&box.dataset.t0!=null){let c=+box.dataset.h0?(parseFloat(box.style.height)-(+box.dataset.h0)):0;
            for(c+=16;over()&&c<=200;c+=16){map.style.height=(+map.dataset.h0-c)+"px";mn.style.height=(+mn.dataset.h0-c)+"px";sh.forEach(e=>e.style.top=(+e.dataset.t0-c)+"px");box.style.top=(+box.dataset.t0-c)+"px";box.style.height=(+box.dataset.h0+c)+"px";push()}}}
        if(over()&&window.__fmtShort){const ns=[...box.querySelectorAll("[data-note]")].filter(n=>!n.children.length&&n.style.display!=="none");
        for(let i=ns.length-1;i>=0&&over();i--){const n=ns[i],full=n.dataset.full||(n.dataset.full=n.textContent);const ok=window.__fmtShort(full,c=>{n.textContent=c;push();return !over()});n.textContent=ok||full;push()}}}
      /* nothing a layout marked to drop stays hidden because of this pass */
      box.querySelectorAll("[data-drop]").forEach(d=>{if(d.style.display==="none"&&box.scrollHeight<=box.clientHeight+1)d.style.display=""})})});
}
/* review 15: shorten a note at a natural break before a fit pass gives up on it, so "Garlic rosemary lamb shoulder roasted 5 hours until it pulls apart"
   reads "Garlic rosemary lamb shoulder roasted 5 hours" instead of vanishing. Breaks: sentences, then commas, then joining words; never under three words */
window.__fmtShort=(t,fits)=>{t=String(t||"").trim();const end=/[.!?]$/.test(t)?".":"",body=t.replace(/[.!?]+$/,""),cands=[];
  const sent=t.match(/[^.!?]+[.!?]+/g);if(sent&&sent.length>1)for(let k=sent.length-1;k>=1;k--)cands.push(sent.slice(0,k).join("").trim());
  const rx=/,\s+|\s+(?:with|and|over|in|on|under|topped with|served|until|for|from|plus|then|or)\s+/gi;let m;const cuts=[];while((m=rx.exec(body)))cuts.push(m.index);
  /* a cut that ends on a verb or a joining word reads unfinished ("Choux puffs filled.", "Lemon jelly set."), so those are skipped */
  for(let k=cuts.length-1;k>=0;k--){const c=body.slice(0,cuts[k]).trim(),lw=(c.match(/(\S+)$/)||["",""])[1].toLowerCase();
    if(c.split(/\s+/).length>=3&&!/(ed|ing)$/.test(lw)&&!/^(set|made|done|cut|and|or|with|of|a|the|its|their|to|for|in|on|at|by|from)$/.test(lw))cands.push(c+end)}
  /* 11 Nov: never cut inside a quote (The Goonies printed: Sloth: "Ruth, Ruth) */
  const open=c=>(c.match(/"/g)||[]).length%2===1||(c.match(/\u201c/g)||[]).length!==(c.match(/\u201d/g)||[]).length;
  for(const c of cands)if(!open(c)&&fits(c))return c;return null};
/* notes from the bottom: each is first shortened at a break, and only hidden if even that will not fit. The full text is kept to put back on a refit */
window.__fmtTrim=(ns,over)=>{for(let i=ns.length-1;i>=0&&over();i--){const n=ns[i];if(n.children.length||n.style.display==="none")continue;const full=n.dataset.full||(n.dataset.full=n.textContent);
    /* 11 Nov: a cut that does not fit is only kept when it frees a line; one that leaves the note the same height goes back to the full text */
    n.textContent=full;const h0=n.offsetHeight;let last=null;const ok=window.__fmtShort(full,c=>{n.textContent=c;last=c;return !over()});n.textContent=ok||last||full;if(ok)return;
    if(last&&n.offsetHeight>=h0)n.textContent=full}
  for(let i=ns.length-1;i>=0&&over();i--)ns[i].style.display="none"};
window.__fmtTrimReset=root=>{if(root)root.querySelectorAll("[data-full]").forEach(n=>{n.textContent=n.dataset.full})};
function libUnclip(card,done){if(done)card.dataset.unclip="1";card.querySelectorAll(".fx-face *").forEach(e=>{const cs=getComputedStyle(e);if(!((cs.webkitLineClamp&&cs.webkitLineClamp!=="none")||cs.textOverflow==="ellipsis"))return;const hid=()=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2;if(!hid())return;
  let fs=parseFloat(cs.fontSize),lh=parseFloat(cs.lineHeight)||fs*1.2;
  /* tall display faces: the glyphs poke past a tight line box, so open the line a little */
  const one=cs.whiteSpace==="nowrap"||cs.webkitLineClamp==="1";if(e.scrollWidth<=e.clientWidth+2&&e.scrollHeight-e.clientHeight<lh*0.6){while(hid()&&lh<fs*(one?2:1.4)){lh+=1;e.style.lineHeight=lh+"px"}}
  /* wide tracking on one line: tighten the letter spacing first */
  const ls=parseFloat(cs.letterSpacing)||0;if(hid()&&ls>fs*0.03){let l=ls;while(hid()&&l>fs*0.02){l-=0.5;e.style.letterSpacing=l+"px"}}
  /* then shrink the type, never under 14px */
  const lo=Math.max(14,Math.floor(fs*0.72));while(hid()&&fs>lo){fs-=1;e.style.fontSize=fs+"px";if(e.style.lineHeight)e.style.lineHeight=Math.round(lh*fs/parseFloat(cs.fontSize))+"px"}
  /* one-line labels a few pixels over: close the word gaps, then let it wrap to a second line */
  if(hid()&&cs.whiteSpace==="nowrap"){let ws=0;while(hid()&&ws>-3){ws-=0.5;e.style.wordSpacing=ws+"px"}if(hid()){e.style.whiteSpace="normal";e.style.textOverflow="clip"}}
  /* review 14: a dish name never hides (Night at the Museum lost one here): it wraps onto as many lines as it needs */
  const sib=e.parentElement?[...e.parentElement.children].filter(c=>c!==e):[];
  if(hid()&&sib.some(c=>/^\s*[$£€¢]?\d{0,3}[.,]?\d{1,2}\s*(¢|c|cr|crowns?|silver|gold|[sd])?\s*$/i.test(c.textContent)&&c.textContent.trim().length<12)){e.style.webkitLineClamp="unset";e.style.display="block";e.style.overflow="visible";return}
  /* a dish note gets one more line before anything is hidden, as long as its box still holds everything */
  if(hid()&&e.children.length===0&&+cs.webkitLineClamp>=1){let box=e.parentElement;while(box&&box!==card&&getComputedStyle(box).overflow==="visible")box=box.parentElement;
    const was=e.style.webkitLineClamp,n=+(e.dataset.cl0||(e.dataset.cl0=cs.webkitLineClamp));e.style.webkitLineClamp=String(n+1);
    if(!hid()&&box&&box.scrollHeight<=box.clientHeight+1)return;e.style.webkitLineClamp=was}
  /* last resort for plain fine print: drop whole sentences; if it still cannot fit, hide the line rather than show half a description */
  if(hid()&&e.children.length===0&&(+cs.webkitLineClamp>=2||(+cs.webkitLineClamp===1&&fs<=20))){let t=e.textContent.trim();const sent=t.match(/[^.!?]+[.!?]+/g);while(hid()&&sent&&sent.length>1){sent.pop();e.textContent=sent.join("").trim()}
    /* still over: drop list items off the end at the commas, so it reads "Hummus and eggplant dip, flatbread." not "olives,..." */
    /* but never down to a stub like "Lamb.": keep at least four words, otherwise let the two-line clamp end it with an ellipsis */
    if(hid()){const full=e.textContent,parts=full.trim().replace(/[.!?]+$/,"").split(/,\s+/);while(hid()&&parts.length>1){const next=parts.slice(0,-1).join(", ");if(next.split(/\s+/).length<4)break;parts.pop();e.textContent=next+"."}
      /* review 15: then at joining words ("with", "and", "until"), so a note is shortened before it is hidden */
      if(hid()&&window.__fmtShort){const s2=window.__fmtShort(full,c=>{e.textContent=c;return !hid()});e.textContent=s2||e.textContent;if(!s2&&hid())e.textContent=full}
      if(hid()&&e.textContent.split(/\s+/).length<4){e.textContent=full;e.style.textOverflow="ellipsis";e.dataset.keep="1"}}
    if(hid()&&!e.dataset.keep)e.style.display="none";}
 })}
function libMenu(menu){const m=Object.assign({},menu);for(const c of ["s","m","w","d"])if(Array.isArray(menu[c]))m[c]=menu[c].map(it=>Object.assign({},it,{note:degC(libTrim(it.note,100))}));return m}
/* menu format library: one script per printed-menu format, fetched the first time a film needs it */
const _libLoads={};
function libLoad(k){
  if(window.MENU_FORMATS&&window.MENU_FORMATS[k])return Promise.resolve(true);
  window.MENU_FORMATS=window.MENU_FORMATS||{};
  return _libLoads[k]||(_libLoads[k]=new Promise(ok=>{
    const s=document.createElement("script");s.src="menu-formats/"+k+".js?v="+(window.LIB_VER&&LIB_VER[k]||"1");
    s.onload=()=>ok(!!window.MENU_FORMATS[k]);s.onerror=()=>{delete _libLoads[k];ok(false)};document.head.appendChild(s);
  }));
}
/* a venue menu shows the whole board: tonight's five to cook, the film's other dishes, and two house lines
   written for that film's own venue (data/film-house.json). A house line that has meat or alcohol stays off
   when Vegetarian or No alcohol is on. The prep sheet still cooks only the five (planAll reads the recipe list, not this). */
/* 13 Nov: what keeps a film's printed dish off a diet card. Deli meats and fish count, and so does what the recipes count (gelatine, jelly, marshmallow,
   Worcestershire); ginger beer, root beer, prawn cocktail, apple cider (juice), cooking vinegars and anything the text calls alcohol-free do not */
const DIET_MEAT=/\b(beef|steaks?|pork|ham|bacon|chicken|turkey|lamb|veal|sausages?|meatballs?|meat|meats|brisket|salami|prosciutto|pepperoni|chorizo|pastrami|duck|venison|fish(?! crackers?)|tuna|salmon|anchov(y|ies)|prawns?|shrimp|lobsters?|crabs?(?! key)|oysters?|clams?|mussels?|squid|calamari|ribs?|rib eyes?|burgers?|hot ?dogs?|jerky|gelatine?|lard|suet|worcestershire|frankfurts?|frankfurters?|wieners?|weiners?|corn ?dogs?|pretzel dogs?|pigs in blankets|bratwursts?|kielbasa|bologna|cabana|cold cuts|bresaola|pancetta|guanciale|mortadella|capicola|lingui[cç]a|lardons?|sardines?|herrings?|kippers?|mackerel|cod|haddock|trout|snapper|barramundi|whitebait|scallops?|octopus|eels?|caviar|lox|escargots?|bonito|dashi|fish sauce|oyster sauce|goose|quail|pheasant|mutton|liver|foie gras|haggis|oxtail|bone marrow|spam|meatloaf|carnitas|barbacoa|al pastor|crayfish|yabbies|cutlets?|schnitzels?|drumsticks?|(?<!(moth|butterfly|angel|fairy|sturdy)[- ])wings?(?! (kong|shapes?))|nuggets?|kebabs?|gyros?|shawarma|souvlaki|chilli con carne|bolognese|ragu|marshmallows?|(?<!butter )(?<!butter and )(?<!butter & )jelly(?! beans?))\b|\bfranks\b(?!\s*')/i;
const DIET_BOOZE=/\b(rum|brandy|whiske?y|wine(?! vinegar)|(?<!(ginger|root) )beers?|(?<!ginger )ales?|liqueurs?|bourbon|vodka|tequila|gin|champagne|sherry(?! vinegar)|kahlua|baileys|amaretto|cognac|stout|lager|(?<!(apple|hot) )cider(?!\s+(vinegar|doughnuts?|donuts?))|margaritas?|daiquiris?|martinis?|boozy|(?<!(prawn|shrimp|fruit) )cocktails?(?!\s+(franks?|onions?|cherr\w*|sauce|blinis?|sausages?|sticks?|party|meatballs?|bites|picks?|skewers?))|sangria|prosecco|schnapps|mead|grog|vermouth|ouzo|absinthe|marsala|sake|mirin|shaoxing|rice wine|cooking wine|limoncello|cointreau|triple sec|grand marnier|campari|aperol|frangelico|kirsch|madeira|port wine|soju|negronis?|mojitos?)\b/i,DIET_DRY_OK=/\b(no alcohol|alcohol[- ]free|non[- ]alcoholic|mocktails?|(?<!extra )virgin)\b/i;
const FULL_CAP={galley:1,tearoom:1,candybar:2,canteen:1,club:1,diningcar:1,saloon:1,banquet:2,placemat:2,motel:3};
function fullMenu(f,menu,fmt){
  if(window.LIB_FULL===false)return menu;
  const out={},seen=new Set(),adds=[];
  /* a dish shown under its alcohol-free or vegetarian name still counts as on the card, so its original never comes back as an extra */
  for(const k of ["s","m","w","d"])for(const it of menu[k]||[]){seen.add(String(it.n||"").toLowerCase());if(it.orig)seen.add(String(it.orig).toLowerCase())}
  const src={s:f.S,m:f.M,w:f.W,d:f.K};
  /* 13 Nov: a diet switch keeps the film's other dishes that already suit it and leaves off only the ones that don't (it left them all off).
     Meat or fish, or a drop of alcohol, in the name, menu line, method or shopping (vinegars are not alcohol) means it doesn't suit.
     14 Nov: family and Christmas films (DRY_THEMES) count as alcohol-free with no switch on, like the rest of their card (dryNow) */
  const veg=DIET.veg,af=dryNow(f),fits=it=>{const sh=(Array.isArray(it.shop)?it.shop:[]).map(String),txt=[it.n,it.note,it.how,...sh.map(x=>x.split("@")[0])].filter(Boolean).join(" ");
    if(veg&&(sh.some(x=>/@\s*(Meat|Seafood)\s*$/.test(x))||DIET_MEAT.test(txt)))return false;
    return !(af&&(sh.some(x=>/@\s*Bottle shop\s*$/.test(x))||(!DIET_DRY_OK.test(txt)&&DIET_BOOZE.test(txt))))};
  if(f._full)for(const k of ["s","m","w","d"])for(const r of src[k]||[]){const it=toItem(r);if(!it.n||seen.has(it.n.toLowerCase())||!fits(it))continue;seen.add(it.n.toLowerCase());adds.push([k,Object.assign(it,{extra:true})])}
  /* a card with one main shows the film's second main before a third starter, so a short board still reads as a dinner (Blazing Saddles: rib eyes beside the beans) */
  if((menu.m||[]).length<2)adds.sort((a,b)=>(b[0]==="m")-(a[0]==="m"));
  const hz=f._lib&&f._lib.flavour&&f._lib.flavour.house;
  /* hz.fit, when set, lists the house lines that fit this film's layout without hiding any of its own dish notes */
  /* a house line never repeats a dish already on the card (no second sourdough, no second punch): same main noun, it drops */
  const headN=n=>{const w=String(n).split(/\s+(?:with|and|in|on|from|over|served|topped)\s+|,|\(/i)[0].split(/[^a-zà-ÿ']+/i).filter(Boolean);return w.length?planSing(w[w.length-1].toLowerCase()):""};
  const heads=new Set([...seen].map(headN));
  if(hz)for(const k of (hz.fit||["d","s"])){const h=hz[k];if(!h||!h.n||seen.has(h.n.toLowerCase()))continue;if((DIET.veg&&h.meat)||(h.alc&&dryNow(f)))continue;
    {const hn=headN(h.n);if(hn.length>=4&&heads.has(hn))continue}
    adds.push([k,{n:h.n,note:h.note||"",how:"",shop:[],house:true}])}
  const cap=FULL_CAP[fmt]==null?99:FULL_CAP[fmt];
  for(const k of ["s","m","w","d"])out[k]=(menu[k]||[]).slice();
  for(const [k,it] of adds.slice(0,cap))out[k].push(it);
  return Object.assign({},menu,out);
}
/* stock venue notices on the shared layouts get worded per venue: each film always gets the same pick, but the same line no longer turns up word for word on dozens of menus */
const LIB_VARY={
  "Open 6 a.m. to midnight":["Open 6 a.m. to midnight","Open 5.30 a.m. till late","Open 7 a.m. to 11 p.m.","Open all night, daily","Breakfast from 6 a.m.","Open early, close late"],
  "Prices subject to change. Pie while it lasts.":["Prices subject to change. Pie while it lasts.","No substitutions. Pie while it lasts.","Cash only. Refills on the coffee.","Ask about today's pie at the counter.","Prices subject to change. Tip your waitress.","Booths for four or more, please."],
  "Dial 0 for the kitchen. Open all night.":["Dial 0 for the kitchen. Open all night.","Dial 7 for room service. Open till 2.","Ring the front desk for the kitchen.","Room service from 6 a.m. to midnight.","Dial 0 and ask for the kitchen. Any hour."],
  "Order by 2 am":["Order by 2 am","Order by 1 am","Last order 1 am","Order by 3 am","Order any hour"],
  "Coffee shop, open early and late":["Coffee shop, open early and late","Coffee shop, open 6 till 10","Coffee shop off the lobby","Coffee shop, open all night","Coffee shop by the front office"],
  "Open 5 pm till late, seven nights.":["Open 5 pm till late, seven nights.","Open 4 pm to midnight, not Mondays.","Open 11 am till late, every day.","Open 6 pm till 2 am on weekends.","Lunch and dinner, seven days."],
  "Free delivery over $25.":["Free delivery over $25.","We deliver 10 blocks.","Delivery or pick up.","Free delivery after 9.","Ring ahead for pick up."],
  "One of every course, packed in one bag, ready by the opening credits.":["One of every course, packed in one bag, ready by the opening credits.","Starter, main, sweet and a drink each, all in one bag.","The lot in one bag, at your door before the trailers end.","A bit of everything, bagged up hot for the couch."],
  "Luncheon 11.30 till 2.30. Afternoon tea from 3.":["Luncheon 11.30 till 2.30. Afternoon tea from 3.","Luncheon from noon. Afternoon tea 3 till 5.","Morning tea from 10. Luncheon at 12.","Luncheon 12 till 2. High tea from 4.","Open 10 till 5. Afternoon tea from 3."],
  "Honk if you're hungry.":["Honk if you're hungry.","Follow the line.","Order at the window.","Here till we sell out.","Hot through the window."],
  "When it's gone, it's gone.":["When it's gone, it's gone.","Sold out means sold out.","Made in the truck today.","Till the last plate goes."]};
/* number ranges never split across lines on a printed menu ("6 to / 8"): non-breaking spaces round "to", text only, never inside tags */
function nbRange(html){return String(html).replace(/>([^<]+)</g,(m,t)=>">"+t.replace(/(\d[\d.:]*)\s+to\s+(\d[\d.:]*)(\s?(?:am|pm|a\.m\.|p\.m\.|min|mins|minutes|hr|hrs|hours|°C|C)\b)?/g,(x,a,b,u)=>a+"\u00a0to\u00a0"+b+(u?u.replace(/^\s/,"\u00a0"):""))+"<")}
function libVary(html,f){let h=String(html);for(const k in LIB_VARY){if(!h.includes(k))continue;let x=2166136261;for(const ch of f.title+f.year+k){x^=ch.charCodeAt(0);x=Math.imul(x,16777619)>>>0}/* never longer than the line it replaces, so it always fits the same spot */const v=LIB_VARY[k].filter(x=>x.length<=k.length+2);h=h.split(k).join(v[x%v.length].replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])))}return nbRange(h)}
/* 8 Nov: fixed layout words that clash with a film (a ship's mess on a Louisiana film, baseball words on a skating film) are swapped per film:
   film-flavour "words" {"Old wording":"New wording"}, text only, never inside tags, any case; a match printed all in capitals takes the new wording in capitals */
function libWords(html,fl){const W=fl&&fl.words;if(!W)return html;const esc=t=>t.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  return String(html).replace(/>([^<]+)</g,(m,t)=>{for(const k in W){const ks=[...new Set([k,esc(k),esc(k).replace(/'/g,"&#39;"),k.replace(/'/g,"\u2019")])];for(const kk of ks){const re=new RegExp(kk.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");t=t.replace(re,x=>{const n=esc(W[k]);return x===x.toUpperCase()&&x!==x.toLowerCase()?n.toUpperCase():n})}}return ">"+t+"<"})}
/* 8 Nov: a quote that ends a note keeps its own stop: layouts that add a full stop leave "There goes my milk!". as "There goes my milk!" (text only) */
function libStops(html){return String(html).replace(/>([^<]+)</g,(m,t)=>">"+t.replace(/([.!?\u2026])(["\u201d\u2019]|&quot;)\./g,"$1$2")+"<")}
/* venue menus carry the venue, not the film's poster: the poster stays in the page around the menu */
let LIB_POSTER_ON=true;window.LIB_NO_POSTER=!LIB_POSTER_ON;
async function show(f,preferSig){
  const id=++renderId;pvFace=0;
  /* the film dressed behind the curtain on a first visit isn't anyone's pick yet */
  {const st=!!window.__stage;window.__stage=false;document.body.classList.toggle("staged",st);document.body.classList.toggle("picked",!st);if(!st&&typeof renderSnacks==="function")setTimeout(()=>{try{renderSnacks()}catch(e){}},0)}
  current=f;
  updateWatchButton();try{updateFav()}catch(e){}
  try{seriesNote(f)}catch(e){}
  try{snackPair(f)}catch(e){}
  await Promise.all([ensureExact(f),fmtLoad(f)]);
  if(id!==renderId)return;
  let menu=makeMenu(f,preferSig);if(lazy)menu=lazyMenu(menu);menu.counter=counterShop(f.id);
  $("whereWheel").innerHTML=whereHTML(f);
  try{lightboxes()}catch(e){}
  {const amb=$("ambient"),pp=lobbyPoster(f);amb.classList.remove("on");if(pp&&!globalThis.REEL_APP)setTimeout(()=>{if(id!==renderId)return;amb.style.backgroundImage=`url("${TMDB_IMG}w500${pp}")`;amb.classList.add("on")},reduce?0:400)}
  const edition=movieEdition(f);
  current.menu=menu;current.tag=edition?edition.tagline:f.T;
  {const sp=fmtSpec(f);$("foldPdf").hidden=!(sp&&fmtCanFold(sp))}
  const unsaved=!f._full&&navigator.onLine===false?"You're offline and this film's full menu isn't saved on this device yet. It'll be here once you're back online.":"";
  $("status").textContent=unsaved;
  planLoad(f);planWire(f);
  await ensureFonts(STY[f.theme]);
  if(id!==renderId)return;
  const spec=fmtSpec(f);
  if(spec){
    await fmtFontsReady(spec);if(id!==renderId)return;
    menu=fmtMenu(f,spec);menu.counter=counterShop(f.id);current.menu=menu;try{planWire(f)}catch(e){}
    styleCard(card,f);card.className="mcard fmt fmt-"+spec.fmt;card.style.transform="";card.innerHTML=nbRange(fmtHTML(f,spec,menu));dietStamp();{const sh=fmtSheet(spec);if(sh){const z=fmtSheetSize(sh);card.classList.add("fx-paper");card.style.width=z.w+"px";card.style.height=z.h+"px";card.dataset.w=z.w;card.dataset.h=z.h}}fmtStarsPNG(card);fmtTilesPNG(card);await fmtPhotocopy(card);if(id!==renderId)return;
    try{const im=card.querySelector(".fx-poster");if(im)await im.decode()}catch(e){}
    if(id!==renderId)return;
    styleCard(prep,f);prep.classList.add("pp-sheet");prep.innerHTML=prepHTML(f,menu);
    phoneView(f,spec,menu);scalePreview();try{fitLines(card)}catch(e){}setTimeout(()=>{if(id===renderId)try{fitLines(card)}catch(e){}},1500);
    const refitP=()=>{if(id!==renderId)return;const b=prep.hidden;prep.hidden=false;fitPrep(prep);prep.hidden=b};
    refitP();await document.fonts.ready;refitP();
    return;
  }
  if(f._lib&&await libLoad(f._lib.fmt)&&id===renderId){
    try{await Promise.race([Promise.resolve(window.MENU_FORMATS[f._lib.fmt].ready),new Promise(r=>setTimeout(r,4000))]);await document.fonts.ready;if(id!==renderId)return;
      const L=f._lib,r=window.MENU_FORMATS[L.fmt]({f:dietKeyF(f)?Object.assign(Object.create(Object.getPrototypeOf(f)),f,{T:dietText(f,f.T),P:dietCue(f,f.P),D:dietText(f,f.D)}):f,menu:libMenu(fullMenu(f,menu,L.fmt)),poster:LIB_POSTER_ON?lobbyPoster(f):null,stills:L.stills||[],logo:LIB_POSTER_ON?L.logo:null,palette:L.palette,flavour:dietDeep(f,L.flavour),era:L.era,tone:L.tone,img:(p,z="w1280")=>p?TMDB_IMG+z+p:""});
      r.faces=window.priceTidy(r.faces.map(h=>libStops(libWords(libNoteKind(libVary(h,f),L.flavour),L.flavour))),L.fmt);const sheet={w:r.w,h:r.h,faces:r.faces.map((_,i)=>"Page "+(i+1))};current.libSheet=sheet;
      styleCard(card,f);card.className="mcard fmt fmt-lib lib-"+L.fmt;card.style.transform="";card.innerHTML=fmtFaces(r.faces,sheet);dietStamp();
      {const z=fmtSheetSize(sheet);card.classList.add("fx-paper");card.style.width=z.w+"px";card.style.height=z.h+"px";card.dataset.w=z.w;card.dataset.h=z.h}
      try{libAim(card,L)}catch(e){}
      await Promise.all([...card.querySelectorAll("img")].map(im=>im.decode().catch(()=>{})));if(id!==renderId)return;
      await new Promise(r=>setTimeout(r,180));try{libPhotoPass(card,L,lobbyPoster(f))}catch(e){console.warn("photo pass",e)}libUnclip(card);fitLines(card);foldClear(card);setTimeout(()=>{if(id===renderId){libUnclip(card);fitLines(card);foldClear(card)}},1400);setTimeout(()=>{if(id===renderId){libUnclip(card,1);fitLines(card)}},3200);setTimeout(()=>{if(id===renderId){fitLines(card);foldClear(card)}},5000);
      try{libPhoneView(f,fullMenu(f,menu,L.fmt),L,card)}catch(e){console.warn("phone menu",e);phoneView(null)}styleCard(prep,f);prep.classList.add("pp-sheet");prep.innerHTML=prepHTML(f,menu);scalePreview();
      const refitL=()=>{if(id!==renderId)return;const b=prep.hidden;prep.hidden=false;fitPrep(prep);prep.hidden=b};
      refitL();await document.fonts.ready;refitL();scalePreview();
      return;
    }catch(e){console.warn("menu format failed",e)}
  }
  current.libSheet=null;
  phoneView(null);
  styleCard(card,f);card.style.transform="";
  const lobby=lobbyPoster(f);
  const tryArt=async(mode,cls,sel)=>{
    styleCard(card,f);card.style.transform="";card.className=cls;card.innerHTML=cardHTML(f,menu,current.tag,mode);
    try{await card.querySelector(sel).decode();return true}catch(e){return false}
  };
  let ok=true;
  if(lobby)ok=await tryArt(true,"mcard L-lobby",".lb-poster");
  if(id!==renderId)return;
  const edArt=globalThis.REEL_APP?null:edition;
  if(edArt&&(!lobby||!ok)){ok=await tryArt("edition","mcard poster-edition",".poster-art");if(id!==renderId)return}
  if(!lobby&&!edArt)card.innerHTML=cardHTML(f,menu,current.tag,false);
  else if(!ok){
    styleCard(card,f);card.style.transform="";card.innerHTML=cardHTML(f,menu,current.tag,false);
    $("status").textContent=unsaved||"The poster couldn't load. Your menu and prep sheet are still available.";
  }
  card.classList.toggle("is-lazy",!!menu.lazy);
  styleCard(prep,f);prep.classList.add("pp-sheet");
  prep.innerHTML=prepHTML(f,menu);
  scalePreview();
  const refit=()=>{if(id!==renderId)return;const a=card.hidden,b=prep.hidden;card.hidden=false;prep.hidden=false;fit(card);fitPrep(prep);card.hidden=a;prep.hidden=b};
  refit();
  await document.fonts.ready;refit();
}
/* picking a film without a spin (search, store, stubs, the weekly strip): the full curtain only plays when it is
   still down; once it is up the menu crossfades in under half a second. Spins and the mystery and trivia reveals pass full. */
function replay(f,full){
  $("now").textContent=f.title;
  if(full||theatre.classList.contains("closed")){closeCurtains();return new Promise(r=>setTimeout(()=>show(f,true).then(()=>{openCurtains();r()}),reduce?0:900))}
  if(reduce)return show(f,true);
  /* the old menu stays up while the new one loads; it hides only once the new one starts drawing, then fades in */
  let shown=false;const reveal=()=>{if(shown)return;shown=true;requestAnimationFrame(()=>requestAnimationFrame(()=>easel.classList.remove("swap")))};
  const mo=new MutationObserver(()=>{mo.disconnect();easel.classList.add("swap");
    /* fade in once its photos are decoded, and never later than 300ms, so the whole swap stays under half a second */
    Promise.race([new Promise(z=>setTimeout(z,300)),new Promise(z=>requestAnimationFrame(()=>Promise.all([...card.querySelectorAll("img")].map(i=>i.decode().catch(()=>{}))).then(z)))]).then(reveal)});
  mo.observe(card,{childList:true});
  const done=()=>{mo.disconnect();reveal()};
  return show(f,true).then(done,done);
}

/* history */
let hist=[];
try{hist=JSON.parse(localStorage.getItem("mns-hist")||"[]")}catch(e){hist=[]}
function renderHist(){
  const box=$("chips");{const w=$("wallBtn");if(w)w.hidden=!(typeof RATES!=="undefined"&&Object.keys(RATES).length)}
  const items=hist.map(id=>FILMS.find(f=>f.id===id)).filter(Boolean);
  if(!items.length){box.innerHTML='<span class="empty">Nothing yet. Your picks land here.</span>';return}
  box.innerHTML="";
  items.forEach(f=>{const r=typeof RATES!=="undefined"&&RATES[f.id];const b=document.createElement("button");b.className="ticket"+(r?" rated":"");b.type="button";b.innerHTML=`<small>Admit one${r?" · "+ESC(nightDate(r.d)):""}</small>${ESC(f.title)}${r?popRow(r.s):""}`;b.addEventListener("click",()=>replay(f));box.appendChild(b)});
}
function addHistory(f){
  hist=[f.id,...hist.filter(x=>x!==f.id)].slice(0,8);try{$("histClear").hidden=false}catch(e){}
  try{localStorage.setItem("mns-hist",JSON.stringify(hist))}catch(e){}
  renderHist();queueSync();
}


/* this week's film: lock a pick, count down to cook night, tick off the shopping */
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
/* A plan owns a local calendar date. Only an explicit new plan/day choice moves it. */
const weekDateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
function parseWeekDate(key){
  if(typeof key!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(key))return null;
  const [y,m,d]=key.split("-").map(Number),at=new Date(y,m-1,d,12,0,0,0);
  return weekDateKey(at)===key?at:null;
}
const weekDay=day=>[5,6,0,"5","6","0"].includes(day)?Number(day):6;
/* review 16: any time of day in 15-minute steps (was 5pm to 9pm on the half hour); 7pm stays the default */
const weekTime=time=>/^(?:[01]\d|2[0-3]):(?:00|15|30|45)$/.test(time)?time:"19:00";
function nextWeekDate(day,time="19:00",now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  d.setDate(d.getDate()+((weekDay(day)-d.getDay()+7)%7));
  const [h,m]=weekTime(time).split(":").map(Number),show=new Date(d);show.setHours(h,m,0,0);
  if(show<now)d.setDate(d.getDate()+7);
  return weekDateKey(d);
}
function normaliseWeek(value,now=new Date()){
  if(!value||typeof value!=="object"||Array.isArray(value)||typeof value.id!=="string")return null;
  const day=weekDay(value.day),time=weekTime(value.time),saved=parseWeekDate(value.date);
  const date=saved&&[5,6,0].includes(saved.getDay())?value.date:nextWeekDate(day,time,now);
  const ticks=value.ticks&&typeof value.ticks==="object"&&!Array.isArray(value.ticks)?value.ticks:{};
  return Object.assign({},value,{day:parseWeekDate(date).getDay(),time,date,ticks});
}
function newWeekPlan(id,double){
  const value={id,day:weekDay(week&&week.day!=null?week.day:6),time:weekTime(week&&week.time),ticks:{}};
  if(double)value.double=double;
  return normaliseWeek(value);
}
let week=null;
try{
  const saved=JSON.parse(localStorage.getItem("mns-week")||"null");week=normaliseWeek(saved);
  if(week&&JSON.stringify(saved)!==JSON.stringify(week))try{localStorage.setItem("mns-week",JSON.stringify(week))}catch(e){}
}catch(e){week=null}
const saveWeek=quiet=>{try{week?localStorage.setItem("mns-week",JSON.stringify(week)):localStorage.removeItem("mns-week")}catch(e){}if(typeof queueSync==="function")queueSync();if(globalThis.REEL_NATIVE&&quiet!==true)appRemind(false)};
function cookDate(now=new Date()){
  const d=parseWeekDate(week.date);
  /* UTC is used only to count calendar labels, never to parse a local date. */
  const days=(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/864e5;
  return [d,days];
}
function renderWeek(){
  const box=$("weekPanel");const f=week&&FILMS.find(x=>x.id===week.id);
  if(!f){box.hidden=true;box.innerHTML="";renderFeature(null);renderMotw();return}
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];const [d,n]=cookDate();
  const when=n===0?`<b>${typeof showToday==="function"?showToday():"Tonight"}</b>`:n===1?"<b>Tomorrow</b>":n<0?`<b>${-n} day${n===-1?"":"s"} ago</b>`:`<b>${n} days to go</b>`;
  box.hidden=false;
  /* review 15: the locked-in strip at the top already shows the poster, title, countdown and a Menu button, so this panel keeps only what the strip
     cannot do: change the cook night and showtime, open the shopping list, or clear the week */
  const strip=!!$("feature");if(box.classList)box.classList.toggle("week-slim",strip);
  box.innerHTML=`${strip?"":p?`<img alt="" src="https://image.tmdb.org/t/p/w154${ESC(p)}">`:"<span></span>"}<p class="week-k">${strip?"Your movie night":"This week's film"}</p>${strip?"":`<p class="week-t">${ESC(f.title)} (${f.year})${week.double&&FILMS.find(x=>x.id===week.double)?` + ${ESC(FILMS.find(x=>x.id===week.double).title)}`:""}</p>`}<p class="week-when">Cook night <select id="weekDay" aria-label="Cook night">${[5,6,0].map(i=>`<option value="${i}"${i===week.day?" selected":""}>${DAYS[i]}</option>`).join("")}</select> ${d.getDate()} ${d.toLocaleString("en-AU",{month:"short"})} · ${when} &nbsp;Showtime <select id="weekTime" class="week-time" aria-label="Showtime">${showOpts(weekTime(week.time))}</select></p><div class="week-acts"><button class="go" type="button" id="weekShop">Shopping list</button>${strip?"":`<button type="button" id="weekOpen">Open the menu</button>`}<button type="button" id="weekCal">${typeof calLabel==="function"?calLabel():"Add to calendar"}</button><button type="button" id="weekClear">Clear</button></div><p class="week-count" id="weekCount" aria-live="polite"></p>`;
  $("weekDay").addEventListener("change",e=>{week.day=weekDay(e.target.value);week.date=nextWeekDate(week.day,week.time);saveWeek();renderWeek()});
  $("weekTime").addEventListener("change",e=>{week.time=weekTime(e.target.value);saveWeek();renderFeature(f);tickShowtime();if(typeof refreshPrepTime==="function")refreshPrepTime()});
  renderFeature(f);tickShowtime();renderMotw();
  $("weekShop").addEventListener("click",async()=>{const g=week.double&&FILMS.find(x=>x.id===week.double);if(g){const dm=await doubleMenu(f,g);openTrolley(f,dm,`${f.title} + ${g.title}`)}else openTrolley(f)});
  if($("weekOpen"))$("weekOpen").addEventListener("click",()=>{setView("wheel");replay(f);toMenu()});
  $("weekCal").addEventListener("click",e=>{if(typeof calAdd==="function")calAdd(e.currentTarget)});
  $("weekClear").addEventListener("click",()=>{week=null;saveWeek();renderWeek();$("status").textContent="This week's film cleared."});
}
/* the locked-in film as a slim strip under the view tabs, on every view: poster, title, cook night and showtime, a short countdown,
   and one tap to its menu or Prep sheet. Josh, 5 Nov: "the locked in movie should be at the top so it's right there as a reminder" */
function renderFeature(f){const box=$("feature");if(!box)return;if(!f||!week){box.hidden=true;box.innerHTML="";return}
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id],[d,n]=cookDate(),g=week.double&&FILMS.find(x=>x.id===week.double);
  /* review 17: an early-hours or daytime showtime is not "tonight" (a 12:15am show read "Tonight" at 2:30pm the same day) */
  const today=typeof showToday==="function"?showToday():"Tonight",day=n===0?today:n===1?"Tomorrow":DAYS[d.getDay()];
  box.hidden=false;
  box.innerHTML=`${p?`<img alt="" src="https://image.tmdb.org/t/p/w154${ESC(p)}" loading="lazy">`:'<span class="ft-ph"></span>'}<p class="ft-k">${n===0?(today==="Tonight"?"Tonight's feature":"Today's feature"):n<0?"Last feature":"Coming up"}</p>
    <p class="ft-t">${ESC(f.title)}${g?` + ${ESC(g.title)}`:""}</p><p class="ft-w">${day} ${d.getDate()} ${"JanFebMarAprMayJunJulAugSepOctNovDec".substr(d.getMonth()*3,3)}, ${clock(week.time||"19:00")} <span id="featCount"></span></p>
    <div class="ft-acts"><button type="button" class="go" id="featMenu">Menu</button><button type="button" id="featPrep">Prep sheet</button><button type="button" id="featCal">${typeof calLabel==="function"?calLabel():"Add to calendar"}</button></div>`;
  $("featMenu").addEventListener("click",()=>{setView("wheel");if(tab!=="menu")setTab("menu");replay(f).then(()=>toMenu());toMenu()});
  $("featPrep").addEventListener("click",()=>{setView("wheel");replay(f).then(()=>{setTab("prep");toMenu()})});
  $("featCal").addEventListener("click",e=>{if(typeof calAdd==="function")calAdd(e.currentTarget)});
}
function showToday(){const h=+weekTime(week&&week.time).slice(0,2);return h<12?"This morning":h<17?"This afternoon":"Tonight"}
/* Countdown to the scheduled showtime. Cooking times belong to the individual recipes. */
const SHOWTIMES=Array.from({length:96},(_,i)=>`${String(i/4|0).padStart(2,"0")}:${String(i%4*15).padStart(2,"0")}`);
/* 96 times read best in groups: a phone wheel or a desktop list lands on the evening */
const showOpts=sel=>[["Early hours",0,6],["Morning",6,12],["Afternoon",12,17],["Evening",17,21],["Night",21,24]].map(([g,a,b])=>`<optgroup label="${g}">${SHOWTIMES.filter(t=>+t.slice(0,2)>=a&&+t.slice(0,2)<b).map(t=>`<option value="${t}"${t===sel?" selected":""}>${clock(t)}</option>`).join("")}</optgroup>`).join("");
const clock=t=>{const [h,m]=t.split(":").map(Number);return `${h%12||12}${m?":"+String(m).padStart(2,"0"):""}${h<12?"am":"pm"}`};
let _showT=null;
function tickShowtime(){
  clearTimeout(_showT);const el=$("weekCount");if(!el||!week)return;
  const [d]=cookDate(),[h,m]=(week.time||"19:00").split(":").map(Number);const at=new Date(d);at.setHours(h,m,0,0);
  const now=new Date(),ms=at-now;
  const span=x=>{const mins=Math.max(0,Math.ceil(x/6e4)),dd=Math.floor(mins/1440),hh=Math.floor(mins%1440/60),mm=mins%60;/* review 18: the same "1 hr 30 min" as the Prep sheet and calendar, never "1h 0m" */return dd?`${dd} day${dd>1?"s":""}${hh?` ${hh} hr`:""}`:hh?`${hh} hr${mm?` ${mm} min`:""}`:`${mm} min`};
  /* review 16: after the night, one tap moves the same film and time to next week; a new film is locked in from its menu */
  if(ms<0)el.innerHTML=`Scheduled showtime has passed. <span>Run it again next week, or lock in a new movie night from any menu.</span> <button type="button" data-next>Same film next week</button>`;
  else if(ms===0)el.innerHTML=`Showtime. <span>Lights down, press play when you're ready.</span> <button class="btn primary" type="button" data-show>Start the show</button>`;
  else el.innerHTML=`Showtime in ${span(ms)}. <span>Check each recipe for cooking times and make-ahead steps.</span>`;
  {const fc=$("featCount");if(fc)fc.textContent=ms<0?"· showtime passed":ms===0?"· showtime now":"· in "+span(ms)}
  /* the strip carries the countdown; the panel only speaks up when the showtime has come or gone */
  el.hidden=ms>0&&!!$("feature")&&!$("feature").hidden;
  if(typeof calLabels==="function")calLabels();
  _showT=setTimeout(tickShowtime,30000);
}
/* menu of the week: the printed era menus take turns, a new one every Monday */
function weekNo(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y)/864e5+1)/7)+t.getUTCFullYear()*53}
const MOTW_KIND={workorder:"A firehouse work order",lanes:"A league night score sheet",market:"The corner market wall",takeaway:"A Chinatown takeaway trifold",diner:"The Wazoo Diner trifold",casefile:"The Lexington Hotel banquet menu",noodle:"Mr Ping's noodle shop wall",slims:"The Jack Rabbit Slim's menu",nero:"A Little Nero's pizza box",lous:"The Lou's Cafe letter board",pad:"Henry's notepad, May 1980"};
function renderMotw(){
  const box=$("motw");if(!box||typeof FMT_INDEX==="undefined")return;
  const ids=Object.keys(FMT_INDEX).filter(id=>FILMS.some(f=>f.id===id)&&(!kidsMode||isKidSafe(FILMS.find(f=>f.id===id)))).sort();
  if(!ids.length){box.hidden=true;return}
  const f=FILMS.find(x=>x.id===ids[weekNo(new Date())%ids.length]);
  if(week&&week.id===f.id){box.hidden=true;return}
  const sp={fmt:FMT_INDEX[f.id]},p=lobbyPoster(f);
  box.hidden=false;
  box.innerHTML=`${p?`<img alt="" src="https://image.tmdb.org/t/p/w154${ESC(p)}" loading="lazy">`:"<span></span>"}<p class="week-k">Menu of the week</p><p class="week-t${f.title.length>26?" long":""}"><span class="motw-n">${ESC(f.title)} (${f.year})</span><small>${ESC(MOTW_KIND[sp.fmt]||"A printed menu from the film")}</small></p><div class="week-acts"><button class="go" type="button" id="motwOpen">Open the menu</button><button type="button" id="motwLock">Lock it in</button></div>`;
  $("motwOpen").addEventListener("click",()=>{setView("wheel");replay(f);addHistory(f);toMenu()});
  $("motwLock").addEventListener("click",()=>{setWeek(f);replay(f);lockAsk(f,$("weekSet"))});
}
function setWeek(f){week=newWeekPlan(f.id);saveWeek(true);renderWeek();updateWatchButton();if(typeof refreshPrepTime==="function")refreshPrepTime();$("status").textContent=`${f.title} is locked in for this week.`;
  /* the app: locking in only updates reminders already allowed; the permission is asked from the calendar button */
  if(globalThis.REEL_NATIVE)appRemind(false).then(r=>{if(/^set/.test(r))$("status").textContent+=" We'll remind you on this phone when each step is due.";else if(r==="ask"&&!calPassed())$("status").textContent+=" Tap Add to calendar to get reminders on this phone."})}
function listText(f,groups,serves){return `${f.title} (${f.year}) shopping list, serves ${serves||(f._r2?PLAN.guests:4)}\n`+groups.map(([a,l])=>`\n${a}\n${l.map(x=>"- "+x).join("\n")}`).join("\n")}
/* calendar reminder: review 16, Josh asked for an "Add to calendar" button on the locked-in strip and the "Your movie night" bar.
   It downloads one .ics event for the movie night with the menu link in the notes, and reminders attached to it:
   - start cooking: showtime less the longest thing left to do on the night (hands-on and cooking, plus any wait under 2 hours), on a 5-minute mark
   - make ahead today, for a dish with a wait of 2 hours or more that still fits in the day (a tiramisu that sets, a marinade)
   - prep ahead, the night before or days ahead, for overnight and longer waits (see calPlan)
   Apple Calendar keeps every reminder; Outlook keeps one per event, so start cooking comes first. Google drops reminders from an imported
   file and its phone app cannot open .ics, so the panel after the download also adds the night and each reminder to Google as their own events.
   Times go in as UTC, so every app shows them in the phone's own time zone. Lines are CRLF and folded at 75 bytes (RFC 5545). */
const calPad=n=>String(n).padStart(2,"0");
const calClock=d=>`${d.getHours()%12||12}${d.getMinutes()?":"+calPad(d.getMinutes()):""}${d.getHours()<12?"am":"pm"}`;
const calDay=d=>`${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} ${d.getDate()} ${"JanFebMarAprMayJunJulAugSepOctNovDec".substr(d.getMonth()*3,3)}`;
const calDur=m=>m>=2880?Math.round(m/1440)+" days":m>=60?Math.floor(m/60)+" hr"+(m%60?" "+m%60+" min":""):m+" min";
const calUTC=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
const calEsc=s=>String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
/* a minute count as an RFC 5545 duration before the event: 110 is -PT1H50M, 1500 is -P1DT1H */
const calBefore=m=>{m=Math.max(0,Math.round(m));const d=Math.floor(m/1440),h=Math.floor(m%1440/60),n=m%60;return "-P"+(d?d+"D":"")+(h||n||!d?"T"+(h?h+"H":"")+(n||!h?n+"M":""):"")};
function calFold(line){const out=[];let cur="",bytes=0,max=75;for(const ch of line){const c=ch.codePointAt(0),b=c<0x80?1:c<0x800?2:c<0x10000?3:4;
    if(bytes+b>max){out.push(cur);cur=" ";bytes=1;max=75}cur+=ch;bytes+=b}out.push(cur);return out.join("\r\n")}
/* dishes: [{n, active, wait, night, over, words}] in minutes, from the Prep sheet's own dishTimes. night is what is left to do on the night
   after the dish's long wait (calNight); over marks a wait the recipe itself puts overnight.
   Review 16, Josh: a wait does not push the start time. Only what is done on the night sets "start cooking" (a long braise still can).
   A dish with a wait of 2 hours or more is made ahead:
   - earlier that day, from the latest time that still fits it, when that time is after 8am and before start cooking;
   - the night before (6pm) when the recipe says overnight, when the wait is 10 hours or more, or when it would have to start before 8am;
   - two or more days ahead for long soaks and cures, at 6pm on that day or earlier if the wait needs it, never before 8am. */
const CAL_LONG=120;
/* what a dish still needs on the night, and the dish that needs longest: the Prep sheet's "longest on the night" chip and the calendar's lead
   are the same sum (review 17: the chip used the longest cook and the calendar the longest night, two numbers under one word) */
function calNightOf(d){return d.night!=null?d.night:(d.wait||0)<120?(d.active||0)+(d.wait||0):(d.active||0)}
function calLead(dishes){let dish="",lead=0;for(const d of dishes){const l=calNightOf(d);if(l>lead){lead=l;dish=d.n}}return {dish,lead}}
/* now (optional): the time the plan is made. Review 17: a make-ahead time already gone is never offered. A dish that can still be done in time
   starts now; one that cannot is listed as too late (late), with the first week its wait fits again (next), and gets no alarm */
function calPlan(show,dishes,now){
  /* review 18: a dish too late to make is bought ready-made, so it takes no time on the night */
  const late0=now?dishes.filter(d=>(d.wait||0)>=CAL_LONG&&new Date(show.getTime()-((d.active||0)+(d.wait||0))*6e4)<now):[];
  const {dish,lead}=calLead(dishes.filter(d=>!late0.includes(d)));
  let start=new Date(show.getTime()-(lead||60)*6e4);start.setMinutes(Math.floor(start.getMinutes()/5)*5,0,0);
  const latest=d=>new Date(show.getTime()-((d.active||0)+(d.wait||0))*6e4),day8=new Date(show.getFullYear(),show.getMonth(),show.getDate(),8,0,0,0);
  const soon=now?new Date(Math.ceil(now.getTime()/9e5)*9e5):null;
  const long0=dishes.filter(d=>(d.wait||0)>=CAL_LONG),lateD=now?long0.filter(d=>latest(d)<now):[],long=long0.filter(d=>!lateD.includes(d));
  const aheadD=long.filter(d=>d.over||d.wait>=600||latest(d)<day8);
  const earlyD=long.filter(d=>!aheadD.includes(d)&&latest(d)<start);
  let before=null,early=null,late=null,first="";
  const aheadAt=ds=>{const l=new Date(Math.min(...ds.map(d=>latest(d).getTime())));
    /* 6pm on the latest day that still fits, and never later than 6pm the night before */
    let at=new Date(Math.min(l.getTime(),new Date(l.getFullYear(),l.getMonth(),l.getDate(),18,0,0,0).getTime(),new Date(show.getFullYear(),show.getMonth(),show.getDate()-1,18,0,0,0).getTime()));at.setMinutes(Math.floor(at.getMinutes()/15)*15,0,0);
    /* nobody wants a 3am alarm: a start in the small hours moves to 6pm the evening before */
    if(at.getHours()<8)at=new Date(at.getFullYear(),at.getMonth(),at.getDate()-1,18,0,0,0);
    /* the planned time has gone but the wait still fits: start now */
    if(soon&&at<soon)at=soon>l?new Date(Math.ceil(now.getTime()/6e4)*6e4):soon;
    return {at,dishes:ds,now:!!(soon&&at<=soon)}};
  let before2=null;
  if(aheadD.length){before=aheadAt(aheadD);
    /* review 19: make-aheads due on different days keep their own reminders. Rocky IV moved a week on put the vodka mule (the night before)
       in with the pickles four days early: the first reminder holds the dishes due that day, the second the rest, on its own day */
    const dk=x=>x.getFullYear()+"-"+x.getMonth()+"-"+x.getDate(),one=aheadD.filter(d=>dk(aheadAt([d]).at)===dk(before.at)),rest=aheadD.filter(d=>!one.includes(d));
    if(rest.length&&one.length){before=aheadAt(one);before2=aheadAt(rest);if(dk(before2.at)===dk(before.at)){before=aheadAt(aheadD);before2=null}}}
  if(earlyD.length){let at=new Date(Math.min(...earlyD.map(d=>latest(d).getTime())));at.setMinutes(Math.floor(at.getMinutes()/15)*15,0,0);
    if(soon&&at<soon)at=soon;
    /* review 17: a make-ahead alarm within 45 minutes of start cooking is one alarm: start cooking moves to it and names that dish first */
    if(start-at<=45*6e4){start=at;first=earlyD.map(d=>d.n).join(", ")}else early={at,dishes:earlyD,now:!!(soon&&at<=soon)}}
  if(lateD.length){const wk=k=>{const x=new Date(show);x.setDate(x.getDate()+7*k);return x};let k=1;
    while(k<52&&lateD.some(d=>new Date(wk(k).getTime()-((d.active||0)+(d.wait||0))*6e4)<now))k++;
    late={dishes:lateD,next:wk(k)}}
  return {lead,dish,start,early,before,before2,late,first,startNow:!!(now&&start<now)}}
/* how far ahead, in words: "The night before", "Two days before", "A week before" */
const calAhead=(show,at)=>{const n=Math.round((new Date(show.getFullYear(),show.getMonth(),show.getDate())-new Date(at.getFullYear(),at.getMonth(),at.getDate()))/864e5);
  return n<=0?"Earlier that day":n===1?(at.getHours()>=17?"The night before":"The day before"):n===7?"A week before":n===14?"Two weeks before":(["","","Two","Three","Four","Five","Six"][n]||n)+" days before"};
const calList=g=>g?g.dishes.map(d=>`${d.n}, ${calDur(d.wait)}${d.words?" "+d.words:""}`).join("; "):"";
/* review 17: a make-ahead that can no longer be done in time, in plain words with a way round it */
const calLate=(p,o)=>p.late?`Too late to make ahead for this night: ${calList(p.late)}. Buy ${p.late.dishes.length>1?"them":"it"} ready-made, or move movie night to ${calDay(p.late.next)}.`:"";
/* review 18: a dish named mid-sentence drops its capital ("Start cooking with strawberry ice cream cones") unless the first word is a name:
   a possessive (McClane's), a capital inside it, or a word no dish name ever writes in lower case (Fairvale) */
let calLow=null;
let calLowAll=false;
function calMid(names){/* the word list is only kept once every film's dish names are in (dish-names.json loads after the page settles) */
  if(!calLow||!calLowAll){calLowAll=typeof dishesReady!=="undefined"&&dishesReady;calLow=new Set();try{for(const f of FILMS)for(const K of ["S","M","W","K"])for(const r of f[K]||[])String(r[0]||"").split(/\s+/).slice(1).forEach(w=>{if(/^[a-z]/.test(w))calLow.add(w.replace(/[^a-z]/g,""))})}catch(e){}}
  return String(names).split(", ").map(n=>{const w=n.split(/\s+/)[0]||"";if(/['’]s$/i.test(w)||/.[A-Z]/.test(w)||!/^[A-Z][a-z]+$/.test(w.replace(/[,.;:]$/,""))||(calLow.size&&!calLow.has(w.toLowerCase().replace(/[^a-z]/g,""))))return n;return n[0].toLowerCase()+n.slice(1)}).join(", ")}
/* review 19: "Longest on the night: Rigatoni, Sunday gravy, 2 hr" read as three things. A dish with a comma of its own takes its time in brackets */
const calLong=(n,m)=>/,/.test(n)?`${n} (${calDur(m)})`:`${n}, ${calDur(m)}`;
function calText(o){const p=o.plan,ah=calList(p.before),ah2=calList(p.before2),ea=calList(p.early);
  const made=[...(p.before?p.before.dishes:[]),...(p.before2?p.before2.dishes:[]),...(p.early?p.early.dishes:[])].map(d=>d.n);
  /* review 18: "Shower cap swirled meringues takes longest" read wrong with a plural dish, so the dish follows the words */
  const lead=p.dish?`longest on the night: ${calLong(p.dish,p.lead)}`:"";
  return {
    title:`Movie night: ${o.title}`,
    cook:`Start cooking for ${o.title}${p.first?` with ${calMid(p.first)}`:""}. Showtime is ${calClock(o.show)}.${lead?` ${lead[0].toUpperCase()+lead.slice(1)}.`:""}${made.length?` Made ahead: ${made.join(", ")}.`:""}`,
    early:p.early?`Make ahead today for ${o.title}: ${ea}.`:"",
    ahead:p.before?`Prep ahead for ${o.title}: ${ah}.`:"",
    ahead2:p.before2?`Prep ahead for ${o.title}: ${ah2}.`:"",
    late:calLate(p,o),
    notes:[`Showtime ${calClock(o.show)}. Start cooking at ${calClock(p.start)}${p.first?` with ${calMid(p.first)}`:""}${lead?` (${lead})`:""}.`,
      p.early?`Earlier that day, ${p.early.now?"start now":"from "+calClock(p.early.at)}: ${ea}.`:"",
      p.before?`${p.before.now?"Start now":`${calAhead(o.show,p.before.at)}, from ${calDay(p.before.at)} ${calClock(p.before.at)}`}: ${ah}.`:"",
      p.before2?`${p.before2.now?"Start now":`${calAhead(o.show,p.before2.at)}, from ${calDay(p.before2.at)} ${calClock(p.before2.at)}`}: ${ah2}.`:"",
      calLate(p,o),
      `Menu and Prep sheet: ${o.url}`].filter(Boolean).join("\n")}}
/* an alarm already due when the file is made is left out (review 17): the panel says "now" instead */
function calICS(o){const t=calText(o),p=o.plan,now=o.now||new Date(),end=new Date(o.show.getTime()+(o.span||150)*6e4);
  const alarm=(mins,txt)=>["BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${calEsc(txt)}`,`TRIGGER;RELATED=START:${calBefore(mins)}`,"END:VALARM"];
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Reel Dinner//Movie night//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",`UID:${o.uid}`,`DTSTAMP:${calUTC(now)}`,`DTSTART:${calUTC(o.show)}`,`DTEND:${calUTC(end)}`,
    `SUMMARY:${calEsc(t.title)}`,`DESCRIPTION:${calEsc(t.notes)}`,`URL:${o.url}`,"TRANSP:OPAQUE",
    ...(p.startNow?[]:alarm((o.show-p.start)/6e4,t.cook)),...(p.early&&!p.early.now?alarm((o.show-p.early.at)/6e4,t.early):[]),...(p.before&&!p.before.now?alarm((o.show-p.before.at)/6e4,t.ahead):[]),...(p.before2&&!p.before2.now?alarm((o.show-p.before2.at)/6e4,t.ahead2):[]),
    "END:VEVENT","END:VCALENDAR"];
  return L.map(calFold).join("\r\n")+"\r\n"}
/* Google: one link per event, since an imported file loses its reminders there; nothing for a time already gone */
function calGoogle(o){const t=calText(o),p=o.plan,g=(text,a,b,details)=>"https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(text)+"&dates="+calUTC(a)+"/"+calUTC(b)+"&details="+encodeURIComponent(details);
  const out=[["the night",g(t.title,o.show,new Date(o.show.getTime()+(o.span||150)*6e4),t.notes)]];
  if(!p.startNow)out.push(["start cooking",g(`Start cooking: ${o.title}`,p.start,new Date(p.start.getTime()+15*6e4),t.cook+"\n"+o.url)]);
  if(p.early&&!p.early.now)out.push(["make ahead today",g(`Make ahead: ${o.title}`,p.early.at,new Date(p.early.at.getTime()+15*6e4),t.early+"\n"+o.url)]);
  if(p.before&&!p.before.now)out.push(["prep ahead",g(`Prep ahead: ${o.title}`,p.before.at,new Date(p.before.at.getTime()+15*6e4),t.ahead+"\n"+o.url)]);
  if(p.before2&&!p.before2.now)out.push([`prep ahead, ${calAhead(o.show,p.before2.at).toLowerCase()}`,g(`Prep ahead: ${o.title}`,p.before2.at,new Date(p.before2.at.getTime()+15*6e4),t.ahead2+"\n"+o.url)]);return out}
/* end calendar reminder */
/* review 16: what is left to do on the night once a dish's long wait is over. The steps after the last wait of 2 hours or more (or one the
   recipe puts overnight) carry that share of the hands-on and cooking time, plus any short wait among them. A dish with no long wait runs whole. */
/* review 27: a recipe that says to make the whole dish ahead ("Make the day before", "Make a day ahead") is done before the night,
   even when no single wait reaches 2 hours (Snatch's banoffee pie chills 60 then 80 minutes). It takes no time on the night and plans
   as a night-before job. "Up to 2 days" is an option, not an instruction, so it stays on the night. */
const AHEAD_WHOLE=/^(make|bake|set|prepare)\s+(it\s+|them\s+)?(the\s+(day|night)\s+before|a\s+day\s+ahead|\d+\s+days?\s+ahead)(\s+or\s+in\s+the\s+morning)?(,\s*(keeps?|chill|store|rests?|press|cool|serve\s+warm\s+or)\b[^.,;]*)?(\.(\s.*)?)?$/i;
const aheadWhole=x=>AHEAD_WHOLE.test(String(x&&x.make_ahead||"").trim());
function calNight(x,T){const st=(x.steps||[]).filter(t=>stepParts(t.text).main);let L=-1;
  if(aheadWhole(x)&&T.wait>=CAL_LONG)return {night:0,over:true,ahead:true};
  st.forEach((t,i)=>{if(isWaitStep(t)&&((t.min||0)>=CAL_LONG||/\bovernight\b/i.test(t.text)))L=i});
  if(L<0||T.wait<CAL_LONG)return {night:T.active+T.wait,over:false};
  const mins=a=>a.reduce((s,t)=>s+(t.min||0),0),non=st.filter(t=>!isWaitStep(t)),after=st.slice(L+1);
  const share=mins(non)?mins(after.filter(t=>!isWaitStep(t)))/mins(non):1;
  return {night:Math.round(T.active*share)+mins(after.filter(isWaitStep)),over:/\bovernight\b/i.test(st[L].text)}}
/* the picked dishes for a film, timed for the guests, read without disturbing the plan of the film on screen */
function calDishes(f){if(!f||!f._r2||!(f._r2.dishes||[]).length)return [];const keep={guests:PLAN.guests,off:PLAN.off,on:PLAN.on};
  try{if(f!==current)planLoad(f);const sv=(f._r2&&f._r2.serves)||4,LB=planLabels(f);
    return planPicked(f).filter(x=>!x.extra).map(x=>{const T=dishTimes(x,x.snack?PLAN.guests/4:PLAN.guests/sv);return {n:LB[x.orig||x.n]&&!x.tag?LB[x.orig||x.n]:x.n,active:T.active,wait:T.wait,...calNight(x,T),words:T.wait>=CAL_LONG?waitWords(x):""}})}
  catch(e){return []}finally{if(f!==current)Object.assign(PLAN,keep)}}
function weekShow(){const [d]=cookDate(),[h,m]=weekTime(week.time).split(":").map(Number);const at=new Date(d);at.setHours(h,m,0,0);return at}
/* review 16: what to tap, worked out from the device. iPhone and iPad Safari ask before a calendar file opens and then show the event with an
   Add to Calendar button; Google Calendar on Android cannot open a downloaded .ics, so Android goes to the Google links; a computer opens the file */
function calHow(name){const ua=navigator.userAgent||"",ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),droid=/Android/.test(ua);
  return ios?"<b>iPhone or iPad:</b> tap Allow if Safari asks, then Add to Calendar. The reminders come with it.":
    droid?"<b>Android:</b> the Google Calendar app cannot open this file, so use the Google links below. Outlook or Samsung Calendar can open it from Downloads.":
    `<b>${ESC(name)}</b> is downloading. Open it to add the night and its reminders to Apple Calendar or Outlook.`}
/* review 17: once showtime has gone, Add to calendar books the same film next week (as "Same film next week" does) and says so */
function calPassed(){return !!week&&weekShow()<new Date()}
function calLabel(){return calPassed()?"Add next week to calendar":"Add to calendar"}
function calLabels(){for(const id of ["featCal","weekCal"]){const b=$(id);if(b&&b.textContent!==calLabel())b.textContent=calLabel()}
  /* review 18: after showtime the bar keeps one way to next week, "Same film next week"; its calendar button comes back once the night has moved */
  {const b=$("weekCal");if(b)b.style.display=calPassed()?"none":""}}
async function calAdd(trigger){if(!week)return;const f=FILMS.find(x=>x.id===week.id);if(!f)return;const g=week.double&&FILMS.find(x=>x.id===week.double);
  for(const x of [f,g])if(x)try{await ensureExact(x)}catch(e){}
  const now=new Date();let moved=false;
  if(weekShow()<now){week.date=nextWeekDate(week.day,week.time,now);saveWeek();renderWeek();refreshPrepTime();moved=true}
  const show=weekShow(),plan=calPlan(show,[...calDishes(f),...(g?calDishes(g):[])],now),title=f.title+(g?" + "+g.title:"");
  const url=(typeof REEL!=="undefined"?REEL.siteURL():location.origin+location.pathname)+"?film="+encodeURIComponent(f.id),o={title,show,plan,url,now,span:g?300:150,uid:`${slug(f.id)}-${weekDateKey(show)}@movie-night-spinner`};
  const name=`movie-night-${slug(f.title)}.ics`,ics=new Blob([calICS(o)],{type:"text/calendar;charset=utf-8"}),href=globalThis.REEL_NATIVE?"":URL.createObjectURL(ics);
  /* the app: the phone reminds you itself, and the calendar file goes out through the share sheet (an app's web view cannot download a file).
     No download link there, so no blob address is made. shared: "sent", "cancel", or "" if the share sheet failed */
  let appNote="",shared="";if(globalThis.REEL_NATIVE){appNote=appRemindNote(await appRemind(true));
    try{shared=await REEL.share({title:`Movie night: ${title}`,files:[{blob:ics,name}]})||""}catch(e){}}
  else{const a=document.createElement("a");a.href=href;a.download=name;a.hidden=true;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),0)}
  /* a time on another day than the show carries its day (a 12:15am showtime starts cooking 10:45pm the day before) */
  const when=d=>weekDateKey(d)===weekDateKey(show)?calClock(d):`${calDay(d)}, ${calClock(d)}`;
  const rows=[[`${calDay(show)}, ${calClock(show)}`,`Movie night: ${title}`],
    [plan.startNow?"Now":when(plan.start),`Start cooking${plan.startNow?" now":""}${plan.first?` with ${calMid(plan.first)}`:""}${plan.dish?`. Longest on the night: ${calLong(plan.dish,plan.lead)}`:""}`],
    ...(plan.early?[[plan.early.now?"Now":when(plan.early.at),`Make ahead${plan.early.now?", start now":""}: ${calList(plan.early)}`]]:[]),
    ...(plan.before?[[plan.before.now?"Now":when(plan.before.at),`${plan.before.now?"Start now, it still fits":calAhead(show,plan.before.at)}: ${calList(plan.before)}`]]:[]),
    ...(plan.before2?[[plan.before2.now?"Now":when(plan.before2.at),`${plan.before2.now?"Start now, it still fits":calAhead(show,plan.before2.at)}: ${calList(plan.before2)}`]]:[]),
    ...(plan.late?[["Too late",calLate(plan,o).replace(/^Too late to make ahead for this night: /,"")]]:[])];
  const dlg=document.createElement("dialog");dlg.className="counter pdfpick calask";dlg.setAttribute("aria-label","Add to calendar");
  dlg.innerHTML=`<div class="rate-box"><p class="rate-k">Add to calendar</p><h3>${ESC(title)}</h3>${moved?`<p class="cal-how">Last week's showtime has passed, so this is the same film next week.</p>`:""}<ul class="cal-rows">${rows.map(([w,t])=>`<li${w==="Too late"?' class="cal-late"':""}><b>${ESC(w)}</b><span>${ESC(t)}</span></li>`).join("")}</ul>
    ${appNote?`<p class="cal-how"><b>${ESC(appNote)}</b></p>`:""}${globalThis.REEL_NATIVE?"":`<p class="cal-how">${calHow(name)} <a href="${href}" download="${ESC(name)}">Download it again</a></p>`}
    <p class="cal-how cal-g"><b>Google Calendar</b> drops reminders from a file, so add each one here: ${calGoogle(o).map(([k,u])=>`<a href="${ESC(u)}" target="_blank" rel="noopener">${ESC(k)}</a>`).join(" ")}</p>
    <div class="pp-opts">${plan.late?`<button type="button" data-move>Move to ${ESC(calDay(plan.late.next))}</button>`:""}<button type="button" data-done><b>Done</b></button></div></div>`;
  dlg.addEventListener("click",e=>{if(e.target===dlg||e.target.closest("[data-done]"))dismissModal(dlg);
    if(e.target.closest("[data-move]")&&plan.late){week.date=weekDateKey(plan.late.next);saveWeek();renderWeek();refreshPrepTime();dismissModal(dlg);setTimeout(()=>calAdd(trigger),0)}});
  if(href)dlg.addEventListener("close",()=>setTimeout(()=>URL.revokeObjectURL(href),60000));
  mountModal(dlg,"[data-done]",trigger||document.activeElement);
  const fileWord=!globalThis.REEL_NATIVE?"Calendar file saved":shared==="sent"?"Calendar file sent":shared==="cancel"?"Calendar file not shared":"Calendar file could not be shared";
  $("status").textContent=`${moved?"Moved to next week. ":""}${fileWord}: movie night ${calDay(show)} ${calClock(show)}, start cooking ${plan.startNow?"now":when(plan.start)}.${plan.late?" "+calLate(plan,o):""}`}
/* the Prep sheet of the locked-in film shows its showtime and start time; redrawn when the time changes */
/* REEL comes from app-mode.js; uses outside a REEL_NATIVE or REEL_APP branch check it is there, so the site still works if that file fails to load */
/* the app: a notification on the phone when it's time to start cooking and at showtime for the locked-in night.
   ask=false only updates reminders already allowed, so a change of night or showtime moves them without asking again */
async function appRemind(ask){if(!globalThis.REEL_NATIVE)return "";if(!week){REEL.clearReminders();return ""}
  const f=FILMS.find(x=>x.id===week.id);if(!f)return "";const g=week.double&&FILMS.find(x=>x.id===week.double);
  try{for(const x of [f,g])if(x)await ensureExact(x);
    const show=weekShow(),plan=calPlan(show,[...calDishes(f),...(g?calDishes(g):[])],new Date()),title=f.title+(g?" + "+g.title:"");
    /* the prep-ahead steps get a reminder too, with the same words as the calendar file's alarms */
    const t=calText({title,show,plan,now:new Date()}),steps=[];
    if(plan.early&&!plan.early.now)steps.push({at:plan.early.at,title:"Make ahead today",body:t.early});
    if(plan.before&&!plan.before.now)steps.push({at:plan.before.at,title:"Prep ahead",body:t.ahead});
    if(plan.before2&&!plan.before2.now)steps.push({at:plan.before2.at,title:"Prep ahead",body:t.ahead2});
    return await REEL.remind({title,show,start:plan.startNow?null:plan.start,startText:`${title} at ${calClock(show)}${plan.first?`. Start with ${calMid(plan.first)}`:""}.`,steps,ask})}catch(e){return ""}}
/* the line under the calendar rows once phone reminders are set; Android with Alarms and reminders off may run a few minutes late */
const appRemindNote=r=>/^set/.test(r)?"Reminders are set on this phone for each time above that is still to come."+(/inexact/.test(r)?" Android may send them a few minutes late. For reminders on the minute, turn on Alarms and reminders for Reel Dinner in your phone's Settings.":""):r==="denied"?"Notifications are off for Reel Dinner, so turn them on in Settings to get reminders on this phone.":"";
function refreshPrepTime(){if(typeof current!=="undefined"&&current&&week&&(current.id===week.id||current.id===week.double)&&typeof refreshPlan==="function")refreshPlan()}
const trolleySessionTicks=new Map();
async function openTrolley(f,menuOverride,label){
  const modalTrigger=document.activeElement;
  await ensureExact(f);
  const mm=makeMenu(f,true);mm.counter=counterShop(f.id);
  /* the film's own list shares its ticks with the prep sheet; double feature and marathon lists keep their own */
  const own=!menuOverride;
  if(!menuOverride&&f._r2&&f._r2.dishes&&f._r2.dishes.length){if(f!==current)planLoad(f);menuOverride={s:[],m:[],w:[],d:[],shopping:planShopping(f)}}
  const serves=menuOverride&&menuOverride.serves||(f._r2?PLAN.guests:4);
  const groups=shopGroups(menuOverride||mm);
  /* review 24: a dry list (kids' mode, alcohol-free, family films) reads the same drink words as the card and Prep sheet ("4 x 375ml cans of ginger beer", not alcohol-free lager).
     Only the words shown change: each line keeps its own tick key, so ticks still match the Prep sheet. The cook's own extras are left as typed */
  const dryOn=typeof dryNow==="function"&&dryNow(f),dryL=new Set(groups.flatMap(([,l])=>l)),shown=x=>dryOn&&dryL.has(x)?dryText(x,true):x;
  if(own&&typeof extrasFor==="function"){const ex=extrasFor(f);if(ex.length)groups.push(["Your extras",ex])}const all=groups.flatMap(([,l])=>l);
  const o=document.createElement("dialog");o.className="trolley";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",label?`Shopping list: ${label}`:`Shopping list for ${f.title}`);
  const sessionKey=JSON.stringify([f.id,label||""]);
  if(!trolleySessionTicks.has(sessionKey))trolleySessionTicks.set(sessionKey,Object.create(null));
  const kf=own?tickKey:(x=>x);
  /* review 27: on a dry list, lines that now read the same drink show once with the amounts added; the folded lines tick with it */
  const view=groups.map(([g,l])=>[g,dryOn&&g!=="Your extras"?dryJoin(l.map(x=>[x,shown(x)])):l.map(x=>({x,of:[x],text:shown(x)}))]);
  const twin=new Map(),hid=new Set();view.forEach(([,l])=>l.forEach(e=>{if(e.of.length>1){twin.set(kf(e.x),e.of.slice(1).map(kf));e.of.slice(1).forEach(y=>hid.add(kf(y)))}}));
  const ticks=()=>own?sharedTicks(f):week&&week.id===f.id?(week.ticks||(week.ticks={})):trolleySessionTicks.get(sessionKey);
  const skip=k=>own&&typeof pantryHas==="function"&&pantryHas(f,k);const live=()=>all.filter(x=>!skip(kf(x))&&!hid.has(kf(x)));
  const tick=(k,on,quiet)=>{if(own)setTick(f,k,on,quiet);else{const t=ticks();if(on)t[k]=true;else delete t[k];if(!quiet&&week&&week.id===f.id)saveWeek()}};
  o.innerHTML=`<div class="trolley-in"><h3>${ESC(label||f.title)}</h3><p class="tp" id="tProg"></p><div class="bar"><i id="tBar"></i></div>${view.map(([a,l])=>`<h4>${ESC(a)}</h4><ul>${l.map(({x,text})=>`<li><label><input type="checkbox" data-k="${ESC(kf(x))}"${ticks()[kf(x)]?" checked":""}><span>${ESC(text)}</span></label></li>`).join("")}</ul>`).join("")}<div class="acts"><button class="go" type="button" data-a="share">Send to Notes or Reminders</button><button type="button" data-a="reset">Untick all</button><button type="button" data-a="done">Done</button></div><p class="msg" id="tMsg" role="status"></p></div>`;
  const prog=()=>{const L=live(),n=L.filter(x=>ticks()[kf(x)]).length;o.querySelector("#tProg").textContent=`${n} of ${L.length} in the trolley. Serves ${serves}.`;o.querySelector("#tBar").style.width=(L.length?100*n/L.length:0)+"%"};
  o.addEventListener("change",e=>{const k=e.target.dataset.k;if(!k)return;(twin.get(k)||[]).forEach(y=>tick(y,e.target.checked,true));tick(k,e.target.checked);o.querySelector("#tMsg").textContent="";prog()});
  const close=()=>dismissModal(o);
  o.addEventListener("click",async e=>{
    if(e.target===o)return close();const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==="done")close();
    if(a==="reset"){all.forEach(x=>tick(kf(x),false,true));if(week&&week.id===f.id)saveWeek();o.querySelectorAll("input").forEach(i=>i.checked=false);o.querySelector("#tMsg").textContent="";prog()}
    if(a==="share"){const left=view.map(([g,l])=>[g,l.filter(({x})=>!ticks()[kf(x)]&&!skip(kf(x)))]).filter(([,l])=>l.length);if(!left.length){o.querySelector("#tMsg").textContent=all.length?"Everything is in the trolley. Nothing left to send.":"This shopping list is empty.";return}const text=listText(f,left.map(([g,l])=>[g,l.map(e=>e.text)]),serves);
      try{const nat=typeof REEL!=="undefined"&&await REEL.share({title:`${f.title} shopping list`,text});if(nat){if(nat==="sent")o.querySelector("#tMsg").textContent="Sent."}
        else if(navigator.share){await navigator.share({title:`${f.title} shopping list`,text});o.querySelector("#tMsg").textContent="Sent."}else{await navigator.clipboard.writeText(text);o.querySelector("#tMsg").textContent="Copied. Paste it into Notes or Reminders."}}
      catch(err){if(!(err&&err.name==="AbortError"))o.querySelector("#tMsg").textContent="Couldn't share from here. Use Copy text under the menu instead."}}
  });
  if(!own&&!(week&&week.id===f.id))o.querySelector(".tp").insertAdjacentHTML("afterend",'<p class="tp">Lock this film in for the week to save your ticks.</p>');
  mountModal(o,"input,button",modalTrigger);prog();
  if(own&&typeof initTicket==="function")initTicket(o,f,{groups,view,all,kf,ticks,prog,skip,serves,twin,reopen:()=>{dismissModal(o);setTimeout(()=>openTrolley(f),60)}});
}
$("weekSet").addEventListener("click",()=>{if(current){setWeek(current);lockAsk(current,$("weekSet"))}});
/* after locking in: Director's cut (pick the dishes) or The full feature (cook the lot); either way the Prep sheet and shopping list follow */
async function lockAsk(f,trigger){if(!f)return;try{await ensureExact(f)}catch(e){}if(!f._r2||!(f._r2.dishes||[]).length)return;
  const o=document.createElement("dialog");o.className="counter pdfpick lockask";o.setAttribute("aria-label","Locked in: "+f.title);
  o.innerHTML=`<div class="rate-box"><p class="rate-k">Locked in: ${ESC(f.title)}</p><h3>Roll credits on the menu</h3>${week&&(week.id===f.id||week.double===f.id)?`<label class="lk-time">Showtime <select id="lockTime" aria-label="Showtime">${showOpts(weekTime(week.time))}</select></label>`:""}<div class="pp-opts">
   <button type="button" data-l="pick"><b>Director's cut</b><span>Pick the dishes. The shopping list follows what you tick.</span></button>
   <button type="button" data-l="all"><b>The full feature</b><span>Cook the lot. Every dish on the menu goes on the Prep sheet and shopping list.</span></button></div></div>`;
  /* review 16: the showtime is set as the film is locked in. A plan made a moment ago may move to next week if the new time has already gone tonight */
  {const lt=o.querySelector("#lockTime");if(lt)lt.addEventListener("change",e=>{if(!week)return;week.time=weekTime(e.target.value);week.date=nextWeekDate(week.day,week.time);saveWeek();renderWeek();refreshPrepTime();
    $("status").textContent=`Showtime set for ${clock(week.time)}.`})}
  o.addEventListener("click",async e=>{if(e.target===o)return dismissModal(o);const b=e.target.closest("[data-l]");if(!b)return;dismissModal(o);
    for(let i=0;i<30&&current!==f;i++)await new Promise(r=>setTimeout(r,100));if(current!==f)return;
    /* review 16: the Prep sheet drawn before the plan was locked in has no showtime chips, so draw it again now the week holds this film */
    refreshPrepTime();
    if(b.dataset.l==="all"){PLAN.off={};for(const x of planExtras(f))PLAN.on[x.n]=1;for(const x of planAll(f))if(x.spare)PLAN.on[x.orig||x.n]=1;planSave(f);refreshPlan();setTab("prep");
      {const pp=prep;if(pp)setTimeout(()=>pp.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"}),reduce?0:350)}
      const n=planDishes(f).length;$("status").textContent=`The full feature: all ${n} dishes are on the Prep sheet and shopping list.`}
    else{setTab("prep");const pb=$("planner"),d=pb&&pb.querySelector(".pl-pick");if(d){d.open=true;/* once the tab has drawn, land on the "Choose dishes" list itself with focus on the first tick, not on the planner box (the phone ended mid shopping list) */
        setTimeout(()=>{const c=d.querySelector("input[type=checkbox]");d.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});if(c)c.focus({preventScroll:true})},reduce?0:350)}
      $("status").textContent="Director's cut: tick the dishes you want. The shopping list follows."}});
  mountModal(o,"[data-l=pick]",trigger||document.activeElement)}

/* video store: browse every film like a rental store */
const SHOP_AISLES=[["Action and cops",["cop","street","philly"]],["Superheroes",["hero"]],["Sci-fi",["scifi","galaxy"]],["Horror",["horror"]],["Family",["kids","fairytale"]],["Fantasy and adventure",["wizard","adventure"]],["Comedy and teen",["teen","diner"]],["Romance",["romcom"]],["Crime and mob",["redsauce","deli","pizza"]],["Drama",["uptown","soul"]],["Westerns",["western"]],["Musicals",[]],["Around the world",["aussie","asian","mex","tiki"]],["Holiday",["xmas"]]];
const SHOP_AISLE_OF={};SHOP_AISLES.forEach(([n,ts])=>ts.forEach(t=>SHOP_AISLE_OF[t]=n));
/* aisles follow the film's genre (aisles.js, from TMDB); the food theme is only the fallback */
const aisleOf=f=>(typeof FILM_AISLE!=="undefined"&&FILM_AISLE[f.id])||SHOP_AISLE_OF[f.theme]||"";
const TMDB_IMG_SHOP="https://image.tmdb.org/t/p/";
const buzz=p=>{if(globalThis.REEL_NATIVE)return REEL.haptic(p);try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const hashN=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
/* staff picks: a hand-picked pool of well-loved films, 12 on the shelf each week; the new release wall: the 20 newest films */
const STAFF_POOL=["Back to the Future (1985)", "The Princess Bride (1987)", "Jaws (1975)", "Ghostbusters (1984)", "Raiders of the Lost Ark (1981)", "Die Hard (1988)", "Groundhog Day (1993)", "Paddington 2 (2017)", "My Neighbor Totoro (1988)", "Amélie (2001)", "The Castle (1997)", "Hunt for the Wilderpeople (2016)", "Toy Story (1995)", "Pulp Fiction (1994)", "Goodfellas (1990)", "The Big Lebowski (1998)", "Alien (1979)", "The Thing (1982)", "Mad Max: Fury Road (2015)", "Knives Out (2019)", "Ratatouille (2007)", "Galaxy Quest (1999)", "Hot Fuzz (2007)", "Shaun of the Dead (2004)", "Moonstruck (1987)", "When Harry Met Sally... (1989)", "Strictly Ballroom (1992)", "Muriel's Wedding (1994)", "Babe (1995)", "The Iron Giant (1999)", "Coco (2017)", "Everything Everywhere All at Once (2022)", "Get Out (2017)", "Arrival (2016)", "Casablanca (1942)", "Some Like It Hot (1959)", "Fargo (1996)", "Heat (1995)", "Big Night (1996)", "Chef (2014)", "Ferris Bueller's Day Off (1986)", "The Dish (2000)"];
let _picks=null,_newest=null;
const isPick=f=>{if(!_picks){const wk=Math.floor((Date.now()/864e5+3)/7),pool=STAFF_POOL.filter(id=>FILMS.some(x=>x.id===id)),n=pool.length,o=(wk*12)%Math.max(1,n);_picks=new Set(Array.from({length:Math.min(12,n)},(_,i)=>pool[(o+i)%n]))}return _picks.has(f.id)};
const isNew=f=>{if(!_newest)_newest=new Set(FILMS.slice().sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title)).slice(0,20).map(x=>x.id));return _newest.has(f.id)};
const HALLOWEEN_SOFT=new Set(["Hocus Pocus","The Addams Family","Addams Family Values","Beetlejuice","Casper","Ghostbusters","Ghostbusters II","Ghostbusters: Afterlife","Ghostbusters: Frozen Empire","The Nightmare Before Christmas","Gremlins","Gremlins 2: The New Batch","The Witches","Little Shop of Horrors","Young Frankenstein","Practical Magic","Monsters, Inc.","Monsters University","Labyrinth","Tremors","The Mummy","The Mummy Returns","Shaun of the Dead","What We Do in the Shadows","The Rocky Horror Picture Show","The Lost Boys","Fright Night","Night at the Museum"]);
const HALLOWEEN_DARK_EXTRA=new Set(["Alien","Aliens","Jaws","Wolf Creek","Psycho","The Silence of the Lambs"]);
const isSpookySeason=()=>{const d=new Date();return d.getMonth()===9||(d.getMonth()===10&&d.getDate()===1)};
function halloweenRows(list){
  const az=(a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,""));
  const soft=list.filter(f=>HALLOWEEN_SOFT.has(f.title)).sort(az);
  const dark=list.filter(f=>!HALLOWEEN_SOFT.has(f.title)&&(f.theme==="horror"||HALLOWEEN_DARK_EXTRA.has(f.title))).sort(az);
  const r=[];
  if(soft.length)r.push(["Halloween: all ages",soft,"Spooky fun for the whole house. Fine with the kids up.","spooky"]);
  if(dark.length)r.push(["Halloween: late show",dark,"Proper scares. Wait till the kids are in bed.","spooky"]);
  return r;
}
const isXmasSeason=()=>{const d=new Date();return d.getMonth()===11&&d.getDate()<=26};
/* seasonal calendar: each holiday gets its own shelf, swapped in by the date on this phone */
const dAt=(y,m,d)=>new Date(y,m,d),addD=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const easterOf=y=>{const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),n=h+l-7*m+114;return dAt(y,Math.floor(n/31)-1,n%31+1)};
const nthDay=(y,m,dow,n)=>{const f=dAt(y,m,1);return dAt(y,m,1+(dow-f.getDay()+7)%7+7*(n-1))};
const LUNAR={2025:[0,29],2026:[1,17],2027:[1,6],2028:[0,26],2029:[1,13],2030:[1,3],2031:[0,23],2032:[1,11],2033:[0,31],2034:[1,19],2035:[1,8],2036:[0,28],2037:[1,15],2038:[1,4],2039:[0,24],2040:[1,12]};
const byTitle=a=>{const t=new Set(a);return f=>t.has(f.title)},byTheme=(...t)=>f=>t.includes(f.theme);
const dishHit=rx=>f=>["S","M","W","K"].some(k=>(f[k]||[]).some(it=>rx.test(it[0])));
const SEASONS=[
 {id:"newyear",big:1,name:"New Year's Eve",note:"Films with a countdown to midnight in them. Bubbles on ice.",c:["#d9b54a","#1a1408","#8a6d1c"],win:y=>[dAt(y,11,27),dAt(y+1,0,2),dAt(y,11,31)],has:byTitle(["New Year's Eve","When Harry Met Sally...","Trading Places","Bridget Jones's Diary","About Time","Holiday Inn","The Godfather Part II","Forrest Gump"])},
 {id:"ausday",name:"Australia Day",note:"Home-grown films for the long weekend. Snags on the barbie.",c:["#1f8a4c","#fff","#0f4a28"],win:y=>[dAt(y,0,19),dAt(y,0,26)],has:byTheme("aussie")},
 {id:"summer",name:"Summer holidays",note:"School's out. Beach days, road trips and long nights before term goes back.",c:["#20b2c8","#fff8e0","#0d5c68"],win:y=>[dAt(y,0,3),dAt(y,0,25),dAt(y,0,3)],has:byTitle(["Point Break","Grease","Dirty Dancing","Caddyshack","Wet Hot American Summer","Jaws","The Sandlot","Lilo & Stitch","Luca","Moana","National Lampoon's Vacation","The Goonies","Stand by Me","Fast Times at Ridgemont High","Weekend at Bernie's","The Parent Trap"])},
 {id:"lunar",name:"Lunar New Year",note:"Dumplings, noodles and a full table for the new year.",c:["#d4202c","#ffd23f","#7a0f16"],win:y=>{const l=LUNAR[y];if(!l)return null;const d=dAt(y,l[0],l[1]);return[addD(d,-7),addD(d,7),d]},has:byTheme("asian")},
 {id:"valentine",name:"Valentine's Day",note:"Love stories for the couch. Share the popcorn.",c:["#e8457a","#fff","#8f1d45"],win:y=>[dAt(y,1,7),dAt(y,1,14)],has:byTheme("romcom")},
 {id:"pancake",name:"Pancake Day",note:"Every film with pancakes or waffles on the menu. Shrove Tuesday only comes once a year.",c:["#e0a43a","#2a1606","#8a5a12"],win:y=>{const d=addD(easterOf(y),-47);return[addD(d,-3),d]},has:dishHit(/pancake|waffle|cr[eê]pe|flapjack|hotcake|pikelet/i)},
 {id:"easter",big:1,name:"Easter",note:"Bunnies, chocolate and long weekend lunches.",c:["#9b7be0","#fff","#53388f"],win:y=>{const e=easterOf(y);return[addD(e,-9),addD(e,1),e]},has:byTitle(["Hop","Peter Rabbit","Peter Rabbit 2: The Runaway","Rise of the Guardians","Easter Parade","Easter Sunday","Charlie and the Chocolate Factory","Willy Wonka & the Chocolate Factory","Zootopia","Who Framed Roger Rabbit","Wallace & Gromit: The Curse of the Were-Rabbit","Alice in Wonderland","Chicken Run","Bambi"])},
 {id:"fools",name:"April Fools",note:"Spoofs and send-ups. Nothing on this shelf is meant to be taken seriously.",c:["#7bd23f","#1a2a06","#3d6e14"],win:y=>[dAt(y,2,29),dAt(y,3,1),dAt(y,3,1)],has:byTitle(["Airplane!","The Naked Gun: From the Files of Police Squad!","Hot Shots!","Spaceballs","Young Frankenstein","Blazing Saddles","Austin Powers: International Man of Mystery","Galaxy Quest","Shaun of the Dead","Hot Fuzz","Tropic Thunder","Zoolander","Ace Ventura: Pet Detective","Ace Ventura: When Nature Calls"])},
 {id:"anzac",name:"ANZAC Day",note:"Lest we forget. Anzac biscuits and a cuppa.",c:["#b3202a","#fff","#5c0f14"],win:y=>[dAt(y,3,18),dAt(y,3,25)],has:byTitle(["Gallipoli","The Lighthorsemen","Beneath Hill 60","Danger Close: The Battle of Long Tan","The Water Diviner","Australia"])},
 {id:"starwars",name:"Star Wars Day",note:"May the fourth be with you.",c:["#ffe81f","#000","#8a7d00"],win:y=>[dAt(y,4,1),dAt(y,4,4)],has:byTheme("galaxy")},
 {id:"mum",big:1,name:"Mother's Day",note:"For mum. She picks the film and nobody argues.",c:["#f08bb0","#3a0a1e","#a3456b"],win:y=>{const d=nthDay(y,4,0,2);return[addD(d,-7),d]},has:byTitle(["Mother's Day","Mamma Mia!","Freaky Friday","Lady Bird","Waitress","Juno","The Blind Side","Moana","Brave","Coco","Turning Red","Everything Everywhere All at Once","The Incredibles","Tangled","The Family Stone","Lilo & Stitch","Julie & Julia","Matilda","Mary Poppins","Easter Sunday","The Farewell","Crazy Rich Asians"])},
 {id:"xmasjuly",name:"Christmas in July",note:"It's cold enough. Roast on, tree up, Christmas films back out.",c:["#2f7a4f","#fff","#164029"],win:y=>[dAt(y,6,1),dAt(y,6,31),dAt(y,6,1)],has:byTheme("xmas")},
 {id:"dad",big:1,name:"Father's Day",note:"Dad's pick. Dad jokes included.",c:["#2d6fd1","#fff","#163a73"],win:y=>{const d=nthDay(y,8,0,1);return[addD(d,-7),d]},has:byTitle(["Father of the Bride","Field of Dreams","Big Daddy","Big Fish","Daddy's Home","Hook","Finding Nemo","Indiana Jones and the Last Crusade","Chef","Taken","Jingle All the Way","National Lampoon's Vacation","The Lion King","Interstellar","Mrs. Doubtfire","Back to the Future","Uncle Buck","The Great Outdoors","Guardians of the Galaxy Vol. 2","The Incredibles","Rudy","The Castle"])},
 {id:"footy",name:"Finals season",note:"Sports films for footy finals month. Pies at half time.",c:["#1c3f94","#ffd23f","#0c1f4d"],win:y=>[dAt(y,8,1),dAt(y,8,30),dAt(y,8,1)],has:byTitle(["Remember the Titans","Rudy","Field of Dreams","Major League","BASEketball","Semi-Pro","Kicking & Screaming","Dodgeball: A True Underdog Story","The Mighty Ducks","Cool Runnings","The Blind Side","Happy Gilmore","The Waterboy","Rocky","Rocky II","Rocky III","Rocky IV","Creed","Space Jam","Blades of Glory","Talladega Nights: The Ballad of Ricky Bobby","Caddyshack","Bull Durham","Jerry Maguire","Little Giants","The Sandlot","The Fighter","Raging Bull","Million Dollar Baby","Kingpin","Hot Rod","The Karate Kid"])},
 {id:"pirate",name:"Talk Like a Pirate Day",note:"Arr. Pirates, treasure maps and the high seas.",c:["#222","#f4e3b5","#000"],win:y=>[dAt(y,8,13),dAt(y,8,19)],has:byTitle(["Pirates of the Caribbean: The Curse of the Black Pearl","Pirates of the Caribbean: Dead Man's Chest","Pirates of the Caribbean: At World's End","Hook","The Goonies","Muppet Treasure Island","Treasure Planet","The Princess Bride","Peter Pan","Moana","National Treasure"])},
 {id:"bttf",name:"Back to the Future Day",note:"21 October 2015 came and went. Time travel films all week.",c:["#2fb7ff","#0b1236","#12608a"],win:y=>[dAt(y,9,15),dAt(y,9,21)],has:byTitle(["Back to the Future","Back to the Future Part II","Back to the Future Part III","Bill & Ted's Excellent Adventure","Groundhog Day","Hot Tub Time Machine","Time Bandits","About Time","The Terminator","Terminator 2: Judgment Day","Edge of Tomorrow","Interstellar","Palm Springs","Kate & Leopold","13 Going on 30","Avengers: Endgame","X-Men: Days of Future Past","Harry Potter and the Prisoner of Azkaban","Meet the Robinsons","Napoleon Dynamite","Frequency","Men in Black 3"])},
 {id:"halloween",big:1,name:"Halloween",note:"Two shelves: one for the kids, one for after they're in bed.",c:["#ff7a1a","#2a0b3d","#a8440a"],win:y=>[dAt(y,9,1),dAt(y,10,1),dAt(y,9,31)],rows:list=>halloweenRows(list).filter(r=>!(kidsMode&&r[0]==="Halloween: late show"))},
 {id:"cup",name:"Melbourne Cup",note:"The race that stops a nation. Fascinators optional.",c:["#c9962c","#1b0f0a","#6e4f12"],win:y=>{const d=nthDay(y,10,2,1);return[addD(d,-6),d]},has:byTitle(["Phar Lap","Seabiscuit","The Man from Snowy River"])},
 {id:"movember",name:"Movember",note:"A shelf of great moustaches for the month. Grow one or just watch one.",c:["#8a5a2b","#fff4e2","#4a2e12"],win:y=>[dAt(y,10,1),dAt(y,10,30),dAt(y,10,1)],has:byTitle(["Tombstone","Anchorman: The Legend of Ron Burgundy","Anchorman 2: The Legend Continues","Top Gun","Top Gun: Maverick","Nacho Libre","Smokey and the Bandit","Three Amigos!","Dodgeball: A True Underdog Story","Super Troopers","The Good, the Bad and the Ugly"])},
 /* Friday the 13th falls one to three times a year: the shelf goes up the Monday before whichever one comes next */
 {id:"fri13",name:"Friday the 13th",note:"Unlucky for some. Lights off, phones down.",c:["#9e1b1b","#f2e6d8","#3a0606"],win:y=>{const t=dAt(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),all=[];for(let m=0;m<12;m++){const d=dAt(y,m,13);if(d.getDay()===5)all.push(d)}const d=all.find(d=>d>=t)||all[0];return d?[addD(d,-4),d,d]:null},has:f=>isLate(f)},
 {id:"xmas",big:1,name:"Christmas",note:"Pop the tree lights on and pick one.",c:["#c8102e","#fff","#7a0a1c"],cls:"festive",win:y=>[dAt(y,10,1),dAt(y,11,26),dAt(y,11,25)],has:byTheme("xmas")}
];
const dayStart=d=>dAt(d.getFullYear(),d.getMonth(),d.getDate());
function seasonState(now){
  const t=dayStart(now||new Date()),y=t.getFullYear();
  return SEASONS.map(s=>{let on=false,next=null,day=null,end=null;
    for(const yy of[y-1,y,y+1]){const w=s.win(yy);if(!w)continue;const[a,b,c]=w;if(t>=a&&t<=b){on=true;end=b}if(a>t&&(!next||a<next)){next=a;day=c||b}}
    return{s,on,next,day,end}});
}
const daysTo=d=>Math.round((d-dayStart(new Date()))/864e5);
/* a shelf colour as text on the aisle's purple (its lightest stripe): lifted toward white until it reads at 4.5 to 1 (Movember's brown, Friday the 13th's red) */
function inkOn(c,bg){const rgb=h=>{h=h.replace("#","");if(h.length===3)h=h.replace(/./g,"$&$&");return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))},lum=a=>{const v=a.map(x=>{x/=255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4});return .2126*v[0]+.7152*v[1]+.0722*v[2]};
  const b=lum(rgb(bg)),a=rgb(c);for(let t=0;t<=1.0001;t+=.05){const m=a.map(x=>Math.round(x+(255-x)*t));const l=lum(m);if((Math.max(l,b)+.05)/(Math.min(l,b)+.05)>=4.6)return "#"+m.map(x=>x.toString(16).padStart(2,"0")).join("")}return "#ffffff"}
/* one spelling for every month in the calendar strip: en-AU short months come out as "July", "Sept" and "Nov" side by side (review 12) */
const MON3=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],fmtDay=d=>d.getDate()+" "+MON3[d.getMonth()];
function seasonRows(s,list,later){
  const st=`--sg:${s.c[0]};--sf:${s.c[1]};--ss:${s.c[2]};--sl:${inkOn(s.c[0],"#2e1c4e")}`;
  if(s.rows)return s.rows(list).map(r=>[r[0],r[1],later?`Back on ${fmtDay(later)}. ${r[2]}`:r[2],"season "+(r[3]||"")+(later?" later":""),st,s.id]);
  const r=list.filter(s.has).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));
  return r.length?[[s.name,r,later?`Back on ${fmtDay(later)}. ${s.note}`:s.note,"season "+(s.cls||"")+(later?" later":""),st,s.id]]:[];
}
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
let outDay="",outSet=new Set();
const isOut=f=>{const k=todayKey();if(k!==outDay){outDay=k;outSet=new Set(FILMS.filter(x=>isNew(x)&&!watched.has(x.id)).sort((a,b)=>hashN(a.id+k)-hashN(b.id+k)).slice(0,3).map(x=>x.id))}return outSet.has(f.id)};
const isClam=f=>f.theme==="kids"||f.theme==="fairytale";
const isTuesday=()=>new Date().getDay()===2;
/* matches the window sign: new releases $4 for 3 nights ($2 on Tuesdays), weeklys $2 for 7 nights */
const priceOf=f=>isNew(f)?(isTuesday()?2:4):2;
const priceTag=f=>isNew(f)?(isTuesday()?"Tuesday $2":"3 nights $4"):"Weekly $2";
const STAFF=["Kate","Sam","Dave","Michelle","Andrew","Lisa","Ben","Nicole"];
const TALK={"Action and cops":["Turn it up.","Still holds up.","Proper Friday night film."],"Superheroes":["Stay for the end credits.","Better than you remember.","Big screen energy."],"Sci-fi":["Watch it twice.","Still holds up.","Lights down for this one."],"Horror":["Lights off. Doors locked.","Not one for the kids.","Watch it with company."],"Family":["One for the whole house.","Kids will want it again.","Grown-ups will love it too."],"Fantasy and adventure":["Settle in for this one.","Pure Saturday afternoon.","Still holds up."],"Comedy and teen":["Quote it all week.","Better with a crowd.","Still makes me laugh."],"Romance":["Have the tissues handy.","Date night sorted.","Better than you remember."],"Crime and mob":["Don't skip the ending.","Clear your evening.","A proper classic."],"Drama":["Worth the slow start.","Have the tissues handy.","Stays with you."],"Westerns":["Saddle up.","A proper classic.","Watch it on the big telly."],"Musicals":["Sing along, nobody minds.","You will be humming it all week.","Turn the sound right up."],"Around the world":["Something different tonight.","Worth the subtitles.","A hidden gem."],"Holiday":["Put the tree lights on.","Every year without fail.","One for the whole house."]};
const talkFor=f=>{const h=hashN(f.id+"t"),a=aisleOf(f)||"Drama",L=(a==="Horror"&&isKidSafe(f))?["Spooky, not scary.","Fine with the kids up.","A Halloween regular."]:(TALK[a]||TALK.Drama);return [STAFF[h%STAFF.length],L[(h>>>3)%L.length]]};
const weeklyCol=f=>["#ff3d9a","#7ee08a","#ff9f1c","#ffe14d","#4dd8ff"][hashN(f.id+"w")%5];
/* membership card, rentals and late fees live on this phone only */
let member=null;
try{member=JSON.parse(localStorage.getItem("mns-member")||"null")}catch(e){member=null}
if(!member||!member.no)member={no:String(100000+Math.floor(Math.random()*900000)),since:Date.now(),name:"",rentals:0,aisles:{},out:[]};
const saveMember=()=>{try{localStorage.setItem("mns-member",JSON.stringify(member))}catch(e){}queueSync()};
saveMember();
let counter={};
try{counter=JSON.parse(localStorage.getItem("mns-counter")||"{}")}catch(e){counter={}}
const COUNTER={choc:["Choc tops","4 choc top ice creams@Frozen"],pop:["Popcorn","100g popping corn@Pantry"],lolly:["Mixed lollies","1 large bag mixed lollies@Pantry"]};
const counterShop=id=>(counter[id]||[]).filter(k=>COUNTER[k]).map(k=>COUNTER[k][1]);
function lateFees(){
  const now=Date.now();
  return (member.out||[]).filter(r=>!watched.has(r.id)&&r.due<now).map(r=>({f:FILMS.find(x=>x.id===r.id),days:Math.ceil((now-r.due)/864e5)})).filter(x=>x.f);
}
/* Code 39 barcode for the member card, so the bars really are the member number */
const C39={0:"nnnwwnwnn",1:"wnnwnnnnw",2:"nnwwnnnnw",3:"wnwwnnnnn",4:"nnnwwnnnw",5:"wnnwwnnnn",6:"nnwwwnnnn",7:"nnnwnnwnw",8:"wnnwnnwnn",9:"nnwwnnwnn",G:"nnnnnwwnw",V:"nwwnnnnnw","*":"nwnnwnwnn"};
function code39(txt){
  let x=0,r="";
  for(const ch of "*"+txt+"*"){const p=C39[ch];if(!p)continue;for(let i=0;i<9;i++){const w=p[i]==="w"?3:1;if(i%2===0)r+=`<rect x="${x}" width="${w}" height="10"/>`;x+=w}x+=1}
  return `<svg class="mc-bars" viewBox="0 0 ${x-1} 10" preserveAspectRatio="none" aria-hidden="true">${r}</svg>`;
}
function renderMember(){
  const box=$("memberCard");if(!box)return;
  const since=new Date(member.since).toLocaleString("en-AU",{month:"short",year:"numeric"});
  const fav=Object.entries(member.aisles||{}).sort((a,b)=>b[1]-a[1])[0];
  const outList=(member.out||[]).filter(r=>!watched.has(r.id)).map(r=>({r,f:FILMS.find(x=>x.id===r.id)})).filter(x=>x.f);
  const late=lateFees();const owe=late.reduce((n,x)=>n+Math.min(x.days,10),0);
  const fee=late.length?`Late fees: $${owe}.00 on ${late.slice(0,2).map(x=>x.f.title).join(" and ")}${late.length>2?` and ${late.length-2} more`:""}. Mark it seen to clear the slate.`:"Late fees: none. Good member.";
  const sinceMY=new Date(member.since).toLocaleString("en-AU",{month:"2-digit",year:"2-digit"});
  box.innerHTML=`<div class="mc" role="group" aria-label="Your Galaxy Video member card"><img class="mc-art" src="assets/brand/member-card.webp" alt="" width="1012" height="638" decoding="async"><p class="mc-no foil" aria-label="Member number ${member.no}">${member.no.slice(0,3)} ${member.no.slice(3)}</p><p class="mc-since foil">Member since ${sinceMY}</p>${code39("GV"+member.no)}<span class="mc-sig" aria-hidden="true">${ESC(member.name||"")}</span><span class="mc-name-show foil" aria-hidden="true">${ESC(member.name||"")}</span><input id="memberName" class="mc-name" type="text" maxlength="24" autocomplete="off" aria-label="Name on your member card" placeholder="Add your name" value="${ESC(member.name||"")}"></div><p class="member-meta"><span>Since ${since}</span><span>Rentals ${member.rentals||0}</span>${fav?`<span>Usually in ${ESC(fav[0])}</span>`:""}</p><p class="member-fee${late.length?" owing":""}">${ESC(fee)}</p>${outList.length?`<ul class="member-out">${outList.map(({f,r})=>`<li><button type="button" class="out-open" data-open="${ESC(f.id)}" aria-label="Open the menu for ${ESC(f.title)}"><span class="t">${ESC(f.title)}</span><small>due ${new Date(r.due).toLocaleString("en-AU",{weekday:"short",day:"numeric",month:"short"})}. Tap for the menu</small></button><button type="button" data-ret="${ESC(f.id)}">Return</button></li>`).join("")}</ul>${outList.length>1?'<button type="button" class="out-all" data-retall="1">Return them all</button>':""}`:""}<div class="member-sync">${member.pin?`<p id="syncNote">${ESC(syncNote())}</p><button type="button" data-sync="out">Sign out here</button><button type="button" class="sync-del" data-sync="del">Delete my online card</button>`:`<button type="button" data-sync="join">Put my card online</button><button type="button" data-sync="in">Use my card from another device</button>`}<p class="sync-priv"><a href="privacy.html">Privacy policy</a></p></div>`;
  $("memberName").addEventListener("input",e=>{const v=e.target.value;box.querySelector(".mc-name-show").textContent=v;box.querySelector(".mc-sig").textContent=v.trim()});
  $("memberName").addEventListener("change",e=>{member.name=e.target.value.trim();saveMember();renderShop()});
  box.querySelectorAll("[data-ret]").forEach(b=>b.addEventListener("click",()=>{const f=FILMS.find(x=>x.id===b.dataset.ret);if(f)openChute(f)}));
  box.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{const f=FILMS.find(x=>x.id===b.dataset.open);if(f)openRentalMenu(f)}));
  {const ra=box.querySelector("[data-retall]");if(ra)ra.addEventListener("click",()=>{const n=(member.out||[]).filter(r=>!watched.has(r.id)).length;member.out=[];saveMember();renderMember();renderShop();const st=$("shopCount");if(st)st.textContent=`All ${n} tapes back in the returns chute. No late fees.`;buzz(20)})}
  box.querySelectorAll("[data-sync]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.sync;if(k==="out"){delete member.pin;try{localStorage.setItem("mns-member",JSON.stringify(member))}catch(e){}renderMember()}else if(k==="del")deleteOnlineCard(b);else openSyncForm(k)}));
}
function dueBack(f){
  const d=new Date();
  if(isNew(f)){d.setDate(d.getDate()+3)}else{d.setDate(d.getDate()+7)}
  d.setHours(19,0,0,0);return d;
}
/* the blue hire case: the shop's own sleeve with a cut-down cover that has sat in the front window for years,
   sun-bleached on one side, rubbed thin at the edges, taped back in, with the shop sticker and a Dymo title strip */
function hireCaseHTML(f){
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];
  const h=hashN(f.id+"case"),r=((h%23)-11)/10,side=h%2?"left":"right",nick=["tl","tr","bl","br"][(h>>3)%4];
  const fade=(.22+((h>>5)%10)/100).toFixed(2),tape=(h>>7)%3;
  /* scratches in the plastic, different on every case */
  let sc="";for(let i=0;i<9;i++){const k=hashN(f.id+"s"+i),x=k%100,y=(k>>7)%100,l=12+(k>>13)%38,a=-60+(k>>17)%40;sc+=`<line x1='${x}' y1='${y}' x2='${(x+l*Math.cos(a*Math.PI/180)).toFixed(1)}' y2='${(y+l*Math.sin(a*Math.PI/180)).toFixed(1)}' stroke='white' stroke-opacity='${(.18+(k%20)/100).toFixed(2)}' stroke-width='${(.25+(k>>9)%4/10).toFixed(2)}'/>`}
  const scratch=svgURI(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${sc}</svg>`);
  /* where years of hands have rubbed the ink off: fine scuffs, only around the edges and corners */
  const seed=h%97;
  const rub=svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300'><filter id='r' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.55 .42' numOctaves='2' seed='${seed}'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 .98  0 0 0 0 .94  0 0 0 -12 6.9'/></filter><rect width='200' height='300' filter='url(#r)'/></svg>`);
  const title=(f.title.length>26?f.title.replace(/:.*$/,""):f.title).toUpperCase();
  return `<div class="hirecase" aria-hidden="true"><img class="hc-shell" src="assets/hero/hirecase.webp" alt="">
    ${p?`<div class="hc-sleeve nick-${nick}" style="--r:${r}deg;--fade:${fade}">
      <img class="hc-poster" src="${TMDB_IMG}w342${ESC(p)}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('none')">
      <i class="hc-sun ${side}"></i><i class="hc-rub" style="background-image:url('${rub}')"></i><i class="hc-lift"></i><i class="hc-grain"></i><i class="hc-crease c${h%3}"></i><i class="hc-edge"></i>
    </div>`:`<div class="hc-sleeve none"></div>`}
    ${tape!==1?`<i class="hc-tape t1"></i>`:""}${tape!==2?`<i class="hc-tape t2"></i>`:""}
    <i class="hc-plastic"></i><i class="hc-scratch" style="background-image:url('${scratch}')"></i>
    <span class="hc-sticker" style="--sr:${(((h>>9)%7)-3)*.6}deg"><img src="assets/brand/case-sticker.webp" alt="" width="600" height="420" decoding="async"><b>${String(hashN(f.id)%9000+1000)}</b></span>
    <span class="hc-dymo fit" style="--dr:${(-r*.8).toFixed(2)}deg"><span class="fit-t">${ESC(title)}</span></span>
  </div>`;
}
function openSlip(f,go){
  const modalTrigger=document.activeElement;setTimeout(()=>sfx.print(),350);
  const due=dueBack(f),now=new Date();const picked=new Set(counter[f.id]||[]);
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`Rental slip for ${f.title}`);
  const fmt=d=>d.toLocaleString("en-AU",{weekday:"short",day:"numeric",month:"short"});
  o.innerHTML=`<div class="slip"><h3 class="slip-logo"><img src="assets/brand/galaxy-video-wide-600.webp" srcset="assets/brand/galaxy-video-wide-600.webp 600w, assets/brand/galaxy-video-wide-1200.webp 1200w" sizes="300px" width="600" height="154" alt="Galaxy Video" decoding="async"></h3><p class="c">Open 7 days. Till late.</p><hr><dl><dt>Member</dt><dd>${member.name?ESC(member.name):"No. "+member.no}</dd><dt>Date</dt><dd>${fmt(now)}</dd><dt>Title</dt><dd>${ESC(f.title)} (${f.year})</dd><dt>Hire</dt><dd>${isNew(f)?(isTuesday()?"New release, $2 Tuesday":"New release, 3 nights"):"Weekly"} $${priceOf(f).toFixed(2)}</dd><dt>Due back</dt><dd>${fmt(due)}, 7pm</dd><dt>Paid</dt><dd>$10 note, change $${(10-priceOf(f)).toFixed(2)}</dd></dl>${hireCaseHTML(f)}<p class="hc-k">Box swapped for a hire case. ${isNew(f)?"The cover went in that sleeve this week and it's still glossy.":+f.year<2000?"The cover's been in that sleeve since the shop opened.":"The cover's had a few years in that sleeve."}</p><button type="button" class="peek" data-a="peek" aria-expanded="false">Preview the menu</button><div class="peekbox" hidden></div><div class="stamp" aria-hidden="true">Be kind<br>please rewind</div><hr><h4>Anything from the counter?</h4><div class="lollies">${Object.entries(COUNTER).map(([k,[n]])=>`<label><input type="checkbox" value="${k}"${picked.has(k)?" checked":""}> ${n}</label>`).join("")}</div><p class="small">Ticked treats go on this film's shopping list.</p><hr><p class="c">Late fee $1 a day. No drop box after 10pm.</p><div class="acts"><button type="button" data-a="back">Put it back</button><button type="button" class="go" data-a="go">Roll the film</button></div></div>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{
    if(e.target===o)return close();
    const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==="back")return close();
    if(a==="peek"){const box=o.querySelector(".peekbox"),btn=e.target,open=box.hidden;
      if(open&&!box.innerHTML&&typeof fmtLoad==="function"&&FMT_INDEX[f.id]&&!fmtSpec(f)){btn.disabled=true;fmtLoad(f).then(()=>{btn.disabled=false;btn.click()});return}
      if(open&&!box.innerHTML){const sp=typeof fmtSpec==="function"&&fmtSpec(f);const m=sp?fmtMenu(f,sp):makeMenu(f,true);
        const list=sp?m.all:[...m.s,...m.m,...m.w,...m.d];
        box.innerHTML=`<h4>Tonight's menu</h4><ol>${list.map(it=>`<li><b>${ESC(it.label||it.n)}</b><span>${ESC(it.film||it.note||"")}</span></li>`).join("")}</ol><p class="small">Serves four. Full menu, method and shopping list once you roll the film.</p>`}
      box.hidden=!open;btn.setAttribute("aria-expanded",open);btn.textContent=open?"Hide the menu":"Preview the menu";return}
    counter[f.id]=[...o.querySelectorAll(".lollies input:checked")].map(i=>i.value);
    if(!counter[f.id].length)delete counter[f.id];
    try{localStorage.setItem("mns-counter",JSON.stringify(counter))}catch(err){}
    member.rentals=(member.rentals||0)+1;
    const aisle=aisleOf(f);if(aisle)member.aisles[aisle]=(member.aisles[aisle]||0)+1;
    member.out=[{id:f.id,due:due.getTime()},...(member.out||[]).filter(r=>r.id!==f.id)].slice(0,6);
    saveMember();renderMember();buzz(30);
    close();go();
  });
  /* the slip opens at the top (member, date, due back, then the cover): focus goes to the slip itself, not "Roll the film" at the foot,
     so no phone scrolls down to a focused button; Tab still reaches every control in order */
  mountModal(o,null,modalTrigger);o.focus({preventScroll:true});
  const top=()=>{if(document.activeElement===o)o.scrollTop=0};top();requestAnimationFrame(top);setTimeout(top,150);
}
/* classification sticker */
const rateCls=r=>r.replace(/\s/g,"");
/* stars and the return chute */
if(!member.stars)member.stars={};
function starsHTML(f){const n=member.stars[f.id]||0;return `<p class="stars-k">Your stars</p><div class="stars" role="group" aria-label="Your stars for ${ESC(f.title)}">${[1,2,3,4,5].map(i=>`<button type="button" data-star="${i}" class="${i<=n?"on":""}" aria-label="${i} star${i>1?"s":""}" aria-pressed="${i===n}">★</button>`).join("")}</div>`}
function wireStars(root,f,onSet){root.querySelectorAll("[data-star]").forEach(b=>b.addEventListener("click",()=>{const n=+b.dataset.star;member.stars[f.id]=member.stars[f.id]===n?0:n;if(!member.stars[f.id])delete member.stars[f.id];saveMember();root.querySelectorAll("[data-star]").forEach(x=>{x.classList.toggle("on",+x.dataset.star<=(member.stars[f.id]||0));x.setAttribute("aria-pressed",+x.dataset.star===(member.stars[f.id]||0))});buzz(10);onSet&&onSet()}))}
function openChute(f,after){
  const modalTrigger=document.activeElement;
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`Return ${f.title}`);
  o.innerHTML=`<div class="chute"><h3>Return chute</h3><p>${ESC(f.title)}. How was it?</p><div class="drop">${p?`<img alt="" src="${TMDB_IMG_SHOP}w185${ESC(p)}">`:""}<div class="slot"><span>Returns</span></div></div>${starsHTML(f)}<div class="acts"><button type="button" data-a="back">Not yet</button><button type="button" class="go" data-a="drop">Drop it in</button></div></div>`;
  const close=()=>dismissModal(o);
  wireStars(o,f);
  o.addEventListener("click",e=>{
    if(e.target===o)return close();const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==="back")return close();
    if(a==="drop"){
      o.querySelector(".chute").classList.add("dropped");buzz([15,60,25]);setTimeout(()=>{try{sfx.clunk()}catch(e){}},reduce?0:350);
      member.out=(member.out||[]).filter(r=>r.id!==f.id);
      if(!watched.has(f.id)){watched.add(f.id);saveWatched();if(!spinning){setList();updateWatchButton()}}
      saveMember();
      setTimeout(()=>{close();renderShop();after&&after()},reduce?0:800);
    }
  });
  mountModal(o,".go",modalTrigger);
}
function topShelf(list){return list.filter(f=>(member.stars[f.id]||0)>=4).sort((a,b)=>(member.stars[b.id]-member.stars[a.id])||a.title.localeCompare(b.title))}

/* kids mode, shared by the wheel and the shop */
function setKidsUI(){try{renderMotw()}catch(e){};const b=$("kidsBtn");b.setAttribute("aria-pressed",kidsMode);b.textContent=kidsMode?"Kids mode on":"Kids mode off";$("shopKids").checked=kidsMode;document.body.classList.toggle("kids-on",kidsMode)}
function setKids(v){
  kidsMode=v;try{localStorage.setItem("mns-kids",v?"1":"0")}catch(e){}
  setKidsUI();
  try{setSync()}catch(e){}
  /* the planner and prep sheet follow kids mode straight away (alcohol-free versions) */
  try{if(current&&current._r2){planWire(current);prep.innerHTML=prepHTML(current,current.menu);const h=prep.hidden;prep.hidden=false;fitPrep(prep);prep.hidden=h}}catch(e){}
  if(!spinning)setList();
  if(!$("viewShop").hidden)renderShop();
  if(!$("viewCrave").hidden)renderCrave();
  queueSync();
}
$("kidsBtn").addEventListener("click",()=>setKids(!kidsMode));
$("shopKids").addEventListener("change",e=>setKids(e.target.checked));

/* double feature */
function itemShop(menu,it){
  if(Array.isArray(it.shop))return it.shop;
  const how=((it.how||"")+" "+(it.n||"")).toLowerCase();
  return (menu.shopping||[]).filter(x=>{const words=x.split("@")[0].toLowerCase().replace(/[0-9.,/()]+(g|kg|ml|l|cm)?\b/g," ").split(/\s+/).filter(w=>w.length>=4);return words.some(w=>how.includes(w.replace(/s$/,"")))});
}
/* a double feature or marathon list is built from each dish's own recipe, scaled to the guests */
function pickedShop(m,G){
  const list=[],extra=[];
  for(const it of [...m.s,...m.m,...m.w,...m.d]){const f=it._f,r2=f&&f._r2&&f._r2.dishes,d=r2&&r2.find(z=>z.n===(it.orig||it.n));
    if(d){const x=planDish(f,d);if(!x.blocked)list.push({d:x,k:G/((f._r2&&f._r2.serves)||4)})}else extra.push(...(it.shop||[]))}
  return [...shopLines(list),...extra];
}
async function doubleMenu(a,b,G){
  G=G||USUAL;
  await ensureExact(a);await ensureExact(b);
  const A=makeMenu(a,true),B=makeMenu(b,true);
  const pickIt=(menu,it,film)=>Object.assign({},it,{film:film.title,_f:film,shop:itemShop(menu,it)});
  const m={s:[pickIt(A,A.s[0],a),pickIt(B,B.s[0],b)],m:[pickIt(A,A.m[0],a)],w:[pickIt(B,B.w[0],b)],d:[A.d[0]&&pickIt(A,A.d[0],a),B.d[0]&&pickIt(B,B.d[0],b)].filter(Boolean)};
  m.counter=[...new Set([...counterShop(a.id),...counterShop(b.id)])];
  m.serves=G;m.shopping=pickedShop(m,G);
  return m;
}
function pairFor(a,pool){
  const others=pool.filter(f=>f.id!==a.id);
  const sameTheme=others.filter(f=>f.theme===a.theme);
  const sameAisle=others.filter(f=>aisleOf(f)&&aisleOf(f)===aisleOf(a));
  const near=x=>x.filter(f=>Math.abs(+f.year-+a.year)<=12);
  const c=[near(sameTheme),sameTheme,near(sameAisle),sameAisle,others].find(x=>x.length);
  return c?c[Math.floor(Math.random()*c.length)]:null;
}
async function openDouble(pa,pb){
  const modalTrigger=document.activeElement;
  if(pa&&!pa.id)pa=null;
  const pool=list.length>1?list:FILMS.filter(f=>!kidsMode||isKidSafe(f));
  const a=pa||pool[Math.floor(Math.random()*pool.length)],b=pb||pairFor(a,pool);if(!b)return;
  let G=USUAL,m=await doubleMenu(a,b,G);
  const img=f=>{const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];return p?`<img alt="${ESC(f.title)} poster" src="https://image.tmdb.org/t/p/w342${ESC(p)}">`:""};
  const li=it=>`<li>${ESC(it.n)} <small>(${ESC(it.film)})</small></li>`;
  const o=document.createElement("dialog");o.className="trolley";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Double feature");
  o.innerHTML=`<div class="df"><h3>Tonight's double feature</h3><div class="df-pair"><figure>${img(a)}<figcaption><b>First up</b>${ESC(a.title)} (${a.year})</figcaption></figure><span class="df-amp" aria-hidden="true">+</span><figure>${img(b)}<figcaption><b>Then</b>${ESC(b.title)} (${b.year})</figcaption></figure></div><p class="msg">One menu for both films. A snack and a drink from each, the main from the first film and dessert at intermission.</p><div class="df-g"><span>Guests</span><button type="button" data-a="g-" aria-label="Fewer guests">-</button><output id="dfG" aria-live="polite">${G}</output><button type="button" data-a="g+" aria-label="More guests">+</button></div><h4>Snacks</h4><ul>${m.s.map(li).join("")}</ul><h4>Main</h4><ul>${m.m.map(li).join("")}</ul><h4>Intermission dessert</h4><ul>${m.w.map(li).join("")}</ul><h4>To drink</h4><ul>${m.d.map(li).join("")}</ul><div class="acts"><button class="go" type="button" data-a="lock">Lock in for the week</button><button type="button" data-a="shop">Shopping list</button><button type="button" data-a="again">Spin again</button><button type="button" data-a="first">Open first film</button><button type="button" data-a="done">Done</button></div><p class="msg" role="status" id="dfMsg"></p></div>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{
    if(e.target===o)return close();const k=e.target.dataset&&e.target.dataset.a;if(!k)return;
    if(k==="g-"||k==="g+"){G=Math.min(60,Math.max(1,G+(k==="g+"?1:-1)));o.querySelector("#dfG").textContent=G;doubleMenu(a,b,G).then(x=>{m=x});return}
    if(k==="done")close();
    if(k==="again"){close();openDouble()}
    if(k==="first"){close();setView("wheel");replay(a);addHistory(a);toMenu()}
    if(k==="shop")openTrolley(a,m,`${a.title} + ${b.title}`);
    if(k==="lock"){week=newWeekPlan(a.id,b.id);saveWeek();renderWeek();o.querySelector("#dfMsg").textContent="Locked in. It's on your This week panel with one shopping list for both."}
  });
  mountModal(o,".go",modalTrigger);buzz([20,40,20]);
}
$("dfBtn").addEventListener("click",openDouble);

/* sync: member number + PIN, stored in Supabase through an edge function (no keys in this page) */
const SYNC_URL="https://zpcgxupmclkxbzikdnfb.supabase.co/functions/v1/mns-sync";
var syncTimer=null,syncState="";
async function syncCall(body){
  /* the app sends this natively: the sync function only allows reeldinner.com as a browser origin */
  const r=globalThis.REEL_NATIVE?await REEL.post(SYNC_URL,body,"json"):await fetch(SYNC_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok)throw new Error("sync");return r.json();
}
function syncPayload(){
  const {pin,...m}=member;
  return {v:1,member:m,watched:[...watched],skip:skipWatched,hist,week,counter,kids:kidsMode,fav:typeof FAV!=="undefined"?FAV:[],rates:typeof RATES!=="undefined"?RATES:{}};
}
function applyRemote(d){
  if(!d||!d.member)return;
  const pin=member.pin,mine=member;
  member=Object.assign({},d.member,{pin,no:d.member.no||mine.no});
  member.rentals=Math.max(d.member.rentals||0,mine.rentals||0);
  member.stars=Object.assign({},mine.stars||{},d.member.stars||{});
  member.aisles=d.member.aisles||mine.aisles||{};
  const outIds=new Set();member.out=[...(d.member.out||[]),...(mine.out||[])].filter(r=>!outIds.has(r.id)&&outIds.add(r.id)).slice(0,6);
  if(!member.name&&mine.name)member.name=mine.name;
  (d.watched||[]).forEach(id=>{if(FILMS.some(f=>f.id===id))watched.add(id)});
  hist=[...new Set([...(d.hist||[]),...hist])].slice(0,8);
  if(Array.isArray(d.fav)&&typeof FAV!=="undefined"&&FAV){FAV=[...new Set([...FAV,...d.fav])].filter(id=>FILMS.some(f=>f.id===id)).slice(0,30);try{localStorage.setItem("mns-fav",JSON.stringify(FAV));renderFav()}catch(e){}}
  if(Object.prototype.hasOwnProperty.call(d,"week")){
    if(d.week===null)week=null;
    else{
      const incoming=normaliseWeek(d.week);
      /* Repeated pulls from an older client must not re-date an already migrated plan. */
      if(incoming){
        if(!parseWeekDate(d.week.date)&&week&&incoming.id===week.id&&incoming.double===week.double&&incoming.day===week.day)incoming.date=week.date;
        week=incoming;
      }
    }
  }
  counter=Object.assign({},counter,d.counter||{});
  if(d.rates&&typeof d.rates==="object"&&typeof RATES!=="undefined"){for(const [id,r] of Object.entries(d.rates)){if(r&&r.s&&(!RATES[id]||(r.t||0)>(RATES[id].t||0)))RATES[id]=r}try{localStorage.setItem("mns-rates",JSON.stringify(RATES))}catch(e){}}
  if(typeof d.kids==="boolean")kidsMode=d.kids;
  try{localStorage.setItem("mns-member",JSON.stringify(member));localStorage.setItem("mns-watched",JSON.stringify([...watched]));localStorage.setItem("mns-hist",JSON.stringify(hist));localStorage.setItem("mns-counter",JSON.stringify(counter));if(week)localStorage.setItem("mns-week",JSON.stringify(week));else localStorage.removeItem("mns-week");localStorage.setItem("mns-kids",kidsMode?"1":"0")}catch(e){}
  renderHist();renderWeek();setKidsUI();if(!spinning){setList();updateWatchButton()}if(!$("viewShop").hidden)renderShop();
}
/* delete the online copy of the member card: first tap arms the button, second tap deletes. Picks on this device stay. */
async function deleteOnlineCard(b){
  const note=document.getElementById("syncNote");
  if(!b.classList.contains("arm")){b.classList.add("arm");b.textContent="Tap again to delete";setTimeout(()=>{if(b.isConnected&&b.classList.contains("arm")){b.classList.remove("arm");b.textContent="Delete my online card"}},6000);return}
  b.disabled=true;b.textContent="Deleting";clearTimeout(syncTimer);
  let r;try{r=await syncCall({action:"delete",no:member.no,pin:member.pin})}catch(e){r={status:"offline"}}
  if(r.status==="deleted"||r.status==="gone"){
    delete member.pin;try{localStorage.setItem("mns-member",JSON.stringify(member))}catch(e){}
    renderMember();const st=$("shopCount");if(st)st.textContent="Your online card is deleted. Your picks stay on this device.";return;
  }
  b.disabled=false;b.classList.remove("arm");b.textContent="Delete my online card";
  if(note)note.textContent=r.status==="offline"?"Couldn't reach the card system. Nothing was deleted. Try again when you're online.":"Your PIN didn't match, so nothing was deleted. Sign out, sign in again, then delete.";
}
function queueSync(){
  if(!member||!member.pin)return;
  clearTimeout(syncTimer);syncTimer=setTimeout(pushSync,1500);
}
async function pushSync(){
  if(!member.pin)return;
  try{const r=await syncCall({action:"save",no:member.no,pin:member.pin,data:syncPayload()});syncState=r.status==="ok"?"saved":r.status}catch(e){syncState="offline"}
  const el=document.getElementById("syncNote");if(el)el.textContent=syncNote();
}
function syncNote(){return navigator.onLine===false?"You're offline. Your changes are saved on this device and go up once you're back online.":syncState==="offline"?"Couldn't reach the card system. Your changes are saved on this device and will go up next time.":syncState==="badpin"||syncState==="locked"?"Your PIN didn't match. Sign out and sign in again to keep syncing.":`Synced. Use No. ${member.no.slice(0,3)} ${member.no.slice(3)} and your PIN on any other device.`}
function openSyncForm(mode){
  const modalTrigger=document.activeElement;
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  const join=mode==="join";
  o.setAttribute("aria-label",join?"Put your card online":"Use your card from another device");
  o.innerHTML=`<form class="syncbox"><h3>${join?"Put my card online":"Use my card here"}</h3><p>${join?`Pick a 4-digit PIN. Then on any other device, enter No. ${member.no.slice(0,3)} ${member.no.slice(3)} and this PIN to bring your card, ticks and rentals across.`:"Enter the member number from your card on the other device, and your PIN. Anything on this device gets merged in."}</p>${join?"":`<label for="sNo">Member number</label><input id="sNo" inputmode="numeric" autocomplete="off" maxlength="7" required>`}<label for="sPin">PIN</label><input id="sPin" type="password" inputmode="numeric" autocomplete="off" maxlength="4" required><p class="err" id="sErr" role="alert"></p><p class="off-note" hidden>You're offline. Your card stays saved on this device. Try this again once you're back online.</p><div class="acts"><button type="button" data-a="back">Cancel</button><button type="submit" class="go" data-net>${join?"Save my card":"Sign in"}</button></div></form>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{if(e.target===o||(e.target.dataset&&e.target.dataset.a==="back"))close()});
  o.querySelector("form").addEventListener("submit",async e=>{
    e.preventDefault();const err=o.querySelector("#sErr");err.textContent="";if(navigator.onLine===false){netMarks();return}
    const pin=o.querySelector("#sPin").value.trim();if(!/^\d{4}$/.test(pin)){err.textContent="The PIN needs to be 4 numbers.";return}
    const btn=o.querySelector(".go");btn.disabled=true;
    try{
      if(join){
        const r=await syncCall({action:"load",no:member.no,pin});
        if(r.status==="badpin"||r.status==="locked"){err.textContent="That member number already has a different PIN. Use the other button to sign in.";btn.disabled=false;return}
        member.pin=pin;if(r.status==="ok")applyRemote(r.data);
        saveMember();await pushSync();
      }else{
        const no=o.querySelector("#sNo").value.replace(/\D/g,"");if(no.length!==6){err.textContent="Member numbers are 6 numbers long.";btn.disabled=false;return}
        const r=await syncCall({action:"load",no,pin});
        if(r.status==="new"){err.textContent="No card with that number. Check the number on your other device.";btn.disabled=false;return}
        if(r.status==="locked"){err.textContent="Too many wrong PINs. This card is locked.";btn.disabled=false;return}
        if(r.status!=="ok"){err.textContent="That PIN doesn't match.";btn.disabled=false;return}
        member.no=no;member.pin=pin;applyRemote(r.data);saveMember();await pushSync();
      }
      close();renderMember();buzz(30);
    }catch(x){err.textContent="Couldn't reach the card system. Check your connection and try again.";btn.disabled=false}
  });
  mountModal(o,"input",modalTrigger);netMarks();
}
async function pullSync(){
  if(!member.pin)return;
  try{const r=await syncCall({action:"load",no:member.no,pin:member.pin});if(r.status==="ok"){applyRemote(r.data);syncState="saved";pushSync()}else syncState=r.status}catch(e){syncState="offline"}
  renderMember();
}
let shopBuilt=false;
/* the Late Show: horror rated MA15+ or R, kept behind the curtain and off the open Horror aisle */
const isLate=f=>f.theme==="horror"&&/^(MA15\+|R18\+|R)$/.test(ratingOf(f)||"");
function tapeHTML(f){
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];
  /* one sticker per tape: Seen it, else the new release price, else Staff pick */
  const seen=watched.has(f.id),nw=!seen&&isNew(f),pk=!seen&&!nw&&isPick(f);
  const st=seen?'<span class="sticker back">Seen it</span>':pk?'<span class="sticker pick">Staff pick</span>':"";
  const out=isOut(f);
  const tk=pk&&!out?talkFor(f):null;
  return `<button class="tape${isClam(f)?" clam":""}${out?" out":""}${+f.year<1995?" faded":""}" type="button" data-id="${ESC(f.id)}" style="transform:rotate(${(hashN(f.id)%5-2)*.35}deg)">${out?"":st}<span class="box">${p?`<img loading="lazy" decoding="async" alt="" src="${TMDB_IMG_SHOP}w185${ESC(p)}">`:""}${out?'<span class="out-card">All copies out<small>Wait by the returns chute</small></span>':nw?`<span class="price">${priceTag(f)}</span>`:""}${ratingOf(f)?`<span class="rate ${rateCls(ratingOf(f))}" aria-label="Rated ${ratingOf(f)}">${ratingOf(f)}</span>`:""}</span><span class="tape-t">${ESC(f.title)}</span><span class="tape-y">${f.year}</span>${tk?`<span class="talker"><b>${tk[0]}'s pick</b>${tk[1]}</span>`:""}</button>`;
}
function renderBoard(){
  const t=isTuesday();
  $("svBoard").innerHTML=`<div class="svb-row${t?" dim":""}"><b>New releases</b><span>$4 for 3 nights</span></div><div class="svb-row"><b>Weeklys</b><span>$2 for 7 nights</span></div><div class="svb-row${t?" hot":""}"><b>$2 Tuesday</b><span>${t?"On tonight":"Every new release, every Tuesday"}</span></div><button type="button" class="svb-fri" id="svFri">Double bill: one for the kids, one for later</button>`;
  $("svFri").addEventListener("click",()=>{const kids=FILMS.filter(f=>isKidSafe(f)&&onSvc(f,svc)),late=FILMS.filter(f=>!isKidSafe(f)&&onSvc(f,svc));if(!kids.length||!late.length)return;openDouble(pick(kids),pick(late))});
}
function renderCal(cal){
  /* the calendar only lists what's close: big days (Christmas, Easter, Halloween and the like) a month out, the rest a week out, and the strip hides when nothing is due */
  const on=cal.filter(c=>c.on);let up=cal.filter(c=>!c.on&&c.next&&daysTo(c.day)<=(c.s.big?31:7)).sort((a,b)=>a.day-b.day);
  /* review 13: a quiet stretch (early June) left the strip empty with Christmas in July a month off, so the next day within six weeks shows instead.
     Review 14: mid-May was still empty (Christmas in July 47 days off), so the window is ten weeks */
  if(!on.length&&!up.length)up=cal.filter(c=>!c.on&&c.next&&daysTo(c.day)<=70).sort((a,b)=>a.day-b.day).slice(0,1);
  $("shopCal").hidden=!on.length&&!up.length;
  const chip=(c,isOn)=>`<button type="button" class="${isOn?"on":""}${!isOn&&peekSeason===c.s.id?" peek":""}" aria-pressed="${isOn||peekSeason===c.s.id}" data-season="${c.s.id}" style="--sg:${c.s.c[0]};--sf:${c.s.c[1]}"><b>${ESC(c.s.name)}</b>${isOn?(c.end?`<small>Until ${fmtDay(c.end)}</small>`:""):`<small>${(d=>d===1?"Tomorrow":`In ${d} days, ${fmtDay(c.day)}`)(daysTo(c.day))}</small>`}</button>`;
  $("shopCal").innerHTML=(on.length?`<span class="cal-k">On now</span>`+on.map(c=>chip(c,true)).join(""):"")+(up.length?`<span class="cal-k">Coming up</span>`+up.map(c=>chip(c,false)).join(""):"");
}
/* shelves fill in the background: the first few tapes of each row go up straight away, the rest as the phone gets a spare moment */
const SHELF_FIRST=8;let shelfRest=[],shelfJob=0;
function fillShelf(sh){const k=sh&&sh.dataset.k;if(k==null||!shelfRest[k]||!shelfRest[k].length)return;sh.insertAdjacentHTML("beforeend",shelfRest[k].map(tapeHTML).join(""));shelfRest[k]=[]}
function fillShelvesLater(){
  const job=++shelfJob,idle=window.requestIdleCallback||(f=>setTimeout(()=>f({timeRemaining:()=>8}),30));
  const step=dl=>{if(job!==shelfJob)return;const shelves=[...$("shopAisles").querySelectorAll(".shelf[data-k]")];
    for(const sh of shelves){const k=sh.dataset.k;const rest=shelfRest[k];if(!rest||!rest.length)continue;
      sh.insertAdjacentHTML("beforeend",rest.splice(0,24).map(tapeHTML).join(""));if(dl.timeRemaining()<4)break}
    if(shelves.some(sh=>(shelfRest[sh.dataset.k]||[]).length))idle(step)};
  idle(step);
}
var peekSeason="";
function renderShop(){
  shelfRest=[];
  if(!dishesReady)ensureDishes().then(()=>{if(!$("viewShop").hidden)renderShop()});
  const q=$("shopSearch").value.trim().toLowerCase(),dec=$("shopDecade").value,unseen=$("shopUnwatched").checked;
  const ok=f=>(!q||filmScore(q,f)>=0)&&(!dec||f.year.slice(0,3)===dec)&&(!unseen||!watched.has(f.id))&&(!kidsMode||isKidSafe(f))&&onSvc(f,svc);
  const list=FILMS.filter(ok);
  const rows=[];
  const fresh=list.filter(isNew).sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title));
  const rented=hist.map(id=>list.find(f=>f.id===id)).filter(Boolean);
  const cal=seasonState(),later=[];
  if(!q)cal.filter(c=>c.on).forEach(c=>rows.push(...seasonRows(c.s,list)));
  renderCal(cal);renderBoard();
  if(rented.length&&!q)rows.push(["Your rentals",rented]);
  const top=!q?topShelf(list):[];if(top.length)rows.push([member.name?`${member.name}'s shelf`:"Your top shelf",top,"Everything you gave 4 or 5 stars."]);
  if(fresh.length&&!q)rows.push(["New release wall",fresh,isTuesday()?"$2 Tuesday is on. Every new release is $2 tonight.":"Overnight $7. Back by 7pm tomorrow.","wall"]);
  if(!q){const picks=list.filter(isPick);if(picks.length)rows.push(["Staff picks",picks])}
  if(q&&list.length)rows.push(["Search results",list.slice().sort((a,b)=>a.title.localeCompare(b.title))]);
  else SHOP_AISLES.forEach(([n,ts])=>{if(n==="Holiday")return;const r=list.filter(f=>aisleOf(f)===n&&(kidsMode||!isLate(f))).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));if(r.length)rows.push([n,r])});
  if(!q&&!kidsMode){const ls=list.filter(isLate).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));if(ls.length)rows.push(["Late Show",ls,"Out the back, behind the curtain. The proper scares, grown-ups only.","lateshow"])}
  if(!q&&peekSeason){const c=cal.find(c=>c.s.id===peekSeason&&!c.on&&c.next);if(c)rows.unshift(...seasonRows(c.s,list,c.next).map(r=>{r[2]=(r[2]||"").replace(/^Back on /,"Sneak look. Back on ");return r}))}
  renderMember();
  $("shopCount").textContent=list.length?`${list.length} of ${FILMS.length} titles on the shelves`:"";
  const aisle=([n,r,note,cls,st,sid])=>`<section class="aisle${cls?" "+cls:""}" data-name="${ESC(n)}" data-count="${r.length}"${st?` style="${st}"`:""}${sid?` id="season-${sid}${/late show/.test(n)?"-late":""}"`:""}><div class="aisle-top"><h3 class="aisle-sign">${ESC(n)}<span><b class="sr">, </b>${r.length}<b class="sr"> tapes</b></span></h3>${r.length>1?`<button class="aisle-spin" type="button" data-aisle="${ESC(n)}">Spin this aisle</button>`:""}${note?`<p class="aisle-note">${ESC(note)}</p>`:""}</div>${/lateshow/.test(cls||"")?`<button class="ls-curtain" type="button" aria-expanded="false" aria-label="Pull back the curtain"><img src="assets/hero/latedoor.webp" alt="" loading="lazy"><span class="ls-sign fit" style="left:34.81%;top:3.31%;width:31.12%;height:5.52%"><span class="fit-t">Late Show</span></span><span class="ls-tap">Pull back the curtain</span></button>`:""}<div class="shelf" data-k="${shelfRest.push(/lateshow/.test(cls||"")?[]:r.slice(SHELF_FIRST))-1}">${(/lateshow/.test(cls||"")?[]:r.slice(0,SHELF_FIRST)).map(tapeHTML).join("")}</div></section>`;
  $("shopAisles").innerHTML=rows.length?rows.map(aisle).join("")+(later.length?`<div class="aisles-later"><h3>Holiday shelves</h3><p>Each one moves to the front of the shop when its day comes round.</p>${later.map(aisle).join("")}</div>`:""):`<p class="shelf-empty">${q?`No tapes match "${ESC(q)}". Check the spelling, or clear the filters.`:"Nothing on the shelves matches that. Try another title or clear the filters."}</p>`;
  fillShelvesLater();buildAisleNav();
}
function tvHTML(f,still){
  const k=typeof TRAILERS!=="undefined"&&TRAILERS[f.id];
  return `<div class="tv"><div class="tv-screen"${still?` style="background:#0a0d10 url('${TMDB_IMG_SHOP}w500${ESC(still)}') center/cover"`:""}>${k?`<button class="tv-play" type="button" data-k="${ESC(k)}">Play trailer</button>`:`<p class="tv-none">No trailer in the machine for this one.</p>`}</div><div class="tv-base"><span class="tv-knobs" aria-hidden="true"><i></i><i></i></span>${k?`<a href="https://www.youtube.com/watch?v=${encodeURIComponent(k)}" target="_blank" rel="noopener">Open on YouTube</a>`:""}</div></div>`;
}
async function openCase(f){
  const modalTrigger=document.activeElement;
  await Promise.all([ensureExact(f),typeof TRAILERS==="undefined"?loadScript(TRAILERS_JS).catch(()=>{}):0]);
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];const m=makeMenu(f,true);
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`${f.title}, back of the box`);
  const seen=watched.has(f.id);
  const st=((f._lib&&f._lib.stills)||[]).map(x=>Array.isArray(x)?x[0]:x).filter(x=>x&&x!==p),shots=st.slice(1,4),fresh=typeof isNew==="function"&&isNew(f),rt=ratingOf(f);
  const tag=(movieEdition(f)||{}).tagline||f.T;
  const shotHTML=shots.length>=2?shots.map(s=>`<img alt="" src="${TMDB_IMG_SHOP}w300${ESC(s)}" loading="lazy">`).join(""):(p?`<img class="vb-poster" alt="${ESC(f.title)} poster" src="${TMDB_IMG_SHOP}w342${ESC(p)}">`:"");
  o.innerHTML=`<div class="case vhs"><div class="vb">
    <header class="vb-top"><p class="vb-tag">${ESC(tag)}</p><h3 class="vb-h" tabindex="-1">${ESC(f.title)}</h3></header>
    <div class="vb-body">
      <div class="vb-l"><div class="vb-shots n${Math.min(shots.length,3)}">${shotHTML}</div>${tvHTML(f,st[0])}</div>
      <div class="vb-r">${isOut(f)?'<p class="outnote">All copies are out. Lucky you, one just came back.</p>':""}
        <p class="syn">${ESC(f.D)}</p>
        ${f.T&&f.T!==tag?`<p class="staff">Staff pick: ${ESC(f.T)}</p>`:(m.w[0]?`<p class="staff">Staff tip: save room for ${ESC(m.w[0].n)}.</p>`:"")}${seen?starsHTML(f):""}
        <h4>Tonight's menu</h4><ul>${[...m.s,...m.m,...m.w,...m.d].map(it=>`<li>${ESC(it.n)}</li>`).join("")}</ul>
        <div class="where">${whereHTML(f)}</div>
      </div>
    </div>
    <footer class="vb-foot">${rt?`<span class="vb-rate ratebig ${rateCls(rt)}" aria-label="Rated ${rt}">${rt}</span>`:""}<span class="vb-spec">${f.year} &nbsp;·&nbsp; ${ESC(aisleOf(f)||"")} aisle<br>Colour &nbsp;·&nbsp; Hi-Fi Stereo &nbsp;·&nbsp; VHS</span><span class="vb-code">${code39(String(f.year)+String(Math.abs([...f.id].reduce((h,c)=>(h*31+c.charCodeAt(0))|0,7))%10000).padStart(4,"0"))}</span><span class="vb-price"><b>${fresh?"NEW RELEASE":"WEEKLY"}</b>${ESC(priceTag(f).replace(/^Weekly /,""))}${fresh?"":" for 7 nights"}</span></footer>
  </div>
  <div class="acts"><button class="menu-go" type="button">See the menu</button>${isRentedOut(f)?'<button class="ret" type="button">Return it</button>':'<button class="rent" type="button">Rent it</button>'}<button class="seen" type="button">${seen?"Not seen it yet":"Seen it"}</button></div></div>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{if(e.target===o)close()});
  /* the menu is one tap from any tape; renting is just for fun and never needed to see it */
  o.querySelector(".menu-go").addEventListener("click",()=>{close();openRentalMenu(f)});
  {const rb2=o.querySelector(".rent");if(rb2)rb2.addEventListener("click",()=>{close();sfx.clunk();openSlip(f,()=>openRentalMenu(f))})}
  if(seen)wireStars(o,f,()=>renderShop());
  const rb=o.querySelector(".ret");if(rb)rb.addEventListener("click",()=>{close();openChute(f)});
  const tv=o.querySelector(".tv-play");
  if(tv)tv.addEventListener("click",()=>{const k=tv.dataset.k;const scr=tv.parentElement;scr.classList.add("tracking");sfx.clunk();setTimeout(()=>{scr.classList.remove("tracking");scr.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(k)}?autoplay=1&playsinline=1&rel=0&modestbranding=1" title="${ESC(f.title)} trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`},reduce?0:600)});
  o.querySelector(".seen").addEventListener("click",()=>{setWatched(f,!watched.has(f.id));close();renderShop()});
  /* open on the title, not the buttons at the bottom: focus the heading without scrolling, then make sure the case sits at the top */
  mountModal(o,".vb-h",modalTrigger);
  {const top=()=>{o.scrollTop=0;const c=o.querySelector(".case");if(c)c.scrollTop=0;const h=o.querySelector(".vb-h");if(h&&document.activeElement!==h)h.focus({preventScroll:true})};top();requestAnimationFrame(top);setTimeout(top,60)}
}

/* where to watch in Australia (TMDB, data by JustWatch) */
const PROV=typeof PROVIDERS!=="undefined"?PROVIDERS:{};
const provOf=f=>PROV[f.id]||null;
const LOGO="https://image.tmdb.org/t/p/w92";
const SERVICES=(()=>{const c={};Object.values(PROV).forEach(v=>(v.s||[]).forEach(([n])=>c[n]=(c[n]||0)+1));return Object.entries(c).filter(([,n])=>n>=6).sort((a,b)=>b[1]-a[1]).map(([n])=>n)})();
let svc="";try{svc=localStorage.getItem("mns-svc")||""}catch(e){}
const onSvc=(f,want)=>{if(!want)return true;const p=provOf(f);if(!p||!p.s||!p.s.length)return false;return want==="*"?true:p.s.some(([n])=>n===want)};
function whereHTML(f){
  const p=provOf(f);
  if(!p)return "";
  const svcRow=(label,list)=>list&&list.length?`<div class="where-row"><span class="where-k">${label}</span>${list.map(([n,l])=>`<span class="where-svc">${l?`<img alt="" src="${LOGO}${ESC(l)}" loading="lazy">`:""}<span class="nm">${ESC(n)}</span></span>`).join("")}</div>`:"";
  const rb=[];(p.r||[]).concat(p.b||[]).forEach(x=>{if(!/justwatch/i.test(x[0])&&!rb.some(y=>y[0]===x[0]))rb.push(x)});
  const more=`<a class="where-more" href="https://www.themoviedb.org/movie/${p.t}/watch?locale=AU" target="_blank" rel="noopener">All options and prices</a>`;
  if(!(p.s&&p.s.length)&&!rb.length)return `<p class="where-none">Not streaming in Australia right now. Time to dust off the DVD player. ${more}</p>`;
  return svcRow("Stream on",p.s)+svcRow(p.s&&p.s.length?"Or rent":"Rent or buy",rb.slice(0,4))+`<div class="where-row">${more}</div>`;
}
function fillSvcSelects(){
  const opts=`<option value="*">Streaming somewhere</option>`+SERVICES.map(n=>`<option value="${ESC(n)}">${ESC(n)}</option>`).join("");
  $("svcSel").insertAdjacentHTML("beforeend",opts);$("shopSvc").insertAdjacentHTML("beforeend",opts);
  $("svcSel").value=svc;$("shopSvc").value=svc;
}
function setSvc(v){svc=v;try{localStorage.setItem("mns-svc",v)}catch(e){};$("svcSel").value=v;$("shopSvc").value=v;if(!spinning)setList();if(!$("viewShop").hidden)renderShop();if(!$("viewCrave").hidden)renderCrave()}

/* lazy night: cut the menu down to the two easiest dishes */
let lazy=false;try{lazy=localStorage.getItem("mns-lazy")==="1"}catch(e){}
const effort=it=>(it.shop?it.shop.length:4)*10+((it.how||"").length/40);
function lazyMenu(menu){
  const sav=[...menu.s.map(it=>["s",it]),...menu.m.map(it=>["m",it])].sort((a,b)=>effort(a[1])-effort(b[1]))[0];
  const sw=[...menu.w.map(it=>["w",it]),...menu.d.map(it=>["d",it])].sort((a,b)=>effort(a[1])-effort(b[1]))[0];
  const out={s:[],m:[],w:[],d:[],lazy:true};
  [sav,sw].forEach(x=>{if(x)out[x[0]].push(x[1])});
  out.shopping=[sav,sw].filter(Boolean).flatMap(x=>x[1].shop||[]);
  return out;
}
function setLazyUI(){const b=$("lazyBtn");b.setAttribute("aria-pressed",lazy);b.textContent=lazy?"Easy cook mode: on":"Easy cook mode: off"}

/* first visit: a quick how-it-works */
function showWelcome(){
  const modalTrigger=document.activeElement;
  const o=document.createElement("dialog");o.className="welcome";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","How it works");
  o.innerHTML=`<div class="welcome-in"><h2>Movie night, sorted</h2><p class="lead">Pick a film and dinner comes with it.</p><ol>
  <li><span><b>Pick a film</b>Spin the wheel at the box office, browse the shelves at Galaxy Video, or start from what you're craving at the candy bar.</span></li>
  <li><span><b>Get the menu</b>Every film has its own menu built from the movie, with recipes and a shopping list that scales from 1 to 60 guests.</span></li>
  <li><span><b>Cook, then press play</b>Lock it in for the week, tick off the shopping, and check where it's streaming.</span></li>
  </ol><button class="btn primary" type="button">Let's go</button></div>`;
  const close=()=>dismissModal(o);
  o.querySelector("button").addEventListener("click",close);
  o.addEventListener("click",e=>{if(e.target===o)close()});
  mountModal(o,"button",modalTrigger,()=>{try{localStorage.setItem("mns-welcome","1")}catch(e){}setTimeout(toSharedFilm,60)});
}

{const g=document.getElementById("bulbGlow");if(g){let h="";for(let i=0;i<32;i++)h+=`<i style="--a:${i*11.25}deg;--d:${-(i%8)*0.2}s"></i>`;g.innerHTML=h}}
/* phones: a Spin button pinned to the bottom until the wheel is on screen */
{const bar=$("spinbar"),hub=$("spin"),acts=document.querySelector(".actions");let hubSeen=false,actsSeen=false,prepSeen=false,weekSeen=false,pairSeen=false,phoneSeen=false;
 /* the floating Spin button steps aside while the wheel or the menu buttons are on screen, so it never sits over them */
 const upd=()=>{bar.hidden=hubSeen||actsSeen||weekSeen||pairSeen||prepSeen||phoneSeen||spinning||$("viewWheel").hidden||!matchMedia("(max-width:900px)").matches};
 if("IntersectionObserver" in window){new IntersectionObserver(es=>{hubSeen=es[0].isIntersecting;upd()},{threshold:.4}).observe(hub);
   if(acts)new IntersectionObserver(es=>{actsSeen=es[0].isIntersecting;upd()},{threshold:0,rootMargin:"0px 0px 90px 0px"}).observe(acts);
   /* and while the menu itself is being read on a phone, so it never covers a dish */
   {const fp=$("fmtPhone");if(fp)new IntersectionObserver(es=>{phoneSeen=es[0].isIntersecting;upd()},{threshold:0}).observe(fp)}
   /* and while the snacks under the menu are on screen, so it never covers their Add buttons */
   {const sp=$("snackPair");if(sp)new IntersectionObserver(es=>{pairSeen=es[0].isIntersecting;upd()},{threshold:0,rootMargin:"0px 0px 90px 0px"}).observe(sp)}
   /* and while the prep sheet is being read, so it never sits over the method */
   new IntersectionObserver(es=>{prepSeen=es[0].isIntersecting;upd()},{threshold:0}).observe($("preview"));
   /* and while this week's film is on screen, so it never covers its buttons */
   {const wp=$("weekPanel");if(wp)new IntersectionObserver(es=>{weekSeen=es[0].isIntersecting;upd()},{threshold:0,rootMargin:"0px 0px 90px 0px"}).observe(wp)}}
 window.addEventListener("scroll",upd,{passive:true});
 $("spinbarBtn").addEventListener("click",()=>{$("spin").scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});setTimeout(()=>{if(!spinning)$("spin").click()},reduce?50:650)});
 window.__spinbarUpd=upd;}
/* every sign overlay: shrink the words until they sit inside the painted panel */
let fitGen=0;
function fitSigns(root,force){(root||document).querySelectorAll(".fit").forEach(box=>{const t=box.querySelector(".fit-t");if(!t)return;const bw=box.clientWidth,bh=box.clientHeight;if(!bw||!bh)return;
  /* already fitted at this size, with these words and these fonts: leave it be */
  const key=bw+"x"+bh+"|"+fitGen+"|"+box.textContent;if(!force&&box.__fk===key)return;box.__fk=key;const small=box.querySelector("small");
  const wrap=getComputedStyle(t).whiteSpace!=="nowrap";
  const fits=fs=>{t.style.fontSize=fs+"px";if(small)small.style.fontSize=Math.max(6,fs*.36)+"px";const r=t.getBoundingClientRect();const sh=small&&small.style.display!=="none"?small.getBoundingClientRect().height:0;return r.width<=bw*.9&&(r.height+sh)<=bh*.92&&(!wrap||t.scrollHeight<=bh*.92)};
  if(small)small.style.display="";
  let lo=3,hi=Math.max(8,bh*(small?.66:.8));
  if(fits(hi))lo=hi;else{
    /* text grows in step with its size, so one measurement gets close and a few checks finish it */
    const r=t.getBoundingClientRect(),sh=small&&small.style.display!=="none"?small.getBoundingClientRect().height:0;
    const g=hi*Math.min(bw*.9/Math.max(1,r.width),bh*.92/Math.max(1,r.height+sh));
    if(!wrap&&g>3&&g<hi){if(fits(g)){lo=g;hi=Math.min(hi,g*1.06)}else{hi=g;lo=Math.max(3,g*.85)}}
    for(let i=0;i<(wrap?16:6);i++){const mid=(lo+hi)/2;if(fits(mid))lo=mid;else hi=mid}}
  fits(lo);
  if(small&&lo*.36<6.5){small.style.display="none";let l2=lo,h2=bh*.8;for(let i=0;i<12;i++){const m=(l2+h2)/2;if(fits(m))l2=m;else h2=m}fits(l2);lo=l2}
  box.classList.toggle("tiny",lo<7.5)})}
if(typeof document!=="undefined"&&document.fonts){document.fonts.ready.then(()=>{fitGen++;try{fitSigns()}catch(e){}});document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",()=>{fitGen++;try{fitSigns()}catch(e){}});Promise.all(["400 20px Bungee","700 20px Oswald","600 20px Oswald"].map(f=>document.fonts.load(f))).then(()=>{try{fitSigns()}catch(e){}}).catch(()=>{})}
if(typeof ResizeObserver!=="undefined"&&typeof document!=="undefined"&&document.body){const ro=new ResizeObserver(es=>es.forEach(e=>{if(e.target.classList.contains("fit"))fitSigns(e.target.parentElement)}));const watch=()=>document.querySelectorAll(".fit:not([data-ro])").forEach(b=>{b.dataset.ro=1;ro.observe(b)});watch();if(typeof MutationObserver!=="undefined")new MutationObserver(watch).observe(document.body,{childList:true,subtree:true})}
if(typeof document!=="undefined"&&document.addEventListener)document.addEventListener("load",e=>{if(e.target&&e.target.tagName==="IMG"&&e.target.parentElement&&e.target.parentElement.querySelector(".fit"))fitSigns(e.target.parentElement)},true);
if(typeof window!=="undefined"&&window.addEventListener&&typeof document!=="undefined"&&document.body){window.addEventListener("resize",()=>fitSigns());if(typeof MutationObserver!=="undefined")new MutationObserver(ms=>{
  /* only new signs need fitting; everything else is left alone so the page stays quick */
  if(!ms.some(m=>(m.target.closest&&m.target.closest(".fit"))||[...m.addedNodes].some(n=>n.nodeType===1&&(n.classList.contains("fit")||n.querySelector&&n.querySelector(".fit")))))return;
  clearTimeout(window.__fs);window.__fs=setTimeout(()=>fitSigns(),60)}).observe(document.body,{childList:true,subtree:true})}
/* palace marquee: the letters hang on the board's slat rows like real changeable letters.
   A short title is two rows tall under the NOW SHOWING row. A long one is split at a space into two lines of
   one row each, the way a marquee crew would hang it; one long word drops to a single row. Only if that still
   does not fit do the letters shrink. Light boxes show tonight's poster and recent spins. */
let _hang=false;
function fitMarquee(){if(_hang)return;const t=$("now"),mq=document.querySelector(".mq");if(!t||!mq)return;
  const txt=t.textContent,n=txt.length,room=mq.clientWidth-2*MQ_ROW,sig=txt+"|"+room;if(t.dataset.fit===sig)return;
  const hang=cut=>{_hang=true;t.innerHTML=[...txt].map((ch,i)=>ch===" "?(i===cut?" <br>":" "):`<i style="--r:${((Math.sin(i*12.9898+n)*43758.5453)%1*2.4).toFixed(2)}deg;--y:${((Math.sin(i*78.233+n)*12345.678)%1*0.03).toFixed(3)}em">${ch==="&"?"&amp;":ch==="<"?"&lt;":ch===">"?"&gt;":ch}</i>`).join("");_hang=false};
  const shrink=()=>{const w=t.scrollWidth;if(w>room)t.style.fontSize=`${(parseFloat(getComputedStyle(t).fontSize)*room/w*.98).toFixed(1)}px`};
  t.style.fontSize="";mq.classList.remove("one","two");hang(-1);t.dataset.fit=sig;
  const sp=[...txt].map((c,i)=>c===" "?i:-1).filter(i=>i>0);
  if(room<=0||t.scrollWidth<=room*(sp.length?.72:1))return;
  if(sp.length){const cost=i=>Math.abs(i-n/2)-(txt[i-1]===":"?n/2:txt[i-1]===","?n/3:0),cut=sp.reduce((a,b)=>cost(b)<cost(a)?b:a);hang(cut);mq.classList.add("two")}else mq.classList.add("one");
  shrink()}

/* the board in the photo is seen at an angle: map the live letters onto it with a perspective transform.
   BOARD_Q is the lit board's corners (top left, top right, bottom right, bottom left) as fractions of the photo,
   BOARD_ROWS the slat lines down the board (0 is the top edge, 1 the bottom edge), BOARD_W the board's
   width counted in slat rows. All three are measured by scripts/compose-cinema-real.py. */
const BOARD_Q=[[0.00386,0.17577],[0.8535,0.51257],[0.86792,0.75564],[0.00388,0.57483]];
const BOARD_ROWS=[0.0337,0.166,0.2983,0.4306,0.5628,0.6951,0.8274,0.9597];
const BOARD_W=55.93;
const MQ_ROW=50;/* CSS px per slat row inside .mq; .mq is three rows: NOW SHOWING, then the title over two */
function placeMarquee(){
  const st=document.querySelector(".palace-stage"),mq=document.querySelector(".mq");if(!st||!mq)return;
  const w=st.clientWidth,h=st.clientHeight;if(!w||!h)return;
  /* unit square on the board -> stage px */
  const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=BOARD_Q.map(([x,y])=>[x*w,y*h]),dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,sx=x0-x1+x2-x3,sy=y0-y1+y2-y3;
  const den=dx1*dy2-dx2*dy1,g=(sx*dy2-dx2*sy)/den,k=(dx1*sy-sx*dy1)/den;
  const a=x1-x0+g*x1,b=x3-x0+k*x3,dd=y1-y0+g*y1,e=y3-y0+k*y3;
  const P=(u,v)=>{const z=g*u+k*v+1;return[(a*u+b*v+x0)/z,(dd*u+e*v+y0)/z]};
  const s0=BOARD_ROWS[2],s1=BOARD_ROWS[5],sm=(s0+s1)/2;
  /* phones show only the middle of the photo: keep the letters on the part of the board that is on screen */
  const sr=st.getBoundingClientRect(),pr=st.parentElement.getBoundingClientRect(),pad=.035;
  const vx0=(Math.max(0,(pr.left-sr.left)/w)+pad)*w,vx1=(Math.min(1,(pr.right-sr.left)/w)-pad)*w;
  const tAt=X=>(X*(k*sm+1)-b*sm-x0)/(a-X*g);
  const t0=Math.max(.012,tAt(vx0)),t1=Math.min(.988,tAt(vx1));
  const W=Math.round((t1-t0)*BOARD_W*MQ_ROW),H=3*MQ_ROW;mq.style.width=W+"px";mq.dataset.w=W;
  const Q=[P(t0,s0),P(t1,s0),P(t1,s1),P(t0,s1)];
  /* box (W x H) -> that part of the board */
  const [[X0,Y0],[X1,Y1],[X2,Y2],[X3,Y3]]=Q,ex1=X1-X2,ex2=X3-X2,ey1=Y1-Y2,ey2=Y3-Y2,tx=X0-X1+X2-X3,ty=Y0-Y1+Y2-Y3;
  const dn=ex1*ey2-ex2*ey1,G=(tx*ey2-ex2*ty)/dn,K=(ex1*ty-tx*ey1)/dn;
  const A=X1-X0+G*X1,B=X3-X0+K*X3,D=Y1-Y0+G*Y1,E=Y3-Y0+K*Y3;
  const m=[A/W,D/W,0,G/W,B/H,E/H,0,K/H,0,0,1,0,X0,Y0,0,1];
  mq.style.transform=`matrix3d(${m.map(v=>+v.toFixed(8)).join(",")})`;mq.classList.add("on");_hang=false;try{fitMarquee()}catch(e){}
}
try{placeMarquee();addEventListener("resize",placeMarquee);if(typeof ResizeObserver!=="undefined")new ResizeObserver(placeMarquee).observe(document.querySelector(".palace-stage"))}catch(e){}
if(typeof MutationObserver!=="undefined")new MutationObserver(fitMarquee).observe($("now"),{childList:true,characterData:true,subtree:true});try{fitMarquee()}catch(e){}
/* Oswald may land after the first fit, and the fallback font measures differently: fit again once fonts are in */
try{const refit=()=>{const t=$("now");if(t){t.dataset.fit="";fitMarquee()}};document.fonts.ready.then(refit);document.fonts.addEventListener("loadingdone",refit)}catch(e){}
function lightboxes(){
  const P=typeof TMDB_POSTERS!=="undefined"?TMDB_POSTERS:{};
  const ids=[current&&current.id,...hist.filter(id=>!current||id!==current.id)].filter(Boolean);
  const pick=[ids[0],ids[1],ids[2],ids[0]];
  document.querySelectorAll(".lbox").forEach((im,i)=>{const p=pick[i]&&P[pick[i]];if(p){im.src="https://image.tmdb.org/t/p/w154"+p;im.hidden=false}else im.hidden=true});
}

/* craving: start from the food, find the film */
const CRAVES=[["Wings",/\bwings?\b/i],["Pizza",/pizza|calzone|stromboli/i],["Burgers",/burger|slider/i],["Tacos",/taco|burrito|nacho|quesadilla|enchilada|fajita|tamale|churro/i],["Hot dogs",/hot ?dog|frankfurt|\bfranks\b|bratwurst|\bsnags?\b|sausage sizzle|\bdogs?\b(?= with| on| in|$)|corn dog|chili dog|chilli dog/i],["Fried chicken",/fried chicken|chicken tender|nugget|popcorn chicken|schnitzel/i],["BBQ",/bbq|barbecue|brisket|\bribs\b|rib tips|short ribs|spare ?ribs|baby back|pulled pork|burnt ends|smoked (brisket|ribs|pork|sausage|chicken|beef)/i],["Steak",/steak|rib roast|scotch fillet|sirloin|t-bone/i],["Roasts",/\broast (beef|chicken|lamb|turkey|pork|beast|dinner|leg|rack|shoulder)|\broast\b(?! (capsicum|peppers?|vegetables?|veg|pumpkin|tomato(es)?|garlic|potato(es)?|sweet potato(es)?|carrots?|beetroots?|corn|chestnuts?|marshmallows?|nuts?|grapes?|cauliflower|squash|onions?|fennel)\b)|\bturkey\b|\bglazed ham\b|\bbaked ham\b/i],["Pasta",/pasta|spaghetti|lasagn|linguine|penne|macaroni|mac and cheese|ravioli|gnocchi|fettuccine|carbonara|rigatoni|meatball/i],["Noodles",/noodle|ramen|pho\b|lo mein|pad thai|udon|chow mein|pancit|laksa/i],["Dumplings",/dumpling|gyoza|wonton|bao|potsticker|mandu|momo/i],["Sushi",/sushi|sashimi|maki|onigiri/i],["Curry",/curry|tikka|masala|korma|vindaloo|dal\b|dhal/i],["Seafood",/prawn|shrimp|\bfish|crab|lobster|oyster|calamari|squid|clam|mussel|salmon|tuna|pippi|scallop|chowder/i],["Fish and chips",/fish and chips|fish & chips|battered fish/i],["Pies",/\bpies?\b|pasty|pasties|pot pie/i],["Sandwiches",/sandwich|sub\b|hoagie|cheesesteak|po' ?boy|toastie|club\b|reuben|banh mi/i],["Breakfast",/pancake|waffle|bacon and egg|eggs benedict|french toast|breakfast|omelette|hash brown|fry-up|scrambled/i],["Fries",/\bfries\b|hot chips|(?<!(corn|tortilla|potato|pita|bagel|kale|banana|apple|plantain|taro|prawn|vegetable|veggie|chocolate|choc) )\bchips\b|potato wedges|(?<!(watermelon|lemon|lime|orange|apple|melon|cheese|tomato|pineapple) )\bwedges\b|tater/i],["Cheese",/cheese board|cheese platter|fondue|mac and cheese|grilled cheese|toasted cheese|raclette/i],["Ice cream",/ice cream|sundae|gelato|milkshake|banana split|float/i],["Chocolate",/chocolate|brownie|fudge|cocoa/i],["Cake",/(?<!(crab|fish|rice|potato|corn|salmon|prawn|cod|oat|tuna|zucchini|sweetcorn|pea) )\bcakes?\b|cupcake|cheesecake|gateau|torte/i],["Donuts",/donut|doughnut|beignet|churro|zeppole/i],["Cookies",/cookie|biscuit|shortbread|snickerdoodle/i],["Popcorn",/popcorn/i]];
let craveSel=null,craveHits=[];
const craveRx=q=>{const w=q.trim().toLowerCase().replace(/[^a-z0-9 '&-]/g,"");if(!w)return null;const stem=w.replace(/(es|s)$/,"");return new RegExp(stem.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i")};
/* dish names and notes load after the page settles: the shop's seasonal shelves and the Candy bar use them */
let _dishes=null,_notes=null,dishesReady=false;
const fillDishes=(N,i)=>{for(const f of FILMS){if(f._full)continue;const n=N[f.id];if(!n)continue;["S","M","W","K"].forEach((k,c)=>{if(i===0)f[k]=(n[c]||[]).map(x=>[x]);else(f[k]||[]).forEach((d,j)=>{if(n[c]&&n[c][j]!=null)d[1]=n[c][j]})})}};
function ensureDishes(){
  if(!_dishes)_dishes=fetch("data/dish-names.json"+(window.DATA_V?"?v="+DATA_V.names:"")).then(r=>r.json()).then(N=>{fillDishes(N,0);dishesReady=true}).catch(()=>{_dishes=null});
  return _dishes||Promise.resolve();
}
function ensureNotes(){
  if(!_notes)_notes=ensureDishes().then(()=>fetch("data/dish-notes.json"+(window.DATA_V?"?v="+DATA_V.notes:""))).then(r=>r.json()).then(N=>fillDishes(N,1)).catch(()=>{_notes=null});
  return _notes||Promise.resolve();
}
let _notesOK=false;
function renderCrave(){
  if(!_notesOK){$("craveChips").innerHTML='<p class="crave-empty">Reading the board...</p>';ensureNotes().then(()=>{_notesOK=true;renderCrave()});return}
  if(!window.__craveN){window.__craveN={};CRAVES.forEach(([n,rx])=>{window.__craveN[n]=FILMS.filter(f=>["S","M","W","K"].some(k=>(f[k]||[]).some(it=>rx.test(it[0])))).length})}
  $("craveChips").innerHTML=CRAVES.map(([n])=>`<button type="button" aria-pressed="${craveSel===n}" data-crave="${ESC(n)}"><span>${ESC(n)}</span><b>${window.__craveN[n]}</b></button>`).join("");
  const typed=$("craveSearch").value;let rx=null,label="";
  if(typed.trim()){rx=craveRx(typed);label=typed.trim()}else if(craveSel){rx=CRAVES.find(c=>c[0]===craveSel)[1];label=craveSel.toLowerCase()}
  if(!rx){craveHits=[];$("craveCount").textContent="";$("craveSpin").hidden=true;$("craveGrid").innerHTML=`<p class="crave-empty">${tapWord("Tap something on the board to see which films serve it.")}</p>`;return}
  craveHits=[];
  for(const f of FILMS){if(kidsMode&&!isKidSafe(f))continue;if(!onSvc(f,svc))continue;const d=[];for(const k of["S","M","W","K"])for(const it of f[k]||[])if(rx.test(it[0]))d.push(it[0]);if(d.length)craveHits.push([f,d])}
  craveHits.sort((a,b)=>b[1].length-a[1].length||a[0].title.localeCompare(b[0].title));
  $("craveCount").textContent=craveHits.length?`Combo deal: ${label} with your pick of ${craveHits.length} film${craveHits.length>1?"s":""}`:"";
  $("craveSpin").hidden=craveHits.length<2;
  $("craveGrid").innerHTML=craveHits.length?craveHits.map(([f,d])=>`<div class="crave-hit">${tapeHTML(f)}<span class="crave-dish">${ESC(d.slice(0,2).join(", "))}</span></div>`).join(""):`<p class="crave-empty">No menus with ${ESC(label)} yet. Try another food.</p>`;
}
document.querySelectorAll(".more-menu .btn").forEach(b=>b.addEventListener("click",()=>setTimeout(()=>b.closest("details").open=false,150)));
$("svcSel").addEventListener("change",e=>setSvc(e.target.value));
$("shopSvc").addEventListener("change",e=>setSvc(e.target.value));
$("lazyBtn").addEventListener("click",()=>{lazy=!lazy;try{localStorage.setItem("mns-lazy",lazy?"1":"0")}catch(e){};setLazyUI();if(current)show(current,true)});
$("howBtn").addEventListener("click",showWelcome);
fillSvcSelects();setLazyUI();
$("craveChips").addEventListener("click",e=>{const b=e.target.closest("[data-crave]");if(!b)return;craveSel=craveSel===b.dataset.crave?null:b.dataset.crave;if(craveSel){sfx.pop();const pc=$("cbPop");pc.classList.remove("bounce");void pc.offsetWidth;pc.classList.add("bounce")}$("craveSearch").value="";renderCrave()});
$("craveSearch").addEventListener("input",()=>{if($("craveSearch").value.trim())craveSel=null;renderCrave()});
/* the candy bar belongs to the cinema: a film picked here goes straight to its menu at the box office, never to a Galaxy Video hire case */
function craveOpen(f,spun){addHistory(f);goView("wheel",true);if(tab!=="menu")setTab("menu");replay(f,!!spun).then(()=>toMenu());toMenu()}
$("craveGrid").addEventListener("click",e=>{const t=e.target.closest(".tape");if(t){e.preventDefault();const f=FILMS.find(x=>x.id===t.dataset.id);if(f)craveOpen(f)}});
$("craveSpin").addEventListener("click",()=>{const tapes=[...$("craveGrid").querySelectorAll(".tape")];if(!tapes.length)return;const p=tapes[Math.floor(Math.random()*tapes.length)];buzz([20,40,20]);tapes.forEach(t=>t.classList.remove("picked"));p.classList.add("picked");p.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});setTimeout(()=>{p.classList.remove("picked");const f=FILMS.find(x=>x.id===p.dataset.id);if(f)craveOpen(f,true)},reduce?0:700)});
function setView(v){
  const shop=v==="shop",crave=v==="crave";$("viewShop").hidden=!shop;$("viewCrave").hidden=!crave;$("viewWheel").hidden=shop||crave;
  /* the wheel canvas can be sized while its view is hidden (0 wide), so size it again once the box office shows */
  if(!shop&&!crave)requestAnimationFrame(()=>{if(canvas.width<2||canvas.width!==Math.round(canvas.getBoundingClientRect().width*Math.min(2,devicePixelRatio||1)))size()});
  $("viewShopBtn").setAttribute("aria-selected",shop);$("viewCraveBtn").setAttribute("aria-selected",crave);$("viewWheelBtn").setAttribute("aria-selected",!shop&&!crave);
  if(crave){renderCrave();renderSnacks()}
  document.body.classList.toggle("in-shop",shop);
  try{localStorage.setItem("mns-view",v)}catch(e){}
  if(shop&&!window.__inShop){sfx.chime();const sh=$("viewShop");sh.classList.remove("lightson");void sh.offsetWidth;sh.classList.add("lightson")}window.__inShop=shop;
  if(shop){if(!shopBuilt){const ds=[...new Set(FILMS.map(f=>f.year.slice(0,3)))].sort();$("shopDecade").innerHTML='<option value="">Any decade</option>'+ds.map(d=>`<option value="${d}">${d}0s</option>`).join("");shopBuilt=true}renderShop()}
  else if(!crave)scalePreview();
}
/* getting about: each tab lands at its own top, Back steps back through tabs and pop-ups, and every way into a film lands on its menu */
const topH=()=>{const t=document.querySelector(".top");return t?t.getBoundingClientRect().height:0};
function toEl(el){if(!el||!el.getBoundingClientRect)return;const y=el.getBoundingClientRect().top+scrollY-topH()-8;try{window.scrollTo({top:Math.max(0,y),behavior:reduce?"auto":"smooth"})}catch(e){window.scrollTo(0,Math.max(0,y))}}
function toMenu(){const fp=$("fmtPhone");toEl(fp&&!fp.hidden&&fp.innerHTML?fp:$("theatre"))}
const curView=()=>!$("viewShop").hidden?"shop":!$("viewCrave").hidden?"crave":"wheel";
const VIEW_EL={wheel:"viewWheel",shop:"viewShop",crave:"viewCrave"};
function goView(v,noScroll){const was=curView();setView(v);try{if(was!==v&&history.pushState)history.pushState({v},"",location.pathname+location.search+(v==="wheel"?"":"#"+v))}catch(e){}if(!noScroll)toEl($(VIEW_EL[v]))}
try{history.replaceState(Object.assign({},history.state||{},{v:curView()}),"")}catch(e){}
addEventListener("popstate",e=>{
  if(window.__ignorePop>0){window.__ignorePop--;return}
  const top=[...document.querySelectorAll("dialog[open]")].pop();
  if(top&&top._hist){top._popped=true;dismissModal(top);return}
  const v=(e.state&&e.state.v)||(location.hash==="#shop"?"shop":location.hash==="#crave"?"crave":"wheel");if(v!==curView()){setView(v);toEl($(VIEW_EL[v]))}
});
$("viewWheelBtn").addEventListener("click",()=>goView("wheel"));
$("viewShopBtn").addEventListener("click",()=>goView("shop"));
$("viewCraveBtn").addEventListener("click",()=>goView("crave"));
["shopSearch","shopDecade","shopUnwatched"].forEach(id=>$(id).addEventListener(id==="shopSearch"?"input":"change",renderShop));
$("shopCal").addEventListener("click",e=>{const b=e.target.closest("[data-season]");if(!b)return;const id=b.dataset.season;
  if(!b.classList.contains("on")){peekSeason=peekSeason===id?"":id;$("shopSearch").value="";renderShop();if(!peekSeason)return}
  const el=document.getElementById("season-"+id);if(el)el.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});
/* the signs in the shop photo walk you to that aisle the same way the aisle cards do: that aisle on its own, scrolled into view */
/* phone tap pads for the store's aisle signs: the photo pans at 720x360, so 44px is 12.2% of its height; each pad is centred on its sign (a big near sign grows upward only, so it never covers the far signs under it) and passes the tap on */
if(typeof document!=="undefined"&&document.querySelectorAll)setTimeout(()=>{try{document.querySelectorAll(".sv-pan").forEach(pan=>{if(pan.querySelector(".sv-hit"))return;const first=pan.querySelector(".sv-hang");
  pan.querySelectorAll(".sv-hang").forEach(b=>{const st=b.style,t=parseFloat(st.top),h=parseFloat(st.height),l=parseFloat(st.left),w=parseFloat(st.width);if(isNaN(t+h+l+w))return;
    const H=Math.max(h,13.6),i=document.createElement("i");i.className="sv-hit";i.setAttribute("aria-hidden","true");i.dataset.for=b.dataset.go;
    i.style.cssText=`left:calc(${l}% - 4px);width:calc(${w}% + 8px);top:${Math.max(0,h>=7?t+h-H:t-(H-h)/2)}%;height:${H}%`;pan.insertBefore(i,first)})})}catch(e){}},0);
if(typeof document!=="undefined"&&document.addEventListener)document.addEventListener("click",e=>{const pad=e.target.closest(".sv-hit");if(pad){const b=pad.parentNode.querySelector(`.sv-hang[data-go="${CSS.escape(pad.dataset.for)}"]`);if(b)b.click();return}},true);
if(typeof document!=="undefined"&&document.addEventListener)document.addEventListener("click",e=>{const h=e.target.closest(".sv-hang,.sv-hang-chip");if(!h)return;
  const g=h.dataset.go,secs=[...document.querySelectorAll("#shopAisles .aisle[data-name]")];
  const t=secs.find(x=>g==="wall"?x.classList.contains("wall"):x.dataset.name===g);
  if(!t){const st=$("status");if(st)st.textContent=kidsMode&&g==="Late Show"?"The Late Show is grown-ups only. Turn kids mode off to go in.":`Nothing on the ${g} shelves with these filters.`;return}
  try{sfx.chime&&tick()}catch(err){}
  hereAisle=t.dataset.name;try{sessionStorage.setItem("mns-aisle",hereAisle)}catch(err){}try{sfx.clunk()}catch(err){}applyAisle(false);
  /* straight down to the shelf itself, under the pinned tools bar, once the one-aisle view has laid out */
  try{fillShelf(t.querySelector(".shelf[data-k]"))}catch(err){}
  setTimeout(()=>{const st=document.querySelector("#viewShop .shop-tools"),pin=st&&/sticky|fixed/.test(getComputedStyle(st).position)?st.getBoundingClientRect().height:0;
    window.scrollTo({top:Math.max(0,t.getBoundingClientRect().top+scrollY-topH()-pin-12),behavior:"instant"})},60)});
$("shopAisles").addEventListener("scroll",e=>{const sh=e.target;if(sh.classList&&sh.classList.contains("shelf")&&sh.scrollLeft+sh.clientWidth>sh.scrollWidth-600)fillShelf(sh)},true);
$("shopAisles").addEventListener("click",e=>{
  const lc=e.target.closest(".ls-curtain");
  if(lc){const sec=lc.closest(".aisle");const n="Late Show";const ls=FILMS.filter(f=>(f.theme==="horror"||/^(MA15\+|R18\+|R)$/.test(ratingOf(f)||""))&&onSvc(f,svc)).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));sec.querySelector(".shelf").innerHTML=ls.map(tapeHTML).join("");sec.classList.add("open");lc.setAttribute("aria-expanded","true");sfx.swish();return}
  const sp=e.target.closest(".aisle-spin");
  if(sp){fillShelf(sp.closest(".aisle").querySelector(".shelf"));const tapes=[...sp.closest(".aisle").querySelectorAll(".tape")];const pick=tapes[Math.floor(Math.random()*tapes.length)];
    buzz([20,40,20]);tapes.forEach(t=>t.classList.remove("picked"));pick.classList.add("picked");pick.scrollIntoView({behavior:reduce?"auto":"smooth",inline:"center",block:"nearest"});
    setTimeout(()=>{pick.classList.remove("picked");const f=FILMS.find(x=>x.id===pick.dataset.id);if(f)openCase(f)},reduce?0:700);return}
  const t=e.target.closest(".tape");if(t){const f=FILMS.find(x=>x.id===t.dataset.id);if(f)openCase(f)}});

function menuText(){
  if(!current)return"";
  /* review 24: the copied text runs the same dry pass as the card (kids' mode read "Cold alcohol-free lager" and "margarita" here) */
  /* review 27: shopping lines that dry to the same drink read once, amounts added (dryJoin) */
  if(dryNow(current)){const raw=menuText0(),v=dryText(raw,true),i=v.indexOf("\nSHOPPING LIST\n");if(i<0)return v;
    const rawL=raw.slice(raw.indexOf("\nSHOPPING LIST\n")).split("\n").filter(l=>l.startsWith("[ ] "));let n=0;
    return v.slice(0,i)+v.slice(i).split("\n\n").map(b=>{const L=b.split("\n"),ls=L.filter(l=>l.startsWith("[ ] ")),head=L.filter(l=>!l.startsWith("[ ] "));return head.concat(dryJoin(ls.map(l=>[rawL[n++]||l,l.slice(4)])).map(e=>"[ ] "+e.text)).join("\n")}).join("\n\n")}
  return menuText0()}
function menuText0(){
  const m=current.menu,line=it=>`- ${it.n}${it.note?`, ${it.note}`:""}${it.how?`\n  How: ${it.how}`:""}`;
  return `${current.title} (${current.year})\n${current.tag}\n${current.D}\n\nSnacks\n${m.s.map(line).join("\n")}\n\n${m.m.length>1?"Mains":"Main"}\n${m.m.map(line).join("\n")}\n\nSomething sweet\n${m.w.map(line).join("\n")}\n\nTo drink\n${m.d.map(line).join("\n")}\n\nShowtime cue: ${movieEdition(current)?.cue||current.P}\n\nSHOPPING LIST\n${(current._r2&&current._r2.dishes&&current._r2.dishes.length?prepShopGroups(current):shopGroups(m)).map(([a,l])=>a+"\n"+l.map(x=>"[ ] "+x).join("\n")).join("\n\n")}`;
}

/* trailers load the first time someone opens a box */
const TRAILERS_JS=(document.querySelector('link[rel="prefetch"][href^="trailers.js"]')||{}).getAttribute?.("href")||"trailers.js";
/* export: the image and PDF tools only download when someone saves. Both are kept in assets/lib/ (html2canvas 1.4.1, jsPDF 2.5.1) so saving works offline and in the app */
const _libs={};
function loadScript(src){return _libs[src]||(_libs[src]=new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>{delete _libs[src];no()};document.head.appendChild(s)}))}
async function loadExportTools(pdf){
  try{await loadScript("assets/lib/html2canvas-1.4.1.min.js");if(pdf)await loadScript("assets/lib/jspdf-2.5.1.umd.min.js");return true}catch(e){return false}
}
/* export: render a clean copy of the card at full size */
let _noise=null;
/* Save PDF helpers (review 12): html2canvas paints a soft inset shadow and an edge vignette as a flat wash,
   so the export copy swaps each for a picture of it drawn on a canvas, which html2canvas copies as it is */
function splitLayers(s){const out=[];let d=0,b=0;for(let i=0;i<s.length;i++){const c=s[i];if(c==="(")d++;else if(c===")")d--;else if(c===","&&!d){out.push(s.slice(b,i).trim());b=i+1}}out.push(s.slice(b).trim());return out.filter(Boolean)}
function pdfSoftInset(w,h,list){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),F=w*4+h*4;
  x.beginPath();x.rect(0,0,w,h);x.clip();
  for(const sh of list){x.save();x.shadowColor=sh.col;x.shadowBlur=sh.b;x.shadowOffsetX=F;x.shadowOffsetY=0;x.fillStyle="#000";
    x.beginPath();x.rect(-F-w*2,-h*2,w*5,h*5);x.rect(-F+sh.x+sh.s,sh.y+sh.s,Math.max(0,w-2*sh.s),Math.max(0,h-2*sh.s));x.fill("evenodd");x.restore()}
  return c.toDataURL("image/png")}
/* review 18: a small repeating dot or hole tile ("radial-gradient(circle,transparent 3px,#fbf8f0 3.5px)" at 10px, a postage stamp's perforated
   edge) drawn as a picture of one tile; html2canvas left the stamp's edge straight */
function pdfDots(g,tw,th){const m=g.match(/^radial-gradient\((.*)\)$/);if(!m||!(tw>0&&th>0&&tw<=400&&th<=400))return null;const args=splitLayers(m[1]);let i=0,cx=tw/2,cy=th/2;
  const a0=args[0].trim();if(!/^(rgba?\(|transparent|#)/i.test(a0)){const a=a0.match(/^circle(?:\s+at\s+(center|[\d.]+%)(?:\s+(center|[\d.]+%))?)?$/);if(!a)return null;
    const pc=(v,L)=>v===undefined||v==="center"?L/2:parseFloat(v)/100*L;cx=pc(a[1],tw);cy=pc(a[2]===undefined?a[1]:a[2],th);i=1}
  /* a stop in per cent is a share of the distance to the tile's far corner (the default size), as in a halftone of dots (Superman's front page) */
  const far=Math.hypot(Math.max(cx,tw-cx),Math.max(cy,th-cy));
  const st=args.slice(i).map(x=>{const mm=x.trim().match(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]{3,8})\s+([\d.]+)(px|%)$/i);return mm?[mm[3]==="%"?parseFloat(mm[2])/100*far:parseFloat(mm[2]),mm[1]==="transparent"?"rgba(0,0,0,0)":mm[1]]:null});
  if(st.length<2||st.some(x=>!x))return null;const R=Math.max(...st.map(x=>x[0]))||1,k=4,c=document.createElement("canvas");c.width=Math.round(tw*k);c.height=Math.round(th*k);
  const x=c.getContext("2d"),gr=x.createRadialGradient(cx*k,cy*k,0,cx*k,cy*k,R*k);st.forEach(([v,col])=>gr.addColorStop(Math.min(1,v/R),col));x.fillStyle=gr;x.fillRect(0,0,c.width,c.height);return c.toDataURL("image/png")}
function pdfVignette(g,w,h){const m=g.match(/^radial-gradient\((.*)\)$/);if(!m)return null;const args=splitLayers(m[1]);
  /* shape, size and centre: "ellipse 120% 90% at 50% 45%", "ellipse at center", or nothing (an ellipse to the far corners from the middle) */
  let i=0,cx=w/2,cy=h/2,rx=0,ry=0;
  if(!/^(rgba?\(|transparent|#)/.test(args[0])){const a=args[0].trim().match(/^(ellipse)?\s*(?:([\d.]+)(%|px)\s+([\d.]+)(%|px))?\s*(?:at\s+(center|[\d.]+%)(?:\s+(center|[\d.]+%))?)?$/);if(!a)return null;
    const pc=(v,L)=>v===undefined||v==="center"?L/2:parseFloat(v)/100*L;cx=pc(a[6],w);cy=pc(a[7]===undefined?a[6]:a[7],h);
    if(a[2]){rx=a[3]==="%"?parseFloat(a[2])/100*w:+a[2];ry=a[5]==="%"?parseFloat(a[4])/100*h:+a[4]}i=1}
  if(!rx){const dx=Math.max(cx,w-cx),dy=Math.max(cy,h-cy);rx=dx*Math.SQRT2;ry=dy*Math.SQRT2}
  const stops=args.slice(i).map(a=>{const mm=a.match(/^(rgba?\([^)]*\)|transparent)\s*([\d.]+%)?$/);if(!mm)return null;const col=mm[1]==="transparent"?"rgba(0,0,0,0)":mm[1],al=(col.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)||[0,1])[1];return {col,at:mm[2]?parseFloat(mm[2])/100:null,a:+al}});
  /* review 18: a glow that starts tinted (Despicable Me 2's cafe wall, white at .1 to black at .35) is drawn too; html2canvas printed a box edge round it */
  if(stops.length<2||stops.some(s=>!s)||!(stops[stops.length-1].a>0))return null;
  stops.forEach((s,k)=>{if(s.at===null)s.at=k===0?0:k===stops.length-1?1:(stops[k-1].at+1)/2});
  /* a canvas gradient keeps the last colour past its end, as CSS does out to the edges */
  const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),k=ry/rx;
  x.setTransform(1,0,0,k,cx,cy);const gr=x.createRadialGradient(0,0,0,0,0,rx);stops.forEach(s=>gr.addColorStop(Math.min(1,Math.max(0,s.at)),s.col));
  x.fillStyle=gr;x.fillRect(-cx,-cy/k,w,h/k);return c.toDataURL("image/png")}
/* html2canvas ignores CSS filters, so a blurred, darkened backdrop (night diners) would print sharp and bright:
   paint the photo with its filter into a canvas the size of its box and use that picture instead */
function pdfFiltered(im,cs){const f=cs.filter;if(!f||f==="none"||!im.naturalWidth)return null;
  const w=Math.round(parseFloat(cs.width)),h=Math.round(parseFloat(cs.height));if(!w||!h||w*h>8e6)return null;
  const fit=cs.objectFit,iw=im.naturalWidth,ih=im.naturalHeight;let sx=0,sy=0,sw=iw,sh=ih,dx=0,dy=0,dw=w,dh=h;
  const op=(cs.objectPosition||"50% 50%").split(/\s+/).map(v=>/%$/.test(v)?parseFloat(v)/100:v==="left"||v==="top"?0:v==="right"||v==="bottom"?1:.5);
  if(fit==="cover"){const k=Math.max(w/iw,h/ih);sw=w/k;sh=h/k;sx=(iw-sw)*op[0];sy=(ih-sh)*(op[1]===undefined?.5:op[1])}
  else if(fit==="contain"){const k=Math.min(w/iw,h/ih);dw=iw*k;dh=ih*k;dx=(w-dw)*op[0];dy=(h-dh)*(op[1]===undefined?.5:op[1])}
  const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");
  const native="filter" in x&&(x.filter=f,x.filter&&x.filter!=="none");
  if(native){x.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh);x.filter="none"}
  else{/* no canvas filters (older Safari): blur by drawing small and scaling up, then darken, desaturate as a grey wash */
    const bl=parseFloat((f.match(/blur\(([\d.]+)px\)/)||[])[1]||0),br=parseFloat((f.match(/brightness\(([\d.]+)\)/)||[])[1]||1),sa=parseFloat((f.match(/saturate\(([\d.]+)\)/)||[])[1]||1);
    if(bl>2){const k=Math.max(1,bl/2),t=document.createElement("canvas");t.width=Math.max(1,Math.round(w/k));t.height=Math.max(1,Math.round(h/k));const tx=t.getContext("2d");tx.imageSmoothingQuality="high";tx.drawImage(im,sx,sy,sw,sh,dx/k,dy/k,dw/k,dh/k);x.imageSmoothingQuality="high";x.drawImage(t,0,0,w,h)}
    else x.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh);
    /* review 22: the washes cover the whole rectangle, so a see-through logo (a signature with brightness(0)) printed as a solid black box
       on iPhone. The darkening draws source-atop; the saturation wash covers everything, so a copy of the picture is kept and its outline cut back in after it */
    let m=null;if(sa<1){m=document.createElement("canvas");m.width=w;m.height=h;m.getContext("2d").drawImage(c,0,0)}
    if(sa<1){x.globalCompositeOperation="saturation";x.fillStyle=`rgba(128,128,128,${1-sa})`;x.fillRect(0,0,w,h);x.globalCompositeOperation="source-over"}
    if(br<1){x.globalCompositeOperation="source-atop";x.fillStyle=`rgba(0,0,0,${1-br})`;x.fillRect(0,0,w,h);x.globalCompositeOperation="source-over"}
    if(m){x.globalCompositeOperation="destination-in";x.drawImage(m,0,0);x.globalCompositeOperation="source-over";m.width=m.height=0}}
  /* review 24: a silhouette (brightness(0), the campfire signature) turns a logo's faint glow into a faint black haze over its whole box, and
     on paper that showed as a box under E.T.'s letters with a line along its clipped bottom edge. The see-through glow fades out on a smooth ramp
     (clear below a quarter, then up to full), so the haze goes and the letters stay solid with soft edges */
  if(/brightness\(0\)/.test(f))try{const id=x.getImageData(0,0,w,h),d=id.data;for(let i=3;i<d.length;i+=4)d[i]=d[i]<64?0:Math.round((d[i]-64)*255/191);x.putImageData(id,0,0)}catch(e){}
  /* review 13: a logo with a drop shadow (invite) is see-through around its letters, and a JPEG turned that into a black plate */
  try{let see=/drop-shadow/.test(f);if(!see){const d=x.getImageData(0,0,w,h).data;for(let i=3;i<d.length;i+=4*97)if(d[i]<250){see=true;break}}
    /* review 21: the canvas is emptied straight after, since iPhone Safari caps the canvas memory a page may hold and a menu or two of
       photos filled it, after which every bake came back empty ("data:,") and the photo stayed zoomed */
    const u=see?c.toDataURL("image/png"):c.toDataURL("image/jpeg",.9);c.width=c.height=0;return u&&u.length>32?u:null}catch(e){c.width=c.height=0;return null}}
/* repeating stripes (laid paper, woven mats, kiosk planks) print as one flat smear: a straight-across or straight-down stripe
   becomes one drawn tile of its pattern, repeated as a picture. Slanted stripes are left as they are */
/* review 13: html2canvas skips conic gradients, so a checker border (placemat) printed as plain paper: draw one tile in a canvas instead */
function pdfConic(g,w,h){const m=g.match(/^(repeating-)?conic-gradient\((.*)\)$/);if(!m||!w||!h||w*h>4e6)return null;const rep=!!m[1],args=splitLayers(m[2]);
  let i=0,from=0,cx=w/2,cy=h/2;const hd=args[0].trim();
  if(!/^(rgba?\(|#|transparent|[a-z]+\s)/i.test(hd)||/^(from|at)\b/.test(hd)){const f=hd.match(/from\s+(-?[\d.]+)deg/),a=hd.match(/at\s+([\d.]+)(%|px)\s+([\d.]+)(%|px)/);
    if(f)from=+f[1];if(a){cx=a[2]==="%"?+a[1]/100*w:+a[1];cy=a[4]==="%"?+a[3]/100*h:+a[3]}if(f||a||/^(from|at)\b/.test(hd))i=1}
  const st=[];for(const a of args.slice(i)){const mm=a.trim().match(/^(rgba?\([^)]*\)|#[0-9a-f]{3,8}|transparent|[a-z]+)((?:\s+-?[\d.]+(?:%|deg|turn))*)$/i);if(!mm)return null;
    const ps=(mm[2].match(/-?[\d.]+(%|deg|turn)/g)||[]).map(v=>/%$/.test(v)?parseFloat(v)/100:/deg$/.test(v)?parseFloat(v)/360:parseFloat(v));const col=mm[1]==="transparent"?"rgba(0,0,0,0)":mm[1];
    if(!ps.length)st.push({col,at:null});else ps.forEach(at=>st.push({col,at}))}
  if(st.length<2)return null;st.forEach((s,k)=>{if(s.at===null)s.at=k===0?0:k===st.length-1?1:st[k-1].at});
  for(let k=1;k<st.length;k++)if(st[k].at<st[k-1].at)st[k].at=st[k-1].at;
  const per=rep?st[st.length-1].at:1;if(!(per>0))return null;
  const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");if(!x.createConicGradient)return null;
  const gr=x.createConicGradient((from-90)*Math.PI/180,cx,cy);const E=1e-4;
  for(let base=0;base<1-E;base+=per)for(const s of st){const at=base+s.at;if(at>1+E)break;gr.addColorStop(Math.min(1,Math.max(0,at)),s.col)}
  x.fillStyle=gr;x.fillRect(0,0,w,h);return c.toDataURL("image/png")}
const PDF_GCO={multiply:"multiply",overlay:"overlay",screen:"screen",darken:"darken",lighten:"lighten","soft-light":"soft-light","hard-light":"hard-light","color-burn":"color-burn","color-dodge":"color-dodge"};
async function pdfBlendBake(root){const solidBg=e=>{const c=getComputedStyle(e);if(c.backgroundImage!=="none")return null;const m=c.backgroundColor.match(/rgba?\(([^)]*)\)/);if(!m)return null;const q=m[1].split(/[\s,/]+/).filter(Boolean).map(Number);return q.length<4||q[3]>=.99?c.backgroundColor:null};
  const baked=new Map();
  for(const el of root.querySelectorAll("[data-pblend]")){try{const mode=PDF_GCO[el.dataset.pblend];if(!mode)continue;const r=el.getBoundingClientRect(),w=Math.round(el.offsetWidth),h=Math.round(el.offsetHeight);if(!w||!h||w*h>4e6)continue;
    /* the paper under it: the sibling just before it covering the same box, or the parent when nothing is painted before it */
    let under=null,prev=el.previousElementSibling;
    if(prev){const pr=prev.getBoundingClientRect();if(Math.abs(pr.left-r.left)<1&&Math.abs(pr.top-r.top)<1&&Math.abs(pr.width-r.width)<1&&Math.abs(pr.height-r.height)<1)under=baked.get(prev)||solidBg(prev)}
    else if(el.parentElement)under=solidBg(el.parentElement);
    if(!under)continue;
    const cs=getComputedStyle(el),lay=splitLayers(cs.backgroundImage||"none");if(!lay.length||lay.some(g=>!/^url\(/.test(g)))continue;
    const L=v=>v.split(/,(?![^(]*\))/).map(x=>x.trim()),sz=L(cs.backgroundSize),ps=L(cs.backgroundPosition),at=(a,i)=>a[i]||a[a.length-1];
    const k=2,B=document.createElement("canvas");B.width=w*k;B.height=h*k;const bx=B.getContext("2d");let ok=true;
    for(let i=lay.length-1;i>=0;i--){const src=lay[i].replace(/^url\(["']?|["']?\)$/g,""),im=new Image();im.crossOrigin="anonymous";im.src=src;await im.decode();
      const m=at(sz,i).match(/^([\d.]+)px(?:\s+(?:([\d.]+)px|auto))?$/),p0=at(ps,i).match(/^(-?[\d.]+)px\s+(-?[\d.]+)px$/)||(at(ps,i)==="0% 0%"?[0,0,0]:null);if(!m||!p0){ok=false;break}
      const tw=+m[1],th=m[2]?+m[2]:tw*im.naturalHeight/im.naturalWidth,pat=bx.createPattern(im,"repeat");pat.setTransform(new DOMMatrix().translate(+p0[1]*k,+p0[2]*k).scale(tw*k/im.naturalWidth,th*k/im.naturalHeight));
      bx.fillStyle=pat;bx.fillRect(0,0,B.width,B.height)}
    if(!ok)continue;
    const c=document.createElement("canvas");c.width=w*k;c.height=h*k;const x=c.getContext("2d");if(typeof under==="string"){x.fillStyle=under;x.fillRect(0,0,c.width,c.height)}else x.drawImage(under,0,0,c.width,c.height);
    x.globalAlpha=+cs.opacity;x.globalCompositeOperation=mode;x.drawImage(B,0,0);
    el.style.backgroundImage=`url("${c.toDataURL("image/png")}")`;el.style.backgroundSize=`${w}px ${h}px`;el.style.backgroundPosition="0px 0px";el.style.backgroundRepeat="no-repeat";el.style.opacity="1";el.removeAttribute("data-pblend");baked.set(el,c)}catch(err){}}}
/* review 14: html2canvas skips CSS masks, so a faded photo printed with a hard edge (club). The mask's linear gradient is applied to a picture of the box:
   its alpha stops become a gradient drawn with destination-in, along the same angle */
async function pdfMaskDraw(el){const w=el.clientWidth,h=el.clientHeight,k=2.5;if(!w||!h)return null;const c=document.createElement("canvas");c.width=Math.round(w*k);c.height=Math.round(h*k);const x=c.getContext("2d");
  const r0=el.getBoundingClientRect(),bw=parseFloat(getComputedStyle(el).borderLeftWidth)||0,bt=parseFloat(getComputedStyle(el).borderTopWidth)||0;
  {const bc=getComputedStyle(el).backgroundColor;if(bc&&!/rgba\([^)]*,\s*0\)|transparent/.test(bc)){x.fillStyle=bc;x.fillRect(0,0,c.width,c.height)}}
  const blend={screen:"screen",multiply:"multiply",overlay:"overlay",lighten:"lighten",darken:"darken","soft-light":"soft-light"};
  for(const n of el.querySelectorAll("*")){const cs=getComputedStyle(n);if(cs.display==="none"||cs.visibility==="hidden")continue;const r=n.getBoundingClientRect();if(!r.width||!r.height)continue;
    const dx=(r.left-r0.left-bw)*k,dy=(r.top-r0.top-bt)*k,dw=r.width*k,dh=r.height*k;x.save();x.globalAlpha=+cs.opacity||1;x.globalCompositeOperation=blend[cs.mixBlendMode]||"source-over";
    if(n.tagName==="IMG"&&n.naturalWidth){const iw=n.naturalWidth,ih=n.naturalHeight,fit=cs.objectFit,op=(cs.objectPosition||"50% 50%").split(/\s+/).map(v=>/%$/.test(v)?parseFloat(v)/100:.5);
      let sx=0,sy=0,sw=iw,sh=ih,ex=dx,ey=dy,ew=dw,eh=dh;
      if(fit==="cover"){const q=Math.max(dw/iw,dh/ih);sw=dw/q;sh=dh/q;sx=(iw-sw)*op[0];sy=(ih-sh)*(op[1]===undefined?.5:op[1])}
      else if(fit==="contain"){const q=Math.min(dw/iw,dh/ih);ew=iw*q;eh=ih*q;ex=dx+(dw-ew)*op[0];ey=dy+(dh-eh)*(op[1]===undefined?.5:op[1])}
      if(cs.filter&&cs.filter!=="none")x.filter=cs.filter.replace(/blur\(([\d.]+)px\)/,(m,v)=>`blur(${v*k}px)`);x.drawImage(n,sx,sy,sw,sh,ex,ey,ew,eh)}
    else if(/gradient/.test(cs.backgroundImage)&&!n.textContent.trim()){for(const g of splitLayers(cs.backgroundImage).reverse()){const v=/^radial/.test(g)?pdfVignette(g,Math.round(r.width),Math.round(r.height)):null;
      if(v){const vi=new Image();vi.src=v;await vi.decode().catch(()=>{});try{x.drawImage(vi,dx,dy,dw,dh)}catch(e){}}else if(/^linear-gradient/.test(g)){/* a straight gradient: let the browser paint it to a box and copy that */const t=document.createElement("canvas");t.width=Math.max(1,Math.round(dw));t.height=Math.max(1,Math.round(dh));
        const m=g.match(/^linear-gradient\((.*)\)$/);if(m){const a=splitLayers(m[1]);let ang=180;if(/^-?[\d.]+deg$/.test(a[0].trim())){ang=parseFloat(a[0]);a.shift()}const tc=t.getContext("2d"),th=ang*Math.PI/180,ux=Math.sin(th),uy=-Math.cos(th),L=Math.abs(t.width*ux)+Math.abs(t.height*uy),gr=tc.createLinearGradient(t.width/2-ux*L/2,t.height/2-uy*L/2,t.width/2+ux*L/2,t.height/2+uy*L/2);
          let ok=true;a.forEach((s0,i)=>{const mm=s0.trim().match(/^(rgba?\([^)]*\)|#[0-9a-f]{3,8}|transparent)\s*([\d.]+%)?$/i);if(!mm){ok=false;return}gr.addColorStop(mm[2]?Math.min(1,parseFloat(mm[2])/100):i/(a.length-1),mm[1]==="transparent"?"rgba(0,0,0,0)":mm[1])});
          if(ok){tc.fillStyle=gr;tc.fillRect(0,0,t.width,t.height);x.drawImage(t,dx,dy)}}}}}
    x.restore()}
  return pdfMaskApply(c,el.dataset.pmask)}
function pdfMaskApply(cv,mk){const m=mk.match(/^linear-gradient\((.*)\)$/);if(!m)return null;const a=splitLayers(m[1]);let ang=180;
  const a0=a[0].trim();if(/^-?[\d.]+deg$/.test(a0)){ang=parseFloat(a0);a.shift()}else if(/^to /.test(a0)){ang={"to top":0,"to right":90,"to bottom":180,"to left":270}[a0];if(ang===undefined)return null;a.shift()}
  const st=a.map(s=>{const x=s.trim().match(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]{3,8}|black)\s*([\d.]+%)?$/i);if(!x)return null;let al=1;
    if(/^transparent$/i.test(x[1]))al=0;else{const r=x[1].match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);if(r)al=+r[1]}return {al,at:x[2]?parseFloat(x[2])/100:null}});
  if(st.length<2||st.some(x=>!x))return null;st.forEach((x,k)=>{if(x.at===null)x.at=k===0?0:k===st.length-1?1:st[k-1].at});
  const W=cv.width,H=cv.height,t=ang*Math.PI/180,dx=Math.sin(t),dy=-Math.cos(t),L=Math.abs(W*dx)+Math.abs(H*dy),cx=W/2,cy=H/2;
  const x=cv.getContext("2d"),g=x.createLinearGradient(cx-dx*L/2,cy-dy*L/2,cx+dx*L/2,cy+dy*L/2);st.forEach(s=>g.addColorStop(Math.min(1,Math.max(0,s.at)),`rgba(0,0,0,${s.al})`));
  x.globalCompositeOperation="destination-in";x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation="source-over";return cv.toDataURL("image/png")}
/* review 19: html2canvas cannot do CSS masks, and a masked box that holds words (a hotel door hanger with its hole, an airline ticket with
   punched notches) printed solid. The mask's gradient layers (radial holes and notches, straight fades) are drawn as an alpha picture,
   the box's own fill and its empty texture layers are drawn under it, and the words stay in the page, laid over the picture */
function pdfLen(v,full){v=String(v).trim();if(/%$/.test(v))return parseFloat(v)/100*full;if(/px$/.test(v)||/^-?[\d.]+$/.test(v))return parseFloat(v);
  return {left:0,top:0,center:full/2,right:full,bottom:full}[v]}
function pdfAlphaStops(list,len){const st=list.map(s=>{const x=s.trim().match(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]{3,8}|black|white)\s*(-?[\d.]+(?:%|px))?$/i);if(!x)return null;let al=1;
    if(/^transparent$/i.test(x[1]))al=0;else{const r=x[1].match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);if(r)al=+r[1];else if(/^#[0-9a-f]{4}$|^#[0-9a-f]{8}$/i.test(x[1])){const hx=x[1].slice(1);al=parseInt(hx.length===4?hx[3]+hx[3]:hx.slice(6),16)/255}}
    return {al,at:x[2]?(/%$/.test(x[2])?parseFloat(x[2])/100:parseFloat(x[2])/len):null}});
  if(st.length<2||st.some(x=>!x))return null;st.forEach((x,i)=>{if(x.at===null)x.at=i===0?0:i===st.length-1?1:st[i-1].at});return st}
function pdfMaskAlpha(cs,w,h,k){const img=cs.webkitMaskImage||cs.maskImage;if(!img||img==="none")return null;const L=splitLayers(img);
  const sz=splitLayers(cs.webkitMaskSize||cs.maskSize||"auto"),ps=splitLayers(cs.webkitMaskPosition||cs.maskPosition||"0% 0%"),rp=splitLayers(cs.webkitMaskRepeat||cs.maskRepeat||"repeat"),at=(a,i)=>a[i]||a[a.length-1];
  const c=document.createElement("canvas");c.width=Math.round(w*k);c.height=Math.round(h*k);const x=c.getContext("2d");
  for(let i=0;i<L.length;i++){const g=L[i];const s=at(sz,i).trim().split(/\s+/);let tw=w,th=h;
    if(s[0]&&s[0]!=="auto"&&s[0]!=="cover"&&s[0]!=="contain"){tw=pdfLen(s[0],w);th=s[1]&&s[1]!=="auto"?pdfLen(s[1],h):h}if(!(tw>0&&th>0))return null;
    const p=at(ps,i).trim().split(/\s+/);let px=p[0]||"0%",py=p[1]||"50%";if(/^(top|bottom)$/.test(px)){const t=px;px=py==="50%"?"center":py;py=t}
    const ox=/%$/.test(px)?(w-tw)*parseFloat(px)/100:px==="right"?w-tw:px==="center"?(w-tw)/2:pdfLen(px,w)||0,oy=/%$/.test(py)?(h-th)*parseFloat(py)/100:py==="bottom"?h-th:py==="center"?(h-th)/2:pdfLen(py,h)||0;
    const T=document.createElement("canvas");T.width=Math.max(1,Math.round(tw*k));T.height=Math.max(1,Math.round(th*k));const tx=T.getContext("2d");let gr=null;
    let m=g.match(/^radial-gradient\((.*)\)$/);
    if(m){const a=splitLayers(m[1]),hd=a[0].trim().match(/^(?:circle\s+)?([\d.]+)px(?:\s+circle)?(?:\s+at\s+(\S+)(?:\s+(\S+))?)?$/);if(!hd)return null;
      const R=+hd[1],cx=hd[2]?pdfLen(hd[2],tw):tw/2,cy=hd[3]?pdfLen(hd[3],th):hd[2]?th/2:th/2,st=pdfAlphaStops(a.slice(1),R);if(!st||!(R>0))return null;
      gr=tx.createRadialGradient(cx*k,cy*k,0,cx*k,cy*k,R*k);st.forEach(z=>gr.addColorStop(Math.min(1,Math.max(0,z.at)),`rgba(0,0,0,${z.al})`))}
    else if((m=g.match(/^linear-gradient\((.*)\)$/))){const a=splitLayers(m[1]);let ang=180;const a0=a[0].trim();
      if(/^-?[\d.]+deg$/.test(a0)){ang=parseFloat(a0);a.shift()}else if(/^to /.test(a0)){ang={"to top":0,"to right":90,"to bottom":180,"to left":270}[a0];if(ang===undefined)return null;a.shift()}
      const t=ang*Math.PI/180,dx=Math.sin(t),dy=-Math.cos(t),len=Math.abs(tw*dx)+Math.abs(th*dy),st=pdfAlphaStops(a,len);if(!st)return null;
      gr=tx.createLinearGradient((tw/2-dx*len/2)*k,(th/2-dy*len/2)*k,(tw/2+dx*len/2)*k,(th/2+dy*len/2)*k);st.forEach(z=>gr.addColorStop(Math.min(1,Math.max(0,z.at)),`rgba(0,0,0,${z.al})`))}
    else return null;
    tx.fillStyle=gr;tx.fillRect(0,0,T.width,T.height);
    const r=at(rp,i).trim(),rx=!/no-repeat|repeat-y/.test(r)||r==="repeat-x",ry=!/no-repeat|repeat-x/.test(r)||r==="repeat-y";
    const xs=rx?(()=>{const o=[];for(let v=ox-Math.ceil(ox/tw)*tw;v<w;v+=tw)o.push(v);return o})():[ox],ys=ry?(()=>{const o=[];for(let v=oy-Math.ceil(oy/th)*th;v<h;v+=th)o.push(v);return o})():[oy];
    for(const X of xs)for(const Y of ys)x.drawImage(T,Math.round(X*k),Math.round(Y*k),T.width,T.height)}
  return c}
/* each corner as [horizontal, vertical] radius, so an oval (border-radius 50%, or tiki's "46% 54% 42% 58% / 52% 44% 56% 48%") stays an oval (review 20) */
function pdfRadii(cs,w,h){return ["TopLeft","TopRight","BottomRight","BottomLeft"].map(s=>{const p=(cs["border"+s+"Radius"]||"0").split(/\s+/);return [pdfLen(p[0],w)||0,pdfLen(p[1]||p[0],h)||0]})}
function pdfShapePath(x,X,Y,w,h,rad,poly){x.beginPath();if(poly){poly.forEach(([a,b],i)=>i?x.lineTo(X+a,Y+b):x.moveTo(X+a,Y+b));x.closePath();return}
  if(!rad.some(r=>r[0]>0&&r[1]>0)){x.rect(X,Y,w,h);return}
  /* corners that add up past a side shrink together, as the browser does */
  const [tl,tr,br,bl]=rad,f=Math.min(1,w/(tl[0]+tr[0]||1),w/(bl[0]+br[0]||1),h/(tl[1]+bl[1]||1),h/(tr[1]+br[1]||1)),R=rad.map(([a,b])=>a>0&&b>0?[a*f,b*f]:[0,0]),H=Math.PI/2;
  x.moveTo(X+R[0][0],Y);x.lineTo(X+w-R[1][0],Y);if(R[1][0])x.ellipse(X+w-R[1][0],Y+R[1][1],R[1][0],R[1][1],0,-H,0);
  x.lineTo(X+w,Y+h-R[2][1]);if(R[2][0])x.ellipse(X+w-R[2][0],Y+h-R[2][1],R[2][0],R[2][1],0,0,H);
  x.lineTo(X+R[3][0],Y+h);if(R[3][0])x.ellipse(X+R[3][0],Y+h-R[3][1],R[3][0],R[3][1],0,H,2*H);
  x.lineTo(X,Y+R[0][1]);if(R[0][0])x.ellipse(X+R[0][0],Y+R[0][1],R[0][0],R[0][1],0,2*H,3*H);x.closePath()}
/* where a box sits inside another, in layout pixels (transforms left out), by its offsetParent chain */
function pdfOffsetIn(n,root){let X=0,Y=0,e=n;while(e&&e!==root){X+=e.offsetLeft;Y+=e.offsetTop;const p=e.offsetParent;if(!p)return null;if(p!==root){X+=p.clientLeft;Y+=p.clientTop}e=p}return e===root?{X,Y}:null}
function pdfParseShadow(sh){const col=(sh.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/i)||[])[0],n=(sh.replace(/rgba?\([^)]*\)/g,"").match(/-?[\d.]+(px)?/g)||[]).map(parseFloat);
  return col&&n.length>=2?{x:n[0],y:n[1],b:n[2]||0,s:n[3]||0,col}:null}
function pdfDropShadows(f){return (String(f||"").match(/drop-shadow\((?:[^()]|\([^)]*\))*\)/g)||[]).map(d=>pdfParseShadow(d.slice(12,-1))).filter(Boolean)}
async function pdfMaskBox(el){const cs=getComputedStyle(el),w=el.offsetWidth,h=el.offsetHeight,k=2.5;if(!w||!h)return false;
  const A=pdfMaskAlpha(cs,w,h,k);if(!A)return false;
  const c=document.createElement("canvas");c.width=A.width;c.height=A.height;const x=c.getContext("2d");
  const rad=pdfRadii(cs,w,h).map(([p,q])=>[p*k,q*k]);x.save();pdfShapePath(x,0,0,c.width,c.height,rad);x.clip();
  {const bc=cs.backgroundColor;if(bc&&!/rgba\([^)]*,\s*0\)|transparent/.test(bc)){x.fillStyle=bc;x.fillRect(0,0,c.width,c.height)}}
  const drawn=[],blend={screen:"screen",multiply:"multiply",overlay:"overlay",lighten:"lighten",darken:"darken","soft-light":"soft-light"};
  /* the box's empty layers (grain, sheen, a photo) go into the picture; anything holding words stays in the page */
  for(const n of el.querySelectorAll("*")){if(n.textContent.trim()||n.closest("svg"))continue;{let t=n.parentElement,inT=false;while(t&&t!==el){if(t.textContent.trim()){inT=true;break}t=t.parentElement}if(inT)continue}if(drawn.some(d=>d.contains(n)))continue;const ns=getComputedStyle(n);if(ns.display==="none"||ns.visibility==="hidden")continue;
    const o=pdfOffsetIn(n,el);if(!o)continue;const dx=(o.X+el.clientLeft)*k,dy=o.Y*k,dw=n.offsetWidth*k,dh=n.offsetHeight*k;if(!dw||!dh){continue}
    x.save();x.globalAlpha=+ns.opacity||1;x.globalCompositeOperation=blend[ns.mixBlendMode]||"source-over";
    try{if(n.tagName==="IMG"&&n.naturalWidth){x.drawImage(n,dx,dy,dw,dh)}
      else{const bc=ns.backgroundColor;if(bc&&!/rgba\([^)]*,\s*0\)|transparent/.test(bc)){x.fillStyle=bc;x.fillRect(dx,dy,dw,dh)}
        for(const g of splitLayers(ns.backgroundImage||"none").reverse()){const u=g.match(/^url\("?(.*?)"?\)$/);if(!u)continue;const im=new Image();im.src=u[1];await im.decode();
          const bs=(ns.backgroundSize.split(/,\s*/)[0]||"auto").trim().split(/\s+/),tw=bs[0]&&bs[0]!=="auto"?pdfLen(bs[0],n.offsetWidth):im.naturalWidth||300,th=bs[1]&&bs[1]!=="auto"?pdfLen(bs[1],n.offsetHeight):tw*(im.naturalHeight||1)/(im.naturalWidth||1);
          const T=document.createElement("canvas");T.width=Math.max(1,Math.round(tw*k));T.height=Math.max(1,Math.round(th*k));T.getContext("2d").drawImage(im,0,0,T.width,T.height);
          x.save();x.translate(dx,dy);x.fillStyle=x.createPattern(T,"repeat");x.fillRect(0,0,dw,dh);x.restore()}}}catch(e){}
    x.restore();drawn.push(n)}
  x.restore();x.globalCompositeOperation="destination-in";x.drawImage(A,0,0);x.globalCompositeOperation="source-over";
  /* a drop shadow on a wrapper round just this shape (the hanger) is drawn into the picture too, since html2canvas skips filters */
  const par=el.parentElement,ds=par&&par.children.length===1&&el.offsetParent===par?pdfDropShadows(getComputedStyle(par).filter):[];let out=c,P=0;
  if(ds.length){P=Math.ceil(Math.max(...ds.map(d=>2*d.b+Math.max(Math.abs(d.x),Math.abs(d.y)))))+2;const o=document.createElement("canvas");o.width=c.width+2*P*k;o.height=c.height+2*P*k;const ox=o.getContext("2d");
    for(const d of ds){ox.save();ox.shadowColor=d.col;ox.shadowBlur=d.b*k;ox.shadowOffsetX=d.x*k;ox.shadowOffsetY=d.y*k;ox.drawImage(c,P*k,P*k);ox.restore()}ox.drawImage(c,P*k,P*k);out=o;
    par.style.filter=getComputedStyle(par).filter.replace(/drop-shadow\((?:[^()]|\([^)]*\))*\)/g,"").trim()||"none"}
  let url;try{url=out.toDataURL("image/png")}catch(e){return false}
  drawn.forEach(n=>n.remove());el.style.webkitMask="none";el.style.mask="none";el.style.webkitMaskImage="none";el.style.maskImage="none";el.style.background="none";el.style.boxShadow="none";
  const im=new Image();im.alt="";im.src=url;await im.decode().catch(()=>{});
  if(P){im.style.cssText=`position:absolute;left:${el.offsetLeft-P}px;top:${el.offsetTop-P}px;width:${w+2*P}px;height:${h+2*P}px;max-width:none;max-height:none;margin:0;pointer-events:none`;par.insertBefore(im,el);
    if(getComputedStyle(el).position==="static")el.style.position="relative"}
  else{if(getComputedStyle(el).position==="static")el.style.position="relative";im.style.cssText=`position:absolute;left:${-el.clientLeft}px;top:${-el.clientTop}px;width:${w}px;height:${h}px;max-width:none;max-height:none;margin:0;pointer-events:none`;
    [...el.children].forEach(ch=>{if(getComputedStyle(ch).position==="static")ch.style.position="relative"});el.insertBefore(im,el.firstChild)}
  return true}
/* review 19: html2canvas draws an outer box shadow at its 2.5x scale with the shadow pushed off the page (canvas shadow offsets are not scaled),
   so no lifted photo, card or tray printed its shadow. Each outer shadow is drawn here as a picture laid behind its box, turned with it.
   A drop-shadow filter on a plain box (a stamp, a tag cut by clip-path) becomes the same kind of shadow first */
async function pdfLiftBake(root){const k=2.5,boxes=[];
  for(const el of [...root.querySelectorAll("*")]){const cs=getComputedStyle(el);if(cs.display==="none"||cs.visibility==="hidden"||!el.offsetWidth||!el.offsetHeight||!el.parentElement)continue;
    /* drop-shadow filters: on a box that paints its own fill, or a wrapper whose one child fills it (clip-path shape) */
    const ds=pdfDropShadows(cs.filter);
    if(ds.length&&el.tagName!=="IMG"){const own=(!/rgba\([^)]*,\s*0\)|transparent/.test(cs.backgroundColor))||cs.backgroundImage!=="none";
      const one=el.children.length>=1?el.children[0]:null,oc=one&&getComputedStyle(one),fill=one&&one.offsetWidth>=el.offsetWidth-2&&one.offsetHeight>=el.offsetHeight-2&&oc.position==="absolute"&&((!/rgba\([^)]*,\s*0\)|transparent/.test(oc.backgroundColor))||oc.backgroundImage!=="none");
      const textOnly=!own&&!fill&&el.textContent.trim();
      if(own||fill){const tgt=own?el:one;boxes.push({el:tgt,list:ds,via:el});el.style.filter=cs.filter.replace(/drop-shadow\((?:[^()]|\([^)]*\))*\)/g,"").trim()||"none"}
      else if(textOnly){/* lettering: a text shadow, which html2canvas draws (blur is not scaled there, so it is set at print scale) */
        el.style.textShadow=ds.map(d=>`${d.x}px ${d.y}px ${d.b*k}px ${d.col}`).join(",");el.style.filter=cs.filter.replace(/drop-shadow\((?:[^()]|\([^)]*\))*\)/g,"").trim()||"none"}}
    const bs=cs.boxShadow;if(!bs||bs==="none")continue;const parts=splitLayers(bs),outer=parts.filter(p=>!/\binset\b/.test(p)).map(pdfParseShadow).filter(d=>d&&!/rgba\([^)]*,\s*0\)$/.test(d.col)&&(d.b>0||d.x||d.y||d.s));
    if(!outer.length)continue;boxes.push({el,list:outer,keep:parts.filter(p=>/\binset\b/.test(p))})}
  for(const B of boxes){const el=B.el;try{const cs=getComputedStyle(el),w=el.offsetWidth,h=el.offsetHeight;if(!w||!h)continue;
    const cp=cs.clipPath,poly=/^polygon\(/.test(cp||"")?splitLayers(cp.slice(8,-1)).map(p=>{const q=p.trim().split(/\s+/);return [pdfLen(q[0],w),pdfLen(q[1],h)]}):null;
    if(cp&&cp!=="none"&&!poly)continue;if((cs.webkitMaskImage||cs.maskImage||"none")!=="none")continue;
    const P=Math.ceil(Math.max(...B.list.map(d=>2*d.b+Math.abs(d.s)+Math.max(Math.abs(d.x),Math.abs(d.y)))))+2,c=document.createElement("canvas");c.width=Math.round((w+2*P)*k);c.height=Math.round((h+2*P)*k);
    const x=c.getContext("2d"),rad=pdfRadii(cs,w,h);
    /* review 20: each layer is its own shape, grown by its spread, filled in the shadow's colour, moved by its offset and blurred
       (a CSS blur radius is twice the standard deviation). The fill used to be black, so a spread with no blur printed as a black ring */
    for(const d of [...B.list].reverse()){x.save();x.fillStyle=d.col;if(d.b>0)x.filter=`blur(${(d.b*k/2).toFixed(2)}px)`;
      const s=poly?0:d.s;pdfShapePath(x,(P-s+d.x)*k,(P-s+d.y)*k,(w+2*s)*k,(h+2*s)*k,rad.map(([p,q])=>p>0&&q>0?[(p+s)*k,(q+s)*k]:[0,0]),poly&&poly.map(([a,b])=>[a*k,b*k]));
      x.fill();x.restore()}
    /* the shape itself is cut back out: a box shadow is never painted under its own box (Chrome skips the shadow of a shape drawn off the canvas, so it is drawn in place and removed) */
    {x.save();x.globalCompositeOperation="destination-out";pdfShapePath(x,P*k,P*k,w*k,h*k,rad.map(([p,q])=>[p*k,q*k]),poly&&poly.map(([a,b])=>[a*k,b*k]));x.fill();x.restore()}
    /* review 21: on a hand-built card the wall (or sheet) is the page edge on paper, and the card's padding round it prints white. A shadow that
       spilled past the wall into that padding stopped trimWhite and printed as a white bar with a grey edge (Ratatouille's menu panel,
       Ghostbusters, When Harry Met Sally), so the shadow is cut back to the wall (skipped when a box between it and the wall is turned) */
    {const paper=root.querySelector(":scope>.fx-wall,:scope>.fx-sheet");let ok=paper&&paper!==el&&paper.contains(el);
      let up=false;for(let a=el.parentElement;ok&&a&&a!==paper;a=a.parentElement)if(getComputedStyle(a).transform!=="none")up=true;
      /* review 24: Goodfellas' notepad sits in a turned column, so its shadow was never cut back and printed a white bar under the gingham.
         With a turned box above it, three marks laid at the box's own corners read where its frame lands on the page, and the wall's corners are taken back through that */
      let pts=null;if(ok&&up&&!/^(IMG|INPUT|CANVAS|VIDEO|SVG|svg)$/.test(el.tagName)){const pr=paper.getBoundingClientRect(),ps=el.style.position,bl=el.clientLeft,bt=el.clientTop;if(cs.position==="static")el.style.position="relative";
        const S=[[0,0],[w,0],[0,h]].map(([a,b])=>{const m=document.createElement("i");m.style.cssText=`position:absolute;left:${a-bl}px;top:${b-bt}px;width:0;height:0;margin:0;padding:0;border:0`;el.appendChild(m);const r=m.getBoundingClientRect();m.remove();return [r.left,r.top]});
        el.style.position=ps;const ax=(S[1][0]-S[0][0])/w,ay=(S[1][1]-S[0][1])/w,bx=(S[2][0]-S[0][0])/h,by=(S[2][1]-S[0][1])/h,det=ax*by-bx*ay;
        if(Math.abs(det)>1e-6)pts=[[pr.left,pr.top],[pr.right,pr.top],[pr.right,pr.bottom],[pr.left,pr.bottom]].map(([X,Y])=>{const dx=X-S[0][0],dy=Y-S[0][1];return [((dx*by-dy*bx)/det+P)*k,((ax*dy-ay*dx)/det+P)*k]})}
      if(up)ok=false;
      if(ok){const tr=el.style.transform;el.style.transform="none";const er=el.getBoundingClientRect();el.style.transform=tr;const pr=paper.getBoundingClientRect();
        /* a turned box: the wall's corners are taken into the box's own frame (the inverse of its turn, about its transform origin) */
        const M=cs.transform==="none"?new DOMMatrix():new DOMMatrix(cs.transform),inv=M.inverse(),og=(cs.transformOrigin||"50% 50%").split(/\s+/).map((v,i)=>pdfLen(v,i?h:w)),ox=er.left+og[0],oy=er.top+og[1];
        pts=[[pr.left,pr.top],[pr.right,pr.top],[pr.right,pr.bottom],[pr.left,pr.bottom]].map(([X,Y])=>{const q=inv.transformPoint(new DOMPoint(X-ox,Y-oy));return [(q.x+og[0]+P)*k,(q.y+og[1]+P)*k]})}
      if(pts){x.save();x.globalCompositeOperation="destination-in";x.fillStyle="#000";x.beginPath();pts.forEach(([a,b],n)=>n?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill();x.restore()}}
    const url=c.toDataURL("image/png"),im=document.createElement("img");im.alt="";im.src=url;
    /* laid in the same spot as the box, behind it: measured against a probe in the same parent, with the box's own turn left off */
    /* review 20: the shadow is laid against the box's own parent. A parent with no position of its own is made relative first (only when no
       positioned box inside it hangs off a box further out), since a shadow measured against a box outside the card landed off the card on paper */
    /* a turned parent with no position is already where its absolute children hang from, but html2canvas does not know that (Chef's photo
       shadows landed by the logo), so it is made relative too */
    {const pa=el.parentElement,pc=getComputedStyle(pa);if(pc.position==="static"&&root.contains(pa)&&(pc.transform!=="none"||el.offsetParent!==pa&&
      ![...pa.querySelectorAll("*")].some(d=>d!==el&&/absolute|fixed/.test(getComputedStyle(d).position)&&d.offsetParent&&!pa.contains(d.offsetParent))))pa.style.position="relative"}
    if(!el.offsetParent||!(el.offsetParent===root||root.contains(el.offsetParent))||getComputedStyle(el.parentElement).position==="static")continue;
    let L0,T0;if(el.offsetParent&&el.offsetParent===el.parentElement&&cs.position!=="fixed"){L0=el.offsetLeft;T0=el.offsetTop}
    else{const probe=document.createElement("i");probe.style.cssText="position:absolute;left:0;top:0;width:0;height:0;margin:0;padding:0;border:0";el.parentElement.insertBefore(probe,el);
      const tr=el.style.transform;el.style.transform="none";const r1=el.getBoundingClientRect(),r0=probe.getBoundingClientRect();el.style.transform=tr;probe.remove();L0=r1.left-r0.left;T0=r1.top-r0.top}
    if(cs.position==="static")el.style.position="relative";
    const to=(cs.transformOrigin||"50% 50%").split(/\s+/).map((v,i)=>pdfLen(v,i?h:w)+P);
    im.style.cssText=`position:absolute;left:${L0-P}px;top:${T0-P}px;width:${w+2*P}px;height:${h+2*P}px;max-width:none;max-height:none;margin:0;pointer-events:none;transform:${cs.transform};transform-origin:${to[0]}px ${to[1]}px;opacity:${cs.opacity};z-index:${cs.zIndex==="auto"?"auto":cs.zIndex}`;
    el.parentElement.insertBefore(im,el);if(!B.via)el.style.boxShadow=B.keep.join(",")||"none"}catch(e){}}}
/* review 20: diagonal stripes (Elf's candy-cane border, A Christmas Story's striped panel) are drawn across the whole box: the stripes turned
   to the gradient's angle, each band in its colour, repeated along the gradient line the way the browser lays them */
function pdfStripesBox(g,w,h){const m=g.match(/^repeating-linear-gradient\((.*)\)$/);if(!m||!(w>0&&h>0)||w*h>4e6)return null;const args=splitLayers(m[1]);
  const a0=args[0].trim();if(!/^-?[\d.]+deg$/.test(a0))return null;const ang=((parseFloat(a0)%360)+360)%360;
  const stops=[];for(const s of args.slice(1)){const mm=s.trim().match(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]{3,8})((?:\s+(?:-?[\d.]+px|0))*)$/i);if(!mm)return null;
    const col=mm[1]==="transparent"?"rgba(0,0,0,0)":mm[1],pos=(mm[2].match(/-?[\d.]+/g)||[]).map(parseFloat);if(!pos.length)return null;pos.forEach(v=>stops.push([v,col]))}
  const P=stops[stops.length-1][0]-stops[0][0];if(!(P>=1&&P<=2000))return null;
  const k=2,c=document.createElement("canvas");c.width=Math.round(w*k);c.height=Math.round(h*k);const x=c.getContext("2d"),th=ang*Math.PI/180,L=Math.abs(w*Math.sin(th))+Math.abs(h*Math.cos(th)),D=Math.hypot(w,h);
  x.scale(k,k);x.translate(w/2,h/2);x.rotate(th);
  for(let n=Math.floor(-stops[0][0]/P)-1;stops[0][0]+n*P<L+P;n++){const o=stops[0][0]+n*P-stops[0][0];
    for(let i=0;i<stops.length-1;i++){const t0=o+stops[i][0],t1=o+stops[i+1][0];if(t1<=t0)continue;const y0=L/2-t1,y1=L/2-t0;
      if(stops[i][1]===stops[i+1][1])x.fillStyle=stops[i][1];else{const gr=x.createLinearGradient(0,y1,0,y0);gr.addColorStop(0,stops[i][1]);gr.addColorStop(1,stops[i+1][1]);x.fillStyle=gr}
      x.fillRect(-D,y0-.3,2*D,y1-y0+.6)}}
  return c.toDataURL("image/png")}
function pdfStripes(g){const m=g.match(/^repeating-linear-gradient\((.*)\)$/);if(!m)return null;const args=splitLayers(m[1]);let ang=180,i=0;
  const a0=args[0].trim();if(/^-?[\d.]+deg$/.test(a0)){ang=((parseFloat(a0)%360)+360)%360;i=1}else if(/^to /.test(a0)){ang={"to top":0,"to right":90,"to bottom":180,"to left":270}[a0];if(ang===undefined)return null;i=1}
  if(![0,90,180,270].includes(ang))return null;
  const stops=[];for(const a of args.slice(i)){/* review 18: a bare 0 is a length too ("rgba(...) 0 2px", tiki's woven mat printed as a dark bar when both stripes were skipped) */const mm=a.trim().match(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]{3,8})((?:\s+(?:-?[\d.]+px|0))*)$/i);if(!mm)return null;
    const col=mm[1]==="transparent"?"rgba(0,0,0,0)":mm[1],pos=(mm[2].match(/-?[\d.]+/g)||[]).map(parseFloat);if(!pos.length)return null;pos.forEach(v=>stops.push([v,col]))}
  const P=stops[stops.length-1][0]-stops[0][0];if(!(P>=1&&P<=2000))return null;
  const c=document.createElement("canvas"),k=4,len=Math.round(P*k);const horiz=ang===90||ang===270;c.width=horiz?len:1;c.height=horiz?1:len;
  const x=c.getContext("2d"),gr=horiz?x.createLinearGradient(0,0,len,0):x.createLinearGradient(0,0,0,len);
  const flip=ang===0||ang===270;/* reversed, the stops go in from the far end so a hard edge stays hard */for(const [v,col] of flip?[...stops].reverse():stops){const o=(v-stops[0][0])/P;gr.addColorStop(Math.min(1,Math.max(0,flip?1-o:o)),col)}
  x.fillStyle=gr;x.fillRect(0,0,c.width,c.height);
  return {url:c.toDataURL("image/png"),size:horiz?`${P}px 100%`:`100% ${P}px`,pos:ang===0?"0 100%":ang===270?"100% 0":"0 0"}}
function noiseTile(){
  if(_noise)return _noise;
  const c=document.createElement("canvas");c.width=c.height=180;const x=c.getContext("2d"),d=x.createImageData(180,180);
  for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=Math.random()*26|0}
  x.putImageData(d,0,0);return _noise=c.toDataURL("image/png");
}
async function renderCanvas(src,forPrint){
  const stage=document.createElement("div"),land=src.classList.contains("fmt");
  stage.style.cssText=`position:fixed;left:-20000px;top:0;width:${+src.dataset.w||(land?1123:794)}px;height:${+src.dataset.h||(land?794:1123)}px;`;
  const clone=src.cloneNode(true);clone.style.transform="none";clone.hidden=false;if(forPrint&&land)clone.classList.add("for-print");
  /* review 19: a hand-built card with rounded outer corners (Coming to America, Pulp Fiction, Chef) printed its frame in the edge colour with white
     corners, because the print copy swaps the dark surround for a white border. Those cards keep the surround the screen shows */
  if(forPrint&&land&&!src.classList.contains("fx-paper")){const wall=[...src.children].find(c=>!c.classList.contains("fx-back")&&getComputedStyle(c).display!=="none");
    if(wall&&parseFloat(getComputedStyle(wall).borderTopLeftRadius)>=8){clone.style.background=getComputedStyle(src).backgroundColor;clone.dataset.surround="1"}}
  /* the copy keeps the colours the screen already settled on (logo panels and the like): their load-time checks must not run again on it */
  clone.querySelectorAll("[onload],[onerror]").forEach(e=>{e.removeAttribute("onload");e.removeAttribute("onerror")});
  /* the PDF renderer floods a box with the colour of an inset ring shadow ("inset 0 0 0 3px cream" turns a dark logo panel cream):
     on the copy, each flat inset ring becomes a real bordered frame laid over the box, and the inset shadow is dropped */
  try{clone.querySelectorAll("[style*=inset]").forEach(e=>{const bs=e.style.boxShadow;if(!bs||!/inset/.test(bs))return;
    const parts=bs.split(/,(?![^(]*\))/).map(x=>x.trim()),keep=[];let off=0;const frames=[];
    for(const sh of parts){if(!/\binset\b/.test(sh)){keep.push(sh);continue}
      /* either order: "inset 0 0 0 3px #fff" or the browser's "rgb(...) 0px 0px 0px 3px inset"; only flat rings (no offset, no blur) become frames */
      const col=(sh.match(/(rgba?\([^)]*\)|#[0-9a-f]{3,8}\b|\b[a-z]+\b(?<!inset|px))/i)||[])[0],nums=(sh.replace(/rgba?\([^)]*\)/g,"").match(/-?\d+(\.\d+)?(px)?/g)||[]).map(parseFloat);
      if(col&&nums.length>=4&&nums[0]===0&&nums[1]===0&&nums[2]===0&&nums[3]>0)frames.push([nums[3],col])}
    if(!frames.length)return;e.style.boxShadow=keep.join(",")||"none";
    /* review 18: the copy is not in the page yet, so its computed position reads empty: a box with no position of its own is made relative
       (Despicable Me 2's logo plate ring framed the whole column, a faint box on paper) */
    {const ps=e.style.position||getComputedStyle(e).position;if(!ps||ps==="static")e.style.position="relative"}
    /* rings stack inward: each later ring sits inside the earlier ones */
    frames.sort((a,b)=>a[0]-b[0]);let prev=0;for(const [w,col] of frames){const d=document.createElement("i");d.style.cssText=`position:absolute;left:${prev}px;top:${prev}px;right:${prev}px;bottom:${prev}px;border:${w-prev}px solid ${col};border-radius:inherit;pointer-events:none;box-sizing:border-box`;e.appendChild(d);prev=w}})}catch(err){}
  stage.appendChild(clone);document.body.appendChild(stage);
  /* review 15: html2canvas ignores line clamps, so a note the screen cut to "..." printed in full over the next line (tavern, Brave).
     In the copy each clamped text that is cut is set to the words the screen shows, with the ellipsis, so paper matches the screen */
  try{clone.querySelectorAll("*").forEach(e=>{if(e.children.length)return;const cs=getComputedStyle(e);if(cs.display==="none"||!(cs.webkitLineClamp&&cs.webkitLineClamp!=="none"))return;
    /* cut means the unclamped text is at least half a line taller than the clamped box, not a pixel of descender over it (cafe names printed "..." for nothing) */
    const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.2,h0=e.getBoundingClientRect().height,was=e.style.webkitLineClamp;e.style.webkitLineClamp="unset";const full=e.getBoundingClientRect().height;e.style.webkitLineClamp=was;
    if(full<=h0+lh*.5)return;const cut=()=>e.scrollHeight>e.clientHeight+lh*.5;const w=e.textContent.trim().split(/\s+/);let lo=1,hi=w.length-1,best=1;
    while(lo<=hi){const mid=(lo+hi)>>1;e.textContent=w.slice(0,mid).join(" ").replace(/[,;:]$/,"")+"\u2026";if(cut())hi=mid-1;else{best=mid;lo=mid+1}}
    e.textContent=w.slice(0,best).join(" ").replace(/[,;:]$/,"")+"\u2026"})}catch(err){}
  /* review 21: a frame laid beside a box (outline or flat ring) takes the box's turn too, pivoting on the same point. Canteen's meal voucher
     printed its 6px paper outline square round a turned card, so the paper looked unturned with a second square edge */
  const pdfTurnLike=(e,cs,g)=>{if(!cs.transform||cs.transform==="none")return "";const W=e.offsetWidth,H=e.offsetHeight,to=(cs.transformOrigin||"50% 50%").split(/\s+/);
    return `transform:${cs.transform};transform-origin:${pdfLen(to[0],W)+g}px ${pdfLen(to[1]||"50%",H)+g}px;`};
  /* review 12: it also drops flat rings drawn outside a box ("0 0 0 8px bezel" round an airline window), so a framed photo printed bare.
     Each outer ring becomes a bordered frame laid behind the box, sized from where the box actually sits */
  try{clone.querySelectorAll("[style*=box-shadow]").forEach(e=>{const bs=e.style.boxShadow;if(!bs||!e.parentElement)return;
    const parts=bs.split(/,(?![^(]*\))/).map(x=>x.trim()),keep=[],rings=[];
    for(const sh of parts){if(/\binset\b/.test(sh)){keep.push(sh);continue}
      const col=(sh.match(/(rgba?\([^)]*\)|#[0-9a-f]{3,8}\b)/i)||[])[0],nums=(sh.replace(/rgba?\([^)]*\)/g,"").match(/-?\d+(\.\d+)?(px)?/g)||[]).map(parseFloat);
      if(col&&nums.length>=4&&nums[0]===0&&nums[1]===0&&nums[2]===0&&nums[3]>0)rings.push([nums[3],col]);else keep.push(sh)}
    if(!rings.length)return;const cs=getComputedStyle(e);
    /* review 17: a box in the flow (Kung Fu Panda's poster on its scroll) takes one ring as a border, with a negative margin so nothing moves */
    if((cs.position!=="absolute"||e.offsetParent!==e.parentElement)&&rings.length===1&&!parseFloat(cs.borderTopWidth)&&!parseFloat(cs.borderLeftWidth)&&cs.display!=="inline"&&cs.flexGrow==="0"&&e.offsetWidth){
      const [w,col]=rings[0],W=e.offsetWidth,H=e.offsetHeight;e.style.boxShadow=keep.join(",")||"none";
      e.style.boxSizing="border-box";e.style.width=`${W+2*w}px`;e.style.height=`${H+2*w}px`;e.style.border=`${w}px solid ${col}`;
      for(const sd of ["Top","Right","Bottom","Left"])e.style["margin"+sd]=`${(parseFloat(cs["margin"+sd])||0)-w}px`;return}
    if(cs.position!=="absolute"||e.offsetParent!==e.parentElement)return;
    const L=e.offsetLeft,T=e.offsetTop,W=e.offsetWidth,H=e.offsetHeight,rad=parseFloat(cs.borderTopLeftRadius)||0,pct=/%/.test(cs.borderTopLeftRadius);
    e.style.boxShadow=keep.join(",")||"none";
    /* drawn widest first so each narrower ring sits on top, as the browser stacks them */
    rings.sort((a,b)=>b[0]-a[0]);let z=cs.zIndex==="auto"?"auto":cs.zIndex;
    for(const [w,col] of rings){const d=document.createElement("i");
      d.style.cssText=`position:absolute;left:${L-w}px;top:${T-w}px;width:${W+2*w}px;height:${H+2*w}px;border:${w}px solid ${col};box-sizing:border-box;pointer-events:none;${pdfTurnLike(e,cs,w)}border-radius:${pct?/%/.test(cs.borderRadius)?["TopLeft","TopRight","BottomRight","BottomLeft"].map(s=>cs["border"+s+"Radius"].split(/\s+/)[0]).join(" ")+" / "+["TopLeft","TopRight","BottomRight","BottomLeft"].map(s=>{const q=cs["border"+s+"Radius"].split(/\s+/);return q[1]||q[0]}).join(" "):cs.borderTopLeftRadius:(rad?rad+w+"px":"0")};z-index:${z}`;
      e.parentElement.insertBefore(d,e)}})}catch(err){}
  /* and it skips outlines (a hairline keyline round a photo): the same treatment, a frame laid round the box */
  try{clone.querySelectorAll("[style*=outline]").forEach(e=>{const cs=getComputedStyle(e),w=parseFloat(cs.outlineWidth)||0;if(cs.outlineStyle==="none"||!w||!e.parentElement)return;
    /* review 18: a box in the flow (Role Models' campfire badges, a dashed stitch drawn 6px inside) gets the frame as its own last child instead */
    if(cs.position!=="absolute"||e.offsetParent!==e.parentElement){const o=(parseFloat(cs.outlineOffset)||0)+w,bl=parseFloat(cs.borderLeftWidth)||0,bt=parseFloat(cs.borderTopWidth)||0,rad=Math.max(0,(parseFloat(cs.borderTopLeftRadius)||0)+o),d=document.createElement("i");
      if(cs.position==="static")e.style.position="relative";
      d.style.cssText=`position:absolute;left:${-bl-o}px;top:${-bt-o}px;width:${e.offsetWidth+2*o}px;height:${e.offsetHeight+2*o}px;box-sizing:border-box;border:${w}px ${cs.outlineStyle} ${cs.outlineColor};border-radius:${rad}px;pointer-events:none`;
      e.style.outline="none";e.appendChild(d);return}
    const o=(parseFloat(cs.outlineOffset)||0)+w,d=document.createElement("i");
    d.style.cssText=`position:absolute;left:${e.offsetLeft-o}px;top:${e.offsetTop-o}px;width:${e.offsetWidth+2*o}px;height:${e.offsetHeight+2*o}px;box-sizing:border-box;border:${w}px ${cs.outlineStyle} ${cs.outlineColor};pointer-events:none;z-index:${cs.zIndex==="auto"?"auto":cs.zIndex};${pdfTurnLike(e,cs,o)}`;
    e.style.outline="none";e.parentElement.insertBefore(d,e.nextSibling)})}catch(err){}
  try{
    await document.fonts.ready;
    if(clone.classList.contains("pp-sheet")){prepClean(clone);fitPrep(clone)}
    /* review 14: shapes html2canvas draws wrong, fixed before the photos are touched.
       A filled inline-block holding lines of text paints its fill over the words (The Warriors' station labels printed as black boxes):
       it prints as a shrink-to-fit block, kept left, centre or right where its line put it.
       Chrome lettering (a gradient clipped to the text) prints as a bare bar (Cruella): it becomes solid text in the gradient's middle colour.
       A masked photo is marked here and baked once the photos are ready (pdfMaskApply) */
    try{const solid=c=>{const m=c&&c.match(/rgba?\(([^)]*)\)/);if(!m)return null;const p=m[1].split(/[\s,/]+/).filter(Boolean).map(Number);return p.length<4||p[3]>.05?p.slice(0,3):null};
      [...clone.querySelectorAll("*")].forEach(el=>{const cs=getComputedStyle(el);
        /* review 17: a filled inline-flex box prints empty the same way (Ghost Dog's section pills); it prints as a shrink-to-fit flex box */
        if(/^inline-(block|flex)$/.test(cs.display)&&el.textContent.trim()&&(solid(cs.backgroundColor)||cs.backgroundImage!=="none")&&[...el.children].some(c=>/^(block|flex|grid|table)$/.test(getComputedStyle(c).display))){
          const ta=el.parentElement?getComputedStyle(el.parentElement).textAlign:"left";if(cs.display==="inline-flex"){el.style.display="flex";el.style.width="max-content"}else el.style.display="table";
          if(/right|end/.test(ta))el.style.marginLeft="auto";else if(ta==="center"){el.style.marginLeft="auto";el.style.marginRight="auto"}}
        if((cs.webkitBackgroundClip==="text"||cs.backgroundClip==="text")&&el.textContent.trim()){const cols=cs.backgroundImage.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/gi)||[],mid=cols[Math.floor(cols.length/2)]||cs.color;
          el.style.backgroundImage="none";el.style.backgroundColor="transparent";el.style.webkitBackgroundClip="border-box";el.style.backgroundClip="border-box";el.style.color=mid;el.style.webkitTextFillColor=mid}
        /* review 17: html2canvas draws every strike-through one pixel thin (Anchorman's thick red line through "Ice cold milk"): a thick one becomes a drawn bar */
        {const th=parseFloat(cs.textDecorationThickness);if(/line-through/.test(cs.textDecorationLine)&&th>1.5&&el.textContent.trim()&&(!cs.backgroundImage||cs.backgroundImage==="none")){const col=cs.textDecorationColor||cs.color;
          el.style.textDecoration="none";el.style.backgroundImage=`linear-gradient(${col},${col})`;el.style.backgroundSize=`100% ${th}px`;el.style.backgroundPosition="0 56%";el.style.backgroundRepeat="no-repeat"}}
        const mk=cs.webkitMaskImage||cs.maskImage;
        if(mk&&/^linear-gradient\(/.test(mk)&&el.querySelector("img"))el.dataset.pmask=mk;
        /* review 19: a masked box holding words (hotel door hanger, airline ticket) is baked below, words kept over it */
        else if(mk&&mk!=="none"&&!/url\(/.test(mk)&&el.textContent.trim())el.dataset.pmaskt="1";
        /* a grain mask on lettering (cafe's chalk heads) cannot be drawn: the words print plain rather than as whatever html2canvas makes of it */
        else if(mk&&/url\(/.test(mk)&&el.textContent.trim()&&!el.querySelector("img")){el.style.webkitMaskImage="none";el.style.maskImage="none"}})}catch(err){}
    /* Safari can mark a cached poster as off-limits to the canvas, which kills the export.
       Pull each outside image fresh as a local copy first so the canvas can always read it. */
    const temp=[];
    await Promise.all(Array.from(clone.querySelectorAll("img")).map(async img=>{
      const src=img.currentSrc||img.src;
      if(/^https?:/.test(src)&&!src.startsWith(location.origin)){
        try{const r=await fetch(src,{mode:"cors",cache:"no-store"});if(r.ok){const u=URL.createObjectURL(await r.blob());temp.push(u);img.removeAttribute("crossorigin");img.src=u}}catch(e){}
      }
      await img.decode().catch(()=>{});
    }));
    setTimeout(()=>temp.forEach(u=>URL.revokeObjectURL(u)),30000);
    /* review 14: a photo faded out with a mask (club) is drawn into a picture of its box here, while the photos are still plain images:
       each photo with its fit, position, filter, blend and opacity, each soft gradient layer, then the mask's fade (pdfMaskApply) */
    for(const el of [...clone.querySelectorAll("[data-pmask]")]){try{const u=await pdfMaskDraw(el);if(!u)continue;
      const w=el.clientWidth,h=el.clientHeight;el.style.webkitMaskImage="none";el.style.maskImage="none";el.style.backgroundImage="none";
      /* review 18: words sitting on the masked photo (club's "On stage tonight" tag) are not part of the picture: they stay, laid over it */
      const keep=[...el.children].filter(c=>c.tagName!=="IMG"&&c.textContent.trim()&&!c.querySelector("img"));el.innerHTML="";
      if(getComputedStyle(el).position==="static")el.style.position="relative";
      const im=new Image();im.alt="";im.src=u;im.style.cssText=`display:block;width:${w}px;height:${h}px;position:absolute;left:0;top:0`;el.appendChild(im);keep.forEach(c=>{el.appendChild(c);if(getComputedStyle(c).position==="static")c.style.position="relative"});
      if(!el.style.height)el.style.height=h+"px";await im.decode().catch(()=>{})}catch(e){}}
    for(const el of [...clone.querySelectorAll("[data-pmaskt]")]){try{await pdfMaskBox(el)}catch(e){}el.removeAttribute("data-pmaskt")}
    /* review 24: a picture taller than the turned box that crops it (the campfire signature, the logo's top line only) printed a thin line along
       the box's cut edge, since html2canvas draws a turned clip with a hairline. The picture is cropped to the box instead, top kept, and the box no longer clips */
    clone.querySelectorAll("img").forEach(im=>{try{const p=im.parentElement,cs=getComputedStyle(im),pc=p&&getComputedStyle(p);if(!p||p.children.length!==1||cs.objectFit!=="fill"||pc.overflow!=="hidden"||pc.transform==="none")return;
      const ph=p.clientHeight,pw=p.clientWidth;if(!ph||!(im.offsetHeight>ph+1)||Math.abs(im.offsetWidth-pw)>1||im.offsetTop>0.5||im.offsetLeft>0.5)return;
      im.style.height=ph+"px";im.style.objectFit="cover";im.style.objectPosition="50% 0%";p.style.overflow="visible"}catch(e){}});
    /* filtered photos (blur, brightness, sepia) print as the screen shows them: baked into a plain picture first */
    clone.querySelectorAll("img").forEach(im=>{try{const cs=getComputedStyle(im);if(!cs.filter||cs.filter==="none")return;const u=pdfFiltered(im,cs);if(!u)return;
      const n=document.createElement("img");n.alt="";n.className=im.className;n.style.cssText=im.style.cssText;n.style.filter="none";n.style.objectFit="fill";n.style.width=cs.width;n.style.height=cs.height;n.src=u;im.replaceWith(n)}catch(e){}});
    await Promise.all(Array.from(clone.querySelectorAll("img")).map(i=>i.decode().catch(()=>{})));
    /* html2canvas ignores object-fit, so a cropped photo (a round frame, a tent back, a wide still in a tall box) would print squashed or stretched.
       In the export copy each cropped photo becomes a box with the same size and look, showing the photo as a cover or contain background */
    clone.querySelectorAll("img").forEach(im=>{try{const cs=getComputedStyle(im),fit=cs.objectFit;if((fit!=="cover"&&fit!=="contain")||!im.naturalWidth)return;
      const w=parseFloat(cs.width),h=parseFloat(cs.height);if(!w||!h||Math.abs(Math.log((w/h)/(im.naturalWidth/im.naturalHeight)))<.01)return;
      const d=document.createElement("div");d.className=im.className;
      for(const k of ["position","top","right","bottom","left","width","height","margin","border","borderRadius","boxShadow","transform","transformOrigin","opacity","filter","zIndex","boxSizing","padding","outline","outlineOffset","verticalAlign","flex","alignSelf","gridArea"])d.style[k]=cs[k];
      d.style.display=cs.display==="inline"?"inline-block":cs.display;d.style.backgroundColor=cs.backgroundColor;
      d.style.backgroundImage=`url("${im.currentSrc||im.src}")`;d.style.backgroundSize=fit;d.style.backgroundPosition=cs.objectPosition;d.style.backgroundRepeat="no-repeat";d.style.backgroundOrigin="content-box";d.style.backgroundClip="content-box";
      im.replaceWith(d)}catch(e){}});
    /* iPhone Safari won't let a canvas be saved once an SVG texture has been drawn on it (SecurityError).
       Swap every SVG texture for a plain noise tile and hide inline SVG art, in the export copy only. */
    const nz=noiseTile(),svgRx=/url\("data:image\/svg\+xml(?:[^"\\]|\\.)*"\)/g;
    /* review 12: where the browser allows it, each SVG texture (sea caustics, paper fibre) is drawn to a plain picture first, so the print keeps it;
       Safari refuses to hand that picture back, and then the plain noise tile stands in as before */
    const svgPng=new Map();
    {const urls=new Set();[clone,...clone.querySelectorAll("*")].forEach(el=>{const bg=getComputedStyle(el).backgroundImage;if(bg&&bg.includes("data:image/svg"))(bg.match(svgRx)||[]).forEach(u=>urls.add(u))});
      await Promise.all([...urls].slice(0,40).map(async u=>{try{const src=u.slice(5,-2).replace(/\\(.)/g,"$1"),im=new Image();im.src=src;await im.decode();
        const w=im.naturalWidth||300,h=im.naturalHeight||300;if(w*h>4e6)return;const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(im,0,0,w,h);
        svgPng.set(u,`url("${c.toDataURL("image/png")}")`)}catch(e){}}))}
    [clone,...clone.querySelectorAll("*")].forEach(el=>{
      const cs=getComputedStyle(el),bg=cs.backgroundImage;
      /* html2canvas cannot blend background layers: a grain set to multiply would paint flat over the paper, so only those layers are left out.
         Review 13: the other layers stay (tavern's burnt edge, lab's grime), and the edge vignette among them is baked below */
      if(cs.backgroundBlendMode&&/multiply|overlay|screen|darken|soft-light/.test(cs.backgroundBlendMode)&&bg&&bg!=="none"){
        const lay=splitLayers(bg),md=cs.backgroundBlendMode.split(/,\s*/),L=a=>a.split(/,(?![^(]*\))/).map(x=>x.trim()),sz=L(cs.backgroundSize),ps=L(cs.backgroundPosition),rp=L(cs.backgroundRepeat),at=i=>(a=>a[i]||a[a.length-1]);
        const keep=lay.map((g,i)=>i).filter(i=>{const m=md[i]||md[md.length-1];return m==="normal"});
        el.style.backgroundBlendMode="normal";
        if(!keep.length){el.style.backgroundImage="none";return}
        el.style.backgroundImage=keep.map(i=>lay[i]).join(",");el.style.backgroundSize=keep.map(i=>at(i)(sz)).join(",");el.style.backgroundPosition=keep.map(i=>at(i)(ps)).join(",");el.style.backgroundRepeat=keep.map(i=>at(i)(rp)).join(",")}
      {const b0=cs.backgroundImage;if(b0&&b0.includes("data:image/svg"))el.style.backgroundImage=b0.replace(svgRx,u=>svgPng.get(u)||`url("${nz}")`)}
      if(el.tagName==="IMG"&&/^data:image\/svg/.test(el.getAttribute("src")||""))el.style.visibility="hidden";
      if(el.tagName&&el.tagName.toLowerCase()==="svg")el.style.visibility="hidden";
      /* html2canvas cannot do CSS masks: a masked gilt frame would print as a solid gold slab over the whole page, so draw it as a plain border instead */
      {const mk=cs.webkitMaskImage||cs.maskImage;if(mk&&mk!=="none"&&!el.textContent.trim()&&!el.querySelector("img")){const pad=parseFloat(cs.paddingTop)||0,col=((cs.backgroundImage||"").match(/rgba?\([^)]*\)|#[0-9a-f]{3,6}/gi)||[])[1]||cs.backgroundColor;
        el.style.webkitMask="none";el.style.mask="none";if(pad>0){el.style.background="none";el.style.border=`${pad}px solid ${col}`;el.style.padding="0";el.style.boxSizing="border-box"}
        /* a plain card shape (a ticket stub with punched notches) prints as the solid card: only an empty overlay with no fill of its own is left out */
        else if(!(cs.backgroundImage&&cs.backgroundImage!=="none")&&!/rgba\([^)]*,\s*0\)|transparent/.test(cs.backgroundColor)){el.style.boxShadow="none";
          /* gradient masks become the same gradients painted in the card's colour, so the notches still show */
          if(/^(radial|linear)-gradient/.test(mk)&&!/url\(/.test(mk)){const c=cs.backgroundColor;el.style.backgroundImage=mk.replace(/rgb\(0, 0, 0\)/g,c);el.style.backgroundColor="transparent";
            el.style.backgroundSize=cs.webkitMaskSize||cs.maskSize;el.style.backgroundPosition=cs.webkitMaskPosition||cs.maskPosition;el.style.backgroundRepeat=cs.webkitMaskRepeat||cs.maskRepeat}}
        else el.style.visibility="hidden"}}
      /* html2canvas paints an elliptical vignette as a flat brown wash over the whole page (canteen on dark films), so the export leaves it out */
      if(el.hasAttribute&&el.hasAttribute("data-vig")){/* review 13: now that a vignette can be drawn as a picture, a tagged one prints too (canteen came out 9 levels lighter without it) */
        const lay=splitLayers(cs.backgroundImage||""),v=lay.length===1&&el.offsetWidth>0&&el.offsetHeight>0?pdfVignette(lay[0],el.offsetWidth,el.offsetHeight):null;
        if(v){el.style.backgroundImage=`url("${v}")`;el.style.backgroundSize=`${el.offsetWidth}px ${el.offsetHeight}px`;el.style.backgroundPosition="0 0";el.style.backgroundRepeat="no-repeat";return}
        el.style.visibility="hidden";return}
      /* review 12: the same goes for any empty overlay that darkens the edges, on every layout, tagged or not.
         A big blurred inset shadow (airline, bistro, hotel, saloon paper) or a radial vignette that is clear in the middle (banquet)
         prints as a flat tan or grey film over the whole page, so the copy drops the shadow and hides the vignette */
      /* review 18: the inset shadow is baked on a box of any size (tiki's 75px woven mat printed dark under a smeared shadow); vignettes stay big boxes only */
      {const w=el.offsetWidth,h=el.offsetHeight;if(w>0&&h>0&&w*h<6e6){
        /* a soft inset shadow becomes a picture of itself, drawn by the browser's own canvas */
        const bs=cs.boxShadow;if(bs&&bs!=="none"&&/inset/.test(bs)){/* an inset shadow paints over the background and under the content, so the picture goes in as the top background layer, text or not */
          const parts=bs.split(/,(?![^(]*\))/).map(x=>x.trim()),keep=[],soft=[];
          for(const sh of parts){if(!/inset/.test(sh)){keep.push(sh);continue}const col=(sh.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/i)||[])[0],n=(sh.replace(/rgba?\([^)]*\)/g,"").match(/-?\d+(\.\d+)?px/g)||[]).map(parseFloat);
            /* review 17: a hard inset edge with an offset ("inset 0 2px 0" on canteen trays) floods the padding as a pale band with square corners, so it is drawn too */
            if(col&&n.length>=3&&(n[2]>=2||n[0]||n[1]))soft.push({x:n[0],y:n[1],b:n[2],s:n[3]||0,col});else keep.push(sh)}
          if(soft.length){const url=pdfSoftInset(w,h,soft);el.style.boxShadow=keep.join(",")||"none";
            const bi=cs.backgroundImage&&cs.backgroundImage!=="none"?cs.backgroundImage:"";el.style.backgroundImage=`url("${url}")`+(bi?","+bi:"");
            if(bi){el.style.backgroundSize=`${w}px ${h}px,`+cs.backgroundSize;el.style.backgroundPosition="0 0,"+cs.backgroundPosition;el.style.backgroundRepeat="no-repeat,"+cs.backgroundRepeat}
            else{el.style.backgroundSize=`${w}px ${h}px`;el.style.backgroundPosition="0 0";el.style.backgroundRepeat="no-repeat"}}}
        /* an edge vignette (a radial gradient clear in the middle), on its own layer or under the paper's other textures */
        const bg2=cs.backgroundImage;/* computed style is live, so it already shows a baked shadow layer */
        if(w>120&&h>120&&bg2&&/radial-gradient|repeating-linear-gradient|conic-gradient/.test(bg2)){const sizes=cs.backgroundSize.split(/,\s*/),pos=cs.backgroundPosition.split(/,\s*/),rep=cs.backgroundRepeat.split(/,\s*/);
          const lay=splitLayers(bg2);let hit=false;
          const out=lay.map((g,i)=>{const sz=(sizes[i]||sizes[sizes.length-1]||"auto").trim();
            if(/^(repeating-)?conic-gradient/.test(g)){const px=sz.match(/^([\d.]+)px(?:\s+([\d.]+)px)?$/),tw=px?+px[1]:w,th=px?+(px[2]||px[1]):h;if(!px&&!/^(auto( auto)?|100% 100%)$/.test(sz))return g;const u=pdfConic(g,Math.round(tw),Math.round(th));if(!u)return g;hit=true;sizes[i]=`${tw}px ${th}px`;return `url("${u}")`}
            if(/^repeating-linear-gradient/.test(g)){if(!/^(auto( auto)?|100% 100%)$/.test(sz))return g;const st=pdfStripes(g);if(!st){const u=pdfStripesBox(g,w,h);if(!u)return g;hit=true;sizes[i]=`${w}px ${h}px`;pos[i]="0px 0px";rep[i]="no-repeat";return `url("${u}")`}hit=true;sizes[i]=st.size;pos[i]=st.pos;rep[i]="repeat";return `url("${st.url}")`}
            {const px=sz.match(/^([\d.]+)px\s+([\d.]+)px$/);if(px&&/^radial-gradient/.test(g)){const u=pdfDots(g,+px[1],+px[2]);if(u){hit=true;return `url("${u}")`}}}if(!/^(auto( auto)?|100% 100%|cover)$/.test(sz)&&sz!==`${w}px ${h}px`)return g;const v=pdfVignette(g,w,h);if(!v)return g;hit=true;sizes[i]=`${w}px ${h}px`;pos[i]="0px 0px";rep[i]="no-repeat";return `url("${v}")`});
          if(hit){el.style.backgroundImage=out.join(",");el.style.backgroundSize=lay.map((_,i)=>sizes[i]||sizes[sizes.length-1]||"auto").join(",");el.style.backgroundPosition=lay.map((_,i)=>pos[i]||pos[pos.length-1]||"0% 0%").join(",");el.style.backgroundRepeat=lay.map((_,i)=>rep[i]||rep[rep.length-1]||"repeat").join(",")}}}}
      /* review 18: stripes on a box 120px or less across print too (tiki's woven mat under the poster is 75px deep and printed as a flat dark bar):
         only the straight repeating stripes are drawn here, a small box's vignette is left as it was */
      {const w=el.offsetWidth,h=el.offsetHeight,bg3=cs.backgroundImage;if(w>0&&h>0&&(w<=120||h<=120)&&bg3&&/repeating-linear-gradient|radial-gradient/.test(bg3)){
        const sizes=cs.backgroundSize.split(/,\s*/),pos=cs.backgroundPosition.split(/,\s*/),rep=cs.backgroundRepeat.split(/,\s*/),lay=splitLayers(bg3);let hit=false;
        const out=lay.map((g,i)=>{const sz0=(sizes[i]||sizes[sizes.length-1]||"auto").trim(),px=sz0.match(/^([\d.]+)px\s+([\d.]+)px$/);
          /* a small dot tile on a small box (stadium scoreboard cells, a tiki badge's halftone) */
          if(px&&/^radial-gradient/.test(g)){const u=pdfDots(g,+px[1],+px[2]);if(u){hit=true;return `url("${u}")`}return g}
          if(!/^repeating-linear-gradient/.test(g))return g;const sz=sz0;if(!/^(auto( auto)?|100% 100%)$/.test(sz))return g;
          const st=pdfStripes(g);if(!st){const u=pdfStripesBox(g,w,h);if(!u)return g;hit=true;sizes[i]=`${w}px ${h}px`;pos[i]="0px 0px";rep[i]="no-repeat";return `url("${u}")`}hit=true;sizes[i]=st.size;pos[i]=st.pos;rep[i]="repeat";return `url("${st.url}")`});
        if(hit){el.style.backgroundImage=out.join(",");el.style.backgroundSize=lay.map((_,i)=>sizes[i]||sizes[sizes.length-1]||"auto").join(",");el.style.backgroundPosition=lay.map((_,i)=>pos[i]||pos[pos.length-1]||"0% 0%").join(",");el.style.backgroundRepeat=lay.map((_,i)=>rep[i]||rep[rep.length-1]||"repeat").join(",")}}}
      /* it also smears a blurred inset shadow across the whole box, so a moulded tray well prints with a plain edge instead */
      if(el.hasAttribute&&el.hasAttribute("data-well")){el.style.boxShadow="none";el.style.border="1px solid rgba(0,0,0,.14)"}
      /* html2canvas cannot blend layers, so a grain set to overlay or multiply would paint flat over the paper and wash it out: leave those texture layers out of the export */
      if(cs.mixBlendMode&&cs.mixBlendMode!=="normal"&&!el.textContent.trim()&&!el.querySelector("img")){el.dataset.pblend=cs.mixBlendMode;el.style.mixBlendMode="normal"}
    });
    /* review 17: a grain blended onto a plain paper (The Heat's black takeaway panels, overlay at .18) printed as charcoal, because the layer
       painted flat. When the paper under it is one solid colour, the blend is worked out on a canvas and printed as a picture */
    await pdfBlendBake(clone);
    /* review 19: outer shadows and drop-shadow filters, which html2canvas loses at print scale */
    await pdfLiftBake(clone);
    /* only copy the export stage into html2canvas's working page: the video store alone holds hundreds of posters, and waiting on them made a PDF take a minute */
    const keep=el=>el===document.head||document.head.contains(el)||el.tagName==="STYLE"||el.tagName==="LINK"||el.contains(stage)||stage.contains(el);
    return await html2canvas(clone,{scale:2.5,backgroundColor:STY[current.theme].mg,logging:false,useCORS:true,ignoreElements:el=>!keep(el)});
  }finally{stage.remove()}
}
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

let downloads=null,EDGEFIX=null;
const inClaude=!!(window.claude&&window.claude.use);
if(inClaude){window.claude.use("downloads").then(d=>{downloads=d}).catch(()=>{})}
else{$("print").hidden=false}
function plainDownload(data,filename){
  const url=URL.createObjectURL(data),a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function shareable(data,filename){
  if(globalThis.REEL_NATIVE)return true;
  try{return matchMedia("(pointer:coarse)").matches&&!!navigator.canShare&&navigator.canShare({files:[new File([data],filename,{type:"image/jpeg"})]})}catch(e){return false}
}
function showOverlay(url,file){
  const modalTrigger=document.activeElement;
  const o=document.createElement("dialog");o.className="overlay";o.setAttribute("aria-label","Save your menu");
  const close=()=>dismissModal(o);
  o.innerHTML=file
    ?`<img alt="Menu for ${ESC(current.title)}"><p>Your menu is ready.</p><button class="btn primary" type="button" data-share>Save to Photos</button><button class="btn" type="button" data-close>Close</button>`
    :`<img alt="Menu for ${ESC(current.title)}"><p>Press and hold the menu, then choose Save to Photos.</p><button class="btn primary" type="button" data-close>Close</button>`;
  o.querySelector("img").src=url;
  o.querySelector("[data-close]").addEventListener("click",close);
  o.addEventListener("click",e=>{if(e.target===o)close()});
  if(file)o.querySelector("[data-share]").addEventListener("click",async()=>{
    try{const nat=typeof REEL!=="undefined"&&await REEL.share({title:`${current.title} menu`,files:[{blob:file,name:file.name}]});if(nat==="cancel")return;if(!nat)await navigator.share({files:[file],title:`${current.title} menu`});close();$("status").textContent=nat?"Menu image shared.":"Saved. Check your Photos."}
    catch(e){if(!(e&&e.name==="AbortError"))o.querySelector("p").textContent="Long-press the menu and choose Save to Photos."}
  });
  mountModal(o,"button",modalTrigger);
}
/* the most common colour around the outside of a rendered page: its paper, used to fill the rest of the A4 sheet */
/* review 14: the strip is the outermost few pixels only. At 5 per cent deep it reached into the artwork (The Lost World's red masthead, The Phantom Menace's black poster) */
function edgeColour(cv,which){const x=cv.getContext("2d"),W=cv.width,H=cv.height,b=Math.max(3,Math.round(Math.min(W,H)*.006)),cnt=new Map();
  const take=(sx,sy,w,h)=>{const d=x.getImageData(sx,sy,w,h).data;for(let i=0;i<d.length;i+=28){const k=(d[i]>>3)<<10|(d[i+1]>>3)<<5|(d[i+2]>>3);const c=cnt.get(k);if(c)c.n++;else cnt.set(k,{n:1,r:d[i],g:d[i+1],b:d[i+2]})}};
  /* review 15: a thin rule round the page (the diner's red top line, Walk Hard's mauve edge, This Is the End's terracotta strip) is a border,
     not the paper, and flooding the frame with it made a heavy coloured band. The reading starts just inside the outermost 2 per cent */
  const o=Math.round(Math.min(W,H)*.02);
  /* review 16: Walk Hard's long sides are a run of mauve and black stripes some 3 per cent deep, so the reading at 2 per cent landed on a stripe and the
     sheet printed on mauve. A side whose first 6 per cent changes colour four times or more is a striped border: the other pair of sides decides */
  const line=(lr,at)=>{const n=Math.round((lr?W:H)*.06),d=lr?x.getImageData(0,Math.round(H*at),n,1).data:x.getImageData(Math.round(W*at),0,1,n).data;let ch=0,pr=null;
    for(let i=0;i<d.length;i+=4){const c=[d[i],d[i+1],d[i+2]];if(pr&&Math.abs(c[0]-pr[0])+Math.abs(c[1]-pr[1])+Math.abs(c[2]-pr[2])>90){ch++;pr=c}else if(!pr)pr=c}return ch>=4};
  const striped=lr=>line(lr,.3)&&line(lr,.7);
  const sLR=striped(true),sTB=striped(false);
  if(which==="lr"&&sLR&&!sTB)which="tb";else if(which==="tb"&&sTB&&!sLR)which="lr";else if(!which&&sLR!==sTB)which=sLR?"tb":"lr";
  /* review 24: "b" reads the bottom strip alone (a diner page that opens with a photo along its top) */
  if(which==="b")take(o,H-o-b,W-2*o,b);else{if(which!=="lr"){take(o,o,W-2*o,b);take(o,H-o-b,W-2*o,b)}if(which!=="tb"){take(o,o,b,H-2*o);take(W-o-b,o,b,H-2*o)}}let best=null,tot=0;for(const c of cnt.values()){tot+=c.n;if(!best||c.n>best.n)best=c}
  /* review 13: a white poster down one side outvoted a striped paper split across two shades (Minions), so white only wins while it holds more than 60 per cent of the edge */
  if(best&&best.r>235&&best.g>235&&best.b>235){let alt=null;for(const c of cnt.values())if(!(c.r>235&&c.g>235&&c.b>235)&&(!alt||c.n>alt.n))alt=c;let nw=0;for(const c of cnt.values())if(!(c.r>235&&c.g>235&&c.b>235))nw+=c.n;if(alt&&nw>=tot*.4)best=alt}
  return best?[best.r,best.g,best.b]:null}
/* a pure white border round a rendered page is print padding, not the design: cut it off (never more than 15% a side) so the real paper fills the sheet */
function trimWhite(cv){const W=cv.width,H=cv.height,d=cv.getContext("2d").getImageData(0,0,W,H).data,white=(x,y)=>{const i=(y*W+x)*4;return d[i]>=250&&d[i+1]>=250&&d[i+2]>=250};
  const rowW=y=>{for(let x=0;x<W;x+=3)if(!white(x,y))return false;return true},colW=x=>{for(let y=0;y<H;y+=3)if(!white(x,y))return false;return true};
  let t=0,b=H-1,l=0,r=W-1;const mx=Math.round(H*.15),my=Math.round(W*.15);
  while(t<mx&&rowW(t))t++;while(H-1-b<mx&&rowW(b))b--;while(l<my&&colW(l))l++;while(W-1-r<my&&colW(r))r--;
  if(t<2&&l<2&&H-1-b<2&&W-1-r<2)return cv;
  /* review 24: a card edge that falls between two pixels leaves one blended row or column, half card and half padding, and it printed as a pale
     hairline round landscape menus. A side that was cut loses that one more pixel */
  if(t)t++;if(l)l++;if(H-1-b)b--;if(W-1-r)r--;const o=document.createElement("canvas");o.width=r-l+1;o.height=b-t+1;o.getContext("2d").drawImage(cv,l,t,o.width,o.height,0,0,o.width,o.height);return o}
async function exportMenu(kind,parts,opts){
  parts=parts||"all";opts=opts||{};const toPrint=!!opts.print;
  /* printing: every page sits on A4 with an even 5mm white margin, so home printers never clip the border (see addImage below) */let sides=0,orient="portrait";
  if(!current)return;
  const btns=[$("pdf"),$("png")];btns.forEach(b=>b.disabled=true);
  const pb=toPrint?$("print"):$("pdf"),pbText=pb.textContent,word=toPrint?"Getting it ready":"Making your PDF";if(kind==="pdf"){pb.classList.add("busy");pb.setAttribute("aria-busy","true");pb.textContent=word+"..."}
  var pdfStep=t=>{if(kind==="pdf"){pb.textContent=`${word}: ${t}`;$("status").textContent=`Making your A4 PDF: ${t.toLowerCase()}...`}};
  $("status").textContent=kind==="pdf"?"Making your A4 PDF...":"Building your image...";
  if(!await loadExportTools(kind==="pdf")){if(opts.win)try{opts.win.close()}catch(e){}btns.forEach(b=>b.disabled=false);$("status").textContent="Couldn't load the export tools. Check your connection and try again.";return}
  /* full coverage: every page is painted edge to edge in the menu's own paper colour, then the menu sits on it 4mm in,
     so a printer that cannot ink the very edge only ever loses plain colour, never words, and a borderless printer prints true full bleed */
  EDGEFIX=null;const API2=window.jspdf&&window.jspdf.jsPDF&&window.jspdf.jsPDF.API,orig2=API2&&API2.addImage,origURL=HTMLCanvasElement.prototype.toDataURL,EDGE=new Map();
  HTMLCanvasElement.prototype.toDataURL=function(...a){try{const t=trimWhite(this);const u=origURL.apply(t,a);EDGE.set(u,{col:edgeColour(t),tb:edgeColour(t,"tb"),lr:edgeColour(t,"lr"),ar:t.width/t.height});return u}catch(e){return origURL.apply(this,a)}};
  if(kind==="pdf"&&API2)API2.addImage=function(img,fmt,x,y,w,h,...rest){if(typeof w!=="number")return orig2.call(this,img,fmt,x,y,w,h,...rest);
    const PW=this.internal.pageSize.getWidth(),PH=this.internal.pageSize.getHeight(),k=Math.min((PW-8)/PW,(PH-8)/PH),inf=EDGE.get(img)||{};
    /* review 13: a menu that is not A4 shaped leaves bands, and they take the colour of the edges they touch (Minions' poster is white down one side, its top and bottom are brown) */
    const col=EDGEFIX||(inf.ar&&Math.abs(PW/PH-inf.ar)>.03?(PW/PH>inf.ar?inf.lr:inf.tb)||inf.col:inf.col);
    if(col){this.setFillColor(col[0],col[1],col[2]);this.rect(0,0,PW,PH,"F")}
    /* a trimmed image keeps its own shape, centred in the space it was given */
    if(inf.ar){if(w/h>inf.ar){const nw=h*inf.ar;x+=(w-nw)/2;w=nw}else{const nh=w/inf.ar;y+=(h-nh)/2;h=nh}}
    return orig2.call(this,img,fmt,PW*(1-k)/2+x*k,PH*(1-k)/2+y*k,w*k,h*k,...rest)};
  try{
    const canvas=kind==="pdf"&&parts==="prep"?null:await renderCanvas(kind==="pdf"||tab==="menu"?card:prep,kind==="pdf");
    const land=(kind==="pdf"||tab==="menu")&&card.classList.contains("fmt");
    const name=`${slug(current.title)}-${current.year}-${kind==="png"&&tab==="prep"||parts==="prep"?"prep-sheet":parts==="menu"?"menu-only":"menu"}`;
    let data,filename;
    if(kind==="pdf"){
      const {jsPDF}=window.jspdf;
      const spec=fmtSpec(current),sh=card.classList.contains("fx-paper")&&(spec&&fmtSheet(spec)||current.libSheet);
      let pdf;
      if(parts==="prep"){pdf=new jsPDF({unit:"mm",format:"a4",orientation:"portrait"});const pcs=await prepCanvases();pcs.forEach((pc,i)=>{if(i)pdf.addPage("a4","portrait");pdf.addImage(pc.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297)})}
      else if(sh){
        const mm=sh.mm||[sh.w*25.4/96,sh.h*25.4/96],o=mm[0]>mm[1]?"landscape":"portrait",PW=o==="landscape"?297:210,PH=o==="landscape"?210:297;
        const k=Math.min(PW/mm[0],PH/mm[1]),dw=mm[0]*k,dh=mm[1]*k,dx=(PW-dw)/2,dy=(PH-dh)/2;
        pdf=new jsPDF({unit:"mm",format:"a4",orientation:o});
        if(card.classList.contains("fmt-lib"))libUnclip(card);const faces=[...card.querySelectorAll(".fx-face")];
        const cvs=[];for(let i=0;i<faces.length;i++){
          pdfStep(`Page ${i+1} of ${faces.length+(parts==="all"?1:0)}`);
          const el=document.createElement("div");styleCard(el,current);el.className=card.className;el.style.transform="none";
          el.style.width=sh.w+"px";el.style.height=sh.h+"px";el.dataset.w=sh.w;el.dataset.h=sh.h;el.innerHTML=faces[i].innerHTML.replace(/\s(onload|onerror)="[^"]*"/g,"");
          cvs.push(await renderCanvas(el,true));
        }
        /* review 21: a campfire front carries the poster's white frame and the still strip near its edges, so its margin came out cream, maroon
           or brown while the back stayed on the card's own dark surround. Both pages take the back's margin */
        EDGEFIX=card.classList.contains("lib-campfire")&&cvs.length>1?edgeColour(trimWhite(cvs[cvs.length-1])):null;
        /* review 24: a diner's back and continued pages open with a photo across the top, so Men in Black printed on cream, black, then green.
           Each diner page takes its margin from its own paper, read along the bottom edge */
        const per=card.classList.contains("lib-diner")?cvs.map(cv=>edgeColour(trimWhite(cv),"b")):null;
        cvs.forEach((cv,i)=>{if(i)pdf.addPage("a4",o);if(per)EDGEFIX=per[i];pdf.addImage(cv.toDataURL("image/jpeg",0.92),"JPEG",dx,dy,dw,dh)});EDGEFIX=null;
        sides=faces.length;orient=o;
      }else{
        pdf=new jsPDF({unit:"mm",format:"a4",orientation:land?"landscape":"portrait"});
        pdf.addImage(canvas.toDataURL("image/jpeg",0.92),"JPEG",0,0,land?297:210,land?210:297);sides=1;orient=land?"landscape":"portrait";
      }
      if(parts==="all"){pdfStep("The prep sheet");for(const prepCanvas of await prepCanvases()){
      pdf.addPage("a4","portrait");pdf.addImage(prepCanvas.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297)}}
      /* print settings travel inside the PDF, so the print dialog opens ready: actual size, and two-sided with the right flip for a two-sided or folded menu
         (landscape folds turn like a book on the short edge, portrait front-and-back on the long edge) */
      try{pdf.viewerPreferences({PrintScaling:"None",Duplex:sides>=2?(orient==="landscape"?"DuplexFlipShortEdge":"DuplexFlipLongEdge"):"Simplex"})}catch(e){}
      data=pdf.output("blob");filename=name+".pdf";
      if(toPrint){if(globalThis.REEL_NATIVE&&await REEL.print(data,name)){$("status").textContent="";return}printPdf(data,opts.win);$("status").textContent="Menu ready to print.";return}
      /* the app: saved to the phone (Files on iPhone) through the share sheet */
      if(globalThis.REEL_NATIVE){const r=await REEL.saveFile(data,filename);if(r){$("status").textContent=r==="cancel"?"Save cancelled.":`Saved ${filename}. ${parts==="menu"?pdfTip():"Print it at A4, actual size."}`;return}}
    }else{
      data=await new Promise(r=>canvas.toBlob(r,"image/jpeg",0.92));filename=name+".jpg";
      if(!data)data=await (await fetch(canvas.toDataURL("image/jpeg",0.92))).blob();
    }
    /* phones: building the image takes a few seconds, which uses up the tap that iPhones need
       before they'll open the share sheet. So show the finished image with its own Save button. */
    if(kind==="png"&&!downloads&&matchMedia("(pointer:coarse)").matches){
      const file=new File([data],filename,{type:"image/jpeg"});
      showOverlay(canvas.toDataURL("image/jpeg",0.9),shareable(data,filename)?file:null);$("status").textContent="";return
    }
    if(downloads){
      try{await downloads.save({filename,data});$("status").textContent=`Saved ${filename}. ${parts==="menu"&&kind==="pdf"?pdfTip():"Print it at A4, actual size."}`}
      catch(e){
        if(e&&e.code==="declined")$("status").textContent="Save cancelled.";
        else{showOverlay(canvas.toDataURL("image/png"));$("status").textContent=""}
      }
    }else if(!inClaude){plainDownload(data,filename);$("status").textContent=`Downloaded ${filename}. ${parts==="menu"&&kind==="pdf"?pdfTip():"Print it at A4, actual size."}`}
    else{showOverlay(canvas.toDataURL("image/png"));$("status").textContent=""}
  }catch(e){console.error(e);if(opts.win)try{opts.win.close()}catch(x){}$("status").textContent=`Couldn't build the image (${(e&&(e.name||e.message))||"unknown error"}). Close and reopen the app, then try again.`}
  finally{if(API2&&orig2)API2.addImage=orig2;HTMLCanvasElement.prototype.toDataURL=origURL;btns.forEach(b=>b.disabled=false);if(kind==="pdf"){pb.textContent=pbText;pb.classList.remove("busy");pb.removeAttribute("aria-busy")}}
}

$("spin").addEventListener("click",e=>{kbSpin=lastKey||e.detail===0;spin()});
sel.addEventListener("change",setList);
/* Save PDF asks what it's for: everything in one file, the menu on its own (ready for double-sided), or just the prep sheet for the kitchen */
function pdfTip(){if(!current)return "";const sh=card.classList.contains("fx-paper"),fc=sh?card.querySelector(".fx-face"):card,n=sh?card.querySelectorAll(".fx-face").length:1,w=parseFloat(fc&&fc.style.width)||+card.dataset.w||794,h=parseFloat(fc&&fc.style.height)||+card.dataset.h||1123,land=w>h;
  return n>1?`Two sides. Print double-sided, ${land?"flip on short edge":"flip on long edge"}, at 100%.`:"One page. Print it single-sided at 100%."}
$("pdf").addEventListener("click",()=>{if(!current)return;const o=document.createElement("dialog");o.className="counter pdfpick";o.setAttribute("aria-label","Save PDF");
  o.innerHTML=`<div class="rate-box"><p class="rate-k">Save PDF</p><h3>${ESC(current.title)}</h3><div class="pp-opts">
   <button type="button" data-p="menu"><b>Menu only</b><span>${ESC(pdfTip())}</span></button>
   <button type="button" data-p="prep"><b>Prep sheet only</b><span>Recipes and the shopping list for the kitchen. One page, single-sided.</span></button>
   <button type="button" data-p="all"><b>Menu and prep sheet</b><span>Everything in one file. Best kept on screen or printed single-sided.</span></button></div></div>`;
  o.addEventListener("click",e=>{if(e.target===o)return dismissModal(o);const b=e.target.closest("[data-p]");if(!b)return;dismissModal(o);exportMenu("pdf",b.dataset.p)});
  mountModal(o,"[data-p=menu]",$("pdf"))});
$("png").addEventListener("click",()=>exportMenu("png"));
/* story image: a 1080x1920 card of tonight's feature and menu for Instagram and TikTok stories */
async function storyCanvas(f){
  const W=1080,H=1920,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  try{await Promise.all(['700 60px "Oswald"','500 30px "Oswald"','100px "Limelight"','400 36px "Jost"','500 36px "Jost"'].map(n=>document.fonts.load(n)))}catch(e){}
  const g=x.createRadialGradient(W/2,560,60,W/2,700,1300);g.addColorStop(0,"#7a1428");g.addColorStop(.45,"#5a0f1f");g.addColorStop(1,"#2a070f");x.fillStyle=g;x.fillRect(0,0,W,H);
  const BRASS="#e7c069",CREAM="#f4e6c8",SOFT="#e9d9b8";
  const spaced=(t,y,font,col,sp)=>{x.font=font;x.fillStyle=col;const ch=[...t],w=ch.reduce((a,k)=>a+x.measureText(k).width,0)+sp*(ch.length-1);let cx=(W-w)/2;for(const k of ch){x.fillText(k,cx,y);cx+=x.measureText(k).width+sp}};
  const wrap=(t,font,max)=>{x.font=font;const out=[];let line="";for(const w of String(t).split(/\s+/)){const tr=line?line+" "+w:w;if(x.measureText(tr).width>max&&line){out.push(line);line=w}else line=tr}if(line)out.push(line);return out};
  x.textAlign="left";x.textBaseline="alphabetic";
  spaced("BOX OFFICE BITES",150,'700 40px "Oswald"',BRASS,10);
  spaced("TONIGHT'S FEATURE",200,'500 28px "Oswald"',SOFT,9);
  /* bulbs across the top */
  for(let i=0;i<18;i++){const bx=90+i*(900/17);x.beginPath();x.arc(bx,250,8,0,Math.PI*2);x.fillStyle="#ffe9a8";x.shadowColor="rgba(255,214,120,.9)";x.shadowBlur=18;x.fill()}x.shadowBlur=0;
  const pw=440,ph=660,px=(W-pw)/2,py=300;
  x.fillStyle=BRASS;x.fillRect(px-12,py-12,pw+24,ph+24);x.fillStyle="#1a0409";x.fillRect(px,py,pw,ph);
  const pp=lobbyPoster(f);
  if(pp&&globalThis.REEL_APP){try{await document.fonts.load('80px "Limelight"');x.drawImage(REEL.posterCanvas(f,pw,ph,{font:'"Limelight", Georgia, serif',ink:CREAM,bg:"#2a070f",accent:BRASS}),px,py,pw,ph)}catch(e){}}
  else if(pp)await new Promise(ok=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>{try{x.drawImage(im,px,py,pw,ph)}catch(e){}ok()};im.onerror=ok;im.src=TMDB_IMG+"w500"+pp;setTimeout(ok,6000)});
  x.textAlign="center";
  let y=py+ph+110;
  let tf=88,tl;do{tl=wrap(f.title,`${tf}px "Limelight"`,940);if(tl.length<=2)break;tf-=8}while(tf>48);
  x.fillStyle=CREAM;x.font=`${tf}px "Limelight"`;for(const l of tl.slice(0,2)){x.fillText(l,W/2,y);y+=tf*1.05}
  const spec=typeof fmtSpec==="function"?fmtSpec(f):null,L=f._lib||{};
  const venue=(L.flavour&&L.flavour.venue)||(spec&&(spec.sign?spec.sign[1]:spec.brand))||"";
  if(venue){y+=4;spaced(String(venue).toUpperCase().slice(0,40),y,'500 30px "Oswald"',BRASS,6);y+=30}
  y+=40;x.strokeStyle="rgba(231,192,105,.5)";x.lineWidth=2;x.beginPath();x.moveTo(140,y);x.lineTo(W-140,y);x.stroke();y+=70;
  const m=(current&&current.id===f.id&&current.menu)||makeMenu(f),NAMES={s:"STARTERS",m:"MAINS",w:"SWEETS",d:"DRINKS"};
  const courses=["s","m","w","d"].map(k=>[k,(m[k]||[]).map(it=>it&&(it.label||it.n)).filter(Boolean)]).filter(c=>c[1].length);
  const room=H-230-y,need=n=>courses.reduce((a,c)=>a+76+Math.min(n,c[1].length)*50,0),per=need(2)<=room?2:1;
  if(need(1)>room){
    /* tight: two columns, one dish each, names wrap to two lines */
    const cols=[W*.27,W*.73];let rowY=y;
    courses.slice(0,4).forEach(([k,its],i)=>{const cx=cols[i%2],yy=rowY+Math.floor(i/2)*170;
      x.textAlign="left";const nm=NAMES[k];x.font='700 28px "Oswald"';const ch=[...nm],sw=ch.reduce((a,q)=>a+x.measureText(q).width,0)+8*(ch.length-1);let sx=cx-sw/2;x.fillStyle=BRASS;for(const q of ch){x.fillText(q,sx,yy);sx+=x.measureText(q).width+8}
      x.textAlign="center";x.fillStyle=CREAM;const ls=wrap(its[0],'500 34px "Jost"',440);x.font='500 34px "Jost"';ls.slice(0,2).forEach((l,j)=>x.fillText(j===1&&ls.length>2?l+"...":l,cx,yy+48+j*44))});
    courses.length=0;
  }
  for(const [k,its] of courses){
    if(y+126>H-200)break;
    spaced(NAMES[k],y,'700 28px "Oswald"',BRASS,8);y+=50;
    for(const n of its.slice(0,per)){const ls=wrap(n,'500 38px "Jost"',900);x.fillStyle=CREAM;x.font='500 38px "Jost"';x.fillText(ls[0]+(ls.length>1?"...":""),W/2,y);y+=50}
    y+=26;
  }
  const site=globalThis.REEL_APP?REEL.site.replace(/^https:\/\//,""):(location.host+location.pathname).replace(/index\.html$/,"").replace(/\/$/,"");
  spaced("SPIN YOURS AT",H-130,'500 26px "Oswald"',SOFT,7);
  x.fillStyle=BRASS;x.font='600 34px "Jost"';x.fillText(site,W/2,H-80);
  return c;
}
$("storyBtn").addEventListener("click",async()=>{
  if(!current)return;const b=$("storyBtn");b.disabled=true;$("status").textContent="Making your story image...";
  try{
    const c=await storyCanvas(current),data=await new Promise(r=>c.toBlob(r,"image/jpeg",.9)),name=`${slug(current.title)}-${current.year}-story.jpg`;
    if(shareable(data,name))showOverlay(URL.createObjectURL(data),new File([data],name,{type:"image/jpeg"}));
    else plainDownload(data,name);
    $("status").textContent="Story image ready.";
  }catch(e){console.warn("story",e);$("status").textContent="Couldn't make the story image. Try again."}
  b.disabled=false;
});
/* trifolds: a two-sided PDF that prints and folds into a real takeaway menu */
async function exportFold(){
  const f=current,spec=f&&fmtSpec(f);if(!spec||!fmtCanFold(spec))return;
  const btn=$("foldPdf");btn.disabled=true;$("status").textContent="Building your fold-at-home PDF...";
  try{
    if(!await loadExportTools(true)){$("status").textContent="Couldn't load the export tools. Check your connection and try again.";return}
    const pages=fmtFoldPages(f,spec,current.menu);
    const page=async html=>{const el=document.createElement("div");styleCard(el,f);el.className="mcard fmt fmt-"+spec.fmt;el.style.transform="none";el.innerHTML=html;fmtTilesPNG(el);return renderCanvas(el,true)};
    const out=await page(pages.outside),ins=await page(pages.inside),pps=await prepCanvases();
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:"mm",format:"a4",orientation:"landscape"});
    pdf.addImage(out.toDataURL("image/jpeg",0.92),"JPEG",0,0,297,210);
    pdf.addPage("a4","landscape");pdf.addImage(ins.toDataURL("image/jpeg",0.92),"JPEG",0,0,297,210);
    for(const pp of pps){pdf.addPage("a4","portrait");pdf.addImage(pp.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297)}
    const data=pdf.output("blob"),filename=`${slug(f.title)}-${f.year}-fold-at-home.pdf`;
    const tip="Print pages 1 and 2 double-sided, flip on the short edge, actual size. Fold the left panel in first, then the cover over it.";
    if(downloads){try{await downloads.save({filename,data});$("status").textContent=`Saved ${filename}. ${tip}`}catch(e){$("status").textContent=e&&e.code==="declined"?"Save cancelled.":"Couldn't save the PDF."}}
    else{plainDownload(data,filename);$("status").textContent=`Downloaded ${filename}. ${tip}`}
  }catch(e){console.error(e);$("status").textContent="Couldn't build the fold-at-home PDF. Try again."}
  finally{btn.disabled=false}
}
$("foldPdf").addEventListener("click",exportFold);
/* share a menu as a link: opens straight to this film's menu */
$("shareLink").addEventListener("click",async()=>{
  if(!current)return;const url=(typeof REEL!=="undefined"?REEL.siteURL():location.origin+location.pathname)+"?film="+encodeURIComponent(current.id);
  const title=`${current.title} movie night menu`,text=`${current.title} (${current.year}): ${current.tag||"movie night menu"}`;
  try{const nat=typeof REEL!=="undefined"&&await REEL.share({title,text,url});if(nat){if(nat==="sent")$("status").textContent="Menu link sent."}
    else if(navigator.share){await navigator.share({title,text,url});$("status").textContent="Menu link sent."}
    else{await navigator.clipboard.writeText(url);$("status").textContent="Link copied. Anyone who opens it lands on this menu."}}
  catch(e){if(!(e&&e.name==="AbortError")){try{await navigator.clipboard.writeText(url);$("status").textContent="Link copied."}catch(err){$("status").textContent=url}}}
});
/* printing: every page lands on A4, scaled to fit and centred, from the Print button or the browser's own Print */
function printPage(el,w,h){const land=w>h,W=land?1120:792,H=land?790:1118,k=Math.min(W/w,H/h);const pg=document.createElement("div");pg.className="print-page"+(land?" land":"");
  el.style.cssText+=`;position:absolute;left:${Math.round((W-w*k)/2)}px;top:${Math.round((H-h*k)/2)}px;width:${w}px;height:${h}px;transform:scale(${k});transform-origin:0 0;margin:0`;pg.appendChild(el);return pg}
function fillPrint(){
  const pa=$("printArea");pa.innerHTML="";if(!current)return;
  if(card.classList.contains("fx-paper")){card.querySelectorAll(".fx-face").forEach(fc=>{const c=card.cloneNode(false);c.hidden=false;c.innerHTML=fc.innerHTML;pa.appendChild(printPage(c,parseFloat(fc.style.width)||+card.dataset.w,parseFloat(fc.style.height)||+card.dataset.h))})}
  else{const c=card.cloneNode(true);c.hidden=false;const land=card.classList.contains("fmt");pa.appendChild(printPage(c,+card.dataset.w||(land?1123:794),+card.dataset.h||(land?794:1123)))}
  for(const el of prepParts()){const st=document.createElement("div");st.style.cssText="position:fixed;left:-20000px;top:0;width:794px;height:1123px";
    const c=el.cloneNode(true);c.hidden=false;c.style.transform="none";c.classList.add("pp-a4");prepClean(c);st.appendChild(c);document.body.appendChild(st);fitPrep(c);st.remove();pa.appendChild(printPage(c,794,1123))}
}
/* Print sends the finished PDF to the printer, so no browser adds a web address, date or page numbers. On a computer it goes straight to the print dialog;
   on a phone or tablet it opens in the PDF viewer, where Share then Print gives clean pages */
const coarse=()=>matchMedia("(pointer:coarse)").matches;
function printPdf(blob,win){const url=URL.createObjectURL(blob);
  if(win&&!win.closed){win.location.href=url;setTimeout(()=>URL.revokeObjectURL(url),120000);return}
  const fr=document.createElement("iframe");fr.style.cssText="position:fixed;width:0;height:0;border:0;right:0;bottom:0";fr.setAttribute("aria-hidden","true");fr.src=url;
  fr.onload=()=>{setTimeout(()=>{try{fr.contentWindow.focus();fr.contentWindow.print()}catch(e){window.open(url,"_blank")}},300);setTimeout(()=>{fr.remove();URL.revokeObjectURL(url)},120000)};document.body.appendChild(fr)}
$("print").addEventListener("click",()=>{if(!current)return;
  /* the new tab has to open on the tap itself or phones block it; it shows a holding line until the PDF is ready */
  let win=null;if(coarse()&&!globalThis.REEL_NATIVE){try{win=window.open("","_blank");if(win)win.document.write('<title>Getting your menu ready</title><body style="font:18px system-ui;padding:40px;color:#333;background:#fff">Getting your menu ready to print...</body>')}catch(e){win=null}}
  const pb=$("print"),t=pb.textContent;pb.disabled=true;pb.textContent="Getting it ready...";
  exportMenu("pdf","all",{print:true,win}).finally(()=>{pb.disabled=false;pb.textContent=t})});
window.addEventListener("beforeprint",()=>{if(!$("printArea").children.length)fillPrint()});
window.addEventListener("afterprint",()=>{$("printArea").innerHTML=""});
$("copy").addEventListener("click",()=>{
  const txt=menuText();
  const done=()=>{$("status").textContent="Menu copied as text."};
  const fail=()=>{
    const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();
    try{document.execCommand("copy");done()}catch(e){$("status").textContent="Copy is blocked here."}
    ta.remove();
  };
  try{navigator.clipboard.writeText(txt).then(done,fail)}catch(e){fail()}
});
window.addEventListener("resize",size);

setList();size();renderHist();scalePreview();renderWeek();renderMotw();
try{document.documentElement.style.setProperty("--grainTile",`url("${noiseTile()}")`)}catch(e){}
/* the app carries every file already and Android serves it from https://localhost, so app mode never registers the worker */
if("serviceWorker" in navigator&&location.protocol==="https:"&&!globalThis.REEL_APP)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
/* offline: once the page has settled, the worker saves every film's menu, the layouts and the dish lists in the background (about 4 MB over the wire),
   and the candy bar and Galaxy Video photos load once, so a spin works anywhere with no signal. Skipped when the phone is set to save data */
function warmOffline(reg){
  if(navigator.onLine===false||(navigator.connection&&navigator.connection.saveData)||!reg.active)return;
  const u=FILMS.map(filmFile);
  if(typeof FMT_VER!=="undefined")for(const k in FMT_VER)u.push("formats/"+k+".js?v="+FMT_VER[k]);
  if(window.LIB_VER)for(const k in LIB_VER)u.push("menu-formats/"+k+".js?v="+LIB_VER[k]);
  if(window.DATA_V){u.push("data/dish-names.json?v="+DATA_V.names,"data/dish-notes.json?v="+DATA_V.notes);if(DATA_V.trivia)u.push("data/trivia.json?v="+DATA_V.trivia)}
  reg.active.postMessage({warm:u});
  /* review 22: the Save PDF and Save image libraries too, so a first save offline works (the worker keeps them on first use) */
  ["assets/lib/html2canvas-1.4.1.min.js","assets/lib/jspdf-2.5.1.umd.min.js"].forEach(x=>{try{fetch(x).catch(()=>{})}catch(e){}});
  /* a detached copy of each shop photo picks the same size the page would */
  document.querySelectorAll("#walkin img,#viewShop img,#viewCrave img").forEach(im=>{if(im.complete&&im.naturalWidth)return;const i=new Image();if(im.sizes)i.sizes=im.sizes;if(im.srcset)i.srcset=im.srcset;i.src=im.getAttribute("src")});
  (window.SNACKS||[]).forEach(x=>{if(x.img)new Image().src=x.img});
  /* plus the few pictures that layouts draw as textures (the diner's paper and laminate) and the member card */
  ["assets/brand/member-card.webp","assets/brand/case-sticker.webp","menu-formats/assets/diner/paper-grain.webp","menu-formats/assets/diner/rain-glass.webp","menu-formats/assets/diner/laminate-wear.webp","assets/menu-art/clock-tower.png"].forEach(x=>{new Image().src=x});
}
if("serviceWorker" in navigator&&!globalThis.REEL_APP){navigator.serviceWorker.ready.then(reg=>setTimeout(()=>warmOffline(reg),6000)).catch(()=>{});navigator.serviceWorker.addEventListener("message",e=>{if(e.data&&"warmed" in e.data)savedScan()})}
/* offline: a small note where something needs the internet (the request form, the member card sync), and its send button waits for the signal */
function netMarks(){const off=navigator.onLine===false;document.querySelectorAll(".off-note").forEach(n=>{n.hidden=!off});
  document.querySelectorAll("[data-net]").forEach(b=>{if(off&&!b.disabled){b.disabled=true;b.dataset.offdis="1"}else if(!off&&b.dataset.offdis){b.disabled=false;delete b.dataset.offdis}})}
addEventListener("online",netMarks);addEventListener("offline",netMarks);
/* review 22: the sync note keeps its promise. Back online, changes saved while offline go up, and the note follows the signal */
addEventListener("online",()=>{try{if(member&&member.pin&&syncState!=="saved")pushSync()}catch(e){}});
["online","offline"].forEach(ev=>addEventListener(ev,()=>{try{const el=document.getElementById("syncNote");if(el)el.textContent=syncNote()}catch(e){}}));
setKidsUI();if(kidsMode)setList();pullSync();
try{if(!localStorage.getItem("mns-welcome"))setTimeout(()=>{const w=document.getElementById("walkin");if(w&&!w.hidden)document.addEventListener("walkin-done",()=>setTimeout(showWelcome,300),{once:true});else showWelcome()},400)}catch(e){}
/* a shared film link always opens on its menu, whatever tab was open last */try{const v=new URLSearchParams(location.search).get("film")?"wheel":localStorage.getItem("mns-view");if(location.hash==="#shop"||v==="shop")setView("shop");else if(location.hash==="#crave"||v==="crave")setView("crave")}catch(e){}
document.fonts.ready.then(draw);
const initialFilmId=new URLSearchParams(window.location.search).get("film");
const startId=initialFilmId||(week&&week.id)||hist[0];
const initialFilm=FILMS.find(f=>f.id===startId)||FILMS.find(f=>f.id==="Ghostbusters (1984)")||FILMS[0];
if(FILMS.some(f=>f.id===startId)){$("now").textContent=initialFilm.title;show(initialFilm,true).then(()=>setTimeout(toSharedFilm,250))}
else{theatre.classList.add("closed");$("tease").textContent=initialFilmId?"That film isn't on the shelf. Spin the wheel instead":"Spin the wheel to raise the curtain";
  const badLink=()=>{if(!initialFilmId)return;const st=$("status");if(st)st.textContent=`Couldn't find "${initialFilmId}" in the video store. The link may be cut short or the film isn't in the catalogue. Spin the wheel or search the video store.`};badLink();
  /* nobody's picked yet: dress the stage behind the curtain once the page has settled */
  document.body.classList.add("staged");addEventListener("load",()=>(window.requestIdleCallback||setTimeout)(()=>{if(!current){window.__stage=true;show(initialFilm,true).then(()=>{$("whereWheel").innerHTML="";badLink()})}},{timeout:2500}))}
addEventListener("load",()=>setTimeout(ensureDishes,3000));
/* forgiving film search: ignores case, accents and apostrophes, reads & as and, and lets a word be a letter or two out ("singing in the rain", "breakfast at tiffanys") */
function searchNorm(x){return String(x).toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/['’‘`]/g,"").replace(/&/g," and ").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim()}
const ROMAN={i:"1",ii:"2",iii:"3",iv:"4",v:"5",vi:"6",vii:"7",viii:"8",ix:"9",x:"10"},SEARCH_STOP=new Set(["the","a","an","of","and","in","at","on","to"]);
function editNear(a,b,max){if(Math.abs(a.length-b.length)>max)return false;const m=a.length,n=b.length;let prev=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const cur=[i];let best=i;for(let j=1;j<=n;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));best=Math.min(best,cur[j])}if(best>max)return false;prev=cur}return prev[n]<=max}
function wordHit(w,toks){const r=ROMAN[w]||w;let fuzzy=false;for(const t of toks){const tr=ROMAN[t]||t;if(tr===r||(w.length>=3&&t.startsWith(w)))return 1;if((w.length>=4&&w.startsWith(t)&&t.length>=4)||(w.length>=5&&editNear(w,t.slice(0,Math.max(w.length,t.length)),w.length>=8?2:1)))fuzzy=true}return fuzzy?2:0}
function filmScore(q,f){const Q=searchNorm(q);if(!Q)return 0;const T=searchNorm(f.title+" "+f.year),toks=T.split(" ");
  if(searchNorm(f.title)===Q||T===Q)return 0;if(T.startsWith(Q))return 0.5;if((" "+T).includes(" "+Q))return 1;if(Q.length>=2&&!Q.includes(" ")&&T.replace(/ /g,"").startsWith(Q))return 1;
  let worst=1,any=0;for(const w of Q.split(" ")){const h=wordHit(w,toks);if(!h){if(SEARCH_STOP.has(w))continue;return -1}any++;worst=Math.max(worst,h+1)}return any?worst:-1}
/* ================= ease of use: quick find, saved menus, settings, clear and reset ================= */
/* open any film straight from its title, the way a stub does */
function openFilm(f){if(!f)return;addHistory(f);goView("wheel",true);if(tab!=="menu")setTab("menu");replay(f).then(()=>toMenu());toMenu()}
{const inp=$("findFilm"),box=$("findList");let hits=[],at=-1;
  inp.addEventListener("focus",()=>{if(innerWidth<760)setTimeout(()=>{const t=inp.getBoundingClientRect().top;if(t>innerHeight*0.3)scrollBy({top:t-70,behavior:reduce?"auto":"smooth"})},250)});
 const norm=s=>s.toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim();
 const close=()=>{box.hidden=true;box.innerHTML="";hits=[];at=-1;inp.setAttribute("aria-expanded","false")};
 const draw=()=>{box.innerHTML=hits.length?hits.map((f,i)=>`<button type="button" role="option" data-i="${i}" aria-selected="${i===at}"><span>${ESC(f.title)}</span><small>${ESC(f.year)}</small></button>`).join(""):'<p class="none">No film by that name. Try fewer letters.</p>';box.hidden=false;inp.setAttribute("aria-expanded","true")};
 inp.addEventListener("input",()=>{const q=norm(inp.value);if(q.length<2){close();return}
   const scored=[];
   for(const f of FILMS){if(kidsMode&&!isKidSafe(f))continue;const sc=filmScore(inp.value,f);if(sc>=0)scored.push([sc,f])}
   scored.sort((a,b)=>a[0]-b[0]||(+a[1].year)-(+b[1].year)||a[1].title.localeCompare(b[1].title));hits=scored.slice(0,7).map(x=>x[1]);at=hits.length?0:-1;draw()});
 inp.addEventListener("keydown",e=>{if(box.hidden)return;
   if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!hits.length)return;at=(at+(e.key==="ArrowDown"?1:-1)+hits.length)%hits.length;draw()}
   else if(e.key==="Enter"){e.preventDefault();if(hits[at]){const f=hits[at];inp.value="";close();inp.blur();openFilm(f)}}
   else if(e.key==="Escape"){close()}});
 box.addEventListener("click",e=>{const b=e.target.closest("[data-i]");if(!b)return;const f=hits[+b.dataset.i];inp.value="";close();openFilm(f)});
 document.addEventListener("click",e=>{if(!e.target.closest(".field.find"))close()});}

/* showtime: an old film countdown leader runs, the 2 pops, and the lights go down on tonight's film */
function startShow(f){
  f=f||current;if(!f||(f===current&&document.body.classList.contains("staged")))return;
  const cue=String(((typeof movieEdition==="function"&&movieEdition(f))||{}).cue||f.P||"");
  const o=document.createElement("dialog");o.className="leader";o.setAttribute("aria-label","Showtime: "+f.title);
  o.innerHTML=`<div class="ld-film" aria-hidden="true"><div class="ld-sweep"></div><div class="ld-rings"></div><div class="ld-cross"></div><b class="ld-n">5</b></div>
  <div class="ld-card" hidden><p class="ld-k">Now showing</p><h3>${ESC(f.title)}</h3><p class="ld-y">${ESC(f.year)}</p>${cue?`<p class="ld-cue"><b>Showtime cue</b>${ESC(dietText(f,cue))}</p>`:""}<button type="button" class="ld-go" data-a="done">Enjoy the film</button></div>`;
  const timers=[];const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
  const film=o.querySelector(".ld-film"),n=o.querySelector(".ld-n"),cardEl=o.querySelector(".ld-card");
  const showCard=()=>{sfx.whirrStop();film.hidden=true;o.classList.add("dark");cardEl.hidden=false;const b=cardEl.querySelector(".ld-go");if(b)b.focus({preventScroll:true})};
  o.addEventListener("click",e=>{if(e.target===o||(e.target.dataset&&e.target.dataset.a==="done"))dismissModal(o);else if(!cardEl.hidden)return;else{timers.forEach(clearTimeout);showCard()}});
  mountModal(o,".ld-go",document.activeElement,()=>{timers.forEach(clearTimeout);sfx.whirrStop()});
  if(reduce){showCard();return}
  sfx.whirrStart();
  [5,4,3,2].forEach((k,i)=>later(i*1000,()=>{n.textContent=k;film.classList.remove("tick");void film.offsetWidth;film.classList.add("tick")}));
  later(3000,()=>{sfx.beep();film.classList.add("pop")});
  later(3150,()=>{film.classList.add("black")});
  later(3800,showCard);
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-show]");if(b)startShow()});
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-next]");if(!b||!week)return;week.date=nextWeekDate(week.day,week.time);saveWeek();renderWeek();refreshPrepTime();
  const [d]=cookDate();$("status").textContent=`Moved to ${DAYS[d.getDay()]} ${d.getDate()} ${d.toLocaleString("en-AU",{month:"short"})}, ${clock(week.time)}.`});
$("kitBtn").addEventListener("click",()=>openKit());
$("mysBtn").addEventListener("click",()=>openMystery(false));mystButton();
$("trivBtn").addEventListener("click",()=>openTrivia());

/* mystery night: the menu is cooked blind, the film stays sealed in an envelope until showtime */
var MYST=null;try{MYST=JSON.parse(localStorage.getItem("mns-mystery")||"null")}catch(e){MYST=null}
const mystSave=()=>{try{MYST?localStorage.setItem("mns-mystery",JSON.stringify(MYST)):localStorage.removeItem("mns-mystery")}catch(e){}};
function mystScrub(f,t){
  t=String(t||"");const words=f.title.split(/[^A-Za-z0-9']+/).filter(w=>w.length>3&&!/^(the|and|with|from|part)$/i.test(w));
  for(const w of words)t=t.replace(new RegExp("\\b"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","gi"),"?");
  return t.replace(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)?['’]s\b/g,"the house").replace(/\?(\s\?)+/g,"?");
}
function mystGenre(f){return aisleOf(f)||"A good one"}
function mystButton(){const b=$("mysBtn");if(!b)return;const f=MYST&&FILMS.find(x=>x.id===MYST.id);b.textContent=f?"Your mystery night":"Mystery night";b.classList.toggle("on",!!f)}
async function openMystery(fresh){
  let f=MYST&&!fresh&&FILMS.find(x=>x.id===MYST.id);
  if(!f){const pool=(list&&list.length?list:FILMS).filter(x=>!kidsMode||isKidSafe(x));f=pool[Math.floor(Math.random()*pool.length)];MYST={id:f.id,at:Date.now()};mystSave()}
  await ensureExact(f);
  const m=makeMenu(f,true),C=[["s","Snacks"],["m","Main"],["w","Dessert"],["d","To drink"]];
  const r2=(f._r2&&f._r2.dishes)||[];
  const steps=it=>{const d=r2.find(z=>z.n===(it.orig||it.k||it.n));return d&&d.steps?d.steps.map(x=>mystScrub(f,x.text)):String(it.how||"").split(/(?<=\.)\s+/).map(t=>mystScrub(f,t)).filter(Boolean)};
  let n=0;const courses=C.filter(([k])=>(m[k]||[]).length).map(([k,h])=>`<h4>${h}</h4>${m[k].map(it=>{n++;return `<details class="my-dish"><summary><b>Dish ${n}</b><span>${ESC(mystScrub(f,it.note||it.d||""))}</span></summary><ol>${steps(it).map(t=>`<li>${ESC(t)}</li>`).join("")}</ol></details>`}).join("")}`).join("");
  const rate=ratingOf(f);
  const o=document.createElement("dialog");o.className="counter mystery";o.setAttribute("aria-label","Mystery night");
  o.innerHTML=`<div class="my-box"><div class="my-env"><div class="my-flap"></div><div class="my-seal">?</div><p class="my-k">Tonight's mystery</p><p class="my-t">Sealed until showtime</p>
    <div class="my-clues"><span>${ESC(mystGenre(f))}</span><span>${ESC(String(f.year).slice(0,3))}0s</span>${rate?`<span>Rated ${ESC(rate)}</span>`:""}</div></div>
    <p class="my-say">Cook the menu blind. Nobody finds out the film until you open the envelope.</p>
    <div class="my-menu">${courses}</div>
    <details class="my-hint"><summary>Need a hint?</summary><p>${ESC(mystScrub(f,f.D))}</p></details>
    <div class="acts"><button type="button" class="go" data-a="reveal">Open the envelope</button><button type="button" data-a="shop">Shopping list</button><button type="button" data-a="new">Different mystery</button><button type="button" data-a="drop">Cancel mystery</button></div></div>`;
  o.addEventListener("click",async e=>{if(e.target===o)return dismissModal(o);const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;
    if(a==="shop")return openTrolley(f,undefined,"Mystery night shopping");
    if(a==="new"){dismissModal(o);return openMystery(true)}
    if(a==="drop"){MYST=null;mystSave();mystButton();return dismissModal(o)}
    if(a==="reveal"){dismissModal(o);MYST=null;mystSave();mystButton();addHistory(f);goView("wheel",true);replay(f,true).then(()=>toMenu());setTimeout(()=>startShow(f),reduce?0:300)}});
  mountModal(o,"[data-a=reveal]",document.activeElement);mystButton();
}
/* trivia spin: the wheel hides a film, three questions stand between you and it, two right unlocks the show */
let _triv=null;
const ensureTrivia=()=>_triv||(_triv=fetch("data/trivia.json"+(window.DATA_V&&DATA_V.trivia?"?v="+DATA_V.trivia:"")).then(r=>r.json()).catch(()=>{_triv=null;return {}}));
async function openTrivia(){
  const T=await ensureTrivia();
  const pool=(list&&list.length?list:FILMS).filter(x=>(!kidsMode||isKidSafe(x))&&T[x.id]&&T[x.id].length>=3);
  if(!pool.length)return;
  const f=pool[Math.floor(Math.random()*pool.length)];
  const Q=T[f.id].slice(0,3).map(q=>{const o=q.a.map((t,i)=>({t,ok:i===q.c}));for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}return {q:q.q,o}});
  let i=0,right=0,wrong=0;
  const o=document.createElement("dialog");o.className="counter trivia";o.setAttribute("aria-label","Trivia spin");
  o.innerHTML=`<div class="tv-box"><p class="tv-k">Trivia spin</p><p class="tv-t">The wheel has picked a film</p>
    <p class="tv-say">Get two of three right and it's yours.</p><div class="tv-dots"><i></i><i></i><i></i></div><div class="tv-stage" aria-live="polite"></div></div>`;
  const stage=o.querySelector(".tv-stage"),dots=[...o.querySelectorAll(".tv-dots i")];
  const ask=()=>{const q=Q[i];stage.innerHTML=`<p class="tv-n">Clue ${i+1} of 3</p><p class="tv-q">${ESC(q.q)}</p><div class="tv-opts">${q.o.map((x,k)=>`<button type="button" data-o="${k}">${ESC(x.t)}</button>`).join("")}</div>`;const h=stage.querySelector(".tv-q");h.tabIndex=-1;h.focus({preventScroll:true})};
  const end=win=>{
    if(win)stage.innerHTML=`<p class="tv-res win">You got it.</p><p class="tv-say">The film is unlocked. Lights down.</p><div class="acts"><button type="button" class="go" data-a="reveal">Roll the film</button></div>`;
    else stage.innerHTML=`<p class="tv-res">Not this time.</p><p class="tv-say">The film stays sealed. Spin again for a new one.</p><div class="acts"><button type="button" class="go" data-a="again">Spin again</button><button type="button" data-a="close">Close</button></div>`;
    const g=stage.querySelector(".go");g&&g.focus()};
  o.addEventListener("click",e=>{if(e.target===o)return dismissModal(o);
    const ob=e.target.closest("[data-o]");
    if(ob&&!stage.dataset.lock){stage.dataset.lock=1;const q=Q[i],k=+ob.dataset.o,ok=q.o[k].ok;
      stage.querySelectorAll("[data-o]").forEach((b,n)=>{b.disabled=true;if(q.o[n].ok)b.classList.add("ok");else if(n===k)b.classList.add("no")});
      dots[i].className=ok?"ok":"no";ok?right++:wrong++;try{ok?sfx.beep&&sfx.beep():0}catch(_){}
      setTimeout(()=>{delete stage.dataset.lock;i++;if(right>=2)end(true);else if(wrong>=2)end(false);else ask()},reduce?400:1100);return}
    const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;
    if(a==="close")return dismissModal(o);
    if(a==="again"){dismissModal(o);return openTrivia()}
    if(a==="reveal"){dismissModal(o);addHistory(f);goView("wheel",true);replay(f,true).then(()=>toMenu());setTimeout(()=>startShow(f),reduce?0:300)}});
  mountModal(o,".tv-stage",document.activeElement);ask();
}
/* table kit: a door sign, place cards and an intermission card, printed in tonight's film's colours and type */
const kitTime=t=>{const m=/^(\d{1,2}):(\d{2})$/.exec(t||"");if(!m)return "";let h=+m[1];const ap=h>=12?"pm":"am";h=h%12||12;return `${h}${m[2]==="00"?"":":"+m[2]}${ap}`};/* review 16: "6:45pm", as the strip, bar, Prep sheet and calendar write it */
const KIT_SIGN={club:"neon",bartab:"neon",diner:"letterboard",motel:"neon",tiki:"neon",kiosk:"letterboard",candybar:"marquee",takeaway:"letterboard",stadium:"marquee",prom:"marquee",
  campfire:"board",saloon:"board",tavern:"board",pub:"board",truck:"board",cafe:"board",canteen:"board",galley:"board",
  lab:"notice",precinct:"notice",newspaper:"notice",airline:"notice",diningcar:"notice",
  hotel:"plaque",banquet:"plaque",invite:"plaque",tearoom:"plaque",bistro:"plaque",home:"plaque",placemat:"letterboard",
  foodcourt:"letterboard",deli:"letterboard",bowling:"neon",arcade:"neon",drivein:"neon",dimsum:"neon",clubhouse:"plaque",reception:"plaque",skilodge:"board",hospital:"notice"};
const KIT_THEME_SIGN={redsauce:"plaque",uptown:"plaque",romcom:"plaque",fairytale:"plaque",xmas:"plaque",wizard:"plaque",diner:"letterboard",teen:"marquee",tiki:"neon",mex:"neon",street:"neon",pizza:"neon",cop:"notice",scifi:"terminal",galaxy:"terminal",hero:"notice",horror:"notice",western:"board",aussie:"board",adventure:"board",kids:"board",soul:"neon",deli:"neon",asian:"neon",philly:"neon"};
const KIT_THEME_FIRST={hero:"comic",horror:"horror",xmas:"festive",fairytale:"storybook",kids:"storybook",wizard:"parchment",western:"wanted",teen:"arcade",adventure:"parchment",tiki:"tiki"};
const KIT_FMT_NEW={campfire:"camp",home:"kitchen",tiki:"tiki",saloon:"wanted",newspaper:"newspaper",airline:"departures",diningcar:"departures",motel:"roadside"};
const kitHash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
function kitStyle(f,L,fl){
  const t=KIT_THEME_FIRST[f.theme],h=kitHash(f.id)%10;
  /* genre styles take most of their films, the rest keep their venue's style so a genre never looks all the same */
  if(t&&(h<(f.theme==="kids"||f.theme==="fairytale"||f.theme==="hero"?5:7)||!L.fmt&&!fl.door))return t;
  if(KIT_FMT_NEW[L.fmt])return KIT_FMT_NEW[L.fmt];
  if((L.era==="1930s-40s")&&["club","banquet","hotel","bistro","invite","bartab"].includes(L.fmt))return "deco";
  if(f.theme==="uptown"&&h<3)return "deco";
  return "";
}
function kitFonts(){if(!document.getElementById("kitFonts")){const l=document.createElement("link");l.id="kitFonts";l.rel="stylesheet";l.href=rdFontHref("family=Yellowtail&family=Rye&family=Special+Elite&family=Playfair+Display+SC:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Caveat:wght@500;700&family=Courier+Prime:wght@400;700&family=Shrikhand&family=Bangers&family=Creepster&family=Press+Start+2P&family=UnifrakturMaguntia&family=Playfair+Display:wght@700;900&family=Mountains+of+Christmas:wght@700&family=Cinzel+Decorative:wght@700&family=IM+Fell+English:ital@0;1&family=Poiret+One&family=Monoton","swap");document.head.appendChild(l)}
  return Promise.all(["Yellowtail","Rye","Special Elite","Playfair Display SC","Cormorant Garamond","Caveat","Courier Prime","Shrikhand","Bangers","Creepster","Press Start 2P","UnifrakturMaguntia","Playfair Display","Mountains of Christmas","Cinzel Decorative","IM Fell English","Poiret One","Monoton"].map(n=>document.fonts.load(`32px "${n}"`).catch(()=>{}))).then(()=>document.fonts.ready)}
function kitBits(f){
  const L=f._lib||f._kit||{},fl=L.flavour||{},pal=L.palette||{},st=STY[f.theme]||{};
  const D=x=>dietText(f,String(x||""));
  const m=current&&current.id===f.id&&current.menu||{};
  /* the intermission card serves what's being cooked: an unticked sweet or drink is skipped for the next one still ticked */
  const off=current&&current.id===f.id&&PLAN.off||{},kept=x=>x&&![x.n,x.orig,x.label].some(k=>k&&off[k]);
  const w=(m.w||[]).find(kept),d=(m.d||[]).find(kept);
  const time=typeof week!=="undefined"&&week&&week.id===f.id?kitTime(week.time):"";
  const prop=fl.prop||{kind:"ticket",title:f.title,lines:[String(f.year)]};
  /* on a vegetarian night a kit note that still names meat or fish after the diet swaps stays off the kit, as the card's notes do */
  let note=fl.note&&fl.note.text?{text:D(fl.note.text),by:fl.note.by||"",kind:fl.note.kind||"note"}:null;
  if(note&&DIET.veg&&/\b(beef|steaks?|pork|ham|bacon|chicken|turkey|lamb|veal|sausages?|meatballs?|meat|brisket|salami|prosciutto|fish|prawns?|shrimp|lobsters?|crabs?|crab cakes|oysters?|clams?|rib eyes?|ribs?|burgers?|hot dogs?|jerky)\b/i.test(note.text))note=null;
  return {venue:D(fl.venue)||f.title,sign:D(fl.sign),note,num:String(fl.number||f.year),
    prop:{kind:prop.kind||"ticket",title:D(prop.title||f.title),lines:(prop.lines||[]).map(D)},
    style:kitStyle(f,L,fl)||fl.door||((f.theme==="scifi"||f.theme==="galaxy")&&["lab","airline","galley","canteen","precinct"].includes(L.fmt)?"terminal":"")||KIT_SIGN[L.fmt]||KIT_THEME_SIGN[f.theme]||"plaque",dark:pal.dark||st.mi||"#1b1210",acc:pal.accent||st.ma||"#b3261e",
    fmt:L.fmt||"",tropic:L.fmt==="tiki"||/hawai|island|beach|tiki|luau|lagoon|tropic|polynes|paradise|reef|coconut|surf/i.test((fl.venue||"")+" "+(fl.sign||"")),
    saloon:/\bsaloon\b/i.test((fl.venue||"")+" "+(fl.sign||"")),halftime:["pub","tavern","stadium"].includes(L.fmt),
    sweet:w?(w.label||w.n):"",drink:d?(d.label||d.n):"",time,eye:st.eye||"Tonight's feature",
    still:(L.stills||[]).map(x=>Array.isArray(x)?x[0]:x).filter(Boolean),poster:lobbyPoster(f)};
}
const kitMix=(a,b,t)=>{const h=x=>{x=String(x).replace('#','');if(x.length===3)x=x.split('').map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(x.slice(i,i+2),16)||0)};const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v*t+B[i]*(1-t)).toString(16).padStart(2,'0')).join('')};
const KIT_MIX=[["kd", 0.7, "#3a2a2a", "--md703a2a2a"], ["kd", 0.55, "#3b2412", "--md553b2412"], ["ka", 0.7, "#2a1d14", "--ma702a1d14"], ["kd", 0.75, "#000", "--md75000"], ["ka", 0.45, "#000", "--ma45000"], ["kd", 0.8, "#333", "--md80333"], ["ka", 0.6, "#fff", "--ma60fff"], ["ka", 0.4, "#000", "--ma40000"]];
function kitPage(f,kind,b,inner){const el=document.createElement("div");el.className=`kit-page kit-${kind} ks-${b.style}`;el.dataset.w=794;el.dataset.h=1123;el.style.cssText=`width:794px;height:1123px;--kd:${b.dark};--ka:${b.acc};`+KIT_MIX.map(([v,t,c,n])=>`${n}:${kitMix(v==="ka"?b.acc:b.dark,c,t)}`).join(";");el.innerHTML=inner;return el}
function kitProp(b,f,name,i){
  const p=b.prop,N=name?ESC(name):"",fz=name?Math.max(p.kind==="tag"?20:22,Math.min(40,Math.round((p.kind==="tag"?250:300)/Math.max(6,name.length)))):0,line=name?`<b class="kp-name" style="font-size:${fz}px">${N}</b>`:`<span class="kp-blank"></span>`,seat=i+1,row="ABCDEFGHJK"[Math.floor(i/6)%10],ser=String(1000+((parseInt(b.num,10)||7)*37+seat*113)%9000),l0=ESC(p.lines[0]||""),l1=ESC(p.lines[1]||""),T=ESC(p.title),no=ESC(b.num);
  switch(p.kind){
    case "slip":return `<div class="kp kp-slip"><div class="kp-h"><span>${T}</span><span class="kp-red">No. ${ser}</span></div><div class="kp-rows"><span>Table 1</span><span>Guest ${seat}</span><span>${l0}</span></div>${line}<div class="kp-f">${ESC(b.venue)}</div></div>`;
    case "card":
      /* invitations and seating cards are paper, not bank cards: no chip and no member line */
      if(/wedding|invit|seating|rsvp|rehearsal|maid of hono|birthday card|happy \d|reservation/i.test(p.title))return `<div class="kp kp-invite"><div class="kp-h">${T}</div>${line}<div class="kp-f">${l0}</div><div class="kp-r"><span>Table 1</span><span>Seat ${seat}</span></div></div>`;
      {const since=/member|club|vip|heritage|league|ladies|roundup|gourmet/i.test(p.title)?"Member since":/credit|account/i.test(p.title)?"Valid from":"Issued";
      return `<div class="kp kp-card"><div class="kp-h"><span>${T}</span><span class="kp-chip"></span></div><div class="kp-cno">${ser.slice(0,2)}${no.padStart(2,"0").slice(-2)} ${ser} ${String(seat).padStart(4,"0")}</div>${line}<div class="kp-f"><span>${l0}</span><span>${since} ${ESC(String(f.year))}</span></div></div>`}
    case "badge":return `<div class="kp kp-badge"><span class="kp-clip"></span><div class="kp-h">${T}</div><div class="kp-bd">${b.still[0]?`<img class="kp-photo" alt="" src="${TMDB_IMG}w185${ESC(b.still[(seat+1)%b.still.length])}" crossorigin="anonymous">`:""}<div class="kp-who">${line}<small>${l0}</small></div></div><div class="kp-f"><span>ID ${ser}</span><span class="kp-bars"></span></div></div>`;
    case "tag":return `<div class="kp kp-tag"><span class="kp-hole"></span><span class="kp-ring"></span><div class="kp-no">${no}</div><div class="kp-body"><div class="kp-h">${T}</div>${line}<div class="kp-f">${l0}</div></div></div>`;
    case "receipt":return `<div class="kp kp-receipt"><div class="kp-h">${ESC(b.venue)}</div><div class="kp-r"><span>Table 1 · Seat ${seat}</span><span>Chk ${ser}</span></div>${line}<div class="kp-r"><span>${T}</span><span class="kp-paid">Paid</span></div><div class="kp-f">Thank you. Come again.</div></div>`;
    default:return `<div class="kp kp-ticket"><div class="kp-main"><div class="kp-h">${T}</div>${line}<div class="kp-f">${l0}${l1?" · "+l1:""}</div><div class="kp-seat"><span>Row ${row}</span><span>Seat ${seat}</span><span>No. ${ser}</span></div></div><div class="kp-stub"><span>Admit one</span><b>${row}${seat}</b></div></div>`;
  }
}
/* names fit their card: shrink a long name (down to 40%) rather than cut it, then the usual one-line fitting for the rest of the page */
/* a flight code is the number whole, or its first word: never "GEN 1" for "GEN 11" */
const kitFlight=n=>{n=String(n||"").trim();return n.length<=6?n:n.split(/\s+/)[0].slice(0,6)};
function kitFit(page){
  page.querySelectorAll(".kp-name").forEach(e=>{const b=+(e.dataset.fz0||(e.dataset.fz0=parseFloat(getComputedStyle(e).fontSize)||0));if(!b)return;e.style.fontSize=b+"px";e.style.whiteSpace="";e.style.lineHeight="";
    let k=1;for(;k>=.4&&e.scrollWidth>e.clientWidth+1;k-=.04)e.style.fontSize=(b*k).toFixed(1)+"px";
    /* and room for its capitals: the name box has a set height, and a line taller than the box cut the tops and feet off "SAM JORDAN" and "BO" (review 12).
       A one-line name is centred on the box's own height and kept small enough that its capitals clear both edges */
    if(e.style.whiteSpace!=="normal"){const H=e.clientHeight;if(H>8){e.style.lineHeight=H+"px";const cap=Math.max(8,(H-4)/.82);if(parseFloat(e.style.fontSize)>cap)e.style.fontSize=cap.toFixed(1)+"px"}}
    /* a long two-word name reads bigger on two lines than squeezed onto one, if the card has the height for it */
    if(k<.66&&/\s/.test(e.textContent.trim())){const kp=e.closest(".kp");let k2=.7;e.style.whiteSpace="normal";e.style.lineHeight="1";
      const ok=()=>e.scrollWidth<=e.clientWidth+1&&e.offsetHeight<=b*k2*2.2&&(!kp||kp.scrollHeight<=kp.clientHeight+1);
      for(;k2>k&&(e.style.fontSize=(b*k2).toFixed(1)+"px",!ok());k2-=.04);
      if(k2<=k){e.style.whiteSpace="";e.style.lineHeight="";e.style.fontSize=(b*Math.max(k,.4)).toFixed(1)+"px"}}});
  /* departures cells: wrap to two lines at full size first, then shrink, but never under 80% so it reads in print; past that a third line is fine, a cut word never is */
  page.querySelectorAll(".dp-row span").forEach(e=>{const b=+(e.dataset.fz0||(e.dataset.fz0=parseFloat(getComputedStyle(e).fontSize)||0));if(!b)return;e.style.fontSize=b+"px";
    const r=document.createRange(),bad=()=>{r.selectNodeContents(e);return e.scrollWidth>e.clientWidth+1||r.getBoundingClientRect().height>parseFloat(e.style.fontSize)*1.15*2+2};
    for(let k=.96;k>=.8&&bad();k-=.04)e.style.fontSize=(b*k).toFixed(1)+"px"});
  try{fitLines(page)}catch(e){}
}
/* kit pages are measured in the page itself before they are drawn or saved: an offscreen holder, fonts and photos ready, then kitFit */
async function kitReady(pages){const h=document.createElement("div");h.className="kit-hold";h.setAttribute("aria-hidden","true");h.style.cssText="position:fixed;left:-30000px;top:0;width:794px";
  pages.forEach(p=>h.appendChild(p));document.body.appendChild(h);await kitFonts();
  /* a still the browser refuses as a cross-origin load gets one plain retry, so no tent back or photo frame prints empty */
  await Promise.all([...h.querySelectorAll("img")].map(async im=>{await im.decode().catch(()=>{});if(im.naturalWidth)return;
    im.removeAttribute("crossorigin");im.src=im.src.split("?")[0]+"?k=1";await im.decode().catch(()=>{})}));pages.forEach(kitFit);return ()=>h.remove()}
function kitPages(f,names,count){
  const b=kitBits(f),T=ESC(f.title),V=ESC(b.venue),longV=String(b.venue||"").length>18&&String(b.venue||"").length>String(f.title).length,pages=[];
  const doors=b.time?`Doors at ${ESC(b.time)}`:`Doors at <span class="kit-line"></span>`;
  const ph=(i,c)=>b.still[i]?`<img class="${c}" alt="" src="${TMDB_IMG}w780${ESC(b.still[i])}" crossorigin="anonymous">`:"";
  const sign={
    neon:`${b.still[0]?`<img class="kn-photo" alt="" src="${TMDB_IMG}w1280${ESC(b.still[0])}" crossorigin="anonymous">`:""}<div class="kn-wall"><div class="kn-tonight">Tonight</div><div class="kn-name">${V}</div>${b.sign?`<div class="kn-box">${ESC(b.sign)}</div>`:""}<div class="kn-board"><small>Now showing</small><b>${T}</b><span>${doors}</span></div></div>`,
    board:`<div class="kb-wall"><div class="kb-plank">${V}</div>${b.still[0]?`<div class="kb-pol"><img alt="" src="${TMDB_IMG}w780${ESC(b.still[0])}" crossorigin="anonymous"><span>Last night</span></div>`:""}<div class="kb-chalk"><p class="kb-t">Tonight</p><p class="kb-film">${T}</p><p class="kb-d">${doors}</p>${b.sign?`<p class="kb-s">${ESC(b.sign)}</p>`:""}</div></div>`,
    notice:`<div class="kt-sheet"><div class="kt-bar"><span>Notice</span><span>No. ${ESC(b.num)}</span></div><p class="kt-v">${V}</p>${b.sign?`<p class="kt-s">${ESC(b.sign)}</p>`:""}${b.still[0]?`<div class="kt-photo"><span class="kt-clip"></span><img alt="" src="${TMDB_IMG}w780${ESC(b.still[0])}" crossorigin="anonymous"><small>Exhibit A</small></div>`:`<div class="kt-rule"></div>`}<p class="kt-k">Screening tonight</p><p class="kt-film">${T}</p><p class="kt-d">${doors}</p><div class="kt-stamp"><span>Approved</span><b>${ESC(b.num)}</b></div></div>`,
    letterboard:`<div class="kl-wall">${b.still[0]?`<img class="kl-photo" alt="" src="${TMDB_IMG}w1280${ESC(b.still[0])}" crossorigin="anonymous">`:""}<div class="kl-awning">${"<i></i>".repeat(14)}</div><div class="kl-board"><div class="kl-name">${V}</div><div class="kl-rows"><span>Tonight only</span><span>${T}</span><span>${b.time?`Doors ${ESC(b.time)}`:`Doors at <span class="kit-line"></span>`}</span>${b.sign?`<span class="sm">${ESC(b.sign)}</span>`:""}</div></div><div class="kl-open">Open</div></div>`,
    marquee:`<div class="km-wall">${b.still[0]?`<img class="km-photo" alt="" src="${TMDB_IMG}w1280${ESC(b.still[0])}" crossorigin="anonymous">`:""}<div class="km-sign"><div class="km-bulbs">${"<i></i>".repeat(20)}</div><p class="km-v">${V}</p><div class="km-panel"><small>Now showing</small><b>${T}</b><span>${doors}</span></div><div class="km-bulbs">${"<i></i>".repeat(20)}</div></div>${b.sign?`<p class="km-s">${ESC(b.sign)}</p>`:""}</div>`,
    terminal:`<div class="kc-wall"><div class="kc-screen"><p class="kc-l">&gt; ACCESS: ${ESC(b.venue.toUpperCase())}</p><p class="kc-l dim">&gt; NODE ${ESC(b.num)} ONLINE</p>${b.still[0]?`<img class="kc-photo" alt="" src="${TMDB_IMG}w780${ESC(b.still[0])}" crossorigin="anonymous">`:""}<p class="kc-l dim">&gt; LOADING FEATURE...</p><p class="kc-film">${T}</p><p class="kc-l">&gt; ${b.time?`DOORS ${ESC(b.time.toUpperCase())}`:`DOORS AT <span class="kit-line"></span>`}</p>${b.sign?`<p class="kc-l dim">&gt; ${ESC(b.sign.toUpperCase())}</p>`:""}<p class="kc-l"><span class="kc-cur"></span></p></div></div>`,
    camp:`<div class="x-wall cp">${ph(0,"cp-photo")}<div class="cp-post"></div><div class="cp-arrow a1"><span>${V}</span></div><div class="cp-arrow a2 lf"><span>${T}</span></div><div class="cp-arrow a3"><span>${doors}</span></div>${b.sign?`<div class="cp-tag">${ESC(b.sign)}</div>`:""}</div>`,
    kitchen:`<div class="x-wall kt2"><div class="kt2-fridge"><div class="kt2-handle"></div>${b.still[0]?`<div class="kt2-pol"><img alt="" src="${TMDB_IMG}w780${ESC(b.still[0])}" crossorigin="anonymous"><i class="kt2-mag m1"></i></div>`:""}<div class="kt2-card"><i class="kt2-mag m2"></i><div class="kt2-h">Tonight at ${V}</div><p class="kt2-t">${T}</p><p class="kt2-d">${doors}</p>${b.sign?`<p class="kt2-s">${ESC(b.sign)}</p>`:""}</div>${b.note?`<div class="kt2-post"><i class="kt2-mag m3"></i><p>${ESC(b.note.text)}</p><b>${ESC(b.note.by)}</b></div>`:""}</div></div>`,
    tiki:`<div class="x-wall tk">${ph(0,"tk-photo")}<div class="tk-torch l"><i></i></div><div class="tk-torch r"><i></i></div><div class="tk-plank"><span class="tk-k">${b.tropic?"Aloha, welcome to":"Welcome to"}</span><b>${V}</b></div><div class="tk-card"><small>Tonight's feature</small><b>${T}</b><span>${doors}</span>${b.sign?`<em>${ESC(b.sign)}</em>`:""}</div></div>`,
    wanted:`<div class="x-wall wd"><div class="wd-poster"><p class="wd-h">Wanted</p><p class="wd-s">For screening tonight</p>${ph(0,"wd-photo")}<p class="wd-t">${T}</p><div class="wd-rule"></div><p class="wd-r">Reward: supper at ${V}</p><p class="wd-d">${doors}</p>${b.sign?`<p class="wd-f">${ESC(b.sign)}</p>`:""}</div></div>`,
    newspaper:`<div class="x-wall np"><div class="np-paper"><p class="np-mast">The ${V} Gazette</p><div class="np-date"><span>No. ${ESC(b.num)}</span><span>${b.sign?ESC(b.sign):"Late edition"}</span><span>Price: one seat</span></div><p class="np-head">${T} screens tonight</p>${ph(0,"np-photo")}<div class="np-cols"><p><b>${doors}.</b> Guests are asked to arrive hungry and take their seats before the lights go down.</p>${b.note?`<p>${kitSaid(b.note,"said")}</p>`:"<p>Supper will be served throughout the feature.</p>"}</div></div></div>`,
    departures:`<div class="x-wall dp"><div class="dp-board"><div class="dp-h"><span>Departures</span><span>${ESC(b.num)}</span></div><div class="dp-row hd"><span>Flight</span><span>Destination</span><span>Gate</span><span>Time</span></div><div class="dp-row on"><span>${ESC(kitFlight(b.num))}</span><span>${longV?V:T}</span><span>${longV?T:V}</span><span>${b.time?ESC(b.time):"TBA"}</span></div><div class="dp-row"><span>MN 001</span><span>Snacks</span><span>Lounge</span><span>Boarding</span></div><div class="dp-row"><span>MN 002</span><span>Mains</span><span>Lounge</span><span>On time</span></div><div class="dp-row"><span>MN 003</span><span>Dessert</span><span>Lounge</span><span>Mid flight</span></div></div>${ph(0,"dp-photo")}${b.sign?`<p class="dp-s">${ESC(b.sign)}</p>`:""}</div>`,
    roadside:`<div class="x-wall rs">${ph(0,"rs-photo")}<div class="rs-sign"><div class="rs-star"></div><p class="rs-v">${V}</p><div class="rs-arrow"><span>${T}</span></div><p class="rs-vac">Vacancy</p><p class="rs-d">${doors}</p></div>${b.sign?`<p class="rs-s">${ESC(b.sign)}</p>`:""}</div>`,
    comic:`<div class="x-wall cm"><div class="cm-top"><span>${ESC(b.eye)}</span><span>No. ${ESC(b.num)}</span></div><p class="cm-v">${V}</p><div class="cm-panel">${ph(0,"cm-photo")}${b.note?`<div class="cm-bub">${ESC(b.note.text)}</div>`:""}</div><div class="cm-cap"><b>Tonight:</b> ${T}</div><p class="cm-d">${doors}</p><div class="cm-burst">Pow</div></div>`,
    horror:`<div class="x-wall hr">${ph(0,"hr-photo")}<p class="hr-v">${V}</p><p class="hr-k">Now showing</p><p class="hr-t">${T}</p><p class="hr-d">${doors}</p><p class="hr-w">Do not come alone. Do not leave early.</p>${b.sign?`<p class="hr-s">${ESC(b.sign)}</p>`:""}</div>`,
    storybook:`<div class="x-wall sb"><div class="sb-page"><p class="sb-k">Once upon a time, at</p><p class="sb-v">${V}</p>${ph(0,"sb-photo")}<p class="sb-txt"><span class="sb-cap">T</span>onight the tale of <b>${T}</b> will be told, and supper will be served to every guest who comes to listen.</p><p class="sb-d">${doors}</p></div></div>`,
    festive:`<div class="x-wall fs"><div class="fs-card"><p class="fs-k">You are invited to</p><p class="fs-v">${V}</p>${ph(0,"fs-photo")}<p class="fs-t">${T}</p><p class="fs-d">${doors}</p>${b.sign?`<p class="fs-s">${ESC(b.sign)}</p>`:""}<div class="fs-holly"><i></i><i></i><i></i></div></div></div>`,
    arcade:`<div class="x-wall ar"><div class="ar-cab"><p class="ar-k">Player 1 ready</p><p class="ar-v">${V}</p>${ph(0,"ar-photo")}<p class="ar-lv">Level: ${T}</p><p class="ar-d">${b.time?`Start ${ESC(b.time)}`:`Start at <span class="kit-line"></span>`}</p><p class="ar-c">Insert coin</p><div class="ar-score"><span>Hi score</span><span>${ESC(String(b.num).padStart(6,"0"))}</span></div></div></div>`,
    deco:`<div class="x-wall dc"><div class="dc-frame"><div class="dc-fan"></div><p class="dc-k">An evening at</p><p class="dc-v">${V}</p>${ph(0,"dc-photo")}<p class="dc-k">Presenting</p><p class="dc-t">${T}</p><p class="dc-d">${doors}</p>${b.sign?`<p class="dc-s">${ESC(b.sign)}</p>`:""}</div></div>`,
    parchment:`<div class="x-wall pm"><div class="pm-scroll"><p class="pm-k">Be it known to all who enter</p><p class="pm-v">${V}</p>${ph(0,"pm-photo")}<p class="pm-txt">that tonight the tale of</p><p class="pm-t">${T}</p><p class="pm-d">${doors}</p>${b.sign?`<p class="pm-s">${ESC(b.sign)}</p>`:""}<div class="pm-seal">${ESC(String(b.num).slice(0,4))}</div></div></div>`,
    plaque:`<div class="kq-card">${b.still[0]?`<div class="kq-frame"><img alt="" src="${TMDB_IMG}w780${ESC(b.still[0])}" crossorigin="anonymous"></div>`:""}<p class="kq-k">Tonight at</p><p class="kq-v">${V}</p>${b.sign?`<p class="kq-s">${ESC(b.sign)}</p>`:""}<div class="kq-orn"><span></span>&#10022;<span></span></div><p class="kq-k">This evening's picture</p><p class="kq-film">${T}</p><p class="kq-d">${doors}</p></div>`}[b.style];
  pages.push(kitPage(f,"door",b,sign));
  const list=names.length?names.slice():Array.from({length:count},()=>"");while(list.length%6)list.push(null);
  for(let i=0;i<list.length;i+=6){
    const cards=list.slice(i,i+6).map((n,j)=>{if(n===null)n="";const sp=b.still.length?b.still[(i+j+1)%b.still.length]:"";return `<div class="kit-tent"><div class="kit-back">${sp?`<img alt="" src="${TMDB_IMG}w780${ESC(sp)}" crossorigin="anonymous"><i class="kit-shade"></i>`:""}<b>${V}</b><small>${T}</small></div><div class="kit-front">${kitProp(b,f,n,i+j)}</div></div>`}).join("");
    pages.push(kitPage(f,"place",b,`<div class="kit-tents">${cards}</div><p class="kit-cut">Cut around each card, fold along the dotted line, stand it up.</p>`));
  }
  /* review 15: the fridge and comic door signs already carry the film's note, so their intermission card takes the film's own tagline instead (Skyfall printed the same sticky note twice) */
  {const tag2=dietText(f,String(f.T||"")).trim();
   const ph=(i,c)=>{const p=b.still[i]||b.still[0];return p?`<img class="${c}" alt="" src="${TMDB_IMG}w780${ESC(p)}" crossorigin="anonymous">`:""},pol=b.still[1]||b.still[0],note=b.note?`<div class="ki-note"><span class="ki-tape"></span><p>${ESC(b.note.text)}</p><b>${ESC(b.note.by)}</b></div>`:"";
   const menu=`${b.sweet?`<p class="ki-k">Dessert is served</p><p class="ki-dish">${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="ki-k">Top-ups at the bar</p><p class="ki-dish small">${ESC(b.drink)}</p>`:""}`;
   const I={
    neon:`<div class="ki-wall"><p class="ki-big">Intermission</p><p class="ki-film">${T}</p><div class="ki-pin">${pol?`<div class="ki-pol"><img alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous"></div>`:""}${note}</div><div class="ki-menu">${menu}</div><p class="ki-back">Back in fifteen minutes</p></div>`,
    letterboard:`<div class="kil-wall"><div class="kil-board"><div class="kil-h">Intermission</div><div class="kil-rows">${b.sweet?`<span>Dessert</span><span>${ESC(b.sweet)}</span>`:""}${b.drink?`<span>To drink</span><span>${ESC(b.drink)}</span>`:""}<span>Back in 15 min</span></div></div><div class="kil-lower">${b.note?`<div class="kil-slip"><div class="kil-sh"><span>Order</span><span>Table 1</span></div><p>${ESC(b.note.text)}</p><b>${ESC(b.note.by)}</b></div>`:""}${pol?`<img class="kil-photo" alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous">`:""}</div></div>`,
    marquee:`<div class="kim-wall">${pol?`<img class="kim-photo" alt="" src="${TMDB_IMG}w1280${ESC(pol)}" crossorigin="anonymous">`:""}<div class="kim-curtain l"></div><div class="kim-curtain r"></div><div class="kim-slide"><p class="kim-k">Please enjoy a short</p><p class="kim-big">Intermission</p><p class="kim-film">${T}</p><div class="kim-menu">${menu}</div>${b.note?`<p class="kim-q">${kitQ(b.note)} <b>${ESC(b.note.by)}</b></p>`:""}<p class="kim-back">The feature resumes in fifteen minutes</p></div></div>`,
    board:`<div class="kib-wall"><div class="kib-chalk"><p class="kib-h">${b.halftime?"Half time":"Intermission"}</p><p class="kib-film">${T}</p>${b.sweet?`<p class="kib-k">Sweet</p><p class="kib-d">${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="kib-k">Drink</p><p class="kib-d sm">${ESC(b.drink)}</p>`:""}<p class="kib-back">Back in 15</p></div>${pol?`<div class="kb-pol kib-pol"><img alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous"><span>Tonight</span></div>`:""}${note?`<div class="kib-note">${note}</div>`:""}</div>`,
    notice:`<div class="kin-desk"><div class="kin-file"><div class="kin-tab">${T}</div><div class="kin-sheet"><p class="kin-h">Memo</p><div class="kin-to"><span>To: All guests</span><span>Re: Intermission</span><span>Ref: ${ESC(b.num)}</span></div><p class="kin-body">Proceedings will stop for fifteen minutes.${b.sweet?` Dessert, ${ESC(b.sweet)}, will be issued.`:""}${b.drink?` Drinks: ${ESC(b.drink)}.`:""}</p>${b.note?`<p class="kin-sig">${kitQ(b.note)}<b>${ESC(b.note.by)}</b></p>`:""}<div class="kt-stamp kin-stamp"><span>Break</span><b>15</b></div></div>${pol?`<div class="kt-photo kin-photo"><span class="kt-clip"></span><img alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous"><small>Attached</small></div>`:""}</div></div>`,
    camp:`<div class="x-wall cp">${ph(1,"cp-photo")}<div class="cp-post"></div><div class="cp-arrow a1"><span>Intermission</span></div><div class="cp-arrow a2 lf"><span>${b.sweet?ESC(b.sweet):"Marshmallows"}</span></div><div class="cp-arrow a3"><span>Back in 15</span></div>${b.drink?`<div class="cp-tag">To drink: ${ESC(b.drink)}</div>`:""}${note?`<div class="x-note">${note}</div>`:""}</div>`,
    kitchen:`<div class="x-wall kt2"><div class="kt2-fridge"><div class="kt2-handle"></div>${pol?`<div class="kt2-pol"><img alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous"><i class="kt2-mag m1"></i></div>`:""}<div class="kt2-card"><i class="kt2-mag m2"></i><div class="kt2-h">Intermission</div>${b.sweet?`<p class="kt2-k">Dessert</p><p class="kt2-t sm">${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="kt2-k">Drinks</p><p class="kt2-t sm">${ESC(b.drink)}</p>`:""}<p class="kt2-d">${T} back in 15</p></div>${tag2?`<div class="kt2-post"><i class="kt2-mag m3"></i><p>${ESC(tag2)}</p><b>On the fridge</b></div>`:""}</div></div>`,
    tiki:`<div class="x-wall tk">${ph(1,"tk-photo")}<div class="tk-torch l"><i></i></div><div class="tk-torch r"><i></i></div><div class="tk-plank"><span class="tk-k">${T}</span><b>${b.tropic?"Luau break":"Intermission"}</b></div><div class="tk-card">${menu}<p class="tk-back">Back in fifteen minutes</p></div>${note?`<div class="x-note">${note}</div>`:""}</div>`,
    wanted:`<div class="x-wall wd"><div class="wd-poster"><p class="wd-h sm">Notice</p><p class="wd-s">${b.saloon?"The saloon will close for fifteen minutes":"Supper stops for fifteen minutes"}</p>${ph(1,"wd-photo")}${b.sweet?`<p class="wd-s">Bill of fare</p><p class="wd-t sm">${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="wd-r">${ESC(b.drink)}</p>`:""}${b.note?`<p class="wd-f">${kitQ(b.note)} ${ESC(b.note.by)}</p>`:""}</div></div>`,
    newspaper:`<div class="x-wall np"><div class="np-paper"><p class="np-mast">The ${V} Gazette</p><div class="np-date"><span>Extra</span><span>Intermission edition</span><span>No. ${ESC(b.num)}</span></div><p class="np-head">Fifteen minute break declared</p>${ph(1,"np-photo")}<div class="np-cols"><p>${b.sweet?`<b>Dessert:</b> ${ESC(b.sweet)}. `:""}${b.drink?`<b>Bar:</b> ${ESC(b.drink)}.`:""}</p>${b.note?`<p>${kitSaid(b.note,"told this paper")}</p>`:`<p>${T} resumes shortly.</p>`}</div></div></div>`,
    departures:`<div class="x-wall dp"><div class="dp-board"><div class="dp-h"><span>Arrivals</span><span>Intermission</span></div><div class="dp-row hd"><span>Flight</span><span>Item</span><span>Gate</span><span>Status</span></div><div class="dp-row on"><span>${ESC(kitFlight(b.num))}</span><span>${T}</span><span>Screen</span><span>Delayed 15</span></div>${b.sweet?`<div class="dp-row"><span>MN 003</span><span>${ESC(b.sweet)}</span><span>Lounge</span><span>Now</span></div>`:""}${b.drink?`<div class="dp-row"><span>MN 004</span><span>${ESC(b.drink)}</span><span>Bar</span><span>Now</span></div>`:""}</div>${ph(1,"dp-photo")}${note?`<div class="x-note">${note}</div>`:""}</div>`,
    roadside:`<div class="x-wall rs">${ph(1,"rs-photo")}<div class="rs-sign"><div class="rs-star"></div><p class="rs-v">Intermission</p><div class="rs-arrow"><span>${b.sweet?ESC(b.sweet):"Snacks inside"}</span></div><p class="rs-vac">No vacancy</p><p class="rs-d">Back in 15</p></div>${b.drink?`<p class="rs-s">To drink: ${ESC(b.drink)}</p>`:""}${note?`<div class="x-note">${note}</div>`:""}</div>`,
    comic:`<div class="x-wall cm"><div class="cm-top"><span>Meanwhile</span><span>No. ${ESC(b.num)}</span></div><p class="cm-v">Intermission</p><div class="cm-panel">${ph(1,"cm-photo")}${tag2?`<div class="cm-bub">${ESC(tag2)}</div>`:""}</div><div class="cm-cap">${b.sweet?`<b>Dessert:</b> ${ESC(b.sweet)}`:""}${b.drink?`<br><b>Drinks:</b> ${ESC(b.drink)}`:""}</div><p class="cm-d">${T} continues in 15</p><div class="cm-burst">Snack</div></div>`,
    horror:`<div class="x-wall hr">${ph(1,"hr-photo")}<p class="hr-v">Intermission</p><p class="hr-k">${T}</p><div class="hr-menu">${menu}</div><p class="hr-w">Lights back down in fifteen minutes. Don't wander off.</p>${note?`<div class="x-note">${note}</div>`:""}</div>`,
    storybook:`<div class="x-wall sb"><div class="sb-page"><p class="sb-k">Chapter the second</p><p class="sb-v">Intermission</p>${ph(1,"sb-photo")}<p class="sb-txt"><span class="sb-cap">A</span>nd so everyone paused for ${b.sweet?`<b>${ESC(b.sweet)}</b>`:"something sweet"}${b.drink?` and a cup of <b>${ESC(b.drink)}</b>`:""}, before the tale of ${T} went on.</p>${b.note?`<p class="sb-q">${kitSaid(b.note,"said")}</p>`:""}</div></div>`,
    festive:`<div class="x-wall fs"><div class="fs-card"><p class="fs-k">Pause for pudding</p><p class="fs-v">Intermission</p>${ph(1,"fs-photo")}<div class="fs-menu">${menu}</div>${b.note?`<p class="fs-s">"${ESC(b.note.text)}" ${ESC(b.note.by)}</p>`:""}<div class="fs-holly"><i></i><i></i><i></i></div></div></div>`,
    arcade:`<div class="x-wall ar"><div class="ar-cab"><p class="ar-k">Paused</p><p class="ar-v">Intermission</p>${ph(1,"ar-photo")}${b.sweet?`<p class="ar-lv">Power up: ${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="ar-lv">Refill: ${ESC(b.drink)}</p>`:""}<p class="ar-c">Continue? 15</p></div></div>`,
    deco:`<div class="x-wall dc"><div class="dc-frame"><div class="dc-fan"></div><p class="dc-k">A short</p><p class="dc-v">Interval</p>${ph(1,"dc-photo")}<div class="dc-menu">${menu}</div>${b.note?`<p class="dc-s">"${ESC(b.note.text)}" ${ESC(b.note.by)}</p>`:""}<p class="dc-d">${T} resumes shortly</p></div></div>`,
    parchment:`<div class="x-wall pm"><div class="pm-scroll"><p class="pm-k">Let it be recorded</p><p class="pm-v">A respite</p>${ph(1,"pm-photo")}${b.sweet?`<p class="pm-txt">The feast of</p><p class="pm-t sm">${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="pm-txt">and to drink, ${ESC(b.drink)}</p>`:""}${b.note?`<p class="pm-s">"${ESC(b.note.text)}" ${ESC(b.note.by)}</p>`:""}<div class="pm-seal">15</div></div></div>`,
    plaque:`<div class="kiq-wall"><div class="kq-card kiq-card">${pol?`<div class="kq-frame"><img alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous"></div>`:""}<p class="kq-k">An interval</p><p class="kq-film">Intermission</p><div class="kq-orn"><span></span>&#10022;<span></span></div>${b.sweet?`<p class="kq-k">Dessert</p><p class="kiq-d">${ESC(b.sweet)}</p>`:""}${b.drink?`<p class="kq-k">From the bar</p><p class="kiq-d sm">${ESC(b.drink)}</p>`:""}${b.note?`<p class="kiq-n">"${ESC(b.note.text)}"<b>${ESC(b.note.by)}</b></p>`:""}<p class="kq-d">${T} resumes shortly</p></div></div>`,
    terminal:`<div class="kc-wall"><div class="kc-screen"><p class="kc-l">&gt; PAUSE</p><p class="kc-film">INTERMISSION</p><p class="kc-l dim">&gt; ${T.toUpperCase()} SUSPENDED 15:00</p>${pol?`<img class="kc-photo" alt="" src="${TMDB_IMG}w780${ESC(pol)}" crossorigin="anonymous">`:""}${b.sweet?`<p class="kc-l">&gt; RATION: ${ESC(b.sweet.toUpperCase())}</p>`:""}${b.drink?`<p class="kc-l">&gt; FLUIDS: ${ESC(b.drink.toUpperCase())}</p>`:""}${b.note?`<p class="kc-l dim">&gt; MSG FROM ${ESC(b.note.by.toUpperCase())}: ${ESC(b.note.text)}</p>`:""}<p class="kc-l"><span class="kc-cur"></span></p></div></div>`};
   pages.push(kitPage(f,"inter",b,I[b.style]||I.neon))}
  try{if(dryNow(f))pages.forEach(p=>kidsDryDom(p,f))}catch(e){}
  return pages;
}
function openKit(){
  const f=current;if(!f||document.body.classList.contains("staged"))return;
  let names=[];const count=()=>names.length||Math.min(60,PLAN.guests||USUAL||4);
  const o=document.createElement("dialog");o.className="counter kit";o.setAttribute("aria-label","Table kit: "+f.title);
  o.innerHTML=`<div class="kit-box"><p class="rate-k">Table kit</p><h3>${ESC(f.title)}</h3><p class="kit-say">A door sign, place cards and an intermission card, made like they came from the film. All A4.</p>
   <div class="kit-thumbs" aria-hidden="true"></div>
   <label class="kit-names">Guest names for the place cards <small>(one per line, or leave blank to write them in)</small><textarea rows="4" placeholder="Sam&#10;Jordan&#10;Alex"></textarea></label>
   <p class="kit-msg" role="status"></p>
   <div class="acts"><button type="button" class="go" data-a="pdf">Save PDF</button><button type="button" data-a="print">Print</button></div></div>`;
  const thumbs=o.querySelector(".kit-thumbs"),msg=o.querySelector(".kit-msg");
  const draw=()=>{thumbs.innerHTML="";const pg=kitPages(f,names,count());pg.forEach(p=>{const w=document.createElement("div");w.className="kit-thumb";p.style.transform="scale(.16)";p.style.transformOrigin="0 0";w.appendChild(p);thumbs.appendChild(w)});pg.forEach(kitFit);const cards=Math.ceil(count()/6)*6,spare=cards-names.length;msg.textContent=`${pg.length} pages: the door sign, ${cards} place cards${!names.length?" to write names on,":spare?`, ${spare} left blank to write in,`:""} and the intermission card.`};
  o.querySelector("textarea").addEventListener("input",e=>{names=e.target.value.split("\n").map(x=>x.trim()).filter(Boolean).slice(0,60);draw()});
  /* Save PDF and Print both build the same finished PDF; Print sends it to the printer like the menus do, so no browser adds edges or prints before the photos load */
  o.addEventListener("click",async e=>{if(e.target===o)return dismissModal(o);const b=e.target.closest("[data-a]");if(!b||b.disabled)return;const toPrint=b.dataset.a==="print";
    let win=null;if(toPrint&&coarse()){try{win=window.open("","_blank");if(win)win.document.write('<title>Getting your table kit ready</title><body style="font:18px system-ui;padding:40px;color:#333;background:#fff">Getting your table kit ready to print...</body>')}catch(x){win=null}}
    const btns=[...o.querySelectorAll("[data-a]")],t=b.textContent;btns.forEach(x=>x.disabled=true);b.textContent=toPrint?"Getting it ready...":"Making your PDF...";
    const pages=kitPages(f,names,count()),done=await kitReady(pages);
    try{if(!await loadExportTools(true))throw new Error("tools");const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:"mm",format:"a4",orientation:"portrait"});
      for(let i=0;i<pages.length;i++){msg.textContent=`Making your PDF: page ${i+1} of ${pages.length}`;const cv=await renderCanvas(pages[i],true);if(i)pdf.addPage("a4","portrait");pdf.addImage(cv.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297)}
      /* actual size, one-sided: place cards are cut out, so nothing prints on the back */
      try{pdf.viewerPreferences({PrintScaling:"None",Duplex:"Simplex"})}catch(x){}
      const data=pdf.output("blob"),filename=`${slug(f.title)}-${f.year}-table-kit.pdf`;
      if(toPrint){printPdf(data,win);msg.textContent="Table kit ready to print. Print at A4, actual size."}
      else{if(downloads)await downloads.save({filename,data});else plainDownload(data,filename);msg.textContent=`Saved ${filename}. Print it at A4, actual size.`}}
    catch(err){try{win&&win.close()}catch(x){}msg.textContent="Couldn't make the PDF. Check your connection and try again."}
    finally{done();btns.forEach(x=>x.disabled=false);b.textContent=t}});
  mountModal(o,"textarea",document.activeElement);kitFonts().then(draw);
}

/* rate the night: popcorns out of five, kept per film with the date, shown on the stubs and on the stub wall */
var RATES={};try{RATES=JSON.parse(localStorage.getItem("mns-rates")||"{}")||{}}catch(e){RATES={}}
const ratesSave=()=>{try{localStorage.setItem("mns-rates",JSON.stringify(RATES))}catch(e){}try{queueSync()}catch(e){}};
const POP_WORDS=["","Not for us","It was fine","Good night","Great night","One for the ages"];
const popSVG=on=>`<svg class="pc${on?" on":""}" viewBox="0 0 24 24" aria-hidden="true"><path class="pc-top" d="M5 10.5c-1.6-.4-2.2-2.6-.8-3.6.2-1.8 2.3-2.6 3.6-1.5.8-1.6 3.2-1.7 4.1-.2 1-1.4 3.3-1.2 4 .4 1.5-.9 3.5.3 3.2 2 1.3 1 .8 3-.8 3.1z"/><path class="pc-tub" d="M4.6 10h14.8l-1.9 11.2H6.5z"/><path class="pc-str" d="M8.4 10.4l.9 10.6M12 10.4v10.6M15.6 10.4l-.9 10.6"/></svg>`;
const popRow=n=>`<span class="pops" aria-label="${n} out of 5 popcorns">${[1,2,3,4,5].map(i=>popSVG(i<=n)).join("")}</span>`;
const nightDate=iso=>{const d=new Date(iso+"T12:00:00");if(isNaN(d))return String(iso||"");const D=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return `${D[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]}${d.getFullYear()!==new Date().getFullYear()?" "+d.getFullYear():""}`};
const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
function openRate(f){
  if(!f)return;const was=RATES[f.id];let pick=was?was.s:0;
  const o=document.createElement("dialog");o.className="counter rate";o.setAttribute("aria-label","Rate the night: "+f.title);
  o.innerHTML=`<div class="rate-box"><p class="rate-k">Rate the night</p><h3>${ESC(f.title)}</h3><p class="rate-q">How did it go? Score it out of five popcorns.</p>
   <div class="rate-pops" role="radiogroup" aria-label="Popcorns">${[1,2,3,4,5].map(i=>`<button type="button" role="radio" aria-checked="${i===pick}" aria-label="${i} popcorn${i>1?"s":""}: ${POP_WORDS[i]}" data-n="${i}">${popSVG(i<=pick)}</button>`).join("")}</div>
   <p class="rate-word" aria-live="polite">${pick?POP_WORDS[pick]:"&nbsp;"}</p>
   <div class="acts"><button type="button" class="go" data-a="save"${pick?"":" disabled"}>Stick it on the wall</button><button type="button" data-a="skip">Not now</button></div></div>`;
  const paint=n=>{o.querySelectorAll(".rate-pops button").forEach(b=>{const k=+b.dataset.n;b.querySelector(".pc").classList.toggle("on",k<=n);b.setAttribute("aria-checked",k===pick)});o.querySelector(".rate-word").textContent=n?POP_WORDS[n]:" "};
  o.addEventListener("click",e=>{if(e.target===o)return dismissModal(o);const b=e.target.closest("button");if(!b)return;
    if(b.dataset.n){pick=+b.dataset.n;paint(pick);o.querySelector("[data-a=save]").disabled=false;try{sfx.pop()}catch(x){}return}
    if(b.dataset.a==="skip")return dismissModal(o);
    if(b.dataset.a==="save"&&pick){RATES[f.id]={s:pick,d:(was&&was.d)||todayISO(),t:Date.now()};ratesSave();renderHist();dismissModal(o);$("status").textContent=`${pick} popcorn${pick>1?"s":""} for ${f.title}. It's on your stub wall.`}});
  o.querySelectorAll(".rate-pops button").forEach(b=>{b.addEventListener("mouseenter",()=>paint(+b.dataset.n));b.addEventListener("mouseleave",()=>paint(pick))});
  mountModal(o,pick?"[data-a=save]":".rate-pops button",document.activeElement);
}
function openWall(){
  const items=Object.entries(RATES).map(([id,r])=>({f:FILMS.find(x=>x.id===id),r})).filter(x=>x.f).sort((a,b)=>(b.r.d||"").localeCompare(a.r.d||"")||(b.r.t||0)-(a.r.t||0));
  const avg=items.length?(items.reduce((a,x)=>a+x.r.s,0)/items.length):0;
  const o=document.createElement("dialog");o.className="counter wall";o.setAttribute("aria-label","Your stub wall");
  o.innerHTML=`<div class="wall-box"><h3>The stub wall</h3><p class="wall-sum">${items.length?`${items.length} night${items.length>1?"s":""} rated. Average ${avg.toFixed(1)} popcorns.`:"No nights rated yet. Mark a film as watched to score it."}</p>
   <div class="wall-grid">${items.map((x,i)=>`<button type="button" class="wstub" data-i="${i}" style="--tilt:${((i*37)%7-3)*.6}deg"><small>Admit one</small><span class="wd">${ESC(nightDate(x.r.d))}</span><b>${ESC(x.f.title)}</b><span class="wy">${ESC(x.f.year)}</span>${popRow(x.r.s)}</button>`).join("")}</div></div>`;
  o.addEventListener("click",e=>{if(e.target===o)return dismissModal(o);const b=e.target.closest(".wstub");if(!b)return;const f=items[+b.dataset.i].f;dismissModal(o);openFilm(f)});
  mountModal(o,".wstub",document.activeElement);
}
renderHist();

/* saved menus: a heart on the menu, a shelf on the front, and the menu kept for offline */
var FAV=[];try{FAV=JSON.parse(localStorage.getItem("mns-fav")||"[]").filter(id=>FILMS.some(f=>f.id===id))}catch(e){FAV=[]}
const favSave=()=>{try{localStorage.setItem("mns-fav",JSON.stringify(FAV))}catch(e){}try{queueSync()}catch(e){}};
function renderFav(){const shelf=$("savedShelf"),box=$("savedChips");const items=FAV.map(id=>FILMS.find(f=>f.id===id)).filter(Boolean);shelf.hidden=!items.length;box.innerHTML="";
  items.forEach(f=>{const b=document.createElement("button");b.className="ticket saved";b.type="button";b.innerHTML=`<small>Saved</small>${ESC(f.title)}`;b.addEventListener("click",()=>openFilm(f));box.appendChild(b)});updateFav()}
function updateFav(){const b=$("favBtn");if(!b)return;const on=!!(current&&FAV.includes(current.id));b.setAttribute("aria-pressed",on);b.textContent=on?"Saved to favourites":"Save to favourites"}
$("favBtn").addEventListener("click",()=>{if(!current)return;const id=current.id;
  if(FAV.includes(id)){FAV=FAV.filter(x=>x!==id);$("status").textContent="Taken off your saved menus."}
  else{FAV=[id,...FAV].slice(0,30);$("status").textContent="Saved. It's under Your saved menus, below the wheel, and kept on this device for offline.";try{fetch(filmFile(current)).catch(()=>{})}catch(e){}}
  favSave();renderFav()});

/* settings drawer */
function setSync(){$("setGuests").textContent=USUAL;$("setVeg").checked=DIET.veg;$("setAf").checked=DIET.af||kidsMode;$("setAf").disabled=kidsMode;
  $("histClear").hidden=!hist.length}
function refreshPlan(){try{if(current&&current._r2){planWire(current);prep.innerHTML=prepHTML(current,current.menu);const h=prep.hidden;prep.hidden=false;fitPrep(prep);prep.hidden=h;phoneRefresh()}}catch(e){}}
$("setBtn").addEventListener("click",()=>{setSync();const o=$("settings");mountModal(o,"#setClose",$("setBtn"));if(!o.open)o.showModal()});
$("setClose").addEventListener("click",()=>dismissModal($("settings")));
/* request a movie: saved to the Reel Dinner Supabase project (table movie_requests, send only, nobody can read it with this key), sent without leaving the page */
const REQ_URL="https://zpcgxupmclkxbzikdnfb.supabase.co/rest/v1/movie_requests",REQ_KEY="sb_publishable_xKYQtgzsYWRLh843SrO9bQ_CfWc30ME";
(()=>{
  const dlg=$("reqMovie"),form=$("reqForm"),thanks=$("reqThanks"),err=$("reqErr"),go=$("reqGo");
  if(!dlg||!form)return;
  const showErr=t=>{err.textContent=t;err.hidden=!t};
  const open=trigger=>{form.reset();form.hidden=false;thanks.hidden=true;showErr("");go.disabled=false;go.textContent="Send request";mountModal(dlg,"#reqTitle",trigger);if(!dlg.open)dlg.showModal();netMarks()};
  document.querySelectorAll("[data-req]").forEach(b=>b.addEventListener("click",()=>open(b)));
  $("reqClose").addEventListener("click",()=>dismissModal(dlg));
  $("reqDone").addEventListener("click",()=>dismissModal(dlg));
  dlg.addEventListener("click",e=>{if(e.target===dlg)dismissModal(dlg)});
  const done=()=>{form.hidden=true;thanks.hidden=false;$("reqDone").focus({preventScroll:true})};
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    if(form.elements["bot-field"].value){done();return}
    if(navigator.onLine===false){netMarks();return}
    go.disabled=true;go.textContent="Sending";showErr("");
    try{
      /* site and app both send straight to Supabase, which allows any origin */
      const v=k=>(form.elements[k].value||"").trim()||null;
      const res=await fetch(REQ_URL,{method:"POST",headers:{"apikey":REQ_KEY,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({title:v("title"),year:+form.elements.year.value,name:v("name"),note:v("note"),source:globalThis.REEL_APP?"app":"site"})});
      if(!res.ok)throw new Error(res.status);
      done();
    }catch(x){go.disabled=false;go.textContent="Send request";showErr("That did not send. Check your connection and try again.")}
  });
})();
$("settings").addEventListener("click",e=>{if(e.target===$("settings"))dismissModal($("settings"))});
$("settings").querySelectorAll("[data-sg]").forEach(b=>b.addEventListener("click",()=>{USUAL=Math.min(60,Math.max(1,USUAL+(b.dataset.sg==="+"?1:-1)));try{localStorage.setItem("mns-guests",USUAL)}catch(e){}setSync();$("setMsg").textContent=`New prep sheets start at ${USUAL} guest${USUAL===1?"":"s"}.`}));
/* the menu on screen follows the diet straight away, not only the next film opened */
function dietRedraw(dk){refreshPlan();if(!current||document.body.classList.contains("staged"))return;const t=tab,y=scrollY,open=!!document.querySelector("#planner .pl-pick[open]");
  return show(current,true).then(()=>{if(t==="prep")setTab("prep");scrollTo(0,y);
    /* from the Prep sheet switch: keep the dish list open and focus on the switch that was flipped */
    if(dk){const pb=$("planner"),o=pb&&pb.querySelector(".pl-pick");if(o&&open)o.open=true;const c=pb&&pb.querySelector(`[data-diet="${dk}"]`);if(c)c.focus({preventScroll:true})}}).catch(()=>{})}
$("setVeg").addEventListener("change",e=>{DIET.veg=e.target.checked;dietSave();dietRedraw()});
$("setAf").addEventListener("change",e=>{DIET.af=e.target.checked;dietSave();dietRedraw()});
function clearStubs(){hist=[];try{localStorage.setItem("mns-hist","[]")}catch(e){}renderHist();setSync();try{queueSync()}catch(e){}}
$("histClear").addEventListener("click",()=>{clearStubs();$("status").textContent="Ticket stubs cleared."});
$("wallBtn").addEventListener("click",openWall);
$("setClearStubs").addEventListener("click",()=>{clearStubs();$("setMsg").textContent="Ticket stubs cleared."});
$("setClearSaved").addEventListener("click",()=>{FAV=[];favSave();renderFav();$("setMsg").textContent="Saved menus cleared."});
{let armed=0;$("setReset").addEventListener("click",()=>{const b=$("setReset");
  if(!armed){armed=setTimeout(()=>{armed=0;b.classList.remove("arm");b.textContent="Reset everything"},5000);b.classList.add("arm");b.textContent=tapWord("Tap again to reset");$("setMsg").textContent="This clears everything saved on this device. Tap again to confirm.";return}
  clearTimeout(armed);try{Object.keys(localStorage).filter(k=>k.startsWith("mns-")&&k!=="mns-welcome").forEach(k=>localStorage.removeItem(k))}catch(e){}
  location.replace(location.pathname)})}
renderFav();setSync();


/* video store on phone: keep the pinned search below the top bar, fold the filters, and show how many are on */
{const top=document.querySelector("header.top"),setH=()=>{if(top)document.documentElement.style.setProperty("--topH",top.offsetHeight+"px")};
 setH();addEventListener("resize",setH);if(window.ResizeObserver&&top)new ResizeObserver(setH).observe(top);
 const filt=$("shopFilt"),n=$("shopFiltN");
 if(filt){if(matchMedia("(max-width:700px)").matches)filt.open=false;
  const count=()=>{const k=[$("shopDecade").value,$("shopSvc").value,$("shopUnwatched").checked,$("shopKids").checked].filter(Boolean).length;n.textContent=k?String(k):""};
  ["shopDecade","shopSvc","shopUnwatched","shopKids"].forEach(id=>{const el=$(id);if(el)el.addEventListener("change",count)});count();
  document.addEventListener("click",e=>{if(filt.open&&matchMedia("(max-width:700px)").matches&&!filt.contains(e.target))filt.open=false});
  addEventListener("resize",()=>{if(!matchMedia("(max-width:700px)").matches)filt.open=true})}}
/* video store on phone: after a search or filter change, bring the results up under the pinned search */
{const narrow2=()=>matchMedia("(max-width:700px)").matches,tools=document.querySelector("#viewShop .shop-tools"),cnt=$("shopCount");
 const toResults=()=>{if(!narrow2()||!tools||!cnt)return;const off=8+tools.offsetHeight+8,y=cnt.getBoundingClientRect().top;if(y<off||y>innerHeight*.6)scrollTo({top:scrollY+y-off,behavior:"smooth"})};
 let t=0;const later=()=>{clearTimeout(t);t=setTimeout(toResults,250)};
 const s=$("shopSearch");if(s)s.addEventListener("input",later);
 ["shopDecade","shopSvc","shopUnwatched","shopKids"].forEach(id=>{const el=$(id);if(el)el.addEventListener("change",later)})}

/* series: where a film sits in its run, a one-tap swap to the first film, and a marathon menu for the whole run */
var _seriesBy=null;function seriesOf(id){if(!_seriesBy){_seriesBy={};(window.SERIES||[]).forEach(sr=>sr.release.forEach(x=>{_seriesBy[x]=sr}))}return _seriesBy[id]}
function seriesOrderPref(){try{return localStorage.getItem("mns-series-order")==="story"?"story":"release"}catch(e){return "release"}}
function seriesList(sr,ord){return (ord==="story"&&sr.story?sr.story:sr.release).map(id=>FILMS.find(f=>f.id===id)).filter(Boolean)}
function seriesNote(f){
  const box=$("seriesNote");if(!box)return;const sr=f&&seriesOf(f.id);
  if(!sr){box.hidden=true;box.innerHTML="";return}
  const ord=seriesOrderPref(),films=seriesList(sr,ord),i=films.findIndex(x=>x.id===f.id),first=films[0];
  const how=sr.story?` in ${ord==="story"?"story":"release"} order`:"";
  box.innerHTML=`<p>Film <b>${i+1} of the ${films.length}</b> ${ESC(sr.name)} films on the wheel${how}.</p>${i>0?`<button type="button" class="go" data-sr="first">Start with ${ESC(first.title)}</button>`:""}<button type="button" data-sr="run">Plan a marathon</button>`;
  box.hidden=false;
  box.onclick=e=>{const k=e.target.closest("[data-sr]");if(!k)return;
    if(k.dataset.sr==="first"){replay(first);addHistory(first);toMenu()}
    if(k.dataset.sr==="run")openMarathon(sr)};
}
async function marathonMenu(films,G){
  G=G||USUAL;
  await Promise.all(films.map(ensureExact));
  const M=films.map(f=>makeMenu(f,true)),pickIt=(menu,it,film)=>Object.assign({},it,{film:film.title,_f:film,shop:itemShop(menu,it)});
  const one=(k,i)=>M[i]&&M[i][k]&&M[i][k][0]?pickIt(M[i],M[i][k][0],films[i]):null;
  const last=films.length-1,mid=Math.floor(last/2);
  const m={s:films.map((f,i)=>one("s",i)).filter(Boolean),
    m:[one("m",0),films.length>=4?one("m",last):null].filter(Boolean),
    w:[one("w",mid)||one("w",last)||one("w",0)].filter(Boolean),
    d:films.map((f,i)=>one("d",i)).filter(Boolean)};
  m.counter=[...new Set(films.flatMap(f=>counterShop(f.id)))];
  m.serves=G;m.shopping=pickedShop(m,G);
  return m;
}
function openMarathon(sr){
  const modalTrigger=document.activeElement;
  let ord=seriesOrderPref(),off=new Set();
  const o=document.createElement("dialog");o.className="trolley";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",sr.name+" marathon");
  let films=[],menu=null,G=USUAL;
  const li=it=>`<li>${ESC(it.n)} <small>(${ESC(it.film)})</small></li>`;
  const draw=async()=>{
    const all=seriesList(sr,ord);films=all.filter(f=>!off.has(f.id));
    menu=films.length?await marathonMenu(films,G):{s:[],m:[],w:[],d:[],counter:[]};
    const n=films.length,mains=menu.m.length>1?"mains from the first and last film":"the main from the first film";
    o.innerHTML=`<div class="df"><h3>${ESC(sr.name)} marathon</h3>
    ${sr.story?`<div class="mr-order" role="group" aria-label="Watch order"><button type="button" data-o="release" aria-pressed="${ord==="release"}">Release order</button><button type="button" data-o="story" aria-pressed="${ord==="story"}">Story order</button></div>`:""}
    <ol class="mr-films">${all.map((f,i)=>`<li><label><input type="checkbox" data-f="${ESC(f.id)}"${off.has(f.id)?"":" checked"}><span class="n">${i+1}</span>${ESC(f.title)} (${f.year})</label></li>`).join("")}</ol>
    ${n?`<p class="msg">One menu for ${n} film${n===1?"":"s"}. A snack and a drink from each film, ${mains}, and dessert at the halfway break.</p><div class="df-g"><span>Guests</span><button type="button" data-a="g-" aria-label="Fewer guests">-</button><output aria-live="polite">${G}</output><button type="button" data-a="g+" aria-label="More guests">+</button></div>
    <h4>Snacks</h4><ul>${menu.s.map(li).join("")}</ul><h4>${menu.m.length>1?"Mains":"Main"}</h4><ul>${menu.m.map(li).join("")}</ul><h4>Halfway dessert</h4><ul>${menu.w.map(li).join("")}</ul><h4>To drink</h4><ul>${menu.d.map(li).join("")}</ul>`:`<p class="msg">Tick at least one film.</p>`}
    <div class="acts">${n?`<button type="button" class="go" data-a="first">Start with ${ESC(films[0].title)}</button><button type="button" data-a="shop">Shopping list</button>`:""}<button type="button" data-a="done">Done</button></div></div>`;
  };
  const close=()=>dismissModal(o);
  o.addEventListener("click",async e=>{
    if(e.target===o)return close();
    const ob=e.target.closest("[data-o]");if(ob){ord=ob.dataset.o;try{localStorage.setItem("mns-series-order",ord)}catch(err){}await draw();if(current)seriesNote(current);o.querySelector(`[data-o="${ord}"]`).focus();return}
    const k=e.target.dataset&&e.target.dataset.a;if(!k)return;
    if(k==="g-"||k==="g+"){G=Math.min(60,Math.max(1,G+(k==="g+"?1:-1)));await draw();const b=o.querySelector(`[data-a="${k}"]`);if(b)b.focus();return}
    if(k==="done")close();
    if(k==="first"&&films[0]){const f=films[0];close();setView("wheel");replay(f);addHistory(f);toMenu()}
    if(k==="shop"&&films[0])openTrolley(films[0],menu,sr.name+" marathon");
  });
  o.addEventListener("change",async e=>{const id=e.target.dataset&&e.target.dataset.f;if(!id)return;e.target.checked?off.delete(id):off.add(id);await draw();const b=o.querySelector(`[data-f="${CSS.escape(id)}"]`);if(b)b.focus()});
  draw().then(()=>{mountModal(o,".go",modalTrigger);buzz([20,40,20])});
}
/* tabs: arrow keys, Home and End move between tabs, as a tab list should */
document.addEventListener("keydown",e=>{
  const t=e.target.closest&&e.target.closest('[role="tab"]');if(!t)return;const list=t.closest('[role="tablist"]');if(!list)return;
  const tabs=[...list.querySelectorAll('[role="tab"]')].filter(x=>!x.hidden&&!x.disabled),i=tabs.indexOf(t);let j=-1;
  if(e.key==="ArrowRight"||e.key==="ArrowDown")j=(i+1)%tabs.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=(i-1+tabs.length)%tabs.length;else if(e.key==="Home")j=0;else if(e.key==="End")j=tabs.length-1;
  if(j<0)return;e.preventDefault();tabs[j].focus();tabs[j].click();
});

/* prep sheet shopping list: tick items off on screen, saved per film on this device; save, PDF and print stay blank */
function tickKey(x){return String(x).toLowerCase().replace(/^[\d\s\/.+]+(kg|g|ml|l|tsp|tbsp|cups?|bunch(es)?|pinch)?\b\s*/,"").replace(/\s+/g," ").trim()}
var _tickCache={};function prepTicks(f){let t=null;try{t=JSON.parse(localStorage.getItem("mns-ticks-"+f.id)||"null")}catch(e){}if(t)_tickCache[f.id]=t;return Object.assign({},_tickCache[f.id]||{})}
/* one set of ticks per film, keyed by the ingredient (not the amount, so changing guests keeps them), shared by the prep sheet and the Lock it in list.
   A locked-in film also keeps them in the week plan so the member card syncs them; each change touches only its own item there. */
function sharedTicks(f){const t=prepTicks(f);if(week&&week.id===f.id&&week.ticks)for(const k in week.ticks)if(week.ticks[k])t[tickKey(k)]=true;return t}
function setTick(f,k,on,quiet){const t=prepTicks(f);if(on)t[k]=true;else delete t[k];_tickCache[f.id]=Object.assign({},t);try{Object.keys(t).length?localStorage.setItem("mns-ticks-"+f.id,JSON.stringify(t)):localStorage.removeItem("mns-ticks-"+f.id)}catch(e){}
  if(week&&week.id===f.id){const w=week.ticks||(week.ticks={});for(const x in w)if(x!==k&&tickKey(x)===k)delete w[x];if(on)w[k]=true;else delete w[k];if(!quiet)saveWeek()}
  /* keep the prep sheet on screen in step */
  if(typeof prep!=="undefined"&&typeof current!=="undefined"&&current===f)prep.querySelectorAll("li[data-k]").forEach(li=>{if(li.dataset.k===k){li.classList.toggle("pp-done",on);li.setAttribute("aria-checked",on)}})}
function prepTick(li){
  if(!current||!li)return;const k=li.dataset.k,on=!sharedTicks(current)[k];
  /* a folded dry line ticks the lines folded into it too (quietly, the last setTick saves the week) */
  if(li.dataset.of)for(const y of li.dataset.of.split("\n"))if(y&&y!==k)setTick(current,y,on,true);
  setTick(current,k,on);
  li.classList.toggle("pp-done",on);li.setAttribute("aria-checked",on);
}
prep.addEventListener("click",e=>{const li=e.target.closest&&e.target.closest("li[data-k]");if(li&&prep.closest(".preview"))prepTick(li)});
prep.addEventListener("keydown",e=>{const li=e.target.closest&&e.target.closest("li[data-k]");if(li&&(e.key===" "||e.key==="Enter")){e.preventDefault();prepTick(li)}});
/* dark prep sheets print on light paper with dark ink (a full black page is slow, smudgy and wasteful); the accent darkens until it reads on paper */
const hexRGB=h=>{const m=String(h||"").trim().match(/^#?([0-9a-f]{6})$/i);return m?[0,2,4].map(i=>parseInt(m[1].slice(i,i+2),16)):null};
const relLum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const toHexC=c=>"#"+c.map(v=>Math.round(v).toString(16).padStart(2,"0")).join("");
function inkSafe(c){const g=hexRGB(c.style.getPropertyValue("--mg"));if(!g||relLum(g)>.3)return;const PAPER="#fbf8f1",pl=relLum(hexRGB(PAPER));
  c.style.setProperty("--mg",PAPER);c.style.setProperty("--mi",relLum(g)<.05?toHexC(g):"#1b1b1b");
  for(const v of ["--ma","--m2"]){let a=hexRGB(c.style.getPropertyValue(v));if(!a)continue;let n=0;while((pl+.05)/(relLum(a)+.05)<4.5&&n++<20)a=a.map(x=>x*.88);c.style.setProperty(v,toHexC(a))}
  c.classList.add("pp-ink")}
function prepClean(c){inkSafe(c);
  /* list numbers written as text: the PDF renderer drops the gap after list markers ("1Steak tartare") */
  c.querySelectorAll("ol").forEach(ol=>{if(ol.dataset.num)return;ol.dataset.num="1";let n=+(ol.getAttribute("start")||1);for(const li of ol.children){if(li.tagName!=="LI")continue;const sp=document.createElement("span");sp.className="pp-num";sp.textContent=(n++)+". ";li.prepend(sp)}ol.style.listStyle="none"});c.querySelectorAll(".pp-done").forEach(x=>x.classList.remove("pp-done"));c.querySelectorAll("li[data-k]").forEach(x=>{x.removeAttribute("tabindex");x.removeAttribute("role");x.removeAttribute("aria-checked")})}

{const skip=e=>{if(spinning||($("theatre").classList.contains("closed")&&$("tease").classList.contains("leader"))){skipReq=true;if(e)e.stopPropagation()}};
 const wb=document.querySelector(".wheel-box");if(wb)wb.addEventListener("click",skip,true);
 $("theatre").addEventListener("click",skip);
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&(spinning||$("tease").classList.contains("leader")))skip()});}

/* the snack counter: real movie snacks, bought or made, added to tonight's film; they plan, scale and shop like its dishes */
function SNACK_BY(){if(!window._snackBy){window._snackBy={};(window.SNACKS||[]).forEach(x=>{window._snackBy[x.id]=x})}return window._snackBy}
function snackPicks(f){try{return JSON.parse(localStorage.getItem("mns-snacks-"+f.id)||"[]").filter(id=>SNACK_BY()[id])}catch(e){return []}}
function snackSave(f,ids){try{ids.length?localStorage.setItem("mns-snacks-"+f.id,JSON.stringify(ids)):localStorage.removeItem("mns-snacks-"+f.id)}catch(e){}}
function snackDishes(f){if(!f)return [];return snackPicks(f).map(id=>{const x=SNACK_BY()[id];return {n:x.n,course:"c",prep_min:x.prep_min,cook_min:x.cook_min,make_ahead:x.make_ahead,ingredients:x.ingredients,steps:x.steps,veg:x.veg,af:true,snack:x.id}})}
let snackCat="All",snackAll=false;
/* snacks go on the locked-in film when there is one, so renting or spinning something else doesn't move them */
function snackFilm(){const w=typeof week!=="undefined"&&week&&week.id&&FILMS.find(x=>x.id===week.id);return w||(document.body.classList.contains("staged")?null:current)}
/* counter prices: the data holds 1996 multiplex prices, moved to the film's year so the board reads like its own time (in cents) */
function snackK(y){const P=[[1930,.07],[1950,.12],[1960,.15],[1970,.24],[1980,.5],[1990,.85],[1996,1],[2005,1.35],[2015,1.7],[2026,2.2]];y=+y||1996;if(y<=P[0][0])return P[0][1];
  for(let i=1;i<P.length;i++)if(y<=P[i][0]){const [a,ka]=P[i-1],[b,kb]=P[i];return ka+(kb-ka)*(y-a)/(b-a)}return P[P.length-1][1]}
function snackCost(v,f){const x=(+v||2)*snackK(f&&f.year)*100;return x<100?Math.max(5,Math.round(x/5)*5):Math.round(x/10)*10}
/* under a board priced in cents, dollar amounts carry their sign ("$1.10, saves 20c") so the counter reads as one price style (review 12) */
const snackMoney=c=>c<100?c+"c":"$"+(c/100).toFixed(2);
const comboCost=c=>{const s=c<100?5:10;return Math.min(c-s,Math.floor(c*.88/s)*s)};
/* combos are one from each part of the counter: something to eat, something cold, something sweet */
const SNACK_ROLE={Popcorn:"main",Hot:"main",Savoury:"main",Drinks:"drink",Frozen:"drink",Retro:"sweet",Chocolate:"sweet",Lollies:"sweet"};
const SNACK_FALL=["butter-popcorn","slushies","choc-tops","caramel-popcorn","spider","mixed-lollies","golden-syrup-popcorn","milkshakes","choc-peanuts","hot-chips","icy-poles","honeycomb-balls","pretzels","choc-coated-ice-creams","jelly-babies","cheese-twists","family-block","chips-dip"];
/* the rest of each theme's counter, after its three "goes well with" snacks */
function snackPrefData(){return {redsauce:["butter-popcorn","spider","coconut-ice","milkshakes","rocky-road"],pizza:["cheese-twists","milkshakes","choc-peanuts","nachos"],deli:["pretzel-mix","choc-raisins","spider","family-block"],street:["hot-chips","mixed-lollies","icy-poles","pretzel-mix"],cop:["slushies","butter-popcorn","family-block","milkshakes"],soul:["caramel-popcorn","spider","family-block","slushies"],xmas:["golden-syrup-popcorn","milkshakes","spider","fairy-bread","party-pies"],aussie:["spider","icy-poles","chocolate-crackles","hot-chips","milk-bottles"],asian:["golden-syrup-popcorn","icy-poles","sherbet","pretzel-mix"],scifi:["choc-tops","butter-popcorn","jelly-babies","milkshakes"],hero:["choc-tops","nachos","lolly-snakes","milkshakes"],kids:["spider","icy-poles","cheerios","milk-bottles","butter-popcorn"],teen:["nachos","slushies","mixed-lollies","butter-popcorn"],diner:["butter-popcorn","choc-tops","caramel-popcorn","pretzel-mix","family-block"],mex:["sour-straps","icy-poles","choc-peanuts","milkshakes"],tiki:["golden-syrup-popcorn","spider","sherbet","chocolate-crackles"],uptown:["choc-tops","milkshakes","cheese-twists","choc-raisins"],horror:["slushies","butter-popcorn","jelly-babies","spider","hot-chips"],western:["spider","pretzel-mix","honeycomb-balls","milkshakes"],philly:["milkshakes","butter-popcorn","family-block","slushies"],galaxy:["golden-syrup-popcorn","jelly-babies","butter-popcorn","icy-poles"],wizard:["milkshakes","choc-tops","cheese-twists","sherbet"],adventure:["slushies","butter-popcorn","dagwood-dogs","icy-poles"],fairytale:["spider","chocolate-crackles","honey-joys","butter-popcorn","icy-poles"],romcom:["milkshakes","spider","choc-raisins","butter-popcorn"]}}
/* the third combo's name and line when the film has no short scene to name it after */
const SNACK_THEME={redsauce:["Sunday session","For a long night with the family."],pizza:["Friday night box","Grab it on the way in."],deli:["Matinee box","Easy to hold in one hand."],street:["Late session box","For when the film runs past midnight."],cop:["Stakeout box","Enough to see you through the long wait."],soul:["Sunday session","Made for passing down the row."],xmas:["Christmas Eve box","For the night before Christmas."],aussie:["Arvo session","The way the school canteen did it."],asian:["Late session box","Sweet, sour and salty in one go."],scifi:["Double feature box","Built to last two films."],hero:["Opening night box","For the big screen and a full house."],kids:["Kids' tray","Small serves for small hands."],teen:["Back row","Enough to share with whoever sits next to you."],diner:["Late session","For the drive home after."],mex:["Friday night box","Salty, cold and made for sharing."],tiki:["Summer session","Cold ones for a hot night."],uptown:["Dress circle","For the good seats."],horror:["Lights out","Something to grip when the lights go down."],western:["Saturday matinee","Like the Saturday pictures used to be."],philly:["Fight night box","Enough for all twelve rounds."],galaxy:["Double feature box","Built to last two films."],wizard:["Saturday matinee","Like the Saturday pictures used to be."],adventure:["Saturday matinee","Packed for a long trip."],fairytale:["Family tray","Something for everyone on the couch."],romcom:["Date night","Easy to share across the armrest."]};
const SNACK_BOOZE=/\b(rum|brandy|whiske?y|wine|beers?|liqueur|bourbon|vodka|tequila|gin|champagne|sherry|kahlua|baileys|amaretto|cognac|stout|lager|ale|cider|margaritas?|daiquiris?|martinis?|spiked|boozy|tipsy|cocktails?|sangria|prosecco|schnapps|mead|grog|eggnog|punch)\b/i;
const SNACK_MEAT=/\b(beef|steaks?|pork|ham|bacon|chicken|turkey|lamb|veal|sausages?|meatballs?|meat|brisket|salami|prosciutto|fish|prawns?|shrimp|lobsters?|crabs?|oysters?|clams?|ribs?|burgers?|hot dogs?|jerky)\b/i;
/* kids' mode, family films and no-alcohol nights never get a drink with alcohol in it; vegetarian nights only get vegetarian snacks */
const snackKid=f=>!!(kidsMode||dietAF()||(f&&isKidSafe(f)));
function snackPref(f){
  const by=SNACK_BY(),G=snackGoData(),kid=snackKid(f),ok=id=>{const x=by[id];return !!x&&(!DIET.veg||x.veg)&&!(kid&&x.alc)};
  let h=0;for(const ch of f.id)h=(h*31+ch.charCodeAt(0))>>>0;
  const head=G.only[f.id]||G.go[f.theme]||[],rot=head.length?h%head.length:0;
  return [...new Set([...head.slice(rot),...head.slice(0,rot),...(snackPrefData()[f.theme]||[]),...G.fall,...SNACK_FALL,...(window.SNACKS||[]).map(x=>x.id)])].filter(ok);
}
const lc1=s=>/^[A-Z][a-z]/.test(s)?s[0].toLowerCase()+s.slice(1):s;
/* a snack name with "and" in it ("chips and French onion dip") gets "plus" before the last one, so the list still reads */
const andList=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+(a.some(x=>/ and /.test(x))?", plus ":" and ")+a[a.length-1];
function snackCombos(f){
  if(!f)return [];const by=SNACK_BY(),pref=snackPref(f),used=new Set();
  const take=role=>{const id=pref.find(i=>!used.has(i)&&SNACK_ROLE[by[i].cat]===role);if(id)used.add(id);return id};
  const sets=[["main","drink","sweet"],["main","sweet"],["main","drink","sweet"]].map(s=>s.map(take).filter(Boolean));
  const fl=(f._lib||f._kit||{}).flavour||{},D=x=>dietText(f,String(x||"")).trim(),kid=snackKid(f);
  const clean=s=>s&&!(kid&&SNACK_BOOZE.test(s))&&!(DIET.veg&&SNACK_MEAT.test(s))?s:"";
  const who=D(fl.note&&fl.note.by),sign=clean(D(fl.sign)),T=SNACK_THEME[f.theme]||["Late session","For the drive home after."];
  const wink=(fl.winks||[]).map(D).find(w=>/^The [^,.;:]{3,26}$/.test(w)&&clean(w));
  /* the film's first sweet, as a reason to stop at the counter */
  const w0=(f.W||[])[0],sweet=w0?clean(D(w0[0])):"";
  const names=ids=>ids.map(id=>lc1(by[id].n));
  const out=[
    {name:who?`${who}'s order`:`The ${f.title} combo`,desc:`${andList(names(sets[0]))}. `+(sweet?`Something to pick at before dessert: ${sweet}.`:"One of each, the full set.")},
    {name:`${f.title} for two`,desc:`${andList(names(sets[1]))}, one between two.`,sign},
    {name:wink||T[0],desc:`${andList(names(sets[2]))}. ${T[1]}`}
  ];
  return out.map((c,i)=>{const ids=sets[i];if(ids.length<2)return null;const full=ids.reduce((s,id)=>s+snackCost(by[id].price,f),0);
    return Object.assign(c,{ids,full,cost:comboCost(full),desc:c.desc[0].toUpperCase()+c.desc.slice(1)})}).filter(Boolean);
}
/* the tray: tonight's picks, with any combo that is all there shown as the combo at its combo price */
function snackTray(f,combos){const by=SNACK_BY(),ids=snackPicks(f),left=new Set(ids),rows=[];
  combos.forEach((c,i)=>{if(c.ids.every(id=>left.has(id))){c.ids.forEach(id=>left.delete(id));rows.push({key:"c:"+i,name:c.name,cost:c.cost,sub:c.ids.map((id,j)=>j?lc1(by[id].n):by[id].n).join(", ")})}});
  ids.filter(id=>left.has(id)).forEach(id=>rows.push({key:id,name:by[id].n,cost:snackCost(by[id].price,f)}));return rows}
const snackPic=(x,cls,w)=>x.img?`<img class="${cls}" src="${ESC(x.img)}" alt="" width="${w}" height="${w}" loading="lazy" decoding="async">`:`<span class="${cls} sc-noimg" aria-hidden="true"></span>`;
function renderSnacks(){
  const box=$("snackCounter");if(!box)return;const f=snackFilm(),locked=!!(f&&week&&week.id===f.id);
  /* a locked-in film may not be loaded yet: fetch it once, then draw its combos */
  if(f&&!f._full&&!f._snackWait&&typeof ensureExact==="function"){f._snackWait=true;ensureExact(f).then(()=>{try{if(!$("viewCrave").hidden)renderSnacks()}catch(e){}})}
  const by=SNACK_BY(),on=new Set(f?snackPicks(f):[]),all=window.SNACKS||[],P=x=>snackMoney(snackCost(x.price,f));
  const T=f?ESC(f.title):"";
  const board=[["Popcorn sm","butter-popcorn",1],["Popcorn lg","butter-popcorn",1.5],["Choc top","choc-tops",1],["Slushie","slushies",1],["Hot chips","hot-chips",1],["Pick and mix","mixed-lollies",1]].filter(r=>by[r[1]]);
  let h=`<div class="scb"><div class="scb-in"><div class="scb-top"><h2 class="scb-t">Candy Bar</h2><p class="scb-now">${f?`Now showing: ${T}`:"Nothing showing yet"}</p></div>
    <ul class="scb-list" aria-label="Counter prices${f?", "+ESC(f.year):""}">${board.map(([n,id,k])=>`<li><span>${n}</span><b>${snackMoney(snackCost(by[id].price*k,f))}</b></li>`).join("")}</ul>
    ${f?`<p class="scb-yr">${ESC(f.year)} prices</p>`:""}</div></div>`;
  if(!f)h+=`<p class="sc-none">No film on yet. Spin one at the Box office and the counter makes up three combos for it. <button type="button" class="sc-spin" data-sc-spin="1">Go to the Box office</button></p>`;
  else{
    const C=snackCombos(f),rows=snackTray(f,C),tot=rows.reduce((s,r)=>s+r.cost,0);
    const glass=snackPref(f).slice(0,6).map(id=>by[id]);
    h+=`<section class="scc" id="snackCombos" aria-labelledby="sccT"><h3 class="sc-k" id="sccT">Tonight's combos <span>for ${T}</span></h3>
      <ul class="scc-list">${C.map((c,i)=>{const full=c.ids.every(id=>on.has(id));return `<li class="scc-card${i===0?" hot":""}${full?" on":""}">
        <div class="scc-pics">${c.ids.map(id=>snackPic(by[id],"scc-pic",56)).join("")}</div>
        <h4 class="scc-n">${ESC(c.name)}</h4><p class="scc-d">${ESC(c.desc)}</p>${c.sign?`<p class="scc-s">${ESC(c.sign)}</p>`:""}
        <div class="scc-foot"><span class="scc-p">${snackMoney(c.cost)}<small>Saves ${snackMoney(c.full-c.cost)}</small></span><button type="button" class="scc-add" data-combo="${i}" aria-pressed="${full}" aria-label="${full?"Take off the tray":"Add combo"}: ${ESC(c.name)}, ${snackMoney(c.cost)}">${full?"In your tray":"Add combo"}</button></div></li>`}).join("")}</ul></section>
      <div class="sc-mid"><section class="scg" aria-labelledby="scgT"><h3 class="sc-k" id="scgT">In the glass case</h3>
        <ul class="scg-list">${glass.map(x=>`<li class="scg-item${on.has(x.id)?" on":""}">${snackPic(x,"scg-img",160)}<div class="scg-b"><p class="scg-n">${ESC(x.n)}</p><p class="scg-row"><em class="sc-kind ${x.kind}">${x.kind==="make"?"Make it":"Buy it"}</em><span class="scg-p">${P(x)}</span></p>
          <button type="button" class="sc-add" data-snack="${ESC(x.id)}" aria-pressed="${on.has(x.id)}" aria-label="${on.has(x.id)?"Remove":"Add"} ${ESC(x.n)}">${on.has(x.id)?"Added":"Add"}</button></div></li>`).join("")}</ul></section>
      <aside class="sct" aria-labelledby="sctT"><h3 class="sct-t" id="sctT" tabindex="-1">Your tray</h3><p class="sct-sub">${T}${locked?", locked in":""}</p>
        ${rows.length?`<ul class="sct-list">${rows.map(r=>`<li><span class="sct-n">${ESC(r.name)}${r.sub?`<small>${ESC(r.sub)}</small>`:""}</span><span class="sct-p">${snackMoney(r.cost)}</span><button type="button" class="sct-x" data-tray-x="${ESC(r.key)}" aria-label="Take ${ESC(r.name)} off the tray">&times;</button></li>`).join("")}</ul>
        <p class="sct-tot"><span>Total</span><span>${tot<100?snackMoney(tot):"$"+snackMoney(tot)}</span></p>`:`<p class="sct-empty">Nothing on the tray yet. Add a combo or something from the case.</p>`}
        <p class="sct-note">Everything on the tray goes on tonight's prep sheet and shopping list.</p>
        ${rows.length?`<button type="button" class="sct-go" data-sc-go="1">See the shopping list</button>`:""}</aside></div>`;
  }
  const open=!f||snackAll,cats=["All",...new Set(all.map(x=>x.cat))],list=all.filter(x=>snackCat==="All"||x.cat===snackCat);
  h+=`<div class="sc-all">${f?`<button type="button" class="sc-more" data-sc-all="1" aria-expanded="${open}" aria-controls="scAll">${open?"Close the whole counter":`See the whole counter (${all.length})`}</button>`:""}
    <div class="sc-body" id="scAll"${open?"":" hidden"}>${open?`<div class="sc-head"><h3 class="sc-t">The whole counter</h3><p class="sc-sub">${f?`${tapWord("Tap")} Add and it goes on ${locked?"your locked-in film":"tonight's film"}, <b>${T}</b>: the prep sheet and the shopping list.`:"Every snack on the counter. Pick a film first and what you add goes on its prep sheet and shopping list."}</p></div>
    <div class="sc-cats" role="group" aria-label="Snack type">${cats.map(c=>`<button type="button" data-sc-cat="${ESC(c)}" aria-pressed="${c===snackCat}">${ESC(c)}</button>`).join("")}</div>
    <ul class="sc-list">${list.map(x=>`<li class="sc-item${on.has(x.id)?" on":""}">${snackPic(x,"sc-img",64)}<div class="sc-n"><span>${ESC(x.n)}</span><small>${ESC(x.note)}</small></div><p class="sc-meta"><em class="sc-kind ${x.kind}">${x.kind==="make"?"Make it":"Buy it"}</em><span class="sc-pr">${P(x)}</span></p><button type="button" class="sc-add" data-snack="${ESC(x.id)}" aria-pressed="${on.has(x.id)}" aria-label="${on.has(x.id)?"Remove":"Add"} ${ESC(x.n)}">${on.has(x.id)?"Added":"Add"}</button></li>`).join("")}</ul>
    ${f&&on.size?`<div class="sc-bar"><span>${on.size} snack${on.size===1?"":"s"} on ${T}</span><button type="button" class="sc-go" data-sc-go="1">See the shopping list</button></div>`:""}`:""}</div></div>`+snackCredits();
  box.innerHTML=h;
}
/* one way to change tonight's snacks: save, redraw the prep sheet if it's showing that film, the counter and the menu's "goes well with" */
function snackSet(tf,ids,say){snackSave(tf,ids);
  try{if(tf===current&&current._r2){planWire(current);prep.innerHTML=prepHTML(current,current.menu)}}catch(err){}
  renderSnacks();try{snackPair(current)}catch(err){}buzz(15);const l=$("snackLive");if(l&&say)l.textContent=say}
document.addEventListener("click",e=>{
  const box=$("snackCounter");if(!box||!box.contains(e.target))return;
  const fo=sel=>{const b=box.querySelector(sel);if(b)b.focus()};
  const c=e.target.closest("[data-sc-cat]");if(c){snackCat=c.dataset.scCat;renderSnacks();fo(`[data-sc-cat="${CSS.escape(snackCat)}"]`);return}
  if(e.target.closest("[data-sc-spin]")){goView("wheel");return}
  if(e.target.closest("[data-sc-all]")){snackAll=!snackAll;renderSnacks();fo("[data-sc-all]");return}
  const tf=snackFilm(),by=SNACK_BY();
  const cb=e.target.closest("[data-combo]");
  if(cb&&tf){const i=+cb.dataset.combo,co=snackCombos(tf)[i];if(!co)return;const ids=snackPicks(tf),has=co.ids.every(id=>ids.includes(id));
    snackSet(tf,has?ids.filter(id=>!co.ids.includes(id)):[...ids,...co.ids.filter(id=>!ids.includes(id))],`${co.name} ${has?"taken off":"added to"} the tray`);fo(`[data-combo="${i}"]`);return}
  const x=e.target.closest("[data-tray-x]");
  if(x&&tf){const k=x.dataset.trayX,all=[...box.querySelectorAll("[data-tray-x]")],at=all.indexOf(x);let ids=snackPicks(tf),name="";
    if(k.startsWith("c:")){const co=snackCombos(tf)[+k.slice(2)];if(co){ids=ids.filter(id=>!co.ids.includes(id));name=co.name}}else{ids=ids.filter(id=>id!==k);name=by[k]?by[k].n:""}
    snackSet(tf,ids,`${name} taken off the tray`);const left=[...box.querySelectorAll("[data-tray-x]")];(left[Math.min(at,left.length-1)]||$("sctT")||box).focus();return}
  const a=e.target.closest("[data-snack]");
  if(a&&!tf){const sub=box.querySelector(".sc-sub");if(sub)sub.innerHTML='Pick a film first, then your snacks go on its prep sheet and shopping list. <button type="button" class="sc-spin" data-sc-spin="1">Spin the wheel</button>';buzz(15);return}
  if(a&&tf){const ids=snackPicks(tf),id=a.dataset.snack,i=ids.indexOf(id),inAll=!!a.closest("#scAll");if(i<0)ids.push(id);else ids.splice(i,1);
    snackSet(tf,ids,`${by[id]?by[id].n:"Snack"} ${i<0?"added to":"taken off"} the tray`);fo(`${inAll?"#scAll ":".scg "}[data-snack="${CSS.escape(id)}"]`);return}
  if(e.target.closest("[data-sc-go]")){if(tf&&tf!==current){openTrolley(tf);return}setView("wheel");setTab("prep");setTimeout(()=>{const pv=$("preview");if(pv)pv.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})},60)}
});

/* goes well with: two snack counter picks for each film, from its theme, varied by film, vegetarian aware */
function snackGoData(){return {only:{"Babe (1995)":["fairy-bread","musk-sticks","honey-joys"],"Chicken Run (2000)":["honey-joys","chocolate-crackles","sherbet"]},go:{redsauce:["cheese-twists","choc-peanuts","family-block"],pizza:["pretzels","slushies","sour-straps"],deli:["pretzels","chips-dip","milkshakes"],street:["nachos","slushies","sour-straps"],cop:["hot-chips","choc-peanuts","pretzel-mix"],soul:["honey-joys","milkshakes","hot-chips"],xmas:["rocky-road","coconut-ice","choc-tops"],aussie:["party-pies","musk-sticks","cheerios"],asian:["slushies","sour-straps","honeycomb-balls"],scifi:["sherbet","slushies","golden-syrup-popcorn"],hero:["butter-popcorn","slushies","dagwood-dogs"],kids:["fairy-bread","chocolate-crackles","honey-joys"],teen:["milkshakes","hot-chips","sour-straps"],diner:["milkshakes","hot-chips","spider"],mex:["nachos","slushies","chips-dip"],tiki:["icy-poles","slushies","coconut-ice"],uptown:["family-block","honeycomb-balls","caramel-popcorn"],horror:["lolly-snakes","mixed-lollies","caramel-popcorn"],western:["dagwood-dogs","golden-syrup-popcorn","pretzels"],philly:["hot-chips","choc-raisins","cheerios"],galaxy:["sherbet","choc-tops","slushies"],wizard:["honeycomb-balls","jelly-babies","caramel-popcorn"],adventure:["lolly-snakes","pretzel-mix","choc-peanuts"],fairytale:["fairy-bread","coconut-ice","milk-bottles"],romcom:["choc-tops","family-block","caramel-popcorn"]},fall:["butter-popcorn","choc-tops","orange-choc-balls","golden-syrup-popcorn"]}}
function snackGoes(f){
  if(!f)return [];const by=SNACK_BY(),G=snackGoData(),ok=id=>by[id]&&(!DIET.veg||by[id].veg);
  let h=0;for(const ch of f.id)h=(h*31+ch.charCodeAt(0))>>>0;
  const pool=(G.only[f.id]||G.go[f.theme]||[]).filter(ok),fall=G.fall.filter(id=>ok(id)&&!pool.includes(id));
  const rot=pool.length?h%pool.length:0,list=[...pool.slice(rot),...pool.slice(0,rot)];
  return [...list,...fall].slice(0,2).map(id=>by[id]);
}
function snackPair(f){
  const box=$("snackPair");if(!box)return;const goes=snackGoes(f);
  if(!f||!goes.length){box.hidden=true;box.innerHTML="";return}
  const on=new Set(snackPicks(f));
  box.innerHTML=`<p class="sp-t">Goes well with</p><ul>${goes.map(x=>`<li><span class="sp-n">${ESC(x.n)}<small>${x.kind==="make"?"Make it":"Buy it"}</small></span><button type="button" class="sp-add" data-sp="${ESC(x.id)}" aria-pressed="${on.has(x.id)}" aria-label="${on.has(x.id)?"Remove":"Add"} ${ESC(x.n)}">${on.has(x.id)?"Added":"Add"}</button></li>`).join("")}</ul><button type="button" class="sp-more" data-sp-more="1">More snacks</button>`;
  box.hidden=false;
  box.onclick=e=>{
    const a=e.target.closest("[data-sp]");
    if(a&&current){const ids=snackPicks(current),id=a.dataset.sp,i=ids.indexOf(id);if(i<0)ids.push(id);else ids.splice(i,1);snackSave(current,ids);
      try{if(current._r2){planWire(current);prep.innerHTML=prepHTML(current,current.menu)}}catch(err){}
      try{renderSnacks()}catch(err){}snackPair(current);buzz(15);const b=box.querySelector(`[data-sp="${CSS.escape(id)}"]`);if(b)b.focus();return}
    /* More snacks: the snack counter lives in the Candy bar, so go there first, then down to the counter */
    if(e.target.closest("[data-sp-more]")){goView("crave",true);setTimeout(()=>{const sc=$("snackCounter");if(sc)toEl(sc)},80)}
  };
}

/* a shared film link lands on that film's menu, once any welcome card is out of the way */
function toSharedFilm(){try{const id=new URLSearchParams(location.search).get("film");if(!id||!current||current.id!==id||document.querySelector("dialog.welcome[open]")||window.__sharedDone)return;window.__sharedDone=true;$("theatre").scrollIntoView({behavior:"auto",block:"start"})}catch(e){}}

/* rentals: a tape you've got out opens straight to its menu */
function isRentedOut(f){return (member.out||[]).some(r=>r.id===f.id)&&!watched.has(f.id)}
function openRentalMenu(f){setView("wheel");replay(f);addHistory(f);toMenu()}

/* the walk-in: Galaxy Video's shopfront, once per visit, never in the way of a shared film link */
function openWalkin(){
  const w=document.getElementById("walkin");if(!w||!w.hidden)return;
  let seen=false;try{seen=sessionStorage.getItem("mns-walkin")==="1"}catch(e){}
  if(seen)return;
  const prev=document.activeElement;
  w.hidden=false;document.body.style.overflow="hidden";
  try{fitSigns(w,true)}catch(e){}
  const done=(walk)=>{
    try{sessionStorage.setItem("mns-walkin","1")}catch(e){}
    document.removeEventListener("keydown",key);
    const close=()=>{w.hidden=true;w.classList.remove("going");document.body.style.overflow="";document.dispatchEvent(new Event("walkin-done"));
      /* you are through the door now: land at the counter, past the shopfront photo you just walked through */
      {const fr=$("svFront");if(fr&&!$("viewShop").hidden)window.scrollTo({top:fr.getBoundingClientRect().bottom+scrollY-8,behavior:"auto"})}const b=document.getElementById("viewShopBtn");try{(b||prev).focus({preventScroll:true})}catch(e){}};
    if(walk){try{sfx.chime()}catch(e){}if(reduce){close();return}w.classList.add("going");setTimeout(close,900)}else close();
  };
  const key=e=>{if(e.key==="Escape"){e.preventDefault();done(false)}else if(e.key==="Tab"){const f=[document.getElementById("wiIn"),document.getElementById("wiSkip")];const i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?f.length-1:1))%f.length].focus()}};
  document.addEventListener("keydown",key);
  document.getElementById("wiIn").addEventListener("click",()=>done(true),{once:true});
  document.getElementById("wiSkip").addEventListener("click",()=>done(false),{once:true});
  setTimeout(()=>{try{document.getElementById("wiIn").focus({preventScroll:true})}catch(e){}},50);
}
/* the cinema is the front door: the shopfront only plays the first time you step into Galaxy Video */
{const sb=document.getElementById("viewShopBtn");if(sb)sb.addEventListener("click",()=>setTimeout(openWalkin,60))}

/* fade the aisle signs at whichever edge has more to scroll */
document.addEventListener("scroll",e=>{const r=e.target;if(r&&r.classList&&r.classList.contains("an-row"))anEdge(r)},true);
function anEdge(r){r.classList.toggle("mid",r.scrollLeft>4);r.classList.toggle("at-end",r.scrollLeft+r.clientWidth>=r.scrollWidth-4)}
/* the aisle carousel: swipe the hanging signs, tap one to walk down that aisle; "Every aisle" shows the lot */
let hereAisle=null;try{hereAisle=sessionStorage.getItem("mns-aisle")||null}catch(e){}
function buildAisleNav(){
  const box=$("shopAisles"),nav=$("aisleNav");if(!box||!nav)return;
  const secs=[...box.querySelectorAll(".aisle[data-name]")];
  if(secs.length<2){nav.hidden=true;box.classList.remove("one-aisle");return}
  nav.hidden=false;
  if(hereAisle&&!secs.some(s=>s.dataset.name===hereAisle))hereAisle=null;
  const card=(name,count,cls,unit)=>`<button type="button" class="an-card${cls?" "+cls:""}" data-go="${ESC(name)}" aria-pressed="${(name===""&&!hereAisle)||name===hereAisle}"><span class="an-sign">${ESC(name||"Every aisle")}</span><span class="an-n">${count} ${unit||"tape"}${count==1?"":"s"}</span></button>`;
  nav.querySelector(".an-row").innerHTML=card("",secs.length,"all","aisle")+secs.map(s=>card(s.dataset.name,+s.dataset.count||0,"")).join("");requestAnimationFrame(()=>{const r=nav.querySelector(".an-row");if(r)anEdge(r)});
  applyAisle(false);
}
function applyAisle(scroll){
  const box=$("shopAisles"),nav=$("aisleNav");if(!box||!nav)return;
  box.classList.toggle("one-aisle",!!hereAisle);
  box.querySelectorAll(".aisle[data-name]").forEach(s=>s.classList.toggle("here",s.dataset.name===hereAisle));
  nav.querySelectorAll(".an-card").forEach(c=>c.setAttribute("aria-pressed",String((c.dataset.go===""&&!hereAisle)||c.dataset.go===hereAisle)));
  $("aisleBack").hidden=!hereAisle;
  const on=nav.querySelector('.an-card[aria-pressed="true"]');
  if(on){try{on.scrollIntoView({block:"nearest",inline:"center",behavior:scroll&&!reduce?"smooth":"auto"})}catch(e){}}
  if(scroll){const here=box.querySelector(".aisle.here");if(here){const sh=here.querySelector(".shelf[data-k]");try{fillShelf(sh)}catch(e){}}const st=document.querySelector("#viewShop .shop-tools"),pin=st&&/sticky|fixed/.test(getComputedStyle(st).position)?st.getBoundingClientRect().height:0;const y=nav.getBoundingClientRect().top+scrollY-topH()-pin-8;try{window.scrollTo({top:Math.max(0,y),behavior:reduce?"auto":"smooth"})}catch(e){window.scrollTo(0,Math.max(0,y))}}
}
function goAisle(name){hereAisle=name||null;try{hereAisle?sessionStorage.setItem("mns-aisle",hereAisle):sessionStorage.removeItem("mns-aisle")}catch(e){}if(hereAisle){try{sfx.clunk()}catch(e){}}applyAisle(true)}
{const nav=$("aisleNav");if(nav){nav.addEventListener("click",e=>{const c=e.target.closest(".an-card");if(c)goAisle(c.dataset.go)});$("aisleBack").addEventListener("click",()=>goAisle(null))}}

/* the box office ticket: your own extras, a pantry check before you go, and a printed Movie Night ticket */
function extrasFor(f){try{return JSON.parse(localStorage.getItem("mns-extras-"+f.id)||"[]").filter(x=>typeof x==="string"&&x.trim())}catch(e){return []}}
function extrasSave(f,l){try{l.length?localStorage.setItem("mns-extras-"+f.id,JSON.stringify(l)):localStorage.removeItem("mns-extras-"+f.id)}catch(e){}}
function pantryOf(f){try{return JSON.parse(localStorage.getItem("mns-pantry-"+f.id)||"{}")||{}}catch(e){return {}}}
function pantryHas(f,k){return !!pantryOf(f)[k]}
function pantrySet(f,k,on){const p=pantryOf(f);if(on)p[k]=1;else delete p[k];try{Object.keys(p).length?localStorage.setItem("mns-pantry-"+f.id,JSON.stringify(p)):localStorage.removeItem("mns-pantry-"+f.id)}catch(e){}}
function initTicket(o,f,api){
  const inner=o.querySelector(".trolley-in");if(!inner)return;
  let mode="shop";
  const head=document.createElement("div");head.className="tk-head";
  head.innerHTML=`<div class="tk-mode" role="group" aria-label="List mode"><button type="button" data-m="pantry" aria-pressed="false">Pantry check</button><button type="button" data-m="shop" aria-pressed="true">Shopping</button></div><p class="tk-hint" id="tkHint"></p>`;
  inner.querySelector(".bar").insertAdjacentElement("afterend",head);
  const extra=document.createElement("form");extra.className="tk-add";
  extra.innerHTML=`<label for="tkNew">Add your own</label><div><input id="tkNew" type="text" maxlength="60" autocomplete="off" placeholder="Milk, ice, bin bags"><button type="submit">Add</button></div>`;
  inner.querySelector(".acts").insertAdjacentElement("beforebegin",extra);
  inner.querySelector(".acts").insertAdjacentHTML("afterbegin",'<button type="button" class="tk-print">Print box office ticket</button>');
  const ex=extrasFor(f);
  inner.querySelectorAll("li input[data-k]").forEach(i=>{const raw=i.closest("li").textContent.trim();if(ex.includes(raw)){const b=document.createElement("button");b.type="button";b.className="tk-del";b.setAttribute("aria-label","Remove "+raw);b.textContent="Remove";b.dataset.del=raw;i.closest("li").appendChild(b)}});
  const paint=()=>{
    head.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.m===mode)));
    o.classList.toggle("pantry-mode",mode==="pantry");
    let hidden=0;
    inner.querySelectorAll("li input[data-k]").forEach(i=>{const k=i.dataset.k,li=i.closest("li"),home=pantryHas(f,k);
      if(mode==="pantry"){i.checked=home;li.hidden=false}else{i.checked=!!api.ticks()[k];li.hidden=home;if(home)hidden++}});
    inner.querySelectorAll("h4").forEach(h=>{const ul=h.nextElementSibling;if(ul)h.hidden=ul.querySelectorAll("li:not([hidden])").length===0});
    const hint=head.querySelector("#tkHint");
    hint.textContent=mode==="pantry"?"Tick what's already at home. Those come off the list.":hidden?`${hidden} already in the pantry, left off this list.`:"";
    api.prog();
  };
  o.addEventListener("change",e=>{if(mode!=="pantry")return;const k=e.target.dataset&&e.target.dataset.k;if(!k)return;e.stopImmediatePropagation();(api.twin&&api.twin.get(k)||[]).forEach(y=>pantrySet(f,y,e.target.checked));pantrySet(f,k,e.target.checked);paint()},true);
  head.addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(!b)return;mode=b.dataset.m;paint()});
  extra.addEventListener("submit",e=>{e.preventDefault();const v=extra.querySelector("input").value.trim();if(!v)return;const l=extrasFor(f);if(!l.includes(v))l.push(v);extrasSave(f,l);api.reopen()});
  inner.addEventListener("click",e=>{const d=e.target.closest(".tk-del");if(d){extrasSave(f,extrasFor(f).filter(x=>x!==d.dataset.del));pantrySet(f,api.kf(d.dataset.del),false);api.reopen();return}
    if(e.target.closest(".tk-print"))printTicket(f,api)});
  paint();
}
function printTicket(f,api){
  /* 13 Nov: the ticket prints the lines as the dialog shows them (kids' mode and dry lists read the dried words, folded drinks once) */
  const left=(api.view||api.groups.map(([g,l])=>[g,l.map(x=>({x,text:x}))])).map(([g,l])=>[g,l.filter(e=>!api.skip(api.kf(e.x))).map(e=>e.text)]).filter(([,l])=>l.length);
  const d=new Date(),date=d.toLocaleDateString("en-AU",{day:"2-digit",month:"2-digit",year:"numeric"}),time=d.toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});
  const E=x=>String(x).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const n=left.reduce((t,[,l])=>t+l.length,0);
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>Box office ticket</title><style>@page{margin:8mm}body{font:13px/1.45 "Courier New",monospace;color:#000;width:72mm;margin:0 auto}h1{font:700 20px/1 "Courier New",monospace;text-align:center;margin:6px 0 2px;letter-spacing:.06em}.c{text-align:center;margin:0}.rule{border-top:1px dashed #000;margin:8px 0}h2{font-size:13px;margin:8px 0 2px;text-transform:uppercase}ul{list-style:none;padding:0;margin:0}li{display:flex;gap:6px}li:before{content:"[ ]"}</style></head><body><h1>MOVIE NIGHT</h1><p class="c">Now showing at your place</p><div class="rule"></div><p>BOX OFFICE TICKET<br>${E(f.title)} (${E(f.year)})<br>Serves ${E(api.serves)}<br>${date} ${time}</p><div class="rule"></div>${left.map(([g,l])=>`<h2>${E(g)}</h2><ul>${l.map(x=>`<li>${E(x)}</li>`).join("")}</ul>`).join("")}<div class="rule"></div><p>${n} item${n==1?"":"s"} to pick up</p><p class="c">Lights down. Enjoy the show.</p></body></html>`;
  const fr=document.createElement("iframe");fr.style.cssText="position:fixed;width:0;height:0;border:0;right:0;bottom:0";fr.setAttribute("aria-hidden","true");document.body.appendChild(fr);
  const doc=fr.contentWindow.document;doc.open();doc.write(html);doc.close();
  setTimeout(()=>{try{fr.contentWindow.focus();fr.contentWindow.print()}catch(e){}setTimeout(()=>fr.remove(),1500)},250);
  try{sfx.print()}catch(e){}
}

/* candy bar photo credits: real photos from Open Food Facts and Wikimedia Commons, each under its own licence */
function snackCredits(){const l=(window.SNACKS||[]).filter(x=>x.img&&x.credit);if(!l.length)return "";
  return `<details class="sc-credits"><summary>Snack photo credits</summary><p>Snack photos are real photos, cropped, used under the licences shown.</p><ul>${l.map(x=>`<li>${ESC(x.n)}: <a href="${ESC(x.credit.url)}" target="_blank" rel="noopener">${ESC(x.credit.by)}</a>, ${ESC(x.credit.lic)}</li>`).join("")}</ul></details>`}
/* the candy bar can be restored at startup before the snack counter code above is ready: draw it now that it is */
try{if(!$("viewCrave").hidden)renderSnacks()}catch(e){}
