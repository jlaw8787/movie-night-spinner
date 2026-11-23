/* Dish notes read food first (review 34): the opening words of a printed dish note name the food (an ingredient, the cooking or the dish
   itself), then one short film touch. A note whose first two words share nothing with its own dish's name, method or shopping list
   leads with the film ("The crew shares a croissant without Emmet...") or never says what the dish is ("Mater's wasabi mix-up, not on
   this plate"). Also: a note starting lower case.
     node scripts/check-food-first.cjs [--list] ["Film (Year)" ...]    exits 1 on any hit */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const films=JSON.parse(fs.readFileSync(path.join(R,'data/films.json'),'utf8'));let HO={};try{HO=JSON.parse(fs.readFileSync(path.join(R,'data/film-house.json'),'utf8'))}catch(e){}
const A=process.argv.slice(2),LIST=A.includes('--list'),NAMED=A.filter(a=>!a.startsWith('--'));
const W=s=>(String(s||'').toLowerCase().match(/[a-zàâçéèêëîïôûùüÿñæœ]{3,}/g)||[]).map(w=>w.replace(/(ch|sh|x|o)es$/,'$1').replace(/ies$/,'y').replace(/([^su])s$/,'$1'));
const FOODY=new Set(W('breaded takeout shrimp romaine arugula cantaloupe meringue popsicles popsicle candy cooler rich dense hearty malty floured folded tied stovetop seaweed rich tall light mini chook strong thick paper flaky fudgy buttery little tiny rice wheat noodle crab sponge vodka sake crisp fried grilled roast roasted baked smoked seared slow braised poached toasted iced chilled warm hot cold sweet sour salty spiced spicy creamy sticky glazed stuffed shaved pulled shredded steamed charred battered crumbed buttered whipped frozen melted fresh soft fizzy ice shot shots pint glass cup jug bowl plate slice slices wedge wedges skewer skewers bun buns roll rolls toast sandwich pie pies tart cake cakes soup stew salad sauce gravy dip chips fries bread'));
const SKIP=new Set(W('the and with for from our your his her their its this that one two three four big little small house own extra double triple real proper classic mini giant thick thin long short whole half little'));
/* every word in any shopping list or dish name in the lineup counts as food talk (green soybeans, prunes, champagne) */
const VOC=new Set();for(const f of films)for(const k of 'SMWK')for(const d of f[k]||[]){for(const w of W((d[3]||[]).join(' ').replace(/@\w+/g,'')))VOC.add(w)}
for(const w of SKIP)VOC.delete(w);
const out=[];let bad=0;
for(const f of films){const id=f.title+' ('+f.year+')';if(NAMED.length&&!NAMED.includes(id))continue;const hits=[];
  const chk=(n,note,how,shop)=>{if(!note)return;const t=String(note).trim();if(/^[a-z]/.test(t)){hits.push(`lower case: ${n}`);return}
    const food=new Set([...W(n),...W(how),...W((shop||[]).join(' ').replace(/@\w+/g,''))]);const head=W(t.split(/[.:;!?,]/)[0]).filter(w=>!SKIP.has(w)).slice(0,2);
    if(!head.some(w=>food.has(w)||FOODY.has(w)||VOC.has(w)))hits.push(`film first: ${n}: "${t.slice(0,70)}"`)};
  for(const k of 'SMWK')for(const d of f[k]||[])chk(d[0],d[1],d[2],d[3]);
  const h=HO[id]||{};for(const x of ['s','d'])if(h[x])chk(h[x].n,h[x].note,'','');
  /* the printed card's own recipe file can carry its own wording of a note (review 34: Mars Attacks, The Bodyguard) */
  {const sl=id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),rp=path.join(R,'data/recipes',sl+'.json');if(fs.existsSync(rp)){const r=JSON.parse(fs.readFileSync(rp,'utf8'));
    const seen=new Set([...'SMWK'].flatMap(k=>(f[k]||[]).map(d=>d[1])));for(const c of 'smwd')for(const d of r[c]||[])if(d&&d.note&&!seen.has(d.note))chk(d.n,d.note,d.how,d.shop)}}
  if(hits.length){bad++;out.push(`${id}: ${hits.join(' | ')}`)}}
for(const l of LIST?out:out.slice(0,40))console.log(l);
console.log(`check-food-first: ${bad} of ${NAMED.length||films.length} cards have a note that does not lead with the food`);process.exit(bad?1:0);
