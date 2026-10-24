"""After apply.py: repoint format spec k refs to renamed dishes and refresh their d/note text. Args: patch jsonl files."""
import json,re,sys
REPO='/home/claude/movie-night-spinner'
films=json.load(open(f'{REPO}/data/films.json'))
pool={f"{f['title']} ({f['year']})":{d[0] for k in 'SMWK' for d in f.get(k,[])} for f in films}
ren={};new={}
for fn in sys.argv[1:]:
  for l in open(fn):
    if not l.strip(): continue
    o=json.loads(l)
    for d in o['dishes']:
      ren[(o['film'],d['old'])]=d['name']
      if d['name']!=d['old'] or True: new[(o['film'],d['name'])]=d
src=open(f'{REPO}/formats.js').read().split('\n');fixed=0;upd=0
for i,line in enumerate(src):
  m=re.match(r'  ("[^"]+ \(\d{4}\)"):\{"fmt"',line)
  if not m: continue
  obj=json.loads('{'+line.strip().rstrip(',')+'}');fid=list(obj)[0];spec=obj[fid];hit=False
  for g in spec.get('groups',[]):
    for it in g.get('items',[]):
      k=it.get('k')
      if k not in pool.get(fid,set()) and (fid,k) in ren: it['k']=ren[(fid,k)];k=it['k'];fixed+=1;hit=True
      d=new.get((fid,k))
      if d and not it.get('how'):
        it['note']=d['note'];hit=True;upd+=1
        if it.get('n'): it['n']=d['name']
  if hit: src[i]='  '+json.dumps(fid,ensure_ascii=False)+':'+json.dumps(spec,ensure_ascii=False,separators=(',',':'))+(',' if line.rstrip().endswith(',') else '')
open(f'{REPO}/formats.js','w').write('\n'.join(src));print('k fixed',fixed,'notes updated',upd)
