# AGENTS.md — 영구 에이전트 시스템 단독 문서

> Spring 기초 과정 사이트의 **영구 에이전트(서브 에이전트) 6종**만 모아 단독 문서화합니다.
> 운영자(강사)와 다른 코스 제작자가 **이 한 파일만 읽고도** 시스템을 재사용할 수 있게 하는 것이 목표입니다.
> 마지막 갱신: 2026-05-01

---

## 1. 이 문서의 목적

이 저장소에는 다음 두 종류의 운영 문서가 있습니다.

- [`PLUGINS-AND-AGENTS.md`](./PLUGINS-AND-AGENTS.md) — **플러그인 + 에이전트 + 시각화 도구**가 모두 섞인 종합 문서 (836줄)
- **이 문서(`AGENTS.md`)** — 그중 **에이전트 시스템만** 따로 떼어내 정리한 단독 문서

「에이전트가 무엇이며, 어떻게 부르고, 어디까지 자율로 두는지」만 알고 싶을 때는 이 문서 하나만 보면 됩니다.

다음 두 부류의 독자를 가정합니다.

| 독자 | 우선 읽을 섹션 |
|------|--------------|
| 강사(운영자) — 새 차시 추가하려 함 | §4 표준 워크플로 → §3 각 에이전트의 입력·산출물 |
| 다른 코스 제작자 — 이 시스템을 자기 코스에 이식 | §8 다른 코스에서 재사용 → §3 각 에이전트 정의 |
| 신규 합류자 — 전체 그림이 필요 | §1 → §2 → §4 → §5 |

---

## 2. 영구 에이전트 6종 — 한 줄 요약

`/Users/jungyu/Desktop/study/spring/.claude/agents/` 아래에 정의 파일이 있습니다. 다음 세션부터 `subagent_type` 필드에 이름을 적어 직접 호출됩니다.

| 에이전트 | 역할 | tools | 호출 시점 |
|---------|------|-------|----------|
| **content-author** | 본문 4단계(불편→도구→적용→Before/After) 작성·보강 | Read, Write, Edit, Glob, Grep, Bash | 새 차시 작성 / 차시 보강 |
| **visual-designer** | 인포그래픽(SVG)·실사 이미지·도식 결정·삽입 | Read, Write, Edit, Glob, Grep, Bash | 본문 작성이 끝난 직후 |
| **convention-auditor** | CLAUDE.md 컨벤션 위반 read-only 점검 | Read, Glob, Grep, Bash | 차시 완성 직후 / PR 직전 |
| **flow-verifier** | 흐름도·미니맵·Checkpoint 3종 + 4단계 분포 read-only 점검 | Read, Glob, Grep, Bash | 차시 완성 직후 (병렬) |
| **documentation-curator** | `프로젝트-기록.md`·`index.html` 메타 갱신 | Read, Write, Edit, Glob, Grep, Bash | 마일스톤 / 시스템 변경 직후 |
| **layout-verifier** | 슬라이드 720px 오버플로 휴리스틱 점검 | Read, Bash, Grep, Glob | 차시 완성 후 (병렬) |

**역할 분리 원칙**: 각 에이전트는 단일 책임이며 다른 에이전트의 영역을 침범하지 않습니다. 검증 3종(convention/flow/layout)은 모두 read-only이며, 수정은 content-author / visual-designer / documentation-curator만 가능합니다.

---

## 3. 각 에이전트 — 자세히

### 3.1 content-author

**핵심 역할**
차시의 본문 텍스트와 코드를 모두 책임지는 콘텐츠 작가입니다. `slides/`, `examples/`, `labs/`, `handouts/` 4종 산출물을 4단계 구조(불편 → 도구 → 적용 → Before/After)로 작성합니다. 흐름도 슬라이드(슬라이드 마지막 직전), 미니맵(examples/labs 첫 페이지), Checkpoint(labs의 모든 Step 마지막)는 자료 유형별 필수 요소입니다. 작성한 본문 마지막에 `<div data-infographic="이름">` 자리를 비워두어 visual-designer에게 핸드오프합니다.

**호출 예시**
```js
Agent({
  description: "Part 5 인터셉터 차시 작성",
  subagent_type: "content-author",
  prompt: `다음 차시의 산출물 4종을 생성하세요.
