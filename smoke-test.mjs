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
ok('gayrimenkul app.js derlenir (P1 harici JS)', buildsOk('gayrimenkul/js/app.js'));

/* ---- 3) Yapısal değişmezler (kritik özellikler yerinde mi) ----
   P1 ayrıştırması sonrası: HTML=index.html, JS=js/app.js, CSS=css/app.css.
   Değişmezleri üçünün birleşiminde ararız (fonksiyon/const app.js'de, CSS app.css'te). */
const gm = readFileSync('gayrimenkul/index.html','utf8');
const gmjs = readFileSync('gayrimenkul/js/app.js','utf8');
const gmcss = readFileSync('gayrimenkul/css/app.css','utf8');
const gmAll = gm + '\n' + gmjs + '\n' + gmcss;
/* ---- 3.0) P1 varlık-ayrıştırma değişmezleri ---- */
ok('P1: index.html → css/app.css link', gm.includes('href="css/app.css"'));
ok('P1: index.html → js/app.js script', gm.includes('src="js/app.js"'));
ok('P1: index.html ince kabuk (<2600 satır)', gm.split('\n').length < 2600);
ok('P1: app.js ana motor (goView+brandLogos)', gmjs.includes('function goView') && gmjs.includes('function brandLogos'));
ok('P1: app.css token katmanı (:root/--accent)', gmcss.includes(':root') && gmcss.includes('--accent'));
ok('P1: ana motor index.html\'den çıktı (app.js\'e taşındı)', !gm.includes('function goView') && !gm.includes('function brandLogos') && !gm.includes('function portfoyOpen'));
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
  ["Tek kaynak logo motoru (brandLogos)", "function brandLogos"],
  ["Logo bilgisayardan yükleme (saasLogoFile)", "function saasLogoFile"],
  ["Logo kaldırma (saasLogoRemove)", "function saasLogoRemove"],
  ["Yüklenen logo standart boyut CSS", ".logo .logo-img{"],
  ["has-logo-img gizleme kuralı", ".logo.has-logo-img .mark"],
  ["brandSweep tekil querySelector kaldırıldı", "try{brandLogos();}catch(e){}"],
];
for(const [name, needle] of invariants) ok("değişmez: "+name, gmAll.includes(needle));
/* Tekil logo bug'ının GERİ GELMEDİĞİ (regresyon kilidi) */
ok("değişmez: brandSweep artık .logo .mark tekil güncellemiyor", !gmAll.includes("var mk=document.querySelector('.logo .mark')"));
/* ---- 3b) wl.js logo tek-kaynak (footer dahil) ---- */
const wl = readFileSync('wl.js','utf8');
ok('wl.js logo: querySelectorAll(.logo)', wl.includes("querySelectorAll('.logo')"));
ok('wl.js: yüklenen logo görseli desteği', wl.includes('logo-img') && wl.includes('d.FIRMA&&d.FIRMA.logo'));
ok('wl.js: tekil .logo .mark querySelector kaldırıldı', !wl.includes("var mk=document.querySelector('.logo .mark')"));

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
