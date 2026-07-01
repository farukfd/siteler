// Yayınlanan ayarları (assets/data/site-config.json) tüm degerleme/*.html sayfalarının
// HAM <head>'ine gömer: GA4/GTM/Google Ads/AdSense/doğrulama/robots/özel kod.
// Böylece Google ve tüm botlar etiketleri JS render etmeden görür (en yüksek SEO güvenilirliği).
// Runtime (degApplySeo) window.__DEG_BAKED görünce SEO enjeksiyonunu atlar (çifte enjeksiyon olmaz).
// İdempotent: eski gömülü blok her seferinde temizlenir. `bun tools/apply-config.mjs`
import fs from 'fs';
const DIR = 'degerleme';
const CFG = `${DIR}/assets/data/site-config.json`;

let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(CFG, 'utf8')); } catch (e) { console.error('site-config.json okunamadı:', e.message); process.exit(1); }
const seo = cfg.seo || {};

function tok(v) { v = String(v || '').trim(); if (!v) return ''; const m = v.match(/content="([^"]+)"/i); if (m) return m[1]; if (v.indexOf('=') !== -1 && v.indexOf(' ') === -1) return v.split('=').pop(); return v; }
function metaTag(name, content) { content = String(content || '').trim(); return content ? `  <meta name="${name}" content="${content.replace(/"/g, '&quot;')}">\n` : ''; }

const gaId = (seo.ga4 || cfg.ga || '').trim(), adsId = (seo.adsId || '').trim(), gtagId = gaId || adsId;
const gtm = (seo.gtm || '').trim();
const pub = (seo.adsense || '').trim();

// ---- <head> bloğu ----
let head = '<!--deg-seo-start-->\n  <script>window.__DEG_BAKED=1;</script>\n';
if (gtagId) {
  head += `  <script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}"></script>\n`;
  head += '  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());';
  if (gaId) head += `gtag("config","${gaId}");`;
  if (adsId) head += `gtag("config","${adsId}");`;
  head += '</script>\n';
}
if (gtm) {
  head += `  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');</script>\n`;
}
head += metaTag('google-site-verification', tok(seo.gsc || cfg.gsc));
head += metaTag('msvalidate.01', tok(seo.bing));
head += metaTag('yandex-verification', tok(seo.yandex));
if (pub) {
  head += metaTag('google-adsense-account', pub);
  head += `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(pub)}" crossorigin="anonymous"></script>\n`;
}
head += metaTag('robots', seo.robotsIndex === false ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
if (seo.headCode && String(seo.headCode).trim()) head += '  ' + String(seo.headCode).trim() + '\n';
head += '<!--deg-seo-end-->';

// ---- <body> GTM noscript ----
const bodyNs = gtm
  ? `<!--deg-gtm-ns-start--><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!--deg-gtm-ns-end-->`
  : '';

const reHead = /<!--deg-seo-start-->[\s\S]*?<!--deg-seo-end-->\n?/;
const reBodyNs = /<!--deg-gtm-ns-start-->[\s\S]*?<!--deg-gtm-ns-end-->/;

const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html') && f !== 'admin.html');
let n = 0;
for (const p of pages) {
  const fp = `${DIR}/${p}`;
  let h = fs.readFileSync(fp, 'utf8');
  const before = h;
  h = h.replace(reHead, '');           // eski bloğu temizle
  h = h.replace(reBodyNs, '');
  h = h.replace(/(<head[^>]*>)/i, `$1\n${head}`);   // <head>'den hemen sonra
  if (bodyNs) h = h.replace(/(<body[^>]*>)/i, `$1${bodyNs}`);
  if (h !== before) { fs.writeFileSync(fp, h); n++; }
}

const active = [gaId && 'GA4', adsId && 'Ads', gtm && 'GTM', pub && 'AdSense', tok(seo.gsc || cfg.gsc) && 'GSC', tok(seo.bing) && 'Bing', tok(seo.yandex) && 'Yandex', (seo.headCode || '').trim() && 'ÖzelKod'].filter(Boolean);
console.log(`apply-config: ${n}/${pages.length} sayfanın <head>'ine gömüldü.`);
console.log('Aktif etiketler:', active.length ? active.join(', ') : '(yalnızca robots)', '· robots:', seo.robotsIndex === false ? 'noindex' : 'index,follow');
