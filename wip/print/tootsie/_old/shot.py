"""Renders front.png and back.png at 2x and reports text that runs outside its section or under 40px from the trim."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)).new_page()
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=D + '/' + n + '.png')
            bad = await pg.evaluate("""()=>{const out=[];document.querySelectorAll('body *').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>776||r.bottom>1016)out.push(t.slice(0,30)+' '+Math.round(r.left)+','+Math.round(r.top)+','+Math.round(r.right)+','+Math.round(r.bottom))});
              const s=document.querySelector('section');out.push('section bottom content '+Math.round(Math.max(...[...s.children].map(c=>c.getBoundingClientRect().bottom))));return out}""")
            print(n, bad)
        await b.close()
asyncio.run(main())
