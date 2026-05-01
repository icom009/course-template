/* =========================================================================
   js/infographics.js — 재사용 가능한 SVG 인포그래픽 모음
   슬라이드/예제에서 <div data-infographic="이름"></div> 형태로 호출
   ========================================================================= */
(function () {
  'use strict';

  const PALETTE = {
    bg:        '#1a1a2e',
    surface:   '#16213e',
    text:      '#e2e8f0',
    muted:     '#94a3b8',
    accent:    '#f59e0b',
    blue:      '#3b82f6',
    green:     '#22c55e',
    red:       '#ef4444',
    purple:    '#a855f7',
    teal:      '#14b8a6',
    border:    '#475569'
  };

  // ------------------------------------------------------------------
  // 1) 클라이언트 ↔ 서버 (요청·응답)
  // ------------------------------------------------------------------
  const clientServer = () => `
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <defs>
    <linearGradient id="cs-client" x1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PALETTE.blue}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${PALETTE.blue}" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="cs-server" x1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PALETTE.accent}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${PALETTE.accent}" stop-opacity="0.1"/>
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.text}"/>
    </marker>
  </defs>

  <!-- 클라이언트 -->
  <rect x="40" y="80" width="220" height="160" rx="14"
        fill="url(#cs-client)" stroke="${PALETTE.blue}" stroke-width="2"/>
  <text x="150" y="125" text-anchor="middle" font-size="32" fill="${PALETTE.text}">🧑</text>
  <text x="150" y="170" text-anchor="middle" font-size="18" font-weight="700"
        fill="${PALETTE.text}">클라이언트</text>
  <text x="150" y="195" text-anchor="middle" font-size="13"
        fill="${PALETTE.muted}">Client</text>
  <text x="150" y="220" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">크롬 · 사파리 · 앱</text>

  <!-- 서버 -->
  <rect x="500" y="80" width="220" height="160" rx="14"
        fill="url(#cs-server)" stroke="${PALETTE.accent}" stroke-width="2"/>
  <text x="610" y="125" text-anchor="middle" font-size="32" fill="${PALETTE.text}">🖥️</text>
  <text x="610" y="170" text-anchor="middle" font-size="18" font-weight="700"
        fill="${PALETTE.text}">서버</text>
  <text x="610" y="195" text-anchor="middle" font-size="13"
        fill="${PALETTE.muted}">Server</text>
  <text x="610" y="220" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">24시간 켜진 컴퓨터</text>

  <!-- 요청 화살표 -->
  <line x1="270" y1="135" x2="490" y2="135"
        stroke="${PALETTE.green}" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="380" y="125" text-anchor="middle" font-size="14"
        fill="${PALETTE.green}" font-weight="700">요청 (Request)</text>
  <text x="380" y="148" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">"이 페이지 줘"</text>

  <!-- 응답 화살표 -->
  <line x1="490" y1="195" x2="270" y2="195"
        stroke="${PALETTE.accent}" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="380" y="183" text-anchor="middle" font-size="14"
        fill="${PALETTE.accent}" font-weight="700">응답 (Response)</text>
  <text x="380" y="215" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">HTML · JSON · 이미지</text>

  <!-- 캡션 -->
  <text x="380" y="40" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">웹의 가장 기본 단위</text>
  <text x="380" y="290" text-anchor="middle" font-size="13"
        fill="${PALETTE.muted}">반드시 클라이언트가 먼저 — 서버는 응답만</text>
</svg>`;

  // ------------------------------------------------------------------
  // 2) HTTP 메시지 구조
  // ------------------------------------------------------------------
  const httpAnatomy = () => `
<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="30" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">HTTP 메시지의 3단 구조</text>

  <!-- 요청 메시지 -->
  <text x="60" y="75" font-size="14" font-weight="700" fill="${PALETTE.green}">📤 요청 메시지</text>

  <rect x="60" y="90" width="290" height="40" rx="6"
        fill="${PALETTE.green}" fill-opacity="0.2" stroke="${PALETTE.green}"/>
  <text x="75" y="115" font-family="JetBrains Mono, monospace" font-size="13"
        fill="${PALETTE.text}">GET /board/list HTTP/1.1</text>
  <text x="340" y="115" text-anchor="end" font-size="11" fill="${PALETTE.muted}">① 요청 라인</text>

  <rect x="60" y="138" width="290" height="80" rx="6"
        fill="${PALETTE.blue}" fill-opacity="0.15" stroke="${PALETTE.blue}"/>
  <text x="75" y="160" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">Host: example.com</text>
  <text x="75" y="180" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">Accept: text/html</text>
  <text x="75" y="200" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">Cookie: session=abc</text>
  <text x="340" y="160" text-anchor="end" font-size="11" fill="${PALETTE.muted}">② 헤더</text>

  <rect x="60" y="226" width="290" height="40" rx="6"
        fill="${PALETTE.muted}" fill-opacity="0.15" stroke="${PALETTE.muted}" stroke-dasharray="4"/>
  <text x="75" y="251" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.muted}">(GET 은 보통 비어있음)</text>
  <text x="340" y="251" text-anchor="end" font-size="11" fill="${PALETTE.muted}">③ 바디</text>

  <!-- 응답 메시지 -->
  <text x="410" y="75" font-size="14" font-weight="700" fill="${PALETTE.accent}">📥 응답 메시지</text>

  <rect x="410" y="90" width="290" height="40" rx="6"
        fill="${PALETTE.accent}" fill-opacity="0.2" stroke="${PALETTE.accent}"/>
  <text x="425" y="115" font-family="JetBrains Mono, monospace" font-size="13"
        fill="${PALETTE.text}">HTTP/1.1 200 OK</text>
  <text x="690" y="115" text-anchor="end" font-size="11" fill="${PALETTE.muted}">① 상태 라인</text>

  <rect x="410" y="138" width="290" height="80" rx="6"
        fill="${PALETTE.blue}" fill-opacity="0.15" stroke="${PALETTE.blue}"/>
  <text x="425" y="160" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">Content-Type: text/html</text>
  <text x="425" y="180" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">Content-Length: 12345</text>
  <text x="690" y="160" text-anchor="end" font-size="11" fill="${PALETTE.muted}">② 헤더</text>

  <rect x="410" y="226" width="290" height="60" rx="6"
        fill="${PALETTE.purple}" fill-opacity="0.15" stroke="${PALETTE.purple}"/>
  <text x="425" y="248" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">&lt;!DOCTYPE html&gt;</text>
  <text x="425" y="268" font-family="JetBrains Mono, monospace" font-size="12"
        fill="${PALETTE.text}">&lt;html&gt;...&lt;/html&gt;</text>
  <text x="690" y="248" text-anchor="end" font-size="11" fill="${PALETTE.muted}">③ 바디 (HTML)</text>

  <!-- 상태 코드 4개 -->
  <text x="380" y="320" text-anchor="middle" font-size="13"
        fill="${PALETTE.text}" font-weight="700">상태 코드 4 가지를 외우세요:</text>
  <text x="380" y="345" text-anchor="middle" font-size="12">
    <tspan fill="${PALETTE.green}">200 OK</tspan>
    <tspan fill="${PALETTE.muted}">  ·  </tspan>
    <tspan fill="${PALETTE.accent}">302 Redirect</tspan>
    <tspan fill="${PALETTE.muted}">  ·  </tspan>
    <tspan fill="${PALETTE.red}">404 Not Found</tspan>
    <tspan fill="${PALETTE.muted}">  ·  </tspan>
    <tspan fill="${PALETTE.red}">500 Server Error</tspan>
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 3) MVC 6 계층 구조
  // ------------------------------------------------------------------
  const mvc6Layers = () => `
<svg viewBox="0 0 760 460" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <defs>
    <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.text}"/>
    </marker>
  </defs>

  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">Spring MVC 의 6 계층</text>

  ${[
    {y: 60,  name: 'DispatcherServlet', desc: '안내데스크 — 모든 요청 진입점',          color: PALETTE.purple},
    {y: 120, name: 'Controller',         desc: '종업원 — 요청 응대',                     color: PALETTE.blue},
    {y: 180, name: 'Service',            desc: '메인 셰프 — 비즈니스 로직 + 트랜잭션',  color: PALETTE.green},
    {y: 240, name: 'DAO / Repository',   desc: '창고 관리자 — DB 접근만',                color: PALETTE.accent},
    {y: 300, name: 'DTO / VO',           desc: '그릇 — 데이터 운반',                     color: PALETTE.teal},
    {y: 360, name: 'View (JSP)',         desc: '식탁 — 화면 표시',                       color: PALETTE.red}
  ].map((l, i) => `
    <rect x="100" y="${l.y}" width="560" height="48" rx="8"
          fill="${l.color}" fill-opacity="0.18" stroke="${l.color}" stroke-width="2"/>
    <text x="125" y="${l.y + 30}" font-size="16" font-weight="700" fill="${PALETTE.text}">${l.name}</text>
    <text x="640" y="${l.y + 30}" text-anchor="end" font-size="13" fill="${PALETTE.muted}">${l.desc}</text>
    ${i < 5 ? `<line x1="380" y1="${l.y + 48}" x2="380" y2="${l.y + 60}" stroke="${PALETTE.text}" stroke-width="2" marker-end="url(#arr2)"/>` : ''}
  `).join('')}

  <text x="380" y="430" text-anchor="middle" font-size="13" fill="${PALETTE.muted}">
    의존 방향은 위 → 아래 한 방향. 거꾸로는 절대 X.
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 4) v0 → v∞ 진화 타임라인
  // ------------------------------------------------------------------
  const versionTimeline = () => `
<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">우리 프로젝트의 진화 — v0 → v∞</text>

  <!-- 타임라인 -->
  <line x1="40" y1="140" x2="720" y2="140" stroke="${PALETTE.border}" stroke-width="2"/>

  ${[
    {x: 40,  v: 'v0',   label: 'Hello',     part: 'Part 1', color: PALETTE.blue},
    {x: 120, v: 'v0.5', label: '종단간',    part: 'Part 3', color: PALETTE.purple},
    {x: 200, v: 'v1',   label: '첫 DB',     part: 'Part 4', color: PALETTE.accent},
    {x: 280, v: 'v3',   label: '안전 인증', part: 'Part 5', color: PALETTE.red},
    {x: 360, v: 'v4',   label: '인터셉터',  part: 'Part 5', color: PALETTE.red},
    {x: 450, v: 'v6',   label: '안전 게시판',part: 'Part 5', color: PALETTE.red},
    {x: 540, v: 'v8',   label: 'REST',      part: 'Part 6', color: PALETTE.teal},
    {x: 620, v: 'v9',   label: '비동기',    part: 'Part 6', color: PALETTE.teal},
    {x: 700, v: 'v∞',   label: '디버깅',    part: 'Part 6', color: PALETTE.green}
  ].map(p => `
    <circle cx="${p.x}" cy="140" r="16" fill="${p.color}" stroke="${PALETTE.text}" stroke-width="2"/>
    <text x="${p.x}" y="145" text-anchor="middle" font-size="11"
          font-weight="700" fill="${PALETTE.text}">${p.v}</text>
    <text x="${p.x}" y="180" text-anchor="middle" font-size="11"
          fill="${p.color}" font-weight="700">${p.label}</text>
    <text x="${p.x}" y="195" text-anchor="middle" font-size="9"
          fill="${PALETTE.muted}">${p.part}</text>
  `).join('')}

  <text x="380" y="240" text-anchor="middle" font-size="13" fill="${PALETTE.muted}">
    같은 프로젝트가 단계별로 진화 — 「불편 → 도구 → 다시 만들기」 의 반복
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 5) 쿠키 vs 세션
  // ------------------------------------------------------------------
  const cookieVsSession = () => `
