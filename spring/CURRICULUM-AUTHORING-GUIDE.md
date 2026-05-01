# 커리큘럼 저작 가이드 (Curriculum Authoring Guide)

> 이 문서는 **다른 주제로 비슷한 교육 사이트를 만들고 싶은 강사·교안 제작자**를 위한 방법론 가이드입니다.
> 「Spring 기초 과정」 저장소에서 검증된 패턴을 그대로 복제할 수 있도록, 이론보다는 **복사해서 바로 쓰는 형태**로 정리했습니다.

---

## 1. 이 가이드의 대상

다음에 해당한다면 이 가이드를 끝까지 읽고 그대로 따라하세요.

- **JavaScript / Python / Java / Docker / React / 데이터분석** 등 임의 주제로 한국어 교육 사이트를 만들고 싶은 강사
- **비전공자 또는 입문자**를 가르치는 사람 — 학생이 막히는 순간을 줄여야 한다
- **여러 차시(20~70개)** 분량의 콘텐츠를 **일관된 시각·구조**로 양산하고 싶은 사람
- 정적 HTML + CDN 만으로 빠르게 사이트를 띄우고 싶은 사람 (빌드 시스템·프레임워크 부담 X)
- **Claude Code** (또는 비슷한 AI 페어 프로그래밍 도구) 와 함께 5~8 시간 안에 사이트를 완성하고 싶은 사람

다음에 해당한다면 이 가이드는 **맞지 않습니다**.

- LMS (Moodle, Canvas) 처럼 진도/평가/사용자 관리가 필요한 경우
- 동영상 강의 중심 (이 가이드는 슬라이드 + 실습 가이드 + 핸드아웃 텍스트 자료에 최적)
- 단발성 1~3 차시 콘텐츠 (4 종 자료 × 차시 양산 구조가 과함)

---

## 2. 3 가지 핵심 원칙

이 세 가지는 **차시 하나하나의 효과**가 아니라, **사이트 전체를 관통하는 학습 경험**을 만든다.

### 원칙 1 — 이터레이션 패턴 (v0 → v∞)

차시는 「**독립된 토픽**」이 아니라 **하나의 프로젝트가 단계적으로 진화하는 한 단계**다.

```
v0    Hello World      ← 가장 단순한 형태
v1    DB 첫 연동       ← 데이터가 들어오기 시작
v2    원시 인증        ← 의도적으로 어렵게 (불편 체험)
v3    안전 인증        ← 새 도구로 다시 만든다
...
v∞    디버깅 워크숍    ← 마무리
```

같은 화면을 **의도적으로 다시 만들면서**, 새 도구가 왜 좋은지 학생이 직접 체감하게 한다.

### 원칙 2 — 4 단계 차시 구조

모든 차시는 다음 네 박자로 짠다. 차시가 아무리 작아도 **불편 → 도구 → 적용 → 비교** 의 흐름은 빠지지 않는다.

```
1. ⚠️ 이전 버전의 불편     (.pain-point) — "어디가 아팠는가" 체감
2. 🛠️ 새 도구 소개        (.new-tool)   — 비유 + 어떤 점을 풀어주는가
3. 💻 코드 적용                          — 같은 화면을 다시 만든다
4. 🔄 Before / After 비교 (.before-after) — 데이터 흐름이 어디가 달라졌나
```

첫 차시처럼 「이전 버전이 없는」 경우에는 ① 자리에 **"왜 이게 필요한가"** 를 둔다.

### 원칙 3 — 데이터 흐름 3 종 컨벤션

학생이 디버깅 사고를 자연스레 익히도록 **모든** 자료에 다음 3 종을 표준으로 박는다.

| 컨벤션 | 위치 | 목적 |
|--------|------|------|
| **흐름도 슬라이드** (`.flow-diagram`) | 슬라이드 마지막 직전 (고정) | 차시가 누적될수록 박스가 길어짐 → 무의식 중에 전체 구조 외움 |
| **미니맵** (`.minimap`) | examples / labs 첫 페이지 | 코드 만지기 전에 「지금 어디를 만지는가」 인식 |
| **Checkpoint** (`.checkpoint`) | labs 의 모든 Step 마지막 | F12 / 콘솔 / 로그 / DB 어디를 볼지 매번 명시 |

> **요점**: 「깔끔한 결과물」만 보여주면 학생은 디버깅을 못 한다. 매 차시 끝에 「데이터가 여기까지 왔다」 를 직접 확인하는 습관을 만든다.

---

## 3. 재현 가능한 워크플로 (Step-by-step)

### Step 1 — 마무리 산출물 정의

가장 먼저 할 일은 **「이 과정을 끝내면 학생 손에 남는 한 가지」** 를 한 줄로 정하는 것.

| 예시 주제 | 마무리 산출물 (한 줄) |
|----------|---------------------|
| Spring 기초 | REST API + Ajax 게시판 |
| Python 입문 | CLI 가계부 + CSV 통계 |
| React 입문 | Todo 앱 (로컬스토리지 + 라우터) |
| Docker 기초 | docker-compose 로 워드프레스 한 방 띄우기 |
| 데이터 분석 | Pandas 로 공공데이터 분석 노트북 |

