# Handover (Oct 26, 21:00): read this first in a new chat

Repo jlaw8787/movie-night-spinner (GitHub Pages). Work in a worktree on branch wip/menu-polish. Live = main.
Live as of commit 373edd6c (service worker version mns-243fd97a).

## Owner rules (non-negotiable)
- Nothing goes live without the owner's approval. Ask with tappable options.
- Never use em or en dashes. Plain Australian English, no AI phrasing. Short need-to-know replies, then numbered steps.
- No employer branding. No real brands or restaurants (film logos with studio marks are allowed). No song lyrics.
- Seafood stays seafood. Kids and family films are alcohol-free. Only details definitely in the film.
- Lock the style and don't drift; wasted tokens cost the owner. Work strictly to the owner's list.
- Never put personal details in any request. User-Agent for any outside request: "MovieNightSpinner/1.0 (personal project)".
- The TMDB key lives only in the repo secret TMDB_KEY; never commit it. Supabase only via the edge function, never service_role. Don't touch the Captain Contract tables.
- Style rules: wip/print/STYLE-LOCK.md, wip/genre/GENRE-BRIEF.md, wip/genre/FORMAT-LIBRARY.md, wip/genre/POSTER-HERO.md, wip/genre/LAYOUT-PASS.md.

## What is live
- 850 films. 75 era films have one-off printed menus. 759 library films use 30 menu styles in menu-formats/<id>.js.
- Film poster is the main picture on every library menu (36 to 44 percent of the front face, whole, nothing over it).
- app.js libPhotoPass: one shared photo rule (no blurred poster smear, no logo over poster, no photo twice). libUnclip: cut text shrinks to fit or the line hides.
- Dinner planner on the Prep tab only: tick dishes (fold-away list), guests 1 to 24, real prep and cook times, scaled shopping list.
- Dish names and notes say what the food is (data/films.json, data/recipes, data/recipes2 kept in step).
- Bad photos blocked in data/still-block.json (white promo cut-outs, near-black, flat).

## Next job (owner said do it next)
About 60 menus still fail on a BACK-page photo:
1. Crops of the poster artwork used as a "scene" photo (e.g. Jaws shark, Thor section map, Airplane window, Moana oval). Plan: at build time, compare each still with the poster (OpenCV ORB keypoint matching) and block stills that match.
2. Odd crops (part of a face) and a few still-dark photos.
3. The Ring (motel): big empty areas on the front.
Then: rerun checks, send the owner before and after, ask before pushing.

## Tools (run from the repo root; local server: python3 -m http.server 8795)
- wip/genre/lib/sweep.py [style ...]: full check of library menus (spill, cut, small text, duplicate, dark and white photos, poster hero, hidden lines). About 25 min for all 759.
- wip/genre/lib/qshots.py: clean screenshots of every menu (welcome card off) to wip/genre/proofs/_q/.
- wip/genre/lib/posterpct.py "Film (Year)": poster share, text check, screenshot.
- wip/genre/lib/pdfcheck.py "Film (Year)": app vs PDF sheet.
- wip/genre/audit/QUALITY-PASS.md: reviewer checklist. Contact sheets go in wip/genre/audit/qsheets/.
- Final review reports: wip/genre/audit/qreport-1..4.txt (502 findings; 132 high, many overcalled; posters on white are fine).

## Push to live
In the main checkout: git fetch origin main wip/menu-polish; git reset --hard origin/main; git checkout origin/wip/menu-polish -- <files>; node scripts/build-data.cjs; run tests/*.test.cjs; commit; git push origin HEAD:main.
Commit lines end with: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>

## Lessons from today
- Don't trust "looked fine" from screenshots taken with the welcome card open; use qshots.py.
- Run at most 6 agents at once or the machine chokes. One style per agent, with a tight brief.
- pgrep -f patterns match their own wait loops; don't wait on pgrep -f with the same text.
