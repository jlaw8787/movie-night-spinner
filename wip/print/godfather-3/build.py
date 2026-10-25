"""The Godfather Part III (1990). Opening night programme, Palermo opera house, 1979,
with the supper served in the Ridotto after Cavalleria rusticana. Two faces 672x1056 (7 x 11 in).
Front: red velvet cover stock, gold ink, the house itself (CC0 photo, signature), the bill with
Anthony's debut, the Corleone box ticket, the foyer menu before curtain.
Back: ivory programme stock, the supper menu set like an opera in one act, the box on opening
night (TMDB still), Anthony's note to his father, the pastry box.
Writes photo crops, wear, front/back .body.html and .html."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 672, 1056
VELVET, VELVET2, GOLD, GOLDL, IVORY, INK, RED = '#4a0e15', '#2c070c', '#c9a14e', '#e6cd8f', '#f4ecdb', '#2a1a14', '#7d1520'
FONTS = ('https://fonts.googleapis.com/css2?family=Tenor+Sans&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400'
         '&family=Herr+Von+Muellerhoff&display=swap')
DISP = "'Tenor Sans', sans-serif"; BODY = "'EB Garamond', serif"; HAND = "'Herr Von Muellerhoff', cursive"
L, CW = 40, 592

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PH_W, PH_H = CW - 20, 270
bx = Image.open(S('box.jpg')).convert('RGB')
bx = ImageEnhance.Brightness(bx).enhance(1.7)
bx = ImageEnhance.Contrast(bx).enhance(1.06)
fit(bx, PH_W, PH_H, (0, 200, 3465, 1840)).save(A('the-boxes.jpg'), quality=92)

BX_W, BX_H = 300, 196
on = Image.open(S('opera-night.jpg')).convert('RGB')
on = ImageEnhance.Brightness(on).enhance(1.12)
fit(on, BX_W, BX_H, (360, 30, 1920, 1050)).save(A('opera-night.jpg'), quality=92)

def wear(name, seed, rgb, strength):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2.05)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 16, H // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 18))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    lay = Image.new('RGBA', (W, H), rgb + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * strength)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 1990, (12, 2, 4), 0.85); wear('back', 1979, (120, 80, 40), 0.5)

# ---------------- type pieces ----------------
def kicker(t, color, size=18, extra=''):
    return (f'<div style="font-family: {DISP}; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1;{extra}">{t}</div>')

def item(name, it, price, desc, ink, pc, gap=9):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; '
            f'font-weight: 700; font-size: 28px; line-height: 1.05; color: {ink}">'
            f'<span>{name} <i style="font-weight: 400; font-size: 21px; opacity: .8">{it}</i></span>'
            f'<span style="color: {pc}; white-space: nowrap">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.18; color: {ink}; margin-top: 2px">{desc}</div></div>')

def act(title, sub, color, rule, extra=''):
    """Section head set like a programme's act heading: spaced Tenor caps between gold rules."""
    return (f'<div style="display: flex; align-items: center; gap: 14px;{extra}">'
            f'<div style="font-family: {DISP}; font-size: 36px; line-height: 1; color: {color}; letter-spacing: 0.06em">{title}</div>'
            f'<div style="flex: 1; height: 1px; background: {rule}"></div>'
            f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; color: {color}">{sub}</div></div>')

def gilt(content, extra=''):
    """Heavy gilt picture frame with corner rosettes, like the box fronts in the house."""
    ros = ''.join(f'<div style="position: absolute; {v}: -9px; {h}: -9px; width: 18px; height: 18px; border-radius: 50%; '
                  f'background: radial-gradient(circle at 40% 35%, {GOLDL} 0%, {GOLD} 45%, #7a5a22 100%); box-shadow: 0 1px 3px rgba(0,0,0,.5)"></div>'
                  for v in ('top', 'bottom') for h in ('left', 'right'))
    return (f'<div style="position: absolute; {extra} border: 4px solid {GOLD}; padding: 5px; background: #1a0306; '
            f'box-shadow: 0 0 0 1px #6b4a1c, 0 0 0 3px {GOLDL}, 0 0 0 4px #6b4a1c, 0 6px 14px rgba(0,0,0,.5)">'
            f'<div style="border: 1px solid {GOLDL}; line-height: 0">{content}</div>{ros}</div>')

def frame(border, inner, content, extra=''):
    return (f'<div style="position: absolute; {extra} border: 2px solid {border}; padding: 5px">'
            f'<div style="border: 1px solid {inner}; line-height: 0">{content}</div></div>')

grain = '<img src="assets/paper-grain.png" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0.35">'

# ---------------- FRONT ----------------
ticket = f'''<div style="position: absolute; left: 386px; top: 382px; width: 236px; height: 112px; transform: rotate(-5deg);
 background: #f6eedb; box-shadow: 0 3px 8px rgba(0,0,0,.45); display: flex">
 <div style="flex: 1; padding: 10px 0 0 14px; border-right: 2px dashed #b89a5c">
  <div style="font-family: {DISP}; font-size: 14px; letter-spacing: .16em; color: {RED}">PALCO DI PRIM'ORDINE</div>
  <div style="font-family: {DISP}; font-size: 30px; line-height: 1.08; color: {INK}; margin-top: 6px">CORLEONE</div>
  <div style="font-family: {BODY}; font-size: 16px; color: {INK}; margin-top: 3px">Sei posti. Ore 20.30</div>
 </div>
 <div style="width: 58px; text-align: center; padding-top: 12px">
  <div style="font-family: {DISP}; font-size: 14px; color: {RED}">N.</div>
  <div style="font-family: {DISP}; font-size: 26px; line-height: 1.1; color: {INK}">1</div>
  <div style="font-family: {BODY}; font-size: 14px; color: {INK}; margin-top: 8px">Prima</div>
 </div></div>'''

front_items = (
    item('Panelle', '', 'L. 1.500', 'Chickpea fritters with parsley, fried crisp. Salt and a squeeze of lemon.', IVORY, GOLDL, 10)
    + item('Prosciutto e melone', '', 'L. 4.000', 'Ripe cantaloupe, cured ham, cracked pepper and olive oil.', IVORY, GOLDL)
    + item('Limoncello e spumante', '', 'L. 3.000', 'Lemon liqueur on ice, prosecco and soda, lemon peel and mint.', IVORY, GOLDL))

front = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: radial-gradient(ellipse at 50% 38%, {VELVET} 0%, #3c0a11 55%, {VELVET2} 100%)">
{grain}
<img src="assets/wear-front.png" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px">
<div style="position: absolute; left: 18px; top: 18px; width: {W-40}px; height: {H-40}px; border: 1px solid rgba(201,161,78,.55)"></div>
<div style="position: absolute; left: 24px; top: 24px; width: {W-52}px; height: {H-52}px; border: 3px double rgba(201,161,78,.5)"></div>
<img src="assets/velvet-valance.png" style="position: absolute; left: 0; top: 0; width: {W}px; height: 130px">
<div style="position: absolute; left: {L}px; top: 128px; width: {CW}px; text-align: center">
 {kicker('Teatro Massimo &nbsp;&middot;&nbsp; Palermo', GOLD, 18)}
 {kicker('Stagione lirica 1979 &nbsp;&middot;&nbsp; serata di gala', GOLDL, 16, ' margin-top: 8px; letter-spacing: .2em')}
</div>
{gilt(f'<img src="assets/the-boxes.jpg" style="width: {PH_W}px; height: {PH_H}px; display: block">', f'left: {L}px; top: 186px;')}
{ticket}
<div style="position: absolute; left: {L}px; top: 486px; width: 350px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.25; color: {GOLDL}">The boxes on a gala night, carnations on the rail.</div>
<div style="position: absolute; left: {L}px; top: 520px; width: {CW}px; text-align: center">
 <div style="font-family: {DISP}; font-size: 54px; line-height: 1.0; color: {IVORY}; letter-spacing: .04em">CAVALLERIA<br>RUSTICANA</div>
 <div style="font-family: {BODY}; font-style: italic; font-size: 22px; color: {GOLDL}; margin-top: 8px">Melodramma in un atto di Pietro Mascagni</div>
 <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 8px auto 6px"><div style="width: 90px; height: 1px; background: {GOLD}"></div><div style="width: 9px; height: 9px; background: {GOLD}; transform: rotate(45deg)"></div><div style="width: 90px; height: 1px; background: {GOLD}"></div></div>
 <div style="font-family: {BODY}; font-size: 22px; color: {IVORY}; line-height: 1.3">Turiddu: <b>Anthony Vito Corleone</b>, in his debut</div>
 <div style="font-family: {BODY}; font-size: 19px; color: {GOLDL}; line-height: 1.3; margin-top: 4px">Tonight the house welcomes his father home to Sicily.</div>
</div>
<div style="position: absolute; left: {L}px; top: 754px; width: {CW}px">
 {act('PRIMA DEL SIPARIO', 'foyer', GOLD, 'rgba(201,161,78,.7)')}
 {front_items}
</div>
<div style="position: absolute; left: {L}px; top: 996px; width: {CW}px; text-align: center">{kicker('Con il contributo della Fondazione Vito Corleone', GOLD, 15, ' letter-spacing: .14em')}</div>
</div>'''

# ---------------- BACK ----------------
pastry = f'''<div style="position: absolute; left: 470px; top: 362px; width: 158px; height: 70px; transform: rotate(4deg);
 background: #f7e3e1; box-shadow: 0 3px 7px rgba(60,20,10,.35); border: 1px solid #d8b7b0">
 <div style="position: absolute; left: 0; top: 32px; width: 158px; height: 6px; background: {GOLD}"></div>
 <div style="position: absolute; left: 76px; top: 0; width: 6px; height: 70px; background: {GOLD}"></div>
 <div style="position: absolute; left: 18px; top: 7px; width: 122px; height: 56px; background: #fffaf2; border: 1px solid {RED}; text-align: center">
  <div style="font-family: {DISP}; font-size: 14px; letter-spacing: .1em; color: {RED}; margin-top: 7px">MANEGGIARE</div>
  <div style="font-family: {DISP}; font-size: 14px; letter-spacing: .1em; color: {RED}">CON CURA</div>
  <div style="font-family: {BODY}; font-style: italic; font-size: 14px; color: {INK}; line-height: 1.1">handle with care</div>
 </div></div>'''

back = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: radial-gradient(ellipse at 50% 45%, #f7f0e1 0%, {IVORY} 60%, #e8dcc2 100%)">
{grain}
<img src="assets/wear-back.png" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px">
<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {VELVET}"></div>
<div style="position: absolute; left: 0; top: 12px; width: {W}px; height: 2px; background: {GOLD}"></div>
<div style="position: absolute; left: {L}px; top: 42px; width: {CW}px; text-align: center">
 {kicker('Nel Ridotto, dopo il sipario', RED, 18)}
 <div style="font-family: {DISP}; font-size: 46px; line-height: 1.02; color: {INK}; margin-top: 10px; letter-spacing: .03em; white-space: nowrap">CENA DOPO L'OPERA</div>
 <div style="font-family: {BODY}; font-style: italic; font-size: 21px; color: {RED}; margin-top: 4px">Supper after the opera. Una sera in Sicilia.</div>
</div>
{frame(GOLD, 'rgba(125,21,32,.5)', f'<img src="assets/opera-night.jpg" style="width: {BX_W}px; height: {BX_H}px; display: block">', f'left: {L}px; top: 160px;')}
<div style="position: absolute; left: {L}px; top: 376px; width: 316px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.2; color: {INK}">Gala night. The Corleone party arrives.</div>
<div style="position: absolute; left: 380px; top: 160px; width: 252px">
 {kicker('Dal camerino', RED, 16)}
 <div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {INK}; margin-top: 8px">Papa, you came back to Sicily to hear me sing. Tonight Turiddu is for you. Stay for supper after, Mamma has promised she will.</div>
 <div style="font-family: {HAND}; font-size: 54px; line-height: 1; color: #23304f; margin-top: 4px">Anthony</div>
</div>
<div style="position: absolute; left: {L}px; top: 436px; width: {CW}px">
 {act('ATTO UNICO', '', RED, 'rgba(125,21,32,.45)')}
 {item('Pasta alla Norma', '', 'L. 6.000', 'Rigatoni, fried eggplant, tomato and basil, under grated ricotta salata.', INK, RED, 10)}
 {item('Pasta con le sarde', '', 'L. 7.500', 'Fresh sardines, wild fennel, raisins, pine nuts and toasted crumbs.', INK, RED)}
 {act('INTERMEZZO', '', RED, 'rgba(125,21,32,.45)', ' margin-top: 12px')}
 {item('Cannoli', '', 'L. 2.500', 'Crisp shells filled to order with sweet ricotta, candied orange, pistachio.', INK, RED, 10)}
 {item('Cassatina', '', 'L. 3.000', 'Sponge, sweet ricotta and green marzipan, crowned with candied fruit.', INK, RED)}
 {act('BRINDISI', 'a toast', RED, 'rgba(125,21,32,.45)', ' margin-top: 12px')}
 {item('Marsala vergine', '', 'L. 2.000', 'Dry, amber and cool. Raise it to the new Commendatore.', INK, RED, 10)}
 {item('Caffè', '', 'L. 600', 'Short and black, from the bar in the Ridotto.', INK, RED)}
</div>
{pastry}
<div style="position: absolute; left: {L}px; top: 974px; width: {CW}px; text-align: center; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {INK}; opacity: .85">
 Prices subject to change. Orange juice is kept at the bar for any guest who feels faint.<br>Programma n. 1990. Piazza Verdi, Palermo. Cannoli may be sent up to your palco.</div>
</div>'''

def page(body):
    return (f'<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="{FONTS}">'
            f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

for n, b in (('front', front), ('back', back)):
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(page(b))
print('built')
