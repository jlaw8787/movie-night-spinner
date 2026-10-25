"""Vito's, a family restaurant on Mulberry Street, New York, 1999. Laminated menu with a fold-out flap.
Two faces 816x1056 (US Letter, open sheet). The flap is the outer 320px, folded on a crease.
Front: cover (Vito's script sign, Mulberry Street photo, guest of honor band) + flap outside (the lesson still and Vito's lesson card).
Back: flap inside (dolci, bar, Johnny's paintings with the Lot 1 paddle) + the menu (family still, antipasti, pasta, secondi).
Palette: warm white stock, navy, Mickey blue. Writes photo crops, gloss, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
FOLD = 496                       # front crease; back crease at W - FOLD
PAPER, NAVY, BLUE, PALE, INK, MUTE = '#fbf8f1', '#14254f', '#2a6fc4', '#e6eef8', '#1b2233', '#4a5266'
FONTS = ('https://fonts.googleapis.com/css2?family=Playball&family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap')
DISP = "'Playball', cursive"; BODY = "'Lora', serif"

# ---------------- photos ----------------
def fit(im, w, h, box=None, cx=0.5, cy=0.5):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = int((sw - cw) * cx), int((sh - ch) * cy)
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=12):
    """Melt old shop sign lettering so no business name reads."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(6))
    return Image.composite(blur, im, m)

HERO_W, HERO_H = 424, 392
street = Image.open(S('loc-4a27270.jpg')).convert('L')
street = soften(street, [(950, 205, 1000, 240), (830, 235, 870, 262)], r=8)
street = ImageEnhance.Contrast(ImageEnhance.Brightness(street).enhance(1.06)).enhance(1.05)
fit(street, HERO_W, HERO_H, (240, 52, 998, 716), cx=0.0).convert('RGB').save(A('mulberry-street.jpg'), quality=90)

LES_W, LES_H = 252, 176
lesson = Image.open(S('5FNiyS5m6JXXmPEFG7YWAqcTrFz.jpg')).convert('RGB')
lesson = ImageEnhance.Brightness(lesson).enhance(1.08)
fit(lesson, LES_W, LES_H, (60, 0, 1501, 844), cx=0.5).save(A('the-lesson.jpg'), quality=90)

FAM_W, FAM_H = 428, 176
fam = Image.open(S('ubzEOsAItmoFuEUppGqaDzq4gR2.jpg')).convert('RGB')
fam = ImageEnhance.Brightness(fam).enhance(1.06)
fit(fam, FAM_W, FAM_H, (0, 60, 1920, 1080), cy=0.25).save(A('the-family.jpg'), quality=90)

def gloss(name, seed, crease):
    """Laminate: soft diagonal sheen, gentle edge wear under the plastic, and the crease shadow."""
    rnd = random.Random(seed)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(52 - i * 1.8)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 20, H // 20), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 10))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    wear = Image.new('RGBA', (W, H), (60, 70, 100, 0)); wear.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay = Image.alpha_composite(lay, wear)
    # crease: a soft valley shadow either side of the fold
    cr = Image.new('L', (W, H), 0); cd = ImageDraw.Draw(cr)
    for dx in range(-10, 11):
        cd.line([(crease + dx, 0), (crease + dx, H)], fill=int(34 * (1 - abs(dx) / 11) ** 1.6))
    sh = Image.new('RGBA', (W, H), (20, 30, 60, 0)); sh.putalpha(cr)
    lay = Image.alpha_composite(lay, sh)
    # sheen: one broad diagonal band of light on the plastic
    sm = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sm)
    sd.polygon([(W * 0.18, 0), (W * 0.44, 0), (W * 0.02, H), (-W * 0.24, H)], fill=30)
    sd.polygon([(W * 0.74, 0), (W * 0.80, 0), (W * 0.52, H), (W * 0.46, H)], fill=16)
    sm = sm.filter(ImageFilter.GaussianBlur(40))
    sheen = Image.new('RGBA', (W, H), (255, 255, 255, 0)); sheen.putalpha(sm)
    lay = Image.alpha_composite(lay, sheen)
    lay.save(A(f'gloss-{name}.png'))
gloss('front', 7, FOLD); gloss('back', 19, W - FOLD)

# ---------------- type pieces ----------------
def kicker(t, color=BLUE, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')

def title(t, sub=None, size=46, color=NAVY, rule=BLUE):
    """Section title: script word over a blue double rule (no dark bars on this menu)."""
    k = kicker(sub, size=16) if sub else ''
    return (f'<div style="margin-top: 20px">{k}'
            f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1.1; color: {color}">{t}</div>'
            f'<div style="height: 6px; border-top: 3px solid {rule}; border-bottom: 1px solid {rule}; margin-top: 2px"></div></div>')

def item(name, price, desc, gap=12, size=26, dsize=20):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; '
            f'font-weight: 700; font-size: {size}px; line-height: 1.15; color: {INK}">'
            f'<span>{name}</span><span style="color: {BLUE}; white-space: nowrap">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.3; color: {MUTE}; margin-top: 2px">{desc}</div></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.16">'
            f'<img src="assets/gloss-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            # laminate edge: the clear plastic seal runs a few px past the paper
            f'<div style="position: absolute; left: 7px; top: 7px; width: {W - 16}px; height: {H - 16}px; border: 1px solid rgba(20,37,79,0.18); border-radius: 6px"></div>'
            '</div>')

