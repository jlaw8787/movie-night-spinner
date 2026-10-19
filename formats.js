/* Era menus: one printed menu per film, from the film's own world. Loaded before app.js. */
/* ================= ERA FORMATS: printed menus from the film's own world =================
   A film listed in FMT_FILMS gets its own landscape A4 menu (trifold or bifold look),
   plus a phone view with big type. Every other film keeps the lobby card until its format is signed off. */
const FMT_FONTS={
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
  "gimbels":{"top":"#174737","topInk":"#f2eddd","paper":"#f2eddd","ink":"#26392e","soft":"#6c6251","accent":"#a0322d","tab":"#d8b865","disp":"'Cormorant Garamond',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "lair":{"top":"#102b23","topInk":"#e9d2a1","paper":"#e9d2a1","ink":"#213a2e","soft":"#6e6044","accent":"#315c4b","tab":"#b86b24","disp":"'Bevan',serif","name":"'Bevan',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "tonys":{"top":"#334d3e","topInk":"#f4ead3","paper":"#f4ead3","ink":"#293f35","soft":"#716651","accent":"#8c3c37","tab":"#ceb88b","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
  "whistle":{"top":"#294b3c","topInk":"#f1e7cd","paper":"#f1e7cd","ink":"#343d32","soft":"#70604b","accent":"#963e32","tab":"#c4a66e","disp":"'Bevan',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Libre Franklin',sans-serif","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "sals":{"top":"#a92b20","topInk":"#f7e8ba","paper":"#f7e8ba","ink":"#2c1c16","soft":"#75543b","accent":"#a92b20","tab":"#efbe50","disp":"'Bevan',serif","name":"'Barlow Condensed',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "mcdowells":{"top":"#a72525","topInk":"#f7efd9","paper":"#f7efd9","ink":"#3c3024","soft":"#71604b","accent":"#a72525","tab":"#edbd47","disp":"'Bevan',serif","name":"'Libre Franklin',sans-serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Bevan',serif","note":"'Libre Franklin',sans-serif"},
  "coney":{"top":"#203746","topInk":"#f3e6c9","paper":"#f3e6c9","ink":"#203746","soft":"#695a45","accent":"#ad3929","tab":"#e5b74b","disp":"'Alfa Slab One',serif","name":"'Barlow Condensed',sans-serif","body":"'Barlow Condensed',sans-serif","price":"'Barlow Condensed',sans-serif","title":"'Alfa Slab One',serif","note":"'Barlow Condensed',sans-serif"},
  "nakatomi":{"top":"#172629","topInk":"#f1eee4","paper":"#f1eee4","ink":"#172629","soft":"#435356","accent":"#355e62","tab":"#a43730","disp":"'Cormorant Garamond',serif","name":"'Cormorant Garamond',serif","body":"'Libre Franklin',sans-serif","price":"'Courier Prime',monospace","title":"'Cormorant Garamond',serif","note":"'Libre Franklin',sans-serif"},
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
  "Elf (2003)":{"fmt":"gimbels","brand":"Gimbels Christmas window","phoneTitle":"Elf","tag":"A little North Pole sweetness. A very New York appetite.","art":{"buddy":"/osJQkpJw5o7ekynCiqh4WbtJm9W.jpg","display":"/nmM0wAwbeH8d4dgVcK4Wg1w6RGl.jpg","store":"/lavI1MuVp7wUdMKOFA18nzWj8HB.jpg"},"groups":[{"h":"The sweet stuff","tab":"Snacks","items":[{"k":"Maple syrup popcorn","c":"s","d":"Crunchy popcorn clusters, maple syrup & butter.","note":"Buddy puts syrup on everything."},{"k":"Candy cane pretzel rods","c":"s","d":"White chocolate pretzel rods rolled in crushed candy canes.","note":"A sweet detour through the candy cane forest."}]},{"h":"A break between adventures","tab":"Main","items":[{"k":"New York street hot dogs","c":"m","d":"Griddled franks in steamed buns, yellow mustard, tomato onions & warm sauerkraut.","note":"Something savoury for Buddy’s first big-city adventure."}]},{"h":"Snowball fight","tab":"Dessert","items":[{"k":"Snowball fight cupcakes","c":"w","d":"Vanilla cupcakes, cream cheese frosting & snowy shredded coconut.","note":"Inspired by Buddy’s very enthusiastic snowball fight."}]},{"h":"Congratulations!","tab":"Drink","items":[{"k":"World's best cup of coffee","c":"d","d":"Strong diner coffee. Milk & sugar on the table.","note":"The world’s best. According to Buddy."}]}]},
  "Teenage Mutant Ninja Turtles (1990)":{"fmt":"lair","brand":"Pizza night in the lair","phoneTitle":"TMNT","tag":"Four brothers. Four pizzas. Zero leftovers.","art":{"brothers":"/afWHvJLROkw2oXKxxHhL7XCvopV.jpg","pizza":"/mJaKfJmGdjD7QoetqY99GmMpEt9.jpg","poster":"/shfAU6xIIEAEtsloIT3n9Fscz2E.jpg"},"groups":[{"h":"Open the box","tab":"Snacks","items":[{"k":"Sewer pizza rolls","c":"s","note":"The lair’s own takeaway.","d":"Pizza dough rolls, tomato sauce, pepperoni & mozzarella."},{"k":"Splinter's cheese plate","c":"s","note":"For the sensei.","d":"Aged cheddar, brie, gouda, crackers, grapes & honey."}]},{"h":"One for each brother","tab":"Main","items":[{"k":"Four-pie pizza night","c":"m","note":"One for each brother, every topping argued over.","d":"Four thin bases, tomato & mozzarella. Pepperoni, mushroom, supreme & a fridge raid."}]},{"h":"Slice something sweet","tab":"Dessert","items":[{"k":"Pizza cookie","c":"w","note":"Choc chip base with lolly toppings.","d":"Choc chip cookie base, melted chocolate & lollies."}]},{"h":"From the lair fridge","tab":"Drink","items":[{"k":"Turtle green apple soda","c":"d","note":"The sewer lair fridge.","d":"Fresh green apple juice, lime & sparkling soda water."}]}]},
  "Lady and the Tramp (1955)":{"fmt":"tonys","brand":"Tony’s / Ristorante italiano","phoneTitle":"Lady and the Tramp","tag":"One plate. One strand. One meatball.","art":{"dinner":"/xJbWJK3NAMCzknfCFdMUYekNezS.jpg","bridge":"/9RbMRpc3xCfB1m0PkgoAChIC1AN.jpg","walk":"/ikkdpwkR2tH1GdR4rcHbhi7ilkC.jpg"},"groups":[{"h":"To begin","tab":"Snacks","items":[{"k":"Tony's garlic bread","c":"s","d":"Warm Italian bread with garlic butter, parsley and parmesan.","note":"A little something from Tony’s kitchen."},{"k":"Antipasto for two","c":"s","d":"Salami, provolone, olives, artichoke and roasted capsicum, with torn bread.","note":"Set out by candlelight."}]},{"h":"The house speciality","tab":"Main","items":[{"k":"Spaghetti and meatballs","c":"m","d":"Beef and pork meatballs in slow tomato and basil sauce, piled over one generous plate of spaghetti.","note":"The famous dinner behind Tony’s."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Bella notte cannoli","c":"w","d":"Ricotta, orange zest and chocolate chips in crisp shells, finished with pistachios.","note":"For a beautiful night."}]},{"h":"To drink","tab":"Drink","items":[{"k":"Italian sparkling","c":"d","d":"Blood orange, rosemary and sparkling water. Red wine for the grown-ups, if you like.","note":"A toast at the checked table."}]}]},
  "Fried Green Tomatoes (1991)":{"fmt":"whistle","brand":"Whistle Stop Café","phoneTitle":"Fried Green Tomatoes","tag":"A table for four. A story to share.","art":{"cafe":"/ApnB7gY4MrWoPqIw17lEMp1mXJD.jpg","tomatoes":"/hwNJJum7YvhSkHBoh1QmzP2Z6TY.jpg","storefront":"/tectp2uQ9gF7XUgL2SuPPk9492V.jpg"},"groups":[{"h":"From the café kitchen","tab":"Snacks","items":[{"k":"Fried green tomatoes","c":"s","d":"Thick-cut green tomatoes, buttermilk, a golden cornmeal crust & remoulade.","note":"The dish that gives the café, and the film, its name."},{"k":"Honeycomb and biscuits","c":"s","d":"Warm buttermilk biscuits, butter, honey & a piece of honeycomb.","note":"For Idgie, Ruth’s Bee Charmer."}]},{"h":"The famous plate","tab":"Main","items":[{"k":"Whistle Stop barbecue","c":"m","d":"Slow-roasted pulled pork, tomato & cider-vinegar sauce, coleslaw and white bread.","note":"The café’s barbecue, with its famous sauce."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Pecan pie","c":"w","d":"Toasted pecans, brown sugar & golden syrup in a buttery pastry case.","note":"A slice of Southern café comfort."}]},{"h":"A glass to linger over","tab":"Drink","items":[{"k":"Sweet tea","c":"d","d":"Strong black tea, sweetened while hot, poured over ice with lemon & mint.","note":"The café’s sweet tea. Alcohol-free."}]}]},
  "Do the Right Thing (1989)":{"fmt":"sals","brand":"Sal’s Famous Pizzeria","phoneTitle":"Do the Right Thing","tag":"Hottest day of the year. Coldest drinks in the house.","art":{"counter":"/4rUvqbhka5FWLl3fGQUwsIvkt6k.jpg","street":"/njeCvtiagMMZyyp9evPFLilsKfy.jpg","identity":"/zEUVvEUp1l8Fg72f6WySEWnAMNh.jpg"},"groups":[{"h":"While you wait","tab":"Snacks","items":[{"k":"Sal's garlic knots","c":"s","d":"Warm pizza dough knots, garlic butter, parsley & parmesan.","note":"From Sal’s oven."},{"k":"Watermelon wedges","c":"s","d":"Ice-cold watermelon, chilli salt & fresh lime.","note":"A little relief from the heat on the block."}]},{"h":"Sal’s house special","tab":"Main","items":[{"k":"Sal's Famous slice","c":"m","d":"Thin New York pizza, tomato, mozzarella, pepperoni & oregano.","note":"Big slices, straight from Sal’s."}]},{"h":"Something cold","tab":"Dessert","items":[{"k":"Cherry shaved ice","c":"w","d":"Crushed ice, homemade cherry syrup & lemon.","note":"For the heat on the block."}]},{"h":"From the fridge","tab":"Drink","items":[{"k":"Ice cold beer","c":"d","d":"American lager, ice cold & straight from the bottle.","note":"Da Mayor would approve."}]}]},
  "Coming to America (1988)":{"fmt":"mcdowells","brand":"McDowell’s / Queens","phoneTitle":"Coming to America","tag":"A royal appetite.","art":{"counter":"/nswBClglllF0D3eqagLkHXYgL0W.jpg","royal":"/s0EyvllPEJw1vbAJcmGElDijTgK.jpg","poster":"/djRAvxyvvN2yqlJKDbT3uy4vOBw.jpg"},"groups":[{"h":"On the side","tab":"Snacks","items":[{"k":"Golden fries","c":"s","d":"Thin-cut fries, twice fried and salted straight from the oil.","note":"The golden side of McDowell’s."},{"k":"Rose petal sugar crisps","c":"s","d":"Crisp rosewater cookies with crushed dried rose petals.","note":"A little of the royal bath, brought to Queens."}]},{"h":"The house burger","tab":"Main","items":[{"k":"Big Mick burger","c":"m","d":"Double smashed beef patties, American cheese, special sauce, iceberg, onion and pickles on a three-piece bun.","note":"Cleo’s house burger, served by a prince."}]},{"h":"Something sweet","tab":"Dessert","items":[{"k":"Apple turnovers","c":"w","d":"Flaky puff pastry filled with buttery cinnamon apple.","note":"A sweet finish from the counter."}]},{"h":"From the counter","tab":"Drink","items":[{"k":"Vanilla thick shake","c":"d","d":"Vanilla ice cream and cold full-cream milk, blended thick.","note":"Four tall glasses, one royal order."}]}]},
  "The Warriors (1979)":{"fmt":"coney","brand":"Coney Island boardwalk grill","phoneTitle":"The Warriors","tag":"Last stop: Coney Island.","groups":[{"h":"Start at the counter","tab":"Snacks","items":[{"k":"Boardwalk pretzel bites","d":"Warm, butter-brushed soft pretzels. Cheddar dip & yellow mustard.","note":"A paper tray of something warm for the long night.","c":"s"},{"k":"Street-cart corn","d":"Charred corn ribs, chilli butter, lime & smoked salt.","note":"Street-cart flavours, with the boardwalk waiting at the end.","c":"s"}]},{"h":"Back on home turf","tab":"Main","items":[{"k":"Coney Island chilli dogs","d":"Griddled beef franks, beef chilli, diced onion & mustard. Shoestring fries alongside.","note":"The gang's home turf, and the meal at the end of the journey.","c":"m"}]},{"h":"The sweet way home","tab":"Dessert","items":[{"k":"Chocolate-dipped ice-cream sandwiches","d":"Vanilla ice cream, chewy chocolate cookies & dark chocolate.","note":"Cold boardwalk comfort after a very long night.","c":"w"}]},{"h":"Cold soda","tab":"Drink","items":[{"k":"Cherry cola","d":"Ice-cold cola, cherry syrup & a squeeze of lime.","note":"A soda-counter finish to the journey. Alcohol-free.","c":"d"}]}],"art":{"hero":"/joSYVbskwQyjJcy18xvFCybvkWu.jpg","scene":"/9CZ3I5KywtMnD2KntSUG0VDNNEa.jpg","extra":"/avUvhy42KuxO3bXfItr5uTf3p6T.jpg","map":"/kr8LqYzHTwSdzOiMnhi1ajLJsog.jpg","logo":"/uMlZSH5ZsGaznzngJLNxEkCTK2g.png","source":"TMDB images API"}},
  "Die Hard (1988)":{"fmt":"nakatomi","brand":"Nakatomi Plaza","phoneTitle":"Die Hard","tag":"A very eventful Christmas.","groups":[{"h":"Passed around at the party","tab":"Snacks","items":[{"k":"Nakatomi party canapés","n":"Nakatomi party canapés","note":"Smoked salmon blini, passed around at the Nakatomi Christmas party.","d":"Warm blini, smoked salmon, crème fraîche, salmon roe & dill.","c":"s"},{"k":"Argyle's limo snacks","n":"Argyle’s limo snacks","note":"Rosemary nuts from the back of Argyle’s limousine.","d":"Warm cashews & almonds, rosemary butter, brown sugar & cayenne.","c":"s"}]},{"h":"Christmas party supper","tab":"Main","items":[{"k":"Christmas party roast beef rolls","n":"Christmas party roast beef rolls","note":"A Christmas Eve supper for the Nakatomi reception.","d":"Shaved roast beef, soft rolls, horseradish cream, rocket & pickled onions.","c":"m"}]},{"h":"Something sweet for Al","tab":"Dessert","items":[{"k":"Snack cakes for Al","n":"Snack cakes for Al","note":"A nod to Sergeant Al Powell’s convenience-store haul.","d":"Vanilla sponge fingers, split & filled with marshmallow cream.","c":"w"}]},{"h":"From Argyle’s limo bar","tab":"Drink","items":[{"k":"Bourbon on the rocks","n":"Bourbon on the rocks","note":"Argyle pours from the limo bar.","d":"Bourbon, one large ice cube & a twist of orange.","c":"d"}]}],"art":{"hero":"/mYOlKvVGfhql8j9dI2ycL5yiiwS.jpg","scene":"/yw55hiqnDOwZiXpkraXu114rmGz.jpg","extra":"/cnt1uNJmdKDMPtOPTJHkjveFmPD.jpg","logo":"/elYpRiF6dJbnkB5yMvoWolidLvj.png","source":"TMDB images API"}},
  "Jurassic Park (1993)":{"fmt":"jurassic","brand":"Jurassic Park visitor centre","phoneTitle":"Jurassic Park","tag":"Spared no expense.","groups":[{"h":"Small discoveries","tab":"Snacks","items":[{"k":"Dino egg cookies","d":"Brown butter cookies with chocolate-egg centres and cocoa speckles.","note":"A little miracle, straight from the hatchery.","c":"s"},{"k":"Raptor claw crisps","d":"Paprika tortilla claws, served with fresh lime guacamole.","note":"Inspired by the raptors’ visitor-centre kitchen pursuit.","c":"s"}]},{"h":"A civilised lunch","tab":"Main","items":[{"k":"Visitor centre lunch","d":"Pea and mint purée, roast baby potatoes.","note":"The lunch where the scientists question Hammond’s dream.","c":"m","n":"Herb-crusted lamb rack"}]},{"h":"Freezer interruption","tab":"Dessert","items":[{"k":"Melting ice cream","d":"Soft vanilla bean ice cream, hot chocolate fudge and crushed honeycomb.","note":"Hammond’s consolation when the freezers go down.","c":"w"}]},{"h":"Keep an eye on the water","tab":"Drink","items":[{"k":"Glass of water","d":"Ice, lemon and chilled sparkling water. Alcohol-free.","note":"The first warning is on the surface.","c":"d"}]}],"art":{"hero":"/o7LzVmlOSYc3EspyVMC9bsTTARc.jpg","scene":"/fcErc5zyvou7y8v5w8keO0CpunG.jpg","extra":"/qEb40gA5dYgaWZ2X0FHvQKOhWVr.jpg","logo":"/ec4wy0iZFkHTxw04HyX4r06DwrH.png","source":"TMDB images API"}},
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
        {k:"Paris market baguette",fr:"La baguette",n:"Bread, with a proper crust",note:"Listen for the crackle",p:"€4",
         how:"Warm 2 good baguettes in a 200C oven for 6 minutes until the crust crackles when you squeeze it. Tear, do not slice, and serve with 100g salted butter at room temperature.",
         shop:["2 baguettes@Bakery","100g salted butter@Dairy"]}]},
      {h:"Les plats",en:"Mains",items:[
        {k:"Ratatouille",fr:"Ratatouille",n:"Ratatouille, layered fine",note:"The dish that takes Ego straight back to his mum's kitchen",p:"€28"},
        {k:"Sweetbreads à la Gusteau",fr:"Ris de veau à la Gusteau",n:"Sweetbreads à la Gusteau",note:"The old recipe Linguini was told to cook. Remy rewrote it",p:"€32",c:"m",
         how:"Soak 600g veal sweetbreads in cold water for 2 hours, then simmer in salted water for 4 minutes and plunge into iced water. Peel off the membrane and press under a weighted tray for an hour. Slice into 2cm pieces, dust with flour and pan-fry in 30g butter for 3 minutes a side until golden. Deglaze with 80ml white wine and 100ml veal or chicken stock, reduce, then swirl in 20g cold butter. Serve with the sauce spooned over.",
         shop:["600g veal sweetbreads@Meat","50g butter@Dairy","2 tbsp plain flour@Pantry","80ml white wine@Bottle shop","100ml chicken stock@Pantry"]}]},
      {h:"La cave",en:"The cellar",items:[
        {k:"Ego's red wine",fr:"Bordeaux, 1947",n:"A good Bordeaux",note:"Ego's order. Any good Bordeaux will do at home",p:"Ask the sommelier"}]}]},
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
        {k:"New Orleans beignets",n:"Beignets",note:"The New Orleans stop. Icing sugar everywhere",p:"$4",
         how:"Mix 7g dried yeast, 1 tbsp sugar and 180ml warm milk, stand 10 minutes. Beat in 1 egg, 30g melted butter, 350g plain flour and a pinch of salt to a soft dough, knead 3 minutes, cover and rise 1 hour. Roll 5mm thick, cut into 6cm squares and fry at 175C for 1 minute a side until puffed and golden. Drain and bury in 100g icing sugar.",
         shop:["7g dried yeast@Pantry","1 tbsp caster sugar@Pantry","180ml full cream milk@Dairy","1 egg@Dairy","30g butter@Dairy","350g plain flour@Pantry","100g icing sugar@Pantry","1L vegetable oil@Pantry"]},
        {k:"Aglio e olio",n:"Aglio e olio",note:"What he cooks for Molly at midnight",p:"$9",
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
        {k:"Road trip grapes",n:"Grapes, for the car",note:"Harry spits the seeds out the window",p:"0.75",q:"1"}]},
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
        {k:"Kevin's glass of milk",n:"Big glass of milk",d:"Ice cold, full cream",note:"Mind the plane tickets",p:"0.75"},
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
        {k:"Bowling alley nachos",n:"Alley nachos",note:"League night with Walter and Donny",p:"2.95"},
        {k:"Rug crackers",note:"It really tied the room together",p:"1.95"},
        {k:"Half and half dip",note:"The Dude buys it in his dressing gown",p:"2.50"}]},
      {h:"Grill",items:[
        {k:"Bowling alley burgers",n:"Alley burgers",note:"Walter, Donny and the Dude between frames",p:"3.95",mark:1},
        {k:"Drive-thru burger in the car",n:"Drive-thru burger",note:"Eaten in the Dude's beat-up car",p:"2.49"}]},
      {h:"Lounge",items:[
        {k:"Milk and cookies",note:"For the half and half",p:"1.50"},
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
        {k:"Bean bun stack",zh:"豆沙包",coinZh:"四文",p:"4 coins",note:"Stacked high, worth the climb"}]},
      {h:"Noodles & wok",items:[
        {k:"Secret ingredient soup",zh:"秘方湯麵",coinZh:"五文",p:"5 coins",note:"Mr Ping's famous noodle soup"},
        {k:"Valley of Peace stir-fry",zh:"和平谷小炒",coinZh:"六文",p:"6 coins",note:"The busy village below the Jade Palace"}]}],
    colB:[{h:"Sweet & tea",items:[
        {k:"Almond cookies",zh:"杏仁餅",coinZh:"二文",p:"2 coins",note:"The Furious Five's training snack"},
        {k:"Jasmine tea",zh:"茉莉花茶",coinZh:"一文",p:"1 coin",note:"A quiet moment in the Jade Palace"}]}]},
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
        {k:"Plum wine",n:"Egg Shen's plum wine",code:"D2",zh:"梅酒",extra:"by the glass",note:"The bottle for the trip below",p:"3.50"}]}],
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
        {k:"Sweet tea",d:"by the pitcher, lemon on the side",note:"So sweet your teeth hurt",p:"0.75"}]}],
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
        {k:"Peanut butter AND jelly",note:"Never two things that match. Now they do.",p:"1.50"},
        {k:"Ham AND burger sliders",note:"Ham, no burger. Fixed.",p:"2.99"}]},
      {h:"Off the Grill",c:"red",items:[
        {k:"Porch day barbecue plate",n:"Porch day BBQ plate",note:"Drumsticks, corn, potato salad. Eat it on the steps.",p:"4.99",burst:["$4.99","Big plate","#b6ff3b",-10]},
        {k:"Counter pineapple spears",n:"Pineapple spears",note:"Off the kitchen counter, grill-charred.",p:"1.00"}]}],
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
const FMT_RENDER={gimbels:fmtGimbels,lair:fmtLair,tonys:fmtTonys,whistle:fmtWhistle,sals:fmtSals,mcdowells:fmtMcdowells,coney:fmtConey,nakatomi:fmtNakatomi,jurassic:fmtJurassic,newsroom:fmtNewsroom,market:fmtMarket,takeaway:(...a)=>fmtTakeaway(...a),diner:(...a)=>fmtDiner(...a),casefile:(...a)=>fmtCase(...a),noodle:(...a)=>fmtNoodle(...a),slims:(...a)=>fmtSlims(...a),lanes:(...a)=>fmtLanes(...a),workorder:(...a)=>fmtWorkOrder(...a),nero:(...a)=>fmtNero(...a),carte:(...a)=>fmtCarte(...a),feast:(...a)=>fmtFeast(...a),truck:(...a)=>fmtTruck(...a),check:(...a)=>fmtCheck(...a),lous:(...a)=>fmtLous(...a),pad:(...a)=>fmtPad(...a)};
function fmtHTML(f,spec,menu){return FMT_RENDER[spec.fmt](f,spec,menu,lobbyPoster(f))}

