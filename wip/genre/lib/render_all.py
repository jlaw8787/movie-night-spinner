"""Render every library film through the harness (no site overlays), compose all faces into one JPG per film,
then contact sheets per format (12 films each). Usage: python3 render_all.py [format ...]
Out: wip/genre/proofs/_all/<format>/<slug>.jpg and wip/genre/proofs/_sheets/<format>-<n>.jpg"""
import asyncio,os,sys,json,re,io
from urllib.parse import quote
from PIL import Image,ImageDraw,ImageFont
from playwright.async_api import async_playwright
R='/home/claude/polish';A=json.load(open(f'{R}/data/film-format.json'));only=set(sys.argv[1:])
films=[k for k,v in A.items() if not only or v['format'] in only]
if os.environ.get('FILMS'): W=set(json.load(open(os.environ['FILMS']))); films=[k for k in films if k in W]
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
async def worker(b,q):
  c=await b.new_context(viewport={'width':1500,'height':1200},device_scale_factor=1)
  while q:
    film=q.pop();fm=A[film]['format'];d=f'{R}/wip/genre/proofs/_all/{fm}';os.makedirs(d,exist_ok=True)
    pg=await c.new_page()
    try:
      await pg.goto(f'http://localhost:8795/wip/genre/lib/harness.html?format={fm}&film={quote(film)}',timeout=30000)
      await pg.wait_for_selector('body[data-ready="1"]',timeout=25000);await pg.evaluate('document.fonts.ready');await pg.wait_for_timeout(1800)
      ims=[Image.open(io.BytesIO(await el.screenshot())).convert('RGB') for el in await pg.query_selector_all('.face')]
      h=max(i.height for i in ims);row=Image.new('RGB',(sum(i.width for i in ims)+16*(len(ims)-1),h),(200,196,188));x=0
      for i in ims: row.paste(i,(x,0));x+=i.width+16
      row.thumbnail((1600,1100));row.save(f'{d}/{slug(film)}.jpg',quality=80)
    except Exception as e: print('FAIL',film,str(e)[:80])
    await pg.close()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    q=films[:];await asyncio.gather(*[worker(b,q) for _ in range(6)]);await b.close()
  f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22);os.makedirs(f'{R}/wip/genre/proofs/_sheets',exist_ok=True)
  by={}
  for k in films: by.setdefault(A[k]['format'],[]).append(k)
  for fm,ks in by.items():
    ks.sort()
    for n in range(0,len(ks),12):
      ch=ks[n:n+12];W,H=800,560;S=Image.new('RGB',(3*W,4*(H+40)),(236,233,226));dr=ImageDraw.Draw(S)
      for i,k in enumerate(ch):
        p=f'{R}/wip/genre/proofs/_all/{fm}/{slug(k)}.jpg'
        if not os.path.exists(p):continue
        t=Image.open(p);t.thumbnail((W-12,H-6));x=(i%3)*W+6;y=(i//3)*(H+40);S.paste(t,(x,y+3))
        dr.text((x,y+H+6),f"{k[:46]} | {A[k]['era']} {A[k]['tone']}",fill=(20,20,20),font=f)
      S.save(f'{R}/wip/genre/proofs/_sheets/{fm}-{n//12+1}.jpg',quality=78)
  print('rendered',len(films))
asyncio.run(main())
