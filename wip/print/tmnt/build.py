"""Corner Grate Pizza, Lower Manhattan, 1990: the takeaway trifold the pizza place leaves on doorsteps
(and drops down manholes). Two landscape faces 1344x816, three 448px panels each, folds at 448 and 896.
Outside (iron grey, the night street): flap with the cooler and April's note, back panel with the
30 minute promise, the late delivery ticket and her Channel 3 press card, front cover with the sign and
the view down the manhole.
Inside (sewer green stock): the painted cutaway delivery map across all three panels (paint.py), then
the menu in three columns and the tip grate.
Writes still crops, paper/wear textures, outside/inside .body.html and .html."""
import os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
if not os.path.exists(A('sewer-map.png')):
    subprocess.run([sys.executable, os.path.join(D, 'paint.py')], check=True)

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
fit(mh, 272, 272, (250, 0, 1330, 1080)).save(A('still-manhole.jpg'), quality=90)
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
texture('outside', None, (10, 12, 14), 1990, 110, 40)
texture('inside', None, (60, 70, 40), 1984, 70, 22)

# ---------------- pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def bar(t, bg=IRON, fg=PAPER, size=40):
    rivets = ''.join(f'<div style="position: absolute; {side}: 10px; top: {top}px; width: 7px; height: 7px; border-radius: 50%; background: #6d7378"></div>'
                     for side in ('left', 'right') for top in (10, 37))
    return (f'<div style="position: relative; background: {bg}; color: {fg}; font-family: {DISP}; font-size: {size}px; line-height: 1; '
            f'padding: 6px 28px 8px; border-radius: 4px; box-shadow: 0 3px 0 {INK}">{rivets}{t}</div>')

def item(name, price, desc, note='', gap=16, color=INK, pc=RED, nc=RED):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-weight: 500; font-size: 18px; line-height: 1.2; color: {nc}; margin-top: 3px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 900; '
            f'font-size: 27px; line-height: 1.1; color: {color}; text-transform: uppercase; letter-spacing: 0.01em"><span>{name}</span>'
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

def tip_grate(o, x, y, ang):
    slots = ''.join(f'<div style="position: absolute; left: {16 + i * 22}px; top: 14px; width: 11px; height: 62px; border-radius: 6px; background: #0e1110"></div>'
                    for i in range(6))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 330px; transform: rotate({ang}deg); display: flex; align-items: center; gap: 14px">'
             f'<div style="position: relative; flex: none; width: 150px; height: 90px; background: #4a4f53; border-radius: 10px; '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.45); border: 3px solid {INK}">{slots}</div>'
             f'<div><div style="font-family: {DISP}; font-size: 22px; color: {INK}; line-height: 1">TIPS</div>'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.25; color: {INK}; margin-top: 4px">For the driver. Down the grate is fine, we know the way.</div></div></div>')

