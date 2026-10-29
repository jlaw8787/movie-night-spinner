# New film pack brief

You write ONE complete film for Movie Night Spinner: a web app that spins a wheel of films and gives each film its own themed dinner menu, recipes, a printed menu and a prep sheet. The owner is a trade-qualified chef and ex-restaurant owner. The bar is high: authentic to the film, fun, cookable, and in the same voice as the 850 films already in the app.

Repo root: /home/claude/movie-night-spinner. Do NOT edit any repo file except your own output pack. No git, no builds.

## Read first
- Example packs (copy their shape exactly, and match their quality and voice; note: in older films the film S/M/W/K pool can hold more or different dishes than recipes, but in YOUR pack film S/M/W/K, dish-names, recipes and recipes2 must be the exact same dishes in the same order): wip/newfilms/examples/*.json. Scream (1996) for horror, Aliens (1986) for a series film, Mamma Mia! (2008) for a musical, Mary Poppins (1964) for a family classic.
- House style: wip/print/STYLE-LOCK.md (skim), wip/genre/FORMAT-LIBRARY.md (the printed menu formats, eras and tones).
- Recipe rules: wip/recipe/BRIEF.md "House rules". Vegetarian swaps: wip/diet/VEG-BRIEF.md. Alcohol-free swaps: wip/diet/AF-BRIEF.md.

## Write
wip/newfilms/packs/<slug>.json where slug is the film id lowercased with every run of non letters/digits turned into "-" (e.g. "Alien 3 (1992)" is alien-3-1992). Keys, exactly as the examples:
- id: "Title (Year)"
- film: {title, year (string), theme (one of the 25 themes used in data/films.json: redsauce pizza deli street cop soul xmas aussie asian scifi hero kids teen diner mex tiki uptown horror western philly galaxy wizard adventure fairytale romcom), hw: 1, S: [[name, film line, how, shop[]], ...] 2 to 3 snacks, M: 1 to 2 mains, W: 1 sweet, K: 1 drink, T: tagline (short, punchy, food joke tied to the film), D: one-sentence plot with no spoilers, P: a showtime cue ("Serve the ... when ..." tied to a real scene, no spoilers past the first act)}
- dish-names: [[S names], [M names], [W names], [K names]] matching film
- dish-notes: [[S film lines], [M], [W], [K]] matching film (the second field of each dish)
- recipes: {s: [{n, note, how, shop}], m: [...], w: [...], d: [...], shopping: [...]}. note is the plain menu description of the dish (what's in it), how is the full method for 4, shop lines "qty item@Aisle".
- recipes2: {serves: 4, dishes: [ {n, course (s/m/w/d), prep_min, cook_min, make_ahead, ingredients: [{q, u, item, aisle}], steps: [{text, min}], veg (bool), af (bool), alt: {veg: DISH, af: DISH, veg_af: DISH} } ] } with the SAME dishes and names as recipes. Step minutes add up to prep_min + cook_min. Waiting steps (chill, soak, marinate, rest) have their real minutes.
  - Every dish with meat, fish, gelatine or animal stock: veg false, plus alt.veg (per VEG-BRIEF). If that dish also has alcohol: alt.veg_af too.
  - Every dish with alcohol (wine, beer, spirits, liqueur, mirin, anything from the Bottle shop aisle): af false, plus alt.af (per AF-BRIEF).
  - Alt dish names end " (vegetarian)", " (alcohol-free)" or " (vegetarian, alcohol-free)" unless a short better name keeps the film reference.
- diet: {notes: {"<dish name>": {"veg": "menu line for the veg swap", "af": ..., "veg_af": ...}}} one line per alt you wrote, same voice and length as the dish's recipes note, describing the swap's real ingredients.
- film-format: {format, era, tone} from FORMAT-LIBRARY.md, chosen from the film's venue. Prefer formats used less often: pub, diningcar, motel, newspaper, airline, saloon, precinct, tiki, prom are under-used.
- film-flavour: {venue, sign, note: {text, by}, winks: [3 to 5], prop: {kind, title, lines: []}, number} exactly like the examples. The note is an invented line in the voice of a named character, never a real quote from the film and never song lyrics. Winks are short references to moments or things in the film.
- film-palette: {dark, accent} hex colours that suit the film's poster.
- series: [] or the id of an existing series in data/series.json it belongs to (e.g. "alien", "rocky", "bond", "jurassic", "conjuring"). If it belongs to a series that doesn't exist yet, put {"new": "Series name"} instead.

## Rules (non-negotiable)
- Food is real, cookable at home, for 4, and genuinely tied to the film (places, scenes, characters, era, setting). Not generic. A chef should want to make it.
- Plain Australian English (capsicum, coriander, eggplant, prawns, biscuits). Metric and Celsius. Never an em dash or en dash anywhere: use commas, full stops or "to".
- No real brands, shops, restaurants or products (say "cola", "chocolate biscuits", "vegetarian sausages"). No song lyrics, ever, not even a line. No real quotes from the film.
- Family and kids films (theme kids or fairytale, or rated G/PG family musicals): the drink and every dish is alcohol-free.
- Units: "" g kg ml l tsp tbsp cup. Aisles: Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop, Spices.
- No AI phrasing, no puns in method steps.

## Check before you reply
Run: python3 wip/newfilms/checkpack.py wip/newfilms/packs/<slug>.json
Fix every ERROR and rerun until clean. Then reply in 3 lines: film, format/era/tone, anything you're unsure of.
