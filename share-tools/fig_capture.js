// 덱 안의 그림(인라인 SVG · data-infographic 이 JS 로 그리는 그림)을 실제 브라우저로 렌더해 PNG 로 떠 온다.
// extract_deck.py 의 is_figure() 와 같은 규칙: 장(leaf section)의 직계 자식 중 svg 이거나 svg·[data-infographic] 를 품은 것.
// 사용: node fig_capture.js <edu 루트> <덱 상대경로...>   → cache/figures/<덱이름>/<장>_<k>.png
const { chromium } = require('/home/programs/edu/.claude/skills/덱빌드/scripts/node_modules/playwright-core');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = process.argv[2], DECKS = process.argv.slice(3);
const OUT = path.join(__dirname, 'cache', 'figures');
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); } });
}).listen(0, async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  for (const rel of DECKS) {
    const name = path.basename(rel, '.html');
    fs.mkdirSync(path.join(OUT, name), { recursive: true });
    await page.goto(`http://127.0.0.1:${port}/${rel}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Reveal && Reveal.isReady && Reveal.isReady(), null, { timeout: 15000 }).catch(() => {});
    await page.addStyleTag({ content: '.fragment{opacity:1!important;visibility:visible!important;transform:none!important}' });
    const n = await page.evaluate(() => [...document.querySelectorAll('.slides section')].filter(s => !s.querySelector('section')).length);
    let count = 0;
    for (let i = 0; i < n; i++) {
      const figs = await page.evaluate((i) => {
        const sec = [...document.querySelectorAll('.slides section')].filter(s => !s.querySelector('section'))[i];
        const idx = Reveal.getIndices(sec); Reveal.slide(idx.h, idx.v);
        const out = [];
        [...sec.children].forEach(el => {
          if (/^(H1|H2|ASIDE)$/.test(el.tagName)) return;
          if (el.tagName.toLowerCase() === 'svg' || el.hasAttribute('data-infographic') || el.querySelector('svg,[data-infographic]')) {
            el.setAttribute('data-figcap', `${i}_${out.length}`); out.push(`${i}_${out.length}`);
          }
        });
        return out;
      }, i);
      if (!figs.length) continue;
      await page.waitForTimeout(500);
      for (const id of figs) {
        const el = await page.$(`[data-figcap="${id}"]`);
        await el.screenshot({ path: path.join(OUT, name, `${id}.png`) }).catch(e => console.error(name, id, e.message));
        count++;
      }
    }
    console.log(name, count, '그림');
  }
  await browser.close(); srv.close();
});
