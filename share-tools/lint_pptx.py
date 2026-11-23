#!/usr/bin/env python3
"""배포 pptx 어투·노트 검사 — 제목 ~다 금지 · 부제목 합쇼체 · 노트 개조식(구어체 금지) · 빈 노트.
사용: python3 lint_pptx.py out/xxx.pptx   (위반 0 이면 종료 코드 0)"""
import re, sys
from pptx import Presentation
SPOKEN = re.compile(r"(볼게요|봅시다|해요|세요\.|죠[.?]|거예요|겁니다|습니다\.)\s*$")
bad = []
for i, s in enumerate(Presentation(sys.argv[1]).slides, 1):
    get = lambda n: next((sh.text_frame.text.strip() for sh in s.shapes if sh.name == n), None)
    t, sub = get("title"), get("subtitle")
    if t and re.search(r"(다|다\.)$", t): bad.append(f"{i}장 제목이 ~다: {t}")
    if sub and not sub.endswith("니다"): bad.append(f"{i}장 부제목이 합쇼체 아님: {sub}")
    for sh in s.shapes:
        if sh.name == "card-title" and re.search(r"다[.!]?$", sh.text_frame.text.strip()):
            bad.append(f"{i}장 카드 제목이 ~다: {sh.text_frame.text.strip()}")
    notes = s.notes_slide.notes_text_frame.text.strip()
    if not notes: bad.append(f"{i}장 노트 비어 있음")
    for line in notes.split("\n\n[답]")[0].split("\n"):
        if line.strip() and SPOKEN.search(line): bad.append(f"{i}장 노트 구어체: {line.strip()}")
print("\n".join(bad) or "위반 0"); sys.exit(1 if bad else 0)
