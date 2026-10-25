# Genre menus: locked brief (round 2, Oct 26)

The 75 era films have one-off printed menus. The other 775 films show a shared "lobby" card (poster plus a small menu list). This round replaces that with one printed-menu template per genre theme (data/films.json "theme": hero, kids, fairytale, horror, diner, romcom, uptown, cop, xmas, teen, scifi, aussie, adventure, wizard, street, galaxy, western, asian, soul, deli, redsauce, tiki, philly, pizza, mex).

## Rules (all of /home/claude/polish/wip/print/STYLE-LOCK.md applies, adapted)
1. Each theme is a REAL printed menu from a venue that genre's films would share. The venue type is fixed per theme; the film fills it. Examples: horror: an all-night roadside diner menu in a storm; hero: a city newsstand lunch counter menu with a front-page panel; kids: a family restaurant kids' menu placemat (no crayons clip art); xmas: a department store tearoom holiday menu; western: a frontier saloon bill of fare; scifi: a starport or ship galley card; romcom: a bistro card for two.
2. Per film, the template pulls: title, year, tagline, the four courses (data, with dish names and notes), the showtime cue, the TMDB poster (TMDB_POSTERS) and, when present, real TMDB stills from data/film-stills.json (backdrop paths, use w780 or w1280). The hero image is a still where one exists, else the poster. Never a drawn picture.
3. Rule 25 hard ban: no flat vector or clip art. Decoration is type, rules, borders, paper texture and real images only (stills, posters, public domain photos or engravings per theme, credited).
4. Readable when printed: sizes from STYLE-LOCK rule 4 (dish 26 to 30px, description 20 to 22px, nothing under 14px at 96 dpi on a US Letter 816x1056 face). Two faces where the menu needs it.
5. Robust: titles from 2 to 60 characters, 1 to 4 items per course, notes up to 120 characters, missing stills. Text must never spill past a face; shrink-to-fit or wrap rules, tested with kit/overflow_check.py logic.
6. Distinct: each theme gets its own palette, display face (not in wip/print/FONTS.md, add a line "genre-<theme>: Face"), border and layout. No shared skeleton across themes.
7. Movie pull: the theme's venue carries the genre feeling; film-specific winks come from the data (notes, cue, tagline) and the stills.
8. No real brands or real restaurants. Kids, fairytale and family themes are alcohol-free (rename drinks if the data has alcohol and flag it). No song lyrics. Never em or en dashes.

## Process
- Pilot first: hero, kids, horror. Each builds wip/genre/<theme>/: template.js (a function genreCard(f, menu, poster, stills) returning face HTML, inline styles only, no head CSS classes), harness.html that renders it for 6 sample films from that theme, PNG proofs of those 6, and NOTES.md (venue, face, palette, how it handles long titles and missing stills).
- One build, one self-check at full size, one fix. Report in under 150 words.
- Owner approves the pilot proof before the other 22 themes are built, and approves again before anything goes live.
