/* Prices that make sense (review 30, items 11, 12 and 19). Renders every film's printed card, ties each printed price to its dish
   (the smallest block around the price that names one dish) and checks the card against plain venue rules:
     1. every main costs more than every starter and every sweet
     2. a cheap bite (slice, hot dog, frank, fries, cookie, cupcake, lollipop, peanuts, popcorn, chips) never costs more than a steak,
        roast or seafood main, and never more than the cheapest main
     3. a plain drink (no spirits or wine) never costs more than the cheapest main
     4. (review 34) a premium main never the same price as a plain one; a sandwich or burger main under the hot plates beside it
     5. prices end on a clean step: whole dollars or .00, .25, .50, .75, .95 (cent prices in fives)
   Films with no prices, or prices that could not be tied to dishes, are skipped and counted.
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-price-sense.cjs [from] [count] [--json out.json] ["Film (Year)" ...] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),ji=A.indexOf('--json'),JOUT=ji>=0?A.splice(ji,2)[1]:null;
const NUM=A.filter(a=>/^\d+$/.test(a)).map(Number),NAMED=A.filter(a=>!/^\d+$/.test(a)),FROM=NUM[0]||0,COUNT=NUM[1]||1e9,port=5600+Math.floor(Math.random()*300);
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(3600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async ([FROM,COUNT,NAMED])=>{
  const ids=NAMED.length?NAMED:FILMS.map(f=>f.id).slice(FROM,FROM+COUNT);
  const CHEAP=/\b(slices?|hot ?dogs?|chill?i dogs?|snow ?cones?|slushies|slushie|shaved ice|icy poles?|ice blocks?|franks|frankfurts?|wieners?|cookies?(?!'s)|cupcakes?|lollipops?|lollies|peanuts|popcorn|pretzels?|crisps|corn dogs?|buckeyes?|fairy bread|garlic knots?)\b/i,NOTCHEAP=/\b(pizza pie|whole|platter|pie|cake|loaf|tart|plate)\b/i,BITE=/\b(crackling|pork scratchings|pork rinds|chicharrones|cheese puffs|puffs|biscuits|lamingtons?|party pies?|pickled (eggs?|onions?)|potato (scallops?|cakes?)|sausage rolls?|meat pies?|chips|fries|scones?|nuts|olives|samosas?)\b/i,NOTBITE=/\b(fish and chips|steak|loaded|platter|board|with (fish|steak|chicken|prawns?)|(and|with) (fries|chips|crackling|slaw)|(chips|fries) inside)\b/i,isCheap=n=>(BITE.test(n)&&!NOTBITE.test(n)&&!/\b(steak|lobster|crab|prawns?|oysters?)\b/i.test(n))||CHEAP.test(n)&&!NOTCHEAP.test(n)&&!/\bslice\b.*\b(cake|pie|tart|loaf)\b|\b(cake|pie|tart|loaf)\b.*\bslice/i.test(n);
  const PREM=/\b(steaks?|sirloin|rib ?eye|t-bone|porterhouse|filet|fillet|wagyu|prime rib|surf and turf|lobster|crab|prawns?|(?<!potato )scallops?|oysters?|roast|chateaubriand|veal|lamb|salmon|barramundi|snapper|duck)\b/i;
  const SP=/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|mezcal|brandy|cognac|cocktail|martini|negroni|margarita|spritz|old fashioned|manhattan|daiquiri|mojito|julep|highball|shots?|liqueur|schnapps|colada|sangria|champagne|prosecco|wine|toddy|sake|bellini|mimosa|shandy|beer|ale|lager|stout|cider|mai tai|grog|punch|sherry|port|mead|claret)\b/i;
  const PR=/^\s*(?:\$|£)?(\d{1,3})(?:\.(\d\d))?\s*$|^\s*(\d{1,2})\s*(¢|c)\s*$|^\s*\.(\d\d)\s*$/;
  const norm=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[-‐–]/g,' ').replace(/\s+/g,' ').trim();
  const out=[];let skipped=0,noprice=0;
  for(const id of ids){const f=FILMS.find(x=>x.id===id);if(!f){out.push({id,err:'no film'});continue}
   window.__stage=false;current&&(current.printMenu=null);try{await ensureExact(f);await show(f,true)}catch(e){out.push({id,err:String(e).slice(0,80)});continue}
   await new Promise(r=>setTimeout(r,30));
   const m=current.printMenu&&current.printMenu.s!==undefined&&f._lib?current.printMenu:current.menu||{},dish=[];for(const k of ['s','m','w','d'])for(const it of (m[k]||[]))if(it){const nm=norm(it.label||it.n);if(nm)dish.push({k,n:it.label||it.n,nm,house:!!it.house,extra:!!it.extra})}
   const walker=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);const prices=[],cand=[],sets=[];let tn0;
   while((tn0=walker.nextNode())){if(tn0.parentElement&&tn0.parentElement.closest('[data-np]'))continue;const q=tn0.textContent.match(PR);if(q)cand.push([tn0,q])}
   {const w=cand.filter(([tn,q])=>q[1]!=null&&q[2]==null&&!/[$£]/.test(tn.textContent));if(w.length>=3&&w.every(([,q],i)=>+q[1]===i+1))for(const c of w)cand.splice(cand.indexOf(c),1)}
   /* a bare whole number on a card that prints cents is a quantity or table number, not a price */
   const hasDec=cand.some(([,q])=>q[2]!=null||q[3]!=null||q[5]!=null);
   for(const [tn,q] of cand){const t=tn.textContent;if(hasDec&&q[1]!=null&&q[2]==null&&!/[$£]/.test(t))continue;
     const v=q[1]!=null?+q[1]+(q[2]?+q[2]/100:0):q[3]!=null?+q[3]/100:+q[5]/100;if(!(v>0))continue;
     /* the smallest block around the price that names exactly one dish */
     let el=tn.parentElement,hit=null,dp=0;for(let i=0;i<6&&el&&el!==card;i++,el=el.parentElement){const tx=norm(el.textContent);const ds=dish.filter(d=>tx.includes(d.nm));if(ds.length===1){hit=ds[0];dp=i;break}if(ds.length>1)break}
     /* review 31: a set dinner or combo line ("one of each", "complete dinner") is checked against the dishes it names */
     {let e2=tn.parentElement;for(let i=0;i<3&&e2&&e2!==card;i++,e2=e2.parentElement){const tx=norm(e2.textContent);if((!hit||dp>=2)&&/\b(combo|complete dinner|family dinner|one of each|meal deal|set dinner|the lot for)\b/.test(tx)&&tx.length<200){sets.push({v,raw:t.trim(),tx});break}}}
     if(hit)prices.push({...hit,v,dp,raw:t.trim()})}
   if(f._lib&&f._lib.flavour&&f._lib.flavour.currency&&f._lib.flavour.currency!=='$'){skipped++;continue}/* local money: checked before conversion in priceFix, and by check-menu-fit */
   if(!prices.length){noprice++;continue}
   prices.sort((a,b)=>a.dp-b.dp);
   const seen=new Set(),P=prices.filter(x=>{const key=x.k+x.nm;if(seen.has(key))return false;seen.add(key);return true});
   {const rt=norm(card.textContent),onCard=dish.filter(d=>rt.includes(d.nm)).length;if(P.length<Math.max(2,onCard)*.6){skipped++;continue}}
   const by=k=>P.filter(x=>x.k===k),mn=by('m').filter(x=>!x.house),bad=[];
   /* a set dinner never costs less than the dearest dish in it, and a combo never under 60% of what its named dishes add up to */
   for(const st of sets){const inS=/\bone of each\b(?!\s+board)/.test(st.tx)?P.slice():P.filter(x=>st.tx.includes(x.nm)&&Math.abs(x.v-st.v)>.001);if(!inS.length)continue;const top=Math.max(...inS.map(x=>x.v)),sum=inS.reduce((a,x)=>a+x.v,0);
     if(st.v<top)bad.push(`set or combo ${st.raw} under the dearest dish in it (${top})`);else if(inS.length>1&&st.v<sum*.6)bad.push(`combo ${st.raw} under 60% of its dishes (${sum.toFixed(2)})`)}
   const minM=mn.length?Math.min(...mn.map(x=>x.v)):null;
   if(minM!=null){for(const x of [...by('s'),...by('w')])if(x.v>=minM)bad.push(`${x.k==='s'?'starter':'sweet'} ${x.n} ${x.raw} not under the cheapest main ${minM}`);
     for(const x of by('d'))if(!SP.test(x.n)&&x.v>=minM)bad.push(`plain drink ${x.n} ${x.raw} not under the cheapest main ${minM}`)}
   {const BAR=/\b(nuts|peanuts|crisps|chips and dip|popcorn|pretzels?|olives|pork scratchings|bar snacks?)\b(?!.*\b(crusted|crumbed|stuffed|chicken|prawns?|steak|squid|calamari|loaded|caramel|toffee|lolly|lollies|chocolate)\b)/i,D=by('d');if(D.length){const lo=Math.min(...D.map(x=>x.v));for(const x of by('s'))if(BAR.test(x.n)&&!PREM.test(x.n)&&x.v>lo+.001)bad.push(`bar snack ${x.n} ${x.raw} dearer than a drink at ${lo}`)}}
   const prem=P.filter(x=>x.k==='m'&&PREM.test(x.n)&&!isCheap(x.n));
   {const pl=mn.filter(x=>!PREM.test(x.n)||isCheap(x.n));if(pl.length){const hi=Math.max(...pl.map(x=>x.v));for(const x of prem)if(!x.house&&x.v<=hi)bad.push(`premium main ${x.n} ${x.raw} not above the plain main at ${hi}`)}}
   /* review 34: a sandwich, roll or burger main sits under the hot plates beside it (Wolf Creek's sausage sandwich over the barra) */
   {const HAND=/\b(sandwich(es)?|sangas?|toasties?|rolls?|subs?|hoagies?|burgers?|cheeseburgers?|sliders?|wraps?|burritos?|tacos?|hot dogs?)\b/i,hot=mn.filter(x=>!HAND.test(x.n)&&!x.house);if(hot.length&&hot.length<mn.length){const lo=Math.min(...hot.map(x=>x.v));for(const x of mn)if(HAND.test(x.n)&&!PREM.test(x.n)&&!x.house&&x.v>=lo)bad.push(`sandwich main ${x.n} ${x.raw} not under the hot main at ${lo}`)}}
   for(const x of P)if(isCheap(x.n)&&!PREM.test(x.n)){
     if(prem.length&&x.v>Math.min(...prem.map(y=>y.v)))bad.push(`cheap bite ${x.n} ${x.raw} above the ${prem[0].n}`);
     if(x.k==='m'&&mn.length>1&&x.v>=Math.max(...mn.filter(y=>!isCheap(y.n)).map(y=>y.v).concat([0]))&&mn.some(y=>!isCheap(y.n)))bad.push(`cheap main ${x.n} ${x.raw} dearest of the mains`)}
   /* a cheap bite is never the dearest thing in its course (one cupcake above both tarts), a cheap sweet never costs more than the dearest starter,
      and a cheap main is never more than half again the dearest starter (a $28 pizza slice beside $12 bagel bites) */
   const maxS=by('s').length?Math.max(...by('s').map(x=>x.v)):null;
   for(const k of ['s','w']){const L=by(k),nc=L.filter(x=>!isCheap(x.n));if(!nc.length)continue;const top=Math.max(...nc.map(x=>x.v));for(const x of L)if(isCheap(x.n)&&!PREM.test(x.n)&&x.v>top)bad.push(`cheap bite ${x.n} ${x.raw} dearer than every other ${k==='s'?'starter':'sweet'}`)}
   if(maxS!=null){for(const x of by('w'))if(isCheap(x.n)&&x.v>maxS)bad.push(`cheap sweet ${x.n} ${x.raw} above the dearest starter ${maxS}`);for(const x of mn)if(isCheap(x.n)&&!PREM.test(x.n)&&x.v>maxS*1.5+.01)bad.push(`cheap main ${x.n} ${x.raw} more than half again the dearest starter ${maxS}`)}
   /* a starter with seafood or steak is never the cheapest starter when a plain dip or bread sits beside it */
   {const L=by('s');const pl=L.filter(x=>!PREM.test(x.n));for(const x of L)if(PREM.test(x.n)&&pl.length&&x.v<Math.min(...pl.map(y=>y.v))*.8)bad.push(`seafood or steak starter ${x.n} ${x.raw} well under every plain starter`)}
   /* a cocktail or spirit is never cheaper than the cheapest starter */
   if(by('s').length){const lo=Math.min(...by('s').map(x=>x.v));for(const x of by('d'))if(/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|cocktail|martini|margarita|mai tai|daiquiri|mojito|colada|spritz|negroni|champagne)\b/i.test(x.n)&&x.v<lo*.6)bad.push(`cocktail ${x.n} ${x.raw} far under the cheapest starter ${lo}`)}
   /* review 33: a cocktail is never under the cheapest real starter; a plain soft drink is never dearer than the dearest sweet;
      no real starter under two fifths of the dearest one (The Other Guys' $2.25 dip beside $7.75 bagel bites, $8.75 pineapple juice) */
   {const RS=by('s').filter(x=>!isCheap(x.n));if(RS.length){const lo=Math.min(...RS.map(x=>x.v)),hi=Math.max(...RS.map(x=>x.v));
     for(const x of by('d'))if(/\b(whisk(e)?y|bourbon|rum|vodka|gin|tequila|cocktail|martini|margarita|mai tai|daiquiri|mojito|colada|spritz|negroni|champagne)\b/i.test(x.n)&&x.v<lo-.001)bad.push(`cocktail ${x.n} ${x.raw} under the cheapest starter ${lo}`);
     for(const x of RS)if(x.v<hi*.4-.01)bad.push(`starter ${x.n} ${x.raw} under two fifths of the dearest starter ${hi}`)}
    const W=by('w');if(W.length){const BS=by('s').filter(x=>/\b(nuts|peanuts|crisps|chips and dip|popcorn|pretzels?|olives|pork scratchings|bar snacks?)\b/i.test(x.n)),hw=Math.max(...W.map(x=>x.v),...BS.map(x=>x.v));for(const x of by('d'))if(/\b(juice|soda|cola|lemonade|iced tea|tea|coffee|water|cordial|squash|ginger beer|root beer|sarsaparilla|milk)\b/i.test(x.n)&&!/\b(long island|shakes?|milkshakes?|malts?|malted|floats?|smoothies?|frapp|sundaes?|spiked|irish coffee|punch|cocktail|mocktail|tiki)\b/i.test(x.n)&&!SP.test(x.n)&&x.v>hw+.001)bad.push(`plain drink ${x.n} ${x.raw} dearer than every sweet and bar snack (${hw})`)}}
   /* endings: .00 .25 .50 .75 .95 (.99 reads like a real price too). One odd ending a card is the film's number hidden in the cents (Josh's
      Easter egg rule: TMNT's 1.84, A Bronx Tale's 1.87), so only a second one fails */
   {const odd=P.filter(x=>{const c=Math.round((x.v%1)*100);return x.v>=1&&/\./.test(x.raw)?![0,25,50,75,95,99].includes(c):x.v<1&&c%5!==0});if(odd.length>1)for(const x of odd.slice(1))bad.push(`odd ending ${x.n} ${x.raw} (${odd[0].raw} is the card's one film-number price)`)}
   out.push({id,fmt:f._lib&&f._lib.fmt||(typeof fmtSpec==='function'&&fmtSpec(f)?'own':''),n:P.length,bad,P:P.map(x=>[x.k,x.n,x.raw])})}
  return {out,skipped,noprice}},[FROM,COUNT,NAMED]);
 const fail=r.out.filter(x=>x.bad&&x.bad.length);
 for(const x of fail)console.log(`${x.id} (${x.fmt}):\n  `+x.bad.join('\n  '));
 console.log(`${r.out.length} films read, ${r.noprice} with no prices, ${r.skipped} could not be tied to dishes, ${fail.length} with a price problem`);
 if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(r,null,1));
 await b.close();process.exit(fail.length?1:0)})().catch(e=>{console.error(e);process.exit(1)});
