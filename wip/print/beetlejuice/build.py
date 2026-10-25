"""Dinner at the Deetzes', the Maitland house, Winter River, Connecticut, 1988.
Menu card in Delia and Otho's taste. Two faces 816x1056 (US Letter card).
Front: crooked title, the painted attic model of Winter River (signature, from paint.py), Delia sculpture placard,
a snapshot of the house before the remodel, a Netherworld take-a-number ticket. Sandworm-stripe border on both faces.
Back: the menu with tilted course tags, shrimp cocktail still, Handbook still, Bio-Exorcist TV ad card, house rule.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('model-town.jpg')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)
W, H = 816, 1056
INK, BONE, PAPER, SLIME, PURPLE, NIGHT, RED = '#18121c', '#ecebdf', '#e4e6cf', '#b4cf4a', '#5e3a7a', '#1e1428', '#a8262c'
FONTS = ('https://fonts.googleapis.com/css2?family=Jolly+Lodger&family=Spectral:ital,wght@0,400;0,600;0,700;1,400;1,600'
         '&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Jolly Lodger', cursive"; BODY = "'Spectral', serif"; SCRIPT = "'Mrs Saint Delafield', cursive"
L = 60

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PAINT_W, PAINT_H = 680, 560
Image.open(A('model-town.jpg')).crop((0, 40, 1392, 40 + int(1392 * PAINT_H / PAINT_W))).resize((PAINT_W * 2, PAINT_H * 2), Image.LANCZOS).save(A('model-town-crop.jpg'), quality=92)
sh = ImageEnhance.Brightness(Image.open(S('afFK9J35wcwpk0LKgXEGbzDffhR.jpg')).convert('RGB')).enhance(1.2)
fit(sh, 236, 196, (700, 120, 2500, 1634)).save(A('still-shrimp.jpg'), quality=90)
hb = ImageEnhance.Brightness(Image.open(S('2qlBTuaKPRTCgsoRcL0GbW70ZQq.jpg')).convert('RGB')).enhance(1.35)
fit(hb, 236, 156, (200, 200, 1500, 1300)).save(A('still-handbook.jpg'), quality=90)
hs = ImageEnhance.Brightness(Image.open(S('499IKhvHNeo7KRHxlbPQFgIiBIz.jpg')).convert('RGB')).enhance(1.12)
fit(hs, 176, 150, (430, 70, 1010, 640)).save(A('still-house.jpg'), quality=90)

def wear(name, seed, col=(70, 60, 40)):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(60 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 24, H // 24), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 14))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), col + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('back', 1988)

# ---------------- type pieces ----------------
def crooked(text, size, color, seed, extra=''):
    """Hand-cut lettering: every letter set a little askew."""
    rr = random.Random(seed); out = []
    for ch in text:
        if ch == ' ':
            out.append(f'<span style="display: inline-block; width: {size * 0.22:.0f}px"></span>'); continue
        out.append(f'<span style="display: inline-block; transform: rotate({rr.uniform(-7, 7):.1f}deg) translateY({rr.uniform(-4, 4):.0f}px)">{ch}</span>')
    return (f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1; color: {color}; white-space: nowrap;{extra}">'
            + ''.join(out) + '</div>')

def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')

def course(t, ang, color=PURPLE):
    return (f'<div style="margin-top: 6px; display: inline-block; background: {color}; padding: 3px 14px 1px; transform: rotate({ang}deg); '
            f'box-shadow: 3px 3px 0 {INK}">{crooked(t, 32, BONE, len(t))}</div>')

def item(name, desc, note='', gap=4):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 18px; line-height: 1.25; color: {PURPLE}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px"><div style="font-family: {BODY}; font-weight: 700; font-size: 27px; line-height: 1.05; color: {INK}">{name}</div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.25; color: {INK}; margin-top: 2px">{desc}</div>{n}</div>')

def page(inner, name, bg):
    over = ('' if name == 'front' else
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner + over +
            f'<img src="assets/worm-border.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

def tilt_photo(o, src, alt, x, y, w, h, ang, mat=BONE, pad=8, cap=''):
    c = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.2; color: {INK}; text-align: center; padding: 6px 2px 2px">{cap}</div>'
         if cap else '')
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w + 2 * pad}px; background: {mat}; padding: {pad}px {pad}px {pad if not cap else 4}px; '
             f'box-sizing: content-box; transform: rotate({ang}deg); box-shadow: 3px 5px 0 {INK}, 0 6px 14px rgba(0,0,0,0.35); margin-left: -{pad}px">'
             f'<img src="{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px; border: 2px solid {INK}; box-sizing: border-box">{c}</div>')

# ---------------- props ----------------
def ticket(o, x, y, ang):
    perf = ''.join(f'<div style="position: absolute; left: -5px; top: {6 + i * 14}px; width: 10px; height: 10px; border-radius: 50%; background: {NIGHT}"></div>'
                   f'<div style="position: absolute; right: -5px; top: {6 + i * 14}px; width: 10px; height: 10px; border-radius: 50%; background: {NIGHT}"></div>'
                   for i in range(8))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 150px; height: 118px; background: #d3dca6; transform: rotate({ang}deg); '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align: center; box-sizing: border-box; padding-top: 8px; overflow: hidden">{perf}'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.12em; color: {INK}; line-height: 1">NETHERWORLD</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.12em; color: {PURPLE}; line-height: 1; margin-top: 3px">TAKE A NUMBER</div>'
             f'<div style="font-family: {DISP}; font-size: 54px; line-height: 0.95; color: {INK}; margin-top: 2px">No. 88</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 14px; color: {INK}; line-height: 1.1">Please wait. Then wait.</div></div>')

def placard(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 246px; background: #f7f6ef; transform: rotate({ang}deg); '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.5); box-sizing: border-box; padding: 10px 14px 10px; border-left: 8px solid {INK}">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.12em; color: {INK}; line-height: 1.1">DELIA DEETZ</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {INK}; line-height: 1.2; margin-top: 3px">Dinner Guest, No. 3, 1988</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; color: #4a4450; line-height: 1.25; margin-top: 3px">Welded steel, fun fur, nerve.<br>Do not touch. Otho insists.</div></div>')

def ad_card(o, x, y, ang):
    stripes = ''.join(f'<div style="position: absolute; left: {i * 16}px; top: 0; width: 8px; height: 14px; background: {BONE}"></div>' for i in range(16))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 236px; height: 176px; background: {INK}; transform: rotate({ang}deg); '
             f'box-shadow: 4px 5px 0 {PURPLE}, 0 6px 14px rgba(0,0,0,0.35); overflow: hidden; text-align: center">'
             f'<div style="position: absolute; left: 0; top: 0; width: 236px; height: 14px">{stripes}</div>'
             f'<div style="position: absolute; left: 0; bottom: 0; width: 236px; height: 14px">{stripes}</div>'
             f'<div style="padding-top: 20px">{kicker("Late night TV", SLIME, 14)}</div>'
             + crooked('BIO-EXORCIST', 44, BONE, 3, ' margin-top: 2px') +
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {BONE}; margin-top: 4px">Got the living in your house?<br>Seen The Exorcist 167 times.</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 15px; line-height: 1.2; color: {SLIME}; margin-top: 3px">No phone. Just say the name.</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<img src="assets/paper-front-spirals.jpg" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {W - 2 * L}px; text-align: center">{kicker("Charles and Delia Deetz, at home", SLIME)}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 72px; width: {W}px; text-align: center">'
             f'<div style="display: inline-block; transform: rotate(-4deg)">{crooked("Dinner at", 60, BONE, 7)}</div></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 122px; width: {W}px; text-align: center">'
             f'<div style="display: inline-block; transform: rotate(1.5deg)">{crooked("THE DEETZES&rsquo;".replace("&rsquo;", "’"), 128, BONE, 13)}</div></div>')
    # signature: painted attic model of Winter River
    o.append(f'<div style="position: absolute; left: {(W - PAINT_W) // 2 - 10}px; top: 270px; width: {PAINT_W}px; height: {PAINT_H}px; padding: 10px; background: {BONE}; '
             f'transform: rotate(-1.6deg); box-shadow: 6px 8px 0 {INK}, 0 10px 30px rgba(0,0,0,0.6)">'
             f'<img src="assets/model-town-crop.jpg" alt="Painting of the attic model of Winter River: little clapboard houses, a church, a red covered bridge over the river, and the Maitland house on its hill under a bare bulb" '
             f'style="display: block; width: {PAINT_W}px; height: {PAINT_H}px"></div>')
    o.append(f'<div style="position: absolute; left: 262px; top: 846px; transform: rotate(-2deg); background: {SLIME}; padding: 2px 12px; box-shadow: 3px 3px 0 {INK}">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-style: italic; font-size: 18px; line-height: 1.2; color: {INK}; white-space: nowrap">Winter River, to scale. Found in the attic.</div></div>')
    ticket(o, 34, 742, -8)
    placard(o, 50, 904, -2.5)
    o.append(f'<div style="position: absolute; left: 318px; top: 892px; width: 240px; text-align: center; font-family: {BODY}; font-size: 19px; line-height: 1.3; color: {BONE}">'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1; color: {SLIME}">Saturday at eight</div>'
             f'<div style="margin-top: 6px">The Maitland house,<br>remodelled at last.<br>Dress: strange and unusual.</div></div>')
    tilt_photo(o, 'assets/still-house.jpg', 'The Maitland house as a model on its green hill, white clapboard and a red door', 598, 868, 150, 100, 5, cap='Before Delia.')
    return page(''.join(o), 'front', NIGHT)

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<img src="assets/spiral-purple.png" alt="" aria-hidden="true" style="position: absolute; left: 92px; top: 62px; width: 92px; height: 92px">')
    o.append(f'<img src="assets/spiral-purple.png" alt="" aria-hidden="true" style="position: absolute; left: 632px; top: 62px; width: 92px; height: 92px; transform: scaleX(-1)">')
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {W - 2 * L}px; text-align: center">{kicker("This evening", PURPLE)}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 70px; width: {W}px; text-align: center">'
             f'<div style="display: inline-block; transform: rotate(-2deg)">{crooked("THE MENU", 104, INK, 21)}</div></div>')

    menu = (course('TO BEGIN', -2)
            + item('Shrimp cocktail', 'Chilled shrimp, iceberg, lemony horseradish sauce.',
                   'Served lively. Keep your face clear of the bowl.')
            + item('Otho&rsquo;s spiral breadsticks', 'Black and white sesame twists, baked crisp.', '', 8)
            + item('Model town cheeses', 'Cheese houses, cherry tomato and cornichon trees.', '', 8)
            + course('THE MAIN EVENT', 1.5)
            + item('Grilled lobster tails', 'Garlic and parsley butter, shoestring fries, salad.')
            + course('AFTERWARDS', -1.5)
            + item('Black and white cake', 'Vanilla and chocolate sponge, white ganache.')
            + item('Delia&rsquo;s meringue sculpture', 'Meringue spires, whipped cream, blackberry swirl.', 'Please do touch this one.', 8)
            + course('TO DRINK', 2)
            + item('Banana daiquiri', 'Banana, lime, sugar syrup and ice. No rum.',
                   'May cause sudden dancing. Resist.')
            + item('Sparkling lemonade', 'Pressed lemons, cane sugar, soda water.', '', 8))
    o.append(f'<div style="position: absolute; left: {L}px; top: 160px; width: 452px">{menu}</div>')

    tilt_photo(o, 'assets/still-shrimp.jpg', 'A dinner guest screams as the shrimp in her cocktail bowl reach up for her face', 528, 196, 228, 186, 3,
               cap='The shrimp cocktail. It grabs back.')
    tilt_photo(o, 'assets/still-handbook.jpg', 'A book on a table: Handbook for the Recently Deceased', 532, 460, 220, 146, -3,
               cap='Found in the attic. Reads like stereo instructions.')
    ad_card(o, 526, 714, 2.5)
    o.append(f'<div style="position: absolute; left: 50px; top: 936px; width: 716px; height: 52px; background: {INK}; transform: rotate(-1deg); '
             f'display: flex; align-items: center; justify-content: center; gap: 14px">'
             f'{kicker("House rule", SLIME, 18)}'
             f'{crooked("Do not say the host’s name three times.", 34, BONE, 5)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 996px; width: {W - 2 * L}px; text-align: center; font-family: {BODY}; font-size: 16px; '
             f'line-height: 1.2; color: #4a4450">Menu by Delia. Table by Otho. Winter River, Connecticut, 1988.</div>')
    return page(''.join(o), 'back', PAPER)

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Dinner at the Deetzes, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
