# 교육 사이트 제작 가이드 (Course Template Guide)

이 문서는 **한국어 교육 과정 웹사이트**의 구조, 패턴, 컨벤션을 설명합니다.
다른 주제(예: Docker, React, Python 등)로 동일한 형태의 교육 자료를 만들 때 이 가이드를 참고하세요.

---

## 1. 프로젝트 개요

- **목적**: 비전공자 대상 실습 중심 교육 과정 웹사이트
- **언어**: 한국어 (기술 용어는 한국어 설명 + 영문 원어 병기)
- **빌드 시스템 없음**: 정적 HTML 파일을 브라우저에서 직접 서빙
- **외부 의존성**: CDN으로 로드 (별도 설치 불필요)

---

## 2. 디렉토리 구조

```
project-root/
├── index.html              # 메인 페이지 (전체 세션 목록 + 자료 링크)
├── CLAUDE.md               # Claude Code 작업 가이드
├── js/
│   └── screenshot.js       # 스크린샷 업로드/관리 시스템 (공용)
├── slides/                 # 프레젠테이션 슬라이드
│   ├── css/custom.css      # 슬라이드 전용 CSS
│   ├── template.html       # 새 슬라이드 보일러플레이트
│   ├── session-01.html
│   ├── session-02.html
│   └── ...
├── examples/               # 읽기 자료 (개념 설명 + 코드 예제)
│   ├── css/example.css
│   ├── session-01.html
│   └── ...
├── labs/                   # 실습 가이드 (단계별 따라하기)
│   ├── css/lab.css
│   ├── session-01.html
│   └── ...
├── handouts/               # 인쇄용 핸드아웃 (Ctrl+P → PDF)
│   ├── css/print.css
│   ├── session-01.html
│   └── ...
├── images/                 # 공용 이미지 디렉토리
└── api/                    # 스크린샷 업로드 API (PHP)
```

### 파일 명명 규칙

- 기본: `session-{NN}.html` (NN = 01~24, 제로패딩 두 자리)
- 보충 세션: `session-{NN}{a|b}.html` (예: `session-16a.html`, `session-19b.html`)
- 압축 수업용: `day{NN}-주제.html` (예: `day03-auto-deploy.html`)

---

## 3. 공통 디자인 토큰

### 폰트 (CDN)

```html
<!-- 한국어 본문 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<!-- 또는 static 버전 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">

<!-- 코드 블록 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/css/jetbrains-mono.css">

<!-- index.html 추가 (영문 디스플레이) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
```

### 색상 체계

**다크 테마** (slides, examples, labs):

| 용도 | CSS 변수 | 값 |
|------|----------|-----|
| 배경 | `--bg` | `#0f172a` |
| 표면 | `--surface` | `#1e293b` |
| 텍스트 | `--text` | `#e2e8f0` |
| 텍스트 보조 | `--text-muted` | `#94a3b8` |
| 강조 오렌지 | `--accent` | `#f59e0b` |
| 파랑 (h2, 링크) | `--blue` | `#3b82f6` |
| 초록 (h3, 성공) | `--green` | `#22c55e` |
| 빨강 (위험) | `--red` | `#ef4444` |
| 보라 (퀴즈) | `--purple` | `#a855f7` |
| 테두리 | `--border` | `#475569` |
| 코드 배경 | (별도) | `#0d1117` |

**라이트 테마** (handouts - 인쇄 최적화):

| 용도 | 값 |
|------|-----|
| 배경 | `#fff` |
| 텍스트 | `#1a1a1a` |
| 보조 | `#666` |
| 코드 배경 | `#f5f5f5` |
| 테두리 | `#ddd` |

### 슬라이드 전용 색상 (reveal.js 위에 덧씌움)

| 용도 | CSS 변수 | 값 |
|------|----------|-----|
| 배경 | `--main-bg` | `#1a1a2e` |
| 카드 배경 | `--card-bg` | `#16213e` |
| 강조 오렌지 | `--accent-orange` | `#f39c12` |
| 파랑 | `--accent-blue` | `#3498db` |
| 초록 | `--accent-green` | `#2ecc71` |
| 빨강 | `--accent-red` | `#e74c3c` |
| 보라 | `--accent-purple` | `#9b59b6` |

