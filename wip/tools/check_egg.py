import json,sys,os,glob
W=os.path.dirname(os.path.abspath(__file__))
BANNED=["—","–","elevate","indulge","perfect for","delight","iconic","nod to","homage","McDonald","KFC","Coca-Cola","Pepsi","Starbucks"]
cur={}
for n in glob.glob(W+'/egg_*.json'):
  for f in json.load(open(n)): cur[f['film']]=f
errs=0
def bad(m):
  global errs;errs+=1;print('ERR',m)
for p in sys.argv[1:]:
  p=p if os.path.isabs(p) else os.path.join(W,p)
  for ln,l in enumerate(open(p),1):
    if not l.strip(): continue
    try:o=json.loads(l)
    except Exception as e: bad(f'{p}:{ln} not JSON');continue
    f=cur.get(o.get('film'))
    if not f: bad(f"unknown film {o.get('film')}");continue
    names={d['name']:d for d in f['dishes']};now=set(names)
    for d in o['dishes']:
      t=f"{o['film']} / {d.get('old')}"
      for k in ['course','old','name','note','desc']:
        if not d.get(k): bad(f'{t}: missing {k}')
      if d.get('old') not in names: bad(f'{t}: old name not found');continue
      if names[d['old']]['course']!=d.get('course'): bad(f'{t}: course changed')
      now.discard(d['old'])
      if d['name'] in now: bad(f'{t}: duplicate name')
      now.add(d['name'])
      if len(d['name'])>46: bad(f'{t}: name too long')
      w=len(d['desc'].split())
      if not 10<=w<=32: bad(f'{t}: desc {w} words')
      blob=json.dumps(d,ensure_ascii=False).lower()
      for b in BANNED:
        if b.lower() in blob: bad(f'{t}: banned {b!r}')
print('OK' if not errs else f'{errs} problems')
