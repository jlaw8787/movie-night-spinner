"""Renders each face at 2x and checks the print rules: 40px from trim, nothing on the fold,
nothing under 12px, and nothing spilling out of its page."""
import asyncio, os
from playwright.async_api import async_playwright
D = os.path.dirname(os.path.abspath(__file__))
FOLD = 528

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ['HTTPS_PROXY'], 'bypass': 'localhost,127.0.0.1'})
        pg = await (await b.new_context(viewport={'width': 1056, 'height': 816}, device_scale_factor=2)).new_page()
        for n in ('outside', 'inside'):
            await pg.goto('file://' + D + '/' + n + '.html', wait_until='networkidle'); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=D + '/' + n + '.png')
            rep = await pg.evaluate("""(F)=>{const o=[];let m=99;const secs=[...document.querySelectorAll('section')].map(s=>s.getBoundingClientRect());
              document.querySelectorAll('div,span,b').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;
                const r=e.getBoundingClientRect();m=Math.min(m,parseFloat(getComputedStyle(e).fontSize));
                if(r.left<40||r.top<40||r.right>1016||r.bottom>776)o.push('EDGE '+t.slice(0,24)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round));
                if(r.left<F+20&&r.right>F-20)o.push('FOLD '+t.slice(0,24));
                const s=secs.find(s=>r.left>=s.left-2&&r.left<=s.right);if(s&&(r.bottom>s.bottom+1||r.right>s.right+1))o.push('SPILL '+t.slice(0,24)+' '+Math.round(r.bottom)+'/'+Math.round(s.bottom))});
              const kids=[...document.querySelectorAll('section')].map(s=>{let mx=0;s.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.height&&r.width)mx=Math.max(mx,r.bottom)});return Math.round(mx)});
              return {o,m,kids}}""", FOLD)
            print(n, 'min px', rep['m'], 'section content bottoms', rep['kids'])
            for x in rep['o'][:20]: print('  ', x)
        await b.close()
asyncio.run(main())
