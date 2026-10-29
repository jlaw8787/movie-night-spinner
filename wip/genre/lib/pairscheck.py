"""Goes well with: two snack picks under every film's menu. Repo root, local server on 8795.
python3 wip/genre/lib/pairscheck.py SHOTDIR"""
import asyncio, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT=sys.argv[1];B="http://localhost:8795/";R=[]
def rec(n,ok,note=""):R.append(ok);print(("OK   " if ok else "FAULT"),n,note,flush=True)
async def ready(pg,fid):
    await pg.wait_for_function(f"(()=>typeof current!=='undefined'&&current&&current.id==={fid!r}&&!document.getElementById('snackPair').hidden)()",timeout=30000)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for dev,o in (("phone",dict(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,device_scale_factor=2)),("desktop",dict(viewport={"width":1440,"height":900}))):
      c=await b.new_context(**o);pg=await c.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)[:200]))
      await pg.goto(B);await pg.evaluate("localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
      fid="Jaws (1975)"
      await pg.goto(B+"?film="+quote(fid),wait_until="networkidle");await ready(pg,fid)
      names=await pg.evaluate("[...document.querySelectorAll('#snackPair .sp-n')].map(x=>x.firstChild.textContent)")
      rec(f"{dev}: two picks show",len(names)==2,str(names))
      # every film gets two, no repeats, and they vary within a theme
      st=await pg.evaluate("(()=>{let bad=[],th={};for(const f of FILMS){const g=snackGoes(f).map(x=>x.id);if(g.length!==2||g[0]===g[1])bad.push(f.id);(th[f.theme]=th[f.theme]||new Set).add(g.join())}return [bad.length,Object.values(th).filter(s=>s.size<2).length,FILMS.length]})()")
      rec(f"{dev}: every film has two different picks",st[0]==0,str(st))
      rec(f"{dev}: picks vary inside each theme",st[1]==0,str(st))
      await pg.evaluate("document.getElementById('snackPair').scrollIntoView({block:'center'})");await pg.wait_for_timeout(400)
      await pg.screenshot(path=f"{OUT}/pair-{dev}.png")
      first=await pg.evaluate("document.querySelector('#snackPair [data-sp]').dataset.sp")
      await pg.click("#snackPair [data-sp]");await pg.wait_for_timeout(500)
      st=await pg.evaluate(f"[snackPicks(current),document.querySelector('#snackPair [data-sp]').getAttribute('aria-pressed'),!!document.querySelector('#snackCounter .sc-item.on [data-snack=\"{first}\"]'),document.activeElement&&document.activeElement.dataset.sp]")
      rec(f"{dev}: Add puts it on the film and the counter shows it",st[0]==[first] and st[1]=="true" and st[2] and st[3]==first,str(st))
      sh=await pg.evaluate(f"(()=>{{const x=SNACK_BY()['{first}'];return snackDishes(current).some(d=>d.snack==='{first}')}})()")
      rec(f"{dev}: it reaches the prep and shopping list",sh)
      await pg.click("#snackPair [data-sp]");await pg.wait_for_timeout(400)
      st=await pg.evaluate("[snackPicks(current).length,document.querySelector('#snackPair [data-sp]').getAttribute('aria-pressed')]")
      rec(f"{dev}: tapping again takes it off",st==[0,"false"],str(st))
      # counter add flows back to the strip
      await pg.evaluate(f"document.querySelector('#snackCounter [data-snack=\"{first}\"]').click()");await pg.wait_for_timeout(400)
      st=await pg.evaluate("document.querySelector('#snackPair [data-sp]').getAttribute('aria-pressed')")
      rec(f"{dev}: adding at the counter ticks the strip",st=="true",str(st))
      await pg.evaluate(f"document.querySelector('#snackCounter [data-snack=\"{first}\"]').click()")
      await pg.click("#snackPair [data-sp-more]");await pg.wait_for_timeout(1200)
      top=await pg.evaluate("document.getElementById('snackCounter').getBoundingClientRect().top")
      rec(f"{dev}: More snacks goes to the counter",-5<top<200,str(top))
      # vegetarian: no meat snacks
      await pg.evaluate("localStorage.setItem('mns-diet',JSON.stringify({veg:true}))");await pg.reload(wait_until="networkidle")
      await ready(pg,fid)
      st=await pg.evaluate("FILMS.filter(f=>snackGoes(f).some(x=>!x.veg)||snackGoes(f).length!==2).length")
      rec(f"{dev}: vegetarian keeps two picks and no meat",st==0,str(st))
      await pg.evaluate("localStorage.removeItem('mns-diet')")
      fid2="Babe (1995)"
      ex=await pg.evaluate(f"!!FILMS.find(f=>f.id==={fid2!r})")
      if ex:
        await pg.goto(B+"?film="+quote(fid2),wait_until="networkidle");await ready(pg,fid2)
        names2=await pg.evaluate("[...document.querySelectorAll('#snackPair .sp-n')].map(x=>x.firstChild.textContent)")
        rec(f"{dev}: new film, new picks",names2!=names,str(names2))
      rec(f"{dev}: no page errors",not errs,"; ".join(errs[:2]))
      await c.close()
    await b.close()
  print(len(R),"checks,",R.count(False),"faults")
asyncio.run(main())
