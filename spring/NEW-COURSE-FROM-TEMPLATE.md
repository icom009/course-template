# 이 프로젝트를 템플릿 삼아 새 코스 만들기 (Quick Start)

> 「Spring 기초 과정」 사이트의 **디자인·런타임·컨벤션·에이전트 시스템**을 그대로 빌려서
> JavaScript / Python / React 등 **다른 주제의 코스 사이트**를 빠르게 띄우기 위한 가이드입니다.
>
> 이 문서는 **빠른 시작 (Quick Start)** 관점입니다. 더 깊은 방법론은 [`CURRICULUM-AUTHORING-GUIDE.md`](./CURRICULUM-AUTHORING-GUIDE.md) 에 있습니다.
>
> 작성: 2026-05-01

---

## 1. 누가 이 문서를 보는가

다음에 해당하면 끝까지 읽으세요.

- 이 Spring 기초 사이트와 **비슷한 형태의 사이트**를 다른 과목으로 만들고 싶은 강사
- 4 종 자료 (slides / examples / labs / handouts) + 슬라이드 + 기호 시스템 (◇▣◆★) + 데이터 흐름 컨벤션 (흐름도·미니맵·Checkpoint) **그대로 차용**하고 싶은 사람
- 본 프로젝트가 검증한 **6 개 영구 에이전트** + `js/infographics.js` + `js/screenshot.js` 런타임을 재활용하고 싶은 사람
- 「방법론 전체」보다는 **30 분 안에 빈 디렉토리에서 사이트가 뜨는 단계**를 보고 싶은 사람

다음에 해당하면 이 문서가 아닌 다른 문서를 보세요.

- **방법론 전체**가 궁금하다 → [`CURRICULUM-AUTHORING-GUIDE.md`](./CURRICULUM-AUTHORING-GUIDE.md)
- **에이전트 시스템 자체**의 설계가 궁금하다 → [`PLUGINS-AND-AGENTS.md`](./PLUGINS-AND-AGENTS.md)
- **이 프로젝트가 어떻게 만들어졌는지**의 실제 케이스가 궁금하다 → [`프로젝트-기록.md`](./프로젝트-기록.md)
- **코드 표준 (패키지·테이블·도메인 필드)** 이 궁금하다 → [`CODE-STANDARD.md`](./CODE-STANDARD.md) (Spring 도메인 종속)

---

## 2. 이 프로젝트의 어느 부분이 「템플릿」 인가

새 코스를 만들 때 **갈아끼울 것**과 **그대로 쓸 것**을 먼저 분리합니다.

| 영역 | 코스 종속 (갈아끼울 것) | 템플릿 (그대로 쓸 것) |
|------|-----------------------|----------------------|
| **콘텐츠** | `slides/*.html`, `examples/*.html`, `labs/*.html`, `handouts/*.html`, `자료/` | (콘텐츠는 100% 갈아끼움) |
| **디자인** | `slides/css/custom.css` 의 part-N 색상 토큰, `index.html` 의 hero 카피·코스명 | 4 종 CSS 의 카드 그리드·다크/라이트 분리·`@media print` 라이트 핸드아웃·reveal.js night |
| **시각** | `js/infographics.js` 의 12~16 개 SVG (코스별 도메인 인포그래픽) | **등록 패턴**, `PALETTE` 상수, `data-infographic` 마운트 시스템 |
| **JS 런타임** | `js/screenshot.js` 의 admin 비밀번호 (현재 `smhrd`) | 「◀ 메인」 플로팅 버튼, 관리자 모드(`?admin`), 드래그-드롭 업로드, FileReader 미리보기 |
| **컨벤션 (CLAUDE.md)** | Part 약어 표, 비유 사전, 학습 환경(JDK·Tomcat 등), 마일스톤 진화 지도 | **4 단계 차시 구조** (불편→도구→적용→Before/After), **데이터 흐름 3 종**, **기호 체계** (◇▣◆★), **버전 뱃지** (v0~v∞), 「차시 번호·비전공자 노출 금지」 정책 |
| **코드 표준** | `CODE-STANDARD.md` (코스마다 도메인·스택 다름 — Java 패키지·테이블·필드명 전부 갈아끼움) | **점진적 빌드업 원칙**, **버전별 ALTER/REFACTOR 진화 지도** 패턴 |
| **에이전트** | `.claude/agents/*.md` 안의 비유 사전 인용, Part 약어 인용 | 6 에이전트 역할 분담 (content-author, visual-designer, convention-auditor, flow-verifier, documentation-curator, layout-verifier) |
| **검증** | (특별한 코스 종속 없음) | `scripts/check-overflow.js` (reveal.js 720px 기준 휴리스틱 — 그대로 사용 가능) |
| **운영 문서** | `프로젝트-기록.md` (이 프로젝트만의 타임라인), `index.html` 의 hero·footer 카피 | `CURRICULUM-AUTHORING-GUIDE.md`, `PLUGINS-AND-AGENTS.md`, 본 문서 (`NEW-COURSE-FROM-TEMPLATE.md`) — 다른 강사용 메타 가이드 |

