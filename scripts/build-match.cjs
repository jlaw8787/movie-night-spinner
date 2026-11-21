#!/usr/bin/env node
/* Builds data/match-deck.json for Match night (Spin it or Match it, in the cinema).
   Only films whose menus have passed both audits go in: a result file in audit/results with no open
   wrong or unsure fact lines, and a vibe score of 3.5 or better (the audit's own line for "not flat").
   Per film: the vibes it deals into, and the menu teaser on the back of the card (venue, three headline
   dishes, the house drink, the film's menu colours). Dishes come from the audited card in audit/cards,
   so the teaser shows what the menu prints.
   Vibes follow the wider search's term groups (data/search-terms.json) so "Comedy" here means what it means in search.
   Run after an audit or menu change: node scripts/build-match.cjs (build-data.cjs runs it too). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), D = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const films = D('data/films.json'), genres = D('data/film-genres.json'), fmt = D('data/film-format.json');
const flav = Object.assign({}, D('data/kit-flavour.json'), D('data/film-flavour.json'));
const house = D('data/film-house.json'), pal = D('data/film-palette.json');
const box = {}; vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'aisles.js'), 'utf8') + ';this.A=FILM_AISLE', box);
const AISLE = box.A || {};
/* audit files: the id in lower case with every run of other characters turned into "-" (docs/AUDIT.md) */
const slug = id => id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* who deals into which vibe. Comedy needs the Comedy genre (not just a playful menu), Family keeps horror out,
   Date night follows the search group (romance or romcom, no animation or horror), Action is the Action genre. */
const VIBES = {
  comedy: (g, f, a) => g.includes('Comedy') && !g.includes('Horror'),
  horror: (g, f, a) => g.includes('Horror') || f.theme === 'horror' || a === 'Horror',
  family: (g, f, a) => (g.includes('Family') || a === 'Family' || ['kids', 'fairytale'].includes(f.theme)) && !g.includes('Horror'),
  date: (g, f, a) => (g.includes('Romance') || f.theme === 'romcom') && !g.includes('Animation') && !g.includes('Horror'),
  action: (g, f, a) => g.includes('Action')
};

function passed(id) {
  const p = path.join(ROOT, 'audit/results', slug(id) + '.json');
  if (!fs.existsSync(p)) return false;
  const r = JSON.parse(fs.readFileSync(p, 'utf8'));
  if ((r.facts || []).some(x => (x.verdict === 'wrong' || x.verdict === 'unsure') && !x.done)) return false;
  return !!(r.vibe && r.vibe.overall >= 3.5);
}
const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
/* per dish: is it meat, is it a drink with alcohol, and its swapped name for each toggle ('' when the menu drops it).
   Looks the name up in the film's recipes (data/film/<slug>.json r2), then the printed line in films.json */
