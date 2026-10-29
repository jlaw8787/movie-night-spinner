"""New films: look each one up on TMDB and write what the app needs, paths and keys only, never the API key.
Reads wip/newfilms/films-new.txt ("Title (Year)" per line). Writes wip/newfilms/tmdb.json:
{film id: {id, title, year, poster, cert, trailer, stills, logo, providers}}. Run on a branch by .github/workflows/new-films.yml."""
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request, pathlib
from difflib import SequenceMatcher
REPO = pathlib.Path(__file__).resolve().parent.parent
KEY = os.environ.get('TMDB_KEY', '').strip()
if not KEY: print('no TMDB key, nothing fetched'); sys.exit(0)
want = [l.strip() for l in open(REPO / 'wip/newfilms/films-new.txt', encoding='utf-8') if l.strip() and not l.startswith('#')]
def get(path, **params):
    params['api_key'] = KEY
    url = f'https://api.themoviedb.org/3/{path}?' + urllib.parse.urlencode(params)
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'MovieNightSpinner/1.0 (personal project)'})
            with urllib.request.urlopen(req, timeout=20) as r: return json.load(r)
        except Exception as e:
            if getattr(e, 'code', None) == 404: return {}
            time.sleep(1.5 * (attempt + 1))
    return {}
def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower().replace('&', 'and')
    s = re.sub(r'\b(part|episode)\b', '', s); s = re.sub(r'\bii\b', '2', s); s = re.sub(r'\biii\b', '3', s)
    s = re.sub(r'^the |^a |^an ', '', s); return re.sub(r'[^a-z0-9]+', '', s)
def match(title, year):
    cands = {}
    for q in [title] + ([title.split(':')[0]] if ':' in title else []):
        for params in ({'primary_release_year': year}, {'year': year}, {}):
            for r in get('search/movie', query=q, include_adult='false', **params).get('results', [])[:10]: cands[r['id']] = r
    def sc(r):
        t = norm(title); names = {norm(r.get('title', '')), norm(r.get('original_title', ''))}
        sim = 1.0 if t in names else max(SequenceMatcher(None, t, n).ratio() for n in names)
        ry = (r.get('release_date') or '0000')[:4]; dy = abs(int(ry) - int(year)) if ry.isdigit() and ry != '0000' else 9
        return sim * 3 - min(dy, 5) * 0.6 + min(r.get('vote_count', 0), 20000) / 40000 + (0.3 if r.get('poster_path') else -2), sim, dy
    if not cands: return None, 'none'
    best = max(cands.values(), key=lambda r: sc(r)[0]); _, sim, dy = sc(best)
    return best, ('high' if sim >= 0.9 and dy <= 1 else 'check')
AU_OK = {'G', 'PG', 'M', 'MA15+', 'R18+', 'X18+'}
NAME = {'Netflix Standard with Ads': 'Netflix', 'Netflix Kids': 'Netflix', 'Paramount Plus': 'Paramount+', 'Paramount Plus Premium': 'Paramount+', 'Paramount Plus Basic with Ads': 'Paramount+',
        'Amazon Prime Video': 'Prime Video', 'Amazon Prime Video with Ads': 'Prime Video', 'Disney Plus': 'Disney+', 'BINGE': 'Binge', 'Tubi TV': 'Tubi', '10': '10 Play',
        'Apple TV Store': 'Apple TV', 'Amazon Video': 'Prime Video', 'Google Play Movies': 'Google Play', 'AMC Plus': 'AMC+'}
def clean(lst):
    seen, out = set(), []
    for n, logo in lst:
        if n == 'JustWatch TV' or 'Amazon Channel' in n or 'Apple TV channel' in n: continue
        n2 = NAME.get(n, n)
        if n2 in seen: continue
        seen.add(n2); out.append([n2, logo])
    return out
out = {}
for fid in want:
    title, year = fid.rsplit(' (', 1); year = year.rstrip(')')
    best, conf = match(title, year)
    if not best: print('NOT FOUND', fid); out[fid] = {'conf': 'none'}; continue
    tid = best['id']; d = get(f'movie/{tid}', append_to_response='release_dates,videos,images,watch/providers', include_image_language='null,en,xx')
    cert = ''
    for c in ('AU', 'US'):
        for rc in d.get('release_dates', {}).get('results', []):
            if rc.get('iso_3166_1') == c:
                cs = [x.get('certification', '').strip() for x in rc.get('release_dates', []) if x.get('certification', '').strip()]
                if cs: cert = cs[0]; break
        if cert: break
    vids = [v for v in d.get('videos', {}).get('results', []) if v.get('site') == 'YouTube']
    vids.sort(key=lambda v: (v.get('type') != 'Trailer', not v.get('official'), v.get('iso_639_1') != 'en'))
    imgs = d.get('images', {})
    bd = sorted(imgs.get('backdrops', []), key=lambda b: (b.get('iso_639_1') is not None, -b.get('vote_count', 0), -b.get('vote_average', 0)))
    lg = sorted(imgs.get('logos', []), key=lambda b: (b.get('iso_639_1') != 'en', b.get('file_path', '').endswith('.svg'), -b.get('vote_average', 0), -b.get('vote_count', 0)))
    au = (d.get('watch/providers') or {}).get('results', {}).get('AU') or {}
    pick = lambda k: [[p['provider_name'], p.get('logo_path', '')] for p in sorted(au.get(k, []), key=lambda p: p.get('display_priority', 99))]
    prov = {'t': tid}
    if au: prov.update({'s': clean(pick('flatrate') + pick('free') + pick('ads'))[:6], 'r': clean(pick('rent'))[:4], 'b': clean(pick('buy'))[:4]})
    out[fid] = {'id': tid, 'conf': conf, 'tmdb_title': d.get('title'), 'tmdb_date': d.get('release_date'), 'runtime': d.get('runtime'), 'overview': d.get('overview'),
                'poster': d.get('poster_path'), 'cert': cert, 'trailer': vids[0]['key'] if vids else '',
                'stills': [[b['file_path'], b['width'], b['height'], b.get('iso_639_1')] for b in bd[:200]],
                'logo': [lg[0]['file_path'], lg[0]['width'], lg[0]['height']] if lg else None, 'providers': prov}
    print(fid, '->', tid, d.get('title'), d.get('release_date'), conf, cert, 'trailer' if vids else 'no trailer', len(bd), 'stills')
json.dump(out, open(REPO / 'wip/newfilms/tmdb.json', 'w'), ensure_ascii=False, indent=1)
