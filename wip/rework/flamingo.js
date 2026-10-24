function fmtFlamingo(f,spec,menu,poster){
 const K='#151214',P='#fbeee9',PK='#e98aa4',DP='#b9466a',I='#231c1f',M='#6e5f63',GD='#c7a35b';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},all=menu.all;
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
 const price=['1.25','.95','3.50','.75','.60'];
 const lab=(t,c=DP)=>`<div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${c}">${t}</div>`;
 const row=(it,i)=>`<div style="padding:${i?10:0}px 0 10px;${i<all.length-1?`border-bottom:1px solid #e3c3c8`:''};text-align:center">
   ${lab(ESC(tabs[i]||''))}
   <div style="${H};font-size:${i===2?30:25}px;line-height:1.05;font-weight:600;color:${I};margin-top:2px">${ESC(it.label)} <span style="${H};font-size:19px;font-weight:600;color:${GD}">${price[i]}</span></div>
   <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
   ${it.film?`<div style="${H};font-size:16px;line-height:1.25;font-style:italic;color:${M};margin-top:1px">${ESC(it.film)}</div>`:''}</div>`;
 const card=`<section aria-label="Opening night supper club menu" style="${at(236,22,600,`height:698px;background:${P};box-shadow:0 10px 26px rgba(0,0,0,.7)`)}">
   <div aria-hidden="true" style="position:absolute;inset:10px;border:2px solid ${PK}"></div><div aria-hidden="true" style="position:absolute;inset:16px;border:1px solid ${GD}"></div>
   <header style="${at(40,30,520,'text-align:center')}">${lab('Las Vegas, Nevada / December 26, 1946',GD)}
     <div style="${H};font-size:46px;line-height:.95;font-weight:600;color:${DP};margin-top:5px">The Flamingo</div>
     <div style="${H};font-size:19px;font-style:italic;color:${I};margin-top:3px">Opening night supper. Mr. Siegel requests black tie.</div>
     <div style="width:120px;height:2px;background:${PK};margin:10px auto 0"></div></header>
   <div style="${at(40,146,520)}">${all.map(row).join('')}</div>
 </section>`;
 const side=(k,alt,cap,sub,x,rot,extra)=>`<div style="${at(x,22,196,'height:698px;display:flex;flex-direction:column')}">
   <figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 6px 16px rgba(0,0,0,.6);transform:rotate(${rot}deg)">${img(k,alt,184,340)}<figcaption style="${H};font-size:17px;font-style:italic;font-weight:600;color:${I};padding:6px 2px 7px;line-height:1.15">${cap}</figcaption></figure>
   <div style="margin-top:22px;${B};font-size:14px;line-height:1.45;color:#e8d3d8;text-wrap:balance">${sub}</div>${extra}</div>`;
 const stub=`<div style="margin-top:auto;border:2px dashed ${PK};padding:12px 14px;text-align:center"><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;color:${PK}">BUILDING FUND</div><div style="${H};font-size:30px;font-weight:600;line-height:1.1;color:#fff">$6,000,000</div><div style="${B};font-size:11px;color:#e8d3d8">and counting.<br>Mr. Lansky has questions.</div></div>`;
 const elo=`<div style="margin-top:auto;background:${PK};padding:12px 14px;transform:rotate(1.5deg)"><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;color:${K}">ELOCUTION LESSON</div><div style="${H};font-size:20px;line-height:1.15;font-weight:600;font-style:italic;color:${K};margin-top:3px">Twenty dwarves took turns doing handstands on the carpet.</div></div><div style="${B};font-size:9px;letter-spacing:.1em;color:#8d7f83;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 15px 34px rgba(0,0,0,.42)">
  <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(233,138,164,.18),transparent 65%)"></div>
  ${side('desert','Bugsy Siegel in the desert at the Flamingo site','The desert site. Nothing but sand and a grand idea.',`<div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;color:${PK}">SHOWTIME CUE</div>${ESC(fmtCue(f))}<div style="${H};font-size:21px;font-style:italic;font-weight:600;color:#fff;margin-top:14px;line-height:1.15">Never call him Bugsy.<br>It’s Ben.</div>`,24,-1.5,stub)}
  ${card}
  ${side('party','Ben Siegel and Virginia Hill at a Hollywood party','Virginia Hill. He named the place for her.','A rickey for Virginia.<br>A steak for Ben.<br>The bill goes back east.',851,1.5,elo)}
 </div>`;
}
