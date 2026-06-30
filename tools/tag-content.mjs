// Public degerleme/*.html sayfalarındaki ana metinleri (hero eyebrow/başlık/açıklama,
// bölüm başlık/açıklama, CTA) data-ce="<slug>.<key>" ile işaretler ve admin için manifest üretir:
// degerleme/assets/data/content-map.json. İdempotent. `bun tools/tag-content.mjs`
import fs from 'fs';
const DIR = 'degerleme';
const SKIP = new Set(['admin.html']);
const strip = h => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const manifest = {};
const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html') && !SKIP.has(f));
let totalTags = 0;

for (const p of pages) {
  const slug = p.replace('.html', '');
  let h = fs.readFileSync(`${DIR}/${p}`, 'utf8');
  const fields = [];
  let n = { sec: 0 };

  function tagFirst(re, key, label) {
    const m = h.match(re);
    if (!m) return;
    if (/data-ce=/.test(m[0])) { // zaten işaretli → manifest'e ekle
      const km = m[0].match(/data-ce="([^"]+)"/); if (km) fields.push({ key: km[1], label, def: strip(m[1]) }); return;
    }
    const full = slug + '.' + key;
    const tagged = m[0].replace(/^(<[a-z0-9]+)(\s|>)/i, '$1 data-ce="' + full + '"$2');
    h = h.replace(m[0], tagged);
    fields.push({ key: full, label, def: strip(m[1]) }); totalTags++;
  }

  // HERO (ilk eyebrow / h1 / lead)
  tagFirst(/<span class="eyebrow">([\s\S]*?)<\/span>/, 'heroEyebrow', 'Hero · üst etiket');
  tagFirst(/<h1>([\s\S]*?)<\/h1>/, 'heroTitle', 'Hero · başlık');
  tagFirst(/<p class="lead">([\s\S]*?)<\/p>/, 'heroLead', 'Hero · açıklama');

  // BÖLÜM BAŞLIKLARI (.sec-h içindeki h2 ve p)
  h = h.replace(/<div class="sec-h[^"]*">([\s\S]*?)<\/div>/g, function (block) {
    n.sec++;
    const idx = n.sec;
    let b = block;
    b = b.replace(/<h2>([\s\S]*?)<\/h2>/, function (mm, inner) {
      if (/data-ce=/.test(mm)) { const km = mm.match(/data-ce="([^"]+)"/); if (km) fields.push({ key: km[1], label: 'Bölüm ' + idx + ' · başlık', def: strip(inner) }); return mm; }
      const full = slug + '.sec' + idx + 'Title'; fields.push({ key: full, label: 'Bölüm ' + idx + ' · başlık', def: strip(inner) }); totalTags++;
      return '<h2 data-ce="' + full + '">' + inner + '</h2>';
    });
    b = b.replace(/<p>([\s\S]*?)<\/p>/, function (mm, inner) {
      if (/data-ce=/.test(mm)) { const km = mm.match(/data-ce="([^"]+)"/); if (km) fields.push({ key: km[1], label: 'Bölüm ' + idx + ' · açıklama', def: strip(inner) }); return mm; }
      const full = slug + '.sec' + idx + 'Lead'; fields.push({ key: full, label: 'Bölüm ' + idx + ' · açıklama', def: strip(inner) }); totalTags++;
      return '<p data-ce="' + full + '">' + inner + '</p>';
    });
    return b;
  });

  // CTA BANDI (ilk ctaband h2 ve p)
  h = h.replace(/<section class="ctaband"[^>]*>([\s\S]*?)<\/section>/, function (sec) {
    let s = sec;
    s = s.replace(/<h2>([\s\S]*?)<\/h2>/, function (mm, inner) {
      if (/data-ce=/.test(mm)) return mm;
      const full = slug + '.ctaTitle'; fields.push({ key: full, label: 'CTA · başlık', def: strip(inner) }); totalTags++;
      return '<h2 data-ce="' + full + '">' + inner + '</h2>';
    });
    s = s.replace(/<p>([\s\S]*?)<\/p>/, function (mm, inner) {
      if (/data-ce=/.test(mm)) return mm;
      const full = slug + '.ctaText'; fields.push({ key: full, label: 'CTA · açıklama', def: strip(inner) }); totalTags++;
      return '<p data-ce="' + full + '">' + inner + '</p>';
    });
    return s;
  });

  fs.writeFileSync(`${DIR}/${p}`, h);
  if (fields.length) manifest[slug] = fields;
}

fs.mkdirSync(`${DIR}/assets/data`, { recursive: true });
fs.writeFileSync(`${DIR}/assets/data/content-map.json`, JSON.stringify(manifest));
const totalFields = Object.values(manifest).reduce((a, f) => a + f.length, 0);
console.log('tag-content: ' + pages.length + ' sayfa · ' + totalTags + ' yeni data-ce · manifest ' + Object.keys(manifest).length + ' sayfa / ' + totalFields + ' alan');
