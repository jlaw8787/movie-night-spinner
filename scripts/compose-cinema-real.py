#!/usr/bin/env python3
"""Palace hero: rebuild assets/hero/palace*.webp from the original Commons photo.

  python3 scripts/compose-cinema-real.py ORIGINAL.jpg [WORKDIR]

ORIGINAL.jpg is "Orpheum Theatre marquee on election night 2024 IMG 2517" by SecretName101
(Wikimedia Commons, CC BY 4.0). The full 4032x3024 file or the 3840px Commons thumbnail both
work; it is scaled to 3840 wide first. Keep it out of the repo.

What it does:
 1. Fits the letter board's geometry from the real slat lines and panel joins: a homography plus a
    small smooth correction for lens bow, so in the flattened board every slat is a straight
    level line and every panel join is upright.
 2. Clears VOTE TODAY by swapping the lettered panels for clean whole panels from the same board,
    resampled join to join in the flattened board, so the slats line up exactly and each join is
    a real join. Each swapped panel is matched to the light of the panel it replaces.
 3. The top bulb rail's right end is blown out in the photo. The rail there is cloned from further
    along the same rail, lined up to the bulb spacing, with the light spill kept over the top.
 4. Crops to the hero framing (1774x887, same as before), lays the REEL DINNER sign back on from
    scripts/brand/palace-sign.webp (cut from the earlier hero), adds light grain, writes the three
    webp sizes and prints BOARD_Q, BOARD_ROWS and BOARD_W for placeMarquee() in app.js.
"""
import sys, os, json
import numpy as np, cv2
from PIL import Image
from scipy.optimize import least_squares, brentq
from scipy.signal import find_peaks
from scipy.ndimage import gaussian_filter1d

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1]
WORK = sys.argv[2] if len(sys.argv) > 2 else '/tmp/palace-work'
os.makedirs(WORK, exist_ok=True)

# hero framing: the 3840 wide photo scaled by S, then shifted (found by matching features against the old hero)
FW, FH = 1774, 887
S = FW / 3840
OX, OY = -0.113, -101.764
ROW = 100.0  # flattened board units between slat lines


# ---------------------------------------------------------------- geometry
def ap(H, P):
    P = np.asarray(P, float)
    q = np.c_[P, np.ones(len(P))] @ H.T
    return q[:, :2] / q[:, 2:]


def basis(u, v, du, dv):
    u = np.asarray(u) / 2000.0
    v = np.asarray(v) / 1000.0
    return np.stack([u ** i * v ** j for i in range(du + 1) for j in range(dv + 1)], -1)


class Geo:
    """photo px -> flattened board (u, v): homography, then a small smooth correction."""
    DU, DV = (2, 2), (6, 1)

    def __init__(s, H, cu=None, cv=None):
        s.H = H
        s.cu = np.zeros(9) if cu is None else np.asarray(cu)
        s.cv = np.zeros(14) if cv is None else np.asarray(cv)

    def fwd(s, P):
        q = ap(s.H, P)
        u, v = q[:, 0], q[:, 1]
        return np.c_[u + basis(u, v, *s.DU) @ s.cu, v + basis(u, v, *s.DV) @ s.cv]

    def inv(s, U, V):
        u, v = np.array(U, float), np.array(V, float)
        for _ in range(6):
            u = U - basis(u, v, *s.DU) @ s.cu
            v = V - basis(u, v, *s.DV) @ s.cv
        return ap(np.linalg.inv(s.H), np.c_[u, v])

    def maps(s, u0, v0, w, h, sc=1.0, step=8):
        """remap tables that flatten the board: output px (i, j) is board (u0 + i/sc, v0 + j/sc)."""
        gw, gh = w // step + 2, h // step + 2
        jj, ii = np.mgrid[0:gh, 0:gw].astype(float)
        p = s.inv((u0 + ii * step / sc).ravel(), (v0 + jj * step / sc).ravel())
        mx = p[:, 0].reshape(gh, gw).astype(np.float32)
        my = p[:, 1].reshape(gh, gw).astype(np.float32)
        jj, ii = np.mgrid[0:h, 0:w].astype(np.float32) / step
        return (cv2.remap(mx, ii, jj, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE),
                cv2.remap(my, ii, jj, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE))

    def back_maps(s, x0, y0, x1, y1, u0, v0, sc, step=4):
        """remap tables from a photo box back into a flattened raster."""
        jg, ig = np.mgrid[y0:y1 + step:step, x0:x1 + step:step]
        q = s.fwd(np.c_[ig.ravel(), jg.ravel()].astype(float))
        mu = ((q[:, 0] - u0) * sc).reshape(jg.shape).astype(np.float32)
        mv = ((q[:, 1] - v0) * sc).reshape(jg.shape).astype(np.float32)
        yy, xx = np.mgrid[0:y1 - y0, 0:x1 - x0].astype(np.float32) / step
        return (cv2.remap(mu, xx, yy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE),
                cv2.remap(mv, xx, yy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE))


