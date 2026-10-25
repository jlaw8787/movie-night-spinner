"""Rotunda Cafe, Manhattan Museum of Art, New York, December 1989. Where Dana eats between shifts in the restoration studio.
Table tent card, two faces 528x816 (folds into a tent on the cafe tables). Gallery stone white stock, Vigo aubergine ink, mood slime pink.
Front: museum photo collection print of Liberty (LOC, 1892), sign, small plates, admission button.
Back: TMDB still of the Vigo canvas being cleaned, Janosz's note, supper, sweets and drinks, slime-free kitchen sticker, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 528, 816
PAPER, INK, PINK, MUTE, CARD = '#f3eee5', '#2b1733', '#de3f8a', '#5e4a63', '#fffaf2'
FONTS = ('https://fonts.googleapis.com/css2?family=Rye&family=Work+Sans:ital,wght@0,400;0,600;0,800;1,400'
         '&family=Caveat:wght@600&display=swap')
DISP = "'Rye', serif"; BODY = "'Work Sans', sans-serif"; SCRIPT = "'Caveat', cursive"
M = 40            # text margin inside trim
CW = W - 2 * M    # 448 column

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

lib = Image.open(S('lib-4a32910.jpg')).convert('L')
lib = ImageOps.autocontrast(lib, cutoff=1)
lib = lib.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=2))
lib = ImageOps.colorize(lib, black='#1c1420', white='#f7f1e6', mid='#857a78')   # warm silver print, no muddy tint
lib = ImageEnhance.Brightness(lib).enhance(1.05)
LIB_W, LIB_H = 480, 280
fit(lib, LIB_W, LIB_H, (40, 40, 820, 700)).save(A('liberty-1892.jpg'), quality=90)

vigo = Image.open(S('o-bXcD5ZrA5noh509iLurKoytFwOB.jpg')).convert('RGB')
vigo = ImageEnhance.Brightness(ImageEnhance.Contrast(vigo).enhance(1.05)).enhance(1.12)
VIG_W, VIG_H = CW - 8, 184
fit(vigo, VIG_W, VIG_H, (0, 40, 1421, 800)).save(A('still-vigo.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2.3)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))
    lay = Image.new('RGBA', (W, H), (95, 70, 60, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 1505); wear('back', 1610)

# ---------------- type pieces ----------------
def kicker(t, color=PINK, size=18):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1; white-space: nowrap">{t}</div>')

def band(t):
    """Section title: aubergine plate, Rye lettering in stone white, pink diamond studs at each end like gallery label pins."""
    stud = lambda side: (f'<div style="position: absolute; {side}: 12px; top: 13px; width: 13px; height: 13px; background: {PINK}; '
                         f'transform: rotate(45deg)"></div>')
    return (f'<div style="position: relative; height: 40px; background: {INK}; text-align: center">'
            + stud('left') + stud('right') +
            f'<div style="font-family: {DISP}; font-size: 30px; line-height: 42px; color: {PAPER}; letter-spacing: 0.04em; white-space: nowrap">{t}</div></div>')

def item(name, price, desc='', gap=11):
    d = (f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.24; color: {INK}; margin-top: 2px">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 26px; line-height: 1.12; color: {INK}">'
            f'<span>{name}</span><span style="color: {PINK}">{price}</span></div>{d}</div>')

def frame_border():
    """Picture frame round the card edge: aubergine moulding with a pink slip inside, like a gallery frame."""
    return (f'<div style="position: absolute; left: 12px; top: 12px; width: {W - 24}px; height: {H - 24}px; box-sizing: border-box; border: 6px solid {INK}"></div>'
            f'<div style="position: absolute; left: 22px; top: 22px; width: {W - 44}px; height: {H - 44}px; box-sizing: border-box; border: 1.5px solid {PINK}"></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.3">'
            + frame_border() + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

def at(x, y, html, w=CW, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{html}</div>'

def plate(t, w):
    """Museum label plate laid along the foot of a picture."""
    return (f'<div style="position: absolute; left: 0; bottom: 0; width: {w}px; box-sizing: border-box; background: rgba(43,23,51,0.86); '
            f'padding: 6px 12px 7px; font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {PAPER}">{t}</div>')

# ---------------- props ----------------
def admission_button(x, y, d=92):
    """Tin admission button with its bent clip tab, the day's colour is pink."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d + 16}px; transform: rotate(12deg)">'
            f'<div style="position: absolute; left: {d // 2 - 9}px; top: 0; width: 18px; height: 26px; border-radius: 4px; background: #b9b2a8; box-shadow: 0 1px 2px rgba(0,0,0,0.35)"></div>'
            f'<div style="position: absolute; left: 0; top: 14px; width: {d}px; height: {d}px; border-radius: 50%; background: {PINK}; '
            f'box-shadow: 0 3px 7px rgba(30,10,30,0.45); text-align: center">'
            f'<div style="position: absolute; left: 6px; top: 6px; width: {d - 12}px; height: {d - 12}px; border-radius: 50%; border: 1.5px solid {PAPER}; box-sizing: border-box"></div>'
            f'<div style="padding-top: 22px; font-family: {DISP}; font-size: 30px; line-height: 1; color: {PAPER}">MMA</div>'
            f'<div style="margin-top: 4px; font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.12em; line-height: 1; color: {INK}">ADMIT ONE</div>'
            '</div></div>')

