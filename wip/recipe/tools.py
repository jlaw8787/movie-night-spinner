"""Recipe polish batch tools. Run from the repo root.
  python3 wip/recipe/tools.py jobs N            split findings into wip/recipe/jobs/jobNN.json, N films per job
  python3 wip/recipe/tools.py check OUT.json    apply a patch in memory, report format errors and what is still flagged
  python3 wip/recipe/tools.py apply OUT.json... apply patches to data/recipes2 for real
  python3 wip/recipe/tools.py sync              copy fixed diet versions back into wip/diet/out so merge.py keeps them
Patch format (OUT.json): {slug: {dish name: {version: ops}}}, version is base, veg, af or veg_af.
ops: make_ahead: str | ing: [{"i":n,"set":{...fields}} | {"i":n,"del":true} | {"add":{q,u,item,aisle}}]
     | steps: [{"i":n,"text":str} | {"i":n,"min":int} | {"add":{"text":str,"min":int},"at":n}]"""
import json, os, re, sys, copy, glob, collections
sys.path.insert(0, os.path.dirname(__file__))
from lint import lint_dish, versions

D = "data/recipes2"
AISLES = {"Meat", "Seafood", "Deli", "Produce", "Dairy", "Bakery", "Frozen", "Pantry", "Drinks", "Bottle shop", "Spices"}
UNITS = {"", "g", "kg", "ml", "l", "tsp", "tbsp", "cup"}
DASH = re.compile(r"[‒-―−]")


def load(slug):
    return json.load(open(f"{D}/{slug}.json"))


def get_ver(dish, ver):
    if ver == "base":
        return dish
    return (dish.get("alt") or {}).get(ver)


def apply_ops(x, ops, where):
    errs = []
    if "make_ahead" in ops:
        if not isinstance(ops["make_ahead"], str) or not ops["make_ahead"].strip():
            errs.append(f"{where}: empty make_ahead")
        else:
            x["make_ahead"] = ops["make_ahead"].strip()
    ings = x.setdefault("ingredients", [])
    dels, adds = set(), []
    for op in ops.get("ing", []):
        if "add" in op:
            adds.append(op["add"])
            continue
        i = op.get("i")
        if not isinstance(i, int) or not 0 <= i < len(ings):
            errs.append(f"{where}: bad ingredient index {i}")
            continue
        if op.get("del"):
            dels.add(i)
        elif "set" in op:
            ings[i].update(op["set"])
    steps = x.setdefault("steps", [])
    sadds = []
    for op in ops.get("steps", []):
        if "add" in op:
            sadds.append(op)
            continue
        i = op.get("i")
        if not isinstance(i, int) or not 0 <= i < len(steps):
            errs.append(f"{where}: bad step index {i}")
            continue
        if "text" in op:
            steps[i]["text"] = op["text"]
        if "min" in op:
            steps[i]["min"] = op["min"]
        if op.get("del"):
            steps[i]["__del"] = True
    x["ingredients"] = [g for j, g in enumerate(ings) if j not in dels] + adds
    for op in sorted(sadds, key=lambda o: -o.get("at", len(steps))):
        steps.insert(min(op.get("at", len(steps)), len(steps)), dict(op["add"]))
    x["steps"] = [s for s in steps if not s.pop("__del", False)]
    for g in x["ingredients"]:
        if g.get("aisle") not in AISLES:
            errs.append(f"{where}: aisle {g.get('aisle')!r} on {g.get('item')}")
        if g.get("u", "") not in UNITS:
            errs.append(f"{where}: unit {g.get('u')!r} on {g.get('item')}")
        if not g.get("item"):
            errs.append(f"{where}: ingredient with no item")
    for s in x["steps"]:
        if not s.get("text"):
            errs.append(f"{where}: empty step")
    if DASH.search(json.dumps(x, ensure_ascii=False)):
        errs.append(f"{where}: em or en dash")
    return errs


def patch_films(patch):
    """Return {slug: patched recipe}, errors."""
    out, errs = {}, []
    for slug, dishes in patch.items():
        if not os.path.exists(f"{D}/{slug}.json"):
            errs.append(f"{slug}: no such film")
            continue
        r = copy.deepcopy(out.get(slug) or load(slug))
        byname = {d["n"]: d for d in r["dishes"]}
        for name, vers in dishes.items():
            if name not in byname:
                errs.append(f"{slug}: no dish {name!r}")
                continue
            for ver, ops in vers.items():
                x = get_ver(byname[name], ver)
                if x is None:
                    errs.append(f"{slug} / {name}: no {ver} version")
                    continue
                errs += apply_ops(x, ops, f"{slug} / {name} / {ver}")
        out[slug] = r
    return out, errs