/* phone view: same menu, big type, one section at a time, tap a dish for the method */
function fmtPhoneHTML(f,spec,menu){
  const P=FMT_PHONE[spec.fmt],poster=lobbyPoster(f);
  const groups=menu.groups;
  return `<div class="fp fp-${spec.fmt}" style="--fp-top:${P.top};--fp-top-ink:${P.topInk};--fp-paper:${P.paper};--fp-ink:${P.ink};--fp-soft:${P.soft};--fp-acc:${P.accent};--fp-tab:${P.tab};--fp-disp:${P.disp};--fp-name:${P.name};--fp-body:${P.body};--fp-price:${P.price};--fp-title:${P.title};--fp-note:${P.note||P.body}">
    <header class="fp-head">${poster?`<img class="fp-poster" crossorigin="anonymous" src="${TMDB_IMG}w185${ESC(poster)}" alt="">`:""}<div><div class="fp-brand">${spec.fmt==="mcdowells"?fmtMcdowellsMark("display:inline-block;width:26px;height:24px;vertical-align:middle;margin-right:7px"):""}${ESC(spec.sign?spec.sign[1]:spec.brand||"")}</div><h2 class="fp-title">${ESC(spec.phoneTitle||f.title)}</h2><p class="fp-tag">${spec.tag||ESC(f.T)}</p><p class="fp-hint">Serves four. Tap a dish for the method.</p></div></header>
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
  const B="#652838",P="#f4ead3",I="#392c26",G="#d5a244",M="#6b584b",L="#b7a183";
  const HEAD="font-family:'Bevan',serif;font-weight:400",BODY="font-family:'Libre Franklin',sans-serif",TYPE="font-family:'Courier Prime',monospace";
  const pos=(x,y,w,extra="")=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${extra}`;
  const micro=(t,ink=B)=>`<div style="${TYPE};font-size:11px;line-height:1.3;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ink}">${ESC(t)}</div>`;
  const section=(num,title)=>`<div style="display:flex;align-items:center;gap:9px"><span style="${TYPE};font-size:11px;line-height:23px;text-align:center;flex:none;width:24px;height:24px;border:1px solid ${B};border-radius:50%;color:${B}">${num}</span>${micro(title)}</div>`;
  const pick=k=>menu.all.find(it=>it.n===k)||{};
  const snacks=spec.groups[0].items,main=spec.groups[1].items[0],sweet=spec.groups[2].items[0],drink=spec.groups[3].items[0];
  const snack=(x,y)=>`<article style="${pos(0,y,333)}"><div style="${BODY};font-size:21px;line-height:1.15;font-weight:700;color:${I}">${ESC(pick(x.k).label||x.k)}</div><div style="${BODY};font-size:13px;line-height:1.5;color:${M};margin-top:5px">${ESC(x.d)}</div><div style="${TYPE};font-size:11px;line-height:1.35;color:${B};margin-top:6px">${ESC(x.note)}</div></article>`;
  const rail=`<aside style="${pos(0,0,280,`height:742px;background:${B};color:${P};overflow:hidden`)}">
    <div aria-label="Channel 4 News" style="${pos(25,23,108,`height:112px;background:${P};color:${B};box-shadow:4px 4px 0 #3e1c24;overflow:hidden`)}"><div aria-hidden="true" style="${HEAD};font-size:107px;line-height:88px;text-align:center;transform:skewX(-8deg);padding-right:5px">4</div><div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:25px;background:${G};border-top:3px solid ${B};${BODY};font-size:17px;line-height:22px;font-weight:700;letter-spacing:.18em;text-align:center;padding-left:3px">NEWS</div></div>
    <div style="${pos(147,38,112)}">${micro("KVWN",P)}<div style="${BODY};font-size:23px;line-height:1.05;font-weight:700;letter-spacing:-.03em;margin-top:9px">SAN<br>DIEGO</div><div style="${TYPE};font-size:10px;line-height:1.3;color:#e5c29d;margin-top:9px">CHANNEL FOUR</div></div>
    <div style="${pos(0,153,280,`height:8px;background:${G}`)}"></div><div style="${pos(0,166,280,'height:5px;background:#b87443')}"></div><div style="${pos(0,176,280,'height:3px;background:#e0bb83')}"></div>
    <div style="${pos(26,204,228)}"><div style="${HEAD};font-size:28px;line-height:1;letter-spacing:-.025em">ANCHORMAN</div><div style="${TYPE};font-size:11px;line-height:1.5;margin-top:9px;color:#e8ccaa">The Legend of Ron Burgundy</div></div>
    <div style="${pos(25,276,230,`height:338px;border:1px solid #a16d66;border-radius:5px;padding:7px;background:#3e1c24;box-shadow:0 4px 0 rgba(0,0,0,.15)`)}">${poster?`<img class="fx-poster" crossorigin="anonymous" alt="${ESC(f.title)} (${ESC(f.year)}) official film poster" src="${TMDB_IMG}w500${ESC(poster)}" style="display:block;width:214px;height:322px;object-fit:cover">`:""}</div>
    <div style="${pos(26,631,228)}"><div style="${TYPE};font-size:10px;letter-spacing:.05em;color:#e8ccaa">TONIGHT'S FEATURE · 2004</div><div style="${HEAD};font-size:20px;line-height:1.3;margin-top:10px">Stay classy,<br>San Diego.</div></div>
    <div style="${pos(26,711,228,`border-top:1px solid #ad786e;padding-top:7px;${TYPE};font-size:8px;letter-spacing:.1em;color:#e8ccaa`)}">MOVIE NIGHT EDITION / POSTER: TMDB</div>
  </aside>`;
  const masthead=`<div style="${pos(310,26,731,`display:flex;justify-content:space-between;border-bottom:1px solid ${L};padding-bottom:10px`)}">${micro("After hours / staff canteen")}<div style="${TYPE};font-size:11px;line-height:1.3;color:${M}">SERVES FOUR</div></div>
    <header style="${pos(310,67,731,`height:137px;border-bottom:4px solid ${B}`)}"><h2 style="margin:0;${HEAD};font-size:47px;line-height:1.05;letter-spacing:-.03em;color:${B}">The six o'clock<br>supper.</h2><div style="position:absolute;right:1px;top:13px;transform:rotate(-5deg);border:2px solid ${B};padding:10px 14px 9px;text-align:center;color:${B};${TYPE};font-size:12px;font-weight:700;letter-spacing:.07em;line-height:1.35">NEWS TEAM<br>MEAL BREAK</div><div style="position:absolute;right:0;bottom:15px;${TYPE};font-size:11px;color:${M}">Stay classy. Stay hungry.</div></header>`;
  const courses=`<section style="${pos(310,224,333,'height:197px')}">${section("01","At the news desk")}${snack(snacks[0],38)}${snack(snacks[1],128)}</section>
    <section style="${pos(675,224,366,`height:197px;border-left:1px solid ${L};padding-left:24px`)}">${section("02","The lead story")}<div style="${BODY};font-size:27px;line-height:1.13;font-weight:700;letter-spacing:-.03em;color:${I};margin-top:13px">San Diego<br>chicken tacos</div><div style="${BODY};font-size:13px;line-height:1.5;color:${M};margin-top:7px">${ESC(main.d)}</div><div style="margin-top:13px;border-top:1px dashed ${L};padding-top:8px;${TYPE};font-size:10.5px;line-height:1.4;color:${B}"><b>BREAKING NEWS</b> / Baxter eats an entire wheel of cheese.</div></section>`;
  const dessert=`<section style="${pos(310,458,731,`height:158px;background:${B};color:${P};padding:17px 20px;box-sizing:border-box;border-top:7px solid ${G}`)}">${micro("03 / The sweet sign-off",'#e8ccaa')}
    <div style="position:absolute;left:20px;top:44px;${HEAD};font-size:36px;line-height:1;letter-spacing:-.03em">Butter<span style="color:${G}">SCOTCH</span><span style="display:block;${BODY};font-size:18px;font-weight:600;letter-spacing:0;line-height:1.3;margin-top:6px">Self-saucing pudding</span></div>
    <div style="position:absolute;left:20px;bottom:14px;${BODY};font-size:11.5px;line-height:1.35;color:#ead8bc">Golden syrup, dark brown sugar & vanilla ice cream.</div>
    <div style="position:absolute;right:21px;top:22px;width:181px;border-left:1px solid #a16d66;padding-left:21px"><div style="${HEAD};font-size:21px;line-height:1.2;color:${P}">“Scotchy,<br>scotch,<br>scotch.”</div><div style="${TYPE};font-size:9px;letter-spacing:.08em;margin-top:10px;color:#e8ccaa">RON BURGUNDY</div></div>
  </section>`;
  const drinks=`<section style="${pos(310,637,731,'height:52px;display:flex;align-items:flex-start;gap:16px')}"><div style="flex:none;width:170px">${section("04","Off the clock")}<div style="${TYPE};font-size:10px;color:${M};margin:8px 0 0 33px">ALCOHOL-FREE</div></div><div style="flex:1;border-left:1px solid ${L};padding-left:18px"><div style="${BODY};font-size:21px;line-height:1.1;font-weight:700;letter-spacing:-.02em;color:${B}">${ESC(drink.n)}</div><div style="${BODY};font-size:12px;line-height:1.5;color:${M};margin-top:5px"><b>Blackberry lemonade.</b> Fresh lemon & sparkling water.</div></div></section>`;
  const cue=`<footer style="${pos(310,705,731,`border-top:1px solid ${L};padding-top:8px;display:flex;gap:12px;align-items:baseline`)}"><span style="${TYPE};font-size:10px;font-weight:700;white-space:nowrap;color:${B}">ROLL CUE</span><span style="${BODY};font-size:10px;line-height:1.4;color:${M}">${ESC(fmtCue(f))}</span></footer>`;
  return `<div class="fx-wall" style="position:relative;height:742px;background:${P};color:${I};box-shadow:0 18px 50px rgba(0,0,0,.35);overflow:hidden">${rail}${masthead}${courses}${dessert}${drinks}${cue}<img aria-hidden="true" alt="" src="assets/hero/paper.webp" style="position:absolute;inset:0;width:100%;height:100%;opacity:.055;pointer-events:none;object-fit:cover"></div>`;
}


