/* Australian spelling on cards, notes and recipes (review 19: "Deviled Eggs" printed on Things to Do in Denver and eight more films while 35 said "devilled").
   Words that only ever turn up in their US spelling here when something slipped through; names and CSS are not scanned. */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..');
const US=/\b(deviled|armor(s|ed)?|flavor(s|ed|ful)?|favorite(s)?|savory|jewelry|fiber|omelet(s)?|caramelize(d)?|color(s|ed)?(?= (sugar|sprinkles|candy|candies))|cotton candy(?! cocoon)|harbor(?! (freight|ugh)))\b/gi;/* review 29: fairy floss and harbour (Killer Klowns' cotton candy cocoons are the film's own words) */
const files=['data/films.json','data/dish-notes.json','data/dish-names.json','data/film-house.json','data/film-flavour.json','movie-menus.js',
 ...['data/recipes','data/recipes2','data/diet'].flatMap(d=>fs.readdirSync(path.join(R,d)).filter(f=>f.endsWith('.json')).map(f=>d+'/'+f))];
/* formats.js and formats/*.js hold CSS ("color"): only the quoted words a card prints are read */
const fmt=['formats.js',...fs.readdirSync(path.join(R,'formats')).filter(f=>f.endsWith('.js')).map(f=>'formats/'+f)];
const bad=[];
for(const f of files){const t=fs.readFileSync(path.join(R,f),'utf8');for(const m of t.matchAll(US))bad.push(`${f}: ...${t.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`)}
for(const f of fmt){const t=fs.readFileSync(path.join(R,f),'utf8').replace(/<[^>]*>/g,' ');for(const m of t.matchAll(/\b(deviled|armor|flavor|favorite|savory|jewelry)\w*/gi))bad.push(`${f}: ...${t.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`)}
/* review 30: US food words. Jelly means jam here, tater tots are potato gems, shrimp are prawns, candy is lollies.
   Kept on purpose: Napoleon Dynamite's tater tots and Forrest Gump's shrimp (the films' own words), dried shrimp (sold that way here),
   Boun's Shrimporium, the Kimmy and Jell-O line, picture alt text and the price-check word lists */
const USFOOD=/\b(tater tots?|peanut butter and jelly|jell-o|hot wieners?|hard candy|shrimps?)\b/gi;
const OKFOOD=/dried shrimp|Shrimporium|Bubba|shrimp gumbo|ways to cook shrimp|Kimmy|Napoleon|Preston High|Tater Tots Served|alt="[^"]*$|prawns\?\||shrimp\||\|shrimp|still-shrimp/i;
const OWN=new Set(['Napoleon Dynamite (2004)','Forrest Gump (1994)']),strip=o=>Array.isArray(o)?o.filter(x=>!(x&&OWN.has(x.title+' ('+x.year+')'))).map(strip):o&&typeof o==='object'?Object.fromEntries(Object.entries(o).filter(([k])=>!OWN.has(k)).map(([k,v])=>[k,strip(v)])):o;
for(const f of [...files,'formats.js','poster-briefs.json','poster-recipes.json']){if(!fs.existsSync(path.join(R,f)))continue;let t=fs.readFileSync(path.join(R,f),'utf8');if(f.endsWith('.json'))t=JSON.stringify(strip(JSON.parse(t)),null,1);
  for(const m of t.matchAll(USFOOD)){const ctx=t.slice(Math.max(0,m.index-120),m.index+60);if(OKFOOD.test(t.slice(Math.max(0,m.index-120),m.index))||OKFOOD.test(ctx.slice(60)))continue;
    if(/napoleon-dynamite|forrest-gump/.test(f))continue;
    bad.push(`${f}: US food word "${m[0]}": ...${t.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`)}}
if(bad.length){console.log(`FAIL: ${bad.length} US spellings:\n  `+bad.slice(0,40).join('\n  '));process.exit(1)}
console.log(`PASS: no US spellings (deviled, armor, flavor, favorite, savory, jewelry, fiber, omelet, caramelize) in ${files.length+fmt.length} files.`);
