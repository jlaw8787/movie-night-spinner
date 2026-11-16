#!/usr/bin/env node
/* Builds data/quiz.json for Quiz night (the third tab in the cinema, quiz.js).
   Written questions live in data/trivia.json (three per film, shared with Win the film). This file holds what the
   auto rounds need, so they can never be wrong:
   - s: up to five real TMDB stills per film for the picture round (no text in the frame, not on the film's
     still-block list, wide frames only)
   - d: up to three dish names from the film's own menu for the menu round (a dish naming the film, or a word built on it, is left out)
   - g: the film's genres, sr: its series, so wrong answers come from like films and never from the same series
   Run: node scripts/build-quiz.cjs (build-data.cjs runs it too). */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), D = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const films = D('data/films.json'), stills = D('data/film-stills.json'), block = D('data/still-block.json');
const genres = D('data/film-genres.json'), series = D('data/series.json'), names = D('data/dish-names.json');
const SR = {};
for (const s of series) for (const id of (s.release || [])) SR[id] = s.id;
const STOP = new Set(['the', 'and', 'of', 'a', 'an', 'in', 'on', 'to', 'part', 'movie', 'with', 'for', 'from', 'my', 'me']);
const words = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w));
const out = {};
let noS = 0, noD = 0;
for (const f of films) {
  const id = f.title + ' (' + f.year + ')', o = {};
  const bad = new Set(block[id] || []);
  const s = (stills[id] || []).filter(x => x && x[0] && !bad.has(x[0]) && x[3] == null && x[1] / x[2] > 1.6 && x[1] / x[2] < 1.95).map(x => x[0]).slice(0, 5);
  if (s.length) o.s = s; else noS++;
  const tw = new Set(words(f.title));
  const n = names[id] || [];
  /* a starter, a main and a sweet, then fill from the rest of the card; skip any dish that names the film */
  const ok = d => d && !words(d).some(w => tw.has(w) || [...tw].some(t => t.length >= 4 && w.startsWith(t)));
  const pick = [];
  for (const grp of [n[0], n[1], n[2]]) { const d = (grp || []).find(x => ok(x) && !pick.includes(x)); if (d) pick.push(d) }
  for (const grp of n) for (const d of (grp || [])) if (pick.length < 3 && ok(d) && !pick.includes(d)) pick.push(d);
  if (pick.length >= 3) o.d = pick.slice(0, 3); else noD++;
  if (genres[id]) o.g = genres[id];
  if (SR[id]) o.sr = SR[id];
  out[id] = o;
}
fs.writeFileSync(path.join(ROOT, 'data/quiz.json'), JSON.stringify(out));
if (require.main === module) console.log(`quiz.json: ${Object.keys(out).length} films, ${noS} with no picture round, ${noD} with no menu round`);
