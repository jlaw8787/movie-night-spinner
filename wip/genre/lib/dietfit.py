"""Swapped words still fit the hand-built menu artwork: render each page with the toggles off and on,
and report text that now runs into other text or off its page. Repo root, local server on 8795.
python3 wip/genre/lib/dietfit.py OUT.json"""
import asyncio, json, sys
from playwright.async_api import async_playwright
OUT = sys.argv[1]
PROBE = """async(key)=>{
 const host=document.createElement('div');host.style.cssText='position:absolute;left:0;top:0;z-index:-1;opacity:0;pointer-events:none';document.body.appendChild(host);
 const out=[];
 for(const f of FILMS){
  await ensureExact(f);if(!FMT_INDEX[f.id])continue;await fmtLoad(f);const sp=fmtSpec(f);if(!sp)continue;
  if(key!=='off'&&!(f._diet&&f._diet.text))continue;
  await fmtFontsReady(sp);
  host.innerHTML=fmtHTML(f,sp,fmtMenu(f,sp));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const faces=[...host.querySelectorAll('.fx-face')];const boxes=[];
  faces.forEach((face,fi)=>{const fr=face.getBoundingClientRect();const w=document.createTreeWalker(face,NodeFilter.SHOW_TEXT);let n;
   while(n=w.nextNode()){const t=n.nodeValue.trim();if(t.length<2)continue;const el=n.parentElement;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)continue;
    const rg=document.createRange();rg.selectNodeContents(n);const rs=[...rg.getClientRects()].filter(r=>r.width>1&&r.height>1);
    for(const r of rs)boxes.push({t,fi,x:r.left-fr.left,y:r.top-fr.top,w:r.width,h:r.height,out:r.right>fr.right+1||r.left<fr.left-1||r.bottom>fr.bottom+1})}});
  const hits=new Set();
  for(let i=0;i<boxes.length;i++){const a=boxes[i];if(a.out)hits.add('OFF PAGE: '+a.t.slice(0,50));
   for(let j=i+1;j<boxes.length;j++){const b=boxes[j];if(a.fi!==b.fi||a.t===b.t)continue;
    const ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
    if(ox>3&&oy>Math.min(a.h,b.h)*0.35)hits.add('OVERLAP: '+[a.t.slice(0,40),b.t.slice(0,40)].sort().join(' | '))}}
  out.push({id:f.id,hits:[...hits]})}
 host.remove();return out}"""
async def main():
    res = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for key, diet in (("off", {}), ("veg", {"veg": True}), ("af", {"af": True}), ("veg_af", {"veg": True, "af": True})):
            pg = await b.new_page(viewport={"width": 1600, "height": 1200})
            await pg.goto("http://localhost:8795/"); await pg.evaluate(f"localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-diet',JSON.stringify({json.dumps(diet)}))")
            await pg.reload(wait_until="networkidle"); await pg.wait_for_timeout(2000)
            res[key] = {r["id"]: r["hits"] for r in await pg.evaluate(PROBE, key)}
            await pg.close(); print(key, len(res[key]), flush=True)
        await b.close()
    new = []
    for key in ("veg", "af", "veg_af"):
        for fid, hits in res[key].items():
            base = set(res["off"].get(fid, []))
            for h in hits:
                if h not in base: new.append((key, fid, h))
    json.dump({"res": res, "new": new}, open(OUT, "w"), indent=0)
    for x in new: print(x)
    print("NEW FIT PROBLEMS", len(new), "| films affected", len({x[1] for x in new}))
asyncio.run(main())
