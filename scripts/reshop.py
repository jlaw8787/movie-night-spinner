"""Review 53: after a dish's shop lines change, patch the film's merged shopping list (data/recipes/<slug>.json "shopping")
   the same way: lines a dish dropped come off (or their amount comes down), lines it gained add in (same item and unit add up).
   python3 scripts/reshop.py BASE_REF [slug ...]   (no slugs: every recipes file changed since BASE_REF)
   Hand-tidied lines that no longer match are reported, never guessed. card-ops already rewrites text inside the shopping list,
   so name only the films changed by dish-swap.py or a direct edit, or check the films card-ops touched for doubled amounts."""
import json, re, subprocess, sys, os
R = os.path.join(os.path.dirname(__file__), '..'); os.chdir(R)
base = sys.argv[1]; slugs = sys.argv[2:]
if not slugs:
    out = subprocess.run(['git', 'diff', '--name-only', base, '--', 'data/recipes/'], capture_output=True, text=True).stdout.split()
    slugs = [os.path.basename(p)[:-5] for p in out]
RX = re.compile(r'^(\d+(?:\.\d+)?)\s*(g|kg|ml|L|l)?\s+(.+)$')
def parse(x):
    n, a = x.rsplit('@', 1) if '@' in x else (x, '')
    m = RX.match(n)
    return (a, (m.group(2) or '#'), re.sub(r's$', '', m.group(3)), float(m.group(1)), m.group(3)) if m else (a, '=', n, None, n)
def fmt(q): return str(int(q)) if q == int(q) else str(q)
def lines(r): return [x for c in 'smwd' for it in r.get(c, []) if isinstance(it, dict) for x in it.get('shop', [])]
for s in slugs:
    p = f'data/recipes/{s}.json'
    if not os.path.exists(p): continue
    r = json.load(open(p))
    if 'shopping' not in r: continue
    try: old = json.loads(subprocess.run(['git', 'show', f'{base}:{p}'], capture_output=True, text=True, check=True).stdout)
    except Exception: continue
    a, b = lines(old), lines(r)
    gone = list(a); add = []
    for x in b:
        if x in gone: gone.remove(x)
        else: add.append(x)
    sh = r['shopping']; notes = []
    for x in gone:
        if x in sh: sh.remove(x); continue
        k = parse(x)
        hit = next((i for i, y in enumerate(sh) if parse(y)[:3] == k[:3]), None)
        if hit is not None and k[3] is not None:
            y = parse(sh[hit]); q = y[3] - k[3]
            if q <= 0: sh.pop(hit)
            else: sh[hit] = f"{fmt(q)}{'' if y[1] in ('#','=') else y[1]} {y[4]}@{y[0]}".replace('  ', ' ')
        else: notes.append('could not take off: ' + x)
    for x in add:
        k = parse(x)
        hit = next((i for i, y in enumerate(sh) if parse(y)[:3] == k[:3]), None) if k[3] is not None else None
        if hit is not None:
            y = parse(sh[hit]); sh[hit] = f"{fmt(y[3] + k[3])}{'' if y[1] in ('#','=') else y[1]} {y[4]}@{y[0]}"
        elif x not in sh: sh.append(x)
    json.dump(r, open(p, 'w'), ensure_ascii=False)
    print(s, '-', len(gone), '+', len(add), *(['\n   ' + n for n in notes] if notes else []))
