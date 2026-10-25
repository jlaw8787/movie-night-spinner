"""The Gourmet Club, autumn banquet, New York, 1990. Invitation and bill of fare.
Two faces 600x900 (6.25 x 9.375 in), heavy celadon card, two inks: lizard green-black and Carmine's rose red.
Front: the invitation. Signature piece: two matching formal portraits, the host (TMDB still of Carmine)
and the guest of honor (a real CC0 Komodo dragon photo). Guest list, Carmine's business card.
Back: bill of fare, the chef's portrait (TMDB still), Carmine's note, a DO NOT FEED crate tag, fine print.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 600, 900
PAPER, INK, RED, MUTE, CARD, MAT = '#e5e8d5', '#18291f', '#8e2320', '#4a5a4e', '#fbfaf3', '#f3f2e6'
FONTS = ('https://fonts.googleapis.com/css2?family=Della+Respira'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Pinyon+Script&display=swap')
DISP = "'Della Respira', serif"; BODY = "'Crimson Pro', serif"; SIG = "'Pinyon Script', cursive"
L, CW = 40, 520

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PW, PH = 226, 252   # portrait photo size
host = Image.open(S('ybhvuncCI4LRq7grViINuMbmHTl.jpg')).convert('RGB')
host = ImageEnhance.Brightness(host).enhance(1.05)
fit(host, PW, PH, (110, 80, 620, 650)).save(A('host-carmine.jpg'), quality=90)

guest = Image.open(S('k3.jpg')).convert('RGB')
guest = ImageEnhance.Brightness(guest).enhance(1.06)
guest = ImageEnhance.Contrast(guest).enhance(1.05)
fit(guest, PW, PH, (0, 160, 1536, 2048)).save(A('guest-komodo.jpg'), quality=90)

chef = Image.open(S('ybhvuncCI4LRq7grViINuMbmHTl.jpg')).convert('RGB')
chef = ImageEnhance.Brightness(chef).enhance(1.04)
fit(chef, 176, 196, (1350, 70, 1920, 790)).save(A('chef-london.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(64 - i * 1.9)))
    m = m.filter(ImageFilter.GaussianBlur(12))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 14))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), (70, 78, 40, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 19); wear('back', 90)

# ---------------- type pieces ----------------
def kicker(t, color=RED, size=17, align='center', extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.15; text-align: {align};{extra}">{t}</div>')

def rose_rule(top, w=CW, x=L):
    """Engraved double rule broken by a small rose: a red bud between two green leaves."""
    return (f'<div style="position: absolute; left: {x}px; top: {top}px; width: {w}px; height: 14px">'
            f'<div style="position: absolute; left: 0; right: {w // 2 + 26}px; top: 5px; height: 1px; background: {INK}"></div>'
            f'<div style="position: absolute; left: 0; right: {w // 2 + 26}px; top: 8px; height: 2px; background: {INK}"></div>'
            f'<div style="position: absolute; right: 0; left: {w // 2 + 26}px; top: 5px; height: 1px; background: {INK}"></div>'
            f'<div style="position: absolute; right: 0; left: {w // 2 + 26}px; top: 8px; height: 2px; background: {INK}"></div>'
            f'<div style="position: absolute; left: {w // 2 - 20}px; top: 4px; width: 14px; height: 6px; background: {INK}; border-radius: 6px 0 6px 0"></div>'
            f'<div style="position: absolute; left: {w // 2 + 6}px; top: 4px; width: 14px; height: 6px; background: {INK}; border-radius: 0 6px 0 6px"></div>'
            f'<div style="position: absolute; left: {w // 2 - 6}px; top: 0px; width: 12px; height: 14px; background: {RED}; border-radius: 6px 6px 5px 5px"></div>'
            f'<div style="position: absolute; left: {w // 2 - 2}px; top: 2px; width: 4px; height: 7px; border-left: 1px solid {PAPER}; border-radius: 3px"></div></div>')

def portrait(x, y, label, src, alt, name, cap):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {PW + 16}px; text-align: center">'
            + kicker(label, RED, 16) +
            f'<div style="margin-top: 7px; border: 2px solid {INK}; padding: 5px; background: {MAT}; box-shadow: 0 0 0 4px {PAPER}, 0 0 0 5px {RED}">'
            f'<img src="assets/{src}" alt="{alt}" style="display: block; width: {PW}px; height: {PH}px"></div>'
            f'<div style="margin-top: 13px; font-family: {BODY}; font-weight: 700; font-size: 22px; line-height: 1.1; color: {INK}; white-space: nowrap">{name}</div>'
            f'<div style="margin-top: 3px; font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.25; color: {MUTE}">{cap}</div></div>')

def item(name, num, desc, gap=7):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 26px; line-height: 1.05; color: {INK}; white-space: nowrap">{name}</span>'
            f'<span style="flex: 1; border-bottom: 2px dotted #9aa58f; position: relative; top: -6px"></span>'
            f'<span style="font-family: {DISP}; font-size: 27px; line-height: 1; color: {RED}; white-space: nowrap">{num}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.15; color: {INK}; margin-top: 1px">{desc}</div></div>')

def borders(color):
    return (f'<div style="position: absolute; left: 14px; top: 14px; right: 14px; bottom: 14px; border: 2px solid {color}"></div>'
            f'<div style="position: absolute; left: 20px; top: 20px; right: 20px; bottom: 20px; border: 1px solid {color}"></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.3; object-fit: cover">'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def business_card(o, x, y):
    """Carmine Sabatini's card: engraved, plain, very sure of itself."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 210px; height: 128px; background: {CARD}; '
             f'box-shadow: 0 3px 8px rgba(10,25,15,0.45); transform: rotate(-5deg); box-sizing: border-box; padding: 13px 12px 0; text-align: center">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 17px; letter-spacing: 0.1em; line-height: 1.1; color: {INK}; white-space: nowrap">CARMINE SABATINI</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.2; color: {RED}; margin-top: 3px">Importer</div>'
             f'<div style="width: 60px; height: 1px; background: {INK}; margin: 6px auto 5px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.2; color: {MUTE}">Every word, by definition,<br>a promise.</div>'
             f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; line-height: 1.2; color: {INK}; margin-top: 4px; white-space: nowrap">LITTLE ITALY, NEW YORK</div></div>')

