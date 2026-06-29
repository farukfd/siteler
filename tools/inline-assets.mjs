// degerleme/*.html sayfalarına CSS+JS'i gömer (taşınabilir/kendi-kendine yeterli render).
// IDEMPOTENT: tekrar çalıştırınca mevcut gömülü <style>/<script>'in İÇERİĞİNİ tazeler.
// assets/ dosyaları KAYNAK olarak kalır. `bun tools/inline-assets.mjs`
import fs from 'fs';
const DIR = 'degerleme';
const css = fs.readFileSync(`${DIR}/assets/css/degerleme.css`, 'utf8');
const js = fs.readFileSync(`${DIR}/assets/js/degerleme.js`, 'utf8');
const styleTag = '<style id="deg-inline-css">\n' + css + '\n</style>';
const jsTag = '<script id="deg-inline-js">\n' + js + '\n</script>';
const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let n = 0;
for (const p of pages) {
  let h = fs.readFileSync(`${DIR}/${p}`, 'utf8');
  // CSS — önce mevcut inline'ı tazele, yoksa <link>'i değiştir
  if (/<style id="deg-inline-css">[\s\S]*?<\/style>/.test(h)) {
    h = h.replace(/<style id="deg-inline-css">[\s\S]*?<\/style>/, styleTag);
  } else if (/<link[^>]*href="assets\/css\/degerleme\.css"[^>]*>/.test(h)) {
    h = h.replace(/<link[^>]*href="assets\/css\/degerleme\.css"[^>]*>/, styleTag);
  } else {
    h = h.replace('</head>', styleTag + '\n</head>'); // çapa yoksa head'e ekle
  }
  // JS — mevcut inline'ı tazele, yoksa <script src>'i değiştir
  if (/<script id="deg-inline-js">[\s\S]*?<\/script>/.test(h)) {
    h = h.replace(/<script id="deg-inline-js">[\s\S]*?<\/script>/, jsTag);
  } else if (/<script src="assets\/js\/degerleme\.js"><\/script>/.test(h)) {
    h = h.replace(/<script src="assets\/js\/degerleme\.js"><\/script>/, jsTag);
  }
  fs.writeFileSync(`${DIR}/${p}`, h); n++;
}
console.log('inline OK (idempotent): ' + n + ' sayfa (css ' + css.length + 'b, js ' + js.length + 'b)');
