#!/usr/bin/env node
/* Makes the original type posters in assets/menu-posters/ (the fallback menu art shown when a film's poster and menu
   format can't load). Each poster is drawn in code: the film's title and year in the menu's own display font, the
   menu's colours, one simple drawn motif, and the five dishes from movie-menus.js. No film logos, studio marks,
   photos, stills or likenesses of anyone.

   Data: scripts/type-posters.json (one row per film: title, year, display font, body font, optional note font for
   the small text, colours, motif, layout, and optional dishInBody / maxLines / weight overrides).
   Needs Playwright and Chrome. Google Fonts load through the proxy when HTTPS_PROXY is set.

     PLAYWRIGHT_MODULE=/path/to/node_modules/playwright node scripts/make-type-posters.cjs [options]
       --only "Film (Year)"   make one film (repeatable)
       --out <dir>            write somewhere other than assets/menu-posters
       --sheet <file.jpg>     also write a contact sheet of every poster made
       --quality <n>          JPEG quality, default 82
       --sheet-only           with --sheet: make the sheet from posters already in the folder, render nothing
       --check                print contrast and fit warnings only, write nothing */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args[i + 1]; };
const only = args.flatMap((a, i) => a === '--only' ? [args[i + 1]] : []);
const outDir = path.resolve(opt('--out', path.join(root, 'assets/menu-posters')));
const sheetPath = opt('--sheet', null);
const quality = Number(opt('--quality', 82));
const checkOnly = args.includes('--check');
const sheetOnly = args.includes('--sheet-only');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'type-posters.json'), 'utf8'));
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'movie-menus.js'), 'utf8'), ctx);
const EDITIONS = JSON.parse(vm.runInContext('JSON.stringify(MOVIE_MENU_EDITIONS)', ctx));