> 마무리 산출물이 명확하지 않으면 v0 ~ v∞ 진화 지도가 나오지 않는다. **여기서 막히면 다음 단계로 가지 마라.**

### Step 2 — 버전 진화 지도 짜기

마무리 산출물에서 거꾸로 **5~12 개의 단계**로 쪼갠다. 각 단계는 「학생이 직접 따라 만들 수 있는 한 화면 분량」.

```markdown
| 버전 | 마일스톤 | Part |
|------|---------|------|
| v0   | (가장 단순한 첫 화면)              | Part 1 |
| v0.5 | (외부 의존성 없이 끝까지 흐르는 형태) | Part 3 |
| v1   | (데이터가 처음 들어옴)             | Part 4 |
| v2   | (원시적·평문·미흡 — 의도적 불편)    | Part 5 |
| v3   | (새 도구로 안전하게 다시)          | Part 5 |
| v4   | (공통 처리 — 인터셉터·미들웨어 등)  | Part 5 |
| v5   | (핵심 기능 최소 형태)              | Part 5 |
| v6   | (인가·검증 추가)                  | Part 5 |
| v7   | (페이징·정렬 등 보강)              | Part 5 보강 |
| v8   | (또 다른 패러다임 — REST·SPA 등)   | Part 6 |
| v9   | (비동기·실시간)                   | Part 6 |
| v∞   | 디버깅 워크숍                    | Part 6 |
```

**규칙**:
- v2, v5 같은 **「의도적으로 어렵게」** 만드는 단계를 반드시 둔다 — 비교 대상이 없으면 새 도구의 가치를 못 느낌
- v∞ 는 항상 「**흐름도 역추적으로 마무리**」 — 새 기능이 아니라 「내가 지금까지 뭘 만들었나」 를 복기

### Step 3 — Part / 차시 분할 + 기호 부여

전체를 **5~7 개 Part** 로 묶는다. 각 Part 는 약어 + 색상 클래스를 갖는다.

| Part 약어 (예) | 색상 | 차시 수 (가이드) |
|-------|------|-----------|
| `intro`, `web`, `setup` | 파랑 (`.part-1`) | 4~6 |
| `core`, `lang`, `spring` | 초록 (`.part-2`) | 6~10 |
| `arch`, `mvc`, `pattern` | 보라 (`.part-3`) | 8~12 |
| `data`, `db`, `api` | 오렌지 (`.part-4`) | 8~12 |
| `feature`, `auth`, `state` | 빨강 (`.part-5`) | 8~12 |
| `wrap`, `rest`, `deploy` | 틸 (`.part-6`) | 5~8 |

각 차시는 **숫자 대신 기호** 로만 표시한다 (학생에게 차시 번호 노출 금지).

| 기호 | 의미 |
|------|------|
| ◇ | 개념 차시 (concept) |
| ▣ | 실습 차시 (hands-on) |
| ◆ | 전환점 (새 도구 / 패러다임이 처음 등장) |
| ★ | 마일스톤 (프로젝트 새 버전 v_n_ 릴리스) |

UI 라벨 형식:
- 일반: `◇ 카페 비유로 시작` / `▣ Hello World 띄우기`
- 마일스톤: `★ v3 — 안전한 로그인`

**파일명은 의미 기반** (Part 약어 + 키워드). 학생에게 보이지 않는다:

```
slides/web-client-server.html
slides/auth-v3-secure.html
slides/board-v5-minimal.html
slides/rest-v8-conversion.html
```

### Step 4 — 자료 4 종 디렉토리 구조

각 차시는 **네 가지 산출물**을 형제 디렉토리에 둔다.

```
project-root/
├── index.html                    # 메인 (Part 그리드 + 차시 카드)
├── CLAUDE.md                     # AI 도구용 컨벤션 가이드
├── slides/                       # 발표 (다크, reveal.js night)
│   ├── css/custom.css
│   ├── template.html             # 새 슬라이드 보일러플레이트
│   └── {part약어}-{키워드}.html
├── examples/                     # 읽기 자료 (다크, 순수 HTML)
│   ├── css/example.css
│   └── {part약어}-{키워드}.html
├── labs/                         # 단계별 실습 (다크, 순수 HTML)
│   ├── css/lab.css
│   └── {part약어}-{키워드}.html
├── handouts/                     # 인쇄용 (라이트, @media print)
│   ├── css/print.css
│   └── {part약어}-{키워드}.html
├── js/
│   ├── screenshot.js             # 스크린샷 + 관리자 모드
│   └── infographics.js           # SVG 인포그래픽 등록
├── images/                       # 사진·SVG·아이콘
└── api/                          # (선택) 업로드 PHP
```

| 디렉토리 | 용도 | 테마 |
|----------|------|------|
| `slides/` | 강의 발표 (4 단계 구조 + 흐름도 슬라이드) | 다크 |
| `examples/` | 읽기 자료 (개념 + 미니맵 + 비유) | 다크 |
| `labs/` | 단계별 실습 (Step + Checkpoint) | 다크 |
| `handouts/` | 인쇄용 요약 3~5 쪽 (PDF 저장) | 라이트 |

### Step 5 — CSS 4 종 + 공유 JS

#### CSS 4 종 (그대로 복사 후 색상 토큰만 변경)

