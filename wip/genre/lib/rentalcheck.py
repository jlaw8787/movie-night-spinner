"""Rentals check: a tape you've got out opens its menu, member card titles open menus, Return them all. Repo root, server on 8795.
python3 wip/genre/lib/rentalcheck.py SHOTDIR"""
import asyncio, sys, json, time
from playwright.async_api import async_playwright
OUT = sys.argv[1]
R = []
def rec(n, ok, note=""):
    R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, o in (("phone", dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)), ("desktop", dict(viewport={"width": 1440, "height": 900}))):
            c = await b.new_context(**o)
            due = int(time.time() * 1000) + 3 * 864e5
            out = [{"id": "Jaws (1975)", "due": due}, {"id": "Moana (2016)", "due": due}, {"id": "Toy Story (1995)", "due": due}]
            await c.add_init_script("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0');const m=JSON.parse(localStorage.getItem('mns-member')||'null');if(!m||!m.__t){localStorage.setItem('mns-seed',%s)}" % json.dumps(json.dumps(out)))
            pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            await pg.goto("http://localhost:8795/", wait_until="networkidle"); await pg.wait_for_timeout(1200)
            await pg.evaluate("(()=>{member.out=JSON.parse(localStorage.getItem('mns-seed'));saveMember();})()")
            await pg.click("#viewShopBtn"); await pg.wait_for_timeout(1500)
            await pg.evaluate("renderMember()")
            n = await pg.evaluate("document.querySelectorAll('#memberCard [data-open]').length")
            await pg.evaluate("document.getElementById('memberCard').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f"{OUT}/rent-{name}-card.png")
            rec(f"{name}: member card lists rentals with tap-for-menu", n == 3, str(n))
            await pg.click("#memberCard [data-open='Moana (2016)']"); await pg.wait_for_timeout(3500)
            cur = await pg.evaluate("[current&&current.id,!document.getElementById('viewWheel').hidden]")
            rec(f"{name}: tapping a rental opens its menu", cur == ["Moana (2016)", True], str(cur))
            # the case of a rented tape offers Open the menu
            await pg.click("#viewShopBtn"); await pg.wait_for_timeout(1200)
            await pg.fill("#shopSearch", "jaws"); await pg.wait_for_timeout(900)
            await pg.click("#shopAisles .tape[data-id='Jaws (1975)']"); await pg.wait_for_timeout(1500)
            btn = await pg.evaluate("(document.querySelector('dialog[open] .rent')||{}).textContent")
            await pg.screenshot(path=f"{OUT}/rent-{name}-case.png")
            rec(f"{name}: a rented tape's case says Open the menu", btn == "Open the menu", str(btn))
            await pg.click("dialog[open] .rent"); await pg.wait_for_timeout(3500)
            cur = await pg.evaluate("[current&&current.id,!!document.querySelector('dialog.counter[open]')]")
            rec(f"{name}: Open the menu goes straight there, no slip", cur == ["Jaws (1975)", False], str(cur))
            await pg.click("#viewShopBtn"); await pg.wait_for_timeout(1000); await pg.fill("#shopSearch", ""); await pg.wait_for_timeout(600)
            await pg.evaluate("document.getElementById('memberCard').scrollIntoView({block:'center'})")
            await pg.click("#memberCard [data-retall]"); await pg.wait_for_timeout(800)
            left = await pg.evaluate("[(member.out||[]).length,document.querySelectorAll('#memberCard [data-open]').length,document.getElementById('shopCount').textContent]")
            rec(f"{name}: Return them all clears the list", left[0] == 0 and left[1] == 0, str(left))
            rec(f"{name}: no page errors", not errs, "; ".join(errs[:2]))
            await c.close()
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
