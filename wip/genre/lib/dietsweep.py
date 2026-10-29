"""Printed menus follow Vegetarian and No alcohol: every film, all four toggle combinations.
For each swapped dish on the printed menu: the swap's name (or label) is printed, the original isn't,
and a lib menu has a menu line for it. With both toggles off the printed menu is unchanged.
Repo root, local server on 8795.  python3 wip/genre/lib/dietsweep.py OUT.json [limit]"""
import asyncio, json, sys
from playwright.async_api import async_playwright
OUT = sys.argv[1]; LIMIT = int(sys.argv[2]) if len(sys.argv) > 2 else 0
B = "http://localhost:8795/"
PROBE = """async(limit)=>{
 const strip=h=>{const d=document.createElement('div');d.innerHTML=h;return d.textContent.replace(/\\s+/g,' ')};
 const out=[];const list=limit?FILMS.slice(0,limit):FILMS;
 for(const f of list){
  const R={id:f.id,err:null,swaps:[]};
  try{
   await ensureExact(f);
   const sp=typeof fmtSpec==='function'&&(await fmtLoad(f),fmtSpec(f));
   let html='',menu;
   if(sp){menu=fmtMenu(f,sp);html=fmtHTML(f,sp,menu);R.kind='spec'}
   else if(f._lib&&await libLoad(f._lib.fmt)){
     menu=makeMenu(f,true);const L=f._lib;
     const ff=dietKey()?Object.assign(Object.create(Object.getPrototypeOf(f)),f,{T:dietText(f,f.T),P:dietText(f,f.P),D:dietText(f,f.D)}):f;
     const r=window.MENU_FORMATS[L.fmt]({f:ff,menu:libMenu(menu),poster:lobbyPoster(f),stills:L.stills||[],logo:L.logo,palette:L.palette,flavour:dietDeep(f,L.flavour),era:L.era,tone:L.tone,img:(p,z='w1280')=>p?TMDB_IMG+z+p:''});
     html=r.faces.join(' ');R.kind='lib'}
   else {menu=makeMenu(f,true);R.kind='none'}
   const text=strip(html);R.len=text.length;
   const items=menu.all||[...menu.s,...menu.m,...menu.w,...menu.d];
   for(const it of items){
     if(it.blocked){R.swaps.push({orig:it.orig,blocked:it.blocked});continue}
     if(!it.diet)continue;
     const s={orig:it.orig,swap:it.n,v:it.diet,note:it.note||''};
     const norm=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),NT=norm(text);
     if(R.kind==='lib'){s.origShown=NT.includes(norm(it.orig));s.swapShown=NT.includes(norm(it.n).slice(0,40));}
     else {const raw=(typeof FMT_FILMS!=='undefined'&&FMT_FILMS[f.id])||{};const g=(raw.groups||[...(raw.colA||[]),...(raw.colB||[])]).flatMap(x=>x.items||[]).find(x=>x.k===it.orig)||{};
       s.label=g.n||g.k;s.labelNow=it.label;s.labelSame=!!g.n&&it.label===g.n;
       const MEAT=/\b(beef|pork|lamb|veal|chicken|bacon|ham|salami|prosciutto|pancetta|chorizo|sirloin|rib eye|brisket|turkey|duck|prawns?|shrimp|salmon|tuna|crab|lobster|calamari|squid|mussels|oysters?|anchov\w*|clams?|scallops?|fish)\b/i,BOOZE=/\b(wine|beer|lager|ale|stout|vodka|whisky|whiskey|scotch|bourbon|rum|gin|tequila|mezcal|brandy|cognac|champagne|prosecco|sherry|vermouth|liqueur|marsala|cider|sake|amaro|amaretto|campari)\b/i;
       const pat=it.diet==='veg'?[MEAT]:it.diet==='af'?[BOOZE]:[MEAT,BOOZE];
       s.left=[g.note,g.d].filter(t=>t&&pat.some(re=>re.test(t))&&NT.includes(norm(t)))}
     R.swaps.push(s)}
   R.names=items.map(it=>it.n);
  }catch(e){R.err=String(e).slice(0,200)}
  out.push(R)}
 return out}"""
async def main():
    res = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1440, "height": 900})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        for key, diet in (("off", {}), ("veg", {"veg": True}), ("af", {"af": True}), ("veg_af", {"veg": True, "af": True})):
            await pg.goto(B); await pg.evaluate(f"localStorage.clear();localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0');localStorage.setItem('mns-diet',JSON.stringify({json.dumps(diet)}))")
            await pg.reload(wait_until="networkidle"); await pg.wait_for_timeout(2500)
            res[key] = await pg.evaluate(PROBE, LIMIT)
            print(key, len(res[key]), flush=True)
        await b.close()
    json.dump({"res": res, "pageerrors": errs}, open(OUT, "w"))
    faults = {"error": 0, "orig_shown": 0, "swap_missing": 0, "no_note": 0, "label_unchanged": 0, "blocked": 0}
    ex = {k: [] for k in faults}
    off = {r["id"]: r for r in res["off"]}
    for key in ("veg", "af", "veg_af"):
        for r in res[key]:
            if r["err"]: faults["error"] += 1; ex["error"].append((key, r["id"], r["err"])); continue
            for s in r["swaps"]:
                if s.get("blocked"): faults["blocked"] += 1; ex["blocked"].append((key, r["id"], s["orig"], s["blocked"])); continue
                if r["kind"] == "lib":
                    if s["origShown"] and s["orig"].lower() not in s["swap"].lower(): faults["orig_shown"] += 1; ex["orig_shown"].append((key, r["id"], s["orig"]))
                    if not s["swapShown"]: faults["swap_missing"] += 1; ex["swap_missing"].append((key, r["id"], s["swap"]))
                    if not s["note"]: faults["no_note"] += 1; ex["no_note"].append((key, r["id"], s["orig"]))
                elif s.get("left"): faults["label_unchanged"] += 1; ex["label_unchanged"].append((key, r["id"], s["label"], s["left"][0][:80]))
    changed_off = sum(1 for r in res["off"] if any(s for s in r["swaps"]))
    print("off-mode swaps (should be 0):", changed_off, "| page errors:", len(errs))
    for k, v in faults.items(): print(f"{k}: {v}", ex[k][:4])
    print("TOTAL FAULTS", sum(faults.values()) + changed_off + len(errs))
asyncio.run(main())
