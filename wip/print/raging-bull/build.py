"""Jake's Corner, the champ's supper club on Miami Beach, 1956. Fight night program with the supper card inside.
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
fit(stage, 316, 196, (560, 120, 2894, 1560)).convert('RGB').save(A('stage-jake.jpg'), quality=90)

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
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 250px; height: 118px; background: #f6efdc; '
             f'box-shadow: 0 3px 9px rgba(0,0,0,0.45); transform: rotate(5deg); display: flex">'
             f'<div style="width: 176px; padding: 9px 10px 0 12px; box-sizing: border-box; border-right: 2px dashed #9b8f78">'
             f'<div style="font-family: {DISP}; font-size: 14px; letter-spacing: 0.16em; color: {RED}; line-height: 1">WORLD CHAMPIONSHIP</div>'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1.05; color: {INK}; margin-top: 4px">RINGSIDE</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; line-height: 1.3; color: {INK}">Detroit, Mich. 1949<br>Sec. 1, Row A, Seat 15</div></div>'
             f'<div style="flex: 1; text-align: center; padding-top: 12px">'
             f'<div style="font-family: {DISP}; font-size: 14px; letter-spacing: 0.1em; color: {MUTE}; line-height: 1">ADMIT ONE</div>'
             f'<div style="font-family: {DISP}; font-size: 26px; color: {RED}; line-height: 1.2; margin-top: 8px">$15</div>'
             f'<div style="font-family: {DISP}; font-size: 14px; color: {MUTE}; line-height: 1.1; margin-top: 6px">No. 1949</div></div></div>')

def matchbook(o, x, y):
    """Club matchbook, cover folded open, striker strip at the bottom."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 92px; background: {RED}; '
             f'box-shadow: 0 3px 8px rgba(0,0,0,0.42); transform: rotate(-4deg); overflow: hidden">'
             f'<div style="position: absolute; left: 0; top: 0; width: 196px; height: 70px; text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 26px; color: #fbf6ee; line-height: 1; margin-top: 10px; letter-spacing: 0.04em">JAKE\'S CORNER</div>'
             f'<div style="font-family: {DISP}; font-size: 14px; color: #fbf6ee; letter-spacing: 0.14em; line-height: 1; margin-top: 6px">MIAMI BEACH</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: #fbf6ee; line-height: 1; margin-top: 5px">JEfferson 1-1949</div></div>'
             f'<div style="position: absolute; left: 0; top: 72px; width: 196px; height: 20px; background: #2a201b"></div>'
             f'<div style="position: absolute; left: 0; top: 76px; width: 196px; height: 12px; '
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
    ticket(o, 548, 218)

    bouts = [('1943', 'vs. Robinson', 'New York. Ray\'s first loss.'),
             ('1947', 'vs. Janiro', 'He wasn\'t pretty no more.'),
             ('1949', 'vs. Cerdan', 'Detroit. For the title.'),
             ('1951', 'vs. Robinson', 'Chicago. Never got him down.')]
    rows = ''
    for y, v, n in bouts:
        rows += (f'<div style="display: flex; align-items: baseline; gap: 14px; margin-top: 11px; border-top: 1px solid rgba(20,20,20,0.35); padding-top: 9px">'
                 f'<div style="width: 58px; font-family: {DISP}; font-size: 26px; color: {RED}; line-height: 1">{y}</div>'
                 f'<div style="font-family: {DISP}; font-size: 24px; color: {INK}; line-height: 1; text-transform: uppercase; white-space: nowrap">{v}</div>'
                 f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {INK}; line-height: 1.15">{n}</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 752px; width: 432px">'
             f'{kicker("On the screen tonight")}'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.05; color: {INK}; margin-top: 6px">THE CHAMP\'S FIGHT FILMS</div>'
             f'{rows}</div>')

    o.append(f'<div style="position: absolute; left: 516px; top: 752px; width: 244px; box-sizing: border-box; background: {CARD}; '
             f'border: 2px solid {INK}; padding: 14px 16px 6px; box-shadow: 4px 4px 0 {RED}">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.36; color: {INK}">'
             'Pull up a chair by the ring. Eat a good steak, watch the old fights with me, then I tell a few on the stage at eleven.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 40px; line-height: 1.15; color: {RED}; text-align: right; margin-top: 2px">Jake</div></div>')
    return page(''.join(o), 'front')

