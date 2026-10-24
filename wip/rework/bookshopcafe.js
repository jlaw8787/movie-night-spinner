function fmtBookshopCafe(f,spec,menu,poster){
  const G='#29523a',P='#fbf8f0',D='#1f2a24',R='#984729',M='#5b5f55',B="font-family:'Libre Franklin',sans-serif",H="font-family:'Cormorant Garamond',serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  let n=0;
  const course=spec.groups.map(g=>{const its=g.items.map(()=>all[n++]);return `<div style="margin-top:12px">
    <div style="${T};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${R}">&gt; ${ESC(g.tab)} / ${ESC(g.h)}</div>
    ${its.map(it=>`<div style="margin-top:6px"><div style="${T};font-size:20px;line-height:1.2;font-weight:700;color:${D}">${ESC(it.label)}</div><div style="${T};font-size:14px;line-height:1.4;color:${D};margin-top:3px">${ESC(it.desc)}</div>${it.film?`<div style="${T};font-size:13px;line-height:1.35;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`).join('')}</div>`}).join('');
  const hdr=(k,v)=>`<div style="display:flex;gap:10px;${T};font-size:14px;line-height:1.5;color:${D}"><span style="width:76px;font-weight:700">${k}</span><span>${v}</span></div>`;
  const email=`<section aria-label="Printed email menu" style="${at(30,24,632,`height:694px;background:${P};box-shadow:4px 7px 16px rgba(0,0,0,.4);transform:rotate(-.5deg);padding:18px 34px 0 34px;box-sizing:border-box`)}">
    <div style="display:flex;justify-content:space-between;${T};font-size:10px;letter-spacing:.04em;color:${M};border-bottom:1px solid #cfc8b6;padding-bottom:6px"><span>MAIL READ / PRINTED 10:42 PM</span><span>PAGE 1 OF 1</span></div>
    <div style="margin-top:10px">${hdr('Subject:','Re: Supper on the Upper West Side')}${hdr('From:','NY152')}${hdr('To:','Shopgirl')}</div>
    <div style="border-top:2px dashed #b9b29e;margin-top:10px;padding-top:10px;${T};font-size:14px;line-height:1.45;color:${D}">Dear friend, ${ESC((spec.tag||'').replace(/^A /,'a '))} Here is what I would bring to the table.</div>
    ${course}
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:12px;${T};line-height:1.4"><span style="font-size:14px;color:${D}">Until then, <b>NY152</b></span><span style="font-size:13px;font-style:italic;color:${R}">P.S. Sharpened pencils to follow.</span></div>
  </section>`;
  const right=`<div style="${at(690,26,352,'height:690px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fffcf3;padding:6px;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(1deg)">${img('identity','You’ve Got Mail film artwork with Kathleen and Joe',340,190,'left center')}</figure>
    <figure style="margin:18px 0 0;background:#fffcf3;padding:6px 6px 0;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(-1deg)">${img('corner','The Shop Around the Corner storefront in You’ve Got Mail',340,212)}<figcaption style="${T};font-size:11px;line-height:1.3;color:${D};padding:7px 2px 8px">The Shop Around the Corner, West 69th St.</figcaption></figure>
    <div style="margin-top:18px;background:#e9dcbc;padding:14px 18px;box-sizing:border-box;box-shadow:0 4px 9px rgba(0,0,0,.3);flex:1;display:flex;flex-direction:column;justify-content:center">
      <div style="${T};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${R}">Café cue</div>
      <div style="${H};font-size:24px;line-height:1.15;font-weight:600;color:${D};margin-top:5px">${ESC(fmtCue(f))}</div>
      <div style="${B};font-size:13px;line-height:1.4;color:${M};margin-top:8px">${ESC(spec.brand||'')}. Table for two. Look for the red rose tucked in Pride and Prejudice.</div>
    </div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#c9d5c7;margin-top:9px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${G};overflow:hidden;box-shadow:0 18px 45px #0006">
    <div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid rgba(233,220,188,.25)"></div>${email}${right}</div>`;
}
