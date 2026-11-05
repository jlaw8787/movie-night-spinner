// Shopping lines and the Prep sheet's "You need" lists, run on the app's real code (review 9, fixes 1 and 6).
// Frying oil is one pot whatever the guest count, and pack notes in an item follow the guests.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'app.js'),'utf8');
const a=src.indexOf('const FRAC='),b=src.indexOf('function planHTML(');assert.ok(a>0&&b>a,'shopping code found');
const ctx={};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const AISLES='),src.indexOf('\n',src.indexOf('const AISLES=')))+'\n'+src.slice(a,b)+'\n;globalThis.shopLines=shopLines;globalThis.dishIngList=dishIngList;',ctx);
const film=id=>JSON.parse(fs.readFileSync(path.join(root,'data/film',id+'.json'),'utf8')).r2;
const dish=(id,n)=>{const d=film(id).dishes.find(x=>x.n===n);assert.ok(d,'missing '+n);return d};
const lines=(id,guests,names)=>{const r=film(id),k=guests/(r.serves||4);return [...ctx.shopLines(r.dishes.filter(d=>!names||names.includes(d.n)).map(d=>({d,k})))]};
const oil=ls=>ls.filter(l=>/vegetable oil/i.test(l));

// fix 1: "vegetable oil" with no "for frying" is still the frying pot (Everything Everywhere's sesame balls)
const ee='everything-everywhere-all-at-once-2022';
for(const g of [2,4,9])assert.deepEqual(oil(lines(ee,g)),['2 L vegetable oil@Pantry'],`Everything Everywhere at ${g}`);
assert.deepEqual([...ctx.dishIngList(dish(ee,'Sesame balls'),9/4)].filter(l=>/oil/.test(l)),['2 L vegetable oil'],'Prep sheet You need at 9');
// spoons of oil still scale
assert.ok(lines(ee,8).some(l=>/^2 tsp sesame oil@/.test(l)),'sesame oil scales');

// fix 6: notes inside an item follow the guests
const find=(id,g,re)=>{const l=lines(id,g).find(x=>re.test(x));assert.ok(l,`${id} at ${g}: no line for ${re}`);return l};
assert.match(find('romancing-the-stone-1984',9,/lime juice/),/\(about 2[23] limes\)/,'lime count at 9');
assert.match(find('romancing-the-stone-1984',2,/lime juice/),/\(about 5 limes\)/,'lime count at 2');
assert.match(find('rocky-v-1990',9,/steaks/),/about 1\.[34]kg/,'steak weight at 9');
// "round", "rib" and the like name the cut, not a container: "9 thin beef round steaks", never "beef rounds of steaks"
assert.match(find('rocky-v-1990',9,/steak/),/^9 thin beef round steaks, about 1\.[34]kg@Meat$/,'round steaks read properly at 9');
assert.match(find('rocky-v-1990',1,/steak/),/^1 thin beef round steak, about 150g@Meat$/,'one round steak at 1');
assert.ok(!lines('con-air-1997',9).some(l=>/rounds of/.test(l)),'no "rounds of" in Con Air');
assert.match(find('how-the-grinch-stole-christmas-2000',9,/cob/),/^3 round cob loaves@Bakery$/,'round cob loaves');
assert.match(find('madagascar-2005',1,/rib eye/),/^1 rib eye steak@/,'one rib eye steak, singular');
{const m=find('rocky-v-1990',9,/milk,/),sum=[...m.matchAll(/(\d+(?:\.\d+)?)\s?(ml|L)\b(?= for)/g)].reduce((a,x)=>a+(+x[1])*(x[2]==='L'?1000:1),0);assert.ok(sum>1400&&sum<1700,'milk split adds up to the line: '+m)}
// a tin or bag size never scales
assert.ok(!lines('rocky-v-1990',9).some(l=>/\(\d+ ?g\)/.test(l)&&/tins?|cans?/.test(l)&&!/\(400 ?g\)/.test(l)),'tin sizes stay put');

/* review 11: the frying pot covers a splash of the same oil, and salt and pepper covers plain salt */
for(const g of [2,4,9])assert.deepEqual(oil(lines('raiders-of-the-lost-ark-1981',g)).filter(l=>/vegetable oil/.test(l)),['2 L vegetable oil@Pantry'],`Raiders at ${g}`);
for(const g of [2,9]){const L=lines('casino-royale-2006',g);assert.ok(!(L.some(l=>/^salt and pepper@/.test(l))&&L.some(l=>/^salt@/.test(l))),`Casino Royale salt twice at ${g}`)}
// review 12, fix 4: shopping lines read as real words
{const L=(id,g)=>lines(id,g).join('\n');const m2=L('once-upon-a-time-in-mexico-2003',2),m9=L('once-upon-a-time-in-mexico-2003',9);
 assert.match(m2,/^1 packet banana leaves@/m,'banana leaves stay leaves');assert.match(m2,/^1 dried chilli@/m,'one chilli, not chilly');
 assert.match(m9,/^3 chipotles in adobo@/m,'plural on the head noun');assert.ok(!/chilli powder@[^\n]*\n[^\n]*pinch/i.test(m2)&&!/pinch(es)? (of )?chilli powder/i.test(m2),'a pinch folds into the measured chilli powder');
 assert.match(L('moana-2016',4),/^1 handful mint leaves, plus sprigs@/m,'mint leaves stay leaves');
 const s4=L('the-sound-of-music-1965',4);assert.match(s4,/^4 1\/2 tbsp mustard@/m,'spoons round to a half, not a third');
 assert.ok(!/tbsp chives|tbsp parsley/.test(s4),'spoonfuls of a herb bought by the bunch fold into the bunch');
 assert.equal((s4.match(/^[^\n@]*salt[^\n@]*@/gm)||[]).length,1,'salt is one line');
 for(const [g,n] of [[2,4],[4,8],[9,18]])assert.match(L('some-like-it-hot-1959',g),new RegExp('bitters, '+n+' dashes@'),'bitters scale with the guests at '+g);
 assert.match(L('some-like-it-hot-1959',9),/^1 bag ice \(about 14 cups\)@/m,'a lot of ice is a bag');
 for(const fn of fs.readdirSync(path.join(root,'data/film'))){const r=JSON.parse(fs.readFileSync(path.join(root,'data/film',fn),'utf8')).r2;if(!r||!r.dishes)continue;
  for(const g of [2,4,9]){const k=g/(r.serves||4);for(const l of ctx.shopLines(r.dishes.map(d=>({d,k}))))
   assert.ok(!/\b(leave|chilly|adobos|loave|cooky)@|\b(leave|chilly|adobos)\b(?! out)|^1 \d+(g|ml|kg)\b|\d\/3 (tsp|tbsp)|^\d+ [^@(]+\(\d+(?:\.\d+)?\s?(?:g|kg|ml|L) (?:tins?|cans?|jars?)\)/.test(l),`${fn} at ${g}: ${l}`)}}}
console.log('PASS: frying oil holds at one pot at 2, 4 and 9 guests; spoon oils still scale; pack notes follow the guests; cut names like round steak read properly.');
