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
logo_path = REPO / 'data/film-logos.json'
logos = json.load(open(logo_path)) if logo_path.exists() else {}
for fid in want:
    tid = ids.get(fid)
    if not tid: print('no TMDB id for', fid); continue
    d = get(f'movie/{tid}/images?include_image_language=null,en,xx')
    if not d: print('failed', fid); continue
    bd = sorted(d.get('backdrops', []), key=lambda b: (b.get('iso_639_1') is not None, -b.get('vote_count', 0), -b.get('vote_average', 0)))
    out[fid] = [[b['file_path'], b['width'], b['height'], b.get('iso_639_1')] for b in bd[:200]]
    lg = sorted(d.get('logos', []), key=lambda b: (b.get('iso_639_1') != 'en', b.get('file_path','').endswith('.svg'), -b.get('vote_average', 0), -b.get('vote_count', 0)))
    if lg: logos[fid] = [lg[0]['file_path'], lg[0]['width'], lg[0]['height']]
    print(fid, len(out[fid]), 'logo' if lg else 'no logo')
json.dump(out, open(out_path, 'w'), indent=0, ensure_ascii=False)
json.dump(logos, open(logo_path, 'w'), indent=0, ensure_ascii=False)
