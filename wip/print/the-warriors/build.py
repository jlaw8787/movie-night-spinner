"""Last Stop snack stand, boardwalk at Stillwell, Coney Island, dawn, 1979 (The Warriors).
A subway map fold: two landscape faces 1344x960, four accordion panels of 336 px.
Outside (front): a platform sign over a widescreen frame of the beach at dawn, the late-night radio
request card, counter rules, a token and a vest patch coupon; the cover panel carries the film logo.
Inside (back): the painted ride home map, Bronx to Coney Island, over the menu in four columns,
one per panel, each headed like a station sign with a route bullet.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('ride-home-map.jpg')) or not os.path.exists(A('token.png')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)
sys.path.insert(0, D)
from paint import P as GEO

W, H = 1344, 960
PANEL = 336
BLACK, INK2, MAROON, DAWN, PAPER, SOFT, GREY = '#131313', '#1d1c1b', '#7d2427', '#ee8a3c', '#f0e7d6', '#cbc2b2', '#8d877e'
FONTS = ('https://fonts.googleapis.com/css2?family=Squada+One'
         '&family=Archivo+Narrow:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Rock+Salt&display=swap')
DISP = "'Squada One', sans-serif"; BODY = "'Archivo Narrow', sans-serif"; SCRIPT = "'Rock Salt', cursive"


# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

HERO_W, HERO_H = 1008, 488
beach = ImageEnhance.Brightness(Image.open(S('avUvhy42KuxO3bXfItr5uTf3p6T.jpg')).convert('RGB')).enhance(1.08)
fit(beach, HERO_W, HERO_H, (0, 40, 3404, 40 + int(3404 * HERO_H / HERO_W))).save(A('still-beach-dawn.jpg'), quality=90)
lips = Image.open(S('yv5tfyzFQkNZEIqABafCiXYMqqT.jpg')).convert('RGB')
fit(lips, 252, 96, (1050, 120, 3691, 1500)).save(A('still-dj.jpg'), quality=90)
bw = ImageEnhance.Brightness(Image.open(S('rK69Zde1MQPLmmGddgJWHMw26Kf.jpg')).convert('RGB')).enhance(1.04)
fit(bw, 276, 156, (60, 0, 1240, 666)).save(A('still-boardwalk.jpg'), quality=90)
Image.open(S('uMlZSH5ZsGaznzngJLNxEkCTK2g.png')).save(A('logo.png'))


def wear(name, seed):
    """Black stock rubbed pale at the edges and along the folds. Soft, low detail."""
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(26):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(54 - i * 2.1)))
    for fx in (PANEL, 2 * PANEL, 3 * PANEL):
        md.line([(fx, 0), (fx, H)], fill=34, width=6)
    m = m.filter(ImageFilter.GaussianBlur(10))
    mot = Image.new('L', (W // 32, H // 32), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(36))
    lay = Image.new('RGBA', (W, H), (226, 214, 192, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.42)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 1979); wear('back', 79)


# ---------------- type pieces ----------------
def kicker(t, color=DAWN, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')


def bullet(ch, bg, fg=PAPER, size=44, fs=32, ring=''):
    return (f'<div style="display: inline-block; vertical-align: middle; width: {size}px; height: {size}px; border-radius: 50%; background: {bg}; '
            f'text-align: center; line-height: {size}px; font-family: {DISP}; font-size: {fs}px; color: {fg};{ring}">{ch}</div>')


def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'


def page(inner, name):
    folds = ''.join(f'<div style="position: absolute; left: {fx}px; top: 0; width: 1px; height: {H}px; background: rgba(255,255,255,0.10)"></div>'
                    f'<div style="position: absolute; left: {fx + 1}px; top: 0; width: 2px; height: {H}px; background: rgba(0,0,0,0.35)"></div>'
                    for fx in (PANEL, 2 * PANEL, 3 * PANEL))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BLACK}">'
            + inner + folds +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.10">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


# ---------------- props ----------------
def dj_card(x, y, ang):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 276px; background: {PAPER}; transform: rotate({ang}deg); '
            f'box-shadow: 0 6px 16px rgba(0,0,0,0.7); box-sizing: border-box; padding: 0 0 12px">'
            f'<div style="background: {MAROON}; padding: 7px 12px 5px">{kicker("Late night radio", PAPER, 15, " letter-spacing: 0.2em")}'
            f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {PAPER}; margin-top: 2px">REQUEST LINE</div></div>'
            f'<img src="assets/still-dj.jpg" alt="The radio DJ in close-up, red lipstick at the microphone, red light behind" '
            f'style="display: block; width: 252px; height: 96px; margin: 8px 12px 0; border: 2px solid {BLACK}; box-sizing: border-box">'
            f'<div style="padding: 8px 14px 0; font-family: {BODY}; font-size: 17px; line-height: 1.25; color: {BLACK}">'
            f'<b>Going out to:</b> the boys from Coney.<br>The word was out all night. Now the word is off.</div>'
            f'<div style="padding: 0 14px 0; font-family: {SCRIPT}; font-size: 18px; line-height: 1.3; color: {MAROON}">the DJ</div></div>')


def patch_coupon(x, y, ang):
    """Shaped like the back patch on the vest: an arched top rocker over a stitched panel."""
    import math
    word = 'WARRIORS'; cx, cy, r = 128, 112, 92
    letters = []
    for i, ch in enumerate(word):
        a = -90 + (i - (len(word) - 1) / 2) * 15.5
        px = cx + math.cos(math.radians(a)) * r; py = cy + math.sin(math.radians(a)) * r
        letters.append(f'<div style="position: absolute; left: {px - 16:.1f}px; top: {py - 19:.1f}px; width: 32px; height: 38px; text-align: center; '
                       f'font-family: {DISP}; font-size: 34px; line-height: 38px; color: {PAPER}; transform: rotate({a + 90:.1f}deg)">{ch}</div>')
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 256px; height: 196px; transform: rotate({ang}deg); '
            f'">'
            f'<div style="position: absolute; left: 0; top: 0; width: 256px; height: 196px; background: {MAROON}; '
            f'border-radius: 128px 128px 18px 18px / 112px 112px 18px 18px; box-shadow: 0 6px 16px rgba(0,0,0,0.7)"></div>'
            f'<div style="position: absolute; left: 7px; top: 7px; width: 238px; height: 178px; border: 2px dashed rgba(240,231,214,0.75); '
            f'border-radius: 121px 121px 13px 13px / 105px 105px 13px 13px"></div>'
            + ''.join(letters) +
            f'<div style="position: absolute; left: 0; top: 78px; width: 256px; text-align: center">'
            f'{kicker("Coupon", DAWN, 15)}'
            f'<div style="font-family: {DISP}; font-size: 28px; line-height: 1; color: {PAPER}; margin-top: 3px">SHOW YOUR COLORS</div>'
            f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {PAPER}; margin-top: 4px">Free cherry cola with<br>any chili dog. One per vest.</div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.24em; color: {DAWN}; margin-top: 4px">CONEY ISLAND</div></div>'
            '</div>')


# ---------------- FRONT (outside) ----------------
def front():
    o = []
    # platform sign across panels 1 to 3
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: 1008px; height: 104px; background: #0b0b0b"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 22px; width: 1008px; height: 2px; background: {PAPER}"></div>')
    o.append(at(44, 42, 920, f'{bullet("W", MAROON, size=48, fs=34)}'
                f'<span style="display: inline-block; vertical-align: middle; margin-left: 16px; font-family: {DISP}; font-size: 46px; line-height: 1; color: {PAPER}">CONEY ISLAND</span>'
                f'<span style="display: inline-block; vertical-align: middle; margin-left: 14px; font-family: {DISP}; font-size: 30px; line-height: 1; color: {SOFT}">STILLWELL AV</span>'
                f'<span style="float: right; margin-top: 12px; font-family: {BODY}; font-weight: 600; font-size: 20px; color: {DAWN}">Last stop. Everybody off.</span>'))
    # widescreen frame: the beach at dawn
    o.append(f'<img src="assets/still-beach-dawn.jpg" alt="Coney Island beach at sunrise: the gangs stand on the sand facing the water, the surf bright behind them" '
             f'style="position: absolute; left: 0; top: 104px; width: {HERO_W}px; height: {HERO_H}px; display: block">')
    o.append(f'<div style="position: absolute; left: 0; top: {104 + HERO_H}px; width: 1008px; height: 4px; background: {DAWN}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: {104 + HERO_H - 120}px; width: 1008px; height: 120px; '
             f'background: linear-gradient(to bottom, rgba(10,10,10,0), rgba(10,10,10,0.78))"></div>')
    o.append(at(44, 104 + HERO_H - 78, 600,
                f'{kicker("Coney Island, first light, 1979", DAWN, 17)}'
                f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.05; color: {PAPER}; margin-top: 4px">HOME. WORTH THE WHOLE RIDE.</div>'))

    top = 104 + HERO_H + 18
    # panel 1: the request card
    o.append(dj_card(44, top + 4, -2))
    # panel 2: counter rules
    rules = [('Bats checked at the door.', 'Uniforms and face paint welcome.'),
             ('No roller skates past the counter.', ''),
             ('No bottles clinking.', 'Nobody here is coming out to play.'),
             ('Vests welcome. Orphans too.', ''),
             ('Tag the wall outside, Rembrandt.', 'Not the counter.')]
    rl = ''.join(f'<div style="border-top: 1px solid rgba(240,231,214,0.22); padding: 6px 0 5px">'
                 f'<div style="font-family: {BODY}; font-weight: 700; font-size: 20px; line-height: 1.2; color: {PAPER}">{a}</div>'
                 + (f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.2; color: {SOFT}">{b}</div>' if b else '') + '</div>'
                 for a, b in rules)
    o.append(at(370, top - 4, 270, f'{kicker("Truce in effect", DAWN, 17)}'
                f'<div style="font-family: {DISP}; font-size: 44px; line-height: 1; color: {PAPER}; margin: 4px 0 8px">COUNTER RULES</div>{rl}'))
    # panel 3: token and the vest patch coupon
    o.append(f'<img src="assets/token.png" alt="A brass subway token, good for one fare" '
             f'style="position: absolute; left: 700px; top: {top + 2}px; width: 112px; height: 112px; transform: rotate(-12deg)">')
    o.append(at(820, top + 12, 160, f'{kicker("Fare home", DAWN, 16)}'
                f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1; color: {PAPER}; margin-top: 3px">50&cent;</div>'
                f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.2; color: {SOFT}; margin-top: 2px">Gets you home.</div>'))
    o.append(patch_coupon(714, top + 110, 2.5))

    # panel 4: cover
    cx = 3 * PANEL
    o.append(f'<div style="position: absolute; left: {cx}px; top: 0; width: {PANEL}px; height: {H}px; '
             f'background: linear-gradient(to bottom, #131313 0%, #1a1414 55%, #3a1c16 85%, #6b3020 100%)"></div>')
    o.append(at(cx + 40, 44, 256, kicker('On the boardwalk', DAWN, 16, ' text-align: center')))
    o.append(f'<img src="assets/logo.png" alt="The Warriors, film title in red brush lettering" '
             f'style="position: absolute; left: {cx + 40}px; top: 76px; width: 256px; height: 119px">')
    o.append(at(cx + 40, 212, 256, f'<div style="text-align: center; font-family: {DISP}; font-size: 66px; line-height: 0.9; color: {PAPER}">LAST STOP</div>'
                f'<div style="text-align: center; font-family: {DISP}; font-size: 34px; letter-spacing: 0.16em; line-height: 1; color: {DAWN}; margin-top: 6px">SNACK STAND</div>'))
    o.append(f'<div style="position: absolute; left: {cx + 30}px; top: 344px; width: 276px; padding: 0; border: 3px solid {MAROON}; box-sizing: content-box">'
             f'<img src="assets/still-boardwalk.jpg" alt="The Warriors on the Coney Island boardwalk in their vests, a big painted Warriors sign on the shutters behind them" '
             f'style="display: block; width: 276px; height: 156px"></div>')
    o.append(at(cx + 40, 512, 256, f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.25; color: {SOFT}; text-align: center">'
                f'The boys from Coney, on home turf.</div>'))
    o.append(at(cx + 40, 560, 256, f'<div style="text-align: center; font-family: {DISP}; font-size: 36px; line-height: 1.05; color: {PAPER}">'
                f'CHILI DOGS AT SUNRISE.<br><span style="color: {DAWN}">CAN YOU DIG IT?</span></div>'))
    o.append(at(cx + 40, 690, 256, f'<div style="height: 2px; background: {PAPER}; opacity: 0.5"></div>'
                f'<div style="text-align: center; margin-top: 12px">{bullet("1", DAWN, BLACK, 32, 22)} {bullet("2", MAROON, PAPER, 32, 22)} '
                f'{bullet("3", PAPER, BLACK, 32, 22)} {bullet("4", GREY, BLACK, 32, 22)}</div>'
                f'{kicker("Menu and ride home map inside", PAPER, 16, " text-align: center; margin-top: 12px; letter-spacing: 0.16em")}'
                f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {SOFT}; text-align: center; margin-top: 10px">'
                f'Open all night. Grill hot by 5 A.M.<br>Chili dogs nine to a tray, 9.00.</div>'))
    o.append(at(cx + 40, 856, 256, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {PAPER}; opacity: 0.85; text-align: center">'
                f'Prices subject to change. Form W-9.<br>Printed in Brooklyn, N.Y., 1979.</div>'))
    return page(''.join(o), 'front')


# ---------------- BACK (inside) ----------------
MENU = [
    ('1', DAWN, BLACK, 'COUNTER', [
        ('Soft pretzel bites', '.60', 'Brushed with butter, served warm. Sharp cheddar dip, yellow mustard.'),
        ('Street-cart corn', '.50', 'Charred ribs off the cob, chili butter, lime, smoked salt.'),
        ('Potato knish', '.65', 'Griddled square, onion and black pepper, brown mustard.')]),
    ('2', MAROON, PAPER, 'GRILL', [
        ('Coney chili dogs', '1.79', 'Griddled beef franks, beef chili, onion, mustard. Shoestring fries.'),
        ('Sausage hero', '1.75', 'Sweet Italian sausage, fried peppers and onions, seeded roll.'),
        ('Egg on a roll', '.85', 'Two fried eggs, salt and pepper, a kaiser roll. Ready at first light.')]),
    ('3', PAPER, BLACK, 'COLD', [
        ('Ice cream sandwich', '.75', 'Vanilla between chewy chocolate cookies, dipped in dark chocolate.'),
        ('Lemon ice', '.35', 'Shaved and tart, in a paper cup.'),
        ('Twist cone', '.45', 'Vanilla and chocolate soft serve.')]),
    ('4', GREY, BLACK, 'FOUNTAIN', [
        ('Cherry cola', '.40', 'Ice-cold cola, cherry syrup, a squeeze of lime.'),
        ('Chocolate egg cream', '.50', 'Chocolate syrup, cold milk, seltzer. No egg, no cream.'),
        ('Coffee, regular', '.30', 'Milk and two sugars, the way the boardwalk takes it.')]),
]

STOPS = [  # (lat, lon, name, note, dx, dy, align)
    (40.8970, -73.8860, 'VAN CORTLANDT PARK', 'Midnight. The conclave.', -63, 26, 'left'),
    (40.8900, -73.8800, 'WOODLAWN', 'Over the wall to the el.', -89, -72, 'left'),
    (40.8480, -73.9050, 'TREMONT', 'Fire on the tracks. Orphans turf.', 16, -70, 'left'),
    (40.7937, -73.9722, '96 ST', 'Change here. Furies in the park.', -60, -84, 'left'),
    (40.7359, -73.9906, 'UNION SQ', 'Lizzies upstairs. Punks on skates.', 22, 30, 'left'),
    (40.5774, -73.9812, 'CONEY ISLAND', 'Stillwell Av. Last stop. Breakfast.', -296, 28, 'right'),
]


def stop_label(lat, lon, name, note, dx, dy, align):
    x, y = GEO(lat, lon, 1)
    return (f'<div style="position: absolute; left: {x + dx:.0f}px; top: {y + dy:.0f}px; width: 270px; text-align: {align}">'
            f'<div style="display: inline-block; background: #0b0b0b; padding: 0 10px 4px; border-top: 2px solid {PAPER}; '
            f'box-shadow: 0 3px 8px rgba(0,0,0,0.55); text-align: left">'
            f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1.1; color: {PAPER}; padding-top: 3px">{name}</div>'
            f'<div style="font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.15; color: {DAWN}">{note}</div></div></div>')


def back():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 500px; overflow: hidden"><img src="assets/ride-home-map.jpg" alt="Painted map of the ride home, night to dawn: a maroon line runs from Van Cortlandt Park in the Bronx, '
             f'through Tremont, down Manhattan by 96th Street and Union Square, across Brooklyn to Coney Island, where a Ferris wheel and the parachute tower stand against the sunrise" '
             f'style="display: block; width: {W}px; height: 540px"></div>')
    o.extend(stop_label(*s) for s in STOPS)
    # map title, over New Jersey
    o.append(at(40, 370, 300,
                f'<div style="background: rgba(11,11,11,0.86); padding: 10px 14px 10px; border-top: 2px solid {PAPER}">'
                f'{kicker("Bronx to Coney Island", DAWN, 15)}'
                f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1; color: {PAPER}; margin-top: 3px; white-space: nowrap">THE LONG RIDE HOME</div>'
                f'<div style="margin-top: 6px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {SOFT}">'
                f'<span style="display: inline-block; width: 30px; height: 6px; background: {MAROON}; border: 1px solid {PAPER}; vertical-align: middle"></span>'
                f'&nbsp; One long night, by train and on foot<br>North is to the left. Sunrise, far right.</div></div>'))
    # menu band
    o.append(f'<div style="position: absolute; left: 0; top: 500px; width: {W}px; height: 460px; background: {BLACK}"></div><div style="position: absolute; left: 0; top: 500px; width: {W}px; height: 4px; background: {DAWN}"></div>')
    for i, (ch, bg, fg, title, items) in enumerate(MENU):
        x0 = i * PANEL + (40 if i == 0 else 28)
        cw = (i + 1) * PANEL - (40 if i == 3 else 28) - x0
        head = (f'{bullet(ch, bg, fg, 46, 32)}'
                f'<span style="display: inline-block; vertical-align: middle; margin-left: 12px; font-family: {DISP}; font-size: 42px; line-height: 1; color: {PAPER}">{title}</span>')
        body = ''
        for n, p, d in items:
            body += (f'<div style="margin-top: 17px">'
                     f'<div style="display: flex; justify-content: space-between; align-items: baseline; font-family: {BODY}; font-weight: 700; font-size: 27px; line-height: 1.1; color: {PAPER}">'
                     f'<span>{n}</span><span style="color: {DAWN}">{p}</span></div>'
                     f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.18; color: {SOFT}; margin-top: 1px">{d}</div></div>')
        o.append(at(x0, 522, cw, f'<div style="border-top: 2px solid {PAPER}; padding-top: 10px">{head}</div>{body}'))
    o.append(at(40, 884, W - 80, f'<div style="border-top: 1px solid rgba(240,231,214,0.3); padding-top: 8px; display: flex; justify-content: space-between; '
                f'font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {SOFT}">'
                f'<span>Chili dogs come nine to a tray for the whole crew, 9.00. Every gang eats.</span>'
                f'<span>Prices subject to change. Last Stop, the boardwalk at Stillwell, 1979.</span></div>'))
    return page(''.join(o), 'back')


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Last Stop snack stand, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