def fit_geo(hl, hj, vl, H, poly=True):
    """least squares: slat line j sits at v = j*ROW, each join at its own fixed u."""
    K = len(vl)
    Ui = [np.median(ap(H, l)[:, 0]) for l in vl]
    nu, nv = (9, 14) if poly else (0, 0)
    x0 = np.r_[(H / H[2, 2]).ravel()[:8], Ui[1:-1], np.zeros(nu + nv)]

    def unpack(x):
        g = Geo(np.r_[x[:8], 1].reshape(3, 3))
        if poly:
            g.cu, g.cv = x[8 + K - 2:8 + K - 2 + nu], x[8 + K - 2 + nu:]
        return g, np.r_[Ui[0], x[8:8 + K - 2], Ui[-1]]

    def res(x):
        g, U = unpack(x)
        r = [g.fwd(l)[:, 1] - j * ROW for l, j in zip(hl, hj)]
        r += [g.fwd(l)[:, 0] - u for l, u in zip(vl, U)]
        if poly:
            r.append(x[8 + K - 2:] * 5)  # keeps the correction small
        return np.concatenate(r)

    sol = least_squares(res, x0, loss='soft_l1', f_scale=1.0, max_nfev=4000)
    g, U = unpack(sol.x)
    r = res(sol.x)[:len(res(sol.x)) - (nu + nv)]
    return g, U, r


def subpx(pr, p):
    a, b, c = pr[p - 1], pr[p], pr[p + 1]
    d = a - 2 * b + c
    return p + (0.5 * (a - c) / d if d else 0)


def dark_lines(R):
    return cv2.morphologyEx(R, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_RECT, (21, 21)))


def detect(R, hs=50, vs=40):
    """peaks of thin dark lines: per vertical strip for slats, per band for joins."""
    bh = dark_lines(R)
    h, w = bh.shape
    hp, vp = [], []
    for u in range(0, w - hs, hs):
        pr = bh[:, u:u + hs].mean(1)
        pk, _ = find_peaks(pr, distance=40, prominence=5)
        hp += [(u + hs / 2, subpx(pr, p)) for p in pk if 0 < p < h - 1]
    for v in range(0, h - vs, vs):
        pr = bh[v:v + vs].mean(0)
        pk, _ = find_peaks(pr, distance=80, prominence=6)
        vp += [(subpx(pr, p), v + vs / 2) for p in pk if 0 < p < w - 1]
    return np.array(hp), np.array(vp)


def robust_line(pts, a, b, tol=2.5):
    for _ in range(3):
        A = np.polyfit(pts[:, a], pts[:, b], 1)
        e = np.abs(np.polyval(A, pts[:, a]) - pts[:, b])
        pts = pts[e < max(tol, 3 * np.median(e))]
    return pts


