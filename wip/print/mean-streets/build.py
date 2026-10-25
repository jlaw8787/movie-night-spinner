"""Tony's, the red-lit bar in Little Italy, feast week 1973. A bar tab card, two faces 528x816 (5.5 x 8.5 in).
Pink tab stock, oxblood ink, one hot red.
Front: the sign band with the red light on, the street photo (signature), feast raffle ticket, the feast food, Charlie's note.
Back: tab card header made out to Johnny Boy, the bar food and drinks, Johnny Boy's running tab with a still, his IOU, house rules.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 528, 816
PAPER, INK, RED, MUTE, CARD, NIGHT = '#f3dcd4', '#2a1214', '#cf1f2b', '#6e4a48', '#fbf1ec', '#1c0a0b'
PEN = '#1f2f6b'
FONTS = ('https://fonts.googleapis.com/css2?family=Rakkas&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400'
         '&family=Nothing+You+Could+Do&display=swap')
DISP = "'Rakkas', serif"; BODY = "'Libre Franklin', sans-serif"; HAND = "'Nothing You Could Do', cursive"
L, CW = 40, 448

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=9):
    """Melt shop signs so no brand name reads."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(5))
    return Image.composite(blur, im, m)

PH_W, PH_H = CW - 12, 262
street = Image.open(S('loc-8d21715.jpg')).convert('L')
street = soften(street, [(676, 482, 930, 535), (680, 540, 760, 575), (820, 555, 930, 600), (836, 655, 880, 690), (628, 512, 680, 584)])
street = ImageEnhance.Contrast(ImageEnhance.Brightness(street).enhance(1.14)).enhance(1.1)
st = fit(street, PH_W, PH_H, (205, 330, 676, 614))
# warm black and white, printed in the card's oxblood so it sits on pink stock
st = ImageOps.colorize(st, black=(34, 14, 16), white=(252, 242, 236), mid=(156, 122, 114))
st.save(A('feast-street.jpg'), quality=90)

