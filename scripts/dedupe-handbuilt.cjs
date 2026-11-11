/* One-off (11 Nov 2026): the last five films whose cooked five did not match the film's own dish list, all hand-built menus.
   The printed menu and the Prep sheet are the truth. Same food under two names takes one name (the film's own);
   a cooked dish the film's list never had is added to the front of its course. Nothing is removed. Safe to run twice.
     node scripts/dedupe-handbuilt.cjs && node scripts/build-data.cjs */
const fs=require('fs');
const rj=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const films=rj('data/films.json');
const mm=fs.readFileSync('movie-menus.js','utf8'),pre='const MOVIE_MENU_EDITIONS = ',at=mm.indexOf(pre)+pre.length,tail=/;\s*$/.test(mm.slice(at))?';':'';
const E=JSON.parse(mm.slice(at).replace(/;\s*$/,''));
let fm=fs.readFileSync('formats.js','utf8');
const film=id=>films.find(f=>f.title+' ('+f.year+')'===id);
const K={s:'S',m:'M',w:'W',d:'K'};
const each=(id,fn)=>{for(const c of ['s','m','w','d'])E[id].menu[c].forEach((it,i)=>fn(it,c,i))};
const cardNote=(id,n)=>{for(const k of 'SMWK')for(const r of film(id)[k]||[])if(r[0]===n)return r[1]};
/* the consolidated list: same item and unit adds up, the rest is listed once */
const shopping=id=>{const out=[],ix={};each(id,it=>{for(const x of it.shop){const [n,a]=x.split('@'),m=n.match(/^(\d+)\s*(g|ml)?\s+(.+)$/);const key=m?a+'|'+(m[2]||'#')+'|'+m[3].replace(/s$/,''):a+'|='+n;
  if(ix[key]==null){ix[key]=out.length;out.push(m?{q:+m[1],u:m[2]||'',w:m[3],a}:{raw:n,a})}else if(m){const t=out[ix[key]];t.q+=+m[1];if(!m[2]&&!/s$/.test(t.w)&&/^(egg|lime|garlic clove|orange)$/.test(t.w))t.w+='s'}}});
  return out.map(t=>t.raw?t.raw+'@'+t.a:t.q+(t.u?t.u+' ':' ')+t.w+'@'+t.a)};
/* a cooked dish takes the film's name for it: edition, tested recipe and the menu's own key, and it prints the film's note */
const rename=(id,slug,old,nw)=>{each(id,it=>{if(it.n===old){it.n=nw;it.note=cardNote(id,nw)||it.note}});
  const p='data/recipes2/'+slug+'.json',r=rj(p);for(const d of r.dishes)if(d.n===old)d.n=nw;fs.writeFileSync(p,JSON.stringify(r,null,1));
  fm=fm.split('"k":'+JSON.stringify(old)).join('"k":'+JSON.stringify(nw))};
/* a cooked dish the film's list never had goes on the front of its course, word for word from the edition */
const add=(id,names)=>{const f=film(id);for(const c of ['d','w','m','s']){const have=new Set(f[K[c]].map(r=>r[0]));
  const fresh=E[id].menu[c].filter(it=>names.includes(it.n)&&!have.has(it.n)).map(it=>[it.n,it.note,it.how,it.shop.slice()]);f[K[c]]=fresh.concat(f[K[c]])}};

/* After Hours: the burger went back to "Last Stop burger" on 8 Nov and the edition never followed */
rename('After Hours (1985)','after-hours-1985','Terminal Bar burger','Last Stop burger');

/* The Godfather */
rename('The Godfather (1972)','the-godfather-1972','Wedding antipasto',"Connie's wedding antipasto");
rename('The Godfather (1972)','the-godfather-1972','Ricotta & pistachio cannoli',"Clemenza's cannoli");
add('The Godfather (1972)',['Golden arancini','Blood orange Italian soda']);

/* The Warriors */
add('The Warriors (1979)',['Boardwalk pretzel bites','Street-cart corn','Chocolate-dipped ice-cream sandwiches','Cherry cola']);

/* When Harry Met Sally: the edition cooks what the Katz's check prints (pickles and the chef salad, not a knish and grape crostini) */
{const id='When Harry Met Sally... (1989)',m=E[id].menu;
 m.s=[{n:'Fried deli pickles with mustard mayo',note:cardNote(id,'Fried deli pickles with mustard mayo'),
   how:'Cut 4 half-sour or dill pickles into spears and pat very dry; keep 1 tsp of the brine. Whisk 80g plain flour, 40g rye flour, 1/2 tsp paprika and 150ml cold soda water into a thin batter. Heat 1 litre vegetable oil to 180°C. Dip the spears and fry in batches for about 2 minutes until crisp. Drain on a rack and salt lightly. Stir 100g mayonnaise with 2 tbsp yellow mustard and the brine and serve alongside.',
   shop:['4 half-sour or dill pickles@Deli','80g plain flour@Pantry','40g rye flour@Pantry','1/2 tsp paprika@Pantry','150ml soda water@Drinks','1 litre vegetable oil@Pantry','100g mayonnaise@Pantry','30g yellow mustard@Pantry']},
  {n:"Sally's chef salad",note:cardNote(id,"Sally's chef salad"),
   how:'Hard-boil 4 eggs for 10 minutes, cool in cold water, peel and halve. Wash 2 cos lettuces, dry well and tear onto a large platter. Arrange 200g sliced leg ham, 200g sliced turkey, 150g Swiss cheese cut into strips, the eggs, 2 sliced tomatoes and half a sliced cucumber in rows over the lettuce. Pour 60ml olive oil and 30ml red wine vinegar into two little jugs and serve them on the side.',
   shop:['4 eggs@Dairy','2 cos lettuces@Produce','200g sliced leg ham@Deli','200g sliced turkey@Deli','150g Swiss cheese@Dairy','2 tomatoes@Produce','1 cucumber@Produce','60ml olive oil@Pantry','30ml red wine vinegar@Pantry']}];
 m.shopping=shopping(id)}

