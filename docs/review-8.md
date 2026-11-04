# Eighth review: the table kit

**Overall: 6.5 out of 10**

The table kit (door sign, place cards, intermission card) still looks the part. Twenty-one door and intermission styles, real stills, place cards built as the film's own props: Fargo's police report, Goodfellas' visitor pass, Coneheads' identity card, the Breakfast Club detention slip. The best of them sit comfortably next to the printed menus.

What holds it back is that the kit was built before the overhaul and none of the overhaul's rules reached it. The menus now get the alcohol-free pass, the furniture fixes, the "no cut words" rule and Print through a finished PDF. The kit gets none of those. The biggest problem is mechanical: one long guest name pushes the second column of place cards off the page.

Tested with Playwright and real Chrome at 1440x900 and on a 390x844 phone. Kit data was read for all 900 films. 59 films were built and checked by script for overflow, menu match and alcohol, then 24 were screenshotted page by page. The real Save PDF and Print buttons were captured for Gremlins, Psycho, The Fifth Element and Fargo, and Gremlins on the phone, with the PDFs rendered back to images. Kids' mode was run over every kid-safe film, and Vegetarian over 150. Screenshots are docs/review-8-01.png to review-8-12.png.

## Scores

| Area | Score |
|---|---|
| 1. Look and film feel | 9 |
| 2. Print (Save PDF and Print) | 5 |
| 3. Place cards: cutting and folding | 5 |
| 4. Wording | 7 |
| 5. Matches the menus after the overhaul | 6 |
| **Overall** | **6.5** |

### 1. Look and film feel: 9
Strong. Fargo's King of Clubs neon, Goodfellas' notice with the "Approved" stamp, Jurassic Park's parchment, Newsies' Lodging House Gazette, Men in Black II's terminal, Coneheads' fridge door, Planes, Trains and Automobiles' Braidwood Inn sign. The upside-down tent backs with a still behind the venue name are a nice touch. Two styles let it down. Horror puts red type straight over a photo, so Psycho's "Do not come alone" line and "Dessert is served" can't be read (06). On the board style, the "Last night" polaroid sits on top of long film titles (Once Upon a Time in America, 07).

### 2. Print: 5
- **Print is the old path.** Menus now print a finished PDF (printPdf). The kit's Print button still calls the browser's own print. On a phone this sends the live page to the browser's print sheet, which the menus moved away from.
- **Print starts before the photos load.** In the Print output, three of Gremlins' six tent backs are blank navy with a broken-image mark. Save PDF has all six (01, right vs left).
- **Print leaves white edges.** Print copies sit on a 792x1118 box scaled onto A4, so every page has a white strip down the right and along the bottom (01, right). The menus fill the page edge to edge.
- **Save PDF carries no print settings.** Menu PDFs open at actual size. The kit's PDF has no PrintScaling None, so a printer that shrinks to fit will make the place cards a little smaller than drawn.
- **Ink.** Most place card pages are solid dark from edge to edge (camp green, neon black, festive green, Airplane navy). That is six photo panels plus a dark background, all to be cut up. The menus already have an ink-friendly Prep sheet.

### 3. Place cards: cutting and folding: 5
The fold works: the back half is upside down so the tent reads right from both sides, and no text sits on the dotted fold. The trouble is the grid.
- **One long name breaks the page.** The two columns are `1fr 1fr`, which grow to fit their content. "Alexandra Fitzgerald-Hughes" widens the left column, and the right column is squeezed or pushed off the page. Gremlins and Miller's Crossing lose the right half of every right-hand card, in both Save PDF and Print (01, 12). Coneheads' and The Fifth Element's right cards are about two thirds as wide as the left, with "Beldar Conehead,.." and "Member since" wrapping (02). The Muppets Take Manhattan's right tickets wrap to five lines and lose the seat row (04). Short names on narrow cards get clipped at the top ("Jordan", "Bo" on Airplane! and Bugsy, 10). Cards also end up different sizes, so they don't stand as a set.
- **The cut guide disappears on dark pages.** The dashed cut lines are #999 and the "Cut around each card" line is #555. On camp, neon and festive pages both are close to invisible (10).
- **The count is wrong on the dialog.** With three names it says "4 place cards", but the page prints six (two blank, 11).
- Long names shrink only by length. "Alexandra Fitzgerald-Hughes" is cut on Goodfellas', Jurassic Park's and Splash's badges ("Fitzgerald-Hu", 01, 08).

