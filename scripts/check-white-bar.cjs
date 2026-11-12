/* White bar scan for the Save PDF (review 24, fix 3).
   Saves each hand-built menu through the real path, exportMenu('pdf','menu'), reads every page with pdftoppm and fails on a
   coloured page where a row in the bottom 15% (or top 10%) is more than 92% near-white, or holds an unbroken near-white run over half the width (a note hanging over the strip breaks it up): the white strip Ratatouille (review 21)
   and Back to the Future (review 24) printed under the card. Also reports the four margin colours of each page, so a page
   on a different surround from its sister pages shows up (review 24, fix 6).
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-white-bar.cjs ["Film (Year)" ... | --fmt diner,lous] [--phone]
   With no films named it reads every hand-built menu (formats-core.js FMT_INDEX). Stills come from image.tmdb.org through
   the proxy (https only), local http stays direct. Needs pdftoppm and sharp. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn,execFileSync}=require('child_process');
const path=require('path'),fs=require('fs'),os=require('os');const sharp=require('sharp');
const R=path.join(__dirname,'..'),port=4900+Math.floor(Math.random()*90);
const A=process.argv.slice(2),PHONE=A.includes('--phone'),fi=A.indexOf('--fmt'),FMTS=fi>=0?A[fi+1].split(','):null;
const named=A.filter((a,i)=>!a.startsWith('--')&&!(fi>=0&&i===fi+1));
const IDX=JSON.parse(fs.readFileSync(path.join(R,'formats-core.js'),'utf8').match(/const FMT_INDEX=(\{.*?\});/)[1]);
const FILMS=named.length?named:Object.keys(IDX).filter(id=>!FMTS||FMTS.includes(IDX[id]));
const OUT=fs.mkdtempSync(path.join(os.tmpdir(),'whitebar-'));
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
/* the bar is the print copy's white padding, pure white; a card's own white paper (Spider-Man, Ghostbusters II) reads 246 to 250 */
const near=(r,g,b)=>r>=252&&g>=252&&b>=252,pale=(r,g,b)=>r>=238&&g>=238&&b>=238;
async function scan(png){const {data,info}=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true});const W=info.width,H=info.height;
  const px=(x,y)=>{const i=(y*W+x)*3;return [data[i],data[i+1],data[i+2]]};
  const edge=(xs,ys)=>{let s=[0,0,0],n=0;for(const y of ys)for(const x of xs){const p=px(x,y);s[0]+=p[0];s[1]+=p[1];s[2]+=p[2];n++}return s.map(v=>Math.round(v/n))};
  const m=2,rng=(a,b)=>{const o=[];for(let i=a;i<b;i++)o.push(i);return o};
  const margins={t:edge(rng(0,W),rng(0,m)),b:edge(rng(0,W),rng(H-m,H)),l:edge(rng(0,m),rng(0,H)),r:edge(rng(W-m,W),rng(0,H))};
  const coloured=!Object.values(margins).every(c=>pale(...c));const rows=[];
  if(coloured){const x0=Math.round(W*.03),x1=W-x0;for(const y of [...rng(Math.round(H*.85),H-m),...rng(m,Math.round(H*.1))]){let n=0,run=0,best=0;for(let x=x0;x<x1;x++)if(near(...px(x,y))){n++;run++;if(run>best)best=run}else run=0;if(n/(x1-x0)>.92||best/(x1-x0)>.5)rows.push(y)}}
  return {W,H,margins,coloured,rows}}
/* --rescan DIR reads the page images of an earlier run again (after a change to the rule), with no browser */
if(A[0]==='--rescan'){(async()=>{let bad=0;for(const n of fs.readdirSync(A[1]).filter(n=>/-\d+\.png$/.test(n)).sort()){const s=await scan(path.join(A[1],n));if(s.rows.length){bad++;console.log(`FAIL ${n}: ${s.rows.length} near-white rows (y ${s.rows[0]} to ${s.rows[s.rows.length-1]} of ${s.H})`)}}console.log(bad?bad+' pages with a white bar':'no white bars');process.exit(bad?1:0)})();return}
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox',...(PX?['--proxy-server=https='+new URL(PX).host]:[])]});
 const ctx=await b.newContext({...(PHONE?{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}:{viewport:{width:1440,height:900},deviceScaleFactor:2}),serviceWorkers:'block',ignoreHTTPSErrors:true,acceptDownloads:true});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.hostname==='image.tmdb.org'||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(240000);p.on('pageerror',e=>console.log('page error: '+String(e.message||e).split('\n')[0]));
 const fails=[];
 for(const id of FILMS){try{
  await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent(id),{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>{try{return typeof show==='function'&&!!current}catch(e){return false}},null,{timeout:90000});
  await p.evaluate(async id=>{const f=FILMS.find(x=>x.id===id);await ensureExact(f);await show(f,true);await Promise.all([...card.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));await document.fonts.ready},id);
  await p.waitForTimeout(800);
  const [dl]=await Promise.all([p.waitForEvent('download',{timeout:240000}),p.evaluate(()=>{exportMenu('pdf','menu')})]);
  const pdf=path.join(OUT,id.replace(/[^\w]+/g,'_')+(PHONE?'-phone':'')+'.pdf');await dl.saveAs(pdf);
  const pre=pdf.slice(0,-4);execFileSync('pdftoppm',['-r','60','-png',pdf,pre]);
  const pngs=fs.readdirSync(OUT).filter(n=>n.startsWith(path.basename(pre)+'-')&&n.endsWith('.png')).sort();
  const pages=[];for(const n of pngs){const s=await scan(path.join(OUT,n));pages.push(s)}
  const bad=pages.map((s,i)=>s.rows.length?`page ${i+1}: ${s.rows.length} near-white rows (y ${s.rows[0]} to ${s.rows[s.rows.length-1]} of ${s.H})`:'').filter(Boolean);
  const mg=pages.map(s=>s.margins.l.join(',')).join(' | ');
  console.log(`${bad.length?'FAIL':'ok  '} ${id} [${IDX[id]||'?'}] margins ${mg}${bad.length?' :: '+bad.join('; '):''}`);
  if(bad.length)fails.push(id);
 }catch(e){console.log('FAIL '+id+': '+String(e.message||e).split('\n')[0]);fails.push(id)}}
 await b.close();console.log(`\n${FILMS.length-fails.length} of ${FILMS.length} clean. PDFs in ${OUT}`);process.exit(fails.length?1:0)})();
