"""The Halloway, a grand hotel on Fifth Avenue at the park, New York, Christmas 1992. In-suite dining door hanger.
Room service door hanger, two faces 480x1200 (5 x 12.5 in) with the die-cut hole and slit for the door handle.
Ivory card, Christmas crimson (the hallway carpet) and holly green (Kevin's coat), one stock, two inks.
Front: crimson head with the hole and a toy store gift tag on its string, the real 1905 photo of Fifth Avenue
after a snowstorm (the signature piece), Mr. Hector's note, supper.
Back: holly green head with the hole and a guest charge slip, the Christmas suite still, little suppers,
sweets and warm cups, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 480, 1200
PAPER, RED, GREEN, INK, MUTE, CARD = '#f6f0e1', '#a4192c', '#1d4a35', '#231c17', '#5d5148', '#fffdf6'
FONTS = ('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700'
         '&family=Alegreya:ital,wght@0,400;0,700;0,800;1,400&family=Mrs+Saint+Delafield&family=Caveat:wght@600&display=swap')
DISP = "'Mountains of Christmas', serif"; BODY = "'Alegreya', serif"
SIG = "'Mrs Saint Delafield', cursive"; HAND = "'Caveat', cursive"
HX, HY, HR = 240, 96, 56          # die-cut hole centre and radius
L, CW = 40, 400                   # left margin, column width

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def soften(im, boxes, r=10):
    """Melt the old shop lettering into soft blur so no business name reads (feathered mask)."""
    blur = im.filter(ImageFilter.GaussianBlur(r))
    m = Image.new('L', im.size, 0); md = ImageDraw.Draw(m)
    for b in boxes: md.rectangle(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(12))
    return Image.composite(blur, im, m)

# Fifth Avenue after a snow storm, Detroit Publishing Co., c.1905 (LOC det.4a12278). Scale 1024 view -> master x4.93.
k = 5047 / 1024
ave = Image.open(S('det-4a12278u.tif')).convert('L')
ave = soften(ave, [(int(125 * k), int(120 * k), int(170 * k), int(200 * k)),     # vertical shop sign, left
                   (int(530 * k), int(360 * k), int(585 * k), int(395 * k))], 14)  # awning lettering
ave = ImageOps.autocontrast(ave, cutoff=0.6)
ave = ImageEnhance.Brightness(ave).enhance(1.04)
ave = Image.merge('RGB', [ave.point(lambda v, a=a: int(v * a + (1 - a) * 18)) for a in (1.0, 0.985, 0.95)])  # faint warm black
fit(ave, CW - 8, 322, (int(128 * k), int(78 * k), int(684 * k), int(600 * k))).save(A('fifth-avenue-1905.jpg'), quality=90)

suite = Image.open(S('ghL9wx7oaz2zMiTcqQkLsOnJBFq.jpg')).convert('RGB')
suite = ImageEnhance.Brightness(suite).enhance(1.08)
fit(suite, CW - 8, 166, (240, 120, 1640, 725)).save(A('suite-tree.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2.3)))
    m = m.filter(ImageFilter.GaussianBlur(11))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))
    lay = Image.new('RGBA', (W, H), (120, 84, 30, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 11); wear('back', 411)

# ---------------- type pieces ----------------
def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1; text-align: center;{extra}">{t}</div>')

def ornament(t, top=0):
    """Section title: crimson display words between double holly rules, a small diamond at each inner end."""
    def side(flip):
        d = (f'<div style="position: absolute; {"right" if flip else "left"}: 0; top: 0; width: 9px; height: 9px; background: {RED}; transform: rotate(45deg)"></div>')
        return (f'<div style="position: relative; flex: 1; height: 9px; margin: 0 10px">'
                f'<div style="position: absolute; left: {0 if flip else 16}px; right: {16 if flip else 0}px; top: 1px; height: 2px; background: {GREEN}"></div>'
                f'<div style="position: absolute; left: {0 if flip else 16}px; right: {16 if flip else 0}px; top: 6px; height: 1px; background: {GREEN}"></div>'
                + d + '</div>')
    return (f'<div style="display: flex; align-items: center; margin-top: {top}px">' + side(False)
            + f'<div style="font-family: {DISP}; font-weight: 700; font-size: 40px; line-height: 1.05; color: {RED}; white-space: nowrap">{t}</div>'
            + side(True) + '</div>')

def item(name, price, desc, gap=16):
    box = (f'<span style="display: inline-block; width: 17px; height: 17px; border: 2px solid {GREEN}; background: {CARD}; '
           f'box-sizing: border-box; margin-right: 11px; position: relative; top: 1px"></span>')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 27px; line-height: 1.12; color: {INK}">'
            f'<span style="white-space: nowrap">{box}{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.28; color: {INK}; margin-top: 3px; padding-left: 30px">{desc}</div></div>')

def frame(src, w, h, alt):
    return (f'<div style="border: 2px solid {GREEN}; padding: 3px; background: {CARD}; width: {w}px; box-sizing: content-box">'
            f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

def hanger_head(color, height):
    """Coloured head panel with the die-cut hole and the slit up to the top edge (cut shows white)."""
    return (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {height}px; background: {color}"></div>'
            f'<div style="position: absolute; left: 0; top: {height}px; width: {W}px; height: 3px; background: {GREEN if color == RED else RED}"></div>'
            f'<div style="position: absolute; left: {HX - HR}px; top: {HY - HR}px; width: {HR * 2}px; height: {HR * 2}px; border-radius: 50%; background: #ffffff"></div>'
            f'<div style="position: absolute; left: {HX - 2}px; top: 0; width: 4px; height: {HY - HR + 4}px; background: #ffffff"></div>'
            f'<div style="position: absolute; left: {HX - HR - 9}px; top: {HY - HR - 9}px; width: {HR * 2 + 18}px; height: {HR * 2 + 18}px; border-radius: 50%; '
            f'border: 1px solid rgba(246,240,225,0.55); box-sizing: border-box"></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; border-radius: 22px 22px 6px 6px">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.3; object-fit: cover">'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def gift_tag(o, x, y):
    """Duncan's Toy Chest gift tag, tied through the hanger hole on red string."""
    o.append(f'<div style="position: absolute; left: {HX + HR - 14}px; top: {HY - 8}px; width: 74px; height: 2px; background: #d9b25a; '
             f'transform: rotate(38deg); transform-origin: 0 50%"></div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 128px; height: 176px; background: {CARD}; border-radius: 16px 16px 4px 4px; '
             f'box-shadow: 0 3px 8px rgba(30,0,0,0.45); transform: rotate(9deg); box-sizing: border-box; padding: 30px 9px 0; text-align: center">'
             f'<div style="position: absolute; left: 55px; top: 9px; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #d9b25a; background: {RED}; box-sizing: border-box"></div>'
             f'<div style="border-top: 2px solid {GREEN}; border-bottom: 2px solid {GREEN}; padding: 4px 0 3px; font-family: {BODY}; font-weight: 800; font-size: 14px; '
             f'letter-spacing: 0.08em; line-height: 1.15; color: {GREEN}">DUNCAN\'S<br>TOY CHEST</div>'
             f'<div style="margin-top: 7px; font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.2; color: {INK}">Turtle doves,<br>a pair</div>'
             f'<div style="margin-top: 5px; font-family: {HAND}; font-size: 21px; line-height: 1.0; color: {RED}">one for you,<br>one for a friend</div></div>')