> **요점**: 「콘텐츠 + 도메인 색상 + 비유 사전 + 인포그래픽 12개」 만 갈아끼우고, 나머지는 그대로 복사해서 쓴다.

---

## 3. 빠른 시작 (Quick Start) — 30 분 내

다음을 그대로 따라 하면 30 분 내로 새 코스의 빈 사이트가 뜹니다. (예시: `javascript-basic`)

```bash
# ─────────────────────────────────────────────────────────────
# 1. 이 프로젝트 통째로 복사
# ─────────────────────────────────────────────────────────────
cp -r /Users/jungyu/Desktop/study/spring /Users/jungyu/Desktop/study/javascript-basic
cd /Users/jungyu/Desktop/study/javascript-basic

# ─────────────────────────────────────────────────────────────
# 2. 콘텐츠 비우기 (디자인·런타임은 유지)
# ─────────────────────────────────────────────────────────────
rm -f slides/*.html examples/*.html labs/*.html handouts/*.html
# 단, slides/template.html 은 보일러플레이트라 보존
git checkout slides/template.html 2>/dev/null || true

rm -rf 자료/*           # 강사 사전 작성 docx — 새 코스의 사전 자료로 교체
rm -rf images/*         # 사진은 새 코스의 비유에 맞게 재수집

# ─────────────────────────────────────────────────────────────
# 3. 운영 문서 비우기 (메타 가이드만 남기기)
# ─────────────────────────────────────────────────────────────
rm 프로젝트-기록.md      # 새 코스의 타임라인은 0 부터 시작
rm CODE-STANDARD.md     # 코스마다 도메인 스택이 다름 — 새로 작성
# CLAUDE.md, CURRICULUM-AUTHORING-GUIDE.md, PLUGINS-AND-AGENTS.md, COURSE-TEMPLATE-GUIDE.md, 본 문서는 보존

# ─────────────────────────────────────────────────────────────
# 4. 인포그래픽 비우되 등록 패턴은 보존
# ─────────────────────────────────────────────────────────────
# js/infographics.js 의 SVG 등록부만 비우고 PALETTE 상수와 마운트 함수는 유지
#   (아래 §7 참고)

# ─────────────────────────────────────────────────────────────
# 5. CLAUDE.md 갱신 — 코스명·산출물·도구·Part 약어·비유 사전 교체
#   (자세한 변경 위치는 §4 의 체크리스트)
# ─────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────
# 6. index.html 갱신 — 코스명, hero 카피, Part-N 색상·라인업, 카드 비우기
# ─────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────
# 7. 라이브 검증
# ─────────────────────────────────────────────────────────────
python3 -m http.server 8000
open http://localhost:8000/
```

**시간 견적**:

| 단계 | 소요 |
|------|-----|
| 1 ~ 4 (디렉토리 정리) | 5 분 |
| 5 ~ 6 (CLAUDE.md / index.html 갱신) | 20 분 |
| 7 (라이브 검증) | 5 분 |
| **합계** | **약 30 분** |

이 시점에서 **빈 카드 그리드 + 다크 hero + 기존 4 종 CSS** 가 동작하는 사이트가 뜹니다. 이후 §4 ~ §8 따라 콘텐츠 채우기.

