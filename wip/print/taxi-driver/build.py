"""The Hack Stand, an all night cafeteria on Park Avenue South, New York, 1976. Where the night cabbies eat.
Folded card, two landscape faces 1123x794 (A4 landscape, folds to A5). Cab yellow stock, night black ink, neon red.
Outside: back cover (Wizard's note, real 1973 Documerica cab photo, trip sheet, fine print) | front cover (sign, neon rain still, Palantine button).
Inside: steam table and counter | night street still, pies and the urn.
Writes photo crops, wear, outside/inside .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H, FOLD = 1123, 794, 561
PAPER, INK, RED, MUTE, CARD = '#efc54f', '#16130f', '#c3261c', '#4a3d22', '#fbf3dc'
FONTS = ('https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400'
         '&family=Caveat:wght@600&display=swap')
DISP = "'Bowlby One SC', sans-serif"; BODY = "'Libre Franklin', sans-serif"; SCRIPT = "'Caveat', cursive"

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=9):
    """Melt the small beer neons in the bar windows into soft glow so no brand reads (feathered mask, no hard edges)."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.ellipse(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(14))
    return Image.composite(blur, im, m)

neon = Image.open(S('yu2kQTsQ4wQy2Dp9BbyQrtC0qcs.jpg')).convert('RGB')
neon = soften(neon, [(795, 310, 985, 420), (1080, 440, 1200, 515), (1140, 395, 1205, 445),
                     (1330, 355, 1415, 415), (1415, 360, 1505, 410), (1690, 420, 1808, 500), (1490, 85, 1650, 185)])
neon = ImageEnhance.Brightness(neon).enhance(1.18)
fit(neon, 473, 300, (600, 60, 1808, 826)).save(A('hero-neon.jpg'), quality=90)

street = Image.open(S('kDcgouIjSzVB2henVhgtcn1WZpW.jpg')).convert('RGB')
street = ImageEnhance.Brightness(street).enhance(1.25)
fit(street, 473, 130, (300, 380, 3400, 1900)).save(A('night-street.jpg'), quality=90)