function fmtJurassic(f,spec,menu,poster){
  const G='#153d30',P='#eee3c4',A='#e6b23f',R='#ad3226',I='#243a2d',M='#58614c';
  const H="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif",T="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const art=spec.art||{},url=(key,size='w1280')=>TMDB_IMG+size+art[key];
  const micro=(t,c=G)=>`<div style="${T};font-size:10px;font-weight:700;letter-spacing:.08em;line-height:1.35;text-transform:uppercase;color:${c}">${ESC(t)}</div>`;
  const pick=x=>menu.all.find(it=>it.n===x.k)||{};
  const label=x=>ESC(pick(x).label||x.n||x.k);
  const snacks=spec.groups[0].items,main=spec.groups[1].items[0],sweet=spec.groups[2].items[0],drink=spec.groups[3].items[0];
  const dish=(x,y,w,item,number,caption,extra='')=>`<article style="${at(x,y,w,extra)}"><div style="display:flex;gap:9px;align-items:baseline"><span style="${T};font-size:10px;font-weight:700;color:${R}">${number}</span>${micro(caption)}</div><div style="${B};font-size:23px;line-height:1.1;font-weight:700;letter-spacing:-.025em;color:${G};margin-top:7px">${label(item)}</div><div style="${B};font-size:12.5px;line-height:1.5;color:${I};margin-top:7px">${ESC(item.d)}</div></article>`;
  const cover=`<section style="${at(0,250,357,`height:492px;color:${P};background:${G};background-image:linear-gradient(100deg,rgba(255,244,192,.045),transparent 48%,rgba(0,0,0,.12))`)}"><div style="${at(28,23,301)}">${micro('After hours',A)}</div><img crossorigin="anonymous" src="${url('logo','w500')}" alt="Jurassic Park" style="${at(35,61,287,'height:213px;object-fit:contain;display:block')}"><div style="${at(28,301,301)}"><h2 style="margin:0;${H};font-size:27px;line-height:1.15;letter-spacing:-.03em">A film-night<br>field guide.</h2></div><div style="${at(28,390,301,`border-top:1px solid #6b7d58;padding-top:11px`)}">${micro('Serving cue',A)}<div style="${B};font-size:11px;line-height:1.5;margin-top:6px;color:${P}">${ESC(fmtCue(f))}</div></div></section>`;
  const hatchery=`<section style="${at(0,250,357,'height:492px')}"><header style="${at(24,19,309)}">${micro('Small discoveries')}</header><img crossorigin="anonymous" src="${url('scene','w780')}" alt="Grant, Hammond, Sattler and Malcolm watch the hatchery egg open" style="${at(24,49,309,'height:151px;display:block;object-fit:cover;object-position:center 35%;border:4px solid #f5edda;box-shadow:1px 2px 3px rgba(40,35,20,.2);transform:rotate(-.6deg)')}">
    ${dish(24,222,309,snacks[0],'','From the hatchery')}
    <div aria-hidden="true" style="${at(24,329,309,'height:1px;background:#b9ae89')}"></div>
    ${dish(24,350,309,snacks[1],'','The kitchen pursuit')}
  </section>`;
  const visitor=`<section style="${at(0,0,357,'height:742px')}"><img crossorigin="anonymous" src="${url('extra','w780')}" alt="The T. rex beneath the falling visitor-centre banner" style="${at(0,0,357,'height:211px;display:block;object-fit:cover;object-position:center center')}"><article style="${at(24,232,309)}">${micro('Visitor centre / The lunch debate',R)}<h2 style="margin:9px 0 0;${H};font-size:36px;line-height:1.04;letter-spacing:-.035em;font-weight:400;color:${G}">Herb-crusted<br>lamb rack</h2><div style="${B};font-size:13px;line-height:1.5;color:${I};margin-top:12px">${ESC(main.d)}</div></article>
    <div style="${at(24,399,309,`${B};font-size:12px;line-height:1.5;font-style:italic;color:${M}`)}">${ESC(main.note)}</div>
    <div aria-hidden="true" style="${at(24,458,309,`height:2px;background:${R}`)}"></div>
    ${dish(24,478,309,sweet,'','The freezers are off')}
    <div aria-hidden="true" style="${at(24,591,309,'height:1px;background:#b9ae89')}"></div>
    ${dish(24,610,309,drink,'','Watch for ripples')}
  </section>`;
  const cue=`<div style="${at(24,722,309)}"><div style="${T};font-size:8px;line-height:1.3;letter-spacing:.025em;color:${M}">FILM-NIGHT EDITION / FILM STILLS: TMDB</div></div>`;
  const panelPhoto=offset=>`<div style="position:absolute;left:0;top:0;width:357px;height:250px;overflow:hidden"><img class="fx-poster" crossorigin="anonymous" src="${url('hero')}" alt="The T. rex faces Grant’s flare in the rain" style="position:absolute;left:${-offset}px;top:0;width:714px;height:250px;object-fit:cover;object-position:center 43%;display:block"><div style="position:absolute;left:0;right:0;bottom:0;height:4px;background:${A}"></div></div>`;
  const surface=`<img aria-hidden="true" alt="" src="assets/hero/paper.webp" style="position:absolute;left:0;top:0;width:357px;height:742px;object-fit:cover;opacity:.10;pointer-events:none"><div aria-hidden="true" style="position:absolute;inset:0;border-top:1px solid rgba(255,247,218,.62);border-left:1px solid rgba(255,247,218,.4);border-right:1px solid rgba(35,31,14,.5);border-bottom:2px solid rgba(29,26,13,.45);pointer-events:none"></div>`;
  const edge=(side,mountain)=>`<div aria-hidden="true" style="position:absolute;${side}:0;top:0;width:9px;height:742px;background:linear-gradient(90deg,${mountain?'rgba(255,248,220,.19),rgba(255,248,220,.4) 22%,rgba(30,25,13,.17) 40%,transparent':'transparent,rgba(24,22,12,.08) 50%,rgba(12,15,8,.31) 91%,rgba(245,233,198,.24)'});pointer-events:none"></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:#13241c;background-image:radial-gradient(ellipse at 24% 12%,#334237,transparent 67%),linear-gradient(130deg,#22342a,#0c1813);${B}"><div aria-hidden="true" style="position:absolute;left:37px;top:35px;width:1010px;height:686px;background:rgba(0,0,0,.43);transform:rotate(.25deg)"></div><div style="position:absolute;left:32px;top:19px;width:1071px;height:748px;transform:scale(.94);transform-origin:top left"><section style="position:absolute;left:0;top:0;width:357px;height:742px;background:${G};transform:skewY(.8deg);transform-origin:top left;overflow:hidden">${panelPhoto(0)}${cover}${surface}${edge('right',false)}</section><section style="position:absolute;left:357px;top:5px;width:357px;height:742px;background:${P};transform:skewY(-.8deg);transform-origin:top left;overflow:hidden">${panelPhoto(357)}${hatchery}${cue}${surface}${edge('left',true)}${edge('right',true)}</section><section style="position:absolute;left:714px;top:0;width:357px;height:742px;background:#e6d9b7;transform:skewY(.6deg);transform-origin:top left;overflow:hidden">${visitor}${surface}${edge('left',false)}</section></div></div>`;
}

