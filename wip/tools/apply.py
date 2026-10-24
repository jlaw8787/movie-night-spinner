"""Apply dish overhaul patches (out_*.jsonl) to the repo.
Updates data/films.json, data/recipes/<slug>.json, movie-menus.js editions and k: references in formats.js.
Usage: python3 apply.py [--dry] out_01.jsonl ..."""
import json, os, re, sys, subprocess
REPO = '/home/claude/movie-night-spinner'
W = os.path.dirname(os.path.abspath(__file__))
dry = '--dry' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]
slug = lambda s: re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))
CK = {'s': 'S', 'm': 'M', 'w': 'W', 'd': 'K'}

films = json.load(open(f'{REPO}/data/films.json'))
byid = {f"{f['title']} ({f['year']})": f for f in films}
# editions: evaluate to JSON with node, edit, write back as one literal
ed = json.loads(subprocess.check_output(['node', '-e', 'const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],"utf8")+";this.E=MOVIE_MENU_EDITIONS",c);process.stdout.write(JSON.stringify(c.E))', f'{REPO}/movie-menus.js']))
fmt_src = open(f'{REPO}/formats.js').read()
stats = dict(films=0, dishes=0, recipes=0, editions=0, fmt_refs=0, skipped=0)
recipe_cache = {}

def fmt_rename(film, old, new):
    global fmt_src
    key = json.dumps(film, ensure_ascii=False)
    i = fmt_src.find(key + ':{')
    if i < 0: return
    j = fmt_src.find('\n  "', i + 1)
    j = len(fmt_src) if j < 0 else j
    block = fmt_src[i:j]
    old_k = 'k:' + json.dumps(old, ensure_ascii=False)
    if old_k in block:
        block2 = block.replace(old_k, 'k:' + json.dumps(new, ensure_ascii=False))
        stats['fmt_refs'] += block.count(old_k)
        fmt_src = fmt_src[:i] + block2 + fmt_src[j:]

for fn in files:
    for line in open(fn if os.path.isabs(fn) else os.path.join(W, fn)):
        line = line.strip()
        if not line: continue
        o = json.loads(line)
        fid = o['film']; f = byid.get(fid)
        if not f: stats['skipped'] += 1; continue
        stats['films'] += 1
        rp = f'{REPO}/data/recipes/{slug(fid)}.json'
        rec = recipe_cache.get(rp) or (json.load(open(rp)) if os.path.exists(rp) else None)
        if rec is not None: recipe_cache[rp] = rec
        for d in o['dishes']:
            K = CK[d['course']]; done = False
            for it in f.get(K, []):
                if it[0] == d['old']:
                    it[0], it[1], it[2], it[3] = d['name'], d['note'], d['desc'].rstrip() + ' ' + d['how4'], d['shop4']; done = True
            if rec is not None:
                for it in rec.get(d['course'], []):
                    if it['n'] == d['old']:
                        it.update(n=d['name'], note=d['note'], how=d['how4'], shop=d['shop4']); stats['recipes'] += 1; done = True
            if fid in ed:
                for it in ed[fid]['menu'].get(d['course'], []):
                    if it['n'] == d['old']:
                        it.update(n=d['name'], note=d['desc'], how=d['how4'], shop=d['shop4']); stats['editions'] += 1; done = True
            if done:
                stats['dishes'] += 1; fmt_rename(fid, d['old'], d['name'])
            else:
                stats['skipped'] += 1; print('not found:', fid, d['old'])
        if rec is not None and 'shopping' in rec:
            seen, shop = set(), []
            for k in 'smwd':
                for it in rec.get(k, []):
                    for s in it.get('shop', []):
                        if s not in seen: seen.add(s); shop.append(s)
            rec['shopping'] = shop
        if fid in ed and 'shopping' in ed[fid]['menu']:
            seen, shop = set(), []
            for k in 'smwd':
                for it in ed[fid]['menu'].get(k, []):
                    for s in it.get('shop', []):
                        if s not in seen: seen.add(s); shop.append(s)
            ed[fid]['menu']['shopping'] = shop

print(stats)
if not dry:
    json.dump(films, open(f'{REPO}/data/films.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    for rp, rec in recipe_cache.items(): json.dump(rec, open(rp, 'w'), ensure_ascii=False, separators=(',', ':'))
    mm = open(f'{REPO}/movie-menus.js').read()
    head = mm[:mm.index('const MOVIE_MENU_EDITIONS')]
    open(f'{REPO}/movie-menus.js', 'w').write(head + 'const MOVIE_MENU_EDITIONS = ' + json.dumps(ed, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(f'{REPO}/formats.js', 'w').write(fmt_src)
