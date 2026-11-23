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
 const W2=[[/\bbroccolini\b/i,1995],[/\bedamame\b/i,1995],[/\btogarashi\b/i,1995],[/\bwasabi mayo\b/i,1995],[/\b(za'?atar|sumac|nigella)\b/i,2000],[/\bsalted caramel\b/i,2005],[/\bwhipped feta\b/i,2012],[/\bespresso tonic\b/i,2012],[/\bsliders?\b/i,1985],/* review 38 */[/\bmichelada\b/i,1990],[/\bbananas foster\b/i,1951],[/\bturmeric (shots?|latte|tonic)\b/i,2010],[/\bcake pops?\b/i,2008],[/\bcrumbled nori\b|\bnori (salt|crumb)/i,1990],[/\bchilli lime salt\b/i,2000],[/\bcoconut yoghurt\b/i,2005],/* review 39 */[/\bchipotle (mayo|slaw|crema|sour cream|aioli)\b/i,2000],[/\b(hot|chill?i) honey\b(?! and lemon)/i,2010],[/\bsriracha\b/i,1998],[/\bpanko\b/i,1990],[/\bcold[- ]fermented\b/i,2005],[/\bwhipped ricotta\b/i,2010],[/\bwhipped goat'?s? cheese\b/i,2000],[/\bbutterfly pea\b/i,2015],[/\bskillet cookie\b/i,2010],[/\bstreet corn\b|\belote\b/i,2010],[/\bpok[eé]\b(?! (?:at|in|fun))/i,2010],[/\bbao\b/i,2005],[/\bchimichurri\b/i,1995],[/\bjalape[nñ]o poppers\b/i,1985],[/\bsalted caramel\b/i,2005]];
 const LOCAL2={"Rush Hour 2 (2001)":/bao/i,"Kill Bill: Vol. 2 (2004)":/street corn|elote/i,"Collateral (2004)":/elote|street corn/i,"Shrek (2001)":/panko/i,"Moana (2016)":/panko|pok[eé]/i,"Moana 2 (2024)":/panko/i,"Lilo & Stitch (2002)":/pok[eé]/i,"50 First Dates (2004)":/pok[eé]/i,"Forgetting Sarah Marshall (2008)":/pok[eé]/i,"Three Amigos! (1986)":/street corn|elote/i,"Terminator 2: Judgment Day (1991)":/elote/i,"Nacho Libre (2006)":/elote/i,"Once Upon a Time in Mexico (2003)":/elote|chipotle/i,"Desperado (1995)":/chipotle/i,"El Mariachi (1992)":/chipotle/i,"Bloodsport (1988)":/bao/i,"Rumble in the Bronx (1995)":/bao/i,"Starship Troopers (1997)":/chimichurri/i,"Return of the Jedi (1983)":/panko/i,"Flash Gordon (1980)":/panko/i,"Demolition Man (1993)":/./i,"Star Wars: Episode II - Attack of the Clones (2002)":/chill?i honey/i,"Aladdin (1992)":/za'?atar|sumac|nigella/i,"Aladdin (2019)":/butterfly pea|za'?atar|sumac|nigella/i,"Lawrence of Arabia (1962)":/za'?atar|sumac/i,"Casablanca (1942)":/za'?atar|sumac/i,"The Mummy (1999)":/za'?atar|sumac|nigella/i,"The Mummy Returns (2001)":/za'?atar|sumac|nigella/i,"Raiders of the Lost Ark (1981)":/za'?atar|sumac|nigella/i,"Indiana Jones and the Last Crusade (1989)":/za'?atar|sumac|nigella/i,"Lost in Translation (2003)":/edamame|togarashi|wasabi/i,"Rising Sun (1993)":/edamame|togarashi|wasabi/i,"You Only Live Twice (1967)":/edamame|togarashi/i,"The Karate Kid Part II (1986)":/edamame|togarashi/i,"Blade Runner (1982)":/togarashi/i,"Gallipoli (1981)":/sumac|za'?atar/i,"The Water Diviner (2014)":/sumac|za'?atar/i,"The Lighthorsemen (1987)":/sumac|za'?atar/i,"Mulan (1998)":/edamame/i,"Mamma Mia! (2008)":/whipped feta/i};
 for(const f of films){const id=`${f.title} (${f.year})`,fl=FL[id]||{};if(fl.world==="storybook")continue;const y=fl.priceEra?EY[fl.priceEra]:+f.year;if(!y)continue;
   const txt=[];for(const c of 'SMWK')for(const d of f[c]||[])if(Array.isArray(d))txt.push(d[0],d[1]);const h=house[id]||{};for(const k of ['s','d'])if(h[k])txt.push(h[k].n,h[k].note);
   for(const t of txt)for(const [rx,yr] of W2){if(y>=yr)continue;const m=String(t||'').match(rx);if(m&&!(LOCAL2[id]&&LOCAL2[id].test(m[0])))bad.push(`${id} (set about ${y}): "${m[0]}" in "${String(t).slice(0,60)}"`)}}}
/* review 40: the year a film is set (data/film-set-year.json, else priceEra, else release) against food that came later, on the printed
   dishes, house lines, hand-built specs (formats.js) and poster editions (movie-menus.js). Sliders before 2005, cold brew before 2008,
   edible glitter before 2012, brown butter choc chip cookies and hot or chilli honey before 2010, whipped ricotta or goat's cheese before
   2010, lime crema and fish tacos before 1985, ciabatta and tiramisu before 1985, aioli before 1985 in America, chipotle before 1990,
   mezcal before 2008 outside Mexico, elderflower before 2000 in America, panko before 1995. Local food stays (Hawaii, Mexico, Japan). */
{const FL=JSON.parse(fs.readFileSync(path.join(R,'data/film-flavour.json'),'utf8')),SY=JSON.parse(fs.readFileSync(path.join(R,'data/film-set-year.json'),'utf8'));
 const EY={"1800s":1880,"1930s-40s":1940,"1950s":1955,"1960s":1965,"1970s":1975,"1980s":1985,"1990s":1995,"2000s":2005,"modern":2020};
 const W3=[[/\bsliders?\b/i,2005],[/\bcold brew\b/i,2008],[/\bedible glitter\b/i,2012],[/\bbrown butter choc/i,2010],[/\b(hot|chill?i) honey\b(?! and lemon)/i,2010],[/\bwhipped (ricotta|goat)/i,2010],[/\blime crema\b/i,1985],[/\bfish tacos?\b/i,1985],[/\bciabatta\b/i,1985],[/\btiramis[uù]\b/i,1985],[/\bchipotle\b/i,1990],[/\bpanko\b/i,1995]];
 const US=[/\baioli\b/i,1985],MEZ=[/\bmezcal\b/i,2008],ELD=[/\belderflower\b/i,2000];
 const KEEP={"Harold & Kumar Go to White Castle (2004)":/slider/i,"Moana (2016)":/panko/i,"Moana 2 (2024)":/panko/i,"Shrek (2001)":/panko/i,"Shrek 2 (2004)":/glitter|aioli/i,"Point Break (1991)":/fish tacos?/i,"Top Gun (1986)":/fish tacos?/i,"The Shawshank Redemption (1994)":/fish tacos?/i,"Demolition Man (1993)":/fish tacos?|elderflower/i,"Return of the Jedi (1983)":/panko/i,"Star Wars (1977)":/mezcal/i,"Star Wars: Episode II - Attack of the Clones (2002)":/chill?i honey/i,"Desperado (1995)":/mezcal/i,"The Good, the Bad and the Ugly (1966)":/mezcal/i,"El Mariachi (1992)":/mezcal/i,"Once Upon a Time in Mexico (2003)":/mezcal|chipotle/i,"Three Amigos! (1986)":/chipotle/i,"Lost in Translation (2003)":/panko/i,"Kill Bill: Vol. 1 (2003)":/panko/i,"The Big Lebowski (1998)":/lime crema/i};
 const E=(()=>{const t=fs.readFileSync(path.join(R,'movie-menus.js'),'utf8'),pre='const MOVIE_MENU_EDITIONS = ';return JSON.parse(t.slice(t.indexOf(pre)+pre.length).replace(/;\s*$/,''))})();
 const FMT=fs.readFileSync(path.join(R,'formats.js'),'utf8'),blk=id=>{const i=FMT.indexOf(JSON.stringify(id)+':{');if(i<0)return '';const j=FMT.indexOf('\n  "',i+5);return FMT.slice(i,j<0?i+20000:j)};
 const strs=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(strs):v&&typeof v==='object'?Object.values(v).flatMap(strs):[];
 for(const f of films){const id=`${f.title} (${f.year})`,fl=FL[id]||{};if(fl.world==="storybook")continue;if(["galaxy","fairytale"].includes(f.theme))continue;
   const y=SY[id]||(fl.priceEra?EY[fl.priceEra]:+f.year);if(!y)continue;
   const txt=[];for(const c of 'SMWK')for(const d of f[c]||[])if(Array.isArray(d))txt.push(d[0],d[1]);const h=house[id]||{};for(const k of ['s','d'])if(h[k])txt.push(h[k].n,h[k].note);
   if(E[id])txt.push(...strs(E[id].menu||{}));const b=blk(id);if(b)txt.push(b.replace(/<[^>]*>/g,' '));
   const rules=[...W3];if(!['aussie'].includes(f.theme)&&f.theme!=='mex')rules.push(US);if(f.theme!=='mex')rules.push(MEZ);if(!/Four Weddings|Sound of Music|My Fair Lady|Bambi|Narnia|Notting Hill|Bridget Jones|Paddington|Love Actually|About Time|Last Christmas|Harry Potter/.test(id))rules.push(ELD);
   for(const t of txt)for(const [rx,yr] of rules){if(y>=yr)continue;const m=String(t||'').match(rx);if(m&&!(KEEP[id]&&KEEP[id].test(m[0])))bad.push(`${id} (set about ${y}): "${m[0]}" in "${String(t).slice(0,70)}"`)}}}
if(bad.length){console.log(`FAIL: ${bad.length} dishes out of their time:\n  `+bad.join('\n  '));process.exit(1)}
console.log('PASS: no 2010s food trends on films released before 2010');