def crate_tag(o, x, y):
    """Shipping tag wired to the guest of honor's crate: manila, eyelet, red warning."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 160px; height: 100px; background: #dcc493; border-radius: 4px 14px 14px 4px; '
             f'box-shadow: 0 3px 8px rgba(10,25,15,0.45); transform: rotate(6deg); box-sizing: border-box; padding: 9px 8px 0 30px">'
             f'<div style="position: absolute; left: -44px; top: 47px; width: 60px; height: 2px; background: #6c6a55; transform: rotate(-24deg); transform-origin: 100% 50%"></div>'
             f'<div style="position: absolute; left: 8px; top: 40px; width: 15px; height: 16px; border-radius: 50%; background: {PAPER}; border: 3px solid #a98f5e; box-sizing: border-box"></div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 19px; letter-spacing: 0.02em; line-height: 1.0; color: {RED}; white-space: nowrap">DO NOT FEED</div>'
             f'<div style="border-top: 1px solid #8b7448; margin-top: 4px; padding-top: 3px; font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.2; color: #3b3220">'
             'Live cargo.<br>Fingers to yourself.</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; line-height: 1.3; color: #3b3220; white-space: nowrap">TO: THE KITCHEN</div></div>')

# ---------------- FRONT ----------------
def front():
    o = [borders(RED)]
    o.append(f'<div style="position: absolute; left: {L}px; top: 42px; width: {CW}px">{kicker("Strictly by invitation. Black tie.")}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 66px; width: {W}px; text-align: center; font-family: {DISP}; font-size: 62px; '
             f'line-height: 1; color: {INK}; white-space: nowrap">The Gourmet Club</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 136px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 21px; line-height: 1.2; color: {INK}">requests the pleasure of your company at its</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 164px; width: {W}px; text-align: center; font-family: {DISP}; font-size: 46px; '
             f'line-height: 1; color: {RED}; white-space: nowrap">Autumn Banquet</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 216px; width: {CW}px; text-align: center; font-family: {BODY}; font-weight: 600; '
             f'font-size: 18px; letter-spacing: 0.08em; line-height: 1.2; color: {MUTE}">EIGHT O&rsquo;CLOCK. THE ADDRESS FOLLOWS BY TELEPHONE.</div>')
    o.append(rose_rule(246))
    o.append(portrait(48, 272, 'Our host', 'host-carmine.jpg',
                      'An older gentleman facing the camera in a dinner jacket and bow tie, a red rose in his lapel, hair combed straight back',
                      'Mr. Carmine Sabatini', 'Any likeness to a gentleman<br>in the pictures is coincidence.'))
    o.append(portrait(310, 272, 'Guest of honor', 'guest-komodo.jpg',
                      'A Komodo dragon facing the camera on rocks and logs, front legs planted, looking straight ahead',
                      'One Komodo dragon', 'Arrives by private delivery.<br>Will not be dining.'))
    o.append(rose_rule(650))
    guests = [('Mr. C. Sabatini', 'host'), ('Mr. L. London', 'chef'), ('Miss T. Sabatini', ''), ('Mr. V. Ray', 'with the car'),
              ('Mr. C. Kellogg', 'freshman'), ('One Komodo dragon', 'honored'), ('Prof. A. Fleeber', 'regrets')]
    rows = ''.join(f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #b7bea6; height: 21px">'
                   f'<span style="font-family: {BODY}; font-weight: {700 if "Komodo" in a else 400}; font-size: 18px; line-height: 1; color: {RED if "Komodo" in a else INK}">{a}</span>'
                   f'<span style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1; color: {MUTE}">{b}</span></div>' for a, b in guests)
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 672px; width: 286px">{kicker("The guest list", RED, 16, "left")}'
             f'<div style="margin-top: 4px">{rows}</div></div>')
    business_card(o, 352, 684)
    o.append(f'<div style="position: absolute; left: 352px; top: 828px; width: 210px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 16px; line-height: 1.2; color: {MUTE}">Kindly reply to Mr. Ray.<br>Do not write anything down.</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = [borders(INK)]
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 42px; width: 310px">{kicker("The Autumn Banquet", RED, 16, "left")}</div>')
    o.append(f'<div style="position: absolute; left: {L + 2}px; top: 68px; font-family: {DISP}; font-size: 64px; line-height: 1; color: {INK}; white-space: nowrap">Bill of Fare</div>')
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 138px; width: 300px; font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.2; color: {MUTE}">'
             'Eight plates from eight o&rsquo;clock.</div>')
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 170px; width: 300px; box-sizing: border-box; border-left: 4px solid {RED}; padding: 0 0 0 14px">'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.26; color: {INK}">'
             'Tonight you eat what nobody else in the world can eat. Then you forget where you ate it.</div>'
             f'<div style="font-family: {SIG}; font-size: 34px; line-height: 1.05; color: {RED}; text-align: right; margin-top: 0px">Carmine Sabatini</div></div>')
    o.append(f'<div style="position: absolute; left: 368px; top: 40px; width: 192px; text-align: center">'
             f'<div style="border: 2px solid {INK}; padding: 6px; background: {MAT}; box-shadow: 0 0 0 4px {PAPER}, 0 0 0 5px {RED}">'
             f'<img src="assets/chef-london.jpg" alt="A tanned chef in a white dinner jacket with an orchid in the lapel, smiling and clapping" style="display: block; width: 176px; height: 196px"></div>'
             f'<div style="margin-top: 10px; font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.2; color: {MUTE}">Mr. Larry London, chef</div></div>')
    menu = (item("Carmine&rsquo;s amaro spritz", 'I', 'Bitter amaro, prosecco and soda on ice, orange wheel.', 0)
            + item('Gourmet Club antipasto, all legal', 'II', 'Salami, mortadella, provolone, red peppers, artichokes.')
            + item('Little Italy fried calamari', 'III', 'Squid rings in a semolina crust, lemon and marinara.')
            + item("Carmine Sabatini&rsquo;s veal marsala", 'IV', 'Butter-seared scaloppine, mushrooms, marsala pan sauce.')
            + item('Rosemary roast potatoes', 'V', 'Crackling edges, garlic and sea salt.')
            + item('The guest of honor', 'VI', '<i>Imported. Very rare. Ask Mr. London, quietly.</i>')
            + item('Cannoli from Little Italy', 'VII', 'Vanilla ricotta, mini chocolate chips, pistachio ends.')
            + item('Espresso and sambuca', 'VIII', 'Three coffee beans in the glass, for luck.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 292px; width: {CW}px">{menu}</div>')
    # ribbon gag
    o.append(f'<div style="position: absolute; left: 30px; top: 774px; width: 340px; height: 38px">'
             f'<div style="position: absolute; left: 0; top: 0; width: 0; height: 0; border-top: 19px solid {RED}; border-bottom: 19px solid {RED}; border-left: 14px solid transparent"></div>'
             f'<div style="position: absolute; left: 14px; top: 0; width: 312px; height: 38px; background: {RED}; text-align: center; font-family: {BODY}; '
             f'font-weight: 700; font-size: 17px; letter-spacing: 0.03em; line-height: 38px; color: {PAPER}; white-space: nowrap">NO ANIMALS WERE SERVED.<i style="font-weight: 600; letter-spacing: 0.02em"> Allegedly.</i></div>'
             f'<div style="position: absolute; left: 326px; top: 0; width: 0; height: 0; border-top: 19px solid {RED}; border-bottom: 19px solid {RED}; border-right: 14px solid transparent"></div></div>')
    o.append(f'<div style="position: absolute; left: {L + 4}px; top: 820px; width: 340px; font-family: {BODY}; font-size: 16px; line-height: 1.2; color: {MUTE}">'
             'Arriving by train? Mind your bags.<br>No cameras, no film students. Form 1990.</div>')
    crate_tag(o, 400, 762)
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Gourmet Club banquet, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
