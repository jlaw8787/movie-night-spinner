# Fourth independent review

**Overall: 8 out of 10**

Movie Night Spinner is a properly crafted thing. The cinema front is lush, Galaxy Video is a genuinely fun second world, and most printed menus look like real objects from inside the film. What holds it back from a 9 is not design. It is a handful of visible bugs and, more importantly, places where the printed menu, the phone text menu and the Prep sheet disagree with each other about what dinner actually is.

Tested with Playwright and real Chrome at 390x844 (phone, touch, 2x) and 1440x900 (desktop). Every finding below was checked against a screenshot, not just the DOM. Screenshots are in this folder (files numbered 01 to 19).

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 8 |
| 4. Phone experience | 8 |
| 5. Core flow (spin, menu, shopping, cooking) | 7 |
| 6. Galaxy Video store | 9 |
| 7. Polish and craft | 7 |
| 8. Accessibility basics | 8 |
| **Overall** | **8** |

### 1. First impression and visual identity: 9
The marquee photo, the art deco wheel with its bulb ring and the red velvet curtain land immediately. On phone the marquee, tab bar and the Spin button all sit in the first screen. The welcome pop-up is short and clear (three steps, one button). During a spin the marquee letters tick through the film names as the wheel passes them, which is a lovely touch. The only thing that dims it slightly is that the desktop wheel area has a lot of dead dark space under the controls before a film is picked.

### 2. Brand consistency: 9
Clean separation. The cinema is maroon, gold and Jost/deco display type; Galaxy Video switches the whole frame to purple with gold, teal and pink, its own chunky display font, its own logo, and even the shared tab bar recolours. The rental slip, hire case and member card are all Galaxy. The candy bar uses red and yellow with Oswald, which reads as a cinema concession rather than a third brand, so that works. Nothing from Galaxy bleeds into the box office or the reverse.

### 3. Printed menus: 8
Checked 18 films across 16 layouts: Wall Street, The Godfather, Superman (newspaper), Dick Tracy (club), Deadpool (bar tab), Thor: Ragnarok (stadium), Captain America: Civil War (airline), Shaun of the Dead (pub), Up (tea room), Train to Busan (dining car), Kingpin (saloon), Black Widow (motel), The Incredibles (placemat), Avengers: Age of Ultron (invite), Guardians of the Galaxy (galley), Matilda (canteen), plus Babe, Dumbo, The Dark Knight, TMNT and Big Hero 6 from spins.

The best ones (Godfather, Wall Street, Deadpool, Superman, Shaun of the Dead, Kingpin, Train to Busan, Guardians) are excellent: right era, right venue, real wit, and details that hold up (Deadpool's running tab actually adds up: 124.75 carried over plus the three back-page items is 163.50). Marks off for:
- Text truncated mid-sentence on the printed card itself (Avengers R.S.V.P. box, Matilda canteen strip and dish notes).
- Black Widow's desktop preview clips the bottom of page two.
- Dick Tracy's prices are on two different scales on the same card.
- Landscape layouts (Thor, Black Widow page two) are unreadable at preview size; the viewer fixes it, but only if you know to tap.

### 4. Phone experience: 8
Strong. The printed menu sits first, swipes page by page, and the dots, "Swipe to turn, tap to zoom" hint and the full size viewer (Fit, plus/minus, Page 2 of 2 arrows, swipe, Escape returns focus to the menu) all work. The big-type text menu underneath, with Starters/Mains/Sweets/Drinks tabs and "How to make it" drop-downs, is the right answer to tiny print. Choose dishes and the shopping list are comfortable to tap. Marks off: on wide single-page layouts (Incredibles, Matilda, Dumbo) the "left side" crop includes a sliver of the right column, so the first thing you see is cut-off words; the Menu of the week card squeezes the title onto three lines on phone; landscape pages open tiny in the viewer.

### 5. Core flow: 7
Spin, result, menu, Prep sheet, Choose dishes, shopping list: the mechanics are smooth and the Prep sheet is genuinely useful (time chips, make-ahead notes, aisle-sorted list, totals that update when you tick). But the three views of a film's dinner do not always agree:
- **The Godfather:** the printed menu and phone text menu say Antipasto wedding style, Arancini, Rigatoni Sunday gravy, Veal scaloppine, Cannoli, Espresso, Blood orange soda, Chianti, Anisette. Choose dishes offers "Wedding antipasto" and "Connie's wedding antipasto" (the same dish twice), "Golden arancini", "Clemenza's Sunday sauce", "Ricotta & pistachio cannoli" and "Clemenza's cannoli" (twice again), "Fried calamari" and "Sicilian orange and fennel salad" (never printed), and a "Chianti sangria". Espresso and Anisette are missing.
- **Wall Street:** the card prints nine dishes; Choose dishes offers seven. Parker House rolls with cultured butter and the Bluestar espresso tonic are not offered at all.
- **Dick Tracy, Matilda, Up:** Choose dishes offers a dish that is not on the printed card (Tracy's diner pot roast, Harry Wormwood's car yard chilli dogs, Paradise Falls shredded chicken arepas).
- Ticking an untested printed dish (Sushi platter) adds unquantified lines to the shopping list ("sashimi salmon", "cucumber") and leaves the hands-on time unchanged. It is labelled "From the menu", which is honest, but the list then mixes "300g eye fillet" with "sashimi tuna" and no amount.

The owner's rule (five tested recipes by default, the film's other printed dishes offered unticked) is sound. The data just does not follow it everywhere yet.

