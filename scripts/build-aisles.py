"""Galaxy Video aisles from TMDB genres (data/film-genres.json) plus a few food themes. Writes aisles.js."""
import json,os,re,collections
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G=json.load(open(os.path.join(ROOT,'data/film-genres.json')))
TH={f"{f['title']} ({f['year']})":f['theme'] for f in json.load(open(os.path.join(ROOT,'data/films.json')))}
def aisle(fid,g,th):
  if th=='xmas':return 'Holiday'
  if th=='hero':return 'Superheroes'
  if 'Animation' in g or 'Family' in g[:2]:return 'Family'
  if 'Horror' in g:return 'Horror'
  if 'Western' in g:return 'Westerns'
  if th=='aussie':return 'Around the world'
  p=g[0] if g else 'Drama';top=g[:2]
  if p=='Science Fiction':return 'Sci-fi'
  if p=='Crime':return 'Crime and mob'
  if p=='Comedy':return 'Romance' if 'Romance' in g else 'Comedy and teen'
  if p=='Romance':return 'Romance'
  if p in('Adventure','Fantasy'):return 'Sci-fi' if 'Science Fiction' in top else 'Fantasy and adventure'
  if p in('Action','Thriller'):
    if 'Science Fiction' in top:return 'Sci-fi'
    if 'Crime' in top and p=='Thriller':return 'Crime and mob'
    return 'Action and cops'
  if 'Crime' in g:return 'Crime and mob'
  if 'Romance' in g:return 'Romance'
  return 'Drama'
out={}
for fid,g in G.items():out[fid]=aisle(fid,g,TH.get(fid,''))
miss=[f for f in G if f not in TH]
open(os.path.join(ROOT,'aisles.js'),'w').write('/* Galaxy Video aisles, by TMDB genre (scripts/build-aisles.py). */\nconst FILM_AISLE='+json.dumps(out,separators=(',',':'),sort_keys=True)+';\n')
print('films',len(out),'no theme found',len(miss),miss[:3]);print(collections.Counter(out.values()).most_common())
for k in ['Ghostbusters (1984)','Crocodile Dundee (1986)','Rush Hour 2 (2001)','The Godfather (1972)','Home Alone (1990)','Speed (1994)','Clueless (1995)','Alien (1979)','Wall Street (1987)','Men in Black (1997)']:print(' ',k,'->',out.get(k))
