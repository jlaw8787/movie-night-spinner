"""Review 34 one-touch check. Usage: node scripts/dump-cards.cjs /tmp/cards.json, then python3 scripts/check-touch.py /tmp/cards.json [more dumps].
Flags a name used on 4 or more separate pieces of one card, any other film word on 3 or more, and any 4-word run printed in two pieces
(dish names with their own notes count as one piece; food words and the venue never count). Writes /tmp/touch.json."""
"""Repeat-touch finder over a card dump: a name or prop word that shows in 3 or more separate printed pieces
(dish names, notes, house lines, quote, cue, winks), or a 4-word run printed twice."""
import json, re, sys, collections, glob, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
dump = {}
for f in sys.argv[1:]:
    dump.update(json.load(open(f)))
STOP = set("""a an the and or of to in on at for with by from as is it its it's this that these those be been was were are am i you he she we they
him her them his hers our your their my me us not no yes but if so then than too very just only all any some more most much many one two three
four five six own up down out over under again off into onto per each every both few other such what which who whom whose when where why how
there here now ever never always still also get gets got go goes going gone come comes came make makes made take takes took give gives gave
put puts let lets say says said tell tells told see sees saw look looks keep keeps kept back way day night time first last next new old big
small little good great best better well right left long short hot cold warm cool side top whole half full end ends serve served serves
house film card menu table night""".split())
def norm(t):
    return re.sub(r'\s+', ' ', re.sub(r'[‘’]', "'", str(t or ''))).strip()
def stem(w):
    w = w.lower().strip("'")
    w = re.sub(r"'s$", '', w)
    for suf in ('ing', 'ed', 'es', 's'):
        if len(w) > 4 and w.endswith(suf):
            return w[:-len(suf)]
    return w
def words(t):
    return [stem(w) for w in re.findall(r"[A-Za-z][A-Za-z']+", t) if w.lower().strip("'") not in STOP and len(w) > 2]
# pieces per film, kept only when printed on the card
FILMD = {}
def film_data(fid):
    s = re.sub(r'[^a-z0-9]+', '-', fid.lower()).strip('-')
    p = f'{R}/data/film/{s}.json'
    return json.load(open(p)) if os.path.exists(p) else {}
MINW = int(os.environ.get('MINW', '3'))
PROPISH = set()
FOOD = set()
for p in glob.glob(R + '/data/recipes2/*.json'):
    for x in json.load(open(p)).get('dishes', []):
        for i in x.get('ingredients', []):
            for w in re.findall(r"[A-Za-z]+", str(i.get('item', ''))): FOOD.add(stem(w))
pieces_by = {}
df = collections.Counter()
for fid, v in dump.items():
    if not v or v.get('err') or v.get('fmt') in ('card',):
        continue
    face = norm(' '.join(v.get('faces', [])))
    fl = (film_data(fid).get('lib') or {}).get('flavour') or {}
    P = []
    for gi, it in enumerate(v.get('list', [])):
        P.append(('name', it['n'], gi))
        if it.get('note'): P.append(('note' if not it.get('house') else 'house', it['note'], gi))
    q = fl.get('note') or {}
    if q.get('text'): P.append(('quote', q['text'], 'q'))
    if v.get('cue'): P.append(('cue', v['cue'], 'c'))
    for wi, w in enumerate(fl.get('winks') or []): P.append(('wink', w, 'w%d' % wi))
    fl_low = face.lower()
    keep = []
    for k, t, g in P:
        t = norm(t)
        probe = t.lower()[:40]
        if k in ('name',) or probe[:25] in fl_low or k == 'cue':
            keep.append((k, t, g))
    pieces_by[fid] = (keep, fl)
    seen = set()
    for k, t, g in keep:
        for w in set(words(t)): seen.add(w)
    for w in seen: df[w] += 1
out = []
for fid, (keep, fl) in pieces_by.items():
    title = set(words(fid.split(' (')[0]))
    venue = set(words(fl.get('venue', '') + ' ' + fl.get('sign', '')))
    signer = set(words((fl.get('note') or {}).get('by', '')))
    cnt = collections.defaultdict(list)
    for i, (k, t, g) in enumerate(keep):
        for w in set(words(t)):
            cnt[w].append(i)
    flags = []
    for w, idx in cnt.items():
        groups = set(keep[i][2] for i in idx)
        caps = sum(1 for i in idx for m in re.finditer(r"(?<![.!?] )(?<!^)\b([A-Z][a-z']+)", keep[i][1]) if stem(m.group(1)) == w)
        proper = caps >= 1
        if len(groups) >= (MINW + 1 if proper else MINW) and df[w] <= 25 and w not in title and w not in venue and (w not in FOOD or len(groups) >= 4 and not proper and w in PROPISH):
            flags.append((w, [keep[i][:2] for i in sorted(set(idx))]))
    # 4-word runs printed in two pieces
    grams = collections.defaultdict(set)
    for i, (k, t, g) in enumerate(keep):
        ws = [x.lower() for x in re.findall(r"[A-Za-z']+", t)]
        for j in range(len(ws) - 3):
            g = ' '.join(ws[j:j + 4])
            if sum(1 for x in g.split() if x not in STOP) >= 2:
                grams[g].add(i)
    # a whole line printed twice (a run of six words in two pieces) or a shorter run in three pieces
    g6 = collections.defaultdict(set)
    for i, (k, t, g) in enumerate(keep):
        ws = [x.lower() for x in re.findall(r"[A-Za-z']+", t)]
        for j in range(len(ws) - 5): g6[' '.join(ws[j:j + 6])].add(i)
    for gr, idx in g6.items():
        if len(set(keep[i][2] for i in idx)) >= 2: flags.append(('"' + gr + '"', [keep[i][:2] for i in sorted(idx)]))
    for gr, idx in grams.items():
        if len(set(keep[i][2] for i in idx)) >= 3 and not all(x in FOOD or x in STOP for x in (stem(y) for y in gr.split())):
            flags.append(('"' + gr + '"', [keep[i][:2] for i in sorted(idx)]))
    if flags:
        out.append((fid, flags))
json.dump([[f, [[w, p] for w, p in fl]] for f, fl in out], open('/tmp/touch.json', 'w'), indent=0)
print(len(out), 'films flagged of', len(pieces_by))
for fid, flags in out[:int(os.environ.get('SHOW', '15'))]:
    print('==', fid)
    for w, ps in flags:
        print('  ', w, '|', ' || '.join(f'{k}: {t[:70]}' for k, t in ps))
