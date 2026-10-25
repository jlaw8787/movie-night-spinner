"""Set phone-view fonts and colours for a format. Usage: set_phone.py <fmt> '<json of keys to change>'"""
import sys, json, re
REPO = '/home/claude/polish'
fmt, changes = sys.argv[1], json.loads(sys.argv[2])
p = REPO + '/formats.js'
s = open(p, encoding='utf-8').read()
m = re.search(rf'("{fmt}"|\b{fmt}):\{{"top"', s)
if not m: raise SystemExit('no phone palette for ' + fmt)
a = m.end() - len('{"top"'); b = s.index('}', a) + 1
obj = json.loads(s[a:b]); obj.update(changes)
s = s[:a] + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + s[b:]
open(p, 'w', encoding='utf-8').write(s)
print(fmt, 'phone updated')
