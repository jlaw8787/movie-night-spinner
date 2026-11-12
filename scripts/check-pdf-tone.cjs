/* Save PDF against the screen (review 12, fix 1 and 2).
   Renders each film's printed menu on screen and through the Save PDF renderer (renderCanvas in app.js, html2canvas),
   then compares the two: average brightness and contrast (spread of brightness) must stay within a few per cent.
   A wash layer html2canvas cannot draw (a big blurred inset shadow, an elliptical vignette, a blurred backdrop)
   shows up as a drop in both.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-pdf-tone.cjs ["Film (Year)" ... | --per N | --all]
   MNS_SHARD=k/n splits --all over jobs; MNS_TONE_SCALE=1 renders the print copy at screen size for speed.
   A scaled run is a screen only: the bake in app.js is tuned for 2.5, so a scaled pass ends with exit 2, not a sign-off.
   MNS_PROXY_HTTPS=1 passes only https to the proxy and keeps local http direct.
   MNS_LIBDIR=<folder with h2c.js and jspdf.js> serves the two export libraries locally when the CDN is out of reach. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
let sharp;try{sharp=require('sharp')}catch(e){}
const R=path.join(__dirname,'..'),port=4700+Math.floor(Math.random()*200);
/* one gritty or scrappy film per layout that used to wash out, plus the night diners and a few that always printed fine */
const SAMPLE=['Die Hard 2 (1990)','Con Air (1997)','The Hangover (2009)','John Wick (2014)',"Bridget Jones's Diary (2001)",'Tombstone (1993)',
  'Lock, Stock and Two Smoking Barrels (1998)','Batman Begins (2005)','The Birds (1963)','Shaft (1971)','A Nightmare on Elm Street (1984)','Final Destination (2000)',
  /* review 13: home printed its white cards grey, tavern and lab lost their aged edges */
  'Skyfall (2012)','True Grit (2010)','The Conjuring (2013)','The Fly (1986)'];
/* --per N: N films from every shared layout instead of the named sample */
const A=process.argv.slice(2),PER=A[0]==='--per'?+A[1]||1:0,ALL=A[0]==='--all';
/* review 21: --all reads every film in films.js */
let FILMS=PER||ALL?[]:A.length?A:SAMPLE;
if(PER){const FM=JSON.parse(fs.readFileSync(path.join(R,'data/film-format.json'),'utf8')),n={};for(const [id,v] of Object.entries(FM)){const k=v&&v.format;if(!k)continue;n[k]=(n[k]||0)+1;if(n[k]<=PER)FILMS.push(id)}}
/* the fault is a print darker or flatter than the screen. Brightness is in levels out of 255, so a dark paper's small shift
   does not read as a big percentage: the washed-out prints of review 12 lost 35 to 60 levels */
/* review 13: a lost edge vignette shows as +8 to +13 levels, so both limits sit at 6 */
const DARKER=6,FLATTER=.15,LIGHTER=6;
/* the app is ready once show() exists and a film is on screen. If app.js failed to load (a busy local server), 'current' never
   exists, so wait a minute, reload once, and say what the page reported */