---

## 4. 자료 유형별 상세 구조

### 4-1. 슬라이드 (`slides/`)

**프레임워크**: reveal.js 5.1.0 (CDN) + night 테마

#### HTML 보일러플레이트

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session XX - 제목 | 과정명</title>

  <!-- reveal.js CDN -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/night.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/highlight/monokai.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/css/jetbrains-mono.css">
  <link rel="stylesheet" href="css/custom.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">

      <!-- 타이틀 슬라이드 -->
      <section>
        <div class="session-title">
          <div class="session-number">Session XX</div>
          <h1>차시 제목</h1>
          <p class="subtitle">과정명</p>
        </div>
        <aside class="notes">강사 노트: 수업 시작 가이드</aside>
      </section>

      <!-- 학습 목표 -->
      <section>
        <h2>학습 목표</h2>
        <div class="objectives">
          <ul>
            <li class="fragment fade-up"><span class="keyword">핵심용어1</span> 목표 설명</li>
            <li class="fragment fade-up"><span class="keyword">핵심용어2</span> 목표 설명</li>
          </ul>
        </div>
      </section>

      <!-- 내용 슬라이드들 -->
      <!-- ... -->

      <!-- 정리 슬라이드 -->
      <section>
        <h2>정리</h2>
        <div class="summary">
          <h3>오늘 배운 내용</h3>
          <ul>
            <li>핵심 1</li>
            <li>핵심 2</li>
          </ul>
        </div>
        <p style="margin-top: 0.8em; font-size: 0.7em; color: #999;">
          다음 차시: 다음 주제 미리보기
        </p>
      </section>

    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/highlight/highlight.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/notes/notes.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      slideNumber: 'c/t',
      width: 1280,
      height: 720,
      margin: 0.06,
      transition: 'slide',
      plugins: [RevealHighlight, RevealNotes]
    });
  </script>
  <script src="../js/screenshot.js"></script>
