"""Whistle Stop Cafe, Whistle Stop, Alabama, early 1930s. Tall cafe card, two faces 600x1200.
Front: depot nameboard title, the signature 1936 FSA photo of a Southern railroad depot (Library of Congress),
the "served hot" special panel with the frying pan still, Idgie's note, the train schedule.
Back: the cafe's own window sign (TMDB), the menu under depot nameboard bars, bee tree still and honey jar,
the chalk hobo mark card, Evelyn's pencilled "Towanda!".
Writes photo crops, front/back .body.html and .html."""
import os, subprocess, sys
from PIL import Image, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('honey-jar.png')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)
W, H = 600, 1200
INK, GREEN, GOLD, RED, PAPER, CREAM, MUTE = '#24331a', '#3f5a24', '#d29a2e', '#a5452f', '#f2e6c6', '#f8f0da', '#5b5440'
FONTS = ('https://fonts.googleapis.com/css2?family=Bevan&family=Vollkorn:ital,wght@0,400;0,600;0,700;1,400;1,600'
         '&family=Homemade+Apple&display=swap')
DISP = "'Bevan', serif"; BODY = "'Vollkorn', serif"; SCRIPT = "'Homemade Apple', cursive"
L = 40; CW = W - 2 * L

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

DEP_W, DEP_H = 504, 336
dep = ImageOps.autocontrast(Image.open(S('loc-edwards-1936.jpg')).convert('L'), cutoff=0.6)
dep = ImageEnhance.Brightness(dep).enhance(1.06)
dep = ImageOps.colorize(dep, black=(38, 30, 18), white=(250, 240, 214), mid=(150, 128, 92))
fit(dep, DEP_W, DEP_H, (38, 58, 990, 760)).save(A('depot-1936.jpg'), quality=92)
pan = ImageEnhance.Brightness(Image.open(S('hwNJJum7YvhSkHBoh1QmzP2Z6TY.jpg')).convert('RGB')).enhance(1.25)
fit(ImageEnhance.Contrast(pan).enhance(1.08), 184, 138, (120, 60, 1500, 1040)).save(A('still-pan.jpg'), quality=90)
sign = ImageEnhance.Brightness(Image.open(S('hgbRDIwSiQ7reWwzFtWFy0v02xo.jpg')).convert('RGB')).enhance(1.12)
fit(sign, 176, 210, (792, 40, 1660, 1070)).save(A('still-sign.jpg'), quality=90)
bee = ImageEnhance.Brightness(Image.open(S('7W4L1KqiPMFJGOEk8SWZTIX9NPA.jpg')).convert('RGB')).enhance(1.08)
fit(bee, 176, 150, (420, 120, 1700, 1040)).save(A('still-bees.jpg'), quality=90)

# ---------------- type pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15;{extra}">{t}</div>')

def board(t, w, size=40, side=('', ''), color=GREEN):
    """Depot nameboard: a long board with stepped, notched ends and a gold keyline."""
    tab = lambda s, al: (f'<div style="position: absolute; top: 14px; {al}: -22px; width: 22px; height: {size + 2}px; background: {color}; '
                         f'border-top: 2px solid {GOLD}; border-bottom: 2px solid {GOLD}; box-sizing: border-box"></div>')
    return (f'<div style="position: relative; width: {w}px; margin: 0 auto">'
            + tab('', 'left') + tab('', 'right') +
            f'<div style="background: {color}; border: 3px solid {GOLD}; outline: 2px solid {color}; padding: 9px 0 5px; text-align: center; '
            f'font-family: {DISP}; font-size: {size}px; line-height: 1; letter-spacing: 0.03em; color: {CREAM}; white-space: nowrap">{t}</div></div>')

def item(name, price, desc, note='', gap=12, nc=INK):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 20px; line-height: 1.2; color: {RED}; margin-top: 1px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 27px; line-height: 1.1; color: {nc}">{name}</div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 27px; line-height: 1.1; color: {nc}; white-space: nowrap">{price}</div></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.25; color: {nc}; margin-top: 2px">{desc}</div>{n}</div>')

def page(inner, name, bg):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.25">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            # railroad-red double rule border
            f'<div style="position: absolute; left: 16px; top: 16px; width: {W - 32}px; height: {H - 32}px; border: 3px solid {RED}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 23px; top: 23px; width: {W - 46}px; height: {H - 46}px; border: 1px solid {RED}; box-sizing: border-box"></div>'
            + inner + '</div>')

