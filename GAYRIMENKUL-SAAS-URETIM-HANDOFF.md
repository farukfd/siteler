# Gayrimenkul SaaS — Üretime Hazırlık Devir Belgesi (50 Maddelik Talimatın Uygulama Planı)

> **Kime:** `gayrimenkul.emlakekspertizi.com` çok-kiracılı SaaS'ını üretime alacak **backend/altyapı ekibi + Sunucu Claude**.
> **Kimden:** Frontend/statik repo çalışması (bu repo).
> **Tarih:** 2026-08-01 · **Branch:** `feat/gm-saas-p0-hardening` (izole; main'e değmedi).
> **Bağlam:** Bu repo **tamamen statik** (8 HTML + varlıklar, backend YOK). 50 maddelik "Tam Kapsamlı SaaS Üretime Hazırlık" talimatının **A-kovası (statikte yapılabilir)** kısmı burada uygulandı; **B-kovası (backend/altyapı)** ve **C-kovası (insan/hukuk)** aşağıda sizin için haritalandı.

---

## 0) TEK CÜMLE
Statik demo sertleştirildi (kamuya açık P0 sızıntıları kapatıldı), ama **gerçek çok-kiracılı SaaS** (sunucu-taraf tenant izolasyonu, DB, auth/MFA, secret manager, CDN, WAF, CI/CD, audit log, pen-test) **bu repoda inşa edilemez ve edilmedi** — B-kovası tamamen sizde.

---

## 1) ✅ A-KOVASI — BU REPODA YAPILDI (branch: feat/gm-saas-p0-hardening)

| Spec | İş | Kanıt |
|---|---|---|
| P0-8 | Canlı ProX tenant anahtarı istemci HTML'den **çıkarıldı**; `EMLAK_PROXY_MODE=true` → `X-Tenant-Key` gönderilmiyor. Proxy yoksa demo fallback veriye düşer. | `index.html` satır ~14; `grep prox_emlaktahadimkoy…` = 0 |
| P0-2 | Kamusal HTML'deki **"admin / 1234" ifşası** ve `value="admin"` ön-dolgusu kaldırıldı. | `grep "Şifre: <b>1234"` = 0 |
| P0-3 | Demo **noindex**: 8/8 sayfaya `robots noindex,nofollow,noarchive`; `robots.txt` → `Disallow: /`. | `grep -l noindex` = 8 |
| P0-10 | EİDS metni: "otomatik doğrulanır" + doğrulanmamış tarih iddiası → **durum-takibi** çerçevesi (gerçek entegrasyon yoksa doğrulama yapıyormuş gibi davranmıyor). | `index.html` ~919 |
| 35 | "50.000+ mahalle" → **"50.000+ mahalle ve köy"**. | `index.html` ~319 |
| P0-4/34 | Uydurma güven-sinyalleri (4.9 puan, "1.300 doğrulanmış alıcı", "21 günde satış", "18 yıl", kurgusal referanslar ANKA/Vega/Atlas/Nova, "Yetkili Müşavir" rozeti) — **temizlik sürüyor** (envanter + edit pass). | ayrı commit |

**⚠️ A-kovasının sınırı (dürüstlük):** İstemci-taraf admin auth (`"1234"` kontrolü satır ~733/1106) **hâlâ bypass edilebilir** — statik sitede gerçek güvenlik kurulamaz. Bu yalnız "kamuya açık ifşayı kaldırma"dır; **gerçek auth B-kovasında.**

---

## 2) 🔴 B-KOVASI — BACKEND/ALTYAPI (SİZDE) — spec madde eşlemesi

Her madde için **kabul kriteri** spec'in 49. bölümündedir; burada sahiplik + kritik not veriyoruz.

### Güvenlik & İzolasyon (öncelik 1)
- **1, 20 — Panel ayrımı:** Yönetim paneli kamusal HTML/JS bundle'ından **tamamen çıkarılmalı**, ayrı uygulama + ayrı alt alan (`panel.…`) + oturumlu route. Statikte panel hâlâ aynı dosyada; ayrıştırma sizde.
- **2, 43 — Auth:** Sunucu-taraf kimlik doğrulama, parola hash (argon2/bcrypt), HttpOnly+Secure+SameSite cookie, oturum rotasyonu, **MFA**, brute-force limiti. `admin/1234` ve tüm tekrar-parolalar kapatılmalı; **eski oturum/token iptal**.
- **5, 17 — Tenant izolasyonu:** Host → doğrulanmış domain → tenant → abonelik → özellik. Her tabloda `tenant_id`; PostgreSQL RLS + uygulama yetkisi. ID değiştirerek `/api/leads/123` erişimi engellenmeli.
- **8 — Secret yönetimi:** Tüm gizli anahtarlar vault/secret-manager'da; tenant başına ayrı anahtar+kota. **⚠️ Sızan `prox_emlaktahadimkoy_com_5d31…` anahtarı git geçmişinde → ACİL ROTATE** (emlakekspertizi.com'da iptal + yeni üret). `cloudflare-worker/` iskeleti hazır (bkz. DEPLOY-VE-GUVENLIK-NOTU.md).
- **6 — CDN/cache:** Cache anahtarı Host+path+dil bazında; bir tenant'ın HTML'i başkasına servis edilmemeli; tenant-bazlı purge.
- **7, 19 — Veri konumu:** CRM/lead/portföy/sözleşme **localStorage'dan** tenant-izolasyonlu **DB'ye**. Sunucu-taraf şifreli, test edilmiş restore'lu yedekleme.
- **18 — Dosya yükleme:** MIME/uzantı/boyut doğrulama, SVG sanitizasyonu, private bucket, imzalı kısa-süreli URL, SSRF allowlist.
- **42 — Ağ güvenliği:** CORS allowlist (yıldız yok), CSRF token/SameSite, endpoint bazlı rate-limit, WAF/bot koruması.
- **41 — Güvenlik başlıkları:** HSTS, CSP (unsafe-inline/eval'siz), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors.
- **44 — Audit log:** giriş/rol/anahtar/dışa-aktarım/yayın vb. değiştirilemez log (parola/TCKN/anahtar loglanmadan).
- **16 — Fiyat alarmı:** double opt-in, tenant+IP limiti, unsubscribe token, abuse tespiti.
- **9 — AI güvenliği:** prompt-injection filtresi, tool allowlist, PII maskeleme, insan-onaysız otoyayın engeli.

### SEO/Altyapı (backend/hosting gerektiren kısımlar)
- **21, 22 — URL:** `/index.html`→`/` ve `.html`→uzantısız **301** (hosting rewrite gerekir; statikte yapılamaz).
- **25 — SSR/SSG:** Kamusal sayfalar ilk HTTP cevabında gerçek HTML döndürmeli (şu an JS-render).
- **26, 27, 28 — Tenant-başı SEO:** benzersiz title/description/H1, tenant domaininde canonical, dinamik `robots.txt`+`sitemap.xml`.
- **29, 30 — Programatik sayfalar:** mahalle/ilan sayfaları için veri-yoğunluğu eşiği + `noindex,follow` fallback; ilan detay `410 Gone` stratejisi.

### Süreç
- **46, 47, 48 — Ortam & test:** dev/staging/demo/prod ayrımı; tenant-izolasyon + yetki + form + dosya otomatik testleri; **yetkili** pen-test (yalnız staging).

---

## 3) 🟠 C-KOVASI — İNSAN/HUKUK/İŞ KARARI (SENDE)

- **10 (tarih) — EİDS resmî tarihleri:** "15 Şubat 2026" iddiası resmî Ticaret Bakanlığı kaynağıyla **doğrulanmalı** (bize doğrulanmış kaynak yoktu; metni durum-takibine çevirdik ama kesin tarih senin teyidini bekliyor).
- **10 (entegrasyon) — Gerçek EİDS/TTBS/TCKN yetkisi:** Bakanlık API erişimi ve yetkili entegrasyon **var mı?** Yoksa "doğrula" akışı kurulamaz (durum-takibi kalır).
- **11 — KVKK veri sorumlusu:** Her bağımsız müşteri kendi veri sorumlusudur; NADAS/EmlakEkspertizi'nin rolü (işleyen/ortak sorumlu/altyapı) **sözleşmeyle** belirlenmeli. Tenant başına ayrı KVKK/gizlilik/çerez/başvuru metni.
- **12, 13, 14 — Aydınlatma≠rıza ayrımı**, saklama süreleri, çerez consent politika sürümleri — hukukçu onayı.
- **4 (kurulum kapısı) — Gerçek firma bilgileri:** her tenant için ünvan/adres/telefon/yetki belgesi/logo/danışman vb. tamamlanmadan "Yayınla" çalışmamalı (backend onboarding + senin toplayacağın gerçek veriler).
- **31, 34 — Metrik kaynağı:** "480M kayıt / 50.000+ mahalle" NADAS altyapısına aittir; müşteri firmanın başarısı gibi gösterilmemeli — merkezi doğrulanmış tanım.

---

## 4) ÖNERİLEN FAZ SIRASI
1. **Faz 0:** Sızan ProX anahtarını rotate et + admin/1234'ü backend'de kapat + oturumları iptal (ACİL).
2. **Faz 1:** Panel'i ayrı app+alt-alan'a taşı, sunucu auth+MFA, tenant çözümleme.
3. **Faz 2:** DB + tenant izolasyonu (RLS+uygulama), CRM/lead'i DB'ye taşı.
4. **Faz 3:** Secret manager + per-tenant anahtar/kota + edge-proxy (Worker) canlı.
5. **Faz 4:** SEO/SSR/301/canonical/sitemap + tenant-başı SEO.
6. **Faz 5:** KVKK tenant-başı metinler + consent + audit log + backup/restore.
7. **Faz 6:** Güvenlik başlıkları + CORS/CSRF/rate-limit/WAF; otomatik testler; yetkili pen-test; devir raporu.

## 5) TESLİM EDİLECEKLER (spec 50. madde)
Mimari raporu · SaaS diyagramı · tenant çözümleme akışı · DB izolasyon tasarımı · rol/izin matrisi · kaldırılan hesap/anahtar listesi · credential-rotation raporu · eski↔yeni URL + redirect CSV · canonical tablosu · sitemap/robots · KVKK veri-akış envanteri · veri-sorumlusu matrisi · consent testi · API/dosya güvenlik raporu · güvenlik başlıkları · tenant izolasyon + rol testleri · Lighthouse · structured-data testi · EİDS düzeltme raporu · log/olay kontrol · backup/restore testi · deploy+rollback · açık riskler · önce/sonra ekran görüntüleri. **Her madde spec formatında kanıtla** (HTTP kodu, kaynak çıktı, test sonucu, log, ekran görüntüsü).

## 6) ROLLBACK
Bu çalışma izole branch `feat/gm-saas-p0-hardening`'te; `main`/`feat/dwg-prox-gercek-veri` etkilenmedi. Geri dönüş: branch'i merge etme veya `git branch -D`. Üretim değişikliği yapılmadan önce çalışan sürümün yedeği + staging + rollback planı (spec girişi) zorunlu.

---

## GÜNCELLEME (2026-08-01) — A-kovası genişletildi + DEMO içerik kararı

**DEMO içerik kararı (kullanıcı):** Demo sitenin amacı TÜM özellikleri göstermektir.
İlan, Özel Portföy, endeksler, danışmanlar, danışman yorumları ve istatistikler
**temsilî içerik olarak KORUNUR** (kaldırılmaz). Dürüstlük, bunların temsilî olduğunu
**sinyallemekle** sağlanır; üretimde her tenant'ın GERÇEK verisi bunların yerini alır
(onboarding "kurulum kapısı" — B/C).

**Bu turda tamamlanan ek A-kalemleri (parça parça):**
- **Demo sinyali (Google + kullanıcı):** 8/8 sayfaya statik DEMO bildirimi
  ("ilan/portföy/danışman/yorum/istatistik temsilîdir") + noindex,nofollow,noarchive
  + robots.txt Disallow + Referanslar "temsilî örnekler" notu.
- **#8 (kritik):** Canlı ProX anahtarı 8/8 sayfa + app.js'ten kaldırıldı, proxy modu.
  ⚠️ Anahtar git geçmişinde → **ROTATE** zorunlu (B).
- **#2/#3/#24:** admin/1234 ifşası kaldırıldı; demo noindex.
- **#10:** EİDS "durum-takibi" (sahte canlı-doğrulama iddiası yok).
- **#16:** Fiyat alarmı public metninden iç API yolu kaldırıldı.
- **#23:** Kırık `#ozel` çapası → gerçek `ozel/` URL; overlay-nav gerçek deep-link
  URL'lerine (`sat/`,`analiz/`) bağlandı. Mevcut pushState temiz-URL router'ı + subdir
  loader stub'ları var; TAM clean-URL/301 hosting-tarafı (B).
- **#35:** "50.000+ mahalle ve köy" (tüm sayfalar).
- **#36:** ProX ön-değerleme sonucu ARALIK gösteriyor + satır-içi "resmî değerleme
  değildir; lisanslı uzman imzasıyla geçerlidir" uyarısı.
- **#37:** Kredi modülü → "bilgilendirici simülasyon; kredi onayı/finansal danışmanlık
  değil, banka teklifi yerine geçmez".
- **#40:** Erişilebilirlik büyük ölçüde uyumlu — tek h1/sayfa, lang 8/8, img-alt eksiği 0,
  ~%92 input etiketli. Kalan minör: skip-link + ~19 (çoğu admin) etiketsiz input + kontrast.
- **#31:** Şemada sahte AggregateRating YOK (temiz).

**Değişmeyen gerçek:** #1,5,6,7,9,11-15,17-22,25,26,28-34,38,39,41-49 hâlâ
backend/altyapı (B) veya hukuk (C) — statik repoda yapılamaz. Detay yukarıdaki
B/C bölümlerinde.
