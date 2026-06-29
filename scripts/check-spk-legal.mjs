// SPK yasal dil kapısı — `bun scripts/check-spk-legal.mjs`
// Mutlak yasak terimler (hiç geçmemeli) + olumsuzlama-duyarlı vaat ifadeleri.
import fs from 'fs';

const FILE = process.argv[2] || 'degerleme.html';
let html = fs.readFileSync(FILE, 'utf8');
// görünür metne yaklaş: tag'leri boşlukla değiştir
const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const low = text.toLocaleLowerCase('tr');

// 1) Mutlak yasak (satış/kira dili) — hiç geçmemeli
const ABSOLUTE = ['satılık', 'kiralık', 'komisyon', 'satış ofisi', 'portföy pazarlama', 'mülk pusula'];
// 2) Olumsuzlama-duyarlı vaat ifadeleri — affirmatif geçerse FAIL
const PHRASES = [
  'sistem resmi rapor üret', 'sistem resmî rapor üret', 'otomatik spk rapor',
  'yapay zeka rapor hazırla', 'yapay zekâ rapor hazırla',
  'kesin değer garanti', 'banka onay garanti', 'mahkeme sonucu garanti',
  'değer artışı garanti', 'yatırım tavsiye'
];
const NEG = ['üretmez', 'üretmiyor', 'hazırlamaz', 'değildir', 'verilmez', 'vermez', 'yoktur',
  'sağlamaz', 'yerine geçmez', 'değil', 'hayır', 'asla', 'edilmez', 'sunmaz'];

const violations = [];

for (const t of ABSOLUTE) {
  const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const n = (low.match(re) || []).length;
  if (n > 0) violations.push({ type: 'ABSOLUTE', term: t, count: n });
}

for (const p of PHRASES) {
  let idx = 0;
  while ((idx = low.indexOf(p, idx)) !== -1) {
    const win = low.slice(idx, idx + p.length + 60); // ifadeden sonraki 60 karakter
    const pre = low.slice(Math.max(0, idx - 30), idx);
    const negated = NEG.some(ng => win.includes(ng) || pre.includes(ng));
    if (!negated) {
      violations.push({ type: 'AFFIRMATIVE', term: p, ctx: text.slice(Math.max(0, idx - 20), idx + p.length + 40).trim() });
    }
    idx += p.length;
  }
}

const pass = violations.length === 0;
console.log(JSON.stringify({ file: FILE, pass, violations }, null, 2));
console.log(pass ? '\nSPK LEGAL: PASS' : `\nSPK LEGAL: FAIL (${violations.length} ihlal)`);
process.exit(pass ? 0 : 1);