`slides/css/custom.css`, `examples/css/example.css`, `labs/css/lab.css`, `handouts/css/print.css` 네 파일은 그대로 복사. 다음 **공통 토큰**만 새 주제에 맞게 바꾼다.

```css
:root {
  --bg: #0f172a;          /* 배경 */
  --surface: #1e293b;     /* 표면 */
  --text: #e2e8f0;        /* 텍스트 */
  --text-muted: #94a3b8;
  --accent: #f59e0b;      /* 강조 (오렌지) */
  --blue: #3b82f6;
  --green: #22c55e;
  --red: #ef4444;
  --purple: #a855f7;
  --teal: #14b8a6;
  --border: #475569;
}
```

#### 공유 JS 2 개

```html
<!-- 모든 슬라이드/예제/실습 페이지 마지막에 -->
<script src="../js/infographics.js"></script>
<script src="../js/screenshot.js"></script>
```

| 파일 | 역할 |
|------|------|
| `js/screenshot.js` | 스크린샷 자동 로드 / 「◀ 메인」 플로팅 버튼 / 관리자 모드 (`?admin` URL) |
| `js/infographics.js` | `data-infographic="..."` 마운트 포인트에 SVG 인포그래픽 자동 주입 + PALETTE 상수 |

### Step 6 — 차시 한 장 작성하기 (4 단계 구조 적용)

**가장 중요한 단계.** 첫 차시 4 종 자료 (slides + examples + labs + handouts) 를 **끝까지 충실히 완성** 해서 톤·시각·깊이를 굳힌다. 이후 모든 차시가 이 패턴을 따른다.

#### 슬라이드 18~22 장 가이드 (마일스톤 기준 350~450 줄)

```
1.  타이틀 (★ v3 — 안전한 로그인)
2.  학습 목표 (3~5 항목, .fragment fade-up)
3.  ⚠️ 이전 버전의 불편   (.pain-point)
4.  ⚠️ 불편 — 구체 사례 / 사진
5.  🛠️ 새 도구 소개      (.new-tool, 비유 포함)
6.  🛠️ 새 도구 — 동작 원리 (인포그래픽)
7~13. 💻 코드 적용 (단계별, 슬라이드당 한 화면)
14. 🔄 Before / After 비교 (.before-after)
15. 데이터가 어디가 달라졌나 (텍스트 다이어그램)
16. 자주 만나는 오류 1
17. 자주 만나는 오류 2
18. 📊 한 그림 정리 (data-infographic 마운트)
19. 흐름도 슬라이드 (.flow-diagram, 새 칸 강조)  ← 마지막 직전 고정
20. 정리 + 다음 차시 미리보기
```

#### 슬라이드 4 단계 구조 마크업 예시

```html
<!-- 1단계: 이전 버전의 불편 -->
<section class="pain-point">
  <h2>⚠️ v2 의 문제</h2>
  <p>로그인 비밀번호가 DB 에 그대로 보입니다.</p>
  <pre><code class="language-sql">
SELECT password FROM members WHERE id='alice';
-- 결과: 1234   ← 평문이 그대로 노출
  </code></pre>
  <div class="diagram">
    [사용자] → [DB] → 비밀번호 그대로 보임 (위험)
  </div>
</section>

<!-- 2단계: 새 도구 소개 -->
<section class="new-tool">
  <h2>🛠️ 단방향 자물쇠 (BCrypt)</h2>
  <p>한 번 잠그면 서버도 풀 수 없는 자물쇠입니다.
     비교만 가능 — 「잠근 결과가 같은가?」만 묻는다.</p>
  <ul>
    <li>저장: <code>encode("1234")</code> → <code>$2a$10$...</code></li>
    <li>검증: <code>matches("1234", "$2a$10$...")</code> → true / false</li>
  </ul>
</section>

<!-- 3단계: 코드 적용 (여러 슬라이드) -->
<section>
  <h3>1. 의존성 추가</h3>
  <pre><code class="language-xml">...</code></pre>
</section>

<!-- 4단계: Before / After 비교 -->
<section class="before-after">
  <h2>🔄 Before / After</h2>
  <div class="columns">
    <div class="col">
      <h3>Before (v2)</h3>
      <pre><code>password = "1234"  // 평문</code></pre>
    </div>
    <div class="col">
      <h3>After (v3)</h3>
      <pre><code>password = "$2a$10$..."  // BCrypt</code></pre>
    </div>
  </div>
</section>
```

### Step 7 — 흐름도 슬라이드 / 미니맵 / Checkpoint 표준 마크업

**모든 차시에 빠지면 안 되는 3 종 컨벤션.** 아래 마크업을 그대로 복붙하고 텍스트만 바꾼다.

#### 7-1. 흐름도 슬라이드 (slides/, 마지막 직전)

```html
<section class="flow-diagram">
  <h2>이번 차시에 어디가 새로 생겼나</h2>
  <pre>
[브라우저] → [Controller] → [Service] → <span class="new">[Encoder]</span> → [Mapper] → [DB]
                                            ↑
                                      이번 차시에서 새로 생긴 칸
  </pre>
  <p class="caption">차시가 누적될수록 흐름도가 길어집니다.</p>
</section>
```

CSS:

```css
.flow-diagram pre { font-family: 'JetBrains Mono', monospace; line-height: 1.8; }
.flow-diagram .new { background: var(--accent); color: #000; padding: 0 .3em; border-radius: 4px; }
```

#### 7-2. 미니맵 (examples/, labs/ 첫 페이지)

```html
<div class="minimap">
  <div class="minimap-title">📍 지금 어디를 만지는가</div>
  <pre>
[브라우저]   [Controller]   [Service]   <span class="active">[Encoder]</span>   [Mapper]   [DB]
                                            ▲
                                       이번 차시
  </pre>
</div>
```

#### 7-3. Checkpoint (labs/ 모든 Step 끝)

```html
<div class="checkpoint">
  <div class="checkpoint-title">✅ 확인 포인트</div>
  <ul>
    <li><strong>F12 네트워크 탭</strong>: <code>/login</code> 요청의 status 가 200 인가</li>
    <li><strong>서버 콘솔</strong>: <code>[BCrypt] matches=true</code> 가 찍히는가</li>
    <li><strong>DB</strong>: <code>SELECT password FROM members</code> 결과가
        <code>$2a$10$...</code> 로 시작하는가 (평문이 아닌가)</li>
  </ul>
</div>
```

> **규칙**: Checkpoint 항목은 항상 「**어디서 무엇을 보면 된다**」 가 명시되어야 한다. "잘 되는지 확인" 같은 모호한 표현 금지.

### Step 8 — 인포그래픽·이미지 결정 기준

**언제 SVG 인포그래픽을, 언제 실제 사진을 쓸 것인가?**

| 상황 | 선택 | 이유 |
|------|------|------|
| 추상적 구조 (계층·흐름·관계) | **SVG 인포그래픽** | 정확한 매핑, 색상 일관성, 가벼움 |
| 비유 도입부 (`.new-tool` 첫 머리) | **실제 사진 (Unsplash CC0)** | 친숙한 사물이 한 번 시선을 잡음 |
| 코드 결과 / 화면 캡처 | **스크린샷** | 학생이 「이 화면이 나와야 한다」 를 직접 봄 |
| 단계별 절차 (1, 2, 3) | **SVG + 번호 원** | 순서가 명확 |
| Before / After 비교 | **컬럼 + 코드 / 다이어그램** | 차이가 한눈에 |

#### `js/infographics.js` 활용

```html
<!-- 슬라이드 안에 마운트 포인트만 두면 된다 -->
<section>
  <h2>📊 한 그림 정리</h2>
  <div data-infographic="client-server"></div>
</section>
```

`infographics.js` 안에 SVG 를 등록해두면 같은 인포그래픽을 여러 차시에서 재활용 가능.

#### 사진은 `images/` 디렉토리에

```
images/
  cafe.jpg        # 서버↔클라이언트 비유 (Unsplash CC0)
  receipt.jpg     # 쿠키 비유
  taxi.jpg        # IoC 비유
  knife-rack.jpg  # 커넥션 풀 비유
  lock.jpg        # BCrypt 비유
```

### Step 9 — 「관리자 모드」로 사후 이미지 업로드

강사가 슬라이드를 직접 만지면서 스크린샷 자리를 추가하고 이미지를 업로드할 수 있도록 `screenshot.js` 가 관리자 모드를 제공한다.

#### 동작 흐름

```
1. URL 에 ?admin 붙임
2. prompt 비밀번호 (예: smhrd)
3. sessionStorage 캐시 → 새로고침해도 유지
4. 빨간 「관리자 모드」 배너 + 「+ 이미지 자리」 플로팅 버튼
5. 버튼 클릭 → 현재 슬라이드에 .screenshot div 동적 주입
6. 드래그&드롭 → FileReader 미리보기 → HTML 스니펫 토스트
7. 강사가 스니펫을 슬라이드 HTML 에 붙여넣기
```

#### 슬라이드 안 플레이스홀더 마크업

```html
<div class="screenshot">
  <div class="label">스크린샷</div>
  <div class="desc">로그인 성공 화면 — 자동 매칭에 사용됨</div>
</div>
```

이미지 네이밍 규칙: `{type}-{slug}-{index}.png` (예: `slides-auth-v3-secure-2.png`).

### Step 10 — 검증 (라이브 점검)

```bash
$ cd project-root
$ python3 -m http.server 8000
$ open http://localhost:8000/
```

체크해야 하는 것:

- [ ] `index.html` 모든 카드 링크가 실제 파일로 연결되는가 (404 없음)
- [ ] 슬라이드 `S` 키 → 강사 노트가 보이는가
- [ ] 핸드아웃 `Ctrl+P` → 라이트 테마로 인쇄 미리보기가 나오는가
- [ ] examples/labs 첫 페이지에 미니맵이 있는가
- [ ] labs 모든 Step 끝에 Checkpoint 가 있는가
- [ ] 슬라이드 마지막 직전에 흐름도 슬라이드가 있는가
- [ ] 모바일 (768px 이하) 에서 레이아웃이 깨지지 않는가
- [ ] 학생 화면 어디에도 차시 번호 / 「비전공자」 / 비유가 제목으로 노출되지 않는가

---

## 4. 고객 경험 (CX) 관점 체크리스트

