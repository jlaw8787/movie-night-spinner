# Twenty-fourth independent review

**Overall: 9.0 out of 10**

Most of what earlier reviews asked for has held on the live site. After Hours prints "TERMINAL BAR" on one line (10). Ratatouille, Ghostbusters and When Harry Met Sally print with no white bar along the bottom (05, 11). Sixteen Candles and The Wedding Singer print at the same pink tone as the screen (09). Chicken Run's meal voucher now prints turned as one piece (17). The campfire signatures on E.T., Evil Dead II, IT and The Last Jedi are whole on screen and on paper (06, 07). Fonts, html2canvas and jsPDF all come from reeldinner.com, app-mode.js and app-art.js are not loaded, Add to calendar says "Calendar file saved" and hands over a clean .ics, and locking in never asks for notification permission. Galaxy Video's phone tool row is fixed: the search box reads "Ask the counter" in full and nothing covers the aisle signs (13). The rigged sequel landing on Die Hard 2 is lovely: the marquee reads DIE HARD 2 and the series card offers "Start with Die Hard" and "Plan a marathon" (01). No page or console errors, no sideways scroll.

What holds it under 9.5 is mostly something no local check could see. The live site carries a Netlify "Powered by Netlify" badge, fixed to the bottom right corner at 201 by 64 px, on every screen. On the phone it sits over the wheel, the menu tabs, Print, Lock in, the Guests + button and the Galaxy Video aisle chips, and on desktop it covers the corner of every menu card (01, 02). Tapping it opens an ad for building your own site. Beyond that: Back to the Future prints a white bar along the bottom, the same fault Ratatouille had (03); kids' mode leaves Ratatouille's "Bordeaux, 1947 ... Ask the sommelier" on the card and on paper (04); and the hand-built menus still lean on film nods where the shared layouts now describe the food (05).

Tested with Playwright and Google Chrome against the live site https://reeldinner.com (which matches b952e83), at 390x844 (touch, 3x, iPhone user agent) and 1440x900 (2x), service workers blocked, Australia/Brisbane time, clock fixed at Sat 14 Nov 2026, 5:30pm. Every finding was checked against rendered pixels; the PDFs were read with pdftoppm at 60 to 300 dpi. Screenshots are docs/review-24-01.png to review-24-18.png. In the side-by-side shots the order is screen, then the real Save PDF pages.

## How it was tested

- First load on phone and desktop: hosts contacted, bytes transferred, scripts and fonts requested, console and page errors, sideways scroll.
- The spin: a real click on Spin with the wheel's pool rigged to Die Hard 2 for one spin, watched mid-spin and after landing, plus a normal spin on desktop (School of Rock).
- Save PDF, the real path: exportMenu('pdf','menu') with the download caught and read, for 37 films on desktop and 3 on the phone:
  - Hand-built: Home Alone, Die Hard, Jurassic Park, Back to the Future, Ratatouille, Ghostbusters, When Harry Met Sally, After Hours.
  - Campfire: E.T., Evil Dead II, IT, The Last Jedi, Peter Pan, Logan. Bistro: Ferris Bueller, Hitch, Luca. Invite: Sixteen Candles, The Wedding Singer. Canteen: Chicken Run, Matilda. Airline: Die Hard 2, Con Air.
  - One each of pub, saloon, tearoom, hotel, diner, takeaway, banquet, candybar, diningcar, tiki, bartab, motel, tavern and stadium (Shaun of the Dead, Tombstone, Ghost, Dirty Dancing, Men in Black, Gremlins, Beauty and the Beast, Scream, Speed, Moana, Fargo, Psycho, Hocus Pocus, Rocky).