</body>
</html>
```

#### 슬라이드 흐름 (필수 순서)

1. **타이틀 슬라이드** — `.session-title` > `.session-number` + `h1` + `.subtitle`
2. **학습 목표** — `.objectives` 안에 `fragment fade-up` 리스트
3. **내용 슬라이드들** — 개념 → 예제 → 따라하기 순서
4. **정리 슬라이드** — `.summary` 안에 핵심 내용 요약

#### 주요 CSS 클래스

| 클래스 | 용도 | 예시 |
|--------|------|------|
| `.session-title` | 타이틀 슬라이드 래퍼 | 세션 번호 + 제목 |
| `.objectives` | 학습 목표 박스 | 파란 테두리, 그래디언트 배경 |
| `.keyword` | 핵심 용어 강조 | 오렌지색 볼드 |
| `.highlight` | 배경 하이라이트 | 오렌지 반투명 배경 |
| `.info-box` | 정보 박스 | 파란 왼쪽 테두리 |
| `.warning-box` | 경고 박스 | 오렌지 왼쪽 테두리 |
| `.tip-box` | 팁 박스 | 초록 왼쪽 테두리 |
| `.danger-box` | 위험 박스 | 빨간 왼쪽 테두리 |
| `.diagram` | 텍스트 다이어그램 | 모노스페이스, pre 형태 |
| `.columns` > `.col` | 2단 레이아웃 | flex 50/50 |
| `.step` > `.step-number` + `.step-content` | 단계별 가이드 | 원형 번호 + 설명 |
| `.quiz-question` | 퀴즈 박스 | 보라 테두리 |
| `.summary` | 정리 박스 | 초록 테두리, 그래디언트 배경 |
| `.fragment.fade-up` | 순차 표시 애니메이션 | 아래→위 페이드인 |
| `<aside class="notes">` | 강사 노트 (S키로 확인) | 화면에 안 보임 |

#### 코드 블록

```html
<pre><code class="language-bash" data-trim data-noescape>
$ ls -la
$ pwd
</code></pre>
```

---

### 4-2. 예제/읽기 자료 (`examples/`)

**용도**: 개념을 깊이 있게 설명하는 읽기 자료. 비유와 다이어그램 중심.

#### HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session XX 예제본 - 제목</title>
  <link rel="stylesheet" href="css/example.css">
</head>
<body>
  <div class="container">

    <!-- 헤더 -->
    <div class="header">
      <div class="session-num">Session XX</div>
      <h1>제목</h1>
      <p class="subtitle">과정명 - 읽기 자료</p>
    </div>

    <!-- 용어 사전 (항상 첫 번째 섹션) -->
    <div class="terms">
      <h3>이 차시의 핵심 용어</h3>
      <div class="term-item">
        <span class="term-name">용어 (English)</span>
        <span class="term-desc">설명. 일상 비유를 포함합니다.</span>
      </div>
      <!-- 더 많은 term-item들 -->
    </div>

    <!-- 본문 섹션들 -->
    <h2>1. 섹션 제목</h2>
    <p>설명 텍스트...</p>

    <div class="box box-info">
      <div class="box-title">참고</div>
      <p>정보 박스 내용</p>
    </div>

    <div class="diagram">
[클라이언트]  --요청-->  [서버]  --응답-->  [화면]
    </div>

    <h3>소제목</h3>
    <ul>
      <li><strong>항목</strong> - 설명</li>
    </ul>

    <!-- 스크린샷 플레이스홀더 -->
    <div class="screenshot">
      <div class="label">스크린샷</div>
      <div class="desc">이 스크린샷에 대한 설명</div>
    </div>

    <!-- 네비게이션 (파일 하단) -->
    <div class="nav">
      <a href="session-XX.html">&larr; 이전: XX. 제목</a>
      <a href="../index.html">메인으로</a>
      <a href="session-XX.html">다음: XX. 제목 &rarr;</a>
    </div>

  </div>
  <script src="../js/screenshot.js"></script>
</body>
</html>
```

#### 주요 CSS 클래스

| 클래스 | 용도 |
|--------|------|
| `.header` > `.session-num` + `h1` + `.subtitle` | 페이지 헤더 (오렌지 뱃지) |
| `.terms` > `.term-item` > `.term-name` + `.term-desc` | 용어 사전 |
| `.box.box-info` | 정보 박스 (파란 왼쪽 테두리) |
| `.box.box-tip` | 팁 박스 (초록) |
| `.box.box-warn` | 경고 박스 (오렌지) |
| `.box.box-danger` | 위험 박스 (빨강) |
| `.box-title` | 박스 제목 |
| `.diagram` | 텍스트 다이어그램 (모노스페이스) |
| `.columns` > `.col` | 2단 레이아웃 |
| `.screenshot` > `.label` + `.desc` | 스크린샷 자리 |

---

### 4-3. 실습 가이드 (`labs/`)

**용도**: 단계별 따라하기 가이드. 학생이 직접 실행하며 따라감.

#### HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session XX 실습 - 제목</title>
  <link rel="stylesheet" href="css/lab.css">
