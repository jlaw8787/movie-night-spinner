"""The Babylon Club, Miami Beach, 1983. Where Tony, Frank and Elvira go out at night.
Tall nightclub menu, two faces 672x1344 (7 x 14 in), black gloss stock, neon pink and gold.
Front: the club's neon sign, a framed still of the dance floor, the VIP card, the bar list.
Back: real Miami Beach Art Deco hotel (HABS photo) in pink duotone with a flamingo tile on it,
"THE WORLD IS YOURS" in neon, the kitchen list, Frank's line, house rules, the blimp ticket.
Writes photo crops, gloss and grain overlays, front/back .body.html and .html."""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 672, 1344
BLACK, CREAM, PINK, GOLD, MUTE = '#0d0a0e', '#f7efe4', '#ff4fa8', '#e9b54c', '#bfb2a8'
FONTS = ('https://fonts.googleapis.com/css2?family=Tilt+Neon&family=Josefin+Sans:ital,wght@0,400;0,600;0,700;1,400'
         '&family=Allura&display=swap')
DISP = "'Tilt Neon', sans-serif"; BODY = "'Josefin Sans', sans-serif"; SCRIPT = "'Allura', cursive"


# ---------------- photos ----------------
def cover(im, w, h, cx=0.5, cy=0.5):
    """Crop to the w:h ratio around (cx, cy) and resize to 2x."""
    iw, ih = im.size; r = w / h
    if iw / ih > r:
        nw = int(ih * r); x0 = int((iw - nw) * cx); im = im.crop((x0, 0, x0 + nw, ih))
    else:
        nh = int(iw / r); y0 = int((ih - nh) * cy); im = im.crop((0, y0, iw, y0 + nh))
    return im.resize((w * 2, h * 2), Image.LANCZOS)

def duotone(g, dark, light):
    g = ImageOps.autocontrast(g.convert('L'), cutoff=1)
    return ImageOps.colorize(g, dark, light)

# front hero: Elvira and Tony on the Babylon dance floor
HERO_W, HERO_H = 592, 400
st = Image.open(S('az8n4ty1MklkjIX23I0qig4BZcp.jpg')).convert('RGB')
st = ImageEnhance.Brightness(ImageEnhance.Contrast(st).enhance(1.04)).enhance(1.12)
cover(st, HERO_W, HERO_H, 0.42, 0.3).save(A('floor-still.jpg'), quality=90)

# back: Art Deco hotel on Ocean Drive, HABS FL-322-K. Crop keeps the tower and leaves the name sign out.
PH = 380
hotel = Image.open(S('century-master.jpg')).crop((560, 120, 4440, 1990))
hotel = ImageEnhance.Contrast(hotel).enhance(1.15)
duotone(cover(hotel, W, PH, 0.5, 0.12), '#2a0a1e', '#ffd6ea').save(A('ocean-drive.jpg'), quality=90)

# flamingo tile: the two flamingos from the Victor Hotel lobby mural (HABS FL-322-Z), glazed pink
fl = Image.open(S('mural-master.jpg')).crop((2480, 1660, 3780, 2560))
fl = duotone(fl, '#5a0f36', '#ffd3e6').resize((340, 236), Image.LANCZOS)
fl.save(A('flamingo-tile.jpg'), quality=90)

# blimp for the ticket
bl = Image.open(S('7dAGeHU2p9r0sBNUGr495xZ0i1l.jpg')).convert('RGB').crop((100, 110, 1260, 660))
ImageEnhance.Brightness(bl).enhance(1.05).resize((300, 142), Image.LANCZOS).save(A('blimp.jpg'), quality=90)

# light speckle for black stock, from the shared grain
g = Image.open(A('paper-grain.png')).convert('RGBA')
rr, gg, bb, aa = g.split()
Image.merge('RGBA', (rr.point(lambda v: 240), gg.point(lambda v: 228), bb.point(lambda v: 222), aa)).save(A('paper-grain-light.png'))

