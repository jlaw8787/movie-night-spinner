function fmtShorty(f,spec,menu,poster){
  const PA='#fbf8ef',IN='#1d1b19',SO='#58534c',OR='#e0612a',TQ='#1d8a91',YE='#f2c84b',A="font-family:'Alfa Slab One',serif",C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:14px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const sc=[['1','EXT. MIAMI','Chili'],['2','INT. MIAMI','Chili'],['3','INT. LA DINER','Chili, Harry'],['4','INT. HARRY’S','Harry, Karen'],['5','INT. MORNING','Martin']];
  const row=(it,i)=>{const r=sc[i]||sc[0];return `<div style="display:grid;grid-template-columns:44px 1fr 118px;border-bottom:1px solid #cfc8b8">
    <div style="${A};font-size:22px;color:${OR};text-align:center;padding-top:12px;border-right:1px solid #cfc8b8">${r[0]}</div>
    <div style="padding:10px 12px 9px"><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${B};font-size:13px;line-height:1.35;font-style:italic;margin:3px 0 0;color:${SO}">${ESC(it.film||'')}</p></div>
    <div style="border-left:1px solid #cfc8b8;padding:12px 8px 0;text-align:right">${lab(ESC(gs[i]?gs[i].tab:''),OR)}<div style="${C};font-size:14px;font-weight:700;line-height:1.2;color:${TQ};margin-top:4px;letter-spacing:.04em">${r[1]}</div><div style="${C};font-size:15px;font-weight:600;line-height:1.2;color:${SO};margin-top:3px">${r[2]}</div></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(170deg,#f39b4b 0%,#e0612a 38%,#7a2f52 78%,#2c1d3d);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:120px;background:repeating-linear-gradient(90deg,#00000022 0 3px,#0000 3px 70px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:${PA};box-shadow:0 12px 26px #0009;box-sizing:border-box;padding:14px 20px 10px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid ${IN};padding-bottom:6px">
      <div>${lab('Harry Zimm Productions / Call sheet',OR)}<div style="${A};font-size:38px;line-height:1;color:${IN};margin-top:4px">MR. LOVEJOY</div></div>
      <div style="text-align:right;${C};font-size:15px;font-weight:600;line-height:1.3;color:${IN}">DAY 1 OF 1<br>CREW CALL: SUPPERTIME</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;${C};font-size:15px;font-weight:600;line-height:1.3;color:${IN};padding:6px 0;border-bottom:1px solid ${IN}"><span>PRODUCER: H. Zimm</span><span>STARRING: M. Weir</span><span style="text-align:right">PICTURE CAR: Minivan</span></div>
    <div style="display:grid;grid-template-columns:44px 1fr 118px;border-bottom:2px solid ${IN};padding:6px 0 4px">${lab('Sc','','text-align:center')}${lab('What’s on the plate','','padding-left:12px')}${lab('Set / cast','','text-align:right;padding-right:8px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',OR,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${C};font-size:12px;font-weight:600;letter-spacing:.06em;color:${SO};margin-top:5px">NO SCRIPT CHANGES WITHOUT CHILI. NOBODY TOUCHES THE LEATHER JACKET.</div>
  </div>
  <header style="position:absolute;left:692px;top:22px;width:356px">
    ${lab('Miami / Hollywood / 1995','#fff1d8')}
    <h1 style="${A};font-size:62px;line-height:.92;margin:6px 0 0;color:#fff7e6;text-shadow:none">Get<br>Shorty</h1>
    <div style="${B};font-size:15px;font-style:italic;line-height:1.35;color:#fff1d8;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:692px;top:212px;width:356px;margin:0;background:${PA};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #0009;transform:rotate(1deg)">${img('pitch','Chili Palmer and Harry Zimm talking movies',342,190)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Chili came to collect a debt. He stayed to make a movie.</figcaption></figure>
  <div style="position:absolute;left:692px;top:478px;width:356px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:${PA};padding:6px;box-shadow:0 10px 22px #0009;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,136,204)}</div>
    <div style="flex:1;min-width:0;margin-top:4px">
      <div style="background:${IN};padding:9px 10px 10px;box-shadow:0 8px 16px #0009">
        <div style="height:16px;display:flex;gap:10px;overflow:hidden;margin-bottom:8px">${'<i style="flex:none;width:12px;height:16px;background:#fff;transform:skewX(-35deg)"></i>'.repeat(12)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;${C};font-size:14px;font-weight:600;line-height:1.2;color:#fff">
          <span style="color:${YE}">ROLL</span><span style="color:${YE}">TAKE</span><span>A</span><span>1</span>
          <span style="color:${YE};grid-column:1/3">DIRECTOR</span><span style="grid-column:1/3">Chili Palmer, probably</span>
        </div>
      </div>
      <div style="${C};font-size:17px;font-weight:700;line-height:1.15;color:#fff7e6;margin-top:10px">The minivan is double-parked. Locker key in the glovebox.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${B};font-size:9px;color:#e9d6e6">FILM IMAGERY: TMDB</div>
  </div>`;
}
