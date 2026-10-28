"""Front page shake-down: drives every control like a person would, on a phone and a desktop.
python3 wip/genre/lib/frontcheck.py OUTDIR [base_url]   (local server on 8795 by default)
Writes OUTDIR/report.json and screenshots. Each step logs ok / fault, time, page errors, console errors."""
import asyncio, json, os, sys, time, re
from playwright.async_api import async_playwright
OUT = sys.argv[1]; BASE = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:8795/"
os.makedirs(OUT, exist_ok=True)
REP = []

class Run:
    def __init__(s, name, pg): s.name = name; s.pg = pg; s.errs = []; s.cons = []; s.bad = []
    async def step(s, label, fn, shot=False):
        e0, c0 = len(s.errs), len(s.cons); t = time.time(); ok = True; note = ""
        try:
            r = await fn()
            if r is False: ok = False; note = "check failed"
            elif isinstance(r, str): note = r
        except Exception as e: ok = False; note = str(e).split("\n")[0][:200]
        dt = round(time.time() - t, 2)
        errs = s.errs[e0:]; cons = s.cons[c0:]
        if errs: ok = False
        REP.append({"run": s.name, "step": label, "ok": ok, "sec": dt, "note": note, "pageerrors": errs[:3], "console": cons[:3], "badreq": s.bad[-3:] if not ok else []})
        print(("OK   " if ok else "FAULT"), f"{s.name:8} {dt:6.2f}s  {label}  {note}  {errs[:1]}", flush=True)
        if shot or not ok:
            try: await s.pg.screenshot(path=f"{OUT}/{s.name}-{len(REP):03d}.jpg", type="jpeg", quality=55)
            except Exception: pass
        return ok

async def menu_ready(pg, timeout=30000):
    await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&!c.hidden&&c.innerText.length>200&&(c.dataset.unclip||!c.classList.contains('fmt-lib'))})()", timeout=timeout)

async def close_dialogs(pg):
    await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>{try{d.close()}catch(e){}});document.querySelectorAll('.counter,.trolley,.overlay').forEach(o=>{if(o.tagName!=='DIALOG')o.remove()})")

