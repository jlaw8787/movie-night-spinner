import numpy as np
from PIL import Image,ImageFilter,ImageEnhance,ImageDraw
from scipy import ndimage
B=Image.open('un/conv-big.jpg').convert('RGB');W,H=B.size
A=np.asarray(B).astype(np.float32)
out=B.copy()
def fit(im,w,h):
  im=im.convert('RGBA');return im.resize((w,h),Image.LANCZOS)
def glass(img,box,tint=0.82):
  """paste behind window glass: darken a touch, keep the original's long straight grid lines on top"""
  x0,y0,x1,y1=box;w,h=x1-x0,y1-y0
  p=fit(img,w,h);rgb=p.convert('RGB')
  rgb=ImageEnhance.Color(rgb).enhance(0.68);rgb=ImageEnhance.Contrast(rgb).enhance(0.86)
  a=np.asarray(rgb).astype(np.float32);a=a*0.86+np.array([150,165,185])*0.14
  rng=np.random.default_rng(x0*7+y0);a*=1-rng.uniform(0,.06)
  rgb=Image.fromarray(np.clip(a,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
  rgb=ImageEnhance.Brightness(rgb).enhance(tint*0.94)
  # faint reflection from the window
  ref=Image.fromarray(np.asarray(B.crop(box)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
  rgb=Image.blend(rgb,ref,0.2)
  out.paste(rgb,(x0,y0),p.split()[3])
  # grid lines from the original
  L=A[y0:y1,x0:x1].mean(2);hp=L-ndimage.gaussian_filter(L,5)
  m=hp>18
  lines=ndimage.binary_opening(m,np.ones((1,28)))|ndimage.binary_opening(m,np.ones((28,1)))
  lines=ndimage.binary_dilation(lines,iterations=1)
  o=np.asarray(out).copy();reg=o[y0:y1,x0:x1];reg[lines]=A[y0:y1,x0:x1][lines].astype(np.uint8);o[y0:y1,x0:x1]=reg
  return Image.fromarray(o)
post=lambda n:Image.open('post/'+n+'.jpg')
# --- window posters and stickers
jobs=[('post','Ghostbusters_1984_',(1272,534,1372,682)),('post','Jurassic_Park_1993_',(1380,534,1480,682)),
      ('img','parts/hours.png',(1530,620,1640,718)),
      ('post','Back_to_the_Future_1',(1268,700,1378,862)),('post','Terminator_2_Judgmen',(1388,700,1498,862)),('post','Home_Alone_1990_',(1508,700,1618,862)),('post','Speed_1994_',(1626,700,1720,840)),
      ('img','parts/banner.png',(1416,876,1722,996)),
      ('post','Point_Break_1991_',(568,836,724,958)),('post','Clueless_1995_',(456,752,560,900)),
      ('post','The_Mask_1994_',(786,862,876,990)),('post','Pulp_Fiction_1994_',(882,876,970,996)),
      ('img','parts/rewind.png',(1022,590,1220,674)),('post','Toy_Story',(898,688,972,792))]
for kind,n,box in jobs:
  im=post(n) if kind=='post' else Image.open(n)
  if kind=='post':
    x0,y0,x1,y1=box;pw,ph=im.size;s=max((x1-x0)/pw,(y1-y0)/ph);im=im.resize((int(pw*s)+1,int(ph*s)+1));l=(im.width-(x1-x0))//2;t=(im.height-(y1-y0))//2;im=im.crop((l,t,l+x1-x0,t+y1-y0))
  out=glass(im,box)
# --- neon OPEN over the OUVERT sign: dim the old tube first
o=np.asarray(out).astype(np.float32);x0,y0,x1,y1=1505,540,1650,612
reg=o[y0:y1,x0:x1];red=(reg[...,0]>reg[...,1]*1.4)&(reg[...,0]>110)
reg[red]=reg[red]*0.18+np.array([28,18,24])*0.82;o[y0:y1,x0:x1]=reg;out=Image.fromarray(o.astype(np.uint8))
op=fit(Image.open('parts/open.png'),150,70);gl=op.filter(ImageFilter.GaussianBlur(10))
out.paste(gl,(1500,545),gl);out.paste(op,(1500,545),op)
# --- main lightbox: Galaxy Video face
x0,y0,x1,y1=884,170,1994,368;w,h=x1-x0,y1-y0
yy,xx=np.mgrid[0:h,0:w];c=np.exp(-(((xx-w/2)/(w*.62))**2+((yy-h/2)/(h*.9))**2))
face=np.zeros((h,w,3));base=np.array([24,12,46]);hi=np.array([70,36,120])
face=base+(hi-base)*c[...,None]
lg=Image.open('/home/claude/movie-night-spinner/scripts/brand/galaxy-video-wide-clear.png').convert('RGBA')
s=min((w*.9)/lg.width,(h*.86)/lg.height);lg=lg.resize((int(lg.width*s),int(lg.height*s)),Image.LANCZOS)
F=Image.fromarray(face.astype(np.uint8)).convert('RGBA');F.alpha_composite(lg,((w-lg.width)//2,(h-lg.height)//2))
F=F.convert('RGB');F=ImageEnhance.Color(F).enhance(0.8);F=ImageEnhance.Contrast(F).enhance(0.88)
F=F.filter(ImageFilter.GaussianBlur(0.9));F=ImageEnhance.Brightness(F).enhance(1.1)
# backlit unevenness and grime from the original box
orig=np.asarray(B.crop((x0,y0,x1,y1))).astype(np.float32);ol=orig.mean(2);ol=ndimage.gaussian_filter(ol,(70,140));ol=(ol/ol.max())
f=np.asarray(F).astype(np.float32)*(0.72+0.38*ol[...,None])
og=orig.mean(2);fine=og-ndimage.gaussian_filter(og,1.6);fine=np.clip(fine/30,-1,0)
lm=ndimage.binary_dilation(np.abs(og-ndimage.gaussian_filter(og,6))>14,iterations=4);fine[lm]=0
yy3,xx3=np.mgrid[0:h,0:w];band=np.minimum(np.minimum(xx3,w-1-xx3),np.minimum(yy3,h-1-yy3))<30
coarse=np.clip((og-ndimage.gaussian_filter(og,8))/40,-1,1)*band*(~lm|(band))
rs=np.random.default_rng(11);spk=ndimage.gaussian_filter(rs.normal(0,1,(h,w)),1.2);spk=np.clip(-spk*1.6,0,1)*(rs.random((h,w))<.35)
f=f*(1+0.3*fine[...,None]+0.25*coarse[...,None]-0.12*spk[...,None])
yy2,xx2=np.mgrid[0:h,0:w];edge=np.minimum(np.minimum(xx2,w-1-xx2),np.minimum(yy2,h-1-yy2))
f=f*(0.78+0.22*np.clip(edge/26,0,1))[...,None]
f=f*(1-0.16*np.clip((yy2-h*.7)/(h*.3),0,1))[...,None]
f=np.clip(f,0,255).astype(np.uint8);F=Image.fromarray(f)
out.paste(F,(x0,y0))
# glow spill from the lightbox
o=np.asarray(out).astype(np.float32);g=np.zeros_like(o);g[y0:y1,x0:x1]=np.asarray(F).astype(np.float32)
g=ndimage.gaussian_filter(g,(40,40,0))*0.55;o=np.clip(o+g*(1-o/255),0,255);out=Image.fromarray(o.astype(np.uint8))
# --- Pepsi panel: dimmer secondary box
x0,y0,x1,y1=408,174,828,382;p=fit(Image.open('parts/pepsi.png'),x1-x0,y1-y0)
pr=np.asarray(ImageEnhance.Color(ImageEnhance.Contrast(p.convert('RGB')).enhance(.85)).enhance(.78).filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32)
og=np.asarray(B.crop((x0,y0,x1,y1))).astype(np.float32).mean(2);tex=ndimage.gaussian_filter(og,1.5)-ndimage.gaussian_filter(og,6)
pr=pr*0.6+np.random.default_rng(3).normal(0,4,pr.shape[:2])[...,None];pr=np.clip(pr,0,255).astype(np.uint8);out.paste(Image.fromarray(pr),(x0,y0),p.split()[3])
# --- film grain to sit everything in the photo
o=np.asarray(out).astype(np.float32);rng=np.random.default_rng(7);o+=rng.normal(0,3.2,o.shape[:2])[...,None]
out=Image.fromarray(np.clip(o,0,255).astype(np.uint8))
out.save('galaxy-real.jpg',quality=90);out.resize((1200,675),Image.LANCZOS).save('galaxy-real-v.jpg',quality=88)
