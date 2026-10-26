#!/usr/bin/env python3
"""Data check of every film's planner recipes (data/recipes2) against its menu (data/films.json).
python3 wip/genre/lib/recipecheck.py [--json OUT]   (repo root)
Prints counts per check and examples; --json writes every finding."""
import json, re, sys, collections, os
slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
AISLES = {"Meat", "Seafood", "Deli", "Produce", "Dairy", "Bakery", "Frozen", "Pantry", "Drinks", "Bottle shop"}
UNITS = {"", "g", "kg", "ml", "l", "tsp", "tbsp", "cup"}
FAMILY = {"kids", "fairytale"}
BOOZE = re.compile(r"\b(wine|beer|lager|ale|stout|cider|rum|vodka|gin|whisk(e)?y|bourbon|brandy|tequila|mezcal|sake|soju|champagne|prosecco|vermouth|liqueur|schnapps|cognac|port|sherry|amaretto|kahl[uú]a|baileys|absinthe|bitters|marsala|mirin)\b", re.I)
NOT_BOOZE = re.compile(r"(ginger ale|ginger beer|root beer|wine vinegar|rice wine vinegar|cider vinegar|non-alcoholic|alcohol-free|0% |gingerbread|port salut|sherry vinegar|butterbeer|rum essence|vanilla)", re.I)
STOP = set("and or the a an of with to in for fresh large small medium ripe dried ground chopped sliced whole bunch can tin jar bag packet pack cloves clove sticks stick slices slice thick thin plain good extra virgin cold hot warm soft hard light dark finely roughly leaves leaf fillets fillet pieces piece cup cups tsp tbsp ml g kg l of".split())

def words(s):
    return [w for w in re.findall(r"[a-zà-ÿ']+", s.lower()) if len(w) >= 3 and w not in STOP]

def stem(w):
    if w.endswith("ies") and len(w) > 4: return w[:-3] + "y"
    if re.search(r"(ch|sh|x|ss|o)es$", w): return w[:-2]
    if w.endswith("s") and not w.endswith("ss") and len(w) > 3: return w[:-1]
    return w
GENERIC = {"pasta": "ziti penne spaghetti rigatoni linguine fettuccine macaroni noodle noodles lasagne orzo fusilli tagliatelle pappardelle gnocchi".split(),
           "oil": "olive vegetable canola neutral sunflower peanut sesame".split(), "meat": "mince beef pork lamb".split(), "fish": "snapper cod barramundi salmon trout".split(),
           "herb": "parsley coriander basil mint dill chive".split(), "season": "salt pepper".split(), "spice": "cumin paprika cinnamon nutmeg".split(),
           "cheese": "cheddar parmesan mozzarella ricotta feta".split(), "bread": "roll rolls bun buns baguette loaf sourdough".split(), "ice": "ice".split()}
def used(iw, tw, text):
    if any(w in tw for w in iw): return True
    for g, syn in GENERIC.items():
        if g in text and any(w in syn for w in iw): return True
    return False

