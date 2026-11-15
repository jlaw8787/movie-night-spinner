# There's Something About Mary (1998)

Layout: prom (kept). Venue: Senior Prom, 1985, Cumberland, Rhode Island.

## Venue
The prom Ted never got to (zip accident) is the film's opening set piece, and it fits the prom layout. The layout's stock "Spring Fling, Class of 1998" is remapped to "Senior Prom, Class of 1985".

## Facts and quotes
- Plot facts (Cumberland RI, 1985, Mary asks Ted to the prom, the zip, Pat finds Mary in Miami, Tucker is really Norm the pizza delivery boy, the hair gel, Magda's dog on speed, Jonathan the singing narrator): https://en.wikipedia.org/wiki/There%27s_Something_About_Mary
- Note: "I couldn't believe that she knew my name." Ted (first sentence of his line). https://en.wikiquote.org/wiki/There%27s_Something_About_Mary
- "Franks and Beans!" Warren, outside the bathroom (Wikiquote).
- "Is that... is that hair gel?" Mary (Wikiquote), wink as "Is that hair gel?"
- Mary's wish list: "sausage hot dogs and beer, not lite beer, but beer" (Wikiquote). House drink.
- "Have you seen my baseball?" Warren (Wikiquote), wink.
- Tagline "Love is in the hair." (Wikiquote taglines).

## Unsure
- The school's name is not given on the pages, so the venue is "Senior Prom, 1985".

## Round 1 fix (15 Nov)
- Miami Cuban sliders out (Miami is 13 years after the prom). Wikiquote: Warren, "Have you seen my baseball?" (arancini).

## Fix (15 Nov)
Later pass on the rescore (vibe 3.4). Prom layout kept; the Miami half brought in through lines.
- Garlic knots line now "Healy spies on Mary in Miami" (Wikipedia: Pat moves to Miami, where he spies on Mary). Tried Healy's "Tight little package... affirmative" (Wikiquote) but the layout cut the speaker's name, so it went.
- House starter now "Magda's cheese ball and crackers", note "From next door to Mary's flat." (Wikipedia: Mary's neighbour Magda).
- House beer note now "Mary's ad: after 36 holes of golf." (Wikiquote: Mary's "36 holes of golf ... sausage hot dogs and beer, not lite beer, but beer. That's my ad").
- Back footer wink now "Ted picks up a hitchhiker. Bad idea" (Wikipedia: driving to Miami he picks up a hitchhiker and is arrested over the body parts left in his car; Wikiquote police scene).
- Winks list: "Franks and beans" (said on the dish and cue) swapped for "Dom steals shoes from Mary's flat" (Wikipedia: Dom in Mary's apartment struggling to steal her shoes). Only the last wink prints on this layout.
- Not done: the hitchhiker's seven-minute abs; no opened page had it.
- Sources: https://en.wikipedia.org/wiki/There%27s_Something_About_Mary, https://en.wikiquote.org/wiki/There%27s_Something_About_Mary (raw, read 15 Nov).

## Own menu (15 Nov)
Off the shared prom layout (Josh called the prom designs trash) onto its own hand-built menu, fmtNowShowing in formats.js (generated formats/nowshowing.js), after Josh's approved Canva proof (wip/next100/canva/mary-canva-fixed.png). One 1344x960 face.
- Look: cream paper, hot pink, sunshine yellow and aqua. Header "Senior Prom, 1985 / Miami, 1998" in Lilita One with a yellow shadow, "Love is in the hair." in Pacifico. Menu card with pink, yellow and aqua section tabs and dashed rules; the poster inside a pink neon "Now showing" sign (Tilt Neon) with marquee bulbs, a drawn sun and palm behind it; the quote on a zig-zag card; aqua showtime strip. Palm, sun, bulbs and sparkles are drawn trim only.
- Fonts: all specs already shipped (Lilita One, Pacifico, Tilt Neon, Nunito 0,400;0,700;0,800;1,400;1,700). No new font files.
- Dishes, names, film lines, food lines, recipes, quote and cue unchanged. Prices added (6.50, 4.25, 8.95, 12.95, 5.50, 4.50). House lines print: Magda's cheese ball (3.95) and the beer (2.75); the beer drops off with No alcohol or kids on.
- Winks: "Coming up" board (Magda's dog on speed, Jonathan the singing narrator, the hitchhiker); the 1985 prom ticket (Admit Ted and Mary, Mind the zip); "Is that hair gel?" as a still caption.
- Stills (TMDB, from data/film-stills.json, none blocked, none poster art): /siIpNYkGwD0VYl1vGTuvKVJko5t.jpg the hair gel ("Is that hair gel?", Wikiquote); /koJa7oZNpxXGXNspVllW9MdqFTY.jpg Healy in his car with a listening rig ("Healy spies on Mary in Miami", Wikipedia); /vGryShor1iOIT4TuP3AlghYSFwI.jpg Ted in 1985 with braces; cue still /51hHkBv4hj31bnaECQcXR0RYkGX.jpg Ted on a stretcher on prom night with Mary in her dress ("Prom night, 1985: off to hospital, not the prom", Wikipedia: Ted is taken to the hospital and misses the prom). That still has a white strip down its right edge, so it is shown left-aligned in a frame that crops it off.
- Diet: data/diet text pairs (new DIET_TEXT in the src file, written by mk.py) turn the franks and beans name and food line vegetarian, the cordon bleu food line to the eggplant, and the punch food line alcohol-free.
- Tools: FORMAT carries "own": "nowshowing", and pack.py put now takes a film with "own" off data/film-format.json instead of putting it back on prom.
- Checks: check-print-text pass, sweep shots and Save PDF looked over, audit-extract run, all tests pass.