학생이 이 사이트를 처음 열 때부터 마무리까지의 경험을 점검하는 체크리스트.

### 4-1. 학생이 막히는 순간

- [ ] **흐름이 끊기지 않는가** — 차시 끝에 다음 차시로 가는 단서가 있는가? "다음 차시: ..." 한 줄
- [ ] **데이터가 어디까지 왔는지 확인할 수 있는가** — Checkpoint 가 「어디서 무엇을 보면 된다」 를 명시하는가
- [ ] **막혔을 때 되돌아갈 곳이 있는가** — 미니맵이 「내가 지금 어디를 만지는가」 를 보여주는가
- [ ] **에러를 만나도 당황하지 않는가** — 흔한 오류 2~3 개를 슬라이드 후반에 미리 보여주는가
- [ ] **이전 차시 코드와 연결되는가** — Before / After 비교가 「v(n-1) 코드」 를 그대로 실행 가능한 형태로 보여주는가

### 4-2. 메타 정보 노출 금지

학생 화면에 다음이 보이면 안 된다.

- [ ] 차시 번호 (`Session 23`, `23/64` 같은 라벨 금지)
- [ ] 강사 내부 포지셔닝 (`비전공자`, `초보자`, `왕초보` 등 — 강사용 메모일 뿐)
- [ ] 비유가 제목·라벨·학습 목표·체크리스트에 등장 (본문 보조 설명 자리에서만 OK)
- [ ] 「전체 N 차시」, 「N% 완료」 같은 카운트다운 압박
- [ ] 후속 과정 주제 광고 (`다음 과정에서는 JPA / Docker / ...`) — 마무리 슬라이드에서만 한 줄로

### 4-3. 한 차시의 완결성

- [ ] 「불편 → 도구 → 적용 → 비교」 사이클이 한 차시 안에 **완결** 되는가
- [ ] 학생이 차시 시작 → 끝 사이에 **돌아가는 코드** 를 한 번 만들었는가
- [ ] 차시 끝에 「이번에 만든 게 어디 자리인지」 흐름도로 다시 보여주는가

### 4-4. 화면 밀도

- [ ] 한 슬라이드에 글이 너무 많지 않은가 (한 슬라이드 1 메시지 원칙)
- [ ] 인포그래픽 / 도식 / 사진이 **차시당 최소 3 회** 등장하는가
- [ ] 코드 블록은 **한 화면에 들어오는 길이** 인가 (12~15 줄 이내)
- [ ] 여백이 충분한가 (`.fragment fade-up` 으로 정보를 단계 공개)

---

## 5. 공통 함정 5 가지 (이 프로젝트가 겪은 실수)

이 프로젝트가 5 시간 동안 만들면서 **실제로 겪은 실수**들. 같은 함정을 미리 피하라.

### 함정 1 — 비유를 제목 / 라벨 / 학습 목표에 노출

**증상**: 처음에는 코스명을 「**카페로 배우는 Spring**」, Part 라벨을 「**손님과 가게**」, 카드 제목을 「**카페 비유로 시작**」 으로 짰다.

**문제**: 학생은 「제목에서 본 비유」 를 「실제 학습 내용」 으로 오해한다. 시험 / 면접 / 실무에서 나오는 단어는 "Server", "HTTP" 이지 "카페", "손님" 이 아니다.

**해법**: 비유는 **본문 단락 안의 보조 설명** 자리에서만 사용. 제목 / 라벨 / 학습 목표는 항상 **기술 용어** 로.

```
❌ 카드 제목: "카페 비유로 시작"
✅ 카드 제목: "◇ 클라이언트와 서버"
   → 본문에서: "서버는 카페의 바리스타에 해당합니다."
```

### 함정 2 — 차시 번호로 학생을 압박

**증상**: 처음에는 모든 카드에 `Session 01`, `Session 02`... 라벨을 붙였다.

**문제**: 학생이 「23/64 차시」 같은 카운트다운을 보면, 학습 자체보다 「얼마나 남았나」 에 신경이 쏠린다. 비전공자에게는 특히 부담.

**해법**: 차시 번호 노출 금지. **기호 (◇▣◆★)** + 마일스톤은 **버전 뱃지 (v0~v∞)** 만.

```html
<!-- ❌ -->
<div class="card-num">Session 23</div>
<h3>회원가입 안전하게</h3>

<!-- ✅ -->
<div class="card-glyph">★</div>
<div class="version-badge">v3</div>
<h3>안전한 로그인</h3>
```

### 함정 3 — 처음부터 분량 제한을 두면 빈약해진다

**증상**: 첫 양산 라운드에서 모든 차시를 6 슬라이드 / 80 줄 이하로 통일하려 했더니, **마일스톤 차시조차 본문이 빈약**해졌다.

**문제**: 차시 무게는 균등하지 않다. 마일스톤·전환점은 무거워야 한다.

**해법**: 차시 분량을 **미리 제한하지 않는다**. 마일스톤은 **18~22 슬라이드 / 350~450 줄** 기준. 일반 개념 차시만 가볍게.

| 차시 유형 | 슬라이드 수 | HTML 줄 수 |
|----------|------------|------------|
| ◇ 개념 | 6~10 | 100~200 |
| ▣ 실습 | 8~12 | 150~250 |
| ◆ 전환점 | 12~16 | 250~350 |
| ★ 마일스톤 | 18~22 | 350~450 |