/* Ghostbusters: the edition held five dishes the work order never printed. It now holds the five the Prep sheet cooks, from the tested recipes */
{const id='Ghostbusters (1984)',m=E[id].menu,N=n=>cardNote(id,n);
 m.s=[{n:"Slimer's slime dip",note:N("Slimer's slime dip"),
   how:'Wilt 250g spinach in a dry pan, cool, squeeze very dry and chop with 150g drained marinated artichokes. Mix with 150g softened cream cheese, 100g sour cream, 75g grated mozzarella, 30g grated parmesan and 1 crushed garlic clove. Spoon into a small baking dish, top with 25g mozzarella and bake at 190°C for 20 minutes until bubbling. Serve hot with 200g corn chips for scooping.',
   shop:['250g spinach@Produce','150g marinated artichokes@Deli','150g cream cheese@Dairy','100g sour cream@Dairy','100g mozzarella@Dairy','30g parmesan@Dairy','1 garlic clove@Produce','200g corn chips@Pantry']},
  {n:"Dana's fridge devilled eggs",note:N("Dana's fridge devilled eggs"),
   how:'Boil 6 eggs for 10 minutes, cool in iced water and peel. Halve them and scoop the yolks into a bowl. Whip the yolks with 3 tbsp mayonnaise, 1 tsp Dijon mustard, a pinch of salt and a drop of green food colouring until smooth. Pipe back into the whites and scatter over 2 tbsp snipped chives.',
   shop:['6 eggs@Dairy','3 tbsp mayonnaise@Pantry','1 tsp Dijon mustard@Pantry','green food colouring@Pantry','salt@Pantry','1 bunch chives@Produce']}];
 m.m=[{n:'Firehouse meatball sub',note:N('Firehouse meatball sub'),
   how:'Mix 250g pork mince and 250g beef mince with 1 egg, 40g grated parmesan, 30g breadcrumbs, 1 crushed garlic clove, salt and pepper, and roll into 16 meatballs. Bake on a lined tray at 200°C for 15 minutes. Simmer 700ml passata with 1 tsp dried oregano, add the meatballs and simmer for 15 minutes. Split 4 long rolls, pack in the meatballs and sauce and lay 8 slices provolone on top. Grill for 2 to 3 minutes until the cheese has melted.',
   shop:['250g pork mince@Meat','250g beef mince@Meat','1 egg@Dairy','40g parmesan@Dairy','30g breadcrumbs@Pantry','1 garlic clove@Produce','pepper@Pantry','700ml passata@Pantry','1 tsp dried oregano@Pantry','4 long rolls@Bakery','8 slices provolone@Deli']}];
 m.w=[{n:"Stay Puft s'mores",note:N("Stay Puft s'mores"),
   how:'Lay 8 digestive biscuits on a tray and put a square from 100g milk chocolate on each. Toast 8 large marshmallows over a flame until golden and melting, or sit one on each chocolate square and put the tray under a hot grill for 30 seconds. Press 8 more biscuits on top and eat straight away.',
   shop:['8 large marshmallows@Pantry','16 digestive biscuits@Pantry','100g milk chocolate@Pantry']}];
 m.d=[{n:'Ectoplasm slushie',note:N('Ectoplasm slushie'),
   how:'Blitz 600g ice with 150ml lime cordial and 600ml chilled lemonade until slushy. Add a drop of green food colouring and blitz again. Pour into 4 glasses and add a slice from 1 lime to each.',
   shop:['600g ice@Frozen','150ml lime cordial@Drinks','600ml lemonade@Drinks','green food colouring@Pantry','1 lime@Produce']}];
 m.shopping=shopping(id)}

fs.writeFileSync('data/films.json',JSON.stringify(films));
fs.writeFileSync('movie-menus.js',mm.slice(0,at)+JSON.stringify(E)+tail+(mm.endsWith('\n')?'\n':''));
fs.writeFileSync('formats.js',fm);
/* report: every cooked dish must now be on the film's own list */
for(const id of ['The Warriors (1979)','Ghostbusters (1984)','The Godfather (1972)','When Harry Met Sally... (1989)','After Hours (1985)']){
  const have=new Set('SMWK'.split('').flatMap(k=>film(id)[k].map(r=>r[0]))),miss=[];each(id,it=>{if(!have.has(it.n))miss.push(it.n)});console.log(id,miss.length?'STILL OFF: '+miss.join(', '):'ok')}
