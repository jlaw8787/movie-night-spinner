# Hero genre menu: pilot notes

## Venue
"The Daily Special", a city newsstand lunch counter that prints its menu as the front page of a newspaper. Blackletter nameplate, ears (Lunch Edition, Weather: "Clear skies. Look up."), dateline (VOL. yy, No. year, Five Cents), red EXTRA! kicker, film title as the banner headline, tagline as the deck, the film image as the front-page photo, courses run as newspaper sections A to D, showtime cue as a LATE BULLETIN box. Prices are lunch counter prices; the first main always carries the film's year as its cents (Batman 7.89, Superman 7.78). Fine print: "Form DS-<year>".

## Faces and palette
- Display: League Gothic (banner, section heads, dish names, prices). Nameplate: UnifrakturMaguntia (the venue's sign). Text: Source Serif 4.
- FONTS.md line to add (not added, I was told to work only in this folder): `genre-hero: League Gothic (UnifrakturMaguntia nameplate)`
- Palette: newsprint #f2ecde, ink #1b1a17, spot red #c3241a. Paper is CSS only: SVG turbulence grain, soft vignette and a fold across the middle.

## Format
Single US Letter face 816x1056. A second face ("Page 2, continued from page 1") is added only when the menu cannot fit the front.

## Images
- Still in data/film-stills.json: first landscape still (w >= 1200, aspect > 1.5, no language) at w1280, spanning two of three columns, captioned "SCENE OF THE ACTION" with f.D. Lead column runs beside it, the other two sections run under it, bottoms balanced.
- No still: TMDB poster (w780) runs down a left column like a front-page photo, captioned "NOW SHOWING", with the bulletin box under it; menu in the right column, overflow under the poster.
- Only 2 of 87 hero films have stills (both Spider-Man era films), so the poster layout is the one most hero films will get.
- No drawn art anywhere. Decoration is rules, type and paper.

## Robustness
- Title: one line up to 110px (90 on the still layout); longer titles split into two balanced lines capped at 76px. 60 characters tested.
- Menu fit is deterministic (character-width estimates, checked against real canvas widths, they run a little wide) plus a 12px margin. Order of retreat: type tiers 30/21 down to 26/19 (STYLE-LOCK sizes), smaller photo or poster, narrower poster column, a 24/18 squeeze tier, the cue moves to a slim strip above the fine print, then Page 2.
- Missing tagline, cue, poster and still are all handled. Notes are sentence-cased and dashes are swapped for commas.
- Checked with a harness spill test (text past the face, or menu running into the footer): 0 issues across the 6 proofs plus 2 edge cases (60 char title with 2 dishes, 16 dishes with 120 char notes).

## Files
- template.js: `genreCard(f, menu, poster, stills)`. Pass the edition tagline and cue in f.T and f.P. The returned HTML starts with a Google Fonts `<link>`. The app's font loader may want those three families too.
- harness.html: open `http://localhost:8795/wip/genre/hero/harness.html` (`?i=N` for one film, `?test=1` adds edge cases).
- Proofs: spider-man-2 (still), batman-1989 (no still), doctor-strange-mom (50 char title, cue strip fallback), superman-1978, black-panther, winter-soldier-many-items (16 dishes, stress, plus -page2).

## Known weak spots
- The poster layout's picture is about 16 to 20 percent of the face, not a third (rule 14). The big banner headline carries the front, but the picture is smaller than the bar.
- Page 2 has no picture (rule 12). It only shows up on the synthetic stress test; no real hero menu has more than 5 dishes.
- No character note or props beyond the ears and bulletin box. The template is shared, so per-film winks come only from the data.
- The single "best still" pick for Spider-Man 2 is key art, not a scene. Use a hand-picked still index per film if wanted.
