"""Renders front.png and back.png at 2x, reports text inside 40 px of the trim and the smallest
font size, then writes the trim PDF (US Legal, two pages) with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PDF = os.path.join(D, 'Trading-Places-menu.pdf')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('h1,h3,p,span,div').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>%d||r.bottom>%d)o.push(t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))});return [o,m]}""" % (W - 40, H - 40)

CREASE = """()=>{const o=[];document.querySelectorAll('div,h1,span,b').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const cs=getComputedStyle(e);const big=parseFloat(cs.fontSize)>=20||cs.letterSpacing!='normal';if(!big)return;const r=e.getBoundingClientRect();for(const y of [352,704]){if(r.top<y+3&&r.bottom>y-3)o.push(t.slice(0,25)+' '+Math.round(r.top)+'-'+Math.round(r.bottom))}});return o}"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2)).new_page()
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=D + '/' + n + '.png')
            print(n, await pg.evaluate(CHECK))
            print(' crease', await pg.evaluate(CREASE))
        bodies = [open(os.path.join(D, n + '.body.html')).read() for n in ('front', 'back')]
        head = open(os.path.join(D, 'front.html')).read().split('<head>')[1].split('</head>')[0]
        html = ('<!doctype html><html><head>' + head.replace('<style>', '<style>@page{size:8.5in 11in;margin:0}.pg{width:816px;height:1056px;overflow:hidden;break-after:page}')
                + '</head><body>' + ''.join('<div class="pg">' + x + '</div>' for x in bodies) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1500)
        await pg.pdf(path=PDF, width='8.5in', height='11in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
print('done')
