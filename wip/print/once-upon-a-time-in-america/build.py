"""Fat Moe's, lunch room with a back room, Lower East Side, 1933 (the film's own fictional place).
Speakeasy bill of fare, one face 960x1344 (10 x 14 in). Celery-green stock, deli-brown ink, brick red.
Signature: real Bain News Service photo, Orchard and Rivington on a Sunday morning, c.1915 (Library of Congress, public domain).
TMDB still: locker 541.
Props: a pocket watch claim ticket, a bakery box lid.
Big gags: the FAT MOE'S sign, the charlotte russe "on the stairs", locker 541 and the key in the clock.
Writes photo crops, paper wear, front.body.html and front.html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 960, 1344
M = 48
PAPER, INK, RED = '#e0e2c8', '#261b13', '#93301f'
SOFT = '#4c3e33'
FONTS = ('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Old Standard TT', serif"; BODY = "'Crimson Pro', serif"; SCRIPT = "'Mrs Saint Delafield', cursive"

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PW, PH = W - 2 * M - 12, 370
st = Image.open(S('loc-3b19794u.tif')).convert('L')
# blank the lettering on shop signs so no business name reads: fill each text field with its own dark tone, then soften
for box in ((1745, 1080, 1990, 1420), (1790, 1565, 2140, 1735), (2300, 1120, 2450, 1210), (3140, 1288, 3340, 1370),
            (3380, 1420, 3480, 1560), (3588, 1580, 3700, 1680), (4510, 1600, 4660, 1780), (4730, 1860, 4910, 2020)):
    pad = 30
    big = (box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad)
    reg = st.crop(big)
    soft = reg.filter(ImageFilter.GaussianBlur(14))
    mask = Image.new('L', reg.size, 0); ImageDraw.Draw(mask).rectangle([pad, pad, reg.size[0] - pad, reg.size[1] - pad], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    st.paste(Image.composite(soft, reg, mask), big[:2])
st = ImageOps.autocontrast(st, cutoff=0.6)
st = ImageEnhance.Brightness(st).enhance(1.06)
st = ImageOps.colorize(st, black='#22170f', white='#f2f1e0', mid='#8b7a64')
fit(st, PW, PH, (240, 720, 4960, 3700)).save(A('street-rivington.jpg'), quality=90)

lk = Image.open(S('2jNsww4YUQQBpPW4HKxPNu0wTar.jpg')).convert('RGB')
lk = ImageEnhance.Brightness(lk).enhance(1.75)
lk = ImageEnhance.Contrast(lk).enhance(1.05)
LW, LH = 236, 150
fit(lk, LW, LH, (700, 120, 3300, 1880)).save(A('locker-541.jpg'), quality=90)

def wear():
    """Soft aged edge vignette and a little big mottling. Low detail."""
    rnd = random.Random(1933)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(46):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(92 - i * 2)))
    for i in range(10):
        x, y = rnd.randint(0, W), rnd.choice([rnd.randint(-40, 120), rnd.randint(H - 120, H + 40)])
        r = rnd.randint(90, 200)
        md.ellipse([x - r, y - r * 0.5, x + r, y + r * 0.5], fill=rnd.randint(14, 30))
    m = m.filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), (120, 92, 52, 0)); lay.putalpha(m)
    lay.save(A('wear-paper.png'))
wear()

# ---------------- type pieces ----------------
def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1;{extra}">{t}</div>')

def head(kick, title, color=INK, rule=RED, kcol=RED, top=0):
    """Kicker, heavy caps title, then a thick and thin double rule in the accent."""
    return (f'<div style="margin-top: {top}px">{kicker(kick, kcol)}'
            f'<div style="font-family: {DISP}; font-weight: 700; font-size: 40px; line-height: 44px; color: {color}; margin-top: 4px; white-space: nowrap">{title}</div>'
            f'<div style="height: 4px; background: {rule}; margin-top: 4px"></div>'
            f'<div style="height: 1px; background: {rule}; margin-top: 3px"></div></div>')

def item(name, price, desc, top=10, col=INK, dcol=SOFT, pcol=RED):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {DISP}; font-weight: 700; '
            f'font-size: 27px; line-height: 1.18; color: {col}">'
            f'<span>{name}</span><span style="color: {pcol}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.28; color: {dcol}; margin-top: 2px">{desc}</div></div>')

# ---------------- props ----------------
def watch_ticket(o, x, y):
    """Pocket watch claim ticket from the repair man two doors down. Perforated stub on the left."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 214px; height: 140px; background: #efe3bf; box-sizing: border-box; '
             f'box-shadow: 0 4px 10px rgba(30,20,10,0.45); transform: rotate(5deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 46px; height: 140px; background: {RED}"></div>'
             f'<div style="position: absolute; left: 46px; top: 0; width: 0; height: 140px; border-left: 2px dotted #efe3bf"></div>'
             f'<div style="position: absolute; left: 0; top: 22px; width: 46px; text-align: center; font-family: {DISP}; font-weight: 700; font-size: 22px; line-height: 1.05; color: #efe3bf">No.<br>22</div>'
             f'<div style="position: absolute; left: 13px; top: 86px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #efe3bf; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 58px; top: 10px; right: 10px">'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.18em; color: {RED}; line-height: 1">WATCH CLAIM CHECK</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 18px; color: {INK}; line-height: 1.15; margin-top: 6px">One gent&rsquo;s gold pocket watch</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; color: {INK}; line-height: 1.25; margin-top: 4px">Wound, set and oiled.<br>Not yet called for.</div></div></div>')

