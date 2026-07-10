/* ===================================================================
   smoke-test-danisman.mjs — Headless smoke test  →  `bun smoke-test-danisman.mjs`
   Danışman sitesi (Selin Meridyen · lüks) regresyon kalkanı.
   NOT: Site danisman.html (redirect) → danisman/index.html + danisman/js/app.js
   olarak bölündü; test GERÇEK dosyaları okur.
   1) tr-grammar.js / tr-iller.js saf modüller
   2) JS sözdizimi (bun build: danisman/js/app.js)
   3) Yapısal değişmezler (EİDS, yasal, AI korkuluk, JSON-LD, analitik/A/B,
      çok dilli, hizmet bölgeleri, proxy modu, sihirbaz, DeepSeek/aiChat)
   4) HTML kablolaması (tr-grammar/tr-iller yüklü, EİDS rozeti, footer yasal linkleri)
   Başarısızlıkta exit(1).
   =================================================================== */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

let pass = 0, fail = 0; const fails = [];
function ok(name, cond){ if(cond) pass++; else { fail++; fails.push(name); } console.log((cond?'✅':'❌')+' '+name); }
function eq(name, got, want){ ok(name+' → "'+got+'"', got===want); }

/* ---- 1) tr-grammar.js saf gramer ---- */
globalThis.window = {};
eval(readFileSync('tr-grammar.js','utf8'));
const T = globalThis.window.TRG;
ok('TRG yüklendi', !!T && typeof T.city==='function');
eq("Antalya'da (yumuşak)", T.city("İzmir'de","Antalya"), "Antalya'da");
eq("Uşak'ta (sert ünsüz)",  T.city("İzmir'de","Uşak"),   "Uşak'ta");

/* ---- 1b) tr-iller.js — 81 il ortak veri ---- */
globalThis.window = globalThis.window || {};
eval(readFileSync('tr-iller.js','utf8'));
const IL = globalThis.window.TR_ILILCE;
ok('tr-iller.js yüklendi (81 il)', IL && Object.keys(IL).length===81);
ok("İstanbul ilçeleri var", IL && IL['İstanbul'] && IL['İstanbul'].ilce.length>=39);

/* ---- 2) JS sözdizimi (bun build — gerçek app.js dosyası) ---- */
function buildsOk(){
  try{ execSync('bun build danisman/js/app.js --target=browser', { stdio:'ignore' }); return true; }
  catch(e){ return false; }
}
ok('danisman/js/app.js derlenir', buildsOk());

/* ---- 3) Yapısal değişmezler (app.js + index.html birleşik) ---- */
const dn = readFileSync('danisman/js/app.js','utf8') + '\n' + readFileSync('danisman/index.html','utf8');
const invariants = [
  ["EİDS motoru (eidsVerify)", "function eidsVerify"],
  ["EİDS yayın kapısı (eidsCanPublish)", "function eidsCanPublish"],
  ["EİDS public rozet", "function eidsRenderPublic"],
  ["Firma künye modeli", "firma:{"],
  ["Yasal motor (legalDoc)", "function legalDoc"],
  ["KVKK açılışı", "function openKvkk"],
  ["AI güvenlik korkuluğu (aiGuard)", "function aiGuard"],
  ["AI risk tarayıcı", "function aiRiskScan"],
  ["Dinamik JSON-LD (applySchema)", "function applySchema"],
  ["Analitik (trackEvent)", "function trackEvent"],
  ["A/B (abVariant)", "function abVariant"],
  ["Proxy güvenlik modu", "EMLAK_PROXY_MODE"],
  ["Çok dilli (gmLang)", "async function gmLang"],
  ["İl/ilçe motoru (makeProvince)", "function makeProvince"],
  ["Mahalle katmanı (realMah/loadMahalle)", "function loadMahalle"],
  ["Tam Hizmet Alanı (saApply)", "function saApply"],
  ["Çok-illi iş listesi (saWorkList)", "function saWorkList"],
  ["Gerçek ProX portföy (rebuildVipFromProx)", "function rebuildVipFromProx"],
  ["ProX analiz fiyatı (proxAnalyzePrice)", "async function proxAnalyzePrice"],
  ["Veri tazeliği (wlStale)", "function wlStale"],
  ["Paket kilidi (staGate)", "function staGate"],
  ["Paket upsell (staUpsell)", "function staUpsell"],
  ["Kurulum sihirbazı (openOnboarding)", "function openOnboarding"],
  ["tr-grammar.js yüklenir", "tr-grammar.js"],
  ["tr-iller.js yüklenir", "tr-iller.js"],
  ["EİDS public rozet öğesi", 'id="eidsPublicBadge"'],
  ["Hizmet Alanı admin sekmesi", 'data-t="hizmetalani"'],
  ["Portföy ⟳ ProX butonu", "rebuildVipFromProx()"],
  ["Footer KVKK canlı link", "openKvkk()"],
  ["Nav dil seçici", "gmLang(this.value)"],
  /* ---- D1: DeepSeek + aiChat yönlendirmesi (yeni) ---- */
  ["DeepSeek yönlendirme (aiChat)", "async function aiChat"],
  ["DeepSeek doğrudan çağrı", "api.deepseek.com/chat/completions"],
  ["DeepSeek mesaj kurucu (_dsMessages)", "function _dsMessages"],
  ["DeepSeek kalıcılık (_dsSave)", "function _dsSave"],
  ["DeepSeek admin alanı", 'id="dn_dskey"'],
  ["DeepSeek test", "function aiDsTest"],
  ["Asistan aiChat'ten geçer", "aiChat({prompt:_persona"],
  ["AI korkuluğu persona'da", "aiGuard(("],
  /* ---- D3: tam kayıt + admin görüşme panosu (yeni) ---- */
  ["Sohbet kaydı (_dnLogConvo)", "function _dnLogConvo"],
  ["Talep kaydı (dnPushLead)", "function dnPushLead"],
  ["Görüşme panosu (renderGorusmelerD)", "function renderGorusmelerD"],
  ["ProX Asistan kayıt deposu", "dn_asistan_convos"],
  ["Görüşmeler admin sekmesi", 'data-t="gorusmeler"'],
  ["Görüşme panosu öğesi", 'id="dnGorusmelerBody"'],
  ["proxSend kayıt bağlı", "_dnLogConvo('u',q)"],
];
for(const [name, needle] of invariants) ok("değişmez: "+name, dn.includes(needle));

/* ---- Özet ---- */
console.log('\n'+pass+' geçti, '+fail+' başarısız'+(fail? '  → '+fails.join(' | ') : ' ✓'));
process.exit(fail ? 1 : 0);