---

## 4. 코스 컨셉 정의 (1 시간)

이 단계가 가장 중요합니다. **코스 컨셉이 모호하면 v0 → v∞ 진화 지도가 안 나오고**, 그러면 차시도 안 나옵니다.

### 체크리스트

- [ ] **코스 이름** (예: 「JavaScript 기초」, 「Python 기초」, 「React 기초」)
- [ ] **학생 대상** *(단, 학생 화면에 노출 금지 — 강사 내부 포지셔닝일 뿐)*
- [ ] **마무리 산출물** 한 줄 (예: 「Todo 앱」, 「실시간 채팅 앱」, 「공공데이터 분석 노트북」)
- [ ] **제외 주제** (후속 과정으로 보낼 것들)
- [ ] **Part 분할** (4~6 개)
- [ ] **버전 진화 지도** (v0 → v∞ — §6 참조)
- [ ] **Part 약어 + 색상 클래스** (예: `intro`/파랑, `dom`/초록, `event`/보라, `ajax`/오렌지, `app`/빨강, `wrap`/틸)
- [ ] **비유 사전** (§5 참조)
- [ ] **학습 환경** (런타임·IDE·DB·라이브러리 버전)

이 결정을 그대로 `CLAUDE.md` 에 박아 넣습니다.

### CLAUDE.md 에서 갈아끼울 위치

| 섹션 | 변경 내용 |
|------|----------|
| `## 프로젝트 개요` | 코스명, 마무리 산출물, 제외 주제 |
| `## 핵심 교수법: 이터레이션` 표 | v0 ~ v∞ 마일스톤 행 모두 교체 |
| `## 차시 식별: ... (Part 약어 표)` | Part 약어·색상 모두 교체 |
| `### 핵심 비유 사전` | 비유 사전 모두 교체 (§5) |
| `## 학습 환경` 표 | JDK·Tomcat·MySQL → 새 스택 (Node.js·npm·Vite 등) |

### 예시: JavaScript 기초

```
코스 이름:        JavaScript 기초
학생 대상:        프론트엔드 입문자 (학생 화면에 노출 금지)
마무리 산출물:    Todo 앱 (로컬스토리지 + 라우터)
제외 주제:        TypeScript, Webpack 깊이, SSR, 테스트 라이브러리
Part 분할:       intro (4) / lang (8) / dom (8) / event (8) / ajax (6) / wrap (4)
런타임:          Node.js + 브라우저 (빌드 X)
```

---

## 5. 비유 사전 만들기 (코스별 핵심 자산)

이 프로젝트의 **「카페 = 서버」, 「식당 = MVC」, 「택시 뒷좌석 = IoC」** 처럼,
새 코스에도 **일관된 비유 사전**이 필요합니다.

### 원칙 (CLAUDE.md 의 「비유 사용 원칙」 그대로 차용)

비유는 **본문 보조 설명에서만 사용**합니다. 다음에는 절대 등장하면 안 됩니다.

- ❌ 코스 이름·부제
- ❌ Part 라벨·tagline
- ❌ 카드 제목, 슬라이드/예제/실습/핸드아웃 h1·h2·h3
- ❌ 학습 목표 항목, 체크리스트 항목

대신 비유는 다음 자리에서만:

- ✅ 본문 단락 안의 보조 설명 (`<p>변수는 상자에 해당합니다.</p>`)
- ✅ `.diagram` / `.new-tool` / `.box` 안의 풀어쓰기
- ✅ 슬라이드의 강사 노트
- ✅ 핸드아웃의 「용어 ↔ 비유」 매핑 표

### 코스별 예시

#### JavaScript 기초

| 개념 | 비유 |
|------|------|
| 변수 | **상자** (이름표 붙은 상자) |
| 함수 | **자판기** (입력 → 출력) |
| 객체 | **서랍장** (key 로 꺼내는 서랍) |
| 배열 | **줄** (번호표로 줄 선 사람들) |
| 콜백 | **택배 도착 시 전화해줘** |
| 이벤트 루프 | **순서 대기표** |
| Promise | **약속 영수증** |
| DOM | **레고 트리** |
| 이벤트 | **벨 누르기** |

