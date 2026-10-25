"""Art for the Hackensack Bulls scorecard fold: the cover still, a soft paper wear layer, and the signature
piece, a painted top-down plan of the ballpark (grass stripes, skin infield, grandstand rows, concourse,
outfield fence and scoreboard). Stand marker positions are written to assets/stands.json for build.py."""
import os, math, random, json
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
S = '/tmp/claude-0/-home-claude/6d06a22c-2024-50a8-a2d1-a12880d59711/scratchpad/bm'
A = os.path.join(D, 'assets')
random.seed(1985)


def lift(im):
    im = ImageEnhance.Brightness(im).enhance(1.05)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    return ImageEnhance.Color(im).enhance(1.06)


# cover still: Monty and Spike at home plate
hero = Image.open(os.path.join(S, 'hero.jpg')).convert('RGB')
hero = hero.crop((40, 0, 1280, 720)).resize((1144, 664), Image.LANCZOS)
lift(hero).save(os.path.join(A, 'still-battery.jpg'), quality=90)

# paper wear for a 1344x960 face: edge vignette plus big soft mottling, and a soft fold shadow
W, H = 1344, 960
small = Image.new('L', (28, 20)); small.putdata([random.randint(0, 255) for _ in range(28 * 20)])
mott = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
alpha = Image.new('L', (W, H)); px, mp = alpha.load(), mott.load()
for y in range(H):
    for x in range(W):
        e = max(0.0, 1.0 - min(min(x, W - 1 - x) / 110.0, min(y, H - 1 - y) / 110.0, 1.0))
        f = max(0.0, 1.0 - abs(x - W / 2) / 18.0)
        a = 66 * e ** 1.6 + (mp[x, y] - 128) * 0.10 + 34 * f ** 2
        px[x, y] = max(0, min(255, int(a)))
wear = Image.new('RGBA', (W, H), (120, 84, 30, 0)); wear.putalpha(alpha)
wear.save(os.path.join(A, 'paper-wear.png'))

# ---------- painted ballpark plan, drawn at 2x (1184 x 1200), shown at 576 x 584 ----------
CW, CH = 1184, 1200
HX, HY = 592, 850          # home plate


def pol(a, r):
    t = math.radians(a)
    return (HX + r * math.cos(t), HY - r * math.sin(t))


def fence_r(a):
    return 540 + 100 * max(0.0, math.cos(math.radians(2 * (a - 90))))