def main():
    films = json.load(open("data/films.json"))
    F = collections.defaultdict(list)
    def add(k, film, msg): F[k].append((film, msg))
    for f in films:
        fid = f"{f['title']} ({f['year']})"; s = slug(fid)
        p = f"data/recipes2/{s}.json"
        if not os.path.exists(p): add("no recipe file", fid, p); continue
        r = json.load(open(p)); ds = r.get("dishes") or []
        if not ds: add("no dishes", fid, ""); continue
        menu = {x[0].strip().lower() for c in "SMWK" for x in (f.get(c) or [])}
        rn = {d.get("n", "").strip().lower() for d in ds}
        for n in menu - rn: add("menu dish with no recipe", fid, n)
        for n in rn - menu: add("recipe dish not on menu", fid, n)
        for d in ds:
            n = d.get("n", "?"); tag = f"{n}"
            if d.get("course") not in ("s", "m", "w", "d"): add("bad course", fid, tag)
            pm, cm = d.get("prep_min"), d.get("cook_min")
            if not isinstance(pm, (int, float)) or pm <= 0: add("missing prep time", fid, tag)
            if not isinstance(cm, (int, float)) or cm < 0: add("missing cook time", fid, tag)
            ing = d.get("ingredients") or []; st = d.get("steps") or []
            if len(ing) < 2: add("under 2 ingredients", fid, tag)
            if len(st) < 2: add("under 2 steps", fid, tag)
            for i in ing:
                if i.get("u") not in UNITS: add("odd unit", fid, f"{tag}: {i.get('u')!r} {i.get('item')}")
                if i.get("aisle") not in AISLES: add("odd aisle", fid, f"{tag}: {i.get('aisle')!r} {i.get('item')}")
                q = i.get("q")
                if q is not None and (not isinstance(q, (int, float)) or q <= 0): add("bad quantity", fid, f"{tag}: {q!r} {i.get('item')}")
                if isinstance(q, (int, float)):
                    u = i.get("u")
                    if (u == "g" and q > 3000) or (u == "ml" and q > 4000) or (u == "" and q > 40) or (u in ("tsp", "tbsp") and q > 12) or (u == "cup" and q > 8):
                        add("huge quantity for 4", fid, f"{tag}: {q}{u} {i.get('item')}")
            text = " ".join(x.get("text", "") for x in st)
            tw = {stem(w) for w in words(text)}
            for i in ing:
                iw = [stem(w) for w in words(str(i.get("item", "")))]
                if iw and not used(iw, tw, text.lower()) and not re.search(r'to taste|to serve|for frying|for dusting|for greasing|to garnish|optional|ice', str(i.get('item','')), re.I): add("ingredient never used in method", fid, f"{tag}: {i.get('item')}")
            sm = sum((x.get("min") or 0) for x in st); tot = (pm or 0) + (cm or 0)
            if sm and tot and (abs(sm - tot) > max(20, 0.5 * tot)): add("step times far off dish time", fid, f"{tag}: steps {sm} vs prep+cook {tot}")
            if tot > 600 and not d.get("make_ahead"): add("over 10 hr, no make-ahead note", fid, f"{tag}: {tot} min")
            for x in st:
                t = x.get("text", "")
                if re.search(r"\b(\w+) \1\b", t, re.I) and not re.search(r"\b(that that|had had|very very|bye bye|choo choo|tutti tutti)\b", t, re.I): add("doubled word", fid, f"{tag}: {t[:120]}")
                if re.search(r"\b(of the|on the|in the|with the|to the|the) (the|a|an|of|and)\b", t, re.I): add("garbled wording", fid, f"{tag}: {t[:140]}")
                if re.search(r"[‒-―−]", t): add("dash", fid, f"{tag}: {t[:80]}")
                if re.search(r"\b(undefined|null|None|TODO|NaN)\b|\{|\}", t): add("template junk", fid, f"{tag}: {t[:80]}")
                if t and t[0].islower(): add("step starts lowercase", fid, f"{tag}: {t[:80]}")
            if f.get("theme") in FAMILY:
                for i in ing:
                    it = str(i.get("item", ""))
                    if (i.get("aisle") == "Bottle shop" or BOOZE.search(it)) and not NOT_BOOZE.search(it): add("alcohol in family film", fid, f"{tag}: {it}")
            for k in ("n",):
                if re.search(r"[‒-―−]", d.get(k, "")): add("dash", fid, f"name: {d.get(k)}")
    order = sorted(F, key=lambda k: -len(F[k]))
    print(f"{len(films)} films checked")
    for k in order:
        fs = {x[0] for x in F[k]}
        print(f"\n{k}: {len(F[k])} in {len(fs)} films")
        for film, msg in F[k][:6]: print(f"   {film} | {msg}")
    if "--json" in sys.argv:
        json.dump({k: v for k, v in F.items()}, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main()
