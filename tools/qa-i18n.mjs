// i18n gerçek-Chromium QA: degerleme dil değiştirme. `bun tools/qa-i18n.mjs`
import { chromium } from 'playwright-core';
import os from 'os'; import path from 'path';
const EXEC = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const BASE = process.env.QA_BASE || 'http://localhost:8765/degerleme';
const PAGES = (process.env.QA_PAGES || 'index,hizmetler,sss,gizlilik,metodoloji').split(',');

async function testPage(browser, slug) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage(); const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
  page.on('pageerror', e => errs.push('PAGEERR:' + String(e.message).slice(0, 120)));
  await page.goto(`${BASE}/${slug}.html`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(800);

  // TR sözlüğünü (tüm anahtarlar) sayfaya yükle
  const trKeys = await page.evaluate(async () => {
    const r = await fetch('assets/i18n/tr.json'); const arr = await r.json();
    window.__TRSET = new Set(arr.map(s => s.trim()));
    return arr.length;
  });

  // örnek görünür düğüm metinleri (başlık/paragraf/bağlantı/buton)
  function sampleEval() {
    const sk = '#degCookie, .crm-app, .crm-login, #girisModal, #teklifModal, #degAdmin, .lang-sw, script, style, noscript';
    const out = [];
    document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span,td,th').forEach(el => {
      if (el.closest(sk)) return;
      if (el.offsetParent === null) return;
      // yalnızca doğrudan metni olan, kısa olmayan düğümler
      const t = (el.textContent || '').trim();
      if (t.length < 3) return;
      out.push(t);
    });
    return out;
  }

  const langResult = {};
  const SK = '#degCookie, .crm-app, .crm-login, #girisModal, #teklifModal, #degAdmin, .lang-sw, script, style, noscript';
  for (const lang of ['en', 'ru', 'zh']) {
    // her dil için temiz ölçüm: sayfayı yeniden yükle, TR setini yükle, çeviriyi uygula, kararlı olana kadar bekle
    await page.goto(`${BASE}/${slug}.html`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(400);
    await page.evaluate(async () => { const r = await fetch('assets/i18n/tr.json'); window.__TRSET = new Set((await r.json()).map(s => s.trim())); });
    // çeviriyi uygula ve fetch+replace tamamlanana kadar poll et (en çok 4sn)
    const r = await page.evaluate(async ({ sk, lang }) => {
      const skSel = sk;
      const measure = () => {
        const set = window.__TRSET; let total = 0, stillTr = 0; const examples = [];
        document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span,td,th').forEach(el => {
          if (el.closest(skSel)) return; if (el.offsetParent === null) return;
          const node = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
          if (!node || node.length < 3) return; total++;
          if (set.has(node)) { stillTr++; if (examples.length < 8) examples.push(node.slice(0, 60)); }
        });
        return { total, stillTr, examples, htmlLang: document.documentElement.lang };
      };
      window.degSetLang(lang);
      let prev = -1, m = measure();
      for (let i = 0; i < 20; i++) { await new Promise(r => setTimeout(r, 200)); m = measure(); if (m.stillTr === prev) break; prev = m.stillTr; }
      return m;
    }, { sk: SK, lang });
    langResult[lang] = r;
  }

  // TR'ye geri dön → orijinal metin geri gelmeli
  await page.evaluate(() => window.degSetLang('tr'));
  await page.waitForTimeout(500);
  const backTr = await page.evaluate(() => {
    const h1 = document.querySelector('h1,h2'); return h1 ? h1.textContent.trim().slice(0, 50) : '';
  });

  await ctx.close();
  const real = errs.filter(e => !/favicon|ERR_FAILED|CORS|net::|Failed to load resource|emlakekspertizi\.com/i.test(e));
  return { slug, trKeys, langResult, backTr, consoleErrors: real };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXEC });
  let allPass = true;
  for (const slug of PAGES) {
    const r = await testPage(browser, slug);
    console.log(`\n=== ${r.slug}.html ===  (TR anahtar: ${r.trKeys})  TR'ye dönüş h: "${r.backTr}"`);
    for (const lang of ['en', 'ru', 'zh']) {
      const x = r.langResult[lang];
      const pct = x.total ? Math.round(100 * (x.total - x.stillTr) / x.total) : 0;
      const ok = pct >= 90; if (!ok) allPass = false;
      console.log(`  ${lang}: çevrilen ${pct}%  (toplam ${x.total}, TR kalan ${x.stillTr}, html lang=${x.htmlLang}) ${ok ? '✓' : '✗'}`);
      if (x.stillTr) console.log(`     kalan örnek: ${JSON.stringify(x.examples)}`);
    }
    if (r.consoleErrors.length) { allPass = false; console.log('  KONSOL HATA:', r.consoleErrors); }
  }
  await browser.close();
  console.log('\n' + (allPass ? 'GENEL: ✓ GEÇTİ' : 'GENEL: ✗ İNCELENMELİ'));
})();
