# Movie Night Spinner

A static movie-night picker with film-themed menus, prep sheets, shopping lists and PDF/image exports.

## Watched checklist

Open **My movie checklist** beneath the wheel to search the selected programme and tick films you've watched. Filter the checklist by All movies, Unwatched or Watched. The **Mark as watched** button beside the menu also marks the displayed film, and can undo that tick.

**Skip watched films when spinning** is enabled by default. Turn it off to allow rewatches. If a programme has no unwatched films left, choose another programme, untick a film or allow rewatches.

Ticks and the skip preference are stored in localStorage in the same browser. They do not sync between devices and are removed when that site's browser data is cleared. If storage is unavailable, ticks work for the current visit and the app shows a warning.

## Run

Serve the repository as a static website, or deploy the root of the `main` branch with GitHub Pages.

## Build

The page is split so phones only download what they need:

- `index.html` holds the markup and styles, `app.js` the app, `formats.js` the era menus.
- `films.js` is a light index of all 850 films (title, year, theme).
- Each film's full menu, methods and shopping live in `data/film/<slug>.json`, fetched when the film is opened.
- Dish names and notes for the seasonal shelves and the Candy bar load after the page settles.

Edit `data/films.json`, `movie-menus.js` or `data/recipes/`, then run:

```sh
node scripts/build-data.cjs
```

That rebuilds `films.js` and `data/film/`, and stamps each script with a version so phones pick up changes straight away.

## Film stills

`scripts/stills-wanted.txt` lists films whose era menu uses a frame from the film. Add a line and push: the Fetch film stills action uses the `TMDB_KEY` secret to write `data/film-stills.json` (image paths only).

## Verify

With Node.js installed:

```sh
node tests/watched-state.test.cjs
```

The dependency-free checks exercise the watched-state code from `index.html`: persistence, undo, allowing rewatches, theme/search/status filters, an exhausted programme, changes during a spin, and unavailable or malformed storage. They do not replace visual browser testing.

## Posters and exact menus

Every film shows its official poster, loaded live from TMDB (`tmdb-posters.js` holds the poster paths only, never the API key), framed in a lobby-card menu in the film's own colours and fonts. Every film also has an exact menu for four people with quantified methods and one shopping list: 124 finished menus in `movie-menus.js`, and the rest in `recipe-menus.js`, generated from `poster-recipes.json`. Shuffle the menu is hidden wherever an exact menu exists. If a poster can't load, the 124 finished films fall back to their old poster art and every other film to its themed menu card.

The **Video shop** tab shows every film face-out on rental shelves by genre, with New releases and Staff picks walls. Tap a tape to read the back of the box and rent it, which loads that film's menu.
