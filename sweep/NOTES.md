# shared-a notes for the lead

## Needs a change outside the files team leads may edit

1. Cooked dishes are locked in `data/recipes/<slug>.json` (and `movie-menus.js` for edition films). That file is the cooked menu, and it is not on the edit list. Renaming or replacing a cooked dish in `data/films.json` leaves the old name on the printed menu and adds the new one as an extra. So this batch only swapped dishes that are card extras, and added new ones. Two real problems sit in cooked dishes and are left for you:
   - Heat (1995): "Diner coffee and pie" is an apple pie listed under starters. It should move to sweets or be swapped for a savoury starter in `data/recipes/heat-1995.json` and `data/recipes2/heat-1995.json`.
   - Stranger than Fiction (2006): "Ana's three-flour brown butter cookies" is a sweet listed under starters, next to a second cookie sweet ("Ana's warm skillet cookie with ice cream"). Best fix: cookies move to sweets in place of the skillet cookie, and a savoury starter takes their spot. Needs `data/recipes/stranger-than-fiction-2006.json`.

2. A recipe added to `data/recipes2` for a card extra is ticked on by default in the planner (planOn only leaves `extra` dishes unticked), so these films now cook 6 by default rather than 5. If "cook 5" should hold, app.js could treat r2 dishes that are not in the exact menu as extras (unticked).
