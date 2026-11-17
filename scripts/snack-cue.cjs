/* Snack pairing cue (review 29): the "Goes well with" snacks follow the menu's own cooking, not just the wheel theme.
   A film whose dishes clearly lean one way (French, Italian, Asian, Mexican, Indian) gets a cue; app.js snackGoData maps it to a snack pool. */
const CUE={
 asia:/\b(sushi|sashimi|ramen|miso|teriyaki|yakitori|tempura|katsu|udon|soba|bento|izakaya|matcha|onigiri|gyoza|dumplings?|wonton|bao|dim sum|char siu|bok choy|wok|noodles?|kimchi|bulgogi|pho|banh mi|satay|pad thai|lemongrass|congee|szechuan|sichuan|hoisin|five.spice|jasmine rice|lychee)\b/gi,
 fr:/\b(bistro|brasserie|patisserie|pâtisserie|croissants?|crêpes?|crepes?|baguette|brie|camembert|gruyère|gruyere|bouillabaisse|ratatouille|coq au vin|confit|béarnaise|bearnaise|soufflé|souffle|madeleines?|éclairs?|eclairs?|macarons?|vichyssoise|provençal|provencal|niçoise|nicoise|tarte tatin|crème brûlée|creme brulee|beurre|frites|escargots?|paris|parisian)\b/gi,
 it:/\b(trattoria|osteria|pasta|spaghetti|linguine|rigatoni|penne|lasagne|lasagna|risotto|gnocchi|ravioli|tortellini|carbonara|bolognese|pesto|parmigiana|parmesan|focaccia|bruschetta|tiramisu|gelato|cannoli|arancini|prosciutto|mozzarella|burrata|osso buco|polenta|biscotti|affogato|negroni|limoncello|calamari fritti)\b/gi,
 mx:/\b(tacos?|burritos?|enchiladas?|quesadillas?|tortillas?|salsa|guacamole|mole|churros?|elote|carnitas|tamales?|chilaquiles|pozole|horchata|margaritas?|tequila|mezcal|al pastor|tostadas?)\b/gi,
 in:/\b(curry|masala|tandoori|naan|dal|daal|biryani|paneer|chai|samosas?|pakoras?|chutney|raita|vindaloo|korma|tikka|lassi)\b/gi};
function snackCue(f,fl){const parts=[];for(const k of ['S','M','W','K'])for(const d of (f[k]||[]))parts.push(d[0],d[1]||'');fl=fl||{};parts.push(fl.venue||'',fl.sign||'');
 const t=parts.join(' . ');const sc=Object.entries(CUE).map(([k,re])=>[k,(t.match(re)||[]).length]).sort((a,b)=>b[1]-a[1]);
 return sc[0][1]>=3&&sc[0][1]>=2*sc[1][1]?sc[0][0]:'';}
module.exports={snackCue,CUE};
