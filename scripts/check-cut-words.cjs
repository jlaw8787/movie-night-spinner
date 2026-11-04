/* Cut words on printed menus (review 9, fix 2): no note or line may end on "and", "with", "of", "in", "the", "a" or "is"
   because a fitter cut it there. Renders PER films per shared layout (default 3) plus Dreamgirls and Hitch,
   reads the printed card and the phone text menu line by line, and fails on any line that ends on one of those words
   where the film's own wording carries on. Lines written that way in the data ("Come On In") are listed as a warning only.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-cut-words.cjs [PER] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),PER=+process.argv[2]||3,port=4700+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async PER=>{
  const DANG=/(?:^|\s)(and|with|of|in|the|a|is)[.!?,;:]*$/;
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const FM=await (await fetch('data/film-format.json')).json(),n={},ids=['Dreamgirls (2006)','Hitch (2005)'];for(const f of FILMS){const k=FM[f.id]&&FM[f.id].format;if(!k||ids.includes(f.id))continue;n[k]=(n[k]||0)+1;if(n[k]<=PER)ids.push(f.id)}
  const cut=[],authored=[];
  for(const id of ids){const f=FILMS.find(x=>x.id===id);window.__stage=false;try{await ensureExact(f);await show(f,true)}catch(e){continue}if(!f._lib)continue;fitLines(card);await new Promise(r=>setTimeout(r,80));
   const src=JSON.stringify([f._lib,f.S,f.M,f.W,f.K,f._r2,f.T,f.D,f._kit]).replace(/\\"/g,'"');
   const lines=(card.innerText+'\n'+fmtPhone.innerText).split('\n').map(x=>x.trim()).filter(x=>x&&x.length<=240);
   for(const l of new Set(lines)){if(!DANG.test(l))continue;const core=l.replace(/[.!?,;:]+$/,'');
    const own=new RegExp(esc(core.slice(-40))+'(?=["\\]}.!?;:,]|$)','i').test(src);(own?authored:cut).push(id+' ('+f._lib.fmt+'): '+l)}}
  return {n:ids.length,cut,authored}},PER);
 console.log(`${r.n} films checked`);
 if(r.authored.length)console.log('Written that way in the data (warning):\n  '+r.authored.join('\n  '));
 if(r.cut.length){console.log('FAIL, cut words:\n  '+r.cut.join('\n  '));await b.close();process.exit(1)}
 console.log('PASS: no line ends on a cut word');await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
