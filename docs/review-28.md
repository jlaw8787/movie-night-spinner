# Review 28: fresh whole-site review

Overall: 8.4 out of 10

What is strong. The cinema front is the best it has been. The marquee, the gold wheel, the Spin it / Match it / Quiz it switch and the red curtain all read as one real place, and it holds up in WebKit at 390 wide with no page errors anywhere I went. The printed menus are the heart of the site and most of them are genuinely good: 49 menus across all 39 shared layouts plus 9 hand-built ones all saved to PDF without a failure, and the best of them (Rush Hour at the real Foo Chow on North Hill Street, Home Alone 2 with the $967.43 room service bill, Godfather Part II on New Year's Eve 1958, which really was a Wednesday, Spider-Man 2 at Joe's Pizza with Mr Aziz) are the kind of thing people will screenshot and share. Match night, including Final Cut, plays cleanly from deck to head to head on one phone. Quiz night is tidy and quick. Every automated test and check passes.

What holds it back. The newest member screens shipped broken: every My card stat page renders with no styling at all (grey system buttons, bullet dots, posters at full size), because the CSS for them was lost in a merge. The member tab bar clips "Settings" off the edge of a phone. The Google film pages have two sentence bugs on about 180 pages each ("A The Big Lebowski...", "Cook the The Big Lebowski menu"). A handful of menus still break the owner's rules: Forrest Gump's "venue" is a bus stop bench, Deadpool and Wolverine's "Void Cafe" does not exist in the film, two quotes are not verified for their film, and Airplane!'s printed menu drops the lasagne the whole film turns on and fills the starters with peanuts. Five layouts ask for font weights that are not bundled, so they print in a fallback face. Tap targets are under 44px in the watched checklist, the shopfront aisle signs and a few links.

## How it was tested

