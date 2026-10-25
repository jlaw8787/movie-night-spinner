"""NOVA, a Bay Ridge discotheque, Brooklyn, 1977. Where Tony and the crew dance on Saturday night.
Club drink and snack card, two landscape faces 960x672 (10 x 7 in), black gloss stock, cream ink, floor-light gold and pink.
Front: lighted-floor still bleeding off the left edge with a dance contest entry ticket on it | the NOVA sign and the bar list.
Back: real 1973 Verrazano-Narrows Bridge photo across the top | the kitchen list | sweet, Tony's line, pay envelope, fine print.
Writes photo crops, gloss and grain overlays, front/back .body.html and .html."""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 960, 672
BLACK, CREAM, GOLD, PINK, MUTE = '#0e0c10', '#f6eedf', '#f2b23a', '#ee3f73', '#b9ac98'
FONTS = ('https://fonts.googleapis.com/css2?family=Audiowide&family=Jost:ital,wght@0,400;0,500;0,700;1,400'
         '&family=Yellowtail&display=swap')
DISP = "'Audiowide', sans-serif"; BODY = "'Jost', sans-serif"; SCRIPT = "'Yellowtail', cursive"

# ---------------- photos ----------------
def fit(im, w, h, box):
    return im.crop(box).resize((w * 2, h * 2), Image.LANCZOS)

HERO_W = 392
floor = Image.open(S('rksaWEQwMAeJQJVMBIsDph5nLCT.jpg')).convert('RGB')
floor = ImageEnhance.Brightness(ImageEnhance.Contrast(floor).enhance(1.05)).enhance(1.2)
fit(floor, HERO_W, H, (500, 0, 1130, 1080)).save(A('hero-floor.jpg'), quality=90)

bridge = Image.open(S('verrazano-547828.jpg')).convert('RGB').crop((300, 70, 1268, 330))
r, g, b = bridge.split()                       # take the magenta cast out of the faded 1973 slide
bridge = Image.merge('RGB', (r.point(lambda v: int(v * 0.86)), g.point(lambda v: min(255, int(v * 1.1))), b.point(lambda v: min(255, int(v * 1.0)))))
bridge = ImageOps.autocontrast(bridge, cutoff=1)
bridge = ImageEnhance.Color(bridge).enhance(0.9)
bridge = ImageEnhance.Brightness(bridge).enhance(1.05)
BH = 156
bw, bh = bridge.size; ch = int(bw * BH / W)
bridge.crop((0, (bh - ch) // 2 - 10, bw, (bh - ch) // 2 - 10 + ch)).resize((W * 2, BH * 2), Image.LANCZOS).save(A('bridge-1973.jpg'), quality=90)

# light speckle for black stock, from the shared grain
g = Image.open(A('paper-grain.png')).convert('RGBA')
rr, gg, bb, aa = g.split()
Image.merge('RGBA', (rr.point(lambda v: 235), gg.point(lambda v: 225), bb.point(lambda v: 205), aa)).save(A('paper-grain-light.png'))

def gloss(name, flip):
    """Soft diagonal sheen of black gloss stock plus a gentle edge falloff (low detail)."""
    sh = Image.new('L', (W, H), 0); d = ImageDraw.Draw(sh)
    for i in range(0, 260, 2):
        a = int(26 * (1 - abs(i - 130) / 130))
        x0 = (520 if not flip else 300) + i
        d.polygon([(x0, 0), (x0 + 2, 0), (x0 + 2 - 420, H), (x0 - 420, H)], fill=a)
    sh = sh.filter(ImageFilter.GaussianBlur(40))
    lay = Image.new('RGBA', (W, H), (255, 250, 240, 0)); lay.putalpha(sh)
    edge = Image.new('L', (W, H), 0); ed = ImageDraw.Draw(edge)
    for i in range(30):
        ed.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, 120 - i * 4))
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    dark = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dark.putalpha(edge)
    Image.alpha_composite(lay, dark).save(A(f'gloss-wear-{name}.png'))
