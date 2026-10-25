"""One trim PDF (8 x 8 in, one page: the box lid) made with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'Inside-Man-menu.pdf')
async def main():
    html = open(os.path.join(D, 'lid.html')).read().replace('<style>body{margin:0}</style>', '<style>@page{size:8in 8in;margin:0}body{margin:0}</style>')
    open(os.path.join(D, 'trim.html'), 'w').write(html)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await b.new_page()
        await pg.goto('file://' + D + '/trim.html'); await pg.wait_for_timeout(3000)
        await pg.pdf(path=OUT, width='8in', height='8in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
print('pdf done')
