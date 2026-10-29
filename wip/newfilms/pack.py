"""Pull everything one film owns into a single 'pack', or merge packs back into the data files.
  python3 wip/newfilms/pack.py get "Scream (1996)" > pack.json
  python3 wip/newfilms/pack.py put wip/newfilms/packs/*.json      (adds or replaces those films)"""
import json, re, sys, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
D = R / "data"
slug = lambda fid: re.sub(r"[^a-z0-9]+", "-", fid.lower()).strip("-")
KEYED = ["film-format", "film-flavour", "film-palette", "dish-names", "dish-notes"]
def load(n): return json.load(open(D / f"{n}.json"))
def get(fid):
    s = slug(fid); films = load("films"); f = next(x for x in films if f"{x['title']} ({x['year']})" == fid)
    p = {"id": fid, "film": f}
    for k in KEYED:
        v = load(k).get(fid)
        if v is not None: p[k] = v
    for sub in ("recipes", "recipes2", "diet"):
        fp = D / sub / f"{s}.json"
        if fp.exists(): p[sub] = json.load(open(fp))
    p["series"] = [sr["id"] for sr in load("series") if fid in sr.get("release", []) or fid in (sr.get("story") or [])]
    return p
def put(paths):
    films = load("films"); keyed = {k: load(k) for k in KEYED}; series = load("series")
    for path in paths:
        p = json.load(open(path)); fid = p["id"]; f = p["film"]; assert f"{f['title']} ({f['year']})" == fid, fid
        films = [x for x in films if f"{x['title']} ({x['year']})" != fid] + [f]
        for k in KEYED:
            if k in p: keyed[k][fid] = p[k]
        s = slug(fid)
        for sub in ("recipes", "recipes2", "diet"):
            if sub in p:
                (D / sub).mkdir(exist_ok=True); json.dump(p[sub], open(D / sub / f"{s}.json", "w"), ensure_ascii=False, indent=1)
        for sid in p.get("series", []):
            if isinstance(sid, dict) and sid.get("new"):
                name = sid["new"]; nid = slug(name); sr = next((x for x in series if x["id"] == nid), None)
                if not sr:
                    have = [f"{x['title']} ({x['year']})" for x in films if x["title"] == name or x["title"].startswith(name + " ") or x["title"].startswith(name + ":")]
                    sr = {"id": nid, "name": name, "release": sorted(set(have) - {fid}, key=lambda x: int(x.rsplit("(", 1)[1].rstrip(")"))), "story": None}; series.append(sr); print("new series", nid, sr["release"])
                sid = nid
            sr = next((x for x in series if x["id"] == sid), None)
            if not sr: print("unknown series", sid, "for", fid); continue
            for key in ("release", "story"):
                if key in sr and sr[key] is not None and fid not in sr[key]:
                    yr = lambda x: int(x.rsplit("(", 1)[1].rstrip(")"))
                    if key == "release": sr[key] = sorted(sr[key] + [fid], key=yr)
                    else: print(f"place {fid} in the story order of {sid} by hand")
        print("put", fid)
    json.dump(films, open(D / "films.json", "w"), ensure_ascii=False, indent=1)
    for k, v in keyed.items(): json.dump(v, open(D / f"{k}.json", "w"), ensure_ascii=False, indent=1)
    json.dump(series, open(D / "series.json", "w"), ensure_ascii=False, indent=1)
if __name__ == "__main__":
    if sys.argv[1] == "get": print(json.dumps(get(sys.argv[2]), ensure_ascii=False, indent=1))
    else: put(sys.argv[2:])