- Repo at main f41ab39f, served with `python3 -m http.server`. Playwright (Python) with Chromium and WebKit, service workers blocked, Australia/Brisbane time, en-AU. Phone at 390x844, 3x, touch. Desktop at 1440x900. TMDB images loaded through the proxy. (WebKit could not reach 127.0.0.1 in this sandbox, so WebKit ran against the same folder served on the machine's own address.)
- `node --check app.js` and all 28 `tests/*.test.cjs`: all pass. `scripts/check-browser`, `check-friends`, `check-card-stats`, `check-final-cut`, `check-quiz`, `check-members`, `check-night-edit`: all pass first time (check-browser did not time out).
- First impression and How it works dialog, both engines, both sizes.
- Core flow on WebKit and Chromium phone: spin, zoom the menu, Prep sheet, lock in for the week, the locked-in strip, Edit, Prep from the strip, More options, Start the show.
- Save PDF clicked for 49 films (one random film from every shared layout plus 9 hand-built), each PDF downloaded and rasterised to check the printed pixels.
- Menu fact and vibe check on 30 films from that sample, with web checks on the doubtful lines (Ghostbusters: Afterlife, Deadpool and Wolverine, Luca, Hocus Pocus 2, Jumanji: The Next Level and others).
- Candy bar and Galaxy Video on WebKit phone and Chromium desktop: walk-in, shelves, tape back.
- Match night on WebKit phone: Pass the phone with Final Cut on, through two rounds, a wiped round, head to head and the winner; Just me through to the spin; Room code with the database blocked.
- Quiz night daily quiz through to the score card, WebKit phone.
- Members with a seeded signed-in member (the same fake Supabase shape as check-card-stats): My card, three stat pages, Duels, Inbox, Friends, Settings, both engines. Guest pass and the sign-in sheet as a guest, including the 18+ error.
- Film pages /menu/the-big-lebowski-1998/ and /menu/forrest-gump-1994/ on WebKit phone and Chromium, plus a scan of all 1,000 generated pages for wording.
- Tap target scan, label scan and keyboard Tab order on the home screen, store and candy bar. Console watched on every run.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.0 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9.0 |
| 3. Core flow | 9.0 |
| 4. Printed menus and Save PDF | 8.5 |
| 5. Menu content (fact and vibe) | 8.0 |
| 6. Phone experience | 8.0 |
| 7. Candy bar | 8.5 |
| 8. Galaxy Video store | 9.0 |
| 9. Match night | 8.5 |
| 10. Quiz night | 9.0 |
| 11. Members | 6.5 |
| 12. Film pages for Google | 7.5 |
| 13. Polish and craft | 8.0 |
| 14. Accessibility basics | 7.5 |
| Overall | 8.4 |

## Fix list

1. [quick] My card stat pages have no styling. Where: My account, My card, tap any stat tile (Rentals, Films seen, Top shelf and the rest), 390 wide, WebKit and Chromium. Screenshots 01 (WebKit) and 02 (Chromium). What you see: a grey system "Back to My card" button, a bare white search box, bullet dots beside every film, posters at full natural size stacked down the page, "Casino 1995Not rated" run together. Cause: commit 3c78ab93 added about 25 rules to index.html (`.acct-back`, `.acct-sh`, `.acct-sk`, `.acct-h4`, `.acct-frs`, `.acct-fr`, `.acct-th`, `.acct-frt`, `.acct-frb`, `.acct-stars`, `.acct-bars`, `.acct-find`), and the merge b613eaaf ("Merge origin/feat/card-stats") dropped them. None of these class names appear in index.html at f41ab39f, while friends.js lines 228 to 268 still output them. Fix: restore that block from `git show 3c78ab93:index.html` into the account CSS near index.html line 3192, then add a check to check-card-stats.cjs that `#acctBack` has a computed border radius over 0 and `.acct-th` is 36px wide, so a lost stylesheet fails the check.

2. [quick] "Settings" tab is cut off on phones. Where: My account, signed in, 390 wide, both engines. Screenshot 03 (every panel shows "SETTINGS" running off the right edge). Cause: index.html line 3180, `.acct-tabs button{flex:1;...white-space:nowrap}` with five tabs plus count badges is 367px of content in a 330px row (measured scrollWidth 367, clientWidth 330, overflow visible). Fix: in the `@media (max-width:420px)` rule at line 3241 drop the tab font to 11px and letter-spacing to 0, and set `.acct-tabs{overflow-x:auto;scrollbar-width:none}` with `.acct-tabs button{flex:0 0 auto;padding:0 6px}` so a long badge scrolls instead of clipping. Or shorten the label to "More" with settings inside.

3. [quick] Film pages: "A The ..." and "Cook the The ..." on about 180 pages. Where: /menu/<slug>/ meta description and og:description (183 pages start "A The", "A A" or "A An"; 130 more say "A" before a vowel, such as "A Alien") and the bottom button (169 pages say "Cook the The ..."). Screenshot 04 shows "COOK THE THE BIG LEBOWSKI MENU" on the Lebowski page. Cause: scripts/build-seo.cjs line 132 builds `A ${shown} (...) movie night menu` and line 164 builds `Cook the ${shown} menu`. Fix: line 132 to `` `${shown} (${f.year}): a movie night menu${x.venue ? ' from ' + x.venue : ''}: ...` `` (no article), line 164 to `` `Cook this menu` `` or `` `Cook the menu from ${shown}` ``. Rebuild with `node scripts/build-seo.cjs` and add a regex to tests/seo-pages.test.cjs that fails on `\b(A|the) (The|A|An) ` and `\bA [AEIOU]`.

4. [medium] Forrest Gump's menu is from a bus stop bench, not a venue. Where: printed menu and phone menu. Screenshots 05 and 06. The header reads "Savannah bus stop, take a seat / BUS STOP BENCH", the diningcar layout's page 2 strip is a tall sliver of the poster sky blown up and soft, with the bench cut off (06), and the drink is "White House cherry vanilla soda" when Forrest drinks fifteen Dr Peppers at the White House. Cause: data/film-flavour.json key "Forrest Gump (1994)" (`venue: "Bus Stop Bench"`) and data/film-format.json (`format: "diningcar"`). Fix: move it to a real place in the film, such as Bubba's family kitchen in Bayou La Batre or the shrimp boat Jenny, on the takeaway or galley layout, and rename the drink "Fifteen Dr Peppers" (a Dr Pepper float). Keep the box of chocolates and "Run, Forrest, run" winks.

5. [medium] Deadpool and Wolverine's "Void Cafe" is invented. Where: printed menu. Screenshot 07 ("The Void Cafe, The Void, All Welcome"). The film has no cafe in the Void (checked against the full transcript: the only food is a doughnut cart and a "cafe gratitude" joke). The quote "Ooh! Look at those jammies." is real and good. Cause: data/film-flavour.json key "Deadpool & Wolverine (2024)" venue. Fix: use a real place from the film, Cassandra Nova's lair is grim, so better the TVA canteen or Blind Al's kitchen; or Wade's birthday party at his apartment, which the menu already references ("Wade's birthday sticky pork ribs").

6. [medium] Airplane!'s printed menu drops the lasagne and pads the starters. Where: printed and phone menu. Screenshot 10 (bottom row, second panel). The film's best food beat is fish or lasagne ("I had the lasagna"), and the full menu data has "Roger, Roger beef lasagne", but the printed edition has one main (steak) and starters of "Airline peanuts: warm salted nuts in little packets" and "Flight deck snack tray: cheese, crackers, grapes and onions", which are not complete dishes. Cause: data/film/airplane-1980.json `edition.menu.s` and `edition.menu.m`. Fix: replace Airline peanuts with the lasagne as a second main, named for the line ("I had the lasagne"), and make the snack tray a proper dish (for example a cheddar and onion pastry with grapes). Add "Looks like I picked the wrong week..." to the espresso martini note so the joke lands.

7. [quick] Two quotes are not true to their film. (a) Jumanji: The Next Level prints "I got killed by a piece of cake!" signed Fridge (screenshot 09). In The Next Level nobody dies from cake; cake is Mouse Finbar's weakness and Fridge smashes a cake away. Cause: data/film-flavour.json "Jumanji: The Next Level (2019)" note. Fix: use a verified line, or make it an unquoted note ("Mouse's weakness is cake. Nobody passes Fridge the cake."). (b) Luca prints "Holy mozzarella, look up!" signed Giulia (screenshot 08). Giulia's exclamations in the film are "Santa ricotta!" and "Santo pecorino!"; I could not verify this English line. Fix: quote "Santa ricotta!" or turn it into an unquoted note. Also check: Ladies in Black, Bad Boys and Fletch use signed paraphrases without quote marks, which is fine.

8. [medium] Five layouts print in a fallback font. Where: Kingpin (bowling, Unbounded 700), Caddyshack (clubhouse, Fraunces 700), Wedding Crashers (Playfair Display 400), Ghostbusters: Afterlife (drive-in) and Better Off Dead (Barlow Semi Condensed italic 500). Screenshot 08 (Kingpin) shows the result on paper. Console says "No local font for ..." from assets/fonts/fonts.js line 476. Cause: those weights are not in the bundled font index (fonts.js has Unbounded only at 800, Fraunces 700 only inside the 700..900 range key the layouts don't ask for). Fix: run scripts/fetch-fonts.cjs for exactly these five family and weight pairs, or change the layout CSS to a weight that is bundled (Unbounded 800, Fraunces 600 to 900 range). Then make check-print-text fail on any "No local font" warning.

9. [medium] The empty stage sits under Match night and Quiz night. Where: Match it and Quiz it on the phone. Screenshots 11 and 12. Under every Match night screen and the quiz score card there is a full-height red curtain saying "Spin the wheel to raise the curtain", plus the Menu of the week card again. On a phone it doubles the scroll and tells you to do something you are not doing. Cause: app.js line 4225 closes the theatre with that tease and the stage stays visible when `#matchPanel` or `#quizPanel` is showing. Fix: hide the theatre (and the second Menu of the week card) while Match it or Quiz it is selected, and bring it back when a match or a quiz win opens a menu.

10. [quick] Film pages put The Big Lebowski in "Roadside Diner". Where: /menu/the-big-lebowski-1998/ breadcrumb ("Film menus > Roadside Diner") and the "More Roadside Diner menus" block. Screenshot 04. The film's menu is a bowling alley. Cause: build-seo.cjs line 52 uses `f.theme` from app.js `const T` (the spin wheel theme), not the menu's layout. Fix: label the section by the menu's own world (the layout name, "Bowling alley", or the venue) and call the theme block "More comedy picks" when the theme does not fit the venue.

11. [quick] Tap targets under 44px. Where and sizes (Chromium phone, 390): every watched checkbox in My movie checklist 22x22 (1,000 of them) and "Skip watched films" 22x22; Galaxy Video "Not seen yet" and "Kids mode" switches 48x28; the shopfront aisle signs "Horror" 47x13, "Sci-fi" 42x11, "Drama" 39x11, "Family" 66x18; "All options and prices" 117x24; "How it works" 71x24; candy bar photo credit links 18px tall; the account card button 66x43. Cause: index.html checklist and `.sv-hang` styles. Fix: wrap each checklist row so the whole row is the label (min-height 44px), give `.sv-hang` an invisible `::after` hit area of 44x44, set `min-height:44px` on `#howBtn`, `.where-more` and the shop switches' labels, and gather the candy credits into one "Photo credits" link that opens a list.

12. [quick] Forrest Gump and other diningcar page-2 strips crop to slivers. Where: printed menu page 2 of the diningcar layout. Screenshot 06. A portrait poster forced into a tall narrow strip shows sky and a fragment of bench, soft. Cause: the diningcar layout fills that strip with the poster when the film's stills are not tall enough (data/film-stills.json has no portrait-friendly still for this film). Fix: in the diningcar layout use the still with the focus point from data/still-focus.json, or fall back to the logo on the menu colour, never a stretched poster crop.

13. [quick] The quiz score grid uses emoji squares. Where: daily quiz result, screenshot 12 (right panel). The green and red emoji squares sit oddly against the cinema type and render differently by phone. Fix: draw them as small gold and dark red ticket stubs in CSS, keep the emoji only in the shared text.

14. [quick] Galaxy Video walk-in shows an empty scene for about a second in Safari. Where: tap Galaxy Video, WebKit phone. The shopfront photo is still loading at 1 second (complete false, width 0) and lands by 3 seconds. Cause: the walk-in image has `loading="lazy"` (index.html, `#wiScene img`). Fix: drop `loading="lazy"` on that one image and preload galaxy-front-1000.webp when the Galaxy Video tab gets focus or hover, so the doors open on a picture.

15. [quick] Candy bar popcorn picture never loads. Where: Candy bar, both engines. `#cbPop` (assets/hero/popcorn.webp) reports not loaded even after scrolling the whole counter. It is decorative, so the cost is a missing touch rather than a broken screen, but it is a file shipped and never seen. Cause: index.html line 3322 `loading="lazy"` on an element that starts hidden or off the layout. Fix: remove `loading="lazy"` or set the src when the counter opens.

16. [medium] When Harry Met Sally's guest check is "Katz's" but holds Sally's diner order. Where: printed menu, screenshot 23 (middle row). The check reads "Katz's Delicatessen" with chef salad, oil and vinegar on the side, and apple pie a la mode. Sally's famous order is at a diner on the drive to New York, not at Katz's (where the line is "I'll have what she's having"). Cause: the hand-built check layout data. Fix: split the check into "the drive" and "Katz's", or keep Katz's and replace the salad and pie with Katz's own lines (pastrami on rye is already there; add a knish and a black and white cookie).

## What I could not test

- A real sign-in (email code and Google), real room codes and real Dinner Duels against the live Supabase project. Member screens were checked with a seeded member against a fake database built the same way as check-card-stats and check-final-cut.
- Real iPhone Safari. WebKit in Playwright is close but not the same; safe areas, the home bar and real printing to PDF from Safari's share sheet were not tested.
- Printing on paper. PDFs were checked as rendered images only.
- Google Search Console and how the film pages actually rank, and the live preview images in real link cards (Messages, Facebook). I confirmed the og:image tags point at the right 1200 wide menu pictures.
- api.themoviedb.org and Wikipedia were not reached directly; film facts were checked by web search, and a few lines (Halloween II's "It's time, Michael", Bring It On's "cheer-ocracy" line) I could not confirm either way.
- Sound, haptics and the reduced motion setting beyond what the check scripts cover.
