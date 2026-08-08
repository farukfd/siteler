# ProX API — İl/İlçe/Mahalle Liste Ucu Gereksinimi (SUNUCU EKİBİNE)

> **Durum:** İstemci (gayrimenkul.html white-label motoru) bu ucu ÇAĞIRIYOR ama uç şu an **404** dönüyor. Sunucu tarafında bu endpoint eklenince site otomatik gerçek veriye geçecek — istemcide ek değişiklik gerekmez.

## Sorun
ProX API bugün **isim → veri** yönünde çalışıyor:
- `GET /api/v1/tenant/endeks?il=X&ilce=Y&mahalle=Z` → o bölgenin **gerçek m²/skor/trend** verisi ✅

Ama **ters yön yok**: "X ilinde hangi ilçeler var?", "Y ilçesinde hangi mahalleler var?" sorulamıyor. Denenen tüm liste uçları 404:
`locations`, `iller`, `ilceler`, `mahalleler`, `endeks/ilceler`, `il/{il}/ilce`, `endeks?...&liste=ilce` (parametre yok sayılıyor) …

`bootstrap.enabled_features` içindeki `"locations"` bir **yetki bayrağı**, veri ucu değil.

Bu liste olmadan: white-label site dropdown'ları (il→ilçe→mahalle), Özel Portföy'ün gerçek mahalle/cadde portföyleri ve Neden-Biz bölge kartları **gerçek mahalle adı** alamıyor.

## İstenen Uç(lar)

### 1) İl bazında ilçe + mahalle ağacı (ÖNCELİKLİ)
```
GET /api/v1/tenant/locations?il={il}
Header: X-Tenant-Id, X-Tenant-Key   (mevcut auth ile aynı)
```
**Başarılı yanıt (200):**
```json
{
  "success": true,
  "il": "Trabzon",
  "ilceler": {
    "Ortahisar": ["Gürbulak", "Çukurçayır", "Pelitli", "Yalıncak", "..."],
    "Akçaabat":  ["Erikli", "Karaman", "Uğurlu", "..."],
    "...": ["..."]
  }
}
```
- Anahtar: **`ilceler`** (obje). Anahtar = ilçe adı, değer = mahalle adı dizisi.
- İsimler **Title Case** ve **`Mah.` eki OLMADAN** olmalı (ör. `Çukurçayır`, `19 Mayıs`). İstemci yine de savunma amaçlı ` Mah.` ekini temizliyor.
- Türkçe imla doğru (ı/İ) — `Kadıköy`, `Ağrı`, `Adıyaman`.
- İstemcinin kabul ettiği alternatif anahtarlar (esneklik için birini kullanın): `ilceler` | `data` | `locations`.

### 2) İl listesi (opsiyonel — istemci şu an 81 ili gömülü tutuyor, fallback)
```
GET /api/v1/tenant/locations
→ { "success": true, "iller": [ {"ad":"Trabzon","plaka":61}, ... ] }   // 81 il
```

## İstemci tarafı (hazır)
`gayrimenkul.html` içinde:
```js
async function loadMahalle(il){
  var r = await proxApi('/api/v1/tenant/locations?il='+encodeURIComponent(il));
  if (r && r.success===true) { return r.ilceler || r.data || r.locations; } // {ilce:[mahalle]}
  return null; // 404 → jeneratör fallback (Cumhuriyet/Atatürk/Merkez...)
}
```
Uç canlıya geçince: `enrichProvinceMahalle()` PROVINCE.districts[*].mah'ı gerçek mahalleyle doldurur; `rebuildOzelFromProx()` gerçek mahalle + gerçek ProX fiyatı kullanır. **İstemcide değişiklik gerekmez.**

## Veri kaynağı önerisi (sunucu)
NVI/TÜİK resmî idari birim verisi (81 il / ~1.010 ilçe / ~32.000 mahalle). Açık, doğru-imlalı bir set: `github.com/bertugfahriozer/il_ilce_mahalle` (bu projede referans olarak doğrulandı — 81 il tam, 0 Unicode kusuru). Sunucu bunu bir kez içe alıp yukarıdaki uçtan sunabilir; fiyatlar zaten `endeks` ucundan geliyor.

## Neden tek kaynak (önemli)
İl/ilçe/mahalle İKİ kaynaktan (istemcide gömülü + API) gelirse **isim/yapı çakışması** olur (ör. API ilçeyi farklı adlandırırsa eşleşme bozulur). Bu yüzden **tek yetkili kaynak API** olmalı; istemcideki `TR_ILILCE` yalnızca uç 404 iken **bootstrap/fallback** iskeletidir.

