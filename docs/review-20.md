# Twentieth independent review

**Overall: 9.2 out of 10**

Every item in review 19's fix list holds when checked by hand. The hotel door hanger prints its hole on Wicked: For Good's real PDF (02) and in my copies of Inception, Batman & Robin, Annie, Lost in Translation and Home Alone 2 (16). Airline and Wicked tickets print their punched notches. Coming to America prints navy all round on its real PDF, with no white corners (03), and Pulp Fiction and Chef print on a dark surround too. Psycho's too-late row reads cleanly at 390 wide (01), and every planner control is 44px. "Devilled" is right everywhere, Home Alone 2 reads "Hot spiced apple juice" with its price in the column, Beetlejuice's lemonade note clears the House Rule bar, Rocky IV keeps a night-before reminder for the mule after "Move to Sat 14 Nov" (14), and The Godfather reads "Longest on the night: Rigatoni, Sunday gravy (2 hr)". Lifted photos, stamps and cards now print with their shadows (17, 18). No page or console errors in any run, and all 19 node tests pass.

What pulls it back is the new Save PDF shadow code. It draws a box shadow with a spread as a black ring, so a few things that printed fine on the last build now print badly: every airline window has a black bezel where the screen has cream plastic (05), The Godfather Part II's marquee bulbs print with black rings (13), After Hours' neon labels get a heavy black outline and Unforgiven's poster mat turns into a black frame (08). It also lays some shadow pictures in the wrong place: tiki photo islands get a pale offset ghost (06), and Ratatouille's poster and Chef's logo get unturned ghost boxes, one poking out past the card's top edge (07). No words are lost anywhere, which is why check-print-text passes all of these. I also found three older paper faults no review has named: the canteen meal voucher prints its paper square while its dashed edge is turned (10, 15), A Christmas Story's dark striped panel prints plain tan (09), and Elf's candy-cane border prints solid red (11).

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit a134410 ("Review 19 notes") on wip/store-overhaul, with service workers blocked and Australia/Brisbane time. The clock was fixed at Fri 6 Nov 2026, 2:30pm for the too-late and calendar checks and at Sat 7 Nov 5:30pm for the walks. Web fonts and TMDB images came through the proxy; html2canvas 1.4.1 and jsPDF 2.5.1 were served from local copies. Every finding was checked against rendered pixels, not just the DOM. Where something on paper looked wrong, I rendered the same film on the previous build (e176cf8) to see whether it was new. Screenshots are docs/review-20-01.png to review-20-18.png. In the three-panel shots the order is screen, this build's Save PDF copy, then e176cf8's copy.

## How it was tested

