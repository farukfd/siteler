// 8 ajan JSON'unu (faq-1..8.json) birleştirir, tekiller, kategori-gruplu SSS sayfası üretir:
// FAQPage JSON-LD + akordeon (details/summary) + sayfa-içi arama + kategori navigasyonu.
// Header/footer ana sayfadan (altın kural). `bun tools/build-faq.mjs <faqDir>`
import fs from 'fs';
const DIR = 'degerleme';
const FAQ_DIR = process.argv[2] || 'degerleme/assets/data/faq';
const ORDER = [
  ['Genel & SPK Lisansı', 'genel'],
  ['Süreç, Belgeler & Rapor', 'surec'],
  ['Konut, Ticari & Arsa', 'konut'],
  ['Banka Teminat & Kredi', 'banka'],
  ['Sanayi, Makine & Enerji', 'sanayi'],
  ['Hukuki Süreçler & Haklar', 'hukuki'],
  ['Kurumsal & Finansal', 'kurumsal'],
  ['Metodoloji & Özel Varlıklar', 'metodoloji']
];
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jstr = s => JSON.stringify(String(s == null ? '' : s).replace(/\s+/g, ' ').trim());

// --- topla ---
let all = [];
for (let i = 1; i <= 8; i++) {
  const p = `${FAQ_DIR}/faq-${i}.json`;
  if (!fs.existsSync(p)) { console.error('UYARI: yok ' + p); continue; }
  let txt = fs.readFileSync(p, 'utf8').trim();
  const a = txt.indexOf('['), b = txt.lastIndexOf(']');
  if (a !== -1 && b !== -1) txt = txt.slice(a, b + 1);
  let arr; try { arr = JSON.parse(txt); } catch (e) { console.error('PARSE HATASI ' + p + ': ' + e.message); continue; }
  arr.forEach(x => { if (x && x.q && x.a) all.push({ q: String(x.q).trim(), a: String(x.a).trim(), cat: String(x.cat || '').trim() }); });
}
// --- tekille (soru normalize) ---
const seen = new Set(); const uniq = [];
for (const x of all) { const k = x.q.toLowerCase().replace(/[^a-zçğıöşü0-9 ]/gi, '').replace(/\s+/g, ' ').trim(); if (seen.has(k)) continue; seen.add(k); uniq.push(x); }
// --- grupla ---
const byCat = {}; ORDER.forEach(([c]) => byCat[c] = []);
let misc = [];
for (const x of uniq) { if (byCat[x.cat]) byCat[x.cat].push(x); else misc.push(x); }
if (misc.length) { const last = ORDER[ORDER.length - 1][0]; byCat[last].push(...misc); }
const total = uniq.length;

// --- JSON-LD FAQPage ---
const ld = '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[' +
  uniq.map(x => '{"@type":"Question","name":' + jstr(x.q) + ',"acceptedAnswer":{"@type":"Answer","text":' + jstr(x.a) + '}}').join(',') + ']}';

// --- catnav + sections ---
const catnav = ORDER.filter(([c]) => byCat[c].length).map(([c, s]) => `<a href="#cat-${s}">${esc(c)}</a>`).join('');
let n = 0;
const sections = ORDER.filter(([c]) => byCat[c].length).map(([c, s]) => {
  const items = byCat[c].map(x => {
    n++;
    return `        <details class="faq-q"><summary><span class="qn">${n}</span><span class="qt">${esc(x.q)}</span><svg class="cv" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></summary><div class="faq-a">${esc(x.a)}</div></details>`;
  }).join('\n');
  return `      <div class="faq-cat" id="cat-${s}">
        <div class="ch"><h2>${esc(c)}</h2><span class="b">${byCat[c].length} soru</span></div>
${items}
      </div>`;
}).join('\n');

// --- header/footer (altın kural) ---
const idx = fs.readFileSync(`${DIR}/index.html`, 'utf8');
const header = (idx.match(/<header class="hdr">[\s\S]*?<\/header>/) || [''])[0];
const footer = (idx.match(/<footer class="ft">[\s\S]*?<\/footer>/) || [''])[0];

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sıkça Sorulan Sorular · SPK Lisanslı Değerleme & Ekspertiz | Meridyen Değerleme</title>
<meta name="description" content="Gayrimenkul değerleme ve SPK lisanslı ekspertiz hakkında ${total}+ soru ve yanıt: süreç, belgeler, banka teminat, konut/ticari/arsa, kamulaştırma, miras, GYO, UFRS, metodoloji ve daha fazlası. SPK, SPL, BDDK, TDUB ve UDES/IVS çerçevesinde kapsamlı SSS rehberi.">
<link rel="canonical" href="https://www.emlakekspertizi.com/degerleme/sss.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Sıkça Sorulan Sorular · SPK Lisanslı Değerleme">
<meta property="og:description" content="Gayrimenkul değerleme ve ekspertiz hakkında ${total}+ kapsamlı soru ve yanıt.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<script type="application/ld+json">
${ld}
</script>

<link rel="stylesheet" href="assets/css/degerleme.css">
</head>
<body>

${header}

