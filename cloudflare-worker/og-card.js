/**
 * og-card.js — Per-tenant OG (Open Graph) kart üreticisi (1200×630 SVG)
 * ------------------------------------------------------------------
 * Faz 2: Kurumsal müşteri sihirbazda marka + renk girince, sosyal paylaşım
 * kartı da (WhatsApp/LinkedIn/X/Facebook önizlemesi) o markaya döner.
 *
 * NEDEN SERVER-SIDE: Sosyal tarayıcılar JS çalıştırmaz; yalnız statik HTML
 * meta[og:image]'i okur ve o URL'den GÖRSELİ çeker. Bu yüzden kart bir
 * görsel endpoint'inden (Cloudflare Worker /og) dönmeli — client JS yetmez.
 *
 * Kullanım (worker.js): renderOgSvg({site,name,name2,accent,tagline,domain})
 *   → image/svg+xml döner. SVG'yi WhatsApp/Telegram/Slack/Discord doğrudan
 *   işler; Facebook/X/LinkedIn için PNG istenirse resvg-wasm ile SVG→PNG
 *   dönüştürme README'de belgelenmiştir (satori GEREKMEZ; kart zaten SVG).
 */

/**
 * buildOgUrl — provisioning/backend'in <meta og:image> için kullanacağı URL kurucu.
 * Client ve backend AYNI sözleşmeyi üretsin diye tek yerde. Örn:
 *   buildOgUrl("https://prox.musteri.com", {site:"insaat",name:"Anadolu",name2:"Yapı",accent:"#1e5aa8",domain:"anadoluyapi.com"})
 *   → "https://prox.musteri.com/og?site=insaat&name=Anadolu&name2=Yap%C4%B1&accent=%231e5aa8&domain=anadoluyapi.com"
 * @param {string} base  OG endpoint origin (Worker) — sonda / olsa da olmasa da
 * @param {object} p     {site,name,name2,accent,tagline,domain}
 */
export function buildOgUrl(base, p) {
  p = p || {};
  var root = ("" + (base || "")).replace(/\/+$/, "");
  var q = [];
  ["site", "name", "name2", "accent", "tagline", "domain"].forEach(function (k) {
    if (p[k]) q.push(k + "=" + encodeURIComponent(p[k]));
  });
  return root + "/og" + (q.length ? "?" + q.join("&") : "");
}

/* Site tipine göre etiket + varsayılan slogan + varsayılan tema rengi */
export const OG_SITE = {
  insaat:      { label: "KURUMSAL İNŞAAT",      tagline: "Anahtar teslim · Kentsel dönüşüm · Kat karşılığı", accent: "#c8102e" },
  gayrimenkul: { label: "GAYRİMENKUL",          tagline: "Satılık & kiralık · Değerleme · Bölge analizi",   accent: "#0ea5a5" },
  danisman:    { label: "GAYRİMENKUL DANIŞMANI", tagline: "Portföy · Değerleme · Yatırım danışmanlığı",     accent: "#7c3aed" },
};

