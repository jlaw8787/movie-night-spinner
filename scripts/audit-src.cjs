/* Audit sources from the shell (7 Nov 2026), for the unsure chase and the flat rework. These go through the session proxy, need no
   WebSearch, and can be run as often as needed. Output is plain text for reading, never for copying across.
     node scripts/audit-src.cjs plot "Film (Year)"            Wikipedia article (plot and production), wiki markup stripped
     node scripts/audit-src.cjs quotes "Film (Year)"          Wikiquote page for the film
     node scripts/audit-src.cjs script "Film (Year)"          the film's transcript (springfieldspringfield), whole
     node scripts/audit-src.cjs grep "Film (Year)" word ...   transcript lines around each word or phrase (case blind), with Wikipedia and Wikiquote hits
   Pages are cached in /tmp/audit-src. Link to cite: printed on the first line of each output. */
const {execFileSync}=require('child_process');const fs=require('fs'),path=require('path');
const C='/tmp/audit-src';fs.mkdirSync(C,{recursive:true});
const get=(u)=>{const k=path.join(C,Buffer.from(u).toString('base64url').slice(0,180));if(fs.existsSync(k))return fs.readFileSync(k,'utf8');
  let t='';for(let a=0;a<3;a++){try{t=execFileSync('curl',['-sSL','-m','30','-A','Mozilla/5.0 (movie-night-spinner audit)',u],{encoding:'utf8',maxBuffer:64e6})}catch(e){t=''}
  /* never cache a rate-limit or error page: wait and retry instead */if(t&&!/Too many requests|rate limit|Wikimedia Error|<title>429|Error 403/i.test(t.slice(0,3000)))break;t='';execFileSync('sleep',[String(3+a*4)])}
  if(t)fs.writeFileSync(k,t);return t};
const [cmd,id,...words]=process.argv.slice(2);if(!cmd||!id){console.log('usage: plot|quotes|script|grep "Film (Year)" [words]');process.exit(1)}
const m=/^(.*) \((\d{4})\)$/.exec(id)||[null,id,''];const title=m[1],year=m[2];
const strip=s=>s.replace(/<ref[^>]*\/>/g,'').replace(/<ref[\s\S]*?<\/ref>/g,'').replace(/\{\{[^{}]*\}\}/g,'').replace(/\{\{[^{}]*\}\}/g,'').replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g,'$1').replace(/'''?/g,'').replace(/<[^>]+>/g,'');
function wikiTitle(site){const tries=[`${title} (${year} film)`,`${title} (film)`,title];
  for(const t of tries){const raw=get(`https://${site}.org/w/index.php?title=${encodeURIComponent(t.replace(/ /g,'_'))}&action=raw&redirect=yes`);
    if(raw&&raw.length>400&&!/^#REDIRECT/i.test(raw.trim())&&(site!=='en.wikipedia'||/[Ff]ilm|movie/.test(raw.slice(0,4000))))return [t,raw];
    const red=/^#REDIRECT\s*\[\[([^\]#]+)/i.exec((raw||'').trim());if(red){const r2=get(`https://${site}.org/w/index.php?title=${encodeURIComponent(red[1].replace(/ /g,'_'))}&action=raw`);if(r2&&r2.length>400)return [red[1],r2]}}
  const s=JSON.parse(get(`https://${site}.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(title+' '+year+' film')}`)||'{}');const hit=s.query&&s.query.search&&s.query.search[0];
  if(hit){return [hit.title,get(`https://${site}.org/w/index.php?title=${encodeURIComponent(hit.title.replace(/ /g,'_'))}&action=raw`)]}return [null,''] }
function script(){const q=get(`https://www.springfieldspringfield.co.uk/movie_scripts.php?search=${encodeURIComponent(title)}`);
  const hits=[...q.matchAll(/movie_script\.php\?movie=([^"]+)"[^>]*>([^<]*)<\/a>/g)].map(x=>[x[1],x[2].trim()]);
  const pick=hits.find(h=>h[1].toLowerCase()===`${title} (${year})`.toLowerCase())||hits.find(h=>h[1].includes(`(${year})`))||null;
  if(!pick)return ['',''];const u=`https://www.springfieldspringfield.co.uk/movie_script.php?movie=${pick[0]}`;const s=get(u);
  const b=/scrolling-script-container">([\s\S]*?)<\/div>/.exec(s);const t=b?b[1].replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/[ \t]+/g,' '):'';return [u,t]}
if(cmd==='plot'){const [t,raw]=wikiTitle('en.wikipedia');if(!t){console.log('no Wikipedia page found');process.exit(0)}console.log('https://en.wikipedia.org/wiki/'+encodeURIComponent(t.replace(/ /g,'_')));console.log(strip(raw).replace(/\n{3,}/g,'\n\n').slice(0,30000))}
else if(cmd==='quotes'){const [t,raw]=wikiTitle('en.wikiquote');if(!t){console.log('no Wikiquote page found');process.exit(0)}console.log('https://en.wikiquote.org/wiki/'+encodeURIComponent(t.replace(/ /g,'_')));console.log(strip(raw).slice(0,40000))}
else if(cmd==='script'){const [u,t]=script();if(!u){console.log('no transcript found');process.exit(0)}console.log(u);console.log(t)}
else if(cmd==='grep'){const [u,t]=script();const [wt,wr]=wikiTitle('en.wikipedia');const [qt,qr]=wikiTitle('en.wikiquote');
  const show=(lab,link,txt)=>{if(!txt)return console.log(`[${lab}] none`);const flat=txt.replace(/\s+/g,' ');for(const w of words){const re=new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');let k,n=0;console.log(`[${lab}] ${link} "${w}"`);while((k=re.exec(flat))&&n<8){console.log('  ...'+flat.slice(Math.max(0,k.index-220),k.index+w.length+220)+'...');n++}if(!n)console.log('  (no hits)')}};
  show('transcript',u,t);show('wikipedia',wt?'https://en.wikipedia.org/wiki/'+encodeURIComponent(wt.replace(/ /g,'_')):'',wr&&strip(wr));show('wikiquote',qt?'https://en.wikiquote.org/wiki/'+encodeURIComponent(qt.replace(/ /g,'_')):'',qr&&strip(qr))}
