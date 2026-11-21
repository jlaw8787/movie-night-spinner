"""Review 34: swap one dish for another everywhere a film keeps it, so the card, phone, recipe, prep and shopping stay matched.
   python3 scripts/dish-swap.py SPEC.json [--dry]
SPEC is a list of {"id":"Film (Year)","old":"Old dish name","new":{
   "n": name, "note": card note (dish first, then the film touch), "how": method paragraph, "shop": ["250g x@Aisle", ...],
   "r2": {"prep_min","cook_min","make_ahead","ingredients":[{"q","u","item","aisle"}],"steps":[{"text","min"}],"veg","af"},
   "veg": optional vegetarian note (diet file), "af": optional no-alcohol note}}
Touches data/films.json, dish-names, dish-notes, data/recipes, data/recipes2 and data/diet. Prints anything else still naming the old dish
(house lines, flavour, cue) so it can be fixed by hand. Run build-data after."""
import json, os, re, sys
R = os.path.join(os.path.dirname(__file__), '..')
P = lambda p: os.path.join(R, p)
slug = lambda s: re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))
def rj(p): return json.load(open(P(p)))
def wj(p, v, compact=False):
    raw = open(P(p)).read(); lines = raw.split('\n')
    ind = None if len(lines) < 3 else len(lines[1]) - len(lines[1].lstrip(' '))
    with open(P(p), 'w') as f:
        if ind: json.dump(v, f, ensure_ascii=False, indent=ind)
        else: json.dump(v, f, ensure_ascii=False, separators=(',', ':') if ', ' not in raw[:300] and ': ' not in raw[:300] else (', ', ': '))
        if raw.endswith('\n'): f.write('\n')
spec = json.load(open(sys.argv[1])); dry = '--dry' in sys.argv
films = rj('data/films.json'); DN = rj('data/dish-names.json'); DNO = rj('data/dish-notes.json')
KEYS = {'S': 's', 'M': 'm', 'W': 'w', 'K': 'd'}
for op in spec:
    fid, old, new = op['id'], op['old'], op['new']; s = slug(fid); log = []
    f = next(x for x in films if f"{x['title']} ({x['year']})" == fid)
    course = None
    for K in 'SMWK':
        for i, r in enumerate(f.get(K, [])):
            if r[0] == old:
                course = K
                f[K][i] = [new['n'], new['note'], new['how'], new['shop']] + r[4:]
                log.append('films')
    if not course: print('MISS films', fid, old); continue
    ci = 'SMWK'.index(course)
    if fid in DN:
        for j, n in enumerate(DN[fid][ci]):
            if n == old:
                DN[fid][ci][j] = new['n']; log.append('dish-names')
                if fid in DNO and j < len(DNO[fid][ci]): DNO[fid][ci][j] = new['note']; log.append('dish-notes')
    for d in ('recipes', 'recipes2', 'diet'):
        p = f'data/{d}/{s}.json'
        if not os.path.exists(P(p)): continue
        v = rj(p); hit = False
        if d == 'recipes':
            for c, lst in v.items():
                if not isinstance(lst, list): continue
                for i, it in enumerate(lst):
                    if isinstance(it, dict) and it.get('n') == old:
                        lst[i] = dict(it, n=new['n'], note=new['note'], how=new['how'], shop=new['shop']); hit = True
        elif d == 'recipes2':
            for i, it in enumerate(v.get('dishes', [])):
                if it.get('n') == old:
                    nd = dict(new['r2']); nd['n'] = new['n']; nd['course'] = it.get('course', KEYS[course])
                    v['dishes'][i] = {k: nd[k] for k in ['n', 'course'] + [k for k in nd if k not in ('n', 'course')]}; hit = True
        else:
            notes = v.setdefault('notes', {})
            if old in notes: notes.pop(old); hit = True
            dn = {}
            if new.get('veg'): dn['veg'] = new['veg']
            if new.get('af'): dn['af'] = new['af']
            if dn: notes[new['n']] = dn; hit = True
            if isinstance(v.get('text'), dict) and old in json.dumps(v['text']): print('  diet text names old dish', fid, old)
        if hit:
            log.append(d)
            if not dry: wj(p, v, compact=(d in ('recipes',)))
    if 'r2' in new and not any(l == 'recipes2' for l in log) and os.path.exists(P(f'data/recipes2/{s}.json')):
        print('  note: old dish had no recipes2 card (not one of the five)', fid, old)
    print(fid, ':', old, '->', new['n'], '|', ','.join(log))
    # anything else naming the old dish
    for p in ('data/film-flavour.json', 'data/film-house.json'):
        v = rj(p).get(fid)
        if v and old.lower() in json.dumps(v, ensure_ascii=False).lower(): print('  still named in', p)
    if old.lower() in (f.get('P', '') + f.get('T', '') + f.get('D', '')).lower(): print('  still named in cue/tagline/about')
# review 34: a poster edition (movie-menus.js) keeps its own copy of the menu: swap it there too
ME = open(P('movie-menus.js')).read(); pre = 'const MOVIE_MENU_EDITIONS = '; mi = ME.index(pre) + len(pre)
EDS = json.loads(re.sub(r';\s*$', '', ME[mi:])); ned = 0
for op in spec:
    e = EDS.get(op['id'])
    if not e: continue
    for k in ('s', 'm', 'w', 'd'):
        for j, it in enumerate(e.get('menu', {}).get(k, [])):
            if it.get('n') == op['old']:
                e['menu'][k][j] = dict(it, n=op['new']['n'], note=op['new']['note'], how=op['new']['how'], shop=op['new']['shop']); ned += 1
if ned: print(ned, 'poster edition dishes swapped')
if not dry:
    if ned:
        with open(P('movie-menus.js'), 'w') as fh: fh.write(ME[:mi] + json.dumps(EDS, ensure_ascii=False, separators=(',', ':')) + (';' if re.search(r';\s*$', ME) else '') + ('\n' if ME.endswith('\n') else ''))
    with open(P('data/films.json'), 'w') as fh: json.dump(films, fh, ensure_ascii=False, separators=(',', ':'))
    with open(P('data/dish-names.json'), 'w') as fh: json.dump(DN, fh, ensure_ascii=False, separators=(',', ':'))
    with open(P('data/dish-notes.json'), 'w') as fh: json.dump(DNO, fh, ensure_ascii=False, separators=(',', ':'))
