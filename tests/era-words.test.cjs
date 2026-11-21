/* Review 30 (items 13 and 20): dishes true to the film's time. Food words that only took off in the 2010s (hot honey, burrata on a
   US menu, cold brew, chilli crisp, smash burgers, gochujang wings, Nashville hot chicken, avocado toast, acai, matcha lattes, charcuterie
   boards, cronuts, nduja, birria, sriracha mayo) fail on any film released before 2010, on the printed dish names and notes, house lines,
   and the hand-built menus (formats/<key>.js for films before 2010).
   Kept on purpose: films set where the food is old and local (Ocean's Twelve's burrata in Italy, Collateral's Koreatown gochujang). */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..');
const ERA=/\b(hot honey(?! and lemon)|burrata|cold brew|chill?i crisp|smash ?burgers?|gochujang|nashville hot|avocado toast|a[cç]a[ií] bowls?|matcha latte|charcuterie boards?|cronuts?|n'?duja|birria|sriracha mayo)\b/i;
const OK={"Ocean's Twelve (2004)":/burrata/i,"Collateral (2004)":/gochujang/i};
const films=JSON.parse(fs.readFileSync(path.join(R,'data/films.json'),'utf8')),house=JSON.parse(fs.readFileSync(path.join(R,'data/film-house.json'),'utf8'));
const bad=[];
for(const f of films){const id=`${f.title} (${f.year})`;if(+f.year>=2010)continue;
  const txt=[];for(const c of 'SMWK')for(const d of f[c]||[])if(Array.isArray(d))txt.push(d[0],d[1]);
  const h=house[id]||{};for(const k of ['s','d'])if(h[k])txt.push(h[k].n,h[k].note);
  for(const t of txt){const m=String(t||'').match(ERA);if(m&&!(OK[id]&&OK[id].test(m[0])))bad.push(`${id}: "${m[0]}" in "${String(t).slice(0,60)}"`)}}
/* hand-built menus: the index says which film each formats/<key>.js draws */
const core=fs.readFileSync(path.join(R,'formats-core.js'),'utf8'),idx=JSON.parse(core.match(/FMT_INDEX=(\{[^;]*?\})[;,\n]/)[1]);
for(const [id,key] of Object.entries(idx)){const y=+(id.match(/\((\d{4})\)$/)||[])[1];if(!(y<2010))continue;const p=path.join(R,'formats',key+'.js');if(!fs.existsSync(p))continue;
  const t=fs.readFileSync(p,'utf8').replace(/<[^>]*>/g,' '),m=t.match(ERA);if(m&&!(OK[id]&&OK[id].test(m[0])))bad.push(`${id} (formats/${key}.js): "${m[0]}"`)}
if(bad.length){console.log(`FAIL: ${bad.length} dishes out of their time:\n  `+bad.join('\n  '));process.exit(1)}
console.log('PASS: no 2010s food trends on films released before 2010');