def track(pts, a, b, tol):
    """link peaks strip to strip into lines (first pass, board still at an angle)."""
    strips = sorted(set(pts[:, a]))
    by = {s: pts[pts[:, a] == s] for s in strips}
    out = []
    for s0 in strips[:3]:
        for p in by[s0]:
            cur = [p]
            for s in strips:
                if s <= cur[0][a]:
                    continue
                if len(cur) >= 2:
                    q, r = cur[-2], cur[-1]
                    pred = r[b] + (r[b] - q[b]) / (r[a] - q[a]) * (s - r[a])
                else:
                    pred = cur[-1][b]
                c = by[s]
                d = np.abs(c[:, b] - pred)
                if len(c) and d.min() < tol:
                    cur.append(c[d.argmin()])
            if len(cur) > 12:
                out.append(np.array(cur))
    out.sort(key=lambda l: -len(l))
    fin = []
    for l in out:
        if all(np.median(np.abs(np.interp(l[:, a], f[:, a], f[:, b]) - l[:, b])) > 10 for f in fin):
            fin.append(l)
    return sorted(fin, key=lambda l: np.median(l[:, b]))


def fit_board(gray):
    # pass 1: rough quad (hand picked on the hero frame), track lines, plain homography
    fr = lambda p: np.float32([((x - OX) / S, (y - OY) / S) for x, y in p])
    quad = fr([(10, 158), (1530, 420), (1535, 660), (8, 515)])
    RW, RH = 3300, 780
    H0 = cv2.getPerspectiveTransform(quad, np.float32([[0, 0], [RW, 0], [RW, RH], [0, RH]]))
    R = cv2.warpPerspective(gray, H0, (RW, RH))
    hp, vp = detect(R, 60, 40)
    Hi = np.linalg.inv(H0)
    hl = [l for l in track(hp, 0, 1, 7) if len(l) >= 40]
    vl = track(vp, 1, 0, 9)
    meds = [np.median(l[:, 1]) for l in hl]
    sel = [(ap(Hi, l), int(round((m - meds[0]) / 96)) + 1) for l, m in zip(hl, meds)
           if abs((m - meds[0]) / 96 - round((m - meds[0]) / 96)) < .12]
    g, U, r = fit_geo([a for a, _ in sel], [b for _, b in sel], [ap(Hi, l) for l in vl], H0, poly=False)
    # pass 2 and 3: flatten with the fit so far, find the lines again cleanly, refit with the bow correction
    for it in range(2):
        mx, my = g.maps(-60, -60, 3500, 1000)
        R = cv2.remap(gray, mx, my, cv2.INTER_CUBIC)
        hp, vp = detect(R)
        hl, hj, vl = [], [], []
        for j in range(1, 9):
            pts = hp[np.abs(hp[:, 1] - (j * ROW + 60)) < 10]
            if len(pts) > 20:
                pts = robust_line(pts, 0, 1, 1.5 if it else 2.5)
                hl.append(g.inv(pts[:, 0] - 60, pts[:, 1] - 60))
                hj.append(j)
        cols = np.sort(vp[:, 0])
        groups = np.split(cols, np.nonzero(np.diff(cols) > 15)[0] + 1)
        for c in [np.median(x) for x in groups if len(x) >= 8]:
            pts = vp[np.abs(vp[:, 0] - c) < 12]
            if len(pts) >= 12:
                pts = robust_line(pts, 1, 0, 1.5 if it else 2.5)
                vl.append(g.inv(pts[:, 0] - 60, pts[:, 1] - 60))
        vl.sort(key=lambda l: np.median(g.fwd(l)[:, 0]))
        vl = [l for l in vl if np.median(g.fwd(l)[:, 0]) < 3200]  # the far right edge is fuzzy, leave it out
        g, U, r = fit_geo(hl, hj, vl, g.H)
        print('fit pass %d: rows %s, joins %d, rms %.2f px' % (it + 2, hj, len(vl), np.sqrt((r ** 2).mean())))
    return g, U


# ---------------------------------------------------------------- board edges and true shape
def board_edges(g, gray):
    mx, my = g.maps(-100, -100, 3600, 1100)
    R = cv2.remap(gray, mx, my, cv2.INTER_LINEAR)
    # top and bottom of the lit board: steepest brightness step, measured over the left panels
    pr = gaussian_filter1d(R[:, 300:1100].mean(1), 1.5)
    d = np.diff(pr)
    vT = -100 + 160 + np.argmax(d[160:190]) + .5      # dark rail shadow -> lit board, near v 75
    vB = -100 + 915 + np.argmin(d[915:945]) + .5      # lit board -> bottom track, near v 830
    # right end of the lit board: the side bulb rail starts with a step up
    pc = gaussian_filter1d(R[250:850].mean(0), 2)
    uR = -100 + 3350 + np.argmax(np.diff(pc)[3350:3460]) + .5
    return vT, vB, uR


