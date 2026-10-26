"""PDF export check for library menus, run against the local preview server (python3 -m http.server 8795 from the repo root).
Usage: python3 wip/genre/lib/pdfcheck.py "Film (Year)" ["Film (Year)" ...]
For each film: screenshots each menu face in the app, exports the PDF with the app's own Save PDF button, rasterises the menu pages,
and writes wip/genre/proofs/_pdf/<slug>.png = app faces (top row) over PDF pages (bottom row). Prints a blank-photo warning when
a PDF page region that holds a photo in the app comes out flat (one colour). Look at every sheet: the PDF must match the app."""
import asyncio,os,sys,re,subprocess,glob
from urllib.parse import quote
from playwright.async_api import async_playwright
from PIL import Image,ImageStat
R='/home/claude/polish';OUT=f'{R}/wip/genre/proofs/_pdf';os.makedirs(OUT,exist_ok=True)
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
async def one(b,film):
  s=slug(film);ctx=await b.new_context(viewport={'width':1400,'height':1000},accept_downloads=True);pg=await ctx.new_page()
  try:
    await pg.goto('http://localhost:8795/?film='+quote(film));await pg.wait_for_timeout(7000)
    await pg.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
    faces=await pg.query_selector_all('#preview .fx-face');app=[]
    for i,f in enumerate(faces):
      p=f'{OUT}/{s}-app{i}.png';await f.screenshot(path=p);app.append(p)
    boxes=await pg.evaluate("[...document.querySelectorAll('#preview .fx-face')].map(f=>{const fr=f.getBoundingClientRect();return [...f.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.width*r.height>fr.width*fr.height*0.06&&getComputedStyle(i).visibility!=='hidden'}).map(i=>{const r=i.getBoundingClientRect();return [(r.left-fr.left)/fr.width,(r.top-fr.top)/fr.height,r.width/fr.width,r.height/fr.height]})})")
    async with pg.expect_download(timeout=120000) as d:await pg.click('#pdf')
    pdf=f'{OUT}/{s}.pdf';await (await d.value).save_as(pdf)
    for old in glob.glob(f'{OUT}/{s}-pdf-*.png'):os.remove(old)
    subprocess.run(['pdftoppm','-r','50','-png','-l',str(len(faces)),pdf,f'{OUT}/{s}-pdf'],check=True)
    pages=sorted(glob.glob(f'{OUT}/{s}-pdf-*.png'))
    warn=[]
    for i,(pp,bx) in enumerate(zip(pages,boxes)):
      im=Image.open(pp).convert('RGB')
      for (x,y,w,h) in bx:
        crop=im.crop((int(x*im.width),int(y*im.height),int((x+w)*im.width),int((y+h)*im.height)))
        if crop.width>4 and crop.height>4 and max(ImageStat.Stat(crop).stddev)<6:warn.append(f'page {i+1}: photo at {int(x*100)}%,{int(y*100)}% is blank in the PDF')
    h=420;ims=[Image.open(p).convert('RGB') for p in app];pims=[Image.open(p).convert('RGB') for p in pages]
    sc=lambda im:im.resize((max(1,int(im.width*h/im.height)),h))
    ims=[sc(i) for i in ims];pims=[sc(i) for i in pims]
    W=max(sum(i.width+10 for i in ims),sum(i.width+10 for i in pims));sheet=Image.new('RGB',(W,2*h+10),'white')
    x=0
    for i in ims:sheet.paste(i,(x,0));x+=i.width+10
    x=0
    for i in pims:sheet.paste(i,(x,h+10));x+=i.width+10
    sheet.save(f'{OUT}/{s}.png');print(film,'OK' if not warn else 'WARN '+'; '.join(warn),f'{OUT}/{s}.png')
  except Exception as e:print(film,'ERROR',str(e)[:120])
  await ctx.close()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(proxy={'server':os.environ.get('HTTPS_PROXY',''),'bypass':'localhost,127.0.0.1'})
    sem=asyncio.Semaphore(4)
    async def g(f):
      async with sem:await one(b,f)
    await asyncio.gather(*[g(f) for f in sys.argv[1:]]);await b.close()
asyncio.run(main())
