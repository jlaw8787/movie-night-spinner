"""Campfire signature crops: for each logo-signed strip film, report whether the signature box (52px tall, or the film's own
stillStrip.sh) cuts into the logo's top line or shows part of a second line. Logos are fetched from TMDB (w500) into a scratch folder.
Usage: python3 scripts/sig-crops.py [scratch_dir]"""
import json, os, sys, urllib.request
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fl = json.load(open(os.path.join(root, 'data/film-flavour.json')))
lg = json.load(open(os.path.join(root, 'data/film-logos.json')))
tmp = sys.argv[1] if len(sys.argv) > 1 else '/tmp/sig-logos'
os.makedirs(tmp, exist_ok=True)
bad = 0
for k, f in fl.items():
    s = f.get('stillStrip')
    if not s or k not in lg: continue
    so = s if isinstance(s, dict) else {}
    if so.get('sig') in ('name', 'full'): continue
    p, W, H = lg[k][:3]
    fn = os.path.join(tmp, p.strip('/'))
    if not os.path.exists(fn): urllib.request.urlretrieve('https://image.tmdb.org/t/p/w500' + p, fn)
    im = Image.open(fn).convert('RGBA'); w, h = im.size; px = im.getchannel('A').load()
    rows = [max(px[x, y] for x in range(0, w, 2)) > 60 for y in range(h)]
    bands, y = [], 0
    while y < h:
        if rows[y]:
            st = y
            while y < h and rows[y]: y += 1
            if bands and st - bands[-1][1] < h * .025: bands[-1][1] = y
            else: bands.append([st, y])
        else: y += 1
    asp = W / H; ih = (160 if asp > 3 else 118) / asp
    crop = so.get('sh', 52) / ih; top = bands[0][1] / h; nxt = bands[1][0] / h if len(bands) > 1 else 1
    st = 'clips top line' if crop < top - .005 else 'shows part of line 2' if nxt + .005 < crop < 1 else ''
    if st:
        bad += 1; print(f'{k}: {st} (box {crop:.3f}, top line ends {top:.3f}, suggest sh {int(ih * top) + 2})')
print('signature crops:', 'all clean' if not bad else f'{bad} to fix')
sys.exit(1 if bad else 0)