def plane_aspect(g):
    """physical width of one u unit over one v unit, from the camera (joins meet slats square)."""
    G = np.linalg.inv(g.H)

    def cols(f):
        Ki = np.linalg.inv(np.array([[f, 0, 1920], [0, f, 1440], [0, 0, 1.0]]))
        return Ki @ G[:, 0], Ki @ G[:, 1]

    f = brentq(lambda f: (lambda a, b: a @ b / np.linalg.norm(a) / np.linalg.norm(b))(*cols(f)), 2000, 20000)
    a, b = cols(f)
    return float(np.linalg.norm(a) / np.linalg.norm(b)), f


# ---------------------------------------------------------------- clear the lettering
def clear_board(img, g, U):
    sc, u0, v0 = 1.5, -80, 0
    X = lambda u: (u - u0) * sc
    Y = lambda v: (v - v0) * sc
    mx, my = g.maps(u0, v0, int(3500 * sc), int(900 * sc), sc)
    R = cv2.remap(img, mx, my, cv2.INTER_CUBIC)
    gr = R.mean(2)
    yt, yb = int(Y(72)), int(Y(826))
    # the letters: dark marks (much darker than any unlit corner of a panel) over the middle of the board
    lm = cv2.morphologyEx((gr < 60).astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    lm[:int(Y(230))] = 0
    lm[int(Y(580)):] = 0
    panels = list(zip(U[:-1], U[1:]))
    frac = [lm[:, int(X(a)) + 6:int(X(b)) - 6].sum() / ((X(b) - X(a)) * Y(350)) for a, b in panels]
    targets = [p for p, fr_ in zip(panels, frac) if fr_ > .05]
    lmd = cv2.dilate(lm, np.ones((25, 25), np.uint8)).astype(np.float32)
    lmd[:, :int(X(targets[0][0])) - 12] = 0
    lmd[:, int(X(targets[-1][1])) + 12:] = 0
    donors = [p for p, fr_ in zip(panels, frac) if p[0] > 100 and fr_ == 0 and (p[1] < targets[0][0] - 1 or targets[-1][1] + 150 < p[0] < 2600)]
    print('letters on %d panels (u %.0f to %.0f), %d clean panels to draw from' % (len(targets), targets[0][0], targets[-1][1], len(donors)))

    def panel(a, b, w):
        xs = np.linspace(X(a), X(b), w).astype(np.float32)
        ys = np.arange(yt, yb).astype(np.float32)
        px, py = np.meshgrid(xs, ys)
        return cv2.remap(R, px, py, cv2.INTER_CUBIC), cv2.remap(lmd, px, py, cv2.INTER_LINEAR)

    def light(P, M):
        w = (M < .01).astype(np.float32)
        num = gaussian_filter1d((P.mean(2) * w).sum(1), 60)
        return num / np.maximum(gaussian_filter1d(w.sum(1), 60), 1e-3)

    out = R.copy()
    used = set()
    for a, b in targets:
        w = int(round(X(b) - X(a))) + 1
        T, TM = panel(a, b, w)
        best = None
        for d in donors:
            if d in used:
                continue
            D, DM = panel(*d, w)
            Dg = D * np.clip(light(T, TM) / np.maximum(light(D, DM), 1), .45, 1.6)[:, None, None]
            vis = (TM < .01)[..., None]
            err = (np.abs(Dg - T) * vis).sum() / max(vis.sum(), 1)
            if best is None or err < best[0]:
                best = (err, d, Dg)
        used.add(best[1])
        Dg = best[2]
        print('  panel u %.0f-%.0f from u %.0f-%.0f' % (a, b, *best[1]))
        vf = np.ones((yb - yt, 1), np.float32)
        vf[:6, 0] = np.linspace(0, 1, 6)
        vf[-6:, 0] = np.linspace(1, 0, 6)
        for x in range(int(np.floor(X(a))) - 4, int(np.ceil(X(b))) + 5):
            al = np.clip(.5 + min(x - X(a), X(b) - x) / 6, 0, 1)   # blend across the join line itself
            if al <= 0:
                continue
            t = np.clip((x - X(a)) / (X(b) - X(a)) * (w - 1), 0, w - 1)
            i0 = int(t)
            i1 = min(i0 + 1, w - 1)
            col = Dg[:, i0] * (1 - (t - i0)) + Dg[:, i1] * (t - i0)
            A = al * vf
            out[yt:yb, x] = out[yt:yb, x] * (1 - A) + col * A
    chg = np.zeros(gr.shape, np.float32)
    chg[yt:yb, int(X(targets[0][0])) - 6:int(X(targets[-1][1])) + 7] = 1
    cv2.imwrite(WORK + '/board-flat-before.jpg', R)
    cv2.imwrite(WORK + '/board-flat-after.jpg', out)
    return paste_back(img, g, out, chg, u0, v0, sc)


def paste_back(img, g, flat, chg, u0, v0, sc):
    ys, xs = np.nonzero(chg > 0)
    corners = g.inv(np.r_[xs.min(), xs.max(), xs.max(), xs.min()] / sc + u0,
                    np.r_[ys.min(), ys.min(), ys.max(), ys.max()] / sc + v0)
    x0, y0 = np.floor(corners.min(0)).astype(int) - 8
    x1, y1 = np.ceil(corners.max(0)).astype(int) + 8
    MU, MV = g.back_maps(x0, y0, x1, y1, u0, v0, sc)
    back = cv2.remap(flat, MU, MV, cv2.INTER_CUBIC)
    m = cv2.remap(chg, MU, MV, cv2.INTER_LINEAR)[..., None]
    img = img.copy()
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - m) + back * m
    return img


