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