### 6. Galaxy Video store: 9
This is the most delightful part of the site. Shopfront photo with the Galaxy sign, member card you sign by typing your name (it renders as a signature and embossed name), the price board ($2 Tuesday flagged "On tonight"), the walk-in aisle photo with clickable signs, aisles with face-out tapes, rating dots, "All copies out" stickers on new releases, staff picks with handwritten cards, a Melbourne Cup aisle on Cup Day, the Late Show curtain. The hire case (tagline, drop-cap blurb, staff tip, tonight's menu, trailer TV, barcode, Weekly sticker) and the rental slip (member number matches the card, due date, change from a $10 note, blue hire case with the cover in the sleeve, "Be kind please rewind" stamp, counter add-ons) are top-shelf. Only nit: on desktop the card placeholder "CLICK TO ADD YOUR NAME" is clipped to "CLICK TO ADD YOUR NA".

### 7. Polish and craft: 7
The craft level is high, which makes the slips stand out more:
- A raw template string is printed on the candy bar: `${tapWord("Tap something on the board to see which films serve it.")}` shows as literal text under the craving board.
- Truncated text on printed cards (Avengers, Matilda).
- Black Widow desktop preview clipped.
- "WEEKLYS" on the Galaxy price board (should be "WEEKLIES").
- "cilantro" in The Incredible Hulk's guacamole, where the rest of the site is Australian (chilli, capsicum).
- Some dish notes are place notes, not descriptions ("Rio street beef pastéis: The hillside favela in Rio de Janeiro").
- Two wheel wedges can read the same ("Jumanji" twice) with no year to tell them apart.
- Once, after Spin a combo jumped to the box office, the wheel showed only the gold rim and bulbs with no wedges for a few seconds. A second run painted correctly, so it is intermittent.

### 8. Accessibility basics: 8
Good foundations. First Tab shows a clear "Skip to the wheel" link and Enter lands focus on Spin. Every control in the box office has a visible focus ring (gold outline, 2 to 3px). Enter on Spin spins, and focus moves to the "Now showing" live region, which announces the film. Dialogs trap and return focus; the full size viewer has labelled buttons and a live page counter. Tab order is logical except that Menu of the week (visually top right) comes after Settings. The TMDB logo link in the footer has no accessible name (announced as just "link"). Sound is on by default, so the first spin plays audio without asking. Printed menus have very small type, but the phone text menu and the viewer give a readable route.

## Fix list, ranked by impact

1. **Make Choose dishes match the printed menu (core flow).**
   Where: Prep sheet, Choose dishes, starting with The Godfather, Wall Street, Dick Tracy, Matilda and Up.
   Wrong: dishes offered that are not on the card, printed dishes not offered, and the same dish listed twice under different names (Godfather antipasto and cannoli).
   Good looks like: one dish list per film. Every printed dish appears in Choose dishes under its printed name; the five tested recipes are ticked; nothing appears that is not on the card. Add a build check that fails if a chooser name has no match on the card or a card dish has no chooser entry.

2. **Fix the literal template text on the candy bar.**
   Where: app.js line 2088, the empty state under the craving board.
   Wrong: the string uses single quotes, so `${tapWord("Tap something on the board...")}` is printed raw.
   Good looks like: use a template literal (backticks) so it reads "Click something on the board to see which films serve it" on desktop and "Tap..." on phones.

3. **Stop printed cards cutting text mid-sentence.**
   Where: Avengers: Age of Ultron R.S.V.P. box ("Also on the list: Everyone trying to lift the"), Matilda's period strip ("Bruce Bogtrotter and the", "A newt in the Trunchbull's") and its dish notes ending in "...". Check every film on the canteen and invite layouts, since these are shared.
   Good looks like: copy written to fit the box, or the box grows. A printed menu should never end a line with "..." or a dangling "the". Add a check that flags any text node whose scrollHeight exceeds its box.

4. **Fix the Black Widow desktop preview clipping.**
   Where: box office preview at 1440 wide, motel layout with two stacked pages.
   Wrong: the preview height stops short, so the last drink line and the key card are cut off with a dark band underneath. The full size viewer and phone are fine.
   Good looks like: preview height equals the scaled card height for stacked layouts. Check every two-row layout (Thor is the other one).

5. **Sort out Dick Tracy's prices.**
   Where: Club Ritz card.
   Wrong: canapés 35.00, cheese puffs 45.00, pickle chips 40.00, lemon meringue pie 25.00, gimlet 45.00, but Big Boy's spaghetti 1.25.
   Good looks like: one consistent 1930s scale (cents or low dollars) across the whole card, like the Godfather and Superman cards already do. Worth a quick scan for any card where the largest price is more than about 30 times the smallest.

6. **Quantify untested dishes or keep them off the main list.**
   Where: Prep sheet shopping list after ticking a "From the menu" dish.
   Wrong: lines like "sashimi salmon" and "cucumber" with no amount sit among measured lines, and the time chips do not change.
   Good looks like: either give them rough quantities for the guest count, or put them in their own "Buy to taste for the extras" group so the main list stays exact.

7. **Land the spin result with the Menu and Prep tabs in view on desktop.**
   Where: box office, after a mouse spin at 1440x900.
   Wrong: the page scrolls so the menu top sits at the very top edge and the Menu / Prep sheet tabs are just above the fold, so the way to the shopping list is hidden.
   Good looks like: scroll to the tab row (with a little breathing room), not the card.

8. **Clean the left/right crop on wide single-page menus on phones.**
   Where: inline swipe preview for The Incredibles, Matilda, Dumbo.
   Wrong: the left half shows a sliver of the right column ("Parr", "DUMB", "Dumbo, the magic fe"), which looks broken before you swipe.
   Good looks like: split at the layout's column gutter, or fade the far edge so the cut reads as a deliberate peek.

9. **Footer and small accessibility fixes.**
   Give the TMDB logo link an accessible name ("TMDB"). Move Menu of the week before the wheel controls in the DOM, or after the result, so Tab order follows what you see. Consider starting with sound off, or muting until the first deliberate tap on the speaker.

10. **Small copy and layout nits.**
    "WEEKLYS" to "WEEKLIES" on the Galaxy price board. "cilantro" to "coriander". Replace place notes posing as dish descriptions with real descriptions (Hulk's pastéis). Show the year on the wheel when two wedges share a title (Jumanji). Fix the desktop member card placeholder clipping. Give the phone Menu of the week card a smaller title or a two-line clamp.

11. **Watch for the blank wheel after Spin a combo.**
    Seen once: after the candy bar combo jumped to the box office, the wheel canvas showed no wedges for at least four seconds. A second run was fine. Worth a forced repaint when the box office view becomes visible.

## Genuinely excellent, leave alone

- The marquee: real photo, film name set in the letter board, and the letters ticking through titles while the wheel spins.
- The wheel itself: brass rim, bulbs, deco pointer, readable labels on every wedge colour.
- The best printed menus: The Godfather (Louis'), Wall Street, Deadpool's running tab, Superman's Daily Planet, Shaun of the Dead's Winchester, Kingpin's barn bill of fare, Train to Busan's timetable, Guardians' galley sheet. These feel like props from the film.
- The full size viewer: Fit, zoom, page arrows, swipe, a turn-sideways hint, and focus going back to the menu on close.
- The phone big-type text menu under the printed card.
- Prep sheet structure: time chips, make-ahead notes, aisle-grouped shopping list, totals that update live.
- Galaxy Video end to end: shopfront, member card signature, price board, aisles, staff pick cards, hire case, rental slip and blue hire case. Do not touch.
- The candy bar craving board with film counts, and Spin a combo landing straight on a matching film.
- Skip link, focus rings and the "Now showing" live region.

## Fixed straight after the review

- Raw "${tapWord(...)}" text under the candy bar craving board (fix 2): a quoting slip from the 3 Nov Tap/Click change. Fixed 3 Nov.
- Note: "Weeklys" is Josh's chosen spelling and stays.
- Fix 1, Choose dishes matches the printed card (3 Nov): the chooser is now built from what the card actually prints. Extras appear only when the card shows them (hand-built menus like The Godfather add none; shared layouts add the one or two that fit), dishes use the card's own names ("Antipasto, wedding style"), and house lines are listed as "house standard, served as is" without a tick box. Checked in the browser across all 900 films: 0 mismatches. Two recipes renamed to their card names (Crocodile Dundee barra, The Rock room service). New test: tests/menu-chooser.test.cjs.
- Fix 3, text cut mid-sentence (3 Nov): the invite R.S.V.P. box now drops its "Also on the list" line when it does not fit instead of cutting it (Age of Ultron); the canteen timetable strip keeps a whole phrase from each wink or uses the plain subject, never a fragment like "Bruce Bogtrotter and the" (Matilda). All 87 invite and canteen menus checked on the real page: no clipped text. Dish notes that still end in "..." are by design (kept at four words or more rather than cut to a stub).
- Fix 4, Black Widow page two cut off (3 Nov): not reproducible on screen. With the preview fully in view the whole page shows (last drink, fine print, key card). The dark band only appears in a screenshot taken while the bottom edge sits at the screen edge, before the browser has painted it. No change.
- Fix 5, Dick Tracy prices on two scales (3 Nov): the 1930s club price list gives small items in cents (35 means 35¢) and mains in dollars (1.25), but whole cents printed as "35.00". Now 35¢ canapés, 45¢ gimlet, 1.25 spaghetti. Cafe and motel cents eras checked, already consistent.
- Fix 7, desktop spin lands on the tabs (4 Nov): after a spin on desktop the page now glides to the Menu / Prep sheet tab row with 12px of room above it, not the card top. Checked at 1440x900: tabs sit fully in view.
- Fix 9, part (4 Nov): the TMDB logo link has an accessible name. Menu of the week tab order and starting with sound off are left for Josh to call.
- Fix 10, part (4 Nov): "cilantro" is "coriander" everywhere (70 lines, the Chili's brand name kept). When two wedges share a first title the wheel shows the subtitle instead ("Welcome to the Jungle" and "Jumanji: The Next Level"). Desktop member card placeholder now reads "Add your name" and no longer clips. "Weeklys" stays.
- Fix 6, untested extras on the shopping list (4 Nov): anything a ticked extra dish needs that a measured recipe already buys merges into the main list; everything else goes in its own last group, "For the extras, buy to suit", so the aisle lists above stay exact. Checked on Ghost and Wall Street (sushi platter, Carl's cheeseburger). Time chips for extras stay "From the printed menu, buy to suit" since they have no tested times.
- Fix 8, wide pages on phones (4 Nov): in each half view, words the edge cuts badly are hidden (measured on the words themselves, not their box), and the cut edge fades out so it reads as a peek at the other half. Checked on The Incredibles, Matilda and Dumbo. The full size viewer and printing are unchanged.
- Fix 9, tab order (4 Nov): checked, no change. Menu of the week sits at the top of the right column on desktop and after the wheel on phones, and Tab already follows that order (wheel and its controls, then the right column).
- Fix 10, rest (4 Nov): Hulk's pastéis note now names a moment, not a place ("what Bruce grabs in Rocinha on the way to the bottling plant"). The other film notes are the Easter eggs and stay. The phone Menu of the week title is held to two lines and drops to 18px for long titles.
- Fix 11, blank wheel (4 Nov): the wheel now resizes and redraws whenever its canvas changes size or the box office view comes back, so a wheel sized while hidden can't stay blank. Checked: candy bar to box office draws straight away, no resize loop.
