# Genre pilot: kids (69 films)

Venue: Pip's Family Kitchen (made up), a family restaurant's printed kids' placemat. Landscape placemat, one face, 1344x960.

Face: Fredoka 700 for display (add "genre-kids: Fredoka" to wip/print/FONTS.md, I was told not to edit outside this folder). Body is Nunito 600/800. Both load from Google Fonts. The app has to load them before this template goes live.

Palette: placemat red #e5392c, sky blue #1f6fd1, sunshine yellow #ffc93c, navy ink #1d2a52, on a warm white #fffaf0 stock with the shared paper grain (assets/era/_shared/paper-grain.webp). The border is a red and white check band with a yellow keyline.

Layout: left column is the picture. Middle is the title, the tagline and a two-column menu (Snacks, Mains, Treats, Drinks as pill labels, dish and price on one line, the film note under it). Right column is a word search (made from type only, words from the title and dish names, seeded per film) and a Clean Plate Club tick card. Along the bottom are a Tonight's Story card (f.D), an Admit One Kid showtime cue ticket and the fine print. Nothing is drawn: no crayons, no icons, no characters.

Pictures: if the film has stills in film-stills.json (>=1200px wide), the template uses two framed photo prints (w1280 and w780). If not, it uses the TMDB poster (w780) in one big print frame. Only 2 of the 69 kids films have stills (Ratatouille, A Goofy Movie), so nearly every kids menu will be the poster version.

Prices: snacks 3.50 / 4.25, mains 6.95 / 7.50. The treat and the drink carry the film's year (2.95 and 1.95 for 1995).

Long titles: the title is sized by length (78 down to 48px), wraps to 2 lines and stops before the year badge. genreFit() shrinks it further if it still overflows (36px minimum). Wallace & Gromit (46 characters) sits at 54px over 2 lines.

Menus with a lot of text: tiers() works out dish and note sizes from how much text there is (28/21, 26/20, 24/18). Two balanced CSS columns hold the courses. After mount, genreFit(face) takes 1px steps down to a 16px floor. As a last resort it clamps notes to 2 lines, then to 1 line. Checks: all 6 proofs pass with no spill or clipping. A stress face (4 items per course, 120-character notes) does not spill but needs the 1-line note clamp, so it reads cramped. 16-item menus are not a realistic case.

Missing stills or poster: poster mode first. If there is no poster either, the title goes on a blue type panel.

Alcohol: the kids data is already dry (ginger beer, root beer, punches). A safety map swaps wine, beer, champagne, cocktail and spirits for kid versions anyway. FLAG: Who Framed Roger Rabbit's drink note ("the bottle in Eddie's desk drawer") points at Eddie's whiskey. The words are clean but the wink is adult, so the data should get a new note.

Proofs (2x): Ratatouille (stills), A Goofy Movie (stills), Toy Story (no stills entry), Wallace & Gromit: The Curse of the Were-Rabbit (long title), E.T. (many items: the exact menu plus the full S/M/W/K lists, 8 dishes), Up (2-character title).

API: template.js sets window.GENRE.kids = {card, fit, size}. card(f, menu, poster, stills, {tag, cue, root}).
