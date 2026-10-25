"""Vianne's chocolaterie, Lansquenet-sous-Tannes, Lent 1959.
The lid card of a gift box: single heavy card, two faces 816x1056 (US Letter).
Front: cocoa lid with a chilli red satin ribbon and bow, gilt title, the painted Easter shop window (signature, paint.py),
the Comte's Lent notice pinned on, and Vianne's welcome with her signature.
Back: gold-cream card with the counter menu under ribbon bands, the TMDB still of the sign going up,
Vianne's painted plate ("what do you see?"), and a river mooring card for the boats.
Writes photo crops, front/back .body.html and .html."""
import os, subprocess, sys
from PIL import Image, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('window.jpg')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)
W, H = 816, 1056
COCOA, COCOA2, CHILLI, GOLD, GOLDL, CREAM, PAPER = '#2a140d', '#3b1d12', '#a8261c', '#c99a45', '#e4c27a', '#f3e6cc', '#efdfbd'
FONTS = ('https://fonts.googleapis.com/css2?family=Berkshire+Swash'
         '&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Parisienne&display=swap')
DISP = "'Berkshire Swash', serif"; BODY = "'Cormorant Garamond', serif"; SCRIPT = "'Parisienne', cursive"

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

SIGN_W, SIGN_H = 240, 282
sg = ImageEnhance.Brightness(Image.open(S('lRfRTvt4o5nibxkUCZBl84OLGJl.jpg')).convert('RGB')).enhance(1.06)
fit(sg, SIGN_W, SIGN_H, (600, 0, 1560, 1080)).save(A('still-sign.jpg'), quality=90)
WIN_W, WIN_H = 556, 601
Image.open(A('window.jpg')).resize((WIN_W * 2, WIN_H * 2), Image.LANCZOS).save(A('window-crop.jpg'), quality=92)

# ---------------- pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')

def band(t, w=430):
    """Section title on a chilli satin ribbon with notched tails."""
    notch = (f'<div style="position: absolute; right: -1px; top: 0; width: 0; height: 0; border-top: 24px solid transparent; '
             f'border-bottom: 24px solid transparent; border-right: 18px solid {PAPER}"></div>')
    return (f'<div style="position: relative; width: {w}px; height: 48px; margin: 12px 0 4px; '
            f'background: linear-gradient(180deg, #c23a2c 0%, {CHILLI} 45%, #84190f 100%)">'
            f'<div style="position: absolute; left: 0; top: 5px; width: {w}px; height: 1px; background: {GOLDL}"></div>'
            f'<div style="position: absolute; left: 0; bottom: 5px; width: {w}px; height: 1px; background: {GOLDL}"></div>'
            f'<div style="position: absolute; left: 18px; top: 4px; font-family: {DISP}; font-size: 31px; line-height: 40px; color: {CREAM}; white-space: nowrap">{t}</div>{notch}</div>')

def item(name, price, desc, note='', gap=7):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 20px; line-height: 1.2; color: {CHILLI}; margin-top: 1px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; font-family: {BODY}; font-weight: 700; font-size: 28px; line-height: 1.02; color: {COCOA}">'
            f'<span>{name}</span><span style="white-space: nowrap; margin-left: 12px">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-weight: 500; font-size: 21px; line-height: 1.2; color: #3d261b; margin-top: 2px">{desc}</div>{n}</div>')

def frame_photo(o, src, alt, x, y, w, h, cap, ang=0):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; transform: rotate({ang}deg)">'
             f'<div style="background: {COCOA}; padding: 5px; box-shadow: 0 5px 14px rgba(40,16,6,0.35)">'
             f'<div style="border: 2px solid {GOLD}"><img src="{src}" alt="{alt}" style="display: block; width: {w - 14}px; height: {h}px"></div></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 19px; line-height: 1.2; color: {COCOA}; text-align: center; margin-top: 7px">{cap}</div></div>')

def page(inner, name, bg):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {0.10 if name == "front" else 0.22}">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

def gilt_border(o, inset, color, w=2):
    o.append(f'<div style="position: absolute; left: {inset}px; top: {inset}px; width: {W - 2 * inset}px; height: {H - 2 * inset}px; '
             f'border: {w}px solid {color}; box-sizing: border-box"></div>')

