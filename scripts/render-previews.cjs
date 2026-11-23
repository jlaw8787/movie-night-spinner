/* Renders a preview picture of each film's printed menu for the film pages (menu/<slug>/).
     node scripts/render-previews.cjs                 every film missing a preview
     node scripts/render-previews.cjs --all           redo every film
     node scripts/render-previews.cjs "Jaws (1975)"   just these films
   Output: assets/menu-previews/<slug>.jpg, shot at 2x so it stays sharp on phone screens: 1200 wide, 1600 for two-page spreads,
   2000 for three-page strips (the film page shows it at half that size).
     node scripts/render-previews.cjs --wide          redo the spreads and strips (wider than 1.5 to 1)
     node scripts/render-previews.cjs --stale         redo every film whose preview no longer matches its menu (data/preview-stamps.json)
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
const wide=args.includes('--wide')?new Set(execFileSync('python3',['-c',"import os,sys\nfrom PIL import Image\nfor f in os.listdir(sys.argv[1]):\n w,h=Image.open(os.path.join(sys.argv[1],f)).size\n if w/h>=1.5: print(f[:-4])",OUT]).toString().split('\n').filter(Boolean)):null;
const PS=require('./preview-stamp.cjs'),SF=path.join(ROOT,PS.STAMPS),stamps=fs.existsSync(SF)?JSON.parse(fs.readFileSync(SF,'utf8')):{};
const stale=args.includes('--stale');
const PF=path.join(ROOT,'data/card-print.json'),printed=fs.existsSync(PF)?JSON.parse(fs.readFileSync(PF,'utf8')):{};
/* review 40: a hand-built one-off prints its own dishes (formats/<key>.js), so its film page reads what the card and phone menu print:
   each phone dish (name, the description and film line as the card prints them, the phone's own recipe), kept only when the card prints
   the name. Saved to data/card-print-hb.json */
