// degerleme/*.html sayfalarına CSS+JS'i gömer (taşınabilir/kendi-kendine yeterli render).
// ROBUST + IDEMPOTENT: tüm eski varyantları (id'li, bare-marker, <link>/<script src>) kaldırır,
// taze <style>/<script>'i head/body'e ekler. assets/ KAYNAK kalır. `bun tools/inline-assets.mjs`
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
  // --- CSS: tüm eski varyantları kaldır, head'e taze ekle ---
  h = h.replace(/<style id="deg-inline-css">[\s\S]*?<\/style>/g, '');
  h = h.replace(/<link[^>]*href="assets\/css\/degerleme\.css"[^>]*>\s*/g, '');
  h = h.replace('</head>', styleTag + '\n</head>');
  // --- JS: tüm eski varyantları kaldır (id'li / Meridyen-marker bare / src), body'e taze ekle ---
  h = h.replace(/<script id="deg-inline-js">[\s\S]*?<\/script>/g, '');
  h = h.replace(/<script>\s*\/\* Meridyen Değerleme — kurumsal site JS[\s\S]*?<\/script>/g, '');
  h = h.replace(/<script src="assets\/js\/degerleme\.js"><\/script>\s*/g, '');
  h = h.replace('</body>', jsTag + '\n</body>');
  fs.writeFileSync(`${DIR}/${p}`, h); n++;
}
console.log('inline OK (robust): ' + n + ' sayfa (css ' + css.length + 'b, js ' + js.length + 'b)');
