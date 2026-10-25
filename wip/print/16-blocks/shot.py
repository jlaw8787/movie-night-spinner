"""Renders board.png at 2x, checks edges and type sizes, and writes the trim PDF with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 816
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));const r=e.getBoundingClientRect();if(r.left<24||r.top<24||r.right>1320||r.bottom>792)o.push(t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))});return [o,m]}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, ignore_https_errors=True)
        pg = await ctx.new_page()
        await pg.goto('file://' + D + '/board.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1000)
        fams = await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight)")
        await pg.screenshot(path=os.path.join(D, 'board.png'))
        bad, mn = await pg.evaluate(CHECK)
        print('edge:', bad, 'min px:', mn, 'fonts:', sorted(set(fams)))
        html = open(os.path.join(D, 'board.html')).read().replace('body{margin:0}', '@page{size:14in 8.5in;margin:0}body{margin:0}')
        tmp = os.path.join(D, '_pdf.html'); open(tmp, 'w').write(html)
        await pg.goto('file://' + tmp); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1000)
        await pg.pdf(path=os.path.join(D, '16-Blocks-menu.pdf'), width='14in', height='8.5in', print_background=True, prefer_css_page_size=True)
        os.remove(tmp)
        await b.close()
asyncio.run(main())
