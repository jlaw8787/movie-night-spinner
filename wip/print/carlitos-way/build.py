"""El Paraiso, Carlito's club uptown, New York, 1975. Latin nightclub folded card.
Two landscape spreads 1123x794 (A4 landscape), fold down the middle.
Outside (oxblood stock): back cover with the Library of Congress Grand Central photo (signature),
"One stop to Paradise", the train ticket to Miami clipped on, Carlito's note, the paradise postcard;
front cover with the El Paraiso script sign, the club still and the house rule about tabs.
Inside (peach stock): the kitchen on the left, the "Escape to Paradise" poster over the bar on the right.
Writes photo crops, grain and wear, outside/inside .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
Image.MAX_IMAGE_PIXELS = None
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 1123, 794
FOLD = 561
OX, OX2, SUN, SUN2, PEACH, CARD, INK, MUTE = '#4f0e1c', '#3d0a15', '#f07a32', '#f6a868', '#f7e3c9', '#fcf1de', '#2c0a12', '#7a4a45'
FONTS = ('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;0,600;0,700;1,400'
         '&family=Yesteryear&display=swap')
DISP = "'Yesteryear', cursive"; BODY = "'Jost', sans-serif"
LX, RX, CW = 44, FOLD + 40, 478          # left panel x, right panel x, panel width

# ---------------- photos ----------------
def fit(im, w, h, box=None, pos=(0.5, 0.5)):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = int((sw - cw) * pos[0]), int((sh - ch) * pos[1])
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

GC_W, GC_H = 470, 284
gc = Image.open(S('loc-70682u.tif')).convert('L')
gc = fit(gc, GC_W, GC_H, (330, 360, 2846, 1995), (0.5, 0.35))
gc = ImageEnhance.Contrast(ImageEnhance.Brightness(gc).enhance(1.05)).enhance(1.08)
# warm sepia so it sits on the oxblood cover without going muddy
Image.merge('RGB', [gc.point(lambda v: min(255, int(v * 1.0 + 8))), gc.point(lambda v: int(v * 0.95 + 4)),
                    gc.point(lambda v: int(v * 0.86))]).save(A('grand-central-1959.jpg'), quality=90)

CL_W, CL_H = 470, 264
fit(Image.open(S('jSXPooWByKBdFMXNNl5XplGgeL0.jpg')).convert('RGB'), CL_W, CL_H).save(A('club-table.jpg'), quality=90)

PO_W, PO_H = 470, 236
po = Image.open(S('8ESoIezvK2ZlUMH0woyv7NKgHd9.jpg')).convert('RGB')
fit(po, PO_W, PO_H, (0, 330, 3840, 2160), (0.5, 0.55)).save(A('paradise-poster.jpg'), quality=90)

def wear(name, seed, rgb, strength):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(30):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(60 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    lay = Image.new('RGBA', (W, H), rgb + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * strength)))
    lay.save(A(f'wear-{name}.png'))
wear('outside', 30, (20, 2, 6), 0.7); wear('inside', 75, (120, 60, 40), 0.5)
# light speckle version of the shared grain for the dark stock
g = Image.open(A('paper-grain.png')); a = g.split()[3]
lg = Image.new('RGBA', g.size, (247, 227, 201, 0)); lg.putalpha(a); lg.save(A('paper-grain-light.png'))

# ---------------- pieces ----------------
def kicker(t, color=SUN, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def stripes(x, y, w, flip=False):
    """Seventies triple stripe: thick, middle, hairline."""
    bars = [(0, 9, SUN), (14, 5, SUN2), (24, 2, SUN)]
    if flip: bars = [(26 - t - h, h, c) for t, h, c in bars]
    return ''.join(f'<div style="position: absolute; left: {x}px; top: {y + t}px; width: {w}px; height: {h}px; background: {c}"></div>' for t, h, c in bars)

def head(sub, title, color=OX):
    """Section head: small kicker, script title, stripes running out to the right."""
    return (f'{kicker(sub, size=18)}'
            f'<div style="display: flex; align-items: center; gap: 14px; margin-top: 2px">'
            f'<div style="font-family: {DISP}; font-size: 48px; line-height: 1.05; color: {color}; white-space: nowrap; padding-bottom: 4px">{title}</div>'
            f'<div style="flex: 1; position: relative; height: 18px">'
            f'<div style="position: absolute; left: 0; right: 0; top: 2px; height: 5px; background: {SUN}"></div>'
            f'<div style="position: absolute; left: 0; right: 0; top: 10px; height: 3px; background: {SUN2}"></div>'
            f'<div style="position: absolute; left: 0; right: 0; top: 16px; height: 1px; background: {SUN}"></div></div></div>')

def item(name, price, desc, gap=14):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; '
            f'font-weight: 600; font-size: 27px; line-height: 1.15; color: {INK}">'
            f'<span>{name}</span><span style="color: {OX}; font-weight: 700; white-space: nowrap">{price}</span></div>'
            + (f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MUTE}; margin-top: 2px">{desc}</div>' if desc else '')
            + '</div>')

def frame(img, alt, x, y, w, h, color=SUN, bg=OX2):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border: 2px solid {color}; padding: 3px; background: {bg}">'
            f'<img src="assets/{img}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

def fold():
    return (f'<div style="position: absolute; left: {FOLD - 1}px; top: 0; width: 1px; height: {H}px; background: rgba(0,0,0,0.10)"></div>'
            f'<div style="position: absolute; left: {FOLD}px; top: 0; width: 1px; height: {H}px; background: rgba(255,255,255,0.10)"></div>')

def page(inner, name, bg, grain, gop):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            f'<img src="assets/{grain}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {gop}">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            + fold() + inner + '</div>')

# ---------------- props ----------------
def ticket(o, x, y, rot=-6):
    """Coach ticket, Grand Central to Miami, one way. Tucked over the photo corner."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 262px; height: 118px; transform: rotate({rot}deg); '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.45); background: {CARD}; display: flex">'
             f'<div style="width: 190px; box-sizing: border-box; padding: 9px 10px 0 13px; border-right: 2px dashed {SUN}">'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.14em; color: {OX}; line-height: 1.2">GRAND CENTRAL TERMINAL</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {MUTE}; line-height: 1.2; margin-top: 2px">New York to</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 34px; color: {INK}; line-height: 1; letter-spacing: 0.04em">MIAMI</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.12em; color: {OX}; line-height: 1.2; margin-top: 5px">ONE WAY &middot; COACH</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 14px; color: {SUN}; line-height: 1.2; margin-top: 2px">Connecting: Paradise</div></div>'
             f'<div style="flex: 1; background: {SUN}; text-align: center; padding-top: 14px">'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.1em; color: {CARD}; line-height: 1.2">SEAT</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 36px; color: {CARD}; line-height: 1">75</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.1em; color: {CARD}; line-height: 1.2; margin-top: 6px">1975</div></div></div>')

