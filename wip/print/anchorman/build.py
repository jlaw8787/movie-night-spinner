"""KVWN Channel 4 News Team Night, the station party, San Diego, 1975.
News rundown sheet, two faces 816x1056 (US Letter).
Front: a frame from the film. The real TMDB still of Ron at the Channel 4 news desk under the world clocks, large,
with a world clock city strip in type, the TMDB news team still beside the title. Props: a torn teleprompter roll
("stay classy"), a memo from the desk of Ron Burgundy, a jazz flute ticket.
Back: the six o'clock rundown on canary copy paper. Blocks, page numbers, talent, cost. Milk is killed.
Baxter's snapshot is pinned on, his paper dog license tucked under it.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
BURG, BURG_D, GOLD, AVO, AVO_D, PAPER, CANARY, INK, NAVY = ('#7a1e2c', '#4e1019', '#d8a032', '#6f7a2b', '#4f5820',
                                                           '#f6ecd2', '#f3e3b0', '#2a1a14', '#24304a')
FONTS = ('https://fonts.googleapis.com/css2?family=Rammetto+One&family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600'
         '&family=Yellowtail&display=swap')
DISP = "'Rammetto One', sans-serif"; BODY = "'Archivo', sans-serif"; SCRIPT = "'Yellowtail', cursive"
L = 44

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

team = ImageEnhance.Brightness(Image.open(S('5iHPV6M6aPKxXv3w8LTxsD6Zeot.jpg')).convert('RGB')).enhance(1.04)
fit(team, 352, 198).save(A('still-news-team.jpg'), quality=90)
desk = ImageEnhance.Brightness(Image.open(S('bbMrxMEiA7StAMcNUZ4jsKRjPgN.jpg')).convert('RGB')).enhance(1.05)
fit(desk, 728, 410).save(A('still-news-desk.jpg'), quality=90)
bax = ImageEnhance.Brightness(Image.open(S('lRDH73FEzOtWY2WyHVP3pEg0aPt.jpg')).convert('RGB')).enhance(1.08)
fit(bax, 196, 140, (1180, 120, 2700, 1400)).save(A('still-baxter.jpg'), quality=90)

def wear(name, seed, col=(90, 70, 30)):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(64 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 24, H // 24), 0)
    mot.putdata([rnd.randint(0, 14) for _ in range(mot.width * mot.height)])
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), col + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('back', 1975)
wear('front', 4, (20, 4, 8))

# ---------------- pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')

def absdiv(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'

def page(inner, name, bg):
    over = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {0.12 if name == "front" else 0.22}">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner + over + '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    # top rule stripes in the station colours
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {GOLD}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: {W}px; height: 6px; background: {AVO}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {W - 2 * L}px; display: flex; justify-content: space-between">'
             f'{kicker("KVWN-TV Channel 4", GOLD, 18, " white-space: nowrap")}{kicker("San Diego, Friday night", PAPER, 18, " white-space: nowrap")}</div>')
    # world clock cities as a type strip
    cities = [('San Diego', '6:00'), ('New York', '9:00'), ('London', '2:00'), ('Tokyo', '11:00'), ('Saigon', '10:00')]
    o.append(f'<div style="position: absolute; left: 0; top: 76px; width: {W}px; height: 32px; background: {BURG_D}; display: flex; align-items: center; justify-content: center; gap: 14px">'
             + ''.join(f'<div style="font-family: {BODY}; font-weight: 800; font-size: 15px; letter-spacing: 0.1em; color: {PAPER}; white-space: nowrap">{c.upper()} '
                       f'<span style="color: {GOLD}">{t}</span></div>' for c, t in cities) + '</div>')
    # hero: the real Channel 4 news desk
    o.append(f'<div style="position: absolute; left: {L - 6}px; top: 120px; width: 728px; height: 410px; border: 4px solid {GOLD}; box-shadow: 0 8px 20px rgba(0,0,0,0.5)">'
             f'<img src="assets/still-news-desk.jpg" alt="Ron Burgundy at the Channel 4 anchor desk under the row of world clocks, the station logo on the screen behind him" '
             f'style="display: block; width: 728px; height: 410px">'
             f'<div style="position: absolute; left: 0; top: 336px; height: 52px; background: {BURG}; border-top: 3px solid {GOLD}; border-bottom: 3px solid {GOLD}; padding: 0 22px 0 18px; '
             f'display: flex; flex-direction: column; justify-content: center">'
             f'{kicker("Ron Burgundy", GOLD, 15, " letter-spacing: 0.16em")}'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; line-height: 1.1; color: {PAPER}; margin-top: 2px">Channel 4 News, weeknights at six.</div></div></div>')
    # torn teleprompter roll
    o.append(f'<div style="position: absolute; left: 120px; top: 528px; width: 576px; height: 50px; background: #fbf8ee; transform: rotate(-1.4deg); '
             f'box-shadow: 0 5px 10px rgba(30,12,8,0.45); display: flex; align-items: center; justify-content: center; gap: 14px; padding-left: 8px; box-sizing: border-box; '
             f'border-left: 3px dotted #b8b2a0; border-right: 3px dotted #b8b2a0">'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {BURG}; line-height: 1; border: 2px solid {BURG}; padding: 3px 5px 2px; white-space: nowrap">PROMPT 4</div>'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 25px; letter-spacing: 0.03em; color: #111; line-height: 1; white-space: nowrap">YOU STAY CLASSY, SAN DIEGO.</div></div>')
    # the team still, left; title, right
    o.append(f'<div style="position: absolute; left: {L}px; top: 606px; width: 352px; background: {PAPER}; padding: 7px 7px 5px; box-sizing: content-box; transform: rotate(-1.5deg); '
             f'box-shadow: 0 6px 14px rgba(0,0,0,0.5); margin-left: -7px">'
             f'<img src="assets/still-news-team.jpg" alt="The Channel 4 News Team posed in front of the station wallpaper: Champ in a cowboy hat, Veronica, Ron in his burgundy suit, Brian and Brick" '
             f'style="display: block; width: 352px; height: 198px">'
             f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.2; color: {INK}; text-align: center; padding-top: 5px">The News Team. Number one in San Diego.</div></div>')
    o.append(absdiv(424, 612, 348, kicker("Station party and supper", GOLD, 16, ' letter-spacing: 0.16em')
                    + f'<div style="font-family: {DISP}; font-size: 50px; line-height: 1.02; color: {PAPER}; margin-top: 8px; text-shadow: 3px 3px 0 {BURG_D}">NEWS<br>TEAM<br>NIGHT</div>'
                    + f'<div style="height: 4px; width: 120px; background: {GOLD}; margin-top: 12px"></div>'
                    + f'<div style="font-family: {BODY}; font-weight: 500; font-size: 20px; line-height: 1.25; color: {PAPER}; margin-top: 10px">Supper, drinks and the whole Channel 4 family. The rundown is inside.</div>'))
    # memo from the desk of Ron Burgundy
    o.append(f'<div style="position: absolute; left: 40px; top: 874px; width: 452px; height: 138px; box-sizing: border-box; padding: 11px 18px 0 22px; background: {PAPER}; '
             f'transform: rotate(-1.2deg); box-shadow: 0 6px 14px rgba(0,0,0,0.5); border-top: 6px solid {BURG}">'
             f'{kicker("From the desk of Ron Burgundy", BURG, 15, " letter-spacing: 0.16em")}'
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.26; color: {INK}; margin-top: 5px">Tonight we eat like kings and drink like gentlemen. '
             f'I don&rsquo;t want to brag, but I am kind of a big deal.</div>'
             f'<div style="position: absolute; right: 18px; bottom: 4px; font-family: {SCRIPT}; font-size: 36px; line-height: 1; color: {BURG}; transform: rotate(-4deg)">Ron Burgundy</div></div>')
    # jazz flute ticket, plain type on card
    o.append(f'<div style="position: absolute; left: 524px; top: 880px; width: 240px; height: 122px; background: #f2d27e; transform: rotate(2.5deg); '
             f'box-shadow: 0 6px 14px rgba(0,0,0,0.5); display: flex">'
             f'<div style="width: 58px; border-right: 2px dashed {BURG_D}; display: flex; flex-direction: column; align-items: center; justify-content: center">'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; color: {BURG_D}; line-height: 1">No.</div>'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 17px; color: {BURG}; line-height: 1.1">0004</div></div>'
             f'<div style="flex: 1; text-align: center; padding-top: 10px">'
             f'{kicker("Admit one", BURG_D, 14)}'
             f'<div style="font-family: {DISP}; font-size: 26px; line-height: 1.02; color: {BURG}; margin-top: 3px">JAZZ<br>FLUTE</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; line-height: 1.2; color: {INK}; margin-top: 3px">Ron Burgundy, late set.<br>He will play on.</div></div></div>')
    return page(''.join(o), 'front', BURG)

# ---------------- BACK ----------------
COLS = (52, 384, 206, 94)  # pg, segment, talent, cost
def row(pg, name, desc, talent, wink, cost, killed=False, pad=3):
    nm = (f'<span style="text-decoration: line-through; text-decoration-thickness: 3px; text-decoration-color: {BURG}">{name}</span>' if killed else name)
    c = (f'<div style="font-family: {BODY}; font-weight: 800; font-size: 22px; letter-spacing: 0.12em; color: {PAPER}; background: {BURG}; padding: 4px 8px 3px; display: inline-block; margin-right: 6px; transform: rotate(-3deg)">KILL</div>'
         if killed else f'<div style="font-family: {BODY}; font-weight: 800; font-size: 27px; line-height: 1.05; color: {BURG}">{cost}</div>')
    dd = (f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.22; color: {INK}; margin-top: 3px">{desc}</div>' if desc else '')
    return (f'<div style="display: flex; align-items: flex-start; padding: {pad}px 0; border-bottom: 1px solid rgba(78,16,25,0.35)">'
            f'<div style="width: {COLS[0]}px; font-family: {BODY}; font-weight: 800; font-size: 19px; color: {AVO_D}; padding-top: 5px">{pg}</div>'
            f'<div style="width: {COLS[1]}px">'
            f'<div style="font-family: {BODY}; font-weight: 800; font-size: 27px; line-height: 1.05; color: {INK}">{nm}</div>'
            f'{dd}</div>'
            f'<div style="width: {COLS[2]}px; padding-top: 3px">'
            f'<div style="font-family: {BODY}; font-weight: 800; font-size: 16px; letter-spacing: 0.12em; color: {AVO_D}; line-height: 1.15">{talent}</div>'
            f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 16px; color: {BURG}; line-height: 1.2; margin-top: 2px; white-space: nowrap">{wink}</div></div>'
            f'<div style="width: {COLS[3]}px; text-align: right">{c}</div></div>')

def block(letter, title):
    return (f'<div style="display: flex; align-items: center; gap: 16px; background: {AVO}; height: 32px; padding: 0 12px; margin-top: 2px; '
            f'border-top: 3px solid {GOLD}">'
            f'<div style="font-family: {BODY}; font-weight: 800; font-size: 16px; letter-spacing: 0.2em; color: {GOLD}">BLOCK {letter}</div>'
            f'<div style="font-family: {DISP}; font-size: 22px; line-height: 1; color: {PAPER}; white-space: nowrap">{title}</div></div>')

def back():
    o = []
    o.append(absdiv(L, 44, 480, kicker("KVWN-TV Channel 4, San Diego", AVO_D)))
    o.append(absdiv(L - 3, 66, 520, f'<div style="font-family: {DISP}; font-size: 60px; line-height: 1; color: {BURG}; white-space: nowrap">RUNDOWN</div>'))
    cells = [('Show', 'News Team Night'), ('Air', 'Friday, 6:30 PM'), ('Producer', 'Ed Harken')]
    o.append(absdiv(L, 138, 460, '<div style="display: flex; border: 2px solid ' + INK + '">' + ''.join(
        f'<div style="flex: 1; padding: 4px 8px 5px; {"border-left: 2px solid " + INK if i else ""}">'
        f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {AVO_D}; text-transform: uppercase; line-height: 1.1">{k}</div>'
        f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; color: {INK}; line-height: 1.15; white-space: nowrap">{v}</div></div>'
        for i, (k, v) in enumerate(cells)) + '</div>'))
    # Baxter snapshot pinned to the sheet, his paper dog license tucked under it
    o.append(f'<div style="position: absolute; left: 584px; top: 40px; width: 176px; background: #fbf8ee; padding: 7px; transform: rotate(2.5deg); '
             f'box-shadow: 0 4px 10px rgba(40,20,10,0.4)">'
             f'<img src="assets/still-baxter.jpg" alt="Ron holds Baxter, his small shaggy dog, outside the station" style="display: block; width: 176px; height: 126px"></div>'
             '')
    o.append(f'<div style="position: absolute; left: 524px; top: 112px; width: 226px; height: 92px; box-sizing: border-box; background: #fbf6e6; border: 1px solid #b9ab88; '
             f'transform: rotate(-3deg); box-shadow: 0 4px 10px rgba(40,20,10,0.45); padding: 6px 12px 0 14px">'
             f'{kicker("Dog license No. 4", BURG, 14, " letter-spacing: 0.12em; white-space: nowrap")}'
             f'<div style="font-family: {DISP}; font-size: 20px; line-height: 1.15; color: {INK}">BAXTER</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.2; color: {INK}">Owner R. Burgundy. Speaks Spanish.</div></div>')
    head = (f'<div style="display: flex; background: {INK}; height: 28px; align-items: center; padding: 0 0">'
            + ''.join(f'<div style="width: {w}px; font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.18em; color: {GOLD}; '
                      f'{"text-align: right; padding-right: 2px; box-sizing: border-box" if i == 3 else ("padding-left: 6px; box-sizing: border-box" if i == 0 else "")}">{t}</div>'
                      for i, (w, t) in enumerate(zip(COLS, ['PG', 'SEGMENT', 'TALENT', 'COST']))) + '</div>')
    table = (head
             + block('A', 'BEFORE THE BROADCAST')
             + row('A1', 'Baxter&rsquo;s wheel of cheese', 'Baked brie, honey, thyme, walnuts', 'BAXTER', 'Ate a whole one.', '2.75')
             + row('A2', 'Carne asada fries', 'Lime steak, jack, avocado, sour cream', 'THE TEAM', 'Hometown pride.', '1.95')
             + row('A3', 'Champ&rsquo;s cocktail franks', 'Little franks in pastry, yellow mustard', 'CHAMP', 'Whammy!', '1.25')
             + block('B', 'THE LEAD STORY')
             + row('B1', 'San Diego chicken tacos', 'Crisp chicken, corn tortillas, lime cream', 'RON', 'Runs six minutes.', '3.50')
             + block('C', 'AND FINALLY')
             + row('C1', f'Butter<span style="color: {BURG}">SCOTCH</span> pudding', 'Self-saucing sponge, vanilla ice cream', 'RON', 'Scotchy, scotch, scotch.', '0.95')
             + block('D', 'OFF THE CLOCK')
             + row('D1', 'Great Odin&rsquo;s Raven!', 'Blackberry and lemon soda, no liquor', 'THE TEAM', 'Raise a glass.', '0.60')
             + row('D2', 'Newsroom coffee', 'Hot, black and bottomless, from the urn', 'BRICK', 'Loves coffee. Loves lamp.', '0.25')
             + row('D3', 'Iced tea', 'Fresh brewed, lemon wedge, sugar bowl', 'ED HARKEN', 'On the station.', '0.35')
             + row('D4', 'Ice cold milk', '', 'RON', 'Milk was a bad choice.', '', killed=True))
    o.append(absdiv(L - 4, 210, W - 2 * L + 8, table))
    # foot: fine print
    o.append(absdiv(L, 972, W - 2 * L, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: #4a3a2c; text-align: center">'
                                 f'Prices subject to change. All plates go on the station tab. Mr. Fantana&rsquo;s cologne is not permitted near the buffet. '
                                 f'KVWN Form 4-75. San Diego, California, 1975.</div>'))
    return page(''.join(o), 'back', CANARY)

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>News Team Night, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