<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">쿠키와 세션 — 무엇을 어디에 저장?</text>

  <!-- 쿠키 -->
  <rect x="40" y="60" width="320" height="270" rx="14"
        fill="${PALETTE.blue}" fill-opacity="0.1" stroke="${PALETTE.blue}" stroke-width="2"/>
  <text x="200" y="95" text-anchor="middle" font-size="22" fill="${PALETTE.text}">🍪</text>
  <text x="200" y="125" text-anchor="middle" font-size="18" font-weight="700"
        fill="${PALETTE.blue}">쿠키 (Cookie)</text>
  <text x="200" y="148" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">브라우저 쪽 저장</text>

  <text x="60" y="180" font-size="13" fill="${PALETTE.text}">📍 위치: 사용자 PC</text>
  <text x="60" y="205" font-size="13" fill="${PALETTE.text}">🔓 보안: 약함</text>
  <text x="60" y="230" font-size="13" fill="${PALETTE.text}">📦 용량: 4 KB</text>
  <text x="60" y="255" font-size="13" fill="${PALETTE.text}">⏱️ 매 요청 자동 동봉</text>
  <text x="60" y="290" font-size="12" fill="${PALETTE.muted}">사용처: 다크모드, 장바구니,</text>
  <text x="60" y="306" font-size="12" fill="${PALETTE.muted}">       비로그인 식별</text>

  <!-- 세션 -->
  <rect x="400" y="60" width="320" height="270" rx="14"
        fill="${PALETTE.accent}" fill-opacity="0.1" stroke="${PALETTE.accent}" stroke-width="2"/>
  <text x="560" y="95" text-anchor="middle" font-size="22" fill="${PALETTE.text}">🔑</text>
  <text x="560" y="125" text-anchor="middle" font-size="18" font-weight="700"
        fill="${PALETTE.accent}">세션 (Session)</text>
  <text x="560" y="148" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">서버 쪽 저장 + 손목 도장</text>

  <text x="420" y="180" font-size="13" fill="${PALETTE.text}">📍 위치: 서버 메모리</text>
  <text x="420" y="205" font-size="13" fill="${PALETTE.text}">🔒 보안: 강함</text>
  <text x="420" y="230" font-size="13" fill="${PALETTE.text}">📦 용량: 큼</text>
  <text x="420" y="255" font-size="13" fill="${PALETTE.text}">🎫 JSESSIONID 쿠키 매개</text>
  <text x="420" y="290" font-size="12" fill="${PALETTE.muted}">사용처: 로그인 정보, 권한</text>
  <text x="420" y="306" font-size="12" fill="${PALETTE.muted}">       민감 데이터</text>
