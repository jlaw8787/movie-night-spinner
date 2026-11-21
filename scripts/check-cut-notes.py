"""Review 34 cut-notes sweep over a card dump (run the dump with photos on: the fit passes depend on them).
Every dish printed on the card must print its whole note, per layout.
   node scripts/dump-cards.cjs /tmp/cards.json && python3 scripts/check-cut-notes.py /tmp/cards.json [more dumps]"""
import json, re, sys, collections
dump = {}
for f in sys.argv[1:]: dump.update(json.load(open(f)))
nz = lambda t: re.sub(r'[^a-z0-9]+', ' ', re.sub(r'[‘’]', "'", str(t)).lower()).strip()
by = collections.defaultdict(list); seen = collections.Counter()
for fid, v in dump.items():
    if not v or v.get('err') or v.get('fmt') == 'card': continue
    face = nz(' '.join(v['faces'])); seen[v['fmt']] += 1
    for it in v['list']:
        if not it.get('note') or nz(it['n'])[:24] not in face: continue
        if nz(it['note']) not in face: by[v['fmt']].append((fid, it['n'], it['note']))
tot = sum(len(x) for x in by.values())
for fmt in sorted(seen): print(f'{fmt:10s} {seen[fmt]:4d} cards, {len(by[fmt])} cut notes')
for fmt, rows in by.items():
    for r in rows: print('  ', fmt, '|', r[0], '|', r[1], '|', r[2][:90])
print(f'{tot} cut notes on {sum(seen.values())} cards')
