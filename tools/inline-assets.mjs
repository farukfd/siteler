// degerleme/*.html sayfalarına CSS+JS'i gömer (taşınabilir/kendi-kendine yeterli render).
// assets/ dosyaları KAYNAK olarak kalır. `bun tools/inline-assets.mjs`
import fs from 'fs';
const DIR = 'degerleme';
const css = fs.readFileSync(`${DIR}/assets/css/degerleme.css`, 'utf8');
const js = fs.readFileSync(`${DIR}/assets/js/degerleme.js`, 'utf8');
const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let n = 0;
for (const p of pages) {
  let h = fs.readFileSync(`${DIR}/${p}`, 'utf8');
  // CSS: <link ... degerleme.css> → inline <style> (idempotent: önce eski inline'ı temizle)
  h = h.replace(/<style id="deg-inline-css">[\s\S]*?<\/style>/g, '');
  h = h.replace(/<link[^>]*href="assets\/css\/degerleme\.css"[^>]*>/g,
    '<style id="deg-inline-css">\n' + css + '\n</style>');
  // JS: <script src=...degerleme.js> → inline
  h = h.replace(/<script src="assets\/js\/degerleme\.js"><\/script>/g,
    '<script>\n' + js + '\n</script>');
  fs.writeFileSync(`${DIR}/${p}`, h); n++;
}
console.log('inline OK: ' + n + ' sayfa (css ' + css.length + 'b, js ' + js.length + 'b)');
