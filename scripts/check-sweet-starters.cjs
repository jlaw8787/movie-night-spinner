/* Sweets with sweets: lists every biscuit, cake, lolly, ice cream and the like that a film lists as a starter.
     node scripts/check-sweet-starters.cjs        prints each one with why it stays, exits 1 on any not on the keep list
   Looks at the card (data/films.json S) and the cooked recipes (data/recipes2 course "s").
   Hand-built menus (formats.js) are left out: their starter groups are scenes from the film ("Emergency supplies", "On the platform").
   A sweet stays a starter only when the film makes it one (KEEP below, with the reason). Savoury names that look sweet
   (pies, cheese tarts, biscuits and gravy, popcorn) are matched by SAV and BREAD. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const R=path.join(__dirname,'..');
const SW=/\b(biscuits?|cookies?|shortbread|cakes?|cupcakes?|brownies?|fudge|lollies|lolly|gumm(y|ies)|marshmallows?|ice[- ]creams?|sundaes?|doughnuts?|donuts?|crullers?|toffee|candy|candied|caramels?|chocolates?|macarons?|meringues?|lamingtons?|pavlova|truffles?|jelly beans|jellies|sorbet|gelato|snow cones?|wafers?|tarts?|tartlets?|pudding|muffins?|scones?|churros|cannoli|eclairs?|biscotti|popsicles?|ice blocks?|lollipops?|sweets|treacle|pie|pies|bark|nougat|buckeyes|scrolls|cake pops|fairy floss|honeycomb|croissants?|pączki)\b/i;
const SAV=/\b(crab|fish|potato|rice|salmon|prawn|tuna|zucchini|polenta|pancakes?|rösti|cheese tarts?|cheese twists|pork pie|meat pie|mince and cheese pie|pie floaters|pie, mash|tomato pie|quiche|pasty|yorkshire|black pudding|clam cakes|daikon cakes|bubble and squeak|fries|beans|biscuits and gravy|party tarts|savoury|popcorn|caramel corn|party pies|meat pies|beef|mutton|scallop|chicken|ham|cheddar|cheese|gruyère|mushroom|pizza|sausage|bacon|leek|hand pies)\b/i;
/* American buttermilk biscuits and plain scones are bread, not sweets */
const BREAD=/buttermilk biscuits|boarding house biscuits|Grandma's biscuits|Meeko's biscuits|Honeycomb and biscuits|country scones|buttermilk scones/i;
const KEEP={
 "Hop (2011)":"the Easter Bunny's candy factory: E.B. snacks on jellybeans all film (the rocky road was a starter before the 8 Nov rename)",
 "Elf (2003)":"the film's joke: Buddy eats sweets as his four main food groups",
 "Stakeout (1987)":"stakeout doughnuts, eaten in the car before supper",
 "The French Connection (1971)":"stakeout coffee and doughnuts in the car",
 "Saw (2004)":"Tapp's stakeout doughnuts",
 "Superbad (2007)":"the cops' squad car doughnuts",
 "Dragnet (1987)":"police squad room doughnuts",
 "Zootopia (2016)":"Clawhauser's doughnuts at the front desk",
 "Serpico (1973)":"squad room doughnuts",
 "Wayne's World (1992)":"Stan Mikita's doughnut shop is where they hang out",
 "Wayne's World 2 (1993)":"Stan Mikita's doughnut shop is where they hang out",
 "Strange Brew (1983)":"the doughnut shop stop",
 "Harry Potter and the Philosopher's Stone (2001)|Trolley chocolate frogs with honeycomb":"the trolley on the train, before the feast",
 "Harry Potter and the Prisoner of Azkaban (2004)|Lupin's chocolate":"Lupin's chocolate on the train after the dementor",
 "Labyrinth (1986)":"the worm's invitation to tea, toasted fruit loaf",
 "Thunderbolts* (2025)":"trail mix, nuts with a little chocolate",
 "Willy Wonka & the Chocolate Factory (1971)":"the film's joke: everything in the chocolate room is eatable",
 "Charlie and the Chocolate Factory (2005)":"the film's joke: the golden ticket bars and the chocolate room",
 "Wreck-It Ralph (2012)":"the film's joke: Sugar Rush is a world made of lollies",
 "Alice in Wonderland (1951)|Eat me cakes":"the film's joke: Alice eats the cake to grow",
 "Wolf Creek (2005)|Outback roadhouse pies":"savoury: braised beef pies",
 "Kung Fu Hustle (2004)|The baker's doughnuts":"savoury: youtiao, fried dough sticks",
};
const keepOf=(id,n)=>KEEP[id+'|'+n]||KEEP[id]||null;
const isSweet=n=>SW.test(n)&&!SAV.test(n)&&!BREAD.test(n);
function handBuilt(){const c={};vm.createContext(c);
  vm.runInContext('const ESC=s=>s,TMDB_IMG="",movieEdition=f=>null,exactMenu=f=>null,toItem=x=>x,lobbyPoster=f=>null;'+fs.readFileSync(path.join(R,'tmdb-posters.js'),'utf8')+fs.readFileSync(path.join(R,'formats.js'),'utf8')+';this.S=FMT_FILMS',c);
  return new Set(Object.keys(c.S))}
function scan(){
  const films=JSON.parse(fs.readFileSync(path.join(R,'data/films.json'),'utf8')),hb=handBuilt(),kept=[],bad=[];
  const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  for(const f of films){const id=f.title+' ('+f.year+')';if(hb.has(id))continue;
    const names=new Map();for(const d of f.S||[])names.set(d[0],'card');
    const p=path.join(R,'data/recipes2',slug(id)+'.json');
    if(fs.existsSync(p))for(const d of JSON.parse(fs.readFileSync(p,'utf8')).dishes)if(d.course==='s')names.set(d.n,(names.get(d.n)?names.get(d.n)+', ':'')+'recipe');
    for(const [n,src] of names)if(isSweet(n)){const why=keepOf(id,n);(why?kept:bad).push({id,n,src,why})}}
  return {kept,bad}}
module.exports={scan,isSweet,KEEP};
if(require.main===module){const {kept,bad}=scan();
  for(const k of kept)console.log('keep  '+k.id+' | '+k.n+' | '+k.why);
  for(const b of bad)console.log('SWEET '+b.id+' | '+b.n+' | starter on the '+b.src);
  console.log(kept.length+' kept for the scene, '+bad.length+' to move');process.exit(bad.length?1:0)}
