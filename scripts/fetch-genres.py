"""Fetch TMDB genres for every film and write aisles.js (film id -> Galaxy Video aisle). Needs TMDB_KEY or ~/.tmdb_key; never commit the key."""
import json,os,time,urllib.request
from concurrent.futures import ThreadPoolExecutor
KEY=os.environ.get('TMDB_KEY') or open(os.path.expanduser('~/.tmdb_key')).read().strip()
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ids=json.load(open(os.path.join(ROOT,'data/tmdb-ids.json')))
cache_p=os.path.join(ROOT,'data/film-genres.json')
cache=json.load(open(cache_p)) if os.path.exists(cache_p) else {}
def get(item):
  fid,tid=item
  if fid in cache:return fid,cache[fid]
  for t in range(4):
    try:
      d=json.load(urllib.request.urlopen(f'https://api.themoviedb.org/3/movie/{tid}?api_key={KEY}',timeout=30))
      return fid,[g['name'] for g in d.get('genres',[])]
    except Exception as e:time.sleep(2*(t+1))
  return fid,None
with ThreadPoolExecutor(8) as ex:
  for fid,g in ex.map(get,ids.items()):
    if g is not None:cache[fid]=g
json.dump(cache,open(cache_p,'w'),indent=0,sort_keys=True)
print('genres for',len(cache),'of',len(ids))
