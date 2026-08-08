# Kurulum Sihirbazı — Kusursuz Yeniden Yapı Planı (gayrimenkul · danisman · insaat)

> **Amaç:** Kurumsal müşteri sihirbazda kendi marka + bilgilerini girince demo (Meridyen)
> **eksiksiz** ve **anında** müşterinin kurumsal kimliğine dönüşsün — "sihirli".
> **Tarih:** 2026-08-02. Kaynak: 3 site derin analizi (ajan) + 2026 web araştırması.

---

## 1) KÖK NEDEN — neden "tam dönüşmüyor" (3 sitede ortak desen)

Mevcut yaklaşım = **DOM metin-süpürme** (`brandSweep`: "Meridyen→ad") + **dağınık store'lar** + **sayfa-başı ayrı motor**. Bu yapı doğası gereği kırılgan. Somut kök nedenler:

| # | Kök neden | Kanıt (site:dosya) |
|---|---|---|
| A | **Sihirbaz girdilerini KAYDETMİYOR** | danisman `app.js obFinish` yalnız `dn_onboarded`+il yazıyor; marka/firma/iletişim/renk/anahtar **bellekte kalıp reload'da buharlaşıyor** |
| B | **Dar yakalama** | 3 sihirbaz da WhatsApp/favicon/tema/sosyal/MERSİS/SEO/danışman/harita/OG **toplamıyor**; insaat'ta **sihirbaz hiç yok** (7 ayrı panel) |
| C | **Hiçbir şeye bağlı OLMAYAN marka taşıyıcıları** | Sosyal `<a href>` (gm: 5 link ×8 sayfa hardcoded) · OG görsel (3 sitede de "Meridyen" pixel'i baked) · tema dosyası (gm manuel swap) |
| D | **YANLIŞ veri yolu → boş künye** | gm+insaat: yasal sayfalar `SETTINGS/CONTACT`/öneksiz anahtar okuyor ama app `FIRMA.eids`/`firma`-önekli yazıyor → KVKK/gizlilik künyesi **her tenant'ta `[Doldurulacak]`/boş** |
| E | **Statik sayfalar tam motoru çalıştırmıyor** | danisman 12 sayfa `app.js` yüklemiyor → tema/SEO/JSON-LD/iletişim oralarda uygulanmıyor |
| F | **AI persona sweep'in ulaşamadığı yerde** | gm `uyelik-asistan.js` `PA_SYS`/`PA_GREET` sistem-prompt'unda "Meridyen Gayrimenkul" sabit → modele öyle gidiyor |
| G | **Boş bırakılan alan demo'ya düşüyor** | `DEF_FIRMA` İzmir adres/tel/mersis/kep + demo danışmanlar + demo sosyal kalıcı |
| H | **i18n × marka çakışması** | insaat: sözlük anahtarı marka-string'ine bağlı; sweep sonrası EN çeviri sessizce kırılıyor |

**Özet:** Kimlik üç katmanda tutarsız — sihirbaz < admin formu < yasal sayfa/footer ihtiyacı. Üç taşıyıcı (sosyal href, OG görsel, tema dosyası) **hiçbir şeye**, biri (künye) **yanlış yola** bağlı.

---

## 2) 2026 "SİHİRLİ" MİMARİ (araştırma-tabanlı çözüm)

DOM-süpürme kırılganlığını bırak; **tek kimlik modeli + veri-binding + token tema + AI ön-doldurma**.

**a) Tek tenant kimlik modeli (`TENANT` — tek doğru kaynak).** Tüm alanlar: kimlik (ad, ünvan, logo, favicon, harf), iletişim (tel, wa, mail, adres, saat, lat/lng), yasal (mersis, vergi no/daire, ticaret sicil, oda, kep, EİDS belge, KVKK veri sorumlusu), sosyal (fb/ig/x/li/yt + portallar), tema (primary/accent + tipografi = **design token**), SEO (title/desc/kw, canonical domain, OG), içerik (hero/hakkımızda/danışman/referans/hizmet bölgesi/proje), AI persona.

**b) Design-token tema (CSS değişkenleri + `data-brand`).** Hardcoded tema dosyası + dağınık renk var'ları yerine `:root` custom property'ler tenant modelinden beslensin → **anında, FOUC yok, TÜM sayfalarda** (rebuild yok). [Kaynak: runtime token theming]

