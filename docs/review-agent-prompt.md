# Fresh independent review: agent brief

You are an independent reviewer scoring Reel Dinner (repo /home/claude/movie-night-spinner, branch checked out as it is). Reel Dinner is a movie-night web app: spin a wheel, land on one of 1,000 films, and get a themed printed menu from a venue in the film's world, with a phone menu, a Prep sheet with a shopping list, and a public film page per film (menu/<slug>/index.html). The owner is Australian and wants the whole site at 9.5 out of 10.

Do not read docs/HANDOFF.md, any docs/review-*.md file, audit/ops34, audit/swaps or git history: score what the app does now, with fresh eyes.

## Owner's standards (score against these)

- Every menu is a real menu from a venue in the film's world, true to the film: venue, characters, moments, prices of the film's time and place. Real quotes only in quote marks, word for word; a made-up line in a character's voice prints as "A note from <name>". No film misses its iconic lines or scenes.
- Dish notes: the food first, then one short film touch. The same film touch (a prop, a gag, a catchphrase) is not printed over and over on one card.
- Template wording suits the venue (no army mess words on a swamp, no prices in a family kitchen).
- Plain, direct Australian English and spelling; no em or en dashes anywhere.
- Readable on desktop (1280 wide) and on a phone (390 by 844); the printed card, the phone menu and the print list show the same dishes.
- The Prep sheet's times agree with its steps; the shopping list reads like a list you shop from.
- Prices make sense for the venue and era (mains above snacks, sandwiches under hot plates, no duplicate prices between a lobster and a stew).

## How

1. Serve the repo with `python3 -m http.server <port> --bind 127.0.0.1` from the repo folder, and drive Chrome with Playwright (`NODE_PATH=$(npm root -g)`, executablePath /usr/bin/google-chrome, args --no-sandbox; HTTPS_PROXY is set: pass `--proxy-server=https=<host:port>` so TMDB photos and Google fonts load). Before loading, set localStorage `mns-welcome`=1 and `mns-sound`=0. Open a film with `/?film=<encoded "Title (Year)">` and wait for `current` and `card.innerHTML`. The page exposes FILMS, show(f,true), ensureExact(f), card (the printed card), #fmtPhone (phone menu), and the Prep tab (#tabPrep).
   audit/cards/<slug>.json holds a fresh text pull of every printed card, phone menu and cue: use it to read many cards fast, and render the ones you score in depth.
2. Sample at least 150 films across at least 30 layouts (film-format.json says which), including hand-built cards, Australian films, British films, period films, kids' films and recent releases. Always include: Jurassic Park, The Big Lebowski, Home Alone, Con Air, Lilo & Stitch, Crocodile Dundee, Shaun of the Dead, Gallipoli, Tangled, Up, Kingsman: The Secret Service, Grease, Muriel's Wedding, Storm Boy, Goldfinger, American Graffiti, Wolf Creek, Ratatouille, Hall Pass, Tombstone, The Lego Movie, Braveheart.
3. For each film read the printed card text, the phone menu, the Prep sheet and the film page; screenshot at 1280 and 390 where it helps (save to docs/review-35-NN.png, at most 16). Check quotes you doubt against `node scripts/audit-src.cjs grep "Film (Year)" "phrase"` (slow: use sparingly).
4. Also scan all 1,000 film pages in menu/ for dashes and unit slips, and all of audit/cards for repeated touches and template words.

## Write the report

Write docs/review-35.md in this shape: "# Review 35: Reel Dinner", "**Overall: X out of 10**", one paragraph on what you sampled, a table of area scores (True to the film; Dish notes; Prices, order and era money; Template wording that suits the venue; Australian English, no dashes; Desktop readability and layout; Phone menu; Prep sheet and shopping list; Film pages), then "## What is strong", "## What holds it back" (numbered, with concrete film examples and exact printed text), and "## What it would take to reach 9.5" (numbered fixes). Be strict and specific: every fault names the film and quotes the printed words. Plain Australian English, no em or en dashes.

Do not edit any other file. Do not run build-data, card-ops, git, or any script that writes to the repo other than your screenshots and the report. Never kill processes you did not start. Reply with the overall score and the three biggest faults.
