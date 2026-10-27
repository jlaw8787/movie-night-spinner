# Job: a vegetarian version of every snack, sweet and drink that has meat or fish

Repo: /home/claude/movie-night-spinner. Do NOT edit any repo file, do NOT run git or builds. Read your job file, write ONE output file.

Your job file (wip/diet/jobs/vegsNN.json) is a list of {slug, film, theme, note, boozy, dish}. `dish` is a snack (course "s"), sweet ("w") or drink ("d") from a film's dinner planner, for 4 people. `note` is the menu's one-line description, when there is one. `boozy` is true when the dish uses alcohol.

For every job, write a vegetarian version of that same dish, the way a good chef-owner would put a vegetarian option on the same menu:
- Keep the dish's idea, shape, cooking method, sauce and film feel. Swap only the meat or fish. Examples: an antipasto or charcuterie board keeps the cheeses, olives and pickles and swaps the cured meats for marinated artichokes, grilled eggplant, roast capsicum, stuffed peppers or smoked tofu slices; prawn cocktail to haloumi or hearts of palm cocktail; pigs in blankets to vegetarian sausages in pastry; chicken wings to cauliflower wings; bacon-wrapped anything to smoky eggplant or mushroom wrapped; tuna or salmon to marinated tofu, watermelon "tuna" or beetroot cured slices; oysters to mushrooms; sausage rolls to lentil and mushroom rolls; meat dumplings or spring rolls to mushroom and cabbage or tofu fillings; caviar to pearl couscous or black lentils dressed in soy; bacon in a sweet to smoked maple pecans; gelatine to agar; clam or beef broth in a drink to tomato juice with mushroom or kombu stock; worcestershire to soy.
- Eggs and dairy are fine (vegetarian, not vegan). Hard cheeses made with animal rennet (parmesan, pecorino, grana padano, gruyere) become "vegetarian parmesan-style cheese" (or pecorino-style, gruyere-style).
- Name: the original name with " (vegetarian)" on the end, unless a better short name keeps the film reference (e.g. "Connie's wedding antipasto with marinated artichokes"). Keep it clearly the same dish.
- If `boozy` is true, keep the alcohol in your `veg` version, and ALSO write a `veg_af` version: the same vegetarian dish with the alcohol swapped out (a drink becomes a proper mocktail of the same drink; food uses stock, verjuice, juice or vinegar plus water). Name the veg_af drink with "(vegetarian, alcohol-free)" or "(alcohol-free)" added as reads best. If `boozy` is false, write only `veg`.

Output schema: {"<slug>": {"<original dish n>": {"veg": DISH, "veg_af": DISH (only when boozy)}}}
DISH = {"n": str, "prep_min": int>0, "cook_min": int>=0, "make_ahead": str ("" if none),
 "ingredients": [{"q": number or null, "u": ""|"g"|"kg"|"ml"|"l"|"tsp"|"tbsp"|"cup", "item": str, "aisle": one of Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop}],
 "steps": [{"text": str, "min": int}]}
- NO meat, poultry, fish, seafood, animal stock, gelatine, lard, anchovy, fish sauce, oyster sauce, shrimp paste, bonito or worcestershire in any ingredient. Nothing in the Meat or Seafood aisle (plant-based items go in Produce, Pantry, Frozen, Deli or Dairy). In `veg_af`, nothing in Bottle shop and no alcohol.
- 2 to 7 steps, each a plain instruction a home cook can follow. Every ingredient is used in a step, and the steps never mention the old meat or fish. Step min values add up to prep_min + cook_min (within 10 percent). Quantities for 4, real amounts, about the same size serve as the original.

Rules: plain Australian English (capsicum, coriander, eggplant, zucchini), no em or en dashes (commas or "to"), no AI phrasing, no puns in steps, no real brands (say "plant-based mince", "vegetarian sausages", "smoked tofu").

Write wip/diet/out/vegsNN.json (same NN as your job file) with json.dump(..., ensure_ascii=False, indent=1). Then check:
python3 -c "import json,re;N='NN';d=json.load(open(f'wip/diet/out/vegs{N}.json'));j=json.load(open(f'wip/diet/jobs/vegs{N}.json'));need={(x['slug'],x['dish']['n']) for x in j};have={(s,n) for s,v in d.items() for n in v};print('missing',need-have,'extra',have-need);print('meat aisle',[(s,n,i['item']) for s,v in d.items() for n,x in v.items() for k in x for i in x[k]['ingredients'] if i['aisle'] in ('Meat','Seafood')]);print('af missing',[(x['slug'],x['dish']['n']) for x in j if x['boozy'] and 'veg_af' not in d.get(x['slug'],{}).get(x['dish']['n'],{})])"
Both sets empty, the meat aisle list [] and af missing []. Then also run: python3 wip/diet/merge.py --check  and fix any problem it lists for your file's dishes. Report back in 3 lines: count written, anything unsure.
