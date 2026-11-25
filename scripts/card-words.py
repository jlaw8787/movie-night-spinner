"""Review 52: swap words in what a card prints (dish names, notes, house lines, flavour, veg and no-alcohol notes), never in the
   method or the shopping list, so an American card can say tater tots while its recipe still buys potato gems for the shopper here.
   python3 scripts/card-words.py SPEC.json [--dry]
   SPEC is a list of {"id":"Film (Year)","pairs":[["old text","new text"], ...]}; pairs run in order, case sensitive, plain text.
   A dish name changes in every file together (films.json, dish-names, dish-notes keys, recipes n, recipes2 n, diet keys), so the
   card, phone, prep and page stay matched. Run edition-sync and build-data after."""
import json, os, re, sys
R = os.path.join(os.path.dirname(__file__), '..')
P = lambda p: os.path.join(R, p)
slug = lambda s: re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))
def rj(p): return json.load(open(P(p)))
def wj(p, v):
    raw = open(P(p)).read(); lines = raw.split('\n')
    ind = None if len(lines) < 3 else len(lines[1]) - len(lines[1].lstrip(' '))
    with open(P(p), 'w') as f:
        if ind: json.dump(v, f, ensure_ascii=False, indent=ind)
        else: json.dump(v, f, ensure_ascii=False, separators=(',', ':') if ', ' not in raw[:300] and ': ' not in raw[:300] else (', ', ': '))
        if raw.endswith('\n'): f.write('\n')
spec = json.load(open(sys.argv[1])); dry = '--dry' in sys.argv
films = rj('data/films.json'); DN = rj('data/dish-names.json'); DNO = rj('data/dish-notes.json')
H = rj('data/film-house.json'); FL = rj('data/film-flavour.json')
def sw(s, pairs, hits):
    if not isinstance(s, str): return s
    o = s
    for a, b in pairs: s = s.replace(a, b)
    if s != o: hits.append(o + '  ->  ' + s)
    return s
def deep(v, pairs, hits):
    if isinstance(v, str): return sw(v, pairs, hits)
    if isinstance(v, list): return [deep(x, pairs, hits) for x in v]
    if isinstance(v, dict): return {k: deep(x, pairs, hits) for k, x in v.items()}
    return v
for op in spec:
    fid, pairs = op['id'], op['pairs']; s = slug(fid); hits = []
    f = next((x for x in films if f"{x['title']} ({x['year']})" == fid), None)
    if not f: print('no film', fid); continue
    for K in 'SMWK':
        for r in f.get(K, []):
            r[0] = sw(r[0], pairs, hits); r[1] = sw(r[1], pairs, hits)
    for k in ('P',):
        if k in f: f[k] = sw(f[k], pairs, hits)
    if fid in DN: DN[fid] = deep(DN[fid], pairs, hits)
    if fid in DNO: DNO[fid] = deep(DNO[fid], pairs, hits)
    if fid in H:
        for k in ('s', 'd'):
            if isinstance(H[fid].get(k), dict):
                for kk in ('n', 'note', 'veg', 'af'):
                    if kk in H[fid][k]: H[fid][k][kk] = sw(H[fid][k][kk], pairs, hits)
    if fid in FL: FL[fid] = deep(FL[fid], pairs, hits)
    p = f'data/recipes/{s}.json'
    if os.path.exists(P(p)):
        rc = rj(p)
        for c in 'smwd':
            for it in rc.get(c, []) if isinstance(rc, dict) else []:
                for kk in ('n', 'note'):
                    if kk in it: it[kk] = sw(it[kk], pairs, hits)
        if not dry: wj(p, rc)
    p = f'data/recipes2/{s}.json'
    if os.path.exists(P(p)):
        rc = rj(p)
        for it in rc.get('dishes', []):
            if 'n' in it: it['n'] = sw(it['n'], pairs, hits)
        if not dry: wj(p, rc)
    p = f'data/diet/{s}.json'
    if os.path.exists(P(p)):
        rc = rj(p); nt = rc.get('notes', {})
        rc['notes'] = {sw(k, pairs, []): {kk: sw(vv, pairs, hits) for kk, vv in v.items()} if isinstance(v, dict) else v for k, v in nt.items()}
        if not dry: wj(p, rc)
    print(fid, ':', len(hits), 'changes')
    for h in dict.fromkeys(hits): print('   ', h[:220])
if not dry:
    wj('data/films.json', films); wj('data/dish-names.json', DN); wj('data/dish-notes.json', DNO)
    wj('data/film-house.json', H); wj('data/film-flavour.json', FL)
