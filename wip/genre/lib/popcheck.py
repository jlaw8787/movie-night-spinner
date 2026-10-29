"""Every pop-up closes three ways: its X, a tap outside, and Escape. Repo root, local server on 8795.
python3 wip/genre/lib/popcheck.py SHOTDIR"""
import asyncio, sys, time, json
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
B = "http://localhost:8795/"
R = []
def rec(n, ok, note=""):
    R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
async def ready(pg):
    await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return typeof current!=='undefined'&&current&&c&&!c.hidden&&c.innerText.length>200})()", timeout=30000)
OPEN = "document.querySelector('dialog[open]')"
async def top(pg):
    return await pg.evaluate("(()=>{const d=[...document.querySelectorAll('dialog[open]')].pop();return d?(d.className||d.id||'dialog'):''})()")
async def try_close(pg, name, opener, how):
    await opener()
    await pg.wait_for_timeout(900)
    t = await top(pg)
    if not t:
        rec(f"{name}: opens", False, "nothing opened"); return
    n0 = await pg.evaluate("document.querySelectorAll('dialog[open]').length")
    if how == "x":
        x = await pg.evaluate("(()=>{const d=[...document.querySelectorAll('dialog[open]')].pop();const b=d.querySelector('.modal-x,.x');if(!b)return false;const r=b.getBoundingClientRect();return r.width>=30&&r.top>=0&&r.top<innerHeight})()")
        if not x:
            rec(f"{name} ({t}): has a visible X", False); await pg.keyboard.press("Escape"); await pg.wait_for_timeout(300); return
        await pg.evaluate("(()=>{const d=[...document.querySelectorAll('dialog[open]')].pop();(d.querySelector('.modal-x')||d.querySelector('.x')).click()})()")
    elif how == "outside":
        await pg.mouse.click(4, await pg.evaluate("innerHeight-4"))
    else:
        await pg.keyboard.press("Escape")
    await pg.wait_for_timeout(500)
    n1 = await pg.evaluate("document.querySelectorAll('dialog[open]').length")
    rec(f"{name} closes with {'the X' if how=='x' else 'a tap outside' if how=='outside' else 'Escape'}", n1 == n0 - 1, f"{t}: {n0}->{n1}")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for dev, o in (("phone", dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)), ("desktop", dict(viewport={"width": 1440, "height": 900}))):
            c = await b.new_context(**o, accept_downloads=True)
            pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            await pg.goto(B + "?film=" + quote("The Empire Strikes Back (1980)"), wait_until="networkidle"); await pg.wait_for_timeout(1500)
            # welcome card (fresh profile)
            async def nothing(): pass
            for how in ("x", "outside", "escape"):
                if how != "x":
                    await pg.evaluate("localStorage.removeItem('mns-welcome')"); await pg.reload(wait_until="networkidle"); await pg.wait_for_timeout(1500)
                await try_close(pg, f"{dev}: welcome", nothing, how)
            await pg.evaluate("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
            await pg.reload(wait_until="networkidle"); await ready(pg)
            async def o_settings(): await pg.evaluate("document.getElementById('setBtn').scrollIntoView({block:'center'})"); await pg.click("#setBtn")
            async def o_double(): await pg.evaluate("document.getElementById('dfBtn').scrollIntoView({block:'center'})"); await pg.click("#dfBtn")
            async def o_marathon(): await pg.evaluate("document.getElementById('seriesNote').scrollIntoView({block:'center'})"); await pg.click("#seriesNote [data-sr=run]")
            async def o_list():
                await pg.evaluate("document.getElementById('weekSet').scrollIntoView({block:'center'})")
                if not await pg.query_selector("#weekShop"): await pg.click("#weekSet"); await pg.wait_for_timeout(600)
                await pg.evaluate("document.getElementById('weekShop').scrollIntoView({block:'center'})"); await pg.click("#weekShop")
            async def o_case():
                await pg.click("#viewShopBtn"); await pg.wait_for_timeout(800)
                await pg.fill("#shopSearch", "jaws"); await pg.wait_for_timeout(700)
                await pg.click("#shopAisles .tape[data-id='Jaws (1975)']")
            async def o_slip():
                await o_case(); await pg.wait_for_timeout(1200)
                await pg.click("dialog[open] .rent")
            async def o_sync():
                await pg.click("#viewShopBtn"); await pg.wait_for_timeout(800); await pg.fill("#shopSearch", ""); await pg.wait_for_timeout(500)
                await pg.evaluate("document.getElementById('memberCard').scrollIntoView({block:'center'})"); await pg.click("#memberCard [data-sync='in']")
            for nm, op in (("settings", o_settings), ("double feature", o_double), ("marathon", o_marathon), ("shopping list", o_list), ("back of the box", o_case), ("rental slip", o_slip), ("member card form", o_sync)):
                for how in ("x", "outside", "escape"):
                    await try_close(pg, f"{dev}: {nm}", op, how)
                    await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
                    await pg.click("#viewWheelBtn"); await pg.wait_for_timeout(300)
            # the case: See the menu goes straight to the menu, no rental
            await o_case(); await pg.wait_for_timeout(1300)
            out0 = await pg.evaluate("(member.out||[]).length")
            await pg.screenshot(path=f"{OUT}/pop-{dev}-case.png")
            await pg.click("dialog[open] .menu-go"); await pg.wait_for_timeout(3500)
            st = await pg.evaluate("[current.id,(member.out||[]).length,!!document.querySelector('dialog[open]'),!document.getElementById('viewWheel').hidden]")
            rec(f"{dev}: See the menu opens the menu with no rental", st[0] == "Jaws (1975)" and st[1] == out0 and not st[2] and st[3], str(st))
            await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
            rec(f"{dev}: no page errors", not errs, "; ".join(errs[:2]))
            await c.close()
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
