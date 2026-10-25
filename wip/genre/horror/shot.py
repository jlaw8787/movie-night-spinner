"""Render horror genre proofs: one PNG per face per sample film, plus the overflow check from kit/overflow_check.py.
Usage: python3 shot.py   (server on :8795 from the repo root)"""
import asyncio, os, re, subprocess, time
from urllib.parse import quote
from playwright.async_api import async_playwright
REPO = '/home/claude/polish'; PORT = 8795; OUT = f'{REPO}/wip/genre/horror'
if subprocess.run(['curl', '-s', '-o', '/dev/null', f'http://localhost:{PORT}/']).returncode:
    subprocess.Popen(['python3', '-m', 'http.server', str(PORT)], cwd=REPO, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1.5)
FILMS = ["C.H.U.D. (1984)", "An American Werewolf in London (1981)", "Night of the Living Dead (1968)", "IT (2017)", "The Silence of the Lambs (1991)", "Halloween (1978)", None]
CHECK = r"""(()=>{const out=[];document.querySelectorAll('#preview .fx-face').forEach(f=>{
 const fr=f.getBoundingClientRect();
 f.querySelectorAll('*').forEach(e=>{
  if(!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
  const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;
  if(e.closest('[style*="display: none"]'))return;
  const r=e.getBoundingClientRect();if(!r.width||!r.height)return;
  const over=Math.max(r.bottom-fr.bottom,r.right-fr.right,fr.top-r.top,fr.left-r.left);
  if(over>3)out.push(`face ${f.dataset.face}: "${e.textContent.trim().slice(0,40)}" spills ${Math.round(over)}px`)});
 const m=f.querySelector('[data-h="menu"]');if(m&&(m.scrollWidth>m.clientWidth+1||m.scrollHeight>m.clientHeight+1))out.push('face 2: menu columns overflow');
 const t=f.querySelector('[data-h="title"]');if(t){const b=t.closest('[data-h="info"]')||t.parentElement;if(b.scrollHeight>b.clientHeight+1)out.push('face 1: title box overflow')}});
 const sizes=[...document.querySelectorAll('#preview .fx-face *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&e.offsetParent).map(e=>parseFloat(getComputedStyle(e).fontSize));
 out.push('min font '+Math.min(...sizes)+'px');return out})()"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ.get('HTTPS_PROXY', ''), 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': 1800, 'height': 1200}, device_scale_factor=2)
        for film in FILMS:
            pg = await ctx.new_page()
            url = f'http://localhost:{PORT}/wip/genre/horror/harness.html?' + (f'film={quote(film)}' if film else 'stress=1')
            await pg.goto(url); await pg.wait_for_selector('body[data-ready="1"]', timeout=60000); await pg.wait_for_timeout(800)
            print(film or 'STRESS', await pg.evaluate(CHECK), await pg.evaluate("[...document.querySelectorAll('[data-h=fill]')].map(e=>e.style.display+' '+e.style.top)"), flush=True)
            name = re.sub(r'[^a-z0-9]+', '-', (film or 'stress 60 char title 16 items').lower()).strip('-')
            for old in os.listdir(OUT):
                if old.startswith(f'proof-{name}-'): os.remove(f'{OUT}/{old}')
            faces = [e for e in await pg.query_selector_all('.fx-face') if await e.is_visible()]
            for i, el in enumerate(faces):
                await el.screenshot(path=f'{OUT}/proof-{name}-{["front", "back"][i] if i < 2 else f"back-continued-{i-1}"}.png')
            await pg.close()
        await b.close()
asyncio.run(main())
