// One price style per card and no odd cents (review 10, fix 7): the shared price code in app.js.
// scripts/check-prices.cjs runs the same rule over every rendered shared card in a browser.
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const pick=name=>{const i=src.indexOf('window.'+name+'=');assert.ok(i>=0,name+' in app.js');let j=src.indexOf('\n',i);while(!/;\s*$/.test(src.slice(i,j))||/^\s/.test(src.slice(j+1,j+2)))j=src.indexOf('\n',j+1);return src.slice(i,j)};
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(pick('priceEnd')+'\n'+pick('priceTidy'),ctx);
const {priceEnd,priceTidy}=ctx.window;
assert.equal(priceEnd(8.57),8.75);assert.equal(priceEnd(8.22),8.25);assert.equal(priceEnd(28.12),28.25);assert.equal(priceEnd(4.96),5);
assert.equal(priceEnd(6.95),6.95);assert.equal(priceEnd(12.5),12.5);assert.equal(priceEnd(.12),.15);
const card=f=>priceTidy([f],'diner')[0];
// Stand by Me: a cent price beside dollar prices takes the dollar style
assert.equal(card('<b>Castle Rock sarsaparilla float</b><span>12¢</span><b>Cola</b><span>1.95</span>'),'<b>Castle Rock sarsaparilla float</b><span>0.15</span><b>Cola</b><span>1.95</span>');
// The Iron Giant: odd cents go up to a price ending
assert.equal(card('<span>8.57</span><span>$6.32</span>'),'<span>8.75</span><span>$6.50</span>');
// a card in cents alone stays in cents, on a multiple of 5
assert.equal(card('<span>22¢</span><span>35¢</span>'),'<span>25¢</span><span>35¢</span>');
// dollars with a $ sign keep it on the converted cents
assert.equal(card('<span>$1.25</span><span>75¢</span><span>$2.50</span>'),'<span>$1.25</span><span>$0.75</span><span>$2.50</span>');
// prices inside sentences and times are left alone; precinct evidence tags keep their cents
assert.equal(card('<p>Luncheon 11.30 till 2.30</p><p>Patties, 6.57, with coffee</p>'),'<p>Luncheon 11.30 till 2.30</p><p>Patties, 6.57, with coffee</p>');
assert.equal(priceTidy(['<span>3.29</span>'],'precinct')[0],'<span>3.29</span>');
console.log('PASS: shared prices land on price endings, one style per card.');
