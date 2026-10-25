"""Builds the Aziz's Pizza delivery flyer for Spider-Man 2 (New York, 2004).
The venue: Mr. Aziz's Village pizzeria, the shop Peter delivers for (fictional name).
The object: a one-sided US Letter delivery flyer on white offset stock, printed in two inks
(pizzeria red and navy), with a row of tear-off coupons along the bottom.
Signature piece: TMDB still of the delivery run, Peter in a Midtown lobby with the boxes bungeed up.
Props: the "29 minutes or it's free" coupon and Aziz's warning slip stapled to the shop copy.
Writes flyer.html, flyer.body.html, film.json, pizzatime.labels.json."""
import os, json
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
FW, FH = 816, 1056
PAPER, RED, NAVY, INK, SLIP = '#fbf8f1', '#c8141e', '#17255a', '#22252e', '#f3df7a'
PEN = '#1d3a8a'
FONTS = 'family=Lilita+One&family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@600;700&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Lilita One', 'Arial Black', sans-serif"
BODY = "'Barlow', Arial, sans-serif"
COND = "'Barlow Condensed', 'Arial Narrow', sans-serif"
HAND = "'Reenie Beanie', cursive"

# ---------- assets ----------
def assets():
    a = os.path.join(D, 'assets')
    # hero still: crop to Peter and the boxes, lift a touch
    im = Image.open(os.path.join(D, 'src', 'gqwkWnH1YAd3uRcT3d9VPk0715z.jpg')).convert('RGB')
    w, h = im.size
    box = (0, int(h * 0.02), int(w * 0.86), int(h * 0.02) + int(w * 0.86 * 330 / 736))
    im = im.crop(box).resize((1472, 660), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1.06); im = ImageEnhance.Contrast(im).enhance(1.05)
    im.save(os.path.join(a, 'still-delivery.jpg'), quality=90)
    # soft wear: gentle edge toning, one soft fold across the middle
    W, H = FW * 2, FH * 2
    rng = np.random.default_rng(2004)
    big = np.asarray(Image.fromarray((rng.random((10, 8)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(90)), float) / 255
    y, x = np.mgrid[0:H, 0:W]
    dx = np.minimum(x, W - 1 - x) / W; dy = np.minimum(y, H - 1 - y) / H
    edge = np.clip(1 - np.minimum(dx * 18, dy * 22), 0, 1) ** 2
    fold = np.exp(-((y - H * 0.5) / 5.0) ** 2) * 22
    al = np.clip(big - 0.6, 0, 1) * 34 + edge * 46 + fold
    out = np.zeros((H, W, 4), 'uint8'); out[..., :3] = (110, 92, 60); out[..., 3] = np.clip(al, 0, 56)
    Image.fromarray(out, 'RGBA').save(os.path.join(a, 'paper-wear-flyer.png'))
assets()

# ---------- helpers ----------
def kicker(t, color=RED, size=18, extra=''):
    return f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; line-height: 1.1; letter-spacing: 0.16em; text-transform: uppercase; color: {color}; {extra}">{t}</div>'

def head(t, sub=''):
    s = f'<div style="margin-left: 10px; font-family: {COND}; font-weight: 700; font-size: 17px; letter-spacing: 0.1em; text-transform: uppercase; color: {PAPER}; padding-top: 4px">{sub}</div>' if sub else ''
    return (f'<div style="display: flex; align-items: center; background: {NAVY}; border-radius: 22px 4px 22px 4px; padding: 6px 14px 4px">'
            f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {PAPER}; letter-spacing: 0.02em">{t}</div>{s}</div>')

def dish(name, price, desc, top=10):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px">'
            f'<div style="flex: 1; font-family: {DISP}; font-size: 26px; line-height: 1; color: {NAVY}">{name}</div>'
            f'<div style="font-family: {DISP}; font-size: 26px; line-height: 1; color: {RED}">{price}</div></div>'
            + (f'<div style="margin-top: 2px; font-family: {BODY}; font-size: 19px; line-height: 1.18; color: {INK}">{desc}</div>' if desc else '') + '</div>')

# ---------- dishes (k = spec key) ----------
PIES = [
  ('Thirty-minute pepperoni pie', 'Pepperoni pie', '14.29',
   'Thin crisp crust, crushed tomato, low-moisture mozzarella, cupping pepperoni.'),
  (None, 'Cheese pie', '12.00', 'Eight big slices. Fold them.'),
  (None, 'By the slice', '2.00', 'Toppings 50 cents each.'),
]
START = [
  ("Joe's Pizza garlic knots", 'Garlic knots', '3.00', 'Six knots of our dough, baked golden, tossed in garlic butter and parsley.'),
  ('Potato knishes', 'Knish', '2.50', 'Potato and fried onion in thin pastry, baked golden. Yellow mustard.'),
]
MORN = [
  ("Aunt May's pancakes", 'Pancakes', '4.50', 'Buttermilk stack cooked in butter, maple syrup. Like your aunt makes.'),
]
DRINK = [
  ('Iced coffee', 'Coffee float', '2.75', 'Cold brew on ice, milk, a scoop of vanilla ice cream.'),
  (None, 'Soda, can', '1.00', ''),
]

# ---------- pieces ----------
def sticker(x, y, d=176):
    """The round shop sticker, the same one on the drivers' helmets."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; border-radius: 50%; background: {RED}; box-sizing: border-box; border: 5px solid {NAVY}">'
            f'<div style="position: absolute; left: 7px; top: 7px; width: {d - 24}px; height: {d - 24}px; border-radius: 50%; border: 2px solid {PAPER}"></div>'
            f'<div style="position: absolute; left: 0; top: {d*0.15:.0f}px; width: {d - 10}px; text-align: center; font-family: {COND}; font-weight: 700; font-size: 16px; letter-spacing: 0.2em; color: {PAPER}">EST. 1962</div>'
            f'<div style="position: absolute; left: 0; top: {d*0.26:.0f}px; width: {d - 10}px; text-align: center; font-family: {DISP}; font-size: {d//4}px; line-height: 1; color: {PAPER}">AZIZ\'S</div>'
            f'<div style="position: absolute; left: 22px; top: {d*0.54:.0f}px; width: {d - 54}px; height: 3px; background: {PAPER}"></div>'
            f'<div style="position: absolute; left: 0; top: {d*0.59:.0f}px; width: {d - 10}px; text-align: center; font-family: {COND}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; color: {PAPER}">FAST DELIVERY</div>'
            f'</div>')

def burst(x, y, s=170):
    sq = ''.join(f'<div style="position: absolute; left: 0; top: 0; width: {s}px; height: {s}px; background: {RED}; transform: rotate({a}deg)"></div>' for a in (0, 22.5, 45, 67.5))
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {s}px; height: {s}px; transform: rotate(-9deg)">{sq}'
            f'<div style="position: absolute; left: 14px; top: 14px; width: {s - 28}px; height: {s - 28}px; border-radius: 50%; background: {SLIP}; border: 3px solid {NAVY}; box-sizing: border-box; text-align: center">'
            f'<div style="margin-top: 12px; font-family: {DISP}; font-size: 48px; line-height: 0.9; color: {RED}">29</div>'
            f'<div style="font-family: {DISP}; font-size: 17px; line-height: 0.95; color: {NAVY}">MINUTES<br>OR IT\'S FREE</div></div></div>')

def warning_slip(x, y):
    """Aziz's warning slip, stapled to the shop copy of the flyer by the register."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 236px; height: 168px; transform: rotate(4deg); background: {SLIP}; box-shadow: 0 3px 9px rgba(0,0,0,0.32)">'
            f'<div style="position: absolute; left: 96px; top: 6px; width: 34px; height: 3px; background: #8d8d8d; border-radius: 1px; box-shadow: 0 1px 0 #ffffff"></div>'
            f'<div style="position: absolute; left: 12px; top: 16px; width: 212px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {RED}; padding-bottom: 2px">'
            f'<div style="font-family: {COND}; font-weight: 700; font-size: 20px; letter-spacing: 0.06em; color: {RED}">DRIVER WARNING</div>'
            f'<div style="font-family: {COND}; font-weight: 700; font-size: 15px; color: {RED}">No. 06</div></div>'
            f'<div style="margin-top: 4px; font-family: {HAND}; font-size: 25px; line-height: 0.92; color: {PEN}">Parker. Late AGAIN. You are a nice boy but not dependable. Next time, you are finished.</div>'
            f'<div style="margin-top: 2px; text-align: right; font-family: {HAND}; font-size: 30px; line-height: 0.9; color: {PEN}">Mr. Aziz</div>'
            f'</div></div>')

def coupon(x, w, inner, bg=PAPER):
    return (f'<div style="position: absolute; left: {x}px; top: 0; width: {w}px; height: 104px; box-sizing: border-box; background: {bg}; '
            f'border: 2px dashed {NAVY}; padding: 8px 10px 0">{inner}</div>')

def coupons():
    c_title = lambda t, col=NAVY, s=25: f'<div style="font-family: {DISP}; font-size: {s}px; line-height: 0.95; color: {col}">{t}</div>'
    c_text = lambda t, col=INK: f'<div style="margin-top: 3px; font-family: {BODY}; font-weight: 600; font-size: 15px; line-height: 1.15; color: {col}">{t}</div>'
    row = (coupon(0, 214, kicker('Our promise', SLIP, 14) + c_title('29 MINUTES OR IT\'S FREE', PAPER, 22)
                  + c_text('Late pie? It\'s on us, and Mr. Aziz has words with the driver.', PAPER), RED)
           + coupon(224, 166, c_title('FOUR ARMS, FOUR PIES', NAVY, 22) + c_title('$40.04', RED, 30) + c_text('For a doctor with his hands full.'))
           + coupon(400, 166, c_title('FREE KNOTS') + c_text('With any pie. Any floor. We take the stairs, the lift or the wall.'))
           + coupon(576, 160, c_title('STUDENT SLICE') + c_text('Slice and soda 2.50 with a university ID.')))
    return (f'<div style="position: absolute; left: 40px; top: 882px; width: 736px; height: 104px">{row}</div>'
            f'<div style="position: absolute; left: 40px; top: 862px; width: 736px; display: flex; align-items: center; gap: 10px">'
            f'<div style="flex: 1; border-top: 2px dashed {NAVY}"></div>'
            f'{kicker("Clip and save. One coupon per order", NAVY, 14, "letter-spacing: 0.14em")}'
            f'<div style="flex: 1; border-top: 2px dashed {NAVY}"></div></div>')

def tally_board():
    """The late board by the register: every late run gets a mark."""
    def group(n, slash=True):
        bars = ''.join(f'<div style="position: absolute; left: {i * 9}px; top: 0; width: 4px; height: 34px; background: {NAVY}"></div>' for i in range(min(n, 4)))
        sl = (f'<div style="position: absolute; left: -6px; top: 15px; width: 46px; height: 4px; background: {RED}; transform: rotate(-28deg)"></div>' if n == 5 else '')
        return f'<div style="position: relative; width: {min(n, 4) * 9}px; height: 34px; margin-right: 14px">{bars}{sl}</div>'
    marks = group(5) + group(5) + group(5) + group(2)
    return (f'<div style="margin-top: 14px; border: 3px solid {NAVY}; padding: 8px 10px 10px; background: #ffffff">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            f'<div style="font-family: {DISP}; font-size: 24px; line-height: 1; color: {RED}">LATE AGAIN</div>'
            f'<div style="font-family: {COND}; font-weight: 700; font-size: 16px; letter-spacing: 0.08em; color: {NAVY}">DRIVER: P. PARKER</div></div>'
            f'<div style="margin-top: 8px; display: flex; align-items: center">{marks}</div>'
            f'<div style="margin-top: 6px; font-family: {BODY}; font-weight: 600; font-size: 15px; line-height: 1.2; color: {INK}">Seventeen this month. The board stays up until he learns.</div></div>')

def late_stamp(x, y):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; transform: rotate(-9deg); border: 4px solid {RED}; border-radius: 6px; padding: 4px 12px 2px; background: rgba(251,248,241,0.82)">'
            f'<div style="font-family: {DISP}; font-size: 38px; line-height: 1; color: {RED}; letter-spacing: 0.04em">LATE AGAIN</div>'
            f'<div style="font-family: {COND}; font-weight: 700; font-size: 15px; letter-spacing: 0.16em; color: {RED}; text-align: center">31 MINUTES. PIE IS FREE.</div></div>')

