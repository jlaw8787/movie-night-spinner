"""The Hotel Wexford, Grand Ballroom, New York, 1999. Slim banquet table card for the big meeting of the families,
with the menu arranged by the acting consigliere, Dr. Ben Sobel, as a therapy session.
Two faces 408x1056 (4.25 x 11 in table card). Celadon card stock, oxblood ink, antique gold.
Front: hotel band, Vitti on the couch (signature still), cocktail hour, Sobel's note, his appointment card.
Back: the session menu, "you're good" badge, hug cut-out, hit-the-pillow tag, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 408, 1056
PAPER, INK, GOLD, MUTE, CARD = '#e3e8d6', '#4a1418', '#a8832f', '#5b4a44', '#fbfaf5'
FONTS = ('https://fonts.googleapis.com/css2?family=Chango&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600'
         '&family=Allura&display=swap')
DISP = "'Chango', serif"; BODY = "'Crimson Pro', serif"; SCRIPT = "'Allura', cursive"
L, CW = 40, 328

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

HERO_H = 340
couch = Image.open(S('an58YOHXRHzAN9E5IjEfuAzfjeQ.jpg')).convert('RGB')
couch = ImageEnhance.Brightness(couch).enhance(1.06)
fit(couch, W, HERO_H, (60, 0, 2240, 2160)).save(A('hero-couch.jpg'), quality=90)

# the hug, white studio ground turned into the card stock so it sits on the paper as a cut-out
hug = Image.open(S('k8V1VfebAwSSNrDypupZ22eLT6U.jpg')).convert('RGB').crop((1130, 30, 1920, 1080))
HW, HH = 176, 234
hug = hug.resize((HW * 2, HH * 2), Image.LANCZOS)
g = hug.convert('L')
mask = g.point(lambda v: 0 if v > 236 else 255).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(2))
cut = Image.new('RGBA', hug.size, (0, 0, 0, 0)); cut.paste(hug, (0, 0), mask)
fade = Image.linear_gradient('L').rotate(90).resize((60, hug.size[1]))
edge = Image.new('L', hug.size, 255); edge.paste(fade, (0, 0))
cut.putalpha(ImageChops.multiply(cut.getchannel('A'), edge))
cut.save(A('hug-cutout.png'))

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(26):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(60 - i * 2.3)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))
    lay = Image.new('RGBA', (W, H), (70, 60, 30, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 19); wear('back', 99)

# ---------------- type pieces ----------------
def kicker(t, color=GOLD, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1;{extra}">{t}</div>')

def item(name, price, desc, gap=14, size=26, dsize=20, note=''):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.25; color: {GOLD}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.05; color: {INK}">'
            f'<span>{name}</span><span>{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.22; color: {INK}; margin-top: 3px">{desc}</div>{n}</div>')

def session(no, title, extra=''):
    """Session header: gold session number on a short rule, title in Chango, oxblood underline."""
    return (f'<div style="display: flex; align-items: center; gap: 10px;{extra}">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.2em; color: {GOLD}; white-space: nowrap">SESSION {no}</div>'
            f'<div style="flex: 1; height: 0; border-top: 1.5px solid {GOLD}"></div></div>'
            f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1.15; color: {INK}; margin-top: 4px; white-space: nowrap">{title}</div>')

def page(inner, name, bg=PAPER):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.2">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def appointment(o, x, y):
    """Dr. Sobel's appointment card, filled in by hand. Time of the next visit is the joke."""
    hand = f'font-family: {SCRIPT}; font-size: 27px; color: #1d3a7a; line-height: 1'
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 136px; background: {CARD}; '
             f'box-shadow: 0 3px 9px rgba(0,0,0,0.38); transform: rotate(-4deg); box-sizing: border-box; padding: 10px 12px 0; border-top: 6px solid {INK}">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 19px; line-height: 1.05; color: {INK}">Ben Sobel, M.D.</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; letter-spacing: 0.16em; color: {MUTE}; line-height: 1.2; margin-top: 2px">PSYCHIATRY</div>'
             f'<div style="font-family: {BODY}; font-size: 16px; color: {INK}; margin-top: 6px; display: flex; align-items: baseline; gap: 6px; border-bottom: 1px solid #b9b2a5; height: 26px">'
             f'Next visit<span style="{hand}">Tuesday</span></div>'
             f'<div style="font-family: {BODY}; font-size: 16px; color: {INK}; margin-top: 6px; display: flex; align-items: baseline; gap: 6px; border-bottom: 1px solid #b9b2a5; height: 26px">'
             f'at<span style="{hand}">3 a.m.</span><span style="font-size: 15px; color: {MUTE}">(again)</span></div></div>')

