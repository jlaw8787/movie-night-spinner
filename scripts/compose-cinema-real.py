import numpy as np,cv2
from PIL import Image
from scipy import ndimage
from skimage.morphology import skeletonize
S=1.2
I=cv2.imread('orph.jpg').astype(np.float32);H,W=I.shape[:2]
q=lambda pts:(np.array(pts,np.float32)*S)
# ---------- 1. rebuild the lettered middle of the board from clean panels to its left
board=q([(12,235),(1372,478),(1382,688),(8,560)])
RW,RH=2400,420
Mr=cv2.getPerspectiveTransform(board,np.float32([[0,0],[RW,0],[RW,RH],[0,RH]]))
R=cv2.warpPerspective(I,Mr,(RW,RH))
prof=R.mean((0,2));prof=prof-cv2.GaussianBlur(prof.reshape(1,-1),(0,0),40).ravel()
best=max(range(120,260),key=lambda p:np.dot(prof[:-p],prof[p:]))
x0,x1=int(RW*.33),int(RW*.80)
f=24
for xs in range(x0,x1,best):
  xe=min(xs+best,x1);w_=xe-xs
  src=R[:,xs-2*best:xs-2*best+w_].copy()
  bl=np.ones((1,w_,1),np.float32)
  if xs==x0:bl[0,:f,0]=np.linspace(0,1,f)
  if xe==x1:bl[0,-f:,0]=np.linspace(1,0,f)
  R[:,xs:xe]=R[:,xs:xe]*(1-bl)+src*bl
Mi=np.linalg.inv(Mr);back=cv2.warpPerspective(R,Mi,(W,H))
bm=np.zeros((H,W),np.uint8);cv2.fillPoly(bm,[board.astype(np.int32)],255)
bm=cv2.erode(bm,np.ones((5,5),np.uint8))
mm=cv2.GaussianBlur(bm.astype(np.float32)/255,(0,0),1.5)[...,None]
clean=(I*(1-mm)+back*mm)
print('panel period',best)
# ---------- 2. new letters on the board, in perspective
L=cv2.imread('parts/board.png',cv2.IMREAD_GRAYSCALE).astype(np.float32)/255.0
ink=1-L;h,w=ink.shape
# letters sit in the middle of the board: inset quad
def lerp(a,b,t):return a+(b-a)*t
TL,TR,BR,BL=board
tl=lerp(lerp(TL,TR,.12),lerp(BL,BR,.12),.14);tr=lerp(lerp(TL,TR,.9),lerp(BL,BR,.9),.14)
br=lerp(lerp(TL,TR,.9),lerp(BL,BR,.9),.88);bl=lerp(lerp(TL,TR,.12),lerp(BL,BR,.12),.88)
M=cv2.getPerspectiveTransform(np.float32([[0,0],[w,0],[w,h],[0,h]]),np.float32([tl,tr,br,bl]))
wk=cv2.GaussianBlur(cv2.warpPerspective(ink,M,(W,H)),(0,0),1.1)
wk=wk*(0.84+0.16*cv2.GaussianBlur(np.random.default_rng(9).random((H,W)).astype(np.float32),(0,0),14)*2.2).clip(0,1)
out=clean.astype(np.float32)
col=np.array([38,34,35],np.float32)
BLANK=__import__('os').environ.get('BLANK')=='1'
if not BLANK: out=out*(1-wk[...,None]*0.9)+np.minimum(col,out)*wk[...,None]*0.9
import json;json.dump({'quad':[list(map(float,p)) for p in (tl,tr,br,bl)],'W':W,'H':H},open('board-quad.json','w'))
# ---------- 3. crest: ORPHEUM out, MOVIE NIGHT bulbs in
crest=q([(640,178),(1024,250),(1024,350),(640,284)])
cm=np.zeros((H,W),np.uint8);cv2.fillPoly(cm,[crest.astype(np.int32)],255)
# dark fill sampled from crest background around the letters
ring=cv2.dilate(cm,np.ones((25,25),np.uint8))-cm
bgc=np.median(out[ring>0].reshape(-1,3)[out[ring>0].reshape(-1,3).mean(1)<70],axis=0)
noise=np.random.default_rng(1).normal(0,3,(H,W,1))
out=np.where(cm[...,None]>0,bgc+noise,out)
# soften the patch edge
blur=cv2.GaussianBlur(out,(0,0),2);em=cv2.GaussianBlur((cm>0).astype(np.float32),(0,0),3)
edge=(em>0.05)&(em<0.95);out[edge]=blur[edge]
C=cv2.imread('parts/crest.png',cv2.IMREAD_GRAYSCALE)<128;ch,cw=C.shape
Mc=cv2.getPerspectiveTransform(np.float32([[0,0],[cw,0],[cw,ch],[0,ch]]),q([(578,192),(1060,282),(1060,346),(578,258)]))
cw_=cv2.warpPerspective(C.astype(np.uint8)*255,Mc,(W,H))>127
# letter faces: dark gold, then bulbs along the skeleton
face=cv2.GaussianBlur(cw_.astype(np.float32),(0,0),1.0)
out=out*(1-face[...,None]*0.8)+np.array([40,95,140],np.float32)*face[...,None]*0.8
sk=skeletonize(cw_);ys,xs=np.nonzero(sk)
order=np.lexsort((ys,xs));pts=list(zip(xs[order],ys[order]))
bulbs=[];
for x,y in pts:
  if all((x-bx)**2+(y-by)**2>13**2 for bx,by in bulbs[-60:]):bulbs.append((x,y))
glow=np.zeros((H,W),np.float32);core=np.zeros((H,W),np.float32)
rb=np.random.default_rng(42);lvl=rb.uniform(.62,1.0,len(bulbs));dead=rb.choice(len(bulbs),3,replace=False);lvl[dead]=0.08
for (x,y),v in zip(bulbs,lvl):
  cv2.circle(core,(int(x),int(y)),4,float(v),-1)
glow=cv2.GaussianBlur(core,(0,0),9)*2.2+cv2.GaussianBlur(core,(0,0),3)*1.2
warm=np.array([150,220,255],np.float32)
out=out+warm*np.clip(glow,0,1.6)[...,None]*0.75
cc=cv2.GaussianBlur(core,(0,0),1.1);hot=np.array([200,238,255],np.float32)
out=out*(1-np.clip(cc,0,1)[...,None])+hot*np.clip(cc,0,1)[...,None]
# camera softness over the new sign so it matches the photo
cm2=cv2.dilate(cv2.fillPoly(np.zeros((H,W),np.uint8),[q([(560,175),(1080,265),(1080,380),(560,280)]).astype(np.int32)],255),np.ones((15,15),np.uint8))
sb=cv2.GaussianBlur(out,(0,0),1.0);mk=cv2.GaussianBlur(cm2.astype(np.float32)/255,(0,0),6)[...,None];out=out*(1-mk)+sb*mk
# grain
out+=np.random.default_rng(5).normal(0,2.5,(H,W,1))
fn='cinema-blank.png' if BLANK else 'cinema-real.jpg'
cv2.imwrite(fn.replace('.png','.jpg') if False else fn,np.clip(out,0,255).astype(np.uint8))
cv2.imwrite('cinema-real-v.jpg' if not BLANK else 'cinema-blank-v.jpg',cv2.resize(np.clip(out,0,255).astype(np.uint8),(1600,1200)),[cv2.IMWRITE_JPEG_QUALITY,85])
print('bulbs',len(bulbs))
