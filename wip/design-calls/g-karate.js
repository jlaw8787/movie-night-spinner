const a=find('Snacks'),b=find('Cold Drinks'),box=lca(a,b);const cue=find('SHOWTIME CUE');const items=[...box.querySelectorAll('*')].filter(vis);
const last=items.reduce((m,e)=>e.getBoundingClientRect().bottom>m.getBoundingClientRect().bottom?e:m,items[0]);
const nt=find('FRESH EVERY MORNING');return 'k '+grow(box,last,Math.min(cue.getBoundingClientRect().top,nt.getBoundingClientRect().top)-24)
