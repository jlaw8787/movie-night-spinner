function fmtPerdition(f,spec,menu,poster){
 const K='#152b2a',P='#e6ddc5',W='#f1ead6',G='#263f3b',I='#303c36',M='#686b5c',R='#765242',L='#c2b89c';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
 const art=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>art[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(art[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=R,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.18em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const pr=['5¢','10¢','35¢','10¢','5¢'];
 const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px solid ${L};padding:6px 0">
   <div style="display:flex;align-items:baseline;gap:10px"><span style="${H};font-size:25px;line-height:1.05;font-weight:600;color:${G}">${ESC(r.it.label||'')}</span><span style="flex:1;border-bottom:2px dotted ${L};transform:translateY(-5px)"></span><span style="${H};font-size:24px;font-weight:600;color:${R}">${pr[i]||''}</span></div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${H};font-style:italic;font-size:16px;line-height:1.25;color:${M};margin-top:1px">${ESC(r.it.film)} <span style="${B};font-style:normal;font-size:11px;font-weight:700;letter-spacing:.14em;color:${R};text-transform:uppercase">/ ${ESC(r.g.tab||'')}</span></div>`:''}</div>`;
 const card=`<section style="position:absolute;left:24px;top:24px;width:604px;height:694px;box-sizing:border-box;background:${W};padding:10px;box-shadow:0 10px 24px rgba(0,0,0,.45)">
  <div style="height:100%;box-sizing:border-box;border:3px double ${G};padding:14px 24px 10px;display:flex;flex-direction:column">
   <div style="text-align:center;border-bottom:3px double ${G};padding-bottom:10px">
     ${lab('Roadside diner / Open all night / Winter 1931')}
     <div style="${H};font-size:46px;line-height:1;font-weight:600;color:${G};margin-top:4px;letter-spacing:.01em">Bill of Fare</div>
     <div style="${H};font-style:italic;font-size:20px;color:${M};margin-top:2px">${ESC(spec.brand||'')}. ${ESC(spec.tag||'')}</div></div>
   <div style="flex:1;display:flex;flex-direction:column;margin-top:4px">${rows.map(row).join('')}</div>
   <div style="border-top:3px double ${G};padding-top:7px;display:flex;justify-content:space-between;${T};font-size:11.5px;font-weight:700;color:${M}"><span>CASH ONLY. NO CHICAGO MONEY.</span><span>PHOTOGRAPHS BY MAGUIRE, ON REQUEST.</span></div></div></section>`;
 const stop=(x,name,sub,on)=>`<div style="position:absolute;left:${x}%;top:0;transform:translateX(-50%);text-align:center;width:120px"><div style="width:16px;height:16px;border-radius:50%;margin:0 auto;background:${on?'#c9a27a':P};border:3px solid ${P}"></div><div style="${H};font-size:19px;font-weight:600;color:${P};margin-top:4px;line-height:1">${name}</div><div style="${T};font-size:11px;color:#b7b19a;margin-top:2px">${sub}</div></div>`;
 const side=`<section style="position:absolute;left:652px;top:24px;width:395px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div><div style="${H};font-size:44px;line-height:.95;font-weight:500;color:${P}">Road to Perdition</div>${lab('Illinois, 1931 / The Sullivans, party of two','#c9a27a','margin-top:6px')}</div>
   <figure style="margin:0;background:${P};padding:6px">${img('diner','Sullivan at the roadside diner',383,206)}<figcaption style="${H};font-style:italic;font-size:16px;color:${I};margin-top:4px">The diner stop. Coffee, black.</figcaption></figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;background:${P};padding:5px">${img('car','Father and son on the road',182,104)}</figure>
     <figure style="margin:0;background:${P};padding:5px">${img('wake','The Rooney wake',182,104)}</figure></div>
   <div style="position:relative;height:74px;margin:0 6px"><div style="position:absolute;left:15%;right:15%;top:7px;border-top:2px dashed #b7b19a"></div>${stop(15,'Rock Island','the wake',0)}${stop(50,'Chicago','the banks',0)}${stop(85,'Perdition','the lake house',1)}</div>
   <div style="border-top:1px solid #4d6460;padding-top:8px">${lab('Serving cue','#c9a27a')}<div style="${B};font-size:15px;line-height:1.45;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${B};font-size:10px;letter-spacing:.12em;color:#8f9a8d;margin-top:6px">FILM STILLS: TMDB</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 14px 28px rgba(0,0,0,.4);${B}">${card}${side}</div>`;
}
