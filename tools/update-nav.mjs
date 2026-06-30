// Üst menüyü (nav + hdr-cta) tüm degerleme/*.html sayfalarında yeni IA ile değiştirir.
// Eski sayfa linkleri footer'da kalır (alt menü). `bun tools/update-nav.mjs`
import fs from 'fs';
const DIR = 'degerleme';
const WA = 'https://wa.me/905000000000';
const navHTML = '<nav class="nav" id="nav">'
  + '<a href="hizmetler.html">Hizmetlerimiz</a>'
  + '<a href="neden-biz.html">Neden Biz</a>'
  + '<a href="referans.html">Referans</a>'
  + '<a href="blog.html">Blog</a>'
  + '<a href="basvuru.html">Talep</a>'
  + '</nav>';
const ctaHTML = '<div class="hdr-cta">'
  + '<a class="nav-wa" href="' + WA + '" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.5 14.13c-.23.65-1.36 1.25-1.87 1.3-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.91-4.64-4.09-.14-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.47.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.62 1.23-1.28 1.18-.93 1.78.66 1.13 1.32 1.52 2.33 2.03.27.14.43.12.59-.07.18-.21.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.3Z"/></svg></a>'
  + '<div class="lang-sw"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg><select class="lang-sel" aria-label="Dil / Language"><option value="tr">TR</option><option value="en">EN</option><option value="ru">RU</option><option value="zh">中文</option><option value="ar">عربي</option></select></div>'
  + '<a class="btn btn-line btn-sm js-giris" href="#giris">Giriş</a>'
  + '<button class="burger" id="burger" aria-label="Menü"><span></span><span></span><span></span></button>'
  + '</div>';

const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let n = 0;
for (const p of pages) {
  let h = fs.readFileSync(`${DIR}/${p}`, 'utf8');
  const before = h;
  h = h.replace(/<nav class="nav" id="nav">[\s\S]*?<\/nav>/, navHTML);
  h = h.replace(/<div class="hdr-cta">[\s\S]*?<\/div>/, ctaHTML);
  if (h !== before) { fs.writeFileSync(`${DIR}/${p}`, h); n++; }
}
console.log('nav güncellendi: ' + n + '/' + pages.length + ' sayfa');