const HF=path.join(ROOT,'data/card-print-hb.json'),hbPrinted=fs.existsSync(HF)?JSON.parse(fs.readFileSync(HF,'utf8')):{};
const VF=path.join(ROOT,'data/card-venue.json'),venues=fs.existsSync(VF)?JSON.parse(fs.readFileSync(VF,'utf8')):{};
const todo=(named.length?named:films).filter(id=>wide?wide.has(slug(id)):stale?stamps[id]!==PS.stamp(id):all||named.length||!fs.existsSync(path.join(OUT,slug(id)+'.jpg')));
/* the fingerprint is saved as each preview lands, and written out every 25 films so a stopped run keeps what it did */
const saveStamps=()=>{{const v={};for(const k of Object.keys(venues).sort())v[k]=venues[k];fs.writeFileSync(VF,JSON.stringify(v,null,0).replace(/","/g,'",\n"')+'\n')}const o={};for(const k of Object.keys(stamps).sort())o[k]=stamps[k];fs.writeFileSync(SF,JSON.stringify(o,null,0).replace(/","/g,'",\n"')+'\n');const q={};for(const k of Object.keys(printed).sort())q[k]=printed[k];fs.writeFileSync(PF,'{\n'+Object.entries(q).map(([k,v])=>JSON.stringify(k)+':'+JSON.stringify(v)).join(',\n')+'\n}\n');const h={};for(const k of Object.keys(hbPrinted).sort())h[k]=hbPrinted[k];fs.writeFileSync(HF,'{\n'+Object.entries(h).map(([k,v])=>JSON.stringify(k)+':'+JSON.stringify(v)).join(',\n')+'\n}\n')};
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
  /* review 39: the film page lists what the card prints, so each render also saves the printed dish list (names and notes as printed,
     alcohol-free on a dry card, house lines marked) to data/card-print.json, under the same fingerprint as the preview */
  try{printed[id]=await page.evaluate(()=>{const NZ=t=>String(t||'').toLowerCase().replace(/[\u2018\u2019']/g,"'").replace(/[^a-z0-9]+/g,' ').trim(),FACE=NZ(card.textContent),f=current,m=f.printMenu||f.menu||{},dry=typeof dryNow==='function'&&dryNow(f),T=x=>{let t=String(x||'');try{t=dietText(f,t)}catch(e){}try{if(dry)t=dryText(t,true)}catch(e){}return t};
    const out=[];for(const k of ['s','m','w','d'])for(const it of (m[k]||[]))if(it&&(it.label||it.n)&&!(it.house&&!FACE.includes(NZ(T(it.label||it.n)).slice(0,28))))out.push([k,T(it.label||it.n),T(it.note||''),it.house?1:0]);return out})}catch(e){}/* review 44: a house line the layout had no room for is not on the card, so not on the page (Me, Myself & Irene's beer) */
  /* review 44: the page names the venue only when the card prints it (27 pages said "The menu is set at" a place the card never names) */
  try{const v=await page.evaluate(()=>{const fl=current._lib&&current._lib.flavour||{},N=t=>String(t||'').toLowerCase().replace(/[\u2018\u2019']/g,"'").replace(/[^a-z0-9]+/g,' ').trim();return fl.venue&&N(card.textContent).includes(N(fl.venue))?fl.venue:''});if(v)venues[id]=v;else delete venues[id]}catch(e){}
  try{const hb=await page.evaluate(()=>{const a=typeof pvArgs!=='undefined'&&pvArgs;if(!a||!a[1]||a[1].fmt==='lib')return null;
    const lines=card.innerText.split('\n').map(x=>x.trim()).filter(Boolean),N=t=>String(t||'').toLowerCase().replace(/[\u2018\u2019']/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[^a-z0-9]+/g,' ').trim(),face=N(card.textContent);
    const menu=a[2]||{},cs=FMT_COURSES.map(c=>c[0]).filter(c=>(menu[c]||[]).some(it=>it&&it.label)),out=[];
    const usedL=new Set(),all=[...fmtPhone.querySelectorAll('.fp-name')].map(e=>e.textContent.replace(/\s+/g,' ').trim());
    fmtPhone.querySelectorAll('.fp-sec').forEach((sec,gi)=>{const c=cs[+sec.dataset.g]||'m';sec.querySelectorAll('.fp-dish').forEach(ar=>{const q=s=>{const e=ar.querySelector(s);return e?e.textContent.replace(/\s+/g,' ').trim():''};
      let n=q('.fp-name');const desc=q('.fp-desc'),film=q('.fp-film'),on=t=>t&&face.includes(N(t));if(!n)return;
      let note=[on(desc)&&desc,on(film)&&film].filter(Boolean).reduce((a,t)=>a?a+(/[.!?”"')]$/.test(a)?' ':'. ')+t:t,'')||desc||film;/* review 42: two card lines join with a full stop (My Cousin Vinny printed "Butter & sharp cheddar The grits cross-examination.") */
      /* review 43: the page reads the card line for line. The card's own line under the dish name is the note (Casino printed "Buttermilk batter.
         Count them. We did." while the phone says "ten berries in every one"); the next line joins it only when it is the dish's film line, so a
         footer elsewhere on the card no longer tags on (The Godfather's "An orange on every table."). A dry rename takes the card's name. */
      {const P=l=>/^[\s$£€.,\d¢cp\/-]*$/.test(l)||/^[$£€]?\d+(?:[.,]\d+)?\s*(?:¢|c|p)?$/.test(l)||/^[IVXLC]{1,5}\.?$/.test(l)||/^[A-Z]?\d{1,2}$/.test(l),NN=N(n),names=new Set(all.map(N)),NL=l=>N(l).replace(/^[a-z]?\d{1,2}\s*(?=[a-z])/,'').replace(/^[ivx]{1,4}\s+/,'');
       /* a price can sit hard against the name ("Orange butter cake3.50") and a code can lead it ("A1 Espresso & anisette") */
       let i=lines.findIndex((l,k)=>{if(usedL.has(k))return false;const a=NL(l);return a===NN||a.startsWith(NN+' ')||(a.startsWith(NN)&&/^\d/.test(a.slice(NN.length)))});
       if(i<0&&!on(n)){const W=t=>new Set(N(t).split(' ').filter(w=>w.length>2)),wn=W(n);let best=-1,bs=0;lines.forEach((l,k)=>{if(usedL.has(k)||P(l))return;const wl=W(l);if(!wl.size)return;let c=0;wn.forEach(w=>{if(wl.has(w))c++});const sc=c/Math.max(wn.size,wl.size);if(sc>bs){bs=sc;best=k}});if(bs>=0.6){i=best;n=lines[best].replace(/\s*[$£€]?\d+(?:[.,]\d+)?\s*$/,'').trim()}}
       if(i>=0){usedL.add(i);const rel=t=>{const a=new Set(N(t).split(' ').filter(w=>w.length>3));return N(desc+' '+film).split(' ').some(w=>w.length>3&&a.has(w))};
        let j=i+1;while(j<lines.length&&P(lines[j]))j++;const L1=lines[j];
        if(L1&&!names.has(N(L1))&&!(L1===L1.toUpperCase()&&L1.split(' ').length<=4)&&rel(L1)){let t=L1;let k=j+1;while(k<lines.length&&P(lines[k]))k++;const L2=lines[k];
          if(L2&&film&&N(L2).length>8&&(N(film).includes(N(L2))||N(L2).includes(N(film)))&&!N(t).includes(N(L2)))t=t+(/[.!?”"')]$/.test(t)?' ':'. ')+L2;note=t}}}
      /* the card may print its own name for the dish above the same words (Big's "Caviar canapés"): the page takes the card's name */
      let pr=on(n)?1:0;if(!pr)for(const t of [desc,film]){if(!t||!on(t))continue;const i=lines.findIndex(l=>N(l)===N(t)||N(l).startsWith(N(t)));if(i>0){const nm=lines.slice(Math.max(0,i-2),i).reverse().find(l=>!/^[\s$£€.,\d¢cp/-]*$/.test(l)&&N(l).length>2);if(nm){n=nm.replace(/\s*[$£€]?\d+(?:[.,]\d+)?\s*$/,'').trim();if(n===n.toUpperCase())n=n.charAt(0)+n.slice(1).toLowerCase();pr=1;break}}}
      out.push({c,n,note,printed:pr,ing:[...ar.querySelectorAll('.fp-ing li')].map(x=>x.textContent.trim()),steps:[...ar.querySelectorAll('.fp-steps li,.fp-step1')].map(x=>x.textContent.trim())})})});
    return out});if(hb)hbPrinted[id]=hb;else delete hbPrinted[id]}catch(e){console.error("hb",id,String(e).slice(0,300))}
  const tmp=path.join(os.tmpdir(),'rp-'+slug(id)+'.png');
  await page.locator('#snapWrap').screenshot({path:tmp});
  return tmp;
}
(async()=>{
  if(!todo.length){console.log('All previews present.');server.kill();return}
  await ready();
  /* behind a sandbox proxy (HTTPS_PROXY set) the TMDB photos need it, as in check-print-text */
  const PX=process.env.HTTPS_PROXY||process.env.https_proxy;
  const browser=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER,args:['--no-sandbox']}:{}),...(PX?{args:[...(process.env.MNS_BROWSER?['--no-sandbox']:[]),'--proxy-server=https='+PX.replace(/^https?:\/\//,'')]}:{})});
  let done=0,fail=[];const t0=Date.now(),queue=todo.slice();
  async function worker(){
    const ctx=await browser.newContext({viewport:{width:1400,height:1300},deviceScaleFactor:2,ignoreHTTPSErrors:!!PX});
    await ctx.addInitScript(()=>{try{localStorage.setItem('mns-welcome','1')}catch(e){}window.__mnsNoDesk=1});/* review 35: the whole card, not the desktop page view */
    const page=await ctx.newPage();
    while(queue.length){const id=queue.shift();
      try{const tmp=await snap(page,id);
        execFileSync('python3',['-c',`import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB')
r=im.width/im.height
w=2000 if r>=2 else 1600 if r>=1.5 else 1200
im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
im.save(sys.argv[2],'JPEG',quality=80,optimize=True,progressive=True)`,tmp,path.join(OUT,slug(id)+'.jpg')]);
        fs.unlinkSync(tmp);stamps[id]=PS.stamp(id);
      }catch(e){fail.push(id+': '+String(e.message||e).split('\n')[0])}
      done++;if(done%25===0){saveStamps();console.log(done+'/'+todo.length+' in '+Math.round((Date.now()-t0)/1000)+'s')}
    }
    await ctx.close();
  }
  await Promise.all(Array.from({length:Math.min(WORKERS,todo.length)},worker));
  await browser.close();saveStamps();
  console.log('Done '+(done-fail.length)+'/'+todo.length+' in '+Math.round((Date.now()-t0)/1000)+'s');
  if(fail.length){console.log('Failed:\n'+fail.join('\n'));process.exitCode=1}
  server.kill();process.exit();
})();
