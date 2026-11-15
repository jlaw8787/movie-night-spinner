const ft=findIn('Meals subject');const hd=find('TO BEGIN')||find('To begin');const col=hd?getComputedStyle(hd).color:'#1a7ac0';
ft.insertAdjacentHTML('afterbegin',`<b style="color:${col};letter-spacing:.08em;text-transform:uppercase">Cabin crew cue:</b> <span style="color:#1d2a36">${cue}</span><br>`);return 'ok'