def gloss(name, y0):
    """Soft horizontal band of gloss sheen across black stock plus gentle edge falloff."""
    sh = Image.new('L', (W, H), 0); d = ImageDraw.Draw(sh)
    for i in range(0, 220, 2):
        a = int(22 * (1 - abs(i - 110) / 110))
        d.polygon([(0, y0 + i), (W, y0 + i - 260), (W, y0 + i - 258), (0, y0 + i + 2)], fill=a)
    sh = sh.filter(ImageFilter.GaussianBlur(44))
    lay = Image.new('RGBA', (W, H), (255, 245, 250, 0)); lay.putalpha(sh)
    edge = Image.new('L', (W, H), 0); ed = ImageDraw.Draw(edge)
    for i in range(30):
        ed.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, 120 - i * 4))
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    dark = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dark.putalpha(edge)
    Image.alpha_composite(lay, dark).save(A(f'gloss-wear-{name}.png'))
gloss('front', 780); gloss('back', 1060)


# ---------------- type pieces ----------------
def kicker(t, color=GOLD, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def neon(t, size, color=PINK, extra=''):
    return (f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1; color: #fff3f9; '
            f'text-shadow: 0 0 3px {color}, 0 0 9px {color}, 0 0 22px {color}, 0 0 40px {color}aa; white-space: nowrap;{extra}">{t}</div>')

def deco_title(t, color=GOLD):
    """Section title between stepped Art Deco gold rules, like the hotel tower's speed lines."""
    def steps(flip):
        o = ''
        for i, wdt in enumerate((92, 70, 48)):
            o += (f'<div style="height: 3px; width: {wdt}px; background: {GOLD}; margin: {"0 0 5px auto" if not flip else "0 auto 5px 0"}"></div>')
        return f'<div style="width: 92px; padding-top: 6px">{o}</div>'
    return (f'<div style="display: flex; align-items: center; justify-content: center; gap: 18px">'
            + steps(False) + f'<div style="font-family: {DISP}; font-size: 44px; line-height: 1; color: {color}; '
            f'text-shadow: 0 0 10px {color}88; white-space: nowrap">{t}</div>' + steps(True) + '</div>')

def item(name, price, desc, gap=18):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 27px; line-height: 1.1; color: {CREAM}">'
            f'<span>{name}</span><span style="color: {GOLD}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MUTE}; margin-top: 4px">{desc}</div></div>')

def sub(t):
    return (f'<div style="margin-top: 16px; display: flex; align-items: center; gap: 12px">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.26em; color: {PINK}; white-space: nowrap">{t}</div>'
            f'<div style="flex: 1; height: 1px; background: {PINK}; opacity: 0.6"></div></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BLACK}">'
            + inner +
            f'<img src="assets/paper-grain-light.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.2">'
            f'<img src="assets/gloss-wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


# ---------------- props ----------------
def vip_card(o, x, y):
    """The Babylon Club VIP card: black and gold plastic, embossed member line."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 290px; height: 172px; box-sizing: border-box; '
             f'background: #17121a; border: 2px solid {GOLD}; border-radius: 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.75); '
             f'transform: rotate(-7deg); padding: 14px 16px 0 18px">'
             f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.22em; color: {GOLD}">BABYLON CLUB</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: {GOLD}">No. 1983</div></div>'
             + neon('V.I.P.', 46, PINK, ' margin-top: 10px;') +
             f'<div style="margin-top: 8px; font-family: {SCRIPT}; font-size: 30px; line-height: 1; color: #f4dfa8; white-space: nowrap">Mr. Antonio Montana</div>'
             f'<div style="margin-top: 4px; font-family: {BODY}; font-size: 14px; letter-spacing: 0.08em; color: {MUTE}">ONE BOOTH, NO WAITING</div></div>')

def blimp_ticket(o, x, y):
    """Sunset airship ride ticket, the blimp with its sign on the left, stub on the right."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 300px; height: 170px; background: #fbf1e2; '
             f'box-shadow: 0 5px 14px rgba(0,0,0,0.7); transform: rotate(5deg); display: flex">'
             f'<div style="width: 214px; padding: 10px 0 0 12px; box-sizing: border-box">'
             f'<img src="assets/blimp.jpg" alt="An airship against a blue sky, its sign reading The World Is Yours" style="width: 190px; height: 90px; display: block; object-fit: cover">'
             f'<div style="margin-top: 7px; font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.12em; color: #23162a; line-height: 1.1">SUNSET AIRSHIP</div>'
             f'<div style="margin-top: 4px; font-family: {BODY}; font-size: 14px; color: #5b4a52; line-height: 1.1">Over the bay. Admit one.</div></div>'
             f'<div style="width: 0; border-left: 2px dashed #c4ac94; margin: 8px 0"></div>'
             f'<div style="flex: 1; text-align: center; padding-top: 22px">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; color: #5b4a52; line-height: 1">GATE</div>'
             f'<div style="font-family: {DISP}; font-size: 40px; color: {PINK}; line-height: 1.1">B</div>'
             f'<div style="margin-top: 6px; font-family: {BODY}; font-weight: 700; font-size: 14px; color: #5b4a52; line-height: 1.2">SEAT<br>83</div></div></div>')