def charge_slip(o, x, y):
    """Guest charge slip, the room service tab, tucked into the back head."""
    rows = [('ROOM', '411'), ('SERVER', 'Cedric'), ('TOTAL', '$967.43')]
    cells = ''.join(f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #b9b0a2; height: 23px">'
                    f'<span style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.1em; color: {GREEN}">{a}</span>'
                    f'<span style="font-family: {HAND}; font-size: 22px; line-height: 1; color: #23305e">{b}</span></div>' for a, b in rows)
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 176px; background: #fbfaf5; box-shadow: 0 3px 8px rgba(0,20,10,0.5); '
             f'transform: rotate(-6deg); padding: 8px 10px 6px; box-sizing: border-box">'
             f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.12em; line-height: 1.1; color: {RED}; text-align: center">GUEST CHARGE</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.25; color: {MUTE}; text-align: center; margin-bottom: 4px">In-suite dining</div>'
             + cells +
             f'<div style="border-top: 1px solid {INK}; margin-top: 20px; position: relative; height: 18px">'
             f'<div style="position: absolute; left: 2px; top: -30px; font-family: {HAND}; font-size: 25px; line-height: 1; color: #23305e; white-space: nowrap; transform: rotate(-3deg)">Peter McCallister</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.2; color: {MUTE}; padding-top: 1px">Guest signature</div></div></div>')

