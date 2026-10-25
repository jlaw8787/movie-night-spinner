# Per-film flavour pass (owner approved "full per-film lift", Oct 26)

Each genre has one shared printed-menu template. This pass gives every film its own identity inside it. You write a small JSON block per film; the template prints it.

## Output
Write /home/claude/polish/wip/genre/flavour/out/<pack>.json: one object keyed by the exact "Title (Year)" given, each value:

{
 "venue": "The in-world place this film's menu comes from, 2 to 5 words. A place in the film (a diner, bar, school canteen, ship galley, town) or a fictional business from the film. Never a real business or brand.",
 "sign": "A short sign or masthead line for that venue, max 40 characters.",
 "note": {"text": "A short note in a character's voice, max 160 characters, paraphrased (no quotes longer than 6 words, no song lyrics).", "by": "Character name as credited"},
 "winks": ["3 to 5 short lines, max 70 characters each, each pointing at a detail a fan recognises instantly (an object, place, scene, running joke)."],
 "prop": {"kind": "ticket | card | slip | tag | stub | badge | receipt", "title": "max 24 characters", "lines": ["1 or 2 lines, max 40 characters each"]},
 "number": "One number that means something in the film (a year, room, flight, badge, address number), as digits only, or \"\" if none is certain."
}

## Rules (hard)
- Only details that are definitely in the film. If unsure about a detail, leave it out. Accuracy beats quantity; 3 sure winks beat 5 shaky ones.
- Match the film's emotion: funny films playful, thrillers tense, dramas with weight, romance warm, horror eerie (no gore).
- No real brands, products, restaurants or companies, unless it is the film's own fictional brand.
- Family and kids films (themes kids, fairytale, and anything rated G or PG for children): no alcohol, no adult jokes, nothing scary beyond the film itself.
- No song lyrics or song titles. No long quotes.
- Never use em or en dashes (use commas, full stops or "to"). Plain wording, no "iconic", "elevate", "indulge", "nod to", "homage", "perfect for".
- American wording on menu lines (the menus are from the film's world).
- Valid JSON. Every film in your pack must appear.

## Process
Write from your own knowledge of each film. Use at most 5 web searches in total, only to confirm a detail you plan to use and are unsure of. Then run `python3 -c "import json;json.load(open('<file>'))"` to validate, check every film key is present, and grep your file for em or en dashes. Report in under 80 words: count written, any films you left thin and why.
