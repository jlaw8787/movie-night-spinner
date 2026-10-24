# 9.5 polish brief

These era menus were redesigned yesterday (read `BRIEF.md` in this folder for the original standard and creative direction, which still apply). They now score 9.0 to 9.3. The owner wants every one at **9.5**. He is a trade-qualified chef and former restaurateur, and his eye goes straight to weak food names and anything that looks unfinished.

## What separates 9.2 from 9.5
1. **Dish names on the page.** Many still print plain names like "Iced coffee", "Crumb cake", "Chianti", "Bourbon on the rocks". A 9.5 menu has names you'd be pumped to order, tied to the film: "Argyle's limo bar old fashioned", "Bonzai Bill's sake-glazed wings". You can now change what prints, see "Label overrides" below.
2. **Every line earns its place.** Notes should be a sharp film wink or Easter egg, not filler like "A plate at Tony's bar." Make the small print, stamps and props funny or knowing for fans.
3. **Easter eggs fans will spot**, built into the design: prices that are famous numbers from the film, order or table numbers, props, minor characters, locations, a wink at a line in a few words (never more than about six words, no song lyrics).
4. **Finish.** Even spacing, nothing cramped, no awkward one-word line endings on names, no dead space, a clear visual hierarchy, the paper object feels real.
5. **Accuracy.** Only details you are sure are in the film. If unsure, leave it out.

## Label overrides (new)
Create `rework/<fmt>.labels.json` to change what prints for a dish without touching the recipe data:
```
{"Die Hard (1988)": {"Bourbon on the rocks": {"n": "Argyle's limo bar old fashioned", "d": "Bourbon, brown sugar & orange bitters, one big cube.", "note": "Argyle shows off the limo bar."}}}
```
- The key inside the film is the dish's current `k` (look at the film's spec in `/home/claude/polish/formats.js`, search for the film id). Don't change `k`.
- `n` is the printed name, `d` the printed description, `note` the printed film note. All optional.
- The printed name must still describe the same food and drink (the recipe and shopping list don't change). Keep `d` true to the dish.
- Names under about 40 characters, `d` under about 80 characters, notes under about 50.
- Rules from BRIEF.md apply: no em or en dashes, no real brand or restaurant names, plain Australian English, no AI words (elevate, indulge, iconic, nod to, homage, perfect for). Kids and family films stay alcohol-free.

## Preview (stricter now)
`python3 preview.py <fmt>` applies your renderer and labels file. It now reports `SPILL`: any text running out of its own card or off the page. **SPILL must be empty.** Open `shots/<fmt>.jpg` with the Read tool every time and look at it closely.

## Your job
For each fmt in your list: improve the renderer in `rework/<fmt>.js` and/or add `rework/<fmt>.labels.json` until you'd honestly grade it 9.5. Change only those files. No builds, no git, don't edit formats.js.

Finish with one line per menu: fmt, what you changed, honest grade.

## Round 2 rules from the owner (25 Oct 2026). These override anything above.
1. **The menu is an object that exists inside that film's universe.** Ask: what printed thing would a character in this film actually pick up? Jurassic Park is a fold-out visitor centre guide with a park map. A Chinese takeaway in the film is a takeaway menu. A deli is an order pad or wall board. A hotel is a room service card. A precinct is a report form. Use folds only if that object folds. No shared template look: if two menus feel like the same layout with different colours, one of them is wrong.
2. Reference: `shots/jurassic.jpg` (renderer `jurassic.js`) is the bar. Look at it before you start.
3. **SVG does not render in the saved image.** Build maps, stamps, badges and shapes from positioned divs (border-radius, borders, rotate transforms). Also avoid clip-path, CSS filters on text, vertical text, background-clip:text, mix-blend-mode, repeating gradients and inset box-shadow.
4. Fill the page. No big empty patches, no text jammed against an edge. Text must sit at least 10px inside its card. Check the jpg, not just the SPILL line: overflow:hidden can hide clipped text from the checker.
5. Minimum sizes still apply (names 17px, desc and notes 13px, small print 10px, credit 9px). Photos under about 40% of the page.
6. Only use film details you are certain are in the film. If unsure, leave it out. No real brands or real restaurants. No song lyrics. Seafood dishes stay seafood. No em or en dashes. Plain Australian English, no AI words.
7. Family films are alcohol-free on the page (names, notes, props): suite, ooze, lair, roadtrip, tonys, gimbels, toystore, moodslime, maytable, pizzatime, maitland, jurassic.
8. The printed name must still describe the same food or drink as the recipe (labels only change the printed text).
