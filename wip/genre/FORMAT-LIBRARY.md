# Format library (owner, Oct 26: "They all still look too similar" then "Format library by venue")

Layout is tied to the film's VENUE (data/film-flavour.json "venue"), not its genre. Each format is a real printed object from that kind of place, with its own shape, size, structure, display face, material and signature piece. A film gets the format that best matches its venue, then its own logo (in colour), poster colours, stills and flavour writing on top. Genre only sets mood.

All rules in GENRE-BRIEF.md and wip/print/STYLE-LOCK.md apply (readable sizes, rule 25 no flat art, at least 40 percent hero still, logos in colour, no spill, no brands, family films alcohol-free, no dashes).

| id | real object | faces (px) | structure and signature |
|---|---|---|---|
| newspaper | newsstand lunch counter front page | 2 x 816x1056 | masthead, banner logo, front-page photo (pilot: wip/genre/hero) |
| diner | all-night diner menu | 2 x 816x1056 | neon sign, booth photo, pie case (pilot: wip/genre/horror) |
| placemat | family restaurant placemat | 1 x 1344x960 | big photo, word game, admit-one (pilot: wip/genre/kids) |
| bartab | dive bar menu and running tab | 2 x 528x1056 | chalk-black card, tab ledger, coaster |
| canteen | school or office canteen tray card | 1 x 1056x816 | tray compartments as sections, timetable strip, lunch ticket |
| galley | ship or spacecraft galley ration card | 2 x 672x1056 | technical grid, deck plan photo panel, ration stamps (type only) |
| banquet | palace or castle banquet bill of fare | 2 x 816x1056 | gilt border, crest panel from a still, courses in procession |
| candybar | cinema candy bar board | 1 x 1344x816 | lightbox photo, combo boards, ticket stubs |
| takeaway | takeaway menu folded into a box lid | 2 x 1344x816 trifold | numbered dishes, delivery panel, fortune slip |
| campfire | camp or scout mess card on kraft | 2 x 672x960 | kraft card, trail photo, badge row as type |
| saloon | frontier saloon bill of fare | 1 x 816x1344 | wood-type poster, wanted-style photo frame |
| tiki | tiki bar fold-out | 2 x 600x1200 | bamboo and lagoon photo, drink list hero, island map of stills |
| bistro | bistro card for two | 2 x 672x960 | cream card, specials board photo, reservation card |
| hotel | grand hotel room service folder | 2 x 672x1344 | crest, door-hanger order, suite photo |
| airline | in-flight meal card | 2 x 600x900 | route strip, seat number, window photo |
| dining car | railway dining car menu | 2 x 600x1056 | route timetable, carriage photo, ticket punch (type) |
| stadium | stadium concession scorecard | 2 x 1344x816 | scoreboard, section map of stills, ticket |
| truck | food truck menu board | 1 x 1344x960 | truck side photo, chalk prices, order window |
| home | home kitchen: recipe card plus fridge note | 2 x 816x1056 | recipe cards on a fridge photo, family note, magnet list |
| invite | party or wedding invitation menu | 2 x 600x900 | invitation card, RSVP, place card |
| precinct | police precinct breakroom file | 2 x 816x1056 | case file folder, evidence photo, duty roster |
| lab | lab or base mess clipboard | 1 x 816x1056 | clipboard sheet, specimen photo, access badge |
| tavern | fantasy inn or tavern parchment | 1 x 816x1056 | parchment, map photo, wax seal (photo, never drawn) |
| tearoom | department store holiday tearoom | 2 x 672x1056 | festive tearoom card, window display photo, gift tag |
| cafe | coffee shop chalkboard menu | 1 x 1056x1344 | chalkboard, counter photo, loyalty card |
| motel | roadside motel and road trip card | 2 x 816x600 postcard pair | postcard front photo, back menu, room key tag |
| club | nightclub or casino card | 2 x 600x1200 | black gloss, VIP card, stage photo |
| prom | school dance or party night card | 2 x 600x900 | gym banner, photo booth strip of stills, ticket |
| kiosk | beach or surf kiosk board | 1 x 1344x960 | beach photo, board prices, surf report strip |
| pub | Australian country pub counter meal board | 1 x 1056x1344 | blackboard specials, pub verandah photo, raffle ticket |

Balance: no format over 60 films; a genre's films should spread across at least 4 formats where venues allow.

## Look guideline: pivot to the film (owner, Oct 26: "Superbad and Analyze This are very different but both comedy, so they need their own style, structure and feel")
Genre never decides the look. Each film gets three choices, made from its own venue, era and feel:
1. format: the venue object above that fits this film's place.
2. era: one of 1930s-40s, 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, modern. Sets type pairing, print process (letterpress, offset, photocopy, laser, glossy), paper and colour handling.
3. tone: one of gritty, glossy, warm, eerie, playful, grand, tender, tense, scrappy. Sets wear level, contrast, photo treatment and copy voice.
Every format must render clearly differently across eras and tones (type pairing, paper stock, border, photo treatment, wear), so two films sharing a format still look like different printed objects. Example: Superbad gets prom, 2000s, scrappy (photocopied party flyer energy, marker, cheap stock); Analyze This gets banquet or bistro, 1990s, glossy-tense (hotel ballroom card, embossed, mob formality).
Owner can override any film's three choices at proof time.
