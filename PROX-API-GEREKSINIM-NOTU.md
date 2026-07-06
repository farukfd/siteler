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