function fmtNakatomi(f,spec,menu,poster){
  const P='#e5e8d7',I='#5c4434',T='#715844',R='#ae2d2c',S='#a9b9b8';
  const SER="font-family:'Cormorant Garamond',serif;font-weight:500",BODY="font-family:'Libre Franklin',sans-serif",MONO="font-family:'Courier Prime',monospace";
  const at=(x,y,w,e='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${e}`;
  const micro=(s,c=T)=>`<div style="${MONO};font-size:10px;line-height:1.35;letter-spacing:.075em;color:${c};text-transform:uppercase">${ESC(s)}</div>`;
  const a=spec.art||{};
  const img=(key,size,alt,style)=>a[key]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}${size}${ESC(a[key])}" alt="${ESC(alt)}" style="display:block;${style}">`:'';
  const xs=spec.groups.flatMap(g=>g.items),heads=['Passed at the Christmas party','From the back of Argyle’s limo','Christmas Eve supper','For Sergeant Al Powell','From Argyle’s limo bar'];
  const foodName=x=>{const it=menu.all.find(y=>y.n===x.k)||{};return ESC(x.n||it.label||x.k);};
  const dish=(x,head,size=29)=>`${micro(head)}<div style="${SER};font-size:${size}px;line-height:1.03;letter-spacing:-.022em;color:${I};margin-top:5px">${foodName(x)}</div><div style="${BODY};font-size:13px;line-height:1.45;color:#675647;margin-top:7px">${ESC(x.d)}</div>`;
  const rows=xs.slice(0,2).map((x,i)=>`<article style="${at(28,172+i*84,556,'height:84px;border-top:1px solid #b9bda8;padding-top:10px;box-sizing:border-box')}"><div style="${at(0,11,37,`${MONO};font-size:21px;line-height:1;color:${T}`)}">0${i+1}</div><div style="margin-left:49px">${dish(x,heads[i],28)}</div></article>`).join('')+
    `<article style="${at(28,345,556,'height:147px;border-top:1px solid #a69970;padding-top:14px;box-sizing:border-box')}"><div style="${at(0,16,37,`${MONO};font-size:29px;line-height:1;color:#9b8043`)}">03</div><div style="margin-left:49px"><div style="${MONO};font-size:10px;letter-spacing:.09em;color:#8f7840">THE CHRISTMAS EVE SUPPER</div><div style="${SER};font-size:34px;line-height:1.05;letter-spacing:-.025em;margin-top:9px">${foodName(xs[2])}</div><div style="${BODY};font-size:14.5px;line-height:1.5;color:#675647;margin-top:9px">${ESC(xs[2].d)}</div></div></article>`+
    `<div style="${at(28,474,556,'display:flex;gap:25px;border-top:1px solid #b9bda8;padding-top:17px')}"><article style="width:266px">${dish(xs[3],heads[3],29)}</article><article style="width:265px">${dish(xs[4],heads[4],29)}</article></div>`;
  const reception=`<section aria-label="Nakatomi Christmas reception menu" style="${at(24,24,620,`height:694px;background:${P};color:${I};box-shadow:5px 0 10px rgba(0,0,0,.45)`)}">
    <img aria-hidden="true" src="assets/hero/paper.webp" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.1">
    <div style="${at(28,23,556,`height:48px;border-bottom:3px solid ${T}`)}"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 84" style="position:absolute;left:0;top:1px;width:31px;height:25px" fill="${I}"><path d="M14 27 45 0 44 27 29 40ZM77 0 107 27 93 40 77 26ZM0 40 12 29 28 42 60 14 92 42 108 29 120 40 94 64 78 50A18 18 0 0 0 42 50L26 64ZM0 62 9 53 26 69 36 60 44 68 21 83ZM120 62 111 53 94 69 84 60 76 68 99 83Z"/><circle cx="60" cy="39" r="6"/><circle cx="52" cy="51" r="6"/><circle cx="68" cy="51" r="6"/></svg><div style="margin-left:40px;${BODY};font-size:24px;font-weight:600;letter-spacing:.15em;line-height:1">NAKATOMI</div><div style="margin-left:41px;${BODY};font-size:8px;letter-spacing:.32em;margin-top:6px">CORPORATION</div><div style="position:absolute;right:0;top:3px;text-align:right">${micro('Los Angeles')}${micro('24 December · 1988')}</div></div>
    <header style="${at(28,89,556)}"><h2 style="${SER};font-size:47px;line-height:.94;letter-spacing:-.035em;margin:0">Christmas reception</h2><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:15px">${micro('24 December / Christmas Eve / Reception')}<span style="${SER};font-size:18px;font-style:italic;color:${T}">For four.</span></div></header>
    ${rows}
    <div aria-hidden="true" style="position:absolute;right:8px;top:0;bottom:0;width:1px;border-left:1px dashed #a9b9b2"></div>
    ${Array.from({length:13},(_,i)=>`<span aria-hidden="true" style="position:absolute;right:0;top:${21+i*53}px;width:5px;height:5px;border-radius:50%;background:#0b1d28"></span>`).join('')}
    <footer style="${at(28,628,556,`border-top:3px solid ${T};padding-top:8px`)}"><div style="${MONO};font-size:10px;letter-spacing:.05em;color:${R};font-weight:700">SERVICE NOTE / ROLL FILM</div><div style="${BODY};font-size:12px;line-height:1.45;color:${I};margin-top:4px">${ESC(fmtCue(f))}</div></footer>
  </section>`;
  const pictureLeaf=`<aside aria-label="Nakatomi Plaza, then John McClane inside the building" style="${at(668,24,379,'height:694px;background:#07151c;border:1px solid #4a6066;box-sizing:border-box')}">
    ${img('hero','w1280','Arrival at Nakatomi Plaza at sunset','position:absolute;left:0;top:0;width:377px;height:345px;object-fit:cover;object-position:78% center;')}
    <div aria-hidden="true" style="position:absolute;left:0;right:0;top:0;height:145px;background:linear-gradient(rgba(3,17,25,.74),rgba(3,17,25,0))"></div>
    <div style="${at(22,22,333,'display:flex;justify-content:space-between;align-items:flex-start')}"><div><div style="${BODY};font-size:21px;font-weight:600;line-height:1;letter-spacing:.11em;color:${P}">NAKATOMI<br><span style="font-weight:400;font-size:14px;letter-spacing:.24em;line-height:1.8">PLAZA</span></div><div style="margin-top:10px">${micro('Los Angeles', '#eeeee4')}</div></div><div style="border-top:1px solid #e2e3d7;padding-top:6px">${micro('1988','#eeeee4')}</div></div>
    <div aria-hidden="true" style="position:absolute;left:0;right:0;top:302px;height:43px;background:linear-gradient(transparent,rgba(3,17,25,.7))"></div>
    ${img('scene','w1280','John McClane with a lighter inside the ventilation shaft','position:absolute;left:0;top:345px;width:377px;height:217px;object-fit:cover;object-position:50% 48%;')}
    <div aria-hidden="true" style="position:absolute;left:0;right:0;top:532px;height:44px;background:linear-gradient(transparent,#07151c)"></div>
    <div style="${at(22,570,333)}">${img('logo','original','Die Hard official film logo','width:333px;height:56px;object-fit:contain;object-position:left center;')}</div>
    <div style="${at(22,679,333,`${MONO};font-size:8px;letter-spacing:.06em;color:#aabcb9`)}">MOVIE NIGHT EDITION · FILM IMAGERY: TMDB</div>
    <div aria-hidden="true" style="position:absolute;left:0;top:0;bottom:0;width:11px;background:linear-gradient(90deg,rgba(0,0,0,.4),transparent)"></div>
  </aside>`;
  const dispatch=`<div aria-hidden="true" style="${at(52,369,995,`height:1px;background:${R}`)}"></div><div style="${at(569,347,286,`height:22px;background:${P};color:${R};box-sizing:border-box;padding:6px 11px 0;${MONO};font-size:11px;line-height:1;letter-spacing:.095em`)}">RECEPTION INTERRUPTED</div>`;
  const hinge=`<div aria-hidden="true" style="${at(645,18,22,'height:706px;background:linear-gradient(90deg,#07131c,#334952 48%,#07131c);border-left:1px solid #516369;border-right:1px solid #516369')}"><span style="position:absolute;top:33px;left:8px;width:6px;height:640px;border-left:1px solid #6b7f82;border-right:1px solid #020b10"></span></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:#0b1d28;border:1px solid #576970;box-sizing:border-box;box-shadow:0 20px 45px rgba(0,0,0,.6)"><div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid #2b424b"></div>${reception}${hinge}${pictureLeaf}${dispatch}</div>`;
}

