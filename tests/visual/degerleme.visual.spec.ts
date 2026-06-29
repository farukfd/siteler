import { test, expect, Page } from '@playwright/test';

// Gerçek tarayıcı görsel QA — node + @playwright/test ile: `npx playwright test`
// (Bu ortamda node yok; eşdeğer koşum: `bun tools/visual-qa.mjs`.)

const PAGES = [
  { slug: 'home', hash: '' },
  { slug: 'metodoloji', hash: '#/metodoloji' },
  { slug: 'kvkk-veri-guvenligi', hash: '#/kvkk-veri-guvenligi' },
  { slug: 'raporu-kim-imzalar', hash: '#/raporu-kim-imzalar' },
  { slug: 'konut', hash: '#/konut' },
  { slug: 'ticari', hash: '#/ticari' },
  { slug: 'arsa-arazi', hash: '#/arsa-arazi' },
  { slug: 'banka-teminat-raporu', hash: '#/banka-teminat-raporu' },
  { slug: 'basvuru', hash: '#/basvuru' },
];

async function metrics(page: Page, slug: string, isOverlay: boolean) {
  if (isOverlay) await page.evaluate((s) => { try { (window as any).openDegPage?.(s); } catch {} }, slug);
  await page.waitForTimeout(2200);
  return await page.evaluate((isOverlay) => {
    const vis = (el: Element | null) => !!el && (el as HTMLElement).offsetParent !== null && el.getClientRects().length > 0;
    const header = document.querySelector('header');
    const hb = header ? header.getBoundingClientRect().bottom : 0;
    let hero = document.querySelector(isOverlay ? '#degPage .dp-hero' : '.hero') || document.querySelector('.dp-hero, .hero');
    const hr = hero ? hero.getBoundingClientRect() : null;
    const scope = hero || document;
    const sels = ['.hero-art', '.dp-hero-visual', '.cat-visual', '.visual-card', '.trust-card', '.metric-card', 'svg'];
    let hv: DOMRect | null = null;
    for (const s of sels) { for (const c of [...scope.querySelectorAll(s)].filter(vis)) { const r = c.getBoundingClientRect(); if (r.width >= 120 && r.height >= 100) { hv = r; break; } } if (hv) break; }
    const bc = document.querySelector('#degPage .dp-bread, .dp-bread');
    const navMain = document.getElementById('navMain');
    const navCount = navMain ? [...navMain.children].filter(c => c.querySelector('a') || c.tagName === 'A').length : 0;
    return {
      gapPx: Math.round((hr ? hr.top : 0) - hb),
      heroRightOk: !!hv && hv.width >= 280 && hv.height >= 220,
      breadcrumbVisible: vis(bc) && (bc as HTMLElement).offsetHeight > 4,
      navCount,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  }, isOverlay);
}

for (const p of PAGES) {
  test(`visual: ${p.slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', m => { if (m.type() === 'error' && !/favicon|CORS|net::|emlakekspertizi/i.test(m.text())) errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto('/degerleme.html' + p.hash, { waitUntil: 'load' });
    const m = await metrics(page, p.slug, p.hash.includes('#/'));
    await page.screenshot({ path: `tests/reports/screenshots/${p.slug}-${test.info().project.name}.png` });
    expect(m.gapPx, 'header-altı boşluk ≤12px').toBeLessThanOrEqual(12);
    expect(m.breadcrumbVisible, 'breadcrumb UI görünmez').toBeFalsy();
    expect(m.navCount, 'header ≤5 link').toBeLessThanOrEqual(5);
    expect(m.horizontalOverflow, 'yatay taşma yok').toBeFalsy();
    expect(errors, 'console error yok').toHaveLength(0);
    if (test.info().project.name === 'desktop') expect(m.heroRightOk, 'hero sağ kolon görseli').toBeTruthy();
  });
}
