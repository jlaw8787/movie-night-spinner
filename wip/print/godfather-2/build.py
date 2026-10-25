"""Club Isla Verde, Vedado, Havana. Gran Baile de Fin de Ano, Wednesday 31 December 1958.
Nightclub New Year's card, two faces 672x1056 (7 x 11 in), seafoam stock, deep teal and coral inks,
a ring of marquee bulbs round the edge.
Front: club name, the FELIZ ANO NUEVO banner, the 1952 Malecon postcard (Library of Congress, signature),
the countdown strip into 1959 (big gag), Roth's note, tonight's programme, the noisemaker ticket.
Back: the gala supper in two columns, the Cuba cake still (big gag), the Cuba-shaped cake slice card,
the cover charge, house rules with the Tahoe tarantella wink, fine print.
Writes photo crops, the Cuba card PNG, wear, front/back .body.html and .html."""
import os, json, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
Image.MAX_IMAGE_PIXELS = None
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 672, 1056
PAPER, INK, RED, CREAM, MUTE, ORANGE, GOLD = '#f1e1bd', '#0d3a40', '#c3302a', '#fcf4e0', '#4a5048', '#e39832', '#a97f26'
FONTS = ('https://fonts.googleapis.com/css2?family=Sancreek&family=Jost:ital,wght@0,400;0,500;0,600;1,400'
         '&family=Pinyon+Script&display=swap')
DISP = "'Sancreek', serif"; BODY = "'Jost', sans-serif"; SCRIPT = "'Pinyon Script', cursive"
L, CW = 48, 576

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PC_W, PC_H = 560, 330
pc = Image.open(S('loc-1b00969.jpg')).convert('RGB')
pc = ImageEnhance.Color(ImageEnhance.Brightness(pc).enhance(1.04)).enhance(1.06)
fit(pc, PC_W, PC_H, (300, 300, 3200, 1955)).save(A('malecon-1952.jpg'), quality=90)


