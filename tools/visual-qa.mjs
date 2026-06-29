// Gerçek tarayıcı (Chromium) görsel QA — bun + playwright-core. `bun tools/visual-qa.mjs`
// v2: DOĞRUDAN hash yüklemesi (gerçek kullanıcı akışı) + headerVisible (elementFromPoint /
// overlay kapatıyor mu) + ilk-viewport içerik yoğunluğu + sıkı eşikler (gapPx<=8, heroRight>=320x240).
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
  { slug: 'kvkk-veri-guvenligi', url: BASE + '#/kvkk-veri-guvenligi' },
  { slug: 'metodoloji', url: BASE + '#/metodoloji' },
  { slug: 'raporu-kim-imzalar', url: BASE + '#/raporu-kim-imzalar' },
  { slug: 'konut', url: BASE + '#/konut' },
  { slug: 'banka-teminat-raporu', url: BASE + '#/banka-teminat-raporu' },
];
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

function pixStats(buf, y0, y1) {
  try {
    const png = PNG.sync.read(buf); const { width, height, data } = png;
    y0 = Math.max(0, Math.round(y0)); y1 = Math.min(height, Math.round(y1));
    let white = 0, ink = 0, total = 0;
    for (let y = y0; y < y1; y += 2) for (let x = 0; x < width; x += 4) {
      const i = (width * y + x) << 2, r = data[i], g = data[i + 1], b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b; total++;
      if (r > 242 && g > 242 && b > 242) white++;
      if (lum < 235) ink++;
    }
    return { white: total ? +(white / total).toFixed(3) : 0, density: total ? +(ink / total).toFixed(3) : 0 };
  } catch (e) { return { white: -1, density: -1 }; }
}

async function measure(page) {
  return await page.evaluate(() => {
    const vis = (el) => !!el && el.offsetParent !== null && el.getClientRects().length > 0;
    const iw = window.innerWidth, ih = window.innerHeight;
    const header = document.querySelector('header');
    const hrect = header ? header.getBoundingClientRect() : null;
    const headerInViewport = !!hrect && hrect.bottom > 4 && hrect.top < ih && hrect.width > 50 && hrect.height > 20;
    let headerOnTop = false, topElTag = '';
    if (hrect) {
      const el = document.elementFromPoint(Math.min(iw - 6, hrect.left + 40), Math.max(2, hrect.top + hrect.height / 2));
      topElTag = el ? (el.tagName + (el.id ? '#' + el.id : '') + (el.className && el.className.baseVal === undefined ? '.' + String(el.className).split(' ')[0] : '')) : 'null';
      headerOnTop = !!el && (el === header || header.contains(el) || (el.closest && el.closest('header')));
    }
    const headerVisible = headerInViewport && headerOnTop;

    const overlayOn = !!document.querySelector('#degPage.on, .deg-page.on');
    const heroSel = overlayOn ? '#degPage .dp-hero' : '.hero';
    let hero = document.querySelector(heroSel) || document.querySelector('#degPage .dp-hero, .dp-hero, .hero');
    const hr = hero ? hero.getBoundingClientRect() : null;
    const scope = hero || document;
    let hv = null, hvSel = null;
    for (const s of ['.hero-art', '.dp-hero-visual', '.cat-visual', '.visual-card', '.trust-card', '.metric-card', 'svg']) {
      for (const c of [...scope.querySelectorAll(s)].filter(vis)) { const r = c.getBoundingClientRect(); if (r.width >= 120 && r.height >= 100) { hv = r; hvSel = s; break; } }
      if (hv) break;
    }
    const bc = document.querySelector('#degPage .dp-bread, .dp-bread');
    const navMain = document.getElementById('navMain');
    const navCount = navMain ? [...navMain.children].filter(c => c.querySelector('a') || c.tagName === 'A').length : 0;

    // ilk viewport içerik öğesi sayısı (yoğunluk göstergesi)
    let contentEls = 0;
    document.querySelectorAll('section, .dp-sec, .card, .dp-kpi, .dp-matrix, .dp-trendbox, svg, h1, h2, .btn').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < ih && r.bottom > 0 && r.width > 40 && r.height > 20) contentEls++;
    });

    return {
      headerVisible, headerInViewport, headerOnTop, topElTag,
      headerTop: Math.round(hrect ? hrect.top : -999), headerBottom: Math.round(hrect ? hrect.bottom : -999),
      overlayOn, heroTop: Math.round(hr ? hr.top : -999), gapPx: Math.round((hr ? hr.top : 0) - (hrect ? hrect.bottom : 0)),
      heroRight: hv ? { sel: hvSel, w: Math.round(hv.width), h: Math.round(hv.height) } : null,
      breadcrumbVisible: vis(bc) && bc.offsetHeight > 4, navCount,
      horizontalOverflow: document.documentElement.scrollWidth > iw + 2,
      firstViewportContentEls: contentEls
    };
  });
}

