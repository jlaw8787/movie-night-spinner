"""Deep quality check of the vegetarian and alcohol-free versions in data/recipes2.
Run from the repo root: python3 wip/diet/deepcheck.py [OUT.json]
Mirrors app.js dietDish for coverage, then reads every swap for things the merge check misses."""
import json, glob, re, sys, collections
sys.path.insert(0, "wip/genre/lib"); sys.path.insert(0, "wip/diet")
from dietclass import MEAT, VEG_OK, dish_flags
from merge import BOOZE, NOT, boozy

HIDDEN = re.compile(r"chicken stock|beef stock|veal stock|lamb stock|bone broth|chicken (broth|bouillon|powder)|beef (broth|bouillon)|fish sauce|anchov|gelatin|lard\b|dripping|worcestershire|(?<!mushroom )(?<!vegetarian )(?<!vegan )oyster sauce|shrimp paste|belacan|bonito|dashi|fish stock|suet|bacon|caesar dressing|XO sauce|chicken salt|parmesan|parmigiano|pecorino|grana padano|gruyere|gruyère", re.I)
HIDDEN_OK = re.compile(r"vegetarian|vegan|kombu dashi|mushroom|vegetable suet|-style|plant|veggie|kelp|seaweed dashi|no anchov|without anchov|anchovy-free|meat-free|agar", re.I)
STEP_MEAT = MEAT
JUICE_ONLY = re.compile(r"juice|soda|lemonade|water|ice|tonic|cola|sugar|syrup|lime|lemon|orange|mint|cherry|garnish|wedge|slice", re.I)
UNIT_G = {"g": 1, "kg": 1000, "ml": 1, "l": 1000}

def mass(x):
    t = 0
    for i in x.get("ingredients") or []:
        if isinstance(i.get("q"), (int, float)) and i.get("u") in UNIT_G: t += i["q"] * UNIT_G[i["u"]]
    return t

STOP = {"fresh", "large", "small", "medium", "chopped", "sliced", "diced", "grated", "of", "and", "or", "to", "for", "the", "a", "finely", "thinly", "extra", "plus", "serve", "serving", "tinned", "dried", "ground", "whole", "cold", "hot", "warm", "good", "ripe", "firm", "soft", "baby", "bunch", "handful", "pinch", "cut", "into", "pieces", "piece", "peeled", "crushed", "minced", "halved", "torn", "picked", "leaves", "cloves", "clove", "slices", "slice", "sprigs", "cups", "chilled", "optional", "vegetarian", "vegan", "style", "alcohol", "free", "non", "alcoholic", "store", "bought", "packet", "jar", "can", "x"}
def used(item, steps):
    words = [w for w in re.findall(r"[a-z]+", item.lower()) if len(w) > 2 and w not in STOP]
    if not words: return True
    txt = " ".join(s["text"].lower() for s in steps)
    if re.search(r"\b(everything|all the ingredients|remaining ingredients|the rest|all ingredients)\b", txt): return True
    return any(w[:4] in txt for w in words) or any(re.sub(r"(es|s)$", "", w)[:4] in txt for w in words)

