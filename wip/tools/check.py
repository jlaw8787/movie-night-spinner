import json, sys, os, re
W = os.path.dirname(os.path.abspath(__file__))
AISLES = {"Meat", "Seafood", "Deli", "Produce", "Dairy", "Bakery", "Frozen", "Pantry", "Drinks", "Bottle shop"}
BANNED = ["—", "–", "elevate", "indulge", "perfect for", "delight", "McDonald", "KFC", "Coca-Cola", "Pepsi", "Starbucks"]
batches = {}
for n in os.listdir(W):
    if n.startswith("batch_"):
        for f in json.load(open(os.path.join(W, n))):
            batches[f["film"]] = f
errs = 0
def bad(msg):
    global errs; errs += 1; print("ERR", msg)
for path in sys.argv[1:]:
    p = path if os.path.isabs(path) else os.path.join(W, path)
    for ln, line in enumerate(open(p), 1):
        line = line.strip()
        if not line: continue
        try: o = json.loads(line)
        except Exception as e: bad(f"{path}:{ln} not JSON {e}"); continue
        f = batches.get(o.get("film"))
        if not f: bad(f"{path}:{ln} unknown film {o.get('film')}"); continue
        cur = {d["name"]: d for d in f["dishes"]}
        new_names = set(cur)
        for d in o.get("dishes", []):
            tag = f"{o['film']} / {d.get('old')}"
            for k in ["course", "old", "name", "note", "desc", "how4", "shop4"]:
                if not d.get(k): bad(f"{tag}: missing {k}")
            if d.get("old") not in cur: bad(f"{tag}: old name not found"); continue
            if cur[d["old"]]["course"] != d.get("course"): bad(f"{tag}: course changed")
            new_names.discard(d["old"])
            if d.get("name") in new_names: bad(f"{tag}: duplicate name")
            new_names.add(d.get("name"))
            if len(d.get("name", "")) > 46: bad(f"{tag}: name too long")
            w = len(d.get("desc", "").split())
            if not 10 <= w <= 32: bad(f"{tag}: desc {w} words")
            w = len(d.get("how4", "").split())
            if not 30 <= w <= 140: bad(f"{tag}: how4 {w} words")
            for s in d.get("shop4") or []:
                if "@" not in s or s.split("@")[-1].strip() not in AISLES: bad(f"{tag}: bad shop entry {s!r}")
            blob = json.dumps(d, ensure_ascii=False)
            for b in BANNED:
                if b.lower() in blob.lower(): bad(f"{tag}: banned text {b!r}")
print("OK" if not errs else f"{errs} problems")