def remaining(recipes):
    left = []
    for slug, r in recipes.items():
        for dish in r["dishes"]:
            for ver, x in versions(dish):
                for code, det in lint_dish(x):
                    left.append(f"{slug} / {dish['n']} / {ver}: {code} {det}")
    return left


def cmd_jobs(n):
    found = json.load(open("wip/recipe/lint-before.json"))
    by = collections.defaultdict(lambda: collections.defaultdict(list))
    for f in found:
        by[f["slug"]][f["dish"]].append(f)
    slugs = sorted(by)
    os.makedirs("wip/recipe/jobs", exist_ok=True)
    films = {}
    for f in json.load(open("data/films.json")):
        films[re.sub(r"[^a-z0-9]+", "-", (f["title"] + " (" + f["year"] + ")").lower()).strip("-")] = f
    for j in range(0, len(slugs), n):
        job = {}
        for slug in slugs[j:j + n]:
            r = load(slug)
            fm = films.get(slug, {})
            ent = {"film": (fm.get("title", slug) + " (" + str(fm.get("year", "")) + ")"), "dishes": {}}
            for dish in r["dishes"]:
                if dish["n"] not in by[slug]:
                    continue
                vs = {}
                for ver, x in versions(dish):
                    fl = [f"{c} {d}".strip() for c, d in lint_dish(x)]
                    if not fl:
                        continue
                    vs[ver] = {"findings": fl, "course": dish.get("course"), "make_ahead": x.get("make_ahead", ""),
                               "prep_min": x.get("prep_min"), "cook_min": x.get("cook_min"),
                               "ingredients": [f"{i}: {g.get('q')} {g.get('u','')} | {g.get('item')} | {g.get('aisle')}" for i, g in enumerate(x.get("ingredients", []))],
                               "steps": [f"{i}: ({s.get('min')} min) {s.get('text')}" for i, s in enumerate(x.get("steps", []))]}
                    if ver != "base":
                        vs[ver]["name"] = x.get("n")
                if vs:
                    ent["dishes"][dish["n"]] = vs
            job[slug] = ent
        p = f"wip/recipe/jobs/job{j // n + 1:02d}.json"
        json.dump(job, open(p, "w"), indent=1, ensure_ascii=False)
        print(p, len(job), "films", sum(len(v["dishes"]) for v in job.values()), "dishes")


def cmd_check(paths, write=False):
    patch = {}
    for p in paths:
        for slug, ds in json.load(open(p)).items():
            for name, vs in ds.items():
                for ver, ops in vs.items():
                    patch.setdefault(slug, {}).setdefault(name, {})[ver] = ops
    rec, errs = patch_films(patch)
    left = remaining(rec)
    for e in errs:
        print("ERROR", e)
    for l in left:
        print("LEFT ", l)
    print(f"{len(rec)} films patched, {len(errs)} errors, {len(left)} findings still flagged (some may be fine, e.g. an item a step names by a shorter word)")
    if write and not errs:
        for slug, r in rec.items():
            with open(f"{D}/{slug}.json", "w") as o:
                json.dump(r, o, indent=1, ensure_ascii=False)
        print("written")
    elif write:
        print("NOT written, fix errors first")


def cmd_sync():
    """Copy diet versions from data/recipes2 back into wip/diet/out entries that already exist."""
    n = 0
    for p in sorted(glob.glob("wip/diet/out/*.json")):
        isveg = os.path.basename(p).startswith("veg")
        d = json.load(open(p))
        changed = False
        for slug, ds in d.items():
            if not os.path.exists(f"{D}/{slug}.json"):
                continue
            byname = {x["n"]: x for x in load(slug)["dishes"]}
            for name, alt in ds.items():
                dish = byname.get(name)
                if not dish:
                    continue
                kinds = alt.items() if isveg else [("af", alt)]
                for kind, x in kinds:
                    cur = (dish.get("alt") or {}).get(kind)
                    if not cur:
                        continue
                    new = {k: cur[k] for k in x if k in cur}
                    if new != {k: x[k] for k in new}:
                        x.update(new)
                        changed = True
                        n += 1
        if changed:
            json.dump(d, open(p, "w"), indent=1, ensure_ascii=False)
    print("synced", n, "diet versions")


if __name__ == "__main__":
    c = sys.argv[1]
    if c == "jobs":
        cmd_jobs(int(sys.argv[2]))
    elif c == "check":
        cmd_check(sys.argv[2:])
    elif c == "apply":
        cmd_check(sys.argv[2:], write=True)
    elif c == "sync":
        cmd_sync()
