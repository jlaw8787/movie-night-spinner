# Job: alcohol-free versions of every dish that uses alcohol

Repo: /home/claude/movie-night-spinner. Do NOT edit any repo file, do NOT run git or builds. Read your job file and write ONE output file.

Your job file (wip/diet/jobs/afN.json) is a list of {slug, film, theme, dish}. `dish` is the planner recipe (schema below). Each uses alcohol (an ingredient in the "Bottle shop" aisle).

For every job write an alcohol-free version of that same dish, for 4 people:
- **Drinks** (course "d"): a proper mocktail of the same drink, same look and flavour idea, same glass and garnish. Not just "juice": build it like a bartender would (e.g. old fashioned: smoked black tea, demerara syrup, orange bitters swapped for orange zest and a drop of vanilla; espresso martini: cold brew, vanilla syrup, shaken hard for foam; champagne: chilled sparkling apple or white grape juice). Name it the original name with "(alcohol-free)" added, unless the original name already reads fine without alcohol. Never invent brand names; "non-alcoholic gin" and "alcohol-free sparkling wine" are fine generic items in the Drinks aisle.
- **Food** (any other course): keep the dish and swap only the alcohol (wine to stock, verjuice, grape juice or vinegar plus water; beer to stock or alcohol-free beer; spirits in desserts to vanilla, orange juice, espresso, etc.). Keep the name exactly the same.

Output schema, one entry per job, for the same `n` as the input dish:
{"<slug>": {"<original dish n>": {"n": str, "prep_min": int>0, "cook_min": int>=0, "make_ahead": str,
  "ingredients": [{"q": number or null, "u": ""|"g"|"kg"|"ml"|"l"|"tsp"|"tbsp"|"cup", "item": str, "aisle": one of Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks}],
  "steps": [{"text": str, "min": int}]}}}
- NO ingredient may be in the "Bottle shop" aisle, and none may contain alcohol (no wine, beer, cider, spirits, liqueur, bitters, mirin, sake, Shaoxing, marsala, sherry, vanilla essence made with alcohol is fine to call "vanilla extract").
- 2 to 7 steps. Every ingredient used in a step. Step min values add up to prep_min + cook_min (within 10 percent). Quantities for 4.
- Keep everything else from the original that has no alcohol (same food, same garnish, same film feel).

Rules: plain Australian English, no em or en dashes (use commas or "to"), no AI phrasing, no puns in steps, no real brands, seafood stays seafood.

Write the file wip/diet/out/afN.json (same N as your job file) with json.dump(..., ensure_ascii=False, indent=1). Then check it with:
python3 -c "import json,sys;d=json.load(open('wip/diet/out/afN.json'));j=json.load(open('wip/diet/jobs/afN.json'));need={(x['slug'],x['dish']['n']) for x in j};have={(s,n) for s,v in d.items() for n in v};print('missing',need-have,'extra',have-need);bad=[(s,n,i['item']) for s,v in d.items() for n,x in v.items() for i in x['ingredients'] if i['aisle']=='Bottle shop'];print('bottle shop',bad)"
Both sets must be empty and "bottle shop" must be []. Report back in 3 lines: count written, anything you were unsure of.
