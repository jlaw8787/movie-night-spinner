"""The Tea Room, West 57th Street, New York, 1982. The room where Dorothy Michaels lunches with her agent.
Two-sided dinner card (US Letter) on rose stock, deep teal and banquette red, built on the house style lock.
Front: sign, the samovar room still, zakuski. Back: kitchen, sweets, samovar, second still, guest book note.
Writes assets (still crops, paper wear), front/back.body.html and full pages front.html / back.html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
W, H = 816, 1056
PAPER, DARK, RED, MUTE, CARD = '#f4e2dc', '#173f3c', '#b31f2c', '#4f6360', '#fdf6f1'
FONTS = ('https://fonts.googleapis.com/css2?family=Pacifico&family=Oswald:wght@500;600;700'
         '&family=Lora:ital,wght@0,400;0,600;1,400&display=swap')
SCRIPT = "'Pacifico', cursive"; DISP = "'Oswald', sans-serif"; BODY = "'Lora', serif"

# ---------------- assets ----------------
def crop(src, dst, w, h, fy=0.5, fx=0.5):
    im = Image.open(A(src)).convert('RGB'); sw, sh = im.size
    r = w / h
    if sw / sh > r:
        cw, ch = int(sh * r), sh
    else:
        cw, ch = sw, int(sw / r)
    x = int((sw - cw) * fx); y = int((sh - ch) * fy)
    im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS).save(A(dst), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(46):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 1.5)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 20))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), (120, 60, 50, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))

crop('still-samovar.jpg', 'hero-samovar.jpg', 704, 372, fy=0.35)
crop('still-lunch.jpg', 'spot-lunch.jpg', 318, 168, fy=0.3, fx=0.55)
wear('front', 7); wear('back', 40)

# ---------------- type pieces ----------------
def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {DISP}; font-weight: 600; font-size: 18px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def bar(t, size=40):
    """Section title: a teal ribbon with rounded ends, the name in the room's script."""
    return (f'<div style="display: inline-block; background: {DARK}; color: {PAPER}; border-radius: 40px; font-family: {SCRIPT}; '
            f'font-size: {size}px; line-height: 1.35; padding: 0 {26 if size > 36 else 20}px 6px; box-shadow: 0 0 0 2px {PAPER}, 0 0 0 3px {RED}">{t}</div>')

def item(name, price, desc, gap=18):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {DISP}; font-weight: 600; '
            f'font-size: 28px; line-height: 1.15; color: {DARK}; text-transform: uppercase; letter-spacing: 0.02em">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.38; color: {DARK}; margin-top: 3px">{desc}</div></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.30">'
            f'<div style="position: absolute; left: 18px; top: 18px; width: {W - 36}px; height: {H - 36}px; box-sizing: border-box; border: 6px solid {DARK}"></div>'
            f'<div style="position: absolute; left: 28px; top: 28px; width: {W - 56}px; height: {H - 56}px; box-sizing: border-box; border: 1.5px solid {RED}"></div>'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

L, CW = 56, 704

