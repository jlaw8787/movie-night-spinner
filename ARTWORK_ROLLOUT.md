# Movie menu artwork rollout

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
