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
/* review 35: food of the setting's time. A film set before 1960 (its priceEra, or its release year before 1960) or in the old world
   (Rome, medieval Britain) prints no word that only took off later: no New World food in Rome or medieval Scotland, no balsamic,
   pancetta, panko, crostini, goat's cheese, filo, pesto or corn chips on a 1930s to 1950s card, no native Australian pantry
   (wattleseed, bush tomato, lemon myrtle, pepperberry) before 1990 and no radler, Turkish bread or dukkah before then either.
   Fairy tale and fantasy films (world "storybook", or priceEra 1800s made-up worlds) and food local to the setting are left alone. */
{const FL=JSON.parse(fs.readFileSync(path.join(R,'data/film-flavour.json'),'utf8'));
 const EY={"1800s":1880,"1930s-40s":1940,"1950s":1955,"1960s":1965,"1970s":1975,"1980s":1985,"1990s":1995,"2000s":2005,"modern":2020};
 const OLD={"Gladiator (2000)":100,"Gladiator II (2024)":200,"Braveheart (1995)":1300,"Robin Hood (1973)":1190,"Brave (2012)":1000,"How to Train Your Dragon (2010)":900};
 const W=[[/\b(tomato(es)?|chill?i(es)?|potato(es)?|capsicums?|maize|chocolate|vanilla|turkey|pumpkin|peanuts?|avocados?|pineapples?|harissa|paprika|polenta|tortillas?|cocoa|cashews?)\b/i,1550],
  [/\bbalsamic\b/i,1980],[/\bpancetta\b/i,1980],[/\bpanko\b/i,1985],[/\bcrostini\b/i,1985],[/\b(wattleseed|bush tomato|lemon myrtle|pepperberr(y|ies)|finger limes?|quandong|riberr(y|ies))\b/i,1990],
  [/\bon turkish\b|\bturkish bread\b/i,1990],[/\b(corn|tortilla) chips\b/i,1975],[/\bdukkah\b/i,1995],[/\b(goat'?s? cheese|ch[eè]vre)\b/i,1980],[/\bradler\b/i,1990],[/\bpesto\b/i,1980],[/\b(sriracha|sweet chill?i sauce)\b/i,1985]];
 const LOCAL={"Gallipoli (1981)":/dukkah/i,"Roman Holiday (1953)":/pancetta|crostini|pesto|balsamic/i,"Pinocchio (1940)":/crostini/i,"Casablanca (1942)":/filo/i,"Luca (2021)":/pesto/i};
 for(const f of films){const id=`${f.title} (${f.year})`,fl=FL[id]||{};if(fl.world==="storybook")continue;
   const y=OLD[id]||(+f.year<1960?+f.year:(fl.priceEra&&fl.priceEra!=="1800s"?EY[fl.priceEra]:null));if(!y)continue;
   const txt=[];for(const c of 'SMWK')for(const d of f[c]||[])if(Array.isArray(d))txt.push(d[0],d[1]);const h=house[id]||{};for(const k of ['s','d'])if(h[k])txt.push(h[k].n,h[k].note);
   for(const t of txt)for(const [rx,yr] of W){if(yr===1550&&y>=1550)continue;if(y>=yr)continue;const m=String(t||'').match(rx);if(m&&!(LOCAL[id]&&LOCAL[id].test(m[0])))bad.push(`${id} (set about ${y}): "${m[0]}" in "${String(t).slice(0,60)}"`)}}}
/* review 37: newer trends checked on every film against the year it is set (priceEra, else release): broccolini, edamame, togarashi and
   wasabi mayo before 1995, za'atar, sumac and nigella before 2000, salted caramel before 2005, whipped feta and espresso tonic before 2012,
   sliders before 1985. A film set where the food is local keeps it */
{const FL=JSON.parse(fs.readFileSync(path.join(R,'data/film-flavour.json'),'utf8'));
 const EY={"1800s":1880,"1930s-40s":1940,"1950s":1955,"1960s":1965,"1970s":1975,"1980s":1985,"1990s":1995,"2000s":2005,"modern":2020};
 const W2=[[/\bbroccolini\b/i,1995],[/\bedamame\b/i,1995],[/\btogarashi\b/i,1995],[/\bwasabi mayo\b/i,1995],[/\b(za'?atar|sumac|nigella)\b/i,2000],[/\bsalted caramel\b/i,2005],[/\bwhipped feta\b/i,2012],[/\bespresso tonic\b/i,2012],[/\bsliders?\b/i,1985]];
 const LOCAL2={"Aladdin (1992)":/za'?atar|sumac|nigella/i,"Aladdin (2019)":/za'?atar|sumac|nigella/i,"Lawrence of Arabia (1962)":/za'?atar|sumac/i,"Casablanca (1942)":/za'?atar|sumac/i,"The Mummy (1999)":/za'?atar|sumac|nigella/i,"The Mummy Returns (2001)":/za'?atar|sumac|nigella/i,"Raiders of the Lost Ark (1981)":/za'?atar|sumac|nigella/i,"Indiana Jones and the Last Crusade (1989)":/za'?atar|sumac|nigella/i,"Lost in Translation (2003)":/edamame|togarashi|wasabi/i,"Rising Sun (1993)":/edamame|togarashi|wasabi/i,"You Only Live Twice (1967)":/edamame|togarashi/i,"The Karate Kid Part II (1986)":/edamame|togarashi/i,"Blade Runner (1982)":/togarashi/i,"Gallipoli (1981)":/sumac|za'?atar/i,"The Water Diviner (2014)":/sumac|za'?atar/i,"The Lighthorsemen (1987)":/sumac|za'?atar/i,"Mulan (1998)":/edamame/i,"Mamma Mia! (2008)":/whipped feta/i};
 for(const f of films){const id=`${f.title} (${f.year})`,fl=FL[id]||{};if(fl.world==="storybook")continue;const y=fl.priceEra?EY[fl.priceEra]:+f.year;if(!y)continue;
   const txt=[];for(const c of 'SMWK')for(const d of f[c]||[])if(Array.isArray(d))txt.push(d[0],d[1]);const h=house[id]||{};for(const k of ['s','d'])if(h[k])txt.push(h[k].n,h[k].note);
   for(const t of txt)for(const [rx,yr] of W2){if(y>=yr)continue;const m=String(t||'').match(rx);if(m&&!(LOCAL2[id]&&LOCAL2[id].test(m[0])))bad.push(`${id} (set about ${y}): "${m[0]}" in "${String(t).slice(0,60)}"`)}}}
if(bad.length){console.log(`FAIL: ${bad.length} dishes out of their time:\n  `+bad.join('\n  '));process.exit(1)}
console.log('PASS: no 2010s food trends on films released before 2010');
