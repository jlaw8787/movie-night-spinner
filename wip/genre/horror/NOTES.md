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

## Robustness (fix round, Oct 26)
- Stills: pickStills() keeps stills 1280 wide or more, puts no-language ones first, and keeps TMDB's order. The front hero is still 0 at 728x396, about a third of the face. The band card uses still 1, the filler uses still 2. The poster layout remains only as a fallback.
- Short backs: horrorFit reserves a full-width still band above the props (360 down to 200px) at the largest type that fits. If no band fits, the still goes under whichever column ends higher, provided it gets 200px or more. Night of the Living Dead (6 items) gets none.
- Long menus: type never goes below dish 26 / note 20. Sections split into 2-item chunks ("continued" header) and flow onto as many "The menu, continued" faces as needed. The stress card uses 2 of these.
- Title: titleSize() estimate, then horrorFit steps it down.
- Integration: load the fonts explicitly (document.fonts.load) before horrorFit, or it measures with fallback metrics. Set HORROR_ASSETS for paper-grain.png.
- Spill check (kit overflow logic): all 7 proofs pass, minimum 14px.

## Known weak spots
- Still picking is blind, so a still can be dark or off-tone. Night of the Living Dead's band still is a murky close-up.
- The stress card's continued faces have no stills, because its synthetic id has no stills.