def pillow_tag(o, x, y):
    """Law-label style pillow tag, hanging off the card on its string."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 132px; height: 212px; transform: rotate(6deg)">'
             f'<div style="position: absolute; left: 65px; top: -24px; width: 2px; height: 32px; background: #8a7b62"></div>'
             f'<div style="position: absolute; left: 0; top: 0; width: 132px; height: 212px; background: {CARD}; border: 1.5px solid #8a7b62; '
             f'box-shadow: 0 3px 8px rgba(0,0,0,0.35); box-sizing: border-box; padding: 20px 6px 0; text-align: center">'
             f'<div style="position: absolute; left: 59px; top: 6px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #8a7b62; background: {PAPER}"></div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; color: {INK}; line-height: 1.2">DO NOT REMOVE<br>THIS TAG</div>'
             f'<div style="font-family: {DISP}; font-size: 20px; color: {INK}; line-height: 1.05; margin-top: 6px">HIT THE<br>PILLOW</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; color: {INK}; line-height: 1.2; margin-top: 6px">Angry? Hit this.<br>Hit, do not shoot.</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {MUTE}; line-height: 1.2; margin-top: 4px">Feathers, rage</div></div></div>')

# ---------------- FRONT: the table card ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 236px; background: {INK}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 228px; width: {W}px; height: 3px; background: {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; text-align: center">{kicker("The Hotel Wexford<br>Grand Ballroom")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 84px; width: {CW}px; text-align: center; font-family: {DISP}; font-size: 56px; '
             f'line-height: 1.0; color: {PAPER}">THE<br>MEETING</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 196px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 20px; line-height: 1; color: #e8d6a4">A private dinner of the families</div>')

    o.append(f'<img src="assets/hero-couch.jpg" alt="Paul Vitti on the couch in Dr. Sobel\'s office, palms up, mid-sentence, close to tears" '
             f'style="position: absolute; left: 0; top: 231px; display: block; width: {W}px; height: {HERO_H}px">')
    o.append(f'<div style="position: absolute; left: 0; top: {231 + HERO_H}px; width: {W}px; height: 3px; background: {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: {231 + HERO_H + 12}px; width: {CW}px; text-align: center; font-family: {BODY}; '
             f'font-style: italic; font-size: 18px; line-height: 1.25; color: {MUTE}">Our host, in session. He is fine. He is totally fine.</div>')

    pillow_tag(o, 240, 256)
    bar = (f'<div style="text-align: center">{kicker("Seven o&rsquo;clock")}</div>'
           f'<div style="font-family: {DISP}; font-size: 28px; line-height: 1.1; color: {INK}; text-align: center; margin-top: 4px; white-space: nowrap">COCKTAIL HOUR</div>'
           + item('Calming Negroni', '8.50', 'Gin, bitter red aperitif, sweet vermouth, stirred, on ice, orange slice.', 10, 26, 20)
           + item('Jelly&rsquo;s rye', '6.00', 'On the rocks. He pours, he doesn&rsquo;t talk.', 12, 26, 20))
    o.append(f'<div style="position: absolute; left: {L}px; top: 630px; width: {CW}px">{bar}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 866px; width: 160px; font-family: {BODY}; font-style: italic; font-size: 17px; '
             f'line-height: 1.25; color: {INK}">Menu arranged by the consigliere. No guns at the table, please.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 968px; font-family: {SCRIPT}; font-size: 34px; line-height: 1; color: {INK}">Ben Sobel</div>')
    appointment(o, 202, 868)
    return page(''.join(o), 'front')

# ---------------- BACK: the session menu ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 40px; width: {CW}px; text-align: center">'
             f'{kicker("The fifty-minute hour")}'
             f'<div style="font-family: {DISP}; font-size: 35px; line-height: 1.1; color: {INK}; margin-top: 8px; white-space: nowrap">THE SESSION</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.25; color: {MUTE}; margin-top: 4px">'
             'Eat. Talk. How does it make you feel?</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 156px; width: {CW}px; height: 3px; background: {INK}"></div>')

    s1 = (session('ONE', 'START TALKING')
          + item('Fried calamari', '11.50', 'Buttermilk-soaked squid in semolina, fried crisp, salt and lemon.', 8,
                 note='As at the Miami wedding. Interrupted.')
          + item('Mozzarella in carrozza', '9.00', 'Crustless sandwiches, crumbed and fried until the cheese runs.', 12,
                 note='Comfort food. Admit you need it.'))

    s2 = (session('TWO', 'COMFORT COURSE')
          + item('Veal parmigiana', '19.99', 'Crumbed cutlet, marinara, melted mozzarella and parmesan, spaghetti alongside.', 8,
                 note='Like his mother made. We won&rsquo;t go there.'))

    s3 = (session('THREE', 'CLOSURE')
          + item('Cannoli', '7.00', 'Sweet ricotta, orange zest, chocolate-dipped ends.', 8)
          + item('Espresso', '2.50', 'Sambuca on the side, 4.00.', 10))
    o.append(f'<div style="position: absolute; left: {L}px; top: 174px; width: {CW}px">{s1}<div style="height: 14px"></div>{s2}'
             f'<div style="height: 14px"></div><div id="s3" style="width: 176px">{s3}</div></div>')

    o.append(f'<div style="position: absolute; left: 240px; top: 672px; width: 124px; height: 124px; border-radius: 50%; background: {INK}; '
             f'border: 3px solid {GOLD}; box-shadow: 0 0 0 3px {PAPER}, 0 0 0 5px {INK}; transform: rotate(-9deg); text-align: center; box-sizing: border-box; padding-top: 20px">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; color: #e8d6a4; line-height: 1">CANNOLI</div>'
             f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1.02; color: {PAPER}; margin-top: 6px">YOU&rsquo;RE<br>GOOD.</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; color: #e8d6a4; line-height: 1; margin-top: 5px">you&rsquo;re good</div></div>')

    o.append(f'<img src="assets/hug-cutout.png" alt="Paul Vitti hugging Dr. Sobel, eyes shut, cheek to cheek" '
             f'style="position: absolute; left: {W - HW}px; top: {H - HH}px; display: block; width: {HW}px; height: {HH}px">')
    o.append(f'<div style="position: absolute; left: {L}px; top: 960px; width: 180px; font-family: {BODY}; font-size: 14px; line-height: 1.25; color: {MUTE}">'
             'Prices subject to change.<br>Banquet order No. 1957.<br>New York, 1999.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Meeting menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
