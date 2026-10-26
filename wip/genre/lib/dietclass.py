"""Classify every planner dish as vegetarian and/or alcohol-free from its ingredients (data/recipes2)."""
import json,glob,re,collections,sys
MEAT=re.compile(r"\b(beef|steaks?|mince|pork|lamb|veal|chicken|turkey|duck|goose|venison|rabbit|kangaroo|bacon|ham|prosciutto|pancetta|salami|chorizo|pepperoni|sausages?|snags?|frankfurts?|franks|hot dogs?|bratwurst|kielbasa|chipolatas|boerewors|mortadella|pastrami|bresaola|corned|silverside|brisket|ribs?|wings|drumsticks|thighs?|cutlets?|fillet steak|sirloin|rump|chuck|topside|brisket|meatballs?|lard|dripping|suet|gelatine|gelatin|marshmallows?|jelly crystals|liver|livers|oxtail|tripe|offal|sweetbreads|biltong|jerky|spam|luncheon meat|pate|pâté|haggis|black pudding|bone marrow|gravy beef|stock|broth|bouillon|worcestershire|fish sauce|oyster sauce|shrimp paste|anchov(y|ies)|bonito|dashi|caviar|roe|prawns?|shrimp|crab|lobster|crayfish|bugs|scallops?|mussels?|clams?|oysters?|squid|calamari|octopus|salmon|tuna|trout|snapper|barramundi|barra|flathead|cod|whiting|sardines?|mackerel|herring|kipper|haddock|halibut|fish|seafood|escargot|snails?|eel|surimi|krill)\b",re.I)
VEG_OK=re.compile(r"vegetable stock|veggie stock|vegetarian|vegan|mushroom stock|plant-based|meat-free|meatless|agar|veggie|bean ?burger|vegetarian (sausage|mince)",re.I)
BOOZE_AISLE="Bottle shop"
def dish_flags(d):
  veg=True;af=True
  for i in d.get("ingredients") or []:
    it=str(i.get("item",""))
    if i.get("aisle")==BOOZE_AISLE: af=False
    if (MEAT.search(it) or i.get("aisle") in ("Meat","Seafood")) and not VEG_OK.search(it): veg=False
  return veg,af
def classify():
  out={}
  for p in sorted(glob.glob("data/recipes2/*.json")):
    r=json.load(open(p));out[p.split("/")[-1][:-5]]={x["n"]:dish_flags(x) for x in r["dishes"]}
  return out
if __name__=="__main__":
  C=classify();films=json.load(open("data/films.json"))
  slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
  st=collections.Counter()
  for f in films:
    s=slug(f"{f['title']} ({f['year']})");r2=json.load(open(f"data/recipes2/{s}.json"))["dishes"];c=C[s]
    vegmain=any(c[d["n"]][0] for d in r2 if d["course"]=="m");vegn=sum(1 for d in r2 if c[d["n"]][0])
    afall=all(c[d["n"]][1] for d in r2);afdrink=any(c[d["n"]][1] for d in r2 if d["course"]=="d")
    st["films"]+=1;st["veg main"]+=vegmain;st["veg main + 3 veg dishes"]+=vegmain and vegn>=3;st["all dishes veg"]+=vegn==len(r2)
    st["all alcohol-free"]+=afall;st["has an alcohol-free drink"]+=afdrink
    st["dishes"]+=len(r2);st["veg dishes"]+=vegn;st["af dishes"]+=sum(1 for d in r2 if c[d["n"]][1])
  for k,v in st.items(): print(f"{k}: {v}")
