// Guards against two slips found in review 10: a merge that drops the Candy bar's styles,
// and planner calls that pass the array index into dietDish's second argument.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
for(const sel of ['.scc-pics','.scg-list','.sct-tot','.sc-item'])assert.ok(html.includes(sel),`index.html lost the Candy bar style ${sel}`);
assert.ok(!/\.map\(\s*dietDish\s*\)/.test(app),'dietDish passed straight to map: the index lands in its alcohol-free argument');
console.log('merge guards ok');
