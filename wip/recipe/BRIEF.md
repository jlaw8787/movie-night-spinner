# Recipe polish brief (Oct 29)

You fix the recipe data for the films in ONE job file. You never edit data files. You write a patch file, then check it.

Repo root: /home/claude/movie-night-spinner. Run every command from there.

## Your files
- Read: wip/recipe/jobs/jobNN.json. Per film slug: the film, then each dish that has findings, then per version (base, veg, af, veg_af) the findings, make_ahead, times, numbered ingredients ("index: q u | item | aisle") and numbered steps ("index: (min) text").
- Write: wip/recipe/out/jobNN.json (patch format below).
- Check: python3 wip/recipe/tools.py check wip/recipe/out/jobNN.json
  Fix every ERROR. Look at every LEFT line and fix it unless it is a false hit (see below). Run check again until clean.

## House rules (non-negotiable)
- Plain Australian English. Metric, Celsius. Never an em dash or en dash; use commas, full stops or "to".
- No brands, no shops, no restaurants. No AI phrasing.
- Serves 4. Amounts must be real amounts for 4.
- Keep each dish what it is. Never rename a dish, change its course, or change what kind of dish it is.
- veg versions stay vegetarian (no meat, fish, gelatine, fish sauce, anchovy). af and veg_af versions stay alcohol-free. Never add alcohol anywhere. Seafood stays seafood.
- Units allowed: "" (count), g, kg, ml, l, tsp, tbsp, cup. Aisles allowed: Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop, Spices.
- Don't touch prep_min or cook_min. When you add a step give it a realistic "min".
- Only fix what is flagged, plus anything a fix forces (a step that names a line you deleted).

## What each finding means and how to fix it
1. no_make_ahead: write a make_ahead line in the same voice as the good ones ("Up to 5 days, airtight", "Bake the layers up to 1 day ahead, ice on the day", "Marinate up to 1 day ahead in the fridge"). Say what can be done ahead and how long, and what is left for the night. If nothing can be done ahead, say so plainly for that dish ("Best fried just before serving; mix the dipping sauce up to 2 days ahead"). Make each one specific to the dish. Never paste one stock line across dishes.
2. wait_not_in_make_ahead: a step needs 30 minutes or more of waiting (chill, set, steep, infuse, marinate, soak, freeze, cool, overnight). The make_ahead must name that step and how far ahead it can be done, e.g. "Steep and chill the ginger syrup up to 3 days ahead; shake to order". This matters most for cocktails and drinks. Keep the step itself.
3. unused_line: no step uses this ingredient. Either work it into the right step in natural words (salt and pepper into a season or cooking step, oil into the frying step, lime wedges into the serve step), or delete the line if the dish doesn't need it. FALSE HIT: if a step already uses it by a shorter name ("the pork" for pork belly, "the dough" for pastry), leave it, no op. Never leave a salt, pepper or oil line that no step uses.
4. double_line: the same ingredient sits on two lines. Same use: merge into one line with the total (same unit) and delete the other. Different parts of the dish: keep both and label each after a comma ("butter, softened, for the cake" and "butter, softened, for the icing"), and make sure the steps match.
5. no_amount: give a real q and u (mustard 2 tbsp, ice 2 cup, mint 1 bunch with u ""). For seasoning added by taste, make the item say so ("salt and pepper, to taste") and leave q null. If the item already gives the amount ("a drop", "a pinch", "a dash"), that is fine, no op.
6. dash: replace the dash.

## Patch format (wip/recipe/out/jobNN.json)
{
  "<slug>": {
    "<dish name exactly as in the job file>": {
      "<version: base | veg | af | veg_af>": {
        "make_ahead": "new text",
        "ing": [ {"i": 3, "set": {"q": 2, "u": "tbsp"}}, {"i": 5, "set": {"item": "butter, softened, for the icing"}}, {"i": 7, "del": true}, {"add": {"q": 1, "u": "tsp", "item": "salt", "aisle": "Pantry"}} ],
        "steps": [ {"i": 2, "text": "new full text of step 2"}, {"add": {"text": "Season with salt and pepper.", "min": 1}, "at": 4} ]
      }
    }
  }
}
- Indexes are the numbers in the job file (the original order). Deletes and adds are applied after sets, so always use the original numbers.
- "set" on a step or ingredient replaces only the fields you give. Step "text" replaces the whole step text, so write the full sentence.
- Leave out any dish or version you don't change.

When the check is clean, reply in 3 lines: job number, films patched, findings left and why they are fine.

## Scratch files
Other jobs run at the same time. Keep any part files in /tmp/recipe-jobNN/ (your own job number) and nowhere else. Your final out file must contain exactly the slugs in your job file, no others. Check: python3 -c "import json;a=set(json.load(open('wip/recipe/jobs/jobNN.json')));b=set(json.load(open('wip/recipe/out/jobNN.json')));print(b-a,a-b)" must print set() set().
