"""Clean screenshots of named library menus: python3 wip/genre/lib/shotlist.py OUTDIR "Film (Year)" ..."""
import asyncio,os,re,sys
from urllib.parse import quote
from playwright.async_api import async_playwright
out=sys.argv[1];fs=sys.argv[2:];os.makedirs(out,exist_ok=True)
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    c=await b.new_context(viewport={'width':1400,'height':1000});await c.add_init_script("try{localStorage.setItem('mns-welcome','1')}catch(e){}")
    for f in fs:
      pg=await c.new_page()
      try:
        await pg.goto('http://localhost:8795/?film='+quote(f),timeout=40000)
        await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&c.dataset.unclip})()",timeout=30000)
        await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
        el=await pg.query_selector('#preview .mcard');await el.screenshot(path=f'{out}/{slug(f)}.jpg',type='jpeg',quality=70)
      except Exception as e:print('ERR',f,str(e)[:80])
      await pg.close()
    await b.close()
asyncio.run(main())
