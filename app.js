
const T={"redsauce": {"name": "Little Italy Sunday Gravy"}, "pizza": {"name": "Brooklyn Slice Joint"}, "deli": {"name": "Manhattan Deli Counter"}, "street": {"name": "Bodega and Street Cart"}, "cop": {"name": "Stakeout Snacks"}, "soul": {"name": "Soul Food Kitchen"}, "xmas": {"name": "Christmas in the City"}, "aussie": {"name": "Arvo in the Outback"}, "asian": {"name": "Chinatown Late Night"}, "scifi": {"name": "Mission Control Rations"}, "hero": {"name": "Rooftop Patrol"}, "kids": {"name": "Family Matinee"}, "teen": {"name": "Mall Food Court"}, "diner": {"name": "Roadside Diner"}, "mex": {"name": "Cantina Night"}, "tiki": {"name": "Beach House Luau"}, "uptown": {"name": "Uptown Steakhouse"}, "horror": {"name": "Midnight Monster Feast"}, "western": {"name": "Chuckwagon BBQ"}, "philly": {"name": "Philly Fight Night"}, "galaxy": {"name": "Galactic Cantina"}, "wizard": {"name": "Great Hall Feast"}, "adventure": {"name": "Explorer's Field Rations"}, "fairytale": {"name": "Storybook Banquet"}, "romcom": {"name": "Rom-Com Date Night"}};
/* every film has its own menu: T tagline, D description, P serve cue, S snacks, M mains, W sweet, K drink */
const $=id=>document.getElementById(id);
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sel=$("themeSel");
sel.innerHTML=`<option value="all">Everything (${FILMS.length} films)</option>`+
  Object.entries(T).sort((a,b)=>a[1].name.localeCompare(b[1].name)).map(([k,t])=>`<option value="${k}">${t.name} (${FILMS.filter(f=>f.theme===k).length})</option>`).join("");

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- sound: a tick per wedge and a little fanfare, off by default ---------- */
let audio=null,soundOn=false;
soundOn=true;try{soundOn=localStorage.getItem("mns-sound")!=="0"}catch(e){}
function setSoundLabel(){const b=$("sound");b.setAttribute("aria-pressed",soundOn);b.textContent=soundOn?"Sound on":"Sound off"}
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
  clunk(){if(!soundOn||!ac())return;const t=audio.currentTime;nburst(t,.03,"highpass",2500,.7,.35);thump(t+.02,110,.5,.18);nburst(t+.12,.04,"bandpass",1400,3,.25);thump(t+.16,70,.35,.14);nburst(t+.3,.7,"bandpass",420,1.2,.05,.7)},
  print(){if(!soundOn||!ac())return;const t=audio.currentTime;for(let i=0;i<14;i++)nburst(t+i*.045,.02,"bandpass",3200,4,.16);nburst(t+.7,.18,"highpass",1800,.5,.18,.2)},
  pop(){if(!soundOn||!ac())return;const t=audio.currentTime;for(let i=0;i<7;i++){const d=Math.random()*1.1;nburst(t+d,.025,"bandpass",900+Math.random()*1400,1.5,.3+Math.random()*.25)}},
  chime(){if(!soundOn||!ac())return;const t=audio.currentTime;[[1318.5,0],[987.8,.32]].forEach(([f,d])=>{const o=audio.createOscillator(),g=audio.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.12,t+d+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d+1.4);o.connect(g).connect(audio.destination);o.start(t+d);o.stop(t+d+1.5)})},
  swish(){if(!soundOn||!ac())return;const a=audio,t=a.currentTime,s=a.createBufferSource();s.buffer=noiseBuf();const f=a.createBiquadFilter();f.type="lowpass";f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(2200,t+.5);f.frequency.exponentialRampToValueAtTime(400,t+1.1);const g=a.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.35);g.gain.exponentialRampToValueAtTime(.0001,t+1.15);s.connect(f).connect(g).connect(a.destination);s.start(t,0,1.2)}
};
/* phones only allow sound after a tap: wake the audio on the first touch */
if(typeof addEventListener!=="undefined")addEventListener("pointerdown",function wake(){if(soundOn&&ac()&&audio.state==="suspended")audio.resume();removeEventListener("pointerdown",wake)},{once:true});
$("sound").addEventListener("click",()=>{soundOn=!soundOn;try{localStorage.setItem("mns-sound",soundOn?"1":"0")}catch(e){}setSoundLabel();if(soundOn&&ac()&&audio.state==="suspended")audio.resume();tick()});
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
$("watchCurrent").addEventListener("click",()=>{if(current)setWatched(current,!watched.has(current.id))});

