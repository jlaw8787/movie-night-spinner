"""Renders the square truck lid at 2x, checks the 40px safe margin and smallest font, prints the trim PDF (10 x 10 in)."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(D, 'TMNT-II-menu.pdf')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span,b').forEach(e=>{
 const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim());if(!t.length)return;
 m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
 const rg=document.createRange();t.forEach(n=>{rg.selectNodeContents(n);for(const r of rg.getClientRects()){
  if(r.left<40||r.top<40||r.right>920||r.bottom>920)o.push(n.textContent.trim().slice(0,24)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))}})});
 return {edge:o,min:m}}"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 960, 'height': 960}, device_scale_factor=2)).new_page()
        await pg.goto('file://' + D + '/lid.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1000)
        await pg.screenshot(path=os.path.join(D, 'lid.png'))
        print(await pg.evaluate(CHECK)); print(await pg.evaluate('''()=>[...document.querySelectorAll('body>div>div')].filter(e=>e.offsetHeight>200).map(e=>[e.style.left,e.style.top,e.offsetHeight])'''))
        await pg.pdf(path=PDF, width='10in', height='10in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
print('done')
