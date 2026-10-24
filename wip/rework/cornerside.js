function fmtCornerside(f,spec,menu,poster){
 const C='#eee9dc',K='#1c1d1b',I='#242420',M='#6a665c',R='#8c332f',Y='#d9b44a',RULE='#bdb6a6';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(t,c=R,e='')=>`<div style="${B};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const it=menu.all,g=[];spec.groups.forEach(x=>x.items.forEach(()=>g.push(x)));
 const main=it[2]||{},under=[0,1,3,4],rounds=['4 rounds','6 rounds','8 rounds','10 rounds'];
 const bout=(i,k)=>{const x=it[i]||{};return `<div style="border-top:2px solid ${I};padding:9px 0 0">
   <div style="display:flex;justify-content:space-between;align-items:baseline">${lab(rounds[k],R)}${lab((g[i]||{}).tab||'',M)}</div>
   <div style="${B};font-size:28px;line-height:1.02;font-weight:700;color:${I};text-transform:uppercase;white-space:nowrap;margin-top:3px">${ESC(x.label||'')}</div>
   ${x.desc?`<div style="${B};font-size:18px;line-height:1.25;font-weight:500;color:${I};margin-top:3px">${ESC(x.desc)}</div>`:''}
   ${x.film?`<div style="${B};font-size:16.5px;line-height:1.25;font-style:italic;color:${M};margin-top:2px">${ESC(x.film)}</div>`:''}</div>`;};
 const card=`<section style="position:absolute;left:24px;top:24px;width:640px;height:694px;box-sizing:border-box;background:${C};padding:16px 26px 12px;box-shadow:0 10px 24px rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:space-between">
   <div style="text-align:center">${lab('Bronx boxing club / Fight night supper / Doors at 7',I)}
     <div style="${D};font-size:66px;line-height:1;letter-spacing:-.02em;color:${I};margin-top:6px">TONIGHT!</div>
     <div style="${B};font-size:20px;font-weight:600;letter-spacing:.08em;color:${M};margin-top:2px;text-transform:uppercase">${ESC(spec.tag||'')}</div></div>
   <div style="background:${K};color:${C};padding:18px 18px 20px;text-align:center">
     ${lab('Main event / 15 rounds / Middleweight, 160 lb',Y)}
     <div style="${D};font-size:50px;line-height:1.02;letter-spacing:-.02em;margin-top:4px">${ESC((main.label||'').toUpperCase())}</div>
     <div style="${B};font-size:19px;line-height:1.25;font-weight:500;margin-top:4px">${ESC(main.desc||'')}</div>
     <div style="${B};font-size:17px;font-style:italic;color:${Y};margin-top:2px">${ESC(main.film||'')}</div></div>
   ${lab('The undercard',I,'text-align:center')}
   <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:24px;row-gap:18px">${under.map(bout).join('')}</div>
   <div style="border-top:4px double ${I};padding-top:7px;display:flex;justify-content:space-between;${B};font-size:13px;font-weight:700;letter-spacing:.1em;color:${M}"><span>RINGSIDE $6.00 / NO REFUNDS</span><span>NEVER GOT ME DOWN, RAY.</span></div></section>`;
 const side=`<section style="position:absolute;left:688px;top:24px;width:359px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div><div style="${D};font-size:46px;line-height:.95;color:${C};letter-spacing:-.02em">RAGING<br>BULL</div>${lab('Jake LaMotta / The Bronx Bull / '+f.year,Y,'margin-top:8px')}</div>
   <figure style="margin:0;border:5px solid ${C}">${img('ring','Jake LaMotta in the ring',349,230,'center 25%')}</figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;border:4px solid ${C}">${img('table','Jake and Joey at the kitchen table',165,100)}</figure>
     <figure style="margin:0;border:4px solid ${C}">${img('club','Jake on stage at his nightclub',165,100)}</figure></div>
   <div style="border:2px dashed ${C};padding:9px 14px 10px">${lab('Serving cue',Y)}<div style="${B};font-size:19px;line-height:1.25;font-weight:500;color:${C};margin-top:3px">${ESC(fmtCue(f))}</div></div>
   <div style="${B};font-size:11px;letter-spacing:.14em;color:#9d978a">FILM IMAGERY: TMDB</div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 18px 38px rgba(0,0,0,.5)">${card}${side}</div>`;
}
