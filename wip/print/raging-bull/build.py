"""Jake's Corner, the champ's supper club on Miami Beach, 1950s. Fight night program with the supper card inside.
Two faces 816x1056 (US Letter). Program stock white, black ink, one red.
Front: club sign band, hero ring still (the title night), tonight's fight films, Jake's note, ringside ticket stub.
Back: tonight's supper card billed like a fight card, stage still, club matchbook, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
PAPER, INK, RED, MUTE, CARD = '#f3f1ec', '#141414', '#c4161c', '#4d4a45', '#fbfaf7'
FONTS = ('https://fonts.googleapis.com/css2?family=Fjalla+One&family=PT+Serif:ital,wght@0,400;0,700;1,400'
         '&family=Yellowtail&display=swap')
DISP = "'Fjalla One', sans-serif"; BODY = "'PT Serif', serif"; SCRIPT = "'Yellowtail', cursive"
L, CW = 56, 704

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=10):
    """Melt the maker's name on the trunks waistband so no brand reads."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(8))
    return Image.composite(blur, im, m)

HERO_H = 404
ring = Image.open(S('uBVmi4TxFGl3A8oN9aQDmtG2A1A.jpg')).convert('L')
ring = soften(ring, [(1560, 895, 1800, 950)])
ring = ImageEnhance.Contrast(ImageEnhance.Brightness(ring).enhance(1.08)).enhance(1.06)
fit(ring, CW - 8, HERO_H, (380, 40, 2400, 1300)).convert('RGB').save(A('hero-title-night.jpg'), quality=90)

