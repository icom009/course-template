#!/usr/bin/env node
/* =========================================================================
   scripts/check-overflow.js — 슬라이드 섹션 높이 오버플로 휴리스틱 검사기

   reveal.js 5.1.0 기준:
     - 슬라이드 viewport: 1280 x 720
     - margin: 0.06 → 안전 영역 ≈ 1126 x 633

   각 <section> 의 콘텐츠 높이를 요소 종류별 픽셀 추정치로 합산.
   633px 를 넘으면 FAIL, 550~633px 는 WARN.

   사용:
     node scripts/check-overflow.js slides/boot-overview.html
     node scripts/check-overflow.js slides/             # 디렉토리 전체
========================================================================= */

const fs = require('fs');
const path = require('path');

const SAFE_HEIGHT = 633;        // 720 * 0.94 (margin 양쪽 6%)
const WARN_HEIGHT = 550;
const CHARS_PER_LINE = 70;      // 본문 1줄 평균 문자 (한국어 + 영문 혼합)

// 요소별 높이 추정 (px) — reveal.js night theme + 기본 폰트 기준
function estimateHeight(html) {
  // <h1>: ~70px, <h2>: ~55px, <h3>: ~40px
  const h1 = (html.match(/<h1[^>]*>/gi) || []).length * 70;
  const h2 = (html.match(/<h2[^>]*>/gi) || []).length * 55;
  const h3 = (html.match(/<h3[^>]*>/gi) || []).length * 40;

  // <pre><code>: 줄 수 × 22px + 박스 padding 30px
  let preTotal = 0;
  const preMatches = html.match(/<pre[^>]*>[\s\S]*?<\/pre>/gi) || [];
  for (const block of preMatches) {
    const inner = block.replace(/<[^>]+>/g, '');
    const lines = inner.split('\n').length;
    preTotal += lines * 22 + 30;
  }

  // <div class="diagram">: 줄 수 × 22px + padding 30px
  let diagramTotal = 0;
  const diagramMatches = html.match(/<div\s+class="diagram"[^>]*>[\s\S]*?<\/div>/gi) || [];
  for (const block of diagramMatches) {
    const inner = block.replace(/<[^>]+>/g, '');
    const lines = inner.split('\n').filter(l => l.trim()).length;
    diagramTotal += lines * 22 + 30;
  }

  // <li>: 35px × 개수 (목록 한 줄당 — 두 줄 넘는 긴 li 는 별도 가산)
  const liMatches = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
  let liTotal = 0;
  for (const li of liMatches) {
    const text = li.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const wraps = Math.max(1, Math.ceil(text.length / CHARS_PER_LINE));
    liTotal += wraps * 32;
  }

  // <p>: 본문 평균 (글자 길이 기반 줄 수 × 28px + 단락 마진 12px)
  const pMatches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  let pTotal = 0;
  for (const p of pMatches) {
    const text = p.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const wraps = Math.max(1, Math.ceil(text.length / CHARS_PER_LINE));
    pTotal += wraps * 28 + 12;
  }

  // <table>: 행당 36px + 헤더 +10
  let tableTotal = 0;
  const tableMatches = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  for (const t of tableMatches) {
    const rows = (t.match(/<tr[^>]*>/gi) || []).length;
    tableTotal += rows * 36 + 10;
  }

  // <img>: max-width 380px 기본 가정 → 약 250px 높이
  const imgs = (html.match(/<img[^>]*>/gi) || []).length;
  const imgTotal = imgs * 250;

  // .pain-point / .new-tool / .info-box / .tip-box / .warning-box / .summary 박스 padding
  const boxMatches = html.match(/class="(pain-point|new-tool|info-box|tip-box|warning-box|summary|before-after|flow-diagram|objectives)"/gi) || [];
  const boxPadding = boxMatches.length * 30;

  // .columns 좌우 정렬은 절반만 차지 — 보정값 (-30%)
  const colsMatches = html.match(/class="columns"/gi) || [];
  let columnsAdjust = 0;
  for (const _ of colsMatches) {
    columnsAdjust = -Math.round((liTotal + pTotal) * 0.15);
    break; // 첫 columns 만 적용
  }

  return {
    total: h1 + h2 + h3 + preTotal + diagramTotal + liTotal + pTotal + tableTotal + imgTotal + boxPadding + columnsAdjust,
    breakdown: { h1, h2, h3, preTotal, diagramTotal, liTotal, pTotal, tableTotal, imgTotal, boxPadding, columnsAdjust }
  };
}

