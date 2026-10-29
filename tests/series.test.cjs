const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const films=JSON.parse(fs.readFileSync(path.join(root,'data/films.json'),'utf8'));
const ids=new Set(films.map(f=>f.title+' ('+f.year+')'));
const series=JSON.parse(fs.readFileSync(path.join(root,'data/series.json'),'utf8'));
const seen=new Map();
for(const s of series){
  assert.ok(s.id&&s.name,'series needs an id and a name');
  assert.ok(Array.isArray(s.release)&&s.release.length>=2,`${s.id} needs at least two films`);
  for(const id of s.release){assert.ok(ids.has(id),`${s.id}: ${id} is not a film`);assert.ok(!seen.has(id),`${id} is in ${seen.get(id)} and ${s.id}`);seen.set(id,s.id)}
  if(s.story)assert.deepEqual([...s.story].sort(),[...s.release].sort(),`${s.id}: story order must hold the same films`);
}
const js=fs.readFileSync(path.join(root,'films.js'),'utf8');
assert.ok(js.includes('window.SERIES='),'films.js must carry the series list (run node scripts/build-data.cjs)');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
for(const fn of ['function seriesNote(','function openMarathon(','function marathonMenu('])assert.ok(app.includes(fn),`missing ${fn}`);
assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('id="seriesNote"'),'missing #seriesNote');
console.log(`PASS: ${series.length} series, ${seen.size} films, every title real, no film in two series, story orders match.`);
