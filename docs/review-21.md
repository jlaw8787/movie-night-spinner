# Twenty-first independent review

**Overall: 9.1 out of 10**

Review 20's big paper faults are fixed when checked by hand. Spread shadows print in their own colour: Con Air's airline window has its cream bezel again (13), The Godfather Part II's marquee bulbs print plain (14), After Hours' neon labels have no black ring and Unforgiven's poster mat prints cream. Chef's logo panel prints clean yellow. Elf's candy-cane border and airmail edge print striped, and A Christmas Story's dark striped panel prints dark (15). Kids' mode keeps Big Whiskey and Greely's Beer Garden, Top Gun reads "Crisp battered fish strips" and Get Shorty's drink is an "Acting lesson Virgin Mary". Since review 20 the app has also gained the E.T. still strip on all 56 campfire menus, a side still and line on all 28 bistro menus, and the noon glitch fixes, and nearly all of it holds up: the bistro still is the best single addition in a while (11, 12), the film strip and taped photo styles print cleanly, and Hitch, The Goonies, Mickey Blue Eyes, Silver Linings Playbook, Top Gun, Wish and the five deduped menus all read right on paper (16, 17, 18). No page or console errors in any run.

What pulls it back is a mix of older faults that a fix moved rather than removed, and new ones that no check catches. Ratatouille's stray shadow strip moved from the top edge to the bottom, and Ghostbusters and When Harry Met Sally print the same white bar (02, 03, 04). After Hours' front now reads "TERMINAL BAR" in letters too big for the line, so "BAR" wraps under "BAR AND GRILL" on screen and on paper (01). The campfire strip turned badge lines into photo captions, and on about half the films I read closely the caption names something the photo does not show (06, 07); the strip also changes the A4 margin on page 1 from the dark surround to whatever colour the photos are (05). On the phone, the new "Request a movie" button squeezes Galaxy Video's search box to "Ask th" and its tool bar now covers the top two aisle signs, so check-store-taps fails (09). Two bistro lines get the film wrong (Ferris Bueller, Hitch) and two repeat a dish note on the same card (Luca, Kingsman).

Tested with Playwright and Google Chrome at 1440x900 (2x) for the menus and at 390x844 (touch, 3x) and 1440x900 for the walks, on a local server at commit 7cb7451 ("Handoff: bistro stills live") on main, with service workers blocked and Australia/Brisbane time. The clock was fixed at Sat 14 Nov 2026, 5:30pm for the walks. Web fonts, TMDB images, html2canvas 1.4.1 and jsPDF 2.5.1 came through the proxy. Every finding was checked against rendered pixels. Where something looked wrong I rendered the same film on an older build to see when it started: 1d8a3dda (11 Nov, before the campfire strips) and 563ccd10 (the review 20 fixes). Screenshots are docs/review-21-01.png to review-21-18.png. In the side-by-side shots the order is screen, then the real Save PDF pages.

## How it was tested

- Save PDF, the real path: exportMenu('pdf','menu') for each film, the downloaded PDF read with pdftoppm and laid beside a screenshot of the card, then zoomed where they differed. 63 films:
  - Review 20's list: Con Air, Love Actually, Airplane!, The Godfather Part II, After Hours, Unforgiven, Avatar, Return of the Jedi, Ratatouille, Chef, Chicken Run, Matilda, A Christmas Story, Elf, Time Bandits. Avatar is now a campfire menu and Return of the Jedi a banquet, so the tiki ghost could not be rechecked on those two.
  - Campfire, every strip style and hand pick: Logan, Tarzan (row, flip), Peter Pan, Bambi, Crocodile Dundee II (stagger), Sleeping Beauty, The Empire Strikes Back (stagger, full logo), Cool Runnings, Shrek, The Proposal (album), Brother Bear, Night of the Living Dead (album, full logo), Pocahontas, The Mummy, Hunt for the Wilderpeople (film), Beneath Hill 60, Seabiscuit (two photos), Tropic Thunder, Encino Man, The Parent Trap, Role Models (handwritten name), The Jungle Book and Friday the 13th (new headings), plus E.T.
  - Bistro: Wall Street, Monsters, Inc., The Princess and the Frog, Ferris Bueller's Day Off, Casino Royale, Kingsman: The Secret Service, Mamma Mia!, The Matrix Reloaded, Luca, Bridget Jones's Diary, Roman Holiday, The Menu.
  - Noon glitch list: Hitch, The Goonies, Mickey Blue Eyes, Silver Linings Playbook, Top Gun, Wish, Clerks III, Despicable Me 2, The Great Mouse Detective, The Proposal.
  - The deduped menus: Ghostbusters, The Godfather, When Harry Met Sally..., The Warriors, Crocodile Dundee II.
