/* =========================================================================
   js/screenshot.js — 공용 런타임
   - 모든 페이지에 「메인으로」 떠다니는 버튼
   - 일반 모드: .screenshot 에 이미지 자동 로드 (없으면 숨김)
   - 관리자 모드(?admin=smhrd):
       · 기존 .screenshot 에 드래그-드롭 업로드 UI
       · 「+ 이미지 자리 추가」 떠다니는 버튼 — 어느 슬라이드/페이지든 즉석 placeholder 생성
       · 추가한 placeholder 는 영구 저장용 HTML 스니펫 복사 가능
   ========================================================================= */

(function () {
  'use strict';

  const params   = new URLSearchParams(location.search);
  const ADMIN_PW = 'smhrd';

  // ?admin (값 없음/있음 모두) 이면 다이얼로그로 비번 확인
  // 한 번 인증되면 sessionStorage 에 저장 — 새로고침 시 다시 묻지 않음
  function checkAdmin() {
    if (!params.has('admin')) return false;
    if (sessionStorage.getItem('admin_authed') === '1') return true;
    const input = window.prompt('관리자 비밀번호를 입력하세요:');
    if (input === ADMIN_PW) {
      sessionStorage.setItem('admin_authed', '1');
      return true;
    }
    if (input !== null) alert('비밀번호 불일치');
    return false;
  }
  const isAdmin  = checkAdmin();
  const path     = location.pathname;
  const isSlides = path.includes('/slides/');
  const type     = isSlides                  ? 'slides'
                 : path.includes('/labs/')   ? 'labs'
                 : path.includes('/examples/') ? 'examples'
                 : path.includes('/handouts/') ? 'handouts'
                 : null;
  const fileMatch = path.match(/\/([^/]+)\.html?$/);
  const sessionId = fileMatch ? fileMatch[1] : null;

  // ------------------------------------------------------------------
  // 1) 「메인으로」 떠다니는 버튼
  // ------------------------------------------------------------------
  function injectHomeButton() {
    if (!type) return;
    if (document.getElementById('global-home-btn')) return;

    const btn = document.createElement('a');
    btn.id = 'global-home-btn';
    btn.href = '../index.html';
    btn.title = '메인으로 (전체 차시 목록)';
    btn.innerHTML = '◀ 메인';
    btn.style.cssText = `
      position: fixed;
      top: 14px;
      left: 14px;
      z-index: 100000;
      padding: 9px 18px;
      background: rgba(245, 158, 11, 0.95);
      color: #0f172a;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
      border-radius: 999px;
      border: 1px solid rgba(245, 158, 11, 1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35), 0 0 0 3px rgba(15, 23, 42, 0.4);
      transition: all 0.2s;
      font-family: 'Pretendard', system-ui, sans-serif;
    `;
    btn.addEventListener('mouseover', () => {
      btn.style.background = 'rgba(15, 23, 42, 0.95)';
      btn.style.color = '#fbbf24';
      btn.style.transform = 'translateY(-1px) scale(1.03)';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.background = 'rgba(245, 158, 11, 0.95)';
      btn.style.color = '#0f172a';
      btn.style.transform = 'translateY(0) scale(1)';
    });
    document.body.appendChild(btn);
  }

  // ------------------------------------------------------------------
  // 1.5) 마지막 슬라이드 끝에 「메인으로 돌아가기」 큰 버튼 (slides 전용)
  // ------------------------------------------------------------------
  function injectEndOfDeckButton() {
    if (type !== 'slides') return;
    if (typeof Reveal === 'undefined') return;

    const slides = document.querySelectorAll('.reveal .slides > section');
    if (!slides.length) return;
    const last = slides[slides.length - 1];
    if (last.querySelector('.end-of-deck-home')) return;

    const wrap = document.createElement('div');
    wrap.className = 'end-of-deck-home';
    wrap.style.cssText = 'margin-top: 1.5em; text-align: center;';
    wrap.innerHTML = `
      <a href="../index.html" style="
        display: inline-flex; align-items: center; gap: 0.5em;
        padding: 12px 28px;
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        color: white; text-decoration: none;
        font-size: 0.85em; font-weight: 700;
        border-radius: 999px;
        box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35);
        transition: transform 0.2s;
      "
      onmouseover="this.style.transform='translateY(-2px) scale(1.03)'"
      onmouseout="this.style.transform='translateY(0) scale(1)'">
        ◀ 전체 차시 목록으로
      </a>
    `;
    last.appendChild(wrap);
  }

  // ------------------------------------------------------------------
  // 2) 관리자 배너 + 「+ 이미지 자리 추가」 버튼
  // ------------------------------------------------------------------
  function injectAdminControls() {
    if (!isAdmin) return;
    if (document.getElementById('admin-banner')) return;

    // 우상단 배너
    const banner = document.createElement('div');
    banner.id = 'admin-banner';
    banner.style.cssText = `
      position: fixed; top: 16px; right: 18px; z-index: 9999;
      padding: 7px 14px;
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      color: white; font-size: 13px; font-weight: 700;
      letter-spacing: 0.02em; border-radius: 999px;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      font-family: 'Pretendard', system-ui, sans-serif;
    `;
    banner.textContent = '🔧 관리자';
    document.body.appendChild(banner);

    // 우하단 「+ 이미지 자리 추가」 떠다니는 버튼
    const addBtn = document.createElement('button');
    addBtn.id = 'admin-add-placeholder';
    addBtn.title = '현재 보이는 슬라이드/페이지에 이미지 자리 추가';
    addBtn.innerHTML = '+ 이미지 자리';
    addBtn.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      padding: 12px 18px;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white; font-size: 14px; font-weight: 700;
      letter-spacing: 0.02em; border: none; border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(34, 197, 94, 0.4);
      font-family: 'Pretendard', system-ui, sans-serif;
      transition: transform 0.15s;
    `;
    addBtn.addEventListener('mouseover', () => addBtn.style.transform = 'translateY(-2px)');
    addBtn.addEventListener('mouseout',  () => addBtn.style.transform = 'translateY(0)');
    addBtn.addEventListener('click', addDynamicPlaceholder);
    document.body.appendChild(addBtn);
  }

  // ------------------------------------------------------------------
  // 3) 동적 placeholder 추가
  // ------------------------------------------------------------------
  function addDynamicPlaceholder() {
    let host;
    if (isSlides && window.Reveal) {
      // reveal.js — 현재 보이는 슬라이드
      host = window.Reveal.getCurrentSlide();
    } else {
      // 일반 페이지 — 화면 가운데에서 가장 가까운 컨테이너 또는 body
      host = document.querySelector('.container') || document.body;
    }
    if (!host) {
      alert('이미지 자리를 추가할 곳을 찾지 못했습니다.');
      return;
    }

    const desc = prompt('이 이미지의 설명을 입력하세요 (한 줄):',
                          '이 차시의 주요 화면');
    if (desc === null) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'screenshot dynamic-placeholder';
    wrapper.innerHTML = `
      <div class="label">SCREENSHOT</div>
      <div class="desc">${escapeHtml(desc || '이미지 자리')}</div>
    `;
    host.appendChild(wrapper);

    // 즉시 admin 처리 적용
    processSinglePlaceholder(wrapper);

    // HTML 스니펫 안내 (영구 보존하려면 슬라이드 HTML 에 붙여넣기)
    showSnippetToast(desc);
  }

  function showSnippetToast(desc) {
    const snippet = `&lt;div class="screenshot"&gt;
  &lt;div class="label"&gt;SCREENSHOT&lt;/div&gt;
  &lt;div class="desc"&gt;${escapeHtml(desc)}&lt;/div&gt;
&lt;/div&gt;`;

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 90px; right: 24px; z-index: 9999;
      max-width: 460px;
      padding: 14px 18px;
      background: rgba(15, 23, 42, 0.95);
      color: #e2e8f0; font-size: 12px;
      border: 1px solid rgba(245, 158, 11, 0.5);
      border-radius: 10px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.4);
      font-family: 'Pretendard', system-ui, sans-serif;
    `;
    toast.innerHTML = `
      <div style="font-weight:700; color:#f59e0b; margin-bottom:4px;">
        ✓ 이미지 자리 추가됨 (이 세션 한정)
      </div>
      <div style="font-size:11px; margin-bottom:8px; color:#94a3b8;">
        영구 보존하려면 다음 HTML 을 슬라이드 파일의 원하는 <code>&lt;section&gt;</code> 안에 추가:
      </div>
      <pre style="background:#0d1117; padding:8px; border-radius:6px;
                  font-family:'JetBrains Mono', monospace; font-size:11px;
                  overflow:auto; max-height:140px; margin:0;">${snippet}</pre>
      <div style="margin-top:8px; display:flex; gap:6px;">
        <button id="snippet-copy" style="padding:5px 10px; font-size:11px;
                  background:#22c55e; color:white; border:none;
                  border-radius:6px; cursor:pointer; font-weight:700;">
          📋 HTML 복사
        </button>
        <button id="snippet-close" style="padding:5px 10px; font-size:11px;
                  background:#475569; color:white; border:none;
                  border-radius:6px; cursor:pointer;">
          닫기
        </button>
      </div>
    `;
    document.body.appendChild(toast);

    document.getElementById('snippet-copy').addEventListener('click', () => {
      const plain = `<div class="screenshot">
  <div class="label">SCREENSHOT</div>
  <div class="desc">${desc}</div>
</div>`;
      navigator.clipboard.writeText(plain).then(() => {
        document.getElementById('snippet-copy').textContent = '✓ 복사됨';
      });
    });
    document.getElementById('snippet-close').addEventListener('click', () => {
      toast.remove();
    });
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 30000);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  // ------------------------------------------------------------------
  // 4) .screenshot 처리 (일반 + 관리자)
  // ------------------------------------------------------------------
  let dynamicCounter = 0;

  function processSinglePlaceholder(el) {
    if (el.dataset.processed === '1') return;
    el.dataset.processed = '1';

    const isDynamic = el.classList.contains('dynamic-placeholder');
    const desc      = el.querySelector('.desc')?.textContent?.trim() || '';

    // 동적 추가는 별도 인덱스 (기존 페이지 placeholder 와 충돌 방지)
    let idx;
    if (isDynamic) {
      idx = `dyn-${++dynamicCounter}-${Date.now()}`;
    } else {
      const all = Array.from(document.querySelectorAll('.screenshot:not(.dynamic-placeholder)'));
      idx = all.indexOf(el) + 1;
    }
    const imageName = `${type}-${sessionId}-${idx}.png`;
    const imageUrl  = `../images/${imageName}`;

    if (el.querySelector('img')) return;

    if (!isAdmin) {
      const img = new Image();
      img.onload = () => {
        const figure = document.createElement('figure');
        figure.style.margin = '0';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        figure.appendChild(img);
        if (desc) {
          const cap = document.createElement('figcaption');
          cap.textContent = desc;
          cap.style.cssText = 'font-size:12px; color:#94a3b8; margin-top:0.4rem;';
          figure.appendChild(cap);
        }
        el.innerHTML = '';
        el.appendChild(figure);
      };
      img.onerror = () => { el.style.display = 'none'; };
      img.src = imageUrl;
      img.alt = desc || imageName;
    } else {
      renderAdminPlaceholder(el, desc, imageName, imageUrl);
    }
  }

  function processScreenshots() {
    document.querySelectorAll('.screenshot').forEach(processSinglePlaceholder);
  }

  function renderAdminPlaceholder(el, desc, imageName, imageUrl) {
    el.innerHTML = '';
    el.style.cssText = `
      border: 2px dashed rgba(245, 158, 11, 0.6);
      border-radius: 10px;
      padding: 1rem;
      text-align: center;
      background: rgba(245, 158, 11, 0.06);
      margin: 1rem 0;
      cursor: pointer;
      transition: all 0.15s;
      font-family: 'Pretendard', system-ui, sans-serif;
      color: #94a3b8;
    `;

    const filenameLabel = document.createElement('div');
    filenameLabel.style.cssText =
      'font-family:"JetBrains Mono", monospace; font-size:12px; color:#f59e0b; font-weight:700;';
    filenameLabel.textContent = `📁 images/${imageName}`;

    const descLabel = document.createElement('div');
    descLabel.style.cssText = 'font-size:13px; color:#e2e8f0; margin:0.4rem 0 0.6rem;';
    descLabel.textContent = desc;

    const dropArea = document.createElement('div');
    dropArea.style.cssText = `
      padding: 1.4rem 1rem;
      border: 1px dashed rgba(255,255,255,0.2);
      border-radius: 8px;
      margin-top: 0.4rem;
      font-size: 13px;
    `;
    dropArea.innerHTML = '🖱️ 클릭 또는 이미지 끌어다놓기';

    // 기존 이미지가 있으면 미리 보여줌
    const existing = new Image();
    existing.onload = () => {
      dropArea.innerHTML = '';
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.cssText = 'max-width:100%; border-radius:6px;';
      dropArea.appendChild(img);
      const replaceHint = document.createElement('div');
      replaceHint.style.cssText = 'font-size:11px; color:#94a3b8; margin-top:0.4rem;';
      replaceHint.textContent = '← 새 이미지를 끌어다놓으면 교체';
      dropArea.appendChild(replaceHint);
    };
    existing.onerror = () => { /* 그대로 */ };
    existing.src = imageUrl;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    el.appendChild(filenameLabel);
    if (desc) el.appendChild(descLabel);
    el.appendChild(dropArea);
    el.appendChild(fileInput);

    el.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file, dropArea, imageName);
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.style.background = 'rgba(245, 158, 11, 0.18)';
      el.style.borderColor = '#f59e0b';
    });
    el.addEventListener('dragleave', () => {
      el.style.background = 'rgba(245, 158, 11, 0.06)';
      el.style.borderColor = 'rgba(245, 158, 11, 0.6)';
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.style.background = 'rgba(245, 158, 11, 0.06)';
      el.style.borderColor = 'rgba(245, 158, 11, 0.6)';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFile(file, dropArea, imageName);
      }
    });
  }

  function handleFile(file, dropArea, imageName) {
    const reader = new FileReader();
    reader.onload = (e) => {
      dropArea.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.cssText = 'max-width:100%; border-radius:6px;';
      dropArea.appendChild(img);

      const dl = document.createElement('a');
      dl.href = e.target.result;
      dl.download = imageName;
      dl.textContent = `💾 ${imageName} 다운로드`;
      dl.style.cssText = `
        display: inline-block;
        margin-top: 0.6rem;
        padding: 6px 14px;
        background: #22c55e;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
      `;
      dropArea.appendChild(dl);

      const hint = document.createElement('div');
      hint.style.cssText = 'font-size:11px; color:#94a3b8; margin-top:0.5rem;';
      hint.innerHTML = `다운로드 후 <code style="color:#f59e0b;">images/</code> 폴더에 저장 → 새로고침`;
      dropArea.appendChild(hint);
    };
    reader.readAsDataURL(file);
  }

  // ------------------------------------------------------------------
  // 5) 초기화
  // ------------------------------------------------------------------
  function init() {
    injectHomeButton();
    injectEndOfDeckButton();
    injectAdminControls();
    processScreenshots();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