def framed(o, src, alt, x, y, w, h, ang=0, frame=GOLD, pad=6, shadow=True):
    s = f'box-shadow: 2px 4px 10px rgba(40,30,10,0.35);' if shadow else ''
    o.append(f'<div style="position: absolute; left: {x - pad}px; top: {y - pad}px; padding: {pad}px; background: {CREAM}; border: 2px solid {frame}; '
             f'transform: rotate({ang}deg); {s}"><img src="{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

# ---------------- props ----------------
def schedule(o, x, y, ang):
    rows = [('No. 4', 'Birmingham', '7:10 A.M.'), ('No. 9', 'Freight, east', '2:40 P.M.'), ('No. 11', 'Freight, west', '11:50 P.M.')]
    r = ''.join(f'<div style="display: flex; justify-content: space-between; border-top: 1px solid {RED}; padding: 3px 0 1px; font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {INK}">'
                f'<span style="font-weight: 700; width: 50px">{a}</span><span style="flex: 1">{b}</span><span style="font-weight: 600">{c}</span></div>' for a, b, c in rows)
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 238px; background: {CREAM}; border: 2px solid {RED}; padding: 8px 10px 8px; '
             f'box-sizing: border-box; transform: rotate({ang}deg); box-shadow: 2px 4px 10px rgba(40,30,10,0.35)">'
             f'<div style="text-align: center; font-family: {DISP}; font-size: 20px; line-height: 1.05; color: {RED}">TRAINS AT<br>WHISTLE STOP</div>'
             f'<div style="text-align: center; font-family: {BODY}; font-style: italic; font-size: 15px; color: {MUTE}; margin: 2px 0 4px">Daily, Sundays excepted</div>{r}'
             f'<div style="border-top: 2px solid {RED}; margin-top: 2px; padding-top: 4px; font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.25; color: {INK}">'
             f'No. 9 slows at the bend. Railroad Bill seen on the line again.</div></div>')

def hobo_card(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 236px; height: 180px; background: #2b3424; border: 3px solid #5d4a2c; '
             f'box-sizing: border-box; transform: rotate({ang}deg); box-shadow: 2px 4px 10px rgba(40,30,10,0.4); overflow: hidden">'
             f'<img src="assets/chalk-cat.png" alt="A chalk hobo mark of a sitting cat, meaning a kind lady lives here" style="position: absolute; left: -6px; top: 22px; width: 120px; height: 90px">'
             f'<div style="position: absolute; left: 0; top: 8px; width: 230px; text-align: center">{kicker("By the back step", GOLD, 15)}</div>'
             f'<div style="position: absolute; left: 106px; top: 36px; width: 118px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.22; color: #ece4cc">'
             f'The cat chalked on our gate means a kind lady lives here.</div>'
             f'<div style="position: absolute; left: 12px; top: 114px; width: 206px; font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.22; color: #ece4cc">'
             f'Plates at the back door, free. Smokey, yours is kept warm.</div></div>')

