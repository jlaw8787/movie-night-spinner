"""Hand-built menus as they really render (real fonts, real card): text that runs into other text
or off the page with both toggles on, that wasn't there with them off. Repo root, server on 8795.
python3 wip/genre/lib/livefit.py OUT.json"""
import asyncio, json, sys
from urllib.parse import quote
from playwright.async_api import async_playwright
OUT = sys.argv[1]
MEASURE = """()=>{const card=document.querySelector('#preview .mcard');if(!card)return null;const hits=new Set();
 (card.querySelector('.fx-face')?[...card.querySelectorAll('.fx-face')]:[card]).forEach((face,fi)=>{const fr=face.getBoundingClientRect(),sc=fr.width/face.offsetWidth||1;const boxes=[];const w=document.createTreeWalker(face,NodeFilter.SHOW_TEXT);let n;
  while(n=w.nextNode()){const t=n.nodeValue.trim();if(t.length<2)continue;const el=n.parentElement;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0)continue;
   const rg=document.createRange();rg.selectNodeContents(n);for(const r of rg.getClientRects()){if(r.width<1||r.height<1)continue;boxes.push({t,x:(r.left-fr.left)/sc,y:(r.top-fr.top)/sc,w:r.width/sc,h:r.height/sc,out:r.right>fr.right+2||r.bottom>fr.bottom+2})}
   if(el.scrollWidth>el.clientWidth+2&&cs.overflowX!=='visible')hits.add('CLIPPED: '+t.slice(0,50))}
  for(let i=0;i<boxes.length;i++){const a=boxes[i];if(a.out)hits.add('OFF PAGE: '+a.t.slice(0,50));for(let j=i+1;j<boxes.length;j++){const b=boxes[j];if(a.t===b.t)continue;
   const ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(ox>2&&oy>Math.min(a.h,b.h)*0.3)hits.add('OVERLAP: '+[a.t.slice(0,40),b.t.slice(0,40)].sort().join(' | '))}}});
 return [...hits]}"""
async def run(b, films, diet):
    out = {}
    c = await b.new_context(viewport={"width": 1440, "height": 900}); pg = await c.new_page()
    await pg.goto("http://localhost:8795/"); await pg.evaluate(f"localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0');localStorage.setItem('mns-diet',JSON.stringify({json.dumps(diet)}))")
    for fid in films:
        try:
            await pg.goto("http://localhost:8795/?film=" + quote(fid), wait_until="networkidle")
            await pg.wait_for_function(f"typeof current!=='undefined'&&current&&current.id==={json.dumps(fid)}&&document.querySelector('#preview .mcard.fmt')", timeout=20000)
            await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(1500)
            out[fid] = await pg.evaluate(MEASURE)
        except Exception as e:
            out[fid] = ["ERROR " + str(e)[:80]]
    await c.close(); return out
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(); await pg.goto("http://localhost:8795/"); await pg.wait_for_timeout(1500)
        films = await pg.evaluate("FILMS.filter(f=>typeof FMT_INDEX!=='undefined'&&FMT_INDEX[f.id]).map(f=>f.id)"); await pg.close()
        if len(sys.argv) > 2: films = [f for f in films if sys.argv[2] in f]
        chunks = [films[i::4] for i in range(4)]
        offs = await asyncio.gather(*[run(b, ch, {}) for ch in chunks]); ons = await asyncio.gather(*[run(b, ch, {"veg": True, "af": True}) for ch in chunks])
        await b.close()
    off = {k: v for d in offs for k, v in d.items()}; on = {k: v for d in ons for k, v in d.items()}
    new = [(fid, h) for fid in on for h in (on[fid] or []) if h not in set(off.get(fid) or [])]
    json.dump({"off": off, "on": on, "new": new}, open(OUT, "w"), indent=0)
    for x in new: print(x)
    print("NEW LIVE FIT PROBLEMS", len(new), "| films", len({x[0] for x in new}), "| films checked", len(films))
asyncio.run(main())