</head>
<body>
  <div class="container">

    <!-- 헤더 -->
    <div class="header">
      <div class="badge">Lab XX</div>
      <h1>실습 제목</h1>
      <p class="subtitle">Session XX 실습 - 주제 | 소요 시간: 약 XX분</p>
    </div>

    <!-- 사전 준비 -->
    <div class="prerequisites">
      <h3>사전 준비 사항</h3>
      <ul>
        <li>필요한 것 1</li>
        <li>필요한 것 2</li>
      </ul>
    </div>

    <div class="box box-info">
      <div class="box-title">이번 실습의 목표</div>
      <p>이번 실습에서 달성할 목표 설명</p>
    </div>

    <!-- Step 1 -->
    <div class="step">
      <div class="step-header">
        <div class="step-num">1</div>
        <div class="step-title">단계 제목</div>
      </div>

      <p>설명...</p>

      <pre><code>$ 실행할_명령어</code></pre>

      <div class="screenshot">
        <div class="label">스크린샷</div>
        <div class="desc">이 단계 완료 후 보이는 화면 설명</div>
      </div>

      <div class="expected">
        <div class="expected-title">예상 결과</div>
        <p>이 단계를 완료하면 나타나는 결과 설명</p>
      </div>
    </div>

    <!-- Step 2, 3, ... -->

    <!-- 완료 체크리스트 (파일 하단) -->
    <div class="checklist">
      <h3>실습 완료 체크리스트</h3>
      <div class="check-item">
        <input type="checkbox"> 확인 항목 1
      </div>
      <div class="check-item">
        <input type="checkbox"> 확인 항목 2
      </div>
    </div>

    <!-- 네비게이션 -->
    <div class="nav">
      <a href="session-XX.html">&larr; 이전</a>
      <a href="../index.html">메인으로</a>
      <a href="session-XX.html">다음 &rarr;</a>
    </div>

  </div>
  <script src="../js/screenshot.js"></script>
</body>
</html>
```

#### 주요 CSS 클래스

| 클래스 | 용도 |
|--------|------|
| `.header` > `.badge` + `h1` + `.subtitle` | 페이지 헤더 (초록 뱃지) |
| `.prerequisites` | 사전 준비 박스 (오렌지 테두리) |
| `.step` > `.step-header` > `.step-num` + `.step-title` | 단계 카드 |
| `.expected` > `.expected-title` | 예상 결과 박스 (초록 테두리) |
| `.checklist` > `.check-item` > `input[checkbox]` | 완료 체크리스트 |
| `.box.box-info / .box-tip / .box-warn / .box-danger` | 정보 박스 (examples와 동일) |

---

### 4-4. 핸드아웃 (`handouts/`)

**용도**: 인쇄/PDF용 요약 자료 (3~5페이지). `Ctrl+P`로 PDF 저장.

#### HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session XX 핸드아웃 - 제목</title>
  <link rel="stylesheet" href="css/print.css">
</head>
<body>
  <div class="container">

    <!-- 헤더 -->
    <div class="header">
      <div class="header-left">
        <div class="session-num">Session XX</div>
        <h1>제목</h1>
      </div>
      <div class="header-right">
        과정명<br>
        부제목
      </div>
    </div>

    <!-- 학습 목표 -->
    <div class="objectives">
      <h3>학습 목표</h3>
      <ul>
        <li>목표 1</li>
        <li>목표 2</li>
      </ul>
    </div>

    <!-- 핵심 용어 테이블 -->
    <div class="key-terms">
      <h3>핵심 용어 정리</h3>
      <table>
        <thead>
          <tr>
            <th style="width:20%;">용어</th>
            <th style="width:35%;">설명</th>
            <th style="width:45%;">비유</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>용어명</strong></td>
            <td>기술적 설명</td>
            <td>일상 비유</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 본문 -->
    <h2>1. 섹션 제목</h2>
    <p>내용...</p>

    <div class="note">
      <strong>핵심 비유:</strong> 설명...
    </div>

    <!-- 체크리스트 -->
    <div class="checklist">
      <h3>학습 확인 체크리스트</h3>
      <ul>
        <li>확인 항목 1</li>  <!-- CSS가 ☐ 접두사 자동 추가 -->
        <li>확인 항목 2</li>
      </ul>
    </div>

    <!-- 네비게이션 -->
    <div class="nav">
      <a href="session-XX.html">&larr; 이전</a>
      <a href="../index.html">메인으로</a>
      <a href="session-XX.html">다음 &rarr;</a>
    </div>

  </div>
</body>
</html>
```

#### 특징

- **라이트 테마** (인쇄 최적화)
- `@media print` 규칙: 본문 10pt, 네비게이션 숨김, 페이지 넘김 방지
- `.note` 박스: 왼쪽 3px 검정 테두리
- `.checklist li::before`: `☐ ` 자동 삽입
- `.header`: 좌측(세션번호+제목) + 우측(과정 정보) flex 레이아웃

