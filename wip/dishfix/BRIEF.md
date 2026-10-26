# Vague dishes fix (owner, Oct 26, 17:51): "what is prom dinner? That menu is not helpful at all." Owner chose: check every menu.

On the printed menu each dish shows its NAME and a short NOTE. Both must tell a guest what the food actually is.
- Bad name: "Prom night dinner", "Wayne Manor dinner", "Ewok feast", "Gru's dinner for the girls", "Quantum realm bites", "Two Hands: Sydney Chinatown night". A guest can't tell what's on the plate.
- Good name: "Prom night roast chicken and gravy", "Wayne Manor roast beef and Yorkshire puddings", "Ewok honey roast chicken". Keep the film tie where it fits naturally. Max 42 characters.
- Bad note: "the big prom night", "the parties at Stifler's house". It's about the film, not the food.
- Good note: "Crispy baked wings in hot butter sauce, blue cheese dip", or "Honey-glazed chicken thighs, roast potatoes, the way Alfred serves it". Say the food first; a short film wink after a comma is fine. Max 90 characters.

## Input
Your pack: wip/dishfix/in/packN.json, a list of {film, slug}. For each film, read data/recipes/<slug>.json. Its courses s, m, w and d each hold dishes {n, note, how, shop}. Base every name and note on that dish's real method (`how`) and shopping list (`shop`). Never invent a different dish. The name and note must describe what the recipe actually makes.

## Output
Write wip/dishfix/out/packN.json: {"<slug>": [{"old": "exact current n", "n": "new name or same", "note": "new note or same"}, ...], ...}. Include ONLY dishes you change. Leave out films with nothing to change.

## Rules
- Fix every name that doesn't say what the food is, and every note that is only a film reference. Leave clear ones alone. Most films have at least one note to fix.
- Plain wording, American menu style. No em or en dashes, no brand names, no "iconic", "elevate", "indulge", "nod to", "perfect for". No song lyrics.
- Keep seafood as seafood. Keep drinks alcoholic or not exactly as the recipe is.
- Only details definitely in the film for any film wink. If unsure, leave the wink out.
- Valid JSON. Check it with `python3 -c "import json;json.load(open('<file>'))"` and grep for dashes.
- Do not edit any other file. Do not touch git. No web searches. Never send personal details in any request.
Report in under 60 words: films checked, dishes changed.
