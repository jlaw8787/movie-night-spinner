#!/usr/bin/env node
/* Builds www/, the web folder that goes inside the iPhone and Android app (capacitor.config.json webDir).

   Copies only what the site needs to run, and leaves out:
   - working folders: docs, audit, sweep, scripts, tests, wip, node_modules, the native projects and the rest below;
   - notes and source files: *.md, formats.js (built into formats/), poster briefs and rollout lists;
   - the website-only pages (privacy and support open on reeldinner.com from the app);
   - studio artwork, per docs/ARTWORK-RIGHTS.md: the 124 generated posters, the film frame, the menu photos
     blocked in app-art.js and the Galaxy Video photos that show posters (the app copies go instead; the raw shopfront photo is left out).

   Run from the repo root: npm run build:app (then npx cap sync). */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'www');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');

require('./app-art.cjs');
const ART = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'app-art.js'), 'utf8'))(w); return w.APP_ART; })();

const NEVER_DIRS = new Set(['docs', 'audit', 'sweep', 'scripts', 'tests', 'wip', 'node_modules', 'www', 'ios', 'android', '.git', '.github', '.netlify', 'data']);
const rd = p => fs.existsSync(path.join(ROOT, p)) ? fs.readFileSync(path.join(ROOT, p), 'utf8') : '';
const index = rd('index.html'), code = index + rd('app.js') + rd('formats-core.js') + rd('app-mode.js');

/* top-level files: the page, its manifest and worker, and every root script the page or app.js names */
const files = new Set(['index.html', 'manifest.webmanifest', 'sw.js', 'app-mode.js', 'app-art.js']);
for (const m of code.matchAll(/["'(=]\.?\/?([\w.-]+\.(?:js|css|webmanifest))(?:\?[^"')]*)?["')]/g))
  if (fs.existsSync(path.join(ROOT, m[1])) && fs.statSync(path.join(ROOT, m[1])).isFile()) files.add(m[1]);
files.delete('formats.js');

/* folders the page loads from: always formats/, menu-formats/ and assets/, plus any other root folder the code
   names (local fonts or PDF libraries added later land here without a change to this script) */
const dirs = new Set(['assets', 'formats', 'menu-formats']);
for (const m of code.matchAll(/["'(]\.?\/?([a-z][\w-]*)\/[\w./%-]+\.(?:js|css|woff2?|ttf|otf|json|webp|png|jpe?g|svg|gif)/gi))
  if (!NEVER_DIRS.has(m[1]) && fs.existsSync(path.join(ROOT, m[1])) && fs.statSync(path.join(ROOT, m[1])).isDirectory()) dirs.add(m[1]);

/* data: the film files and the json files the page fetches, nothing else from data/ */
const data = new Set();
for (const m of code.matchAll(/data\/([\w-]+\.json)/g)) if (fs.existsSync(path.join(ROOT, 'data', m[1]))) data.add('data/' + m[1]);

const blocked = new Set([...ART.block, ...Object.keys(ART.swap)]);
/* shopfront*.webp is the raw photo the Galaxy Video front was composed from (poster lookalikes in the windows); the site never shows it */
const NEVER_FILE = /^assets\/hero\/shopfront[\w-]*\.webp$/;
const skip = p => blocked.has(p) || NEVER_FILE.test(p) || ART.prefix.some(x => p.startsWith(x)) || /\.md$/i.test(p) || /(^|\/)(_old|clean)\//.test(p) || /(^|\/)\./.test(p);

fs.rmSync(OUT, {recursive: true, force: true});
let n = 0, bytes = 0, left = 0;
const copy = p => {
  if (skip(p)) { left++; return; }
  const to = path.join(OUT, p);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.copyFileSync(path.join(ROOT, p), to);
  n++; bytes += fs.statSync(to).size;
};
const walk = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of files) copy(f);
for (const d of dirs) for (const f of walk(path.join(ROOT, d))) copy(rel(f));
for (const f of walk(path.join(ROOT, 'data/film'))) copy(rel(f));
for (const f of data) copy(f);

/* the app build always runs in app mode, even before Capacitor reports in */
const ix = path.join(OUT, 'index.html');
const ixHtml = fs.readFileSync(ix, 'utf8');
if (!ixHtml.includes('<script id="reel-boot">')) { console.error('index.html has no <script id="reel-boot"> app mode switch'); process.exit(1); }
fs.writeFileSync(ix, ixHtml.replace('<script id="reel-boot">', '<script>window.REEL_APP_BUILD=true</script>\n<script id="reel-boot">'));

/* nothing studio-made may be in the folder */
const bad = walk(OUT).map(rel).filter(p => /menu-posters|menu-details|galaxy-front\.|galaxy-front-1|hero\/aisles|hero\/latedoor|hero\/shopfront/.test(p));
if (bad.length) { console.error('Studio artwork found in www:', bad.slice(0, 5)); process.exit(1); }
console.log(`www/: ${n} files, ${(bytes / 1048576).toFixed(1)} MB. Left out ${left} pictures and notes. Folders: ${[...dirs].join(', ')}.`);
