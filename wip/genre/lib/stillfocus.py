#!/usr/bin/env python3
"""Back-page photo pass for library stills: faces and dark frames.

For every still the build will pick (same rule as scripts/build-data.cjs):
  * finds faces (OpenCV YuNet) and records where they sit, so the app can aim
    a cropped frame at the faces instead of the middle (data/still-focus.json,
    path -> [x, y] as 0..1 of the image)
  * flags frames that are still too dark to read and adds them to
    data/still-block.json (with --write); the next still moves up.

Usage (repo root):
  python3 wip/genre/lib/stillfocus.py            # report only
  python3 wip/genre/lib/stillfocus.py --write
Needs the YuNet model: YUNET=/path/face_detection_yunet_2023mar.onnx
"""
import argparse, json, os, sys
import cv2, numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from posterdupe import picked, fetch, CACHE  # same pick rule, same image cache

YUNET = os.environ.get("YUNET", "/home/claude/models/yunet.onnx")
DARK_MEAN, DARK_P90 = 18, 75   # mean luma and 90th percentile (0..255); moody but readable frames sit well above this

def faces(im, det):
    h, w = im.shape[:2]; s = 640 / max(h, w)
    sm = cv2.resize(im, (int(w * s), int(h * s)))
    det.setInputSize((sm.shape[1], sm.shape[0]))
    _, f = det.detect(sm)
    out = []
    for r in (f if f is not None else []):
        x, y, fw, fh, sc = r[0] / s, r[1] / s, r[2] / s, r[3] / s, r[14]
        if sc >= 0.8 and fw * fh >= 0.004 * w * h: out.append((x, y, fw, fh))
    return out

def focus(fs, w, h):
    if not fs: return None
    a = sum(fw * fh for _, _, fw, fh in fs)
    cx = sum((x + fw / 2) * fw * fh for x, _, fw, fh in fs) / a
    top = min(y for _, y, _, _ in fs); bot = max(y + fh for _, y, _, fh in fs)
    cy = (top + bot) / 2
    return [round(float(min(max(cx / w, 0), 1)), 2), round(float(min(max(cy / h, 0), 1)), 2)]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--write", action="store_true"); ap.add_argument("--film", action="append")
    a = ap.parse_args()
    det = cv2.FaceDetectorYN.create(YUNET, "", (320, 320), 0.8)
    st = json.load(open("data/film-stills.json")); fm = json.load(open("data/film-format.json"))
    block = json.load(open("data/still-block.json"))
    films = a.film or [k for k in fm if k in st]
    foc, dark = {}, {}; seen = set()
    while True:
        todo = [(f, p) for f in films for p in picked(st[f], block.get(f, []) + dark.get(f, [])) if (f, p) not in seen]
        if not todo: break
        print(f"{len(todo)} stills", file=sys.stderr)
        for f, p in todo:
            seen.add((f, p))
            im = cv2.imread(fetch("w780", p))
            if im is None: continue
            g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
            if g.mean() < DARK_MEAN and np.percentile(g, 90) < DARK_P90:
                dark.setdefault(f, []).append(p); print(f"DARK {g.mean():5.1f} {f}  {p}"); continue
            fc = focus(faces(im, det), im.shape[1], im.shape[0])
            if fc: foc[p] = fc
    print(f"{sum(map(len, dark.values()))} dark stills in {len(dark)} films, {len(foc)} stills with faces", file=sys.stderr)
    json.dump(dark, open(os.path.join(CACHE, "_dark.json"), "w"), indent=1)
    if a.write:
        for f, ps in dark.items(): block.setdefault(f, []).extend(p for p in ps if p not in block[f])
        with open("data/still-block.json", "w") as o: json.dump(block, o, indent=1, ensure_ascii=False)
        with open("data/still-focus.json", "w") as o: json.dump(dict(sorted(foc.items())), o, separators=(",", ":")); o.write("\n")
        print("still-block.json and still-focus.json written", file=sys.stderr)

if __name__ == "__main__":
    main()
