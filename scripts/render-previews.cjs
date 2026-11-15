/* Renders a preview picture of each film's printed menu for the film pages (menu/<slug>/).
     node scripts/render-previews.cjs                 every film missing a preview
     node scripts/render-previews.cjs --all           redo every film
     node scripts/render-previews.cjs "Jaws (1975)"   just these films
   Output: assets/menu-previews/<slug>.jpg, 600 wide, about 50 to 70 KB each.
   Opens the real app (index.html?film=...) on a local server, waits for the menu card, and snaps it at full A4 size. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {spawn,execFileSync}=require('child_process');
const fs=require('fs'),path=require('path'),http=require('http'),os=require('os');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'assets/menu-previews');
const PORT=String(process.env.MNS_PORT||4191),ORIGIN='http://127.0.0.1:'+PORT;
const WORKERS=+(process.env.WORKERS||4);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const films=JSON.parse(fs.readFileSync(path.join(ROOT,'data/films.json'),'utf8')).map(f=>f.title+' ('+f.year+')');
const args=process.argv.slice(2),all=args.includes('--all'),named=args.filter(a=>!a.startsWith('--'));
fs.mkdirSync(OUT,{recursive:true});
const todo=(named.length?named:films).filter(id=>all||named.length||!fs.existsSync(path.join(OUT,slug(id)+'.jpg')));
const server=spawn('python3',['-m','http.server',PORT,'--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
process.on('exit',()=>server.kill());
const ready=async()=>{for(let i=0;i<60;i++){const ok=await new Promise(r=>{http.get(ORIGIN+'/index.html',res=>{res.resume();r(res.statusCode===200)}).on('error',()=>r(false))});if(ok)return;await new Promise(r=>setTimeout(r,250))}throw Error('server did not start')};
async function snap(page,id){
  await page.goto(ORIGIN+'/index.html?film='+encodeURIComponent(id),{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.preview .mcard',{timeout:30000});
  /* the app re-fits lines for a few seconds after a menu opens; wait for that and for images */
  await page.waitForTimeout(5500);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.preview .mcard img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,8000)})))});
  const box=await page.evaluate(()=>{const c=document.querySelector('.preview .mcard'),p=c.parentElement;
    /* lift the card out of its scaled phone frame so it snaps at true A4 size */
    const wrap=document.createElement('div');wrap.id='snapWrap';wrap.style.cssText='position:fixed;left:0;top:0;z-index:2147483647;background:#fff';
    document.body.appendChild(wrap);const k=c.cloneNode(true);k.style.transform='none';k.style.position='relative';wrap.appendChild(k);
    const r=k.getBoundingClientRect();return {w:r.width,h:r.height}});
  const tmp=path.join(os.tmpdir(),'rp-'+slug(id)+'.png');
  await page.locator('#snapWrap').screenshot({path:tmp});
  return tmp;
}
(async()=>{
  if(!todo.length){console.log('All previews present.');server.kill();return}
  await ready();
  const browser=await chromium.launch();
  let done=0,fail=[];const t0=Date.now(),queue=todo.slice();
  async function worker(){
    const ctx=await browser.newContext({viewport:{width:1400,height:1300},deviceScaleFactor:1});
    await ctx.addInitScript(()=>{try{localStorage.setItem('mns-welcome','1')}catch(e){}});
    const page=await ctx.newPage();
    while(queue.length){const id=queue.shift();
      try{const tmp=await snap(page,id);
        execFileSync('python3',['-c',`import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB')
w=600;im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
im.save(sys.argv[2],'JPEG',quality=72,optimize=True,progressive=True)`,tmp,path.join(OUT,slug(id)+'.jpg')]);
        fs.unlinkSync(tmp);
      }catch(e){fail.push(id+': '+String(e.message||e).split('\n')[0])}
      done++;if(done%25===0)console.log(done+'/'+todo.length+' in '+Math.round((Date.now()-t0)/1000)+'s');
    }
    await ctx.close();
  }
  await Promise.all(Array.from({length:Math.min(WORKERS,todo.length)},worker));
  await browser.close();
  console.log('Done '+(done-fail.length)+'/'+todo.length+' in '+Math.round((Date.now()-t0)/1000)+'s');
  if(fail.length){console.log('Failed:\n'+fail.join('\n'));process.exitCode=1}
  server.kill();process.exit();
})();
