"""Where to watch in Australia, from TMDB (data by JustWatch). Run by publish.sh, refreshes every run.
Writes providers.js (names and logos only, no API key). Needs /home/claude/.tmdb_key; keeps the old file without it."""
import json, os, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
import pathlib
REPO = str(pathlib.Path(__file__).resolve().parent.parent)
ids = json.load(open(REPO + '/data/tmdb-ids.json'))
films = [{'title': k.rsplit(' (', 1)[0], 'year': k.rsplit(' (', 1)[1].rstrip(')')} for k in ids]
key = os.environ.get('TMDB_KEY', '').strip()
if not key and os.path.exists('/home/claude/.tmdb_key'): key = open('/home/claude/.tmdb_key').read().strip()
if not key:
    print('providers.js: no TMDB key, kept the old file'); sys.exit(0)
def get(path):
    for _ in range(4):
        try:
            with urllib.request.urlopen(f'https://api.themoviedb.org/3/{path}?api_key={key}', timeout=20) as r:
                return json.load(r)
        except Exception:
            time.sleep(1)
    return None
NAME = {'Netflix Standard with Ads': 'Netflix', 'Netflix Kids': 'Netflix', 'Paramount Plus': 'Paramount+', 'Paramount Plus Premium': 'Paramount+', 'Paramount Plus Basic with Ads': 'Paramount+',
        'Amazon Prime Video': 'Prime Video', 'Amazon Prime Video with Ads': 'Prime Video', 'Disney Plus': 'Disney+', 'BINGE': 'Binge', 'Tubi TV': 'Tubi', '10': '10 Play',
        'Apple TV Store': 'Apple TV', 'Amazon Video': 'Prime Video', 'Google Play Movies': 'Google Play', 'AMC Plus': 'AMC+'}
DROP = ('JustWatch TV',)
def clean(lst):
    seen, out = set(), []
    for n, logo in lst:
        if n in DROP or 'Amazon Channel' in n or 'Apple TV channel' in n: continue
        n2 = NAME.get(n, n)
        if n2 in seen: continue
        seen.add(n2); out.append([n2, logo])
    return out
def one(f):
    fid = f"{f['title']} ({f['year']})"; tid = ids.get(fid)
    if not tid: return fid, None
    d = get(f'movie/{tid}/watch/providers')
    if d is None: return fid, 'ERR'
    au = d.get('results', {}).get('AU')
    if not au: return fid, {'t': tid}
    pick = lambda k: [[p['provider_name'], p.get('logo_path', '')] for p in sorted(au.get(k, []), key=lambda p: p.get('display_priority', 99))]
    s = clean(pick('flatrate') + pick('free') + pick('ads'))
    return fid, {'t': tid, 's': s[:6], 'r': clean(pick('rent'))[:4], 'b': clean(pick('buy'))[:4]}
out = {}; errs = 0
with ThreadPoolExecutor(8) as ex:
    for fid, v in ex.map(one, films):
        if v == 'ERR': errs += 1; continue
        if v: out[fid] = v
path = REPO + '/providers.js'
if errs > 40 and os.path.exists(path):
    print('providers.js: too many lookups failed (', errs, '), kept the old file'); sys.exit(0)
open(path, 'w').write('/* Where to watch in Australia. Data from TMDB, sourced from JustWatch. s stream, r rent, b buy. */\nconst PROVIDERS=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\nconst PROVIDERS_DATE="' + time.strftime('%Y-%m-%d') + '";\n')
st = sum(1 for v in out.values() if v.get('s')); ren = sum(1 for v in out.values() if not v.get('s') and (v.get('r') or v.get('b')))
print(f'providers.js: {st} streaming, {ren} rent or buy only, {len(films)-st-ren} nowhere in AU, {errs} failed')
