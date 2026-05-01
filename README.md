# course-template

Claude Code 와 함께 **강의용 정적 웹사이트**를 만드는 작업 흐름과, 그 흐름의 결과로 만들어진 한 가지 예시(`spring/` — Spring 기초 과정) 가 들어 있는 저장소입니다.

## 무엇이 들어 있나

```
course-template/
├─ index.html                # 진입 페이지 (이 README 의 HTML 버전)
├─ for-instructors.html      # 강사용 6단계 메뉴얼 (CLI 설치 → 첫 차시까지)
├─ behind-the-scenes.html    # 실제 대화·삽질·토큰 사용량 솔직한 회고
├─ starter/                  # 새 코스 시작용 빈 골격 (복제해서 사용)
│  ├─ README.md
│  ├─ CLAUDE.md              # Claude Code 가이드 (TODO 마커 채우기)
│  ├─ CODE-STANDARD.md
│  ├─ index.html             # Hero + 6 Part 빈 골격
│  ├─ scripts/check-overflow.js
│  ├─ .claude/agents/        # 6개 영구 에이전트 정의
│  ├─ slides/template.html
│  ├─ slides/css/, examples/css/, labs/css/, handouts/css/
│  └─ js/screenshot.js, infographics.js
└─ spring/                   # 만들어진 결과물 예시 (Spring 기초)
   ├─ index.html             # 60+ 차시 카드 그리드
   ├─ slides/, examples/, labs/, handouts/
   ├─ images/, js/
   ├─ CLAUDE.md, CODE-STANDARD.md, 프로젝트-기록.md
   ├─ AGENTS.md, NEW-COURSE-FROM-TEMPLATE.md
   ├─ CURRICULUM-AUTHORING-GUIDE.md, PLUGINS-AND-AGENTS.md
   └─ ...
```

## 빠른 시작

### 새 코스를 만들고 싶다면

```bash
# 1. 이 저장소 클론
git clone https://github.com/<USERNAME>/course-template.git
cd course-template

# 2. starter 키트를 새 디렉토리로 복제
cp -r starter/ ~/my-course/
cd ~/my-course

# 3. CLAUDE.md, CODE-STANDARD.md, index.html 의 TODO 마커 채우기

# 4. 로컬 미리보기
python3 -m http.server 8000
# → http://localhost:8000

# 5. Claude Code 켜기
claude
# → 이후는 for-instructors.html 의 4~6단계 따라가기
```

### 결과물만 둘러보고 싶다면

```bash
git clone https://github.com/<USERNAME>/course-template.git
cd course-template
python3 -m http.server 8000
# → http://localhost:8000/spring/
```

## 핵심 컨벤션 (다른 코스에도 그대로 적용 가능)

- **이터레이션 패턴**: 토픽 단위가 아니라 「하나의 프로젝트가 v0 → v∞ 로 진화하는 여정」
- **4단계 차시 구조**: 불편 → 도구 → 적용 → Before/After
- **데이터 흐름 3종**: 흐름도 슬라이드 / 미니맵 / Checkpoint
- **차시 식별 기호**: ◇ 개념 / ▣ 실습 / ◆ 전환점 / ★ 마일스톤 (차시 번호 노출 금지)
- **비유 사용 원칙**: 본문 안의 보조 설명에서만 (제목·라벨에는 절대 X)

자세한 내용은 [`for-instructors.html`](for-instructors.html) 또는 [`spring/CURRICULUM-AUTHORING-GUIDE.md`](spring/CURRICULUM-AUTHORING-GUIDE.md) 참고.

## 영구 에이전트 6종

`.claude/agents/` (또는 `starter/.claude/agents/`) 에 정의된 Claude Code 서브에이전트 6개:

| 에이전트 | 역할 |
|---------|------|
| `content-author` | 차시 본문 4단계 구조 작성 |
| `visual-designer` | 인포그래픽·이미지 결정·삽입 |
| `convention-auditor` | 컨벤션 준수 검증 (read-only) |
| `flow-verifier` | 데이터 흐름 3종 점검 (read-only) |
| `documentation-curator` | 운영 문서 갱신 |
| `layout-verifier` | 슬라이드 오버플로 검출 (read-only) |

자세한 내용: [`spring/AGENTS.md`](spring/AGENTS.md)

## 토큰 사용량 (실제 기록)

`spring/` 사이트 한 채를 만드는 데 약 **1,400,000 토큰** (Opus 4.7 1M 컨텍스트, /compact 2~3회). 단계별 분포는 [`behind-the-scenes.html`](behind-the-scenes.html) 또는 [`spring/프로젝트-기록.md`](spring/프로젝트-기록.md) 참고.

## 라이선스

이 저장소는 자유롭게 복제·수정·배포 가능합니다. 상업적 이용도 가능합니다. 다만:

- `spring/자료/` 는 원본 강사의 사전 자료(docx 등)이라 **공개 저장소에서 제외**되어 있습니다 (`.gitignore`).
- `images/` 폴더의 사진은 Unsplash CC0 이미지입니다.

## 기여

- 메뉴얼·시작 키트의 개선 PR 환영
- 이 흐름으로 만든 다른 코스 사이트 사례를 issue 로 공유 환영

## 참고

- [Claude Code (Anthropic)](https://docs.anthropic.com/en/docs/claude-code/overview)
- [reveal.js](https://revealjs.com)
