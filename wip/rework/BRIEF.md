# Era menu rework brief

The site gives each film a printed A4 landscape menu (1123 x 794 px) drawn in HTML with inline styles. Each menu should look like a real printed object from inside the film's world: a takeaway trifold, a bowling score sheet, a firehouse work order, a corner store wall. The owner is a chef and former restaurateur. His bar is 9.5 out of 10.

These menus were built by another tool. They look slick, but they have three problems:
1. **Text is too small to read when printed.** Descriptions are often 7 to 11px.
2. **Photos dominate.** Film stills often fill half the page or more.
3. **Too many share one magazine template:** a big still, a cream card and small-caps labels. They should feel like a specific printed thing from the film.

## Your job
For each menu in your list, rewrite the renderer function in `rework/<fmt>.js` so it hits the standard below. Change only that function. Keep its name and signature `(f,spec,menu,poster)`.

## Standard
- **Minimum sizes on the 1123px page:**
  - Dish names 17px or more.
  - Dish descriptions and notes 13px or more.
  - Section labels and small print 10px or more.
  - Only a credit line like "Film imagery: TMDB" may go down to 9px.
- **Photos:**
  - Film stills and the poster together cover no more than about 40% of the page.
  - The poster or one strong still must still be clearly visible.
- **Concept:** it reads as a printed object from the film's world: a diner placemat, a precinct notepad, a deli order pad, a theatre programme, a matchbook-style supper club card, a hotel room service card. Use the film's real places and moments.
- **Layout:** no dead space and no clipped or overflowing text. Gaps are even and alignment is tidy.
- **Fonts:** keep the Google Fonts already used by that menu, since they're loaded from its FMT_FONTS entry, which you can't change. Pick sizes and weights for print.

## How the renderer works
- `menu.all` is the list of dishes. Each has `label`, `desc` (may be empty), `film` (film note), `price`, `how` and `special`.
- `spec` holds the per-film data. Look at the current function to see which fields it reads, such as spec.colA, spec.groups and spec.tag.
- Available helpers: `ESC(text)`, `fmtPosterImg(f,poster,w,h,extraCss)`, `fmtBack(poster)`, `fmtCue(f)` (the showtime cue), `FX_SP` (a flexible spacer), `fmtStill(...)` if the old function used it, `TMDB_IMG`, and `fmtStar(text,sub,bg,rotDeg,size)` for a starburst.
- **Saved images:** these are made with html2canvas. Avoid clip-path, CSS filters on text, writing-mode vertical text, background-clip:text and mix-blend-mode, because they break or garble in the export. Plain boxes, borders, gradients, transforms and images are fine.
- No em dashes or en dashes anywhere, and no brand logos.

## Preview loop (required)
After every change, run:

```
cd /tmp/claude-0/-home-claude/255d9f36-a28f-53a9-8508-211dbc596b89/scratchpad/rework && python3 preview.py <fmt>
```

It prints the smallest text sizes and any clipped text. It saves `shots/<fmt>.jpg` (the exact saved-image export) and `shots/<fmt>_phone.png`. **Open the jpg with the Read tool and look at it every time.** Iterate until you'd honestly grade it 9.5: readable at print size, film-specific, balanced and with no glitches.

## Output
Your edited `rework/<fmt>.js` files are the deliverable. Don't touch anything else in the repo, and don't run any build or git commands. At the end, reply with one line per menu: the fmt, the concept you went with, and your honest grade.

## Creative direction (from the owner, applies to everything)
Think like a chef-owner with the energy of modern cool, fun food culture: Momofuku-style big flavour and playful twists on classics, Animal-style unapologetic comfort food, Merivale-style venue vibes and theatre, Kogi-style street food mash-ups.
- **Big hits of flavour:** sauces, crunch, char, pickles, chilli, umami. Use high-low mash-ups, like a classic film dish done the way a cool modern venue would serve it.
- **The secret sauce:** strong movie ties and nostalgia. Each dish should feel like it walked out of that film. That's what ties the whole room together.
- **Easter eggs are huge.** Hide details fans will spot, for example:
  - a price that is a famous number from the film, like a year, a room number, a licence plate or a score;
  - a dish named after a minor character;
  - a note that winks at a famous line without quoting more than a few words;
  - a prop or location tucked into a description;
  - an order number, table number or phone number from the film.
- **Use TMDB for support:** character names, taglines, release year, locations and the film stills already listed in data/film-stills.json.
- **Never name real chefs or real restaurants** on the menus. They are inspiration only.
- **Keep it accurate.** Don't invent scenes, and keep any quoted line short.

Note for the remaining work: apply the creative direction above to every remaining film. For menus, put Easter eggs into the design itself too: prices, order numbers, tiny print, props.
