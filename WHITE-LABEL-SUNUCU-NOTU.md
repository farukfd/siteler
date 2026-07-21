# White-Label Platform — Sunucu Ajanı Devir Notu

> **Amaç:** `nadas.com.tr/white-label.html` satış sayfası yayına giriyor. Bu sayfa,
> emlakekspertizi.com üyelik/ödeme akışına bağlanacak. Aşağıdaki maddeler **sunucu tarafında**
> yapılacak işlerdir; frontend tarafı nadas reposunda hazırdır.
> Son güncelleme: 20 Temmuz 2026.

---

## 0) TEK CÜMLE

4 sektör dikeyi (inşaat · emlak ofisi · danışman · SPK değerleme) **Investor ve üzeri**
üyeliklere **dahildir**. Ayrıca bağımsız satın alma kalemi olarak da eklenebilir.

---

## 1) HEDİYE EŞİĞİ — hangi paket neyi alır

| Kademe | Fiyat | Platform | Not |
|---|---|---|---|
| ProX Standard | 175 ₺/ay | ✗ | Yükseltme çağrısı gösterilir |
| Yerel Uzman | 950 ₺/ay | ✗ | **Ana upsell hedefi** — Investor'a 300 ₺ fark |
| **ProX Investor** | **1.250 ₺/ay** | ✓ | Danışman veya emlak ofisi dikeyi |
| **ProX Corporate** | **3.750 ₺/ay** | ✓ | Tam dikey + admin + CRM + 5 dil |
| **API · Kurumsal** | Özel teklif | ✓ | Banka/sigorta/portföy — kurulum kapsama dahil |

**Kritik:** Standard ve Yerel Uzman platformu almaz. Kaldıraç bu eşiğe bağlı; eşik aşağı
çekilirse Investor'a yükseltme gerekçesi ortadan kalkar.

---

## 2) ÖDEME SAYFASINDA YAPILACAKLAR

### 2.1 Sepet/checkout kalemi
Investor, Corporate ve API tier'ları seçildiğinde ödeme özetinde ayrı satır olarak görünsün:

```
ProX Investor · aylık                              1.250,00 ₺
└ Sektör Platformu (kendi domaininizde)             DAHİL
```

- Fiyat sütununda **"0 ₺" YAZMAYIN.** "DAHİL" yazın.
- **"Hediye", "ücretsiz", "bedava", "kampanya" kelimeleri kullanılmayacak.**
  Gerekçe: bu kelimeler (a) geçici/kampanyalı algı yaratır, (b) pazarlıkta çıkarılabilir
  kalem hâline gelir, (c) bedelsiz teslim tartışması doğurur, (d) veri işleyen
  sorumluluğunu bulanıklaştırır. Doğru dil: **"üyeliğe dahildir"**.

### 2.2 Dikey seçimi — ödeme sonrası zorunlu adım
Ödeme başarılı olduğunda kullanıcıdan **hangi dikeyi** istediği alınmalı:

```
insaat | gayrimenkul | danisman | degerleme
```

- Investor: tek dikey seçimi
- Corporate: tek dikey + admin/CRM + 5 dil
- API: kapsam sözleşmeye göre

Bu seçim `tenant` kaydına yazılmalı; kurulum akışı buradan tetiklenir.

### 2.3 Yükseltme çağrısı (Standard / Yerel Uzman ekranlarında)
Bu iki kademenin ödeme ve hesap ekranlarında:

> *Kendi domaininizde kurumsal platform, Investor üyeliğine dahildir — ayda 300 ₺ fark.*
> `[ Investor'a yükselt → ]`

### 2.4 Tier parametreleri
Satış sayfasındaki CTA'lar şu adreslere gidecek — **bu parametreler korunmalı**, dönüşüm
ölçümü buna bağlı:

