"""Galaxy Video aisles from TMDB genres (data/film-genres.json) plus a few food themes. Writes aisles.js."""
import json,os,re,collections
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G=json.load(open(os.path.join(ROOT,'data/film-genres.json')))
TH={f"{f['title']} ({f['year']})":f['theme'] for f in json.load(open(os.path.join(ROOT,'data/films.json')))}
# hand checked: comedy-led capers and buddy cop films the genre order files under Crime (review 2, 3 Nov 2026)
OVERRIDE={'22 Jump Street (2014)':'Action and cops','48 Hrs. (1982)':'Action and cops','Hot Fuzz (2007)':'Action and cops',
  'Kingsman: The Secret Service (2014)':'Action and cops','Rumble in the Bronx (1995)':'Action and cops',
  'Ace Ventura: When Nature Calls (1995)':'Comedy and teen'}
# films where the songs carry the story, live action (animated musicals stay in Family where kids look for them) (Josh, 4 Nov 2026)
MUSICALS={'Annie (1982)','Chicago (2002)','Chitty Chitty Bang Bang (1968)','Dreamgirls (2006)','Easter Parade (1948)','Enchanted (2007)',
  'Fiddler on the Roof (1971)','Grease (1978)','Hairspray (2007)','Into the Woods (2014)','La La Land (2016)','Les Misérables (2012)',
  'Little Shop of Horrors (1986)','Mamma Mia! (2008)','Mamma Mia! Here We Go Again (2018)','Mary Poppins (1964)','Mary Poppins Returns (2018)',
  'Moulin Rouge! (2001)','My Fair Lady (1964)','Newsies (1992)','Oliver! (1968)','Rent (2005)','Rocketman (2019)',"Singin' in the Rain (1952)",
  'Sister Act (1992)','The Blues Brothers (1980)','The Greatest Showman (2017)','The Muppets Take Manhattan (1984)','The Muppets (2011)',
  'The Phantom of the Opera (2004)','The Rocky Horror Picture Show (1975)','The Sound of Music (1965)','The Wizard of Oz (1939)',
  'West Side Story (1961)','Wicked (2024)','Willy Wonka & the Chocolate Factory (1971)'}
def aisle(fid,g,th):
  if fid in OVERRIDE:return OVERRIDE[fid]
  if th=='xmas':return 'Holiday'
  if fid in MUSICALS:return 'Musicals'
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