### 함정 4 — SVG 만 고집하지 말고, 비유 도입에는 실제 사진

**증상**: 처음에는 시각화를 모두 SVG 인포그래픽으로 통일했더니, 「**친숙함**」 이 부족했다.

**문제**: 학생이 처음 보는 개념을 SVG 추상 도형으로만 만나면 「학교 교과서」 느낌. 비유의 친밀감이 사라진다.

**해법**: **사진 vs 인포그래픽 결정 기준** 을 둔다 (Step 8 표 참조).

- **사진** = 비유 도입부, 학생의 「아, 그거」 감각 자극
- **SVG** = 추상 구조, 정확한 매핑, 일관된 색

Unsplash CC0 사진을 `images/` 에 5~10 개 정도 미리 받아두면 차시 작성이 가속된다.

### 함정 5 — 「깔끔하게 만든 결과물」만 보여주면 디버깅을 못 한다

**증상**: 첫 양산 때 동작하는 결과물 코드만 슬라이드에 넣었더니, 학생들이 자기 환경에서 막혔을 때 **어디를 봐야 할지 몰랐다.**

**문제**: 정답 코드만 보여주면 학생은 「복붙 → 안 되면 재시작」 패턴에 갇힌다.

**해법**: 흐름도 / 미니맵 / Checkpoint 3 종을 **모든** 차시에 박는다. 추가로:

- 의도적으로 **자주 만나는 오류 슬라이드** 2~3 장을 후반에 둔다
- 각 Step 끝 Checkpoint 에 **「F12 / 콘솔 / SQL 로그 / DB SELECT」** 중 어디를 볼지 명시
- v∞ 차시는 「**디버깅 워크숍**」 로 흐름도 역추적 연습으로 마무리

---

## 6. 에이전트 단위 작업 분담 (Claude Code 활용)

큰 사이트는 한 명 (또는 한 모델 인스턴스) 이 처음부터 끝까지 만들면 컨벤션이 흔들린다. **역할별 에이전트** 로 쪼개라.

### 6-1. Content Agent — 슬라이드 본문 작성

| 항목 | 내용 |
|------|------|
| **트리거** | 「이번 Part N 의 차시 X 본문을 써줘」 |
| **입력** | `CLAUDE.md` (컨벤션) + 자료 docx / 노트 + 버전 진화 지도의 해당 v_n_ |
| **산출물** | `slides/{slug}.html` 4 단계 구조 + 흐름도 슬라이드 / `examples/{slug}.html` + 미니맵 / `labs/{slug}.html` + Step + Checkpoint / `handouts/{slug}.html` |
| **체크** | 4 단계 구조 / 흐름도 / 미니맵 / Checkpoint 4 항목이 모두 있는가 |

### 6-2. Visual Agent — 인포그래픽·이미지 제작·획득

| 항목 | 내용 |
|------|------|
| **트리거** | 「v3 차시에 단방향 자물쇠 인포그래픽 추가」 |
| **입력** | 차시 슬라이드 HTML + 표현하고 싶은 개념의 한 줄 설명 |
| **산출물** | `js/infographics.js` 에 SVG 등록 + 슬라이드에 `<div data-infographic="...">` 마운트. 사진이면 `images/` 다운로드 + `<img>` 태그 |
| **체크** | PALETTE 색상 일관성 / 슬라이드에 1~3 개 시각 자료 / 비유 도입엔 사진, 구조 설명엔 SVG |

### 6-3. QA Agent — 컨벤션 준수 검증

| 항목 | 내용 |
|------|------|
| **트리거** | 「Part N 차시 일괄 검수」 / 매 양산 라운드 후 |
| **입력** | 차시 HTML 4 종 |
| **산출물** | 결함 리포트 (마크다운, 파일별 줄 번호 포함) |
| **체크** | (a) 차시 번호 노출 / (b) 「비전공자」노출 / (c) 비유가 h1·h2·h3 에 등장 / (d) 흐름도·미니맵·Checkpoint 누락 / (e) 네비게이션 (이전·메인·다음) 누락 / (f) `screenshot.js` 누락 |

```bash
# QA Agent 가 grep 하는 패턴 예시
$ grep -rn "Session [0-9]" slides/ examples/ labs/ handouts/
$ grep -rn "비전공자\|초보자\|왕초보" slides/ examples/ labs/ handouts/
$ grep -rL "flow-diagram" slides/
$ grep -rL "minimap" examples/ labs/
$ grep -rL "checkpoint" labs/
```

### 6-4. Documentation Agent — 기록·방법론 갱신

| 항목 | 내용 |
|------|------|
| **트리거** | 큰 의사결정이 있었거나 / 양산 라운드가 끝났을 때 |
| **입력** | 대화 로그 + 변경 파일 목록 |
| **산출물** | `프로젝트-기록.md` (이 사이트가 어떻게 만들어졌나) + `CLAUDE.md` (컨벤션 갱신) + Claude 메모리 영구 저장 (`MEMORY.md` + 피드백 파일들) |
| **체크** | 의사결정의 「왜」 가 문서에 남아 있는가 |

### 6-5. 트리거 시점 시퀀스

