"""Le Vieux Port, a French restaurant on the East Side, winter carte 1971 (The French Connection).
Tall French carte, two faces 672x1344 (7 x 14 in). Writes front.body.html, back.body.html, front.html, back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 672, 1344
FONTS = 'family=Gilda+Display&family=Spectral:ital,wght@0,400;0,600;0,700;1,400&family=Covered+By+Your+Grace'
PAPER, INK, BRASS, SOFT = '#e6e7e0', '#22343c', '#a8782a', '#4a5a60'
DISP = "'Gilda Display',serif"
BODY = "'Spectral',serif"
HAND = "'Covered By Your Grace',cursive"


def ab(x, y, w, h, inner, extra=''):
    hh = f'height:{h}px;' if h else ''
    return f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;{hh}{extra}">{inner}</div>'


def kicker(t, color=BRASS, align='left'):
    return f'<div style="font:600 18px/1 {BODY};letter-spacing:.24em;color:{color};text-align:{align}">{t}</div>'


def section(t, sub=''):
    """Section title set between two brass hairlines, French carte style."""
    s = f'<div style="font:400 15px/1 {BODY};letter-spacing:.2em;color:{SOFT};margin-top:6px;text-align:center">{sub}</div>' if sub else ''
    return (f'<div style="display:flex;align-items:center;gap:16px">'
            f'<div style="flex:1;height:0;border-top:1px solid {BRASS};border-bottom:1px solid {BRASS};padding-top:3px"></div>'
            f'<div style="font:400 44px/1 {DISP};color:{INK};white-space:nowrap">{t}</div>'
            f'<div style="flex:1;height:0;border-top:1px solid {BRASS};border-bottom:1px solid {BRASS};padding-top:3px"></div></div>{s}')


def item(name, price, desc, last=False):
    rule = '' if last else f'border-bottom:1px solid rgba(34,52,60,.22);'
    return (f'<div style="padding:9px 0 10px;{rule}">'
            f'<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">'
            f'<div style="font:700 27px/1.15 {BODY};color:{INK}">{name}</div>'
            f'<div style="font:700 27px/1.15 {BODY};color:{INK};white-space:nowrap">{price}</div></div>'
            f'<div style="font:400 20px/1.36 {BODY};color:{SOFT};margin-top:4px">{desc}</div></div>')


def items(lst):
    return ''.join(item(*x, last=(i == len(lst) - 1)) for i, x in enumerate(lst))


def paper(n):
    return (f'<img src="assets/paper-grain.png" alt="" style="position:absolute;left:-200px;top:0;width:1270px;height:{H}px;opacity:.5;display:block">'
            f'<img src="assets/wear-f{n}.png" alt="" style="position:absolute;left:0;top:0;width:{W}px;height:{H}px;display:block">')


def frame(src, w, h, cap, capw=None):
    return (f'<div style="border:1px solid {BRASS};padding:5px;background:#f4f3ee">'
            f'<img src="{src}" alt="" style="display:block;width:{w}px;height:{h}px"></div>'
            f'<div style="font:italic 400 17px/1.3 {BODY};color:{SOFT};margin-top:8px;{f"width:{capw}px;" if capw else ""}">{cap}</div>')


# ---------------------------------------------------------------- front
HORS = [
    ("Pâté maison", "1.75", "Chicken livers seared pink and flamed with cognac, blended with butter, shallot and thyme. Cornichons, warm baguette."),
    ("Grenouilles No. 1", "2.50", "Frog legs sautéed in butter, garlic and parsley, lemon."),
    ("Soupe à l'oignon", "1.25", "Onions cooked slowly to deep brown in beef broth, baked under a crouton and bubbling Gruyère."),
    ("Salade niçoise", "1.95", "Tuna, anchovy, green beans, waxy potatoes, egg and black olives in a mustard vinaigrette."),
]

notebook_lines = [
    "Tues. 12:40",
    "FROG ONE + one more,",
    "window table. The works.",
    "Cloudy: coffee, doughnuts .35",
    "Coffee's cold. Feet too.",
]
rules = ''.join(f'<div style="position:absolute;left:0;right:0;top:{46 + i * 30}px;border-top:1px solid #9fb6c9"></div>' for i in range(8))
holes = ''.join(f'<div style="position:absolute;top:9px;left:{22 + i * 26}px;width:10px;height:10px;border-radius:50%;background:#b9bbb3"></div>' for i in range(10))
nb_text = ''.join(f'<div style="height:30px;font:400 20px/30px {HAND};color:#27408b;white-space:nowrap">{t}</div>' for t in notebook_lines)
notebook = (f'<div style="position:absolute;left:0;top:0;width:272px;height:252px;background:#f8f7ef;box-shadow:0 2px 6px rgba(20,30,34,.28);transform:rotate(-3deg)">'
            f'<div style="position:absolute;left:0;right:0;top:0;height:28px;border-bottom:2px solid #c7c3b2"></div>{holes}'
            f'<div style="position:absolute;left:30px;top:0;bottom:0;border-left:1px solid #d99a9a"></div>{rules}'
            f'<div style="position:absolute;left:38px;top:34px">{nb_text}'
            f'<div style="font:400 24px/30px {HAND};color:#27408b;margin-left:120px">J.D.</div></div></div>')

front = f'''<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{PAPER};font-family:{BODY}">
{paper(1)}
<div style="position:absolute;left:0;top:0;width:{W}px;height:230px;background:{INK}"></div>
<div style="position:absolute;left:24px;top:24px;width:{W - 48}px;height:182px;border:1px solid {BRASS}"></div>
{ab(40, 46, W - 80, 0, kicker('NEW YORK, CARTE D&#39;HIVER 1971', BRASS, 'center'))}
{ab(40, 74, W - 80, 0, f'<div style="font:400 86px/1 {DISP};color:{PAPER};text-align:center;letter-spacing:-.01em">Le Vieux Port</div>')}
{ab(40, 168, W - 80, 0, f'<div style="font:italic 400 20px/1.2 {BODY};color:#cfd5d2;text-align:center">Cuisine de Marseille, East Side</div>')}

{ab(40, 262, 288, 0, frame('assets/photo-street.png', 276, 440, 'Our corner, a January morning. Steam from the street, cabs at the kerb.', 288))}

{ab(352, 262, 280, 0, kicker('LA MAISON') + f'<div style="font:400 20px/1.42 {BODY};color:{INK};margin-top:12px">From the old port of Marseille to the East Side. Butter, wine and a slow fire, the way they cook on the quay. Window tables are kept for our regulars.</div>')}
{ab(352, 500, 272, 252, notebook)}
<img src="assets/ring.png" alt="" style="position:absolute;left:520px;top:668px;width:120px;height:120px;display:block">

{ab(40, 790, W - 80, 0, section('Hors d&#39;oeuvre', 'ET POTAGES') + f'<div style="margin-top:6px">{items(HORS)}</div>')}
</div>'''

# ---------------------------------------------------------------- back
PLATS = [
    ("Steak frites béarnaise", "6.75", "Sirloin seared hard and rested, warm tarragon and shallot butter sauce, hand-cut potatoes fried twice."),
    ("Coq au vin", "5.50", "Chicken braised slowly in Burgundy with lardons, button mushrooms and small onions."),
    ("Bouillabaisse", "7.50", "Rockfish, red mullet and mussels in saffron and fennel broth. Rouille and croutons."),
]
DESS = [
    ("Crème caramel", "1.25", "Vanilla custard baked in a water bath, chilled, turned out under amber syrup."),
    ("Tarte Tatin", "1.25", "Apples baked under butter and sugar, turned out warm with crème fraîche."),
]
BAR = [
    ("Mauresque", "1.50", "Pastis and orgeat over ice, clouded with water."),
    ("Vin en carafe", "1.75", "Young Côtes du Rhône, half carafe. The full carafe 3.25."),
    ("Café filtre", ".35", "Dark roast, black, with a square of bitter chocolate."),
]

back = f'''<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{PAPER};font-family:{BODY}">
{paper(2)}
{ab(40, 44, W - 80, 0, kicker('SERVICE DU SOIR, DE 18 HEURES', BRASS, 'center') + f'<div style="font:400 64px/1 {DISP};color:{INK};text-align:center;margin-top:10px">La Carte</div>')}
{ab(40, 140, W - 80, 0, frame('assets/photo-port.png', 580, 270, 'Le Vieux Port, Marseille. The quay where the house began.'))}
{ab(40, 470, W - 80, 0, section('Les Plats') + f'<div style="margin-top:4px">{items(PLATS)}</div>')}
<div style="position:absolute;left:40px;top:856px;width:{W - 80}px;border-top:1px solid {BRASS}"></div>
{ab(40, 872, 278, 0, f'<div style="font:400 38px/1 {DISP};color:{INK}">Desserts</div><div style="margin-top:2px">{items(DESS)}</div>')}
<div style="position:absolute;left:335px;top:876px;height:350px;border-left:1px solid rgba(34,52,60,.22)"></div>
{ab(354, 872, 278, 0, f'<div style="font:400 38px/1 {DISP};color:{INK}">Au bar</div><div style="margin-top:2px">{items(BAR)}</div>')}
<div style="position:absolute;left:0;top:{H - 100}px;width:{W}px;height:100px;background:{INK}"></div>
{ab(40, H - 86, W - 80, 0, f'<div style="font:400 16px/1.45 {BODY};color:#cfd5d2;text-align:center">Prix nets, service non compris. Prices subject to change.<br>Le Vieux Port, First Avenue, New York. Carte d&#39;hiver No. 71. Closed December 25.</div>')}
</div>'''


def page(body, title):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title>'
            f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
            f'<style>body{{margin:0}}*{{box-sizing:content-box}}</style></head><body>{body}</body></html>')


for n, b in (('front', front), ('back', back)):
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(page(b, 'Le Vieux Port ' + n))
print('built')
