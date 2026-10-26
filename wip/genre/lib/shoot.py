"""Render a format for films and check spill. Usage: python3 shoot.py <format> "Title (Year)" [...]  (optional env ERA, TONE)
Writes wip/genre/proofs/<format>/<slug>-<n>.png at 2x and prints any text spilling past a face."""
import asyncio,os,sys,re
from urllib.parse import quote
from playwright.async_api import async_playwright
fmt=sys.argv[1];films=sys.argv[2:];R='/home/claude/polish';OUT=f'{R}/wip/genre/proofs/{fmt}';os.makedirs(OUT,exist_ok=True)
SPILL=r"""(()=>{const out=[];document.querySelectorAll('.face').forEach(f=>{const fr=f.getBoundingClientRect();
f.querySelectorAll('*').forEach(e=>{if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;const cs=getComputedStyle(e);
if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;const r=e.getBoundingClientRect();if(!r.width)return;
const o=Math.max(r.bottom-fr.bottom,r.right-fr.right,fr.top-r.top,fr.left-r.left);
const fs=parseFloat(cs.fontSize);if(o>3)out.push('spill '+Math.round(o)+'px: '+e.textContent.trim().slice(0,40));
if(fs<14)out.push('small '+fs+'px: '+e.textContent.trim().slice(0,30))})});return out})()"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    c=await b.new_context(viewport={'width':1500,'height':1200},device_scale_factor=2)
    for film in films:
      extra=''.join(f'&{k.lower()}={quote(os.environ[k])}' for k in ('ERA','TONE') if os.environ.get(k))
      pg=await c.new_page();await pg.goto(f'http://localhost:8795/wip/genre/lib/harness.html?format={fmt}&film={quote(film)}{extra}')
      try: await pg.wait_for_selector('body[data-ready="1"]',timeout=20000)
      except Exception: print('FAILED',film);continue
      await pg.evaluate('document.fonts.ready');await pg.wait_for_timeout(2500)
      s=re.sub(r'[^a-z0-9]+','-',film.lower()).strip('-')
      for i,el in enumerate(await pg.query_selector_all('.face')): await el.screenshot(path=f'{OUT}/{s}-{i}.png')
      iss=await pg.evaluate(SPILL);print(film,'OK' if not iss else '; '.join(iss[:5]))
      await pg.close()
    await b.close()
asyncio.run(main())