#### Python 기초

| 개념 | 비유 |
|------|------|
| 들여쓰기 | **문단 나누기** |
| 리스트 | **장바구니** |
| 딕셔너리 | **사전** (단어 → 뜻) |
| 클래스 | **설계도** |
| 인스턴스 | **제품** |
| 모듈 | **공구상자** |
| 가상환경 | **작업실 분리** |
| pip | **부품 주문** |

#### React 기초

| 개념 | 비유 |
|------|------|
| 컴포넌트 | **레고 블록** |
| props | **택배** (위에서 아래로) |
| state | **일기장** (각자 자기 것) |
| hook | **리모컨** |
| useEffect | **창문 열림 / 닫힘 알림** |
| key | **이름표** |
| Context | **방송** |
| 리렌더 | **새로고침 그림** |

> 비유 사전을 **CLAUDE.md** 의 `### 핵심 비유 사전` 섹션에 그대로 박아 넣으면 모든 차시 작성 에이전트가 일관되게 사용합니다.

---

## 6. 진화 지도 짜기 (코스의 척추)

이 프로젝트의 v0 (Hello Servlet) → v∞ (디버깅 워크숍) 처럼,
새 코스도 **단계별 마일스톤**이 필요합니다.

### 규칙

1. v0 = **가장 단순한 첫 화면** (Hello world 수준)
2. 중간 어딘가에 **「의도적으로 어렵게」** 단계가 있어야 (v2 = 평문 비밀번호처럼) 이후 도구의 가치가 보임
3. v∞ = **흐름도 역추적 워크숍** — 새 기능 X, 「내가 지금까지 뭘 만들었나」 복기
4. 5~12 개 단계 권장

### 예시 — JavaScript 기초

| 버전 | 차시 | 산출물 |
|------|------|------|
| v0 | Hello console.log | 첫 한 줄 출력 |
| v1 | 변수와 연산 | 계산기 v1 (전역 변수만) |
| v2 | 함수와 스코프 | 계산기 v2 (전역 오염 — 의도적 불편) |
| v3 | 모듈 분리 | 계산기 v3 (스코프 격리) |
| v4 | DOM 첫 조작 | 클릭 카운터 v1 |
| v5 | 이벤트 위임 | Todo 앱 v1 (Create + Read) |
| v6 | 배열 메서드 | Todo 앱 v2 (filter / sort) |
| v7 | localStorage | Todo 앱 v3 (영속화) |
| v8 | fetch + 비동기 | Todo 앱 v4 (서버 연동) |
| v9 | 라우터 | Todo 앱 v5 (해시 기반 라우팅) |
| v∞ | Todo 앱 디버깅 워크숍 | 흐름도 역추적 |

### 예시 — Python 기초

| 버전 | 차시 | 산출물 |
|------|------|------|
| v0 | Hello print | 첫 한 줄 |
| v1 | 변수와 입력 | 가위바위보 v1 |
| v2 | 조건문·반복 | 숫자 맞추기 |
| v3 | 함수 분리 | CLI 가계부 v1 |
| v4 | 리스트·딕셔너리 | CLI 가계부 v2 |
| v5 | 파일 IO | CLI 가계부 v3 (CSV 저장) |
| v6 | 모듈 분리 | CLI 가계부 v4 |
| v7 | 예외 처리 | CLI 가계부 v5 (안전) |
| v8 | 외부 라이브러리 | Pandas 통계 |
| v∞ | 가계부 디버깅 워크숍 | 흐름도 역추적 |

---

## 7. 디렉토리 구조 (그대로)