/* The last concession before the ocean: enamel board, real film map, counterbill and soda ticket. */
function fmtConey(f,spec,menu,poster){
 const N='#050c10',C='#ebdfc3',R='#97392e',Y='#d0ad60',I='#283338',M='#685645';
 const D="font-family:'Alfa Slab One',serif;font-weight:400",B="font-family:'Barlow Condensed',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const image=(role,size='w1280')=>TMDB_IMG+size+spec.art[role];
 const tiny=(t,col=M)=>`<div style="${B};font-size:11px;font-weight:600;letter-spacing:.14em;line-height:1.25;color:${col}">${ESC(t)}</div>`;
 const gs=spec.groups,sn=gs[0].items,main=gs[1].items[0],sweet=gs[2].items[0],drink=gs[3].items[0];
 const texture=(opacity=.16)=>`<img aria-hidden="true" alt="" src="assets/hero/paper.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:${opacity};pointer-events:none">`;
 const bolts=[[13,13],[614,13],[13,326],[614,326]].map(([x,y])=>`<i aria-hidden="true" style="${at(x,y,7,'height:7px;border:1px solid #292e2b;background:#a59c7f;border-radius:50%;box-shadow:0 1px 2px #391811')}"><span style="position:absolute;left:1px;top:2px;width:3px;border-top:1px solid #524c3c;transform:rotate(-20deg)"></span></i>`).join('');
 const cinema=`<div style="${at(0,0,433,'height:362px;background:#02090c;overflow:hidden')}"><img crossorigin="anonymous" alt="The Wonder Wheel at night, The Warriors" src="${image('hero')}" style="position:absolute;left:-15px;top:80px;width:458px;height:283px;object-fit:cover"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,9,12,.05),transparent 60%,#0b1c23)"></div><img class="fx-poster" crossorigin="anonymous" alt="The Warriors official film logo" src="${image('logo','original')}" style="position:absolute;left:22px;top:15px;width:378px;height:178px;object-fit:contain"><div style="${at(29,205,335)}">${tiny('NEW YORK CITY / 1979',Y)}<div style="${B};font-size:27px;line-height:1.1;font-weight:600;letter-spacing:.09em;color:${C};margin-top:11px">THE LONG WAY<br>HOME.</div></div></div>
 <figure style="${at(426,17,621,'height:357px;margin:0;background:#b9ad91;padding:6px;transform:rotate(.5deg);box-shadow:-4px 7px 18px rgba(0,0,0,.65)')}"><img crossorigin="anonymous" alt="The Warriors on the station platform during their journey home" src="${image('scene')}" style="display:block;width:609px;height:342px;object-fit:contain;background:#13252b"><span aria-hidden="true" style="position:absolute;left:46px;top:-5px;width:61px;height:17px;background:rgba(204,180,132,.65);transform:rotate(-7deg)"></span></figure>`;
 const board=`<section style="${at(24,343,635,`height:345px;background:${R};color:${C};border:3px solid #62352b;border-radius:5px;box-shadow:2px 5px 0 #4f3029,7px 12px 20px rgba(0,0,0,.65);transform:rotate(-1.1deg)`)}">${texture(.12)}<div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid #ca9472;border-radius:2px"></div><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 635 345" style="position:absolute;inset:0;width:100%;height:100%"><g fill="none" stroke="#d3b18c" stroke-width="1" opacity=".5"><path d="M2 53v17M5 52v9M3 278l2 16 10 11M633 31l-2 14M630 263v23M46 2h22M492 339h40M119 341h13"/><path d="M2 319l6 13 12 3M615 339l15-9 2-10"/></g></svg>${bolts}<div style="${at(25,25,310)}">${tiny('01 / BACK ON HOME TURF',Y)}<div style="${B};font-size:23px;line-height:1.1;font-weight:600;letter-spacing:.13em;margin-top:14px">CONEY ISLAND</div><h2 style="${D};font-size:58px;line-height:.98;letter-spacing:-.04em;margin:6px 0 0">CHILLI<br>DOGS</h2><div style="${B};font-size:18px;line-height:1.25;margin-top:16px;width:304px">${ESC(main.d)}</div><div style="${B};font-size:10px;font-weight:600;letter-spacing:.13em;border-top:1px solid #c0785b;padding-top:8px;margin-top:16px;width:304px">8 DOGS / 4 HUNGRY PEOPLE</div></div><figure style="${at(363,111,225,'height:165px;margin:0;padding:7px;background:#c8b48f;transform:rotate(3.5deg);box-shadow:2px 5px 8px rgba(41,17,11,.4)')}"><img crossorigin="anonymous" alt="Actual film detail: a finger follows the New York subway map during the Warriors’ journey home" src="${image('map')}" style="display:block;width:211px;height:119px;object-fit:contain;background:#273238;opacity:.94"><div aria-hidden="true" style="position:absolute;left:108px;top:7px;width:6px;height:119px;background:linear-gradient(90deg,transparent,rgba(0,0,0,.12),rgba(255,255,255,.08),transparent)"></div><figcaption style="padding:12px 4px 0;${B};font-size:10px;line-height:1.25;font-weight:600;letter-spacing:.1em;text-align:center;color:#493f31">LAST STOP / CONEY ISLAND</figcaption></figure></section>`;
 const snack=(x,y)=>`<article style="${at(23,y,304)}"><h3 style="${B};font-size:25px;line-height:1.07;font-weight:700;margin:0;color:${I}">${ESC(x.k)}</h3><p style="${B};font-size:17px;line-height:1.23;color:${M};margin:5px 0 0">${ESC(x.d)}</p></article>`;
 const snacks=`<section style="${at(686,296,356,`height:219px;background:${C};color:${I};transform:rotate(1deg);box-shadow:-2px 6px 13px rgba(0,0,0,.55)`)}">${texture(.19)}<div aria-hidden="true" style="position:absolute;left:174px;top:0;bottom:0;width:10px;background:linear-gradient(90deg,transparent,rgba(109,79,43,.12),rgba(255,252,225,.5),transparent)"></div><div style="${at(23,17,304)}">${tiny('02 / OFF THE CART',R)}<div style="border-top:3px double ${R};margin-top:10px"></div></div>${snack(sn[0],53)}${snack(sn[1],133)}<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 24" style="position:absolute;right:0;bottom:0;width:27px;height:24px"><path fill="#b5a184" d="M0 24h27V0Z"/><path fill="#f8efd9" d="M0 24l23-4L27 0Z"/></svg></section>`;
 const ticket=`<section style="${at(663,526,380,`height:179px;background:${Y};color:${I};transform:rotate(-1.7deg);box-shadow:3px 7px 14px rgba(0,0,0,.55)`)}">${texture(.13)}<div aria-hidden="true" style="position:absolute;left:247px;top:8px;bottom:8px;border-left:1px dashed #806747"></div><div aria-hidden="true" style="position:absolute;left:240px;top:-6px;width:14px;height:14px;border-radius:50%;background:${N}"></div><div aria-hidden="true" style="position:absolute;left:240px;bottom:-6px;width:14px;height:14px;border-radius:50%;background:${N}"></div><section style="${at(18,15,216)}">${tiny('03 / SWEET WAY HOME',R)}<h3 style="${B};font-size:24px;line-height:1.02;font-weight:700;margin:7px 0 6px">Chocolate-dipped<br>ice-cream sandwiches</h3><p style="${B};font-size:16px;line-height:1.2;color:#57442e;margin:0">${ESC(sweet.d)}</p></section><section style="${at(262,15,100)}">${tiny('04 / SODA',R)}<h3 style="${B};font-size:25px;line-height:1.05;font-weight:700;color:${R};margin:7px 0 6px">Cherry cola</h3><p style="${B};font-size:16px;line-height:1.2;margin:0">${ESC(drink.d)}</p></section></section>`;
 const footer=`<footer style="${at(27,717,1017,`display:flex;gap:18px;align-items:baseline;color:${C}`)}"><span style="${B};font-size:11px;font-weight:600;letter-spacing:.13em;color:${Y};white-space:nowrap">LAST STOP / CONEY ISLAND</span><span style="${B};font-size:12px;line-height:1.25">${ESC(fmtCue(f))}</span><span style="margin-left:auto;${B};font-size:8px;letter-spacing:.08em;white-space:nowrap;color:#a7aaa3">FILM IMAGERY: TMDB</span></footer>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${N};box-shadow:0 18px 35px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;opacity:.1;background:repeating-linear-gradient(94deg,transparent 0 165px,#85765b 166px 168px,transparent 169px 337px)"></div>${cinema}${board}${snacks}${ticket}${footer}</div>`;
}