function dietOf(id, f) {
  let fd = {}; try { fd = D(`data/film/${slug(id)}.json`) } catch (e) { }
  const r2 = new Map(((fd.r2 || {}).dishes || []).map(x => [x.n.toLowerCase(), x]));
  const txt = k => new Map((((fd.diet || {}).text || {})[k] || []).map(p => [String(p[0]).toLowerCase(), clean(p[1])]));
  const tv = txt('veg'), ta = txt('af');
  const lines = new Map(['S', 'M', 'W', 'K'].flatMap(k => (f[k] || []).map(it => [String(it[0]).toLowerCase(), it[3] || []])));
  const aisle = (l, rx) => (lines.get(l) || []).some(s => rx.test(String(s)));
  /* printed lines with no recipe: meat by aisle or by what the ingredient is (ham and pork sit in Deli); a dish
     not on the printed list at all (the one-off layouts) goes by its own name */
  const MEAT = /\b(ham|jam[oó]n|pork|beef|steak|chicken|bacon|prosciutto|salami|pepperoni|lamb|sausages?|turkey|duck|veal|mince|brisket|ribs?|chorizo|pancetta|pastrami|corned|meatballs?|burgers?|(hot |chilli |corn )?dogs|frankfurts?|wings|prawns?|shrimp|fish|tuna|salmon|anchov\w*|crab|lobster|clams?|oysters?|mussels?|squid|calamari|barra\w*|snapper|cod)\b/i;
  const BOOZE = /\b(beer|lager|ale|stout|wine|champagne|prosecco|martini|margarita|mojito|daiquiri|negroni|spritz|whisk(e)?y|bourbon|scotch|rye|vodka|gin|rum|tequila|mezcal|brandy|cognac|liqueur|schnapps|sake|cider|sangria|punch|highball|old fashioned|manhattan|cocktail|anisette|limoncello|white russian)\b/i;
  const meatLine = l => lines.has(l) ? aisle(l, /@(Meat|Seafood)$/) || (lines.get(l) || []).some(s => MEAT.test(String(s).split('@')[0])) : MEAT.test(l);
  const boozeLine = l => lines.has(l) ? aisle(l, /@Bottle shop$/) : BOOZE.test(l);
  return {
    find(n) {
      const l = n.toLowerCase(), r = r2.get(l), alt = (r && r.alt) || {};
      const meat = r ? r.veg === false : meatLine(l);
      const booze = r ? r.af === false || (r.ingredients || []).some(i => i.aisle === 'Bottle shop') : boozeLine(l);
      const veg = tv.get(l) || (alt.veg && clean(alt.veg.n).replace(/\s*\(vegetarian\)$/i, '')) || '';
      const af = ta.get(l) || (alt.af && clean(alt.af.n).replace(/\s*\((alcohol-free|non-alcoholic)\)$/i, '')) || '';
      const vegAF = (alt.veg_af && clean(alt.veg_af.n).replace(/\s*\((vegetarian|alcohol-free|non-alcoholic)[^)]*\)$/i, '')) || '';
      return { meat, booze, veg, af, vegAF };
    }
  };
}
const out = { v: '', vibes: Object.keys(VIBES), films: {} };
let skipped = 0;
for (const f of films) {
  const id = `${f.title} (${f.year})`;
  if (!passed(id)) { skipped++; continue }
  let card = null; try { card = D(`audit/cards/${slug(id)}.json`) } catch (e) { }
  /* review 36: an audit card snapshot taken before a dish was renamed or swapped no longer matches the menu: use the menu then */
  const curN = new Set(['S', 'M', 'W', 'K'].flatMap(k => (f[k] || []).map(it => clean(it[0]).toLowerCase())));
  if (card && card.dishes && card.dishes.some(d => !curN.has(clean(d.name).toLowerCase()))) card = null;
  const dishes = card && card.dishes && card.dishes.length ? card.dishes : ['S', 'M', 'W', 'K'].flatMap(k => (f[k] || []).map(it => ({ course: k, name: it[0] })));
  const by = k => dishes.filter(d => d.course === k).map(d => clean(d.name)).filter(Boolean);
  /* three headline dishes: a main, a starter and a sweet, topped up from whatever else prints */
  const pick = [by('M')[0], by('S')[0], by('W')[0]].filter(Boolean);
  for (const n of [...by('M'), ...by('S'), ...by('W')]) { if (pick.length >= 3) break; if (!pick.includes(n)) pick.push(n) }
  /* the diet toggles: the same rules the printed menu uses (dietDish in app.js). Vegetarian swaps a meat dish
     for its own vegetarian version and drops one that has none; No alcohol (and Kids mode) does the same for drinks */
  const dz = dietOf(id, f);
  /* what a dish prints as under each toggle ('' when that menu leaves it off) */
  const as = (n, veg, af) => {
    const x = dz.find(n);
    if (veg && x.meat) { if (af && x.vegAF) return x.vegAF; if (!x.veg) return ''; n = x.veg; if (af && x.booze) return '' }
    if (af && x.booze) return x.af || '';
    return n;
  };
  const dx = {};
  for (const [key, veg, af] of [['veg', 1, 0], ['af', 0, 1], ['veg_af', 1, 1]]) {
    const l = []; for (const n of [...pick, ...by('M'), ...by('S'), ...by('W')]) { if (l.length >= 3) break; const v = as(n, veg, af); if (v && !l.includes(v)) l.push(v) }
    if (l.join('|') !== pick.slice(0, 3).join('|')) dx[key] = l;
  }
  const h = house[id] && house[id].d, drinks = by('K');
  const menuDrink = drinks[0] ? dz.find(drinks[0]) : null;
  const menuAF = menuDrink ? (menuDrink.booze ? menuDrink.af : drinks[0]) : '';
  const drink = h && h.n ? { n: clean(h.n), a: h.alc ? 1 : 0 } : drinks[0] ? { n: drinks[0], a: menuDrink.booze ? 1 : 0 } : null;
  if (drink && drink.a && menuAF && menuAF !== drink.n) drink.an = menuAF;
  const g = genres[id] || [], a = AISLE[id] || '', fl = flav[id] || {};
  const vibes = Object.keys(VIBES).filter(k => VIBES[k](g, f, a));
  const p = pal[id] || {};
  out.films[id] = { vb: vibes, ve: clean(fl.venue), d: pick.slice(0, 3), k: drink, c: [p.dark || '#2a0d0d', p.accent || '#c9a227'] };
  if (Object.keys(dx).length) out.films[id].dx = dx;
}
const body = JSON.stringify(out);
out.v = require('crypto').createHash('sha1').update(body).digest('hex').slice(0, 8);
fs.writeFileSync(path.join(ROOT, 'data/match-deck.json'), JSON.stringify(out));
const n = Object.keys(out.films).length, count = k => Object.values(out.films).filter(x => x.vb.includes(k)).length;
console.log(`match-deck.json: ${n} films passed (${skipped} still in the audit queue), ${out.vibes.map(k => k + ' ' + count(k)).join(', ')}, v ${out.v}`);