def bakery_box(o, x, y):
    """Bakery box lid seen from above, white board tied with red and white string, a round counter label."""
    w, h = 214, 128
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: #f4f1e6; box-sizing: border-box; '
             f'border: 1px solid #c9c1a8; box-shadow: 0 4px 10px rgba(30,20,10,0.4); transform: rotate(-4deg)">'
             f'<div style="position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; border: 1px solid #d8d0b8"></div>'
             f'<div style="position: absolute; left: 0; top: {h // 2 - 2}px; width: {w}px; height: 4px; background: {RED}"></div>'
             f'<div style="position: absolute; left: 0; top: {h // 2 + 1}px; width: {w}px; height: 1px; background: #f4f1e6"></div>'
             f'<div style="position: absolute; left: {w // 2 - 2}px; top: 0; width: 4px; height: {h}px; background: {RED}"></div>'
             f'<div style="position: absolute; left: {w // 2 - 54}px; top: {h // 2 - 40}px; width: 108px; height: 80px; border-radius: 50%; background: {PAPER}; '
             f'border: 2px solid {RED}; box-sizing: border-box; text-align: center; padding-top: 12px">'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.12em; color: {RED}; line-height: 1">ONE ONLY</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 15px; color: {INK}; line-height: 1.12; margin-top: 4px">Charlotte<br>russe</div></div>'
             f'<div style="position: absolute; left: 12px; bottom: 6px; font-family: {BODY}; font-style: italic; font-size: 14px; color: {SOFT}; line-height: 1">Deliver upstairs</div>'
             f'</div>')

