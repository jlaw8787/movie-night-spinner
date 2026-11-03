# Second independent review, 3 Nov 2026

Overall: 7.2 out of 10 (first review was about 6.3). A fresh agent with no prior context scored 43 screenshots and clicked through the live site at 390px and 1440px.

## Scores

1. First impression and visual identity: 8
2. Brand consistency: 7
3. Printed menus: 7
4. Phone experience: 6.5
5. Core flow (spin, menu, shopping, cooking): 6.5
6. Galaxy Video store: 8.5
7. Polish and craft: 6.5
8. Accessibility basics: 7

## Fix list, ranked by impact

1. Done (3 Nov). Below 600px a menu with more than one page shows one page per screen: swipe, tap a dot or use the arrow keys to turn. Tapping opens the full size view at fit to width, one page at a time, with pinch zoom, swipe and Previous/Next buttons, and it refits when the phone turns. Landscape pages get a "turn your phone sideways" hint. Also fixed: a tap on a phone opened two viewers stacked on top of each other (old phone-only zoom removed).
2. Done (3 Nov). The phone text menu is now a clean recipe index: always Starters, Mains, Sweets, Drinks, no poster, no dotted leaders or prices (those stay on the printed menu), and each dish has a clear "How to make it" button with a chevron that opens the method. Method layout itself is item 3.
3. Done (3 Nov). Prep sheet methods are left aligned, one numbered step per line with its time as a tag, ingredients as a list (two columns where there is room), and Make ahead on its own line. No-heat dishes (drinks, tartare) say "Takes X" instead of prep and cook, and waiting is named from the recipe ("then 6 hr to cool and chill"). Litres print as "1 L". The phone recipe index shows the method as numbered steps too. The A4 print copy keeps the same steps in a compact run-on form so a full menu still fits one page at the old type size.
4. Done, reversed. The reviewer flagged poster art on menus, but Josh wants posters, so they are back on for every menu (3 Nov). Keep the "Poster and stills: TMDB" credit.
5. Uneven menu quality. Wall Street left panel muddy and empty, right panel dead space. Repeated filler ("Fries, hot and salted, by the basket", "Bottomless coffee") across films, takeaway lucky numbers near identical. Minimum fill per format (no panel over about 15% empty), ban stock filler lines across the set, better fallback image treatment.
   Progress (3 Nov): the generic house standards (Fries, Bottomless coffee, Bread and butter, Tea or coffee) are gone from all 810 shared-layout menus. Each film now has its own table item and drink with a film-tied note (data/film-house.json), only shown where they fit without hiding any of the film's own dish notes (173 films checked, 61 take none). Takeaway lucky numbers are drawn per film. Stock venue notices (hours, delivery, room service) are worded per venue. Bistro menu box reclaims the blank band under the photo. Saloon worn paper texture no longer bleaches the poster and type. Motel postcards used to hide every dish note at once when the menu ran long (21 of 70 notes showing); they now drop house lines first, then trim notes one at a time from the bottom, and every dish stays (motel and bistro now show 208 of 210 notes). The tiki band and the campfire and airline outliers checked out fine by eye (measuring quirks). Still to do: the fallback image treatment. Seen for item 6: "Premonition French 75" breaks across lines on the Final Destination airline menu.
