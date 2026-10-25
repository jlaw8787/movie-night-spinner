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
PAPER, INK, RED = '#eadcbc', '#2a1c12', '#9b3b1f'
SOFT = '#5a4636'
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

PW, PH = W - 2 * M - 12, 500
st = Image.open(S('loc-3b19794u.tif')).convert('L')
# crop below every shop sign: only the market crowd, the pushcarts and their ghostly long-exposure figures
st = st.crop((2150, 1780, 4930, 3700))
st = ImageOps.autocontrast(st, cutoff=0.6)
st = ImageEnhance.Brightness(st).enhance(1.04)
st = ImageOps.colorize(st, black='#1e120a', white='#f6e8c8', mid='#9a7449')
st = fit(st, PW, PH)
# drifting smoke and steam, warm and soft, heavier at the top (under the sign) and the lower left
rnd = random.Random(1968)
sm = Image.new('L', st.size, 0); sd = ImageDraw.Draw(sm)
w2, h2 = st.size
for i in range(70):
    zone = rnd.random()
    x = rnd.randint(-100, w2 + 100)
    y = rnd.randint(-120, int(h2 * 0.32)) if zone < 0.55 else rnd.randint(int(h2 * 0.55), h2 + 80)
    if zone >= 0.55: x = rnd.randint(-120, int(w2 * 0.55))
    r = rnd.randint(90, 260)
    sd.ellipse([x - r, y - r * 0.55, x + r, y + r * 0.55], fill=rnd.randint(18, 42))
sm = sm.filter(ImageFilter.GaussianBlur(60))
haze = Image.new('RGB', st.size, (246, 234, 206))
st = Image.composite(haze, st, sm)
st.save(A('street-rivington.jpg'), quality=90)

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
    lay = Image.new('RGBA', (W, H), (128, 88, 44, 0)); lay.putalpha(m)
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
    # signature photo, the market corner c.1915, with the sign hung across its top
    PY = 66
    o.append(f'<div style="position: absolute; left: {M}px; top: {PY}px; border: 2px solid {RED}; padding: 4px; background: {PAPER}">'
             f'<img src="assets/street-rivington.jpg" alt="A Lower East Side market street on a Sunday morning, pushcarts of fruit, shoppers and blurred passers-by in long coats, in warm sepia haze" '
             f'style="display: block; width: {PW}px; height: {PH}px"></div>')
    SX, SY, SWD, SH = M + 30, PY + 26, W - 2 * M - 60, 112
    o.append(f'<div style="position: absolute; left: {SX}px; top: {SY}px; width: {SWD}px; height: {SH}px; background: {INK}; box-sizing: border-box; '
             f'box-shadow: 0 6px 16px rgba(20,12,6,0.55)">'
             f'<div style="position: absolute; left: 7px; top: 7px; right: 7px; bottom: 7px; border: 2px solid {RED}"></div>'
             f'<div style="position: absolute; left: 13px; top: 13px; right: 13px; bottom: 13px; border: 1px solid #6d5a45"></div>'
             f'<div style="position: absolute; left: 0; right: 0; top: 6px; text-align: center; font-family: {DISP}; font-weight: 700; font-size: 90px; '
             f'line-height: 100px; letter-spacing: 0.05em; color: {PAPER}; white-space: nowrap">FAT MOE&rsquo;S</div>'
             + ''.join(f'<div style="position: absolute; left: {lx}px; top: 32px; width: 104px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 16px; '
                       f'letter-spacing: 0.2em; color: {PAPER}; line-height: 1.5">{t}</div>'
                       for lx, t in ((20, 'HOT<br>LUNCH'), (SWD - 124, 'OPEN<br>LATE')))
             + '</div>')
    o.append(f'<div style="position: absolute; left: {M + 6}px; top: {PY + PH - 36}px; height: 42px; background: {PAPER}; padding: 0 16px 0 12px; box-sizing: border-box; '
             f'font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 42px; color: {INK}; white-space: nowrap">'
             'The old neighborhood, Sunday morning. We grew up on this corner.</div>')
    watch_ticket(o, M + 24, PY + PH - 210)
    # locker 541 snapshot, bottom right of the photo
    LX, LY = W - M - LW - 30, PY + PH - 196
    o.append(f'<div style="position: absolute; left: {LX}px; top: {LY}px; width: {LW + 16}px; background: #f4ecd8; padding: 8px 8px 0; box-sizing: border-box; '
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
    back = (head('Friends of the house', 'BACK ROOM', color=PAPER, rule=RED, kcol='#e3a865')
            + item('Rye sour', '.35', 'Rye, lemon, sugar, egg white, a dash of bitters.', col=PAPER, dcol='#d8c9a8', pcol='#e3a865')
            + item('Cold tea', '.25', 'Strong, brown, from the pot. Ask for it by name.', col=PAPER, dcol='#d8c9a8', pcol='#e3a865')
            + item('Egg cream', '.05', 'Chocolate, milk, seltzer. No egg.', col=PAPER, dcol='#d8c9a8', pcol='#e3a865')
            + f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: #d8c9a8; margin-top: 14px">'
              'Everything in china teacups. Repeal is coming; we&rsquo;ll give it a funeral.</div>')
    o.append(f'<div style="position: absolute; left: {RX}px; top: {MY - 6}px; width: {RW}px; height: {RH}px; background: {INK}; box-sizing: border-box; '
             f'border-radius: 6px 6px 0 0; padding: 18px 20px 0">'
             f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 1px solid #6d5a45; border-radius: 4px 4px 0 0"></div>'
             f'<div style="position: relative">{back}</div>'
             f'</div>')

    # bottom band: the charlotte russe, given the stage. A dark sepia band, the bakery box, the big name
    BY = MY + RH + 18
    BH = 152
    o.append(f'<div style="position: absolute; left: {M}px; top: {BY}px; width: {W - 2 * M}px; height: {BH}px; background: {INK}; box-sizing: border-box">'
             f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 1px solid #6d5a45"></div>'
             f'<div style="position: absolute; left: 0; right: 0; top: 0; height: 4px; background: {RED}"></div></div>')
    bakery_box(o, M + 18, BY + 12)
    o.append(f'<div style="position: absolute; left: {M + 262}px; top: {BY + 14}px; width: {W - 2 * M - 286}px">'
             + kicker('From the bakery case, one only', '#e3a865')
             + f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 2px; font-family: {DISP}; font-weight: 700; color: {PAPER}">'
               f'<span style="font-size: 54px; line-height: 60px">Charlotte russe</span><span style="font-size: 54px; line-height: 60px; color: #e3a865">5&cent;</span></div>'
             + f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.28; color: #d8c9a8">Sponge in a paper cup, vanilla cream piped tall, a cherry.<br>'
               f'<i style="color: {PAPER}">Try not to eat it on the stairs.</i></div></div>')

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
