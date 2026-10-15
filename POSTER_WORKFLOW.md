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

Project clarification from Josh, 15 October 2026: keep Claude's canonical menus exactly as written, including seafood. Seafood ingredients are not a reason to skip a film, rewrite its recipe or hold its poster. This supersedes the earlier household-seafood holds recorded in the rollout history.

Claude is pre-writing the four-person recipes into `poster-recipes.json`, so most films now only need artwork. In `poster-briefs.json`, a film with `"recipe_ready": true` has one. For those films:

1. Skip choosing dishes and writing recipes. Copy `films["Title (Year)"].menu` from `poster-recipes.json` exactly as it is (s, m, w, d and shopping) into the edition's `menu`. Don't change it.
2. Make the poster from those five dishes. Use each dish's `n` as the name and its `note` as the description, word for word.
3. Add `poster`, `colour`, `servings: 4`, `tagline` (brief) and `cue` (brief's serve_cue), then mark the film complete as usual.

Work through your lane in file order as before. If you reach a film without `recipe_ready`, do it the full way below. Never edit `poster-recipes.json`. It's rebuilt on every Claude push.

## Each run: one batch of 10 films from your lane

1. Run `git pull` first, every time.
2. Run `node scripts/poster-status.cjs --lane N` (replace N with your lane). Take its next batch, in brief file order. This read-only audit checks the edition, rollout entry and actual JPEG together. `poster_status` in `poster-briefs.json` and the top-level rollout `completed` total are generated snapshots and can lag published work. Never regenerate a checked complete edition just because those snapshots are stale. Stop to repair any audit errors before adding editions. Never edit the generated snapshots to fix the queue.
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

## Recovery and reliable publishing

- On resuming any lane, pull and run the status command above before generating images. Completed work in the repository takes precedence over an old chat status. `node scripts/poster-status.cjs --json` gives the complete recovery report for all five lanes.
- Establish an available publishing route before starting a batch. A connected GitHub app does not provide credentials to command-line Git. If command-line push has no credentials, use the connected app's Git data tools, within the same authorised lane scope. Do not repeatedly retry an unauthenticated push or ask for another approval when the user has already authorised publishing.
- For app publishing, upload each JPEG as a base64 blob and save the returned blob SHA with the film ID and path. Create a tree based on the latest main tree containing every batch JPEG, the lane's edition changes and only its rollout fields. Create one commit on the latest main head, then fast-forward main. Do not force-push. If main moves, read the new head, retain the other lanes' changes, rerun both tests, and rebuild the tree and commit on that head. Never replace a shared file with a stale copy.
- Do not publish an edition or mark it complete until all of its image blobs are available. A successful blob upload alone is not a published poster. Keep an explicit per-film record of generated, visually checked, uploaded and published states. If interrupted, recover available assets before regenerating them.
- After publishing, fetch main and verify that the remote commit includes all poster paths, edition blocks and matching rollout entries for the batch. Run the status audit and both tests against that remote commit. Report the commit SHA and the number of films verified. If publication is incomplete, state exactly what remains.
- Automatic review rejections and image-service failures must be reported with their actual reason. Do not call a rejection a false positive without evidence, promise a background retry, or finish a turn with only 'publishing now'. A finished chat turn is not evidence of an active background worker.
- Existing artwork may predate a newer recipe export. If dish names or descriptions differ, review the actual poster before changing them. Never silently replace poster text in the edition. Shopping-only differences can be restored to the canonical export without changing printed artwork.

## Rules for every poster and recipe

- **No em dashes anywhere** (the long dash). Use commas or full stops.
- **Australian spelling and terms**: capsicum, coriander, prawns, mince, tomato sauce.
- **No brand names in dish names or descriptions.**
- **Taglines:** use the brief's tagline. A short, famous line from the film is fine in the footer.
- A film is complete only when the poster text, the edition in `movie-menus.js` and the recipes all match.
- **Never touch a film that isn't in `poster-briefs.json`.** Claude is still writing those menus. They get added to the briefs as each one is finished.

## Real posters (TMDB)

Films without a finished poster edition now show their official poster on a lobby-card menu. The poster loads live from TMDB's image servers; only the poster paths live in `tmdb-posters.js`. No API key is stored in the repo. To add new films, run `TMDB_KEY=... python3 scripts/tmdb-match.py films.json matches.json` and add the new paths to `tmdb-posters.js`. Finished poster editions still take priority. TMDB's free terms cover personal, non-commercial use only.
