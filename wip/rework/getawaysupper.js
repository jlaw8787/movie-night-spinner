function fmtGetawaySupper(f,spec,menu,poster){
  const D='#25241f',P='#f4e4b8',W='#fbf3dc',R='#a93d25',Y='#dcb345',S='#615843',B="font-family:'Libre Franklin',sans-serif",H="font-family:'Bevan',serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=S,e='')=>`<div style="${T};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const gate=['A4','A4','B12','C7','C7'];
  const coupon=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:74px 1fr;align-items:stretch;border-top:1px dashed ${S}">
    <div style="border-right:1px dashed ${S};padding:10px 0 8px;text-align:center;display:flex;flex-direction:column;justify-content:center"><div style="${T};font-size:11px;font-weight:700;color:${S};letter-spacing:.06em">CPN</div><div style="${H};font-size:26px;line-height:1.05;color:${R}">${i+1}</div><div style="${T};font-size:11px;font-weight:700;color:${D};margin-top:2px">GATE ${gate[i]||'A1'}</div></div>
    <div style="padding:9px 0 9px 16px;display:flex;flex-direction:column;justify-content:center"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><div style="${H};font-size:20px;line-height:1.15;color:${D}">${ESC(r.it.label||'')}</div>${lab(r.g.tab||'',R,'white-space:nowrap')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${D};margin-top:4px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${T};font-size:13px;line-height:1.35;color:${S};margin-top:3px">${ESC(r.it.film)}</div>`:''}</div></div>`;
  const field=(k,v,e='')=>`<div style="padding:6px 10px;${e}">${lab(k)}<div style="${T};font-size:15px;font-weight:700;color:${D};margin-top:2px;white-space:nowrap">${v}</div></div>`;
  const ticket=`<section style="position:absolute;left:476px;top:24px;width:571px;height:694px;box-sizing:border-box;background:${W};border:2px solid ${D};box-shadow:6px 7px 0 ${Y};display:flex;flex-direction:column">
    <div style="background:${D};color:${P};padding:10px 16px 10px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.14em">PASSENGER TICKET AND BAGGAGE CHECK</div><div style="${H};font-size:28px;line-height:1.15;margin-top:3px">Dinner before the getaway</div></div>
      <div style="border:2px solid ${Y};color:${Y};padding:5px 9px;${T};font-size:12px;font-weight:700;line-height:1.25;text-align:center;transform:rotate(-4deg)">NOT<br>TRANSFERABLE</div></div>
    <div style="display:grid;grid-template-columns:1.45fr 1fr 1fr;border-bottom:2px solid ${D}">
      ${field('Name of passenger','GRIMM / PHYLLIS / LOOMIS')}${field('From','NEW YORK','border-left:1px solid '+S)}${field('Via','JFK, EVENTUALLY','border-left:1px solid '+S)}</div>
    <div style="padding:0 16px;flex:1;display:flex;flex-direction:column;justify-content:stretch">${rows.map(coupon).join('')}</div>
    <div style="border-top:2px solid ${D};padding:7px 16px;display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${S};letter-spacing:.05em"><span>FARE: PAID IN CASH, ALL OF IT</span><span>${ESC(f.year)} / FILM IMAGERY: TMDB</span></div></section>`;
  const still=(k,alt,cap,pos)=>`<figure style="margin:0;width:208px"><div style="background:#fff8e4;padding:5px;box-shadow:0 4px 9px #25241f40">${img(k,alt,198,140,pos)}</div><figcaption style="${T};font-size:13px;line-height:1.3;color:${S};margin-top:6px">${ESC(cap)}</figcaption></figure>`;
  const left=`<section style="position:absolute;left:24px;top:24px;width:428px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="background:#246a84;border:6px solid #fff8e4;box-shadow:0 6px 14px #25241f44">${img('identity','Quick Change artwork showing the three would-be escapees in New York','416','262')}</div>
    <div style="border-left:6px solid ${R};padding:2px 0 2px 14px"><div style="${H};font-size:24px;line-height:1.2;color:${D}">${ESC(spec.tag||'')}</div></div>
    <div style="display:flex;justify-content:space-between">${still('bank','Grimm in his clown disguise at the bank','The clown at the bank.','center 30%')}${still('detour','A wrong turn somewhere in New York','Another wrong turn.','center')}</div>
    <div style="background:${D};color:${P};padding:12px 16px 13px;box-shadow:5px 6px 0 #c5b48b">${lab('Cab cue',Y)}<div style="${B};font-size:16px;line-height:1.45;font-weight:600;margin-top:5px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};overflow:hidden;box-shadow:0 18px 45px #0006"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(125deg,#fff7df77,transparent 55%,#a5792622)"></div>${left}${ticket}</div>`;
}
