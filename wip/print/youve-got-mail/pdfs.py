"""Trim PDF and printer PDF (3 mm bleed, crop marks, TrimBox and BleedBox) for the
Fox & Sons Books cafe card. 5.5 x 8.5 in (US half letter), two sided, flat, no folds."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
TW, TH = 528, 816         # trim in CSS px
B = 11.34                 # 3 mm bleed in px
M = 22.68                 # 6 mm slug for crop marks
FACES = ('front', 'back')
TRIM = os.path.join(D, "You've-Got-Mail-menu.pdf")
BLEED = os.path.join(D, "You've-Got-Mail-menu-print-bleed.pdf")

def body(n): return open(os.path.join(D, n + '.html')).read().split('<body>')[1].split('</body>')[0]

def bleed_page(n):
    o = M + B; W = TW + 2 * o; H = TH + 2 * o
    s = f'<div style="position:absolute;left:{M}px;top:{M}px;width:{TW+2*B}px;height:{TH+2*B}px;background:#f5efe1"></div>'
    s += f'<img src="assets/grain-{n}.png" alt="" style="position:absolute;left:{M}px;top:{M}px;width:{TW+2*B}px;height:{TH+2*B}px">'
    if n == 'back':   # the ring runs off the top edge, so carry it into the bleed
        s += f'<div style="position:absolute;left:{M}px;top:{M}px;width:{TW+2*B}px;height:{TH+2*B}px;overflow:hidden"><img src="assets/coffee-ring.png" alt="" style="position:absolute;left:{330+B}px;top:{-108+B}px;width:240px;height:240px"></div>'
    s += f'<div style="position:absolute;left:{o}px;top:{o}px;width:{TW}px;height:{TH}px;overflow:hidden">{body(n)}</div>'
    def ln(x, y, w, h): return f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:#000"></div>'
    for x in (o, o + TW): s += ln(x - 0.25, 0, 0.5, M - 3) + ln(x - 0.25, H - M + 3, 0.5, M - 3)
    for y in (o, o + TH): s += ln(0, y - 0.25, M - 3, 0.5) + ln(W - M + 3, y - 0.25, M - 3, 0.5)
    return W, H, f'<div class="pg" style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:#fff">{s}</div>'

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await b.new_page()
        head = open(os.path.join(D, 'front.html')).read().split('<head>')[1].split('</head>')[0]
        html = ('<!doctype html><html><head>' + head + '<style>@page{size:5.5in 8.5in;margin:0}body{margin:0}.pg{width:528px;height:816px;overflow:hidden;break-after:page}</style></head><body>'
                + ''.join('<div class="pg">' + body(n) + '</div>' for n in FACES) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.wait_for_timeout(2500)
        await pg.pdf(path=TRIM, width='5.5in', height='8.5in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        pages = [bleed_page(n) for n in FACES]; W, H = pages[0][0], pages[0][1]
        win, hin = W / 96, H / 96
        html = ('<!doctype html><html><head>' + head + f'<style>@page{{size:{win:.4f}in {hin:.4f}in;margin:0}}body{{margin:0}}.pg{{break-after:page}}</style></head><body>'
                + ''.join(x[2] for x in pages) + '</body></html>')
        open(os.path.join(D, 'bleed.html'), 'w').write(html)
        await pg.goto('file://' + D + '/bleed.html'); await pg.wait_for_timeout(2500)
        await pg.pdf(path=BLEED, width=f'{win:.4f}in', height=f'{hin:.4f}in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())

import pikepdf
tw, th = 396.0, 612.0                     # 5.5 x 8.5 in in points
o = (M + B) * 0.75; bb = B * 0.75
with pikepdf.open(BLEED, allow_overwriting_input=True) as pdf:
    for p in pdf.pages:
        p.TrimBox = pikepdf.Array([o, o, o + tw, o + th])
        p.BleedBox = pikepdf.Array([o - bb, o - bb, o + tw + bb, o + th + bb])
    pdf.save(BLEED)
with pikepdf.open(TRIM, allow_overwriting_input=True) as pdf:
    for p in pdf.pages:
        p.MediaBox = pikepdf.Array([0, 0, tw, th]); p.TrimBox = pikepdf.Array([0, 0, tw, th])
    pdf.save(TRIM)
print('pdfs done')
