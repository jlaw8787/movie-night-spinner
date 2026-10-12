# Poster workflow: ChatGPT and Claude working together

Two assistants work in this repo at the same time. Stay in your own lane so neither overwrites the other.

## Who does what

**Claude** writes the menus.
- Owns `index.html` (it is generated from Claude's build, so hand edits get blocked on the next push).
- Writes a hand-written menu for every film. Each dish has a scene from the film, a method and a shopping list.
- Exports them to `poster-briefs.json` on every push. That file is the source of truth for dish names. Never edit it.

**ChatGPT** makes the posters.
- Owns `assets/menu-posters/`, `movie-menus.js`, `menu-artwork-rollout.json`, `ARTWORK_ROLLOUT.md` and `tests/`.
- Turns each brief into a finished poster edition: artwork, poster text and four-person recipes.
- Does not edit `index.html`. If a page change is truly needed, put it in its own commit with a clear message and say so. Claude will move it into the build.

## Each run: one batch of 10 films

1. `git pull` first, every time.
2. Open `poster-briefs.json`. Take the next 10 films where `poster_status` is not `complete`, in file order.
3. For each film:
   1. **Pick the poster menu from the brief.** Choose 2 of the snacks, 1 of the mains, the dessert and the drink. Use the dish names exactly as written in the brief. Pick the dishes that best match the artwork and make the best meal together.
   2. **Write the poster description** for each dish: 6 to 14 words describing the food itself (not the scene), taken from the brief's method.
   3. **Make the artwork.** It's a full A4 portrait poster, the same format as the approved Warriors, Ghostbusters and Godfather posters: a cinematic photographic scene at the top, then a weathered paper menu panel with MOVIE NIGHT MENU, sections SNACKS, MAIN, DESSERT, DRINK, and a footer line. The scene comes from the brief's `scene` notes and `serve_cue`. Every film must look different, with its own palette, typography and scene.
   4. **Check the image before saving it.** Every dish name and description must be spelled exactly and fully readable, with nothing cut off at the margins.
   5. **Save the poster** to `assets/menu-posters/<title-year-slug>.jpg`. Match the existing posters' size and proportions and keep it under 1 MB.
   6. **Add the edition to `movie-menus.js`** in the existing format: `servings: 4`, `tagline` (use the brief's tagline), `cue` (use the brief's serve_cue), `colour`, and `menu` with s (2), m (1), w (1), d (1).
      - `n`: the dish name, exactly as in the brief.
      - `note`: the poster description.
      - `how`: the brief's method, rewritten for 4 people with exact quantities, temperatures and times. Keep every technique from the brief.
      - `shop`: quantities with an aisle, for example `"400g beef mince@Meat"`. Aisles are Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop.
      - Add the consolidated `menu.shopping` list as before.
   7. Mark the film `complete` in `menu-artwork-rollout.json` with its poster path and art direction.
4. **Update the tests so they count editions** instead of expecting exactly 3. Then run `node tests/poster-menus.test.cjs` and `node tests/watched-state.test.cjs`. Both must pass.
5. Commit with the film names in the message, then `git pull --rebase` and `git push`.

## Rules for every poster and recipe

- **No em dashes anywhere** (the long dash). Use commas or full stops.
- **Australian spelling and terms**: capsicum, coriander, prawns, mince, tomato sauce.
- **No brand names in dishes or descriptions.**
- **Original title lettering inspired by each film's mood.** No official logos, no ™ or ® marks, and no recognisable faces of real actors. Silhouettes, backs of heads, places, props and food are fine. (Josh: delete this rule if you want the official logo style used in the first three.)
- **Short original taglines only.** Use the brief's tagline. Don't add long quotes from the film.
- A film is complete only when the poster text, the edition in `movie-menus.js` and the recipes all match.
- **Never touch a film that isn't in `poster-briefs.json`.** Claude is still writing those menus. They get added to the briefs as each one is finished.
