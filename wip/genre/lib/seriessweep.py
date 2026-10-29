"""Series sweep: every series marathon in release and story order. Repo root, local server on 8795.
python3 wip/genre/lib/seriessweep.py OUT.json"""
import asyncio, json, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
SER = json.load(open("data/series.json"))
async def main():
    rep = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
        await ctx.add_init_script("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        await pg.goto("http://localhost:8795/?film=" + quote(SER[0]["release"][1]), wait_until="networkidle"); await pg.wait_for_timeout(2500)
        for s in SER:
            for ord in (["release", "story"] if s.get("story") else ["release"]):
                e0 = len(errs)
                r = await pg.evaluate("""async ([sid,ord])=>{localStorage.setItem('mns-series-order',ord);const sr=window.SERIES.find(x=>x.id===sid);
                  const films=seriesList(sr,ord);const m=await marathonMenu(films);
                  return {n:films.length,first:films[0].id,s:m.s.length,m:m.m.length,w:m.w.length,d:m.d.length,shop:[...m.s,...m.m,...m.w,...m.d].reduce((a,it)=>a+(it.shop||[]).length,0)}}""", [s["id"], ord])
                want = (s.get(ord) or s["release"])[0]
                ok = r["first"] == want and r["s"] >= 1 and r["m"] >= 1 and r["w"] >= 1 and r["shop"] > 3 and len(errs) == e0
                rep.append({"series": s["id"], "order": ord, "ok": ok, **r, "errors": errs[e0:]})
                print(("OK   " if ok else "FAULT"), s["id"], ord, r, errs[e0:][:1], flush=True)
        # open the modal on a few to check the dialog itself
        for sid in ["star-wars", "x-men", "back-to-the-future", "monsters"]:
            s = next(x for x in SER if x["id"] == sid)
            await pg.goto("http://localhost:8795/?film=" + quote(s["release"][-1]), wait_until="networkidle"); await pg.wait_for_timeout(2500)
            await pg.click("#seriesNote [data-sr=run]"); await pg.wait_for_timeout(1500)
            n = await pg.evaluate("document.querySelectorAll('dialog.trolley[open] .mr-films input').length")
            await pg.click("dialog.trolley[open] [data-a=shop]"); await pg.wait_for_timeout(1000)
            k = await pg.evaluate("document.querySelectorAll('dialog[open]').length")
            ok = n == len(s["release"]) and k == 2
            rep.append({"series": sid, "order": "modal", "ok": ok, "films": n, "dialogs": k})
            print(("OK   " if ok else "FAULT"), sid, "modal", n, k, flush=True)
        await b.close()
    json.dump(rep, open(OUT, "w"), indent=1)
    print(len(rep), "checks,", sum(not r["ok"] for r in rep), "faults")
asyncio.run(main())
