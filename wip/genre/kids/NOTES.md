# Genre pilot: kids (69 films)

Venue: Pip's Family Kitchen (made up), a family restaurant's printed kids' placemat. Landscape placemat, one face, 1344x960.

Face: Fredoka 700 for display (add "genre-kids: Fredoka" to wip/print/FONTS.md, I was told not to edit outside this folder). Body is Nunito 600/800. Both load from Google Fonts. The app has to load them before this template goes live.

Palette: placemat red #e5392c, sky blue #1f6fd1, sunshine yellow #ffc93c, navy ink #1d2a52, on a warm white #fffaf0 stock with the shared paper grain (assets/era/_shared/paper-grain.webp). The border is a red and white check band with a yellow keyline.

Layout (fix round): a full-width blue masthead with the film title in huge white type with a hard red offset, a yellow and red rule, and a NOW SHOWING year sticker over the edge. On the left is the hero TMDB still (590x302, about a third of the placemat) as a framed print with the film synopsis as its caption. Under it are a type-only word search and a second, smaller still. On the right are the tagline as a red display line, then a two-column menu (pill labels, dish and price on one line, the film note under it), then an Admit One Kid showtime cue ticket and a Clean Plate Club tick card. Paper texture: the shared grain plus procedural fibre noise and soft mottling (SVG feTurbulence, no pictures), printed into the masthead and props too. Nothing is drawn.

Stills: pickStills() keeps stills 1280px wide or more, no-language ones first, in TMDB order. The hero is the first and the second print is the next. If a film has no usable still, the poster goes in the hero frame, and the second print is skipped.

Prices: snacks 3.50 / 4.25, mains 6.95 / 7.50. The treat and the drink carry the film's year (2.95 and 1.95 for 1995).

Long titles: the title is sized by length (104 down to 52px), wraps to at most 2 lines inside the masthead, and genreFit() steps it down if needed (36px minimum). Wallace & Gromit (46 characters) sits at 52px over 2 lines.

Menus with a lot of text: tiers() works out dish and note sizes from how much text there is (28/21, 26/20, 24/18). Two balanced CSS columns hold the courses. After mount, genreFit(face) takes 1px steps down to a 16px floor. As a last resort it clamps notes to 2 lines, then to 1 line. Checks: all 6 proofs pass with no spill or clipping. A stress face (4 items per course, 120-character notes) does not spill but needs the 1-line note clamp, so it reads cramped. 16-item menus are not a realistic case.

Alcohol: the kids data is already dry (ginger beer, root beer, punches). A safety map swaps wine, beer, champagne, cocktail and spirits for kid versions anyway. FLAG: Who Framed Roger Rabbit's drink note ("the bottle in Eddie's desk drawer") points at Eddie's whiskey. The words are clean but the wink is adult, so the data should get a new note.

Proofs (2x): Ratatouille (stills), A Goofy Movie (stills), Toy Story (no stills entry), Wallace & Gromit: The Curse of the Were-Rabbit (long title), E.T. (many items: the exact menu plus the full S/M/W/K lists, 8 dishes), Up (2-character title).

API: template.js sets window.GENRE.kids = {card, fit, size}. card(f, menu, poster, stills, {tag, cue, root}).

## Per-film lift (Oct 26)
template.js now also takes opts.logo (data/film-logos.json), opts.palette (data/film-palette.json) and opts.flavour (data/film-flavour.json).
- Masthead: the film's real TMDB logo (w500, at most 140px tall, drop shadow) next to the flavour venue name and its sign. genreFit() samples the logo on a canvas. A dark logo switches the masthead to light stock. A logo that fails to load falls back to set type.
- Colours: the palette accent sets the checker border, course pills, tagline, word search frame and photo frames. A grey or pale accent falls back to the genre blue. The label colour is darkened until it reaches 4.2:1 on white. The masthead is the accent at 50% black.
- Flavour: the character note sits in the hero print margin, signed in Caveat (the one script use). Winks feed the word search (names first), the second still's caption, the prop and the fine print. The prop (ticket, stub, badge, tag, slip, receipt, card) is a type-only paper object. The number goes into the form number, and a 2 or 3 digit number also sets the first main's price (62 gives 6.20).
- No flavour (Ratatouille, A Goofy Movie): Pip's Family Kitchen, the synopsis caption and a Clean Plate Club card. Logo and palette still apply.
- Extreme menus: after the 1-line note clamp, notes are dropped altogether, so dish names and prices always fit.
- Still open: Who Framed Roger Rabbit's drink note (Eddie's desk drawer bottle) needs a rewrite in the data. Its flavour venue "Ink and Paint Club" is a nightclub, which is also worth a look for a kids' placemat.
