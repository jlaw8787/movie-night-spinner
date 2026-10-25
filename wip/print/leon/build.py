"""Tony's, Mulberry Street, Little Italy, 1994. The restaurant's own tall slim table card,
two faces 528x1344 (5.5 x 14 in), walnut stock, cream and tablecloth red.
Front: the sign, the Mulberry Street photograph (signature), the pasta, Tony's note.
Back: the back-table still, antipasti, dolci, drinks, fine print. Props: Tony's card, milk coupon.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 528, 1344
PAPER, CREAM, RED, SOFT = '#2b1e17', '#f1e6cf', '#d6523c', '#e3d4b6'
FONTS = ('https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@500;700'
         '&family=Spectral:ital,wght@0,400;0,600;1,400&family=Allura&display=swap')
DISP = "'Cormorant SC', serif"; BODY = "'Spectral', serif"; SCRIPT = "'Allura', cursive"
L, CW = 40, 448

def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def section(k, t, mt=26):
    return (f'<div style="margin-top: {mt}px">{kicker(k)}'
            f'<div style="display: flex; align-items: center; gap: 14px; margin-top: 8px">'
            f'<img src="assets/gingham-square.png" alt="" aria-hidden="true" style="display: block; width: 26px; height: 26px">'
            f'<div style="font-family: {DISP}; font-weight: 700; font-size: 46px; line-height: 0.9; color: {CREAM}; letter-spacing: 0.02em">{t}</div></div>'
            f'<div style="height: 2px; background: {RED}; margin-top: 10px"></div></div>')

def item(name, price, desc, note='', gap=14):
    n = f' <span style="font-style: italic; color: {RED}">{note}</span>' if note else ''
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">'
            f'<span style="font-family: {DISP}; font-weight: 700; font-size: 30px; line-height: 1.08; color: {CREAM}">{name}</span>'
            f'<span style="font-family: {BODY}; font-weight: 600; font-size: 27px; line-height: 1; color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.36; color: {SOFT}; margin-top: 3px">{desc}{n}</div></div>')

def page(inner, wear):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{wear}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<img src="assets/gingham-band.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: 24px; display: block">'
            f'<img src="assets/gingham-band.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: {H - 24}px; width: {W}px; height: 24px; display: block">'
            + inner + '</div>')

def card(x, y):
    """Prop: Tony's business card, with a pencilled note on it."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 212px; height: 122px; background: #f6efe0; '
            f'box-shadow: 0 3px 8px rgba(0,0,0,0.45); transform: rotate(5deg)">'
            f'<div style="position: absolute; left: 0; top: 12px; width: 212px; text-align: center; font-family: {DISP}; font-weight: 700; font-size: 34px; line-height: 1; color: #a83524">Tony&rsquo;s</div>'
            f'<div style="position: absolute; left: 0; top: 48px; width: 212px; text-align: center; font-family: {BODY}; font-size: 14px; line-height: 1.3; color: #2b1e17">'
            f'Tony, proprietor<br>Mulberry St., New York<br>(212) 555-0194</div>'
            f'<div style="position: absolute; left: 130px; top: 98px; font-family: {SCRIPT}; font-size: 26px; line-height: 1; color: #2c3a78; transform: rotate(-8deg)">Thurs. T.</div>'
            '</div>')

