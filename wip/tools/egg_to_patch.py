"""Turn out_egg_*.jsonl (name/note/desc only) into full dish patches (adds how4/shop4 from current repo data) for dishwork/apply.py.
Usage: python3 egg_to_patch.py out_egg_*.jsonl > patch_eggs.jsonl"""
import json,re,os,sys,subprocess
REPO='/home/claude/polish'
slug=lambda s: re.sub(r'^-|-$','',re.sub(r'[^a-z0-9]+','-',s.lower()))
films={f"{f['title']} ({f['year']})":f for f in json.load(open(f'{REPO}/data/films.json'))}
ed=json.loads(subprocess.check_output(['node','-e','const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],"utf8")+";this.E=MOVIE_MENU_EDITIONS",c);process.stdout.write(JSON.stringify(c.E))',f'{REPO}/movie-menus.js']))
CK={'s':'S','m':'M','w':'W','d':'K'};first=lambda t:(re.split(r'(?<=[.!?])\s',t.strip())[0] if t else '')
W=os.path.dirname(os.path.abspath(__file__))
for fn in sys.argv[1:]:
  for l in open(fn if os.path.isabs(fn) else os.path.join(W,fn)):
    if not l.strip(): continue
    o=json.loads(l);fid=o['film'];f=films[fid]
    rp=f'{REPO}/data/recipes/{slug(fid)}.json';rec=json.load(open(rp)) if os.path.exists(rp) else {}
    exact=ed[fid]['menu'] if fid in ed else rec
    for d in o['dishes']:
      how=shop=None
      for src in (exact,rec):
        for it in src.get(d['course'],[]):
          if it['n']==d['old']: how,shop=it.get('how'),it.get('shop')
        if how: break
      pool=[x for x in f[CK[d['course']]] if x[0]==d['old']]
      if not how and pool:
        t=pool[0][2];fs=first(t);how=t[len(fs):].strip() or t
      if not shop and pool: shop=pool[0][3]
      d['how4']=how or '';d['shop4']=shop or []
    print(json.dumps(o,ensure_ascii=False))
