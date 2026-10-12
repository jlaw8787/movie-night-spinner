# Movie Night Spinner

A static movie-night picker with film-themed menus, prep sheets, shopping lists and PDF/image exports.

## Watched checklist

Open **My movie checklist** beneath the wheel to search the selected programme and tick films you've watched. Filter the checklist by All movies, Unwatched or Watched. The **Mark as watched** button beside the menu also marks the displayed film, and can undo that tick.

**Skip watched films when spinning** is enabled by default. Turn it off to allow rewatches. If a programme has no unwatched films left, choose another programme, untick a film or allow rewatches.

Ticks and the skip preference are stored in localStorage in the same browser. They do not sync between devices and are removed when that site's browser data is cleared. If storage is unavailable, ticks work for the current visit and the app shows a warning.

## Run

Serve the repository as a static website, or deploy the root of the `main` branch with GitHub Pages. No build step is required. To apply the watched update manually, replace the root `index.html` with the updated file.

## Verify

With Node.js installed:

```sh
node tests/watched-state.test.cjs
```

The dependency-free checks exercise the watched-state code from `index.html`: persistence, undo, allowing rewatches, theme/search/status filters, an exhausted programme, changes during a spin, and unavailable or malformed storage. They do not replace visual browser testing.

## Film-specific poster menus

The artwork rollout uses the approved **The Warriors** poster-style menu as its visual standard. Completed films have their own full-page artwork and a fixed, matching menu for four people, with quantified methods and a consolidated shopping list. Menu artwork loads only for the selected film. Screen readers and Copy text retain the menu's text.

The first finished batch is **The Warriors (1979)**, **Ghostbusters (1984)** and **The Godfather (1972)**. Their artwork lives in `assets/menu-posters/`, and their menu/recipe definitions are kept together in `movie-menus.js`. For these films, Shuffle the menu is hidden so the recipes cannot diverge from the printed artwork. If artwork fails to load, the app renders the same food menu using its existing layout.

`menu-artwork-rollout.json` tracks all **708** films individually. A pending entry has not yet received finished artwork; it still uses its existing menu. Three completed entries do not imply the whole collection is finished.

Direct preview links use a validated film ID, for example `?film=The%20Warriors%20%281979%29`. Normal visits still start with Ghostbusters and the random wheel continues to work normally.

Additional checks:

```sh
node tests/poster-menus.test.cjs
```
