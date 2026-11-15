const logo=[...el.querySelectorAll('img')].find(i=>/\/w500\/.*\.(png|svg)$/.test(i.getAttribute('src')||''));
let pl=logo.parentElement;const er=el.getBoundingClientRect();const lt=pl.getBoundingClientRect().top-er.top;pl.style.display='none';
const leaf=t=>[...el.querySelectorAll('*')].find(d=>d.children.length===0&&d.textContent.trim().toLowerCase()===t);
const wrap=(()=>{let e=leaf('keep this');while(getComputedStyle(e).position!=='absolute')e=e.parentElement;return e})();
let pass=leaf('keep this');while(pass.parentElement!==wrap)pass=pass.parentElement;
const pr=pass.getBoundingClientRect();const w=pr.width;
el.appendChild(pass);pass.style.position='absolute';pass.style.left='28px';pass.style.top=lt+'px';pass.style.width=w+'px';pass.style.margin='0';
return 'ok '+lt
