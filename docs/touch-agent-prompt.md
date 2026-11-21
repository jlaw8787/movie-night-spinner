# Review 34 card sweep: one touch per card, food first notes (agent brief)

Josh's call (21 Nov 2026): agent teams fix every card the checks flag, gated by the checks. You get a list of films. For each film, fix the printed words so that:

1. **One touch per card.** A film touch (a prop, a place, a gag, a catchphrase: Con Air's bunny, Pudge the fish, the big knife, tractor tipping, Emily's diet) shows on the card twice at most, counting dish names, dish notes, house lines, the signed note, the showtime cue, the tagline, the prop slip and the winks. A character's name may sit on three things at most (menus name dishes after people). A two-word film phrase ("Ted's drinking problem", "that'll do") never prints twice. The signed note's words never repeat inside a dish note, house note or cue (Shaun of the Dead printed the pint line twice).
2. **Food first.** Every dish note opens by saying what the food or drink is (ingredient, cooking, the dish itself), then at most one short film touch. Bad: "The crew shares a croissant without Emmet. Warm croissants with leg ham." Good: "Warm ham and cheese croissants, one each. Emmet's gets eaten first." A note must never skip the food ("Mater's wasabi mix-up, not on this plate."). The note must match its dish name (a "chamomile" tea note mentions chamomile). Starts with a capital letter.
3. **Spread the touches out.** When you take a touch off a line, replace it with a different true moment from the film, so the card gets more varied, not plainer. That is the point: one card, many different nods to the film.

## How to work

For each film in your list:

1. See what is flagged:
   - `node scripts/check-touch.cjs --list "Film (Year)"`
   - `node scripts/check-food-first.cjs --list "Film (Year)"` (a hint list; also read every note yourself and fix any that lead with the plot)
2. See every printed field: `node -e "const F=require('./data/films.json'),FL=require('./data/film-flavour.json'),H=require('./data/film-house.json');const id='Film (Year)';const f=F.find(x=>x.title+' ('+x.year+')'===id);console.log(JSON.stringify({S:f.S.map(d=>d.slice(0,2)),M:f.M.map(d=>d.slice(0,2)),W:f.W.map(d=>d.slice(0,2)),K:(f.K||[]).map(d=>d.slice(0,2)),cue:f.P,tagline:f.T,flavour:FL[id],house:H[id]},null,1))"`. For the 124 hand-built cards (their text also sits in formats.js), `node scripts/card-ops.cjs find "Film (Year)" "text"` shows every place a string sits. audit/cards/<slug>.json shows what the card printed (may be a little stale).
3. Check any new moment, line or prop against the film before you use it:
   - `node scripts/audit-src.cjs plot "Film (Year)"`, `quotes "Film (Year)"`, `grep "Film (Year)" word "phrase"`
   Only use what a source shows. If you cannot confirm it, do not use it.
4. Write ops to `audit/ops34/touch-<slug>.json` (slug: lower case, every run of non letters or digits becomes "-"):
   `{"id":"Film (Year)","ops":[{"old":"exact stored text","new":"new text"}, {"set":"cue","value":"..."}, {"set":"house.d","value":{"n":"...","note":"..."}}, {"set":"flavour.winks","value":[...]}, {"set":"flavour.note","value":{"text":"...","by":"Name","kind":"quote"|"note"}}]}`
   - The printed note in data/recipes/<slug>.json (and data/diet) can differ from films.json: card-ops find shows every copy; fix each different string with its own op.
   - Use /tmp/<your batch name> for scratch files: other agents share /tmp.
   - `old` must be the text exactly as stored (check with card-ops find). Prefer replacing whole note strings. Ops run in order.
   - Dish names: rename only if the name is the repeat; the new name stays exciting and tied to the film's world (a place, a time, another moment), never a plain menu name like "Cheese board". Renames and the new name must honestly describe the same food (the recipe does not change). A rename op changes the card, recipes and shopping together. If the cue or a note names the dish, add an op for that too.
   - Prop lines and taglines change with plain {"old","new"} ops on their exact stored text.
   - Keep the same number of winks; keep house lines as {n, note} (keep "meat": true if it was there).

## Rules (Josh's, all of them hold)

- Every line true to the film: venue, characters, moments. Real quotes only in quote marks, word for word (check with audit-src). A line in a character's voice that is not a real quote is a note: `"kind":"note"` (it prints as "A note from <name>"). Keep the film's iconic lines and scenes somewhere on the card: do not remove the only place an iconic line sits; move the other copy instead.
- The signed note (flavour.note) is usually the iconic line: keep it, change the copies.
- Length: a new note stays within about 10 per cent of the old one's length, and under 100 characters. Never add dishes or new lines.
- Plain, direct Australian English and spelling (flavour, colour, centre, biscuits on Australian/UK/NZ films; in-world US names keep their spelling). No em dashes or en dashes anywhere: commas, full stops or "to". No AI-sounding phrasing, no puns for their own sake. Every dish reads as a real, exciting dish.
- Family films stay family friendly; no grog added to a kids' film.
- Money, prices, layouts and recipes: do not touch.
- Do not edit any other file. Do not run build-data, card-ops apply or the browser checks.

When done, reply with one line per film: slug, number of ops, and anything you could not fix.
