// ALTIN KURAL: her degerleme/*.html sayfasının ÜST MENÜ (header) ve ALT MENÜ (footer)
// bloğu, ana sayfa (index.html) ile BİRE BİR aynı olur. index.html kaynaktır.
// `bun tools/sync-chrome.mjs`
import fs from 'fs';
const DIR = 'degerleme';
const src = fs.readFileSync(`${DIR}/index.html`, 'utf8');

const headerRe = /<header class="hdr">[\s\S]*?<\/header>/;
const footerRe = /<footer class="ft">[\s\S]*?<\/footer>/;
const header = (src.match(headerRe) || [])[0];
const footer = (src.match(footerRe) || [])[0];
if (!header || !footer) { console.error('HATA: index.html içinde header/footer bulunamadı.'); process.exit(1); }

const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
let n = 0, warn = [];
for (const p of pages) {
  let h = fs.readFileSync(`${DIR}/${p}`, 'utf8');
  const before = h;
  if (headerRe.test(h)) h = h.replace(headerRe, header); else warn.push(`${p}: header yok`);
  if (footerRe.test(h)) h = h.replace(footerRe, footer); else warn.push(`${p}: footer yok`);
  if (h !== before) { fs.writeFileSync(`${DIR}/${p}`, h); n++; }
}
console.log(`sync-chrome: header+footer ${n}/${pages.length} sayfaya birebir uygulandı (kaynak: index.html)`);
if (warn.length) console.log('UYARI:\n - ' + warn.join('\n - '));
