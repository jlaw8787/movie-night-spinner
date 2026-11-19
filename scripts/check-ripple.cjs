/* Ripple check: every film in data/films.json must have every piece the site uses, everywhere.
   Run: node scripts/check-ripple.cjs            (fails on any gap not in the baseline)
        node scripts/check-ripple.cjs --list     (prints every gap, baseline included)
        node scripts/check-ripple.cjs --baseline (rewrites data/ripple-baseline.json from today's gaps; only on Josh's OK)
   The Publish site workflow runs this first, so a film with a missing piece cannot go live.
   The full checklist for new films and new features is docs/RIPPLE.md. Add a new source here when a feature adds one. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.resolve(__dirname, '..');
const rd = p => fs.readFileSync(path.join(R, p), 'utf8');
const json = p => JSON.parse(rd(p));
const has = p => fs.existsSync(path.join(R, p));
const jsConst = (file, name) => { const c = {}; vm.runInNewContext(rd(file) + `\n;this.__v=${name}`, c); return c.__v; };
const slug = (t, y) => (t + ' (' + y + ')').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); /* same as scripts/build-data.cjs */

const films = json('data/films.json');
const PSTAMP = require('./preview-stamp.cjs'), STAMPS = has(PSTAMP.STAMPS) ? json(PSTAMP.STAMPS) : {};
const sitemap = rd('sitemap.xml');
const keyed = {
  'dish names': json('data/dish-names.json'),
  'dish notes': json('data/dish-notes.json'),
  'genres': json('data/film-genres.json'),
  'stills': json('data/film-stills.json'),
  'quiz rounds': json('data/quiz.json'),
  'written quiz questions': json('data/trivia.json'),
  'TMDB id': json('data/tmdb-ids.json'),
  'menu colours': json('data/film-palette.json'),
  'title logo': Object.assign({}, json('data/film-logos.json'), json('data/logo-block.json')), /* logo-block: no logo exists, the menu letters the title instead */
  'poster': jsConst('tmdb-posters.js', 'TMDB_POSTERS'),
  'rating': jsConst('ratings.js', 'RATINGS'),
  'trailer entry': jsConst('trailers.js', 'TRAILERS'),
  'where to watch': jsConst('providers.js', 'PROVIDERS'),
  'Galaxy Video aisle': jsConst('aisles.js', 'FILM_AISLE'),
};

const gaps = [];
for (const f of films) {
  const id = `${f.title} (${f.year})`, s = slug(f.title, f.year);
  const miss = what => gaps.push(`${id}: ${what}`);
  for (const [what, src] of Object.entries(keyed)) if (!(id in src)) miss(what);
  if (!f.S && !f.hw && !f.e) miss('menu dishes');
  if (!has(`data/film/${s}.json`)) miss('built film data');
  /* review 30: the film page preview must match today's menu and prices (scripts/preview-stamp.cjs) */
  if (has(`assets/menu-previews/${s}.jpg`) && STAMPS[id] !== PSTAMP.stamp(id)) miss('menu preview out of date (node scripts/render-previews.cjs --stale)');
  if (!has(`data/recipes2/${s}.json`) && !has(`data/recipes/${s}.json`)) miss('recipes');
  if (!has(`menu/${s}/index.html`)) miss('Google film page');
  if (!has(`assets/menu-previews/${s}.jpg`)) miss('printed menu preview picture');
  if (!sitemap.includes(`/menu/${s}/`)) miss('sitemap entry');
  const tv = keyed['written quiz questions'][id]; if (tv && (!Array.isArray(tv) || tv.length < 3)) miss('under 3 written quiz questions');
}

const basePath = path.join(R, 'data/ripple-baseline.json');
const arg = process.argv[2];
if (arg === '--baseline') { fs.writeFileSync(basePath, JSON.stringify(gaps.sort(), null, 1) + '\n'); console.log(`baseline written: ${gaps.length} known gaps`); process.exit(0); }
const base = new Set(fs.existsSync(basePath) ? JSON.parse(fs.readFileSync(basePath, 'utf8')) : []);
const fresh = gaps.filter(g => !base.has(g)), fixed = [...base].filter(g => !gaps.includes(g));
if (arg === '--list') gaps.forEach(g => console.log((base.has(g) ? 'known  ' : 'NEW    ') + g));
console.log(`ripple check: ${films.length} films, ${gaps.length} gaps (${base.size} known, ${fresh.length} new)` + (fixed.length ? `, ${fixed.length} known gaps now fixed: run --baseline to lock that in` : ''));
if (fresh.length) { console.log('\nNew gaps, fix these before deploy (see docs/RIPPLE.md):'); fresh.forEach(g => console.log('  ' + g)); process.exit(1); }
