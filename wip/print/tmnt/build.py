"""Corner Grate Pizza, Lower Manhattan, 1990: the takeaway trifold the pizza place leaves on doorsteps
(and drops down manholes). Two landscape faces 1344x816, three 448px panels each, folds at 448 and 896.
Outside (iron grey, the night street): flap with the cooler and April's note, back panel with the
30 minute promise, the late delivery ticket and her Channel 3 press card, front cover with the sign and
the big manhole still.
Inside (sewer green stock): three framed TMDB stills of the delivery area with small typed pins, then
the menu in three columns and a typed tips card.
Writes still crops, paper/wear textures, outside/inside .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)

W, H, P = 1344, 816, 448
IRON, IRON2, PAPER, GREEN, GREEN_D, RED, INK, STOCK = '#383c40', '#2b2e31', '#efeee4', '#2e5c34', '#1f3f25', '#c4262e', '#1d211f', '#dfe8cf'
FONTS = ('https://fonts.googleapis.com/css2?family=Rubik+Mono+One'
         '&family=Rubik:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500&family=Kalam:wght@400;700&display=swap')
DISP = "'Rubik Mono One', sans-serif"; BODY = "'Rubik', sans-serif"; HAND = "'Kalam', cursive"
M = 40

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

mh = ImageEnhance.Brightness(Image.open(S('pJ8NmQkHgmR03P2N8Zer9MXEg5j.jpg')).convert('RGB')).enhance(1.12)
hero = ImageEnhance.Brightness(Image.open(S('l4eT7lDzkzaSZPRSyuf43dZwFEJ.jpg')).convert('RGB')).enhance(1.05)
fit(hero, 448, 330, (120, 0, 1800, 1080)).save(A('still-hero.jpg'), quality=90)
fit(mh, 376, 370, (250, 0, 1330, 1080)).save(A('still-drop.jpg'), quality=90)
rf = ImageEnhance.Brightness(Image.open(S('e17AGWpMSXdi79pMlccfIu8HzJY.jpg')).convert('RGB')).enhance(1.05)
fit(rf, 376, 370, (560, 0, 1660, 1080)).save(A('still-rooftop.jpg'), quality=90)
an = ImageEnhance.Brightness(Image.open(S('xvpgYDRuT9MKdMeOtnkqDKiduK0.jpg')).convert('RGB')).enhance(1.05)
fit(an, 376, 370, (100, 0, 1200, 1080)).save(A('still-antiques.jpg'), quality=90)
pc = ImageEnhance.Brightness(Image.open(S('mJaKfJmGdjD7QoetqY99GmMpEt9.jpg')).convert('RGB')).enhance(1.08)
fit(pc, 360, 190, (0, 40, 1920, 1080)).save(A('still-counter.jpg'), quality=90)

def texture(name, base, dark, seed, vign=60, mott=16):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(36):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(vign - i * 1.7)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 24, H // 24), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, mott))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), dark + (0,)); lay.putalpha(ImageChops.add(m, mot))
    lay.save(A(f'wear-{name}.png'))
texture('outside', None, (110, 84, 40), 1990, 60, 22)
texture('inside', None, (60, 70, 40), 1984, 70, 22)

# ---------------- pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def bar(t, bg=IRON, fg=PAPER, size=40):
    rivets = ''.join(f'<div style="position: absolute; {side}: 10px; top: {top}px; width: 7px; height: 7px; border-radius: 50%; background: #6d7378"></div>'
                     for side in ('left', 'right') for top in (10, 37))
    return (f'<div style="position: relative; background: {bg}; color: {fg}; font-family: {DISP}; font-size: {size}px; line-height: 1; '
            f'padding: 6px 28px 8px; border-radius: 4px; box-shadow: 0 3px 0 {INK}">{t}</div>')

def item(name, price, desc, note='', gap=16, color=INK, pc=RED, nc=RED):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 500; font-size: 18px; line-height: 1.2; color: {nc}; margin-top: 3px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 900; '
            f'font-size: 26px; line-height: 1.1; color: {color}; text-transform: uppercase; letter-spacing: 0.01em"><span>{name}</span>'
            f'<span style="color: {pc}; font-weight: 900">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {color}; margin-top: 3px">{desc}</div>{n}</div>')

def folds(o, light):
    for x in (P, 2 * P):
        o.append(f'<div style="position: absolute; left: {x - 1}px; top: 0; width: 1px; height: {H}px; background: {light}"></div>'
                 f'<div style="position: absolute; left: {x}px; top: 0; width: 1px; height: {H}px; background: rgba(0,0,0,0.22)"></div>')

def page(inner, name, bg, grain=0.2):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {grain}">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

def burst(o, x, y, size, ang, inner):
    sq = ''.join(f'<div style="position: absolute; left: 0; top: 0; width: {size}px; height: {size}px; background: {RED}; transform: rotate({a}deg)"></div>'
                 for a in (0, 22.5, 45, 67.5))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {size}px; height: {size}px; transform: rotate({ang}deg)">{sq}'
             f'<div style="position: absolute; left: 0; top: 0; width: {size}px; height: {size}px; display: flex; flex-direction: column; '
             f'align-items: center; justify-content: center; text-align: center; color: {PAPER}">{inner}</div></div>')

# ---------------- props ----------------
def ticket(o, x, y, ang):
    rows = [('Deliver to', 'The grate, by the alley'), ('Out', '9:28 PM'), ('Arrived', '10:00 PM')]
    r = ''.join(f'<div style="display: flex; border-bottom: 1px solid #b9b3a3; padding: 3px 0 2px">'
                f'<div style="width: 104px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b665c; padding-top: 4px">{k}</div>'
                f'<div style="font-family: {HAND}; font-size: 20px; line-height: 1.1; color: #233a8a">{v}</div></div>' for k, v in rows)
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 330px; background: #f6f2e6; transform: rotate({ang}deg); '
             f'box-shadow: 0 6px 16px rgba(0,0,0,0.55); box-sizing: border-box; padding: 12px 16px 12px; border-top: 10px solid {RED}">'
             f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {DISP}; font-size: 18px; color: {INK}">DELIVERY</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; color: {RED}; letter-spacing: 0.08em">No. 0419</div></div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.12em; color: {RED}; margin: 2px 0 6px">30 MINUTES OR IT&rsquo;S FREE</div>'
             f'{r}'
             f'<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px">'
             f'<div style="font-family: {HAND}; font-weight: 700; font-size: 24px; line-height: 1; color: {RED}; transform: rotate(-4deg)">32 min. Late by 2!</div>'
             f'<div style="font-family: {BODY}; font-weight: 900; font-size: 22px; color: {INK}">19.90</div></div>'
             f'<div style="font-family: {HAND}; font-size: 17px; line-height: 1.15; color: #233a8a; margin-top: 4px">Customer says: never pay full price for late pizza.</div></div>')

def press_card(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 200px; background: #f4f4ee; transform: rotate({ang}deg); '
             f'box-shadow: 0 6px 14px rgba(0,0,0,0.55); border-radius: 6px; overflow: hidden">'
             f'<div style="background: #1f3d7a; padding: 7px 12px 6px; display: flex; align-items: center; gap: 10px">'
             f'<div style="width: 34px; height: 34px; border-radius: 50%; background: {PAPER}; color: #1f3d7a; font-family: {DISP}; font-size: 22px; '
             f'line-height: 34px; text-align: center">3</div>'
             f'<div style="font-family: {BODY}; font-weight: 900; font-size: 18px; letter-spacing: 0.1em; color: {PAPER}; line-height: 1.05">CHANNEL 3<br>NEWS</div></div>'
             f'<div style="padding: 8px 12px 10px">'
             f'<div style="font-family: {DISP}; font-size: 30px; color: {RED}; line-height: 1">PRESS</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; color: {INK}; margin-top: 4px">April O&rsquo;Neil</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; color: #55595c; line-height: 1.25">Reporter, field crew<br>Show on request</div></div></div>')

def tip_card(o, x, y, ang):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 340px; transform: rotate({ang}deg); background: #fffdf6; '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid {INK}; box-sizing: border-box; padding: 8px 14px">'
             f'<div style="font-family: {DISP}; font-size: 20px; color: {RED}; line-height: 1">TIPS</div>'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.25; color: {INK}; margin-top: 3px">For the driver. Down the grate is fine.</div></div>')

# ---------------- OUTSIDE ----------------
def outside():
    o = []
    folds(o, 'rgba(255,255,255,0.6)')
    # sewer-green band along the top edge
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 22px; background: {GREEN}"></div>')
    # --- flap: the cooler and April's note
    x = M
    o.append(f'<div style="position: absolute; left: {x}px; top: 44px; width: {P - 2 * M}px">'
             + kicker('Ice cold, every order', GREEN)
             + f'<div style="margin-top: 8px">{bar("COOLER", RED, PAPER)}</div>'
             + item('Green Apple Fizz', '.95', 'Fresh-pressed Granny Smiths, lime juice, club soda, over ice.', '', 14)
             + item('Fountain Soda', '.75', 'Cola, lemon-lime or root beer, on crushed ice.', '', 14)
             + item('Milk', '.60', 'Half-pint carton of whole milk, ice cold.', '', 14)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: 420px; width: {P - 2 * M}px; background: #fffdf6; transform: rotate(-1.5deg); '
             f'box-shadow: 0 6px 16px rgba(0,0,0,0.5); box-sizing: border-box; padding: 16px 20px 14px; border-left: 8px solid {GREEN}">'
             + f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.35; color: {INK}">'
               'A crime wave all week, and the only thing in this city that showed up on time was dinner. Almost.</div>'
             f'<div style="display: flex; align-items: baseline; gap: 12px; margin-top: 4px">'
             f'<div style="font-family: {HAND}; font-weight: 700; font-size: 32px; line-height: 1.1; color: #233a8a; transform: rotate(-3deg)">April O&rsquo;Neil</div>'
             '</div></div>')
    press_card(o, 222, 570, 4)
    o.append(f'<div style="position: absolute; left: {x}px; top: 616px; width: 166px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: #5a5a52">'
             f'Prices subject to change. No hockey masks at the counter. Cheese shredded by hand, no relation. Form 4&#8209;1990.</div>')

    # --- back panel: the promise, the late ticket, the press card
    x = P + M
    o.append(f'<div style="position: absolute; left: {x}px; top: 44px; width: {P - 2 * M}px">'
             + kicker('How we deliver', GREEN)
             + f'<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px">'
               f'<div style="font-family: {DISP}; font-size: 112px; line-height: 0.9; color: {RED}">30</div>'
               f'<div style="font-family: {DISP}; font-size: 25px; line-height: 1.15; color: {INK}">MINUTES<br>OR IT&rsquo;S<br>FREE</div></div>'
             + f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {INK}; margin-top: 10px">'
               'Any door, any stoop, any fire escape. No address? Tell us the corner and we&rsquo;ll find the grate.</div>'
             + '</div>')
    o.append(f'<div style="position: absolute; left: {x - 4}px; top: 268px; width: 360px; padding: 4px; background: {RED}; box-shadow: 0 6px 16px rgba(0,0,0,0.5)">'
             f'<img src="assets/still-counter.jpg" alt="At the pizza counter a pie waits on a blue tray for a regular customer in a hood" '
             f'style="display: block; width: 360px; height: 190px"></div>'
             f'<div style="position: absolute; left: {x}px; top: 470px; width: {P - 2 * M}px; font-family: {BODY}; font-style: italic; font-size: 17px; '
             f'line-height: 1.25; color: #55595c">Pick-up at the counter. Regulars come in all sizes.</div>')
    ticket(o, x + 4, 510, -2)

    # --- front cover
    x = 2 * P + M
    o.append(f'<div style="position: absolute; left: {x}px; top: 44px; width: {P - 2 * M}px; text-align: center">'
             + kicker('Free delivery &middot; Est. 1984', GREEN)
             + f'<div style="font-family: {DISP}; font-size: 64px; line-height: 1; color: {GREEN}; margin-top: 12px">CORNER<br>GRATE</div>'
             + f'<div style="display: inline-block; background: {RED}; color: {PAPER}; font-family: {DISP}; font-size: 76px; line-height: 1; '
               f'padding: 8px 14px 10px; margin-top: 12px; box-shadow: 0 4px 0 {INK}">PIZZA</div></div>')
    # hero: the four of them under the lifted manhole cover, full panel width
    o.append(f'<div style="position: absolute; left: {2 * P}px; top: 340px; width: {P}px; height: 330px; border-top: 5px solid {RED}; border-bottom: 5px solid {RED}">'
             f'<img src="assets/still-hero.jpg" alt="Four regulars peek out from under a lifted manhole cover in the street at night, skyscrapers lit up behind them" '
             f'style="display: block; width: {P}px; height: 330px"></div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: 690px; width: {P - 2 * M}px; text-align: center">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.25; color: #55595c">We deliver anywhere. Yes, even there.</div>'
             f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {RED}; margin-top: 10px">555&#8209;1990</div>'
             '</div>')
    return page(''.join(o), 'outside', '#f1ead8', 0.2)

# ---------------- INSIDE ----------------
def inside():
    o = []
    TT, TH, TW = 36, 370, 376
    tiles = [('still-rooftop.jpg', 'Two regulars on a tar rooftop at night, brick walk-ups and fire escapes behind'),
             ('still-antiques.jpg', 'April outside the 2nd Time Around antique shop at night, with a regular in the street'),
             ('still-drop.jpg', 'Looking down an open manhole at night, a regular peers up out of the sewer')]
    for i, (src, alt) in enumerate(tiles):
        o.append(f'<div style="position: absolute; left: {i * P + 36 - 4}px; top: {TT - 4}px; border: 4px solid {INK}; background: {INK}">'
                 f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {TW}px; height: {TH}px"></div>')
    def pin(n, x, y, text):
        o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; background: {PAPER}; color: {INK}; font-family: {BODY}; font-weight: 700; '
                 f'font-size: 15px; letter-spacing: 0.08em; padding: 4px 9px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4)">'
                 f'<span style="color: {RED}; font-weight: 900">{n}</span>&nbsp; {text}</div>')
    pin(1, 52, 52, 'ROOFTOPS, ON REQUEST')
    pin(2, P + 52, 52, 'APRIL&rsquo;S, OVER THE SHOP')
    pin(3, 2 * P + 52, 52, 'THE MANHOLE DROP')
    pin(4, 2 * P + 52, 362, 'THE LAIR BELOW. BIG ORDERS.')
    o.append(f'<div style="position: absolute; left: {P + 52}px; top: 352px; background: {RED}; color: {PAPER}; font-family: {DISP}; font-size: 18px; '
             f'line-height: 1; padding: 8px 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.4)">WE DELIVER ABOVE<br>AND BELOW</div>')

    # menu columns
    top = 430
    cols = [
        ('PIES', item('Plain Cheese Pie', '7.50', 'Hand-tossed thin crust, red sauce, whole milk mozzarella. Slice 1.25.', '', 14)
                 + item('Pepperoni Pie', '8.75', 'Thin crust, red sauce, mozzarella, spicy salami cups crisped at the edges.', '', 14)
                 + item('Cowabunga Box', '19.90', 'Four thin pies: pepperoni, mushroom, the works, and a cook&rsquo;s choice.', '', 14)),
        ('SIDES', item('Pizza Rolls', '3.25', 'A dozen pinwheels: dough, red sauce, pepperoni, mozzarella. Baked golden.', '', 14)
                  + item('Garlic Knots', '1.84', 'Six tied knots brushed with garlic butter, parsley and parm.', '', 14)
                  + item('Sensei&rsquo;s Cheeses', '5.50', 'Aged cheddar, brie, gouda, crackers, grapes, honey on the brie.', '', 14)),
        ('SWEETS', item('Cookie Pizza', '3.50', 'Chocolate chip dough baked in a pie tin, chocolate drizzle, candy.', '', 14)
                   + item('Lemon Ice', '1.00', 'Shaved Italian ice, fresh lemon and sugar, in a paper cup.', '', 14)),
    ]
    for i, (h, body) in enumerate(cols):
        x = i * P + M
        o.append(f'<div style="position: absolute; left: {x}px; top: {top}px; width: {P - 2 * M}px">{bar(h, IRON if i != 1 else GREEN)}{body}</div>')
    tip_card(o, 2 * P + M, 700, 0)
    folds(o, 'rgba(255,255,255,0.45)')
    return page(''.join(o), 'inside', STOCK, 0.22)

FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Corner Grate Pizza, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