def framed(src, w, h, alt, x, y, cap=None, capw=None):
    s = (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border: 3px solid {BLUE}; outline: 1px solid {NAVY}; outline-offset: 3px">'
         f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')
    if cap:
        s += (f'<div style="position: absolute; left: {x}px; top: {y + h + 14}px; width: {capw or w + 6}px; font-family: {BODY}; font-style: italic; '
              f'font-size: 18px; line-height: 1.3; color: {MUTE}">{cap}</div>')
    return s

# ---------------- props ----------------
def lesson_card(x, y, w=262, h=470):
    """Vito's lesson card: a ruled index card, the word broken into beats, signed."""
    lines = 'repeating-linear-gradient(180deg, transparent 0 33px, rgba(42,111,196,0.30) 33px 34px)'
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: #fffdf8; '
            f'box-shadow: 0 4px 12px rgba(10,20,50,0.30); transform: rotate(-2deg)">'
            f'<div style="position: absolute; left: 0; top: 0; width: {w}px; height: 8px; background: {BLUE}"></div>'
            f'<div style="position: absolute; left: 0; top: 70px; width: {w}px; height: {h - 80}px; background: {lines}"></div>'
            f'<div style="position: absolute; left: 32px; top: 70px; width: 1px; height: {h - 80}px; background: rgba(196,40,40,0.40)"></div>'
            f'<div style="position: absolute; left: 18px; top: 22px; width: {w - 36}px">'
            f'{kicker("How to say it", size=17)}'
            f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.15; color: {NAVY}; margin-top: 6px; white-space: nowrap">Fuhgeddaboudit</div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 19px; letter-spacing: 0.02em; line-height: 1.2; color: {BLUE}; white-space: nowrap; margin-top: 10px">FUH&middot;GED&middot;DA&middot;BOUD&middot;IT</div>'
            f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.79; color: {INK}; margin-top: 12px; padding-left: 20px">'
            '<b>1.</b> Slower. Slower.<br>'
            '<b>2.</b> No T. No G.<br><b>3.</b> No England.<br>'
            '<b>4.</b> Never &ldquo;forget<br>about it.&rdquo;<br>'
            '<b>5.</b> Means yes, no,<br>thanks and sorry.</div>'
            f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1; color: {BLUE}; margin-top: 14px; text-align: right">Vito</div>'
            '</div></div>')

