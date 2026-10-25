"""Renders the placemat at 2x, checks the 40px safe margin and smallest font, prints the trim PDF (14 x 10 in) with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
FW, FH = 1344, 960
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span').forEach(e=>{
 const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim());if(!t.length)return;
 m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
 const rg=document.createRange();t.forEach(n=>{rg.selectNodeContents(n);for(const r of rg.getClientRects()){
  if(r.left<40||r.top<40||r.right>%d||r.bottom>%d)o.push(n.textContent.trim().slice(0,24)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))}})});
 return {edge:o,min:m}}""" % (FW - 40, FH - 40)


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': FW, 'height': FH}, device_scale_factor=2)).new_page()
        await pg.goto('file://' + D + '/placemat.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1000)
        print(await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight)"))
        await pg.screenshot(path=os.path.join(D, 'placemat.png'))
        print(await pg.evaluate(CHECK))
        await pg.emulate_media(media='print')
        await pg.add_style_tag(content='@page{size:14in 10in;margin:0}')
        await pg.pdf(path=os.path.join(D, 'Die-Hard-with-a-Vengeance-menu.pdf'), width='14in', height='10in', print_background=True,
                     margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'}, page_ranges='1')
        await b.close()
asyncio.run(main())
print('done')