JB_W, JB_H = 190, 140
jb = Image.open(S('o-sKyj7i4NPPZCRBea1W5AbTchox9.jpg')).convert('RGB')
jb = soften(jb, [(545, 125, 655, 205)], 7)
jb = ImageEnhance.Brightness(jb).enhance(1.25)
fit(jb, JB_W, JB_H, (360, 30, 1000, 600)).save(A('johnny-at-the-bar.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(64 - i * 2.1)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))
    lay = Image.new('RGBA', (W, H), (110, 50, 45, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 73); wear('back', 19)

# ---------------- type pieces ----------------
def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def item(name, price, desc, gap=12, size=27, dsize=20):
    d = (f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.25; color: {INK}; margin-top: 2px">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.12; color: {INK}">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>{d}</div>')

def section(title, sub, top, inner, tilt='left'):
    """Section title on a red tab, the way a bar card would block it in with one ink."""
    return (f'<div style="position: absolute; left: {L}px; top: {top}px; width: {CW}px">'
            f'<div style="display: flex; align-items: center; gap: 12px">'
            f'<div style="background: {RED}; color: {CARD}; font-family: {DISP}; font-size: 40px; line-height: 1; padding: 6px 14px 4px">{title}</div>'
            f'<div style="flex: 1">{kicker(sub, INK, 16)}<div style="height: 2px; background: {INK}; margin-top: 6px"></div></div></div>'
            f'{inner}</div>')

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def raffle(o, x, y):
    """Feast raffle ticket, stub torn at the perforation, number 0973."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 252px; height: 104px; background: #f7e7a6; '
             f'box-shadow: 0 3px 9px rgba(0,0,0,0.45); transform: rotate(-6deg); display: flex">'
             f'<div style="width: 186px; padding: 9px 6px 0 10px; box-sizing: border-box; border-right: 2px dashed #a58f4c">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.02em; color: {RED}; line-height: 1; white-space: nowrap">FEAST OF SAN GENNARO</div>'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1.1; color: {INK}; margin-top: 3px">RAFFLE</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.2; color: {INK}; white-space: nowrap; letter-spacing: -0.01em">Drawn Sunday, Mulberry St.<br>Must be present to win.</div></div>'
             f'<div style="flex: 1; text-align: center; padding-top: 10px">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: {MUTE}; line-height: 1">No.</div>'
             f'<div style="font-family: {DISP}; font-size: 26px; color: {RED}; line-height: 1.1; margin-top: 2px">0973</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; color: {INK}; line-height: 1; margin-top: 8px">25&cent;</div></div></div>')

def iou(o, x, y):
    """Johnny Boy's IOU on a torn pad sheet, Tuesday crossed out twice."""
    strike = f'text-decoration: line-through; text-decoration-color: {INK}; text-decoration-thickness: 2px'
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 222px; height: 96px; background: #fffdf4; '
             f'box-shadow: 0 3px 9px rgba(0,0,0,0.42); transform: rotate(5deg); '
             f'background-image: repeating-linear-gradient(180deg, transparent 0 25px, #b9cbe0 25px 26px)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 222px; height: 10px; background: repeating-linear-gradient(90deg, #fffdf4 0 6px, transparent 6px 9px)"></div>'
             f'<div style="position: absolute; left: 14px; top: 10px; font-family: {HAND}; color: {PEN}; line-height: 26px; font-size: 20px; width: 204px">'
             f'I.O.U. Tony, 3 beers<br>pay you <span style="{strike}">Tues.</span> <span style="{strike}">Tues.</span><br>next Tuesday. J.B.</div></div>')

def bulb(o, x, y):
    """The red light: a bare red bulb on a cord with its glow, drawn in the sign band."""
    o.append(f'<div style="position: absolute; left: {x - 70}px; top: {y - 50}px; width: 180px; height: 180px; border-radius: 50%; '
             f'background: radial-gradient(circle, rgba(255,120,110,0.55) 0%, rgba(255,60,60,0.22) 38%, rgba(255,40,40,0) 70%)"></div>'
             f'<div style="position: absolute; left: {x + 19}px; top: 0; width: 2px; height: {y - 6}px; background: #0d0405"></div>'
             f'<div style="position: absolute; left: {x + 10}px; top: {y - 16}px; width: 20px; height: 20px; background: linear-gradient(90deg, #3a2a20, #8a7560, #3a2a20); border-radius: 3px"></div>'
             f'<div style="position: absolute; left: {x}px; top: {y}px; width: 40px; height: 52px; border-radius: 50% 50% 46% 46%; '
             f'background: radial-gradient(circle at 40% 35%, #fff2ec 0%, #ff8a80 22%, #e3202c 58%, #8c0d14 100%); '
             f'box-shadow: 0 0 18px 6px rgba(255,70,70,0.6)"></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    # sign band: the bar under its red light
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 176px; '
             f'background: linear-gradient(180deg, #5a0c11 0%, {NIGHT} 100%)"></div>')
    bulb(o, 438, 58)
    o.append(f'<div style="position: absolute; left: {L}px; top: 36px; width: 340px">{kicker("Mulberry St. &middot; Little Italy", "#ff9b93", 16)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 3}px; top: 46px; font-family: {DISP}; font-size: 84px; line-height: 1.05; color: {CARD}; '
             f'letter-spacing: 0.01em">TONY&rsquo;S</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 140px; width: {CW}px; font-family: {BODY}; font-weight: 600; font-size: 19px; '
             f'line-height: 1.1; color: #ffb3ac; letter-spacing: 0.06em">THE RED LIGHT&rsquo;S ON. WE&rsquo;RE OPEN.</div>')

    # signature: the street on parade day
    o.append(f'<div style="position: absolute; left: {L}px; top: 194px; width: {CW}px">{kicker("Feast week on the block")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 218px; width: {PH_W}px; height: {PH_H}px; border: 4px solid {CARD}; '
             f'outline: 2px solid {RED}; box-shadow: 0 2px 6px rgba(60,10,10,0.3)">'
             f'<img src="assets/feast-street.jpg" alt="A Little Italy street packed for a parade, flags and bunting hung from every fire escape" '
             f'style="display: block; width: {PH_W}px; height: {PH_H}px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 498px; width: 192px; font-family: {BODY}; font-style: italic; font-size: 17px; '
             f'line-height: 1.3; color: {MUTE}">The whole block turns out. Bunting up, saints out, nobody sleeps.</div>')
    raffle(o, 236, 452)

    feast = (item('Sausage &amp; peppers', '.73', 'Charred onion and red pepper, hot mustard.', 10)
             + item('Zeppole in the bag', '.50', 'Fried dough, shaken hot in powdered sugar.', 12))
    o.append(section('THE FEAST', 'From the stands', 578, feast))
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    # tab card header, made out to the house's most famous account
    o.append(f'<div style="position: absolute; left: {L}px; top: 36px; width: {CW}px; display: flex; justify-content: space-between; align-items: flex-end; '
             f'border-bottom: 4px solid {INK}; padding-bottom: 6px">'
             f'<div style="font-family: {DISP}; font-size: 48px; line-height: 1; color: {INK}">TONY&rsquo;S <span style="color: {RED}">TAB</span></div>'
             f'<div style="text-align: right">{kicker("Card No. 73", RED, 16)}'
             f'<div style="font-family: {BODY}; font-size: 16px; color: {INK}; margin-top: 6px">Name: <span style="font-family: {HAND}; font-size: 24px; color: {PEN}">Johnny Boy</span></div></div></div>')

    bar = (item('Fried calamari', '1.75', 'Squid rings, crisp semolina coat, lemon.', 10)
           + item('Penne arrabbiata', '2.25', 'Garlic, hot chili, tomato, parsley, pecorino.', 10))
    o.append(section('THE BAR', 'Kitchen till two', 106, bar))

    drinks = ''.join(f'<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-weight: 700; font-size: 22px; line-height: 1.15; color: {INK}; margin-top: 7px">'
                     f'<span>{n}</span><span style="color: {RED}">{p}</span></div>' for n, p in
                     (('Draft beer', '.50'), ('Rye &amp; ginger', '.95'), ('Scotch, rocks', '1.25'), ('Anisette', '.75')))
    rnd = (item('Feast wine &amp; peaches', '.75', 'Chilled red over sliced white peaches. Jug 3.50.', 10)
           + f'<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px; margin-top: 2px">{drinks}</div>')
    o.append(section('ANOTHER ROUND', 'Cash only', 298, rnd))

    # Johnny Boy's account: the still and the running tab
    top = 508
    o.append(f'<div style="position: absolute; left: {L}px; top: {top}px; width: {CW}px; height: 160px; box-sizing: border-box; border: 3px solid {INK}; background: {CARD}">'
             f'<img src="assets/johnny-at-the-bar.jpg" alt="Johnny Boy at the bar under the red lights, grinning, one hand out" '
             f'style="position: absolute; left: 7px; top: 7px; width: {JB_W}px; height: {JB_H}px; display: block">'
             f'<div style="position: absolute; left: 208px; top: 8px; width: 228px">'
                          f'<div style="font-family: {DISP}; font-size: 28px; line-height: 1.05; color: {INK}; margin-top: 2px">JOHNNY BOY</div>'
             f'<div style="font-family: {HAND}; font-size: 19px; line-height: 24px; color: {PEN}; margin-top: 4px">'
             f'beers, all week ... 4.50<br>calamari x 2 ... 3.50</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; color: {MUTE}; margin-top: 2px">Put it on mine. <span style="font-family: {HAND}; font-size: 24px; color: {RED}">Charlie</span></div>'
             f'<div style="border-top: 2px solid {INK}; margin-top: 4px; padding-top: 3px; font-family: {BODY}; font-weight: 700; font-size: 16px; color: {RED}; letter-spacing: 0.08em">'
             f'NO MORE CREDIT</div></div></div>')
    iou(o, 282, 676)

    o.append(f'<div style="position: absolute; left: {L}px; top: 680px; width: 250px; font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {MUTE}">'
             'No firecrackers. No mooks.<br>Loans? See Michael.<br>Mind the cat in back.<br>Prices subject to change.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tony\'s tab card, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