def resolve(d, veg, af):
    alt = d.get("alt") or {}; x = d; tag = ""
    if veg and d.get("veg") is False:
        if af and alt.get("veg_af"): return dict(d, **alt["veg_af"], orig=d["n"], tag="veg", af=True)
        if alt.get("veg"): x = dict(d, **alt["veg"], orig=d["n"]); tag = "veg"
        else: return dict(d, blocked="meat")
    if af and (x.get("af") is False or any(i.get("aisle") == "Bottle shop" for i in x.get("ingredients") or [])):
        if not tag and alt.get("af"): x = dict(d, **alt["af"], orig=d["n"], af=True); tag = "af"
        else: return dict(x, blocked="alcohol", tag=tag)
    return dict(x, tag=tag)

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "wip/diet/deepcheck.json"
    issues = collections.defaultdict(list); cov = collections.Counter(); blocked_by_course = collections.Counter()
    films_veg_thin = []; per = {}
    for p in sorted(glob.glob("data/recipes2/*.json")):
        slug = p.split("/")[-1][:-5]; ds = json.load(open(p))["dishes"]
        for mode, (v, a) in {"veg": (1, 0), "af": (0, 1), "veg+af": (1, 1)}.items():
            res = [resolve(d, v, a) for d in ds]
            b = [r for r in res if r.get("blocked")]
            cov[f"{mode}: dishes blocked"] += len(b)
            for r, d in zip(res, ds):
                if r.get("blocked"): blocked_by_course[(mode, d["course"], r["blocked"])] += 1
            left = len(res) - len(b)
            if not any(not r.get("blocked") and d["course"] == "m" for r, d in zip(res, ds)): issues["no main left"].append((slug, mode))
            if left < 3: issues["fewer than 3 dishes left"].append((slug, mode, left, len(res)))
            if mode == "veg+af": per[slug] = [(d["n"], r.get("blocked") or r.get("tag") or "") for r, d in zip(res, ds)]
        for d in ds:
            for kind, x in (d.get("alt") or {}).items():
                key = (slug, d["n"], kind, x.get("n"))
                needveg = kind in ("veg", "veg_af"); needaf = kind in ("af", "veg_af")
                if needveg:
                    for i in x["ingredients"]:
                        if HIDDEN.search(i["item"]) and not HIDDEN_OK.search(i["item"]): issues["veg: hidden animal ingredient"].append(key + (i["item"],))
                    for s in x["steps"]:
                        m = STEP_MEAT.search(s["text"])
                        if m and any(m.group(0).lower().rstrip("s")[:5] in i["item"].lower() and (VEG_OK.search(i["item"]) or not (MEAT.search(i["item"]) or i.get("aisle") in ("Meat", "Seafood"))) for i in x["ingredients"]): m = None
                        if m and not VEG_OK.search(s["text"]) and not re.search(r"mushroom|cauliflower|eggplant|tofu|haloumi|halloumi|jackfruit|tempeh|seitan|bean|lentil|pumpkin|portobello|vegetarian|vegan|veggie|plant", s["text"], re.I):
                            issues["veg: meat word in method"].append(key + (m.group(0), s["text"][:120]))
                        elif m and re.search(r"\b(chicken|beef|pork|lamb|bacon|fish|prawns?|steak)\b", s["text"], re.I) and not re.search(r"(mushroom|cauliflower|eggplant|tofu|vegetarian|vegan|plant|veggie|celeriac|jackfruit|haloumi|halloumi|portobello)[- ](\w+ )?(chicken|beef|pork|lamb|bacon|fish|prawns?|steak)", s["text"], re.I):
                            issues["veg: check method wording"].append(key + (m.group(0), s["text"][:120]))
                if needaf:
                    for s in x["steps"]:
                        m = BOOZE.search(s["text"])
                        if m and any(m.group(0).lower() in i["item"].lower() and NOT.search(i["item"]) for i in x["ingredients"]): m = None
                        if m and not NOT.search(s["text"]): issues["af: alcohol word in method"].append(key + (m.group(0), s["text"][:120]))
                    if d["course"] == "d" and all(JUICE_ONLY.search(i["item"]) for i in x["ingredients"]) and len(x["ingredients"]) <= 3:
                        issues["af drink: just juice"].append(key + (", ".join(i["item"] for i in x["ingredients"]),))
                    if kind == "af" and d["course"] != "d" and x["n"] != d["n"]: issues["af food: name changed"].append(key)
                tot = sum(s.get("min", 0) for s in x["steps"]); want = x["prep_min"] + x["cook_min"]
                if want and abs(tot - want) > max(5, 0.1 * want): issues["times: steps don't add up"].append(key + (tot, want))
                if not 2 <= len(x["steps"]) <= 7: issues["steps: count"].append(key + (len(x["steps"]),))
                miss = [i["item"] for i in x["ingredients"] if not used(i["item"], x["steps"])]
                if miss: issues["ingredient never used in method"].append(key + (miss,))
                for i in x["ingredients"]:
                    if i.get("q") is not None and (not isinstance(i["q"], (int, float)) or i["q"] <= 0): issues["bad quantity"].append(key + (i,))
                m0, m1 = mass(d), mass(x)
                if m0 > 200 and m1 and not 0.4 <= m1 / m0 <= 2.5: issues["amount far off the original"].append(key + (m0, m1))
                if x["prep_min"] + x["cook_min"] > 2.2 * max(10, d["prep_min"] + d["cook_min"]): issues["much longer than original"].append(key + (d["prep_min"] + d["cook_min"], x["prep_min"] + x["cook_min"]))
    for k, v in cov.items(): print(k, v)
    print("blocked by mode/course/reason:")
    for k, v in sorted(blocked_by_course.items()): print("  ", k, v)
    print("issues:")
    for k, v in sorted(issues.items(), key=lambda kv: -len(kv[1])): print(f"  {k}: {len(v)}")
    json.dump({"issues": {k: v for k, v in issues.items()}, "vegaf": per}, open(out, "w"), indent=1, ensure_ascii=False)
if __name__ == "__main__": main()