function fmtMcdowellsMark(style=""){
  return `<svg class="mcdowells-golden-m" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" role="img" aria-label="McDowell’s golden M" style="${style}"><path fill="#efbd24" d="M9 81V42C9-3 53-3 55 42C57-3 101-3 101 42V81H89V42C89 13 66 13 65 43V81H45V43C44 13 21 13 21 42V81Z"/><rect x="0" y="80" width="110" height="20" fill="#397b28"/><text x="55" y="94" text-anchor="middle" fill="#fff7da" font-family="Libre Franklin, sans-serif" font-size="9" font-weight="600">McDowell’s</text></svg>`;
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
  const box=`<header style="${at(22,18,1027,`height:125px;background:#fff7de;border:5px solid ${BROWN};border-radius:5px;box-shadow:inset 0 0 0 2px #e2c787,0 5px 7px rgba(45,13,10,.5);overflow:hidden`)}">${fmtMcdowellsMark("position:absolute;left:23px;top:15px;width:91px;height:89px")}<div style="${at(132,19,550,`${H};font-size:62px;line-height:1;letter-spacing:-.045em;color:${R};text-shadow:1px 1px 0 #f4bf53`)}">McDowell’s</div><div style="${at(135,91,547)}">${micro('Queens / a royal appetite',BROWN)}</div><div style="${at(724,21,249,`height:74px;border-left:2px solid #d7bd88;padding-left:24px`)}"><div style="${H};font-size:23px;line-height:1.12;letter-spacing:-.03em;color:${R}">COMING TO<br>AMERICA</div><div style="${T};font-size:10px;font-weight:700;letter-spacing:.1em;color:${M};margin-top:8px">FILM NIGHT / 1988</div></div></header>`;
  const liner=`<section style="${at(24,164,1023,`height:551px;background:${P};box-shadow:0 4px 9px rgba(47,17,11,.43);border:1px solid #c9b28a;overflow:hidden`)}"><img src="assets/hero/paper.webp" alt="" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.09;pointer-events:none"><div style="${at(15,15,480,'height:200px')}"><img class="fx-poster" crossorigin="anonymous" src="${image('counter')}" alt="Akeem and his co-worker behind the McDowell’s counter" style="display:block;width:480px;height:200px;object-fit:cover;object-position:center 40%"></div><div style="${at(505,15,328,'height:200px')}"><img crossorigin="anonymous" src="${image('royal')}" alt="Akeem and Lisa at their royal wedding in Zamunda" style="display:block;width:328px;height:200px;object-fit:cover;object-position:center 35%"></div><figure style="${at(852,15,154,`height:200px;margin:0;background:${R}`)}"><img crossorigin="anonymous" src="${TMDB_IMG}w342${ESC(art.poster||poster||'')}" alt="Coming to America official film poster" style="display:block;width:134px;height:200px;object-fit:cover;margin:auto"></figure>
    <div style="${at(15,216,818,`height:20px;background:${R};display:flex;align-items:center;justify-content:space-between;padding:0 9px`)}">${micro('A prince at the counter',P)}${micro('Queens meets Zamunda',P)}</div>
    <article style="${at(26,257,342)}">${micro('The house burger')}<h2 style="margin:9px 0 0;${H};font-size:59px;line-height:.98;letter-spacing:-.055em;color:${R}">BIG MICK<span style="display:block;font-size:35px;letter-spacing:-.035em;line-height:1.15;margin-top:4px">burger</span></h2><div style="${B};font-size:13px;line-height:1.5;color:${I};margin-top:14px">${ESC(main.d)}</div><div style="${T};font-size:10px;line-height:1.4;color:${M};margin-top:16px">Akeem’s day job.<br>Cleo McDowell’s pride and joy.</div></article>
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
  const RED='#a92b20',WALL='#b74425',CREAM='#f7e8ba',Y='#efbe50',INK='#2c1c16',MUTED='#d7bb87';
  const HEAD="font-family:'Bevan',serif;font-weight:400",BODY="font-family:'Libre Franklin',sans-serif",COND="font-family:'Barlow Condensed',sans-serif";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{};
  const micro=(s,c=MUTED)=>`<div style="${COND};font-size:12px;font-weight:600;line-height:1.2;letter-spacing:.16em;text-transform:uppercase;color:${c}">${ESC(s)}</div>`;
  const name=x=>{const it=menu.all.find(y=>y.n===x.k)||{};return ESC(x.n||it.label||x.k);};
  const xs=spec.groups.flatMap(g=>g.items);
  const small=(x,k)=>`<div>${micro(k)}<div style="${COND};font-size:29px;font-weight:700;line-height:1.05;color:${CREAM};margin-top:8px">${name(x)}</div><div style="${BODY};font-size:13px;line-height:1.5;color:#e3d1a9;margin-top:8px">${ESC(x.d)}</div></div>`;
  const frame=(key,y,h,alt,position='center')=>`<figure style="${at(712,y,332,`height:${h}px;margin:0;padding:9px;background:#34241a;border:2px solid #69442c;box-shadow:4px 6px 0 #77291c,6px 10px 15px rgba(37,13,7,.4);box-sizing:border-box`)}"><div style="position:absolute;inset:4px;border:1px solid #a17b49;pointer-events:none"></div>${a[key]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w780${ESC(a[key])}" alt="${ESC(alt)}" style="display:block;width:310px;height:${h-22}px;object-fit:cover;object-position:${position}">`:''}</figure>`;
  const sign=`<header style="${at(24,24,661,`height:141px;background:${CREAM};border:5px solid ${INK};box-shadow:0 5px 0 #76241b,5px 9px 15px rgba(40,10,4,.35);box-sizing:border-box;text-align:center;color:${RED}`)}"><div aria-hidden="true" style="position:absolute;inset:5px;border:1px solid #ad7a3f"></div><div style="${HEAD};font-size:70px;line-height:1;letter-spacing:-.035em;margin-top:8px;text-shadow:2px 2px 0 #d4b67b">SAL’S FAMOUS</div><div style="${COND};font-size:30px;font-weight:700;line-height:1.1;letter-spacing:.24em;margin-top:6px;padding-left:8px">PIZZERIA</div><div style="position:absolute;left:19px;bottom:11px;${COND};font-weight:600;font-size:10px;letter-spacing:.09em;color:#7b462d">BROOKLYN</div><div style="position:absolute;right:19px;bottom:11px;${COND};font-weight:600;font-size:10px;letter-spacing:.09em;color:#7b462d">MOVIE NIGHT / 1989</div></header>`;
  const board=`<section aria-label="Sal’s Famous Pizzeria movie night menu" style="${at(24,186,661,`height:479px;background:${INK};border:7px solid #6d4128;box-shadow:inset 0 0 0 2px #a57c45,5px 8px 13px rgba(45,13,6,.4);box-sizing:border-box`)}"><div style="position:absolute;inset:11px;border:1px solid #87653f;pointer-events:none"></div>
    <div style="${at(25,23,597,'display:flex;justify-content:space-between')}">${micro('Fresh from the oven',Y)}${micro('Supper for four',Y)}</div>
    <div style="${at(25,54,597,'display:flex;gap:35px')}"><article style="width:282px">${small(xs[0],'01 / While you wait')}</article><article style="width:280px">${small(xs[1],'02 / Cool down')}</article></div>
    <article style="${at(25,190,597,`height:130px;border-top:2px solid ${Y};border-bottom:2px solid ${Y};padding-top:14px;box-sizing:border-box`)}"><div style="display:flex;justify-content:space-between">${micro('03 / The house special',Y)}${micro('Cut big. Serve hot.',Y)}</div><div style="${HEAD};font-size:42px;line-height:1.05;letter-spacing:-.025em;color:${CREAM};margin-top:9px">${name(xs[2])}</div><div style="${BODY};font-size:14px;line-height:1.45;color:#e7d5ad;margin-top:10px">${ESC(xs[2].d)}</div></article>
    <div style="${at(25,342,597,'display:flex;gap:35px')}"><article style="width:282px">${small(xs[3],'04 / Something cold')}</article><article style="width:280px">${small(xs[4],'05 / From the fridge')}</article></div>
  </section>`;
  const photographs=`${frame('counter',25,229,'Mookie at Sal’s counter, with the framed photographs behind him','50% 42%')}${frame('street',276,201,'The three corner men against the heat-red Brooklyn wall')}${frame('identity',499,215,'Do the Right Thing, the blue pavement and delivery box title image','center')}`;
  const cue=`<footer style="${at(25,687,660,'display:flex;gap:12px;align-items:flex-start')}"><span style="${COND};font-size:12px;font-weight:700;letter-spacing:.13em;color:${Y};white-space:nowrap">DELIVERY CUE</span><span style="${BODY};font-size:11px;line-height:1.5;color:${CREAM}">${ESC(fmtCue(f))}</span></footer>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${WALL};box-shadow:0 18px 45px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,168,64,.17),transparent 53%,rgba(52,16,10,.24))"></div><img aria-hidden="true" alt="" src="assets/hero/paper.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.1"><div aria-hidden="true" style="position:absolute;left:699px;top:0;height:742px;width:1px;background:rgba(88,28,17,.6);box-shadow:1px 0 0 rgba(247,170,87,.18)"></div>${sign}${board}${photographs}${cue}<div style="${at(718,725,327,`${COND};font-size:8px;line-height:1;letter-spacing:.1em;color:#f0c995;text-align:right`)}">FILM-NIGHT EDITION / FILM IMAGERY: TMDB</div></div>`;
}

