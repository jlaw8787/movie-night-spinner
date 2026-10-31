"""Galaxy Video horizontal logo: planet icon beside the wordmark, cut from the master logo.

The master stacks GALAXY over the planet, so the hidden lower half of the planet is
rebuilt from a shading fit of the visible part, and the planet behind the letters is
replaced with background. Run from the repo root: python3 scripts/compose-wide-logo.py
"""
import numpy as np
from PIL import Image, ImageFilter
SP='scratchpad/'  # folder holding gv-master.png
def arr(i): return np.asarray(i).astype(np.float32)/255
def img(a): return Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8))
def gblur(a,r): return arr(img(a).filter(ImageFilter.GaussianBlur(r)))
M=arr(Image.open(SP+'gv-master.png').convert('RGB'))
Hm,Wm=M.shape[:2]
r,g,b=M[...,0],M[...,1],M[...,2]; lum=M.mean(2)
CX,CY,R=758.9,306.4,241.0
yy,xx=np.mgrid[0:Hm,0:Wm].astype(np.float32)
dist=np.hypot(xx-CX,yy-CY)
teal=(b>r+0.15)&(g>r+0.1)&(b>0.3)

# letters of GALAXY: yellow/orange faces and the purple extrude, grown to take in their outlines
face=(r>0.55)&(r>b+0.25)
extr=(lum>0.2)&(b>g+0.08)&(r>g)&~teal
letters=(face|extr)&(yy>425)
letters=arr(img(letters.astype(np.float32)).filter(ImageFilter.MaxFilter(13)))>0.5

# background plate: normalised blur of pixels that are plain background
plain=(lum<0.24)&~teal&(dist>R+22)&~letters&~((r>0.3)&(r>b))
w=plain.astype(np.float32)
bgp=np.dstack([gblur(M[...,c]*w,40) for c in range(3)])/np.maximum(gblur(w,40),1e-3)[...,None]
bgp=np.clip(bgp,0,1)

# planet shading model from visible teal fill
inside=dist<R-6
vis=teal&inside&(yy<420)
nx=(xx-CX)/R; ny=(yy-CY)/R; nz=np.sqrt(np.clip(1-nx**2-ny**2,0,1))
F=lambda m: np.c_[np.ones(m.sum()),nx[m],ny[m],nz[m],nx[m]**2,ny[m]**2,nx[m]*ny[m],nz[m]**2]
coef=np.linalg.lstsq(F(vis),M[vis],rcond=None)[0]
allin=dist<R
pl=np.zeros_like(M); pl[allin]=F(allin)@coef
pl+=np.random.default_rng(3).normal(0,0.012,pl.shape)*allin[...,None]
pl=gblur(pl,0.8)
# outline colour from the top of the planet
ring=(dist>R+1)&(dist<R+7)&(yy<150)
oc=M[ring].mean(0); print('outline',oc,'coef ok')

# ---- icon: original above the cut, finished planet below it
YC=432
icon=M.copy()
below=yy>=YC
blend=np.clip((yy-YC+40)/40,0,1)[...,None]   # crossfade into the finished planet
plan_region=dist<R+7
syn=bgp.copy()
syn=np.where((dist<R)[...,None],pl,syn)
syn=np.where(((dist>=R)&(dist<R+7))[...,None],oc,syn)
icon=np.where(plan_region[...,None]&(yy>YC-40)[...,None],icon*(1-blend)+syn*blend,icon)
# foreground: planet with outline, tape (brown) and cassette (neutral greys) above the cut
sat=M.max(2)-M.min(2)
brown=(r>g+0.04)&(g>=b-0.02)&(r>0.12)
neutral=(sat<0.07)&(lum>0.04)
purple=(b>g+0.05)&(r>g-0.01)&(lum<0.5)
diff=np.abs(M-bgp).max(2)>0.075
fg=plan_region|(((r>b-0.035)|neutral|((lum>0.45)&~(b>r+0.06)))&(lum>0.03)&(yy<YC)&(dist<R+260)&~(letters&(yy>410)))
fg=arr(img(fg.astype(np.float32)).filter(ImageFilter.ModeFilter(5)))>0.5
from scipy import ndimage
lab,n=ndimage.label(fg); sizes=ndimage.sum(fg,lab,range(1,n+1))
fg=np.isin(lab,1+np.nonzero(sizes>3000)[0])
fg=arr(img(fg.astype(np.float32)).filter(ImageFilter.MaxFilter(3)))
fa=gblur(fg,1.6)[...,None]
# fresh background: flat dark purple with a soft glow behind the planet, like the master
gl=np.exp(-((dist-R*0.6)/(R*0.9)).clip(0)**2)
glow_col=M[(dist>R+30)&(dist<R+70)&(yy<300)&(xx<CX)].mean(0)
base=np.median(M[900:1000,40:200].reshape(-1,3),0)
bgn=base+(glow_col-base)[None,None,:]*gl[...,None]
bgn+=np.random.default_rng(5).normal(0,0.006,bgn.shape)
icon=np.where((~plan_region&(yy>=YC-2))[...,None],bgn,icon)
icon=icon*fa+bgn*(1-fa)
ic=icon[20:560,300:1260]

# ---- wordmark: planet and tape behind the letters swapped for background
word=M.copy()
behind=(dist<R+12)&(yy>=425)&(yy<600)&~letters
word=np.where(behind[...,None],bgp,word)
# soften the seam where letters meet the new background
wd=word[428:980,100:1440]

img(ic).save(SP+'icon.png'); img(wd).save(SP+'word.png')

# ---- lockup
s=1.0
ih,iw=ic.shape[:2]; wh,ww=wd.shape[:2]
GAP=-40
H=max(ih,wh)+40; W=iw+ww+GAP+40
bgc=np.median(M[900:1000,40:200].reshape(-1,3),0)
can=np.ones((H,W,3),np.float32)*bgc
def place(c,p,x,y,fe=50):
    h,w=p.shape[:2]
    py,px=np.mgrid[0:h,0:w].astype(np.float32)
    e=np.minimum.reduce([px,w-1-px,py,h-1-py])
    a=np.clip(e/fe,0,1)[...,None]
    c[y:y+h,x:x+w]=c[y:y+h,x:x+w]*(1-a)+p*a
place(can,ic,20,(H-ih)//2)
place(can,wd,20+iw+GAP,(H-wh)//2+6)
out=img(can); out.save(SP+'lockup.png'); print(out.size)

# ---- export: rounded panel, two widths
REPO=''
from PIL import ImageDraw
H_,W_=can.shape[:2]
m=Image.new('L',(W_*4,H_*4),0); ImageDraw.Draw(m).rounded_rectangle((0,0,W_*4-1,H_*4-1),40*4,fill=255)
al=arr(m.resize((W_,H_),Image.LANCZOS))
rgba=Image.fromarray((np.dstack([np.clip(can,0,1),al])*255).astype(np.uint8),'RGBA')
for w in (600,1200):
    rgba.resize((w,round(w*H_/W_)),Image.LANCZOS).save(REPO+f'assets/brand/galaxy-video-wide-{w}.webp','WEBP',quality=88)
print('exported')
