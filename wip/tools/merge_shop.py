"""Rebuild 'shopping' for touched recipes/editions with quantities added up (same rule as shopGroups)."""
import json,glob,re,os,subprocess
REPO='/home/claude/polish'
AIS=["Meat","Seafood","Deli","Produce","Dairy","Bakery","Frozen","Pantry","Drinks","Bottle shop"]
UNIT={'g':('g',1),'kg':('g',1000),'ml':('ml',1),'l':('ml',1000),'L':('ml',1000)}
slug=lambda s: re.sub(r'^-|-$','',re.sub(r'[^a-z0-9]+','-',s.lower()))
def fmtq(q):
  q=round(q*100)/100; return str(int(q)) if q==int(q) else str(q)
MEAS={'bunch','tin','can','pinch','sprig','packet','pack','cup','tbsp','tsp','jar','bottle','bag','punnet','head','stick','sheet','slice','loaf','box','block','tub','carton','handful','piece','fillet','clove','stalk','knob','sachet','pod'}
def pl(word):
  if word.endswith('s') or not word.isalpha(): return word
  if word in('tbsp','tsp'): return word
  if word.endswith(('ch','sh','x')) or word in('tomato','potato','mango','avocado'): return word+'es'
  if word.endswith('y') and word[-2:-1] not in 'aeiou': return word[:-1]+'ies'
  if word.endswith('f'): return word
  return word+'s'
def plural(w):
  head,sep,tail=w.partition(',');ws=head.split()
  if not ws: return w
  if ws[0].lower() in MEAS: ws[0]=pl(ws[0])
  elif len(ws)<=3 and ws[-1].lower() not in MEAS: ws[-1]=pl(ws[-1])
  elif ws[-1].lower() in MEAS: ws[-1]=pl(ws[-1])
  return ' '.join(ws)+sep+tail
def merged(menu):
  tally={};order=[]
  for x in [s for k in 'smwd' for it in menu.get(k,[]) for s in it.get('shop',[])]:
    name,_,aisle=x.partition('@');a=aisle.strip() if aisle.strip() in AIS else 'Pantry';n=name.strip()
    m=re.match(r'^(\d+(?:\.\d+)?)\s*(kg|g|ml|L|l)?\s+(.+)$',n)
    key=f"{a}|{UNIT[m[2]][0] if m[2] else '#'}|{re.sub(r'(es|s)$','',m[3].lower())}" if m else f"{a}|={n}"
    if key not in tally:
      tally[key]=dict(a=a,n=n,m=dict(q=float(m[1])*(UNIT[m[2]][1] if m[2] else 1),u=UNIT[m[2]][0] if m[2] else '',what=m[3]) if m else None);order.append(key)
    elif m and tally[key]['m']:
      t=tally[key]['m'];t['q']+=float(m[1])*(UNIT[m[2]][1] if m[2] else 1)
      if not m[2] and m[3].endswith('s'): t['what']=m[3]
  out=[]
  for k in order:
    t=tally[k];lab=t['n']
    if t['m']:
      q,u,w=t['m']['q'],t['m']['u'],t['m']['what']
      amt=fmtq(q/1000)+('kg' if u=='g' else 'L') if u in('g','ml') and q>=1000 else fmtq(q)+u
      if not u and q>1: w=plural(w)
      lab=f"{amt} {w}"
    out.append(f"{lab}@{t['a']}")
  return out
touched={json.loads(l)['film'] for f in glob.glob(os.path.dirname(__file__)+'/out_*.jsonl') for l in open(f) if l.strip()}
n=0
for fid in touched:
  rp=f'{REPO}/data/recipes/{slug(fid)}.json'
  if os.path.exists(rp):
    r=json.load(open(rp))
    if 'shopping' in r: r['shopping']=merged(r);json.dump(r,open(rp,'w'),ensure_ascii=False,separators=(',',':'));n+=1
ed=json.loads(subprocess.check_output(['node','-e','const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],"utf8")+";this.E=MOVIE_MENU_EDITIONS",c);process.stdout.write(JSON.stringify(c.E))',f'{REPO}/movie-menus.js']))
e=0
for fid in touched:
  if fid in ed and 'shopping' in ed[fid]['menu']: ed[fid]['menu']['shopping']=merged(ed[fid]['menu']);e+=1
mm=open(f'{REPO}/movie-menus.js').read();head=mm[:mm.index('const MOVIE_MENU_EDITIONS')]
open(f'{REPO}/movie-menus.js','w').write(head+'const MOVIE_MENU_EDITIONS = '+json.dumps(ed,ensure_ascii=False,separators=(',',':'))+';\n')
print('recipes',n,'editions',e)
