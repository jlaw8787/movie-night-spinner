import asyncio, os
from playwright.async_api import async_playwright
import pikepdf
D = os.path.dirname(os.path.abspath(__file__))
PW, PH = 816, 1056          # US Letter, 8.5 x 11 in at 96 dpi
B = 11.34                   # 3 mm bleed in px
M = 22.68                   # 6 mm slug for crop marks
NAME = 'C.H.U.D.-menu'
src = open(os.path.join(D, 'notice.html')).read()
head = src.split('<head>')[1].split('</head>')[0]
body = src.split('<body>')[1].split('</body>')[0]

def bleed_page():
    o = M + B; W = PW + 2 * o; H = PH + 2 * o; s = ''
    # the same painted paper (it already carries 12 px of bleed) and wear layer, laid under and over the trimmed sheet
    s += f'<img src="assets/paper.png" alt="" style="position:absolute;left:{o-12}px;top:{o-12}px;width:840px;height:1080px">'
    s += f'<div style="position:absolute;left:{o}px;top:{o}px;width:{PW}px;height:{PH}px;overflow:hidden">{body}</div>'
    s += f'<img src="assets/wear.png" alt="" style="position:absolute;left:{o-12}px;top:{o-12}px;width:840px;height:1080px">'
    s += f'<div style="position:absolute;left:0;top:0;width:{W}px;height:{M}px;background:#fff"></div><div style="position:absolute;left:0;top:{H-M}px;width:{W}px;height:{M}px;background:#fff"></div>'
    s += f'<div style="position:absolute;left:0;top:0;width:{M}px;height:{H}px;background:#fff"></div><div style="position:absolute;left:{W-M}px;top:0;width:{M}px;height:{H}px;background:#fff"></div>'
    def ln(x, y, w, h): return f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:#000"></div>'
    for x in (o, o + PW): s += ln(x - 0.25, 0, 0.5, M - 3) + ln(x - 0.25, H - M + 3, 0.5, M - 3)
    for y in (o, o + PH): s += ln(0, y - 0.25, M - 3, 0.5) + ln(W - M + 3, y - 0.25, M - 3, 0.5)
    return W, H, f'<div class="pg" style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:#fff">{s}</div>'

async def main():
  async with async_playwright() as pw:
    b = await pw.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
    pg = await b.new_page()
    html = '<!doctype html><html><head>' + head + '<style>@page{size:8.5in 11in;margin:0}body{margin:0}</style></head><body>' + body + '</body></html>'
    open(os.path.join(D, 'trim.html'), 'w').write(html)
    await pg.goto('file://' + D + '/trim.html'); await pg.wait_for_timeout(2500)
    await pg.pdf(path=os.path.join(D, NAME + '.pdf'), width='8.5in', height='11in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
    W, H, page = bleed_page()
    win, hin = W / 96, H / 96
    html = '<!doctype html><html><head>' + head + f'<style>@page{{size:{win:.4f}in {hin:.4f}in;margin:0}}body{{margin:0}}</style></head><body>' + page + '</body></html>'
    open(os.path.join(D, 'bleed.html'), 'w').write(html)
    await pg.goto('file://' + D + '/bleed.html'); await pg.wait_for_timeout(2500)
    await pg.pdf(path=os.path.join(D, NAME + '-print-bleed.pdf'), width=f'{win:.4f}in', height=f'{hin:.4f}in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
    await b.close()
asyncio.run(main())

o = (M + B) * 0.75; bb = B * 0.75; tw, th = 612.0, 792.0
with pikepdf.open(os.path.join(D, NAME + '-print-bleed.pdf'), allow_overwriting_input=True) as pdf:
    assert len(pdf.pages) == 1, len(pdf.pages)
    for p in pdf.pages:
        p.TrimBox = pikepdf.Array([o, o, o + tw, o + th])
        p.BleedBox = pikepdf.Array([o - bb, o - bb, o + tw + bb, o + th + bb])
    pdf.save(os.path.join(D, NAME + '-print-bleed.pdf'))
with pikepdf.open(os.path.join(D, NAME + '.pdf'), allow_overwriting_input=True) as pdf:
    assert len(pdf.pages) == 1, len(pdf.pages)
    for p in pdf.pages:
        p.MediaBox = pikepdf.Array([0, 0, tw, th]); p.TrimBox = pikepdf.Array([0, 0, tw, th])
    pdf.save(os.path.join(D, NAME + '.pdf'))
print('pdfs written')
