# Handover (Oct 26, 21:00): read this first in a new chat

Repo jlaw8787/movie-night-spinner (GitHub Pages). Work in a worktree on branch wip/menu-polish. Live = main.
Live as of commit 5031ea4a (Video store refresh, Oct 29).

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
- Hand-pinned stills per film in data/still-pick.json (used first, in order). Bad photos blocked in data/still-block.json (white promo cut-outs, near-black, flat).

## Done Oct 26 (live in e73e6f50)
- wip/genre/lib/posterdupe.py: ORB match of every picked still vs the poster; 1085 poster-art stills in 488 films added to data/still-block.json. Real scenes score 0 to 5 inliers, poster crops 20+.
- wip/genre/lib/stillfocus.py: YuNet faces (model at /home/claude/models/yunet.onnx, from media.githubusercontent.com opencv_zoo) to data/still-focus.json; 9 near-black stills blocked (mean under 18).
- Motel poster front: framed scene snapshot fills the empty card space (The Ring and the other 8 motel films).

- Oct 27 (live in 32f61d36): app.js libAim sets object-position from L.focus straight after the faces are drawn, before photos load, so __fmtLift.trim takes the same aim. Very thin frames (under 40 percent of the still visible) get an unused faceless still. focus entries are [x, y, aspect].

- Oct 27 (live in 08041450): hand-pick pass over the 224 menus in qreport rule 2. 135 stills blocked in 96 films (promo key art, poster variants ORB missed, cut faces, dark). Tool: wip/genre/lib/framegrab.py OUTDIR list.json grabs each visible scene frame as cropped on the page, numbered, plus a paths json, for contact-sheet review.
- Left as is: format title bars over the header photo ("THE MENU" on diner/cafe styles) are the layout, not the photo. Hot Tub and Planes Trains titles come from the motel logo panel.

- Oct 27 (live in 0264f779): data/still-pick.json pins 8 hand-chosen stills (in order) for Casino Royale, Kung Fu Hustle, Mulan, The Little Mermaid (1989), Thor: Ragnarok. build-data.cjs uses it before the auto pick. Use it for any film where the auto pick keeps landing on promo art. Put a wide scene first when the format's first frame is a thin header band.

- Oct 27 (live in cbd5ba2c): functional pass on all 850. wip/genre/lib/funcsweep.py OUT.json [@list.json] loads every film, checks menu, Prep tab, planner, shopping list, times, methods, guests 4 to 8 scaling, untick/retick, tick-off list. funcreport.py summarises. recipecheck.py checks data/recipes2 (its menu-match lines compare to films.json, not the printed menu; trust funcsweep for that).
  Fixed: planner dishes now equal the printed menu on every film (dropped 357 off-menu dishes, wrote 58 recipes for 29 films from their printed how/shop); app.js planShopping merges the same item across dishes and units ("100g + 2 tbsp"); family films alcohol-free; placemat fit trigger gif was invalid so __placematFit never ran (fixed); 10 cocktails got a measured "for each drink" step; aisles: alcohol to Bottle shop, cured meats to Deli, cheese/meat out of the wrong aisles; Crazy Rich Asians "Singapore chilli crab" renamed chilli prawns (it is prawns).
  Result: 850 of 850 pass, 0 menu/prep mismatches.

