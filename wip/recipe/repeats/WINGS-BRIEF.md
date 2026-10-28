# Wings brief (Oct 29)

20 films have chicken wings, and every vegetarian version is "cauliflower wings". Make them different from each other, each one suited to its own sauce and film.

Repo root: /home/claude/movie-night-spinner. Read wip/recipe/repeats/wings-job.json: per film slug, per dish name, the base (chicken) recipe and the current veg version (and veg_af if there is one).

## What to do
- Give each film its own vegetarian swap that suits the sauce and cooking method in the base recipe. Spread them out. Good swaps: oyster or king oyster mushrooms, firm or extra-firm tofu, haloumi, paneer, tempeh, eggplant, broccoli, jackfruit, battered onion, seitan. Cauliflower may stay on at most 3 films, where it suits the sauce best.
- No swap used on more than 3 films.
- Keep the base dish's sauce, flavours and finish. The name keeps the base name's wording with the swap in it and "(vegetarian)" is not needed if the swap is named, e.g. "Bureau red chilli haloumi bites" or "Asgard golden honey tofu wings". Keep it short.
- A full, working recipe for 4: real amounts, every ingredient used in a step, steps with realistic "min", prep_min and cook_min that fit the steps, a specific make_ahead line naming anything that can be done ahead (marinate, sauce, crumbing).
- veg_af versions: same swap as that film's veg version, alcohol-free.

## House rules
- Plain Australian English, metric, Celsius. Never an em dash or en dash.
- Vegetarian: no meat, fish, gelatine, fish sauce, anchovy, chicken stock, Worcestershire with anchovy (say "vegetarian Worcestershire sauce" if you need it).
- Don't name the old meat in the vegetarian version's ingredient labels or steps (no "chicken-style", no "for the wings" if wings means chicken).
- Units: "" (count), g, kg, ml, l, tsp, tbsp, cup. Aisles: Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop, Spices.

## Output
Write wip/recipe/repeats/wings-out.json:
{ "<slug>": { "<base dish name>": { "veg": {"n": ..., "prep_min": int, "cook_min": int, "make_ahead": ..., "ingredients": [{"q":..,"u":..,"item":..,"aisle":..}], "steps": [{"text":..,"min":int}]}, "veg_af": {...only if the job has one} } } }

Check: python3 wip/recipe/repeats/wings.py check   (fix every problem it prints, run again until clean)
Reply in 3 lines: films done, which swap each got (one line, comma list), anything left.
