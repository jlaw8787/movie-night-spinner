"""Finding films: Find a film and the Video store search forgive spelling, apostrophes and numbers,
Find a film follows kids mode, and series notes say how many films are in the store.
Repo root, server on 8795.  python3 wip/genre/lib/findcheck.py SHOTDIR"""
import asyncio, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]; R = []
def rec(n, ok, note=""): R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
CASES = [("singing in the rain", "Singin' in the Rain"), ("breakfast at tiffanys", "Breakfast at Tiffany's"), ("godfather 2", "The Godfather Part II"),
         ("harry poter", "Harry Potter"), ("amelie", "Amélie"), ("e.t.", "E.T."), ("alien", "Alien"), ("rocky 4", "Rocky IV"), ("back to the futur", "Back to the Future")]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); c = await b.new_context(viewport={"width": 1440, "height": 900}); pg = await c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        await pg.goto("http://localhost:8795/"); await pg.evaluate("localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
        await pg.reload(wait_until="networkidle"); await pg.wait_for_timeout(2500)
        for q, want in CASES:
            await pg.fill("#findFilm", ""); await pg.type("#findFilm", q); await pg.wait_for_timeout(250)
            first = await pg.evaluate("(document.querySelector('#findList [data-i] span')||{}).textContent||''")
            rec(f"Find a film: '{q}' finds {want}", first.startswith(want), first)
        await pg.fill("#findFilm", "")
        await pg.click("#viewShopBtn"); await pg.wait_for_timeout(900)
        for q, want in CASES[:3]:
            await pg.fill("#shopSearch", q); await pg.wait_for_timeout(700)
            ids = await pg.evaluate("[...document.querySelectorAll('#shopAisles .tape')].map(t=>t.dataset.id)")
            rec(f"Video store: '{q}' finds {want}", any(i.startswith(want) for i in ids), str(ids[:3]))
        await pg.fill("#shopSearch", "")
        await pg.click("#viewWheelBtn"); await pg.wait_for_timeout(500)
        await pg.evaluate("setKids(true)"); await pg.wait_for_timeout(400)
        await pg.fill("#findFilm", ""); await pg.type("#findFilm", "scarface"); await pg.wait_for_timeout(300)
        hits = await pg.evaluate("[...document.querySelectorAll('#findList [data-i] span')].map(s=>s.textContent)")
        rec("kids mode: Find a film leaves out grown-up films", "Scarface" not in hits, str(hits))
        await pg.fill("#findFilm", ""); await pg.type("#findFilm", "toy story"); await pg.wait_for_timeout(300)
        hits = await pg.evaluate("[...document.querySelectorAll('#findList [data-i] span')].map(s=>s.textContent)")
        rec("kids mode: Find a film still finds kids films", any(h.startswith("Toy Story") for h in hits), str(hits[:2]))
        await pg.evaluate("setKids(false)")
        await pg.goto("http://localhost:8795/?film=" + quote("Alien (1979)"), wait_until="networkidle"); await pg.wait_for_timeout(3500)
        t = await pg.evaluate("document.getElementById('seriesNote').innerText")
        rec("series note says how many are in the store", "films in the store" in t and "Alien" in t, t[:80])
        rec("no page errors", not errs, "; ".join(errs[:2]))
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