```
https://www.emlakekspertizi.com/uyelik?tier=investor
https://www.emlakekspertizi.com/uyelik?tier=corporate
mailto:bilgi@emlakekspertizi.com?subject=ProX%20API%20Teklif%20Talebi
```

Ek olarak kaynak takibi için `&src=wl` parametresi eklenecek. Sunucu bu parametreyi
kaydetmeli ki white-label sayfasından gelen dönüşüm ayrıştırılabilsin.

---

## 3) 🔴 ACİL — `/uyelik` KIRIK

`emlakekspertizi.com/uyelik` şu an **ana sayfaya yönleniyor** ve site navigasyonunda yok.
Mevcut nav: `/prox-asistan`, `/emlak-ekspertizi`, `/karar-motoru`, `/emlak-endeksi`, `/blog`.

Nadas reposunda bu adrese **10 ayrı link** var; hepsi şu an kırık. White-label sayfası
yayına girmeden önce `/uyelik` (ve `?tier=` parametre desteği) ayağa kaldırılmalı.

---

## 4) 🔴 MARKA KURALI İHLALİ — ana site `<title>`

Şu an: `EmlakEkspertizi.com | Türkiye'nin İlk Bağımsız Yapay Zeka Destekli Emlak Platformu`

İki problem:

1. **"Yapay Zeka Destekli"** — proje marka kuralı: *ProX yapay zekâ değil, veritabanıdır;
   deterministiktir, halüsinasyon üretmez.* Demo sitelerindeki ~40 "ProX AI" geçişi bu
   kural gereği temizlendi (20 Tem 2026). Ana site `<title>`'ı — yani Google sonucunda
   görünen tek satır — kuralı ihlal ediyor. SPK/değerleme segmentine yapılacak
   "deterministik, denetlenebilir" argümanı bu başlık yüzünden çöker.
2. **"Türkiye'nin İlk"** — Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği
   kapsamında belgelendirme yükümlülüğü doğurur. Belge yoksa Reklam Kurulu yaptırım riski.

Önerilen: `EmlakEkspertizi.com | Mahalle Bazlı Gayrimenkul Veri Modeli ve Karar Analizi`

---

## 5) 🟠 VERİ RAKAMI TUTARSIZLIĞI

| Kaynak | İddia |
|---|---|
| emlakekspertizi.com meta description | **372M+ kayıt** |
| nadas.com.tr | **480M+ satır** |

**Karar: 480M esas alınacak.** emlakekspertizi.com meta açıklaması güncellenmeli.
(372M eski rakam; canlı ProX API bağlandığında 480M döneceği teyit edildi.)

Alıcı iki siteye birden bakacak — white-label sayfası emlakekspertizi'ye link verecek.
Farklı iki rakam, ikisinin de güvenilirliğini düşürür.

---

## 6) 🔴 DEMO YAYINI — SEO MAYINI

Demolar `emlakekspertizi.com/demo/{insaat,gayrimenkul,danisman,degerleme}` altına çıkacak.
**Yayından önce üç kalem zorunlu:**

1. **`noindex` eksik.** Mevcut kapsama:

   | Dikey | noindex |
   |---|---|
   | degerleme | 24/24 ✓ |
   | danisman | 1/13 |
   | insaat | 0/10 |
   | gayrimenkul | 0/8 |

   27+ sayfa korumasız. Bunlar indekslenirse ana siteyle **yinelenen içerik** üretir.

2. **`robots.txt`** → `Disallow: /demo/` eklenmeli.

3. **`wl.js` canonical'ı koşulsuz** `location.origin + location.pathname` yazıyor
   (`wl.js:15-21`). Demo yolunda istisna gerekli:
   ```js
   if (location.pathname.indexOf('/demo/') === 0) { /* canonical yazma */ }
   ```

Ek: 4 demo **aynı origin'i paylaşacak** (`emlakekspertizi.com`). localStorage anahtarları
ayrık görünüyor (`meridyenGM_v1` vs `ins_*`) ama yayın öncesi dördünü sırayla gezip
`Object.keys(localStorage)` ile çakışma olmadığı teyit edilmeli.