```
new-course-root/
├── index.html                      # 메인 (Part 그리드 + 차시 카드) — 갈아끼움
├── CLAUDE.md                       # AI 도구용 컨벤션 — 갈아끼움
├── CURRICULUM-AUTHORING-GUIDE.md   # 방법론 — 그대로
├── PLUGINS-AND-AGENTS.md           # 에이전트 시스템 — 그대로 (약어만 갈아끼움)
├── NEW-COURSE-FROM-TEMPLATE.md     # 본 문서 — 그대로 (참고용으로만)
├── 자료/                            # 강사 사전 자료 (docx 등) — 갈아끼움
├── slides/
│   ├── css/custom.css              # 색상 토큰만 갈아끼움
│   ├── template.html               # 보일러플레이트 — 그대로
│   └── {part약어}-{키워드}.html      # 차시별
├── examples/css/example.css        # 그대로 (색상만)
├── labs/css/lab.css                # 그대로 (색상만)
├── handouts/css/print.css          # 그대로 (라이트 + @media print)
├── js/
│   ├── infographics.js             # 등록 패턴 그대로, SVG 12~16개 갈아끼움
│   └── screenshot.js               # 그대로 (admin 비밀번호만 갈아끼움)
├── images/                         # Unsplash CC0 — 갈아끼움
├── scripts/check-overflow.js       # reveal.js 720px 검출 — 그대로
└── .claude/agents/                 # 6 에이전트 — 그대로 (비유 사전 인용만 갈아끼움)
```

---

## 8. 첫 차시 한 장 만들기 (예시)

이 패턴은 **모든 차시 슬라이드의 보일러플레이트** 입니다. 4 단계 구조 + 흐름도 + 인포그래픽 자리 모두 포함.

```html
<!-- slides/{part약어}-{키워드}.html -->

<!-- 1) 타이틀 -->
<section>
  <span class="session-glyph">◇ PART · ABBR</span>
  <h1>차시 제목 (비유 X, 기술 용어 O)</h1>
</section>

<!-- 2) 학습 목표 -->
<section>
  <h2>학습 목표</h2>
  <ul>
    <li class="fragment fade-up">자기 말로 설명할 수 있다</li>
    <li class="fragment fade-up">코드로 한 번 만들 수 있다</li>
  </ul>
</section>

<!-- 3) ⚠️ 이전 버전의 불편 -->
<section>
  <h2>⚠️ 이전 버전의 불편</h2>
  <div class="pain-point">
    <p>v_n-1_ 까지의 코드는 어디가 아팠는가?</p>
  </div>
</section>

<!-- 4) 🛠️ 새 도구 -->
<section>
  <h2>🛠️ 새 도구</h2>
  <div class="new-tool">
    <p>비유 한 줄: "X 는 Y 에 해당합니다."</p>
    <img src="../images/{비유사진}.jpg" alt="" />
  </div>
</section>

<!-- 5) 💻 적용 -->
<section>
  <h2>💻 적용</h2>
  <pre><code class="language-javascript">// 코드 12~15줄</code></pre>
</section>

<!-- 6) 🔄 Before / After -->
<section>
  <h2>🔄 Before / After</h2>
  <div class="before-after">
    <div class="columns">
      <div class="col"><h3>Before</h3><pre>...</pre></div>
      <div class="col"><h3>After</h3><pre>...</pre></div>
    </div>
  </div>
</section>

<!-- 7) 📊 한 그림 정리 (인포그래픽 마운트) -->
<section>
  <h2>📊 한 그림 정리</h2>
  <div data-infographic="my-infographic"></div>
</section>

<!-- 8) 흐름도 (마지막 직전 — 고정 위치) -->
<section class="flow-diagram">
  <h2>이번 차시의 데이터 흐름</h2>
  <pre>
[입력] → [함수] → <span class="new">[새 단계]</span> → [출력]
                       ↑
                 이번 차시에서 새로 생긴 칸
  </pre>
</section>

<!-- 9) 정리 -->
<section>
  <h2>정리</h2>
  <div class="summary">
    <ul>
      <li>핵심 1</li>
      <li>핵심 2</li>
    </ul>
    <p class="next-hint">다음 차시: ...</p>
  </div>
</section>

<!-- 공통 JS -->
<script src="../js/infographics.js"></script>
<script src="../js/screenshot.js"></script>
```

---

## 9. 에이전트 시스템 그대로 쓰기

`.claude/agents/` 의 6 개 에이전트는 **거의 코스 독립적**입니다. 그대로 복사한 다음 다음만 갈아끼웁니다.

