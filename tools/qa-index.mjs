// Yeni degerleme/index.html için gerçek Chromium görsel QA. `bun tools/qa-index.mjs`
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
import fs from 'fs'; import os from 'os'; import path from 'path';
const URL = process.env.QA_URL || 'http://localhost:8765/degerleme/index.html';
const OUT = 'tests/reports/screenshots';
const EXEC = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
function dens(buf, y0, y1) { try { const p = PNG.sync.read(buf); const { width, height, data } = p; y0 = Math.max(0, y0 | 0); y1 = Math.min(height, y1 | 0); let w = 0, ink = 0, t = 0; for (let y = y0; y < y1; y += 2)for (let x = 0; x < width; x += 4) { const i = (width * y + x) << 2, r = data[i], g = data[i + 1], b = data[i + 2], l = .299 * r + .587 * g + .114 * b; t++; if (r > 242 && g > 242 && b > 242) w++; if (l < 235) ink++; } return { white: t ? +(w / t).toFixed(3) : 0, density: t ? +(ink / t).toFixed(3) : 0 }; } catch (e) { return { white: -1, density: -1 }; } }
async function run(vp, name) {
  const browser = await chromium.launch({ headless: true, executablePath: EXEC });
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  page.on('pageerror', e => errs.push('PAGEERR:' + String(e.message).slice(0, 100)));
  await page.goto(URL, { waitUntil: 'load', timeout: 30000 }); await page.waitForTimeout(1500);
  const m = await page.evaluate(() => {
    const vis = el => !!el && el.offsetParent !== null && el.getClientRects().length > 0;
    const iw = innerWidth, ih = innerHeight;
    const h = document.querySelector('header'); const hr = h ? h.getBoundingClientRect() : null;
    const inVp = !!hr && hr.bottom > 4 && hr.top < ih && hr.width > 50 && hr.height > 20;
    let onTop = false, topEl = '';
    if (hr) { const el = document.elementFromPoint(Math.min(iw - 6, hr.left + 40), Math.max(2, hr.top + hr.height / 2)); topEl = el ? el.tagName + (el.className && el.className.baseVal === undefined ? '.' + String(el.className).split(' ')[0] : '') : 'null'; onTop = !!el && (el === h || h.contains(el) || (el.closest && el.closest('header'))); }
    const hero = document.querySelector('.hero'); const her = hero ? hero.getBoundingClientRect() : null;
    let hv = null; for (const s of ['.hero-panel', 'svg']) { for (const c of [...(hero || document).querySelectorAll(s)].filter(vis)) { const r = c.getBoundingClientRect(); if (r.width >= 200 && r.height >= 150) { hv = r; break; } } if (hv) break; }
    const nav = document.querySelector('.nav'); const navCount = nav ? [...nav.querySelectorAll('a')].length : 0;
    return { headerInViewport: inVp, headerOnTop: onTop, headerVisible: inVp && onTop, topEl, headerBottom: Math.round(hr ? hr.bottom : -9), heroTop: Math.round(her ? her.top : -9), gapPx: Math.round((her ? her.top : 0) - (hr ? hr.bottom : 0)), heroRight: hv ? { w: Math.round(hv.width), h: Math.round(hv.height) } : null, navCount, horizontalOverflow: document.documentElement.scrollWidth > iw + 2 };
  });
  const shot = `${OUT}/v2-home-${name}.png`; const buf = await page.screenshot({ path: shot, fullPage: false });
  const real = errs.filter(e => !/favicon|ERR_FAILED|CORS|net::|Failed to load resource|emlakekspertizi\.com/i.test(e));
  const band = name === 'desktop' ? dens(buf, m.headerBottom, m.headerBottom + 90) : { white: null }; const d = name === 'desktop' ? dens(buf, 0, 900).density : null;
  const heroRightOk = !!m.heroRight && m.heroRight.w >= 320 && m.heroRight.h >= 240;
  const pass = m.headerVisible && m.gapPx <= 8 && (name !== 'desktop' || heroRightOk) && m.navCount === 5 && !m.horizontalOverflow && real.length === 0 && (band.white == null || band.white <= 0.5);
  await browser.close();
  return { name, ...m, heroRightOk, whiteBand: band.white, density: d, consoleErrors: real, screenshot: shot, pass };
}
(async () => {
  const desktop = await run({ width: 1440, height: 900 }, 'desktop');
  const mobile = await run({ width: 390, height: 844 }, 'mobile');
  for (const r of [desktop, mobile]) {
    console.log(`\n[${r.name}] ${r.pass ? 'PASS' : 'FAIL'}  shot=${r.screenshot}`);
    console.log(`  headerVisible=${r.headerVisible} (inVp=${r.headerInViewport} onTop=${r.headerOnTop} topEl=${r.topEl}) headerBottom=${r.headerBottom} heroTop=${r.heroTop} gapPx=${r.gapPx}`);
    console.log(`  heroRight=${JSON.stringify(r.heroRight)} ok=${r.heroRightOk} nav=${r.navCount} overflow=${r.horizontalOverflow} whiteBand=${r.whiteBand} density=${r.density} errors=${r.consoleErrors.length}`);
  }
  fs.writeFileSync('tests/reports/v2-home-report.json', JSON.stringify({ desktop, mobile }, null, 2));
})();
