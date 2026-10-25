import asyncio,os
from playwright.async_api import async_playwright
D=os.path.dirname(os.path.abspath(__file__))
B=11.34   # 3mm bleed in px
M=22.68   # 6mm slug for crop marks
FACES={'outside':[(0,371,'#f3ecd8'),(371,747,'#0f2c21'),(747,1123,'#133a2a')],'inside':[(0,376,'#f3ecd8'),(376,1123,'#e9dfc2')]}
def body(n): return open(os.path.join(D,n+'.html')).read().split('<body>')[1].split('</body>')[0]
def bleed_page(n):
    o=M+B; W=1123+2*o; H=794+2*o; s=''
    p=FACES[n]
    # side bleeds
    s+=f'<div style="position:absolute;left:{M}px;top:{M}px;width:{B+1}px;height:{794+2*B}px;background:{p[0][2]}"></div>'
    s+=f'<div style="position:absolute;left:{o+1123-1}px;top:{M}px;width:{B+1}px;height:{794+2*B}px;background:{p[-1][2]}"></div>'
    # bottom bleed per panel
    for x0,x1,c in p: s+=f'<div style="position:absolute;left:{o+x0-(B if x0==0 else 0)}px;top:{o+793}px;width:{x1-x0+(B if x0==0 else 0)+(B if x1==1123 else 0)}px;height:{B+1}px;background:{c}"></div>'
    # top bleed carries the gold livery stripe
    s+=f'<div style="position:absolute;left:{M}px;top:{M}px;width:{1123+2*B}px;height:{B+1}px;background:#f2b21b"></div>'
    s+=f'<div style="position:absolute;left:{o}px;top:{o}px;width:1123px;height:794px;overflow:hidden">{body(n)}</div>'
    # crop marks at the trim corners and fold marks
    k='#000'
    for x in (o,o+1123):
        s+=f'<div style="position:absolute;left:{x-0.25}px;top:0;width:0.5px;height:{M-3}px;background:{k}"></div><div style="position:absolute;left:{x-0.25}px;top:{H-M+3}px;width:0.5px;height:{M-3}px;background:{k}"></div>'
    for y in (o,o+794):
        s+=f'<div style="position:absolute;top:{y-0.25}px;left:0;height:0.5px;width:{M-3}px;background:{k}"></div><div style="position:absolute;top:{y-0.25}px;left:{W-M+3}px;height:0.5px;width:{M-3}px;background:{k}"></div>'
    for x0,_,_ in p[1:]:
        s+=f'<div style="position:absolute;left:{o+x0-0.25}px;top:0;width:0.5px;height:{M-3}px;background:repeating-linear-gradient(180deg,#000 0 3px,transparent 3px 5px)"></div>'
        s+=f'<div style="position:absolute;left:{o+x0-0.25}px;top:{H-M+3}px;width:0.5px;height:{M-3}px;background:repeating-linear-gradient(180deg,#000 0 3px,transparent 3px 5px)"></div>'
    return W,H,f'<div class="pg" style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:#fff">{s}</div>'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(proxy={'server':os.environ['HTTPS_PROXY'],'bypass':'localhost,127.0.0.1'})
    pg=await b.new_page()
    head=open(os.path.join(D,'outside.html')).read().split('<head>')[1].split('</head>')[0]
    # trim PDF
    html='<!doctype html><html><head>'+head+'<style>@page{size:297mm 210mm;margin:0}body{margin:0}.pg{width:1123px;height:794px;overflow:hidden;break-after:page}</style></head><body>'+''.join('<div class="pg">'+body(n)+'</div>' for n in ('outside','inside'))+'</body></html>'
    open(os.path.join(D,'trim.html'),'w').write(html)
    await pg.goto('file://'+D+'/trim.html');await pg.wait_for_timeout(3500)
    await pg.pdf(path=os.path.join(D,'Jurassic-Park-dining-guide-A4.pdf'),width='297mm',height='210mm',print_background=True,margin={'top':'0','bottom':'0','left':'0','right':'0'})
    # bleed PDF
    pages=[bleed_page(n) for n in ('outside','inside')]; W,H=pages[0][0],pages[0][1]
    wmm,hmm=W/96*25.4,H/96*25.4
    html='<!doctype html><html><head>'+head+f'<style>@page{{size:{wmm:.2f}mm {hmm:.2f}mm;margin:0}}body{{margin:0}}.pg{{break-after:page}}</style></head><body>'+''.join(x[2] for x in pages)+'</body></html>'
    open(os.path.join(D,'bleed.html'),'w').write(html)
    await pg.goto('file://'+D+'/bleed.html');await pg.wait_for_timeout(3500)
    await pg.pdf(path=os.path.join(D,'Jurassic-Park-dining-guide-A4-print-bleed.pdf'),width=f'{wmm:.2f}mm',height=f'{hmm:.2f}mm',print_background=True,margin={'top':'0','bottom':'0','left':'0','right':'0'})
    await pg.set_viewport_size({'width':int(W)+1,'height':int(H)+1});await pg.screenshot(path=os.path.join(D,'bleed_check.png'),clip={'x':0,'y':0,'width':W,'height':H})
    await b.close()
asyncio.run(main())
