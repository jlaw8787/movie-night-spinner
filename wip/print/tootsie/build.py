"""The Tea Room, West 57th Street, New York, 1982. The room where Dorothy Michaels lunches with her agent.
Tall room service style folder, two faces 672x1344 (7 x 14 in), rose stock, deep teal and banquette red.
Front: sign, the engraved samovar and tea glass running the height of the face, zakuski, guest book, Reserved card.
Back: kitchen, sweets, samovar drinks, the lunch still with the coat check ticket, fine print.
Run paint.py first (assets/samovar.png). Writes still crop, paper wear, front/back.body.html and front.html / back.html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
W, H = 672, 1344
PAPER, DARK, RED, MUTE, CARD = '#f4e2dc', '#173f3c', '#b31f2c', '#4f6360', '#fdf6f1'
FONTS = ('https://fonts.googleapis.com/css2?family=Pacifico&family=Oswald:wght@500;600;700'
         '&family=Lora:ital,wght@0,400;0,600;1,400&display=swap')
SCRIPT = "'Pacifico', cursive"; DISP = "'Oswald', sans-serif"; BODY = "'Lora', serif"

# ---------------- assets ----------------
def crop(src, dst, w, h, fy=0.5, fx=0.5):
    im = Image.open(A(src)).convert('RGB'); sw, sh = im.size
    r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
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

crop('still-lunch.jpg', 'spot-lunch.jpg', 236, 200, fy=0.3, fx=0.62)
wear('front', 7); wear('back', 40)

# ---------------- type pieces ----------------
def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {DISP}; font-weight: 600; font-size: 18px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def head(t, size=42):
    """Section title: the room's script in red, then a teal and red double rule running out to the margin."""
    return (f'<div style="display: flex; align-items: center; gap: 14px">'
            f'<div style="font-family: {SCRIPT}; font-size: {size}px; line-height: 1.5; color: {RED}; white-space: nowrap">{t}</div>'
            f'<div style="flex: 1; height: 9px; border-top: 3px solid {DARK}; border-bottom: 1px solid {RED}; margin-top: 8px"></div></div>')

def item(name, price, desc, gap=16, size=27):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {DISP}; font-weight: 600; '
            f'font-size: {size}px; line-height: 1.15; color: {DARK}; text-transform: uppercase; letter-spacing: 0.02em">'
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

L, CW = 56, 560