/* colour helpers */
const hx = h => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => toHex(hx(a).map((v, i) => v + (hx(b)[i] - v) * t));
const lum = h => { const [r, g, b] = hx(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/* nudge fg towards black or white (whichever side of bg it sits on) until it reaches the contrast asked for */
function ensure(fg, bg, min) {
  if (contrast(fg, bg) >= min) return fg;
  const to = lum(bg) > 0.18 ? '#000000' : '#ffffff';
  for (let t = 0.05; t <= 1; t += 0.05) { const c = mix(fg, to, t); if (contrast(c, bg) >= min) return c; }
  return to;
}
function palette(row) {
  const c = Object.assign({}, row.colours);
  if (row.layout === 'frame') {
    /* paper hero: title in the hero colour on paper */
    c.title = ensure(row.colours.title || c.hero, c.paper, 7);
    c.motif = ensure(c.motif || c.accent, c.paper, 2.2);
    c.motif2 = ensure(c.accent, c.paper, 3);
    c.top = ensure(mix(c.ink, c.paper, 0.15), c.paper, 4.5);
  } else {
    c.title = ensure(row.colours.title || c.heroInk, c.hero, 7);
    let m = c.motif || c.accent;
    if (contrast(m, c.hero) < 2.2) m = mix(c.heroInk, c.hero, 0.25);
    c.motif = ensure(m, c.hero, 2.2);
    c.motif2 = ensure(mix(c.heroInk, c.hero, 0.45), c.hero, 1.6);
    c.top = ensure(mix(c.heroInk, c.hero, 0.2), c.hero, 4.5);
  }
  c.ink = ensure(c.ink, c.paper, 9);
  c.soft = ensure(mix(c.ink, c.paper, 0.25), c.paper, 5.5);
  c.accent = ensure(c.accent, c.paper, 4.6);
  c.yearOnHero = row.layout === 'frame' ? ensure(c.heroInk, c.hero, 4.5) : ensure(mix(c.heroInk, c.motif, 0.35), c.hero, 4.5);
  return c;
}

/* Motifs: simple generic objects and patterns drawn in a 200x200 box. A = main colour, B = second colour.
   None is traced from a film, poster or logo. */
const S = (A, w = 7) => `fill="none" stroke="${A}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const MOTIFS = {
  skyline: (A, B) => `<path fill="${A}" d="M14 176V118h22v-14h14v14h10V84h26v92zM90 176V58l14-14 14 14v118zM122 176V96h24v-18h12v18h10v80zM172 176v-46h16v46z"/><g fill="${B}">${[[24,128],[24,146],[66,96],[66,116],[66,136],[100,72],[100,92],[100,112],[100,132],[132,108],[132,128],[150,108],[150,128],[150,148]].map(([x, y]) => `<rect x="${x}" y="${y}" width="7" height="9"/>`).join('')}</g><rect x="10" y="176" width="180" height="6" fill="${A}"/>`,
  moon: (A, B) => `<path fill="${A}" d="M118 30a72 72 0 1 0 52 122A60 60 0 1 1 118 30z"/><g fill="${B}"><circle cx="160" cy="44" r="4"/><circle cx="176" cy="84" r="3"/><circle cx="142" cy="76" r="2.5"/></g>`,
  stars: (A, B) => [[100, 92, 46, A], [44, 56, 18, B], [158, 48, 14, B], [150, 150, 20, A], [50, 152, 12, B]].map(([x, y, r, c]) => star(x, y, r, c)).join(''),
  starburst: (A, B) => `<g ${S(A, 6)}>${Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8, r1 = i % 2 ? 40 : 30, r2 = i % 2 ? 86 : 70; return `<line x1="${100 + r1 * Math.cos(a)}" y1="${100 + r1 * Math.sin(a)}" x2="${100 + r2 * Math.cos(a)}" y2="${100 + r2 * Math.sin(a)}"/>`; }).join('')}</g><circle cx="100" cy="100" r="16" fill="${B}"/>`,
  car: (A, B) => `<path fill="${A}" d="M18 138v-22l18-6 22-30h70l26 30 26 6v22z"/><path fill="${B}" d="M66 88h28v22H52zM102 88h24l18 22h-42z"/><g fill="${A}" stroke="${B}" stroke-width="7"><circle cx="58" cy="140" r="17"/><circle cx="146" cy="140" r="17"/></g>`,
  taxi: (A, B) => `<rect x="84" y="56" width="32" height="14" rx="3" fill="${B}"/><path fill="${A}" d="M18 142v-22l18-6 22-30h84l22 30 18 6v22z"/><path fill="${B}" d="M66 92h30v22H52zM104 92h32l14 22h-46z"/><g fill="${A}" stroke="${B}" stroke-width="7"><circle cx="58" cy="144" r="17"/><circle cx="146" cy="144" r="17"/></g>`,
  bus: (A, B) => `<rect x="20" y="62" width="160" height="80" rx="12" fill="${A}"/><g fill="${B}">${[34, 66, 98, 130].map(x => `<rect x="${x}" y="74" width="24" height="26" rx="3"/>`).join('')}<rect x="160" y="74" width="12" height="40" rx="3"/></g><g fill="${A}" stroke="${B}" stroke-width="7"><circle cx="56" cy="146" r="15"/><circle cx="144" cy="146" r="15"/></g>`,
  train: (A, B) => `<rect x="46" y="30" width="108" height="130" rx="20" fill="${A}"/><rect x="60" y="46" width="80" height="44" rx="6" fill="${B}"/><g fill="${B}"><circle cx="72" cy="130" r="9"/><circle cx="128" cy="130" r="9"/><rect x="88" y="104" width="24" height="6" rx="3"/></g><path ${S(A, 7)} d="M64 160l-18 22M136 160l18 22M52 182h96"/>`,
  plane: (A, B) => `<path fill="${A}" d="M100 18c8 0 12 10 12 22v40l66 34v16l-66-18v40l20 14v12l-32-8-32 8v-12l20-14v-40l-66 18v-16l66-34V40c0-12 4-22 12-22z"/><circle cx="100" cy="44" r="5" fill="${B}"/>`,
  boat: (A, B) => `<path fill="${A}" d="M24 130h152l-22 34H48z"/><rect x="64" y="96" width="76" height="34" fill="${A}"/><g fill="${B}">${[74, 96, 118].map(x => `<circle cx="${x + 6}" cy="113" r="6"/>`).join('')}</g><rect x="84" y="62" width="16" height="34" fill="${A}"/><rect x="108" y="70" width="16" height="26" fill="${A}"/><path ${S(B, 5)} d="M20 178c14-8 26-8 40 0s26 8 40 0 26-8 40 0 26 8 40 0"/>`,
  coffee: (A, B) => `<path fill="${A}" d="M44 82h96v44a36 36 0 0 1-36 36H80a36 36 0 0 1-36-36z"/><path ${S(A, 9)} d="M140 96h12a16 16 0 0 1 0 32h-14"/><rect x="30" y="168" width="124" height="8" rx="4" fill="${A}"/><path ${S(B, 6)} d="M72 66c-8-10 8-16 0-28M96 66c-8-10 8-16 0-28M120 66c-8-10 8-16 0-28"/>`,
  pizza: (A, B) => `<path fill="${A}" d="M100 178L32 46a150 150 0 0 1 136 0z"/><path fill="${B}" d="M38 52a140 140 0 0 1 124 0l-6 12a126 126 0 0 0-112 0z"/><g fill="${B}"><circle cx="86" cy="86" r="11"/><circle cx="118" cy="98" r="10"/><circle cx="100" cy="134" r="9"/><circle cx="74" cy="64" r="0"/></g>`,
  ticket: (A, B) => `<path fill="${A}" d="M22 60h156v24a16 16 0 0 0 0 32v24H22v-24a16 16 0 0 0 0-32z"/><path stroke="${B}" stroke-width="4" stroke-dasharray="6 7" d="M136 66v68"/><g fill="${B}">${star(80, 100, 22, B)}</g>`,
  clock: (A, B) => `<circle cx="100" cy="100" r="74" fill="${A}"/><circle cx="100" cy="100" r="60" fill="none" stroke="${B}" stroke-width="4"/>${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${100 + 50 * Math.cos(a)}" y1="${100 + 50 * Math.sin(a)}" x2="${100 + 58 * Math.cos(a)}" y2="${100 + 58 * Math.sin(a)}" stroke="${B}" stroke-width="${i % 3 ? 3 : 6}"/>`; }).join('')}<path ${S(B, 7)} d="M100 100V58M100 100l30 18"/><circle cx="100" cy="100" r="7" fill="${B}"/>`,
  cards: (A, B) => `<rect x="34" y="40" width="80" height="116" rx="10" fill="${B}" transform="rotate(-12 74 98)"/><rect x="86" y="44" width="80" height="116" rx="10" fill="${A}" transform="rotate(10 126 102)"/><g transform="rotate(10 126 102)"><path fill="${B}" d="M126 76l22 26-22 26-22-26z"/></g>`,
  dice: (A, B) => `<rect x="28" y="62" width="76" height="76" rx="14" fill="${A}" transform="rotate(-14 66 100)"/><g transform="rotate(-14 66 100)" fill="${B}"><circle cx="48" cy="82" r="7"/><circle cx="66" cy="100" r="7"/><circle cx="84" cy="118" r="7"/></g><rect x="104" y="70" width="70" height="70" rx="13" fill="${A}" transform="rotate(16 139 105)"/><g transform="rotate(16 139 105)" fill="${B}"><circle cx="122" cy="88" r="6.5"/><circle cx="156" cy="88" r="6.5"/><circle cx="122" cy="122" r="6.5"/><circle cx="156" cy="122" r="6.5"/></g>`,
  cocktail: (A, B) => `<path fill="${A}" d="M38 44h124l-62 66z"/><path ${S(A, 8)} d="M100 108v54M68 166h64"/><circle cx="128" cy="58" r="10" fill="${B}"/><path ${S(B, 5)} d="M128 58l26-30"/>`,
  wine: (A, B) => `<path fill="${A}" d="M64 30h72c4 44-4 80-36 80s-40-36-36-80z"/><path fill="${B}" d="M68 62h64c-2 26-12 40-32 40s-30-14-32-40z"/><path ${S(A, 8)} d="M100 110v52M70 166h60"/>`,
  pint: (A, B) => `<path fill="${A}" d="M56 46h88l-10 126H66z"/><path fill="${B}" d="M54 36h92v18H54z"/><path fill="${B}" opacity=".35" d="M62 70h76l-2 20H64z"/>`,
  cutlery: (A, B) => `<path fill="${A}" d="M62 26h6v40h6V26h6v40h6V26h6v48c0 10-6 16-12 18v86H74V92c-6-2-12-8-12-18z"/><path fill="${A}" d="M128 26c16 8 22 34 22 60 0 10-6 16-14 16v76h-12V26z"/><circle cx="100" cy="100" r="0" fill="${B}"/>`,
  bowl: (A, B) => `<path fill="${A}" d="M28 96h144a72 72 0 0 1-144 0z"/><path ${S(B, 6)} d="M58 96c4-14 16-14 20 0M86 96c4-14 16-14 20 0M114 96c4-14 16-14 20 0"/><path ${S(A, 7)} d="M118 24l-30 66M140 30l-38 60"/><rect x="72" y="166" width="56" height="10" rx="5" fill="${A}"/>`,
  takeout: (A, B) => `<path fill="${A}" d="M42 74h116l-16 102H58z"/><path fill="${B}" d="M42 74l24-26h68l24 26z" opacity=".85"/><path ${S(A, 6)} d="M74 48c0-24 52-24 52 0"/><path ${S(B, 5)} d="M60 110h80"/>`,
  bridge: (A, B) => `<rect x="54" y="40" width="12" height="120" fill="${A}"/><rect x="134" y="40" width="12" height="120" fill="${A}"/><path ${S(A, 5)} d="M10 120Q60 30 60 44M60 44Q100 130 140 44M140 44Q140 30 190 120"/><path ${S(B, 3)} d="M80 120V82M100 120V96M120 120V82M30 120V96M170 120V96"/><rect x="6" y="118" width="188" height="10" fill="${A}"/><path ${S(B, 4)} d="M10 160c14-7 26-7 40 0s26 7 40 0 26-7 40 0 26 7 40 0"/>`,
  palm: (A, B) => `<path fill="${A}" d="M96 176c4-40 6-74 0-104h10c6 30 4 66 2 104z"/><path fill="${A}" d="M100 70c-20-26-52-30-76-14 26-4 48 4 64 22zM102 70c20-28 54-30 78-12-26-4-50 4-66 22zM98 74c-30-6-54 8-62 34 14-16 34-24 58-20zM104 74c30-8 56 6 64 32-14-16-36-24-60-20zM100 68c-4-24 4-42 24-52-12 16-14 32-14 52z"/><circle cx="160" cy="44" r="16" fill="${B}"/><rect x="40" y="174" width="120" height="6" rx="3" fill="${A}"/>`,
  sun: (A, B) => `<circle cx="100" cy="112" r="42" fill="${A}"/><g ${S(A, 7)}>${Array.from({ length: 9 }, (_, i) => { const a = Math.PI + i * Math.PI / 8; return `<line x1="${100 + 56 * Math.cos(a)}" y1="${112 + 56 * Math.sin(a)}" x2="${100 + 80 * Math.cos(a)}" y2="${112 + 80 * Math.sin(a)}"/>`; }).join('')}</g><rect x="14" y="128" width="172" height="60" fill="${B}" opacity=".0"/><path ${S(B, 6)} d="M20 140h160M44 156h112M68 172h64"/>`,
  snowflake: (A, B) => `<g ${S(A, 7)}>${[0, 60, 120].map(r => `<g transform="rotate(${r} 100 100)"><path d="M100 22v156M100 48l-16-16M100 48l16-16M100 152l-16 16M100 152l16 16"/></g>`).join('')}</g><circle cx="100" cy="100" r="10" fill="${B}"/>`,
  rose: (A, B) => `<path ${S(B, 6)} d="M100 108c-2 26 2 50 6 72M104 140c14-12 30-12 38-4-12 8-24 10-38 4z"/><path fill="${A}" d="M100 30c26 0 44 18 44 42 0 22-20 40-44 40s-44-18-44-40c0-24 18-42 44-42z"/><path ${S(B, 4)} d="M80 72c4-16 34-18 40 0-2 12-22 18-30 8M96 50c10-4 22 0 28 10"/>`,
  bolt: (A, B) => `<path fill="${A}" d="M118 18L48 112h44l-16 70 76-104h-46z"/><path fill="${B}" opacity=".6" d="M112 30L62 104h22z"/>`,
  mountain: (A, B) => `<path fill="${A}" d="M10 168L76 62l30 42 24-30 60 94z"/><path fill="${B}" d="M76 62l-16 26 10-4 8 8 8-10 6 6zM130 74l-10 14 8-2 6 6 6-6z"/><circle cx="154" cy="40" r="12" fill="${B}"/>`,
  planet: (A, B) => `<circle cx="100" cy="100" r="46" fill="${A}"/><ellipse cx="100" cy="104" rx="88" ry="22" fill="none" stroke="${B}" stroke-width="7" transform="rotate(-16 100 104)"/><path fill="${A}" d="M58 84a46 46 0 0 1 84 0z"/>${star(36, 40, 7, B)}${star(166, 158, 9, B)}`,
  rocket: (A, B) => `<path fill="${A}" d="M100 18c26 20 36 54 30 104H70c-6-50 4-84 30-104z"/><circle cx="100" cy="70" r="13" fill="${B}"/><path fill="${A}" d="M70 104l-22 30v18l24-12zM130 104l22 30v18l-24-12z"/><path fill="${B}" d="M82 126h36l-6 22h-24zM90 150h20l-10 32z"/>`,
  wave: (A, B) => `<path fill="${A}" d="M12 150c30-6 44-30 46-60 4-40 44-60 82-44-30 0-48 20-42 48 6 30 40 40 80 26v50H12z"/><path ${S(B, 5)} d="M20 182c14-6 26-6 40 0s26 6 40 0 26-6 40 0 26 6 40 0"/>`,
  crown: (A, B) => `<path fill="${A}" d="M30 144L22 62l42 38 36-60 36 60 42-38-8 82z"/><rect x="30" y="150" width="140" height="18" rx="4" fill="${A}"/><g fill="${B}"><circle cx="22" cy="58" r="8"/><circle cx="100" cy="36" r="9"/><circle cx="178" cy="58" r="8"/><circle cx="100" cy="122" r="9"/><circle cx="62" cy="128" r="6"/><circle cx="138" cy="128" r="6"/></g>`,
  hat: (A, B) => `<path fill="${A}" d="M56 120c0-40 6-70 20-74 10-2 18 10 24 10s14-12 24-10c14 4 20 34 20 74z"/><rect x="56" y="102" width="88" height="16" fill="${B}"/><path fill="${A}" d="M14 128c20-10 52-12 86-12s66 2 86 12c-16 14-50 20-86 20s-70-6-86-20z"/>`,
  key: (A, B) => `<circle cx="64" cy="100" r="38" fill="${A}"/><circle cx="64" cy="100" r="14" fill="${B}"/><path fill="${A}" d="M96 92h86v16h-14v20h-14v-20h-12v14h-14v-14H96z"/>`,
  envelope: (A, B) => `<rect x="26" y="52" width="148" height="100" rx="8" fill="${A}"/><path ${S(B, 6)} d="M30 58l70 54 70-54M30 146l50-42M170 146l-50-42"/>`,
  phone: (A, B) => `<rect x="62" y="20" width="76" height="160" rx="16" fill="${A}"/><rect x="72" y="38" width="56" height="74" rx="4" fill="${B}"/><g fill="${B}">${[0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<circle cx="${82 + c * 18}" cy="${128 + r * 14}" r="4.5"/>`)).join('')}</g>`,
  heart: (A, B) => `<path fill="${A}" d="M100 172C34 124 18 92 26 66c8-28 46-38 74-8 28-30 66-20 74 8 8 26-8 58-74 106z"/><path ${S(B, 5)} d="M54 72c6-12 20-16 30-10"/>`,
  rings: (A, B) => `<circle cx="78" cy="108" r="44" fill="none" stroke="${A}" stroke-width="13"/><circle cx="124" cy="96" r="44" fill="none" stroke="${B}" stroke-width="13"/><path fill="${A}" d="M66 54l12-18 12 18-12 10z"/>`,
  money: (A, B) => `<rect x="30" y="66" width="140" height="74" rx="6" fill="${B}" transform="rotate(-8 100 103)"/><rect x="30" y="60" width="140" height="74" rx="6" fill="${A}"/><circle cx="100" cy="97" r="22" fill="none" stroke="${B}" stroke-width="5"/><path ${S(B, 5)} d="M100 84v26M92 90c0-6 16-6 16 0s-16 8-16 14 16 6 16 0M44 74h12M144 120h12"/>`,
  coins: (A, B) => `${[[64, 150], [64, 132], [64, 114], [64, 96], [136, 150], [136, 132]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="38" ry="12" fill="${A}" stroke="${B}" stroke-width="4"/>`).join('')}<circle cx="120" cy="64" r="30" fill="${A}" stroke="${B}" stroke-width="5"/><circle cx="120" cy="64" r="17" fill="none" stroke="${B}" stroke-width="3"/>`,
  pianokeys: (A, B) => `<rect x="18" y="56" width="164" height="96" rx="6" fill="${B}"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${22 + i * 20}" y="60" width="18" height="88" rx="2" fill="${A}"/>`).join('')}${[1, 2, 4, 5, 6].map(i => `<rect x="${22 + i * 20 - 6}" y="60" width="12" height="52" rx="2" fill="${B}"/>`).join('')}`,
  manhole: (A, B) => `<circle cx="100" cy="100" r="76" fill="${A}"/><circle cx="100" cy="100" r="64" fill="none" stroke="${B}" stroke-width="4"/>${[-40, -20, 0, 20, 40].map(d => `<line x1="${100 + d}" y1="${100 - Math.sqrt(3600 - d * d)}" x2="${100 + d}" y2="${100 + Math.sqrt(3600 - d * d)}" stroke="${B}" stroke-width="4"/>`).join('')}<path stroke="${B}" stroke-width="4" d="M40 100h120"/>`,
  vault: (A, B) => `<rect x="24" y="24" width="152" height="152" rx="14" fill="${A}"/><circle cx="100" cy="100" r="54" fill="none" stroke="${B}" stroke-width="6"/><circle cx="100" cy="100" r="10" fill="${B}"/><g ${S(B, 6)}>${[0, 72, 144, 216, 288].map(r => `<line transform="rotate(${r} 100 100)" x1="100" y1="90" x2="100" y2="58"/>`).join('')}</g>`,
  badge: (A, B) => `<path fill="${A}" d="M100 22l64 22v50c0 44-28 72-64 86-36-14-64-42-64-86V44z"/>${star(100, 96, 30, B)}`,
  clapper: (A, B) => `<rect x="30" y="86" width="140" height="88" rx="6" fill="${A}"/><path fill="${A}" d="M28 76l132-34 6 24-132 34z"/><g fill="${B}"><path d="M48 70l18-5 14 22-18 5zM84 61l18-5 14 22-18 5zM120 52l18-5 14 22-18 5z"/></g><path ${S(B, 5)} d="M48 116h104M48 140h70"/>`,
  curtain: (A, B) => `<rect x="18" y="24" width="164" height="20" fill="${B}"/><path fill="${A}" d="M22 44h70c-8 40-6 90 10 134H22zM178 44h-70c8 40 6 90-10 134h80z"/><path ${S(B, 4)} d="M42 52c-4 40-2 84 6 120M64 52c-4 40-2 84 6 120M158 52c4 40 2 84-6 120M136 52c4 40 2 84-6 120"/>`,
  disco: (A, B) => `<path ${S(A, 4)} d="M100 10v26"/><circle cx="100" cy="100" r="62" fill="${A}"/><g stroke="${B}" stroke-width="3" fill="none"><ellipse cx="100" cy="100" rx="62" ry="20"/><ellipse cx="100" cy="100" rx="62" ry="44"/><ellipse cx="100" cy="100" rx="20" ry="62"/><ellipse cx="100" cy="100" rx="44" ry="62"/><path d="M38 100h124M100 38v124"/></g>${star(160, 54, 9, B)}${star(40, 160, 7, B)}`,
  record: (A, B) => `<circle cx="100" cy="100" r="76" fill="${A}"/><g fill="none" stroke="${B}" stroke-width="2" opacity=".7"><circle cx="100" cy="100" r="64"/><circle cx="100" cy="100" r="54"/><circle cx="100" cy="100" r="44"/></g><circle cx="100" cy="100" r="24" fill="${B}"/><circle cx="100" cy="100" r="5" fill="${A}"/>`,
  garlic: (A, B) => `<path fill="${A}" d="M100 34c-6 18-24 26-40 40-16 16-20 42-8 64 12 24 34 34 48 34s36-10 48-34c12-22 8-48-8-64-16-14-34-22-40-40z"/><path ${S(B, 4)} d="M100 60c-14 26-14 74 0 112M100 60c14 26 14 74 0 112M78 76c-14 22-14 60 2 90M122 76c14 22 14 60-2 90"/><path ${S(A, 6)} d="M100 34c0-8 2-14 6-20"/>`,
  gavel: (A, B) => `<g transform="rotate(-35 100 100)"><rect x="56" y="48" width="88" height="40" rx="8" fill="${A}"/><rect x="50" y="52" width="12" height="32" rx="3" fill="${B}"/><rect x="138" y="52" width="12" height="32" rx="3" fill="${B}"/><rect x="94" y="88" width="12" height="90" rx="5" fill="${A}"/></g><rect x="110" y="156" width="70" height="16" rx="4" fill="${B}"/>`,
  couch: (A, B) => `<rect x="42" y="64" width="116" height="58" rx="14" fill="${A}"/><rect x="18" y="92" width="38" height="58" rx="12" fill="${A}"/><rect x="144" y="92" width="38" height="58" rx="12" fill="${A}"/><rect x="50" y="112" width="100" height="32" rx="8" fill="${B}"/><path ${S(A, 7)} d="M34 150v18M166 150v18"/>`,
  orange: (A, B) => `<circle cx="100" cy="110" r="64" fill="${A}"/><path fill="${B}" d="M100 46c10-20 34-28 52-22-6 18-28 28-52 22z"/><path ${S(B, 5)} d="M100 48v-14"/><g fill="${B}" opacity=".5"><circle cx="78" cy="96" r="3"/><circle cx="120" cy="124" r="3"/><circle cx="96" cy="140" r="3"/></g>`,
  suitcase: (A, B) => `<path ${S(A, 9)} d="M76 64V48c0-6 4-10 10-10h28c6 0 10 4 10 10v16"/><rect x="26" y="64" width="148" height="104" rx="12" fill="${A}"/><path ${S(B, 6)} d="M62 64v104M138 64v104M26 106h148"/>`,
  bird: (A, B) => `<path fill="${A}" d="M30 118c20-30 54-46 86-40l22-22c8-4 18 0 22 8l14 4-14 6c0 26-16 48-46 58l-20 30-10-26c-20 0-38-6-54-18z"/><circle cx="148" cy="66" r="4" fill="${B}"/><path ${S(B, 5)} d="M60 112c22 0 40-10 56-24"/>`,
  ferris: (A, B) => `<circle cx="100" cy="88" r="66" fill="none" stroke="${A}" stroke-width="8"/><g ${S(A, 4)}>${Array.from({ length: 8 }, (_, i) => `<line transform="rotate(${i * 45} 100 88)" x1="100" y1="88" x2="100" y2="22"/>`).join('')}</g><g fill="${B}">${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<rect x="${100 + 66 * Math.cos(a) - 9}" y="${88 + 66 * Math.sin(a) - 4}" width="18" height="16" rx="4"/>`; }).join('')}</g><path ${S(A, 8)} d="M100 88l-40 92M100 88l40 92M50 180h100"/>`,
  lantern: (A, B) => `<path ${S(A, 5)} d="M100 14v20"/><rect x="74" y="32" width="52" height="12" rx="3" fill="${B}"/><ellipse cx="100" cy="102" rx="58" ry="62" fill="${A}"/><path ${S(B, 4)} d="M100 42c-22 20-22 100 0 120M100 42c22 20 22 100 0 120M60 70c-8 20-8 44 0 64M140 70c8 20 8 44 0 64"/><rect x="74" y="160" width="52" height="12" rx="3" fill="${B}"/><path ${S(B, 4)} d="M92 172v16M108 172v16"/>`,
  house: (A, B) => `<path fill="${A}" d="M24 104L100 40l76 64v76H24z"/><rect x="132" y="48" width="16" height="36" fill="${A}"/><g fill="${B}"><rect x="48" y="112" width="30" height="28"/><rect x="122" y="112" width="30" height="28"/><rect x="86" y="132" width="28" height="48"/></g><path ${S(B, 4)} d="M63 112v28M48 126h30M137 112v28M122 126h30"/>`,
  lighthouse: (A, B) => `<path fill="${A}" d="M76 176l10-110h28l10 110z"/><rect x="80" y="42" width="40" height="24" fill="${B}"/><path fill="${A}" d="M74 42l26-22 26 22z"/><path ${S(B, 6)} d="M82 98h36M80 132h40"/><path fill="${B}" opacity=".45" d="M120 46l70-22v40zM80 46l-70-22v40z"/><rect x="44" y="174" width="112" height="8" rx="4" fill="${A}"/>`,
  apple: (A, B) => `<path fill="${A}" d="M100 62c-22-14-62-10-66 32-4 40 22 82 46 82 10 0 14-6 20-6s10 6 20 6c24 0 50-42 46-82-4-42-44-46-66-32z"/><path ${S(A, 6)} d="M100 62c0-14 4-26 12-34"/><path fill="${B}" d="M108 50c8-16 26-22 40-18-6 16-24 24-40 18z"/>`,
  newspaper: (A, B) => `<rect x="34" y="30" width="132" height="148" rx="4" fill="${A}"/><rect x="48" y="44" width="104" height="20" fill="${B}"/><g fill="${B}" opacity=".85"><rect x="48" y="74" width="50" height="44"/>${[74, 86, 98, 110].map(y => `<rect x="106" y="${y}" width="46" height="5"/>`).join('')}${[128, 140, 152, 164].map(y => `<rect x="48" y="${y}" width="104" height="5"/>`).join('')}</g>`,
  chart: (A, B) => `<path ${S(B, 5)} d="M28 30v142h148"/><path ${S(A, 9)} d="M40 150l34-36 26 20 32-50 34-34"/><path fill="${A}" d="M146 38h34v34z"/>`,
  vase: (A, B) => `<path fill="${A}" d="M78 30h44v12c0 10 30 28 30 64 0 40-24 66-52 66s-52-26-52-66c0-36 30-54 30-64z"/><path ${S(B, 4)} d="M60 96h80M56 120h88M62 146h76"/>`,
  books: (A, B) => `<rect x="34" y="40" width="34" height="132" rx="3" fill="${A}"/><rect x="72" y="58" width="30" height="114" rx="3" fill="${B}"/><rect x="106" y="30" width="34" height="142" rx="3" fill="${A}"/><rect x="138" y="58" width="30" height="118" rx="3" fill="${B}" transform="rotate(14 153 117)"/><path ${S(B, 4)} d="M40 64h22M40 72h22M112 54h22M112 62h22"/>`,
  signal: (A, B) => `<path fill="${A}" d="M86 100h28l18 80H68z"/><circle cx="100" cy="88" r="12" fill="${A}"/><g ${S(A, 7)}><path d="M70 60a42 42 0 0 0 0 56M130 60a42 42 0 0 1 0 56"/></g><g ${S(B, 6)}><path d="M50 40a70 70 0 0 0 0 96M150 40a70 70 0 0 1 0 96"/></g>`,
  bowling: (A, B) => `<path fill="${A}" d="M74 22c12 0 16 12 14 26-2 12-10 20-8 34 4 24 18 40 16 64-2 20-12 30-22 30s-20-10-22-30c-2-24 12-40 16-64 2-14-6-22-8-34-2-14 2-26 14-26z"/><path ${S(B, 5)} d="M60 66h28M58 76h32"/><circle cx="136" cy="134" r="40" fill="${A}"/><g fill="${B}"><circle cx="126" cy="116" r="6"/><circle cx="144" cy="114" r="6"/><circle cx="136" cy="132" r="6"/></g>`,
  bottle: (A, B) => `<rect x="82" y="22" width="36" height="20" rx="8" fill="${B}"/><path fill="${A}" d="M78 42h44v10c14 8 20 20 20 36v74c0 10-6 16-16 16H74c-10 0-16-6-16-16V88c0-16 6-28 20-36z"/><path ${S(B, 5)} d="M84 96h20M84 116h14M84 136h20"/>`,
  notes: (A, B) => `<path fill="${A}" d="M64 44l84-18v104a20 20 0 1 1-10-17V58l-64 14v76a20 20 0 1 1-10-17z"/><path ${S(B, 4)} d="M30 160c20-8 40 8 60 0M120 172c16-6 32 6 48 0"/>`,
  /* patterns fill the hero; the "ornament" is small */
  stripes: null, dots: null, chevrons: null, grid: null, checks: null, rays: null, rain: null, fan: null
};
function star(x, y, r, c) { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; p.push((x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1)); } return `<path fill="${c}" d="M${p.join('L')}z"/>`; }
/* full-bleed patterns for the hero, drawn as SVG <pattern>s */
function pattern(name, A, B) {
  const P = {
    stripes: `<pattern id="p" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="18" height="44" fill="${A}"/></pattern>`,
    dots: `<pattern id="p" width="38" height="38" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="7" fill="${A}"/><circle cx="29" cy="29" r="7" fill="${A}"/></pattern>`,
    chevrons: `<pattern id="p" width="60" height="36" patternUnits="userSpaceOnUse"><path d="M0 26l30-20 30 20" fill="none" stroke="${A}" stroke-width="8"/></pattern>`,
    grid: `<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="${A}" stroke-width="3"/></pattern>`,
    checks: `<pattern id="p" width="56" height="56" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="${A}"/><rect x="28" y="28" width="28" height="28" fill="${A}"/></pattern>`,
    rays: '',
    rain: `<pattern id="p" width="48" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(14)"><path d="M10 4v22M34 34v22" stroke="${A}" stroke-width="4" stroke-linecap="round"/></pattern>`,
    fan: `<pattern id="p" width="96" height="56" patternUnits="userSpaceOnUse"><g fill="none" stroke="${A}" stroke-width="4"><path d="M0 56a48 48 0 0 1 96 0M16 56a32 32 0 0 1 64 0M32 56a16 16 0 0 1 32 0"/><path d="M-48 28a48 48 0 0 1 96 0M48 28a48 48 0 0 1 96 0" transform="translate(0 -28)"/></g></pattern>`
  };
  return P[name];
}
const isPattern = m => MOTIFS[m] === null;
/* display fonts that are scripts, very wide, very heavy or hairline: dish names use the body font in bold instead */
const DISH_IN_BODY = new Set(['Damion', 'Italianno', 'Playball', 'Yesteryear', 'Pacifico', 'Yellowtail', 'Rock Salt', 'Mountains of Christmas', 'Cabin Sketch', 'Syncopate', 'Poiret One', 'Turret Road', 'Fascinate', 'Smokum', 'Rubik Mono One', 'Black Ops One', 'Shojumaru', 'Gravitas One', 'Holtwood One SC', 'Italiana', 'Ultra', 'Chango', 'Courier Prime', 'Limelight', 'Federo', 'Tilt Neon', 'Audiowide', 'Cinzel Decorative']);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fontLink = fams => `https://fonts.googleapis.com/css?family=${[...new Set(fams)].map(f => f.replace(/ /g, '+') + ':400,400i,600,700,800,900').join('|')}&display=block`;

