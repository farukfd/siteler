#!/usr/bin/env bun
/* ============================================================================
   qa/static-check.mjs — TARAYICISIZ statik site denetçisi (bun-native, sıfır dış bağımlılık)
   SEO on-page + JSON-LD schema doğrulama + temel yapı/erişilebilirlik ön-uçuşu.
   Kullanım:  bun qa/static-check.mjs           (tüm siteler)
              bun qa/static-check.mjs danisman  (tek site)
   Çıkış kodu: FAIL varsa 1, yoksa 0 (CI dostu).
   Taşınabilir: yalnız qa/qa.config.json düzenle; bu dosyaya dokunma.
   ========================================================================== */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const cfg = JSON.parse(readFileSync(join(HERE, "qa.config.json"), "utf8"));
const only = process.argv[2];
const SEO = cfg.seo || {};
const C = { g: "\x1b[32m", y: "\x1b[33m", r: "\x1b[31m", d: "\x1b[2m", b: "\x1b[1m", x: "\x1b[0m" };

let totalFail = 0, totalWarn = 0, totalPage = 0;

function txt(re, html) { const m = html.match(re); return m ? m[1].trim() : null; }
function count(re, html) { return (html.match(re) || []).length; }

function checkPage(rel) {
  const file = join(ROOT, cfg.serveDir || ".", rel.replace(/^\//, ""));
  const P = { fail: [], warn: [], ok: [] };
  if (!existsSync(file)) { P.fail.push(`Dosya yok: ${file}`); return P; }
  const html = readFileSync(file, "utf8");

  // ---- SEO: title ----
  const title = txt(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  if (!title) P.fail.push("Başlık (<title>) yok");
  else if (title.length < (SEO.titleMin || 15)) P.warn.push(`Başlık kısa (${title.length} krk): "${title.slice(0,50)}"`);
  else if (title.length > (SEO.titleMax || 70)) P.warn.push(`Başlık uzun (${title.length} krk, öneri ≤${SEO.titleMax})`);
  else P.ok.push("title");

  // ---- SEO: meta description ----  (\1 backreference: açılış tırnağına kadar oku;
  //  çift-tırnaklı içerikteki ' kesme işaretinde YANLIŞ durmayı önler)
  const dm = html.match(/<meta[^>]+name=["']description["'][^>]*content=(["'])([\s\S]*?)\1/i);
  const desc = dm ? dm[2].trim() : null;
  if (!desc) P.fail.push("meta description yok");
  else if (desc.length < (SEO.descMin || 60)) P.warn.push(`Açıklama kısa (${desc.length} krk, öneri ≥${SEO.descMin})`);
  else if (desc.length > (SEO.descMax || 165)) P.warn.push(`Açıklama uzun (${desc.length} krk, öneri ≤${SEO.descMax})`);
  else P.ok.push("description");

  // ---- SEO: canonical ----
  if (!/rel=["']canonical["']/i.test(html)) P.warn.push("canonical link yok");
  else P.ok.push("canonical");

  // ---- SEO: OpenGraph ----
  if (!/property=["']og:title["']/i.test(html)) P.warn.push("og:title yok");
  else P.ok.push("og");

  // ---- lang + viewport ----
  if (!/<html[^>]+lang=/i.test(html)) P.warn.push("<html lang> yok");
  if (!/name=["']viewport["']/i.test(html)) P.fail.push("viewport meta yok (mobil)");

  // ---- yapı: h1 ----  ([\s>] = boşluk veya kapanış; <h1 class=…> ve <h1> ikisini de yakalar)
  const h1 = count(/<h1(\s|>)/gi, html);
  if (h1 === 0) P.warn.push("Sayfada <h1> yok (SEO/yapı)");
  else if (h1 > 1) P.warn.push(`Birden çok <h1> (${h1}) — tek olmalı`);
  else P.ok.push("h1");

  // ---- erişilebilirlik ön-uçuş: alt / label ----
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgNoAlt = imgs.filter(t => !/\balt=/i.test(t)).length;
  if (imgNoAlt) P.warn.push(`${imgNoAlt}/${imgs.length} <img> alt'sız (a11y)`);

  // ---- JSON-LD schema doğrulama ----
  const lds = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  let ldOk = 0;
  lds.forEach((block, i) => {
    const body = block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
    try {
      const obj = JSON.parse(body);
      const nodes = obj["@graph"] || (Array.isArray(obj) ? obj : [obj]);
      const typed = nodes.filter(n => n && (n["@type"] || n["@context"]));
      if (!obj["@context"] && !typed.length) P.warn.push(`JSON-LD #${i+1}: @context/@type eksik`);
      else ldOk++;
    } catch (e) {
      P.fail.push(`JSON-LD #${i+1} GEÇERSİZ (parse hatası): ${e.message.slice(0, 60)}`);
    }
  });
  if (lds.length) P.ok.push(`json-ld×${ldOk}`);

  return P;
}

console.log(`\n${C.b}🔍 Statik Site Denetimi${C.x} ${C.d}(SEO + JSON-LD + yapı · tarayıcısız)${C.x}\n`);
for (const site of cfg.sites) {
  if (only && site.name !== only) continue;
  console.log(`${C.b}▶ ${site.name}${C.x}`);
  for (const page of site.pages) {
    totalPage++;
    const P = checkPage(page);
    const nm = page.replace(/^\//, "");
    if (P.fail.length) {
      totalFail += P.fail.length;
      console.log(`  ${C.r}✗${C.x} ${nm}`);
      P.fail.forEach(m => console.log(`      ${C.r}FAIL${C.x} ${m}`));
      P.warn.forEach(m => console.log(`      ${C.y}warn${C.x} ${m}`));
    } else if (P.warn.length) {
      totalWarn += P.warn.length;
      console.log(`  ${C.y}⚠${C.x} ${nm} ${C.d}(${P.ok.join(" · ")})${C.x}`);
      P.warn.forEach(m => console.log(`      ${C.y}warn${C.x} ${m}`));
    } else {
      console.log(`  ${C.g}✓${C.x} ${nm} ${C.d}(${P.ok.join(" · ")})${C.x}`);
    }
  }
  console.log("");
}
const status = totalFail ? `${C.r}${totalFail} FAIL${C.x}` : `${C.g}0 FAIL${C.x}`;
console.log(`${C.b}Özet:${C.x} ${totalPage} sayfa · ${status} · ${C.y}${totalWarn} uyarı${C.x}\n`);
process.exit(totalFail ? 1 : 0);
