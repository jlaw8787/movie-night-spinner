# Unsure line chase: agent brief

Josh's call (7 Nov, 10:30pm): chase all 990 unsure lines. Settle each one as ok or wrong with a source, and fix the wrong ones. Give this brief to each agent with its list of slugs.

---

You are settling "unsure" fact lines on printed movie-night menus for the Movie Night Spinner app (repo /home/claude/movie-night-spinner). Read docs/AUDIT.md first (fact rules, quote rules, signed note rules, result file format). Then, for each slug in your list:

1. Open audit/results/<slug>.json. Work only on facts with `"verdict": "unsure"` and no `"done": true`. Leave every other line alone.
2. Research each one from the shell. These need no WebSearch and work every time:
   - `node scripts/audit-src.cjs grep "Film (Year)" word "short phrase" ...` shows transcript lines around each word, plus Wikipedia and Wikiquote hits. This is the main tool. Try two or three wordings (a prop, a name, a food).
   - `node scripts/audit-src.cjs plot "Film (Year)"` for the Wikipedia article, `quotes` for Wikiquote. Avoid dumping the whole transcript (`script`), it is long; grep it.
   - Use WebSearch only when the shell sources say nothing, and keep it to a handful per agent (other agents share the budget).
   - The film id is the "id" field in the result file.
3. Settle it:
   - `ok` when a source shows it: the transcript has the line or the scene, or the plot says it. A plain menu joke that claims nothing about the plot is ok too.
   - `wrong` when a source shows something else, or when nothing you can open shows it after a real try. A real try for a scene, prop or sight gag includes one WebSearch: famous visual moments (Mrs Deagle's stair lift in Gremlins) are often not in the dialogue or the Wikipedia plot. Never cut a famous scene for lack of a transcript line (Josh, 7 Nov: no film may miss its iconic lines or scenes). An unproven claim about the film counts as wrong: replace it with something you can show. Josh wants every line settled, not left unsure.
4. Update the fact in place: set `verdict` to "ok" or "wrong", replace `why` with one plain sentence on what the source shows, set `source` to the link printed by audit-src (or the page you read), and add `"settled": "2026-11-08"`. Keep `text`, `where` and `printed`. Do not set `done` (the fix run does that).
5. For each wrong line, write the fix:
   - `fix`: the replacement, in the same voice and within about 20 per cent of the length, so it fits the layout. Smallest change that makes it true. The film wins over the layout's habit.
   - Real quotes only inside quote marks or signed as spoken; check them in the transcript word for word. No song lyrics, ever. Signed notes written in a character's voice are fine if true to the plot (Josh, 7 Nov).
   - For `note` and `note-by` lines add `fix_note` as docs/AUDIT.md shows (scripts/audit-apply-notes.cjs writes those, so no op is needed for them).
   - For every other wrong line add an op to audit/ops/<slug>.json (create it if missing): `{"id":"Film (Year)","ops":[{"old":"exact text as stored","new":"replacement"}]}`. Append to "ops" if the file exists. The old text must be the stored text: check it with `node scripts/card-ops.cjs find "Film (Year)" "exact text"`. A printed line can differ from the stored one in case (headings print in capitals) or by a "Serve the mains when" lead-in, so find the stored form. For a dish name, the one op renames it on the card, recipes and shopping together; if the cue or a note also names that dish, add an op for those strings too.
   - If the text is not found anywhere (some poster editions live in movie-menus.js), still write the fix in the result file and add `"nofind": true` to the fact.
6. Do not edit any other file. Do not run build-data, card-ops apply, audit-apply-notes or audit-report.

Writing style for everything: plain Australian English. No em dashes or en dashes anywhere; use commas, full stops or "to". No AI-sounding phrasing. Paraphrase sources in "why"; never paste more than a short line.

When done, reply with one line per film: slug, ok count, wrong count, and anything left with nofind.
