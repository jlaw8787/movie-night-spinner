"""Build a pack from a short source file: python3 wip/next100/mk.py wip/next100/src/<slug>.py
The source defines FILM (id, theme, T, D, P), DISHES (list of dish dicts), FORMAT, FLAVOUR, PALETTE, HOUSE, SERIES.
Optional DIET_TEXT {veg|af|veg_af: [[from, to], ...]}: word swaps for a hand-built menu. FORMAT "own": the fmt key in formats.js (film comes off film-format).
Each dish: n, course (s/m/w/d), line (film line), note (menu description), prep, cook, ahead, ing [(q,u,item,aisle)], steps [(text,min)],
optional alt {veg|af|veg_af: dish-like dict with n, note, prep, cook, ing, steps}. veg/af flags are worked out by the checker rules."""
import json, re, sys, pathlib, importlib.util
R = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(R / 'wip/newfilms'))
spec = importlib.util.spec_from_file_location('src', sys.argv[1]); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
slug = lambda fid: re.sub(r"[^a-z0-9]+", "-", fid.lower()).strip("-")
MEAT = re.compile(r"\b(beef|pork|lamb|veal|chicken|bacon|ham|salami|prosciutto|pancetta|chorizo|sausages?|frankfurts?|hot dogs?|mince|steak|turkey|duck|prawns?|shrimp|fish|salmon|tuna|crab|lobster|calamari|squid|mussels|oysters?|clams?|anchov\w*|gelatine|gelatin|lard|fish sauce|oyster sauce|corned)\b", re.I)
VEGOK = re.compile(r"vegetarian|vegie|veggie|plant-based|mushroom|vegetable stock|tofu|tempeh|jackfruit|haloumi|soy|meat-free|meatless", re.I)
BOOZE = re.compile(r"\b(wine|beer|lager|ale|stout|vodka|whisky|whiskey|scotch|bourbon|rum|gin|tequila|brandy|cognac|champagne|prosecco|sherry|vermouth|liqueur|marsala|cider|sake|mirin|schnapps|kirsch|amaretto|baileys|kahlua|absinthe|port|bitters)\b", re.I)
AFOK = re.compile(r"alcohol-free|non-alcoholic|ginger beer|root beer|cider vinegar|wine vinegar", re.I)
def ing(lst): return [{"q": q, "u": u, "item": it, "aisle": a} for q, u, it, a in lst]
def steps(lst): return [{"text": t, "min": m} for t, m in lst]
def flags(lst):
    meat = any(a in ("Meat", "Seafood") or (MEAT.search(it) and not VEGOK.search(it)) for q, u, it, a in lst)
    booze = any(a == "Bottle shop" or (BOOZE.search(it) and not AFOK.search(it)) for q, u, it, a in lst)
    return meat, booze
def qty(q, u):
    if q in ("", None): return ""
    q = int(q) if float(q).is_integer() else q
    return f"{q}{u}" if u in ("g", "kg", "ml", "l") else f"{q} {u}".strip()
def shop(lst): return [f"{(qty(q, u) + ' ').lstrip()}{it}@{a}".strip() for q, u, it, a in lst]
# the printed note leads with the film moment, then the food (house rule from the flat menu rework: joke first survives the cut)
def joke(line, food): return line.rstrip(". ") + ". " + food if line else food
def how(d): return " ".join(t for t, m in d["steps"])
r2 = []; rec = {"s": [], "m": [], "w": [], "d": []}; notes = {}
F = {"title": S.FILM["id"].rsplit(" (", 1)[0], "year": S.FILM["id"].rsplit("(", 1)[1].rstrip(")"), "theme": S.FILM["theme"], "hw": 1, "S": [], "M": [], "W": [], "K": [], "T": S.FILM["T"], "D": S.FILM["D"], "P": S.FILM["P"]}
K = {"s": "S", "m": "M", "w": "W", "d": "K"}
for d in S.DISHES:
    meat, booze = flags(d["ing"])
    o = {"n": d["n"], "course": d["course"], "prep_min": d["prep"], "cook_min": d["cook"], "make_ahead": d["ahead"], "ingredients": ing(d["ing"]), "steps": steps(d["steps"]), "veg": not meat, "af": not booze}
    if d.get("alt"):
        o["alt"] = {}
        for v, a in d["alt"].items():
            o["alt"][v] = {"n": a["n"], "course": d["course"], "prep_min": a["prep"], "cook_min": a["cook"], "make_ahead": a.get("ahead", d["ahead"]), "ingredients": ing(a["ing"]), "steps": steps(a["steps"])}
            notes.setdefault(d["n"], {})[v] = joke(d["line"], a["note"])
    r2.append(o)
    rec[d["course"]].append({"n": d["n"], "note": joke(d["line"], d["note"]), "how": how(d), "shop": shop(d["ing"])})
    F[K[d["course"]]].append([d["n"], d["line"], how(d), shop(d["ing"])])
allshop = []
for c in "smwd":
    for it in rec[c]:
        for s in it["shop"]:
            if s not in allshop: allshop.append(s)
rec["shopping"] = allshop
fid = S.FILM["id"]
p = {"id": fid, "film": F, "film-format": S.FORMAT, "film-flavour": S.FLAVOUR, "film-palette": S.PALETTE,
     "dish-names": [[x[0] for x in F[k]] for k in "SMWK"], "dish-notes": [[x[1] for x in F[k]] for k in "SMWK"],
     "recipes": rec, "recipes2": {"serves": 4, "dishes": r2}, "diet": dict({"notes": notes}, **({"text": S.DIET_TEXT} if getattr(S, "DIET_TEXT", None) else {})), "series": S.SERIES, "film-house": S.HOUSE}
out = R / "wip/next100/packs" / f"{slug(fid)}.json"
json.dump(p, open(out, "w"), ensure_ascii=False, indent=1)
print(out)
