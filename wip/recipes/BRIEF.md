# Recipe rebuild: exact quantities, real times, every printed dish (owner, Oct 26)

Goal: every dish on every menu has a structured recipe so the app can (1) let the user tick the dishes they want, (2) scale quantities for 1 to 24 guests, and (3) show real prep and cooking times.

## Input
Your pack file wip/recipes/in/packNN.json lists films with their slug. For each film read data/film/<slug>.json. Its dishes are in `edition.menu` if present, otherwise `recipe`: courses s (snacks), m (mains), w (sweets), d (drinks). Each dish has n (name), note, how (method text with quantities), shop (["100g cheddar@Dairy", ...]).

ERA packs (kind "era") only: the printed menu can show extra dishes that are not in that list. Read the printed faces in the film's print_dir (front.body.html, back.body.html, outside/inside or *.body.html; fall back to front.html and back.html) and find every dish name with a price. Any printed dish that is not already in the film's dish list is an EXTRA. Write a full recipe for each extra too, true to its printed name and description. If print_dir is empty there are no extras.

## Output
Write data/recipes2/<slug>.json for every film in your pack:
{
 "serves": 4,
 "dishes": [
  {
   "n": "exact dish name as printed or as in the data",
   "course": "s" | "m" | "w" | "d",
   "extra": true (only for era extras),
   "prep_min": 15,          // hands-on prep time for 4, realistic for a home cook
   "cook_min": 25,          // cooking, baking, chilling or setting time for 4 (0 if none)
   "make_ahead": "Up to 1 day, keep chilled" | "",
   "ingredients": [
     {"q": 1, "u": "kg", "item": "baby potatoes", "aisle": "Produce"},
     {"q": 3, "u": "", "item": "rashers bacon", "aisle": "Meat"},
     {"q": null, "u": "", "item": "flaky salt, to taste", "aisle": "Pantry"}
   ],
   "steps": [
     {"text": "Boil the potatoes until just tender.", "min": 15},
     {"text": "Smash flat on an oiled tray and roast at 220C until crisp.", "min": 25}
   ]
  }
 ]
}

## Rules
- Quantities live only in "ingredients" (numbers in q, units in u). Step text must not repeat amounts, so scaling stays right. Oven temperatures and pan sizes are fine in steps.
- Units: g, kg, ml, l, tsp, tbsp, cup, or "" for counted items (eggs, onions, rashers, slices). Metric first (Australian kitchen). q is a number for 4 serves, or null for "to taste" items.
- Aisles: Produce, Meat, Seafood, Dairy, Bakery, Pantry, Frozen, Drinks, Spices.
- Keep each dish the same food as its name and existing method (recipe-true). Keep seafood as seafood.
- Times must be genuine: total of step minutes roughly equals prep_min + cook_min. Include resting, chilling and marinating in cook_min, and say so in a step.
- Drinks: if the dish is alcoholic in the data, keep it as is. Family films (themes kids, fairytale) stay alcohol-free.
- Plain wording, no em or en dashes, no brand names (say "cream-filled snack cakes", not a brand).
- Valid JSON. Every film in the pack gets a file. Every dish from the data appears, plus extras for era films.

## Process
Work film by film. You may write a small Python helper in /tmp/claude-0/-home-claude/6d06a22c-2024-50a8-a2d1-a12880d59711/scratchpad/recipes-<pack> to validate, but the recipes are your own work. Validate: JSON loads, every dish has ingredients and steps, units are from the list, no dashes. No web searches needed; never send personal details in any request. Do not edit any other file or touch git. Report in under 80 words: films done, dishes written, era extras added.