</svg>`;

  // ------------------------------------------------------------------
  // 6) 동기 vs 비동기
  // ------------------------------------------------------------------
  const syncVsAsync = () => `
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">동기 vs 비동기 — 화면이 깜빡이느냐</text>

  <!-- 동기 -->
  <text x="200" y="65" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.red}">동기 (옛 방식)</text>
  ${[
    {x: 50,  label: '🖱️ 클릭'},
    {x: 110, label: '서버'},
    {x: 170, label: 'HTML 전체'},
    {x: 240, label: '⚡ 깜빡', highlight: true},
    {x: 310, label: '화면 그림'}
  ].map((s, i, a) => `
    <rect x="${s.x}" y="80" width="50" height="34" rx="6"
          fill="${s.highlight ? PALETTE.red : PALETTE.surface}"
          fill-opacity="${s.highlight ? '0.4' : '0.6'}"
          stroke="${s.highlight ? PALETTE.red : PALETTE.border}"/>
    <text x="${s.x + 25}" y="102" text-anchor="middle" font-size="11"
          fill="${PALETTE.text}">${s.label}</text>
    ${i < a.length - 1 ? `<text x="${s.x + 53}" y="100" font-size="14" fill="${PALETTE.muted}">→</text>` : ''}
  `).join('')}
  <text x="200" y="145" text-anchor="middle" font-size="11" fill="${PALETTE.muted}">
    매 클릭 = 페이지 통째로 새로고침
  </text>

  <!-- 구분선 -->
  <line x1="40" y1="170" x2="720" y2="170"
        stroke="${PALETTE.border}" stroke-dasharray="4"/>

  <!-- 비동기 -->
  <text x="200" y="200" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.green}">비동기 (현대)</text>
  ${[
    {x: 50,  label: '🖱️ 클릭'},
    {x: 110, label: 'fetch'},
    {x: 170, label: 'JSON 만'},
    {x: 240, label: 'JS 가'},
    {x: 310, label: '✨ 부분만', highlight: true}
  ].map((s, i, a) => `
    <rect x="${s.x}" y="215" width="50" height="34" rx="6"
          fill="${s.highlight ? PALETTE.green : PALETTE.surface}"
          fill-opacity="${s.highlight ? '0.4' : '0.6'}"
          stroke="${s.highlight ? PALETTE.green : PALETTE.border}"/>
    <text x="${s.x + 25}" y="237" text-anchor="middle" font-size="11"
          fill="${PALETTE.text}">${s.label}</text>
    ${i < a.length - 1 ? `<text x="${s.x + 53}" y="235" font-size="14" fill="${PALETTE.muted}">→</text>` : ''}
  `).join('')}
  <text x="200" y="280" text-anchor="middle" font-size="11" fill="${PALETTE.muted}">
    페이지 그대로 + 변하는 부분만 변함
  </text>

  <text x="540" y="160" font-size="12" fill="${PALETTE.text}" font-weight="700">📱 현대 웹의 표준</text>
  <text x="540" y="180" font-size="11" fill="${PALETTE.muted}">페이스북·인스타·네이버</text>
  <text x="540" y="195" font-size="11" fill="${PALETTE.muted}">실시간 검색·댓글</text>
</svg>`;

  // ------------------------------------------------------------------
  // 7) DI 의 효과 (강한 결합 vs 느슨한 결합)
  // ------------------------------------------------------------------
  const diEffect = () => `
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">DI 의 효과 — 강한 결합 → 느슨한 결합</text>

  <!-- 왼쪽: 강한 결합 -->
  <text x="180" y="65" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.red}">⚠️ 강한 결합 (new 직접)</text>

  <rect x="80" y="85" width="200" height="60" rx="10"
        fill="${PALETTE.red}" fill-opacity="0.15" stroke="${PALETTE.red}"/>
  <text x="180" y="120" text-anchor="middle" font-size="14"
        fill="${PALETTE.text}">OrderService</text>

  <line x1="180" y1="145" x2="180" y2="180" stroke="${PALETTE.red}"
        stroke-width="3" stroke-dasharray="2"/>
  <text x="200" y="167" font-size="11" fill="${PALETTE.red}">new (꽉 묶임)</text>

  <rect x="80" y="180" width="200" height="60" rx="10"
        fill="${PALETTE.red}" fill-opacity="0.15" stroke="${PALETTE.red}"/>
  <text x="180" y="215" text-anchor="middle" font-size="14"
        fill="${PALETTE.text}">GmailSender</text>

  <text x="180" y="270" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">부품 교체 →</text>
  <text x="180" y="288" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">OrderService 코드도 수정</text>

  <!-- 가운데 화살표 -->
  <text x="380" y="170" text-anchor="middle" font-size="32" fill="${PALETTE.accent}">→</text>
  <text x="380" y="195" text-anchor="middle" font-size="11"
        fill="${PALETTE.accent}" font-weight="700">DI 도입</text>

  <!-- 오른쪽: 느슨한 결합 -->
  <text x="580" y="65" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.green}">✓ 느슨한 결합 (DI)</text>

  <rect x="480" y="85" width="200" height="60" rx="10"
        fill="${PALETTE.green}" fill-opacity="0.15" stroke="${PALETTE.green}"/>
  <text x="580" y="120" text-anchor="middle" font-size="14"
        fill="${PALETTE.text}">OrderService</text>

  <line x1="580" y1="145" x2="580" y2="180" stroke="${PALETTE.green}"
        stroke-width="2"/>
  <text x="600" y="167" font-size="11" fill="${PALETTE.green}">@Autowired</text>

  <rect x="480" y="180" width="200" height="60" rx="10"
        fill="${PALETTE.blue}" fill-opacity="0.15" stroke="${PALETTE.blue}"
        stroke-dasharray="6"/>
  <text x="580" y="210" text-anchor="middle" font-size="14"
        fill="${PALETTE.text}">MessageSender</text>
  <text x="580" y="228" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">(인터페이스)</text>

  <text x="580" y="270" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">부품 교체 →</text>
  <text x="580" y="288" text-anchor="middle" font-size="11"
        fill="${PALETTE.green}">OrderService 0 줄 수정</text>
</svg>`;

  // ------------------------------------------------------------------
  // 8) 5 단계 디버깅 역추적
  // ------------------------------------------------------------------
  const debugFlow = () => `
