"""Halfway Diner, a roadside lunch on the state road between Rock Island and Chicago, Illinois, 1931.
Tall diner bill of fare, one face 816x1344. Cool rain grey stock, slate ink, oxblood.
Signature: real 1940 FSA counter photo (Library of Congress, public domain) across the top third.
TMDB still of the Sullivans at a diner table. Props: coach ticket to Perdition, a nickel on the counter.
Writes photo crops, wear, front.body.html and front.html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1344
PAPER, INK, RED, MUTE, CARD = '#e3e3da', '#1d2526', '#8c2a1f', '#4c5552', '#f3efe2'
FONTS = ('https://fonts.googleapis.com/css2?family=Ultra&family=Crimson+Pro:ital,wght@0,400;0,700;1,400'
         '&family=Homemade+Apple&display=swap')
DISP = "'Ultra', serif"; BODY = "'Crimson Pro', serif"; SCRIPT = "'Homemade Apple', cursive"
M = 44                      # side margin
HX, HW, HY, HH = M, W - 2 * M, 204, 318   # hero photo box (inside its frame)

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=10):
    """Melt small product labels into soft blur so no brand name reads (feathered mask)."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(6))
    return Image.composite(blur, im, m)

loc = Image.open(S('loc-8b19476.jpg')).convert('L')
loc = soften(loc, [(1545, 820, 1830, 905), (1975, 1000, 2280, 1130), (2550, 1190, 2690, 1410),
                   (2340, 1210, 2510, 1530), (2020, 1220, 2150, 1430)], r=5)
loc = ImageOps.autocontrast(loc, cutoff=0.4)
loc = ImageEnhance.Brightness(loc).enhance(1.06)
# print it as a two-ink duotone: slate ink in the shadows, warm card in the highlights
loc = ImageOps.colorize(loc, black=INK, white='#f6f3ea', mid='#8a8f88')
fit(loc, HW, HH, (120, 420, 2700, 1695)).save(A('counter-1940.jpg'), quality=90)

st = Image.open(S('8B1tuESNpoySSyh5LlUK4QSsgzo.jpg')).convert('RGB')
st = ImageEnhance.Brightness(st).enhance(1.16)
SW, SH = 296, 178
fit(st, SW, SH, (0, 0, 3000, 1688)).save(A('booth-still.jpg'), quality=90)

