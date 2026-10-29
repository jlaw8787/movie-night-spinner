"""Snack counter check. Repo root, local server on 8795. python3 wip/genre/lib/snackcheck.py SHOTDIR"""
import asyncio, sys, json
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
R = []
def rec(n, ok, note=""):
    R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, o in (("phone", dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)), ("desktop", dict(viewport={"width": 1440, "height": 900}))):
            c = await b.new_context(**o); await c.add_init_script("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
            pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            await pg.goto("http://localhost:8795/?film=" + quote("Jaws (1975)"), wait_until="networkidle"); await pg.wait_for_timeout(2500)
            await pg.click("#viewCraveBtn"); await pg.wait_for_timeout(1500)
            n = await pg.evaluate("document.querySelectorAll('#snackCounter .sc-item').length")
            rec(f"{name}: counter lists the snacks", n >= 30, str(n))
            await pg.evaluate("document.getElementById('snackCounter').scrollIntoView()"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f"{OUT}/snack-{name}-1.png")
            for sid in ["choc-tops", "lolly-snakes", "cheerios"]:
                await pg.click(f"#snackCounter [data-snack='{sid}']"); await pg.wait_for_timeout(250)
            on = await pg.evaluate("[...document.querySelectorAll('#snackCounter .sc-add[aria-pressed=true]')].map(b=>b.dataset.snack)")
            bar = await pg.evaluate("(document.querySelector('#snackCounter .sc-bar:not([hidden])')||{}).innerText||''")
            rec(f"{name}: three snacks added, bar shows", len(on) == 3 and "3 snacks" in bar, f"{on} | {bar[:60]}")
            await pg.click("#snackCounter [data-sc-cat='Retro']"); await pg.wait_for_timeout(300)
            k = await pg.evaluate("[...new Set([...document.querySelectorAll('#snackCounter .sc-item')].map(i=>i.querySelector('.sc-n span').textContent))].length")
            rec(f"{name}: category filter narrows the list", 0 < k < 10, str(k))
            await pg.screenshot(path=f"{OUT}/snack-{name}-2.png")
            await pg.click("#snackCounter [data-sc-go]"); await pg.wait_for_timeout(1500)
            prep = await pg.evaluate("""(()=>{const t=document.getElementById('preview').innerText;return {aisle:/LOLLIES AND SNACKS|Lollies and snacks/i.test(t),snakes:/lolly snakes/i.test(t),choc:/Choc tops/.test(t),cheer:/Cheerios/.test(t),tab:document.getElementById('tabPrep').getAttribute('aria-selected')}})()""")
            rec(f"{name}: snacks on the prep sheet and shopping list", all([prep["aisle"], prep["snakes"], prep["choc"], prep["cheer"], prep["tab"] == "true"]), json.dumps(prep))
            await pg.screenshot(path=f"{OUT}/snack-{name}-prep.png")
            lst = await pg.evaluate("[...document.querySelectorAll('#planner .pl-c legend')].map(l=>l.textContent)")
            rec(f"{name}: planner shows From the candy bar", "From the candy bar" in lst, str(lst))
            # guests scale the lollies
            for i in range(4):
                await pg.click("#planner [data-pl='+']"); await pg.wait_for_timeout(120)
            sn = await pg.evaluate("[...document.querySelectorAll('#preview .pp-aisle li')].map(l=>l.innerText).find(t=>/lolly snakes/i.test(t))||''")
            rec(f"{name}: 8 guests doubles the lolly snakes", sn.startswith("2"), sn)
            # vegetarian blocks the cheerios
            await pg.click("#planner [data-diet='veg']"); await pg.wait_for_timeout(500)
            cheer = await pg.evaluate("/Cheerios/.test(document.querySelector('#preview .pp-method').innerText)")
            rec(f"{name}: vegetarian leaves the cheerios off", not cheer)
            await pg.click("#planner [data-diet='veg']"); await pg.wait_for_timeout(400)
            # Lock it in list carries the snacks
            await pg.evaluate("document.getElementById('weekSet').scrollIntoView({block:'center'})"); await pg.click("#weekSet"); await pg.wait_for_timeout(800)
            await pg.click("#weekShop"); await pg.wait_for_timeout(1200)
            tr = await pg.evaluate("(document.querySelector('dialog.trolley[open]')||{}).innerText||''")
            rec(f"{name}: Lock it in list carries the snacks", "lolly snakes" in tr.lower(), "")
            await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
            # picks belong to the film: another film starts empty
            await pg.goto("http://localhost:8795/?film=" + quote("Moana (2016)"), wait_until="networkidle"); await pg.wait_for_timeout(2500)
            await pg.click("#viewCraveBtn"); await pg.wait_for_timeout(1200)
            n2 = await pg.evaluate("[document.querySelectorAll('#snackCounter .sc-add[aria-pressed=true]').length,document.querySelector('#snackCounter .sc-sub').innerText,localStorage.getItem('mns-snacks-Moana (2016)')]")
            rec(f"{name}: with Jaws locked in, opening Moana keeps the snacks on Jaws", n2[0] == 3 and "Jaws" in n2[1] and not n2[2], str(n2)[:90])
            rec(f"{name}: no page errors", not errs, "; ".join(errs[:2]))
            await c.close()
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
