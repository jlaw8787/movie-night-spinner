"""Film stills from TMDB for the era menus. Lists each film's backdrops (no-language stills first) so a
menu can use a real frame from the film. Writes data/film-stills.json: paths only, never the API key.
Films come from scripts/stills-wanted.txt, one "Title (Year)" per line."""
import json, os, sys, time, urllib.request, pathlib
REPO = pathlib.Path(__file__).resolve().parent.parent
ids = json.load(open(REPO / 'data/tmdb-ids.json'))
want = [l.strip() for l in open(REPO / 'scripts/stills-wanted.txt') if l.strip() and not l.startswith('#')]
key = os.environ.get('TMDB_KEY', '').strip()
if not key: print('no TMDB key, nothing fetched'); sys.exit(0)
def get(path):
    for _ in range(4):
        try:
            with urllib.request.urlopen(f'https://api.themoviedb.org/3/{path}&api_key={key}', timeout=20) as r: return json.load(r)
        except Exception: time.sleep(1)
    return None
out_path = REPO / 'data/film-stills.json'
out = json.load(open(out_path)) if out_path.exists() else {}
for fid in want:
    tid = ids.get(fid)
    if not tid: print('no TMDB id for', fid); continue
    d = get(f'movie/{tid}/images?include_image_language=null,en')
    if not d: print('failed', fid); continue
    bd = sorted(d.get('backdrops', []), key=lambda b: (b.get('iso_639_1') is not None, -b.get('vote_count', 0), -b.get('vote_average', 0)))
    out[fid] = [[b['file_path'], b['width'], b['height'], b.get('iso_639_1')] for b in bd[:40]]
    print(fid, len(out[fid]))
json.dump(out, open(out_path, 'w'), indent=0, ensure_ascii=False)
