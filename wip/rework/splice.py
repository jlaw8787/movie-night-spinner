"""Splice rework/<fmt>.js renderer functions into formats.js by function name. Usage: splice.py fmt1 fmt2 ..."""
import json,sys,re,os,subprocess
R=os.path.dirname(os.path.abspath(__file__));REPO='/home/claude/polish'
L={x['fmt']:x for x in json.load(open(R+'/list.json'))}
src=open(REPO+'/formats.js').read()
def span(s,name):
  i=s.find('function '+name+'(')
  if i<0: raise SystemExit('not found '+name)
  j=s.index('{',s.index(')',i));d=0;k=j;q=None;esc=False
  while True:
    c=s[k]
    if q:
      if esc: esc=False
      elif c=='\\': esc=True
      elif c==q: q=None
    elif c in '"\'`': q=c
    elif c=='{': d+=1
    elif c=='}':
      d-=1
      if d==0: return i,k+1
    k+=1
for f in sys.argv[1:]:
  fn=L[f]['fn'];new=open(f'{R}/{f}.js').read().strip()
  a,b=span(new,fn);newfn=new[a:b]
  extra=(new[:a]+new[b:]).strip()
  i,j=span(src,fn);src=src[:i]+newfn+src[j:]
  print(f,fn,'ok','EXTRA CODE OUTSIDE FN: '+extra[:80] if extra else '')
open(REPO+'/formats.js','w').write(src)
r=subprocess.run(['node','--check',REPO+'/formats.js'],capture_output=True,text=True);print('syntax',r.returncode,r.stderr[:300])
