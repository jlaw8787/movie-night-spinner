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

## Per-film lift (Oct 26)
genreCard(f, menu, poster, stills, {logo, palette, flavour}) takes the extras from data/film-logos.json, film-palette.json and film-flavour.json. Any of them can be missing.
- Venue and sign: flavour.venue goes in the neon sign, fitted to one line between 52 and 118px. flavour.sign goes in the kicker above it. The diner subline and "open all night" stay. With no flavour (C.H.U.D., Beetlejuice) it falls back to Last Light Diner.
- Logo: the TMDB w500 logo sits in the title spot. horrorFit reads its opaque pixels on a canvas (TMDB sends CORS headers) and keeps it only if the mean luminance is 0.3 or more, otherwise the set type stays. Tall logos shrink until the block fits. Night of the Living Dead's dark logo falls back to type.
- Accent: the poster accent drives the rules, prices, frames, kickers and neon glow when its luminance is 0.05 to 0.24 and its saturation is 0.3 or more. Otherwise the genre red is used (IT's drab accent fails, for example). The neon text is lightened until it reads on black.
- Note: becomes "Left on the counter" with the character's script signature.
- Winks: 0 goes in the front still caption, 1 the band card, 2 the back still, 3 the storm notice, 4 the back fine print ("Overheard at the counter").
- Prop: a type-only slip, badge or receipt over the hero's top-left corner.
- Number: goes in "Form No." on both faces. 2 digits become the cents of the first drink, 3 or 4 digits the price of the first main (Halloween 19.63).

## Owner tweaks (Oct 26, locked)
- Pictures: the front still's picture area is 744x470, 40.6 percent of the face. The back still runs full width across the top at 792x296 (27 percent), grows up to 470 tall when the menu leaves room, and carries the neon "THE MENU". The small band card and back filler photos are gone. Continued faces get one 240 tall still.
- Venue world: rain on the window glass over the blurred view of the film (rain-glass.png). The venue sign is neon tubes on a dark raceway with a bright core, coloured halo and the tube's shadow, and one dead tube per sign. The back is a laminated menu in a stitched vinyl sleeve with hairline scratches, rubbed edges and a sheen (laminate-wear.png). Both textures are painted by paint.py as light and wear only, with no pictures or icons, in the same class as the house paper grain.
- Logos: shown in their own colours on a plate. horrorFit reads the logo's luminance and uses a light enamel plate for dark logos (Night of the Living Dead) or a dark glass plate for light ones (Werewolf, Halloween). Set type appears only if the logo is missing or fails to load. Logos are capped at 318 wide so the year clears the storm notice.
- Captions never name a scene. The front reads "Channel 13, the late show", the back "The window booth at {venue}, after midnight". Winks only appear where no picture sits: the storm notice and the "Overheard at the counter" fine print.
- shot.py now also flags anything in the front text column that runs past its column (this caught the Halloween year).

## Known weak spots
- Still picking is blind, so a still can be dark or off-tone. Night of the Living Dead's band still is a murky close-up.
- The stress card's continued faces have no stills, because its synthetic id has no stills.
- Some poster accents are muted (Halloween brown), so their neon glows weakly.
- On short menus the column split can leave about 200px empty under the shorter column (Silence). The still can't grow into it because the longer column already needs the height.
- The sign kicker repeats the venue when flavour.sign equals flavour.venue (Werewolf).
