"""The Green Light, a Beverly Hills power-lunch grill, 1995. Where Chili pitches movies over lunch.
Format: tall slim power-lunch card, two faces 528x1344 (5.5 x 14 in). Mint card stock, black ink, sunset coral.
Signature: a real public domain palm-lined Los Angeles street photo (Carol M. Highsmith, LOC) with the TMDB lunch still set into it.
Front: sign band, palm street hero with lunch still, valet ticket (the minivan), LOOK AT ME house rule with the Bloody Mary, opening scene.
Back: booth still, second act, Chili's napkin pitch, Harry Zimm's card, the ending, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 528, 1344
PAPER, INK, CORAL, MUTE, CARD = '#e3ede4', '#151515', '#e0533a', '#4a524c', '#fbfaf6'
FONTS = ('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700'
         '&family=DM+Sans:ital,wght@0,400;0,700;1,400&family=Reenie+Beanie&display=swap')
DISP = "'Syncopate', sans-serif"; BODY = "'DM Sans', sans-serif"; HAND = "'Reenie Beanie', cursive"
L, CW = 40, 448

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

HERO_H = 452
palms = Image.open(S('pd-palm-lined-la.jpg')).convert('RGB')
palms = ImageEnhance.Color(ImageEnhance.Brightness(palms).enhance(1.05)).enhance(1.08)
fit(palms, W, HERO_H, (260, 0, 3140, 2430)).save(A('palms-out-front.jpg'), quality=88)

lunch = Image.open(S('7mbBY0I99nLegO8rcmdLKSU8y28.jpg')).convert('RGB')
lunch = ImageEnhance.Brightness(lunch).enhance(1.06)
fit(lunch, 292, 168, (0, 0, 1920, 1080)).save(A('lunch-pitch.jpg'), quality=90)

booth = Image.open(S('noN7a2cxhMBAX303m7isGBwgxbs.jpg')).convert('RGB')
booth = ImageEnhance.Brightness(booth).enhance(1.08)
fit(booth, CW - 8, 212, (0, 40, 1920, 1000)).save(A('booth-chili.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(60 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), (70, 80, 60, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.45)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 19); wear('back', 95)

# ---------------- type pieces ----------------
def kicker(t, color=CORAL, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def item(name, price, desc, note='', gap=18, ink=INK, size=26, dsize=20, ncol=CORAL):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.25; color: {ncol}; margin-top: 4px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.12; color: {ink}">'
            f'<span>{name}</span><span>{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.3; color: {ink}; margin-top: 4px">{desc}</div>{n}</div>')

def scene(sub, title, size=34):
    """Section head written like a script slug: coral kicker, wide caps title, short black clapper bar."""
    return (f'{kicker(sub)}'
            f'<div style="font-family: {DISP}; font-weight: 700; font-size: {size}px; line-height: 1.1; color: {INK}; margin-top: 8px; '
            f'letter-spacing: 0.02em; white-space: nowrap">{title}</div>'
            f'<div style="display: flex; gap: 0; margin-top: 10px; height: 8px">'
            + ''.join(f'<div style="width: 28px; height: 8px; background: {INK if i % 2 == 0 else PAPER}"></div>' for i in range(6))
            + f'<div style="flex: 1; height: 2px; background: {INK}; margin-top: 3px"></div></div>')

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.2">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def valet(o, x, y):
    """Valet stub: he reserved a luxury car, the lot gave him a minivan."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 176px; background: #fff7d6; '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.45); transform: rotate(6deg); text-align: center; padding: 10px 10px 12px; box-sizing: border-box">'
             f'<div style="position: absolute; left: 0; top: 0; width: 176px; height: 9px; background: {CORAL}"></div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 22px; letter-spacing: 0.06em; color: {INK}; line-height: 1; margin-top: 8px">VALET</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: {MUTE}; line-height: 1; margin-top: 5px">No. 0300 &middot; Space 5</div>'
             f'<div style="border-top: 1.5px dashed #9c947c; margin: 8px 0 7px"></div>'
             f'<div style="font-family: {BODY}; font-size: 15px; color: {INK}; line-height: 1.3; text-align: left">Asked for: <b>sedan</b><br>Got: <b>minivan</b></div>'
             f'<div style="font-family: {HAND}; font-size: 25px; color: #22379a; line-height: 0.95; margin-top: 6px">&ldquo;The limousine<br>of minivans.&rdquo;</div></div>')

