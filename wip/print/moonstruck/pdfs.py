"""Trim PDF: 11 x 8.5 in, two pages (outside spread, inside spread), printed duplex and folded once."""
import asyncio, os
from playwright.async_api import async_playwright
import pikepdf
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'Moonstruck-menu.pdf')

def body(n):
    return open(os.path.join(D, n + '.html')).read().split('<body>')[1].split('</body>')[0]

async def main():
    head = open(os.path.join(D, 'outside.html')).read().split('<head>')[1].split('<style>')[0]
    html = ('<!doctype html><html><head>' + head + '<style>@page{size:11in 8.5in;margin:0}body{margin:0}'
            '.pg{width:1056px;height:816px;overflow:hidden;break-after:page}</style></head><body>'
            + ''.join('<div class="pg">' + body(n) + '</div>' for n in ('outside', 'inside')) + '</body></html>')
    open(os.path.join(D, 'trim.html'), 'w').write(html)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await b.new_page()
        await pg.goto('file://' + D + '/trim.html', wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.pdf(path=OUT, width='11in', height='8.5in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
    os.remove(os.path.join(D, 'trim.html'))
    with pikepdf.open(OUT, allow_overwriting_input=True) as pdf:
        for p in pdf.pages:
            p.MediaBox = pikepdf.Array([0, 0, 792, 612]); p.TrimBox = pikepdf.Array([0, 0, 792, 612])
        pdf.save(OUT)
    print('pdf done')

asyncio.run(main())
