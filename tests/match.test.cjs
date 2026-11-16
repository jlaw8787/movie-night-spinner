// Match night (match.js, data/match-deck.json from scripts/build-match.cjs): decks only hold audited films,
// every vibe can deal a full 20, every card has its teaser, and the page wiring stays in place.
const assert=require('assert'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),rd=p=>fs.readFileSync(path.join(root,p),'utf8');
const deck=JSON.parse(rd('data/match-deck.json')),films=JSON.parse(rd('data/films.json'));
const ids=new Set(films.map(f=>`${f.title} (${f.year})`));
const slug=id=>id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let n=0;
for(const [id,c] of Object.entries(deck.films)){
  n++;
  assert.ok(ids.has(id),`${id} is in the deck but not in films.json`);
  const r=JSON.parse(rd(`audit/results/${slug(id)}.json`));
  assert.ok(!(r.facts||[]).some(x=>(x.verdict==='wrong'||x.verdict==='unsure')&&!x.done),`${id} has open fact lines`);
  assert.ok(r.vibe&&r.vibe.overall>=3.5,`${id} vibe under 3.5`);
  assert.ok(c.ve&&c.d.length===3&&c.c.length===2,`${id} teaser incomplete`);
}
assert.ok(n>=500,`only ${n} films in Match night`);
for(const v of deck.vibes)assert.ok(Object.values(deck.films).filter(c=>c.vb.includes(v)).length>=20,`vibe ${v} can't deal 20`);
// the deck file is current with the audit (rebuild: node scripts/build-data.cjs)
const {execFileSync}=require('child_process');
const before=rd('data/match-deck.json');execFileSync('node',[path.join(root,'scripts/build-match.cjs')],{stdio:'ignore'});
assert.strictEqual(rd('data/match-deck.json'),before,'data/match-deck.json is stale: run node scripts/build-data.cjs');
// wiring
const html=rd('index.html');
assert.ok(html.indexOf('src="match.js')>html.indexOf('src="app.js'),'match.js loads after app.js');
for(const id of ['modeSpin','modeMatch','matchPanel','matchLive'])assert.ok(html.includes(`id="${id}"`),`#${id} missing`);
assert.ok(/match-deck/.test(rd('sw.js')),'worker keeps the deck for offline');
assert.ok(rd('films.js').includes('"match":'),'DATA_V.match stamp missing');
assert.ok(rd('app.js').includes('window.spinForce'),'two-slot spin hook missing from spin()');
for(const f of ['match.js','scripts/build-match.cjs','supabase/match-night.sql'])assert.ok(!rd(f).includes(String.fromCharCode(8212)),`em dash in ${f}`);
assert.ok(!rd('match.js').includes('service_role'),'no secret keys in the page');
// diet toggles on the card back: an alcoholic drink is flagged (fallback menu drinks included), and the
// vegetarian / alcohol-free lists never come up short (review 15 Nov)
for (const [id, c] of Object.entries(deck.films)) {
  const f = films.find(x => `${x.title} (${x.year})` === id), k = (f.K || []).find(it => c.k && it[0] === c.k.n);
  if (k && (k[3] || []).some(s => /@Bottle shop$/.test(s))) assert.ok(c.k.a, `${id}: ${c.k.n} has alcohol but isn't flagged`);
  for (const l of Object.values(c.dx || {})) assert.ok(l.length === 3, `${id} diet teaser short`);
}
const mj = rd('match.js');
assert.ok(/if \(M\.room\) poll\(\)/.test(mj.slice(mj.indexOf('function mode'), mj.indexOf('function mode') + 600)), 'coming back to Match it restarts the room check');
assert.ok(!/rpc\('match_(swipe|unswipe|pick)'/.test(mj), 'room writes go through the retry queue');
assert.ok(mj.includes("'https://reeldinner.com/'"), 'room link points at the website from the app');
assert.ok(mj.includes('data-style="solo"') && mj.includes("'rd-solo'"), 'Just me mode and its saved shortlist');
assert.ok(rd('app.js').includes('force.pair[i%force.pair.length]'), 'decider wheel takes more than two films');
// Final Cut engine (match.js): the same swipes always give the same night
{
  const vm = require('vm'), src = mj.slice(mj.indexOf('/* FINAL-CUT-ENGINE start'), mj.indexOf('/* FINAL-CUT-ENGINE end')), g = {};
  vm.runInNewContext(src, { globalThis: g });
  const R = g.RDFinalCut.replay, D = ['a', 'b', 'c', 'd', 'e'];
  const S = { 1: { 1: { a: true, b: true, c: true, d: false, e: false } }, 2: { 1: { a: true, b: true } } };
  assert.strictEqual(R(D, S).phase, 'swipe', 'round one not done');
  S[2][1] = { a: true, b: true, c: true, d: true, e: false };
  let st = R(D, S); assert.deepStrictEqual([st.phase, st.round, st.deck.join()], ['swipe', 2, 'a,b,c'], 'shortlist is what both kept');
  S[1][2] = { a: true, b: false, c: false }; S[2][2] = { a: true, b: true, c: false };
  st = R(D, S); assert.deepStrictEqual([st.phase, st.film, st.how], ['win', 'a', 'cut'], 'one left wins');
  S[2][2] = { a: false, b: false, c: false }; S[1][2] = { a: false, b: false, c: false };
  st = R(D, S); assert.deepStrictEqual([st.phase, st.why, st.list.join(), st.call], ['h2h', 'wiped', 'a,b,c', 1], 'wiped round goes head to head on the last shortlist');
  S[1][101] = { a: true }; S[2][101] = { b: true };
  st = R(D, S); assert.deepStrictEqual([st.step, st.pair.join(), st.last.split, st.last.win, st.call], [2, 'a,c', true, 'a', 2], 'first split is player one call, next is player two');
  S[1][102] = { c: true }; S[2][102] = { a: true };
  st = R(D, S); assert.deepStrictEqual([st.phase, st.film], ['win', 'a'], 'second split goes to player two');
  S[1][102] = { c: true }; S[2][102] = { c: true };
  assert.strictEqual(R(D, S).film, 'c', 'agree and it wins');
  S[1][102] = { e: true }; assert.strictEqual(R(D, S).phase, 'h2h', 'a pick outside the pair does not count');
  const T = { 1: { 1: { a: true, b: true }, 2: { a: true, b: true } }, 2: { 1: { a: true, b: true }, 2: { a: true, b: true } } };
  assert.deepStrictEqual([R(['a', 'b'], T).phase, R(['a', 'b'], T).why], ['h2h', 'stuck'], 'a round that cuts nothing goes head to head');
  const N = { 1: { 1: { a: true, b: false } }, 2: { 1: { a: false, b: true } } };
  assert.strictEqual(JSON.stringify(R(['a', 'b'], N).keep), JSON.stringify({ 1: ['a'], 2: ['b'] }), 'nothing in common: both keep lists for Meet in the middle');
  assert.ok(/'p_round'|p_round:/.test(mj) && rd('supabase/final-cut.sql').includes('movies.fc_replay'), 'rounds go to the database');
  assert.ok(!rd('supabase/final-cut.sql').includes(String.fromCharCode(8212)), 'em dash in final-cut.sql');
}
console.log(`match: ${n} films in Match night, ${deck.vibes.length} vibes, ok`);