# ---------- the sheet ----------
def sheet():
    top = (f'{sticker(40, 30, 160)}'
           f'<div style="position: absolute; left: 212px; top: 40px; width: 400px">'
           f'{kicker("Greenwich Village &middot; Since 1962")}'
           f'<div style="margin-top: 4px; font-family: {DISP}; font-size: 58px; line-height: 1; white-space: nowrap; color: {RED}; text-shadow: 3px 3px 0 {NAVY}">AZIZ\'S PIZZA</div>'
           f'<div style="margin-top: 4px; font-family: {BODY}; font-weight: 700; font-size: 19px; line-height: 1.2; color: {NAVY}">Free delivery, Village to Midtown. 11 AM to 2 AM.</div>'
           f'</div>'
           f'<div style="position: absolute; left: 212px; top: 146px; width: 400px; display: flex; align-items: baseline; gap: 12px">'
           f'<div style="font-family: {COND}; font-weight: 700; font-size: 20px; letter-spacing: 0.1em; color: {RED}">CALL</div>'
           f'<div style="font-family: {DISP}; font-size: 46px; line-height: 1; color: {NAVY}">212-555-0629</div></div>'
           f'{burst(622, 34, 146)}')
    hero = (f'<div style="position: absolute; left: 40px; top: 214px; width: 736px; height: 282px; box-sizing: border-box; border: 4px solid {RED}; overflow: hidden">'
            f'<img src="assets/still-delivery.jpg" alt="Peter in a marble office lobby with a stack of pizza boxes held on by a bungee cord" style="position: absolute; left: 0; top: 0; width: 728px; height: 274px; object-fit: cover; object-position: 50% 30%; display: block">'
            f'<div style="position: absolute; left: 0; bottom: 0; background: {NAVY}; padding: 7px 14px 6px; font-family: {BODY}; font-weight: 600; font-size: 18px; line-height: 1.2; color: {PAPER}">'
            f'One driver, one bungee cord, a stack of pies. 42 blocks to go.</div></div>'
            f'{warning_slip(528, 232)}{late_stamp(560, 420)}')
    c1 = ''.join(dish(n, p, d, 8 if i else 10) for i, (_, n, p, d) in enumerate(PIES))
    c2 = ''.join(dish(n, p, d, 8 if i else 10) for i, (_, n, p, d) in enumerate(START))
    c3 = (''.join(dish(n, p, d, 10) for _, n, p, d in MORN)
          + f'<div style="margin-top: 14px">{head("DRINKS")}</div>'
          + ''.join(dish(n, p, d, 8 if i else 10) for i, (_, n, p, d) in enumerate(DRINK)))
    menu = (f'<div style="position: absolute; left: 40px; top: 512px; width: 736px; height: 336px; display: flex; gap: 20px">'
            f'<div style="width: 250px">{head("PIES", "18 inch")}{c1}{tally_board()}</div>'
            f'<div style="width: 1px; background: {NAVY}; opacity: 0.35"></div>'
            f'<div style="width: 222px">{head("STARTERS")}{c2}'
            f'<div style="margin-top: 12px; font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 1.25; color: {RED}">Our deck oven runs hotter than a small sun.</div>'
            f'<div style="margin-top: 8px; font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 1.25; color: {NAVY}">Costume party? We deliver. We hear the suits itch.</div></div>'
            f'<div style="width: 1px; background: {NAVY}; opacity: 0.35"></div>'
            f'<div style="width: 222px">{head("WEEKENDS", "to noon")}{c3}</div>'
            f'</div>')
    foot = (f'<div style="position: absolute; left: 40px; top: 996px; width: 736px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 14px; line-height: 1.2; color: {INK}">'
            f'<span>Prices subject to change. Drivers carry under $20. Fired drivers return the helmet sticker. Bugle newsroom orders, ask for Betty.</span>'
            f'<span style="white-space: nowrap; margin-left: 12px">Form 2004-SM2</span></div>')
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; object-fit: cover; opacity: 0.22; display: block">'
            f'{top}{hero}{menu}{coupons()}{foot}'
            f'<img src="assets/paper-wear-flyer.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block">'
            f'</div>')

