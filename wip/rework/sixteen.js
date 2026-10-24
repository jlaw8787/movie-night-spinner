function fmtSixteen(f,spec,menu,poster){
  const D='#243e42',P='#f2eee2',I='#1d2a2c',M='#55605c',R='#9c482e',Y='#e3c36b',H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const stops=[['02','8:04 AM'],['05','8:21 AM'],['09','8:47 AM'],['13','9:32 AM'],['16','9:58 AM']];
  const field=(k,v)=>`<div style="border-right:1px solid #b9b3a2;padding:6px 10px"><div style="${T};font-size:10px;font-weight:700;letter-spacing:.07em;color:${M}">${k}</div><div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px">${v}</div></div>`;
  const row=(it,i)=>`<div style="display:flex;gap:16px;padding:${i?14:0}px 0 14px;${i<all.length-1?'border-bottom:1px solid #cdc6b3':''}">
    <div style="width:80px;flex:none;text-align:center;border:2px solid ${I};padding:3px 0 4px;align-self:flex-start;background:#fff"><div style="${T};font-size:10px;font-weight:700;color:${R};letter-spacing:.05em;text-transform:uppercase">${ESC(tabs[i]||'')}</div><div style="${H};font-size:26px;line-height:1;font-weight:700;color:${I}">BLK ${stops[i]?stops[i][0]:''}</div><div style="${T};font-size:11px;font-weight:700;color:${M}">${stops[i]?stops[i][1]:''}</div></div>
    <div style="flex:1;min-width:0">
    <div style="${H};font-size:${i===2?28:25}px;line-height:1.02;font-weight:700;text-transform:uppercase;color:${I}">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:3px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`;
  const ticks=Array.from({length:16},(_,i)=>`<div style="position:absolute;left:0;top:${i*29}px;width:${i%5===4?16:10}px;height:2px;background:${I}"></div><div style="position:absolute;left:20px;top:${i*29-6}px;${T};font-size:10px;font-weight:700;color:${M}">${i+1}</div>`).join('');
  const clip=`<div aria-hidden="true" style="position:absolute;left:40px;top:-14px;width:18px;height:46px;border:3px solid #8a8f8f;border-radius:9px;z-index:2"></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};overflow:hidden;box-shadow:0 16px 40px #0006">
  <section aria-label="Witness transport log menu" style="${at(22,22,1027,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.5)`)}">
    <header style="${at(28,18,971,'display:flex;justify-content:space-between;align-items:flex-end')}">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${R}">FORM 16-B / WITNESS TRANSPORT LOG / LOWER MANHATTAN</div><div style="${H};font-size:46px;line-height:.95;font-weight:700;color:${I};text-transform:uppercase;margin-top:3px">16 Blocks lunch run</div></div>
      <div style="text-align:right;border:3px solid ${R};padding:4px 12px;transform:rotate(-3deg)"><div style="${T};font-size:10px;font-weight:700;color:${R};letter-spacing:.08em">GRAND JURY CLOSES</div><div style="${H};font-size:36px;line-height:1;font-weight:700;color:${R}">10:00 AM</div></div>
    </header>
    <div style="${at(28,88,971,`display:grid;grid-template-columns:1.2fr 1.1fr 1fr 1fr .8fr;border:2px solid ${I};background:#fff`)}">
      ${field('OFFICER','Det. Jack Mosley')}${field('WITNESS','Eddie Bunker')}${field('FROM','Precinct holding')}${field('TO','Courthouse, 4th fl')}<div style="padding:6px 10px"><div style="${T};font-size:10px;font-weight:700;letter-spacing:.07em;color:${M}">DISTANCE</div><div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px">16 blocks</div></div>
    </div>
    <div aria-hidden="true" style="${at(28,166,30,'height:452px;border-left:2px solid '+I)}">${ticks}</div>
    <div style="${at(72,160,566)}">${all.map(row).join('')}</div>
    <div style="${at(666,166,333)}">
      <figure style="margin:0;position:relative;background:#fff;padding:6px 6px 0;box-shadow:0 4px 10px rgba(0,0,0,.3);transform:rotate(1deg)">${clip}${img('eddie','Eddie Bunker in 16 Blocks',321,160)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">WITNESS: E. BUNKER. Talks. A lot.</figcaption></figure>
      <figure style="margin:14px 0 0;position:relative;background:#fff;padding:6px 6px 0;box-shadow:0 4px 10px rgba(0,0,0,.3);transform:rotate(-1deg)">${img('partners','Jack Mosley and Eddie Bunker on the move through the city',321,160)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">OFFICER: J. MOSLEY. Bad knee. Late.</figcaption></figure>
      <div style="margin-top:14px;border-top:2px solid ${I};padding-top:8px"><div style="${T};font-size:10.5px;font-weight:700;letter-spacing:.07em;color:${R}">REMARKS</div><div style="${H};font-size:22px;line-height:1.1;font-weight:600;color:${I};margin-top:2px">Eddie talks. Jack walks.</div><div style="${T};font-size:12px;color:${M};margin-top:3px">P.S. Cake to follow, from Seattle.</div></div>
    </div>
    <footer style="${at(28,654,971,'border-top:2px solid '+I+';padding-top:8px;display:flex;gap:12px;align-items:baseline')}"><span style="${T};font-size:11px;font-weight:700;color:${R};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span><span style="${T};font-size:9px;color:${M};margin-left:auto;white-space:nowrap">FILM IMAGERY: TMDB</span></footer>
  </section></div>`;
}
