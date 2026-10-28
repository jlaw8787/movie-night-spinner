"""Recipe lint for data/recipes2: make ahead, unused ingredient lines, doubled lines, missing amounts.
Checks the base dish and every diet version (alt.veg, alt.af, alt.veg_af).
Run from the repo root: python3 wip/recipe/lint.py [OUT.json]   (prints counts, writes every finding to OUT.json)
Import: from lint import lint_dish, VERSIONS"""
import json, os, re, sys, collections

D = "data/recipes2"
VERSIONS = ("base", "veg", "af", "veg_af")
STOP = set("""a an the of and or for to with in on into fresh small large medium big finely roughly thinly chopped sliced diced grated
crushed minced softened melted cold warm hot juiced zested dried ground plus extra good quality taste serve serving serves cup cups jar
jars tin tins can cans bunch bunches handful pinch splash packet packets bottle bottles box boxes bag bags piece pieces slice slices
whole halved quartered cut strips cubes wedges rings drained rinsed peeled seeded trimmed picked torn shredded beaten room temperature
store bought storebought ready made readymade sheet sheets frozen thawed cooked uncooked raw plain lightly about each optional garnish
your choice any favourite some few more less lots keep set aside top topping""".split())
WAIT = re.compile(r"\b(chill(?!i)\w*|refrigerat\w*|fridge|overnight|marinat\w*|soak\w*|steep\w*|infus\w*|freez\w*|set (?:in|for|until)|until set|until firm|until cold|cool completely|rest (?:for )?(?:at least )?\d+ ?(?:hours?|hr))", re.I)
LONG = re.compile(r"overnight|\b\d+(?:\.\d+)? ?(?:to \d+ ?)?(?:hours?|hrs?)\b|\b(?:[3-9]\d|1\d\d) ?min", re.I)
MA_WAIT = re.compile(r"chill|fridge|refrigerat|overnight|marinat|soak|steep|infus|freez|set|cool|ahead|day|hours?|the night before|earlier|morning", re.I)


def words(s):
    return [w for w in re.findall(r"[a-z]+", s.lower()) if w not in STOP and len(w) > 2]


def stem(w):
    if len(w) > 4 and w.endswith("ies"):
        return w[:-3] + "y"
    if len(w) > 4 and (w.endswith("oes") or re.search(r"(s|x|z|ch|sh)es$", w)):
        return w[:-2]
    if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
        return w[:-1]
    return w


def head(item):
    return item.split(",")[0].split("(")[0].strip().lower()


def lint_dish(d):
    """Return list of (code, detail) for one dish or diet version dict."""
    out = []
    steps = d.get("steps") or []
    stext = " ".join(s.get("text", "") for s in steps)
    sw = set(stem(w) for w in re.findall(r"[a-z]+", stext.lower()))
    ma = (d.get("make_ahead") or "").strip()
    # make ahead
    if not ma:
        out.append(("no_make_ahead", ""))
    for i, s in enumerate(steps):
        t = s.get("text", "")
        m = WAIT.search(t)
        if m and (LONG.search(t) or (s.get("min") or 0) >= 30) and not MA_WAIT.search(ma):
            out.append(("wait_not_in_make_ahead", f"step {i}: {m.group(0)}"))
            break
    # ingredients
    ings = d.get("ingredients") or []
    heads = collections.Counter(head(x.get("item", "")) for x in ings)
    for i, x in enumerate(ings):
        item = x.get("item", "")
        ws = words(item.split(",")[0])
        seasoned = "season" in stext.lower() and re.search(r"\b(salt|pepper)\b", item, re.I)
        if ws and not seasoned and not any(stem(w) in sw for w in ws):
            out.append(("unused_line", f"ing {i}: {item}"))
        q = x.get("q")
        if (q in (None, "", 0)) and not re.search(r"to taste|a drop|drops|pinch|a dash|dash of|dashes|a few|to serve|for serving|to dust|to garnish|for garnish|for dusting|for frying|for greasing", item, re.I):
            out.append(("no_amount", f"ing {i}: {item}"))
        same = [g for g in ings if g.get("item", "").strip().lower() == item.strip().lower()]
        if len(same) > 1:
            out.append(("double_line", f"ing {i}: {item}"))
    if re.search(r"[‒-―−]", json.dumps(d, ensure_ascii=False)):
        out.append(("dash", ""))
    return out


def versions(dish):
    yield "base", dish
    for k, v in (dish.get("alt") or {}).items():
        yield k, v


def main():
    found = []
    counts = collections.Counter()
    films = collections.Counter()
    for fn in sorted(os.listdir(D)):
        if not fn.endswith(".json"):
            continue
        slug = fn[:-5]
        r = json.load(open(os.path.join(D, fn)))
        for dish in r.get("dishes", []):
            for ver, x in versions(dish):
                for code, det in lint_dish(x):
                    counts[(code, "base" if ver == "base" else "alt")] += 1
                    films[slug] += 1
                    found.append({"slug": slug, "dish": dish["n"], "ver": ver, "code": code, "detail": det})
    for (code, ver), n in sorted(counts.items()):
        print(f"{code:24s} {ver:5s} {n}")
    print("films with findings:", len(films), "total:", len(found))
    if len(sys.argv) > 1:
        json.dump(found, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
