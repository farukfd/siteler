/**
 * extract-brand.js — Faz 3 REFERANS stub: URL → marka çıkarımı
 * ------------------------------------------------------------------
 * Sihirbazdaki "✨ Mevcut web / Google işletme URL'niz" alanı buraya bağlanır.
 * Kullanıcı URL girince backend o sayfayı çeker + AI ile marka bilgilerini
 * çıkarır ve sihirbaz alanlarını (name, accent, tel, mail, adres...) ön-doldurur.
 *
 * BU DOSYA BİR STUB'DIR — üretime almak için:
 *   1) AI anahtarı: wrangler secret put AI_API_KEY   (Claude/OpenAI/Gemini API)
 *   2) SSRF koruması: yalnız http/https + public host; localhost/10./169.254/
 *      172.16-31/192.168/[::1] ENGELLE (aşağıda isSafeUrl).
 *   3) Boyut/zaman limiti: fetch timeout + max byte; yalnız <head> + görünür metin.
 *   4) Çıktı şeması aşağıdaki BRAND_SCHEMA ile SABİT (sihirbaz bunu bekler).
 *   5) worker.js'e route ekle:  if (url.pathname === "/extract") return extractBrand(req, env);
 *
 * İstemci sözleşmesi (wizard):
 *   POST /extract  {url:"https://firma.com"}  →  200 {ok:true, brand:{...}} | {ok:false, error}
 *   Alanlar boş olabilir; sihirbaz yalnız DOLU gelenleri ön-doldurur (kullanıcı düzenler).
 */

/* Sihirbazın beklediği SABİT şema — client obSeed/obPrefill bununla eşleşir */
export const BRAND_SCHEMA = {
  name: "string",        // "Anadolu"
  name2: "string",       // "Yapı"  (varsa 2. kelime)
  unvan: "string",       // ticari unvan
  accent: "string",      // "#RRGGBB" (logodan baskın renk)
  font: "string",        // CURATED_FONTS içinden en yakını (ops.)
  logo: "string",        // mutlak logo URL
  tel: "string", mail: "string", adres: "string",
  il: "string",          // 81 ilden biri (ops.)
  ig: "string", fb: "string", x: "string", li: "string", yt: "string",
  seoTitle: "string", seoDesc: "string",
};

/* SSRF koruması — private/loopback/link-local host'ları reddet */
export function isSafeUrl(u) {
  try {
    var x = new URL(u);
    if (x.protocol !== "http:" && x.protocol !== "https:") return false;
    var h = x.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".localhost")) return false;
    if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return false;
    if (h === "::1" || h === "[::1]" || h.startsWith("fe80") || h.startsWith("fc") || h.startsWith("fd")) return false;
    if (h.indexOf(".") < 0) return false; // bare host / metadata
    return true;
  } catch (e) { return false; }
}

/* AI'ya verilecek talimat — çıktı ZORUNLU JSON (BRAND_SCHEMA) */
export function extractPrompt(pageText, pageUrl) {
  return [
    "Aşağıdaki kurumsal web sayfasının içeriğinden firma marka bilgilerini çıkar.",
    "SADECE şu JSON şemasıyla yanıt ver (bilinmeyen alanı boş string bırak, uydurma):",
    JSON.stringify(BRAND_SCHEMA),
    "accent: sayfadaki/logodaki baskın kurumsal rengi #RRGGBB olarak tahmin et.",
    "name: markanın ilk kelimesi, name2: ikinci kelime (ör. 'Anadolu' + 'Yapı').",
    "Kaynak URL: " + pageUrl,
    "--- SAYFA METNİ (kırpılmış) ---",
    ("" + pageText).slice(0, 6000),
  ].join("\n");
}

/**
 * Referans akış (sözde-kod; AI çağrısı env.AI_API_KEY ister).
 * worker.js'ten çağrılır: return extractBrand(req, env)
 */
export async function extractBrand(req, env) {
  var J = function (s, o) { return new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }); };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  if (req.method !== "POST") return J(405, { ok: false, error: "POST only" });
  if (!env || !env.AI_API_KEY) return J(501, { ok: false, error: "AI_API_KEY tanımlı değil — stub. README Faz 3." });

  var payload;
  try { payload = await req.json(); } catch (e) { return J(400, { ok: false, error: "bad json" }); }
  var target = payload && payload.url;
  if (!isSafeUrl(target)) return J(400, { ok: false, error: "unsafe/invalid url" });

  // 1) Sayfayı güvenli çek (timeout + boyut limiti eklenmeli)
  var html;
  try {
    var ctrl = new AbortController(); var t = setTimeout(function () { ctrl.abort(); }, 8000);
    var r = await fetch(target, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "NADAS-BrandBot/1.0" } });
    clearTimeout(t);
    html = (await r.text()).slice(0, 200000);
  } catch (e) { return J(502, { ok: false, error: "fetch failed" }); }

  // 2) Kaba metin (üretimde: <head> meta + görünür metin ayıkla)
  var text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  // 3) AI çağrısı — SAĞLAYICIYA GÖRE doldur (Claude Messages API örneği README'de).
  //    var brand = await callAI(env.AI_API_KEY, extractPrompt(text, target));
  //    return J(200, { ok:true, brand });
  return J(501, { ok: false, error: "AI çağrısı bağlanmadı — callAI(...) doldurulacak. Bkz. README Faz 3." });
}
