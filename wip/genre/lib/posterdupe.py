#!/usr/bin/env python3
"""Find library stills that are crops of the film's own poster artwork.

For each library film, take the stills the build would pick (same rule as
scripts/build-data.cjs), match each one against the poster with OpenCV ORB
keypoints, and confirm with a RANSAC homography. A still that maps onto the
poster is poster art, not a scene, so it goes in data/still-block.json.
Blocking moves the next still up, so it loops until every film's picked
stills are clean.

Usage (repo root):
  python3 wip/genre/lib/posterdupe.py              # dry run, report only
  python3 wip/genre/lib/posterdupe.py --write      # add matches to still-block.json
  python3 wip/genre/lib/posterdupe.py --film "Jaws (1975)" --verbose
"""
import argparse, concurrent.futures as cf, json, os, re, sys, time, urllib.request
import cv2, numpy as np

UA = "MovieNightSpinner/1.0 (personal project)"
IMG = "https://image.tmdb.org/t/p/"
CACHE = os.environ.get("PD_CACHE", "wip/genre/_imgcache")
MIN_INLIERS = 22      # RANSAC inliers needed to call it a poster crop
MIN_RATIO = 0.30      # inliers / good matches

def load_posters():
    s = open("tmdb-posters.js", encoding="utf8").read()
    return json.loads(re.search(r"TMDB_POSTERS=(\{.*?\});", s, re.S).group(1))

def picked(st, block):
    allv = [x for x in st if x[1] >= 1280 and x[0] not in block]
    clean = [x for x in allv if not x[3]]
    return [x[0] for x in (clean if len(clean) >= 2 else allv)][:8]

def fetch(size, path):
    fn = os.path.join(CACHE, size + path.replace("/", "_"))
    if not os.path.exists(fn) or os.path.getsize(fn) < 500:
        for a in range(3):
            try:
                req = urllib.request.Request(IMG + size + path, headers={"User-Agent": UA})
                data = urllib.request.urlopen(req, timeout=30).read()
                open(fn, "wb").write(data); break
            except Exception:
                time.sleep(1 + a)
    return fn

_orb = None
def feats(fn, cache={}):
    if fn in cache: return cache[fn]
    global _orb
    if _orb is None: _orb = cv2.ORB_create(nfeatures=3000, scaleFactor=1.2, nlevels=10, fastThreshold=12)
    im = cv2.imread(fn, cv2.IMREAD_GRAYSCALE)
    if im is None: cache[fn] = (None, None); return cache[fn]
    im = cv2.equalizeHist(im)
    cache[fn] = _orb.detectAndCompute(im, None)
    return cache[fn]

def match(poster_fn, still_fn):
    kp1, d1 = feats(poster_fn); kp2, d2 = feats(still_fn)
    if d1 is None or d2 is None or len(kp1) < 10 or len(kp2) < 10: return 0, 0
    bf = cv2.BFMatcher(cv2.NORM_HAMMING)
    good = [m for m, n in (p for p in bf.knnMatch(d2, d1, k=2) if len(p) == 2) if m.distance < 0.75 * n.distance]
    if len(good) < 8: return 0, len(good)
    src = np.float32([kp2[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst = np.float32([kp1[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
    H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 6.0)
    if H is None: return 0, len(good)
    inl = int(mask.sum())
    # the warped still must land on the poster with a sane shape (not a flipped or collapsed fit)
    h, w = cv2.imread(still_fn, cv2.IMREAD_GRAYSCALE).shape
    c = cv2.perspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]).reshape(-1, 1, 2), H).reshape(-1, 2)
    if cv2.contourArea(c) < 50 or not cv2.isContourConvex(c.astype(np.float32)): return 0, len(good)
    return inl, len(good)

def is_crop(inl, good):
    return inl >= MIN_INLIERS and inl >= MIN_RATIO * good

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--film", action="append")
    ap.add_argument("--verbose", action="store_true")
    a = ap.parse_args()
    os.makedirs(CACHE, exist_ok=True)
    st = json.load(open("data/film-stills.json")); fm = json.load(open("data/film-format.json"))
    block = json.load(open("data/still-block.json")); posters = load_posters()
    films = a.film or [k for k in fm if k in st and k in posters]
    found = {}; checked = set(); rnd = 0
    while True:
        rnd += 1
        todo = []
        for f in films:
            b = block.get(f, []) + found.get(f, [])
            for p in picked(st[f], b):
                if (f, p) not in checked: todo.append((f, p))
        if not todo: break
        print(f"round {rnd}: {len(todo)} stills to check", file=sys.stderr)
        with cf.ThreadPoolExecutor(12) as ex:
            list(ex.map(lambda fp: fetch("w780", fp[1]), todo))
            list(ex.map(lambda f: fetch("w500", posters[f]), {f for f, _ in todo}))
        for f, p in todo:
            checked.add((f, p))
            inl, good = match(fetch("w500", posters[f]), fetch("w780", p))
            hit = is_crop(inl, good)
            if a.verbose or hit: print(f"{'CROP' if hit else 'ok  '} {inl:4d}/{good:<4d} {f}  {p}")
            if hit: found.setdefault(f, []).append(p)
    print(f"\n{sum(map(len, found.values()))} poster crops in {len(found)} films", file=sys.stderr)
    json.dump(found, open(os.path.join(CACHE, "_found.json"), "w"), indent=1)
    if a.write and found:
        for f, ps in found.items(): block.setdefault(f, []).extend(p for p in ps if p not in block.get(f, []))
        with open("data/still-block.json", "w") as o: json.dump(block, o, indent=1, ensure_ascii=False)
        print("still-block.json updated", file=sys.stderr)

if __name__ == "__main__":
    main()