- 차시 주제: 인터셉터로 로그인 가드 적용
- 버전 진화: v3 → v4 (★ 마일스톤)
- Part 약어: auth, 색상 .part-5
- 본문 안에서만 쓸 비유: 식당 입구의 도어맨
- 산출물:
  1. slides/auth-v4-interceptor.html (18~22 슬라이드)
  2. examples/auth-v4-interceptor.html (다크, 미니맵 첫 페이지)
  3. labs/auth-v4-interceptor.html (Step별 Checkpoint 필수)
  4. handouts/auth-v4-interceptor.html (라이트, @media print)
CLAUDE.md 컨벤션 준수.`
})
```

**절대 금지사항**
- 인포그래픽 SVG 함수 작성 (visual-designer 영역)
- `js/infographics.js`·`images/` 수정 (visual-designer 영역)
- `index.html` 카드 추가 (documentation-curator 영역)
- 새 CSS 클래스 발명 — `slides/css/custom.css`의 기존 클래스만 사용
- 차시 번호·「비전공자」 노출, 비유의 제목·라벨 사용

**입력**
차시 주제, 버전 진화 정보(v_n_ → v_n+1_), Part 약어, 사용할 비유어, 자료 docx 발췌(있다면)

**산출물**
- `slides/<part약어>-<키워드>.html`
- `examples/<part약어>-<키워드>.html`
- `labs/<part약어>-<키워드>.html`
- `handouts/<part약어>-<키워드>.html`
- 각 파일에 `<div data-infographic="이름">` 자리 1개

**핸드오프**
완료 직후 visual-designer에게 4파일 경로 전달.

---

### 3.2 visual-designer

**핵심 역할**
content-author가 작성한 본문에 시각 자산을 채워 넣는 디자이너입니다. `<div data-infographic="이름">` 자리를 SVG 인포그래픽으로 채우거나, `.new-tool`/`.pain-point` 박스 안에 Unsplash CC0 실사 이미지를 삽입합니다. 같은 자리에 사진 + 인포그래픽을 동시에 넣지 않으며, 본문은 변형하지 않고 시각 자산만 추가합니다. `js/infographics.js`의 PALETTE와 기존 함수 패턴을 따릅니다.

**호출 예시**
```js
Agent({
  description: "auth-v4-interceptor 4파일에 시각 자산 채우기",
  subagent_type: "visual-designer",
  prompt: `다음 4파일의 <div data-infographic="..."> 자리를 채우고
.new-tool 박스에 실사 이미지를 삽입하세요.
- slides/auth-v4-interceptor.html
- examples/auth-v4-interceptor.html
- labs/auth-v4-interceptor.html
- handouts/auth-v4-interceptor.html

작업:
1. 인포그래픽 「interceptor-flow」를 js/infographics.js에 새 함수로 추가
   (viewBox 900x500, PALETTE 색상만)
2. .new-tool 박스에 도어맨 이미지(images/doorman.jpg) 삽입
   max-width 380px, opacity 0.9
3. node --check js/infographics.js 로 문법 검증`
})
```

**절대 금지사항**
- 본문 텍스트·코드 변형 (content-author 영역)
- PALETTE 외 색상 사용
- 새 CSS 클래스 발명
- 같은 슬라이드에 사진 + 인포그래픽 동시 삽입
- `index.html`·운영 문서 수정 (documentation-curator 영역)

**입력**
content-author가 만든 4파일 경로, 본문 안에서 사용된 비유어

**산출물**
- `js/infographics.js`의 새 함수 + REGISTRY 등록
- `images/<key>.jpg` (Unsplash CC0)
- 슬라이드의 `.new-tool`/`.pain-point` 안에 `<img>` 삽입

**핸드오프**
검증 3종(convention/flow/layout)에 자산 위치 보고.

---

### 3.3 convention-auditor

**핵심 역할**
CLAUDE.md의 「절대 하지 말 것」 목록을 기준으로 차시 4파일을 read-only 점검하는 감사관입니다. 차시 번호·「비전공자」 노출, 비유의 제목/라벨 사용, 후속 과정 주제(JPA/JWT/Docker/SOLID/전역예외) 도입, Part 약어 일치, CSS 클래스 일관성 등 10개 항목을 검사하고 PASS/FAIL 보고서만 반환합니다. 수정은 절대 하지 않습니다.

**호출 예시**
```js
Agent({
  description: "auth-v4-interceptor 컨벤션 감사",
  subagent_type: "convention-auditor",
  prompt: `다음 4파일을 CLAUDE.md 10개 컨벤션 항목으로 감사하세요.
- slides/auth-v4-interceptor.html
- examples/auth-v4-interceptor.html
- labs/auth-v4-interceptor.html
- handouts/auth-v4-interceptor.html

