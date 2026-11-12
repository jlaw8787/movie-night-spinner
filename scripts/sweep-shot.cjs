/* Menu sweep helper: render films the way people see them, for checking a change.
     node scripts/sweep-shot.cjs out-folder "Title (Year)" ["Title (Year)" ...]
   For each film saves: <slug>-menu.pdf (Save PDF: printed menu plus Prep sheet), <slug>-p<N>.png (each PDF page),
   <slug>-phone.txt (the phone text menu) and <slug>-kit.png (table kit pages). Needs: node scripts/build-data.cjs first.
   Run with NODE_PATH set to the global modules: NODE_PATH=$(npm root -g) node scripts/sweep-shot.cjs ... */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn,execFileSync}=require('child_process');const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..');const [out,...ids]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const port=4300+Math.floor(Math.random()*600);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
(async()=>{await new Promise(r=>setTimeout(r,1200));const PX=process.env.HTTPS_PROXY||process.env.https_proxy;const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox',...(PX?['--proxy-server=https='+PX.replace(/^https?:\/\//,'')]:[])]});
 const ctx=await b.newContext({viewport:{width:1440,height:900},acceptDownloads:true,serviceWorkers:'block',ignoreHTTPSErrors:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 const p=await ctx.newPage();p.setDefaultTimeout(180000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
 for(const id of ids){const s=slug(id);
  await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent(id),{waitUntil:'domcontentloaded'});
  const ok=await p.waitForFunction(id=>typeof exportMenu==='function'&&current&&current.id===id&&!document.body.classList.contains('staged'),id).then(()=>1,()=>0);
  if(!ok){console.log('NOT FOUND',id);continue}
  await p.waitForTimeout(3500);
  const [dl]=await Promise.all([p.waitForEvent('download'),p.evaluate(()=>exportMenu('pdf','all',{}))]);
  const pdf=path.join(out,s+'-menu.pdf');await dl.saveAs(pdf);
  try{execFileSync('pdftoppm',['-r','80','-png',pdf,path.join(out,s+'-p')])}catch(e){}
  fs.writeFileSync(path.join(out,s+'-phone.txt'),await p.evaluate(()=>{const e=document.getElementById('fmtPhone');return e?e.innerText:''}));
  await p.evaluate(async()=>{const pages=kitPages(current,['Sam','Jordan'],2),done=await kitReady(pages);const h=document.createElement('div');h.id='kitShot';h.style.cssText='position:absolute;left:0;top:0;z-index:99999;display:flex;gap:10px;background:#777';pages.forEach(x=>{x.style.zoom='.45';h.appendChild(x)});document.body.appendChild(h);done();await new Promise(r=>setTimeout(r,300))});
  await (await p.$('#kitShot')).screenshot({path:path.join(out,s+'-kit.png')});await p.evaluate(()=>document.getElementById('kitShot').remove());
  console.log('done',id)}
 if(errs.length)console.log('page errors',errs);await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
