"""Usage: python3 wip/genre/lib/posterpct.py "Film (Year)" ...  (local server on 8795)
For each film: screenshot to wip/genre/proofs/_q/<slug>.jpg (welcome card off) and print the poster's share of the front face,
how much of its frame it fills, and any text spilling or cut off."""
import asyncio,os,sys,re
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT='/home/claude/polish/wip/genre/proofs/_q';slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
SW=open('/home/claude/polish/wip/genre/lib/sweep.py').read().split('JS=r"""')[1].split('"""')[0]
JS="""(()=>{const c=document.querySelector('#preview .mcard');const f=c.querySelector('.fx-face');const fr=f.getBoundingClientRect();
const P=[...f.querySelectorAll('img')].filter(i=>getComputedStyle(i).visibility!=='hidden'&&i.naturalHeight/i.naturalWidth>1.3).sort((a,b)=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return y.width*y.height-x.width*x.height})[0];
if(!P)return 'no poster on front face';const r=P.getBoundingClientRect();return 'poster '+Math.round(100*r.width*r.height/(fr.width*fr.height))+'% of front face'})()"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    for f in sys.argv[1:]:
      pg=await b.new_page(viewport={'width':1400,'height':1000});await pg.add_init_script("try{localStorage.setItem('mns-welcome','1')}catch(e){}")
      try:
        await pg.goto('http://localhost:8795/?film='+quote(f),timeout=40000)
        await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&c.dataset.unclip})()",timeout=30000)
        a=await pg.evaluate(JS);s=await pg.evaluate(SW);el=await pg.query_selector('#preview .mcard');out=f'{OUT}/{slug(f)}.jpg';await el.screenshot(path=out,type='jpeg',quality=75)
        print(f,'|',a,'|','text ok' if not s['iss'] else s['iss'][:3],'|',out)
      except Exception as e:print(f,'ERROR',str(e)[:80])
      await pg.close()
    await b.close()
asyncio.run(main())