def paddle(x, y):
    """Auction bid card, Lot 1, type only: a numbered card like the ones handed out at the auction house uptown."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 120px; height: 148px; transform: rotate(6deg); '
            f'background: {PAPER}; border: 4px double {NAVY}; box-sizing: border-box; padding: 5px; box-shadow: 0 3px 8px rgba(10,20,50,0.3)">'
            f'<div style="height: 100%; box-sizing: border-box; border: 2px solid {BLUE}; text-align: center">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.22em; color: {NAVY}; margin-top: 16px; line-height: 1">LOT</div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 72px; color: {BLUE}; line-height: 1">1</div></div></div>')

# ---------------- FRONT: cover + flap outside ----------------
def front():
    o = []
    L, CW = 40, FOLD - 40 - 32
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px">{kicker("Ristorante &middot; Mulberry Street")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 66px; width: {CW + 20}px; font-family: {DISP}; font-size: 150px; '
             f'line-height: 1.12; color: {NAVY}; white-space: nowrap">Vito&rsquo;s</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 238px; width: {CW}px; display: flex; align-items: center; gap: 12px">'
             f'<div style="flex: 1; height: 6px; border-top: 3px solid {BLUE}; border-bottom: 1px solid {BLUE}"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 21px; color: {NAVY}; white-space: nowrap">Little Italy, New York</div>'
             f'<div style="flex: 1; height: 6px; border-top: 3px solid {BLUE}; border-bottom: 1px solid {BLUE}"></div></div>')
    o.append(framed('mulberry-street.jpg', HERO_W - 6, HERO_H - 6,
                    'Mulberry Street around 1900, a long row of pushcarts piled with fruit and greens under the fire escapes', L, 288,
                    'Our block on market day, around 1900. Same tomatoes, same family.'))
    # guest of honor band (big gag: the name)
    o.append(f'<div style="position: absolute; left: {L}px; top: 760px; width: {CW + 6}px; height: 194px; background: {NAVY}; box-sizing: border-box; padding: 20px 22px 0">'
             f'{kicker("Tonight&rsquo;s guest of honor", color="#9cc3f0", size=17)}'
             f'<div style="font-family: {DISP}; font-size: 56px; line-height: 1.15; color: {PAPER}; white-space: nowrap; margin-top: 2px">Mickey Blue Eyes</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: #dfe8f5; margin-top: 4px">'
             'All the way from Kansas City. Nobody asks about Kansas City.</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 970px; width: {CW + 6}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             'Marry the girl, you marry the family. &nbsp;212-555-1999</div>')
    # flap outside
    FL = FOLD + 28; FW = W - 40 - FL
    o.append(f'<div style="position: absolute; left: {FOLD}px; top: 0; width: {W - FOLD}px; height: {H}px; background: {PALE}"></div>')
    o.append(f'<div style="position: absolute; left: {FL}px; top: 46px; width: {FW}px">{kicker("Open for the menu", size=16)}'
             f'<div style="font-family: {DISP}; font-size: 46px; line-height: 1.1; color: {NAVY}; margin-top: 4px">Lesson one</div></div>')
    o.append(framed('the-lesson.jpg', LES_W - 6, LES_H - 6, 'Vito wags a finger at the Englishman in a dinner shirt, mid lesson', FL, 168,
                    'Table six, Tuesday. He was close. He was not there.', FW))
    o.append(lesson_card(FL - 6, 470, FW + 8, 440))
    o.append(f'<div style="position: absolute; left: {FL}px; top: 952px; width: {FW}px; font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}">'
             'Card stays at the table. Practice is free.</div>')
    return page(''.join(o), 'front')

# ---------------- BACK: flap inside + menu ----------------
def back():
    o = []
    CR = W - FOLD                      # crease x on the back
    FL, FW = 40, CR - 40 - 28
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {CR}px; height: {H}px; background: {PALE}"></div>')
    flap = (f'<div style="margin-top: -20px"></div>'
            + title('Dolci', 'If the wedding happens')
            + item('Tiramisu', '6.50', 'Espresso and marsala soaked biscuits, mascarpone cream, cocoa.', 10)
            + item('Cannoli', '5.00', 'Filled to order. Ricotta, orange peel, chocolate.', 12)
            + title('The bar', 'For a nervous Englishman')
            + item('Gin collins', '7.50', 'Elderflower, lemon, soda, a curl of cucumber, mint.', 10)
            + item('Carafe of red', '16.00', 'House Chianti. Pour for the table first.', 12)
            + item('Espresso', '2.50', 'Black, strong, standing up.', 12))
    o.append(f'<div style="position: absolute; left: {FL}px; top: 44px; width: {FW}px">{flap}</div>')
    # big gag: the paintings
    o.append(f'<div style="position: absolute; left: {FL}px; top: 742px; width: {FW}px; height: 270px; border: 3px solid {NAVY}; box-sizing: border-box; '
             f'background: {PAPER}; padding: 14px 16px 0">'
             f'{kicker("On our walls", size=16)}'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1.1; color: {NAVY}; margin-top: 2px">Lot 1, by Johnny</div>'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.35; color: {INK}; margin-top: 6px; width: 140px">'
             'Still life with clams. Oil on canvas, lots of oil. All for sale. Do not laugh.</div></div>')
    o.append(paddle(190, 846))
    # menu side
    L = CR + 28; CW = W - 40 - L
    o.append(framed('the-family.jpg', FAM_W - 6, FAM_H - 6, 'The family lined up at the foot of the staircase, the Englishman at the end of the row', L, 44))
    o.append(f'<div style="position: absolute; left: {L}px; top: 236px; width: {CW}px; display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; color: {MUTE}">The family. Say cheese, say it slower.</div></div>')
    menu = (title('Antipasti', None)
            + item('Kansas City fried ravioli', '7.50', 'Crumbed and fried, marinara, parmesan.', 10)
            + item('English tea sandwiches', '6.50', 'Cucumber, egg and cress, smoked salmon.', 12)
            + item('Fried calamari', '9.50', 'Lemon and hot cherry peppers.', 12)
            + title('Pasta', None)
            + item('Linguine, white clam sauce', '16.50', 'Clams in white wine, garlic, parsley.', 10)
            + item('Rigatoni, Sunday gravy', '14.50', 'Ribs and meatballs, braised all day.', 12)
            + title('Secondi', None)
            + item('Veal parmigiana', '19.99', 'Breaded, fried, mozzarella, red sauce.', 10)
            + item('Chicken scarpariello', '17.50', 'Sausage, vinegar peppers, rosemary.', 12))
    o.append(f'<div style="position: absolute; left: {L}px; top: 246px; width: {CW}px">{menu}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 984px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             'Prices subject to change. No wires. Form KC-1999.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Vito\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
