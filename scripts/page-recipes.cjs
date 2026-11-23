/* Review 44: the film page's "You need" list reads exactly what the app's phone recipe lists (planQty, pack rounding, tbsp over 3 tsp,
   "1.7kg" not "1650g"), so the page and the app never show different quantities for the same dish (Newsies printed "8 tsp yellow mustard"
   where the app said "3 tbsp"). Opens the app once, loads each film's data and asks the app for every recipe's ingredient lines at 4 guests.
   Saves data/page-recipes.json ({film: {dish name: [lines]}}), read by scripts/build-seo.cjs. Run after any recipe change, then build-data.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/page-recipes.cjs ["Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'..'),NAMED=process.argv.slice(2),OUT=path.join(R,'data/page-recipes.json'),port=5900+Math.floor(Math.random()*300);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({serviceWorkers:'block'});await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(3600000);
 await p.goto(`http://127.0.0.1:${port}/`,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>typeof phoneRecipe==='function'&&typeof FILMS!=='undefined'&&FILMS.length);
 const got=await p.evaluate(async NAMED=>{const out={};const L=NAMED.length?FILMS.filter(f=>NAMED.includes(f.id)):FILMS;
   for(const f of L){try{await ensureExact(f);const ds=(f._r2&&f._r2.dishes)||[];const o={};
     for(const d of ds){const r=phoneRecipe(f,{n:d.n});if(r&&r.ing&&r.ing.length)o[d.n]=r.ing;const a=d.alt&&d.alt.af;if(a&&a.n&&a.n!==d.n){const ra=phoneRecipe(f,{n:a.n});if(ra&&ra.ing)o[a.n]=ra.ing}}
     out[f.id]=o}catch(e){}}return out},NAMED);
 const prev=fs.existsSync(OUT)&&NAMED.length?JSON.parse(fs.readFileSync(OUT,'utf8')):{};Object.assign(prev,got);
 const o={};for(const k of Object.keys(prev).sort())o[k]=prev[k];
 fs.writeFileSync(OUT,'{\n'+Object.entries(o).map(([k,v])=>JSON.stringify(k)+':'+JSON.stringify(v)).join(',\n')+'\n}\n');
 console.log(`page-recipes: ${Object.keys(got).length} films`);await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