- Save PDF: 67 films. Each card was cloned at full size on screen and screenshotted, then run through renderCanvas(el,true) after loadExportTools(true), every .fx-face as its own full-size clone built the way Save PDF builds it. Each pair was looked at side by side with a blurred difference map, then zoomed where they differed. Shared layouts, one fresh film each, none named in reviews 18 or 19: Monsters, Inc. (bistro), Fletch (newspaper), Uncle Buck (diner), Casablanca (club), Chicken Run (canteen), Total Recall (lab), Willy Wonka & the Chocolate Factory (candy bar), Mrs. Doubtfire (placemat), A Christmas Story (takeaway), Batman & Robin (hotel), Wonder Woman (banquet), Rent (truck), Aliens (galley), Happy Gilmore (stadium), Top Gun (bar tab), E.T. (campfire), The NeverEnding Story (home), Finding Nemo (kiosk), Con Air (airline), Coco (invite), Time Bandits (tavern), Avatar (tiki), Saw II (precinct), Planes, Trains and Automobiles (motel), Big Hero 6 (cafe), Frozen (tearoom), Barbie (prom), Collateral (dining car), Shaun of the Dead (pub), Unforgiven (saloon). Extras: Inception, Annie, Lost in Translation (hotel), Love Actually, Airplane! (airline), Matilda (canteen), Elemental (takeaway), Mamma Mia! (bistro), Scream (2022), Heat, Return of the Jedi, Speed, Sixteen Candles. Hand-built, 24: Coming to America, Pulp Fiction, Chef, Do the Right Thing, Donnie Brasco, Ghostbusters, Brewster's Millions, Annie Hall, After Hours, Working Girl, You've Got Mail, Elf, Moonstruck, Saturday Night Fever, Carlito's Way, Ratatouille, Get Shorty, Home Alone 2, Beetlejuice, Things to Do in Denver When You're Dead, Three Men and a Baby, Money Train, Midnight Cowboy, The Godfather Part II.
- The same render on e176cf8 for 15 of them, to sort new faults from old: A Christmas Story, After Hours, Avatar, Beetlejuice, Chef, Chicken Run, Con Air, Elf, Finding Nemo, Monsters, Inc., Ratatouille, Saw II, The Godfather Part II, Time Bandits, Unforgiven.
- The real Save PDF button (Menu only) on Wicked: For Good and Coming to America, pages read with pdftoppm (02, 03).
- A scan of three films per shared layout and all 90 hand-built films for outer box shadows with a spread (the shape the black-ring fault needs): 41 films carry at least one, across airline, tiki, saloon, stadium, dining car, placemat, invite, bar tab, club, hotel and many hand-built menus. Not every one prints black (Happy Gilmore, Sixteen Candles and Speed print fine); the ones above do.
- Too late at 390x844: Psycho, clock Fri 6 Nov 2:30pm, locked for Sat 7 Nov 7pm. Planner read and measured, Prep sheet note, sideways scroll (01).
- Rocky IV at Fri 2:30pm: "Move to Sat 14 Nov", then Add to calendar, reading the .ics (DTSTART, DESCRIPTION, TRIGGER) and the panel (14). The Godfather's panel and .ics for the "longest on the night" line.
- Phone and desktop walks with the clock at Sat 5:30pm and Psycho locked in: box office, strip, "Your movie night" bar, Prep sheet, Candy bar, Galaxy Video shopfront and walk in. Sideways scroll, page and console errors, and every tappable control under 44px listed (04).
- Kids' mode: printed card text of Casablanca, Top Gun, Collateral, Unforgiven, Shaun of the Dead and Get Shorty.
- Node tests: `node --check app.js` and all 19 tests/*.test.cjs, dialogs included. All pass. scripts/check-print-text.cjs on Con Air, Avatar, Ratatouille, After Hours, Unforgiven, Chef, Chicken Run, A Christmas Story, Coming to America and Wicked: For Good: pass, which shows its blind spot (see area 3).
- A data search of films.json, dish-notes.json, film-house.json, film-flavour.json, recipes, formats.js and menu-formats for about 50 US spellings and terms, and for doubled words.

What I could not test: no real iPhone, Android phone, Mac or Windows machine, so I cannot say how Safari, Apple Calendar, Google Calendar or Outlook handle the file. I did not re-check the table kit or re-measure the swipe view's type; nothing since review 19 touches either. I did not run check-print-text, check-pdf-tone, check-phone-fit or check-prep-a4 over all 900, so I cannot give a count of films hit by the black-ring and ghost-shadow faults, only the layouts and films above.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.5 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 8.5 |
| 4. Phone experience | 9.5 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 9.5 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9.5 |
| 9. Polish and craft | 9 |
| 10. Accessibility basics | 9.5 |
| **Overall** | **9.2** |

The straight average is 9.2. I have not rounded it.

### 1. First impression and visual identity: 9.5
Unchanged. The phone strip ("Tonight 7 Nov, 7pm, in 1 hr 30 min"), marquee and wheel hold (04). Nothing to mark off.

### 2. Brand consistency: 9
Unchanged. Candy bar in cinema red and gold, Galaxy Video on its shopfront and shelves in purple, gold, teal and pink (04). Held at 9 for the cinema strip inside Galaxy Video, as before.

### 3. Printed menus: 8.5
Review 19's paper faults are fixed, checked by hand:
- Hanger holes on every hotel film I rendered and on Wicked: For Good's real PDF, both pages (02). Home Alone 2's hand-built hanger too (16).
- Ticket notches on Wicked: For Good's real PDF, Con Air and Love Actually.
- Coming to America's real PDF is navy to the edge, no white corners, no red surround (03). Pulp Fiction and Chef print on dark too.
- Drop shadows print: Saw II's photo and cards (17, and 18 against e176cf8 where they sat flat), the Planes, Trains and Automobiles motel poster, Scream (2022)'s motel cards, Chicken Run and Matilda trays, the Elf postcard.
- The sweep fixes: Pulp Fiction's prices sit in their column, Heat's cafe heads print plain and whole, Three Men and a Baby's sign clears its line, Money Train's check and Midnight Cowboy's ticket clear their text. Beetlejuice's lemonade note sits clear of the bar.

No dish name, note, price or cue is lost on paper in any of the 67 films, and many print as near copies: Casablanca, Fletch, Uncle Buck, Monsters, Inc., Wonder Woman, Top Gun, E.T., Coco, Frozen, Barbie, Shaun of the Dead, Do the Right Thing, Moonstruck, You've Got Mail, Carlito's Way, Working Girl, Saturday Night Fever.

Marks off:
- **Shadows with a spread print as black rings. New on this build.** pdfLiftBake fills each shadow shape with black and only cuts the box itself back out, so the spread part of the shape stays black over the shadow colour. On screen these are rings in a set colour; on paper they come out black or near black:
  - Airline windows: the cream plastic bezel round the poster prints as a black frame on Con Air, Love Actually and Airplane! (05). e176cf8 printed the cream bezel.
  - The Godfather Part II: every marquee bulb round the border prints with a black ring (13). e176cf8 printed plain bulbs.
  - After Hours: the red double-line neon labels ("The Menu", "To start", "Behind the bar") print with a thick black outer ring (08).
  - Unforgiven: the cream mat and brown keyline round the poster print as a dark frame (08).
- **Shadow pictures in the wrong place. New on this build.**
  - Tiki photo islands: a pale offset ellipse sits behind each island, up and to the left, with the cream rim off centre (Avatar 06, Return of the Jedi, which review 19 named as printing well).
  - Ratatouille: an unturned shadow box sits behind the tilted poster and pokes out past the top edge of the card as a white strip (07).
  - Chef: two faint unturned boxes cross the El Jefe logo panel, where the screen shows plain yellow (07).
  - Monsters, Inc.: the tilted "Reserved" card has a pale sliver along its left and bottom edges (12). Small.
- **Older faults, not new, and not named before:**
  - Canteen meal voucher: the paper prints square while its dashed edge and words are turned, so the corners of the dashed edge stick out past the paper (Chicken Run 10, Matilda 15). Same on e176cf8. Likely every canteen film with a voucher.
  - A Christmas Story: the right-hand panel on the takeaway front is dark with diagonal stripes on screen and plain tan on paper (09). Elemental, on the same layout, prints right. Same on e176cf8.
  - Elf: the candy-cane border prints solid red and the airmail edge on Buddy's postcard is lost (11). Diagonal stripes are not baked. Same on e176cf8.
  - Time Bandits: the heavy dark inner rule of the tavern frame prints as a thin double line. Same on e176cf8. Low.
- check-print-text passes every film above. It checks words and leftover CSS, not what a baked picture looks like, so it cannot see a black ring or a ghost box.

### 4. Phone experience: 9.5
Both review 19 items are fixed. Psycho's too-late row at 390 wide reads "Mother's pickled onions" on one line, the tag on its own line under it, then "17 min + 7 days wait, start 7 days before" (01). Guest buttons are 44x44, dish rows 44px or more, diet toggles 44px, "Move to Sat 14 Nov" 150x44. No sideways scroll and no errors on any view (04).

Marks off:
- Carried: small type in the swipe view of hand-built cards. Not re-measured.
- Low: in Galaxy Video the hanging aisle signs measure 113x35 down to 39x11 on the phone, and the Unwatched and Kids toggles 48x28. These were there before and the store has its own tap check (scripts/check-store-taps.cjs), so I have not marked them hard.

### 5. Core flow: 9.5
Review 19's one mark is fixed. Rocky IV, after "Move to Sat 14 Nov": start cooking 5:35pm ("Longest on the night: Moscow blini, 1 hr 25 min"), "Four days before: Log cabin pickles" at Tue 10 Nov 6pm and "The night before: Drago's Siberian cranberry vodka mule" at Fri 13 Nov 6pm, three alarms in the .ics (-PT1H25M, -P4DT1H, -P1DT1H) and four Google links (14). Psycho's too-late note, greyed row and move button read as review 19 described; I did not re-read its shopping list or .ics, as nothing in that path changed apart from the row's layout. Held short of 10 because the .ics is still untried on real phones and calendars.

### 6. Candy bar: 9
Walked on phone and desktop: no sideways scroll, no errors, combos and glass case scroll sideways on the phone (04). Photo credit links are 18px text links, as before. Held at 9.

### 7. Galaxy Video store: 9
Walked on phone and desktop: shopfront with Walk in and Skip, then the shelves, member card and calendar strip (04). No errors. Held at 9 for the cinema strip inside the store.

### 8. Table kit: 9.5
Not re-checked; nothing since review 19 touches it. Held.

### 9. Polish and craft: 9
Every small item from review 19 is fixed and has a test or a check rule behind it: spelling.test.cjs, the dry-plan cases, the calendar cases, and the new check-print-text rules. The data search found no US spellings in visible text beyond in-world US venue wording (Labor Day 1972 on a hand-built sign, the Muppet Theater, film titles), and no doubled words that are not names (Nai Nai, Far Far Away, Gabby Gabby).

Marks off:
- The paper regressions in area 3 are a craft problem too: the shadow fix was checked on the films it was aimed at, and a side-by-side pass on a spread of layouts would have caught the black rings straight away.
- Kids' mode swaps that read oddly:
  - Unforgiven prints "Big Butterscotch, Wyoming", "Greely's Root Beer Garden" and "Big Butterscotch bread pudding, butterscotch sauce". The town is called Big Whiskey; a place name should not be swapped.
  - Top Gun: "Beach volleyball fish tacos, Alcohol-free crisp battered fish strips". The source says "Lager battered"; onion rings on the same card read "Crisp battered", which is the right fix.
  - Get Shorty keeps "Acting lesson Bloody Mary" as the name while the line drops the vodka. A kids' card should not name a cocktail.
  - Shaun of the Dead keeps "Pint at the Winchester" and "a round of pints" in kids' mode. Low; a pint is arguably fine.

### 10. Accessibility basics: 9.5
The planner controls are now 44px (area 4). The calendar panel still opens with focus on Done and the too-late note keeps role="note". Held short of 10 for the carried swipe-view type.

## Fix list

1. **Spread shadows print black.**
   Where: pdfLiftBake in app.js (the shadow loop fills the shape with "#000" at the spread size and cuts back only the box).
   Wrong: airline window bezels (Con Air, Love Actually, Airplane!, 05), The Godfather Part II's marquee bulbs (13), After Hours' neon labels and Unforgiven's poster mat (08) print as black rings.
   Good looks like: a shadow with a spread and no blur prints as a ring in its own colour, as on screen, and a blurred one with a spread keeps its colour too. Fill the shape with the shadow colour (or draw the fill off the canvas and keep only the shadow), and cut the box out after each layer, not once at the end. A check-print-text rule that compares the pixel colour of each baked shadow picture's ring against the shadow's own colour would catch it.

2. **Shadow pictures laid in the wrong place.**
   Where: pdfLiftBake's placement (L0, T0 and the transform origin) for turned boxes, round shapes and boxes whose shadow is on an inner element.
   Wrong: tiki islands get a pale offset ghost (Avatar 06, Return of the Jedi); Ratatouille's poster gets an unturned box that runs past the card's top edge, Chef's logo panel gets two ghost boxes (07); Monsters, Inc.'s Reserved card a pale sliver (12).
   Good looks like: each shadow sits exactly under its box, turned with it, and nothing prints outside the card. A check: render each baked shadow picture alone and fail if its bounding box is not centred on its box (allowing for the shadow's own offset).

3. **Canteen meal voucher.**
   Where: menu-formats/canteen.js voucher and its export copy.
   Wrong: the paper prints square while the dashed edge and words are turned (Chicken Run 10, Matilda 15). Not new.
   Good looks like: paper, edge and words all turned together, as on screen.

4. **Diagonal stripes on paper.**
   Where: pdfStripes in app.js (only 0, 90, 180 and 270 degrees are baked).
   Wrong: Elf's candy-cane border prints solid red and the airmail edge is lost (11); A Christmas Story's dark striped panel prints tan (09). Not new.
   Good looks like: diagonal repeating stripes baked to a tile like the straight ones.

5. **Small items.**
   Kids' mode: keep place names (Big Whiskey, Greely's Beer Garden) out of the word swap, "Lager battered" to "Crisp battered", rename Get Shorty's Bloody Mary in kids' mode (a Virgin Mary, or the house tomato juice). Time Bandits' frame rule. The swipe-view type carries.

## Genuinely excellent, leave alone

- The review 19 fixes, all of them, and the tests and check rules that came with them.
- Masked shapes on paper: hanger holes and ticket notches are clean on the real PDF (02).
- Lifted photos and cards now sit off the page on paper, where e176cf8 printed them flat (17, 18). The idea is right; only the spread and placement need work.
- The too-late planner row on a phone: name, tag, time, each on its own line, nothing squeezed (01).
- Make-aheads keep their own reminders after a move: four days before and the night before, each with its own alarm and Google link (14).
- Hand-built menus that print as near copies: Do the Right Thing, Moonstruck, You've Got Mail, Carlito's Way, Working Girl, Home Alone 2, Beetlejuice, Coming to America.
- A clean run: 19 node tests pass, no page or console errors in any walk, no sideways scroll on phone or desktop.
