# One-off clean of two faint marks in the palace hero (darkest right column, near the bottom rail), 12 Nov 2026. Already applied; kept for the record. Usage: python3 scripts/palace-marks.py <repo>
import cv2,numpy as np,os,sys
from PIL import Image
import scipy.ndimage as nd
src=sys.argv[1]
boxes=[(606,612,1457,1480),(614,620,1467,1480)]  # y0,y1,x0,x1 in the 1774px master
for name in ['palace','palace-1400','palace-1000']:
    p=f'{src}/assets/hero/{name}.webp';im=np.asarray(Image.open(p).convert('RGB'));h,w=im.shape[:2];k=w/1774
    g=cv2.cvtColor(im,cv2.COLOR_RGB2GRAY).astype(float);med=nd.median_filter(g,size=max(5,int(9*k)|1))
    m=np.zeros((h,w),np.uint8)
    for y0,y1,x0,x1 in boxes:
        Y0,Y1,X0,X1=int(y0*k)-1,int(np.ceil(y1*k))+1,int(x0*k)-1,int(np.ceil(x1*k))+1
        sub=(g[Y0:Y1,X0:X1]-med[Y0:Y1,X0:X1])>4
        m[Y0:Y1,X0:X1]|=sub.astype(np.uint8)*255
    m=cv2.dilate(m,np.ones((3,3),np.uint8))
    out=cv2.inpaint(cv2.cvtColor(im,cv2.COLOR_RGB2BGR),m,3,cv2.INPAINT_TELEA)
    out=cv2.cvtColor(out,cv2.COLOR_BGR2RGB)
    sz=os.path.getsize(p);best=None
    for q in range(70,96,2):
        Image.fromarray(out).save('/tmp/work/_t.webp','WEBP',quality=q,method=6)
        if os.path.getsize('/tmp/work/_t.webp')<=sz*1.05:best=q
    Image.fromarray(out).save(p,'WEBP',quality=best or 80,method=6)
    print(name,(w,h),'masked px',int((m>0).sum()),'q',best,sz,'->',os.path.getsize(p))