(async () => {
  if (!fs.existsSync(EXEC)) { console.error('Chromium yok:', EXEC); process.exit(2); }
  const browser = await chromium.launch({ headless: true, executablePath: EXEC });
  const results = [];
  for (const p of PAGES) {
    const row = { slug: p.slug, url: p.url };
    for (const [vpName, vp] of [['desktop', DESKTOP], ['mobile', MOBILE]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });
      page.on('pageerror', e => consoleErrors.push('PAGEERR:' + String(e.message).slice(0, 100)));
      // DOĞRUDAN hash yüklemesi — gerçek kullanıcı akışı (manuel openDegPage YOK)
      try { await page.goto(p.url, { waitUntil: 'load', timeout: 30000 }); } catch (e) { consoleErrors.push('GOTO:' + e.message.slice(0, 60)); }
      await page.waitForTimeout(2600);
      const m = await measure(page);
      const shot = `${OUT}/${p.slug}-${vpName}.png`;
      const buf = await page.screenshot({ path: shot, fullPage: false });
      const real = consoleErrors.filter(e => !/favicon|ERR_FAILED|CORS|Access-Control|ERR_NAME|net::|Failed to load resource|emlakekspertizi\.com/i.test(e));
      const band = vpName === 'desktop' ? pixStats(buf, Math.max(0, m.headerBottom), m.headerBottom + 90) : { white: null, density: null };
      const dens = vpName === 'desktop' ? pixStats(buf, 0, 900).density : null;
      const heroRightOk = !!m.heroRight && m.heroRight.w >= 320 && m.heroRight.h >= 240;
      const pass = m.headerVisible && m.gapPx <= 8 && !m.breadcrumbVisible && m.navCount <= 5 &&
        !m.horizontalOverflow && heroRightOk && real.length === 0 && (band.white === null || band.white <= 0.5);
      row[vpName] = { ...m, heroRightOk, whiteBandRatio: band.white, firstViewportDensity: dens, consoleErrors: real, screenshot: shot, pass };
      await ctx.close();
    }
    results.push(row);
    const d = row.desktop;
    console.log(`\n[${row.slug}] ${d.pass ? 'PASS' : 'FAIL'}`);
    console.log(`  headerVisible=${d.headerVisible} (inVp=${d.headerInViewport} onTop=${d.headerOnTop} topEl=${d.topElTag}) headerTop=${d.headerTop} headerBottom=${d.headerBottom}`);
    console.log(`  overlayOn=${d.overlayOn} heroTop=${d.heroTop} gapPx=${d.gapPx} whiteBand=${d.whiteBandRatio} density=${d.firstViewportDensity}`);
    console.log(`  heroRight=${JSON.stringify(d.heroRight)} ok=${d.heroRightOk} nav=${d.navCount} breadcrumb=${d.breadcrumbVisible} overflow=${d.horizontalOverflow} contentEls=${d.firstViewportContentEls} errors=${d.consoleErrors.length}`);
  }
  fs.writeFileSync('tests/reports/visual-report.json', JSON.stringify(results, null, 2));
  const fails = results.filter(r => !r.desktop.pass);
  console.log(`\n==== ÖZET: ${results.length - fails.length}/${results.length} PASS ====`);
  if (fails.length) console.log('FAIL:', fails.map(f => f.slug).join(', '));
  await browser.close(); process.exit(0);
})();
