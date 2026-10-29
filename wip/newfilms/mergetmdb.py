"""Copy wip/newfilms/tmdb.json into the app's data: posters, ratings, trailers, where to watch,
TMDB ids, stills and logos. Only films that have a pack in wip/newfilms/packs/ (or are named) are merged.
  python3 wip/newfilms/mergetmdb.py [Film (Year) ...]"""
import json, re, sys, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
T = json.load(open(R / "wip/newfilms/tmdb.json"))
slug = lambda fid: re.sub(r"[^a-z0-9]+", "-", fid.lower()).strip("-")
packs = {json.load(open(p))["id"] for p in (R / "wip/newfilms/packs").glob("*.json")}
want = sys.argv[1:] or sorted(packs)
AU = {"G", "PG", "M", "MA15+", "R18+", "X18+"}
US2AU = {"G": "G", "PG": "PG", "PG-13": "M", "R": "MA15+", "NC-17": "R18+"}
def js_map(path, var):
    s = open(path, encoding="utf-8").read(); m = re.search(r"const " + var + r"=(\{.*?\});", s, re.S)
    return s, json.loads(m.group(1)), m
def js_put(path, var, data):
    s, _, m = js_map(path, var)
    s = s[:m.start(1)] + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + s[m.end(1):]
    open(path, "w", encoding="utf-8").write(s)
_, posters, _ = js_map(R / "tmdb-posters.js", "TMDB_POSTERS")
_, ratings, _ = js_map(R / "ratings.js", "RATINGS")
_, trailers, _ = js_map(R / "trailers.js", "TRAILERS")
_, provs, _ = js_map(R / "providers.js", "PROVIDERS")
ids = json.load(open(R / "data/tmdb-ids.json")); stills = json.load(open(R / "data/film-stills.json")); logos = json.load(open(R / "data/film-logos.json"))
problems = []
for fid in want:
    t = T.get(fid)
    if not t or not t.get("id"): problems.append(f"{fid}: not found on TMDB"); continue
    if t.get("conf") != "high": problems.append(f"{fid}: matched {t.get('tmdb_title')} {t.get('tmdb_date')} (check)")
    ids[fid] = t["id"]
    if t.get("poster"): posters[fid] = t["poster"]
    else: problems.append(f"{fid}: no poster")
    c = (t.get("cert") or "").replace(" ", "").strip(); ratings[fid] = c if c in AU else US2AU.get(c, "")
    trailers[fid] = t.get("trailer") or ""
    provs[fid] = t.get("providers") or {"t": t["id"]}
    if t.get("stills"): stills[fid] = t["stills"]
    if t.get("logo"): logos[fid] = t["logo"]
    print(f"{fid}: id {t['id']}, rating {ratings[fid] or '?'}, {'trailer' if trailers[fid] else 'no trailer'}, {len(t.get('stills') or [])} stills, {'logo' if t.get('logo') else 'no logo'}, streams {len((t.get('providers') or {}).get('s') or [])}")
js_put(R / "tmdb-posters.js", "TMDB_POSTERS", posters); js_put(R / "ratings.js", "RATINGS", ratings)
js_put(R / "trailers.js", "TRAILERS", trailers); js_put(R / "providers.js", "PROVIDERS", provs)
json.dump(ids, open(R / "data/tmdb-ids.json", "w"), ensure_ascii=False, separators=(",", ":"))
for name, d in (("film-stills", stills), ("film-logos", logos)):
    json.dump(d, open(R / f"data/{name}.json", "w"), ensure_ascii=False, indent=0)
for p in problems: print("CHECK", p)