gloss('front', False); gloss('back', True)

def mirror_ball(path, d=130, pad=34):
    """Painted mirror ball: shaded facet grid on a sphere, a few hot facets, cross glints around it. Transparent PNG at 2x."""
    import math, random
    rnd = random.Random(1977)
    S2 = 2; D2 = d * S2; P2 = pad * S2; N = D2 + P2 * 2
    im = Image.new('RGBA', (N, N), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    cx = cy = N / 2; R = D2 / 2
    rows, cols = 16, 22
    for i in range(rows):
        la0 = -math.pi / 2 + math.pi * i / rows; la1 = -math.pi / 2 + math.pi * (i + 1) / rows
        for j in range(cols):
            lo0 = -math.pi / 2 + math.pi * j / cols; lo1 = -math.pi / 2 + math.pi * (j + 1) / cols
            pts = []
            for la, lo in ((la0, lo0), (la0, lo1), (la1, lo1), (la1, lo0)):
                pts.append((cx + R * math.cos(la) * math.sin(lo), cy + R * math.sin(la)))
            lam, lom = (la0 + la1) / 2, (lo0 + lo1) / 2
            nx, ny, nz = math.cos(lam) * math.sin(lom), math.sin(lam), math.cos(lam) * math.cos(lom)
            light = max(0, -0.45 * nx - 0.55 * ny + 0.7 * nz)
            v = int(40 + 150 * light + rnd.randint(-28, 28))
            col = (v, v, min(255, v + 12), 255)
            r = rnd.random()
            if r < 0.06: col = (255, 250, 236, 255)
            elif r < 0.1: col = (238, 63, 115, 255)
            elif r < 0.14: col = (242, 178, 58, 255)
            dr.polygon(pts, fill=col, outline=(18, 16, 22, 255))
    glow = Image.new('RGBA', (N, N), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    gd.ellipse([cx - R - 10, cy - R - 10, cx + R + 10, cy + R + 10], fill=(238, 63, 115, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    out = Image.alpha_composite(glow, im)
    gl = Image.new('RGBA', (N, N), (0, 0, 0, 0)); g2 = ImageDraw.Draw(gl)
    for (x, y, L) in ((cx - R * 0.45, cy - R * 0.5, 34), (cx + R * 0.95, cy + R * 0.2, 48), (cx - R * 1.05, cy + R * 0.55, 30), (cx + R * 0.3, cy + R * 1.08, 26)):
        L *= S2
        for k in range(10):
            a = int(255 * (1 - k / 10))
            g2.line([(x - L * (1 - k / 10), y), (x + L * (1 - k / 10), y)], fill=(255, 248, 230, a // 3), width=2)
            g2.line([(x, y - L * (1 - k / 10)), (x, y + L * (1 - k / 10))], fill=(255, 248, 230, a // 3), width=2)
        g2.ellipse([x - 5, y - 5, x + 5, y + 5], fill=(255, 255, 255, 255))
    gl = Image.alpha_composite(gl.filter(ImageFilter.GaussianBlur(1.2)), gl)
    Image.alpha_composite(out, gl).save(path)
mirror_ball(A('mirror-ball.png'))

# ---------------- type pieces ----------------
def kicker(t, color=GOLD, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def tube(t, color=GOLD, size=36):
    """Section title as a neon tube: rounded outline with a soft outer glow, name in the same colour."""
    return (f'<div style="display: inline-block; border: 2px solid {color}; border-radius: 26px; padding: 0 22px; height: 50px; '
            f'box-shadow: 0 0 10px {color}66; font-family: {DISP}; font-size: {size}px; line-height: 50px; color: {color}; '
            f'text-shadow: 0 0 8px {color}88; white-space: nowrap">{t}</div>')

def item(name, price, desc, gap=16, pc=GOLD):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 27px; line-height: 1.1; color: {CREAM}">'
            f'<span>{name}</span><span style="color: {pc}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MUTE}; margin-top: 3px">{desc}</div></div>')

def tiles(x, y, w, sq=16, rows=2):
    """A strip of the lighted floor: squares lit gold, pink and dim, in the floor's checker."""
    cols = ['#f2b23a', '#3a2a12', '#ee3f73', '#2a1420', '#f6d27a', '#3a2a12', '#ee3f73', '#1c1620']
    o = ''
    n = w // (sq + 3)
    for r in range(rows):
        for c in range(n):
            col = cols[(c * 3 + r * 5) % len(cols)]
            glow = f'box-shadow: 0 0 9px {col}aa;' if col in ('#f2b23a', '#ee3f73', '#f6d27a') else ''
            o += (f'<div style="position: absolute; left: {x + c * (sq + 3)}px; top: {y + r * (sq + 3)}px; width: {sq}px; height: {sq}px; '
                  f'background: {col}; border-radius: 2px; {glow}"></div>')
    return o

def vtiles(x, sq, h):
    """A column of the lighted floor between the photo and the list."""
    cols = ['#f2b23a', '#2a1420', '#ee3f73', '#3a2a12', '#f6d27a', '#1c1620']
    o = ''; n = h // 15
    for r in range(n):
        col = cols[(r * 2) % len(cols)] if r % 2 == 0 else cols[(r * 2 + 1) % len(cols)]
        glow = f'box-shadow: 0 0 9px {col}aa;' if col in ('#f2b23a', '#ee3f73', '#f6d27a') else ''
        o += (f'<div style="position: absolute; left: {x}px; top: {r * 15 + 2}px; width: 12px; height: 12px; background: {col}; border-radius: 2px; {glow}"></div>')
    return o

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BLACK}">'
            + inner +
            f'<img src="assets/paper-grain-light.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/gloss-wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def contest_ticket(o, x, y):
    """Dance contest entry ticket, filled in at the DJ booth."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 334px; height: 138px; background: #f7ecd2; '
             f'box-shadow: 0 4px 12px rgba(0,0,0,0.6); transform: rotate(-5deg); display: flex">'
             f'<div style="width: 248px; padding: 9px 0 0 12px; box-sizing: border-box">'
             f'<div style="font-family: {DISP}; font-size: 18px; line-height: 1; color: {PINK}; white-space: nowrap">NOVA DANCE CONTEST</div>'
             f'<div style="margin-top: 5px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; color: #2a2024; line-height: 1">ENTRY, ONE COUPLE</div>'
             f'<div style="display: flex; align-items: baseline; margin-top: 7px; border-bottom: 1px solid #9c8e80; height: 27px">'
             f'<span style="font-family: {BODY}; font-size: 14px; color: #5a4c44; width: 44px">HIM</span>'
             f'<span style="font-family: {SCRIPT}; font-size: 25px; color: #1d2a6b; line-height: 1">Tony Manero</span></div>'
             f'<div style="display: flex; align-items: baseline; border-bottom: 1px solid #9c8e80; height: 27px">'
             f'<span style="font-family: {BODY}; font-size: 14px; color: #5a4c44; width: 44px">HER</span>'
             f'<span style="font-family: {SCRIPT}; font-size: 25px; color: #1d2a6b; line-height: 1">Stephanie M.</span></div>'
             f'<div style="margin-top: 5px; font-family: {BODY}; font-weight: 700; font-size: 14px; color: #2a2024; line-height: 1; white-space: nowrap">'
             f'DRESS <span style="display: inline-block; width: 13px; height: 13px; border: 1.5px solid #2a2024; vertical-align: -2px; text-align: center; '
             f'font-family: {SCRIPT}; font-size: 20px; line-height: 10px; color: #1d2a6b">x</span> WHITE SUIT</div></div>'
             f'<div style="width: 0; border-left: 2px dashed #b9a88e; margin: 6px 0"></div>'
             f'<div style="flex: 1; text-align: center; padding-top: 14px">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; color: #5a4c44; line-height: 1">NO.</div>'
             f'<div style="font-family: {DISP}; font-size: 34px; color: {PINK}; line-height: 1.1">77</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: #5a4c44; line-height: 1.15">KEEP<br>THIS</div></div></div>')

def pay_envelope(o, x, y):
    """Small manila pay envelope from the paint store, with the raise pencilled on."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 146px; background: #d8b878; '
             f'box-shadow: 0 4px 12px rgba(0,0,0,0.6); transform: rotate(4deg); overflow: hidden">'
             f'<div style="position: absolute; left: 34px; top: -114px; width: 128px; height: 128px; background: #cba866; transform: rotate(45deg); '
             f'box-shadow: 0 1px 3px rgba(60,40,10,0.45)"></div>'
             f'<div style="position: absolute; left: 0; top: 30px; width: 196px; text-align: center; font-family: {BODY}; font-weight: 700; '
             f'font-size: 14px; letter-spacing: 0.14em; line-height: 1.2; color: #3b2a12">PAINT &amp; HARDWARE<br>'
             f'<span style="font-weight: 400; letter-spacing: 0.06em">Bay Ridge, Brooklyn</span></div>'
             f'<div style="position: absolute; left: 12px; top: 72px; width: 172px; font-family: {BODY}; font-size: 14px; color: #3b2a12; line-height: 1">'
             f'<div style="display: flex; align-items: baseline; border-bottom: 1px solid #8a6a36; height: 25px"><span style="width: 46px">NAME</span>'
             f'<span style="font-family: {SCRIPT}; font-size: 23px; color: #2a2a48">Tony</span></div>'
             f'<div style="display: flex; align-items: baseline; border-bottom: 1px solid #8a6a36; height: 25px"><span style="width: 46px">RAISE</span>'
             f'<span style="font-family: {SCRIPT}; font-size: 23px; color: #2a2a48">$4.00</span></div></div></div>')

# ---------------- FRONT ----------------
RX = HERO_W + 52            # right column x
RW = W - 40 - RX            # right column width

def front():
    o = []
    o.append(f'<img src="assets/hero-floor.jpg" alt="A dancer in an open shirt kicks out on a lighted disco floor under a mirror ball, the crowd watching from the edge" '
             f'style="position: absolute; left: 0; top: 0; width: {HERO_W}px; height: {H}px; display: block">')
    o.append(f'<div style="position: absolute; left: {HERO_W}px; top: 0; width: 18px; height: {H}px; background: {BLACK}"></div>')
    o.append(vtiles(HERO_W + 3, 4, H))
    o.append(f'<div style="position: absolute; left: 40px; top: 40px; background: {BLACK}; padding: 7px 12px; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.2; color: {CREAM}">Contest night. The floor lights at 11.</div>')
    contest_ticket(o, 26, 468)

    o.append(f'<div style="position: absolute; left: {RX}px; top: 40px; width: {RW}px">{kicker("Discotheque, Bay Ridge")}</div>')
    o.append(f'<div style="position: absolute; left: {RX - 4}px; top: 62px; font-family: {DISP}; font-size: 104px; line-height: 1; color: {CREAM}; '
             f'text-shadow: 0 0 14px {PINK}, 0 0 4px {PINK}; letter-spacing: 0.04em">NOVA</div>')
    o.append(f'<div style="position: absolute; left: 872px; top: 0; width: 2px; height: 42px; background: #8d8478"></div>')
    o.append(f'<img src="assets/mirror-ball.png" alt="A mirror ball throwing sparkles" style="position: absolute; left: {873 - 85}px; top: {42 - 29}px; width: 170px; height: 170px; display: block">')
    o.append(f'<div style="position: absolute; left: {RX}px; top: 180px">{tube("AT THE BAR")}</div>')
    bar = (item('The 2001 fizz', '2.01', 'Blended whisky shaken with lemon and sugar, topped with lemonade and soda over ice. A lemon wheel.', 0)
           + item('Tequila sunrise', '2.00', 'Tequila and orange juice, grenadine sunk to the bottom.')
           + item('Screwdriver', '1.75', 'Vodka and fresh orange juice, tall, over ice.')
           + item('Draft beer', '.90', 'Cold by the glass. A pitcher for the crew, 3.50.'))
    o.append(f'<div style="position: absolute; left: {RX}px; top: 246px; width: {RW}px">{bar}</div>')
    o.append(f'<div style="position: absolute; left: {RX}px; top: 566px; width: {RW}px; box-sizing: border-box; border-top: 1px solid {PINK}; padding-top: 8px">'
             + kicker('House rule No. 1', PINK, ' font-size: 16px;')
             + f'<div style="margin-top: 6px; font-family: {DISP}; font-size: 31px; line-height: 1; color: {CREAM}; text-shadow: 0 0 10px {PINK}, 0 0 3px {PINK}; white-space: nowrap">HANDS OFF THE HAIR.</div></div>')
    o.append(tiles(RX, H - 24, W - RX - 20, 12, 1))
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<img src="assets/bridge-1973.jpg" alt="The Verrazano-Narrows Bridge spanning the bay, a wooded shore and beach in the foreground" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: {BH}px; display: block">')
    o.append(f'<div style="position: absolute; left: 0; top: {BH}px; width: {W}px; height: 14px; background: {BLACK}"></div>')
    o.append(tiles(4, BH + 2, W, 10, 1))
    o.append(f'<div style="position: absolute; left: 40px; top: {BH - 40}px; background: {BLACK}; padding: 7px 12px; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.2; color: {CREAM}">The Verrazano. Ten minutes from the floor.</div>')

    LW = 500
    kitchen = (tube('FROM THE KITCHEN', PINK)
               + item('Sausage and peppers', '1.95', 'Grilled Italian sausage in bites, soft sweet peppers and onion, a splash of red wine vinegar.', 12, PINK)
               + item('Disco fries', '1.25', 'Crisp-cut potatoes under hot beef gravy and melted mozzarella. For after the last dance.', 14, PINK)
               + item('Two slices, stacked', '1.00', 'Thin New York pie, tomato, oregano and mozzarella. Stack, fold, strut down 86th Street.', 14, PINK)
               + item('Garlic knots', '.60', 'Pizza dough tied and baked, rolled in garlic oil, parsley and grated cheese.', 14, PINK))
    o.append(f'<div style="position: absolute; left: 40px; top: {BH + 22}px; width: {LW}px">{kitchen}</div>')

    X2 = 40 + LW + 40; W2 = W - 40 - X2
    o.append(f'<div style="position: absolute; left: {X2 - 20}px; top: {BH + 26}px; width: 1px; height: {H - BH - 66}px; background: {CREAM}; opacity: 0.3"></div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: {BH + 22}px; width: {W2}px">'
             + kicker('Under the mirror ball', PINK)
             + item('Mirror ball bites', '.75', 'Butter cake rolled with cream cheese, dipped in white chocolate and silver dragées, on a stick.', 10)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: {BH + 182}px; width: {W2}px; font-family: {BODY}; font-style: italic; font-size: 20px; '
             f'line-height: 1.32; color: {CREAM}">“Two slices, one fizz, then the floor. That’s Saturday.”'
             f'<div style="font-family: {SCRIPT}; font-style: normal; font-size: 32px; line-height: 1.2; color: {GOLD}; text-align: right">Tony M.</div></div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: {BH + 280}px; width: {W2 - 206}px; font-family: {BODY}; font-size: 16px; line-height: 1.36; color: {MUTE}">'
             f'<span style="color: {GOLD}; font-weight: 700; letter-spacing: 0.12em">NOVA</span><br>2001 64th St.<br>Sodas .60<br>Booth 3 held for<br>Bobby C., Joey<br>and Double J.<br>'
             'Card 12-77. Prices<br>subject to change.</div>')
    pay_envelope(o, W - 40 - 202, BH + 300)
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>NOVA drink and snack card, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
