# Movie menu artwork rollout

> **Poster lanes closed, 15 October 2026.** Every film now shows its official poster from TMDB in the lobby-card menu, with an exact 4-person menu from `recipe-menus.js` or `movie-menus.js`. Do not make new poster art or run the lanes below. The 124 finished poster JPEGs in `assets/menu-posters/` are kept only as a fallback if TMDB can't load. The rest of this file is kept for history.


## Current film-world menu asset standard, 19 October 2026

For the custom HTML/CSS menus in `formats.js`, use authentic film imagery wherever a recognisable sign, logo, prop or setting needs to match the movie. Prefer official TMDB assets or an actual film frame over a hand-drawn approximation or generated imitation. Crop and align the source image with the layout; preserve its recognisable shapes, lettering and proportions. Record the source for any locally stored detail image.

Apply this where required by each menu, rather than adding a logo to every design. Keep layouts individual to the film and check the result in both the phone view and printable menu. Preserve canonical recipes, methods and shopping lists.

### Continuing the custom-menu queue

Run `node scripts/menu-status.cjs` for the checked total and next pending titles, or add `--json` for the full queue. A film with a working custom format in `FMT_FILMS` is counted separately from the older lobby-card and JPEG poster fallback. Every film already has a fallback menu; pending here means its individual film-world design is still needed.

Josh authorised continuing through the full queue and publishing reviewed batches. Use separate agents for separate film drafts, then one shared integration and visual review. Keep one focused concept per film, share source retrieval, and avoid repeated generation or cosmetic variants. Render every new design, check film-image identities, course spacing and source crops, run phone tab/method checks in a real browser where available, and retain exact recipe methods and shopping. Do not claim an objective 9.5 grade from automated tests alone.

The current seven-slot session supports five film designers, one independent reviewer and one integration/publishing owner. Keep each batch to five films and clear its review queue before assigning another batch. The independent checkpoint includes added film-detail claims in phone notes, recognisable subjects in image crops, all five dishes and the complete serving cue. The release checkpoint includes recipe-link tests, real-browser phone interactions and print-image checks, followed by verification that the live files match the reviewed release.

The older poster-lane instructions below remain historical.


## Standard

Each film gets an individually art-directed A4 menu poster. Use the approved Warriors print as the quality benchmark: cinematic artwork, recognisable film typography, clear food hierarchy and legible descriptions. A category recolour or clip-art substitute is not a completed film.

## First batch

| Film | Artwork direction | Status |
|---|---|---|
| The Warriors (1979) | Red brush title, photographic Coney Island night scene, weathered cream menu | Complete |
| Ghostbusters (1984) | Film identity, Ecto-1, green-lit Manhattan firehouse, red and ivory typography | Complete |
| The Godfather (1972) | Vito and wedding imagery, iconic title and puppet motif, dignified Italian menu | Complete |

Run `node scripts/poster-status.cjs` for the checked queue and counts. Generated brief statuses and the top-level rollout total can lag published editions. All generated artwork is original film-inspired artwork, not official licensed poster art.

## Recovery audit, 15 October 2026

### Single coordinator handoff

**Current instruction, 15 October 2026:** Josh explicitly authorised keeping seafood in Claude's menus. All seafood holds described below are historical and superseded. Process those films normally with exact canonical recipes. Image-service rejections remain separate technical blockers.

Josh has moved all five poster lanes into one new coordinating chat after the recovery audit. This coordinator may work across all lanes, preserving each film's assigned lane block. Old lane chats should remain idle. This handoff records ownership; it cannot stop or restart other chat sessions.

Start every session with a pull and `node scripts/poster-status.cjs --json`. Continue from checked repository state, not old chat completion claims. Keep ten-film batches within each lane where possible, retain blocked titles explicitly, and publish only complete reviewed posters. Do not regenerate checked complete films.

Lane 1 remains blocked for Die Hard, Rush Hour 2 and The Fifth Element because the current canonical menus contain seafood. Preserve the source recipes and leave these films pending. The next available Lane 1 film is Superman (1978).

First coordinator batch reviewed ten pending Lane 1 titles. Five new posters have matching canonical recipes: The Thing, A Nightmare on Elm Street, Shaun of the Dead, Young Frankenstein and Mad Max 2. All are A4 portrait JPEGs below 1 MB. Their dish names and descriptions were visually checked against the recipe export. The built-in image generator produced the cinematic artwork and exact menu lettering; conversion to JPEG only changed delivery format and compression.

Superman again returned `moderation_blocked` at the output stage, category `other`, request `d90c6a97-580e-469d-a4f3-68a19ee2b583`. No image was delivered or marked complete. Beetlejuice also remains pending because its canonical menu contains prawns and lobster. These five blocked entries remain explicitly pending; they are not counted as complete.

After this batch, checked edition totals are 114 complete and 594 pending. Lane completion counts are 31, 20, 20, 12 and 31 respectively. Next coordinator batch: Lane 2's next ten checked pending films, starting with Lethal Weapon 3 (1992). Retain Lane 1 blockers for separate resolution without repeatedly generating rejected or seafood-incompatible menus.

