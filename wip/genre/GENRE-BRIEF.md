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

## Per-film lift (owner, Oct 26: "do they get their own individuality and movie theming?" then "Full per-film lift")
Every genre template must also use, per film:
- data/film-logos.json: the film's real TMDB title logo (w500 or original) as the headline where the layout has a title; fall back to set type when missing or unreadable on the background.
- data/film-palette.json: {dark, accent} sampled from the poster, used for the accent rules, label bars and headline colour, keeping the genre's paper and layout. Check contrast; fall back to the genre palette if accent is too light or too close to paper.
- wip/genre/flavour/out/*.json (merged later into data/film-flavour.json): venue, sign, note {text, by}, winks (3 to 5), prop {kind, title, lines}, number. The venue name and sign replace the generic genre venue name; the note is the character note with a script signature; winks go in fine print, captions and the prop; number goes into a price or form number.
Result: same genre system, but each film reads as its own place.

## Owner tweaks on the pilots (Oct 26, locked for all genres)
- Bigger, bolder pictures: the hero still fills at least 40 percent of the front face; the second still at least 25 percent of its face. Fewer, larger photos beat many small boxes. Captions must not describe a specific scene unless that still was chosen for it.
- More movie world: push the genre's venue look harder (materials, signage, real-photo textures) so it feels like a place, not a template; the film's logo, colours and flavour sit on top.
- Logos in colour: show the TMDB title logo in its own colours (no black-ink recolouring). Put it on a panel that suits it (dark or light) so it reads.

## Owner ruling on logos (Oct 26, 14:04): "I would be happy with logos, movie logos or whatever"
The film's own TMDB title logo is always allowed, even when it carries a studio mark (Disney, Marvel, Pixar). Prefer the logo over set type. Formats must make it read: pick a light or dark panel to suit the logo, never black-ink recolouring. The no-brands rule still covers everything else on the menu.