각 항목에 대해 PASS/FAIL과 라인 번호를 표시하세요.
수정 제안만 가능, 직접 수정 금지.`
})
```

**절대 금지사항**
- Edit / Write 도구 호출 (read-only)
- 위반 자동 수정
- CLAUDE.md 외 기준 추가 (개인 취향 검열 금지)
- flow-verifier / layout-verifier 영역 검증 (역할 분리)

**입력**
점검 대상 파일 경로 목록

**산출물**
PASS/FAIL 보고서(250단어 이내) — 항목별 라인 번호와 권장 수정안 포함

**핸드오프**
FAIL 항목 있으면 content-author로 루프, 모두 PASS면 documentation-curator로.

---

### 3.4 flow-verifier

**핵심 역할**
데이터 흐름 3종 컨벤션(흐름도 슬라이드·미니맵·Checkpoint) 표준 준수 + 4단계 분포(P1 불편 / P2 도구 / P3 적용 / P4 비교) 임계치를 점검하는 read-only 검증관입니다. 흐름도가 마지막 직전에 위치하는지, 새로 생긴 칸이 강조되는지, examples/labs 첫 페이지에 미니맵이 있는지, labs의 모든 Step에 Checkpoint가 있는지를 grep + 구조 분석으로 확인합니다. 참고 슬라이드는 `slides/web-stateless-cookie-session.html`입니다.

**호출 예시**
```js
Agent({
  description: "auth-v4-interceptor 흐름·구조 검증",
  subagent_type: "flow-verifier",
  prompt: `다음 4파일에서 데이터 흐름 3종과 4단계 분포를 검증하세요.
- slides/auth-v4-interceptor.html
- examples/auth-v4-interceptor.html
- labs/auth-v4-interceptor.html
- handouts/auth-v4-interceptor.html

마일스톤 차시 임계치: P1≥2, P2≥2, P3≥2, P4≥1
각 항목 PASS/FAIL과 위치 보고.`
})
```

**절대 금지사항**
- 파일 수정
- 임계치 미달이라도 자동 보강 (제안만)
- convention-auditor 영역(차시 번호·비전공자·비유 위치) 검증

**입력**
점검 대상 파일 경로 목록, 차시 종류(◇/▣/◆/★)

**산출물**
흐름도 위치 / 4단계 분포 / 미니맵 / Checkpoint 항목별 PASS/FAIL 보고서(250단어 이내)

**핸드오프**
누락 있으면 content-author로 루프, 모두 PASS면 documentation-curator로.

---

### 3.5 documentation-curator

**핵심 역할**
학생용 본문은 손대지 않고 운영 문서만 갱신하는 큐레이터입니다. 마일스톤 도달이나 시스템 변경 시 `프로젝트-기록.md`, `CURRICULUM-AUTHORING-GUIDE.md`, `PLUGINS-AND-AGENTS.md`, `index.html`의 메타 영역을 갱신합니다. 새 차시가 추가되면 `index.html`의 해당 Part 카드 그리드에 카드 1장(기호 + 키워드, 차시 번호 없음)을 추가합니다. 마일스톤은 `<div class="version-badge">v_N_</div>`도 함께.

**호출 예시**
```js
Agent({
  description: "auth-v4-interceptor 마일스톤 메타 갱신",
  subagent_type: "documentation-curator",
  prompt: `다음 차시가 완성되었습니다.
- auth-v4-interceptor (★ 마일스톤, v3 → v4)
- 4파일 모두 검증 통과

갱신 대상:
1. 프로젝트-기록.md — Part 5 섹션에 한 줄 추가, 헤더·푸터 일자 동기화
2. index.html — Part 5 카드 그리드에 카드 1장 추가
   - .version-badge "v4" 함께 노출
   - 차시 번호 표시 절대 금지
3. PLUGINS-AND-AGENTS.md — 변경 사항 있으면만`
})
```

**절대 금지사항**
- `slides/`·`examples/`·`labs/`·`handouts/` 수정 (content-author 영역)
- `js/infographics.js`·`images/` 수정 (visual-designer 영역)
- `index.html`의 hero·footer·메타 정보 변경 (사용자 승인 필요)
- 상대 시점("어제", "지난주") 사용 — 항상 `2026-MM-DD` 절대 일자
- 차시 번호 노출

**입력**
변경된 차시 메타데이터(주제·버전·기호·Part·마일스톤 여부)

