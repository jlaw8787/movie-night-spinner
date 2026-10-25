"""Check every era menu on the local site for text that spills past its printed face.
Usage: python3 overflow_check.py ["Film (Year)" ...]   (no args = every film in FMT_INDEX)
Prints one line per film with any text element that runs past the face edge or is clipped."""
import asyncio, os, sys, re, json, subprocess, time
from urllib.parse import quote
from playwright.async_api import async_playwright
REPO = '/home/claude/polish'; PORT = 8795
if subprocess.run(['curl', '-s', '-o', '/dev/null', f'http://localhost:{PORT}/']).returncode:
    subprocess.Popen(['python3', '-m', 'http.server', str(PORT)], cwd=REPO, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1.5)
JS = r"""(()=>{const out=[];document.querySelectorAll('#preview .fx-face').forEach(f=>{
 const fr=f.getBoundingClientRect(),k=fr.width/f.offsetWidth||1;
 f.querySelectorAll('*').forEach(e=>{
  if(!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
  const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;
  const r=e.getBoundingClientRect();if(!r.width||!r.height)return;
  const over=Math.max(r.bottom-fr.bottom,r.right-fr.right,fr.top-r.top,fr.left-r.left)/k;
  const clip=(e.scrollHeight-e.clientHeight>4&&/hidden|clip/.test(cs.overflow+cs.overflowY))?e.scrollHeight-e.clientHeight:0;
  if(over>3||clip)out.push(`face ${f.dataset.face}: "${e.textContent.trim().slice(0,40)}" ${over>3?'spills '+Math.round(over)+'px':'clipped '+clip+'px'}`)})});
 return out})()"""
async def main():
    films = sys.argv[1:]
    if not films:
        src = open(f'{REPO}/formats-core.js').read()
        films = list(json.loads(re.search(r'const FMT_INDEX=(\{.*?\});', src).group(1)).keys())
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={'server': os.environ.get('HTTPS_PROXY', ''), 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': 1400, 'height': 1000})
        bad = 0
        for film in films:
            pg = await ctx.new_page()
            await pg.goto(f'http://localhost:{PORT}/?film=' + quote(film)); await pg.wait_for_timeout(5000)
            await pg.evaluate("document.fonts.ready")
            issues = await pg.evaluate(JS)
            if issues: bad += 1; print(f'FAIL {film}: ' + ' | '.join(issues[:6]) + (f' (+{len(issues)-6} more)' if len(issues) > 6 else ''), flush=True)
            await pg.close()
        print(f'{len(films)} films checked, {bad} with spill', flush=True)
        await b.close()
asyncio.run(main())
