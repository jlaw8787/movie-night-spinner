"""Hand fixes applied after merge.py (idempotent). Run from the repo root: python3 wip/diet/fixups.py"""
import json, glob, re
CHEESE = [(re.compile(r"^(grated )?(parmesan|parmigiano|grana padano)", re.I), "vegetarian parmesan-style cheese"),
          (re.compile(r"^(grated )?pecorino", re.I), "vegetarian pecorino-style cheese"),
          (re.compile(r"^(grated )?gruy[eè]re", re.I), "vegetarian gruyere-style cheese")]
STEP = [("Flying noodle", "and wine and", "and chicken stock and"),
        ("boilermaker", "chase it with the beer, or drop the shot glass carefully into the beer", "chase it with the lager, or drop the shot glass carefully into the lager"),
        ("hot buttered rum cider", "Strain the cider into mugs", "Strain the spiced apple juice into mugs")]
def main():
    n = 0
    for p in sorted(glob.glob("data/recipes2/*.json")):
        r = json.load(open(p)); before = json.dumps(r, ensure_ascii=False)
        for d in r["dishes"]:
            for k, x in (d.get("alt") or {}).items():
                if k in ("veg", "veg_af"):
                    for i in x["ingredients"]:
                        if re.search(r"vegetarian|-style", i["item"], re.I): continue
                        for rx, new in CHEESE:
                            m = rx.search(i["item"])
                            if m: i["item"] = (new + ", grated" if m.group(1) else new) + i["item"][m.end():]; break
                if k in ("af", "veg_af"):
                    stock = "chicken stock" in json.dumps(x["ingredients"])
                    for s in x["steps"]:
                        if stock: s["text"] = re.sub(r"\bShaoxing\b(?! wine vinegar)", "chicken stock", s["text"])
                        for name, a, b in STEP:
                            if name in x["n"]: s["text"] = s["text"].replace(a, b)
                    if "Flying noodle" in x["n"] and k == "af":
                        tot = sum(s["min"] for s in x["steps"]); x["prep_min"] = 15; x["cook_min"] = tot - 15
        after = json.dumps(r, ensure_ascii=False)
        if after != before: n += 1; json.dump(r, open(p, "w"), indent=1, ensure_ascii=False)
    print("fixups changed", n, "files")
if __name__ == "__main__": main()