---

## 5. 메인 페이지 (`index.html`)

### 구조

```
hero (배경 그래디언트)
├── hero-badge: 과정 브랜드
├── h1: 과정 제목 (<em>으로 강조색)
├── subtitle: 과정 설명
├── hero-stats: 차시 수 / 자료 유형 / 파트 수
└── legend: 자료 유형 범례 (색상 점)

container
├── part (반복)
│   ├── part-header: 파트 번호 + 제목 + 구분선
│   └── sessions
│       └── card (반복)
│           ├── card-num: 세션 번호
│           ├── card-body: card-title + card-desc
│           └── card-links: 4종 자료 링크 버튼
│               ├── btn-slide (파랑)
│               ├── btn-example (오렌지)
│               ├── btn-lab (초록)
│               └── btn-handout (보라)

footer
```

### 파트 색상 매핑

| 파트 | CSS 클래스 | 뱃지 색상 |
|------|-----------|----------|
| Part 1 | `.part-1` | 파랑 (`--blue`) |
| Part 2 | `.part-2` | 초록 (`--green`) |
| Part 3 | `.part-3` | 보라 (`--purple`) |
| Part 4 | `.part-4` | 오렌지 (`--accent-light`) |
| Part 5 | `.part-5` | 빨강 (`--red`) |
| Part 6 | `.part-6` | 틸 (`--teal`) |

### 카드 링크 버튼

각 세션 카드에 4종 자료 링크. SVG 아이콘 포함:

```html
<div class="card-links">
  <a href="slides/session-XX.html" class="btn-slide">
    <svg><!-- 모니터 아이콘 --></svg>슬라이드</a>
  <a href="examples/session-XX.html" class="btn-example">
    <svg><!-- 책 아이콘 --></svg>예제</a>
  <a href="labs/session-XX.html" class="btn-lab">
    <svg><!-- 코드 아이콘 --></svg>실습</a>
  <a href="handouts/session-XX.html" class="btn-handout">
    <svg><!-- 문서 아이콘 --></svg>핸드아웃</a>
</div>
```

보충 세션(16a 등)은 일부 자료만 제공 가능 (예: slides + labs만).

---

## 6. 교수법 컨벤션

### 일상 비유 (핵심 교수법)

모든 기술 개념을 비전공자가 이해할 수 있는 일상 비유와 함께 소개합니다:

- 서버 → "식당의 웨이터 (주문을 받아 음식을 가져다줌)"
- 클라우드 → "넷플릭스 (DVD를 사지 않고 스트리밍)"
- IaaS/PaaS/SaaS → "빈 주방 빌리기 / 반죽 제공 / 완성 피자 배달"
- VPC → "건물의 울타리 (외부에서 함부로 못 들어옴)"

### 용어 소개 패턴

```
한국어 설명 + 영문 원어 (English Term)
```

예: `서버(Server)란, 24시간 365일 켜져 있으면서 사용자의 요청에 응답하는 컴퓨터입니다.`

### 세션 흐름

1. **개념 소개** (비유 중심) → 2. **예제 분석** (코드/화면 함께 보기) → 3. **따라하기** (직접 실습)

### 코드 블록 규칙

- 셸 명령어: `$` 접두사로 학생이 입력할 명령 표시
- 출력 결과: `$` 없이 표시
- 파일 내용: 언어 지정 (`language-java`, `language-yaml` 등)

```bash
$ ls -la          # ← 학생이 입력할 명령
total 32          # ← 출력 결과 ($ 없음)
drwxr-xr-x ...
```

### 강사 노트 (슬라이드 전용)

`<aside class="notes">` 안에 강사 가이드를 작성합니다. `S` 키로 스피커 뷰에서만 보입니다.

```html
<aside class="notes">
  첫 시간이므로 분위기를 편하게 잡아주세요.
  "컴퓨터를 잘 몰라도 괜찮습니다"라고 안내합니다.
</aside>
```