- Older builds: Peter Pan, Cool Runnings, Wall Street and Ferris Bueller on 1d8a3dda; Ratatouille and After Hours on 563ccd10. git log for when After Hours' logo changed.
- A pixel scan of every PDF page for a near-white bar across the bottom on a coloured page: Ghostbusters, Ratatouille and When Harry Met Sally (the portrait hits were photo frames, checked by eye).
- All 28 bistro side lines: printed text read in the browser and compared against the rest of the card for repeated phrases (Luca, Kingsman). The two that looked doubtful on the film were checked on the web.
- Kids' mode printed and phone text for Unforgiven, Top Gun, Get Shorty, Shaun of the Dead, Logan, Casino Royale, The Matrix Reloaded, Wall Street, Cool Runnings, Tropic Thunder, Kingsman, Ocean's Twelve and Bugsy.
- Phone and desktop walks: box office, a film's menu, Lock in, Candy bar, Galaxy Video and the privacy page. Sideways scroll, page and console errors, and every control under 44px listed (09, 10).
- Node tests: `node --check app.js` and all 19 tests/*.test.cjs. All pass. scripts/check-browser.cjs: fails one case at 1280 (kids' mode, Bugsy, "scotch"; see area 9); its reload case failed once and passed on a rerun. scripts/check-store-taps.cjs: fails, and passes on 563ccd10 and 6e95c5f4; bisected to 919fd90f.

What I could not test: no real iPhone, Android phone, Mac or Windows machine, so the iPhone filtered-photo fix (8 Nov) and the .ics in real calendars are still untried. I did not submit the request form (it posts to Netlify) and did not re-check the table kit, the calendar export or the Prep sheet layout; nothing since review 20 touches them beyond the dish renames. I did not run check-print-text, check-pdf-tone or check-phone-fit over all 900, so the white-bar count is for the 63 films above, not the whole set.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.5 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 9 |
| 4. Phone experience | 9 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 9.5 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9.5 |
| 9. Polish and craft | 8.5 |
| 10. Accessibility basics | 9 |
| **Overall** | **9.1** |

The straight average is 9.1. I have not rounded it.

### 1. First impression and visual identity: 9.5
Unchanged. Marquee, wheel and the "Tonight 14 Nov, 7pm, in 1 hr 30 min" strip hold on the phone. The bistro side still makes those 28 fronts look finished rather than half empty.

### 2. Brand consistency: 9
Unchanged. Held at 9 for the cinema strip inside Galaxy Video, as before.

### 3. Printed menus: 9
Review 20's faults, checked by hand:
- Spread shadows print in their own colour. Airline bezels are cream on Con Air (13), Love Actually and Airplane!. The Godfather Part II's bulbs are plain (14). After Hours' neon labels and Unforgiven's mat print as on screen.
- Chef's logo panel has no ghost boxes. Monsters, Inc. is now bistro and its Reserved card is gone, so that sliver is moot.
- Diagonal stripes bake: Elf's candy-cane border and airmail edge, A Christmas Story's dark panel (15).
- Not fixed: the canteen voucher (below), Ratatouille (below), Time Bandits' frame rule (still a thin double line).

The new work on paper:
- Bistro side still and line: all 12 I rendered print as near copies of the screen, the 1920s black and white on The Princess and the Frog included (11, 12).
- Campfire strips: all four styles print cleanly, sprocket holes, tape and photo margins included. Beneath Hill 60 and Seabiscuit's two-photo strips sit right. The handwritten-name signatures on Encino Man and Role Models read well.
- Glitch fixes hold: Hitch's tag in full, Sloth's note in full on The Goonies, Mickey Blue Eyes' sticker clear of its note, Silver Linings' signature whole, Top Gun's logo once (16, 17).
- Deduped menus: Crocodile Dundee II prints snags, barra and pavlova once each. Ghostbusters, The Godfather, When Harry Met Sally and The Warriors print the dishes the Prep sheet cooks (18).

Marks off:
- **White bar along the bottom of three hand-built landscape menus.** Ratatouille (02), Ghostbusters (03) and When Harry Met Sally (04) print a white strip, with a grey shadow on its top edge, across the bottom of the page, inside the coloured surround. Ratatouille's is already there on 563ccd10, so the review 20 fix moved the stray shadow from the top edge to the bottom rather than removing it. Chef, The Godfather and The Warriors do not have it.
- **After Hours' logo overlaps its own subtitle. Since 7e8598f3.** The venue was renamed from Last Stop to Terminal Bar, but the neon logo is still 104px in a 440px box, so "TERMINAL BAR" wraps and "BAR" sits behind "BAR AND GRILL" on the front, and the small logo on the back runs into "BAR AND GRILL, SOHO" (01). On screen and on paper. 563ccd10 printed "LAST STOP" on one line. No check looks at a word printed behind another word.
- **Campfire captions that name something the photo does not show.** The strip prints the old badge lines as captions under three stills, so each one reads as the photo's caption. On Peter Pan, "Tinker Bell and her fairy dust" sits under the children flying and "Nana the nursemaid dog" under the night flight over London (05). On Logan, "Laura's X-Men comic book" sits under Logan walking at sunset (06). Pocahontas puts "Percy the pampered pug" under John Smith, Brother Bear puts "Rutt and Tuke, driving the mammoth" under a bear's face, The Proposal "Annie's fake heart attack" under a street (07, 17). E.T.'s own front does it too ("E.T. dressed up in Gertie's wig and scarf" under the moon). Night of the Living Dead and Sleeping Beauty are the good ones: cemetery under the cemetery, Maleficent under Maleficent.
- **Campfire page 1 takes its A4 margin from the photos.** The margin colour comes from the card's top and bottom edges, and the strip now sits on the bottom edge. Peter Pan's page 1 printed a dark surround on 1d8a3dda and prints cream now, while page 2 stays dark (05). Sleeping Beauty and Night of the Living Dead are cream, Avatar maroon, Cool Runnings and Pocahontas red-brown. Not broken, but the two pages of one menu no longer match.
- **Canteen meal voucher, carried.** Chicken Run's paper still prints square with a second square edge while the dashed edge and words are turned (08). Matilda the same.
- Time Bandits' heavy frame rule prints thin. Carried, low.

### 4. Phone experience: 9
No sideways scroll and no errors on any view. The menu, Lock in dialog and Candy bar read well.

Marks off:
- **Galaxy Video's tool row on the phone.** The "Not on the shelves? Request a movie" button is a tall round bubble between the search box and Filters. The search box shrinks to "Ask th" (09), and once you scroll, the tool bar and the button sit over the first two aisle signs: tap height on "New releases" is 5px and on "Comedy and teen" 21px (from 50). check-store-taps fails for this. It passes on 6e95c5f4 and fails from 919fd90f, the commit that pulled the request form back from the live site. On desktop the button wraps to two lines and squeezes the search box too (10).
- Carried, low: the swipe view's small type on hand-built cards (not re-measured), the Unwatched and Kids toggles at 48x28.

### 5. Core flow: 9.5
Lock in on the phone opens "Roll credits on the menu" with the showtime and both modes, and the strip reads "Tonight 14 Nov, 7pm, in 1 hr 30 min" with Menu, Prep sheet and Add to calendar. All calendar, week, shopping and dry-plan tests pass. Held short of 10 because the .ics is still untried on real phones and calendars.

### 6. Candy bar: 9
Walked on phone and desktop, no errors, no sideways scroll. Photo credit links are still 18px text links. Held.

### 7. Galaxy Video store: 9
Shopfront, shelves and member card walk cleanly on desktop. The phone tool row fault is marked in area 4 and 10, not twice here. Held.

### 8. Table kit: 9.5
Not re-checked; nothing since review 20 touches it. Held.

### 9. Polish and craft: 8.5
The bistro lines are short, light and mostly well judged, and kids' mode handles all of them. Review 20's kids' items are fixed and have rules behind them.

Marks off:
- **Two bistro lines get the film wrong.**
  - Ferris Bueller's Day Off: "Art Institute first, lunch second." In the film they lunch at Chez Quis first, then the Cubs game, then the Art Institute.
  - Hitch: "First date by ferry. Mind the jet ski." Hitch and Sara go out to Ellis Island by jet ski; there is no ferry.
- **Two bistro lines repeat a dish note on the same card**, which the handoff says they should not: Luca's "Silenzio, Bruno. Order the pasta." beside the sardines' "Silenzio, Bruno. Order a second plate.", and Kingsman's "Oxfords, not brogues, at this table." beside the potted shrimp's "Manners maketh man. Oxfords, not brogues." (12). The handoff only checked against the From the house note.
- **The checks are red for two reasons, one real and one not.** check-store-taps fails on a real fault (area 4). check-browser fails kids' mode at 1280 on Bugsy's "800g scotch fillet steaks", which is an Australian cut of beef, not whisky; the rule needs to skip "scotch fillet", "scotch egg" and "scotch bonnet". A suite that is red for a false reason trains people to ignore it.
- After Hours' logo has been wrong since the unsure chase and nobody saw it. The scripts and tests lost with the three commits that never reached GitHub (handoff, 11 Nov) may be part of why the store check was never rerun.
- Kids' mode swaps that read oddly, low: Shaun of the Dead's recipe says "Pour the root beer, or the root beer for anyone who prefers it" and "English root beer or root beer"; "Big Whiskey bread pudding" keeps "Whiskey" in a dish name on a kids' card now that the town name is protected; "Pint at the Winchester" is carried.

### 10. Accessibility basics: 9
The planner controls stay at 44px and the too-late note keeps its role. Marked down from 9.5 for the covered aisle signs and the truncated search placeholder on the phone (09). Carried: the swipe-view type.

## Fix list

1. **Galaxy Video tool row on phone and desktop.**
   Where: the .shop-tools row and the .req-shop button (index.html and the shop CSS, from the request form brought back in 919fd90f).
   Wrong: the search box shows "Ask th" at 390 wide, the button is a tall bubble, and the tool bar covers "New releases" and "Comedy and teen" (tap height 5 and 21). check-store-taps fails (09, 10).
   Good looks like: search box full width on its own line on the phone, the request link as a plain line or small button under it, and nothing sitting over the aisle signs. check-store-taps passes at 50 on every sign.

2. **White bar along the bottom of hand-built landscape menus.**
   Where: pdfLiftBake's placement for a shadowed box near the bottom of the card, or the page's own height in renderCanvas (Ratatouille, Ghostbusters, When Harry Met Sally).
   Wrong: a white strip with a grey shadow prints across the bottom of the page (02, 03, 04). Ratatouille's came with the review 20 fix.
   Good looks like: the coloured surround runs to the edge, as on screen. Run the white-bar scan used here (any row in the bottom 15% of a coloured page that is over 92% near-white) over all hand-built films, and add it to check-print-text or a PDF check.

3. **After Hours' logo.**
   Where: formats.js, the sohoaftermidnight template (front logo at 104px in a 440px box, and the small logo on the back).
   Wrong: "TERMINAL BAR" wraps and "BAR" prints behind "BAR AND GRILL" on both faces (01).
   Good looks like: the venue name on one line, sized to fit, clear of the subtitle. A check-print-text rule that fails when two text boxes overlap would have caught it.

4. **Campfire captions.**
   Where: data/film-flavour.json stillStrip s (the three still numbers) and labels, set by scripts/campfire-strips.cjs.
   Wrong: on Peter Pan, Logan, Pocahontas, Brother Bear, The Proposal and E.T. the caption names a person or moment the photo does not show (05, 06, 07).
   Good looks like: either pick each still to match its line, or give each still its own caption of what is in it and keep the badge lines elsewhere. Look at all 56 strips with the captions on and fix the ones that do not match.

5. **Campfire page 1 margin colour.**
   Where: exportMenu, edgeColour on the trimmed canvas, now reading the photo strip at the bottom edge.
   Wrong: page 1 prints on cream, maroon or brown depending on the photos, while page 2 stays dark (05).
   Good looks like: both pages on the card's own surround colour. Sample the edge above or beside the strip, or let a layout name its margin colour.

6. **Bistro lines.**
   Where: data/film-flavour.json sideLine.
   Wrong: Ferris Bueller's order of the day; Hitch's ferry; Luca and Kingsman repeat a dish note.
   Good looks like: Ferris "Lunch as Abe Froman, art after the game." or similar; Hitch "First date by jet ski. Mind the kick." or similar; new lines for Luca and Kingsman that no dish note on the card uses. Extend the repeat check to every printed line on the card, not just the house note.

7. **Canteen meal voucher, carried.**
   Where: menu-formats/canteen.js voucher and its export copy.
   Wrong: paper prints square, with a second square edge, under the turned dashed edge and words (Chicken Run 08, Matilda).
   Good looks like: paper, edge and words turned together, as on screen.

8. **Small items.**
   check-browser's kids' rule: skip "scotch fillet", "scotch egg", "scotch bonnet". Shaun of the Dead's kids' recipe doubling ("root beer, or the root beer"). Big Whiskey bread pudding could drop the town name in kids' mode (say "Saloon bread pudding"), since "Whiskey" now stays in a dish name. Time Bandits' frame rule. The swipe-view type carries.

## Genuinely excellent, leave alone

- Review 20's shadow fix where it works, which is nearly everywhere: airline bezels, marquee bulbs, neon labels and mats all print in their own colour (13, 14).
- Diagonal stripes on paper: Elf's border and postcard edge, A Christmas Story's panel (15).
- The bistro side still. Hand-picked scene stills under the logo turn an empty column into the best part of the front, and they print as on screen (11, 12).
- The campfire film strip and taped photo styles: sprocket holes, tape and margins all survive Save PDF (07).
- The noon glitch fixes and the five deduped menus: every one I checked reads right on paper, and Crocodile Dundee II prints each dish once (16, 17, 18).
- A clean run otherwise: 19 node tests pass, no page or console errors in any walk, no sideways scroll on phone or desktop.