# ---------------- props ----------------
def reserved(o, x, y):
    """Table card for Mr. Fields."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 230px; height: 124px; background: {CARD}; '
             f'box-shadow: 0 2px 7px rgba(40,20,20,0.32); transform: rotate(-4deg); text-align: center">'
             f'<div style="position: absolute; left: 7px; top: 7px; width: 216px; height: 110px; box-sizing: border-box; border: 1.5px solid {RED}"></div>'
             f'<div style="margin-top: 18px; font-family: {DISP}; font-weight: 700; font-size: 22px; letter-spacing: 0.22em; color: {RED}; line-height: 1">RESERVED</div>'
             f'<div style="margin-top: 4px; font-family: {SCRIPT}; font-size: 27px; line-height: 1.3; color: {DARK}">Mr. Fields</div>'
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
RX, RW = 336, 280   # right column beside the samovar

def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px; text-align: center">{kicker("West 57th Street, New York", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 66px; width: {CW}px; text-align: center; font-family: {SCRIPT}; font-size: 76px; line-height: 1.45; color: {RED}">The Tea Room</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 184px; width: {CW}px; text-align: center">{kicker("Christmas all year round")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 214px; width: {CW}px; height: 9px; border-top: 3px solid {DARK}; border-bottom: 1px solid {RED}"></div>')
    o.append(f'<img src="assets/samovar.png" alt="Engraving of a copper samovar with its teapot on the crown, and a glass of tea in a pierced holder" '
             f'style="position: absolute; left: 34px; top: 244px; width: 284px; height: 1041px; display: block">')
    col = (kicker('To begin, at the table')
           + f'<div style="margin-top: 6px">{head("Zakuski", 44)}</div>'
           + item('Finger sandwiches', '5.50', 'Egg salad with watercress, and cucumber with cream cheese, on soft white bread. Crusts off, cut in triangles.', 6, 26)
           + item('Red pepper dip', '4.25', 'Charred under the broiler, peeled, whipped smooth with feta, yogurt, garlic, hot chili flakes and olive oil. Sesame crackers.', 16, 26)
           + item('Blini, red caviar', '9.50', 'Hot buckwheat pancakes, salmon roe, sour cream and melted butter.', 16, 26)
           + f'<div style="margin-top: 26px; background: {CARD}; border: 1.5px solid {DARK}; padding: 14px 16px 6px">'
           + kicker('Our guest book') +
           f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.42; color: {DARK}; margin-top: 8px">'
           'The tea is strong, the room is warm, and nobody here calls me Tootsie.</div>'
           f'<div style="font-family: {SCRIPT}; font-size: 27px; line-height: 1.5; color: {RED}; text-align: right">Dorothy Michaels</div></div>'
           f'<div style="margin-top: 22px; font-family: {DISP}; font-weight: 600; font-size: 22px; line-height: 1.25; letter-spacing: 0.06em; color: {DARK}; text-transform: uppercase">'
           f'Lunch from noon<br>Dinner from five<br><span style="color: {RED}">Supper until one</span></div>')
    o.append(f'<div style="position: absolute; left: {RX}px; top: 250px; width: {RW}px">{col}</div>')
    reserved(o, RX + 26, 1172)
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 54px">{kicker("Dinner from five, supper until one", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 62px; font-family: {SCRIPT}; font-size: 60px; line-height: 1.45; color: {RED}">The Menu</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 164px; width: {CW}px; height: 9px; border-top: 3px solid {DARK}; border-bottom: 1px solid {RED}"></div>')
    coat_check(o, L + CW - 122, 40)
    top = (head('From the kitchen')
           + item('Roast chicken', '19.82', 'Butter, grated lemon peel and thyme under the skin. Carved, with potatoes browned in the drippings.', 4)
           + item('Chicken Kiev', '16.75', 'Rolled around herb butter, breaded and fried golden. Careful with the first cut.')
           + item('Beef Stroganoff', '17.50', 'Tenderloin strips, mushrooms and sour cream over buttered noodles.')
           + f'<div style="margin-top: 18px">{head("Sweets")}</div>'
           + item('Strawberry shortcake', '4.50', 'Cream biscuits baked this morning, split and filled with sugared berries and soft whipped cream.', 4)
           + item('Blintzes', '5.25', 'Thin crepes around sweet farmer cheese, browned in butter, with sour cream.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 180px; width: {CW}px">{top}</div>')
    SY = 846
    samovar = (head('From the samovar', 38)
               + item('Russian tea', '2.40', 'Strong and black, poured into glasses. Lemon and cherry preserves on the side, to stir in.', 4)
               + item('Iced vodka', '3.75', 'Poured from a frosted carafe.')
               + item('Coffee', '1.50', 'With cream, refilled all day.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: {SY}px; width: 300px">{samovar}</div>')
    o.append(f'<div style="position: absolute; left: {L + 324}px; top: {SY + 22}px; width: 236px; border: 2px solid {RED}; padding: 4px; background: {CARD}; box-sizing: content-box; margin-left: -6px">'
             f'<img src="assets/spot-lunch.jpg" alt="A regular and her agent at the front banquette" style="display: block; width: 236px; height: 200px"></div>')
    o.append(f'<div style="position: absolute; left: {L + 318}px; top: {SY + 240}px; width: 248px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.35; color: {MUTE}">'
             'Agents lunch here, and so do their clients.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1232px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 1240px; width: {CW}px; font-family: {BODY}; font-size: 15px; line-height: 1.45; color: {MUTE}">'
             f'<div style="display: flex; justify-content: space-between"><span>West 57th St., N.Y. 10019. PLaza 7-1982.</span><span>Form 4-82</span></div>'
             f'<div style="display: flex; justify-content: space-between"><span>Sandwich trays sent up to the TV studios.</span><span>Prices subject to change.</span></div></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Tea Room menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
