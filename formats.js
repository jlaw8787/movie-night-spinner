/* Era menus: one printed menu per film, from the film's own world. Loaded before app.js. */
/* ================= ERA FORMATS: printed menus from the film's own world =================
   A film listed in FMT_FILMS gets its own landscape A4 menu (trifold or bifold look),
   plus a phone view with big type. Every other film keeps the lobby card until its format is signed off. */
const FMT_FONTS={
  "latenightcall":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "bookshopcafe":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "dorothysupper":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@400;500;600;700",
  "gershwinfolio":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "annietable":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "orangefutures":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "getawaysupper":"family=Bevan&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "spenditall":"family=Cormorant+Garamond:wght@400;500;600&family=Libre+Franklin:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700",
  "mailroomexecutive":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "powerlunch":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "loftsupper":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "oceansupper":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "toystore":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;500;600;700",
  "bowerybelow":"family=Barlow+Condensed:wght@600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "eventually":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "unplanned":"family=Cormorant+Garamond:wght@400;500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "sullivansupper":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "sixteen":"family=Barlow+Condensed:wght@600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "messenger":"family=Alfa+Slab+One&family=Barlow+Condensed:wght@400;500;600;700",
  "sohoaftermidnight":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "lasttrain":"family=Barlow+Condensed:wght@600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "negotiation":"family=Barlow+Condensed:wght@400;500;600;700&family=Libre+Franklin:wght@400;500;600;700",
  "leon":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "cityrun":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "rooftop":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@400;500;600;700",
  "plazanight":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "escape":"family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "shift":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "acrossglass":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "serpico":"family=Alfa+Slab+One&family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400",
  "brooklyn":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "southbound":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "nightshift":"family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "suite":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@400;600;700",
  "maytable":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "pizzatime":"family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "ooze":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "moodslime":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "perdition":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "southie":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "boatdrinks":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "fever":"family=Alfa+Slab+One&family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400",
  "cornerside":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "carmine":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "shorty":"family=Alfa+Slab+One&family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400",
  "flamingo":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@400;600;700",
  "highhat":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "village":"family=Barlow+Condensed:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400",
  "collection":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Bevan&family=Libre+Franklin:wght@400;600;700",
  "sobelsupper":"family=Cormorant+Garamond:wght@500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "prizzis":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "miami":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "afterhours":"family=Barlow+Condensed:wght@400;600;700&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "leftys":"family=Barlow+Condensed:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "paraiso":"family=Bevan&family=Barlow+Condensed:wght@400;500;600;700",
  "delancey":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "palermo":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "tangiers":"family=Cormorant+Garamond:wght@400;500;600&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "bippy":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "corleone2":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "maitland":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "roadtrip":"family=Bevan&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "corleone":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "chocolaterie":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:wght@400;600;700",
  "kitchenfolio":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "moonlit":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "gimbels":"family=Cormorant+Garamond:wght@400;600&family=Bevan&family=Libre+Franklin:wght@400;600;700",
  "lair":"family=Bevan&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "tonys":"family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400",
  "whistle":"family=Bevan&family=Libre+Franklin:wght@400;600;700",
  "sals":"family=Bevan&family=Libre+Franklin:wght@400;600;700&family=Barlow+Condensed:wght@400;600;700",
  "mcdowells":"family=Bevan&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  "coney":"family=Alfa+Slab+One&family=Barlow+Condensed:wght@400;500;600;700",
  "nakatomi":"family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Libre+Franklin:wght@400;600;700&family=Courier+Prime:wght@400;700",
  "jurassic":"family=Bevan&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  newsroom:"family=Bevan&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;1,400&family=Courier+Prime:wght@400;700",
  market:"family=Anton&family=Mr+Dafoe&family=Permanent+Marker&family=Caveat+Brush&family=Barlow:wght@500;600",
  takeaway:"family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,600..900,100,0;1,9..144,600..900,100,0&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Noto+Serif+TC:wght@900",
  diner:"family=Yellowtail&family=Alfa+Slab+One&family=Arvo:ital,wght@0,400;0,700;1,400&family=Kalam:wght@400",
  workorder:"family=Oswald:wght@500;700&family=Archivo+Narrow:wght@500;700&family=Caveat:wght@500;700",
  lanes:"family=Righteous&family=Reenie+Beanie&family=Barlow+Condensed:wght@500;700&family=Barlow:ital,wght@0,500;0,600;1,500",
  slims:"family=Sacramento&family=Archivo+Black&family=Josefin+Sans:ital,wght@0,400;0,600;0,700;1,400",
  noodle:"family=LXGW+WenKai+TC:wght@400;700&family=Marcellus+SC&family=Alegreya:ital,wght@0,400;0,700;1,400",
  carte:"family=Pinyon+Script&family=Cormorant+SC:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500",
  feast:"family=Italianno&family=Bodoni+Moda:ital,wght@0,500;0,700;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400",
  truck:"family=Fredericka+the+Great&family=Amatic+SC:wght@700&family=Patrick+Hand&family=Bungee",
  check:"family=Archivo+Narrow:wght@400;700&family=Homemade+Apple&family=Libre+Franklin:ital,wght@0,400;0,700;1,400&family=DM+Serif+Display",
  nero:"family=Shrikhand&family=Bevan&family=Libre+Franklin:ital,wght@0,400;0,700;0,800;1,400&family=Permanent+Marker&family=Courier+Prime:wght@400;700",
  lous:"family=Damion&family=Oswald:wght@400;500;700&family=Cutive+Mono&family=Covered+By+Your+Grace&family=Archivo:wght@400;700",
  pad:"family=Covered+By+Your+Grace&family=Rock+Salt&family=Courier+Prime:wght@400;700&family=Bodoni+Moda:wght@500;700",
  casefile:"family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Big+Shoulders+Display:wght@700;900&family=Big+Shoulders+Stencil+Display:wght@800"
};
const FMT_FAMS={
  "latenightcall":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "bookshopcafe":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "dorothysupper":["Cormorant Garamond","Libre Franklin"],
  "gershwinfolio":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "annietable":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "orangefutures":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "getawaysupper":["Bevan","Libre Franklin","Courier Prime"],
  "spenditall":["Cormorant Garamond","Libre Franklin","Barlow Condensed"],
  "mailroomexecutive":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "powerlunch":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "loftsupper":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "oceansupper":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "toystore":["Barlow Condensed","Libre Franklin"],
  "bowerybelow":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "eventually":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "unplanned":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "sullivansupper":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "sixteen":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "messenger":["Alfa Slab One","Barlow Condensed"],
  "sohoaftermidnight":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "lasttrain":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "negotiation":["Barlow Condensed","Libre Franklin"],
  "leon":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "cityrun":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "rooftop":["Cormorant Garamond","Libre Franklin"],
  "plazanight":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "escape":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "shift":["Bevan","Barlow Condensed"],
  "acrossglass":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "serpico":["Alfa Slab One","Barlow Condensed","Libre Franklin"],
  "brooklyn":["Bevan","Barlow Condensed"],
  "southbound":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "nightshift":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "suite":["Cormorant Garamond","Libre Franklin"],
  "maytable":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "pizzatime":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "ooze":["Bevan","Barlow Condensed"],
  "moodslime":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "perdition":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "southie":["Bevan","Barlow Condensed"],
  "boatdrinks":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "fever":["Alfa Slab One","Barlow Condensed","Libre Franklin"],
  "cornerside":["Bevan","Barlow Condensed"],
  "carmine":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "shorty":["Alfa Slab One","Barlow Condensed","Libre Franklin"],
  "flamingo":["Cormorant Garamond","Libre Franklin"],
  "highhat":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "village":["Barlow Condensed","Cormorant Garamond","Libre Franklin"],
  "collection":["Cormorant Garamond","Bevan","Libre Franklin"],
  "sobelsupper":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "prizzis":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "miami":["Bevan","Barlow Condensed"],
  "afterhours":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "leftys":["Barlow Condensed","Libre Franklin","Courier Prime"],
  "paraiso":["Bevan","Barlow Condensed"],
  "delancey":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "palermo":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "tangiers":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "bippy":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "corleone2":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "maitland":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "roadtrip":["Bevan","Libre Franklin","Courier Prime"],
  "corleone":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "chocolaterie":["Cormorant Garamond","Libre Franklin"],
  "kitchenfolio":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "moonlit":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "gimbels":["Cormorant Garamond","Bevan","Libre Franklin"],
  "lair":["Bevan","Libre Franklin","Courier Prime"],
  "tonys":["Cormorant Garamond","Libre Franklin"],
  "whistle":["Bevan","Libre Franklin"],
  "sals":["Bevan","Libre Franklin","Barlow Condensed"],
  "mcdowells":["Bevan","Libre Franklin","Courier Prime"],
  "coney":["Alfa Slab One","Barlow Condensed"],
  "nakatomi":["Cormorant Garamond","Libre Franklin","Courier Prime"],
  "jurassic":["Bevan","Libre Franklin","Courier Prime"],newsroom:["Bevan","Libre Franklin","Courier Prime"],carte:["Pinyon Script","Cormorant SC","Cormorant Garamond"],feast:["Italianno","Bodoni Moda","Libre Baskerville"],truck:["Fredericka the Great","Amatic SC","Patrick Hand","Bungee"],check:["Archivo Narrow","Homemade Apple","Libre Franklin","DM Serif Display"],nero:["Shrikhand","Bevan","Libre Franklin","Permanent Marker","Courier Prime"],lous:["Damion","Oswald","Cutive Mono","Covered By Your Grace","Archivo"],pad:["Covered By Your Grace","Courier Prime"],market:["Anton","Mr Dafoe","Permanent Marker","Caveat Brush","Barlow"],takeaway:["Fraunces","Libre Caslon Text","Noto Serif TC"],diner:["Yellowtail","Alfa Slab One","Arvo","Kalam"],workorder:["Oswald","Archivo Narrow","Caveat"],lanes:["Righteous","Reenie Beanie","Barlow Condensed","Barlow"],slims:["Sacramento","Archivo Black","Josefin Sans"],noodle:["LXGW WenKai TC","Marcellus SC","Alegreya"],casefile:["Special Elite","Courier Prime","Big Shoulders Display","Big Shoulders Stencil Display"]};

/* phone palette per format */
const FMT_PHONE={
  "latenightcall":{"top":"#172c43","topInk":"#eee7d9","paper":"#eee7d9","ink":"#172c43","soft":"#475963","accent":"#77505c","tab":"#eee7d9","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "bookshopcafe":{"top":"#29523a","topInk":"#f6eddb","paper":"#f6eddb","ink":"#23382c","soft":"#5d6253","accent":"#984729","tab":"#f6eddb","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "dorothysupper":{"top":"#8e273b","topInk":"#fff3e4","paper":"#fff3e4","ink":"#39282c","soft":"#69565a","accent":"#8e273b","tab":"#fff3e4","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "gershwinfolio":{"top":"#202020","topInk":"#f6f3eb","paper":"#f6f3eb","ink":"#202020","soft":"#5c5b58","accent":"#8b363b","tab":"#f6f3eb","disp":"'Libre Franklin',sans-serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Libre Franklin',sans-serif","note":"'Libre Franklin',sans-serif"},
  "annietable":{"top":"#453b2b","topInk":"#f8eedb","paper":"#f8eedb","ink":"#3b3227","soft":"#685947","accent":"#954d30","tab":"#f5d09a","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "orangefutures":{"top":"#193d30","topInk":"#f1e7ce","paper":"#f1e7ce","ink":"#193d30","soft":"#435143","accent":"#78502d","tab":"#f1e7ce","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "getawaysupper":{"top":"#25241f","topInk":"#f4e4b8","paper":"#f4e4b8","ink":"#25241f","soft":"#615843","accent":"#a93d25","tab":"#f4e4b8","disp":"'Bevan',serif","name":"'Bevan',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "spenditall":{"top":"#173c32","topInk":"#fff3d7","paper":"#fff3d7","ink":"#173c32","soft":"#586459","accent":"#7d4f24","tab":"#ead294","disp":"'Barlow Condensed',sans-serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "mailroomexecutive":{"top":"#173f43","topInk":"#f5ecd9","paper":"#f5ecd9","ink":"#173f43","soft":"#58605b","accent":"#1b6066","tab":"#f4d7a1","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "powerlunch":{"top":"#472d45","topInk":"#fbf3e8","paper":"#fbf3e8","ink":"#352635","soft":"#66545e","accent":"#81445d","tab":"#f1c0a7","disp":"'Libre Franklin',sans-serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Libre Franklin',sans-serif","note":"'Libre Franklin',sans-serif"},
  "loftsupper":{"top":"#203c50","topInk":"#f4eee2","paper":"#f4eee2","ink":"#203c50","soft":"#52606a","accent":"#88606a","tab":"#f4eee2","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "oceansupper":{"top":"#123e48","topInk":"#fff3db","paper":"#fff3db","ink":"#123e48","soft":"#536b6d","accent":"#94582d","tab":"#fff3db","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "toystore":{"top":"#a9232b","topInk":"#fff5df","paper":"#fff5df","ink":"#20282e","soft":"#66655d","accent":"#a9232b","tab":"#fff5df","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "bowerybelow":{"top":"#162329","topInk":"#f0ead9","paper":"#f0ead9","ink":"#162329","soft":"#66685d","accent":"#526940","tab":"#d5e99f","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "eventually":{"top":"#173e49","topInk":"#f4ead5","paper":"#f4ead5","ink":"#173e49","soft":"#655f51","accent":"#a7442d","tab":"#efbf53","disp":"'Libre Franklin',sans-serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Libre Franklin',sans-serif","note":"'Libre Franklin',sans-serif"},
  "unplanned":{"top":"#263a3e","topInk":"#eee9de","paper":"#eee9de","ink":"#263a3e","soft":"#6e5543","accent":"#9e503c","tab":"#dfcbb0","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "sullivansupper":{"top":"#0c222e","topInk":"#eee8d7","paper":"#eee8d7","ink":"#0c222e","soft":"#52656b","accent":"#984725","tab":"#dfb878","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "sixteen":{"top":"#243e42","topInk":"#faf0d9","paper":"#f1ecdf","ink":"#243e42","soft":"#676c64","accent":"#9c482e","tab":"#f3ce95","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "messenger":{"top":"#28322d","topInk":"#f0ebd9","paper":"#f0ebd9","ink":"#28322d","soft":"#616b5a","accent":"#675f26","tab":"#e1e472","disp":"'Alfa Slab One',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Alfa Slab One',serif","note":"'Barlow Condensed',sans-serif"},
  "sohoaftermidnight":{"top":"#101f29","topInk":"#eee7d7","paper":"#eee7d7","ink":"#101f29","soft":"#59646a","accent":"#af492f","tab":"#e8d883","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "lasttrain":{"top":"#202726","topInk":"#fff1da","paper":"#f2e9d5","ink":"#202726","soft":"#69675d","accent":"#a3461f","tab":"#f7ac5e","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "negotiation":{"top":"#222826","topInk":"#f0e8d9","paper":"#f0e8d9","ink":"#222826","soft":"#65685f","accent":"#795b2c","tab":"#dec793","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "leon":{"top":"#29483b","topInk":"#f0e8d5","paper":"#f0e8d5","ink":"#354034","soft":"#6c6e5c","accent":"#8c5741","tab":"#e5d4a7","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "cityrun":{"top":"#192c38","topInk":"#eee4ca","paper":"#eee4ca","ink":"#192c38","soft":"#6b716a","accent":"#9d4232","tab":"#e9c15c","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "rooftop":{"top":"#29332e","topInk":"#eee8d8","paper":"#eee8d8","ink":"#29332e","soft":"#62695f","accent":"#785d42","tab":"#e1d4ad","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "plazanight":{"top":"#142535","topInk":"#eee5d2","paper":"#eee5d2","ink":"#142535","soft":"#64717a","accent":"#3c5f78","tab":"#d0af76","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "escape":{"top":"#182b2b","topInk":"#e8dfbf","paper":"#e8dfbf","ink":"#26352e","soft":"#646b59","accent":"#873b2d","tab":"#d6ba72","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "shift":{"top":"#263132","topInk":"#ebe2cc","paper":"#ebe2cc","ink":"#28302d","soft":"#6b675a","accent":"#82513a","tab":"#edd476","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "acrossglass":{"top":"#233644","topInk":"#e9dfc8","paper":"#e9dfc8","ink":"#293a43","soft":"#756b58","accent":"#8f593b","tab":"#e4c37e","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "serpico":{"top":"#364338","topInk":"#eee3c7","paper":"#eee3c7","ink":"#373b2f","soft":"#696c59","accent":"#864a35","tab":"#e8d29c","disp":"'Alfa Slab One',serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Alfa Slab One',serif","note":"'Libre Franklin',sans-serif"},
  "brooklyn":{"top":"#4a2921","topInk":"#f1dab0","paper":"#f0e1c6","ink":"#3d3127","soft":"#786453","accent":"#9c4530","tab":"#f1dab0","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "southbound":{"top":"#25363e","topInk":"#e8dfcb","paper":"#e8dfcb","ink":"#293b45","soft":"#726a59","accent":"#9c623d","tab":"#e7c887","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "nightshift":{"top":"#19201b","topInk":"#e8dfc6","paper":"#e8dfc6","ink":"#343b30","soft":"#686b5a","accent":"#864c32","tab":"#d6bd68","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "suite":{"top":"#254d3c","topInk":"#f4ead7","paper":"#f4ead7","ink":"#304737","soft":"#756b5a","accent":"#254d3c","tab":"#f0dfb0","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "maytable":{"top":"#172c47","topInk":"#eee2cb","paper":"#eee2cb","ink":"#293a4a","soft":"#756b5c","accent":"#a23f37","tab":"#e8c17c","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "pizzatime":{"top":"#142f4b","topInk":"#f3ebd6","paper":"#f3ebd6","ink":"#2f3b3d","soft":"#696c60","accent":"#9d2c32","tab":"#edcf88","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "ooze":{"top":"#25382c","topInk":"#eff0d7","paper":"#eff0d7","ink":"#25382c","soft":"#66705b","accent":"#543854","tab":"#bed44b","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "moodslime":{"top":"#192c39","topInk":"#ede9e2","paper":"#ede9e2","ink":"#283841","soft":"#6b7270","accent":"#b03c72","tab":"#df7faf","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "perdition":{"top":"#263f3b","topInk":"#e6ddc5","paper":"#e6ddc5","ink":"#303c36","soft":"#686b5c","accent":"#765242","tab":"#b7b19a","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "southie":{"top":"#213a48","topInk":"#f0e4ce","paper":"#f0e4ce","ink":"#263d47","soft":"#70685b","accent":"#873b4a","tab":"#beab82","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "boatdrinks":{"top":"#162e32","topInk":"#dce1cf","paper":"#dce1cf","ink":"#24454a","soft":"#657164","accent":"#a44936","tab":"#92afa1","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "fever":{"top":"#121b32","topInk":"#eee7d3","paper":"#eee7d3","ink":"#353b37","soft":"#686b60","accent":"#9c4762","tab":"#e66b9a","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "cornerside":{"top":"#1c1d1b","topInk":"#eee9dc","paper":"#eee9dc","ink":"#242420","soft":"#6a665c","accent":"#8c332f","tab":"#c5b9a3","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "carmine":{"top":"#334b40","topInk":"#f0ecde","paper":"#f0ecde","ink":"#334b40","soft":"#6e715e","accent":"#86584b","tab":"#bec3a7","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "shorty":{"top":"#171b18","topInk":"#eee8d6","paper":"#eee8d6","ink":"#34382d","soft":"#6c6b58","accent":"#db6b2f","tab":"#db6b2f","disp":"'Alfa Slab One',serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Alfa Slab One',serif","note":"'Libre Franklin',sans-serif"},
  "flamingo":{"top":"#75414f","topInk":"#f4e9dc","paper":"#f4e9dc","ink":"#583b3f","soft":"#7c6761","accent":"#a46875","tab":"#f4e9dc","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "highhat":{"top":"#1d2929","topInk":"#e7dec5","paper":"#e7dec5","ink":"#1d2929","soft":"#6e705b","accent":"#607367","tab":"#b49a63","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "village":{"top":"#263f39","topInk":"#e9e2cd","paper":"#e9e2cd","ink":"#34372b","soft":"#6a6958","accent":"#844b38","tab":"#cfba82","disp":"'Barlow Condensed',sans-serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "collection":{"top":"#31465e","topInk":"#f2eadb","paper":"#f2eadb","ink":"#293d50","soft":"#756b60","accent":"#864e48","tab":"#f2eadb","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "sobelsupper":{"top":"#43685b","topInk":"#e9e7d9","paper":"#e9e7d9","ink":"#2c473e","soft":"#6c7061","accent":"#8f4b3c","tab":"#e9e7d9","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "prizzis":{"top":"#6b293c","topInk":"#f0e6d6","paper":"#f0e6d6","ink":"#39312f","soft":"#74625b","accent":"#6b293c","tab":"#f0e6d6","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "miami":{"top":"#191b1a","topInk":"#eee9dd","paper":"#eee9dd","ink":"#242523","soft":"#6f665a","accent":"#a92931","tab":"#d6b194","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "afterhours":{"top":"#240e11","topInk":"#e7dbc1","paper":"#e7dbc1","ink":"#332723","soft":"#75634f","accent":"#9c2929","tab":"#bd9f7b","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "leftys":{"top":"#1c3933","topInk":"#e9e1cb","paper":"#e9e1cb","ink":"#302e25","soft":"#676452","accent":"#773d30","tab":"#c9ac69","disp":"'Barlow Condensed',sans-serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Barlow Condensed',sans-serif","note":"'Libre Franklin',sans-serif"},
  "paraiso":{"top":"#301c2c","topInk":"#e9d2b7","paper":"#e9d2b7","ink":"#3c2633","soft":"#76544e","accent":"#93485d","tab":"#d9ac9d","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Barlow Condensed',sans-serif"},
  "delancey":{"top":"#151919","topInk":"#eee6d4","paper":"#dec7a0","ink":"#433329","soft":"#74634f","accent":"#665039","tab":"#ab9163","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "palermo":{"top":"#172220","topInk":"#eee5cd","paper":"#eee5cd","ink":"#30352d","soft":"#6e6856","accent":"#794635","tab":"#ceb179","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "tangiers":{"top":"#0e302a","topInk":"#f0e4c8","paper":"#f0e4c8","ink":"#19382c","soft":"#70614d","accent":"#6a4d35","tab":"#c7a468","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "bippy":{"top":"#452527","topInk":"#edddb8","paper":"#edddb8","ink":"#452527","soft":"#75634b","accent":"#6e3e38","tab":"#edddb8","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "corleone2":{"top":"#152f2e","topInk":"#eadbb9","paper":"#eadbb9","ink":"#3c3529","soft":"#72654c","accent":"#75402e","tab":"#d3bc83","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "maitland":{"top":"#493238","topInk":"#ede4cb","paper":"#ede4cb","ink":"#2d3330","soft":"#6a6253","accent":"#6c403b","tab":"#a4ad7b","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "roadtrip":{"top":"#277375","topInk":"#f4e7b9","paper":"#f4e7b9","ink":"#234c48","soft":"#6c6449","accent":"#b95734","tab":"#fff2d0","disp":"'Bevan',serif","name":"'Bevan',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "corleone":{"top":"#181511","topInk":"#f0e7d0","paper":"#f0e7d0","ink":"#302d25","soft":"#6a6050","accent":"#733b32","tab":"#b8a583","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "chocolaterie":{"top":"#3a211e","topInk":"#f4e5cb","paper":"#f4e5cb","ink":"#3e2a25","soft":"#786052","accent":"#8f3e37","tab":"#c5a56c","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "kitchenfolio":{"top":"#42594c","topInk":"#f2eddd","paper":"#f2eddd","ink":"#343b33","soft":"#6e6a59","accent":"#823e3b","tab":"#f2eddd","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "moonlit":{"top":"#172f42","topInk":"#eee4cb","paper":"#eee4cb","ink":"#39392e","soft":"#6c6656","accent":"#91513e","tab":"#c7af7e","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "gimbels":{"top":"#174737","topInk":"#f2eddd","paper":"#f2eddd","ink":"#26392e","soft":"#6c6251","accent":"#a0322d","tab":"#d8b865","disp":"'Cormorant Garamond',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "lair":{"top":"#102b23","topInk":"#e9d2a1","paper":"#e9d2a1","ink":"#213a2e","soft":"#6e6044","accent":"#315c4b","tab":"#e9d2a1","disp":"'Bevan',serif","name":"'Bevan',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "tonys":{"top":"#334d3e","topInk":"#f4ead3","paper":"#f4ead3","ink":"#293f35","soft":"#716651","accent":"#8c3c37","tab":"#ceb88b","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "whistle":{"top":"#294b3c","topInk":"#f1e7cd","paper":"#f1e7cd","ink":"#343d32","soft":"#70604b","accent":"#963e32","tab":"#f1e7cd","disp":"'Bevan',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "sals":{"top":"#a92b20","topInk":"#f7e8ba","paper":"#f7e8ba","ink":"#2c1c16","soft":"#75543b","accent":"#a92b20","tab":"#f7e8ba","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "mcdowells":{"top":"#a72525","topInk":"#f7efd9","paper":"#f7efd9","ink":"#3c3024","soft":"#71604b","accent":"#a72525","tab":"#f7efd9","disp":"'Bevan',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "coney":{"top":"#203746","topInk":"#f3e6c9","paper":"#f3e6c9","ink":"#203746","soft":"#695a45","accent":"#ad3929","tab":"#e5b74b","disp":"'Alfa Slab One',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Alfa Slab One',serif","note":"'Barlow Condensed',sans-serif"},
  "nakatomi":{"top":"#172629","topInk":"#f1eee4","paper":"#f1eee4","ink":"#172629","soft":"#435356","accent":"#355e62","tab":"#f1eee4","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "jurassic":{"top":"#173e32","topInk":"#f1e8ce","paper":"#f1e8ce","ink":"#24392e","soft":"#626853","accent":"#ac3329","tab":"#d9a742","disp":"'Bevan',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  newsroom:{top:"#602331",topInk:"#f7eedb",paper:"#f7eedb",ink:"#38251f",soft:"#735b4c",accent:"#8e3f32",tab:"#d5a244",disp:"'Bevan',serif",name:"'Libre Franklin',sans-serif",body:"'Libre Franklin',sans-serif",price:"'Courier Prime',monospace",title:"'Bevan',serif",note:"'Libre Franklin',sans-serif"},
  takeaway:{top:"#a51c24",topInk:"#f2d58a",paper:"#f6eedb",ink:"#2a1610",soft:"#5a4436",accent:"#a51c24",tab:"#f2d58a",
    disp:"'Fraunces',serif",name:"'Fraunces',serif",body:"'Libre Caslon Text',serif",price:"'Fraunces',serif",title:"'Fraunces',serif",note:"'Libre Caslon Text',serif"},
  diner:{top:"#1f3a7a",topInk:"#f2b632",paper:"#fbf5e6",ink:"#241a14",soft:"#5b4a3c",accent:"#c41e2a",tab:"#f2b632",
    disp:"'Alfa Slab One',serif",name:"'Arvo',serif",body:"'Arvo',serif",price:"'Alfa Slab One',serif",title:"'Yellowtail',cursive",note:"'Arvo',serif"},
  casefile:{top:"#2a2018",topInk:"#d9b77a",paper:"#f6f1e3",ink:"#1c1a17",soft:"#4a4438",accent:"#9e1b1b",tab:"#d9b77a",
    disp:"'Big Shoulders Display',sans-serif",name:"'Courier Prime',monospace",body:"'Courier Prime',monospace",price:"'Big Shoulders Display',sans-serif",title:"'Special Elite',monospace",note:"'Courier Prime',monospace",upper:true},
  workorder:{top:"#8e3a2c",topInk:"#fff3b0",paper:"#fff3b0",ink:"#1e1e22",soft:"#4c4a45",accent:"#c2272d",tab:"#fff3b0",
    disp:"'Oswald',sans-serif",name:"'Archivo Narrow',sans-serif",body:"'Archivo Narrow',sans-serif",price:"'Caveat',cursive",title:"'Oswald',sans-serif",note:"'Caveat',cursive",upper:true},
  lanes:{top:"#1c2240",topInk:"#f08a3c",paper:"#f4f7ee",ink:"#1d2a22",soft:"#4f5c52",accent:"#2f7a52",tab:"#f08a3c",
    disp:"'Righteous',sans-serif",name:"'Barlow Condensed',sans-serif",body:"'Barlow',sans-serif",price:"'Barlow Condensed',sans-serif",title:"'Righteous',sans-serif",note:"'Barlow',sans-serif",upper:true},
  slims:{top:"#151515",topInk:"#ff4f86",paper:"#fff4dc",ink:"#151515",soft:"#4d4a45",accent:"#e8336d",tab:"#ff4f86",
    disp:"'Archivo Black',sans-serif",name:"'Josefin Sans',sans-serif",body:"'Josefin Sans',sans-serif",price:"'Archivo Black',sans-serif",title:"'Sacramento',cursive",note:"'Josefin Sans',sans-serif",upper:true},
  noodle:{top:"#3b2416",topInk:"#e8c46a",paper:"#f4ecd8",ink:"#2a1a10",soft:"#5c4632",accent:"#a8322a",tab:"#e8c46a",
    disp:"'Marcellus SC',serif",name:"'Alegreya',serif",body:"'Alegreya',serif",price:"'Marcellus SC',serif",title:"'Marcellus SC',serif",note:"'Alegreya',serif"},
  carte:{top:"#3e0f16",topInk:"#f1dfb8",paper:"#fbf6ea",ink:"#2b1d16",soft:"#5e4a3a",accent:"#6d1a24",tab:"#f1dfb8",
    disp:"'Cormorant SC',serif",name:"'Cormorant SC',serif",body:"'Cormorant Garamond',serif",price:"'Cormorant SC',serif",title:"'Pinyon Script',cursive",note:"'Cormorant Garamond',serif"},
  feast:{top:"#1d2d20",topInk:"#f7f0de",paper:"#f7f0de",ink:"#2a1f18",soft:"#5d4c3e",accent:"#9a2b22",tab:"#f7f0de",
    disp:"'Bodoni Moda',serif",name:"'Bodoni Moda',serif",body:"'Libre Baskerville',serif",price:"'Bodoni Moda',serif",title:"'Italianno',cursive",note:"'Libre Baskerville',serif"},
  truck:{top:"#1f2523",topInk:"#ffd24a",paper:"#fff4d6",ink:"#1f2523",soft:"#4a3f2c",accent:"#f07a2a",tab:"#ffd24a",
    disp:"'Amatic SC',sans-serif",name:"'Fredericka the Great',serif",body:"'Patrick Hand',cursive",price:"'Fredericka the Great',serif",title:"'Bungee',sans-serif",note:"'Patrick Hand',cursive"},
  check:{top:"#2f6b45",topInk:"#f2f6ea",paper:"#f2f6ea",ink:"#1f2a22",soft:"#4a5a4e",accent:"#1d2e8f",tab:"#f2f6ea",
    disp:"'Archivo Narrow',sans-serif",name:"'Libre Franklin',sans-serif",body:"'Libre Franklin',sans-serif",price:"'Archivo Narrow',sans-serif",title:"'DM Serif Display',serif",note:"'Libre Franklin',sans-serif"},
  nero:{top:"#c8242b",topInk:"#fbf3e2",paper:"#f3e2c4",ink:"#2a1a10",soft:"#5a3d22",accent:"#1f6b3a",tab:"#fbf3e2",
    disp:"'Bevan',serif",name:"'Bevan',serif",body:"'Libre Franklin',sans-serif",price:"'Bevan',serif",title:"'Shrikhand',cursive",note:"'Libre Franklin',sans-serif"},
  lous:{top:"#1d1d1f",topInk:"#ffd75e",paper:"#f3ead2",ink:"#1c1c1c",soft:"#4a463d",accent:"#c4262e",tab:"#4fb3a9",
    disp:"'Oswald',sans-serif",name:"'Oswald',sans-serif",body:"'Archivo',sans-serif",price:"'Oswald',sans-serif",title:"'Damion',cursive",note:"'Covered By Your Grace',cursive",upper:true},
  pad:{top:"#1c1410",topInk:"#fbf6df",paper:"#fbf6df",ink:"#1b2a6b",soft:"#3b4a8a",accent:"#b8262b",tab:"#fbf6df",
    disp:"'Courier Prime',monospace",name:"'Covered By Your Grace',cursive",body:"'Courier Prime',monospace",price:"'Covered By Your Grace',cursive",title:"'Courier Prime',monospace",note:"'Covered By Your Grace',cursive"},
  market:{top:"#c8202a",topInk:"#ffd03a",paper:"#f1e6cf",ink:"#151515",soft:"#3d3a35",accent:"#1e3c8c",tab:"#ffd03a",
    disp:"'Anton',sans-serif",name:"'Anton',sans-serif",body:"'Barlow',sans-serif",price:"'Anton',sans-serif",title:"'Mr Dafoe',cursive",note:"'Caveat Brush',cursive",upper:true}
};

const FMT_FILMS={
  "Sleepless in Seattle (1993)":{"fmt":"latenightcall","brand":"Two cities. One late-night call.","phoneTitle":"Sleepless in Seattle","tag":"A supper for the long-distance romantics.","art":{"meeting":"/2rFIzJvWSPT4l1Sm1uriDSnm9TE.jpg","sam":"/mVNAaoZoWmn29I8Th3cl0r6VyUJ.jpg","annie":"/3zYGUcdMza7JMm8Nzjn0xnkQw83.jpg","dinner":"/2x9lre6U5kB2czxZrIltB4aAvGT.jpg"},"groups":[{"h":"On the lake","tab":"Snacks","items":[{"k":"Seattle smoked salmon dip","c":"s","d":"Hot-smoked salmon, cream cheese, crème fraîche, lemon, dill & capers. Crisp bagel chips.","note":"Sam’s houseboat on the lake."},{"k":"Radio show popcorn","c":"s","d":"Fresh popcorn tossed with nutty brown butter & flaky salt.","note":"For the late-night call-in show."}]},{"h":"Before the flight","tab":"Main","items":[{"k":"Annie's dinner with Walter","c":"m","d":"Herb-crusted roast salmon, steamed green beans & warm lemon butter.","note":"Dinner with Annie’s fiancé before New York."}]},{"h":"At the top","tab":"Dessert","items":[{"k":"Valentine's heart cookies","c":"w","d":"Brown-butter heart cookies with red & white royal icing.","note":"For the Valentine’s Day meeting."}]},{"h":"Still awake","tab":"Drink","items":[{"k":"Houseboat iced mocha","c":"d","d":"Strong coffee and dark chocolate over ice with cold milk, under whipped cream and a dusting of cocoa.","note":"Seattle, the coffee city, where Sam and Jonah live on the water"}]}]},
  "You've Got Mail (1998)":{"fmt":"bookshopcafe","brand":"Books, coffee & a little possibility","phoneTitle":"You've Got Mail","tag":"A neighbourhood supper on the Upper West Side.","art":{"identity":"/1XDolJ6DjVxRuhxk3sQJGihoXMy.jpg","corner":"/r8JshT8rXVowFbdiUgguTblt3PX.jpg","fox":"/iZ1HwAER8jWgjkc0Vhu32T5sUAI.jpg"},"groups":[{"h":"While you wait","tab":"Snacks","items":[{"k":"Publishing party salmon cucumber bites","c":"s","d":"Thick cucumber rounds topped with dill cream cheese, smoked salmon, capers and a crack of black pepper.","note":"the party where Joe and Kathleen meet face to face and argue"},{"k":"Upper West Side bagels","c":"s","d":"Toasted mini bagels, spring onion cream cheese & cracked pepper.","note":"Breakfast in Kathleen’s neighbourhood."}]},{"h":"The other bookshop","tab":"Main","items":[{"k":"Fox Books cafe sandwiches","c":"m","d":"Pressed sourdough, turkey, melting brie & cranberry sauce.","note":"Joe’s big bookshop has a café of its own."}]},{"h":"At the café table","tab":"Dessert","items":[{"k":"Cafe cheesecake","c":"w","d":"Baked New York cheesecake & sugar-macerated strawberries.","note":"For the café date she waits through."}]},{"h":"Decisions, decisions","tab":"Drink","items":[{"k":"Tall decaf cappuccino","c":"d","d":"Double decaf espresso, steamed milk & a deep foam cap.","note":"A coffee order with a lot of decisions."}]}]},
  "Tootsie (1982)":{"fmt":"dorothysupper","brand":"Between takes & a weekend away","phoneTitle":"Tootsie","tag":"A little studio lunch. A proper country supper.","art":{"identity":"/qbKKPCd8u6TT5G89l1G6rO986KP.jpg","studio":"/pPMbp8hNviXiPNIEW98tDxxuzOs.jpg","farm":"/pdpJR1k8auhrKlSxJEhAbHiuuq8.jpg","tearoom":"/kNCx57cRFvUqzKPZRRwbN3wgDqT.jpg"},"groups":[{"h":"Between takes","tab":"Snacks","items":[{"k":"Southwest General green room sandwiches","c":"s","d":"Egg & cress and cucumber-cream cheese sandwiches, crusts off, cut into triangles.","note":"between takes on the hospital soap"},{"k":"Sandy's audition capsicum and feta dip","c":"s","d":"Smoky roast red capsicum blitzed with feta, Greek yoghurt and chilli, served with seeded crackers.","note":"Sandy's audition for the role she didn't get"}]},{"h":"The farm weekend","tab":"Main","items":[{"k":"Les's farm roast chicken","c":"m","d":"Lemon-thyme butter under crisp roast chicken skin, with potatoes roasted in the tray.","note":"A country supper inspired by the weekend at Les’s farm."}]},{"h":"A weekend off","tab":"Dessert","items":[{"k":"Strawberry shortcake","c":"w","d":"Cream scones, macerated strawberries & softly whipped cream.","note":"Something sweet for Julie’s weekend away."}]},{"h":"Lunch with George","tab":"Drink","items":[{"k":"Dorothy Michaels' Russian caravan tea","c":"d","d":"Smoky black tea, brewed strong, with lemon slices & cherry jam on the side.","note":"the lunch where George first meets Dorothy"}]}]},
  "Manhattan (1979)":{"fmt":"gershwinfolio","brand":"A love letter to the city","phoneTitle":"Manhattan","tag":"New York in black and white. Dessert in colour.","art":{"city":"/nvnpsUc5V1rBT9mLLz5LrIQw4MR.jpg","table":"/tVmoraX8GRCCGEfdZjgRCyHQtMj.jpg","citylife":"/hPFZzguY6bUvhfu9s0ynik58tOC.jpg"},"groups":[{"h":"A New York beginning","tab":"Snacks","items":[{"k":"Queensboro Bridge bagels and lox","c":"s","d":"Toasted bagels, whipped cream cheese, smoked salmon, capers & red onion.","note":"for the bench by the bridge at dawn"},{"k":"Elaine's crostini","c":"s","d":"Honeyed ricotta on toast; mushrooms, thyme & parmesan on toast.","note":"The Upper East Side table where the conversation begins."}]},{"h":"Old movies, new appetites","tab":"Main","items":[{"k":"Chinese takeaway in bed","c":"m","d":"Kung pao chicken with dried chillies, Sichuan pepper, roasted peanuts & spring onion. Jasmine rice alongside.","note":"Isaac and Tracy, watching old movies."}]},{"h":"The city, by the slice","tab":"Dessert","items":[{"k":"Worth-living-for cheesecake","c":"w","d":"Dense baked cheesecake, lemon & vanilla, on a buttery biscuit base.","note":"Isaac's list, right up there with Tracy's face"}]},{"h":"One for the name","tab":"Drink","items":[{"k":"Manhattan cocktail","c":"d","d":"Rye, sweet vermouth & bitters, stirred cold, finished with a cherry.","note":"The city’s namesake, in a coupe."}]}]},
  "Annie Hall (1977)":{"fmt":"annietable","brand":"Annie orders. Alvy objects.","phoneTitle":"Annie Hall","tag":"La-di-da. Pass the lobster.","art":{"terrace":"/7OFjvTED8YEeg9dWcxQ0ddMeZsh.jpg","park":"/m11t1czEL6edHkkCskWHaEh8xjY.jpg","cinema":"/8n9dYsTbXTykzm2Nuy7R2ftapXQ.jpg"},"groups":[{"h":"Catch them first","tab":"Snacks","items":[{"k":"Lobster bites","c":"s","d":"Lobster, lemon, celery & chives on toasted, buttered brioche.","note":"Catch them first. They will escape."},{"k":"Alvy's potato knishes","c":"s","d":"Flaky golden pastry with mashed potato & slowly fried onion.","note":"Alvy’s Brooklyn childhood."}]},{"h":"Annie orders. Alvy objects.","tab":"Main","items":[{"k":"Pastrami on white with mayo","c":"m","d":"Steamed pastrami piled high on soft white bread, mayonnaise, lettuce & tomato.","note":"Annie’s order that horrifies Alvy."}]},{"h":"Never leaving New York","tab":"Dessert","items":[{"k":"New York cheesecake","c":"w","d":"Lemon-scented baked cheesecake, a buttery biscuit base & an overnight chill.","note":"Alvy’s city, which he will never leave."}]},{"h":"The other coast","tab":"Drink","items":[{"k":"Alvy's LA cucumber mint cooler","c":"d","d":"Fresh cucumber and lime juice shaken with mint and honey, topped with sparkling water over ice.","note":"Alvy's health food lunch in LA, alfalfa sprouts and all"}]}]},
  "Trading Places (1983)":{"fmt":"orangefutures","brand":"A change of fortune","phoneTitle":"Trading Places","tag":"One dollar bet. One very big swap.","art":{"club":"/4e9S5dsNQr1FTFhSwruKdgOQIs9.jpg","swap":"/8lP4ySAXxp6inkjKCCzJHxyBnok.jpg","market":"/suVp7OjmSJRUmFKXSXrGb4igoKr.jpg"},"groups":[{"h":"Heritage Club","tab":"Snacks","items":[{"k":"Duke & Duke club canapés","c":"s","d":"Almond-stuffed prunes wrapped in crisp streaky bacon.","note":"A club-style opening for the Duke brothers’ wager."},{"k":"Frozen orange juice shots","c":"s","d":"Icy orange juice slush with a splash of vodka.","note":"The commodity that turns the tables."}]},{"h":"The main position","tab":"Main","items":[{"k":"Billy Ray's club dinner","c":"m","d":"Slow-roasted rib roast, rich pan jus, horseradish cream & crisp roast potatoes.","note":"A change of fortune. A proper seat at the table."}]},{"h":"The sweet return","tab":"Dessert","items":[{"k":"Orange cake","c":"w","d":"Orange butter cake, brushed with sticky orange-concentrate glaze.","note":"A sweet return on frozen concentrate."}]},{"h":"A toast to orange juice","tab":"Drink","items":[{"k":"Mimosa","c":"d","d":"Freshly squeezed orange juice & chilled sparkling wine.","note":"Orange juice wins the day."}]}]},
  "Quick Change (1990)":{"fmt":"getawaysupper","brand":"Dinner before the getaway","phoneTitle":"Quick Change","tag":"The bank job was easy. Leaving New York is hard.","art":{"identity":"/fL29qQX4I2sbULfHUbMLbwwlBak.jpg","bank":"/xd7GlVVQ53P53LN9bD6yHiF52cA.jpg","detour":"/mjZnGUPYE76Nd5ih2yiVrOfiv6M.jpg"},"groups":[{"h":"The disguise","tab":"Snacks","items":[{"k":"Clown nose cherry tomatoes","c":"s","d":"Cherry tomatoes filled with basil & lemon whipped feta.","note":"A red nose for every guest. Grimm would approve."},{"k":"Airport bar chilli-lime wings","c":"s","d":"Oven-crisp chicken wings tossed in chilli, lime and honey butter, finished with coriander and extra lime.","note":"so close to getting out of the city"}]},{"h":"A city that won’t let you leave","tab":"Main","items":[{"k":"Bodega sandwiches","c":"m","d":"Turkey & Swiss kaiser rolls with lettuce, tomato, mayo and mustard, wrapped tight in paper.","note":"A New York meal between wrong turns."}]},{"h":"One last red nose","tab":"Dessert","items":[{"k":"Clown cake","c":"w","d":"Jam sponge, white buttercream, a piped clown face & cherry nose.","note":"Grimm’s disguise, served by the slice."}]},{"h":"Wheels up, finally","tab":"Drink","items":[{"k":"Wheels-up bourbon smash","c":"d","d":"Bourbon muddled with mint, lemon and sugar syrup, shaken and poured over crushed ice with a big mint sprig.","note":"a toast to finally leaving New York"}]}]},
  "Brewster's Millions (1985)":{"fmt":"spenditall","brand":"Spend thirty million in thirty days","phoneTitle":"Brewster’s Millions","tag":"Spend thirty million in thirty days. Start with dinner.","art":{"identity":"/2TUDKqsPhPYanXG7yV9BihYXOlM.jpg","millions":"/piDtqqxu09XRPqphYbcIDyjqTr7.jpg","baseball":"/3qGh0BE3Fq7Op5mDiX7mifYQzLI.jpg","toast":"/8oQ8qGqVBDzkpZYeDyOd4RURsz2.jpg"},"groups":[{"h":"For the whole hotel","tab":"Snacks","items":[{"k":"Prawn cocktail for the whole hotel","c":"s","d":"Iced prawns, crisp iceberg, Marie Rose & smoked paprika.","note":"Monty’s shout. Enough for everyone."},{"k":"Caviar blini","c":"s","d":"Warm buckwheat blini, crème fraîche, salmon roe & chives.","note":"A generous start to a very expensive evening."}]},{"h":"Order the most expensive thing","tab":"Main","items":[{"k":"Surf and turf","c":"m","d":"Seared eye fillet, grilled lobster tail, garlic butter & béarnaise.","note":"Order two. It is Monty’s money."}]},{"h":"The most expensive postcard","tab":"Dessert","items":[{"k":"Rare stamp shortbread","c":"w","d":"Buttery shortbread with a stamp-cut edge & a piped icing design.","note":"A little tribute to the rare stamp Monty posts."}]},{"h":"The whole bar, on Monty","tab":"Drink","items":[{"k":"Monty's champagne cocktails for the bar","c":"d","d":"Brut champagne poured over a bitters-soaked sugar cube with a splash of orange liqueur and a twist of orange.","note":"the whole bar, on Monty"}]}]},
  "The Secret of My Success (1987)":{"fmt":"mailroomexecutive","brand":"Dinner on the way up","phoneTitle":"The Secret of My Success","tag":"Mailroom by day. Executive by night.","art":{"roof":"/8LA9IzAN6jahYHYBWD5y2xY3QRG.jpg","work":"/g1g6MM1z3ns8gegl2yTQNxDAkZI.jpg","office":"/knNMseWMtXliTv2LRT48pg10D35.jpg"},"groups":[{"h":"Mailroom beginnings","tab":"Snacks","items":[{"k":"Mailroom sandwich bites","c":"s","d":"Ham, cheddar & pickle on buttered white bread, cut into fingers.","note":"A bite between Brantley’s deliveries."},{"k":"Kansas corn fritters","c":"s","d":"Golden corn & spring onion fritters, with sour cream for dipping.","note":"A little of the Kansas home he left behind."}]},{"h":"Executive dining","tab":"Main","items":[{"k":"Executive rib eye","c":"m","d":"Dry-brined rib eye, seared & basted with butter, thyme & garlic.","note":"Brantley’s other identity: Carlton Whitfield."}]},{"h":"Home still calls","tab":"Dessert","items":[{"k":"Kansas apple pie","c":"w","d":"Double-crust apple pie with cinnamon & vanilla ice cream.","note":"Kansas comfort, wherever he ends up."}]},{"h":"After office hours","tab":"Drink","items":[{"k":"Martini","c":"d","d":"Gin & dry vermouth, stirred over ice, finished with a lemon twist.","note":"The country-house weekend, with everyone in the wrong bedroom."}]}]},
  "Working Girl (1988)":{"fmt":"powerlunch","brand":"A seat at the table","phoneTitle":"Working Girl","tag":"A head for business. An appetite for dinner.","art":{"identity":"/uXidBDU0WM74101hTRo7xe1tbb9.jpg","ferry":"/5yPlKUU74bwXHw0kRp1ThbPdGe4.jpg","boardroom":"/aaSJhCKwnUHqQmEd5XPbkmT3uTP.jpg"},"groups":[{"h":"Making an entrance","tab":"Snacks","items":[{"k":"Trask wedding canapés","c":"s","d":"Chilled prawns on cucumber, Marie Rose sauce & fresh dill.","note":"The Trask family wedding. She’s not invited."},{"k":"Wall Street crab cakes","c":"s","d":"Golden crab cakes with parsley, Dijon, lemon & tartare sauce.","note":"The big pitch in the boardroom."}]},{"h":"A seat at the table","tab":"Main","items":[{"k":"Power lunch steak salad","c":"m","d":"Seared sirloin over crisp cos, blue cheese, cherry tomatoes & red wine vinaigrette.","note":"Tess in Katharine’s clothes."}]},{"h":"The wedding reception","tab":"Dessert","items":[{"k":"Wedding cake slice","c":"w","d":"Vanilla butter cake layered with raspberry jam & Swiss meringue buttercream.","note":"Trask’s daughter’s wedding."}]},{"h":"From Staten Island","tab":"Drink","items":[{"k":"Tess's Manhattan cocktail","c":"d","d":"Bourbon, sweet vermouth & aromatic bitters, stirred cold with a cherry.","note":"The ferry in from Staten Island."}]}]},
  "Three Men and a Baby (1987)":{"fmt":"loftsupper","brand":"Supper between the feeds","phoneTitle":"Three Men and a Baby","tag":"Three bachelors. One unexpected dinner guest.","art":{"kitchen":"/6VHQO9J8XcGtP8zI1bOG53VmO49.jpg","dads":"/s0ynTXUfUUk5atGCm0EwhBJlARt.jpg","cradle":"/AvmOWEtquzcLulNvZR8QN3sZlaN.jpg"},"groups":[{"h":"Before she arrived","tab":"Snacks","items":[{"k":"Doorstep basket prawn toast","c":"s","d":"Golden sesame prawn toast, cut into triangles, with sweet chilli sauce.","note":"the surprise left outside the loft, note included"},{"k":"Bagel chips and schmear","c":"s","d":"Crisp baked bagel rounds with cream cheese, chives & lemon zest.","note":"The morning feed."}]},{"h":"The architect’s dinner","tab":"Main","items":[{"k":"Peter's loft steak sandwich","c":"m","d":"Seared sirloin, slow-cooked onions, melted Swiss & horseradish mayo on toasted sourdough.","note":"Peter’s dinner at the loft."}]},{"h":"Something soft","tab":"Dessert","items":[{"k":"Baby Mary's bedtime vanilla custard","c":"w","d":"Silky vanilla-bean custard, served warm or chilled. Smooth, no lumps.","note":"smooth, no lumps, Peter reads her the boxing news while it cools"}]},{"h":"The late shift","tab":"Drink","items":[{"k":"Night-feed bourbon milk punch","c":"d","d":"Cold milk shaken with bourbon, vanilla and a little sugar until frothy, served over ice with fresh nutmeg on top.","note":"the 3am feeds, test it on your wrist first"}]}]},
  "Splash (1984)":{"fmt":"oceansupper","brand":"Fresh from the ocean","phoneTitle":"Splash","tag":"A New York dinner with an ocean view.","art":{"identity":"/8JurdSpCQGQQe1qBFA8SGw5zVoC.jpg","restaurant":"/1zQMEoRf1NOLWF5wh3VmtcIpI5y.jpg","shore":"/10yuTHj9fj3bzmVO2XwZ69tO7cY.jpg","underwater":"/5nMdiUoG8e7cQuo2XFx9D2aHWeR.jpg"},"groups":[{"h":"A taste of the shore","tab":"Snacks","items":[{"k":"Oysters natural","c":"s","d":"Fresh oysters on ice, lemon & shallot mignonette.","note":"Fresh from Madison’s world."},{"k":"Fish and chip cones","c":"s","d":"Beer-battered flathead, crisp chips, tartare & lemon.","note":"Cape Cod, where Allen first meets Madison."}]},{"h":"Madison’s restaurant moment","tab":"Main","items":[{"k":"Whole lobster","c":"m","d":"Boiled, split & grilled with garlic butter. Drawn butter and lemon on the side.","note":"At the restaurant, Madison eats the shell too."}]},{"h":"Below the surface","tab":"Dessert","items":[{"k":"Ocean blue jelly cups","c":"w","d":"Blue jelly, coconut panna cotta & gummy fish.","note":"A little of Madison’s ocean."}]},{"h":"Back to the blue","tab":"Drink","items":[{"k":"Blue lagoon","c":"d","d":"Vodka, blue curaçao, lemonade & a lemon wheel.","note":"For the swim back home."}]}]},
  "Big (1988)":{"fmt":"toystore","brand":"Grown-up food / Kid at heart","phoneTitle":"Big","tag":"Grown-up food for a kid at heart.","art":{"identity":"/kwxQaOaG2qvsNf6cuf0hrarX11r.jpg","piano":"/foMHIjKCwJm2L3waE1dqQk0LS62.jpg","party":"/oLm4lbsJPRKrPMnNKMnJmvkbSN7.jpg"},"groups":[{"h":"The company party","tab":"Snacks","items":[{"k":"Baby corn","c":"s","d":"Charred baby corn with butter, chilli & lime salt.","note":"Eat it off the cob with both hands, like Josh."},{"k":"Caviar on crackers","c":"s","d":"Crème fraîche, salmon roe & chives on water crackers.","note":"The fancy party snack Josh cannot quite handle."}]},{"h":"Loose in the city","tab":"Main","items":[{"k":"Street cart hot dog","c":"m","d":"Griddled franks, steamed buns, yellow mustard, sauerkraut & red onion sauce.","note":"Josh and Billy’s New York street-cart supper."}]},{"h":"Something big","tab":"Dessert","items":[{"k":"Giant choc chip cookie","c":"w","d":"One enormous, soft-centred cookie with white icing piano keys.","note":"For the kid who played the whole piano."}]},{"h":"The soda fountain","tab":"Drink","items":[{"k":"Chocolate egg cream","c":"d","d":"Chocolate syrup, cold milk & soda water, stirred until the foam rises.","note":"A New York fountain classic. No egg required."}]}]},
  "C.H.U.D. (1984)":{"fmt":"bowerybelow","brand":"Above ground supper","phoneTitle":"C.H.U.D.","tag":"Don’t go down the drain.","art":{"street":"/mNv1BPDxj6sk31HJtGHNIV53YNg.jpg","below":"/AlmWl14KToPuBO2IEvlDqXcaeJl.jpg","kitchen":"/aNYo3bqAmeb2RKVgTpYFcU44v0H.jpg"},"groups":[{"h":"Before the descent","tab":"Snacks","items":[{"k":"Soup kitchen cheddar and onion rolls","c":"s","d":"Soft pull-apart rolls baked with sharp cheddar and caramelised onion, brushed with butter and served warm.","note":"the Reverend's shelter on the Bowery, ready for dunking into the stew"},{"k":"Manhole cover mini pizzas","c":"s","d":"Tomato, mozzarella & a crosshatch of pepperoni on little pizza rounds.","note":"A manhole grate, made for sharing."}]},{"h":"A hot meal above ground","tab":"Main","items":[{"k":"The Reverend's soup kitchen stew","c":"m","d":"Slow-braised beef, onion, carrot, celery & potatoes, with crusty Italian bread.","note":"The Bowery soup kitchen at the centre of the story."}]},{"h":"Up on the street","tab":"Dessert","items":[{"k":"Greenwich Village cider doughnuts","c":"w","d":"Apple cider cake doughnuts, fried golden & tossed in cinnamon sugar.","note":"The Village above the sewers."}]},{"h":"A light from below","tab":"Drink","items":[{"k":"Glowing green cordial","c":"d","d":"Lime cordial, tonic water & ice. Switch on a black light for the tonic’s glow.","note":"A little light under the manhole."}]}]},
  "The Out-of-Towners (1970)":{"fmt":"eventually","brand":"Breakfast. At last.","phoneTitle":"The Out-of-Towners","tag":"Every possible thing goes wrong.","art":{"park":"/jWBecw9360enEW276BJHvCzMPqi.jpg","flight":"/wJ4pFHkq30XmkwHyybtpdK5ElTc.jpg","counter":"/mVj97I14B0E9TKlzO91dX2zXbHx.jpg"},"groups":[{"h":"Emergency supplies","tab":"Snacks","items":[{"k":"Handbag shortbread fingers with jam","c":"s","d":"Buttery shortbread fingers baked pale and crisp, sandwiched with raspberry jam and dusted with icing sugar.","note":"rationed between George and Gwen through one very long night"},{"k":"Diverted flight cocktail franks","c":"s","d":"Little cocktail franks glazed in honey, mustard and brown sugar until sticky, speared on toothpicks with pickled onions.","note":"the flight that gets diverted to Boston, and nothing left to eat on board"}]},{"h":"Breakfast. At last.","tab":"Main","items":[{"k":"Hotel rib eye breakfast","c":"m","d":"Seared rib eye, fried eggs, crisp hash browns and buttered toast.","note":"Breakfast in the room at last."}]},{"h":"Finally seated","tab":"Dessert","items":[{"k":"Waldorf cheesecake","c":"w","d":"Baked New York cheesecake, chilled overnight with strawberries on top.","note":"The hotel they finally reach."}]},{"h":"A well-earned drink","tab":"Drink","items":[{"k":"Hotel bar martini","c":"d","d":"Gin and dry vermouth stirred ice-cold with an olive garnish.","note":"George has earned it."}]}]},
  "The Adjustment Bureau (2011)":{"fmt":"unplanned","brand":"A dinner beyond the plan","phoneTitle":"The Adjustment Bureau","tag":"Fate has a plan. So does dessert.","art":{"meeting":"/cKiHtxQUbSGWlinNPjn71jtHvhh.jpg","bus":"/4mF2uajGv5t39fidddw8sN0KO5C.jpg","dessert":"/ap6OYJTrDeHCjxRrxazSHjn9LTX.jpg"},"groups":[{"h":"Before the plan changes","tab":"Snacks","items":[{"k":"Hot honey-roasted nuts","c":"s","d":"Mixed nuts roasted glossy with honey, butter, brown sugar & a little cinnamon.","note":"The cart beside the bus stop."},{"k":"Bureau men's rooftop crostini","c":"s","d":"Toasted baguette, whipped goat’s cheese, warm honey, thyme & cracked black pepper.","note":"keep your hat on, it opens the doors"}]},{"h":"The date","tab":"Main","items":[{"k":"Manhattan steak frites","c":"m","d":"Seared sirloin, shallot & red wine butter, with a generous pile of double-fried frites.","note":"The date they’re not supposed to have."}]},{"h":"A softer centre","tab":"Dessert","items":[{"k":"The Chairman's chocolate fondant","c":"w","d":"Warm dark chocolate cakes, just set at the edges, with soft melting centres.","note":"the plan says it melts in the middle"}]},{"h":"Win or lose","tab":"Drink","items":[{"k":"Election night French 75","c":"d","d":"Gin shaken with lemon and sugar syrup, poured into flutes and topped with brut champagne and a long lemon twist.","note":"election night, win or lose, the night David meets Elise"}]}]},
  "Frequency (2000)":{"fmt":"sullivansupper","brand":"Two generations. One table.","phoneTitle":"Frequency","tag":"A Queens family supper across thirty years.","art":{"frank":"/sm0tgw5X0u8330FrhxHxbsq9slk.jpg","john":"/3N6iWYfL5spmk18d4s7rl4N89Pg.jpg","baseball":"/yVtbDnw2RbKZijeZonDnm4ZKo4L.jpg"},"groups":[{"h":"Firehouse and ballpark","tab":"Snacks","items":[{"k":"Firehouse chilli bites","c":"s","d":"Beef-and-bean chilli in crisp wonton cups, with melted cheddar.","note":"A bite for Frank’s firehouse crew."},{"k":"Miracle Mets pretzels with beer mustard","c":"s","d":"Warm ballpark soft pretzels glossy from a bicarb bath, coarse salt on top, with a sharp beer and wholegrain mustard dip.","note":"the 1969 World Series, the Miracle Mets on the radio"}]},{"h":"The family table","tab":"Main","items":[{"k":"Queens pizza","c":"m","d":"Thin, crisp pizza with crushed tomato, mozzarella & crumbled Italian sausage.","note":"A family supper while the Series is on the radio."}]},{"h":"Julia’s kitchen","tab":"Dessert","items":[{"k":"Julia's apple pie","c":"w","d":"Granny Smith apples, cinnamon & sugar beneath a golden double crust.","note":"The warmth of the Sullivan family kitchen."}]},{"h":"Before the first pitch","tab":"Drink","items":[{"k":"Firehouse lemon shandy","c":"d","d":"Cold lager topped with fresh homemade lemonade and mint in frosted glasses, easy drinking for nine innings.","note":"the 1969 World Series on the radio at the firehouse"}]}]},
  "16 Blocks (2006)":{"fmt":"sixteen","brand":"One long lunch","phoneTitle":"16 Blocks","tag":"Sixteen blocks. A second chance.","art":{"city":"/snUdoOV9oQCLYFBKk99POiYpWvj.jpg","partners":"/gu0uW79wQ3hVPN7T0PF2sdITLse.jpg","eddie":"/5ixTU3ZkLRWivl21ESPWVLWlA3N.jpg"},"groups":[{"h":"The first stop","tab":"Snacks","items":[{"k":"Salt and vinegar pork crackling","c":"s","d":"Pork belly skin roasted until it shatters, tossed in vinegar salt and served with pickled onions and hot mustard.","note":"Jack's stop at the liquor store before the walk starts"},{"k":"Chinatown dumplings","c":"s","d":"Crisp-bottomed pork dumplings with soy, black vinegar & fresh ginger.","note":"A detour through Chinatown."}]},{"h":"Lunch on the run","tab":"Main","items":[{"k":"Chopped cheese","c":"m","d":"Griddle-chopped beef & onion, melted American cheese, lettuce, tomato & mayo in a toasted hero.","note":"A New York lunch for the longest short walk."}]},{"h":"Eddie’s next chapter","tab":"Dessert","items":[{"k":"Eddie's birthday cake","c":"w","d":"Two layers of chocolate butter cake, chocolate buttercream & birthday candles.","note":"A bakery of his own. A future beyond these sixteen blocks."}]},{"h":"Keep moving","tab":"Drink","items":[{"k":"Bodega iced coffee with condensed milk","c":"d","d":"Strong coffee poured over ice and sweetened condensed milk, stirred until creamy and cold, with a pinch of cinnamon.","note":"Jack needs it, badly, for a long walk to the courthouse"}]}]},
  "Premium Rush (2012)":{"fmt":"messenger","brand":"Between drops / Messenger supper","phoneTitle":"Premium Rush","tag":"No brakes. Fast food.","art":{"wilee":"/A1ERUEcDEvtD38mq3v9ReFI1YEp.jpg","nima":"/x2kgKfWZ4bkEbxb6eZomFU3FkV6.jpg","vanessa":"/gUpDIpCghA2yptkrhb9JLkzQaLv.jpg"},"groups":[{"h":"Pack for the ride","tab":"Snacks","items":[{"k":"Messenger fuel bars","c":"s","d":"Oats, honey, dates, peanuts & seeds, baked into pocket-sized bars.","note":"oats and honey eaten mid-ride"},{"k":"Chinatown pork buns","c":"s","d":"Sticky hoisin & five-spice pork tucked into soft steamed bao.","note":"Nima's package goes through Chinatown"}]},{"h":"Between drops","tab":"Main","items":[{"k":"Wilee's halal cart chicken over rice","c":"m","d":"Spiced chicken, turmeric rice & shredded lettuce with white sauce and hot sauce.","note":"one hand on the bars, eaten between drops"}]},{"h":"Back at dispatch","tab":"Dessert","items":[{"k":"Dispatch office cookies","c":"w","d":"Brown butter choc chip cookies finished with flaky salt.","note":"the dispatch office jar"}]},{"h":"Top up the tank","tab":"Drink","items":[{"k":"No-brakes energy smoothie","c":"d","d":"Banana, berries, oats, peanut butter & milk, with optional espresso.","note":"Wilee's bike has no brakes, so drink fast"}]}]},
  "After Hours (1985)":{"fmt":"sohoaftermidnight","brand":"After midnight in SoHo","phoneTitle":"After Hours","tag":"It's after midnight. Do you know where your dinner is?","art":{"identity":"/cb8S2ushmcZcNLcX0HGgfLABEcU.jpg","bar":"/gTPH5zIvkl8HV9vLsqOiPBVTsSB.jpg","paperweight":"/bmJfiCU6wpkPebsuYnxVr37hrC6.jpg","sculpture":"/bsagMaJXd66zNmN4HGYHJCCYF2.jpg"},"groups":[{"h":"Two strange diversions","tab":"Snacks","items":[{"k":"Bagel paperweight bites with chive schmear","c":"s","d":"Toasted mini bagels piled with chive and black pepper cream cheese, smoked salmon and a sprinkle of everything seasoning.","note":"Kiki's plaster bagel-and-cream-cheese paperweights, but edible"},{"k":"Mob truck choc-dipped sundae cones","c":"s","d":"Vanilla soft serve in crisp cones, dipped in setting chocolate and rolled in crushed peanuts and rainbow sprinkles.","note":"the angry mob chasing Paul in the ice cream truck"}]},{"h":"The Terminal Bar","tab":"Main","items":[{"k":"Terminal Bar burger","c":"m","d":"Griddled chuck patty, melted cheddar, raw onion & dill pickles on a toasted bun.","note":"Tom, the bartender, owes Paul a favour."}]},{"h":"An artful escape","tab":"Dessert","items":[{"k":"White frosted plaster cake","c":"w","d":"Vanilla butter cake, thick seven-minute frosting, roughly smoothed like plaster.","note":"Paul becomes part of the artwork."}]},{"h":"Still not home","tab":"Drink","items":[{"k":"Terminal Bar whiskey sour","c":"d","d":"Bourbon shaken with lemon, sugar syrup and egg white until silky, served over ice with bitters and a cocktail cherry.","note":"the bartender at the Terminal Bar, and Paul still can't get home"}]}]},
  "Money Train (1995)":{"fmt":"lasttrain","brand":"Last train of the night","phoneTitle":"Money Train","tag":"Two brothers. One last train. Supper after shift.","art":{"identity":"/oWfITuo0TdJYVRalEH42fuNEN2E.jpg","platform":"/tLohZR4ZTHJOTCq6bknQzXKXEtd.jpg","crew":"/5yOey9XDiwxikXgj5KDtP3mzpra.jpg"},"groups":[{"h":"On the platform","tab":"Snacks","items":[{"k":"Token booth honey roasted nuts","c":"s","d":"Honey, cinnamon & a little salt, roasted until glossy and crisp.","note":"eat them quick, before the Torch turns up"},{"k":"Gold token cookies","c":"s","d":"Buttery shortbread rounds, a cut-out centre & a brush of edible gold.","note":"The fare, in shortbread."}]},{"h":"Supper after shift","tab":"Main","items":[{"k":"Arroz con pollo","c":"m","d":"Chicken thighs over annatto-coloured rice, with sofrito, green olives & capers.","note":"A Puerto Rican supper for a film that brings Grace into the brothers’ orbit."}]},{"h":"The bakery stop","tab":"Dessert","items":[{"k":"Guava pastelitos","c":"w","d":"Flaky pastry, guava paste & cream cheese, finished with sugar syrup.","note":"Something sweet on the way home."}]},{"h":"Clocking off","tab":"Drink","items":[{"k":"Money Train payday michelada","c":"d","d":"Cold lager with lime, tomato juice, hot sauce and Worcestershire in a chilli-salted glass, served brown-paper-bag style.","note":"a whole train full of fare money, too tempting for Charlie"}]}]},
  "Inside Man (2006)":{"fmt":"negotiation","brand":"Lunch, inside & out / Manhattan supper","phoneTitle":"Inside Man","tag":"The perfect heist needs a perfect lunch.","art":{"vault":"/2h3QKx9mXCT39iBNfrL5zVIbziP.jpg","frazier":"/8b4vDh7hNSLZKyAYUnZJalExbJb.jpg","russell":"/cd1LVxvax4P4QMusXR9prD8BPwo.jpg"},"groups":[{"h":"The delivery","tab":"Snacks","items":[{"k":"Hostage pizza bites","c":"s","d":"Mini pizzas with tomato, mozzarella and pepperoni.","note":"For the pizza delivery to the hostages."},{"k":"Brooklyn potato knishes","c":"s","d":"Potato and slow onion in puff pastry logs with hot mustard.","note":"A New York pavement lunch."}]},{"h":"Manhattan lunch","tab":"Main","items":[{"k":"Manhattan steak sandwich","c":"m","d":"Sliced sirloin on ciabatta with slow onions, rocket and horseradish cream.","note":"A substantial supper for a long negotiation."}]},{"h":"From the bakery","tab":"Dessert","items":[{"k":"Rainbow cookies","c":"w","d":"Green, white and red almond layers with jam and chocolate.","note":"A bright finish from an Italian bakery."}]},{"h":"One more conversation","tab":"Drink","items":[{"k":"Negotiator's espresso orange tonic","c":"d","d":"A double espresso poured over tonic, ice and fresh orange, bitter, bright and fizzy enough to keep you sharp.","note":"fuel for the long negotiation outside the bank"}]}]},
  "Léon: The Professional (1994)":{"fmt":"leon","brand":"A quiet supper","phoneTitle":"Léon","tag":"Quiet man. Loud appetite. Lots of milk.","art":{"plant":"/tPYd23NekdHW0getiQNxbNozlfy.jpg","milk":"/bNkXmnUyo1I0x4HZEgMsXCMp7rj.jpg","table":"/yRmFVsGV8EUJckcuhAfNaqYrXl.jpg"},"groups":[{"h":"To begin, simply","tab":"Snacks","items":[{"k":"Jambon-beurre baguette bites","c":"s","d":"Crusty baguette with thick cultured butter, shaved ham and cornichons, cut into bites the Paris café way.","note":"Léon's French roots, simple and exact"},{"k":"Olives and cornichons","c":"s","d":"Warm olives with orange peel, thyme and garlic, with cornichons and pickled onions.","note":"A plain lunch at a quiet table."}]},{"h":"From Tony’s kitchen","tab":"Main","items":[{"k":"Tony's spaghetti","c":"m","d":"Spaghetti with slow tomato, garlic and basil sauce, a little butter and grated parmesan.","note":"The restaurant back room where the jobs are handed out."}]},{"h":"A place by the window","tab":"Dessert","items":[{"k":"Potted plant dirt cups","c":"w","d":"Chocolate mousse, crushed chocolate-biscuit soil and a fresh mint sprig.","note":"His plant always gets the window."}]},{"h":"Two glasses, chilled","tab":"Drink","items":[{"k":"Léon's malted vanilla milkshake","c":"d","d":"Ice-cold milk blended thick with vanilla ice cream, malted milk powder and honey, poured into tall frosted glasses.","note":"Léon drinks milk, two litres at a time"}]}]},
  "Die Hard with a Vengeance (1995)":{"fmt":"cityrun","brand":"One very long day in New York","phoneTitle":"Die Hard with a Vengeance","tag":"One very long day in New York. Snacks for the road.","art":{"street":"/hLyGN90wfypN2lXSnThHLwrbNdv.jpg","phone":"/dBpRGN5q8Q3sE3WQwJ6bJcAZsAe.jpg","park":"/nf3fCObg6MMEVs1TXylACJSxS6a.jpg"},"groups":[{"h":"From Harlem, on the run","tab":"Snacks","items":[{"k":"Zeus's salted peanut caramel slab","c":"s","d":"Chewy brown sugar caramel packed with roasted salted peanuts, set in a slab and topped with milk chocolate and flaky salt.","note":"the counter at Zeus's electrical shop in Harlem"},{"k":"Harlem chicken and waffles","c":"s","d":"Buttermilk fried chicken, hot waffles & honey spiked with hot sauce.","note":"A Harlem stop before another riddle."}]},{"h":"A New York breakfast","tab":"Main","items":[{"k":"Bacon egg and cheese on a roll","c":"m","d":"Crisp bacon, fried egg & melted American cheese, on a butter-toasted kaiser roll.","note":"McClane hasn’t slept in days."}]},{"h":"Back at the counter","tab":"Dessert","items":[{"k":"Crumb cake","c":"w","d":"Buttery cake, thick cinnamon crumble & a dusting of icing sugar.","note":"Zeus’s shop counter."}]},{"h":"The final measure","tab":"Drink","items":[{"k":"Water jug lemonade","c":"d","d":"Fresh lemon juice, sugar syrup & cold water. Exactly four litres, served over ice.","note":"A cold drink for the water-jug puzzle."}]}]},
  "Ghost Dog: The Way of the Samurai (1999)":{"fmt":"rooftop","brand":"A quiet supper / Rooftop & street level","phoneTitle":"Ghost Dog","tag":"Silent. Loyal. Hungry.","art":{"roof":"/pgyzTXv4hBJ7DzSgvOfIFLNhfGq.jpg","pigeon":"/hkYCLGAvw8oKxP31AdIG63UCLNW.jpg","raymond":"/2eQWdyvbSlyjEd0dL9OBBzg3m14.jpg"},"groups":[{"h":"On the rooftop","tab":"Snacks","items":[{"k":"Rooftop mixed nuts","c":"s","d":"Soy, honey and sesame roasted nuts and pumpkin seeds.","note":"For a quiet evening above the city."},{"k":"Edamame","c":"s","d":"Salted edamame with a drop of sesame oil.","note":"A small bowl for the rooftop."}]},{"h":"The evening bowl","tab":"Main","items":[{"k":"Teriyaki rice bowl","c":"m","d":"Glazed teriyaki chicken over rice with pickled ginger and spring onion.","note":"A supper inspired by Ghost Dog’s rooftop retreat."}]},{"h":"At Raymond’s truck","tab":"Dessert","items":[{"k":"Coconut ice cream","c":"w","d":"Creamy coconut ice cream scattered with golden toasted coconut.","note":"The ice-cream truck, friendship and books."}]},{"h":"A quiet finish","tab":"Drink","items":[{"k":"Rooftop iced matcha honey lemonade","c":"d","d":"Whisked matcha poured over honey lemonade and ice, green and bitter-sweet, with a lemon wheel and fresh mint.","note":"the quiet samurai on his rooftop with the pigeons"}]}]},
  "King of New York (1990)":{"fmt":"plazanight","brand":"Back at the Plaza","phoneTitle":"King of New York","tag":"Uptown deals. Downtown appetite.","art":{"identity":"/xzAfqbrxCrr2PZfHf0lNuNMsizJ.jpg","suite":"/oAGxvUaSCi1e0mGzt0mYZpFo2Jt.jpg","balcony":"/w4ZfQL03854seq6ivsIvuvr4ATd.jpg"},"groups":[{"h":"Downtown, uptown","tab":"Snacks","items":[{"k":"Chinatown dumplings","c":"s","d":"Crisp pork-and-chive dumplings, black vinegar, soy & chilli oil.","note":"His rivals’ turf."},{"k":"Plaza Hotel prawn cocktail","c":"s","d":"Iced prawns, shredded iceberg & sharp horseradish cocktail sauce.","note":"Frank’s suite on his first night out."}]},{"h":"Frank’s table","tab":"Main","items":[{"k":"Frank's Plaza steak dinner","c":"m","d":"Seared rib eye, creamy brandy-peppercorn sauce & crisp frites.","note":"Room service for the crew."}]},{"h":"New York, naturally","tab":"Dessert","items":[{"k":"New York cheesecake","c":"w","d":"Cream cheese, sour cream & lemon, on a buttery biscuit base.","note":"The only dessert in this town."}]},{"h":"The suite party","tab":"Drink","items":[{"k":"Plaza suite champagne cocktails","c":"d","d":"Bitters, sugar and cognac under brut champagne.","note":"the party in Frank's Plaza suite on his first night out","n":"Champagne cocktails"}]}]},
  "Escape from New York (1981)":{"fmt":"escape","brand":"Dinner on the island","phoneTitle":"Escape from New York","tag":"Get in. Get the President. Get dinner.","art":{"snake":"/hWHBN1Y4NtqWZoMshAnfWmWfewb.jpg","duke":"/uHFsci0Vu5uyJrS68rAk4F7iJNm.jpg","brain":"/dw3UNeXAmePNG6f4AeyVhLb99y5.jpg"},"groups":[{"h":"Before the main","tab":"Snacks","items":[{"k":"Cabbie's smoky chilli beef jerky","c":"s","d":"Thin strips of topside marinated in soy, Worcestershire, smoked paprika and chilli, dried low in the oven until chewy.","note":"Cabbie has been driving that island for years and never stops to eat"},{"k":"Survival tin sardines","c":"s","d":"Sardines on saltines with lemon, hot sauce and fresh parsley.","note":"A city with no shops calls for tins."}]},{"h":"The main course","tab":"Main","items":[{"k":"Scavenger's hobo stew","c":"m","d":"Smoked sausage, potato, carrot, cabbage and beans in a thick paprika tomato broth.","note":"Whatever the Duke’s crew could find."}]},{"h":"Something to keep","tab":"Dessert","items":[{"k":"Ration-pack chocolate oat slice","c":"w","d":"Chewy golden syrup oat slice baked in a tin and topped with a thick layer of dark chocolate and flaky salt.","note":"the kind of thing you'd stash in your pocket on Manhattan prison island"}]},{"h":"From Brain’s place","tab":"Drink","items":[{"k":"Brain's bathtub moonshine sour","c":"d","d":"White whiskey, lemon and sugar, shaken cold and poured over ice.","note":"Brain makes everything himself."}]}]},
  "The Taking of Pelham One Two Three (1974)":{"fmt":"shift","brand":"Shift supper / A New York desk lunch","phoneTitle":"Pelham One Two Three","tag":"Desk lunch. One more call.","art":{"garber":"/6wExV80ulFGjUzbFJ64paFrMVLI.jpg","train":"/syWyIUCzKB0xYiDpKlYbgV7ctGi.jpg","board":"/kwRuHdz4dkElUjJ00F8y50Amo7M.jpg"},"groups":[{"h":"Before the next call","tab":"Snacks","items":[{"k":"Cheese danish","c":"s","d":"Flaky pastry, sweet cream cheese & lemon, finished with a little icing.","note":"Breakfast in the transit dispatch room."},{"k":"Transit office jam doughnuts","c":"s","d":"Warm jam doughnuts, rolled straight into caster sugar.","note":"For the plate in Garber’s command centre."}]},{"h":"The desk lunch","tab":"Main","items":[{"k":"Transit authority hero","c":"m","d":"Turkey, Swiss, shredded iceberg, tomato & mayonnaise in a long roll, wrapped tight.","note":"Garber’s desk lunch."}]},{"h":"Something for later","tab":"Dessert","items":[{"k":"Transit authority rugelach","c":"w","d":"Cream cheese pastry crescents, apricot jam, walnuts & cinnamon sugar.","note":"A sweet bite in the control room."}]},{"h":"One more call","tab":"Drink","items":[{"k":"Mr Green's honey lemon whisky toddy","c":"d","d":"Hot whisky with honey, lemon and fresh ginger, topped up with boiling water and stirred with a cinnamon stick.","note":"for Mr Green, whose sneeze gives the whole game away"}]}]},
  "The French Connection (1971)":{"fmt":"acrossglass","brand":"Across the glass / A bistro supper","phoneTitle":"The French Connection","tag":"Pick your feet, grab a slice.","art":{"popeye":"/wqCmhy8t9l5Ij13q9CN9hVjNrsu.jpg","marseille":"/6RhRspVgZZWFVcGBNV2jaQydjEl.jpg","identity":"/x4QWFMTW2XO8fkB8alg6nsVpVZ7.jpg"},"groups":[{"h":"Both sides of the glass","tab":"Snacks","items":[{"k":"Frog One's bistro pâté","c":"s","d":"Chicken liver pâté, cognac, thyme & butter, with cornichons and warm baguette.","note":"The fancy meal across the road."},{"k":"Stakeout coffee and doughnuts","c":"s","d":"Warm cinnamon-sugar cake doughnuts & drip coffee.","note":"Popeye’s freezing stakeout."}]},{"h":"The meal across the road","tab":"Main","items":[{"k":"Charnier's steak frites","c":"m","d":"Seared sirloin, tarragon béarnaise & twice-fried hand-cut chips.","note":"The meal Popeye watches through the window."}]},{"h":"To finish","tab":"Dessert","items":[{"k":"Crème caramel","c":"w","d":"Vanilla custard, chilled & turned out beneath an amber caramel.","note":"The French dessert across the street."}]},{"h":"Back at the precinct","tab":"Drink","items":[{"k":"Marseille mauresque","c":"d","d":"Aniseed pastis with almond orgeat syrup and ice-cold water, turning cloudy and pale in a tall glass of ice.","note":"a taste of Charnier's Marseille, where the heroin deal begins"}]}]},
  "Serpico (1973)":{"fmt":"serpico","brand":"A Village deli supper","phoneTitle":"Serpico","tag":"One honest cop. No free sandwiches.","art":{"village":"/vIMXCGfGa6P1lk5nh4DHg6mkuYW.jpg","counter":"/x8R4QFngCxW6nBHgrGyD8Fnbwvu.jpg","bike":"/uzZGuyVBT59eVvFlCVyvZ2cPQWC.jpg"},"groups":[{"h":"Before the main","tab":"Snacks","items":[{"k":"Village bagels and lox","c":"s","d":"Toasted bagels with cream cheese, lox, capers, red onion and dill.","note":"Frank’s Greenwich Village life."},{"k":"Deli pastrami on rye","c":"s","d":"Hot pastrami piled on rye with deli mustard and a pickle.","note":"The free lunch Frank insists on paying for."}]},{"h":"The main course","tab":"Main","items":[{"k":"Deli hero, paid for","c":"m","d":"Steamed pastrami heroes with Swiss cheese, coleslaw and Russian dressing.","note":"Frank pays for his own lunch."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Black and white cookies","c":"w","d":"Soft vanilla cookies, iced half vanilla and half chocolate.","note":"The precinct’s split loyalties."}]},{"h":"Paid for, every time","tab":"Drink","items":[{"k":"Village vanilla iced coffee, paid for","c":"d","d":"Cold-brewed coffee with vanilla syrup and creamy milk over ice, a scoop of vanilla ice cream floating on top.","note":"Frank's Greenwich Village life, cash on the counter every time"}]}]},
  "Dog Day Afternoon (1975)":{"fmt":"brooklyn","brand":"Brooklyn takeaway / A long afternoon","phoneTitle":"Dog Day Afternoon","tag":"Pizza for the hostages.","art":{"street":"/95p57k4A7z2V4lf09j4jEKj3VW0.jpg","bank":"/xdMrLGbdNUo4qYwx8q8JbbZrEK3.jpg","summer":"/At9nzn63xR7onfTmMKyuCzx9NPP.jpg"},"groups":[{"h":"Something to pass around","tab":"Snacks","items":[{"k":"Attica chips and onion dip","c":"s","d":"Ridged chips with slow-caramelised onion, sour cream, cream cheese & chives.","note":"For the long, hot afternoon."},{"k":"Deli hero wedges","c":"s","d":"Ham, salami, provolone, lettuce & tomato in heroes, cut into wedges for sharing.","note":"Deli food for everyone behind the counter."}]},{"h":"Delivered to the door","tab":"Main","items":[{"k":"Hostage pizza","c":"m","d":"Thin pepperoni pizzas, tomato, oregano & mozzarella, baked hot.","note":"The delivery that turns the pizza kid into a star."}]},{"h":"Cool down","tab":"Dessert","items":[{"k":"Italian ice","c":"w","d":"Lemon ice, scraped light and fluffy, served in paper cups.","note":"Something cold for a very hot afternoon."}]},{"h":"From the ice","tab":"Drink","items":[{"k":"Heatwave lager with lime and chilli salt","c":"d","d":"Ice-cold lager poured over fresh lime in a glass with a chilli salt rim, sharp and salty for a stinking hot afternoon.","note":"for the cops sweating on the barricade outside the bank"}]}]},
  "Midnight Cowboy (1969)":{"fmt":"southbound","brand":"New York supper / Florida dreams","phoneTitle":"Midnight Cowboy","tag":"Big city. Small bank balance.","art":{"identity":"/48kkHLRbbz7nbIt0J5SMPZcNUim.jpg","night":"/mm8USQF4AdB82RaO7vamUPo0FB4.jpg","bus":"/ihWlJJlhDI56esQaRYUd45YZYJq.jpg"},"groups":[{"h":"The New York counter","tab":"Snacks","items":[{"k":"Automat sandwiches","c":"s","d":"Ham & Swiss on white, mustard butter, crusts off & cut into quarters.","note":"Wrapped in wax paper, from the little glass doors."},{"k":"Cinnamon doughnut holes, coffee custard","c":"s","d":"Hot cinnamon sugar doughnut holes, fried to order, with a little pot of coffee custard for dunking.","note":"the cheap diner breakfasts Joe Buck counts his coins for"}]},{"h":"The Florida dream","tab":"Main","items":[{"k":"Florida coconut prawns","c":"m","d":"Crisp coconut-and-panko prawns, sweet chilli sauce & fresh lime.","note":"The dream down south."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Florida orange cake","c":"w","d":"Whole-orange almond cake, moist, fragrant & golden.","note":"For the bus ride south."}]},{"h":"At the counter","tab":"Drink","items":[{"k":"Ratso's Florida coconut pineapple cooler","c":"d","d":"Coconut water, pineapple and fresh lime shaken with a little coconut cream, poured over ice with a pineapple wedge and white rum on the side.","note":"Ratso's dream of sunshine in Florida"}]}]},
  "Taxi Driver (1976)":{"fmt":"nightshift","brand":"After the shift / New York","phoneTitle":"Taxi Driver","tag":"Late shift. Black coffee. Long night.","art":{"night":"/yu2kQTsQ4wQy2Dp9BbyQrtC0qcs.jpg","cab":"/orjyEE9ZcMefTsN8zT5ryQTdkIz.jpg","cafeteria":"/vj9oH30490pZxDaaTMlgR4Rx74p.jpg"},"groups":[{"h":"For the table","tab":"Snacks","items":[{"k":"Belmore cafeteria fries","c":"s","d":"Thick, twice-fried chips with salt and white vinegar at the table.","note":"The cabbies’ hangout after a shift."},{"k":"Saltines, cheddar and pickles","c":"s","d":"Saltines, sharp cheddar and pickle spears, with hot English mustard.","note":"A cab driver’s small supper."}]},{"h":"The main course","tab":"Main","items":[{"k":"3am open roast beef sandwich","c":"m","d":"Warm roast beef on toast with hot gravy, buttery mash and peas.","note":"The cabbies’ table at 3am."}]},{"h":"Something warm","tab":"Dessert","items":[{"k":"Peach brandy bread pudding","c":"w","d":"White bread, brandy-soaked peaches and vanilla custard, baked warm.","note":"Travis’s breakfast ingredients, made properly."}]},{"h":"Keep the pot on","tab":"Drink","items":[{"k":"Cabbie's peach brandy coffee","c":"d","d":"Strong drip coffee with a nip of peach brandy and brown sugar, topped with a spoon of lightly whipped cream.","note":"the night shift, and the peach brandy Travis pours over everything"}]}]},
  "Home Alone 2: Lost in New York (1992)":{"fmt":"suite","brand":"Room service / A suite supper","phoneTitle":"Home Alone 2","tag":"Room service. Charge it to Dad.","art":{"kevin":"/fomp4QhR30v8apzAhlV8u5KNzOd.jpg","suite":"/ghL9wx7oaz2zMiTcqQkLsOnJBFq.jpg","service":"/ghwvhHjCIxlLX2u3YDYsbq5JIqo.jpg"},"groups":[{"h":"Something from the minibar","tab":"Snacks","items":[{"k":"Plaza minibar mix","c":"s","d":"Buttery rosemary nuts, chocolate almonds & pretzels.","note":"The little refrigerator, put to good use."},{"k":"Plaza room service club sandwiches","c":"s","d":"Triple-decker toast with chicken, crisp bacon, lettuce, tomato & mayonnaise.","note":"Charged straight to Dad’s credit card."}]},{"h":"The grand supper","tab":"Main","items":[{"k":"Lobster mac and cheese","c":"m","d":"Macaroni in Gruyère & cheddar sauce, butter-poached lobster and golden crumbs.","note":"A very grand room-service supper."}]},{"h":"The works. Every topping.","tab":"Dessert","items":[{"k":"Room service sundae","c":"w","d":"Vanilla ice cream, hot fudge, whipped cream, nuts, sprinkles & a cherry.","note":"Every topping, piled high."}]},{"h":"After Central Park","tab":"Drink","items":[{"k":"Hot apple cider","c":"d","d":"Warm apple juice, cinnamon, cloves & orange. Alcohol-free.","note":"Winter in Central Park, in a warm mug."}]}]},
  "Spider-Man (2002)":{"fmt":"maytable","brand":"Aunt May’s family table","phoneTitle":"Spider-Man","tag":"With great snacks comes great responsibility.","art":{"thanksgiving":"/fBOLKAMjrp3rUmcWnIywgJCFk6F.jpg","mayben":"/v5SRY3dxc5scK6471bvPKQ5g8lw.jpg","identity":"/no2cllXSRA56LPipQnuPlg3RuTL.jpg"},"groups":[{"h":"Before school, before supper","tab":"Snacks","items":[{"k":"Bone Saw egg and cheese rolls","c":"s","d":"Fried eggs, melted American cheese & hot sauce, on soft bodega rolls.","note":"three minutes in the ring, then breakfast"},{"k":"Thanksgiving sliders","c":"s","d":"Warm roast turkey, cranberry sauce & crisp stuffing, in toasted mini rolls.","note":"A little of the awkward Osborn dinner."}]},{"h":"Aunt May’s Thanksgiving","tab":"Main","items":[{"k":"Aunt May's Thanksgiving roast","c":"m","d":"Brined roast turkey breast, stuffing, pan gravy, roast potatoes & pumpkin.","note":"The family meal Norman interrupts."}]},{"h":"Something from May","tab":"Dessert","items":[{"k":"With-great-power pancakes","c":"w","d":"Fluffy buttermilk pancakes, stacked high with maple syrup.","note":"Uncle Ben's advice, served with syrup"}]},{"h":"A Queens classic","tab":"Drink","items":[{"k":"Daily Bugle cherry lime rickey","c":"d","d":"Fresh lime, cherry syrup & soda water, with a cherry on top.","note":"J. Jonah wants pictures, you want a drink"}]}]},
  "Spider-Man 2 (2004)":{"fmt":"pizzatime","brand":"New York / Pizza time","phoneTitle":"Spider-Man 2","tag":"Pizza time.","art":{"delivery":"/gqwkWnH1YAd3uRcT3d9VPk0715z.jpg","peter":"/me6ehKZCupiBp4QVZ340V3R5lNA.jpg","may":"/aL9kGBS6JJcBf433LuwyGV2s4wb.jpg"},"groups":[{"h":"Before the rush","tab":"Snacks","items":[{"k":"Joe's Pizza garlic knots","c":"s","d":"Golden dough knots tossed in garlic butter and fresh parsley.","note":"Peter’s delivery job, before the rush."},{"k":"Potato knishes","c":"s","d":"Hot potato and onion knishes, baked golden and served with yellow mustard.","note":"For the walk to class."}]},{"h":"The main delivery","tab":"Main","items":[{"k":"Thirty-minute pepperoni pie","c":"m","d":"Thin crisp pizza with crushed tomato, mozzarella and cupping pepperoni.","note":"Joe’s Pizza, late again.","n":"Joe’s pepperoni pizza"}]},{"h":"Back at Aunt May’s","tab":"Dessert","items":[{"k":"Aunt May's pancakes","c":"w","d":"Fluffy buttermilk pancakes, cooked in butter and stacked with maple syrup.","note":"For when Peter comes home."}]},{"h":"Running late","tab":"Drink","items":[{"k":"Iced coffee","c":"d","d":"Cold brew, milk, ice and a scoop of vanilla ice cream.","note":"Peter is always late."}]}]},
  "Teenage Mutant Ninja Turtles II: The Secret of the Ooze (1991)":{"fmt":"ooze","brand":"Second helpings / The Secret of the Ooze","phoneTitle":"TMNT II","tag":"Go ninja, go ninja, go eat.","art":{"lair":"/fxqWqgf8hBJeGy8ixqo0Rv6I1Bd.jpg","chemistry":"/kCR9RF4xddSnVNSycsKaKOYh8DM.jpg","club":"/vU0xIBU3wYbNZ1LNgRc8kbgHFlF.jpg"},"groups":[{"h":"First helpings","tab":"Snacks","items":[{"k":"TGRI ooze dip","c":"s","d":"Guacamole with lime, red onion, coriander & chilli. Corn chips for dipping.","note":"scooped straight from the research canister"},{"k":"Sewer lair pizza bagels","c":"s","d":"Mini bagels, pizza sauce, bubbling mozzarella & pepperoni.","note":"The Turtles never stop at one pizza."}]},{"h":"Second helpings","tab":"Main","items":[{"k":"Late-pizza pepperoni and pineapple pie","c":"m","d":"Thin pizza base, tomato sauce, mozzarella, pepperoni, fresh pineapple & jalapeño.","note":"never pay full price for late pizza"}]},{"h":"Mutagen sweet stuff","tab":"Dessert","items":[{"k":"Tokka and Rahzar mint choc shakes","c":"w","d":"Mint choc chip ice cream & cold full cream milk, blended thick.","note":"two mutant babies, one shake each"}]},{"h":"A safe batch","tab":"Drink","items":[{"k":"Ooze canister lime and kiwi slushie","c":"d","d":"Kiwifruit, lime juice and lemonade blitzed with ice into a bright green slush, served with a fat straw.","note":"a safe batch of ooze, nothing mutagenic in it"}]}]},
  "Ghostbusters II (1989)":{"fmt":"moodslime","brand":"Museum-night supper","phoneTitle":"Ghostbusters II","tag":"Bad vibes. Good dip.","art":{"vigo":"/z5NtDzIL0ohZSddJkoHOZjm3JmD.jpg","toaster":"/ux9t4fjjch9ovAeUmXq6HXm2NtJ.jpg","liberty":"/sJjo7rcwgwtu3gdTAshsgWdAfvq.jpg","mark":"/lyOqmxL9tSLblrV0qo67Z1Bc8i9.jpg"},"groups":[{"h":"Positively charged starters","tab":"Snacks","items":[{"k":"Pink slime dip","c":"s","d":"Roast beetroot, feta, yoghurt, garlic, lemon & dill. Warm flatbread alongside.","note":"The pink mood slime, made for scooping."},{"k":"Dancing toaster crumpets","c":"s","d":"Crisp toasted crumpets, whipped honey butter & a pinch of salt.","note":"The slime makes the toaster dance."}]},{"h":"The Carpathian main course","tab":"Main","items":[{"k":"Vigo's goulash","c":"m","d":"Slow paprika beef, sweet onions & caraway, with egg noodles and sour cream.","note":"A substantial supper for the Carpathian painting."}]},{"h":"Good vibrations","tab":"Dessert","items":[{"k":"Pink lemonade jelly","c":"w","d":"Pink lemonade jelly, raspberries & something upbeat on the stereo.","note":"It wobbles and reacts to music."}]},{"h":"Drink something pink","tab":"Drink","items":[{"k":"Pink lemonade with sherbet","c":"d","d":"Chilled pink lemonade over raspberry sorbet.","note":"The pink slime, but drinkable."}]}]},
  "Road to Perdition (2002)":{"fmt":"perdition","brand":"A supper for the road","phoneTitle":"Road to Perdition","tag":"Every father wants better for his son.","art":{"diner":"/6WGb3RK0ugA4sr18YFSFAGAicc.jpg","car":"/s8vzpUCTtIpA25wnIyl7srLNVFG.jpg","wake":"/9w4RSU4tGs33XEUYKN7wnW4BA0W.jpg"},"groups":[{"h":"Before the supper","tab":"Snacks","items":[{"k":"Diner grilled cheese with quick pickles","c":"s","d":"Sharp cheddar grilled cheese fried in butter until crisp, cut into fingers and served with sweet dill bread-and-butter pickles.","note":"the roadside diners across Illinois where Sullivan and his son stop"},{"k":"Wake table soda bread","c":"s","d":"Warm Irish soda bread with salted butter and sharp cheddar.","note":"The Rooney wake."}]},{"h":"The Irish supper","tab":"Main","items":[{"k":"Corned beef and cabbage","c":"m","d":"Slow-simmered corned beef, buttery cabbage, carrots and potatoes, with hot mustard.","note":"An Irish wake supper."}]},{"h":"At the diner stop","tab":"Dessert","items":[{"k":"Apple pie with cheddar","c":"w","d":"Deep apple pie with a slice of sharp cheddar melted over the top.","note":"A farmhouse finish for the journey."}]},{"h":"Keep the pot warm","tab":"Drink","items":[{"k":"Rooney wake Irish coffee","c":"d","d":"Hot strong coffee with Irish whiskey and brown sugar, under a thick collar of lightly whipped cream.","note":"the Rooney wake, 1931, whiskey poured freely for the dead"}]}]},
  "The Departed (2006)":{"fmt":"southie","brand":"Southie supper / A Boston pub table","phoneTitle":"The Departed","tag":"Two rats. One city. Plenty of chowder.","art":{"boston":"/xCYUcZJhMYyhJRR9DPCiXBs2fcJ.jpg","table":"/jSLzBS5AkYescSJ889HU6oI8dT8.jpg","bar":"/hXc9wSsrRUM7d72ztZUVe48yJMt.jpg"},"groups":[{"h":"Start at the bar","tab":"Snacks","items":[{"k":"Boston clam chowder cups","c":"s","d":"Creamy clam & potato chowder with bacon and oyster crackers.","note":"A cup of Boston comfort."},{"k":"Irish soda bread and butter","c":"s","d":"Warm Irish soda bread, sliced thick and spread with salted butter.","note":"For Costello’s South Boston crowd."}]},{"h":"The Southie supper","tab":"Main","items":[{"k":"Southie fish and chips","c":"m","d":"Lager-battered flathead, chips, minted mushy peas & malt vinegar.","note":"A generous pub supper, before the covers come off."}]},{"h":"A Boston original","tab":"Dessert","items":[{"k":"Boston cream pie","c":"w","d":"Two sponge layers, vanilla custard & glossy dark chocolate ganache.","note":"The Boston original."}]},{"h":"Costigan’s order","tab":"Drink","items":[{"k":"Costigan's cranberry lime crush","c":"d","d":"Cranberry juice shaken with fresh lime and a little orange, topped with soda over crushed ice, vodka optional if you need to keep your cover.","note":"Costigan's bar order, a natural diuretic, and the bartender's remark"}]}]},
  "Things to Do in Denver When You're Dead (1995)":{"fmt":"boatdrinks","brand":"One last good supper","phoneTitle":"Things to Do in Denver","tag":"Boat drinks.","art":{"identity":"/leRn0oica2eb5d1Mf84yrztbQln.jpg","dinner":"/f0vJcGr7cKi7BhR6TAXhravdA64.jpg","diner":"/hMo3Hp1CFVJNnGcyO2EuXMOhRXz.jpg"},"groups":[{"h":"Before the job","tab":"Snacks","items":[{"k":"Afterlife Advice deviled eggs","c":"s","d":"Eggs with Dijon, mayonnaise, pickle juice, smoked paprika & chives.","note":"Jimmy’s video business for the dying."},{"k":"Green chile queso","c":"s","d":"Hot white-cheese dip, roasted green chiles, garlic & cumin. Corn chips alongside.","note":"Colorado green chile, with chips for dunking."}]},{"h":"The diner special","tab":"Main","items":[{"k":"Patty melt","c":"m","d":"Griddled beef patty, Swiss cheese & slow-cooked onions, on butter-crisp rye.","note":"The diner booth where the job gets planned."}]},{"h":"Mile-high finish","tab":"Dessert","items":[{"k":"Mile-high sopapillas","c":"w","d":"Puffed fried pastry pillows, warm honey & cinnamon.","note":"A Colorado dessert for Jimmy’s last good night."}]},{"h":"The toast","tab":"Drink","items":[{"k":"Boat drink piña coladas","c":"d","d":"White rum blended thick with pineapple, coconut cream and ice, served with a toasted coconut rim and a cocktail umbrella.","note":"boat drinks, Jimmy's crew's catchphrase"}]}]},
  "Saturday Night Fever (1977)":{"fmt":"fever","brand":"Brooklyn / Before the Odyssey","phoneTitle":"Saturday Night Fever","tag":"Strut in. Fold your slice. Strut out.","art":{"dance":"/go7fxk1rzCvKXiK0tumJFHAId3n.jpg","walk":"/cMPKKNpTSDa79aiRSC2Izle0oBA.jpg","diner":"/tl60o9UmErHzaUo6gTHnAcUCFib.jpg"},"groups":[{"h":"Before the Odyssey","tab":"Snacks","items":[{"k":"Bay Ridge sausage and peppers","c":"s","d":"Grilled Italian sausage bites with sweet capsicum, onion and a splash of red wine vinegar.","note":"For the paint-store crew’s Saturday."},{"k":"Disco fries","c":"s","d":"Crisp fries smothered in hot beef gravy and melted mozzarella.","note":"For the walk home after the club."}]},{"h":"The 86th Street main","tab":"Main","items":[{"k":"Two slices stacked","c":"m","d":"Thin New York pizza with tomato, oregano and mozzarella, cut big, stacked two high and folded.","note":"Tony’s opening walk, slice in hand."}]},{"h":"Under the lights","tab":"Dessert","items":[{"k":"Disco ball cake pops","c":"w","d":"Butter cake and cream cheese, dipped in white chocolate and silver cachous.","note":"Silver sprinkles under the lights."}]},{"h":"At the Odyssey bar","tab":"Drink","items":[{"k":"2001 Odyssey whisky lemon fizz","c":"d","d":"Blended whisky shaken with lemon and sugar syrup, topped with lemonade and soda over ice, finished with a lemon wheel.","note":"a round at the bar of the 2001 Odyssey disco"}]}]},
  "Raging Bull (1980)":{"fmt":"cornerside","brand":"After the bell / A boxing-club supper","phoneTitle":"Raging Bull","tag":"Fight hard. Eat harder.","art":{"ring":"/7iMB9Vbu4vrSqAU01Y0OSMLtPoN.jpg","table":"/fmm4f3K268UrIOZ8D49xPA7gHnn.jpg","club":"/bBho6nQwe5oaIhkHGW4b3TcJ78l.jpg"},"groups":[{"h":"Before the bell","tab":"Snacks","items":[{"k":"Bronx devilled eggs with crisp pancetta","c":"s","d":"Jammy-yolked eggs piped with mustard and mayo filling, topped with crisp pancetta, paprika and chives.","note":"Jake's Miami club years, working the room between tables"},{"k":"Copacabana prawns","c":"s","d":"Chilled prawns with sharp tomato, horseradish & lemon cocktail sauce.","note":"A taste of Jake’s nightclub world."}]},{"h":"The main event","tab":"Main","items":[{"k":"Jake's steak","c":"m","d":"Dry-brined porterhouse, seared hard & basted with butter, garlic and thyme.","note":"Cooked properly this time."}]},{"h":"After the bell","tab":"Dessert","items":[{"k":"Ricotta cake","c":"w","d":"Baked lemon & vanilla ricotta cake, dusted with icing sugar.","note":"A slice from the Bronx bakery."}]},{"h":"In the clubhouse","tab":"Drink","items":[{"k":"Jake's Miami club rum punch","c":"d","d":"Golden rum with orange, pineapple and lime, a splash of grenadine, served long over crushed ice with an orange slice.","note":"Jake's Miami nightclub years, telling jokes from the stage"}]}]},
  "The Freshman (1990)":{"fmt":"carmine","brand":"Dinner with Carmine","phoneTitle":"The Freshman","tag":"Some lessons aren’t taught at film school.","art":{"identity":"/6a491QMcB15uqFukwrOy8JWZgNb.jpg","club":"/za5pMd8YxIzP2TbziJ4zO1XAnmx.jpg","drive":"/3A09C2RE7h1OVgJD5pczhCl9hqu.jpg"},"groups":[{"h":"The social club","tab":"Snacks","items":[{"k":"Gourmet Club antipasto, all legal","c":"s","d":"Salami, mortadella, provolone, roasted capsicum, artichokes & torn Italian bread.","note":"the secret supper club where the menu is the scandal"},{"k":"Little Italy fried calamari","c":"s","d":"Lightly crisp squid rings, fresh lemon & warm marinara.","note":"From Carmine’s Little Italy neighbourhood."}]},{"h":"Dinner with Carmine","tab":"Main","items":[{"k":"Carmine Sabatini's veal marsala","c":"m","d":"Butter-seared veal, mushrooms & a rich marsala pan sauce.","note":"an offer Clark can't quite refuse"}]},{"h":"For the drive back to campus","tab":"Dessert","items":[{"k":"Cannoli","c":"w","d":"Vanilla ricotta, mini chocolate chips & pistachio-tipped shells.","note":"A box from Little Italy for the drive back to campus."}]},{"h":"At Carmine’s table","tab":"Drink","items":[{"k":"Carmine's amaro spritz","c":"d","d":"Italian amaro and prosecco over ice with a splash of soda and a slice of orange, bittersweet and easy to drink.","note":"Carmine's table, where the glasses never stay empty"}]}]},
  "Get Shorty (1995)":{"fmt":"shorty","brand":"Miami / Hollywood","phoneTitle":"Get Shorty","tag":"Look at me. Now pass the dip.","art":{"lunch":"/7mbBY0I99nLegO8rcmdLKSU8y28.jpg","karen":"/7KpwYPe6DfxutCFzJRpaTPtFu2o.jpg","pitch":"/tGkirn96Mdh2D6r16IlyLhpw8xx.jpg"},"groups":[{"h":"Before Los Angeles","tab":"Snacks","items":[{"k":"Ray Bones' Miami croquetas","c":"s","d":"Crisp ham croquettes with a creamy centre, straight from Chili’s Miami.","note":"Bones should have left Chili's leather jacket alone"},{"k":"Cuban pastelitos","c":"s","d":"Golden puff pastry filled with guava paste and cream cheese, dusted with sugar.","note":"A little Miami before the Hollywood meetings."}]},{"h":"Chili’s main course","tab":"Main","items":[{"k":"Chili Palmer's steak frites","c":"m","d":"Seared sirloin, shallot and red wine butter sauce, with crisp double-fried frites.","note":"He knows exactly how a scene should go."}]},{"h":"Harry’s B-movie finish","tab":"Dessert","items":[{"k":"Harry Zimm's B-movie popcorn sundae","c":"w","d":"Vanilla ice cream, hot fudge, caramel popcorn and salted peanuts.","note":"the schlock horror producer who needs one good script"}]},{"h":"The Hollywood morning","tab":"Drink","items":[{"k":"Look-at-me Bloody Mary","c":"d","d":"Vodka, tomato, lemon and a little heat, finished with a celery stick.","note":"Chili's whole acting lesson in two words"}]}]},
  "Bugsy (1991)":{"fmt":"flamingo","brand":"An opening-night supper at the Flamingo","phoneTitle":"Bugsy","tag":"A grand idea. An opening night to remember.","art":{"desert":"/fBcQZtzSVEEUAlLmHPnex7p4Doe.jpg","hollywood":"/y2lcTeLo00wsDrvNBTYTnNbwcQw.jpg","party":"/4bAhd0vvxvr8KRfDhimwrT8kdBk.jpg"},"groups":[{"h":"The Hollywood party","tab":"Snacks","items":[{"k":"Hollywood party blini and caviar","c":"s","d":"Warm buckwheat blini, crème fraîche, salmon roe & snipped chives.","note":"A little of Bugsy’s Hollywood set."},{"k":"Brown Derby Cobb salad cups","c":"s","d":"Chicken, bacon, avocado, egg, tomato & blue cheese in little gem cups.","note":"For the forties Hollywood crowd."}]},{"h":"The opening-night plate","tab":"Main","items":[{"k":"Flamingo steak Diane","c":"m","d":"Scotch fillet in a brandy, shallot, Dijon & cream sauce, finished in the pan.","note":"A supper-club flourish for opening night."}]},{"h":"The hotel’s namesake","tab":"Dessert","items":[{"k":"Pink flamingo pavlova","c":"w","d":"Airy meringue piled with whipped cream & crushed raspberries.","note":"A pink finish for the hotel’s namesake."}]},{"h":"For Virginia","tab":"Drink","items":[{"k":"Virginia Hill's gin rickey","c":"d","d":"Gin, fresh lime & soda over ice, with the squeezed lime shell.","note":"A crisp glass for Virginia Hill."}]}]},
  "Miller's Crossing (1990)":{"fmt":"highhat","brand":"At Leo’s table","phoneTitle":"Miller's Crossing","tag":"What’s the rumpus?","art":{"room":"/5bexlk8IbU4M3uG1EgUUJ9HsXzU.jpg","hat":"/qMfJPDviH3AVbZ8FMmcpdqxkj6n.jpg","identity":"/4V2yyI65Ai2UhbKG014JUlv4Wfg.jpg"},"groups":[{"h":"Before the business","tab":"Snacks","items":[{"k":"What's-the-rumpus liver pâté toasts","c":"s","d":"Silky chicken liver pâté, brandy, thyme & clarified butter, with rye toast.","note":"Leo's greeting when Tom walks in"},{"k":"Johnny Caspar's cheese straws","c":"s","d":"Twisted puff pastry, aged cheddar, parmesan & a pinch of cayenne.","note":"it's a question of ethics, Johnny says"}]},{"h":"Leo’s supper","tab":"Main","items":[{"k":"Leo's Danny Boy Irish stew","c":"m","d":"Tender lamb neck chops, potatoes, onions & carrots, braised slowly in stout and stock.","note":"put the record on and let it simmer low"}]},{"h":"A little comfort","tab":"Dessert","items":[{"k":"Whisky bread pudding","c":"w","d":"Buttered brioche, whiskey-soaked raisins & rich baked custard.","note":"Tom’s drink, Leo’s dessert."}]},{"h":"Tom’s glass","tab":"Drink","items":[{"k":"Tom Reagan's hot Irish whiskey toddy","c":"d","d":"Irish whiskey with honey, lemon and hot water, a clove-studded lemon wheel and a cinnamon stick to stir.","note":"Tom never puts his glass down, whatever the weather"}]}]},
  "The Pope of Greenwich Village (1984)":{"fmt":"village","brand":"A neighbourhood supper","phoneTitle":"Greenwich Village","tag":"Big plans. Small cousins. Bad luck.","art":{"cousins":"/kaOHHcQz5lJ3MOx45WWu1OBMuqn.jpg","restaurant":"/kTwweg7r2XBU38CNjRt3KPmit3V.jpg","bar":"/t09figM04eJ7rnwAbtRnVHej3tD.jpg"},"groups":[{"h":"To begin","tab":"Snacks","items":[{"k":"Bed Bug Eddie's clams oreganata","c":"s","d":"Clams under golden garlic, oregano and parmesan crumbs.","note":"the boss nobody crosses, Paulie least of all"},{"k":"Waiter's antipasto","c":"s","d":"Prosciutto on ripe rockmelon, with bocconcini dressed in basil oil.","note":"A plate from Charlie’s working life."}]},{"h":"The main course","tab":"Main","items":[{"k":"Veal marsala","c":"m","d":"Seared veal escalopes in a glossy mushroom and marsala sauce.","note":"For the restaurant Charlie dreams of."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Zabaglione","c":"w","d":"Warm whisked marsala custard, spooned over fresh strawberries.","note":"A flourish at the table."}]},{"h":"Poured with a flourish","tab":"Drink","items":[{"k":"Charlie's Americano on Paulie's tab","c":"d","d":"Bitter red aperitivo and sweet vermouth over ice, topped with cold soda and a fat slice of orange.","note":"Paulie always has a plan, never the money"}]}]},
  "Mickey Blue Eyes (1999)":{"fmt":"collection","brand":"The family collection / A supper catalogue","phoneTitle":"Mickey Blue Eyes","tag":"Marry the girl. Marry the family.","art":{"family":"/ubzEOsAItmoFuEUppGqaDzq4gR2.jpg","couple":"/tPdfPUdv6cZ1i0NC8SAZbDky77n.jpg","lesson":"/5FNiyS5m6JXXmPEFG7YWAqcTrFz.jpg"},"groups":[{"h":"An English beginning","tab":"Snacks","items":[{"k":"English tea sandwiches","c":"s","d":"Crustless fingers of cucumber, egg & cress, and smoked salmon with cream cheese.","note":"A little auction-house gentility."},{"k":"Kansas City Mickey's fried ravioli","c":"s","d":"Crisp crumbed ricotta ravioli, warm marinara & parmesan.","note":"Michael's cover story, Mickey Blue Eyes from Kansas City"}]},{"h":"The family table","tab":"Main","items":[{"k":"Frank Vitale's linguine with clams","c":"m","d":"Linguine tossed in garlicky white wine clam juices, parsley & good olive oil.","note":"Gina's dad's restaurant, where the family drops in"}]},{"h":"If the wedding happens","tab":"Dessert","items":[{"k":"Fuhgeddaboudit tiramisu","c":"w","d":"Espresso-soaked biscuits, marsala mascarpone cream & a dusting of cocoa.","note":"Michael's accent lesson, say it slower"}]},{"h":"For a nervous Englishman","tab":"Drink","items":[{"k":"Auction house gin and elderflower collins","c":"d","d":"Gin shaken with elderflower cordial and lemon, topped with soda over ice with ribbons of cucumber and fresh mint.","note":"for Michael, a very nervous English auctioneer"}]}]},
  "Analyze This (1999)":{"fmt":"sobelsupper","brand":"Dinner with Paul & Ben","phoneTitle":"Analyze This","tag":"Therapy, but make it Italian.","art":{"identity":"/tPBodw4G6oxp4tNtJk22I7M4tHU.jpg","dinner":"/bSnAYSsplBnJG1LIJg8C8waiXLe.jpg","conversation":"/f3jxmmss2gResW78WXv4BMCQKBM.jpg"},"groups":[{"h":"Start talking","tab":"Snacks","items":[{"k":"Sobel wedding fried calamari","c":"s","d":"Crisp semolina-coated squid rings, salt & fresh lemon.","note":"the Miami wedding Vitti's crew keeps interrupting"},{"k":"Mozzarella in carrozza","c":"s","d":"Golden crumbed mozzarella sandwiches, fried until the cheese melts.","note":"A little comfort food."}]},{"h":"The comfort course","tab":"Main","items":[{"k":"Paul Vitti's veal parm","c":"m","d":"Crumbed veal, marinara, bubbling mozzarella & parmesan. Spaghetti alongside.","note":"A big plate for Paul."}]},{"h":"Emotional support dessert","tab":"Dessert","items":[{"k":"You're good, you cannoli","c":"w","d":"Ricotta, orange zest & chocolate-dipped shells.","note":"what Vitti tells his shrink, and what you'll tell the cook"}]},{"h":"At the table","tab":"Drink","items":[{"k":"Dr. Sobel's calming Negroni","c":"d","d":"Gin, bitter red aperitif & sweet vermouth, over ice with orange.","note":"for when a patient turns up at 3am"}]}]},
  "Prizzi's Honor (1985)":{"fmt":"prizzis","brand":"A Prizzi wedding supper","phoneTitle":"Prizzi’s Honor","tag":"Love, honour and a very complicated wedding.","art":{"couple":"/rG7onCWPZpFGP1cNvMy4jRnsCnm.jpg","family":"/2KWUR87bUjCfk5HGQCUTbpYFBnd.jpg","dinner":"/upkMxCHS22p9jKhoacaZ5J9jQcW.jpg"},"groups":[{"h":"At the wedding","tab":"Snacks","items":[{"k":"Prizzi wedding antipasto","c":"s","d":"Lemon-marinated mushrooms, salami, mixed olives and tender artichokes.","note":"For the family reception."},{"k":"Fried zucchini","c":"s","d":"Crisp battered zucchini batons, finished with salt and fresh lemon.","note":"A little wedding-table crunch."}]},{"h":"At the Prizzi table","tab":"Main","items":[{"k":"Don Corrado's baked ziti","c":"m","d":"Slow sausage sugo, seasoned ricotta and mozzarella, baked until blistered.","note":"The old man’s favourite."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Wedding almond cookies","c":"w","d":"Crackled amaretti with almond meal, sugar and a snowy icing coat.","note":"For the very complicated wedding."}]},{"h":"The wedding toast","tab":"Drink","items":[{"k":"Prizzi wedding white peach Bellini","c":"d","d":"Fresh white peach purée topped slowly with cold prosecco in flutes, with a squeeze of lemon to keep it bright.","note":"the toast at the Prizzi wedding where Charley first spots Irene"}]}]},
  "Scarface (1983)":{"fmt":"miami","brand":"A Cuban supper in Miami","phoneTitle":"Scarface","tag":"The world is yours. So is the last croqueta.","art":{"counter":"/fRntDCFoKTJGTfPpGbTgi5rK02V.jpg","blimp":"/7dAGeHU2p9r0sBNUGr495xZ0i1l.jpg","babylon":"/nM9XtiH9MDzVk3vfYyfjrlwOEpV.jpg"},"groups":[{"h":"From the counter","tab":"Snacks","items":[{"k":"Freedom Town croquetas de jamón","c":"s","d":"Creamy serrano ham croquettes with a crisp golden crumb.","note":"camp food from under the freeway, before the green card"},{"k":"Tostones","c":"s","d":"Twice-fried green plantain, smashed flat, with garlic & lime mojo.","note":"A crisp side from the Cuban counter."}]},{"h":"The Cuban supper","tab":"Main","items":[{"k":"Ropa vieja","c":"m","d":"Shredded flank steak in tomato sofrito with capsicum & olives. Rice and black beans alongside.","note":"A generous Cuban supper, before the night begins."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"The World Is Yours guava pastelitos","c":"w","d":"Flaky puff pastry parcels filled with guava paste & cream cheese.","note":"read it off the blimp over Miami"}]},{"h":"Miami in a glass","tab":"Drink","items":[{"k":"Babylon Club mojito","c":"d","d":"White rum, lime & mint over crushed ice, topped with soda.","note":"Tony's booth at the Babylon, before it all goes sideways"}]}]},
  "Mean Streets (1973)":{"fmt":"afterhours","brand":"Tony’s bar / After hours","phoneTitle":"Mean Streets","tag":"Sins in the street. Penance at the bar.","art":{"bar":"/r238w4lfSfSFC5KrV7L4sI2ZrSW.jpg","church":"/qdecDSIVoqctIoYoOhLH3TgSYLD.jpg","identity":"/pKQ5CQpchLtqV1L14i91GKI7kGp.jpg"},"groups":[{"h":"From the street to the bar","tab":"Snacks","items":[{"k":"San Gennaro sausage bites","c":"s","d":"Blistered Italian sausage, charred onion & capsicum, with hot mustard.","note":"Straight from the street feast."},{"k":"Fried calamari","c":"s","d":"Tender squid rings, crisp semolina coating & fresh lemon.","note":"A plate at Tony’s bar."}]},{"h":"The supper selection","tab":"Main","items":[{"k":"Penne arrabbiata","c":"m","d":"Penne, fiery garlic, chilli & tomato sauce, parsley & pecorino.","note":"As hot as Johnny Boy’s temper."}]},{"h":"Back to the feast","tab":"Dessert","items":[{"k":"Zeppole","c":"w","d":"Hot fried dough puffs, shaken in a paper bag of icing sugar.","note":"Eat them hot from the street feast."}]},{"h":"Another round","tab":"Drink","items":[{"k":"San Gennaro red wine with white peaches","c":"d","d":"Chilled light red poured over sliced white peaches and left to soak, served in tumblers with the boozy fruit spooned in.","note":"the San Gennaro feast, poured from a jug the old Italian way"}]}]},
  "Donnie Brasco (1997)":{"fmt":"leftys","brand":"A social-club supper","phoneTitle":"Donnie Brasco","tag":"Forget about it.","art":{"club":"/bIH9GtOCgX9lPAZd2HmV3QOSZY3.jpg","florida":"/6Wm3FD6ruJtU2xdK63H94Jk6qXs.jpg","street":"/cPeav0OqcUt852oFXrD6EHmHNOm.jpg"},"groups":[{"h":"For the table","tab":"Snacks","items":[{"k":"Miami garlic prawns","c":"s","d":"Butterflied prawns with garlic, chilli, white wine and butter. Bread for the pan juices.","note":"A taste of the Florida trip."},{"k":"Fried mozzarella","c":"s","d":"Golden crumbed mozzarella fingers with warm tomato sauce for dipping.","note":"For the table between conversations."}]},{"h":"The main course","tab":"Main","items":[{"k":"Shoes-on teriyaki steak","c":"m","d":"Seared sirloin brushed with sticky teriyaki, served with steamed rice and greens.","note":"The Japanese restaurant scene, shoes and all."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Ricotta cheesecake","c":"w","d":"Light baked ricotta cheesecake with lemon and vanilla.","note":"A quiet sweet finish for Lefty."}]},{"h":"At the social club","tab":"Drink","items":[{"k":"Social club Rob Roy","c":"d","d":"Blended Scotch stirred with sweet vermouth and aromatic bitters, served over a big ice cube with a cherry and orange peel.","note":"Sonny Black's social club, where everyone drinks Scotch"}]}]},
  "Carlito's Way (1993)":{"fmt":"paraiso","brand":"A supper at El Paraíso","phoneTitle":"Carlito’s Way","tag":"One last supper. Then paradise.","art":{"carlito":"/85TPtTOJQRrSbITpp2uHAMzdiY8.jpg","club":"/x74pR0yss8Z2sauP4tr9TFrNvRj.jpg","paradise":"/8ESoIezvK2ZlUMH0woyv7NKgHd9.jpg"},"groups":[{"h":"From El Barrio","tab":"Snacks","items":[{"k":"Bacalaitos","c":"s","d":"Lacy salt cod fritters with garlic & coriander.","note":"Something crisp before the night begins."},{"k":"Tostones","c":"s","d":"Twice-fried green plantain, smashed flat and finished with garlic & lime mojo.","note":"A taste of El Barrio."}]},{"h":"The Puerto Rican table","tab":"Main","items":[{"k":"Pernil","c":"m","d":"Garlic & oregano roast pork shoulder with crackling, rice and pigeon peas.","note":"A generous Puerto Rican supper, before paradise."}]},{"h":"One last temptation","tab":"Dessert","items":[{"k":"Paradise flan","c":"w","d":"Coconut caramel flan, baked slowly and turned out cold.","note":"For the paradise Carlito keeps dreaming of."}]},{"h":"From the club bar","tab":"Drink","items":[{"k":"El Paraiso dark rum pineapple punch","c":"d","d":"Dark rum shaken with pineapple, fresh lime and a little spiced syrup, served long over ice with grated nutmeg.","note":"Carlito's club El Paraiso, and the paradise he keeps planning to run to"}]}]},
  "Once Upon a Time in America (1984)":{"fmt":"delancey","brand":"A supper in five memories","phoneTitle":"Once Upon a Time in America","tag":"Fifty years of friendship, one very long dinner.","art":{"bridge":"/uPYa165sraN2c8gZBM9C47g3JoU.jpg","boys":"/VAMjq0EgIcH52uVjO9aXcZKQnP.jpg","supper":"/ikOnmhyPk8BFz7Zie1Do9BuMike.jpg"},"groups":[{"h":"From the deli counter","tab":"Snacks","items":[{"k":"Delancey Street knishes","c":"s","d":"Buttery potato & slow-cooked onion in golden puff pastry. Hot mustard alongside.","note":"Lower East Side street food, in a paper bag."},{"k":"Bagel crisps with schmear","c":"s","d":"Baked bagel crisps, chive cream cheese, lemon zest & smoked salmon.","note":"A taste of the Lower East Side deli counter."}]},{"h":"The back room","tab":"Main","items":[{"k":"Fat Moe's back room brisket","c":"m","d":"Slow-braised beef on sweet onions, sliced thick with rich paprika & tomato gravy.","note":"Supper in the speakeasy back room."}]},{"h":"On the stairs","tab":"Dessert","items":[{"k":"Patsy's charlotte russe","c":"w","d":"Sponge cups, vanilla cream piped high & a maraschino cherry.","note":"Try not to eat it on the stairs."}]},{"h":"After closing","tab":"Drink","items":[{"k":"Fat Moe's rye whiskey sour in teacups","c":"d","d":"Rye, lemon and egg white, shaken hard and poured into china teacups.","note":"the speakeasy behind Fat Moe's"}]}]},
  "The Godfather Part III (1990)":{"fmt":"palermo","brand":"An evening in Sicily","phoneTitle":"The Godfather III","tag":"Una sera in Sicilia.","art":{"opera":"/2wcLmn97sFgE1CBJzYhtkjofhZx.jpg","sicily":"/mHGcW37btUWXnkSalEm5IEEqseT.jpg","cannoli":"/8P7Eq8kJWefWkISfFVrdPQvJRHy.jpg"},"groups":[{"h":"To begin","tab":"Snacks","items":[{"k":"Palermo panelle","c":"s","d":"Golden chickpea fritters, fried crisp and finished with lemon and salt.","note":"A little of Palermo."},{"k":"Prosciutto and melon","c":"s","d":"Ripe rockmelon, prosciutto, cracked pepper and a drizzle of olive oil.","note":"For an evening at the opera."}]},{"h":"La cucina siciliana","tab":"Main","items":[{"k":"Pasta alla Norma","c":"m","d":"Rigatoni with fried eggplant, tomato and basil, under grated ricotta salata.","note":"Sicilian flavours at the family table."}]},{"h":"At the opera","tab":"Dessert","items":[{"k":"Opera night cannoli","c":"w","d":"Crisp shells, sweet ricotta, candied orange and pistachio.","note":"Altobello’s choice in the opera box."}]},{"h":"Sicilian red","tab":"Drink","items":[{"k":"Teatro Massimo limoncello spritz","c":"d","d":"Limoncello and prosecco over ice with a splash of soda, a strip of lemon peel and a sprig of fresh mint.","note":"a drink in the Palermo opera house before Cavalleria rusticana"}]}]},
  "Casino (1995)":{"fmt":"tangiers","brand":"Supper at the Tangiers","phoneTitle":"Casino","tag":"Every muffin gets the same number of blueberries.","art":{"sign":"/nWPFpOSQT5Bi7U2UrDHylaieIJA.jpg","ace":"/16PhF3i6TL0jpPfpHGq1EJQZLYf.jpg","dining":"/Gtgypy9lnaZsONILJPTwm8dxEd.jpg"},"groups":[{"h":"From the oyster bar","tab":"Snacks","items":[{"k":"Clams casino","c":"s","d":"Baked clams, bacon, red capsicum, garlic butter & golden crumbs.","note":"Ace runs the Tangiers, so it had to be."},{"k":"Oysters Rockefeller","c":"s","d":"Oysters with spinach, parsley, spring onion, butter & aniseed liqueur.","note":"A little luxury for the high-roller table."}]},{"h":"The house speciality","tab":"Main","items":[{"k":"Tangiers rib eye","c":"m","d":"Butter-basted rib eye, thyme & garlic. Creamed spinach on the side.","note":"Cooked exactly right. No excuses."}]},{"h":"Every detail counts","tab":"Dessert","items":[{"k":"Equal-blueberry muffins","c":"w","d":"Buttermilk muffins with exactly ten blueberries pressed into each.","note":"Count them. Every muffin gets the same."}]},{"h":"At the table","tab":"Drink","items":[{"k":"Dry martini","c":"d","d":"Gin & dry vermouth, stirred over ice, with a green olive.","note":"A cold glass at the craps table."}]}]},
  "A Bronx Tale (1993)":{"fmt":"bippy","brand":"Sunday on the block","phoneTitle":"A Bronx Tale","tag":"A neighbourhood supper. Four at the table.","art":{"bar":"/n0iWJRwSqxxm89Ux9gopzFlH5ti.jpg","bus":"/cBej7ZT6rfNM16cPUyDn23dJsWF.jpg","identity":"/qrGJzJMiON3NSPcuaZLn9enmEma.jpg"},"groups":[{"h":"Before Sunday supper","tab":"Snacks","items":[{"k":"Chez Bippy provolone-stuffed fried olives","c":"s","d":"Big green olives stuffed with sharp provolone, crumbed and fried until crackling, with lemon aioli and a dusting of chilli.","note":"bar food from Sonny's place, Chez Bippy"},{"k":"Doo-wop garlic knots","c":"s","d":"Fresh-baked dough knots, garlic butter, parsley & parmesan.","note":"For a warm evening on the stoop."}]},{"h":"At Sonny’s table","tab":"Main","items":[{"k":"Sonny's Sunday rigatoni","c":"m","d":"Slow tomato sauce, pork-and-beef meatballs, tender ribs & basil over rigatoni.","note":"Gravy and meatballs at the neighbourhood boss’s table."}]},{"h":"From the bakery","tab":"Dessert","items":[{"k":"Arthur Avenue cannoli","c":"w","d":"Crisp shells, vanilla ricotta, chocolate chips & pistachio.","note":"A box from Belmont’s bakery."}]},{"h":"After closing","tab":"Drink","items":[{"k":"Espresso with anisette","c":"d","d":"Short espresso, anisette or sambuca on the side & fresh lemon peel.","note":"The bar after closing."}]}]},
  "The Godfather Part II (1974)":{"fmt":"corleone2","brand":"Little Italy / Havana","phoneTitle":"The Godfather Part II","tag":"The family business goes international.","art":{"feast":"/z5750rLJNOqSPXPUunM7blUFEdS.jpg","havana":"/2PWQsFVAmN30jzNFN1DsCNLNmn9.jpg","cake":"/dVy3bjKpV7nRiDHVMaDP0IGJViS.jpg"},"groups":[{"h":"To begin","tab":"Snacks","items":[{"k":"Genco olive oil arancini","c":"s","d":"Saffron rice balls filled with beef ragù, peas and melting mozzarella.","note":"fried in the oil that started the family business"},{"k":"Havana Cuban sliders","c":"s","d":"Pressed rolls of ham, mojo pork, Swiss cheese and pickle.","note":"A small taste of the Havana trip."}]},{"h":"At the tenement table","tab":"Main","items":[{"k":"Vito's tenement baked ziti","c":"m","d":"Baked ziti with sausage tomato sauce, seasoned ricotta and blistered mozzarella.","note":"A generous dish for a young family."}]},{"h":"The birthday table","tab":"Dessert","items":[{"k":"Hyman Roth's birthday cake","c":"w","d":"Vanilla slab cake, iced pale green and trimmed into an island shape.","note":"The Cuba-shaped cake at Roth’s table."}]},{"h":"New Year’s Eve","tab":"Drink","items":[{"k":"Fredo's Havana daiquiri","c":"d","d":"White rum, fresh lime and sugar, shaken hard and served ice cold.","note":"Fredo would ask for a banana in his"}]}]},
  "Beetlejuice (1988)":{"fmt":"maitland","brand":"Dinner party notes","phoneTitle":"Beetlejuice","tag":"Say it three times. Then eat.","art":{"handbook":"/2qlBTuaKPRTCgsoRcL0GbW70ZQq.jpg","attic":"/rkfvfBDtGoLL5C26Y62Jlkilyfp.jpg","dinner":"/afFK9J35wcwpk0LKgXEGbzDffhR.jpg"},"groups":[{"h":"At the table","tab":"Snacks","items":[{"k":"Banana Boat prawn cocktail","c":"s","d":"Chilled prawns, shredded iceberg & a lemony cocktail sauce with horseradish and a dash of heat.","note":"The dinner-party starter with a mind of its own."},{"k":"Model town cheese bites","c":"s","d":"Cheddar, gouda & pepper jack, with cherry tomatoes and cornichons.","note":"A miniature town for Adam’s attic."}]},{"h":"The Deetz dinner party","tab":"Main","items":[{"k":"Dinner party lobster","c":"m","d":"Lobster tails grilled with garlic, lemon & parsley butter. Shoestring fries and green salad alongside.","note":"The Deetzes’ very fancy dinner."}]},{"h":"After dinner","tab":"Dessert","items":[{"k":"Striped suit cake","c":"w","d":"Vanilla & chocolate sponge, white chocolate ganache and dark chocolate stripes.","note":"A slice in the spirit of the striped suit."}]},{"h":"The Banana Boat toast","tab":"Drink","items":[{"k":"Banana daiquiri","c":"d","d":"White rum, ripe banana, fresh lime & sugar syrup, blended with ice.","note":"A toast to the dinner party’s unexpected soundtrack."}]}]},
  "A Goofy Movie (1995)":{"fmt":"roadtrip","brand":"The road-trip picnic guide","phoneTitle":"A Goofy Movie","tag":"Road trip. Fishing rods. Snacks for the whole drive.","art":{"identity":"/JBg9cdlzows3B2NdrNNOi7mFPS.jpg","map":"/Sb2cLe2xW5OATkZZJBbGrB6qjl.jpg","concert":"/kc5FASCt4EJpEv1lvFg2TAoG1A1.jpg"},"groups":[{"h":"For the long drive","tab":"Snacks","items":[{"k":"Perfect Cast fish fingers","c":"s","d":"Panko-crusted white fish, lemon & pickle-and-caper tartare.","note":"A snack for the father-and-son fishing trip."},{"k":"Powerline concert nachos","c":"s","d":"Corn chips layered with spiced beef mince, black beans and cheddar, baked until melted, then loaded with guacamole, sour cream and fresh tomato salsa.","note":"Max telling everyone he'll be on stage at the Powerline concert"}]},{"h":"At the campsite","tab":"Main","items":[{"k":"Pete's RV barbecue sausages","c":"m","d":"Chargrilled beef sausages in soft rolls, fried onions, mustard & tomato sauce. Buttered corn alongside.","note":"For Pete and PJ’s campsite, with the giant RV."}]},{"h":"After dark","tab":"Dessert","items":[{"k":"Bigfoot campsite s'mores","c":"w","d":"Toasted marshmallows, plain biscuits & melting milk chocolate.","note":"Bigfoot helps himself to the campsite."}]},{"h":"The final encore","tab":"Drink","items":[{"k":"Concert night cherry slushie","c":"d","d":"Cherry cordial, crushed ice & a squeeze of lime.","note":"A cold finish for the concert in LA."}]}]},
  "The Godfather (1972)":{"fmt":"corleone","brand":"At the Corleone table","phoneTitle":"The Godfather","tag":"A Sunday at the Corleone table.","art":{"wedding":"/miLeUKHoNbsHYNciB3UzOUWtWdo.jpg","office":"/8VKv0silVVUvpYblHqNNyRBs3Wu.jpg","identity":"/yZ9JHYemKSbNBr9QmaBjLs74bog.jpg"},"groups":[{"h":"At the wedding","tab":"Snacks","items":[{"k":"Wedding antipasto","c":"s","d":"Salami, aged provolone, olives and roast capsicum, served at room temperature.","note":"For Connie’s wedding feast."},{"k":"Golden arancini","c":"s","d":"Crisp risotto balls with a melting mozzarella centre.","note":"Something golden to begin the family supper."}]},{"h":"From Clemenza’s kitchen","tab":"Main","items":[{"k":"Clemenza's Sunday sauce","c":"m","d":"Pork and beef meatballs, fennel sausage and slow-simmered tomato sauce. Rigatoni and pecorino at the table.","note":"The kitchen lesson Michael is given."}]},{"h":"Take the cannoli","tab":"Dessert","items":[{"k":"Ricotta & pistachio cannoli","c":"w","d":"Crisp shells, orange-scented ricotta, dark chocolate and crushed pistachio.","note":"A box worth bringing home."}]},{"h":"At the table","tab":"Drink","items":[{"k":"Blood orange Italian soda","c":"d","d":"Blood orange syrup, sparkling water and a fresh orange twist.","note":"An alcohol-free toast to the family."}]}]},
  "Chocolat (2000)":{"fmt":"chocolaterie","brand":"Vianne’s chocolaterie","phoneTitle":"Chocolat","tag":"A little temptation. A place at the table.","art":{"shop":"/5WHCI8p7CiKeRrjyVi04jOr3Vaz.jpg","chocolate":"/jui1IIUDv3U2eNe93aSNSg36FWi.jpg","armande":"/uJ9eK355y9SpNoTr800a0jcPMsF.jpg"},"groups":[{"h":"From the chocolaterie","tab":"Snacks","items":[{"k":"Chilli hot chocolate shots","c":"s","d":"Dark chocolate & warm milk, steeped with red chilli, cinnamon and a pinch of flaky salt.","note":"Vianne’s spiced chocolate, poured in tiny cups."},{"k":"Chocolaterie truffles","c":"s","d":"Dark chocolate ganache, rolled in cocoa, toasted hazelnuts or chilli sugar.","note":"A little temptation from the shop window."}]},{"h":"An evening for Armande","tab":"Main","items":[{"k":"Armande's birthday feast","c":"m","d":"Slow-cooked duck legs, crisped in the pan, with duck-fat roast potatoes & a green salad.","note":"The birthday dinner Vianne prepares for Armande."}]},{"h":"One more temptation","tab":"Dessert","items":[{"k":"Chocolate mousse","c":"w","d":"Dark chocolate mousse, chilled in little cups, with a pinch of chilli salt.","note":"The shop’s chocolate, all of it."}]},{"h":"At the village table","tab":"Drink","items":[{"k":"Easter festival vin chaud","c":"d","d":"Southern French red warmed gently with orange, cinnamon, star anise, cloves and honey, served steaming in small glasses with an orange slice.","note":"a French village after Lent ends"}]}]},
  "Julie & Julia (2009)":{"fmt":"kitchenfolio","brand":"The dinner project","phoneTitle":"Julie & Julia","tag":"524 recipes. 365 days. One very good stew.","art":{"julia":"/yClFYIzSdenBQYD3BOk7U5BRL43.jpg","julie":"/l9BFVhzBaB2w7lJ0UjtK00ooHgI.jpg","bruschetta":"/3l8h2ecFZTmicBgDgrKsWJnOlis.jpg"},"groups":[{"h":"Two kitchens, one beginning","tab":"Snacks","items":[{"k":"Julie's bruschetta","c":"s","d":"Toasted ciabatta, ripe tomatoes, garlic, basil & olive oil.","note":"The bruschetta Julie makes to unwind."},{"k":"Gougères","c":"s","d":"Warm Gruyère choux puffs, with a little nutmeg.","note":"A French classic to warm up the kitchen."}]},{"h":"The dinner project","tab":"Main","items":[{"k":"365-day project boeuf bourguignon","c":"m","d":"Beef braised in red Burgundy, bacon, carrots, pearl onions & butter-glazed mushrooms.","note":"524 recipes, one blog, one tiny Queens kitchen"}]},{"h":"From the book","tab":"Dessert","items":[{"k":"Reine de Saba","c":"w","d":"Soft-centred chocolate almond cake with a dark chocolate glaze.","note":"A classic French cake from the book."}]},{"h":"A glass for the cook","tab":"Drink","items":[{"k":"Burgundy kir with crème de cassis","c":"d","d":"Chilled dry white Burgundy poured over blackcurrant liqueur in a wine glass, the classic aperitif from the region, with a fresh blackberry.","note":"Burgundy, home of the bourguignon"}]}]},
  "Moonstruck (1987)":{"fmt":"moonlit","brand":"A Brooklyn supper","phoneTitle":"Moonstruck","tag":"From the bakery to the opera.","art":{"opera":"/jrE56b9FlL6TEQ1z9ag1eK4hd8Q.jpg","moon":"/3zCWprKLerH4nTlzJqlCMOLzRaE.jpg","kitchen":"/l3c4TegIfEaH9PM1kaLQjxdv6aE.jpg"},"groups":[{"h":"From the ovens","tab":"Snacks","items":[{"k":"Cammareri Bros. rosemary focaccia","c":"s","d":"Thick olive oil focaccia dimpled with rosemary and flaky salt, baked crisp-bottomed and torn warm at the table with peppery oil.","note":"warm bread from Ronny's bakery, the Cammareri Bros. ovens"},{"k":"Eggs in the hole","c":"s","d":"Butter-fried toast, a red capsicum ring and a softly set egg.","note":"Breakfast at Rose’s kitchen table."}]},{"h":"At the restaurant","tab":"Main","items":[{"k":"Chicken scaloppine","c":"m","d":"Thin chicken breast in lemon, white wine and butter sauce, with capers and parsley.","note":"Cosmo’s dinner with Mona."}]},{"h":"The bakery, again","tab":"Dessert","items":[{"k":"Cannoli","c":"w","d":"Fresh ricotta, orange zest and chocolate-dipped shells, filled at the last moment.","note":"A little of Ronny’s Brooklyn."}]},{"h":"Under the full moon","tab":"Drink","items":[{"k":"Brooklyn amaretto sours","c":"d","d":"Amaretto, lemon and egg white, shaken frothy over ice with a cherry.","note":"For a big Brooklyn moon."}]}]},
  "Elf (2003)":{"fmt":"gimbels","brand":"Gimbels Christmas window","phoneTitle":"Elf","tag":"A little North Pole sweetness. A very New York appetite.","art":{"buddy":"/osJQkpJw5o7ekynCiqh4WbtJm9W.jpg","display":"/nmM0wAwbeH8d4dgVcK4Wg1w6RGl.jpg","store":"/lavI1MuVp7wUdMKOFA18nzWj8HB.jpg"},"groups":[{"h":"The sweet stuff","tab":"Snacks","items":[{"k":"Maple syrup popcorn","c":"s","d":"Crunchy popcorn clusters, maple syrup & butter.","note":"Buddy puts syrup on everything."},{"k":"Candy cane pretzel rods","c":"s","d":"White chocolate pretzel rods rolled in crushed candy canes.","note":"A sweet detour through the candy cane forest."}]},{"h":"A break between adventures","tab":"Main","items":[{"k":"New York street hot dogs","c":"m","d":"Griddled franks in steamed buns, yellow mustard, tomato onions & warm sauerkraut.","note":"Something savoury for Buddy’s first big-city adventure."}]},{"h":"Snowball fight","tab":"Dessert","items":[{"k":"Snowball fight cupcakes","c":"w","d":"Vanilla cupcakes, cream cheese frosting & snowy shredded coconut.","note":"Inspired by Buddy’s very enthusiastic snowball fight."}]},{"h":"Congratulations!","tab":"Drink","items":[{"k":"World's best maple mocha","c":"d","d":"Hot chocolate milk with a shot of coffee and maple syrup, topped with whipped cream, mini marshmallows and crushed candy cane.","note":"Buddy congratulates the diner on the world's best cup of coffee"}]}]},
  "Teenage Mutant Ninja Turtles (1990)":{"fmt":"lair","brand":"Pizza night in the lair","phoneTitle":"TMNT","tag":"Four brothers. Four pizzas. Zero leftovers.","art":{"brothers":"/afWHvJLROkw2oXKxxHhL7XCvopV.jpg","pizza":"/mJaKfJmGdjD7QoetqY99GmMpEt9.jpg","poster":"/shfAU6xIIEAEtsloIT3n9Fscz2E.jpg"},"groups":[{"h":"Open the box","tab":"Snacks","items":[{"k":"Sewer pizza rolls","c":"s","note":"The lair’s own takeaway.","d":"Pizza dough rolls, tomato sauce, pepperoni & mozzarella."},{"k":"Splinter's cheese plate","c":"s","note":"For the sensei.","d":"Aged cheddar, brie, gouda, crackers, grapes & honey."}]},{"h":"One for each brother","tab":"Main","items":[{"k":"Cowabunga four-pie pizza night","c":"m","note":"one for each brother, Mikey calls the toppings","d":"Four thin bases, tomato & mozzarella. Pepperoni, mushroom, supreme & a fridge raid."}]},{"h":"Slice something sweet","tab":"Dessert","items":[{"k":"Pizza cookie","c":"w","note":"Choc chip base with lolly toppings.","d":"Choc chip cookie base, melted chocolate & lollies."}]},{"h":"From the lair fridge","tab":"Drink","items":[{"k":"Channel 3 green apple soda","c":"d","note":"April O'Neil, reporting live from the sewer","d":"Fresh green apple juice, lime & sparkling soda water."}]}]},
  "Lady and the Tramp (1955)":{"fmt":"tonys","brand":"Tony’s / Ristorante italiano","phoneTitle":"Lady and the Tramp","tag":"One plate. One strand. One meatball.","art":{"dinner":"/xJbWJK3NAMCzknfCFdMUYekNezS.jpg","bridge":"/9RbMRpc3xCfB1m0PkgoAChIC1AN.jpg","walk":"/ikkdpwkR2tH1GdR4rcHbhi7ilkC.jpg"},"groups":[{"h":"To begin","tab":"Snacks","items":[{"k":"Tony's garlic bread","c":"s","d":"Warm Italian bread with garlic butter, parsley and parmesan.","note":"A little something from Tony’s kitchen."},{"k":"Antipasto for two","c":"s","d":"Salami, provolone, olives, artichoke and roasted capsicum, with torn bread.","note":"Set out by candlelight."}]},{"h":"The house speciality","tab":"Main","items":[{"k":"Spaghetti and meatballs","c":"m","d":"Beef and pork meatballs in slow tomato and basil sauce, piled over one generous plate of spaghetti.","note":"The famous dinner behind Tony’s."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Bella notte cannoli","c":"w","d":"Ricotta, orange zest and chocolate chips in crisp shells, finished with pistachios.","note":"For a beautiful night."}]},{"h":"To drink","tab":"Drink","items":[{"k":"Bella Notte blood orange soda","c":"d","d":"Blood orange juice and rosemary syrup topped with fizzing soda over ice, red as the checked tablecloth on Tony's back-step table.","note":"Tony and Joe serenading the dinner out the back of Tony's"}]}]},
  "Fried Green Tomatoes (1991)":{"fmt":"whistle","brand":"Whistle Stop Café","phoneTitle":"Fried Green Tomatoes","tag":"A table for four. A story to share.","art":{"cafe":"/ApnB7gY4MrWoPqIw17lEMp1mXJD.jpg","tomatoes":"/hwNJJum7YvhSkHBoh1QmzP2Z6TY.jpg","storefront":"/tectp2uQ9gF7XUgL2SuPPk9492V.jpg"},"groups":[{"h":"From the café kitchen","tab":"Snacks","items":[{"k":"Fried green tomatoes","c":"s","d":"Thick-cut green tomatoes, buttermilk, a golden cornmeal crust & remoulade.","note":"The dish that gives the café, and the film, its name."},{"k":"Honeycomb and biscuits","c":"s","d":"Warm buttermilk biscuits, butter, honey & a piece of honeycomb.","note":"For Idgie, Ruth’s Bee Charmer."}]},{"h":"The famous plate","tab":"Main","items":[{"k":"Whistle Stop barbecue","c":"m","d":"Slow-roasted pulled pork, tomato & cider-vinegar sauce, coleslaw and white bread.","note":"The café’s barbecue, with its famous sauce."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Pecan pie","c":"w","d":"Toasted pecans, brown sugar & golden syrup in a buttery pastry case.","note":"A slice of Southern café comfort."}]},{"h":"A glass to linger over","tab":"Drink","items":[{"k":"Whistle Stop peach sweet tea","c":"d","d":"Black tea brewed strong with ripe peaches and sugar, chilled and poured over ice with lemon, mint and fresh peach slices.","note":"the café's sweet tea"}]}]},
  "Do the Right Thing (1989)":{"fmt":"sals","brand":"Sal’s Famous Pizzeria","phoneTitle":"Do the Right Thing","tag":"Hottest day of the year. Coldest drinks in the house.","art":{"counter":"/4rUvqbhka5FWLl3fGQUwsIvkt6k.jpg","street":"/njeCvtiagMMZyyp9evPFLilsKfy.jpg","identity":"/zEUVvEUp1l8Fg72f6WySEWnAMNh.jpg"},"groups":[{"h":"While you wait","tab":"Snacks","items":[{"k":"Sal's garlic knots","c":"s","d":"Warm pizza dough knots, garlic butter, parsley & parmesan.","note":"From Sal’s oven."},{"k":"Chilli-lime watermelon and feta skewers","c":"s","d":"Ice-cold watermelon and salty feta on skewers with mint, finished with lime juice and a chilli salt sprinkle.","note":"the only cool thing on the block on the hottest day of the year"}]},{"h":"Sal’s house special","tab":"Main","items":[{"k":"Sal's Famous slice","c":"m","d":"Thin New York pizza, tomato, mozzarella, pepperoni & oregano.","note":"Big slices, straight from Sal’s."}]},{"h":"Something cold","tab":"Dessert","items":[{"k":"Cherry shaved ice","c":"w","d":"Crushed ice, homemade cherry syrup & lemon.","note":"For the heat on the block."}]},{"h":"From the fridge","tab":"Drink","items":[{"k":"Heatwave lager and lemonade shandy","c":"d","d":"Frosty lager topped with fresh homemade lemonade in chilled glasses, a lemon wheel and plenty of ice.","note":"Da Mayor and his cold beer on the hottest day of the year"}]}]},
  "Coming to America (1988)":{"fmt":"mcdowells","brand":"McDowell’s / Queens","phoneTitle":"Coming to America","tag":"A royal appetite.","art":{"counter":"/nswBClglllF0D3eqagLkHXYgL0W.jpg","royal":"/s0EyvllPEJw1vbAJcmGElDijTgK.jpg","poster":"/djRAvxyvvN2yqlJKDbT3uy4vOBw.jpg"},"groups":[{"h":"On the side","tab":"Snacks","items":[{"k":"Golden fries","c":"s","d":"Thin-cut fries, twice fried and salted straight from the oil.","note":"The golden side of McDowell’s."},{"k":"Rose petal sugar crisps","c":"s","d":"Crisp rosewater cookies with crushed dried rose petals.","note":"A little of the royal bath, brought to Queens."}]},{"h":"The house burger","tab":"Main","items":[{"k":"Big Mick burger","c":"m","d":"Two all-beef patties, special sauce, lettuce, cheese, pickles and onions on a three-piece bun. No sesame seeds.","note":"Their buns have sesame seeds. My buns have no seeds."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Apple turnovers","c":"w","d":"Flaky puff pastry filled with buttery cinnamon apple.","note":"A sweet finish from the counter."}]},{"h":"From the counter","tab":"Drink","items":[{"k":"Vanilla thick shake","c":"d","d":"Vanilla ice cream and cold full-cream milk, blended thick.","note":"Four tall glasses, one royal order."}]}]},
  "The Warriors (1979)":{"fmt":"coney","brand":"Coney Island boardwalk grill","phoneTitle":"The Warriors","tag":"Last stop: Coney Island.","groups":[{"h":"Start at the counter","tab":"Snacks","items":[{"k":"Boardwalk pretzel bites","d":"Warm, butter-brushed soft pretzels. Cheddar dip & yellow mustard.","note":"A paper tray of something warm for the long night.","c":"s"},{"k":"Street-cart corn","d":"Charred corn ribs, chilli butter, lime & smoked salt.","note":"Street-cart flavours, with the boardwalk waiting at the end.","c":"s"}]},{"h":"Back on home turf","tab":"Main","items":[{"k":"Coney Island chilli dogs","d":"Griddled beef franks, beef chilli, diced onion & mustard. Shoestring fries alongside.","note":"The gang's home turf, and the meal at the end of the journey.","c":"m"}]},{"h":"The sweet way home","tab":"Dessert","items":[{"k":"Chocolate-dipped ice-cream sandwiches","d":"Vanilla ice cream, chewy chocolate cookies & dark chocolate.","note":"Cold boardwalk comfort after a very long night.","c":"w"}]},{"h":"Cold soda","tab":"Drink","items":[{"k":"Cherry cola","d":"Ice-cold cola, cherry syrup & a squeeze of lime.","note":"A soda-counter finish to the journey. Alcohol-free.","c":"d"}]}],"art":{"hero":"/joSYVbskwQyjJcy18xvFCybvkWu.jpg","scene":"/9CZ3I5KywtMnD2KntSUG0VDNNEa.jpg","extra":"/avUvhy42KuxO3bXfItr5uTf3p6T.jpg","map":"/kr8LqYzHTwSdzOiMnhi1ajLJsog.jpg","logo":"/uMlZSH5ZsGaznzngJLNxEkCTK2g.png","source":"TMDB images API"}},
  "Die Hard (1988)":{"fmt":"nakatomi","brand":"Nakatomi Plaza","phoneTitle":"Die Hard","tag":"A very eventful Christmas.","groups":[{"h":"Passed around at the party","tab":"Snacks","items":[{"k":"Nakatomi party canapés","n":"Nakatomi party canapés","note":"Smoked salmon blini, passed around at the Nakatomi Christmas party.","d":"Warm blini, smoked salmon, crème fraîche, salmon roe & dill.","c":"s"},{"k":"Argyle's limo snacks","n":"Argyle’s limo snacks","note":"Rosemary nuts from the back of Argyle’s limousine.","d":"Warm cashews & almonds, rosemary butter, brown sugar & cayenne.","c":"s"}]},{"h":"Christmas party supper","tab":"Main","items":[{"k":"Christmas party roast beef rolls","n":"Christmas party roast beef rolls","note":"A Christmas Eve supper for the Nakatomi reception.","d":"Shaved roast beef, soft rolls, horseradish cream, rocket & pickled onions.","c":"m"}]},{"h":"Something sweet for Al","tab":"Dessert","items":[{"k":"Snack cakes for Al","n":"Snack cakes for Al","note":"Sergeant Al Powell’s convenience-store haul, before the call.","d":"Vanilla sponge fingers, split & filled with marshmallow cream.","c":"w"}]},{"h":"From Argyle’s limo bar","tab":"Drink","items":[{"k":"Argyle's limo bar old fashioned","n":"Argyle's limo bar old fashioned","note":"Argyle shows off the limo bar on the way in","d":"Bourbon stirred over ice with brown sugar syrup and orange bitters, poured over one big cube with a flamed strip of orange peel.","c":"d"}]}],"art":{"hero":"/mYOlKvVGfhql8j9dI2ycL5yiiwS.jpg","scene":"/yw55hiqnDOwZiXpkraXu114rmGz.jpg","extra":"/cnt1uNJmdKDMPtOPTJHkjveFmPD.jpg","logo":"/elYpRiF6dJbnkB5yMvoWolidLvj.png","source":"TMDB images API"}},
  "Jurassic Park (1993)":{"fmt":"jurassic","brand":"Jurassic Park visitor centre","phoneTitle":"Jurassic Park","tag":"Spared no expense.","groups":[{"h":"Small discoveries","tab":"Snacks","items":[{"k":"Dino egg cookies","d":"Brown butter cookies with chocolate-egg centres and cocoa speckles.","note":"A little miracle, straight from the hatchery.","c":"s"},{"k":"Raptor claw crisps","d":"Paprika tortilla claws, served with fresh lime guacamole.","note":"Inspired by the raptors’ visitor-centre kitchen pursuit.","c":"s"}]},{"h":"A civilised lunch","tab":"Main","items":[{"k":"Visitor centre lunch","d":"Pea and mint purée, roast baby potatoes.","note":"The lunch where the scientists question Hammond’s dream.","c":"m","n":"Herb-crusted lamb rack"}]},{"h":"Freezer interruption","tab":"Dessert","items":[{"k":"Spared no expense melting sundae","d":"Three scoops of vanilla bean ice cream in a chilled coupe with hot fudge and crushed honeycomb, served slightly too soft like the freezers are off.","note":"Hammond spared no expense","c":"w"}]},{"h":"Keep an eye on the water","tab":"Drink","items":[{"k":"Ripple glass lime and mint iced tea","d":"Chilled black tea sweetened with honey and shaken with fresh lime and mint, served in tall clear glasses on the table so you can watch them ripple.","note":"watch for ripples","c":"d"}]}],"art":{"hero":"/o7LzVmlOSYc3EspyVMC9bsTTARc.jpg","scene":"/fcErc5zyvou7y8v5w8keO0CpunG.jpg","extra":"/qEb40gA5dYgaWZ2X0FHvQKOhWVr.jpg","logo":"/ec4wy0iZFkHTxw04HyX4r06DwrH.png","source":"TMDB images API"}},
  "Anchorman: The Legend of Ron Burgundy (2004)":{fmt:"newsroom",phoneTitle:"Anchorman",brand:"Channel 4 staff canteen",tag:"Stay classy. Stay hungry.",
    groups:[
      {h:"Before the broadcast",tab:"Snacks",items:[
        {k:"Baxter's wheel of cheese",note:"A whole wheel. We're not even mad.",d:"Baked brie, honey, thyme, walnuts & crackers"},
        {k:"Carne asada fries",note:"A little hometown pride for San Diego.",d:"Grilled lime-marinated steak, cheese, guacamole & sour cream"}]},
      {h:"The lead story",tab:"Main",items:[
        {k:"San Diego crispy chicken tacos",n:"San Diego chicken tacos",note:"A very big deal. A very good dinner.",d:"Crispy chicken, warm tortillas, cabbage, tomato salsa & lime crema"}]},
      {h:"And finally… dessert",tab:"Dessert",items:[
        {k:"ButterSCOTCH pudding",note:'"Scotchy, scotch, scotch."',d:"Warm self-saucing pudding, golden syrup & vanilla ice cream"}]},
      {h:"Off the clock",tab:"Drink",items:[
        {k:"Great Odin's Raven! Blackberry lemonade",n:"Great Odin's Raven!",note:"A blackberry-and-lemon toast to the Channel 4 news team.",d:"Blackberry, fresh lemon & sparkling water. Alcohol-free."}]}]},
  "Ratatouille (2007)":{fmt:"carte",over:"Restaurant · Paris",brand:"Gusteau's",motto:"Anyone can cook",
    foot:"Service from seven. The kitchen welcomes anyone, of any size.",
    ego:["Table pour un","Anton Ego","Orders the '47 Bordeaux,<br>and some perspective"],
    stills:[["/hAj5B7NNjd05081eZhqKujmpVdx.jpg","The soup Remy saved"],["/pFIQZaWSyn4YAdE9jGriCTnTDZB.jpg","The ratatouille, for Ego"],["/lxpv2ikF3Cdml90d1JI7hJzh6rK.jpg","Colette: listen to the crust"]],
    groups:[
      {h:"Pour commencer",en:"To start",items:[
        {k:"Gusteau's soup",fr:"Le potage du soir",n:"The soup",note:"The one Linguini spilled into and Remy fixed",p:"€12"},
        {k:"Remy's lightning mushroom and cheese",fr:"Champignon et fromage",n:"Mushroom and cheese",note:"Toasted on the chimney, with a bolt of lightning",p:"€9"},
        {k:"Paris market jambon-beurre and brie",fr:"La baguette",n:"Bread, with a proper crust",note:"Listen for the crackle",p:"€4",
         how:"Warm 2 good baguettes in a 200C oven for 6 minutes until the crust crackles when you squeeze it. Tear, do not slice, and serve with 100g salted butter at room temperature.",
         shop:["2 baguettes@Bakery","100g salted butter@Dairy"]}]},
      {h:"Les plats",en:"Mains",items:[
        {k:"Ratatouille",fr:"Ratatouille",n:"Ratatouille, layered fine",note:"The dish that takes Ego straight back to his mum's kitchen",p:"€28"},
        {k:"Sweetbreads à la Gusteau",fr:"Ris de veau à la Gusteau",n:"Sweetbreads à la Gusteau",note:"The old recipe Linguini was told to cook. Remy rewrote it",p:"€32",c:"m",
         how:"Soak 600g veal sweetbreads in cold water for 2 hours, then simmer in salted water for 4 minutes and plunge into iced water. Peel off the membrane and press under a weighted tray for an hour. Slice into 2cm pieces, dust with flour and pan-fry in 30g butter for 3 minutes a side until golden. Deglaze with 80ml white wine and 100ml veal or chicken stock, reduce, then swirl in 20g cold butter. Serve with the sauce spooned over.",
         shop:["600g veal sweetbreads@Meat","50g butter@Dairy","2 tbsp plain flour@Pantry","80ml white wine@Bottle shop","100ml chicken stock@Pantry"]}]},
      {h:"La cave",en:"The cellar",items:[
        {k:"Ego's fresh perspective grape spritz",fr:"Bordeaux, 1947",n:"A good Bordeaux",note:"Ego's order. Any good Bordeaux will do at home",p:"Ask the sommelier"}]}]},
  "Big Night (1996)":{fmt:"feast",over:"Cucina Italiana · Jersey Shore",brand:"Paradise",sub:"Primo in the kitchen. Secondo out front.",
    foot:"No side of spaghetti with the risotto. Sometimes the spaghetti likes to be alone.",
    note:["The big night","For the night Louis Prima was meant to come. Course after course, till nobody can move."],
    stills:[["/dohqxi6QW7SSmzEaK8Wv9dMhxcP.jpg","The customer who wanted spaghetti too"],["/dtUVvnbYSusSaI6xwPrkPK2xLeB.jpg","The long table, the big night"]],
    groups:[
      {h:"Primi",en:"First courses",items:[
        {k:"Seafood risotto",it:"Risotto di mare",n:"Seafood risotto",note:"The one the customer wanted spaghetti with",p:"2.50",c:"s",
         how:"Warm 1.2L fish stock. Soften 1 diced onion and 2 garlic cloves in 3 tbsp olive oil, add 350g carnaroli rice and toast 2 minutes, then 125ml white wine. Add the stock a ladle at a time, stirring, for 16 minutes. Stir in 300g peeled green prawns, 200g squid rings and 500g cleaned mussels, cover for 4 minutes until the mussels open. Finish with 30g butter, parsley and lemon. No cheese.",
         shop:["1.2L fish stock@Pantry","1 onion@Produce","2 garlic cloves@Produce","350g carnaroli rice@Pantry","125ml white wine@Bottle shop","300g green prawns@Seafood","200g squid rings@Seafood","500g mussels@Seafood","30g butter@Dairy","1 bunch parsley@Produce","1 lemon@Produce"]},
        {k:"Risotto three ways",it:"Risotto tricolore",n:"Risotto in three colours",note:"Green, white and red, side by side, at the feast",p:"3.00",
         how:"Make one risotto base: soften 1 onion in 40g butter, toast 400g arborio rice, add 125ml white wine, then 1.4L hot chicken stock a ladle at a time for 17 minutes. Split into three pans. Green: stir in 100g blitzed spinach and basil. White: stir in 60g parmesan and 30g butter. Red: stir in 4 tbsp tomato passata and a pinch of saffron soaked in hot water. Spoon the three side by side on each plate.",
         shop:["1 onion@Produce","70g butter@Dairy","400g arborio rice@Pantry","125ml white wine@Bottle shop","1.4L chicken stock@Pantry","100g baby spinach@Produce","1 bunch basil@Produce","60g parmesan@Dairy","4 tbsp tomato passata@Pantry","1 pinch saffron@Pantry"]}]},
      {h:"Secondi",en:"Main courses",items:[
        {k:"Timpano",it:"Il timpano",n:"Timpano",note:"The pasta drum. The room goes quiet when it's cut",p:"5.00"},
        {k:"Roast suckling pig",it:"Maialino arrosto",n:"Roast pork, whole-pig style",note:"Carried in on a board at the feast",p:"4.50",
         how:"Score the skin of a 1.5kg boned pork belly, rub with 2 tsp salt, 1 tbsp fennel seeds, 4 crushed garlic cloves and rosemary on the flesh side, roll and tie. Dry uncovered in the fridge overnight. Roast at 240C for 30 minutes, then 160C for 2 hours until tender and crackling. Rest 15 minutes and carve thick.",
         shop:["1.5kg boned pork belly@Meat","1 tbsp fennel seeds@Pantry","4 garlic cloves@Produce","1 bunch rosemary@Produce"]}]},
      {h:"All'alba",en:"At dawn",items:[
        {k:"Secondo's omelette",it:"La frittata",n:"Secondo's omelette",note:"The morning after. Cooked in silence, split three ways",p:"",c:"m",
         how:"Beat 8 eggs with a pinch of salt. Heat 2 tbsp olive oil in a non-stick pan over medium heat, pour in the eggs and stir gently until just set underneath and soft on top, about 3 minutes. Fold, slide onto a plate and cut into four. Serve with torn bread.",
         shop:["8 eggs@Dairy","2 tbsp olive oil@Pantry","1 loaf crusty bread@Bakery"]}]}]},
  "Chef (2014)":{fmt:"truck",brand:"El Jefe",sub:"Cubanos",boardHead:"Today on the truck",boardSide:"Miami to LA",
    route:["The road home","Miami, then New Orleans, then Austin, then LA. Percy posts every stop."],
    stills:[["/fQQmnrIPimZ8ZcVL6M0YUDdJhI6.jpg","Chalking up the board"],["/lDBNicr668AbJ9q0FBJa8AREFOj.jpg","The window, open for business"],["/7Un2nV752i6AKxmtH0wSgiuANLE.jpg","Carl teaching Percy the line"]],
    groups:[
      {h:"The truck",items:[
        {k:"El Jefe Cubano",n:"El Jefe Cubano",note:"Roast pork, ham, swiss, pickles, mustard. Pressed hot",p:"$7"}]},
      {h:"For Percy",items:[
        {k:"The grilled cheese for Percy",n:"Grilled cheese",note:"Made for his son. Not to be served burnt. Ever",p:"$5"}]},
      {h:"On the road",items:[
        {k:"New Orleans beignets with chicory café",n:"Beignets",note:"The New Orleans stop. Icing sugar everywhere",p:"$4",
         how:"Mix 7g dried yeast, 1 tbsp sugar and 180ml warm milk, stand 10 minutes. Beat in 1 egg, 30g melted butter, 350g plain flour and a pinch of salt to a soft dough, knead 3 minutes, cover and rise 1 hour. Roll 5mm thick, cut into 6cm squares and fry at 175C for 1 minute a side until puffed and golden. Drain and bury in 100g icing sugar.",
         shop:["7g dried yeast@Pantry","1 tbsp caster sugar@Pantry","180ml full cream milk@Dairy","1 egg@Dairy","30g butter@Dairy","350g plain flour@Pantry","100g icing sugar@Pantry","1L vegetable oil@Pantry"]},
        {k:"Carl's late-night aglio e olio",n:"Aglio e olio",note:"What he cooks for Molly at midnight",p:"$9",
         how:"Cook 500g spaghetti in well-salted water until just shy of al dente, keeping 1 cup of the water. Meanwhile warm 100ml olive oil with 8 thinly sliced garlic cloves and 1 tsp chilli flakes over low heat until the garlic is pale gold. Toss the pasta through with a splash of pasta water until glossy. Finish with a bunch of chopped parsley, lemon juice and parmesan.",
         shop:["500g spaghetti@Pantry","100ml extra virgin olive oil@Pantry","8 garlic cloves@Produce","1 tsp chilli flakes@Pantry","1 bunch parsley@Produce","1 lemon@Produce","40g parmesan@Dairy"]}]},
      {h:"Off the menu",items:[
        {k:"Chocolate lava cake",n:"Chocolate lava cake",note:"The one the critic hated. Done right this time",p:"$6"}]}]},
  "When Harry Met Sally... (1989)":{fmt:"check",place:"A diner on the way to New York",tag:"I'll have what she's having.",
    fields:[["Table","4"],["Guests","2"],["Server","Joan"],["No.","1977"]],total:"$11.40",thanks:"Thank you, call again",
    trip:["Chicago to New York, 1977","Chicago","New York","18 hours, one argument","They share the drive. They don't share the grapes."],
    stills:[["/nVnheU1iPMVJJZgW9I8P9tCNhco.jpg","The diner. Sally orders"],["/cAZADMfPpRuCZYkTO06IDdrEE2t.jpg","The deli. She has what she's having"],["/tc8FdNY1R0Ob1oOyhI3XZbuV14m.jpg","New Year's Eve, at the party"]],
    groups:[
      {h:"On the road",items:[
        {k:"Roast grape and ricotta crostini",n:"Grapes, for the car",note:"Harry spits the seeds out the window",p:"0.75",q:"1"}]},
      {h:"The diner",items:[
        {k:"Sally's chef salad",n:"Chef salad",mods:["oil & vinegar on the side"],note:"Exactly as she orders it",p:"3.25",q:"2",
         how:"Wash and tear 2 cos lettuces. Arrange with 200g sliced leg ham, 200g sliced turkey, 150g swiss cheese strips, 4 halved hard-boiled eggs, 2 sliced tomatoes and half a sliced cucumber. Serve 60ml olive oil and 30ml red wine vinegar in two little jugs on the side.",
         shop:["2 cos lettuces@Produce","200g sliced leg ham@Deli","200g sliced turkey@Deli","150g swiss cheese@Dairy","4 eggs@Dairy","2 tomatoes@Produce","1 cucumber@Produce","60ml olive oil@Pantry","30ml red wine vinegar@Pantry"]},
        {k:"Apple pie à la mode, her way",n:"Apple pie à la mode",mods:["pie heated · ice cream on the side","strawberry if you have it","if not, real cream only"],note:"On the side. All of it",p:"2.40",q:"2"}]},
      {h:"The deli",items:[
        {k:"Pastrami on rye",n:"Deli sandwiches",note:"Lunch on Houston Street. The famous scene",p:"4.50",q:"2"}]},
      {h:"New Year's",items:[
        {k:"New Year's Eve champagne",n:"Champagne at midnight",note:"He runs across town to say it before the clock strikes",p:"",c:"d",q:"1",
         how:"Chill 1 bottle of champagne or sparkling wine for at least 3 hours. Open it just before midnight and pour into four flutes.",
         shop:["1 bottle champagne or sparkling wine@Bottle shop"]}]}]},
  "Home Alone (1990)":{fmt:"nero",order:[0,2,1],still:["/gqi0faVa8GvgcG991QL2ZrL3ECw.jpg","Kevin's dinner at the big table, all by himself"],brand:"Little Nero's",over:"Hot to your door",slogan:"No fiddlin' around!",
    tag:"Keep the change.<br>Pass the pizza.",caption:"Tonight's movie",
    sizes:[["Small","7.50"],["Medium","9.50"],["Large","11.80"]],sizesNote:"Extra cheese 1.00 · Plain cheese always on",stamp:["Delivered hot","Knock at the front door.<br>Wait for the dog door."],
    foot:["Winnetka and the North Shore","Open Christmas week","Call ahead"],
    ticket:[["Name","McCallister"],["Deliver to","671 Lincoln Ave"],["Suburb","Winnetka"]],
    total:"$11.80",scrawl:"Paid $12 through the dog door. Keep the change.",thanks:"Thank you, and merry Christmas",
    colA:[
      {h:"Pies",items:[
        {k:"Cheese pizza bites",n:"Large cheese pizza",d:"Plain cheese, cut in triangles",note:"Buzz ate the last plain cheese. Not this time.",p:"11.80",
         how:"Heat the oven to its highest setting, about 250C, with two trays inside for 30 minutes. Simmer 400g crushed tomatoes with 1 crushed garlic clove, 1 tsp dried oregano and a pinch of salt for 10 minutes. Stretch 2 x 400g balls of pizza dough into 30cm rounds on baking paper. Spread each with half the sauce, leaving a 2cm edge, and scatter 200g grated mozzarella over each. Slide onto the hot trays and bake 10 to 12 minutes until the edges blister. Cut each into 8 triangles.",
         shop:["2 x 400g pizza dough balls@Bakery","400g tin crushed tomatoes@Pantry","1 garlic clove@Produce","1 tsp dried oregano@Pantry","400g mozzarella@Dairy"]}]},
      {h:"Drinks",items:[
        {k:"Kevin's chocolate malted milkshake",n:"Big glass of milk",d:"Ice cold, full cream",note:"Mind the plane tickets",p:"0.75"},
        {k:"Fuller's cola",n:"Fuller's cola",d:"Big glass, lots of ice",note:"Fuller, go easy on it",p:"1.25",c:"d",
         how:"Chill a 1.25L bottle of cola overnight. Fill four tall glasses with ice, drop a slice of lemon into each and pour. Go easy on the refills.",
         shop:["1.25L cola@Drinks","1 lemon@Produce","1 bag ice@Frozen"]}]}],
    colB:[
      {h:"Kevin's night in",items:[
        {k:"Kevin's mac and cheese",n:"Mac and cheese dinner",d:"The TV dinner. Cheddar sauce, crumb on top",note:"Heated up all by himself",p:"3.50"},
        {k:"Kevin's sundae bar",n:"The giant sundae",c:"w",d:"Two ice creams, hot fudge, the lot",note:"Built in front of a gangster film",p:"2.95",
         how:"Set out 1L vanilla and 1L chocolate ice cream to soften for 10 minutes. Melt 150g chopped dark chocolate with 150ml thickened cream over low heat for hot fudge. Whip another 150ml thickened cream to soft peaks. Put 100g mini marshmallows, 80g chopped roasted peanuts, 4 tbsp sprinkles and 4 maraschino cherries in small bowls. Everyone builds their own in a big bowl.",
         shop:["1L vanilla ice cream@Frozen","1L chocolate ice cream@Frozen","150g dark chocolate@Pantry","300ml thickened cream@Dairy","100g mini marshmallows@Pantry","80g roasted peanuts@Pantry","4 tbsp sprinkles@Pantry","4 maraschino cherries@Pantry"]}]}]},
  "Back to the Future (1985)":{fmt:"lous",still:["/uhWens64CKeMkIfkhXGkXrMGOo3.jpg","Marty and George, at Lou's"],place:"Lou's Cafe",sub:"Courthouse Square<br>Hill Valley &nbsp;·&nbsp; 1955",
    tag:"Great Scott.<br>That's a good burger.",check:"Table 4",boardTop:"TODAY  ·  SATURDAY NOVEMBER 5 1955",boardFoot:"ENCHANTMENT UNDER THE SEA DANCE  ·  NOV 12",ticket:["Enchantment Under the Sea","School dance tonight.<br>Back by 10:04."],
    strip:["No tabs","Tab? Can't give you a tab unless you order something."],
    flyerStill:"/19SqaRZi24WJjCAvXGoMju6ZoXz.jpg",flyerCrop:"8% 14%",flyer:["Save the<br>clock tower","Struck by lightning<br>10:04 PM, Saturday<br>November 12, 1955","Hill Valley Preservation Society"],
    colA:[
      {h:"Off the grill",items:[
        {k:"Lou's malt shop cheeseburger",n:"Cheeseburger",note:"Griddled onions, pickles, mustard",p:"35¢"},
        {k:"Lou's Cafe fries",n:"French fries",note:"Hand cut, fried twice",p:"15¢"}]},
      {h:"Breakfast all day",items:[
        {k:"Doc's breakfast machine fry-up",n:"Doc's breakfast",note:"Eggs, bacon, toast. No robot arm",p:"45¢",
         how:"Lay 8 rashers of bacon in a cold frying pan and cook over medium heat for 8 to 10 minutes, turning, until crisp. Lift out and fry 4 eggs in the bacon fat, spooning the fat over the yolks. Toast 8 slices of white bread and butter them with 40g butter. Plate the eggs with the bacon and toast.",
         shop:["8 rashers bacon@Meat","4 eggs@Dairy","8 slices white bread@Bakery","40g butter@Dairy"]}]}],
    colB:[
      {h:"Soda fountain",items:[
        {k:"Chocolate milk",n:"Milk, chocolate",note:"Lou, give me a milk. Chocolate.",p:"10¢",c:"d",
         how:"Whisk 4 tbsp cocoa and 4 tbsp caster sugar with 100ml hot water until smooth. Stir in 900ml cold full cream milk and chill for an hour. Pour into four tall glasses with a straw each.",
         shop:["4 tbsp cocoa@Pantry","4 tbsp caster sugar@Pantry","900ml full cream milk@Dairy"]},
        {k:"Coffee, no sugar",n:"Coffee, no sugar",note:"Something without any sugar in it",p:"5¢",c:"d",
         how:"Brew 1L of filter coffee from 60g medium-ground coffee. Pour it black into four diner mugs. No sugar, and no Pepsi Free.",
         shop:["60g ground coffee@Pantry"]}]},
      {h:"From the cake stand",items:[
        {k:"Uncle Joey's welcome home cake",n:"Joey's cake",note:"He didn't make parole. Eat it anyway",p:"15¢",c:"w",
         how:"Heat the oven to 180C and line a 20 x 30cm tin. Beat 200g soft butter with 200g caster sugar until pale, then beat in 4 eggs one at a time and 2 tsp vanilla. Fold in 250g self-raising flour, then 125ml milk. Bake 30 to 35 minutes and cool completely. Beat 150g soft butter with 300g icing sugar and 2 tbsp milk, spread over the top and pipe WELCOME HOME JOEY in blue icing.",
         shop:["350g butter@Dairy","200g caster sugar@Pantry","4 eggs@Dairy","2 tsp vanilla extract@Pantry","250g self-raising flour@Pantry","150ml milk@Dairy","300g icing sugar@Pantry","1 tube blue writing icing@Pantry"]}]}]},
  "Goodfellas (1990)":{fmt:"pad",still:["/x1Ohy5LGhy67rRjbXUM1DNDAICA.jpg","Jimmy. The diner. Last time"],brand:"Sunday, May 11th, 1980",padHead:"Dinner for Michael and the kids",padSide:"Sun 11th",
    titleCard:"SUNDAY, MAY 11TH, 1980<br>6:55 A.M.",tag:"As far back as I can remember,<br>I always wanted seconds.",cueLead:"Showtime:",heli:"Still up there?",padLines:[{k:"Razor-thin garlic bruschetta"},{k:"Prison gravy with three-meat meatballs"},{task:"Tell Michael. Keep stirring the sauce",p:"9:00"},{k:"Bamboo Lounge salami and provolone"},{k:"Johnny Dio's pan steaks"},{k:"Red wine, opened early"}],
    after:{n:"Egg noodles and ketchup",note:"Witness protection. Never again."},
    card:["From the prison kitchen","Paulie does the garlic with a razor, so thin it melts in the pan.<br>Vinnie does the sauce. Too many onions.<br>Johnny Dio does the meat."],
    groups:[
      {h:"Start early",items:[
        {k:"Razor-thin garlic bruschetta",n:"Slice the garlic, razor thin",note:"Paulie's way. Toast the bread for it",p:"6:55"},
        {k:"Prison gravy with three-meat meatballs",n:"Sauce on, three-meat meatballs",note:"Veal, beef and pork. Go easy on the onions",p:"7:30"}]},
      {h:"Like inside",items:[
        {k:"Bamboo Lounge salami and provolone",n:"Salami, prosciutto, cheese",note:"Laid out on the board, like the cell",p:"11:00",
         how:"Arrange 150g sliced Genoa salami, 100g prosciutto and 200g sharp provolone cut into thick batons on a board. Add 150g pepperoncini and 150g marinated mushrooms in small bowls. Tear 1 loaf of seeded Italian bread by hand and set it beside the board.",
         shop:["150g Genoa salami@Deli","100g prosciutto@Deli","200g sharp provolone@Deli","150g pepperoncini@Deli","150g marinated mushrooms@Deli","1 loaf Italian bread@Bakery"]},
        {k:"Johnny Dio's pan steaks",n:"Johnny Dio's pan steaks",note:"Rare for some, medium for the rest",p:"5:30",c:"m",
         how:"Take 4 rump steaks, about 250g each, out of the fridge 30 minutes early and season well with salt and pepper. Heat a heavy pan with 1 tbsp olive oil until smoking. Cook two at a time, 2 to 3 minutes each side for rare, 4 for medium. In the last minute add 30g butter and 2 smashed garlic cloves and spoon them over. Rest 5 minutes.",
         shop:["4 rump steaks, about 1kg@Meat","30g butter@Dairy","2 garlic cloves@Produce","1 tbsp olive oil@Pantry"]}]},
      {h:"Last thing",items:[
        {k:"Red wine, opened early",n:"Red wine, opened early",note:"Short glasses. Pour it like they did inside",p:"6:00",c:"d",
         how:"Open 2 bottles of Italian red, a Chianti or Montepulciano, an hour before dinner. Serve in short tumblers.",
         shop:["2 bottles Italian red wine@Bottle shop"]}]}]},
  "Ghostbusters (1984)":{fmt:"workorder",brand:"Firehouse work order",trade:"Paranormal investigation and elimination · 24 hours",address:"14 North Moore St, NYC",
    plaque:["Hook & Ladder 8","14 North Moore St · Tribeca"],tag:"Slime included.<br>Ghosts not.",
    fields:[["Client","Movie night crew"],["Location","Your living room"],["Problem","Class 5 snack apparition"]],
    phone:"555-2368",slogan:"We're ready to believe you",total:"$45.00",signed:"P. Venkman, PhD",
    groups:[
      {h:"Containment",items:[
        {k:"Slimer's slime dip",note:"Green, gooey, highly reactive",p:"6.00"},
        {k:"Dana's fridge devilled eggs",n:"Fridge devilled eggs",note:"Something in the fridge. Not the eggs",p:"5.00"},
        {k:"Toasted marshmallow skewers",n:"Marshmallow skewers",note:"In honour of the big guy",p:"4.00"}]},
      {h:"Mains",items:[
        {k:"Firehouse meatball sub",note:"Long enough for the whole crew",p:"9.00"},
        {k:"Chinese takeaway at the firehouse",n:"Firehouse Chinese",note:"Eaten out of the boxes on the desk",p:"9.00"}]},
      {h:"Sweet & cold",items:[
        {k:"Stay Puft s'mores",note:"Toasted till they melt down",p:"7.00"},
        {k:"Ectoplasm slushie",note:"Lime, ice and very green",p:"5.00"}]}]},
  "The Big Lebowski (1998)":{fmt:"lanes",brand:"Hollywood Star Lanes",place:"Hollywood Star Lanes",address:"5227 Santa Monica Blvd · 32 lanes",
    team:"Dude, Walter, Donny",night:"League night",tag:"The Dude abides.<br>So does the White Russian.",
    rules:"This is bowling.<br>There are rules.<br>Shoes required",rugLine:"It really tied the room together",
    groups:[
      {h:"Snack bar",items:[
        {k:"League night chilli con queso nachos",n:"Alley nachos",note:"League night with Walter and Donny",p:"2.95"},
        {k:"Rug-pattern paprika lavash crackers",note:"It really tied the room together",p:"1.95"},
        {k:"Half-and-half whipped ricotta honey dip",note:"The Dude buys it in his dressing gown",p:"2.50"}]},
      {h:"Grill",items:[
        {k:"Bowling alley burgers",n:"Alley burgers",note:"Walter, Donny and the Dude between frames",p:"3.95",mark:1},
        {k:"League night chilli dogs",n:"Drive-thru burger",note:"Eaten in the Dude's beat-up car",p:"2.49"}]},
      {h:"Lounge",items:[
        {k:"Coffee liqueur ice cream cookie sandwiches",note:"For the half and half",p:"1.50"},
        {k:"White Russian",note:"The Dude's drink, every scene",p:"3.50"}]}]},
  "Pulp Fiction (1994)":{fmt:"slims",brand:"Jack Rabbit Slim's",place:"Jack Rabbit Slim's",
    sub:"Hollywood &nbsp;·&nbsp; Car booths &nbsp;·&nbsp; Twist contest tonight",
    under:"Now playing<br>in every car booth",tag:"Five dollar shakes. Worth every cent.",
    colA:[
      {h:"Little things",items:[
        {k:"Royale with cheese sliders",n:"Royale with cheese",note:"What they call a quarter pounder in Paris",p:"3.95"},
        {k:"Big Kahuna burger bites",n:"Kahuna bites",note:"That is a tasty burger",p:"3.95"},
        {k:"Jack Rabbit Slim's fries",n:"Slim's fries",note:"Hot, salty, built for the booth",p:"1.95"}]},
      {h:"Hollywood plates",items:[
        {k:"Douglas Sirk steak",note:"Vincent's order. Bloody as hell",p:"15.95",special:"House special"},
        {k:"Big Kahuna Hawaiian burger",n:"Big Kahuna burger",note:"Brett's breakfast, pineapple and all",p:"6.95"}]}],
    colB:[
      {h:"Fountain & sweets",items:[
        {k:"Five dollar shake",n:"Martin & Lewis shake",note:"Vanilla. Mia's order",p:"5.00",burst:["$5","Worth it","#ffd23a",-8]},
        {k:"Vanilla Coke",note:"Vincent's order. Coke, with vanilla",p:"1.50",how:"Fill four tall glasses with ice. Add 15ml vanilla syrup to each (or half a teaspoon of vanilla extract with a teaspoon of sugar syrup), top with 300ml cold cola and stir once.",shop:["1.25L cola@Drinks","vanilla syrup@Pantry","1 bag ice@Frozen"]},
        {k:"Diner pancakes",n:"Coffee shop stack",note:"The opening scene, before the robbery",p:"3.50"}]}],
    trophy:["Twist contest","Won by Vincent and Mia. They kept the trophy."],
    hosts:{h:"Tonight at Slim's",rows:[["Your waiter","Buddy Holly"],["Hostess","Marilyn"],["Your booth","A '50s convertible"],["On the floor","The twist contest"]]}},
  "Kung Fu Panda (2008)":{fmt:"noodle",brand:"Mr Ping's Noodle Shop",sign:"Mr Ping's Noodle Shop",signZh:"平記麵館",
    tag:"There is no secret ingredient.<br>Except dumplings.",motto:"沒有秘方",quote:["We are noodle folk. Broth runs deep through our veins.","Mr Ping"],sheetH:"Today's menu in plain words",sheetSide:"Serves four · priced in coins",
    colA:[{h:"Small plates",items:[
        {k:"Training bowl dumplings",zh:"練功餃子",coinZh:"三文",p:"3 coins",note:"Shifu makes Po fight for the last one"},
        {k:"Oogway's peaches",zh:"仙桃",coinZh:"二文",p:"2 coins",note:"From the tree where Oogway sits"},
        {k:"Mr Ping's red bean steamed buns",zh:"豆沙包",coinZh:"四文",p:"4 coins",note:"Stacked high, worth the climb"}]},
      {h:"Noodles & wok",items:[
        {k:"Secret ingredient soup",zh:"秘方湯麵",coinZh:"五文",p:"5 coins",note:"Mr Ping's famous noodle soup"},
        {k:"Valley of Peace kung pao chicken",zh:"和平谷小炒",coinZh:"六文",p:"6 coins",note:"The busy village below the Jade Palace"}]}],
    colB:[{h:"Sweet & tea",items:[
        {k:"Almond cookies",zh:"杏仁餅",coinZh:"二文",p:"2 coins",note:"The Furious Five's training snack"},
        {k:"Oogway's iced peach jasmine tea",zh:"茉莉花茶",coinZh:"一文",p:"1 coin",note:"A quiet moment in the Jade Palace"}]}]},
  "Big Trouble in Little China (1986)":{fmt:"takeaway",brand:"Chinatown takeaway",
    title:["Big Trouble","in Little China"],signs:["唐人街","大酒樓"],tag:"Something big is cooking in Chinatown",
    colA:[
      {h:"Entrées",zh:"點心",items:[
        {k:"Pork and chive dumplings",n:"Pork & chive dumplings",code:"A1",zh:"韭菜豬肉餃",extra:"steamed or pan fried, 8 pcs",note:"Wang's family restaurant, before everything goes sideways",p:"5.80"},
        {k:"Salt and pepper squid",n:"Salt & pepper squid",code:"A2",zh:"椒鹽鮮魷",extra:"with lemon",note:"Late night in Chinatown",p:"8.50",hot:1}]},
      {h:"Noodles & Mains",zh:"麵食小菜",items:[
        {k:"Wang Chi's dan dan noodles",n:"Wang Chi's dan dan",code:"M1",zh:"擔擔麵",extra:"Sichuan style",note:"Crisp pork, Sichuan pepper, chilli oil",p:"7.90",hot:2},
        {k:"Pork-Chop Express ribs",code:"M2",zh:"叉燒排骨",extra:"honey char siu",note:"Straight off Jack's truck. Sticky fingers guaranteed",p:"12.80",special:"Chef's Special"}]}],
    colB:[
      {h:"Dessert & Drinks",zh:"甜品飲品",items:[
        {k:"Fortune cookies",code:"D1",zh:"幸運餅",extra:"one each",note:"Jack would ignore his anyway",p:"1.00"},
        {k:"Egg Shen's plum wine sour",n:"Egg Shen's plum wine",code:"D2",zh:"梅酒",extra:"by the glass",note:"The bottle for the trip below",p:"3.50"}]}],
    banquet:{name:"Banquet A",price:"$16.50",lines:["Pork & chive dumplings","Salt & pepper squid","Pork-Chop Express ribs","Fortune cookies / Plum wine"]},
    hours:["Open 7 nights &nbsp;·&nbsp; 5pm till late","Licensed &amp; B.Y.O. &nbsp;·&nbsp; Dine in or take away"],
    fold:{name:"Chinatown Takeaway",line:"Family recipes, late into the night",flapLine:"Find your year, then turn the page",
      address:"Grant Avenue, near Washington Street<br>Chinatown, San Francisco",
      notes:["Every dish is cooked to order and packed hot for the trip home.","Ask about the plum wine. Egg Shen swears by it before a long night."],
      stills:[["/7LK2053iOtiat3MeWM3S4MZ2mXK.jpg","Jack, Gracie, Miao Yin and Wang"],["/gPpcZPLMQ1ygk0PwIygO9qsjx0M.jpg","Jack and the crew, heading under Chinatown"],["/f1MCWiYy7QbQY5r0LSREGW1nINN.jpg","Thunder, one of the Three Storms"],["/giERHPpe9vINE6VMDoSh3BHGk4O.jpg","Lo Pan's hall, under the city"]],
      map:{roads:[{v:1,at:30,n:"Grant Ave",w:12,label:74},{v:1,at:70,n:"Stockton St",label:70},{at:34,n:"Washington St",label:58},{at:72,n:"Jackson St",label:40}],spots:[{x:84,y:16,n:"Gate"}],us:{x:30,y:34,n:"We're here"}}}},
  "My Cousin Vinny (1992)":{fmt:"diner",brand:"Wazoo Diner",
    title:["My Cousin","Vinny"],place:"Wazoo, Alabama",name:"Wazoo Diner",tag:"Two yutes walk into a diner",est:"Est. 1952 · Off Route 31 · Ample parking",
    colA:[
      {h:"From the Griddle",items:[
        {k:"Five-minute grits",d:"butter & sharp cheddar",note:"The grits cross-examination. Nobody cooks them that fast",p:"1.25"},
        {k:"Fried green tomatoes",d:"cornmeal crust, remoulade",note:"Alabama's finest",p:"2.95"},
        {k:"Biscuits and sausage gravy",n:"Biscuits & gravy",d:"two biscuits, sausage gravy",note:"Where Vinny tries to order breakfast",p:"1.75"}]},
      {h:"Blue Plate Special",items:[
        {k:"Sac-O-Suds chicken fried steak",n:"Chicken fried steak",d:"cream gravy, mashed potatoes",note:"Sac-O-Suds, the corner store where the whole mess started",p:"5.95",special:"Today's special"}]},
      {h:"Soda Fountain",items:[
        {k:"Wazoo peach sweet tea",d:"by the pitcher, lemon on the side",note:"So sweet your teeth hurt",p:"0.75"}]}],
    colB:[
      {h:"From the Pie Case",items:[
        {k:"Mona Lisa's blackberry cobbler",n:"Blackberry cobbler",d:"warm, with pouring cream",note:"Mona Lisa's pick. Wazoo, Alabama, ticking clock and all",p:"1.95"}]}],
    supper:{name:"Family Supper",price:"$19.95",lines:["Grits / Fried green tomatoes","Chicken fried steak & gravy","Cobbler / A pitcher of sweet tea"]},
    glossary:{h:"Southern for beginners",rows:[["Grits","Ground hominy corn. Twenty minutes, minimum."],["Yute","Brooklyn for youth. Ask the judge"],["Sweet tea","Sugared while hot. Never served unsweet."],["Biscuit","A soft scone. Comes with gravy."]]},
    foot:["Breakfast served all day","Bottomless coffee 50¢"],
    hours:["Open 5am till 2pm &nbsp;·&nbsp; Closed Sundays","Truckers welcome &nbsp;·&nbsp; Air conditioned"],
    fold:{line:"Home cooking since 1952",flapHead:"Welcome, y'all",flapLine:"New in town? Start here",
      address:"Off Route 31<br>Wazoo, Beechum County, Alabama",
      notes:["Pies baked every morning. When they're gone, they're gone."],
      stills:[["/q8VYbgpxoAhUqUX8gK5EEGFg5nU.jpg","Vinny and Mona Lisa, breakfast in Wazoo"],["/zUoIx6XGzebunhKyNa7g5FUcRxV.jpg","The two yutes at the defence table"],["/rhkBvpVTMI3uej6zQqVHwYhhwzS.jpg","Mona Lisa takes the stand"],["/wVPRJjW3WRDGMVsJHB93P2ZRxH9.jpg","Mona Lisa, camera at the ready"]],
      map:{roads:[{v:1,at:24,n:"Route 31",w:16,label:16},{at:58,n:"Main Street",label:46},{v:1,at:76,n:"Mill Road",label:20}],spots:[{x:60,y:28,n:"Courthouse"},{x:56,y:84,n:"Sac-O-Suds"}],us:{x:24,y:58,n:"Wazoo Diner"}}}},
  "The Untouchables (1987)":{fmt:"casefile",brand:"Bureau of Prohibition",
    bureau:"BUREAU OF PROHIBITION",city:"CHICAGO, ILL.",caseNo:"1930-CHI-0417",received:"OCT 17 1930",office:"CHICAGO FIELD OFFICE",
    timeline:[["1920","The country goes dry."],["1929","Ness picks his team."],["1931","Capone goes down."],["1933","Repeal day. Cheers."]],
    colA:[
      {h:"Seized from the kitchen",items:[
        {k:"Capone's arancini",code:"A.",note:"Recovered from the Lexington Hotel kitchen",p:"10¢"},
        {k:"Lexington Hotel antipasto",n:"Lexington antipasto",code:"B.",note:"Capone's banquet, before the bat comes out",p:"25¢"},
        {k:"Italian beef",code:"C.",note:"Shaved, dipped and hot. Chicago style",p:"15¢",special:"MAIN CHARGE"},
        {k:"Ricotta zeppole",code:"D.",note:"From the Italian bakeries of 1930s Chicago",p:"5¢"}]}],
    colB:[
      {h:"Seized from the cellar",items:[
        {k:"Bootleg lager",code:"E.",note:"Capone's beer. Every bar had to stock it",p:"10¢",how:"Chill 8 bottles of crisp lager for at least 3 hours. Pour into heavy glass steins straight down the middle so each gets a proper head.",shop:["8 bottles lager@Bottle shop"]},
        {k:"Canadian rye",code:"F.",note:"Crates seized at the border raid",p:"35¢",how:"Pour 30ml Canadian rye whisky per person over one large ice cube in a short glass, then add a small splash of cold water to open it up.",shop:["700ml Canadian rye whisky@Bottle shop","1 bag large ice cubes@Frozen"]},
        {k:"Repeal Day old fashioned",code:"G.",note:"Ness finally has a drink",p:"25¢"}]}]},
  "Friday (1995)":{fmt:"market",
    sign:["Off Normandie","126th St. Market","Open 7 days"],
    sub:"Porch menu &nbsp;·&nbsp; Serves four &nbsp;·&nbsp; Summer 1995",
    tag:"It's Friday. You ain't got no job,<br>and you ain't got nothing to do.<br>So you getting fed.",
    services:"Ice &nbsp;·&nbsp; Snacks &nbsp;·&nbsp; Money orders &nbsp;·&nbsp; Lotto",
    window:["No credit.","Pay what you owe."],
    colA:[
      {h:"Sandwiches",c:"blue",items:[
        {k:"Peanut butter AND jelly toasties",note:"Never two things that match. Now they do.",p:"1.50"},
        {k:"Ham AND burger sliders",note:"Ham, no burger. Fixed.",p:"2.99"}]},
      {h:"Off the Grill",c:"red",items:[
        {k:"Porch day barbecue plate",n:"Porch day BBQ plate",note:"Drumsticks, corn, potato salad. Eat it on the steps.",p:"4.99",burst:["$4.99","Big plate","#b6ff3b",-10]},
        {k:"Chilli-lime grilled pineapple spears",n:"Pineapple spears",note:"Off the kitchen counter, grill-charred.",p:"1.00"}]}],
    colB:[
      {h:"From the Truck",c:"blue",items:[
        {k:"Big Worm's ice cream truck cones",n:"Big Worm's cones",note:"Dipped, crunchy, rolling down the street.",p:"1.25"}]},
      {h:"Cold Drinks",c:"red",items:[
        {k:"Red drink, with sugar this time",n:"Red drink",note:"With sugar this time. Big cups, lots of ice.",p:"0.75",burst:["75¢","With sugar!","#ff6ec7",9]}]}]}
};
const fmtSpec=f=>FMT_FILMS[f.id]||null;

/* the dishes, in menu order, with the 4-person method and shopping from the recipe file when there is one */
function fmtMenu(f,spec){
  const exact=exactMenu(f),pool={};
  for(const k of ["S","M","W","K"])for(const it of f[k]||[])pool[it[0]]=toItem(it);
  if(exact)for(const k of ["s","m","w","d"])for(const it of exact[k]||[])pool[it.n]=it;
  const groups=spec.groups||(spec.order?spec.order.map(i=>[...spec.colA,...spec.colB][i]):[...spec.colA,...spec.colB]);
  const all=groups.flatMap(g=>g.items.map(x=>{const b=Object.assign({},pool[x.k]||{n:x.k,note:x.note,how:"",shop:[]},x.how?{how:x.how,shop:x.shop||[]}:{});return Object.assign({},b,{label:x.n||x.k,desc:x.d||"",film:x.note,price:x.p,special:x.special,c:x.c})}));
  const byCourse={s:[],m:[],w:[],d:[]};
  for(const it of all){const c=it.c||((f.S||[]).some(d=>d[0]===it.n)?"s":(f.M||[]).some(d=>d[0]===it.n)?"m":(f.W||[]).some(d=>d[0]===it.n)?"w":"d");byCourse[c].push(it)}
  return Object.assign(byCourse,{all,groups,fmt:true});
}

/* ---------- the painted wall of a 90s South Central corner market (Friday) ---------- */
function fmtStar(text,sub,bg,rot,w){
  const n=14,pts=[];for(let i=0;i<n*2;i++){const r=i%2?39:50,a=Math.PI*i/n-Math.PI/2;pts.push(`${(50+r*Math.cos(a)).toFixed(1)}% ${(50+r*Math.sin(a)).toFixed(1)}%`)}
  return `<div style="position:relative;width:${w}px;height:${w}px;transform:rotate(${rot}deg);filter:drop-shadow(2px 4px 3px rgba(0,0,0,.3))"><div class="fx-star-bg" data-bg="${bg}" style="position:absolute;inset:0;background:${bg};clip-path:polygon(${pts.join(",")})"></div><div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-family:'Permanent Marker',cursive;color:#151515;line-height:1"><div><div style="font-size:${Math.round(w*.24)}px">${ESC(text)}</div><div style="font-size:${Math.round(w*.105)}px;margin-top:3px;text-transform:uppercase">${ESC(sub)}</div></div></div><span style="position:absolute;left:50%;top:-6px;width:42px;height:14px;margin-left:-21px;background:rgba(255,255,255,.55);transform:rotate(-6deg)"></span></div>`;
}
/* the export tool can't draw clip-path shapes, so each star is swapped for a drawn picture of itself */
function fmtStarsPNG(root){
  if(typeof document==="undefined"||!document.createElement)return;
  root.querySelectorAll(".fx-star-bg").forEach(el=>{
    try{const S=240,c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");x.fillStyle=el.dataset.bg;x.beginPath();
      for(let i=0;i<28;i++){const r=(i%2?.39:.5)*S,a=Math.PI*i/14-Math.PI/2;x.lineTo(S/2+r*Math.cos(a),S/2+r*Math.sin(a))}
      x.closePath();x.fill();el.style.clipPath="none";el.style.background=`url("${c.toDataURL("image/png")}") center/100% 100% no-repeat`}catch(e){}
  });
}
function fmtMarket(f,spec,menu,poster){
  const RED="#c8202a",BLUE="#1e3c8c",YEL="#ffd03a",INK="#151515",SHADOW="#8b8478";
  const PAINT="font-family:'Anton',sans-serif;font-weight:400",SCRIPT="font-family:'Mr Dafoe',cursive;font-weight:400",MARK="font-family:'Permanent Marker',cursive;font-weight:400",HAND="font-family:'Caveat Brush',cursive;font-weight:400";
  const STUCCO="background-color:#f1e6cf;background-image:radial-gradient(rgba(120,100,70,.10) 1px,transparent 1.6px),radial-gradient(rgba(255,255,255,.5) 1px,transparent 1.8px),radial-gradient(ellipse at 20% 30%,rgba(160,130,90,.10),transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(160,130,90,.12),transparent 55%);background-size:7px 7px,11px 11px,100% 100%,100% 100%;background-position:0 0,3px 5px,0 0,0 0";
  const col=c=>c==="red"?RED:BLUE;
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const head=(t,c)=>`<div style="${PAINT};font-size:31px;line-height:1;letter-spacing:.03em;color:${c};text-shadow:3px 3px 0 ${SHADOW};transform:rotate(-1deg);white-space:nowrap;text-transform:uppercase">${ESC(t)}</div>`;
  const name=t=>`<span style="${PAINT};font-size:26px;line-height:1.05;color:${INK};letter-spacing:.02em;text-transform:uppercase;white-space:nowrap">${ESC(t)}</span><span style="flex:1;border-bottom:3px dotted rgba(21,21,21,.45);transform:translateY(-6px);min-width:10px"></span>`;
  const note=t=>`<div style="${HAND};font-size:20.5px;line-height:1.15;color:#3d3a35;margin-top:2px">${ESC(t)}</div>`;
  const item=x=>{const it=pick(x.k),lab=it.label||x.n||x.k;
    if(x.burst)return `<div style="position:relative;padding-right:96px"><div style="display:flex;align-items:baseline;gap:10px">${name(lab)}</div>${note(x.note)}<div style="position:absolute;right:-8px;top:-12px">${fmtStar(x.burst[0],x.burst[1],x.burst[2],x.burst[3],98)}</div></div>`;
    return `<div><div style="display:flex;align-items:baseline;gap:10px">${name(lab)}<span style="${PAINT};font-size:27px;color:${RED};text-shadow:2px 2px 0 ${SHADOW}">${ESC(x.p)}</span></div>${note(x.note)}</div>`};
  const SP=`<div class="fx-sp" aria-hidden="true" style="flex:1 1 0;min-height:6px"></div>`;
  const sect=g=>`<div style="display:flex;flex-direction:column;gap:12px">${head(g.h,col(g.c))}${g.items.map(item).join("")}</div>`;
  const tape=(pos,t,r)=>`<span aria-hidden="true" style="position:absolute;${pos};top:${t}px;width:54px;height:16px;background:rgba(255,250,235,.7);box-shadow:0 1px 2px rgba(0,0,0,.15);transform:rotate(${r}deg)"></span>`;
  const notice=`<div style="position:relative;background:#fffef8;padding:14px 18px 15px;transform:rotate(1.2deg);box-shadow:0 4px 8px rgba(0,0,0,.2);border:1px solid #e3ddcc">${tape("left:14px",-8,-8)}${tape("right:14px",-8,7)}<div style="${MARK};font-size:20px;color:${RED}">Showtime cue</div><div style="${MARK};font-size:22px;line-height:1.22;color:${INK};margin-top:5px">${ESC(fmtCue(f))}</div></div>`;
  const services=`<div style="${PAINT};font-size:17px;letter-spacing:.05em;color:${BLUE};text-shadow:2px 2px 0 ${SHADOW};white-space:nowrap;border-top:3px solid ${BLUE};padding-top:8px;text-transform:uppercase">${spec.services}</div>`;
  const GAP=`<div aria-hidden="true" style="flex:none;height:30px"></div>`;
  const today=spec.today?`<div style="border-top:3px solid ${RED};padding-top:10px"><div style="${PAINT};font-size:22px;letter-spacing:.04em;color:${RED};text-shadow:2px 2px 0 ${SHADOW};text-transform:uppercase;margin-bottom:3px">${ESC(spec.today.h)}</div>${spec.today.rows.map(([t,d])=>`<div style="display:flex;gap:10px;align-items:baseline;padding:2px 0"><span style="${PAINT};font-size:15px;letter-spacing:.06em;color:${BLUE};width:74px;flex:none;text-transform:uppercase">${ESC(t)}</span><span style="${HAND};font-size:18px;line-height:1.1;color:#3d3a35">${ESC(d)}</span></div>`).join("")}</div>`:"";
  const colA=`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column">${spec.colA.map(sect).join(GAP)}${SP}${services}</div>`;
  const colB=`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column">${spec.colB.map(sect).join(GAP)}${SP}${notice}</div>`;
  const win=`<div style="position:relative;flex:none;width:330px;align-self:stretch;padding:14px;background:#2b2b2b;box-shadow:inset 0 0 0 3px #111,0 10px 18px rgba(0,0,0,.3)">
    <div style="position:relative;height:100%;overflow:hidden;background:linear-gradient(160deg,#20304f,#0e1628);display:grid;place-items:center">
      <div style="position:relative;width:262px;height:393px;background:#fff;padding:6px;box-shadow:0 6px 14px rgba(0,0,0,.45);transform:rotate(-1.5deg)">${poster?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w500${ESC(poster)}" alt="${ESC(f.title)} (${ESC(f.year)}) film poster" style="display:block;width:100%;height:100%;object-fit:cover">`:""}${tape("left:-14px",-6,-35)}${tape("right:-14px",-6,35)}${tape("left:-14px",386,35)}${tape("right:-14px",386,-35)}</div>
      <div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.2) 0 12%,rgba(255,255,255,0) 24%,rgba(255,255,255,0) 62%,rgba(255,255,255,.1) 70%,rgba(255,255,255,0) 78%);pointer-events:none"></div></div>
    <div style="position:absolute;left:18px;top:26px;z-index:3;padding:6px 12px 7px;border:3px solid #ff8a96;border-radius:22px;background:#24060d;box-shadow:0 0 12px rgba(255,45,85,.85)"><span style="${PAINT};font-size:26px;letter-spacing:.12em;color:#fff0f2;text-shadow:0 0 6px #ff2d55,0 0 14px #ff2d55">OPEN</span></div>
    <div style="position:absolute;right:18px;bottom:22px;background:#fffef8;padding:9px 14px 10px;transform:rotate(-4deg);box-shadow:0 4px 8px rgba(0,0,0,.25);border:1px solid #e3ddcc;z-index:3">${tape("left:50%;margin-left:-27px",-9,3)}<div style="${MARK};font-size:21px;line-height:1.05;color:${INK};text-transform:uppercase">${ESC(spec.window[0])}</div><div style="${MARK};font-size:15px;color:${RED}">${ESC(spec.window[1])}</div></div></div>`;
  const s=spec.sign;
  const sign=`<div style="position:relative;background:${RED};padding:8px 20px 9px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 5px 0 rgba(0,0,0,.18)"><span style="${PAINT};font-size:16px;letter-spacing:.08em;color:#fff;text-transform:uppercase">${ESC(s[0])}</span><span style="${PAINT};font-size:40px;letter-spacing:.06em;color:${YEL};text-shadow:3px 3px 0 #6e0f14;text-transform:uppercase">${ESC(s[1])}</span><span style="${PAINT};font-size:16px;letter-spacing:.08em;color:#fff;text-transform:uppercase">${ESC(s[2])}</span></div>`;
  const title=`<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px"><div><h2 style="margin:0;${SCRIPT};font-size:${f.title.length>10?72:104}px;line-height:.8;color:${BLUE};text-shadow:4px 4px 0 ${SHADOW};transform:rotate(-3deg);transform-origin:left bottom">${ESC(f.title)}</h2><div style="${PAINT};font-size:19px;letter-spacing:.08em;color:${INK};margin-top:18px;text-transform:uppercase">${spec.sub}</div></div><div style="${HAND};font-size:20px;line-height:1.12;color:${RED};text-align:right;transform:rotate(2deg);padding-bottom:6px;white-space:nowrap">${spec.tag}</div></div>`;
  return `<div class="fx-back" aria-hidden="true">${poster?`<img crossorigin="anonymous" alt="" src="${TMDB_IMG}w342${ESC(poster)}">`:""}</div>
  <div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;${STUCCO};display:flex;flex-direction:column;box-shadow:0 26px 60px rgba(0,0,0,.7);color:${INK}">${sign}
    <div style="flex:1;min-height:0;display:flex;gap:26px;padding:22px 26px 22px 22px">${win}
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:18px">${title}<div style="flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1.22fr) minmax(0,1fr);gap:22px">${colA}${colB}</div></div></div>
    <div aria-hidden="true" style="height:16px;background:linear-gradient(#9a9284,#7d766a);box-shadow:inset 0 3px 0 rgba(255,255,255,.25)"></div></div>`;
}

const fmtCue=f=>(movieEdition(f)||{}).cue||f.P;
const FMT_RENDER={latenightcall:fmtLateNightCall,bookshopcafe:fmtBookshopCafe,dorothysupper:fmtDorothySupper,gershwinfolio:fmtGershwinFolio,annietable:fmtAnnieTable,orangefutures:fmtOrangeFutures,getawaysupper:fmtGetawaySupper,spenditall:fmtSpendItAll,mailroomexecutive:fmtMailroomExecutive,powerlunch:fmtPowerLunch,loftsupper:fmtLoftSupper,oceansupper:fmtOceanSupper,toystore:fmtToyStore,bowerybelow:fmtBoweryBelow,eventually:fmtDinnerEventually,unplanned:fmtUnplanned,sullivansupper:fmtSullivanSupper,sixteen:fmtSixteen,messenger:fmtMessenger,sohoaftermidnight:fmtSohoAfterMidnight,lasttrain:fmtLastTrain,negotiation:fmtNegotiation,leon:fmtLeon,cityrun:fmtCityrun,rooftop:fmtRooftop,plazanight:fmtPlazaNight,escape:fmtEscape,shift:fmtShift,acrossglass:fmtAcrossGlass,serpico:fmtSerpico,brooklyn:fmtBrooklyn,southbound:fmtSouthbound,nightshift:fmtNightshift,suite:fmtSuite,maytable:fmtMayTable,pizzatime:fmtPizzaTime,ooze:fmtOoze,moodslime:fmtMoodslime,perdition:fmtPerdition,southie:fmtSouthie,boatdrinks:fmtBoatdrinks,fever:fmtFever,cornerside:fmtCornerside,carmine:fmtCarmine,shorty:fmtShorty,flamingo:fmtFlamingo,highhat:fmtHighhat,village:fmtVillage,collection:fmtCollection,sobelsupper:fmtSobelSupper,prizzis:fmtPrizzis,miami:fmtMiami,afterhours:fmtAfterhours,leftys:fmtLeftys,paraiso:fmtParaiso,delancey:fmtDelancey,palermo:fmtPalermo,tangiers:fmtTangiers,bippy:fmtBippy,corleone2:fmtCorleoneII,maitland:fmtMaitland,roadtrip:fmtRoadtrip,corleone:fmtCorleone,chocolaterie:fmtChocolaterie,kitchenfolio:fmtKitchenFolio,moonlit:fmtMoonstruck,gimbels:fmtGimbels,lair:fmtLair,tonys:fmtTonys,whistle:fmtWhistle,sals:fmtSals,mcdowells:fmtMcdowells,coney:fmtConey,nakatomi:fmtNakatomi,jurassic:fmtJurassic,newsroom:fmtNewsroom,market:fmtMarket,takeaway:(...a)=>fmtTakeaway(...a),diner:(...a)=>fmtDiner(...a),casefile:(...a)=>fmtCase(...a),noodle:(...a)=>fmtNoodle(...a),slims:(...a)=>fmtSlims(...a),lanes:(...a)=>fmtLanes(...a),workorder:(...a)=>fmtWorkOrder(...a),nero:(...a)=>fmtNero(...a),carte:(...a)=>fmtCarte(...a),feast:(...a)=>fmtFeast(...a),truck:(...a)=>fmtTruck(...a),check:(...a)=>fmtCheck(...a),lous:(...a)=>fmtLous(...a),pad:(...a)=>fmtPad(...a)};
function fmtHTML(f,spec,menu){return FMT_RENDER[spec.fmt](f,spec,menu,lobbyPoster(f))}

/* phone view: same menu, big type, one section at a time, tap a dish for the method */
function fmtPhoneHTML(f,spec,menu){
  const P=FMT_PHONE[spec.fmt],poster=lobbyPoster(f);
  const groups=menu.groups;
  return `<div class="fp fp-${spec.fmt}" style="--fp-top:${P.top};--fp-top-ink:${P.topInk};--fp-paper:${P.paper};--fp-ink:${P.ink};--fp-soft:${P.soft};--fp-acc:${P.accent};--fp-tab:${P.tab};--fp-disp:${P.disp};--fp-name:${P.name};--fp-body:${P.body};--fp-price:${P.price};--fp-title:${P.title};--fp-note:${P.note||P.body}">
    <header class="fp-head">${poster?`<img class="fp-poster" crossorigin="anonymous" src="${TMDB_IMG}w185${ESC(poster)}" alt="">`:""}<div><div class="fp-brand">${spec.fmt==="mcdowells"?fmtMcdowellsMark("display:inline-block;width:24px;height:31px;vertical-align:middle;margin-right:7px"):""}${ESC(spec.sign?spec.sign[1]:spec.brand||"")}</div><h2 class="fp-title">${ESC(spec.phoneTitle||f.title)}</h2><p class="fp-tag">${spec.tag||ESC(f.T)}</p><p class="fp-hint">Serves four. Tap a dish for the method.</p></div></header>
    <div class="fp-tabs" role="tablist" aria-label="Menu sections">${groups.map((g,i)=>`<button type="button" role="tab" class="fp-tab" aria-selected="${i===0}" data-g="${i}">${ESC(g.tab||(g.h.length>14?g.h.replace(/^(Off|From) the /,"").replace(/^./,c=>c.toUpperCase()):g.h))}</button>`).join("")}</div>
    <div class="fp-body">${groups.map((g,i)=>`<section class="fp-sec" data-g="${i}" ${i?"hidden":""}><h3 class="fp-h">${ESC(g.h)}</h3>${g.items.map(x=>{const it=menu.all.find(y=>y.label===(x.n||x.k))||{};return `<button type="button" class="fp-dish" aria-expanded="false"><span class="fp-row"><span class="fp-name${P.upper?" up":""}">${spec.fmt==="newsroom"?ESC(it.label).replace("SCOTCH",'<mark style="background:#d5a244;color:#392c26;padding:0 2px">SCOTCH</mark>'):ESC(it.label)}</span><span class="fp-dots"></span><span class="fp-price">${ESC(x.burst?x.burst[0]:(it.price||""))}</span></span>${it.desc?`<span class="fp-desc">${ESC(it.desc)}</span>`:""}<span class="fp-film">${ESC(it.film||"")}</span><span class="fp-how" hidden>${ESC(it.how||"")}</span><span class="fp-more">How to make it</span></button>`}).join("")}</section>`).join("")}</div>
    <div class="fp-cue"><b>Showtime cue</b><span>${ESC(fmtCue(f))}</span></div>
    <button type="button" class="fp-flip">See the printed menu</button>
  </div>`;
}
function fmtPhoneWire(root){
  root.querySelectorAll(".fp-tab").forEach(t=>t.addEventListener("click",()=>{
    root.querySelectorAll(".fp-tab").forEach(x=>x.setAttribute("aria-selected",x===t));
    root.querySelectorAll(".fp-sec").forEach(s=>s.hidden=s.dataset.g!==t.dataset.g);
  }));
  root.querySelectorAll(".fp-dish").forEach(b=>b.addEventListener("click",()=>{
    const open=b.getAttribute("aria-expanded")!=="true";b.setAttribute("aria-expanded",open);
    b.querySelector(".fp-how").hidden=!open;b.querySelector(".fp-film").hidden=open;
    b.querySelector(".fp-more").textContent=open?"Back to the menu":"How to make it";
  }));
}
function fmtFontsReady(spec){
  const id="fmtfont-"+spec.fmt;
  if(typeof document!=="undefined"&&document.head&&!document.getElementById(id)){
    const l=document.createElement("link");l.id=id;l.rel="stylesheet";l.href=`https://fonts.googleapis.com/css2?${FMT_FONTS[spec.fmt]}&display=swap`;document.head.appendChild(l);
    return new Promise(r=>{l.onload=r;l.onerror=r;setTimeout(r,3500)}).then(()=>Promise.race([Promise.all(FMT_FAMS[spec.fmt].map(n=>document.fonts.load(`20px "${n}"`,"Aa"))),new Promise(r=>setTimeout(r,3500))])).catch(()=>{});
  }
  return Promise.resolve();
}

/* ---------- shared bits for the folded menus ---------- */
/* repeating border patterns are drawn on a canvas so saved images keep them (SVG textures get blanked on iPhone) */
const FMT_TILES={
  fret:(x,S,c)=>{x.strokeStyle=c.fg;x.lineWidth=S*.092;x.lineCap="square";x.beginPath();const p=[[2,22],[2,2],[22,2],[22,17],[7,17],[7,7],[17,7],[17,12],[12,12]].map(([a,b])=>[a*S/24,b*S/24]);x.moveTo(...p[0]);p.slice(1).forEach(q=>x.lineTo(...q));x.stroke()},
  planks:(x,S,c)=>{const g=x.createLinearGradient(0,0,S,0);g.addColorStop(0,"#5a3420");g.addColorStop(.5,"#6e4126");g.addColorStop(1,"#5c3521");x.fillStyle=g;x.fillRect(0,0,S,S);x.fillStyle="rgba(0,0,0,.35)";x.fillRect(0,0,S*.03,S);x.strokeStyle="rgba(255,215,160,.07)";x.lineWidth=S*.012;for(let i=1;i<7;i++){x.beginPath();x.moveTo(S*i/7.3,0);x.bezierCurveTo(S*i/7.3+S*.02,S*.3,S*i/7.3-S*.02,S*.7,S*i/7.3+S*.01,S);x.stroke()}},
  brick:(x,S,c)=>{x.fillStyle=c.fg;x.fillRect(0,0,S,S);x.fillStyle=x.fillStyle;const b="#8e3a2c",d="#7c3125";const h=S/2,m=S*.06;[[0,0,S,h],[-S/2,h,S,h],[S/2,h,S,h]].forEach(([X,Y,W,H],i)=>{x.fillStyle=i%2?d:b;x.fillRect(X+m/2,Y+m/2,W-m,H-m)})},
  rug:(x,S,c)=>{x.fillStyle=c.fg;x.beginPath();x.moveTo(S/2,S*.08);x.lineTo(S*.92,S/2);x.lineTo(S/2,S*.92);x.lineTo(S*.08,S/2);x.closePath();x.fill();x.fillStyle="#e8d7b0";x.beginPath();x.moveTo(S/2,S*.3);x.lineTo(S*.7,S/2);x.lineTo(S/2,S*.7);x.lineTo(S*.3,S/2);x.closePath();x.fill();x.fillStyle="#9b2a22";x.fillRect(S*.45,S*.45,S*.1,S*.1)},
  checker:(x,S,c)=>{x.fillStyle=c.fg;x.fillRect(0,0,S/2,S/2);x.fillRect(S/2,S/2,S/2,S/2)},
  kraft:(x,S,c)=>{x.fillStyle=c.fg;x.fillRect(S*.433,0,S*.067,S);x.fillStyle="rgba(255,240,210,.08)";x.fillRect(0,0,S*.2,S)},
  boards:(x,S,c)=>{x.fillStyle=c.fg;x.fillRect(0,0,S,S*.1);x.fillStyle="rgba(255,220,170,.06)";for(let i=1;i<6;i++){x.fillRect(0,S*(.1+i*.15),S,S*.012)}},
  ruled:(x,S,c)=>{x.clearRect(0,0,S,S);x.fillStyle=c.fg;x.fillRect(0,S-S*.05,S,S*.05)},
  felt:(x,S,c)=>{x.fillStyle=c.fg;x.fillRect(0,S*.7,S,S*.3)},
  oilcloth:(x,S,c)=>{x.fillStyle="rgba(241,230,208,.5)";x.fillRect(0,0,S/2,S);x.fillRect(0,0,S,S/2)},
  gingham:(x,S,c)=>{x.fillStyle="#fff";x.fillRect(0,0,S,S);x.globalAlpha=.55;x.fillStyle=c.fg;x.fillRect(0,0,S/2,S);x.fillRect(0,0,S,S/2);x.globalAlpha=1}
};
/* photocopied stills: greyscale, hard contrast, a little toner speckle, baked into the picture so saved images match */
function fmtPhotocopy(root){
  if(typeof document==="undefined"||!document.createElement)return Promise.resolve();
  return Promise.all([...root.querySelectorAll("img.fx-photocopy[data-src]")].map(img=>new Promise(done=>{
    const src=new Image();src.crossOrigin="anonymous";
    src.onload=()=>{try{const W=Math.min(900,src.naturalWidth),H=Math.round(W*src.naturalHeight/src.naturalWidth),c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");x.drawImage(src,0,0,W,H);
      const d=x.getImageData(0,0,W,H),p=d.data;let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
      for(let i=0;i<p.length;i+=4){let g=.3*p[i]+.59*p[i+1]+.11*p[i+2];g=(g-128)*1.55+136;if(rnd()<.012)g-=90*rnd();g=Math.max(18,Math.min(246,g));p[i]=g;p[i+1]=g;p[i+2]=g*.97}
      x.putImageData(d,0,0);img.src=c.toDataURL("image/jpeg",.86)}catch(e){img.src=img.dataset.src}img.removeAttribute("data-src");img.onload=()=>done();img.onerror=()=>done()};
    src.onerror=()=>{img.src=img.dataset.src;img.removeAttribute("data-src");done()};src.src=img.dataset.src;setTimeout(done,6000)})));
}
function fmtTilesPNG(root){
  if(typeof document==="undefined"||!document.createElement)return;
  root.querySelectorAll("[data-tile]").forEach(el=>{
    try{const [kind,bg,fg,size]=el.dataset.tile.split("|"),S=+size*3,c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");
      x.fillStyle=bg;x.fillRect(0,0,S,S);FMT_TILES[kind](x,S,{fg});
      el.style.backgroundImage=`url("${c.toDataURL("image/png")}")`;el.style.backgroundSize=`${size}px ${size}px`}catch(e){}
  });
}
/* a ring of pattern strips inside a panel: top, bottom, left, right */
function fmtRing(kind,bg,fg,size,inset,w){
  const st=`position:absolute;background:${fg}`;
  return [`left:${inset}px;right:${inset}px;top:${inset}px;height:${w}px`,`left:${inset}px;right:${inset}px;bottom:${inset}px;height:${w}px`,`left:${inset}px;top:${inset}px;bottom:${inset}px;width:${w}px`,`right:${inset}px;top:${inset}px;bottom:${inset}px;width:${w}px`]
    .map(p=>`<i aria-hidden="true" data-tile="${kind}|${bg}|${fg}|${size}" style="${st};${p};background-repeat:repeat"></i>`).join("");
}
const fmtFold=`<i class="fx-fold" style="left:33.33%"></i><i class="fx-fold" style="left:66.66%"></i>`;
const fmtBack=poster=>`<div class="fx-back" aria-hidden="true">${poster?`<img crossorigin="anonymous" alt="" src="${TMDB_IMG}w342${ESC(poster)}">`:""}</div>`;
const fmtPosterImg=(f,poster,w,h,extra="")=>poster?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w500${ESC(poster)}" alt="${ESC(f.title)} (${ESC(f.year)}) film poster" style="display:block;width:${w}px;height:${h}px;object-fit:cover;${extra}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
const FX_SP=`<div class="fx-sp" aria-hidden="true" style="flex:1 1 0;min-height:12px"></div>`;
const fmtPanel=(bg,pad)=>`min-height:0;overflow:hidden;position:relative;background:linear-gradient(90deg,rgba(0,0,0,0) 92%,rgba(0,0,0,.09)),${bg};padding:${pad};display:flex;flex-direction:column;border-right:1px solid rgba(0,0,0,.12)`;

/* ---------- Chinese takeaway trifold (Big Trouble in Little China) ---------- */
const ZODIAC=[["鼠","Rat"],["牛","Ox"],["虎","Tiger"],["兔","Rabbit"],["龍","Dragon"],["蛇","Snake"],["馬","Horse"],["羊","Goat"],["猴","Monkey"],["雞","Rooster"],["狗","Dog"],["豬","Pig"]];
function fmtTakeaway(f,spec,menu,poster){
  const RED="#a51c24",GOLD="#d8b257",PG="#f2d58a",INK="#2a1610",NOTE="#5a4436",CREAM="#f6eedb";
  const DISP="font-family:'Fraunces',serif;font-variation-settings:'SOFT' 100,'WONK' 0",ZH="font-family:'Noto Serif TC',serif;font-weight:900",BODY="font-family:'Libre Caslon Text',serif";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const header=(en,zh)=>`<div style="display:flex;align-items:center;justify-content:center;gap:12px;background:${RED};color:${PG};padding:6px 10px 7px;box-shadow:0 0 0 2px ${CREAM},0 0 0 4px ${GOLD}"><span style="${DISP};font-weight:900;font-size:21px;white-space:nowrap">${ESC(en)}</span><span lang="zh-Hant" style="${ZH};font-size:17px;color:#fff;letter-spacing:.08em;white-space:nowrap">${zh}</span></div>`;
  const dish=x=>{const it=pick(x.k),ch=x.hot?`<span style="color:#c8102e;font-size:12px;letter-spacing:1px">${"&#9679;".repeat(x.hot)}</span>`:"";
    const inner=`<div style="display:flex;align-items:baseline;gap:7px"><span style="${DISP};font-weight:900;color:${RED};font-size:15px;width:26px;flex:none">${x.code}</span><span style="${DISP};font-weight:800;font-size:17.5px;line-height:1.1;letter-spacing:-.01em;white-space:nowrap">${ESC(it.label||x.n||x.k)}</span>${ch}<span style="flex:1;border-bottom:2px dotted rgba(42,22,16,.45);transform:translateY(-4px);min-width:8px"></span><span style="${DISP};font-weight:800;font-size:16.5px">${ESC(x.p)}</span></div>
      <div style="padding-left:33px;display:flex;align-items:baseline;gap:8px;margin-top:4px"><span lang="zh-Hant" style="${ZH};font-size:15px;color:${RED};letter-spacing:.06em">${x.zh}</span><span style="${BODY};font-size:12.5px;color:${NOTE}">${ESC(x.extra||"")}</span></div>
      <div style="${BODY};font-style:italic;font-size:14px;line-height:1.35;padding-left:33px;color:${NOTE};margin-top:3px">${ESC(x.note)}</div>`;
    return x.special?`<div style="position:relative;border:2px solid ${GOLD};background:#fbf3df;margin:0 -10px;padding:12px 10px 10px">${inner}<span style="position:absolute;right:10px;top:-11px;background:${RED};color:${PG};${DISP};font-weight:900;font-size:12px;letter-spacing:.08em;padding:2px 9px 3px">${ESC(x.special)}</span></div>`:`<div>${inner}</div>`};
  const sect=g=>`<div style="display:flex;flex-direction:column;gap:${g.items.some(i=>i.special)?15:13}px">${header(g.h,g.zh)}${g.items.map(dish).join("")}</div>`;
  const bottom=`border-top:2px solid ${RED};border-bottom:2px solid ${RED};padding:6px 0;height:46px;box-sizing:border-box;display:flex;align-items:center`;
  const fortune=`<div style="position:relative;align-self:stretch;margin:0 6px;transform:rotate(-1.5deg);background:#fff;border:1px solid #d6cdb8;padding:10px 16px 11px;box-shadow:0 5px 10px rgba(0,0,0,.18);text-align:center"><div style="${DISP};font-weight:900;font-size:13px;color:${RED}">Your fortune tonight</div><div style="${BODY};font-style:italic;font-size:14.5px;line-height:1.35;margin-top:3px">${ESC(fmtCue(f))}</div></div>`;
  const b=spec.banquet;
  const banquet=`<div style="border:2px solid ${RED};outline:1px solid ${RED};outline-offset:3px;padding:12px 14px;text-align:center;margin:0 4px"><div style="display:flex;justify-content:center;align-items:baseline;gap:10px"><span style="${DISP};font-weight:900;font-size:24px;color:${RED}">${ESC(b.name)}</span><span lang="zh-Hant" style="${ZH};font-size:18px;color:${RED}">酒席</span></div><div style="${BODY};font-size:12.5px;color:${NOTE};margin-top:2px">Minimum four people &nbsp;·&nbsp; <span style="${DISP};font-weight:900;font-size:16px;color:${INK}">${ESC(b.price)}</span> a head</div><div style="width:60px;height:1px;background:${RED};margin:8px auto 6px"></div><div style="${DISP};font-weight:600;font-size:15.5px;line-height:1.5">${b.lines.map(ESC).join("<br>").replace(/ \/ /g," &nbsp;·&nbsp; ")}</div></div>`;
  const yr=+f.year,hot=((yr-4)%12+12)%12,start=yr-hot-12;
  const zod=`<div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px"><span style="${DISP};font-weight:900;font-size:17px;color:${RED};white-space:nowrap">What year were you born?</span><span lang="zh-Hant" style="${ZH};font-size:15px;color:${RED}">生肖</span></div><div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px">${ZODIAC.map(([c,n],i)=>{const on=i===hot,y1=String(start+i).slice(2),y2=String(start+12+i).slice(2);return `<div style="background:${on?RED:"transparent"};text-align:center;padding:4px 0 3px;border:1px solid rgba(165,28,36,.35)"><div lang="zh-Hant" style="${ZH};font-size:19px;line-height:1.1;color:${on?PG:RED}">${c}</div><div style="${DISP};font-weight:800;font-size:11.5px;color:${on?"#fff":INK}">${n}</div><div style="${BODY};font-size:10.5px;color:${on?"#fff":INK}">${y1} · ${y2}</div></div>`}).join("")}</div></div>`;
  const P=fmtPanel(CREAM,"22px 22px 18px");
  const p1=`<div class="fx-panel" style="${P}">${spec.colA.map(sect).join(FX_SP)}${FX_SP}${fortune}${FX_SP}<div style="${bottom};justify-content:space-between;${BODY};font-size:12.5px;color:${NOTE}"><span><span style="color:#c8102e">&#9679;</span> mild &nbsp; <span style="color:#c8102e">&#9679;&#9679;</span> hot</span><span>No MSG on request</span><span>Serves four</span></div></div>`;
  const p2=`<div class="fx-panel" style="${P}">${spec.colB.map(sect).join(FX_SP)}${FX_SP}${banquet}${FX_SP}${zod}${FX_SP}<div style="${bottom};justify-content:center;text-align:center;${DISP};font-weight:700;font-size:13.5px;line-height:1.45">${spec.hours[0]}<br>${spec.hours[1]}</div></div>`;
  const vert=t=>`<div lang="zh-Hant" style="${ZH};font-size:22px;line-height:1.15;writing-mode:vertical-rl;letter-spacing:.15em;color:${PG}">${t}</div>`;
  const p3=`<div style="position:relative;background:${RED};padding:16px;display:flex">${fmtRing("fret",RED,GOLD,24,0,18)}
    <div style="position:relative;flex:1;margin:8px;border:2px solid ${GOLD};display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:14px 12px 12px;text-align:center;color:${PG}">
      <div style="display:flex;align-items:center;gap:14px"><span style="height:2px;width:46px;background:${GOLD}"></span><div style="width:58px;height:58px;border-radius:50%;background:${PG};display:grid;place-items:center;box-shadow:0 0 0 3px ${RED},0 0 0 5px ${PG}"><span lang="zh-Hant" style="${ZH};font-size:31px;color:${RED};line-height:1">福</span></div><span style="height:2px;width:46px;background:${GOLD}"></span></div>
      <div><h2 style="margin:0;${DISP};font-weight:900;font-size:46px;line-height:.92;color:${PG};text-shadow:2px 2px 0 #6e1016">${ESC(spec.title[0])}</h2>${spec.title[1]?`<div style="${DISP};font-weight:700;font-style:italic;font-size:21px;color:#fff;margin-top:3px">${ESC(spec.title[1])}</div>`:""}</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px"><div style="display:flex;align-items:center;gap:9px">${vert(spec.signs[0])}<div style="padding:5px;background:${PG};box-shadow:0 8px 18px rgba(0,0,0,.45)">${fmtPosterImg(f,poster,218,327)}</div>${vert(spec.signs[1])}</div><div style="${BODY};font-style:italic;font-size:16px;color:#fff">${ESC(spec.tag)}</div></div>
      <div style="width:100%;border-top:1px solid ${GOLD};padding-top:7px"><div style="${DISP};font-weight:900;font-size:19px">Phone orders welcome</div><div style="${BODY};font-size:12.5px;color:#fff;margin-top:2px">Est. ${ESC(f.year)} &nbsp;·&nbsp; Air conditioned &nbsp;·&nbsp; Ample parking</div></div>
    </div></div>`;
  if(arguments[4]==="parts")return {sect,fortune,banquet,zod,P,bottom,p3,INK,RED,GOLD,PG,NOTE,CREAM,DISP,BODY,ZH,legend:`<div style="${bottom};justify-content:space-between;${BODY};font-size:12.5px;color:${NOTE}"><span><span style="color:#c8102e">&#9679;</span> mild &nbsp; <span style="color:#c8102e">&#9679;&#9679;</span> hot</span><span>No MSG on request</span><span>Serves four</span></div>`,hours:`<div style="${bottom};justify-content:center;text-align:center;${DISP};font-weight:700;font-size:13.5px;line-height:1.45">${spec.hours[0]}<br>${spec.hours[1]}</div>`};
  return `${fmtBack(poster)}<div class="fx-sheet" style="color:${INK}">${p1}${p2}${p3}${fmtFold}</div>`;
}

/* ---------- Southern diner trifold (My Cousin Vinny) ---------- */
function fmtDiner(f,spec,menu,poster){
  const RED="#c41e2a",NAVY="#1f3a7a",CREAM="#fbf5e6",INK="#241a14",NOTE="#5b4a3c",MUSTARD="#f2b632";
  const SCRIPT="font-family:'Yellowtail',cursive;font-weight:400",SLAB="font-family:'Alfa Slab One',serif;font-weight:400",BODY="font-family:'Arvo',serif",HAND="font-family:'Kalam',cursive";
  const pick=k=>menu.all.find(x=>x.n===k)||{};let no=0;
  const header=t=>`<div style="display:flex;align-items:baseline;justify-content:center;gap:10px;background:${NAVY};color:#fff;padding:7px 10px 6px;box-shadow:0 0 0 2px ${CREAM},0 0 0 4px ${RED}"><span style="${SLAB};font-size:20px;letter-spacing:.03em;white-space:nowrap">${ESC(t)}</span></div>`;
  const dish=x=>{const it=pick(x.k);no++;
    const inner=`<div style="display:flex;align-items:center;gap:9px"><span style="flex:none;width:25px;height:25px;border-radius:50%;background:${RED};color:#fff;display:grid;place-items:center;${SLAB};font-size:13px">${no}</span><span style="${BODY};font-weight:700;font-size:17.5px;line-height:1.1;white-space:nowrap;letter-spacing:-.01em">${ESC(it.label||x.n||x.k)}</span><span style="flex:1;border-bottom:2px dotted rgba(36,26,20,.45);transform:translateY(4px);min-width:8px"></span><span style="${SLAB};font-size:17px;color:${RED}">${ESC(x.p)}</span></div>
      <div style="padding-left:34px;${BODY};font-size:13px;color:${NAVY};margin-top:4px;font-weight:700">${ESC(x.d)}</div>
      <div style="padding-left:34px;${BODY};font-style:italic;font-size:14px;line-height:1.35;color:${NOTE};margin-top:2px">${ESC(x.note)}</div>`;
    return x.special?`<div style="position:relative;margin:0 -10px;padding:13px 10px 10px;background:#fff;border:2px solid ${RED}">${inner}<span style="position:absolute;right:10px;top:-13px;background:${MUSTARD};color:${INK};${SLAB};font-size:12px;letter-spacing:.04em;padding:3px 9px;transform:rotate(2deg)">${ESC(x.special)}</span></div>`:`<div>${inner}</div>`};
  const sect=g=>`<div style="display:flex;flex-direction:column;gap:${g.extra?16:14}px">${header(g.h)}${g.items.map(dish).join("")}${g.extra||""}</div>`;
  const bottom=`border-top:3px double ${RED};border-bottom:3px double ${RED};padding:6px 0;height:48px;box-sizing:border-box;display:flex;align-items:center`;
  const P=fmtPanel(CREAM,"22px 22px 18px");
  const s=spec.supper;
  const supper=`<div style="background:${RED};color:#fff;padding:12px 14px;text-align:center;box-shadow:inset 0 0 0 3px ${RED},inset 0 0 0 5px #fff"><div style="${SCRIPT};font-size:30px;line-height:1;color:${MUSTARD}">${ESC(s.name)}</div><div style="${BODY};font-size:12.5px;margin-top:2px">Feeds four &nbsp;·&nbsp; <span style="${SLAB};font-size:16px">${ESC(s.price)}</span> the table</div><div style="width:60px;height:1px;background:#fff;margin:8px auto 6px;opacity:.7"></div><div style="${BODY};font-weight:700;font-size:14.5px;line-height:1.5">${s.lines.map(ESC).join("<br>").replace(/ \/ /g," &nbsp;·&nbsp; ")}</div></div>`;
  const gl=spec.glossary;
  const gloss=`<div style="border:3px double ${NAVY};background:#fff;padding:9px 12px 10px"><div style="${SLAB};font-size:16px;color:${RED};text-align:center;margin-bottom:6px">${ESC(gl.h)}</div><div style="display:flex;flex-direction:column;gap:4px">${gl.rows.map(([t,d])=>`<div style="display:flex;gap:8px;align-items:baseline"><span style="${SLAB};font-size:13.5px;color:${NAVY};width:72px;flex:none;white-space:nowrap">${ESC(t)}</span><span style="${BODY};font-size:12.5px;line-height:1.35;color:${NOTE}">${ESC(d)}</span></div>`).join("")}</div></div>`;
  const check=`<div style="position:relative;align-self:center;transform:rotate(-2deg);width:272px;background:#eef3e2;border:1px solid #b9c7a3;box-shadow:0 5px 10px rgba(0,0,0,.18);padding:8px 14px 10px"><div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #3f6b3a;padding-bottom:3px"><span style="${SLAB};font-size:13px;color:#3f6b3a;letter-spacing:.06em">Guest Check</span><span style="${BODY};font-size:11px;color:#3f6b3a">Table 4 &nbsp; Guests 4 &nbsp; No. ${ESC(f.year)}</span></div><div style="${HAND};font-size:17px;line-height:26px;color:#1d3aa8;background:repeating-linear-gradient(transparent 0 25px,rgba(63,107,58,.35) 25px 26px);margin-top:3px">${ESC(fmtCue(f))}</div></div>`;
  const p1=`<div class="fx-panel" style="${P}">${spec.colA.map(sect).join(FX_SP)}${FX_SP}<div style="${bottom};justify-content:space-between;${BODY};font-size:12.5px;color:${NOTE}"><span>${ESC(spec.foot[0])}</span><span>${ESC(spec.foot[1])}</span></div></div>`;
  const p2=`<div class="fx-panel" style="${P}">${spec.colB.map(sect).join(FX_SP)}${FX_SP}${supper}${FX_SP}${gloss}${FX_SP}${check}${FX_SP}<div style="${bottom};justify-content:center;text-align:center;${SLAB};font-size:13px;line-height:1.45;color:${INK};letter-spacing:.02em">${spec.hours[0]}<br>${spec.hours[1]}</div></div>`;
  const t=spec.title;
  const p3=`<div style="position:relative;background:#fff;padding:16px;display:flex">${fmtRing("gingham","#fff",RED,12,0,16)}
    <div style="position:relative;flex:1;margin:6px;background:${CREAM};border:3px solid ${RED};outline:2px solid ${NAVY};outline-offset:-8px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:20px 14px 16px;text-align:center">
      <div><div style="${SLAB};font-size:12px;letter-spacing:.08em;color:${NAVY}">${ESC(spec.place)}</div><div style="${SCRIPT};font-size:30px;color:${RED};line-height:1.1">${ESC(spec.name)}</div></div>
      <h2 style="margin:0;${SCRIPT};line-height:.9;color:${RED};text-shadow:3px 3px 0 ${NAVY}"><span style="display:block;font-size:44px">${ESC(t[0])}</span><span style="display:block;font-size:76px">${ESC(t[1])}</span></h2>
      <div style="position:relative;background:#fff;padding:7px;box-shadow:0 8px 18px rgba(0,0,0,.3);transform:rotate(-1.5deg)">${fmtPosterImg(f,poster,212,318)}<span style="position:absolute;left:-22px;bottom:-16px;width:66px;height:66px;border-radius:50%;background:${MUSTARD};color:${INK};display:grid;place-items:center;${SLAB};font-size:12px;line-height:1.05;transform:rotate(12deg);box-shadow:0 3px 6px rgba(0,0,0,.25)">Home<br>cooking<br>${ESC(f.year)}</span></div>
      <div style="${BODY};font-style:italic;font-size:16px;color:${INK}">${ESC(spec.tag)}</div>
      <div style="width:100%;border-top:2px solid ${RED};padding-top:8px"><div style="${SLAB};font-size:17px;color:${NAVY}">Call ahead for pickup</div><div style="${BODY};font-size:12.5px;color:${NOTE};margin-top:2px">${ESC(spec.est)}</div></div>
    </div></div>`;
  if(arguments[4]==="parts")return {reset:()=>{no=0},sect,supper,gloss,check,P,bottom,p3,INK,RED,NAVY,CREAM,NOTE,MUSTARD,SCRIPT,SLAB,BODY,
    foot:`<div style="${bottom};justify-content:space-between;${BODY};font-size:12.5px;color:${NOTE}"><span>${ESC(spec.foot[0])}</span><span>${ESC(spec.foot[1])}</span></div>`,
    hours:`<div style="${bottom};justify-content:center;text-align:center;${SLAB};font-size:13px;line-height:1.45;color:${INK};letter-spacing:.02em">${spec.hours[0]}<br>${spec.hours[1]}</div>`};
  return `${fmtBack(poster)}<div class="fx-sheet" style="color:${INK}">${p1}${p2}${p3}<div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.16) 38%,rgba(255,255,255,0) 46%)"></div>${fmtFold}</div>`;
}

/* ---------- Prohibition case file bifold (The Untouchables) ---------- */
function fmtCase(f,spec,menu,poster){
  const MANILA="#d9b77a",PAPER="#f6f1e3",INK="#1c1a17",RED="#9e1b1b",NOTE="#4a4438";
  const TYPE="font-family:'Special Elite',monospace;font-weight:400",MONO="font-family:'Courier Prime',monospace",SHOUL="font-family:'Big Shoulders Display',sans-serif",STEN="font-family:'Big Shoulders Stencil Display',sans-serif;font-weight:800";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const head=t=>`<div style="display:flex;align-items:center;gap:10px"><span style="${SHOUL};font-weight:900;font-size:21px;letter-spacing:.06em;color:${INK};white-space:nowrap;text-transform:uppercase">${ESC(t)}</span><span style="flex:1;height:0;border-top:2px solid ${INK};border-bottom:1px solid ${INK};padding-top:2px"></span></div>`;
  const item=x=>{const it=pick(x.k);
    const inner=`<div style="display:flex;align-items:baseline;gap:9px"><span style="${TYPE};font-size:15px;color:${RED};width:24px;flex:none">${x.code}</span><span style="${MONO};font-weight:700;font-size:17px;white-space:nowrap">${ESC(it.label||x.n||x.k)}</span><span style="flex:1;border-bottom:2px dotted rgba(28,26,23,.45);transform:translateY(-4px);min-width:8px"></span><span style="${SHOUL};font-weight:900;font-size:19px">${ESC(x.p)}</span></div><div style="${MONO};font-style:italic;font-size:14px;line-height:1.35;color:${NOTE};padding-left:33px;margin-top:2px">${ESC(x.note)}</div>`;
    return x.special?`<div style="position:relative;margin:0 -10px;padding:12px 10px 9px;border:2px solid ${RED};background:rgba(158,27,27,.05)">${inner}<span style="position:absolute;right:10px;top:-12px;background:${PAPER};color:${RED};border:2px solid ${RED};${STEN};font-size:13px;letter-spacing:.12em;padding:1px 8px">${ESC(x.special)}</span></div>`:`<div>${inner}</div>`};
  const sect=g=>`<div style="display:flex;flex-direction:column;gap:13px">${head(g.h)}${g.items.map(item).join("")}</div>`;
  const tl=spec.timeline;
  const timeline=`<div style="display:flex;flex-direction:column;gap:9px"><div style="${SHOUL};font-weight:900;font-size:17px;letter-spacing:.08em;color:${INK}">CASE TIMELINE</div>${tl.map(([y,d])=>`<div style="display:flex;gap:10px;align-items:baseline;border-left:3px solid ${RED};padding-left:9px"><span style="${TYPE};font-size:17px;color:${RED}">${ESC(y)}</span><span style="${MONO};font-size:13.5px;line-height:1.3">${ESC(d)}</span></div>`).join("")}</div>`;
  const cue=fmtCue(f).toUpperCase().replace(/[.,]$/,"");
  const left=`<div class="fx-panel" style="position:relative;min-height:0;overflow:hidden;background:linear-gradient(90deg,rgba(0,0,0,0) 90%,rgba(0,0,0,.14)),${MANILA};padding:26px 26px 24px 30px;display:flex;flex-direction:column">
    <div style="background:${PAPER};border:1px solid #b9a77f;padding:12px 16px;box-shadow:0 2px 4px rgba(0,0,0,.15)"><div style="display:flex;justify-content:space-between;${SHOUL};font-weight:700;font-size:13px;letter-spacing:.14em;color:${NOTE}"><span>${ESC(spec.bureau)}</span><span>${ESC(spec.city)}</span></div><h2 style="margin:6px 0 4px;${TYPE};font-size:${f.title.length>18?34:46}px;line-height:1;color:${INK}">${ESC(f.title)}</h2><div style="display:flex;justify-content:space-between;${TYPE};font-size:15px;color:${INK}"><span>CASE NO. ${ESC(spec.caseNo)}</span><span>RE: DINNER FOR FOUR</span></div></div>
    ${FX_SP}
    <div style="display:flex;gap:20px;align-items:flex-start"><div style="position:relative;flex:none;background:#fff;padding:8px 8px 30px;box-shadow:0 6px 14px rgba(0,0,0,.3);transform:rotate(-2deg)">${fmtPosterImg(f,poster,232,348,"filter:sepia(.25) contrast(1.05)")}<span style="position:absolute;left:0;right:0;bottom:7px;text-align:center;${TYPE};font-size:14px">EXHIBIT PHOTO, ${ESC(f.year)}</span><span aria-hidden="true" style="position:absolute;left:30px;top:-22px;width:16px;height:52px;border:3px solid #8d9196;border-radius:9px;border-bottom-color:transparent"></span><div aria-hidden="true" style="position:absolute;right:-10px;bottom:50px;transform:rotate(-14deg);border:4px solid rgba(158,27,27,.8);color:rgba(158,27,27,.85);padding:1px 10px;${STEN};font-size:28px;letter-spacing:.1em">EVIDENCE</div></div>
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:22px;padding-top:6px">${timeline}<div style="align-self:flex-start;margin-left:14px;transform:rotate(-4deg);border:2px solid rgba(29,58,168,.75);padding:5px 12px 6px;text-align:center;color:rgba(29,58,168,.8)"><div style="${SHOUL};font-weight:900;font-size:15px;letter-spacing:.18em">RECEIVED</div><div style="${TYPE};font-size:17px;border-top:1px solid rgba(29,58,168,.6);border-bottom:1px solid rgba(29,58,168,.6);margin:3px 0;padding:1px 0">${ESC(spec.received)}</div><div style="${SHOUL};font-weight:700;font-size:11px;letter-spacing:.14em">${ESC(spec.office)}</div></div></div></div>
    ${FX_SP}
    <div style="position:relative;background:#f3e7c0;border:1px solid #c9b47c;padding:10px 14px 12px;box-shadow:0 4px 8px rgba(0,0,0,.18);transform:rotate(.8deg)"><div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid ${INK};padding-bottom:3px;margin-bottom:7px"><span style="${SHOUL};font-weight:900;font-size:20px;letter-spacing:.2em">TELEGRAM</span><span style="${MONO};font-size:12px">SHOWTIME CUE &nbsp;·&nbsp; URGENT</span></div><div style="${MONO};font-weight:700;font-size:14px;line-height:1.7"><span style="background:#fff;padding:2px 6px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${ESC(cue)} STOP</span></div></div>
  </div>`;
  const right=`<div style="position:relative;background:${MANILA};padding:18px 22px 18px 18px;display:flex"><div class="fx-panel" style="position:relative;flex:1;min-height:0;overflow:hidden;background:repeating-linear-gradient(transparent 0 31px,rgba(70,90,130,.12) 31px 32px),${PAPER};padding:20px 28px 16px 40px;box-shadow:0 6px 16px rgba(0,0,0,.3);display:flex;flex-direction:column;transform:rotate(.6deg)">
    <div aria-hidden="true" style="position:absolute;left:24px;top:0;bottom:0;width:2px;background:rgba(200,40,40,.35)"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px double ${INK};padding-bottom:6px"><div><div style="${SHOUL};font-weight:700;font-size:13px;letter-spacing:.16em;color:${NOTE}">FORM P-17 &nbsp;·&nbsp; SEIZED GOODS</div><div style="${TYPE};font-size:30px;line-height:1.05">Evidence Log</div></div><div style="${TYPE};font-size:14px;text-align:right;line-height:1.4">Serves four<br>Street value per item</div></div>
    ${FX_SP}${spec.colA.map(sect).join(FX_SP)}${FX_SP}${spec.colB.map(sect).join(FX_SP)}${FX_SP}
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:3px double ${INK};padding-top:8px;${MONO};font-size:13.5px;color:${NOTE}"><span>Agent on duty: ____________</span><span style="${STEN};font-size:20px;letter-spacing:.1em;color:${INK}">CASE CLOSED</span></div>
  </div></div>`;
  return `${fmtBack(poster)}<div class="fx-sheet" style="grid-template-columns:repeat(2,minmax(0,1fr));color:${INK};border-radius:4px;overflow:hidden">${left}${right}<i class="fx-fold" style="left:50%;width:3px"></i></div>`;
}

/* ---------- old China noodle shop wall, hanging dish tablets (Kung Fu Panda) ---------- */
function fmtNoodle(f,spec,menu,poster){
  const INK="#2a1a10",RED="#a8322a",GOLD="#e8c46a",RICE="#f4ecd8",NOTE="#5c4632";
  const ZH="font-family:'LXGW WenKai TC',serif",SC="font-family:'Marcellus SC',serif",BODY="font-family:'Alegreya',serif";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const items=[...spec.colA,...spec.colB].flatMap(g=>g.items);
  const WOOD="background:repeating-linear-gradient(90deg,rgba(0,0,0,.22) 0 2px,transparent 2px 74px),repeating-linear-gradient(90deg,rgba(255,220,170,.04) 0 9px,rgba(0,0,0,.04) 9px 17px),linear-gradient(#6e4126,#5a3420)";
  const tablet=(x,i)=>`<div style="position:relative;display:flex;flex-direction:column;align-items:center">
    <span aria-hidden="true" style="width:2px;height:18px;background:#2b1a10"></span>
    <div style="width:82px;height:258px;box-sizing:border-box;background:linear-gradient(90deg,#c99a5e,#e3c08b 30%,#e8c895 60%,#c4925a);border:3px solid #7a4a26;border-radius:3px;box-shadow:0 6px 10px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:12px 0 10px">
      <div lang="zh-Hant" style="${ZH};font-weight:700;font-size:28px;line-height:1.08;color:${INK};writing-mode:vertical-rl;letter-spacing:.08em">${x.zh}</div>
      <div lang="zh-Hant" style="${ZH};font-weight:700;background:${RED};color:#fbe9d0;font-size:15px;line-height:1;padding:5px 4px;writing-mode:vertical-rl;border-radius:2px">${x.coinZh}</div>
    </div>
    <span style="${SC};font-size:13px;color:${GOLD};margin-top:5px">${i+1}</span></div>`;
  const line=(x,i)=>{const it=pick(x.k);return `<div><div style="display:flex;align-items:baseline;gap:8px"><span style="${SC};font-size:14px;color:${RED};width:18px;flex:none">${i+1}</span><span style="${BODY};font-weight:700;font-size:17.5px;line-height:1.15;white-space:nowrap">${ESC(it.label||x.n||x.k)}</span><span style="flex:1;border-bottom:2px dotted rgba(42,26,16,.4);transform:translateY(-4px);min-width:8px"></span><span style="${SC};font-size:15px;color:${RED};white-space:nowrap">${ESC(x.p)}</span></div><div style="${BODY};font-style:italic;font-size:14.5px;line-height:1.3;color:${NOTE};padding-left:26px;margin-top:1px">${ESC(x.note)}</div></div>`};
  const half=Math.ceil(items.length/2);
  const scroll=`<div style="position:relative;flex:none;width:286px;display:flex;flex-direction:column;align-items:center">
    <div aria-hidden="true" style="width:120px;height:26px;border-left:2px solid #2b1a10;border-right:2px solid #2b1a10;transform:perspective(60px) rotateX(40deg);transform-origin:bottom;border-top:2px solid #2b1a10;border-radius:4px 4px 0 0"></div>
    <div aria-hidden="true" style="width:270px;height:14px;border-radius:7px;background:linear-gradient(#5a311b,#2e180c);box-shadow:0 3px 5px rgba(0,0,0,.4)"></div>
    <div style="width:244px;flex:1;min-height:0;background:#cdbf98;border-left:10px solid #7c2a1e;border-right:10px solid #7c2a1e;box-sizing:content-box;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px 0 14px;box-shadow:0 8px 16px rgba(0,0,0,.35)">
      ${fmtPosterImg(f,poster,214,321,"box-shadow:0 0 0 3px #f1e6cc")}
      <div style="text-align:center"><div lang="zh-Hant" style="${ZH};font-weight:700;font-size:44px;line-height:1.05;letter-spacing:.1em;color:${INK}">${spec.motto}</div><div style="${BODY};font-style:italic;font-size:16px;line-height:1.3;color:${INK};margin-top:8px;padding:0 14px">${spec.tag}</div></div>
      <div lang="zh-Hant" style="width:40px;height:40px;background:${RED};color:#fbe9d0;display:grid;place-items:center;${ZH};font-weight:700;font-size:15px;line-height:1;border-radius:3px">龍<br>俠</div>
    </div>
    <div aria-hidden="true" style="width:282px;height:18px;border-radius:9px;background:linear-gradient(#5a311b,#2e180c);box-shadow:0 4px 6px rgba(0,0,0,.45)"></div></div>`;
  const sign=`<div style="align-self:center;background:linear-gradient(#1e1410,#120b08);border:4px solid #8a5a2c;outline:2px solid #2b1a10;padding:6px 30px 7px;box-shadow:0 8px 14px rgba(0,0,0,.45);text-align:center"><div lang="zh-Hant" style="${ZH};font-weight:700;font-size:40px;line-height:1;letter-spacing:.3em;margin-right:-.3em;color:${GOLD};text-shadow:0 1px 0 #7a5a20">${spec.signZh}</div><div style="${SC};font-size:15px;letter-spacing:.2em;color:#f1e6cc;margin-top:4px">${ESC(spec.sign)}</div></div>`;
  const rail=`<div style="position:relative;margin-top:4px"><div aria-hidden="true" style="height:12px;border-radius:6px;background:linear-gradient(#3a2112,#1f110a);box-shadow:0 3px 5px rgba(0,0,0,.4)"></div><div style="display:flex;justify-content:space-between;padding:0 6px">${items.map(tablet).join("")}</div></div>`;
  const sheet=`<div style="position:relative;flex:1;min-height:0;background:${RICE};padding:14px 20px 0;box-shadow:0 6px 14px rgba(0,0,0,.35);display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid ${INK};padding-bottom:4px"><span style="${SC};font-size:19px;letter-spacing:.06em;color:${INK}">${ESC(spec.sheetH)}</span><span style="${BODY};font-size:13.5px;color:${NOTE}">${ESC(spec.sheetSide)}</span></div>
    <div style="flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 26px;padding:10px 0 8px"><div class="fx-panel" style="display:flex;flex-direction:column;justify-content:space-between;min-height:0">${items.slice(0,half).map((x,i)=>line(x,i)).join("")}</div><div class="fx-panel" style="display:flex;flex-direction:column;justify-content:space-between;min-height:0">${items.slice(half).map((x,i)=>line(x,i+half)).join("")}${spec.quote?`<div style="padding-left:26px;border-left:3px solid ${RED};margin-left:2px"><div style="${BODY};font-style:italic;font-size:15px;line-height:1.25;color:${INK}">${ESC(spec.quote[0])}</div><div style="${SC};font-size:12.5px;letter-spacing:.08em;color:${RED};margin-top:2px">${ESC(spec.quote[1])}</div></div>`:""}</div></div>
    <div style="margin:0 -20px;background:${RED};color:#fbe9d0;padding:8px 20px 9px;display:flex;gap:12px;align-items:baseline"><span style="${SC};font-size:14px;letter-spacing:.12em;color:${GOLD};white-space:nowrap">Showtime cue</span><span style="${BODY};font-size:16px;line-height:1.3">${ESC(fmtCue(f))}</span></div></div>`;
  return `${fmtBack(poster)}<div class="fx-wall" data-tile="planks|#5a3420|#000|74" style="position:relative;height:100%;box-sizing:border-box;${WOOD};display:flex;gap:24px;padding:16px 22px 20px 18px;box-shadow:0 26px 60px rgba(0,0,0,.7);color:${INK}">${scroll}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px">${sign}${rail}${sheet}</div></div>`;
}

/* ---------- 1950s theme restaurant menu as dreamed up in 1994 (Pulp Fiction, Jack Rabbit Slim's) ---------- */
function fmtSlims(f,spec,menu,poster){
  const CREAM="#fff4dc",INK="#151515",PINK="#ff4f86",TEAL="#1fb5ac",YEL="#ffd23a",NOTE="#4d4a45",RED="#d7262e";
  const NEON="font-family:'Sacramento',cursive;font-weight:400",BLK="font-family:'Archivo Black',sans-serif;font-weight:400",JO="font-family:'Josefin Sans',sans-serif";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const head=(t,c)=>`<div style="align-self:flex-start;background:${c};color:#fff;padding:5px 18px 4px 14px;border-radius:4px 22px 22px 4px;transform:skewX(-10deg);box-shadow:3px 3px 0 ${INK}"><span style="display:inline-block;transform:skewX(10deg);${BLK};font-size:20px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap">${ESC(t)}</span></div>`;
  const bullet=`<span aria-hidden="true" style="flex:none;width:12px;height:12px;background:${PINK};transform:rotate(45deg);margin-right:2px"></span>`;
  const item=x=>{const it=pick(x.k),lab=it.label||x.n||x.k;
    const priceEl=x.burst?"":`<span style="${BLK};font-size:19px;color:${PINK}">${ESC(x.p)}</span>`;
    const inner=`<div style="display:flex;align-items:center;gap:8px">${bullet}<span style="${JO};font-weight:700;font-size:19.5px;line-height:1.1;letter-spacing:.03em;text-transform:uppercase;white-space:${x.burst?"normal":"nowrap"}">${ESC(lab)}</span><span style="flex:1;border-bottom:2px dotted rgba(21,21,21,.35);transform:translateY(5px);min-width:8px"></span>${priceEl}</div><div style="${JO};font-style:italic;font-size:17px;line-height:1.3;color:${NOTE};padding-left:22px;margin-top:4px">${ESC(x.note)}</div>`;
    if(x.burst)return `<div style="position:relative;padding-right:100px;min-height:62px">${inner}<div style="position:absolute;right:-12px;top:-22px">${fmtStar(x.burst[0],x.burst[1],x.burst[2],x.burst[3],96)}</div></div>`;
    if(x.special)return `<div style="position:relative;margin:4px -10px 0;padding:12px 10px 9px;background:#fff;border:2px solid ${INK};box-shadow:4px 4px 0 ${TEAL}">${inner}<span style="position:absolute;right:10px;top:-12px;background:${RED};color:#fff;${BLK};font-size:11px;letter-spacing:.06em;padding:3px 8px;text-transform:uppercase">${ESC(x.special)}</span></div>`;
    return `<div>${inner}</div>`};
  const sect=(g,c)=>`<div style="display:flex;flex-direction:column;gap:14px">${head(g.h,c)}${g.items.map(item).join("")}</div>`;
  const SP=FX_SP;
  const hosts=`<div style="border:2px solid ${INK};background:#fff;padding:9px 12px 10px"><div style="${BLK};font-size:16px;letter-spacing:.06em;color:${TEAL};text-transform:uppercase;margin-bottom:6px">${ESC(spec.hosts.h)}</div>${spec.hosts.rows.map(([a,b])=>`<div style="display:flex;justify-content:space-between;gap:10px;${JO};font-size:16px;line-height:1.6;border-top:1px dashed rgba(21,21,21,.25)"><span style="font-weight:700;text-transform:uppercase;letter-spacing:.04em">${ESC(a)}</span><span style="color:${NOTE};text-align:right">${ESC(b)}</span></div>`).join("")}</div>`;
  const ticket=`<div style="position:relative;background:${YEL};padding:10px 16px 11px;transform:rotate(-1.5deg);box-shadow:3px 3px 0 ${INK};border:2px solid ${INK}"><div style="${BLK};font-size:12px;letter-spacing:.12em;color:${RED};text-transform:uppercase">Showtime cue</div><div style="${JO};font-weight:600;font-size:19px;line-height:1.25;margin-top:3px">${ESC(fmtCue(f))}</div><span aria-hidden="true" style="position:absolute;left:-9px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:${CREAM};border-right:2px solid ${INK}"></span><span aria-hidden="true" style="position:absolute;right:-9px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:${CREAM};border-left:2px solid ${INK}"></span></div>`;
  const cols=[TEAL,PINK,TEAL];
  const colA=`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column">${spec.colA.map((g,i)=>sect(g,cols[i%3])).join(`<div style="flex:none;height:22px"></div>`)}${SP}${spec.trophy?`<div style="border:2px solid ${INK};background:${INK};color:#fff;padding:8px 14px;display:flex;align-items:center;gap:14px;box-shadow:4px 4px 0 ${PINK}"><span style="${NEON};font-size:38px;line-height:.9;color:#ffe3ee;text-shadow:0 0 6px ${PINK};white-space:nowrap">${ESC(spec.trophy[0])}</span><span style="${JO};font-weight:600;font-size:13.5px;line-height:1.3;letter-spacing:.04em;text-transform:uppercase">${ESC(spec.trophy[1])}</span></div>`:""}</div>`;
  const colB=`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column">${spec.colB.map((g,i)=>sect(g,cols[(i+1)%3])).join(`<div style="flex:none;height:22px"></div>`)}${SP}${hosts}<div style="flex:none;height:26px"></div>${ticket}</div>`;
  const posterCol=`<div style="flex:none;width:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
    <div style="background:linear-gradient(135deg,#f4f6f8,#a9afb8 40%,#eef1f4 55%,#9aa1aa);padding:9px;border-radius:14px;box-shadow:0 8px 16px rgba(0,0,0,.35),inset 0 0 0 2px #7d838c">${fmtPosterImg(f,poster,270,405,"border-radius:6px")}</div>
    <div style="${BLK};font-size:13px;letter-spacing:.12em;color:${INK};text-transform:uppercase;text-align:center;line-height:1.4">${spec.under}</div></div>`;
  return `${fmtBack(poster)}<div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;background:${CREAM};border-radius:26px;border:10px solid ${TEAL};box-shadow:0 26px 60px rgba(0,0,0,.7),inset 0 0 0 3px ${PINK};overflow:hidden;display:flex;flex-direction:column;color:${INK}">
    <div style="flex:none;background:${INK};display:flex;align-items:center;justify-content:space-between;padding:8px 28px 10px 26px">
      <div style="${NEON};font-size:64px;line-height:1;color:#ffe3ee;text-shadow:0 0 4px ${PINK},0 0 12px ${PINK},0 0 22px ${PINK}">${ESC(spec.place)}</div>
      <div style="text-align:right"><h2 style="margin:0;${BLK};font-size:44px;line-height:1;color:${YEL};-webkit-text-stroke:2px ${RED};paint-order:stroke fill;text-shadow:3px 3px 0 ${RED};letter-spacing:.01em">${ESC(f.title.toUpperCase())}</h2><div style="${JO};font-weight:600;font-size:14px;letter-spacing:.1em;color:#e9e3d4;text-transform:uppercase;margin-top:5px">${spec.sub}</div></div></div>
    <div aria-hidden="true" data-tile="checker|${INK}|#fff|20" style="flex:none;height:20px;background:repeating-linear-gradient(90deg,${INK} 0 10px,#fff 10px 20px)"></div>
    <div style="flex:1;min-height:0;display:flex;gap:26px;padding:18px 26px 16px 22px">${posterCol}<div style="flex:1;min-width:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:26px">${colA}${colB}</div></div>
    <div aria-hidden="true" data-tile="checker|${INK}|#fff|20" style="flex:none;height:20px;background:repeating-linear-gradient(90deg,${INK} 0 10px,#fff 10px 20px)"></div></div>`;
}

/* ---------- league night score sheet at Hollywood Star Lanes (The Big Lebowski) ---------- */
function fmtLanes(f,spec,menu,poster){
  const NAVY="#1c2240",ORANGE="#e8692c",GREEN="#2f7a52",SHEET="#f4f7ee",INK="#1d2a22",NOTE="#4f5c52",PENCIL="#4a4f57";
  const GOOG="font-family:'Righteous',sans-serif;font-weight:400",COND="font-family:'Barlow Condensed',sans-serif",BODY="font-family:'Barlow',sans-serif",PEN="font-family:'Reenie Beanie',cursive;font-weight:400";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const frames=`<div aria-hidden="true" style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(10,1fr)">${Array.from({length:10},()=>`<span style="border-left:1px solid rgba(47,122,82,.28);position:relative"><i style="position:absolute;right:0;top:0;width:34%;height:42%;border-left:1px solid rgba(47,122,82,.28);border-bottom:1px solid rgba(47,122,82,.28)"></i></span>`).join("")}</div>`;
  const GRID="grid-template-columns:210px minmax(0,1fr) 92px";
  const band=t=>`<div style="display:grid;${GRID};background:${GREEN};color:#fff;${COND};font-weight:700;font-size:14px;letter-spacing:.14em;text-transform:uppercase"><span style="padding:2px 10px">${ESC(t)}</span><span></span><span></span></div>`;
  const row=x=>{const it=pick(x.k);return `<div style="display:grid;${GRID};min-height:48px;border-bottom:1px solid rgba(47,122,82,.45)">
    <div style="padding:4px 10px;border-right:2px solid rgba(47,122,82,.55);display:flex;flex-direction:column;justify-content:center"><span style="${COND};font-weight:700;font-size:19px;line-height:1.05;text-transform:uppercase;letter-spacing:.02em">${ESC(it.label||x.n||x.k)}</span></div>
    <div style="position:relative;display:flex;align-items:center;padding:4px ${x.mark?134:12}px 4px 12px">${frames}<span style="position:relative;${BODY};font-style:italic;font-weight:500;font-size:15.5px;line-height:1.25;color:${NOTE};background:linear-gradient(transparent 0 0);">${ESC(x.note)}</span>${x.mark?`<span style="position:absolute;right:8px;top:50%;margin-top:-16px;display:flex;align-items:center;gap:8px;${PEN};color:${PENCIL};transform:rotate(-6deg)"><span style="font-size:22px">Mark it</span><span style="position:relative;font-size:30px;line-height:1;padding:0 6px">0<span style="position:absolute;inset:-3px -3px;border:2px solid ${PENCIL};border-radius:50%"></span></span></span>`:""}</div>
    <div style="border-left:2px solid rgba(47,122,82,.55);display:grid;place-items:center"><span style="${PEN};font-size:34px;line-height:1;color:${PENCIL}">${ESC(x.p)}</span></div></div>`};
  const sheetRows=spec.groups.map(g=>band(g.h)+g.items.map(row).join("")).join("");
  const sheet=`<div class="fx-panel" style="position:relative;flex:1;min-width:0;min-height:0;background:${SHEET};box-shadow:0 10px 22px rgba(0,0,0,.45);transform:rotate(-.6deg);display:flex;flex-direction:column;padding:16px 18px 14px;color:${INK}">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${GREEN};padding-bottom:6px"><div><div style="${GOOG};font-size:30px;line-height:1;color:${GREEN}">${ESC(spec.place)}</div><div style="${COND};font-weight:500;font-size:14px;letter-spacing:.1em;color:${NOTE};text-transform:uppercase;margin-top:3px">${ESC(spec.address)}</div></div><div style="text-align:right;${COND};font-weight:700;font-size:16px;letter-spacing:.12em;color:${GREEN};text-transform:uppercase;line-height:1.3">League night<br>Score sheet</div></div>
    <div style="display:flex;gap:22px;${COND};font-weight:500;font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:${NOTE};padding:7px 2px 8px"><span>Team: <b style="${PEN};font-size:24px;letter-spacing:0;text-transform:none;color:${PENCIL}">${ESC(spec.team)}</b></span><span>Serves: <b style="${PEN};font-size:24px;letter-spacing:0;color:${PENCIL}">4</b></span><span>Night: <b style="${PEN};font-size:24px;letter-spacing:0;text-transform:none;color:${PENCIL}">${ESC(spec.night)}</b></span></div>
    <div style="display:grid;${GRID};${COND};font-weight:700;font-size:12px;letter-spacing:.12em;color:${GREEN};text-transform:uppercase;border-top:2px solid ${GREEN};border-bottom:2px solid ${GREEN}"><span style="padding:3px 10px">Bowler</span><span style="display:grid;grid-template-columns:repeat(10,1fr);text-align:center">${Array.from({length:10},(_,i)=>`<span style="padding:3px 0;border-left:1px solid rgba(47,122,82,.3)">${i+1}</span>`).join("")}</span><span style="padding:3px 0;text-align:center;border-left:2px solid rgba(47,122,82,.55)">Total</span></div>
    <div style="display:flex;flex-direction:column">${sheetRows}</div>
    ${FX_SP}
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:18px"><div style="${PEN};font-size:26px;line-height:1.05;color:${PENCIL};transform:rotate(-1.5deg);max-width:470px">Showtime: ${ESC(fmtCue(f))}</div><div style="flex:none;border:2px solid ${GREEN};padding:6px 10px;${COND};font-size:14px;line-height:1.35;color:${INK};text-transform:uppercase;letter-spacing:.06em"><b style="color:${GREEN}">House rules</b><br>${spec.rules}</div></div></div>`;
  const sign=`<div style="position:relative;width:250px;height:178px;display:grid;place-items:center">
    <div style="position:absolute;left:50%;top:50%;margin:-89px 0 0 -89px">${fmtStar("","",ORANGE,8,178)}</div>
    <div style="position:relative;text-align:center;transform:rotate(-6deg)"><div style="${GOOG};font-size:19px;color:#fff;letter-spacing:.06em;text-shadow:2px 2px 0 ${NAVY}">HOLLYWOOD</div><div style="${GOOG};font-size:34px;line-height:.95;color:#fff7e0;text-shadow:3px 3px 0 ${NAVY}">Star Lanes</div><div style="${COND};font-weight:700;font-size:13px;letter-spacing:.18em;color:${NAVY};margin-top:2px">BOWL &nbsp;·&nbsp; LOUNGE</div></div></div>`;
  const right=`<div style="flex:none;width:268px;display:flex;flex-direction:column;align-items:center;gap:12px">${sign}
    <div style="background:#0d0f1c;padding:8px;box-shadow:0 8px 18px rgba(0,0,0,.5);border:2px solid ${ORANGE}">${fmtPosterImg(f,poster,226,339)}</div>
    <div style="${GOOG};font-size:22px;color:#fff7e0;text-align:center;line-height:1.15">${spec.tag}</div></div>`;
  return `${fmtBack(poster)}<div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;background:radial-gradient(circle at 20% 15%,rgba(232,105,44,.18),transparent 40%),radial-gradient(circle at 85% 80%,rgba(31,181,172,.15),transparent 45%),${NAVY};box-shadow:0 26px 60px rgba(0,0,0,.7);display:flex;flex-direction:column;color:${INK}">
    <div style="flex:1;min-height:0;display:flex;gap:26px;padding:20px 24px 14px 22px">${sheet}${right}</div>
    <div aria-hidden="true" data-tile="rug|#9b2a22|#20305a|28" style="flex:none;height:28px;background:repeating-linear-gradient(45deg,#9b2a22 0 10px,#20305a 10px 20px);border-top:4px solid #e8d7b0;border-bottom:4px solid #e8d7b0"></div>
    <div style="flex:none;background:#e8d7b0;${COND};font-weight:700;font-size:13px;letter-spacing:.2em;text-transform:uppercase;text-align:center;color:#6b2a1f;padding:3px 0 4px">${ESC(spec.rugLine)}</div></div>`;
}

/* ---------- firehouse carbon-copy work order on the brick wall (Ghostbusters) ---------- */
function fmtWorkOrder(f,spec,menu,poster){
  const RED="#c2272d",INK="#1e1e22",BLUE="#1f3c9e",YEL="#fff3b0",NOTE="#4c4a45";
  const HEAD="font-family:'Oswald',sans-serif",FORM="font-family:'Archivo Narrow',sans-serif",PEN="font-family:'Caveat',cursive";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const GRID="grid-template-columns:44px 230px minmax(0,1fr) 74px";
  const cell="border-right:1px solid rgba(30,30,34,.35);padding:4px 8px;display:flex;align-items:center";
  const row=x=>{const it=pick(x.k);return `<div style="display:grid;${GRID};min-height:49px;border-bottom:1px solid rgba(30,30,34,.35)"><span style="${cell};justify-content:center;${PEN};font-weight:700;font-size:24px;color:${BLUE}">${ESC(x.q||"4")}</span><span style="${cell};${FORM};font-weight:700;font-size:17px;line-height:1.1;text-transform:uppercase">${ESC(it.label||x.n||x.k)}</span><span style="${cell};${PEN};font-weight:500;font-size:20px;line-height:1.05;color:${BLUE}">${ESC(x.note)}</span><span style="padding:4px 8px;display:flex;align-items:center;justify-content:flex-end;${PEN};font-weight:700;font-size:23px;color:${BLUE}">${ESC(x.p)}</span></div>`};
  const field=(l,v)=>`<div style="display:flex;align-items:baseline;gap:8px;border-bottom:1px solid rgba(30,30,34,.45);padding-bottom:2px"><span style="${FORM};font-weight:700;font-size:12px;letter-spacing:.12em;color:${RED};text-transform:uppercase;flex:none">${l}</span><span style="${PEN};font-weight:500;font-size:22px;line-height:1;color:${BLUE}">${ESC(v)}</span></div>`;
  const tabs=Array.from({length:6},()=>`<span style="flex:1;border-left:1px dashed rgba(30,30,34,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15"><span style="${FORM};font-weight:700;font-size:11px;letter-spacing:.1em;color:${RED}">CALL</span><span style="${FORM};font-weight:700;font-size:15px;letter-spacing:.04em">${ESC(spec.phone)}</span></span>`).join("");
  const order=`<div style="position:relative;flex:1;min-width:0;min-height:0">
    <div aria-hidden="true" style="position:absolute;inset:10px -8px -8px 10px;background:#f7c6d4;box-shadow:0 6px 14px rgba(0,0,0,.35);transform:rotate(1.4deg)"></div>
    <div aria-hidden="true" style="position:absolute;inset:5px -4px -4px 5px;background:#fff;transform:rotate(.7deg)"></div>
    <div class="fx-panel" style="position:relative;height:100%;box-sizing:border-box;background:${YEL};padding:16px 20px 0;display:flex;flex-direction:column;color:${INK};box-shadow:0 2px 6px rgba(0,0,0,.2)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid ${RED};padding-bottom:6px">
        <div><div style="${HEAD};font-weight:700;font-size:42px;line-height:.95;letter-spacing:.04em;color:${RED};text-transform:uppercase">${ESC(f.title)}</div><div style="${FORM};font-weight:700;font-size:14px;letter-spacing:.1em;text-transform:uppercase;margin-top:3px">${ESC(spec.trade)}</div></div>
        <div style="text-align:right;${FORM};font-weight:700;font-size:13px;letter-spacing:.1em;line-height:1.5;text-transform:uppercase"><div style="font-size:18px;color:${RED}">Work order</div><div>No. <span style="${PEN};font-size:22px;letter-spacing:0;color:${BLUE}">${ESC(f.year)}</span></div><div>${ESC(spec.address)}</div></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;padding:10px 0 10px">${spec.fields.map(([l,v])=>field(l,v)).join("")}</div>
      <div style="display:grid;${GRID};background:${RED};color:#fff;${FORM};font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase"><span style="padding:4px 8px;text-align:center">Qty</span><span style="padding:4px 8px">Item</span><span style="padding:4px 8px">Field notes</span><span style="padding:4px 8px;text-align:right">Fee</span></div>
      <div style="border-left:1px solid rgba(30,30,34,.35);border-right:1px solid rgba(30,30,34,.35)">${spec.groups.flatMap(g=>g.items).map(row).join("")}</div>
      ${FX_SP}
      <div style="display:flex;gap:16px;align-items:stretch">
        <div style="flex:1;min-width:0;border:2px solid ${RED};padding:7px 10px;background:rgba(255,255,255,.4)"><div style="${FORM};font-weight:700;font-size:12px;letter-spacing:.14em;color:${RED};text-transform:uppercase">Dispatch, showtime cue</div><div style="${PEN};font-weight:500;font-size:22px;line-height:1.05;color:${BLUE};margin-top:2px">${ESC(fmtCue(f))}</div></div>
        <div style="flex:none;width:210px;display:flex;flex-direction:column;justify-content:space-between"><div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid ${INK}"><span style="${FORM};font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase">Total</span><span style="${PEN};font-weight:700;font-size:28px;color:${BLUE}">${ESC(spec.total)}</span></div><div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid ${INK}"><span style="${FORM};font-weight:700;font-size:11px;letter-spacing:.12em;text-transform:uppercase">Signed</span><span style="${PEN};font-weight:700;font-size:24px;color:${BLUE};transform:rotate(-3deg)">${ESC(spec.signed)}</span></div></div></div>
      <div style="${HEAD};font-weight:500;font-size:16px;letter-spacing:.08em;text-transform:uppercase;text-align:center;color:${RED};margin-top:10px">${ESC(spec.slogan)}</div>
      <div style="display:flex;margin:6px -20px 0;border-top:1px dashed rgba(30,30,34,.5);height:52px">${tabs}</div>
    </div></div>`;
  const left=`<div style="flex:none;width:286px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
    <div style="position:relative;background:#fff;padding:8px;box-shadow:0 8px 16px rgba(0,0,0,.45);transform:rotate(-2deg)">${fmtPosterImg(f,poster,248,372)}<span aria-hidden="true" style="position:absolute;left:50%;top:-10px;width:70px;height:20px;margin-left:-35px;background:rgba(255,250,235,.75);transform:rotate(-3deg)"></span></div>
    <div style="background:linear-gradient(135deg,#d9b25a,#f3dc96 45%,#b98d35);border:2px solid #7a5a1e;padding:7px 14px;text-align:center;box-shadow:0 4px 8px rgba(0,0,0,.4)"><div style="${HEAD};font-weight:700;font-size:16px;letter-spacing:.1em;color:#3a2a0c;text-transform:uppercase">${ESC(spec.plaque[0])}</div><div style="${FORM};font-weight:700;font-size:12.5px;letter-spacing:.1em;color:#3a2a0c;text-transform:uppercase">${ESC(spec.plaque[1])}</div></div>
    <div style="${HEAD};font-weight:500;font-size:18px;letter-spacing:.04em;color:#fff4e4;text-align:center;text-shadow:0 2px 4px rgba(0,0,0,.6)">${spec.tag}</div></div>`;
  return `${fmtBack(poster)}<div class="fx-wall" data-tile="brick|#8e3a2c|#c9b8a4|48" style="position:relative;height:100%;box-sizing:border-box;background:repeating-linear-gradient(0deg,#c9b8a4 0 3px,#8e3a2c 3px 24px);box-shadow:0 26px 60px rgba(0,0,0,.7);display:flex;gap:28px;padding:20px 30px 22px 22px">${left}${order}</div>`;
}



/* ---------- Little Nero's pizza box lid with the delivery ticket stapled on (Home Alone) ---------- */
function fmtNero(f,spec,menu,poster){
  const RED="#b81a22",GRN="#145a2e",KRAFT="#c99a5f",INK="#1e140c",PAPER="#fffdf6",BLUE="#1f3c9e",NOTE="#4b3a2c",WHITE="#fbf8f1";
  const DISP="font-family:'Shrikhand',cursive;font-weight:400",SLAB="font-family:'Bevan',serif;font-weight:400",BODY="font-family:'Libre Franklin',sans-serif",MARK="font-family:'Permanent Marker',cursive;font-weight:400",TYPE="font-family:'Courier Prime',monospace";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  /* laurel sprigs drawn from rotated leaves, so saved images keep them */
  const laurel=sx=>`<div aria-hidden="true" style="position:relative;flex:none;width:150px;height:56px;transform:scaleX(${sx})">${Array.from({length:6},(_,i)=>{const x=8+i*15,y=34-Math.sin((i/6)*1.4+.2)*22;return `<i style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:20px;height:9px;border-radius:50%;background:${GRN};transform:rotate(${-30+i*12}deg)"></i>`}).join("")}<i style="position:absolute;left:14px;right:40px;top:43px;height:2.5px;border-radius:2px;background:${GRN};transform:rotate(-6deg)"></i></div>`;
  const line=x=>{const it=pick(x.k),lab=it.label||x.n||x.k;return `<div><div style="display:flex;align-items:baseline;gap:8px"><span style="${SLAB};font-size:21px;line-height:1.1;color:${RED};white-space:nowrap">${ESC(lab)}</span><span style="flex:1;border-bottom:2px dotted rgba(42,26,16,.5);min-width:10px;transform:translateY(-5px)"></span><span style="${SLAB};font-size:21px;color:${GRN};white-space:nowrap">${ESC(x.p)}</span></div><div style="${BODY};font-weight:400;font-size:15.5px;line-height:1.3;color:${INK};margin-top:3px">${ESC(x.d||"")}</div><div style="${BODY};font-style:italic;font-size:15px;line-height:1.3;color:${NOTE};margin-top:1px">${ESC(x.note)}</div></div>`};
  const head=t=>`<div style="display:flex;align-items:center;gap:10px"><span style="${SLAB};font-size:16px;letter-spacing:.16em;color:${GRN};text-transform:uppercase;white-space:nowrap">${ESC(t)}</span><span style="flex:1;height:3px;background:${GRN}"></span></div>`;
  const grp=g=>`<div style="display:flex;flex-direction:column;gap:13px">${head(g.h)}${g.items.map(line).join("")}</div>`;
  const stamp=`<div style="border:3px solid ${GRN};padding:9px 14px;text-align:center;transform:rotate(-1.5deg)"><div style="${SLAB};font-size:16px;letter-spacing:.1em;color:${GRN};text-transform:uppercase">${ESC(spec.stamp[0])}</div><div style="${BODY};font-size:15px;line-height:1.35;color:${INK};margin-top:3px">${spec.stamp[1]}</div></div>`;
  const cue=`<div style="border:2px solid ${RED};padding:8px 12px 9px;background:#fff"><div style="${SLAB};font-size:13px;letter-spacing:.16em;color:${RED};text-transform:uppercase">Showtime cue</div><div style="${BODY};font-weight:700;font-size:16.5px;line-height:1.3;color:${INK};margin-top:2px">${ESC(fmtCue(f))}</div></div>`;
  const sizes=spec.sizes?`<div style="display:grid;grid-template-columns:repeat(${spec.sizes.length},1fr);border:2px solid ${RED};text-align:center">${spec.sizes.map(([a,b],i)=>`<div style="padding:6px 4px 7px;${i?`border-left:2px solid ${RED}`:""}"><div style="${SLAB};font-size:13px;letter-spacing:.12em;color:${RED};text-transform:uppercase">${ESC(a)}</div><div style="${SLAB};font-size:21px;color:${GRN};margin-top:2px">${ESC(b)}</div></div>`).join("")}<div style="grid-column:1/-1;border-top:2px solid ${RED};${BODY};font-weight:700;font-size:14px;line-height:1.3;color:${INK};padding:5px 6px 6px">${ESC(spec.sizesNote)}</div></div>`:"";
  const colA=`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column;justify-content:space-between;gap:16px">${grp(spec.colA[0])}${sizes}${spec.colA.slice(1).map(grp).join("")}</div>`;
  const colB=`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column;justify-content:space-between;gap:16px">${spec.colB.map(grp).join("")}${spec.still?fmtStill(spec.still[0],spec.still[1],150,"#fff",NOTE,BODY,"transform:rotate(1deg);box-shadow:none"):stamp}${cue}</div>`;
  const lid=`<div style="position:relative;flex:1;min-width:0;display:flex;flex-direction:column">
    <div style="text-align:center">
      <div style="${BODY};font-weight:800;font-size:13px;letter-spacing:.34em;margin-right:-.34em;color:${GRN};text-transform:uppercase">${ESC(spec.over)}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:2px">${laurel(1)}<div style="${DISP};font-size:66px;line-height:1.08;color:${RED};white-space:nowrap;transform:rotate(-2deg)">${ESC(spec.brand)}</div>${laurel(-1)}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:2px"><span style="flex:1;height:2px;background:${RED}"></span><span style="${SLAB};font-size:26px;letter-spacing:.34em;margin-right:-.34em;color:${RED}">PIZZA</span><span style="flex:1;height:2px;background:${RED}"></span></div>
      <div style="${DISP};font-size:23px;line-height:1.2;color:${GRN};margin-top:3px">${ESC(spec.slogan)}</div></div>
    <div style="flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 34px;padding:16px 2px 14px">${colA}${colB}</div>
    <div style="display:flex;justify-content:center;align-items:center;gap:18px;border-top:2px solid ${RED};padding-top:7px;${BODY};font-weight:800;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:${RED};white-space:nowrap">${spec.foot.map(t=>`<span>${t}</span>`).join(`<span style="color:${GRN}">✦</span>`)}</div></div>`;
  const tline=(a,b)=>`<div style="display:flex;justify-content:space-between;gap:8px;border-bottom:1px dashed rgba(0,0,0,.25);padding:3px 0"><span style="${TYPE};font-size:12px;text-transform:uppercase;color:#555">${a}</span><span style="${TYPE};font-weight:700;font-size:13px;text-align:right;white-space:nowrap">${b}</span></div>`;
  const zig="polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)";
  const ticket=`<div style="position:relative;width:236px;transform:rotate(2deg)">
    <span aria-hidden="true" style="position:absolute;left:30px;top:-5px;width:24px;height:7px;border:2px solid #8f959b;border-bottom:none;z-index:2"></span><span aria-hidden="true" style="position:absolute;right:30px;top:-5px;width:24px;height:7px;border:2px solid #8f959b;border-bottom:none;z-index:2"></span>
    <div style="background:${PAPER};padding:11px 14px 16px;box-shadow:0 6px 14px rgba(0,0,0,.3);color:${INK};clip-path:${zig};background-image:linear-gradient(#fdfaf0,#efe8d4);outline:1px solid #cfc5ae;outline-offset:-1px">
      <div style="text-align:center;border-bottom:2px solid ${INK};padding-bottom:5px"><div style="${DISP};font-size:22px;line-height:1.1;color:${RED}">${ESC(spec.brand)}</div><div style="${TYPE};font-weight:700;font-size:11.5px;letter-spacing:.16em;margin-top:2px">DELIVERY ORDER</div></div>
      <div style="padding:5px 0 3px">${spec.ticket.map(([a,b])=>tline(a,ESC(b))).join("")}</div>
      <div style="display:flex;gap:6px;align-items:baseline;${TYPE};font-weight:700;font-size:13px;margin-top:3px"><span style="white-space:nowrap">1 LG CHEESE</span><span style="flex:1;border-bottom:2px dotted #555;transform:translateY(-3px)"></span><span>${ESC(spec.total)}</span></div>
      <div style="${MARK};font-size:19px;line-height:1.1;color:${BLUE};margin-top:9px;transform:rotate(-2deg)">${ESC(spec.scrawl)}</div>
      <div style="${TYPE};font-size:11.5px;text-align:center;margin-top:9px;color:#555">${ESC(spec.thanks)}</div></div></div>`;
  const left=`<div style="flex:none;width:252px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:14px;padding:4px 0">
    <div style="position:relative;background:#fff;padding:7px 7px 30px;box-shadow:0 6px 14px rgba(0,0,0,.3);border:1px solid #e3ddd0;transform:rotate(-2.5deg)">${fmtPosterImg(f,poster,204,306)}<div style="position:absolute;left:0;right:0;bottom:5px;text-align:center;${MARK};font-size:17px;color:${INK}">${ESC(spec.caption)}</div><span aria-hidden="true" style="position:absolute;left:50%;top:-11px;width:76px;height:22px;margin-left:-38px;background:rgba(255,248,225,.75);transform:rotate(4deg);box-shadow:0 0 0 .5px rgba(120,90,40,.25)"></span></div>
    ${ticket}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" data-tile="kraft|${KRAFT}|#b9894f|30" style="position:relative;height:100%;box-sizing:border-box;background:repeating-linear-gradient(90deg,${KRAFT} 0 13px,#b9894f 13px 15px,${KRAFT} 15px 30px);box-shadow:0 26px 60px rgba(0,0,0,.7);border-radius:4px;padding:12px;color:${INK}">
    <div style="position:relative;height:100%;box-sizing:border-box;background:${WHITE};box-shadow:0 0 0 1px rgba(90,60,25,.35),inset 0 0 0 2px rgba(255,255,255,.6);display:flex;gap:28px;padding:14px 20px 10px 14px">
      <i aria-hidden="true" style="position:absolute;inset:7px;border:2px solid ${RED};pointer-events:none"></i>
      ${left}${lid}</div></div>`;
}

/* ---------- Lou's Cafe, Hill Valley, 1955: letter board over the counter (Back to the Future) ---------- */
function fmtLous(f,spec,menu,poster){
  const TEAL="#3fa79c",CREAM="#f3ead2",RED="#c4262e",INK="#1c1c1c",CHROME="linear-gradient(180deg,#f4f6f8,#9aa2ab 45%,#e9edf0 55%,#8a929b)";
  const NEON="font-family:'Damion',cursive;font-weight:400",BOARD="font-family:'Oswald',sans-serif",MONO="font-family:'Cutive Mono',monospace",PEN="font-family:'Covered By Your Grace',cursive;font-weight:400",BODY="font-family:'Archivo',sans-serif";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  /* plastic letters never sit quite straight on the felt */
  const jig=(s,seed)=>s.split(" ").map((w,i)=>`<span style="display:inline-block;transform:translateY(${((hashN(seed+i)%3)-1)*.8}px) rotate(${((hashN(seed+"r"+i)%5)-2)*.35}deg)">${ESC(w)}</span>`).join(" ");
  const row=x=>{const it=pick(x.k),lab=(it.label||x.n||x.k).toUpperCase();return `<div><div style="display:flex;align-items:baseline;gap:10px"><span style="${BOARD};font-weight:500;font-size:31px;line-height:1.1;letter-spacing:.05em;color:#f6f4ec;white-space:nowrap">${jig(lab,lab)}</span><span style="flex:1;border-bottom:2px dotted rgba(246,244,236,.3);min-width:12px;transform:translateY(-6px)"></span><span style="${BOARD};font-weight:500;font-size:31px;letter-spacing:.04em;color:#ffd75e;white-space:nowrap">${ESC(x.p)}</span></div><div style="${BOARD};font-weight:400;font-size:18px;line-height:1.3;letter-spacing:.07em;color:#d3d0c5;text-transform:uppercase;margin:3px 0 0 2px">${ESC(x.note)}</div></div>`};
  const grp=g=>`<div class="fx-panel" style="display:flex;flex-direction:column;gap:13px;min-height:0"><div style="${BOARD};font-weight:700;font-size:16px;letter-spacing:.3em;white-space:nowrap;color:#6fd3c6;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.28);padding-bottom:4px">${ESC(g.h)}</div>${g.items.map(row).join("")}</div>`;
  const boardLine=(t,c)=>`<div style="grid-column:1/-1;text-align:center;${BOARD};font-weight:500;font-size:19px;letter-spacing:.24em;color:${c};white-space:nowrap">${jig(t,t)}</div>`;
  /* groups pair up across the board so the rows line up */
  const cells=[];spec.colA.forEach((g,i)=>{cells.push(grp(g));cells.push(spec.colB[i]?grp(spec.colB[i]):"<div></div>")});
  const board=`<div style="position:relative;flex:1;min-height:0;padding:9px;background:${CHROME};border-radius:5px;box-shadow:0 10px 20px rgba(0,0,0,.4)">
    <div data-tile="felt|#1b1b1d|#262629|10" style="height:100%;box-sizing:border-box;background:repeating-linear-gradient(0deg,#1b1b1d 0 7px,#262629 7px 10px);padding:14px 30px 14px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto auto auto auto;align-content:space-evenly;gap:0 48px;box-shadow:inset 0 0 18px rgba(0,0,0,.8)">${boardLine(spec.boardTop,"#ffd75e")}${cells.join("")}${boardLine(spec.boardFoot,"#f6f4ec")}</div></div>`;
  const sign=`<div style="display:flex;align-items:center;justify-content:space-between;gap:18px"><div style="${NEON};font-size:76px;line-height:1.05;white-space:nowrap;color:#ffe6e2;text-shadow:0 0 3px ${RED},0 0 10px ${RED},0 0 22px ${RED},0 0 34px rgba(196,38,46,.6);transform:rotate(-2deg);padding-left:6px">${ESC(spec.place)}</div>${spec.still?`<div style="flex:none;width:200px;background:#fff;padding:6px 6px 24px;box-shadow:0 4px 10px rgba(0,0,0,.3);transform:rotate(2deg);position:relative"><img crossorigin="anonymous" src="${TMDB_IMG}w500${ESC(spec.still[0])}" alt="${ESC(spec.still[1])}, still from the film" style="display:block;width:100%;height:104px;object-fit:cover"><span style="position:absolute;left:0;right:0;bottom:5px;text-align:center;${PEN};font-size:16px;line-height:1;white-space:nowrap;color:${INK}">${ESC(spec.still[1])}</span></div>`:`<div style="${PEN};font-size:27px;line-height:1.05;color:${INK};transform:rotate(-2deg);text-align:center">${spec.tag}</div>`}<div style="flex:none;text-align:right;white-space:nowrap;${BOARD};font-weight:500;font-size:15px;letter-spacing:.16em;line-height:1.5;text-transform:uppercase;color:${INK}">${spec.sub}</div></div>`;
  const strip=`<div style="display:flex;align-items:center;gap:14px;background:${RED};color:#fff;padding:8px 16px;border-radius:3px;box-shadow:0 3px 0 #8e1a20"><span style="${BOARD};font-weight:700;font-size:15px;letter-spacing:.2em;text-transform:uppercase;white-space:nowrap">${ESC(spec.strip[0])}</span><span style="${BODY};font-size:16px;line-height:1.25">${ESC(spec.strip[1])}</span></div>`;
  /* the flyer's photo: the courthouse from the film, run through a photocopier when the menu loads */
  const tower=spec.flyerStill?`<img class="fx-photocopy" crossorigin="anonymous" data-src="${TMDB_IMG}w780${ESC(spec.flyerStill)}" alt="Hill Valley courthouse and clock tower, still from the film" style="display:block;width:100%;height:132px;object-fit:cover;object-position:${spec.flyerCrop||"center"};margin:7px 0 6px;border:1.5px solid ${INK};box-sizing:border-box;background:#ddd">`:`<img src="assets/menu-art/clock-tower.png" alt="" aria-hidden="true" style="display:block;width:100%;height:auto;margin:7px 0 6px;border:1.5px solid ${INK};box-sizing:border-box">`;
  const flyer=`<div style="position:relative;width:100%;box-sizing:border-box;background:#fbfaf4;padding:12px 12px 10px;box-shadow:0 8px 16px rgba(0,0,0,.35);transform:rotate(2deg);color:${INK}">
    <span aria-hidden="true" style="position:absolute;left:50%;top:-7px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff8a8a,#b3151c);box-shadow:0 2px 3px rgba(0,0,0,.4)"></span>
    <div style="${BOARD};font-weight:700;font-size:22px;line-height:1;letter-spacing:.02em;text-transform:uppercase;text-align:center">${spec.flyer[0]}</div>${tower}
    <div style="${MONO};font-size:13px;line-height:1.35;text-align:center">${spec.flyer[1]}</div>
    <div style="${MONO};font-size:11px;letter-spacing:.04em;text-align:center;margin-top:5px;color:#555;text-transform:uppercase">${ESC(spec.flyer[2])}</div></div>`;
  const check=`<div style="position:relative;width:100%;box-sizing:border-box;background:#e7f1df;border:1px solid #9cb894;padding:8px 11px 10px;box-shadow:0 6px 12px rgba(0,0,0,.3);transform:rotate(-1.5deg);color:#1f4a2a">
    <div style="display:flex;justify-content:space-between;gap:6px;${BODY};font-weight:700;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid #9cb894;padding-bottom:3px;white-space:nowrap"><span>Guest check</span><span>${ESC(spec.check)}</span></div>
    <div style="${BODY};font-weight:700;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:${RED};margin-top:5px">Showtime cue</div>
    <div style="${PEN};font-size:21px;line-height:1.05;color:#1d2f8a;margin-top:1px">${ESC(fmtCue(f))}</div></div>`;
  const left=`<div style="flex:none;width:214px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:12px">
    <div style="padding:7px;background:${CHROME};border-radius:6px;box-shadow:0 8px 16px rgba(0,0,0,.35)">${fmtPosterImg(f,poster,168,252,"border-radius:2px")}</div>${flyer}${check}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;background:linear-gradient(180deg,${CREAM} 0 76%,${TEAL} 76% 77%,#fff 77% 77.6%,${TEAL} 77.6%);box-shadow:0 26px 60px rgba(0,0,0,.7);display:flex;gap:24px;padding:16px 24px 16px 20px;color:${INK}">
    ${left}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px">${sign}${board}${strip}</div></div>`;
}

/* ---------- Henry's notepad, Sunday 11 May 1980 (Goodfellas) ---------- */
function fmtPad(f,spec,menu,poster){
  const INK="#1b2a6b",RED="#b8262b",PAD="#fbf6df",DARK="#1c1410";
  const HAND="font-family:'Covered By Your Grace',cursive;font-weight:400",TYPE="font-family:'Courier Prime',monospace";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const L=40;
  const all=spec.groups.flatMap(g=>g.items);
  const lines=(spec.padLines||all.map(x=>({k:x.k}))).map(l=>l.k?Object.assign({},all.find(x=>x.k===l.k)):l);
  const row=x=>{const it=x.k?pick(x.k):{},lab=it.label||x.n||x.task||"";const tilt=((hashN(lab)%5)-2)*.22;
    const main=x.task?`<div style="${HAND};font-size:27px;line-height:${L}px;color:${RED};white-space:nowrap">${ESC(lab)}</div>`
      :`<div style="${HAND};font-size:33px;line-height:${L}px;color:${INK};white-space:nowrap"><span style="position:relative;display:inline-block">${ESC(lab)}${x.strike?`<i aria-hidden="true" style="position:absolute;left:-4px;right:-6px;top:54%;height:3px;background:${INK};transform:rotate(-1.5deg);border-radius:2px"></i>`:""}</span></div><div style="${HAND};font-size:25px;line-height:${L}px;color:#3b4a8a">${ESC(x.note)}</div>`;
    return `<div style="display:grid;grid-template-columns:96px minmax(0,1fr)"><span style="${HAND};font-size:27px;line-height:${L}px;color:${RED};padding-left:8px;white-space:nowrap">${ESC(x.p||"")}</span><div style="transform:rotate(${tilt}deg);transform-origin:0 50%;padding-left:14px">${main}</div></div>`};
  /* a quick biro sketch of the helicopter, from boxes so saved images keep it */
  const B=(l,t,w,h,r,extra)=>`<i style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;transform:rotate(${r||0}deg);transform-origin:0 0;${extra||`background:${INK}`}"></i>`;
  const heli=`<div aria-hidden="true" style="position:absolute;right:30px;top:${L*1+30}px;width:150px;height:96px;transform:rotate(-7deg)">
    ${B(8,22,112,2.5)}${B(62,22,2.5,10)}<i style="position:absolute;left:36px;top:31px;width:62px;height:30px;border:2.5px solid ${INK};border-radius:16px 22px 12px 12px"></i>${B(98,44,36,2.5)}${B(132,36,2.5,16)}${B(46,64,2.5,10)}${B(84,64,2.5,10)}${B(34,74,66,2.5)}
    <span style="position:absolute;left:0;top:-4px;${HAND};font-size:19px;line-height:1;color:${RED};white-space:nowrap">${ESC(spec.heli)}</span></div>`;
  const pad=`<div style="position:relative;flex:1;min-width:0;min-height:0;transform:rotate(.8deg)">
    <div aria-hidden="true" style="position:absolute;inset:6px -6px -6px 6px;background:#efe7c8;box-shadow:0 10px 20px rgba(0,0,0,.5)"></div>
    <div class="fx-panel" style="position:relative;height:100%;box-sizing:border-box;background:${PAD};padding:30px 18px 0 0;display:flex;flex-direction:column;box-shadow:0 2px 4px rgba(0,0,0,.25);overflow:hidden">
      <i aria-hidden="true" data-tile="ruled|${PAD}|#9fb6d6|${L}" style="position:absolute;left:0;right:0;top:30px;bottom:0;background:repeating-linear-gradient(180deg,transparent 0 ${L-2}px,#9fb6d6 ${L-2}px ${L}px)"></i>
      <i aria-hidden="true" style="position:absolute;left:96px;top:0;bottom:0;width:2px;background:rgba(200,60,60,.6)"></i>
      <div aria-hidden="true" style="position:absolute;left:0;right:0;top:-12px;height:26px;display:flex;justify-content:space-around;padding:0 18px">${Array.from({length:17},()=>`<span style="width:12px;height:26px;border-radius:6px;border:3px solid #8b9097;border-bottom-color:#5d6168"></span>`).join("")}</div>
      <div style="position:relative;display:grid;grid-template-columns:96px minmax(0,1fr);align-items:end;height:${L}px"><span></span><div style="display:flex;justify-content:space-between;align-items:baseline;padding-left:14px"><span style="${HAND};font-size:31px;line-height:${L}px;color:${INK};text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px">${ESC(spec.padHead)}</span><span style="${HAND};font-size:25px;color:${RED}">${ESC(spec.padSide)}</span></div></div>
      <div style="position:relative;display:flex;flex-direction:column">${lines.map(row).join("")}${spec.after?row({n:spec.after.n,note:spec.after.note,p:"Never",strike:true}):""}</div>
      ${heli}
      ${spec.still?`<div style="position:absolute;right:16px;bottom:${L*2+22}px;width:178px;background:#fff;padding:6px 6px 22px;box-shadow:0 6px 12px rgba(0,0,0,.3);transform:rotate(3deg)"><span aria-hidden="true" style="position:absolute;left:50%;top:-10px;width:70px;height:20px;margin-left:-35px;background:rgba(255,248,225,.78);transform:rotate(-4deg);box-shadow:0 0 0 .5px rgba(120,90,40,.25)"></span><img crossorigin="anonymous" src="${TMDB_IMG}w500${ESC(spec.still[0])}" alt="${ESC(spec.still[1])}, still from the film" style="display:block;width:100%;height:104px;object-fit:cover"><span style="position:absolute;left:0;right:0;bottom:3px;text-align:center;${HAND};font-size:16px;line-height:1;color:${INK}">${ESC(spec.still[1])}</span></div>`:""}
      <div style="flex:1"></div>
      <div style="position:relative;display:grid;grid-template-columns:96px minmax(0,1fr);padding-bottom:${Math.round(L*.35)}px"><span></span><div style="${HAND};font-size:26px;line-height:${L}px;color:${RED};padding-left:14px">${ESC(spec.cueLead)} ${ESC(fmtCue(f))}</div></div>
    </div></div>`;
  const card=`<div style="background:#fff;border:1px solid #d9d2bf;padding:10px 14px 12px;box-shadow:0 6px 12px rgba(0,0,0,.4);transform:rotate(-2.5deg);color:${DARK}">
    <div style="${TYPE};font-weight:700;font-size:12px;letter-spacing:.16em;text-transform:uppercase;border-bottom:2px solid ${RED};padding-bottom:3px">${ESC(spec.card[0])}</div>
    <div style="${TYPE};font-size:14.5px;line-height:1.4;margin-top:6px">${spec.card[1]}</div></div>`;
  const title=`<div style="background:#050505;padding:12px 10px 13px;box-shadow:0 6px 14px rgba(0,0,0,.5);text-align:center;transform:rotate(-1deg)"><div style="${TYPE};font-weight:700;font-size:15.5px;letter-spacing:.06em;color:#f4f1e8;line-height:1.5;white-space:nowrap">${spec.titleCard}</div></div>`;
  const left=`<div style="flex:none;width:266px;display:flex;flex-direction:column;justify-content:space-between;gap:16px">
    ${title}
    <div style="align-self:center;position:relative;background:#fff;padding:7px;box-shadow:0 8px 16px rgba(0,0,0,.5);transform:rotate(-1.5deg)">${fmtPosterImg(f,poster,224,336)}</div>
    ${card}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" data-tile="oilcloth|#7c1e1e|#f1e6d0|36" style="position:relative;height:100%;box-sizing:border-box;background:repeating-linear-gradient(90deg,rgba(241,230,208,.5) 0 18px,transparent 18px 36px),repeating-linear-gradient(0deg,rgba(241,230,208,.5) 0 18px,transparent 18px 36px),#7c1e1e;box-shadow:0 26px 60px rgba(0,0,0,.7),inset 0 0 80px rgba(0,0,0,.35);display:flex;gap:28px;padding:22px 28px 22px 24px">${left}${pad}</div>`;
}

/* ---------- fold at home: the trifolds as two pages, outside then inside, for double-sided printing ----------
   Outside, left to right: the flap that folds in, the back, the cover. Inside: three menu panels. */
const FMT_FOLDS={takeaway:1,diner:1};
const fmtCanFold=spec=>!!(spec&&FMT_FOLDS[spec.fmt]);
/* a little street map for the back panel, from plain boxes so saved images keep it */
function fmtMap(m,ink,road,bg,accent,DISP,BODY){
  const W=300,H=212;
  const roads=m.roads.map(r=>r.v?`<i style="position:absolute;left:${r.at}%;top:0;bottom:0;width:${r.w||10}px;margin-left:-${(r.w||10)/2}px;background:${road}"></i><span style="position:absolute;left:${r.at}%;top:${r.label||8}%;transform:translateX(-50%) rotate(-90deg);transform-origin:50% 50%;${BODY};font-size:10px;letter-spacing:.06em;color:${ink};white-space:nowrap;text-transform:uppercase">${ESC(r.n)}</span>`
    :`<i style="position:absolute;top:${r.at}%;left:0;right:0;height:${r.w||10}px;margin-top:-${(r.w||10)/2}px;background:${road}"></i><span style="position:absolute;top:${r.at}%;left:${r.label||4}%;transform:translateY(-50%);${BODY};font-size:10px;letter-spacing:.06em;color:${ink};white-space:nowrap;text-transform:uppercase">${ESC(r.n)}</span>`).join("");
  const spots=(m.spots||[]).map(p=>`<span style="position:absolute;left:${p.x}%;top:${p.y}%;transform:translate(-50%,-50%);${BODY};font-size:10.5px;font-style:italic;color:${ink};white-space:nowrap;background:${bg};padding:0 3px">${ESC(p.n)}</span>`).join("");
  return `<div style="position:relative;width:${W}px;height:${H}px;align-self:center;background:${bg};border:2px solid ${ink};overflow:hidden">${roads}${spots}
    <span style="position:absolute;left:${m.us.x}%;top:${m.us.y}%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:${accent};box-shadow:0 0 0 3px ${bg},0 0 0 5px ${accent}"></span>
    <span style="position:absolute;left:${m.us.x}%;top:${m.us.y}%;transform:translate(-50%,15px);${DISP};font-size:13px;color:${accent};white-space:nowrap;background:${bg};padding:0 4px">${ESC(m.us.n)}</span>
    <span style="position:absolute;right:6px;bottom:4px;${BODY};font-size:10px;color:${ink}">N &#8593;</span></div>`;
}
/* a film still printed on the menu, framed like the photos on a takeaway menu */
const fmtStill=(path,cap,h,frame,ink,font,extra="")=>path?`<figure style="margin:0;${extra}"><div style="background:${frame};padding:5px;box-shadow:0 3px 8px rgba(0,0,0,.25)"><img crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(path)}" alt="${ESC(cap)}, still from the film" style="display:block;width:100%;height:${h}px;object-fit:cover"></div>${cap?`<figcaption style="${font};font-size:12.5px;font-style:italic;line-height:1.3;color:${ink};text-align:center;margin-top:5px">${ESC(cap)}</figcaption>`:""}</figure>`:"";
function fmtFoldPages(f,spec,menu){
  const poster=lobbyPoster(f),T=FMT_RENDER[spec.fmt](f,spec,menu,poster,"parts"),fo=spec.fold;
  const sheet=(a,b,c)=>`${fmtBack(poster)}<div class="fx-sheet" style="color:${T.INK}">${a}${b}${c}${fmtFold}</div>`;
  const panel=inner=>`<div class="fx-panel" style="${T.P}">${inner}</div>`;
  const SP=FX_SP;
  if(spec.fmt==="takeaway"){
    const {DISP,BODY,ZH,RED,NOTE,INK,PG}=T,st=fo.stills,ph=(i,h)=>fmtStill(st[i][0],st[i][1],h,"#fff",NOTE,BODY);
    const back=panel(`<div style="text-align:center"><div lang="zh-Hant" style="${ZH};font-size:30px;color:${RED};letter-spacing:.2em;margin-right:-.2em">${spec.signs.join("")}</div><div style="${DISP};font-weight:900;font-size:26px;line-height:1.1;margin-top:4px">${ESC(fo.name)}</div><div style="${BODY};font-style:italic;font-size:14px;color:${NOTE};margin-top:3px">${ESC(fo.line)}</div></div>${SP}
      <div style="${DISP};font-weight:900;font-size:16px;color:${RED};text-align:center;margin-bottom:8px">Find us</div>${fmtMap(fo.map,INK,"rgba(165,28,36,.18)","#fbf3df",RED,`font-family:'Fraunces',serif;font-weight:900`,BODY)}
      <div style="${BODY};font-size:14px;line-height:1.5;text-align:center;margin-top:10px">${fo.address}</div>${SP}
      <div style="background:${RED};color:${PG};text-align:center;padding:10px 12px 11px"><div style="${DISP};font-weight:900;font-size:22px">Phone orders welcome</div><div style="${BODY};font-size:13px;color:#fff;margin-top:3px">Ready in 20 minutes &nbsp;·&nbsp; Serves four</div></div>${SP}${T.hours}`);
    const flap=panel(`<div style="text-align:center"><div style="${DISP};font-weight:900;font-size:24px;color:${RED}">Open the menu</div><div style="${BODY};font-style:italic;font-size:14px;color:${NOTE};margin-top:3px">${ESC(fo.flapLine)}</div></div>${SP}${ph(3,150)}${SP}${T.zod}${SP}${T.fortune}${SP}${T.legend}`);
    const inside=[panel(`${T.sect(spec.colA[0])}${SP}${ph(0,214)}${SP}<div style="${BODY};font-style:italic;font-size:14.5px;line-height:1.45;color:${NOTE};text-align:center;border-top:1px solid rgba(165,28,36,.35);border-bottom:1px solid rgba(165,28,36,.35);padding:9px 6px">${ESC(fo.notes[0])}</div>${SP}<div style="${T.bottom};justify-content:center;${DISP};font-weight:700;font-size:13.5px">Dine in or take away &nbsp;·&nbsp; Chopsticks on request</div>`),
      panel(`${T.sect(spec.colA[1])}${SP}${ph(1,176)}${SP}${T.banquet}${SP}<div style="${T.bottom};justify-content:center;${DISP};font-weight:700;font-size:13.5px">Banquets for four or more &nbsp;·&nbsp; Ask at the counter</div>`),
      panel(`${spec.colB.map(T.sect).join(SP)}${SP}${ph(2,236)}${SP}<div style="${BODY};font-style:italic;font-size:14.5px;line-height:1.45;color:${NOTE};text-align:center;border-top:1px solid rgba(165,28,36,.35);border-bottom:1px solid rgba(165,28,36,.35);padding:9px 6px">${ESC(fo.notes[1])}</div>${SP}<div style="${T.bottom};justify-content:center;${DISP};font-weight:700;font-size:13.5px">Thank you &nbsp;·&nbsp; 多謝</div>`)];
    return {outside:sheet(flap,back,T.p3),inside:sheet(...inside)};
  }
  const {SCRIPT,SLAB,BODY,RED,NAVY,NOTE,INK,MUSTARD}=T;
  const back=panel(`<div style="text-align:center"><div style="${SLAB};font-size:12px;letter-spacing:.08em;color:${NAVY}">${ESC(spec.place)}</div><div style="${SCRIPT};font-size:40px;line-height:1.1;color:${RED}">${ESC(spec.name)}</div><div style="${BODY};font-style:italic;font-size:14px;color:${NOTE}">${ESC(fo.line)}</div></div>${SP}
    <div style="${SLAB};font-size:16px;color:${NAVY};text-align:center;margin-bottom:8px">Find us</div>${fmtMap(fo.map,INK,"rgba(31,58,122,.16)","#fff",RED,SLAB,BODY)}
    <div style="${BODY};font-size:14px;line-height:1.5;text-align:center;margin-top:10px">${fo.address}</div>${SP}
    <div style="background:${NAVY};color:#fff;text-align:center;padding:10px 12px 11px;box-shadow:inset 0 0 0 3px ${NAVY},inset 0 0 0 5px #fff"><div style="${SLAB};font-size:20px;color:${MUSTARD}">Call ahead for pickup</div><div style="${BODY};font-size:13px;margin-top:3px">Ready in 20 minutes &nbsp;·&nbsp; Feeds four</div></div>${SP}${T.hours}`);
  const st=fo.stills,ph=(i,h)=>fmtStill(st[i][0],st[i][1],h,"#fff",NOTE,BODY,"transform:rotate("+(i%2?1.2:-1.2)+"deg)");
  const flap=panel(`<div style="text-align:center"><div style="${SCRIPT};font-size:34px;line-height:1;color:${RED}">${ESC(fo.flapHead)}</div><div style="${BODY};font-style:italic;font-size:14px;color:${NOTE};margin-top:4px">${ESC(fo.flapLine)}</div></div>${SP}${ph(3,150)}${SP}${T.gloss}${SP}${T.check}`);
  T.reset();
  const inside=[panel(`${T.sect(spec.colA[0])}${SP}${ph(0,160)}${SP}${T.foot}`),
    panel(`${spec.colA.slice(1).map(T.sect).join(SP)}${SP}${ph(1,130)}${SP}${T.supper}`),
    panel(`${spec.colB.map(T.sect).join(SP)}${SP}${ph(2,170)}${SP}<div style="${BODY};font-style:italic;font-size:15px;line-height:1.45;color:${NOTE};text-align:center;border-top:3px double ${RED};border-bottom:3px double ${RED};padding:12px 8px">${ESC(fo.notes[0])}</div>${SP}<div style="${T.bottom};justify-content:center;${SLAB};font-size:13px;color:${INK}">Pie by the slice, or the whole pie to go</div>`)];
  return {outside:sheet(flap,back,T.p3),inside:sheet(...inside)};
}

/* ---------- Gusteau's, Paris: the evening menu card on a linen tablecloth (Ratatouille) ---------- */
function fmtCarte(f,spec,menu,poster){
  const INK="#2b1d16",GOLD="#b08d4a",WINE="#6d1a24",CARD="#fbf6ea",NOTE="#5e4a3a";
  const SCRIPT="font-family:'Pinyon Script',cursive;font-weight:400",SC="font-family:'Cormorant SC',serif",BODY="font-family:'Cormorant Garamond',serif";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const orn=`<div aria-hidden="true" style="display:flex;align-items:center;justify-content:center;gap:10px;color:${GOLD}"><span style="width:60px;height:1px;background:${GOLD}"></span><span style="font-size:13px">&#10022;</span><span style="width:60px;height:1px;background:${GOLD}"></span></div>`;
  const dish=x=>{const it=pick(x.k);return `<div style="text-align:center"><div style="${SC};font-weight:600;font-size:21px;line-height:1.1;letter-spacing:.03em;color:${INK}">${ESC(x.fr||it.label||x.k)}</div><div style="${BODY};font-style:italic;font-size:16px;line-height:1.25;color:${NOTE};margin-top:2px">${ESC(it.label||x.n||x.k)}${x.p?` &nbsp;·&nbsp; <span style="font-style:normal;color:${WINE}">${ESC(x.p)}</span>`:""}</div><div style="${BODY};font-size:15.5px;line-height:1.3;color:${NOTE};margin-top:2px">${ESC(x.note)}</div></div>`};
  const sect=g=>`<div style="display:flex;flex-direction:column;gap:14px"><div style="text-align:center"><div style="${SCRIPT};font-size:34px;line-height:1;color:${WINE}">${ESC(g.h)}</div><div style="${SC};font-size:12.5px;letter-spacing:.24em;color:${GOLD};margin-top:2px">${ESC(g.en)}</div></div>${g.items.map(dish).join("")}</div>`;
  const card=`<div class="fx-panel" style="position:relative;flex:1;min-width:0;min-height:0;background:${CARD};padding:24px 30px 18px;box-shadow:0 12px 26px rgba(0,0,0,.45);display:flex;flex-direction:column;justify-content:space-between">
    <i aria-hidden="true" style="position:absolute;inset:10px;border:2px solid ${GOLD};pointer-events:none"></i><i aria-hidden="true" style="position:absolute;inset:16px;border:1px solid ${GOLD};pointer-events:none"></i>
    <div style="text-align:center;position:relative"><div style="${SC};font-size:13px;letter-spacing:.34em;color:${GOLD}">${ESC(spec.over)}</div><div style="${SCRIPT};font-size:70px;line-height:1.1;color:${INK}">${ESC(spec.brand)}</div><div style="${SC};font-size:15px;letter-spacing:.2em;color:${WINE}">${ESC(spec.motto)}</div></div>
    ${orn}<div style="flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 30px;padding:6px 0"><div style="display:flex;flex-direction:column;justify-content:space-evenly;gap:12px">${sect(spec.groups[0])}</div><div style="display:flex;flex-direction:column;justify-content:space-evenly;gap:12px">${spec.groups.slice(1).map(sect).join(orn)}</div></div>${orn}
    <div style="text-align:center;${BODY};font-style:italic;font-size:14.5px;color:${NOTE};position:relative">${ESC(spec.foot)}</div></div>`;
  const ph=(i,h,r)=>fmtStill(spec.stills[i][0],spec.stills[i][1],h,"#fff","#efe6d2",BODY+";font-size:14px",`transform:rotate(${r}deg)`);
  const left=`<div style="flex:none;width:210px;display:flex;flex-direction:column;justify-content:space-between;gap:14px">
    <div style="align-self:center;background:#fff;padding:6px;box-shadow:0 8px 16px rgba(0,0,0,.45);transform:rotate(-2deg)">${fmtPosterImg(f,poster,184,276)}</div>${ph(0,150,1.5)}</div>`;
  const ego=`<div style="background:${CARD};padding:14px 16px 13px;box-shadow:0 8px 16px rgba(0,0,0,.4);transform:rotate(1.5deg);color:${INK};position:relative">
    <i aria-hidden="true" style="position:absolute;inset:6px;border:1px solid ${GOLD}"></i>
    <div style="position:relative;text-align:center"><div style="${SC};font-size:12px;letter-spacing:.26em;color:${GOLD}">${ESC(spec.ego[0])}</div><div style="${SCRIPT};font-size:34px;line-height:1.15;color:${WINE}">${ESC(spec.ego[1])}</div><div style="${BODY};font-size:15.5px;line-height:1.35;margin-top:2px">${spec.ego[2]}</div>
    <div style="width:50px;height:1px;background:${GOLD};margin:9px auto 7px"></div><div style="${SC};font-size:12px;letter-spacing:.2em;color:${WINE}">Showtime cue</div><div style="${BODY};font-style:italic;font-size:16px;line-height:1.3;margin-top:2px">${ESC(fmtCue(f))}</div></div></div>`;
  const right=`<div style="flex:none;width:210px;display:flex;flex-direction:column;justify-content:space-between;gap:14px">${ph(1,130,-1.5)}${ego}${ph(2,110,1)}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;background:radial-gradient(ellipse at 50% 40%,#7a2430,#3e0f16 75%);box-shadow:0 26px 60px rgba(0,0,0,.7);display:flex;gap:24px;padding:20px 22px">${left}${card}${right}</div>`;
}

/* ---------- the Paradise, Jersey Shore 1950s: the menu card and Primo's feast card (Big Night) ---------- */
function fmtFeast(f,spec,menu,poster){
  const INK="#2a1f18",RED="#9a2b22",GRN="#2f5d3a",CARD="#f7f0de",NOTE="#5d4c3e",GOLD="#b8954f";
  const SCRIPT="font-family:'Italianno',cursive;font-weight:400",DISP="font-family:'Bodoni Moda',serif",BODY="font-family:'Libre Baskerville',serif";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const dish=x=>{const it=pick(x.k);return `<div><div style="display:flex;align-items:baseline;gap:8px"><span style="${DISP};font-weight:700;font-size:20px;line-height:1.15;color:${INK};white-space:nowrap">${ESC(x.it||it.label||x.k)}</span><span style="flex:1;border-bottom:1px dotted rgba(42,31,24,.5);min-width:10px;transform:translateY(-4px)"></span><span style="${DISP};font-weight:700;font-size:18px;color:${RED}">${ESC(x.p)}</span></div><div style="${BODY};font-style:italic;font-size:14px;line-height:1.35;color:${NOTE};margin-top:2px">${ESC(it.label||x.n||x.k)}. ${ESC(x.note)}</div></div>`};
  const sect=g=>`<div style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;align-items:center;gap:12px"><span style="${SCRIPT};font-size:42px;line-height:.9;color:${RED};white-space:nowrap">${ESC(g.h)}</span><span style="flex:1;height:1px;background:${GOLD}"></span><span style="${DISP};font-size:12px;letter-spacing:.2em;color:${GRN};text-transform:uppercase;white-space:nowrap">${ESC(g.en)}</span></div>${g.items.map(dish).join("")}</div>`;
  const flag=`<div aria-hidden="true" style="display:flex;height:6px"><i style="flex:1;background:${GRN}"></i><i style="flex:1;background:#fff"></i><i style="flex:1;background:${RED}"></i></div>`;
  const card=`<div class="fx-panel" style="position:relative;flex:1;min-width:0;min-height:0;background:${CARD};padding:0 30px 14px;box-shadow:0 12px 26px rgba(0,0,0,.45);display:flex;flex-direction:column;justify-content:space-between">
    <div style="margin:0 -30px">${flag}</div>
    <div style="text-align:center;padding-top:10px"><div style="${DISP};font-size:13px;letter-spacing:.34em;color:${GRN};text-transform:uppercase">${ESC(spec.over)}</div><div style="${SCRIPT};font-size:84px;line-height:.95;color:${RED}">${ESC(spec.brand)}</div><div style="${DISP};font-style:italic;font-size:16px;color:${NOTE}">${ESC(spec.sub)}</div></div>
    ${spec.groups.map(sect).join("")}
    <div style="text-align:center;${BODY};font-style:italic;font-size:13.5px;color:${NOTE};border-top:1px solid ${GOLD};padding-top:8px">${ESC(spec.foot)}</div></div>`;
  const ph=(i,h,r)=>fmtStill(spec.stills[i][0],spec.stills[i][1],h,"#fff","#f0e6cf",BODY+";font-size:13px",`transform:rotate(${r}deg)`);
  const note=`<div style="background:#fffdf6;padding:14px 16px 14px;box-shadow:0 8px 16px rgba(0,0,0,.4);transform:rotate(-1.5deg);color:${INK};background-image:repeating-linear-gradient(transparent 0 25px,rgba(47,93,58,.18) 25px 26px)">
    <div style="${SCRIPT};font-size:34px;line-height:1;color:${RED}">${ESC(spec.note[0])}</div><div style="${BODY};font-style:italic;font-size:14.5px;line-height:26px;margin-top:4px">${ESC(spec.note[1])}</div>
    <div style="${DISP};font-size:12px;letter-spacing:.2em;color:${GRN};text-transform:uppercase;margin-top:6px">Showtime cue</div><div style="${BODY};font-size:14.5px;line-height:1.35;margin-top:2px">${ESC(fmtCue(f))}</div></div>`;
  const left=`<div style="flex:none;width:236px;display:flex;flex-direction:column;justify-content:space-between;gap:14px"><div style="align-self:center;background:#fff;padding:6px;box-shadow:0 8px 16px rgba(0,0,0,.45);transform:rotate(-2deg)">${fmtPosterImg(f,poster,196,294)}</div>${ph(0,140,1.5)}</div>`;
  const right=`<div style="flex:none;width:236px;display:flex;flex-direction:column;justify-content:space-between;gap:14px">${ph(1,150,-1)}${note}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 22px),radial-gradient(ellipse at 50% 30%,#3d5a3f,#1d2d20 80%);box-shadow:0 26px 60px rgba(0,0,0,.7);display:flex;gap:24px;padding:20px 22px">${left}${card}${right}</div>`;
}

/* ---------- El Jefe, the food truck: chalkboard menu on the painted truck side (Chef) ---------- */
function fmtTruck(f,spec,menu,poster){
  const CHALK="#f3f1ea",YEL="#ffd24a",ORA="#f07a2a",TEAL="#2fb6a8",PINK="#ff8fb1",BOARD="#1f2523";
  const DISP="font-family:'Fredericka the Great',serif;font-weight:400",HEAD="font-family:'Amatic SC',sans-serif;font-weight:700",HAND="font-family:'Patrick Hand',cursive;font-weight:400",TRUCK="font-family:'Bungee',sans-serif;font-weight:400";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const cols=[YEL,TEAL,PINK,ORA];
  const dish=(x,c)=>{const it=pick(x.k);return `<div><div style="display:flex;align-items:baseline;gap:10px"><span style="${DISP};font-size:25px;line-height:1.05;color:${CHALK};white-space:nowrap">${ESC(it.label||x.n||x.k)}</span><span style="flex:1;border-bottom:2px dashed rgba(243,241,234,.35);min-width:10px;transform:translateY(-6px)"></span><span style="${DISP};font-size:25px;color:${c}">${ESC(x.p)}</span></div><div style="${HAND};font-size:19px;line-height:1.2;color:rgba(243,241,234,.86);margin-top:2px">${ESC(x.note)}</div></div>`};
  const sect=(g,i)=>`<div style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:0 16px;align-items:start"><div style="${HEAD};font-size:32px;line-height:1.1;letter-spacing:.04em;color:${cols[i%4]};border-bottom:2px solid ${cols[i%4]};padding-bottom:2px">${ESC(g.h)}</div><div style="display:flex;flex-direction:column;gap:10px">${g.items.map(x=>dish(x,cols[i%4])).join("")}</div></div>`;
  const half=Math.ceil(spec.groups.length/2);
  const col=gs=>`<div class="fx-panel" style="min-height:0;display:flex;flex-direction:column;justify-content:space-between;gap:16px">${gs.join("")}</div>`;
  const secs=spec.groups.map(sect);
  const board=`<div style="position:relative;flex:1;min-width:0;min-height:0;padding:12px;background:linear-gradient(135deg,#8a6a45,#6b4f33);border-radius:6px;box-shadow:0 10px 22px rgba(0,0,0,.45)">
    <div style="position:relative;height:100%;box-sizing:border-box;background:radial-gradient(ellipse at 30% 20%,#2c3431,${BOARD} 70%);padding:16px 24px 12px;display:flex;flex-direction:column;gap:12px;box-shadow:inset 0 0 30px rgba(0,0,0,.6)">
      <i aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 80%,rgba(255,255,255,.06),transparent 50%),radial-gradient(ellipse at 20% 60%,rgba(255,255,255,.05),transparent 40%);pointer-events:none"></i>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:baseline"><span style="${DISP};font-size:38px;line-height:1;color:${CHALK};white-space:nowrap">${ESC(spec.boardHead)}</span><span style="${HAND};font-size:20px;color:${YEL}">${ESC(spec.boardSide)}</span></div>
      <div class="fx-panel" style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-evenly;gap:8px">${secs.join("")}</div>
      <div style="position:relative;border-top:2px dashed rgba(243,241,234,.35);padding-top:7px;${HAND};font-size:19px;line-height:1.25;color:${CHALK}"><span style="color:${YEL}">Showtime cue:</span> ${ESC(fmtCue(f))}</div></div></div>`;
  const ph=(i,h,r)=>fmtStill(spec.stills[i][0],spec.stills[i][1],h,"#fff","#3b2a12","font-family:'Patrick Hand',cursive;font-size:16px",`transform:rotate(${r}deg)`);
  const route=`<div style="background:#fff;border:3px solid ${BOARD};padding:9px 12px 10px;transform:rotate(-1.5deg);box-shadow:0 6px 12px rgba(0,0,0,.3)"><div style="${TRUCK};font-size:13px;letter-spacing:.06em;color:${ORA}">${ESC(spec.route[0])}</div><div style="${HAND};font-size:19px;line-height:1.3;color:${BOARD};margin-top:3px">${spec.route[1]}</div></div>`;
  const left=`<div style="flex:none;width:226px;display:flex;flex-direction:column;justify-content:space-between;gap:12px">
    <div style="text-align:center"><div style="${TRUCK};font-size:46px;line-height:1;color:#fff;text-shadow:3px 3px 0 ${ORA},6px 6px 0 rgba(0,0,0,.25)">${ESC(spec.brand)}</div><div style="${TRUCK};font-size:15px;letter-spacing:.2em;color:#0f5c55;margin-top:4px">${ESC(spec.sub)}</div></div>
    <div style="align-self:center;background:#fff;padding:6px;box-shadow:0 8px 16px rgba(0,0,0,.35);transform:rotate(-2deg)">${fmtPosterImg(f,poster,170,255)}</div>${route}</div>`;
  const right=`<div style="flex:none;width:226px;display:flex;flex-direction:column;justify-content:space-between;gap:12px">${ph(0,128,1.5)}${ph(1,128,-1.5)}${ph(2,128,1)}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" style="position:relative;height:100%;box-sizing:border-box;background:linear-gradient(160deg,${YEL} 0 38%,${ORA} 38% 41%,#ffe9a8 41% 100%);box-shadow:0 26px 60px rgba(0,0,0,.7);border-radius:10px;display:flex;gap:22px;padding:20px 22px">
    <i aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:14px;background:${TEAL};border-radius:0 0 10px 10px"></i>${left}${board}${right}</div>`;
}

/* ---------- Sally's order, on the side: a diner guest check and the trip that started it (When Harry Met Sally) ---------- */
function fmtCheck(f,spec,menu,poster){
  const GRN="#2f6b45",PAD="#f2f6ea",INK="#1d2e8f",DARK="#1f2a22",RED="#b8262b",LINE="rgba(47,107,69,.28)";
  const PRINT="font-family:'Archivo Narrow',sans-serif",HAND="font-family:'Homemade Apple',cursive;font-weight:400",BODY="font-family:'Libre Franklin',sans-serif",DISP="font-family:'DM Serif Display',serif;font-weight:400";
  const pick=k=>menu.all.find(x=>x.n===k)||{};
  const L=50;
  const row=x=>{const it=pick(x.k);const mods=(x.mods||[]).map(m=>`<div style="${HAND};font-size:16px;line-height:${L/2}px;color:${INK};padding-left:18px">${ESC(m)}</div>`).join("");
    return `<div style="display:grid;grid-template-columns:44px minmax(0,1fr) 74px;border-bottom:1px solid ${LINE}"><span style="${HAND};font-size:17px;line-height:${L}px;color:${INK};text-align:center">${ESC(x.q||"4")}</span><div><div style="${HAND};font-size:20px;line-height:${L}px;color:${INK};white-space:nowrap">${ESC(it.label||x.n||x.k)}</div>${mods}<div style="${BODY};font-size:13.5px;line-height:1.3;color:#5a6a5e;padding:0 0 6px 2px;font-style:italic">${ESC(x.note)}</div></div><span style="${HAND};font-size:17px;line-height:${L}px;color:${INK};text-align:right;padding-right:10px">${ESC(x.p)}</span></div>`};
  const items=spec.groups.flatMap(g=>g.items);
  const check=`<div class="fx-panel" style="position:relative;flex:1;min-width:0;min-height:0;background:${PAD};box-shadow:0 12px 26px rgba(0,0,0,.4);transform:rotate(-.6deg);display:flex;flex-direction:column;color:${DARK}">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:14px 18px 8px;border-bottom:3px solid ${GRN}"><div><div style="${PRINT};font-weight:700;font-size:28px;line-height:1;letter-spacing:.02em;color:${GRN}">Guest Check</div><div style="${PRINT};font-size:13px;letter-spacing:.12em;color:${GRN};text-transform:uppercase;margin-top:3px">${ESC(spec.place)}</div></div>
      <div style="display:grid;grid-template-columns:repeat(4,auto);gap:0 12px;${PRINT};font-size:11px;letter-spacing:.1em;color:${GRN};text-transform:uppercase;text-align:center">${spec.fields.map(([a,b])=>`<div style="border:1px solid ${GRN};padding:2px 8px"><div>${ESC(a)}</div><div style="${HAND};font-size:14px;letter-spacing:0;color:${INK};text-transform:none;line-height:1.6">${ESC(b)}</div></div>`).join("")}</div></div>
    <div style="display:grid;grid-template-columns:44px minmax(0,1fr) 74px;background:${GRN};color:#fff;${PRINT};font-weight:700;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase"><span style="padding:3px 0;text-align:center">Qty</span><span style="padding:3px 2px">Item</span><span style="padding:3px 10px 3px 0;text-align:right">Amount</span></div>
    <div style="padding:0 0">${items.map(row).join("")}</div>
    ${FX_SP}
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:18px;padding:8px 18px 14px;border-top:3px solid ${GRN}"><div style="flex:1"><div style="${PRINT};font-weight:700;font-size:11.5px;letter-spacing:.14em;color:${RED};text-transform:uppercase">Showtime cue</div><div style="${HAND};font-size:15px;line-height:1.5;color:${INK}">${ESC(fmtCue(f))}</div></div><div style="flex:none;text-align:right"><div style="${PRINT};font-size:11.5px;letter-spacing:.14em;color:${GRN};text-transform:uppercase">Total</div><div style="${HAND};font-size:22px;color:${INK}">${ESC(spec.total)}</div></div></div>
    <div style="${PRINT};font-size:11px;letter-spacing:.2em;text-align:center;color:${GRN};text-transform:uppercase;padding:0 0 8px">${ESC(spec.thanks)}</div></div>`;
  const ph=(i,h,r)=>fmtStill(spec.stills[i][0],spec.stills[i][1],h,"#fff","#efe2c6",BODY+";font-size:12.5px",`transform:rotate(${r}deg)`);
  const trip=`<div style="background:#fbf3df;border:1px solid #d9c9a4;padding:10px 12px 12px;box-shadow:0 6px 12px rgba(0,0,0,.3);transform:rotate(1.5deg);color:${DARK}">
    <div style="${PRINT};font-weight:700;font-size:12px;letter-spacing:.16em;color:${RED};text-transform:uppercase">${ESC(spec.trip[0])}</div>
    <div style="position:relative;height:58px;margin:8px 4px 4px"><i style="position:absolute;left:8px;right:8px;top:24px;border-top:3px dashed ${RED}"></i><span style="position:absolute;left:0;top:16px;width:18px;height:18px;border-radius:50%;background:${DARK}"></span><span style="position:absolute;right:0;top:16px;width:18px;height:18px;border-radius:50%;background:${DARK}"></span><span style="position:absolute;left:0;top:38px;${PRINT};font-weight:700;font-size:13px">${ESC(spec.trip[1])}</span><span style="position:absolute;right:0;top:38px;${PRINT};font-weight:700;font-size:13px">${ESC(spec.trip[2])}</span><span style="position:absolute;left:50%;top:0;transform:translateX(-50%);${BODY};font-style:italic;font-size:12.5px;white-space:nowrap">${ESC(spec.trip[3])}</span></div>
    <div style="${BODY};font-size:13px;line-height:1.35">${ESC(spec.trip[4])}</div></div>`;
  const left=`<div style="flex:none;width:236px;display:flex;flex-direction:column;justify-content:space-between;gap:14px">
    <div style="text-align:center"><div style="${DISP};font-size:30px;line-height:1.05;color:#fff7e6">${ESC(f.title.replace(/\.\.\.$/,"..."))}</div><div style="${BODY};font-style:italic;font-size:14px;color:#e9dcc0;margin-top:3px">${ESC(spec.tag)}</div></div>
    <div style="align-self:center;background:#fff;padding:6px;box-shadow:0 8px 16px rgba(0,0,0,.45);transform:rotate(-2deg)">${fmtPosterImg(f,poster,180,270)}</div>${trip}</div>`;
  const right=`<div style="flex:none;width:236px;display:flex;flex-direction:column;justify-content:space-between;gap:12px">${ph(0,138,1.5)}${ph(1,124,-1.5)}${ph(2,124,1)}</div>`;
  return `${fmtBack(poster)}<div class="fx-wall" data-tile="boards|#8a5a34|#6e4628|30" style="position:relative;height:100%;box-sizing:border-box;background:repeating-linear-gradient(0deg,#6e4628 0 3px,#8a5a34 3px 30px);box-shadow:0 26px 60px rgba(0,0,0,.7);display:flex;gap:24px;padding:20px 22px">${left}${check}${right}</div>`;
}


/* ---------- Channel 4 staff canteen: a 1970s broadcast bulletin ---------- */
function fmtNewsroom(f,spec,menu,poster){
  const B="#652838",P="#f4ead3",W="#fbf5e6",I="#392c26",G="#d5a244",M="#6b584b",L="#cdb894";
  const HEAD="font-family:'Bevan',serif;font-weight:400",BODY="font-family:'Libre Franklin',sans-serif",TYPE="font-family:'Courier Prime',monospace";
  const lab=(t,c=B,e='')=>`<div style="${TYPE};font-size:11.5px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const pg=['A1','A2','B1','C1','D1'],slug=['CHEESE','FRIES','LEAD','KICKER','TOAST'],talent=['Baxter','Champ','Ron','Veronica','Brick'],tm=['0:45','1:10','2:30','0:40','0:20'];
  const nm=s=>ESC(s).replace('SCOTCH',`<span style="color:${G};background:${B};padding:0 3px">SCOTCH</span>`);
  const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:44px 1fr 92px 52px;column-gap:12px;align-items:center;border-top:1px solid ${L};padding:5px 0">
    <div style="${TYPE};font-size:16px;font-weight:700;color:${B}">${pg[i]}</div>
    <div><div style="display:flex;align-items:baseline;gap:9px">${lab(slug[i],M)}<span style="${BODY};font-size:21px;line-height:1.1;font-weight:700;color:${I}">${nm(r.it.label||'')}</span></div>
      ${r.it.desc?`<div style="${BODY};font-size:13.5px;line-height:1.42;color:${I};margin-top:2px">${ESC(r.it.desc)}${/[.!?]$/.test(r.it.desc)?'':'.'}</div>`:''}
      ${r.it.film?`<div style="${TYPE};font-size:13px;line-height:1.3;color:${B};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>
    <div style="${TYPE};font-size:14px;font-weight:700;color:${I}">${talent[i]}</div>
    <div style="${TYPE};font-size:14px;font-weight:700;color:${M};text-align:right">${tm[i]}</div></div>`;
  const sheet=`<section style="position:absolute;left:330px;top:24px;width:717px;height:694px;box-sizing:border-box;background:${W};box-shadow:0 10px 24px rgba(0,0,0,.35);padding:16px 24px 10px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid ${B};padding-bottom:9px">
      <div>${lab('KVWN Channel 4 / San Diego / Show rundown')}<div style="${HEAD};font-size:40px;line-height:1.02;color:${B};margin-top:4px">The six o'clock supper</div><div style="${BODY};font-size:15px;color:${M};margin-top:3px">${ESC(spec.brand||'')}. ${ESC(spec.tag||'')}</div></div>
      <div style="border:2px solid ${B};padding:5px 10px;text-align:center;transform:rotate(3deg)">${lab('On air')}<div style="${HEAD};font-size:24px;color:${B};line-height:1.05">6:00</div>${lab('Live',M)}</div></div>
    <div style="display:grid;grid-template-columns:44px 1fr 92px 52px;column-gap:12px;padding:6px 0 3px">${lab('Pg',M)}${lab('Slug / item',M)}${lab('Talent',M)}${lab('Time',M,'text-align:right')}</div>
    <div style="flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="border-top:3px solid ${B};padding-top:7px;display:flex;justify-content:space-between;gap:16px">
      ${lab('Prompter note: Ron reads anything you put up there.',M)}${lab('Fantana: 60% of the time',M,'white-space:nowrap')}</div></section>`;
  const side=`<section style="position:absolute;left:0;top:0;width:306px;height:742px;background:${B};box-sizing:border-box;padding:24px 24px 22px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;gap:14px;align-items:center"><div style="width:84px;text-align:center"><div style="background:${P};${HEAD};font-size:58px;line-height:1.1;color:${B}">4</div><div style="background:${G};${BODY};font-size:13px;font-weight:700;letter-spacing:.2em;color:${B};padding:2px 0">NEWS</div></div>
      <div>${lab('KVWN',P)}<div style="${BODY};font-size:24px;line-height:1.05;font-weight:700;color:${P};margin-top:2px">SAN<br>DIEGO</div></div></div>
    <div><div style="${HEAD};font-size:30px;line-height:1;color:${P}">ANCHORMAN</div>${lab('The Legend of Ron Burgundy / '+f.year,G,'margin-top:5px')}</div>
    <div style="border:4px solid ${P};box-shadow:0 6px 14px rgba(0,0,0,.35)">${fmtPosterImg(f,poster,250,350)}</div>
    <div style="border-top:2px solid ${G};padding-top:8px">${lab('Roll cue',G)}<div style="${BODY};font-size:14.5px;line-height:1.45;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${HEAD};font-size:22px;line-height:1.1;color:${P}">Stay classy,<br>San Diego.</div>${lab('Poster: TMDB','#d9b9a8')}</div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:#e9dcc0;box-shadow:0 18px 40px #0008">${side}${sheet}</div>`;
}


function fmtJurassic(f,spec,menu,poster){
  const J='#1d2b1f',P='#f4eedd',Y='#f2b632',R='#c2321f',I='#1f2320',M='#5c6157',G='#3d6b3a',S="font-family:'Bevan',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const stops=['STOP 01 / THE HATCHERY','STOP 02 / VISITOR CENTRE KITCHEN','STOP 03 / THE DINING ROOM','STOP 04 / THE FREEZERS','STOP 05 / TOUR CAR, T. REX PADDOCK'];
  const row=(it,i)=>`<div style="padding:${i?8:0}px 0 8px;${i<all.length-1?'border-bottom:2px solid #ddd3b8':''}">
    <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.06em;color:${G}">${stops[i]} / ${ESC((tabs[i]||'').toUpperCase())}</div>
      <div style="${S};font-size:${i===2?25:21}px;line-height:1.12;color:${I};margin-top:3px">${ESC(it.label)}</div>
      <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:3px">${ESC(it.desc)}</div>
      ${it.film?`<div style="${B};font-size:13px;line-height:1.3;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`;
  const sheet=`<section aria-label="Park tour itinerary menu" style="${at(24,22,660,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.6)`)}">
    <div style="${at(0,0,660,`height:72px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 30px;box-sizing:border-box`)}">
      <div><div style="${S};font-size:34px;line-height:1;color:#fff">DANGER</div><div style="${B};font-size:13px;font-weight:700;letter-spacing:.2em;color:#ffe0d8;margin-top:4px">10,000 VOLTS / LUNCH IN PROGRESS</div></div>
      <div style="width:50px;height:50px;border-radius:50%;background:${Y};border:4px solid ${I};box-sizing:border-box;text-align:center;${S};font-size:28px;line-height:42px;color:${I}">!</div></div>
    <header style="${at(30,88,600,`border-bottom:3px solid ${I};padding-bottom:9px;display:flex;justify-content:space-between;align-items:flex-end`)}">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${G}">ISLA NUBLAR / VISITOR CENTRE / PREVIEW TOUR, 1993</div><div style="${S};font-size:30px;line-height:1.1;color:${I};margin-top:4px">Park tour lunch</div></div>
      <div style="${T};font-size:11px;line-height:1.45;color:${M};text-align:right">COST: SPARED NO EXPENSE<br>GUESTS: Grant, Sattler,<br>Malcolm, Gennaro + 2</div></header>
    <div style="${at(30,172,600)}">${all.map(row).join('')}</div>
    <footer style="${at(30,662,600,`border-top:3px solid ${I};padding-top:8px;display:flex;justify-content:space-between;${T};font-size:11px;color:${M}`)}"><span>OBJECTS IN MIRROR ARE CLOSER THAN THEY APPEAR</span><span>SYSTEM: NEDRY</span></footer>
  </section>`;
  const right=`<div style="${at(708,22,339,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;border:4px solid ${Y};background:${Y}">${img('hero','Jurassic Park film still',331,224)}</figure>
    <figure style="margin:14px 0 0;border:4px solid ${Y};background:${Y}">${img('scene','Jurassic Park film scene',331,250)}</figure>
    <div style="margin-top:auto;background:${Y};padding:12px 16px;box-shadow:0 5px 14px rgba(0,0,0,.5)">
      <div style="${T};font-size:11px;font-weight:700;color:${I}">CONTROL ROOM NOTE</div>
      <div style="${S};font-size:20px;line-height:1.15;color:${I};margin-top:4px">Life finds a way. So does dessert. Hold onto your butts.</div>
      <div style="${B};font-size:13px;line-height:1.38;color:${I};margin-top:6px"><b>CUE</b> ${ESC(fmtCue(f))}</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#9fb09a;margin-top:10px;text-align:right">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${J};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 90% 100%,rgba(61,107,58,.5),transparent 60%)"></div>${sheet}${right}</div>`;
}

function fmtNakatomi(f,spec,menu,poster){
  const PA='#f6f4ee',IN='#1d1f24',SO='#5a5d64',RD='#b3262b',GN='#2f6b48',GD='#b8964a',D="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const nh=t=>ESC(String(t||'').normalize('NFC')).replace(/[âêîôûàèìòùëïüç]/gi,m=>`<span style="font-family:'Times New Roman',Times,serif;font-weight:400">${m}</span>`);
  const lab=(s,c,e='')=>`<div style="${T};font-size:12px;font-weight:700;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tm=['7:30 PM','7:30 PM','8:15 PM','9:00 PM','All night'],st=['Floor 30','Limo','Floor 30','Car park','Limo bar'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:86px 1fr 90px;column-gap:12px;padding:10px 0 8px;border-bottom:1px solid #d3d0c4">
    <div><div style="${T};font-size:14px;font-weight:700;color:${RD}">${tm[i]||''}</div><div style="${T};font-size:12px;color:${SO};margin-top:3px">${st[i]||''}</div></div>
    <div><h3 style="${D};font-size:25px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${nh(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:3px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${B};font-size:13px;font-style:italic;line-height:1.32;margin:3px 0 0;color:${GN}">${ESC(it.film||'')}</p></div>
    <div style="text-align:right">${lab(ESC(gs[i]?gs[i].tab:''),RD)}<div style="${T};font-size:12px;color:${SO};margin-top:4px">Qty ${i===2?'30':i===4?'1 btl':'2 trays'}</div></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(180deg,#0e1726,#1c2b3f 60%,#2d2433);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background-image:linear-gradient(90deg,#f3c96b14 2px,#0000 2px),linear-gradient(180deg,#f3c96b10 2px,#0000 2px);background-size:30px 22px"></div>
  <header style="position:absolute;left:24px;top:22px;width:360px">
    ${lab('Century City, Los Angeles / 1988','#f0cf7a')}
    <h1 style="${D};font-size:72px;line-height:.86;font-weight:600;letter-spacing:-.02em;margin:6px 0 0;color:#f6f4ee;text-shadow:none">Die Hard</h1>
    <div style="${D};font-size:21px;font-style:italic;color:#d6dbe4;margin-top:6px">${ESC(spec.tag||'')} Thirty floors up.</div>
  </header>
  <figure style="position:absolute;left:24px;top:170px;width:360px;margin:0;background:${PA};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000c;transform:rotate(-1deg)">${img('hero','Nakatomi Plaza rising over Century City',346,200)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Century City. Nakatomi Plaza, lit up for Christmas.</figcaption></figure>
  <div style="position:absolute;left:24px;top:446px;width:360px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:${PA};padding:6px;box-shadow:0 10px 22px #000c;transform:rotate(1.3deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px;margin-top:6px">
      <div style="background:#f3e17a;padding:10px 11px;box-shadow:0 6px 14px #0009;transform:rotate(-2deg)">
        ${lab('Note for Al',IN)}
        <div style="${D};font-size:22px;font-weight:600;line-height:1.05;color:${IN};margin-top:4px">Welcome to the party, pal.</div>
      </div>
      <div style="border:2px solid ${GD};padding:8px 10px">
        ${lab('The vault',GD)}
        <div style="${T};font-size:13px;line-height:1.4;color:#f6f4ee;margin-top:3px">7 locks.<br>$640M in bonds.<br>Not catered.</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:412px;top:18px;width:636px;height:706px;background:${PA};box-shadow:0 12px 28px #000c;box-sizing:border-box;padding:14px 22px 10px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${IN};padding-bottom:6px">
      <div>${lab('Nakatomi Plaza / Banquet event order',RD)}<div style="${D};font-size:38px;font-weight:600;line-height:1;color:${IN};margin-top:4px">Christmas Eve Reception</div></div>
      <div style="${T};font-size:13px;line-height:1.45;color:${IN};text-align:right">BEO No. 1224<br>Floor 30</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;${T};font-size:13px;line-height:1.45;color:${IN};padding:6px 0;border-bottom:1px solid ${IN}"><span>HOST: J. Takagi</span><span style="text-align:right">CONTACT: H. Gennero</span><span>DRIVER: Argyle</span><span style="text-align:right">GUESTS: staff + 1 cop from NY</span></div>
    <div style="display:grid;grid-template-columns:86px 1fr 90px;column-gap:12px;padding:6px 0 4px;border-bottom:2px solid ${IN}">${lab('Time')}${lab('Menu item')}${lab('Course','','text-align:right')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${T};font-size:10px;color:${SO};margin-top:5px">Dress: festive. Shoes optional. Guests who fly in may make fists with their toes on the carpet.</div>
  </div>
  <div style="position:absolute;left:24px;bottom:5px;${T};font-size:9px;color:#9aa6b8">FILM IMAGERY: TMDB</div>
  </div>`;
}

/* The last concession before the ocean: enamel board, real film map, counterbill and soda ticket. */
function fmtConey(f,spec,menu,poster){
  const N='#0c1418',K='#141414',W='#f4f1e8',Y='#f2c230',RD='#b8322a',OR='#e07a2a',S='#9aa3a6',LS='#5d6366';
  const H="font-family:'Alfa Slab One',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(t,c=S,e='')=>`<div style="${B};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
  const order=[0,1,4,2,3];
  const stops=[['Van Cortlandt Park','The Bronx. Cyrus calls the conclave.'],['Tremont','Orphans turf. Keep your vest on.'],['Union Square','Lizzies and Punks. Do not linger.'],['Stillwell Ave, Coney Island','Home turf. Last stop.'],['The boardwalk','Dawn on the beach. Made it.']];
  const stop=(x,j)=>{const last=j===3;return `<div style="display:grid;grid-template-columns:34px 1fr;column-gap:16px;position:relative;padding-bottom:${j<4?20:0}px"><div style="position:relative"><div style="position:absolute;left:4px;top:4px;width:${last?26:22}px;height:${last?26:22}px;border-radius:50%;background:${last?Y:W};border:5px solid ${last?OR:K};box-sizing:border-box;${last?'left:2px;top:2px':''}"></div></div><div style="${last?`background:${K};color:${W};padding:11px 14px 12px;margin:-4px 0 0`:''}"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">${lab(stops[j][0],last?Y:RD,'font-size:13.5px')}${lab(stops[j][1],last?S:LS,'font-size:12px;letter-spacing:.06em;text-transform:none;font-weight:600;text-align:right')}</div><div style="${H};font-size:${last?26:21}px;line-height:1.08;color:${last?W:K};margin-top:3px">${nm(x)}</div><div style="${B};font-size:17px;line-height:1.24;color:${last?'#d7dcde':'#3f4446'};margin-top:3px">${ESC(x.d)}</div><div style="${B};font-size:16px;line-height:1.2;font-weight:700;color:${last?OR:RD};margin-top:2px">${ESC(x.note||'')}</div></div></div>`;};
  const card=`<section aria-label="Route card" style="${at(22,22,620,'height:698px;background:'+W+';box-shadow:0 12px 26px rgba(0,0,0,.6)')}"><div style="background:${K};padding:16px 24px 14px;display:flex;justify-content:space-between;align-items:flex-end"><div>${lab('Route card / One long night / 1979',Y)}<div style="${H};font-size:40px;line-height:1;color:${W};margin-top:6px">THE WARRIORS</div></div><div style="text-align:right">${lab('Fare',S)}<div style="${H};font-size:26px;line-height:1;color:${Y}">1 TOKEN</div></div></div><div style="${at(24,104,572)}"><div aria-hidden="true" style="position:absolute;left:18px;top:10px;width:6px;height:540px;background:${OR}"></div>${order.map((k,j)=>stop(xs[k],j)).join('')}</div><div style="${at(24,664,572,'display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid '+K+';padding-top:7px')}">${lab('Can you dig it? Eat it all before the Riffs show up.',K,'font-size:12px;letter-spacing:.08em')}<span style="${B};font-size:10px;letter-spacing:.1em;color:${LS}">FILM IMAGERY: TMDB</span></div></section>`;
  const side=`<aside style="${at(666,22,383,'height:698px;display:flex;flex-direction:column')}"><figure style="margin:0;border:4px solid ${Y}">${img('scene','The Warriors on the station platform',375,232)}</figure><div style="display:flex;justify-content:space-between;margin-top:8px">${lab('Nine Warriors. One train home.',Y)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">${img('map','A finger follows the subway map',186,150)}${img('hero','The Wonder Wheel at night',187,150)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:7px">${lab('The map home',S,'font-size:12px')}${lab('The Wonder Wheel',S,'font-size:12px')}</div><div style="margin-top:16px;border:2px solid ${RD};padding:10px 13px 11px">${lab('On the radio tonight',RD)}<div style="${B};font-size:17px;line-height:1.25;color:${W};margin-top:4px">The DJ tracks the Warriors all night. Luther wants them to come out to play. Dinner first.</div></div>${FX_SP}<div style="border-top:3px solid ${OR};padding-top:10px">${lab('Cue',OR)}<div style="${B};font-size:18px;line-height:1.28;color:${W};margin-top:4px">${ESC(fmtCue(f))}</div></div><div style="${H};font-size:19px;line-height:1.2;color:${Y};margin-top:12px">${ESC(spec.tag||'')}</div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 18px 45px rgba(0,0,0,.5)">${card}${side}</div>`;
}

function fmtMcdowellsMark(style=""){
  return `<span class="mcdowells-film-sign" role="img" aria-label="The actual McDowell’s golden arcs sign from Coming to America" style="display:inline-block;position:relative;overflow:hidden;${style}"><img crossorigin="anonymous" src="assets/menu-details/mcdowells-film-source.jpg" alt="" aria-hidden="true" style="position:absolute;max-width:none;width:774.19355%;height:303.0303%;left:-411.6129%;top:-8.08081%;display:block"></span>`;
}

function fmtMcdowells(f,spec,menu,poster){
  const R='#a72525',Y='#edbd47',P='#f7efd9',I='#3c3024',M='#71604b',BROWN='#663220';
  const H="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const micro=(t,c=R)=>`<div style="${T};font-size:10px;font-weight:700;letter-spacing:.1em;line-height:1.35;text-transform:uppercase;color:${c}">${ESC(t)}</div>`;
  const art=spec.art||{},image=(k,w='w780')=>TMDB_IMG+w+art[k];
  const pick=x=>menu.all.find(it=>it.n===x.k)||{};
  const label=x=>ESC(pick(x).label||x.n||x.k);
  const snacks=spec.groups[0].items,main=spec.groups[1].items[0],sweet=spec.groups[2].items[0],drink=spec.groups[3].items[0];
  const dish=(x,y,w,item,kicker)=>`<article style="${at(x,y,w)}">${micro(kicker)}<h3 style="margin:8px 0 0;${B};font-size:22px;line-height:1.12;letter-spacing:-.025em;font-weight:700;color:${R}">${label(item)}</h3><div style="${B};font-size:12.5px;line-height:1.5;color:${I};margin-top:7px">${ESC(item.d)}</div></article>`;
  const box=`<header style="${at(22,18,1027,`height:125px;background:#fff7de;border:5px solid ${BROWN};border-radius:5px;box-shadow:inset 0 0 0 2px #e2c787,0 5px 7px rgba(45,13,10,.5);overflow:hidden`)}">${fmtMcdowellsMark("position:absolute;left:28px;top:9px;width:76px;height:97px")}<div style="${at(132,19,550,`${H};font-size:62px;line-height:1;letter-spacing:-.045em;color:${R};text-shadow:1px 1px 0 #f4bf53`)}">McDowell’s</div><div style="${at(135,91,547)}">${micro('Queens / a royal appetite',BROWN)}</div><div style="${at(724,21,249,`height:74px;border-left:2px solid #d7bd88;padding-left:24px`)}"><div style="${H};font-size:23px;line-height:1.12;letter-spacing:-.03em;color:${R}">COMING TO<br>AMERICA</div><div style="${T};font-size:10px;font-weight:700;letter-spacing:.1em;color:${M};margin-top:8px">FILM NIGHT / 1988</div></div></header>`;
  const liner=`<section style="${at(24,164,1023,`height:551px;background:${P};box-shadow:0 4px 9px rgba(47,17,11,.43);border:1px solid #c9b28a;overflow:hidden`)}"><img src="assets/hero/paper.webp" alt="" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.09;pointer-events:none"><div style="${at(15,15,480,'height:200px')}"><img class="fx-poster" crossorigin="anonymous" src="${image('counter')}" alt="Akeem and his co-worker behind the McDowell’s counter" style="display:block;width:480px;height:200px;object-fit:cover;object-position:center 40%"></div><div style="${at(505,15,328,'height:200px')}"><img crossorigin="anonymous" src="${image('royal')}" alt="Akeem and Lisa at their royal wedding in Zamunda" style="display:block;width:328px;height:200px;object-fit:cover;object-position:center 35%"></div><figure style="${at(852,15,154,`height:200px;margin:0;background:${R}`)}"><img crossorigin="anonymous" src="${TMDB_IMG}w342${ESC(art.poster||poster||'')}" alt="Coming to America official film poster" style="display:block;width:134px;height:200px;object-fit:cover;margin:auto"></figure>
    <div style="${at(15,216,818,`height:20px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 9px`)}">${micro('A prince at the counter',P)}${micro('Queens meets Zamunda',P)}</div>
    <article style="${at(26,257,342)}">${micro('The house burger')}<h2 style="margin:4px 0 0;${H};font-size:52px;line-height:.98;letter-spacing:-.05em;color:${R}">BIG MICK</h2><div style="${B};font-size:13.5px;line-height:1.42;color:${I};margin-top:6px">${ESC(main.d)}</div><blockquote style="margin:10px 0 0;padding:0 0 0 12px;border-left:3px solid ${Y}"><div style="${B};font-style:italic;font-size:13px;line-height:1.4;color:${I}">“They got the Big Mac, I got the Big Mick. We both got two all-beef patties, special sauce, lettuce, cheese, pickles and onions, but their buns have sesame seeds. My buns have no seeds.”</div><div style="${T};font-size:10.5px;letter-spacing:.06em;color:${R};margin-top:6px">CLEO McDOWELL</div></blockquote></article>
    <div aria-hidden="true" style="${at(392,255,1,'height:235px;background:#c9b58f')}"></div>
    ${dish(416,257,262,snacks[0],'On the side')}
    ${dish(416,377,262,snacks[1],'A little Zamunda')}
    <div aria-hidden="true" style="${at(702,255,1,'height:235px;background:#c9b58f')}"></div>
    ${dish(726,257,270,sweet,'Something sweet')}
    ${dish(726,377,270,drink,'From the counter')}
    <footer style="${at(26,504,970,`border-top:2px solid ${R};padding-top:9px;display:flex;gap:13px;align-items:baseline`)}"><span style="${T};font-size:10px;font-weight:700;letter-spacing:.08em;white-space:nowrap;color:${R}">SERVING CUE</span><span style="${B};font-size:11px;line-height:1.4;color:${I}">${ESC(fmtCue(f))}</span></footer>
  </section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${R};background-image:linear-gradient(135deg,#bf3a31,#8d201f);border-radius:20px;box-shadow:inset 0 2px 2px #dc7762,inset 0 0 0 9px #84231f,inset 0 0 0 11px #ce5645,0 13px 24px rgba(0,0,0,.4);${B}">${box}${liner}<div style="${at(47,724,977,`display:flex;justify-content:space-between;${T};font-size:8px;letter-spacing:.08em;color:#f0c591`)}"><span>MOVIE-NIGHT TRAY LINER / SERVES FOUR</span><span>FILM STILLS & POSTER: TMDB</span></div></div>`;
}

function fmtSals(f,spec,menu,poster){
  const RED='#a92b20',WALL='#b74425',CREAM='#f7e8ba',W='#fdf6e2',Y='#efbe50',INK='#2c1c16',MUTED='#75543b',L='#e2cf9e';
  const HEAD="font-family:'Bevan',serif;font-weight:400",BODY="font-family:'Libre Franklin',sans-serif",COND="font-family:'Barlow Condensed',sans-serif";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=RED,e='')=>`<div style="${COND};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const pr=['$1.50','$1.25','$1.50','75¢','$1.75'];
  const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:2px dotted ${L};padding:5px 0">
    <div style="display:flex;align-items:baseline;gap:10px"><span style="${COND};font-size:27px;line-height:1.05;font-weight:700;color:${INK};text-transform:uppercase">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',MUTED)}<span style="flex:1"></span><span style="${HEAD};font-size:20px;color:${RED}">${pr[i]}</span></div>
    ${r.it.desc?`<div style="${BODY};font-size:13.5px;line-height:1.42;color:${INK};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${BODY};font-style:italic;font-size:13px;line-height:1.35;color:${MUTED};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
  const menuCard=`<section style="position:absolute;left:24px;top:24px;width:612px;height:694px;box-sizing:border-box;background:${W};border:6px solid ${RED};box-shadow:0 12px 28px rgba(0,0,0,.45);display:flex;flex-direction:column">
    <div style="background:${RED};color:${CREAM};padding:10px 22px 12px;text-align:center">
      ${lab('Stuyvesant Ave / Bed-Stuy, Brooklyn / Free delivery',Y)}
      <div style="${HEAD};font-size:42px;line-height:1.05;margin-top:4px">SAL'S FAMOUS PIZZERIA</div>
      <div style="${COND};font-size:19px;font-weight:600;color:${CREAM};margin-top:2px">${ESC(spec.tag||'')}</div></div>
    <div style="padding:2px 22px 0;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="border-top:3px solid ${RED};margin:0 22px;padding:7px 0 9px;display:flex;justify-content:space-between;${COND};font-size:14px;font-weight:700;letter-spacing:.08em;color:${INK}"><span>EXTRA CHEESE: $2. DON'T ASK TWICE.</span><span>DELIVERED BY MOOKIE</span></div></section>`;
  const fame=['DiMaggio','Sinatra','Pacino','Loren','De Niro','Como'];
  const side=`<section style="position:absolute;left:660px;top:24px;width:387px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${HEAD};font-size:30px;line-height:1.05;color:${CREAM}">DO THE<br>RIGHT THING</div><div style="text-align:right">${lab('Brooklyn, '+f.year,Y)}<div style="${COND};font-size:16px;font-weight:600;color:${CREAM};margin-top:2px">Hottest day of the summer</div></div></div>
    <figure style="margin:0;border:5px solid ${CREAM}">${img('identity','Do the Right Thing artwork',377,186)}</figure>
    <div style="display:flex;justify-content:space-between">
      <figure style="margin:0;border:4px solid ${CREAM}">${img('counter',"Behind the counter at Sal's",182,104)}</figure>
      <figure style="margin:0;border:4px solid ${CREAM}">${img('street','The block on the hottest day',182,104)}</figure></div>
    <div style="background:${INK};padding:9px 12px 10px;border:3px solid ${Y}">${lab('Wall of Fame',Y)}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px">${fame.map(x=>`<div style="border:3px solid ${Y};background:${CREAM};padding:4px 2px;text-align:center;${COND};font-size:15px;font-weight:700;color:${INK}">${x}</div>`).join('')}</div>
      <div style="${COND};font-size:14px;font-weight:600;color:${CREAM};margin-top:6px">Buggin' Out wants to know where the brothers are.</div></div>
    <div style="border-top:1px solid #d77a5c;padding-top:8px">${lab('Serving cue',Y)}<div style="${BODY};font-size:14.5px;line-height:1.45;color:${CREAM};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${COND};font-size:12px;letter-spacing:.12em;color:#f0c6a8;margin-top:4px">WE LOVE RADIO 108 FM / FILM IMAGERY: TMDB</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${WALL};box-shadow:0 18px 40px #0008">${menuCard}${side}</div>`;
}

/* A railway-town luncheon board: fixed picture windows, café green and warm cream. */
function fmtWhistle(f,spec,menu,poster){
  const W='#3c4a32',P='#f6eedb',G='#2f5a3a',R='#a33a2a',I='#2a2620',M='#665e50',L='#d9cba8',S="font-family:'Bevan',serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const price=['10¢','15¢','25¢','10¢','5¢'];
  const row=(it,i)=>`<div style="padding:${i?12:0}px 0 12px;${i<all.length-1?`border-bottom:1px dotted ${M}`:''}">
    <div style="display:flex;align-items:baseline;gap:10px"><span style="${S};font-size:${i===2?27:23}px;line-height:1.1;color:${I}">${ESC(it.label)}</span><span style="flex:1;border-bottom:2px dotted ${L};align-self:center"></span><span style="${S};font-size:21px;color:${R}">${price[i]}</span></div>
    <div style="${B};font-size:14px;line-height:1.4;color:${I};margin-top:3px"><b style="font-size:10.5px;letter-spacing:.14em;color:${G};text-transform:uppercase">${ESC(tabs[i]||'')}</b> &nbsp;${ESC(it.desc)}</div>
    ${it.film?`<div style="${B};font-size:13px;line-height:1.35;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`;
  const card=`<section aria-label="Cafe menu card" style="${at(24,22,650,`height:698px;background:${P};box-shadow:0 8px 20px rgba(0,0,0,.5)`)}">
    <div aria-hidden="true" style="position:absolute;inset:10px;border:3px double ${G}"></div>
    <header style="${at(34,28,582,'text-align:center')}">
      <div style="${B};font-size:11px;font-weight:700;letter-spacing:.22em;color:${G}">WHISTLE STOP, ALABAMA / BY THE RAILROAD DEPOT / EST. 1929</div>
      <div style="${S};font-size:44px;line-height:1.05;color:${R};margin-top:6px">Whistle Stop Café</div>
      <div style="${B};font-size:13px;font-style:italic;color:${M};margin-top:4px">Idgie Threadgoode &amp; Ruth Jamison, proprietors. Big George on the grill.</div>
      <div style="height:3px;background:${G};margin-top:10px"></div></header>
    <div style="${at(34,148,582)}">${all.map(row).join('')}</div>
    <footer style="${at(34,640,582,`border-top:3px solid ${G};padding-top:8px;display:flex;justify-content:space-between;${B};font-size:11px;font-weight:700;letter-spacing:.08em;color:${G}`)}"><span>THE SECRET’S IN THE SAUCE</span><span>NO ONE TURNED AWAY HUNGRY</span></footer>
  </section>`;
  const right=`<div style="${at(698,22,349,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(1deg)">${img('storefront','The Whistle Stop Café storefront',337,214)}<figcaption style="${B};font-size:12px;font-style:italic;color:${I};padding:6px 2px 7px">The café, by the tracks.</figcaption></figure>
    <figure style="margin:14px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg)">${img('tomatoes','Green tomato slices frying in a skillet',337,214)}<figcaption style="${B};font-size:12px;font-style:italic;color:${I};padding:6px 2px 7px">Fried green, in cornmeal, in the iron pan.</figcaption></figure>
    <div style="margin-top:auto;background:${P};box-shadow:0 5px 14px rgba(0,0,0,.5);padding:12px 16px;border-top:6px solid ${R}">
      <div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;color:${G}">TRAIN TIMES / WHISTLE STOP DEPOT</div>
      <div style="display:flex;justify-content:space-between;${S};font-size:16px;color:${I};margin-top:5px"><span>Southbound 4:10</span><span>Northbound 6:45</span></div>
      <div style="${B};font-size:13px;line-height:1.38;color:${I};margin-top:7px"><b style="color:${R}">CUE</b> ${ESC(fmtCue(f))}</div>
      <div style="${S};font-size:20px;color:${R};margin-top:6px">TOWANDA!</div></div>
    <div style="${B};font-size:9px;letter-spacing:.1em;color:#c8cdb9;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${W};overflow:hidden;box-shadow:0 16px 40px #0006">${card}${right}</div>`;
}

function fmtTonys(f,spec,menu,poster){
  const PA='#fbf5e6',IN='#2a1d16',SO='#665548',RD='#b5252b',GN='#2f6b3a',GD='#b89140',D="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.16em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const pr=['15¢','25¢','On the house','10¢','5¢'];
  const row=(it,i)=>`<div style="padding:6px 0 6px;${i?'border-top:1px dotted '+GD:''}">
    <div style="display:flex;align-items:baseline;gap:10px"><h3 style="${D};font-size:27px;line-height:1.02;font-weight:600;margin:0;color:${IN};white-space:nowrap">${ESC(it.label)}</h3><span style="flex:1;border-bottom:2px dotted #cdb88d;transform:translateY(-6px)"></span><span style="${D};font-size:22px;font-weight:600;font-style:italic;color:${RD};white-space:nowrap">${pr[i]||''}</span></div>
    <div style="display:flex;justify-content:space-between;gap:14px;align-items:baseline">${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:3px 0 0;color:${IN}">${ESC(it.desc)}</p>`:'<span></span>'}${lab(ESC(gs[i]?gs[i].tab:''),GN,'white-space:nowrap')}</div>
    <p style="${D};font-size:17px;font-style:italic;line-height:1.2;margin:2px 0 0;color:${SO}">${ESC(it.film||'')}</p></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background-color:#fbf5e6;background-image:linear-gradient(90deg,#c7262c99 50%,#0000 50%),linear-gradient(180deg,#c7262c99 50%,#0000 50%);background-size:44px 44px;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div style="position:absolute;left:30px;top:20px;width:632px;height:702px;background:${PA};border-radius:6px;box-shadow:0 10px 26px #0006;box-sizing:border-box;padding:12px">
   <div style="height:100%;border:2px solid ${RD};border-radius:4px;box-sizing:border-box;padding:14px 28px 10px;display:flex;flex-direction:column">
    <div style="text-align:center;border-bottom:2px solid ${RD};padding-bottom:8px">
      ${lab('Ristorante italiano / Round the back, by the bins',GN)}
      <div style="${D};font-size:52px;font-weight:600;font-style:italic;line-height:.95;color:${RD};margin-top:0">Tony’s</div>
      <div style="${D};font-size:18px;font-style:italic;color:${SO};margin-top:2px">${ESC(spec.tag||'')} Joe on the mandolin, Tony on the accordion.</div>
    </div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="border-top:2px solid ${RD};padding-top:7px;text-align:center;${B};font-size:13px;line-height:1.35;color:${IN}"><span style="font-weight:700;letter-spacing:.16em;font-size:11px;color:${RD}">SHOWTIME CUE</span>&nbsp;&nbsp;${ESC(fmtCue(f))}</div>
   </div>
  </div>
  <div style="position:absolute;left:690px;top:20px;width:358px;background:${PA};box-sizing:border-box;padding:14px 16px 12px;box-shadow:0 8px 20px #0005;border-radius:4px">
    ${lab('Bella notte / 1955',RD)}
    <h1 style="${D};font-size:46px;line-height:.95;font-weight:600;margin:4px 0 0;color:${IN};text-shadow:none">Lady and the Tramp</h1>
  </div>
  <figure style="position:absolute;left:690px;top:158px;width:358px;margin:0;background:#fff;padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #0006;transform:rotate(1deg)">${img('dinner','Lady and Tramp share spaghetti behind Tony’s',344,196)}<figcaption style="${D};font-size:17px;font-style:italic;line-height:1.25;color:${IN};margin-top:6px">One strand, one kiss, the last meatball nudged over.</figcaption></figure>
  <div style="position:absolute;left:690px;top:452px;width:358px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#fff;padding:6px;box-shadow:0 10px 22px #0006;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:6px">
      <div style="width:128px;height:128px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6e3a3,${GD} 70%,#8a6a28);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 14px #0007;border:3px solid #7a5a1e">
        <div style="width:12px;height:12px;border-radius:50%;background:#fbf5e6;border:2px solid #7a5a1e;margin-bottom:6px"></div>
        <div style="${D};font-size:30px;font-weight:600;font-style:italic;color:${IN};line-height:1">Lady</div>
        <div style="${B};font-size:10px;font-weight:700;letter-spacing:.12em;color:${IN};margin-top:4px">LICENCE / 1955</div>
      </div>
      <div style="background:${PA};padding:8px 10px;box-shadow:0 6px 14px #0005;${D};font-size:17px;font-style:italic;line-height:1.2;color:${IN};text-align:center">Snob Hill guests welcome. Collars optional.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${B};font-size:9px;color:${IN};background:${PA};padding:1px 4px">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtLair(f,spec,menu,poster){
  const D='#1c2a22',WB='#f2f1ea',K='#1f2420',S='#545a55',BL='#2563b8',RD='#c8312b',OR='#e8822a',PU='#7a3fa8',GR='#3f8f3a',BR='#7a5a3a';
  const H="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(t,c=S,e='')=>`<div style="${T};font-size:11.5px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
  const who=[['Mikey',OR],['Splinter',BR],['All four',GR],['Donnie',PU],['Raph',RD]];
  const row=(x,i)=>{const big=i===2,c=who[i][1];return `<div style="display:grid;grid-template-columns:96px 1fr;column-gap:14px;padding:${big?'16px 14px 17px':'15px 0 15px'};${big?`border:3px solid ${K};margin:5px 0;background:#fff`:`border-bottom:1px dashed #b9bdb5`}"><div style="padding-top:2px"><div style="${T};font-size:10.5px;line-height:1.2;font-weight:700;letter-spacing:.08em;color:${S}">ORDERED BY</div>${big?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:5px">${[BL,RD,OR,PU].map(cc=>`<span style="height:12px;background:${cc}"></span>`).join('')}</div><div style="${B};font-size:16px;line-height:1.1;font-weight:700;color:${K};margin-top:5px">All four</div>`:`<div style="display:inline-block;margin-top:5px;background:${c};color:#fff;${B};font-size:15px;line-height:1;font-weight:700;padding:5px 8px 6px">${who[i][0]}</div>`}</div><div><div style="${H};font-size:${big?27:21}px;line-height:1.08;color:${K}">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.42;color:${S};margin-top:4px">${ESC(x.d)}</div><div style="${T};font-size:13px;line-height:1.3;font-weight:700;color:${c};margin-top:3px">${ESC(x.note||'')}</div></div></div>`;};
  const board=`<section aria-label="Lair order board" style="${at(22,22,630,'height:698px;background:'+WB+';border:10px solid #8d9690;box-sizing:border-box;box-shadow:0 12px 26px rgba(0,0,0,.55)')}"><div style="${at(24,18,562)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${K};padding-bottom:8px"><div>${lab('Lair order board / Pizza night',GR)}<div style="${H};font-size:40px;line-height:1;color:${K};margin-top:5px">COWABUNGA.</div></div><div style="display:flex;gap:5px">${[BL,RD,OR,PU].map(c=>`<span style="width:22px;height:40px;background:${c}"></span>`).join('')}</div></div>${xs.slice(0,5).map(row).join('')}<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:10px"><div style="display:flex;align-items:baseline;gap:8px">${lab('Approved:',S)}<span style="background:${BL};color:#fff;${B};font-size:14px;font-weight:700;padding:3px 7px">Leo</span>${lab('No anchovies. Ever.',K)}</div><span style="${T};font-size:9px;color:${S};letter-spacing:.06em">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</span></div></div></section>`;
  const manhole=`<div style="width:132px;height:132px;border-radius:50%;background:radial-gradient(circle,#4a524c 0 55%,#3a413c 56% 100%);border:5px solid #2b302c;box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-align:center;flex:none"><div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.12em;color:#c9d0c9">N.Y.C.</div><div style="${H};font-size:17px;line-height:1.05;color:#e3e8e3;margin-top:3px">SEWER</div><div style="${T};font-size:10.5px;font-weight:700;letter-spacing:.1em;color:#c9d0c9;margin-top:3px">KNOCK 4X</div></div></div>`;
  const side=`<aside style="${at(676,22,373,'height:698px;display:flex;flex-direction:column')}"><figure style="margin:0;border:5px solid ${WB};box-shadow:0 8px 18px rgba(0,0,0,.5)">${img('brothers','The four brothers in their underground lair',363,240)}</figure><div style="${T};font-size:12.5px;line-height:1.35;color:#dfe6df;margin-top:8px;letter-spacing:.03em">THE LAIR. HOME, SEWER, HOME.</div><div style="display:flex;gap:14px;align-items:center;margin-top:14px">${img('pizza','April and a turtle sharing pizza',227,150)}${manhole}</div><div style="${B};font-size:13px;line-height:1.4;color:#dfe6df;margin-top:8px">April O'Neil, Channel 3, gets the first slice. Casey Jones brings his own hockey stick.</div><div style="margin-top:14px;align-self:flex-start;background:#f6e27a;padding:9px 13px 10px;transform:rotate(-1.5deg);box-shadow:0 4px 10px rgba(0,0,0,.35)">${lab('Guest list',K)}<div style="${T};font-size:13.5px;line-height:1.35;color:${K};margin-top:3px">Shredder and the Foot Clan: not invited.</div></div>${FX_SP}<div style="border-top:3px solid ${GR};padding-top:10px">${lab('Cue','#8fd18a')}<div style="${B};font-size:14px;line-height:1.42;color:#eef3ee;margin-top:4px">${ESC(fmtCue(f))}</div></div><div style="${H};font-size:19px;line-height:1.2;color:#f2b04a;margin-top:12px">${ESC(spec.tag||'')}</div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};box-shadow:0 20px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%,rgba(63,143,58,.25),transparent 60%)"></div>${board}${side}</div>`;
}

function fmtGimbels(f,spec,menu,poster){
 const G='#174737',DARK='#08281e',Y='#d8b865',C='#f2eddd',W='#fbf7ec',R='#a0322d',I='#26392e',M='#6c6251',L='#d9cfb8';
 const S="font-family:'Cormorant Garamond',serif",D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const pr=['.95','1.25','2.50','1.10','Congratulations!'];
 const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px solid ${L};padding:5px 0">
   <div style="display:flex;align-items:baseline;gap:10px"><span style="${B};font-size:20px;line-height:1.1;font-weight:700;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',G)}<span style="flex:1;border-bottom:2px dotted ${L};transform:translateY(-4px)"></span><span style="${D};font-size:${i===4?15:18}px;color:${R};white-space:nowrap">${pr[i]}</span></div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.42;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${S};font-style:italic;font-size:17px;line-height:1.2;color:${M};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
 const stripe=`<div aria-hidden="true" style="height:12px;display:flex;overflow:hidden">${Array.from({length:26},(_,i)=>`<span style="flex:1;background:${i%2?C:R};transform:skewX(-35deg);margin:0 -1px"></span>`).join('')}</div>`;
 const card=`<section style="position:absolute;left:24px;top:24px;width:624px;height:694px;box-sizing:border-box;background:${W};box-shadow:0 12px 28px rgba(0,0,0,.5);display:flex;flex-direction:column">
   ${stripe}
   <div style="background:${G};color:${C};padding:12px 24px 12px;display:flex;justify-content:space-between;align-items:center">
     <div>${lab('Herald Square / New York / Holiday season',Y)}<div style="${D};font-size:44px;line-height:1;margin-top:4px;letter-spacing:-.01em">GIMBELS</div><div style="${S};font-style:italic;font-size:20px;color:${Y};margin-top:2px">Santaland lunch counter</div></div>
     <div style="background:${R};color:${C};padding:9px 12px;text-align:center;transform:rotate(4deg);border:2px dashed ${C}"><div style="${B};font-size:11px;font-weight:700;letter-spacing:.14em">SANTA!</div><div style="${D};font-size:20px;line-height:1.05">HERE<br>TOMORROW</div></div></div>
   <div style="padding:8px 24px 0;${S};font-size:19px;font-style:italic;color:${M}">${ESC(spec.tag||'')}</div>
   <div style="padding:2px 24px 0;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="margin:0 24px;border-top:2px solid ${G};padding:7px 0 9px;display:flex;justify-content:space-between;${B};font-size:11px;font-weight:700;letter-spacing:.1em;color:${M}"><span>SYRUP ON REQUEST. ON EVERYTHING.</span><span>FILM IMAGERY: TMDB</span></div>
   ${stripe}</section>`;
 const side=`<section style="position:absolute;left:672px;top:24px;width:375px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${D};font-size:64px;line-height:.9;color:${C}">ELF</div><div style="text-align:right">${lab('New York, '+f.year,Y)}<div style="${S};font-style:italic;font-size:18px;color:${C};margin-top:2px">Son of a nutcracker.</div></div></div>
   <figure style="margin:0;border:5px solid ${C}">${img('buddy','Buddy in his elf suit in New York',365,196,'center 25%')}</figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;border:4px solid ${C}">${img('display','The Gimbels Christmas display',176,104)}</figure>
     <figure style="margin:0;border:4px solid ${C}">${img('store','Inside Gimbels at Christmas',176,104)}</figure></div>
   <div style="background:${C};color:${I};padding:9px 14px 10px;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(-1deg)">${lab('The four main elf food groups',R)}
     <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:10px;margin-top:4px">${['Candy','Candy canes','Candy corn','Syrup'].map((x,i)=>`<div style="${B};font-size:14px;font-weight:600;line-height:1.5">${i+1}. ${x}</div>`).join('')}</div></div>
   <div style="border-top:1px solid #2f6650;padding-top:8px">${lab('Serving cue',Y)}<div style="${B};font-size:15px;line-height:1.45;color:${C};margin-top:3px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${DARK};box-shadow:0 18px 40px #0008">${card}${side}</div>`;
}

function fmtMoonstruck(f,spec,menu,poster){
  const P='#f7f0de',N='#14283a',I='#2a2a24',R='#9a3a2c',M='#6a6352',L='#cdbf9c',GD='#c9a85a';
  const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const qty=['2 loaves','4 eggs','4 plates','1 doz','4 glasses'];
  const row=(it,i)=>`<div style="padding:${i?9:0}px 0 9px;${i<all.length-1?`border-bottom:1px dashed ${L}`:''}">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${R}">${ESC(tabs[i]||'')}</span><span style="${T};font-size:12px;font-weight:700;color:${M}">QTY ${qty[i]}</span></div>
    <div style="${H};font-size:${i===2?31:27}px;line-height:1.02;font-weight:600;color:${I}">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${H};font-size:16px;line-height:1.25;font-style:italic;color:${M};margin-top:1px">${ESC(it.film)}</div>`:''}</div>`;
  const slip=`<section aria-label="Bakery order slip menu" style="${at(24,22,640,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.6)`)}">
    <header style="${at(32,22,576,`text-align:center;border-bottom:2px solid ${I};padding-bottom:10px`)}">
      <div style="${T};font-size:11px;font-weight:700;letter-spacing:.12em;color:${R}">BAKERY ORDER / BROOKLYN HEIGHTS / 1987</div>
      <div style="${H};font-size:42px;line-height:1;font-weight:600;color:${I};margin-top:4px">Ronny’s bread &amp; supper</div>
      <div style="${T};font-size:12px;color:${M};margin-top:5px">ORDERED BY: Loretta Castorini &nbsp;/&nbsp; DELIVER TO: the Castorini kitchen</div></header>
    <div style="${at(32,128,576)}">${all.map(row).join('')}</div>
    <footer style="${at(32,652,576,`border-top:2px solid ${I};padding-top:10px;display:flex;justify-content:space-between;align-items:center;${T};font-size:11px;color:${M}`)}"><span>MIND THE BREAD SLICER. ASK RONNY WHY.</span></footer>
    <div aria-hidden="true" style="${at(410,636,170,`border:3px solid ${R};color:${R};text-align:center;transform:rotate(-6deg);padding:2px 0;background:rgba(247,240,222,.85)`)}"><div style="${H};font-size:28px;font-weight:600;font-style:italic;line-height:1">Snap out of it!</div></div>
  </section>`;
  const right=`<div style="${at(690,22,357,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(1deg)">${img('kitchen','Loretta and Ronny in the bakery kitchen',345,196)}<figcaption style="${H};font-size:16px;font-style:italic;color:${I};padding:5px 2px 6px">Rose’s kitchen. Eggs in the hole.</figcaption></figure>
    <figure style="margin:14px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(-1deg)">${img('opera','Loretta and Ronny at the opera',345,186)}<figcaption style="${H};font-size:16px;font-style:italic;color:${I};padding:5px 2px 6px">La Bohème. She cried.</figcaption></figure>
    <div style="margin-top:auto;display:flex;background:${P};box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(1deg)">
      <div style="flex:1;padding:10px 14px;border-right:2px dashed ${L}"><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.14em;color:${R}">SERVING CUE / ADMIT TWO</div>
        <div style="${H};font-size:19px;line-height:1.2;font-weight:600;color:${I};margin-top:3px">${ESC(fmtCue(f))}</div></div>
      <div style="width:70px;padding:10px 6px;text-align:center"><div style="${T};font-size:10.5px;color:${M}">ROW</div><div style="${H};font-size:26px;font-weight:600;line-height:1;color:${I}">G</div><div style="${T};font-size:10.5px;color:${M};margin-top:4px">SEATS</div><div style="${T};font-size:12px;font-weight:700;color:${I}">2</div></div></div>
    <div style="${B};font-size:9px;letter-spacing:.1em;color:#8fa0b0;margin-top:10px;text-align:right">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${N};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;left:712px;top:510px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff6dc,#e9d9a8 60%,#cdb77c);opacity:.95"></div>
    ${slip}${right}<div style="${at(810,522,230)};${H};font-size:28px;font-style:italic;font-weight:500;color:#f3e7c4;line-height:1.1">La bella luna.<div style="${T};font-size:11px;font-style:normal;color:#a9b8c6;margin-top:4px">CUE THE BIG MOON OVER BROOKLYN</div></div></div>`;
}


function fmtKitchenFolio(f,spec,menu,poster){
  const PA='#fbf8ee',IN='#1f2230',SO='#585a63',BL='#2f5aa8',RL='#c7d6ec',RD='#c2433a',BU='#f2d77a',D="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const nh=t=>ESC(String(t||'').normalize('NFC')).replace(/[âêîôûàèìòùëïüçœ]/gi,m=>`<span style="font-family:'Times New Roman',Times,serif;font-weight:400">${m}</span>`);
  const lab=(s,c,e='')=>`<div style="${T};font-size:12px;font-weight:700;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const day=[['Day 1','001'],['Day 9','014'],['Day 61','096'],['Day 180','262'],['Day 365','524']];
  const row=(it,i)=>{const d=day[i]||day[0];return `<div style="display:grid;grid-template-columns:92px 1fr;column-gap:14px;padding:16px 0 15px;border-bottom:1px solid ${RL}">
    <div><div style="${T};font-size:15px;font-weight:700;color:${RD}">${d[0]}</div><div style="${T};font-size:12px;color:${SO};margin-top:3px">No. ${d[1]}/524</div></div>
    <div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><h3 style="${D};font-size:26px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${nh(it.label)}</h3>${lab(ESC(gs[i]?gs[i].tab:''),BL,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:3px 0 0;color:${IN}">${nh(it.desc).replace(/<span style="font-family:'Times New Roman',Times,serif;font-weight:400">(.)<\/span>/g,'$1')}</p>`:''}<p style="${D};font-size:17px;font-style:italic;font-weight:500;line-height:1.2;margin:2px 0 0;color:${BL}">${nh(it.film)}</p></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(135deg,#d9e4e0,#b9cfc9);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background-image:linear-gradient(90deg,#ffffff55 1px,#0000 1px),linear-gradient(180deg,#ffffff55 1px,#0000 1px);background-size:36px 36px"></div>
  <div style="position:absolute;left:24px;top:22px;width:640px;height:702px;background:${PA};box-shadow:0 10px 24px #0004;box-sizing:border-box;padding:30px 26px 10px 30px;display:flex;flex-direction:column">
    <div aria-hidden="true" style="position:absolute;left:24px;right:24px;top:-12px;height:26px;display:flex;justify-content:space-between">${'<i style="width:14px;height:26px;border-radius:7px;background:linear-gradient(90deg,#8d939c,#e3e6ea,#8d939c)"></i>'.repeat(19)}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${IN};padding-bottom:6px">
      <div>${lab('The Julie/Julia Project / Queens',RD)}<div style="${D};font-size:40px;font-weight:600;line-height:1;color:${IN};margin-top:4px">${ESC(spec.brand||'The dinner project')}</div></div>
      <div style="${T};font-size:13px;line-height:1.45;color:${IN};text-align:right">524 recipes<br>365 days</div>
    </div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${T};font-size:11px;color:${SO};margin-top:5px">Note to self: do not fall asleep with the bourguignon in. Buy more butter.</div>
  </div>
  <header style="position:absolute;left:692px;top:22px;width:356px">
    ${lab('Paris 1949 / Queens 2002','#2f5a5a')}
    <h1 style="${D};font-size:58px;line-height:.92;font-weight:600;letter-spacing:-.02em;margin:6px 0 0;color:${IN};text-shadow:none">Julie &amp; Julia</h1>
    <div style="${D};font-size:20px;font-style:italic;font-weight:500;line-height:1.2;color:#2f4a6a;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:692px;top:178px;width:356px;margin:0;background:#fff;padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #0004;transform:rotate(1deg)">${img('julia','Julia Child in her Paris kitchen',342,192)}<figcaption style="${D};font-size:17px;font-style:italic;font-weight:500;line-height:1.25;color:${IN};margin-top:6px">Paris. Julia, her kitchen and a mountain of onions.</figcaption></figure>
  <div style="position:absolute;left:692px;top:462px;width:356px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#fff;padding:6px;box-shadow:0 10px 22px #0004;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px;margin-top:6px">
      <div style="background:${BU};border-radius:4px;padding:10px 12px;box-shadow:0 6px 12px #0003;transform:rotate(2deg)">
        ${lab('Unsalted / 250 g',IN)}
        <div style="${D};font-size:26px;font-weight:600;line-height:1;color:${IN};margin-top:4px">More butter.</div>
        <div style="${B};font-size:12px;color:${IN};margin-top:3px">Julia’s answer to most things.</div>
      </div>
      <div style="border:3px solid ${RD};padding:7px 8px;text-align:center;transform:rotate(-3deg)">
        <div style="${D};font-size:26px;font-weight:600;font-style:italic;color:${RD};line-height:1">Bon app<span style="font-family:'Times New Roman',Times,serif">é</span>tit!</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#3e5a57">FILM IMAGERY: TMDB</div>
  </div>`;
}


/* Cocoa-paper presentation box, with the real shop and Armande's table in its lining. */
function fmtChocolaterie(f,spec,menu,poster){
  const BOX='#2a1810',CH='#4a2a1a',P='#f6ecdb',K='#2a1810',R='#a3271f',GD='#c9a15a',S='#6a5242',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(t,c=R,e='')=>`<div style="${B};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
  const shapes=[`border-radius:50%;background:radial-gradient(circle at 35% 30%,#7a4a2c,#3a2012)`,`border-radius:50%;background:radial-gradient(circle at 35% 30%,#8b5a35,#4a2a1a);box-shadow:inset 0 0 0 4px #c9a15a`,`border-radius:8px;background:linear-gradient(135deg,#6e3d22,#2e180c);transform:rotate(45deg) scale(.78)`,`border-radius:50% 50% 8px 8px;background:radial-gradient(circle at 40% 30%,#9a6a45,#4a2a1a)`,`border-radius:50%;background:radial-gradient(circle at 35% 30%,#b23a2c,#5a1410)`];
  const fr=['3 F','4 F','59 F','5 F','6 F'],tag=['The old Maya recipe','The shop window','For Armande, on her birthday','During Lent','The village table'];
  const item=(x,i)=>{const big=i===2;return `<div style="display:grid;grid-template-columns:${big?'54px':'38px'} 1fr;column-gap:${big?16:12}px;align-items:start;padding:${big?'20px 18px 20px':'17px 0 17px'};${big?`background:#efe0c4;margin:4px 0;border-left:4px solid ${R}`:`border-bottom:1px solid #e0cdb0`}"><div style="width:${big?50:36}px;height:${big?50:36}px;margin-top:${big?4:2}px;${shapes[i]}"></div><div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">${lab(tag[i],big?R:S,'font-size:10.5px')}<span style="${H};font-size:${big?24:20}px;line-height:1;font-weight:600;color:${K};white-space:nowrap">${fr[i]}</span></div><div style="${H};font-size:${big?34:27}px;line-height:1.02;font-weight:600;color:${K};margin-top:3px">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.42;color:${S};margin-top:4px">${ESC(x.d)}</div><div style="${H};font-size:16.5px;line-height:1.2;font-style:italic;color:${R};margin-top:2px">${ESC(x.note||'')}</div></div></div>`;};
  const lid=`<section style="${at(22,22,346,'height:698px;background:'+CH+';box-shadow:0 12px 28px rgba(0,0,0,.6);display:flex;flex-direction:column;box-sizing:border-box;padding:26px 26px 22px')}"><div style="border:1px solid ${GD};padding:4px"><div style="border:2px solid ${GD};padding:14px 12px 12px;text-align:center">${lab('Lansquenet-sous-Tannes / 1959',GD)}<div style="${H};font-size:40px;line-height:.95;font-weight:600;font-style:italic;color:${P};margin-top:8px">Chocolaterie Maya</div><div style="${H};font-size:18px;line-height:1.2;font-style:italic;color:${GD};margin-top:6px">${ESC(spec.tag||'')}</div></div></div><figure style="margin:16px 0 0;border:5px solid ${P}">${img('shop','Vianne beside the Chocolaterie Maya sign outside her shop',284,186,'center 30%')}</figure><div style="${B};font-size:12.5px;line-height:1.4;color:#e6d6bf;margin-top:8px">Vianne and Anouk open the shop at the start of Lent. Pantoufle the kangaroo is welcome too.</div><div style="display:grid;grid-template-columns:120px 1fr;gap:12px;margin-top:14px;align-items:start">${img('armande','Armande enjoying a cup in the shop',120,96)}<div>${lab('Tell me your favourite',GD)}<div style="${H};font-size:18px;line-height:1.2;font-style:italic;color:${P};margin-top:4px">Vianne will guess it. She always does.</div></div></div>${FX_SP}<div style="border-top:1px solid ${GD};padding-top:9px">${lab('Cue',GD)}<div style="${B};font-size:14px;line-height:1.42;color:${P};margin-top:4px">${ESC(fmtCue(f))}</div></div></section>`;
  const guide=`<section aria-label="Box guide" style="${at(382,22,667,'height:698px;background:'+P+';box-shadow:0 12px 28px rgba(0,0,0,.6)')}"><div style="${at(30,24,607)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${K};padding-bottom:8px"><div>${lab('Inside the lid / Box guide')}<div style="${H};font-size:32px;line-height:1.05;font-weight:600;color:${K};margin-top:4px">A box for the table</div></div>${lab('Prix en francs',S)}</div><div style="display:grid;grid-template-columns:1fr 1fr;column-gap:22px">${item(xs[0],0)}${item(xs[1],1)}</div>${item(xs[2],2)}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:22px">${item(xs[3],3)}${item(xs[4],4)}</div></div><div style="${at(30,664,607,'display:flex;justify-content:space-between;align-items:baseline')}">${lab('If the Comte is asleep in the window, let him sleep.',K,'font-size:10.5px;letter-spacing:.1em')}<span style="${B};font-size:9px;letter-spacing:.08em;color:${S}">FILM IMAGERY: TMDB</span></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${BOX};box-shadow:0 18px 45px rgba(0,0,0,.5)">${lid}${guide}</div>`;
}


function fmtCorleone(f,spec,menu,poster){
  const K='#181511',P='#f0e7d0',W='#f5eedb',I='#302d25',M='#6a6050',R='#733b32',O='#5b6630',L='#cdbf9e';
  const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const qty=['1 tray','2 doz.','1 pot','1 box','4'],pr=['$1.20','90¢','$2.50','75¢','40¢'];
  const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:70px 1fr 64px;column-gap:14px;align-items:center;border-top:1px solid ${L};padding:5px 0">
    <div style="${T};font-size:14px;font-weight:700;color:${I}">${qty[i]}</div>
    <div><div style="display:flex;align-items:baseline;gap:9px"><span style="${H};font-size:25px;line-height:1.05;font-weight:600;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',O)}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.42;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:16.5px;line-height:1.25;color:${M};margin-top:1px">${ESC(r.it.film)}${i===3?' Leave the gun.':''}</div>`:''}</div>
    <div style="${T};font-size:16px;font-weight:700;color:${R};text-align:right">${pr[i]}</div></div>`;
  const sheet=`<section style="position:absolute;left:24px;top:24px;width:640px;height:694px;box-sizing:border-box;background:${W};box-shadow:0 12px 28px rgba(0,0,0,.6);padding:18px 26px 12px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px double ${I};padding-bottom:9px">
      <div>${lab('Importers / Little Italy / New York',O)}
        <div style="${H};font-size:44px;line-height:1;font-weight:600;color:${I};margin-top:3px">Genco Pura <span style="font-style:italic;font-weight:500;color:${O}">Olive Oil Co.</span></div>
        <div style="${B};font-size:13px;color:${M};margin-top:3px">V. Corleone, President. Order for the family table.</div></div>
      <div style="text-align:right;border:2px solid ${R};padding:5px 10px;transform:rotate(3deg)">${lab('Invoice',R)}<div style="${T};font-size:20px;font-weight:700;color:${R}">No. 1945</div></div></div>
    <div style="display:grid;grid-template-columns:1.3fr 1fr;border-bottom:1px solid ${I};padding:6px 0">
      <div>${lab('Deliver to',M)}<div style="${T};font-size:14px;font-weight:700;color:${I};margin-top:1px">THE COMPOUND, LONG BEACH, L.I.</div></div>
      <div>${lab('Occasion',M)}<div style="${T};font-size:14px;font-weight:700;color:${I};margin-top:1px">CONNIE'S WEDDING, 1945</div></div></div>
    <div style="display:grid;grid-template-columns:70px 1fr 64px;column-gap:14px;padding:6px 0 3px">${lab('Qty',M)}${lab('Goods',M)}${lab('Price',M,'text-align:right')}</div>
    <div style="flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="border-top:3px double ${I};padding-top:7px;display:flex;justify-content:space-between;align-items:baseline">
      <span style="${T};font-size:12px;font-weight:700;color:${M}">TERMS: AN OFFER YOU CAN'T REFUSE.</span><span style="${T};font-size:12px;font-weight:700;color:${M}">CARRIER: NOT LUCA BRASI.</span></div></section>`;
  const side=`<section style="position:absolute;left:688px;top:24px;width:359px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${H};font-size:44px;line-height:.95;font-weight:600;color:${P}">The Godfather</div><div style="${H};font-style:italic;font-size:19px;color:#b8a583;margin-top:4px">${ESC(spec.tag||'')}</div></div>
    <figure style="margin:0;border:5px solid ${P}">${img('identity','The Godfather title artwork',349,196)}</figure>
    <div style="display:flex;justify-content:space-between">
      <figure style="margin:0;border:4px solid ${P}">${img('wedding',"Connie's wedding on the Corleone lawn",167,102)}</figure>
      <figure style="margin:0;border:4px solid ${P}">${img('office',"Don Corleone in his office",167,102)}</figure></div>
    <div style="background:#e9dfc2;color:${I};padding:9px 14px 10px;box-shadow:0 5px 12px rgba(0,0,0,.4);transform:rotate(-1deg)">${lab("Clemenza's note",R)}<div style="${H};font-size:19px;font-style:italic;font-weight:500;line-height:1.25;margin-top:3px">Start with a little oil. Garlic, tomatoes, a splash of wine, a pinch of sugar. Feeds twenty men.</div></div>
    <div style="border-top:1px solid #4a4237;padding-top:8px">${lab('Serving cue','#b8a583')}<div style="${B};font-size:15px;line-height:1.45;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${B};font-size:10px;letter-spacing:.14em;color:#8f8676;margin-top:5px">FILM IMAGERY: TMDB</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 18px 40px #0008">${sheet}${side}</div>`;
}


function fmtRoadtrip(f,spec,menu,poster){
  const K='#2c5d4f',P='#f6efd9',I='#24282a',M='#5d605a',R='#d4402f',Y='#f2c230',BL='#3b78a8',S="font-family:'Bevan',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const miles=['MILE 0','MILE 212','MILE 640','MILE 1,140','MILE 2,476'],stop=['Driveway, Spoonerville','Lester’s Possum Park','Campsite, by the lake','Bigfoot country','Los Angeles, CA'];
  const row=(it,i)=>`<div style="position:relative;padding:0 0 ${i<all.length-1?11:0}px 58px">
    <div style="position:absolute;left:4px;top:2px;width:34px;height:34px;border-radius:50%;background:${i===4?R:Y};border:3px solid ${I};box-sizing:border-box;text-align:center;${S};font-size:16px;line-height:28px;color:${I}">${i+1}</div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;${T};font-size:11px;font-weight:700;letter-spacing:.06em;color:${BL}"><span>${miles[i]} / ${ESC(stop[i]).toUpperCase()}</span><span style="color:${M}">${ESC((tabs[i]||'').toUpperCase())}</span></div>
    <div style="${S};font-size:${i===2?25:21}px;line-height:1.1;color:${I};margin-top:2px">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:3px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`;
  const sheet=`<section aria-label="Road trip planner menu" style="${at(24,22,652,`height:698px;background:${P};box-shadow:0 8px 20px rgba(0,0,0,.5)`)}">
    <div aria-hidden="true" style="position:absolute;left:0;right:0;top:0;height:14px;display:flex"><i style="flex:1;background:${R}"></i><i style="flex:1;background:${Y}"></i><i style="flex:1;background:${BL}"></i></div>
    <header style="${at(30,30,592,`border-bottom:3px solid ${I};padding-bottom:10px`)}">
      <div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${R}">ROAD ATLAS TRIP PLANNER / FATHER AND SON / 1995</div>
      <div style="display:flex;align-items:baseline;gap:14px;margin-top:4px;flex-wrap:wrap"><span style="${S};font-size:30px;color:${M};position:relative">Lake Destiny, Idaho<span aria-hidden="true" style="position:absolute;left:-4px;right:-4px;top:52%;height:4px;background:${R};transform:rotate(-2deg)"></span></span><span style="${S};font-size:30px;color:${R};transform:rotate(-2deg);display:inline-block">L.A.!</span></div>
      <div style="${T};font-size:12px;color:${M};margin-top:4px">Route changed by: Max. Do not tell Dad.</div></header>
    <div aria-hidden="true" style="position:absolute;left:51px;top:158px;height:440px;border-left:4px dashed ${I}"></div>
    <div style="${at(30,152,592)}">${all.map(row).join('')}</div>
    <footer style="${at(30,644,592,`border-top:3px solid ${I};padding-top:8px;display:flex;gap:12px;align-items:baseline`)}"><span style="${T};font-size:11px;font-weight:700;color:${R};white-space:nowrap">TRIP CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span></footer>
  </section>`;
  const right=`<div style="${at(700,22,347,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(1deg);padding-bottom:7px">${img('concert','Goofy, Max and Powerline on the concert stage',335,206)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 0 0">Final stop. The Powerline stage, L.A.</figcaption></figure>
    <figure style="margin:14px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(-1.2deg)">${img('map','Goofy and Max with the road map in the car',335,236)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">Navigator: Max. Map: slightly edited.</figcaption></figure>
    <div style="margin-top:auto;background:${Y};padding:12px 16px;box-shadow:0 5px 14px rgba(0,0,0,.45);transform:rotate(1.2deg);border:3px dashed ${I}">
      <div style="${T};font-size:11px;font-weight:700;color:${I}">ADMIT ONE / LESTER’S POSSUM PARK</div>
      <div style="${S};font-size:22px;line-height:1.15;color:${I};margin-top:4px">Do the Perfect Cast. Then eat.</div>
      <div style="${B};font-size:13px;line-height:1.35;color:${I};margin-top:5px">${ESC(spec.tag||'')}</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#c7dccf;margin-top:10px;text-align:right">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${K};overflow:hidden;box-shadow:0 16px 40px #0006">${sheet}${right}</div>`;
}

/* A bound dinner-party notebook, illustrated entirely with frames from the 1988 film. */
function fmtMaitland(f,spec,menu,poster){
  const PA='#efeadb',IN='#1b1a17',SO='#57534a',GN='#4f7d3a',PU='#5b3a78',OR='#d3692a',D="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${T};font-size:12px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const sec=['§ 1.1','§ 1.2','§ 2','§ 3','§ 4'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:58px 1fr;column-gap:12px;padding:12px 0 11px;border-top:1px solid #cfc6ad">
    <div style="${D};font-size:22px;font-weight:600;color:${PU};line-height:1;padding-top:3px">${sec[i]||''}</div>
    <div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><h3 style="${D};font-size:25px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].tab:''),GN,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:3px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${PU}">${ESC(it.film||'')}</p></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#2b2433;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%,#6a8f4a55,#0000 50%),radial-gradient(ellipse at 20% 100%,#5b3a7877,#0000 55%)"></div>
  <div style="position:absolute;left:22px;top:16px;width:652px;height:710px;background:#141414;box-shadow:0 12px 28px #000c;padding:12px;box-sizing:border-box"><i aria-hidden="true" style="position:absolute;left:12px;right:12px;top:0;height:12px;background-image:linear-gradient(90deg,#141414 50%,#f3f0e6 50%);background-size:26px 100%"></i><i aria-hidden="true" style="position:absolute;left:12px;right:12px;bottom:0;height:12px;background-image:linear-gradient(90deg,#141414 50%,#f3f0e6 50%);background-size:26px 100%"></i>
   <div style="height:100%;background:${PA};box-sizing:border-box;padding:14px 26px 10px;display:flex;flex-direction:column">
    <div style="text-align:center;border-bottom:2px solid ${IN};padding-bottom:8px">
      ${lab('Handbook for the Recently Deceased / Chapter 9',GN)}
      <div style="${D};font-size:36px;font-weight:600;line-height:1;color:${IN};margin-top:5px">On Hosting a Dinner Party</div>
      <div style="${D};font-size:17px;font-style:italic;color:${SO};margin-top:3px">For the living who moved into your house. Read it. Do not say his name.</div>
    </div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline;border-top:2px solid ${IN};padding-top:7px">${lab('Showtime cue',OR,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${T};font-size:10px;color:${SO};margin-top:4px">Live people ignore the strange and unusual. Stay clear of the sandworms.</div>
   </div>
  </div>
  <header style="position:absolute;left:702px;top:22px;width:346px">
    ${lab('Winter River / 1988','#b9d79c')}
    <h1 style="${D};font-size:64px;line-height:.9;font-weight:600;letter-spacing:-.02em;margin:6px 0 0;color:#efeadb;text-shadow:none">Beetlejuice</h1>
    <div style="${D};font-size:21px;font-style:italic;color:#d4c3e6;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:702px;top:150px;width:346px;margin:0;background:#f3f0e6;padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000c;transform:rotate(-1deg)">${img('dinner','The Deetz dinner party, mid song',332,196)}<figcaption style="${D};font-size:17px;font-style:italic;line-height:1.25;color:${IN};margin-top:6px">The Deetz dinner party, moments before the guests start singing.</figcaption></figure>
  <div style="position:absolute;left:702px;top:448px;width:346px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#f3f0e6;padding:6px;box-shadow:0 10px 22px #000c;transform:rotate(1.4deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;margin-top:6px;display:flex;flex-direction:column;gap:12px">
      <div style="background:#f3e9a6;border:2px dashed ${IN};padding:9px 10px;text-align:center;box-shadow:0 6px 14px #0009;transform:rotate(-2deg)">
        ${lab('Afterlife waiting room',IN)}
        <div style="${D};font-size:20px;font-weight:600;color:${IN};margin-top:4px">Take a number</div>
        <div style="${T};font-size:30px;font-weight:700;color:${OR};line-height:1.1">9,000,001</div>
        <div style="${B};font-size:12px;color:${SO};margin-top:2px">Caseworker: Juno</div>
      </div>
      <div style="${B};font-size:13px;line-height:1.35;color:#e7def0">Shrimp cocktail is served. Keep your hands clear of it.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#b8afc4">FILM IMAGERY: TMDB</div>
  </div>`;
}

function fmtCorleoneII(f,spec,menu,poster){
  const P='#efe2c3',N='#123130',I='#2f2a21',G='#d3bc83',R='#7a3a26',M='#6a5d45',PL='#e7f0e8';
  const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(t,c=R,e='')=>`<div style="${T};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.1em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
  const dish=(x,kick,dark,big)=>`<div style="padding:13px 0 14px;border-top:1px solid ${dark?'#36524f':'#cdb98f'}">${lab(kick,dark?G:R)}<div style="${H};font-size:${big?33:26}px;line-height:1.02;font-weight:600;color:${dark?PL:I};margin-top:4px">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.42;color:${dark?'#c9d8d2':M};margin-top:4px">${ESC(x.d)}</div><div style="${H};font-size:16.5px;line-height:1.2;font-style:italic;color:${dark?G:R};margin-top:2px">${ESC(x.note||'')}</div></div>`;
  const top=`<header style="${at(0,0,1071,'height:78px;background:#0b1a1a;display:flex;align-items:center;justify-content:space-between;padding:0 30px;box-sizing:border-box')}"><div style="${H};font-size:36px;line-height:1;font-weight:600;letter-spacing:.06em;color:${P}">THE GODFATHER <i style="font-weight:500;color:${G}">Part II</i></div><div style="text-align:right">${lab('A supper in two eras / 1974',G)}<div style="${H};font-size:18px;line-height:1.2;font-style:italic;color:${P};margin-top:3px">${ESC(spec.tag||'')}</div></div></header>`;
  const left=`<section aria-label="Little Italy" style="${at(0,78,536,'height:664px;background:'+P)}"><div style="${at(28,20,480)}"><div style="display:flex;justify-content:space-between;align-items:baseline">${lab('Genco Pura Olive Oil Co. / Importers')}${lab('Little Italy, 1917',I)}</div><figure style="margin:12px 0 0;border:1px solid #cdb98f;padding:6px;background:#f7eedb">${img('feast','The decorated streets of Little Italy during the feast',466,252)}<figcaption style="display:flex;justify-content:space-between;margin-top:6px">${lab('The festa. Fanucci in the white suit.',I,'font-size:10.5px')}${lab('Wet the beak: $100',R,'font-size:10.5px')}</figcaption></figure><div style="margin-top:12px">${dish(xs[0],'For the festa')}${dish(xs[2],'At the tenement table',0,1)}</div></div><div style="${at(28,620,480,'display:flex;justify-content:space-between;border-top:2px solid '+I+';padding-top:7px')}">${lab('Vito Andolini, Corleone. Ellis Island, 1901.',I,'font-size:10.5px')}<span style="${T};font-size:9px;color:${M};letter-spacing:.06em">FILM IMAGERY: TMDB</span></div></section>`;
  const right=`<section aria-label="Havana" style="${at(536,78,535,'height:664px;background:'+N)}"><div style="${at(26,20,481)}"><div style="display:flex;justify-content:space-between;align-items:baseline">${lab('Presidential Palace / New Year’s Eve',G)}${lab('Havana, 1958',PL)}</div><div style="display:grid;grid-template-columns:200px 1fr;column-gap:16px;margin-top:12px;align-items:start"><figure style="margin:0;border:4px solid ${G}">${img('cake','Hyman Roth’s birthday cake iced with a map of Cuba',192,140)}</figure><div>${lab('Happy birthday, Hyman',G)}<div style="${H};font-size:19px;line-height:1.25;font-style:italic;color:${PL};margin-top:5px">Cut the cake. Everybody gets a piece of Cuba.</div></div></div><div style="margin-top:10px">${dish(xs[1],'A taste of the trip',1)}${dish(xs[3],'The birthday table',1)}${dish(xs[4],'Midnight',1)}</div></div><div style="${at(26,582,481,'border-top:2px solid '+G+';padding-top:8px')}">${lab('Cue',G)}<div style="${B};font-size:14px;line-height:1.4;color:${PL};margin-top:4px">${ESC(fmtCue(f))}</div><div style="${T};font-size:10.5px;letter-spacing:.06em;color:${G};margin-top:6px">FREDO: NO SEAT TONIGHT. HE KNOWS WHY.</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};${B};box-shadow:0 18px 45px rgba(0,0,0,.5)">${top}${left}${right}<div aria-hidden="true" style="${at(533,78,6,'height:664px;background:'+G)}"></div></div>`;
}


function fmtBippy(f,spec,menu,poster){
  const W='#2d201a',P='#edddb8',R='#452527',G='#a88c51',M='#c7b798',CB='#2c3a33',CH='#efe8d6',CY='#e8d27a',CP='#e3a3a0',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=CY,e='')=>`<div style="${B};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const pr=['.35','.25','1.25','.40','.30'];
  const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px dashed #6b7a72;padding:5px 0">
    <div style="display:flex;align-items:baseline;gap:10px"><span style="${H};font-size:27px;line-height:1.05;font-weight:600;color:${CH}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',CP)}<span style="flex:1"></span><span style="${H};font-size:26px;font-weight:600;color:${CY}">${pr[i]}</span></div>
    ${r.it.desc?`<div style="${B};font-size:14px;line-height:1.45;color:#ddd6c4;margin-top:2px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:17px;line-height:1.25;color:#b9c4bb;margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
  const board=`<section style="position:absolute;left:24px;top:24px;width:624px;height:694px;box-sizing:border-box;background:#6b4a33;padding:13px;box-shadow:0 12px 28px rgba(0,0,0,.55)">
   <div style="height:100%;box-sizing:border-box;background:linear-gradient(160deg,#3a4a41,${CB} 60%);padding:16px 26px 12px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${CH};padding-bottom:8px">
      <div>${lab('Belmont Ave / The Bronx / 1960')}<div style="${H};font-size:52px;line-height:1;font-weight:600;font-style:italic;color:${CH};margin-top:2px">Chez Bippy</div></div>
      <div style="text-align:right;${H};font-style:italic;font-size:20px;line-height:1.2;color:${CP}">${ESC(spec.brand||'')}.<br><span style="color:${CH}">Today's board.</span></div></div>
    <div style="flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="border-top:2px solid ${CH};padding-top:7px;display:flex;justify-content:space-between;${T};font-size:12px;font-weight:700;color:${CY}"><span>EDDIE MUSH DOES NOT TOUCH THE DICE.</span><span>NO TAB FOR C.</span></div></div></section>`;
  const side=`<section style="position:absolute;left:672px;top:24px;width:375px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${H};font-size:44px;line-height:.95;font-weight:600;color:${P}">A Bronx Tale</div><div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:4px">${ESC(spec.tag||'')}</div></div>
    <figure style="margin:0;border:5px solid ${P}">${img('identity','A Bronx Tale artwork',365,190)}</figure>
    <div style="display:flex;justify-content:space-between">
      <figure style="margin:0;border:4px solid ${P}">${img('bar','Sonny and his crew at the bar',176,104)}</figure>
      <figure style="margin:0;border:4px solid ${P}">${img('bus','Lorenzo behind the wheel of his bus',176,104)}</figure></div>
    <div style="background:${P};color:${R};padding:9px 14px 10px;transform:rotate(1deg);box-shadow:0 5px 12px rgba(0,0,0,.4)">${lab("Sonny's rules",'#8a3a2c')}
      <div style="${B};font-size:14px;line-height:1.45;margin-top:3px">1. Lock the car door. See if she reaches over.<br>2. Nobody cares. Live your life.<br>3. Don't waste your talent.</div></div>
    <div style="border-top:1px solid #5a463a;padding-top:8px">${lab('Serving cue',G)}<div style="${B};font-size:15px;line-height:1.45;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${B};font-size:10px;letter-spacing:.14em;color:#9b8c76;margin-top:5px">FILM IMAGERY: TMDB</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${W};box-shadow:0 18px 40px #0008">${board}${side}</div>`;
}


/* A Tangiers supper-club card: dark lacquer, warm metal print and the real casino beyond. */
function fmtTangiers(f,spec,menu,poster){
  const K='#1a1012',P='#fbf5e8',R='#9e1f2c',GD='#c49a45',I='#231c1c',M='#6a5e58',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const val=['25','25','100','10','5'];
  const chip=(v,c,s=46)=>`<div style="width:${s}px;height:${s}px;border-radius:50%;background:${c};border:4px dashed #fff;box-sizing:border-box;flex:none;position:relative"><div style="position:absolute;inset:6px;border-radius:50%;background:${P};text-align:center;${B};font-size:${s>50?16:12}px;font-weight:700;line-height:${s-20}px;color:${c}">${v}</div></div>`;
  const cc=['#2f6b3a','#2f6b3a',I,'#2a4f8f',R];
  const row=(it,i)=>`<div style="display:flex;gap:16px;padding:${i?9:0}px 0 9px;${i<all.length-1?'border-bottom:1px solid #e1d3b5':''}">
    ${chip(val[i],cc[i])}
    <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${R}">${ESC(tabs[i]||'')}</span><span style="${T};font-size:11px;color:${M}">COMP VALUE $${val[i]}</span></div>
    <div style="${H};font-size:${i===2?30:26}px;line-height:1.03;font-weight:600;color:${I}">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${H};font-size:16px;line-height:1.25;font-style:italic;color:${M};margin-top:1px">${ESC(it.film)}</div>`:''}</div></div>`;
  const card=`<section aria-label="Casino comp card menu" style="${at(24,22,652,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.7);border-top:10px solid ${R}`)}">
    <header style="${at(32,18,588,`border-bottom:2px solid ${GD};padding-bottom:9px;display:flex;justify-content:space-between;align-items:flex-end`)}">
      <div><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.2em;color:${GD}">TANGIERS HOTEL &amp; CASINO / LAS VEGAS / 1973</div><div style="${H};font-size:42px;line-height:1;font-weight:600;color:${I};margin-top:4px;white-space:nowrap">On the house</div></div>
      <div style="${T};font-size:11px;line-height:1.45;text-align:right;color:${M}">COMP NO. 0773<br>AUTHORIZED: S. ROTHSTEIN<br>GUEST: HIGH ROLLER</div></header>
    <div style="${at(32,112,588)}">${all.map(row).join('')}</div>
    <footer style="${at(32,636,588,`border-top:2px solid ${GD};padding-top:8px;display:flex;justify-content:space-between;${T};font-size:11px;color:${M}`)}"><span>NOT VALID IN THE COUNT ROOM</span><span>NO CHEATERS. NO EXCEPTIONS.</span></footer>
  </section>`;
  const right=`<div style="${at(700,22,347,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;border:2px solid ${GD};padding:4px">${img('sign','The Tangiers sign lit up at night',335,214)}</figure>
    <figure style="margin:12px 0 0;border:2px solid ${GD};padding:4px">${img('ace','Ace Rothstein at the Tangiers',335,214,'center 30%')}</figure>
    <div style="margin-top:14px;flex:1;background:#fff;padding:12px 16px;box-sizing:border-box;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg);display:flex;flex-direction:column">
      <div style="${T};font-size:11px;font-weight:700;color:${R}">MEMO TO KITCHEN / FROM: ACE</div>
      <div style="${H};font-size:22px;line-height:1.15;font-weight:600;color:${I};margin-top:4px">${ESC(spec.tag||'')} I don't care how long it takes.</div>
      <div style="${B};font-size:13px;line-height:1.35;color:${I};margin-top:auto"><b style="color:${R}">CUE</b> ${ESC(fmtCue(f))}</div></div>
    <div style="${B};font-size:9px;letter-spacing:.1em;color:#8c7c74;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${K};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 75% 20%,rgba(196,154,69,.22),transparent 60%)"></div>${card}${right}</div>`;
}

function fmtPalermo(f,spec,menu,poster){
  const PA='#f5eedd',IN='#231a14',SO='#5f5244',RD='#8a1c1c',GD='#b08a3e',D="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const nh=t=>ESC(String(t||'').normalize('NFC')).replace(/[âêîôûàèìòùëïüç]/gi,m=>`<span style="font-family:'Times New Roman',Times,serif;font-weight:400">${m}</span>`);
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:600;line-height:1.3;letter-spacing:.18em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const parts=['Preludio','Siciliana','Scena prima','Intermezzo','Finale'];
  const row=(it,i)=>`<div style="text-align:center;padding:7px 0 6px;${i?'border-top:1px solid #d9caa8':''}">
    ${lab(parts[i]+' / '+ESC(gs[i]?gs[i].tab:''),GD)}
    <h3 style="${D};font-size:25px;line-height:1.02;font-weight:600;margin:2px 0 0;color:${IN}">${nh(it.label)}</h3>
    ${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:3px auto 0;max-width:470px;color:${IN}">${ESC(it.desc)}</p>`:''}
    <p style="${D};font-size:16px;font-style:italic;line-height:1.25;margin:2px 0 0;color:${RD}">${nh(it.film)}</p></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:radial-gradient(ellipse at 70% 20%,#6d1418,#3a0b0d 60%,#1c0506);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#00000022 0 18px,#ffffff06 18px 36px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:620px;height:706px;background:${PA};box-shadow:0 12px 28px #000c;box-sizing:border-box;padding:10px">
   <div style="height:100%;border:2px solid ${GD};box-sizing:border-box;padding:16px 30px 12px;display:flex;flex-direction:column">
    <div style="text-align:center;border-bottom:1px solid ${GD};padding-bottom:9px">
      ${lab('Teatro Massimo / Palermo / Stagione 1979',RD)}
      <div style="${D};font-size:42px;font-weight:600;line-height:1;color:${IN};margin-top:5px">Cavalleria Rusticana</div>
      <div style="${D};font-size:18px;font-style:italic;color:${SO};margin-top:3px">Debut of Anthony Corleone as Turiddu. Supper served in the boxes.</div>
    </div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="border-top:1px solid ${GD};padding-top:7px;text-align:center;${B};font-size:13px;line-height:1.35;color:${IN}"><span style="font-weight:600;letter-spacing:.18em;font-size:11px;color:${RD}">SHOWTIME CUE</span>&nbsp;&nbsp;${ESC(fmtCue(f))}</div>
   </div>
  </div>
  <header style="position:absolute;left:676px;top:22px;width:372px">
    ${lab('Sicily / 1990','#e7c98a')}
    <h1 style="${D};font-size:50px;line-height:.95;font-weight:600;letter-spacing:-.01em;margin:6px 0 0;color:#f5eedd;text-shadow:none">The Godfather Part III</h1>
    <div style="${D};font-size:21px;font-style:italic;color:#e7c98a;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:676px;top:186px;width:372px;margin:0;background:${PA};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000c;transform:rotate(-.8deg)">${img('opera','The Corleones in their box at the opera',358,200)}<figcaption style="${D};font-size:17px;font-style:italic;line-height:1.25;color:${IN};margin-top:6px">The family box, opening night. Eyes on the stage.</figcaption></figure>
  <div style="position:absolute;left:676px;top:476px;width:372px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:${PA};padding:6px;box-shadow:0 10px 22px #000c;transform:rotate(1.3deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;margin-top:6px;background:${PA};border:2px solid ${GD};box-shadow:0 8px 16px #000a;transform:rotate(-1.4deg);padding:10px 12px;text-align:center">
      ${lab('Biglietto / Palco',RD)}
      <div style="${D};font-size:46px;font-weight:600;line-height:1;color:${IN};margin-top:4px">No. 7</div>
      <div style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:4px">Guest: Don Altobello.</div>
      <div style="${D};font-size:16px;font-style:italic;line-height:1.25;color:${RD};margin-top:6px;border-top:1px dashed ${GD};padding-top:6px">Cannoli courtesy of Connie. Do not share.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#d9b4a6">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtDelancey(f,spec,menu,poster){
  const WD='#4a3c2a',P='#f3e9d2',K='#231d16',R='#8c2f22',S='#5d5242',L='#cdbd98',GD='#b8934a',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=R,e='')=>`<div style="${T};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const prices=['5¢','10¢','','2¢','25¢'];
  const dish=(x,i,dark)=>`<div style="display:grid;grid-template-columns:1fr 54px;column-gap:10px;padding:11px 0 12px;${dark?'':`border-bottom:1px dotted ${S}`}"><div><div style="${H};font-size:${i===2?34:25}px;line-height:1;font-weight:600;color:${dark?P:K}">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.4;color:${dark?'#e2d6bd':S};margin-top:4px">${ESC(x.d)}</div><div style="${H};font-size:16.5px;line-height:1.2;font-style:italic;color:${dark?GD:R};margin-top:2px">${ESC(x.note||'')}</div></div><div style="${T};font-size:19px;line-height:1;font-weight:700;color:${dark?GD:K};text-align:right;padding-top:6px">${prices[i]}</div></div>`;
  const card=`<section aria-label="Fat Moe's menu" style="${at(24,22,652,'height:698px;background:'+P+';box-shadow:0 12px 26px rgba(0,0,0,.55)')}"><div style="${at(30,22,592)}"><div style="display:flex;justify-content:space-between">${lab('Delancey Street / Lower East Side')}${lab('Open late',S)}</div><div style="text-align:center;border-top:3px double ${K};border-bottom:3px double ${K};margin-top:8px;padding:6px 0 5px"><div style="${H};font-size:56px;line-height:.95;font-weight:600;color:${K};letter-spacing:.03em">Fat Moe's</div><div style="${H};font-size:19px;line-height:1.2;font-style:italic;color:${R};margin-top:2px">Restaurant. Coffee. No questions.</div></div>${lab('The front room',S,'margin-top:14px')}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:24px">${dish(xs[0],0)}${dish(xs[1],1)}</div><div style="background:${K};padding:2px 18px 4px;margin-top:10px"><div style="display:flex;justify-content:space-between;padding-top:9px">${lab('The back room / knock first',GD)}${lab('Members only',GD)}</div>${dish(xs[2],2,1)}</div>${lab('On the stairs and after closing',S,'margin-top:10px')}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:24px">${dish(xs[3],3)}${dish(xs[4],4)}</div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:36px">${lab('Whisky served in coffee cups. Ask for coffee.',K,'font-size:10.5px')}<span style="${T};font-size:9px;color:${S};letter-spacing:.06em">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</span></div></div></section>`;
  const tag=`<div style="display:flex;align-items:center;gap:0;margin-top:16px"><div style="width:26px;height:26px;border-radius:50%;border:3px solid ${GD};box-sizing:border-box;flex:none"></div><div style="width:40px;height:3px;background:${GD};flex:none"></div><div style="flex:1;background:${P};padding:9px 13px;border-radius:4px;box-shadow:0 4px 10px rgba(0,0,0,.4)">${lab('Left luggage / station locker',R)}<div style="${T};font-size:13px;line-height:1.35;color:${K};margin-top:3px">One suitcase. The key waits at Moe's. Count it before you leave.</div></div></div>`;
  const side=`<aside style="${at(698,22,350,'height:698px;display:flex;flex-direction:column')}"><figure style="margin:0;background:#f4efe2;padding:8px 8px 10px;transform:rotate(1deg);box-shadow:0 8px 18px rgba(0,0,0,.5)">${img('bridge','The boys beneath the Manhattan Bridge',334,200)}<figcaption style="${T};font-size:12px;line-height:1.3;color:${K};margin-top:7px;letter-spacing:.03em">THE BOYS, UNDER THE MANHATTAN BRIDGE.</figcaption></figure><figure style="margin:16px 0 0">${img('supper','The grown friends at a speakeasy dinner table',350,160)}<figcaption style="${T};font-size:12px;line-height:1.3;color:#eadfc6;margin-top:7px;letter-spacing:.03em">THE BACK ROOM. 1933, LAST NIGHT OF PROHIBITION.</figcaption></figure>${tag}${FX_SP}<div style="border-top:2px solid ${GD};padding-top:10px">${lab('Cue',GD)}<div style="${B};font-size:14px;line-height:1.45;color:#f3ead6;margin-top:5px">${ESC(fmtCue(f))}</div></div><div style="${H};font-size:21px;line-height:1.15;font-style:italic;color:${GD};margin-top:10px">1968. Been going to bed early.</div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${WD};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.06),rgba(0,0,0,.25))"></div>${card}${side}</div>`;
}


/* A late-night club supper ticket, with the film's own paradise image on its tear-off stub. */
function fmtParaiso(f,spec,menu,poster){
 const N='#301c2c',P='#e9d2b7',W='#f1e0c8',STUB='#d9ac9d',I='#3c2633',R='#93485d',M='#76544e',G='#c79b72',PK='#ff6fa8';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(t,c=R,e='')=>`<div style="${B};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const pr=['3.50','2.75','9.75','2.50','1.75'];
 const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px solid #d3b99c;padding:5px 0">
   <div style="display:flex;align-items:baseline;gap:10px"><span style="${B};font-size:27px;line-height:1.05;font-weight:700;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',R)}<span style="flex:1;border-bottom:2px dotted #d3b99c;transform:translateY(-5px)"></span><span style="${D};font-size:19px;color:${R}">${pr[i]}</span></div>
   ${r.it.desc?`<div style="${B};font-size:17.5px;line-height:1.2;font-weight:500;color:${I};margin-top:1px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${B};font-size:15.5px;line-height:1.2;font-style:italic;color:${M};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
 const card=`<section style="position:absolute;left:24px;top:24px;width:612px;height:694px;box-sizing:border-box;background:${W};border:3px solid ${PK};box-shadow:0 12px 28px rgba(0,0,0,.55);display:flex;flex-direction:column">
   <div style="background:#1f1019;padding:14px 26px 14px;border-bottom:3px solid ${PK};display:flex;justify-content:space-between;align-items:flex-end">
     <div>${lab('Supper club / Disco / Upstairs',STUB)}<div style="${D};font-size:50px;line-height:1;color:${PK};margin-top:4px;letter-spacing:-.01em">EL PARAÍSO</div></div>
     <div style="text-align:right;${B};font-size:15px;font-weight:600;line-height:1.3;color:${P}">Under new management:<br><span style="${D};font-size:17px;color:${STUB}">C. Brigante</span></div></div>
   <div style="padding:10px 26px 0;${B};font-size:20px;font-weight:600;color:${M}">${ESC(spec.tag||'')}</div>
   <div style="padding:4px 26px 0;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="border-top:3px double ${R};margin:0 26px;padding:7px 0 10px;display:flex;justify-content:space-between;${B};font-size:13px;font-weight:700;letter-spacing:.1em;color:${M}"><span>KLEINFELD'S TAB: STILL OPEN</span><span>BENNY FROM THE BRONX: NOT ON THE LIST</span></div></section>`;
 const side=`<section style="position:absolute;left:660px;top:24px;width:387px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${D};font-size:36px;line-height:1;color:${P}">CARLITO'S<br>WAY</div>${lab('New York, 1975',G,'text-align:right')}</div>
   <figure style="margin:0;border:4px solid ${P}">${img('carlito','Carlito in the club booth',379,188,'center 30%')}</figure>
   <div style="display:flex;justify-content:space-between;align-items:stretch">
     <figure style="margin:0;border:4px solid ${P}">${img('club','Kleinfeld and Carlito at El Paraíso',184,110)}</figure>
     <figure style="margin:0;border:4px solid ${STUB};position:relative">${img('paradise','The Escape to Paradise poster',184,110)}<figcaption style="position:absolute;left:4px;bottom:4px;background:${N};color:${STUB};padding:2px 6px;${B};font-size:12px;font-weight:700;letter-spacing:.1em">ESCAPE TO PARADISE</figcaption></figure></div>
   <div style="display:flex;background:${STUB};color:${I};box-shadow:0 5px 12px rgba(0,0,0,.4);transform:rotate(-1.5deg)">
     <div style="padding:8px 12px;border-right:2px dashed ${I};text-align:center;width:96px;display:flex;flex-direction:column;justify-content:center">${lab('Admit',I)}<div style="${D};font-size:28px;line-height:1">2</div></div>
     <div style="padding:8px 14px;flex:1">${lab('Grand Central / One way / Coach',R)}<div style="${D};font-size:21px;line-height:1.1;margin-top:3px">To Miami. Then the islands.</div><div style="${B};font-size:15px;font-weight:600;margin-top:2px">Savings for the rental car business: $75,000</div></div></div>
   <div style="border-top:1px solid #5a3b4e;padding-top:8px">${lab('Serving cue',G)}<div style="${B};font-size:18px;line-height:1.25;font-weight:500;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${B};font-size:11px;letter-spacing:.14em;color:#a98d92;margin-top:5px">FILM IMAGERY: TMDB</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 18px 38px rgba(0,0,0,.5)">${card}${side}</div>`;
}

function fmtLeftys(f,spec,menu,poster){
  const W='#2a2420',P='#eef0de',G='#5b7a52',L='#b9c9a8',I='#211e1b',M='#5a5850',R='#a5302a',H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const dates=['3/14','3/14','4/02','4/02','4/09'],amt=['6.50','4.00','12.00','3.50','5.00'],paid=['UNPAID','UNPAID','DONNIE','UNPAID','NEVER'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:1fr 96px;border-bottom:1px solid ${L}">
    <div style="padding:8px 14px 8px;border-right:1px solid ${L}"><div style="${T};font-size:10.5px;font-weight:700;letter-spacing:.08em;color:${G}">${ESC((tabs[i]||'').toUpperCase())}</div>
      <div style="${H};font-size:${i===2?30:26}px;line-height:1.02;font-weight:700;text-transform:uppercase;color:${I}">${ESC(it.label)}</div>
      <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
      ${it.film?`<div style="${B};font-size:13px;line-height:1.3;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>
    <div style="padding:9px 12px 0;text-align:right"><div style="${H};font-size:24px;font-weight:700;line-height:1;color:${I}">${amt[i]}</div><div style="${T};font-size:11px;color:${M};margin-top:4px">${dates[i]}</div><div style="${T};font-size:12px;font-weight:700;margin-top:2px;color:${paid[i]==='DONNIE'?G:R}">${paid[i]}</div></div></div>`;
  const ledger=`<section aria-label="Social club tab ledger menu" style="${at(388,22,659,`height:698px;background:${P};box-shadow:0 8px 20px rgba(0,0,0,.6)`)}">
    <header style="${at(24,20,611,'display:flex;justify-content:space-between;align-items:flex-end')}"><div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${G}">SOCIAL CLUB / MEMBERS ONLY / NEW YORK, 1978</div><div style="${H};font-size:40px;line-height:1;font-weight:700;color:${I};text-transform:uppercase;margin-top:3px">The tab behind the bar</div></div>
      <div style="text-align:right;border:2px solid ${I};padding:4px 10px"><div style="${T};font-size:10px;font-weight:700;color:${M}">ACCOUNT</div><div style="${H};font-size:26px;font-weight:700;line-height:1;color:${I}">LEFTY</div></div></header>
    <div style="${at(24,88,611,`border:2px solid ${G}`)}">
      <div style="display:grid;grid-template-columns:1fr 96px;background:${G};color:#fff;${T};font-size:11px;font-weight:700;letter-spacing:.1em"><span style="padding:5px 14px">ITEM</span><span style="padding:5px 12px;text-align:right">AMOUNT</span></div>
      ${all.map(row).join('')}
      <div style="display:grid;grid-template-columns:1fr 96px;background:#e2e6cc"><span style="${T};font-size:12px;font-weight:700;color:${I};padding:8px 14px">BALANCE OWING. ASK SONNY.</span><span style="${H};font-size:24px;font-weight:700;color:${R};padding:4px 12px;text-align:right">$31.00</span></div></div>
  </section>`;
  const left=`<div style="${at(24,22,340,'height:698px;display:flex;flex-direction:column')}">
    <div style="${H};font-size:44px;line-height:.95;font-weight:700;color:#f2ecd9;text-transform:uppercase">Donnie Brasco</div>
    <div style="${H};font-size:24px;font-weight:600;color:${L};margin-top:4px">${ESC(spec.tag||'')}</div>
    <figure style="margin:14px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(-1deg)">${img('club','Lefty and Donnie at the social club',328,196)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">The club. Nobody pays at the bar.</figcaption></figure>
    <figure style="margin:14px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(1deg)">${img('florida','The crew on the Florida trip',328,170)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">The Florida trip. Lefty gets a tan.</figcaption></figure>
    <div style="margin-top:auto;display:flex;align-items:center;gap:12px">
      <div style="width:22px;height:22px;border-radius:50%;border:3px solid #c9b77d;flex:none"></div>
      <div style="flex:1;background:#f5e9c6;padding:9px 14px;transform:rotate(-1deg);box-shadow:0 4px 10px rgba(0,0,0,.5)"><div style="${T};font-size:10.5px;font-weight:700;color:${M}">JEWELLER'S TAG / APPRAISED BY D. BRASCO</div><div style="${H};font-size:24px;font-weight:700;color:${R};line-height:1.1">FUGAZI. It's a fake.</div><div style="${B};font-size:13px;color:${I};margin-top:2px"><b>CUE</b> ${ESC(fmtCue(f))}</div></div></div>
    <div style="${T};font-size:9px;color:#9a907d;margin-top:8px">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${W};overflow:hidden;box-shadow:0 16px 40px #0007">${left}${ledger}</div>`;
}


function fmtAfterhours(f,spec,menu,poster){
  const PA='#eef0e0',IN='#1f1d1a',SO='#57584c',RD='#b0201f',GL='#a9bf9e',BL='#21407a',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:14px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const who=['J. Boy','J. Boy','Charlie','J. Boy','Everybody'],owe=['$3.00','$4.50','$6.00','$1.00','$2.00'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:90px 1fr 96px;border-bottom:1px solid ${GL}">
    <div style="border-right:1px solid ${GL};padding:13px 8px 0"><div style="${T};font-size:15px;font-weight:700;color:${BL}">${who[i]||''}</div><div style="${T};font-size:12px;color:${SO};margin-top:4px">${ESC(gs[i]?gs[i].tab:'')}</div></div>
    <div style="padding:12px 12px 11px"><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${RD}">${ESC(it.film||'')}</p></div>
    <div style="border-left:3px double ${GL};padding:13px 8px 0;text-align:right"><div style="${T};font-size:15px;font-weight:700;color:${IN}">${owe[i]||''}</div><div style="${T};font-size:12px;color:${RD};margin-top:4px">${i===2?'PAID':i===4?'ASK MICHAEL':'UNPAID'}</div></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:radial-gradient(ellipse at 75% 30%,#c4231f,#6e0c10 55%,#260406);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:${PA};box-shadow:0 12px 28px #000c;box-sizing:border-box;padding:14px 20px 10px;display:flex;flex-direction:column">
    <div aria-hidden="true" style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(90deg,#00000022,#0000)"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${IN};padding-bottom:6px">
      <div>${lab('Tony’s bar / Back room / Little Italy',RD)}<div style="${C};font-size:46px;font-weight:700;line-height:.9;color:${IN};margin-top:3px">THE TAB BOOK</div></div>
      <div style="${T};font-size:13px;line-height:1.45;color:${IN};text-align:right">COLLECTOR: Michael<br>FEAST WEEK</div>
    </div>
    <div style="${B};font-size:14px;line-height:1.35;color:${IN};padding:7px 0;border-bottom:1px solid ${IN}">${ESC(spec.tag||'')} Everything goes on the book. Johnny Boy’s page is getting long.</div>
    <div style="display:grid;grid-template-columns:90px 1fr 96px;border-bottom:2px solid ${IN};padding:6px 0 4px">${lab('Who','','padding-left:8px')}${lab('Ordered','','padding-left:12px')}${lab('Owes','','text-align:right;padding-right:8px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${T};font-size:11px;color:${SO};margin-top:5px">House rule: no credit after the feast. Charlie vouches, Charlie pays.</div>
  </div>
  <header style="position:absolute;left:692px;top:22px;width:356px">
    ${lab('New York / 1973','#ffd4c2')}
    <h1 style="${C};font-size:84px;line-height:.82;font-weight:700;text-transform:uppercase;margin:6px 0 0;color:#fbeee0;text-shadow:none">Mean<br>Streets</h1>
  </header>
  <figure style="position:absolute;left:692px;top:200px;width:356px;margin:0;background:#f6efe4;padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000c;transform:rotate(1deg)">${img('bar','Charlie and Johnny Boy inside Tony’s red-lit bar',342,196)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Red light, a jukebox and a tab nobody intends to settle.</figcaption></figure>
  <div style="position:absolute;left:692px;top:478px;width:356px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#f6efe4;padding:6px;box-shadow:0 10px 22px #000c;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,136,204)}</div>
    <div style="flex:1;margin-top:6px;background:#f7e9b8;border:2px solid #7a5a1a;box-shadow:0 8px 16px #0009;transform:rotate(1.5deg)">
      <div style="display:flex;height:12px">${['#2a7a3a','#f7f2e8','#c4231f'].map(c=>`<i style="flex:1;background:${c}"></i>`).join('')}</div>
      <div style="padding:9px 11px 11px">
        ${lab('Feast of San Gennaro',RD)}
        <div style="${C};font-size:26px;font-weight:700;line-height:.95;color:${IN};margin-top:5px">RAFFLE No. 1973</div>
        <div style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:6px">Mulberry Street. Sausage, zeppole and a parade with a saint.</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#f0b9b0">FILM IMAGERY: TMDB</div>
  </div>`;
}

function fmtMiami(f,spec,menu,poster){
 const N='#120c16',PK='#ff5fa8',TL='#3fd6c8',W='#fbeef3',K='#1a1220',GD='#e8c66a',S='#c9b8c6';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
 const lab=(t,c=TL,e='')=>`<div style="${B};font-size:13px;line-height:1.25;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const prices=['1.25','1.25','1983','20.00','10.00'],tags=['From the counter','From the counter','The main event','Something sweet','Miami in a glass'];
 const dish=(x,i)=>`<div style="display:grid;grid-template-columns:1fr ${i===2?'90px':'64px'};column-gap:8px;padding:${i===2?'15px 18px 16px':'14px 0 14px'};${i===2?`border:2px solid ${PK};margin:6px 0;box-shadow:0 0 0 4px rgba(255,95,168,.15)`:`border-bottom:1px solid #3a2b3f`}"><div>${lab(tags[i],i===2?PK:TL,'font-size:11.5px')}<div style="${D};font-size:${i===2?27:21}px;line-height:1.08;color:${W};margin-top:4px">${nm(x)}</div><div style="${B};font-size:17px;line-height:1.24;color:${S};margin-top:4px">${ESC(x.d)}</div><div style="${B};font-size:16px;line-height:1.2;font-weight:600;color:${GD};margin-top:2px">${ESC(x.note||'')}</div></div><div style="${B};font-size:${i===2?30:22}px;line-height:1;font-weight:700;color:${i===2?PK:W};text-align:right;padding-top:${i===2?18:17}px">${i===2?'':'$'}${prices[i]}</div></div>`;
 const card=`<section aria-label="Babylon Club menu" style="${at(22,22,620,'height:698px;background:'+K+';border:2px solid '+PK+';box-sizing:border-box;box-shadow:0 0 0 6px #1d1424,0 0 0 8px rgba(63,214,200,.6),0 14px 30px rgba(0,0,0,.6)')}"><div style="${at(28,22,560)}"><div style="display:flex;justify-content:space-between">${lab('Miami Beach / Table menu')}${lab('Table 1 / Reserved: Montana',PK)}</div><div style="text-align:center;margin-top:10px"><div style="${D};font-size:52px;line-height:1;color:${PK};letter-spacing:.04em">BABYLON</div><div style="${B};font-size:20px;line-height:1;font-weight:700;letter-spacing:.5em;color:${TL};margin-top:4px;padding-left:.5em">CLUB</div></div><div style="height:2px;background:${PK};margin-top:10px"></div><div style="display:grid;grid-template-columns:1fr 1fr;column-gap:24px">${dish(xs[0],0)}${dish(xs[1],1)}</div>${dish(xs[2],2)}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:24px">${dish(xs[3],3)}${dish(xs[4],4)}</div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:10px">${lab('Bill to: Mr. Montana. Again.',GD,'font-size:12px')}${lab('Main course priced by the year',S,'font-size:11px')}</div></div></section>`;
 const side=`<aside style="${at(666,22,383,'height:698px;display:flex;flex-direction:column')}"><figure style="margin:0;border:3px solid ${TL}">${img('blimp','The World Is Yours blimp over Miami',377,226)}</figure><div style="display:flex;justify-content:space-between;margin-top:8px">${lab('Look up',TL)}${lab('The world is yours',PK)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">${img('counter','Tony working at the Cuban food counter',186,196)}${img('babylon','Tony at a pink-lit table in the Babylon Club',187,196)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:7px">${lab('Before: the counter',S,'font-size:11.5px')}${lab('After: the Babylon',S,'font-size:11.5px')}</div>${FX_SP}${lab('Coat check: one little friend. Say hello.',GD,'font-size:12px;margin-bottom:12px')}<div style="border-top:2px solid ${PK};padding-top:10px">${lab('Cue',PK)}<div style="${B};font-size:18px;line-height:1.28;color:${W};margin-top:4px">${ESC(fmtCue(f))}</div></div><div style="${D};font-size:19px;line-height:1.2;color:${GD};margin-top:12px">${ESC(spec.tag||'')}</div><div style="${B};font-size:10px;letter-spacing:.1em;color:${S};margin-top:8px">SCARFACE / 1983 / FILM IMAGERY: TMDB</div></aside>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 15% 0%,rgba(255,95,168,.22),transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(63,214,200,.16),transparent 55%)"></div>${card}${side}</div>`;
}

function fmtPrizzis(f,spec,menu,poster){
  const P='#f0e6d6',W='#f8f1e6',I='#39312f',M='#74625b',R='#6b293c',V='#ac939f',L='#d6c6b6';
  const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center;padding:4px 0">
    ${lab(r.g.h||'',V)}
    <div style="${H};font-size:27px;line-height:1.05;font-weight:600;color:${R};margin-top:2px">${ESC(r.it.label||'')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:16.5px;line-height:1.25;color:${M};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
  const orn=`<div aria-hidden="true" style="display:flex;align-items:center;gap:10px;justify-content:center"><span style="width:60px;height:1px;background:${V}"></span><span style="width:7px;height:7px;background:${V};transform:rotate(45deg)"></span><span style="width:60px;height:1px;background:${V}"></span></div>`;
  const card=`<section style="position:absolute;left:443px;top:24px;width:604px;height:694px;box-sizing:border-box;background:${W};padding:10px;box-shadow:0 12px 26px rgba(0,0,0,.4)">
   <div style="height:100%;box-sizing:border-box;border:1px solid ${V};box-shadow:inset 0 0 0 4px ${W},inset 0 0 0 5px ${V};padding:16px 36px 12px;display:flex;flex-direction:column">
    <div style="text-align:center">
      <div style="width:52px;height:52px;border-radius:50%;border:2px solid ${R};margin:0 auto;display:flex;align-items:center;justify-content:center;${H};font-size:34px;font-weight:600;font-style:italic;color:${R};line-height:1">P</div>
      <div style="${H};font-size:40px;line-height:1.02;font-weight:600;color:${I};margin-top:6px">${ESC(spec.brand||'')}</div>
      <div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:2px">Brooklyn. The Prizzi family requests your honour.</div>
      <div style="margin-top:8px">${orn}</div></div>
    <div style="flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="margin-bottom:7px">${orn}</div>
    <div style="display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${M}"><span>NO PHOTOGRAPHS OF THE FAMILY.</span><span>FILM STILLS: TMDB</span></div></div></section>`;
  const seats=[['1','Don Corrado Prizzi'],['1','Dominic & Eduardo'],['2','Charley & Angelo Partanna'],['7','Maerose. Far from Charley.'],['?','The lady in lavender']];
  const left=`<section style="position:absolute;left:24px;top:24px;width:395px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${H};font-size:48px;line-height:.95;font-weight:600;color:${R}">Prizzi's Honor</div><div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:4px">${ESC(spec.tag||'')}</div></div>
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 12px rgba(0,0,0,.2)">${img('couple','Charley and Irene',383,196)}</figure>
    <div style="display:flex;justify-content:space-between">
      <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px rgba(0,0,0,.2)">${img('family','The Prizzi family gathered',182,104)}</figure>
      <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px rgba(0,0,0,.2)">${img('dinner','Dinner with the Prizzis',182,104)}</figure></div>
    <div style="border:1px solid ${V};background:${W};padding:9px 14px 10px">${lab('Seating plan')}
      ${seats.map(s=>`<div style="display:flex;gap:10px;align-items:baseline;margin-top:3px"><span style="${T};font-size:13px;font-weight:700;color:${R};width:52px;white-space:nowrap">TBL ${s[0]}</span><span style="${H};font-size:17px;font-weight:600;color:${I}">${ESC(s[1])}</span></div>`).join('')}</div>
    <div style="background:${R};color:${P};padding:10px 14px 11px">${lab('Serving cue',P)}<div style="${B};font-size:14.5px;line-height:1.45;margin-top:3px">${ESC(fmtCue(f))} Marry her or ice her? Decide after the cookies.</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};box-shadow:0 14px 28px rgba(0,0,0,.35);${B}"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(125deg,#fff8,transparent 60%,rgba(151,115,135,.08))"></div>${left}${card}</div>`;
}


function fmtSobelSupper(f,spec,menu,poster){
  const W='#3b2f2a',Y='#fbf1b8',RL='#d9534f',BL='#a9c3d6',I='#232020',M='#5c5650',R='#9b2c22',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const dx=['Hungry. Talks with hands.','Needs comfort. Denies it.','Big feelings. Bigger plate.','Sweet tooth. Emotional.','Wants one drink. Has two.'];
  const row=(it,i)=>`<div style="padding:${i?9:0}px 0 9px;${i<all.length-1?'border-bottom:1px solid '+BL:''}">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${T};font-size:11px;font-weight:700;letter-spacing:.08em;color:${R}">${i+1}. ${ESC((tabs[i]||'').toUpperCase())}</span><span style="${T};font-size:12px;color:${M}">Dx: ${dx[i]}</span></div>
    <div style="${H};font-size:${i===2?30:26}px;line-height:1.03;font-weight:600;color:${I};margin-top:1px">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`;
  const pad=`<section aria-label="Session notes menu" style="${at(24,30,646,`height:690px;background:${Y};box-shadow:0 8px 20px rgba(0,0,0,.55)`)}">
    <div aria-hidden="true" style="${at(0,-12,646,'height:26px;background:#7a2b23;box-shadow:0 2px 4px rgba(0,0,0,.4)')}"></div>
    <div aria-hidden="true" style="position:absolute;left:62px;top:14px;bottom:0;width:2px;background:${RL}"></div><div aria-hidden="true" style="position:absolute;left:66px;top:14px;bottom:0;width:1px;background:${RL}"></div>
    <header style="${at(84,30,532,`border-bottom:2px solid ${BL};padding-bottom:8px`)}">
      <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${R}">BEN SOBEL, M.D. / SESSION NOTES / MONTCLAIR, N.J.</div><div style="${H};font-size:42px;line-height:1;font-weight:600;color:${I};margin-top:3px">Dinner with the patient</div></div>
      <div style="${T};font-size:11px;line-height:1.45;color:${M};text-align:right">PATIENT: P. Vitti<br>REFERRED BY: Jelly<br>FEE: we'll discuss</div></div></header>
    <div style="${at(84,124,532)}">${all.map(row).join('')}</div>
    <div style="${at(84,628,532,`border-top:2px solid ${BL};padding-top:8px;${H};font-size:19px;font-style:italic;color:${I}`)}">Note to self: he cries at the long-distance phone ads. Do not mention.</div>
  </section>`;
  const right=`<div style="${at(696,22,351,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(1deg)">${img('identity','Paul Vitti and Ben Sobel in the consulting room',339,190,'center 30%')}</figure>
    <figure style="margin:16px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg)">${img('dinner','Paul Vitti and Ben Sobel talking over coffee at the table',339,228)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">Session held off site. Patient insisted.</figcaption></figure>
    <div style="margin-top:auto;background:#fff;border-top:8px solid ${R};padding:12px 16px 14px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(1.2deg)">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${H};font-size:36px;font-weight:600;line-height:1;color:${R}">Rx</span><span style="${T};font-size:11px;color:${M}">REFILLS: as needed</span></div>
      <div style="${H};font-size:21px;line-height:1.2;font-weight:600;color:${I};margin-top:4px">${ESC(fmtCue(f))}</div>
      <div style="${T};font-size:11px;color:${M};margin-top:6px">${ESC(spec.tag||'')} Take with cannoli.</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#c9b9a8;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${W};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.05),transparent 60%)"></div>${pad}${right}</div>`;
}


/* The family collection: an auction-preview invitation that opens into an Italian supper. */
function fmtCollection(f,spec,menu,poster){
  const PA='#f6f1e6',IN='#1f1b18',SO='#5e564d',RD='#8c1d2a',GD='#a7854a',D="font-family:'Cormorant Garamond',serif",V="font-family:'Bevan',serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.16em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const est=['$40 to $60','$20 to $30','Ask Frank','One wedding','Two glasses, small'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:62px 1fr;column-gap:16px;padding:14px 0 13px;border-top:1px solid #d8cdb8">
    <div style="text-align:center"><div style="${B};font-size:10px;font-weight:700;letter-spacing:.14em;color:${SO}">LOT</div><div style="${V};font-size:28px;line-height:1;color:${RD}">${i+1}</div></div>
    <div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h3 style="${D};font-size:26px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].tab:''),GD,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.4;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;margin-top:3px"><span style="${D};font-size:16px;font-style:italic;line-height:1.25;color:${SO}">Provenance: ${ESC(it.film||'')}</span><span style="${B};font-size:12px;font-weight:600;color:${RD};white-space:nowrap">Est. ${est[i]||''}</span></div></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(160deg,#4a1820,#2a0f14);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ffffff05 0 2px,#0000 2px 9px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:650px;height:706px;background:${PA};box-shadow:0 12px 26px #000b;box-sizing:border-box;padding:18px 30px 14px;display:flex;flex-direction:column">
    <div style="text-align:center;padding-bottom:10px;border-bottom:2px solid ${IN}">
      ${lab('Evening sale / New York / Catalogue no. 1999',RD)}
      <div style="${D};font-size:40px;font-weight:600;line-height:1;color:${IN};margin-top:6px">The Family Collection</div>
      <div style="${D};font-size:18px;font-style:italic;color:${SO};margin-top:4px">Five lots for supper. Auctioneer: Mr M. Felgate. Viewing by appointment with Mr Vitale.</div>
    </div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline;border-top:2px solid ${IN};padding-top:8px">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${B};font-size:10px;color:${SO};margin-top:5px">Conditions of sale: all bids final. Paintings by Johnny Graziosi will be sold, at any price. Fuhgeddaboudit.</div>
  </div>
  <header style="position:absolute;left:702px;top:22px;width:346px">
    ${lab('Little Italy / 1999','#e2c58f')}
    <h1 style="${V};font-size:44px;line-height:1;margin:8px 0 0;color:#f6f1e6;text-shadow:none">Mickey Blue Eyes</h1>
    <div style="${D};font-size:21px;font-style:italic;line-height:1.2;color:#e8d6c2;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:702px;top:180px;width:346px;margin:0;background:${PA};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000b;transform:rotate(-1deg)">${img('lesson','Michael gets a lesson in sounding like a mobster',332,186)}<figcaption style="${D};font-size:17px;font-style:italic;line-height:1.25;color:${IN};margin-top:6px">Lesson one: say it like you’re from Kansas City.</figcaption></figure>
  <div style="position:absolute;left:702px;top:444px;width:346px;display:flex;gap:18px;align-items:flex-start">
    <div style="flex:none;background:${PA};padding:6px;box-shadow:0 10px 22px #000b;transform:rotate(1.4deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding-top:6px">
      <div style="width:150px;height:150px;border-radius:50%;background:${PA};border:6px solid ${GD};box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 8px 16px #000a">
        ${lab('Bidder',RD)}<div style="${V};font-size:46px;line-height:1;color:${IN};margin-top:4px">17</div>${lab('Mickey B.E.',SO,'margin-top:4px')}
      </div>
      <div style="width:22px;height:70px;background:linear-gradient(90deg,#6d4a26,#9a6e3c,#6d4a26);margin-top:-2px;border-radius:0 0 6px 6px"></div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${B};font-size:9px;color:#c9a9a9">FILM IMAGERY: TMDB</div>
  </div>`;
}

function fmtVillage(f,spec,menu,poster){
  const G='#173a2e',GD='#0f2a20',Y='#d9b45a',P='#f5eedc',K='#1d1f1c',R='#8f2f24',S='#5a5a50';
  const C="font-family:'Barlow Condensed',sans-serif",H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=Y,e='')=>`<div style="${C};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const prices=['6.50','7.00','14.50','5.00','9.00'];
  const dish=(x,i)=>`<div style="display:grid;grid-template-columns:1fr 60px;column-gap:10px;padding:${i===2?'13px 14px 13px':'10px 0 10px'};${i===2?`background:${G};margin:4px 0;`:`border-bottom:1px solid #d8ccb0;`}"><div><div style="${H};font-size:${i===2?32:26}px;line-height:1;font-weight:600;color:${i===2?P:K}">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.4;color:${i===2?'#d9e0d6':S};margin-top:4px">${ESC(x.d)}</div><div style="${H};font-size:16.5px;line-height:1.2;font-style:italic;color:${i===2?Y:R};margin-top:2px">${ESC(x.note||'')}</div></div><div style="${C};font-size:22px;line-height:1;font-weight:700;color:${i===2?Y:K};text-align:right;padding-top:5px">${prices[i]}</div></div>`;
  const striker=`<div aria-hidden="true" style="height:30px;display:flex;background:#5a3b2a">${Array.from({length:44},(_,i)=>`<span style="flex:1;background:${i%2?'#6e4a35':'#4b3122'}"></span>`).join('')}</div>`;
  const cover=`<section style="${at(22,22,420,'height:698px;background:'+G+';box-shadow:0 10px 24px rgba(0,0,0,.55);display:flex;flex-direction:column')}"><div style="padding:26px 28px 0;flex:1;display:flex;flex-direction:column"><div style="display:flex;justify-content:space-between">${lab('Compliments of the house')}${lab('Est. 1984')}</div><div style="border:2px solid ${Y};margin-top:14px;padding:16px 14px 14px;text-align:center"><div style="${H};font-size:54px;line-height:.95;font-weight:600;font-style:italic;color:${P}">Charlie's</div>${lab('Supper / Wine / Late',Y,'margin-top:8px')}<div style="${C};font-size:17px;line-height:1.2;font-weight:700;letter-spacing:.06em;color:${P};margin-top:6px;text-transform:uppercase">The Pope of Greenwich Village</div></div><figure style="margin:16px 0 0;border:5px solid ${P}">${img('cousins','Charlie and Paulie at a neighbourhood café table',354,290,'center 30%')}</figure><div style="${H};font-size:19px;line-height:1.2;font-style:italic;color:${P};margin-top:9px">Charlie and his cousin Paulie. One of them has a plan.</div>${FX_SP}<div style="${B};font-size:13px;line-height:1.4;color:#d9e0d6;border-top:1px solid ${Y};padding-top:9px">Close cover before striking. Count your fingers after dealing with Bed Bug Eddie.</div></div><div style="margin-top:14px">${striker}</div></section>`;
  const inside=`<section aria-label="Charlie's menu" style="${at(454,22,594,'height:698px;background:'+P+';box-shadow:0 10px 24px rgba(0,0,0,.55)')}"><div style="${at(28,24,538)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${K};padding-bottom:8px"><div>${lab('Inside cover / Tonight',R)}<div style="${H};font-size:34px;line-height:1;font-weight:600;color:${K};margin-top:4px">${ESC(spec.tag||'')}</div></div></div>${xs.slice(0,5).map(dish).join('')}<div style="display:grid;grid-template-columns:150px 1fr;gap:14px;margin-top:12px;align-items:start">${img('restaurant','Charlie and Diane inside a neighbourhood bar',150,96)}<div>${lab('Cue',R)}<div style="${B};font-size:14px;line-height:1.42;color:${K};margin-top:4px">${ESC(fmtCue(f))}</div><div style="${C};font-size:12px;letter-spacing:.08em;color:${S};margin-top:6px;text-transform:uppercase">Prices in 1984 dollars. Film imagery: TMDB</div></div></div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${GD};${B};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(217,180,90,.12),transparent 60%)"></div>${cover}${inside}</div>`;
}


function fmtHighhat(f,spec,menu,poster){
  const D='#1d2929',P='#e7dec5',W='#efe8d2',G='#b49a63',A='#607367',S='#6e705b',I='#1d2929',R='#8a3a2c',L='#cbbf9f',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=A,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const pr=['35','25','85','30','on Leo'];
  const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px solid ${L};padding:6px 0">
    <div style="display:flex;align-items:baseline;gap:10px"><span style="${H};font-size:25px;line-height:1.05;font-weight:600;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',A,'white-space:nowrap')}<span style="flex:1"></span><span style="${T};font-size:15px;font-weight:700;color:${R};white-space:nowrap">${pr[i]==='on Leo'?'On Leo':pr[i]+'¢'}</span></div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:16.5px;line-height:1.25;color:${S};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>`;
  const corner=(p)=>`<span aria-hidden="true" style="position:absolute;${p};width:12px;height:12px;border:2px solid ${G}"></span>`;
  const card=`<section style="position:absolute;left:24px;top:24px;width:610px;height:694px;box-sizing:border-box;background:${W};padding:12px;box-shadow:0 12px 26px rgba(0,0,0,.5)">
   <div style="position:relative;height:100%;box-sizing:border-box;border:1px solid ${G};box-shadow:inset 0 0 0 4px ${W},inset 0 0 0 6px ${D};padding:18px 30px 12px;display:flex;flex-direction:column">
    ${corner('left:5px;top:5px')}${corner('right:5px;top:5px')}${corner('left:5px;bottom:5px')}${corner('right:5px;bottom:5px')}
    <div style="text-align:center;padding-bottom:8px;border-bottom:1px solid ${G}">
      ${lab('Members only / Ring twice / 1929',A)}
      <div style="${H};font-size:48px;line-height:1;font-weight:600;color:${I};margin-top:4px">${ESC(spec.brand||'')}</div>
      <div style="${H};font-style:italic;font-size:20px;color:${R};margin-top:3px">${ESC(spec.tag||'')}</div></div>
    <div style="flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="border-top:1px solid ${G};padding-top:7px;display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${S}"><span>ETHICS NOT INCLUDED.</span><span>ON THE GRAMOPHONE: DANNY BOY</span></div></div></section>`;
  const ticket=`<div style="position:relative;display:flex;background:#c9a24f;color:${D};box-shadow:0 5px 12px rgba(0,0,0,.4);transform:rotate(-2deg)">
    <div style="padding:9px 14px;border-right:2px dashed ${D};text-align:center;width:112px;white-space:nowrap"><div style="${T};font-size:11px;font-weight:700">HAT</div><div style="${H};font-size:34px;font-weight:600;line-height:1">No. 29</div></div>
    <div style="padding:9px 14px;flex:1">${lab('Hat check',D)}<div style="${H};font-size:19px;font-style:italic;font-weight:600;line-height:1.2;margin-top:3px">If the wind takes it, let it go. Never chase a hat.</div></div></div>`;
  const side=`<section style="position:absolute;left:658px;top:24px;width:389px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${H};font-size:46px;line-height:.95;font-weight:600;color:${P}">Miller's Crossing</div>${lab("Tom Reagan / Leo's town / "+f.year,G,'margin-top:6px')}</div>
    <figure style="margin:0;border:5px solid ${P}">${img('identity',"Miller's Crossing title artwork",379,190)}</figure>
    <div style="display:flex;justify-content:space-between">
      <figure style="margin:0;border:4px solid ${P}">${img('room',"Leo and Tom in Leo's office",178,104)}</figure>
      <figure style="margin:0;border:4px solid ${P}">${img('hat','The hat in the woods at Miller’s Crossing',178,104)}</figure></div>
    ${ticket}
    <div style="border-top:1px solid #4e5d58;padding-top:8px">${lab('Serving cue',G)}<div style="${B};font-size:15px;line-height:1.45;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${B};font-size:10px;letter-spacing:.14em;color:#8e978e;margin-top:5px">FILM IMAGERY: TMDB</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${D};box-shadow:0 18px 40px #0008">${card}${side}</div>`;
}


/* A pale opening-night invitation, with Hollywood finery and the film's real desert dream. */
function fmtFlamingo(f,spec,menu,poster){
 const K='#151214',P='#fbeee9',PK='#e98aa4',DP='#b9466a',I='#231c1f',M='#6e5f63',GD='#c7a35b';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},all=menu.all;
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
 const price=['1.25','.95','3.50','.75','.60'];
 const lab=(t,c=DP)=>`<div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${c}">${t}</div>`;
 const row=(it,i)=>`<div style="padding:${i?10:0}px 0 10px;${i<all.length-1?`border-bottom:1px solid #e3c3c8`:''};text-align:center">
   ${lab(ESC(tabs[i]||''))}
   <div style="${H};font-size:${i===2?30:25}px;line-height:1.05;font-weight:600;color:${I};margin-top:2px">${ESC(it.label)} <span style="${H};font-size:19px;font-weight:600;color:${GD}">${price[i]}</span></div>
   <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
   ${it.film?`<div style="${H};font-size:16px;line-height:1.25;font-style:italic;color:${M};margin-top:1px">${ESC(it.film)}</div>`:''}</div>`;
 const card=`<section aria-label="Opening night supper club menu" style="${at(236,22,600,`height:698px;background:${P};box-shadow:0 10px 26px rgba(0,0,0,.7)`)}">
   <div aria-hidden="true" style="position:absolute;inset:10px;border:2px solid ${PK}"></div><div aria-hidden="true" style="position:absolute;inset:16px;border:1px solid ${GD}"></div>
   <header style="${at(40,30,520,'text-align:center')}">${lab('Las Vegas, Nevada / December 26, 1946',GD)}
     <div style="${H};font-size:46px;line-height:.95;font-weight:600;color:${DP};margin-top:5px">The Flamingo</div>
     <div style="${H};font-size:19px;font-style:italic;color:${I};margin-top:3px">Opening night supper. Mr. Siegel requests black tie.</div>
     <div style="width:120px;height:2px;background:${PK};margin:10px auto 0"></div></header>
   <div style="${at(40,146,520)}">${all.map(row).join('')}</div>
 </section>`;
 const side=(k,alt,cap,sub,x,rot,extra)=>`<div style="${at(x,22,196,'height:698px;display:flex;flex-direction:column')}">
   <figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 6px 16px rgba(0,0,0,.6);transform:rotate(${rot}deg)">${img(k,alt,184,340)}<figcaption style="${H};font-size:17px;font-style:italic;font-weight:600;color:${I};padding:6px 2px 7px;line-height:1.15">${cap}</figcaption></figure>
   <div style="margin-top:22px;${B};font-size:14px;line-height:1.45;color:#e8d3d8">${sub}</div>${extra}</div>`;
 const stub=`<div style="margin-top:auto;border:2px dashed ${PK};padding:12px 14px;text-align:center"><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;color:${PK}">BUILDING FUND</div><div style="${H};font-size:30px;font-weight:600;line-height:1.1;color:#fff">$6,000,000</div><div style="${B};font-size:11px;color:#e8d3d8">and counting. Mr. Lansky has questions.</div></div>`;
 const elo=`<div style="margin-top:auto;background:${PK};padding:12px 14px;transform:rotate(1.5deg)"><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;color:${K}">ELOCUTION, BEFORE SERVICE</div><div style="${H};font-size:20px;line-height:1.15;font-weight:600;font-style:italic;color:${K};margin-top:3px">Twenty dwarves took turns doing handstands on the carpet.</div></div><div style="${B};font-size:9px;letter-spacing:.1em;color:#8d7f83;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 15px 34px rgba(0,0,0,.42)">
  <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(233,138,164,.18),transparent 65%)"></div>
  ${side('desert','Bugsy Siegel in the desert at the Flamingo site','The desert site. Nothing but sand and a grand idea.',`<b style="color:${PK};letter-spacing:.12em">CUE</b> ${ESC(fmtCue(f))}<br><br>Never call him Bugsy. It’s Ben.`,24,-1.5,stub)}
  ${card}
  ${side('party','Ben Siegel and Virginia Hill at a Hollywood party','Virginia Hill. He named the place for her.','A gin rickey for Virginia, a steak for Ben, and the bill sent to the East Coast.',851,1.5,elo)}
 </div>`;
}

function fmtShorty(f,spec,menu,poster){
  const PA='#fbf8ef',IN='#1d1b19',SO='#58534c',OR='#e0612a',TQ='#1d8a91',YE='#f2c84b',A="font-family:'Alfa Slab One',serif",C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:14px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const sc=[['1','EXT. MIAMI','Chili'],['2','INT. MIAMI','Chili'],['3','INT. LA DINER','Chili, Harry'],['4','INT. HARRY’S','Harry, Karen'],['5','INT. MORNING','Martin']];
  const row=(it,i)=>{const r=sc[i]||sc[0];return `<div style="display:grid;grid-template-columns:44px 1fr 118px;border-bottom:1px solid #cfc8b8">
    <div style="${A};font-size:22px;color:${OR};text-align:center;padding-top:12px;border-right:1px solid #cfc8b8">${r[0]}</div>
    <div style="padding:10px 12px 9px"><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${B};font-size:13px;line-height:1.35;font-style:italic;margin:3px 0 0;color:${SO}">${ESC(it.film||'')}</p></div>
    <div style="border-left:1px solid #cfc8b8;padding:12px 8px 0;text-align:right">${lab(ESC(gs[i]?gs[i].tab:''),OR)}<div style="${C};font-size:14px;font-weight:700;line-height:1.2;color:${TQ};margin-top:4px;letter-spacing:.04em">${r[1]}</div><div style="${C};font-size:15px;font-weight:600;line-height:1.2;color:${SO};margin-top:3px">${r[2]}</div></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(170deg,#f39b4b 0%,#e0612a 38%,#7a2f52 78%,#2c1d3d);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:120px;background:repeating-linear-gradient(90deg,#00000022 0 3px,#0000 3px 70px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:${PA};box-shadow:0 12px 26px #0009;box-sizing:border-box;padding:14px 20px 10px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid ${IN};padding-bottom:6px">
      <div>${lab('Harry Zimm Productions / Call sheet',OR)}<div style="${A};font-size:38px;line-height:1;color:${IN};margin-top:4px">MR. LOVEJOY</div></div>
      <div style="text-align:right;${C};font-size:15px;font-weight:600;line-height:1.3;color:${IN}">DAY 1 OF 1<br>CREW CALL: SUPPERTIME</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;${C};font-size:15px;font-weight:600;line-height:1.3;color:${IN};padding:6px 0;border-bottom:1px solid ${IN}"><span>PRODUCER: H. Zimm</span><span>STARRING: M. Weir</span><span style="text-align:right">PICTURE CAR: Minivan</span></div>
    <div style="display:grid;grid-template-columns:44px 1fr 118px;border-bottom:2px solid ${IN};padding:6px 0 4px">${lab('Sc','','text-align:center')}${lab('What’s on the plate','','padding-left:12px')}${lab('Set / cast','','text-align:right;padding-right:8px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',OR,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
    <div style="${C};font-size:12px;font-weight:600;letter-spacing:.06em;color:${SO};margin-top:5px">NO SCRIPT CHANGES WITHOUT CHILI. NOBODY TOUCHES THE LEATHER JACKET.</div>
  </div>
  <header style="position:absolute;left:692px;top:22px;width:356px">
    ${lab('Miami / Hollywood / 1995','#fff1d8')}
    <h1 style="${A};font-size:62px;line-height:.92;margin:6px 0 0;color:#fff7e6;text-shadow:none">Get<br>Shorty</h1>
    <div style="${B};font-size:15px;font-style:italic;line-height:1.35;color:#fff1d8;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:692px;top:212px;width:356px;margin:0;background:${PA};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #0009;transform:rotate(1deg)">${img('pitch','Chili Palmer and Harry Zimm talking movies',342,190)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Chili came to collect a debt. He stayed to make a movie.</figcaption></figure>
  <div style="position:absolute;left:692px;top:478px;width:356px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:${PA};padding:6px;box-shadow:0 10px 22px #0009;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,136,204)}</div>
    <div style="flex:1;min-width:0;margin-top:4px">
      <div style="background:${IN};padding:9px 10px 10px;box-shadow:0 8px 16px #0009">
        <div style="height:16px;display:flex;gap:10px;overflow:hidden;margin-bottom:8px">${'<i style="flex:none;width:12px;height:16px;background:#fff;transform:skewX(-35deg)"></i>'.repeat(12)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;${C};font-size:14px;font-weight:600;line-height:1.2;color:#fff">
          <span style="color:${YE}">ROLL</span><span style="color:${YE}">TAKE</span><span>A</span><span>1</span>
          <span style="color:${YE};grid-column:1/3">DIRECTOR</span><span style="grid-column:1/3">Chili Palmer, probably</span>
        </div>
      </div>
      <div style="${C};font-size:17px;font-weight:700;line-height:1.15;color:#fff7e6;margin-top:10px">The Cadillac of minivans is double-parked outside.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${B};font-size:9px;color:#e9d6e6">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtCarmine(f,spec,menu,poster){
  const P='#f6efdf',K='#1f1a16',G='#a8823e',R='#7c2a22',S='#5c544a',BG='#1d2a24',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=G,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rom=['I','II','III','IV','V'];
  const course=(x,i)=>`<div style="text-align:center;padding:${i===2?'12px 0 13px':'12px 0 12px'}">${lab('Course '+rom[i],G)}<div style="${H};font-size:${i===2?38:27}px;line-height:1.02;font-weight:600;color:${K};margin-top:3px">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.38;color:${S};margin:3px auto 0;max-width:470px">${ESC(x.d)}</div><div style="${H};font-size:16.5px;line-height:1.2;font-style:italic;color:${R};margin-top:2px">${ESC(x.note||'')}</div></div>`;
  const orn=`<div aria-hidden="true" style="display:flex;align-items:center;justify-content:center;gap:10px;margin:12px 0 4px"><span style="width:60px;height:1px;background:${G}"></span><span style="width:7px;height:7px;background:${G};transform:rotate(45deg)"></span><span style="width:60px;height:1px;background:${G}"></span></div>`;
  const card=`<section aria-label="The Gourmet Club menu" style="${at(24,22,640,'height:698px;background:'+P+';box-shadow:0 12px 26px rgba(0,0,0,.55)')}"><div aria-hidden="true" style="position:absolute;inset:12px;border:2px solid ${G}"></div><div aria-hidden="true" style="position:absolute;inset:18px;border:1px solid ${G}"></div><div style="${at(40,36,560,'text-align:center')}">${lab('By invitation only / Members and guests',S)}<div style="${H};font-size:46px;line-height:1;font-weight:600;color:${K};margin-top:8px;letter-spacing:.02em">The Gourmet Club</div><div style="${H};font-size:19px;line-height:1.2;font-style:italic;color:${R};margin-top:4px">An evening hosted by Mr. Carmine Sabatini</div>${orn}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:22px;margin-top:4px">${course(xs[0],0)}${course(xs[1],1)}</div>${orn}${course(xs[2],2)}${orn}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:22px">${course(xs[3],3)}${course(xs[4],4)}</div><div style="margin-top:10px;border-top:1px solid ${G};padding-top:10px;display:flex;justify-content:space-between;align-items:baseline"><div style="${H};font-size:18px;line-height:1.2;color:${S}"><span style="text-decoration:line-through">Komodo dragon, Indonesia</span> <i style="color:${R}">Off the menu tonight.</i></div>${lab('Seat 12',S)}</div></div></section>`;
  const side=`<aside style="${at(690,22,357,'height:698px;display:flex;flex-direction:column')}"><figure style="margin:0;border:6px solid ${P};box-shadow:0 8px 18px rgba(0,0,0,.5)">${img('club','Carmine and Clark meeting the chef in the Gourmet Club kitchen',345,236)}</figure><div style="${T};font-size:12.5px;line-height:1.35;color:#e5dccb;margin-top:8px">THE KITCHEN. ASK NO QUESTIONS ABOUT THE MEAT.</div><figure style="margin:14px 0 0;border:6px solid ${P};box-shadow:0 8px 18px rgba(0,0,0,.5)">${img('drive','Carmine and Clark in formalwear, driving to the dinner',345,206)}</figure><div style="${T};font-size:12.5px;line-height:1.35;color:#e5dccb;margin-top:8px">BLACK TIE. CLARK KELLOGG, FILM SCHOOL, FIRST YEAR.</div>${FX_SP}<div style="border-top:2px solid ${G};padding-top:10px">${lab('Cue')}<div style="${B};font-size:14px;line-height:1.45;color:#f1eadb;margin-top:5px">${ESC(fmtCue(f))}</div></div><div style="${H};font-size:22px;line-height:1.15;font-style:italic;color:${G};margin-top:12px">${ESC(spec.tag||'')}</div><div style="${T};font-size:9px;color:#a99f8c;letter-spacing:.06em;margin-top:8px">THE FRESHMAN / 1990 / FILM IMAGERY: TMDB</div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${BG};box-shadow:0 18px 45px rgba(0,0,0,.5)">${card}${side}</div>`;
}


/* A monochrome boxing-club supper programme; the film supplies every human image. */
function fmtCornerside(f,spec,menu,poster){
 const C='#eee9dc',K='#1c1d1b',I='#242420',M='#6a665c',R='#8c332f',Y='#d9b44a',RULE='#bdb6a6';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(t,c=R,e='')=>`<div style="${B};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const it=menu.all,g=[];spec.groups.forEach(x=>x.items.forEach(()=>g.push(x)));
 const main=it[2]||{},under=[0,1,3,4],rounds=['4 rounds','6 rounds','8 rounds','10 rounds'];
 const bout=(i,k)=>{const x=it[i]||{};return `<div style="border-top:2px solid ${I};padding:7px 0 0">
   <div style="display:flex;justify-content:space-between;align-items:baseline">${lab(rounds[k],R)}${lab((g[i]||{}).tab||'',M)}</div>
   <div style="${B};font-size:27px;line-height:1.02;font-weight:700;color:${I};text-transform:uppercase;margin-top:2px">${ESC(x.label||'')}</div>
   ${x.desc?`<div style="${B};font-size:17px;line-height:1.2;font-weight:500;color:${I};margin-top:2px">${ESC(x.desc)}</div>`:''}
   ${x.film?`<div style="${B};font-size:15.5px;line-height:1.2;font-style:italic;color:${M};margin-top:1px">${ESC(x.film)}</div>`:''}</div>`;};
 const card=`<section style="position:absolute;left:24px;top:24px;width:640px;height:694px;box-sizing:border-box;background:${C};padding:16px 26px 12px;box-shadow:0 10px 24px rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:space-between">
   <div style="text-align:center">${lab('Bronx boxing club / Fight night supper / Doors at 7',I)}
     <div style="${D};font-size:66px;line-height:1;letter-spacing:-.02em;color:${I};margin-top:6px">TONIGHT!</div>
     <div style="${B};font-size:20px;font-weight:600;letter-spacing:.08em;color:${M};margin-top:2px;text-transform:uppercase">${ESC(spec.tag||'')}</div></div>
   <div style="background:${K};color:${C};padding:14px 18px 16px;text-align:center">
     ${lab('Main event / 15 rounds / Middleweight, 160 lb',Y)}
     <div style="${D};font-size:50px;line-height:1.02;letter-spacing:-.02em;margin-top:4px">${ESC((main.label||'').toUpperCase())}</div>
     <div style="${B};font-size:19px;line-height:1.25;font-weight:500;margin-top:4px">${ESC(main.desc||'')}</div>
     <div style="${B};font-size:17px;font-style:italic;color:${Y};margin-top:2px">${ESC(main.film||'')} Don't overcook it.</div></div>
   ${lab('The undercard',I,'text-align:center')}
   <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:24px;row-gap:12px">${under.map(bout).join('')}</div>
   <div style="border-top:4px double ${I};padding-top:7px;display:flex;justify-content:space-between;${B};font-size:13px;font-weight:700;letter-spacing:.1em;color:${M}"><span>RINGSIDE $6.00 / NO REFUNDS</span><span>NEVER GOT ME DOWN, RAY.</span></div></section>`;
 const side=`<section style="position:absolute;left:688px;top:24px;width:359px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div><div style="${D};font-size:46px;line-height:.95;color:${C};letter-spacing:-.02em">RAGING<br>BULL</div>${lab('Jake LaMotta / The Bronx Bull / '+f.year,Y,'margin-top:8px')}</div>
   <figure style="margin:0;border:5px solid ${C}">${img('ring','Jake LaMotta in the ring',349,230,'center 25%')}</figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;border:4px solid ${C}">${img('table','Jake and Joey at the kitchen table',165,100)}</figure>
     <figure style="margin:0;border:4px solid ${C}">${img('club','Jake on stage at his nightclub',165,100)}</figure></div>
   <div style="border:2px dashed ${C};padding:9px 14px 10px">${lab('Serving cue',Y)}<div style="${B};font-size:19px;line-height:1.25;font-weight:500;color:${C};margin-top:3px">${ESC(fmtCue(f))}</div></div>
   <div style="${B};font-size:11px;letter-spacing:.14em;color:#9d978a">FILM IMAGERY: TMDB</div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 18px 38px rgba(0,0,0,.5)">${card}${side}</div>`;
}

function fmtFever(f,spec,menu,poster){
  const K='#1b1420',P='#fbf7ee',I='#1d1a1e',M='#5f5960',R='#c2362b',S="font-family:'Alfa Slab One',serif",H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const chips=[['#b5432c','No. 86','Bay Ridge Brick'],['#c99a3a','No. 77','Gravy Gold'],['#e2462f','No. 2001','Slice Red'],['#c9c7cf','No. 500','Mirror Ball'],['#e6dfc8','No. 7','Seven and Seven']];
  const chip=(it,i)=>{const c=chips[i]||chips[0],dark=i<3;return `<div style="flex:1;min-width:0;background:${P};box-shadow:0 5px 14px rgba(0,0,0,.5);display:flex;flex-direction:column">
    <div style="height:86px;background:${c[0]};padding:9px 12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
      <div style="${H};font-size:13px;font-weight:700;letter-spacing:.1em;color:${dark?'#fff':I};text-transform:uppercase">${ESC(tabs[i]||'')}</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="${H};font-size:15px;font-weight:700;color:${dark?'#fff':I}">${c[2]}</span><span style="${H};font-size:15px;font-weight:700;color:${dark?'#fff':I}">${c[1]}</span></div></div>
    <div style="padding:11px 12px 12px;flex:1">
      <div style="${H};font-size:${i===2?31:27}px;line-height:1;font-weight:700;text-transform:uppercase;color:${I}">${ESC(it.label)}</div>
      <div style="${B};font-size:15px;line-height:1.4;color:${I};margin-top:7px">${ESC(it.desc)}</div>
      ${it.film?`<div style="${B};font-size:14px;line-height:1.35;font-style:italic;color:${M};margin-top:7px">${ESC(it.film)}</div>`:''}</div></div>`};
  const pol=(k,alt,w,h,cap,rot)=>`<figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(${rot}deg);flex:none">${img(k,alt,w,h)}<figcaption style="${H};font-size:15px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${I};padding:5px 2px 6px">${cap}</figcaption></figure>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${K};overflow:hidden;box-shadow:0 16px 40px #0007">
   <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(226,70,47,.28),transparent 60%)"></div>
   <header style="${at(28,20,1015,'display:flex;justify-content:space-between;align-items:flex-end')}">
     <div><div style="${H};font-size:14px;font-weight:700;letter-spacing:.16em;color:#f0c46a">BAY RIDGE PAINT &amp; HARDWARE / 86TH STREET, BROOKLYN / 1977</div>
     <div style="${S};font-size:44px;line-height:1.05;color:#fff;margin-top:3px">Saturday Night colour card</div></div>
     <div style="text-align:right;${H};font-size:22px;font-weight:600;color:#f3d9d4;max-width:330px;line-height:1.1">${ESC(spec.tag||'')}</div></header>
   <div style="${at(28,110,1015,'display:flex;gap:14px;height:360px')}">${all.map(chip).join('')}</div>
   <div style="${at(28,492,1015,'display:flex;gap:22px;align-items:flex-start')}">
     ${pol('walk','Tony Manero walking down 86th Street','300','182','86th Street, under the El.',-1.5)}
     ${pol('dance','Tony Manero on the lit dance floor','330','182','Under the lights at the Odyssey',1.2)}
     <div style="flex:1;background:${R};padding:14px 18px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg);min-height:200px;box-sizing:border-box;display:flex;flex-direction:column">
       <div style="${H};font-size:14px;font-weight:700;letter-spacing:.12em;color:#ffd9a8">DANCE CONTEST / FIRST PRIZE $500</div>
       <div style="${S};font-size:26px;line-height:1.1;color:#fff;margin-top:6px">Watch the hair.</div>
       <div style="${B};font-size:13px;line-height:1.4;color:#fff;margin-top:8px"><b>CUE</b> ${ESC(fmtCue(f))}</div>
       <div style="${H};font-size:13px;font-weight:600;letter-spacing:.06em;color:#ffd9a8;margin-top:auto">NO ADVANCES ON PAY. ASK FOR A RAISE.</div></div>
   </div>
   <div style="${at(28,722,1015,`${B};font-size:9px;letter-spacing:.08em;color:#9c8f98;text-align:right`)}">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtBoatdrinks(f,spec,menu,poster){
  const PA='#f4f0e6',IN='#1c1a24',SO='#56525e',TL='#16807c',PK='#d9466f',YE='#f3c544',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:14px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const pk=['Session 1','Session 2','Session 3','Session 4','Last word'],pr=['$19.95','$19.95','$52.80','$9.95','Free'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:96px 1fr 92px;column-gap:14px;padding:8px 0 8px;border-bottom:1px solid #d6d0c2">
    <div><div style="${C};font-size:14px;font-weight:700;letter-spacing:.06em;color:#fff;background:${i%2?PK:TL};display:inline-block;padding:2px 7px;text-transform:uppercase">${pk[i]||''}</div><div style="${T};font-size:12px;color:${SO};margin-top:6px">TAPE ${String(i+1).padStart(2,'0')}</div></div>
    <div><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${TL}">${ESC(it.film||'')}</p></div>
    <div style="text-align:right"><div style="${C};font-size:22px;font-weight:700;color:${IN};line-height:1">${pr[i]||''}</div>${lab(ESC(gs[i]?gs[i].tab:''),PK,'margin-top:5px')}</div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(160deg,#0f3b44,#122a3a 55%,#2a1730);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff06 0 1px,#0000 1px 4px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:${PA};box-shadow:0 12px 26px #000b;box-sizing:border-box;display:flex;flex-direction:column">
    <div style="flex:none;height:12px;background:linear-gradient(90deg,${TL} 0 33%,${YE} 33% 66%,${PK} 66%)"></div>
    <div style="padding:12px 24px 0;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${IN};margin:0 0 0;padding-bottom:8px">
      <div>${lab('Afterlife Advice / Price list',PK)}<div style="${C};font-size:44px;font-weight:700;line-height:.9;color:${IN};margin-top:3px">LEAVE THEM A GOOD SUPPER</div></div>
    </div>
    <div style="padding:0 24px;display:flex;flex-direction:column;flex:1">
      <div style="${B};font-size:14px;line-height:1.4;color:${IN};padding:8px 0;border-bottom:1px solid ${IN}">Look into the camera, say what you never said. Then eat. Jimmy films every session.</div>
      ${xs.map(row).join('')}
      ${FX_SP}
      <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',PK,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
      <div style="${T};font-size:10px;color:${SO};padding:6px 0 10px">Mile-high pricing. Tapes held for loved ones. No buckwheats on the premises.</div>
    </div>
  </div>
  <header style="position:absolute;left:690px;top:20px;width:358px">
    ${lab('Denver / 1995','#8fdcd6')}
    <h1 style="${C};font-size:40px;line-height:.92;font-weight:700;text-transform:uppercase;margin:6px 0 0;color:#f4f0e6;text-shadow:none">Things to Do in Denver When You’re Dead</h1>
  </header>
  <figure style="position:absolute;left:690px;top:176px;width:358px;margin:0;background:${PA};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #000b;transform:rotate(-1deg)">${img('diner','Jimmy and his old crew in the diner booth',344,196)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Jimmy the Saint at the diner. One last job, one bad idea.</figcaption></figure>
  <div style="position:absolute;left:690px;top:470px;width:358px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:${PA};padding:6px;box-shadow:0 10px 22px #000b;transform:rotate(1.3deg)">${fmtPosterImg(f,poster,140,210)}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px">
      <div style="background:${YE};padding:10px 12px;box-shadow:0 6px 14px #0008;transform:rotate(-1.5deg)">
        ${lab('The toast',IN)}
        <div style="${C};font-size:34px;font-weight:700;line-height:.9;color:${IN};margin-top:4px">BOAT DRINKS.</div>
        <div style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:5px">Umbrella mandatory.</div>
      </div>
      <div style="border:2px solid #8fdcd6;padding:9px 11px">
        ${lab('The crew','#8fdcd6')}
        <div style="${T};font-size:13px;line-height:1.5;color:#f4f0e6;margin-top:4px">Jimmy the Saint<br>Critical Bill<br>Pieces / Franchise<br>Easy Wind</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#8fb3b6">FILM IMAGERY: TMDB</div>
  </div>`;
}


/* Southie pub supper: Boston above the counter, the bar order beside the menu. */
function fmtSouthie(f,spec,menu,poster){
 const N='#1c2422',M='#d2b27a',W='#f7f3e8',K='#1e2321',G='#2f4a3c',R='#a8281f',S='#555a55',L='#d5ccb8';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
 const lab=(t,c=S,e='')=>`<div style="${B};font-size:13px;line-height:1.25;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const ex=['A','B','C','D','E'],src=['At the bar','Costello\u2019s crowd','Costello\u2019s table','A Boston original','Costigan\u2019s order'];
 const row=(x,i)=>`<div style="display:grid;grid-template-columns:62px 1fr;column-gap:12px;padding:13px 0 13px;border-bottom:1px solid ${L}"><div style="border:2px solid ${i===2?R:K};text-align:center;padding:4px 0 3px;height:46px;box-sizing:border-box">${lab('Exhibit',i===2?R:S,'font-size:10px;letter-spacing:.08em')}<div style="${D};font-size:20px;line-height:1;color:${i===2?R:K}">${ex[i]}</div></div><div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><div style="${D};font-size:${i===2?23:20}px;line-height:1.08;color:${K}">${nm(x)}</div>${lab(src[i],G,'font-size:11.5px;white-space:nowrap')}</div><div style="${B};font-size:17.5px;line-height:1.22;color:#4a4f4b;margin-top:3px">${ESC(x.d)}</div><div style="${B};font-size:16px;line-height:1.2;font-weight:600;color:${R};margin-top:2px">${ESC(x.note||'')}</div></div></div>`;
 const flap=`<section style="${at(22,22,420,'height:698px;background:'+M+';box-shadow:0 8px 20px rgba(0,0,0,.45)')}"><div style="${at(24,22,372)}"><div style="display:flex;justify-content:space-between">${lab('Mass. State Police / S.I.U.',K)}${lab('File 2006-B',K)}</div><div style="${D};font-size:46px;line-height:.98;color:${K};margin-top:10px;letter-spacing:-.02em">THE<br>DEPARTED</div><div style="${B};font-size:20px;line-height:1.2;font-weight:600;color:${G};margin-top:8px">${ESC(spec.tag||'')}</div><figure style="margin:16px 0 0;background:#fff;padding:7px 7px 9px;transform:rotate(-1deg);box-shadow:0 4px 10px rgba(0,0,0,.3)">${img('table','Frank Costello dining at a Boston restaurant',358,232,'center 30%')}<figcaption style="display:flex;justify-content:space-between;margin-top:6px">${lab('Surveillance: Costello, F.',K,'font-size:12px')}${lab('Do not approach',R,'font-size:12px')}</figcaption></figure><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">${img('boston','The gold-domed State House',181,142)}${img('bar','Billy Costigan at the bar',181,142,'center 30%')}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px">${lab('The gold dome. Nice view.',K,'font-size:11.5px')}${lab('One cranberry juice',K,'font-size:11.5px')}</div></div><div style="${at(24,664,372,'display:flex;justify-content:space-between')}">${lab('Product of my environment',K,'font-size:11px')}<span style="${B};font-size:10px;letter-spacing:.08em;color:${K}">FILM IMAGERY: TMDB</span></div></section>`;
 const sheet=`<section aria-label="Case sheet" style="${at(456,22,592,'height:698px;background:'+W+';box-shadow:0 8px 20px rgba(0,0,0,.45)')}"><div style="${at(26,22,540)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${K};padding-bottom:8px"><div>${lab('Evidence log / Supper for four',R)}<div style="${D};font-size:30px;line-height:1.05;color:${K};margin-top:5px">Southie Supper</div></div><div style="border:3px solid ${R};padding:4px 10px;transform:rotate(-4deg);${D};font-size:17px;line-height:1;color:${R}">CONFIDENTIAL</div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid ${L};padding:7px 0">${[['Handler','Queenan / Dignam'],['Informant','Costigan, W.'],['Leak','Unknown']].map(([h,v],i)=>`<div style="${i?`border-left:1px solid ${L};padding-left:10px`:''}">${lab(h,S,'font-size:11px')}<div style="${B};font-size:17px;line-height:1.2;font-weight:700;color:${i===2?R:K}">${v}</div></div>`).join('')}</div>${xs.slice(0,5).map(row).join('')}</div><div style="${at(26,622,540,'border-top:2px solid '+K+';padding-top:8px')}">${lab('Cue',R,'font-size:12px')}<div style="${B};font-size:17px;line-height:1.2;color:${K};margin-top:2px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 18px 45px rgba(0,0,0,.5)">${flap}${sheet}</div>`;
}

function fmtPerdition(f,spec,menu,poster){
 const K='#152b2a',P='#e6ddc5',W='#f1ead6',G='#263f3b',I='#303c36',M='#686b5c',R='#765242',L='#c2b89c';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
 const art=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>art[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(art[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;font-weight:700;line-height:1.3;letter-spacing:.18em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const pr=['5¢','10¢','35¢','10¢','5¢'];
 const row=(r,i)=>`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;border-top:1px solid ${L};padding:6px 0">
   <div style="display:flex;align-items:baseline;gap:10px"><span style="${H};font-size:25px;line-height:1.05;font-weight:600;color:${G}">${ESC(r.it.label||'')}</span><span style="flex:1;border-bottom:2px dotted ${L};transform:translateY(-5px)"></span><span style="${H};font-size:24px;font-weight:600;color:${R}">${pr[i]||''}</span></div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${H};font-style:italic;font-size:16px;line-height:1.25;color:${M};margin-top:1px">${ESC(r.it.film)} <span style="${B};font-style:normal;font-size:10.5px;font-weight:700;letter-spacing:.14em;color:${R};text-transform:uppercase">/ ${ESC(r.g.tab||'')}</span></div>`:''}</div>`;
 const card=`<section style="position:absolute;left:24px;top:24px;width:604px;height:694px;box-sizing:border-box;background:${W};padding:10px;box-shadow:0 10px 24px rgba(0,0,0,.45)">
  <div style="height:100%;box-sizing:border-box;border:3px double ${G};padding:14px 24px 10px;display:flex;flex-direction:column">
   <div style="text-align:center;border-bottom:3px double ${G};padding-bottom:10px">
     ${lab('Roadside diner / Open all night / Winter 1931')}
     <div style="${H};font-size:46px;line-height:1;font-weight:600;color:${G};margin-top:4px;letter-spacing:.01em">Bill of Fare</div>
     <div style="${H};font-style:italic;font-size:20px;color:${M};margin-top:2px">${ESC(spec.brand||'')}. ${ESC(spec.tag||'')}</div></div>
   <div style="flex:1;display:flex;flex-direction:column;margin-top:4px">${rows.map(row).join('')}</div>
   <div style="border-top:3px double ${G};padding-top:7px;display:flex;justify-content:space-between;${T};font-size:11.5px;font-weight:700;color:${M}"><span>CASH ONLY. NO CHICAGO MONEY.</span><span>PHOTOGRAPHS BY MAGUIRE, ON REQUEST.</span></div></div></section>`;
 const stop=(x,name,sub,on)=>`<div style="position:absolute;left:${x}%;top:0;transform:translateX(-50%);text-align:center;width:120px"><div style="width:16px;height:16px;border-radius:50%;margin:0 auto;background:${on?'#c9a27a':P};border:3px solid ${P}"></div><div style="${H};font-size:19px;font-weight:600;color:${P};margin-top:4px;line-height:1">${name}</div><div style="${T};font-size:11px;color:#b7b19a;margin-top:2px">${sub}</div></div>`;
 const side=`<section style="position:absolute;left:652px;top:24px;width:395px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div><div style="${H};font-size:44px;line-height:.95;font-weight:500;color:${P}">Road to Perdition</div>${lab('Illinois, 1931 / The Sullivans, party of two','#c9a27a','margin-top:6px')}</div>
   <figure style="margin:0;background:${P};padding:6px">${img('diner','Sullivan at the roadside diner',383,206)}<figcaption style="${H};font-style:italic;font-size:16px;color:${I};margin-top:4px">The diner stop. Coffee, black.</figcaption></figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;background:${P};padding:5px">${img('car','Father and son on the road',182,104)}</figure>
     <figure style="margin:0;background:${P};padding:5px">${img('wake','The Rooney wake',182,104)}</figure></div>
   <div style="position:relative;height:74px;margin:0 6px"><div style="position:absolute;left:15%;right:15%;top:7px;border-top:2px dashed #b7b19a"></div>${stop(15,'Rock Island','the wake',0)}${stop(50,'Chicago','the banks',0)}${stop(85,'Perdition','the lake house',1)}</div>
   <div style="border-top:1px solid #4d6460;padding-top:8px">${lab('Serving cue','#c9a27a')}<div style="${B};font-size:15px;line-height:1.45;color:${P};margin-top:3px">${ESC(fmtCue(f))}</div><div style="${B};font-size:10px;letter-spacing:.12em;color:#8f9a8d;margin-top:6px">FILM STILLS: TMDB</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};box-shadow:0 14px 28px rgba(0,0,0,.4);${B}">${card}${side}</div>`;
}


function fmtMoodslime(f,spec,menu,poster){
  const K='#231a24',P='#f7f3ea',I='#221d22',M='#615a5f',PK='#e0428a',PL='#f6c7dc',GR='#5f8f3e',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const ids=['A','B','C','D','E'],react=['+ POSITIVE','+ DANCES','- CARPATHIAN','+ WOBBLES','+ PINK'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:46px 1fr;column-gap:14px;padding:${i?9:0}px 0 9px;${i<all.length-1?'border-bottom:1px dashed #c9bfc4':''}">
    <div style="width:42px;height:42px;border-radius:50%;background:${i===2?'#cfd6c4':PL};border:2px solid ${i===2?GR:PK};text-align:center;${T};font-size:21px;font-weight:700;line-height:40px;color:${i===2?GR:PK}">${ids[i]}</div>
    <div><div style="display:flex;justify-content:space-between;${T};font-size:10.5px;font-weight:700;letter-spacing:.08em;color:${M}"><span>SAMPLE ${ids[i]} / ${ESC((tabs[i]||'').toUpperCase())}</span><span>REACTION: <span style="color:${i===2?GR:PK};font-size:12px">${react[i]}</span></span></div>
      <div style="${H};font-size:${i===2?30:26}px;line-height:1.03;font-weight:600;color:${I};margin-top:1px">${ESC(it.label)}</div>
      <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>
      ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`;
  const sheet=`<section aria-label="Slime lab report menu" style="${at(24,22,650,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.6)`)}">
    <div aria-hidden="true" style="${at(255,-6,140,'height:26px;background:linear-gradient(#c4c4c4,#7d7d7d);border-radius:4px;box-shadow:0 2px 3px rgba(0,0,0,.4)')}"></div>
    <header style="${at(32,30,586,`border-bottom:3px solid ${I};padding-bottom:9px;display:flex;justify-content:space-between;align-items:flex-end`)}">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${PK}">FIREHOUSE LAB / NORTH MOORE ST / 1989</div><div style="${H};font-size:42px;line-height:1;font-weight:600;color:${I};margin-top:3px">Mood slime supper</div></div>
      <div style="${T};font-size:11px;line-height:1.45;text-align:right;color:${M}">TESTED BY: Dr. Spengler<br>DRAWN: 1st Ave &amp; 77th<br>WHO YOU GONNA CALL? 555-2368</div></header>
    <div style="${at(32,126,586)}">${all.map(row).join('')}</div>
    <footer style="${at(32,636,586,`border-top:3px solid ${I};padding-top:8px;display:flex;gap:12px;align-items:baseline`)}"><span style="${T};font-size:11px;font-weight:700;color:${PK};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span></footer>
  </section>`;
  const right=`<div style="${at(700,22,347,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#1a131a;border:8px solid #9c7a3c;box-shadow:0 6px 16px rgba(0,0,0,.6)">${img('vigo','Ray examining Vigo’s portrait in the museum',331,214,'center 25%')}</figure>
    <div style="${T};font-size:11px;line-height:1.4;color:${PL};margin-top:8px">MANHATTAN MUSEUM OF ART / VIGO, SCOURGE OF CARPATHIA. HE WANTS A BABY BY MIDNIGHT, NEW YEAR’S EVE.</div>
    <figure style="margin:14px 0 0;background:${P};padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(1.2deg)">${img('toaster','The Ghostbusters around the mood slime and toaster experiment',335,226)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">Sample B on the toaster. Play it something upbeat.</figcaption></figure>
    <div style="margin-top:auto;background:${PK};padding:12px 16px;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg)">
      <div style="${H};font-size:26px;line-height:1.05;font-weight:600;color:#fff">${ESC(spec.tag||'')}</div>
      <div style="${T};font-size:11px;color:#ffe6f1;margin-top:5px">KEEP SLIME POSITIVE. SING TO IT IF NEEDED.</div></div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#9b8f99;margin-top:10px;text-align:right">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${K};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 85% 100%,rgba(224,66,138,.28),transparent 60%)"></div>${sheet}${right}</div>`;
}


/* Second helpings: an after-hours supper board, with real 1991 lair, chemistry and club frames. */
function fmtOoze(f,spec,menu,poster){
  const KR='#c99a62',WH='#fbfaf3',IN='#1b1d17',GN='#4f9a2a',OZ='#8be04e',RD='#c3311f',SO='#4f4c43',V="font-family:'Bevan',serif",C="font-family:'Barlow Condensed',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:14px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const pr=['4.00','19.91','12.00','2.50','0.99'],qt=['1','4','2','4','5'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:34px 1fr 64px;column-gap:10px;padding:9px 0 9px;border-bottom:2px dashed #c9c6b6">
    <div style="${C};font-size:22px;font-weight:700;color:${GN};line-height:1;padding-top:2px">${qt[i]||1}x</div>
    <div><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].tab:''),GN,'white-space:nowrap')}</div>${it.desc?`<p style="${C};font-size:16px;font-weight:500;line-height:1.25;margin:3px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${C};font-size:15px;font-weight:600;line-height:1.25;margin:2px 0 0;color:${RD}">${ESC(it.film||'')}</p></div>
    <div style="${C};font-size:22px;font-weight:700;color:${IN};text-align:right;line-height:1;padding-top:2px">${pr[i]||''}</div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(135deg,#d3a76d,${KR} 50%,#b98a52);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#0000 0 6px,#00000008 6px 7px)"></div>
  <div aria-hidden="true" style="position:absolute;left:640px;top:250px;width:520px;height:520px;border-radius:50%;border:16px solid #3f7d2233;box-sizing:border-box"></div>
  <div style="position:absolute;left:28px;top:16px;width:590px;height:710px;background:${WH};box-shadow:0 10px 22px #0006;transform:rotate(-.7deg);box-sizing:border-box;padding:14px 22px 10px;display:flex;flex-direction:column">
    <div aria-hidden="true" style="position:absolute;left:230px;top:-12px;width:130px;height:28px;background:#e9e3c8d0;transform:rotate(2deg)"></div>
    <div style="text-align:center;border-bottom:3px solid ${IN};padding-bottom:8px">
      ${lab('Delivery ticket / Order #1991',RD)}
      <div style="${V};font-size:40px;line-height:1;color:${GN};margin-top:4px">SECOND HELPINGS</div>
      <div style="${C};font-size:17px;font-weight:600;color:${IN};margin-top:4px">${ESC(spec.tag||'')}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;${C};font-size:15px;font-weight:600;line-height:1.35;color:${IN};padding:6px 0;border-bottom:1px solid ${IN}"><span>DELIVER TO: The old subway station</span><span style="text-align:right">DRIVER: Keno</span><span>ORDER FOR: 4 brothers + 1 rat</span><span style="text-align:right">TIME: 30 min or less</span></div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:3px solid ${IN};padding-top:6px"><span style="${C};font-size:20px;font-weight:700;color:${IN}">TOTAL</span><span style="${C};font-size:15px;font-weight:600;color:${SO}">No anchovies. Ever.</span><span style="${V};font-size:22px;color:${IN}">$39.40</span></div>
    <div style="display:flex;gap:10px;align-items:baseline;margin-top:6px">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${C};font-size:16px;font-weight:500;line-height:1.25;color:${IN}">${ESC(fmtCue(f))}</span></div>
  </div>
  <header style="position:absolute;left:650px;top:22px;width:396px">
    ${lab('New York City / 1991','#2c4a17')}
    <h1 style="${V};font-size:40px;line-height:1;margin:6px 0 0;color:#1b2a12;text-shadow:none">Teenage Mutant Ninja Turtles II</h1>
    <div style="${C};font-size:22px;font-weight:700;color:#f6f0dc;background:${GN};display:inline-block;padding:2px 10px;margin-top:6px;letter-spacing:.04em">THE SECRET OF THE OOZE</div>
  </header>
  <figure style="position:absolute;left:650px;top:186px;width:396px;margin:0;background:${WH};padding:7px 7px 8px;box-sizing:border-box;box-shadow:0 10px 22px #0006;transform:rotate(1deg)">${img('lair','The Turtles at home in their new lair',382,204)}<figcaption style="${C};font-size:16px;font-weight:600;line-height:1.25;color:${IN};margin-top:6px">New lair, same order. Leave it at the grate.</figcaption></figure>
  <div style="position:absolute;left:650px;top:462px;width:396px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:${WH};padding:6px;box-shadow:0 10px 22px #0006;transform:rotate(-1.5deg)">${fmtPosterImg(f,poster,140,210)}</div>
    <div style="flex:1;background:#f3d531;border:4px solid ${IN};padding:10px 12px;box-shadow:0 8px 16px #0006;transform:rotate(1.2deg)">
      <div style="display:flex;gap:8px;align-items:center"><div style="width:30px;height:30px;border-radius:50%;background:${OZ};border:3px solid ${IN};box-sizing:border-box"></div>${lab('T.C.R.I. / Mutagen',IN)}</div>
      <div style="${V};font-size:23px;line-height:1.05;color:${IN};margin-top:8px">LAST CANISTER</div>
      <div style="${C};font-size:16px;font-weight:600;line-height:1.25;color:${IN};margin-top:6px">Handle with care. Do not feed to wolves or snapping turtles.</div>
      <div style="${C};font-size:13px;font-weight:700;letter-spacing:.08em;color:${IN};margin-top:8px;border-top:2px solid ${IN};padding-top:5px">LEO / RAPH / DONNIE / MIKEY</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${C};font-size:10px;font-weight:600;color:#4a3a22">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</div>
  </div>`;
}

function fmtPizzaTime(f,spec,menu,poster){
  const N='#b98d58',W='#fbf6e8',K='#1d1f24',R='#c8202b',U='#1f3f8f',S='#5a5550',L='#d9cfb8',B="font-family:'Libre Franklin',sans-serif",C="font-family:'Barlow Condensed',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=S,e='')=>`<div style="${C};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const qty=[2,1,8,1,1],price=['4.50','3.25','29.00','5.00','2.50'];
  const row=(x,i)=>`<div style="display:grid;grid-template-columns:36px 1fr 66px;border-bottom:1px solid ${L};${i===2?'background:#fde9c8;':''}"><div style="${T};font-size:18px;line-height:1.2;font-weight:700;color:${U};padding:10px 0 0 6px">${qty[i]}</div><div style="padding:9px 10px 10px 10px;border-left:1px solid ${L}"><div style="${C};font-size:${i===2?29:24}px;line-height:1;font-weight:700;color:${K};text-transform:uppercase">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.38;color:#45464a;margin-top:3px">${ESC(x.d)}</div><div style="${T};font-size:13px;line-height:1.3;color:${U};margin-top:3px">${ESC(x.note||'')}</div></div><div style="border-left:1px solid ${L};${T};font-size:17px;line-height:1.2;font-weight:700;color:${U};text-align:right;padding:10px 6px 0 0">${price[i]}</div></div>`;
  const slip=`<section aria-label="Delivery slip" style="${at(26,22,590,'height:698px;background:'+W+';box-shadow:3px 8px 18px rgba(60,35,10,.45);transform:rotate(-.5deg)')}"><div style="height:10px;background:${R}"></div><div style="${at(22,24,546)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${K};padding-bottom:7px"><div><div style="${C};font-size:54px;line-height:.9;font-weight:700;color:${R};text-transform:uppercase;letter-spacing:.01em">Pizza Time</div>${lab('Mr. Aziz / Delivery slip / Spider-Man 2, 2004',K,'margin-top:6px')}</div><div style="text-align:right">${lab('Order no.',R)}<div style="${C};font-size:34px;line-height:1;font-weight:700;color:${K}">#2004</div></div></div><div style="display:grid;grid-template-columns:1.3fr 1fr 1fr;border-bottom:1px solid ${L}">${[['Driver','P. Parker'],['Promised','29 min'],['Arrived','Late']].map(([h,v],i)=>`<div style="padding:6px 8px 7px;${i?`border-left:1px solid ${L}`:''}">${lab(h,S,'font-size:11px')}<div style="${T};font-size:15px;line-height:1.2;font-weight:700;color:${i===2?R:U};margin-top:2px">${v}</div></div>`).join('')}</div>${xs.slice(0,5).map(row).join('')}<div style="display:grid;grid-template-columns:1fr 110px;align-items:end;padding-top:9px"><div style="${T};font-size:13px;line-height:1.35;color:${U}">Late again. Mr. Aziz wants a word.</div><div style="text-align:right">${lab('Total',R)}<div style="${C};font-size:30px;line-height:1;font-weight:700;color:${K}">$44.25</div></div></div></div></section>`;
  const stamp=`<div style="width:150px;height:150px;border-radius:50%;border:5px solid ${R};display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(-12deg);box-sizing:border-box"><div>${lab('Hot & fresh',R,'font-size:12px')}<div style="${C};font-size:34px;line-height:.95;font-weight:700;color:${R};text-transform:uppercase">Pizza<br>Time</div>${lab('New York',R,'font-size:12px')}</div></div>`;
  const side=`<aside style="${at(646,22,400,'height:698px;display:flex;flex-direction:column')}"><figure style="margin:0;background:#fff;padding:8px 8px 10px;box-shadow:0 6px 14px rgba(60,35,10,.4);transform:rotate(1.2deg)">${img('delivery','Peter Parker carrying a stack of pizza boxes on his delivery',384,250,'center 30%')}<figcaption style="${T};font-size:12.5px;line-height:1.3;color:${K};margin-top:7px">A STACK OF PIES. ONE BIKE. ONE VERY LATE DELIVERY BOY.</figcaption></figure><div style="display:flex;gap:16px;align-items:center;margin-top:18px">${img('may','Aunt May at her kitchen table',230,150)}${stamp}</div><div style="margin:18px 0 0 24px;width:300px;background:#f6e27a;padding:11px 14px 12px;transform:rotate(-1.5deg);box-shadow:0 4px 10px rgba(60,35,10,.35)">${lab('Note on the door',K,'font-size:12px')}<div style="${T};font-size:14px;line-height:1.35;color:${K};margin-top:4px">Ursula brought milk and chocolate cake. Say thank you.</div></div>${FX_SP}<div style="background:${W};padding:12px 14px;border-left:6px solid ${R};box-shadow:0 4px 10px rgba(60,35,10,.3)">${lab('Cue',R)}<div style="${B};font-size:14px;line-height:1.45;color:${K};margin-top:4px">${ESC(fmtCue(f))}</div></div><div style="display:flex;justify-content:space-between;margin-top:12px">${lab('Rent due: see Mr. Ditkovich',K,'font-size:12px')}<span style="${T};font-size:9px;color:${K};letter-spacing:.06em">FILM IMAGERY: TMDB</span></div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};${B};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),rgba(0,0,0,.12))"></div>${slip}${side}</div>`;
}


function fmtMayTable(f,spec,menu,poster){
  const P='#efe8d8',I='#1d2430',R='#a23f37',M='#5c5a52',D='#172c47',L='#b9b09c',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const cred=s=>`<div style="${T};font-size:11px;line-height:1.3;color:${M};margin-top:4px;text-align:right">${ESC(s)}</div>`;
  const it=menu.all,gs=spec.groups,tab=[];gs.forEach(g=>g.items.forEach(()=>tab.push(g)));
  const dish=(i,big)=>{const x=it[i]||{};return `<article>${lab((tab[i]||{}).h||'')}<h3 style="${H};font-size:${big?30:23}px;line-height:1.02;font-weight:600;color:${I};margin:4px 0 0">${ESC(x.label||'')}</h3>${x.desc?`<p style="${B};font-size:${big?15:13.5}px;line-height:1.45;color:${I};margin:5px 0 0">${ESC(x.desc)}</p>`:''}${x.film?`<p style="${H};font-style:italic;font-size:${big?18:16}px;line-height:1.25;color:${M};margin:3px 0 0">${ESC(x.film)}</p>`:''}</article>`;};
  const mast=`<header style="position:absolute;left:24px;top:20px;width:1023px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;${T};font-size:11px;font-weight:700;color:${M};letter-spacing:.06em"><span>THANKSGIVING EDITION</span><span>NEW YORK'S FINEST DAILY NEWSPAPER</span><span>FIFTY CENTS</span></div>
    <div style="${H};font-size:64px;line-height:.95;font-weight:600;letter-spacing:.02em;color:${I};text-align:center;margin-top:2px">DAILY BUGLE</div>
    <div style="border-top:3px solid ${I};border-bottom:1px solid ${I};margin-top:6px;padding:4px 0;display:flex;justify-content:space-between;${B};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${I}"><span>Food &amp; family / Section F</span><span>Queens, ${ESC(f.year)}</span><span>Editor in chief: J. Jonah Jameson</span></div></header>`;
  const left=`<section style="position:absolute;left:24px;top:148px;width:300px;height:570px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="${H};font-size:25px;line-height:1.02;font-weight:600;color:${I}">WALL-CRAWLER SEEN OVER QUEENS. THREAT OR MENACE?</div>
    <figure style="margin:0">${img('identity','Spider-Man crawling down a Manhattan tower',300,150)}${cred('Photo: Peter Parker')}</figure>
    <div style="border:2px solid ${I};padding:9px 12px 10px">${lab('Classified',I)}<div style="${H};font-size:22px;line-height:1.05;font-weight:600;color:${R};margin-top:3px">WIN $3,000</div><div style="${B};font-size:13px;line-height:1.4;color:${I};margin-top:3px">Last three minutes in the ring with Bone Saw. Masked entrants welcome.</div></div>
    <figure style="margin:0">${img('mayben','Aunt May and Uncle Ben at home in Queens',300,132,'center 35%')}<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:4px"><span style="${H};font-style:italic;font-size:17px;color:${R}">With great power... pass the gravy.</span><span style="${T};font-size:11px;color:${M}">May &amp; Ben</span></div></figure></section>`;
  const right=`<section style="position:absolute;left:346px;top:148px;width:701px;height:570px;border-left:1px solid ${I};padding-left:20px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
    <div>${lab(spec.brand||'')}<div style="${H};font-size:36px;line-height:1;font-weight:600;color:${I};margin-top:2px;white-space:nowrap">Thanksgiving at 20 Ingram Street</div><div style="${H};font-style:italic;font-size:20px;color:${M};margin-top:2px">${ESC(spec.tag||'')}</div></div>
    <div style="display:grid;grid-template-columns:270px 1fr;column-gap:20px;align-items:start;border-top:1px solid ${L};padding-top:12px">
      <figure style="margin:0">${img('thanksgiving','Peter at the Thanksgiving table with Norman Osborn',270,146)}${cred('Forest Hills. Photo: staff')}</figure>${dish(2,true)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:18px;border-top:1px solid ${L};padding-top:10px">
      <div style="display:flex;flex-direction:column;gap:8px">${dish(0)}${dish(1)}</div>
      <div style="display:flex;flex-direction:column;gap:8px;border-left:1px solid ${L};padding-left:16px">${dish(3)}${dish(4)}</div></div>
    <div style="background:${D};color:${P};padding:8px 14px;display:flex;gap:14px;align-items:baseline">${lab('Wrestling cue','#e8c17c','white-space:nowrap')}<span style="${B};font-size:14px;line-height:1.35">${ESC(fmtCue(f))}</span><span style="margin-left:auto;${T};font-size:10px;white-space:nowrap;color:#c9c2b0">IMAGERY: TMDB</span></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};box-shadow:0 18px 40px #0008"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(110deg,#fff5,transparent 50%,#b8a88022)"></div>${mast}${left}${right}</div>`;
}


/* A suite-supper folio: real 1992 limousine, hotel staff and Christmas-suite photography. */
function fmtSuite(f,spec,menu,poster){
 const G='#1f4535',P='#fbf6ea',I='#24332a',M='#6d6556',GOLD='#b8995a',LINE='#d6c6a6',R='#a3262a';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},all=menu.all;
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
 const amt=['48.50','96.00','212.50','485.00','39.93'];
 const lab=(t,c=GOLD)=>`<div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c}">${t}</div>`;
 const row=(it,i)=>`<div style="padding:${i?8:0}px 0 8px;border-bottom:1px solid ${LINE}">
   <div style="display:flex;gap:10px;align-items:baseline"><span style="${H};font-size:${i===2?29:25}px;line-height:1.05;font-weight:600;color:${I}">${ESC(it.label)}</span>${lab(ESC(tabs[i]||''))}<span style="flex:1;border-bottom:1px dotted ${LINE};align-self:center"></span><span style="${B};font-size:16px;font-weight:600;color:${I}">${amt[i]}</span></div>
   <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>${it.film?`<div style="${H};font-size:16px;line-height:1.25;font-style:italic;color:${M};margin-top:1px">${ESC(it.film)}</div>`:''}</div>`;
 const bill=`<section aria-label="Hotel guest folio menu" style="${at(392,22,655,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.55)`)}">
   <div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid ${GOLD}"></div>
   <header style="${at(34,26,587,'display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid '+I+';padding-bottom:10px')}">
     <div>${lab('Central Park South / Christmas 1992')}<div style="${H};font-size:40px;line-height:1;font-weight:600;color:${I};margin-top:4px">Guest Folio</div></div>
     <div style="text-align:right">${lab('Room')}<div style="${H};font-size:40px;line-height:1;font-weight:600;color:${R}">411</div></div></header>
   <div style="${at(34,104,587,`display:flex;justify-content:space-between;${B};font-size:13px;color:${I}`)}"><span><b>Guest:</b> Mr. P. McCallister (card)</span><span><b>Checked in by:</b> Kevin</span><span><b>Concierge:</b> Hector</span></div>
   <div style="${at(34,132,587)}">${all.map(row).join('')}
     <div style="display:flex;gap:10px;align-items:baseline;padding:7px 0;border-bottom:1px solid ${LINE}"><span style="${H};font-size:19px;font-style:italic;color:${M}">Limousine, white, with a cheese pizza in the back</span><span style="flex:1;border-bottom:1px dotted ${LINE};align-self:center"></span><span style="${B};font-size:16px;font-weight:600;color:${I}">85.50</span></div></div>
   <div style="${at(34,630,587,'display:flex;justify-content:space-between;align-items:flex-end')}">
     <div style="${B};font-size:13px;line-height:1.35;color:${I};max-width:330px"><b style="color:${GOLD};letter-spacing:.1em">CUE</b> ${ESC(fmtCue(f))}</div>
     <div style="text-align:right">${lab('Room service total',M)}<div style="${H};font-size:36px;line-height:1;font-weight:600;color:${R}">$967.43</div></div></div>
 </section>`;
 const left=`<div style="${at(24,22,344,'height:698px;display:flex;flex-direction:column')}">
   <div style="${H};font-size:40px;line-height:1;font-weight:600;color:${P}">Home Alone 2</div>
   <div style="${H};font-size:21px;font-style:italic;color:${LINE};margin-top:4px">${ESC(spec.tag||'')}</div>
   <figure style="margin:16px 0 0;border:1px solid ${GOLD};padding:5px">${img('kevin','Kevin McCallister in New York',332,200,'center 30%')}</figure>
   <figure style="margin:14px 0 0;border:1px solid ${GOLD};padding:5px">${img('service','Room service arrives at Kevin’s suite',332,214)}</figure>
   <div style="margin-top:auto;background:#f3e3c4;padding:12px 16px;transform:rotate(-1.5deg);box-shadow:0 4px 10px rgba(0,0,0,.4);border-left:6px solid ${R}">
     ${lab('Gift tag / from Mr. Duncan’s Toy Chest',R)}
     <div style="${H};font-size:20px;line-height:1.2;font-weight:600;color:${I};margin-top:3px">One turtle dove for you, one for a friend. Merry Christmas, ya filthy animal.</div></div>
   <div style="${B};font-size:9px;letter-spacing:.08em;color:${LINE};margin-top:10px">FILM IMAGERY: TMDB</div>
 </div>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${G};box-shadow:0 15px 34px rgba(0,0,0,.42)">
  <div aria-hidden="true" style="position:absolute;inset:8px;border:1px solid rgba(184,153,90,.5)"></div>${left}${bill}</div>`;
}

function fmtNightshift(f,spec,menu,poster){
  const PA='#eef0e2',IN='#1e1e1c',SO='#55584c',RD='#b3261e',GR='#9fae8c',YE='#f2c230',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:13px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const trips=[['11:40P','','Times Sq','$2.10'],['12:55A','','Cafeteria','$1.95'],['3:00A','','Uptown','$4.40'],['4:10A','','E. 13th St','$12.50'],['5:30A','','Garage','$0.00']];
  const row=(it,i)=>{const t=trips[i]||trips[0];return `<div style="display:grid;grid-template-columns:30px 104px 1fr 78px;border-bottom:1px solid ${GR}">
    <div style="border-right:1px solid ${GR};${T};font-size:15px;font-weight:700;color:${SO};text-align:center;padding-top:11px">${i+1}</div>
    <div style="border-right:1px solid ${GR};padding:10px 8px 0"><div style="${T};font-size:14px;font-weight:700;color:${RD}">${t[0]}</div><div style="${T};font-size:12px;line-height:1.35;color:${SO};margin-top:4px;white-space:nowrap;letter-spacing:-.05em">to ${t[2]}</div></div>
    <div style="padding:8px 12px 8px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><h3 style="${C};font-size:24px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].tab:''),RD,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${B};font-size:13px;line-height:1.35;font-style:italic;margin:3px 0 0;color:${SO}">${ESC(it.film||'')}</p></div>
    <div style="border-left:1px solid ${GR};${T};font-size:16px;font-weight:700;color:${IN};text-align:right;padding:11px 8px 0">${t[3]}</div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#141414;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 85% 15%,#b3261e55,#0000 45%),radial-gradient(ellipse at 70% 90%,#2a4f6e66,#0000 50%)"></div>
    <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:${PA};box-shadow:0 10px 24px #000c;box-sizing:border-box;padding:14px 20px 12px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${IN};padding-bottom:6px">
      <div>${lab('Driver’s daily trip record / Night shift',RD)}<div style="${C};font-size:46px;font-weight:700;line-height:.9;color:${IN};margin-top:3px">TRIP SHEET</div></div>
      <div style="${T};font-size:13px;line-height:1.45;color:${IN};text-align:right">DATE: May 10<br>SHIFT: 6P to 6A</div>
    </div>
    <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr;${T};font-size:13px;color:${IN};padding:6px 0;border-bottom:1px solid ${IN}"><span>DRIVER: Bickle, T.</span><span>ANY TIME</span><span style="text-align:right">ANYWHERE</span></div>
    <div style="display:grid;grid-template-columns:30px 104px 1fr 78px;border-bottom:2px solid ${IN};padding:6px 0 4px">${lab('#','','text-align:center')}${lab('Time / route','','padding-left:8px')}${lab('Order','','padding-left:12px')}${lab('Fare','','text-align:right;padding-right:8px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
  </div>
  <header style="position:absolute;left:692px;top:26px;width:356px">
    ${lab('New York / 1976','#f2c230')}
    <h1 style="${C};font-size:84px;line-height:.82;font-weight:700;text-transform:uppercase;margin:6px 0 0;color:#f3efe2;text-shadow:none">Taxi<br>Driver</h1>
    <div style="${B};font-size:15px;font-style:italic;line-height:1.35;color:#d8d2c2;margin-top:8px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:692px;top:236px;width:356px;margin:0;background:#f3efe2;padding:7px 7px 9px;box-sizing:border-box;box-shadow:0 10px 22px #000c;transform:rotate(-1deg)">${img('cab','Travis Bickle in his cab at night',342,186)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:7px">Nights only. Any borough. He doesn’t sleep anyway.</figcaption></figure>
  <div style="position:absolute;left:692px;top:494px;width:356px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#f3efe2;padding:6px;box-shadow:0 10px 22px #000c;transform:rotate(1.4deg)">${fmtPosterImg(f,poster,132,198)}</div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;padding-top:4px">
      <div style="width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#f1ece0 70%,#d8d0bd);border:5px solid #1f3d78;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 6px 14px #000c">
        <div style="${C};font-size:15px;font-weight:700;letter-spacing:.08em;color:${RD}">WE ARE</div><div style="${C};font-size:24px;font-weight:700;line-height:.95;color:#1f3d78">THE PEOPLE</div><div style="${C};font-size:13px;font-weight:700;letter-spacing:.12em;color:${IN};margin-top:4px">PALANTINE</div>
      </div>
      <div style="${B};font-size:13px;line-height:1.35;color:#d8d2c2;text-align:center">Badge from the campaign office. Ask for Betsy.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#8f8f88">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtSouthbound(f,spec,menu,poster){
  const D='#1d2128',P='#f3ead2',K='#1f2328',A='#b5512c',S='#5d5a50',L='#cdbf9c',O='#e8902f',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=A,e='')=>`<div style="${T};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const stops=['42nd Street','The Automat','Miami, Fla.','Southbound','The diner'],fares=['.25','.10','$20','$0','.05'];
  const row=(x,i)=>`<div style="display:grid;grid-template-columns:104px 1fr 62px;border-bottom:1px dashed ${L}"><div style="padding:11px 6px 10px 0">${lab('Stop '+(i+1),S,'font-size:10.5px')}<div style="${T};font-size:13.5px;line-height:1.25;font-weight:700;color:${K};margin-top:2px">${stops[i]}</div></div><div style="padding:9px 12px 10px 12px;border-left:1px solid ${L}"><div style="${H};font-size:${i===2?32:26}px;line-height:1;font-weight:600;color:${K}">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.4;color:${S};margin-top:4px">${ESC(x.d)}</div><div style="${H};font-size:16.5px;line-height:1.2;font-style:italic;color:${A};margin-top:2px">${ESC(x.note||'')}</div></div><div style="border-left:1px solid ${L};padding:12px 0 0;text-align:right">${lab('Fare',S,'font-size:10px')}<div style="${T};font-size:19px;line-height:1.1;font-weight:700;color:${K};margin-top:2px">${fares[i]}</div></div></div>`;
  const ticket=`<section aria-label="Bus ticket menu" style="${at(24,24,664,'height:694px;background:'+P+';box-shadow:0 10px 24px rgba(0,0,0,.55);border-radius:6px')}"><div style="${at(26,22,612)}"><div style="display:flex;justify-content:space-between;align-items:baseline">${lab('Passenger ticket / One way / Not transferable')}${lab('No. 1969',K)}</div><div style="display:flex;align-items:baseline;gap:14px;margin-top:10px;border-bottom:3px solid ${K};padding-bottom:10px"><div style="${H};font-size:46px;line-height:1;font-weight:600;color:${K}">New York</div><div style="${T};font-size:18px;font-weight:700;color:${A}">TO</div><div style="${H};font-size:46px;line-height:1;font-weight:600;font-style:italic;color:${O}">Miami</div><div style="margin-left:auto;text-align:right">${lab('Midnight Cowboy',K)}${lab('Supper for four',S)}</div></div>${xs.slice(0,5).map(row).join('')}</div><div style="${at(0,598,664,'height:96px;border-top:2px dashed '+S+';background:#ece0c0;border-radius:0 0 6px 6px')}"><div style="${at(26,14,612,'display:grid;grid-template-columns:1fr .8fr 1.5fr;column-gap:18px')}"><div>${lab('Stub / retain')}<div style="${T};font-size:14px;line-height:1.3;font-weight:700;color:${K};margin-top:4px">NEW YORK, N.Y.<br>to MIAMI, FLA.</div></div><div>${lab('Passengers',S)}<div style="${T};font-size:14px;line-height:1.3;font-weight:700;color:${K};margin-top:4px">BUCK, J.<br>RIZZO, E.</div></div><div>${lab('Conditions',S)}<div style="${T};font-size:12px;line-height:1.35;color:${K};margin-top:4px">Boots ride free. Pedestrians: I'm walkin' here!</div></div></div><span style="${at(526,78,112,'text-align:right;'+T+';font-size:9px;color:'+S+';letter-spacing:.06em')}">FILM IMAGERY: TMDB</span></div></section>`;
  const side=`<aside style="${at(712,24,335,'height:694px;display:flex;flex-direction:column')}"><figure style="margin:0;background:#f4f1e8;padding:8px 8px 10px;transform:rotate(-1deg)">${img('identity','Joe Buck and Ratso Rizzo on the city street',319,262,'center 30%')}<figcaption style="${T};font-size:12px;line-height:1.3;color:${K};margin-top:7px;letter-spacing:.04em">JOE BUCK AND RATSO RIZZO, 1969.</figcaption></figure><figure style="margin:16px 0 0">${img('bus','Joe Buck and Ratso Rizzo on the bus south',335,196)}<figcaption style="${T};font-size:12px;line-height:1.3;color:#e6dcc4;margin-top:7px;letter-spacing:.04em">THE BUS SOUTH. SUN, COCONUTS, ORANGE JUICE.</figcaption></figure>${FX_SP}<div style="border-top:2px solid ${O};padding-top:10px">${lab('Cue',O)}<div style="${B};font-size:14px;line-height:1.45;color:#f0ebdf;margin-top:5px">${ESC(fmtCue(f))}</div></div><div style="${H};font-size:24px;line-height:1.1;font-style:italic;color:${O};margin-top:12px">${ESC(spec.tag||'')}</div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 85% 0%,rgba(232,144,47,.18),transparent 60%)"></div>${ticket}${side}</div>`;
}


/* A Brooklyn takeaway handbill beneath three actual views of the film's long, hot afternoon. */
function fmtBrooklyn(f,spec,menu,poster){
 const N='#4a2921',P='#f0e1c6',SL='#e6ead8',I='#3d3127',R='#9c4530',M='#786453',Y='#f1dab0',G='#55704f',RULE='#b9c2a8';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(t,c=G,e='')=>`<div style="${B};font-size:12px;line-height:1.25;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const amt=[['1','75'],['2','50'],['8','00'],['','25'],['1','20']];
 const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:1fr 70px 38px;align-items:center;border-top:1px solid ${RULE}">
   <div style="padding:4px 14px 4px 0"><div style="display:flex;align-items:baseline;gap:9px"><span style="${B};font-size:24px;line-height:1.05;font-weight:700;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',R)}</div>
   ${r.it.desc?`<div style="${B};font-size:17px;line-height:1.2;font-weight:500;color:${I};margin-top:1px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${B};font-size:15px;line-height:1.2;font-style:italic;color:${M};margin-top:1px">${ESC(r.it.film)}</div>`:''}</div>
   <div style="${D};font-size:20px;color:${I};text-align:right;padding-right:6px;border-left:1px solid ${G};align-self:stretch;display:flex;align-items:center;justify-content:flex-end">${amt[i][0]}</div>
   <div style="${D};font-size:20px;color:${I};text-align:center;border-left:1px dotted ${G};align-self:stretch;display:flex;align-items:center;justify-content:center">${amt[i][1]}</div></div>`;
 const slip=`<section style="position:absolute;left:418px;top:24px;width:629px;height:694px;box-sizing:border-box;background:${SL};padding:8px;box-shadow:0 8px 20px rgba(0,0,0,.45)">
  <div style="height:100%;box-sizing:border-box;border:2px solid ${G};outline:1px solid ${G};outline-offset:-6px;padding:12px 18px 8px;display:flex;flex-direction:column">
   <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px double ${G};padding-bottom:9px">
     <div>${lab('Brooklyn savings / Teller’s copy')}<div style="${D};font-size:29px;line-height:1.05;color:${G};margin-top:3px;letter-spacing:-.02em">WITHDRAWAL TICKET</div><div style="${B};font-size:18px;font-weight:600;color:${M};margin-top:2px">${ESC(spec.brand||'')}</div></div>
     <div style="text-align:right">${lab('Date')}<div style="${B};font-size:22px;font-weight:700;color:${I}">AUG 22, 1972</div>${lab('Temp. outside',G,'margin-top:4px')}<div style="${B};font-size:20px;font-weight:700;color:${R}">TOO HOT</div></div></div>
   <div style="display:grid;grid-template-columns:1.2fr 1fr;border-bottom:2px solid ${G}">
     <div style="padding:5px 0">${lab('Account holder')}<div style="${B};font-size:20px;font-weight:700;color:${I}">SONNY WORTZIK</div></div>
     <div style="padding:5px 12px;border-left:1px solid ${RULE}">${lab('Transfer to')}<div style="${B};font-size:20px;font-weight:700;color:${I}">SAL: “WYOMING”</div></div></div>
   <div style="display:grid;grid-template-columns:1fr 70px 38px;padding:5px 0 3px">${lab('Items withdrawn')}${lab('$',G,'text-align:right;padding-right:6px')}${lab('¢',G,'text-align:center')}</div>
   <div style="flex:1;min-height:0;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="display:flex;justify-content:space-between;align-items:center;border-top:3px double ${G};padding-top:7px">
     <div style="${B};font-size:13px;font-weight:700;letter-spacing:.1em;color:${M}">CASH ON HAND IN THE VAULT: $1,100.00</div>
     <div style="border:3px solid ${R};color:${R};padding:2px 10px;${D};font-size:17px;transform:rotate(-4deg)">ATTICA!</div></div></div></section>`;
 const left=`<section style="position:absolute;left:24px;top:24px;width:370px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div><div style="${D};font-size:40px;line-height:1;letter-spacing:-.03em;color:${Y}">DOG DAY AFTERNOON</div><div style="${B};font-size:21px;font-weight:600;color:#dfbea0;margin-top:6px">${ESC(spec.tag||'')} Brooklyn, ${ESC(f.year)}.</div></div>
   <figure style="margin:0;border:5px solid ${P}">${img('street','Sonny outside the Brooklyn bank with the street crowd',360,214)}</figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;border:5px solid ${P}">${img('bank','Sonny with the people inside the bank',170,104)}</figure>
     <figure style="margin:0;border:5px solid ${P}">${img('summer','New York summer heat',170,104)}</figure></div>
   <div style="background:${P};padding:10px 14px 11px;border-left:6px solid ${R}">${lab('Serving cue',R)}<div style="${B};font-size:19px;line-height:1.25;font-weight:600;color:${I};margin-top:3px">${ESC(fmtCue(f))}</div></div>
   <div style="${B};font-size:12px;letter-spacing:.12em;color:#d1aa8e">FILM IMAGERY: TMDB</div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 18px 38px rgba(0,0,0,.5)">${left}${slip}</div>`;
}

function fmtSerpico(f,spec,menu,poster){
  const W='#2c3a2f',P='#eef2e3',G='#2f6b4a',L='#a9c6ad',I='#1d2620',M='#56605a',R='#b23524',S="font-family:'Alfa Slab One',serif",H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const prices=['.95','1.65','1.85','.40','.15'],qty=['2','2','4','6','4'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:44px 1fr 74px;border-bottom:1px solid ${L}">
    <div style="border-right:1px solid ${L};${H};font-size:24px;font-weight:700;color:${G};text-align:center;padding-top:8px">${qty[i]}</div>
    <div style="padding:10px 14px 11px"><div style="display:flex;gap:10px;align-items:baseline"><span style="${H};font-size:${i===2?30:25}px;line-height:1.02;font-weight:700;text-transform:uppercase;color:${I}">${ESC(it.label)}</span><span style="${B};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${G}">${ESC(tabs[i]||'')}</span></div>
      <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:2px">${ESC(it.desc)}</div>${it.film?`<div style="${B};font-size:13px;line-height:1.35;font-style:italic;color:${M};margin-top:1px">${ESC(it.film)}</div>`:''}</div>
    <div style="border-left:1px solid ${L};${H};font-size:24px;font-weight:600;color:${I};text-align:right;padding:8px 10px 0 0">${prices[i]}</div></div>`;
  const check=`<section aria-label="Deli guest check menu" style="${at(24,20,640,`height:702px;background:${P};box-shadow:0 7px 20px rgba(0,0,0,.55)`)}">
    <header style="${at(0,0,640,`height:92px;background:${G};color:${P}`)}">
      <div style="${at(26,14,400)}"><div style="${B};font-size:11px;font-weight:700;letter-spacing:.16em;color:${L}">GREENWICH VILLAGE DELI / NEW YORK CITY</div><div style="${S};font-size:40px;line-height:1.1;margin-top:3px">Guest Check</div></div>
      <div style="${at(470,14,144,'text-align:right')}"><div style="${B};font-size:11px;font-weight:700;letter-spacing:.12em;color:${L}">CHECK NO.</div><div style="${S};font-size:30px;line-height:1.1;color:#f1c96b">1971</div></div></header>
    <div style="${at(0,92,640,`display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:2px solid ${G};${B};font-size:12px;color:${I}`)}">
      <div style="padding:7px 14px;border-right:1px solid ${L}"><b style="color:${G}">TABLE</b> Frank + Alfie</div><div style="padding:7px 14px;border-right:1px solid ${L}"><b style="color:${G}">SERVER</b> Counter</div><div style="padding:7px 14px"><b style="color:${G}">GUESTS</b> 4, no badges</div></div>
    <div style="${at(0,124,640,`display:grid;grid-template-columns:44px 1fr 74px;border-bottom:1px solid ${L};${B};font-size:10px;font-weight:700;letter-spacing:.12em;color:${G}`)}"><span style="text-align:center;padding:4px 0">QTY</span><span style="padding:4px 14px">ITEM</span><span style="text-align:right;padding:4px 10px">AMOUNT</span></div>
    <div style="${at(0,145,640)}">${all.map(row).join('')}</div>
    <div style="${at(0,612,640,`border-top:2px solid ${G};display:flex;align-items:center;justify-content:space-between;padding:10px 14px 0 14px;box-sizing:border-box`)}">
      <div style="${B};font-size:13px;line-height:1.35;color:${I};max-width:330px"><b style="color:${G}">CUE</b> ${ESC(fmtCue(f))}</div>
      <div style="text-align:right"><div style="${B};font-size:10px;font-weight:700;letter-spacing:.12em;color:${G}">TOTAL</div><div style="${H};font-size:30px;font-weight:700;color:${I};line-height:1">$15.60</div></div></div>
    <div aria-hidden="true" style="${at(368,604,150,`border:4px solid ${R};color:${R};text-align:center;transform:rotate(-12deg);opacity:.9;padding:2px 0`)}"><div style="${S};font-size:34px;line-height:1.05;letter-spacing:.06em">PAID</div><div style="${B};font-size:10px;font-weight:700;letter-spacing:.1em">IN FULL. EVERY TIME.</div></div>
  </section>`;
  const right=`<div style="${at(690,20,357,'height:702px;display:flex;flex-direction:column')}">
    <div style="${S};font-size:46px;line-height:1;color:${P}">Serpico</div>
    <div style="${H};font-size:22px;font-weight:600;color:${L};margin-top:4px">${ESC(spec.tag||'')}</div>
    <figure style="margin:14px 0 0;background:${P};padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(1deg)">${img('counter','Frank Serpico at the deli counter',345,222)}<figcaption style="${B};font-size:12px;color:${I};padding:6px 2px 7px">The deli counter. He pays.</figcaption></figure>
    <figure style="margin:14px 0 0;background:${P};padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.5);transform:rotate(-1deg)">${img('village','Frank Serpico in Greenwich Village',345,222)}<figcaption style="${B};font-size:12px;color:${I};padding:6px 2px 7px">Greenwich Village, early seventies.</figcaption></figure>
    <div style="margin-top:auto;${B};font-size:9px;letter-spacing:.08em;color:${L};text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${W};overflow:hidden;box-shadow:0 16px 40px #0006">${check}${right}</div>`;
}


function fmtAcrossGlass(f,spec,menu,poster){
  const PA='#f1efe6',IN='#1d1f24',SO='#555a60',BL='#1f3a68',RD='#a3261c',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.12em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tm=['1840','1905','1932','2010','2245'],who=['Frog One','Doyle','Frog One','Frog One','Doyle / Russo'];
  const nf=t=>ESC(String(t||'').normalize('NFC'));
  const nh=t=>nf(t).replace(/[âêîôûàèìòùëïüç]/gi,m=>`<span style="font-family:'Times New Roman',Times,serif;font-weight:400">${m}</span>`);
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:56px 1fr 100px;column-gap:14px;padding:6px 0 6px;border-bottom:1px solid #b9bcc2">
    <div style="${T};font-size:16px;font-weight:700;color:${RD};padding-top:3px">${tm[i]||''}</div>
    <div><h3 style="${H};font-size:24px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${nh(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.4;margin:4px 0 0;color:${IN}">${nf(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${BL}">OBS: ${nf(it.film)}</p></div>
    <div style="text-align:right">${lab(ESC(gs[i]?gs[i].tab:''),RD)}<div style="${T};font-size:12px;line-height:1.3;color:${SO};margin-top:4px">${who[i]||''}</div></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(180deg,#30353b,#1d2024);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(115deg,#ffffff07 0 2px,#0000 2px 14px)"></div>
  <div style="position:absolute;left:30px;top:10px;width:620px;height:722px;background:#7a5a36;border-radius:12px;box-shadow:0 12px 26px #000a"></div>
  <div aria-hidden="true" style="position:absolute;left:250px;top:2px;width:180px;height:38px;border-radius:8px;background:linear-gradient(180deg,#d8dbde,#8d9196);box-shadow:0 3px 6px #0008"></div>
  <div style="position:absolute;left:44px;top:34px;width:592px;height:690px;background:${PA};box-shadow:0 4px 10px #0005;box-sizing:border-box;padding:14px 22px 12px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${IN};padding-bottom:6px">
      <div>${lab('Narcotics Bureau / Surveillance report',BL)}<div style="${H};font-size:36px;font-weight:600;line-height:.95;color:${IN};margin-top:3px">Across the glass</div></div>
      <div style="text-align:right;${T};font-size:13px;line-height:1.4;color:${IN}">FILE 1971<br>TEMP: FREEZING</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;${T};font-size:13px;line-height:1.45;color:${IN};padding:5px 0;border-bottom:1px solid ${IN}"><span>SUBJECT: Frog One</span><span>DET: J. Doyle</span><span>POST: across the street</span><span>PARTNER: B. Russo</span></div>
    <div style="display:grid;grid-template-columns:56px 1fr 100px;column-gap:14px;padding:6px 0 4px;border-bottom:2px solid ${IN}">${lab('Time')}${lab('Observed on the table')}${lab('Course','','text-align:right')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline;padding-top:6px">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
  </div>
  <header style="position:absolute;left:680px;top:22px;width:368px">
    ${lab('New York / Marseille / 1971','#c9cdd2')}
    <h1 style="${H};font-size:54px;line-height:.9;font-weight:600;letter-spacing:-.02em;margin:6px 0 0;color:#f1efe6;text-shadow:none">The French Connection</h1>
  </header>
  <figure style="position:absolute;left:680px;top:150px;width:368px;margin:0;background:#f4f2ea;padding:8px 8px 10px;box-sizing:border-box;box-shadow:0 10px 22px #000a;transform:rotate(1deg)">${img('popeye','Alain Charnier, Frog One, out on the street',352,232)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:8px">Frog One, out for a stroll. Popeye is never more than a block behind.</figcaption></figure>
  <div style="position:absolute;left:680px;top:478px;width:368px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#f4f2ea;padding:6px;box-shadow:0 10px 22px #000a;transform:rotate(-1.3deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;background:#e9dcb4;padding:12px 12px 10px;box-shadow:0 8px 18px #0008;position:relative;margin-top:6px">
      <div aria-hidden="true" style="position:absolute;left:50%;top:8px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#30353b"></div>
      <div style="${T};font-size:12px;font-weight:700;letter-spacing:.08em;color:${RD};margin-top:14px">EVIDENCE TAG</div>
      <div style="${H};font-size:22px;line-height:1.05;font-weight:600;color:${IN};margin-top:4px">Lincoln, from Marseille</div>
      <p style="${T};font-size:13px;line-height:1.4;color:${IN};margin:6px 0 0">Check the rocker panels. Car weighs heavy.</p>
      <p style="${B};font-size:13px;line-height:1.35;color:${SO};margin:8px 0 0;font-style:italic">Ever been to Poughkeepsie?</p>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#9aa0a6">FILM IMAGERY: TMDB</div>
  </div>`;
}


/* A 1974 deli-style shift supper sheet; real train and control-room frames, no invented transit graphics. */
function fmtShift(f,spec,menu,poster){
 const MU='#d5b453',P='#ece4cf',I='#232a28',M='#5d5a4f',R='#9a3f2a',RULE='#bfb195',N='#263132';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:${N}"></div>`;
 const lab=(t,c=R,e='')=>`<div style="${B};font-size:13px;line-height:1.25;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:${c};${e}">${ESC(t)}</div>`;
 const who=[['Mr. Blue','Car 1, front'],['Mr. Green','Gesundheit.'],['Lt. Garber','Command centre'],['Mr. Grey','Car 1, rear'],['Mr. Brown','Car 1, middle']];
 const times=['1:23','1:31','1:48','2:10','2:23'];
 const row=(x,i)=>`<div style="display:grid;grid-template-columns:118px 1fr 64px;border-bottom:1px solid ${RULE};${i===2?`background:${MU}`:''}"><div style="padding:13px 8px 12px 10px">${lab('Ordered by',M,'font-size:11px')}<div style="${B};font-size:20px;line-height:1.05;font-weight:700;color:${I};margin-top:2px">${who[i][0]}</div><div style="${B};font-size:14px;line-height:1.2;color:${i===1?R:M};margin-top:1px;font-style:${i===1?'italic':'normal'}">${who[i][1]}</div></div><div style="padding:12px 12px 13px 14px;border-left:1px solid ${RULE}"><div style="${D};font-size:${i===2?24:21}px;line-height:1.1;color:${I};letter-spacing:-.01em">${nm(x)}</div><div style="${B};font-size:17px;line-height:1.22;color:${M};margin-top:3px">${ESC(x.d)}</div><div style="${B};font-size:16px;line-height:1.2;font-weight:600;color:${R};margin-top:2px">${ESC(x.note||'')}</div></div><div style="border-left:1px solid ${RULE};padding:14px 8px 0 0;text-align:right">${lab('PM',M,'font-size:11px')}<div style="${B};font-size:23px;line-height:1;font-weight:700;color:${I};margin-top:1px">${times[i]}</div></div></div>`;
 const sheet=`<section aria-label="Train sheet" style="${at(24,24,640,'height:694px;background:#f6f1e3;box-shadow:0 6px 16px rgba(0,0,0,.25)')}"><div style="background:${MU};padding:16px 22px 14px;border-bottom:3px solid ${I}"><div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div style="${D};font-size:44px;line-height:1;color:${I};letter-spacing:-.02em">PELHAM 1 2 3</div>${lab('Train sheet / Lexington Ave local / 1974',I,'margin-top:6px')}</div><div style="text-align:right">${lab('Sheet no.',I)}<div style="${D};font-size:30px;line-height:1;color:${R}">1:23</div></div></div></div><div style="padding:0 22px">${xs.slice(0,5).map(row).join('')}<div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:10px">${lab('Status: car 1 uncoupled, stopped in the tunnel. Desk lunch: uneaten.',I,'font-size:12px')}<span style="${B};font-size:10px;letter-spacing:.08em;color:${M}">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</span></div></div></section>`;
 const side=`<aside style="${at(690,24,357,'height:694px;display:flex;flex-direction:column')}"><figure style="margin:0;background:${I};padding:8px">${img('garber','Lieutenant Garber on the phone in the transit command centre',341,214,'center 25%')}<figcaption style="display:flex;justify-content:space-between;margin-top:7px">${lab('Garber, Transit Police',MU)}${lab('On the line',P)}</figcaption></figure><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">${img('train','The hijacked subway car at the platform',173,140)}${img('board','The track board in the transit command centre',174,140)}</div><div style="border:3px solid ${I};padding:11px 14px 12px;margin-top:14px;background:#f6f1e3">${lab('The demand',R)}<div style="${D};font-size:34px;line-height:1;color:${I};margin-top:5px">$1,000,000</div><div style="${B};font-size:17px;line-height:1.25;color:${M};margin-top:5px">One hour to deliver. Every minute late costs a passenger. Lunch can wait.</div></div>${FX_SP}<div style="border-top:3px solid ${I};padding-top:10px">${lab('Cue')}<div style="${B};font-size:18px;line-height:1.25;color:${I};margin-top:4px">${ESC(fmtCue(f))}</div></div><div style="${D};font-size:20px;line-height:1.15;color:${R};margin-top:12px">${ESC(spec.tag||'Desk lunch. One more call.')}</div></aside>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};box-shadow:0 18px 45px rgba(0,0,0,.5)">${sheet}${side}</div>`;
}

function fmtEscape(f,spec,menu,poster){
 const K='#182b2b',P='#e8dfbf',W='#efe6c8',R='#873b2d',Y='#d6ba72',I='#26352e',S='#646b59',L='#b9ae8a';
 const H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
 const art=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>art[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(art[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=S,e='')=>`<div style="${T};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const loc=["Cabbie's cab","Anywhere still standing","The Duke's crew","Packed in the glider","Brain's place, the Library"];
 const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:50px 1fr 128px;column-gap:14px;align-items:center;border-top:1px solid ${L};padding:7px 0">
   <div style="${H};font-size:30px;font-weight:700;line-height:1;color:${R};text-align:center">0${i+1}</div>
   <div><div style="display:flex;align-items:baseline;gap:9px"><span style="${H};font-size:24px;line-height:1.02;font-weight:700;color:${I};text-transform:uppercase;letter-spacing:.01em">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',R)}</div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${S};margin-top:2px">${ESC(r.it.film)}</div>`:''}</div>
   <div style="border-left:1px dashed ${L};padding-left:12px;align-self:stretch;display:flex;flex-direction:column;justify-content:center">${lab('Last seen',S)}<div style="${T};font-size:13px;font-weight:700;line-height:1.3;color:${I};margin-top:2px">${ESC(loc[i]||'')}</div></div></div>`;
 const file=`<section style="position:absolute;left:362px;top:24px;width:685px;height:694px;box-sizing:border-box;background:${W};border:2px solid ${I};box-shadow:0 8px 18px #0006;display:flex;flex-direction:column">
   <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid ${I};padding:10px 18px">
     <div>${lab('U.S. Police Force / Liberty Island security control',R)}<div style="${H};font-size:38px;line-height:1;font-weight:700;color:${I};margin-top:4px;letter-spacing:.01em;white-space:nowrap">RATION REQUISITION</div><div style="${B};font-size:15px;font-weight:600;color:${S};margin-top:3px">${ESC(spec.brand||'')}. Island supplies, signed out to one man.</div></div>
     <div style="border:3px solid ${R};color:${R};padding:3px 10px;${H};font-size:22px;font-weight:700;letter-spacing:.08em;transform:rotate(-5deg)">CLASSIFIED</div></div>
   <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;border-bottom:2px solid ${I}">
     ${[['Operative','S. Plissken'],['Insertion','Glider, WTC roof'],['Objective','The President']].map((x,i)=>`<div style="padding:6px 14px;${i?'border-left:1px solid '+L:''}">${lab(x[0])}<div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px;white-space:nowrap">${x[1]}</div></div>`).join('')}</div>
   <div style="padding:0 18px;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="border-top:2px solid ${I};padding:7px 18px;display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${S}"><span>AVOID THE 69TH STREET BRIDGE. IT'S MINED.</span><span>FILM STILLS: TMDB</span></div></section>`;
 const left=`<section style="position:absolute;left:24px;top:24px;width:316px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div><div style="${H};font-size:56px;line-height:.92;font-weight:700;color:${P};letter-spacing:.01em">ESCAPE<br><span style="font-size:37px">FROM NEW YORK</span></div><div style="${B};font-size:15px;color:${Y};margin-top:8px">${ESC(spec.tag||'')}</div></div>
   <figure style="margin:0;position:relative;border:2px solid ${Y}">${img('snake','Snake Plissken behind the wheel',312,186)}<figcaption style="position:absolute;left:8px;bottom:8px;background:${K};color:${P};padding:3px 8px;${T};font-size:12px;font-weight:700">CALL HIM SNAKE.</figcaption></figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;position:relative;border:2px solid ${Y}">${img('duke','The Duke of New York with his crew',148,96)}<figcaption style="position:absolute;left:5px;bottom:5px;background:${K};color:${P};padding:2px 6px;${T};font-size:11px;font-weight:700">A NUMBER ONE</figcaption></figure>
     <figure style="margin:0;position:relative;border:2px solid ${Y}">${img('brain','Brain and Maggie in their refuge',148,96)}<figcaption style="position:absolute;left:5px;bottom:5px;background:${K};color:${P};padding:2px 6px;${T};font-size:11px;font-weight:700">BRAIN &amp; MAGGIE</figcaption></figure></div>
   <div style="background:#0e1a1a;border:2px solid ${R};padding:9px 14px;text-align:center">${lab('Time left on the clock',Y)}<div style="${T};font-size:40px;font-weight:700;line-height:1.05;color:#e0533a;letter-spacing:.06em">22:59:59</div></div>
   <div style="border-top:2px solid ${Y};padding-top:9px">${lab('Serving cue',Y)}<div style="${B};font-size:15px;line-height:1.45;color:${P};margin-top:4px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${K};${B};box-shadow:0 15px 28px rgba(0,0,0,.4)">${left}${file}</div>`;
}


function fmtPlazaNight(f,spec,menu,poster){
  const N='#14171c',P='#f7f1e4',Gd='#b08d4a',I='#1b1d22',M='#5e5d58',R='#8c2d2a',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,fit='cover',pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:${fit};object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const price=['19','21','90','12','90'];
  const box=on=>`<span style="display:inline-block;width:15px;height:15px;border:1.5px solid ${I};position:relative;flex:none;margin-top:6px">${on?`<span style="position:absolute;left:0;top:0;width:15px;height:15px;text-align:center;${T};font-size:15px;font-weight:700;color:${R};line-height:14px">X</span>`:''}</span>`;
  const qty=['4','4','1 per man','4','2 bottles'];
  const row=(it,i)=>`<div style="display:flex;gap:14px;padding:${i?11:0}px 0 11px;${i<all.length-1?'border-bottom:1px solid #d9cfb9':''}">
    ${box(1)}
    <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><div style="${H};font-size:${i===2?30:26}px;line-height:1.05;font-weight:600;color:${I}">${ESC(it.label)}</div><div style="${H};font-size:22px;font-weight:600;color:${Gd};white-space:nowrap">${price[i]}</div></div>
    <div style="${B};font-size:14px;line-height:1.4;color:${I};margin-top:2px">${ESC(it.desc)}</div>
    <div style="display:flex;justify-content:space-between;gap:12px;margin-top:2px"><span style="${B};font-size:13px;font-style:italic;color:${M}">${ESC(it.film||'')}</span><span style="${T};font-size:12px;color:${R};white-space:nowrap">${ESC(tabs[i]||'').toUpperCase()} / QTY ${qty[i]}</span></div></div></div>`;
  const card=`<section aria-label="Hotel room service card menu" style="${at(24,22,650,`height:698px;background:${P};box-shadow:0 8px 22px rgba(0,0,0,.7);border:1px solid ${Gd}`)}">
    <div aria-hidden="true" style="position:absolute;inset:9px;border:1px solid ${Gd}"></div>
    <header style="${at(36,26,578,'text-align:center')}"><div style="${T};font-size:11px;font-weight:700;letter-spacing:.2em;color:${Gd}">FIFTH AVENUE AT CENTRAL PARK SOUTH</div>
      <div style="${H};font-size:46px;line-height:1;font-weight:600;color:${I};margin-top:4px">In-Suite Dining</div>
      <div style="${H};font-size:19px;font-style:italic;color:${M};margin-top:3px">${ESC(spec.tag||'')}</div></header>
    <div style="${at(36,132,578,`border-top:1px solid ${Gd};border-bottom:1px solid ${Gd};padding:7px 0;display:flex;justify-content:space-between;${T};font-size:13px;color:${I}`)}"><span><b>GUEST:</b> Mr. F. White</span><span><b>FROM:</b> upstate, tonight</span><span><b>COVERS:</b> the whole crew</span></div>
    <div style="${at(36,176,578)}">${all.map(row).join('')}</div>
    <footer style="${at(36,640,578,`border-top:1px solid ${Gd};padding-top:8px;display:flex;justify-content:space-between;align-items:baseline;${T};font-size:11px;color:${M}`)}"><span>HANG ON THE DOOR BY 3 A.M. / CHARGE TO SUITE</span><span>GRATUITY: JIMMY JUMP</span></footer>
  </section>`;
  const right=`<div style="${at(700,22,347,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;border:1px solid ${Gd};padding:5px;background:#0d0f12">${img('identity','King of New York title artwork with Frank White','335','200','cover','center 30%')}</figure>
    <figure style="margin:14px 0 0;border:1px solid ${Gd};padding:5px;background:#0d0f12">${img('suite','Frank White and his crew in the Plaza suite','335','214')}<figcaption style="${T};font-size:11px;color:#cfc4ab;padding:7px 2px 2px">The suite. First night out.</figcaption></figure>
    <div style="margin-top:14px;flex:1;border:1px solid ${Gd};padding:14px 18px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center">
      <div style="${T};font-size:11px;font-weight:700;letter-spacing:.12em;color:${Gd}">SERVICE CUE</div>
      <div style="${H};font-size:23px;line-height:1.2;font-weight:600;color:${P};margin-top:5px">${ESC(fmtCue(f))}</div>
      <div style="${B};font-size:13px;line-height:1.4;color:#bdb4a0;margin-top:8px">A share of tonight goes to the hospital in the South Bronx.</div>
      <div style="${T};font-size:9px;letter-spacing:.06em;color:#8f8878;margin-top:10px">FILM IMAGERY: TMDB</div></div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${N};overflow:hidden;box-shadow:0 16px 40px #0007">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 0%,rgba(176,141,74,.18),transparent 60%)"></div>${card}${right}</div>`;
}


/* A quiet cloth-bound supper folio: rooftop retreat, pigeons, Raymond and Pearline. */
function fmtRooftop(f,spec,menu,poster){
  const PA='#efe8d6',IN='#22201c',SO='#5d574c',RD='#8e2b21',D="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:600;line-height:1.3;letter-spacing:.16em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const nums=['I','II','III','IV','V'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:44px 1fr;column-gap:12px;padding:10px 0 10px;${i?'border-top:1px solid #cfc5ad':''}">
    <div style="${D};font-size:26px;font-weight:600;color:${RD};line-height:1;text-align:right;padding-top:2px">${nums[i]||i+1}</div>
    <div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><h3 style="${D};font-size:26px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].tab:''),RD,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.42;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${D};font-size:16px;line-height:1.25;font-style:italic;margin:3px 0 0;color:${SO}">${ESC(it.film||'')}</p></div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(180deg,#141a1f,#1f2a2c 60%,#2a2a24);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:60px;background:repeating-linear-gradient(90deg,#11161a 0 40px,#161d22 40px 44px)"></div>
  <div style="position:absolute;left:22px;top:18px;width:1027px;height:700px;background:${PA};box-shadow:0 14px 30px #000b;display:grid;grid-template-columns:1fr 1fr">
    <div aria-hidden="true" style="position:absolute;left:50%;top:0;bottom:0;width:40px;margin-left:-20px;background:linear-gradient(90deg,#0000,#0000001f 45%,#00000038 50%,#0000001f 55%,#0000)"></div>
    <section style="position:relative;padding:22px 34px 18px 32px;display:flex;flex-direction:column;border-right:1px solid #d4c9b0">
      <div style="display:flex;justify-content:space-between">${lab('The Way of the Samurai')}${lab('The rooftop / 1999')}</div>
      <div style="display:flex;gap:20px;align-items:flex-end;margin-top:14px">
        <div style="flex:1"><h1 style="${D};font-size:74px;line-height:.84;font-weight:600;letter-spacing:-.03em;margin:0;color:${IN};text-shadow:none">Ghost<br>Dog</h1><div style="${D};font-size:22px;font-style:italic;color:${RD};margin-top:10px">${ESC(spec.tag||'')}</div></div>
        <div style="flex:none;padding:5px;background:#fff;box-shadow:0 4px 10px #0003;transform:rotate(2deg)">${fmtPosterImg(f,poster,112,168)}</div>
      </div>
      <figure style="margin:18px 0 0">${img('roof','Ghost Dog on his rooftop beside the pigeon coop',447,232)}<figcaption style="${D};font-size:17px;font-style:italic;line-height:1.3;color:${SO};margin-top:8px">The rooftop coop. Every message arrives by pigeon.</figcaption></figure>
      ${FX_SP}
      <div style="display:flex;gap:16px;align-items:stretch">
        <div style="flex:1;border:1px solid ${IN};padding:10px 12px;background:#f7f2e4">
          ${lab('Retainer',RD)}
          <div style="${D};font-size:21px;line-height:1.15;font-weight:600;color:${IN};margin-top:4px">Paid once a year, first day of autumn.</div>
        </div>
        <div style="flex:1;border:1px solid ${IN};padding:10px 12px;background:#f7f2e4">
          ${lab('Lending shelf',RD)}
          <div style="${D};font-size:21px;line-height:1.15;font-weight:600;color:${IN};margin-top:4px">Rashomon, for Pearline. Return it.</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:12px">${lab('Showtime cue',RD)}<span style="${D};font-size:15px;color:${SO}">16</span></div>
      <div style="${B};font-size:13px;line-height:1.38;color:${IN};margin-top:4px">${ESC(fmtCue(f))}</div>
    </section>
    <section style="position:relative;padding:22px 34px 18px 34px;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between">${lab('Hagakure / The supper')}${lab('Silent. Loyal. Hungry.')}</div>
      <div style="${D};font-size:20px;font-style:italic;line-height:1.3;color:${IN};margin:14px 0 6px;padding-bottom:12px;border-bottom:2px solid ${IN}">A quiet supper from the roof down to the street, in five short chapters.</div>
      ${xs.map(row).join('')}
      ${FX_SP}
      <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid #cfc5ad;padding-top:8px">
        <span style="${D};font-size:15px;font-style:italic;color:${SO}">Raymond only speaks French. Point at the truck.</span><span style="${D};font-size:15px;color:${SO}">17</span>
      </div>
    </section>
  </div>
  <div style="position:absolute;right:24px;bottom:5px;${B};font-size:9px;color:#8c948c">FILM IMAGERY: TMDB</div>
  </div>`;
}

function fmtCityrun(f,spec,menu,poster){
  const N='#14202b',W='#f4f2ea',Y='#f2c230',K='#16181a',R='#b3342a',S='#4e555a',L='#c9c6bb',B="font-family:'Libre Franklin',sans-serif",C="font-family:'Barlow Condensed',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=S,e='')=>`<div style="${C};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const stops=[['Harlem','Zeus’s shop'],['Harlem','Uptown, on foot'],['Wall Street','Subway, downtown'],['Harlem','Back at the counter'],['Tompkins Sq. Park','The fountain']];
  const codes=['3','5','72','1','4 GAL'];
  const row=(x,i)=>`<div style="display:grid;grid-template-columns:118px 1fr 70px;border-bottom:1px solid ${L}"><div style="padding:9px 8px 8px 10px">${lab('Stop 0'+(i+1),R,'font-size:12px')}<div style="${C};font-size:17px;line-height:1.05;font-weight:700;color:${K};text-transform:uppercase;margin-top:3px">${stops[i][0]}</div><div style="${T};font-size:12px;line-height:1.25;color:${S};margin-top:2px">${stops[i][1]}</div></div><div style="padding:9px 12px 9px 14px;border-left:1px solid ${L}"><div style="${C};font-size:25px;line-height:1;font-weight:700;color:${K};text-transform:uppercase">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.38;color:#3a4045;margin-top:3px">${ESC(x.d)}</div><div style="${T};font-size:13px;line-height:1.3;color:${R};margin-top:3px">${ESC(x.note||'')}</div></div><div style="border-left:1px solid ${L};padding:10px 8px 0 0;text-align:right">${lab('Code',S,'font-size:11px')}<div style="${C};font-size:24px;line-height:1;font-weight:700;color:${K};margin-top:2px">${codes[i]}</div></div></div>`;
  const sheet=`<section aria-label="Run sheet" style="${at(24,24,640,'height:694px;background:'+W+';box-shadow:0 10px 24px rgba(0,0,0,.55)')}"><div style="height:16px;display:flex">${Array.from({length:40},(_, i)=>`<span style="flex:1;background:${i%2?Y:K}"></span>`).join('')}</div><div style="${at(24,32,592)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${K};padding-bottom:8px"><div><div style="${C};font-size:52px;line-height:.9;font-weight:700;color:${K};text-transform:uppercase;letter-spacing:.005em">Simon Says: Eat</div>${lab('Run sheet / Die Hard with a Vengeance / 1995',S,'margin-top:7px')}</div><div style="text-align:right">${lab('Detective',R)}<div style="${T};font-size:15px;line-height:1.2;font-weight:700;color:${K};margin-top:2px">McCLANE, J.</div><div style="${T};font-size:13px;line-height:1.2;color:${S}">+ CARVER, Z.</div></div></div>${xs.slice(0,5).map(row).join('')}<div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:9px">${lab('Hours slept: 0. Payphone at 72nd and Broadway: ringing.',K,'font-size:12px')}<span style="${T};font-size:9px;color:${S};letter-spacing:.06em">FILM IMAGERY: TMDB</span></div></div></section>`;
  const side=`<aside style="${at(690,24,357,'height:694px;display:flex;flex-direction:column')}"><figure style="margin:0;background:${Y};padding:8px">${img('phone','Zeus and John McClane listening at the public telephone',341,200,'center 30%')}<figcaption style="display:flex;justify-content:space-between;margin-top:7px">${lab('The phone is ringing',K)}${lab('Answer it',R)}</figcaption></figure><figure style="margin:14px 0 0">${img('park','McClane and Zeus at the park fountain with the water jugs',357,166)}</figure><div style="background:${W};padding:12px 14px 13px;margin-top:14px;border-left:6px solid ${Y}">${lab('Riddle for dessert',R)}<div style="${B};font-size:14px;line-height:1.45;color:${K};margin-top:5px">A 5 gallon jug, a 3 gallon jug, a fountain. Put exactly 4 gallons on the scale. Then pour the lemonade.</div></div>${FX_SP}<div style="border-top:2px solid ${Y};padding-top:10px">${lab('Cue',Y)}<div style="${B};font-size:14px;line-height:1.45;color:#eef0f2;margin-top:5px">${ESC(fmtCue(f))}</div></div><div style="${C};font-size:22px;line-height:1.1;font-weight:700;color:${Y};margin-top:14px;text-transform:uppercase;letter-spacing:.02em">${ESC(spec.tag||'')}</div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${N};box-shadow:0 18px 45px rgba(0,0,0,.5)">${sheet}${side}</div>`;
}


function fmtLeon(f,spec,menu,poster){
 const P='#f0e8d5',C='#eef1e2',G='#29483b',I='#354034',M='#6c6e5c',R='#8c5741',L='#b9c7b4';
 const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
 const art=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>art[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(art[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(s,c=G,e='')=>`<div style="${B};font-size:10.5px;font-weight:700;line-height:1.3;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const qty=['1','1','2','2','2'],pr=['4.00','3.50','12.00','4.50','0.94'];
 const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:34px 1fr 64px;column-gap:12px;align-items:center;border-top:1px solid ${L};padding:7px 0">
   <div style="${T};font-size:18px;font-weight:700;color:${R};text-align:center">${qty[i]}</div>
   <div><div style="display:flex;align-items:baseline;gap:9px"><span style="${H};font-size:24px;line-height:1.05;font-weight:600;color:${G}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',M)}</div>
   ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:3px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${R};margin-top:2px">${ESC(r.it.film)}</div>`:''}</div>
   <div style="${T};font-size:16px;font-weight:700;color:${I};text-align:right;border-left:1px solid ${L};height:100%;display:flex;align-items:center;justify-content:flex-end">${pr[i]}</div></div>`;
 const check=`<section style="position:absolute;left:24px;top:24px;width:610px;height:694px;box-sizing:border-box;background:${C};border:2px solid ${G};box-shadow:0 8px 18px #29483b33;display:flex;flex-direction:column">
   <div style="display:flex;justify-content:space-between;align-items:center;background:${G};color:${P};padding:10px 18px">
     <div>${lab("Tony's / Little Italy / Guest check",'#e5d4a7')}<div style="${H};font-size:38px;line-height:1;font-weight:500;letter-spacing:-.01em;margin-top:3px">A quiet supper</div></div>
     <div style="text-align:right">${lab('No.','#e5d4a7')}<div style="${T};font-size:24px;font-weight:700;color:#e8b8a4">1994</div></div></div>
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1.2fr;border-bottom:2px solid ${G}">
     ${[['Table','Back room'],['Server','Tony'],['Guests','2'],['Paid','Tony holds it']].map((x,i)=>`<div style="padding:6px 12px;${i?'border-left:1px solid '+L:''}">${lab(x[0],M)}<div style="${T};font-size:15px;font-weight:700;color:${G};margin-top:2px;white-space:nowrap">${x[1]}</div></div>`).join('')}</div>
   <div style="display:grid;grid-template-columns:34px 1fr 64px;column-gap:12px;padding:6px 18px 4px">${lab('Qty',M,'text-align:center')}${lab('Item',M)}${lab('$',M,'text-align:right')}</div>
   <div style="padding:0 18px;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="border-top:2px solid ${G};padding:8px 18px;display:flex;justify-content:space-between;align-items:baseline">
     <span style="${T};font-size:12px;font-weight:700;color:${M}">GUEST AGE: 12. SHE SAYS 18.</span><span style="${T};font-size:12px;font-weight:700;color:${M}">FILM STILLS: TMDB</span></div></section>`;
 const side=`<section style="position:absolute;left:656px;top:24px;width:391px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${H};font-size:76px;line-height:.85;font-weight:500;letter-spacing:-.04em;color:${G}">LÉON</div><div style="text-align:right">${lab('The Professional',R)}<div style="${H};font-style:italic;font-size:19px;color:${M};margin-top:2px">New York, ${ESC(f.year)}</div></div></div>
   <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 12px #29483b33">${img('plant','Mathilda beside Léon’s potted plant by the window',379,236)}<figcaption style="${H};font-style:italic;font-size:17px;color:${I};margin-top:5px">The plant gets the window. Always.</figcaption></figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px #29483b33">${img('milk','Léon with his milk in the apartment kitchen',178,122)}</figure>
     <figure style="margin:0;background:#fff;padding:5px;box-shadow:0 4px 10px #29483b33">${img('table','Léon and Mathilda at a restaurant table',178,122,'center 40%')}</figure></div>
   <div style="${H};font-size:22px;line-height:1.2;font-style:italic;color:${R};border-left:4px solid ${R};padding-left:12px">${ESC(spec.tag||'')}</div>
   <div style="background:${G};color:${P};padding:11px 16px 12px">${lab('Serving cue','#e5d4a7')}<div style="${B};font-size:15px;line-height:1.45;margin-top:4px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};${B};box-shadow:0 15px 28px rgba(0,0,0,.35)">${check}${side}</div>`;
}


/* Manhattan lunch, on both sides of a negotiation. Genuine 2006 film frames only. */
function fmtNegotiation(f,spec,menu,poster){
 const N='#1f2523',P='#f3eddf',G='#2f5a47',L='#cfdccf',I='#1d2321',M='#5c635d',A='#8a6326',R='#a23a2a';
 const D="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const a=spec.art||{},all=menu.all;
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
 const lab=(t,c=G)=>`<div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c}">${t}</div>`;
 const vals=['$20.00','$3.92','$392.00','$19.45','$1.00'];
 const row=(it,i)=>`<div style="display:grid;grid-template-columns:62px 1fr 78px;column-gap:14px;padding:${i?11:0}px 0 11px;${i<all.length-1?'border-bottom:1px solid #c9cdbf':''}">
   <div style="padding-top:2px">${lab(ESC(tabs[i]||''),A)}<div style="${D};font-size:30px;font-weight:700;line-height:1;color:${G}">0${i+1}</div></div>
   <div><div style="${D};font-size:${i===2?30:26}px;line-height:1.02;font-weight:700;text-transform:uppercase;color:${I};margin-top:1px">${ESC(it.label)}</div>
   <div style="${B};font-size:14px;line-height:1.4;color:${I};margin-top:3px">${ESC(it.desc)}</div>${it.film?`<div style="${B};font-size:13px;line-height:1.35;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>
   <div style="text-align:right;padding-top:4px">${lab('Declared',M)}<div style="${D};font-size:20px;font-weight:600;color:${I}">${vals[i]||''}</div></div></div>`;
 const card=`<section aria-label="Safe deposit box inventory menu" style="${at(24,22,648,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.6);border:10px solid ${L};box-sizing:border-box;outline:2px solid ${G};outline-offset:-14px`)}">
   <div style="${at(26,22,576,`border-bottom:3px solid ${G};padding-bottom:9px;display:flex;justify-content:space-between;align-items:flex-end`)}">
    <div>${lab('Manhattan Trust / 20 Exchange Place')}<div style="${D};font-size:40px;line-height:1;font-weight:700;color:${I};text-transform:uppercase;margin-top:3px">Safe deposit inventory</div></div>
    <div style="text-align:right;border:2px solid ${G};padding:3px 10px">${lab('Box no.')}<div style="${D};font-size:34px;line-height:1;font-weight:700;color:${G}">392</div></div></div>
   <div style="${at(26,100,576,`${B};font-size:13px;line-height:1.4;color:${M};display:flex;justify-content:space-between`)}"><span><b style="color:${I}">Holder:</b> A. Case, chairman</span><span><b style="color:${I}">Opened by:</b> D. Russell</span><span><b style="color:${I}">Witness:</b> Det. Frazier</span></div>
   <div style="${at(26,132,576)}">${all.map(row).join('')}</div>
   <div style="${at(26,632,576,`border-top:3px solid ${G};padding-top:7px;display:flex;justify-content:space-between;align-items:baseline`)}"><span style="${B};font-size:13px;font-style:italic;color:${I}">Pay strict attention. I never repeat myself.</span><span style="${B};font-size:9px;letter-spacing:.08em;color:${M}">${ESC(f.title.toUpperCase())} (${f.year}) / FILM IMAGERY: TMDB</span></div>
  </section>`;
 const pol=(k,alt,cap,w,h,rot)=>`<figure style="margin:0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(${rot}deg)">${img(k,alt,w,h)}<figcaption style="${D};font-size:15px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:${I};padding:6px 2px 7px">${cap}</figcaption></figure>`;
 const ticket=`<div style="background:#fffdf6;padding:12px 16px 12px;box-shadow:0 5px 14px rgba(0,0,0,.55);transform:rotate(1.5deg);border-top:6px solid ${R}">
   <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="${D};font-size:24px;font-weight:700;color:${R};text-transform:uppercase">Pizza order</div><div style="${B};font-size:11px;font-weight:700;color:${M}">TICKET 0029</div></div>
   <div style="${B};font-size:13px;line-height:1.45;color:${I};margin-top:4px"><b>Deliver to:</b> the bank, front door. Leave on the step.<br><b>Note:</b> listen to the boxes. Ask for Steve. Or Steve-O.</div>
   <div style="border-top:1px dashed #b8b0a0;margin-top:8px;padding-top:6px;${B};font-size:13px;line-height:1.35;color:${I}"><b style="${D};font-size:14px;color:${R};letter-spacing:.06em">CUE</b> ${ESC(fmtCue(f))}</div></div>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 15px 34px rgba(0,0,0,.42)">
  ${card}<div style="${at(698,26,348,'height:690px;display:flex;flex-direction:column;justify-content:space-between')}">
   ${pol('russell','Dalton Russell in the bank during the heist','Inside: Dalton Russell',336,190,-1.2)}
   ${pol('frazier','Detective Keith Frazier outside the bank','Outside: Det. Keith Frazier',336,190,1)}
   ${ticket}</div></div>`;
}


function fmtLastTrain(f,spec,menu,poster){
  const WH='#f7f6f1',BK='#151515',SO='#4d4d4d',GO='#c79a2e',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${B};font-size:11px;font-weight:700;line-height:1.25;letter-spacing:.1em;text-transform:uppercase;color:${c||SO};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const bul=[['#ee352e','2'],['#00933c','4'],['#0039a6','A'],['#ff6319','F'],['#fccc0a','N']];
  const bullet=(c,t,sz=40)=>`<span style="flex:none;width:${sz}px;height:${sz}px;border-radius:50%;background:${c};display:inline-grid;place-items:center;${B};font-weight:700;font-size:${Math.round(sz*.55)}px;line-height:1;color:${c==='#fccc0a'?BK:'#fff'}">${t}</span>`;
  const row=(it,i)=>{const b=bul[i]||bul[0];return `<div style="display:flex;gap:16px;align-items:flex-start;padding:14px 0 13px;border-top:1px solid #d3d1c8">
    ${bullet(b[0],b[1])}
    <div style="flex:1"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h3 style="${B};font-size:21px;line-height:1.1;font-weight:700;margin:0;color:${BK};letter-spacing:-.01em">${ESC(it.label)}</h3>${lab(ESC(gs[i]?gs[i].h:''),SO,'white-space:nowrap')}</div>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.4;margin:4px 0 0;color:${BK}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:#8a2a1f">${ESC(it.film||'')}</p></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#d9d6cb;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background-image:linear-gradient(90deg,#b9b5a8 1px,#0000 1px),linear-gradient(180deg,#b9b5a8 1px,#0000 1px);background-size:44px 22px"></div>
  <div aria-hidden="true" style="position:absolute;left:0;right:0;top:300px;height:46px;background:#6b3b2a;border-top:6px solid #c79a2e;border-bottom:6px solid #c79a2e"></div>
  <div aria-hidden="true" style="position:absolute;left:684px;right:0;top:310px;${C};font-size:26px;font-weight:700;letter-spacing:.18em;color:#f1dfae;line-height:26px">TOKEN BOOTH  ·  14 ST</div>
  <div style="position:absolute;left:24px;top:18px;width:632px;height:706px;background:${WH};box-shadow:0 10px 24px #0006;box-sizing:border-box;display:flex;flex-direction:column">
    <div style="background:${BK};color:#fff;padding:14px 24px 12px;display:flex;justify-content:space-between;align-items:flex-end">
      <div><div style="${B};font-size:12px;font-weight:700;letter-spacing:.14em;color:#bbb">LATE NIGHTS / ALL STATIONS</div><div style="${B};font-size:42px;font-weight:700;line-height:1;letter-spacing:-.02em;margin-top:4px">Service Notice</div></div>
      <div style="display:flex;gap:6px">${bul.map(b=>bullet(b[0],b[1],30)).join('')}</div>
    </div>
    <div style="padding:12px 24px 0;display:flex;flex-direction:column;flex:1">
      <div style="${B};font-size:17px;line-height:1.3;color:${BK};padding-bottom:10px"><b>Two brothers. One last train.</b> Supper after the shift, every course one fare: one token.</div>
      ${xs.map(row).join('')}
      ${FX_SP}
      <div style="display:flex;gap:12px;align-items:baseline;border-top:3px solid ${BK};padding:9px 0 14px">${lab('Showtime cue','#8a2a1f','white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${BK}">${ESC(fmtCue(f))}</span></div>
    </div>
  </div>
  <figure style="position:absolute;left:684px;top:24px;width:364px;margin:0;background:${BK};padding:8px;box-sizing:border-box;box-shadow:0 10px 22px #0007">${img('platform','John and Charlie on the subway platform',348,196)}<figcaption style="${B};font-size:13px;line-height:1.35;color:#eee;margin-top:8px">Two transit cops, one platform, the last train out.</figcaption></figure>
  <div style="position:absolute;left:684px;top:372px;width:364px;height:222px;display:flex;gap:16px;align-items:stretch">
    <div style="flex:none;align-self:flex-start;background:${BK};padding:6px;box-shadow:0 10px 22px #0007">${fmtPosterImg(f,poster,140,210)}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px">
      <div style="background:${WH};padding:12px 12px 10px;box-shadow:0 6px 14px #0005">
        <h1 style="${C};font-size:44px;line-height:.86;font-weight:700;text-transform:uppercase;margin:0;color:${BK};text-shadow:none">Money<br>Train</h1>
        <div style="${B};font-size:13px;line-height:1.35;color:${SO};margin-top:6px">${ESC(spec.brand||'')}. New York, 1995.</div>
      </div>
      <div style="flex:1;background:#2a2a2a;padding:12px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 14px #0005">
        <div style="flex:none;width:62px;height:62px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f3d88a,${GO} 60%,#8c6a1c);display:grid;place-items:center;box-shadow:0 3px 6px #0008"><div style="width:20px;height:20px;background:#2a2a2a;transform:rotate(45deg)"></div></div>
        <div><div style="${C};font-size:24px;font-weight:700;color:#f1dfae;line-height:1">FARE $1.50</div><div style="${B};font-size:13px;line-height:1.35;color:#ccc;margin-top:4px">Keep it out of the booth. The Torch is out tonight.</div></div>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#444">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtSohoAfterMidnight(f,spec,menu,poster){
  const D='#14171c',G='#e4ecdc',GL='#7fa48a',GD='#2f5a40',R='#b8402f',K='#1f2421',Y='#f1d36b',B="font-family:'Libre Franklin',sans-serif",N="font-family:'Barlow Condensed',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#333"></div>`;
  const lab=(s,c=GD,e='')=>`<div style="${N};font-size:13px;line-height:1.2;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const prices=['0.97','1.50','28.00','4.00','20.00'];
  const row=(x,i)=>`<div style="display:grid;grid-template-columns:34px 1fr 74px;border-bottom:1px solid ${GL};padding:7px 0 7px"><div style="${T};font-size:17px;line-height:1.2;color:#2a3a8c;font-weight:700;padding-left:6px">${i===2?2:1}</div><div style="padding:0 10px 0 6px;border-left:1px solid ${GL}"><div style="${N};font-size:${i===2?28:24}px;line-height:1;font-weight:700;color:${K};text-transform:uppercase;letter-spacing:.01em">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.33;color:#3d4640;margin-top:2px">${ESC(x.d)}</div><div style="${T};font-size:13px;line-height:1.3;color:#2a3a8c;margin-top:3px">${ESC(x.note||'')}</div></div><div style="border-left:1px solid ${GL};${T};font-size:17px;line-height:1.2;font-weight:700;color:#2a3a8c;text-align:right;padding-right:6px">${prices[i]}</div></div>`;
  const check=`<section aria-label="Terminal Bar guest check" style="${at(28,20,560,'height:702px;background:'+G+';box-shadow:4px 10px 22px rgba(0,0,0,.6);transform:rotate(-.6deg)')}"><div style="${at(22,16,516)}"><div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${GD};padding-bottom:7px"><div><div style="${N};font-size:42px;line-height:.9;font-weight:700;color:${GD};letter-spacing:.01em;text-transform:uppercase">After Hours</div>${lab('Terminal Bar / SoHo / Guest check',GD,'margin-top:6px')}</div><div style="text-align:right">${lab('No.',R)}<div style="${N};font-size:30px;line-height:1;font-weight:700;color:${R}">0150</div></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid ${GL}">${[['Table','Bar, stool 3'],['Server','Julie'],['Guests','Paul + 3'],['Time','After 12']].map(([h,v],i)=>`<div style="padding:5px 6px 6px;${i?`border-left:1px solid ${GL}`:''}">${lab(h,GD,'font-size:11px')}<div style="${T};font-size:14px;line-height:1.2;color:#2a3a8c;font-weight:700;margin-top:2px">${v}</div></div>`).join('')}</div>${xs.slice(0,5).map(row).join('')}<div style="display:grid;grid-template-columns:1fr 92px;padding-top:7px;align-items:end"><div style="${T};font-size:13px;line-height:1.35;color:#2a3a8c">Paid: nothing. The twenty flew out the cab window, and the fare just went up.</div><div style="text-align:right">${lab('Total',R)}<div style="${N};font-size:30px;line-height:1;font-weight:700;color:${R}">$54.47</div></div></div></div></section>`;
  const side=`<aside style="${at(622,26,420,'height:690px;display:flex;flex-direction:column')}"><div style="${N};font-size:20px;line-height:1.15;font-weight:600;letter-spacing:.04em;color:${Y};text-transform:uppercase">${ESC(spec.tag||'')}</div><figure style="margin:14px 0 0;border:6px solid #f4f1e8;box-shadow:0 8px 18px rgba(0,0,0,.6);transform:rotate(1deg)">${img('bar','Paul at the Terminal Bar after midnight',408,290)}</figure><div style="${T};font-size:13px;line-height:1.3;color:#d9dcd3;margin-top:10px;letter-spacing:.04em">TOM'S PLACE. HE HAS THE KEYS.</div><div style="display:flex;gap:14px;margin-top:16px">${img('paperweight','Kiki’s bagel and cream cheese paperweight',160,162)}<div style="flex:1;background:#f4f1e8;padding:10px 12px;box-sizing:border-box">${lab('Subway fare, after midnight',R)}<div style="${N};font-size:56px;line-height:1;font-weight:700;color:${K};margin-top:4px">$1.50</div><div style="${T};font-size:13px;line-height:1.35;color:#3d4640;margin-top:4px">Paul has 97 cents. His twenty blew out of the cab.</div></div></div>${FX_SP}<div style="border-top:2px solid ${Y};padding-top:10px">${lab('Cue',Y)}<div style="${B};font-size:14px;line-height:1.45;color:#eef0ea;margin-top:5px">${ESC(fmtCue(f))}</div></div><div style="display:flex;justify-content:space-between;margin-top:12px">${lab('28 Howard Street. Catch the keys.','#9aa39c','font-size:11px')}<span style="${T};font-size:9px;color:#9aa39c;letter-spacing:.06em">1985 / FILM IMAGERY: TMDB</span></div></aside>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 10%,rgba(241,211,107,.12),transparent 55%)"></div>${check}${side}</div>`;
}

/* Messenger refuelling: a hi-vis supper card with genuine street-level cycling frames. */
function fmtMessenger(f,spec,menu,poster){
 const N='#28322d',P='#f0ebd9',W='#fbf8ec',Y='#e1e472',M='#616b5a',A='#675f26',R='#b8432c',L='#c5c6b1';
 const D="font-family:'Alfa Slab One',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const a=spec.art||{};
 const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
 const lab=(t,col=A,e='')=>`<div style="${B};font-size:12px;line-height:1.2;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${col};${e}">${ESC(t)}</div>`;
 const rows=[];let n=0;
 spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
 const drop=['Broadway & 116th','Chinatown','Midtown, curbside','Back at dispatch','Wherever Vanessa is'],job=['0412','0413','0414','0415','0416'],eta=['4:21','5:02','5:40','6:15','6:59'];
 const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:64px 1fr 104px;column-gap:14px;align-items:center;border-top:1px solid ${L};padding:7px 0">
   <div style="text-align:center"><div style="${B};font-size:11px;font-weight:700;letter-spacing:.1em;color:${M}">JOB</div><div style="${D};font-size:19px;line-height:1.1;color:${N}">${job[i]}</div></div>
   <div><div style="display:flex;align-items:baseline;gap:9px;flex-wrap:wrap"><span style="${B};font-size:25px;line-height:1.05;font-weight:700;color:${N}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',A)}</div>
   ${r.it.desc?`<div style="${B};font-size:17px;line-height:1.25;font-weight:500;color:${N};margin-top:2px">${ESC(r.it.desc)}</div>`:''}
   ${r.it.film?`<div style="${B};font-size:15px;line-height:1.25;font-style:italic;color:${M};margin-top:1px">Drop: ${ESC(drop[i]||'')}. ${ESC(r.it.film.charAt(0).toUpperCase()+r.it.film.slice(1))}.</div>`:''}</div>
   <div style="text-align:right"><div style="${B};font-size:11px;font-weight:700;letter-spacing:.1em;color:${M}">SIGNED OUT</div><div style="${D};font-size:20px;color:${R}">${eta[i]} PM</div></div></div>`;
 const form=`<section style="position:absolute;left:452px;top:24px;width:595px;height:694px;box-sizing:border-box;background:${W};border:2px solid ${N};box-shadow:6px 7px 0 ${Y};display:flex;flex-direction:column">
   <div style="display:flex;justify-content:space-between;align-items:stretch;border-bottom:2px solid ${N}">
     <div style="padding:10px 16px">${lab('Dispatch manifest / same-day rush',A)}<div style="${D};font-size:30px;line-height:1.05;color:${N};margin-top:4px">Between drops</div><div style="${B};font-size:17px;font-weight:600;color:${M};margin-top:2px">Messenger supper. Sign every drop.</div></div>
     <div style="background:${N};color:${Y};padding:10px 16px;text-align:center;display:flex;flex-direction:column;justify-content:center">${lab('Must arrive by',Y)}<div style="${D};font-size:34px;line-height:1;margin-top:4px">7:00</div><div style="${B};font-size:15px;font-weight:700;letter-spacing:.1em">PM SHARP</div></div></div>
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:2px solid ${N}">
     <div style="padding:7px 16px">${lab('Rider',M)}<div style="${B};font-size:18px;font-weight:700;color:${N}">WILEE</div></div>
     <div style="padding:7px 14px;border-left:1px solid ${L}">${lab('Bike',M)}<div style="${B};font-size:18px;font-weight:700;color:${N}">FIXED GEAR, NO BRAKES</div></div>
     <div style="padding:7px 14px;border-left:1px solid ${L}">${lab('Pickup',M)}<div style="${B};font-size:18px;font-weight:700;color:${N}">COLUMBIA, NIMA</div></div></div>
   <div style="padding:0 16px;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
   <div style="border-top:2px solid ${N};padding:7px 16px;display:flex;justify-content:space-between;${B};font-size:12px;font-weight:700;letter-spacing:.1em;color:${M}"><span>IF A DETECTIVE NAMED MONDAY ASKS: NO ENVELOPE</span><span>FILM IMAGERY: TMDB</span></div></section>`;
 const left=`<section style="position:absolute;left:24px;top:24px;width:404px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
   <div style="background:${Y};padding:14px 18px 14px;border:2px solid ${N}">${lab('Manhattan / '+f.year,N)}<div style="${D};font-size:46px;line-height:1;letter-spacing:-.02em;color:${N};margin-top:6px">PREMIUM RUSH</div><div style="${B};font-size:21px;font-weight:600;color:${N};margin-top:4px">${ESC(spec.tag||'')}</div></div>
   <figure style="margin:0;position:relative;border:2px solid ${N}">${img('wilee','Wilee riding his bike through Manhattan traffic',400,238,'50% 15%')}<figcaption style="position:absolute;left:10px;bottom:10px;background:${N};color:${P};padding:4px 9px;${B};font-size:13px;font-weight:600;letter-spacing:.08em">WILEE / OUT ON THE STREET</figcaption></figure>
   <div style="display:flex;justify-content:space-between">
     <figure style="margin:0;position:relative;border:2px solid ${N}">${img('nima','Nima, whose envelope starts the run',192,112,'50% 10%')}<figcaption style="position:absolute;left:6px;bottom:6px;background:${N};color:${P};padding:3px 7px;${B};font-size:12px;font-weight:600;letter-spacing:.08em">NIMA / PICKUP</figcaption></figure>
     <figure style="margin:0;position:relative;border:2px solid ${N}">${img('vanessa','Vanessa riding through traffic',192,112,'50% 10%')}<figcaption style="position:absolute;left:6px;bottom:6px;background:${N};color:${P};padding:3px 7px;${B};font-size:12px;font-weight:600;letter-spacing:.08em">VANESSA</figcaption></figure></div>
   <div style="background:${N};color:${P};padding:11px 16px 12px">${lab('Serving cue',Y)}<div style="${B};font-size:19px;line-height:1.3;font-weight:500;margin-top:4px">${ESC(fmtCue(f))}</div></div></section>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${P};box-shadow:0 18px 38px rgba(0,0,0,.4)">${left}${form}</div>`;
}


function fmtSixteen(f,spec,menu,poster){
  const D='#243e42',P='#f2eee2',I='#1d2a2c',M='#55605c',R='#9c482e',Y='#e3c36b',H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const stops=[['02','8:04 AM'],['05','8:21 AM'],['09','8:47 AM'],['13','9:32 AM'],['16','9:58 AM']];
  const field=(k,v)=>`<div style="border-right:1px solid #b9b3a2;padding:6px 10px"><div style="${T};font-size:10px;font-weight:700;letter-spacing:.07em;color:${M}">${k}</div><div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px">${v}</div></div>`;
  const row=(it,i)=>`<div style="display:flex;gap:16px;padding:${i?10:0}px 0 10px;${i<all.length-1?'border-bottom:1px solid #cdc6b3':''}">
    <div style="width:80px;flex:none;text-align:center;border:2px solid ${I};padding:3px 0 4px;align-self:flex-start;background:#fff"><div style="${T};font-size:10px;font-weight:700;color:${R};letter-spacing:.05em;text-transform:uppercase">${ESC(tabs[i]||'')}</div><div style="${H};font-size:26px;line-height:1;font-weight:700;color:${I}">BLK ${stops[i]?stops[i][0]:''}</div><div style="${T};font-size:11px;font-weight:700;color:${M}">${stops[i]?stops[i][1]:''}</div></div>
    <div style="flex:1;min-width:0">
    <div style="${H};font-size:${i===2?30:25}px;line-height:1.02;font-weight:700;text-transform:uppercase;color:${I}">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.38;color:${I};margin-top:3px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`;
  const ticks=Array.from({length:16},(_,i)=>`<div style="position:absolute;left:0;top:${i*29}px;width:${i%5===4?16:10}px;height:2px;background:${I}"></div><div style="position:absolute;left:20px;top:${i*29-6}px;${T};font-size:10px;font-weight:700;color:${M}">${i+1}</div>`).join('');
  const clip=`<div aria-hidden="true" style="position:absolute;left:40px;top:-14px;width:18px;height:46px;border:3px solid #8a8f8f;border-radius:9px;z-index:2"></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};overflow:hidden;box-shadow:0 16px 40px #0006">
  <section aria-label="Witness transport log menu" style="${at(22,22,1027,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.5)`)}">
    <header style="${at(28,18,971,'display:flex;justify-content:space-between;align-items:flex-end')}">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${R}">FORM 16-B / WITNESS TRANSPORT LOG / LOWER MANHATTAN</div><div style="${H};font-size:46px;line-height:.95;font-weight:700;color:${I};text-transform:uppercase;margin-top:3px">16 Blocks lunch run</div></div>
      <div style="text-align:right;border:3px solid ${R};padding:4px 12px;transform:rotate(-3deg)"><div style="${T};font-size:10px;font-weight:700;color:${R};letter-spacing:.08em">GRAND JURY CLOSES</div><div style="${H};font-size:36px;line-height:1;font-weight:700;color:${R}">10:00 AM</div></div>
    </header>
    <div style="${at(28,88,971,`display:grid;grid-template-columns:1.2fr 1.1fr 1fr 1fr .8fr;border:2px solid ${I};background:#fff`)}">
      ${field('OFFICER','Det. Jack Mosley')}${field('WITNESS','Eddie Bunker')}${field('FROM','Precinct holding')}${field('TO','Courthouse, 4th fl')}<div style="padding:6px 10px"><div style="${T};font-size:10px;font-weight:700;letter-spacing:.07em;color:${M}">DISTANCE</div><div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px">16 blocks</div></div>
    </div>
    <div aria-hidden="true" style="${at(28,166,30,'height:452px;border-left:2px solid '+I)}">${ticks}</div>
    <div style="${at(72,160,566)}">${all.map(row).join('')}</div>
    <div style="${at(666,166,333)}">
      <figure style="margin:0;position:relative;background:#fff;padding:6px 6px 0;box-shadow:0 4px 10px rgba(0,0,0,.3);transform:rotate(1deg)">${clip}${img('eddie','Eddie Bunker in 16 Blocks',321,160)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">WITNESS: E. BUNKER. Talks a lot. Bakes.</figcaption></figure>
      <figure style="margin:14px 0 0;position:relative;background:#fff;padding:6px 6px 0;box-shadow:0 4px 10px rgba(0,0,0,.3);transform:rotate(-1deg)">${img('partners','Jack Mosley and Eddie Bunker on the move through the city',321,160)}<figcaption style="${T};font-size:11px;color:${I};padding:6px 2px 7px">OFFICER: J. MOSLEY. Running late.</figcaption></figure>
      <div style="margin-top:14px;border-top:2px solid ${I};padding-top:8px"><div style="${T};font-size:10.5px;font-weight:700;letter-spacing:.07em;color:${R}">REMARKS</div><div style="${H};font-size:22px;line-height:1.1;font-weight:600;color:${I};margin-top:2px">People can change.</div><div style="${T};font-size:12px;color:${M};margin-top:3px">P.S. Birthday cake to follow, from Seattle.</div></div>
    </div>
    <footer style="${at(28,654,971,'border-top:2px solid '+I+';padding-top:8px;display:flex;gap:12px;align-items:baseline')}"><span style="${T};font-size:11px;font-weight:700;color:${R};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span><span style="${T};font-size:9px;color:${M};margin-left:auto;white-space:nowrap">FILM IMAGERY: TMDB</span></footer>
  </section></div>`;
}


function fmtSullivanSupper(f,spec,menu,poster){
  const CR='#f2ead6',IN='#1c2333',RD='#b8321f',BL='#204a7a',GN='#2f7d5b',SO='#5a5a52',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:13px;font-weight:700;line-height:1.2;letter-spacing:.12em;text-transform:uppercase;color:${c||BL};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const log=[['10.11.69','5/9','Firehouse'],['10.16.69','5/9','Shea'],['10.11.69','5/8','Kitchen'],['10.11.99','5/7','Julia’s'],['10.12.99','5/9','Back porch']];
  const row=(it,i)=>{const l=log[i]||log[0];return `<div style="display:grid;grid-template-columns:80px 1fr 82px;column-gap:14px;padding:12px 0 11px;border-bottom:1px solid #c9bea3">
    <div><div style="${T};font-size:13px;font-weight:700;color:${RD}">${l[0]}</div><div style="${T};font-size:12px;color:${SO};margin-top:3px">RST ${l[1]}</div></div>
    <div><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase;letter-spacing:.01em">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${BL}">${ESC(it.film||'')}</p></div>
    <div style="text-align:right">${lab(ESC(gs[i]?gs[i].tab:''),GN)}<div style="${T};font-size:12px;line-height:1.3;color:${SO};margin-top:4px;white-space:nowrap">${l[2]}</div></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:linear-gradient(160deg,#0b1424 0%,#13283a 40%,#1b3d3a 62%,#2a1d40 100%);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;left:560px;top:-120px;width:700px;height:420px;border-radius:50%;background:radial-gradient(ellipse,#3fd19a40,#0000 65%);transform:rotate(-14deg)"></div>
  <div aria-hidden="true" style="position:absolute;left:720px;top:-60px;width:500px;height:300px;border-radius:50%;background:radial-gradient(ellipse,#a46cd833,#0000 65%);transform:rotate(-24deg)"></div>
  <div style="position:absolute;left:24px;top:18px;width:636px;height:706px;background:${CR};box-shadow:0 12px 28px #000a;box-sizing:border-box;padding:14px 22px 12px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid ${IN};padding-bottom:8px">
      <div>${lab('Confirming our two-way contact',RD)}<div style="${C};font-size:48px;font-weight:700;line-height:.86;color:${IN};margin-top:4px">QSL / QUEENS NY</div></div>
      <div style="text-align:right;border:2px solid ${RD};padding:5px 9px;transform:rotate(3deg)"><div style="${C};font-size:22px;font-weight:700;color:${RD};line-height:1">1969 ⇄ 1999</div><div style="${T};font-size:11px;color:${RD};margin-top:2px">SAME RIG. SAME FREQ.</div></div>
    </div>
    <div style="display:flex;justify-content:space-between;${T};font-size:13px;color:${IN};padding:7px 0;border-bottom:1px solid ${IN}"><span>TO: Little Chief</span><span>FROM: Frank, Engine Co.</span><span>WX: Aurora borealis</span></div>
    <div style="display:grid;grid-template-columns:80px 1fr 82px;column-gap:14px;padding:6px 0 4px;border-bottom:2px solid ${IN}">${lab('Date')}${lab('Traffic / supper')}${lab('QTH','','text-align:right')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
  </div>
  <header style="position:absolute;left:688px;top:22px;width:360px">
    ${lab('The Sullivans / Queens / 2000','#8fe0bd')}
    <h1 style="${C};font-size:76px;line-height:.86;font-weight:700;letter-spacing:.01em;margin:6px 0 0;color:#f2ead6;text-transform:uppercase;text-shadow:none">Frequency</h1>
    <div style="${B};font-size:15px;line-height:1.35;color:#cfe3dc;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:688px;top:158px;width:360px;margin:0;background:#f6f1e4;padding:8px 8px 10px;box-sizing:border-box;box-shadow:0 10px 22px #000a;transform:rotate(-1deg)">${img('frank','Frank Sullivan at the ham radio in 1969',344,200)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:8px">The aurora is up. The old radio crackles. A voice from 1999 answers.</figcaption></figure>
  <div style="position:absolute;left:688px;top:450px;width:360px;display:flex;gap:16px;align-items:stretch">
    <div style="flex:none;background:#f6f1e4;padding:6px;box-shadow:0 10px 22px #000a;transform:rotate(1.4deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;background:#f2ead6;padding:12px 12px 10px;box-shadow:0 8px 18px #0008;display:flex;flex-direction:column;border-top:6px solid ${BL}">
      ${lab('Admit one / Game 5',RD)}
      <div style="${C};font-size:28px;line-height:.95;font-weight:700;color:${IN};margin-top:6px">WORLD SERIES 1969</div>
      <p style="${B};font-size:13px;line-height:1.4;color:${IN};margin:8px 0 0">Oct 16. The Miracle Mets close it out at Shea. John called it thirty years early.</p>
      <div style="margin-top:auto;${T};font-size:12px;color:${SO};border-top:1px dashed ${SO};padding-top:6px">SEC 69 / ROW 99</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#9fb6b0">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtUnplanned(f,spec,menu,poster){
  const P='#efe9dc',N='#263a3e',C='#6e5543',A='#a9412f',L='#cfc5b2',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:${N}"></div>`;
  const lab=(s,c=C,e='')=>`<div style="${T};font-size:11px;line-height:1.3;letter-spacing:.07em;font-weight:700;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const times=['7:05 PM','7:40 PM','8:30 PM','10:15 PM','11:59 PM'],kick=['Sequence 01 / The cart by the bus stop','Sequence 02 / Rooftops','Sequence 03 / Not in the plan','Sequence 04 / A softer centre','Sequence 05 / Election night'];
  const step=(x,i)=>{const off=i===2;return `<article style="display:grid;grid-template-columns:76px 22px 1fr;column-gap:10px;position:relative;padding:0 0 ${i<4?13:0}px"><div style="${T};font-size:14px;line-height:1.2;font-weight:700;color:${off?A:N};text-align:right;padding-top:3px">${times[i]}</div><div style="position:relative"><div style="position:absolute;left:5px;top:5px;width:12px;height:12px;border-radius:50%;background:${off?A:P};border:2px solid ${off?A:N};box-sizing:border-box"></div></div><div style="${off?`border:2px solid ${A};padding:9px 12px 10px;margin:-4px 0 0;background:#f6efe1`:''}">${lab(kick[i],off?A:C)}<h3 style="${H};font-size:${off?32:26}px;line-height:1;font-weight:600;color:${N};margin:4px 0 0">${nm(x)}</h3><div style="${B};font-size:13.5px;line-height:1.4;color:#45504f;margin-top:4px">${ESC(x.d)}</div><div style="${H};font-size:16px;line-height:1.2;font-style:italic;color:${off?A:C};margin-top:2px">${ESC(x.note||'')}</div></div></article>`;};
  const pageL=`<section style="${at(22,22,505,'height:698px;background:'+P+';box-shadow:0 8px 20px rgba(0,0,0,.35)')}"><div aria-hidden="true" style="position:absolute;right:0;top:0;width:38px;height:698px;background:linear-gradient(90deg,transparent,rgba(60,45,30,.16))"></div><div style="${at(30,26,445)}"><div style="display:flex;justify-content:space-between">${lab('Plan book / Case 2006-NY',A)}${lab('Restricted',C)}</div><h1 style="${H};font-size:50px;line-height:.92;font-weight:600;letter-spacing:-.02em;color:${N};margin:12px 0 0;text-shadow:none">The Adjustment Bureau</h1><div style="${H};font-size:21px;line-height:1.2;font-style:italic;color:${C};margin-top:8px">${ESC(spec.tag||'Fate has a plan. So does dessert.')}</div><figure style="margin:16px 0 0">${img('bus','Elise and David seated together on the bus',445,250)}<figcaption style="display:flex;justify-content:space-between;margin-top:7px">${lab('M6 bus. Not in the plan.',N)}${lab('Ink: deviation',A)}</figcaption></figure><div style="display:grid;grid-template-columns:150px 1fr;gap:14px;margin-top:14px;padding-top:13px;border-top:1px solid ${L}">${img('meeting','David and Elise meet on election night',150,92)}<div><div style="${T};font-size:12.5px;line-height:1.5;color:${N}">SUBJECT: NORRIS, DAVID<br>INTERVENTION: COFFEE SPILL, 7:05 AM<br>ADJUSTER: HARRY MITCHELL<br>STATUS: <span style="color:${A};font-weight:700">MISSED</span></div></div></div><div style="margin-top:14px;padding-top:11px;border-top:1px solid ${L}">${lab('Cue')}<div style="${B};font-size:13.5px;line-height:1.4;color:${N};margin-top:4px">${ESC(fmtCue(f))}</div></div></div><div style="${at(30,670,445,'display:flex;justify-content:space-between')}">${lab('Wear the hat. Mind the water.',C,'font-size:10px')}<span style="${T};font-size:9px;color:${C};letter-spacing:.06em">FILM IMAGERY: TMDB</span></div></section>`;
  const pageR=`<section aria-label="Tonight's sequence" style="${at(527,22,522,'height:698px;background:'+P+';box-shadow:0 8px 20px rgba(0,0,0,.35)')}"><div aria-hidden="true" style="position:absolute;left:0;top:0;width:38px;height:698px;background:linear-gradient(270deg,transparent,rgba(60,45,30,.18))"></div><div style="${at(34,26,456)}"><div style="display:flex;justify-content:space-between;border-bottom:2px solid ${N};padding-bottom:6px">${lab('Tonight / Supper for four',N)}${lab('Approved by the Chairman',C)}</div><div aria-hidden="true" style="position:absolute;left:96px;top:52px;width:2px;height:560px;background:${N};opacity:.55"></div><div style="padding-top:16px">${xs.slice(0,5).map(step).join('')}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${N};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(160deg,#2f4549,#1d2c2f)"></div>${pageL}${pageR}</div>`;
}

function fmtDinnerEventually(f,spec,menu,poster){
  const P='#f4ead5',W='#fffaf0',I='#173e49',A='#a7442d',S='#655f51',Y='#efbf53',L='#d8ccb3',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=A,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const qty=['2','1 bag','2','2 slices','2, dry'];
  const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:34px 1fr 74px;column-gap:14px;align-items:center;border-top:1px solid ${L};padding:7px 0">
    <div style="width:26px;height:26px;border:2px solid ${I};position:relative;background:#fff"><span style="position:absolute;left:3px;top:-9px;${T};font-size:30px;font-weight:700;line-height:1;color:${A};transform:rotate(-8deg)">X</span></div>
    <div><div style="display:flex;align-items:baseline;gap:10px"><span style="${H};font-size:24px;line-height:1.05;font-weight:600;color:${I}">${ESC(r.it.label||'')}</span>${lab(r.g.tab||'',S,'white-space:nowrap')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${I};margin-top:3px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${A};margin-top:2px">${ESC(r.it.film)}</div>`:''}</div>
    <div style="text-align:center;border-bottom:1px solid ${I};padding-bottom:2px"><div style="${T};font-size:10px;font-weight:700;color:${S}">QTY</div><div style="${T};font-size:15px;font-weight:700;color:${I}">${qty[i]||'2'}</div></div></div>`;
  const card=`<section style="position:absolute;left:24px;top:24px;width:640px;height:694px;box-sizing:border-box;background:${W};border:1px solid ${L};box-shadow:0 8px 18px #173e4933;display:flex;flex-direction:column">
    <div style="background:${I};color:${P};padding:14px 22px 14px 96px;position:relative">
      <span aria-hidden="true" style="position:absolute;left:22px;top:50%;width:54px;height:54px;margin-top:-27px;border-radius:50%;background:${P};border:3px solid #0d2a32"></span>
      ${lab('Room service / Breakfast door card',Y)}
      <div style="${B};font-size:34px;line-height:1.05;font-weight:700;letter-spacing:-.01em;margin-top:4px">${ESC(spec.brand||'Breakfast. At last.')}</div>
      <div style="${H};font-size:19px;font-style:italic;line-height:1.2;color:#f4ead5cc;margin-top:3px">Check what you want. Hang outside your door. Pray.</div></div>
    <div style="display:grid;grid-template-columns:1.25fr 1.3fr .9fr;border-bottom:2px solid ${I}">
      <div style="padding:8px 22px">${lab('Guest',S)}<div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px">MR. &amp; MRS. KELLERMAN</div></div>
      <div style="padding:8px 14px;border-left:1px solid ${L}">${lab('Spelled',S)}<div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px;white-space:nowrap">K-E-L-L-E-R-M-A-N</div></div>
      <div style="padding:8px 14px;border-left:1px solid ${L}">${lab('Arrived',S)}<div style="${T};font-size:15px;font-weight:700;color:${I};margin-top:2px">EVENTUALLY</div></div></div>
    <div style="padding:2px 22px 0;flex:1;display:flex;flex-direction:column">${rows.map(row).join('')}</div>
    <div style="border-top:2px solid ${I};padding:8px 22px;display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${S}"><span>ALLOW 30 MINUTES. OR ALL NIGHT.</span><span>FILM IMAGERY: TMDB</span></div></section>`;
  const photo=(k,alt,w,h,pos,cap)=>`<figure style="margin:0;background:#fff;padding:6px;box-shadow:0 4px 10px #173e4933">${img(k,alt,w,h,pos)}${cap?`<figcaption style="${T};font-size:13px;color:${I};margin-top:6px">${ESC(cap)}</figcaption>`:''}</figure>`;
  const names=['The airline','The railroad','The hotel desk','The man in the park','Everybody, frankly'];
  const side=`<section style="position:absolute;left:688px;top:24px;width:359px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${B};font-size:30px;line-height:1.02;font-weight:700;color:${I};letter-spacing:-.015em">The Out-of-Towners</div><div style="${H};font-size:20px;font-style:italic;color:${A};margin-top:3px">${ESC(spec.tag||'')}</div></div>
    ${photo('park','George and Gwen spending the night in Central Park',347,196,'center','A night in Central Park.')}
    <div style="display:flex;justify-content:space-between">${photo('flight','The diverted flight',162,96,'center','')}${photo('counter','Another counter, another no',162,96,'center','')}</div>
    <div style="background:#fffbe6;border-top:22px solid ${Y};padding:10px 16px 12px;box-shadow:0 4px 10px #173e4926;transform:rotate(.6deg)">
      ${lab("George's list. I'm getting names.",A)}
      <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:12px;margin-top:5px">${names.map(x=>`<div style="${T};font-size:13px;line-height:1.45;color:${I}">${ESC(x)}</div>`).join('')}</div></div>
    <div style="background:${A};color:${P};padding:11px 16px 12px">${lab('Showtime cue',P)}<div style="${B};font-size:15px;line-height:1.4;font-weight:600;margin-top:4px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};box-shadow:0 15px 40px #0005;overflow:hidden">${card}${side}</div>`;
}


function fmtBoweryBelow(f,spec,menu,poster){
  const D='#131d21',P='#efe9d6',G='#b9dc5c',K='#3f5530',I='#1b2224',M='#4f564c',R='#b32a1f',H="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab+' / '+g.h));
  const micro=(s,c=K)=>`<div style="${T};font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${c}">${ESC(s)}</div>`;
  const tick=['BOWL 01','BOWL 02','POT 03','TRAY 04','CUP 05'];
  const dish=(i,big)=>{const it=all[i]||{};return `<div style="display:flex;justify-content:space-between;align-items:baseline">${micro(tabs[i]||'')}<span style="${T};font-size:11px;font-weight:700;color:${M}">${tick[i]}</span></div>
    <div style="${H};font-size:${big?40:26}px;line-height:1;font-weight:700;text-transform:uppercase;letter-spacing:.01em;color:${I};margin-top:4px">${ESC(it.label||'')}</div>
    <div style="${B};font-size:15px;line-height:1.42;color:${I};margin-top:5px">${ESC(it.desc||'')}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.35;color:${M};margin-top:3px">${ESC(it.film)}</div>`:''}`};
  const grate=`<div aria-hidden="true" style="width:96px;height:96px;flex:none;border-radius:50%;background:#3a4144;border:5px solid #23292b;box-shadow:inset 0 0 0 7px #2c3335;position:relative;overflow:hidden"><div style="position:absolute;inset:14px;border-radius:50%;border:3px solid #5d6669"></div><div style="position:absolute;left:10px;right:10px;top:44px;height:3px;background:#5d6669"></div><div style="position:absolute;top:10px;bottom:10px;left:44px;width:3px;background:#5d6669"></div><div style="position:absolute;inset:30px;border-radius:50%;border:3px solid #5d6669"></div></div>`;
  const left=`<div style="${at(24,22,330,'height:698px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#e9e3cf;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(-1deg)">${img('kitchen','The Reverend’s soup kitchen on the Bowery',318,190)}<figcaption style="${T};font-size:11px;color:${I};padding:7px 2px 8px">The Reverend’s kitchen, Bowery.</figcaption></figure>
    <figure style="margin:16px 0 0;background:#e9e3cf;padding:6px 6px 0;box-shadow:0 5px 14px rgba(0,0,0,.6);transform:rotate(1deg)">${img('street','Wet New York street and telephone booth in C.H.U.D.',318,180,'center 58%')}<figcaption style="${T};font-size:11px;color:${I};padding:7px 2px 8px">Downtown, 1984. Mind the manholes.</figcaption></figure>
    <div style="margin-top:auto;display:flex;gap:16px;align-items:center">${grate}<div><div style="${H};font-size:30px;line-height:1;font-weight:700;color:${G};letter-spacing:.02em">${ESC(spec.tag||'')}</div><div style="${T};font-size:11px;line-height:1.45;color:#a9b3a3;margin-top:6px">Missing persons: report to Captain Bosch. Do not open the waste canisters.</div></div></div>
  </div>`;
  const sheet=`<section aria-label="Bowery soup kitchen menu" style="${at(378,22,669,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.6);padding:22px 30px 0;box-sizing:border-box`)}">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid ${I};padding-bottom:9px">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.1em;color:${K}">ABOVE GROUND SUPPER / LOWER MANHATTAN / 1984</div><div style="${H};font-size:56px;line-height:.95;font-weight:700;letter-spacing:.01em;color:${I}">BOWERY SOUP KITCHEN</div></div>
      <div style="${T};font-size:11px;line-height:1.45;text-align:right;color:${M}">HOT MEAL AT 6<br>ALL WELCOME<br>NO CHARGE</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:30px;margin-top:16px">
      <div>${dish(0)}</div><div>${dish(1)}</div></div>
    <div style="margin-top:16px;background:${I};color:${P};padding:16px 20px;position:relative">
      <div style="display:flex;justify-content:space-between;align-items:baseline">${micro(tabs[2]||'',G)}<span style="${T};font-size:11px;font-weight:700;color:${G}">${tick[2]}</span></div>
      <div style="${H};font-size:36px;line-height:1;font-weight:700;text-transform:uppercase;color:${P};margin-top:4px">${ESC((all[2]||{}).label||'')}</div>
      <div style="${B};font-size:15px;line-height:1.42;color:${P};margin-top:5px;max-width:560px">${ESC((all[2]||{}).desc||'')}</div>
      <div style="${T};font-size:13px;color:#c4cfb8;margin-top:3px">${ESC((all[2]||{}).film||'')}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:30px;margin-top:16px">
      <div>${dish(3)}</div><div>${dish(4)}</div></div>
    <div style="${at(30,628,609,'border-top:2px solid '+I+';padding-top:9px;display:flex;gap:12px;align-items:baseline')}"><span style="${T};font-size:11px;font-weight:700;color:${R};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:13px;line-height:1.35;color:${I}">${ESC(fmtCue(f))}</span><span style="${T};font-size:9px;color:${M};margin-left:auto;white-space:nowrap">FILM IMAGERY: TMDB</span></div>
  </section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};overflow:hidden;box-shadow:0 16px 40px #0006">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse at 18% 100%,rgba(185,220,92,.22),transparent 55%)"></div>${left}${sheet}<div aria-hidden="true" style="${at(800,562,220,`border:3px solid ${R};color:${R};padding:5px 8px;transform:rotate(-7deg);opacity:.85;text-align:center;background:rgba(239,233,214,.88)`)}"><div style="${H};font-size:24px;font-weight:700;letter-spacing:.06em;line-height:1">C.H.U.D.</div><div style="${T};font-size:10px;font-weight:700;letter-spacing:.04em;line-height:1.3;margin-top:3px">CONTAMINATION HAZARD<br>URBAN DISPOSAL</div></div></div>`;
}


function fmtToyStore(f,spec,menu,poster){
  const CR='#f3e6c4',IN='#2a1630',RD='#9c1f2e',GD='#b7862d',PU='#3b1740',SO='#5a4436',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c,e='')=>`<div style="${C};font-size:13px;font-weight:700;line-height:1.2;letter-spacing:.14em;text-transform:uppercase;color:${c||RD};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const price=['25¢','13¢','$1','88¢','12¢'];
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:44px 1fr 96px;column-gap:14px;align-items:start;padding:8px 0 8px;${i?'border-top:1px dashed '+GD:''}">
    <div style="width:40px;height:40px;border-radius:50%;border:2px solid ${RD};display:grid;place-items:center;${C};font-size:20px;font-weight:700;color:${RD};line-height:1">${i+1}</div>
    <div><h3 style="${C};font-size:25px;line-height:1;font-weight:700;margin:2px 0 0;color:${IN};text-transform:uppercase;letter-spacing:.01em">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.4;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${B};font-size:13px;line-height:1.35;font-style:italic;margin:3px 0 0;color:${RD}">${ESC(it.film||'')}</p></div>
    <div style="text-align:right"><div style="${C};font-size:24px;font-weight:700;color:${IN};line-height:1">${price[i]||''}</div>${lab(ESC(gs[i]?gs[i].tab:''),GD,'margin-top:4px')}</div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:radial-gradient(ellipse at 70% 30%,#5a2160,${PU} 55%,#1d0a22);overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-radial-gradient(circle at 70% 30%,#0000 0 30px,#ffffff05 30px 32px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:612px;height:706px;background:${CR};box-shadow:0 12px 28px #000a;transform:rotate(-.6deg);box-sizing:border-box;padding:12px">
   <div style="height:100%;border:3px double ${RD};box-sizing:border-box;padding:14px 22px 12px;display:flex;flex-direction:column">
    <div style="text-align:center;border-bottom:2px solid ${RD};padding-bottom:8px">
      ${lab('★ The great Zoltar speaks ★')}
      <div style="${C};font-size:48px;font-weight:700;line-height:.9;letter-spacing:.04em;color:${IN};margin-top:4px">YOUR WISH IS GRANTED</div>
      <div style="${B};font-size:14px;font-style:italic;color:${SO};margin-top:5px">${ESC(spec.tag||'')} Keep this card. It is your fortune.</div>
    </div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline;border-top:2px solid ${RD};padding-top:8px">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
   </div>
  </div>
  <header style="position:absolute;left:668px;top:22px;width:378px">
    ${lab('MacMillan Toy Co. / New York / 1988',GD)}
    <h1 style="${C};font-size:118px;line-height:.8;font-weight:700;letter-spacing:-.01em;margin:6px 0 0;color:#f6e7c3;text-shadow:none">BIG</h1>
    <div style="${C};font-size:22px;font-weight:600;line-height:1.1;color:#f0c86a;margin-top:6px;text-transform:uppercase;letter-spacing:.06em">${ESC(spec.brand||'')}</div>
  </header>
  <figure style="position:absolute;left:668px;top:206px;width:378px;margin:0;background:#f8f1de;padding:8px 8px 10px;box-sizing:border-box;box-shadow:0 10px 22px #000a;transform:rotate(1deg)">${img('piano','Josh and MacMillan play the giant floor piano',362,210)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:8px"><b>Heart and Soul</b>, then Chopsticks. Played with your feet.</figcaption></figure>
  <div style="position:absolute;left:668px;top:484px;width:378px;display:flex;gap:16px;align-items:stretch">
    <div style="flex:none;background:#f8f1de;padding:6px;box-shadow:0 10px 22px #000a;transform:rotate(-1.4deg)">${fmtPosterImg(f,poster,140,210)}</div>
    <div style="flex:1;border:2px solid ${GD};background:#2a0f2f;padding:14px 14px 12px;display:flex;flex-direction:column;align-items:center;text-align:center">
      ${lab('Fortune machine','#f0c86a')}
      <div style="width:64px;height:10px;border-radius:5px;background:#120614;box-shadow:inset 0 2px 3px #000;margin:14px 0 6px"></div>
      <div style="${C};font-size:15px;font-weight:700;letter-spacing:.12em;color:#f6e7c3">INSERT 25¢</div>
      <p style="${B};font-size:13px;line-height:1.42;color:#e7d6e8;margin:10px 0 0">Make one wish. Then read the card. Check the plug before you leave.</p>
      <div style="margin-top:auto;${C};font-size:12px;font-weight:600;letter-spacing:.1em;color:#c9a0c8">SEA POINT PARK / NJ</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${B};font-size:9px;color:#b99cba">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtOceanSupper(f,spec,menu,poster){
  const K='#1b1d1e',D='#123e48',P='#f1ede1',A='#94582d',S='#4a5254',B="font-family:'Libre Franklin',sans-serif",H="font-family:'Cormorant Garamond',serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:${D}"></div>`;
  const lab=(s,c=A,e='')=>`<div style="${T};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const dish=(x,kick,big)=>`<article style="${big?`background:${D};color:${P};padding:13px 16px 14px;margin:2px 0`:`padding:10px 0 11px;border-bottom:1px solid #c9c2ae`}">${lab(kick,big?'#e6c598':A)}<h3 style="${H};font-size:${big?36:26}px;line-height:1;font-weight:600;color:${big?P:K};margin:5px 0 0">${nm(x)}</h3><div style="${B};font-size:${big?14:13.5}px;line-height:1.42;color:${big?'#d9e4e2':S};margin-top:5px">${ESC(x.d)}</div><div style="${H};font-size:16px;line-height:1.2;font-style:italic;color:${big?'#e6c598':D};margin-top:3px">${ESC(x.note||'')}</div></article>`;
  const mast=`<header style="${at(30,22,1011)}"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${K};padding-bottom:7px">${lab('Splash extra / late city edition',K)}<div style="${H};font-size:30px;line-height:1;font-weight:600;color:${K};letter-spacing:.04em">The Evening Ledger</div>${lab('New York / 1984 / 25 cents',K)}</div><div style="${B};font-size:74px;line-height:1;font-weight:700;letter-spacing:-.035em;color:${K};margin-top:10px;white-space:nowrap">MERMAID IN MANHATTAN!</div><div style="display:flex;justify-content:space-between;align-items:baseline;border-top:3px solid ${K};border-bottom:1px solid ${K};margin-top:9px;padding:7px 0 6px"><div style="${H};font-size:22px;line-height:1.1;font-style:italic;color:${K}">Girl from Cape Cod orders lobster, eats the shell. Allen Bauer says she is just from out of town.</div></div></header>`;
  const ad=(h,t)=>`<div style="border:1px solid ${K};padding:6px 9px 7px">${lab(h,K)}<div style="${B};font-size:13px;line-height:1.35;color:${K};margin-top:3px">${t}</div></div>`;
  const left=`<section style="${at(30,226,478,'height:488px;display:flex;flex-direction:column')}"><figure style="margin:0">${img('restaurant','Madison eats a whole lobster at the candlelit restaurant',478,240,'center 35%')}<figcaption style="${B};font-size:13px;line-height:1.4;color:${S};margin-top:7px"><b style="color:${K}">SHE ATE THE SHELL TOO.</b> Diners stare as the mystery woman tackles a whole lobster at a midtown restaurant.</figcaption></figure><div style="display:flex;gap:14px;margin-top:11px;border-top:1px solid #c9c2ae;padding-top:10px">${img('shore','Madison on the Cape Cod shoreline',150,86,'center 40%')}<div style="flex:1">${lab('Continued from the beach')}<div style="${B};font-size:13.5px;line-height:1.4;color:${K};margin-top:4px">${ESC(fmtCue(f))}</div></div></div>${FX_SP}<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${ad('Wanted','The woman found off Liberty Island. Ask for Dr. Kornbluth.')}${ad('Bauer & Sons','Wholesale fruit and veg. Ask for Allen or Freddie.')}</div><div style="display:flex;justify-content:space-between;margin-top:8px">${lab('Six days on land. Then the full moon.',S)}<span style="${T};font-size:9px;color:${S};letter-spacing:.06em">FILM IMAGERY: TMDB</span></div></section>`;
  const right=`<section aria-label="Splash movie-night supper" style="${at(528,226,513,'height:488px;border-left:1px solid #c9c2ae;padding-left:20px;box-sizing:border-box;display:flex;flex-direction:column')}"><div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid ${K};padding-bottom:5px">${lab('Dining, page 6',K)}${lab('Table for four, Madison Ave',S)}</div><div style="display:grid;grid-template-columns:1fr 1fr;column-gap:18px">${dish(xs[0],'From the shore')}${dish(xs[1],'Cape Cod')}</div>${FX_SP}${dish(xs[2],'The main event',1)}${FX_SP}<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:18px">${dish(xs[3],'Dessert')}${dish(xs[4],'Drink')}</div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};overflow:hidden;box-shadow:0 18px 45px #0006">${mast}${left}${right}</div>`;
}


function fmtLoftSupper(f,spec,menu,poster){
  const P='#f4eee2',W='#fffdf6',I='#203c50',A='#88606a',S='#52606a',L='#c9cfd2',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=A,e='')=>`<div style="${T};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const tape=(x,r)=>`<span aria-hidden="true" style="position:absolute;left:${x};top:-11px;width:70px;height:22px;margin-left:-35px;background:#fffbe9cc;box-shadow:0 1px 2px #0002;transform:rotate(${r}deg)"></span>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const time=['6:00 pm','6:30 pm','8:00 pm','10:00 pm','2:00 am'],who=['Jack, back from Turkey','Michael','Peter','Whoever she picks','All three'];
  const row=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:96px 1fr 118px;column-gap:16px;align-items:center;border-top:1px solid ${L};padding:8px 0">
    <div><div style="${T};font-size:17px;font-weight:700;color:${I}">${time[i]||''}</div>${lab(r.g.tab||'',A,'margin-top:3px')}</div>
    <div><div style="${H};font-size:25px;line-height:1.05;font-weight:600;color:${I}">${ESC(r.it.label||'')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${S};margin-top:4px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${T};font-size:13px;line-height:1.3;color:${A};margin-top:3px">${ESC(r.it.film)}</div>`:''}</div>
    <div style="text-align:center;border:2px solid ${I};padding:6px 4px;transform:rotate(${i%2?2:-2}deg)"><div style="${T};font-size:11px;font-weight:700;color:${S};letter-spacing:.06em">ON DUTY</div><div style="${H};font-size:19px;line-height:1.05;font-weight:600;color:${I};margin-top:2px">${who[i]||''}</div></div></div>`;
  const sheet=`<section style="position:absolute;left:24px;top:24px;width:650px;height:694px;box-sizing:border-box;background:${W};box-shadow:0 6px 16px #28374833;padding:22px 26px 14px;display:flex;flex-direction:column;transform:rotate(-.4deg)">
    ${tape('18%',-5)}${tape('82%',4)}
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${I};padding-bottom:10px">
      <div>${lab('The loft / Feeding and supper schedule')}<div style="${H};font-size:46px;line-height:1;font-weight:600;color:${I};margin-top:4px">Mary's schedule</div></div>
      <div style="text-align:right;max-width:220px"><div style="${H};font-size:20px;line-height:1.15;font-weight:500;font-style:italic;color:${A}">${ESC(spec.brand||'')}.</div><div style="${B};font-size:13px;color:${S};margin-top:3px">Posted on the fridge. No excuses.</div></div></div>
    <div style="display:grid;grid-template-columns:96px 1fr 118px;column-gap:16px;padding:9px 0 5px">${lab('Time',S)}${lab('What she gets, what we get',S)}${lab('Who',S,'text-align:center')}</div>
    ${rows.map(row).join('')}
    <div style="border-top:3px solid ${I};padding-top:8px;display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${S};letter-spacing:.05em"><span>PACKAGE AT THE DOOR? CHECK WHAT'S IN IT FIRST.</span><span>FILM IMAGERY: TMDB</span></div></section>`;
  const photo=(k,alt,w,h,rot,pos,cap)=>`<figure style="position:relative;margin:0;background:#fff;padding:7px 7px ${cap?'8px':'7px'};box-shadow:0 5px 12px #28374835;transform:rotate(${rot}deg)">${img(k,alt,w,h,pos)}${cap?`<figcaption style="${T};font-size:13px;color:${I};margin-top:6px;text-align:center">${ESC(cap)}</figcaption>`:''}</figure>`;
  const side=`<section style="position:absolute;left:700px;top:24px;width:347px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div><div style="${H};font-size:40px;line-height:.95;font-weight:600;color:${I}">Three Men <span style="font-style:italic;font-weight:500;font-size:30px">and a</span> <span style="color:${A}">Baby</span></div><div style="${B};font-size:14px;line-height:1.4;color:${S};margin-top:6px">${ESC(spec.tag||'')}</div></div>
    ${photo('kitchen','Peter and Michael learning to feed Mary in the loft kitchen',333,224,.8,'center','Feeding time, round one.')}
    <div style="display:flex;justify-content:space-between">${photo('dads','Jack, Michael and Peter sharing the care of Mary',148,124,-2,'center','')}${photo('cradle','The three bachelors beside Mary’s cradle',148,124,2,'center 55%','')}</div>
    <div style="background:${I};color:${P};padding:12px 16px 13px">${lab('Lullaby cue',P)}<div style="${H};font-size:21px;line-height:1.2;font-weight:500;margin-top:5px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};box-shadow:0 15px 40px #0005;overflow:hidden"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(110deg,#fff6,transparent 58%,#cbbfa11a)"></div>${sheet}${side}</div>`;
}

function fmtPowerLunch(f,spec,menu,poster){
  const P='#fdf8ef',I='#2e2230',D='#472d45',A='#81445d',S='#5f525a',K='#f4c6c9',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,fit='cover')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:${fit};object-position:center;background:#fff">`:'';
  const heads=spec.groups.flatMap(g=>g.items.map((x,j)=>j?'':g.tab+' / '+g.h));
  const row=(it,i)=>`<div style="display:flex;gap:16px;padding:${i?8:0}px 0 8px;${i<all.length-1?'border-bottom:1px dotted #b7a6ad':''}">
    <div style="${T};font-size:19px;font-weight:700;color:${A};width:26px;flex:none;padding-top:3px">${i+1}.</div>
    <div style="flex:1;min-width:0">${heads[i]?'':''}<div style="${heads[i]?'':'display:none;'}${T};font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${A}">${ESC(heads[i]||'')}</div>
    <div style="${H};font-size:${i===2?28:24}px;line-height:1.05;font-weight:600;color:${I};margin-top:2px">${ESC(it.label)}</div>
    <div style="${B};font-size:14px;line-height:1.4;color:${I};margin-top:3px">${ESC(it.desc)}</div>
    ${it.film?`<div style="${T};font-size:13px;line-height:1.35;color:${S};margin-top:2px">${ESC(it.film)}</div>`:''}</div></div>`;
  const memo=`<section aria-label="Inter-office memo menu" style="${at(28,20,640,`height:702px;background:${P};box-shadow:3px 7px 18px rgba(0,0,0,.45);padding:18px 34px 0;box-sizing:border-box`)}">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${D};padding-bottom:9px">
      <div><div style="${H};font-size:19px;font-style:italic;color:${S}">From the desk of</div><div style="${H};font-size:36px;line-height:1;font-weight:600;color:${D}">Katharine Parker</div></div>
      <div style="${T};font-size:10.5px;line-height:1.45;color:${S};text-align:right;letter-spacing:.04em">MERGERS &amp; ACQUISITIONS<br>INTER-OFFICE / CONFIDENTIAL</div></div>
    <div style="${T};font-size:14px;line-height:1.55;color:${I};margin-top:10px;display:grid;grid-template-columns:62px 1fr 62px 1fr;row-gap:1px">
      <b>TO:</b><span>Jack Trainer</span><b>FROM:</b><span>Tess McGill</span><b>RE:</b><span style="grid-column:span 3">Trask Industries. Supper for four. Radio idea to follow.</span><b>CC:</b><span style="grid-column:span 3">Bobby Stein, radio. Not Katharine (skiing).</span></div>
    <div style="border-top:1px solid #d5c5c9;margin-top:9px;padding-top:12px">${all.map(row).join('')}</div>
  </section>`;
  const right=`<div style="${at(696,20,347,'height:702px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fff;padding:6px;box-shadow:0 5px 12px rgba(0,0,0,.35)">${img('identity','Working Girl title artwork with Tess, Jack and Katharine against Manhattan',335,186,'contain')}</figure>
    <figure style="margin:16px 0 0;background:#fff;padding:6px 6px 0;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(-1deg)">${img('ferry','Tess on the Staten Island ferry with the Manhattan skyline behind her',335,176)}<figcaption style="${T};font-size:11px;color:${I};padding:7px 2px 8px">The Staten Island ferry, into Manhattan.</figcaption></figure>
    <div style="margin-top:18px;flex:1;background:${K};padding:14px 18px;box-sizing:border-box;box-shadow:0 4px 10px rgba(0,0,0,.35);transform:rotate(1.2deg);display:flex;flex-direction:column">
      <div style="${H};font-size:27px;font-weight:600;font-style:italic;color:#9b2a3c;line-height:1;border-bottom:1px solid #c98b93;padding-bottom:7px">While You Were Out</div>
      <div style="${T};font-size:12px;line-height:1.5;color:${I};margin-top:8px"><b>FOR:</b> Tess &nbsp; <b>CALLED:</b> Cyn, Staten Island</div>
      <div style="${T};font-size:12px;line-height:1.5;color:${I};margin-top:4px;display:flex;gap:14px"><span><span style="display:inline-block;width:11px;height:11px;border:1.5px solid ${I};vertical-align:-1px;margin-right:5px;"></span>Telephoned</span><span><span style="display:inline-block;width:11px;height:11px;border:1.5px solid ${I};vertical-align:-1px;margin-right:5px;background:${I}"></span>Please call</span><span><span style="display:inline-block;width:11px;height:11px;border:1.5px solid ${I};vertical-align:-1px;margin-right:5px;background:${I}"></span>Urgent</span></div><div style="${H};font-size:22px;line-height:1.2;font-weight:600;color:${I};margin-top:6px">${ESC(fmtCue(f))}</div>
      <div style="${B};font-size:13px;line-height:1.4;color:${S};margin-top:auto">${ESC(spec.tag||'')}</div>
    </div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#d8bfcb;margin-top:10px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};color:${I};overflow:hidden;box-shadow:0 18px 42px #0006">${memo}${right}</div>`;
}


function fmtMailroomExecutive(f,spec,menu,poster){
  const KR='#d2ae74',KD='#a8834c',IN='#26201a',SO='#4b3d2c',RD='#b0322a',BL='#1f3f73',C="font-family:'Barlow Condensed',sans-serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c=IN,e='')=>`<div style="${C};font-size:13px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:${c||IN};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const route=[['Mailroom','B. Foster','Basement'],['Mailroom','B. Foster','Basement'],['B. Foster','C. Whitfield','Exec. floor'],['C. Whitfield','B. Foster','Kansas'],['H. Prescott','V. Prescott','Country house']];
  const row=(it,i)=>{const r=route[i]||route[0];return `<div style="display:grid;grid-template-columns:124px 1fr 100px;border-bottom:1.5px solid ${KD}">
    <div style="border-right:1.5px solid ${KD};padding:9px 10px 7px"><div style="${T};font-size:13px;color:${SO};text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:${IN}">${r[0]}</div><div style="${T};font-size:14px;font-weight:700;color:${BL};margin-top:4px;white-space:nowrap;letter-spacing:-.02em">${r[1]}</div></div>
    <div style="padding:8px 14px 8px"><h3 style="${C};font-size:24px;line-height:1;font-weight:700;margin:0;color:${IN};text-transform:uppercase;letter-spacing:.01em">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.38;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.32;margin:3px 0 0;color:${BL}">${ESC(it.film||'')}</p></div>
    <div style="border-left:1.5px solid ${KD};padding:11px 10px 0">${lab(ESC(gs[i]?gs[i].tab:''),RD)}<div style="${T};font-size:13px;color:${SO};margin-top:4px">${r[2]}</div></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#3a4448;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,#ffffff06 0 2px,#0000 2px 6px)"></div>
  <div style="position:absolute;left:24px;top:18px;width:640px;height:706px;background:linear-gradient(170deg,#d8b67e,${KR} 60%,#c99f62);box-shadow:0 10px 24px #0007;box-sizing:border-box;padding:16px 22px 14px;display:flex;flex-direction:column">
    <div aria-hidden="true" style="position:absolute;right:30px;top:14px;width:34px;height:34px;border-radius:50%;background:#b38b52;border:2px solid #7d5d31;box-shadow:inset 0 2px 3px #0003"></div>
        <div style="display:flex;align-items:flex-end;gap:16px;border-bottom:3px solid ${IN};padding-bottom:8px;margin-right:96px">
      <div style="${C};font-size:46px;font-weight:700;line-height:.85;letter-spacing:.02em;color:${IN}">INTER-OFFICE</div>
      <div style="padding-bottom:2px">${lab('Pemrose Corporation / New York')}${lab('Do not seal. Reuse until full.',SO,'margin-top:3px')}</div>
    </div>
    <div style="display:grid;grid-template-columns:124px 1fr 100px;border-bottom:3px solid ${IN};padding:8px 0 5px">${lab('Name')}${lab('Contents','','padding-left:14px')}${lab('Dept / floor','','padding-left:10px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
  </div>
  <div style="position:absolute;left:692px;top:24px;width:356px">
    ${lab('Dinner on the way up / 1987','#e8c98f')}
    <h1 style="${C};font-size:60px;line-height:.86;font-weight:700;text-transform:uppercase;letter-spacing:.005em;margin:8px 0 0;color:#f3ead8;text-shadow:none">The Secret<br>of My Success</h1>
  </div>
  <figure style="position:absolute;left:692px;top:166px;width:356px;margin:0;background:#f4f1ea;padding:8px 8px 10px;box-sizing:border-box;box-shadow:0 8px 18px #0007;transform:rotate(-.8deg)">${img('office','Brantley at work in the executive office he borrowed',340,196)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:8px">An empty office, a borrowed name and a new title on the door.</figcaption></figure>
  <div style="position:absolute;left:692px;top:452px;width:356px;display:flex;gap:16px;align-items:stretch">
    <div style="flex:none;background:#f4f1ea;padding:6px;box-shadow:0 8px 18px #0007;transform:rotate(1.2deg)">${fmtPosterImg(f,poster,140,210)}</div>
    <div style="flex:1;background:#fbfaf4;padding:12px 13px;box-shadow:0 6px 14px #0006;background-image:repeating-linear-gradient(180deg,#0000 0 21px,#c6d3e3 21px 22px);display:flex;flex-direction:column">
      ${lab('Memo',RD)}
      <div style="${T};font-size:13px;line-height:1.55;color:${IN};margin-top:6px">TO: All staff<br>FROM: C. Whitfield<br>RE: Dinner<br>CC: Mailroom, B2</div>
      <div style="${T};font-size:13px;line-height:1.55;color:${BL};margin-top:auto">Bring a Kansas appetite. Wear the suit.</div>
    </div>
  </div>
  <div style="position:absolute;right:22px;bottom:5px;${T};font-size:9px;color:#b8c0c2">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtSpendItAll(f,spec,menu,poster){
  const G='#173c32',P='#f3f1df',L='#9fb9a2',R='#b4473a',Y='#ead294',S='#4d5c50',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",N="font-family:'Barlow Condensed',sans-serif";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:${G}"></div>`;
  const lab=(s,c=G,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const money=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const debits=[62400,118750,1250000,1000000,346000];let bal=30000000;
  const rows=xs.slice(0,5).map((x,i)=>{bal-=debits[i]||0;return `<div style="display:grid;grid-template-columns:74px 1fr 228px 132px 142px;border-bottom:1px solid ${L};min-height:62px"><div style="${N};font-size:23px;line-height:1;font-weight:600;color:${R};padding:12px 0 0 6px;white-space:nowrap">Day ${[1,1,2,9,30][i]}</div><div style="padding:9px 14px 9px 14px;border-left:1px solid ${R}"><div style="${H};font-size:25px;line-height:1;font-weight:600;color:${G}">${nm(x)}</div><div style="${B};font-size:13.5px;line-height:1.4;color:${S};margin-top:4px">${ESC(x.d)}</div></div><div style="padding:12px 14px 9px;border-left:1px solid ${L};${H};font-size:16px;line-height:1.25;font-style:italic;color:${S}">${ESC(x.note||'')}</div><div style="padding:12px 12px 0 0;border-left:1px solid ${L};${N};font-size:21px;line-height:1;font-weight:600;color:${R};text-align:right">${money(debits[i]||0)}</div><div style="padding:12px 10px 0 0;border-left:1px solid ${L};${N};font-size:21px;line-height:1;font-weight:600;color:${G};text-align:right">${money(bal)}</div></div>`;}).join('');
  const head=`<header style="${at(30,26,560)}"><div style="display:flex;justify-content:space-between;align-items:baseline">${lab('Expense ledger / Monty Brewster',R)}${lab('Book 1 of 1',S)}</div><div style="${N};font-size:64px;line-height:.95;font-weight:700;letter-spacing:-.005em;color:${G};text-transform:uppercase;margin-top:8px;white-space:nowrap">Brewster's Millions</div><div style="${H};font-size:23px;line-height:1.15;font-style:italic;color:${G};margin-top:6px">Spend thirty million in thirty days. Start with dinner.</div><div style="margin-top:12px;border:2px solid ${G};padding:8px 14px;background:#fffdf0">${lab('The terms of the will',R)}<div style="${B};font-size:13.5px;line-height:1.45;color:${G};margin-top:5px">Spend it all in thirty days. Own nothing at the end. Tell no one why. Win, and the $300 million is yours.</div></div></header>`;
  const photo=`<figure style="${at(626,22,412,'margin:0;background:#fff;padding:9px 9px 11px;box-shadow:0 5px 12px rgba(0,0,0,.25);transform:rotate(1.2deg)')}">${img('millions','Richard Pryor and John Candy amid a bed of money',394,196,'center 40%')}<figcaption style="${B};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${G};margin-top:8px;display:flex;justify-content:space-between"><span>Receipts, Day 1</span><span style="color:${R}">Keep for the lawyers</span></figcaption><span aria-hidden="true" style="position:absolute;left:182px;top:-12px;width:46px;height:20px;background:rgba(234,210,148,.85)"></span></figure>`;
  const table=`<section aria-label="The menu ledger" style="${at(30,268,1011,'border-top:3px double '+G)}"><div style="display:grid;grid-template-columns:74px 1fr 228px 132px 142px;border-bottom:2px solid ${G};padding:7px 0 6px">${lab('Date','',`padding-left:6px;color:${S}`)}${lab('Item purchased',S,'padding-left:14px')}${lab('Remarks',S,'padding-left:14px')}${lab('Debit',S,'text-align:right;padding-right:12px')}${lab('Balance',S,'text-align:right;padding-right:10px')}</div>${rows}<div style="display:grid;grid-template-columns:74px 1fr 228px 132px 142px;border-bottom:3px double ${G};padding:10px 0 9px;align-items:baseline"><div></div><div style="padding-left:14px;${H};font-size:22px;line-height:1.1;font-style:italic;color:${G}">Carried forward. The clock is running.</div>${lab('Total spent',R,'padding-left:14px')}<div style="${N};font-size:21px;line-height:1;font-weight:700;color:${R};text-align:right;padding-right:12px">${money(30000000-bal)}</div><div style="${N};font-size:21px;line-height:1;font-weight:700;color:${G};text-align:right;padding-right:10px">${money(bal)}</div></div></section>`;
  const foot=`<footer style="${at(30,714,1011,'display:flex;align-items:baseline;gap:14px')}">${lab('Suite cue',R)}<span style="${B};font-size:13.5px;line-height:1.3;color:${G}">${ESC(fmtCue(f))}</span><span style="margin-left:auto;${B};font-size:9px;letter-spacing:.06em;color:${S};white-space:nowrap">1985 / FILM IMAGERY: TMDB</span></footer>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};box-shadow:0 18px 40px #0008"><div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 23px,rgba(159,185,162,.28) 23px 24px)"></div><div aria-hidden="true" style="${at(0,0,1071,'height:8px;background:'+G)}"></div>${head}${photo}${table}${foot}</div>`;
}


function fmtGetawaySupper(f,spec,menu,poster){
  const D='#25241f',P='#f4e4b8',W='#fbf3dc',R='#a93d25',Y='#dcb345',S='#615843',B="font-family:'Libre Franklin',sans-serif",H="font-family:'Bevan',serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=S,e='')=>`<div style="${T};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(()=>{rows.push({g,it:menu.all[n++]||{}});}));
  const gate=['A4','A4','B12','C7','C7'];
  const coupon=(r,i)=>`<div style="flex:1;display:grid;grid-template-columns:74px 1fr;align-items:stretch;border-top:1px dashed ${S}">
    <div style="border-right:1px dashed ${S};padding:10px 0 8px;text-align:center;display:flex;flex-direction:column;justify-content:center"><div style="${T};font-size:11px;font-weight:700;color:${S};letter-spacing:.06em">CPN</div><div style="${H};font-size:26px;line-height:1.05;color:${R}">${i+1}</div><div style="${T};font-size:11px;font-weight:700;color:${D};margin-top:2px">GATE ${gate[i]||'A1'}</div></div>
    <div style="padding:9px 0 9px 16px;display:flex;flex-direction:column;justify-content:center"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><div style="${H};font-size:20px;line-height:1.15;color:${D}">${ESC(r.it.label||'')}</div>${lab(r.g.tab||'',R,'white-space:nowrap')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${D};margin-top:4px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${T};font-size:13px;line-height:1.35;color:${S};margin-top:3px">${ESC(r.it.film)}</div>`:''}</div></div>`;
  const field=(k,v,e='')=>`<div style="padding:6px 10px;${e}">${lab(k)}<div style="${T};font-size:15px;font-weight:700;color:${D};margin-top:2px;white-space:nowrap">${v}</div></div>`;
  const ticket=`<section style="position:absolute;left:476px;top:24px;width:571px;height:694px;box-sizing:border-box;background:${W};border:2px solid ${D};box-shadow:6px 7px 0 ${Y};display:flex;flex-direction:column">
    <div style="background:${D};color:${P};padding:10px 16px 10px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.14em">PASSENGER TICKET AND BAGGAGE CHECK</div><div style="${H};font-size:28px;line-height:1.15;margin-top:3px">Dinner before the getaway</div></div>
      <div style="border:2px solid ${Y};color:${Y};padding:5px 9px;${T};font-size:12px;font-weight:700;line-height:1.25;text-align:center;transform:rotate(-4deg)">NOT<br>TRANSFERABLE</div></div>
    <div style="display:grid;grid-template-columns:1.45fr 1fr 1fr;border-bottom:2px solid ${D}">
      ${field('Name of passenger','GRIMM / PHYLLIS / LOOMIS')}${field('From','NEW YORK','border-left:1px solid '+S)}${field('Via','JFK, EVENTUALLY','border-left:1px solid '+S)}</div>
    <div style="padding:0 16px;flex:1;display:flex;flex-direction:column;justify-content:stretch">${rows.map(coupon).join('')}</div>
    <div style="border-top:2px solid ${D};padding:7px 16px;display:flex;justify-content:space-between;${T};font-size:11px;font-weight:700;color:${S};letter-spacing:.05em"><span>FARE: PAID IN CASH, ALL OF IT</span><span>${ESC(f.year)} / FILM IMAGERY: TMDB</span></div></section>`;
  const still=(k,alt,cap,pos)=>`<figure style="margin:0;width:208px"><div style="background:#fff8e4;padding:5px;box-shadow:0 4px 9px #25241f40">${img(k,alt,198,140,pos)}</div><figcaption style="${T};font-size:13px;line-height:1.3;color:${S};margin-top:6px">${ESC(cap)}</figcaption></figure>`;
  const left=`<section style="position:absolute;left:24px;top:24px;width:428px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="background:#246a84;border:6px solid #fff8e4;box-shadow:0 6px 14px #25241f44">${img('identity','Quick Change artwork showing the three would-be escapees in New York','416','262')}</div>
    <div style="border-left:6px solid ${R};padding:2px 0 2px 14px"><div style="${H};font-size:24px;line-height:1.2;color:${D}">${ESC(spec.tag||'')}</div></div>
    <div style="display:flex;justify-content:space-between">${still('bank','Grimm in his clown disguise at the bank','The clown at the bank.','center 30%')}${still('detour','A wrong turn somewhere in New York','Another wrong turn.','center')}</div>
    <div style="background:${D};color:${P};padding:12px 16px 13px;box-shadow:5px 6px 0 #c5b48b">${lab('Cab cue',Y)}<div style="${B};font-size:16px;line-height:1.45;font-weight:600;margin-top:5px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};overflow:hidden;box-shadow:0 18px 45px #0006"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(125deg,#fff7df77,transparent 55%,#a5792622)"></div>${left}${ticket}</div>`;
}


function fmtOrangeFutures(f,spec,menu,poster){
  const D='#193d30',P='#f3ead3',O='#c9731f',K='#1b2420',M='#56604f',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h)=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:center">`:'';
  const tabs=spec.groups.flatMap(g=>g.items.map(()=>g.tab));
  const acts=['BUY','SELL','BUY','BUY','BUY'];
  const rows=all.map((it,i)=>`<div style="display:flex;gap:14px;align-items:flex-start;padding:${i?9:0}px 0 9px;${i<all.length-1?'border-bottom:1px solid #c9bd9b':''}">
    <div style="width:78px;flex:none;padding-top:5px"><div style="${T};font-size:11px;font-weight:700;letter-spacing:.06em;color:${O};text-transform:uppercase">${ESC(tabs[i]||'')}</div><div style="${T};font-size:11px;color:${M};margin-top:3px">ORDER 0${i+1}</div></div>
    <div style="flex:1;min-width:0"><div style="${H};font-size:${i===2?29:25}px;line-height:1.05;font-weight:600;color:${K}">${ESC(it.label)}</div><div style="${B};font-size:14px;line-height:1.4;color:${K};margin-top:4px">${ESC(it.desc)}</div>${it.film?`<div style="${T};font-size:13px;line-height:1.35;color:${M};margin-top:3px">${ESC(it.film)}</div>`:''}</div>
    <div style="width:64px;flex:none;padding-top:6px;text-align:center"><span style="display:inline-block;${T};font-size:15px;font-weight:700;letter-spacing:.08em;color:${acts[i]==='SELL'?'#a2361f':D};border:2px solid currentColor;padding:3px 7px;transform:rotate(-4deg)">${acts[i]||'BUY'}</span></div>
  </div>`).join('');
  const tick=['FCOJ JAN 142.00 UP 4.00','PORK BELLIES 64.10','GOLD 412.50','WHEAT 3.61','FCOJ MAR 29.00 LIMIT DOWN'].map(s=>`<span>${s}</span>`).join('');
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};box-shadow:0 16px 40px #0006;overflow:hidden">
  <section aria-label="Duke and Duke market order sheet" style="${at(22,22,1027,`height:698px;background:${P};box-shadow:0 6px 18px rgba(0,0,0,.45)`)}">
    <header style="${at(30,20,967,'height:76px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px double '+K+';padding-bottom:10px;box-sizing:border-box')}">
      <div><div style="${T};font-size:11px;font-weight:700;letter-spacing:.12em;color:${O}">DUKE &amp; DUKE / COMMODITY BROKERS / PHILADELPHIA</div><div style="${H};font-size:44px;line-height:1;font-weight:600;color:${K};margin-top:4px">Trading Places supper</div></div>
      <div style="text-align:right"><div style="${H};font-size:22px;font-style:italic;color:${K}">${ESC(spec.tag||'')}</div><div style="${T};font-size:11px;letter-spacing:.06em;color:${M};margin-top:4px">FLOOR ORDER / NEW YEAR'S EVE / WORLD TRADE CENTER</div></div>
    </header>
    <div aria-hidden="false" style="${at(30,106,967,`height:30px;background:${K};overflow:hidden;white-space:nowrap;display:flex;justify-content:space-between;${T};font-size:14px;font-weight:700;line-height:30px;color:#f0a64a;padding:0 16px;box-sizing:border-box`)}">${tick}</div>
    <div style="${at(30,150,612)}">${rows}</div>
    <div style="${at(666,150,331)}">
      <figure style="margin:0">${img('market','The frozen orange juice trading floor climax',331,200)}<figcaption style="${T};font-size:11px;line-height:1.3;color:${M};margin-top:6px">The orange juice pit. Sell 30! Sell 30!</figcaption></figure>
      <figure style="margin:16px 0 0">${img('club','Billy Ray with the Duke brothers at the Heritage Club',331,200)}<figcaption style="${T};font-size:11px;line-height:1.3;color:${M};margin-top:6px">The Heritage Club. The one dollar bet.</figcaption></figure>
    </div>
    <footer style="${at(30,628,967,'height:54px;border-top:3px double '+K+';padding-top:10px;box-sizing:border-box;display:flex;align-items:center;gap:22px')}">
      <div style="${H};font-size:24px;font-style:italic;font-weight:600;color:${K};white-space:nowrap">Looking good, Billy Ray! Feeling good, Louis!</div>
      <div style="${B};font-size:13px;line-height:1.35;color:${K}"><b style="${T};font-size:11px;color:${O};letter-spacing:.06em">CUE</b> ${ESC(fmtCue(f))}</div>
      <div style="${T};font-size:9px;color:${M};margin-left:auto;white-space:nowrap">FILM IMAGERY: TMDB</div>
    </footer>
  </section>
  </div>`;
}

function fmtAnnieTable(f,spec,menu,poster){
  const PA='#eef2e4',GR='#2f6a4c',GL='#b9cfb9',IN='#2b2a26',SO='#5b5a50',RD='#a8452e',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c=GR,e='')=>`<div style="${T};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const box=(k,v)=>`<div style="border-right:1px solid ${GR};padding:5px 8px 6px">${lab(k)}<div style="${H};font-size:20px;font-style:italic;font-weight:600;line-height:1.1;color:${IN};margin-top:2px">${v}</div></div>`;
  const row=(it,i)=>`<div style="display:grid;grid-template-columns:38px 1fr 92px;border-bottom:1px solid ${GL}">
    <div style="border-right:1px solid ${GL};${T};font-size:17px;font-weight:700;color:${IN};text-align:center;padding-top:14px">1</div>
    <div style="padding:13px 14px 13px"><h3 style="${H};font-size:24px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.4;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.35;margin:3px 0 0;color:${RD}">${ESC(it.film||'')}</p></div>
    <div style="border-left:1px solid ${GL};padding:16px 8px 0;text-align:right">${lab(ESC(it.price||(gs[i]?gs[i].tab:'')),SO)}</div></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#c9b48f;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#0000 0 3px,#ffffff0d 3px 4px),radial-gradient(ellipse at 30% 40%,#ffffff22,#0000 60%)"></div>
  <div style="position:absolute;left:26px;top:18px;width:596px;height:706px;background:${PA};box-shadow:0 10px 24px #0006;transform:rotate(-.5deg);box-sizing:border-box;padding:16px 22px 14px;display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid ${GR};padding-bottom:6px">
      <div style="${H};font-size:36px;font-weight:600;letter-spacing:.08em;color:${GR};line-height:1">GUEST CHECK</div>
      <div style="text-align:right">${lab('Lunch counter / New York')}<div style="${T};font-size:16px;font-weight:700;color:${RD};margin-top:2px">No. 1977</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1.4fr 1.3fr;border:1px solid ${GR};border-top:0">${box('Table','Four')}${box('Guests','Two')}${box('Server','Alvy')}<div style="padding:5px 8px 6px">${lab('Note')}<div style="${H};font-size:20px;font-style:italic;font-weight:600;line-height:1.1;color:${RD};margin-top:2px">La-di-da</div></div></div>
    <div style="display:grid;grid-template-columns:38px 1fr 92px;border-bottom:1.5px solid ${GR};padding:7px 0 5px;margin-top:8px">${lab('Qty','','text-align:center')}${lab('Item','','padding-left:14px')}${lab('Course','','text-align:right;padding-right:8px')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <div style="display:flex;gap:12px;align-items:baseline;border-top:2px solid ${GR};padding-top:8px">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></div>
  </div>
  <header style="position:absolute;left:652px;top:26px;width:392px">
    ${lab('New York / Los Angeles / 1977','#4a3a24')}
    <h1 style="${H};font-size:74px;line-height:.9;font-weight:600;letter-spacing:-.03em;margin:8px 0 0;color:#2b2218;text-shadow:none">Annie Hall</h1>
    <div style="${H};font-size:25px;font-style:italic;font-weight:600;line-height:1.1;color:#7d2f1c;margin-top:6px">${ESC(spec.tag||'')}</div>
  </header>
  <figure style="position:absolute;left:652px;top:178px;width:392px;margin:0;background:#fbf7ee;padding:8px 8px 10px;box-sizing:border-box;box-shadow:0 8px 18px #0005;transform:rotate(.8deg)">${img('cinema','Annie and Alvy waiting outside the cinema showing Face to Face',376,224)}<figcaption style="${B};font-size:13px;line-height:1.35;color:${IN};margin-top:8px">The line for <i>Face to Face</i>. Two minutes in and Alvy won’t go in.</figcaption></figure>
  <div style="position:absolute;left:652px;top:484px;width:392px;display:flex;gap:18px;align-items:stretch">
    <div style="flex:none;background:#fbf7ee;padding:6px;box-shadow:0 8px 18px #0006;transform:rotate(-1.5deg)">${fmtPosterImg(f,poster,138,207)}</div>
    <div style="flex:1;background:#f0d9a8;border:2px dashed #7d2f1c;padding:14px 14px;display:flex;flex-direction:column;justify-content:center;box-shadow:0 6px 14px #0004;transform:rotate(1deg)">
      ${lab('Admit two','#7d2f1c')}
      <div style="${H};font-size:26px;line-height:1;font-weight:600;color:#2b2218;margin-top:6px">The Sorrow and the Pity</div>
      <p style="${B};font-size:13px;line-height:1.4;color:#3d3326;margin:8px 0 0">Alvy’s idea of a date night. Four hours on the occupation of France. Bring snacks.</p>
    </div>
  </div>
  <div style="position:absolute;right:24px;bottom:5px;${T};font-size:9px;color:#4a3a24">FILM IMAGERY: TMDB</div>
  </div>`;
}


function fmtGershwinFolio(f,spec,menu,poster){
  const D='#1d1d1b',P='#f4f1e8',A='#8b363b',S='#5a5852',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items),nm=x=>{const it=menu.all.find(z=>z.n===x.k)||{};return ESC(it.label||x.n||x.k);};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:`<div style="width:${w}px;height:${h}px;background:#2a2a28"></div>`;
  const typed=(s,c=D,sz=12,e='')=>`<div style="${T};font-size:${sz}px;line-height:1.35;font-weight:700;letter-spacing:.06em;color:${c};text-transform:uppercase;${e}">${ESC(s)}</div>`;
  const nums=['1.','2.','3.','4.','5.'];
  const item=(x,i)=>`<article style="display:grid;grid-template-columns:40px 1fr;column-gap:6px;padding:10px 0 9px;border-top:1px solid #cfcbbf"><div style="${T};font-size:19px;line-height:1.3;font-weight:700;color:${A}">${nums[i]}</div><div><h3 style="${H};font-size:28px;line-height:1;font-weight:600;color:${D};margin:0;text-shadow:none">${nm(x)}</h3><div style="${B};font-size:14px;line-height:1.4;color:${S};margin-top:5px">${ESC(x.d)}</div><div style="${H};font-size:17px;line-height:1.2;font-style:italic;color:${A};margin-top:3px">${ESC(x.note||'')}</div></div></article>`;
  const head=`<header style="${at(36,30,620)}">${typed('Chapter One',A,13)}<div style="${T};font-size:16px;line-height:1.5;color:${D};margin-top:10px"><span style="text-decoration:line-through;color:#8a877e">He adored New York City. He idolized it all out of proportion.</span><br>Why is life worth living? A short list, in order.</div></header>`;
  const list=`<section aria-label="The list" style="${at(36,118,620)}">${xs.slice(0,5).map(item).join('')}<div style="border-top:1px solid #cfcbbf;padding-top:13px;display:grid;grid-template-columns:40px 1fr;column-gap:6px"><div style="${T};font-size:19px;line-height:1.3;font-weight:700;color:${A}">${xs.length+1}.</div><div style="${H};font-size:24px;line-height:1.15;font-style:italic;color:${D}">Groucho Marx, Willie Mays, Swedish movies, and Tracy's face.</div></div></section>`;
  const right=`<aside style="${at(690,30,345,'height:682px;display:flex;flex-direction:column')}"><div style="${B};font-size:55px;line-height:.9;font-weight:700;letter-spacing:-.045em;color:${D}">MANHATTAN</div><div style="display:flex;justify-content:space-between;margin-top:10px">${typed('Woody Allen',S,11)}${typed('1979',S,11)}</div><figure style="margin:18px 0 0;background:#111;padding:8px 8px 10px">${img('city','Isaac and Mary on the bench beside the Queensboro Bridge before dawn',329,262)}<figcaption style="${T};font-size:10px;line-height:1.3;color:#e9e6dc;letter-spacing:.06em;margin-top:8px;text-transform:uppercase">Sutton Place, 59th Street Bridge, dawn</figcaption></figure><div style="display:flex;gap:10px;margin-top:12px">${img('table','Friends at a restaurant table',167,136)}${img('citylife','Isaac and Tracy sharing a milkshake',168,136,'center 30%')}</div>${FX_SP}<div style="${H};font-size:23px;line-height:1.15;font-style:italic;color:${D}">${ESC(spec.tag||'New York in black and white. Dessert in colour.')}</div><div style="border-top:2px solid ${D};padding-top:11px;margin-top:16px">${typed('Gershwin cue',A,11)}<div style="${B};font-size:14px;line-height:1.45;color:${D};margin-top:6px">${ESC(fmtCue(f))}</div></div></aside>`;
  const foot=`<div style="${at(36,712,620,'display:flex;justify-content:space-between')}">${typed('Isaac Davis / manuscript, page one',S,10)}<span style="${T};font-size:9px;line-height:1.3;color:${S};letter-spacing:.06em">FILM IMAGERY: TMDB</span></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="${at(668,30,1,'height:682px;background:#cfcbbf')}"></div>${head}${list}${right}${foot}</div>`;
}


function fmtDorothySupper(f,spec,menu,poster){
  const R='#8e273b',P='#fbf5ea',D='#33242a',M='#5e4b50',L='#cdb3ad',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const a=spec.art||{};
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const lab=(s,c=R,e='')=>`<div style="${B};font-size:10.5px;line-height:1.3;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c};${e}">${ESC(s)}</div>`;
  const rows=[];let n=0;
  spec.groups.forEach(g=>g.items.forEach(x=>{const it=menu.all[n++]||{};rows.push({set:g.h,tab:g.tab,it});}));
  const sc=['14','14A','22','31','38'];
  const row=(r,i)=>`<div style="display:grid;grid-template-columns:128px 1fr;column-gap:16px;padding:10px 0 10px;border-top:1px solid ${L}">
    <div><div style="${H};font-size:28px;line-height:1;font-weight:600;color:${R}">${sc[i]||i+1}</div><div style="margin-top:5px">${lab(r.set,D)}</div><div style="${B};font-size:10.5px;line-height:1.3;color:${M};margin-top:3px;text-transform:uppercase;letter-spacing:.08em">${ESC(r.tab||'')}</div></div>
    <div><div style="${H};font-size:24px;line-height:1.05;font-weight:600;color:${D}">${ESC(r.it.label||'')}</div>
    ${r.it.desc?`<div style="${B};font-size:13.5px;line-height:1.45;color:${D};margin-top:4px">${ESC(r.it.desc)}</div>`:''}
    ${r.it.film?`<div style="${H};font-style:italic;font-size:16px;line-height:1.25;color:${M};margin-top:2px">${ESC(r.it.film)}</div>`:''}</div></div>`;
  const cell=(k,v)=>`<div style="padding:7px 10px;border-left:1px solid ${D}">${lab(k,M)}<div style="${B};font-size:13px;font-weight:600;color:${D};margin-top:3px">${v}</div></div>`;
  const head=`<div style="border:2px solid ${D}">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:9px 14px 9px;background:${R};color:${P}">
      <div><div style="${B};font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Daily call sheet / catering</div><div style="${H};font-size:38px;line-height:1;font-weight:600;margin-top:3px;white-space:nowrap">Southwest General</div></div>
      <div style="${H};font-style:italic;font-size:18px;line-height:1.2;text-align:right;width:200px">${ESC(spec.tag||'')}</div></div>
    <div style="display:grid;grid-template-columns:1.1fr 1fr 1fr 1.2fr;border-top:2px solid ${D}">
      <div style="padding:7px 10px">${lab('Director',M)}<div style="${B};font-size:13px;font-weight:600;color:${D};margin-top:3px">Ron Carlisle</div></div>
      ${cell('Crew call','6:30 am')}${cell('Stage','Studio 8')}${cell('Serves','4, plus the cast')}</div></div>`;
  const right=`<section style="position:absolute;left:400px;top:24px;width:647px;height:694px;display:flex;flex-direction:column">
    ${head}
    <div style="display:grid;grid-template-columns:128px 1fr;column-gap:16px;padding:10px 0 6px">${lab('Scene / set',M)}${lab('On the table',M)}</div>
    ${rows.map(row).join('')}
    <div style="flex:1"></div>
    <div style="border-top:2px solid ${D};padding-top:8px;display:flex;justify-content:space-between;${B};font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:${M}"><span>Craft service closes at wrap</span><span>Ad-libs: not approved</span><span>${ESC(f.year)} / Film imagery: TMDB</span></div></section>`;
  const still=(k,alt,cap,pos)=>`<figure style="margin:0;width:170px"><div style="background:#fff;padding:5px;box-shadow:0 3px 8px #43282c33">${img(k,alt,160,118,pos)}</div><figcaption style="${H};font-style:italic;font-size:15px;line-height:1.25;color:${M};margin-top:6px">${ESC(cap)}</figcaption></figure>`;
  const cast=[['Dorothy Michaels','Emily Kimberly'],['Julie Nichols','Ward set'],['John Van Horn','Dr. Brewster'],['Les Nichols','Visitor, lunch']];
  const left=`<section style="position:absolute;left:24px;top:24px;width:352px;height:694px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="background:#fff;padding:6px;box-shadow:0 6px 14px #43282c33">${img('identity','Tootsie title artwork with Dorothy in her red dress over the New York skyline',340,206)}</div>
    <div style="border:2px solid ${D};padding:10px 14px 8px">
      ${lab('Cast called today')}
      ${cast.map(c=>`<div style="display:flex;align-items:baseline;gap:8px;margin-top:6px"><span style="${H};font-size:18px;font-weight:600;color:${D};white-space:nowrap">${ESC(c[0])}</span><span style="flex:1;border-bottom:1px dotted ${M};transform:translateY(-4px)"></span><span style="${B};font-size:13px;color:${M};white-space:nowrap">${ESC(c[1])}</span></div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between">${still('farm','Dorothy and Les Nichols at the farm','Dorothy and Les.','center 30%')}${still('tearoom','Dorothy and George at the Russian Tea Room','Lunch with George.','center')}</div>
    <div style="background:${R};color:${P};padding:12px 16px 13px">${lab('Showtime cue',P)}<div style="${H};font-size:21px;line-height:1.2;font-weight:500;margin-top:5px">${ESC(fmtCue(f))}</div></div></section>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${P};box-shadow:0 18px 40px #0008">${left}${right}</div>`;
}


function fmtBookshopCafe(f,spec,menu,poster){
  const G='#29523a',P='#fbf8f0',D='#1f2a24',R='#984729',M='#5b5f55',B="font-family:'Libre Franklin',sans-serif",H="font-family:'Cormorant Garamond',serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const a=spec.art||{},all=menu.all;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  let n=0;
  const course=spec.groups.map(g=>{const its=g.items.map(()=>all[n++]);return `<div style="margin-top:12px">
    <div style="${T};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${R}">&gt; ${ESC(g.tab)} / ${ESC(g.h)}</div>
    ${its.map(it=>`<div style="margin-top:6px"><div style="${T};font-size:19px;line-height:1.2;font-weight:700;color:${D}">${ESC(it.label)}</div><div style="${T};font-size:14px;line-height:1.4;color:${D};margin-top:3px">${ESC(it.desc)}</div>${it.film?`<div style="${T};font-size:13px;line-height:1.35;font-style:italic;color:${M};margin-top:2px">${ESC(it.film)}</div>`:''}</div>`).join('')}</div>`}).join('');
  const hdr=(k,v)=>`<div style="display:flex;gap:10px;${T};font-size:14px;line-height:1.5;color:${D}"><span style="width:76px;font-weight:700">${k}</span><span>${v}</span></div>`;
  const email=`<section aria-label="Printed email menu" style="${at(30,24,632,`height:694px;background:${P};box-shadow:4px 7px 16px rgba(0,0,0,.4);transform:rotate(-.5deg);padding:18px 34px 0 34px;box-sizing:border-box`)}">
    <div style="display:flex;justify-content:space-between;${T};font-size:10px;letter-spacing:.04em;color:${M};border-bottom:1px solid #cfc8b6;padding-bottom:6px"><span>MAIL READ / PRINTED 10:42 PM</span><span>PAGE 1 OF 1</span></div>
    <div style="margin-top:10px">${hdr('Subject:','Supper on the Upper West Side')}${hdr('From:','NY152')}${hdr('To:','Shopgirl')}</div>
    <div style="border-top:2px dashed #b9b29e;margin-top:10px;padding-top:10px;${T};font-size:14px;line-height:1.45;color:${D}">Dear friend, ${ESC((spec.tag||'').replace(/^A /,'a '))} Here is what I would bring to the table.</div>
    ${course}
    <div style="${T};font-size:14px;line-height:1.4;color:${D};margin-top:12px">Until then, <b>NY152</b></div>
  </section>`;
  const right=`<div style="${at(690,26,352,'height:690px;display:flex;flex-direction:column')}">
    <figure style="margin:0;background:#fffcf3;padding:6px;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(1deg)">${img('identity','You’ve Got Mail film artwork with Kathleen and Joe',340,190,'left center')}</figure>
    <figure style="margin:18px 0 0;background:#fffcf3;padding:6px 6px 0;box-shadow:0 5px 12px rgba(0,0,0,.35);transform:rotate(-1deg)">${img('corner','The Shop Around the Corner storefront in You’ve Got Mail',340,212)}<figcaption style="${T};font-size:11px;line-height:1.3;color:${D};padding:7px 2px 8px">The Shop Around the Corner, West 69th St.</figcaption></figure>
    <div style="margin-top:18px;background:#e9dcbc;padding:14px 18px;box-sizing:border-box;box-shadow:0 4px 9px rgba(0,0,0,.3);flex:1;display:flex;flex-direction:column;justify-content:center">
      <div style="${T};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${R}">Café cue</div>
      <div style="${H};font-size:24px;line-height:1.15;font-weight:600;color:${D};margin-top:5px">${ESC(fmtCue(f))}</div>
      <div style="${B};font-size:13px;line-height:1.4;color:${M};margin-top:8px">${ESC(spec.brand||'')}. A rose in the book, a decaf cappuccino, and a table for two.</div>
    </div>
    <div style="${T};font-size:9px;letter-spacing:.06em;color:#c9d5c7;margin-top:9px;text-align:right">FILM IMAGERY: TMDB</div>
  </div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${G};overflow:hidden;box-shadow:0 18px 45px #0006">
    <div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid rgba(233,220,188,.25)"></div>${email}${right}</div>`;
}


function fmtLateNightCall(f,spec,menu,poster){
  const PA='#f4efe2',IN='#1d2c44',BL='#2f5d8c',RD='#b23a48',SO='#5d6878',RU='#c9d6e3',H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const a=spec.art||{},xs=menu.all,gs=spec.groups.flatMap(g=>g.items.map(()=>g));
  const lab=(s,c=BL,e='')=>`<div style="${T};font-size:11px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:${c};${e}">${s}</div>`;
  const img=(k,alt,w,h,pos='center')=>a[k]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[k])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos}">`:'';
  const calls=[['11:52 PM','Line 2','Seattle, WA'],['11:58 PM','Line 3','Seattle, WA'],['12:06 AM','Line 4','Baltimore, MD'],['12:14 AM','Line 1','New York, NY'],['12:21 AM','Line 4','Still on hold']];
  const row=(it,i)=>{const c=calls[i]||calls[0];return `<div style="display:grid;grid-template-columns:96px 1fr 128px;column-gap:16px;padding:11px 0 10px;border-bottom:1px solid ${RU}">
    <div>${lab(c[0],RD)}<div style="${T};font-size:11px;line-height:1.4;color:${SO};margin-top:3px;text-transform:uppercase;letter-spacing:.06em">${c[1]}</div></div>
    <div><h3 style="${H};font-size:25px;line-height:1.02;font-weight:600;margin:0;color:${IN}">${ESC(it.label)}</h3>${it.desc?`<p style="${B};font-size:13.5px;line-height:1.42;margin:4px 0 0;color:${IN}">${ESC(it.desc)}</p>`:''}<p style="${T};font-size:13px;line-height:1.35;margin:3px 0 0;color:${BL}">&gt; ${ESC(it.film||'')}</p></div>
    <div style="text-align:right">${lab(ESC(gs[i]?gs[i].tab||gs[i].h:''),SO)}<div style="${T};font-size:11px;line-height:1.4;color:${SO};margin-top:3px;text-transform:uppercase;letter-spacing:.06em">${c[2]}</div></div></div>`};
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#1a2a40;overflow:hidden;box-shadow:0 16px 40px #0006">
  <div style="position:absolute;left:22px;top:20px;width:690px;height:702px;background:${PA};box-shadow:0 10px 26px #0007;box-sizing:border-box;padding:0 30px 0 34px;display:flex;flex-direction:column">
        <div aria-hidden="true" style="position:absolute;left:24px;top:0;bottom:0;width:1px;background:#e3a7ae"></div>
    <header style="padding:20px 0 12px;border-bottom:3px double ${IN}">
      <div style="display:flex;justify-content:space-between;align-items:baseline">${lab('Late-night call-in / Producer’s log')}${lab('Christmas Eve / Dec 24',RD)}</div>
      <h1 style="${H};font-size:52px;line-height:.95;font-weight:600;letter-spacing:-.02em;margin:8px 0 0;color:${IN};text-shadow:none">Sleepless in Seattle</h1>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px"><span style="${H};font-size:22px;font-style:italic;font-weight:500;color:${BL}">${ESC(spec.tag||'')}</span><span style="${T};font-size:12px;color:${SO}">Host: Dr. Marcia Fieldstone</span></div>
    </header>
    <div style="display:grid;grid-template-columns:96px 1fr 128px;column-gap:16px;padding:8px 0 6px;border-bottom:1.5px solid ${IN}">${lab('Time',SO)}${lab('On the air tonight',SO)}${lab('Course / from',SO,'text-align:right')}</div>
    ${xs.map(row).join('')}
    ${FX_SP}
    <footer style="display:flex;gap:12px;align-items:baseline;padding:0 0 16px">${lab('Showtime cue',RD,'white-space:nowrap')}<span style="${B};font-size:13px;line-height:1.35;color:${IN}">${ESC(fmtCue(f))}</span></footer>
  </div>
  <div style="position:absolute;left:740px;top:34px;width:310px">
    <figure style="margin:0;background:#fbf8f0;padding:9px 9px 34px;box-shadow:0 10px 22px #0008;transform:rotate(1.6deg);position:relative">${img('meeting','Sam and Annie meet on the Empire State Building observation deck',292,212)}<figcaption style="${H};font-size:19px;font-style:italic;font-weight:600;color:${IN};position:absolute;left:12px;bottom:6px">Top of the Empire State, Feb 14</figcaption><i aria-hidden="true" style="position:absolute;left:50%;top:-10px;width:80px;height:22px;margin-left:-40px;background:#e8e0c8cc;transform:rotate(-3deg)"></i></figure>
  </div>
  <div style="position:absolute;left:744px;top:326px;width:306px;display:flex;gap:16px;align-items:flex-start">
    <div style="flex:none;background:#fbf8f0;padding:6px;box-shadow:0 8px 18px #0008;transform:rotate(-2deg)">${fmtPosterImg(f,poster,128,192)}</div>
    <div style="padding-top:8px">${lab('Hold line 4','#e6a5ad')}<div style="${H};font-size:30px;line-height:1;font-weight:600;color:#f4efe2;margin-top:8px">Jonah’s on the phone again.</div><p style="${B};font-size:13px;line-height:1.45;color:#c9d6e3;margin:10px 0 0">Eight years old, calling a national radio show to find his dad a wife.</p></div>
  </div>
  <div style="position:absolute;left:740px;top:566px;width:310px;background:#f6e27a;padding:16px 18px 14px;box-sizing:border-box;box-shadow:0 8px 18px #0007;transform:rotate(-1deg)">
    <div style="${T};font-size:12px;font-weight:700;letter-spacing:.08em;color:#7a2a33">PHONE MESSAGE / FOR SAM</div>
    <div style="${H};font-size:24px;line-height:1.05;font-weight:600;color:${IN};margin-top:6px">Empire State Building. Valentine’s Day. Meet me at the top.</div>
    <div style="${T};font-size:11px;color:${SO};margin-top:8px;text-align:right">Annie / Baltimore</div>
  </div>
  <div style="position:absolute;right:22px;bottom:6px;${T};font-size:9px;color:#8ea0b5">FILM IMAGERY: TMDB</div>
  </div>`;
}
