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

console.log('PASS: frying oil holds at one pot at 2, 4 and 9 guests; spoon oils still scale.');
