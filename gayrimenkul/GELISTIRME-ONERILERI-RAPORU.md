# Geliştirme Önerileri — Detaylı Rapor (Rakip-Boşluk Analizi)

> Kaynak: 5-lens tam kapsamlı denetim (Ağu 2026) → işlev lensinin rakip karşılaştırması.
> Sıralama önerisi rapor sonundadır. Geliştirmeler bu rapor ONAYLANDIKTAN sonra yapılacaktır.

---

## 1) Kayıtlı Arama + Otomatik Bildirim  `[öncelik: YÜKSEK · efor: ORTA]`

**Mevcut durum:** İlanlar sayfasında filtreleme var; Pusula'da `pcSaveSearch` ile tekil kayıtlı arama tohumu mevcut ama İlanlar sayfasında çoklu-kriter kayıt ve "yeni ilan düşünce haber ver" akışı yok. Rakiplerde (sahibinden/hepsiemlak) temel tutundurma aracı.

**Hedef kapsam:**
- İlanlar filtre çubuğuna "🔔 Bu aramayı kaydet" — ad ver, kriter seti (il/ilçe/tip/oda/fiyat aralığı/m²) JSON olarak saklanır
- "Kayıtlı Aramalarım" paneli (üye alanında + İlanlar sayfasında hızlı erişim); düzenle/sil
- Eşleşme motoru: yeni ilan eklendiğinde (admin/ProX feed) kriter setleriyle karşılaştır → eşleşme rozeti + bildirim kuyruğu
- Bildirim teslimi Faz-1'de e-posta (mevcut kanal), Faz-2'de push/SMS (bkz. §5)

**Mimari uyum:** Kriter seti `localStorage` (üye girişliyse hesap senkron — §3 ile birleşir). Sunucu tarafı: `POST /api/v1/tenant/saved-search` + eşleşme cron'u → PROX-API-GEREKSINIM-NOTU.md'ye eklenecek. Demo modda eşleşme istemcide (ilan listesi zaten elde) çalışır — backend'siz de gösterilebilir.

**Efor:** UI+istemci eşleşme ~1 gün · backend ucu ayrı (sunucu ekibi). **Bağımlılık:** yok (Faz-1 için).

---

## 2) İlan Karşılaştırma — Ana İlanlar Sayfasında  `[öncelik: YÜKSEK · efor: KÜÇÜK]`

**Mevcut durum:** Yan-yana karşılaştırma **Özel Portföy'de zaten var** (shared/listing-extras karşılaştır motoru); ana İlanlar sayfasında yüzeye çıkarılmamış.

**Hedef kapsam:**
- İlan kartlarına "⚖️ Karşılaştır" onay kutusu (2-3 seçim) + yapışkan "Karşılaştır (n)" çubuğu
- Mevcut karşılaştırma tablosu bileşenini (fiyat, ₺/m², oda, kat, yaş, endeks, skor) ana listede aç
- Mobilde yatay kaydırmalı tablo

**Mimari uyum:** Motor hazır — büyük ölçüde mevcut bileşenin `ilanlar.html`'e bağlanması. Seçimler `sessionStorage`.

**Efor:** ~yarım gün. **Bağımlılık:** yok. *(En hızlı kazanım — ilk sprint adayı.)*

---

## 3) Hesaba Bağlı Favoriler (Cihazlar Arası Senkron)  `[öncelik: ORTA · efor: ORTA]`

**Mevcut durum:** Favoriler yalnız `localStorage` — telefonda eklenen masaüstünde yok; tarayıcı verisi silinince kayboluyor. Üyelik sistemi (uyelik-asistan) mevcut ama favori senkronu yok.

**Hedef kapsam:**
- Üye girişliyse favori değişikliklerini hesaba yaz/oku; misafirde mevcut localStorage davranışı sürer
- Giriş anında birleştirme (local ∪ hesap) + çakışma: birleşim
- Üye panelinde "Favorilerim" listesi (fiyat değişimi rozeti ile — kayıtlı aramanın kardeşi)

