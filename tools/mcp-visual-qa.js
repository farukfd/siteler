#!/usr/bin/env node
// Visual QA MCP server (self-contained stdio JSON-RPC 2.0 — harici SDK gerektirmez).
// Claude Code'a eklemek için:
//   claude mcp add --scope local --transport stdio visual-qa -- bun tools/mcp-visual-qa.js
// (node kuruluysa `bun` yerine `node` kullanılabilir.)
// Güvenlik: API/tenant key gömülmez; yalnız localhost ölçümü yapar.
import { chromium } from 'playwright-core';
import os from 'os';
import path from 'path';
import fs from 'fs';

const EXEC = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const BASE = process.env.QA_BASE || 'http://localhost:8765/degerleme.html';
const SLUGS = ['metodoloji','kvkk-veri-guvenligi','raporu-kim-imzalar','konut','ticari','arsa-arazi','banka-teminat-raporu','basvuru'];

async function inspect(url) {
  const isOverlay = url.includes('#/');
  const slug = isOverlay ? url.split('#/')[1] : 'home';
  const browser = await chromium.launch({ headless: true, executablePath: EXEC });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error' && !/favicon|CORS|net::|emlakekspertizi/i.test(m.text())) consoleErrors.push(m.text().slice(0,120)); });
  page.on('pageerror', e => consoleErrors.push(String(e).slice(0,120)));
  try { await page.goto(url, { waitUntil: 'load', timeout: 30000 }); } catch (e) {}
  if (isOverlay) await page.evaluate(s => { try { openDegPage(s); } catch (e) {} }, slug);
  await page.waitForTimeout(2200);
  const m = await page.evaluate((isOverlay) => {
    const vis = el => !!el && el.offsetParent !== null && el.getClientRects().length > 0;
    const header = document.querySelector('header'); const hb = header ? header.getBoundingClientRect().bottom : 0;
    let hero = document.querySelector(isOverlay ? '#degPage .dp-hero' : '.hero') || document.querySelector('.dp-hero, .hero');
    const hr = hero ? hero.getBoundingClientRect() : null; const scope = hero || document;
    let hv = null;
    for (const s of ['.hero-art','.dp-hero-visual','.cat-visual','.visual-card','.trust-card','.metric-card','svg']) { for (const c of [...scope.querySelectorAll(s)].filter(vis)) { const r = c.getBoundingClientRect(); if (r.width>=120&&r.height>=100){hv=r;break;} } if (hv) break; }
    const bc = document.querySelector('#degPage .dp-bread, .dp-bread'); const navMain = document.getElementById('navMain');
    return { headerBottom: Math.round(hb), heroTop: Math.round(hr?hr.top:0), gapPx: Math.round((hr?hr.top:0)-hb),
      heroRightVisualExists: !!hv && hv.width>=280 && hv.height>=220, navCount: navMain?[...navMain.children].filter(c=>c.querySelector('a')||c.tagName==='A').length:0,
      breadcrumbVisible: vis(bc) && bc.offsetHeight>4, horizontalOverflow: document.documentElement.scrollWidth>window.innerWidth+2 };
  }, isOverlay);
  const screenshotPath = `tests/reports/screenshots/mcp-${slug}.png`;
  try { fs.mkdirSync('tests/reports/screenshots', { recursive: true }); await page.screenshot({ path: screenshotPath }); } catch (e) {}
  await browser.close();
  const pass = m.gapPx<=12 && m.heroRightVisualExists && !m.breadcrumbVisible && m.navCount<=5 && !m.horizontalOverflow && consoleErrors.length===0;
  return { url, ...m, consoleErrors, screenshotPath, pass };
}

const TOOLS = {
  inspect_layout: { d: 'Bir URL için tam layout ölçümü (gap, hero sağ görsel, nav, breadcrumb, overflow, console).', run: a => inspect(a.url || BASE) },
  measure_header_hero_gap: { d: 'Header alt / hero üst arası piksel boşluğunu ölçer.', run: async a => { const r = await inspect(a.url||BASE); return { url:r.url, headerBottom:r.headerBottom, heroTop:r.heroTop, gapPx:r.gapPx, pass:r.gapPx<=12 }; } },
  assert_no_white_gap: { d: 'Header altı boşluk ≤12px mı?', run: async a => { const r = await inspect(a.url||BASE); return { url:r.url, gapPx:r.gapPx, pass:r.gapPx<=12 }; } },
  assert_hero_right_visual: { d: 'Hero sağ kolonunda görsel (≥280x220) var mı?', run: async a => { const r = await inspect(a.url||BASE); return { url:r.url, heroRightVisualExists:r.heroRightVisualExists, pass:r.heroRightVisualExists }; } },
  assert_header_nav_count: { d: 'Header üst-menü link sayısı beklenen mi?', run: async a => { const r = await inspect(a.url||BASE); const exp = a.expectedCount ?? 5; return { url:r.url, navCount:r.navCount, expected:exp, pass:r.navCount<=exp }; } },
  crawl_degerleme_pages: { d: 'Tüm anahtar degerleme sayfalarını gezip ölçer.', run: async () => { const out=[]; for (const s of SLUGS) out.push(await inspect(BASE+'#/'+s)); out.unshift(await inspect(BASE)); return out; } },
  generate_visual_report: { d: 'Crawl + JSON rapor üretir ve dosyaya yazar.', run: async () => { const out=[]; out.push(await inspect(BASE)); for (const s of SLUGS) out.push(await inspect(BASE+'#/'+s)); fs.mkdirSync('tests/reports',{recursive:true}); fs.writeFileSync('tests/reports/visual-report.json', JSON.stringify(out,null,2)); return { total: out.length, pass: out.filter(r=>r.pass).length, fail: out.filter(r=>!r.pass).map(r=>r.url) }; } },
};

function send(o){ process.stdout.write(JSON.stringify(o) + '\n'); }
let buf='';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async chunk => {
  buf += chunk; let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    let msg; try { msg = JSON.parse(line); } catch { continue; }
    const { id, method, params } = msg;
    if (method === 'initialize') send({ jsonrpc:'2.0', id, result:{ protocolVersion:'2024-11-05', capabilities:{ tools:{} }, serverInfo:{ name:'visual-qa', version:'1.0.0' } } });
    else if (method === 'notifications/initialized') { /* no reply */ }
    else if (method === 'tools/list') send({ jsonrpc:'2.0', id, result:{ tools: Object.entries(TOOLS).map(([name,t]) => ({ name, description:t.d, inputSchema:{ type:'object', properties:{ url:{type:'string'}, expectedCount:{type:'number'} } } })) } });
    else if (method === 'tools/call') {
      const t = TOOLS[params?.name];
      if (!t) { send({ jsonrpc:'2.0', id, error:{ code:-32601, message:'Bilinmeyen tool' } }); continue; }
      try { const res = await t.run(params.arguments || {}); send({ jsonrpc:'2.0', id, result:{ content:[{ type:'text', text: JSON.stringify(res, null, 2) }] } }); }
      catch (e) { send({ jsonrpc:'2.0', id, result:{ content:[{ type:'text', text:'HATA: '+String(e&&e.message||e) }], isError:true } }); }
    }
    else if (id !== undefined) send({ jsonrpc:'2.0', id, error:{ code:-32601, message:'method bulunamadı' } });
  }
});