## Öncelik
**Yüksek** — white-label ürünün "il il satış" değer önermesinin (gerçek yerel veri) çekirdeği. Uç eklenince tüm iller için gerçek mahalle otomatik gelir.

---

## 🆕 DÖVİZ KURU UCU — Frontend hazır, backend bağlanacak (SUNUCU AJANI NOTU)

Frontend'e **çoklu para birimi (₺ · $ · €)** eklendi. Fiyat gösterimi `window.gmMoney()` ile `GM_CUR` para birimine göre dönüştürülür; kur oranları `GM_RATES` global'inden gelir. Şu an **fallback yaklaşık kur** kullanılıyor (`gayrimenkul/js/app.js` içinde `GM_RATES` varsayılanı, "≈ yaklaşık" notuyla). Frontend başlangıçta `proxLoadRates()` çağırır → aşağıdaki ucu bekler:

**Gerekli uç:** `GET /api/v1/tenant/rates`
- Auth: mevcut proxy/tenant başlıklarıyla (X-Tenant-Id; anahtar edge'de).
- Dönüş (JSON): `{ "success": true, "rates": { "USD": <1$ = ? ₺>, "EUR": <1€ = ? ₺>, "GBP": <opsiyonel> }, "updatedAt": "<ISO>" }`
  - `rates.USD/EUR` = **1 birim dövizin ₺ karşılığı** (ör. USD: 41.25). TRY her zaman 1.
  - Kaynak: TCMB efektif satış veya kurum politikası; günde en az 1 kez güncellenmesi yeterli, frontend cache'ler.
- 404/fallback dönerse frontend `GM_RATES` fallback ile çalışmaya devam eder (kırılmaz).

**Yapılacak (backend):** Bu ucu ProX/edge'de yayına al; TCMB veya sağlayıcı kurundan `rates` doldur. Frontend tarafında değişiklik gerekmez — uç yayınlanınca `proxLoadRates()` otomatik günceller.

---

## 🆕 KAPANAN İŞLEMLER UCU (Satılan / Kiralanan Arşivi) — Frontend hazır, backend bağlanacak (SUNUCU AJANI NOTU)

Ana sayfaya **"Kapanan İşlemler" (Track Record)** bölümü eklendi (`index.html#arsiv`): tamamlanan satış/kiralamaların tipi, süresi ve liste fiyatına yakınlığı. Şu an **temsilî demo veri** (`DEF_ARSIV`, `gayrimenkul/js/app.js`) gösteriliyor. Frontend başlangıçta `proxLoadArsiv()` çağırır → aşağıdaki ucu bekler:

**Gerekli uç:** `GET /api/v1/tenant/closed-deals?limit=24`
- Auth: mevcut proxy/tenant başlıklarıyla (X-Tenant-Id; anahtar edge'de).
- Dönüş (JSON): `{ "success": true, "data": [ { ... }, ... ] }` — her kayıt:
  - `op`: "Satılık" | "Kiralık"
  - `tip`: kategori (Daire, Villa, İşyeri, Ofis, Arsa…)
  - `ilce`, `mah`: konum (adres/kapı no **verilmez** — gizlilik)
  - `m2`: sayısal, `oda`: "3+1" vb. (yoksa "-")
  - `liste`: ilan çıkış fiyatı (₺; kiralıkta aylık) · `satis`: kapanış fiyatı (₺; kiralıkta aylık)
  - `gun`: portföyde kalma süresi (gün) · `tarih`: "YYYY-MM"
- Alan adı esnekliği: frontend `liste/listeFiyat`, `satis/satisFiyat/fiyat`, `mah/mahalle`, `gun/gunSayisi`, `tarih/ay` alternatiflerini de okur (`proxLoadArsiv` mapper).
- 404/fallback dönerse frontend demo/`DEF_ARSIV` ile çalışmaya devam eder (kırılmaz).

**Gizlilik/dürüstlük:** Kayıtlar **anonim** olmalı (mahalle+tip+m² görünür; adres/müşteri adı **yok**). Fiyatlar ₺ döner; frontend `gmMoney()` ile seçili para birimine (₺/$/€) çevirir. Rakamların gerçek/doğrulanabilir olması şart — [[eids-gercek]] ilkesi: uydurma kapanış rakamı yayınlanmaz.

**Yapılacak (backend):** Bu ucu ProX/edge'de yayına al; CRM'deki kapanmış (satıldı/kiralandı) kayıtlardan anonimleştirilmiş özet döndür. Frontend tarafında değişiklik gerekmez — uç yayınlanınca `proxLoadArsiv()` otomatik günceller.

---

## 🆕 KAYITLI ARAMA UCU (Saved Search) — Frontend hazır, backend OPSİYONEL (SUNUCU AJANI NOTU)

Hero "Komuta Konsolu"na **Kayıtlı Arama** eklendi (`index.html` `#pc_saved` + `hero-pusula.js` `pcSaveSearch/pcApplySaved/pcDelSaved`). Kullanıcı amaç/bütçe/bölge/öncelik kriterlerini **🔖 Aramayı kaydet** ile saklar; kayıtlar **localStorage** (`gm_saved_search`) içinde tutulur, her chip canlı eşleşme sayısını gösterir. **Bu haliyle backend'siz tam çalışır** — internet/ProX gerekmez.

**Opsiyonel backend (değer katan, şart değil):**
1. **Cihazlar-arası eşitleme** — giriş yapmış kullanıcının kayıtlı aramaları hesabına bağlanır:
   - `POST /api/v1/tenant/saved-search` body `{ amac, butce, bolge, oncelik, tip }` → `{success, id}`
   - `GET /api/v1/tenant/saved-search` → `{success, data:[...]}`
   - `DELETE /api/v1/tenant/saved-search/{id}`
   - Frontend'de `proxSaveSearch(s)` kancası zaten çağrılıyor (şu an tanımsız → sessiz geçilir). Uç gelince bu fonksiyon tanımlanıp localStorage ile senkron edilir.
2. **Yeni-ilan bildirimi** — kayıtlı kritere uyan yeni portföy girildiğinde e-posta/WhatsApp/push. Tamamen backend işi (cron + eşleşme + KVKK açık rıza). Frontend chip'teki sayı yalnızca **anlık** eşleşmedir.

**Öncelik:** Orta — çekirdek özellik yerelde çalışıyor; backend yalnızca çok-cihaz + proaktif bildirim için gerekir.

---

## 🆕 HARİTADAN KEŞFET — yeni uç GEREKMEZ, opsiyonel geocoding (SUNUCU AJANI NOTU)

Ana sayfaya **Haritadan Keşfet** (`index.html#harita`) eklendi: İzmir ilçe SVG haritası, pin başına canlı portföy sayısı. **Sayılar mevcut `ILANLAR`/`OZEL` verisinden (ProX pipeline) istemcide toplanır — yeni uç gerekmez.** Pin → ilçe paneli (satılık/kiralık/özel + 2 örnek ilan) → CTA `#ilanlar`'ı o ilçeye filtreler (`hmapGo` → `#fIlce`+`advFilt`).

**Konum:** Kullanıcı kararı = **ilçe-merkez YAKLAŞIK pin** (geocode YOK; tam adres mahremiyet gereği gizli). Pin koordinatları `IZ_DISTRICTS` (app.js) içinde stilize/elle yerleşimdir — coğrafi-tam değil, temsilîdir.

**Opsiyonel backend geliştirmesi (şart değil):** İlan bazında gerçek lat/lng dönerse (`ILANLAR[].lat/lng`) ileride gerçek slippy-map (Leaflet/MapLibre) + kümeleme (clustering) yapılabilir. O zaman bile **kapı no/tam adres paylaşılmamalı** — yalnızca yaklaşık/ofuskatlı konum (ör. mahalle merkezi + jitter). Şimdilik gerek yok; SVG ilçe haritası self-contained çalışır.

---

## ⚠️ GÜNCELLEME — FİYATLAR YALNIZCA ₺ + DÖVİZ/ALTIN BANDI (SUNUCU AJANI NOTU)

**Önceki "çoklu para birimi" (₺/$/€ fiyat dönüştürme) KALDIRILDI.** Sebep: gayrimenkul ilan fiyatları Türkiye'de **TL ile gösterilmek zorundadır (yasal)**. Site içinde fiyat asla dövize çevrilmez; `gmMoney()` her zaman ₺ döner.

Döviz ($/€/£) ve **altın** kurları artık YALNIZCA **bilgi amaçlı kayan bant** (`shared/doviz.js`, `.doviz-bandi` — header altında; index/ilanlar/harita) olarak gösterilir. Fiyat dönüştürme YOK.

**Gerekli uç (güncellenmiş):** `GET /api/v1/tenant/rates`
- Dönüş: `{ "success": true, "rates": { "USD": <₺>, "EUR": <₺>, "GBP": <₺>, "gram_altin": <₺>, "ceyrek_altin": <₺> }, "updatedAt": "<ISO/kısa>", "change": { "USD": +0.42, "EUR": -0.13, ... } }`
  - Tüm değerler **1 birimin ₺ karşılığı** (USD/EUR/GBP kur; gram_altin/ceyrek_altin ₺ fiyat).
  - `change` opsiyonel: günlük yüzde değişim (bant ▲/▼ gösterir). Yoksa oksuz gösterilir.
  - Kaynak: TCMB + serbest piyasa/kuyumcu verisi (kapalıçarşı gram/çeyrek). Günde birkaç kez güncelleme yeterli.
- 404/fallback → bant yaklaşık değerlerle + "Serbest piyasa · bilgi amaçlıdır" notuyla çalışır (kırılmaz).
- **İstemcide değişiklik gerekmez** — uç yayına girince `shared/doviz.js` otomatik günceller.

---

## 🆕 BLOG / HABER — ProX API ile içerik (SUNUCU AJANI NOTU)

Blog ana sayfası (`index.html#blog`) ve **haber detay sayfası** emlakekspertizi.com/blog tarzında kuruldu: **Günün Manşeti** (20 haber carousel) + filtre sekmeleri + kategori + **görselli** haber ızgarası; detayda **HIZLI BAKIŞ** istatistik kutusu + **ilçe sıralaması** + **CANLI VERİ (ProX)** bandı + yapılandırılmış gövde. Şu an **20 örnek/demo haber** üretici (`_genBlogSamples`, `gayrimenkul/js/app.js`) besliyor; **canlıda ProX'ten gelecek**. Altyapı hazır (`proxBlogFeed` çağrılıyor).

**Gerekli uçlar:**
1. `GET /api/v1/tenant/blog/feed?limit=40` → `{ success:true, posts:[ {…} ] }` — her haber:
   - `id`, `title`, `cat` (kategori), `sum` (özet), `body` (Markdown; `## ` başlıklar desteklenir), `date` (ISO/kısa), `author`
   - `cover` (kapak görsel URL — **zorunlu**; GÖRSELSİZ haberler istemcide filtrelenir/gösterilmez)
   - `stats` (şehir/ilçe piyasa haberleri için): `{ sehir, m2, kira, min, max, yil, ay, yas, ilceler:[[ad,m2],…] }` → detayda HIZLI BAKIŞ + ilçe sıralaması bundan render edilir.
   - İstemci alan-adı esnek okur (`summary/ozet`, `content/icerik`, `image/img` vb. — `proxBlogFeed` mapper).
2. `GET /api/v1/tenant/blog/post/{id}` (opsiyonel) — tek haber tam gövde + stats (liste feed özet dönerse).
3. **CANLI VERİ grafiği** (detaydaki 12 aylık m² seyri + 3 ay projeksiyon + bölge karşılaştırması): mevcut **endeks uçlarından** beslenir (`/api/v1/tenant/endeks`, `/prox/analyze`). Şu an detayda "ProX API bağlanınca burada görüntülenir" bandı var; canlı grafik komponenti uç gelince bu alana bağlanacak.

**Not:** 404/fallback → istemci demo/örnek 20 haberle çalışır (kırılmaz). Görseller için **ücretsiz stok** (Unsplash/Pexels) veya tenant yüklemesi; istemci `cover` URL'ini olduğu gibi kullanır. Öncelik: **Orta-Yüksek** — SEO/AEO ve içerik tazeliği için değerli.

## Google Puan Ucu (canlı rozet — gayrimenkul referans bölümü)
`GET /api/v1/tenant/google-rating` → `{ "rating": 4.8, "count": 214, "url": "https://maps.google.com/..." }`
- Sunucu, kiracının Google Business Profile verisini **Places API ile günde 1-2 kez** çeker ve önbellekler (anahtar istemciye inmez).
- place_id, kurulum sihirbazı 1. adımda toplanan "Mevcut web / Google işletme URL" (`wl_brandUrl` → tenant kaydı) alanından türetilir.
- İstemci 6 saat localStorage önbelleği kullanır; uç yoksa temsilî 4,9 · "demo" rozetiyle düşer (gmGoogleRating, js/app.js).
