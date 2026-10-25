"""Sakura Gardens, a Japanese restaurant in New York, spring 1978: the place where the crew would not take their shoes off.
Bifold dinner menu, two faces 816x1056 (US Letter each panel).
Outside (front): black lacquer cover, the social club back room (TMDB still) bleeding off the top, Hiroshige blossom border,
the tatami room shoe rule stamped BOOTS STAY ON, the unclaimed shoe-check ticket, and the bar list.
Inside: blossom-pink washi stock, appetizers, the lion print by the coat check, the "friend of ours" introduction card
with Lefty's correction, the tatami room dinners and desserts.
Writes image crops, wear, front/inside .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps, ImageChops
import numpy as np

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056

LACQ, CREAM, CINN, PINK, WASHI, INK, MUTE = '#18110f', '#f1e6d0', '#b3342a', '#e9b4ae', '#f3e2d9', '#22140f', '#7a5a52'
FONTS = ('https://fonts.googleapis.com/css2?family=Shojumaru&family=Spectral:ital,wght@0,400;0,600;0,700;1,400'
         '&family=Reenie+Beanie&display=swap')
DISP = "'Shojumaru', serif"; BODY = "'Spectral', serif"; HAND = "'Reenie Beanie', cursive"


# ---------------- images ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)


LION_W, LION_H = 254, 200
lion = Image.open(S('wellcome-lion-V0021514.jpg')).convert('L').crop((150, 175, 560, 611))
lion = ImageOps.autocontrast(lion, cutoff=1).point(lambda v: int(255 * (v / 255) ** 0.62))
lion = ImageOps.colorize(lion, black='#1a0f0b', white='#f3e6cf', mid='#7b6250')
fit(lion, LION_W, LION_H).save(A('lion-by-the-coat-check.jpg'), quality=90)

# Hiroshige branch, keyed off its blue ground
hb = Image.open(S('hiroshige-cherry-blossoms.jpg')).convert('RGB').crop((200, 165, 1112, 792))
a = np.asarray(hb).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
bg = np.clip(((b - r) - 12) / 12, 0, 1) * np.clip((b - g + 8) / 8, 0, 1)
al = Image.fromarray(((1 - bg) * 255).astype('uint8'))
dd = ImageDraw.Draw(al); dd.rectangle([0, 0, 240, 127], fill=0); dd.rectangle([740, 0, 912, 215], fill=0)
al = al.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
a2 = a.copy(); a2[..., 2] = np.minimum(b, (r + g) // 2 + 12)
br = Image.fromarray(a2.astype('uint8')).convert('RGBA'); br.putalpha(al)
br.save(A('blossom-branch.png'))
ImageOps.mirror(br).save(A('blossom-branch-l.png'))
# bud sprig (lower right of the print) for the bottom corners
ImageOps.flip(ImageOps.mirror(br.crop((560, 300, 912, 627)))).save(A('blossom-sprig.png'))

def wear(name, seed, col, strength):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(36):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 1.9)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 24, H // 24), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 18))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    lay = Image.new('RGBA', (W, H), col + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * strength)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 78, (70, 50, 40), 0.55)
wear('inside', 19, (120, 70, 55), 0.5)


# ---------------- pieces ----------------
def img(src, x, y, w, h, extra=''):
    return f'<img src="assets/{src}" alt="" style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; display: block;{extra}">'

def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def item(name, price, desc, ink, accent, gap=14, size=27, dsize=20):
    d = (f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.24; color: {ink}; margin-top: 3px; opacity: 0.92">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.12; color: {ink}">'
            f'<span>{name}</span><span style="color: {accent}; white-space: nowrap">{price}</span></div>{d}</div>')

def band(title, sub, color, txt, w):
    """Section title on a cinnabar band with a black seal square at its head."""
    return (f'<div style="display: flex; align-items: stretch; width: {w}px; height: 50px">'
            f'<div style="width: 14px; background: {INK}"></div>'
            f'<div style="flex: 1; background: {color}; display: flex; align-items: center; justify-content: space-between; padding: 0 14px 0 14px">'
            f'<span style="font-family: {DISP}; font-size: 40px; line-height: 1; color: {txt}; margin-top: 2px; white-space: nowrap">{title}</span>'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.2em; color: {txt}; text-transform: uppercase; white-space: nowrap">{sub}</span>'
            f'</div></div>')

def frame(color):
    return (f'<div style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: {H - 40}px; box-sizing: border-box; border: 2px solid {color}"></div>'
            f'<div style="position: absolute; left: 27px; top: 27px; width: {W - 54}px; height: {H - 54}px; box-sizing: border-box; border: 1px solid {color}; opacity: 0.6"></div>')

def page(inner, name, bg, grain=0.2):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {grain}">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


# ---------------- props ----------------
def shoe_ticket(x, y):
    """Shoe-check ticket, never torn: the boots stayed on."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 296px; height: 150px; background: #e8d3a6; '
            f'box-shadow: 0 4px 12px rgba(0,0,0,0.55); transform: rotate(-5deg); box-sizing: border-box; padding: 10px 14px 0 16px">'
            f'<div style="position: absolute; right: 14px; top: 12px; width: 14px; height: 14px; border-radius: 50%; background: {LACQ}"></div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.22em; color: {INK}; line-height: 1">SHOE CHECK</div>'
            f'<div style="font-family: {DISP}; font-size: 44px; line-height: 1.05; color: {INK}; margin-top: 4px">No. 5</div>'
            f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.2; color: {INK}">Present this ticket for your shoes.</div>'
            f'<div style="position: absolute; left: 46px; top: 106px; transform: rotate(-6deg); border: 3px solid {CINN}; padding: 3px 9px 1px; '
            f'font-family: {BODY}; font-weight: 700; font-size: 22px; letter-spacing: 0.08em; color: {CINN}; line-height: 1.1; white-space: nowrap; '
            f'background: rgba(232,211,166,0.35)">NEVER CLAIMED</div>'
            f'</div>')

