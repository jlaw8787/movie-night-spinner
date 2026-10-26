"""Apply wip/dishfix/out/pack*.json to data/films.json, data/recipes/<slug>.json and data/recipes2/<slug>.json.
Matches each dish by its old name; reports anything it could not match."""
import json,glob,re,os
R='/home/claude/polish'
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
P={}
for p in sorted(glob.glob(f'{R}/wip/dishfix/out/pack*.json')):
  for s,ch in json.load(open(p)).items():P.setdefault(s,[]).extend(ch)
F=json.load(open(f'{R}/data/films.json'));miss=[];n=0;kept=0
FOOD=re.compile(r"\b(wings?|fries|corn|ribs?|pies?|cakes?|burgers?|sliders?|tacos?|pizza|pasta|spaghetti|lasagne|noodles?|ramen|rice|curry|stew|soup|chowder|salad|sandwich(es)?|subs?|rolls?|bread|toast|steak|chicken|beef|pork|lamb|fish|prawns?|shrimp|crab|lobster|oysters?|mussels|clams|salmon|tuna|cod|chips|nachos|dip|cheese|eggs?|omelette|pancakes?|waffles?|cookies?|brownies?|pudding|ice cream|sundae|float|shake|milkshake|lemonade|punch|tea|coffee|cocoa|chocolate|tarts?|crumble|cobbler|donuts?|doughnuts?|muffins?|scones?|bagels?|hot ?dogs?|sausages?|meatballs?|meatloaf|dumplings?|bao|buns?|wraps?|quesadillas?|burritos?|enchiladas?|chilli|chili|kebabs?|skewers?|satay|popcorn|pretzels?|crackers?|cupcakes?|fudge|candy|caramel|trifle|custard|jelly|mousse|risotto|gnocchi|ravioli|calamari|antipasto|bruschetta|crostini|canap[ée]s|paella|gumbo|biscuits?|gravy|mash|potato(es)?|wedges|beans|slaw|pickles?|olives|nuts|smoothie|soda|spritz|cocktail|mocktail|cider|juice|sangria|martini|margarita|mojito|beer|ale|wine|whisky|bourbon|rum|gin|vodka|sour|fizz|cooler|latte|mochaccino|parfait|sorbet|gelato|cannoli|churros|flan|pavlova|lamingtons?|scallops|ham|bacon|turkey|duck|goose|venison|tofu|sushi|gyoza|kimchi|pho|laksa|roti|naan|samosas?|falafel|hummus|souvlaki|gyros?|schnitzel|pierogi|goulash|pasties|pasty|jerky|salsa|guacamole|fondue|brisket|roast|grilled|fried|baked|cheesesteaks?|hoagies?|elote|tamales?|quiche|souffl[ée]|crepes?|blinis?|onigiri|udon|karaage|tempura|mezze|charcuterie|crudit[ée]s|fruit|berries|apples?|bananas?|grapes?|melon|mango|dates|figs?|marshmallows?|toffee|lollies|truffles?|macarons?|eclairs?|donut|delight)\b",re.I)
DASH=re.compile('[–—]')
for f in F:
  s=slug(f"{f['title']} ({f['year']})")
  if s not in P:continue
  rp=f'{R}/data/recipes/{s}.json';r2p=f'{R}/data/recipes2/{s}.json'
  rec=json.load(open(rp)) if os.path.exists(rp) else None
  r2=json.load(open(r2p)) if os.path.exists(r2p) else None
  for c in P[s]:
    old,new,note=c['old'],c.get('n') or c['old'],c.get('note')
    if new!=old and FOOD.search(old):
      d0=[d for k in 'smwd' for d in (rec or {}).get(k,[]) if d.get('n')==old]
      txt=(d0[0].get('how','')+' '+' '.join(d0[0].get('shop',[]))).lower() if d0 else ''
      if all(w.lower().rstrip('s') in txt for w in FOOD.findall(old) if isinstance(w,str) and w) or not txt:new=old;kept+=1
    if DASH.search(new+(note or '')):miss.append((s,old,'dash'));continue
    hit=False
    for k in 'SMWK':
      for row in f.get(k,[]):
        if row[0]==old:row[0]=new;hit=True;row[1]=note if note else row[1]
    if rec:
      for k in 'smwd':
        for d in rec.get(k,[]):
          if d.get('n')==old:d['n']=new;d['note']=note if note else d.get('note');hit=True
    if r2:
      for d in r2.get('dishes',[]):
        if d.get('n')==old:d['n']=new
    if hit:n+=1
    else:miss.append((s,old,'not found'))
  if rec:json.dump(rec,open(rp,'w'),ensure_ascii=False,separators=(',',':'))
  if r2:json.dump(r2,open(r2p,'w'),indent=1,ensure_ascii=False)
json.dump(F,open(f'{R}/data/films.json','w'),ensure_ascii=False,separators=(',',':'))
print('changed',n,'names kept (already named the food)',kept,'unmatched',len(miss));[print(' ',m) for m in miss[:30]]