**c) Veri-binding (süpürme DEĞİL).** Kırılgan "Meridyen→ad" metin-replace yerine açık `data-tenant="field"` binding + **tek apply geçişi** (`tenant-apply.js`) HER sayfada çalışsın. Metin/href/görsel/JSON-LD/meta/OG/AI-persona/i18n hepsi modelden okusun. Sweep bağımlılığı biter.

**d) AI marka çıkarımı (URL→marka kiti) — asıl "sihir".** Kullanıcı mevcut web/sosyal/Google Business **URL'sini** girince → logo+renk+font+ad+iletişim otomatik çıkarılıp sihirbaz **ön-doldurulur** (Brandprint/Firecrawl/Brandfetch/Context.dev deseni; edge/proxy servisi). *(+%40 onboarding dönüşümü raporlandı.)*

**e) Rehberli + gamified sihirbaz + gerçek-zamanlı önizleme.** Tek stepli akış tüm alanları toplasın; **tek "Yayınla"** tam modeli yazsın. Yazarken **canlı önizleme** (builder mode). Gamified checklist. Sandbox: demo veri temizle/tohumla.

**f) Per-tenant OG görsel.** Runtime SVG veya edge-üretim (baked Meridyen kartı yok).

---

## 3) FAZLI UYGULAMA PLANI

**Faz 0 — Temel (client, kritik):**
- Tek `TENANT` modeli (tüm alanlar) + tek `tenant-apply.js` (3 sitede de HER sayfada yüklenir).
- Design-token tema: renk/tipografi CSS değişkenleri, tenant'tan; statik sayfalar dahil.
- **Kırık kablolamaları düzelt:** künye veri-kontratı (D), sosyal href (C), AI persona (F), boş-default temizleme (G), i18n decoupling (H).

**Faz 1 — Eksiksiz sihirbaz (client):**
- 3 sitede ortak, rehberli, tek-yayınlı sihirbaz. Adımlar: (1) Kimlik+logo+favicon (2) İletişim+harita+WA (3) Yasal künye (ünvan/VD/vergi/MERSİS/sicil/oda/KEP/EİDS) (4) Sosyal+portal (5) Tema/renk/tipografi (6) SEO+GA/GSC (7) İçerik: danışman/proje/hizmet/referans tohumu (8) ProX anahtarı → **canlı önizleme + tek Yayınla** (tam modeli persist eder).
- Gamified tamamlanma checklist'i + "yayına hazır" kapısı (zorunlu alanlar dolmadan yayın yok).

**Faz 2 — Kalan taşıyıcılar & parite:**
- Per-tenant OG görsel (SVG/edge) · sitemap tenant-aware · insaat'ı tam pariteye getir · demo danışman/proje/referans sandbox tohum-veya-temizle.

**Faz 3 — AI "sihir" (backend/edge):**
- URL→marka kiti çıkarım servisi (Worker/edge; Brandprint/Firecrawl API veya kendi çıkarımı) → sihirbaz ön-doldurma. **Backend gerektirir** (nadas gibi sunucuda).

---

## 4) CLIENT vs BACKEND (dürüst sınır)
- **Client (bu repoda yapılır):** tenant modeli, tenant-apply.js, token tema, sihirbaz UI, canlı önizleme, kırık-kablolama düzeltmeleri, künye/sosyal/persona/i18n, per-tenant OG (runtime SVG).
- **Backend/edge (sunucuda):** AI URL→marka çıkarımı, tenant kalıcılığı DB (localStorage yerine — B/C kovası), OG edge-üretimi, ProX proxy (CORS). *(Not: mevcut kimlik localStorage'da; gerçek SaaS'ta DB'ye — bkz. GAYRIMENKUL-SAAS-URETIM-HANDOFF.md.)*

---

## 5) ÖNCELİK (ilk değer için)
1. **Faz 0** (kırık kablolamalar) — en görünür "tam dönüşmüyor" şikayetini bitirir: künye, sosyal, persona, boş-default, statik-sayfa apply.
2. **Faz 1** (eksiksiz sihirbaz + önizleme) — asıl UX.
3. Faz 2/3 (OG, insaat parite, AI çıkarım).
