"""The Prizzi wedding supper, Brooklyn, 1985. Tall reception card, two faces 600x1200, ivory card stock,
oxblood and old gold, Pirata One display.
Front: the parish photo in a church arch, the antipasti, the seating plan, the couple who both came armed.
Back: the family table, "Ice her? Marry her?" dessert choice, the Don's sweet table with a still, the toast.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 600, 1200
PAPER, INK, WINE, GOLD, SOFT = '#f4ece2', '#2b1d1b', '#5f1a26', '#94702f', '#6b5a52'
FONTS = ('https://fonts.googleapis.com/css2?family=Pirata+One&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400'
         '&family=Pinyon+Script&display=swap')
DISP = "'Pirata One', serif"; BODY = "'EB Garamond', serif"; SCRIPT = "'Pinyon Script', cursive"
L, CW = 46, 508

# ---------------- pictures ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

# 1. The parish, LOC FSA/OWI 1944, warm sepia, cut into a church arch with a gold rule baked in.
AW, AH = 380, 350
src = Image.open(S('olph-north-jeh.jpg')).convert('RGB')
_b = src.filter(ImageFilter.GaussianBlur(9)); _m = Image.new('L', src.size, 0)
ImageDraw.Draw(_m).rectangle([292, 926, 368, 1000], fill=255)  # melt the school banner lettering
src = Image.composite(_b, src, _m.filter(ImageFilter.GaussianBlur(3)))
ch = src.convert('L')
ch = ImageEnhance.Contrast(ImageEnhance.Brightness(ch).enhance(1.06)).enhance(1.08)
ch = fit(ch, AW, AH, (0, 56, 960, 940))
lo, hi = np.array([46, 30, 28]), np.array([250, 242, 228])
g = np.asarray(ch).astype(float)[..., None] / 255
ch = Image.fromarray((lo + (hi - lo) * g).astype('uint8'), 'RGB')
def arch_mask(w, h, inset=0):
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m); r = w // 2 - inset
    d.ellipse([inset, inset, w - inset, inset + 2 * r], fill=255)
    d.rectangle([inset, inset + r, w - inset, h - inset], fill=255)
    return m
w2, h2 = AW * 2, AH * 2
out = Image.new('RGBA', (w2, h2), (0, 0, 0, 0))
gold = Image.new('RGBA', (w2, h2), (148, 112, 47, 255))
out.paste(gold, (0, 0), arch_mask(w2, h2, 0))
out.paste(Image.new('RGBA', (w2, h2), (244, 236, 226, 255)), (0, 0), arch_mask(w2, h2, 6))
out.paste(gold, (0, 0), arch_mask(w2, h2, 12))
out.paste(ch.convert('RGBA'), (0, 0), arch_mask(w2, h2, 16))
out.save(A('parish-arch.png'))

# 2. The couple, both armed: TMDB key art, cream ground keyed out so it prints on the card.
cp = Image.open(S('nWuMujweJPPuvwakC5Y6wyrZmfp.jpg')).convert('RGB').crop((430, 64, 1510, 1024))
a = np.asarray(cp).astype(int); dist = np.abs(a - np.array([232, 228, 219])).sum(2)
alpha = np.clip((dist - 14) * 8, 0, 255).astype('uint8')
al = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2))
cp = cp.convert('RGBA'); cp.putalpha(al)
cp.resize((440, 391), Image.LANCZOS).save(A('couple-armed.png'))

# 3. The Don at home with Maerose, TMDB still, bright and clean.
dn = Image.open(S('2KWUR87bUjCfk5HGQCUTbpYFBnd.jpg')).convert('RGB')
dn = ImageEnhance.Brightness(dn).enhance(1.1)
fit(dn, 236, 176, (0, 0, 1500, 1080)).save(A('don-sweets.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(60 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 20, H // 20), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), (110, 70, 50, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 7); wear('back', 72)

# ---------------- type pieces ----------------
def kicker(t, color=GOLD, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1; text-align: center;{extra}">{t}</div>')

def course(t, size=46, color=WINE, rule=GOLD):
    r = f'<div style="flex: 1; height: 5px; border-top: 1.5px solid {rule}; border-bottom: 1px solid {rule}"></div>'
    dia = f'<div style="width: 9px; height: 9px; background: {rule}; transform: rotate(45deg); margin: 0 4px"></div>'
    return (f'<div style="display: flex; align-items: center; gap: 10px">{r}{dia}'
            f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1.05; color: {color}; white-space: nowrap">{t}</div>{dia}{r}</div>')

def item(name, desc, gap=14, size=27, dsize=20, color=INK, dcolor=INK, center=True, note=''):
    al = 'center' if center else 'left'
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {GOLD}; line-height: 1.2; margin-top: 2px">{note}</div>' if note else '')
    return (f'<div style="margin-top: {gap}px; text-align: {al}">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; line-height: 1.12; color: {color}">{name}</div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.28; color: {dcolor}; margin-top: 2px">{desc}</div>{n}</div>')

def frame():
    return (f'<div style="position: absolute; left: 16px; top: 16px; width: {W - 36}px; height: {H - 36}px; border: 2px solid {GOLD}"></div>'
            f'<div style="position: absolute; left: 23px; top: 23px; width: {W - 48}px; height: {H - 48}px; border: 1px solid {GOLD}"></div>'
            + ''.join(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 12px; height: 12px; background: {WINE}; transform: rotate(45deg)"></div>'
                      for x, y in ((11, 11), (W - 23, 11), (11, H - 23), (W - 23, H - 23))))

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            + frame() + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.2">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def envelope(o, x, y):
    """The sealed envelope with a job in it, left at Charley's place."""
    w, h = 168, 106
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: #ebe2cf; '
             f'box-shadow: 0 3px 9px rgba(40,20,10,0.4); transform: rotate(9deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 0; height: 0; border-left: {w // 2}px solid transparent; '
             f'border-right: {w // 2}px solid transparent; border-top: 58px solid #ddd2bb"></div>'
             f'<div style="position: absolute; left: {w // 2 - 17}px; top: 40px; width: 34px; height: 34px; border-radius: 50%; '
             f'background: radial-gradient(circle at 38% 34%, #9a3242, {WINE} 62%, #3d0d16); box-shadow: 0 1px 3px rgba(0,0,0,0.4); '
             f'text-align: center; font-family: {DISP}; font-size: 24px; line-height: 34px; color: #e9c9b8">P</div>'
             f'<div style="position: absolute; left: 12px; top: 74px; font-family: {SCRIPT}; font-size: 22px; line-height: 1; color: #2c2a4a">Charley P.</div>'
             f'<div style="position: absolute; right: 10px; top: 6px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.06em; line-height: 1; color: {WINE}">AFTER THE CAKE</div></div>')