**산출물**
운영 문서 diff(파일별 수정 위치만, 본문 덤프 없음, 150단어 이내)

**핸드오프**
종료 — 사이클의 끝.

---

### 3.6 layout-verifier

**핵심 역할**
reveal.js 5.1.0 night 테마(1280×720, margin 0.06 → 안전 영역 약 633px) 슬라이드가 viewport를 넘지 않는지 휴리스틱으로 점검합니다. `scripts/check-overflow.js`를 실행하고 FAIL/WARN 섹션에 대한 분할 제안만 제시합니다. 직접 수정은 하지 않으며, 분할 작업은 content-author로 핸드오프합니다. 휴리스틱 ±15% 오차가 있어 WARN은 무시 가능, FAIL만 반드시 분할.

**호출 예시**
```js
Agent({
  description: "auth-v4-interceptor 슬라이드 오버플로 검사",
  subagent_type: "layout-verifier",
  prompt: `다음 슬라이드의 오버플로를 검사하세요.
- slides/auth-v4-interceptor.html

작업:
1. node scripts/check-overflow.js slides/auth-v4-interceptor.html 실행
2. FAIL 섹션마다 §N-a / §N-b 분할 제안
3. WARN은 미세 조정만 권고
4. 직접 수정 금지 — content-author에 핸드오프할 분할안만 제시`
})
```

**절대 금지사항**
- 슬라이드 파일 직접 수정
- 분할 결과 슬라이드 갯수 강제 (분량 가이드 우선)
- convention-auditor / flow-verifier 영역 검증

**입력**
점검 대상 슬라이드 파일 경로

**산출물**
섹션별 OK/WARN/FAIL 분류 + FAIL 섹션 분할 제안서(300단어 이내)

**핸드오프**
FAIL 있으면 content-author에 분할 의뢰, 모두 OK면 종료.

---

## 4. 표준 워크플로 — 새 차시 추가 시

```
사용자 요청 「Part 5 에 새 차시 추가」
        │
        ▼
[1] content-author (직렬)
    └─ slides / examples / labs / handouts 4종 작성
       <div data-infographic="..."> 자리 비워둠
        │
        ▼
[2] visual-designer (직렬)
    └─ 인포그래픽 SVG 등록 + 실사 이미지 삽입
        │
        ▼
[3] convention-auditor + flow-verifier + layout-verifier (병렬, read-only)
    ├─ CLAUDE.md 10개 항목
    ├─ 흐름 3종 + 4단계 분포
    └─ 720px 오버플로
        │
   ┌────┴────┐
   │ FAIL?   │
   ├─ Yes ──→ content-author로 루프 (해당 영역만 수정)
   │ No
        │
        ▼
[4] documentation-curator (직렬, 마일스톤일 때만)
    └─ 프로젝트-기록.md + index.html 카드 갱신
        │
        ▼
   사용자 검토 → 머지
```

**각 단계의 핸드오프 자리**

| 핸드오프 | 형식 |
|---------|------|
| content-author → visual-designer | `<div data-infographic="이름">` 빈 자리 + `.new-tool`의 비유 단어 |
| visual-designer → 검증 3종 | 추가한 자산 파일 경로 (인포그래픽 함수명, 이미지 경로) |
| 검증 3종 → content-author (FAIL 시) | 위반·누락 항목 라인 번호 + 권장 수정안 |
| 검증 3종 → documentation-curator (PASS 시) | 차시 메타데이터(주제·버전·기호·마일스톤 여부) |

**병렬 안전성**
read-only 검증 3종은 동시에 호출해도 안전합니다(파일을 수정하지 않음). 반대로 content-author가 같은 파일에 두 번 호출되면 충돌하므로 항상 직렬로 부릅니다.

---

## 5. 검증된 협업 사례 (Spring 기초 프로젝트 기록)

이 시스템이 실제로 동작한 패턴 3가지.

### 5.1 ◆ team-collaboration 차시 신설 — 5개 에이전트 풀 체인

신규 전환점 차시(◆) 한 개를 만들면서 **content-author → visual-designer → convention-auditor + flow-verifier + layout-verifier (병렬) → documentation-curator** 의 풀 체인을 한 번에 돌렸습니다. 검증 3종은 모두 PASS, documentation-curator가 `index.html` Part 섹션에 카드 1장 추가하고 종료. 휴먼 개입 0회.

### 5.2 슬라이드 분할 — 4 Part 병렬 content-author + layout-verifier 재검증

