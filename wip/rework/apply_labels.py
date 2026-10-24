"""Apply rework/<fmt>.labels.json overrides into formats.js specs. Usage: apply_labels.py fmt1 fmt2 ..."""
import json,re,os,sys
R=os.path.dirname(os.path.abspath(__file__));REPO='/home/claude/polish'
BAN=['—','–','elevate','indulge','iconic','nod to','homage','perfect for']
src=open(REPO+'/formats.js').read().split('\n');idx={}
for i,l in enumerate(src):
  m=re.match(r'  ("[^"]+ \(\d{4}\)"):\{"fmt"',l)
  if m: idx[json.loads(m.group(1))]=i
for f in sys.argv[1:]:
  p=f'{R}/{f}.labels.json'
  if not os.path.exists(p): continue
  O=json.load(open(p))
  for fid,items in O.items():
    i=idx.get(fid)
    if i is None: print('NO FILM',f,fid);continue
    line=src[i];spec=json.loads('{'+line.strip().rstrip(',')+'}')[fid];n=0
    for g in spec['groups']:
      for it in g['items']:
        o=items.get(it['k'])
        if o:
          for k,v in o.items():
            if k in('n','d','note'):
              if any(b.lower() in v.lower() for b in BAN): print('BANNED',f,v)
              it[k]=v;n+=1
    miss=set(items)-{it['k'] for g in spec['groups'] for it in g['items']}
    if miss: print('UNKNOWN k',f,miss)
    src[i]='  '+json.dumps(fid,ensure_ascii=False)+':'+json.dumps(spec,ensure_ascii=False,separators=(',',':'))+(',' if line.rstrip().endswith(',') else '')
    print(f,fid,n,'fields')
open(REPO+'/formats.js','w').write('\n'.join(src))
