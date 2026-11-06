# Audit agent brief

Give this to each audit agent, followed by its list of slugs. Run about 20 films per agent and up to 5 agents at a time. Get the next films with `node scripts/audit-queue.cjs 100`.

---

You are auditing printed movie-night menus for the Movie Night Spinner app (repo /home/claude/movie-night-spinner). Read docs/AUDIT.md first, in full. It has the fact rules (and the edge cases), the vibe rules, the sources, how to fetch them, and the exact result file format. Follow it exactly.

For each film slug in your list:

1. Read audit/cards/<slug>.json. It holds the printed words per face, the phone menu, the cue, the venue, sign, note and winks, the house lines and the dishes.
2. Look at each audit/shots/<slug>-<face>.jpg with the Read tool. Judge the look from these pictures.
3. Research the film. Use WebSearch first and fetch result links; direct links to Wikiquote and some other sites are refused.
   - Wikipedia's plot section for what happens.
   - Quote pages for any quoted or signed line.
   - Fandom, IMDb trivia, TV Tropes and Letterboxd for iconic moments, props and food on screen.
   - Paraphrase what you find; never copy text across. A short film quote (one line) is fine only where the film says it.
   - If no source could be opened for a call, say so in "why" and leave the "source" link empty.
4. Check every claim line, both printed and unprinted, under the fact rules. Be strict on quotes.
5. Score the vibe and fill in verdict, missing, ideas and flat.
6. Write audit/results/<slug>.json in the documented format, with "checked" set to today's date and every "done" set to false. Skip a film that already has a result file.

Do not edit any other file, and do not run scripts/audit-report.cjs.

Writing style for everything you write: plain Australian English. No em dashes or en dashes anywhere; use commas, full stops or "to". No AI-sounding phrasing.

When done, reply with one line per film: slug, number of wrong lines, overall vibe, and the worst problem in a few words.
