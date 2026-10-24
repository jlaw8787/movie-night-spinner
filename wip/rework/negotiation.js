function fmtNegotiation(f,spec,menu,poster){
 const N='#1f2523',P='#f3eddf',G='#2f5a47',L='#cfdccf',I='#1d2321',M='#5c635d',A='#8a6326',R='#a23a2a';
 const D="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},all=menu.all;
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
 const lab=(t,c=G)=>`<div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c}">${t}</div>`;
 const vals=['$20.00','$3.92','$392.00','$19.45','$140,000'];
 const row=(it,i)=>`<div style="display:grid;grid-template-columns:62px 1fr 78px;column-gap:14px;padding:${i?14:0}px 0 14px;${i<all.length-1?'border-bottom:1px solid #c9cdbf':''}">
   <div style="padding-top:2px">${lab(ESC(tabs[i]||''),A)}<div style="${D};font-size:30px;font-weight:700;line-height:1;color:${G}">0${i+1}</div></div>
   <div><div style="${D};font-size:${i===2?30:26}px;line-height:1.02;font-weight:700;text-transform:uppercase;color:${I};margin-top:1px">${ESC(it.label)}</div>
   <div style="${B};font-size:14px;line-height:1.4;color:${I};margin-top:3px">${ESC(it.desc)}</div>${it.film?`<div style="${B};font-size:13px;line-height:1.35;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>
   <div style="text-align:right;padding-top:4px">${lab('Declared',M)}<div style="${D};font-size:20px;font-weight:600;color:${I}">${vals[i]||''}</div></div></div>`;
 const card=`<section aria-label="Safe deposit box inventory menu" style="${at(24,22,648,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.6);border:10px solid ${L};box-sizing:border-box;outline:2px solid ${G};outline-offset:-14px`)}">
   <div style="${at(26,22,576,`border-bottom:3px solid ${G};padding-bottom:9px;display:flex;justify-content:space-between;align-items:flex-end`)}">
    <div>${lab('Manhattan Trust / 20 Exchange Place')}<div style="${D};font-size:40px;line-height:1;font-weight:700;color:${I};text-transform:uppercase;margin-top:3px">Safe deposit inventory</div></div>
    <div style="text-align:right;border:2px solid ${G};padding:3px 10px">${lab('Box no.')}<div style="${D};font-size:34px;line-height:1;font-weight:700;color:${G}">392</div></div></div>
   <div style="${at(26,100,576,`${B};font-size:13px;line-height:1.4;color:${M};display:flex;justify-content:space-between`)}"><span><b style="color:${I}">Holder:</b> A. Case, chairman</span><span><b style="color:${I}">Opened by:</b> D. Russell</span><span><b style="color:${I}">Witness:</b> Det. Frazier</span></div>
   <div style="${at(26,132,576)}">${all.map(row).join('')}</div>
   <div style="${at(26,632,576,`border-top:3px solid ${G};padding-top:7px;display:flex;justify-content:space-between;align-items:baseline`)}"><span style="${B};font-size:13px;font-style:italic;color:${I}">Pay strict attention. I never repeat myself.</span><span style="${B};font-size:9px;letter-spacing:.08em;color:${M}">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</span></div>
  </section>`;
 const pol=(k,alt,cap,w,h,rot)=>`<figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(${rot}deg)">${img(k,alt,w,h)}<figcaption style="${D};font-size:15px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:${I};padding:6px 2px 7px">${cap}</figcaption></figure>`;
 const ticket=`<div style="background:#fffdf6;padding:12px 11px 12px;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(1.5deg);border-top:6px solid ${R}">
   <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="${D};font-size:24px;font-weight:700;color:${R};text-transform:uppercase">Pizza order</div><div style="${B};font-size:11px;font-weight:700;color:${M}">TICKET 0029</div></div>
   <div style="${B};font-size:13px;line-height:1.45;color:${I};margin-top:4px"><b>Deliver to:</b> 20 Exchange Place. Leave on the step.<br><b>Note:</b> listen to the boxes. Ask for Steve. Or Steve-O.</div>
   <div style="border-top:1px dashed #b8b0a0;margin-top:8px;padding-top:6px"><div style="${D};font-size:14px;font-weight:700;color:${R};letter-spacing:.06em">SHOWTIME CUE</div><div style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</div></div></div>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 15px 34px rgba(0,0,0,.42)">
  ${card}<div style="${at(698,26,348,'height:690px;display:flex;flex-direction:column;justify-content:space-between')}">
   ${pol('russell','Dalton Russell in the bank during the heist','Inside: Dalton Russell',336,190,-1.2)}
   ${pol('frazier','Detective Keith Frazier outside the bank','Outside: Det. Keith Frazier',336,190,1)}
   ${ticket}</div></div>`;
}