기존 차시들에서 layout-verifier가 다수의 FAIL을 반환했고, 분할 작업을 **Part별로 4개 content-author 에이전트를 병렬 호출**해 진행했습니다(서로 다른 파일을 수정하므로 충돌 없음). 분할 후 layout-verifier로 재검증하여 모두 OK 확인.

### 5.3 CODE-STANDARD 도입 — 4 Part 병렬 + 모든 코드 슬라이드 통일

코드 스타일 표준을 새로 정해 모든 코드 등장 슬라이드에 일괄 적용. content-author 4개 병렬(Part별), 이후 convention-auditor 단독 호출로 일관성 검증.

---

## 6. 동시 동작 시 주의사항

### 6.1 충돌 가능 패턴 (피할 것)

- **두 에이전트가 같은 파일을 동시에 쓰기** → 마지막 쓰기가 이긴다. 항상 직렬로.
- **명확화 메시지를 별도 에이전트로 보내기** → 새 에이전트 인스턴스라 맥락이 달라 의도 오해 가능.
- **content-author 호출 도중 visual-designer 호출** → 본문이 아직 미완이라 인포그래픽 자리가 없을 수 있음.

### 6.2 안전 패턴 (권장)

| 패턴 | 안전성 |
|------|-------|
| 한 번에 한 차시씩 처리 | 가장 안전 |
| 명확히 분리된 파일 그룹만 병렬 (예: Part별 4개) | 안전 |
| read-only 검증 에이전트끼리 동시 호출 | 안전 |
| content-author와 visual-designer 동시 호출 | 위험 (visual-designer가 빈 자리를 못 찾음) |
| 두 content-author가 같은 파일 수정 | 금지 |

### 6.3 체크리스트

작업 전:
- [ ] 수정 대상 파일이 다른 에이전트와 겹치지 않는가
- [ ] 호출 순서가 §4 표준 워크플로와 일치하는가
- [ ] 검증 3종은 본문/시각 자산이 모두 갖춰진 후 호출하는가

---

## 7. 영구 등록 vs 임시 호출

### 7.1 영구 등록 (현재 방식)

`.claude/agents/<이름>.md` 파일로 정의되어 다음 세션부터 직접 호출됩니다.

```
/Users/jungyu/Desktop/study/spring/.claude/agents/
├── content-author.md
├── convention-auditor.md
├── documentation-curator.md
├── flow-verifier.md
├── layout-verifier.md
└── visual-designer.md
```

각 파일은 frontmatter에 `name`, `description`, `tools`, `model`을 명시하고 본문에 역할·금지사항·산출물 형식을 기록합니다.

호출 형식:
```js
Agent({
  description: "짧은 설명",
  subagent_type: "content-author",  // 정의 파일의 name과 동일
  prompt: "..."
})
```

### 7.2 임시 호출 (이 세션에서 사용한 패턴)

같은 세션 안에서 정의 파일을 읽지 않은 상태로 즉석 호출하려면 `general-purpose` 에이전트에 정의 파일 경로를 prompt에 포함해 호출합니다.

```js
Agent({
  description: "임시 컨벤션 감사",
  subagent_type: "general-purpose",
  prompt: `당신은 다음 정의를 따라 동작하세요.
정의 파일: /Users/jungyu/Desktop/study/spring/.claude/agents/convention-auditor.md
먼저 이 파일을 읽고, 그 안의 모든 규칙을 자기 행동 원칙으로 채택한 후 다음 파일을 감사하세요.
- slides/auth-v4-interceptor.html`
})
```

**언제 임시 호출이 유용한가**
- 정의 파일을 막 작성한 직후 — 영구 등록이 다음 세션에 적용되므로 이 세션에서는 임시로
- 일회성 변형이 필요한 경우 — 영구 정의는 그대로 두고 prompt로만 변형

---

## 8. 다른 코스에서 재사용

이 6개 에이전트 정의는 **코스에 거의 독립적**입니다. 다음 4가지만 갱신하면 다른 코스(예: Java 기초, 프론트엔드 기초)에서도 그대로 동작합니다.

### 8.1 갱신 대상 4종

| 파일 | 갱신할 부분 | 코스별 차이 |
|------|----------|----------|
| `content-author.md` | 「Part 약어 표」 | 각 코스의 Part 구조 |
| `content-author.md` | 「핵심 비유 사전」 | 각 코스의 핵심 비유 매핑 |
| `flow-verifier.md` | 「참고 슬라이드 1개」 경로 | 잘 짜인 본보기 슬라이드 |
| `documentation-curator.md` | 「관리 대상 문서」 표 | 코스별 운영 문서 목록 |

