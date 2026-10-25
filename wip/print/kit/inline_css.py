"""Inline a build's head <style> class rules into a renderer function in formats.js.
Usage: python3 inline_css.py <fnName> <build front.html>"""
import re,sys
fn,src=sys.argv[1],sys.argv[2]
css=re.search(r'<style>(.*?)</style>',open(src).read(),re.S).group(1)
rules={}
for sel,decl in re.findall(r'([^{}]+)\{([^}]*)\}',css):
    sel=sel.strip()
    if re.fullmatch(r'\.[\w-]+',sel): rules[sel[1:]]=' '.join(decl.split()).strip(';')
s=open('formats.js').read()
a=s.index(f'function {fn}('); b=s.index(f'{fn}.sheet=',a)
body=s[a:b]; miss=set()
def tag(m):
    t=m.group(0); cm=re.search(r'\sclass="([^"]*)"',t)
    if not cm: return t
    cls=cm.group(1).split(); decl=';'.join(rules[c] for c in cls if c in rules)
    miss.update(c for c in cls if c not in rules)
    t=t.replace(cm.group(0),'')
    sm=re.search(r'\sstyle="([^"]*)"',t)
    if sm: t=t.replace(sm.group(0),f' style="{decl};{sm.group(1)}"')
    elif decl: t=re.sub(r'^<(\w+)',lambda x:f'<{x.group(1)} style="{decl}"',t)
    return t
body=re.sub(r'<\w+[^<>]*>',tag,body)
open('formats.js','w').write(s[:a]+body+s[b:])
print(fn,'inlined',len(rules),'rules; unknown classes:',sorted(miss))
