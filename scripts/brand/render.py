import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(device_scale_factor=1)
    await pg.goto("file://"+__import__('os').path.abspath(sys.argv[1]));await pg.wait_for_timeout(1500)
    await pg.evaluate("document.fonts.ready")
    await pg.locator("#logo").screenshot(path=sys.argv[2],omit_background=True)
    await b.close()
asyncio.run(main())
