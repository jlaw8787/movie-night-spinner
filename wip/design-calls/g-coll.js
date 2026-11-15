const a=find('Starters'),b=find('Drinks');let box=lca(a,b);box.style.justifyContent='flex-start';[...box.children].forEach(c=>{c.style.flex='none'});
const h=find('HEARD IN THE BACK SEAT');const items=[...box.querySelectorAll('*')].filter(vis);const last=items.reduce((m,e)=>e.getBoundingClientRect().bottom>m.getBoundingClientRect().bottom?e:m,items[0]);
const lim=h.getBoundingClientRect().top-24;return 'k '+grow(box,last,lim)+' gs '+getComputedStyle(box).display+' '+box.children.length
