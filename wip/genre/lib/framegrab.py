"""Per film: menu shot plus each visible scene photo as cropped on the page.
python3 wip/genre/lib/framegrab.py OUTDIR films.json   (json list of "Film (Year)")
Writes OUTDIR/<slug>.jpg (menu), OUTDIR/<slug>__<n>.jpg (frames) and OUTDIR/<slug>.json ([path, ...] per frame n)"""
import asyncio,os,re,sys,json
from urllib.parse import quote
from playwright.async_api import async_playwright
out=sys.argv[1];fs=json.load(open(sys.argv[2]));os.makedirs(out,exist_ok=True)
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
JS="""(()=>{const card=document.querySelector('#preview .mcard'),cr=card.getBoundingClientRect(),P=window.__poster||'';
 const path=i=>((i.getAttribute('src')||'').match(/\\/t\\/p\\/[^/]+(\\/[^?#]+)/)||[])[1]||'';
 const out=[];card.querySelectorAll('.fx-face img').forEach(i=>{const k=path(i);if(!k||/\\.png$/.test(k))return;
  if(getComputedStyle(i).objectFit==='contain'&&i.dataset.trim!=='1')return;
  let vis=true,e=i;while(e&&e!==card){const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none')vis=false;e=e.parentElement}if(!vis)return;
  let r=i.getBoundingClientRect(),x0=r.left,y0=r.top,x1=r.right,y1=r.bottom;e=i.parentElement;
  while(e&&e!==card.parentElement){const cs=getComputedStyle(e);if(cs.overflow!=='visible'){const q=e.getBoundingClientRect();x0=Math.max(x0,q.left);y0=Math.max(y0,q.top);x1=Math.min(x1,q.right);y1=Math.min(y1,q.bottom)}e=e.parentElement}
  if(x1-x0>30&&y1-y0>30)out.push([k,x0,y0,x1-x0,y1-y0])});return out})()"""
async def worker(b,q):
  c=await b.new_context(viewport={'width':1400,'height':1000});await c.add_init_script("try{localStorage.setItem('mns-welcome','1')}catch(e){}")
  while q:
    f=q.pop();s=slug(f)
    if os.path.exists(f'{out}/{s}.json'):continue
    pg=await c.new_page()
    try:
      await pg.goto('http://localhost:8795/?film='+quote(f),timeout=40000)
      await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&c.dataset.unclip})()",timeout=30000)
      await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
      el=await pg.query_selector('#preview .mcard');await el.screenshot(path=f'{out}/{s}.jpg',type='jpeg',quality=60)
      fr=await pg.evaluate(JS);keep=[]
      for n,(k,x,y,w,h) in enumerate(fr,1):
        await pg.screenshot(path=f'{out}/{s}__{n}.jpg',clip={'x':x,'y':y,'width':w,'height':h},type='jpeg',quality=70);keep.append(k)
      json.dump(keep,open(f'{out}/{s}.json','w'))
    except Exception as e:print('ERR',f,str(e)[:80],flush=True)
    await pg.close()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    q=fs[:];await asyncio.gather(*[worker(b,q) for _ in range(8)]);await b.close()
asyncio.run(main())
