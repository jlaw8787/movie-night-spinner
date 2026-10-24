function fmtFever(f,spec,menu,poster){
  const K='#1b1420',P='#fbf7ee',I='#1d1a1e',M='#5f5960',R='#c2362b',S="font-family:'Alfa Slab One',serif",H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const chips=[['#b5432c','No. 86','Bay Ridge Brick'],['#c99a3a','No. 77','Gravy Gold'],['#e2462f','No. 2001','Slice Red'],['#c9c7cf','No. 500','Mirror Ball'],['#e6dfc8','No. 3','White Suit']];
  const fin=['FINISH: SATIN, SAUCY','FINISH: GRAVY GLOSS','FINISH: FOLDED','FINISH: HIGH SHINE','FINISH: WHITE ON WHITE'];
  const chip=(it,i)=>{const c=chips[i]||chips[0],dark=i<3;return `<div style="flex:1;min-width:0;background:${P};box-shadow:0 5px 14px rgba(0,0,0,.5);display:flex;flex-direction:column">
    <div style="height:86px;flex:none;background:${c[0]};padding:9px 12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
      <div style="${H};font-size:13px;font-weight:700;letter-spacing:.1em;color:${dark?'#fff':I};text-transform:uppercase">${ESC(tabs[i]||'')}</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${H};font-size:15px;font-weight:700;color:${dark?'#fff':I}">${c[2]}</span><span style="${H};font-size:15px;font-weight:700;color:${dark?'#fff':I}">${c[1]}</span></div></div>
    <div style="padding:13px 13px 12px;flex:1;display:flex;flex-direction:column">
      <div style="${H};font-size:${i===2?32:28}px;line-height:1;font-weight:700;text-transform:uppercase;color:${I}">${ESC(it.label)}</div>
      <div style="${B};font-size:16px;line-height:1.4;color:${I};margin-top:8px">${ESC(it.desc)}</div>
      ${it.film?`<div style="${B};font-size:15px;line-height:1.35;font-style:italic;color:${M};margin-top:10px">${ESC(it.film)}</div>`:''}
      <div style="margin-top:auto;border-top:1px solid #d8d0c4;padding-top:8px;display:flex;align-items:center;gap:8px;${H};font-size:13px;font-weight:700;letter-spacing:.08em;color:${M}"><span style="width:14px;height:14px;background:${c[0]};border:1px solid #0003;flex:none"></span>${fin[i]}</div></div></div>`};
  const pol=(k,alt,w,h,cap,rot)=>`<figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(${rot}deg);flex:none">${img(k,alt,w,h)}<figcaption style="${H};font-size:15px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${I};padding:5px 2px 6px">${cap}</figcaption></figure>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${K};overflow:hidden;box-shadow:0 16px 40px #0007">
   <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(226,70,47,.28),transparent 60%)"></div>
   <header style="${at(28,20,1015,'display:flex;justify-content:space-between;align-items:flex-end')}">
     <div><div style="${H};font-size:14px;font-weight:700;letter-spacing:.16em;color:#f0c46a">BAY RIDGE PAINT &amp; HARDWARE / 86TH STREET, BROOKLYN / 1977</div>
     <div style="${S};font-size:44px;line-height:1.05;color:#fff;margin-top:3px">Saturday Night colour card</div></div>
     <div style="text-align:right;${H};font-size:22px;font-weight:600;color:#f3d9d4;max-width:330px;line-height:1.1">${ESC(spec.tag||'')}</div></header>
   <div style="${at(28,110,1015,'display:flex;gap:14px;height:360px')}">${all.map(chip).join('')}</div>
   <div style="${at(28,492,1015,'display:flex;gap:22px;align-items:flex-start')}">
     ${pol('walk','Tony Manero walking down 86th Street','300','182','86th Street, under the El.',-1.5)}
     ${pol('dance','Tony Manero on the lit dance floor','330','182','Saturday night. The floor is his.',1.2)}
     <div style="flex:1;background:${R};padding:14px 18px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg);min-height:200px;box-sizing:border-box;display:flex;flex-direction:column">
       <div style="${H};font-size:14px;font-weight:700;letter-spacing:.12em;color:#ffd9a8">DANCE CONTEST / FIRST PRIZE $500</div>
       <div style="${S};font-size:26px;line-height:1.1;color:#fff;margin-top:6px">Watch the hair.</div>
       <div style="${H};font-size:14px;font-weight:700;letter-spacing:.12em;color:#ffd9a8;margin-top:12px">SHOWTIME CUE</div><div style="${B};font-size:14px;line-height:1.4;color:#fff;margin-top:2px">${ESC(fmtCue(f))}</div>
       <div style="${H};font-size:13px;font-weight:600;letter-spacing:.06em;color:#ffd9a8;margin-top:auto">NO ADVANCES ON PAY. ASK FOR A RAISE.</div></div>
   </div>
   <div style="${at(28,722,1015,`${B};font-size:9px;letter-spacing:.08em;color:#9c8f98;text-align:right`)}">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
}
