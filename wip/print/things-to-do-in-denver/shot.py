"""Renders the two square card faces at 2x, checks the 40px safe margin and smallest font, prints the trim PDF (10 x 10 in)."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(D, 'Things-to-Do-in-Denver-menu.pdf')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span,b').forEach(e=>{
 const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim());if(!t.length)return;
 m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
 const rg=document.createRange();t.forEach(n=>{rg.selectNodeContents(n);for(const r of rg.getClientRects()){
  if(r.left<40||r.top<40||r.right>776||r.bottom>776)o.push(n.textContent.trim().slice(0,24)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))}})});
 return {edge:o,min:m}}"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 816}, device_scale_factor=2)).new_page()
        pdfs = []
        for f in ('front', 'back'):
            await pg.goto('file://' + D + '/' + f + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1000)
            await pg.screenshot(path=os.path.join(D, f + '.png'))
            print(f, await pg.evaluate(CHECK))
            pdfs.append(os.path.join(D, '_' + f + '.pdf'))
            await pg.pdf(path=pdfs[-1], width='8.5in', height='8.5in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
    from pypdf import PdfWriter
    w = PdfWriter()
    for f in pdfs: w.append(f)
    w.write(PDF)
    for f in pdfs: os.remove(f)
asyncio.run(main())
print('done')
