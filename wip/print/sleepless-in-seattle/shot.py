"""Renders placemat.png at 2x, checks edges and font sizes, and writes the trim PDF with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 960
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2)).new_page()
        await pg.goto('file://' + D + '/placemat.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=D + '/placemat.png')
        bad = await pg.evaluate(f"""()=>{{const o=[];document.querySelectorAll('h3,p,span,div').forEach(e=>{{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>{W-40}||r.bottom>{H-40})o.push(t.slice(0,30)+' '+Math.round(r.left)+','+Math.round(r.top)+','+Math.round(r.right)+','+Math.round(r.bottom))}});return o}}""")
        size = await pg.evaluate("""()=>{let m=99;document.querySelectorAll('h3,p,span,div').forEach(e=>{if([...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim()))m=Math.min(m,parseFloat(getComputedStyle(e).fontSize))});return m}""")
        secs = await pg.evaluate("""()=>[...document.querySelectorAll('section')].map(s=>{const r=s.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.bottom)]})""")
        fam = await pg.evaluate("""()=>document.fonts.check('22px Jost')+' '+document.fonts.check('40px Yellowtail')""")
        print('edge:', bad, 'min font px:', size, 'sections:', secs, 'fonts:', fam)
        await pg.pdf(path=D + '/Sleepless-in-Seattle-menu.pdf', width='14in', height='10in', print_background=True,
                     margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
