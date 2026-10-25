import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)).new_page()
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.wait_for_timeout(2500)
            await pg.evaluate('document.fonts.ready')
            await pg.screenshot(path=D + '/' + n + '.png')
            r = await pg.evaluate("""()=>{const out=[];document.querySelectorAll('h3,p,span,div').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const r=e.getBoundingClientRect();if(r.left<40||r.right>776||r.bottom>1016||r.top<40)out.push(t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))});return out}""")
            print(n, 'edge:', r)
            fam = await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+f.weight+f.style).join(',')")
            print(' fonts', fam)
        await b.close()
asyncio.run(main())
