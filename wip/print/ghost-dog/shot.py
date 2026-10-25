"""Renders 2x PNGs of each face, checks edges, overflow and type sizes, and writes the trim PDF with Chromium."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
FACES = ('outside', 'inside')
FW, FH = 1344, 816
CHECK = """()=>{const o=[];let m=99;const root=document.body.firstElementChild;
document.querySelectorAll('div,span,b').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t||/^[ .]+$/.test(t))return;m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));const r=e.getBoundingClientRect();if(r.left<40||r.top<40||r.right>%d||r.bottom>%d)o.push('EDGE '+t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round));
for(const f of [448,896]){if(r.left<f+20&&r.right>f-20&&r.width<300)o.push('FOLD '+t.slice(0,30)+' '+[r.left,r.right].map(Math.round))}});
[...root.children].filter(e=>e.tagName=='DIV'&&e.style.height&&e.style.width=='360px').forEach((e,i)=>{let mb=0;e.querySelectorAll('*').forEach(c=>{mb=Math.max(mb,c.getBoundingClientRect().bottom)});o.push('PANEL '+i+' content bottom '+Math.round(mb)+' / box '+Math.round(e.getBoundingClientRect().bottom))});
return [o,m]}""" % (FW - 40, FH - 40)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': FW, 'height': FH}, device_scale_factor=2, ignore_https_errors=True)
        pg = await ctx.new_page()
        for n in FACES:
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1200)
            fams = await pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family+' '+f.weight+' '+f.style)")
            await pg.screenshot(path=os.path.join(D, n + '.png'))
            bad, mn = await pg.evaluate(CHECK)
            print(n, 'min px:', mn, 'fonts:', sorted(set(fams)))
            for x in bad: print('  ', x)
        bodies = [open(os.path.join(D, n + '.body.html')).read() for n in FACES]
        html = open(os.path.join(D, 'outside.html')).read().split('<body>')[0].replace('body{margin:0}', '@page{size:14in 8.5in;margin:0}body{margin:0}.pg{page-break-after:always}')
        html += '<body>' + ''.join(f'<div class="pg">{x}</div>' for x in bodies) + '</body></html>'
        tmp = os.path.join(D, '_pdf.html'); open(tmp, 'w').write(html)
        await pg.goto('file://' + tmp); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(1200)
        await pg.pdf(path=os.path.join(D, 'Ghost-Dog-menu.pdf'), width='14in', height='8.5in', print_background=True, prefer_css_page_size=True)
        os.remove(tmp)
        await b.close()
asyncio.run(main())
