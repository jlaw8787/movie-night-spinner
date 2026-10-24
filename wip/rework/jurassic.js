function fmtJurassic(f,spec,menu,poster){
  const J='#1d2b1f',P='#f4eedd',Y='#f2b632',R='#c2321f',I='#1f2320',M='#5c6157',G='#3d6b3a',S="font-family:'Bevan',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const stops=['STOP 01 / HATCHERY LAB','STOP 02 / VISITOR CENTRE KITCHEN','STOP 03 / THE DINING ROOM','STOP 04 / VISITOR CENTRE, POWER OFF','STOP 05 / TOUR CAR, T. REX PADDOCK'];
  const flags=['EMBRYO COUNT CHECKED','MIND THE STAINLESS','LUNCH SERVED, OPINIONS TOO','FREEZERS: OFFLINE','KEEP ABSOLUTELY STILL'];
  const row=(it,i)=>`<div style="padding:${i?7:0}px 0 7px;${i<all.length-1?'border-bottom:2px solid #ddd3b8':''}">
    <div><div style="display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;letter-spacing:.06em"><span style="color:${G}">${stops[i]} / ${ESC((tabs[i]||'').toUpperCase())}</span><span style="color:${R}">${flags[i]||''}</span></div>
      <div style="${S};font-size:${i===2?23:21}px;line-height:1.12;color:${I};margin-top:3px">${ESC(it.label)}</div>
      <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:3px">${ESC(it.desc)}</div>
      ${it.film?`<div style="${B};font-size:13px;line-height:1.3;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`;
  const sheet=`<section aria-label="Park tour itinerary menu" style="${at(24,22,660,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.6)`)}">
    <div style="${at(0,0,660,`height:72px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 30px;box-sizing:border-box`)}">
      <div><div style="${S};font-size:34px;line-height:1;color:#fff">DANGER</div><div style="${B};font-size:13px;font-weight:700;letter-spacing:.2em;color:#ffe0d8;margin-top:4px">10,000 VOLTS / LUNCH IN PROGRESS</div></div>
      <div style="width:50px;height:50px;border-radius:50%;background:${Y};border:4px solid ${I};box-sizing:border-box;text-align:center;${S};font-size:28px;line-height:42px;color:${I}">!</div></div>
    <header style="${at(30,86,600,`border-bottom:3px solid ${I};padding-bottom:9px;display:flex;justify-content:space-between;align-items:flex-end`)}">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${G}">ISLA NUBLAR / VISITOR CENTRE / PREVIEW TOUR, 1993</div><div style="${S};font-size:30px;line-height:1.1;color:${I};margin-top:4px">Park tour lunch</div></div>
      <div style="${T};font-size:11px;line-height:1.45;color:${M};text-align:right">COST: SPARED NO EXPENSE<br>GUESTS: Grant, Sattler, Malcolm,<br>Gennaro, Lex &amp; Tim</div></header>
    <div style="${at(30,162,600)}">${all.map(row).join('')}</div>
    <footer style="${at(30,656,600,`border-top:3px solid ${I};padding-top:8px;display:flex;justify-content:space-between;${T};font-size:11px;color:${M}`)}"><span>CONTAINS LYSINE. ASK YOUR GUIDE.</span><span>IT'S A UNIX SYSTEM. WE KNOW THIS.</span></footer>
  </section>`;
  const right=`<div style="${at(708,22,339,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;border:4px solid ${Y};background:${Y}">${img('hero','Jurassic Park film still',331,224)}</figure>
    <figure style="margin:14px 0 0;border:4px solid ${Y};background:${Y}">${img('scene','Jurassic Park film scene',331,270)}</figure>
    <div style="margin-top:auto;background:${Y};padding:12px 16px;box-shadow:0 5px 14px rgba(0,0,0,.5)">
      <div style="${T};font-size:11px;font-weight:700;color:${I}">CONTROL ROOM NOTE / ARNOLD</div>
      <div style="${S};font-size:22px;line-height:1.15;color:${I};margin-top:4px">Hold onto your butts.<br>Sundae's back online.</div>
      <div style="${B};font-size:13px;line-height:1.38;color:${I};margin-top:6px"><b>CUE</b> ${ESC(fmtCue(f))}</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#9fb09a;margin-top:10px;text-align:right">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${J};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 90% 100%,rgba(61,107,58,.5),transparent 60%)"></div>${sheet}${right}</div>`;
}
