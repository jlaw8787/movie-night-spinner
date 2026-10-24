function fmtLastTrain(f,spec,menu,poster){
  const WH='#f7f6f1',BK='#151515',SO='#4d4d4d',GO='#c79a2e',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.25;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const bul=[['#ee352e','2'],['#00933c','4'],['#0039a6','A'],['#ff6319','F'],['#fccc0a','N']];
  const bullet=(c,t,sz=40)=>`<span style="flex:none;width:${sz}px;height:${sz}px;border-radius:50%;background:${c};display:inline-grid;place-items:center;${B};font-weight:700;font-size:${Math.round(sz*.55)}px;line-height:1;color:${c==='#fccc0a'?BK:'#fff'}">${t}</span>`;
  const row=(it,i)=>{const b=bul[i]||bul[0];return `<div style="display:flex;gap:16px;align-items:flex-start;padding:17px 0 16px;border-top:1px solid #d3d1c8">
    ${bullet(b[0],b[1])}
    <div style="flex:1"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h3 style="${B};font-size:21px;line-height:1.1;font-weight:700;margin:0;color:${BK};letter-spacing:-.01em">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].h:''),SO,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.4;margin:4px 0 0;color:${BK}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:#8a2a1f">${ESC(it.film||'')}</p></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#d9d6cb;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background-image:linear-gradient(90deg,#b9b5a8 1px,#0000 1px),linear-gradient(180deg,#b9b5a8 1px,#0000 1px);background-size:44px 22px"></div>
  <div aria-hidden="true" style="position:absolute;left:0;right:0;top:302px;height:46px;background:#6b3b2a;border-top:6px solid #c79a2e;border-bottom:6px solid #c79a2e"></div>
  <div aria-hidden="true" style="position:absolute;left:684px;right:0;top:312px;${C};font-size:26px;font-weight:700;letter-spacing:.18em;color:#f1dfae;line-height:26px">TOKEN BOOTH  ·  14 ST</div>
  <div style="position:absolute;left:24px;top:18px;width:632px;height:706px;background:${WH};box-shadow:0 10px 24px #0006;box-sizing:border-box;display:flex;flex-direction:column">
    <div style="background:${BK};color:#fff;padding:14px 24px 12px;display:flex;justify-content:space-between;align-items:flex-end">
      <div><div style="${B};font-size:12px;font-weight:700;letter-spacing:.14em;color:#bbb">LATE NIGHTS / ALL STATIONS</div><div style="${B};font-size:42px;font-weight:700;line-height:1;letter-spacing:-.02em;margin-top:4px">Service Notice</div></div>
      <div style="display:flex;gap:6px">${bul.map(b=>bullet(b[0],b[1],30)).join('')}</div>
    </div>
    <div style="padding:12px 24px 0;display:flex;flex-direction:column;flex:1">
      <div style="${B};font-size:17px;line-height:1.3;color:${BK};padding-bottom:10px"><b>Two brothers. One last train.</b><br>Supper after the shift. Every course costs one token.</div>
      ${xs.map(row).join('')}
      ${FX_SP}
      <div style="display:flex;gap:12px;align-items:baseline;border-top:3px solid ${BK};padding:9px 0 14px">${lab('Showtime cue','#8a2a1f','white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${BK}">${ESC(fmtCue(f))}</span></div>
    </div>
  </div>
  <figure style="position:absolute;left:684px;top:24px;width:364px;margin:0;background:${BK};padding:8px;box-sizing:border-box;box-shadow:0 10px 22px #0007">${img('platform','John and Charlie on the subway platform',348,214)}<figcaption style="${B};font-size:13px;line-height:1.35;color:#eee;margin-top:8px">Two transit cops, one platform, the last train out.</figcaption></figure>
  <div style="position:absolute;left:684px;top:378px;width:364px;height:240px;display:flex;gap:16px;align-items:stretch">
    <div style="flex:none;align-self:flex-start;background:${BK};padding:6px;box-shadow:0 10px 22px #0007">${fmtPosterImg(f,poster,152,228)}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px;height:240px">
      <div style="background:${WH};padding:12px 12px 10px;box-shadow:0 6px 14px #0005">
        <h1 style="${C};font-size:44px;line-height:.86;font-weight:700;text-transform:uppercase;margin:0;color:${BK};text-shadow:none">Money<br>Train</h1>
        <div style="${B};font-size:13px;line-height:1.35;color:${SO};margin-top:6px">Last train of the night.<br>Transit Police, 1995.</div>
      </div>
      <div style="flex:1;background:#2a2a2a;padding:10px 12px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 14px #0005">
        <div style="flex:none;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f3d88a,${GO} 60%,#8c6a1c);display:grid;place-items:center;box-shadow:0 3px 6px #0008"><div style="width:20px;height:20px;background:#2a2a2a;transform:rotate(45deg)"></div></div>
        <div><div style="${C};font-size:24px;font-weight:700;color:#f1dfae;line-height:1">FARE $1.50</div><div style="${B};font-size:13px;line-height:1.35;color:#ccc;margin-top:4px">No jumping the turnstile.</div></div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:684px;top:640px;width:364px;box-sizing:border-box;background:${BK};padding:9px 14px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 6px 14px #0005;border-left:6px solid ${GO}"><div><div style="${B};font-size:11px;font-weight:700;letter-spacing:.1em;color:#bbb">NEXT TRAIN</div><div style="${C};font-size:26px;font-weight:700;color:#f1dfae;line-height:1;margin-top:2px">MONEY TRAIN</div></div><div style="${T};font-size:13px;font-weight:700;color:#ee352e;text-align:right;line-height:1.3">NOT IN SERVICE<br>DO NOT BOARD</div></div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#444">FILM IMAGERY: TMDB</div>
  </div>`;
}
