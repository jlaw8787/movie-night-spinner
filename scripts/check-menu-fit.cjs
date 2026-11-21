/* Menu fit (review 31, items 11 to 15 and 19): the money, the era, the place and the words on every shared-layout card fit the film.
   Reads the fit table in data/film-flavour.json (priceEra, currency, world, country) and renders each card the way the app prints it, then checks:
     1. money: the card prints the film's own currency (flavour.currency, default $) and no other
     2. storybook coin (crowns, silver, gp, "coin of the realm", a compass) only where flavour.world is "storybook"
     3. era: the middle main sits in the band for the film's decade (PF_BAND in app.js, flavour.priceEra or the layout era)
     4. notes: no printed dish note under six words (review 32), no priced dollar card without a money mark, and no dish printed with no note on a layout that gives notes
     5. quotes: a line printed in quote marks and signed with a name is on the film's quote list (data/quote-list.json)
     6. words: no warm drink under a "Cold" heading; no counter meals or licence number on a pub outside Australia;
        no fridge or couch on a card set before fridges or in a made-up world
     NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-menu-fit.cjs [from] [count] ["Film (Year)" ...] [--json out.json] */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {spawn}=require('child_process');const path=require('path'),fs=require('fs');
const R=path.join(__dirname,'..'),A=process.argv.slice(2),ji=A.indexOf('--json'),JOUT=ji>=0?A.splice(ji,2)[1]:null;
const NUM=A.filter(a=>/^\d+$/.test(a)).map(Number),NAMED=A.filter(a=>!/^\d+$/.test(a)),FROM=NUM[0]||0,COUNT=NUM[1]||1e9,port=5900+Math.floor(Math.random()*300);
const QL=(()=>{try{return JSON.parse(fs.readFileSync(path.join(R,'data/quote-list.json'),'utf8'))}catch(e){return {}}})();
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:R,stdio:'ignore'});process.on('exit',()=>server.kill());
(async()=>{await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({...(process.env.MNS_BROWSER?{executablePath:process.env.MNS_BROWSER}:{}),args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{window.MNS_WHOLE=1;localStorage.setItem('mns-welcome','1');localStorage.setItem('mns-sound','0')});
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?r.continue():r.abort()});
 const p=await ctx.newPage();p.setDefaultTimeout(3600000);
 await p.goto(`http://127.0.0.1:${port}/?film=`+encodeURIComponent('Home Alone (1990)'),{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof show==='function'&&typeof current!=='undefined'&&current);
 const r=await p.evaluate(async ([FROM,COUNT,NAMED,QL])=>{
  const ids=NAMED.length?NAMED:FILMS.map(f=>f.id).slice(FROM,FROM+COUNT);
  const norm=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[“”"]/g,'"').replace(/[-‐–]/g,' ').replace(/\s+/g,' ').trim();
  const SYM={'$':/\$/,'£':/£|\d+p\b/,'£sd':/\b\d+s\b|\b\d+d\b|£\d/,'€':/€/,'F':/\d F\b/,'L':/L\. \d/,'₩':/₩/,'¥':/¥/,'R$':/R\$/,'kr':/\d kr\b/,'RM':/RM \d/,'G':/\d (Galleons?|Sickles?)\b/,'Kč':/\d Kč/,'roubles':/\d roubles/,'piastres':/\d piastres/,'Rs':/Rs \d/,'฿':/฿\d/,'Rp':/Rp \d/,'S/':/S\/ \d/};
  const FOREIGN=/£|€|₩|¥|R\$/;
  const out=[];let n=0;
  for(const id of ids){const f=FILMS.find(x=>x.id===id);if(!f){out.push({id,bad:['no film']});continue}
   try{await ensureExact(f);await show(f,true)}catch(e){out.push({id,bad:['render '+String(e).slice(0,60)]});continue}
   await new Promise(r=>setTimeout(r,25));
   if(!f._lib)continue;n++;const L=f._lib,fl=L.flavour||{},bad=[],txt=card.innerText,low=norm(txt);
   const cur=fl.currency||'$';if(cur==='coin')SYM.coin=new RegExp('\\d '+String(fl.coin||'coins').split(' ')[0].replace(/(ies|s)$/,''),'i');
   /* 1. money */
   const hasPrice=/\d\.\d\d|\d+¢|\.\d\d\b|£|€|₩|¥|\d+d\b/.test(txt);
   /* review 32: a priced card says what money it is: bare figures (".25", "1.75") with no mark anywhere fail */
   if(hasPrice&&cur==='$'&&fl.world!=='storybook'&&!fl.coin&&!/\$\s?\d|\d\s?¢|\b\d{1,2}c\b/.test(txt))bad.push('prices with no money mark');
   if(hasPrice){if(cur==='$'){if(FOREIGN.test(txt))bad.push('foreign money on a dollar card')}
     else{if(!SYM[cur].test(txt))bad.push(`no ${cur} prices`);if(/\$\s?\d(?![\d,]{3,})/.test(txt.replace(/R\$/g,'')))bad.push(`dollar prices on a ${cur} card`)}}
   /* 2. storybook coin */
   if(fl.world!=='storybook'&&!fl.coin){if(/\d\s?(crowns|silver|gp)\b|coin of the realm|\bthe realm\b/i.test(txt))bad.push('storybook coin on a real-world film')}
   /* 3. era band */
   {const m=current.printMenu||{},P=[];const tw=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);let t;
    const mains=(m.m||[]).filter(x=>x&&!x.house).map(x=>norm(x.label||x.n)),alld=['s','m','w','d'].flatMap(k=>(m[k]||[]).filter(Boolean).map(x=>norm(x.label||x.n)));
    while((t=tw.nextNode())){const q=t.nodeValue.match(/^\s*(?:\$|£)?(\d{1,3})\.(\d\d)\s*$|^\s*\.(\d\d)\s*$|^\s*(\d{1,2})¢\s*$/);if(!q)continue;
      const v=q[1]!=null?+q[1]+ +q[2]/100:q[3]!=null?+q[3]/100:+q[4]/100;let el=t.parentElement,hit=null;
      for(let i=0;i<5&&el&&el!==card;i++,el=el.parentElement){const tx=norm(el.textContent),ds=alld.filter(d=>tx.includes(d));if(ds.length===1){hit=ds[0];break}if(ds.length>1)break}
      if(hit&&mains.includes(hit))P.push(v)}
    const tg=fl.priceEra||L.era,bd=(Array.isArray(fl.priceBand)&&fl.priceBand)||PF_BAND[tg];/* review 34: a film's own band (a cheap counter) */
    if(cur==='$'&&bd&&P.length){P.sort((a,b)=>a-b);const med=P.length%2?P[(P.length-1)/2]:(P[P.length/2-1]+P[P.length/2])/2;if(med<bd[0]*.85||med>bd[1]*1.2)bad.push(`middle main ${med.toFixed(2)} outside the ${tg} band ${bd[0]} to ${bd[1]}`)}}
   /* 4. notes: the line after a dish name, when it is not a price, another dish or a heading */
   {const m=current.printMenu||{},ds=['s','m','w','d'].flatMap(k=>(m[k]||[]).filter(x=>x&&!x.house).map(x=>x.label||x.n));
    const lines=txt.split(/\n+/).map(s=>s.trim()).filter(Boolean),names=new Set(ds.map(norm));
    const isPrice=s=>/^(\$|£|€|₩|¥|R\$ ?|L\. ?|RM ?)?[\d.,]+\s?(p|d|F|kr|¢|c|cr|crowns|silver|gp)?$|^\d+s( \d+d)?$|^\d+ gp \d+$|^\d+s \d+d$|^\d+\/(\d+|-)$|^\d+¢\s?TIX$|^\d+ (Galleons?|Sickles?)( \d+ Sickles?)?$|^\d+ (denarii|taels|coins?)$/.test(s)||/^[\d,. ]+ [A-Za-zčö][A-Za-zčö ]*$|^(Rs |฿|Rp |S\/ )[\d,.]+$/.test(s)&&s.length<26;
    for(const d of ds){const i=lines.findIndex(l=>norm(l)===norm(d));if(i<0)continue;let j=i+1;while(j<lines.length&&isPrice(lines[j]))j++;const nx=lines[j]||'';
      if(!nx||names.has(norm(nx))||/^[A-Z0-9 ,.&'!-]{3,}$/.test(nx)||/^\d+ cr$/.test(nx)||/^GUESTS\b/i.test(nx)||/^(cold |hot )?drinks$/i.test(nx))continue;/* no note slot here (a name-only board): not counted */
      const w=nx.replace(/[^\w' ]/g,' ').trim().split(/\s+/).filter(Boolean).length;if(w<6)bad.push(`thin note on ${d}: "${nx}"`)}}
   /* 5. signed quotes */
   {const ql=(QL[id]||[]).map(norm);const qs=[...txt.matchAll(/[“"]([^”"\n]{12,200})[”"]\s*\n\s*([A-Z][\w.'’ -]{2,40})\s*(\n|$)/g)];
    for(const q of qs){const k=norm(q[1]);if(!ql.some(x=>x.includes(k.slice(0,40))||k.includes(x.slice(0,40))))bad.push(`signed quote not on the quote list: "${q[1].slice(0,60)}" (${q[2].trim()})`)}}
   /* 6. words */
   if(/^\s*cold drinks?\s*$/im.test(txt)){const D=(current.printMenu&&current.printMenu.d||[]).map(x=>String(x.label||x.n)+' '+String(x.note||''));if(D.some(t=>HF_WARM.test(t)&&!/\biced\b/i.test(t)))bad.push('warm drink under a Cold heading')}
   if(L.fmt==='pub'&&String(fl.country||(cur==='£'?'GB':'AU')).toUpperCase()!=='AU'&&/counter meals|licence \d/i.test(txt))bad.push('Australian pub words outside Australia');
   if((fl.world==='storybook'||(fl.priceEra||L.era)==='1800s')&&/\bfridge\b|\bon the couch\b/i.test(txt))bad.push('fridge or couch before fridges');
   if(bad.length)out.push({id,fmt:L.fmt,bad})}
  return {n,out}},[FROM,COUNT,NAMED,QL]);
 for(const x of r.out)console.log(`${x.id}${x.fmt?' ['+x.fmt+']':''}:\n  `+x.bad.join('\n  '));
 const films=r.out.filter(x=>x.bad.length).length;
 console.log(`${r.n} shared-layout cards read, ${films} with a fit problem`);
 if(JOUT)fs.writeFileSync(JOUT,JSON.stringify(r.out,null,1));
 await b.close();process.exit(films?1:0)})();
