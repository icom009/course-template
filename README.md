# course-template

[![Live Site](https://img.shields.io/badge/live-icom009.github.io%2Fcourse--template-f59e0b?style=flat-square)](https://icom009.github.io/course-template/)
[![Made with Claude Code](https://img.shields.io/badge/made%20with-Claude%20Code-d97757?style=flat-square)](https://docs.anthropic.com/en/docs/claude-code/overview)
[![Use this template](https://img.shields.io/badge/use%20this-template-2ea44f?style=flat-square&logo=github)](https://github.com/icom009/course-template/generate)
![Korean](https://img.shields.io/badge/lang-한국어-blue?style=flat-square)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#라이선스)

🌐 **사이트 보기 →** https://icom009.github.io/course-template/

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

## 받는 방법 (5 가지 길)

본인 환경에 맞춰 골라 받으세요. 강의 사이트로 키울 거면 **E (권장)** 또는 **C** — 자기 GitHub 계정에 자기 repo 가 생기므로 그대로 push 해서 본인 강의 사이트로 발전시킬 수 있습니다.

### ⭐ E. Use this template — 가장 매끄러움

GitHub 페이지의 초록색 **["Use this template"](https://github.com/icom009/course-template/generate)** 버튼 → 본인 계정에 깨끗한 새 repo 생성 (history 분리됨).

```bash
git clone https://github.com/<본인>/<새-repo-이름>.git
cd <새-repo-이름>
```

### C. Fork → clone — 자기 GitHub 으로 가져가기

GitHub 페이지의 **Fork** 버튼 → 본인 계정에 fork (upstream 으로 연결됨).

```bash
git clone https://github.com/<본인>/course-template.git
cd course-template
```

> **E vs C** — E 는 깨끗한 분리(완전히 새 강의), C 는 upstream 연결(본 repo 에 PR 보내고 싶을 때).

### A. 표준 git clone — 로컬에서만 둘러보기

```bash
git clone https://github.com/icom009/course-template.git
cd course-template
```

자기 GitHub 계정이 없거나 push 할 곳이 따로 있을 때.

### B. Shallow clone — 더 빠르고 가볍게

```bash
git clone --depth 1 https://github.com/icom009/course-template.git
cd course-template
```

A 와 동일하지만 커밋 히스토리 없이 받음 (용량 절약).

### D. ZIP 다운로드 — git 없이

[![main.zip](https://img.shields.io/badge/⬇-main.zip-blue?style=flat-square)](https://github.com/icom009/course-template/archive/refs/heads/main.zip)

```
https://github.com/icom009/course-template/archive/refs/heads/main.zip
```

git 안 깔린 환경. 압축 풀면 `course-template-main/` 폴더 — `.git` 없으니 나중에 push 하려면 `git init` 다시 필요.

## 받은 다음 (5 가지 모두 공통)

```bash
# 1. starter 키트를 새 디렉토리로 복제
cp -r starter/ ~/my-course/
cd ~/my-course

# 2. CLAUDE.md, CODE-STANDARD.md, index.html 의 TODO 마커 채우기

# 3. 로컬 미리보기
python3 -m http.server 8000
# → http://localhost:8000

# 4. Claude Code 켜기
claude
# → 이후는 for-instructors.html 의 4~6단계 따라가기
```

### 결과물만 둘러보고 싶다면

위 A·B·D 중 하나로 받은 뒤:

```bash
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
