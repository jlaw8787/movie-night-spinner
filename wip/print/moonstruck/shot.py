import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)).new_page()
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=D + '/' + n + '.png')
            # text closer than 40px to the trim, and section text running into the next block
            bad = await pg.evaluate("""()=>{const o=[];document.querySelectorAll('h3,p,span,div').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>776||r.bottom>1016)o.push(t.slice(0,30)+' '+Math.round(r.left)+','+Math.round(r.top)+','+Math.round(r.right)+','+Math.round(r.bottom))});return o}""")
            sizes = await pg.evaluate("""()=>{let m=99;document.querySelectorAll('h3,p,span,div').forEach(e=>{const t=[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim());if(t){m=Math.min(m,parseFloat(getComputedStyle(e).fontSize))}});return m}""")
            secs = await pg.evaluate("""()=>[...document.querySelectorAll('section')].map(s=>{const r=s.getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom)]})""")
            print(n, 'edge:', bad[:8], 'min font px:', sizes, 'sections:', secs)
        await b.close()
asyncio.run(main())
