function fmtRoadtrip(f,spec,menu,poster){
  const K='#2c5d4f',P='#f6efd9',I='#24282a',M='#5d605a',R='#d4402f',Y='#f2c230',BL='#3b78a8',S="font-family:'Bevan',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const miles=['MILE 0','MILE 212','MILE 640','MILE 1,140','MILE 2,476'],stop=['Driveway, Spoonerville','Lester’s Possum Park','Campsite, by the lake','Bigfoot country','Los Angeles, CA'];
  const row=(it,i)=>`<div style="position:relative;padding:0 0 ${i<all.length-1?11:0}px 58px">
    <div style="position:absolute;left:4px;top:2px;width:34px;height:34px;border-radius:50%;background:${i===4?R:Y};border:3px solid ${I};box-sizing:border-box;text-align:center;${S};font-size:16px;line-height:28px;color:${I}">${i+1}</div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;${T};font-size:11px;font-weight:700;letter-spacing:.06em;color:${BL}"><span>${miles[i]} / ${ESC(stop[i]).toUpperCase()}</span><span style="color:${M}">${ESC((tabs[i]||'').toUpperCase())}</span></div>
    <div style="${S};font-size:${i===2?25:21}px;line-height:1.1;color:${I};margin-top:2px">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:3px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`;
  const sheet=`<section aria-label="Road trip planner menu" style="${at(24,22,652,`height:698px;background:${P};box-shadow:0 8px 20px rgba(0,0,0,.5)`)}">
    <div aria-hidden="true" style="position:absolute;left:0;right:0;top:0;height:14px;display:flex"><i style="flex:1;background:${R}"></i><i style="flex:1;background:${Y}"></i><i style="flex:1;background:${BL}"></i></div>
    <header style="${at(30,30,592,`border-bottom:3px solid ${I};padding-bottom:10px`)}">
      <div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${R}">ROAD ATLAS TRIP PLANNER / FATHER AND SON / 1995</div>
      <div style="display:flex;align-items:baseline;gap:14px;margin-top:4px;flex-wrap:wrap"><span style="${S};font-size:30px;color:${M};position:relative">Lake Destiny, Idaho<span aria-hidden="true" style="position:absolute;left:-4px;right:-4px;top:52%;height:4px;background:${R};transform:rotate(-2deg)"></span></span><span style="${S};font-size:30px;color:${R};transform:rotate(-2deg);display:inline-block">L.A.!</span></div>
      <div style="${T};font-size:12px;color:${M};margin-top:4px">Route changed by: Max. Do not tell Dad.</div></header>
    <div aria-hidden="true" style="position:absolute;left:51px;top:158px;height:440px;border-left:4px dashed ${I}"></div>
    <div style="${at(30,152,592)}">${all.map(row).join('')}</div>
    <footer style="${at(30,644,592,`border-top:3px solid ${I};padding-top:8px;display:flex;gap:12px;align-items:baseline`)}"><span style="${T};font-size:11px;font-weight:700;color:${R};white-space:nowrap">TRIP CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span></footer>
  </section>`;
  const right=`<div style="${at(700,22,347,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(1deg);padding-bottom:7px">${img('concert','Goofy, Max and Powerline on the concert stage',335,206)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 0 0">Final stop. The Powerline stage, L.A.</figcaption></figure>
    <figure style="margin:14px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(-1.2deg)">${img('map','Goofy and Max with the road map in the car',335,236)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">Navigator: Max. Map: slightly edited.</figcaption></figure>
    <div style="margin-top:auto;background:${Y};padding:12px 16px;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(1.2deg);border:3px dashed ${I}">
      <div style="${T};font-size:11px;font-weight:700;color:${I}">ADMIT ONE / LESTER’S POSSUM PARK</div>
      <div style="${S};font-size:22px;line-height:1.15;color:${I};margin-top:4px">Do the Perfect Cast. Then eat.</div>
      <div style="${B};font-size:13px;line-height:1.35;color:${I};margin-top:5px">${ESC(spec.tag||'')}</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#c7dccf;margin-top:10px;text-align:right">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${K};overflow:hidden;box-shadow:0 16px 40px #0006">${sheet}${right}</div>`;
}
