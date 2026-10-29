# Road to a professional app (owner: Josh)

The weekly background run works this list top down: ONE item per run, built on its own branch, never pushed live.
Status: TODO, BUILT (on branch, waiting for the owner), LIVE, ASK FIRST (needs the owner's call, the run skips it and lists it in the report), PARKED.
When an item goes live, the owner (or the session that pushed it) marks it LIVE with the commit.

## Rules for every run
- Read wip/HANDOVER.md first. Its owner rules apply (no em or en dashes, plain Australian English, no brands, no employer branding, lock the style).
- Nothing goes live. Never push to main, never merge. Push only the run's own branch: auto/YYYY-MM-DD-<short-name>, cut from wip/menu-polish.
- Before building, run every check on wip/menu-polish and note anything already failing.
- After building, run every check again: node tests/*.test.cjs, wip/genre/lib/frontcheck.py, reviewfix.py, snackcheck.py, swcheck.py, seriessweep.py, and funcsweep.py when films, menus or the planner are touched. The item is only BUILT when all pass.
- Take before and after screenshots (phone 390x844 and desktop 1440x900) of anything visible.
- Keep it lean: at most 6 agents at once, one item per run, no rewrites of things that work.
- The report to the owner: what was built, the branch, check results, screenshots, anything that needs his call. Short, plain, no AI phrasing.

## The list (top is next)
1. TODO  Walkthrough fixes: fix the broken and confusing findings from the casual-user walkthrough (wip/JOURNEY-FINDINGS.md). Skip anything marked ASK FIRST there.
2. TODO  Checks on every push: a GitHub Actions workflow that runs node tests/*.test.cjs on pushes to any branch (no deploy, no secrets). Fails loudly if a test breaks.
3. TODO  Accessibility: WCAG 2.1 AA pass. Colour contrast, focus order and visible focus, labels on every control, dialogs trap focus, reduced motion respected, tap targets 44px on phone. Fix what fails.
4. TODO  Speed on phones: measure first load on a mid phone profile (throttled), cut what is slow (image sizes, unused CSS and JS on first paint, font loading). Report before and after numbers.
5. TODO  Install like an app: manifest and icons checked, a proper offline page, a gentle "add to home screen" hint after a second visit, splash colours match.
6. TODO  Problem reports: a "Something not right?" link in Settings that copies a short report (page, film, device, last error) for the owner. No tracking, nothing sent without the user pressing it.
7. TODO  About and privacy page: what is saved on the device, what the member card syncs, the TMDB and JustWatch credits, how to clear everything.
8. TODO  Private review diary: after Mark as watched, stars and a short note for the film and for the menu; a "Your diary" view with history; synced on the member card. Private only.
9. TODO  Snacks on marathons and double features: their shopping lists carry the snack counter picks.
10. TODO Suggested snacks per film: two "goes well with" picks from the snack counter on each film's menu view.
11. ASK FIRST  Name and brand the store (sign, member card, rental slip). Owner picks the name.
12. ASK FIRST  Sharing reviews with friends by link.
13. ASK FIRST  New films each month: a pipeline to add new releases with menus.
14. PARKED  Cost per head.
15. PARKED  Food safety pass on make-ahead hold times (owner: not needed).