function posterHTML(row) {
  const e = EDITIONS[row.id];
  if (!e) throw new Error('no edition for ' + row.id);
  const c = palette(row), W = row.w, H = row.h, k = W / 1054;
  const frame = row.layout === 'frame';
  const maxL = row.maxLines || (row.title.length > 22 ? 4 : row.title.length > 12 ? 3 : 2);
  const heroH = Math.round(H * (frame ? 0.5 : 0.51));
  const heroBg = frame ? c.paper : c.hero;
  const pat = isPattern(row.motif);
  const A = c.motif, B = frame ? mix(c.motif2, c.paper, 0.15) : c.motif2;
  let art = '';
  if (pat) {
    if (row.motif === 'rays') {
      const cx = W / 2, cy = heroH * 0.42, n = 28;
      art = `<svg class="pat" width="${W}" height="${heroH}" viewBox="0 0 ${W} ${heroH}">${Array.from({ length: n }, (_, i) => { const a1 = i * 2 * Math.PI / n, a2 = a1 + Math.PI / n, R = W * 1.2; return i % 2 ? '' : `<path d="M${cx} ${cy}L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)}L${cx + R * Math.cos(a2)} ${cy + R * Math.sin(a2)}z" fill="${A}"/>`; }).join('')}</svg>`;
    } else {
      art = `<svg class="pat" width="${W}" height="${heroH}"><defs>${pattern(row.motif, A, B)}</defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`;
    }
  }
  const emblem = pat ? '' : `<svg class="emb" viewBox="0 0 200 200">${MOTIFS[row.motif](A, B)}</svg>`;
  const items = [['Snack', e.menu.s[0]], ['Snack', e.menu.s[1]], ['Main', e.menu.m[0]], ['Dessert', e.menu.w[0]], ['Drink', e.menu.d[0]]];
  const dish = ([label, it]) => `<div class="dish"><div class="lab">${label}</div><div class="nm">${esc(it.n)}</div><div class="nt">${esc(it.note)}</div></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${fontLink([row.font, row.body, row.note || row.body])}">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${c.paper}}
body{position:relative;font-family:'${row.body}',sans-serif;color:${c.ink};-webkit-font-smoothing:antialiased}
.hero{position:absolute;left:0;top:0;width:${W}px;height:${heroH}px;background:${heroBg};overflow:hidden}
.pat{position:absolute;left:0;top:0;opacity:${frame ? 0.16 : 0.22}}
.frame{position:absolute;inset:${Math.round(26 * k)}px;border:${Math.round((frame ? 16 : 3) * k)}px solid ${frame ? c.hero : mix(c.heroInk, c.hero, 0.55)};pointer-events:none}
.frame2{position:absolute;inset:${Math.round(50 * k)}px;border:${Math.round(2 * k)}px solid ${frame ? mix(c.hero, c.paper, 0.5) : mix(c.heroInk, c.hero, 0.7)}}
.top{position:absolute;left:0;right:0;top:${Math.round(72 * k)}px;text-align:center;font:700 ${Math.round(17 * k)}px/1 '${row.body}',sans-serif;letter-spacing:.32em;text-transform:uppercase;color:${c.top}}
.emb{position:absolute;left:50%;top:${Math.round(108 * k)}px;width:${Math.round(268 * k)}px;height:${Math.round(268 * k)}px;transform:translateX(-50%)}
.tbox{position:absolute;left:${Math.round(84 * k)}px;right:${Math.round(84 * k)}px;top:${Math.round((pat ? 120 : 384) * k)}px;bottom:${Math.round(96 * k)}px;display:flex;align-items:center;justify-content:center}
.title{font-family:'${row.font}',serif;font-weight:${row.weight || 400};color:${c.title};text-align:center;line-height:1.02;overflow-wrap:normal;word-break:keep-all${pat ? `;padding:${Math.round(18 * k)}px ${Math.round(30 * k)}px;background:${heroBg}` : ''}}
.year{position:absolute;left:0;right:0;top:${heroH - Math.round(84 * k)}px;text-align:center;font:700 ${Math.round(24 * k)}px/1 '${row.body}',sans-serif;letter-spacing:.4em;color:${c.yearOnHero}}
.year span{display:inline-block;padding:${Math.round(6 * k)}px ${Math.round(18 * k)}px ${Math.round(6 * k)}px ${Math.round(26 * k)}px;${frame ? `background:${c.hero};` : ''}}
.menu{position:absolute;left:${Math.round(96 * k)}px;right:${Math.round(96 * k)}px;top:${heroH + Math.round(40 * k)}px;bottom:${Math.round(150 * k)}px;display:flex;flex-direction:column;justify-content:space-evenly;text-align:center}
.mh{position:absolute;left:0;right:0;top:${heroH + Math.round(26 * k)}px;text-align:center;font:700 ${Math.round(15 * k)}px/1 '${row.body}',sans-serif;letter-spacing:.34em;text-transform:uppercase;color:${c.accent}}
.dish .lab{font-weight:700;font-size:${Math.round(13 * k)}px;letter-spacing:.3em;text-transform:uppercase;color:${c.accent};margin-bottom:${Math.round(5 * k)}px}
.dish .nm{${(row.dishInBody ?? DISH_IN_BODY.has(row.font)) ? `font-family:'${row.body}',sans-serif;font-weight:700;letter-spacing:-.01em` : `font-family:'${row.font}',serif;font-weight:${row.weight || 400}`};font-size:${Math.round(34 * k)}px;line-height:1.08;color:${c.ink}}
.dish .nt{font-family:'${row.note || row.body}',sans-serif;font-size:${Math.round(18 * k)}px;line-height:1.35;color:${c.soft};margin-top:${Math.round(4 * k)}px}
.rule{position:absolute;left:${Math.round(220 * k)}px;right:${Math.round(220 * k)}px;height:${Math.round(3 * k)}px;background:${c.accent};opacity:.55}
.foot{position:absolute;left:${Math.round(90 * k)}px;right:${Math.round(90 * k)}px;bottom:${Math.round(52 * k)}px;text-align:center}
.tag{font-family:'${row.note || row.body}',sans-serif;font-style:italic;font-size:${Math.round(19 * k)}px;line-height:1.3;color:${c.ink}}
.brand{margin-top:${Math.round(10 * k)}px;font-weight:700;font-size:${Math.round(13 * k)}px;letter-spacing:.32em;text-transform:uppercase;color:${c.soft}}
.pframe{position:absolute;inset:${Math.round(26 * k)}px;border:${Math.round((frame ? 16 : 3) * k)}px solid ${frame ? c.hero : mix(c.hero, c.paper, 0.35)};${frame ? '' : `border-top:none;top:${heroH}px;`}pointer-events:none}
</style></head><body>
<div class="hero">${art}${frame ? '' : '<div class="frame"></div><div class="frame2"></div>'}<div class="top">Reel Dinner &nbsp;/&nbsp; Movie night</div>${emblem}<div class="tbox"><div class="title" id="t">${esc(row.title)}</div></div><div class="year"><span>${esc(row.year)}</span></div></div>
${frame ? '<div class="pframe"></div><div class="frame2" style="inset:' + Math.round(50 * k) + 'px"></div>' : '<div class="pframe"></div>'}
<div class="mh">Tonight's menu</div>
<div class="menu" id="m">${items.map(dish).join('')}</div>
<div class="rule" style="bottom:${Math.round(128 * k)}px"></div>
<div class="foot"><div class="tag">${esc(e.tagline || '')}</div><div class="brand">Reel Dinner &nbsp;/&nbsp; serves 4</div></div>
<script>
window.fitAll=async()=>{await document.fonts.ready;
  const warn=[];const t=document.getElementById('t'),box=t.parentElement;
  const maxH=box.clientHeight;t.style.maxWidth=box.clientWidth+'px';
  let s=${Math.round((row.title.length <= 6 ? 190 : 150) * k)};t.style.fontSize=s+'px';
  while(s>24&&(t.scrollHeight>maxH||t.scrollWidth>t.clientWidth+1||lines(t)>${maxL}))
  {s-=2;t.style.fontSize=s+'px'}
  if(t.scrollHeight>maxH)warn.push('title overflow');
  const m=document.getElementById('m');let f=1;
  const over=()=>[...m.children].reduce((a,d)=>a+d.offsetHeight,0)>m.clientHeight-10;
  while(!over()&&f<1.2){f+=0.02;m.style.zoom=f}
  while(over()&&f>0.6){f-=0.02;m.style.zoom=f}
  if(over())warn.push('menu overflow');
  if(!document.fonts.check('20px "${row.font}"'))warn.push('title font missing');
  if(!document.fonts.check('700 20px "${row.body}"'))warn.push('body font missing');
  if(!document.fonts.check('20px "${row.note || row.body}"'))warn.push('note font missing');
  return {size:s,warn}};
function lines(el){const cs=getComputedStyle(el);return Math.round((el.scrollHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom))/(parseFloat(cs.fontSize)*1.02))}
</script></body></html>`;
}

