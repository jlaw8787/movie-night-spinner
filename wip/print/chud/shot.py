import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
    pg = await (await b.new_context(viewport={'width': 816, 'height': 1056}, device_scale_factor=2)).new_page()
    await pg.goto('file://' + D + '/notice.html'); await pg.wait_for_timeout(2000)
    await pg.screenshot(path=D + '/notice.png')
    # text inside 40px of the trim, text boxes overlapping each other, smallest font
    rep = await pg.evaluate("""()=>{const out=[],boxes=[];let minf=99;
      document.querySelectorAll('section *').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;
        const r=e.getBoundingClientRect();minf=Math.min(minf,parseFloat(getComputedStyle(e).fontSize));
        if(r.left<40||r.top<40||r.right>776||r.bottom>1016)out.push('EDGE '+t.slice(0,30)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round));
        boxes.push([t.slice(0,24),r])});
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i][1],c=boxes[j][1];
        if(a.left<c.right-1&&c.left<a.right-1&&a.top<c.bottom-1&&c.top<a.bottom-1){const ea=document.elementFromPoint(0,0);out.push('OVERLAP '+boxes[i][0]+' | '+boxes[j][0])}}
      const secs=[...document.querySelectorAll('section')].map(s=>{const r=s.getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom)]});
      return {out,minf,secs}}""")
    print(rep)
    await b.close()
asyncio.run(main())
