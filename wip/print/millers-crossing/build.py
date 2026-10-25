"""The High Hat, Leo's private supper club, 1929 (fictional name).
Speakeasy card, two faces 640x960 (6.67 x 10 in). Black stock, smoke ink, amber.
Signature: real 1928 downtown street photo (Hennepin County Library, public domain) plus the TMDB still of the hat in the woods.
Props: a club entry card made out to Tom, a fedora hat-check ticket.
Big gags: the password at the door slot, the hat in the woods, "look in your heart".
Writes photo crops, smoke wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 640, 960
BLACK, SMOKE, AMBER, DIM, CARD = '#131211', '#e4ddcf', '#d19a3c', '#a59d8f', '#efe6d0'
FONTS = ('https://fonts.googleapis.com/css2?family=Holtwood+One+SC&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400'
         '&family=Pinyon+Script&display=swap')
DISP = "'Holtwood One SC', serif"; BODY = "'Libre Baskerville', serif"; SCRIPT = "'Pinyon Script', cursive"
M = 40

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PW, PH = W - 2 * M - 8, 250
st = Image.open(S('dpla-street.jpg')).convert('L')
st = ImageOps.autocontrast(st, cutoff=0.5)
st = ImageEnhance.Brightness(st).enhance(1.05)
st = ImageOps.colorize(st, black='#141210', white='#f1ead8', mid='#8d8473')
fit(st, PW, PH, (0, 60, 1920, 1380)).save(A('street-1928.jpg'), quality=90)

hat = Image.open(S('qMfJPDviH3AVbZ8FMmcpdqxkj6n.jpg')).convert('RGB')
hat = ImageEnhance.Brightness(hat).enhance(1.22)
hat = ImageEnhance.Contrast(hat).enhance(1.06)
HW, HH = W - 2 * M - 8, 196
fit(hat, HW, HH, (100, 200, 1600, 900)).save(A('hat-woods.jpg'), quality=90)

def wear(name, seed):
    """Soft smoke: big pale haze drifting up from the bottom edge, plus a darker vignette. Low detail."""
    rnd = random.Random(seed)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(40):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(120 - i * 3)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    dark = Image.new('RGBA', (W, H), (0, 0, 0, 255)); dark.putalpha(m)
    sm = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sm)
    for i in range(16):
        x = rnd.randint(-80, W); y = rnd.randint(H - 240, H + 60)
        r = rnd.randint(70, 170)
        sd.ellipse([x - r, y - r * 0.6, x + r, y + r * 0.6], fill=rnd.randint(14, 30))
    for i in range(6):
        x = rnd.choice([rnd.randint(-60, 60), rnd.randint(W - 60, W + 60)]); y = rnd.randint(80, H - 200)
        r = rnd.randint(60, 120)
        sd.ellipse([x - r * 0.6, y - r, x + r * 0.6, y + r], fill=rnd.randint(8, 18))
    sm = sm.filter(ImageFilter.GaussianBlur(40))
    smoke = Image.new('RGBA', (W, H), (214, 206, 190, 0)); smoke.putalpha(sm)
    lay = Image.alpha_composite(lay, smoke); lay = Image.alpha_composite(lay, dark)
    lay.save(A(f'wear-smoke-{name}.png'))
wear('front', 7); wear('back', 29)

# ---------------- type pieces ----------------
def kicker(t, color=AMBER, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1;{extra}">{t}</div>')

def head(kick, title, top=0):
    """Kicker over a heavy wood-type title, an amber bar under the first letters, smoke hairline running on."""
    return (f'<div style="margin-top: {top}px">{kicker(kick)}'
            f'<div style="position: relative; height: 50px; margin-top: 4px">'
            f'<div style="position: absolute; left: 0; top: 0; font-family: {DISP}; font-size: 40px; line-height: 46px; color: {SMOKE}; white-space: nowrap">{title}</div>'
            f'<div style="position: absolute; left: 0; right: 0; bottom: 2px; height: 1px; background: {SMOKE}; opacity: 0.45"></div>'
            f'<div style="position: absolute; left: 0; bottom: 0; width: 56px; height: 5px; background: {AMBER}"></div></div></div>')

def item(name, price, desc, top=12):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 26px; line-height: 1.15; color: {SMOKE}">'
            f'<span>{name}</span><span style="color: {AMBER}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.32; color: {DIM}; margin-top: 4px">{desc}</div></div>')

def page(name, inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BLACK}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.5">'
            f'<img src="assets/wear-smoke-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            # amber deco border: heavy outer rule, hairline inner, small corner blocks
            f'<div style="position: absolute; left: 14px; top: 14px; width: {W - 28}px; height: {H - 28}px; border: 2px solid {AMBER}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 21px; top: 21px; width: {W - 42}px; height: {H - 42}px; border: 1px solid {AMBER}; opacity: 0.6; box-sizing: border-box"></div>'
            + ''.join(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 12px; height: 12px; background: {AMBER}"></div>'
                      for x, y in ((10, 10), (W - 22, 10), (10, H - 22), (W - 22, H - 22)))
            + inner + '</div>')

# ---------------- props ----------------
def entry_card(o, x, y):
    """Club entry card, made out to Tom. Leo signs for him; the tab line is the joke."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 236px; height: 136px; background: {CARD}; box-sizing: border-box; '
             f'padding: 10px 14px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.6); transform: rotate(-5deg); border: 1px solid #b89a62">'
             f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 1px solid {AMBER}"></div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; color: #8a5a14; line-height: 1">ADMIT ONE</div>'
             f'<div style="font-family: {DISP}; font-size: 22px; color: {BLACK}; line-height: 1.2; margin-top: 6px">TOM REAGAN</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {BLACK}; line-height: 1.4; margin-top: 4px">No. 1929. Any night.<br>Tab past due. See Lazarre.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 26px; color: #2c3f6b; line-height: 1; margin-top: 0">Leo</div></div>')