// HTML 에서 <section> 추출 (중첩 무시 — reveal.js 는 최상위만 슬라이드)
function extractSections(html) {
  const sections = [];
  const re = /<section\b[^>]*>([\s\S]*?)<\/section>/gi;
  let m;
  let depth = 0;
  // 간단한 중첩 처리: <section> 마다 카운트
  // reveal.js 에서는 .slides 직속 자식만 슬라이드. 중첩 section 은 vertical slide.
  // 휴리스틱이므로 모두 점검.
  while ((m = re.exec(html)) !== null) {
    sections.push({ index: sections.length + 1, content: m[1] });
  }
  return sections;
}

function checkFile(filepath) {
  const html = fs.readFileSync(filepath, 'utf-8');
  // 이 프로젝트는 nested section 을 쓰지 않음 — 파일 전체에서 추출.
  const sections = extractSections(html);

  const results = sections.map(s => {
    const h2 = (s.content.match(/<h2[^>]*>([^<]*)<\/h2>/i) || [, ''])[1].replace(/[⚠️🛠️💻🔄📊]/g, '').trim();
    const { total, breakdown } = estimateHeight(s.content);
    let status = 'OK';
    if (total > SAFE_HEIGHT) status = 'FAIL';
    else if (total > WARN_HEIGHT) status = 'WARN';
    return { index: s.index, title: h2 || '(표지/무제)', height: total, status, breakdown };
  });

  return { file: filepath, sections: results };
}

function formatReport(result) {
  if (result.error) {
    return `❌ ${result.file}: ${result.error}`;
  }
  const lines = [`\n📄 ${result.file}`];
  const fails = result.sections.filter(s => s.status === 'FAIL');
  const warns = result.sections.filter(s => s.status === 'WARN');
  lines.push(`   섹션 ${result.sections.length}개 — FAIL ${fails.length} / WARN ${warns.length} / OK ${result.sections.length - fails.length - warns.length}`);

  for (const s of result.sections) {
    if (s.status === 'OK') continue;
    const icon = s.status === 'FAIL' ? '❌' : '⚠️ ';
    lines.push(`   ${icon} §${s.index} ${s.title} — 추정 ${s.height}px (${s.status})`);
    const top3 = Object.entries(s.breakdown)
      .filter(([, v]) => v > 50)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k}=${v}`).join(', ');
    if (top3) lines.push(`        주요 기여: ${top3}`);
  }
  return lines.join('\n');
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('사용: node scripts/check-overflow.js <파일 또는 디렉토리>');
    process.exit(1);
  }

  const stat = fs.statSync(target);
  let files;
  if (stat.isDirectory()) {
    files = fs.readdirSync(target).filter(f => f.endsWith('.html')).map(f => path.join(target, f));
  } else {
    files = [target];
  }

  let totalFails = 0;
  let totalWarns = 0;
  for (const f of files) {
    const result = checkFile(f);
    console.log(formatReport(result));
    if (result.sections) {
      totalFails += result.sections.filter(s => s.status === 'FAIL').length;
      totalWarns += result.sections.filter(s => s.status === 'WARN').length;
    }
  }
  console.log(`\n=== 전체: FAIL ${totalFails} / WARN ${totalWarns} ===`);
  process.exit(totalFails > 0 ? 1 : 0);
}

main();