# ---------------- props ----------------
def reserved(o, x, y):
    """Table card for Mr. Fields, tucked over the corner of the picture."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 214px; height: 118px; background: {CARD}; '
             f'box-shadow: 0 2px 7px rgba(40,20,20,0.32); transform: rotate(-5deg); text-align: center">'
             f'<div style="position: absolute; left: 7px; top: 7px; width: 200px; height: 104px; box-sizing: border-box; border: 1.5px solid {RED}"></div>'
             f'<div style="margin-top: 16px; font-family: {DISP}; font-weight: 700; font-size: 22px; letter-spacing: 0.22em; color: {RED}; line-height: 1">RESERVED</div>'
             f'<div style="margin-top: 4px; font-family: {SCRIPT}; font-size: 26px; line-height: 1.3; color: {DARK}">Mr. Fields</div>'
             f'<div style="font-family: {DISP}; font-weight: 500; font-size: 15px; letter-spacing: 0.12em; color: {DARK}; line-height: 1">ONE O&rsquo;CLOCK, FOR TWO</div>'
             '</div>')

def coat_check(o, x, y):
    """Coat check ticket, number 40."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 150px; background: {RED}; '
             f'box-shadow: 0 2px 6px rgba(40,20,20,0.32); transform: rotate(6deg); text-align: center; color: {CARD}">'
             f'<div style="position: absolute; left: 0; top: -5px; width: 104px; height: 10px; background: repeating-linear-gradient(90deg, {PAPER} 0 5px, transparent 5px 10px)"></div>'
             f'<div style="position: absolute; left: 44px; top: 16px; width: 16px; height: 16px; border-radius: 50%; background: {PAPER}"></div>'
             f'<div style="margin-top: 42px; font-family: {DISP}; font-weight: 600; font-size: 15px; letter-spacing: 0.2em; line-height: 1">COAT CHECK</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 58px; line-height: 1.1">40</div>'
             f'<div style="font-family: {DISP}; font-weight: 500; font-size: 14px; letter-spacing: 0.12em; line-height: 1">THE TEA ROOM</div>'
             '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("West 57th Street, New York", DARK)}{kicker("Christmas all year round")}</div>')
    o.append(f'<div style="position: absolute; left: {L - 4}px; top: 62px; font-family: {SCRIPT}; font-size: 80px; line-height: 1.45; color: {RED}">The Tea Room</div>')
    o.append(f'<div style="position: absolute; left: {L + 524}px; top: 104px; width: {CW - 524}px; text-align: right; font-family: {DISP}; font-weight: 700; '
             f'font-size: 26px; line-height: 1.1; color: {DARK}; text-transform: uppercase; letter-spacing: 0.03em">Lunch<br>Dinner<br>Late supper</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 200px; width: {CW}px; height: 3px; background: {DARK}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 220px; width: {CW}px; height: 372px; outline: 2px solid {RED}; outline-offset: 5px">'
             f'<img src="assets/hero-samovar.jpg" alt="Lunch in the front room, red banquettes and the brass samovar" '
             f'style="display: block; width: {CW}px; height: 372px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 606px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">'
             f'<span>The front room. Agents lunch here, and so do their clients.</span><span>Table four</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 640px; width: {CW}px">'
             f'<div style="display: flex; align-items: center; justify-content: space-between">{bar("Zakuski")}{kicker("To begin, at the table", RED)}</div>'
             + item('Finger sandwiches', '5.50', 'Egg salad with watercress, and cucumber with cream cheese, on soft white bread. Crusts off, cut in triangles.', 10)
             + item('Red pepper dip', '4.25', 'Charred under the broiler, peeled, whipped smooth with feta, yogurt, garlic, hot chili flakes and olive oil. Sesame crackers.', 12)
             + item('Blini with red caviar', '9.50', 'Hot buckwheat pancakes, salmon roe, sour cream and melted butter.', 12)
             + '</div>')
    reserved(o, L + CW - 222, 474)
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
COLW, GAP = 330, 44
X2 = L + COLW + GAP

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 54px">{kicker("Dinner from five, supper until one", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 60px; font-family: {SCRIPT}; font-size: 60px; line-height: 1.45; color: {RED}">The Menu</div>')
    o.append(f'<div style="position: absolute; left: {L + 380}px; top: 82px; width: {CW - 380}px; text-align: right; font-family: {DISP}; font-weight: 700; '
             f'font-size: 28px; line-height: 1.04; color: {DARK}; text-transform: uppercase; letter-spacing: 0.03em">The Tea Room<br>New York</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 160px; width: {CW}px; height: 3px; background: {DARK}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 178px; width: {COLW}px">{inner}</div>'
    left = (bar('From the kitchen', 32)
            + item('Roast chicken', '19.82', 'Butter, grated lemon peel and thyme under the skin. Carved, with potatoes browned in the drippings.', 12)
            + item('Chicken Kiev', '16.75', 'Rolled around herb butter, breaded and fried golden.', 14)
            + item('Beef Stroganoff', '17.50', 'Tenderloin strips, mushrooms and sour cream over buttered noodles.', 14)
            + f'<div style="height: 1px; background: {DARK}; opacity: 0.45; margin: 20px 0 18px"></div>'
            + bar('Sweets', 32)
            + item('Shortcake', '4.50', 'Cream biscuits baked this morning, split, with sugared strawberries and soft whipped cream.', 12)
            + item('Blintzes', '5.25', 'Thin crepes around sweet farmer cheese, browned in butter, with sour cream.', 14))
    right = (bar('From the samovar', 32)
             + item('Russian tea', '2.40', 'Strong and black, poured into glasses. Lemon and cherry preserves on the side, to stir in.', 12)
             + item('Iced vodka', '3.75', 'Poured from a frosted carafe.', 14)
             + item('Coffee', '1.50', 'With cream, refilled all day.', 14)
             + f'<div style="margin-top: 20px; border: 2px solid {RED}; padding: 4px; background: {CARD}">'
             f'<img src="assets/spot-lunch.jpg" alt="A regular and her agent at the front banquette" style="display: block; width: 318px; height: 168px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.35; color: {MUTE}; margin-top: 6px">Business lunch at the front banquette.</div>'
             f'<div style="margin-top: 14px; background: {CARD}; border: 1.5px solid {DARK}; padding: 12px 16px 6px">'
             + kicker('From our guest book') +
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.42; color: {DARK}; margin-top: 8px">'
             'The tea is strong, the room is warm, and nobody here calls me Tootsie.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 28px; line-height: 1.5; color: {RED}; text-align: right">Dorothy Michaels</div></div>')
    o.append(col(L, left)); o.append(col(X2, right))
    coat_check(o, L + CW - 92, 530)
    o.append(f'<div style="position: absolute; left: {L}px; top: 960px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 968px; width: {CW}px; font-family: {BODY}; font-size: 15px; line-height: 1.45; color: {MUTE}">'
             f'<div style="display: flex; justify-content: space-between"><span>West 57th St., New York, N.Y. 10019. PLaza 7-1982.</span><span>Prices subject to change.</span></div>'
             f'<div style="display: flex; justify-content: space-between"><span>Sandwich trays sent up to the television studios.</span><span>Form 4-82</span></div></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Tea Room menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
