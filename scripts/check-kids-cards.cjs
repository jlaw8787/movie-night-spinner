/* Kids' mode on every card (review 12, fix 3): with kids' mode on, no printed card or phone menu of any film,
   hand-built or shared, names a cocktail, spirit, wine or beer. Bread (rye bread, on rye), places (Manhattan deli)
   and cooking words (wine vinegar, ginger beer, root beer) are fine.
   Review 24: wine by name (Bordeaux, Chianti, Shiraz and the like) and the sommelier count too, and the check also reads the Prep sheet,
   the shopping list and the Copy menu text, where kids' mode still read "alcohol-free lager" and "margarita".
   "every" reads all 900 films, not just the kid-safe ones; skip=K starts K films in, so a long run can go in chunks.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-kids-cards.cjs [all|every|N] [skip=K] ["Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),N=A.find(a=>/^\d+$/.test(a))?+A.find(a=>/^\d+$/.test(a)):1e9,EVERY=A.includes('every'),SKIP=+((A.find(a=>/^skip=\d+$/.test(a))||'skip=0').slice(5)),NAMED=A.filter(a=>!/^(all|every|\d+|skip=\d+)$/.test(a)),port=4300+Math.floor(Math.random()*200);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0');localStorage.setItem('mns-kids','1')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(3600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async ([N,NAMED,EVERY,SKIP])=>{
  const BAD=/\b(cocktails?|martinis?|manhattans?|negronis?|highballs?|margaritas?|mojitos?|daiquiris?|old fashioneds?|whisk(e)?y|bourbon|scotch|vodka|tequila|mezcal|gin|rum|brandy|cognac|liqueurs?|schnapps|vermouth|absinthe|champagne|prosecco|wines?|beers?|lagers?|ales?|stouts?|ciders?|sake|bar tabs?|rye|bordeaux|sommeliers?|claret|chianti|merlot|shiraz|pinot|chardonnay|riesling|sauvignon|cabernet|rioja|lambrusco|beaujolais|chablis|moscato|montepulciano|malbec|zinfandel|grappa|limoncello|ouzo|sambuca|white russians?)\b/gi;
  const OK=/\b(ginger|root|butter) beer|\b(wine|cider|sherry|malt|champagne|rice wine) vinegar|\b(on|dark|light|buttered|toasted|seeded|of|sliced?|slices|thin|deli) rye|\brye (bread|loaf|crackers?|squares?|toast|batter|flour|slices?)|\bManhattan (deli|hot dog|steak|bistro|skyline|island|prison|night|melodies|lunch|clam)|\b(over|to|in|leaves|of|across|from) Manhattan|\bwine glass(es)?|\bginger ales?\b|\balcohol-free\b|\bmocktail\b|\b(prawn|shrimp|seafood|crab|lobster|fruit) cocktail|\bcocktail (franks?|sausages?|onions?|sauce|cherr(y|ies)|sticks?)|\bale(?=s? house)|\b(midtown|take|lower|upper) manhattan|\brye crispbread|\brye into|\b(goodness|heaven|pete)(['’]s?|s['’])? sake|\bthe sommelier(['’]s tasting of weapons| at the Rome Continental| recommends something robust)|\bManhattan (firehouse|skyscraper|apartment|streets?|office|loft|penthouse|hotel)|\bBALL MANHATTAN\b|\bscotch (eggs?|bonnets?|broth|fillets?|finger|pancakes?|pies?|mist|tape)|\bcocktail (umbrellas?|blinis?|picks?|glass(es)?)/gi;
  const ids=NAMED.length?NAMED:FILMS.filter(f=>EVERY||isKidSafe(f)).map(f=>f.id).slice(SKIP,SKIP+N);
  const hits=[];
  for(const id of ids){const f=FILMS.find(x=>x.id===id);if(!f)continue;window.__stage=false;try{await ensureExact(f);await show(f,true)}catch(e){continue}
   await new Promise(r=>setTimeout(r,120));
   const txt=(card.innerText+'\n'+(()=>{const ph=document.getElementById('fmtPhone');if(!ph)return '';const w=document.createTreeWalker(ph,NodeFilter.SHOW_TEXT),a=[];let n;while(n=w.nextNode())a.push(n.nodeValue);return a.join(' ')})()+'\n'+(()=>{/* review 14: the Director's cut dish list too */const t=document.createElement('div');t.innerHTML=planHTML(current);const w=document.createTreeWalker(t,NodeFilter.SHOW_TEXT),a=[];let n;while(n=w.nextNode())a.push(n.nodeValue);return a.join(' ')})()+'\n'+(()=>{const t=document.createElement('div');t.innerHTML=prepHTML(current,current.menu);const w=document.createTreeWalker(t,NodeFilter.SHOW_TEXT),a=[];let n;while(n=w.nextNode())a.push(n.nodeValue);return a.join(' ')})()+'\n'+menuText()+'\n'+await (async()=>{try{await openTrolley(current);const o=document.querySelector('dialog.trolley');const t=[...o.querySelectorAll('li span')].map(x=>x.textContent).join(' ');o.close();o.remove();return t}catch(e){return ''}})()/* text nodes joined with a space, so "floats" and "Root beer" never run together */).replace(/\s+/g,' ');
   const clean=txt.replace(OK,' ');for(const m of clean.matchAll(BAD)){const i=m.index;hits.push(`${id}: "${clean.slice(Math.max(0,i-30),i+m[0].length+20).trim()}"`)}}
  return {n:ids.length,hits}},[N,NAMED,EVERY,SKIP]);
 console.log(`${r.n} ${EVERY?'':'kid-safe '}films read with kids' mode on`);
 if(r.hits.length)console.log('Drink words left:\n  '+r.hits.join('\n  '));
 await b.close();if(r.hits.length){console.log('FAIL');process.exit(1)}console.log('PASS: no drink names on kid-safe cards in kids\' mode');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
