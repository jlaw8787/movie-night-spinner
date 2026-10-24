function fmtBoweryBelow(f,spec,menu,poster){
  const D='#131d21',P='#efe9d6',G='#b9dc5c',K='#3f5530',I='#1b2224',M='#4f564c',R='#b32a1f',H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab+' / '+g.h));
  const micro=(s,c=K)=>`<div style="${T};font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${c}">${ESC(s)}</div>`;
  const tick=['BOWL 01','BOWL 02','POT 03','TRAY 04','CUP 05'];
  const dish=(i,big)=>{const it=all[i]||{};return `<div style="display:flex;justify-content:space-between;align-items:baseline">${micro(tabs[i]||'')}<span style="${T};font-size:11px;font-weight:700;color:${M}">${tick[i]}</span></div>
    <div style="${H};font-size:${big?40:28}px;line-height:1;font-weight:700;text-transform:uppercase;letter-spacing:.01em;color:${I};margin-top:4px">${ESC(it.label||'')}</div>
    <div style="${B};font-size:15px;line-height:1.42;color:${I};margin-top:5px">${ESC(it.desc||'')}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.35;color:${M};margin-top:3px">${ESC(it.film)}</div>`:''}`};
  const grate=`<div aria-hidden="true" style="width:84px;height:84px;flex:none;border-radius:50%;background:#3a4144;border:5px solid #23292b;box-shadow:inset 0 0 0 7px #2c3335;position:relative;overflow:hidden"><div style="position:absolute;inset:14px;border-radius:50%;border:3px solid #5d6669"></div><div style="position:absolute;left:10px;right:10px;top:38px;height:3px;background:#5d6669"></div><div style="position:absolute;top:10px;bottom:10px;left:38px;width:3px;background:#5d6669"></div><div style="position:absolute;inset:26px;border-radius:50%;border:3px solid #5d6669"></div></div>`;
  const left=`<div style="${at(24,22,330,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#e9e3cf;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(-1deg)">${img('kitchen','The Reverend’s soup kitchen on the Bowery',318,240)}<figcaption style="${T};font-size:11px;color:${I};padding:7px 2px 8px">The Reverend, and a Geiger counter that ticks.</figcaption></figure>
    <figure style="margin:16px 0 0;background:#e9e3cf;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(1deg)">${img('street','Wet New York street and telephone booth in C.H.U.D.',318,228,'center 58%')}<figcaption style="${T};font-size:11px;color:${I};padding:7px 2px 8px">Downtown, 1984. Mind the manholes.</figcaption></figure>
    <div style="margin-top:auto;display:flex;gap:14px;align-items:center;padding-bottom:4px">${grate}<div><div style="${H};font-size:27px;line-height:1;font-weight:700;color:${G};letter-spacing:.01em;white-space:nowrap">${ESC(spec.tag||'')}</div><div style="${T};font-size:11px;line-height:1.45;color:#a9b3a3;margin-top:6px">Missing persons: report to Captain Bosch. Waste canisters stay sealed.</div></div></div>
  </div>`;
  const sheet=`<section aria-label="Bowery soup kitchen menu" style="${at(378,22,669,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.6);padding:22px 30px 0;box-sizing:border-box;display:flex;flex-direction:column`)}">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid ${I};padding-bottom:9px">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${K}">ABOVE GROUND SUPPER / HOT MEAL AT 6 / NO CHARGE</div><div style="${H};font-size:50px;line-height:.95;font-weight:700;letter-spacing:.01em;color:${I};white-space:nowrap">BOWERY SOUP KITCHEN</div></div>
      <div style="flex:none;white-space:nowrap;border:3px solid ${R};color:${R};padding:4px 8px;transform:rotate(-5deg);text-align:center;margin:0 6px 8px 14px"><div style="${H};font-size:22px;font-weight:700;letter-spacing:.06em;line-height:1">C.H.U.D.</div><div style="${T};font-size:10px;font-weight:700;letter-spacing:.04em;line-height:1.3;margin-top:3px">CONTAMINATION HAZARD<br>URBAN DISPOSAL</div></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:30px;margin-top:16px">
      <div>${dish(0)}</div><div>${dish(1)}</div></div>
    <div style="margin-top:16px;background:${I};color:${P};padding:16px 20px;position:relative">
      <div style="display:flex;justify-content:space-between;align-items:baseline">${micro(tabs[2]||'',G)}<span style="${T};font-size:11px;font-weight:700;color:${G}">${tick[2]}</span></div>
      <div style="${H};font-size:36px;line-height:1;font-weight:700;text-transform:uppercase;color:${P};margin-top:4px">${ESC((all[2]||{}).label||'')}</div>
      <div style="${B};font-size:15px;line-height:1.42;color:${P};margin-top:5px;max-width:560px">${ESC((all[2]||{}).desc||'')}</div>
      <div style="${T};font-size:13px;color:#c4cfb8;margin-top:3px">${ESC((all[2]||{}).film||'')}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:30px;margin-top:16px">
      <div>${dish(3)}</div><div>${dish(4)}</div></div>
    <div style="margin:auto 0 82px;border:2px dashed ${M};padding:8px 14px;display:flex;justify-content:space-between;align-items:baseline;gap:14px"><span style="${H};font-size:20px;font-weight:700;letter-spacing:.04em;color:${I};white-space:nowrap">MEAL TICKET No. 1984</span><span style="${T};font-size:11px;font-weight:700;letter-spacing:.05em;color:${M}">ONE BOWL EACH / KEEP CLEAR OF THE GRATES</span></div>
    <div style="${at(30,628,609,'border-top:2px solid '+I+';padding-top:9px;display:flex;gap:12px;align-items:baseline')}"><span style="${T};font-size:11px;font-weight:700;color:${R};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span><span style="${T};font-size:9px;color:${M};margin-left:auto;white-space:nowrap">FILM IMAGERY: TMDB</span></div>
  </section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};overflow:hidden;box-shadow:0 16px 40px #0006">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 18% 100%,rgba(185,220,92,.22),transparent 55%)"></div>${left}${sheet}</div>`;
}
