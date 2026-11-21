const a=find('TO BEGIN'),b=find('FROM THE CELLAR');const box=lca(a,b);box.querySelectorAll('*').forEach(n=>{n.style.whiteSpace='normal';n.style.overflow='visible'});const w=find('The whole feast');
const items=[...box.querySelectorAll('*')].filter(vis);const last=items.reduce((m,e)=>e.getBoundingClientRect().bottom>m.getBoundingClientRect().bottom?e:m,items[0]);
return 'k '+grow(box,last,w.getBoundingClientRect().top-30)
