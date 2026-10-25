import asyncio,os,sys
from playwright.async_api import async_playwright
D=os.path.dirname(os.path.abspath(__file__))
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ['HTTPS_PROXY'],'bypass':'localhost,127.0.0.1'})
    pg=await (await b.new_context(viewport={'width':528,'height':816},device_scale_factor=2)).new_page()
    for n in ('front','back'):
      await pg.goto('file://'+D+'/'+n+'.html');await pg.wait_for_timeout(2500)
      await pg.screenshot(path=D+'/'+n+'.png')
      # anything poking outside the page or its section
      bad=await pg.evaluate("""()=>{const out=[];document.querySelectorAll('section *').forEach(e=>{if(!e.childNodes.length)return;const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const r=e.getBoundingClientRect(),s=e.closest('section').getBoundingClientRect();if(r.right>s.right-8||r.bottom>s.bottom-8||r.left<s.left+8)out.push(t.slice(0,30))});return out}""")
      print(n,'edge issues:',bad[:8])
    await b.close()
asyncio.run(main())
