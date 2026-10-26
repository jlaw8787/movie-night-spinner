"""Open every library film in the real app and check: format rendered (not lobby), no page errors, no text spill, nothing under 14px.
Usage: python3 sweep.py [format ...]   Writes wip/genre/proofs/_sweep/<slug>.png thumbnails and prints failures."""
import asyncio,os,sys,json,re
from urllib.parse import quote
from playwright.async_api import async_playwright
R='/home/claude/polish';OUT=f'{R}/wip/genre/proofs/_sweep';os.makedirs(OUT,exist_ok=True)
A=json.load(open(f'{R}/data/film-format.json'));only=set(sys.argv[1:])
films=json.load(open(os.environ['ONLY'])) if os.environ.get('ONLY') else [k for k,v in A.items() if not only or v['format'] in only]
JS=r"""(()=>{const c=document.querySelector('#preview .mcard');if(!c)return {cls:'none',iss:[]};const out=[];
c.querySelectorAll('.fx-face').forEach(f=>{const fr=f.getBoundingClientRect(),k=fr.width/f.offsetWidth||1;
f.querySelectorAll('*').forEach(e=>{if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;const cs=getComputedStyle(e);
if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;const r=e.getBoundingClientRect();if(!r.width)return;
const o=Math.max(r.bottom-fr.bottom,r.right-fr.right,fr.top-r.top,fr.left-r.left)/k;if(o>3)out.push('spill '+Math.round(o)+': '+e.textContent.trim().slice(0,30));
if(((cs.webkitLineClamp&&cs.webkitLineClamp!=='none')||cs.textOverflow==='ellipsis')&&(e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2))out.push('cut: '+e.textContent.trim().slice(0,30));
if(parseFloat(cs.fontSize)<13.5)out.push('small '+cs.fontSize+': '+e.textContent.trim().slice(0,20))})});return {cls:c.className,iss:out}})()"""
QJS=r"""(async()=>{const c=document.querySelector('#preview .mcard');if(!c||!c.classList.contains('fmt-lib'))return [];const out=[];
const imgs=[...c.querySelectorAll('.fx-face img')].filter(i=>{const r=i.getBoundingClientRect();return r.width>40&&r.height>40&&getComputedStyle(i).visibility!=='hidden'&&getComputedStyle(i).display!=='none'});
const key=i=>((i.currentSrc||i.src).match(/\/t\/p\/[^/]+(\/[^?]+)/)||[])[1]||'';
const seen={};imgs.forEach(i=>{const k=key(i);if(k&&!/logo/.test(i.className)){seen[k]=(seen[k]||0)+1}});
Object.entries(seen).forEach(([k,n])=>{if(n>1)out.push('dup photo x'+n+' '+k.slice(0,12))});
let big=null,ba=0;const f1=c.querySelector('.fx-face');imgs.filter(i=>f1.contains(i)).forEach(i=>{const r=i.getBoundingClientRect();if(r.width*r.height>ba){ba=r.width*r.height;big=i}});
if(big){const nr=big.naturalHeight/big.naturalWidth;if(!(nr>1.3&&nr<1.6))out.push('main picture is not the poster (ratio '+nr.toFixed(2)+')')}
for(const i of imgs){try{if(!i.complete||!i.naturalWidth){out.push('photo failed to load');continue}
const cv=document.createElement('canvas');cv.width=24;cv.height=24;const x=cv.getContext('2d');x.drawImage(i,0,0,24,24);const d=x.getImageData(0,0,24,24).data;let s=0,s2=0,w=0,n=0;
for(let j=0;j<d.length;j+=4){const l=(d[j]*.3+d[j+1]*.59+d[j+2]*.11);s+=l;s2+=l*l;n++;if(d[j]>232&&d[j+1]>232&&d[j+2]>232)w++}
const m=s/n,sd=Math.sqrt(s2/n-m*m);if(m<18)out.push('near-black photo');else if(sd<10)out.push('flat or blank photo');if(w/n>.45)out.push('mostly white photo')}catch(e){}}
const hid=[...c.querySelectorAll('.fx-face *')].filter(e=>e.style.visibility==='hidden'&&e.textContent.trim().length>8).length;if(hid>2)out.push(hid+' text lines hidden to fit');
return out})()"""
async def worker(b,q,res):
  c=await b.new_context(viewport={'width':1400,'height':1000})
  while q:
    film=q.pop();pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:80]))
    try:
      await pg.goto('http://localhost:8795/?film='+quote(film),timeout=30000)
      await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&(c.classList.contains('fmt-lib')||c.classList.contains('L-lobby'))})()",timeout=25000)
      await pg.wait_for_timeout(1500)
      try: await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return !c.classList.contains('fmt-lib')||c.dataset.unclip})()",timeout=15000)
      except Exception: pass
      r=await pg.evaluate(JS)
      try:
        qq=await pg.evaluate(QJS)
        r['iss']=r['iss']+qq
      except Exception as e:r['iss'].append('qcheck error '+str(e)[:60])
      if 'fmt-lib' not in r['cls'] or r['iss'] or errs: res.append((film,A[film]['format'],r['cls'][:40],r['iss'][:3],errs[:2]))
      el=await pg.query_selector('#preview');s=re.sub(r'[^a-z0-9]+','-',film.lower()).strip('-')
      await el.screenshot(path=f'{OUT}/{s}.jpg',type='jpeg',quality=50)
    except Exception as e: res.append((film,A[film]['format'],'timeout',[str(e)[:60]],errs[:2]))
    await pg.close()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    q=films[:];res=[]
    await asyncio.gather(*[worker(b,q,res) for _ in range(10)])
    for r in sorted(res,key=lambda x:x[1]): print('FAIL',*r)
    print(len(films),'films,',len(res),'failures')
    await b.close()
asyncio.run(main())
