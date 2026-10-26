# Final photo check (fast, strict scope)
Sheets: wip/genre/proofs/_sheets/<format>-<n>.jpg (re-rendered with the corrected photos). Full size: wip/genre/proofs/_all/<format>/<slug>.jpg.
Flag ONLY these, on the hero (largest photo) or the second photo:
- safety: nudity or near-nudity, lingerie, sexual poses, gore, corpses, rude gestures, anything wrong on a dinner menu.
- text: the photo has baked-in title text or tagline (poster art with words).
- blank: the photo is mostly black, mostly white, or a cutout on white.
- crop: a face cut through the eyes.
Do NOT flag clean promotional photos without text; they are fine. Do not flag layout or logos.
Output wip/genre/audit/r3/<format>.json: {"Title (Year)": [{"photo": "hero" | "second", "why": "safety|text|blank|crop: short"}]} listing ONLY films with a flag. Open full size before flagging. Report under 50 words with counts.