# ---------------- FRONT ----------------
def front():
    o = [hanger_head(RED, 300)]
    gift_tag(o, 330, 26)
    o.append(f'<div style="position: absolute; left: {L}px; top: 168px; width: {CW}px">{kicker("Fifth Avenue at the Park", PAPER)}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 188px; width: {W}px; text-align: center; font-family: {DISP}; font-weight: 700; '
             f'font-size: 66px; line-height: 1; color: {PAPER}; white-space: nowrap">The Halloway</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 262px; width: {CW}px">{kicker("In-suite dining, day and night", "#f2c9a8", "font-size: 17px; letter-spacing: 0.16em")}</div>')
    o.append(f'<div style="position: absolute; left: {L - 5}px; top: 320px">'
             + frame('fifth-avenue-1905.jpg', CW + 2, 322, 'Fifth Avenue after a snowstorm, two women in long coats walking between snowbanks, a clock tower beyond') + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 658px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}; text-align: center">'
             'Fifth Avenue after a snowstorm, our first winter on the avenue.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 712px; width: {CW}px; box-sizing: border-box; border-left: 4px solid {GREEN}; padding: 2px 0 0 16px">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.34; color: {INK}">'
             'Should you or your young ones require anything at all, simply ring. The kitchen never sleeps, and neither does the front desk.</div>'
             f'<div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 10px; margin-top: -2px">'
             f'<span style="font-family: {SIG}; font-size: 40px; line-height: 1.1; color: {RED}">Mr. Hector</span>'
             f'<span style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {GREEN}">CONCIERGE</span></div></div>')
    menu = (kicker('Served until two in the morning', GREEN)
            + ornament('Supper in the Suite', 6)
            + item('Triple-decker club', '14.50', 'Poached chicken, crisp bacon, iceberg, tomato and mayonnaise on toasted white, cut in four.', 10)
            + item('Lobster mac and cheese', '28.00', 'Butter-poached tail meat and elbows in Gruy&egrave;re and cheddar sauce, baked under golden crumbs.')
            + item('Shoestring potatoes', '5.50', 'Fried crisp and salted, ketchup on the side.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 888px; width: {CW}px">{menu}</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = [hanger_head(GREEN, 250)]
    charge_slip(o, 296, 18)
    o.append(f'<div style="position: absolute; left: 30px; top: 30px; width: 130px; font-family: {BODY}; font-weight: 800; font-size: 14px; '
             f'letter-spacing: 0.14em; line-height: 1.5; color: {PAPER}">ROOM NO.<div style="width: 108px; height: 30px; border-bottom: 1px solid {PAPER}; '
             f'font-family: {HAND}; font-weight: 600; font-size: 28px; letter-spacing: 0; line-height: 30px; color: {PAPER}"></div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 166px; width: {CW}px">{kicker("Tick, then hang on your handle", "#f2c9a8", "font-size: 17px; letter-spacing: 0.16em")}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 188px; width: {W}px; text-align: center; font-family: {DISP}; font-weight: 700; '
             f'font-size: 50px; line-height: 1; color: {PAPER}; white-space: nowrap">We Knock Softly</div>')
    o.append(f'<div style="position: absolute; left: {L - 5}px; top: 272px">'
             + frame('suite-tree.jpg', CW + 2, 166, 'A grand hotel suite with a lit Christmas tree, chandeliers and presents piled across the floor') + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 454px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}; text-align: center">'
             'A park-side suite, dressed for Christmas.</div>')
    menu = (ornament('Little Suppers')
            + item('Cheese pizza for one', '16.00', 'Tomato sauce and plenty of mozzarella, boxed hot for the limousine.', 8)
            + item('Minibar mix', '9.67', 'Nuts roasted with rosemary and brown sugar, chocolate almonds and pretzels.')
            + ornament('Sweets &amp; Warm Cups', 16)
            + item('The Works sundae', '9.50', 'Vanilla ice cream, hot fudge, whipped cream, nuts, sprinkles and a cherry.', 8)
            + item('Hot apple cider', '4.50', 'Mulled with cinnamon, cloves and orange peel.')
            + item('Hot cocoa', '4.11', 'Whole milk, a heap of marshmallows.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 494px; width: {CW}px">{menu}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1066px; width: {CW}px; border-top: 1px solid {GREEN}; padding-top: 8px; '
             f'font-family: {BODY}; font-size: 16px; line-height: 1.32; color: {MUTE}; text-align: center">'
             f'<span style="font-weight: 800; letter-spacing: 0.14em; color: {GREEN}">THE HALLOWAY</span>, Fifth Avenue at Central Park South, New York.<br>'
             'Tonight on the in-room channel: <i>Angels with Even Filthier Souls</i>.<br>'
             'Prices subject to change. Form 411-92.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Halloway room service, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
