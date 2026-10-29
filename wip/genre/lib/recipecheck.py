"""Recipe numbers you can cook from: steps follow the guests, each dish lists its ingredients, waiting
time is apart from cooking, plurals and units read cleanly, and double features and marathons follow
the guest count. Repo root, server on 8795.  python3 wip/genre/lib/recipecheck.py SHOTDIR"""
import asyncio, re, sys, json
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]; R = []
def rec(n, ok, note=""): R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
async def prep(pg, fid, guests):
    await pg.goto("http://localhost:8795/?film=" + quote(fid), wait_until="networkidle")
    await pg.wait_for_function(f"typeof current!=='undefined'&&current&&current.id==={json.dumps(fid)}&&current._r2", timeout=30000); await pg.wait_for_timeout(2500)
    await pg.evaluate("document.getElementById('tabPrep').click()"); await pg.wait_for_timeout(800)
    for _ in range(guests - 4): await pg.evaluate("document.querySelector('#planner [data-pl=\"+\"]').click()"); await pg.wait_for_timeout(40)
    await pg.wait_for_timeout(600)
    return await pg.evaluate("(()=>{const p=[...document.querySelectorAll('#preview .mcard')].find(e=>e.classList.contains('pp-sheet'));return {txt:p.innerText,shop:[...p.querySelectorAll('.pp-shop li')].map(l=>l.innerText.trim()),ing:[...p.querySelectorAll('.pp-ing')].map(x=>x.innerText),serves:(p.querySelector('.pp-serves')||{}).innerText}})()")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        c = await b.new_context(viewport={"width": 1440, "height": 900}); pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        await pg.goto("http://localhost:8795/"); await pg.evaluate("localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
        r = await prep(pg, "Home Alone (1990)", 8)
        rec("serves follows guests", "serves 8" in r["serves"].lower(), r["serves"])
        rec("glasses in the method follow the guests", "fill eight tall glasses" in r["txt"].lower(), "")
        rec("amounts inside a step follow the guests", "300ml of the thickened cream" in r["txt"], "")
        rec("cold milk and milk are one line", sum(1 for x in r["shop"] if "full cream milk" in x) == 1, str([x for x in r["shop"] if "milk" in x]))
        rec("scoops follow the guests", "twelve scoops" in r["txt"].lower(), "")
        rec("chilling shown as waiting, not cooking", "4 hr waiting" in r["txt"] and "cook 4 hr" not in r["txt"], re.findall(r"Fuller's cola[^\n]*\n[^\n]*", r["txt"])[:1])
        rec("every dish lists its own ingredients", len(r["ing"]) >= 4 and all(x.startswith("You need") for x in r["ing"]), str(len(r["ing"])))
        bad = [x for x in r["shop"] if re.search(r"\b\d+ (small )?(bunch|sprig|pinch|handful|drop|clove)s? \w+s\b|\b1 \w+s (of )?garlic|\d\.\d\dkg|\d\.\d\dl\b|\b\d{2,} tbsp|(?<![/\d])([2-9]|\d{2,}) cup [a-z]", x)]
        rec("shopping list reads cleanly", not bad, str(bad[:4]))
        await pg.screenshot(path=f"{OUT}/recipe-prep-8.png", full_page=False)
        el = await pg.query_selector("#preview"); await el.screenshot(path=f"{OUT}/recipe-prep-8-sheet.png")
        # a big crowd: no runaway spoons
        r = await prep(pg, "Moana (2016)", 20)
        bad = [x for x in r["shop"] if re.search(r"\b\d{2,} tbsp|\b\d{2,} tsp|\d\.\d\d(kg|l)\b", x)]
        rec("20 guests: spoons become cups, weights stay tidy", not bad and "serves 20" in r["serves"].lower(), str(bad[:4]))
        # double feature at 20
        await pg.evaluate("localStorage.setItem('mns-guests','20')"); await pg.reload(wait_until="networkidle"); await pg.wait_for_timeout(2500)
        dm = await pg.evaluate("""async()=>{const a=FILMS.find(f=>f.id==='Toy Story (1995)'),b=FILMS.find(f=>f.id==='Toy Story 2 (1999)');const m4=await doubleMenu(a,b,4),m20=await doubleMenu(a,b,20);return [m4.serves,m20.serves,m4.shopping.slice(0,4),m20.shopping.slice(0,4),m20.shopping.length]}""")
        rec("double feature list scales with guests", dm[0] == 4 and dm[1] == 20 and dm[2] != dm[3] and dm[4] > 3, str(dm[2][:2]) + " vs " + str(dm[3][:2]))
        await pg.evaluate("document.getElementById('dfBtn').scrollIntoView({block:'center'})"); await pg.click("#dfBtn"); await pg.wait_for_timeout(1500)
        g = await pg.evaluate("(document.getElementById('dfG')||{}).textContent")
        await pg.click("dialog[open] [data-a='g+']"); await pg.wait_for_timeout(600)
        g2 = await pg.evaluate("(document.getElementById('dfG')||{}).textContent")
        rec("double feature has a guest stepper starting at usual guests", g == str(await pg.evaluate("USUAL")) and int(g2) == int(g) + 1, f"{g} -> {g2}")
        await pg.click("dialog[open] [data-a='shop']"); await pg.wait_for_timeout(1200)
        prog = await pg.evaluate("[...document.querySelectorAll('dialog[open]')].pop().innerText")
        rec("its shopping list says the right serves", f"Serves {g2}" in prog, re.findall(r"Serves \d+", prog)[:1])
        await pg.screenshot(path=f"{OUT}/recipe-df-list.png")
        rec("no page errors", not errs, "; ".join(errs[:2]))
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