async function main() {
  let rows = data.films;
  if (only.length) rows = rows.filter(r => only.includes(r.id));
  if (!rows.length) throw new Error('no films matched');
  for (const r of rows) {
    if (!(r.motif in MOTIFS)) throw new Error(`${r.id}: unknown motif ${r.motif}`);
    const c = palette(r);
    const pairs = [['title', c.title, r.layout === 'frame' ? c.paper : c.hero, 4.5], ['ink', c.ink, c.paper, 9], ['accent', c.accent, c.paper, 4.5], ['year', c.yearOnHero, r.layout === 'frame' ? c.hero : c.hero, 4.5]];
    for (const [n, a, b, min] of pairs) if (contrast(a, b) < min - 0.01) console.warn(`${r.id}: low contrast ${n} ${a} on ${b} (${contrast(a, b).toFixed(2)})`);
  }
  if (checkOnly) { console.log(`checked ${rows.length} films`); return; }
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const launch = { args: ['--no-sandbox'] };
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  else if (fs.existsSync('/usr/bin/google-chrome')) launch.executablePath = '/usr/bin/google-chrome';
  if (process.env.HTTPS_PROXY) launch.args.push('--proxy-server=https=' + process.env.HTTPS_PROXY.replace(/^https?:\/\//, ''));
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  fs.mkdirSync(outDir, { recursive: true });
  const made = [];
  for (const r of rows) {
    if (sheetOnly) { made.push(path.join(outDir, r.file)); continue; }
    await page.setViewportSize({ width: r.w, height: r.h });
    await page.setContent(posterHTML(r), { waitUntil: 'networkidle' });
    const res = await page.evaluate(() => window.fitAll());
    if (res.warn.length) console.warn(`${r.id}: ${res.warn.join(', ')}`);
    const file = path.join(outDir, r.file);
    await page.screenshot({ path: file, type: 'jpeg', quality, clip: { x: 0, y: 0, width: r.w, height: r.h } });
    made.push(file);
    process.stdout.write('.');
  }
  process.stdout.write('\n');
  if (sheetPath && !made.length) console.warn('nothing to put on a contact sheet');
  if (sheetPath) {
    const cols = 8, tw = 240, th = Math.round(tw * 1492 / 1054), pad = 8, lab = 18;
    const cells = made.map((f, i) => `<figure style="margin:0;width:${tw}px"><img src="${encodeURI('file://' + f)}" style="width:${tw}px;height:${th}px;display:block"><figcaption style="font:11px/1.4 sans-serif;height:${lab}px;overflow:hidden;white-space:nowrap">${esc(rows[i].id)}</figcaption></figure>`).join('');
    const rowsN = Math.ceil(made.length / cols), SW = cols * (tw + pad) + pad, SH = rowsN * (th + lab + pad) + pad;
    const sheetHtml = path.join(require('os').tmpdir(), 'type-poster-sheet.html');
    fs.writeFileSync(sheetHtml, `<body style="margin:0;padding:${pad}px;background:#ddd;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:${pad}px">${cells}</body>`);
    await page.setViewportSize({ width: SW, height: SH });
    await page.goto('file://' + sheetHtml, { waitUntil: 'load' });
    await page.screenshot({ path: sheetPath, type: 'jpeg', quality: 80, fullPage: true });
    console.log('contact sheet', sheetPath);
  }
  await browser.close();
  console.log(`made ${made.length} posters in ${path.relative(root, outDir) || outDir}`);
}
main().catch(e => { console.error(e); process.exit(1); });
