"""Clean screenshots of every library menu (welcome card suppressed) for visual review. Writes wip/genre/proofs/_q/<slug>.jpg"""
import asyncio,os,json,re
from urllib.parse import quote
from playwright.async_api import async_playwright
R='/home/claude/polish';OUT=f'{R}/wip/genre/proofs/_q'
A=json.load(open(f'{R}/data/film-format.json'));films=json.load(open(os.environ['ONLY'])) if os.environ.get('ONLY') else sorted(A)
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
async def worker(b,q):
  c=await b.new_context(viewport={'width':1400,'height':1000})
  await c.add_init_script("try{localStorage.setItem('mns-welcome','1')}catch(e){}")
  while q:
    f=q.pop();p=f'{OUT}/{slug(f)}.jpg'
    if os.path.exists(p):continue
    pg=await c.new_page()
    try:
      await pg.goto('http://localhost:8795/?film='+quote(f),timeout=40000)
      await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&c.dataset.unclip})()",timeout=30000)
      await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
      el=await pg.query_selector('#preview .mcard');await el.screenshot(path=p,type='jpeg',quality=70)
    except Exception as e:print('ERR',f,str(e)[:60],flush=True)
    await pg.close()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    q=films[:];await asyncio.gather(*[worker(b,q) for _ in range(10)]);await b.close()
asyncio.run(main())