# ---------------- OUTSIDE ----------------
def outside():
    o = []
    folds(o, 'rgba(255,255,255,0.10)')
    # --- flap: the cooler and April's note
    x = M
    o.append(f'<div style="position: absolute; left: {x}px; top: 44px; width: {P - 2 * M}px">'
             + kicker('Ice cold, every order', '#9cc48a')
             + f'<div style="margin-top: 8px">{bar("COOLER", RED, PAPER)}</div>'
             + item('Green Apple Fizz', '.95', 'Fresh-pressed Granny Smiths, lime juice, club soda, over ice.', 'As seen on Channel 3.', 14, PAPER, '#9cc48a', '#9cc48a')
             + item('Fountain Soda', '.75', 'Cola, lemon-lime or root beer, on crushed ice.', '', 14, PAPER, '#9cc48a')
             + item('Milk', '.60', 'Half-pint carton, whole, straight from the cooler.', '', 14, PAPER, '#9cc48a')
             + '</div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: 424px; width: {P - 2 * M}px; background: {PAPER}; transform: rotate(-1.5deg); '
             f'box-shadow: 0 6px 16px rgba(0,0,0,0.5); box-sizing: border-box; padding: 16px 20px 14px; border-left: 8px solid {GREEN}">'
             + kicker('Posted by the register', GREEN, 15)
             + f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.35; color: {INK}; margin-top: 6px">'
               'A crime wave all week, and the only thing in this city that showed up on time was dinner. Almost.</div>'
             f'<div style="display: flex; align-items: baseline; gap: 12px; margin-top: 4px">'
             f'<div style="font-family: {HAND}; font-weight: 700; font-size: 32px; line-height: 1.1; color: #233a8a; transform: rotate(-3deg)">April O&rsquo;Neil</div>'
             '</div></div>')
    press_card(o, 214, 600, 4)
    o.append(f'<div style="position: absolute; left: {x}px; top: 628px; width: 160px; font-family: {BODY}; font-weight: 500; font-size: 17px; line-height: 1.3; color: #c9ccc4">'
             f'<div style="font-family: {DISP}; font-size: 15px; color: {RED}; margin-bottom: 4px">HOUSE RULES</div>No hockey masks at the counter. Hold on to your wallets on the subway.</div>')

    # --- back panel: the promise, the late ticket, the press card
    x = P + M
    o.append(f'<div style="position: absolute; left: {x}px; top: 44px; width: {P - 2 * M}px">'
             + kicker('How we deliver', '#9cc48a')
             + f'<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px">'
               f'<div style="font-family: {DISP}; font-size: 112px; line-height: 0.9; color: {RED}">30</div>'
               f'<div style="font-family: {DISP}; font-size: 25px; line-height: 1.15; color: {PAPER}">MINUTES<br>OR IT&rsquo;S<br>FREE</div></div>'
             + f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {PAPER}; margin-top: 10px">'
               'Any door, any stoop, any fire escape. No address? Tell us the corner and we&rsquo;ll find the grate.</div>'
             + '</div>')
    o.append(f'<div style="position: absolute; left: {x - 4}px; top: 268px; width: 360px; padding: 4px; background: {RED}; box-shadow: 0 6px 16px rgba(0,0,0,0.5)">'
             f'<img src="assets/still-counter.jpg" alt="At the pizza counter a pie waits on a blue tray for a regular customer in a hood" '
             f'style="display: block; width: 360px; height: 190px"></div>'
             f'<div style="position: absolute; left: {x}px; top: 470px; width: {P - 2 * M}px; font-family: {BODY}; font-style: italic; font-size: 17px; '
             f'line-height: 1.25; color: #c9ccc4">Pick-up at the counter. Regulars come in all sizes.</div>')
    ticket(o, x + 4, 510, -2)

    # --- front cover
    x = 2 * P + M
    o.append(f'<div style="position: absolute; left: {x}px; top: 44px; width: {P - 2 * M}px; text-align: center">'
             + kicker('Free delivery &middot; Est. 1984', '#9cc48a')
             + f'<div style="font-family: {DISP}; font-size: 50px; line-height: 1; color: {PAPER}; margin-top: 12px">CORNER<br>GRATE</div>'
             + f'<div style="display: inline-block; background: {RED}; color: {PAPER}; font-family: {DISP}; font-size: 66px; line-height: 1; '
               f'padding: 8px 18px 10px; margin-top: 10px; box-shadow: 0 4px 0 {INK}">PIZZA</div></div>')
    # the view down the manhole: an iron ring with a tread of bolts
    cx, cy, ro = 2 * P + P // 2, 462, 166
    bolts = ''
    import math
    for i in range(28):
        a = i / 28 * 2 * math.pi
        bx, by = cx + math.cos(a) * (ro - 12) - 4, cy + math.sin(a) * (ro - 12) - 4
        bolts += f'<div style="position: absolute; left: {bx:.0f}px; top: {by:.0f}px; width: 8px; height: 8px; border-radius: 50%; background: #7d8388"></div>'
    o.append(f'<div style="position: absolute; left: {cx - ro}px; top: {cy - ro}px; width: {2 * ro}px; height: {2 * ro}px; border-radius: 50%; '
             f'background: #555b60; box-shadow: 0 0 0 4px {INK}, 0 10px 30px rgba(0,0,0,0.7)"></div>{bolts}'
             f'<div style="position: absolute; left: {cx - 136}px; top: {cy - 136}px; width: 272px; height: 272px; border-radius: 50%; overflow: hidden; '
             f'box-shadow: 0 0 0 4px {INK}">'
             f'<img src="assets/still-manhole.jpg" alt="Looking down an open manhole at night, a regular customer peers up out of the sewer" '
             f'style="display: block; width: 272px; height: 272px"></div>')
    burst(o, 2 * P + 306, 284, 116, 12,
          f'<div style="font-family: {DISP}; font-size: 15px; line-height: 1.1">COWA<br>BUNGA!</div>'
          f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; line-height: 1.1; margin-top: 3px">Party box<br>19.90</div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: 646px; width: {P - 2 * M}px; text-align: center">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.25; color: #c9ccc4">We deliver to any address. Yes, even that one.</div>'
             f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {PAPER}; margin-top: 10px">555&#8209;1990</div>'
             f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: #c9ccc4; margin-top: 8px">Open late. Prices subject to change. Mozzarella shredded by hand, no relation. Form 4&#8209;1990, N.Y., N.Y.</div></div>')
    return page(''.join(o), 'outside', IRON, 0.16)

# ---------------- INSIDE ----------------
def inside():
    o = []
    MW, MH, MT = 1272, 330, 36
    o.append(f'<div style="position: absolute; left: {36 - 4}px; top: {MT - 4}px; width: {MW}px; height: {MH}px; border: 4px solid {INK}; background: {INK}">'
             f'<img src="assets/sewer-map.png" alt="Painted cutaway of the block at night: April&rsquo;s building with the antique shop downstairs, Corner Grate Pizza under its striped awning, '
             f'rooftops and water towers, and below the street a brick sewer tunnel, the open manhole with a pizza box falling down the shaft, and the lair with an old TV, an armchair and a tower of empty pizza boxes" '
             f'style="display: block; width: {MW}px; height: {MH}px"></div>')
    mx = lambda v: 36 + v
    my = lambda v: MT + v
    # signs lettered on the painted shopfronts
    o.append(f'<div style="position: absolute; left: {mx(50)}px; top: {my(131)}px; width: 240px; height: 16px; text-align: center; font-family: {BODY}; '
             f'font-weight: 900; font-size: 14px; line-height: 16px; letter-spacing: 0.06em; color: #4a2e1e">2ND TIME AROUND ANTIQUES</div>')
    o.append(f'<div style="position: absolute; left: {mx(476)}px; top: {my(124)}px; width: 278px; height: 16px; text-align: center; font-family: {DISP}; '
             f'font-size: 14px; line-height: 17px; color: {PAPER}">CORNER GRATE PIZZA</div>')
    # headline painted on the tunnel wall
    o.append(f'<div style="position: absolute; left: {mx(372)}px; top: {my(250)}px; width: 300px; text-align: center">'
             + kicker('Our delivery area', '#e6c86e', 15)
             + f'<div style="font-family: {DISP}; font-size: 25px; line-height: 1.05; color: {PAPER}; margin-top: 4px">ABOVE AND<br>BELOW</div></div>')
    # numbered call-outs
    def tag(n, x, y, text, flip=False):
        o.append(f'<div style="position: absolute; left: {mx(x)}px; top: {my(y)}px; display: flex; align-items: center; gap: 6px; '
                 f'{"flex-direction: row-reverse;" if flip else ""}">'
                 f'<div style="width: 26px; height: 26px; border-radius: 50%; background: {RED}; color: {PAPER}; font-family: {BODY}; font-weight: 900; '
                 f'font-size: 16px; line-height: 26px; text-align: center; box-shadow: 0 0 0 2px {PAPER}">{n}</div>'
                 f'<div style="background: {PAPER}; color: {INK}; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; '
                 f'padding: 3px 7px; white-space: nowrap">{text}</div></div>')
    tag(1, 52, 224, 'THE LAIR. BIG ORDERS.')
    tag(2, 742, 200, 'THE MANHOLE DROP')
    tag(3, 196, 50, 'APRIL&rsquo;S, 3RD FL.')
    tag(4, 486, 92, 'US. SINCE 1984')
    tag(5, 1050, 116, 'ROOFTOPS, ON REQUEST')

    # menu columns
    top = 392
    cols = [
        ('PIES', item('Plain Cheese Pie', '7.50', 'Hand-tossed thin crust, red sauce, whole milk mozzarella. Slice 1.25.', '', 14)
                 + item('Pepperoni Pie', '8.75', 'Thin crust, red sauce, mozzarella, spicy salami cups crisped at the edges.', '', 14)
                 + item('Cowabunga Party Box', '19.90', 'Four thin pies: pepperoni, mushroom, the works, and a cook&rsquo;s choice.', 'You call the toppings.', 14)),
        ('SIDES', item('Pizza Rolls', '3.25', 'A dozen pinwheels: dough, red sauce, pepperoni, mozzarella. Baked golden.', '', 14)
                  + item('Garlic Knots', '1.84', 'Six tied knots brushed with garlic butter, parsley and parm.', '', 14)
                  + item('Sensei&rsquo;s Cheese Board', '5.50', 'Aged cheddar, brie, gouda, crackers, grapes, honey on the brie.', 'Very wise. Very old school.', 14)),
        ('SWEETS', item('Cookie Pizza', '3.50', 'Chocolate chip dough baked in a pie tin, chocolate drizzle, candy.', 'Cut in wedges, like it should be.', 14)
                   + item('Lemon Ice', '1.00', 'Shaved Italian ice, fresh lemon and sugar, in a paper cup.', '', 14)),
    ]
    for i, (h, body) in enumerate(cols):
        x = i * P + M
        o.append(f'<div style="position: absolute; left: {x}px; top: {top}px; width: {P - 2 * M}px">{bar(h, IRON if i != 1 else GREEN)}{body}</div>')
    tip_grate(o, 2 * P + M, 680, 0)
    folds(o, 'rgba(255,255,255,0.45)')
    return page(''.join(o), 'inside', STOCK, 0.22)

FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Corner Grate Pizza, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
