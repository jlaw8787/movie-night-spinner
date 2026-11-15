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
console.log(`match: ${n} films in Match night, ${deck.vibes.length} vibes, ok`);