def hat_check(o, x, y):
    """Fedora hat-check ticket, punched, numbered."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 150px; height: 178px; background: #c9873a; box-sizing: border-box; '
             f'padding: 30px 10px 0; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.6); transform: rotate(7deg)">'
             f'<div style="position: absolute; left: 63px; top: 8px; width: 22px; height: 22px; border-radius: 50%; background: {BLACK}"></div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.18em; color: {BLACK}; line-height: 1; margin-top: 6px">HAT CHECK</div>'
             f'<div style="font-family: {DISP}; font-size: 34px; color: {BLACK}; line-height: 1.1; margin-top: 4px; white-space: nowrap">No. 29</div>'
             f'<div style="height: 0; border-top: 2px dashed {BLACK}; margin: 6px 0"></div>'
             f'<div style="font-family: {BODY}; font-size: 14px; color: {BLACK}; line-height: 1.32">One black fedora.<br>The wind is<br>not our fault.</div></div></div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {M}px; top: 40px; width: {W - 2 * M}px; text-align: center">'
             + kicker('Members and friends of Leo') + '</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 66px; width: {W - 2 * M}px; text-align: center; font-family: {DISP}; '
             f'font-size: 60px; line-height: 70px; color: {SMOKE}; white-space: nowrap"><span style="font-size: 30px">THE </span>HIGH HAT</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 142px; width: {W - 2 * M}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.18em; color: {AMBER}; line-height: 1">'
             f'<span>SUPPER CLUB</span><span>EST. 1929</span><span>KNOCK TWICE</span></div>')
    # signature: the street outside, 1928
    PY = 170
    o.append(f'<div style="position: absolute; left: {M}px; top: {PY}px; border: 1px solid {AMBER}; padding: 3px; background: {BLACK}">'
             f'<img src="assets/street-1928.jpg" alt="A busy downtown street in 1928, sedans and a streetcar below tall stone buildings and globe street lamps" '
             f'style="display: block; width: {PW}px; height: {PH}px"></div>')
    o.append(f'<div style="position: absolute; left: {M + 4}px; top: {PY + PH - 34}px; width: 300px; height: 38px; background: rgba(19,18,17,0.86); '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 38px; color: {SMOKE}; padding-left: 12px; box-sizing: border-box">'
             'Our corner. The beat cop is a member.</div>')
    entry_card(o, W - M - 232, PY + PH - 132)
    # big gag: the door slot and tonight's word
    SY = PY + PH + 20
    o.append(f'<div style="position: absolute; left: {M}px; top: {SY}px; width: {W - 2 * M}px; height: 106px; background: #2a2622; '
             f'border: 4px solid {AMBER}; box-sizing: border-box; box-shadow: 0 3px 0 #000">'
             f'<div style="position: absolute; left: 14px; top: 9px; right: 14px; text-align: center">{kicker("The word at the door tonight", AMBER, 16)}</div>'
             f'<div style="position: absolute; left: 22px; right: 22px; top: 32px; height: 56px; background: {BLACK}; border: 2px solid #6b5124"></div>'
             f'<div style="position: absolute; left: 0; right: 0; top: 35px; text-align: center; font-family: {DISP}; font-size: 34px; line-height: 50px; color: {SMOKE}; white-space: nowrap">WHAT&rsquo;S THE RUMPUS?</div>'
             f'<div style="position: absolute; left: 22px; top: 92px; width: 7px; height: 7px; border-radius: 50%; background: {AMBER}"></div>'
             f'<div style="position: absolute; right: 22px; top: 92px; width: 7px; height: 7px; border-radius: 50%; background: {AMBER}"></div></div>')
    # snacks
    menu = (head('Before the business', 'BAR SNACKS')
            + item('Rumpus toasts', '.35', 'Chicken liver p&acirc;t&eacute;, brandy, thyme, hot rye toast.')
            + item('Caspar&rsquo;s cheese straws', '.25', 'Twisted puff pastry, cheddar, parmesan, cayenne.')
            + item('Oysters on the half shell', '.60', 'Half dozen on cracked ice, lemon, red sauce.'))
    o.append(f'<div style="position: absolute; left: {M}px; top: {SY + 122}px; width: {W - 2 * M}px">{menu}</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 864px; width: {W - 2 * M}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 18px; line-height: 40px; color: {SMOKE}">Friends of mine eat first. Hats to the check room. '
             f'<span style="font-family: {SCRIPT}; font-style: normal; font-size: 32px; color: {AMBER}">Leo</span></div>')
    return page('front', ''.join(o))

# ---------------- BACK ----------------
def back():
    o = []
    # the hat in the woods
    TY = 40
    o.append(f'<div style="position: absolute; left: {M}px; top: {TY}px; border: 1px solid {AMBER}; padding: 3px; background: {BLACK}">'
             f'<img src="assets/hat-woods.jpg" alt="A black fedora lying on the leaf litter of a pine forest floor" '
             f'style="display: block; width: {HW}px; height: {HH}px"></div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: {TY + HH + 14}px; width: 400px">'
             + kicker('Lost and found', AMBER, 16)
             + f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.32; color: {SMOKE}; margin-top: 4px">'
               'One black hat, found in the woods. Nobody chases a hat. Claim it at the check room.</div></div>')
    hat_check(o, W - M - 146, TY + HH - 112)

    CY = TY + HH + 96
    menu = (head('Danny Boy on the gramophone', 'SUPPER')
            + item('Leo&rsquo;s Irish stew', '1.10', 'Lamb neck chops, potatoes, carrots, onions, stout.')
            + item('Whiskey bread pudding', '.40', 'Brioche, raisins soaked in the good Irish, custard.')
            + head('Served in a teacup', 'THE BAR', 14)
            + item('Tom&rsquo;s hot toddy', '.75', 'Irish whiskey, honey, lemon, clove, cinnamon stick.')
            + f'<div style="display: flex; gap: 24px">'
              f'<div style="flex: 1">' + item('Rye, neat', '.50', 'Off the boat, honest.') + '</div>'
              f'<div style="flex: 1">' + item('Coffee', '.10', 'Really coffee.') + '</div></div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: {CY}px; width: {W - 2 * M}px">{menu}</div>')

    # big gag: the house rule box
    o.append(f'<div style="position: absolute; left: {M}px; top: 806px; width: {W - 2 * M}px; height: 66px; border: 3px solid {AMBER}; box-sizing: border-box; '
             f'text-align: center; padding-top: 8px">'
             f'<div style="font-family: {DISP}; font-size: 22px; line-height: 1.1; color: {SMOKE}">NO MARKERS. NO CREDIT.</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.08em; color: {AMBER}; line-height: 1.4">Short at the bill? Look in your heart, then your wallet.</div></div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 884px; width: {W - 2 * M}px; text-align: center; font-family: {BODY}; font-size: 16px; '
             f'line-height: 1.3; color: {DIM}">Prices subject to change. Form HH-29. Printed 1929.</div>')
    return page('back', ''.join(o))

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The High Hat supper club card</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