<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">디버깅 5단계 역추적 — 화면에서 DB 로</text>

  ${[
    {y: 60,  num: '⑤', name: '응답 JSON / 화면', tool: 'F12 Network → Response',  color: PALETTE.purple},
    {y: 120, num: '④', name: 'DB SELECT 결과',  tool: 'DBeaver / Workbench',     color: PALETTE.accent},
    {y: 180, num: '③', name: 'Mapper SQL 로그', tool: '콘솔 SQL 출력',           color: PALETTE.teal},
    {y: 240, num: '②', name: '서버 콘솔 로그',  tool: 'Tomcat 콘솔',              color: PALETTE.green},
    {y: 300, num: '①', name: 'F12 Network 탭',  tool: 'Status Code · Payload',   color: PALETTE.blue}
  ].map(s => `
    <rect x="100" y="${s.y}" width="560" height="48" rx="8"
          fill="${s.color}" fill-opacity="0.18" stroke="${s.color}" stroke-width="2"/>
    <text x="125" y="${s.y + 32}" font-size="22" font-weight="700"
          fill="${s.color}">${s.num}</text>
    <text x="170" y="${s.y + 30}" font-size="14" font-weight="700" fill="${PALETTE.text}">${s.name}</text>
    <text x="640" y="${s.y + 30}" text-anchor="end" font-size="12" fill="${PALETTE.muted}">${s.tool}</text>
  `).join('')}

  <text x="80" y="200" font-size="20" fill="${PALETTE.accent}">⬆</text>
  <text x="80" y="100" font-size="11" fill="${PALETTE.muted}" text-anchor="middle">
    <tspan x="80" dy="0">화</tspan>
    <tspan x="80" dy="14">면</tspan>
    <tspan x="80" dy="14">에</tspan>
    <tspan x="80" dy="14">서</tspan>
  </text>
  <text x="80" y="270" font-size="11" fill="${PALETTE.muted}" text-anchor="middle">
    <tspan x="80" dy="0">D</tspan>
    <tspan x="80" dy="14">B</tspan>
    <tspan x="80" dy="14">로</tspan>
  </text>

  <text x="380" y="365" text-anchor="middle" font-size="12" fill="${PALETTE.muted}">
    어디까지 데이터가 왔는지 단계별로 확인 → 문제 위치 좁히기
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 9) Spring 컨테이너와 Bean
  // ------------------------------------------------------------------
  const springContainer = () => `
<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">Spring 컨테이너와 Bean</text>

  <!-- 컨테이너 박스 -->
  <rect x="60" y="60" width="640" height="240" rx="14"
        fill="${PALETTE.green}" fill-opacity="0.06"
        stroke="${PALETTE.green}" stroke-width="2" stroke-dasharray="6"/>
  <text x="380" y="85" text-anchor="middle" font-size="14"
        fill="${PALETTE.green}" font-weight="700">Spring 컨테이너 (ApplicationContext)</text>

  <!-- Bean 들 -->
  ${[
    {x: 100, y: 130, label: 'BoardController', sub: '@Controller', color: PALETTE.blue},
    {x: 300, y: 130, label: 'BoardService',    sub: '@Service',    color: PALETTE.green},
    {x: 500, y: 130, label: 'BoardMapper',     sub: '@Mapper',     color: PALETTE.accent},
    {x: 100, y: 220, label: 'MemberService',   sub: '@Service',    color: PALETTE.green},
    {x: 300, y: 220, label: 'CommentMapper',   sub: '@Mapper',     color: PALETTE.accent},
    {x: 500, y: 220, label: 'DataSource',      sub: 'HikariCP',    color: PALETTE.purple}
  ].map(b => `
    <rect x="${b.x}" y="${b.y}" width="160" height="60" rx="10"
          fill="${b.color}" fill-opacity="0.18" stroke="${b.color}" stroke-width="1.5"/>
    <text x="${b.x + 80}" y="${b.y + 28}" text-anchor="middle" font-size="13"
          font-weight="700" fill="${PALETTE.text}">${b.label}</text>
    <text x="${b.x + 80}" y="${b.y + 46}" text-anchor="middle" font-size="11"
          fill="${b.color}">${b.sub}</text>
  `).join('')}

  <text x="380" y="335" text-anchor="middle" font-size="12" fill="${PALETTE.muted}">
    @Component / @Service / @Repository / @Controller 가 붙은 클래스를
  </text>
  <text x="380" y="352" text-anchor="middle" font-size="12" fill="${PALETTE.muted}">
    컨테이너가 자동 인스턴스화 → @Autowired 로 자동 주입
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 10) DB 테이블 ↔ 자바 객체 매핑
  // ------------------------------------------------------------------
  const dbTableMapping = () => `
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">DB 테이블 ↔ 자바 객체</text>

  <!-- DB 테이블 -->
  <rect x="40" y="60" width="320" height="220" rx="10"
        fill="${PALETTE.accent}" fill-opacity="0.1"
        stroke="${PALETTE.accent}" stroke-width="2"/>
  <text x="200" y="86" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.accent}">📊 DB: member 테이블</text>

  <!-- 컬럼 헤더 -->
  <rect x="60" y="100" width="280" height="32" fill="${PALETTE.accent}" fill-opacity="0.3"/>
  <text x="80" y="120" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">id</text>
  <text x="140" y="120" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">user_id</text>
  <text x="240" y="120" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">name</text>

  <!-- 행들 -->
  ${[
    {y: 142, vals: ['1', "'hong'",  "'홍길동'"]},
    {y: 172, vals: ['2', "'kim'",   "'김철수'"]},
    {y: 202, vals: ['3', "'lee'",   "'이영희'"]}
  ].map(r => `
    <text x="80" y="${r.y}" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">${r.vals[0]}</text>
    <text x="140" y="${r.y}" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">${r.vals[1]}</text>
    <text x="240" y="${r.y}" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">${r.vals[2]}</text>
  `).join('')}

  <text x="200" y="260" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">스네이크 케이스</text>

  <!-- 화살표 + MyBatis -->
  <text x="380" y="170" text-anchor="middle" font-size="20" fill="${PALETTE.text}">↔</text>
  <text x="380" y="190" text-anchor="middle" font-size="11" fill="${PALETTE.green}">MyBatis</text>
  <text x="380" y="205" text-anchor="middle" font-size="10" fill="${PALETTE.muted}">자동 변환</text>

  <!-- 자바 객체 -->
  <rect x="400" y="60" width="320" height="220" rx="10"
        fill="${PALETTE.blue}" fill-opacity="0.1"
        stroke="${PALETTE.blue}" stroke-width="2"/>
  <text x="560" y="86" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.blue}">☕ 자바: Member 객체</text>

  <text x="420" y="120" font-family="JetBrains Mono, monospace" font-size="12" fill="${PALETTE.text}">class Member {</text>
  <text x="440" y="142" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">int id;</text>
  <text x="440" y="162" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">String userId;</text>
  <text x="440" y="182" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">String name;</text>
  <text x="420" y="204" font-family="JetBrains Mono, monospace" font-size="12" fill="${PALETTE.text}">}</text>

  <text x="560" y="260" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">카멜 케이스</text>

  <text x="380" y="305" text-anchor="middle" font-size="12" fill="${PALETTE.accent}" font-weight="700">
    mapUnderscoreToCamelCase = true 면 자동 매핑
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 11) JSON 변환 (자바 ↔ JSON)
  // ------------------------------------------------------------------
  const jsonConversion = () => `
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">자바 객체 ↔ JSON (Jackson)</text>

  <!-- 자바 객체 -->
  <rect x="40" y="60" width="320" height="200" rx="10"
        fill="${PALETTE.blue}" fill-opacity="0.1" stroke="${PALETTE.blue}"/>
  <text x="200" y="85" text-anchor="middle" font-size="13"
        fill="${PALETTE.blue}" font-weight="700">자바 Board 객체</text>
  <text x="60" y="115" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">Board {</text>
  <text x="80" y="135" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">id = 3,</text>
  <text x="80" y="153" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">title = "첫 글",</text>
  <text x="80" y="171" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">content = "안녕",</text>
  <text x="80" y="189" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">writerName = "홍길동"</text>
  <text x="60" y="207" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">}</text>

  <!-- 화살표 + Jackson -->
  <line x1="370" y1="140" x2="390" y2="140"
        stroke="${PALETTE.green}" stroke-width="2" marker-end="url(#arr-j)"/>
  <line x1="390" y1="180" x2="370" y2="180"
        stroke="${PALETTE.accent}" stroke-width="2" marker-end="url(#arr-j2)"/>
  <defs>
    <marker id="arr-j" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.green}"/>
    </marker>
    <marker id="arr-j2" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.accent}"/>
    </marker>
  </defs>
  <text x="380" y="120" text-anchor="middle" font-size="11" fill="${PALETTE.green}" font-weight="700">@ResponseBody</text>
  <text x="380" y="200" text-anchor="middle" font-size="11" fill="${PALETTE.accent}" font-weight="700">@RequestBody</text>
  <text x="380" y="240" text-anchor="middle" font-size="10" fill="${PALETTE.muted}">Jackson 자동</text>

  <!-- JSON -->
  <rect x="400" y="60" width="320" height="200" rx="10"
        fill="${PALETTE.accent}" fill-opacity="0.1" stroke="${PALETTE.accent}"/>
  <text x="560" y="85" text-anchor="middle" font-size="13"
        fill="${PALETTE.accent}" font-weight="700">JSON 응답</text>
  <text x="420" y="115" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">{</text>
  <text x="440" y="135" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">"id": 3,</text>
  <text x="440" y="153" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">"title": "첫 글",</text>
  <text x="440" y="171" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">"content": "안녕",</text>
  <text x="440" y="189" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.muted}">"writerName": "홍길동"</text>
  <text x="420" y="207" font-family="JetBrains Mono, monospace" font-size="11" fill="${PALETTE.text}">}</text>

  <text x="380" y="295" text-anchor="middle" font-size="12" fill="${PALETTE.muted}">
    getter/setter 가 매핑 다리 — 필드 이름이 자동으로 키가 됨
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 12) RESTful URL 디자인
  // ------------------------------------------------------------------
  const restfulUrls = () => `
