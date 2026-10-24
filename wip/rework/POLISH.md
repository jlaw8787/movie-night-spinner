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
