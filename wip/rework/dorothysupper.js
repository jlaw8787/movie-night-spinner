function fmtDorothySupper(f,spec,menu,poster){
  const R='#8e273b',P='#fbf5ea',D='#33242a',M='#5e4b50',L='#cdb3ad',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(x=>{const it=menu.all[n++]||{};rows.push({set:g.h,tab:g.tab,it});}));
  const sc=['14','14A','22','31','38'];
  const row=(r,i)=>`<div style="display:grid;grid-template-columns:128px 1fr;column-gap:16px;padding:14px 0 14px;border-top:1px solid ${L}">
    <div><div style="${H};font-size:28px;line-height:1;font-weight:600;color:${R}">${sc[i]||i+1}</div><div style="margin-top:5px">${lab(r.set,D)}</div><div style="${B};font-size:10.5px;line-height:1.3;color:${M};margin-top:3px;text-transform:uppercase;letter-spacing:.08em">${ESC(r.tab||'')}</div></div>
    <div><div style="${H};font-size:26px;line-height:1.05;font-weight:600;color:${D}">${ESC(r.it.label||'')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${D};margin-top:4px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:16px;line-height:1.25;color:${M};margin-top:2px">${ESC(r.it.film)}</div>`:''}</div></div>`;
  const cell=(k,v)=>`<div style="padding:7px 10px;border-left:1px solid ${D}">${lab(k,M)}<div style="${B};font-size:13px;font-weight:600;color:${D};margin-top:3px">${v}</div></div>`;
  const head=`<div style="border:2px solid ${D}">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:9px 14px 9px;background:${R};color:${P}">
      <div><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Daily call sheet / catering</div><div style="${H};font-size:38px;line-height:1;font-weight:600;margin-top:3px;white-space:nowrap">Southwest General</div></div>
      <div style="${H};font-style:italic;font-size:18px;line-height:1.2;text-align:right;width:200px">${ESC(spec.tag||'')}</div></div>
    <div style="display:grid;grid-template-columns:1.1fr 1fr 1fr 1.2fr;border-top:2px solid ${D}">
      <div style="padding:7px 10px">${lab('Director',M)}<div style="${B};font-size:13px;font-weight:600;color:${D};margin-top:3px">Ron Carlisle</div></div>
      ${cell('Crew call','6:30 am')}${cell('Stage','Studio 8')}${cell('Serves','4, plus the cast')}</div></div>`;
  const right=`<section style="position:absolute;left:400px;top:24px;width:647px;height:694px;display:flex;flex-direction:column">
    ${head}
    <div style="display:grid;grid-template-columns:128px 1fr;column-gap:16px;padding:10px 0 6px">${lab('Scene / set',M)}${lab('On the table',M)}</div>
    ${rows.map(row).join('')}
    <div style="flex:1"></div>
    <div style="border-top:2px solid ${D};padding-top:8px;display:flex;justify-content:space-between;${B};font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:${M}"><span>Tomatoes: please sit down</span><span>Ad-libs: not approved</span><span>${ESC(f.year)} / Film imagery: TMDB</span></div></section>`;
  const still=(k,alt,cap,pos)=>`<figure style="margin:0;width:170px"><div style="background:#fff;padding:5px;box-shadow:0 3px 8px #43282c33">${img(k,alt,160,118,pos)}</div><figcaption style="${H};font-style:italic;font-size:15px;line-height:1.25;color:${M};margin-top:6px">${ESC(cap)}</figcaption></figure>`;
  const cast=[['Dorothy Michaels','Emily Kimberly'],['Julie Nichols','Ward set'],['John Van Horn','Dr. Brewster'],['Les Nichols','Visitor, lunch']];
  const left=`<section style="position:absolute;left:24px;top:24px;width:352px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="background:#fff;padding:6px;box-shadow:0 6px 14px #43282c33">${img('identity','Tootsie title artwork with Dorothy in her red dress over the New York skyline',340,206)}</div>
    <div style="border:2px solid ${D};padding:10px 14px 8px">
      ${lab('Cast called today')}
      ${cast.map(c=>`<div style="display:flex;align-items:baseline;gap:8px;margin-top:6px"><span style="${H};font-size:18px;font-weight:600;color:${D};white-space:nowrap">${ESC(c[0])}</span><span style="flex:1;border-bottom:1px dotted ${M};transform:translateY(-4px)"></span><span style="${B};font-size:13px;color:${M};white-space:nowrap">${ESC(c[1])}</span></div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between">${still('farm','Dorothy and John Van Horn on the hospital set','Dorothy and The Tongue.','center 30%')}${still('tearoom','Dorothy and George at the Russian Tea Room','Lunch with George.','center')}</div>
    <div style="background:${R};color:${P};padding:12px 16px 13px">${lab('Showtime cue',P)}<div style="${H};font-size:21px;line-height:1.2;font-weight:500;margin-top:5px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};box-shadow:0 18px 40px #0008">${left}${right}</div>`;
}
