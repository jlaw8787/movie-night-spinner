"""Open films on the local site in a real browser and check the era menu.
Usage: python3 site_check.py "Film (Year)" ["Film (Year)" ...]
Saves wip/print/kit/out/<slug>-site.png (desktop preview), <slug>-phone.png and <slug>-site.pdf
(the site's own PDF download), and prints page errors, PDF page count and size."""
import asyncio, os, sys, subprocess, re, time
from urllib.parse import quote
from playwright.async_api import async_playwright
REPO = '/home/claude/polish'
OUT = os.path.join(REPO, 'wip/print/kit/out'); os.makedirs(OUT, exist_ok=True)
PORT = 8795
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
if subprocess.run(['curl', '-s', '-o', '/dev/null', f'http://localhost:{PORT}/']).returncode:
    subprocess.Popen(['python3', '-m', 'http.server', str(PORT)], cwd=REPO, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1.5)

async def one(b, film):
    s = slug(film); res = {'film': film}
    ctx = await b.new_context(viewport={'width': 1400, 'height': 1000}, accept_downloads=True)
    pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:120]))
    await pg.goto(f'http://localhost:{PORT}/?film=' + quote(film)); await pg.wait_for_timeout(7000)
    await pg.evaluate("document.querySelectorAll('.welcome').forEach(e=>e.remove())")
    card = await pg.query_selector('#preview .mcard')
    res['card'] = await pg.evaluate("(()=>{const c=document.querySelector('#preview .mcard');return c.className+' '+(c.dataset.w||'')+'x'+(c.dataset.h||'')})()")
    await (await pg.query_selector('#preview')).screenshot(path=f'{OUT}/{s}-site.png')
    try:
        async with pg.expect_download(timeout=90000) as dl:
            await pg.click('#pdf')
        d = await dl.value; p = f'{OUT}/{s}-site.pdf'; await d.save_as(p)
        info = subprocess.run(['pdfinfo', p], capture_output=True, text=True).stdout
        res['pdf'] = ' '.join(l for l in info.splitlines() if l.startswith(('Pages', 'Page size')))
    except Exception as e:
        res['pdf'] = 'NO PDF: ' + str(e)[:100]
    res['errors'] = errs[:3]
    m = await (await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)).new_page()
    await m.goto(f'http://localhost:{PORT}/?film=' + quote(film)); await m.wait_for_timeout(6000)
    await m.evaluate("document.querySelectorAll('.welcome').forEach(e=>e.remove());(document.getElementById('fmtPhone')||document.body).scrollIntoView()")
    el = await m.query_selector('#fmtPhone')
    if el and await el.is_visible(): await el.screenshot(path=f'{OUT}/{s}-phone.png')
    await ctx.close(); await m.context.close()
    print(res, flush=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ.get('HTTPS_PROXY', ''), 'bypass': 'localhost,127.0.0.1'})
        for f in sys.argv[1:]: await one(b, f)
        await b.close()
asyncio.run(main())
