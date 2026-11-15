/* Design-call mockups (15 Nov): render a film's printed face, optionally run a patch on the copy, save a PNG.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node wip/design-calls/mock.cjs "Film (Year)" face out.png [patch.js]
   patch.js is the body of a function (el, f) run on the face copy before the shot. */
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'../..');const [film,face,out,patch]=process.argv.slice(2);
const port=5900+Math.floor(Math.random()*90);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1000));const PX=process.env.HTTPS_PROXY;
 const b=await chromium.launch({executablePath:process.env.MNS_BROWSER,args:['--no-sandbox',...(PX?['--proxy-server=https='+PX.replace(/^https?:\/\//,'')]:[])]});
 const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',ignoreHTTPSErrors:true,deviceScaleFactor:1});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)||u.hostname==='image.tmdb.org'||u.protocol==='data:'||u.protocol==='blob:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const code=patch?fs.readFileSync(patch,'utf8'):'';
 const box=await p.evaluate(async([id,i,code])=>{const f=FILMS.find(x=>x.id===id);await ensureExact(f);await show(f,true);await document.fonts.ready;
  {const t0=Date.now();while(Date.now()-t0<10000&&[...card.querySelectorAll('img')].some(i=>i.getAttribute('src')&&!i.complete))await new Promise(r=>setTimeout(r,150))}
  await new Promise(r=>setTimeout(r,1500));
  const fs=[...card.querySelectorAll('.fx-face')],fc=fs[i];let el;
  if(fc){el=card.cloneNode(false);el.className=card.className;el.style.cssText=`width:${fc.style.width};height:${fc.style.height}`;el.innerHTML=fc.innerHTML.replace(/\s(onload|onerror)="[^"]*"/g,'')}else{el=card.cloneNode(true);el.style.transform='none'}
  const st=document.createElement('div');st.id='__au';st.style.cssText=`position:fixed;left:0;top:0;z-index:2147483647;background:${STY[current.theme].mg}`;st.appendChild(el);document.body.appendChild(st);
  let info='';if(code){info=await (new Function('el','f',code))(el,f)}
  return {w:el.offsetWidth,h:el.offsetHeight,info}},[film,+face,code]);
 await p.setViewportSize({width:Math.max(1440,box.w),height:Math.max(900,box.h)});await p.evaluate(()=>Promise.all([...document.querySelectorAll('#__au img')].map(i=>i.decode().catch(()=>{}))));await p.waitForTimeout(400);
 await p.screenshot({path:out,type:'png',clip:{x:0,y:0,width:box.w,height:box.h}});
 if(box.info)console.log(box.info);await b.close();process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
