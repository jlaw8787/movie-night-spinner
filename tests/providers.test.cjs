// Where to watch: horror-only services (Bloodstream, Shudder) only on films with Horror in their genres.
// TMDB once matched Bloodstream to Beauty and the Beast (1991). scripts/refresh_providers.py filters the same way.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const s = fs.readFileSync(path.join(root, 'providers.js'), 'utf8');
const P = JSON.parse(s.slice(s.indexOf('{'), s.indexOf(';\nconst PROVIDERS_DATE')));
const G = JSON.parse(fs.readFileSync(path.join(root, 'data/film-genres.json'), 'utf8'));
const HORROR_ONLY = ['Bloodstream', 'Shudder'];
const bad = [];
for (const [film, v] of Object.entries(P)) {
  if ((G[film] || []).includes('Horror')) continue;
  for (const t of ['s', 'r', 'b']) for (const [n] of v[t] || []) if (HORROR_ONLY.includes(n)) bad.push(`${film}: ${n}`);
}
if (!/HORROR_ONLY/.test(fs.readFileSync(path.join(root, 'scripts/refresh_providers.py'), 'utf8'))) bad.push('refresh_providers.py lost its HORROR_ONLY filter');
if (bad.length) { console.error('providers test FAIL:\n ' + bad.join('\n ')); process.exit(1); }
console.log('providers test: ok, no horror-only service on a non-horror film');
