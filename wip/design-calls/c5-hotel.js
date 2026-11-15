const lp=el.querySelector('[data-lpanel]');if(!lp)return 'no panel';lp.style.display='none';
const k=[...el.querySelectorAll('div')].find(d=>d.textContent.trim().toLowerCase()==='from the front desk'&&d.children.length===0);
const box=k.closest('[data-fbox]');box.style.top='1004px';box.style.height='322px';
const n=document.createElement('div');n.textContent='In your suite, '+f.year;n.style.cssText=getComputedStyle(k).cssText;
n.style.cssText=`font:${getComputedStyle(k).font};letter-spacing:${getComputedStyle(k).letterSpacing};text-transform:uppercase;color:${getComputedStyle(k).color};opacity:.75;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid ${getComputedStyle(k).color}`;
box.insertBefore(n,box.firstChild);return 'ok'
