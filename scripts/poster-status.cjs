#!/usr/bin/env node
// Read-only recovery audit. Never trust generated brief status as the queue.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {isDeepStrictEqual} = require('node:util');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const briefs = JSON.parse(read('poster-briefs.json')).films;
const rollout = JSON.parse(read('menu-artwork-rollout.json'));
const recipes = JSON.parse(read('poster-recipes.json')).films;
const source = read('movie-menus.js');
const context = vm.createContext({});
vm.runInContext(source, context, {timeout: 5000});
const editions = JSON.parse(vm.runInContext('JSON.stringify(MOVIE_MENU_EDITIONS)', context));
const rows = new Map(rollout.films.map(f => [f.id, f]));
const briefIds = new Set(briefs.map(f => f.id));
const errors = [];
const warnings = [];
const verified = new Set();
for (const [id, edition] of Object.entries(editions)) {
  const before = errors.length;
  const row = rows.get(id);
  if (!briefIds.has(id)) errors.push(`${id}: no source brief`);
  if (!row || row.status !== 'complete' || row.poster !== edition.poster)
    errors.push(`${id}: edition and rollout disagree`);
  if (edition.servings !== 4) errors.push(`${id}: servings must be four`);
  for (const [key, count] of [['s', 2], ['m', 1], ['w', 1], ['d', 1]]) {
    if (edition.menu?.[key]?.length !== count) errors.push(`${id}: wrong ${key} count`);
    for (const item of edition.menu?.[key] || [])
      if (!item.n || !item.note || !item.how || !item.shop?.length)
        errors.push(`${id}: incomplete ${key} recipe`);
  }
  if (!Array.isArray(edition.menu?.shopping)) errors.push(`${id}: missing shopping list`);
  const asset = edition.poster;
  if (typeof asset !== 'string' || !/^assets\/menu-posters\/[^/]+\.jpg$/.test(asset)) {
    errors.push(`${id}: invalid poster path`);
  } else if (!fs.existsSync(path.join(root, asset))) {
    errors.push(`${id}: missing poster ${asset}`);
  } else {
    const image = fs.readFileSync(path.join(root, asset));
    if (image.length <= 10000 || image.length >= 1000000 || image.readUInt16BE(0) !== 0xffd8)
      errors.push(`${id}: poster must be a JPEG between 10 KB and 1 MB`);
  }
  if (errors.length === before) verified.add(id);
}
for (const row of rollout.films)
  if (row.status === 'complete' && !editions[row.id]) errors.push(`${row.id}: complete without edition`);
const stale = briefs.filter(f => (f.poster_status === 'complete') !== verified.has(f.id)).map(f => f.id);
if (stale.length) warnings.push(`${stale.length} generated brief statuses disagree with checked editions; excluded from duplicate generation`);
if (rollout.completed !== verified.size) warnings.push(`Generated completed total is ${rollout.completed}; checked editions total ${verified.size}. Source owner maintains the generated total.`);
const recipeDifferences = Object.entries(editions).filter(([id, e]) => recipes[id] && !isDeepStrictEqual(e.menu, recipes[id].menu)).map(([id]) => id);
if (recipeDifferences.length) warnings.push('Existing editions differ from current recipe exports. Review their posters before changing dish text.');
const lanes = [];
for (let lane = 1; lane <= 5; lane++) {
  const films = briefs.filter(f => f.lane === lane);
  const start = source.indexOf(`// ===== LANE ${lane} START`);
  const end = source.indexOf(`// ===== LANE ${lane} END`);
  if (start < 0 || end <= start) errors.push(`Lane ${lane}: missing block markers`);
  else {
    const laneContext = vm.createContext({});
    vm.runInContext('const MOVIE_MENU_EDITIONS = {};\n' + source.slice(start, end), laneContext);
    const ids = vm.runInContext('Object.keys(MOVIE_MENU_EDITIONS)', laneContext);
    for (const id of ids) if (!films.some(f => f.id === id)) errors.push(`Lane ${lane}: wrong-lane edition ${id}`);
  }
  const pending = films.filter(f => !verified.has(f.id));
  lanes.push({lane, total: films.length, complete: films.filter(f => verified.has(f.id)).length,
    remaining: pending.length, next: pending.slice(0, 10).map(f => ({id: f.id, recipe_ready: f.recipe_ready === true}))});
}
const args = process.argv.slice(2);
let selected = lanes;
if (args.includes('--lane')) {
  const lane = Number(args[args.indexOf('--lane') + 1]);
  if (![1, 2, 3, 4, 5].includes(lane)) throw new Error('--lane requires 1, 2, 3, 4 or 5');
  selected = lanes.filter(l => l.lane === lane);
}
const report = {complete: verified.size, remaining: rollout.films.length - verified.size,
  stale_brief_statuses: stale, recipe_differences: recipeDifferences, warnings, errors, lanes: selected};
if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Checked ${verified.size} complete editions; ${report.remaining} films remain.`);
  for (const lane of selected) {
    console.log(`\nLane ${lane.lane}: ${lane.complete}/${lane.total} complete; ${lane.remaining} remaining. Next batch:`);
    for (const film of lane.next) console.log(`  ${film.id}${film.recipe_ready ? ' [recipe ready]' : ''}`);
  }
  for (const warning of warnings) console.log(`WARNING: ${warning}`);
  for (const error of errors) console.error(`ERROR: ${error}`);
}
if (errors.length) process.exitCode = 1;
