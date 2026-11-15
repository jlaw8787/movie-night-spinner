const logo=[...el.querySelectorAll('img')].find(i=>/\/w500\/.*\.(png|svg)$/.test(i.getAttribute('src')||''));
if(!logo)return 'no logo';
let pl=logo.parentElement;while(pl&&pl!==el&&!(getComputedStyle(pl).boxShadow!=='none'||/rgb/.test(getComputedStyle(pl).backgroundColor)&&getComputedStyle(pl).backgroundColor!=='rgba(0, 0, 0, 0)'))pl=pl.parentElement;