def jar_label(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 140px; height: 177px; transform: rotate({ang}deg)">'
             f'<img src="assets/honey-jar.png" alt="A pint jar of honey with comb, a gingham cloth tied over the lid" style="display: block; width: 140px; height: 177px">'
             f'<div style="position: absolute; left: 31px; top: 103px; width: 78px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; line-height: 1; color: {INK}">BEE TREE</div>'
             f'<div style="position: absolute; left: 31px; top: 119px; width: 78px; text-align: center; font-family: {DISP}; font-size: 16px; line-height: 1; color: {RED}">HONEY</div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    # nameboard title with a raised crest, like the depot boards along the line
    o.append(f'<div style="position: absolute; left: 0; top: 44px; width: {W}px; text-align: center">'
             f'<div style="display: inline-block; background: {CREAM}; border: 3px solid {GREEN}; border-bottom: none; padding: 5px 20px 3px">{kicker("Served hot at the", RED, 15)}</div></div>')
    o.append(f'<div style="position: absolute; left: 68px; top: 70px; width: {W - 136}px">'
             + board('WHISTLE STOP', W - 136, 46) + '</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 142px; width: {W}px; text-align: center">'
             f'<div style="display: inline-block; font-family: {DISP}; font-size: 40px; line-height: 1; color: {RED}; letter-spacing: 0.32em; padding-left: 0.32em">CAFE</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 194px; width: {CW}px; text-align: center">{kicker("Whistle Stop, Alabama &bull; By the tracks", GREEN, 16)}</div>')
    # signature photo
    framed(o, 'assets/depot-1936.jpg', 'Photograph looking down the railroad tracks at a small Southern depot, a long freight platform, baggage carts, Model A cars and a town of frame houses on the hill',
           (W - DEP_W) // 2, 232, DEP_W, DEP_H)
    o.append(f'<div style="position: absolute; left: {L}px; top: 584px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.2; color: {INK}">'
             f'Down the line from our door. Every train stops, and so should you.</div>')
    # the special
    o.append(f'<div style="position: absolute; left: {L}px; top: 622px; width: {CW}px; height: 280px; background: {GREEN}; border: 3px solid {GOLD}; outline: 2px solid {GREEN}; box-sizing: border-box"></div>')
    framed(o, 'assets/still-pan.jpg', 'Slices of green tomato frying golden in cornmeal in a black iron skillet', L + 20, 642, 184, 138, -2, frame=GOLD, pad=4)
    o.append(f'<div style="position: absolute; left: {L + 226}px; top: 638px; width: 250px">'
             f'{kicker("Every day", GOLD, 16)}'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 0.98; color: {CREAM}; margin-top: 4px">SERVED<br>HOT</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.22; color: #f3dfa7; margin-top: 8px">Green off the vine. Gold out of the skillet.</div></div>')
    o.append(f'<div style="position: absolute; left: {L + 20}px; top: 798px; width: {CW - 40}px">'
             + item('Fried Green Tomatoes', '10&cent;', 'Thick slices in buttermilk and cornmeal, fried in bacon drippings. Caper remoulade.', gap=0, nc=CREAM)
             + '</div>')
    # Idgie's note
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 926px; width: 262px; font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {INK}">'
             f'{kicker("From the kitchen", RED, 15)}'
             f'<div style="margin-top: 5px">Ruth says I have to write something nice here. Coffee&rsquo;s hot and Sipsey cooks. Short this week? Pay us next week.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 22px; line-height: 1.6; color: {GREEN}; margin-top: 2px">Idgie</div></div>')
    schedule(o, 318, 924, 2)
    o.append(f'<div style="position: absolute; left: {L}px; top: 1150px; width: {CW}px; text-align: center; font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {MUTE}">'
             f'Prices subject to change. P.O. Box 91, Whistle Stop, Ala. Summer, 1932.</div>')
    return page(''.join(o), 'front', PAPER)

# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 52px; width: 330px">'
             f'{kicker("Breakfast, dinner, supper", RED, 16)}'
             f'<div style="font-family: {DISP}; font-size: 60px; line-height: 0.98; color: {GREEN}; margin-top: 8px">BILL OF<br>FARE</div>'
             f'<div style="width: 300px; height: 3px; background: {GOLD}; margin: 14px 0 10px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: {INK}">At the counter, or out on the porch where you can hear the trains come in.</div></div>')
    framed(o, 'assets/still-sign.jpg', 'The cafe front window, hand lettered: Fried Green Tomatoes Served Hot at the Whistle Stop Cafe', 378, 54, 176, 210, 2)
    o.append(f'<div style="position: absolute; left: 366px; top: 276px; width: 200px; text-align: center; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.2; color: {MUTE}">'
             f'Our window. Lettered by Idgie.</div>')
    o.append(f'<div style="position: absolute; left: 70px; top: 296px; width: {W - 140}px">{board("FROM THE KITCHEN", W - 140, 34)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 352px; width: 330px">'
             + item('Biscuits and Honey', '10&cent;', 'Hot buttermilk biscuits, sweet butter, bee tree honey and a piece of the comb.',
                    'Idgie fetches it from the bee tree.', gap=0)
             + item('Breakfast Plate', '15&cent;', 'Two eggs any style, grits, a biscuit and sausage gravy.')
             + item('Butter Beans', '10&cent;', 'Simmered with salt pork, a wedge of skillet cornbread.')
             + '</div>')
    framed(o, 'assets/still-bees.jpg', 'Idgie fills a jar with honey from the bee tree while the bees settle on her arms', 404, 366, 152, 132, 3, pad=5)
    jar_label(o, 430, 480, -5)
    o.append(f'<div style="position: absolute; left: 70px; top: 676px; width: {W - 140}px">{board("BARBECUE", W - 140, 34)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 732px; width: 290px">'
             + item('Big George&rsquo;s Barbecue Plate', '25&cent;', 'Pork shoulder roasted slow and pulled, tomato and cider vinegar sauce, slaw, white bread.',
                    'The secret&rsquo;s in the sauce.', gap=0) + '</div>')
    hobo_card(o, 334, 736, 2)
    o.append(f'<div style="position: absolute; left: {L}px; top: 930px; width: 220px">{board("PIE", 180, 30)}'
             + item('Pecan Pie', '10&cent;', 'Toasted pecans in brown sugar and cane syrup custard, flaky crust.', gap=8) + '</div>')
    o.append(f'<div style="position: absolute; left: 282px; top: 930px; width: 278px">{board("TO DRINK", 234, 30)}'
             + item('Peach Sweet Tea', '5&cent;', 'Brewed strong with ripe peaches, iced, lemon and mint.', gap=8)
             + item('Coffee', '5&cent;', 'Hot all day. Refills free.', gap=6) + '</div>')
    o.append(f'<div style="position: absolute; left: 252px; top: 150px; transform: rotate(-8deg); font-family: {SCRIPT}; font-size: 24px; line-height: 1.5; color: {RED}; '
             f'border-bottom: 2px solid {RED}">Towanda!</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1150px; width: {CW}px; text-align: center; font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {MUTE}">'
             f'I. Threadgoode and R. Jamison, props. Ask Sipsey about the sauce.</div>')
    return page(''.join(o), 'back', PAPER)

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Whistle Stop Cafe, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
