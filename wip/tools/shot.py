import asyncio,sys,base64
from urllib.parse import quote
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':__import__('os').environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'});pg=await (await b.new_context(viewport={'width':1400,'height':1000})).new_page()
    await pg.goto(f'http://localhost:{sys.argv[1]}/?film='+quote(sys.argv[2]));await pg.wait_for_timeout(5000)
    d=await pg.evaluate("async()=>{await loadExportTools(false);const c=await renderCanvas(document.querySelector('#preview .mcard'),false);return c.toDataURL('image/jpeg',.8)}")
    open(sys.argv[3],'wb').write(base64.b64decode(d.split(',')[1]));await b.close()
asyncio.run(main())
