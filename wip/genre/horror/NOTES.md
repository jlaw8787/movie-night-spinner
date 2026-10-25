# Horror genre menu (pilot)

Venue: the Last Light Diner, Route 13, mile 66. An all-night roadside diner during a storm. The film is "the late show" playing on the set behind the counter. Two faces at 816x1056: a front cover and a back menu.

Display face: League Gothic, used for the neon sign, the title and the section heads. Body: Libre Franklin (dishes, prices, kickers) and Source Serif 4 (notes, captions). Signature: Homemade Apple, used once ("Dot, nights").
FONTS.md line to add, since this task was limited to this folder: `genre-horror: League Gothic`

Palette: storm black #0d1014, neon red #c42f27 / #ff4b3e (the sign glow), bone paper #ebe6d8.

## Front
- The neon sign is pure type with a glow. Kicker: "Route 13 / Mile 66 / Open all night". The "Est." line uses the film's year.
- Behind it, the film's own image is blurred and darkened, so it reads like rain on glass.
- If a still exists, it runs full width (728x396) in a paper mat with a red frame. The title, tagline and D go below it.
- If there is no still, the poster sits on the left as a taped-up bill (284x441). The title, year and tagline sit on the right, with D under "Tonight's picture".
- Storm notice slip (a typographic prop). Footer: "Doors lock at 3:00 a.m.", "Form 13-YY".

## Back
- Dark band with "THE MENU" in neon. A small framed image sits in the band: the second still, or a crop of the poster ("Left in booth four").
- Two balanced columns use the venue's own sections. COURSE_LABEL horror is replaced as follows: s Before Midnight, m The Night Shift, w The Pie Case, d Behind the Counter.
- Prices come from a hash of the dish name, and the cents are always the film's year (6.84 for 1984).
- Props: an "Order up when" slip carrying the showtime cue (f.P), and the night cook's note with her signature.

## Robustness
- Title: titleSize() estimates the size for 2 to 60 characters (3 lines on the poster layout, 2 on the still layout). horrorFit() then steps it down until it fits its box.
- Menu: horrorFit(root) works through 10 levels. It shrinks padding first, then type down to dish 26 / note 20, then drops the cook's note. Below that are emergency levels for 13 to 16 items, which go under the rule 4 sizes (minimum 15px). The last level hides the notes. Run it after fonts and images load.
- Missing stills: falls back to the poster layout. Missing poster: the frame stays empty and dark (not tested).
- Checked with the kit overflow logic. All 7 proofs pass: no spill, minimum 14px.

## Proofs
C.H.U.D. (still), An American Werewolf in London (long title), Night of the Living Dead (no recipe file, so the films.json menu is used), IT (2 characters), The Silence of the Lambs, Halloween, plus a stress card (60 character title, 16 items). Only 2 of the 57 horror films have stills, so most will use the poster layout.

## Known weak spots
- On five-item menus the back has about 300px of empty column above the props. The roomier first fit level did not close the gap.
- Images are TMDB only. The Wikimedia search was rate limited, so there is no public domain storm photo.
- The template uses stills[0] blind, which could be a title card.
- Integration needs the Google Fonts link and HORROR_ASSETS pointing at paper-grain.png.
