# Starter Kit — 코스 사이트 최소 시작 묶음

이 폴더는 **다른 강사가 자기만의 코스 사이트를 만들 때 시작점으로 쓰는 키트**입니다. 본 저장소(Spring 기초 과정)에서 코스 고유의 콘텐츠를 걷어낸 **빈 골격만** 담겨 있습니다.

## 무엇이 들어 있나

```
starter/
├─ README.md                  # 이 문서
├─ CLAUDE.md                  # Claude Code 가이드 — 코스명·버전 표·비유 사전 비어있음
├─ CODE-STANDARD.md           # 코드 표기 규약 — 도메인 자리만 비어있음
├─ index.html                 # Hero + 6 Part 그리드 골격 (카드 자리는 주석)
├─ scripts/
│  └─ check-overflow.js       # 슬라이드 오버플로 검사기 (그대로 사용)
├─ .claude/agents/            # 6개 에이전트 정의 (Claude Code 가 자동 인식)
├─ slides/
│  ├─ template.html           # 4단계 구조 빈 슬라이드
│  └─ css/custom.css          # reveal.js night 덮어쓰기 (그대로)
├─ examples/css/example.css   # 읽기 자료 다크 테마 (그대로)
├─ labs/css/lab.css           # 실습 다크 테마 (그대로)
├─ handouts/css/print.css     # 인쇄용 라이트 테마 (그대로)
└─ js/
   ├─ screenshot.js           # 메인 버튼 + 스크린샷 런타임 (그대로)
   └─ infographics.js         # PALETTE + REGISTRY 만 — 인포그래픽은 직접 추가
```

## 사용 법

```bash
# 1) 이 폴더를 새 코스 디렉토리로 복제
cp -r starter/ ~/my-course/
cd ~/my-course

# 2) 코스 고유 정보 채우기
#    - CLAUDE.md     : 코스 이름 / 버전 진화 표 / Part 약어 / 비유 사전
#    - CODE-STANDARD.md : 코스 도메인 (예: 게시판 / 쇼핑몰 / 일정 관리)
#    - index.html    : Hero 카피 + 각 Part 카드

# 3) 로컬 미리보기
python3 -m http.server 8000
# → http://localhost:8000
```

## 다음 단계

`for-instructors.html` 의 **4~6단계** 를 따라가면 첫 차시(`slides/template.html` 복제 → 4단계 구조 채우기 → `index.html` 카드 추가) 까지 손쉽게 완성됩니다.

## 채워 넣을 자리 표시

템플릿 파일 안에서 강사가 갈아끼울 부분은 다음 마커로 표시되어 있습니다:

| 마커 | 의미 |
|------|------|
| `<!-- TODO: ... -->` | HTML 안의 채울 자리 |
| `// TODO: ...` | JS 안의 채울 자리 |
| `[ ... ]` | 마크다운 안의 채울 자리 (예: `[코스 이름]`) |

전체 검색으로 `TODO` 만 잡으면 채워야 할 자리가 모두 모입니다:

```bash
grep -rn "TODO" .
```

## 보존되는 원칙 (코스가 달라져도 유지)

- **차시 번호 학생 노출 금지** — 기호(◇▣◆★) + 버전 뱃지(v0~v∞) 만
- **4단계 구조** — 불편 → 새 도구 → 적용 → Before/After
- **데이터 흐름 3종** — 흐름도 슬라이드 / 미니맵 / Checkpoint
- **비유는 본문 안에서만** — 코스명·Part·카드·섹션 제목·학습 목표 사용 금지
- **자료 4종 형제 디렉토리** — slides / examples / labs / handouts

자세한 규약은 `CLAUDE.md` 참고.
