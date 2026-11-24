/* Review 43: words fit where the film is set. A card set in America (the tests/spelling.test.cjs rule) prints the American word in dish
   names, notes, house lines, veg and no-alcohol notes: scallions, powdered sugar, sirloin, potatoes, corn syrup, shake, romaine, cotton candy,
   candy apples, syrup, canned, leg quarters, seasoned salt, corned beef, baking soda, cocktail sauce, Jell-O, mashed potatoes.
   Recipes and shopping lists stay in Australian words for the cook here, so they are not read. Scenes set outside America
   (Thor in London and Asgard, Cruella, Cars 2's London stop, Arthur Christmas) are skipped. */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..');
const t=fs.readFileSync(path.join(R,'tests/spelling.test.cjs'),'utf8');
const NOTUS=new Set(eval(t.match(/const NOTUS=new Set\((\[[^\]]*\])\)/)[1]));
const rj=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const FL=rj('data/film-flavour.json'),FILMS=rj('data/films.json'),HO=rj('data/film-house.json');
const SKIP=new Set(['Thor: The Dark World (2013)','Thor: Ragnarok (2017)','Cruella (2021)','Cars 2 (2011)','Arthur Christmas (2011)','Alien 3 (1992)','Avengers: Age of Ultron (2015)','Willy Wonka & the Chocolate Factory (1971)','The Fifth Element (1997)','Thor: Love and Thunder (2022)','Austin Powers: The Spy Who Shagged Me (1999)']);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const AU=/\b(spring onions?|icing sugar|rump|spuds?|golden syrup|thickshakes?|cos( lettuce)?|fairy floss|toffee apples?|cordial|tinned|marylands|chicken salt(ed)?|salt beef|silverside|bicarb|marie rose|hot chips|potato gems|pikelets|mash|(?<!royal )icing|rashers?|choc[- ]chips?|pouring cream|tyres?|takeaway|yoghurt|haloumi|cachous|napoli)\b/i;/* review 45: yoghurt, haloumi, cachous, napoli *//* review 44: icing, rashers, choc chip, pouring cream, tyre, takeaway */
const bad=[];
for(const f of FILMS){const id=f.title+' ('+f.year+')',fl=FL[id]||{};
  const us=f.theme!=='aussie'&&f.theme!=='galaxy'&&!NOTUS.has(id)&&!fl.currency&&fl.world!=='storybook'&&(!fl.country||fl.country==='US');
  if(!us||SKIP.has(id))continue;
  const strs=[];for(const k of ['S','M','W','K'])for(const d of f[k]||[])strs.push(d[0],d[1]);
  const h=HO[id]||{};for(const k of ['s','d'])if(h[k])strs.push(h[k].n||'',h[k].note||'');
  const dp=path.join(R,'data/diet',slug(id)+'.json');if(fs.existsSync(dp))for(const v of Object.values(rj('data/diet/'+slug(id)+'.json').notes||{}))strs.push(...Object.values(v));
  const rp=path.join(R,'data/recipes',slug(id)+'.json');if(fs.existsSync(rp))for(const l of Object.values(rj('data/recipes/'+slug(id)+'.json')))if(Array.isArray(l))for(const it of l)if(it&&it.note)strs.push(it.note);
  for(const s of strs){if(typeof s!=='string')continue;const m=s.match(AU);if(m&&!/white bean mash|Maryland crab/i.test(s))bad.push(`${id}: "${m[0]}" in: ${s.slice(0,110)}`)}}
if(bad.length){console.log(`FAIL: ${bad.length} Australian words on American cards:\n  `+bad.slice(0,400).join('\n  '));process.exit(1)}
console.log('PASS: American cards print American food words (names, notes, house lines, veg and no-alcohol notes).');