# ---------------- props ----------------
def lent_notice(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 262px; background: #f6f2e8; transform: rotate({ang}deg); '
             f'box-shadow: 0 6px 14px rgba(0,0,0,0.55); box-sizing: border-box; padding: 12px 16px 12px; text-align: center; border: 1px solid #c9c0ac">'
             f'<div style="position: absolute; left: 123px; top: -7px; width: 16px; height: 16px; border-radius: 50%; background: #6c6a66; box-shadow: 0 2px 3px rgba(0,0,0,0.5)"></div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 22px; letter-spacing: 0.3em; color: #1d1a18; line-height: 1">NOTICE</div>'
             f'<div style="width: 60px; height: 1px; background: #1d1a18; margin: 6px auto 6px"></div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 17px; line-height: 1.22; color: #1d1a18">During the holy season of Lent, the parish is asked to keep away from shops of indulgence.</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.2; color: #4a4440; margin-top: 6px">The Comte de Reynaud, Mayor</div></div>')

def mooring_card(o, x, y, ang):
    waves = ''.join(f'<div style="position: absolute; left: {12 + i * 22}px; bottom: 10px; width: 16px; height: 6px; border-top: 2px solid #3c6a78; border-radius: 50%"></div>' for i in range(9))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 230px; height: 146px; background: #e7ecdf; transform: rotate({ang}deg); '
             f'box-shadow: 0 5px 12px rgba(40,16,6,0.4); box-sizing: border-box; padding: 12px 14px; text-align: center; border-top: 8px solid #3c6a78; overflow: hidden">'
             f'{kicker("River landing", "#3c6a78", 14)}'
             f'<div style="font-family: {DISP}; font-size: 26px; line-height: 1.05; color: {COCOA}; margin-top: 3px">Boats welcome</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.22; color: {COCOA}; margin-top: 4px">Moor below the old mill.<br>Repairs done. Ask for Roux.</div>{waves}</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    gilt_border(o, 22, GOLD, 2); gilt_border(o, 30, '#6e4a22', 1)
    # the gift-box ribbon: down the left edge, tied at the top
    o.append(f'<img src="assets/ribbon-v.png" alt="" aria-hidden="true" style="position: absolute; left: 70px; top: 0; width: 48px; height: {H}px; display: block; box-shadow: 2px 0 6px rgba(0,0,0,0.45)">')
    o.append(f'<img src="assets/bow.png" alt="A red satin bow tied on the box lid" style="position: absolute; left: 22px; top: 18px; width: 144px; height: 144px; display: block">')
    cx0, cw = 150, W - 150 - 44
    o.append(f'<div style="position: absolute; left: {cx0}px; top: 54px; width: {cw}px; text-align: center">{kicker("Lansquenet-sous-Tannes, Lent 1959", GOLD)}</div>')
    o.append(f'<div style="position: absolute; left: {cx0}px; top: 74px; width: {cw}px; text-align: center; font-family: {DISP}; font-size: 76px; line-height: 1.05; color: {GOLDL}; '
             f'text-shadow: 0 3px 0 #120804">Chocolaterie</div>')
    o.append(f'<div style="position: absolute; left: {cx0}px; top: 160px; width: {cw}px; text-align: center; font-family: {BODY}; font-style: italic; font-weight: 600; '
             f'font-size: 23px; line-height: 1.2; color: {CREAM}">Fine chocolates, cocoa to drink, and small temptations</div>')
    # signature: the Easter window
    wx = cx0 + (cw - WIN_W) // 2 - 6
    o.append(f'<div style="position: absolute; left: {wx}px; top: 206px; padding: 6px; background: {GOLD}; box-shadow: 0 10px 28px rgba(0,0,0,0.6)">'
             f'<div style="border: 2px solid {COCOA}"><img src="assets/window-crop.jpg" alt="Painting of the chocolaterie window at dusk: a great chocolate Easter egg tied with a red bow on a gilt stand, '
             f'tiered stands of truffles either side, nests of foil eggs and rows of pralines on red velvet, jars and ribboned boxes on the shelves behind" '
             f'style="display: block; width: {WIN_W}px; height: {WIN_H}px"></div></div>')
    o.append(f'<div style="position: absolute; left: {cx0}px; top: 832px; width: {cw}px; text-align: center; font-family: {BODY}; font-style: italic; font-weight: 600; '
             f'font-size: 20px; line-height: 1.2; color: {GOLDL}">The Easter window. Admire it from the street, Monsieur le Comte.</div>')
    lent_notice(o, 140, 870, -3)
    o.append(f'<div style="position: absolute; left: 428px; top: 876px; width: 330px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 20px; line-height: 1.25; color: {CREAM}">'
             f'Come in out of the north wind. Say nothing, and I will guess your favorite. Open every day, Lent included.'
             f'<div style="font-family: {SCRIPT}; font-size: 40px; line-height: 1; color: {GOLDL}; margin-top: 4px">Vianne</div></div>')
    return page(''.join(o), 'front', f'radial-gradient(ellipse at 55% 40%, {COCOA2} 0%, {COCOA} 70%)')

