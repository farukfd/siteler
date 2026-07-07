/* ===================================================================
   smoke-test.mjs — Headless otomatik smoke test  →  `bun smoke-test.mjs`
   Kritik akışların regresyonunu tarayıcı olmadan yakalar:
   1) tr-grammar.js saf gramer (şehir eki: sert/yumuşak ünsüz)
   2) JS sözdizimi (bun build: tr-grammar.js, wl.js, SPA ana script)
   3) Yapısal değişmezler (kritik fonksiyonlar + white-label kablolaması)
   4) Alt sayfa entegrasyonu (wl.js + tr-grammar.js + inline kalıntı yok)
   Başarısızlıkta exit(1) → CI'da kırmızı.
   Tarayıcı-DOM akışları (marka sweep=0, EİDS kapısı, il swap) için
   ayrıca smoke-test.js (runSmokeTests) sayfada çalıştırılır.
   =================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

let pass = 0, fail = 0; const fails = [];
function ok(name, cond){ if(cond) pass++; else { fail++; fails.push(name); } console.log((cond?'✅':'❌')+' '+name); }
function eq(name, got, want){ ok(name+' → "'+got+'"', got===want); }

/* ---- 1) tr-grammar.js saf gramer ---- */
globalThis.window = {};
eval(readFileSync('tr-grammar.js','utf8'));   // window.TRG kurar
const T = globalThis.window.TRG;
ok('TRG yüklendi', !!T && typeof T.city==='function');
eq("Antalya'da (yumuşak loc)", T.city("İzmir'de","Antalya"), "Antalya'da");
eq("Uşak'ta (sert ünsüz loc)",  T.city("İzmir'de","Uşak"),   "Uşak'ta");
eq("Sinop'ta (sert ünsüz loc)", T.city("İzmir'de","Sinop"),  "Sinop'ta");
eq("Antalya'nın (genitive)",    T.city("İzmir'in","Antalya"),"Antalya'nın");
eq("Antalyalı (li eki)",        T.city("İzmirli","Antalya"), "Antalyalı");
eq("Rize'ye (dat)",             T.city("İzmir'e","Rize"),    "Rize'ye");
eq("İZMİR → BURSA (büyük harf)",T.city("İZMİR","Bursa"),     "BURSA");
eq("İzmir ve Ege → çevresi",    T.city("İzmir ve Ege","Konya"),"Konya ve çevresi");
eq("Bare 'Ege' korunur",        T.city("Ege Denizi kıyısı","Antalya"),"Ege Denizi kıyısı");
eq("İzmir yoksa değişmez",      T.city("Egemenlik hakkı","Antalya"),"Egemenlik hakkı");
/* ---- 1b) İzmir ilçe → hedef il ilçe swap (içerik yerelleştirme) ---- */
eval(readFileSync('tr-iller.js','utf8'));   // window.TR_ILILCE kurar
ok("districts + hasIzmirPlace var", typeof T.districts==='function' && typeof T.hasIzmirPlace==='function');
ok("İzmir ilçesi algılanır", T.hasIzmirPlace('Konak, Karşıyaka ve Bornova'));
ok("Konya harici metin algılanmaz", !T.hasIzmirPlace('Ankara Çankaya bölgesi'));
ok("Konak → Rize ilçesine döner", T.districts('Konak bölgesi','Rize')!=='Konak bölgesi' && T.districts('Konak bölgesi','Rize').indexOf('Konak')<0);
ok("İzmir ilçeleri Rize'de kalmaz", ['Konak','Karşıyaka','Bornova','Buca','Çeşme'].every(function(p){return T.districts('Konak, Karşıyaka, Bornova, Buca, Çeşme','Rize').indexOf(p)<0;}));
ok("İzmir hedefte swap yok", T.districts('Konak, Karşıyaka','İzmir')==='Konak, Karşıyaka');
ok("localize = il + ilçe birlikte", (function(){var r=T.localize("İzmir'in Konak ilçesi",'Rize');return r.indexOf('Rize')>=0 && r.indexOf('Konak')<0 && r.indexOf('İzmir')<0;})());

