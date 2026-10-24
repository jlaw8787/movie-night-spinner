function fmtGimbels(f,spec,menu,poster){
 const G='#174737',DARK='#08281e',Y='#d8b865',C='#f2eddd',W='#fbf7ec',R='#a0322d',I='#26392e',M='#6c6251',L='#d9cfb8';
 const S="font-family:'Cormorant Garamond',serif",D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const pr=['.95','1.25','2.50','1.10','Congratulations!'];
 const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px solid ${L};padding:5px 0">
   <div style="display:flex;align-items:baseline;gap:10px"><span style="${B};font-size:20px;line-height:1.1;font-weight:700;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',G)}<span style="flex:1;border-bottom:2px dotted ${L};transform:translateY(-4px)"></span><span style="${D};font-size:${i===4?15:18}px;color:${R};white-space:nowrap">${pr[i]}</span></div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.42;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${S};font-style:italic;font-size:17px;line-height:1.2;color:${M};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
 const stripe=`<div aria-hidden="true" style="height:12px;display:flex;overflow:hidden">${Array.from({length:26},(_,i)=>`<span style="flex:1;background:${i%2?C:R};transform:skewX(-35deg);margin:0 -1px"></span>`).join('')}</div>`;
 const card=`<section style="position:absolute;left:24px;top:24px;width:624px;height:694px;box-sizing:border-box;background:${W};box-shadow:0 12px 28px rgba(0,0,0,.5);display:flex;flex-direction:column">
   ${stripe}
   <div style="background:${G};color:${C};padding:12px 24px 12px;display:flex;justify-content:space-between;align-items:center">
     <div>${lab('Herald Square / New York / Holiday season',Y)}<div style="${D};font-size:44px;line-height:1;margin-top:4px;letter-spacing:-.01em">GIMBELS</div><div style="${S};font-style:italic;font-size:20px;color:${Y};margin-top:2px">Santaland lunch counter</div></div>
     <div style="background:${R};color:${C};padding:9px 12px;text-align:center;transform:rotate(4deg);border:2px dashed ${C}"><div style="${B};font-size:11px;font-weight:700;letter-spacing:.14em">SANTA!</div><div style="${D};font-size:20px;line-height:1.05">HERE<br>TOMORROW</div></div></div>
   <div style="padding:8px 24px 0;${S};font-size:19px;font-style:italic;color:${M}">${ESC(spec.tag||'')}</div>
   <div style="padding:2px 24px 0;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="margin:0 24px;border-top:2px solid ${G};padding:7px 0 9px;display:flex;justify-content:space-between;${B};font-size:11px;font-weight:700;letter-spacing:.1em;color:${M}"><span>SYRUP ON REQUEST. ON EVERYTHING.</span><span>FILM IMAGERY: TMDB</span></div>
   ${stripe}</section>`;
 const side=`<section style="position:absolute;left:672px;top:24px;width:375px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${D};font-size:64px;line-height:.9;color:${C}">ELF</div><div style="text-align:right">${lab('New York, '+f.year,Y)}<div style="${S};font-style:italic;font-size:18px;color:${C};margin-top:2px">Son of a nutcracker.</div></div></div>
   <figure style="margin:0;border:5px solid ${C}">${img('buddy','Buddy in his elf suit in New York',365,196,'center 25%')}</figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;border:4px solid ${C}">${img('display','The Gimbels Christmas display',176,104)}</figure>
     <figure style="margin:0;border:4px solid ${C}">${img('store','Inside Gimbels at Christmas',176,104)}</figure></div>
   <div style="background:${C};color:${I};padding:9px 14px 10px;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(-1deg)">${lab('The four main elf food groups',R)}
     <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:10px;margin-top:4px">${['Candy','Candy canes','Candy corn','Syrup'].map((x,i)=>`<div style="${B};font-size:14px;font-weight:600;line-height:1.5">${i+1}. ${x}</div>`).join('')}</div></div>
   <div style="border-top:1px solid #2f6650;padding-top:8px">${lab('Serving cue',Y)}<div style="${B};font-size:15px;line-height:1.45;color:${C};margin-top:3px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${DARK};box-shadow:0 18px 40px #0008">${card}${side}</div>`;
}