def flamingo_tile(o, x, y):
    """Glazed souvenir tile with the lobby mural's flamingos fired on in pink."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 170px; background: #fde9f1; '
             f'border-radius: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.6); transform: rotate(-6deg); padding: 12px; box-sizing: border-box">'
             f'<img src="assets/flamingo-tile.jpg" alt="Two painted flamingos wading in a lagoon" style="width: 172px; height: 120px; display: block; border-radius: 3px">'
             f'<div style="margin-top: 6px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.18em; color: #8c1f55; line-height: 1">MIAMI BEACH</div>'
             '</div>')


# ---------------- FRONT ----------------
def front():
    o = []
    # neon sign in a stepped deco tube frame
    o.append(f'<div style="position: absolute; left: 0; top: 40px; width: {W}px; text-align: center">{kicker("Miami Beach &nbsp;Supper club and disco")}</div>')
    o.append(f'<div style="position: absolute; left: 52px; top: 82px; width: {W - 104}px; height: 222px; box-sizing: border-box; '
             f'border: 3px solid {PINK}; border-radius: 30px; box-shadow: 0 0 12px {PINK}, 0 0 28px {PINK}88"></div>')
    o.append(f'<div style="position: absolute; left: 70px; top: 100px; width: {W - 140}px; height: 186px; box-sizing: border-box; '
             f'border: 2px solid {GOLD}; border-radius: 20px; opacity: 0.85"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 116px; width: {W}px; display: flex; justify-content: center">{neon("BABYLON", 104)}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 230px; width: {W}px; display: flex; justify-content: center; align-items: center; gap: 16px">'
             f'<div style="width: 96px; height: 3px; background: {GOLD}; box-shadow: 0 0 8px {GOLD}"></div>'
             + neon('CLUB', 42, GOLD, f' color: #fff6dc; letter-spacing: 0.3em;') +
             f'<div style="width: 96px; height: 3px; background: {GOLD}; box-shadow: 0 0 8px {GOLD}"></div></div>')

    # hero still in a thin gold frame
    HX, HY = 40, 340
    o.append(f'<div style="position: absolute; left: {HX - 4}px; top: {HY - 4}px; width: {HERO_W + 8}px; height: {HERO_H + 8}px; box-sizing: border-box; border: 2px solid {GOLD}"></div>')
    o.append(f'<img src="assets/floor-still.jpg" alt="A blonde woman in a blue satin dress dances on a crowded club floor beside a man in a dark suit" '
             f'style="position: absolute; left: {HX}px; top: {HY}px; width: {HERO_W}px; height: {HERO_H}px; display: block">')
    o.append(f'<div style="position: absolute; left: {HX}px; top: {HY + HERO_H + 16}px; width: 300px; font-family: {BODY}; font-style: italic; '
             f'font-size: 20px; line-height: 1.3; color: {CREAM}">Saturday on the floor.<br>Showtime at 11 and 1.</div>')
    vip_card(o, 344, 672)

    # the bar
    BY = 868
    bar = (deco_title('THE BAR')
           + item('Babylon Club mojito', '4.50', 'White rum, lime and mint over crushed ice, soda on top.', 14)
           + item('Cuba libre', '4.00', 'Gold rum and cola over ice, a hard squeeze of lime.')
           + item('Piña colada', '4.75', 'Rum, coconut cream and pineapple, blended frosty.')
           + item('Champagne, by the bottle', '83.00', 'French, on ice at your booth. Two glasses or twelve.')
           + item('The little friend', '1.00', 'Cuban espresso, sugared and strong. Say hello.'))
    o.append(f'<div style="position: absolute; left: 40px; top: {BY}px; width: {W - 80}px">{bar}</div>')
    return page(''.join(o), 'front')


# ---------------- BACK ----------------
def back():
    o = []
    o.append(f'<img src="assets/ocean-drive.jpg" alt="A white Art Deco hotel with a striped tower, porthole windows and racing stripes, under a bright sky" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: {PH}px; display: block">')
    o.append(f'<div style="position: absolute; left: 0; top: {PH}px; width: {W}px; height: 4px; background: {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: 40px; top: 40px; background: {BLACK}; padding: 7px 12px; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.2; color: {CREAM}">Ocean Drive. Ten minutes from our door.</div>')
    flamingo_tile(o, 452, PH - 160)
    blimp_ticket(o, 26, PH - 156)

    # the big line
    o.append(f'<div style="position: absolute; left: 0; top: {PH + 26}px; width: {W}px; display: flex; justify-content: center">{neon("THE WORLD IS YOURS", 54)}</div>')

    kitchen = (deco_title('THE KITCHEN')
               + sub('TO START')
               + item('Freedom Town croquetas', '3.50', 'Serrano ham béchamel, crumbed and fried golden. Lime.', 10)
               + item('Tostones', '2.75', 'Green plantain fried twice, smashed flat, garlic and lime mojo.', 14)
               + item('Medianoche sliders', '4.95', 'Ham, roast pork, Swiss and pickle on sweet rolls, pressed.', 14)
               + sub('SUPPER')
               + item('Ropa vieja', '12.50', 'Flank steak shredded into peppers, tomato, olives. Rice, beans.', 10)
               + item('Babylon surf and turf', '19.83', 'Filet mignon, garlic butter jumbo shrimp, béarnaise sauce.', 14)
               + sub('SWEET')
               + item('World Is Yours pastelitos', '3.95', 'Puff pastry, guava paste and cream cheese, sugar crust.', 10))
    o.append(f'<div style="position: absolute; left: 40px; top: {PH + 100}px; width: {W - 80}px">{kitchen}</div>')

    # Frank's line, house rules, fine print
    FY = H - 40 - 176
    o.append(f'<div style="position: absolute; left: 40px; top: {FY}px; width: {W - 80}px; height: 1px; background: {GOLD}; opacity: 0.6"></div>')
    o.append(f'<div style="position: absolute; left: 40px; top: {FY + 14}px; width: 310px">'
             + kicker('Overheard, table one', PINK, 16) +
             f'<div style="margin-top: 8px; font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: {CREAM}">'
             '“Lesson number one, kid. Never underestimate the pastelitos.”</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 34px; line-height: 1.1; color: {GOLD}; text-align: right; padding-right: 10px">Frank L.</div></div>')
    o.append(f'<div style="position: absolute; left: 384px; top: {FY + 14}px; width: 248px; font-family: {BODY}; font-size: 16px; line-height: 1.38; color: {MUTE}">'
             + kicker('House rules', PINK, 16) +
             f'<div style="margin-top: 8px">Nobody here is your baby.<br>Every dog has his day.<br>Ladies night is Tuesday.<br>Jackets after nine.</div></div>')
    o.append(f'<div style="position: absolute; left: 40px; top: {H - 62}px; width: {W - 80}px; text-align: center; font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             'Prices subject to change. Form BC-83. Babylon Club, Miami Beach, 1983.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Babylon Club menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
