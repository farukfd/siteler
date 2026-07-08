#!/usr/bin/env bun
// İnşaat sitesi — uçtan uca YAYIN HAZIRLIK denetimi (statik analiz)
// Çalıştır: bun insaat/e2e-audit.mjs
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';

const ROOT = resolve(import.meta.dir, '..');      // repo kökü
const INS = join(ROOT, 'insaat');
let pass = 0, fail = 0, warn = 0;
const fails = [], warns = [];
const ok = (m) => { pass++; };
const bad = (m) => { fail++; fails.push(m); };
const wn = (m) => { warn++; warns.push(m); };

// tüm insaat HTML sayfaları (loader stub'ları hariç değil — onları da kontrol et)
const pages = readdirSync(INS).filter(f => f.endsWith('.html'));
const extHosts = new Set();
const extByPage = {};

function attrs(html, re) { const out = []; let m; while ((m = re.exec(html))) out.push(m[1]); return out; }

for (const page of pages) {
  const file = join(INS, page);
  const html = readFileSync(file, 'utf8');
  const rel = 'insaat/' + page;

  // --- 1) Yerel link/asset varlığı (href + src) ---
  const refs = [
    ...attrs(html, /\bhref="([^"#?][^"]*)"/g),
    ...attrs(html, /\bsrc="([^"#?][^"]*)"/g),
  ];
  for (const r of refs) {
    // JS ile üretilen dinamik değerleri atla ('+x+', ${x}, +' vb.)
    if (/[$]\{|'\s*\+|\+\s*'|"\s*\+|\+\s*"/.test(r) || /^['"+]/.test(r)) continue;
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(r)) {
      if (/^https?:/i.test(r)) { try { extHosts.add(new URL(r).host); (extByPage[page] ||= new Set()).add(new URL(r).host); } catch {} }
      continue;
    }
    // yerel yol — mutlak-kök (/x) ise WEB KÖKÜ = repo kökü + img; değilse sayfanın dizinine göre çöz
    const base = dirname(file);
    const clean = r.split('#')[0].split('?')[0];
    if (!clean) continue;
    // Deploy modeli: insaat/* → web kökü, img/ → web kökü. Mutlak /img/... → ROOT/img/...
    const target = clean.startsWith('/') ? join(ROOT, clean.slice(1)) : resolve(base, clean);
    if (existsSync(target)) ok();
    else bad(`${rel}: KIRIK yerel referans → "${r}"`);
  }

  // --- 2) SEO zorunluları (admin/loader stub hariç public sayfalar) ---
  const isStub = html.length < 1500 && /sessionStorage/.test(html); // loader stub
  if (!isStub) {
    if (/<title>[^<]{5,}<\/title>/.test(html)) ok(); else bad(`${rel}: <title> eksik/kısa`);
    if (/<meta[^>]+name="description"[^>]+content="[^"]{20,}"/i.test(html)) ok(); else bad(`${rel}: meta description eksik/kısa`);
    if (/<link[^>]+rel="canonical"[^>]+href="https:\/\/[^"]+"/i.test(html)) ok(); else wn(`${rel}: absolute canonical yok`);
    if (/property="og:title"/.test(html)) ok(); else wn(`${rel}: og:title yok`);
    if (/rel="icon"|rel="shortcut icon"/.test(html)) ok(); else wn(`${rel}: favicon <link rel=icon> yok`);
    // JSON-LD geçerliliği
    const lds = attrs(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    for (const ld of lds) { try { JSON.parse(ld); ok(); } catch (e) { bad(`${rel}: GEÇERSİZ JSON-LD (${String(e.message).slice(0,40)})`); } }
    if (lds.length === 0) wn(`${rel}: JSON-LD yok`);
    // dil
    if (/<html[^>]+lang="tr"/i.test(html)) ok(); else wn(`${rel}: <html lang="tr"> yok`);
    // viewport
    if (/name="viewport"/.test(html)) ok(); else bad(`${rel}: viewport meta yok`);
  }

  // --- 3) Güvenlik: sızmış sır / şifre ipucu ---
  if (/sk-[a-f0-9]{20,}/i.test(html)) bad(`${rel}: OLASI API ANAHTARI sızıntısı (sk-...)`);
  if (/meridyen2026/.test(html) && !/admPass:/.test(html)) {
    // görünür alanda şifre ipucu (placeholder/label/metin) — admPass tanımı hariç
    const visible = html.replace(/admPass:'[^']*'/g, '');
    if (/meridyen2026/.test(visible)) bad(`${rel}: GÖRÜNÜR şifre ipucu (meridyen2026)`);
    else ok();
  }
  // eski kırılgan kalıntılar
  if (/output=embed/.test(html)) bad(`${rel}: eski Google keyless map embed (ERR_ABORTED riski)`);
  if (/new SplitText\(/.test(html)) bad(`${rel}: kırılgan SplitText hâlâ var (boş içerik riski)`);
  if (/id="cur"|class="cur"/.test(html)) bad(`${rel}: özel yuvarlak imleç (.cur) hâlâ var`);
}

// --- 4) Yayın dosyaları ---
for (const f of ['sitemap.xml', 'robots.txt', 'VERSION']) {
  if (existsSync(join(INS, f))) ok(); else wn(`insaat/${f} yok`);
}
// sitemap URL'leri geçerli mi
if (existsSync(join(INS, 'sitemap.xml'))) {
  const sm = readFileSync(join(INS, 'sitemap.xml'), 'utf8');
  const locs = attrs(sm, /<loc>([^<]+)<\/loc>/g);
  if (locs.length >= 4) ok(); else wn(`sitemap az URL içeriyor (${locs.length})`);
  if (locs.every(u => /^https:\/\//.test(u))) ok(); else bad('sitemap: bazı loc absolute https değil');
}

console.log('\n=== HARİCİ BAĞIMLILIKLAR (yayında erişilebilir olmalı) ===');
console.log([...extHosts].sort().join('\n'));
console.log('\n=== SONUÇ ===');
if (warns.length) { console.log('\n⚠ UYARILAR:'); warns.forEach(w => console.log('  ⚠ ' + w)); }
if (fails.length) { console.log('\n❌ HATALAR:'); fails.forEach(f => console.log('  ❌ ' + f)); }
console.log(`\n${pass} geçti · ${warn} uyarı · ${fail} HATA`);
process.exit(fail ? 1 : 0);