```
Phase 0: 정렬 (사용자와 13~20 회 대화)
   └─ Documentation Agent: CLAUDE.md 초안

Phase 1: 인프라 구축
   └─ Content Agent: 디렉토리 + CSS 4 종 + index.html + template.html

Phase 2: 첫 차시 충실 작성
   └─ Content Agent + Visual Agent: 첫 4 종 자료
   └─ QA Agent: 컨벤션 점검

Phase 3: 양산 (Python 생성기)
   └─ Content Agent: 데이터셋 SESSIONS[] + 렌더 함수
   └─ QA Agent: 일괄 검수

Phase 4: 핵심 차시 보강
   └─ Content Agent: 마일스톤·전환점 9~12 개 재작성
   └─ Visual Agent: 인포그래픽 일괄 주입

Phase 5: 검증 + 문서화
   └─ python3 -m http.server 라이브 점검
   └─ Documentation Agent: 프로젝트-기록.md 마무리
```

---

## 7. 사용 가능한 도구·플러그인 목록

이 프로젝트가 실제로 사용한 도구들. **모두 무료 / CDN / CC0**.

### 프론트엔드 라이브러리 (CDN)

| 라이브러리 | 버전 | 용도 |
|------------|------|------|
| reveal.js | 5.1.0 (night theme) | 슬라이드 |
| reveal.js highlight | 동일 | 코드 하이라이팅 (monokai) |
| reveal.js notes | 동일 | 강사 노트 (S 키) |
| Pretendard | variable | 한국어 본문 폰트 |
| JetBrains Mono | latest | 코드 블록 폰트 |
| Plus Jakarta Sans | (Google Fonts) | 영문 디스플레이 |

```html
<!-- 본문 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<!-- 코드 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/css/jetbrains-mono.css">
<!-- 슬라이드 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/night.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/highlight/monokai.css">
```

### 이미지 / 다이어그램

| 도구 | 용도 | URL |
|------|------|-----|
| Unsplash CC0 | 비유 도입부 사진 | https://unsplash.com (License Free) |
| Mermaid | 다이어그램 코드 → SVG | https://mermaid.js.org |
| draw.io | 손으로 그리는 도식 | https://app.diagrams.net |
| `js/infographics.js` (자체 구축) | 재사용 SVG 인포그래픽 | 프로젝트 내 |

### Python 도구 (양산용)

| 도구 | 용도 |
|------|------|
| `python-docx` | 강사 사전 작성 docx → 텍스트 추출 |
| `zipfile` | docx 가 zip 이라 textract 없이도 추출 가능 |
| 자체 `_gen.py` | SESSIONS 데이터셋 + 렌더 함수로 일괄 양산 |
| `python3 -m http.server` | 빌드 시스템 없이 로컬 서빙 |

```python
# _gen.py 의 핵심 구조
SESSIONS = [
  {'slug': 'auth-v3-secure', 'glyph': '★', 'version': 'v3',
   'title': '안전한 로그인', 'pain': '...', 'tool_title': '...',
   'tool_desc': '...', 'code': '...', 'after': '...',
   'summary': [...], 'terms': [...]},
  # ...
]
for s in SESSIONS:
    for kind, render in [('slides', render_slides), ('examples', render_examples),
                         ('labs', render_labs), ('handouts', render_handouts)]:
        path = f"{kind}/{s['slug']}.html"
        if os.path.exists(path): continue
        with open(path, 'w', encoding='utf-8') as f:
            f.write(render(s))
```

### Claude Code 에이전트 / 스킬

| 에이전트 / 스킬 | 트리거 시점 |
|----------------|------------|
| `Explore` | 코드베이스 처음 파악 / 구조 분석 |
| `general-purpose` | 양산 작업 (여러 파일 생성) |
| `code-simplifier` | 컨벤션 통일 / 중복 제거 |
| `init` 스킬 | 빈 디렉토리 → CLAUDE.md 첫 생성 |
| `claude-md-improver` 스킬 | CLAUDE.md 정기 점검 |
| 메모리 영구 저장 (`MEMORY.md`) | 큰 의사결정 후 / 다음 세션에서도 자동 적용 |

---

## 8. 체크리스트 — 차시 하나 완성 기준

차시 4 종 자료 (slides + examples + labs + handouts) 를 완성했다고 PR 을 닫기 전에 점검.

### 8-1. 구조

- [ ] **4 단계 구조가 명확히 보이는가** — `.pain-point` / `.new-tool` / 코드 적용 / `.before-after` 가 슬라이드 안에 모두 있는가
- [ ] **흐름도 슬라이드가 마지막 직전에 있는가** (`.flow-diagram` 클래스, 새 칸 강조)
- [ ] **미니맵이 examples / labs 첫 페이지에 있는가** (`.minimap` 클래스)
- [ ] **Checkpoint 가 labs 의 모든 Step 끝에 있는가** (`.checkpoint` 클래스, "어디를 볼지" 명시)
- [ ] **하단 네비게이션** (이전 / 메인 / 다음) 이 4 종 자료 모두에 있는가
- [ ] `screenshot.js` 와 `infographics.js` 가 모든 페이지에서 로드되는가

### 8-2. 표기 / 컨벤션

