// Wider film search (search.js, data/search-index.json from scripts/build-search.cjs): meaning, typos, plurals, ranking, suggestions.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const H=require('./search-harness.cjs');
const root=path.join(__dirname,'..');
const top=(q,n)=>H.after(q).slice(0,n||10).map(x=>x.f.title);
const has=(q,t)=>H.after(q).some(x=>x.f.title===t);

// the index is current: every film has an entry and the stamp in films.js matches
const ix=JSON.parse(fs.readFileSync(path.join(root,'data/search-index.json'),'utf8'));
assert.equal(Object.keys(ix.films).length,H.films.length,'search index is missing films: run node scripts/build-data.cjs');
const dv=fs.readFileSync(path.join(root,'films.js'),'utf8').match(/"search":"(\w+)"/);
assert.ok(dv,'films.js DATA_V has no search stamp');
assert.equal(dv[1],require('node:crypto').createHash('sha1').update(fs.readFileSync(path.join(root,'data/search-index.json'))).digest('hex').slice(0,8),'search stamp out of date: run node scripts/build-data.cjs');

// meaning: mafia, mob, gangster all find the mob films; plurals and typos too
for(const q of ['mafia','mob','gangster','gangsters','crime family','mafai','the godfather type'])
  for(const t of ['The Godfather','Goodfellas','Donnie Brasco'])assert.ok(top(q,15).includes(t),`${q} should find ${t} near the top`);
assert.ok(has('cop','Lethal Weapon')||has('cop','48 Hrs.'),'cop finds the buddy cop films');
assert.ok(has('space','Star Wars'),'space finds Star Wars');
assert.ok(has('Christmas','Die Hard')||has('Christmas','Elf'),'Christmas finds the Christmas shelf');
assert.ok(has('scary','The Exorcist'),'scary finds horror');
assert.ok(has('date night','When Harry Met Sally...'),'date night finds romcoms');
assert.ok(H.after('80s').every(x=>x.f.year>='1980'&&x.f.year<='1989'),'80s only finds 80s films');
assert.ok(has('eighties','Back to the Future'),'eighties is the 80s');
assert.ok(has('aussie','The Castle'),'aussie finds Australian films');

// keywords: venue, dish, famous line, character
assert.equal(top('pizza',1)[0],'Mystic Pizza','title first for pizza');
assert.ok(has('pizza','Toy Story'),'pizza finds Pizza Planet');
assert.equal(top('Shirley',1)[0],'Airplane!','Shirley finds Airplane!');
assert.ok(has('dude','The Big Lebowski'),'dude finds Lebowski');

// ranking: exact titles before meaning, meaning before keywords; near-miss titles drop below
const tiers=H.after('christmas').map(x=>x.tier);
assert.deepEqual(tiers,tiers.slice().sort((a,b)=>a-b),'results are in tier order');
assert.ok(H.after('christmas')[0].tier<4,'a title match comes first');
assert.ok(!top('mum',3).includes('The Mummy'),'mum is not The Mummy');
assert.deepEqual(top('aliens',2),['Aliens','Alien'],'aliens puts the Alien films first');
assert.equal(top('ghostbusters',1)[0],'Ghostbusters','plain title search still works');
assert.equal(top('breakfast at tiffanys',1)[0],"Breakfast at Tiffany's",'apostrophes still forgiven');

// combined: 80s horror is both
assert.ok(H.after('80s horror').length>5&&H.after('80s horror').every(x=>x.f.year<'1990'&&x.f.year>='1980'),'80s horror is 80s films only');

// nothing found: suggestions instead of an empty page
assert.equal(H.after('zzqx').length,0);
assert.ok(H.S.suggest('zombeez',H.sctx).includes('zombie')||H.after('zombeez').length,'a typo gets a suggestion or a match');
assert.ok(H.S.suggest('qqqq',H.sctx).length>0,'always something to try');

// speed: a typed search must feel instant on a phone
let t=process.hrtime.bigint();for(const q of ['mafia','spagetti westen','pizza planet','qqqq','80s horror'])H.after(q);
const ms=Number(process.hrtime.bigint()-t)/1e6/5;assert.ok(ms<120,`search too slow: ${ms.toFixed(0)}ms a query`);

// wiring: the page loads search.js before app.js, the worker saves the index for offline, no em dashes in the new files
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.indexOf('src="search.js')>0&&html.indexOf('src="search.js')<html.indexOf('src="app.js'),'search.js loads before app.js');
assert.ok(/search-index/.test(fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/const FILM_RX[^\n]*/)[0]),'worker keeps the search index offline');
for(const f of ['search.js','data/search-terms.json','scripts/build-search.cjs'])assert.ok(!fs.readFileSync(path.join(root,f),'utf8').includes(String.fromCharCode(8212)),`em dash in ${f}`);
console.log(`PASS: wider search over ${H.films.length} films, ${ix.groups.length} term groups, ${ms.toFixed(0)}ms a query.`);
