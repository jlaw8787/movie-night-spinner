"""The Pink Plume, Ben's desert hotel on Highway 91, opening night, December 1946.
Showroom supper folder, two tall faces 672x1344, blush pink stock, flamingo pink and gold inks.
Front (cover): hotel name, the Audubon flamingo hung in the lobby (big gag), Ben's welcome note,
a TMDB still of the site in the desert, a $5 casino chip.
Back (supper card): Library of Congress 1940 Las Vegas roulette photo (signature), the supper in
two columns, the budget overrun box, the opening night invitation tucked in, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
Image.MAX_IMAGE_PIXELS = None
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 672, 1344
PAPER, PINK, GOLD, INK, MUTE, CREAM = '#fbe3e4', '#d4416f', '#a87a26', '#2a1a20', '#5e4650', '#fff8ee'
FONTS = ('https://fonts.googleapis.com/css2?family=Federo&family=Lora:ital,wght@0,400;0,600;1,400'
         '&family=Pinyon+Script&display=swap')
DISP = "'Federo', sans-serif"; BODY = "'Lora', serif"; SCRIPT = "'Pinyon Script', cursive"
L, CW = 48, 576

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PL_W, PL_H = 560, 516
fl = Image.open(S('audubon-flamingo-nga.jpg')).convert('RGB')
fit(fl, PL_W, PL_H, (20, 330, 1270, 1600)).save(A('flamingo-plate.jpg'), quality=90)

SIG_W, SIG_H = 560, 330
rl = Image.open(S('loc-8b19716.jpg')).convert('L')
rl = ImageEnhance.Contrast(ImageEnhance.Brightness(rl).enhance(1.06)).enhance(1.05)
# warm sepia so it sits on blush stock, still clean and bright
rl = fit(rl, SIG_W, SIG_H, (420, 5200, 10050, 12700))
sep = Image.merge('RGB', [rl.point(lambda v: min(255, int(v * 1.0 + 6))), rl.point(lambda v: int(v * 0.96 + 3)), rl.point(lambda v: int(v * 0.9))])
sep.save(A('roulette-1940.jpg'), quality=90)

DS_W, DS_H = 236, 190
ds = Image.open(S('fBcQZtzSVEEUAlLmHPnex7p4Doe.jpg')).convert('RGB')
fit(ds, DS_W, DS_H, (560, 0, 1860, 1080)).save(A('site-desert.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(64 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    lay = Image.new('RGBA', (W, H), (110, 60, 50, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.45)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 46); wear('back', 91)

# ---------------- type pieces ----------------
def kicker(t, color=GOLD, size=18, extra=''):
    return (f'<div style="font-family: {DISP}; font-size: {size}px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def item(name, price, desc, gap=16, size=26, dsize=20):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {DISP}; '
            f'font-size: {size}px; line-height: 1.1; color: {INK}; text-transform: uppercase; letter-spacing: 0.03em">'
            f'<span>{name}</span><span style="color: {PINK}; white-space: nowrap">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.3; color: {INK}; margin-top: 4px">{desc}</div></div>')

def section(sub, title, size=40):
    """Deco section head: gold kicker, Federo title, gold double rule with a pink diamond."""
    return (f'{kicker(sub)}'
            f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1.05; color: {PINK}; margin-top: 4px; letter-spacing: 0.05em; text-shadow: 0.9px 0 0 currentColor, -0.9px 0 0 currentColor, 0 0.45px 0 currentColor">{title}</div>'
            f'<div style="position: relative; height: 12px; margin-top: 6px">'
            f'<div style="position: absolute; left: 0; right: 0; top: 2px; border-top: 2px solid {GOLD}; border-bottom: 1px solid {GOLD}; height: 3px"></div>'
            f'<div style="position: absolute; left: 0; top: -1px; width: 12px; height: 12px; background: {PINK}; transform: rotate(45deg)"></div></div>')

def frame_border():
    """Folder edge: flamingo pink band, gold hairline inside it."""
    return (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; box-sizing: border-box; border: 16px solid {PINK}"></div>'
            f'<div style="position: absolute; left: 24px; top: 24px; width: {W - 48}px; height: {H - 48}px; box-sizing: border-box; border: 2px solid {GOLD}"></div>')

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.2">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            + frame_border() + inner + '</div>')

def gold_frame(img, alt, x, y, w, h):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border: 3px solid {GOLD}; padding: 5px; background: {CREAM}; '
            f'box-shadow: 0 2px 6px rgba(60,20,30,0.25)">'
            f'<div style="width: {w}px; height: {h}px; outline: 1px solid {GOLD}">'
            f'<img src="assets/{img}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div></div>')

# ---------------- props ----------------
def chip(o, x, y, rot=-12):
    """A $5 house chip: pink clay, six gold edge inserts, cream inlay with a gold ring."""
    d = 132
    spots = ''.join(
        f'<div style="position: absolute; left: {d // 2 - 9}px; top: 0; width: 18px; height: {d}px; transform: rotate({a}deg)">'
        f'<div style="width: 18px; height: 13px; background: {CREAM}"></div>'
        f'<div style="position: absolute; left: 0; bottom: 0; width: 18px; height: 13px; background: {CREAM}"></div></div>'
        for a in (0, 60, 120))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; transform: rotate({rot}deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: {d}px; height: {d}px; border-radius: 50%; background: {PINK}; '
             f'box-shadow: 0 4px 9px rgba(40,10,20,0.45); overflow: hidden">{spots}</div>'
             f'<div style="position: absolute; left: 20px; top: 20px; width: {d - 40}px; height: {d - 40}px; border-radius: 50%; background: {CREAM}; '
             f'box-sizing: border-box; border: 3px solid {GOLD}; text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1; color: {PINK}; margin-top: 16px">$5</div>'
             f'<div style="font-family: {DISP}; font-size: 14px; letter-spacing: 0.08em; line-height: 1.1; color: {INK}; margin-top: 4px">PINK PLUME</div>'
             f'</div></div>')

def invitation(o, x, y, rot=5):
    """The engraved opening night invitation, tucked into the folder."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 224px; height: 150px; background: {CREAM}; '
             f'box-shadow: 0 4px 10px rgba(40,10,20,0.4); transform: rotate({rot}deg); box-sizing: border-box; padding: 8px">'
             f'<div style="border: 1.5px solid {GOLD}; height: 134px; box-sizing: border-box; text-align: center; padding-top: 8px">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 14px; line-height: 1.3; color: {INK}">Mr. Benjamin Siegel<br>requests your company<br>at the opening of</div>'
             f'<div style="font-family: {DISP}; font-size: 23px; line-height: 1.1; color: {PINK}; margin-top: 4px; letter-spacing: 0.04em">THE PINK PLUME</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {INK}; margin-top: 4px">December 1946 &middot; Black tie</div>'
             f'<div style="font-family: {DISP}; font-size: 14px; letter-spacing: 0.14em; line-height: 1.2; color: {GOLD}; margin-top: 4px">ADMIT TWO</div>'
             f'</div></div>')

