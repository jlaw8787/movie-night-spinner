"""Ghostbusters kids' birthday party catering menu, New York, spring 1990 season (printed after New Year's Eve 1989).
Table tent card for the party table, two faces 528x816 (folds into a tent). Bright white card, Ghostbusters black, mood slime pink.
Front: painted glossy pink slime dripping off the top, TMDB logo badge, PARTY MENU in Rye, sharp TMDB still of the slime jar, party plates.
Back: Vigo painting in a gilt frame and the Liberty walk still, Ray's note, ghost trap party favour, big plates, sweets, fine print.
Writes slime art, photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 528, 816
PAPER, INK, PINK, DEEP, MUTE, YEL = '#fdfaf6', '#18161a', '#f2479a', '#c41f72', '#4b4450', '#f6c61b'
FONTS = ('https://fonts.googleapis.com/css2?family=Rye&family=Work+Sans:ital,wght@0,400;0,600;0,800;1,400'
         '&family=Caveat:wght@600&display=swap')
DISP = "'Rye', serif"; BODY = "'Work Sans', sans-serif"; SCRIPT = "'Caveat', cursive"
M = 40; CW = W - 2 * M

# ---------------- painted slime (the one painted piece) ----------------
def paint_slime():
    s = 2; w, h = W * s, 190 * s
    rnd = random.Random(1989)
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    d.rectangle([0, 0, w, 74 * s], fill=255)
    x = 0                                            # lumpy lower edge of the sheet
    while x < w:
        r = rnd.randint(16, 30) * s
        d.ellipse([x - r, 74 * s - r, x + r, 74 * s + r * 0.7], fill=255); x += int(r * 1.3)
    drips = [(34, 70), (92, 128), (150, 52), (214, 104), (300, 150), (362, 64), (420, 116), (488, 82)]
    for dx, ln in drips:                             # drips: tapered neck with a fat bead at the end
        dx *= s; ln *= s; bw = rnd.randint(13, 18) * s
        d.polygon([(dx - bw, 70 * s), (dx + bw, 70 * s), (dx + bw * 0.55, 70 * s + ln), (dx - bw * 0.55, 70 * s + ln)], fill=255)
        br = int(bw * 0.95)
        d.ellipse([dx - br, 70 * s + ln - br, dx + br, 70 * s + ln + br * 1.15], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(5 * s)).point(lambda v: 255 if v > 120 else 0).filter(ImageFilter.GaussianBlur(1.2))
    # body colour: lighter in the middle of every blob, deeper at the rims
    core = m.filter(ImageFilter.GaussianBlur(14 * s))
    base = Image.new('RGB', (w, h), (198, 30, 116))
    light = Image.new('RGB', (w, h), (255, 92, 172))
    body = Image.composite(light, base, core.point(lambda v: min(255, int(v * 1.25))))
    # glossy highlights: the blob edge shifted down-right, cut against itself, blurred into a sheen
    shift = ImageChops.offset(m, -4 * s, -6 * s)
    rim = ImageChops.subtract(m, shift).filter(ImageFilter.GaussianBlur(2.5 * s))
    body = Image.composite(Image.new('RGB', (w, h), (255, 214, 236)), body, rim.point(lambda v: int(v * 0.85)))
    gl = Image.new('L', (w, h), 0); gd = ImageDraw.Draw(gl)
    for dx, ln in drips:                             # a bright spec on each bead
        dx *= s; ln *= s
        gd.ellipse([dx - 9 * s, 70 * s + ln - 9 * s, dx - 2 * s, 70 * s + ln - 1 * s], fill=235)
    for i in range(9):                               # long soft streaks along the sheet
        x0 = rnd.randint(10, W - 80) * s; y0 = rnd.randint(14, 44) * s
        gd.ellipse([x0, y0, x0 + rnd.randint(40, 90) * s, y0 + 5 * s], fill=150)
    gl = ImageChops.multiply(gl.filter(ImageFilter.GaussianBlur(2.2 * s)), m)
    body = Image.composite(Image.new('RGB', (w, h), (255, 255, 255)), body, gl)
    # soft shadow under the slime on the card
    sh = m.filter(ImageFilter.GaussianBlur(6 * s)).point(lambda v: int(v * 0.35))
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    shadow = Image.new('RGBA', (w, h), (90, 10, 50, 0)); shadow.putalpha(ImageChops.offset(sh, 0, 4 * s))
    out = Image.alpha_composite(out, shadow)
    top = body.convert('RGBA'); top.putalpha(m)
    out = Image.alpha_composite(out, top)
    out.save(A('art-slime.png'))
paint_slime()

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

HERO_W, HERO_H = CW - 8, 232
jar = Image.open(S('o-ux9t4fjjch9ovAeUmXq6HXm2NtJ.jpg')).convert('RGB')
jar = ImageEnhance.Color(ImageEnhance.Brightness(jar).enhance(1.16)).enhance(1.12)
fit(jar, HERO_W, HERO_H, (240, 120, 1680, 1060)).save(A('still-slime.jpg'), quality=92)

PIC_W, PIC_H = 196, 214
vigo = Image.open(S('o-7EHYnYCN5xpXBya1JpSsEQWSgJa.jpg')).convert('RGB')
vigo = ImageEnhance.Brightness(vigo).enhance(1.12)
fit(vigo, PIC_W - 20, PIC_H - 20, (560, 0, 1400, 1080)).save(A('still-vigo.jpg'), quality=92)
lib = Image.open(S('o-uwwaB8pWBQPTYC7K0RWbTxmwH9x.jpg')).convert('RGB')
lib = ImageEnhance.Brightness(lib).enhance(1.2)
fit(lib, 222, PIC_H, (430, 20, 1030, 640)).save(A('still-liberty.jpg'), quality=92)

logo = Image.open(S('o-t6nZ3rppTPsymlbpDP7wYWkTuIV.jpg')).convert('RGB')
fit(logo, 120, 120, (560, 140, 1360, 940)).save(A('logo.jpg'), quality=94)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(24):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(46 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(10))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 10))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))
    lay = Image.new('RGBA', (W, H), (110, 80, 90, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.45)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 555); wear('back', 2368)

# ---------------- type pieces ----------------
def kicker(t, color=DEEP, size=18, align='left'):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1; white-space: nowrap; text-align: {align}">{t}</div>')

def band(t):
    """Section title on a ghost trap hazard strip: black plate with yellow and black stripes at each end."""
    haz = lambda side: (f'<div style="position: absolute; {side}: 0; top: 0; width: 46px; height: 40px; '
                        f'background: repeating-linear-gradient(45deg, {YEL} 0 8px, {INK} 8px 16px)"></div>')
    return (f'<div style="position: relative; height: 40px; background: {INK}; text-align: center; overflow: hidden">'
            + haz('left') + haz('right') +
            f'<div style="font-family: {DISP}; font-size: 30px; line-height: 42px; color: {PAPER}; letter-spacing: 0.03em; white-space: nowrap">{t}</div></div>')

def item(name, price, desc='', gap=10):
    d = (f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.24; color: {INK}; margin-top: 1px">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 26px; line-height: 1.12; color: {INK}">'
            f'<span>{name}</span><span style="color: {DEEP}">{price}</span></div>{d}</div>')

def plate(t, w):
    return (f'<div style="position: absolute; left: 0; bottom: 0; width: {w}px; box-sizing: border-box; background: rgba(24,22,26,0.82); '
            f'padding: 6px 12px 7px; font-family: {BODY}; font-size: 16px; line-height: 1.25; color: #ffffff">{t}</div>')

def page(inner, name, slime=False):
    edge = (f'<div style="position: absolute; left: 12px; top: 12px; width: {W - 24}px; height: {H - 24}px; box-sizing: border-box; border: 4px solid {INK}; border-radius: 14px"></div>')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            + edge + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

def at(x, y, html, w=CW, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{html}</div>'

# ---------------- props ----------------
def ghost_trap(x, y):
    """Party favour box built like a ghost trap: grey case, hazard side, split lid, pedal on a cord, and its tag."""
    g1, g2 = '#8d9096', '#5b5e64'
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 150px; height: 128px; transform: rotate(-6deg)">'
            # lid halves, slightly open
            f'<div style="position: absolute; left: 10px; top: 6px; width: 62px; height: 16px; background: {g1}; border: 2px solid {INK}; border-radius: 4px 4px 0 0; transform: rotate(-9deg); transform-origin: right bottom"></div>'
            f'<div style="position: absolute; left: 76px; top: 6px; width: 62px; height: 16px; background: {g1}; border: 2px solid {INK}; border-radius: 4px 4px 0 0; transform: rotate(9deg); transform-origin: left bottom"></div>'
            f'<div style="position: absolute; left: 62px; top: 0; width: 26px; height: 22px; border-radius: 50%; background: rgba(242,71,154,0.55)"></div>'
            # case
            f'<div style="position: absolute; left: 6px; top: 22px; width: 136px; height: 44px; background: {g2}; border: 2px solid {INK}; border-radius: 5px; overflow: hidden">'
            f'<div style="position: absolute; left: 0; bottom: 0; width: 136px; height: 15px; background: repeating-linear-gradient(45deg, {YEL} 0 7px, {INK} 7px 14px)"></div>'
            f'<div style="position: absolute; left: 10px; top: 7px; width: 9px; height: 9px; border-radius: 50%; background: #ff3b30; box-shadow: 0 0 6px #ff3b30"></div>'
            f'<div style="position: absolute; left: 26px; top: 8px; width: 96px; height: 6px; background: {g1}; border-radius: 3px"></div></div>'
            # cord and pedal
            f'<div style="position: absolute; left: 134px; top: 52px; width: 10px; height: 34px; border-right: 3px solid {INK}; border-bottom: 3px solid {INK}; border-radius: 0 0 10px 0"></div>'
            f'<div style="position: absolute; left: 112px; top: 84px; width: 34px; height: 14px; background: {INK}; border-radius: 3px"></div>'
            # tag
            f'<div style="position: absolute; left: 0; top: 76px; width: 106px; background: {YEL}; border: 2px solid {INK}; padding: 3px 4px; '
            f'font-family: {BODY}; font-weight: 800; font-size: 14px; line-height: 1.1; color: {INK}; text-align: center; transform: rotate(4deg)">'
            "DON'T LOOK IN THE TRAP</div></div>")

def ray_note(x, y, w):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; box-sizing: border-box; background: #fff; '
            f'box-shadow: 0 3px 8px rgba(30,10,30,0.35); transform: rotate(-1.5deg); padding: 9px 12px 4px; border-left: 6px solid {PINK}">'
            f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.28; color: {INK}">'
            'Kids, the slime feeds on bad moods. Big smiles, lots of cheering, and it stays in the jar.</div>'
            f'<div style="font-family: {SCRIPT}; font-size: 30px; line-height: 1.05; color: {DEEP}">Ray &amp; Winston</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<img src="assets/art-slime.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: 190px; display: block">')
    # logo badge on the slime
    o.append(f'<div style="position: absolute; left: {W // 2 - 70}px; top: 18px; width: 140px; height: 140px; border-radius: 50%; background: #fff; '
             f'border: 4px solid {INK}; box-sizing: border-box; overflow: hidden; box-shadow: 0 4px 10px rgba(60,0,30,0.4)">'
             f'<img src="assets/logo.jpg" alt="The Ghostbusters logo, the ghost holding up two fingers" style="display: block; width: 120px; height: 120px; margin: 6px 0 0 6px"></div>')
    o.append(at(M, 196, kicker("The Ghostbusters do birthdays", align='center')))
    o.append(at(M - 4, 220, f'<div style="font-family: {DISP}; font-size: 64px; line-height: 1; color: {INK}; text-align: center; white-space: nowrap">PARTY MENU</div>', CW + 8))
    o.append(at(M, 296, f'<div style="border: 4px solid {PINK}; background: {PINK}; width: {HERO_W}px">'
                f'<div style="position: relative; width: {HERO_W}px; height: {HERO_H}px">'
                f'<img src="assets/still-slime.jpg" alt="Four men lean over a lab table staring at a tub of glowing slime" style="display: block; width: {HERO_W}px; height: {HERO_H}px">'
                + plate('<b style="color: #ff8cc6">MOOD SLIME.</b> It loves a happy party. Our guys bring a jar to every birthday.', HERO_W) +
                '</div></div>'))
    menu = (band('PARTY PLATES')
            + item('Pink slime dip', '8.50', 'Roast beets, feta, yogurt, garlic, lemon and dill, with warm flatbread.')
            + item('Dancing toaster crumpets', '5.55', 'Crisp, with honey butter. Play them something upbeat.')
            + item('Mini bagel pizzas', '9.00', 'Hot salami, mozzarella, chili honey.'))
    o.append(at(M, 552, menu))
    return page(''.join(o), 'front', True)

# ---------------- BACK ----------------
def back():
    o = []
    gilt = 'background: linear-gradient(135deg, #f3d77a, #b8862b 45%, #f6e3a1 60%, #9c6b1c); padding: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.35)'
    o.append(at(M, 40, f'<div style="{gilt}; width: {PIC_W - 20}px; height: {PIC_H - 20}px">'
                f'<img src="assets/still-vigo.jpg" alt="Oil portrait of a scowling long-haired prince in armour" style="display: block; width: {PIC_W - 20}px; height: {PIC_H - 20}px"></div>', PIC_W))
    o.append(at(M + 226, 40, f'<div style="border: 4px solid {PINK}; width: 214px; height: {PIC_H - 8}px; overflow: hidden; position: relative">'
                f'<img src="assets/still-liberty.jpg" alt="The Statue of Liberty walking up a city avenue at night between tall buildings" style="display: block; width: 222px; height: {PIC_H}px; margin: -4px 0 0 -4px">'
                + plate('Our ride home on New Year’s Eve.', 214) + '</div>', 222))
    o.append(at(M, 262, f'<div style="font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.25; color: {MUTE}">Not on the guest list. Keep him away from the baby.</div>', 200))
    o.append(ray_note(M, 312, 290))
    o.append(ghost_trap(M + 300, 300))
    menu = (band('BIG PLATES')
            + item("Vigo's goulash", '16.10', 'Slow paprika beef, onions, caraway and tomato. Egg noodles, sour cream.')
            + item('Liberty hot dogs', '18.86', 'Mustard, green relish, onion and hot sauerkraut.')
            + f'<div style="margin-top: 12px">{band("SWEETS AND SIPS")}</div>'
            + item('Pink lemonade gelatin', '4.50', 'Raspberries inside. It wobbles to music.')
            + item('Pink slime float', '1.25', 'Pink lemonade over raspberry sorbet.'))
    o.append(at(M, 438, menu))
    o.append(at(M, 752, f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {MUTE}; white-space: nowrap">'
                'Trays serve 12 kids. Book a party: 555-2368. Form GB-1231.</div>'))
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Ghostbusters party menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