def napkin(o, x, y):
    """Square cocktail napkin, embossed border, with Chili's pitch in ballpoint."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 250px; height: 222px; background: #fdfdfb; '
             f'box-shadow: 0 4px 12px rgba(0,0,0,0.32); transform: rotate(-4deg)">'
             f'<div style="position: absolute; left: 9px; top: 9px; right: 9px; bottom: 9px; border: 1.5px solid #dcdcd6"></div>'
             f'<div style="position: absolute; left: 14px; top: 14px; right: 14px; bottom: 14px; border: 1px dotted #cfcfc8"></div>'
             f'<div style="position: absolute; left: 0; top: 24px; width: 250px; text-align: center; font-family: {DISP}; font-weight: 700; '
             f'font-size: 14px; letter-spacing: 0.12em; color: {CORAL}">THE GREEN LIGHT</div>'
             f'<div style="position: absolute; left: 26px; top: 48px; width: 210px; font-family: {HAND}; font-size: 23px; line-height: 1.05; color: #22379a">'
             'Loan shark, Miami.<br>Comes to L.A. to collect.<br>Dry cleaner faked his<br>death. Plane crash.<br>'
             'Ending? Working on it.</div>'
             f'<div style="position: absolute; left: 140px; top: 172px; font-family: {HAND}; font-size: 30px; line-height: 1; color: #22379a">Chili P.</div></div>')

def card(o, x, y):
    """Harry Zimm's business card, slipped in the menu after lunch."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 214px; height: 142px; background: {CARD}; '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.38); transform: rotate(5deg); box-sizing: border-box; padding: 12px 14px; border-top: 6px solid {INK}">'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 16px; letter-spacing: 0.04em; color: {INK}; line-height: 1.1">HARRY ZIMM</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; color: {CORAL}; line-height: 1; margin-top: 5px">PRODUCTIONS</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {INK}; line-height: 1.3; margin-top: 8px">Motion pictures<br>'
             f'In development:<br><b>Mr. Lovejoy</b></div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {MUTE}; line-height: 1; margin-top: 4px">(310) 555-0195</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 196px; background: {INK}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 42px; width: {CW}px">{kicker("Where the pictures get made")}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 72px; width: {CW + 4}px; font-family: {DISP}; font-weight: 700; font-size: 40px; '
             f'line-height: 1.12; color: {PAPER}; letter-spacing: 0.01em">THE GREEN<br>LIGHT</div>')
    o.append(f'<div style="position: absolute; left: 254px; top: 126px; width: 46px; height: 46px; border-radius: 50%; background: #3fbf6f; '
             f'box-shadow: 0 0 0 4px #1f3a2a"></div>')
    o.append(f'<div style="position: absolute; left: 318px; top: 128px; width: 170px; font-family: {BODY}; font-weight: 700; font-size: 16px; '
             f'line-height: 1.35; letter-spacing: 0.1em; color: {PAPER}">BEVERLY HILLS<br>LUNCH 12 TO 3</div>')

    o.append(f'<div style="position: absolute; left: 0; top: 196px; width: {W}px; height: {HERO_H}px; border-bottom: 5px solid {CORAL}; box-sizing: content-box">'
             f'<img src="assets/palms-out-front.jpg" alt="A wide street lined with tall palms on both sides under a pale sky" '
             f'style="display: block; width: {W}px; height: {HERO_H}px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 548px; width: 300px; height: 176px; background: {CARD}; '
             f'box-shadow: 0 5px 14px rgba(0,0,0,0.42); border: 2px solid {CORAL}; box-sizing: border-box">'
             f'<img src="assets/lunch-pitch.jpg" alt="Chili and Karen at a lunch table, leaning in to hear a pitch" '
             f'style="position: absolute; left: 2px; top: 2px; display: block; width: 292px; height: 168px"></div>')
    o.append(f'<div style="position: absolute; left: 356px; top: 664px; width: 132px; font-family: {BODY}; font-style: italic; font-size: 16px; '
             f'line-height: 1.3; color: {MUTE}">Table 5, out on the palm side. Pitches all day.</div>')
    valet(o, 300, 226)

    o.append(f'<div style="position: absolute; left: {L}px; top: 752px; width: {CW}px; background: {INK}; box-sizing: border-box; padding: 18px 22px 20px">'
             f'{kicker("House rule no. 1")}'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 44px; line-height: 1.05; color: {PAPER}; margin-top: 12px; white-space: nowrap">LOOK AT ME.</div>'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.35; color: #c9d3cb; margin-top: 8px">Your waiter looks you in the eye. You do the same. That is how we take an order here.</div>'
             f'<div style="height: 1px; background: #5b625d; margin-top: 14px"></div>'
             + item('Look-at-me Bloody Mary', '6.50', 'Vodka, tomato, lemon, a little heat, a celery stick.', '', 12, PAPER, 24, 18) +
             '</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 1012px; width: {CW}px">{scene("Before the meeting", "OPENING SCENE")}'
             + item('Miami ham croquetas', '8.00', 'Crisp crumb jacket, creamy center, nutmeg.', 'Mind the jacket. Ask Ray Bones.', 16)
             + item('Guava pastelitos', '6.00', 'Puff pastry, guava paste, cream cheese, sugar.', '', 16)
             + '</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {CORAL}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 22px; color: {INK}; letter-spacing: 0.02em">THE GREEN LIGHT</div>'
             f'{kicker("Lunch", size=18)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 84px; width: {CW - 8}px; height: 212px; border: 4px solid {INK}">'
             f'<img src="assets/booth-chili.jpg" alt="Chili Palmer in a black jacket, settled back in a restaurant booth" '
             f'style="display: block; width: {CW - 8}px; height: 212px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 308px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 16px; '
             f'line-height: 1.3; color: {MUTE}">The back booth. Face the room, let them come to you.</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 344px; width: {CW}px">{scene("The deal gets made", "SECOND ACT")}'
             + item('Chili&rsquo;s steak frites', '24.00', 'Sirloin seared hard, red wine and shallot butter, double-fried frites.', 'He knows how this scene goes.', 16)
             + item('Turnaround club', '14.50', 'Roast turkey, crisp bacon, avocado, tomato and lettuce on three decks of toasted sourdough.', 'In development since noon.', 16)
             + '</div>')

    napkin(o, 38, 704)
    card(o, 280, 722)
    o.append(f'<div style="position: absolute; left: 296px; top: 882px; width: 192px; font-family: {BODY}; font-style: italic; font-size: 16px; '
             f'line-height: 1.3; color: {MUTE}">Left on table 5 after lunch. We kept them.</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 942px; width: {CW}px">{scene("Roll credits", "THE ENDING")}'
             + item('B-movie popcorn sundae', '5.00', 'Vanilla ice cream, hot fudge, caramel corn, salted peanuts.', 'Half a million cheaper than a script.', 14)
             + item('Cuban coffee', '2.00', 'Short, sweet and strong, the Miami way.', '', 14)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1252px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {MUTE}">'
             'Prices subject to change. Ransom notes pay best. '
             'Mr. Weir sits in booth 1; never mention his height. Form GL-300. 1995.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Green Light menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