# ---------------------------------------------------------------- top rail, right end
def fix_rail(img, g):
    sc, u0, v0 = 1.0, -80, -160
    mx, my = g.maps(u0, v0, 3500, 260, sc)
    R = cv2.remap(img, mx, my, cv2.INTER_CUBIC)
    gr = R.mean(2)
    band = gr[110:210]                      # the rail, v -50 to 50
    hp = band - cv2.GaussianBlur(band, (0, 0), 8)
    prof = hp[:, 300:2700].mean(0)
    per = 30 + int(np.argmax([np.dot(prof[:-p], prof[p:]) for p in range(30, 140)]))
    best = None
    for p in np.arange(per - 2, per + 2, .05):
        xs = (np.arange(300, 1200) + p * 20).astype(np.float32)
        b = cv2.remap(hp, np.tile(xs, (100, 1)), np.repeat(np.arange(100.0)[:, None], 900, 1).astype(np.float32), cv2.INTER_LINEAR)
        c = (hp[:, 300:1200] * b).sum()
        if best is None or c > best[0]:
            best = (c, p)
    per = best[1]
    # where the glare starts: the rail goes flat white
    lvl = gaussian_filter1d(gr[130:190].mean(0), 10)
    ref = np.median(lvl[2000 - u0:2600 - u0])
    g0 = int(np.argmax(lvl[2600 - u0:] > ref + 0.6 * (250 - ref))) + 2600 - u0
    g1 = 3392 - u0                           # end cap of the rail starts here
    shift = round((g0 - (2000 - u0)) / per) * per   # clone from bulbs a whole number of spacings to the left
    print('rail: bulb spacing %.2f, glare from u %.0f, cloned from %.0f units left' % (per, g0 + u0, shift))
    xs = (np.arange(R.shape[1]) - shift).astype(np.float32)
    C = cv2.remap(R, np.tile(xs, (R.shape[0], 1)), np.repeat(np.arange(R.shape[0], dtype=np.float32)[:, None], R.shape[1], 1), cv2.INTER_CUBIC)
    # keep a share of the spill so the corner still reads as hot
    glow = np.maximum(cv2.GaussianBlur(R, (0, 0), 18) - cv2.GaussianBlur(C, (0, 0), 18), 0) * .4
    new = C + glow
    m = np.zeros(gr.shape, np.float32)
    a0 = g0 - 50
    m[96:226, a0:g1] = 1
    m[96:226, a0:a0 + 60] *= np.linspace(0, 1, 60)[None]
    m[96:226, g1 - 14:g1] *= np.linspace(1, 0, 14)[None]
    m = cv2.GaussianBlur(m, (0, 0), 3)
    flat = R * (1 - m[..., None]) + new * m[..., None]
    cv2.imwrite(WORK + '/rail-flat-before.jpg', R[:, 2000:])
    cv2.imwrite(WORK + '/rail-flat-after.jpg', flat[:, 2000:])
    return paste_back(img, g, flat, m, u0, v0, sc)


