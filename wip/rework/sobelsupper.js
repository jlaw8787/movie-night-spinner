function fmtSobelSupper(f,spec,menu,poster){
  const W='#3b2f2a',Y='#fbf1b8',RL='#d9534f',BL='#a9c3d6',I='#232020',M='#5c5650',R='#9b2c22',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const dx=['Hungry. Talks with hands.','Needs comfort. Denies it.','Big feelings. Bigger plate.','Sweet tooth. Emotional.','Wants one drink. Has two.'];
  const row=(it,i)=>`<div style="padding:${i?9:0}px 0 9px;${i<all.length-1?'border-bottom:1px solid '+BL:''}">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${T};font-size:11px;font-weight:700;letter-spacing:.08em;color:${R}">${i+1}. ${ESC((tabs[i]||'').toUpperCase())}</span><span style="${T};font-size:12px;color:${M}">Dx: ${dx[i]}</span></div>
    <div style="${H};font-size:${i===2?30:26}px;line-height:1.03;font-weight:600;color:${I};margin-top:1px">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`;
  const pad=`<section aria-label="Session notes menu" style="${at(24,30,646,`height:690px;background:${Y};box-shadow:0 8px 20px rgba(0,0,0,.55)`)}">
    <div aria-hidden="true" style="${at(0,-12,646,'height:26px;background:#7a2b23;box-shadow:0 2px 4px rgba(0,0,0,.4)')}"></div>
    <div aria-hidden="true" style="position:absolute;left:62px;top:14px;bottom:0;width:2px;background:${RL}"></div><div aria-hidden="true" style="position:absolute;left:66px;top:14px;bottom:0;width:1px;background:${RL}"></div>
    <header style="${at(84,30,532,`border-bottom:2px solid ${BL};padding-bottom:8px`)}">
      <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${R}">BEN SOBEL, M.D. / SESSION NOTES / MONTCLAIR, N.J.</div><div style="${H};font-size:42px;line-height:1;font-weight:600;color:${I};margin-top:3px">Dinner with the patient</div></div>
      <div style="${T};font-size:11px;line-height:1.45;color:${M};text-align:right">PATIENT: P. Vitti<br>REFERRED BY: Jelly<br>FEE: we'll discuss</div></div></header>
    <div style="${at(84,124,532)}">${all.map(row).join('')}</div>
    <div style="${at(84,628,532,`border-top:2px solid ${BL};padding-top:8px;${H};font-size:19px;font-style:italic;color:${I}`)}">Note to self: he cries at the long-distance phone ads. Do not mention.</div>
  </section>`;
  const right=`<div style="${at(696,22,351,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(1deg)">${img('identity','Paul Vitti and Ben Sobel in the consulting room',339,190,'center 30%')}</figure>
    <figure style="margin:16px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg)">${img('dinner','Paul Vitti and Ben Sobel talking over coffee at the table',339,228)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">Session held off site. Patient insisted.</figcaption></figure>
    <div style="margin-top:auto;background:#fff;border-top:8px solid ${R};padding:12px 16px 14px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(1.2deg)">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${H};font-size:36px;font-weight:600;line-height:1;color:${R}">Rx</span><span style="${T};font-size:11px;color:${M}">REFILLS: as needed</span></div>
      <div style="${H};font-size:21px;line-height:1.2;font-weight:600;color:${I};margin-top:4px">${ESC(fmtCue(f))}</div>
      <div style="${T};font-size:11px;color:${M};margin-top:6px">${ESC(spec.tag||'')} Take with cannoli.</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#c9b9a8;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${W};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.05),transparent 60%)"></div>${pad}${right}</div>`;
}
