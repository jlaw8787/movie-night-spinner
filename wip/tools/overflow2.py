import asyncio,json,sys
from urllib.parse import quote
from playwright.async_api import async_playwright
port=sys.argv[1];films=[json.loads(l) for l in open(sys.argv[2])]
M="""()=>{const c=document.querySelector('#preview .mcard');if(!c)return {err:'none'};const cr=c.getBoundingClientRect();const bad=[];
const w=document.createTreeWalker(c,NodeFilter.SHOW_TEXT);let n;
while((n=w.nextNode())){const t=n.textContent.trim();if(t.length<2)continue;const el=n.parentElement;if(el.closest('[aria-hidden=true]'))continue;
 const rg=document.createRange();rg.selectNodeContents(n);const rs=[...rg.getClientRects()];if(!rs.length)continue;
 const r={left:Math.min(...rs.map(x=>x.left)),right:Math.max(...rs.map(x=>x.right)),top:Math.min(...rs.map(x=>x.top)),bottom:Math.max(...rs.map(x=>x.bottom))};
 if(r.bottom>cr.bottom+1||r.right>cr.right+1){bad.push('PAGE:'+t.slice(0,30));continue}
 let a=el;while(a&&a!==c){const cs=getComputedStyle(a);const box=a.getBoundingClientRect();
  const boxed=(a.style.height||a.style.maxHeight||cs.overflow!=='visible'||(cs.position==='absolute'&&a.style.height))&&(cs.backgroundColor!=='rgba(0, 0, 0, 0)'||cs.backgroundImage!=='none'||cs.borderBottomWidth!=='0px'||cs.overflow!=='visible');
  if(boxed&&(r.bottom>box.bottom+2||r.right>box.right+2)){bad.push(t.slice(0,30)+' > '+(a.getAttribute('aria-label')||a.tagName));break}
  a=a.parentElement}}
return {bad:bad.slice(0,4),n:bad.length}}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1400,'height':1000})
    for f in films:
      pg=await ctx.new_page();await pg.goto(f'http://localhost:{port}/?film='+quote(f));await pg.wait_for_timeout(9000)
      r=await pg.evaluate(M);print('!!' if r.get('n') else 'ok',f,json.dumps(r,ensure_ascii=False));await pg.close()
    await b.close()
asyncio.run(main())
