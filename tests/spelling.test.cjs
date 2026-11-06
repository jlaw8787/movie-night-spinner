/* Australian spelling on cards, notes and recipes (review 19: "Deviled Eggs" printed on Things to Do in Denver and eight more films while 35 said "devilled").
   Words that only ever turn up in their US spelling here when something slipped through; names and CSS are not scanned. */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..');
const US=/\b(deviled|armor(s|ed)?|flavor(s|ed|ful)?|favorite(s)?|savory|jewelry|fiber|omelet(s)?|caramelize(d)?|color(s|ed)?(?= (sugar|sprinkles|candy|candies)))\b/gi;
const files=['data/films.json','data/dish-notes.json','data/dish-names.json','data/film-house.json','data/film-flavour.json','movie-menus.js',
 ...['data/recipes','data/recipes2','data/diet'].flatMap(d=>fs.readdirSync(path.join(R,d)).filter(f=>f.endsWith('.json')).map(f=>d+'/'+f))];
/* formats.js and formats/*.js hold CSS ("color"): only the quoted words a card prints are read */
const fmt=['formats.js',...fs.readdirSync(path.join(R,'formats')).filter(f=>f.endsWith('.js')).map(f=>'formats/'+f)];
const bad=[];
for(const f of files){const t=fs.readFileSync(path.join(R,f),'utf8');for(const m of t.matchAll(US))bad.push(`${f}: ...${t.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`)}
for(const f of fmt){const t=fs.readFileSync(path.join(R,f),'utf8').replace(/<[^>]*>/g,' ');for(const m of t.matchAll(/\b(deviled|armor|flavor|favorite|savory|jewelry)\w*/gi))bad.push(`${f}: ...${t.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`)}
if(bad.length){console.log(`FAIL: ${bad.length} US spellings:\n  `+bad.slice(0,40).join('\n  '));process.exit(1)}
console.log(`PASS: no US spellings (deviled, armor, flavor, favorite, savory, jewelry, fiber, omelet, caramelize) in ${files.length+fmt.length} files.`);