def friend_card(x, y):
    """House introduction card. The printed line says ours; Lefty corrects it to mine."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 262px; height: 158px; background: #fbf6ec; '
            f'box-shadow: 0 4px 12px rgba(40,10,5,0.4); transform: rotate(3deg); box-sizing: border-box; padding: 12px 16px 0; border-top: 6px solid {CINN}">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.2em; color: {CINN}; line-height: 1">SAKURA GARDENS</div>'
            f'<div style="font-family: {BODY}; font-size: 14px; letter-spacing: 0.08em; color: {MUTE}; line-height: 1.2; margin-top: 3px">INTRODUCTION CARD</div>'
            f'<div style="position: relative; font-family: {BODY}; font-style: italic; font-size: 21px; color: {INK}; line-height: 1; margin-top: 28px">'
            f'This is a friend of <span style="position: relative">ours<span style="position: absolute; left: -3px; right: -3px; top: 11px; height: 3px; background: #23357a; transform: rotate(-6deg)"></span></span>'
            f'<span style="position: absolute; left: 176px; top: -28px; font-family: {HAND}; font-style: normal; font-size: 32px; color: #23357a; transform: rotate(-6deg)">mine</span></div>'
            f'<div style="font-family: {HAND}; font-size: 28px; color: #23357a; line-height: 1; margin-top: 8px; transform: rotate(-3deg)">Treat him right. Lefty</div>'
            f'</div>')


# ---------------- FRONT (outside cover) ----------------
CLUB_W, CLUB_H = 816, 520
club = Image.open(S('tmdb-bIH9GtOCgX9lPAZd2HmV3QOSZY3.jpg')).convert('RGB')
club = ImageEnhance.Brightness(club).enhance(1.3)
club = ImageEnhance.Contrast(club).enhance(1.06)
fit(club, CLUB_W, CLUB_H, (40, 0, 1255, 720)).save(A('social-club-back-room.jpg'), quality=90)

o = []
o.append(img('social-club-back-room.jpg', 0, 0, CLUB_W, CLUB_H))
o.append(f'<div style="position: absolute; left: 0; top: 300px; width: {W}px; height: 222px; background: linear-gradient(to bottom, rgba(24,17,15,0) 0%, rgba(24,17,15,0.82) 52%, {LACQ} 100%)"></div>')
o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 120px; background: linear-gradient(to bottom, rgba(24,17,15,0.7) 0%, rgba(24,17,15,0) 100%)"></div>')
o.append(frame(PINK))
o.append(img('blossom-branch.png', 566, -30, 276, 190))
o.append(img('blossom-sprig.png', -34, 968, 120, 111))
o.append(f'<div style="position: absolute; left: 52px; top: 52px">' + kicker('Japanese restaurant', CREAM, 18) + '</div>')
o.append(f'<div style="position: absolute; left: 40px; top: 404px; width: 736px">'
         f'<div style="font-family: {DISP}; font-size: 64px; line-height: 1.0; color: {CREAM}; white-space: nowrap">SAKURA GARDENS</div>'
         f'<div style="display: flex; align-items: center; gap: 14px; margin-top: 12px">'
         f'<div style="width: 70px; height: 4px; background: {CINN}"></div>'
         f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.25; color: {PINK}">'
         'The social club down the block. Their party of five eats with us Saturdays.</div></div></div>')
# the boots gag, drawn large
o.append(f'<div style="position: absolute; left: 40px; top: 548px; width: 736px; height: 214px; box-sizing: border-box; border: 2px solid {CREAM}; padding: 16px 20px 0">'
         + kicker('House rule, tatami room', PINK, 17) +
         f'<div style="font-family: {DISP}; font-size: 46px; line-height: 1.05; color: {CREAM}; margin-top: 8px">PLEASE REMOVE<br>YOUR SHOES</div>'
         f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.25; color: {CREAM}; margin-top: 8px; width: 400px">Slippers at the step. No exceptions.</div>'
         f'<div style="position: absolute; left: 514px; top: 26px; transform: rotate(-9deg); border: 5px solid {CINN}; padding: 6px 14px 2px; '
         f'font-family: {DISP}; font-size: 33px; line-height: 1.05; color: {CINN}; text-align: center; background: rgba(24,17,15,0.6)">BOOTS<br>STAY ON</div>'
         '</div>')
o.append(shoe_ticket(474, 708))
# bar
o.append(f'<div style="position: absolute; left: 40px; top: 800px; width: 400px">'
         + band('THE BAR', 'nightly', CINN, CREAM, 400)
         + item('Social Club Rob Roy', '2.75', 'Scotch, sweet vermouth and bitters over one big cube, orange peel, a cherry.', CREAM, PINK, gap=10, dsize=19)
         + item('Hot Sake', '1.50', 'Warm, in a stone carafe.', CREAM, PINK, gap=12, dsize=19) +
         '</div>')
o.append(f'<div style="position: absolute; left: 470px; top: 884px; width: 306px">'
         + item('Plum Wine', '1.50', 'Sweet and cold, over ice.', CREAM, PINK, gap=0, dsize=19) +
         f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {PINK}; margin-top: 18px">'
         'Prices subject to change. Spring 1978.<br>Not responsible for items in footwear.</div></div>')
front = page(''.join(o), 'front', LACQ, 0.1)


# ---------------- INSIDE ----------------
o = []
o.append(frame(CINN))
o.append(img('blossom-branch.png', 470, -24, 366, 252))
o.append(img('blossom-sprig.png', -30, 976, 150, 139))
o.append(f'<div style="position: absolute; left: 52px; top: 52px; width: 440px">'
         + kicker('Served from five o\'clock', CINN, 18) +
         f'<div style="font-family: {DISP}; font-size: 66px; line-height: 1.05; color: {INK}; margin-top: 8px">DINNER</div>'
         f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: {INK}; margin-top: 2px">Private rooms for parties. Ask for the corner room.</div>'
         '</div>')
apps = [('Miami Garlic Shrimp', '4.75', 'Seared with garlic, chili flakes, white wine and butter. Bread for the juices.'),
        ('Mozzarella Katsu', '2.95', 'Cheese fingers crumbed twice and fried golden, warm tomato sauce to dip.'),
        ('Shrimp Tempura', '3.95', 'Shrimp and garden vegetables in a light batter, radish dipping sauce.'),
        ('Sashimi', '5.50', 'Raw tuna and yellowtail, sliced to order. Raw? Forget about it.')]
o.append(f'<div style="position: absolute; left: 40px; top: 212px; width: 440px">'
         + band('ZENSAI', 'to begin', CINN, CREAM, 440)
         + ''.join(item(n, p, d, INK, CINN, gap=(10 if i == 0 else 16)) for i, (n, p, d) in enumerate(apps)) +
         '</div>')
# the lion
o.append(f'<div style="position: absolute; left: 510px; top: 228px; width: {LION_W + 12}px; height: {LION_H + 12}px; box-sizing: border-box; border: 2px solid {CINN}; padding: 4px; background: #fbf6ec">'
         f'<img src="assets/lion-by-the-coat-check.jpg" alt="" style="width: {LION_W}px; height: {LION_H}px; display: block"></div>')
o.append(f'<div style="position: absolute; left: 510px; top: {228 + LION_H + 20}px; width: 266px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.28; color: {INK}">'
         'The old lion print by the coat check. One regular from the club stops to look at him every time.</div>')
o.append(friend_card(510, 534))
# tatami room and desserts
mains = [('Teriyaki Sirloin', '8.50', 'Seared hot, glazed with soy, mirin and sake. Steamed rice, bok choy.'),
         ('Sukiyaki for Two', '19.78', 'Beef, tofu, noodles and greens, simmered at your table.')]
sweets = [('Ricotta Cheesecake', '1.95', 'Baked slow with lemon zest and vanilla, cooled in the oven.'),
          ('Green Tea Ice Cream', '1.25', 'Made here, served with a sesame wafer.')]
o.append(f'<div style="position: absolute; left: 40px; top: 714px; width: 360px">'
         + band('TATAMI', 'shoes off', INK, CREAM, 360)
         + ''.join(item(n, p, d, INK, CINN, gap=(10 if i == 0 else 14)) for i, (n, p, d) in enumerate(mains)) +
         '</div>')
o.append(f'<div style="position: absolute; left: 416px; top: 714px; width: 360px">'
         + band('SWEETS', 'to finish', CINN, CREAM, 360)
         + ''.join(item(n, p, d, INK, CINN, gap=(10 if i == 0 else 14)) for i, (n, p, d) in enumerate(sweets)) +
         '</div>')
o.append(f'<div style="position: absolute; left: 160px; top: 996px; width: 616px; text-align: right; font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {MUTE}">'
         'Jade and pearls in the gift case are real. No fugazy. Gratuity not included.</div>')
inside = page(''.join(o), 'inside', WASHI, 0.22)

for n, b in (('front', front), ('inside', inside)):
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Sakura Gardens menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