- [ ] **비유가 제목 / 라벨에 등장하지 않는가** (h1 / h2 / h3 / 카드 제목 / 학습 목표 / 체크리스트)
- [ ] **차시 번호가 노출되지 않는가** (`Session N` / `N/64` 패턴 없음)
- [ ] **「비전공자」 / 「초보자」 / 「왕초보」 가 노출되지 않는가**
- [ ] 기술 용어 첫 등장 시 **「한국어 (English)」** 형식인가
- [ ] 코드 블록의 셸 명령에 `$ ` 접두사, 출력은 접두사 없는가
- [ ] 마일스톤 차시는 **버전 뱃지** 가 헤더 우측에 있는가

### 8-3. 시각 / 분량

- [ ] **인포그래픽·이미지가 의미 있게 배치** 되었는가 (차시당 최소 3 회)
- [ ] 비유 도입부에 **사진** 이 있는가 (있으면 좋음)
- [ ] 한 슬라이드에 글이 너무 많지 않은가 (한 슬라이드 1 메시지)
- [ ] 마일스톤이면 슬라이드 18~22 장 / HTML 350~450 줄 수준인가
- [ ] 코드 블록이 한 화면에 들어오는 길이인가 (12~15 줄)

### 8-4. 학습 흐름

- [ ] 차시 끝에 **「다음 차시: ...」** 한 줄이 있는가
- [ ] 슬라이드 안에 **자주 만나는 오류 2~3 개** 가 후반에 있는가
- [ ] Checkpoint 항목이 **「어디서 무엇을 보면 된다」** 를 명시하는가
- [ ] Before / After 비교가 **이전 차시 코드** 를 그대로 가져오는가

### 8-5. 라이브 검증

- [ ] `python3 -m http.server 8000` 실행 후 모든 링크가 404 없이 열리는가
- [ ] 슬라이드 `S` 키 → 강사 노트가 보이는가
- [ ] 핸드아웃 `Ctrl+P` → 라이트 테마 인쇄 미리보기가 정상인가
- [ ] 모바일 (768px 이하) 에서 레이아웃이 깨지지 않는가
- [ ] `?admin=비밀번호` 로 관리자 모드가 진입되는가 (선택)

---

## 9. 빠른 시작 (TL;DR)

다른 강사가 이 가이드를 처음 읽고 「오늘 안에 사이트를 띄우고 싶다」 면:

```bash
# 1. 빈 디렉토리에서 시작
$ mkdir my-course && cd my-course
$ mkdir -p slides/css examples/css labs/css handouts/css js images api

# 2. 이 프로젝트의 CSS / JS / template.html 복사
$ cp -r ../spring/{slides/css,examples/css,labs/css,handouts/css,js} ./
$ cp ../spring/slides/template.html slides/

# 3. CLAUDE.md 를 새 주제용으로 복사 + 수정
$ cp ../spring/CLAUDE.md ./CLAUDE.md
# → 6-Part 약어 / 색상 / 마일스톤 표 / 비유 사전 부분만 새 주제로 교체

# 4. Claude Code 시작 → 다음 정도의 정렬 대화
#    - 코스명·포지셔닝
#    - 마무리 산출물 한 줄
#    - 6-Part 큰 그림 + 마일스톤 (★) 정의
#    - 4 단계 차시 구조 / 데이터 흐름 컨벤션 합의
#    - 기호 체계 / 차시 번호 정책 / 비유 사용 원칙 합의

# 5. 첫 차시 충실 작성 → 양산 → 검수 → 보강

# 6. 라이브 검증
$ python3 -m http.server 8000
$ open http://localhost:8000/
```

**예상 소요 시간**: 정렬 1 시간 + 인프라 구축 30 분 + 첫 차시 1 시간 + 양산 2 시간 + 보강 1 시간 = **약 5~6 시간**.

---

## 10. 마무리 — 이 패턴이 효과적인 이유

이 방법론은 **「AI 페어 프로그래밍 + 도메인 전문가 협업」** 의 한 사례다.

- **강사 (도메인 전문가)** = 학습자 이해 + 교수법 의사결정 + 콘텐츠 정확성
- **AI (Claude Code)** = 빠른 양산 + 컨벤션 일관성 + 자동 검증

성공의 5 요소:

1. **명확한 정렬 단계** — 본격 생산 전 충분한 협상 (13~20 회 대화)
2. **반복 가능한 컨벤션** — 한 번 정한 패턴 (4 단계 / 흐름도 / 미니맵 / Checkpoint) 을 모든 차시에 적용
3. **즉각 피드백** — 잘못된 방향 발견 시 바로 수정 (예: 비유 제목, 차시 번호 노출)
4. **점진적 깊이** — 첫 차시 충실 → 양산 → 핵심 차시 보강의 3 라운드
5. **메모리 영구 저장** — 다음 세션에서도 컨벤션이 자동 적용되도록 `MEMORY.md` 에 박는다

이 패턴은 다른 교육 콘텐츠 (Docker, Python, React, 데이터분석 등) 에 그대로 적용 가능하다. **주제만 바뀌고 구조는 같다.**

---

> 이 가이드는 [`프로젝트-기록.md`](./프로젝트-기록.md) 의 실제 사례를 기반으로 작성되었습니다.
