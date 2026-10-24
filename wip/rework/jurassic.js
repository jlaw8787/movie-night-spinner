function fmtJurassic(f,spec,menu,poster){
  const JG='#123d2a',Y='#f5b81c',R='#d52b1e',K='#151714',P='#f7f2e3',P2='#efe7cf',M='#575b52';
  const C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Barlow',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},all=menu.all;
  const tm=(p,size)=>`${TMDB_IMG}${size}${ESC(p)}`;
  const pic=(p,alt,w,h,pos='center')=>p?`<img class="fx-poster" crossorigin="anonymous" src="${tm(p,'w1280')}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lands=[
    {n:'Hatchery',c:'#1f7a8c',svc:'Grab and go'},
    {n:'Visitor Centre Kitchen',c:'#d9731a',svc:'Quick service'},
    {n:'Visitor Centre Dining Room',c:R,svc:'Table service'},
    {n:'Visitor Centre Rotunda',c:'#7a5a1e',svc:'Dessert bar'},
    {n:'Tour Road, T. rex Paddock',c:'#3f8a2e',svc:'Tour car drinks'}];
  const pinS=(c,s,fs)=>`display:inline-block;width:${s}px;height:${s}px;border-radius:50%;background:${c};border:2px solid #fff;box-sizing:border-box;color:#fff;${C};font-weight:800;font-size:${fs}px;line-height:${s-4}px;text-align:center;flex:none`;
  const W=[300,390,329],X=[26,326,716],TOP=22,H=698;
  const panel=(i,inner,bg,pad)=>`<section style="position:absolute;left:${X[i]}px;top:${TOP}px;width:${W[i]}px;height:${H}px;background:${bg};box-sizing:border-box;padding:${pad};overflow:hidden;display:flex;flex-direction:column">${inner}</section>`;

  /* panel 1: cover */
  const logo=a.logo?`<img class="fx-poster" crossorigin="anonymous" src="${tm(a.logo,'w500')}" alt="${ESC(f.title)} logo" style="display:block;width:226px;height:168px;object-fit:contain;margin:0 auto">`:`<div style="${C};font-weight:800;font-size:44px;color:${Y};text-align:center">${ESC(f.title.toUpperCase())}</div>`;
  const gate=a.gate||'/alqZDg4DXBpNCVTzRPXe5zkkAXX.jpg';
  const cover=`<div style="position:absolute;left:0;top:0;width:${W[0]}px;height:10px;background:${Y}"></div>
    <div style="position:absolute;left:0;top:10px;width:${W[0]}px;height:6px;background:${R}"></div>
    <div style="margin-top:10px">${logo}</div>
    <div style="text-align:center;margin-top:8px">
      <div style="${C};font-weight:700;font-size:15px;letter-spacing:.26em;color:${Y}">ISLA NUBLAR</div>
      <div style="${C};font-weight:800;font-size:38px;line-height:.98;color:#fff;margin-top:4px;text-transform:uppercase">Dining Guide<br>&amp; Park Map</div>
      <div style="${B};font-size:13px;color:#d7e3d2;margin-top:6px">Preview tour edition. Spared no expense.</div></div>
    <div style="margin-top:14px;border:3px solid ${Y};background:${K}">${pic(gate,'The park gates',254,168,'center 35%')}</div>
    <div style="margin-top:10px;text-align:center;${C};font-weight:800;font-size:20px;letter-spacing:.03em;color:${Y};white-space:nowrap">"WELCOME TO JURASSIC PARK."</div>
    <div style="text-align:center;${B};font-size:13px;color:#d7e3d2">John Hammond, founder</div>
    <div style="margin-top:auto;display:flex;gap:8px">
      <div style="flex:1;background:${Y};padding:8px 10px"><div style="${C};font-weight:800;font-size:13px;letter-spacing:.08em;color:${K}">GATES OPEN</div><div style="${B};font-size:13px;line-height:1.25;color:${K}">When your tour car arrives</div></div>
      <div style="flex:1;background:${R};padding:8px 10px"><div style="${C};font-weight:800;font-size:13px;letter-spacing:.08em;color:#fff">FENCES</div><div style="${B};font-size:13px;line-height:1.25;color:#fff">10,000 volts. Do not touch</div></div></div>
    <div style="${T};font-size:10px;color:#9fb79f;margin-top:8px;text-align:center">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>`;

  /* panel 2: where to eat */
  const row=(it,i)=>{const L=lands[i]||lands[0];return `<div style="display:flex;gap:11px;padding:8px 0 9px;border-top:1px solid #d8cdb0">
      <div style="${pinS(L.c,30,17)}">${i+1}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <span style="${C};font-weight:700;font-size:13px;letter-spacing:.07em;color:${L.c};text-transform:uppercase">${L.n}</span>
          <span style="${C};font-weight:700;font-size:11px;letter-spacing:.06em;color:#fff;background:${K};padding:1px 6px;white-space:nowrap;text-transform:uppercase">${L.svc}</span></div>
        <div style="${C};font-weight:800;font-size:22px;line-height:1.05;color:${K};margin-top:3px;text-transform:uppercase">${ESC(it.label)}</div>
        ${it.desc?`<div style="${B};font-size:13.5px;line-height:1.36;color:${K};margin-top:3px">${ESC(it.desc)}</div>`:''}
        ${it.film?`<div style="${B};font-style:italic;font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`};
  const eat=`<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid ${K};padding-bottom:6px">
      <div><div style="${C};font-weight:700;font-size:13px;letter-spacing:.16em;color:${R}">WHERE TO EAT AND DRINK</div>
      <div style="${C};font-weight:800;font-size:34px;line-height:1;color:${K};text-transform:uppercase">Today's Menu</div></div>
      <div style="${B};font-size:13px;color:${M};text-align:right;line-height:1.3">Numbers match<br>the park map</div></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between">${all.map(row).join('')}</div>
`;

  /* panel 3: park map, built from boxes so it survives the saved image */
  const zone=(x,y,w,h,c)=>`<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:50%"></div>`;
  const fence=(x,y,w,h)=>`<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:3px dashed ${Y};box-sizing:border-box;border-radius:6px"></div>`;
  const lab=(x,y,t,c='#fff',bg='rgba(13,42,29,.88)')=>`<div style="position:absolute;left:${x}px;top:${y}px;${C};font-weight:700;font-size:11px;letter-spacing:.05em;color:${c};background:${bg};padding:1px 5px;white-space:nowrap;text-transform:uppercase">${t}</div>`;
  const road=(x1,y1,x2,y2)=>{const L=Math.hypot(x2-x1,y2-y1),ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI;return `<div style="position:absolute;left:${x1}px;top:${y1-3}px;width:${L}px;height:6px;background:#e8d7a8;border-radius:3px;transform:rotate(${ang}deg);transform-origin:0 3px"></div>`};
  const pins=[[64,300],[118,262],[150,236],[196,262],[214,96]];
  const map=`<div aria-label="Park map" style="position:relative;width:289px;height:350px;background:#3e7f93;overflow:hidden;border:3px solid ${K};box-sizing:border-box">
      <div style="position:absolute;left:12px;top:12px;width:262px;height:318px;background:#6c9b49;border-radius:42% 58% 46% 54% / 38% 44% 56% 62%;border:3px solid #e8d7a8;box-sizing:border-box"></div>
      ${zone(40,40,120,90,'#4f7d36')}${zone(150,170,110,110,'#4f7d36')}${zone(30,190,80,70,'#5d8c3f')}
      <div style="position:absolute;left:96px;top:30px;width:16px;height:290px;background:#4f9bb0;border-radius:10px;transform:rotate(18deg)"></div>
      ${fence(170,52,96,84)}${fence(40,56,74,60)}${fence(176,268,74,40)}
      ${road(64,300,118,262)}${road(118,262,150,236)}${road(150,236,196,262)}${road(150,236,170,170)}${road(170,170,214,96)}
      <div style="position:absolute;left:126px;top:214px;width:48px;height:40px;background:#efe3c0;border:2px solid ${K};border-radius:8px 8px 4px 4px"></div>
      ${pins.map((p,i)=>`<div style="position:absolute;left:${p[0]-13}px;top:${p[1]-13}px;${pinS((lands[i]||lands[0]).c,26,14)}">${i+1}</div>`).join('')}
      ${lab(172,138,'T. rex')}${lab(40,120,'Raptor pen','#fff',R)}${lab(160,322,'Triceratops')}${lab(26,322,'Hatchery')}${lab(98,192,'Visitor Centre',K,Y)}${lab(36,24,'Dilophosaurus')}${lab(204,26,'Helipad')}
      <div style="position:absolute;right:12px;bottom:46px;width:28px;height:28px;border-radius:50%;background:${P};border:2px solid ${K};box-sizing:border-box;${C};font-weight:800;font-size:13px;line-height:24px;text-align:center;color:${K}">N</div></div>`;
  const legend=[['Dining stop','#d9731a'],['Electric fence',Y],['Tour road','#e8d7a8']].map(([t,c])=>`<span style="display:inline-flex;align-items:center;gap:5px;margin-right:12px"><span style="width:13px;height:13px;background:${c};border:1px solid ${K};display:inline-block"></span>${t}</span>`).join('');
  const mappanel=`<div style="${C};font-weight:700;font-size:13px;letter-spacing:.16em;color:${R}">GUEST MAP</div>
    <div style="${C};font-weight:800;font-size:28px;line-height:1;color:${K};text-transform:uppercase;margin-bottom:8px">Isla Nublar</div>
    ${map}
    <div style="${B};font-size:12px;color:${K};margin-top:7px">${legend}</div>
    <div style="margin-top:10px;border-top:4px solid ${K};padding-top:7px">
      <div style="${C};font-weight:800;font-size:15px;letter-spacing:.08em;color:${K}">PARK RULES</div>
      <div style="${B};font-size:13px;line-height:1.4;color:${K};margin-top:2px">Stay in your tour car. Objects in mirror are closer than they appear. Something big walks past? Keep absolutely still.</div></div>
<div style="margin-top:10px;background:${JG};color:#fff;padding:8px 11px">
      <div style="${C};font-weight:800;font-size:14px;letter-spacing:.08em;color:${Y}">SHOWTIME CUE</div>
      <div style="${B};font-size:13px;line-height:1.32">${ESC(fmtCue(f))}</div></div>
    <div style="margin-top:auto;display:flex;gap:9px;align-items:center;background:${K};padding:8px 10px">
      <div style="flex:none;width:38px;height:38px;border-radius:50%;background:${Y};${C};font-weight:800;font-size:13px;line-height:38px;text-align:center;color:${K}">DNA</div>
      <div style="${B};font-size:13px;line-height:1.3;color:#fff"><b style="color:${Y}">Mr. DNA says:</b> gaps in the recipe get filled. Never with frog.</div></div>`;

  const folds=[X[1],X[2]].map(x=>`<div aria-hidden="true" style="position:absolute;left:${x-5}px;top:${TOP}px;width:10px;height:${H}px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.16) 50%,rgba(255,255,255,.22) 52%,rgba(0,0,0,0))"></div>`).join('');
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#0b1a12;overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;left:26px;top:${TOP}px;width:1019px;height:${H}px;box-shadow:0 10px 26px rgba(0,0,0,.6)"></div>
    ${panel(0,cover,JG,'26px 20px 12px')}${panel(1,eat,P,'18px 22px 16px')}${panel(2,mappanel,P2,'18px 20px 16px')}${folds}</div>`;
}
