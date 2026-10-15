# Match films to TMDB posters. Usage: TMDB_KEY=... python3 scripts/tmdb-match.py films.json matches.json
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from difflib import SequenceMatcher

KEY = os.environ['TMDB_KEY']  # never commit the key
FILMS = json.load(open(sys.argv[1]))  # [{id,title,year}]
OUT = sys.argv[2]


def get(path, **params):
    params['api_key'] = KEY
    url = f'https://api.themoviedb.org/3/{path}?' + urllib.parse.urlencode(params)
    for attempt in range(5):
        try:
            with urllib.request.urlopen(url, timeout=20) as r:
                return json.load(r)
        except Exception as e:
            if getattr(e, 'code', None) == 404:
                return {}
            time.sleep(1.5 * (attempt + 1))
    return {}


def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = s.replace('&', 'and')
    s = re.sub(r'\b(part|episode)\b', '', s)
    s = re.sub(r'\b(ii)\b', '2', s); s = re.sub(r'\b(iii)\b', '3', s); s = re.sub(r'\b(iv)\b', '4', s)
    s = re.sub(r'^the |^a |^an ', '', s)
    return re.sub(r'[^a-z0-9]+', '', s)


def score(f, r):
    t = norm(f['title'])
    names = {norm(r.get('title', '')), norm(r.get('original_title', ''))}
    sim = max(SequenceMatcher(None, t, n).ratio() for n in names)
    if t in names:
        sim = 1.0
    ry = (r.get('release_date') or '0000')[:4]
    dy = abs(int(ry) - int(f['year'])) if ry.isdigit() and ry != '0000' else 9
    pop = min(r.get('vote_count', 0), 20000) / 20000
    return sim * 3 - min(dy, 5) * 0.6 + pop * 0.5 + (0.3 if r.get('poster_path') else -2), sim, dy


def match(f):
    cands = {}
    queries = [f['title']]
    if ':' in f['title']:
        queries.append(f['title'].split(':')[0])
    for q in queries:
        for params in ({'primary_release_year': f['year']}, {'year': f['year']}, {}):
            for r in get('search/movie', query=q, include_adult='false', **params).get('results', [])[:10]:
                cands[r['id']] = r
            if cands and any(score(f, r)[1] >= 0.9 and score(f, r)[2] == 0 for r in cands.values()):
                break
    if not cands:
        return {'id': f['id'], 'conf': 'none'}
    best = max(cands.values(), key=lambda r: score(f, r)[0])
    _, sim, dy = score(f, best)
    conf = 'exact' if sim >= 0.95 and dy == 0 else 'close' if sim >= 0.8 and dy <= 1 else 'weak'
    return {'id': f['id'], 'conf': conf, 'tmdb': best['id'], 'poster': best.get('poster_path'),
            'got': f"{best.get('title')} ({(best.get('release_date') or '')[:4]})", 'sim': round(sim, 2), 'dy': dy}


with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(match, FILMS))
json.dump(res, open(OUT, 'w'), indent=1)
from collections import Counter
print(Counter(r['conf'] for r in res), 'no poster:', sum(1 for r in res if r.get('conf') != 'none' and not r.get('poster')))
for r in res:
    if r['conf'] in ('weak', 'none', 'close'):
        print(r['conf'], '|', r['id'], '->', r.get('got'))
