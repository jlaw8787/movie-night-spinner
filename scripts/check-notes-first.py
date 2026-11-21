import json,re,glob,collections,sys
R=__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'..')
dump={}
for f in sys.argv[1:]: dump.update(json.load(open(f)))
def stem(w):
    w=w.lower().strip("'");w=re.sub(r"'s$",'',w)
    for suf in ('ing','ed','es','s'):
        if len(w)>4 and w.endswith(suf): return w[:-len(suf)]
    return w
FOOD=set()
for p in glob.glob(R+'/data/recipes2/*.json'):
    for x in json.load(open(p)).get('dishes',[]):
        for i in x.get('ingredients',[]):
            it=re.split(r'[,(]',str(i.get('item','')))[0].strip().lower()
            ws=re.findall(r"[a-z]+",it)
            if ws: FOOD.add(stem(ws[-1]))
            if len(ws)>1: FOOD.add(stem(ws[-2]+' '+ws[-1]))
EXTRA="""fried grilled roasted baked toasted braised smoked crumbed battered glazed stewed poached seared steamed pickled whipped iced chilled frozen
creamy crisp crunchy sticky spiced salted sweet savoury cake pie tart roll rolls bun buns burger sandwich toastie toast soup stew salad sauce dip chips fries
cocktail shake float punch tea coffee beer wine juice soda lemonade cordial slushy sundae pudding biscuit cookie slice scone pastry dumpling noodle rice
curry taco wrap skewer slider fritter croquette nugget wing rib steak chop roast mash gravy custard cream jelly trifle mousse brownie muffin doughnut
pancake waffle omelette bagel pretzel popcorn nachos dog sausage ham bacon cheese egg eggs fish prawn prawns chicken beef pork lamb duck cocoa milk
shot spritz martini margarita mojito fizz sour toddy cider lager ale stout bitter mocktail smoothie""".split()
for w in EXTRA: FOOD.add(stem(w))
rows=[]
for fid,v in dump.items():
    if not v or v.get('err') or v.get('fmt')=='card': continue
    for it in v['list']:
        note=it.get('note') or ''
        if not note: continue
        first=re.split(r'(?<=[.!?:])\s+',note.strip())[0]
        ws=[stem(w) for w in re.findall(r"[A-Za-z']+",first)][:int(__import__('os').environ.get('LEAD','4'))]
        lc=note[:1].islower()
        food=any(w in FOOD for w in ws)
        if lc or not food:
            rows.append((fid,v['fmt'],it['n'],note,'lower' if lc else 'filmfirst'))
c=collections.Counter(r[4] for r in rows);print(c,len(set(r[0] for r in rows)),'films')
json.dump(rows,open('/tmp/notes.json','w'),ensure_ascii=False,indent=0)
for r in rows[:int(__import__('os').environ.get('SHOW','30'))]: print(r)