<section class="hero" style="--x:0">
  <div class="wrap in" style="padding:46px 0 46px">
    <div class="hero-main">
      <span class="eyebrow">Sıkça Sorulan Sorular</span>
      <h1>Değerleme ve ekspertiz hakkında <em>${total}+ soru, ${total}+ yanıt</em></h1>
      <p class="lead">SPK lisanslı gayrimenkul değerleme ve ekspertiz süreçlerine dair merak ettiğiniz her şey: başvurudan rapora, banka teminatından kamulaştırmaya, metodolojiden kurumsal değerlemeye kadar kapsamlı yanıtlar.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="basvuru.html">Değerleme Talebi Oluştur</a>
        <a class="btn btn-ghost-light" href="hizmetler.html">Hizmetlerimiz</a>
      </div>
      <div class="hero-badges">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> ${total}+ soru-cevap</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> 8 kategori</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg> SPK · UDES/IVS</span>
      </div>
    </div>
    <aside class="hero-panel" style="animation:hzFloat 6s ease-in-out infinite">
      <div class="cap">Bilgi Merkezi</div>
      <svg class="pv" viewBox="0 0 380 300" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Soru-cevap bilgi merkezi">
        <circle cx="190" cy="150" r="116" fill="none" stroke="rgba(188,208,255,.13)" stroke-width="1" stroke-dasharray="2 11"><animateTransform attributeName="transform" type="rotate" from="0 190 150" to="360 190 150" dur="48s" repeatCount="indefinite"/></circle>
        <circle cx="190" cy="150" r="44" fill="#0b1220" stroke="#b4975a" stroke-width="2"/>
        <text x="190" y="158" text-anchor="middle" fill="#bcd0ff" font-family="Poppins,sans-serif" font-weight="800" font-size="30">?</text>
        <g stroke="#bcd0ff" stroke-width="2">
          <g class="anim-pulse"><rect x="60" y="58" width="80" height="22" rx="6" fill="rgba(47,91,208,.18)"/><path d="M70 69h60"/></g>
          <g class="anim-pulse b"><rect x="244" y="92" width="84" height="22" rx="6" fill="rgba(47,91,208,.18)"/><path d="M254 103h64"/></g>
          <g class="anim-pulse c"><rect x="52" y="196" width="84" height="22" rx="6" fill="rgba(47,91,208,.18)"/><path d="M62 207h64"/></g>
          <g class="anim-pulse"><rect x="240" y="216" width="80" height="22" rx="6" fill="rgba(47,91,208,.18)"/><path d="M250 227h60"/></g>
        </g>
        <g stroke="#9fe6c0" stroke-width="1.4" opacity=".55" class="rf-link"><path d="M140 70 156 134M244 103 226 138M136 207 154 166M240 227 226 168"/></g>
      </svg>
      <div class="flow"><b>Soru</b><span class="ar">→</span><b>SPK Uzman Bilgisi</b><span class="ar">→</span><b>Net Yanıt</b></div>
      <div class="chips"><span>Güncel</span><span>Mevzuata uygun</span></div>
    </aside>
  </div>
</section>

<!-- arama -->
<div class="faq-search">
  <div class="wrap">
    <div class="box">
      <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></span>
      <input id="faqSearch" type="search" placeholder="Soru arayın… (örn. banka ekspertiz, kamulaştırma, kat irtifakı)">
    </div>
    <div class="cnt" id="faqCnt">${total} soru-cevap · 8 kategori</div>
    <nav class="faq-catnav">${catnav}</nav>
  </div>
</div>

<section class="sec" id="sss">
  <div class="wrap">
${sections}
    <div class="faq-empty" id="faqEmpty">Aramanızla eşleşen soru bulunamadı. Farklı bir kelime deneyin ya da <a href="basvuru.html" style="color:var(--accent);font-weight:600">talep oluşturun</a>.</div>
  </div>
</section>

<section class="ctaband" id="talep">
  <div class="wrap in">
    <div><h2>Sorunuzun yanıtını bulamadınız mı?</h2><p>SPK lisanslı uzmanımıza danışın ya da değerleme talebinizi birkaç adımda oluşturun.</p></div>
    <a class="btn btn-ghost-light" href="iletisim.html">Bize Ulaşın</a>
  </div>
</section>

${footer}

<script id="faq-js">
(function () {
  var inp = document.getElementById('faqSearch'); if (!inp) return;
  var qs = [].slice.call(document.querySelectorAll('.faq-q'));
  var cats = [].slice.call(document.querySelectorAll('.faq-cat'));
  var cnt = document.getElementById('faqCnt'), empty = document.getElementById('faqEmpty');
  var total = qs.length;
  function norm(s){return (s||'').toLowerCase().replace(/[İI]/g,'i').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c');}
  var t;
  inp.addEventListener('input', function () {
    clearTimeout(t); t = setTimeout(run, 120);
  });
  function run() {
    var q = norm(inp.value.trim()); var shown = 0;
    qs.forEach(function (d) {
      var txt = norm(d.textContent);
      var ok = !q || txt.indexOf(q) !== -1;
      d.style.display = ok ? '' : 'none';
      if (ok) shown++;
      if (q && ok) d.open = true; else if (!q) d.open = false;
    });
    cats.forEach(function (c) { var any = c.querySelector('.faq-q:not([style*="display: none"])'); c.style.display = any ? '' : 'none'; });
    cnt.textContent = q ? (shown + ' sonuç') : (total + ' soru-cevap · 8 kategori');
    empty.classList.toggle('on', shown === 0);
  }
})();
</script>
<script src="assets/js/degerleme.js"></script>
</body>
</html>
`;
fs.writeFileSync(`${DIR}/sss.html`, html);
console.log('sss.html üretildi · toplam ' + total + ' soru-cevap · ' + ORDER.filter(([c]) => byCat[c].length).length + ' kategori');
ORDER.forEach(([c]) => { if (byCat[c].length) console.log('  ' + c + ': ' + byCat[c].length); });