**Mimari uyum:** `GET/PUT /api/v1/tenant/member/favorites` ucu gerekir (PROX notuna eklenecek). Demo modda "hesap" = localStorage'daki üye kaydı içinde ayrı anahtar (senkron simülasyonu) — backend'siz gösterilebilir.

**Efor:** ~1 gün istemci. **Bağımlılık:** üyelik oturumu (mevcut).

---

## 4) Canlı Google Puan Widget'ı  `[öncelik: DÜŞÜK · efor: KÜÇÜK-ORTA]`

**Mevcut durum:** Referanslar bölümündeki Google puanı statik metin — güven sinyali olarak zayıf ve bayatlama riski taşıyor.

**Hedef kapsam:**
- Google Business Profile puan + yorum sayısını periyodik çekip footer/referans bölümünde canlı rozet olarak göster
- Tıklayınca Google profil sayfasına gider; son 2-3 yorumun kayan özeti (opsiyonel)

**Mimari uyum:** Google Places API anahtar ister ve **istemciden çağrılamaz** (anahtar sızar) → ProX proxy'ye `GET /api/v1/tenant/google-rating` ucu (sunucu günde 1-2 kez çeker, önbellekler). Sihirbaz 1. adımdaki "Google işletme URL" alanı zaten toplanıyor → place_id buradan türetilir. Demo modda temsilî değer + "demo" rozeti.

**Efor:** istemci ~yarım gün · backend ucu sunucu ekibinde. **Bağımlılık:** ProX proxy ucu (yayın öncesi).

---

## 5) Push / SMS Bildirim Kanalı  `[öncelik: DÜŞÜK (altyapı) · efor: BÜYÜK]`

**Mevcut durum:** Tek kanal e-posta. Fiyat alarmı + kayıtlı arama bildirimleri e-postayla sınırlı.

**Hedef kapsam:**
- **Web Push:** Service Worker + Push API; izin akışı (fiyat alarmı kurarken sorulur, sayfa açılışında ASLA); abonelik `POST /api/v1/tenant/push-subscribe`
- **SMS:** yalnız kritik olaylar (randevu onayı, Özel Portföy eşleşmesi); sağlayıcı (ör. İleti Merkezi/Twilio) proxy arkasında; KVKK açık rıza + ticari ileti (İYS) kaydı ZORUNLU
- Bildirim tercih merkezi (üye paneli): kanal × olay tipi matrisi

**Mimari uyum:** Service Worker eklemek cache stratejisiyle çakışmamalı (HTML no-cache kuralı korunur; SW yalnız push için, fetch handler'sız başlar). SMS tarafı tamamen sunucu işi. Demo modda: tarayıcı-içi bildirim simülasyonu.

**Efor:** Web Push ~2 gün (istemci+SW) + backend · SMS ayrı iş paketi. **Bağımlılık:** §1 ve §3 (bildirilecek olaylar), İYS/KVKK süreci.

---

## Önerilen Sıra (faz planı)

| Faz | İş | Neden |
|---|---|---|
| 1 | **§2 Karşılaştırma** | Motor hazır, yarım gün, anında görünür değer |
| 1 | **§1 Kayıtlı Arama (istemci)** | Yüksek tutundurma; demo'da backend'siz çalışır |
| 2 | **§3 Hesap-senkron Favoriler** | Üyelik değerini artırır; §1 ile aynı üye paneline oturur |
| 2 | **§4 Google Puan** | Küçük istemci işi; proxy ucu sunucu takvimine bağlı |
| 3 | **§5 Push/SMS** | Altyapı + hukuki süreç; §1/§3 olay üreticileri hazır olunca |

## Ek: Denetimden kalan küçük backlog (öneri-dışı, hatırlatma)
- i18n: prox-asistan sayfa sözlüğü yok; 'Satılanlar Arşivi' bazı alt etiketler; hreflang site geneli eksik
- Perf: base.css 249KB monolit (sayfa-başı kritik CSS ayrıştırma — büyük iş); font preload
- SEO: JSON-LD @id taban tutarlılığı (3 farklı taban → tek taban normalize); meta description uzunlukları; overlay sayfalar için statik eşlenik sayfa stratejisi
- Güvenlik: importData şema doğrulaması (admin-içi); esc() tek-tırnak tutarlılığı