stage = Image.open(S('jGIzwwzUl1Rbb7Ag8p4pHpbfH4D.jpg')).convert('L')
stage = ImageEnhance.Brightness(stage).enhance(1.12)
fit(stage, 392, 224, (560, 120, 2894, 1560)).convert('RGB').save(A('stage-jake.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(36):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 14))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    lay = Image.new('RGBA', (W, H), (90, 70, 40, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 15); wear('back', 49)

# ---------------- type pieces ----------------
def kicker(t, color=RED, size=19, extra=''):
    return (f'<div style="font-family: {DISP}; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def item(name, price, desc, gap=16, size=28, dsize=21):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {DISP}; '
            f'font-size: {size}px; line-height: 1.1; color: {INK}; text-transform: uppercase; letter-spacing: 0.02em">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.3; color: {INK}; margin-top: 3px">{desc}</div></div>')

def billing(sub, title, size=42):
    """Fight card billing: red rounds line over the bout name, heavy double rules either side."""
    rules = (f'<div style="flex: 1; height: 10px; border-top: 4px solid {INK}; border-bottom: 1.5px solid {INK}; margin-top: 4px"></div>')
    return (f'<div style="text-align: center">{kicker(sub, size=18)}</div>'
            f'<div style="display: flex; align-items: center; gap: 18px; margin-top: 6px">{rules}'
            f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1; color: {INK}; letter-spacing: 0.04em">{title}</div>{rules}</div>')

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def ticket(o, x, y):
    """Ringside stub from the title fight, kept as a souvenir and tucked in the program."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 266px; height: 118px; background: #f6efdc; '
             f'box-shadow: 0 3px 9px rgba(0,0,0,0.45); transform: rotate(5deg); display: flex">'
             f'<div style="width: 186px; padding: 10px 10px 0 14px; box-sizing: border-box; border-right: 2px dashed #9b8f78">'
             f'<div style="font-family: {DISP}; font-size: 14px; letter-spacing: 0.16em; color: {RED}; line-height: 1">WORLD TITLE BOUT</div>'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1.05; color: {INK}; margin-top: 4px">RINGSIDE</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; line-height: 1.3; color: {INK}">Detroit, Mich., 1949<br>Row A, Seat 15</div></div>'
             f'<div style="flex: 1; text-align: center; padding-top: 12px">'
             f'<div style="font-family: {DISP}; font-size: 14px; letter-spacing: 0.1em; color: {MUTE}; line-height: 1">ADMIT ONE</div>'
             f'<div style="font-family: {DISP}; font-size: 26px; color: {RED}; line-height: 1.2; margin-top: 8px">$15</div>'
             f'<div style="font-family: {DISP}; font-size: 14px; color: {MUTE}; line-height: 1.1; margin-top: 6px">No. 1949</div></div></div>')

def matchbook(o, x, y):
    """Club matchbook, cover folded open, striker strip at the bottom."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 104px; background: {RED}; '
             f'box-shadow: 0 3px 8px rgba(0,0,0,0.42); transform: rotate(-4deg); overflow: hidden">'
             f'<div style="position: absolute; left: 0; top: 0; width: 196px; height: 82px; text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 26px; color: #fbf6ee; line-height: 1; margin-top: 10px; letter-spacing: 0.04em">JAKE\'S CORNER</div>'
             f'<div style="font-family: {DISP}; font-size: 14px; color: #fbf6ee; letter-spacing: 0.14em; line-height: 1; margin-top: 6px">MIAMI BEACH</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: #fbf6ee; line-height: 1; margin-top: 5px">JEfferson 1-1949</div></div>'
             f'<div style="position: absolute; left: 0; top: 84px; width: 196px; height: 20px; background: #2a201b"></div>'
             f'<div style="position: absolute; left: 0; top: 88px; width: 196px; height: 12px; '
             f'background: repeating-linear-gradient(90deg, #4a3a30 0 3px, #2a201b 3px 6px)"></div></div>')

# ---------------- FRONT: program cover ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 258px; background: {INK}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px">{kicker("Official program &nbsp;&middot;&nbsp; 25&cent;")}</div>')
    o.append(f'<div style="position: absolute; left: {L - 4}px; top: 68px; width: {CW + 8}px; font-family: {DISP}; font-size: 96px; '
             f'line-height: 1.08; color: {PAPER}; letter-spacing: 0.01em; white-space: nowrap">JAKE\'S CORNER</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 178px; width: 330px; height: 4px; background: {RED}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 196px; width: {CW}px; font-family: {DISP}; font-size: 25px; '
             f'line-height: 1.2; color: {PAPER}; letter-spacing: 0.12em">FIGHT NIGHT SUPPER &nbsp;&middot;&nbsp; MIAMI BEACH, FLA.</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 280px; width: {CW - 8}px; height: {HERO_H}px; border: 4px solid {INK}; '
             f'outline: 2px solid {RED}; outline-offset: 3px">'
             f'<img src="assets/hero-title-night.jpg" alt="The champion in his corner under the ring lights, both gloves raised" '
             f'style="display: block; width: {CW - 8}px; height: {HERO_H}px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 704px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 19px; '
             f'line-height: 1.3; color: {MUTE}">Detroit, 1949. The night the Bronx Bull took the title.</div>')
    ticket(o, 496, 246)

    bouts = [('1943', 'vs. Robinson', 'Detroit. Ray\'s first loss.'),
             ('1949', 'vs. Cerdan', 'Detroit. For the title.'),
             ('1950', 'vs. Dauthuille', 'Won it in the 15th.'),
             ('1951', 'vs. Robinson', 'Never got him down.')]
    rows = ''
    for y, v, n in bouts:
        rows += (f'<div style="display: flex; align-items: baseline; gap: 14px; margin-top: 11px; border-top: 1px solid rgba(20,20,20,0.35); padding-top: 9px">'
                 f'<div style="width: 58px; font-family: {DISP}; font-size: 26px; color: {RED}; line-height: 1">{y}</div>'
                 f'<div style="font-family: {DISP}; font-size: 24px; color: {INK}; line-height: 1; text-transform: uppercase; white-space: nowrap">{v}</div>'
                 f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {INK}; line-height: 1.15">{n}</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 752px; width: 440px">'
             f'{kicker("On the screen tonight")}'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.05; color: {INK}; margin-top: 6px">THE CHAMP\'S FIGHT FILMS</div>'
             f'{rows}</div>')
    belt(o, 512, 770)
    o.append(f'<div style="position: absolute; left: 512px; top: 912px; width: 248px; text-align: center">'
             f'{kicker("Over the bar", size=17)}'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {INK}; margin-top: 6px">'
             'The belt, every jewel still on it. Look, don\'t touch.</div></div>')
    return page(''.join(o), 'front')

def belt(o, x, y):
    """The middleweight title belt, drawn as leather strap, two side plates with red stones and a big centre plate."""
    w = 248
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: 130px">'
             f'<div style="position: absolute; left: 0; top: 38px; width: {w}px; height: 56px; border-radius: 10px; '
             f'background: linear-gradient(180deg, #2b2b2b, #0e0e0e 55%, #222); box-shadow: 0 3px 8px rgba(0,0,0,0.4)">'
             f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 1.5px dashed #7a7a7a; border-radius: 7px"></div></div>'
             + ''.join(f'<div style="position: absolute; left: {px}px; top: 44px; width: 38px; height: 44px; border-radius: 6px; border: 2px solid #111; '
                       f'background: linear-gradient(160deg, #ffffff, #c9c6bf 60%, #9d9a93)">'
                       f'<div style="position: absolute; left: 11px; top: 13px; width: 13px; height: 13px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #ff7b7f, {RED} 60%, #6d0a0e)"></div></div>'
                       for px in (14, 54, w - 92, w - 52)) +
             f'<div style="position: absolute; left: {w // 2 - 62}px; top: 0; width: 124px; height: 130px; border-radius: 50%; border: 3px solid #111; '
             f'background: radial-gradient(circle at 40% 35%, #ffffff, #d6d3cc 55%, #a29f98); box-shadow: 0 3px 8px rgba(0,0,0,0.4)">'
             f'<div style="position: absolute; left: 7px; top: 7px; width: 104px; height: 110px; border-radius: 50%; border: 3px solid {RED}"></div>'
             f'<div style="position: absolute; left: 0; top: 30px; width: 124px; text-align: center; font-family: {DISP}; color: {INK}; line-height: 1">'
             f'<div style="font-size: 14px; letter-spacing: 0.12em">WORLD</div>'
             f'<div style="font-size: 16px; color: {RED}; margin-top: 4px">MIDDLEWEIGHT</div>'
             f'<div style="font-size: 18px; margin-top: 3px">CHAMPION</div>'
             f'<div style="font-size: 14px; letter-spacing: 0.12em; margin-top: 4px">1949</div></div></div></div>')

# ---------------- BACK: the supper card ----------------
def back():
    o = []
    # the act: Jake's nightclub show, a full-width marquee panel
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; height: 244px; background: {INK}; border: 2px solid {RED}; box-sizing: border-box">'
             f'<div style="position: absolute; left: 22px; top: 22px; width: 260px">{kicker("On stage at eleven")}'
             f'<div style="font-family: {DISP}; font-size: 50px; line-height: 1.02; color: {PAPER}; margin-top: 12px">THE CHAMP<br>ON THE MIKE</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: #d9d6cf; margin-top: 10px">'
             'Heckle at your own risk.</div></div>'
             f'<img src="assets/stage-jake.jpg" alt="Jake on a stool at the microphone in a white dinner jacket, the bass player laughing behind him" '
             f'style="position: absolute; right: 8px; top: 8px; display: block; width: 392px; height: 224px"></div>')
    o.append(f'<div style="position: absolute; left: {L + 24}px; top: 222px; font-family: {SCRIPT}; font-size: 38px; line-height: 1; color: {RED}">Jake</div>')

    prelim = (billing('Tonight\'s supper card &middot; four rounds', 'PRELIMINARIES')
              + item('Bronx deviled eggs', '.85', 'Whipped yolks with Dijon, crisp pancetta, smoked paprika, chives.', 12)
              + item('Shrimp cocktail on ice', '1.60', 'Poached and chilled, sharp tomato horseradish sauce, lemon.', 12))
    o.append(f'<div style="position: absolute; left: {L}px; top: 312px; width: {CW}px">{prelim}</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 528px; width: {CW}px; height: 214px; box-sizing: border-box; border: 4px solid {RED}; background: {CARD}">'
             f'<div style="background: {INK}; height: 50px; display: flex; justify-content: space-between; align-items: center; padding: 0 18px">'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1; color: {PAPER}; letter-spacing: 0.04em">MAIN EVENT</div>'
             f'<div style="font-family: {DISP}; font-size: 19px; letter-spacing: 0.22em; color: {PAPER}">FIFTEEN ROUNDS</div></div>'
             f'<div style="position: absolute; left: 18px; top: 50px; width: 440px">'
             + item('The champ\'s porterhouse', '6.49', 'For two. Salted overnight, seared hard, basted in butter, garlic and thyme, carved off the bone.', 10, 30, 20)
             + f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.3; color: {MUTE}; margin-top: 6px; font-style: italic">'
               'In his corner: hashed browns .50 &middot; creamed spinach .50</div></div>'
             f'<div style="position: absolute; left: 482px; top: 64px; width: 192px; border: 4px solid {RED}; padding: 8px 0 8px; text-align: center; '
             f'transform: rotate(-5deg); background: {CARD}">'
             f'<div style="font-family: {DISP}; font-size: 42px; line-height: 0.98; color: {RED}">NEVER<br>OVERCOOKED</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {INK}; margin-top: 6px">Overcook it, it defeats<br>the purpose.</div></div></div>')

    def corner(sub, title, body, x):
        return (f'<div style="position: absolute; left: {x}px; top: 756px; width: 336px">'
                f'{kicker(sub, size=17)}'
                f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.05; color: {INK}; margin-top: 4px; '
                f'border-bottom: 4px solid {INK}; padding-bottom: 4px">{title}</div>{body}</div>')
    o.append(corner('No weigh-in tonight', 'AFTER THE BELL',
                    item('Ricotta cheesecake', '.65', 'Lemon, vanilla, powdered sugar.', 10, 26, 20)
                    + item('Spumoni', '.50', 'Cherry, pistachio, chocolate.', 10, 26, 20), L))
    o.append(corner('At the bar', 'IN THE CLUBHOUSE',
                    item('Poolside rum punch', '.90', 'Golden rum, orange, pineapple, lime and grenadine on crushed ice.', 10, 26, 20)
                    + item('Rye highball', '.85', 'Rye and ginger ale, tall.', 10, 26, 20), L + 368))

    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             'Coffee or espresso .15. Prices subject to change. Form 15-R. Miami Beach, Fla.</div>')
    matchbook(o, 566, 192)
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Jake\'s Corner menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