6. Done (3 Nov). Automated overflow check run on all 900 printed menus (clipped, cut off, ellipsis, squashed, overlapping text). 50 real hits found and fixed: every printed menu now runs a fit pass that shrinks one-line text (subtitles, heading tags, stamp names) in small steps, never under 65%; decorative tags that still will not fit step aside instead of showing half a word; italic diner tags got room for their slant; venue notice variants can never be longer than the line they replace; the takeaway "Movie night for two" box gives the title full width; two over-long signs shortened (Demolition Man, Alien: Romulus). "BLUE BEETL" was already fixed. The 437 overlap flags were checked by eye across samples and are deliberate design (script headings over rules, tilted tags, stacked lines), not faults. Rerun with the scratch overflow script before the third review.
7. Done (3 Nov). Read the real prices off all 810 shared menus. Six layouts mixed whole and decimal prices on one menu (a "whole number once it hits $10" rule in campfire, tiki and saloon; dropped cents on round numbers in bistro, hotel and airline); all now print cents every time. Sides above mains was mostly the generic house lines (Arthur bread and butter), now gone; course price bases already keep sides under mains. Not done: matching prices across sequels (MIB fries 5.95 vs MIB II 7.40), low impact.
   Folding menus (Josh, 3 Nov): all 42 fold menus checked for text across a crease on the real page. Takeaway inside headline held to its own panel and wraps to two lines; tiki fold-outs nudge any dish row off the crease (type steps down slightly if needed, no dish dropped). Print maths confirmed: trifolds fill the A4 width so folds land on exact thirds, tiki fills the height. 0 of 42 with text on a fold.
8. Done (3 Nov). Candy bar now sits on the box office deco fan wall in deep red with a gold hairline (Memphis confetti carpet gone). Every navy box (count bar, results, empty hint) is cinema red with gold edges; the count bar hides when empty. "Or find a film by what you're craving" is bigger with gold rules either side and fits on one line on a phone. Popcorn box sits inside the board frame. Orphaned "Photo credits" is now a small right-aligned "Snack photo credits" link (also covers that part of item 15).
9. Pink focus ring in the cinema (.quick-mute:focus-visible #ff3d6e, index.html about line 1438): scope to #viewShop. Settings is a cream sheet that matches neither brand: restyle like the welcome dialog (dark panel, deco heading, gold controls), proper minus sign on the guest stepper, the three buttons on one row or stacked full width.
10. Desktop wastes space and hides Spin below the fold at 1440x900. Cut the marquee to about 320px on desktop so the wheel hub shows on load, fill the empty right column under the curtain (stubs or checklist beside the wheel), lay the member card out with the specials board beside it.
11. Curtain replays on every film pick, and Menu of the week fights the spun film. Full curtain only on a spin, search and store picks crossfade under half a second. Shrink the weekly banner once a film is chosen.
12. Phone store sticky search bar wider than the panel, aisle sign peeks under it. Match width and radius to the panel, soft bottom shadow, same purple.
13. Hire case opens scrolled past its title (focus goes to See the menu). Focus the heading with preventScroll, or pin title and buttons.
14. Keyboard and tap targets: focus drops to body after a keyboard spin and the result is not announced; the full size menu DIV is tabbable before a menu exists; no skip link; tabs 40px and How it works 20px. Move focus to the result heading and announce "Now showing: X", remove the preview from tab order until a menu shows, add a skip link, all targets 44px.
15. Craft slips: orphaned slashes in prep stats ("/ LONGEST 1 HR 15 MIN / PLUS"), "6 to / 8" wrap on Walkabout Creek, "creme fraiche" vs "crème fraîche", Wall Street text menu lowercase starts, orphaned "Photo credits" label on the candy bar, 22 Jump Street and Ace Ventura in Crime and Mob. Stats as chips, non breaking spaces in time ranges, one ingredient spelling, sentence case, review aisle tags.

## Known, deferred

- Candy bar hero photo and store aisle photo are AI generated. Fine as placeholders, need real photos for 9.5.
- Real sweets packaging shots on the snack counter: fine for a home tool, check before a public launch.

## Do not touch

The gold bulb wheel and pointer, the marquee letter board, the strongest menus (Godfather Part II Havana card, Walkabout Creek Hotel, Oda Mae's Reading Room, Mean Streets Tony's), the hire case, rental receipt, staff picks, all copies out covers, $2 Tuesday stickers, member card, the candy bar Make it / Buy it split and craving idea, the prep sheet shopping list by aisle with guest scaling, the welcome dialog copy.

Note: blank purple in the full page store screenshots is lazy shelf rendering, not a bug.
