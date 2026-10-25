"""Turn a finished print design into the site's era menu renderer.

Usage: python3 to_renderer.py <print folder> <fmt> <renderer fn name> <face1.html> [face2.html ...] [--mm W,H] [--fonts "<css2 query>"] [--fams "A,B,C"]

Each face file is a full rendered HTML page (as written by the design's build.py in local mode).
Images it uses are copied into assets/era/<fmt>/ as compressed WebP, the faces become one renderer
function in formats.js (replacing the old one), and FMT_FONTS / FMT_FAMS for the format are updated.
Run node scripts/build-data.cjs afterwards."""
import sys, os, re, json, hashlib
from PIL import Image

REPO = '/home/claude/polish'
args = sys.argv[1:]
opts = {}
while '--' in ' '.join(args):
    for i, a in enumerate(args):
        if a.startswith('--'):
            opts[a[2:]] = args[i + 1]; del args[i:i + 2]; break
folder, fmt, fn, faces = args[0], args[1], args[2], args[3:]
out_dir = os.path.join(REPO, 'assets', 'era', fmt)
os.makedirs(out_dir, exist_ok=True)

def body_of(path):
    t = open(path, encoding='utf-8').read()
    b = t.split('<body>', 1)[1].rsplit('</body>', 1)[0] if '<body>' in t else t
    return b.strip()

def port_image(src, base):
    if src.startswith(('http://', 'https://', 'data:', 'assets/era/')): return src
    p = os.path.normpath(os.path.join(base, src))
    if not os.path.exists(p): raise SystemExit('missing image: ' + p)
    im = Image.open(p)
    if os.path.basename(p).startswith('paper-grain'):
        sd = os.path.join(REPO, 'assets', 'era', '_shared'); os.makedirs(sd, exist_ok=True)
        tgt = os.path.join(sd, 'paper-grain.webp')
        if not os.path.exists(tgt): im.convert('RGBA').resize((1123, round(im.height * 1123 / im.width)), Image.LANCZOS).save(tgt, 'WEBP', quality=45, method=6)
        return 'assets/era/_shared/paper-grain.webp'
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    im = im.convert('RGBA' if has_alpha else 'RGB')
    texture = bool(re.search(r'grain|wear|weather|paper|texture|stain', os.path.basename(p)))
    cap = 900 if texture else 1700
    if im.width > cap: im = im.resize((cap, round(im.height * cap / im.width)), Image.LANCZOS)
    name = os.path.splitext(os.path.basename(p))[0] + '-' + hashlib.sha1(open(p, 'rb').read()).hexdigest()[:6] + '.webp'
    im.save(os.path.join(out_dir, name), 'WEBP', quality=(32 if texture else (80 if not has_alpha else 85)), method=6)
    return f'assets/era/{fmt}/{name}'

html_faces = []
size = None
for f in faces:
    path = os.path.join(folder, f)
    b = body_of(path)
    b = re.sub(r'<link[^>]+>', '', b)
    b = re.sub(r'<!--.*?-->', '', b, flags=re.S)
    b = re.sub(r'src="([^"]+)"', lambda m: f'src="{port_image(m.group(1), os.path.dirname(path))}"', b)
    b = re.sub(r"url\('([^']+)'\)", lambda m: f"url('{port_image(m.group(1), os.path.dirname(path))}')", b)
    m = re.search(r'width:\s*(\d+(?:\.\d+)?)px;\s*height:\s*(\d+(?:\.\d+)?)px', b)
    w, h = round(float(m.group(1))), round(float(m.group(2)))
    size = size or (w, h)
    if (w, h) != size: raise SystemExit(f'faces differ in size: {size} vs {(w, h)}')
    b = re.sub(r'\s*\n\s*', ' ', b).replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    html_faces.append(b)

w, h = size
mm = [float(x) for x in opts['mm'].split(',')] if 'mm' in opts else [round(w * 25.4 / 96, 1), round(h * 25.4 / 96, 1)]
names = json.loads(opts['names']) if 'names' in opts else [f'Side {i + 1}' for i in range(len(html_faces))]
sheet = {'w': w, 'h': h, 'faces': names, 'mm': mm}
js = f'function {fn}(f,spec,menu,poster){{\n  return fmtFaces([\n' + ',\n'.join(f'`{x}`' for x in html_faces) + f'\n  ],{fn}.sheet);\n}}\n{fn}.sheet={json.dumps(sheet)};\n'

src = open(os.path.join(REPO, 'formats.js'), encoding='utf-8').read()
start = src.index(f'function {fn}(')
nxt = re.compile(r'^(?:function\s+\w+|const\s+\w+\s*=|let\s+\w+\s*=)', re.M)
m = nxt.search(src, start + 10)
end = m.start() if m else len(src)
src = src[:start] + js + src[end:]
if 'fonts' in opts:
    src, n = re.subn(rf'("{fmt}"|\b{fmt}):"family=[^"]*"', lambda mm_: f'{mm_.group(1)}:"{opts["fonts"]}"', src, count=1)
    if not n: raise SystemExit('FMT_FONTS entry not found for ' + fmt)
if 'fams' in opts:
    fams = json.dumps(opts['fams'].split(','))
    src, n = re.subn(rf'("{fmt}"|\b{fmt}):\[[^\]]*\]', lambda mm_: f'{mm_.group(1)}:{fams}', src, count=1)
    if not n: raise SystemExit('FMT_FAMS entry not found for ' + fmt)
open(os.path.join(REPO, 'formats.js'), 'w', encoding='utf-8').write(src)
kb = sum(os.path.getsize(os.path.join(out_dir, x)) for x in os.listdir(out_dir)) // 1024
print(f'{fn}: {len(html_faces)} face(s) {w}x{h}, renderer {len(js)//1024}KB, assets {kb}KB')
