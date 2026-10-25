"""Renders 2x PNGs of each face, checks edges and type sizes, and writes the trim PDF with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
FACES = ('front', 'back')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>488||r.bottom>776)o.push(t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))});return [o,m]}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': 528, 'height': 816}, device_scale_factor=2, ignore_https_errors=True)
        pg = await ctx.new_page()
        for n in FACES:
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(800)
            fams = await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight+' '+f.style)")
            await pg.screenshot(path=os.path.join(D, n + '.png'))
            bad, mn = await pg.evaluate(CHECK)
            print(n, 'edge:', bad, 'min px:', mn, 'fonts:', sorted(set(fams)))
        bodies = [open(os.path.join(D, n + '.body.html')).read() for n in FACES]
        html = open(os.path.join(D, 'front.html')).read().split('<body>')[0].replace('body{margin:0}', '@page{size:5.5in 8.5in;margin:0}body{margin:0}.pg{page-break-after:always}')
        html += '<body>' + ''.join(f'<div class="pg">{x}</div>' for x in bodies) + '</body></html>'
        tmp = os.path.join(D, '_pdf.html'); open(tmp, 'w').write(html)
        await pg.goto('file://' + tmp); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(800)
        await pg.pdf(path=os.path.join(D, 'Dog-Day-Afternoon-menu.pdf'), width='5.5in', height='8.5in', print_background=True, prefer_css_page_size=True)
        os.remove(tmp)
        await b.close()
asyncio.run(main())