| 에이전트 | 갈아끼울 부분 |
|---------|--------------|
| `content-author.md` | 비유 사전 인용 (CLAUDE.md 참조 경로만) |
| `visual-designer.md` | PALETTE 색상 상수 / 인포그래픽 도메인 (다음 12~16개를 새로 등록할 것) |
| `convention-auditor.md` | Part 약어 표, 「비전공자」 같은 코스별 금칙어 |
| `flow-verifier.md` | 거의 그대로 (흐름도·미니맵·Checkpoint 검증) |
| `documentation-curator.md` | 거의 그대로 |
| `layout-verifier.md` | 그대로 (`scripts/check-overflow.js` 호출) |

자세한 호출 시퀀스는 [`PLUGINS-AND-AGENTS.md`](./PLUGINS-AND-AGENTS.md) §4 ~ §5 참조.

### 에이전트 호출 권장 순서

```
정렬 단계
  └─ documentation-curator: CLAUDE.md 초안

첫 차시 충실 작성
  ├─ content-author: 4 종 자료 작성
  ├─ visual-designer: 인포그래픽 1~3개 등록
  ├─ flow-verifier: 흐름도/미니맵/Checkpoint 점검
  └─ convention-auditor: 차시 번호·비유 제목 노출 검사

양산 라운드
  ├─ content-author × N
  └─ layout-verifier: 720px 오버플로 일괄 검출

마일스톤 보강
  ├─ content-author: 350~450 줄로 재작성
  └─ visual-designer: 인포그래픽 일괄 주입

마무리
  └─ documentation-curator: 프로젝트-기록.md 마무리
```

---

## 10. 자주 빠뜨리는 것 (체크리스트)

이 프로젝트가 5 시간 동안 만들면서 **실제로 겪은 함정**들. 새 코스에서도 같은 실수를 반복하지 않도록.

### 학생 화면 노출 금지

- [ ] **차시 번호** 학생에게 노출 금지 — `Session 23`, `23/64` 같은 라벨 절대 X
- [ ] **「비전공자 / 초보자 / 왕초보」** 같은 학생 분류 단어 — 강사 내부 포지셔닝일 뿐, 학생 화면에 절대 X (이 프로젝트의 가장 큰 교훈)
- [ ] **비유가 제목·라벨에** — `<h1>카페 비유로 시작</h1>` 같은 형태 X. 본문 보조 설명에서만 OK
- [ ] **학습 목표가 비유로** — `"카페 비유로 설명할 수 있다"` X → `"자기 말로 설명할 수 있다"` O

### 구조

- [ ] **4 단계 구조 누락** — 모든 차시에 「불편 → 도구 → 적용 → Before/After」 빠짐 없이
- [ ] **흐름도 슬라이드 위치** — 마지막 직전 고정 (`정리` 직전)
- [ ] **미니맵 누락** — examples / labs **첫 페이지**에 무조건
- [ ] **Checkpoint 누락** — labs 의 **모든 Step 끝**에 무조건. 「F12 / 콘솔 / 로그 / DB 어디를 볼지」 명시

### 콘텐츠 깊이

- [ ] **점진적 빌드업** — 완성형 한 번에 X, 의도적 불편(v2) → 새 도구로 다시 만듦(v3) 패턴
- [ ] **자주 만나는 오류 슬라이드** — 마일스톤 차시 후반에 2~3 개
- [ ] **「다음 차시: ...」** 한 줄 — 차시 끝에 흐름이 끊기지 않게

### 시각

- [ ] **인포그래픽 등장 횟수** — 차시당 최소 3 회
- [ ] **사진 vs SVG** — 비유 도입엔 사진, 추상 구조엔 SVG
- [ ] **마일스톤 슬라이드 분량** — 18~22 슬라이드 / 350~450 줄

---

## 11. 세부 방법론은 어디 있는가

본 문서는 「**빠른 시작**」 관점입니다. 더 깊은 자료는 다음을 참고하세요.

