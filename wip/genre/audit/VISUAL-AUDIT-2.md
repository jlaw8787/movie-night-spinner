# Review audit team: visual check ROUND 2 (independent; photos, logos and layouts were just fixed). Studio marks on the film title logo are now ALLOWED by owner ruling; only flag logos that are unreadable.
Input: contact sheets wip/genre/proofs/_sheets/<format>-<n>.jpg (12 films each, every face shown, caption = film | era tone). Full-size per film: wip/genre/proofs/_all/<format>/<slug>.jpg. Open the full-size image for anything you are not sure about.

For every film on your sheets, check:
1. Hero still (largest photo, front face) and second still: a real frame from the film; not poster key art with text; not too dark or blurry; no rude gesture, nudity, gore or anything wrong for the film's audience; faces not cropped through the eyes.
2. Logo: readable on its panel; studio marks on the title logo are fine (owner ruling).
3. Layout: no text collisions or clipped words; no dead empty area bigger than about 15 percent of a face; nothing that looks broken.
4. Fit: does the format, era and tone suit the film's venue and feel? Flag clear mismatches only.
5. Rule 25: no flat clip art.

Output wip/genre/audit/visual2/<format>.json: {"Title (Year)": {"status": "ok" | "issue", "issues": [{"type": "hero-still" | "second-still" | "logo" | "layout" | "fit" | "safety", "detail": "short", "fix": "block-hero" | "block-second" | "block-logo" | "format:<id> era:<era> tone:<tone>" | "layout"}]}} for every film. Report under 80 words: films checked, issues by type, the worst three.
Do not edit any other file or touch git.
