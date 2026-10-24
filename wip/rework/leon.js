function fmtLeon(f,spec,menu,poster){
 const P='#f0e8d5',C='#eef1e2',G='#29483b',I='#354034',M='#6c6e5c',R='#8c5741',L='#b9c7b4';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
 const art=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>art[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(art[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=G,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const qty=['1','1','2','2','2'],pr=['4.00','3.50','12.00','4.50','0.94'];
 const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:34px 1fr 64px;column-gap:12px;align-items:center;border-top:1px solid ${L};padding:7px 0">
   <div style="${T};font-size:18px;font-weight:700;color:${R};text-align:center">${qty[i]}</div>
   <div><div style="display:flex;align-items:baseline;gap:9px"><span style="${H};font-size:24px;line-height:1.05;font-weight:600;color:${G}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',M)}</div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:3px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${R};margin-top:2px">${ESC(r.it.film)}</div>`:''}</div>
   <div style="${T};font-size:16px;font-weight:700;color:${I};text-align:right;border-left:1px solid ${L};height:100%;display:flex;align-items:center;justify-content:flex-end">${pr[i]}</div></div>`;
 const check=`<section style="position:absolute;left:24px;top:24px;width:610px;height:694px;box-sizing:border-box;background:${C};border:2px solid ${G};box-shadow:0 8px 18px #29483b33;display:flex;flex-direction:column">
   <div style="display:flex;justify-content:space-between;align-items:center;background:${G};color:${P};padding:10px 18px">
     <div>${lab("Tony's / Little Italy / Guest check",'#e5d4a7')}<div style="${H};font-size:38px;line-height:1;font-weight:500;letter-spacing:-.01em;margin-top:3px">A quiet supper</div></div>
     <div style="text-align:right">${lab('No.','#e5d4a7')}<div style="${T};font-size:24px;font-weight:700;color:#e8b8a4">1994</div></div></div>
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1.2fr;border-bottom:2px solid ${G}">
     ${[['Table','Back room'],['Server','Tony'],['Guests','2'],['Paid','Tony holds it']].map((x,i)=>`<div style="padding:6px 12px;${i?'border-left:1px solid '+L:''}">${lab(x[0],M)}<div style="${T};font-size:15px;font-weight:700;color:${G};margin-top:2px;white-space:nowrap">${x[1]}</div></div>`).join('')}</div>
   <div style="display:grid;grid-template-columns:34px 1fr 64px;column-gap:12px;padding:6px 18px 4px">${lab('Qty',M,'text-align:center')}${lab('Item',M)}${lab('$',M,'text-align:right')}</div>
   <div style="padding:0 18px;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="border-top:2px solid ${G};padding:8px 18px;display:flex;justify-content:space-between;align-items:baseline">
     <span style="${T};font-size:12px;font-weight:700;color:${M}">CHANGE HELD BY TONY. LIKE EVERYTHING ELSE.</span><span style="${T};font-size:12px;font-weight:700;color:${M}">FILM STILLS: TMDB</span></div></section>`;
 const side=`<section style="position:absolute;left:656px;top:24px;width:391px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${H};font-size:76px;line-height:.85;font-weight:500;letter-spacing:-.04em;color:${G}">LÉON</div><div style="text-align:right">${lab('The Professional',R)}<div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:2px">New York, ${ESC(f.year)}</div></div></div>
   <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 12px #29483b33">${img('plant','Mathilda beside Léon’s potted plant by the window',379,236)}<figcaption style="${H};font-style:italic;font-size:17px;color:${I};margin-top:5px">The plant gets the window. Always.</figcaption></figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px #29483b33">${img('milk','Léon with his milk in the apartment kitchen',178,122)}</figure>
     <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px #29483b33">${img('table','Léon and Mathilda at a restaurant table',178,122,'center 40%')}</figure></div>
   <div style="${H};font-size:22px;line-height:1.2;font-style:italic;color:${R};border-left:4px solid ${R};padding-left:12px">${ESC(spec.tag||'')}</div>
   <div style="background:${G};color:${P};padding:11px 16px 12px">${lab('Serving cue','#e5d4a7')}<div style="${B};font-size:15px;line-height:1.45;margin-top:4px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};${B};box-shadow:0 15px 28px rgba(0,0,0,.35)">${check}${side}</div>`;
}


/* Manhattan lunch, on both sides of a negotiation. Genuine 2006 film frames only. */