# ---------------- FRONT: the folder cover ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px; text-align: center">'
             f'{kicker("Grand opening &nbsp;&middot;&nbsp; Highway 91 &nbsp;&middot;&nbsp; Nevada")}'
             f'<div style="font-family: {DISP}; font-size: 88px; line-height: 0.96; color: {INK}; margin-top: 10px; letter-spacing: 0.04em; text-shadow: 1.6px 0 0 currentColor, -1.6px 0 0 currentColor, 0 0.8px 0 currentColor">THE PINK<br>PLUME</div>'
             f'<div style="font-family: {DISP}; font-size: 21px; line-height: 1.2; color: {PINK}; margin-top: 12px; letter-spacing: 0.2em">HOTEL &nbsp;&middot;&nbsp; CASINO &nbsp;&middot;&nbsp; SHOWROOM</div></div>')
    o.append(gold_frame('flamingo-plate.jpg', 'A painted American flamingo bending its long neck down to the shore, more flamingos wading behind',
                        L - 1, 300, PL_W, PL_H))
    o.append(f'<div style="position: absolute; left: {L}px; top: 842px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 19px; line-height: 1.3; color: {MUTE}">Our namesake, hung in the lobby. Long legs, all pink,<br>and about as native to the desert as we are.</div>')
    chip(o, 482, 716)

    # Ben's welcome, left column
    o.append(f'<div style="position: absolute; left: {L}px; top: 920px; width: 316px">'
             f'{kicker("From the boss")}'
             f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1.05; color: {PINK}; margin-top: 4px; white-space: nowrap; text-shadow: 0.9px 0 0 currentColor, -0.9px 0 0 currentColor, 0 0.45px 0 currentColor">OPENING NIGHT</div>'
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.4; color: {INK}; margin-top: 10px">'
             'They said nobody would drive out to the middle of nowhere for a steak. Look around. Order anything. The house can take it.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 44px; line-height: 1; color: {INK}; margin-top: 6px">Ben Siegel</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}; margin-top: 4px">'
             'P.S. It&rsquo;s Ben. Never the other name.</div></div>')

    # the site, right column
    o.append(gold_frame('site-desert.jpg', 'Ben in dark glasses at the wheel of a convertible, Virginia standing beside him on the empty desert flat',
                        L + CW - DS_W - 16 + 6, 934, DS_W, DS_H))
    o.append(f'<div style="position: absolute; left: {L + CW - DS_W - 10}px; top: 1146px; width: {DS_W + 10}px; font-family: {BODY}; font-style: italic; '
             f'font-size: 17px; line-height: 1.3; color: {MUTE}">The site, last spring. Sand, sky and one good idea.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1206px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}">'
             'The boss&rsquo;s diction drill: &ldquo;Twenty dwarves took turns doing handstands.&rdquo;</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1262px; width: {CW}px; text-align: center; font-family: {DISP}; font-size: 18px; '
             f'letter-spacing: 0.2em; color: {GOLD}">SUPPER IN THE SHOWROOM &nbsp;&middot;&nbsp; MENU INSIDE</div>')
    return page(''.join(o), 'front')