---

## 7. 스크린샷 시스템

`js/screenshot.js`는 모든 자료 유형(slides, examples, labs)에서 공유하는 스크린샷 관리 시스템입니다.

### 동작 방식

- **일반 방문**: 기존 업로드된 스크린샷 자동 로드, 빈 플레이스홀더 숨김
- **관리자 모드** (`?admin=smhrd`): 스크린샷 업로드/교체/삭제 + 콘텐츠 편집 + 저장

### 플레이스홀더 마크업

```html
<div class="screenshot">
  <div class="label">스크린샷</div>
  <div class="desc">이 스크린샷에 대한 설명 (자동 매칭에 사용됨)</div>
</div>
```

### 이미지 네이밍

`{type}-{session}-{index}.png` (예: `labs-03-5.png`)

### API 엔드포인트

`api/upload.php`에서 업로드/삭제/연결/HTML 저장을 처리합니다.

---

## 8. 새 과정 만들기 체크리스트

다른 주제로 교육 과정을 만들 때:

### 1단계: 프로젝트 초기화

```bash
mkdir my-course
cd my-course
mkdir -p slides/css examples/css labs/css handouts/css images js api
```

### 2단계: CSS 파일 복사

4개의 CSS 파일을 복사합니다. 주제에 따라 색상만 변경하세요:
- `slides/css/custom.css`
- `examples/css/example.css`
- `labs/css/lab.css`
- `handouts/css/print.css`

### 3단계: 과정 구조 설계

1. 전체 파트(Part) 수와 세션(Session) 수 결정
2. 각 세션의 제목과 설명 작성
3. `index.html` 생성 (메인 페이지)

### 4단계: 세션별 자료 작성

각 세션마다 4종 파일 생성:
1. `slides/session-XX.html` — 슬라이드 (template.html 기반)
2. `examples/session-XX.html` — 읽기 자료
3. `labs/session-XX.html` — 실습 가이드
4. `handouts/session-XX.html` — 인쇄용 핸드아웃

### 5단계: 커스터마이징 포인트

| 항목 | 위치 | 변경 내용 |
|------|------|----------|
| 과정 제목 | `index.html` hero, 각 파일 title | 새 과정명 |
| 파트 구성 | `index.html` `.part` 섹션들 | 파트 수, 이름, 색상 |
| 세션 목록 | `index.html` `.card` 요소들 | 세션 번호, 제목, 설명 |
| 브랜드 | `index.html` `.hero-badge` | 기관/브랜드명 |
| 색상 | 각 CSS 파일의 `:root` | 테마 색상 |
| 폰트 | 각 CSS 파일 상단 import | 한/영 폰트 |

---

## 9. 반응형 대응

모든 자료는 768px 이하에서 반응형 레이아웃을 지원합니다:

- `.columns` → `flex-direction: column` (세로 배치)
- `.container` → `padding: 1rem`
- 제목 크기 축소
- index.html 카드 링크: 4열 → 2열 그리드 (420px 이하)
- 슬라이드: 1024px 이하에서 기본 폰트 24px

---

## 10. 콘텐츠 작성 시 주의사항

1. **순수 HTML**: 빌드 도구나 프레임워크 없음. 마크다운이 아닌 HTML로 직접 작성
2. **CDN 의존성**: 모든 외부 라이브러리는 CDN 링크 사용 (로컬 설치 불필요)
3. **한글 우선**: 모든 UI 텍스트, 설명, 주석은 한국어
4. **비유 필수**: 새 개념 도입 시 반드시 일상 비유 포함
5. **단계적 공개**: 슬라이드에서 `fragment fade-up`으로 정보를 하나씩 보여줌
6. **스크린샷 자리**: 실제 캡처 전에 `.screenshot` 플레이스홀더를 미리 배치
7. **네비게이션 링크**: 각 파일 하단에 이전/메인/다음 링크 포함
8. **인쇄 최적화**: 핸드아웃은 3~5페이지 분량으로 제한
