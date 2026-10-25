"""Chez Bippy, Sonny's bar on 187th Street and Belmont Avenue, the Bronx, 1960.
A tall neighbourhood bar card, two faces 600x1200 (6.25 x 12.5 in), the kind propped between the napkins and the ashtray.
Ivory card, bottle green, neon red, sign gold.
Front: the green sign band with the name lit up like the window neon, the fellas out front (TMDB still), Lorenzo's bus transfer,
       the bar kitchen, and the complaints department.
Back:  Sunday at Sonny's table, the block (1964 Macombs Road photo, LoC, public domain) with the door test card,
       the jukebox corner (a real jukebox photo, LoC, public domain; drinks as typographic title strips), Sonny's note, house rules.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 600, 1200
PAPER, GREEN, RED, GOLD, MUTE, CARD = '#f1e6c8', '#173b2c', '#c42f27', '#e3b04b', '#5b5440', '#fbf5e4'
BLUE = '#27467e'
FONTS = ('https://fonts.googleapis.com/css2?family=Damion'
         '&family=Barlow+Condensed:ital,wght@0,500;0,600;0,700;1,500&display=swap')
DISP = "'Damion', cursive"; BODY = "'Barlow Condensed', sans-serif"
L, CW = 40, 520

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=9, feather=6):
    """Melt signs and badges so no brand reads."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(feather))
    return Image.composite(blur, im, m)

HERO_W, HERO_H = CW - 12, 290
win = Image.open(S('o-n0iWJRwSqxxm89Ux9gopzFlH5ti.jpg')).convert('RGB')
win = soften(win, [(760, 450, 1140, 770)], 40, 34)           # beer neon between the two men melts to plain glow
win = ImageEnhance.Brightness(win).enhance(1.1)
fit(win, HERO_W, HERO_H, (60, 40, 1880, 1060)).save(A('the-window-at-night.jpg'), quality=90)

BLK_W, BLK_H = 300, 262
blk = Image.open(S('macombs.tif')).convert('L')
blk = soften(blk.convert('RGB'), [(3380, 3380, 3700, 3560)], 14).convert('L')   # hood badge
blk = blk.crop((900, 2500, 4830, 6060))
blk = ImageOps.autocontrast(blk, cutoff=0.6)
blk = ImageEnhance.Brightness(blk).enhance(1.06)
# warm silver print, not a heavy tint
blk = ImageOps.colorize(blk, black='#1b1a17', white='#fbf6ea', mid='#8a8577')
fit(blk, BLK_W, BLK_H).save(A('the-block-1964.jpg'), quality=90)