# ---------------- the Cuba-shaped cake slice card ----------------
def cuba_card():
    """Die-cut cream card in the shape of the island, orange icing inset, piped white edge (2x)."""
    polys = json.load(open(S('cuba-outline.json')))
    main = polys[0]
    lons = [p[0] for p in main]; lats = [p[1] for p in main]
    x0, x1, y0, y1 = min(lons), max(lons), min(lats), max(lats)
    k = 0.927  # cos of 22 degrees
    cw, ch = 300 * 2, 0
    sc = (cw - 40) / ((x1 - x0) * k)
    ch = int((y1 - y0) * sc) + 40
    def pt(p): return (20 + (p[0] - x0) * k * sc, 20 + (y1 - p[1]) * sc)
    big = 4
    def poly_mask(grow):
        m = Image.new('L', (cw * big, ch * big), 0); d = ImageDraw.Draw(m)
        d.polygon([(x * big, y * big) for x, y in map(pt, main)], fill=255)
        m = m.resize((cw, ch), Image.LANCZOS)
        if grow:
            r = abs(grow) / 2
            bl = m.filter(ImageFilter.GaussianBlur(r))
            m = bl.point(lambda v: 255 if v > (40 if grow > 0 else 215) else 0).filter(ImageFilter.GaussianBlur(0.7))
        return m
    card = poly_mask(15)
    icing = poly_mask(-1)
    out = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    sh = Image.new('RGBA', (cw, ch), (15, 40, 45, 0)); sh.putalpha(card.filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.42)))
    out.alpha_composite(sh, (3, 5)) if False else None
    shadow = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); shadow.paste(sh, (4, 6))
    out.alpha_composite(shadow)
    cr = Image.new('RGBA', (cw, ch), (251, 245, 230, 255)); cr.putalpha(card); out.alpha_composite(cr)
    # icing: warm orange with soft mottling so it reads as piped sugar, not a flat vector
    rnd = random.Random(7)
    mot = Image.new('L', (cw // 6, ch // 6), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 40))
    mot = mot.resize((cw, ch), Image.BICUBIC).filter(ImageFilter.GaussianBlur(4))
    ic = Image.merge('RGB', [mot.point(lambda v: 227 + v // 6), mot.point(lambda v: 146 + v // 3), mot.point(lambda v: 46 + v // 4)])
    ic = ic.convert('RGBA'); ic.putalpha(icing); out.alpha_composite(ic)
    # piped edge: a fine dotted cream line just inside the cut
    edge = ImageChops.subtract(poly_mask(7), poly_mask(3))
    dots = Image.new('L', (cw, ch), 0); dd = ImageDraw.Draw(dots)
    for x in range(0, cw, 7):
        for y in range(0, ch, 7):
            dd.ellipse([x, y, x + 5, y + 5], fill=255)
    pipe = ImageChops.multiply(edge, dots).filter(ImageFilter.GaussianBlur(0.6))
    pp = Image.new('RGBA', (cw, ch), (255, 253, 244, 255)); pp.putalpha(pipe); out.alpha_composite(pp)
    # hairline cut edge
    rim = ImageChops.subtract(card, poly_mask(13))
    rr = Image.new('RGBA', (cw, ch), (15, 52, 60, 255)); rr.putalpha(rim.point(lambda v: int(v * 0.5))); out.alpha_composite(rr)
    out.save(A('cuba-card.png'))
    return cw // 2, ch // 2
CUBA_W, CUBA_H = cuba_card()

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(40):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(60 - i * 1.6)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 20, H // 20), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 14))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), (70, 80, 50, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.42)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 58); wear('back', 59)

# ---------------- type pieces ----------------
def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def item(name, price, desc, gap=14):
    d = (f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.26; color: {INK}; margin-top: 2px">{desc}</div>' if desc else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {BODY}; font-weight: 600; '
            f'font-size: 26px; line-height: 1.15; color: {INK}">'
            f'<span>{name}</span><span style="color: {RED}; white-space: nowrap">{price}</span></div>{d}</div>')

def ribbon(text, w, h=50, size=36, bg=RED, fg=CREAM, notch=PAPER):
    """A swallowtail banner like the one over the ballroom: flat ink band, notched ends, darker fold tabs."""
    hh = h // 2
    return (f'<div style="position: relative; width: {w}px; height: {h}px">'
            f'<div style="position: absolute; left: 0; top: 0; width: {w}px; height: {h}px; background: {bg}"></div>'
            f'<div style="position: absolute; left: 0; top: 0; width: 0; height: 0; border-top: {hh}px solid transparent; border-bottom: {h - hh}px solid transparent; border-left: 16px solid {notch}"></div>'
            f'<div style="position: absolute; right: 0; top: 0; width: 0; height: 0; border-top: {hh}px solid transparent; border-bottom: {h - hh}px solid transparent; border-right: 16px solid {notch}"></div>'
            f'<div style="position: absolute; left: 22px; right: 22px; top: 4px; bottom: 4px; border-top: 1.5px solid {fg}; border-bottom: 1.5px solid {fg}; opacity: 0.55"></div>'
            f'<div style="position: absolute; left: 0; top: 0; width: {w}px; height: {h}px; text-align: center; font-family: {DISP}; font-size: {size}px; '
            f'line-height: {h}px; color: {fg}; letter-spacing: 0.03em">{text}</div></div>')

def marquee():
    """Club edge: a deep teal band with a ring of warm cream bulbs, like the canopy over the door."""
    b = 22; o = [f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; box-sizing: border-box; border: {b}px solid {INK}"></div>',
                 f'<div style="position: absolute; left: {b + 5}px; top: {b + 5}px; width: {W - 2 * b - 10}px; height: {H - 2 * b - 10}px; box-sizing: border-box; border: 1.5px solid {GOLD}"></div>',
                 f'<div style="position: absolute; left: {b + 10}px; top: {b + 10}px; width: {W - 2 * b - 20}px; height: {H - 2 * b - 20}px; box-sizing: border-box; border: 0.75px solid {GOLD}"></div>']
    def bulb(x, y):
        return (f'<div style="position: absolute; left: {x - 4}px; top: {y - 4}px; width: 8px; height: 8px; border-radius: 50%; background: #ffe7a3; '
                f'box-shadow: 0 0 6px 2px rgba(255,200,90,0.6)"></div>')
    c = b / 2
    n = 26; step = (W - 2 * c) / n
    for i in range(n + 1):
        o.append(bulb(round(c + i * step), c)); o.append(bulb(round(c + i * step), H - c))
    n = 41; step = (H - 2 * c) / n
    for i in range(1, n):
        o.append(bulb(c, round(c + i * step))); o.append(bulb(W - c, round(c + i * step)))
    return ''.join(o)

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            + marquee() + inner + '</div>')

def framed(img, alt, x, y, w, h, color=GOLD):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border: 2px solid {color}; padding: 6px; background: {CREAM}; '
            f'box-shadow: 0 3px 8px rgba(10,40,45,0.25)">'
            f'<img src="assets/{img}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

# ---------------- props ----------------
def noisemaker_ticket(o, x, y, rot=6):
    """Cloakroom ticket: one noisemaker and one party hat, perforated stub."""
    perf = ''.join(f'<div style="position: absolute; left: 66px; top: {6 + i * 10}px; width: 3px; height: 5px; background: {PAPER}"></div>' for i in range(11))
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 262px; height: 118px; transform: rotate({rot}deg); '
             f'box-shadow: 0 4px 10px rgba(10,30,35,0.4)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 68px; height: 118px; background: {RED}"></div>'
             f'<div style="position: absolute; left: 68px; top: 0; width: 194px; height: 118px; background: {CREAM}"></div>{perf}'
             f'<div style="position: absolute; left: 0; top: 10px; width: 68px; text-align: center; font-family: {DISP}; font-size: 22px; line-height: 1.05; color: {CREAM}">No.<br>1959</div>'
             f'<div style="position: absolute; left: 0; top: 74px; width: 68px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; line-height: 1.2; color: {CREAM}">TABLE 7</div>'
             f'<div style="position: absolute; left: 82px; top: 8px; width: 170px">'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.16em; color: {RED}; line-height: 1.2">CLOAKROOM</div>'
             f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1.05; color: {INK}; margin-top: 3px">1 Noisemaker<br>1 Party hat</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.25; color: {MUTE}; margin-top: 4px">Collect before midnight.<br>Mr. Ola&rsquo;s party, table 7.</div>'
             f'</div></div>')

def slice_card(o, x, y, rot=-4):
    """The island cake card: die-cut Cuba in orange icing, with a small cream tag pinned under it."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {CUBA_W}px; transform: rotate({rot}deg)">'
             f'<img src="assets/cuba-card.png" alt="A small card die-cut in the shape of Cuba, iced orange with a piped white edge" style="display: block; width: {CUBA_W}px; height: {CUBA_H}px">'
             f'<div style="margin: -8px 0 0 100px; width: 200px; box-sizing: border-box; background: {CREAM}; border: 1.5px solid {GOLD}; padding: 5px 8px; text-align: center; box-shadow: 0 3px 7px rgba(10,30,35,0.35)">'
             f'<div style="font-family: {DISP}; font-size: 22px; line-height: 1; color: {RED}">Una porci&oacute;n</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; line-height: 1.25; color: {INK}; margin-top: 3px">EVERYBODY GETS ONE</div></div>'
             f'</div>')

# ---------------- FRONT: the club card ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 48px; width: {CW}px; text-align: center">'
             f'{kicker("Wednesday &nbsp;&middot;&nbsp; December 31 &nbsp;&middot;&nbsp; 1958")}'
             f'<div style="font-family: {DISP}; font-size: 92px; line-height: 1; color: {INK}; margin-top: 4px">Isla Verde</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 20px; letter-spacing: 0.3em; line-height: 1.2; color: {INK}; margin-top: 2px">SUPPER CLUB &middot; VEDADO &middot; HAVANA</div></div>')
    o.append(f'<div style="position: absolute; left: {(W - 440) // 2}px; top: 196px">'
             + ribbon('Feliz A&ntilde;o Nuevo', 440, 56, 38, CREAM, RED, PAPER) + '</div>')
    o.append(f'<div style="position: absolute; left: {(W - 440) // 2}px; top: 196px; width: 440px; height: 56px; box-sizing: border-box; border-top: 2px solid {INK}; border-bottom: 2px solid {INK}"></div>')
    o.append(framed('malecon-1952.jpg', 'A tinted postcard of the Malecon: a tall white hotel among palms, and the Maine monument, two columns topped by a bronze eagle',
                    L, 274, PC_W, PC_H))
    o.append(f'<div style="position: absolute; left: {L}px; top: 624px; width: 320px; font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}">'
             'The Malec&oacute;n from the postcard rack in our lobby. Five minutes by taxi from our door.</div>')
    noisemaker_ticket(o, 360, 568)

    # the countdown
    boxes = ''
    for i, n in enumerate(range(10, 0, -1)):
        hot = n <= 3
        boxes += (f'<div style="width: 38px; height: 50px; box-sizing: border-box; border: 2px solid {RED if hot else INK}; '
                  f'background: {RED if n == 1 else CREAM}; text-align: center; font-family: {DISP}; font-size: 28px; line-height: 46px; '
                  f'color: {CREAM if n == 1 else (RED if hot else INK)}">{n}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 690px; width: {CW}px">'
             f'{kicker("At 11:59 the whole room counts")}'
             f'<div style="display: flex; align-items: center; gap: 5px; margin-top: 8px">{boxes}'
             f'<div style="margin-left: 8px; font-family: {DISP}; font-size: 54px; line-height: 1; color: {RED}">1959!</div></div></div>')

    # Roth's note, left
    o.append(f'<div style="position: absolute; left: {L}px; top: 792px; width: 286px">'
             f'{kicker("A word from a guest", INK)}'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.32; color: {INK}; margin-top: 6px">'
             'The kitchen made my birthday cake in the shape of this island. Tonight they make it again, and everybody here gets a piece.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 42px; line-height: 1; color: {INK}; margin-top: 2px">Hyman Roth</div></div>')

    # tonight, right
    row = lambda t, s: (f'<div style="display: flex; gap: 10px; margin-top: 5px; font-family: {BODY}; font-size: 19px; line-height: 1.25; color: {INK}">'
                        f'<span style="font-weight: 600; color: {RED}; width: 50px; flex: none">{t}</span><span>{s}</span></div>')
    o.append(f'<div style="position: absolute; left: 356px; top: 792px; width: 268px">'
             f'{kicker("Tonight", INK)}'
             + row('9:00', 'Supper in the sal&oacute;n')
             + row('10:30', 'Floor show, fountains lit')
             + row('11:59', 'The countdown')
             + row('12:00', 'Champagne and the President&rsquo;s toast')
             + f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {MUTE}; margin-top: 8px">'
               'A kiss at midnight is customary. The cloakroom stays open for early exits.</div></div>')
    return page(''.join(o), 'front')

# ---------------- BACK: the gala supper ----------------
BR_W, BR_H = 560, 184
br = Image.open(S('2PWQsFVAmN30jzNFN1DsCNLNmn9.jpg')).convert('RGB')
br = ImageEnhance.Brightness(br).enhance(1.12)
fit(br, BR_W, BR_H, (0, 60, 1910, 742)).save(A('salon-nye.jpg'), quality=90)

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 48px; width: {CW}px; text-align: center">'
             f'{kicker("Served from nine until the countdown")}'
             f'<div style="font-family: {DISP}; font-size: 60px; line-height: 1.05; color: {INK}; margin-top: 2px">La Cena de Gala</div></div>')
    o.append(framed('salon-nye.jpg', 'The grand salon at midnight: crystal chandeliers, a FELIZ ANO NUEVO banner over the balcony, a packed dance floor in party hats', L, 144, BR_W, BR_H))
    o.append(f'<div style="position: absolute; left: {L}px; top: 348px; width: 340px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             'The grand sal&oacute;n, Noche Vieja. Chandeliers, hats, the whole of Havana.</div>')
    slice_card(o, 330, 222, -5)
    colw = 274
    left = (ribbon('Entremeses', colw, 46, 32)
            + item('Arancini Genco', '.85', 'Saffron rice, beef rag&ugrave;, peas and a mozzarella heart.', 8)
            + item('Medianoches', '.75', 'Ham, roast pork, Swiss, pickle, mustard, pressed hot.', 12)
            + item('Shrimp cocktail', '1.25', 'Gulf shrimp on ice, lime, a sharp red sauce.', 12)
            + '<div style="height: 14px"></div>'
            + ribbon('Platos fuertes', colw, 46, 32)
            + item('Ziti al forno', '1.95', 'Sausage tomato sauce, ricotta, blistered mozzarella.', 8)
            + item('Lech&oacute;n asado', '2.75', 'Roast suckling pig, mojo.', 12))
    right = (ribbon('Postre', colw, 46, 32)
             + item('Torta de la Isla', '.67', 'Vanilla slab cake iced pale green, shaped like the island.', 8)
             + item('Caf&eacute; cubano', '.10', '', 12)
             + '<div style="height: 14px"></div>'
             + ribbon('El Bar', colw, 46, 32)
             + item('Daiquiri', '.75', 'Rum, lime and sugar, ice cold. Banana on request.', 8)
             + item('Champagne', 'with cover', 'A glass each at midnight.', 12))
    o.append(f'<div style="position: absolute; left: {L}px; top: 400px; width: {colw}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {L + CW - colw}px; top: 400px; width: {colw}px">{right}</div>')
    # vertical gold hairline between the columns
    o.append(f'<div style="position: absolute; left: {W // 2}px; top: 408px; width: 0; height: 520px; border-left: 1px solid {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: {L + CW - colw}px; top: 812px; width: {colw}px; box-sizing: border-box; border: 1.5px solid {GOLD}; outline: 1px solid {GOLD}; outline-offset: 3px; background: {CREAM}; padding: 8px 12px">'
             f'{kicker("Cover, per person", RED, 16, " letter-spacing: 0.14em")}'
             f'<div style="display: flex; align-items: baseline; gap: 10px"><span style="font-family: {DISP}; font-size: 38px; line-height: 1.1; color: {INK}">$19.58</span>'
             f'<span style="font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {INK}">hat, noisemaker, show, champagne</span></div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 962px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}; text-align: center">'
             'Seating: friends close, others closer. The orchestra knows a tarantella.<br>'
             'Pesos, at par with the dollar. Prices subject to change. Form 74-II. Vedado, 1958.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Club Isla Verde New Year menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built', CUBA_W, CUBA_H)