# ---------------- BACK: the supper card ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: 360px">{kicker("Jake\'s Corner &middot; Miami Beach")}'
             f'<div style="font-family: {DISP}; font-size: 68px; line-height: 1.0; color: {INK}; margin-top: 12px">TONIGHT\'S<br>'
             f'<span style="color: {RED}">SUPPER CARD</span></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}; margin-top: 12px">'
             'The champ on the mike, Saturday nights at eleven.</div></div>')
    o.append(f'<div style="position: absolute; left: 436px; top: 44px; border: 4px solid {INK}; outline: 2px solid {RED}; outline-offset: 3px">'
             f'<img src="assets/stage-jake.jpg" alt="Jake on a stool at the microphone in a white dinner jacket, the bass player laughing behind him" '
             f'style="display: block; width: 316px; height: 196px"></div>')

    prelim = (billing('Four rounds', 'PRELIMINARIES')
              + item('Bronx deviled eggs', '.85', 'Yolks whipped with mayonnaise, Dijon and a dash of vinegar, crisp pancetta, smoked paprika, chives.', 14)
              + item('Shrimp cocktail on ice', '1.60', 'Poached and chilled, with sharp tomato and horseradish sauce and lemon wedges.', 14))
    o.append(f'<div style="position: absolute; left: {L}px; top: 272px; width: {CW}px">{prelim}</div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 504px; width: {CW}px; box-sizing: border-box; border: 4px solid {RED}; background: {CARD}">'
             f'<div style="background: {INK}; height: 50px; display: flex; justify-content: space-between; align-items: center; padding: 0 18px">'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1; color: {PAPER}; letter-spacing: 0.04em">MAIN EVENT</div>'
             f'<div style="font-family: {DISP}; font-size: 19px; letter-spacing: 0.22em; color: {PAPER}">FIFTEEN ROUNDS</div></div>'
             f'<div style="padding: 0 18px 14px">'
             + item('The champ\'s porterhouse for two', '6.49', 'Salted the night before, seared hard in a smoking pan, basted with butter, garlic and thyme. Carved off the bone. Never overcooked.', 12, 30)
             + f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {MUTE}; margin-top: 8px; font-style: italic">'
               'In his corner: hashed brown potatoes .50 &nbsp;&middot;&nbsp; creamed spinach .50</div></div></div>')

    def corner(sub, title, body, x):
        return (f'<div style="position: absolute; left: {x}px; top: 718px; width: 336px">'
                f'{kicker(sub, size=18)}'
                f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.05; color: {INK}; margin-top: 6px; '
                f'border-bottom: 4px solid {INK}; padding-bottom: 6px">{title}</div>{body}</div>')
    o.append(corner('No weigh-in tonight', 'AFTER THE BELL',
                    item('Ricotta cheesecake', '.65', 'Baked with lemon and vanilla, dusted with powdered sugar.', 12, 26, 20)
                    + item('Spumoni', '.50', 'Cherry, pistachio and chocolate in one slice.', 12, 26, 20), L))
    o.append(corner('At the bar', 'IN THE CLUBHOUSE',
                    item('Poolside rum punch', '.90', 'Golden rum, orange, pineapple, lime and grenadine on crushed ice.', 12, 26, 20)
                    + item('Rye highball', '.85', 'Rye and ginger ale, tall, over ice.', 12, 26, 20), L + 368))

    o.append(f'<div style="position: absolute; left: {L}px; top: 948px; width: 440px; font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {MUTE}">'
             'Coffee or espresso .15. Prices subject to change. Positively no minors served. Program form 15-R. Printed in Miami, Fla., 1956.</div>')
    matchbook(o, 556, 930)
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Jake\'s Corner menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