# the jukebox: a real 1940s machine lit up, Carol M. Highsmith (LOC, public domain). Both maker's nameplates melted
# so no brand reads; the title strips are too small to read at print size.
JB_W, JB_H = 180, 312
jb = Image.open(S('loc-highsmith-15125.jpg')).convert('RGB')
jb = soften(jb, [(1270, 1082, 1560, 1136)], 18, 8)                    # small wordmark under the record stack
jb = soften(jb, [(1160, 1690, 1670, 1790)], 34, 12)                   # front nameplate
jb = ImageEnhance.Brightness(jb).enhance(1.06)
fit(jb, JB_W, JB_H, (380, 0, 2500, 3618)).save(A('the-jukebox.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2.1)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 20, H // 20), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), (110, 80, 40, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 187); wear('back', 60)

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; object-fit: cover; opacity: 0.2">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- type pieces ----------------
def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def item(name, price, desc, gap=14, size=28, dsize=21):
    d = (f'<div style="font-family: {BODY}; font-weight: 500; font-size: {dsize}px; line-height: 1.2; color: {MUTE}; margin-top: 2px">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.1; color: {GREEN}; text-transform: uppercase; letter-spacing: 0.02em">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>{d}</div>')

def title(t, k, top, color=GREEN):
    """Script title in the sign's hand with a spaced kicker and a short red rule; no label bars on this card."""
    return (f'<div style="position: absolute; left: {L}px; top: {top}px; width: {CW}px">'
            f'{kicker(k)}'
            f'<div style="display: flex; align-items: flex-end; gap: 14px; margin-top: 4px">'
            f'<div style="font-family: {DISP}; font-size: 52px; line-height: 1; color: {color}; white-space: nowrap">{t}</div>'
            f'<div style="flex: 1; height: 0; border-top: 3px solid {RED}; border-bottom: 1px solid {RED}; padding-top: 2px; margin-bottom: 12px"></div></div></div>')

def photo(src, alt, x, y, w, h, color=RED):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; padding: 4px; background: {CARD}; '
            f'border: 2px solid {color}; box-shadow: 0 2px 6px rgba(30,20,10,0.25)">'
            f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

# ---------------- props ----------------
def transfer(o, x, y):
    """Lorenzo's bus transfer: punched hour, route Belmont-187th, operator L. Anello."""
    holes = ''.join(
        f'<div style="width: 22px; height: 22px; box-sizing: border-box; border: 1.5px solid {BLUE}; font-family: {BODY}; font-weight: 700; '
        f'font-size: 14px; line-height: 19px; text-align: center; color: {BLUE}; position: relative">{h}'
        + (f'<div style="position: absolute; left: 3px; top: 3px; width: 13px; height: 13px; border-radius: 50%; background: {GREEN}"></div>' if h == '6' else '')
        + '</div>' for h in ('1', '2', '3', '4', '5', '6', '7', '8', '9'))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 236px; height: 146px; background: #f6efc6; '
             f'box-shadow: 0 3px 9px rgba(0,0,0,0.38); transform: rotate(5deg); box-sizing: border-box; padding: 9px 12px; border-top: 8px solid {BLUE}">'
             f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 30px; line-height: 1; letter-spacing: 0.06em; color: {BLUE}">TRANSFER</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; color: {RED}">No. 1960</div></div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 15px; line-height: 1.15; color: {GREEN}; margin-top: 4px; letter-spacing: 0.04em">'
             f'CITY BUS. BELMONT AVE. LINE<br>OPERATOR: L. ANELLO</div>'
             f'<div style="display: flex; gap: 2px; margin-top: 7px">{holes}</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-weight: 500; font-size: 14px; color: {MUTE}; margin-top: 4px">Good one hour from time punched.</div></div>')

def doortest(o, x, y):
    """Sonny's car door test, printed as a little card the fellas hand to the kid."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 198px; background: {CARD}; box-sizing: border-box; '
             f'border: 2px solid {GREEN}; outline: 4px solid {CARD}; box-shadow: 0 4px 12px rgba(0,0,0,0.42); transform: rotate(3deg); padding: 10px 14px 10px">'
             f'<div style="display: flex; align-items: center; gap: 10px">'
             # the door lock button, drawn big: chrome knob on a sill
             f'<div style="position: relative; width: 34px; height: 46px; flex: none">'
             f'<div style="position: absolute; left: 11px; top: 0; width: 12px; height: 34px; border-radius: 6px 6px 2px 2px; background: #c9c3b4; border: 2px solid {GREEN}; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 0; top: 32px; width: 34px; height: 10px; border-radius: 3px; background: {GREEN}"></div></div>'
             f'<div>{kicker("Sonny&rsquo;s rule", RED, 15)}'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 25px; line-height: 0.95; color: {GREEN}; margin-top: 3px; letter-spacing: 0.02em">THE DOOR<br>TEST</div></div></div>'
             f'<div style="font-family: {BODY}; font-weight: 500; font-size: 18px; line-height: 1.22; color: {GREEN}; margin-top: 7px">'
             f'Open her door. Walk around. If she doesn&rsquo;t reach over and lift your lock, she&rsquo;s selfish.</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.14em; color: {RED}; margin-top: 6px">PASS / FAIL</div></div>')

# ---------------- FRONT ----------------
def neon_sign(top):
    """The window sign, drawn big: script name in white-hot tube, a red tube frame, gold kicker lines."""
    glow = f'0 0 4px #fff, 0 0 10px {RED}, 0 0 22px {RED}, 0 0 40px rgba(196,47,39,0.75)'
    return (f'<div style="position: absolute; left: 26px; top: {top}px; width: 548px; height: 228px; box-sizing: border-box; '
            f'border: 4px solid #ffb3a8; border-radius: 26px; box-shadow: 0 0 8px {RED}, 0 0 20px rgba(196,47,39,0.8), 0 0 2px #fff"></div>'
            f'<div style="position: absolute; left: 26px; top: {top + 20}px; width: 548px; text-align: center">'
            f'{kicker("187th Street &amp; Belmont Ave. &nbsp;The Bronx", GOLD, 17)}'
            f'<div style="font-family: {DISP}; font-size: 118px; line-height: 1.12; white-space: nowrap; color: #fff6ea; margin-top: 2px; text-shadow: {glow}">Chez Bippy</div>'
            f'<div style="display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: -2px">'
            f'<div style="width: 46px; height: 3px; background: {GOLD}; box-shadow: 0 0 6px {GOLD}"></div>'
            f'{kicker("Bar &amp; Kitchen &nbsp;Cash only", GOLD, 17)}'
            f'<div style="width: 46px; height: 3px; background: {GOLD}; box-shadow: 0 0 6px {GOLD}"></div></div></div>')

def front():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 276px; background: {GREEN}"></div>')
    o.append(neon_sign(22))
    o.append(f'<div style="position: absolute; left: 0; top: 276px; width: {W}px; height: 6px; background: {RED}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 286px; width: {W}px; height: 2px; background: {GOLD}"></div>')

    o.append(photo('the-window-at-night.jpg', 'Two of the fellas leaning in the lit Chez Bippy window at night, glass blocks all around',
                   L, 306, HERO_W, HERO_H))
    o.append(f'<div style="position: absolute; left: {L}px; top: 614px; width: 290px; font-family: {BODY}; font-style: italic; font-weight: 500; '
             f'font-size: 19px; line-height: 1.22; color: {MUTE}">Summer night on 187th. The light stays on.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 650px; width: 286px">'
             f'{kicker("A word from the owner", RED, 17)}'
             f'<div style="font-family: {BODY}; font-weight: 500; font-size: 20px; line-height: 1.2; color: {GREEN}; margin-top: 5px">'
             f'Eat, have a drink, leave the dice alone.<br>Eddie, that means you.'
             f'<span style="font-family: {DISP}; font-size: 34px; line-height: 0; color: {GREEN}; margin-left: 14px; position: relative; top: 4px">Sonny</span></div></div>')
    transfer(o, 328, 626)

    bar = (item('Fried stuffed olives', '.60', 'Big green olives packed with sharp provolone, crackling crumb, lemon garlic mayonnaise, a pinch of chili.', 8)
           + item('Garlic knots', '.40', 'Hot from the oven, brushed with butter, parsley and grated parmesan.', 12)
           + item('Sausage &amp; peppers hero', '.75', 'Sweet fennel links, soft onions, green peppers, seeded roll.', 12))
    o.append(title('From the bar', 'Kitchen till midnight', 770))
    o.append(f'<div style="position: absolute; left: {L}px; top: 832px; width: {CW}px">{bar}</div>')

    # the boy between two fathers: one line from the bus, one from the bar
    def say(k, line, color):
        return (f'<div style="display: flex; align-items: baseline; gap: 16px; height: 40px">'
                f'<div style="width: 176px; flex: none">{kicker(k, RED, 16, " white-space: nowrap;")}</div>'
                f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1.1; white-space: nowrap; color: {color}">{line}</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1068px; width: {CW}px; border-top: 1px solid rgba(23,59,44,0.35); padding-top: 8px">'
             + say('Heard on the bus', 'Don&rsquo;t waste your talent.', BLUE)
             + say('Heard at the bar', 'Mantle? Nobody cares.', RED) + '</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def jukebox(o, top):
    """The jukebox corner: a real lit jukebox photo on the left, the drinks as typographic title strips on the right."""
    strips = (('A1', 'Espresso &amp; anisette', '.35', 'Anisette or sambuca on the side, lemon peel.'),
              ('A2', 'Egg cream', '.20', 'Chocolate syrup, cold milk, seltzer.'),
              ('B1', 'Draft beer', '.15', ''),
              ('B2', 'Rye &amp; ginger', '.50', ''))
    def strip(c, n, p, d, fs=24):
        dd = (f'<div style="font-family: {BODY}; font-weight: 500; font-size: 18px; line-height: 1.12; color: {MUTE}">{d}</div>' if d else '')
        return (f'<div style="background: #fffaf0; box-sizing: border-box; position: relative; padding: 8px 10px 9px">'
                f'<div style="position: absolute; left: 0; top: 0; width: 100%; height: 5px; background: {RED}"></div>'
                f'<div style="position: absolute; left: 0; bottom: 0; width: 100%; height: 5px; background: {BLUE}"></div>'
                f'<div style="display: flex; justify-content: space-between; align-items: baseline; font-family: {BODY}; font-weight: 700; font-size: {fs}px; '
                f'line-height: 1.05; color: {GREEN}; text-transform: uppercase; letter-spacing: 0.01em; white-space: nowrap; gap: 8px">'
                f'<span><span style="color: {RED}; font-size: 18px; margin-right: 7px">{c}</span>{n}</span><span style="color: {RED}">{p}</span></div>{dd}</div>')
    o.append(title('The jukebox corner', 'Doo-wop. Three plays a quarter', top))
    y = top + 90
    o.append(photo('the-jukebox.jpg', 'A real 1940s jukebox lit up: glowing amber and red arch, rows of title strips, bubble tubes and a diamond grille',
                   L, y, JB_W, JB_H, GREEN))
    sx = L + JB_W + 12 + 16; sw = L + CW - sx
    o.append(f'<div style="position: absolute; left: {sx}px; top: {y}px; width: {sw}px">'
             f'<div style="box-sizing: border-box; padding: 6px; background: #0e2419; border: 3px solid #d9d4c6; border-radius: 6px; '
             f'display: grid; grid-template-columns: 1fr; row-gap: 5px">' + ''.join(strip(*x) for x in strips) + '</div>'
             f'<div style="display: flex; justify-content: flex-end; margin-top: 10px">'
             f'<div style="padding: 3px 10px; background: {RED}; font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 1.1; '
             f'letter-spacing: 0.06em; color: #fff6ea">25&cent;</div></div></div>')

def back():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {GREEN}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 12px; width: {W}px; height: 4px; background: {RED}"></div>')
    sunday = (item('Sonny&rsquo;s Sunday rigatoni', '1.87', 'Slow tomato gravy, pork and beef meatballs, tender ribs, torn basil. Ask for the JoJo portion.', 8)
              + item('Belmont cannoli', '.25', 'Crisp shells piped to order, vanilla ricotta, chocolate chips, pistachio.')
              + item('Crumb coffee cake', '.20', 'Thick slice, cinnamon streusel. Frankie&rsquo;s usual.'))
    o.append(title('Sunday at Sonny&rsquo;s', 'Every Sunday, one sitting', 40))
    o.append(f'<div style="position: absolute; left: {L}px; top: 112px; width: {CW}px">{sunday}</div>')

    o.append(photo('the-block-1964.jpg', 'A Bronx street of six-storey walk-ups, an old sedan stripped at the curb with its hood up',
                   L, 384, BLK_W, BLK_H, GREEN))
    o.append(f'<div style="position: absolute; left: {L}px; top: 658px; width: 310px; font-family: {BODY}; font-style: italic; font-weight: 500; '
             f'font-size: 18px; line-height: 1.2; color: {MUTE}">Up the block. Somebody forgot to lock it.</div>')
    doortest(o, 364, 392)
    jukebox(o, 698)
    o.append(f'<div style="position: absolute; left: {L}px; top: 1160px; width: {CW}px; display: flex; justify-content: space-between; align-items: flex-end; '
             f'font-family: {BODY}; font-weight: 500; font-size: 15px; line-height: 1.2; color: {MUTE}; transform: translateY(-100%)">'
             f'<div>No motorcycles on the sidewalk.<br>Door locks at closing. Now youse can&rsquo;t leave.</div>'
             f'<div style="text-align: right">Prices subject to change.<br>Bronx 58, N.Y. &nbsp;Form CB-1960</div></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Chez Bippy bar card, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
