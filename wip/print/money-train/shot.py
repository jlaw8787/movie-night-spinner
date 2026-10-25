"""Renders front and back at 2x, checks the 40px safe margin and smallest font, prints the trim PDF (US Letter)."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(D, 'Money-Train-menu.pdf')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span').forEach(e=>{
 const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim());if(!t.length)return;
 m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
 const rg=document.createRange();t.forEach(n=>{rg.selectNodeContents(n);for(const r of rg.getClientRects()){
  if(r.left<40||r.top<40||r.right>776||r.bottom>1016)o.push(n.textContent.trim().slice(0,24)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))}})});
 return {edge:o,min:m}}"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)).new_page()
        bodies = []
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(800)
            await pg.screenshot(path=os.path.join(D, n + '.png'))
            print(n, await pg.evaluate(CHECK))
            bodies.append(await pg.evaluate('document.body.innerHTML'))
        head = open(os.path.join(D, 'front.html')).read().split('<head>')[1].split('</head>')[0]
        html = ('<!doctype html><html><head>' + head + '<style>@page{size:8.5in 11in;margin:0}.pg{width:816px;height:1056px;overflow:hidden;break-after:page}</style></head><body>'
                + ''.join('<div class="pg">' + x + '</div>' for x in bodies) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1500)
        await pg.pdf(path=PDF, width='8.5in', height='11in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
print('done')
