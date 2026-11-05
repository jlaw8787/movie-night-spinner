// A dry card never buys grog (review 11): kids, fairytale, Christmas and wizard films print alcohol-free
// versions, so the planner cooks and shops those too, with No alcohol off. Grown-up films still cook what they print.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const grab=re=>{const m=app.match(re);assert.ok(m,'app.js lost '+re);return m[0]};
const src=[grab(/const dietBooze=[^\n]*/),grab(/const dietMeat=[^\n]*/),grab(/function dietDish\(d,af=dietAF\(\)\)\{[\s\S]*?\n\}/),
  grab(/const DRY_THEMES=[^\n]*/),grab(/const planDish=[^\n]*/)].join('\n');
assert.ok(/r2=\(\(f\._r2&&f\._r2\.dishes\)\|\|\[\]\)\.map\(d=>planDish\(f,d\)\)/.test(app),'planAll must cook through planDish');
const ctx={DIET:{veg:false},dietAF:()=>false};vm.createContext(ctx);vm.runInContext(src+';this.planDish=planDish',ctx);
const films=JSON.parse(fs.readFileSync(path.join(root,'data/films.json'),'utf8'));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const booze=d=>(d.ingredients||[]).some(i=>i.aisle==='Bottle shop');
let dry=0,grown=0;
for(const f of films){const p=path.join(root,'data/recipes2',slug(f.title+' ('+f.year+')')+'.json');if(!fs.existsSync(p))continue;
  const r=JSON.parse(fs.readFileSync(p,'utf8'));const dishes=r.dishes.map(d=>ctx.planDish(f,d));
  if(['kids','fairytale','xmas','wizard'].includes(f.theme)){dry++;for(const d of dishes)assert.ok(d.blocked||!booze(d),`${f.title}: ${d.n} buys alcohol for a dry card`)}
  else if(r.dishes.some(booze)){grown++;assert.ok(dishes.some(booze),`${f.title}: a grown-up film lost its drink`)}}
console.log(`PASS: ${dry} dry-theme films cook alcohol-free; ${grown} grown-up films still cook their drinks.`);
// Kids' mode word pass: drinking cues in methods go, and words a swap doubles fold to one (review 11 fixes 3 and 4)
{const a=app.indexOf('const dryNow'),b=app.indexOf('function kidsDryDom');const c2={DRY_THEMES:[],dietAF:()=>true};vm.createContext(c2);
 vm.runInContext(app.slice(a,b)+';this.dryText=dryText',c2);const d=t=>c2.dryText(t,true);
 for(const [t,want] of [["Serve beside frozen vodka.","Serve beside a cold drink."],["Pour the vodka when Danko orders.","Pour the drinks when Danko orders."],["Bring a bottle of rum.","Bring a bottle of lemonade."],
   ["the green absinthe","the green cordial"],["Happy's lemon shandy pitchers","Happy's lemon squash pitchers"],["VIRGIN STRAWBERRY DAIQUIRI SLUSHIE","VIRGIN STRAWBERRY SLUSHIE"],["Huli huli chicken","Huli huli chicken"]])
  assert.equal(d(t),want,t);
 console.log('PASS: kids word pass clears drinking cues and folds doubled swap words.')}
