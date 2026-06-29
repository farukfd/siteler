// Gerçek tarayıcı (Chromium) görsel QA — bun + playwright-core ile çalışır.
// node/npm yokken bun ile: `bun tools/visual-qa.mjs`
// Mevcut Chromium-1208 (ms-playwright cache) executablePath ile kullanılır; indirme yok.
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
import fs from 'fs';
import os from 'os';
import path from 'path';

const BASE = process.env.QA_BASE || 'http://localhost:8765/degerleme.html';
const OUT = 'tests/reports/screenshots';
const EXEC = path.join(os.homedir(),
  'Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');

const PAGES = [
  { slug: 'home', url: BASE },
  { slug: 'metodoloji', url: BASE + '#/metodoloji' },
  { slug: 'kvkk-veri-guvenligi', url: BASE + '#/kvkk-veri-guvenligi' },
  { slug: 'raporu-kim-imzalar', url: BASE + '#/raporu-kim-imzalar' },
  { slug: 'konut', url: BASE + '#/konut' },
  { slug: 'ticari', url: BASE + '#/ticari' },
  { slug: 'arsa-arazi', url: BASE + '#/arsa-arazi' },
  { slug: 'banka-teminat-raporu', url: BASE + '#/banka-teminat-raporu' },
  { slug: 'basvuru', url: BASE + '#/basvuru' },
];

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

function whiteBandRatio(buf, fromY, toY) {
  try {
    const png = PNG.sync.read(buf);
    const { width, height, data } = png;
    const y0 = Math.max(0, Math.round(fromY)), y1 = Math.min(height, Math.round(toY));
    if (y1 <= y0) return 0;
    let white = 0, total = 0;
    for (let y = y0; y < y1; y += 2) {
      for (let x = 0; x < width; x += 4) {
        const i = (width * y + x) << 2;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        total++;
        if (r > 240 && g > 240 && b > 240) white++;
      }
    }
    return total ? +(white / total).toFixed(3) : 0;
  } catch (e) { return -1; }
}

async function measure(page, slug, isOverlay) {
  // hash router varsa overlay'i garantiye al
  if (isOverlay) {
    await page.evaluate((s) => {
      try { if (typeof openDegPage === 'function') openDegPage(s); } catch (e) {}
    }, slug);
  }
  await page.waitForTimeout(2200); // büyük script + async trend

  return await page.evaluate((isOverlay) => {
    const vis = (el) => !!el && el.offsetParent !== null && el.getClientRects().length > 0;
    const header = document.querySelector('header');
    const hb = header ? header.getBoundingClientRect().bottom : 0;

    const heroSel = isOverlay ? '#degPage .dp-hero' : '.hero';
    let hero = document.querySelector(heroSel);
    if (!hero) hero = document.querySelector('#degPage .dp-hero, .dp-hero, .hero');
    const hr = hero ? hero.getBoundingClientRect() : null;
    const heroTop = hr ? hr.top : 0;

    // hero sağ kolon görseli
    const scope = hero || document;
    const sels = ['.hero-art', '.dp-hero-visual', '.cat-visual', '.visual-card', '.trust-card', '.metric-card', 'svg'];
    let hv = null, hvSel = null;
    for (const s of sels) {
      const cand = [...scope.querySelectorAll(s)].filter(vis);
      for (const c of cand) {
        const r = c.getBoundingClientRect();
        if (r.width >= 120 && r.height >= 100) { hv = r; hvSel = s; break; }
      }
      if (hv) break;
    }
    const heroRight = hv ? { sel: hvSel, w: Math.round(hv.width), h: Math.round(hv.height) } : null;
    const heroRightOk = !!hv && hv.width >= 280 && hv.height >= 220;

    // breadcrumb görünür mü
    const bc = document.querySelector('#degPage .dp-bread, .dp-bread');
    const breadcrumbVisible = vis(bc) && bc.offsetHeight > 4;

    // header nav link sayısı (desktop top-level)
    const navMain = document.getElementById('navMain');
    let navCount = 0;
    if (navMain) navCount = [...navMain.children].filter(c => c.querySelector('a') || c.tagName === 'A').length;
    // mobil drawer başlık sayısı
    const mnav = document.getElementById('mnavLinks');
    const mobileCount = mnav ? [...mnav.children].filter(c => c.querySelector('a,button') || c.tagName === 'A').length : 0;

    const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 2;

    return {
      headerBottom: Math.round(hb), heroTop: Math.round(heroTop),
      gapPx: Math.round(heroTop - hb),
      heroRight, heroRightOk, breadcrumbVisible, navCount, mobileCount, horizontalOverflow,
      heroSel: hero ? heroSel : 'NONE'
    };
  }, isOverlay);
}

(async () => {
  if (!fs.existsSync(EXEC)) { console.error('Chromium bulunamadı:', EXEC); process.exit(2); }
  const browser = await chromium.launch({ headless: true, executablePath: EXEC });
  const results = [];

  for (const p of PAGES) {
    const isOverlay = p.url.includes('#/');
    const row = { slug: p.slug, url: p.url };
    for (const [vpName, vp] of [['desktop', DESKTOP], ['mobile', MOBILE]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 140)); });
      page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + String(e.message).slice(0, 140)));
      try {
        await page.goto(p.url, { waitUntil: 'load', timeout: 30000 });
      } catch (e) { consoleErrors.push('GOTO: ' + e.message.slice(0, 80)); }
      const m = await measure(page, p.slug, isOverlay);
      const shot = `${OUT}/${p.slug}-${vpName}.png`;
      const buf = await page.screenshot({ path: shot, fullPage: false });
      // CORS/fallback ve favicon kaynaklı network hataları gerçek JS hatası değildir → filtrele
      const realErrors = consoleErrors.filter(e =>
        !/favicon|ERR_FAILED|CORS|Access-Control|ERR_NAME|net::|Failed to load resource|emlakekspertizi\.com/i.test(e));
      const whiteBand = vpName === 'desktop'
        ? whiteBandRatio(buf, m.headerBottom + 1, m.headerBottom + 101) : null;
      const pass = (m.gapPx <= 12) && m.heroRightOk && !m.breadcrumbVisible &&
        (m.navCount <= 5) && !m.horizontalOverflow && realErrors.length === 0;
      row[vpName] = { ...m, whiteBand, consoleErrors: realErrors, screenshot: shot, pass };
      await ctx.close();
    }
    results.push(row);
    const d = row.desktop;
    console.log(`\n[${row.slug}] ${d.pass ? 'PASS' : 'FAIL'}`);
    console.log(`  headerBottom=${d.headerBottom} heroTop=${d.heroTop} gapPx=${d.gapPx} whiteBand=${d.whiteBand}`);
    console.log(`  heroRightOk=${d.heroRightOk} heroRight=${JSON.stringify(d.heroRight)} navCount=${d.navCount} breadcrumb=${d.breadcrumbVisible} overflow=${d.horizontalOverflow} errors=${d.consoleErrors.length}`);
    console.log(`  mobile: nav(drawer)=${row.mobile.mobileCount} overflow=${row.mobile.horizontalOverflow} shot=${row.mobile.screenshot}`);
  }

  fs.writeFileSync('tests/reports/visual-report.json', JSON.stringify(results, null, 2));
  const fails = results.filter(r => !r.desktop.pass);
  console.log(`\n==== ÖZET: ${results.length - fails.length}/${results.length} PASS ====`);
  if (fails.length) console.log('FAIL:', fails.map(f => f.slug).join(', '));
  await browser.close();
  process.exit(0);
})();
