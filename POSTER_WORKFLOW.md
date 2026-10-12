# Poster workflow: ChatGPT and Claude working together

Two assistants work in this repo at the same time. Stay in your own lane so neither overwrites the other.

## Who does what

**Claude** writes the menus.
- Owns `index.html` (it is generated from Claude's build, so hand edits get blocked on the next push).
- Writes a hand-written menu for every film. Each dish has a scene from the film, a method and a shopping list.
- Exports them to `poster-briefs.json` on every push. That file is the source of truth for dish names. Never edit it.

**ChatGPT** makes the posters.
- Owns `assets/menu-posters/`, `movie-menus.js`, `menu-artwork-rollout.json` and `ARTWORK_ROLLOUT.md`.
- Turns each brief into a finished poster edition: artwork, poster text and four-person recipes.
- Does not edit `index.html` or the tests. The tests already count however many editions exist. If a page change is truly needed, put it in its own commit with a clear message and say so. Claude will move it into the build.

## Five agents in parallel

Every film in `poster-briefs.json` has a `lane` from 1 to 5. Run up to five agents at once, one per lane. **Agent N only ever works on films whose `lane` is N.** This stops two agents doing the same film or clashing on the same lines.

- In `movie-menus.js`, agent N writes only inside its own block, between `// ===== LANE N START` and `// ===== LANE N END`. Insert each new edition directly below the START line as one self-contained block, with its shopping list inside `menu`:
  ```js
  Object.assign(MOVIE_MENU_EDITIONS,{"Title (Year)":{poster:"assets/menu-posters/title-year.jpg",colour:"#123456",servings:4,tagline:"...",cue:"...",menu:{s:[...],m:[...],w:[...],d:[...],shopping:[...]}}});
  ```
- In `menu-artwork-rollout.json`, change only that film's own `status`, `poster` and `art_direction`. Don't touch the top-level `completed` number. Claude keeps that in step.
- Images go in `assets/menu-posters/` with a unique filename per film, so they never clash.

## Fast path: recipes Claude has already written

Claude is pre-writing the four-person recipes into `poster-recipes.json`, so most films now only need artwork. In `poster-briefs.json`, a film with `"recipe_ready": true` has one. For those films:

1. Skip choosing dishes and writing recipes. Copy `films["Title (Year)"].menu` from `poster-recipes.json` exactly as it is (s, m, w, d and shopping) into the edition's `menu`. Don't change it.
2. Make the poster from those five dishes. Use each dish's `n` as the name and its `note` as the description, word for word.
3. Add `poster`, `colour`, `servings: 4`, `tagline` (brief) and `cue` (brief's serve_cue), then mark the film complete as usual.

Work through your lane in file order as before. If you reach a film without `recipe_ready`, do it the full way below. Never edit `poster-recipes.json`. It's rebuilt on every Claude push.

## Each run: one batch of 10 films from your lane

1. Run `git pull` first, every time.
2. Open `poster-briefs.json`. Take the next 10 films in your lane where `poster_status` is not `complete`, in file order.
3. For each film:
   1. **Pick the poster menu from the brief.** Choose 2 of the snacks, 1 of the mains, the dessert and the drink. Use the dish names exactly as written in the brief. Pick the dishes that best match the artwork and make the best meal together.
   2. **Write the poster description** for each dish: 6 to 14 words describing the food itself (not the scene), taken from the brief's method.
   3. **Make the artwork.** Use the style of the approved Warriors, Ghostbusters and Godfather posters: a full A4 portrait poster with the film's title treatment and a cinematic photographic scene at the top, then a weathered paper menu panel with MOVIE NIGHT MENU, sections SNACKS, MAIN, DESSERT, DRINK, and a footer line. The scene comes from the brief's `scene` notes and `serve_cue`. Every film must look different, with its own palette, typography and scene.
   4. **Check the image before saving it.** Every dish name and description must be spelled exactly and fully readable, with nothing cut off at the margins.
   5. **Save the poster** to `assets/menu-posters/<title-year-slug>.jpg`. Match the existing posters' size and proportions and keep it under 1 MB.
   6. **Add the edition block** in your lane (format above) with:
      - `servings: 4`.
      - `tagline`: the brief's tagline.
      - `cue`: the brief's serve_cue.
      - `colour`.
      - `menu` with s (2), m (1), w (1) and d (1). For each item:
        - `n`: the dish name, exactly as in the brief.
        - `note`: the poster description.
        - `how`: the brief's method, rewritten for 4 people with exact quantities, temperatures and times. Keep every technique from the brief.
        - `shop`: quantities with an aisle, for example `"400g beef mince@Meat"`. Aisles are Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop.
      - `shopping`: the consolidated list, with no ingredient counted twice.
   7. **Mark the film `complete`** in `menu-artwork-rollout.json` with its poster path and art direction.
4. Run `node tests/poster-menus.test.cjs` and `node tests/watched-state.test.cjs`. Both must pass.
5. Commit with your lane and the film names in the message, for example `Lane 3: Heat, Jaws, Up`. Then run `git pull --rebase` and `git push`. If the rebase conflicts, keep both sides (every change is additive) and run the tests again before pushing.

## Rules for every poster and recipe

- **No em dashes anywhere** (the long dash). Use commas or full stops.
- **Australian spelling and terms**: capsicum, coriander, prawns, mince, tomato sauce.
- **No brand names in dish names or descriptions.**
- **Taglines:** use the brief's tagline. A short, famous line from the film is fine in the footer.
- A film is complete only when the poster text, the edition in `movie-menus.js` and the recipes all match.
- **Never touch a film that isn't in `poster-briefs.json`.** Claude is still writing those menus. They get added to the briefs as each one is finished.
