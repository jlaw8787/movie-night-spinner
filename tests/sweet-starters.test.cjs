// Sweets with sweets: no biscuit, cake, lolly or ice cream listed as a starter unless the film makes it one (scripts/check-sweet-starters.cjs).
const assert=require('node:assert/strict');
const {scan,isSweet}=require('../scripts/check-sweet-starters.cjs');
for(const n of ['Lavender shortbread','Campfire marshmallows','Strawberry ripple ice cream cones','Homemade cherry gummies','Golden ticket shortbread'])assert.ok(isSweet(n),n+' reads as a sweet');
for(const n of ['Diner biscuits and gravy','Rhode Island clam cakes','Kings Cross pie floaters','Midsummer aged cheese tart with dill cream','Big top caramel popcorn'])assert.ok(!isSweet(n),n+' reads as savoury');
const {kept,bad}=scan();
assert.equal(bad.length,0,'sweets listed as starters:\n'+bad.map(b=>b.id+' | '+b.n).join('\n'));
console.log(`PASS: no sweet starters outside the ${kept.length} the films make snacks of.`);