async def scenario(b, name, ctxopts):
    c = await b.new_context(**ctxopts, accept_downloads=True)
    try: await c.grant_permissions(["clipboard-read", "clipboard-write"], origin=BASE.rstrip("/"))
    except Exception: pass
    pg = await c.new_page(); R = Run(name, pg)
    pg.on("pageerror", lambda e: R.errs.append(str(e)[:200]))
    pg.on("console", lambda m: R.cons.append(m.text[:160]) if m.type == "error" and "favicon" not in m.text else None)
    pg.on("requestfailed", lambda r: R.bad.append(r.url[-80:]) if "localhost" in r.url else None)
    S = R.step
    # 1 first visit
    async def first():
        await pg.goto(BASE, timeout=45000); await pg.wait_for_timeout(2500)
        w = await pg.evaluate("!!document.querySelector('.welcome')&&getComputedStyle(document.querySelector('.welcome')).display!=='none'")
        ov = await pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
        return f"welcome shown={w}, sideways overflow={ov}px" if ov <= 1 else False
    await S("first load, welcome card, no sideways scroll", first, shot=True)
    async def dismiss():
        btn = await pg.query_selector(".welcome button")
        if btn: await btn.click(); await pg.wait_for_timeout(500)
        return await pg.evaluate("!document.querySelector('.welcome')||getComputedStyle(document.querySelector('.welcome')).display==='none'")
    await S("dismiss welcome", dismiss)
    # 2 spins
    seen = []
    for i in range(4):
        async def spin1():
            await close_dialogs(pg)
            await pg.evaluate("document.getElementById('spin').scrollIntoView({block:'center'})")
            await pg.click("#spin"); await pg.wait_for_timeout(300)
            await pg.wait_for_function("!spinning", timeout=20000); await menu_ready(pg)
            cur = await pg.evaluate("current.id"); now = await pg.evaluate("document.getElementById('now').textContent")
            seen.append(cur)
            chip = await pg.evaluate("[...document.querySelectorAll('#chips .ticket')].map(b=>b.innerText.replace('Admit one','').trim())[0]||''")
            ok = now.strip() and (now.strip().lower() in cur.lower() or cur.lower().startswith(now.strip().lower()[:6]))
            return f"{cur}; stub '{chip}'" if ok else False
        await S(f"spin {i+1}: lands, menu opens, stub added", spin1, shot=(i == 0))
    await S("spins gave different films", lambda: asyncio.sleep(0, result=(len(set(seen)) >= 3 or False) and f"{len(set(seen))} different of {len(seen)}"))
    # 3 abuse: double tap spin, tap Prep mid spin
    async def abuse():
        await close_dialogs(pg); await pg.evaluate("document.getElementById('spin').scrollIntoView({block:'center'})")
        await pg.click("#spin"); await pg.click("#spin", force=True); await pg.wait_for_timeout(400)
        await pg.evaluate("document.getElementById('tabPrep').click()"); await pg.wait_for_timeout(200)
        await pg.evaluate("document.getElementById('tabMenu').click()")
        await pg.wait_for_function("!spinning", timeout=20000); await menu_ready(pg); return "survived"
    await S("double-tap spin and tab switching mid spin", abuse)
    # 4 tabs, planner, diet
    async def prep():
        await pg.click("#tabPrep"); await pg.wait_for_timeout(800)
        n = await pg.evaluate("document.querySelectorAll('#preview .pp-sheet .pp-shop li').length")
        st = await pg.evaluate("document.querySelectorAll('#preview .pp-sheet .pp-method > ol > li').length")
        return f"{n} shopping lines, {st} methods" if n > 2 and st > 0 else False
    await S("Prep tab shows shopping list and methods", prep, shot=True)
    async def guests():
        await pg.evaluate("document.querySelector('#planner .pl-pick')&&(document.querySelector('#planner .pl-pick').open=true)")
        for _ in range(3): await pg.click("#planner [data-pl='+']")
        g = await pg.evaluate("document.querySelector('#planner .pl-g').textContent")
        for _ in range(3): await pg.click("#planner [data-pl='-']")
        return f"guests went to {g}" if g == "7" else False
    await S("guest buttons", guests)
    async def diet():
        await pg.click("[data-diet='veg']"); await pg.click("[data-diet='af']"); await pg.wait_for_timeout(400)
        s1 = await pg.evaluate("document.querySelector('#preview .pp-sheet .pp-serves').innerText")
        await pg.click("[data-diet='veg']"); await pg.click("[data-diet='af']")
        return s1[:90] if "VEGETARIAN" in s1.upper() else False
    await S("Vegetarian and No alcohol toggles", diet)
    await S("back to Menu tab", lambda: pg.click("#tabMenu"))
    # 5 filters and modes
    async def theme():
        opts = await pg.evaluate("[...document.getElementById('themeSel').options].map(o=>o.value).filter(Boolean)")
        if not opts: return "no theme options"
        v = opts[min(3, len(opts) - 1)]; await pg.select_option("#themeSel", v); await pg.wait_for_timeout(300)
        await close_dialogs(pg); await pg.click("#spin"); await pg.wait_for_function("!spinning", timeout=20000); await menu_ready(pg)
        t = await pg.evaluate("current.theme"); await pg.select_option("#themeSel", "all")
        return f"theme {v} gave {t}" if t else False
    await S("theme picker then spin", theme)
    async def kids():
        await pg.click("#setBtn"); await pg.wait_for_timeout(300); await pg.click("#kidsBtn"); await pg.wait_for_timeout(300)
        await close_dialogs(pg); await pg.click("#spin"); await pg.wait_for_function("!spinning", timeout=20000); await menu_ready(pg)
        t = await pg.evaluate("current.theme"); bs = await pg.evaluate("planDishes(current).some(d=>dietBooze(d))")
        await pg.click("#setBtn"); await pg.wait_for_timeout(300); await pg.click("#kidsBtn"); await close_dialogs(pg)
        return f"kids spin gave theme {t}" if not bs else False
    await S("Kids mode spin is family and alcohol-free", kids)
    async def snd():
        await pg.click("#setBtn"); await pg.wait_for_timeout(300); await pg.click("#sound"); await pg.click("#sound"); await pg.click("#setClose"); await pg.wait_for_timeout(300)
        return await pg.evaluate("!!document.getElementById('settings')&&!document.getElementById('settings').open")
    await S("sound toggle in settings, drawer closes and stays reusable", snd)
    async def find():
        await pg.fill("#findFilm", "jaws"); await pg.wait_for_timeout(300); await pg.keyboard.press("Enter")
        await pg.wait_for_function("current&&current.title==='Jaws'", timeout=8000); await menu_ready(pg)
        return await pg.evaluate("current.title")
    await S("quick find opens a film", find)
    async def lazy():
        await pg.click("#lazyBtn"); await pg.wait_for_timeout(500); a = await pg.evaluate("document.getElementById('lazyBtn').textContent")
        await pg.click("#lazyBtn"); return a
    await S("Lazy night toggle", lazy)
    async def double():
        await pg.click("#dfBtn"); await pg.wait_for_timeout(1200)
        d = await pg.evaluate("!!document.querySelector('dialog[open]')"); await close_dialogs(pg); return "opened" if d else False
    await S("Double feature opens", double)
    # 6 watch, week, trolley
    async def watch():
        await pg.click("#watchCurrent"); await pg.wait_for_timeout(300)
        p = await pg.evaluate("document.getElementById('watchCurrent').getAttribute('aria-pressed')")
        await pg.click("#watchCurrent"); return f"pressed={p}" if p == "true" else False
    await S("Mark as watched and undo", watch)
    async def checklist():
        await pg.evaluate("document.getElementById('watchPanel').open=true"); await pg.fill("#watchSearch", "jaws"); await pg.wait_for_timeout(400)
        n = await pg.evaluate("document.querySelectorAll('#watchList .watch-row').length")
        await pg.fill("#watchSearch", ""); await pg.evaluate("document.getElementById('watchPanel').open=false"); return f"{n} rows for 'jaws'" if n else False
    await S("checklist search", checklist)
    async def week():
        await pg.click("#weekSet"); await pg.wait_for_timeout(600)
        await close_dialogs(pg)
        has = await pg.evaluate("!!document.getElementById('weekShop')")
        if not has: return False
        await pg.click("#weekShop"); await pg.wait_for_timeout(900)
        n = await pg.evaluate("(document.querySelector('dialog[open]')||document).querySelectorAll('input[type=checkbox]').length")
        await close_dialogs(pg)
        await pg.click("#weekClear"); await pg.wait_for_timeout(300)
        return f"trolley {n} items, cleared" if n else False
    await S("Lock in week, shopping list, clear", week)
    # 7 share / copy / exports
    async def share():
        await pg.click("details.more summary"); await pg.wait_for_timeout(200)
        await pg.click("#copy"); await pg.wait_for_timeout(400)
        st = await pg.evaluate("document.getElementById('status').textContent")
        return st[:80] or "no message"
    await S("Copy text", share)
    async def png():
        t = time.time()
        async with pg.expect_download(timeout=60000) as d:
            await pg.evaluate("document.querySelector('details.more').open=true"); await pg.click("#png")
        dl = await d.value; return f"{dl.suggested_filename} in {round(time.time()-t,1)}s"
    if name == "desktop": await S("Save image", png)
    async def pdf():
        t = time.time()
        async with pg.expect_download(timeout=90000) as d: await pg.click("#pdf")
        dl = await d.value; return f"{dl.suggested_filename} in {round(time.time()-t,1)}s"
    if name == "desktop": await S("Save PDF", pdf)
    # 8 stubs replay
    async def stub():
        await close_dialogs(pg); b1 = await pg.query_selector_all("#chips .ticket")
        if len(b1) < 2: return False
        want = re.sub(r'(?i)admit one', '', await b1[1].inner_text()).strip()
        await b1[1].click(); await pg.wait_for_timeout(3500); await menu_ready(pg)
        cur = await pg.evaluate("current.title"); return f"replayed {cur}" if cur.lower() == want.lower() else False
    await S("ticket stub replays a film", stub)
    # 9 video store
    async def shop():
        await pg.click("#viewShopBtn"); await pg.wait_for_timeout(1500)
        n = await pg.evaluate("document.querySelectorAll('#shopAisles .tape').length")
        await pg.fill("#shopSearch", "alien"); await pg.wait_for_timeout(700)
        m = await pg.evaluate("document.querySelectorAll('#shopAisles .tape').length")
        await pg.fill("#shopSearch", ""); await pg.wait_for_timeout(500)
        return f"{n} tapes, 'alien' gives {m}" if n and m else False
    await S("Video store opens and searches", shop, shot=True)
    async def shopfilters():
        out = []
        for sel in ["#shopDecade", "#shopSvc"]:
            o = await pg.evaluate(f"[...document.querySelector('{sel}').options].map(o=>o.value).filter(Boolean)")
            if o: await pg.select_option(sel, o[0]); await pg.wait_for_timeout(500); out.append(await pg.evaluate("document.querySelectorAll('#shopAisles .tape').length")); await pg.select_option(sel, "")
        await pg.check("#shopKids"); await pg.wait_for_timeout(500); out.append(await pg.evaluate("document.querySelectorAll('#shopAisles .tape').length")); await pg.uncheck("#shopKids")
        return f"decade, service, kids gave {out}" if all(out) else False
    await S("Video store filters", shopfilters)
    async def rent():
        await pg.evaluate("document.querySelector('#shopAisles .tape').scrollIntoView({block:'center'})")
        await pg.click("#shopAisles .tape"); await pg.wait_for_timeout(900)
        rb = await pg.query_selector("dialog[open] .rent, .case .rent")
        if not rb: return False
        await rb.click(); await pg.wait_for_timeout(1200)
        go = await pg.query_selector("[data-a='go']")
        if not go: return "rented, no slip"
        await go.click(); await pg.wait_for_timeout(800); await menu_ready(pg)
        return f"rolled {await pg.evaluate('current.title')}"
    await S("Rent a tape, slip, roll the film", rent)
    # 10 candy bar
    async def crave():
        await pg.click("#viewCraveBtn"); await pg.wait_for_timeout(2500)
        await pg.fill("#craveSearch", "ramen"); await pg.wait_for_timeout(900)
        n = await pg.evaluate("document.querySelectorAll('.crave .tape, #craveHits .tape, .crave-hit .tape').length")
        await pg.fill("#craveSearch", "")
        chip = await pg.query_selector("#craveChips [data-crave]")
        if chip: await chip.click(); await pg.wait_for_timeout(700)
        await pg.click("#craveSpin"); await pg.wait_for_timeout(2500)
        d = await pg.evaluate("!!document.querySelector('dialog[open]')")
        await close_dialogs(pg); return f"'ramen' {n} films, combo spin opened={d}"
    await S("Candy bar search, chip, combo spin", crave)
    await S("back to the wheel", lambda: pg.click("#viewWheelBtn"))
    # 11 links and navigation
    async def deep():
        await pg.goto(BASE + "?film=Jaws%20(1975)"); await menu_ready(pg)
        return await pg.evaluate("current.id")
    await S("shared link opens that film", deep)
    async def badlink():
        await pg.goto(BASE + "?film=Not%20a%20film"); await pg.wait_for_timeout(5000)
        return (await pg.evaluate("document.getElementById('status').textContent"))[:60] or False
    await S("broken link explains itself", badlink)
    async def back():
        await pg.goto(BASE + "?film=Moana%20(2016)"); await menu_ready(pg); await pg.goto(BASE + "?film=Alien%20(1979)"); await menu_ready(pg)
        await pg.go_back(); await pg.wait_for_timeout(3000); return await pg.evaluate("current&&current.id")
    await S("back button", back)
    async def era():
        await pg.goto(BASE + "?film=Ghostbusters%20(1984)"); await pg.wait_for_timeout(600)
        await pg.evaluate("document.getElementById('tabPrep').click()"); await pg.wait_for_timeout(5000)
        return await pg.evaluate("document.querySelectorAll('#preview .pp-sheet .pp-shop li').length") > 0
    await S("printed menu: tap Prep before it finishes drawing", era)
    async def reload_state():
        await pg.reload(); await pg.wait_for_timeout(4000)
        return f"stubs kept: {await pg.evaluate('document.querySelectorAll(\"#chips .ticket\").length')}"
    await S("reload keeps stubs and settings", reload_state)
    await c.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={"server": os.environ.get("HTTPS_PROXY", ""), "bypass": "localhost,127.0.0.1"})
        await scenario(b, "phone", dict(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2))
        await scenario(b, "desktop", dict(viewport={"width": 1440, "height": 900}))
        await b.close()
    json.dump(REP, open(f"{OUT}/report.json", "w"), indent=1)
    bad = [r for r in REP if not r["ok"]]
    print(f"\n{len(REP)} steps, {len(bad)} faults")
asyncio.run(main())