function esc(s) {
  return ("" + (s == null ? "" : s))
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function hexOk(h) { return typeof h === "string" && /^#[0-9a-fA-F]{6}$/.test(h); }
function lighten(hex, amt) {
  try { var n = parseInt(hex.slice(1), 16); var r = Math.min(255, (n >> 16) + amt), g = Math.min(255, ((n >> 8) & 255) + amt), b = Math.min(255, (n & 255) + amt); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); } catch (e) { return hex; }
}
function lum(hex) { try { var n = parseInt(hex.slice(1), 16); return .2126 * ((n >> 16) / 255) + .7152 * (((n >> 8) & 255) / 255) + .0722 * ((n & 255) / 255); } catch (e) { return 0; } }
/* uzun markayı iki satıra böl (kabaca ~15 karakter/satır, ~28 üstü) */
function fit(name) {
  var s = ("" + name).trim();
  if (s.length <= 20) return [s];
  var words = s.split(/\s+/), l1 = "", l2 = "";
  for (var i = 0; i < words.length; i++) { if ((l1 + " " + words[i]).trim().length <= 18 && !l2) l1 = (l1 + " " + words[i]).trim(); else l2 = (l2 + " " + words[i]).trim(); }
  return l2 ? [l1, l2] : [l1];
}

/**
 * @param {{site?:string,name?:string,name2?:string,accent?:string,tagline?:string,domain?:string}} p
 * @returns {string} SVG (1200×630)
 */
export function renderOgSvg(p) {
  p = p || {};
  var conf = OG_SITE[p.site] || OG_SITE.insaat;
  var accent = hexOk(p.accent) ? p.accent : conf.accent;
  var accent2 = lighten(accent, 26);
  var full = ((p.name || "Meridyen") + (p.name2 ? (" " + ("" + p.name2).trim()) : "")).trim();
  var initial = (full.charAt(0) || "M").toLocaleUpperCase("tr");
  var tagline = p.tagline || conf.tagline;
  var domain = (p.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  var onAccent = lum(accent) > .55 ? "#0e1420" : "#ffffff";
  var lines = fit(full);
  var nameSize = lines.length > 1 ? 88 : (full.length > 12 ? 96 : 112);
  var nameY = lines.length > 1 ? 300 : 330;

  /* benzersiz gradyan ID'leri — aynı sayfaya birden çok kart inline edilirse
     id="ac"/id="bg" çakışıp yanlış renk almasın (deterministik; rastgele YOK) */
  var uid = ((accent.replace("#", "") + (p.site || "x") + full.length).toLowerCase()).replace(/[^a-z0-9]/g, "").slice(0, 12);
  var BG = "bg" + uid, AC = "ac" + uid;

  var nameTspans = lines.map(function (ln, i) {
    return '<tspan x="90" dy="' + (i === 0 ? 0 : nameSize * 1.05) + '">' + esc(ln) + '</tspan>';
  }).join("");

  return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="' + esc(full) + '">'
    + '<defs>'
    + '<linearGradient id="' + BG + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b111b"/><stop offset="1" stop-color="#131c2b"/></linearGradient>'
    + '<linearGradient id="' + AC + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + accent + '"/><stop offset="1" stop-color="' + accent2 + '"/></linearGradient>'
    + '</defs>'
    + '<rect width="1200" height="630" fill="url(#' + BG + ')"/>'
    /* sağ dekoratif blok + accent şerit */
    + '<rect x="0" y="0" width="14" height="630" fill="url(#' + AC + ')"/>'
    + '<circle cx="1140" cy="560" r="360" fill="url(#' + AC + ')" opacity="0.10"/>'
    + '<circle cx="1090" cy="120" r="180" fill="url(#' + AC + ')" opacity="0.08"/>'
    /* marka rozeti (harf) */
    + '<rect x="90" y="96" width="104" height="104" rx="24" fill="url(#' + AC + ')"/>'
    + '<text x="142" y="170" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="60" font-weight="800" fill="' + onAccent + '" text-anchor="middle">' + esc(initial) + '</text>'
    /* site tipi etiketi */
    + '<text x="214" y="150" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" font-weight="700" letter-spacing="3" fill="' + accent2 + '">' + esc(conf.label) + '</text>'
    /* marka adı */
    + '<text y="' + nameY + '" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="' + nameSize + '" font-weight="800" fill="#ffffff">' + nameTspans + '</text>'
    /* slogan */
    + '<text x="90" y="' + (nameY + (lines.length > 1 ? nameSize * 1.05 : 0) + 70) + '" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="34" font-weight="500" fill="#aeb8c6">' + esc(tagline) + '</text>'
    /* alt çizgi + domain */
    + '<rect x="90" y="548" width="72" height="6" rx="3" fill="url(#' + AC + ')"/>'
    + (domain ? '<text x="90" y="592" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="600" fill="#7f8b9c">' + esc(domain) + '</text>' : '')
    + '</svg>';
}
