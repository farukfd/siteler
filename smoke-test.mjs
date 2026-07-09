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
const gmtheme = readFileSync('themes/gayrimenkul/meridyen.css','utf8');
const gmbase = readFileSync('gayrimenkul/css/base.css','utf8');
const gmcss = gmbase + '\n' + gmtheme;
const gmAll = gm + '\n' + gmjs + '\n' + gmcss;
/* ---- 3.0) P1/P2/P3 varlık-ayrıştırma değişmezleri ---- */
ok('P3: index.html → themes kütüphanesi + base.css link', gm.includes('href="../themes/gayrimenkul/meridyen.css"') && /href="css\/base\.css(\?v=\d+)?"/.test(gm));
ok('P3: tema kütüphanesi ≥4 tema (:root token)', ['meridyen','sahil','altin-lux','gece-mor'].every(t=>{try{return readFileSync('themes/gayrimenkul/'+t+'.css','utf8').includes(':root')}catch(e){return false}}));
ok('P1: index.html → js/app.js script', /src="js\/app\.js(\?v=\d+)?"/.test(gm));
ok('P1: index.html ince kabuk (<2600 satır)', gm.split('\n').length < 2600);
ok('P1: app.js ana motor (goView+brandLogos)', gmjs.includes('function goView') && gmjs.includes('function brandLogos'));
ok('P2: theme.css token katmanı ayrık (:root/--accent, base.css\'te :root yok)', gmtheme.includes(':root') && gmtheme.includes('--accent') && !gmbase.includes(':root{'));
ok('P1: ana motor index.html\'den çıktı (app.js\'e taşındı)', !gm.includes('function goView') && !gm.includes('function brandLogos') && !gm.includes('function portfoyOpen'));
/* ---- 3.0b) P4 nav düzeltme değişmezleri ---- */
ok('P4-G1: goView window.event fallback', gmjs.includes('ev=ev||window.event'));
ok('P4-G3: ovBoot flash guard (ov-boot)', gmjs.includes("classList.add('ov-boot')"));
ok('P4-G3: base.css ov-boot fade kapatma', gmbase.includes('html.ov-boot'));
ok('P4-G2: header logo onclick closeAllOverlays', gm.includes('class="logo" href="#" onclick="closeAllOverlays();return false"'));
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
/* ---- 3a2) insaat TEMİZ URL router (# YOK) ---- */
const insCore = readFileSync('insaat/js/app-core.js','utf8');
const insHtml = readFileSync('insaat/index.html','utf8');
const insNb = readFileSync('insaat/neden-biz.html','utf8');
ok('insaat: temiz URL router (goPage/insBoot)', insCore.includes('function goPage') && insCore.includes('function insBoot'));
ok('insaat: _INS_OV route tablosu', insCore.includes('_INS_OV') && insCore.includes("'soru-cevap'"));
ok('insaat: nav temiz href (# overlay hash yok)', !/href="#(hizmetler|projeler|bolge|iletisim|sss)"/.test(insHtml) && !/href="#(hizmetler|projeler|bolge|iletisim|sss)"/.test(insNb));
ok('insaat: neden-biz kırık insaat.html linki yok', !/(href=|location\.href=)['"]insaat\.html/.test(insNb));
ok('insaat: yükleyici stub dizinleri (yönlendirme)', ['hizmetler','projeler','bolge','iletisim','soru-cevap'].every(s=>{try{var h=readFileSync('insaat/'+s+'/index.html','utf8');return h.includes('location.replace')&&(h.includes('_ins_ov')||h.includes('.html'))}catch(e){return false}}));
/* ---- 3a3) insaat GERÇEK SEO sayfaları (indekslenebilir) ---- */
for(const pg of ['hizmetlerimiz','projelerimiz','soru-cevap','bolge']){
  let h=''; try{h=readFileSync('insaat/'+pg+'.html','utf8');}catch(e){}
  ok('insaat SEO '+pg+': indekslenebilir + mutlak canonical', !!h && !/noindex/.test(h) && new RegExp('rel="canonical" href="https://[^"]*/'+pg+'\\.html"').test(h) && /og:image" content="https:/.test(h));
  ok('insaat SEO '+pg+': JSON-LD + chrome birebir', h.includes('application/ld+json') && h.includes('id="hdr"') && h.includes('insaatFooter'));
}
ok('insaat SEO: soru-cevap FAQPage rich-result', /"@type"\s*:\s*"FAQPage"/.test(readFileSync('insaat/soru-cevap.html','utf8')));
ok('insaat SEO: sitemap.xml + robots.txt', (()=>{try{return readFileSync('insaat/sitemap.xml','utf8').includes('hizmetlerimiz.html') && readFileSync('insaat/robots.txt','utf8').includes('Sitemap:');}catch(e){return false}})());
ok('insaat SEO: nav+footer → gerçek sayfalar (interlink)', insCore.includes('href="hizmetlerimiz.html"') && insCore.includes('href="projelerimiz.html"') && insCore.includes('href="bolge.html"'));
/* ---- 3a5) GÜVENLİK regresyon kilitleri (v3.0 yayın) ---- */
ok('GÜVENLİK: DeepSeek secret istemciye gömülü DEĞİL', (()=>{try{const u=readFileSync('insaat/js/app-ui.js','utf8');return !/sk-[0-9a-f]{16,}/.test(u) && u.includes("_DS_KEY_DEFAULT=''");}catch(e){return false}})());
ok('GÜVENLİK: admin şifre ipucu görünür DEĞİL', !insHtml.includes('Demo şifre'));
ok('insaat SEO: index Organization NAP (adres/telefon/geo)', /PostalAddress/.test(insHtml) && /GeoCoordinates/.test(insHtml) && /telephone/.test(insHtml));
ok('insaat SEO: index robots + favicon', /name="robots"/.test(insHtml) && /rel="icon"/.test(insHtml));
ok('insaat: footer Veri Ortağı kaldırıldı', !insCore.includes('Veri Ortağı') && !insHtml.includes('Veri Ortağı'));
/* ---- 3a6) insaat EN i18n (yeni SEO sayfalarında gerçek çeviri, stub değil) ---- */
for(const pg of ['hizmetlerimiz','projelerimiz','soru-cevap','bolge']){
  let h=''; try{h=readFileSync('insaat/'+pg+'.html','utf8');}catch(e){}
  ok('insaat EN '+pg+': gerçek i18n (harvest + sözlük)', /data-ik/.test(h) && /(NB_EN|BZ_EN)\s*=/.test(h) && /(nbHarvest|_nbK|data-io)/.test(h));
}
/* ---- 3a3b) danisman gerçek SEO sayfaları ---- */
for(const pg of ['hakkimizda','sss']){
  let h=''; try{h=readFileSync('danisman/'+pg+'.html','utf8');}catch(e){}
  ok('danisman SEO '+pg+': indekslenebilir + canonical + base.css', !!h && !/noindex/.test(h) && h.includes('rel="canonical" href="'+pg+'.html"') && h.includes('css/base.css'));
  ok('danisman SEO '+pg+': JSON-LD', h.includes('application/ld+json'));
}
ok('danisman SEO: sss FAQPage', /"@type"\s*:\s*"FAQPage"/.test(readFileSync('danisman/sss.html','utf8')));
ok('danisman SEO: nav+footer interlink', (()=>{try{return readFileSync('danisman/index.html','utf8').includes('href="hakkimizda.html"') && readFileSync('danisman/js/app.js','utf8').includes('href="hakkimizda.html"');}catch(e){return false}})());
/* ---- 3a4) TÜM sitelerde sitemap.xml + robots.txt ---- */
for(const [site,minUrl] of [['insaat',5],['gayrimenkul',4],['degerleme',20],['danisman',1]]){
  ok(site+' SEO: sitemap.xml + robots.txt', (()=>{try{
    const sm=readFileSync(site+'/sitemap.xml','utf8'); const rb=readFileSync(site+'/robots.txt','utf8');
    return (sm.match(/<url>/g)||[]).length>=minUrl && /<urlset/.test(sm) && /Sitemap:/i.test(rb);
  }catch(e){return false}})());
}
/* ---- 3b) wl.js logo tek-kaynak (footer dahil) ---- */
const wl = readFileSync('wl.js','utf8');
ok('wl.js logo: querySelectorAll(.logo)', wl.includes("querySelectorAll('.logo')"));
ok('wl.js: yüklenen logo görseli desteği', wl.includes('logo-img') && wl.includes('d.FIRMA&&d.FIRMA.logo'));
ok('wl.js: tekil .logo .mark querySelector kaldırıldı', !wl.includes("var mk=document.querySelector('.logo .mark')"));
/* ---- 3c) insaat restructure (P1: bağımsız dizin + ayrık dosyalar) ---- */
ok('insaat app-core.js derlenir', buildsOk('insaat/js/app-core.js'));
ok('insaat app-ui.js derlenir', buildsOk('insaat/js/app-ui.js'));
const ins = readFileSync('insaat/index.html','utf8');
ok('insaat: css/base.css link', ins.includes('href="css/base.css"'));
ok('insaat: js/app-core.js + app-ui.js', ins.includes('src="js/app-core.js"') && ins.includes('src="js/app-ui.js"'));
ok('insaat: importmap + module (Three.js) korundu', ins.includes('type="importmap"') && ins.includes('type="module"'));
ok('insaat: ince kabuk (<3000 satır)', ins.split('\n').length < 3000);
ok('insaat: kök insaat.html redirect stub', (()=>{const s=readFileSync('insaat.html','utf8');return s.includes('insaat/index.html') && s.includes('noindex') && s.length<1500;})());
ok('insaat: neden-biz.html → index.html (eski insaat.html değil)', (()=>{const s=readFileSync('insaat/neden-biz.html','utf8');return s.includes('href="index.html"') && !s.includes('href="insaat.html"');})());
ok('insaat: kök index seçici insaat/index.html', readFileSync('index.html','utf8').includes('href="insaat/index.html"'));
/* ---- 3d) danisman restructure (P1) ---- */
ok('danisman app.js derlenir', buildsOk('danisman/js/app.js'));
const dan2 = readFileSync('danisman/index.html','utf8');
const danApp = readFileSync('danisman/js/app.js','utf8');
ok('danisman: css/base.css + js/app.js link', dan2.includes('href="css/base.css"') && dan2.includes('src="js/app.js"'));
ok('danisman: shared js ../ (tr-grammar/tr-iller)', dan2.includes('src="../tr-grammar.js') && dan2.includes('src="../tr-iller.js'));
ok('danisman: ince kabuk (<400 satır)', dan2.split('\n').length < 400);
ok('danisman: kök danisman.html redirect stub', (()=>{const s=readFileSync('danisman.html','utf8');return s.includes('danisman/index.html') && s.includes('noindex') && s.length<1500;})());
ok('danisman: kök index seçici danisman/index.html', readFileSync('index.html','utf8').includes('href="danisman/index.html"'));
ok('danisman: D1/D2 nav düzeltmeleri korundu (app.js)', danApp.includes("function leadFor(name){if(typeof closeNav") && danApp.includes("surec"));

/* ---- 4) Alt sayfa entegrasyonu (portfoy.html gerçek SEO sayfası dahil) ---- */
for(const f of ['gayrimenkul/hizmetlerimiz.html','gayrimenkul/nedenbiz.html','gayrimenkul/portfoy.html']){
  const h = readFileSync(f,'utf8');
  ok(f+' → wl.js', h.includes('src="../wl.js'));
  ok(f+' → tr-grammar.js', h.includes('src="../tr-grammar.js'));
  ok(f+' → tr-iller.js', h.includes('src="../tr-iller.js'));
  ok(f+' inline WL kalıntısı yok', !/White-label senkron|Çalışma-zamanı canonical/.test(h));
  ok(f+' P4-G4: overlay stub temiz yol (index.html# değil)', h.includes("function brOpen(){location.href='analiz';}") && !h.includes("location.href='index.html#analiz'"));
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