### 8.2 변경 불필요 (코스 독립)

다음 항목은 어느 코스에서도 그대로 사용 가능:

- 4단계 구조(불편 → 도구 → 적용 → Before/After)
- 데이터 흐름 3종(흐름도 슬라이드 / 미니맵 / Checkpoint)
- 검증 3종의 역할 분리 (read-only)
- §4 표준 워크플로
- 차시 기호(◇▣◆★) 시스템

### 8.3 이식 체크리스트

새 코스에 이식할 때:
- [ ] `.claude/agents/` 디렉토리에 6개 .md 파일 복사
- [ ] §8.1의 4가지 코스별 부분만 수정
- [ ] 새 코스의 `CLAUDE.md`에 4단계 구조·흐름 3종 컨벤션 명시
- [ ] 참고 슬라이드 1개를 만들어 flow-verifier가 가리키도록
- [ ] 첫 차시를 §4 워크플로로 한 번 돌려보고 검증

---

## 9. 한계와 향후

### 9.1 알려진 한계

- **SendMessage 부재**: 진행 중인 에이전트와 도중 대화 불가 (Claude Code 한계). 의도를 잘못 잡으면 끝까지 잘못된 결과 → 처음부터 prompt를 정확히.
- **layout-verifier 휴리스틱 ±15% 오차**: WARN은 무시 가능, FAIL만 분할 대상. 실제 렌더링 검증은 Playwright 같은 헤드리스 브라우저가 필요하나 미도입.
- **트랜잭션 보장 없음**: 한 작업이 여러 에이전트에 의존하는데, 중간 단계 실패 시 자동 롤백 없음. content-author가 4파일 만들고 visual-designer가 실패하면 4파일은 그대로 남음 (수동 정리 필요).
- **에이전트 간 메모리 공유 없음**: 각 에이전트는 독립 컨텍스트. 핸드오프는 prompt를 통해서만.
- **휴먼 검토 자동화 없음**: 검증 3종 PASS여도 학습 효과는 사람이 봐야 평가됨.

### 9.2 향후 개선 후보

- **Playwright 기반 layout-verifier 강화**: 실제 렌더링으로 휴리스틱 대체
- **roll-back 스크립트**: 중간 실패 시 4파일 일괄 삭제
- **차시 카드 자동 검증**: documentation-curator가 추가한 카드가 index.html 그리드에 잘 들어갔는지 시각 회귀 테스트
- **음성/접근성 검증 에이전트**: alt 텍스트·헤딩 레벨·콘트라스트 체크

---

## 부록 A — 파일 위치

| 항목 | 절대 경로 |
|------|---------|
| 에이전트 정의 디렉토리 | `/Users/jungyu/Desktop/study/spring/.claude/agents/` |
| 종합 운영 문서 | `/Users/jungyu/Desktop/study/spring/PLUGINS-AND-AGENTS.md` |
| 프로젝트 컨벤션 | `/Users/jungyu/Desktop/study/spring/CLAUDE.md` |
| 참고 슬라이드 (flow-verifier) | `/Users/jungyu/Desktop/study/spring/slides/web-stateless-cookie-session.html` |
| 오버플로 검사 스크립트 | `/Users/jungyu/Desktop/study/spring/scripts/check-overflow.js` |
| 인포그래픽 레지스트리 | `/Users/jungyu/Desktop/study/spring/js/infographics.js` |

## 부록 B — 한 줄 호출 치트시트

```js
// 새 차시 작성
Agent({ subagent_type: "content-author", description: "...", prompt: "..." })

// 본문 작성 후 시각 자산
Agent({ subagent_type: "visual-designer", description: "...", prompt: "..." })

// 검증 3종 (병렬 호출 가능, 한 메시지에 3개 동시)
Agent({ subagent_type: "convention-auditor", description: "...", prompt: "..." })
Agent({ subagent_type: "flow-verifier",      description: "...", prompt: "..." })
Agent({ subagent_type: "layout-verifier",    description: "...", prompt: "..." })

// 마일스톤 메타 갱신
Agent({ subagent_type: "documentation-curator", description: "...", prompt: "..." })
```

---

*이 문서는 [`PLUGINS-AND-AGENTS.md`](./PLUGINS-AND-AGENTS.md) §4·§5에서 에이전트 부분만 추출·재구성한 단독 문서입니다. 종합 시스템 맥락(플러그인·시각화 도구 포함)은 원본을 참조하세요.*
