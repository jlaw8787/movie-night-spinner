"""Merge diet data into data/recipes2: per dish `veg` and `af` flags, plus `alt.af` / `alt.veg` / `alt.veg_af`
from wip/diet/out/*.json. Run from the repo root: python3 wip/diet/merge.py [--check]"""
import json, glob, re, sys, copy
sys.path.insert(0, "wip/genre/lib")
from dietclass import dish_flags
BOOZE = re.compile(r"\b(wine|beer|lager|ale|stout|cider|rum|vodka|gin|whisk(e)?y|bourbon|brandy|brandied|tequila|mezcal|sake|soju|champagne|prosecco|vermouth|liqueur|schnapps|cognac|port|sherry|amaretto|amaro|aperitivo|bitters|marsala|campari|aperol|cassis|curacao|triple sec|pastis|ouzo|grappa|limoncello|chianti|shiraz|pinot|merlot|ros[eé]|lambrusco|tempranillo|burgundy|chardonnay|sangria|scotch|rye whiskey|cacha[cç]a|pisco|mead|kirsch|calvados|sambuca|absinthe|madeira|riesling|cava|mirin|shaoxing|rice wine|cooking wine|kahl[uú]a|baileys|drambuie|frangelico|galliano|chartreuse|advocaat|irish cream)\b", re.I)
NOT = re.compile(r"alcohol-free|non-alcoholic|0%|juice|ginger ale|ginger beer|root beer|vinegar|cordial|butterbeer|cream soda|sarsaparilla|rose ?water|rosemary|rose petal|essence|syrup|rye bread|rye flour|rye crisp|dark rye|mocktail|tonic|soda water|lemonade|scotch bonnet|scotch fillet|scotch egg|cacao|port salut|bitter (leaf|melon)|wine glass|kombucha|verjuice", re.I)
AISLES = {"Meat", "Seafood", "Deli", "Produce", "Dairy", "Bakery", "Frozen", "Pantry", "Drinks", "Bottle shop", "Spices"}
UNITS = {"", "g", "kg", "ml", "l", "tsp", "tbsp", "cup"}
def boozy(x): return any(i.get("aisle") == "Bottle shop" or (BOOZE.search(str(i.get("item", ""))) and not NOT.search(str(i.get("item", "")))) for i in x.get("ingredients") or [])
SIMPLE = [(re.compile(r"\bmirin\b", re.I), "honey", "Pantry"), (re.compile(r"\bShaoxing wine\b", re.I), "chicken stock", "Pantry")]
def simple_af(d):
    x = {k: copy.deepcopy(d[k]) for k in ("n", "prep_min", "cook_min", "make_ahead", "ingredients", "steps")}
    for i in x["ingredients"]:
        for rx, new, a in SIMPLE:
            if rx.search(i["item"]): i["item"] = rx.sub(new, i["item"]); i["aisle"] = a
    for s in x["steps"]:
        for rx, new, a in SIMPLE: s["text"] = rx.sub(new, s["text"])
    return x
def problems(alt, need_af, need_veg):
    out = []
    for k in ("n", "prep_min", "cook_min", "ingredients", "steps"):
        if k not in alt: out.append("missing " + k)
    for i in alt.get("ingredients", []):
        if i.get("aisle") not in AISLES: out.append("aisle " + str(i.get("aisle")))
        if i.get("u") not in UNITS: out.append("unit " + repr(i.get("u")))
    if need_af and boozy(alt): out.append("still has alcohol: " + ", ".join(i["item"] for i in alt["ingredients"] if i.get("aisle") == "Bottle shop" or BOOZE.search(i["item"])))
    if need_veg and not dish_flags(alt)[0]: out.append("still has meat or fish")
    if re.search(r"[‒-―−]", json.dumps(alt, ensure_ascii=False)): out.append("dash")
    return out
def main():
    check = "--check" in sys.argv
    alts = {}
    for p in sorted(glob.glob("wip/diet/out/*.json")):
        isveg = p.split("/")[-1].startswith("veg")
        for slug, ds in json.load(open(p)).items():
            for n, alt in ds.items():
                if isveg:
                    for kind, x in alt.items(): alts.setdefault(slug, {}).setdefault(n, {})[kind] = x
                else: alts.setdefault(slug, {}).setdefault(n, {})["af"] = alt
    bad = []; stats = {"dishes": 0, "veg": 0, "af": 0, "alt.af": 0, "alt.veg": 0, "alt.veg_af": 0, "boozy without alt": 0, "meat main without alt": 0}
    for p in sorted(glob.glob("data/recipes2/*.json")):
        slug = p.split("/")[-1][:-5]; r = json.load(open(p))
        for d in r["dishes"]:
            stats["dishes"] += 1
            d.pop("alt", None)
            v = dish_flags(d)[0]; a = not boozy(d)
            d["veg"] = v; d["af"] = a; stats["veg"] += v; stats["af"] += a
            got = alts.get(slug, {}).get(d["n"], {})
            alt = {}
            if not a:
                x = got.get("af") or (simple_af(d) if not any(i.get("aisle") == "Bottle shop" for i in d["ingredients"]) else None)
                if x:
                    pr = problems(x, True, False)
                    if pr: bad.append((slug, d["n"], "af", pr))
                    else: alt["af"] = x
                else: stats["boozy without alt"] += 1
            if not v:
                for kind in ("veg", "veg_af"):
                    x = got.get(kind)
                    if x:
                        pr = problems(x, kind == "veg_af", True)
                        if pr: bad.append((slug, d["n"], kind, pr))
                        else:
                            if kind == "veg": x["af"] = not boozy(x)
                            alt[kind] = x
                if "veg" not in alt and d["course"] == "m": stats["meat main without alt"] += 1
            for k in alt: stats["alt." + k] += 1
            if alt: d["alt"] = alt
        if not check:
            with open(p, "w") as o: json.dump(r, o, indent=1, ensure_ascii=False)
    for k, v in stats.items(): print(f"{k}: {v}")
    print(f"problems: {len(bad)}")
    for b in bad[:30]: print("  ", b)
    json.dump(bad, open("wip/diet/problems.json", "w"), indent=1, ensure_ascii=False)
if __name__ == "__main__":
    main()
