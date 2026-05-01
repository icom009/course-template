/* =========================================================================
   js/infographics.js — 재사용 가능한 SVG 인포그래픽 모음 (빈 골격)

   슬라이드/예제에서 다음 형태로 호출:
     <div data-infographic="이름"></div>

   사용법:
     1. 아래 PALETTE 색상만 사용해서 새 함수 작성 (viewBox 권장 900x500)
     2. REGISTRY 객체에 'name': 함수 등록
     3. 슬라이드의 data-infographic="name" 자리가 자동으로 채워짐
   ========================================================================= */
(function () {
  'use strict';

  // ------------------------------------------------------------------
  // PALETTE — 모든 인포그래픽이 공유하는 색상 (디자인 일관성 유지용)
  // ------------------------------------------------------------------
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
  // 코스별 인포그래픽 함수는 여기에 추가하세요.
  // 예시:
  //
  //   const myInfographic = () => `
  //     <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto;">
  //       <rect x="40" y="80" width="220" height="160" rx="14"
  //             fill="${PALETTE.surface}" stroke="${PALETTE.blue}" stroke-width="2"/>
  //       <text x="150" y="170" text-anchor="middle" font-size="18" font-weight="700"
  //             fill="${PALETTE.text}">제목</text>
  //     </svg>`;
  //
  // 그리고 REGISTRY 에 등록:
  //   'my-infographic': myInfographic
  // ------------------------------------------------------------------

  // TODO: 새 인포그래픽 함수 정의 자리

  // ------------------------------------------------------------------
  // REGISTRY — 'data-infographic' 이름 → 함수 매핑
  // ------------------------------------------------------------------
  const REGISTRY = {
    // TODO: 'name': functionName 형태로 등록
  };

  // ------------------------------------------------------------------
  // 자동 렌더링 — 페이지의 모든 [data-infographic] 자리를 채움
  // ------------------------------------------------------------------
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
