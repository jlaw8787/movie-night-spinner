"""One trim PDF, US Letter, two pages (page 1 and page 2 of the memo), made with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'The-Secret-of-My-Success-menu.pdf')
def part(n, tag):
    t = open(os.path.join(D, n + '.html')).read()
    return t.split(f'<{tag}>')[1].split(f'</{tag}>')[0]
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await b.new_page()
        head = part('front', 'head').split('<style>')[0]
        html = ('<!doctype html><html><head>' + head + '<style>@page{size:8.5in 11in;margin:0}body{margin:0}.pg{width:816px;height:1056px;overflow:hidden;break-after:page}</style></head><body>'
                + ''.join('<div class="pg">' + part(n, 'body') + '</div>' for n in ('front', 'back')) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.wait_for_timeout(3000)
        await pg.pdf(path=OUT, width='8.5in', height='11in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
print('pdf done')
