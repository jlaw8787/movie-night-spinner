/* Vegetarian versions say what they cook (review 13, fix 2).
   A dish's vegetarian alternative (data/recipes2 dish.alt.veg and .veg_af) has its own name, shopping and method,
   and its Make ahead note and every method step must not tell the cook to handle meat or fish.
   Words that name the vegetarian thing ("vegetarian sausages", "plant-based mince", "cauliflower steaks", "mushroom meatballs") are fine. */
const fs=require('node:fs'),path=require('node:path');
const D=path.join(__dirname,'..','data/recipes2');
const MEAT=/\b(beef|pork|lamb|chicken|bacon|ham|prawns?|shrimp|fish|steaks?|salmon|tuna|turkey|duck|veal|brisket|chorizo|salami|pancetta|prosciutto|crab|lobster|oysters|mussels|clams|squid|pepperoni|sausages?|meatballs?|mince)\b/gi;
const VEGW=/(vegetarian|plant-based|vegan|veggie|meat-free|mushroom|lentil|eggplant|cauliflower|beetroot|celeriac|pumpkin|tofu|bean|chickpea|corn|cabbage|watermelon|halloumi|haloumi|tempeh|jackfruit|soy|fake|gummy|candy|chocolate|jelly|sour|lolly|swedish|cookie|biscuit|pastry|cake)[\s-]+(\w+[\s-]+)?$/i;
const OK=/\b(fish sauce|fish-shaped|fish shapes|fish cutter|goldfish|fish crackers|swedish fish|gummy fish|ham(burger|let)|rock salt|oyster mushrooms?|oyster sauce|chicken-style|beef-style|chicken salt|orange fish)\b/gi;
const bad=[];
for(const f of fs.readdirSync(D)){const j=JSON.parse(fs.readFileSync(path.join(D,f),'utf8'));
 for(const d of j.dishes||[])for(const k of ['veg','veg_af']){const a=d.alt&&d.alt[k];if(!a)continue;
  /* a word the vegetarian shopping already names ("vegetarian sausages", "plant-based mince", "cauliflower" cut into steaks) is that thing */
  const ing=(a.ingredients||[]).map(i=>String(i.item||'').toLowerCase()).join(' | ');const stem=w=>w.toLowerCase().replace(/s$/,'');
  const owned=w=>ing.includes(stem(w))||(/^sausages?$/i.test(w)&&/bratwurst|frankfurt|hot dog|links|kransky|snags/.test(ing))||(/^steaks?$/i.test(w)&&/cauliflower|celeriac|cabbage|mushroom|eggplant|beetroot|pumpkin|tofu|halloumi|haloumi|watermelon/.test(ing))||(/^meatballs?$/i.test(w)&&/lentil|mushroom|eggplant|ricotta|chickpea|bean|plant-based|vegetarian/.test(ing+' '+String(a.n).toLowerCase()));
  const lines=[['make ahead',a.make_ahead||''],...(a.steps||[]).map((s,i)=>['step '+(i+1),String(s.text||'')])];
  for(const [w,t0] of lines){const t=t0.replace(OK,' ');for(const m of t.matchAll(MEAT)){if(owned(m[0]))continue;if(VEGW.test(t.slice(Math.max(0,m.index-40),m.index)))continue;bad.push(`${f.replace('.json','')} [${k}] ${a.n}, ${w}: ...${t.slice(Math.max(0,m.index-50),m.index+40)}...`)}}}}
if(bad.length){console.log(`FAIL: ${bad.length} vegetarian lines still name meat or fish:\n  `+bad.join('\n  '));process.exit(1)}
console.log('PASS: every vegetarian version\'s Make ahead note and method name only what it cooks.');