function size(){
  const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);draw();
}
function fitText(t,max){
  if(ctx.measureText(t).width<=max)return t;
  let s=t;while(s.length>3&&ctx.measureText(s+"...").width>max)s=s.slice(0,-1);
  return s.trim()+"...";
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
    ctx.save();ctx.translate(c,c);ctx.rotate(rot+(i+.5)*A-Math.PI/2);
    ctx.fillStyle=i===winner?"#1d1404":WEDGE_INK[i%WEDGE.length];
    ctx.fillText(fitText(f.title,R*0.6),R*0.94,0);
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

function spin(){
  if(spinning||!list.length)return;
  spinning=true;sel.disabled=true;$("skipWatched").disabled=true;updateWatchButton();renderWatchList();$("spin").disabled=true;winner=-1;document.body.classList.add("spinning");document.body.classList.remove("winner");
  if(soundOn&&ac()&&audio.state==="suspended")audio.resume();
  /* refresh the wedges on the far side so every spin shows new titles, and plant the winner there */
  const far=[];for(let i=0;i<N;i++){const ang=((rot+(i+.5)*A)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);if(ang>Math.PI*.6&&ang<Math.PI*1.4)far.push(i)}
  const pool=shuffle(list);far.forEach((i,k)=>{wedges[i]=pool[k%pool.length]});
  const w=pick(far),f=list.length>far.length?pick(list):wedges[w];wedges[w]=f;
  closeCurtains();sfx.whirrStart();
  const target=-(w+0.5+(Math.random()-0.5)*0.55)*A;
  const turns=reduce?1:5+Math.floor(Math.random()*3);
  const start=rot,delta=((target-start)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)+turns*Math.PI*2;
  const over=reduce?0:A*0.45,dur=reduce?900:6200,t0=performance.now();
  const easeOut=x=>1-Math.pow(1-x,4),easeIO=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  let last=indexAt(rot);
  function frame(now){
    const p=Math.min(1,(now-t0)/dur);
    rot=p<.88?start+(delta+over)*easeOut(p/.88):start+delta+over*(1-easeIO((p-.88)/.12));
    const i=indexAt(rot);
    if(i!==last){last=i;kick=1;tick();$("now").textContent=wedges[i].title;phase++}
    kick*=0.86;setPointer();draw();
    if(p<1)requestAnimationFrame(frame);
    else{
      rot=((rot%(Math.PI*2))+Math.PI*2)%(Math.PI*2);winner=indexAt(rot);kick=0;setPointer();draw();
      spinning=false;sel.disabled=false;$("skipWatched").disabled=false;renderWatchList();$("spin").disabled=false;document.body.classList.remove("spinning");
      const win=wedges[winner];
      $("now").textContent=win.title;
      document.body.classList.add("winner");setTimeout(()=>document.body.classList.remove("winner"),1500);
      sfx.whirrStop();fanfare();
      buzz([30,50,90]);show(win,true).then(()=>leader(openCurtains));addHistory(win);
      if(window.innerWidth<900)theatre.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
    }
  }
  requestAnimationFrame(frame);
}

/* ---------- curtains and the easel tilt ---------- */
const theatre=$("theatre"),easel=$("easel");
function closeCurtains(){theatre.classList.add("closed");$("tease").textContent=pick(["Setting the table","Warming the plates","Popping the corn","Chilling the glasses","Lighting the candles"])}
/* the old film-leader countdown on the curtain before it opens */
function leader(done){
  const t=$("tease");if(reduce||!theatre.classList.contains("closed")){done();return}
  t.classList.add("leader");let n=3;const step=()=>{if(n===0){t.classList.remove("leader");done();return}t.innerHTML=`<span class="ld"><b>${n}</b></span>`;tick();n--;setTimeout(step,420)};step();
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
  const wasTop=modalStack[modalStack.length-1]===o;
  modalState.delete(o);const i=modalStack.indexOf(o);if(i!==-1)modalStack.splice(i,1);
  o.remove();if(state.onClose)state.onClose();
  if(!wasTop)return;
  const parent=modalStack[modalStack.length-1];
  const target=state.trigger;
  if(target&&target.isConnected&&typeof target.focus==="function"&&(!parent||parent.contains(target)))target.focus({preventScroll:true});
  else if(parent){const next=parent.querySelector("button:not(:disabled),input:not(:disabled),a[href],[tabindex='0']");if(next)next.focus({preventScroll:true})}
}
function dismissModal(o){if(o.open)o.close();finishModal(o)}
function mountModal(o,initial,trigger,onClose){
  modalState.set(o,{trigger,onClose});modalStack.push(o);
  /* Neutralise native dialog sizing; existing overlay classes keep their padding and visual treatment. */
  Object.assign(o.style,{margin:"0",border:"0",maxWidth:"none",maxHeight:"none",width:"100%",height:"100%",boxSizing:"border-box",color:"inherit"});
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
  const first=o.querySelector(initial);if(first)first.focus({preventScroll:true});
}

/* each film's full menu (tagline, blurb, methods, shopping, and its finished poster menu or exact recipe)
   lives in its own small file and is fetched the first time the film is opened */
const EDITIONS={},RECIPE_MENUS={};
const movieEdition=f=>EDITIONS[f.id]||null;
const movieRecipe=f=>RECIPE_MENUS[f.id]||null;
const filmFile=f=>"data/film/"+f.id.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".json";
const _filmLoads={};
function ensureExact(f){
  if(f._full)return Promise.resolve();
  if(!_filmLoads[f.id])_filmLoads[f.id]=(async()=>{
    for(let tryN=0;tryN<2;tryN++){
      try{const r=await fetch(filmFile(f));if(!r.ok)break;const d=await r.json();
        Object.assign(f,{T:d.T,D:d.D,P:d.P,S:d.S,M:d.M,W:d.W,K:d.K,_full:true});
        if(d.edition)EDITIONS[f.id]=d.edition;if(d.recipe)RECIPE_MENUS[f.id]=d.recipe;return}
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
function makeMenu(f,first){
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
      l.href=`https://fonts.googleapis.com/css2?family=${f.replace(/ /g,"+")}${w?":"+w:""}&display=swap`;
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
function cardBlurb(f,it){for(const k of ["S","M","W","K"])for(const d of f[k]||[])if(d[0]===it.n&&d[2])return shortHow(d[2]);return it.how?shortHow(it.how):""}
const AISLES=["Meat","Seafood","Deli","Produce","Dairy","Bakery","Frozen","Pantry","Drinks","Bottle shop"];
function shopGroups(menu){
  const groups={};
  const shopping=[...(menu.shopping||[...menu.s,...menu.m,...menu.w,...menu.d].flatMap(it=>it.shop||[])),...(menu.counter||[])];
  /* lists put together from several dishes add up the same item: 2 garlic cloves + 5 garlic cloves = 7 garlic cloves */
  const merge=!menu.shopping,UNIT={g:["g",1],kg:["g",1000],ml:["ml",1],l:["ml",1000],L:["ml",1000]};
  const tally={},order=[];
  shopping.forEach(x=>{
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
  case "journal":return{bg:`<div class="d-kraft"></div><div class="d-page"></div><div class="d-route" style="background-image:url('${svgURI(`<svg xmlns='http://www.w3.org/2000/svg' width='700' height='1000' viewBox='0 0 700 1000'><path d='M40 980 C 200 800, 80 640, 300 560 S 620 420, 520 220 S 300 60, 660 20' stroke='${A}' stroke-width='4' fill='none' stroke-dasharray='14 12' opacity='.18'/><path d='M640 10 l24 24 M664 10 l-24 24' stroke='${A}' stroke-width='6' opacity='.5'/></svg>`)}')"></div>`,fg:`<i class="d-tape t1"></i><i class="d-tape t2"></i><div class="d-note">Pack: ${f.S[0][0].toLowerCase()}, ${f.K[0][0].toLowerCase()}, torch.</div>`};
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
      <div class="mc-cue"><b>Showtime cue</b><span>${ESC((movieEdition(f)||{}).cue||f.P)}</span></div>
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
  if(edition&&usePoster){
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
    <div class="mc-cue"><b>Showtime cue</b><span>${ESC(f.P)}</span></div>
    <div class="mc-foot">${ESC(T[f.theme].name)} &nbsp;/&nbsp; full methods and shopping list on the prep sheet</div>
  </div>
  <div class="mc-fg">${d.fg}</div>`;
}

function prepHTML(f,menu){
  const edition=movieEdition(f);
  const L=LAYOUT[f.theme]||"storybook",c=pal(f),d=DECO(L,c,f);
  const shop=shopGroups(menu).map(([a,list])=>`<div class="pp-aisle"><h4>${a}</h4><ul>${list.map(x=>`<li><span class="pp-box"></span>${ESC(x)}</li>`).join("")}</ul></div>`).join("");
  const secs=[["Snack",menu.s],["Main",menu.m],["Sweet",menu.w],["Drink",menu.d]];
  const steps=secs.map(([l,items])=>items.map(it=>`<li><b>${ESC(it.n)}</b><em>${l}</em><span>${ESC(it.how||"")}</span></li>`).join("")).join("");
  return `<div class="mc-bg">${d.bg}</div><div class="mc-grain" style="background-image:url('${GRAIN}')"></div>
  <div class="mc-in pp">
    <div class="mc-eye">Prep sheet</div>
    <div class="pp-title">${ESC(f.title)}</div>
    ${menu.shopping?`<p class="pp-serves">Serves ${edition?edition.servings:4} &nbsp;/&nbsp; exact quantities</p>`:""}
    <div class="pp-cols"><div class="pp-shop"><h3>Shopping list</h3>${shop}</div><div class="pp-method"><h3>How to make it</h3><ol>${steps}</ol></div></div>
    <div class="mc-cue"><b>Showtime cue</b><span>${ESC(edition&&edition.cue||f.P)}</span></div>
  </div>`;
}

function styleCard(el,f){
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
  const inner=el.querySelector(".mc-in"),cols=el.querySelector(".pp-cols");
  let fs=16;cols.style.fontSize=fs+"px";
  while(inner.scrollHeight>inner.clientHeight+1&&fs>9.5){fs-=0.5;cols.style.fontSize=fs+"px"}
}
document.documentElement.style.setProperty("--grain",`url("${GRAIN}")`);
const preview=$("preview");
const card=document.createElement("div");card.className="mcard";preview.appendChild(card);
const prep=document.createElement("div");prep.className="mcard";prep.hidden=true;preview.appendChild(prep);
function scalePreview(){const pw=preview.clientWidth;if(!pw)return;const land=card.classList.contains("fmt"),kc=pw/(land?1123:794),kp=pw/794;card.style.transform=`scale(${kc})`;prep.style.transform=`scale(${kp})`;preview.style.height=(tab==="prep"?1123*kp:(land?794:1123)*kc)+"px"}
let tab="menu";
function setTab(t){tab=t;if(t==="menu")phoneOn=true;card.hidden=t!=="menu";prep.hidden=t!=="prep";$("tabMenu").classList.toggle("on",t==="menu");$("tabPrep").classList.toggle("on",t==="prep");$("tabMenu").setAttribute("aria-selected",t==="menu");$("tabPrep").setAttribute("aria-selected",t==="prep");if(t==="prep"&&current)fitPrep(prep);scalePreview();applyPhone()}
$("tabMenu").addEventListener("click",()=>setTab("menu"));
$("tabPrep").addEventListener("click",()=>setTab("prep"));
window.addEventListener("resize",()=>{scalePreview();applyPhone()});
/* era formats: phones get the big-type menu, the printed spread is one tap away */
const fmtPhone=$("fmtPhone");let phoneOn=true;
const narrow=()=>matchMedia("(max-width:700px)").matches;
function applyPhone(){
  const has=!!fmtPhone.innerHTML,on=has&&narrow()&&phoneOn&&tab==="menu";
  fmtPhone.hidden=!on;$("easel").hidden=on;$("fmtBack").hidden=!(has&&narrow()&&!phoneOn&&tab==="menu");
  if(!on)scalePreview();
}
function phoneView(f,spec,menu){
  if(!f){fmtPhone.innerHTML="";applyPhone();return}
  fmtPhone.innerHTML=fmtPhoneHTML(f,spec,menu);fmtPhoneWire(fmtPhone);
  fmtPhone.querySelector(".fp-flip").addEventListener("click",()=>{phoneOn=false;applyPhone();$("easel").scrollIntoView({block:"nearest"})});
  applyPhone();
}
$("fmtBack").addEventListener("click",()=>{phoneOn=true;applyPhone()});

let renderId=0;
async function show(f,preferSig){
  const id=++renderId;
  current=f;
  updateWatchButton();
  await ensureExact(f);
  if(id!==renderId)return;
  let menu=makeMenu(f,preferSig);if(lazy)menu=lazyMenu(menu);menu.counter=counterShop(f.id);
  $("whereWheel").innerHTML=whereHTML(f);
  try{lightboxes()}catch(e){}
  {const amb=$("ambient"),pp=lobbyPoster(f);amb.classList.remove("on");if(pp)setTimeout(()=>{if(id!==renderId)return;amb.style.backgroundImage=`url("${TMDB_IMG}w342${pp}")`;amb.classList.add("on")},reduce?0:400)}
  const edition=movieEdition(f);
  current.menu=menu;current.tag=edition?edition.tagline:f.T;
  $("reroll").hidden=!!exactMenu(f);{const sp=fmtSpec(f);$("foldPdf").hidden=!(sp&&fmtCanFold(sp))}
  $("status").textContent="";
  await ensureFonts(STY[f.theme]);
  if(id!==renderId)return;
  const spec=fmtSpec(f);
  if(spec){
    await fmtFontsReady(spec);if(id!==renderId)return;
    menu=fmtMenu(f,spec);menu.counter=counterShop(f.id);current.menu=menu;$("reroll").hidden=true;
    styleCard(card,f);card.className="mcard fmt fmt-"+spec.fmt;card.style.transform="";card.innerHTML=fmtHTML(f,spec,menu);fmtStarsPNG(card);fmtTilesPNG(card);await fmtPhotocopy(card);if(id!==renderId)return;
    try{const im=card.querySelector(".fx-poster");if(im)await im.decode()}catch(e){}
    if(id!==renderId)return;
    styleCard(prep,f);prep.classList.add("pp-sheet");prep.innerHTML=prepHTML(f,menu);
    phoneView(f,spec,menu);scalePreview();
    const refitP=()=>{if(id!==renderId)return;const b=prep.hidden;prep.hidden=false;fitPrep(prep);prep.hidden=b};
    refitP();await document.fonts.ready;refitP();
    return;
  }
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
  if(edition&&(!lobby||!ok)){ok=await tryArt("edition","mcard poster-edition",".poster-art");if(id!==renderId)return}
  if(!lobby&&!edition)card.innerHTML=cardHTML(f,menu,current.tag,false);
  else if(!ok){
    styleCard(card,f);card.style.transform="";card.innerHTML=cardHTML(f,menu,current.tag,false);
    $("status").textContent="The poster couldn't load. Your menu and prep sheet are still available.";
  }
  card.classList.toggle("is-lazy",!!menu.lazy);
  styleCard(prep,f);prep.classList.add("pp-sheet");
  prep.innerHTML=prepHTML(f,menu);
  scalePreview();
  const refit=()=>{if(id!==renderId)return;const a=card.hidden,b=prep.hidden;card.hidden=false;prep.hidden=false;fit(card);fitPrep(prep);card.hidden=a;prep.hidden=b};
  refit();
  await document.fonts.ready;refit();
}
function replay(f){closeCurtains();setTimeout(()=>show(f,true).then(openCurtains),reduce?0:900);$("now").textContent=f.title}

/* history */
let hist=[];
try{hist=JSON.parse(localStorage.getItem("mns-hist")||"[]")}catch(e){hist=[]}
function renderHist(){
  const box=$("chips");
  const items=hist.map(id=>FILMS.find(f=>f.id===id)).filter(Boolean);
  if(!items.length){box.innerHTML='<span class="empty">Nothing yet. Your picks land here.</span>';return}
  box.innerHTML="";
  items.forEach(f=>{const b=document.createElement("button");b.className="ticket";b.type="button";b.innerHTML=`<small>Admit one</small>${ESC(f.title)}`;b.addEventListener("click",()=>replay(f));box.appendChild(b)});
}
function addHistory(f){
  hist=[f.id,...hist.filter(x=>x!==f.id)].slice(0,8);
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
const weekTime=time=>/^(?:17|18|19|20):(?:00|30)$|^21:00$/.test(time)?time:"19:00";
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
const saveWeek=()=>{try{week?localStorage.setItem("mns-week",JSON.stringify(week)):localStorage.removeItem("mns-week")}catch(e){}if(typeof queueSync==="function")queueSync()};
function cookDate(now=new Date()){
  const d=parseWeekDate(week.date);
  /* UTC is used only to count calendar labels, never to parse a local date. */
  const days=(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/864e5;
  return [d,days];
}
function renderWeek(){
  const box=$("weekPanel");const f=week&&FILMS.find(x=>x.id===week.id);
  if(!f){box.hidden=true;box.innerHTML="";renderMotw();return}
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];const [d,n]=cookDate();
  const when=n===0?"<b>Tonight</b>":n===1?"<b>Tomorrow</b>":n<0?`<b>${-n} day${n===-1?"":"s"} ago</b>`:`<b>${n} days to go</b>`;
  box.hidden=false;
  box.innerHTML=`${p?`<img alt="" src="https://image.tmdb.org/t/p/w154${ESC(p)}">`:"<span></span>"}<p class="week-k">This week's film</p><p class="week-t">${ESC(f.title)} (${f.year})${week.double&&FILMS.find(x=>x.id===week.double)?` + ${ESC(FILMS.find(x=>x.id===week.double).title)}`:""}</p><p class="week-when">Cook night <select id="weekDay" aria-label="Cook night">${[5,6,0].map(i=>`<option value="${i}"${i===week.day?" selected":""}>${DAYS[i]}</option>`).join("")}</select> ${d.getDate()} ${d.toLocaleString("en-AU",{month:"short"})}, ${when} &nbsp;Showtime <select id="weekTime" class="week-time" aria-label="Showtime">${SHOWTIMES.map(t=>`<option value="${t}"${t===(week.time||"19:00")?" selected":""}>${clock(t)}</option>`).join("")}</select></p><p class="week-count" id="weekCount" aria-live="polite"></p><div class="week-acts"><button class="go" type="button" id="weekShop">Shopping list</button><button type="button" id="weekOpen">Open the menu</button><button type="button" id="weekClear">Clear</button></div>`;
  $("weekDay").addEventListener("change",e=>{week.day=weekDay(e.target.value);week.date=nextWeekDate(week.day,week.time);saveWeek();renderWeek()});
  $("weekTime").addEventListener("change",e=>{week.time=e.target.value;saveWeek();tickShowtime()});
  tickShowtime();renderMotw();
  $("weekShop").addEventListener("click",async()=>{const g=week.double&&FILMS.find(x=>x.id===week.double);if(g){const dm=await doubleMenu(f,g);openTrolley(f,dm,`${f.title} + ${g.title}`)}else openTrolley(f)});
  $("weekOpen").addEventListener("click",()=>{setView("wheel");replay(f);$("theatre").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});
  $("weekClear").addEventListener("click",()=>{week=null;saveWeek();renderWeek();$("status").textContent="This week's film cleared."});
}
/* Countdown to the scheduled showtime. Cooking times belong to the individual recipes. */
const SHOWTIMES=["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
const clock=t=>{const [h,m]=t.split(":").map(Number);return `${h%12||12}${m?":"+String(m).padStart(2,"0"):""}${h<12?"am":"pm"}`};
let _showT=null;
function tickShowtime(){
  clearTimeout(_showT);const el=$("weekCount");if(!el||!week)return;
  const [d]=cookDate(),[h,m]=(week.time||"19:00").split(":").map(Number);const at=new Date(d);at.setHours(h,m,0,0);
  const now=new Date(),ms=at-now;
  const span=x=>{const mins=Math.max(0,Math.ceil(x/6e4)),dd=Math.floor(mins/1440),hh=Math.floor(mins%1440/60),mm=mins%60;return dd?`${dd} day${dd>1?"s":""}${hh?` ${hh}h`:""}`:hh?`${hh}h ${mm}m`:`${mm} min`};
  if(ms<0)el.innerHTML=`Scheduled showtime has passed. <span>Open your menu or lock in a new movie night.</span>`;
  else if(ms===0)el.innerHTML=`Showtime. <span>Lights down, press play when you're ready.</span>`;
  else el.innerHTML=`Showtime in ${span(ms)}. <span>Check each recipe for cooking times and make-ahead steps.</span>`;
  _showT=setTimeout(tickShowtime,30000);
}
/* menu of the week: the printed era menus take turns, a new one every Monday */
function weekNo(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y)/864e5+1)/7)+t.getUTCFullYear()*53}
const MOTW_KIND={workorder:"A firehouse work order",lanes:"A league night score sheet",market:"The corner market wall",takeaway:"A Chinatown takeaway trifold",diner:"The Wazoo Diner trifold",casefile:"A Prohibition case file",noodle:"Mr Ping's noodle shop wall",slims:"The Jack Rabbit Slim's menu",nero:"A Little Nero's pizza box",lous:"The Lou's Cafe letter board",pad:"Henry's notepad, May 1980"};
function renderMotw(){
  const box=$("motw");if(!box||typeof FMT_FILMS==="undefined")return;
  const ids=Object.keys(FMT_FILMS).filter(id=>FILMS.some(f=>f.id===id)&&(!kidsMode||isKidSafe(FILMS.find(f=>f.id===id)))).sort();
  if(!ids.length){box.hidden=true;return}
  const f=FILMS.find(x=>x.id===ids[weekNo(new Date())%ids.length]);
  if(week&&week.id===f.id){box.hidden=true;return}
  const sp=FMT_FILMS[f.id],p=lobbyPoster(f);
  box.hidden=false;
  box.innerHTML=`${p?`<img alt="" src="https://image.tmdb.org/t/p/w154${ESC(p)}" loading="lazy">`:"<span></span>"}<p class="week-k">Menu of the week</p><p class="week-t">${ESC(f.title)} (${f.year})<small>${ESC(MOTW_KIND[sp.fmt]||"A printed menu from the film")}</small></p><div class="week-acts"><button class="go" type="button" id="motwOpen">Open the menu</button><button type="button" id="motwLock">Lock it in</button></div>`;
  $("motwOpen").addEventListener("click",()=>{setView("wheel");replay(f);addHistory(f);$("theatre").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});
  $("motwLock").addEventListener("click",()=>{setWeek(f);replay(f)});
}
function setWeek(f){week=newWeekPlan(f.id);saveWeek();renderWeek();updateWatchButton();$("status").textContent=`${f.title} is locked in for this week.`}
function listText(f,groups){return `${f.title} (${f.year}) shopping list, serves 4\n`+groups.map(([a,l])=>`\n${a}\n${l.map(x=>"- "+x).join("\n")}`).join("\n")}
const trolleySessionTicks=new Map();
async function openTrolley(f,menuOverride,label){
  const modalTrigger=document.activeElement;
  await ensureExact(f);
  const mm=makeMenu(f,true);mm.counter=counterShop(f.id);
  const groups=shopGroups(menuOverride||mm);const all=groups.flatMap(([,l])=>l);
  const o=document.createElement("dialog");o.className="trolley";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`Shopping list for ${f.title}`);
  const sessionKey=JSON.stringify([f.id,label||""]);
  if(!trolleySessionTicks.has(sessionKey))trolleySessionTicks.set(sessionKey,Object.create(null));
  const ticks=()=>week&&week.id===f.id?(week.ticks||(week.ticks={})):trolleySessionTicks.get(sessionKey);
  o.innerHTML=`<div class="trolley-in"><h3>${ESC(label||f.title)}</h3><p class="tp" id="tProg"></p><div class="bar"><i id="tBar"></i></div>${groups.map(([a,l])=>`<h4>${ESC(a)}</h4><ul>${l.map(x=>`<li><label><input type="checkbox" data-k="${ESC(x)}"${ticks()[x]?" checked":""}><span>${ESC(x)}</span></label></li>`).join("")}</ul>`).join("")}<div class="acts"><button class="go" type="button" data-a="share">Send to Notes or Reminders</button><button type="button" data-a="reset">Untick all</button><button type="button" data-a="done">Done</button></div><p class="msg" id="tMsg" role="status"></p></div>`;
  const prog=()=>{const n=all.filter(x=>ticks()[x]).length;o.querySelector("#tProg").textContent=`${n} of ${all.length} in the trolley. Serves 4.`;o.querySelector("#tBar").style.width=(all.length?100*n/all.length:0)+"%"};
  o.addEventListener("change",e=>{const k=e.target.dataset.k;if(!k)return;ticks()[k]=e.target.checked;if(week&&week.id===f.id)saveWeek();o.querySelector("#tMsg").textContent="";prog()});
  const close=()=>dismissModal(o);
  o.addEventListener("click",async e=>{
    if(e.target===o)return close();const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==="done")close();
    if(a==="reset"){const checked=ticks();all.forEach(k=>delete checked[k]);if(week&&week.id===f.id)saveWeek();o.querySelectorAll("input").forEach(i=>i.checked=false);o.querySelector("#tMsg").textContent="";prog()}
    if(a==="share"){const left=groups.map(([g,l])=>[g,l.filter(x=>!ticks()[x])]).filter(([,l])=>l.length);if(!left.length){o.querySelector("#tMsg").textContent=all.length?"Everything is in the trolley. Nothing left to send.":"This shopping list is empty.";return}const text=listText(f,left);
      try{if(navigator.share){await navigator.share({title:`${f.title} shopping list`,text});o.querySelector("#tMsg").textContent="Sent."}else{await navigator.clipboard.writeText(text);o.querySelector("#tMsg").textContent="Copied. Paste it into Notes or Reminders."}}
      catch(err){if(!(err&&err.name==="AbortError"))o.querySelector("#tMsg").textContent="Couldn't share from here. Use Copy text under the menu instead."}}
  });
  if(!(week&&week.id===f.id))o.querySelector(".tp").insertAdjacentHTML("afterend",'<p class="tp">Lock this film in for the week to save your ticks.</p>');
  mountModal(o,"input,button",modalTrigger);prog();
}
$("weekSet").addEventListener("click",()=>{if(current)setWeek(current)});

/* video shop: browse every film like a rental store */
const SHOP_AISLES=[["Action and cops",["cop","street","philly"]],["Superheroes",["hero"]],["Sci-fi",["scifi","galaxy"]],["Horror",["horror"]],["Family",["kids","fairytale"]],["Fantasy and adventure",["wizard","adventure"]],["Comedy and teen",["teen","diner"]],["Romance",["romcom"]],["Crime and mob",["redsauce","deli","pizza"]],["Drama",["uptown","soul"]],["Westerns",["western"]],["Around the world",["aussie","asian","mex","tiki"]],["Holiday",["xmas"]]];
const SHOP_AISLE_OF={};SHOP_AISLES.forEach(([n,ts])=>ts.forEach(t=>SHOP_AISLE_OF[t]=n));
const TMDB_IMG_SHOP="https://image.tmdb.org/t/p/";
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const hashN=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const isPick=f=>hashN(f.id)%9===0,isNew=f=>+f.year>=2020;
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
 {id:"newyear",name:"New Year's Eve",note:"Films with a countdown to midnight in them. Bubbles on ice.",c:["#d9b54a","#1a1408","#8a6d1c"],win:y=>[dAt(y,11,27),dAt(y+1,0,2),dAt(y,11,31)],has:byTitle(["New Year's Eve","When Harry Met Sally...","Trading Places","Bridget Jones's Diary","About Time","Holiday Inn","The Godfather Part II","Forrest Gump"])},
 {id:"ausday",name:"Australia Day",note:"Home-grown films for the long weekend. Snags on the barbie.",c:["#1f8a4c","#fff","#0f4a28"],win:y=>[dAt(y,0,19),dAt(y,0,26)],has:byTheme("aussie")},
 {id:"lunar",name:"Lunar New Year",note:"Dumplings, noodles and a full table for the new year.",c:["#d4202c","#ffd23f","#7a0f16"],win:y=>{const l=LUNAR[y];if(!l)return null;const d=dAt(y,l[0],l[1]);return[addD(d,-7),addD(d,7),d]},has:byTheme("asian")},
 {id:"valentine",name:"Valentine's Day",note:"Love stories for the couch. Share the popcorn.",c:["#e8457a","#fff","#8f1d45"],win:y=>[dAt(y,1,7),dAt(y,1,14)],has:byTheme("romcom")},
 {id:"pancake",name:"Pancake Day",note:"Every film with pancakes or waffles on the menu. Shrove Tuesday only comes once a year.",c:["#e0a43a","#2a1606","#8a5a12"],win:y=>{const d=addD(easterOf(y),-47);return[addD(d,-3),d]},has:dishHit(/pancake|waffle|cr[eê]pe|flapjack|hotcake|pikelet/i)},
 {id:"easter",name:"Easter",note:"Bunnies, chocolate and long weekend lunches.",c:["#9b7be0","#fff","#53388f"],win:y=>{const e=easterOf(y);return[addD(e,-9),addD(e,1),e]},has:byTitle(["Hop","Peter Rabbit","Peter Rabbit 2: The Runaway","Rise of the Guardians","Easter Parade","Easter Sunday","Charlie and the Chocolate Factory","Willy Wonka & the Chocolate Factory","Zootopia","Who Framed Roger Rabbit","Wallace & Gromit: The Curse of the Were-Rabbit","Alice in Wonderland","Chicken Run","Bambi"])},
 {id:"anzac",name:"ANZAC Day",note:"Lest we forget. Anzac biscuits and a cuppa.",c:["#b3202a","#fff","#5c0f14"],win:y=>[dAt(y,3,18),dAt(y,3,25)],has:byTitle(["Gallipoli","The Lighthorsemen","Beneath Hill 60","Danger Close: The Battle of Long Tan","The Water Diviner","Australia"])},
 {id:"starwars",name:"Star Wars Day",note:"May the fourth be with you.",c:["#ffe81f","#000","#8a7d00"],win:y=>[dAt(y,4,1),dAt(y,4,4)],has:byTheme("galaxy")},
 {id:"mum",name:"Mother's Day",note:"For mum. She picks the film and nobody argues.",c:["#f08bb0","#3a0a1e","#a3456b"],win:y=>{const d=nthDay(y,4,0,2);return[addD(d,-7),d]},has:byTitle(["Mother's Day","Mamma Mia!","Freaky Friday","Lady Bird","Waitress","Juno","The Blind Side","Moana","Brave","Coco","Turning Red","Everything Everywhere All at Once","The Incredibles","Tangled","The Family Stone","Lilo & Stitch","Julie & Julia","Matilda","Mary Poppins","Easter Sunday","The Farewell","Crazy Rich Asians"])},
 {id:"xmasjuly",name:"Christmas in July",note:"It's cold enough. Roast on, tree up, Christmas films back out.",c:["#2f7a4f","#fff","#164029"],win:y=>[dAt(y,6,1),dAt(y,6,31),dAt(y,6,1)],has:byTheme("xmas")},
 {id:"dad",name:"Father's Day",note:"Dad's pick. Dad jokes included.",c:["#2d6fd1","#fff","#163a73"],win:y=>{const d=nthDay(y,8,0,1);return[addD(d,-7),d]},has:byTitle(["Father of the Bride","Field of Dreams","Big Daddy","Big Fish","Daddy's Home","Hook","Finding Nemo","Indiana Jones and the Last Crusade","Chef","Taken","Jingle All the Way","National Lampoon's Vacation","The Lion King","Interstellar","Mrs. Doubtfire","Back to the Future","Uncle Buck","The Great Outdoors","Guardians of the Galaxy Vol. 2","The Incredibles","Rudy","The Castle"])},
 {id:"footy",name:"Finals season",note:"Sports films for footy finals month. Pies at half time.",c:["#1c3f94","#ffd23f","#0c1f4d"],win:y=>[dAt(y,8,1),dAt(y,8,30),dAt(y,8,1)],has:byTitle(["Remember the Titans","Rudy","Field of Dreams","Major League","BASEketball","Semi-Pro","Kicking & Screaming","Dodgeball: A True Underdog Story","The Mighty Ducks","Cool Runnings","The Blind Side","Happy Gilmore","The Waterboy","Rocky","Rocky II","Rocky III","Rocky IV","Creed","Space Jam","Blades of Glory","Talladega Nights: The Ballad of Ricky Bobby","Caddyshack","Bull Durham","Jerry Maguire","Little Giants","The Sandlot","The Fighter","Raging Bull","Million Dollar Baby","Kingpin","Hot Rod","The Karate Kid"])},
 {id:"pirate",name:"Talk Like a Pirate Day",note:"Arr. Pirates, treasure maps and the high seas.",c:["#222","#f4e3b5","#000"],win:y=>[dAt(y,8,13),dAt(y,8,19)],has:byTitle(["Pirates of the Caribbean: The Curse of the Black Pearl","Pirates of the Caribbean: Dead Man's Chest","Pirates of the Caribbean: At World's End","Hook","The Goonies","Muppet Treasure Island","Treasure Planet","The Princess Bride","Peter Pan","Moana","National Treasure"])},
 {id:"bttf",name:"Back to the Future Day",note:"21 October 2015 came and went. Time travel films all week.",c:["#2fb7ff","#0b1236","#12608a"],win:y=>[dAt(y,9,15),dAt(y,9,21)],has:byTitle(["Back to the Future","Back to the Future Part II","Back to the Future Part III","Bill & Ted's Excellent Adventure","Groundhog Day","Hot Tub Time Machine","Time Bandits","About Time","The Terminator","Terminator 2: Judgment Day","Edge of Tomorrow","Interstellar","Palm Springs","Kate & Leopold","13 Going on 30","Avengers: Endgame","X-Men: Days of Future Past","Harry Potter and the Prisoner of Azkaban","Meet the Robinsons","Napoleon Dynamite","Frequency","Men in Black 3"])},
 {id:"halloween",name:"Halloween",note:"Two shelves: one for the kids, one for after they're in bed.",c:["#ff7a1a","#2a0b3d","#a8440a"],win:y=>[dAt(y,9,1),dAt(y,10,1),dAt(y,9,31)],rows:list=>halloweenRows(list).filter(r=>!(kidsMode&&r[0]==="Halloween: late show"))},
 {id:"cup",name:"Melbourne Cup",note:"The race that stops a nation. Fascinators optional.",c:["#c9962c","#1b0f0a","#6e4f12"],win:y=>{const d=nthDay(y,10,2,1);return[addD(d,-6),d]},has:byTitle(["Phar Lap","Seabiscuit","The Man from Snowy River"])},
 {id:"xmas",name:"Christmas",note:"Pop the tree lights on and pick one.",c:["#c8102e","#fff","#7a0a1c"],cls:"festive",win:y=>[dAt(y,11,1),dAt(y,11,26),dAt(y,11,25)],has:byTheme("xmas")}
];
const dayStart=d=>dAt(d.getFullYear(),d.getMonth(),d.getDate());
function seasonState(now){
  const t=dayStart(now||new Date()),y=t.getFullYear();
  return SEASONS.map(s=>{let on=false,next=null,day=null;
    for(const yy of[y-1,y,y+1]){const w=s.win(yy);if(!w)continue;const[a,b,c]=w;if(t>=a&&t<=b)on=true;if(a>t&&(!next||a<next)){next=a;day=c||b}}
    return{s,on,next,day}});
}
const daysTo=d=>Math.round((d-dayStart(new Date()))/864e5);
const fmtDay=d=>d.toLocaleDateString("en-AU",{day:"numeric",month:"short"});
function seasonRows(s,list,later){
  const st=`--sg:${s.c[0]};--sf:${s.c[1]};--ss:${s.c[2]}`;
  if(s.rows)return s.rows(list).map(r=>[r[0],r[1],later?`Back on ${fmtDay(later)}. ${r[2]}`:r[2],"season "+(r[3]||"")+(later?" later":""),st,s.id]);
  const r=list.filter(s.has).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));
  return r.length?[[s.name,r,later?`Back on ${fmtDay(later)}. ${s.note}`:s.note,"season "+(s.cls||"")+(later?" later":""),st,s.id]]:[];
}
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
let outDay="",outSet=new Set();
const isOut=f=>{const k=todayKey();if(k!==outDay){outDay=k;outSet=new Set(FILMS.filter(x=>isNew(x)&&!watched.has(x.id)).sort((a,b)=>hashN(a.id+k)-hashN(b.id+k)).slice(0,3).map(x=>x.id))}return outSet.has(f.id)};
const isClam=f=>f.theme==="kids"||f.theme==="fairytale";
const isTuesday=()=>new Date().getDay()===2;
const priceOf=f=>isNew(f)?(isTuesday()?2:7):2;
const priceTag=f=>isNew(f)?(isTuesday()?"Tuesday $2":"Overnight $7"):"Weekly $2";
const STAFF=["Kate","Sam","Dave","Michelle","Andrew","Lisa","Ben","Nicole"];
const TALK={"Action and cops":["Turn it up.","Still holds up.","Proper Friday night film."],"Superheroes":["Stay for the end credits.","Better than you remember.","Big screen energy."],"Sci-fi":["Watch it twice.","Still holds up.","Lights down for this one."],"Horror":["Lights off. Doors locked.","Not one for the kids.","Watch it with company."],"Family":["One for the whole house.","Kids will want it again.","Grown-ups will love it too."],"Fantasy and adventure":["Settle in for this one.","Pure Saturday afternoon.","Still holds up."],"Comedy and teen":["Quote it all week.","Better with a crowd.","Still makes me laugh."],"Romance":["Have the tissues handy.","Date night sorted.","Better than you remember."],"Crime and mob":["Don't skip the ending.","Clear your evening.","A proper classic."],"Drama":["Worth the slow start.","Have the tissues handy.","Stays with you."],"Westerns":["Saddle up.","A proper classic.","Watch it on the big telly."],"Around the world":["Something different tonight.","Worth the subtitles.","A hidden gem."],"Holiday":["Put the tree lights on.","Every year without fail.","One for the whole house."]};
const talkFor=f=>{const h=hashN(f.id+"t"),a=SHOP_AISLE_OF[f.theme]||"Drama",L=(a==="Horror"&&isKidSafe(f))?["Spooky, not scary.","Fine with the kids up.","A Halloween regular."]:(TALK[a]||TALK.Drama);return [STAFF[h%STAFF.length],L[(h>>>3)%L.length]]};
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
function renderMember(){
  const box=$("memberCard");if(!box)return;
  const since=new Date(member.since).toLocaleString("en-AU",{month:"short",year:"numeric"});
  const fav=Object.entries(member.aisles||{}).sort((a,b)=>b[1]-a[1])[0];
  const outList=(member.out||[]).filter(r=>!watched.has(r.id)).map(r=>({r,f:FILMS.find(x=>x.id===r.id)})).filter(x=>x.f);
  const late=lateFees();const owe=late.reduce((n,x)=>n+Math.min(x.days,10),0);
  const fee=late.length?`Late fees: $${owe}.00 on ${late.slice(0,2).map(x=>x.f.title).join(" and ")}${late.length>2?` and ${late.length-2} more`:""}. Mark it seen to clear the slate.`:"Late fees: none. Good member.";
  box.innerHTML=`<div class="member-logo" aria-hidden="true">SV</div><p class="member-k">Spinner Video member</p><input id="memberName" type="text" maxlength="28" autocomplete="off" aria-label="Name on your member card" placeholder="Tap to write your name" value="${ESC(member.name||"")}"><p class="member-meta"><span>No. ${member.no.slice(0,3)} ${member.no.slice(3)}</span><span>Since ${since}</span><span>Rentals ${member.rentals||0}</span>${fav?`<span>Usually in ${ESC(fav[0])}</span>`:""}</p><p class="member-fee${late.length?" owing":""}">${ESC(fee)}</p>${outList.length?`<ul class="member-out">${outList.map(({f,r})=>`<li><span>${ESC(f.title)}, due ${new Date(r.due).toLocaleString("en-AU",{weekday:"short",day:"numeric",month:"short"})}</span><button type="button" data-ret="${ESC(f.id)}">Return</button></li>`).join("")}</ul>`:""}<div class="member-sync">${member.pin?`<p id="syncNote">${ESC(syncNote())}</p><button type="button" data-sync="out">Sign out here</button>`:`<button type="button" data-sync="join">Put my card online</button><button type="button" data-sync="in">Use my card from another device</button>`}</div>`;
  $("memberName").addEventListener("change",e=>{member.name=e.target.value.trim();saveMember();renderShop()});
  box.querySelectorAll("[data-ret]").forEach(b=>b.addEventListener("click",()=>{const f=FILMS.find(x=>x.id===b.dataset.ret);if(f)openChute(f)}));
  box.querySelectorAll("[data-sync]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.sync;if(k==="out"){delete member.pin;try{localStorage.setItem("mns-member",JSON.stringify(member))}catch(e){}renderMember()}else openSyncForm(k)}));
}
function dueBack(f){
  const d=new Date();
  if(isNew(f)){d.setDate(d.getDate()+1)}else{d.setDate(d.getDate()+7)}
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
    <span class="hc-label fit" style="left:57.17%;top:9.83%;width:31.86%;height:8.38%"><span class="fit-t">SV ${String(hashN(f.id)%9000+1000)}</span><small>Spinner Video</small></span>
    <span class="hc-dymo fit" style="--dr:${(-r*.8).toFixed(2)}deg"><span class="fit-t">${ESC(title)}</span></span>
    <span class="hc-rewind">Be kind, rewind</span>
  </div>`;
}
function openSlip(f,go){
  const modalTrigger=document.activeElement;setTimeout(()=>sfx.print(),350);
  const due=dueBack(f),now=new Date();const picked=new Set(counter[f.id]||[]);
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`Rental slip for ${f.title}`);
  const fmt=d=>d.toLocaleString("en-AU",{weekday:"short",day:"numeric",month:"short"});
  o.innerHTML=`<div class="slip"><h3>Spinner Video</h3><p class="c">Open 7 days. Till late.</p><hr><dl><dt>Member</dt><dd>${member.name?ESC(member.name):"No. "+member.no}</dd><dt>Date</dt><dd>${fmt(now)}</dd><dt>Title</dt><dd>${ESC(f.title)} (${f.year})</dd><dt>Hire</dt><dd>${isNew(f)?(isTuesday()?"New release, $2 Tuesday":"New release, overnight"):"Weekly"} $${priceOf(f).toFixed(2)}</dd><dt>Due back</dt><dd>${fmt(due)}, 7pm</dd><dt>Paid</dt><dd>$10 note, change $${(10-priceOf(f)).toFixed(2)}</dd></dl>${hireCaseHTML(f)}<p class="hc-k">Box swapped for a hire case. The cover's been in that sleeve since the shop opened.</p><button type="button" class="peek" data-a="peek" aria-expanded="false">Preview the menu</button><div class="peekbox" hidden></div><div class="stamp" aria-hidden="true">Be kind<br>please rewind</div><hr><h4>Anything from the counter?</h4><div class="lollies">${Object.entries(COUNTER).map(([k,[n]])=>`<label><input type="checkbox" value="${k}"${picked.has(k)?" checked":""}> ${n}</label>`).join("")}</div><p class="small">Ticked treats go on this film's shopping list.</p><hr><p class="c">Late fee $1 a day. No drop box after 10pm.</p><div class="acts"><button type="button" data-a="back">Put it back</button><button type="button" class="go" data-a="go">Roll the film</button></div></div>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{
    if(e.target===o)return close();
    const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
    if(a==="back")return close();
    if(a==="peek"){const box=o.querySelector(".peekbox"),btn=e.target,open=box.hidden;
      if(open&&!box.innerHTML){const sp=typeof fmtSpec==="function"&&fmtSpec(f);const m=sp?fmtMenu(f,sp):makeMenu(f,true);
        const list=sp?m.all:[...m.s,...m.m,...m.w,...m.d];
        box.innerHTML=`<h4>Tonight's menu</h4><ol>${list.map(it=>`<li><b>${ESC(it.label||it.n)}</b><span>${ESC(it.film||it.note||"")}</span></li>`).join("")}</ol><p class="small">Serves four. Full menu, method and shopping list once you roll the film.</p>`}
      box.hidden=!open;btn.setAttribute("aria-expanded",open);btn.textContent=open?"Hide the menu":"Preview the menu";return}
    counter[f.id]=[...o.querySelectorAll(".lollies input:checked")].map(i=>i.value);
    if(!counter[f.id].length)delete counter[f.id];
    try{localStorage.setItem("mns-counter",JSON.stringify(counter))}catch(err){}
    member.rentals=(member.rentals||0)+1;
    const aisle=SHOP_AISLE_OF[f.theme];if(aisle)member.aisles[aisle]=(member.aisles[aisle]||0)+1;
    member.out=[{id:f.id,due:due.getTime()},...(member.out||[]).filter(r=>r.id!==f.id)].slice(0,6);
    saveMember();renderMember();buzz(30);
    close();go();
  });
  mountModal(o,".go",modalTrigger);
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
      o.querySelector(".chute").classList.add("dropped");buzz([15,60,25]);
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
async function doubleMenu(a,b){
  await ensureExact(a);await ensureExact(b);
  const A=makeMenu(a,true),B=makeMenu(b,true);
  const pickIt=(menu,it,film)=>Object.assign({},it,{film:film.title,shop:itemShop(menu,it)});
  const m={s:[pickIt(A,A.s[0],a),pickIt(B,B.s[0],b)],m:[pickIt(A,A.m[0],a)],w:[pickIt(B,B.w[0],b)],d:[A.d[0]&&pickIt(A,A.d[0],a),B.d[0]&&pickIt(B,B.d[0],b)].filter(Boolean)};
  m.counter=[...new Set([...counterShop(a.id),...counterShop(b.id)])];
  return m;
}
function pairFor(a,pool){
  const others=pool.filter(f=>f.id!==a.id);
  const sameTheme=others.filter(f=>f.theme===a.theme);
  const sameAisle=others.filter(f=>SHOP_AISLE_OF[f.theme]&&SHOP_AISLE_OF[f.theme]===SHOP_AISLE_OF[a.theme]);
  const near=x=>x.filter(f=>Math.abs(+f.year-+a.year)<=12);
  const c=[near(sameTheme),sameTheme,near(sameAisle),sameAisle,others].find(x=>x.length);
  return c?c[Math.floor(Math.random()*c.length)]:null;
}
async function openDouble(pa,pb){
  const modalTrigger=document.activeElement;
  if(pa&&!pa.id)pa=null;
  const pool=list.length>1?list:FILMS.filter(f=>!kidsMode||isKidSafe(f));
  const a=pa||pool[Math.floor(Math.random()*pool.length)],b=pb||pairFor(a,pool);if(!b)return;
  const m=await doubleMenu(a,b);
  const img=f=>{const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];return p?`<img alt="${ESC(f.title)} poster" src="https://image.tmdb.org/t/p/w342${ESC(p)}">`:""};
  const li=it=>`<li>${ESC(it.n)} <small>(${ESC(it.film)})</small></li>`;
  const o=document.createElement("dialog");o.className="trolley";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Double feature");
  o.innerHTML=`<div class="df"><h3>Tonight's double feature</h3><div class="df-pair"><figure>${img(a)}<figcaption><b>First up</b>${ESC(a.title)} (${a.year})</figcaption></figure><span class="df-amp" aria-hidden="true">+</span><figure>${img(b)}<figcaption><b>Then</b>${ESC(b.title)} (${b.year})</figcaption></figure></div><p class="msg">One menu for both films, serves 4. A snack and a drink from each, the main from the first film and dessert at intermission.</p><h4>Snacks</h4><ul>${m.s.map(li).join("")}</ul><h4>Main</h4><ul>${m.m.map(li).join("")}</ul><h4>Intermission dessert</h4><ul>${m.w.map(li).join("")}</ul><h4>To drink</h4><ul>${m.d.map(li).join("")}</ul><div class="acts"><button class="go" type="button" data-a="lock">Lock in for the week</button><button type="button" data-a="shop">Shopping list</button><button type="button" data-a="again">Spin again</button><button type="button" data-a="first">Open first film</button><button type="button" data-a="done">Done</button></div><p class="msg" role="status" id="dfMsg"></p></div>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{
    if(e.target===o)return close();const k=e.target.dataset&&e.target.dataset.a;if(!k)return;
    if(k==="done")close();
    if(k==="again"){close();openDouble()}
    if(k==="first"){close();setView("wheel");replay(a);addHistory(a);$("theatre").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}
    if(k==="shop")openTrolley(a,m,`${a.title} + ${b.title}`);
    if(k==="lock"){week=newWeekPlan(a.id,b.id);saveWeek();renderWeek();o.querySelector("#dfMsg").textContent="Locked in. It's on your This week panel with one shopping list for both."}
  });
  mountModal(o,".go",modalTrigger);buzz([20,40,20]);
}
$("dfBtn").addEventListener("click",openDouble);

/* sync: member number + PIN, stored in Supabase through an edge function (no keys in this page) */
const SYNC_URL="https://skxiumrqinvpauwkljwn.supabase.co/functions/v1/mns-sync";
var syncTimer=null,syncState="";
async function syncCall(body){
  const r=await fetch(SYNC_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok)throw new Error("sync");return r.json();
}
function syncPayload(){
  const {pin,...m}=member;
  return {v:1,member:m,watched:[...watched],skip:skipWatched,hist,week,counter,kids:kidsMode};
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
  if(typeof d.kids==="boolean")kidsMode=d.kids;
  try{localStorage.setItem("mns-member",JSON.stringify(member));localStorage.setItem("mns-watched",JSON.stringify([...watched]));localStorage.setItem("mns-hist",JSON.stringify(hist));localStorage.setItem("mns-counter",JSON.stringify(counter));if(week)localStorage.setItem("mns-week",JSON.stringify(week));else localStorage.removeItem("mns-week");localStorage.setItem("mns-kids",kidsMode?"1":"0")}catch(e){}
  renderHist();renderWeek();setKidsUI();if(!spinning){setList();updateWatchButton()}if(!$("viewShop").hidden)renderShop();
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
function syncNote(){return syncState==="offline"?"Couldn't reach the card system. Your changes are saved on this device and will go up next time.":syncState==="badpin"||syncState==="locked"?"Your PIN didn't match. Sign out and sign in again to keep syncing.":`Synced. Use No. ${member.no.slice(0,3)} ${member.no.slice(3)} and your PIN on any other device.`}
function openSyncForm(mode){
  const modalTrigger=document.activeElement;
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  const join=mode==="join";
  o.setAttribute("aria-label",join?"Put your card online":"Use your card from another device");
  o.innerHTML=`<form class="syncbox"><h3>${join?"Put my card online":"Use my card here"}</h3><p>${join?`Pick a 4-digit PIN. Then on any other device, enter No. ${member.no.slice(0,3)} ${member.no.slice(3)} and this PIN to bring your card, ticks and rentals across.`:"Enter the member number from your card on the other device, and your PIN. Anything on this device gets merged in."}</p>${join?"":`<label for="sNo">Member number</label><input id="sNo" inputmode="numeric" autocomplete="off" maxlength="7" required>`}<label for="sPin">PIN</label><input id="sPin" type="password" inputmode="numeric" autocomplete="off" maxlength="4" required><p class="err" id="sErr" role="alert"></p><div class="acts"><button type="button" data-a="back">Cancel</button><button type="submit" class="go">${join?"Save my card":"Sign in"}</button></div></form>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{if(e.target===o||(e.target.dataset&&e.target.dataset.a==="back"))close()});
  o.querySelector("form").addEventListener("submit",async e=>{
    e.preventDefault();const err=o.querySelector("#sErr");err.textContent="";
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
  mountModal(o,"input",modalTrigger);
}
async function pullSync(){
  if(!member.pin)return;
  try{const r=await syncCall({action:"load",no:member.no,pin:member.pin});if(r.status==="ok"){applyRemote(r.data);syncState="saved";pushSync()}else syncState=r.status}catch(e){syncState="offline"}
  renderMember();
}
let shopBuilt=false;
function tapeHTML(f){
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];
  const st=watched.has(f.id)?'<span class="sticker back">Seen it</span>':isNew(f)?'<span class="sticker new">New</span>':isPick(f)?'<span class="sticker pick">Staff pick</span>':"";
  const out=isOut(f);
  const tk=isPick(f)&&!out?talkFor(f):null;
  return `<button class="tape${isClam(f)?" clam":""}${out?" out":""}${+f.year<1995?" faded":""}" type="button" data-id="${ESC(f.id)}" style="transform:rotate(${(hashN(f.id)%5-2)*.35}deg)">${out?"":st}<span class="box">${p?`<img loading="lazy" decoding="async" alt="" src="${TMDB_IMG_SHOP}w185${ESC(p)}">`:""}${out?'<span class="out-card">All copies out<small>Wait by the returns chute</small></span>':isNew(f)?`<span class="price">${priceTag(f)}</span>`:`<span class="neon${hashN(f.id)%3===0?" peel":""}" style="--nc:${weeklyCol(f)}">Weekly<b>$2</b></span>`}${ratingOf(f)?`<span class="rate ${rateCls(ratingOf(f))}" aria-label="Rated ${ratingOf(f)}">${ratingOf(f)}</span>`:""}</span><span class="tape-t">${ESC(f.title)}</span><span class="tape-y">${f.year}</span>${tk?`<span class="talker"><b>${tk[0]}'s pick</b>${tk[1]}</span>`:""}</button>`;
}
function renderBoard(){
  const t=isTuesday();
  $("svBoard").innerHTML=`<div class="svb-row${t?" dim":""}"><b>New releases</b><span>$7 overnight</span></div><div class="svb-row"><b>Weeklies</b><span>$2 for 7 nights</span></div><div class="svb-row${t?" hot":""}"><b>$2 Tuesday</b><span>${t?"On tonight":"Every new release, every Tuesday"}</span></div><button type="button" class="svb-fri" id="svFri">Friday night: one for the kids, one for later</button>`;
  $("svFri").addEventListener("click",()=>{const kids=FILMS.filter(f=>isKidSafe(f)&&onSvc(f,svc)),late=FILMS.filter(f=>!isKidSafe(f)&&onSvc(f,svc));if(!kids.length||!late.length)return;openDouble(pick(kids),pick(late))});
}
function renderCal(cal){
  const on=cal.filter(c=>c.on),up=cal.filter(c=>!c.on&&c.next).sort((a,b)=>a.day-b.day).slice(0,4);
  const chip=(c,isOn)=>`<button type="button" class="${isOn?"on":""}" data-season="${c.s.id}" style="--sg:${c.s.c[0]};--sf:${c.s.c[1]}"><b>${ESC(c.s.name)}</b><small>${isOn?"On the shelves now":(d=>d===1?"Tomorrow":`In ${d} days, ${fmtDay(c.day)}`)(daysTo(c.day))}</small></button>`;
  $("shopCal").innerHTML=`<span class="cal-k">${on.length?"On now":"Coming up"}</span>`+on.map(c=>chip(c,true)).join("")+up.map(c=>chip(c,false)).join("");
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
function renderShop(){
  shelfRest=[];
  if(!dishesReady)ensureDishes().then(()=>{if(!$("viewShop").hidden)renderShop()});
  const q=$("shopSearch").value.trim().toLowerCase(),dec=$("shopDecade").value,unseen=$("shopUnwatched").checked;
  const ok=f=>(!q||f.title.toLowerCase().includes(q))&&(!dec||f.year.slice(0,3)===dec)&&(!unseen||!watched.has(f.id))&&(!kidsMode||isKidSafe(f))&&onSvc(f,svc);
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
  if(q)rows.push(["Search results",list.slice().sort((a,b)=>a.title.localeCompare(b.title))]);
  else SHOP_AISLES.forEach(([n,ts])=>{if(n==="Holiday")return;const r=list.filter(f=>ts.includes(f.theme)).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));if(r.length)rows.push([n,r])});
  if(!q&&!kidsMode){const ls=list.filter(f=>f.theme==="horror"||/^(MA15\+|R18\+|R)$/.test(ratingOf(f)||"")).sort((a,b)=>a.title.replace(/^(The|A) /,"").localeCompare(b.title.replace(/^(The|A) /,"")));if(ls.length)rows.push(["Late Show",ls,"Out the back, behind the curtain. Grown-ups only.","lateshow"])}
  if(!q)cal.filter(c=>!c.on&&c.next).sort((a,b)=>a.next-b.next).forEach(c=>later.push(...seasonRows(c.s,list,c.next)));
  renderMember();
  $("shopCount").textContent=list.length?`${list.length} of ${FILMS.length} titles on the shelves`:"";
  const aisle=([n,r,note,cls,st,sid])=>`<section class="aisle${cls?" "+cls:""}"${st?` style="${st}"`:""}${sid?` id="season-${sid}${/late show/.test(n)?"-late":""}"`:""}><div class="aisle-top"><h3 class="aisle-sign">${ESC(n)}<span>${r.length}</span></h3>${r.length>1?`<button class="aisle-spin" type="button" data-aisle="${ESC(n)}">Spin this aisle</button>`:""}${note?`<p class="aisle-note">${ESC(note)}</p>`:""}</div>${/lateshow/.test(cls||"")?`<button class="ls-curtain" type="button" aria-expanded="false" aria-label="Pull back the curtain"><img src="assets/hero/latedoor.webp" alt="" loading="lazy"><span class="ls-sign fit" style="left:34.81%;top:3.31%;width:31.12%;height:5.52%"><span class="fit-t">Late Show</span></span><span class="ls-tap">Pull back the curtain</span></button>`:""}<div class="shelf" data-k="${shelfRest.push(/lateshow/.test(cls||"")?[]:r.slice(SHELF_FIRST))-1}">${(/lateshow/.test(cls||"")?[]:r.slice(0,SHELF_FIRST)).map(tapeHTML).join("")}</div></section>`;
  $("shopAisles").innerHTML=rows.length?rows.map(aisle).join("")+(later.length?`<div class="aisles-later"><h3>Holiday shelves</h3><p>Each one moves to the front of the shop when its day comes round.</p>${later.map(aisle).join("")}</div>`:""):`<p class="shelf-empty">Nothing on the shelves matches that. Try another title or clear the filters.</p>`;
  fillShelvesLater();
}
function tvHTML(f){
  const k=typeof TRAILERS!=="undefined"&&TRAILERS[f.id];
  return `<div class="tv"><div class="tv-screen">${k?`<button class="tv-play" type="button" data-k="${ESC(k)}">Play trailer</button>`:`<p class="tv-none">No trailer in the machine for this one.</p>`}</div><div class="tv-base"><span class="tv-knobs" aria-hidden="true"><i></i><i></i></span>${k?`<a href="https://www.youtube.com/watch?v=${encodeURIComponent(k)}" target="_blank" rel="noopener">Open on YouTube</a>`:""}</div></div>`;
}
async function openCase(f){
  const modalTrigger=document.activeElement;
  await Promise.all([ensureExact(f),typeof TRAILERS==="undefined"?loadScript(TRAILERS_JS).catch(()=>{}):0]);
  const p=typeof TMDB_POSTERS!=="undefined"&&TMDB_POSTERS[f.id];const m=makeMenu(f,true);
  const o=document.createElement("dialog");o.className="counter";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`${f.title}, back of the box`);
  const seen=watched.has(f.id);
  o.innerHTML=`<div class="case"><button class="x" type="button" aria-label="Put it back">×</button><div class="case-l">${p?`<div class="case-art${reduce?"":" track"}"><img alt="${ESC(f.title)} poster" src="${TMDB_IMG_SHOP}w500${ESC(p)}"></div>`:""}${tvHTML(f)}</div><div><h3>${ESC(f.title)}</h3><p class="meta">${f.year} &nbsp;/&nbsp; ${ESC(SHOP_AISLE_OF[f.theme]||"")} aisle &nbsp;/&nbsp; ${ESC(T[f.theme].name)}${ratingOf(f)?` <span class="ratebig ${rateCls(ratingOf(f))}" aria-label="Rated ${ratingOf(f)}">${ratingOf(f)}</span>`:""}</p>${isOut(f)?'<p class="outnote">All copies are out. Lucky you, one just came back.</p>':""}<p class="syn">${ESC(f.D)}</p><div class="where">${whereHTML(f)}</div><p class="staff">Staff pick: ${ESC((movieEdition(f)||{}).tagline||f.T)}</p>${seen?starsHTML(f):""}<h4>Comes with</h4><ul>${[...m.s,...m.m,...m.w,...m.d].map(it=>`<li>${ESC(it.n)}</li>`).join("")}</ul><div class="acts"><button class="rent" type="button">Rent it</button>${(member.out||[]).some(r=>r.id===f.id)&&!seen?'<button class="ret" type="button">Return it</button>':""}<button class="seen" type="button">${seen?"Not seen it yet":"Seen it"}</button></div></div></div>`;
  const close=()=>dismissModal(o);
  o.addEventListener("click",e=>{if(e.target===o)close()});
  o.querySelector(".x").addEventListener("click",close);
  o.querySelector(".rent").addEventListener("click",()=>{close();sfx.clunk();openSlip(f,()=>{setView("wheel");replay(f);addHistory(f);$("theatre").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})})});
  if(seen)wireStars(o,f,()=>renderShop());
  const rb=o.querySelector(".ret");if(rb)rb.addEventListener("click",()=>{close();openChute(f)});
  const tv=o.querySelector(".tv-play");
  if(tv)tv.addEventListener("click",()=>{const k=tv.dataset.k;const scr=tv.parentElement;scr.classList.add("tracking");sfx.clunk();setTimeout(()=>{scr.classList.remove("tracking");scr.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(k)}?autoplay=1&playsinline=1&rel=0&modestbranding=1" title="${ESC(f.title)} trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`},reduce?0:600)});
  o.querySelector(".seen").addEventListener("click",()=>{setWatched(f,!watched.has(f.id));close();renderShop()});
  mountModal(o,".rent",modalTrigger);
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
  const rb=[];(p.r||[]).concat(p.b||[]).forEach(x=>{if(!rb.some(y=>y[0]===x[0]))rb.push(x)});
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
function setLazyUI(){const b=$("lazyBtn");b.setAttribute("aria-pressed",lazy);b.textContent=lazy?"Lazy night: on":"Lazy night: off"}

/* first visit: a quick how-it-works */
function showWelcome(){
  const modalTrigger=document.activeElement;
  const o=document.createElement("dialog");o.className="welcome";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","How it works");
  o.innerHTML=`<div class="welcome-in"><h2>Movie night, sorted</h2><p class="lead">Pick a film and dinner comes with it.</p><ol>
  <li><span><b>Pick a film</b>Spin the wheel, browse the video shop, or start from what you're craving.</span></li>
  <li><span><b>Get the menu</b>Every film has its own menu built from the movie, with recipes and a shopping list for four.</span></li>
  <li><span><b>Cook, then press play</b>Lock it in for the week, tick off the shopping, and check where it's streaming.</span></li>
  </ol><button class="btn primary" type="button">Let's go</button></div>`;
  const close=()=>dismissModal(o);
  o.querySelector("button").addEventListener("click",close);
  o.addEventListener("click",e=>{if(e.target===o)close()});
  mountModal(o,"button",modalTrigger,()=>{try{localStorage.setItem("mns-welcome","1")}catch(e){}});
}

{const g=document.getElementById("bulbGlow");if(g){let h="";for(let i=0;i<32;i++)h+=`<i style="--a:${i*11.25}deg;--d:${-(i%8)*0.2}s"></i>`;g.innerHTML=h}}
/* phones: a Spin button pinned to the bottom until the wheel is on screen */
{const bar=$("spinbar"),hub=$("spin");let hubSeen=false;
 const upd=()=>{bar.hidden=hubSeen||spinning||$("viewWheel").hidden||!matchMedia("(max-width:900px)").matches};
 if("IntersectionObserver" in window)new IntersectionObserver(es=>{hubSeen=es[0].isIntersecting;upd()},{threshold:.4}).observe(hub);
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
/* palace marquee: shrink long titles to fit the sign, light boxes show tonight's poster and recent spins */
let _hang=false;
function fitMarquee(){if(_hang)return;const t=$("now");const txt=t.textContent;const n=txt.length;t.style.fontSize=`min(3.3cqw,${(64/Math.max(n,8)).toFixed(2)}cqw)`;
  if(!t.querySelector("i")){_hang=true;t.innerHTML=[...txt].map((ch,i)=>ch===" "?" ":`<i style="--r:${((Math.sin(i*12.9898+n)*43758.5453)%1*2.4).toFixed(2)}deg;--y:${((Math.sin(i*78.233+n)*12345.678)%1*0.05).toFixed(3)}em">${ch==="&"?"&amp;":ch==="<"?"&lt;":ch===">"?"&gt;":ch}</i>`).join("");_hang=false}}

if(typeof MutationObserver!=="undefined")new MutationObserver(fitMarquee).observe($("now"),{childList:true,characterData:true,subtree:true});try{fitMarquee()}catch(e){}
function lightboxes(){
  const P=typeof TMDB_POSTERS!=="undefined"?TMDB_POSTERS:{};
  const ids=[current&&current.id,...hist.filter(id=>!current||id!==current.id)].filter(Boolean);
  const pick=[ids[0],ids[1],ids[2],ids[0]];
  document.querySelectorAll(".lbox").forEach((im,i)=>{const p=pick[i]&&P[pick[i]];if(p){im.src="https://image.tmdb.org/t/p/w154"+p;im.hidden=false}else im.hidden=true});
}

/* craving: start from the food, find the film */
const CRAVES=[["Wings",/\bwings?\b/i],["Pizza",/pizza|calzone|stromboli/i],["Burgers",/burger|slider/i],["Tacos",/taco|burrito|nacho|quesadilla|enchilada|fajita|tamale|churro/i],["Hot dogs",/hot ?dog|frankfurt|\bfranks?\b|bratwurst|sausage|snag/i],["Fried chicken",/fried chicken|chicken tender|nugget|popcorn chicken|schnitzel/i],["BBQ",/bbq|barbecue|brisket|\bribs?\b|pulled pork|smoked/i],["Steak",/steak|rib roast|scotch fillet|sirloin|t-bone/i],["Roasts",/\broast\b|roast (beef|chicken|lamb|turkey|pork|beast)|turkey|ham\b/i],["Pasta",/pasta|spaghetti|lasagn|linguine|penne|macaroni|mac and cheese|ravioli|gnocchi|fettuccine|carbonara|rigatoni|meatball/i],["Noodles",/noodle|ramen|pho\b|lo mein|pad thai|udon|chow mein|pancit|laksa/i],["Dumplings",/dumpling|gyoza|wonton|bao|potsticker|mandu|momo/i],["Sushi",/sushi|sashimi|maki|onigiri/i],["Curry",/curry|tikka|masala|korma|vindaloo|dal\b|dhal/i],["Seafood",/prawn|shrimp|\bfish|crab|lobster|oyster|calamari|squid|clam|mussel|salmon|tuna|pippi|scallop|chowder/i],["Fish and chips",/fish and chips|fish & chips|battered fish/i],["Pies",/\bpies?\b|pasty|pasties|pot pie/i],["Sandwiches",/sandwich|sub\b|hoagie|cheesesteak|po' ?boy|toastie|club\b|reuben|banh mi/i],["Breakfast",/pancake|waffle|bacon and egg|eggs benedict|french toast|breakfast|omelette|hash brown|fry-up|scrambled/i],["Fries",/\bfries\b|\bchips\b|wedges|tater/i],["Cheese",/cheese board|cheese platter|fondue|mac and cheese|grilled cheese|toasted cheese|raclette/i],["Ice cream",/ice cream|sundae|gelato|milkshake|banana split|float/i],["Chocolate",/chocolate|brownie|fudge|cocoa/i],["Cake",/\bcake|cupcake|cheesecake|gateau|torte/i],["Donuts",/donut|doughnut|beignet|churro|zeppole/i],["Cookies",/cookie|biscuit|shortbread|snickerdoodle/i],["Popcorn",/popcorn/i]];
let craveSel=null,craveHits=[];
const craveRx=q=>{const w=q.trim().toLowerCase().replace(/[^a-z0-9 '&-]/g,"");if(!w)return null;const stem=w.replace(/(es|s)$/,"");return new RegExp(stem.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i")};
/* dish names and notes load after the page settles: the shop's seasonal shelves and the Candy bar use them */
let _dishes=null,_notes=null,dishesReady=false;
const fillDishes=(N,i)=>{for(const f of FILMS){if(f._full)continue;const n=N[f.id];if(!n)continue;["S","M","W","K"].forEach((k,c)=>{if(i===0)f[k]=(n[c]||[]).map(x=>[x]);else(f[k]||[]).forEach((d,j)=>{if(n[c]&&n[c][j]!=null)d[1]=n[c][j]})})}};
function ensureDishes(){
  if(!_dishes)_dishes=fetch("data/dish-names.json").then(r=>r.json()).then(N=>{fillDishes(N,0);dishesReady=true}).catch(()=>{_dishes=null});
  return _dishes||Promise.resolve();
}
function ensureNotes(){
  if(!_notes)_notes=ensureDishes().then(()=>fetch("data/dish-notes.json")).then(r=>r.json()).then(N=>fillDishes(N,1)).catch(()=>{_notes=null});
  return _notes||Promise.resolve();
}
let _notesOK=false;
function renderCrave(){
  if(!_notesOK){$("craveChips").innerHTML='<p class="crave-empty">Reading the board...</p>';ensureNotes().then(()=>{_notesOK=true;renderCrave()});return}
  if(!window.__craveN){window.__craveN={};CRAVES.forEach(([n,rx])=>{window.__craveN[n]=FILMS.filter(f=>["S","M","W","K"].some(k=>(f[k]||[]).some(it=>rx.test(it[0])||rx.test(it[1]||"")))).length})}
  $("craveChips").innerHTML=CRAVES.map(([n])=>`<button type="button" aria-pressed="${craveSel===n}" data-crave="${ESC(n)}"><span>${ESC(n)}</span><b>${window.__craveN[n]}</b></button>`).join("");
  const typed=$("craveSearch").value;let rx=null,label="";
  if(typed.trim()){rx=craveRx(typed);label=typed.trim()}else if(craveSel){rx=CRAVES.find(c=>c[0]===craveSel)[1];label=craveSel.toLowerCase()}
  if(!rx){craveHits=[];$("craveCount").textContent="";$("craveSpin").hidden=true;$("craveGrid").innerHTML='<p class="crave-empty">Tap something on the board to see which films serve it.</p>';return}
  craveHits=[];
  for(const f of FILMS){if(kidsMode&&!isKidSafe(f))continue;if(!onSvc(f,svc))continue;const d=[];for(const k of["S","M","W","K"])for(const it of f[k]||[])if(rx.test(it[0])||rx.test(it[1]||""))d.push(it[0]);if(d.length)craveHits.push([f,d])}
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
$("craveGrid").addEventListener("click",e=>{const t=e.target.closest(".tape");if(t){const f=FILMS.find(x=>x.id===t.dataset.id);if(f)openCase(f)}});
$("craveSpin").addEventListener("click",()=>{const tapes=[...$("craveGrid").querySelectorAll(".tape")];if(!tapes.length)return;const p=tapes[Math.floor(Math.random()*tapes.length)];buzz([20,40,20]);tapes.forEach(t=>t.classList.remove("picked"));p.classList.add("picked");p.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});setTimeout(()=>{p.classList.remove("picked");const f=FILMS.find(x=>x.id===p.dataset.id);if(f)openCase(f)},reduce?0:700)});
function setView(v){
  const shop=v==="shop",crave=v==="crave";$("viewShop").hidden=!shop;$("viewCrave").hidden=!crave;$("viewWheel").hidden=shop||crave;
  $("viewShopBtn").setAttribute("aria-selected",shop);$("viewCraveBtn").setAttribute("aria-selected",crave);$("viewWheelBtn").setAttribute("aria-selected",!shop&&!crave);
  if(crave)renderCrave();
  document.body.classList.toggle("in-shop",shop);
  try{localStorage.setItem("mns-view",v)}catch(e){}
  if(shop&&!window.__inShop){sfx.chime();const sh=$("viewShop");sh.classList.remove("lightson");void sh.offsetWidth;sh.classList.add("lightson")}window.__inShop=shop;
  if(shop){if(!shopBuilt){const ds=[...new Set(FILMS.map(f=>f.year.slice(0,3)))].sort();$("shopDecade").innerHTML='<option value="">Any decade</option>'+ds.map(d=>`<option value="${d}">${d}0s</option>`).join("");shopBuilt=true}renderShop()}
  else if(!crave)scalePreview();
}
$("viewWheelBtn").addEventListener("click",()=>setView("wheel"));
$("viewShopBtn").addEventListener("click",()=>setView("shop"));
$("viewCraveBtn").addEventListener("click",()=>setView("crave"));
["shopSearch","shopDecade","shopUnwatched"].forEach(id=>$(id).addEventListener(id==="shopSearch"?"input":"change",renderShop));
$("shopCal").addEventListener("click",e=>{const b=e.target.closest("[data-season]");if(!b)return;const el=document.getElementById("season-"+b.dataset.season);if(el)el.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});else{$("shopSearch").value="";renderShop();const el2=document.getElementById("season-"+b.dataset.season);if(el2)el2.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}});
if(typeof document!=="undefined"&&document.addEventListener)document.addEventListener("click",e=>{const h=e.target.closest(".sv-hang,.sv-hang-chip");if(!h)return;const g=h.dataset.go;const secs=[...document.querySelectorAll("#shopAisles .aisle")];const t=secs.find(x=>g==="wall"?x.classList.contains("wall"):(x.querySelector(".aisle-sign")||{}).firstChild&&x.querySelector(".aisle-sign").firstChild.textContent===g);if(t){t.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});sfx.chime&&tick()}});
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
  const m=current.menu,line=it=>`- ${it.n}${it.note?`, ${it.note}`:""}${it.how?`\n  How: ${it.how}`:""}`;
  return `${current.title} (${current.year})\n${current.tag}\n${current.D}\n\nSnacks\n${m.s.map(line).join("\n")}\n\n${m.m.length>1?"Mains":"Main"}\n${m.m.map(line).join("\n")}\n\nSomething sweet\n${m.w.map(line).join("\n")}\n\nTo drink\n${m.d.map(line).join("\n")}\n\nShowtime cue: ${movieEdition(current)?.cue||current.P}\n\nSHOPPING LIST\n${shopGroups(m).map(([a,l])=>a+"\n"+l.map(x=>"[ ] "+x).join("\n")).join("\n\n")}`;
}

/* trailers load the first time someone opens a box */
const TRAILERS_JS=(document.querySelector('link[rel="prefetch"][href^="trailers.js"]')||{}).getAttribute?.("href")||"trailers.js";
/* export: the image and PDF tools only download when someone saves */
const _libs={};
function loadScript(src){return _libs[src]||(_libs[src]=new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>{delete _libs[src];no()};document.head.appendChild(s)}))}
async function loadExportTools(pdf){
  try{await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");if(pdf)await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");return true}catch(e){return false}
}
/* export: render a clean copy of the card at full size */
let _noise=null;
function noiseTile(){
  if(_noise)return _noise;
  const c=document.createElement("canvas");c.width=c.height=180;const x=c.getContext("2d"),d=x.createImageData(180,180);
  for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=Math.random()*26|0}
  x.putImageData(d,0,0);return _noise=c.toDataURL("image/png");
}
async function renderCanvas(src,forPrint){
  const stage=document.createElement("div"),land=src.classList.contains("fmt");
  stage.style.cssText=`position:fixed;left:-20000px;top:0;width:${land?1123:794}px;height:${land?794:1123}px;`;
  const clone=src.cloneNode(true);clone.style.transform="none";clone.hidden=false;if(forPrint&&land)clone.classList.add("for-print");
  stage.appendChild(clone);document.body.appendChild(stage);
  try{
    await document.fonts.ready;
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
    /* iPhone Safari won't let a canvas be saved once an SVG texture has been drawn on it (SecurityError).
       Swap every SVG texture for a plain noise tile and hide inline SVG art, in the export copy only. */
    const nz=noiseTile(),svgRx=/url\("data:image\/svg\+xml(?:[^"\\]|\\.)*"\)/g;
    [clone,...clone.querySelectorAll("*")].forEach(el=>{
      const cs=getComputedStyle(el),bg=cs.backgroundImage;
      if(cs.backgroundBlendMode&&cs.backgroundBlendMode.includes("multiply")){el.style.backgroundImage="none";return}
      if(bg&&bg.includes("data:image/svg"))el.style.backgroundImage=bg.replace(svgRx,`url("${nz}")`);
      if(el.tagName==="IMG"&&/^data:image\/svg/.test(el.getAttribute("src")||""))el.style.visibility="hidden";
      if(el.tagName&&el.tagName.toLowerCase()==="svg")el.style.visibility="hidden";
    });
    return await html2canvas(clone,{scale:2.5,backgroundColor:STY[current.theme].mg,logging:false,useCORS:true});
  }finally{stage.remove()}
}
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

