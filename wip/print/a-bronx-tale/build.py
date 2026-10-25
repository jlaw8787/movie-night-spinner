"""Chez Bippy, Sonny's bar on 187th Street and Belmont Avenue, the Bronx, 1960.
A tall neighbourhood bar card, two faces 600x1200 (6.25 x 12.5 in), the kind propped between the napkins and the ashtray.
Ivory card, bottle green, neon red, sign gold.
Front: the green sign band with the name lit up like the window neon, the fellas out front (TMDB still), Lorenzo's bus transfer,
       the bar kitchen, and the complaints department.
Back:  Sunday at Sonny's table, the block (1964 Macombs Road photo, LoC, public domain) with the door test card,
       the jukebox corner (drinks as title strips), Sonny's note, house rules.
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

def soften(im, boxes, r=9):
    """Melt signs and badges so no brand reads."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(6))
    return Image.composite(blur, im, m)

HERO_W, HERO_H = CW - 12, 300
crew = Image.open(S('o-8yLnJvxQErHIJoBEu93cv8H44ho.jpg')).convert('RGB')
crew = soften(crew, [(500, 100, 588, 178), (672, 100, 712, 165), (400, 180, 470, 270)], 10)   # beer neon in the window, kept off faces
crew = ImageEnhance.Brightness(crew).enhance(1.08)
fit(crew, HERO_W, HERO_H, (40, 0, 1282, 720)).save(A('the-fellas-out-front.jpg'), quality=90)