- A scan of every PDF page for near-white rows across the bottom 20% and top 15% of a coloured page, each hit checked by eye, and an edge-pixel read for margin colour.
- Print: the real Print button (the PDF blob caught, phone opens a new tab), and browser print through fillPrint with print media, for E.T. and Die Hard 2.
- Lock in, the tonight strip and countdown, Add to calendar (dialog text, both .ics files, both Google links), and the shopping list (ticks, progress, share text, reset) on both sizes, with Notification.requestPermission watched.
- Galaxy Video: walk-in, shelves, sticky tool row, search, a tape's case, the rental slip, the request form labels, and every control under 44px listed.
- Kids' mode by the real Settings toggle on Die Hard 2, Home Alone and Ratatouille (screen and Save PDF), then a text sweep of the card and phone recipe text of every film for alcohol words, with the doubtful ones rendered off and on to compare.
- Dish notes read in full on 20 films.
- Accessibility basics: unnamed controls, images without alt, page language, keyboard focus ring.
- Node tests: `node --check app.js` and the 18 tests/*.test.cjs other than dialogs. All pass.

What I could not test: WebKit is not installed on this machine, so the iPhone 15 Safari check for a black box in place of the campfire signature was not run; Chrome on both sizes shows none. No real phones or calendars, so the .ics is read as text only. I did not submit the request form (it posts to Netlify), did not walk the Candy bar or the table kit, and did not run the repo's browser checks, as asked.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 9 |
| 4. Phone experience | 8.5 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 9.5 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9.5 |
| 9. Polish and craft | 8.5 |
| 10. Accessibility basics | 9 |
| **Overall** | **9.0** |

The straight average is 9.0. I have not rounded it.

### 1. First impression and visual identity: 9
The hero sign holds on the phone: the bulb rail runs unbroken from the crest to the right scroll, REEL DINNER reads as separate bulbs, and the dark right column above the bottom rail is clean (12). The wheel, marquee and "Tonight 14 Nov, 7pm · in 1 hr 30 min" strip all read well. Down from 9.5 only because the first thing in the bottom corner, on every load, is the Netlify badge, which is not part of the cinema.

### 2. Brand consistency: 9
Unchanged. Galaxy Video still keeps its own neon voice, and the cinema strip inside it is still the one carry.

### 3. Printed menus: 9
Held, checked by hand:
- After Hours: "TERMINAL BAR" on one line on both faces, clear of "BAR AND GRILL" (10).
- No white bar on Ratatouille, Ghostbusters or When Harry Met Sally (05, 11).
- Invite tone: Sixteen Candles and The Wedding Singer print the same dusty pink as the screen (09).
- Campfire signatures: E.T.'s letters keep their feet, Evil Dead II's "2" is whole, IT and The Last Jedi sign with the full logo (06, 07). Campfire pages 1 and 2 now print on the same surround colour (16).
- Chicken Run's voucher prints turned with its paper (17). Airline bezels print cream (18).
- Screen and paper match closely on all 37 films otherwise. The menus are real venues from the film, and the best of them (Lou's Cafe, Little Nero's, the Jurassic Park dining guide, Gusteau's) are a pleasure to read.

Marks off:
- **White bar along the bottom of Back to the Future.** Lou's Cafe prints a white strip about 3mm tall under the teal band, inside the cream margin, on desktop and phone Save PDF. On screen the teal runs to the card's edge (03). It is the fault Ratatouille had in review 21, on a hand-built menu nobody rechecked.
- **Diner menus take the A4 margin from the photo.** Men in Black's three pages print on cream, then black, then dark green, because pages 2 and 3 open with a dark photo at the top edge (08). Same root as the old campfire margin fault, in another layout.
- **A faint box under E.T.'s signature on paper.** The letters are whole, but at 300 dpi the rotated signature box shows as a lighter patch with a thin line along its bottom edge, right under the E (06). On screen there is no box. Low; most printers will not show it.
- A 1px pale hairline runs round the card's edge on landscape PDFs (Ratatouille, When Harry Met Sally, Ghostbusters). Low.

### 4. Phone experience: 8.5
No sideways scroll and no errors on any view. The lock-in dialog, calendar dialog and shopping list read cleanly (14).

Marks off:
- **The Netlify badge covers controls.** It is an iframe fixed at the bottom right, 201x64, z-index 2147483645, on every view. On the phone it sits over the wheel's lower right wedges, the menu's Starters to Drinks tabs, the Print button and half of "Lock in for this week", the Guests + button on the Prep sheet, and "Spin this aisle" and the aisle chips in Galaxy Video (01, 13). Tapping it opens a card asking you to build your own site with Netlify. Netlify adds the script after the closing html tag, so it is a site setting, not code in the repo.
- Carried, low: the Unwatched and Kids toggles in Galaxy Video are 48x28.

### 5. Core flow: 9.5
The rigged spin lands cleanly on Die Hard 2, the curtain lifts, and the series card is a neat touch (01). Lock in opens "Roll credits on the menu" with the showtime and Director's cut or The full feature. The strip reads "Tonight 14 Nov, 7pm · in 1 hr 30 min". Add to calendar says "Calendar file saved", downloads a valid .ics (one alarm 1 hr 10 min before for School of Rock; none when it is already past cooking time, as for Die Hard 2), and gives Google links with the right UTC times. On Die Hard 2 it says plainly that the eggnog is too late for tonight and offers to move to Sat 21 Nov. No notification prompt at any point. Shopping ticks count "2 of 43", share leaves out ticked items, reset clears. Held short of 10 for the untried .ics on real phones.

### 6. Candy bar: 9
Not walked this time. Held.

### 7. Galaxy Video store: 9
The shopfront walk-in, shelves, case, rental slip ("Due back Sat, 21 Nov, 7pm", "$10 note, change $8.00") and request form all work on both sizes, and the request fields all have labels. The phone tool row is fixed (13). Small mark: the aisle signs drawn on the shop photo are tap targets as small as 39x11 (Drama), 42x11 (Sci-fi) and 47x13 (Horror) on the phone. The chips below do the same job at full size, so low.

### 8. Table kit: 9.5
Not re-checked. Held.

### 9. Polish and craft: 8.5
On the shared layouts the dish notes now describe the food, and well: Con Air's "Thin beef in soy, brown sugar and smoked paprika, dried slow until chewy", Rocky's "Shaved rib eye and melted provolone in mini rolls", Moana's haupia, Gremlins' meringue-frosted Snow White cupcakes, Dirty Dancing's watermelon wedges with feta and mint.

Marks off:
- **Kids' mode keeps Ratatouille's wine.** The card and the Save PDF still print "La cave, The cellar: Bordeaux, 1947. A good Bordeaux · Ask the sommelier. Ego's order. Any good Bordeaux will do at home", and Anton Ego "Orders the '47 Bordeaux" (04). Bordeaux and sommelier are not on the kids' word list.
- **Kids' drinks that are still adult drinks, or say two things.** Kids' mode swaps beer and sparkling wine for "alcohol-free lager" and "alcohol-free sparkling wine" in the recipes (Fight Club, Notting Hill, Amélie, Four Weddings, Rudy), which are adult products, not kids' drinks. On Fight Club the card says "Ginger beer with a maple tea shot" while the recipe under it says "Cold alcohol-free lager". On Get Hard the name becomes "lime crush" but the line under it still reads "margarita with a salted rim". Rudy's recipe keeps "with beer onions".
- **Hand-built menus still describe where a dish is in the film, not the dish.** Ratatouille: "Linguini spilled it. Remy fixed it", "The old recipe Linguini was told to cook. Remy rewrote it", "Colette teaches, Remy tugs Linguini's hair" (05). Die Hard: the roast beef rolls' note is "Al Powell lives on snack cakes, you don't have to"; the limo nuts' is "nuts and a cold drink in the back of the limo". A few shared ones too: Luca's chinotto "Machiavelli is watching. He knows.", Peter Pan's Johnny cakes "Tick tock. The croc wants seconds.", Con Air's orange soda "Bunny on the seat, Poe headed home."
- **Luca's stew uses grape juice.** "Seafood simmered in tomato, garlic and grape juice with fennel" is on the adult card. White wine or stock would be the dish; grape juice in a seafood stew reads like a kids' swap that leaked (15).
- Small: Rocky's shopping list says "6 slices provolones"; Die Hard 2's says "1 tarragon".

### 10. Accessibility basics: 9
Every visible control has a name, every image has alt, the page is lang "en" and the focus ring is a clear 2px gold outline. Marks off: the Netlify badge sits over real controls and adds its own tab stops; the Save PDF is images only, so its text cannot be selected or read aloud (the Copy menu text button covers this); the small photo sign targets in Galaxy Video.

## Fix list

1. **Netlify badge over the site.**
   Where: Netlify site settings (the badge script Netlify injects after the closing html tag: /.netlify/scripts/hud?variant=public), not the repo.
   Wrong: a fixed 201x64 "Powered by Netlify" badge sits over the wheel, menu tabs, Print, Lock in, Guests + and Galaxy Video chips on the phone, and over the corner of every menu card on desktop; tapping it opens an ad (01, 02).
   Good looks like: no badge. Turn it off in the Netlify site settings, or move to a plan where it can be turned off. Recheck on the phone that the bottom right corner is clear.

2. **Kids' mode on Ratatouille.**
   Where: the Ratatouille hand-built template (formats, carte) and the kids' word list.
   Wrong: "Bordeaux, 1947", "Ask the sommelier" and "Orders the '47 Bordeaux" print on a kids' card and PDF (04).
   Good looks like: a kids' cellar item, say "Grape juice, 1947. Ask the waiter" and "Orders the house juice, and a sharp pen". Add bordeaux and sommelier to the kids' check.

3. **White bar along the bottom of Back to the Future.**
   Where: the lous template's export, or the same placement fault fixed for Ratatouille.
   Wrong: a white strip about 3mm tall under the teal band on page 1, desktop and phone (03).
   Good looks like: teal to the card edge, then the margin. Run the white-bar scan over every hand-built menu, not just the three from review 21.

4. **Kids' drinks.**
   Where: the kids' swaps for drinks in recipes and drink lines.
   Wrong: kids get "alcohol-free lager" and "alcohol-free sparkling wine"; Fight Club's card and recipe disagree; Get Hard's line still says margarita; Rudy keeps "beer onions".
   Good looks like: the recipe makes the same drink the card names, and it is a drink you would pour a child (ginger beer, sparkling apple or grape juice, lemonade).

5. **Dish notes on hand-built menus.**
   Where: Ratatouille, Die Hard and Home Alone templates, plus a handful of shared notes (Luca's chinotto and sardines, Peter Pan's Johnny cakes and barley water, Con Air's orange soda).
   Wrong: the note says where the dish is in the film, not what is in it (05).
   Good looks like: "Leek and potato soup with cream and chives. Linguini spilled it, Remy fixed it." What is in it first, the nod second, as the shared layouts now do.

6. **Diner page margins.**
   Where: exportMenu's edge colour for the diner layout's continuation pages.
   Wrong: Men in Black prints pages on cream, black and green (08).
   Good looks like: every page on the card's own surround colour.

7. **Luca's stew.**
   Where: Luca's main in the menu data.
   Wrong: "grape juice" in a seafood stew on the adult card (15).
   Good looks like: white wine, or fish stock, with kids' mode doing its own swap.

8. **Small items.**
   E.T.'s faint signature box on paper (06). The 1px pale hairline round landscape PDFs. "6 slices provolones" and "1 tarragon" in shopping lists. Galaxy Video's photo sign targets on the phone.

## Genuinely excellent, leave alone

- The sequel landing: DIE HARD 2 on the marquee and "Film 2 of the 3 Die Hard films on the wheel" with a one-tap swap and a marathon (01).
- Add to calendar: honest about what is too late tonight, offers the move, valid .ics, correct Google times, no permission prompts (14).
- Galaxy Video on the phone now: search in full, sticky row clear of the signs, the rental slip with change from a $10 note (13).
- The hand-built menus on paper: Lou's Cafe, Little Nero's, Jurassic Park's dining guide and Gusteau's are as good as anything in the set.
- The campfire signatures and stills, and the invite tone, print as on screen (06, 07, 09, 16).
- A clean run otherwise: 18 node tests pass, no page or console errors, no sideways scroll, every request goes to reeldinner.com or image.tmdb.org.
