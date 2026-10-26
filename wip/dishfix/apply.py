"""Apply wip/dishfix/out/pack*.json to data/films.json, data/recipes/<slug>.json and data/recipes2/<slug>.json.
Matches each dish by its old name; reports anything it could not match."""
import json,glob,re,os
R='/home/claude/polish'
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
P={}
for p in sorted(glob.glob(f'{R}/wip/dishfix/out/pack*.json')):
  for s,ch in json.load(open(p)).items():P.setdefault(s,[]).extend(ch)
F=json.load(open(f'{R}/data/films.json'));miss=[];n=0
DASH=re.compile('[–—]')
for f in F:
  s=slug(f"{f['title']} ({f['year']})")
  if s not in P:continue
  rp=f'{R}/data/recipes/{s}.json';r2p=f'{R}/data/recipes2/{s}.json'
  rec=json.load(open(rp)) if os.path.exists(rp) else None
  r2=json.load(open(r2p)) if os.path.exists(r2p) else None
  for c in P[s]:
    old,new,note=c['old'],c.get('n') or c['old'],c.get('note')
    if DASH.search(new+(note or '')):miss.append((s,old,'dash'));continue
    hit=False
    for k in 'SMWK':
      for row in f.get(k,[]):
        if row[0]==old:row[0]=new;hit=True;row[1]=note if note else row[1]
    if rec:
      for k in 'smwd':
        for d in rec.get(k,[]):
          if d.get('n')==old:d['n']=new;d['note']=note if note else d.get('note');hit=True
    if r2:
      for d in r2.get('dishes',[]):
        if d.get('n')==old:d['n']=new
    if hit:n+=1
    else:miss.append((s,old,'not found'))
  if rec:json.dump(rec,open(rp,'w'),ensure_ascii=False,separators=(',',':'))
  if r2:json.dump(r2,open(r2p,'w'),indent=1,ensure_ascii=False)
json.dump(F,open(f'{R}/data/films.json','w'),ensure_ascii=False,separators=(',',':'))
print('changed',n,'unmatched',len(miss));[print(' ',m) for m in miss[:30]]
