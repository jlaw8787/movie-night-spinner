import asyncio,json,sys
from urllib.parse import quote
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/6d06a22c-2024-50a8-a2d1-a12880d59711/scratchpad/'
exec(open(S+'overflow2.py').read().split('async def main')[0].split('port=sys.argv')[0])
M=open(S+'overflow2.py').read().split('M="""')[1].split('"""')[0]
films=[f"{f['title']} ({f['year']})" for f in json.load(open('/home/claude/polish/data/films.json'))]
out=open(S+'sweep850.txt','w')
async def worker(b,q):
  ctx=await b.new_context(viewport={'width':1400,'height':1000})
  while q:
    f=q.pop()
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:80]))
    try:
      await pg.goto('http://localhost:8766/?film='+quote(f));await pg.wait_for_timeout(3500)
      r=await pg.evaluate(M);r['errs']=errs
      cls=await pg.evaluate("(document.querySelector('#preview .mcard')||{}).className||''");r['cls']=cls[:30]
    except Exception as e: r={'n':-1,'exc':str(e)[:80]}
    out.write(('!! ' if r.get('n') or r.get('errs') else 'ok ')+f+' '+json.dumps(r,ensure_ascii=False)+'\n');out.flush();await pg.close()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':__import__('os').environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'});q=list(reversed(films))
    await asyncio.gather(*[worker(b,q) for _ in range(8)]);await b.close()
asyncio.run(main())
