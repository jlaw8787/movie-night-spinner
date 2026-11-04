# shared-c: for the lead

## Data the brief does not let teams edit
- Printed notes for the cooked dishes on shared layouts come from data/recipes/<slug>.json (poster editions from movie-menus.js), not data/films.json. Card note changes for those dishes only show once data/recipes is updated. sweep/recipes-notes-shared-c.json lists the note, method and shopping to set there (Rocky II, Goblet of Fire, The Witches, Flash Gordon, Creed, Ocean's Twelve, Unforgiven, Tombstone, Happy Gilmore, Christmas with the Kranks). Until then those cards still print prosciutto, chorizo, smoked salmon, chicken curry, salami and bacon while the Prep sheet cooks the new version.
- Kate & Leopold and Annie are poster editions (movie-menus.js). Kate & Leopold's card names now match the edition ("Butter tasting", "Leopold's rooftop dinner") so the snapper no longer prints twice.

## Needs code
1. Dry pass (KDRY in app.js) turns food into drinks: Christmas with the Kranks printed "Caribbean cruise prawn mocktail". The cocktail rule skips "prawn cocktail" in a plain string, so the name is likely reaching the pass split across text nodes. Suggest running the pass on each name element's joined text, and adding "dressing" to the lookahead.
2. Home layout footer (menu-formats/home.js line 206) writes "From the " + venue, so it reads "From the Adrian's Little Kitchen." Drop "the" when the venue is a possessive name.
3. Prices: stadium (Happy Gilmore) prices the lemon shandy pitchers 1.50 under cold chocolate milk 1.95; saloon (Tombstone) prices Doc Holliday's rye old fashioned 2.75 under the peach pie 4.00. priceSense is not on stadium or saloon.
4. film-house.json `fit` values were set against the old cards. Home layout films in this batch now use fit ["d"] so the starter house line drops and dish notes show; other layouts may want the fit recomputed after the sweep.
