"""Checks for the Oct 29 casual-user walkthrough fixes. Repo root, local server on 8795.
python3 wip/genre/lib/journeyfix.py SHOTDIR"""
import asyncio, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
B = "http://localhost:8795/"
R = []
def rec(n, ok, note=""):
    R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
async def ready(pg):
    await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return typeof current!=='undefined'&&current&&c&&!c.hidden&&c.innerText.length>200})()", timeout=30000)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        phone = dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
        # 3 shared link on a fresh profile, welcome card showing
        c = await b.new_context(**phone); pg = await c.new_page()
        await pg.goto(B + "?film=" + quote("Jaws (1975)"), wait_until="networkidle"); await pg.wait_for_timeout(2500)
        btn = await pg.query_selector(".welcome button")
        if btn: await btn.click()
        await pg.wait_for_timeout(1200)
        top = await pg.evaluate("Math.round(document.getElementById('theatre').getBoundingClientRect().top)")
        await pg.screenshot(path=f"{OUT}/jf-shared.png")
        rec("shared link lands on the film's menu after the welcome card", 0 <= top < 200, f"theatre top {top}px")
        await c.close()
        c = await b.new_context(**phone); await c.add_init_script("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
        pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        # 1 one set of ticks: prep and Lock it in agree, guests keep them
        await pg.goto(B + "?film=" + quote("Moana (2016)"), wait_until="networkidle"); await ready(pg)
        await pg.click("#tabPrep"); await pg.wait_for_timeout(800)
        li = await pg.query_selector("#preview .pp-aisle li[data-k]"); k = await li.get_attribute("data-k")
        await li.scroll_into_view_if_needed(); await li.click(); await pg.wait_for_timeout(200)
        await pg.evaluate("document.getElementById('weekSet').scrollIntoView({block:'center'})"); await pg.click("#weekSet"); await pg.wait_for_timeout(800)
        await pg.click("#weekShop"); await pg.wait_for_timeout(1200)
        tr = await pg.evaluate(f"(()=>{{const i=document.querySelector('dialog.trolley[open] input[data-k=\"{k}\"]');return i?i.checked:'missing'}})()")
        prog = await pg.evaluate("document.querySelector('dialog.trolley[open] #tProg').textContent")
        await pg.screenshot(path=f"{OUT}/jf-trolley.png")
        rec("a prep sheet tick shows on the Lock it in list", tr is True and prog.startswith("1 of"), f"{k}: {tr}, {prog[:30]}")
        k2 = await pg.evaluate("[...document.querySelectorAll('dialog.trolley[open] input[data-k]')].map(i=>i.dataset.k)[2]")
        await pg.click(f"dialog.trolley[open] input[data-k=\"{k2}\"]"); await pg.wait_for_timeout(200)
        await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
        await pg.click("#tabPrep"); await pg.wait_for_timeout(500)
        back = await pg.evaluate(f"(()=>{{const l=document.querySelector('#preview li[data-k=\"{k2}\"]');return l?l.classList.contains('pp-done'):'missing'}})()")
        rec("a Lock it in tick shows on the prep sheet", back is True, str(back))
        for i in range(3):
            await pg.click("#planner [data-pl='+']"); await pg.wait_for_timeout(150)
        kept = await pg.evaluate(f"!!document.querySelector('#preview li[data-k=\"{k}\"].pp-done')")
        rec("changing guests keeps the ticks", kept)
        await pg.reload(wait_until="networkidle"); await ready(pg); await pg.click("#tabPrep"); await pg.wait_for_timeout(600)
        kept2 = await pg.evaluate(f"!!document.querySelector('#preview li[data-k=\"{k}\"].pp-done')&&!!document.querySelector('#preview li[data-k=\"{k2}\"].pp-done')")
        rec("ticks survive a reload", kept2)
        # 7 the spin bar stays off this week's film
        await pg.evaluate("document.getElementById('weekPanel').scrollIntoView({block:'end'})"); await pg.wait_for_timeout(600)
        hid = await pg.evaluate("document.getElementById('spinbar').hidden")
        rec("spin bar stays off this week's film", hid)
        # 2 snacks follow the locked-in film after renting another
        await pg.goto(B + "?film=" + quote("Groundhog Day (1993)"), wait_until="networkidle"); await ready(pg)
        await pg.click("#viewCraveBtn"); await pg.wait_for_timeout(1200)
        sub = await pg.evaluate("document.querySelector('#snackCounter .sc-sub').innerText")
        await pg.click("#snackCounter [data-snack='lolly-snakes']"); await pg.wait_for_timeout(300)
        picks = await pg.evaluate("[JSON.parse(localStorage.getItem('mns-snacks-Moana (2016)')||'[]'),JSON.parse(localStorage.getItem('mns-snacks-Groundhog Day (1993)')||'[]')]")
        rec("snacks go on the locked-in film, not the one just opened", "Moana" in sub and "lolly-snakes" in picks[0] and not picks[1], f"{sub[:70]} | {picks}")
        await pg.click("#snackCounter [data-sc-go]"); await pg.wait_for_timeout(1500)
        tr2 = await pg.evaluate("(document.querySelector('dialog.trolley[open]')||{}).innerText||''")
        await pg.screenshot(path=f"{OUT}/jf-snack-list.png")
        rec("See the shopping list opens the locked film's list with the snacks", "MOANA" in tr2.upper() and "lolly snakes" in tr2.lower(), tr2[:40].replace("\n", " "))
        await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
        # 6 saved message
        await pg.click("#viewWheelBtn"); await pg.wait_for_timeout(500)
        await pg.evaluate("document.getElementById('favBtn').scrollIntoView({block:'center'})"); await pg.click("#favBtn"); await pg.wait_for_timeout(500)
        st = await pg.evaluate("document.getElementById('status').textContent")
        rec("saving says where the menu went", "Your saved menus" in st, st[:80])
        rec("no page errors", not errs, "; ".join(errs[:2]))
        await c.close(); await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
