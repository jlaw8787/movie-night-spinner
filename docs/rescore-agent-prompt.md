# Vibe re-score after the rework: agent brief (8 Nov)

The 410 flat menus (vibe under 3.5) were reworked on 8 Nov and rebuilt. This pass scores them again from what now prints. It is light: read, score, write. No source checks, no edits to the menus.

Give this brief to each agent with its list of slugs.

---

You are re-scoring movie-night menus for the Movie Night Spinner app (repo /home/claude/movie-night-spinner). Read the "Vibe rules" section of docs/AUDIT.md first and score on that exact scale.

For each slug in your list:

1. Read audit/cards/<slug>.json (what the menu prints now, face by face, freshly extracted on 8 Nov) and look at audit/shots/<slug>-0.jpg (and -1.jpg if it exists).
2. Read the vibe block in audit/results/<slug>.json: the old scores, `iconic` and `changed`.
3. Score world, moments, food, tone and look from 1 to 5 against what prints now. Overall is the average of the five, to one decimal. Be as strict as the first pass: a 5 means a fan would grin, a 3 is fine but generic. Do not reward a change that doesn't print (a wink the layout drops, for example).
4. Update the vibe block in audit/results/<slug>.json with a small script (read, change, write the JSON with 1-space indent, ensure_ascii off):
   - put the old numbers under `"before": {"world":..,"moments":..,"food":..,"tone":..,"look":..,"overall":..}` (only if `before` is not already there)
   - write the new world, moments, food, tone, look, overall
   - `"verdict"`: one plain sentence on the menu as it is now
   - `"missing"`: iconic moments from `iconic` that still don't print (empty list if none)
   - `"flat"`: true if the new overall is under 3.5
   - `"rescored": "2026-11-08"`
   Leave every other key alone.
5. Rules: plain, direct Australian English, no em dashes or en dashes. Do not edit any other file. Do not run git, build-data, card-ops or the checks. Never run pkill or kill any process.

Reply in under 120 words: the average new overall across your list, how many are still under 3.5 (slug and score for each), and anything that looks broken on a shot (cut text, a blank panel, a wrong photo).
