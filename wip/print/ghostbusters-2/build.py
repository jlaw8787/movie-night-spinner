"""Ghostbusters kids' birthday party catering menu, New York, spring 1990 season (printed after New Year's Eve 1989).
Table tent card for the party table, two faces 528x816 (folds into a tent). Bright white card, Ghostbusters black, mood slime pink.
Front: TMDB still of the river of slime across the top, TMDB logo badge, PARTY MENU in Rye, sharp TMDB still of the slime jar, party plates.
Back: Vigo painting in a gilt frame and the Liberty walk still, Ray's note, party favour tag, big plates, sweets, fine print.
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

# ---------------- river of slime banner (TMDB still) ----------------
# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

river = Image.open(S('o-xXk0HUgEi2Untg6EILuewfZlwzY.jpg')).convert('RGB')
river = ImageEnhance.Brightness(river).enhance(1.08)
fit(river, W, 170, (0, 260, 1920, 880)).save(A('still-river.jpg'), quality=92)

HERO_W, HERO_H = CW - 8, 212
jar = Image.open(S('o-ux9t4fjjch9ovAeUmXq6HXm2NtJ.jpg')).convert('RGB')
jar = ImageEnhance.Color(ImageEnhance.Brightness(jar).enhance(1.16)).enhance(1.12)
fit(jar, HERO_W, HERO_H, (240, 120, 1680, 1060)).save(A('still-slime.jpg'), quality=92)

PIC_W, PIC_H = 196, 176
vigo = Image.open(S('o-7EHYnYCN5xpXBya1JpSsEQWSgJa.jpg')).convert('RGB')
vigo = ImageEnhance.Brightness(vigo).enhance(1.12)
fit(vigo, PIC_W - 20, PIC_H - 20, (560, 0, 1400, 1080)).save(A('still-vigo.jpg'), quality=92)
lib = Image.open(S('o-uwwaB8pWBQPTYC7K0RWbTxmwH9x.jpg')).convert('RGB')
lib = ImageEnhance.Brightness(lib).enhance(1.2)
fit(lib, 222, PIC_H, (430, 20, 1030, 640)).save(A('still-liberty.jpg'), quality=92)

logo = Image.open(S('o-t6nZ3rppTPsymlbpDP7wYWkTuIV.jpg')).convert('RGB')
fit(logo, 120, 120, (470, 40, 1450, 1020)).save(A('logo.jpg'), quality=94)

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

def item(name, price, desc='', gap=9):
    d = (f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.24; color: {INK}; margin-top: 1px">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 26px; line-height: 1.12; color: {INK}">'
            f'<span>{name}</span><span style="color: {DEEP}">{price}</span></div>{d}</div>')

def plate(t, w, pos='bottom'):
    return (f'<div style="position: absolute; left: 0; {pos}: 0; width: {w}px; box-sizing: border-box; background: rgba(24,22,26,0.82); '
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
    """Party favour tag, type only: yellow card with a punched hole and string."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 140px; transform: rotate(5deg)">'
            f'<div style="position: relative; background: {YEL}; border: 3px solid {INK}; border-radius: 6px; padding: 26px 8px 12px; '
            f'box-shadow: 0 3px 8px rgba(30,10,30,0.35); font-family: {BODY}; font-weight: 800; font-size: 20px; line-height: 1.1; '
            f'color: {INK}; text-align: center">'
            f'<div style="position: absolute; left: 61px; top: 7px; width: 12px; height: 12px; border-radius: 50%; background: {PAPER}; border: 2px solid {INK}"></div>'
            "DON'T LOOK IN THE TRAP</div></div>")

def ray_note(x, y, w):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; box-sizing: border-box; background: #fff; '
            f'box-shadow: 0 3px 8px rgba(30,10,30,0.35); transform: rotate(-1.5deg); padding: 9px 12px 4px; border-left: 6px solid {PINK}">'
            f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.28; color: {INK}">'
            'The slime feeds on bad moods. Keep cheering, kids!</div>'
            f'<div style="font-family: {SCRIPT}; font-size: 30px; line-height: 1.05; color: {DEEP}">Ray &amp; Winston</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<img src="assets/still-river.jpg" alt="A river of glowing pink slime running through an old brick tunnel" style="position: absolute; left: 0; top: 0; width: {W}px; height: 170px; display: block; border-bottom: 4px solid {PINK}">')
    # logo badge on the slime
    o.append(f'<div style="position: absolute; left: {W // 2 - 66}px; top: 16px; width: 132px; height: 132px; border-radius: 50%; background: #fff; '
             f'border: 4px solid {INK}; box-sizing: border-box; overflow: hidden; box-shadow: 0 4px 10px rgba(60,0,30,0.4)">'
             f'<img src="assets/logo.jpg" alt="The Ghostbusters logo, the ghost holding up two fingers" style="display: block; width: 116px; height: 116px; margin: 4px 0 0 4px"></div>')
    o.append(at(M, 176, kicker("The Ghostbusters do birthdays", align='center')))
    o.append(at(M - 4, 198, f'<div style="font-family: {DISP}; font-size: 64px; line-height: 1; color: {INK}; text-align: center; white-space: nowrap">PARTY MENU</div>', CW + 8))
    o.append(at(M, 274, f'<div style="border: 4px solid {PINK}; background: {PINK}; width: {HERO_W}px">'
                f'<div style="position: relative; width: {HERO_W}px; height: {HERO_H}px">'
                f'<img src="assets/still-slime.jpg" alt="Four men lean over a lab table staring at a tub of glowing slime" style="display: block; width: {HERO_W}px; height: {HERO_H}px">'
                + plate('<b style="color: #ff8cc6">MOOD SLIME.</b> It loves a happy party.', HERO_W, 'top') +
                '</div></div>'))
    menu = (band('PARTY PLATES')
            + item('Pink slime dip', '8.50', 'Roast beets, feta, yogurt, garlic, lemon and dill, with warm flatbread.')
            + item('Dancing toaster crumpets', '5.55', 'Honey butter. Play them something upbeat.')
            + item('Mini bagel pizzas', '9.00', 'Hot salami, mozzarella, chili honey.'))
    o.append(at(M, 500, menu))
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
    o.append(at(M, 224, f'<div style="font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.25; color: {MUTE}">Not on the guest list. Keep him away from the baby.</div>', 212))
    o.append(ray_note(M, 276, 290))
    o.append(ghost_trap(M + 300, 236))
    menu = (band('BIG PLATES')
            + item("Vigo's goulash", '16.10', 'Slow paprika beef, onions, caraway and tomato. Egg noodles, sour cream.')
            + item('Liberty hot dogs', '18.86', 'Mustard, green relish, onion, sauerkraut.')
            + f'<div style="margin-top: 12px">{band("SWEETS AND SIPS")}</div>'
            + item('Pink lemonade gelatin', '4.50', 'Raspberries inside. It wobbles to music.')
            + item('Pink slime float', '1.25', 'Pink lemonade over raspberry sorbet.'))
    o.append(at(M, 378, menu))
    o.append(at(M, 758, f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {MUTE}; white-space: nowrap">'
                'Trays serve 12 kids. Book a party: 555-2368. Form GB-1231.</div>'))
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Ghostbusters party menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
