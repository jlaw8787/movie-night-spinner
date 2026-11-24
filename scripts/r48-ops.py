"""Review 48: rename dishes and set printed notes in every copy a film keeps, from one ops file.
   python3 scripts/r48-ops.py OPS.json [--dry]
OPS is a list of {"id":"Film (Year)", "ops":[...]} with:
   {"ren":"Old dish name","to":"New dish name"}   every string holding the old name (veg and no-alcohol alt names, diet keys too)
   {"note":"Dish name (after any rename)","to":"New note."}   films.json note, dish-notes and the printed copy in data/recipes
   {"sub":"old text","to":"new text"}   plain substring swap across the film's own data (flavour, house, cue, notes)
   {"set":"flavour.field"|"house.s"|"house.d"|"cue","value":...}
Touches data/films.json, film-flavour, film-house, dish-names, dish-notes, data/recipes, recipes2 and diet.
Run edition-sync and build-data after."""
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
def walk(v, fn):
    if isinstance(v, str): return fn(v)
    if isinstance(v, list): return [walk(x, fn) for x in v]
    if isinstance(v, dict): return {fn(k): walk(x, fn) for k, x in v.items()}
    return v
dry = '--dry' in sys.argv
spec = json.load(open(sys.argv[1]))
films = rj('data/films.json'); FL = rj('data/film-flavour.json'); HO = rj('data/film-house.json')
DN = rj('data/dish-names.json'); DNO = rj('data/dish-notes.json')
files = {}
def per(fid):
    s = slug(fid); out = []
    for d in ('recipes', 'recipes2', 'diet'):
        p = f'data/{d}/{s}.json'
        if os.path.exists(P(p)):
            if p not in files: files[p] = rj(p)
            out.append(p)
    return out
bad = 0
for blk in spec:
    fid = blk['id']; f = next((x for x in films if f"{x['title']} ({x['year']})" == fid), None)
    if not f: print('NO FILM', fid); bad += 1; continue
    ps = per(fid)
    for op in blk['ops']:
        if 'ren' in op or 'sub' in op:
            old, new = op.get('ren') or op.get('sub'), op['to']; n = [0]
            def fn(s):
                if old in s: n[0] += 1; return s.replace(old, new)
                return s
            for K in 'SMWKTDP':
                if K in f: f[K] = walk(f[K], fn)
            for D in (FL, HO, DN, DNO):
                if fid in D: D[fid] = walk(D[fid], fn)
            for p in ps: files[p] = walk(files[p], fn)
            if not n[0]: print('MISS', fid, old); bad += 1
        elif 'note' in op:
            dish, note = op['note'], op['to']; hit = 0
            for ci, K in enumerate('SMWK'):
                for r in f.get(K, []):
                    if r[0] == dish:
                        r[1] = note; hit += 1
                        if fid in DN and fid in DNO:
                            for j, nm in enumerate(DN[fid][ci]):
                                if nm == dish and j < len(DNO[fid][ci]): DNO[fid][ci][j] = note
            rp = f'data/recipes/{slug(fid)}.json'
            if rp in files:
                for c, lst in files[rp].items():
                    if isinstance(lst, list):
                        for it in lst:
                            if isinstance(it, dict) and it.get('n') == dish: it['note'] = note; hit += 1
            if not hit: print('MISS note', fid, dish); bad += 1
        elif 'set' in op:
            k, v = op['set'], op['value']
            if k.startswith('flavour.'): FL.setdefault(fid, {})[k[8:]] = v
            elif k in ('house.s', 'house.d'): HO.setdefault(fid, {})[k[6:]] = v
            elif k == 'cue': f['P'] = v
            else: print('BAD SET', k); bad += 1
# a poster edition (movie-menus.js) keeps its own copy of the menu: carry renames and notes there too
ME = open(P('movie-menus.js')).read(); pre = 'const MOVIE_MENU_EDITIONS = '; mi = ME.index(pre) + len(pre)
EDS = json.loads(re.sub(r';\s*$', '', ME[mi:])); ned = 0
for blk in spec:
    e = EDS.get(blk['id'])
    if not e: continue
    for op in blk['ops']:
        if 'ren' in op or 'sub' in op:
            old, new = op.get('ren') or op.get('sub'), op['to']
            EDS[blk['id']] = e = walk(e, lambda s: s.replace(old, new)); ned += 1
        elif 'note' in op:
            for k in ('s', 'm', 'w', 'd'):
                for it in e.get('menu', {}).get(k, []):
                    if it.get('n') == op['note']: it['note'] = op['to']; ned += 1
        elif op.get('set') == 'cue' and 'cue' in e: e['cue'] = op['value']; ned += 1
if ned: print(ned, 'poster edition changes')
if not dry:
    if ned:
        with open(P('movie-menus.js'), 'w') as fh: fh.write(ME[:mi] + json.dumps(EDS, ensure_ascii=False, separators=(',', ':')) + (';' if re.search(r';\s*$', ME) else '') + ('\n' if ME.endswith('\n') else ''))
    wj('data/films.json', films); wj('data/film-flavour.json', FL); wj('data/film-house.json', HO)
    wj('data/dish-names.json', DN); wj('data/dish-notes.json', DNO)
    for p, v in files.items(): wj(p, v)
print('done', 'dry' if dry else '', 'misses', bad)
