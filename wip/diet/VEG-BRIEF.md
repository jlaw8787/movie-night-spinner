# Job: a vegetarian version of every meat or fish main

Repo: /home/claude/movie-night-spinner. Do NOT edit any repo file, do NOT run git or builds. Read your job file, write ONE output file.

Your job file (wip/diet/jobs/vegNN.json) is a list of {slug, film, theme, note, dish}. `dish` is a main course from a film's dinner planner, for 4 people. `note` is the menu's one-line description, when there is one.

For every job, write a vegetarian version of that same main, the way a good chef-owner would put a vegetarian option on the same menu:
- Keep the dish's idea, shape, cooking method, sauce, sides and film feel. Swap only the meat or fish for a satisfying vegetarian centre: e.g. meatballs to mushroom and ricotta or lentil meatballs; steak to a thick roasted cauliflower or portobello steak; burgers to a smashed mushroom and haloumi or black bean patty; fried chicken to buttermilk fried cauliflower or oyster mushrooms; fish to haloumi, tofu, eggplant or a crisp-battered banana blossom; bacon to smoky mushrooms or smoked paprika chickpeas; ham to smoked tofu; chicken stock and beef stock to vegetable or mushroom stock; fish sauce, oyster sauce, worcestershire and shrimp paste to soy, mushroom oyster sauce or miso; gelatine to agar.
- Eggs and dairy are fine (vegetarian, not vegan).
- Name: the original name with " (vegetarian)" on the end, unless a better short name keeps the film reference (e.g. "Clemenza's Sunday sauce with mushroom meatballs"). Keep it clearly the same dish.
- If the original uses alcohol (wine, beer, mirin, spirits, Bottle shop aisle), keep it in your `veg` version, and ALSO write a `veg_af` version: the same vegetarian dish with the alcohol swapped out (stock, verjuice, juice or vinegar plus water). If there is no alcohol, write only `veg`.

Output schema: {"<slug>": {"<original dish n>": {"veg": DISH, "veg_af": DISH (only when needed)}}}
DISH = {"n": str, "prep_min": int>0, "cook_min": int>=0, "make_ahead": str ("" if none),
 "ingredients": [{"q": number or null, "u": ""|"g"|"kg"|"ml"|"l"|"tsp"|"tbsp"|"cup", "item": str, "aisle": one of Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop}],
 "steps": [{"text": str, "min": int}]}
- NO meat, poultry, fish, seafood, animal stock, gelatine, lard, anchovy, fish sauce, oyster sauce or worcestershire in any ingredient. Nothing in the Meat or Seafood aisle (plant-based items go in Produce, Pantry, Frozen or Dairy). In `veg_af`, nothing in Bottle shop and no alcohol.
- 3 to 7 steps, each a plain instruction a home cook can follow, naming the ingredients it uses; every ingredient used in a step. Step min values add up to prep_min + cook_min (within 10 percent). Quantities for 4, real amounts.

Rules: plain Australian English (capsicum, coriander, eggplant, zucchini), no em or en dashes (commas or "to"), no AI phrasing, no puns in steps, no real brands (say "plant-based mince", "vegetarian sausages", "smoked tofu").

Write wip/diet/out/vegNN.json (same NN as your job file) with json.dump(..., ensure_ascii=False, indent=1). Then check:
python3 -c "import json,re;N='NN';d=json.load(open(f'wip/diet/out/veg{N}.json'));j=json.load(open(f'wip/diet/jobs/veg{N}.json'));need={(x['slug'],x['dish']['n']) for x in j};have={(s,n) for s,v in d.items() for n in v};print('missing',need-have,'extra',have-need);print('meat aisle',[(s,n,i['item']) for s,v in d.items() for n,x in v.items() for k in x for i in x[k]['ingredients'] if i['aisle'] in ('Meat','Seafood')])"
Both sets empty and the meat aisle list []. Report back in 3 lines: count written, anything unsure.
