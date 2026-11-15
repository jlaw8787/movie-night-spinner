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
const out = { v: '', vibes: Object.keys(VIBES), films: {} };
let skipped = 0;
for (const f of films) {
  const id = `${f.title} (${f.year})`;
  if (!passed(id)) { skipped++; continue }
  let card = null; try { card = D(`audit/cards/${slug(id)}.json`) } catch (e) { }
  const dishes = card && card.dishes && card.dishes.length ? card.dishes : ['S', 'M', 'W', 'K'].flatMap(k => (f[k] || []).map(it => ({ course: k, name: it[0] })));
  const by = k => dishes.filter(d => d.course === k).map(d => clean(d.name)).filter(Boolean);
  /* three headline dishes: a main, a starter and a sweet, topped up from whatever else prints */
  const pick = [by('M')[0], by('S')[0], by('W')[0]].filter(Boolean);
  for (const n of [...by('M'), ...by('S'), ...by('W')]) { if (pick.length >= 3) break; if (!pick.includes(n)) pick.push(n) }
  const h = house[id] && house[id].d, drinks = by('K');
  const drink = h && h.n ? { n: clean(h.n), a: h.alc ? 1 : 0 } : drinks[0] ? { n: drinks[0], a: 0 } : null;
  const g = genres[id] || [], a = AISLE[id] || '', fl = flav[id] || {};
  const vibes = Object.keys(VIBES).filter(k => VIBES[k](g, f, a));
  const p = pal[id] || {};
  out.films[id] = { vb: vibes, ve: clean(fl.venue), d: pick.slice(0, 3), k: drink, c: [p.dark || '#2a0d0d', p.accent || '#c9a227'] };
}
const body = JSON.stringify(out);
out.v = require('crypto').createHash('sha1').update(body).digest('hex').slice(0, 8);
fs.writeFileSync(path.join(ROOT, 'data/match-deck.json'), JSON.stringify(out));
const n = Object.keys(out.films).length, count = k => Object.values(out.films).filter(x => x.vb.includes(k)).length;
console.log(`match-deck.json: ${n} films passed (${skipped} still in the audit queue), ${out.vibes.map(k => k + ' ' + count(k)).join(', ')}, v ${out.v}`);
