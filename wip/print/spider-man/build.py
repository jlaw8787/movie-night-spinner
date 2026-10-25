"""Grand Moon Diner, Sixth Avenue at Grand Street, Manhattan, 2002. The diner where Mary Jane waits tables (Spider-Man, 2002).
Laminated diner menu, two faces 816x1056 (US Letter), white stock in diner navy and red, soft laminate sheen, rounded corners.
Front: neon-style sign masthead, the Daily Bugle front page clipping laminated into the menu (TMDB still), coffee coupon, breakfast.
Back: waitress note from M.J., Forest Hills street still, sandwiches, blue plate, fountain and pie, fine print.
Writes photo crops, sheen/wear PNGs, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
PAPER, NAVY, RED, MUTE, NEWS, CREAM = '#fbf9f3', '#1c2b5a', '#c8262d', '#5a6178', '#efece3', '#fff6dc'
FONTS = ('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Barlow:ital,wght@0,400;0,600;0,800;1,400'
         '&family=Caveat:wght@600&display=swap')
DISP = "'Racing Sans One', sans-serif"; BODY = "'Barlow', sans-serif"; SCRIPT = "'Caveat', cursive"
L, CW = 44, 728

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def newsprint(im):
    """Light dot screen so the photo reads as printed on the Bugle's front page, colour kept bright."""
    w, h = im.size; dots = Image.new('L', (w, h), 255); dd = ImageDraw.Draw(dots)
    g = im.convert('L')
    for y in range(0, h, 6):
        for x in range((y // 6) % 2 * 3, w, 6):
            v = g.getpixel((x, y)); r = (255 - v) / 255 * 2.4
            if r > 0.4: dd.ellipse([x - r, y - r, x + r, y + r], fill=150)
    dots = dots.filter(ImageFilter.GaussianBlur(0.6))
    return Image.composite(im, Image.blend(im, Image.new('RGB', im.size, (40, 35, 40)), 0.35), dots)

swing = Image.open(S('lAtlbbDD14e48aViozEntFTkjoA.jpg')).convert('RGB')
swing = ImageEnhance.Brightness(swing).enhance(1.05)
newsprint(fit(swing, 430, 272, (180, 60, 1920, 1080))).save(A('bugle-photo.jpg'), quality=90)

queens = Image.open(S('cb4BsGIhr06QQFbP8pW9z5aLh3H.jpg')).convert('RGB')
queens = ImageEnhance.Brightness(queens).enhance(1.06)
fit(queens, 384, 216, (0, 120, 3840, 2160)).save(A('forest-hills.jpg'), quality=90)

kiss = Image.open(S('k4U306K3u0dPoV7ULSuxxW3ImLP.jpg')).convert('RGB')
kiss = ImageEnhance.Brightness(kiss).enhance(1.08)
fit(kiss, 384, 200, (0, 0, 2074, 1100)).save(A('rain-kiss.jpg'), quality=90)

def web(fn, r, rgba, spokes=8, rings=7, width=2):
    """Corner web, engraved line style: spokes from the corner, sagging threads between them."""
    import math
    k = 2; R2 = r * k; im = Image.new('RGBA', (R2, R2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    angs = [math.pi / 2 + i * (math.pi / 2) / (spokes - 1) for i in range(spokes)]  # corner at top right
    cx, cy = R2, 0
    for a in angs: d.line([(cx, cy), (cx + math.cos(a) * R2 * 1.02, cy + math.sin(a) * R2 * 1.02)], fill=rgba, width=width * k)
    for j in range(1, rings + 1):
        rr = R2 * j / (rings + 0.6)
        for a, b in zip(angs, angs[1:]):
            p0 = (cx + math.cos(a) * rr, cy + math.sin(a) * rr); p1 = (cx + math.cos(b) * rr, cy + math.sin(b) * rr)
            m = ((a + b) / 2); sag = rr * 0.86
            pm = (cx + math.cos(m) * sag, cy + math.sin(m) * sag)
            pts = [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * pm[0] + t * t * p1[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * pm[1] + t * t * p1[1]) for t in [i / 12 for i in range(13)]]
            d.line(pts, fill=rgba, width=max(1, int(width * k * 0.75)))
    im.resize((r, r), Image.LANCZOS).save(A(fn))
web('web-sign.png', 200, (142, 155, 199, 255))
web('web-paper.png', 170, (28, 43, 90, 60))

def finish(name, seed):
    """Laminate: soft diagonal sheen plus gentle edge wear. Low detail, never over text strongly."""
    rnd = random.Random(seed)
    sheen = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sheen)
    x0 = rnd.randint(380, 520)
    sd.polygon([(x0, -40), (x0 + 120, -40), (x0 - 380, H + 40), (x0 - 500, H + 40)], fill=70)
    sd.polygon([(x0 + 170, -40), (x0 + 200, -40), (x0 - 300, H + 40), (x0 - 330, H + 40)], fill=45)
    sheen = sheen.filter(ImageFilter.GaussianBlur(46))
    lay = Image.new('RGBA', (W, H), (255, 255, 255, 0)); lay.putalpha(sheen)
    lay.save(A(f'sheen-{name}.png'))
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rounded_rectangle([i, i, W - 1 - i, H - 1 - i], radius=18, outline=max(0, int(60 - i * 1.8)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 24, H // 24), 0)
    for x in range(mot.width):
        for y in range(mot.height): mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    wl = Image.new('RGBA', (W, H), (90, 80, 60, 0))
    wl.putalpha(Image.blend(m, mot, 0.3).point(lambda v: int(v * 0.8)))
    wl.save(A(f'wear-{name}.png'))
finish('front', 2); finish('back', 15)

# ---------------- type pieces ----------------
def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def moon(x, y, d, ring=PAPER, cut=NAVY):
    """Crescent moon from the rooftop sign: a red disc with a navy disc cut out of it."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; border-radius: 50%; background: {RED}; '
            f'border: 4px solid {ring}; box-sizing: border-box; overflow: hidden">'
            f'<div style="position: absolute; left: {int(d * 0.28)}px; top: {int(-d * 0.1)}px; width: {d}px; height: {d}px; border-radius: 50%; background: {cut}"></div></div>')

def speed(w, color=NAVY, gap=6):
    return ''.join(f'<div style="height: {3 if i == 1 else 2}px; width: {(str(w - i * 40) + "px") if w else (str(100 - i * 22) + "%")}; background: {color}; margin-top: {gap if i else 0}px; margin-left: auto"></div>' for i in range(3))

def bar(t, size=42, note=''):
    """Section title: red chrome-edged plate with the name in the sign face, speed lines running out to the right."""
    return (f'<div style="display: flex; align-items: center; gap: 16px">'
            f'<div style="background: {RED}; border-radius: 30px; border: 3px solid {NAVY}; padding: 0 26px; height: 58px; '
            f'font-family: {DISP}; font-size: {size}px; line-height: 60px; color: {PAPER}; white-space: nowrap">{t}</div>'
            f'<div style="flex: 1">{speed(0)}</div>'
            + (f'<div style="font-family: {BODY}; font-weight: 600; font-style: italic; font-size: 18px; color: {MUTE}; white-space: nowrap">{note}</div>' if note else '')
            + '</div>')

def item(name, price, desc, gap=14):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px; font-family: {BODY}; font-weight: 800; font-size: 27px; line-height: 1.12; color: {NAVY}">'
            f'<span style="white-space: nowrap">{name}</span>'
            f'<span style="flex: 1; border-bottom: 3px dotted {NAVY}; opacity: 0.35; transform: translateY(-6px)"></span>'
            f'<span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: #2a2d3a; margin-top: 3px">{desc}</div></div>')

def rule(): return f'<div style="height: 1px; background: {NAVY}; opacity: 0.4; margin-top: 16px"></div>'

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; border-radius: 18px">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<img src="assets/sheen-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<div style="position: absolute; left: 7px; top: 7px; width: {W - 14}px; height: {H - 14}px; border: 1.5px solid rgba(255,255,255,0.75); border-radius: 13px; box-sizing: border-box"></div>'
            '</div>')

# ---------------- props ----------------
def clipping(o, x, y):
    """Front page of the Daily Bugle, cut out and laminated into the menu by the owner."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 470px; background: {NEWS}; padding: 14px 18px 14px; box-sizing: border-box; '
             f'box-shadow: 1px 3px 8px rgba(30,25,20,0.35); transform: rotate(-1.4deg)">'
             f'<div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px double #222; padding-bottom: 5px">'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 34px; letter-spacing: 0.04em; line-height: 1; color: #1a1a1a">DAILY BUGLE</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.2; color: #333; text-align: right">NEW YORK<br>50 CENTS</div></div>'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 44px; line-height: 1; letter-spacing: -0.01em; color: #111; margin-top: 8px">WHO IS SPIDER-MAN?</div>'
             f'<img src="assets/bugle-photo.jpg" alt="A masked man in red and blue swinging on a line between tall Manhattan buildings" '
             f'style="display: block; width: 430px; height: 272px; margin-top: 9px">'
             f'<div style="display: flex; justify-content: space-between; margin-top: 5px; font-family: {BODY}; font-size: 14px; line-height: 1.2; color: #333">'
             f'<span style="font-style: italic">Swinging over Sixth Avenue at lunch hour.</span><span style="font-weight: 800">Photo: P. Parker</span></div>'
             '</div>')

def ticket(o, x, y):
    """Wrestling night ticket, Bone Saw's three minutes."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 232px; background: {NAVY}; border-radius: 6px; padding: 10px 12px 10px; '
             f'box-sizing: border-box; transform: rotate(-2deg); box-shadow: 0 2px 6px rgba(30,25,20,0.35); text-align: center; border: 2px solid {RED}">'
             f'{kicker("Friday, on the TV", "#c9d1ea", "font-size: 14px")}'
             f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {PAPER}; margin-top: 6px; white-space: nowrap">Wrestling Night</div>'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 16px; line-height: 1.3; color: #ff6b6b; margin-top: 5px">BONE SAW VS. ALL COMERS</div>'
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {PAPER}; margin-top: 3px">Eat a Bone Saw in three minutes, it\'s on us.</div></div>')

def coupon(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 236px; background: {CREAM}; border: 3px dashed {RED}; padding: 10px 12px; '
             f'box-sizing: border-box; transform: rotate(2.2deg); box-shadow: 0 2px 6px rgba(30,25,20,0.3); text-align: center">'
             f'{kicker("Clip and save", NAVY, "font-size: 14px")}'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1; color: {RED}; margin-top: 7px; white-space: nowrap">Free Coffee</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; line-height: 1.25; color: {NAVY}; margin-top: 6px">One cup with any<br>breakfast order.</div>'
             f'<div style="height: 1px; background: {NAVY}; opacity: 0.4; margin: 8px 0 6px"></div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {MUTE}">Not good on Unity Day. No. 0503</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 176px; background: {NAVY}"></div>')
    o.append(moon(L, 40, 112))
    o.append(f'<div style="position: absolute; left: 176px; top: 40px; font-family: {DISP}; font-size: 72px; line-height: 1; color: {PAPER}; white-space: nowrap">Grand Moon</div>')
    o.append(f'<div style="position: absolute; left: 180px; top: 120px; background: {RED}; border-radius: 20px; height: 38px; padding: 0 22px; '
             f'font-family: {BODY}; font-weight: 800; font-size: 22px; letter-spacing: 0.34em; line-height: 38px; color: {PAPER}">DINER</div>')
    o.append(f'<div style="position: absolute; left: 340px; top: 122px; width: 432px; text-align: right; font-family: {BODY}; font-weight: 600; font-size: 18px; '
             f'letter-spacing: 0.16em; line-height: 1.35; color: #c9d1ea">SIXTH AVE. AT GRAND ST.<br>OPEN 6 A.M. TO 1 A.M.</div>')
    o.append(f'<div style="position: absolute; left: {W - 200}px; top: 0; width: 200px; height: 176px; overflow: hidden"><img src="assets/web-sign.png" alt="" aria-hidden="true" style="width: 200px; height: 200px; display: block; opacity: 0.55"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 176px; width: {W}px; height: 6px; background: {RED}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 186px; width: {W}px; height: 2px; background: {NAVY}"></div>')

    clipping(o, L + 2, 212)
    o.append(f'<div style="position: absolute; left: 540px; top: 214px; width: 232px">'
             + kicker('House rule')
             + f'<div style="font-family: {DISP}; font-size: 33px; line-height: 1.04; color: {NAVY}; margin-top: 8px">Drop your tray? We catch it.</div>'
             f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: #2a2d3a; margin-top: 6px">Every plate, still on it. Don\'t ask how.</div></div>')
    ticket(o, 540, 386)
    coupon(o, 542, 532)

    o.append(f'<div style="position: absolute; left: {L}px; top: 658px; width: {CW}px">'
             + bar('Breakfast All Day', 42)
             + item('The Bone Saw', '3.00', 'Two fried eggs, melted American and hot sauce, wrapped in foil on a soft roll.', 10)
             + item('Buttermilk tall stack', '5.25', 'Fluffy pancakes cooked in butter, piled high, with warm maple syrup.')
             + item('Two eggs any style', '4.50', 'Home fries and buttered toast, rye or white.')
             + item('Western omelette', '5.75', 'Three eggs folded over ham, green pepper and onion. Home fries.')
             + '</div>')
    o.insert(0, f'<img src="assets/web-paper.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: {H - 170}px; width: 170px; height: 170px; display: block; transform: rotate(180deg)">')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 98px; background: {NAVY}"></div>')
    o.append(moon(L, 32, 56))
    o.append(f'<div style="position: absolute; left: 114px; top: 40px; font-family: {DISP}; font-size: 44px; line-height: 1; color: {PAPER}; white-space: nowrap">Grand Moon Diner</div>')
    o.append(f'<div style="position: absolute; left: {W - 130}px; top: 0; width: 130px; height: 98px; overflow: hidden"><img src="assets/web-sign.png" alt="" aria-hidden="true" style="position: absolute; left: -70px; top: 0; width: 200px; height: 200px; display: block; opacity: 0.55"></div>')
    o.append(f'<div style="position: absolute; left: 500px; top: 46px; width: 160px">{speed(160, "#8e9bc7", 8)}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 98px; width: {W}px; height: 6px; background: {RED}"></div>')

    # waitress note
    o.append(f'<div style="position: absolute; left: {L}px; top: 122px; width: 314px; height: 150px; background: {CREAM}; border: 2px solid {NAVY}; '
             f'border-radius: 10px; padding: 16px 18px 0; box-sizing: border-box">'
             + kicker('From your waitress', RED, 'font-size: 16px')
             + f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.35; color: {NAVY}; margin-top: 8px">'
             'Not pouring your coffee? I am at an audition.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 36px; line-height: 1; color: {RED}; text-align: right; margin-top: 0">M.J.</div></div>')
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 288px; width: 306px; background: {NEWS}; border: 2px solid #222; padding: 8px 12px; box-sizing: border-box; '
             f'transform: rotate(-1.5deg); box-shadow: 1px 2px 6px rgba(30,25,20,0.3)">'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 28px; line-height: 1; color: #111; letter-spacing: 0.02em">PHOTOS WANTED</div>'
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: #222; margin-top: 4px">Spider-Man. Clear pictures only. Cash paid. '
             f'<b>J. Jonah Jameson, Daily Bugle.</b></div></div>')
    # Queens still
    o.append(f'<div style="position: absolute; left: 380px; top: 122px; border: 3px solid {NAVY}; padding: 3px; background: {PAPER}">'
             f'<img src="assets/rain-kiss.jpg" alt="An upside-down masked man and a red-haired woman kissing in the pouring rain" style="display: block; width: 384px; height: 200px"></div>')
    o.append(f'<div style="position: absolute; left: 380px; top: 338px; width: 392px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}">'
             'Seen in the alley out back, in the rain. Upside down. The kitchen has questions.</div>')

    lw, rx, rw = 352, 424, 348
    left = (bar('Sandwiches', 40)
            + item('Holiday sliders', '7.95', 'Warm turkey, cranberry sauce and crisp baked stuffing on toasted mini buns.', 10)
            + item('Grilled cheese', '5.95', 'American on buttered white, griddled golden, with a cup of tomato soup.')
            + item('Burger deluxe', '7.50', 'Half pound, American cheese, lettuce, tomato, fries, slaw and a pickle.')
            + rule()
            + f'<div style="margin-top: 18px">{bar("Blue Plate", 40)}</div>'
            + item('Thanksgiving dinner', '12.95', 'Brined roast turkey breast, stuffing, pan gravy, roast potatoes and pumpkin.', 10))
    o.append(f'<div style="position: absolute; left: {L}px; top: 392px; width: {lw}px">{left}</div>')
    right = (bar('Fountain', 40)
             + item('Bugle cherry rickey', '2.75', 'Fresh lime, sweet red syrup and soda water over ice, a maraschino on top.', 10)
             + item('Egg cream', '2.25', 'Chocolate syrup, cold milk and seltzer, stirred hard until it foams.')
             + item('Coffee', '1.00', 'Fresh pot every twenty minutes. Refills free.')
             + rule()
             + f'<div style="margin-top: 18px">{bar("Pie Case", 40)}</div>'
             + item('Rice pudding', '3.25', 'Baked with cinnamon and raisins, warm or cold.', 10))
    o.append(f'<div style="position: absolute; left: {rx}px; top: 392px; width: {rw}px">{right}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 956px; width: {CW}px; height: 2px; background: {NAVY}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 966px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {MUTE}">'
             '<span>Grand Moon Diner, Sixth Ave. at Grand St., N.Y. (212) 555-0503<br>Since 1962. Midtown Science kids 10% off.</span>'
             f'<span style="text-align: right">Menu No. 15. Prices subject to change.<br><span style="color: {RED}; font-weight: 600">No substitutions on the Bone Saw.</span></span></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Grand Moon Diner menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
