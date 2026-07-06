/* ===================================================================
   smoke-test-danisman.mjs — Headless smoke test  →  `bun smoke-test-danisman.mjs`
   danisman.html'e taşınan gayrimenkul kazanımlarının regresyonunu yakalar:
   1) tr-grammar.js saf gramer (ortak modül)
   2) JS sözdizimi (bun build: danisman ana script)
   3) Yapısal değişmezler (EİDS, yasal, AI korkuluk, JSON-LD, analitik/A/B,
      çok dilli, hizmet bölgeleri, proxy modu, sihirbaz)
   4) HTML kablolaması (tr-grammar yüklü, EİDS rozeti, footer yasal linkleri)
   Başarısızlıkta exit(1).
   =================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
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

/* ---- 2) JS sözdizimi (bun build — en büyük inline script) ---- */
function buildsOk(){
  try{
    const H = readFileSync('danisman.html','utf8');
    const scripts = [...H.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
    const big = scripts.reduce((a,b)=> b.length>a.length ? b : a, '');
    const tmp = '/tmp/_smoke_danisman.js';
    writeFileSync(tmp, big);
    execSync('bun build '+tmp, { stdio:'ignore' });
    return true;
  }catch(e){ return false; }
}
ok('danisman.html ana script derlenir', buildsOk());

/* ---- 3) Yapısal değişmezler ---- */
const dn = readFileSync('danisman.html','utf8');
const invariants = [
  ["EİDS motoru (eidsVerify)", "function eidsVerify"],
  ["EİDS yayın kapısı (eidsCanPublish)", "function eidsCanPublish"],
  ["EİDS public rozet", "function eidsRenderPublic"],
  ["Firma künye modeli", "firma:{"],
  ["Yasal motor (legalDoc)", "function legalDoc"],
  ["KVKK/Çerez/Mesafeli", "function openMesafeli"],
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
  ["ProX analiz fiyatı (proxAnalyzePrice)", "function proxAnalyzePrice"],
  ["Veri tazeliği (wlStale)", "function wlStale"],
  ["Paket kilidi (staGate)", "function staGate"],
  ["Paket upsell (staUpsell)", "function staUpsell"],
  ["Kurulum sihirbazı (openOnboarding)", "function openOnboarding"],
  ["tr-grammar.js yüklenir", 'src="tr-grammar.js"'],
  ["tr-iller.js yüklenir", 'src="tr-iller.js"'],
  ["prox/ai aiGuard'lı", "prompt:aiGuard(q)"],
  ["EİDS public rozet öğesi", 'id="eidsPublicBadge"'],
  ["Hizmet Alanı admin sekmesi", 'data-t="hizmetalani"'],
  ["Portföy ⟳ ProX butonu", "rebuildVipFromProx()"],
  ["Footer KVKK canlı link", "openKvkk()"],
  ["Nav dil seçici", "gmLang(this.value)"],
];
for(const [name, needle] of invariants) ok("değişmez: "+name, dn.includes(needle));

/* ---- Özet ---- */
console.log('\n'+pass+' geçti, '+fail+' başarısız'+(fail? '  → '+fails.join(' | ') : ' ✓'));
process.exit(fail ? 1 : 0);
