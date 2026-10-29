"""Printing works: the browser's own Print gives the menu and prep sheet on A4 (not a blank page),
the Save PDF file is all A4 pages, the button shows progress while it builds, and on a phone a tap
on the menu opens it big with zoom. Repo root, server on 8795.  python3 wip/genre/lib/printcheck.py SHOTDIR"""
import asyncio, json, subprocess, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]; R = []
def rec(n, ok, note=""): R.append(ok); print(("OK   " if ok else "FAULT"), n, note, flush=True)
def pdfpages(path):
    info = subprocess.run(["pdfinfo", "-f", "1", "-l", "20", path], capture_output=True, text=True).stdout
    sizes = [l.split(":", 1)[1].strip() for l in info.splitlines() if l.startswith("Page") and "size" in l]
    return sizes
def inkshare(path, page):
    subprocess.run(["pdftoppm", "-r", "20", "-f", str(page), "-l", str(page), "-gray", "-png", path, f"{path}.p"], check=True)
    import glob, struct, zlib
    f = sorted(glob.glob(f"{path}.p*.png"))[-1]
    from PIL import Image
    im = Image.open(f).convert("L"); px = list(im.get_flattened_data()) if hasattr(im,"get_flattened_data") else list(im.getdata()); return sum(1 for v in px if v < 235) / len(px)
async def ready(pg, fid):
    await pg.goto("http://localhost:8795/?film=" + quote(fid), wait_until="networkidle")
    await pg.wait_for_function(f"typeof current!=='undefined'&&current&&current.id==={json.dumps(fid)}&&current._r2", timeout=30000); await pg.wait_for_timeout(5000)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for fid in ("Home Alone (1990)", "The Godfather (1972)", "Valentine's Day (2010)"):
            c = await b.new_context(viewport={"width": 1440, "height": 900}, accept_downloads=True); pg = await c.new_page()
            await pg.goto("http://localhost:8795/"); await pg.evaluate("localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
            await ready(pg, fid); tag = fid.split(" (")[0].replace(" ", "").replace("'", "")
            # the browser's own Print (no button pressed first)
            await pg.evaluate("window.dispatchEvent(new Event('beforeprint'))")
            n = await pg.evaluate("document.querySelectorAll('#printArea .print-page').length")
            await pg.emulate_media(media="print"); path = f"{OUT}/print-{tag}.pdf"
            await pg.pdf(path=path, prefer_css_page_size=True, print_background=True); await pg.emulate_media(media="screen")
            sizes = pdfpages(path); ink = inkshare(path, 1)
            rec(f"{fid}: browser Print gives the menu and prep sheet", n >= 2 and len(sizes) == n and ink > 0.05, f"{n} pages, sizes {sizes}, ink {ink:.2f}")
            rec(f"{fid}: browser Print pages are A4", all("(A4)" in s for s in sizes), str(sizes))
            await pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
            # Save PDF: progress, then A4 pages
            await pg.evaluate("document.getElementById('pdf').scrollIntoView({block:'center'})")
            async with pg.expect_download(timeout=120000) as dl:
                await pg.click("#pdf"); await pg.wait_for_timeout(400)
                busy = await pg.evaluate("[document.getElementById('pdf').textContent,document.getElementById('pdf').classList.contains('busy')]")
            d = await dl.value; path2 = f"{OUT}/save-{tag}.pdf"; await d.save_as(path2)
            sizes = pdfpages(path2)
            rec(f"{fid}: Save PDF shows progress on the button", busy[1] and busy[0].startswith("Making your PDF"), busy[0])
            rec(f"{fid}: Save PDF is all A4", sizes and all("(A4)" in s for s in sizes), str(sizes))
            back = await pg.evaluate("document.getElementById('pdf').textContent")
            rec(f"{fid}: button label comes back", back == "Save PDF (menu + prep)", back)
            await c.close()
        # phone: tap to enlarge a standard menu
        c = await b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2); pg = await c.new_page()
        await pg.goto("http://localhost:8795/"); await pg.evaluate("localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')")
        await ready(pg, "Valentine's Day (2010)")
        await pg.evaluate("document.querySelector('#preview .mcard').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(300)
        await pg.tap("#preview .mcard"); await pg.wait_for_timeout(800)
        st = await pg.evaluate("(()=>{const o=document.querySelector('dialog.zoomview[open]');if(!o)return null;const z=+getComputedStyle(o.querySelector('.zv-in')).zoom;const m=o.querySelector('.zv-in .mcard');return [z,m.getBoundingClientRect().width,innerWidth]})()")
        rec("phone: tapping the menu opens it big", st and st[1] * (1 if st[0] == 1 else 1) > st[2] * 1.3, str(st))
        await pg.screenshot(path=f"{OUT}/zoom-phone.png")
        await pg.click("dialog.zoomview [data-z='fit']"); await pg.wait_for_timeout(300)
        w = await pg.evaluate("document.querySelector('dialog.zoomview .zv-in .mcard').getBoundingClientRect().width")
        rec("phone: Fit shrinks it to the screen", w <= 392, str(w))
        await pg.click("dialog.zoomview .modal-x"); await pg.wait_for_timeout(400)
        rec("phone: the X closes it", not await pg.evaluate("!!document.querySelector('dialog.zoomview[open]')"))
        await b.close()
    print(len(R), "checks,", R.count(False), "faults")
asyncio.run(main())
