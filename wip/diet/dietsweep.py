"""Browser sweep with the diet settings on (repo root, local server on 8795).
For every film and each mode (veg, af, veg+af) checks: no page errors, the planner ticks exactly the dishes
deepcheck.resolve says, the method shows those dish names, no Meat/Seafood (veg) or Bottle shop (af) items
in the planned dishes, the shopping list is not empty.
python3 wip/diet/dietsweep.py OUT.json [@list.json]"""
import asyncio, json, os, re, sys, glob
from urllib.parse import quote
from playwright.async_api import async_playwright
sys.path.insert(0, "wip/diet"); sys.path.insert(0, "wip/genre/lib")
from deepcheck import resolve
OUT = sys.argv[1]
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
FILMS = json.load(open(sys.argv[2][1:])) if len(sys.argv) > 2 else [f"{f['title']} ({f['year']})" for f in json.load(open("data/films.json"))]
MODES = {"veg": {"veg": True, "af": False}, "af": {"veg": False, "af": True}, "veg+af": {"veg": True, "af": True}}
PROBE = """async()=>{const R={};document.getElementById('tabPrep').click();
 for(let i=0;i<50;i++){const pp=document.querySelector('#preview .pp-sheet');if(pp&&pp.querySelector('.pp-serves'))break;await new Promise(r=>setTimeout(r,100))}
 await new Promise(r=>setTimeout(r,200));const pp=document.querySelector('#preview .pp-sheet');
 R.serves=(pp.querySelector('.pp-serves')||{}).innerText||'';
 R.shop=pp.querySelectorAll('.pp-shop li').length;
 R.method=[...pp.querySelectorAll('.pp-method > ol > li b')].map(b=>b.innerText.trim());
 R.planned=planDishes(current).map(d=>({n:d.n,tag:d.tag||'',aisles:[...new Set((d.ingredients||[]).map(i=>i.aisle))]}));
 R.ticked=[...document.querySelectorAll('#planner input[data-dish]')].filter(b=>b.checked).length;
 R.tags=[...document.querySelectorAll('#planner .pl-tag')].map(t=>t.textContent.trim());
 return R}"""
async def worker(b, q, res, mode):
    c = await b.new_context(viewport={"width": 1400, "height": 1000})
    await c.add_init_script("try{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-diet',%s)}catch(e){}" % json.dumps(json.dumps(MODES[mode])))
    while q:
        film = q.pop(0); R = {"film": film, "mode": mode, "errors": [], "faults": []}
        pg = await c.new_page()
        pg.on("pageerror", lambda e, R=R: R["errors"].append((getattr(e, "stack", None) or str(e))[:500]))
        try:
            await pg.goto("http://localhost:8795/?film=" + quote(film), timeout=45000)
            await pg.wait_for_function("typeof current!=='undefined'&&current&&current._r2", timeout=30000)
            await pg.wait_for_timeout(300); await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
            R.update(await pg.evaluate(PROBE))
            ds = json.load(open(f"data/recipes2/{slug(film)}.json"))["dishes"]; v, a = MODES[mode]["veg"], MODES[mode]["af"]
            want = [r["n"] for r in (resolve(d, v, a) for d in ds) if not r.get("blocked")]
            got = [d["n"] for d in R["planned"]]
            if got != want: R["faults"].append(f"planned {got} want {want}")
            if [m.lower() for m in R["method"]] != [w.lower() for w in want]: R["faults"].append(f"method {R['method']}")
            for d in R["planned"]:
                if v and ("Meat" in d["aisles"] or "Seafood" in d["aisles"]): R["faults"].append("meat in " + d["n"])
                if a and "Bottle shop" in d["aisles"]: R["faults"].append("alcohol in " + d["n"])
            if want and not R["shop"]: R["faults"].append("empty shopping list")
            if R["ticked"] != len(want): R["faults"].append(f"ticked {R['ticked']} of {len(want)}")
        except Exception as e:
            R["faults"].append("probe: " + str(e)[:200])
        if R["errors"]: R["faults"].append("page errors")
        res.append(R); await pg.close()
        if len(res) % 100 == 0: print(len(res), flush=True); json.dump(res, open(OUT, "w"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(proxy={"server": os.environ.get("HTTPS_PROXY", ""), "bypass": "localhost,127.0.0.1"})
        res = []
        for mode in MODES:
            q = FILMS[:]
            await asyncio.gather(*[worker(b, q, res, mode) for _ in range(6)])
        await b.close()
    json.dump(res, open(OUT, "w"), indent=0)
    bad = [r for r in res if r["faults"]]
    print(f"{len(res)} runs, {len(bad)} with faults")
    for r in bad[:25]: print(" ", r["mode"], r["film"], r["faults"][:2], r["errors"][:1])
asyncio.run(main())
