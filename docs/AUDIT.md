# Fact and vibe audit

Started 7 Nov 2026 at Josh's request. It checks two things on every film's menu, for all 900 films:

1. **Facts.** Is every line true to the film? That means the showtime cue, dish names and notes, house lines, venue, sign, winks, captions and quotes.
2. **Vibe.** Is the menu cool? Does it fit the film's world, theme and tone, and use the moments fans remember? This covers both the words and the look.

The audit only finds problems and records them. Fixes are made later, in batches, and each fix is ticked off in the film's result file. Any new chat can pick up from the files below.

## Where everything lives

| What | Where | In git |
|---|---|---|
| What each menu says: printed words per face, phone menu, cue, venue, house lines, cooked dishes, and where each kind of line comes from | `audit/cards/<slug>.json` (made by `scripts/audit-extract.cjs`) | yes |
| A half-size picture of each printed face | `audit/shots/<slug>-<face>.jpg` | no, rebuild with the script |
| The verdict for one film | `audit/results/<slug>.json` (format below) | yes |
| Everything in one list: wrong lines with the file they live in, lowest vibe scores first | `docs/audit-report.md` (made by `scripts/audit-report.cjs`) | yes |

The slug is the film id in lower case with every run of other characters turned into "-". For example, "Dumb and Dumber (1994)" becomes `dumb-and-dumber-1994`.

Commands, from the repo folder:

```
NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/audit-extract.cjs ["Film (Year)" ...]   # all 900 take about an hour
node scripts/audit-report.cjs
```

## Sources

Use them in this order. Take inspiration from them, but never copy text across.

- **Facts:** Wikipedia's plot section, then IMDb's plot summary and FAQ.
- **Quotes:** IMDb quotes and Wikiquote. A line printed as a character's words, in quote marks or signed with their name, must be something they actually say. Anything else is flagged, even if it is close.
- **Moments, props, running jokes and food on screen:** the film's Fandom wiki, IMDb trivia, TV Tropes and Letterboxd reviews.

Fetching: open pages through WebSearch first, then fetch a result link. Direct links to Wikiquote and some other sites are refused unless they came from a search. If no source could be opened for a call, say so in "why", and leave the "source" link empty rather than citing a page that was never read.

## Fact rules

Each checked line gets one of these verdicts:

- `ok`: true to the film, or plainly a menu joke that claims nothing about the plot.
- `wrong`: the film shows something else. Wrong person, wrong thing, wrong place, wrong order, a scene that never happens, or a quote never said. Example: "Harry and Lloyd spike Sea Bass's burger". In the film the peppers go in Mental's burger, and Sea Bass spits on Harry's.
- `unsure`: the sources don't settle it. Say what is unclear.

Lines that make a claim always get checked:

- the cue
- every dish note that names a scene, person or place
- the venue and sign
- the note and its "by" name
- winks, captions and stamps
- house lines
- any quote

Plain food descriptions, such as "Beef patty griddled with cheddar", are left alone.

How to call the edge cases (tightened after the pilot, 7 Nov):

- **The cue.** Check both cues: the one printed on the card (where `cue-printed`) and the data cue in the card file's `cue` field (where `cue`). They can differ on hand-built menus.
- **Lines that aren't printed.** Lines in the data that appear on neither the printed menu nor the phone are still checked, because they can surface later. Mark them `"printed": false`. They come after printed lines when fixing.
- **Quotes.** A line in quote marks, or set out as something a character says, must be the film's own words. Small wording slips are `wrong`, with the real line in "fix". An invented quote is `wrong` even when it sounds like the character.
- **Signed notes.** A note written by a character in the film's world, such as a napkin, a memo or a sign signed "Chili P.", is not dialogue. It is `ok` if it is true to the character and the plot.
- **Unmarked nods.** A film line used as a nod without quote marks, such as "Big Gulps, huh?", is `ok` if it is close and plainly a reference.
- **Split lines.** A line split across face entries ("Seats seven," and "and smooth.") is recorded with `text` as the longest single piece exactly as printed, and `full` as the whole line joined.
- **Counting ok lines.** `checked_ok` counts each logical claim line once, even when it is printed in two places.

Every `wrong` or `unsure` line records:

- the exact text as printed
- why it is wrong
- the source link
- a suggested line in the same voice and about the same length, so it fits the layout

### The signed note on shared menus (Josh's call, 7 Nov)

Most shared layouts print a note signed by a character (venue `note`, from data/film-flavour.json). Wave 1 found about two in three were made-up quotes. From now on, each note has a kind:

- `"kind": "quote"`: the character's real line, read on an opened quote page and said by that character. One short line, 15 words or fewer. The menu prints it in quote marks.
- `"kind": "note"`: a note the character writes, in their voice, true to the plot. The menu prints it with no quote marks, and a heading like "Overheard at the window" becomes "A note from the window".

Never use song lyrics. For every note line that is wrong or unsure, add `fix_note` to the fact. It holds the replacement exactly as it should be stored. Change `by` when the real line belongs to someone else:

```json
"fix_note": {"text": "I'm into survival.", "by": "Nancy Thompson", "kind": "quote"}
```

When no real line fits, write a note instead:

```json
"fix_note": {"text": "Back by six. Don't fall asleep before then.", "by": "Nancy", "kind": "note"}
```

Keep the note within about 20 per cent of the current length, so it still fits its panel. `scripts/audit-apply-notes.cjs` writes fix_note into data/film-flavour.json and sets `done`.

## Vibe rules

Score each of these from 1 to 5. Overall is the average of the five, to one decimal. A 5 means a fan would grin. A 3 means it's fine but generic. A 1 means it misses the film.

- **world:** does the venue, the layout and the paper feel like a place in this film's world?
- **moments:** are the film's best-known scenes, props, lines and running jokes used? List the ones missing.
- **food:** are the dishes ones the film eats, or would plausibly eat? Are they named with wit?
- **tone:** does the writing sound like the film (deadpan, gritty, sweet, camp) and not like a generic menu?
- **look:** do the colours, type, photos and props suit the film? This is judged from the picture in audit/shots.

Then write:

- **verdict:** one plain sentence.
- **missing:** up to 6 iconic moments, props or foods the menu could use. Name the scene each comes from.
- **ideas:** up to 4 concrete changes, each naming what it replaces. For example: "Swap 'Aspen snowflake cookies' for a Big Gulp slushie ('Big Gulps, huh? Alright!')."
- **flat:** true if the overall vibe is under 3.5. These films go on the rework list.

Changing content or design on a film is a design change, so Josh approves it before it is made. Fact fixes are corrections and can be made straight away.

## Result file format: audit/results/<slug>.json

```json
{
  "id": "Dumb and Dumber (1994)",
  "checked": "2026-11-07",
  "facts": [
    {"text": "Serve the hot chilli burgers when Harry and Lloyd spike Sea Bass's burger at the truck stop.",
     "where": "cue", "verdict": "wrong",
     "why": "The hot peppers go in Mental's burger. Sea Bass spits on Harry's burger and gets stuck with their bill.",
     "source": "https://en.wikipedia.org/wiki/Dumb_and_Dumber",
     "fix": "Serve the hot chilli burgers when Harry and Lloyd load Mental's burger with hot peppers.",
     "printed": true, "done": false}
  ],
  "checked_ok": 14,
  "vibe": {"world": 4, "moments": 2, "food": 3, "tone": 3, "look": 4, "overall": 3.2,
    "verdict": "Right truck and van, but it leaves out most of the film's famous moments.",
    "missing": ["Big Gulps (gas station)", "Turbo Lax (diner)", "So you're telling me there's a chance (Mary)"],
    "ideas": ["Swap 'Cherry slushie in a big cup' for 'Big Gulp cherry slushie'"],
    "flat": true, "done": false}
}
```

`where` names the kind of line, so the report can find its file:

- `cue`
- `tagline`
- `dish-name`
- `dish-note`
- `house`
- `venue`
- `sign`
- `note`
- `note-by`
- `wink`
- `caption`
- `quote`
- `cue-printed` (the cue as printed on the card)
- `prop` (tickets, tags, business cards, stamps, napkins)
- `footer`
- `card` (any other printed line)

The report searches the data files for the exact text and prints the file and field. A line on a hand-built menu points to formats.js.

## Status

See the top of docs/audit-report.md for films checked, wrong lines found and fixed, and flat menus waiting for Josh's call.
