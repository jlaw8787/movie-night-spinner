/* A fingerprint of everything that draws a film's printed menu preview (review 30, item 14): the film's built data, its layout file
   (menu-formats/<fmt>.js for shared layouts, formats/<key>.js for hand-built menus) and the shared price code in app.js
   (priceSense, priceTidy, houseCap, priceFix). scripts/render-previews.cjs saves it per film in data/preview-stamps.json when it renders;
   scripts/check-ripple.cjs fails when a film's fingerprint no longer matches its preview, so a price or menu change cannot go live with a
   stale picture on the Google film page. */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), vm = require('vm');
const R = path.resolve(__dirname, '..');
const rd = p => fs.readFileSync(path.join(R, p), 'utf8');
const slug = id => id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
let cache = null;
function load() {
  if (cache) return cache;
  const app = rd('app.js');
  const pick = (a, b) => { const i = app.indexOf(a); if (i < 0) return ''; const j = b ? app.indexOf(b, i + a.length) : -1; return app.slice(i, j < 0 ? i + 4000 : j); };
  const priceCode = pick('window.priceSense=function', 'const low1=') + pick('function houseCap(', 'function fullMenu(');
  const core = rd('formats-core.js'), m = core.match(/FMT_INDEX=(\{[^;]*?\})[;,\n]/);
  const index = m ? JSON.parse(m[1]) : {};
  const fmt = JSON.parse(rd('data/film-format.json'));
  cache = { priceCode, index, fmt, files: {} };
  return cache;
}
function file(p) { const c = load(); if (!(p in c.files)) c.files[p] = fs.existsSync(path.join(R, p)) ? rd(p) : ''; return c.files[p]; }
function stamp(id) {
  const c = load(), s = slug(id), h = crypto.createHash('sha1');
  h.update(file(`data/film/${s}.json`));
  const own = c.index[id], lib = c.fmt[id] && c.fmt[id].format;
  h.update(own ? file(`formats/${own}.js`) : lib ? file(`menu-formats/${lib}.js`) : '');
  h.update(c.priceCode);
  return h.digest('hex').slice(0, 12);
}
module.exports = { stamp, slug, STAMPS: 'data/preview-stamps.json' };