def coupon(x, y):
    """Prop: a cut-out milk coupon."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 200px; height: 118px; background: #f6efe0; '
            f'box-shadow: 0 3px 8px rgba(0,0,0,0.45); transform: rotate(-4deg); padding: 6px; box-sizing: border-box">'
            f'<div style="border: 2px dashed #a83524; height: 102px; box-sizing: border-box; text-align: center; padding-top: 7px">'
            f'<div style="font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.2em; color: #a83524; line-height: 1">COUPON</div>'
            f'<div style="font-family: {DISP}; font-weight: 700; font-size: 25px; line-height: 0.95; color: #2b1e17; margin-top: 5px">Free Glass<br>of Cold Milk</div>'
            f'<div style="font-family: {BODY}; font-size: 14px; line-height: 1.2; color: #2b1e17; margin-top: 4px">Limit two quarts.</div>'
            '</div></div>')

def photo(src, alt, x, y, w, h):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; outline: 2px solid {RED}; outline-offset: 4px">'
            f'<img src="{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

def caption(t, y):
    return (f'<div style="position: absolute; left: {L}px; top: {y}px; width: {CW}px; font-family: {BODY}; font-style: italic; '
            f'font-size: 18px; line-height: 1.3; color: {SOFT}">{t}</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">{kicker("Mulberry Street, Little Italy")}</div>')
    o.append(f'<div style="position: absolute; left: {L - 1}px; top: 70px; font-family: {DISP}; font-weight: 700; font-size: 116px; line-height: 1; color: {CREAM}; letter-spacing: 0.01em">TONY&rsquo;S</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 186px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 21px; line-height: 1.2; color: {SOFT}">Ristorante. Lunch and dinner, every day.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 224px; width: {CW}px; height: 2px; background: {RED}"></div>')
    o.append(photo('assets/mulberry.jpg', 'Mulberry Street around 1900, crowded with pushcarts, awnings and families', L, 246, CW, 488))
    o.append(card(268, 236))
    o.append(caption('Our block of Mulberry Street, 1900. Still feeding it.', 746))
    col = section('Dalla cucina', 'Pasta')
    col += item('Spaghetti Tony', '8.95', 'San Marzano tomatoes crushed by hand, garlic cooked slow, basil and a knob of butter. Parmigiano on the side.', 'Ask for Tony.')
    col += item('Baked Ziti', '9.25', 'Ricotta, mozzarella and Sunday gravy, baked bubbling in its own dish.')
    col += item('Linguine Vongole', '11.50', 'Littleneck clams, garlic, white wine and parsley.')
    o.append(f'<div style="position: absolute; left: {L}px; top: 762px; width: {CW}px">{col}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1196px; width: {CW}px; height: 1px; background: {RED}; opacity: 0.7"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1208px; width: {CW}px; font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.36; color: {CREAM}">'
             'My regulars sit in the back, drink their milk and say nothing. Quiet people, I trust. Mangia.</div>')
    o.append(f'<div style="position: absolute; left: {L + 330}px; top: 1246px; font-family: {SCRIPT}; font-size: 48px; line-height: 1; color: {CREAM}">Tony</div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
def back():
    o = []
    o.append(photo('assets/milk.jpg', 'A tall glass of milk between two hands on a red checked tablecloth', L, 52, CW, 210))
    o.append(coupon(282, 30))
    o.append(caption('The back table. Cold milk, checked cloth, no questions.', 274))
    col = section('Per cominciare', 'Antipasti')
    col += item('The French Loaf', '6.50', 'Crusty bread spread thick with sweet butter, thin boiled ham and little sour pickles, cut in twelve.')
    col += item('Olive Calde', '4.25', 'Warmed in oil with orange peel, thyme and garlic, with cornichons and pickled onions.')
    col += section('Dal banco', 'Dolci', 20)
    col += item('The Window Pot', '4.50', 'Chocolate mousse and cookie soil in a clay pot, a mint sprig growing out the top.', 'Likes the sun.')
    col += item('Cannoli', '3.25', 'Crisp shells filled to order with sweet ricotta and chocolate chips.')
    col += section('Da bere', 'Bevande', 20)
    col += item('Vanilla Malted', '3.75', 'Milk, ice cream, malt and honey, frosted glass.', gap=12)
    col += item('Cold Milk', '1.25', 'Whole, poured tall. A quart to go, 1.94.', gap=12)
    col += item('Champagne', '6.50', 'By the glass, well chilled.', 'Over eighteen only.', gap=12)
    o.append(f'<div style="position: absolute; left: {L}px; top: 290px; width: {CW}px">{col}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1250px; width: {CW}px; text-align: center; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {SOFT}">'
             'Prices subject to change. Thursday nights, a little Beethoven.<br>Mulberry St., New York, N.Y. 10013. Form 194. 1994.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tony\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