# ---------------- BACK ----------------
def back():
    o = []
    gilt_border(o, 22, GOLD, 2); gilt_border(o, 30, CHILLI, 1)
    L, MW = 56, 456
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {MW}px">{kicker("Inside the box", CHILLI)}'
             f'<div style="font-family: {DISP}; font-size: 54px; line-height: 1.08; color: {COCOA}; margin-top: 4px">Small Temptations</div></div>')
    menu = (band('From the window', MW)
            + item('Truffles, six', '180 F', 'Dark ganache in cocoa, hazelnut or chili sugar.')
            + item('Mendiants', '150 F', 'Dark discs set with almond, hazelnut, raisin and fig.')
            + item('Candied orange peel', '170 F', 'Slow candied, then half dipped in bitter chocolate.')
            + item('The Easter box', '1959 F', 'Two dozen assorted, tied in red ribbon.', 'We post anywhere. Even Venice.')
            + band('At the counter', MW)
            + item('Chili hot chocolate', '60 F', 'Milk steeped with red pepper and cinnamon, dark bittersweet whisked in, flaky salt. Tiny cups.')
            + item('A little cocoa', '40 F', 'Sweet, warm and mild, for small ones.', 'A second cup for Pantoufle.')
            + item('Easter vin chaud', '80 F', 'Southern red warmed with orange, spices and honey.')
            + band('Armande&rsquo;s birthday supper', MW)
            + item('Duck confit', '900 F', 'Salted overnight, cooked slow in its own fat, then crisped. Duck fat potatoes, green salad.')
            + item('Chocolate mousse', '120 F', 'Dark bittersweet and whipped eggs in little cups, a pinch of chili salt.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 112px; width: {MW}px">{menu}</div>')
    RX = 538
    frame_photo(o, 'assets/still-sign.jpg', 'Vianne hangs the red and gold chocolaterie sign on its iron bracket against the stone wall', RX, 60, SIGN_W, SIGN_H,
                'Up went our sign, the day the north wind blew us in.', 1.5)
    o.append(f'<img src="assets/plate.png" alt="Vianne&rsquo;s earthenware plate painted with red and gold steps, spirals and a sun around a cacao pod" '
             f'style="position: absolute; left: {RX + 10}px; top: 446px; width: 220px; height: 220px; display: block">')
    o.append(f'<div style="position: absolute; left: {RX - 2}px; top: 668px; width: 236px; text-align: center; font-family: {BODY}; font-style: italic; font-weight: 600; '
             f'font-size: 20px; line-height: 1.2; color: {CHILLI}">Give the plate a spin.<br>Tell me what you see.</div>')
    mooring_card(o, RX + 6, 744, -3)
    o.append(f'<div style="position: absolute; left: {RX - 2}px; top: 916px; width: 236px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 16px; '
             f'line-height: 1.28; color: #5a3f2e">Prices in francs, subject to change with the wind. Wrapped by Josephine. Place de l&rsquo;&Eacute;glise. Tel. 20.00. Lent, 1959.</div>')
    return page(''.join(o), 'back', PAPER)

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Chocolaterie, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
