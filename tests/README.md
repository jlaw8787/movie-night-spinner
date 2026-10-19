# Regression checks

Run from the repository root with Node.js:

```sh
node tests/era-menus.test.cjs
node tests/poster-menus.test.cjs
node tests/watched-state.test.cjs
node tests/tmdb-posters.test.cjs
node tests/video-shop.test.cjs
node tests/shopping.test.cjs
node tests/week.test.cjs
```

The shopping tests execute the app's real checklist code with a small DOM fixture. They cover unlocked visit-local ticks, locked persistence, remaining-only sharing, empty and completed lists, stale keys, reset and double-feature lists. The weekly-plan suite executes the actual date/countdown and restore code in Brisbane, New York and UTC, including daylight-saving changes, legacy migration, explicit remote clearing and blocked storage.

## Browser checks

These require Playwright, Chromium and Python 3. Supply an existing Playwright module with `PLAYWRIGHT_MODULE` and a Chromium executable with `MNS_BROWSER`, or use a normally installed Playwright package/browser.

```sh
node tests/dialogs.test.cjs
node scripts/check-browser.cjs
```

The first tests the shared modal lifecycle in a real browser. The second starts a local server on port 4184 and checks actual app flows at 390px and 1280px: welcome dismissal, keyboard containment and focus restoration, shopping progress/share/reset, locked checklist reload persistence, rental dismissal, and nested double-feature shopping dialogs. It blocks external traffic and simulates the clipboard, so it cannot write to a member account. A JSON result is saved in the operating system's temporary directory; `REGRESSION_PROOF` overrides that path. `REGRESSION_SCREENSHOTS_DIR` optionally records welcome-dialog screenshots.

These are functional checks. Blocked external fonts/images mean their screenshots and timings are not visual or performance benchmarks. They do not replace an authenticated, signed-in two-device sync test or a full accessibility audit.
