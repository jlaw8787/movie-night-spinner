import sys
from PIL import Image, ImageDraw, ImageFont
# pair.py out.png title before1 after1 [before2 after2 ...]
out,title,*imgs=sys.argv[1:]
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
rows=[]
for b,a in zip(imgs[::2],imgs[1::2]):
    B,A=Image.open(b).convert('RGB'),Image.open(a).convert('RGB')
    h=760;B=B.resize((int(B.width*h/B.height),h));A=A.resize((int(A.width*h/A.height),h))
    r=Image.new('RGB',(B.width+A.width+60,h+50),'white');d=ImageDraw.Draw(r)
    d.text((20,8),'BEFORE',fill='#b00',font=F);d.text((B.width+40,8),'AFTER',fill='#070',font=F)
    r.paste(B,(20,45));r.paste(A,(B.width+40,45));rows.append(r)
W=max(r.width for r in rows);H=sum(r.height for r in rows)+60
o=Image.new('RGB',(W,H),'white');ImageDraw.Draw(o).text((20,14),title,fill='black',font=F);y=60
for r in rows:o.paste(r,(0,y));y+=r.height
o.save(out,quality=85)
