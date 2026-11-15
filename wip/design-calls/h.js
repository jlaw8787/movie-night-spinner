const own=e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
const find=t=>[...el.querySelectorAll('*')].find(e=>own(e).toUpperCase()===t.toUpperCase());
const findIn=t=>[...el.querySelectorAll('*')].find(e=>own(e).toUpperCase().startsWith(t.toUpperCase()));
const add=(html)=>{const d=document.createElement('div');d.innerHTML=html;const n=d.firstElementChild;el.appendChild(n);return n};
const cue=CUE;
