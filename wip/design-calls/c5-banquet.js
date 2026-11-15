const lp=el.querySelector('[data-lpanel]');if(!lp)return 'no panel';lp.style.display='none';
const col=lp.parentElement;const sign=col.children[1];sign.style.height='auto';sign.style.paddingTop='4px';
const kids=[...col.children];const toasts=kids[2];toasts.style.fontSize='24px';
const k=document.createElement('div');k.textContent='Now showing, '+f.year;const g=getComputedStyle(toasts.firstElementChild);
k.style.cssText=`flex:none;text-align:center;font:${g.font};letter-spacing:${g.letterSpacing};text-transform:uppercase;color:${g.color};border-bottom:1px solid ${getComputedStyle(toasts).borderTopColor};padding-bottom:12px`;
col.insertBefore(k,col.firstChild);return 'ok'
