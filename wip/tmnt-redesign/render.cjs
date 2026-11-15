/* Renders the approved TMNT mockups to PNG. Placeholders like {a06hi} are TMDB still URLs from img.json.
   NODE_PATH=$(npm root -g) node wip/tmnt-redesign/render.cjs 1990-takeaway ii-door-hangers iii-washi-fold */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=__dirname,M=JSON.parse(fs.readFileSync(path.join(D,'img.json')));
(async()=>{const PX=process.env.HTTPS_PROXY;
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox','--allow-file-access-from-files',...(PX?['--proxy-server=https='+PX.replace(/^https?:\/\//,'')]:[])]});
 const ctx=await b.newContext({viewport:{width:1344,height:1056},ignoreHTTPSErrors:true});
 for(const n of process.argv.slice(2)){const h=fs.readFileSync(path.join(D,n+'.html'),'utf8').replace(/\{(\w\d\d(?:hi)?|p\d)\}/g,(_,k)=>M[k]||'');
  const tmp=path.join(D,'_'+n+'.html');fs.writeFileSync(tmp,h);const p=await ctx.newPage();await p.goto('file://'+tmp,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);await p.locator('.card').screenshot({path:path.join(D,n+'.png')});await p.close();fs.unlinkSync(tmp);console.log('ok',n)}
 await b.close()})();
