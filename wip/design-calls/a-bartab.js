const logo=[...el.querySelectorAll('img')].find(i=>/\/w500\/.*\.(png|svg)$/.test(i.getAttribute('src')||''));
if(!logo)return 'no logo';
let pl=logo.parentElement;while(pl&&pl!==el&&!(getComputedStyle(pl).boxShadow!=='none'||/rgb/.test(getComputedStyle(pl).backgroundColor)&&getComputedStyle(pl).backgroundColor!=='rgba(0, 0, 0, 0)'))pl=pl.parentElement;
const fs=getComputedStyle(pl);pl.innerHTML=`<div style="font:700 30px/1 'Barlow Condensed','Oswald',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;white-space:nowrap">Now showing &middot; ${f.year}</div>`;pl.style.background='#0e0e0e';return 'ok'