### 4. Wording: 7
Most lines are good: "Reward: supper at Leo's club", "Proceedings will stop for fifteen minutes", "Chapter the second". The misses:
- **Departures cuts words.** The airline and dining car board truncates with dots: "Trans Ame...", "Boardi...", "Mid fl...", "Delaye...", "Leeloo's dirty ma..." (05). The menus' rule is no cut words.
- **"Half time" on every board intermission**, including Muriel's Wedding and Once Upon a Time in America (09). It is a footy word, fine for a pub film and odd for a wedding or a 1930s back room.
- **Tiki for a greengrocer.** Splash's door reads "Aloha, welcome to Bauer Fruit and Vegetable" between tiki torches, and the break is a "Luau break". That is a Manhattan produce wholesaler (08).
- **Wanted poster for a gangster club.** Miller's Crossing's intermission says "The saloon will close for fifteen minutes" (12).
- "Doors at" is written three ways: a drawn line, "Doors at ______" in underscores (letterboard, terminal, arcade), and on camp nothing after it at all.
- Camp and roadside intermissions drop the drink line. Every other style shows it.

### 5. Matches the menus after the overhaul: 6
The kit takes dessert and drink from the menu itself (first sweet, first drink), and across the 59 films they are always on the card. But the overhaul's fixes stop at the card.
- **Kids' mode and family films leak alcohol.** The kit never runs the alcohol-free pass. With kids' mode on, the card is dry but the kit still says Splash "Blue lagoon" (08), Three Amigos! "El Guapo's margaritas", The Mask "Coco Bongo cocktail", Coneheads "Mass quantities lemon shandy jug", Top Gun "frozen lemon shandy slushie", GoldenEye's note "The vodka is on me", Casablanca's "the champagne is on the house". Where the card renames a drink, the kit keeps the old name (Home Alone 2 "Hot apple cider", Miracle on 34th Street "mulled cider").
- **Furniture review 7 fixed on the menus is back on the place cards.** The `card` prop draws a bank card with a chip and "Member since". So Muriel's Wedding's place cards are "Wedding invitation ... Member since 1994" and The Godfather's are "Wedding seating card ... Member since 1972" (03). That is the same slip as Muriel's loyalty card titled "Wedding Invitation" in review 7.
- **Vegetarian doesn't reach the kit's own notes.** On a vegetarian night the kit still says "nobody touches the beef" (The Untouchables), "the brisket's been going since breakfast" (Once Upon a Time in America), "The turkey's resting" (Spider-Man) and "rib eye with the executives" (The Secret of My Success). The card has none of those words.
- **The kit ignores the dish picks.** If Director's cut leaves the dessert unticked, the intermission card still serves it.
- On hand-built menus, the kit's venue often isn't the menu's. 20 of the 59 named a venue the printed menu never shows (The Corleone kitchen, The McCallister House, The Visitor Centre Dining Room). Most are fair calls from the film, so this is a check rather than a fault.
- 12 films use a `stub` prop the kit doesn't know, so they quietly fall back to the ticket.

## Fix list, ranked by impact

1. **Fix the place card grid.**
   Where: `.kit-tents` in index.html.
   Wrong: a long name widens one column and pushes the other off the page (01, 12), squeezes cards (02, 04) and clips short names (10).
   Good looks like: `grid-template-columns:repeat(2,minmax(0,1fr))`, every card the same size, and names shrunk to fit the card's real width (fitLines on each page), never cut. A check with a 30-character name on every prop kind.

2. **Run the alcohol-free pass and the diet swaps on the kit.**
   Where: kitPages / openKit.
   Wrong: kids' mode and family films print margaritas, cocktails, shandy, vodka and champagne on the kit while the card is dry (08). Vegetarian notes still name beef, brisket and turkey.
   Good looks like: kidsDryDom on every kit page; kit notes go through the same swap the card's notes do, or drop on a veg night; add the kit to the browser check's kids' mode test.

3. **Print through the finished PDF, like the menus.**
   Where: the kit's Print button.
   Wrong: browser print, white edges (01), blank photos when it fires early (01), and the phone gets the browser's print sheet.
   Good looks like: build the kit PDF and send it to printPdf; set PrintScaling None on the kit PDF too.