<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <text x="380" y="28" text-anchor="middle" font-size="16"
        fill="${PALETTE.text}" font-weight="700">RESTful URL — 명사 + HTTP 메서드</text>

  ${[
    {y: 60,  method: 'GET',    url: '/api/boards',       desc: '게시글 목록',      color: PALETTE.green},
    {y: 110, method: 'GET',    url: '/api/boards/3',     desc: '3 번 게시글 상세',  color: PALETTE.green},
    {y: 160, method: 'POST',   url: '/api/boards',       desc: '새 게시글 작성',    color: PALETTE.blue},
    {y: 210, method: 'PUT',    url: '/api/boards/3',     desc: '3 번 게시글 수정',  color: PALETTE.accent},
    {y: 260, method: 'DELETE', url: '/api/boards/3',     desc: '3 번 게시글 삭제',  color: PALETTE.red}
  ].map(r => `
    <rect x="60" y="${r.y}" width="80" height="36" rx="6"
          fill="${r.color}" fill-opacity="0.25" stroke="${r.color}" stroke-width="1.5"/>
    <text x="100" y="${r.y + 24}" text-anchor="middle" font-size="14"
          font-weight="700" fill="${r.color}">${r.method}</text>

    <rect x="160" y="${r.y}" width="280" height="36" rx="6"
          fill="${PALETTE.surface}" stroke="${PALETTE.border}"/>
    <text x="180" y="${r.y + 24}" font-family="JetBrains Mono, monospace"
          font-size="13" fill="${PALETTE.text}">${r.url}</text>

    <text x="460" y="${r.y + 24}" font-size="13" fill="${PALETTE.muted}">${r.desc}</text>
  `).join('')}

  <text x="380" y="345" text-anchor="middle" font-size="13"
        fill="${PALETTE.text}" font-weight="700">URL 은 명사(boards) — 동작은 HTTP 메서드</text>
  <text x="380" y="365" text-anchor="middle" font-size="11" fill="${PALETTE.muted}">
    같은 URL 도 메서드만 다르면 다른 처리
  </text>
</svg>`;

  // ------------------------------------------------------------------
  // 13) Spring Legacy vs Spring Boot — 7 → 1 / 외부 → 내장
  // ------------------------------------------------------------------
  const bootVsLegacy = () => `
<svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <defs>
    <marker id="arr-bvl" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.accent}"/>
    </marker>
  </defs>

  <text x="450" y="32" text-anchor="middle" font-size="18"
        fill="${PALETTE.text}" font-weight="700">Spring Legacy 와 Spring Boot — 「7 → 1」 + 「외부 → 내장」</text>

  <!-- 왼쪽: Legacy -->
  <text x="190" y="68" text-anchor="middle" font-size="15"
        font-weight="700" fill="${PALETTE.red}">⚠️ Spring Legacy (옛 방식)</text>

  <rect x="60" y="85" width="260" height="320" rx="14"
        fill="${PALETTE.red}" fill-opacity="0.08"
        stroke="${PALETTE.red}" stroke-width="2"/>
  <text x="190" y="108" text-anchor="middle" font-size="12"
        fill="${PALETTE.red}" font-weight="700">설정 7개를 직접</text>

  ${[
    {y: 122, name: 'web.xml'},
    {y: 152, name: 'servlet-context.xml'},
    {y: 182, name: 'root-context.xml'},
    {y: 212, name: 'pom.xml — 50줄'},
    {y: 242, name: 'log4j.xml'},
    {y: 272, name: 'encoding-filter'},
    {y: 302, name: 'view-resolver'}
  ].map(c => `
    <rect x="80" y="${c.y}" width="220" height="24" rx="4"
          fill="${PALETTE.red}" fill-opacity="0.18" stroke="${PALETTE.red}" stroke-width="1"/>
    <text x="92" y="${c.y + 17}" font-family="JetBrains Mono, monospace"
          font-size="12" fill="${PALETTE.text}">${c.name}</text>
  `).join('')}

  <!-- 외부 톰캣 (박스 밖) -->
  <rect x="80" y="345" width="220" height="48" rx="6"
        fill="${PALETTE.surface}" stroke="${PALETTE.muted}" stroke-width="1.5"
        stroke-dasharray="5"/>
  <text x="190" y="365" text-anchor="middle" font-size="13"
        fill="${PALETTE.text}" font-weight="700">🐈 외부 Tomcat 따로 설치</text>
  <text x="190" y="383" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">WAS 를 별도로 깔고 띄움</text>

  <text x="190" y="430" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">시작 전 설정만 한참…</text>

  <!-- 가운데 변환 화살표 -->
  <text x="450" y="220" text-anchor="middle" font-size="48"
        fill="${PALETTE.accent}" font-weight="700">→</text>
  <text x="450" y="250" text-anchor="middle" font-size="14"
        fill="${PALETTE.accent}" font-weight="700">Spring Boot</text>
  <text x="450" y="270" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">설정 7개 → 1개</text>
  <text x="450" y="288" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">외부 → 내장</text>

  <line x1="380" y1="180" x2="520" y2="180"
        stroke="${PALETTE.accent}" stroke-width="2" marker-end="url(#arr-bvl)"/>

  <!-- 오른쪽: Boot -->
  <text x="710" y="68" text-anchor="middle" font-size="15"
        font-weight="700" fill="${PALETTE.green}">✓ Spring Boot (현대)</text>

  <rect x="580" y="85" width="260" height="320" rx="14"
        fill="${PALETTE.green}" fill-opacity="0.08"
        stroke="${PALETTE.green}" stroke-width="2"/>
  <text x="710" y="108" text-anchor="middle" font-size="12"
        fill="${PALETTE.green}" font-weight="700">한 줄로 끝</text>

  <!-- @SpringBootApplication 한 줄 -->
  <rect x="600" y="125" width="220" height="60" rx="8"
        fill="${PALETTE.green}" fill-opacity="0.22"
        stroke="${PALETTE.green}" stroke-width="2"/>
  <text x="710" y="150" text-anchor="middle" font-family="JetBrains Mono, monospace"
        font-size="13" font-weight="700" fill="${PALETTE.text}">@SpringBootApplication</text>
  <text x="710" y="172" text-anchor="middle" font-size="11"
        fill="${PALETTE.green}">애너테이션 한 줄</text>

  <!-- application.properties -->
  <rect x="600" y="200" width="220" height="44" rx="6"
        fill="${PALETTE.teal}" fill-opacity="0.18"
        stroke="${PALETTE.teal}" stroke-width="1.5"/>
  <text x="710" y="220" text-anchor="middle" font-family="JetBrains Mono, monospace"
        font-size="12" fill="${PALETTE.text}">application.properties</text>
  <text x="710" y="236" text-anchor="middle" font-size="10"
        fill="${PALETTE.muted}">필요한 것만 키=값</text>

  <!-- 내장 톰캣 (박스 안) -->
  <rect x="600" y="260" width="220" height="120" rx="10"
        fill="${PALETTE.blue}" fill-opacity="0.15"
        stroke="${PALETTE.blue}" stroke-width="2"/>
  <text x="710" y="285" text-anchor="middle" font-size="13"
        fill="${PALETTE.blue}" font-weight="700">📦 임베디드 Tomcat</text>
  <text x="710" y="308" text-anchor="middle" font-size="11"
        fill="${PALETTE.text}">앱 안에 WAS 가 같이</text>
  <text x="710" y="328" text-anchor="middle" font-family="JetBrains Mono, monospace"
        font-size="11" fill="${PALETTE.muted}">java -jar app.jar</text>
  <text x="710" y="348" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">한 줄로 서버 기동</text>
  <text x="710" y="368" text-anchor="middle" font-size="10"
        fill="${PALETTE.green}" font-weight="700">설치 불필요</text>

  <text x="710" y="430" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">바로 코드부터 짠다</text>

  <!-- 하단 캡션 -->
  <text x="450" y="475" text-anchor="middle" font-size="13"
        fill="${PALETTE.text}" font-weight="700">같은 일을 — 설정은 줄이고, WAS 는 품으로</text>
</svg>`;

  // ------------------------------------------------------------------
  // 14) Auto-Configuration 흐름 — classpath 스캔 → 조건부 빈 등록
  // ------------------------------------------------------------------
  const autoConfigFlow = () => `
<svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <defs>
    <marker id="arr-ac" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.accent}"/>
    </marker>
  </defs>

  <text x="450" y="32" text-anchor="middle" font-size="18"
        fill="${PALETTE.text}" font-weight="700">Auto-Configuration — classpath 를 보고 알아서 등록</text>

  <!-- 단계 1: classpath 스캔 -->
  <rect x="40" y="70" width="240" height="360" rx="14"
        fill="${PALETTE.blue}" fill-opacity="0.1"
        stroke="${PALETTE.blue}" stroke-width="2"/>
  <text x="160" y="98" text-anchor="middle" font-size="14"
        fill="${PALETTE.blue}" font-weight="700">① classpath 스캔</text>
  <text x="160" y="118" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">jar 안에 뭐가 들어있나?</text>

  ${[
    {y: 145, name: 'spring-webmvc.jar'},
    {y: 185, name: 'tomcat-embed.jar'},
    {y: 225, name: 'jackson-databind.jar'},
    {y: 265, name: 'mybatis-spring.jar'},
    {y: 305, name: 'hikariCP.jar'}
  ].map(j => `
    <rect x="60" y="${j.y}" width="200" height="30" rx="6"
          fill="${PALETTE.blue}" fill-opacity="0.22" stroke="${PALETTE.blue}"/>
    <text x="75" y="${j.y + 20}" font-family="JetBrains Mono, monospace"
          font-size="12" fill="${PALETTE.text}">📦 ${j.name}</text>
  `).join('')}

  <text x="160" y="375" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">발견한 라이브러리 목록</text>
  <text x="160" y="408" text-anchor="middle" font-size="22"
        fill="${PALETTE.accent}">↓</text>

  <!-- 단계 2: @Conditional 판정 -->
  <rect x="320" y="70" width="240" height="360" rx="14"
        fill="${PALETTE.accent}" fill-opacity="0.1"
        stroke="${PALETTE.accent}" stroke-width="2"/>
  <text x="440" y="98" text-anchor="middle" font-size="14"
        fill="${PALETTE.accent}" font-weight="700">② @Conditional 판정</text>
  <text x="440" y="118" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">"있으면 등록" 규칙 매칭</text>

  ${[
    {y: 145, cond: '@ConditionalOnClass', target: 'DispatcherServlet'},
    {y: 195, cond: '@ConditionalOnClass', target: 'Tomcat'},
    {y: 245, cond: '@ConditionalOnClass', target: 'ObjectMapper'},
    {y: 295, cond: '@ConditionalOnBean',  target: 'DataSource'}
  ].map(c => `
    <rect x="335" y="${c.y}" width="210" height="40" rx="6"
          fill="${PALETTE.accent}" fill-opacity="0.2" stroke="${PALETTE.accent}"/>
    <text x="345" y="${c.y + 16}" font-family="JetBrains Mono, monospace"
          font-size="10" fill="${PALETTE.muted}">${c.cond}</text>
    <text x="345" y="${c.y + 32}" font-family="JetBrains Mono, monospace"
          font-size="11" fill="${PALETTE.text}">→ ${c.target}</text>
  `).join('')}

  <text x="440" y="375" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">조건이 맞는 항목만 통과</text>
  <text x="440" y="408" text-anchor="middle" font-size="22"
        fill="${PALETTE.accent}">↓</text>

  <!-- 단계 3: 빈 등록 -->
  <rect x="600" y="70" width="260" height="360" rx="14"
        fill="${PALETTE.green}" fill-opacity="0.1"
        stroke="${PALETTE.green}" stroke-width="2"/>
  <text x="730" y="98" text-anchor="middle" font-size="14"
        fill="${PALETTE.green}" font-weight="700">③ 빈 자동 등록</text>
  <text x="730" y="118" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">컨테이너에 자동으로 들어감</text>

  ${[
    {y: 145, bean: 'DispatcherServlet'},
    {y: 185, bean: 'TomcatServletWebServer'},
    {y: 225, bean: 'MappingJackson2Converter'},
    {y: 265, bean: 'SqlSessionFactoryBean'},
    {y: 305, bean: 'HikariDataSource'}
  ].map(b => `
    <rect x="620" y="${b.y}" width="220" height="30" rx="6"
          fill="${PALETTE.green}" fill-opacity="0.22" stroke="${PALETTE.green}"/>
    <text x="635" y="${b.y + 20}" font-family="JetBrains Mono, monospace"
          font-size="11" fill="${PALETTE.text}">✓ ${b.bean}</text>
  `).join('')}

  <text x="730" y="375" text-anchor="middle" font-size="11"
        fill="${PALETTE.green}" font-weight="700">사용자 코드 0 줄</text>

  <!-- 단계 화살표 -->
  <line x1="280" y1="245" x2="320" y2="245" stroke="${PALETTE.accent}"
        stroke-width="2.5" marker-end="url(#arr-ac)"/>
  <line x1="560" y1="245" x2="600" y2="245" stroke="${PALETTE.accent}"
        stroke-width="2.5" marker-end="url(#arr-ac)"/>

  <!-- 캡션 -->
  <text x="450" y="475" text-anchor="middle" font-size="13"
        fill="${PALETTE.text}" font-weight="700">"있는 것만 켠다" — Legacy 의 XML 한 줄 한 줄을 SpringBoot 가 대신</text>
</svg>`;

  // ------------------------------------------------------------------
  // 15) Starter 묶음 의존성 — starter-web 한 줄이 풀어주는 트리
  // ------------------------------------------------------------------
  const starterBundle = () => `
<svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <defs>
    <marker id="arr-sb" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.muted}"/>
    </marker>
  </defs>

  <text x="450" y="32" text-anchor="middle" font-size="18"
        fill="${PALETTE.text}" font-weight="700">Starter — 한 줄이 풀어내는 의존성 트리</text>

  <!-- 루트: starter-web -->
  <rect x="320" y="65" width="260" height="70" rx="12"
        fill="${PALETTE.green}" fill-opacity="0.25"
        stroke="${PALETTE.green}" stroke-width="2.5"/>
  <text x="450" y="92" text-anchor="middle" font-family="JetBrains Mono, monospace"
        font-size="14" font-weight="700" fill="${PALETTE.text}">spring-boot-starter-web</text>
  <text x="450" y="115" text-anchor="middle" font-size="11"
        fill="${PALETTE.green}">한 줄만 적으면…</text>
  <text x="450" y="128" text-anchor="middle" font-size="10"
        fill="${PALETTE.muted}">버전 번호도 안 적음</text>

  <!-- 트리 가지 -->
  <line x1="450" y1="135" x2="450" y2="170" stroke="${PALETTE.muted}" stroke-width="2"/>
  <line x1="140" y1="170" x2="760" y2="170" stroke="${PALETTE.muted}" stroke-width="2"/>
  <line x1="140" y1="170" x2="140" y2="195" stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-sb)"/>
  <line x1="295" y1="170" x2="295" y2="195" stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-sb)"/>
  <line x1="450" y1="170" x2="450" y2="195" stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-sb)"/>
  <line x1="605" y1="170" x2="605" y2="195" stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-sb)"/>
  <line x1="760" y1="170" x2="760" y2="195" stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-sb)"/>

  <!-- 자식 노드 4개 + 호환 버전 라벨 -->
  ${[
    {x: 60,  name: 'spring-web',         ver: '6.x',   color: PALETTE.blue,   desc: 'HTTP 핵심'},
    {x: 215, name: 'spring-webmvc',      ver: '6.x',   color: PALETTE.blue,   desc: 'MVC + DispatcherServlet'},
    {x: 370, name: 'tomcat-embed-core',  ver: '10.x',  color: PALETTE.purple, desc: '내장 톰캣'},
    {x: 525, name: 'jackson-databind',   ver: '2.x',   color: PALETTE.accent, desc: 'JSON 변환'},
    {x: 680, name: 'spring-boot-json',   ver: '3.x',   color: PALETTE.teal,   desc: 'JSON 자동설정'}
  ].map(c => `
    <rect x="${c.x}" y="195" width="160" height="62" rx="10"
          fill="${c.color}" fill-opacity="0.18" stroke="${c.color}" stroke-width="1.5"/>
    <text x="${c.x + 80}" y="218" text-anchor="middle" font-family="JetBrains Mono, monospace"
          font-size="11" font-weight="700" fill="${PALETTE.text}">${c.name}</text>
    <text x="${c.x + 80}" y="234" text-anchor="middle" font-size="10"
          fill="${c.color}">v${c.ver} (자동 결정)</text>
    <text x="${c.x + 80}" y="250" text-anchor="middle" font-size="10"
          fill="${PALETTE.muted}">${c.desc}</text>
  `).join('')}

  <!-- 하위 추가 트리 (tomcat-embed) -->
  <line x1="450" y1="257" x2="450" y2="290" stroke="${PALETTE.muted}" stroke-width="1.5" stroke-dasharray="3"/>
  <line x1="350" y1="290" x2="550" y2="290" stroke="${PALETTE.muted}" stroke-width="1.5" stroke-dasharray="3"/>
  <line x1="350" y1="290" x2="350" y2="310" stroke="${PALETTE.muted}" stroke-width="1.5" marker-end="url(#arr-sb)"/>
  <line x1="450" y1="290" x2="450" y2="310" stroke="${PALETTE.muted}" stroke-width="1.5" marker-end="url(#arr-sb)"/>
  <line x1="550" y1="290" x2="550" y2="310" stroke="${PALETTE.muted}" stroke-width="1.5" marker-end="url(#arr-sb)"/>

  ${[
    {x: 290, name: 'tomcat-coyote'},
    {x: 390, name: 'tomcat-util'},
    {x: 490, name: 'tomcat-juli'}
  ].map(c => `
    <rect x="${c.x}" y="310" width="120" height="32" rx="6"
          fill="${PALETTE.purple}" fill-opacity="0.12"
          stroke="${PALETTE.purple}" stroke-width="1" stroke-dasharray="3"/>
    <text x="${c.x + 60}" y="330" text-anchor="middle" font-family="JetBrains Mono, monospace"
          font-size="10" fill="${PALETTE.muted}">${c.name}</text>
  `).join('')}

  <text x="450" y="365" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">… 그 아래로도 수십 개의 라이브러리가 자동으로 따라옴</text>

  <!-- Before/After 캡션 박스 -->
  <rect x="60" y="395" width="370" height="78" rx="10"
        fill="${PALETTE.red}" fill-opacity="0.1" stroke="${PALETTE.red}" stroke-width="1.5"/>
  <text x="245" y="418" text-anchor="middle" font-size="13"
        font-weight="700" fill="${PALETTE.red}">⚠️ Legacy</text>
  <text x="245" y="440" text-anchor="middle" font-size="11"
        fill="${PALETTE.text}">5~10 개 의존성 + 버전 직접 지정</text>
  <text x="245" y="458" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">한 줄 어긋나면 빌드 실패</text>

  <rect x="470" y="395" width="370" height="78" rx="10"
        fill="${PALETTE.green}" fill-opacity="0.1" stroke="${PALETTE.green}" stroke-width="1.5"/>
  <text x="655" y="418" text-anchor="middle" font-size="13"
        font-weight="700" fill="${PALETTE.green}">✓ Boot Starter</text>
  <text x="655" y="440" text-anchor="middle" font-size="11"
        fill="${PALETTE.text}">한 줄 + 버전 자동</text>
  <text x="655" y="458" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">호환성은 SpringBoot 가 보증</text>
