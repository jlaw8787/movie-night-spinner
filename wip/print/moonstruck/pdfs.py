"""Trim PDF (US Letter, 2 pages: front, back) and printer PDF (3mm bleed, crop marks, TrimBox and BleedBox)."""
import asyncio, os
from playwright.async_api import async_playwright
import pikepdf
D = os.path.dirname(os.path.abspath(__file__))
B = 11.34; M = 22.68            # 3mm bleed, 6mm slug for the marks
TW, TH = 816, 1056
TRIM_PDF = os.path.join(D, 'Moonstruck-menu.pdf')
BLEED_PDF = os.path.join(D, 'Moonstruck-menu-print-bleed.pdf')
def body(n): return open(os.path.join(D, n + '.html')).read().split('<body>')[1].split('</body>')[0]
def bleed_page(n):
    o = M + B; W = TW + 2 * o; H = TH + 2 * o
    def ln(x, y, w, h): return f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:#000"></div>'
    s = f'<div style="position:absolute;left:{M}px;top:{M}px">' + open(os.path.join(D, n + '.bleed.html')).read() + '</div>'
    for x in (o, o + TW): s += ln(x - 0.25, 0, 0.5, M - 3) + ln(x - 0.25, H - M + 3, 0.5, M - 3)
    for y in (o, o + TH): s += ln(0, y - 0.25, M - 3, 0.5) + ln(W - M + 3, y - 0.25, M - 3, 0.5)
    return W, H, f'<div class="pg" style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:#fff">{s}</div>'
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await b.new_page()
        head = '<meta charset="utf-8"><link rel="stylesheet" href="fonts/fonts.css">'
        html = ('<!doctype html><html><head>' + head + '<style>@page{size:8.5in 11in;margin:0}body{margin:0}.pg{width:816px;height:1056px;overflow:hidden;break-after:page}</style></head><body>'
                + ''.join('<div class="pg">' + body(n) + '</div>' for n in ('front', 'back')) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.wait_for_timeout(2500)
        await pg.pdf(path=TRIM_PDF, width='8.5in', height='11in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        pages = [bleed_page(n) for n in ('front', 'back')]; W, H = pages[0][0], pages[0][1]
        win, hin = W / 96, H / 96
        html = ('<!doctype html><html><head>' + head + f'<style>@page{{size:{win:.4f}in {hin:.4f}in;margin:0}}body{{margin:0}}.pg{{break-after:page}}</style></head><body>'
                + ''.join(x[2] for x in pages) + '</body></html>')
        open(os.path.join(D, 'bleed.html'), 'w').write(html)
        await pg.goto('file://' + D + '/bleed.html'); await pg.wait_for_timeout(2500)
        await pg.pdf(path=BLEED_PDF, width=f'{win:.4f}in', height=f'{hin:.4f}in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
o = (M + B) * 0.75; bb = B * 0.75
with pikepdf.open(BLEED_PDF, allow_overwriting_input=True) as pdf:
    for p in pdf.pages:
        p.TrimBox = pikepdf.Array([o, o, o + 612, o + 792])
        p.BleedBox = pikepdf.Array([o - bb, o - bb, o + 612 + bb, o + 792 + bb])
    pdf.save(BLEED_PDF)
with pikepdf.open(TRIM_PDF, allow_overwriting_input=True) as pdf:
    for p in pdf.pages:
        p.MediaBox = pikepdf.Array([0, 0, 612, 792]); p.TrimBox = pikepdf.Array([0, 0, 612, 792])
    pdf.save(TRIM_PDF)
print('pdfs done')
