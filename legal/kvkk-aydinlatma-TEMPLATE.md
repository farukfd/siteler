# KVKK Tenant-Başı TASLAK Şablonu (#11–#14)

> **DURUM:** HUKUKÇU ONAYI GEREKİR — bu bir taslak iskelettir, hukuki metin değildir.
> Her tenant KENDİ veri sorumlusudur (#11); `{{...}}` alanları onboarding'de doldurulur.

## 0) Veri sorumlusu ↔ veri işleyen ayrımı (#11) — sözleşmeyle netleşir
- **Veri sorumlusu:** `{{TENANT_UNVAN}}` (müşteri emlak işletmesi; ziyaretçi verisinin sorumlusu).
- **Veri işleyen / altyapı sağlayıcı:** NADAS / EmlakEkspertizi.com (veriyi tenant adına, sözleşme sınırında barındırır/işler). Rol (işleyen / ortak sorumlu) **sözleşmede** tanımlanır.
- Meridyen/başka tenant metni BAŞKA alan adına TAŞINMAZ; her tenant kendi metnini üretir.

## 1) AYDINLATMA METNİ (rızaya bağlı DEĞİL) (#12)
> Aydınlatma yükümlülüğü onaydan bağımsızdır; forma "onaylıyorum" kutusu OLARAK KOYULMAZ.

`{{TENANT_UNVAN}}` (“Şirket”), 6698 sayılı KVKK kapsamında veri sorumlusudur.
- **İşlenen veriler:** ad-soyad, telefon, e-posta, talep içeriği; (gerekiyorsa) taşınmaz bilgisi. **TCKN yalnızca zorunlu hâlde**, alan-düzeyi şifreli, tam gösterilmeden (#10).
- **Amaç & hukuki sebep:** talebin karşılanması → **sözleşmenin kurulması/ifası** (m.5/2-c) veya **meşru menfaat** (m.5/2-f). *(Bu sebeplerde ayrıca açık rıza ALINMAZ.)*
- **Aktarım:** hizmet altyapısı (veri işleyen NADAS), zorunlu hâlde yetkili kurumlar; **yurt dışı aktarım** yalnız KVKK m.9 şartlarıyla.
- **Saklama:** amaç sona erince silme/anonimleştirme; süresi biten talepler otomatik temizlenir (#13).
- **Haklar (m.11):** bilgi/erişim/düzeltme/silme/itiraz → `{{BASVURU_KANALI}}` (KVKK başvuru formu).

## 2) AÇIK RIZA — YALNIZCA pazarlama (ayrı, isteğe bağlı, ön-işaretsiz) (#12)
> Form gönderiminin ŞARTI DEĞİL; boş bırakılırsa da talep karşılanır; geri alınabilir (İYS).
- ☐ `{{TENANT_MARKA}}`’dan kampanya/tanıtım amaçlı **ticari elektronik ileti** almak istiyorum. *(ön-işaretli DEĞİL)*

## 3) ÇEREZ RIZA YÖNETİMİ (#14)
- Kategoriler: **zorunlu** (rızasız), işlevsel, analitik, pazarlama, üçüncü-taraf medya.
- Rıza öncesi Google Analytics / Meta Pixel / reklam / yeniden-pazarlama **ÇALIŞMAZ**.
- Eşit görünürlükte: **Tümünü kabul · Tümünü reddet · Tercihleri yönet**.
- Rıza kaydı (`consents` tablosu): tenant · politika sürümü · tarih · kategoriler · anonim id.

## 4) VERİ İŞLEME ENVANTERİ (#13) — her veri türü için doldurulur
| Kategori | Amaç | Hukuki sebep | Erişen roller | Saklama | Silme yöntemi | 3. taraf | Yurt dışı |
|---|---|---|---|---|---|---|---|
| İletişim/lead | talep yanıtı | sözleşme/meşru menfaat | Owner, Consultant | {{X ay}} | anonimleştir | NADAS (işleyen) | Hayır |
| Değerleme talebi | ön analiz | meşru menfaat | Owner | {{X ay}} | sil | — | — |
| Portföy sahibi | ilan/aracılık | sözleşme | Owner, Consultant | sözleşme süresi+yasal | sil/arşiv | — | — |
| AI prompt/yanıt | içerik üretimi | meşru menfaat | Owner | kısa | sil (PII maskeli) | model sağlayıcı | sağlayıcıya bağlı |

Tenant kapanışında (#13): yasal-saklama zorunlu veriler ayrılır, kalan kontrollü silinir, yedek silme takvimi uygulanır, müşteriye silme raporu verilir.
