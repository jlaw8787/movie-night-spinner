"""Check a new film pack: python3 wip/newfilms/checkpack.py wip/newfilms/packs/<slug>.json [...]"""
import json, re, sys, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
THEMES = set("redsauce pizza deli street cop soul xmas aussie asian scifi hero kids teen diner mex tiki uptown horror western philly galaxy wizard adventure fairytale romcom".split())
FORMATS = {p.stem for p in (R / "menu-formats").glob("*.js")}
ERAS = {"1930s-40s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "modern"}
TONES = set("gritty glossy warm eerie playful grand tender tense scrappy".split())
UNITS = {"", "g", "kg", "ml", "l", "tsp", "tbsp", "cup"}
AISLES = {"Meat", "Seafood", "Deli", "Produce", "Dairy", "Bakery", "Frozen", "Pantry", "Drinks", "Bottle shop", "Spices"}
SERIES = {s["id"] for s in json.load(open(R / "data/series.json"))}
MEAT = re.compile(r"\b(beef|pork|lamb|veal|chicken|bacon|ham|salami|prosciutto|pancetta|chorizo|sausages?|mince|steak|turkey|duck|prawns?|shrimp|fish|salmon|tuna|crab|lobster|calamari|squid|mussels|oysters?|anchov\w*|gelatine|gelatin|lard|fish sauce|oyster sauce|worcestershire|chicken stock|beef stock|brisket|ribs?|frankfurts?|hot dogs?|pastrami|venison|trout|cod|scallops?|clams?)\b", re.I)
VEGOK = re.compile(r"vegetarian|vegie|veggie|plant-based|mushroom|vegetable stock|tofu|tempeh|jackfruit|haloumi|soy|meat-free|meatless", re.I)
BOOZE = re.compile(r"\b(wine|beer|lager|ale|stout|vodka|whisky|whiskey|scotch|bourbon|rum|gin|tequila|brandy|cognac|champagne|prosecco|sherry|vermouth|liqueur|marsala|cider|sake|mirin|schnapps|kirsch|amaretto|baileys|kahlua|absinthe|port|bitters)\b", re.I)
AFOK = re.compile(r"alcohol-free|non-alcoholic|ginger beer|root beer|cider vinegar|wine vinegar", re.I)
def slug(fid): return re.sub(r"[^a-z0-9]+", "-", fid.lower()).strip("-")
def check(path):
    E, W = [], []
    try: p = json.load(open(path))
    except Exception as e: return [f"bad JSON: {e}"], []
    fid = p.get("id", ""); f = p.get("film", {})
    if pathlib.Path(path).stem != slug(fid): E.append(f"file name should be {slug(fid)}.json")
    if f"{f.get('title')} ({f.get('year')})" != fid: E.append("film title/year don't match id")
    if f.get("theme") not in THEMES: E.append(f"theme {f.get('theme')} not allowed")
    if fid in {f"{x['title']} ({x['year']})" for x in json.load(open(R / "data/films.json"))} and "--allow-existing" not in sys.argv: W.append("film already in the store (will be replaced)")
    counts = {"S": (2, 3), "M": (1, 2), "W": (1, 1), "K": (1, 1)}
    for k, (lo, hi) in counts.items():
        v = f.get(k) or []
        if not lo <= len(v) <= hi: E.append(f"film {k} has {len(v)} dishes, want {lo} to {hi}")
        for d in v:
            if not (isinstance(d, list) and len(d) == 4 and isinstance(d[3], list)): E.append(f"film {k} dish shape wrong: {str(d)[:60]}")
    for k in ("T", "D", "P"):
        if not f.get(k): E.append(f"film {k} missing")
    names = {k: [d[0] for d in f.get(k, [])] for k in "SMWK"}
    if p.get("dish-names") != [names["S"], names["M"], names["W"], names["K"]]: E.append("dish-names don't match film S/M/W/K names")
    if p.get("dish-notes") != [[d[1] for d in f.get(k, [])] for k in "SMWK"]: E.append("dish-notes don't match film S/M/W/K film lines")
    rec = p.get("recipes") or {}; r2 = (p.get("recipes2") or {}).get("dishes") or []
    rnames = [it["n"] for c in "smwd" for it in rec.get(c, [])]
    if sorted(rnames) != sorted(sum(names.values(), [])): E.append(f"recipes dish names don't match film: {sorted(set(rnames) ^ set(sum(names.values(), [])))}")
    if sorted(d["n"] for d in r2) != sorted(rnames): E.append("recipes2 dish names don't match recipes")
    for c, k in zip("smwd", "SMWK"):
        if [it["n"] for it in rec.get(c, [])] != names[k]: E.append(f"recipes {c} order/names differ from film {k}")
        for it in rec.get(c, []):
            for key in ("note", "how", "shop"):
                if not it.get(key): E.append(f"recipes {it['n']} missing {key}")
            for sh in it.get("shop", []):
                if "@" not in sh or sh.split("@")[1] not in AISLES: E.append(f"shop line aisle wrong: {sh}")
    if (p.get("recipes2") or {}).get("serves") != 4: E.append("recipes2 serves must be 4")
    notes = (p.get("diet") or {}).get("notes") or {}
    kidsy = f.get("theme") in ("kids", "fairytale")
    def dish_check(d, label, want_veg=None, want_af=None):
        for key in ("n", "prep_min", "cook_min", "ingredients", "steps"):
            if key not in d: E.append(f"{label}: missing {key}")
        ing = d.get("ingredients", []); st = d.get("steps", [])
        if not 2 <= len(st) <= 9: E.append(f"{label}: {len(st)} steps")
        tot = sum(s.get("min", 0) or 0 for s in st); want = (d.get("prep_min") or 0) + (d.get("cook_min") or 0)
        if want and abs(tot - want) > max(5, want * 0.15): E.append(f"{label}: step minutes {tot} vs prep+cook {want}")
        for i in ing:
            if i.get("u", "") not in UNITS: E.append(f"{label}: unit {i.get('u')!r} on {i.get('item')}")
            if i.get("aisle") not in AISLES: E.append(f"{label}: aisle {i.get('aisle')!r} on {i.get('item')}")
        text = " ".join(i.get("item", "") for i in ing)
        meat = any(i.get("aisle") in ("Meat", "Seafood") for i in ing) or any(MEAT.search(i.get("item", "")) and not VEGOK.search(i.get("item", "")) for i in ing)
        booze = any(i.get("aisle") == "Bottle shop" for i in ing) or any(BOOZE.search(i.get("item", "")) and not AFOK.search(i.get("item", "")) for i in ing)
        if want_veg and meat: E.append(f"{label}: vegetarian version still has meat or fish: {[i['item'] for i in ing if i.get('aisle') in ('Meat','Seafood') or (MEAT.search(i['item']) and not VEGOK.search(i['item']))][:3]}")
        if want_af and booze: E.append(f"{label}: alcohol-free version still has alcohol: {[i['item'] for i in ing if i.get('aisle')=='Bottle shop' or (BOOZE.search(i['item']) and not AFOK.search(i['item']))][:3]}")
        return meat, booze
    for d in r2:
        meat, booze = dish_check(d, d.get("n", "?"))
        if d.get("veg") is not (not meat): E.append(f"{d['n']}: veg flag should be {not meat}")
        if d.get("af") is not (not booze): E.append(f"{d['n']}: af flag should be {not booze}")
        if kidsy and booze: E.append(f"{d['n']}: family film, but the dish has alcohol")
        if not d.get("make_ahead"): W.append(f"{d['n']}: no make_ahead")
        alt = d.get("alt") or {}
        need = (["veg"] if meat else []) + (["af"] if booze else []) + (["veg_af"] if meat and booze else [])
        for v in need:
            if v not in alt: E.append(f"{d['n']}: missing alt.{v}")
        for v, a in alt.items():
            if v not in need: E.append(f"{d['n']}: alt.{v} not needed")
            dish_check(a, f"{d['n']} [{v}]", want_veg=v in ("veg", "veg_af"), want_af=v in ("af", "veg_af"))
            if not (notes.get(d["n"]) or {}).get(v): E.append(f"{d['n']}: diet note missing for {v}")
    ff = p.get("film-format") or {}
    if ff.get("format") not in FORMATS: E.append(f"format {ff.get('format')} not in menu-formats")
    if ff.get("era") not in ERAS: E.append(f"era {ff.get('era')} not allowed")
    if ff.get("tone") not in TONES: E.append(f"tone {ff.get('tone')} not allowed")
    fl = p.get("film-flavour") or {}
    for k in ("venue", "sign", "note", "winks", "prop"):
        if not fl.get(k): E.append(f"film-flavour {k} missing")
    if not fl.get("number"): W.append("film-flavour number missing")
    if not isinstance(fl.get("note"), dict) or not fl["note"].get("text") or not fl["note"].get("by"): E.append("film-flavour note needs text and by")
    if not 3 <= len(fl.get("winks", [])) <= 5: E.append("film-flavour winks: 3 to 5")
    pal = p.get("film-palette") or {}
    for k in ("dark", "accent"):
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", str(pal.get(k, ""))): E.append(f"film-palette {k} not a hex colour")
    for s in p.get("series", []):
        if isinstance(s, dict) and s.get("new"): continue
        if s not in SERIES: E.append(f"series {s} unknown (use {{'new': 'Name'}})")
    blob = json.dumps(p, ensure_ascii=False)
    if re.search("[–—]", blob): E.append("em or en dash found")
    return E, W
bad = 0
for path in [a for a in sys.argv[1:] if not a.startswith("--")]:
    E, W = check(path)
    print(f"{path}: {len(E)} errors, {len(W)} warnings")
    for e in E: print("  ERROR", e)
    for w in W: print("  warn ", w)
    bad += bool(E)
sys.exit(1 if bad else 0)
