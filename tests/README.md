# Regression checks

Run from the repository root with Node.js:

```sh
node tests/era-menus.test.cjs
node tests/poster-menus.test.cjs
node tests/watched-state.test.cjs
node tests/tmdb-posters.test.cjs
node tests/video-store.test.cjs
node tests/series.test.cjs
node tests/shopping.test.cjs
node tests/week.test.cjs
node tests/menu-chooser.test.cjs
node tests/cook-times.test.cjs
node tests/sweet-starters.test.cjs
node tests/prices.test.cjs
node tests/dry-plan.test.cjs
```

The shopping tests execute the app's real checklist code with a small DOM fixture. They cover unlocked visit-local ticks, locked persistence, remaining-only sharing, empty and completed lists, stale keys, reset and double-feature lists. The weekly-plan suite executes the actual date/countdown and restore code in Brisbane, New York and UTC, including daylight-saving changes, legacy migration, explicit remote clearing and blocked storage.

The sweet starters check fails when a biscuit, cake, lolly or ice cream is listed as a starter on a shared menu card or in the cooked recipes, unless the film makes it a snack (the keep list in scripts/check-sweet-starters.cjs gives each reason). `node scripts/check-sweet-starters.cjs` prints the full list for a person to judge.

The prices test runs the shared price code (priceEnd and priceTidy in app.js): odd cents go up to a price ending and a card shows one price style. `NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-prices.cjs` renders every shared card and fails on odd cents or cents beside dollars (about five minutes; pass a number for that many films per layout).

## Browser checks

These require Playwright, Chromium and Python 3. Supply an existing Playwright module with `PLAYWRIGHT_MODULE` and a Chromium executable with `MNS_BROWSER`, or use a normally installed Playwright package/browser.

```sh
node tests/dialogs.test.cjs
node scripts/check-browser.cjs
```

`node scripts/check-cut-words.cjs [per-layout]` renders films on every shared layout and fails on a printed or phone line cut off on "and", "with", "of", "in", "the", "a" or "is". Lines written that way in the data are listed as a warning.

The first tests the shared modal lifecycle in a real browser. The second starts a local server on port 4184 and checks actual app flows at 390px and 1280px: welcome dismissal, keyboard containment and focus restoration, shopping progress/share/reset, locked checklist reload persistence, rental dismissal, and nested double-feature shopping dialogs. It blocks external traffic and simulates the clipboard, so it cannot write to a member account. A JSON result is saved in the operating system's temporary directory; `REGRESSION_PROOF` overrides that path. `REGRESSION_SCREENSHOTS_DIR` optionally records welcome-dialog screenshots.

These are functional checks. Blocked external fonts/images mean their screenshots and timings are not visual or performance benchmarks. They do not replace an authenticated, signed-in two-device sync test or a full accessibility audit.
