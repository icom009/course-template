#!/bin/bash
# pptx → PDF → 12장씩 격자 이미지 (육안 검수용). 사용: qa_grid.sh <deck.pptx> <출력폴더>
set -e
D="$1"; O="$2"; mkdir -p "$O"; cp "$D" "$O/deck.pptx"; cd "$O"
rm -f deck.pdf p-*.jpg grid*.jpg
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
timeout 300 soffice -env:UserInstallation=file://$O/.lo_profile --headless --convert-to pdf deck.pptx >/dev/null 2>&1
pdftoppm -jpeg -r ${DPI:-40} deck.pdf p
python3 - <<'PY'
from PIL import Image, ImageDraw
import glob
fs=sorted(glob.glob('p-*.jpg'))
for g in range(0,len(fs),12):
    ims=[Image.open(f) for f in fs[g:g+12]]; w,h=ims[0].size
    M=Image.new('RGB',(w*3+20,h*4+30),'white')
    for i,im in enumerate(ims):
        x=(i%3)*(w+10); y=(i//3)*(h+10); M.paste(im,(x,y)); ImageDraw.Draw(M).text((x+5,y+5),str(g+i+1),fill='yellow')
    M.save(f'grid{g//12+1}.jpg',quality=80)
print(len(fs),'장')
PY
