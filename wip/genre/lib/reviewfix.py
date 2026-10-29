"""Checks for the Oct 29 fresh-eyes review fixes. Repo root, local server on 8795.
python3 wip/genre/lib/reviewfix.py SHOTDIR"""
import asyncio, sys, time
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
B = "http://localhost:8795/"
RES = []
def rec(name, ok, note=""):
    RES.append((name, ok, note)); print(("OK   " if ok else "FAULT"), name, note, flush=True)

async def ready(pg):
    await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return typeof current!=='undefined'&&current&&c&&!c.hidden&&c.innerText.length>200})()", timeout=30000)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, opts in (("phone", dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)), ("desktop", dict(viewport={"width": 1440, "height": 900}))):
            ctx = await b.new_context(**opts, accept_downloads=True)
            await ctx.add_init_script("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
            pg = await ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            # 1 film link after the store
            await pg.goto(B, wait_until="networkidle"); await pg.wait_for_timeout(1200)
            await pg.click("#viewShopBtn"); await pg.wait_for_timeout(600)
            await pg.goto(B + "?film=" + quote("Toy Story 3 (2010)"), wait_until="networkidle"); await ready(pg)
            vis = await pg.evaluate("!document.getElementById('viewWheel').hidden&&document.getElementById('viewShop').hidden")
            rec(f"{name}: film link opens on its menu after the store", vis)
            # 4 lazy night planner follows the menu
            await pg.goto(B + "?film=" + quote("Jaws (1975)"), wait_until="networkidle"); await ready(pg)
            await pg.evaluate("document.getElementById('lazyBtn').scrollIntoView({block:'center'})"); await pg.click("#lazyBtn"); await pg.wait_for_timeout(2500)
            await pg.click("#tabPrep"); await pg.wait_for_timeout(1000)
            n = await pg.evaluate("document.querySelectorAll('#preview .pp-method li').length")
            menu_n = await pg.evaluate("['s','m','w','d'].reduce((a,k)=>a+(current.menu[k]||[]).length,0)")
            rec(f"{name}: lazy night prep matches menu", n == menu_n and n <= 3, f"prep {n}, menu {menu_n}")
            await pg.click("#tabMenu"); await pg.evaluate("document.getElementById('lazyBtn').scrollIntoView({block:'center'})"); await pg.click("#lazyBtn"); await pg.wait_for_timeout(2500)
            # 10 prep ticks
            await pg.click("#tabPrep"); await pg.wait_for_timeout(800)
            li = await pg.query_selector("#preview .pp-aisle li[data-k]")
            await li.scroll_into_view_if_needed(); await li.click(); await pg.wait_for_timeout(200)
            on = await pg.evaluate("document.querySelector('#preview .pp-aisle li[data-k]').classList.contains('pp-done')")
            await pg.reload(wait_until="networkidle"); await ready(pg); await pg.click("#tabPrep"); await pg.wait_for_timeout(800)
            kept = await pg.evaluate("document.querySelector('#preview .pp-aisle li[data-k]').classList.contains('pp-done')")
            clean = await pg.evaluate("(()=>{const c=prepA4();return c.querySelectorAll('.pp-done').length===0})()")
            await pg.screenshot(path=f"{OUT}/fix-ticks-{name}.png")
            rec(f"{name}: prep ticks toggle, persist, print copy blank", on and kept and clean)
            # 6 spin bar hidden over the prep sheet (phone)
            if name == "phone":
                await pg.evaluate("document.querySelector('#preview .pp-method').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(500)
                hid = await pg.evaluate("document.getElementById('spinbar').hidden")
                rec("phone: spin bar stays off the prep sheet", hid)
            # 9 arrow keys on Menu/Prep tabs
            if name == "desktop":
                await pg.focus("#tabPrep"); await pg.keyboard.press("ArrowLeft"); await pg.wait_for_timeout(300)
                a = await pg.evaluate("document.activeElement.id+':'+document.getElementById('tabMenu').getAttribute('aria-selected')")
                rec("desktop: arrow keys move between Menu and Prep", a == "tabMenu:true", a)
            # 3 marathon numbers
            await pg.goto(B + "?film=" + quote("The Empire Strikes Back (1980)"), wait_until="networkidle"); await ready(pg)
            await pg.click("#seriesNote [data-sr=run]"); await pg.wait_for_timeout(1800)
            st = await pg.evaluate("(()=>{const n=document.querySelector('dialog[open] .mr-films .n');return getComputedStyle(n).textDecorationLine+'|'+getComputedStyle(n).opacity})()")
            await pg.click("dialog[open] .mr-films li:nth-child(2) input"); await pg.wait_for_timeout(1500)
            st2 = await pg.evaluate("(()=>{const n=document.querySelectorAll('dialog[open] .mr-films .n')[1];return getComputedStyle(n).opacity})()")
            await pg.screenshot(path=f"{OUT}/fix-marathon-{name}.png")
            rec(f"{name}: marathon ticked numbers plain, unticked dimmed", st.startswith("none|1") and float(st2) < 0.6, f"{st} / {st2}")
            await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
            # 7 empty search message
            await pg.click("#viewShopBtn"); await pg.wait_for_timeout(800)
            await pg.fill("#shopSearch", "zzzzqq"); await pg.wait_for_timeout(900)
            msg = await pg.evaluate("(document.querySelector('#shopAisles .shelf-empty')||{}).innerText||''")
            rec(f"{name}: empty search says so", "No tapes match" in msg, msg[:60])
            await pg.fill("#shopSearch", ""); await pg.wait_for_timeout(400)
            # 2 and 8 candy bar chip text and cake count
            await pg.click("#viewCraveBtn") if await pg.query_selector("#viewCraveBtn") else None
            await pg.wait_for_timeout(1200)
            chip = await pg.query_selector("#craveChips button")
            if chip:
                await chip.click(); await pg.wait_for_timeout(800)
                col = await pg.evaluate("(()=>{const b=document.querySelector('#craveChips button[aria-pressed=\"true\"]');if(!b)return 'none';const s=b.querySelector('span')||b;return getComputedStyle(s).color+'|'+getComputedStyle(b).backgroundColor})()")
                await pg.screenshot(path=f"{OUT}/fix-candy-{name}.png")
                parts = col.split("|")
                rec(f"{name}: picked treat label readable", len(parts) == 2 and parts[0] != parts[1], col)
                if name == "desktop":
                    cov = await pg.evaluate("""(()=>{const p=document.querySelector('.cb-pop');if(!p)return 'no pop';const r=p.getBoundingClientRect();
                      return [...document.querySelectorAll('#craveChips button b')].filter(b=>{const q=b.getBoundingClientRect();return q.right>r.left+10&&q.left<r.right&&q.bottom>r.top+10&&q.top<r.bottom}).map(b=>b.innerText).join(',')||'clear'})()""")
                    rec("desktop: popcorn box clear of the counts", cov in ("clear", "no pop"), cov)
            # 11 skip
            await pg.goto(B, wait_until="networkidle"); await pg.wait_for_timeout(1200)
            await pg.click("#viewWheelBtn"); await pg.wait_for_timeout(500)
            await pg.evaluate("document.getElementById('spin').scrollIntoView({block:'center'})")
            t = time.time(); await pg.click("#spin"); await pg.wait_for_timeout(500)
            await pg.click(".wheel-box", position={"x": 30, "y": 30}, force=True)
            await pg.wait_for_function("!spinning", timeout=20000)
            await pg.wait_for_timeout(700)
            await pg.evaluate("document.getElementById('theatre').click()")
            await pg.wait_for_function("!document.getElementById('theatre').classList.contains('closed')", timeout=15000)
            dt = time.time() - t
            rec(f"{name}: tap to skip gets to the menu fast", dt < 5, f"{dt:.1f}s")
            rec(f"{name}: no page errors", not errs, "; ".join(errs[:2]))
            await ctx.close()
        await b.close()
    print(len(RES), "checks,", sum(not r[1] for r in RES), "faults")
asyncio.run(main())
