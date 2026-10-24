function fmtAfterhours(f,spec,menu,poster){
  const PA='#eef0e0',IN='#1f1d1a',SO='#57584c',RD='#b0201f',GL='#a9bf9e',BL='#21407a',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:14px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const who=['J. Boy','J. Boy','Charlie','J. Boy','Everybody'],owe=['$3.00','$4.50','$6.00','$1.00','$2.00'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:90px 1fr 96px;border-bottom:1px solid ${GL}">
    <div style="border-right:1px solid ${GL};padding:13px 8px 0"><div style="${T};font-size:15px;font-weight:700;color:${BL}">${who[i]||''}</div><div style="${T};font-size:12px;color:${SO};margin-top:4px">${ESC(gs[i]?gs[i].tab:'')}</div></div>
    <div style="padding:12px 12px 11px"><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${RD}">${ESC(it.film||'')}</p></div>
    <div style="border-left:3px double ${GL};padding:13px 8px 0;text-align:right"><div style="${T};font-size:15px;font-weight:700;color:${IN}">${owe[i]||''}</div><div style="${T};font-size:12px;color:${RD};margin-top:4px">${i===2?'PAID':i===4?'ASK MICHAEL':'UNPAID'}</div></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:radial-gradient(ellipse at 75% 30%,#c4231f,#6e0c10 55%,#260406);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:${PA};box-shadow:0 12px 28px #000c;box-sizing:border-box;padding:14px 20px 10px;display:flex;flex-direction:column">
    <div aria-hidden="true" style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(90deg,#00000022,#0000)"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${IN};padding-bottom:6px">
      <div>${lab('Tony’s bar / Back room / Little Italy',RD)}<div style="${C};font-size:46px;font-weight:700;line-height:.9;color:${IN};margin-top:3px">THE TAB BOOK</div></div>
      <div style="${T};font-size:13px;line-height:1.45;color:${IN};text-align:right">COLLECTOR: Michael<br>FEAST WEEK</div>
    </div>
    <div style="${B};font-size:14px;line-height:1.35;color:${IN};padding:7px 0;border-bottom:1px solid ${IN}">${ESC(spec.tag||'')} Everything goes on the book. Johnny Boy’s page is getting long.</div>
    <div style="display:grid;grid-template-columns:90px 1fr 96px;border-bottom:2px solid ${IN};padding:6px 0 4px">${lab('Who','','padding-left:8px')}${lab('Ordered','','padding-left:12px')}${lab('Owes','','text-align:right;padding-right:8px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${T};font-size:11px;color:${SO};margin-top:5px">House rule: no credit after the feast. Charlie vouches, Charlie pays.</div>
  </div>
  <header style="position:absolute;left:692px;top:22px;width:356px">
    ${lab('New York / 1973','#ffd4c2')}
    <h1 style="${C};font-size:84px;line-height:.82;font-weight:700;text-transform:uppercase;margin:6px 0 0;color:#fbeee0;text-shadow:none">Mean<br>Streets</h1>
  </header>
  <figure style="position:absolute;left:692px;top:200px;width:356px;margin:0;background:#f6efe4;padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000c;transform:rotate(1deg)">${img('bar','Charlie and Johnny Boy inside Tony’s red-lit bar',342,196)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Red light, a jukebox and a tab nobody intends to settle.</figcaption></figure>
  <div style="position:absolute;left:692px;top:478px;width:356px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#f6efe4;padding:6px;box-shadow:0 10px 22px #000c;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,136,204)}</div>
    <div style="flex:1;margin-top:6px;background:#f7e9b8;border:2px solid #7a5a1a;box-shadow:0 8px 16px #0009;transform:rotate(1.5deg)">
      <div style="display:flex;height:12px">${['#2a7a3a','#f7f2e8','#c4231f'].map(c=>`<i style="flex:1;background:${c}"></i>`).join('')}</div>
      <div style="padding:9px 11px 11px">
        ${lab('Feast of San Gennaro',RD)}
        <div style="${C};font-size:26px;font-weight:700;line-height:.95;color:${IN};margin-top:5px">RAFFLE No. 1973</div>
        <div style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:6px">Mulberry Street. Sausage, zeppole and a parade with a saint.</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#f0b9b0">FILM IMAGERY: TMDB</div>
  </div>`;
}
