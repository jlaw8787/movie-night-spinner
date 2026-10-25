"""Renders outside.png and inside.png at 2x, checks edges, fold clearance and min font size,
and prints the trim PDF Manhattan-menu.pdf (two pages, 11 x 8.5 in) with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
FACES = ('outside', 'inside')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('h3,p,span,div').forEach(e=>{
 const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
 if(!t||/^[. ]+$/.test(t))return; m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
 const r=e.getBoundingClientRect();
 if(r.left<40||r.top<40||r.right>1016||r.bottom>776)o.push('EDGE '+t.slice(0,30));
 if(r.left<548&&r.right>508)o.push('FOLD '+t.slice(0,30)+' '+Math.round(r.left)+'-'+Math.round(r.right));
 if(e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!='hidden')o.push('OVERFLOW '+t.slice(0,30));});
 const secs=[...document.querySelectorAll('section')].map(s=>{const r=s.getBoundingClientRect();return Math.round(r.bottom)});
 return {issues:o,minpx:m,sectionBottoms:secs}}"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 1056, 'height': 816}, device_scale_factor=2)).new_page()
        for n in FACES:
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.wait_for_load_state('networkidle'); await pg.wait_for_timeout(800)
            await pg.screenshot(path=f'{D}/{n}.png')
            print(n, await pg.evaluate(CHECK))
        # trim PDF: both faces as pages
        bodies = []
        for n in FACES:
            t = open(f'{D}/{n}.html').read()
            bodies.append(t.split('<body>', 1)[1].rsplit('</body>', 1)[0])
        head = open(f'{D}/outside.html').read().split('<body>')[0]
        head = head.replace('<style>body{margin:0}</style>', '<style>@page{size:11in 8.5in;margin:0}body{margin:0}.pg{page-break-after:always;width:1056px;height:816px;overflow:hidden}.pg:last-child{page-break-after:auto}</style>')
        doc = head + '<body>' + ''.join(f'<div class="pg">{x}</div>' for x in bodies) + '</body></html>'
        open(f'{D}/pdf.html', 'w').write(doc)
        await pg.goto('file://' + D + '/pdf.html'); await pg.wait_for_load_state('networkidle'); await pg.wait_for_timeout(800)
        await pg.pdf(path=f'{D}/Manhattan-menu.pdf', width='11in', height='8.5in', print_background=True, margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'})
        os.remove(f'{D}/pdf.html')
        await b.close()
asyncio.run(main())
