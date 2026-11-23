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
/* review 41: a card set in America prints shrimp (Forrest Gump's "Bubba's shrimp gumbo"); its recipes still buy prawns for the shopper here.
   American = dollars with no currency of its own, not an Aussie film, not storybook or space, no other country named */
const FLV=JSON.parse(fs.readFileSync(path.join(R,'data/film-flavour.json'),'utf8')),FILMS=JSON.parse(fs.readFileSync(path.join(R,'data/films.json'),'utf8'));
const NOTUS=new Set(['The Babadook (2014)','Finding Nemo (2003)','Mission: Impossible 2 (2000)','Top End Wedding (2019)','Anyone But You (2023)','Babe (1995)','Happy Feet (2006)','Peter Rabbit (2018)','Peter Rabbit 2: The Runaway (2021)','Mad Max (1979)','Mad Max 2 (1981)','Mad Max: Fury Road (2015)','Furiosa: A Mad Max Saga (2024)','Wolf Creek (2005)','Crocodile Dundee (1986)','Crocodile Dundee II (1988)','Moulin Rouge! (2001)','Australia (2008)','Hunt for the Wilderpeople (2016)','Boy (2010)','Eagle vs Shark (2007)','What We Do in the Shadows (2014)','Next Goal Wins (2023)']);
const USSET=new Set(FILMS.map(f=>f.title+' ('+f.year+')').filter(id=>{const f=FILMS.find(x=>x.title+' ('+x.year+')'===id),fl=FLV[id]||{};return f.theme!=='aussie'&&f.theme!=='galaxy'&&!NOTUS.has(id)&&!fl.currency&&fl.world!=='storybook'&&(!fl.country||fl.country==='US')}));
const slugOf=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),USSLUG=new Set([...USSET].map(slugOf));
const stripUS=o=>Array.isArray(o)?o.filter(x=>!(x&&(OWN.has(x.title+' ('+x.year+')')||USSET.has(x.title+' ('+x.year+')')))).map(stripUS):o&&typeof o==='object'?Object.fromEntries(Object.entries(o).filter(([k])=>!OWN.has(k)&&!USSET.has(k)).map(([k,v])=>[k,stripUS(v)])):o;
for(const f of [...files,'formats.js','poster-briefs.json','poster-recipes.json']){if(!fs.existsSync(path.join(R,f)))continue;let t0=fs.readFileSync(path.join(R,f),'utf8'),t=t0,tUS=t0;if(f.endsWith('.json')){t=JSON.stringify(strip(JSON.parse(t0)),null,1);tUS=JSON.stringify(stripUS(JSON.parse(t0)),null,1)}
  if(f==='movie-menus.js'){const pre='const MOVIE_MENU_EDITIONS = ';const o=JSON.parse(t0.slice(t0.indexOf(pre)+pre.length).replace(/;\s*$/,''));tUS=JSON.stringify(stripUS(o),null,1)}
  const perUS=USSLUG.has((f.match(/\/([^/]+)\.json$/)||[])[1]);
  /* formats.js: the shrimp check reads the spec lines of films set outside America (the face templates print what the spec says) */
  if(f==='formats.js'){tUS=t0.split('\n').filter(l=>{const m=l.match(/^  "([^"]+ \(\d{4}\))":\{/);return m&&!USSET.has(m[1])&&!OWN.has(m[1])}).join('\n')}
  for(const m of [...t.matchAll(USFOOD)].filter(m=>!/^shrimps?$/i.test(m[0])).concat(perUS?[]:[...tUS.matchAll(USFOOD)].filter(m=>/^shrimps?$/i.test(m[0])).map(m=>Object.assign(m,{_us:1})))){const T=m._us?tUS:t;if(m._us){const ctx=T.slice(Math.max(0,m.index-120),m.index+60);if(OKFOOD.test(T.slice(Math.max(0,m.index-120),m.index))||OKFOOD.test(ctx.slice(60)))continue;bad.push(`${f}: US food word "${m[0]}": ...${T.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`);continue}const ctx=t.slice(Math.max(0,m.index-120),m.index+60);if(OKFOOD.test(t.slice(Math.max(0,m.index-120),m.index))||OKFOOD.test(ctx.slice(60)))continue;
    if(/napoleon-dynamite|forrest-gump/.test(f))continue;
    bad.push(`${f}: US food word "${m[0]}": ...${t.slice(Math.max(0,m.index-40),m.index+30).replace(/\s+/g,' ')}...`)}}
if(bad.length){console.log(`FAIL: ${bad.length} US spellings:\n  `+bad.slice(0,40).join('\n  '));process.exit(1)}
console.log(`PASS: no US spellings (deviled, armor, flavor, favorite, savory, jewelry, fiber, omelet, caramelize) in ${files.length+fmt.length} files.`);