Repository head `42b208a` contains 109 complete editions with 109 JPEGs. Both existing tests pass. There are 599 films remaining.

| Lane | Complete | Remaining |
|---|---:|---:|
| 1 | 26 | 113 |
| 2 | 20 | 113 |
| 3 | 20 | 116 |
| 4 | 12 | 150 |
| 5 | 31 | 107 |

Forty completed films still have stale brief statuses. The status script excludes checked complete editions from the generation queue without editing Claude's generated briefs or top-level completed total.

Five shopping-only differences have been restored to the canonical recipe exports: Hitch, Oliver & Company, Bugsy, Men in Black and Stakeout. Their dish names, descriptions, methods and artwork are unchanged.

Four existing editions differ more substantially from newer recipe exports: Elf, Midnight Cowboy, Dog Day Afternoon and The Out-of-Towners. Review their existing images before changing any dish names or descriptions. They remain visible in the audit's recipe difference report, and are excluded from automatic regeneration because they already have published editions and images. This audit checks data and assets, not their visual spelling or artistic quality.

These fixes make the repository resumable. They do not restart other chat sessions or recover unpublished images from those sessions. Follow the recovery and remote-verification steps in `POSTER_WORKFLOW.md` when each lane resumes.

## Per-film completion

1. Read the film entry and research actual food, setting and recognisable visual references.
2. Curate two snacks, one main, one dessert and one drink as a coherent movie-night meal.
3. Produce a distinct poster with readable exact dish names and descriptions.
4. Visually review title, imagery, typography, spelling, margins and print proportions.
5. Put the artwork in `assets/menu-posters/`; keep menu, four-person methods and consolidated shopping quantities together in `movie-menus.js`.
6. Run both tests, verify the film in the wheel, review the prep sheet and export a two-page PDF.
7. Mark that film complete only when artwork, displayed menu and recipes agree.

Do not mark pending entries complete just because their category has an existing template. Preserve unfinished films' working menus throughout the rollout.

## Lane 1 handoff, 13 October 2026

Batch 1 adds ten reviewed posters and matching four-person editions: A Bronx Tale, Prizzi's Honor, Spider-Man 2, King of New York, After Hours, Frequency, The Adjustment Bureau, The Secret of My Success, When Harry Met Sally... and You've Got Mail.

Batch 2 adds Newsies, Serendipity, Beverly Hills Cop, Tango & Cash, Bad Boys, Rush Hour, Running Scared and Back to the Future. Every dish name comes unchanged from its brief. All JPEGs are A4 portrait and below 1 MB. Both tests pass.

Two Lane 1 briefs need an additional seafood-free snack before completion, given the household seafood allergy:

- Die Hard (1988): only Argyle's limo snacks is seafood-free. Nakatomi party canapés and Sushi platter contain seafood.
- Rush Hour 2 (2001): only Hong Kong egg tarts is seafood-free. Siu mai and Red Dragon casino prawns contain prawns.

These entries remain pending. Claude owns poster-briefs.json; no dish names or source briefs were changed.

Batch 3 adds Aliens, The Breakfast Club, Pretty in Pink, Planes, Trains and Automobiles, Dumb and Dumber, Groundhog Day, The Big Lebowski and Night of the Living Dead.

- The Fifth Element (1997) remains pending: Flying noodle boat noodles requires oyster sauce in the brief method; the other main is crab. Claude needs to revise a main to exclude seafood ingredients.
- Superman (1978) remains pending: the image service returned no artwork, HTTP 400 moderation_blocked at output, category other, request 5dbaa438-e71d-413f-a993-6e26d0812da3. No rejected image is counted as complete.

### Coordinator Lane 2 batch, 15 October 2026

All ten pending titles in the batch have reviewed A4 posters and exact canonical menu copies: Lethal Weapon 3, Con Air, Under Siege, Dragnet, Back to the Future Part III, E.T. the Extra-Terrestrial, Predator, Alien, Blade Runner and Spaceballs. All JPEGs are below 1 MB. Dish names and descriptions were visually reviewed against the export; the Part III shop sign was corrected and missing footer lines on Lethal Weapon 3 and Dragnet were added through image editing. The built-in image generator produced the artwork and lettering; JPEG conversion changed format and compression only.

Josh clarified during the batch that seafood should remain exactly as Claude wrote it. Con Air, Under Siege and Alien were returned to this batch and completed with their source recipes unchanged. Earlier seafood holds in every lane are superseded, including Die Hard, Rush Hour 2, The Fifth Element and Beetlejuice.

After this batch, checked totals are 124 complete and 584 pending. Lane completion counts are 31, 30, 20, 12 and 31. Next coordinator batch: Lane 1's earliest pending films, now including the previously held seafood menus. Superman's image-service rejection remains a technical blocker. Always run the audit after pulling before selecting the batch.