/* A railway-town luncheon board: fixed picture windows, café green and warm cream. */
function fmtWhistle(f,spec,menu,poster){
 const G='#294b3c',C='#f1e7cd',Y='#c4a66e',R='#963e32',I='#343d32',M='#70604b';
 const D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const tiny=(t,c=G)=>`<div style="${B};font-size:9px;line-height:1.3;letter-spacing:.16em;font-weight:600;text-transform:uppercase;color:${c}">${ESC(t)}</div>`;
 const pic=(key,alt,w,h)=>`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(spec.art[key])}" alt="${ESC(alt)}" style="display:block;width:${w}px;height:${h}px;object-fit:cover">`;
 const gs=spec.groups,sn=gs[0].items,main=gs[1].items[0],sweet=gs[2].items[0],drink=gs[3].items[0];
 const desc=(x,col=M)=>`<p style="${B};font-size:14px;line-height:1.48;color:${col};margin:9px 0 0">${ESC(x.d)}</p>`;
 const photo=(x,y,w,h,key,alt)=>`<figure style="margin:0;${at(x,y,w+10,`height:${h+10}px;padding:5px;background:#9e8d6b;border:1px solid #c9b58b;box-shadow:inset 1px 1px 3px rgba(30,33,18,.5),1px 2px 0 #fff8e6`)}">${pic(key,alt,w,h)}</figure>`;
 const rail=(x,y,w)=>`<div aria-hidden="true" style="${at(x,y,w,'height:8px;border-top:1px solid '+Y+';border-bottom:1px solid '+Y)}"><i style="position:absolute;left:10px;top:-2px;width:5px;height:10px;background:${G}"></i><i style="position:absolute;right:10px;top:-2px;width:5px;height:10px;background:${G}"></i></div>`;
 const header=`<header style="${at(55,49,618)}">${tiny('WHISTLE STOP, ALABAMA / A FILM NIGHT LUNCHEON')}<h2 style="${D};font-size:48px;line-height:1.2;letter-spacing:-.035em;color:${G};margin:18px 0 0">Whistle Stop</h2><div style="display:flex;gap:19px;align-items:center;margin-top:5px"><span style="${D};font-size:34px;line-height:1.2;color:${R}">Café</span><span aria-hidden="true" style="width:67px;border-top:3px double ${Y}"></span><span style="${B};font-size:13px;line-height:1.5;color:${M}">A table for four.<br>A story to share.</span></div><div style="${B};font-size:10px;letter-spacing:.12em;font-weight:600;color:${G};margin-top:17px">FRIED GREEN TOMATOES <span style="font-weight:400;color:${M}">/ 1991</span></div></header>${photo(702,45,310,174,'cafe','Idgie and Ruth serving a customer inside the Whistle Stop Café')}`;
 const snacks=`<section style="${at(55,266,284)}">${photo(0,0,274,149,'tomatoes','Actual film scene: green tomato slices frying in a skillet')}<div style="position:absolute;left:0;top:170px;width:284px">${tiny('FROM SIPSEY’S KITCHEN',R)}<h3 style="${B};font-size:23px;line-height:1.15;font-weight:700;letter-spacing:-.035em;color:${I};margin:10px 0 0">Fried green tomatoes</h3>${desc(sn[0])}<div style="border-top:1px solid #c5b18b;margin:19px 0 16px"></div>${tiny('FOR THE BEE CHARMER',R)}<h3 style="${B};font-size:22px;line-height:1.15;font-weight:700;letter-spacing:-.035em;color:${I};margin:9px 0 0">Honeycomb and biscuits</h3>${desc(sn[1])}</div></section>`;
 const centre=`<section style="${at(370,266,316,`height:387px;background:${G};color:${C};box-shadow:inset 0 0 0 1px #173629,0 2px 2px rgba(60,47,24,.12)`)}"><div aria-hidden="true" style="position:absolute;inset:9px;border:1px solid #6c8060"></div><div style="${at(25,26,266)}">${tiny('THE CAFÉ’S FAMOUS PLATE',Y)}<h3 style="${D};font-size:29px;line-height:1.18;letter-spacing:-.03em;margin:19px 0 0">Whistle Stop<br>barbecue</h3>${desc(main,'#e7ddc5')}<div style="width:53px;border-top:2px solid ${Y};margin:23px 0 19px"></div><div style="${D};font-size:23px;line-height:1.25;letter-spacing:-.02em;color:${C}">The secret’s<br>in the sauce.</div><div style="${B};font-size:10px;line-height:1.5;margin-top:12px;color:#c9d0b7">PULL UP A CHAIR.<br>THERE’S ROOM AT THE TABLE.</div></div></section>`;
 const right=`<section style="${at(720,266,292)}">${photo(0,0,282,116,'storefront','The Whistle Stop Café storefront from the film')}<div style="${at(0,149,292)}">${tiny('SOMETHING SWEET',R)}<h3 style="${D};font-size:26px;line-height:1.2;letter-spacing:-.025em;color:${I};margin:9px 0 0">Pecan pie</h3>${desc(sweet)}<div style="border-top:1px solid #c5b18b;margin:20px 0 18px"></div>${tiny('A GLASS TO LINGER OVER',R)}<h3 style="${D};font-size:25px;line-height:1.2;letter-spacing:-.025em;color:${I};margin:8px 0 0">Sweet tea</h3>${desc(drink)}</div></section>`;
 const footer=`<footer style="${at(55,676,957,'border-top:3px double '+G+';padding-top:10px;display:flex;align-items:baseline;gap:14px')}"><span style="${B};font-size:9px;letter-spacing:.13em;font-weight:700;color:${R};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:11px;line-height:1.4;color:${M}">${ESC(fmtCue(f))}</span><span style="margin-left:auto;${B};font-size:7px;letter-spacing:.08em;white-space:nowrap;color:${M}">FILM IMAGERY: TMDB</span></footer>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:#4b3528;box-shadow:0 18px 38px rgba(0,0,0,.45)"><div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 7px,rgba(22,13,9,.1) 8px 9px)"></div><div aria-hidden="true" style="position:absolute;inset:21px;background:${C};border:4px solid ${G};box-shadow:0 4px 7px rgba(0,0,0,.5),inset 0 0 0 2px ${Y}"><img alt="" src="assets/hero/paper.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.09"></div>${header}${rail(55,239,957)}${snacks}${centre}${right}${footer}</div>`;
}

function fmtTonys(f,spec,menu,poster){
  const P='#f4ead3',I='#293f35',R='#8c3c37',M='#716651',G='#334d3e';
  const H="font-family:'Cormorant Garamond',serif",B="font-family:'Libre Franklin',sans-serif";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const art=spec.art||{},url=k=>TMDB_IMG+'w1280'+art[k];
  const pick=x=>menu.all.find(it=>it.n===x.k)||{};
  const label=x=>ESC(pick(x).label||x.n||x.k);
  const small=(t,c=R)=>`<div style="${B};font-size:9px;line-height:1.4;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${c}">${ESC(t)}</div>`;
  const snacks=spec.groups[0].items,main=spec.groups[1].items[0],sweet=spec.groups[2].items[0],drink=spec.groups[3].items[0];
  const dish=(x,y,w,it)=>`<article style="${at(x,y,w)}"><h3 style="margin:0;${H};font-size:28px;line-height:1.06;font-weight:600;letter-spacing:-.025em;color:${I}">${label(it)}</h3><div style="${B};font-size:12.5px;line-height:1.55;margin-top:7px;color:${M}">${ESC(it.d)}</div></article>`;
  const cloth=`<div aria-hidden="true" style="position:absolute;inset:0;background-color:#a8665a;background-image:linear-gradient(90deg,rgba(245,224,193,.5) 50%,transparent 50%),linear-gradient(rgba(245,224,193,.5) 50%,transparent 50%);background-size:42px 42px"></div>`;
  const pages=`<div aria-hidden="true" style="${at(26,25,1019,`height:692px;background:${P};box-shadow:0 8px 14px rgba(36,21,12,.5),0 2px 0 #bbaa8a;border:1px solid #c7b696`)}"></div><div aria-hidden="true" style="${at(39,38,408,`height:666px;border:1px solid #c8b99a`)}"></div>`;
  const left=`<header style="${at(65,55,356,'text-align:center')}"><div style="${H};font-size:80px;font-style:italic;line-height:1;font-weight:500;letter-spacing:-.05em;color:${R}">Tony’s</div><div style="${H};font-size:16px;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;margin-top:2px;color:${I}">Ristorante italiano</div><div style="width:40px;height:1px;background:${R};margin:17px auto 12px"></div>${small('Lady and the Tramp / 1955',M)}</header>
    <div style="${at(66,227,354)}">${small('Per cominciare / To begin')}</div>
    ${dish(66,254,354,snacks[0])}
    ${dish(66,347,354,snacks[1])}
    <div style="${at(66,451,354,`border-top:1px solid #c8b99a;padding-top:16px`)}">${small('Dolce / Something sweet')}</div>
    ${dish(66,495,354,sweet)}
    <div style="${at(66,591,354)}">${small('Da bere / To drink')}</div>
    ${dish(66,618,354,drink)}`;
  const right=`<img class="fx-poster" crossorigin="anonymous" src="${url('dinner')}" alt="Lady and Tramp share a spaghetti strand at Tony’s in the original 1955 animation" style="${at(475,39,555,'height:312px;display:block;object-fit:cover;object-position:center')}"><div style="${at(496,373,512)}">${small('Il piatto della casa / The house speciality')}<h2 style="margin:10px 0 0;${H};font-size:47px;line-height:.99;font-weight:600;letter-spacing:-.03em;color:${I}">Spaghetti<br><span style="font-style:italic;font-weight:400">and meatballs</span></h2><div style="${B};font-size:13px;line-height:1.55;color:${M};margin-top:13px;max-width:470px">${ESC(main.d)}</div></div>
    <img crossorigin="anonymous" src="${url('bridge')}" alt="The moonlit bridge during Lady and Tramp’s evening together" style="${at(475,557,272,'height:111px;object-fit:cover;object-position:center 48%;display:block')}"><img crossorigin="anonymous" src="${url('walk')}" alt="Lady and Tramp walk together on the hillside in the 1955 film" style="${at(758,557,272,'height:111px;object-fit:cover;object-position:center 63%;display:block')}">
    <footer style="${at(496,680,512,'display:flex;gap:12px;align-items:baseline')}"><span style="${B};font-size:9px;font-weight:600;letter-spacing:.08em;color:${R};white-space:nowrap">SERVING CUE</span><span style="${B};font-size:10px;line-height:1.4;color:${M}">${ESC(fmtCue(f))}</span></footer>`;
  const stock=`<img src="assets/hero/paper.webp" alt="" aria-hidden="true" style="${at(27,26,1017,'height:690px;opacity:.075;object-fit:cover;pointer-events:none')}"><div aria-hidden="true" style="${at(449,26,24,'height:690px;background:linear-gradient(90deg,transparent,rgba(76,57,28,.06) 25%,rgba(76,57,28,.17) 48%,rgba(255,250,228,.26) 56%,transparent);pointer-events:none')}"></div>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:#663d34;${B}">${cloth}${pages}${left}${right}${stock}<div style="${at(480,727,552,`${B};font-size:7px;line-height:1.2;letter-spacing:.1em;text-align:right;color:#f3e0c4`)}">MOVIE-NIGHT MENU / SERVES FOUR / ORIGINAL 1955 FILM STILLS: TMDB</div></div>`;
}


