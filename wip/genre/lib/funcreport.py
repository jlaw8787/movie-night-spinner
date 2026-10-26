"""Summarise funcsweep.py output: python3 wip/genre/lib/funcreport.py SWEEP.json [--list]"""
import json, re, sys, collections
R = json.load(open(sys.argv[1]))
NUM = re.compile(r"^\s*(\d+(?:\.\d+)?)(?:\s+(\d)/(\d))?\s*(kg|g|ml|l)?\b", re.I)
def amt(s):
    m = NUM.match(s)
    if not m: return None
    v = float(m.group(1)) + (int(m.group(2)) / int(m.group(3)) if m.group(2) else 0)
    u = (m.group(4) or "").lower()
    return v * (1000 if u in ("kg", "l") else 1)
P = collections.defaultdict(list)
for r in R:
    f = r["film"]
    errs = [e for e in r.get("errors", []) if "favicon" not in e]
    if errs: P["page error or slow menu"].append((f, errs[0][:140]))
    if not r.get("cardText") or r.get("cardText", 0) < 200: P["menu card empty"].append((f, r.get("cardText")))
    if r.get("cardImgs"): P["broken image on menu"].append((f, r["cardImgs"][:2]))
    if not r.get("prepVisible"): P["prep sheet not showing"].append((f, "")); continue
    p4 = r.get("p4") or {}
    if not r.get("r2"): P["no planner recipes"].append((f, "")); continue
    if not r.get("planner"): P["planner box not showing"].append((f, ""))
    menu = [x.strip().lower() for x in (r.get("menu") or [])]; r2 = [x.strip().lower() for x in r["r2"]]
    extra = [x for x in r2 if x not in menu]; missing = [x for x in menu if x not in r2]
    if missing: P["menu dish missing from prep sheet"].append((f, missing))
    if extra: P["prep sheet dish not on menu"].append((f, extra))
    if len(p4.get("shop", [])) < 3: P["shopping list under 3 items"].append((f, len(p4.get("shop", []))))
    st = p4.get("steps", [])
    if len(st) != len(r2): P["method count differs from dishes"].append((f, f"{len(st)} vs {len(r2)}"))
    for s in st:
        if not s.get("how") or len(s["how"]) < 20: P["dish with no method text"].append((f, s.get("n")))
        if not re.search(r"Prep \d", s.get("t", "")): P["dish with no prep time"].append((f, s.get("n")))
    if not re.search(r"SERVES 4", p4.get("serves", "").upper()): P["serves line wrong"].append((f, p4.get("serves")))
    if r.get("overflow", 0) > 4: P["prep sheet text cut off"].append((f, r.get("overflow")))
    if str(r.get("g8")) != "8": P["guest buttons did not change guests"].append((f, r.get("g8")))
    else:
        a = [amt(x) for x in p4.get("shop", [])]; b = [amt(x) for x in (r.get("p8") or {}).get("shop", [])]
        pairs = [(x, y) for x, y in zip(a, b) if x and y]
        if pairs:
            bad = [(x, y) for x, y in pairs if not (1.6 <= y / x <= 2.4)]
            if len(bad) > max(1, 0.25 * len(pairs)): P["quantities did not double for 8 guests"].append((f, bad[:3]))
        else: P["no numeric quantities to scale"].append((f, p4.get("shop", [])[:3]))
        if "SERVES 8" not in (r.get("p8") or {}).get("serves", "").upper(): P["serves line did not update"].append((f, (r.get("p8") or {}).get("serves")))
    p0 = r.get("p0") or {}
    if r.get("boxes") and not p0.get("empty"): P["untick all did not clear list"].append((f, len(p0.get("shop", []))))
    if r.get("boxes") and r.get("pBack") != len(p4.get("shop", [])): P["re-tick did not restore list"].append((f, f"{r.get('pBack')} vs {len(p4.get('shop', []))}"))
    tr = r.get("trolley")
    if r.get("trolleyErr") or tr is None or tr < 0: P["tick-off shopping list failed"].append((f, r.get("trolleyErr") or tr))
    elif tr < len(p4.get("shop", [])): P["tick-off list shorter than prep list"].append((f, f"{tr} vs {len(p4.get('shop', []))}"))
print(f"{len(R)} films swept")
for k in sorted(P, key=lambda k: -len(P[k])):
    print(f"\n{k}: {len(P[k])}")
    for x in P[k][: (999 if "--list" in sys.argv else 5)]: print("   ", x[0], "|", x[1])
