function fmtPrizzis(f,spec,menu,poster){
  const P='#f0e6d6',W='#f8f1e6',I='#39312f',M='#74625b',R='#6b293c',V='#ac939f',L='#d6c6b6';
  const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=R,e='')=>`<div style="${B};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center;padding:4px 0">
    ${lab(i===1?'While Charley decides':(r.g.h||''),V)}
    <div style="${H};font-size:27px;line-height:1.05;font-weight:600;color:${R};margin-top:2px">${ESC(r.it.label||'')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:16.5px;line-height:1.25;color:${M};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
  const orn=`<div aria-hidden="true" style="display:flex;align-items:center;gap:10px;justify-content:center"><span style="width:60px;height:1px;background:${V}"></span><span style="width:7px;height:7px;background:${V};transform:rotate(45deg)"></span><span style="width:60px;height:1px;background:${V}"></span></div>`;
  const card=`<section style="position:absolute;left:443px;top:24px;width:604px;height:694px;box-sizing:border-box;background:${W};padding:10px;box-shadow:0 12px 26px rgba(0,0,0,.4)">
   <div style="height:100%;box-sizing:border-box;border:1px solid ${V};box-shadow:inset 0 0 0 4px ${W},inset 0 0 0 5px ${V};padding:16px 36px 12px;display:flex;flex-direction:column">
    <div style="text-align:center">
      <div style="width:52px;height:52px;border-radius:50%;border:2px solid ${R};margin:0 auto;display:flex;align-items:center;justify-content:center;${H};font-size:34px;font-weight:600;font-style:italic;color:${R};line-height:1">P</div>
      <div style="${H};font-size:40px;line-height:1.02;font-weight:600;color:${I};margin-top:6px">${ESC(spec.brand||'')}</div>
      <div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:2px">Brooklyn. The Prizzi family requests your honour.</div>
      <div style="margin-top:8px">${orn}</div></div>
    <div style="flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="margin-bottom:7px">${orn}</div>
    <div style="display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${M}"><span>NO PHOTOGRAPHS OF THE FAMILY.</span><span>FILM STILLS: TMDB</span></div></div></section>`;
  const seats=[['1','Don Corrado Prizzi'],['1','Dominic & Eduardo'],['2','Charley & Angelo Partanna'],['7','Maerose. Far from Charley.'],['?','The lady in lavender']];
  const left=`<section style="position:absolute;left:24px;top:24px;width:395px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${H};font-size:48px;line-height:.95;font-weight:600;color:${R}">Prizzi's Honor</div><div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:4px">${ESC(spec.tag||'')}</div></div>
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 12px rgba(0,0,0,.2)">${img('couple','Charley and Irene',383,196)}</figure>
    <div style="display:flex;justify-content:space-between">
      <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px rgba(0,0,0,.2)">${img('family','The Prizzi family gathered',182,104)}</figure>
      <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px rgba(0,0,0,.2)">${img('dinner','Dinner with the Prizzis',182,104)}</figure></div>
    <div style="border:1px solid ${V};background:${W};padding:9px 14px 10px">${lab('Seating plan')}
      ${seats.map(s=>`<div style="display:flex;gap:10px;align-items:baseline;margin-top:3px"><span style="${T};font-size:13px;font-weight:700;color:${R};width:52px;white-space:nowrap">TBL ${s[0]}</span><span style="${H};font-size:17px;font-weight:600;color:${I}">${ESC(s[1])}</span></div>`).join('')}</div>
    <div style="background:${R};color:${P};padding:10px 14px 11px">${lab('Serving cue',P)}<div style="${H};font-size:21px;line-height:1.2;font-weight:600;margin-top:3px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};box-shadow:0 14px 28px rgba(0,0,0,.35);${B}"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(125deg,#fff8,transparent 60%,rgba(151,115,135,.08))"></div>${left}${card}</div>`;
}
