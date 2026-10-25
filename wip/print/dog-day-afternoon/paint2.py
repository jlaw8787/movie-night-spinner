"""Line-engraved art for the Pizzeria Canicola menu, two inks (warm brown and tomato red) on salmon stock.
Writes assets/engraved-sun.png (front) and assets/engraved-pie.png (back)."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
BROWN = (52, 30, 20); RED = (178, 48, 30)
K = 3  # supersample


def ink(mask, col, off=(0, 0)):
    im = Image.new('RGBA', mask.size, col + (0,)); im.putalpha(mask)
    out = Image.new('RGBA', mask.size, (0, 0, 0, 0)); out.alpha_composite(im, off); return out


def engrave_disc(d, cx, cy, R, step, tone, rng):
    """Horizontal line engraving: line weight follows tone(x, y) in 0..1."""
    y = cy - R
    while y < cy + R:
        half = math.sqrt(max(0, R * R - (y - cy) ** 2))
        x = cx - half
        while x < cx + half:
            t = tone(x, y)
            w = step * (0.12 + 0.62 * t)
            d.rectangle([x, y - w / 2, x + 4 * K, y + w / 2], fill=255)
            x += 4 * K
        y += step


def sun():
    S = 760 * K // 2; c = S / 2; rng = random.Random(3)
    br = Image.new('L', (S, S), 0); rd = Image.new('L', (S, S), 0)
    db, dr = ImageDraw.Draw(br), ImageDraw.Draw(rd)
    R = S * 0.25
    n = 16
    for i in range(n):
        a = i * 2 * math.pi / n
        # wavy flame ray in red
        pts_l, pts_r = [], []
        L0, L1 = R * 1.12, S * 0.49
        for j in range(30):
            f = j / 29; r = L0 + (L1 - L0) * f
            wob = math.sin(f * 3 * math.pi) * 0.06 * (1 - f)
            wdt = (1 - f) ** 1.2 * (2 * math.pi / n) * 0.30
            pts_l.append((c + r * math.cos(a + wob - wdt), c + r * math.sin(a + wob - wdt)))
            pts_r.append((c + r * math.cos(a + wob + wdt), c + r * math.sin(a + wob + wdt)))
        dr.polygon(pts_l + pts_r[::-1], fill=255)
        # engraved centre line on each flame
        db.line([(c + (L0 + 6) * math.cos(a), c + (L0 + 6) * math.sin(a)), (c + (L0 + (L1 - L0) * 0.55) * math.cos(a), c + (L0 + (L1 - L0) * 0.55) * math.sin(a))], fill=255, width=K)
        # straight fine ray in brown between flames
        b = a + math.pi / n
        db.line([(c + R * 1.15 * math.cos(b), c + R * 1.15 * math.sin(b)), (c + S * 0.40 * math.cos(b), c + S * 0.40 * math.sin(b))], fill=255, width=2 * K)
    # the disc: line engraving, darker to the lower right, ring outline
    tone = lambda x, y: min(1, max(0, 0.15 + 0.85 * ((x - c) + (y - c)) / (2 * R) + 0.35 * (math.hypot(x - c, y - c) / R) ** 3))
    engrave_disc(db, c, c, R - 4 * K, 5 * K, tone, rng)
    db.ellipse([c - R, c - R, c + R, c + R], outline=255, width=3 * K)
    db.ellipse([c - R * 1.06, c - R * 1.06, c + R * 1.06, c + R * 1.06], outline=255, width=K)
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    im.alpha_composite(ink(rd, RED, (2 * K, K)))
    im.alpha_composite(ink(br, BROWN))
    im.resize((S // K * 2 // 2, S // K * 2 // 2), Image.LANCZOS).save(os.path.join(A, 'engraved-sun.png'))


def pie():
    S = 700 * K // 2; c = S / 2; rng = random.Random(9)
    br = Image.new('L', (S, S), 0); rd = Image.new('L', (S, S), 0)
    db, dr = ImageDraw.Draw(br), ImageDraw.Draw(rd)
    R = S * 0.46; Ri = R * 0.86
    # crust: radial hatching, heavier toward the lower right
    for i in range(260):
        a = i * 2 * math.pi / 260
        sh = 0.5 + 0.5 * math.cos(a - math.pi / 4)
        w = max(1, int(K * (0.6 + 1.6 * sh)))
        r0 = Ri + (R - Ri) * (0.15 if sh > 0.4 else 0.45)
        db.line([(c + r0 * math.cos(a), c + r0 * math.sin(a)), (c + R * math.cos(a), c + R * math.sin(a))], fill=255, width=w)
    db.ellipse([c - R, c - R, c + R, c + R], outline=255, width=3 * K)
    db.ellipse([c - Ri, c - Ri, c + Ri, c + Ri], outline=255, width=2 * K)
    # sauce and cheese: red stipple thinning to the middle, brown bubble rings
    for _ in range(5200):
        r = Ri * math.sqrt(rng.random()); a = rng.random() * 2 * math.pi
        if rng.random() < 0.25 + 0.6 * (r / Ri) ** 2:
            x, y = c + r * math.cos(a), c + r * math.sin(a); s = K * rng.uniform(0.8, 1.6)
            dr.ellipse([x - s, y - s, x + s, y + s], fill=255)
    for _ in range(26):
        r = Ri * 0.85 * math.sqrt(rng.random()); a = rng.random() * 2 * math.pi
        x, y = c + r * math.cos(a), c + r * math.sin(a); s = K * rng.uniform(5, 10)
        db.arc([x - s, y - s, x + s, y + s], 200, 340, fill=255, width=K)
    # pepperoni: red discs with brown cross-hatch and rim, placed off the cut lines
    cuts = [i * math.pi / 4 + 0.2 for i in range(8)]
    spots = []
    for ring, cnt, off in ((0.62, 8, 0.39), (0.27, 4, 0.0)):
        for i in range(cnt):
            a = i * 2 * math.pi / cnt + off + 0.2 + math.pi / 8
            spots.append((c + Ri * ring * math.cos(a), c + Ri * ring * math.sin(a)))
    pr = Ri * 0.15
    for (x, y) in spots:
        dr.ellipse([x - pr, y - pr, x + pr, y + pr], fill=255)
        hatch = Image.new('L', (S, S), 0); hd = ImageDraw.Draw(hatch)
        for k in range(-int(pr), int(pr), 4 * K):
            hd.line([(x + k - pr, y - pr), (x + k + pr, y + pr)], fill=255, width=K)
        m = Image.new('L', (S, S), 0); ImageDraw.Draw(m).ellipse([x - pr + 2 * K + pr * 0.3, y - pr + 2 * K + pr * 0.3, x + pr - 2 * K, y + pr - 2 * K], fill=255)
        br.paste(ImageChops.lighter(br, ImageChops.multiply(hatch, m)))
        db = ImageDraw.Draw(br)
        db.ellipse([x - pr, y - pr, x + pr, y + pr], outline=255, width=2 * K)
    # slice cuts knocked out of both inks
    cut = Image.new('L', (S, S), 0); cd = ImageDraw.Draw(cut)
    for a in cuts[:4]:
        cd.line([(c + Ri * math.cos(a), c + Ri * math.sin(a)), (c - Ri * math.cos(a), c - Ri * math.sin(a))], fill=255, width=3 * K)
    br = ImageChops.subtract(br, cut); rd = ImageChops.subtract(rd, cut)
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    im.alpha_composite(ink(rd, RED, (2 * K, K)))
    im.alpha_composite(ink(br, BROWN))
    im.resize((S // K * 2 // 2, S // K * 2 // 2), Image.LANCZOS).save(os.path.join(A, 'engraved-pie.png'))


if __name__ == '__main__':
    sun(); pie(); print('ok')