# ---------------- FACE ----------------
def face():
    o = []
    # kicker row
    o.append(f'<div style="position: absolute; left: {M}px; top: 40px; width: {W - 2 * M}px; display: flex; justify-content: space-between">'
             + kicker('Lunch room &amp; delicatessen') + kicker('Lower East Side') + kicker('Bill of fare, 1933') + '</div>')
    # the sign
    SY, SH = 68, 116
    o.append(f'<div style="position: absolute; left: {M}px; top: {SY}px; width: {W - 2 * M}px; height: {SH}px; background: {INK}; box-sizing: border-box; '
             f'box-shadow: 0 3px 0 {RED}">'
             f'<div style="position: absolute; left: 7px; top: 7px; right: 7px; bottom: 7px; border: 2px solid {RED}"></div>'
             f'<div style="position: absolute; left: 13px; top: 13px; right: 13px; bottom: 13px; border: 1px solid #6d5a45"></div>'
             f'<div style="position: absolute; left: 0; right: 0; top: 8px; text-align: center; font-family: {DISP}; font-weight: 700; font-size: 94px; '
             f'line-height: 100px; letter-spacing: 0.05em; color: {PAPER}; white-space: nowrap">FAT MOE&rsquo;S</div>'
             + ''.join(f'<div style="position: absolute; left: {lx}px; top: 34px; width: 112px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 16px; '
                       f'letter-spacing: 0.2em; color: {PAPER}; line-height: 1.5">{t}</div>'
                       for lx, t in ((30, 'HOT<br>LUNCH'), (W - 2 * M - 142, 'OPEN<br>LATE')))
             + '</div>')
    # signature photo: the neighborhood, c.1915
    PY = SY + SH + 16
    o.append(f'<div style="position: absolute; left: {M}px; top: {PY}px; border: 2px solid {RED}; padding: 4px; background: {PAPER}">'
             f'<img src="assets/street-rivington.jpg" alt="A crowded Lower East Side street corner on a Sunday morning, pushcarts of fruit, shoppers in hats and long coats, tenements with fire escapes" '
             f'style="display: block; width: {PW}px; height: {PH}px"></div>')
    o.append(f'<div style="position: absolute; left: {M + 6}px; top: {PY + PH - 36}px; height: 42px; background: {PAPER}; padding: 0 16px 0 12px; box-sizing: border-box; '
             f'font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 42px; color: {INK}; white-space: nowrap">'
             'The old neighborhood, Sunday morning. We grew up on this corner.</div>')
    watch_ticket(o, W - M - 226, PY - 12)
    # locker 541 snapshot, bottom right of the photo
    LX, LY = W - M - LW - 30, PY + PH - 196
    o.append(f'<div style="position: absolute; left: {LX}px; top: {LY}px; width: {LW + 16}px; background: #f4f1e6; padding: 8px 8px 0; box-sizing: border-box; '
             f'box-shadow: 0 4px 10px rgba(30,20,10,0.5); transform: rotate(-2deg)">'
             f'<div style="border: 1px solid {RED}"><img src="assets/locker-541.jpg" alt="A hand turning a key in a station locker numbered 541" style="display: block; width: {LW - 2}px; height: {LH}px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 34px; color: {INK}; text-align: center; white-space: nowrap">Locker 541. The key? Ask the clock.</div></div>')

    # menu, left: counter and kitchen
    MY = PY + PH + 34
    LCW = 478
    left = (head('Made fresh every morning', 'AT THE COUNTER')
            + item('Delancey knishes', '.10', 'Potato and sweet onion in puff pastry, hot mustard.')
            + item('Bagel crisps &amp; schmear', '.20', 'Bagel rounds, chive cream cheese, smoked salmon.')
            + head('Hot plates, noon to closing', 'FROM THE KITCHEN', top=14)
            + item('Moe&rsquo;s brisket', '.45', 'Slow braised on onions, paprika and tomato gravy.')
            + item('Noodles&rsquo; kugel', '.15', 'Baked egg noodles, farmer cheese, raisins, cinnamon.'))
    o.append(f'<div style="position: absolute; left: {M}px; top: {MY}px; width: {LCW}px">{left}</div>')

    # menu, right: the back room, a dark door panel
    RX = M + LCW + 28; RW = W - M - RX
    RH = 450
    back = (head('Friends of the house', 'BACK ROOM', color=PAPER, rule=RED, kcol='#d9a08f')
            + item('Rye sour', '.35', 'Rye, lemon, sugar, egg white, a dash of bitters.', col=PAPER, dcol='#cfc9b0', pcol='#e0937e')
            + item('Cold tea', '.25', 'Strong, brown, from the pot. Ask for it by name.', col=PAPER, dcol='#cfc9b0', pcol='#e0937e')
            + item('Egg cream', '.05', 'Chocolate, milk, seltzer. No egg.', col=PAPER, dcol='#cfc9b0', pcol='#e0937e')
            + f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: #cfc9b0; margin-top: 14px">'
              'Everything in china teacups. Repeal is coming; we&rsquo;ll give it a funeral.</div>')
    o.append(f'<div style="position: absolute; left: {RX}px; top: {MY - 6}px; width: {RW}px; height: {RH}px; background: {INK}; box-sizing: border-box; '
             f'border-radius: 6px 6px 0 0; padding: 18px 20px 0">'
             f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 1px solid #6d5a45; border-radius: 4px 4px 0 0"></div>'
             f'<div style="position: relative">{back}</div>'
             f'</div>')

    # bottom band: the charlotte russe, with the bakery box
    BY = MY + RH + 26
    o.append(f'<div style="position: absolute; left: {M}px; top: {BY}px; width: {W - 2 * M}px; height: 136px; border-top: 4px solid {RED}; border-bottom: 1px solid {RED}; box-sizing: border-box"></div>')
    bakery_box(o, M + 4, BY + 4)
    o.append(f'<div style="position: absolute; left: {M + 244}px; top: {BY + 12}px; width: {W - 2 * M - 244}px">'
             + kicker('From the bakery case')
             + f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 2px; font-family: {DISP}; font-weight: 700; color: {INK}">'
               f'<span style="font-size: 40px; line-height: 46px">Charlotte russe</span><span style="font-size: 40px; line-height: 46px; color: {RED}">5&cent;</span></div>'
             + f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.28; color: {SOFT}">Sponge in a paper cup, vanilla cream piped tall, a cherry.<br>'
               f'<i style="color: {INK}">Try not to eat it on the stairs.</i></div></div>')

    # Moe's note
    # fine print
    o.append(f'<div style="position: absolute; left: {M}px; top: {H - 106}px; width: {W - 2 * M}px; display: flex; justify-content: space-between; align-items: flex-end">'
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.32; color: {SOFT}">'
             'Prices subject to change. Storeroom closed afternoons for dance practice.<br>'
             'Music most nights, Cockeye on the flute. Some of us go to bed early.<br>'
             'Bill of fare No. 1933. Telephone ORchard 4-1968. Same table as always.</div>'
             f'<div style="text-align: right; flex: none; margin-left: 16px"><div style="font-family: {BODY}; font-style: italic; font-size: 16px; color: {SOFT}; line-height: 1.2">Your table is waiting, boys.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 46px; color: {RED}; line-height: 0.9; margin-top: 2px">Moe</div></div></div>')

    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.55">'
            f'<img src="assets/wear-paper.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            + ''.join(o) + '</div>')

b = face()
open(os.path.join(D, 'front.body.html'), 'w').write(b)
open(os.path.join(D, 'front.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fat Moe&rsquo;s bill of fare</title>'
    f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
