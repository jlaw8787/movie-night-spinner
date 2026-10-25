"""The Seventh Avenue Coffee Shop, New York, Christmas 2003. Elf (2003).
Diner placemat, one landscape face 1344x960. Snow white stock inside a candy cane border,
an elf green header band with Buddy's white fur trim, the "World's Best Cup of Coffee" sign as the headline.
Signature: the four main food groups wheel (painted in paint.py). Still: Buddy waving on the avenue (TMDB).
Props: a "world's best cup" clipping, a Christmas spirit gauge, a letter from the North Pole.
Writes front.body.html and front.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 960
GREEN, DKGREEN, RED, SNOW, INK, SOFT, MINT = '#186038', '#0f3a22', '#c41e2c', '#fbf9f2', '#163024', '#3d4f43', '#cfe6d4'
FONTS = ('https://fonts.googleapis.com/css2?family=Grandstander:wght@700;900'
         '&family=Nunito:ital,wght@0,600;0,700;0,800;1,600&family=Schoolbell&display=swap')
DISP = "'Grandstander', cursive"; BODY = "'Nunito', sans-serif"; HAND = "'Schoolbell', cursive"


def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'


def ribbon(text):
    return (f'<div style="display: inline-block; background: {RED}; color: {SNOW}; font-family: {DISP}; font-weight: 900; '
            f'font-size: 32px; line-height: 40px; padding: 0 16px; border-radius: 8px; border: 3px solid {DKGREEN}; '
            f'letter-spacing: 0.01em; margin-bottom: 8px">{text}</div>')


def item(name, price, desc, gap=10):
    return (f'<div style="margin-bottom: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<span style="font-family: {DISP}; font-weight: 900; font-size: 26px; line-height: 32px; color: {GREEN}">{name}</span>'
            f'<span style="font-family: {BODY}; font-weight: 800; font-size: 26px; line-height: 32px; color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-weight: 600; font-size: 20px; line-height: 25px; color: {SOFT}; margin-top: 1px">{desc}</div></div>')


LEFT = [('All day long', [
            ('North Pole Spaghetti', '6.95', 'Tossed in butter and maple syrup, chocolate sauce, marshmallows, candy.'),
            ('Short Stack', '3.50', 'Three buttermilk pancakes, whipped butter, a whole jug of warm syrup.'),
            ('Two Griddled Franks', '4.25', 'Steamed buns, yellow mustard, onions in red sauce, warm sauerkraut.')]),
        ('The sweet stuff', [
            ('Maple Popcorn Clusters', '2.25', 'Crunchy corn set in maple butter toffee, broken into big chunks.'),
            ('Candy Cane Forest', '1.75', 'Salted pretzel rods in white chocolate, rolled in crushed peppermint.')])]
RIGHT = [('The bake case', [
            ('Snowball Cupcakes', '1.25', 'Vanilla cake, thick cream cheese frosting, rolled in shredded coconut.'),
            ('Paper Snowflakes', '.95', 'Thin sugar cookies, cut out and iced white, crisp at the edges.')]),
         ('Coffee and cocoa', [
            ("The World's Best Cup", '3.75', 'Coffee in maple cocoa milk, whipped cream, marshmallows, candy cane.'),
            ('Bottomless Coffee', '.90', 'Fresh pot on the hour, all night long.'),
            ("Kids' Hot Cocoa", '1.50', 'Whipped cream and a mini candy cane to stir.')])]


def column(groups):
    o = []
    for i, (title, items) in enumerate(groups):
        o.append(f'<div style="margin-top: {0 if i == 0 else 6}px">{ribbon(title.upper())}</div>')
        o += [item(*it) for it in items]
    return ''.join(o)


def face():
    o = []
    # candy cane border and the snow stock
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; '
             f'background: repeating-linear-gradient(45deg, {RED} 0 16px, {SNOW} 16px 32px)"></div>')
    o.append(f'<div style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: {H - 40}px; background: {SNOW}; '
             f'border-radius: 4px"></div>')
    o.append(f'<img src="assets/paper-grain.png" alt="" style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: {H - 40}px; opacity: 0.35">')
    o.append(f'<div style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: {H - 40}px; '
             f'background: radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0) 62%, rgba(150,120,70,0.10) 100%)"></div>')
    # header band, Buddy's coat with its fur trim
    o.append(f'<div style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: 150px; background: {GREEN}; '
             f'border-radius: 4px 4px 0 0"></div>')
    o.append(f'<img src="assets/fur-trim.png" alt="" style="position: absolute; left: 22px; top: 140px; width: 1300px; height: 44px">')
    o.append(at(52, 40, 1030,
        f'<div style="font-family: {BODY}; font-weight: 800; font-size: 18px; letter-spacing: 0.24em; color: {MINT}; line-height: 22px">'
        f'THE SEVENTH AVENUE COFFEE SHOP, NEW YORK CITY</div>'
        f'<div style="font-family: {DISP}; font-weight: 900; font-size: 66px; line-height: 74px; color: {SNOW}; letter-spacing: 0.005em; '
        f'text-shadow: 4px 4px 0 {RED}; margin-top: 4px">WORLD\'S BEST CUP OF COFFEE</div>'))
    o.append(f'<img src="assets/spirit-gauge.png" alt="Christmas spirit gauge" style="position: absolute; left: 1124px; top: 30px; width: 168px; height: 98px">')
    o.append(at(1104, 128, 208, f'<div style="font-family: {BODY}; font-weight: 800; font-size: 15px; letter-spacing: 0.18em; color: {SNOW}; '
                                 f'text-align: center; line-height: 18px">CHRISTMAS SPIRIT</div>'))
    # left column, and the clipping at its foot
    o.append(at(52, 214, 360, column(LEFT)))
    o.append(at(56, 806, 352,
        f'<div style="background: #ecE7d8; padding: 7px 12px 8px; transform: rotate(-1.2deg); box-shadow: 2px 3px 6px rgba(40,30,10,0.18); '
        f'border-top: 2px dotted #b9b19c; border-bottom: 2px dotted #b9b19c">'
        f'<div style="font-family: {BODY}; font-weight: 800; font-size: 17px; line-height: 21px; color: #222; letter-spacing: 0.02em">'
        f'CUP NAMED &ldquo;WORLD\'S BEST&rdquo;</div>'
        f'<div style="font-family: {BODY}; font-weight: 600; font-size: 15px; line-height: 19px; color: #333">'
        f'A tall man in green shook every hand here Tuesday: &ldquo;Great job, everybody!&rdquo;</div></div>'))
    # centre: the signature wheel, then the avenue still
    o.append(f'<img src="assets/food-groups-wheel.png" alt="The four main food groups: candy, candy canes, candy corn and syrup" '
             f'style="position: absolute; left: 441px; top: 202px; width: 462px; height: 462px">')
    o.append(f'<div style="position: absolute; left: 437px; top: 672px; width: 458px; height: 190px; border: 3px solid {RED}; '
             f'background: {SNOW}; padding: 3px"><img src="assets/still-seventh-ave.jpg" alt="A regular waving on the avenue" '
             f'style="display: block; width: 458px; height: 190px"></div>')
    o.append(at(437, 874, 470, f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 20px; '
                               f'color: {SOFT}; text-align: center">Our block in December. A regular, saying hi to every cab.</div>'))
    # right column, and the letter from the North Pole
    o.append(at(932, 214, 360, column(RIGHT)))
    o.append(at(944, 758, 346,
        f'<div style="transform: rotate(1.6deg); padding: 6px; box-shadow: 2px 3px 7px rgba(40,30,10,0.2); '
        f'background: repeating-linear-gradient(135deg, {RED} 0 12px, {SNOW} 12px 22px, {GREEN} 22px 34px, {SNOW} 34px 44px)">'
        f'<div style="background: #fffdf7; padding: 8px 14px 8px; position: relative">'
        f'<div style="font-family: {HAND}; font-size: 18px; line-height: 21px; color: #1c3a8c; padding-right: 30px">Dear Coffee Shop, you did it! It really is the best '
        f'cup in the whole world. Congratulations! I put syrup in mine.</div>'
        f'<div style="display: flex; align-items: baseline; gap: 10px; margin-top: 2px">'
        f'<span style="font-family: {HAND}; font-size: 30px; line-height: 32px; color: #1c3a8c">Love, Buddy</span>'
        f'<span style="font-family: {BODY}; font-weight: 700; font-size: 14px; color: {SOFT}">the elf, North Pole</span></div>'
        f'<div style="position: absolute; right: -14px; top: -16px; width: 62px; height: 62px; border: 2px solid rgba(196,30,44,0.7); '
        f'border-radius: 50%; transform: rotate(-12deg); text-align: center; font-family: {BODY}; font-weight: 800; font-size: 14px; '
        f'line-height: 15px; color: rgba(196,30,44,0.8); padding-top: 9px; box-sizing: border-box">NORTH<br>POLE<br>DEC 24</div>'
        f'</div></div>'))
    # fine print
    o.append(at(52, 899, 1240, f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 20px; color: {DKGREEN}; '
                               f'text-align: center">Prices subject to change. Syrup on every table, put it on everything. '
                               f'Please do not hug the raccoons in the park. Greenway Press staff, 10% off. Form NP-2003.</div>'))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {RED}">' + ''.join(o) + '</div>')


b = face()
open(os.path.join(D, 'front.body.html'), 'w').write(b)
open(os.path.join(D, 'front.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Seventh Avenue placemat</title>'
    f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
