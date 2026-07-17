/* ============================================================================
   gen-share-pages.mjs — her ilan için OG (Open Graph) paylaşım sayfası üretir.
   ----------------------------------------------------------------------------
   NEDEN: Facebook / WhatsApp / X / LinkedIn bir bağlantı paylaşıldığında sayfanın
   <head>'indeki OG etiketlerini OKUR ve otomatik kart (kapak görseli + başlık +
   açıklama/fiyat) gösterir — HEM WEB HEM MOBİL, indirme/kopyalama YOK. Ama bu
   etiketler statik HTML'de olmalı (crawler JS çalıştırmaz) ve site CANLI olmalı
   (localhost okunamaz).

   Bu script danisman/p/<id>.html üretir: <head> statik OG/Twitter/JSON-LD, gövde
   insanı gerçek ilana yönlendirir (../ilanlar.html?ilan=<id>).

   KULLANIM:
     bun tools/gen-share-pages.mjs https://www.alanadiniz.com
   (origin verilmezse aşağıdaki ORIGIN placeholder kullanılır — DEĞİŞTİRİN)
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, '..');                 // danisman/
// >>> Yayın alan adınızı buraya yazın veya CLI argümanı olarak verin <<<
const ORIGIN = (process.argv[2] || 'https://www.selinmeridyen.com').replace(/\/+$/, '');
const BASE = ORIGIN + '/danisman';

// --- ilan verisini js/ilan-data.js'ten sandbox ile oku (tek kaynak) ---
const src = fs.readFileSync(path.join(ROOT, 'js/ilan-data.js'), 'utf8');
const win = {};
new Function('window', 'localStorage', src)(win, { getItem() { return null; } });
const SEED = (win.DN_ILAN && win.DN_ILAN.SEED) || [];
const imgURL = win.DN_ILAN.imgURL;

const esc = (s) => (''+(s==null?'':s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tl = (n) => Number(n||0).toLocaleString('tr-TR') + ' ₺';

function pageHTML(l) {
  const durum = l.durum || 'İlan';
  const title = `${durum} · ${l.baslik}`;
  const loc = [l.mahalle, l.ilce, l.il].filter(Boolean).join(', ');
  const priceTxt = tl(l.fiyat) + (l.kira ? ' /ay' : '');
  const specBits = [l.oda, (l.m2 ? l.m2 + ' m²' : ''), (l.kat ? 'Kat ' + l.kat : '')].filter(Boolean).join(' · ');
  const desc = `${specBits ? specBits + ' · ' : ''}${priceTxt} · ${loc} — Selin Meridyen (EİDS onaylı)`;
  const imgAbs = `${BASE}/${imgURL(l.img)}`;
  const shareUrl = `${BASE}/p/${l.id}.html`;
  const listingUrl = `${BASE}/ilanlar.html?ilan=${l.id}`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: l.baslik, image: [imgAbs], description: (l.desc || desc),
    category: l.tip || 'Gayrimenkul',
    brand: { '@type': 'Brand', name: 'Selin Meridyen' },
    offers: {
      '@type': 'Offer', price: l.fiyat, priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock', url: listingUrl,
      businessFunction: l.kira ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell'
    }
  };
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — Selin Meridyen</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(listingUrl)}">
<!-- Open Graph (Facebook · WhatsApp · LinkedIn · Telegram) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Selin Meridyen">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(imgAbs)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="900">
<meta property="og:image:alt" content="${esc(l.baslik)}">
<meta property="og:url" content="${esc(shareUrl)}">
<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(imgAbs)}">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<!-- İnsan ziyaretçiyi gerçek ilana yönlendir (crawler yönlenmez, OG'yi okur) -->
<meta http-equiv="refresh" content="0; url=../ilanlar.html?ilan=${l.id}">
<style>
  html,body{margin:0;height:100%;background:#08301f;color:#f4efe4;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  .w{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;gap:14px}
  .m{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#c39b45,#795901);display:grid;place-items:center;font:700 26px "Playfair Display",Georgia,serif;color:#08301f}
  h1{font:600 20px "Playfair Display",Georgia,serif;margin:6px 0 0}
  p{margin:0;color:#cdd8d0;font-size:13px}
  a{color:#e7d19a;font-weight:600}
</style>
</head>
<body>
  <div class="w">
    <div class="m">M</div>
    <h1>${esc(l.baslik)}</h1>
    <p>İlana yönlendiriliyorsunuz… <a href="../ilanlar.html?ilan=${l.id}">Devam etmezse tıklayın</a></p>
  </div>
  <script>location.replace('../ilanlar.html?ilan=${l.id}');</script>
</body>
</html>`;
}

const outDir = path.join(ROOT, 'p');
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
for (const l of SEED) {
  fs.writeFileSync(path.join(outDir, `${l.id}.html`), pageHTML(l), 'utf8');
  n++;
}
console.log(`✓ ${n} paylaşım sayfası üretildi → danisman/p/*.html`);
console.log(`  origin: ${ORIGIN}  (değiştirmek için: bun tools/gen-share-pages.mjs https://alanadiniz.com)`);
