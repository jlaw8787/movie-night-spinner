/* Card prices (review 10, fix 7): one price style per card and no odd cents.
   Renders shared-layout films and reads every price on the printed card. Fails on a price that ends in odd cents
   (8.57, 28.12; cents that are not a multiple of 5) and on a card that mixes cent prices ("12¢") with dollar prices ("1.95").
   Precinct evidence tags keep their own cents on purpose and are skipped. Bar tab totals are read too, so a moved price must still add up.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-prices.cjs [PER|all] [layout ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),arg=process.argv[2]||'all',PER=arg==='all'?1e9:+arg||4,ONLY=process.argv.slice(3),port=4500+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(1800000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async ([PER,ONLY])=>{
  const FM=await (await fetch('data/film-format.json')).json(),n={},ids=[];
  for(const f of FILMS){const k=FM[f.id]&&FM[f.id].format;if(!k||k==='precinct'||ONLY.length&&!ONLY.includes(k))continue;n[k]=(n[k]||0)+1;if(n[k]<=PER)ids.push(f.id)}
  const odd=[],mixed=[];
  for(const id of ids){const f=FILMS.find(x=>x.id===id);window.__stage=false;try{await ensureExact(f);await show(f,true)}catch(e){continue}if(!f._lib)continue;
   const t=card.innerText.replace(/\s+/g,' ');
   const dol=[...t.matchAll(/(?<![\d.:\/]|till |to )\$?(\d{1,3})\.(\d\d)(?![\d:%]|\s?(?:pm|am|PM|AM|kg|g\b|ml|L\b|km|m\b|till|to\b))/g)],cen=[...t.matchAll(/(?<![\d.])(\d{1,2})(¢|c\b)/g)];
   for(const m of dol)if(+m[2]%5)odd.push(id+' ('+f._lib.fmt+'): '+m[0]);
   for(const m of cen)if(+m[1]%5)odd.push(id+' ('+f._lib.fmt+'): '+m[0]);
   if(cen.length&&dol.some(m=>+m[1]>=1))mixed.push(id+' ('+f._lib.fmt+'): '+cen[0][0]+' beside '+dol.find(m=>+m[1]>=1)[0])}
  return {n:ids.length,odd,mixed}},[PER,ONLY]);
 console.log(`${r.n} films checked`);
 if(r.odd.length)console.log('Odd cents:\n  '+r.odd.join('\n  '));
 if(r.mixed.length)console.log('Cents beside dollars:\n  '+r.mixed.join('\n  '));
 await b.close();if(r.odd.length||r.mixed.length){console.log('FAIL');process.exit(1)}console.log('PASS: one price style per card, no odd cents');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
