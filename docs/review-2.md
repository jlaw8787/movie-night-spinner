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

1. Phone printed menu unreadable, full size viewer opens cropped. Below 600px show one panel per screen as a swipe carousel with dots. Open the viewer at fit to width, allow pinch zoom, swipe between panels.
2. Text menu under the printed menu doubles up and looks unfinished. Dotted leaders with no price, category names change by film, "How to make it" looks like body text, poster still shown. Make it a clean recipe index (no leaders, fixed four category names, clear button with chevron, no poster) or fold it into the Prep tab.
3. Recipe method hard to cook from. Justified paragraphs with big gaps, times buried inline, "cook 1 hr" on a drink that is chilling, "1l" reads as 11. Left align, one numbered step per line with the time as a tag, ingredients as a list, chill or rest wording, write "1 L".
4. Some menus use actual poster art and credit "Poster and stills: TMDB" (Crocodile Dundee, Men in Black II, Crocodile Dundee II, The Last Dragon, Blue Beetle). Script check every film's menu art, swap to stills, credit "Stills: TMDB".
5. Uneven menu quality. Wall Street left panel muddy and empty, right panel dead space. Repeated filler ("Fries, hot and salted, by the basket", "Bottomless coffee") across films, takeaway lucky numbers near identical. Minimum fill per format (no panel over about 15% empty), ban stock filler lines across the set, better fallback image treatment.
6. Text overflow on bold display formats ("BLUE BEETL" clipped, "NO. 83 MOVIE NIGHT FOR TWO" squashed). Fit text on headline slots plus an automated overflow check across all 900 films.
7. Period prices inconsistent. Arthur 1981 bread and butter 11.50 above caviar blini 10. Wall Street mixes whole and decimal. MIB fries 5.95 vs MIB II 7.40. Price table per format and year (inflation index times dish tier), sides below mains, one number format per menu.
8. Candy bar leaks Galaxy style into the cinema: navy #130B28 panels, empty navy strip, Memphis confetti, clipped "OR FIND A FILM BY WHAT YOU'RE CRAVING", popcorn sticker breaks the frame. Swap to cinema deep red and the box office deco fan pattern, remove the strip, give the label room.
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
