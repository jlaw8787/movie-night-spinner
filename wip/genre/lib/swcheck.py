"""Offline worker check: film fingerprints, the lasting film store, offline fallback, carry-over on app update.
Repo root, local server on 8795. python3 wip/genre/lib/swcheck.py   (touches sw.js briefly to fake an update, then restores it)"""
import asyncio, os, shutil, time
from urllib.parse import quote
from playwright.async_api import async_playwright
B = "http://localhost:8795/"
R = []
def rec(n, ok, note=""):
    R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 390, "height": 844})
        await ctx.add_init_script("localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
        pg = await ctx.new_page()
        await pg.goto(B, wait_until="networkidle")
        await pg.evaluate("navigator.serviceWorker.register('sw.js')")
        await pg.wait_for_function("navigator.serviceWorker.controller||null", timeout=15000) if False else None
        await pg.wait_for_timeout(2500); await pg.reload(wait_until="networkidle"); await pg.wait_for_timeout(1500)
        ctrl = await pg.evaluate("!!navigator.serviceWorker.controller")
        rec("worker controls the page", ctrl)
        await pg.goto(B + "?film=" + quote("Jaws (1975)"), wait_until="networkidle"); await pg.wait_for_timeout(3000)
        info = await pg.evaluate("""(async()=>{const c=await caches.open('mns-films');const k=(await c.keys()).map(r=>new URL(r.url).pathname+new URL(r.url).search);return {keys:k.filter(x=>x.includes('jaws')),v:FILMS.find(f=>f.id==='Jaws (1975)').v}})()""")
        rec("film saved in the lasting store with its fingerprint", any(("?v=" + info["v"]) in k for k in info["keys"]), str(info))
        # a changed film (new fingerprint) is fetched fresh and replaces the old copy
        n = await pg.evaluate("""(async()=>{await fetch('data/film/jaws-1975.json?v=newer123');const c=await caches.open('mns-films');return (await c.keys()).filter(r=>r.url.includes('jaws-1975')).map(r=>new URL(r.url).search)})()""")
        rec("changed film replaces the old copy, one copy kept", n == ["?v=newer123"], str(n))
        # offline: a request with an unknown fingerprint still gets the saved copy
        await ctx.set_offline(True)
        ok = await pg.evaluate("""(async()=>{try{const r=await fetch('data/film/jaws-1975.json?v=evennewer');const d=await r.json();return !!(d&&(d.S||d.r2))}catch(e){return 'ERR '+e}})()""")
        rec("offline falls back to the saved copy", ok is True, str(ok))
        pool = await pg.evaluate("(async()=>{await savedScan();return spinPool().map(f=>f.id).includes('Jaws (1975)')})()")
        rec("offline spins can land on the saved film", pool)
        await ctx.set_offline(False)
        # fake an app update: plant a film in an old-style store, change sw.js, let the new worker activate
        await pg.evaluate("""(async()=>{const c=await caches.open('mns-oldversion');const r=await fetch('data/film/moana-2016.json');await c.put('data/film/moana-2016.json',r)})()""")
        shutil.copy("sw.js", "/tmp/sw.js.bak")
        try:
            with open("sw.js", "a") as f: f.write("\n// update test " + str(time.time()) + "\n")
            await pg.evaluate("navigator.serviceWorker.getRegistration().then(r=>r.update())")
            await pg.wait_for_timeout(4000)
            st = await pg.evaluate("""(async()=>{const ks=await caches.keys();const c=await caches.open('mns-films');const m=await c.match('data/film/moana-2016.json',{ignoreSearch:true});const j=await c.match('data/film/jaws-1975.json',{ignoreSearch:true});return {ks,moana:!!m,jaws:!!j}})()""")
            rec("app update keeps saved films and carries old ones over", st["moana"] and st["jaws"] and "mns-oldversion" not in st["ks"], str(st))
        finally:
            shutil.copy("/tmp/sw.js.bak", "sw.js")
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