def slime_sticker(x, y, d=118):
    """Round kitchen sticker: a pink drip with the red circle and bar through it."""
    ring = d - 52
    drip = (f'<div style="position: absolute; left: {(d - 34) // 2}px; top: 30px; width: 34px; height: 30px; border-radius: 50% 50% 46% 46%; background: {PINK}"></div>'
            f'<div style="position: absolute; left: {(d - 34) // 2 + 6}px; top: 52px; width: 9px; height: 16px; border-radius: 0 0 6px 6px; background: {PINK}"></div>'
            f'<div style="position: absolute; left: {(d - 34) // 2 + 20}px; top: 54px; width: 8px; height: 10px; border-radius: 0 0 5px 5px; background: {PINK}"></div>')
    no = (f'<div style="position: absolute; left: {(d - ring) // 2}px; top: 18px; width: {ring}px; height: {ring}px; border-radius: 50%; border: 6px solid #d1202f; box-sizing: border-box"></div>'
          f'<div style="position: absolute; left: {(d - ring) // 2 + 2}px; top: {18 + ring // 2 - 3}px; width: {ring - 4}px; height: 6px; background: #d1202f; transform: rotate(-45deg)"></div>')
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; border-radius: 50%; background: #ffffff; '
            f'box-shadow: 0 2px 6px rgba(30,10,30,0.35); transform: rotate(-10deg); border: 3px solid {INK}; box-sizing: border-box">'
            + drip + no +
            f'<div style="position: absolute; left: 0; top: {d - 34}px; width: {d - 6}px; text-align: center; font-family: {BODY}; font-weight: 800; font-size: 14px; '
            f'letter-spacing: 0.06em; line-height: 1; color: {INK}">SLIME-FREE</div>'
            f'<div style="position: absolute; left: 0; top: {d - 20}px; width: {d - 6}px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; '
            f'letter-spacing: 0.14em; line-height: 1; color: {INK}">KITCHEN</div></div>')

def janosz_note(x, y, w=232):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; box-sizing: border-box; background: {CARD}; '
            f'box-shadow: 0 3px 8px rgba(30,10,30,0.4); transform: rotate(-1.5deg); padding: 9px 12px 4px; border-top: 5px solid {PINK}">'
            f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {INK}">'
            'Come upstairs after lunch and watch the old masters come back to life.</div>'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1px">'
            f'<span style="font-family: {SCRIPT}; font-size: 30px; line-height: 1.05; color: {PINK}">Janosz Poha</span>'
            f'<span style="font-family: {BODY}; font-size: 14px; letter-spacing: 0.08em; color: {MUTE}">RESTORATION</span></div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    # hero: collection print of Liberty, full width inside the frame, with its museum label
    o.append(f'<div style="position: absolute; left: 24px; top: 24px; width: {LIB_W}px; height: {LIB_H}px">'
             f'<img src="assets/liberty-1892.jpg" alt="The Statue of Liberty on its pedestal, seen from the landing path on the island, an old silver print" '
             f'style="display: block; width: {LIB_W}px; height: {LIB_H}px">'
             + plate('<i>Liberty, New York Harbor,</i> 1892. Photography collection, second floor.', LIB_W) +
             f'<div style="position: absolute; left: 0; bottom: -4px; width: {LIB_W}px; height: 4px; background: {PINK}"></div></div>')
    o.append(at(M, 322, kicker('Manhattan Museum of Art')))
    o.append(at(M - 2, 346, f'<div style="font-family: {DISP}; font-size: 56px; line-height: 1; color: {INK}; white-space: nowrap">ROTUNDA CAFE</div>', CW + 4))
    o.append(at(M, 410, f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; letter-spacing: 0.04em; line-height: 1.2; color: {MUTE}">'
                'Lunch, tea and early supper. Tuesday to Sunday.</div>'))
    menu = (band('SMALL PLATES')
            + item('Pink beet and feta dip', '3.75', 'Roast beets whipped with yogurt, garlic, lemon and dill. Warm flatbread wedges.', 10)
            + item('Toasted crumpets', '2.25', 'Whipped honey butter and a pinch of salt.')
            + item('Mini bagel pizzas', '3.50', 'Hot salami, mozzarella and chili honey.')
            + item('Fifth Avenue frank', '2.55', 'Mustard, green relish, onion, sauerkraut.'))
    o.append(at(M, 444, menu))
    o.append(admission_button(W - 132, 168))
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(at(M, 40, f'<div style="position: relative; border: 2px solid {PINK}; padding: 2px; background: {CARD}; width: {VIG_W}px">'
                f'<div style="position: relative; width: {VIG_W}px; height: {VIG_H}px">'
                f'<img src="assets/still-vigo.jpg" alt="A fine brush cleaning the eye of a painted portrait of a stern long-haired prince" '
                f'style="display: block; width: {VIG_W}px; height: {VIG_H}px">'
                + plate('<b style="letter-spacing: 0.12em">UPSTAIRS IN RESTORATION.</b> Prince Vigo of Carpathia, 16th century, being cleaned.', VIG_W) +
                '</div></div>'))
    o.append(janosz_note(M, 244, 300))
    o.append(slime_sticker(W - 40 - 116, 240, 116))
    menu = (band('SUPPER')
            + item('Carpathian goulash', '6.10', 'Beef chuck braised slowly with sweet paprika, onions, caraway and tomato. Egg noodles, sour cream.', 10)
            + f'<div style="margin-top: 14px">{band("SWEETS AND DRINKS")}</div>'
            + item('Pink lemonade gelatin', '1.89', 'Set in a ring with raspberries. Wobbles when the band plays.', 10)
            + item('Pink lemonade cooler', '1.50', 'Poured over raspberry sorbet so it foams up.')
            + item('Hot cocoa, coffee or tea', '.95'))
    o.append(at(M, 376, menu))
    o.append(at(M, 740, f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {MUTE}">'
                'Strollers please park at the coat check. Prices subject to change.<br>Form MMA-1231. Manhattan Museum of Art, New York, 1989.</div>'))
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Rotunda Cafe table card, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
