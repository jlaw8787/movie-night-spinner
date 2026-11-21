/* One touch per card (review 34). A film touch (a name, a prop, a catchphrase: the bunny, Pudge, the knife, tractor tipping) may show
   twice on a card at most, across dish names, dish notes, house lines, the signed note, the showtime cue, the tagline, the prop slip
   and the winks. The signed note's words never repeat inside a note or the cue.
   Generic food and menu words are skipped by how common they are across all 1,000 films, so only film words are counted.
     node scripts/check-touch.cjs [--list] ["Film (Year)" ...]
   Exits 1 if any card breaks the rule. --list prints every hit (default prints the first 40). */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const rj=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const films=rj('data/films.json'),FL=rj('data/film-flavour.json');let HO={};try{HO=rj('data/film-house.json')}catch(e){}
const A=process.argv.slice(2),LIST=A.includes('--list'),NAMED=A.filter(a=>!a.startsWith('--'));
const STOP=new Set(('a an the and or of to in on at for with from by as is it its it\'s this that these those be are was were his her their our your my me we you he she they them him '+
 'not no yes but so if then than too very just one two three four five six seven eight nine ten first last all every each some any more most much many '+
 'up down out off over under into onto about after before again still only also back here there when where who what which while until till '+
 'get gets got make makes made take takes took keep keeps put puts go goes went come comes came serve served serves bring brings brought '+
 'new old big little small good best real proper own whole half full hot cold warm fresh house night day tonight home way side end top '+
 'says said say like done don\'t can can\'t won\'t will would should could has have had do does did never ever always nothing something everything').split(/\s+/));
const words=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/'s\b/g,'').match(/[a-z][a-z'-]{2,}/g)||[];
const stem=w=>w.replace(/'+$/,'').replace(/(ies)$/,'y').replace(/([^sui])s$/,'$1');
/* fields that print, one bag of words each */
function fields(f){const id=f.title+' ('+f.year+')',fl=FL[id]||{},h=HO[id]||{},o=[];
  for(const k of 'SMWK')for(const d of f[k]||[]){o.push(['name',d[0]]);o.push(['note '+d[0],d[1]])}
  for(const x of ['s','d'])if(h[x]){o.push(['house name',h[x].n]);o.push(['house note',h[x].note])}
  /* a printed note worded differently in data/recipes counts for its dish too */
  {const sl=id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),rp=path.join(R,'data/recipes',sl+'.json');if(fs.existsSync(rp)){const r=JSON.parse(fs.readFileSync(rp,'utf8'));
    const seen=new Set([...'SMWK'].flatMap(k=>(f[k]||[]).map(d=>d[1])));for(const c of 'smwd')for(const d of r[c]||[])if(d&&d.note&&!seen.has(d.note))o.push(['note '+d.n,d.note])}}
  if(fl.note&&fl.note.text)o.push(['signed',fl.note.text]);
  if(f.P)o.push(['cue',f.P]);if(f.T)o.push(['tagline',f.T]);
  if(fl.prop)o.push(['prop',[fl.prop.title,...(fl.prop.lines||[])].join(' ')]);
  if(fl.winks&&fl.winks.length)o.push(['winks',fl.winks.join(' ')]);
  return {id,fl,o}}
