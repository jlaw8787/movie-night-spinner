"""Afterlife Intake, Waiting Room Snack Bar, 1988. Slim snack bar card, two faces 408x1056 (4.25 x 11 in).
Institutional white stock, black, slime green. Stripes on everything.
Front: striped band and sign, the waiting room still (signature), NOW SERVING board, take-a-number ticket, While You Wait.
Back: Last Meals, shrimp cocktail caution panel (hazard-striped still), hot plates, sweets and cold drinks,
Juno's note, recently deceased snack voucher, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 408, 1056
PAPER, INK, SLIME, MOSS, GREY, TICKET = '#f1efe6', '#141414', '#a6cf2e', '#4f6b0e', '#55554d', '#dfe9b8'
FONTS = ('https://fonts.googleapis.com/css2?family=Creepster&family=Barlow+Semi+Condensed:ital,wght@0,400;0,600;0,700;1,400;1,600'
         '&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Creepster', cursive"; BODY = "'Barlow Semi Condensed', sans-serif"; SCRIPT = "'Mrs Saint Delafield', cursive"
L, CW = 40, 328

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

HERO_H = 250
room = Image.open(S('txNbQS3JAxP5w07UFddoaTyzsJt.jpg')).convert('RGB')
room = ImageEnhance.Brightness(room).enhance(1.32); room = ImageEnhance.Contrast(room).enhance(1.06)
fit(room, W, HERO_H, (300, 120, 1920, 1080)).save(A('hero-waiting-room.jpg'), quality=90)

# caution panel: hazard stripe frame around the dinner party shrimp still
PW, PH, B = 328, 250, 12
pan = Image.new('RGB', (PW * 2, PH * 2), PAPER)
pd = ImageDraw.Draw(pan)
for k in range(-PH * 2, PW * 2 + PH * 2, 36):
    pd.polygon([(k, 0), (k + 18, 0), (k + 18 + PH * 2, PH * 2), (k + PH * 2, PH * 2)], fill=INK)
shrimp = Image.open(S('afFK9J35wcwpk0LKgXEGbzDffhR.jpg')).convert('RGB')
shrimp = ImageEnhance.Brightness(shrimp).enhance(1.22)
inner = fit(shrimp, PW - 2 * B, PH - 2 * B, (700, 300, 2470, 1634))
pan.paste(inner, (B * 2, B * 2))
pd.rectangle([B * 2 - 3, B * 2 - 3, PW * 2 - B * 2 + 2, PH * 2 - B * 2 + 2], outline=SLIME, width=3)
pan.save(A('caution-shrimp.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(24):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(54 - i * 2.2)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 11))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))
    lay = Image.new('RGBA', (W, H), (60, 66, 40, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.45)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 88); wear('back', 125)

# ---------------- pieces ----------------
def stripes(x, y, w, h, sw=24, a=INK, b=PAPER, start=0):
    o = [f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {b}; overflow: hidden">']
    i = start
    for sx in range(0, w, sw):
        if i % 2 == 0:
            o.append(f'<div style="position: absolute; left: {sx}px; top: 0; width: {sw}px; height: {h}px; background: {a}"></div>')
        i += 1
    return ''.join(o) + '</div>'

def stripe_rule(w, h=8, sw=16):
    return f'<div style="position: relative; width: {w}px; height: {h}px">{stripes(0, 0, w, h, sw)}</div>'

def kicker(t, color=MOSS, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1;{extra}">{t}</div>')

def item(name, price, desc, gap=12, note='', note_color=MOSS):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 18px; line-height: 1.2; color: {note_color}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 27px; line-height: 1.05; color: {INK}">'
            f'<span>{name}</span><span>{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.2; color: {INK}; margin-top: 2px">{desc}</div>{n}</div>')

def section(t, extra=''):
    """Striped tab with the section name on a black plate."""
    return (f'<div style="position: relative; height: 34px;{extra}">'
            + stripes(0, 8, CW, 18, 12) +
            f'<div style="position: absolute; left: 0; top: 0; height: 34px; background: {INK}; padding: 0 12px; '
            f'font-family: {DISP}; font-size: 28px; line-height: 36px; color: {SLIME}; white-space: nowrap">{t}</div></div>')

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.2">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def ticket(o, x, y):
    """Take-a-number ticket, pale green with perforated ends."""
    perf = ''.join(f'<div style="position: absolute; left: {6 + i * 14}px; top: -5px; width: 9px; height: 9px; border-radius: 50%; background: {PAPER}"></div>'
                   f'<div style="position: absolute; left: {6 + i * 14}px; bottom: -5px; width: 9px; height: 9px; border-radius: 50%; background: {PAPER}"></div>'
                   for i in range(11))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 156px; height: 150px; background: {TICKET}; transform: rotate(6deg); '
             f'box-shadow: 0 3px 8px rgba(0,0,0,0.35); text-align: center; box-sizing: border-box; padding-top: 12px; overflow: hidden">{perf}'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.16em; color: {INK}; line-height: 1">TAKE A NUMBER</div>'
             f'<div style="margin: 5px 14px 0; height: 2px; background: {INK}"></div>'
             f'<div style="font-family: {DISP}; font-size: 66px; line-height: 1; color: {INK}; margin-top: 4px">88</div>'
             f'<div style="margin: 2px 14px 0; height: 2px; background: {INK}"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; color: {INK}; line-height: 1.15; margin-top: 4px">Please wait.<br>Then wait some more.</div></div>')

def voucher(o, x, y):
    """Recently deceased snack voucher, striped border."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 160px; height: 112px; transform: rotate(-5deg); box-shadow: 0 3px 8px rgba(0,0,0,0.35)">'
             + stripes(0, 0, 160, 112, 10) +
             f'<div style="position: absolute; left: 7px; top: 7px; width: 146px; height: 98px; background: #fbfaf4; text-align: center; box-sizing: border-box; padding-top: 7px">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; color: {MOSS}; line-height: 1.1">RECENTLY DECEASED</div>'
             f'<div style="font-family: {DISP}; font-size: 25px; line-height: 1.05; color: {INK}; margin-top: 2px">SNACK VOUCHER</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; line-height: 1.15; color: {INK}; margin-top: 3px">Good for one coffee.<br>Valid 125 years.</div></div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(stripes(0, 0, W, 172, 24))
    o.append(f'<div style="position: absolute; left: 30px; top: 16px; width: 348px; height: 146px; background: {INK}; border: 3px solid {SLIME}; '
             f'box-sizing: border-box; text-align: center; padding-top: 14px">'
             f'{kicker("Afterlife Intake", SLIME)}'
             f'<div style="font-family: {DISP}; font-size: 62px; line-height: 1; color: {PAPER}; margin-top: 6px; white-space: nowrap">SNACK BAR</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1; color: {SLIME}; margin-top: 6px">Waiting Room. Open for eternity.</div></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 172px; width: {W}px; height: 3px; background: {SLIME}"></div>')
    o.append(f'<img src="assets/hero-waiting-room.jpg" alt="The afterlife waiting room: the newly dead sit in a row of chairs on a black and white checked floor, waiting" '
             f'style="position: absolute; left: 0; top: 175px; display: block; width: {W}px; height: {HERO_H}px">')
    o.append(f'<div style="position: absolute; left: 0; top: {175 + HERO_H}px; width: {W}px; height: 3px; background: {SLIME}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: {175 + HERO_H + 10}px; width: {CW}px; text-align: center; font-family: {BODY}; '
             f'font-style: italic; font-size: 18px; line-height: 1.25; color: {GREY}">The waiting room on a quiet day.<br>Strange and unusual guests welcome.</div>')

    # NOW SERVING board
    top = 504
    o.append(f'<div style="position: absolute; left: {L}px; top: {top}px; width: 170px; height: 132px; background: {INK}; box-sizing: border-box; '
             f'border: 3px solid {GREY}; text-align: center; padding-top: 10px">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 17px; letter-spacing: 0.18em; color: {PAPER}; line-height: 1">NOW SERVING</div>'
             f'<div style="font-family: {DISP}; font-size: 78px; line-height: 1; color: {SLIME}; margin-top: 6px">3</div></div>')
    ticket(o, 222, top - 8)
    o.append(f'<div style="position: absolute; left: {L}px; top: {top + 144}px; width: {CW}px; font-family: {BODY}; font-size: 18px; line-height: 1.25; color: {INK}">'
             f'<b>House rule:</b> no swapping tickets with the man with the very small head.</div>')

    menu = (section('WHILE YOU WAIT')
            + item('Model town cheeses', '3.95', 'Cheddar, gouda and pepper jack houses, cherry tomato and cornichon trees.', 14,
                   'Built to scale, Winter River style.')
            + item('Sandworm licorice twist', '.88', 'Black and white, chewy, a yard long.', 16)
            + item('Waiting room coffee', '.75', 'Bottomless, which is lucky.', 16, 'Reheated about 167 times.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: {top + 196}px; width: {CW}px">{menu}</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    # side stripes: horizontal bands down both edges
    for side in (0, W - 14):
        for i, yy in enumerate(range(0, H, 22)):
            if i % 2 == 0:
                o.append(f'<div style="position: absolute; left: {side}px; top: {yy}px; width: 14px; height: 22px; background: {INK}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 38px; width: {CW}px; text-align: center">'
             f'{kicker("Afterlife Intake Snack Bar")}'
             f'<div style="font-family: {DISP}; font-size: 56px; line-height: 1; color: {INK}; margin-top: 6px; white-space: nowrap">LAST MEALS</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 132px">{stripe_rule(CW)}</div>')
    o.append(f'<img src="assets/caution-shrimp.jpg" alt="A dinner guest screams as the shrimp in her cocktail bowl reach up for her" '
             f'style="position: absolute; left: {L}px; top: 152px; display: block; width: {PW}px; height: {PH}px">')
    o.append(f'<div style="position: absolute; left: {L + 10}px; top: 140px; background: {INK}; padding: 2px 10px; transform: rotate(-3deg); '
             f'font-family: {DISP}; font-size: 26px; line-height: 1.1; color: {SLIME}">CAUTION</div>')

    m1 = item('Shrimp cocktail', '4.95', 'Chilled shrimp on shredded iceberg, lemony cocktail sauce with horseradish.', 0,
              'It may grab back. Keep your face clear.', INK)
    o.append(f'<div style="position: absolute; left: {L}px; top: {152 + PH + 12}px; width: {CW}px">{m1}</div>')
    m2 = (section('HOT PLATES')
          + item('Grilled lobster tails', '12.95', 'Garlic, lemon and parsley butter, shoestring fries, green salad.', 8)
          + '<div style="height: 14px"></div>'
          + section('SWEETS AND COOLERS')
          + item('Striped suit cake', '2.50', 'Vanilla and chocolate sponge, white chocolate ganache, dark chocolate lines.', 8)
          + item('Frozen banana daiquiri', '1.88', 'Ripe banana, fresh lime, sugar syrup, ice. Made without rum.', 12))
    o.append(f'<div style="position: absolute; left: {L}px; top: 532px; width: {CW}px">{m2}</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 884px; width: 170px; font-family: {BODY}; font-style: italic; font-size: 18px; '
             f'line-height: 1.22; color: {INK}">Read your handbook.<br>Eat, you look dead.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 928px; font-family: {SCRIPT}; font-size: 40px; line-height: 1; color: {INK}">Juno</div>')
    o.append(f'<div style="position: absolute; left: 112px; top: 944px; font-family: {BODY}; font-size: 14px; letter-spacing: 0.12em; color: {GREY}">CASEWORKER</div>')
    voucher(o, 226, 892)
    o.append(f'<div style="position: absolute; left: {L}px; top: 978px; width: 176px; font-family: {BODY}; font-size: 15px; line-height: 1.2; color: {GREY}">'
             'Prices subject to change.<br>Intake Form 167. 1988.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Snack Bar menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
