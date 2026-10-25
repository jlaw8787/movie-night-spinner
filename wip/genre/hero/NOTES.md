# Hero genre menu: pilot notes (fix round 1)

## Venue
"The Daily Special", a city newsstand lunch counter that prints its menu as a newspaper. Two faces, US Letter 816x1056:
- Front page: blackletter nameplate, ears (Lunch Edition, Weather: "Clear skies. Look up."), dateline (VOL. yy, No. year, Five Cents), red EXTRA! kicker, film title as the banner, tagline as the deck, a TMDB still across the full width (about a third of the page) captioned "SCENE OF THE ACTION" with f.D. Below the fold: "A word from the counter", a note built from the tagline and the film's own main, sweet and drink, signed "Sal" in script. Next to it, a STOP PRESS box carries the showtime cue.
- Prop: a LATE EDITION slip, type only, tucked over the photo corner ("Hot off the grill, Full menu inside, 5 CENTS").
- Page 2: folio header, a second still across the top ("ON THE BEAT"), then the menu as sections A to D in three balanced columns. Prices are lunch counter prices, and the first main carries the film year as its cents (Batman 7.89).
- Page 3 only appears if the menu can't fit page 2 (stress test only). It gets a third still and "Continued" lines.

## Faces and palette
- Display: Oswald 700 (banner, section heads), 500 (dish names, prices). Nameplate: UnifrakturMaguntia. Text: Source Serif 4. Signature: Homemade Apple.
- FONTS.md: `genre-hero: Oswald` added. League Gothic went to the horror pilot.
- Palette: newsprint #f2ecde, ink #1b1a17, spot red #c3241a. Paper is CSS only: SVG grain, vignette and a fold line.

## Stills
data/film-stills.json comes sorted no-language first, then by votes. The pick is the first two entries that are 1280px or wider, landscape (aspect 1.55 to 2.4) and have no language, served at w1280. If there are no stills at all, the poster shows uncropped (contain) in the same frame. No drawn art.

## Robustness
- Title: one line up to 104px; anything longer goes on two balanced lines capped at 76px. 60 characters tested.
- Front: the photo height adapts (240 to 430) to the headline, caption, note and cue lengths.
- Page 2 fit is deterministic: Oswald widths measured against canvas, plus a 16px margin. The type steps down 28/20 to 24/18 and the photo 360 to 210 before anything moves to page 3. Dishes are never dropped.
- Spill check (text past the face, or into the footer): 0 issues on all proofs and edge cases.

## Files
- template.js: `genreCard(f, menu, poster, stills)`. Pass the edition tagline and cue in f.T and f.P. The returned HTML starts with a Google Fonts `<link>`.
- harness.html: open `http://localhost:8795/wip/genre/hero/harness.html` (`?i=N` for one film, `?test=1` for edge cases).
- Proofs: spider-man-2, batman-1989, doctor-strange-mom (50 char title), superman-1978, black-panther, and winter-soldier-many-items (16 dishes, stress, runs to page 3). Each has a -page2.

## Known weak spots
- TMDB's top-voted "stills" are often key art (posed group shots, sometimes on white), not scenes. A per-film still index override would fix the worst ones.
- The counterman's note follows one sentence pattern for every film. It reads fine, but it's generic.
- The front no longer lists dishes. The menu lives on page 2, and the front points to it.
