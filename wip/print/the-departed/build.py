"""Fitzy's Tap & Grill, West Broadway, South Boston, 2006. The neighbourhood bar where Costello's crew drinks.
Laminated pub menu, two portrait faces 672x1056 (7 x 11 in). Harp green board, cream type, State House gold.
Front: sign, the real three-decker street photo (signature), starters, Costello's note, Citizens envelope.
Back: Mr. C's corner table still, suppers, dessert, the bar, visitor badge, fine print.
Writes photo crops, laminate sheen, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H, M = 672, 1056, 40
GREEN, DEEP, CREAM, GOLD, MUTE = '#173a2c', '#0f2a1f', '#f3ead6', '#d4a645', '#b9c4b2'
FONTS = ('https://fonts.googleapis.com/css2?family=Alegreya+SC:wght@700;800;900'
         '&family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400&family=Homemade+Apple&display=swap')
DISP = "'Alegreya SC', serif"; BODY = "'Alegreya Sans', sans-serif"; SCRIPT = "'Homemade Apple', cursive"
CW = W - 2 * M

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

street = Image.open(S('southie-house.jpg')).convert('RGB')   # CC0, see CREDITS.md
street = ImageEnhance.Contrast(ImageEnhance.Brightness(street).enhance(1.02)).enhance(1.04)
fit(street, CW - 8, 352, (0, 40, 1920, 1197)).save(A('three-deckers.jpg'), quality=92)

table = Image.open(S('pC6oJsuQsSbuQtUJOyTgk90eIw2.jpg')).convert('RGB')
table = ImageEnhance.Brightness(table).enhance(1.12)
fit(table, CW - 8, 236, (0, 180, 1920, 1000)).save(A('corner-table.jpg'), quality=90)

def sheen(name, seed):
    """Laminate: a broad soft diagonal highlight and gentle darkening at the edges. Low detail, never over text strongly."""
    rnd = random.Random(seed)
    hl = Image.new('L', (W, H), 0); d = ImageDraw.Draw(hl)
    x0 = rnd.randint(140, 260)
    d.polygon([(x0, 0), (x0 + 150, 0), (x0 - 330, H), (x0 - 480, H)], fill=38)
    d.polygon([(x0 + 210, 0), (x0 + 240, 0), (x0 - 240, H), (x0 - 270, H)], fill=22)
    hl = hl.filter(ImageFilter.GaussianBlur(46))
    lay = Image.new('RGBA', (W, H), (255, 255, 255, 0)); lay.putalpha(hl)
    edge = Image.new('L', (W, H), 0); ed = ImageDraw.Draw(edge)
    for i in range(30):
        ed.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(90 - i * 3)))
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    dark = Image.new('RGBA', (W, H), (4, 14, 9, 0)); dark.putalpha(edge)
    Image.alpha_composite(dark, lay).save(A(f'paper-laminate-{name}.png'))
sheen('front', 3); sheen('back', 11)

# ---------------- type pieces ----------------
def kicker(t, color=GOLD, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def band(t, sub=''):
    """Section title: a gold ribbon with notched ends, the name in board green."""
    s = (f'<span style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.16em; color: {DEEP}; '
         f'text-transform: uppercase">{sub}</span>') if sub else ''
    notch = lambda side: (f'<div style="position: absolute; {side}: -1px; top: 0; width: 0; height: 0; '
                          f'border-top: 23px solid transparent; border-bottom: 23px solid transparent; border-{side}: 14px solid {GREEN}"></div>')
    return (f'<div style="position: relative; height: 46px; background: {GOLD}">' + notch('left') + notch('right') +
            f'<div style="position: absolute; left: 30px; right: 30px; top: 0; display: flex; justify-content: space-between; align-items: center; height: 46px">'
            f'<span style="font-family: {DISP}; font-weight: 900; font-size: 40px; line-height: 1; color: {DEEP}; margin-top: -6px">{t}</span>{s}</div></div>')

def item(name, price, desc, gap=16):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 27px; line-height: 1.12; color: {CREAM}">'
            f'<span>{name}</span><span style="color: {GOLD}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MUTE}; margin-top: 3px">{desc}</div></div>')

def rule(top=16): return f'<div style="height: 1px; background: {GOLD}; opacity: 0.5; margin-top: {top}px"></div>'

def frame(src, w, h, alt):
    return (f'<div style="border: 2px solid {GOLD}; padding: 3px; background: {DEEP}; width: {w}px; box-sizing: content-box">'
            f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

def cap(t, top):
    return (f'<div style="position: absolute; left: {M}px; top: {top}px; width: {CW}px; font-family: {BODY}; font-style: italic; '
            f'font-size: 18px; line-height: 1.3; color: {MUTE}">{t}</div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {GREEN}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.18">'
            f'<div style="position: absolute; left: 14px; top: 14px; right: 14px; bottom: 14px; border: 2px solid {GOLD}; border-radius: 16px; opacity: 0.85"></div>'
            f'<div style="position: absolute; left: 20px; top: 20px; right: 20px; bottom: 20px; border: 1px solid {GOLD}; border-radius: 11px; opacity: 0.55"></div>'
            + inner +
            f'<img src="assets/paper-laminate-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def envelope(o, x, y):
    """Sealed manila envelope, Costello's hand on the front."""
    w, h = 214, 128
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; transform: rotate(-7deg); '
             f'background: #d9bf86; box-shadow: 0 4px 10px rgba(0,0,0,0.5); overflow: hidden">'
             f'<div style="position: absolute; left: {(w - 152) // 2}px; top: -76px; width: 152px; height: 152px; transform: rotate(45deg); '
             f'background: #ccb077; border: 1px solid rgba(90,60,20,0.35)"></div>'
             f'<div style="position: absolute; left: {w // 2 - 15}px; top: 22px; width: 30px; height: 30px; border-radius: 50%; background: #8c2a1e; '
             f'box-shadow: 0 1px 2px rgba(0,0,0,0.4)"></div>'
             f'<div style="position: absolute; left: 0; width: {w}px; top: 66px; text-align: center; font-family: {SCRIPT}; font-size: 25px; line-height: 1.3; color: #1d2a44">Citizens</div>'
             '</div>')

