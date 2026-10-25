"""Renders each face at 2x, checks the 40px safe margin and the smallest font, then prints the
trim PDF (US Legal, one face) with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(D, 'Taking-of-Pelham-One-Two-Three-menu.pdf')
CHECK = """()=>{const o=[];let m=99;document.querySelectorAll('div,span,header,section,aside').forEach(e=>{
 const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim());if(!t.length)return;
 m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
 const rg=document.createRange();t.forEach(n=>{rg.selectNodeContents(n);for(const r of rg.getClientRects()){
  if(r.left<40||r.top<40||r.right>776||r.bottom>1304)o.push(n.textContent.trim().slice(0,24)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round))}})});
 return {edge:o,min:m}}"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 816, 'height': 1344}, device_scale_factor=2)).new_page()
        bodies = []
        for n in ('sheet',):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(800)
            print(n, await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight+' '+f.style).join(' | ')"))
            await pg.screenshot(path=os.path.join(D, n + '.png'))
            print(n, await pg.evaluate(CHECK))
            bodies.append(await pg.evaluate('document.body.innerHTML'))
        head = open(os.path.join(D, 'sheet.html')).read().split('<head>')[1].split('</head>')[0]
        html = ('<!doctype html><html><head>' + head + '<style>@page{size:8.5in 14in;margin:0}body{margin:0}.pg{width:816px;height:1344px;overflow:hidden;break-after:page}</style></head><body>'
                + ''.join('<div class="pg">' + x + '</div>' for x in bodies) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1500)
        await pg.pdf(path=PDF, width='8.5in', height='14in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
print('done')