## Next job
Oct 29 (live in 021c211, sw mns-6f5a3a0f): Video shop renamed to "Video store" as a placeholder. Tab, aria label, welcome card, error messages, comments, README, test (now tests/video-store.test.cjs). Element ids (viewShop etc.) and the "Spinner Video" sign left as is. 8 tests pass, frontcheck 68 steps 0 faults.
Oct 29 (live in 147d5604): recipe polish. wip/recipe/lint.py (make ahead, unused lines, doubles, amounts, on base and every diet version), wip/recipe/tools.py (jobs, check, apply, sync diet versions back to wip/diet/out so merge.py keeps them), wip/recipe/BRIEF.md. 5177 findings down to about 34 false hits (steps use a shorter name). Vegetarian wings: 20 films now have their own swap (wip/recipe/repeats). Known: The Big Lebowski prep sheet overflows 43px (7 dishes, also on the old live), fix with the prep sheet work below.
Oct 29 (live in 12a5aab9): UI fixes. Prep sheet on screen is a normal page (CSS .preview .mcard.pp-sheet), fitPrep skips it; renderCanvas and print (prepA4) fit an A4 copy, floor 9px. Video store phone: #shopFilt details folds decade/service/toggles, .shop-tools sticky at --topH (set from header.top), phone order via flex order, search jumps to results. Post-spin scroll to the curtain on phone is instant (smooth glide drew a blank frame). frontcheck opens Filters first; funcsweep measures the A4 copy.
Oct 29 (live in 7c757d3d): sequels and marathons. data/series.json (82 series, 242 films; release order, plus story where it differs: Star Wars, Middle-earth, Indiana Jones, Mad Max, X-Men, Conjuring, Monsters, Despicable Me). build-data puts it in films.js as window.SERIES. app.js seriesNote(f) runs from show(): "Part X of N" with a swap to the first film; openMarathon(sr): release/story toggle (mns-series-order), tick films in or out, marathonMenu = snack and drink from each film, main from the first (and last on 4+ films), dessert from the middle film; shopping list via openTrolley. Remakes (Lion King, Aladdin, etc.) and reboots (Ghostbusters 2016, TMNT 2023) are left out on purpose. Checks: tests/series.test.cjs, wip/genre/lib/seriessweep.py.
Oct 29 (live in 8798c83a): fresh-eyes review fixes. ?film= links force the Spin view; candy chip span white when picked; marathon .n not struck; planAll keeps only lazy menu dishes when lazy is on; empty Video store search says so; spin bar hides while #preview is on screen in the Prep tab; candy board padding-right 70px on desktop for the popcorn box; week date "31 Oct · 2 days to go"; arrow/Home/End on role=tab; prep shopping lines tick on screen (mns-ticks-<film>, prepClean strips them from save, PDF and print); tap the wheel or curtain (or Esc) to skip the spin and countdown (skipReq). Check: wip/genre/lib/reviewfix.py. Owner parked cost per head. Not done yet: food safety pass on make-ahead hold times (suggested), store name and branding (owner asked to be reminded).
Oct 29 (live in 5031ea4a): Video store refresh. Holiday shelves no longer sit on the floor; the strip shows On now plus every Coming up holiday, and tapping one sets peekSeason for a "Sneak look" shelf at the top. isNew = 20 newest films (was 2020+, 76). isPick = 12 a week from STAFF_POOL (42 hand-picked films). isLate = horror rated MA15+/R; Late Show holds only those and the Horror aisle skips them unless kids mode. tapeHTML: one sticker (Seen it, else new release price, else Staff pick); the Weekly $2 neon is gone (price board says it). Store page about 8000px, was 16000.
Oct 29 owner's order after the recipe polish is approved: 1) DONE UI fixes: bigger prep sheet text on screen (print unchanged), tidy Video store top on phone so tapes show first (fold filters and price board), search box hidden under the sticky tab bar, chase a blank black screen seen in frontcheck phone step 3. 2) DONE Series: "Part 2 of 4, start with the first?" swap when a spin lands on a sequel, plus a marathon planner (one combined planner, snacks and drinks from every film, one or two mains). About 75 series, 197 films. Build on the existing Double feature. 3) Cost per head.
REMIND OWNER: the store still needs a proper name and branding (sign, member card, rental slip). Owner asked to be reminded.

UP NEXT (owner picked Oct 27): rename the "Video shop" tab and everything that says video shop to a store. Ask the owner what the store should be called before starting (tappable options). Find every mention in index.html, app.js, menu-formats, data and tests; keep the tape/rental look unless told otherwise. Check with wip/genre/lib/frontcheck.py, ask approval, then push live.
After that, owner's options: rough cost per head on prep sheets and shopping lists; recipe polish (move cocktail steeping and chilling into make ahead, salt/pepper/oil lines no step uses, cauliflower wings repeated on 6 films).

Earlier:
Audit small fixes (live in 9ad982db): offline spins only land on saved menus (SAVED set from caches, spinPool), unknown film link shows a message in #status, welcome card says 1 to 24 guests, Shuffle the menu button removed, floating spin bar hides while .actions is on screen. Service worker only registers on https, so test offline by registering sw.js by hand on localhost.

- Oct 27 (live in becb7538): diet and ease pass.
  Diet: data/recipes2 dishes carry veg/af flags and alt.af (527), alt.veg (825), alt.veg_af (106), built by wip/diet/merge.py from wip/diet/out (briefs AF-BRIEF.md, VEG-BRIEF.md; checker wip/genre/lib/dietclass.py). app.js DIET (mns-diet), dietDish swaps in the version; drinks become a mocktail. Kids mode always alcohol-free (was letting 64 PG films plan alcohol).
  Ease: quick find on the front (#findFilm, arrows, Enter, Esc), Saved menus shelf (FAV, mns-fav, max 30, also fetched for offline, synced), usual guests (USUAL, mns-guests), Clear link on ticket stubs, one Settings drawer (#settings, data-keep so closing does not delete it) holding kids mode, sound, streaming service, guests, vegetarian, no alcohol, clear stubs, clear saved, reset everything (two taps; keeps mns-welcome).
  Checks: wip/genre/lib/frontcheck.py OUTDIR [base_url], 68 steps phone and desktop, 0 faults.
- Oct 27 (live in 4605515e): vegetarian snacks, sweets and drinks. 876 meat or fish non-mains got alt.veg (and alt.veg_af for the 44 boozy ones) via wip/diet/VEGS-BRIEF.md, jobs vegs01-12. Totals now alt.veg 1688, alt.veg_af 148, alt.af 527; with vegetarian, no alcohol or both on, no dish on any film is blocked.
  wip/diet/fixups.py runs after merge.py (and is called by it): vegetarian parmesan, pecorino, gruyere, manchego, comte; leftover alcohol wording; non-meat items (pickles, olives, hummus, kimchi, sauerkraut, ricotta, pizza dough, dumpling wrappers, tofu, blinis) moved out of the Meat aisle. Run fixups.py BEFORE merge.py too, so the veg flags see the right aisles.
  Checks: wip/diet/deepcheck.py (coverage per mode plus swap quality), wip/diet/dietsweep.py OUT.json [@list.json] (browser, every film in veg, af, veg+af; server on 8795).
  app.js: tapping Prep before a new film's menu finishes drawing now builds the prep sheet (was a page error and a blank sheet).
Later, owner's call: rough cost per head. At the next overhaul the owner wants the Video shop renamed to a store.

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
