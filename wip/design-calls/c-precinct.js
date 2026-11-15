const lab=find('ON FILE');const row=lab.parentElement;const c=row.cloneNode(true);
const kids=[...c.children];kids[0].textContent='SHOWTIME';kids[kids.length-1].textContent=cue;row.after(c);return row.children.length+' '+row.outerHTML.slice(0,200)
