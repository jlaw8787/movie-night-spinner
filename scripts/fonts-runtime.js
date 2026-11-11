/* Local fonts. Menus used to point a <link> at fonts.googleapis.com/css2?<query>. They now call
   rdFontHref(query, display) with the same query and get back the address of a small stylesheet built here,
   holding the same @font-face rules Google sent, pointed at assets/fonts/files/. Nothing downloads until a
   menu actually draws text in a face, the same as before. This part is copied in by scripts/fetch-fonts.cjs
   from scripts/fonts-runtime.js. */
(function(){
  const D=window.RD_FONTS,me=document.currentScript&&document.currentScript.src;
  const base=new URL("files/",me||new URL("assets/fonts/",document.baseURI)).href;
  const memo=new Map(),back=new Map();
  const norm=s=>{try{return decodeURIComponent(s.replace(/\+/g," ")).trim()}catch(e){return s.replace(/\+/g," ").trim()}};
  /* a spec the download script never saw: use the same cut of that family from another spec, so the menu still gets it */
  function guess(spec){
    const [fam,ax]=spec.split(":"),opsz=/opsz/.test(ax||"");let want=[["normal","400"]];
    if(ax){const [names,vals]=ax.split("@"),a=names.split(",");
      want=vals.split(";").map(v=>{const p=v.split(","),g=n=>a.indexOf(n)<0?null:p[a.indexOf(n)];return [g("ital")==="1"?"italic":"normal",(g("wght")||"400").replace("..", " ")]})}
    const rows=[],pool=Object.keys(D.specs).filter(k=>k.split(":")[0]===fam).sort((x,y)=>(/opsz/.test(x)===opsz?0:1)-(/opsz/.test(y)===opsz?0:1));
    for(const [st,w] of want){let hit=null;for(const k of pool){hit=D.specs[k].filter(r=>r[1]===st&&r[2]===w);if(hit.length)break;hit=null}
      if(hit)rows.push(...hit);else if(window.console)console.warn("No local font for",fam,st,w)}
    return rows}
  function css(q,display){
    const out=[];
    q.split("&").filter(p=>p.startsWith("family=")).forEach(p=>{const spec=norm(p.slice(7));
      (D.specs[spec]||guess(spec)).forEach(([fam,st,w,sx,fi,ri])=>out.push(
        `@font-face{font-family:'${fam}';font-style:${st};font-weight:${w};${sx?"font-stretch:"+sx+";":""}font-display:${display};src:url(${base}${D.files[fi]}) format('woff2');${ri>=0?"unicode-range:"+D.ranges[ri]+";":""}}`))});
    return out.join("\n")}
  /* the same query and display always give back the same address, so a menu can find its own <link> again */
  window.rdFontHref=function(query,display){
    const q=String(query||"").replace(/^.*?css2\?/,"").split("&").filter(p=>p&&!/^display=/.test(p)).join("&"),d=display||"swap",k=q+"|"+d;
    if(!memo.has(k)){const u=URL.createObjectURL(new Blob([css(q,d)],{type:"text/css"}));memo.set(k,u);back.set(u,q)}
    return memo.get(k)};
  /* the query behind an address rdFontHref gave out, for code that reads the font list back off a <link> */
  window.rdFontQuery=href=>back.get(href)||href||"";
})();
