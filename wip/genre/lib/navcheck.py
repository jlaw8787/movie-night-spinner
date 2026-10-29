"""A clear first step: a fresh visit has no film counted as picked, the Candy bar asks you to pick one
first, tabs land at their own top, Back steps through tabs and closes pop-ups without leaving the app,
and Find a film lands on the menu. Repo root, server on 8795.  python3 wip/genre/lib/navcheck.py SHOTDIR"""
import asyncio, sys
from playwright.async_api import async_playwright
OUT = sys.argv[1]; R = []
def rec(n, ok, note=""): R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
B = "http://localhost:8795/"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for dev, o in (("phone", dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)), ("desktop", dict(viewport={"width": 1440, "height": 900}))):
            c = await b.new_context(**o); pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            await pg.goto(B); await pg.evaluate("localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
            await pg.goto(B, wait_until="networkidle"); await pg.wait_for_timeout(4500)
            st = await pg.evaluate("[document.body.classList.contains('staged'),!!current,getComputedStyle(document.getElementById('seriesNote')).display,getComputedStyle(document.getElementById('snackPair')).display]")
            rec(f"{dev}: fresh visit, the film behind the curtain isn't counted as picked", st[0] and st[2] == "none" and st[3] == "none", str(st))
            await pg.click("#viewCraveBtn"); await pg.wait_for_timeout(900)
            top = await pg.evaluate("document.getElementById('viewCrave').getBoundingClientRect().top")
            rec(f"{dev}: Candy bar tab lands at its own top", -10 < top < 160, str(round(top)))
            sub = await pg.evaluate("document.querySelector('#snackCounter .sc-sub').innerText")
            rec(f"{dev}: Candy bar doesn't name a film nobody picked", "Ghostbusters" not in sub, sub[:80])
            await pg.evaluate("document.querySelector('#snackCounter [data-snack]').click()"); await pg.wait_for_timeout(300)
            st = await pg.evaluate("[document.querySelector('#snackCounter .sc-sub').innerText,Object.keys(localStorage).filter(k=>k.startsWith('mns-snacks-')).length,!!document.querySelector('#snackCounter [data-sc-spin]')]")
            rec(f"{dev}: adding a snack first asks you to pick a film", st[1] == 0 and st[2] and "Pick a film first" in st[0], str(st[:2]))
            await pg.click("#snackCounter [data-sc-spin]"); await pg.wait_for_timeout(900)
            rec(f"{dev}: its Spin button goes to the wheel", await pg.evaluate("!document.getElementById('viewWheel').hidden"))
            # Back through tabs
            await pg.click("#viewShopBtn"); await pg.wait_for_timeout(900)
            top = await pg.evaluate("document.getElementById('viewShop').getBoundingClientRect().top")
            rec(f"{dev}: Video store tab lands at its own top", -10 < top < 160, str(round(top)))
            await pg.go_back(); await pg.wait_for_timeout(800)
            st = await pg.evaluate("[location.origin,!document.getElementById('viewWheel').hidden]")
            rec(f"{dev}: Back goes to the previous tab, not out of the app", st[0].startswith("http://localhost") and st[1], str(st))
            await pg.go_back(); await pg.wait_for_timeout(800)
            st = await pg.evaluate("[location.origin,!document.getElementById('viewCrave').hidden]")
            rec(f"{dev}: Back again goes one more tab back", st[0].startswith("http://localhost") and st[1], str(st))
            await pg.go_forward(); await pg.wait_for_timeout(500); await pg.go_forward(); await pg.wait_for_timeout(500)
            # Back closes a pop-up
            await pg.click("#viewWheelBtn"); await pg.wait_for_timeout(600)
            await pg.evaluate("document.getElementById('dfBtn').scrollIntoView({block:'center'})"); await pg.click("#dfBtn"); await pg.wait_for_timeout(1800)
            n0 = await pg.evaluate("document.querySelectorAll('dialog[open]').length")
            await pg.go_back(); await pg.wait_for_timeout(700)
            st = await pg.evaluate("[document.querySelectorAll('dialog[open]').length,location.origin,!document.getElementById('viewWheel').hidden]")
            rec(f"{dev}: Back closes the pop-up and stays put", n0 == 1 and st[0] == 0 and st[1].startswith("http://localhost") and st[2], str([n0] + st))
            await pg.evaluate("document.getElementById('dfBtn').scrollIntoView({block:'center'})"); await pg.click("#dfBtn"); await pg.wait_for_timeout(1800)
            await pg.evaluate("[...document.querySelectorAll('dialog[open]')].pop().querySelector('.modal-x').click()"); await pg.wait_for_timeout(700)
            st = await pg.evaluate("[document.querySelectorAll('dialog[open]').length,!document.getElementById('viewWheel').hidden,location.origin]")
            rec(f"{dev}: closing with the X doesn't step the page back", st[0] == 0 and st[1] and st[2].startswith("http://localhost"), str(st))
            # Find a film lands on the menu
            await pg.evaluate("document.getElementById('findFilm').scrollIntoView({block:'center'})"); await pg.fill("#findFilm", "jaws"); await pg.wait_for_timeout(600)
            await pg.keyboard.press("ArrowDown"); await pg.keyboard.press("Enter"); await pg.wait_for_timeout(3500)
            st = await pg.evaluate("(()=>{const fp=document.getElementById('fmtPhone');const el=fp&&!fp.hidden&&fp.innerHTML?fp:document.getElementById('theatre');return [current&&current.id,Math.round(el.getBoundingClientRect().top),document.body.classList.contains('staged')]})()")
            rec(f"{dev}: Find a film lands on the menu", st[0] and st[0].startswith("Jaws") and -20 < st[1] < 200 and not st[2], str(st))
            await pg.screenshot(path=f"{OUT}/nav-{dev}-find.png")
            await pg.click("#viewCraveBtn"); await pg.wait_for_timeout(800)
            sub = await pg.evaluate("document.querySelector('#snackCounter .sc-sub').innerText")
            rec(f"{dev}: after picking, the Candy bar names the film", "Jaws" in sub, sub[:80])
            rec(f"{dev}: no page errors", not errs, "; ".join(errs[:2]))
            await c.close()
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
