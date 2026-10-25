"""Paints the finish for the Heritage Club bill of fare: heavy cream card stock that has been
handled in a members' dining room. Soft, low-detail mottling, edge wear, and one faint port
glass ring on the back. US Legal portrait, 816 x 1344 CSS px, painted at 2x."""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2
W, H = 816, 1344
GW, GH = W * S, H * S


def noise(h, w, octaves, base, seed):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * w / h) + 1)).astype(np.float32)
        out += amp * np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot


def wear(seed, name):
    # big gentle mottling, only three octaves so nothing reads as pixel noise
    mott = noise(GH, GW, 3, 3, seed)
    a = np.clip(0.5 + mott * 1.1, 0, 1) * 20
    # handled edges: warm darkening in the last 18 px, uneven along its length
    yy, xx = np.mgrid[0:GH, 0:GW] / S
    d = np.minimum.reduce([xx, yy, W - xx, H - yy])
    rough = np.clip(noise(GH, GW, 3, 5, seed + 7) + 0.6, 0.2, 1.2)
    edge = np.clip(1 - d / 26, 0, 1) ** 2 * rough
    # thumb wear where the card is held, lower right corner
    thumb = np.exp(-(((xx - W + 40) / 120) ** 2 + ((yy - H + 70) / 150) ** 2)) * 0.5
    a = a + edge * 80 + thumb * 26
    a = ndimage.gaussian_filter(a, 2 * S)
    rgb = np.zeros((GH, GW, 3)); rgb[:] = (128, 102, 64)
    Image.fromarray(np.dstack([rgb, a]).clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(A, name))


def port_ring():
    # one small port glass set down on the card and lifted, faint and soft
    w = h = 200 * S
    yy, xx = np.mgrid[0:h, 0:w] / S
    cx, cy, R = 100, 100, 34
    ang = np.arctan2(yy - cy, xx - cx)
    wob = 1.2 * np.sin(ang * 3 + 0.4) + 0.6 * np.sin(ang * 5 + 1.1)
    r = np.hypot(xx - cx, yy - cy) - (R + wob)
    rim = np.exp(-(r / 1.6) ** 2) * (0.45 + 0.55 * np.clip(np.sin(ang * 1.2 + 2.4) + 0.5, 0, 1))
    inner = np.where(r < 0, np.exp(r / 14) * 0.08, 0)
    a = (rim + inner) * (0.8 + 0.2 * noise(h, w, 2, 4, 9))
    a = ndimage.gaussian_filter(a, 0.9 * S)
    rgb = np.zeros((h, w, 3)); rgb[:] = (112, 40, 46)
    Image.fromarray(np.dstack([rgb, np.clip(a * 120, 0, 255)]).astype(np.uint8), 'RGBA').save(os.path.join(A, 'stain-port.png'))


wear(11, 'wear-front.png')
wear(23, 'wear-back.png')
port_ring()
print('painted')
