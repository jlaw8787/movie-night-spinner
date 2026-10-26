"""Functional sweep of every film (repo root, local server on 8795):
menu renders with no page errors, menu dishes match planner dishes, Prep tab shows planner,
shopping list, times and methods, guests scale the quantities, unticking empties the list,
and the tick-off shopping list opens with the same items.
python3 wip/genre/lib/funcsweep.py OUT.json [Film (Year) ...]"""
import asyncio, json, os, re, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
FILMS = sys.argv[2:] or [f"{f['title']} ({f['year']})" for f in json.load(open("data/films.json"))]
NUM = re.compile(r"(\d+(?:\.\d+)?)(?:\s*(\d)/(\d))?|(\d)/(\d)")

PROBE = """async()=>{
 const R={};const f=current;R.id=f&&f.id;
 const card=document.querySelector('#preview .mcard');R.cardText=(card&&card.innerText||'').length;
 R.cardImgs=card?[...card.querySelectorAll('img')].filter(i=>i.style.visibility!=='hidden'&&i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.getAttribute('src').slice(-40)):[];
 const m=f.menu||current.menu;const mm=(typeof current!=='undefined'&&current.menu)||null;
 R.menu=mm?['s','m','w','d'].flatMap(c=>(mm[c]||[]).map(x=>x.n)):null;
 R.r2=f._r2&&f._r2.dishes?f._r2.dishes.map(d=>d.n):null;
 document.getElementById('tabPrep').click();for(let i=0;i<50;i++){const pp=[...document.querySelectorAll('#preview .mcard')].find(e=>e.classList.contains('pp-sheet'));if(pp&&!pp.hidden&&pp.querySelector('.pp-serves,.pp-cols'))break;await new Promise(r=>setTimeout(r,100))}await new Promise(r=>setTimeout(r,200));
 const pl=document.getElementById('planner');R.planner=!!pl&&!pl.hidden;
 const prep=[...document.querySelectorAll('#preview .mcard')].find(e=>e.classList.contains('pp-sheet'));
 const read=()=>({shop:[...prep.querySelectorAll('.pp-shop li')].map(li=>li.innerText.trim()),
   steps:[...prep.querySelectorAll('.pp-method > ol > li')].map(li=>({n:(li.querySelector('b')||{}).innerText||'',t:(li.querySelector('.pp-time')||{}).innerText||'',
     how:([...li.querySelectorAll(':scope > span')].pop()||{}).innerText||''})),
   serves:(prep.querySelector('.pp-serves')||{}).innerText||'',empty:/Tick at least one dish/.test(prep.innerText)});
 R.prepVisible=!!prep&&!prep.hidden&&prep.offsetHeight>100;
 if(!prep)return R;
 R.p4=read();
 const rr=prep.getBoundingClientRect(),inner=prep.querySelector('.mc-in');R.prepH=Math.round(rr.height);
 R.overflow=inner?Math.max(0,inner.scrollHeight-inner.clientHeight):0;
 if(R.planner){
   const plus=pl.querySelector('[data-pl="+"]');for(let i=0;i<4;i++){plus.click();await new Promise(r=>setTimeout(r,60))}
   R.g8=(pl.querySelector('.pl-g')||{}).textContent;R.p8=read();
   const minus=pl.querySelector('[data-pl="-"]');for(let i=0;i<4;i++){minus.click();await new Promise(r=>setTimeout(r,60))}
   const boxes=[...pl.querySelectorAll('input[data-dish]')];R.boxes=boxes.length;
   boxes.forEach(b=>{if(b.checked){b.checked=false;b.dispatchEvent(new Event('change',{bubbles:true}))}});await new Promise(r=>setTimeout(r,150));
   R.p0=read();
   boxes.forEach(b=>{b.checked=true;b.dispatchEvent(new Event('change',{bubbles:true}))});await new Promise(r=>setTimeout(r,150));
   R.pBack=read().shop.length;
 }
 try{openTrolley(current);await new Promise(r=>setTimeout(r,400));const d=[...document.querySelectorAll('dialog[open], .modal, [role=dialog]')].pop();
   R.trolley=d?d.querySelectorAll('input[type=checkbox]').length:-1;if(d){(typeof dismissModal==='function')?dismissModal(d):d.remove()}}catch(e){R.trolleyErr=String(e).slice(0,120)}
 return R}"""

def amount(s):
    m = re.match(r"\s*(\d+(?:\.\d+)?)(?:\s+(\d)/(\d))?|\s*(\d)/(\d)", s)
    if not m: return None
    if m.group(4): return int(m.group(4)) / int(m.group(5))
    v = float(m.group(1))
    if m.group(2): v += int(m.group(2)) / int(m.group(3))
    unit = s[m.end():m.end() + 3].strip().lower()
    if unit.startswith("kg") or (unit.startswith("l") and not unit.startswith("lo") and len(unit) < 3 and unit[:1] == "l" and (len(unit) == 1 or not unit[1].isalpha())): v *= 1000
    return v

async def worker(b, q, res):
    c = await b.new_context(viewport={"width": 1400, "height": 1000})
    await c.add_init_script("try{localStorage.setItem('mns-welcome','1')}catch(e){}")
    while q:
        film = q.pop(0); R = {"film": film, "errors": []}
        pg = await c.new_page()
        pg.on("pageerror", lambda e, R=R: R["errors"].append(str(e)[:160]))
        pg.on("console", lambda m, R=R: R["errors"].append("console: " + m.text[:160]) if m.type == "error" and "Failed to load resource" not in m.text else None)
        try:
            await pg.goto("http://localhost:8795/?film=" + quote(film), timeout=45000)
            try:
                await pg.wait_for_function("(()=>{const c=document.querySelector('#preview .mcard');return c&&c.innerText.length>200&&(c.dataset.unclip||!c.classList.contains('fmt-lib'))})()", timeout=30000)
            except Exception: R["errors"].append("menu did not finish rendering in 30s")
            await pg.wait_for_timeout(400)
            await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
            R.update(await pg.evaluate(PROBE))
        except Exception as e:
            R["errors"].append("probe: " + str(e)[:200])
        res.append(R); await pg.close()
        if len(res) % 50 == 0:
            print(len(res), flush=True); json.dump(res, open(OUT, "w"))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={"server": os.environ.get("HTTPS_PROXY", ""), "bypass": "localhost,127.0.0.1"})
        q = FILMS[:]; res = []
        await asyncio.gather(*[worker(b, q, res) for _ in range(6)])
        await b.close()
    json.dump(res, open(OUT, "w"), indent=0)

asyncio.run(main())