body = sheet()
open(os.path.join(D, 'flyer.body.html'), 'w').write(body)
open(os.path.join(D, 'flyer.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Aziz\'s Pizza delivery flyer</title>{LINK}'
    f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "pizzatime", "fn": "fmtPizzaTime", "faces": ["flyer.html"], "names": ["Flyer"], "mm": [215.9, 279.4],
        "fonts": FONTS, "fams": ["Lilita One", "Barlow", "Barlow Condensed", "Reenie Beanie"],
        "phone": {"disp": "'Lilita One',sans-serif", "title": "'Lilita One',sans-serif", "name": "'Lilita One',sans-serif",
                  "body": "'Barlow',sans-serif", "price": "'Lilita One',sans-serif", "note": "'Barlow',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1)
NOTES = {'Thirty-minute pepperoni pie': '29 minutes or it\'s free. Clock starts when you hang up.',
         "Joe's Pizza garlic knots": 'Six free with any pie, with the coupon.',
         'Potato knishes': 'Hot from the case by the register.',
         "Aunt May's pancakes": 'Saturday and Sunday mornings. Just like your aunt makes.',
         'Iced coffee': 'For drivers who are running late.'}
labels = {}
for k, n, p, d in PIES + START + MORN + DRINK:
    if k: labels[k] = {'n': n, 'd': d, 'note': NOTES[k]}
json.dump({"Spider-Man 2 (2004)": labels}, open(os.path.join(D, 'pizzatime.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
