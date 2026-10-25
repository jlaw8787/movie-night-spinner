"""Renders window.png at 2x, checks edges and type sizes, writes the trim PDF (8.5 x 14 in) with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1344
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span,b').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));const r=e.getBoundingClientRect();if(r.left<40&&r.left>-1&&e.closest('[style*="width: 316px"]')==null||r.top<40||r.right>776||r.bottom>1306)o.push(t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))});return [o,m]}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, ignore_https_errors=True)
        pg = await ctx.new_page()
        await pg.goto('file://' + D + '/window.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(900)
        fams = await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight)")
        await pg.screenshot(path=os.path.join(D, 'window.png'))
        bad, mn = await pg.evaluate(CHECK)
        print('edge:', bad, 'min px:', mn, 'fonts:', sorted(set(fams)))
        html = open(os.path.join(D, 'window.html')).read().replace('body{margin:0}', '@page{size:8.5in 14in;margin:0}body{margin:0}')
        tmp = os.path.join(D, '_pdf.html'); open(tmp, 'w').write(html)
        await pg.goto('file://' + tmp); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(900)
        await pg.pdf(path=os.path.join(D, 'Premium-Rush-menu.pdf'), width='8.5in', height='14in', print_background=True, prefer_css_page_size=True)
        os.remove(tmp); await b.close()
asyncio.run(main())