cab = Image.open(S('documerica-412-DA-11863.tif')).convert('RGB')
r, g, b = cab.split()                     # take the magenta cast out of the faded slide
cab = Image.merge('RGB', (r.point(lambda v: int(v * 0.94)), g.point(lambda v: min(255, int(v * 1.05))), b))
cab = ImageEnhance.Brightness(ImageEnhance.Contrast(cab).enhance(1.08)).enhance(1.1)
fit(cab, 473, 180, (24, 330, 1976, 1180)).save(A('cab-1973.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(40):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(80 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 18))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    lay = Image.new('RGBA', (W, H), (110, 70, 10, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.55)))
    lay.save(A(f'wear-{name}.png'))
wear('outside', 5); wear('inside', 76)

# ---------------- type pieces ----------------
def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def checker(x, y, w, sq=13, rows=2):
    o = ''
    for i in range(rows):
        off = 0 if i % 2 == 0 else sq
        o += (f'<div style="position: absolute; left: {x}px; top: {y + i * sq}px; width: {w}px; height: {sq}px; '
              f'background: repeating-linear-gradient(90deg, {INK} 0 {sq}px, transparent {sq}px {sq * 2}px); background-position: {off}px 0"></div>')
    return o

def band(t, size=40):
    """Section title: night black plate with the name in cab yellow, a checker tab at the right end."""
    return (f'<div style="position: relative; background: {INK}; height: 56px; overflow: hidden">'
            f'<div style="position: absolute; left: 16px; top: 0; font-family: {DISP}; font-size: {size}px; line-height: 58px; color: {PAPER}; white-space: nowrap">{t}</div>'
            f'<div style="position: absolute; right: 10px; top: 10px; width: 36px; height: 36px; '
            f'background: repeating-linear-gradient(90deg, {PAPER} 0 9px, transparent 9px 18px)"></div>'
            f'<div style="position: absolute; right: 10px; top: 19px; width: 36px; height: 9px; background: {INK}"></div>'
            f'<div style="position: absolute; right: 10px; top: 19px; width: 36px; height: 9px; '
            f'background: repeating-linear-gradient(90deg, transparent 0 9px, {PAPER} 9px 18px)"></div>'
            f'<div style="position: absolute; right: 10px; top: 37px; width: 36px; height: 9px; background: {INK}"></div>'
            f'<div style="position: absolute; right: 10px; top: 37px; width: 36px; height: 9px; '
            f'background: repeating-linear-gradient(90deg, transparent 0 9px, {PAPER} 9px 18px)"></div>'
            '</div>')

def item(name, price, desc, gap=14, size=26):
    gap = gap + EXTRA
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 800; '
            f'font-size: {size}px; line-height: 1.12; color: {INK}">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.32; color: {INK}; margin-top: 3px">{desc}</div></div>')

def rule(): return f'<div style="height: 1px; background: {INK}; opacity: 0.45; margin-top: 14px"></div>'

def frame(src, w, h, alt, border=RED):
    return (f'<div style="border: 3px solid {border}; padding: 3px; background: {CARD}; width: {w}px; box-sizing: content-box; margin-left: -6px">'
            f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.32">'
            + checker(0, 0, W) + checker(0, H - 26, W) + inner +
            f'<div style="position: absolute; left: {FOLD}px; top: 26px; width: 1px; height: {H - 52}px; background: {INK}; opacity: 0.16"></div>'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

BL, FL, CW = 44, FOLD + 45, 473
EXTRA = 0   # back/left panel x, front/right panel x, column width

# ---------------- props ----------------
def button(o, x, y, d=128):
    """Palantine campaign button, the one the volunteers hand out."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; border-radius: 50%; background: #1d2f6b; '
             f'box-shadow: 0 3px 8px rgba(20,10,0,0.45); transform: rotate(-9deg)">'
             f'<div style="position: absolute; left: 7px; top: 7px; width: {d - 14}px; height: {d - 14}px; border-radius: 50%; background: #fbfaf4; text-align: center">'
             f'<div style="margin-top: 24px; font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.08em; line-height: 1.1; color: #c3261c">WE ARE<br>THE PEOPLE</div>'
             f'<div style="margin: 6px auto 0; width: 70px; height: 2px; background: #1d2f6b"></div>'
             f'<div style="margin-top: 5px; font-family: {DISP}; font-size: 17px; line-height: 1; color: #1d2f6b">PALANTINE</div></div></div>')

def trip_sheet(o, x, y):
    """Driver's trip sheet left on the counter, filled in pencil."""
    rows = [('6:05 P', 'Garage', 'Pk Av S', '1.35'), ('11:40 P', '42 St', 'Uptown', '2.90'), ('3:00 A', 'Off duty', 'Here', '.00')]
    cells = ''
    for r in rows:
        cells += (f'<div style="display: flex; border-top: 1px solid #9aa8b8; height: 25px; align-items: center; font-family: {SCRIPT}; font-size: 21px; color: #2b2b40; line-height: 1">'
                  + ''.join(f'<span style="width: {w}px; padding-left: 5px">{t}</span>' for t, w in zip(r, (70, 86, 84, 46))) + '</div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 300px; background: #f7f6ef; box-shadow: 0 2px 7px rgba(20,10,0,0.4); '
             f'transform: rotate(-3deg); padding: 9px 8px 6px; box-sizing: border-box">'
             f'<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.12em; color: #23395b; line-height: 1">'
             f'<span>TRIP SHEET</span><span>NO. 0544</span></div>'
             f'<div style="display: flex; justify-content: space-between; margin-top: 5px; font-family: {SCRIPT}; font-size: 22px; color: #2b2b40; line-height: 1.05">'
             f'<span>Bickle, T.</span><span>6 P to 6 A</span></div>'
             f'<div style="display: flex; margin-top: 4px; font-family: {BODY}; font-weight: 600; font-size: 14px; color: #23395b; line-height: 1.4">'
             + ''.join(f'<span style="width: {w}px; padding-left: 5px">{t}</span>' for t, w in zip(('TIME', 'FROM', 'TO', 'FARE'), (70, 86, 84, 46))) +
             '</div>' + cells + '</div>')

# ---------------- OUTSIDE (back cover | front cover) ----------------
def outside():
    o = []
    # front cover
    o.append(f'<div style="position: absolute; left: {FL}px; top: 52px; width: {CW}px">{kicker("Park Avenue South, N.Y.")}</div>')
    o.append(f'<div style="position: absolute; left: {FL - 3}px; top: 74px; width: {CW + 6}px; font-family: {DISP}; font-size: 66px; line-height: 1; color: {INK}; white-space: nowrap">HACK STAND</div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 150px; width: {CW}px; height: 40px; background: {INK}; color: {PAPER}; '
             f'font-family: {BODY}; font-weight: 800; font-size: 20px; letter-spacing: 0.32em; line-height: 40px; text-align: center">ALL NIGHT CAFETERIA</div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 208px">'
             + frame('hero-neon.jpg', CW - 6, 300, 'Neon bar signs and a wet street at night, the lights doubled in the rain on the pavement') + '</div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 524px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}">'
             'The avenue outside, after a real rain.</div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 562px; width: {CW}px; height: 1px; background: {INK}; opacity: 0.45"></div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 580px; width: {CW}px; font-family: {DISP}; font-size: 30px; line-height: 1.12; color: {INK}">'
             f'Hot plates, pie and coffee.<br><span style="color: {RED}">Any time, anywhere.</span></div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 668px; width: {CW}px; font-family: {BODY}; font-size: 20px; line-height: 1.38; color: {INK}">'
             'Doors never close. Night men eat at the counter, and the urn is always on.</div>')
    button(o, FL + CW - 122, 176)

    # back cover
    o.append(f'<div style="position: absolute; left: {BL}px; top: 52px; width: {CW}px">{kicker("Pinned up by the register")}</div>')
    o.append(f'<div style="position: absolute; left: {BL}px; top: 80px; width: {CW}px; box-sizing: border-box; background: {CARD}; border: 2px solid {INK}; padding: 14px 18px 4px">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 21px; line-height: 1.38; color: {INK}">'
             'Sit down and eat something hot before you go back out, Killer. Twelve hours on coffee is no way to drive.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 34px; line-height: 1.2; color: {RED}; text-align: right">Wizard</div></div>')
    o.append(f'<div style="position: absolute; left: {BL}px; top: 252px; width: {CW}px; font-family: {BODY}; font-size: 20px; line-height: 1.38; color: {INK}">'
             'Wizard, Doughboy and Charlie T. hold the corner table. Get organizized: bus your tray.</div>')
    o.append(f'<div style="position: absolute; left: {BL}px; top: 324px">'
             + frame('cab-1973.jpg', CW - 6, 180, 'A yellow cab in midtown traffic with its roof light set to off duty', INK) + '</div>')
    o.append(f'<div style="position: absolute; left: {BL}px; top: 518px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}">'
             'Light says off duty. That means he is coming here.</div>')
    trip_sheet(o, BL, 566)
    o.append(f'<div style="position: absolute; left: {BL + 322}px; top: 560px; width: {CW - 322}px; font-family: {BODY}; font-size: 16px; line-height: 1.4; color: {INK}">'
             f'<div style="font-weight: 800; letter-spacing: 0.14em; color: {RED}">HACK STAND</div>'
             'Park Ave. So., N.Y.<br>MUrray Hill 5-7098<br>'
             f'<span style="color: {MUTE}">Form 5-76.<br>Prices subject<br>to change.</span></div>')
    return page(''.join(o), 'outside')

# ---------------- INSIDE (left | right) ----------------
def inside():
    o = []
    global EXTRA; EXTRA = 8
    left = (kicker('Served all night from')
            + f'<div style="margin-top: 10px">{band("THE STEAM TABLE")}</div>'
            + item('Hot open roast beef sandwich', '2.25', 'Rare slices warmed in brown gravy on thick white toast, more gravy poured over. Buttered mashed potatoes and peas.', 12)
            + item('Two eggs any style', '1.10', 'Home fries and buttered toast, rye or white.')
            + rule()
            + f'<div style="margin-top: 16px">{band("THE COUNTER")}</div>'
            + item('Thick-cut fries', '.44', 'Cooked twice in hot oil until crisp, salted hard. White vinegar on every table.', 12)
            + item('Cheddar, saltines and pickles', '.85', 'Thick slabs of the sharp stuff, dill spears, a sleeve of crackers and hot English mustard.')
            + item('Chicken noodle soup', '.60', 'From the kettle, with oyster crackers.'))
    o.append(f'<div style="position: absolute; left: {BL}px; top: 52px; width: {CW}px">{left}</div>')

    o.append(f'<div style="position: absolute; left: {FL}px; top: 50px">'
             + frame('night-street.jpg', CW - 6, 130, 'Night traffic on a long avenue seen through a cab windshield, a yellow cab ahead') + '</div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 194px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}">'
             'Uptown at three in the morning, from the front seat.</div>')
    EXTRA = 0
    right = (band('PIES &amp; PUDDING')
             + item('Peach brandy bread pudding', '.76', 'Buttered white loaf layered with brandied peaches, baked in vanilla custard. Served warm.', 12)
             + item('Apple pie, melted yellow cheese', '.65', 'Served warm, a slice of American on top.')
             + rule()
             + f'<div style="margin-top: 16px">{band("THE URN")}</div>'
             + item('Coffee or tea', '.25', 'Bottomless after midnight.', 12)
             + item('Night man\'s coffee', '1.25', 'Strong drip with a nip of peach brandy and brown sugar, a spoonful of soft whipped cream on top.'))
    o.append(f'<div style="position: absolute; left: {FL}px; top: 230px; width: {CW}px">{right}</div>')
    return page(''.join(o), 'inside')

FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Hack Stand menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
