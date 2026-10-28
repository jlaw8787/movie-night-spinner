"""Wings round: check or apply wip/recipe/repeats/wings-out.json.
  python3 wip/recipe/repeats/wings.py check   validate (vegetarian, lint, spread of swaps)
  python3 wip/recipe/repeats/wings.py apply   write into wip/diet/out, then run wip/diet/merge.py yourself"""
import json, sys, os, re, collections
sys.path.insert(0, "wip/recipe")
sys.path.insert(0, "wip/genre/lib")
from lint import lint_dish
from dietclass import dish_flags
from tools import AISLES, UNITS, DASH

job = json.load(open("wip/recipe/repeats/wings-job.json"))
src = json.load(open("wip/recipe/repeats/wings-src.json"))
out = json.load(open("wip/recipe/repeats/wings-out.json"))
BOOZE = re.compile(r"\b(beer|wine|rum|vodka|whisk(e)?y|bourbon|brandy|tequila|sake|mirin|shaoxing|liqueur)\b", re.I)
probs = []
swaps = collections.Counter()
for slug, ds in job.items():
    for name, vs in ds.items():
        for k in vs:
            if k == "base":
                continue
            x = (out.get(slug) or {}).get(name, {}).get(k)
            w = f"{slug} / {name} / {k}"
            if not x:
                probs.append(f"{w}: missing")
                continue
            for f in ("n", "prep_min", "cook_min", "make_ahead", "ingredients", "steps"):
                if f not in x:
                    probs.append(f"{w}: missing {f}")
            if "cauliflower" in x.get("n", "").lower():
                swaps["cauliflower"] += 1
            else:
                swaps[x.get("n", "").lower().split()[-2] if len(x.get("n", "").split()) > 1 else x.get("n", "")] += 0
            if not dish_flags(x)[0]:
                probs.append(f"{w}: not vegetarian by the checker")
            if k == "veg_af" and any(BOOZE.search(i["item"]) for i in x.get("ingredients", [])):
                probs.append(f"{w}: has alcohol")
            for i in x.get("ingredients", []):
                if i.get("aisle") not in AISLES:
                    probs.append(f"{w}: aisle {i.get('aisle')!r}")
                if i.get("u", "") not in UNITS:
                    probs.append(f"{w}: unit {i.get('u')!r}")
            if DASH.search(json.dumps(x, ensure_ascii=False)):
                probs.append(f"{w}: dash")
            for c, d in lint_dish(x):
                probs.append(f"{w}: {c} {d}")
for p in probs:
    print(p)
print("cauliflower kept on", swaps["cauliflower"], "versions (max 3 films)")
print(len(probs), "problems")
if len(sys.argv) > 1 and sys.argv[1] == "apply":
    if probs:
        sys.exit("not applied, fix problems first")
    files = {}
    for key, p in src.items():
        slug, name = key.split("|", 1)
        d = files.setdefault(p, json.load(open(p)))
        for k, x in out[slug][name].items():
            d[slug][name][k] = x
    for p, d in files.items():
        json.dump(d, open(p, "w"), indent=1, ensure_ascii=False)
    print("applied to", len(files), "diet files; now run python3 wip/diet/merge.py")
