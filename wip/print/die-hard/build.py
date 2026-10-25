"""Nakatomi Plaza Christmas party, 30th floor, Christmas Eve 1988. Tall corporate party folder, two faces 672x1344.
Front: the painted leasing-brochure cutaway of the tower at night (paint.py), the building directory as
letter-board strips keyed to the floors, Holly Gennero's party name badge, a guest relations tip.
Back: the evening's menu on light corporate stock, the tower at sunset (TMDB still), Argyle's limo card,
Mr. Takagi's welcome. Writes the still crop, wear, front/back .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('tower-cutaway.png')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)
W, H = 672, 1344
CHAR, NIGHT, GOLD, RED, PAPER, INK, SOFT = '#25262b', '#16171b', '#c9a14a', '#c4262e', '#e7e2d8', '#1e1f23', '#5a5852'
FONTS = ('https://fonts.googleapis.com/css2?family=Michroma'
         '&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500'
         '&family=Herr+Von+Muellerhoff&display=swap')
DISP = "'Michroma', sans-serif"; BODY = "'IBM Plex Sans', sans-serif"; SCRIPT = "'Herr Von Muellerhoff', cursive"
L = 40

# ---------------- floors (must match paint.py) ----------------
GY, X0, X1 = 1080, 330, 620
HT = {n: (40 if n == 30 else 19.5) for n in range(1, 36)}
def fy(n): return GY - sum(HT[k] for k in range(1, n + 1))

# ---------------- still and wear ----------------
st = Image.open(S('mYOlKvVGfhql8j9dI2ycL5yiiwS.jpg')).convert('RGB')
st = ImageEnhance.Brightness(st).enhance(1.08)
SW, SH = 592, 176
box = (1000, 260, 3740, 150 + int(2740 * SH / SW))   # tower, palms and avenue trees, clear of the cars
st.crop(box).resize((SW * 2, SH * 2), Image.LANCZOS).save(A('still-tower.jpg'), quality=90)

def wear(name, seed, col=(80, 66, 44), k=0.5):
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
    lay = Image.new('RGBA', (W, H), col + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * k)))
    lay.save(A(f'wear-{name}.png'))
wear('back', 1988)

# ---------------- type pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def disp(t, size, color, extra=''):
    return f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1.08; color: {color}; letter-spacing: 0.02em;{extra}">{t}</div>'

def page(inner, name, bg, grain=0.18):
    over = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {grain}">'
            + (f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
               if name == 'back' else ''))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner + over + '</div>')

# ---------------- FRONT ----------------
def strip(o, y, label, line, hot=False, w=262):
    """One letter-board strip of the building directory, with a gold leader to its floor."""
    bg = GOLD if hot else '#111214'
    fg = NIGHT if hot else '#f1ede4'
    sub = NIGHT if hot else '#b9b4a8'
    o.append(f'<div style="position: absolute; left: {L - 8}px; top: {y}px; width: {w}px; background: {bg}; padding: 6px 10px 7px; box-sizing: border-box; '
             f'border-left: 4px solid {RED if hot else GOLD}; box-shadow: 0 3px 8px rgba(0,0,0,0.5)">'
             f'<div style="font-family: {DISP}; font-size: 15px; line-height: 1.25; color: {fg}; letter-spacing: 0.06em">{label}</div>'
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {sub}; margin-top: 1px">{line}</div></div>')

def leader(o, x, y, x2, color=GOLD):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {x2 - x}px; height: 0; border-top: 1.5px solid {color}"></div>'
             f'<div style="position: absolute; left: {x2 - 3}px; top: {y - 3}px; width: 7px; height: 7px; border-radius: 50%; background: {color}"></div>')

def badge(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 248px; transform: rotate({ang}deg)">'
             f'<div style="position: absolute; left: 96px; top: -14px; width: 56px; height: 22px; background: #b9bcc2; border: 1px solid #6c6f75; border-radius: 3px; '
             f'box-shadow: inset 0 0 0 0 transparent"></div>'
             f'<div style="position: absolute; left: 112px; top: -8px; width: 24px; height: 6px; background: #6c6f75; border-radius: 3px"></div>'
             f'<div style="background: #f7f5f0; border-radius: 6px; overflow: hidden; box-shadow: 0 6px 14px rgba(0,0,0,0.55)">'
             f'<div style="background: {RED}; padding: 7px 12px 6px; text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 15px; letter-spacing: 0.08em; color: #fff; line-height: 1.2">NAKATOMI</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.16em; color: #fbe6c8; line-height: 1.2">CHRISTMAS PARTY 1988</div></div>'
             f'<div style="padding: 10px 12px 12px; text-align: center">'
             f'<div style="font-family: {BODY}; font-size: 15px; letter-spacing: 0.14em; color: {SOFT}; line-height: 1.1">HELLO, I AM</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 27px; color: {INK}; line-height: 1.15; margin-top: 3px">Holly Gennero</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {INK}; line-height: 1.2; margin-top: 1px">Vice President</div>'
             f'</div></div></div>')

def front():
    o = []
    o.append(f'<img src="assets/tower-cutaway.png" alt="Painted cutaway of Nakatomi Plaza at night: a glass tower over a garage with a limousine, dark office floors, '
             f'the elevator core, a red air duct, the gold-lit thirtieth floor party with its Christmas tree, three bare floors under construction and a helipad on the roof" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    o.append(f'<div style="position: absolute; left: {L}px; top: 40px; width: {W - 2 * L}px">{kicker("Nakatomi Trading Corporation", GOLD)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 3}px; top: 70px">{disp("CHRISTMAS", 58, "#f4f0e6")}{disp("PARTY", 58, GOLD, " margin-top: 2px")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 212px; width: 400px; font-family: {BODY}; font-size: 20px; line-height: 1.35; color: #e4ded1">'
             f'Christmas Eve, Saturday, December 24.<br>Thirtieth floor, from seven o&rsquo;clock.</div>')
    # directory strips keyed to the floors
    o.append(f'<div style="position: absolute; left: {L - 8}px; top: 276px; width: 262px">{kicker("Building directory", GOLD, 16)}</div>')
    rows = [
        (fy(35) - 58, 'ROOF', 'Helipad. Staff only.', fy(35) - 18, False),
        (fy(34) - 2, '32 TO 34', 'Under construction. Hard hats.', fy(33) + 8, False),
        (fy(30) - 4, '30 / RECEPTION', 'The party. Tree, bar, buffet.', fy(30) + 22, True),
        (fy(24) - 28, 'AIR HANDLING', 'Plant room on 24. Ducts up.', fy(24) + 10, False),
        (fy(20) - 10, 'ELEVATORS', 'Express, lobby to 35.', fy(20) + 10, False),
        (fy(14) - 6, '2 TO 29', 'Nakatomi offices. Closed tonight.', fy(14) + 14, False),
    ]
    for y, lab, line, ly, hot in rows:
        strip(o, y, lab, line, hot)
        leader(o, L - 8 + 262, ly, {'ELEVATORS': 495, 'ROOF': 414}.get(lab, X0 + 4), RED if hot else GOLD)
    badge(o, 50, 884, -4)
    strip(o, GY - 22, 'LOBBY AND GARAGE', 'Sign in at the desk. Limos on P1.', False, 262)
    leader(o, L - 8 + 262, GY - 10, X0 + 4)
    leader(o, L - 8 + 262, GY + 20, 392)
    # guest relations tip and footer
    o.append(f'<div style="position: absolute; left: {L}px; top: 1166px; width: {W - 2 * L}px; border-top: 1.5px solid {GOLD}; padding-top: 12px">'
             f'{kicker("Flew in tonight? A tip from the man in 4B", GOLD, 16)}'
             f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.35; color: #ece6d8; margin-top: 4px">'
             f'Shoes off on our carpet and make fists with your toes. Ten times. Better than a shower.</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1276px; width: {W - 2 * L}px; font-family: {BODY}; font-size: 16px; line-height: 1.2; color: #a49d8e">'
             f'Nakatomi Plaza, Century City, Los Angeles. Form NP-3024. 1988.</div>')
    return page(''.join(o), 'front', NIGHT, 0.10)

# ---------------- BACK ----------------
def section(t, n):
    return (f'<div style="display: flex; align-items: center; gap: 14px; margin-top: 12px; background: {CHAR}; padding: 2px 14px 2px 5px; border-bottom: 3px solid {GOLD}">'
            f'<div style="width: 34px; height: 34px; border-radius: 50%; border: 2px solid {GOLD}; background: #34353b; display: flex; align-items: center; justify-content: center; '
            f'font-family: {DISP}; font-size: 15px; color: {GOLD}; flex: none">{n}</div>'
            f'<div style="font-family: {DISP}; font-size: 28px; line-height: 1.3; color: #f3efe6; letter-spacing: 0.06em">{t}</div></div>')

def item(name, when, desc, note=''):
    nt = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 500; font-size: 18px; line-height: 1.25; color: {RED}; margin-top: 1px">{note}</div>' if note else '')
    return (f'<div style="margin-top: 7px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 27px; line-height: 1.15; color: {INK}">{name}</div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 26px; line-height: 1.15; color: {GOLD}; white-space: nowrap">{when}</div></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: #33343a; margin-top: 1px">{desc}</div>{nt}</div>')

def limo(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 276px; height: 156px; background: #121215; transform: rotate({ang}deg); '
             f'box-shadow: 0 6px 14px rgba(0,0,0,0.45); box-sizing: border-box; padding: 12px 16px; border: 1px solid #3a3a40">'
             f'<div style="position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; border: 1px solid {GOLD}"></div>'
             f'<div style="position: relative; text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 26px; line-height: 1.2; color: {GOLD}; letter-spacing: 0.12em; margin-top: 4px">ARGYLE</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.22em; color: #e9e2cf; line-height: 1.2">LIMOUSINE SERVICE</div>'
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: #d9d2c0; margin-top: 7px">Car phone, stereo, TV, full bar.<br>Waiting in the garage all night.</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 16px; color: {GOLD}; margin-top: 4px">(213) 555-0124</div></div></div>')

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 38px; width: {W - 2 * L}px">{kicker("Thirtieth floor, Christmas Eve", RED)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 64px">{disp("THIS EVENING", 46, INK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 4}px; top: 132px; width: {SW}px; height: {SH}px; border: 4px solid {GOLD}; background: {GOLD}">'
             f'<img src="assets/still-tower.jpg" alt="Nakatomi Plaza at sunset, a tall gold-banded tower rising over palms and avenue trees" '
             f'style="display: block; width: {SW}px; height: {SH}px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 318px; width: {W - 2 * L}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {SOFT}">'
             f'<span style="font-style: italic">Our new home, from the Avenue. Done in time for Christmas.</span><span style="font-weight: 600; color: {RED}">35 FLOORS</span></div>')
    menu = (section('PASSED', '7')
            + item('Smoked Salmon Blini', '7:00', 'Warm blini, cr&egrave;me fra&icirc;che, salmon roe and dill.')
            + item('Rosemary Roasted Nuts', '7:00', 'Cashews and almonds, brown sugar butter, cayenne.', 'Same recipe as the back of the limo.')
            + section('SUPPER', '8')
            + item('Roast Beef on Soft Rolls', '8:30', 'Rare top round, horseradish cream, arugula, pickled onions.')
            + section('SWEETS', '10')
            + item('Cream-Filled Snack Cakes', '10:00', 'Vanilla sponge fingers piped with marshmallow cream.', 'A night patrol favorite. Take two for the road.')
            + item('Christmas Sugar Cookies', '10:00', 'Stars and trees in red and green icing.')
            + section('THE BAR', '30')
            + item('Old Fashioned', 'all night', 'Bourbon, brown sugar, orange bitters, one big cube.')
            + item('Eggnog', 'all night', 'Cold and thick, fresh nutmeg on top.')
            + f'<div style="margin-top: 10px; font-family: {BODY}; font-size: 20px; line-height: 1.3; color: #33343a">'
              f'<b style="font-size: 22px; color: {INK}">Champagne</b> by the bottle, Ellis picks. <b style="font-size: 22px; color: {INK}">Coffee</b> from nine.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 340px; width: {W - 2 * L}px">{menu}</div>')
    limo(o, 44, 1110, -3)
    o.append(f'<div style="position: absolute; left: 346px; top: 1104px; width: 286px">'
             f'{kicker("From the president", RED, 15)}'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.35; color: {INK}; margin-top: 4px">A big year, a new tower. Tonight the 30th floor is yours. '
             f'Bring the family, come out to the coast, have a few laughs.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 46px; line-height: 0.9; color: #1d2a55; margin-top: 2px">Joseph Takagi</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1274px; width: {W - 2 * L}px; border-top: 1px solid #b9b2a2; padding-top: 6px; '
             f'font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {SOFT}">No charge tonight. Merry Christmas from Nakatomi. Form NP-3024.</div>')
    return page(''.join(o), 'back', PAPER, 0.22)

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Nakatomi Christmas Party, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
