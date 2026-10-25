"""Renders front and back at 2x, checks the 40px safe margin and smallest font, prints the trim PDF (10 x 7 in)."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(D, 'Escape-from-New-York-menu.pdf')
FW, FH = 960, 672
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
        bodies = []
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(800)
            await pg.screenshot(path=os.path.join(D, n + '.png'))
            print(n, await pg.evaluate(CHECK))
            bodies.append(open(os.path.join(D, n + '.body.html')).read())
        head = open(os.path.join(D, 'front.html')).read().split('<head>')[1].split('</head>')[0]
        html = ('<!doctype html><html><head>' + head + '<style>@page{size:10in 7in;margin:0}body{background:none}.pg{width:960px;height:672px;overflow:hidden;break-after:page}</style></head><body>'
                + ''.join('<div class="pg">' + x + '</div>' for x in bodies) + '</body></html>')
        open(os.path.join(D, 'trim.html'), 'w').write(html)
        await pg.goto('file://' + D + '/trim.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1500)
        await pg.pdf(path=PDF, width='10in', height='7in', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