const appReady=async p=>{if(!p.__err){p.__err=1;p.on('pageerror',e=>console.log('page error: '+String(e.message||e).split('\n')[0]))}
 for(let t=0;t<2;t++){try{await p.waitForFunction(()=>{try{return typeof show==='function'&&!!current}catch(e){return false}},null,{timeout:60000});return}
  catch(e){if(t)throw Error('app did not start after a reload');await p.reload({waitUntil:'domcontentloaded'})}}};
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
async function stats(buf){
  if(sharp){const {data,info}=await sharp(buf).removeAlpha().resize({width:400}).raw().toBuffer({resolveWithObject:true});
    let s=0,s2=0,n=info.width*info.height;for(let i=0;i<data.length;i+=3){const y=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];s+=y;s2+=y*y}
    const m=s/n;return {mean:m,sd:Math.sqrt(Math.max(0,s2/n-m*m))}}
  throw Error('sharp is needed (npm i -g sharp)')}
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const NET=!!process.env.MNS_NET,PX=process.env.HTTPS_PROXY||process.env.https_proxy;
 /* review 21: MNS_PROXY_HTTPS=1 sends only https through the proxy (the export libraries, and with MNS_NET the stills) and keeps local http direct */
 const HO=!!process.env.MNS_PROXY_HTTPS;
 /* MNS_NET=1 lets the film stills and posters load (image.tmdb.org), so photo layers are compared too */
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),...(NET&&PX&&!HO?{proxy:{server:PX,bypass:'127.0.0.1,localhost'}}:{}),args:['--no-sandbox',...(PX&&HO?['--proxy-server=https='+new URL(PX).host]:[])]});
 const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',ignoreHTTPSErrors:NET});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 const LIB=process.env.MNS_LIBDIR;
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());
  if(u.hostname==='cdnjs.cloudflare.com'){if(LIB){const f=/html2canvas/.test(u.pathname)?'h2c.js':/jspdf/.test(u.pathname)?'jspdf.js':'';if(f)return r.fulfill({path:path.join(LIB,f),contentType:'application/javascript'})}return r.continue()}
  return u.hostname==='127.0.0.1'||NET&&u.hostname==='image.tmdb.org'||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 let p=await ctx.newPage();p.setDefaultTimeout(180000);
 /* page.evaluate ignores the default timeout, so each film's waits race a timer and a stuck film is a fault, not a hang */
 const T=+process.env.MNS_FILM_TIMEOUT||240000,timed=(pr,what)=>Promise.race([pr,new Promise((_,no)=>setTimeout(()=>no(Error(what+' timed out')),T))]);
 if(ALL){await p.goto(`http://127.0.0.1:${port}/`,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>typeof FILMS!=='undefined'&&FILMS.length&&FILMS[0].id);FILMS=await p.evaluate(()=>FILMS.map(f=>f.id))}
 /* MNS_SHARD=k/n reads every nth film from the kth, so a long run can be split over two jobs */
 const SHV=process.env.MNS_SHARD||'',SH=SHV.match(/^(\d+)\/(\d+)$/);
 if(SHV&&(!SH||+SH[1]<1||+SH[1]>+SH[2])){console.log('FAIL: MNS_SHARD must be k/n with 1 <= k <= n, got "'+SHV+'"');await b.close();process.exit(1)}
 if(SH)FILMS=FILMS.filter((x,i)=>i%+SH[2]===+SH[1]-1);
 if(!FILMS.length){console.log('FAIL: no films to check');await b.close();process.exit(1)}
 /* 2.5 is the real Save PDF scale, so only another value counts as a scaled run */
 const SCALE=+process.env.MNS_TONE_SCALE&&+process.env.MNS_TONE_SCALE!==2.5?+process.env.MNS_TONE_SCALE:0;
 const fails=[],rows=[];
 for(const id of FILMS){try{
  await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent(id),{waitUntil:'domcontentloaded'});
  await appReady(p);
  const ok=await timed(p.evaluate(async id=>{const f=FILMS.find(x=>x.id===id);if(!f)return false;await ensureExact(f);await show(f,true);
   await Promise.all([...card.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));await document.fonts.ready;return true},id),'loading the menu');
  if(!ok){fails.push(id+': not found');continue}
  await p.waitForTimeout(600);
  /* the screen copy: the card as Chrome draws it, at full size on its own layer over the page */
  const box=await p.evaluate(()=>{const land=card.classList.contains('fmt'),w=+card.dataset.w||(land?1123:794),h=+card.dataset.h||(land?794:1123);
   const st=document.createElement('div');st.id='__tone';st.style.cssText=`position:fixed;left:0;top:0;width:${w}px;height:${h}px;z-index:2147483647;background:${STY[current.theme].mg}`;
   const c=card.cloneNode(true);c.style.transform='none';c.hidden=false;st.appendChild(c);document.body.appendChild(st);return {w,h}});
  await p.setViewportSize({width:Math.max(1440,Math.ceil(box.w)),height:Math.max(900,Math.ceil(box.h))});
  await timed(p.evaluate(()=>Promise.all([...document.querySelectorAll('#__tone img')].map(i=>i.decode().catch(()=>{})))),'the screen copy');await p.waitForTimeout(300);
  const shot=await p.screenshot({clip:{x:0,y:0,width:box.w,height:box.h},animations:'disabled'});
  await p.evaluate(()=>document.getElementById('__tone').remove());await p.setViewportSize({width:1440,height:900});
  /* review 21: MNS_TONE_SCALE=1 draws the print copy at screen size instead of 2.5 times, about five times quicker for a sweep of every film.
     Brightness and contrast are read off a 400 wide copy either way; confirm a fault at the real scale */
  const url=await timed(p.evaluate(async S=>{if(!await loadExportTools(false))return null;
   if(S&&!html2canvas.__s){const h=html2canvas;window.html2canvas=(e,o)=>h(e,{...o,scale:S});html2canvas.__s=1}
   const c=await renderCanvas(card,true);return c.toDataURL('image/png')},SCALE),'the Save PDF render');
  if(!url){fails.push(id+': export tools did not load');continue}
  const pdf=Buffer.from(url.split(',')[1],'base64');
  const a=await stats(shot),z=await stats(pdf);
  const db=(z.mean-a.mean)/a.mean,dc=(z.sd-a.sd)/a.sd,fmt=await p.evaluate(()=>current._lib&&current._lib.fmt||'');
  const dl=z.mean-a.mean;rows.push(`${id} (${fmt}${SCALE?', scale '+SCALE:''}): brightness ${dl>=0?'+':''}${dl.toFixed(1)} levels (${(db*100).toFixed(1)}%), contrast ${(dc*100).toFixed(1)}%`);console.log(rows[rows.length-1]);
  if(process.env.MNS_SHOTS){const d=process.env.MNS_SHOTS,s=id.replace(/[^a-z0-9]+/gi,'-');fs.writeFileSync(path.join(d,s+'-screen.png'),shot);fs.writeFileSync(path.join(d,s+'-pdf.png'),pdf)}
  if(dl<-DARKER||dc<-FLATTER||dl>LIGHTER)fails.push(rows[rows.length-1])
  }catch(e){fails.push(id+': '+String(e.message||e).split('\n')[0]);console.log(fails[fails.length-1]);
   /* a crashed or stuck page would fail every film after it, so start the next film on a fresh one */
   try{await p.close()}catch(_){}p=await ctx.newPage();p.setDefaultTimeout(180000)}
  finally{try{if(!p.isClosed())await p.setViewportSize({width:1440,height:900})}catch(_){}}}
 await b.close();if(fails.length){console.log('FAIL:\n  '+fails.join('\n  '));process.exit(1)}
 if(SCALE){console.log(`PASS (scaled sweep at ${SCALE}, not a sign-off): rerun any film you care about at full scale`);process.exit(2)}
 console.log('PASS: Save PDF holds the screen\'s brightness and contrast');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
