"""Generate original, replaceable transparent PNG placeholder layers. Requires Pillow."""
from PIL import Image, ImageDraw
from pathlib import Path
import math
out = Path(__file__).resolve().parents[1] / 'public/objects'
out.mkdir(parents=True, exist_ok=True)
for kind in ['orbit','fold','bloom','signal','frame']:
 for layer in ['back','front']:
  im=Image.new('RGBA',(600,600)); d=ImageDraw.Draw(im)
  if kind=='orbit':
   if layer=='back':
    d.ellipse((165,100,435,485),fill='#ff714e'); d.ellipse((180,110,410,465),fill='#ff8a62')
   else:
    for i in range(13):
     box=(45+i*3,215+i,555-i*3,380-i)
     d.arc(box,0,180,fill='#3430b8',width=5)
    d.ellipse((251,165,284,198),fill='#ffe6b3')
  elif kind=='fold':
   if layer=='back':
    d.polygon([(90,235),(330,90),(525,205),(275,360)],fill='#b1bcfc'); d.polygon([(90,235),(275,360),(275,505),(90,375)],fill='#575bc0')
   else:
    d.polygon([(275,360),(525,205),(525,350),(275,505)],fill='#8489e6')
    for y in range(235,345,15): d.line((300,y+130,500,y+15),fill='#c6ccff',width=3)
  elif kind=='bloom':
   if layer=='back':
    for j in range(8):
     a=j*math.pi/4; x=300+125*math.cos(a); y=300+125*math.sin(a)
     d.ellipse((x-85,y-85,x+85,y+85),fill='#d2e963',outline='#adc63d',width=3)
   else:
    d.ellipse((222,222,378,378),fill='#4e6230'); d.ellipse((245,238,320,313),fill='#e9f5b0')
  elif kind=='signal':
   if layer=='back':
    d.rounded_rectangle((120,100,480,480),radius=48,fill='#e4a4cc'); d.rounded_rectangle((145,125,455,375),radius=25,fill='#492941')
   else:
    pts=[(165+x,250+55*math.sin(x/24)) for x in range(270)]
    d.line(pts,fill='#e9ed8e',width=9); d.ellipse((390,410,425,445),fill='#492941'); d.line((165,425,335,425),fill='#a96394',width=7)
  else:
   if layer=='back':
    d.polygon([(100,170),(395,90),(505,400),(200,500)],fill='#4d9bce'); d.polygon([(140,195),(375,132),(460,375),(220,453)],fill='#f4f1e9')
   else:
    d.polygon([(220,453),(460,375),(375,132),(355,170),(418,350),(240,410)],fill='#286f9d'); d.ellipse((245,235,360,350),fill='#ff9b59')
  im.save(out/f'{kind}-{layer}.png')
