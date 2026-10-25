"""KVWN Channel 4 News Team Night, the station party, San Diego, 1975.
News rundown sheet, two faces 816x1056 (US Letter).
Front: a frame from the film. The painted 70s Channel 4 set (paint.py): burgundy valance with harvest gold and
avocado stripes, circle-4 wallpaper, five world clocks, the big monitor showing the TMDB news team still with a
lower third, the walnut anchor desk with the title on its burgundy panel. Props: a torn teleprompter roll
("stay classy"), a memo from the desk of Ron Burgundy, a jazz flute ticket.
Back: the six o'clock rundown on canary copy paper. Blocks, page numbers, talent, cost. Milk is killed.
Baxter's snapshot is clipped on, his dog license sits at the foot.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('channel4-set.jpg')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)
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
fit(team, 592, 333).save(A('still-news-team.jpg'), quality=90)
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

# ---------------- pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')

def absdiv(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'

def page(inner, name, bg):
    over = ('' if name == 'front' else
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner + over + '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<img src="assets/channel4-set.jpg" alt="Painting of a 1970s TV news set: pale blue Channel 4 wallpaper, five brass world clocks, a big walnut monitor and a walnut anchor desk with a burgundy front panel" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {W - 2 * L}px; display: flex; justify-content: space-between">'
             f'{kicker("KVWN-TV Channel 4", GOLD, 18, " white-space: nowrap")}{kicker("San Diego, Friday night", PAPER, 18, " white-space: nowrap")}</div>')
    # clock name plates
    for i, c in enumerate(['San Diego', 'New York', 'London', 'Tokyo', 'Moscow']):
        o.append(absdiv(136 + 136 * i - 54, 209, 108, kicker(c, PAPER, 14, ' letter-spacing: 0.12em; text-align: center'), ''))
    # the monitor: news team still with a lower third
    o.append(f'<div style="position: absolute; left: 112px; top: 262px; width: 592px; height: 333px; overflow: hidden; border-radius: 12px">'
             f'<img src="assets/still-news-team.jpg" alt="The Channel 4 News Team posed in front of the station wallpaper: Champ in a cowboy hat, Veronica, Ron in his burgundy suit, Brian and Brick" '
             f'style="display: block; width: 592px; height: 333px">'
             f'<div style="position: absolute; left: 0; top: 262px; height: 50px; background: {BURG}; border-top: 3px solid {GOLD}; border-bottom: 3px solid {GOLD}; padding: 0 22px 0 18px; '
             f'display: flex; flex-direction: column; justify-content: center">'
             f'{kicker("The Channel 4 News Team", GOLD, 15, " letter-spacing: 0.16em")}'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; line-height: 1.1; color: {PAPER}; margin-top: 2px">Number one in San Diego. Again.</div></div></div>')
    # torn teleprompter roll lying on the desk
    o.append(f'<div style="position: absolute; left: 150px; top: 604px; width: 516px; height: 50px; background: #fbf8ee; transform: rotate(-1.4deg); '
             f'box-shadow: 0 5px 10px rgba(30,12,8,0.45); display: flex; align-items: center; justify-content: center; gap: 14px; padding-left: 8px; box-sizing: border-box; '
             f'border-left: 3px dotted #b8b2a0; border-right: 3px dotted #b8b2a0">'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {BURG}; line-height: 1; border: 2px solid {BURG}; padding: 3px 5px 2px; white-space: nowrap">PROMPT 4</div>'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 25px; letter-spacing: 0.03em; color: #111; line-height: 1; white-space: nowrap">YOU STAY CLASSY, SAN DIEGO.</div></div>')
    # title on the desk panel
    o.append(absdiv(66, 696, 684, kicker("Station party and supper", GOLD, 18, ' text-align: center')))
    o.append(absdiv(66, 728, 684, f'<div style="font-family: {DISP}; font-size: 52px; line-height: 1; color: {PAPER}; text-align: center; white-space: nowrap; '
                                  f'text-shadow: 3px 3px 0 {BURG_D}">NEWS TEAM NIGHT</div>'))
    o.append(absdiv(66, 798, 684, f'<div style="font-family: {BODY}; font-weight: 500; font-size: 21px; line-height: 1.2; color: {PAPER}; text-align: center">'
                                  f'Supper, drinks and the whole Channel 4 family. The rundown is inside.</div>'))
    # memo from the desk of Ron Burgundy
    o.append(f'<div style="position: absolute; left: 40px; top: 874px; width: 452px; height: 138px; box-sizing: border-box; padding: 11px 18px 0 22px; background: {PAPER}; '
             f'transform: rotate(-1.2deg); box-shadow: 0 6px 14px rgba(0,0,0,0.5); border-top: 6px solid {BURG}">'
             f'{kicker("From the desk of Ron Burgundy", BURG, 15, " letter-spacing: 0.16em")}'
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.26; color: {INK}; margin-top: 5px">Tonight we eat like kings and drink like gentlemen. '
             f'I don&rsquo;t want to brag, but I am kind of a big deal.</div>'
             f'<div style="position: absolute; right: 18px; bottom: 4px; font-family: {SCRIPT}; font-size: 36px; line-height: 1; color: {BURG}; transform: rotate(-4deg)">Ron Burgundy</div></div>')
    # jazz flute ticket
    perf = ''.join(f'<div style="position: absolute; left: 52px; top: {6 + i * 13}px; width: 4px; height: 6px; background: {BURG_D}"></div>' for i in range(9))
    o.append(f'<div style="position: absolute; left: 524px; top: 880px; width: 240px; height: 122px; background: {GOLD}; transform: rotate(2.5deg); '
             f'box-shadow: 0 6px 14px rgba(0,0,0,0.5); overflow: hidden">{perf}'
             f'<div style="position: absolute; left: 0; top: 0; width: 52px; height: 122px; display: flex; align-items: center; justify-content: center">'
             f'<div style="font-family: {DISP}; font-size: 17px; color: {BURG}; line-height: 1; transform: rotate(-90deg); white-space: nowrap">No. 0004</div></div>'
             f'<div style="position: absolute; left: 64px; top: 10px; width: 168px; text-align: center">'
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
    # Baxter snapshot, clipped to the sheet, his dog license tucked under the clip
    o.append(f'<div style="position: absolute; left: 584px; top: 40px; width: 176px; background: #fbf8ee; padding: 7px; transform: rotate(2.5deg); '
             f'box-shadow: 0 4px 10px rgba(40,20,10,0.4)">'
             f'<img src="assets/still-baxter.jpg" alt="Ron holds Baxter, his small shaggy dog, outside the station" style="display: block; width: 176px; height: 126px"></div>'
             f'<div style="position: absolute; left: 664px; top: 28px; width: 16px; height: 42px; border: 3px solid #8b8f96; border-radius: 8px; transform: rotate(2.5deg)"></div>')
    o.append(f'<div style="position: absolute; left: 524px; top: 126px; width: 226px; height: 78px; box-sizing: border-box; background: {AVO}; border: 3px solid {GOLD}; '
             f'border-radius: 9px; transform: rotate(-3deg); box-shadow: 0 4px 10px rgba(40,20,10,0.45); padding: 5px 10px 0 50px">'
             f'<div style="position: absolute; left: 9px; top: 20px; width: 32px; height: 32px; border-radius: 50%; background: {GOLD}; display: flex; align-items: center; justify-content: center; '
             f'font-family: {DISP}; font-size: 17px; color: {AVO_D}">4</div>'
             f'{kicker("Dog license No. 4", GOLD, 14, " letter-spacing: 0.12em; white-space: nowrap")}'
             f'<div style="font-family: {DISP}; font-size: 20px; line-height: 1.15; color: {PAPER}">BAXTER</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.2; color: {PAPER}; white-space: nowrap">Speaks Spanish. Good boy.</div></div>')
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
