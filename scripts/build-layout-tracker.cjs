/* Layout tracker (24 Nov, Josh): which printed menu layout every film is on, rebuilt by build-data so it never goes stale.
   Writes docs/layout-tracker.csv (opens in Excel or Google Sheets; GitHub shows it as a searchable table).
   Columns: film, layout, built (shared layout or hand-built one-off), era, tone, venue, money, alcohol-free card, film page. */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const rj = p => JSON.parse(fs.readFileSync(path.join(R, p), 'utf8'));
const films = rj('data/films.json'), FM = rj('data/film-format.json'), FL = rj('data/film-flavour.json');
const core = fs.readFileSync(path.join(R, 'formats-core.js'), 'utf8'), m = core.match(/FMT_INDEX=(\{[^;]*?\})[;,\n]/), HB = m ? JSON.parse(m[1]) : {};
const app = fs.readFileSync(path.join(R, 'app.js'), 'utf8');
const DRY_T = JSON.parse(app.match(/const DRY_THEMES=(\[[^\]]*\]);/)[1]), DRY_F = JSON.parse(app.match(/const DRY_FILMS=(\[[^\]]*\]);/)[1]);
const brands = {}; { const vm = require('vm'), ctx = { ESC: x => x }; vm.createContext(ctx); try { vm.runInContext(fs.readFileSync(path.join(R, 'formats.js'), 'utf8') + ';this.F=FMT_FILMS;', ctx); for (const [id, s] of Object.entries(ctx.F || {})) if (s && s.brand) brands[id] = s.brand; } catch (e) {} }
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const q = v => { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const rows = films.map(f => { const id = `${f.title} (${f.year})`, fm = FM[id] || {}, fl = FL[id] || {}, hb = HB[id];
  return [id, hb ? hb : fm.format || '', hb ? 'hand-built' : 'shared', fm.era || '', fm.tone || '', fl.venue || brands[id] || '',
    fl.currency || (fl.coin ? fl.coin : '$'), DRY_T.includes(f.theme) || DRY_F.includes(id) ? 'yes' : '', `https://reeldinner.com/menu/${slug(id)}/`]; });
rows.sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));
const out = [['Film', 'Layout', 'Built', 'Era', 'Tone', 'Venue', 'Money', 'Alcohol-free card', 'Film page'], ...rows].map(r => r.map(q).join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(R, 'docs/layout-tracker.csv'), out);
const n = {}; rows.forEach(r => { n[r[1]] = (n[r[1]] || 0) + 1; });
console.log(`layout-tracker.csv: ${rows.length} films, ${Object.keys(n).length} layouts`);