# ---------------- BACK: the supper card ----------------
def back():
    o = []
    o.append(gold_frame('roulette-1940.jpg', 'A crowded 1940 Las Vegas roulette table, players in cowboy hats and fedoras leaning in to place chips',
                        L + 1, 52, SIG_W, SIG_H))
    o.append(f'<div style="position: absolute; left: {L}px; top: 402px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.3; color: {MUTE}">Downtown, 1940: boots and sawdust. Out here, black tie.</div>')
    invitation(o, 404, 34)

    colw = 282
    left = (section('From eight', 'APPETIZERS', 38)
            + item('Caviar blini', '1.75', 'Warm buckwheat cakes, cr&egrave;me fra&icirc;che, red salmon caviar, snipped chives.', 12)
            + item('Cobb cups', '.85', 'Chicken, bacon, avocado, egg, tomato, blue cheese, in lettuce cups.', 14)
            + item('Shrimp on ice', '1.00', 'Sharp horseradish cocktail sauce, lemon.', 14)
            + f'<div style="height: 22px"></div>'
            + section('In the lounge', 'THE BAR', 38)
            + item('Gin rickey', '.60', 'Miss Hill&rsquo;s way: gin, fresh lime and soda, shell left in.', 12)
            + item('Champagne cocktail', '1.46', 'Sugar cube, bitters, a lemon twist.', 14))
    right = (section('Served at nine', 'THE SUPPER', 38)
             + item('Steak Diane', '4.75', 'Rib eye pounded thin, seared hot, flamed in brandy, then shallot, Dijon, Worcestershire and cream.', 12)
             + item('Prime rib', '3.95', 'Carved to order, natural juices, popover.', 14)
             + f'<div style="height: 22px"></div>'
             + section('After the show', 'DESSERT', 38)
             + item('Pavlova', '.75', 'Crisp meringue, soft middle, whipped cream and crushed raspberries.', 12)
             + item('Coffee', '.15', '', 14))
    o.append(f'<div style="position: absolute; left: {L}px; top: 446px; width: {colw}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {L + CW - colw}px; top: 446px; width: {colw}px">{right}</div>')

    # the budget overrun
    strike = f'text-decoration: line-through; text-decoration-color: {PINK}; text-decoration-thickness: 3px'
    o.append(f'<div style="position: absolute; left: {L + CW - colw}px; top: 1070px; width: {colw}px; box-sizing: border-box; '
             f'border: 2px solid {GOLD}; background: {CREAM}; padding: 10px 14px 8px">'
             f'{kicker("Built at a cost of", size=15, extra=" letter-spacing: 0.18em")}'
             f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1.2; color: {MUTE}; margin-top: 6px"><span style="{strike}">$1,000,000</span> &nbsp;<span style="font-family: {BODY}; font-style: italic; font-size: 15px">(the plan)</span></div>'
             f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1.2; color: {MUTE}"><span style="{strike}">$2,000,000</span> &nbsp;<span style="font-family: {BODY}; font-style: italic; font-size: 15px">(the pool)</span></div>'
             f'<div style="font-family: {SCRIPT}; font-size: 44px; line-height: 1.05; color: {PINK}; margin-left: 2px; white-space: nowrap">$6 million <span style="font-family: {BODY}; font-style: italic; font-size: 15px; color: {INK}">(so eat up)</span></div></div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 1254px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {MUTE}; text-align: center">'
             'Prices subject to change. Valet by Mr. Cohen&rsquo;s boys. Mr. Raft&rsquo;s table held.<br>'
             'Form 46-B. Highway 91, the middle of nowhere, Nevada. 1946.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Pink Plume menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