</svg>`;

  // ------------------------------------------------------------------
  // 16) 세 트랙이 같은 이름으로 만난다 — Front / Back / DB 합류
  // ------------------------------------------------------------------
  const threeTracksConverge = () => `
<svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  <defs>
    <marker id="arr-tt" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.muted}"/>
    </marker>
  </defs>

  <text x="450" y="32" text-anchor="middle" font-size="18"
        fill="${PALETTE.text}" font-weight="700">세 트랙이 「같은 이름」 하나로 만난다</text>

  <!-- 트랙 박스 3개 -->
  ${[
    {
      x: 50, color: PALETTE.blue, title: 'Frontend 트랙', sub: '디자인 폼',
      lines: [
        '<input name="id">',
        '<input name="pwd">',
        '<input name="nick">',
        'CSS · 화면 디자인'
      ]
    },
    {
      x: 320, color: PALETTE.green, title: 'Backend 트랙', sub: 'DTO · Controller',
      lines: [
        'private String id;',
        'private String pwd;',
        'private String nick;',
        'Service · Mapper'
      ]
    },
    {
      x: 590, color: PALETTE.accent, title: 'DB 트랙', sub: 'CREATE TABLE',
      lines: [
        'mymember (',
        '  id   VARCHAR,',
        '  pwd  VARCHAR,',
        '  nick VARCHAR )'
      ]
    }
  ].map(t => `
    <rect x="${t.x}" y="65" width="260" height="200" rx="14"
          fill="${t.color}" fill-opacity="0.18"
          stroke="${t.color}" stroke-width="2"/>
    <text x="${t.x + 130}" y="92" text-anchor="middle" font-size="15"
          font-weight="700" fill="${t.color}">${t.title}</text>
    <text x="${t.x + 130}" y="112" text-anchor="middle" font-size="11"
          fill="${PALETTE.muted}">${t.sub}</text>
    <line x1="${t.x + 20}" y1="124" x2="${t.x + 240}" y2="124"
          stroke="${t.color}" stroke-opacity="0.4" stroke-width="1"/>
    ${t.lines.map((line, i) => `
      <text x="${t.x + 20}" y="${148 + i * 24}" font-family="JetBrains Mono, monospace"
            font-size="12" fill="${PALETTE.text}">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
    `).join('')}
  `).join('')}

  <!-- 수렴 화살표 (각 트랙 → 중앙 합류 지점) -->
  <line x1="180" y1="265" x2="430" y2="345"
        stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-tt)"/>
  <line x1="450" y1="265" x2="450" y2="345"
        stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-tt)"/>
  <line x1="720" y1="265" x2="470" y2="345"
        stroke="${PALETTE.muted}" stroke-width="2" marker-end="url(#arr-tt)"/>

  <!-- HANDOFF 다이아몬드 -->
  <polygon points="450,340 640,400 450,460 260,400"
           fill="${PALETTE.purple}" fill-opacity="0.25"
           stroke="${PALETTE.purple}" stroke-width="2.5"/>
  <text x="450" y="385" text-anchor="middle" font-size="14"
        font-weight="700" fill="${PALETTE.purple}">◆ HANDOFF</text>
  <text x="450" y="408" text-anchor="middle" font-family="JetBrains Mono, monospace"
        font-size="14" font-weight="700" fill="${PALETTE.text}">{ id, pwd, nick }</text>
  <text x="450" y="428" text-anchor="middle" font-size="11"
        fill="${PALETTE.muted}">세 트랙이 같은 이름으로 만남</text>

  <!-- 하단 캡션 -->
  <text x="450" y="488" text-anchor="middle" font-size="12"
        fill="${PALETTE.muted}">같은 이름이면 — 같은 시간에, 다른 책임으로</text>
</svg>`;

  // ------------------------------------------------------------------
  const REGISTRY = {
    'client-server':       clientServer,
    'http-anatomy':        httpAnatomy,
    'mvc-6-layers':        mvc6Layers,
    'version-timeline':    versionTimeline,
    'cookie-vs-session':   cookieVsSession,
    'sync-vs-async':       syncVsAsync,
    'di-effect':           diEffect,
    'debug-flow':          debugFlow,
    'spring-container':    springContainer,
    'db-table-mapping':    dbTableMapping,
    'json-conversion':     jsonConversion,
    'restful-urls':        restfulUrls,
    'boot-vs-legacy':      bootVsLegacy,
    'auto-config-flow':    autoConfigFlow,
    'starter-bundle':      starterBundle,
    'three-tracks-converge': threeTracksConverge
  };

  function render() {
    document.querySelectorAll('[data-infographic]').forEach(el => {
      const name = el.getAttribute('data-infographic');
      const fn = REGISTRY[name];
      if (fn) {
        el.innerHTML = fn();
        el.style.margin = '0.5em auto';
        el.style.textAlign = 'center';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