# ---------------------------------------------------------------- main
img = cv2.imread(SRC)
if img.shape[1] != 3840:
    img = cv2.resize(img, (3840, round(img.shape[0] * 3840 / img.shape[1])), interpolation=cv2.INTER_AREA)
img = img.astype(np.float32)
gray = img.mean(2)
g, U = fit_board(gray)
vT, vB, uR = board_edges(g, gray)
uL = U[0]
asp, f = plane_aspect(g)
print('board: u %.1f to %.1f, v %.1f to %.1f; joins %s' % (uL, uR, vT, vB, np.round(U).astype(int).tolist()))
print('one u unit is %.3f v units across the board (camera f %.0f px)' % (asp, f))

img = clear_board(img, g, U)
img = fix_rail(img, g)

# hero crop
fr = cv2.resize(np.clip(img, 0, 255).astype(np.uint8), (FW, round(img.shape[0] * S)), interpolation=cv2.INTER_AREA)
fr = cv2.warpAffine(fr, np.float32([[1, 0, OX], [0, 1, OY]]), (FW, FH), flags=cv2.INTER_CUBIC).astype(np.float32)
fr += 4 * np.maximum(0, 1 - fr / 48)            # the old hero's slightly lifted blacks
sign = np.asarray(Image.open(os.path.join(ROOT, 'scripts/brand/palace-sign.webp')).convert('RGBA')).astype(np.float32)
sx, sy = 636, 91
a = sign[..., 3:] / 255
fr[sy:sy + sign.shape[0], sx:sx + sign.shape[1]] = fr[sy:sy + sign.shape[0], sx:sx + sign.shape[1]] * (1 - a) + sign[..., 2::-1] * a
fr += np.random.default_rng(5).normal(0, 1.2, (FH, FW, 1))
fr = np.clip(fr, 0, 255).astype(np.uint8)
cv2.imwrite(WORK + '/palace.png', fr)
pim = Image.fromarray(fr[..., ::-1])
hero = os.path.join(ROOT, 'assets/hero')
pim.save(hero + '/palace.webp', quality=88, method=6)   # sizes in line with the earlier exports
pim.resize((1400, 700), Image.LANCZOS).save(hero + '/palace-1400.webp', quality=86, method=6)
pim.resize((1000, 500), Image.LANCZOS).save(hero + '/palace-1000.webp', quality=86, method=6)

# board quad for the live letters: a plain homography (CSS matrix3d) fitted over rows 2 to 6, where the
# letters hang, so they sit in the rows to within a pixel; the corners carry the small lens bow
gu, gv = np.meshgrid(np.linspace(uL, uR, 40), np.linspace(200, 700, 11))
src = np.c_[gu.ravel(), gv.ravel()]
dst = g.inv(src[:, 0], src[:, 1])
dst = (dst * S + [OX, OY]) / [FW, FH]
Hc, _ = cv2.findHomography(src, dst, 0)
err = np.abs(ap(Hc, src) - dst) * [FW, FH]
q = ap(Hc, [[uL, vT], [uR, vT], [uR, vB], [uL, vB]])
rows = [(j * ROW - vT) / (vB - vT) for j in range(1, 9)]
info = {'BOARD_Q': [[round(x, 5), round(y, 5)] for x, y in q], 'BOARD_ROWS': [round(r, 4) for r in rows],
        'BOARD_W': round((uR - uL) * asp / ROW, 2), 'fit_err_px': [round(float(err.mean()), 2), round(float(err.max()), 2)]}
json.dump(info, open(WORK + '/board.json', 'w'))
print(json.dumps(info))