let downloads=null;
const inClaude=!!(window.claude&&window.claude.use);
if(inClaude){window.claude.use("downloads").then(d=>{downloads=d}).catch(()=>{})}
else{$("print").hidden=false}
function plainDownload(data,filename){
  const url=URL.createObjectURL(data),a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function shareable(data,filename){
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
  if(file)o.querySelector("[data-share]").addEventListener("click",async()=>{
    try{await navigator.share({files:[file],title:`${current.title} menu`});close();$("status").textContent="Saved. Check your Photos."}
    catch(e){if(!(e&&e.name==="AbortError"))o.querySelector("p").textContent="Long-press the menu and choose Save to Photos."}
  });
  mountModal(o,"button",modalTrigger);
}
async function exportMenu(kind){
  if(!current)return;
  const btns=[$("pdf"),$("png")];btns.forEach(b=>b.disabled=true);
  $("status").textContent=kind==="pdf"?"Building your A4 PDF...":"Building your image...";
  if(!await loadExportTools(kind==="pdf")){btns.forEach(b=>b.disabled=false);$("status").textContent="Couldn't load the export tools. Check your connection and try again.";return}
  try{
    const canvas=await renderCanvas(kind==="pdf"||tab==="menu"?card:prep,kind==="pdf");
    const land=(kind==="pdf"||tab==="menu")&&card.classList.contains("fmt");
    const name=`${slug(current.title)}-${current.year}-${kind==="png"&&tab==="prep"?"prep-sheet":"menu"}`;
    let data,filename;
    if(kind==="pdf"){
      const {jsPDF}=window.jspdf;
      const pdf=new jsPDF({unit:"mm",format:"a4",orientation:land?"landscape":"portrait"});
      pdf.addImage(canvas.toDataURL("image/jpeg",0.92),"JPEG",0,0,land?297:210,land?210:297);
      const prepCanvas=await renderCanvas(prep);
      pdf.addPage("a4","portrait");pdf.addImage(prepCanvas.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297);
      data=pdf.output("blob");filename=name+".pdf";
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
      try{await downloads.save({filename,data});$("status").textContent=`Saved ${filename}. Print it at A4, actual size.`}
      catch(e){
        if(e&&e.code==="declined")$("status").textContent="Save cancelled.";
        else{showOverlay(canvas.toDataURL("image/png"));$("status").textContent=""}
      }
    }else if(!inClaude){plainDownload(data,filename);$("status").textContent=`Downloaded ${filename}. Print it at A4, actual size.`}
    else{showOverlay(canvas.toDataURL("image/png"));$("status").textContent=""}
  }catch(e){console.error(e);$("status").textContent=`Couldn't build the image (${(e&&(e.name||e.message))||"unknown error"}). Close and reopen the app, then try again.`}
  finally{btns.forEach(b=>b.disabled=false)}
}

$("spin").addEventListener("click",spin);
sel.addEventListener("change",setList);
$("reroll").addEventListener("click",()=>{if(current)show(current,false)});
$("pdf").addEventListener("click",()=>exportMenu("pdf"));
$("png").addEventListener("click",()=>exportMenu("png"));
/* trifolds: a two-sided PDF that prints and folds into a real takeaway menu */
async function exportFold(){
  const f=current,spec=f&&fmtSpec(f);if(!spec||!fmtCanFold(spec))return;
  const btn=$("foldPdf");btn.disabled=true;$("status").textContent="Building your fold-at-home PDF...";
  try{
    if(!await loadExportTools(true)){$("status").textContent="Couldn't load the export tools. Check your connection and try again.";return}
    const pages=fmtFoldPages(f,spec,current.menu);
    const page=async html=>{const el=document.createElement("div");styleCard(el,f);el.className="mcard fmt fmt-"+spec.fmt;el.style.transform="none";el.innerHTML=html;fmtTilesPNG(el);return renderCanvas(el,true)};
    const out=await page(pages.outside),ins=await page(pages.inside),pp=await renderCanvas(prep);
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:"mm",format:"a4",orientation:"landscape"});
    pdf.addImage(out.toDataURL("image/jpeg",0.92),"JPEG",0,0,297,210);
    pdf.addPage("a4","landscape");pdf.addImage(ins.toDataURL("image/jpeg",0.92),"JPEG",0,0,297,210);
    pdf.addPage("a4","portrait");pdf.addImage(pp.toDataURL("image/jpeg",0.92),"JPEG",0,0,210,297);
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
  if(!current)return;const url=location.origin+location.pathname+"?film="+encodeURIComponent(current.id);
  const title=`${current.title} movie night menu`,text=`${current.title} (${current.year}): ${current.tag||"movie night menu"}`;
  try{if(navigator.share){await navigator.share({title,text,url});$("status").textContent="Menu link sent."}
    else{await navigator.clipboard.writeText(url);$("status").textContent="Link copied. Anyone who opens it lands on this menu."}}
  catch(e){if(!(e&&e.name==="AbortError")){try{await navigator.clipboard.writeText(url);$("status").textContent="Link copied."}catch(err){$("status").textContent=url}}}
});
$("print").addEventListener("click",()=>{
  const pa=$("printArea");pa.innerHTML="";
  const c=card.cloneNode(true);c.style.transform="none";c.hidden=false;pa.appendChild(c);
  const c2=prep.cloneNode(true);c2.style.transform="none";c2.hidden=false;pa.appendChild(c2);
  window.print();
});
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
if("serviceWorker" in navigator&&location.protocol==="https:")addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
setKidsUI();if(kidsMode)setList();pullSync();
try{if(!localStorage.getItem("mns-welcome"))setTimeout(showWelcome,400)}catch(e){}
try{const v=localStorage.getItem("mns-view");if(location.hash==="#shop"||v==="shop")setView("shop");else if(location.hash==="#crave"||v==="crave")setView("crave")}catch(e){}
document.fonts.ready.then(draw);
const initialFilmId=new URLSearchParams(window.location.search).get("film");
const startId=initialFilmId||(week&&week.id)||hist[0];
const initialFilm=FILMS.find(f=>f.id===startId)||FILMS.find(f=>f.id==="Ghostbusters (1984)")||FILMS[0];
if(FILMS.some(f=>f.id===startId)){$("now").textContent=initialFilm.title;show(initialFilm,true)}
else{theatre.classList.add("closed");$("tease").textContent="Spin the wheel to raise the curtain";
  /* nobody's picked yet: dress the stage behind the curtain once the page has settled */
  addEventListener("load",()=>(window.requestIdleCallback||setTimeout)(()=>{if(!current)show(initialFilm,true).then(()=>{$("whereWheel").innerHTML=""})},{timeout:2500}))}
addEventListener("load",()=>setTimeout(ensureDishes,3000));

