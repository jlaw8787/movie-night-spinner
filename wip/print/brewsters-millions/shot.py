"""Renders front.png and back.png at 2x and reports any text sitting too close to the trim."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)).new_page()
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.wait_for_timeout(3000)
            await pg.screenshot(path=D + '/' + n + '.png')
            bad = await pg.evaluate("""()=>{const o=[];document.querySelectorAll('body *').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>776||r.bottom>1016)o.push(t.slice(0,30));const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<12)o.push('small '+fs+' '+t.slice(0,20))});return o}""")
            sec = await pg.evaluate("""()=>{const s=document.querySelector('section');return s.scrollHeight+' of '+s.clientHeight}""")
            print(n, 'issues:', bad, 'section fill:', sec)
        await b.close()
asyncio.run(main())
