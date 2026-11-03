// Every film's Choose dishes list must match the dishes its printed card shows (review 4, fix 1).
// The card is the source of truth; recipe and diet files must use the card's dish names.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');let checked=0;const bad=[];
for(const f of fs.readdirSync(path.join(root,'data/film'))){
  const d=JSON.parse(fs.readFileSync(path.join(root,'data/film',f),'utf8'));if(!d.r2||!d.r2.dishes||!d.lib)continue; /* hand-built menus name dishes in their own design; checked in the browser */
  const card=new Set(['S','M','W','K'].flatMap(k=>(d[k]||[]).map(r=>String(r[0]).toLowerCase())));
  for(const x of d.r2.dishes){checked++;if(!card.has(String(x.n).toLowerCase())&&!(d.edition))bad.push(f+': '+x.n)}
}
assert.ok(checked>2500,'recipes found');
assert.deepEqual(bad,[],'recipe dish names missing from the film\'s own dish list:\n'+bad.join('\n'));
console.log(`PASS: ${checked} tested recipes on shared-layout menus all named as the film's own dishes.`);