/* document frequency of every word across the lineup: a word on more than 2% of films is menu language, not a film touch */
const DF=new Map();for(const f of films){const seen=new Set();for(const [,t] of fields(f).o)for(const w of words(t))seen.add(stem(w));for(const w of seen)DF.set(w,(DF.get(w)||0)+1)}
const MAXDF=Math.max(12,Math.round(films.length*.02));
const out=[];let bad=0;
for(const f of films){const {id,fl,o}=fields(f);if(NAMED.length&&!NAMED.includes(id))continue;
  const own=new Set([...words(f.title),...words(fl.venue),...words(fl.sign)].map(stem));/* the film's own title and venue are not a touch */
  const where=new Map();
  o.forEach(([lab,t],i)=>{for(const w of new Set(words(t).map(stem))){if(STOP.has(w)||own.has(w)||(DF.get(w)||0)>MAXDF||w.length<4)continue;
    /* a dish name and its own note count once: "Bunny cake" with "cut like a rabbit" is one dish */
    const key=lab.startsWith('note ')?'dish '+lab.slice(5):lab==='name'?'dish '+t:lab==='house note'||lab==='house name'?'house '+i:lab;
    if(!where.has(w))where.set(w,new Set());where.get(w).add(key)}});
  /* a character's name may sit on three things (menus name dishes after people); a prop, place or gag word on two at most */
  const all=o.map(x=>String(x[1]||'')).join(' . ');
  const proper=w=>new RegExp(`[a-z,;:'"] (${w}[a-z']*)`,'i').test(all)&&new RegExp(`[a-z,;:] ${w[0].toUpperCase()}${w.slice(1)}`).test(all)&&!new RegExp(`[a-z,;:] ${w}`).test(all);
  /* food words that happen to be rare (pecorino, apricot) are not a touch: a touch is a name, or a word the film's own lore uses
     (winks, cue, signed note, tagline, prop) */
  const lore=new Set();o.forEach(([lab,t])=>{if(/^(winks|cue|signed|tagline|prop)$/.test(lab))for(const w of words(t))lore.add(stem(w))});
  const touch=w=>proper(w)||lore.has(w);
  const hits=[...where].filter(([w,s])=>touch(w)&&s.size>(proper(w)?3:2)).map(([w,s])=>`${w} x${s.size}`);
  /* a two-word film phrase never repeats: "Emily's diet", "Ted's drinking problem", "that'll do", "tractor tipping" */
  {const bg=new Map();o.forEach(([lab,t],i)=>{if(lab==='winks')return;const key=lab.startsWith('note ')?'dish '+lab.slice(5):lab==='name'?'dish '+t:lab+i;
     const tw=words(t).map(stem);for(let j=0;j+2<=tw.length;j++){const a=tw[j],b=tw[j+1];if(STOP.has(a)||STOP.has(b)||a.length<3||b.length<3)continue;if(own.has(a)&&own.has(b))continue;
       if((DF.get(a)||0)>MAXDF&&(DF.get(b)||0)>MAXDF)continue;if(!touch(a)&&!touch(b))continue;if(proper(a)&&proper(b))continue;/* a two-word name (Monte Carlo, Jenny Lind) counts as a name, by its words */const g=a+' '+b;if(!bg.has(g))bg.set(g,new Set());bg.get(g).add(key)}});
   for(const [g,s] of bg)if(s.size>1)hits.push(`"${g}" x${s.size}`)}
  /* the signed note's words never sit inside a dish note or the cue (Shaun of the Dead printed the pint line twice) */
  const sig=fl.note&&fl.note.text?String(fl.note.text).toLowerCase().replace(/[^a-z' ]/g,' ').split(/\s+/).filter(Boolean):[];
  if(sig.length>=4){const grams=new Set();for(let i=0;i+4<=sig.length;i++)grams.add(sig.slice(i,i+4).join(' '));
    for(const [lab,t] of o){if(lab==='signed')continue;const tw=String(t||'').toLowerCase().replace(/[^a-z' ]/g,' ').split(/\s+/).filter(Boolean);
      for(let i=0;i+4<=tw.length;i++)if(grams.has(tw.slice(i,i+4).join(' '))){hits.push(`signed note repeated in ${lab}`);break}}}
  if(hits.length){bad++;out.push(`${id}: ${hits.join(', ')}`)}}
for(const l of LIST?out:out.slice(0,40))console.log(l);
console.log(`check-touch: ${bad} of ${NAMED.length||films.length} cards repeat a film touch (max ${MAXDF} films per word counts as menu language)`);
process.exit(bad?1:0);
