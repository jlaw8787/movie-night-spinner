// Dependency-free regression tests run against the watched-state code in index.html.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const filmSource = source.match(/const FILMS=.*?;\n/)[0];
const watchedSource = source.slice(source.indexOf('/* Watched status'), source.indexOf('function size(){'));
class Element {
  constructor(tag='div') { this.tag=tag; this.children=[]; this.value=''; this.checked=false; this.disabled=false; this.attributes={}; this.listeners={}; this.textContent=''; }
  setAttribute(k,v) { this.attributes[k]=v; }
  getAttribute(k) { return this.attributes[k]; }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.append(item); }
  replaceChildren() { this.children=[]; }
  addEventListener(k,f) { this.listeners[k]=f; }
  contains(item) { return item===this || this.children.some(c=>c.contains(item)); }
  querySelectorAll(tag) { return this.children.flatMap(c=>[...(c.tag===tag?[c]:[]),...c.querySelectorAll(tag)]); }
  focus() {}
}
function boot(values={},blocked=false) {
  const elements={};
  const $=id=>elements[id] ||= new Element();
  $('themeSel').value='all'; $('watchFilter').value='all';
  const storage={...values};
  const context=vm.createContext({console,document:{createElement:t=>new Element(t),activeElement:null},$,
    localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>{if(blocked)throw Error('blocked');storage[k]=v;}}});
  vm.runInContext(filmSource+`
    const sel=$('themeSel'); const N=24;
    let list=[],wedges=[],rot=0,winner=-1,spinning=false,current=null;
    const canvas={width:500,height:500},ctx={clearRect(){}};
    function draw(){} function shuffle(a){return a.slice()}
  `+watchedSource,context);
  const run=code=>vm.runInContext(code,context);
  run('setList()');
  return {run,$,storage};
}
let app=boot();
const count=app.run('FILMS.length');
assert.ok(count>=709);
assert.equal(app.run('list.length'),count);
app.run('current=FILMS[0];setWatched(current,true)');
assert.equal(app.run('watched.size'),1);
assert.equal(app.run('list.some(f=>f.id===current.id)'),false);
assert.equal(app.$('watchCurrent').getAttribute('aria-pressed'),'true');
assert.equal(JSON.parse(app.storage['mns-watched']).length,1);
app=boot(app.storage);
assert.equal(app.run('watched.size'),1); // Persists across a fresh visit.
app.run('current=FILMS[0];setWatched(current,false)');
assert.equal(app.run('list.length'),count);
app.run('setWatched(FILMS[0],true);skipWatched=false;saveWatched();setList()');
assert.equal(app.run('list.length'),count); // Rewatch option.
app=boot(app.storage);
assert.equal(app.run('skipWatched'),false);
app.run('sel.value="redsauce";skipWatched=true;setList()');
assert.equal(app.run('list.every(f=>f.theme==="redsauce"&&!watched.has(f.id))'),true);
app.run('watched=new Set(FILMS.map(f=>f.id));setList()');
assert.equal(app.run('list.length'),0);
assert.equal(app.run('wedges.length'),0);
assert.equal(app.$('spin').disabled,true);
assert.match(app.$('count').textContent,/every film/);
app.run('setWatched(FILMS[0],false)');
assert.equal(app.run('list.length'),1);
assert.equal(app.$('spin').disabled,false);
app.$('watchSearch').value='godfather';app.run('renderWatchList()');
assert.equal(app.$('watchList').children.length,3);
app.$('watchFilter').value='unwatched';app.run('renderWatchList()');
assert.equal(app.$('watchList').children.length,1);
app.$('watchSearch').value='not a film xyz';app.run('renderWatchList()');
assert.match(app.$('watchList').children[0].textContent,/No films match/);
app.run('spinning=true;setWatched(FILMS[0],true)');
assert.equal(app.run('watched.has(FILMS[0].id)'),false); // No pool changes mid-spin.
for(const stored of ['{bad json','{}','null','["unknown film"]']) {
 const bad=boot({'mns-watched':stored});assert.equal(bad.run('watched.size'),0);assert.equal(bad.run('list.length'),count);
}
app=boot({},true);app.run('setWatched(FILMS[0],true)');
assert.equal(app.run('watched.size'),1);
assert.match(app.$('watchSave').textContent,/visit only/);
console.log('PASS: watched persistence, undo, rewatch, theme/search/status filters, empty pool, spin guard and storage recovery.');