4. **Stop the furniture that doesn't fit.**
   Where: kitProp `card`, departures, board intermission, tiki and wanted styles.
   Wrong: bank cards with "Member since" for weddings (03), cut words on the departures board (05), "Half time" on weddings (09), "Aloha" on a Manhattan greengrocer (08), "the saloon" for a gangster club (12).
   Good looks like: invitations and seating cards get an invitation layout (no chip, no member line); departures cells shrink or wrap, never cut; board intermission says "Intermission" unless the film is a pub or sport film; tiki and wanted only for films that are tropical or western.

5. **Follow the dish picks.**
   Where: kitBits.
   Wrong: an unticked dessert or drink still shows on the intermission card.
   Good looks like: the first sweet and drink still ticked; no line when none are.

6. **Make the cut guide visible and go easier on ink.**
   Where: `.kit-tent`, `.kit-cut`, the place card page background.
   Wrong: cut lines and the instruction line vanish on dark pages (10); full dark pages to cut up.
   Good looks like: place card pages on white or the film's light paper, with the dark kept to the card faces; cut and fold lines that contrast with whatever they sit on.

7. **Fix horror and board legibility.**
   Where: `.hr-*`, `.kb-pol`.
   Wrong: red type on photos (06); the polaroid over long titles (07).
   Good looks like: a dark band behind horror text; the polaroid moves aside or shrinks when the title runs two lines.

8. **Small items.**
   One "Doors at" style, a drawn line everywhere. Camp and roadside intermissions show the drink. The dialog counts the cards it prints ("6 place cards, 2 left blank for writing in"). Handle the `stub` prop. Check hand-built venues against the printed menu.

## Genuinely good, leave alone

- The 21 styles and how they are picked: genre first, then venue, so a genre never looks all the same.
- Props as place cards: police report, visitor pass, detention slip, Mogwai care tag, Bates Motel docket.
- Tent backs upside down with the still and venue, and no text on the fold.
- Dessert and drink pulled live from the menu, so they always match the card.
- Save PDF: all pages, real fonts, stills loaded, A4, sensible file name and message.
- No em or en dashes and no script errors in anything built.

## Fixed after the review

- Fix 1, place card grid (4 Nov): two fixed, equal columns. A long name shrinks to fit its own card, or goes onto two lines when that reads bigger, and never widens the column. Card footers keep a gap. A still that the browser refuses as a cross-origin load gets one plain retry, so no tent back prints empty. Checked on every prop kind with "Alexandra Fitzgerald-Hughes" and "Christopher Montgomery".
- Fix 2, alcohol-free and vegetarian (4 Nov): the kit runs the card's dry pass in kids' mode, alcohol-free and on family films (Splash's blue lagoon is now a blue lagoon mocktail, Three Amigos!'s margaritas a lime slushie). On a vegetarian night, a kit note that still names meat or fish is left off. The browser check's kids' mode test now opens the table kit on every layout too.
- Fix 3, Print (4 Nov): Print builds the same PDF as Save PDF and sends it to the printer the way the menus do (a new tab on phones). Pages fill edge to edge with every photo in. The kit PDF opens at actual size, one-sided.
- Fix 4, furniture (4 Nov): wedding invitations and seating cards print as paper invitations, with no chip and no member line (Muriel's Wedding, The Godfather). Other cards say Member since, Valid from or Issued to suit. The departures board wraps and sizes its cells instead of cutting words. Board intermissions say Half time only for pubs, taverns and stadiums. Aloha and Luau break only show for tropical venues (Splash now reads "Welcome to Bauer Fruit and Vegetable"). The saloon line only shows for saloons (Miller's Crossing: "Supper stops for fifteen minutes").
- Fix 5, dish picks (4 Nov): the intermission card serves the first sweet and drink still ticked, and drops the line when none are.
- Fix 6, cut guide and ink (4 Nov): place card pages print on white on every style. Only the cards carry ink, and the cut, fold and instruction lines are dark enough to see.
- Fix 7, legibility (4 Nov): horror text sits above the still, with a dark band behind the small lines (Psycho, C.H.U.D.). The board sign's polaroid pins below the chalkboard, clear of the film's title.
- Fix 8, small items (4 Nov): "Doors at" is a drawn line on every style. Camp and roadside intermissions show the drink. The dialog counts the cards it prints ("6 place cards, 3 left blank to write in"). The `stub` prop already falls back to the ticket, which suits it. Hand-built venues were checked and left as they are.