| 문서 | 다루는 범위 |
|------|-----------|
| [`CURRICULUM-AUTHORING-GUIDE.md`](./CURRICULUM-AUTHORING-GUIDE.md) | **방법론 전체** — 3 핵심 원칙, 10 단계 워크플로, 5 가지 함정, CX 체크리스트 |
| [`PLUGINS-AND-AGENTS.md`](./PLUGINS-AND-AGENTS.md) | **에이전트 시스템** — 6 에이전트 역할 분담, 호출 시퀀스, 외부 도구 |
| [`COURSE-TEMPLATE-GUIDE.md`](./COURSE-TEMPLATE-GUIDE.md) | **디자인 스펙 원본** — 본 사이트의 시각 템플릿 (estcamp.site 의 AWS 과정에서 차용) |
| [`CODE-STANDARD.md`](./CODE-STANDARD.md) | **코스 코드 표준** — Spring 도메인 종속이라 새 코스는 다시 작성 (단, **점진적 빌드업** 원칙은 그대로 차용) |
| [`프로젝트-기록.md`](./프로젝트-기록.md) | **이 프로젝트의 실제 케이스 스터디** — 빈 디렉토리에서 5 시간 만에 만든 타임라인 (의사결정의 「왜」) |
| [`CLAUDE.md`](./CLAUDE.md) | **현재 코스의 컨벤션** — 새 코스에서는 이 파일의 구조만 차용하고 내용은 갈아끼움 |

---

## 부록 A — 시간 견적 표 (전체 작업)

다른 강사가 이 가이드를 처음 읽고 「전체를 며칠 안에 띄울 것인가」 견적할 때 참고.

| 단계 | 작업 | 소요 시간 |
|------|------|---------|
| **0. Quick Start** (§3) | 디렉토리 복사 / 콘텐츠 비우기 / CLAUDE.md 갱신 | 30 분 |
| **1. 코스 컨셉 정의** (§4) | 산출물·Part·진화 지도·비유 사전 결정 | 1 시간 |
| **2. 첫 차시 충실 작성** (§8) | 4 종 자료 톤·시각·깊이 굳히기 | 1~2 시간 |
| **3. 양산 라운드** | 나머지 차시 일괄 (Python `_gen.py` 또는 에이전트 다회 호출) | 2~3 시간 |
| **4. 마일스톤·전환점 보강** | 9~12 개 핵심 차시 350~450 줄로 재작성 | 2~3 시간 |
| **5. 시각 자료 일괄 주입** | 인포그래픽 12~16 개 + 사진 5~10 장 + 슬라이드 일괄 마운트 | 1~2 시간 |
| **6. 검증** | `python3 -m http.server` + `scripts/check-overflow.js` + 모바일 점검 | 30 분 ~ 1 시간 |
| **합계** | | **약 8~13 시간** (1~2 일) |

> 본 Spring 기초 프로젝트는 **이 패턴을 처음 시도하면서 5 시간** 걸렸지만, 패턴이 정해진 이후는 더 빠를 수 있다.

---

## 부록 B — 30 분 빠른 시작 한 화면 요약

```
1. cp -r spring/ new-course/        # 통째로 복사
2. cd new-course/
3. rm -rf {slides,examples,labs,handouts}/*.html 자료/* images/*
4. rm 프로젝트-기록.md CODE-STANDARD.md
5. CLAUDE.md 갈아끼움 (코스명·진화지도·Part약어·비유사전·학습환경)
6. index.html 갈아끼움 (코스명·hero·Part-N 색상·카드 비우기)
7. python3 -m http.server 8000  →  open http://localhost:8000
```

이 7 단계가 끝나면 **그대로 동작하는 빈 사이트**가 뜹니다. 이후 §4~§8 따라 콘텐츠 채우기.

---

> 본 가이드는 [`CURRICULUM-AUTHORING-GUIDE.md`](./CURRICULUM-AUTHORING-GUIDE.md) 의 방법론 전체를
> **「빠른 시작」 관점**으로 다이제스트 한 문서입니다.
> 깊이 있는 의사결정 / 함정 / 케이스 스터디는 원본 가이드와 [`프로젝트-기록.md`](./프로젝트-기록.md) 를 참고하세요.
