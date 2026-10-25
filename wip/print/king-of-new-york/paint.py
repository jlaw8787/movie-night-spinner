"""Prints the two photos as two-ink offset halftones (navy plus steel blue) on the program's pearl stock,
and paints the soft edge wear. Real images only: a 1973 public domain photo of the South Bronx looking
south to Manhattan (NARA, Documerica) and a TMDB still of the benefit party."""
import os, math, random
from PIL import Image, ImageOps, ImageDraw, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
PAPER = (226, 228, 223)
NAVY = (20, 32, 48)
STEEL = (43, 125, 160)


def plate(gray, cell, angle, curve, scale=3):
    """AM halftone plate: returns L mask (255 = ink) for a coverage curve on a grayscale image."""
    w, h = gray.size
    big = gray.resize((w * scale, h * scale), Image.LANCZOS)
    rot = big.rotate(angle, expand=True, fillcolor=255)
    rw, rh = rot.size
    small = rot.resize((max(1, rw // (cell * scale)), max(1, rh // (cell * scale))), Image.BOX)
    px = small.load()
    out = Image.new('L', (rw, rh), 0)
    dr = ImageDraw.Draw(out)
    c = cell * scale
    for j in range(small.size[1]):
        for i in range(small.size[0]):
            cov = curve(1 - px[i, j] / 255.0)
            if cov <= 0.01:
                continue
            r = c * 0.5 * math.sqrt(cov) * 1.414 * 0.98
            cx, cy = i * c + c / 2, j * c + c / 2
            dr.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    out = out.rotate(-angle, fillcolor=0)
    l, t = (rw - w * scale) // 2, (rh - h * scale) // 2
    out = out.crop((l, t, l + w * scale, t + h * scale))
    return out.resize((w, h), Image.LANCZOS)


def duotone(src, box, size, lift=0.75, contrast=1.15, cell=4, shift=(1, 0), nt=0.12, sd=0.55):
    im = Image.open(src).convert('RGB').crop(box).resize(size, Image.LANCZOS)
    g = ImageOps.grayscale(im)
    g = ImageOps.autocontrast(g, cutoff=1)
    g = g.point(lambda v: int(255 * ((v / 255) ** lift)))
    g = ImageEnhance.Contrast(g).enhance(contrast)
    navy = plate(g, cell, 45, lambda d: max(0.0, min(1.0, (d - nt) / (1 - nt))) ** 1.25)
    steel = plate(g, cell, 15, lambda d: max(0.0, min(1.0, 0.85 * math.sin(math.pi * min(1, d * 1.1)) + 0.15 * d)))
    steel = ImageChops_offset(steel, *shift)
    base = Image.new('RGB', size, PAPER)
    for mask, ink, dens in ((steel, STEEL, sd), (navy, NAVY, 0.95)):
        # multiply ink over what is already printed
        ink_rgb = [Image.eval(ch, (lambda kk: (lambda v: int(v * (kk / 255) ** dens)))(k)) for ch, k in zip(base.split(), ink)]
        base = Image.composite(Image.merge('RGB', ink_rgb), base, mask)
    return base


def ImageChops_offset(im, dx, dy):
    from PIL import ImageChops
    return ImageChops.offset(im, dx, dy)


def wear(w, h, seed):
    random.seed(seed)
    m = Image.new('L', (w // 4, h // 4), 0)
    px = m.load()
    mw, mh = m.size
    for y in range(mh):
        for x in range(mw):
            e = min(x, y, mw - 1 - x, mh - 1 - y) / (min(mw, mh) * 0.5)
            px[x, y] = int(255 * max(0.0, 1 - e * 2.6) ** 1.6)
    noise = Image.effect_noise((mw // 6 + 1, mh // 6 + 1), 60).resize((mw, mh), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
    from PIL import ImageChops
    m = ImageChops.multiply(m, ImageOps.autocontrast(noise, cutoff=2).point(lambda v: 110 + v * 0.57))
    m = m.filter(ImageFilter.GaussianBlur(5)).resize((w, h), Image.BICUBIC)
    col = Image.new('RGBA', (w, h), (120, 112, 96, 0))
    col.putalpha(m.point(lambda v: int(v * 0.22)))
    return col


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    # Hero: 592 x 404 css px, printed at 3x
    duotone(os.path.join(D, 'src/bronx-to-manhattan-1973.jpg'), (330, 44, 1730, 999), (1776, 1212),
            lift=0.42, contrast=1.18, cell=5, nt=0.3, sd=0.45).save(os.path.join(A, 'hero-bronx-skyline.png'))
    # Still: benefit party, 300 x 200 css px at 3x
    duotone(os.path.join(D, 'src/still-benefit.jpg'), (520, 60, 2470, 1360), (900, 600),
            lift=0.6, contrast=1.12, cell=4).save(os.path.join(A, 'still-benefit-party.png'))
    wear(672, 1056, 7).save(os.path.join(A, 'wear-front.png'))
    wear(672, 1056, 19).save(os.path.join(A, 'wear-back.png'))
    print('ok')
