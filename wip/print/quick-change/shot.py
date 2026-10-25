"""Renders front.png and back.png at 2x and reports any text closer than 40px to the trim,
plus the space left between the last line of copy and the foot of the card."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
CHECK = """()=>{const out=[];let low=0;document.querySelectorAll('body *').forEach(e=>{
  const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
  if(!t)return;const r=e.getBoundingClientRect();low=Math.max(low,r.bottom);
  if(r.left<40||r.right>368||r.top<40||r.bottom>1016)out.push(t.slice(0,28)+' ['+Math.round(r.left)+','+Math.round(r.top)+','+Math.round(r.right)+','+Math.round(r.bottom)+']')});
  return {out, low:Math.round(low)}}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 408, 'height': 1056}, device_scale_factor=2)).new_page()
        for n in ('front', 'back'):
            await pg.goto('file://' + D + '/' + n + '.html'); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=D + '/' + n + '.png')
            r = await pg.evaluate(CHECK)
            print(n, 'lowest text at', r['low'], '| outside 40px margin:', r['out'] or 'none')
        await b.close()
asyncio.run(main())