def badge(o, x, y):
    """Clip-on visitor badge from the State Police building."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 150px; transform: rotate(6deg)">'
             f'<div style="margin: 0 auto; width: 46px; height: 16px; background: #b9bec4; border-radius: 4px 4px 0 0; box-shadow: 0 1px 2px rgba(0,0,0,0.4)"></div>'
             f'<div style="background: #fbfbf7; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.55); overflow: hidden; text-align: center; padding-bottom: 8px">'
             f'<div style="background: #1f3f7a; color: #fff; font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.12em; line-height: 24px">STATE POLICE</div>'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 34px; line-height: 1.05; color: #b0241b; margin-top: 6px; letter-spacing: 0.04em">VISITOR</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: #1f3f7a; letter-spacing: 0.1em; line-height: 1.2">SPECIAL INVESTIGATIONS</div>'
             f'<div style="margin: 6px 12px 0; border-top: 1px solid #9aa3ad; font-family: {BODY}; font-size: 14px; color: #333; line-height: 1.4; text-align: left">'
             f'Escort: <span style="font-family: {SCRIPT}; font-size: 14px; color: #1d2a44">Dignam</span></div>'
             f'<div style="margin: 0 12px; font-family: {BODY}; font-size: 14px; color: #333; line-height: 1.3; text-align: left">Must be worn</div>'
             '</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {M}px; top: 46px; width: {CW}px; text-align: center">'
             + kicker('West Broadway &middot; South Boston') +
             f'<div style="font-family: {DISP}; font-weight: 900; font-size: 104px; line-height: 0.9; color: {CREAM}; margin-top: 10px; letter-spacing: 0.01em">Fitzy&#8217;s</div>'
             f'<div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px">'
             f'<div style="height: 2px; width: 110px; background: {GOLD}"></div>'
             f'<div style="font-family: {DISP}; font-weight: 800; font-size: 30px; line-height: 1; color: {GOLD}; letter-spacing: 0.08em">Tap &amp; Grill</div>'
             f'<div style="height: 2px; width: 110px; background: {GOLD}"></div></div></div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 222px">'
             + frame('three-deckers.jpg', CW - 8, 352, 'A tall painted row house with bay windows and wreaths on every window, a blue clapboard house beside it, cars parked out front') + '</div>')
    o.append(cap('Up the block from the bar, wreaths on every window.', 590))
    envelope(o, W - M - 232, 474)
    left = (band('Start at the Bar')
            + item('Clam chowder, cup', '4.50', 'Clams, potato and bacon in cream. Oyster crackers.', 18)
            + item('Soda bread and butter', '3.00', 'Baked here each morning, cut thick, salted butter.', 22)
            + item('Pickled eggs', '1.50', 'Two from the jar on the bar, salt and pepper.', 22))
    o.append(f'<div style="position: absolute; left: {M}px; top: 636px; width: {CW}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 934px; width: {CW}px">' + rule(0) +
             f'<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-top: 12px">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 21px; line-height: 1.3; color: {CREAM}; width: 380px">'
             'No one gives it to you. You have to take it. So eat.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 24px; line-height: 1.5; color: {GOLD}; white-space: nowrap">F. Costello</div></div>'
             + kicker('Cops or criminals, same chowder', MUTE, 16, ' margin-top: 12px; letter-spacing: 0.18em') + '</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: {M}px; top: 44px">'
             + frame('corner-table.jpg', CW - 8, 236, 'A young man in a dark sweater leans in to talk with an older man in a pale jacket at a white tablecloth, a brandy glass between them') + '</div>')
    o.append(cap('Mr. C&#8217;s corner table. Knock first.', 292))
    badge(o, W - M - 158, 128)
    body = (band('Suppers', 'after 5')
            + item('Southie fish and chips', '11.95', 'White fish in lager batter, chips, minted mushy peas.', 12)
            + item('Steak tips', '14.95', 'Marinated sirloin off the grill, onions, baked potato.')
            + item('Mr. C&#8217;s lobster', 'MKT', 'Split and broiled, drawn butter. Robe optional.')
            + f'<div style="margin-top: 20px">{band("Sweet")}</div>'
            + item('Boston cream pie', '4.95', 'Sponge, vanilla custard, dark chocolate ganache.', 12)
            + f'<div style="margin-top: 20px">{band("The Bar", "pints &amp; more")}</div>'
            + item('Cranberry and lime', '2.50', 'Fresh lime, orange, soda, crushed ice. A natural diuretic.', 12)
            + item('Irish stout', '4.75', 'Pulled slow, settled, topped. By the pint.'))
    o.append(f'<div style="position: absolute; left: {M}px; top: 332px; width: {CW}px">{body}</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 966px; width: {CW}px; text-align: center; font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {MUTE}">'
             'Our chowder is a product of its environment. Cash at the bar.<br>'
             'Prices subject to change. No rats. West Broadway, Mass. 02127. Form 2006.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fitzy\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
