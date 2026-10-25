"""Renders a 2x PNG of the card, checks edges and type sizes, and writes the trim PDF with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
FW, FH = 1056, 1344
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>%d||r.bottom>%d)o.push(t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))});return [o,m]}""" % (FW - 40, FH - 40)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': FW, 'height': FH}, device_scale_factor=2, ignore_https_errors=True)
        pg = await ctx.new_page()
        await pg.goto('file://' + D + '/card.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1000)
        fams = await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight+' '+f.style)")
        await pg.screenshot(path=os.path.join(D, 'card.png'))
        bad, mn = await pg.evaluate(CHECK)
        print('edge:', bad, 'min px:', mn, 'fonts:', sorted(set(fams)))
        await pg.pdf(path=os.path.join(D, 'Frequency-menu.pdf'), width='11in', height='14in', print_background=True, page_ranges='1')
        await b.close()
asyncio.run(main())
