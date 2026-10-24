import asyncio,json,sys
from urllib.parse import quote
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/255d9f36-a28f-53a9-8508-211dbc596b89/scratchpad/'
exec(open(S+'overflow2.py').read().split('async def main')[0].split('port=sys.argv')[0])
M=open(S+'overflow2.py').read().split('M="""')[1].split('"""')[0]
films=[f"{f['title']} ({f['year']})" for f in json.load(open('/home/claude/movie-night-spinner/data/films.json'))]
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
    b=await p.chromium.launch();q=list(reversed(films))
    await asyncio.gather(*[worker(b,q) for _ in range(8)]);await b.close()
asyncio.run(main())