def noise_layer(size, scale, amp, blur):
    w, h = size
    sm = Image.new('L', (max(2, w // scale), max(2, h // scale)))
    sm.putdata([128 + random.randint(-amp, amp) for _ in range(sm.size[0] * sm.size[1])])
    return sm.resize(size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))


def fill(base, mask, color, tex_amp=18, tex_scale=6):
    """Paints a flat colour through a mask with soft low-frequency tone variation (gouache feel)."""
    layer = Image.new('RGB', base.size, color)
    n = noise_layer(base.size, tex_scale, tex_amp, 2)
    layer = ImageChops.add(layer, Image.merge('RGB', (n, n, n)), 1, -128)
    base.paste(layer, (0, 0), mask)


canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
rgb = Image.new('RGB', (CW, CH), (216, 205, 174))

# whole park footprint: fence arc plus the grandstand bowl
park = Image.new('L', (CW, CH), 0); dp = ImageDraw.Draw(park)
fence = [pol(a, fence_r(a)) for a in [45 + i * 0.5 for i in range(181)]]
dp.polygon([pol(45, 540)] + fence + [pol(135, 540), pol(160, 290), pol(270, 290), pol(380, 290)], fill=255)
dp.ellipse([HX - 290, HY - 290, HX + 290, HY + 290], fill=255)
park = park.filter(ImageFilter.GaussianBlur(1))

# concourse ring (outermost), grandstand rows, warning track, field
fill(rgb, park, (214, 203, 178), 10, 12)
stand = Image.new('L', (CW, CH), 0); ds = ImageDraw.Draw(stand)
ds.ellipse([HX - 262, HY - 262, HX + 262, HY + 262], fill=255)
ds.ellipse([HX - 170, HY - 170, HX + 170, HY + 170], fill=0)
ds.polygon([(HX, HY)] + [pol(a, 900) for a in range(20, 161, 5)], fill=0)   # nothing in front of the foul lines
stand = stand.filter(ImageFilter.GaussianBlur(1))
fill(rgb, stand, (178, 170, 152), 12, 8)
rows = Image.new('L', (CW, CH), 0); drw = ImageDraw.Draw(rows)
for r in range(178, 262, 8):
    drw.ellipse([HX - r, HY - r, HX + r, HY + r], outline=255, width=2)
for a in range(164, 380, 18):
    drw.line([pol(a, 170), pol(a, 264)], fill=0, width=8)
rgb.paste((136, 128, 112), (0, 0), ImageChops.multiply(rows, stand))

# field of play: fair territory to the fence, plus foul ground inside the stands
field = Image.new('L', (CW, CH), 0); df = ImageDraw.Draw(field)
df.polygon([(HX, HY), pol(45, 540)] + fence + [pol(135, 540)], fill=255)
df.ellipse([HX - 170, HY - 170, HX + 170, HY + 170], fill=255)
df.polygon([(HX, HY), pol(19, 172), pol(19, 262), pol(36, 440), pol(45, 540)], fill=255)
df.polygon([(HX, HY), pol(161, 172), pol(161, 262), pol(144, 440), pol(135, 540)], fill=255)
field = field.filter(ImageFilter.GaussianBlur(1.2))
# concourse repaint outside the stands and field
conc = ImageChops.multiply(park, ImageChops.invert(ImageChops.lighter(stand, field)))
fill(rgb, conc, (214, 203, 178), 8, 12)
fill(rgb, field, (92, 140, 70), 22, 5)

# mowing stripes across the outfield
stripes = Image.new('L', (CW, CH), 0); dst = ImageDraw.Draw(stripes)
for i in range(-30, 40):
    if i % 2 == 0:
        x0 = HX + i * 46
        dst.polygon([(x0, 0), (x0 + 46, 0), (x0 + 46 - CH * 0.6, CH), (x0 - CH * 0.6, CH)], fill=120)
stripes = ImageChops.multiply(stripes, field).filter(ImageFilter.GaussianBlur(2))
rgb.paste((126, 172, 92), (0, 0), stripes)

# warning track along the fence
track = Image.new('L', (CW, CH), 0); dt = ImageDraw.Draw(track)
dt.line(fence, fill=255, width=34, joint='curve')
track = ImageChops.multiply(track, field)
fill(rgb, track, (176, 122, 80), 14, 4)

# infield skin, grass square, mound, plate circle, base cutouts, base paths
B = 196
b1, b2, b3 = (HX + B / math.sqrt(2), HY - B / math.sqrt(2)), (HX, HY - B * math.sqrt(2)), (HX - B / math.sqrt(2), HY - B / math.sqrt(2))
skin = Image.new('L', (CW, CH), 0); dk = ImageDraw.Draw(skin)
dk.pieslice([HX - 336, HY - 336, HX + 336, HY + 336], -135, -45, fill=255)
dk.ellipse([HX - 44, HY - 44, HX + 44, HY + 44], fill=255)
for b in (b1, b3):
    dk.ellipse([b[0] - 30, b[1] - 30, b[0] + 30, b[1] + 30], fill=255)
inner = Image.new('L', (CW, CH), 0); di = ImageDraw.Draw(inner)
g = 26
di.polygon([(HX, HY - 56), (b1[0] - g, b1[1] + 0), (b2[0], b2[1] + g * 1.4), (b3[0] + g, b3[1])], fill=255)
skin = ImageChops.subtract(skin, inner).filter(ImageFilter.GaussianBlur(1.5))
fill(rgb, skin, (184, 124, 78), 16, 4)
mx, my = HX, HY - 138
mound = Image.new('L', (CW, CH), 0); ImageDraw.Draw(mound).ellipse([mx - 30, my - 30, mx + 30, my + 30], fill=255)
fill(rgb, mound.filter(ImageFilter.GaussianBlur(2)), (190, 130, 84), 10, 4)
dr = ImageDraw.Draw(rgb)
dr.rectangle([mx - 9, my - 2, mx + 9, my + 2], fill=(248, 244, 232))
for b in (b1, b2, b3):
    dr.polygon([(b[0], b[1] - 9), (b[0] + 9, b[1]), (b[0], b[1] + 9), (b[0] - 9, b[1])], fill=(250, 247, 238), outline=(120, 90, 60))
dr.polygon([(HX - 8, HY - 8), (HX + 8, HY - 8), (HX + 8, HY), (HX, HY + 8), (HX - 8, HY)], fill=(250, 247, 238), outline=(120, 90, 60))
# foul lines and batter's boxes
dr.line([(HX, HY), pol(45, 540)], fill=(246, 242, 228), width=4)
dr.line([(HX, HY), pol(135, 540)], fill=(246, 242, 228), width=4)
for sx in (-1, 1):
    dr.rectangle([HX + sx * 11 - (14 if sx < 0 else 0), HY - 18, HX + sx * 11 + (14 if sx > 0 else 0), HY + 14], outline=(246, 242, 228), width=2)

# outfield fence: dark green wall with a cap line, scoreboard in centre field
dr.line(fence, fill=(24, 66, 44), width=12, joint='curve')
dr.line([(x, y - 7) for x, y in fence], fill=(236, 226, 190), width=2, joint='curve')
sbx, sby = HX, HY - fence_r(90) - 58
dr.rectangle([sbx - 130, sby - 34, sbx + 130, sby + 34], fill=(18, 63, 43), outline=(236, 226, 190), width=3)
for i in range(9):
    x = sbx - 112 + i * 22
    dr.rectangle([x, sby + 2, x + 16, sby + 22], fill=(12, 44, 30), outline=(200, 170, 70), width=1)
dr.rectangle([sbx - 6, sby + 34, sbx + 6, sby + 64], fill=(40, 40, 36))
# dugouts along the lines
for a in (28, 152):
    p = pol(a, 186)
    dr.rounded_rectangle([p[0] - 34, p[1] - 12, p[0] + 34, p[1] + 12], 6, fill=(36, 58, 44), outline=(236, 226, 190), width=2)
# light towers outside the fence
for a in (60, 120, 30, 150):
    p = pol(a, fence_r(a) + 46)
    dr.ellipse([p[0] - 11, p[1] - 11, p[0] + 11, p[1] + 11], fill=(90, 90, 84), outline=(236, 226, 190), width=2)
# bleacher block behind left field (the beer garden) and a gate building in right field
bg = pol(140, 632)
dr.rounded_rectangle([bg[0] - 70, bg[1] - 46, bg[0] + 70, bg[1] + 46], 10, fill=(200, 188, 160), outline=(110, 98, 80), width=3)
for k in range(5):
    dr.ellipse([bg[0] - 54 + k * 26, bg[1] - 10, bg[0] - 36 + k * 26, bg[1] + 8], fill=(178, 48, 40), outline=(110, 40, 30))
gt = pol(40, 632)
dr.rounded_rectangle([gt[0] - 66, gt[1] - 40, gt[0] + 66, gt[1] + 40], 8, fill=(178, 48, 40), outline=(110, 40, 30), width=3)
dr.rectangle([gt[0] - 20, gt[1] + 8, gt[0] + 20, gt[1] + 40], fill=(90, 30, 24))

# soft ink edge around the whole park and a gentle overall light from top left
edge = park.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: min(255, v * 4))
rgb.paste((70, 60, 44), (0, 0), edge)
light = Image.linear_gradient('L').rotate(-35, expand=False).resize((CW, CH)).point(lambda v: int(v * 0.16))
rgb = ImageChops.subtract(rgb, Image.merge('RGB', (light, light, light)))

mask = ImageChops.lighter(park, ImageChops.lighter(track, Image.new('L', (CW, CH), 0)))
for extra in (bg, gt):
    ImageDraw.Draw(mask).rounded_rectangle([extra[0] - 74, extra[1] - 50, extra[0] + 74, extra[1] + 50], 10, fill=255)
sb = ImageDraw.Draw(mask); sb.rectangle([sbx - 134, sby - 38, sbx + 134, sby + 66], fill=255)
for a in (60, 120, 30, 150):
    p = pol(a, fence_r(a) + 46); sb.ellipse([p[0] - 13, p[1] - 13, p[0] + 13, p[1] + 13], fill=255)
canvas = rgb.convert('RGBA'); canvas.putalpha(mask)
shadow = Image.new('RGBA', (CW, CH), (60, 40, 10, 0)); shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.35)))
out = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); out.alpha_composite(shadow, (6, 8)); out.alpha_composite(canvas)
out.save(os.path.join(A, 'ballpark-plan.png'))

# stand markers in display px (plan shown at 576 x 584)
sx, sy = 576 / CW, 584 / CH
marks = {'1': pol(270, 216), '2': pol(-22, 216), '3': pol(202, 216), '4': (bg[0], bg[1] - 60), 'gate': (gt[0], gt[1] - 58),
         'board': (sbx, sby)}
json.dump({k: [round(v[0] * sx), round(v[1] * sy)] for k, v in marks.items()}, open(os.path.join(A, 'stands.json'), 'w'))
print('painted')