def almond_box(o, x, y):
    """A little box of confetti almonds tied with gold ribbon, a few sugared almonds spilled beside it."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 132px; height: 92px; transform: rotate(-6deg)">'
             f'<div style="position: absolute; left: 0; top: 10px; width: 132px; height: 82px; background: #fbf8f2; border: 1px solid #d8cdbd; '
             f'box-shadow: 0 3px 8px rgba(40,20,10,0.35)"></div>'
             f'<div style="position: absolute; left: -3px; top: 0; width: 138px; height: 26px; background: #fffdf8; border: 1px solid #d8cdbd; '
             f'box-shadow: 0 2px 4px rgba(40,20,10,0.2)"></div>'
             f'<div style="position: absolute; left: 58px; top: 0; width: 16px; height: 92px; background: {GOLD}"></div>'
             f'<div style="position: absolute; left: 0; top: 46px; width: 132px; height: 14px; background: {GOLD}"></div>'
             f'<div style="position: absolute; left: 44px; top: 36px; width: 44px; height: 34px; border-radius: 50%; border: 5px solid #b48b42; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 6px; top: 66px; width: 120px; text-align: center; font-family: {DISP}; font-size: 18px; color: {WINE}; line-height: 1">Confetti</div></div>')
    for dx, dy, r, c in ((140, 70, 18, '#fbf3ee'), (124, 92, -24, '#f3d9dd'), (156, 96, 40, '#fbf3ee'), (106, 104, 8, '#e9eef2')):
        o.append(f'<div style="position: absolute; left: {x + dx}px; top: {y + dy}px; width: 24px; height: 16px; border-radius: 50%; '
                 f'background: radial-gradient(circle at 35% 30%, #ffffff, {c} 55%, #c9b9ae); box-shadow: 0 1px 3px rgba(40,20,10,0.35); transform: rotate({r}deg)"></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">{kicker("Brooklyn, New York")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 74px; width: {CW}px; text-align: center; font-family: {DISP}; '
             f'font-size: 70px; line-height: 0.98; color: {WINE}">The Prizzi<br>Wedding</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 218px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 21px; line-height: 1.25; color: {INK}">Supper in honor of Don Corrado\'s granddaughter<br>and her groom</div>')
    o.append(f'<img src="assets/parish-arch.png" alt="The parish church on a stone church front with twin towers, arched doors and a cross on the gable" '
             f'style="position: absolute; left: {(W - AW) // 2}px; top: 268px; width: {AW}px; height: {AH}px; display: block">')
    envelope(o, 392, 262)
    o.append(f'<div style="position: absolute; left: {L}px; top: 626px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.25; color: {SOFT}">Our Lady, Sunset Park. Every Prizzi marries here.</div>')

    ap = (kicker('To begin', size=18) + f'<div style="margin-top: 6px">{course("Antipasti")}</div>'
          + item('The bride\'s antipasto', 'Lemon-marinated mushrooms, salami, olives, artichokes.', 10)
          + item('Brooklyn arancini', 'Saffron rice round a mozzarella heart, fried gold, marinara.', 12)
          + item('Zucchini fritti', 'Light crisp batter, sea salt and a squeeze of lemon.', 12))
    o.append(f'<div style="position: absolute; left: {L}px; top: 662px; width: {CW}px">{ap}</div>')

    # seating plan, left; the couple who both came armed, right
    rows = [('1', 'Don Corrado'), ('2', 'Charley and Angelo'), ('7', 'Maerose. Far from Charley.'), ('?', 'The lady in lavender')]
    rs = ''.join(f'<div style="display: flex; gap: 10px; align-items: baseline; margin-top: 5px; border-top: 1px solid rgba(148,112,47,0.5); padding-top: 5px">'
                 f'<div style="width: 22px; font-family: {DISP}; font-size: 24px; color: {WINE}; line-height: 1">{n}</div>'
                 f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.15; color: {INK}">{t}</div></div>' for n, t in rows)
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 954px; width: 262px">'
             f'{kicker("Seating", size=17, extra=" text-align: left")}'
             f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1.05; color: {WINE}; margin-top: 2px">Who Sits Where</div>{rs}</div>')
    o.append(f'<img src="assets/couple-armed.png" alt="A man in a tuxedo and a woman in a red sequined dress embrace, each hiding a pistol behind the other\'s back" '
             f'style="position: absolute; left: 336px; top: 940px; width: 210px; height: 187px; display: block">')
    o.append(f'<div style="position: absolute; left: 322px; top: 1128px; width: 236px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 16px; line-height: 1.2; color: {SOFT}">First dance. Both came armed.</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    fam = (kicker('From the kitchen') + f'<div style="margin-top: 6px">{course("The Family Table", 44)}</div>'
           + item('Wedding soup', 'Escarole and tiny veal meatballs in clear chicken brodo.', 10)
           + item('Don Corrado\'s baked ziti', 'Slow sausage sugo, ricotta and mozzarella, baked until blistered.', 12, note='The old man\'s favorite. Seconds are not optional.')
           + item('Veal piccata', 'Pounded thin, seared fast, white wine, lemon, capers and butter.', 12, note='Charley\'s usual.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">{fam}</div>')

    # the big one: dessert, pick one
    col = lambda big, n, d: (f'<div style="width: 216px; text-align: center">'
                             f'<div style="font-family: {DISP}; font-size: 54px; line-height: 1; color: #d9b46a">{big}</div>'
                             + item(n, d, 6, 26, 19, PAPER, '#ecdcd0') + '</div>')
    o.append(f'<div style="position: absolute; left: {L - 6}px; top: 420px; width: {CW + 12}px; height: 270px; background: {WINE}; '
             f'box-sizing: border-box; padding: 18px 22px 0">'
             f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 1px solid #c49a55"></div>'
             f'{kicker("Pick one. Charley can\'t.", "#d9b46a", 17)}'
             f'<div style="font-family: {DISP}; font-size: 48px; line-height: 1.05; color: {PAPER}; text-align: center; margin-top: 6px">Ice Her? Marry Her?</div>'
             f'<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px">'
             + col('Ice', 'Lemon ice', 'Shaved fine, sharp and cold. Quick, and very clean.')
             + f'<div style="width: 1px; height: 150px; background: #c49a55; margin-top: 8px"></div>'
             + col('Marry', 'Wedding amaretti', 'Crackled almond cookies in icing sugar, tied in tulle.')
             + '</div></div>')

    # the old Don's sweets
    o.append(f'<div style="position: absolute; left: {L}px; top: 712px; width: 340px">{kicker("At the sweet table", extra=" text-align: left")}'
             f'<div style="font-family: {DISP}; font-size: 44px; line-height: 1.05; color: {WINE}; margin-top: 4px">The Don\'s Sweets</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 790px; width: 236px; height: 176px; border: 3px solid {GOLD}; outline: 1px solid {WINE}; outline-offset: 2px">'
             f'<img src="assets/don-sweets.jpg" alt="Don Corrado holds his granddaughter\'s hands at a garden table set with fruit and a coffee pot" '
             f'style="display: block; width: 236px; height: 176px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 978px; width: 244px; font-family: {BODY}; font-style: italic; font-size: 16px; '
             f'line-height: 1.2; color: {SOFT}">The Don, Sunday coffee in the garden.</div>')
    o.append(f'<div style="position: absolute; left: 306px; top: 822px; width: 250px">'
             + item('Confetti almonds', 'Sugared, five to a bag: health, wealth, happiness, children, long life.', 0, 25, 19, center=False)
             + f'<div style="font-family: {BODY}; font-weight: 700; font-size: 17px; color: {WINE}; margin-top: 6px; letter-spacing: 0.04em">THE DON TAKES FIRST PICK. WAIT.</div></div>')
    o.append(f'<div style="position: absolute; left: 306px; top: 984px; width: 250px; font-family: {BODY}; font-style: italic; font-size: 19px; '
             f'line-height: 1.25; color: {INK}">Eat. Enjoy. Nobody leaves before the cake. Nobody.</div>')
    o.append(f'<div style="position: absolute; left: 330px; top: 1032px; font-family: {SCRIPT}; font-size: 34px; line-height: 1; color: {WINE}">Corrado Prizzi</div>')

    # the toast
    o.append(f'<div style="position: absolute; left: {L}px; top: 1074px; width: {CW}px; border-top: 1.5px solid {GOLD}; padding-top: 8px; '
             f'display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {DISP}; font-size: 28px; color: {WINE}; line-height: 1">The Toast</div>'
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.2; color: {INK}"><b>White peach Bellini</b> &middot; <b>Espresso, anisette</b></div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1116px; width: {CW}px; text-align: center; font-family: {BODY}; font-size: 16px; '
             f'line-height: 1.25; color: {SOFT}">With the compliments of the family. Envelopes to Angelo at the door.<br>'
             'Printed for the reception, 720 Court Street, Brooklyn, 1985.</div>')
    almond_box(o, 396, 700)
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Prizzi wedding supper, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