/* ---- 2) JS sözdizimi (bun build) ---- */
function buildsOk(file, extractBiggestInline){
  try{
    let target = file;
    if(extractBiggestInline){
      const H = readFileSync(file,'utf8');
      const scripts = [...H.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
      const big = scripts.reduce((a,b)=> b.length>a.length ? b : a, '');
      target = '/tmp/_smoke_'+file.replace(/\W/g,'_')+'.js';
      writeFileSync(target, big);
    }
    execSync('bun build '+target, { stdio:'ignore' });
    return true;
  }catch(e){ return false; }
}
ok('tr-grammar.js derlenir', buildsOk('tr-grammar.js'));
ok('wl.js derlenir', buildsOk('wl.js'));
ok('gayrimenkul.html ana script derlenir', buildsOk('gayrimenkul/index.html', true));

/* ---- 3) Yapısal değişmezler (kritik özellikler yerinde mi) ---- */
const gm = readFileSync('gayrimenkul/index.html','utf8');
const invariants = [
  ["BRAND_ORIG sabiti", "BRAND_ORIG='Meridyen Gayrimenkul'"],
  ["Özel Portföy analyze fiyatı", "function proxAnalyzePrice"],
  ["Veri tazeliği (wlStale)", "function wlStale"],
  ["AI güvenlik korkuluğu", "function aiGuard"],
  ["Risk tarayıcı", "function aiRiskScan"],
  ["KVKK per-firma (legalDoc)", "function legalDoc"],
  ["Paket kilidi (admGateNav)", "function admGateNav"],
  ["Paket upsell", "function featUpsell"],
  ["CRM senkron rozeti", "function leadSyncBadge"],
  ["Analitik (trackEvent)", "function trackEvent"],
  ["A/B (abVariant)", "function abVariant"],
  ["Çok dilli (gmLang)", "async function gmLang"],
  ["Proxy güvenlik modu", "EMLAK_PROXY_MODE"],
  ["Süper-admin bayi paneli", "function openSuperAdmin"],
  ["tr-grammar.js yüklenir", 'src="../tr-grammar.js'],
  ["EİDS yayın kapısı", "function eidsVerify"],
  ["Portföy birleşik sayfa", 'id="portfoyPage"'],
  ["Portföy açma motoru", "function portfoyOpen"],
  ["Portföy İlan render", "function renderPfIlan"],
  ["Portföy overlay kapanış listesinde", "'portfoyPage'"],
  ["Portföy SEO hash yönlendirme", "function goPortfoy"],
  ["Temiz URL router (goView)", "function goView"],
  ["Overlay yükleyici (ovBoot)", "function ovBoot"],
  ["Portföy nav → portfoy.html gerçek sayfa", 'href="portfoy.html"'],
];
for(const [name, needle] of invariants) ok("değişmez: "+name, gm.includes(needle));

/* ---- 4) Alt sayfa entegrasyonu (portfoy.html gerçek SEO sayfası dahil) ---- */
for(const f of ['gayrimenkul/hizmetlerimiz.html','gayrimenkul/nedenbiz.html','gayrimenkul/portfoy.html']){
  const h = readFileSync(f,'utf8');
  ok(f+' → wl.js', h.includes('src="../wl.js'));
  ok(f+' → tr-grammar.js', h.includes('src="../tr-grammar.js'));
  ok(f+' → tr-iller.js', h.includes('src="../tr-iller.js'));
  ok(f+' inline WL kalıntısı yok', !/White-label senkron|Çalışma-zamanı canonical/.test(h));
}
/* ---- 4b) portfoy.html içerik + SEO ---- */
const pf = readFileSync('gayrimenkul/portfoy.html','utf8');
ok('portfoy.html SEO title', /<title>Portföy[^<]*Meridyen/.test(pf));
ok('portfoy.html breadcrumb "Portföy"', pf.includes('"position": 2, "name": "Portföy"'));
ok('portfoy.html İlanlar CTA → temiz yol (ilanlar)', pf.includes('href="ilanlar"'));
ok('portfoy.html Özel Portföy CTA → temiz yol (ozel)', pf.includes('href="ozel"'));
ok('portfoy.html canonical portfoy.html', pf.includes('gayrimenkul/portfoy.html'));

/* ---- Özet ---- */
console.log('\n'+pass+' geçti, '+fail+' başarısız'+(fail? '  → '+fails.join(' | ') : ' ✓'));
process.exit(fail ? 1 : 0);