def postcard(o, x, y, rot=3):
    """Back of an "Escape to Paradise" postcard, sent to Carlito care of the club."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 238px; height: 168px; transform: rotate({rot}deg); '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.45); background: {CARD}; box-sizing: border-box; padding: 8px 10px">'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.3em; color: {OX}; text-align: center; line-height: 1.2">POST CARD</div>'
             f'<div style="position: absolute; left: 118px; top: 32px; width: 1px; height: 124px; background: {MUTE}"></div>'
             f'<div style="position: absolute; left: 10px; top: 32px; width: 100px; font-family: {BODY}; font-style: italic; font-size: 14px; line-height: 1.3; color: {INK}">'
             f'<span style="font-family: {DISP}; font-style: normal; font-size: 21px; color: {SUN}">Escape to Paradise</span><br>Car rental going for seventy-five. Sun every day.</div>'
             f'<div style="position: absolute; left: 180px; top: 30px; width: 44px; height: 50px; background: {SUN}; box-sizing: border-box; border: 2px dotted {CARD}; text-align: center">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; color: {CARD}; line-height: 1; margin-top: 6px">8c</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; color: {CARD}; line-height: 1.1; letter-spacing: -0.02em">BAH.</div></div>'
             f'<div style="position: absolute; left: 128px; top: 92px; width: 104px; font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {INK}">'
             f'Mr. C. Brigante<br>c/o El Paraiso<br>New York, N.Y.</div></div>')

# ---------------- OUTSIDE: back cover (left) and front cover (right) ----------------
def outside():
    o = [stripes(0, 0, W), stripes(0, H - 26, W, flip=True)]
    # back cover: the train
    o.append(f'<div style="position: absolute; left: {LX}px; top: 50px; width: {CW}px">'
             f'{kicker("Getting here")}'
             f'<div style="font-family: {DISP}; font-size: 60px; line-height: 1.05; color: {PEACH}; margin-top: 0">One stop to Paradise</div></div>')
    o.append(frame('grand-central-1959.jpg', 'Morning sun pouring in long beams through the high arched windows of the Grand Central concourse, travellers crossing the floor below',
                   LX, 142, GC_W, GC_H))
    o.append(f'<div style="position: absolute; left: {LX}px; top: 446px; width: 300px; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.3; color: {SUN2}">Grand Central, mornings. Catch the uptown train and step off in paradise.</div>')
    ticket(o, 290, 388)
    o.append(f'<div style="position: absolute; left: {LX}px; top: 520px; width: 216px">'
             f'{kicker("From the house")}'
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.38; color: {PEACH}; margin-top: 6px">'
             'I&rsquo;m here till I put away seventy-five grand. Then I&rsquo;m gone. Till then, eat good, tip the band.</div>'
             f'<div style="font-family: {DISP}; font-size: 46px; line-height: 1; color: {SUN}; margin-top: 4px">Carlito</div></div>')
    postcard(o, 286, 538)
    o.append(f'<div style="position: absolute; left: {LX}px; top: 734px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {SUN2}">'
             'Prices subject to change. Form No. 30-5. El Paraiso, uptown, New York. 1975.</div>')

    # front cover: the club
    o.append(f'<div style="position: absolute; left: {RX}px; top: 50px; width: {CW}px; text-align: center">'
             f'{kicker("Supper &nbsp;&middot;&nbsp; Dancing &nbsp;&middot;&nbsp; Till four")}'
             f'<div style="font-family: {DISP}; font-size: 116px; line-height: 1; color: {PEACH}; margin-top: 2px; text-shadow: 3px 3px 0 {SUN}">El Paraiso</div>'
             f'<div style="font-family: {BODY}; font-weight: 500; font-size: 19px; letter-spacing: 0.3em; color: {SUN2}; margin-top: 2px">NIGHT CLUB &middot; UPTOWN</div></div>')
    o.append(frame('club-table.jpg', 'Carlito in a dark suit at a ringside table with Gail and Dave Kleinfeld, champagne glasses on the cloth',
                   RX, 236, CL_W, CL_H))
    o.append(f'<div style="position: absolute; left: {RX}px; top: 516px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.3; color: {SUN2}">Ringside, Saturday. The counsellor is buying. Supposedly.</div>')
    o.append(f'<div style="position: absolute; left: {RX + 20}px; top: 562px; width: {CW - 40}px; box-sizing: border-box; border: 2px solid {SUN}; '
             f'padding: 10px 16px 12px; text-align: center; background: {OX2}">'
             f'{kicker("House rule", size=18)}'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 30px; line-height: 1.15; color: {PEACH}; margin-top: 2px; letter-spacing: 0.02em">NO TABS. NOT FOR NOBODY.</div>'
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.3; color: {PEACH}; margin-top: 4px">Yes, Dave, that means you. We have your number, counsellor.</div></div>')
    o.append(f'<div style="position: absolute; left: {RX}px; top: 718px; width: {CW}px; text-align: center">'
             f'{kicker("Under new management &nbsp;&middot;&nbsp; Menu inside", color=SUN, size=18)}</div>')
    return page(''.join(o), 'outside', OX, 'paper-grain-light.png', 0.16)

# ---------------- INSIDE: kitchen (left) and the Paradise Bar (right) ----------------
def inside():
    o = [stripes(0, 0, W), stripes(0, H - 26, W, flip=True)]
    left = (head('Something crisp', 'From El Barrio')
            + item('Bacalaitos', '1.25', 'Lacy salt cod fritters, fried with garlic and fresh coriander.', 8)
            + item('Tostones', '1.00', 'Green plantain fried twice, smashed flat, spooned with garlic and lime mojo.')
            + item('Empanadillas', '1.50', 'Half moon pastries of beef picadillo, olives and raisins.')
            + '<div style="height: 18px"></div>'
            + head('Supper is served', 'The Puerto Rican Table')
            + item('Pernil', '7.50', 'Garlic and oregano pork shoulder, roasted five hours to crackling. Rice with pigeon peas.', 8)
            + item('Arroz con pollo', '4.75', 'Chicken and yellow rice, sofrito, olives, sweet peppers.')
            + item('Bistec encebollado', '5.95', 'Thin sirloin smothered in vinegar onions, white rice, red beans.'))
    o.append(f'<div style="position: absolute; left: {LX}px; top: 44px; width: {CW}px">{left}</div>')

    o.append(frame('paradise-poster.jpg', 'Travel poster photo: a huge setting sun behind palm fronds, a dancer silhouetted with arms wide on a glittering red sea',
                   RX, 44, PO_W, PO_H, color=OX, bg=OX))
    o.append(f'<div style="position: absolute; left: {RX + 22}px; top: 60px; font-family: {DISP}; font-size: 50px; line-height: 1; color: {CARD}; '
             f'text-shadow: 2px 2px 0 {OX}">Escape to Paradise</div>')
    o.append(f'<div style="position: absolute; left: {RX}px; top: 296px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 1.3; color: {MUTE}">The poster over the bar. Every night ends at sunset in here.</div>')
    right = (head('At the bar', 'The Paradise Bar')
             + item('Paradise punch', '2.75', 'Dark rum, pineapple, fresh lime and spiced syrup, long over ice, nutmeg grated on top.', 8)
             + item('Pi&ntilde;a colada', '2.25', 'Light rum, cream of coconut, pineapple, blended with ice.')
             + '<div style="height: 14px"></div>'
             + head('One last temptation', 'Dulces')
             + item('Paradise flan', '1.75', 'Coconut caramel custard, baked slow in a water bath, turned out cold.', 8)
             + item('Tembleque', '1.25', 'Coconut milk pudding, cinnamon on top.'))
    o.append(f'<div style="position: absolute; left: {RX}px; top: 336px; width: {CW}px">{right}</div>')
    return page(''.join(o), 'inside', PEACH, 'paper-grain.png', 0.22)

FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>El Paraiso menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