BLK_W, BLK_H = CW - 12, 310
blk = Image.open(S('macombs.tif')).convert('L')
blk = soften(blk.convert('RGB'), [(3380, 3380, 3700, 3560)], 14).convert('L')   # hood badge
blk = blk.crop((330, 2300, 4830, 6060))
blk = ImageOps.autocontrast(blk, cutoff=0.6)
blk = ImageEnhance.Brightness(blk).enhance(1.06)
# warm silver print, not a heavy tint
blk = ImageOps.colorize(blk, black='#1b1a17', white='#fbf6ea', mid='#8a8577')
fit(blk, BLK_W, BLK_H).save(A('the-block-1964.jpg'), quality=90)

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
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 262px; background: {CARD}; box-sizing: border-box; '
             f'border: 2px solid {GREEN}; outline: 4px solid {CARD}; box-shadow: 0 4px 12px rgba(0,0,0,0.42); transform: rotate(-4deg); padding: 10px 14px 10px">'
             f'<div style="display: flex; align-items: center; gap: 10px">'
             # the door lock button, drawn big: chrome knob on a sill
             f'<div style="position: relative; width: 34px; height: 46px; flex: none">'
             f'<div style="position: absolute; left: 11px; top: 0; width: 12px; height: 34px; border-radius: 6px 6px 2px 2px; background: #c9c3b4; border: 2px solid {GREEN}; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 0; top: 32px; width: 34px; height: 10px; border-radius: 3px; background: {GREEN}"></div></div>'
             f'<div>{kicker("Sonny&rsquo;s rule", RED, 15)}'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 27px; line-height: 1; color: {GREEN}; margin-top: 3px; letter-spacing: 0.03em">THE DOOR TEST</div></div></div>'
             f'<div style="font-family: {BODY}; font-weight: 500; font-size: 18px; line-height: 1.22; color: {GREEN}; margin-top: 7px">'
             f'Open her door. Walk around. If she doesn&rsquo;t reach over and lift your lock, she&rsquo;s selfish.</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.14em; color: {RED}; margin-top: 6px">PASS / FAIL</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    # the sign band: green, gold kicker, the name lit like the window neon
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 236px; background: {GREEN}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 236px; width: {W}px; height: 6px; background: {RED}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 246px; width: {W}px; height: 2px; background: {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 40px; width: {CW}px; text-align: center">'
             f'{kicker("187th Street &amp; Belmont Ave. &nbsp;The Bronx", GOLD, 18)}'
             f'<div style="font-family: {DISP}; font-size: 112px; line-height: 1.05; color: #fff1dc; margin-top: 4px; '
             f'text-shadow: 0 0 6px {RED}, 0 0 16px {RED}, 0 0 28px rgba(196,47,39,0.7)">Chez Bippy</div>'
             f'<div style="display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: 6px">'
             f'<div style="width: 50px; height: 2px; background: {GOLD}"></div>'
             f'{kicker("Bar &amp; Kitchen &nbsp;Cash only", GOLD, 17)}'
             f'<div style="width: 50px; height: 2px; background: {GOLD}"></div></div></div>')

    o.append(photo('the-fellas-out-front.jpg', 'Sonny and the fellas standing in a row outside the Chez Bippy window, hats in hand',
                   L, 272, HERO_W, HERO_H))
    o.append(f'<div style="position: absolute; left: {L}px; top: 590px; width: 290px; font-family: {BODY}; font-style: italic; font-weight: 500; '
             f'font-size: 19px; line-height: 1.22; color: {MUTE}">The fellas, out front on 187th Street.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 628px; width: 286px">'
             f'{kicker("A word from the owner", RED, 17)}'
             f'<div style="font-family: {BODY}; font-weight: 500; font-size: 20px; line-height: 1.2; color: {GREEN}; margin-top: 5px">'
             f'Eat, have a drink, leave the dice alone. Eddie, that means you.</div>'
             f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1; color: {GREEN}; margin-top: 2px">Sonny</div></div>')
    transfer(o, 328, 588)

    bar = (item('Fried stuffed olives', '.60', 'Big green olives packed with sharp provolone, crackling crumb, lemon garlic mayonnaise, a pinch of chili.', 10)
           + item('Garlic knots', '.40', 'Hot from the oven, brushed with butter, parsley and grated parmesan.')
           + item('Sausage &amp; peppers hero', '.75', 'Sweet fennel links, soft onions, green peppers, seeded roll.'))
    o.append(title('From the bar', 'Kitchen till midnight', 744))
    o.append(f'<div style="position: absolute; left: {L}px; top: 806px; width: {CW}px">{bar}</div>')

    # the boy between two fathers: one line from the bus, one from the bar
    def say(k, line, who, color):
        return (f'<div style="width: 248px">{kicker(k, RED, 16, " white-space: nowrap;")}'
                f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1.02; color: {color}; margin-top: 6px">{line}</div>'
                '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1046px; width: {CW}px; border-top: 1px solid rgba(23,59,44,0.35); padding-top: 12px; '
             f'display: flex; justify-content: space-between">'
             + say('Heard on the bus', 'Don&rsquo;t waste your talent.', '', BLUE)
             + f'<div style="width: 1px; background: rgba(23,59,44,0.35)"></div>'
             + say('Heard at the bar', 'Mantle? Nobody cares.', '', RED) + '</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def jukebox(o, top):
    """The jukebox corner: drinks printed as title strips, the way the box shows its records."""
    strips = (('A1', 'Espresso &amp; anisette', '.35', 'Short black coffee, anisette or sambuca on the side, lemon peel.'),
              ('A2', 'Egg cream', '.20', 'Chocolate syrup, cold milk, seltzer, stirred hard.'),
              ('B1', 'Draft beer', '.15', ''),
              ('B2', 'Rye &amp; ginger', '.50', ''))
    def strip(c, n, p, d):
        dd = (f'<div style="font-family: {BODY}; font-weight: 500; font-size: 18px; line-height: 1.15; color: {MUTE}; margin-top: 1px">{d}</div>' if d else '')
        return (f'<div style="background: #fffaf0; border: 1.5px solid {GREEN}; box-sizing: border-box; position: relative; padding: 9px 12px 11px">'
                f'<div style="position: absolute; left: 0; top: 0; width: 100%; height: 5px; background: {RED}"></div>'
                f'<div style="position: absolute; left: 0; bottom: 0; width: 100%; height: 5px; background: {BLUE}"></div>'
                f'<div style="display: flex; justify-content: space-between; align-items: baseline; font-family: {BODY}; font-weight: 700; font-size: 26px; '
                f'line-height: 1.05; color: {GREEN}; text-transform: uppercase; letter-spacing: 0.02em">'
                f'<span><span style="color: {RED}; font-size: 19px; letter-spacing: 0.06em; margin-right: 10px">{c}</span>{n}</span><span style="color: {RED}">{p}</span></div>{dd}</div>')
    full = ''.join(strip(*s) for s in strips[:2])
    half = ''.join(strip(*s) for s in strips[2:])
    o.append(f'<div style="position: absolute; left: {L}px; top: {top}px; width: {CW}px; box-sizing: border-box; background: {GREEN}; '
             f'border-radius: 120px 120px 10px 10px; padding: 20px 16px 16px">'
             f'<div style="text-align: center">{kicker("Doo-wop on the box. Three plays a quarter", GOLD, 16)}'
             f'<div style="font-family: {DISP}; font-size: 50px; line-height: 1; color: #fff1dc; margin-top: 2px; '
             f'text-shadow: 0 0 6px {RED}, 0 0 14px rgba(196,47,39,0.7)">The jukebox corner</div></div>'
             f'<div style="display: grid; grid-template-columns: 1fr; row-gap: 7px; margin-top: 10px">{full}'
             f'<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 7px">{half}</div></div>'
             f'</div>')

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
                   L, 356, BLK_W, BLK_H, GREEN))
    o.append(f'<div style="position: absolute; left: 330px; top: 690px; width: 230px; text-align: right; font-family: {BODY}; font-style: italic; font-weight: 500; '
             f'font-size: 18px; line-height: 1.2; color: {MUTE}">Up the block. Somebody forgot to lock it.</div>')
    doortest(o, 30, 588)
    jukebox(o, 772)
    o.append(f'<div style="position: absolute; left: {L}px; top: 1120px; width: {CW}px; display: flex; justify-content: space-between; align-items: flex-end; '
             f'font-family: {BODY}; font-weight: 500; font-size: 16px; line-height: 1.25; color: {MUTE}">'
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
