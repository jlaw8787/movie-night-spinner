import asyncio,os
from playwright.async_api import async_playwright
D=os.path.dirname(os.path.abspath(__file__))
B=11.34   # 3mm bleed in px
M=22.68   # 6mm slug for crop marks
def body(n): return open(os.path.join(D,n+'.html')).read().split('<body>')[1].split('</body>')[0]
PANELS={'outside':[(0,359,'#f3ecd8'),(359,1123,'#133a2a')],'inside':[(0,1123,'#f3ecd8')]}
FOLDS={'outside':[365,744],'inside':[379,758]}
def bleed_page(n):
    o=M+B; W=1123+2*o; H=794+2*o; s=''
    for x0,x1,c in PANELS[n]:
        L=o+x0-(B if x0==0 else 0); R=o+x1+(B if x1==1123 else 0)
        s+=f'<div style="position:absolute;left:{L}px;top:{M}px;width:{R-L}px;height:{794+2*B+2}px;background:{c}"></div>'
    s+=f'<div style="position:absolute;left:{M}px;top:{M}px;width:{1123+2*B}px;height:{B+12}px;background:#f2b21b"></div>'
    s+=f'<div style="position:absolute;left:{M}px;top:{o+12}px;width:{1123+2*B}px;height:6px;background:#b5241a"></div>'
    s+=f'<img src="assets/paper-grain.png" alt="" style="position:absolute;left:{M}px;top:{M}px;width:{1123+2*B}px;height:{794+2*B+2}px">'
    s+=f'<div style="position:absolute;left:{o}px;top:{o}px;width:1123px;height:794px;overflow:hidden">{body(n)}</div>'
    def ln(x,y,w,h): return f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:#000"></div>'
    for x in (o,o+1123): s+=ln(x-0.25,0,0.5,M-3)+ln(x-0.25,H-M+3,0.5,M-3)
    for y in (o,o+794): s+=ln(0,y-0.25,M-3,0.5)+ln(W-M+3,y-0.25,M-3,0.5)
    for fx in FOLDS[n]:
        for y0 in (0,H-M+3):
            for t in range(0,int(M-3),5): s+=ln(o+fx-0.25,y0+t,0.5,3)
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
import pikepdf
o=(M+B)*0.75; b_=B*0.75
with pikepdf.open(os.path.join(D,'Jurassic-Park-dining-guide-A4-print-bleed.pdf'),allow_overwriting_input=True) as pdf:
    for p in pdf.pages:
        p.TrimBox=pikepdf.Array([o,o,o+841.89,o+595.28])
        p.BleedBox=pikepdf.Array([o-8.504,o-8.504,o+841.89+8.504,o+595.28+8.504])
    pdf.save(os.path.join(D,'Jurassic-Park-dining-guide-A4-print-bleed.pdf'))

with pikepdf.open(os.path.join(D,'Jurassic-Park-dining-guide-A4.pdf'),allow_overwriting_input=True) as pdf:
    for pg_ in pdf.pages:
        pg_.MediaBox=pikepdf.Array([0,0,841.89,595.28]); pg_.TrimBox=pikepdf.Array([0,0,841.89,595.28])
    pdf.save(os.path.join(D,'Jurassic-Park-dining-guide-A4.pdf'))