nk = Image.open(S('nickel-obverse.png')).convert('RGBA')
g = ImageOps.grayscale(nk.convert('RGB')).filter(ImageFilter.GaussianBlur(1.2))
g = ImageEnhance.Contrast(g).enhance(0.82)
col = ImageOps.colorize(g, black='#3d3a33', white='#d9d4c6', mid='#8f897a').convert('RGBA')
col.putalpha(nk.getchannel('A'))
col.resize((156, 156), Image.LANCZOS).save(A('nickel.png'))

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(44):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(84 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 20, H // 20), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), (70, 64, 40, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 31)

# ---------------- type pieces ----------------
def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def head(t, top=0):
    """Section title: heavy slab caps, an oxblood underscore the width of the word, a hairline running on."""
    return (f'<div style="margin-top: {top}px; position: relative; height: 52px">'
            f'<div style="position: absolute; left: 0; top: 0; font-family: {DISP}; font-size: 40px; line-height: 46px; color: {INK}; white-space: nowrap">{t}</div>'
            f'<div style="position: absolute; left: 0; right: 0; bottom: 2px; height: 1px; background: {INK}; opacity: 0.5"></div>'
            f'<div style="position: absolute; left: 0; bottom: 0; width: 64px; height: 5px; background: {RED}"></div></div>')

def item(name, price, desc, top=14):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 28px; line-height: 1.1; color: {INK}">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.28; color: {INK}; margin-top: 3px">{desc}</div></div>')

def page(inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.3">'
            # printer's double rule border, as on a letterpress bill of fare
            f'<div style="position: absolute; left: 18px; top: 18px; width: {W - 36}px; height: {H - 36}px; border: 3px solid {INK}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 25px; top: 25px; width: {W - 50}px; height: {H - 50}px; border: 1px solid {INK}; box-sizing: border-box"></div>'
            + inner +
            f'<img src="assets/wear-front.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def ticket(o, x, y):
    """Coach ticket stub, Rock Island to Perdition, one adult and one child."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 262px; height: 132px; background: #e9d7a4; '
             f'box-shadow: 0 3px 8px rgba(10,10,0,0.42); transform: rotate(6deg); box-sizing: border-box; padding: 10px 12px 0 40px">'
             # perforated stub edge
             f'<div style="position: absolute; left: 0; top: 0; width: 28px; height: 132px; background: #dcc78e"></div>'
             f'<div style="position: absolute; left: 28px; top: 4px; width: 0; height: 124px; border-left: 3px dotted #b59c5c"></div>'
             f'<div style="position: absolute; left: 4px; top: 30px; width: 20px; font-family: {DISP}; font-size: 14px; line-height: 1.25; color: {RED}; text-align: center">N<br>o<br>3<br>1</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; color: {RED}; line-height: 1">MOTOR COACH LINES</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {INK}; line-height: 1.3; margin-top: 6px">Good for one passage<br>from ROCK ISLAND to</div>'
             f'<div style="font-family: {DISP}; font-size: 25px; color: {INK}; line-height: 1.05; margin-top: 2px">PERDITION</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: {INK}; line-height: 1.3; margin-top: 3px">1 adult, 1 child, half fare</div></div>')

def nickel(o, x, y):
    o.append(f'<img src="assets/nickel.png" alt="A worn buffalo nickel" style="position: absolute; left: {x}px; top: {y}px; width: 78px; height: 78px; '
             f'border-radius: 50%; box-shadow: 1px 3px 5px rgba(10,10,0,0.45); transform: rotate(-14deg)">')

# ---------------- FRONT ----------------
def front():
    o = []
    # masthead: the sign over the road
    o.append(f'<div style="position: absolute; left: {M}px; top: 50px; width: {W - 2 * M}px; text-align: center">'
             + kicker('On the state road, Illinois') + '</div>')
    o.append(f'<div style="position: absolute; left: {M - 10}px; top: 70px; width: {W - 2 * M + 20}px; text-align: center; font-family: {DISP}; '
             f'font-size: 72px; line-height: 1; color: {INK}; white-space: nowrap">HALFWAY DINER</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 154px; width: {W - 2 * M}px; height: 2px; background: {RED}"></div>'
             f'<div style="position: absolute; left: {M}px; top: 158px; width: {W - 2 * M}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.14em; line-height: 34px; color: {INK}">'
             f'<span>ROCK ISLAND 85 MI.</span><span style="color: {RED}">BILL OF FARE</span><span>CHICAGO 85 MI.</span></div>'
             f'<div style="position: absolute; left: {M}px; top: 194px; width: {W - 2 * M}px; height: 1px; background: {INK}; opacity: 0.6"></div>')
    # signature photo
    o.append(f'<div style="position: absolute; left: {HX - 4}px; top: {HY - 4}px; border: 1px solid {INK}; padding: 3px; background: {CARD}">'
             f'<img src="assets/counter-1940.jpg" alt="A driver in a peaked cap at a long diner counter, the waitress smiling across it, a wall clock and coffee urn behind" '
             f'style="display: block; width: {HW - 2}px; height: {HH}px"></div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: {HY + HH + 12}px; width: 380px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}">'
             'Our counter. Open day and night, rain or shine.</div>')
    nickel(o, HX + HW - 336, HY + HH - 46)
    ticket(o, HX + HW - 258, HY + HH - 84)

    CY = HY + HH + 56          # menu columns start
    LW, RX, RW = 410, M + 410 + 40, W - 2 * M - 410 - 40
    left = (head('DINNERS')
            + item('Corned beef and cabbage', '.31', 'Simmered all day and sliced thick. Buttered cabbage, carrots, boiled potatoes, hot mustard.')
            + item('Driver&rsquo;s breakfast', '.20', 'Two eggs any style, fried potatoes, toast.')
            + head('SANDWICHES', 22)
            + item('Toasted cheese', '.15', 'Sharp cheddar on white, fried crisp in butter, cut in fingers. Bread and butter pickles.')
            + item('Hamburger sandwich', '.10', 'Fresh ground beef off the griddle, onions.')
            + item('Irish soda bread', '.10', 'Warm buttermilk loaf, salted butter, cheddar.'))
    o.append(f'<div style="position: absolute; left: {M}px; top: {CY}px; width: {LW}px">{left}</div>')

    right = (f'<div style="border: 1px solid {INK}; padding: 3px; background: {CARD}; width: {RW - 8}px">'
             f'<img src="assets/booth-still.jpg" alt="A man in a tweed suit and his young son eating supper and pie at a diner table, coffee cups and a milk glass beside them" '
             f'style="display: block; width: {RW - 8}px; height: {int((RW - 8) * 0.6)}px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}; margin-top: 8px">A man and his boy, on the road.</div>'
             + head('PIE', 12)
             + item('Apple pie', '.10', 'Deep dish, cinnamon apples, sharp cheddar melted on top.')
             + head('THE URN', 18)
             + item('Coffee or milk', '.05', 'Hot from the urn, or cold.')
             + item('Wake coffee', '.35', 'Brown sugar, soft cream, Irish style. Strictly medicinal.'))
    o.append(f'<div style="position: absolute; left: {RX}px; top: {CY + 34}px; width: {RW}px">{right}</div>')

    # pencilled note left on the bill
    o.append(f'<div style="position: absolute; left: {M}px; top: 1164px; width: {LW}px; transform: rotate(-2deg); font-family: {SCRIPT}; font-size: 21px; line-height: 1.5; color: #3b4150">'
             'Michael, eat your pie.<br>We go at first light.'
             f'<span style="margin-left: 18px; color: {RED}">M.S.</span></div>')

    # fine print
    o.append(f'<div style="position: absolute; left: {M}px; top: 1250px; width: {W - 2 * M}px; height: 1px; background: {INK}; opacity: 0.6"></div>'
             f'<div style="position: absolute; left: {M}px; top: 1258px; width: {W - 2 * M}px; text-align: center; font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {INK}">'
             'Cash only, we keep no money in the bank. No photographers in the dining room.<br>'
             f'<span style="color: {MUTE}">Prices subject to change. Form 2002. Printed in Illinois, 1931.</span></div>')
    return page(''.join(o))

FACES = {'front': front()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Halfway Diner bill of fare</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