function fmtLair(f,spec,menu,poster){
  const K='#c8a26b',P='#e9d2a1',I='#213a2e',D='#102b23',L='#8e704b',BODY="font-family:'Libre Franklin',sans-serif",HEAD="font-family:'Bevan',serif;font-weight:400",TYPE="font-family:'Courier Prime',monospace";
  const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
  const a=spec.art||{},xs=spec.groups.flatMap(g=>g.items);
  const micro=(t,c=I)=>`<div style="${TYPE};font-size:10px;font-weight:700;letter-spacing:.07em;line-height:1.35;text-transform:uppercase;color:${c}">${ESC(t)}</div>`;
  const nm=x=>{const it=menu.all.find(y=>y.n===x.k)||{};return ESC(x.n||it.label||x.k);};
  const img=(key,w,h,extra='')=>a[key]?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(a[key])}" alt="${key==='brothers'?'The four brothers in their underground lair':'April and a turtle sharing pizza, Teenage Mutant Ninja Turtles (1990)'}" style="display:block;width:${w}px;height:${h}px;object-fit:cover;${extra}">`:'';
  const small=(x,k)=>`${micro(k)}<div style="${HEAD};font-size:23px;line-height:1.08;letter-spacing:-.025em;margin-top:6px">${nm(x)}</div><div style="${BODY};font-size:13px;line-height:1.45;margin-top:8px;color:#3f4734">${ESC(x.d)}</div>`;
  const lid=`<div style="${at(22,18,1027,`height:302px;background:#756040;border:7px solid #9d7e50;box-sizing:border-box;box-shadow:0 5px 0 #382f20,0 8px 12px rgba(0,0,0,.6)`)}"><div style="position:absolute;left:0;top:0">${img('brothers',610,288,'object-position:center top;')}</div><div style="position:absolute;left:610px;top:0;border-left:5px solid #1d2f27">${img('pizza',398,288,'object-position:52% center;')}</div><div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:68px;background:linear-gradient(transparent,rgba(8,28,21,.88))"></div><div style="position:absolute;left:18px;bottom:14px;${HEAD};font-size:27px;letter-spacing:-.015em;color:#e9d2a1">Straight from the underground.</div><div style="position:absolute;right:18px;bottom:17px">${micro('New York / 1990','#e9d2a1')}</div></div>`;
  const box=`<section aria-label="Pizza night in the turtles’ lair" style="${at(22,334,1027,`height:366px;background:${K};border-left:9px solid #a48252;border-right:9px solid #a48252;box-sizing:border-box;box-shadow:0 10px 0 #77603c,0 17px 14px rgba(0,0,0,.55);color:${I}`)}"><img aria-hidden="true" alt="" src="assets/hero/paper.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.18"><div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid #9a7a4e"></div>
    <div style="${at(226,17,751,'display:flex;justify-content:space-between;border-bottom:2px solid #536044;padding-bottom:8px')}">${micro('Deliver to the lair')}${micro('Four brothers / Four pizzas')}</div>
    <div style="${at(226,56,751,'display:flex;gap:30px')}"><article style="width:360px">${small(xs[0],'01 / Open the box')}</article><article style="width:361px">${small(xs[1],'02 / For the sensei')}</article></div>
    <article style="${at(226,146,751,'border-top:2px solid #536044;padding-top:10px')}"><div style="display:flex;justify-content:space-between;align-items:baseline"><div style="${HEAD};font-size:32px;line-height:1;letter-spacing:-.035em;white-space:nowrap;flex-shrink:0">${nm(xs[2])}</div>${micro('03 / One each')}</div><div style="${BODY};font-size:13px;line-height:1.45;margin-top:7px;color:#3f4734">${ESC(xs[2].d)}</div><div style="display:flex;gap:12px;margin-top:12px">${[['LEONARDO','Pepperoni','#315c9d'],['DONATELLO','Mushroom','#705080'],['RAPHAEL','Supreme','#a73729'],['MICHELANGELO','Fridge raid','#b86b24']].map(([n,t,c])=>`<div style="width:179px;border-top:5px solid ${c};padding-top:5px"><div style="${TYPE};font-size:9px;line-height:1.3;font-weight:700;color:${I}">${n}</div><div style="${BODY};font-size:11px;line-height:1.3;margin-top:2px;color:#3f4734">${t}</div></div>`).join('')}</div></article>
    <div style="${at(226,288,751,'display:flex;gap:30px;border-top:1px solid #8e704b;padding-top:10px')}"><article style="width:360px"><div style="${HEAD};font-size:21px;line-height:1.1">${nm(xs[3])}</div><div style="${BODY};font-size:13px;line-height:1.45;color:#3f4734;margin-top:5px">${ESC(xs[3].d)}</div></article><article style="width:361px"><div style="${HEAD};font-size:21px;line-height:1.1">${nm(xs[4])}</div><div style="${BODY};font-size:13px;line-height:1.45;color:#3f4734;margin-top:5px">${ESC(xs[4].d)}</div></article></div>
  </section>`;
  const identity=`<aside style="${at(42,350,181,'height:324px;transform:rotate(-2deg);background:#102a24;padding:5px;box-sizing:border-box;box-shadow:4px 6px 8px rgba(30,27,15,.5)')}">${a.poster?`<img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w500${ESC(a.poster)}" alt="Teenage Mutant Ninja Turtles (1990) official poster" style="display:block;width:171px;height:257px;object-fit:cover">`:''}<div style="${TYPE};font-size:10px;line-height:1.4;color:${P};font-weight:700;letter-spacing:.04em;padding:13px 7px 0">FOUR BROTHERS.<br>ZERO LEFTOVERS.</div></aside>`;
  const cue=`<footer style="${at(31,721,1009,'display:flex;gap:14px;align-items:baseline')}"><span style="${TYPE};font-size:10px;font-weight:700;color:#d6be87;white-space:nowrap;letter-spacing:.06em">DELIVERY CUE</span><span style="${BODY};font-size:11px;line-height:1.35;color:#d9d9be">${ESC(fmtCue(f))}</span><span style="margin-left:auto;${TYPE};font-size:7.5px;color:#9caa92;white-space:nowrap">FILM IMAGERY: TMDB</span></footer>`;
  return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;background:${D};box-shadow:0 20px 45px rgba(0,0,0,.55)"><div aria-hidden="true" style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 43px,rgba(0,0,0,.15) 43px 45px)"></div><div aria-hidden="true" style="${at(30,319,1010,'height:16px;background:repeating-linear-gradient(90deg,#725634 0 3px,#b89b67 3px 6px);border-top:2px solid #1a2f24;border-bottom:2px solid #806140')}"></div>${lid}${box}${identity}${cue}</div>`;
}

function fmtGimbels(f,spec,menu,poster){
 const G='#174737',DARK='#08281e',Y='#d8b865',C='#f2eddd',R='#a0322d',I='#26392e',M='#6c6251';
 const S="font-family:'Cormorant Garamond',serif",D="font-family:'Bevan',serif;font-weight:400",B="font-family:'Libre Franklin',sans-serif";
 const at=(x,y,w,s='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;${s}`;
 const micro=(t,col=M)=>`<div style="${B};font-size:9px;line-height:1.3;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${col}">${ESC(t)}</div>`;
 const gs=spec.groups,sn=gs[0].items,main=gs[1].items[0],sweet=gs[2].items[0],drink=gs[3].items[0];
 const desc=x=>`<p style="${B};font-size:13px;line-height:1.5;color:${M};margin:7px 0 0">${ESC(x.d)}</p>`;
 const window=(y,h,k,alt,cap)=>`<figure style="${at(684,y,355,`height:${h+23}px;margin:0;background:${DARK};border:1px solid #9f8c53;padding:5px;box-shadow:inset 0 0 0 3px #123a2c,0 3px 6px rgba(0,0,0,.4)`)}"><img class="fx-poster" crossorigin="anonymous" src="${TMDB_IMG}w1280${ESC(spec.art[k])}" alt="${ESC(alt)}" style="display:block;width:343px;height:${h}px;object-fit:cover;object-position:center ${k==='store'?'35%':'center'}"><figcaption style="${B};font-size:7px;line-height:1;letter-spacing:.16em;color:${Y};padding-top:5px;text-align:center">${ESC(cap)}</figcaption><div aria-hidden="true" style="position:absolute;inset:5px 5px 18px;background:linear-gradient(115deg,rgba(255,255,255,.08),transparent 24%,transparent 73%,rgba(255,255,255,.04));pointer-events:none"></div></figure>`;
 const header=`<header style="${at(35,20,1001,'text-align:center')}"><div style="${S};font-weight:600;font-size:70px;line-height:1.05;letter-spacing:.13em;color:${C};padding-left:.13em">GIMBELS</div><div style="display:flex;gap:21px;justify-content:center;align-items:center;margin-top:5px"><span style="width:125px;border-top:1px solid ${Y}"></span><span style="${B};font-size:10px;font-weight:600;letter-spacing:.2em;color:${Y}">CHRISTMAS IN NEW YORK</span><span style="width:125px;border-top:1px solid ${Y}"></span></div></header>`;
 const card=`<section style="${at(34,143,624,`height:549px;background:${C};box-shadow:0 9px 18px rgba(0,0,0,.45);border:1px solid #d0c5a3`)}"><img aria-hidden="true" alt="" src="assets/hero/paper.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.075"><div aria-hidden="true" style="position:absolute;inset:10px;border:1px solid #cbbb8e"></div><header style="${at(26,24,566)}"><div style="display:flex;justify-content:space-between">${micro('ELF / 2003',R)}${micro('CITY FIELD TRIP / LUNCH FOR FOUR')}</div><h2 style="${S};font-size:48px;line-height:.98;font-weight:600;letter-spacing:-.035em;color:${G};margin:13px 0 0">Buddy’s big-city lunch.</h2><div style="${B};font-size:12px;line-height:1.3;color:${M};margin-top:10px">A little North Pole sweetness. A very New York appetite.</div><div style="border-top:3px double #bda675;margin-top:17px"></div></header>
 <section style="${at(26,160,266)}">${micro('01 / THE SWEET STUFF',R)}<h3 style="${B};font-size:21px;line-height:1.15;font-weight:700;color:${I};margin:10px 0 0">Maple syrup popcorn</h3>${desc(sn[0])}</section><section style="${at(322,160,276)}">${micro('02 / CANDY CANE FOREST',R)}<h3 style="${B};font-size:21px;line-height:1.15;font-weight:700;color:${I};margin:10px 0 0">Candy cane<br>pretzel rods</h3>${desc(sn[1])}</section>
 <section style="${at(26,291,566,'border-top:1px solid #cbbb8e;padding-top:15px')}">${micro('03 / A BREAK BETWEEN ADVENTURES',R)}<h3 style="${D};font-size:27px;line-height:1.15;letter-spacing:-.025em;color:${G};margin:11px 0 0">New York street hot dogs</h3>${desc(main)}</section>
 <section style="${at(26,431,265)}">${micro('04 / SNOWBALL FIGHT',R)}<h3 style="${B};font-size:21px;line-height:1.15;font-weight:700;color:${I};margin:10px 0 0">Snowball fight cupcakes</h3>${desc(sweet)}</section>
 <section style="${at(323,415,275,'height:124px;background:#e3cda2;transform:rotate(1.2deg);box-shadow:1px 3px 5px rgba(57,42,22,.18);padding:13px 17px;border:1px solid #cbb27e')}"><span aria-hidden="true" style="position:absolute;right:10px;top:10px;width:7px;height:7px;border-radius:50%;background:${C};border:1px solid #b29664"></span>${micro('05 / CONGRATULATIONS!',R)}<h3 style="${B};font-size:19px;line-height:1.12;font-weight:700;color:${I};margin:7px 0 0">World’s best cup of coffee</h3>${desc(drink)}</section>
 </section>`;
 const photos=`${window(143,192,'buddy','Buddy delighted inside the Christmas-decorated Gimbels store','BUDDY / CHRISTMAS IS A FULL-TIME JOB')}${window(371,171,'display','Jovie inside Gimbels, surrounded by the decorated Christmas department','A LITTLE CHRISTMAS SPIRIT GOES A LONG WAY')}${window(578,91,'store','The Gimbels department store exterior from Elf','GIMBELS / NEW YORK CITY')}`;
 const cue=`<footer style="${at(36,713,1001,'display:flex;align-items:baseline;gap:13px')}"><span style="${B};font-size:9px;letter-spacing:.12em;font-weight:600;color:${Y};white-space:nowrap">SHOWTIME CUE</span><span style="${B};font-size:11px;line-height:1.35;color:${C}">${ESC(fmtCue(f))}</span><span style="margin-left:auto;${B};font-size:7px;letter-spacing:.1em;color:#a5b5a4;white-space:nowrap">FILM IMAGERY: TMDB</span></footer>`;
 return `<div class="fx-wall" style="position:relative;width:1071px;height:742px;overflow:hidden;background:${G};box-shadow:0 18px 38px rgba(0,0,0,.5)"><div aria-hidden="true" style="position:absolute;inset:13px;border:1px solid #9a8f55"></div><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.14),transparent 25%,transparent 72%,rgba(0,0,0,.18));pointer-events:none"></div>${header}${card}${photos}${cue}</div>`;
}