---

## 7) 🔴 P0 GÜVENLİK — devralınan açık

`DEPLOY-VE-GUVENLIK-NOTU.md` kendi denetiminde **C4/P0** işaretlemiş:
*"Demo tenant anahtarları git geçmişinde açık"* — rotate edilmesi istenmiş, **hâlâ açık.**

White-label sayfası özellikle SPK/kurumsal segmente trafik çekecek; o alıcının teknik
ekibi bunu ilk incelemede bulur. Yayın öncesi anahtar rotasyonu zorunlu.

---

## 8) ÇIKIŞ / DEVİR POLİTİKASI — sözleşmeye yazılacak

Satış sayfasının en güçlü paragrafı bu olacak; sunucu tarafında karşılığı kurulmalı:

> Üyelik sona erdiğinde: (i) siteniz kapatılmaz; canlı veri akışı, yönetim paneli ve
> güncellemeler durur. (ii) Talep hâlinde 30 gün içinde sitenizin statik kopyası ve tüm
> içerik/müşteri verileriniz teslim edilir. (iii) Barındırma 30 gün sonunda sona erer;
> alan adı her zaman müşterinindir. (iv) 12 ay içinde dönülürse kurulum bedeli
> yeniden alınmaz.

Gereken uçlar:
- `GET /api/v1/tenant/export` — içerik + lead + müşteri verisi (CSV/JSON)
- `POST /api/v1/tenant/freeze` — üyelik bitişinde canlı akışı durdur, siteyi ayakta tut
- Statik kopya üretimi (build yok → mevcut dosyaların zip'i yeterli)

**Teslim paketinden çıkarılacaklar:** ProX API anahtarları ve entegrasyon katmanı,
admin paneli, CRM, .dwg WASM modülü, Türkçe gramer motoru, çeviri dosyaları, tema motoru.
**Teslim edilen:** render edilmiş statik HTML + müşterinin kendi içeriği/görselleri.

---

## 9) ÖLÇÜM — sunucudan beklenen olaylar

| Olay | Neden |
|---|---|
| `wl_cta_click {tier}` | Hangi kademeye yönlendiriyor |
| `uyelik_view {tier, src}` | white-label kaynaklı trafik ayrıştırma |
| `tier_upgrade {from, to}` | **Yerel Uzman → Investor** ana kaldıraç metriği |
| `vertical_select {vertical}` | Hangi dikey talep görüyor (5. dikey kararı buna bağlı) |
| `platform_activated {tenant}` | Domain bağlandı + logo/içerik girildi |
| `admin_login_weekly {tenant}` | Churn'ün öncü göstergesi |

**En kritik metrik: aktivasyon oranı** — platformu alan üyelerin 30 gün içinde domain
bağlayıp içerik dolduranların yüzdesi. Bu düşükse hediye modeli çalışmıyor demektir
(sektörde bilinen tuzak: dahil gelen platform kurulmaz).

---

## 10) FRONTEND TARAFINDA HAZIR OLANLAR (nadas reposu)

- `nadas/white-label.html` — satış sayfası (yapım aşamasında)
- 4 dikeyin yasal seti tamamlandı: insaat 4/4, gayrimenkul 4/4 — künye alanları
  config'ten okunuyor, boşsa görünür yer tutucu gösteriyor (`[Doldurulacak: MERSİS No]`)
- Terminoloji ayrıştırması yapıldı: üretici model işlevleri **"İçerik Asistanı"**,
  deterministik veri işlevleri **"ProX"** (20 Tem 2026)
- 16 bozuk OG görsel URL'i düzeltildi (`meridyenyapi.comimg/` → `meridyenyapi.com/img/`)

### Kalan yasal boşluklar
- `danisman/` — gizlilik metni yok (3/4)
- `degerleme/` — kullanım koşulları yok (3/4)
