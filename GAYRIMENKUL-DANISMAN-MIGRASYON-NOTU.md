# Gayrimenkul → Danışman Sitesi · Tam Yapım Envanteri & Taşıma Planı

> **Amaç:** `gayrimenkul/` sitesinde bu güne kadar yapılan **TÜM** çalışmaları (ProX logo, EİDS sistemi, DeepSeek/aiChat, üyelik + ProX Asistan + tam kayıt, white-label motoru, admin paneli, kurumsal sayfalar, derin denetim düzeltmeleri) eksiksiz kayıt altına almak ve `danisman/` (Selin Meridyen · Lüks Konut Danışmanı) sitesine sistematik olarak taşımak.
>
> **Durum:** Gayrimenkul tarafı tamam ve commit'li (`cc10177`). Danışman tarafı taşımayı bekliyor.
> **Kaynak referans belleği:** `[[gayrimenkul-saas-mimari]] [[gayrimenkul-denetim-remediation]] [[gayrimenkul-deepseek-prox-anahtar]] [[gayrimenkul-uyelik-asistan]] [[gayrimenkul-white-label-il-motoru]] [[gayrimenkul-eids-entegrasyon]] [[prox-api-emlakekspertizi]]`

---

## 0. İKİ SİTE — HIZLI KARŞILAŞTIRMA

| | **gayrimenkul/** (kaynak) | **danisman/** (hedef) |
|---|---|---|
| Marka modeli | Kurumsal ajans "Meridyen Gayrimenkul" | Tek lüks danışman "Selin Meridyen" |
| Tema | Kurumsal mavi (`--accent:#1e40af`) | Altın/şampanya lüks (`btn-gold`, Playfair/Cormorant/Jost) |
| Mimari | İnce kabuk + `js/app.js` (484KB) + **5 modül** | **Tek dosya** `js/app.js` (100KB, 146 fn) — modülsüz |
| Ana config anahtarı | `meridyenGM_v1` (monolitik) | `SAAS_CONFIG` nesnesi + `dn_*` anahtarları |
| Anahtar öneki | `gm_*`, `wl_*` | `dn_*` |
| Özel Portföy adı | **OZEL** ("Özel Portföy") | **VIP** ("davet usulü VIP portföy") |
| Admin şifresi | `1234` | **`ekspertiz2026`** (`_ADMIN_PASS`) |
| tenant | `office` / `prox_office_…` | `meridyen-danisman` |
| Ortak dosyalar | `../tr-grammar.js`, `../tr-iller.js`, `../wl.js` | `../tr-grammar.js`, `../tr-iller.js` (wl.js YOK) |

**Kritik:** Danışman bağımsız, KENDİ app.js'ini kullanır. Taşıma = gayrimenkul özelliklerini danışmanın kod tabanına **uyarlamak** (kopyala-yapıştır değil — isim/tema/model farkları var).

---

## 1. GAYRİMENKUL — TAM YAPIM ENVANTERİ (kaynak)

### 1.1 Modül yükleme sırası + sürümler (`gayrimenkul/index.html`)
```
CSS:  ../themes/gayrimenkul/meridyen.css?v=2  →  css/base.css?v=18
JS:   ../tr-grammar.js?v=4   (Türkçe gramer + TRG.region 81-il bölge)
      js/app.js?v=22         (SPA ana motoru + aiChat/DeepSeek + denetim düzeltmeleri)
      js/hero-pusula.js?v=2  (Mülk Pusulası hero widget)
      js/mahalle-endeks.js?v=8   (canlı ProX mahalle endeksi + pasta grafik)
      js/kurumsal-sayfalar.js?v=4 (iletişim/danışman/değerleme/KVKK + Leaflet harita seçici)
      js/uyelik-asistan.js?v=12   (üyelik + tam-ekran ProX Asistan + admin görüşme panosu)
      js/seo-chrome.js?v=3   (statik sayfalar için üyelik rozeti + WhatsApp yaması)
```

### 1.2 localStorage anahtarları
| Anahtar | İçerik |
|---|---|
| `meridyenGM_v1` | ANA CONFIG (FIRMA, ILANLAR, DANISMANLAR, KISILER, DEALS, TASKS, CONTRACTS, RENTS, MSGLOG, RAPORLOG, ACT, OZEL, LEADS, THEME, CONTENT, BLOGS, REFS, SEO, GOOGLE, PROX, AICFG, P3) |
| `gm_users_v1` | Üye hesapları (SHA-256 + salt) |
| `gm_session_v1` | Aktif oturum |
| `prox_asistan_gm_convos_v1` | ProX Asistan + FAB tam konuşma dökümleri (id,title,msgs[],ts,user,email,lead,phone,src) |
| `gm_fav_guest`, `gm_fav_<email>`, `gm_quotes_<email>` | Favoriler + teklifler |
| `wl_service_area`, `wl_bolge`, `wl_ozel_ts`, `wl_lang`, `wl_i18n_<lang>` | White-label veri paketleri |
| `wl_ab`, `wl_analytics`, `wl_super_tenants`, `wl_brand_applied`, `wl_onboarded` | A/B, analitik, bayi, onboarding |
| `prox_quota`, `emlak_leads_fallback`, `cookieChoice` | Kota, offline lead, çerez |

### 1.3 Global veri modeli + DEF_ varsayılanları
`FIRMA·ILANLAR·DANISMANLAR·LEADS·THEME·CONTENT·BLOGS·REFS·SEO·GOOGLE·PROX·AICFG·P3·KISILER·DEALS·TASKS·COMMS·RENTS·MSGLOG·RAPORLOG·ACT·CONTRACTS·OZEL` + `PROVINCE·BAZ·MAH·SERVICE_AREA`.
- `DEF_FIRMA` → name/tel/mail/wa/adres/hours/vergi/yetkili/kurulus/mersis/ticaretSicil/oda/kep/vergiDaire/calisan/lat/lng/**eids{}**
- `DEF_AICFG` → `{enable,greet,persona,dsKey:'',dsModel:'deepseek-chat'}` ← **DeepSeek alanları**

### 1.4 Admin paneli (27 pane, `.adm-nav[data-p]`)
Giriş: `openAdmin()` → şifre **1234**. Pane'ler: genel·kisiler·eslestirme·pipeline·randevu·komisyon·kira·contracts·iletisim2·raporlar🔒·leadler·ilanlar·ozel·portfoy3d🔒·danismanlar·bolge·hizmetalani·icerik·**ai**·rapor·**prox**·seo🔒·google🔒·firma·tema🔒·yedek. (`🔒` = paket kilidi)
- Doldur/kaydet: `fill*/save*` (fillFirma/saveFirma, fillProx/saveProx, fillAiCfg/saveAiCfg, fillSeo/fillGoogle/fillContent…)
- `exportData/importData` (24 dilim paritesi), `resetData` (wl_* temizler), `superPreview`/`superPreviewExit` (bayi önizleme snapshot)

### 1.5 ProX API (veri katmanı)
`proxApi(path,{method,body,headers})` → `EMLAK_API_BASE` (emlakekspertizi.com), `X-Tenant-Id/X-Tenant-Key`. Uçlar: `/tenant/bootstrap`, `/tenant/endeks?il=&ilce=&mahalle=`, `/tenant/prox/analyze` (POST), `/tenant/prox/ai` (POST), `/tenant/lead`, `/tenant/blog/feed`. `applyProxTenant()` proxy-mode'da anahtarı bellekten siler (C4). `proxSubmitLead`, `emlak_leads_fallback` offline.

### 1.6 DeepSeek entegrasyonu (BU OTURUM — YENİ)
- `aiChat(body,opts)` (app.js, `window.aiChat`): `AICFG.dsKey` varsa `_deepseekChat`→`https://api.deepseek.com/chat/completions` (Bearer, `_dsMessages` sistem/geçmiş/kullanıcı, 45sn timeout); hata/anahtar yoksa `proxApi('/prox/ai')`'ye düşer.
- Admin: "Site AI Asistanı" panosunda `ai_dskey` (password) + `ai_dsmodel` (deepseek-chat/reasoner) + `aiDsTest()` (401/402/429 ayrımı) + `aiDsStatus()`.
- **TÜM YZ üretimi buradan geçer:** bölge/kurumsal/blog/rapor/çeviri/fab-asistan/quote-oto-yanıt/asistan-sohbet.

### 1.7 EİDS sistemi
`FIRMA.eids{yetkili,connected,belgeNo,unvan,firmaKod,kullaniciKodu}` + `ILANLAR[].eids{status,kod,tasinmazNo,ada,parsel,bagimsiz,cins,malikTip,yetkiBitis,tarih}`. Fonksiyonlar: `eidsEnsure`(migration), `eidsVerify`(7 haneli belge + connected kapısı), `eidsGuid/eidsKod/eidsTasinmazNo/eidsCins/eidsDemoRec`, `eidsQrSvg`, `eidsSorgu`(public modal), `eidsShieldSvg`. **Yayın kapısı:** `saveIlan` EİDS yetkisi ister; Özel Portföy serbest.

### 1.8 ProX logosu — KURUMSAL KİMLİK ALTIN KURALI
`.prox-logo{font-weight:800;display:inline-flex}` + `.prox-x{background:#19c37d;color:#04140c;border-radius:6px;padding:.02em .28em;margin-left:2px}` (Google yeşili #34a853 DEĞİL, ProX yeşili **#19c37d**). Kullanım: üst menü "Pro**X** Asistan" (`.nav-asistan`), footer "Powered by ProX" (`.gm-prox`/`.gm-prox-x`), asistan başlıkları. Statik sayfalarda `<style id="gsc-static">` ile birebir.

### 1.9 White-label motoru
`PROVINCE=makeProvince(il)` (IZMIR_PROVINCE ŞABLON → **klon** dağıtır, C2), `applyProvince(il)`, `SERVICE_AREA` (çok-illi, `wl_service_area`, `sa*` fonksiyonları), `rebuildBAZ/MAH`, `rebuildOzelFromProx` (admin OZEL korur, C3), `wlBuildBolge`. Yerelleştirme: `brandSweep`, `wlCity`, **`TRG` (tr-grammar.js)** — `city/districts/region/localize` (Ege→hedef bölge H9), `tr-iller.js` (81 il TR_ILILCE).

### 1.10 Üyelik + ProX Asistan + tam kayıt (uyelik-asistan.js)
- Auth: SHA-256+salt, `gm_users_v1`/`gm_session_v1`, `authRegister/Login`, `_authSetSession`.
- Favoriler: `gmFav/gmIsFav/gmFavReflect` (misafir+üye merge).
- Tam-ekran ProX Asistan: `openProxAsistanPage` (#proxAsistanPage), `_paMsgs/_paConvos`, PA_SYS satış promptu, `aiChat` ile, telefon→`proxSubmitLead`+lead, kayıt `prox_asistan_gm_convos_v1`.
- **Admin görüşme panosu:** `renderGorusmeler` + `uasInjectAdminPane` (💬 Görüşmeler & Teklifler): ProX görüşmeleri (tam döküm) + geri-arama + teklifler + üyeler.
- **FAB balonu kaydı:** app.js `_fabLog(who,text)` → aynı PA_STORE'a `src:'fab'` + telefon→lead (BU OTURUM).

### 1.11 Kayıt/CRM
`pushLead` (→ admin "Gelen Talepler" LEADS) + `proxSubmitLead` (ProX CRM). İletişim (kurumsal `infoContactSubmit`) İKİSİNİ de çağırır → mesaj tam kayıtlı. `renderLeads/renderRecentLeads/renderKpis`.

### 1.12 Overlay yönlendirme + nav/footer tek-kaynak
`_OV{analiz,ilanlar,ozel,sat,blog,hakkimizda}` + kurumsal-sayfalar `_OV`'ye iletisim/danismanlar/degerleme/referans/alarm/kvkk/cerez/mesafeli EKLER (parse anında, M8). `goView/goHome/ovRoute/ovBoot`, `_OV_HM` hash map. `SITE_NAV/SITE_CTA/SITE_FOOTER + mountSiteChrome/mountSaaSMenu`.

### 1.13 Tema
`THEMES[6]` (mavi/okyanus/zümrüt/safir/bordo/antrasit), `setTheme(accent,green,navy)` (7 CSS var + null guard), `applyTheme`, `initSaaSTheme`. Statik sayfalar `wl.js`'ten tema enjekte (H10).

### 1.14 Diğer büyük modüller
- **Mülk Pusulası** (hero-pusula.js): amaç/bütçe/bölge → pusula iğnesi + eşleşme.
- **Mahalle Endeksi** (mahalle-endeks.js): 5-kategori canlı ProX + pasta grafik + Özel Portföy vitrin (H6 `data-gen`).
- **Kurumsal sayfalar** (kurumsal-sayfalar.js): #infoPage router (iletisim/danismanlar/degerleme/referans/alarm/kvkk/cerez/mesafeli) + **Leaflet harita seçici** (SRI'li, M7) + Nominatim (r.ok+debounce, M6).
- **Blog**: BLOGS[] + blogOpen + ProX/DeepSeek AI makale.
- **Hakkımızda**: hakkimizdaOpen/hkRender (yasal künye + ekip + iletişim).
- **3D/Rapor Stüdyosu**: portfoy3d🔒 + rapor.

### 1.15 Derin denetim düzeltmeleri (BU OTURUM — koda bulgu-ID yorumlu)
- **C1** XSS (`_le/_be` escape tüm render), **C2** province klon, **C3** OZEL merge, **C4** anahtar temizleme+rotate notu.
- **P1**: loadAll merge · saveAll kota uyarısı · superPreview snapshot · değerleme mah/tip guard.
- **P2**: mükerrer canonical · İzmir-bölge fallback · Ege→bölge · statik tema+i18n · gen-özel · deep-link · WhatsApp tel: fallback.
- **P3**: hero interval singleton · ölü mükerrer fn · export/import paritesi · reset wl_* · null guard · Leaflet SRI · setTheme guard.

---

## 2. DANIŞMAN SİTESİ — MEVCUT DURUM (hedef)

**Kimlik:** "Selin Meridyen · Lüks Konut & Özel Portföy Danışmanı" — butik/lüks tek danışman. tenant `meridyen-danisman`.
**Dosyalar:** `index.html`(250) + `hakkimizda.html`(429) + `sss.html`(503) + `js/app.js`(787 satır/100KB/146 fn) + `css/base.css`(29KB). Ortak: `../tr-grammar.js`, `../tr-iller.js`.
**Config modeli:** `SAAS_CONFIG` nesnesi (`.firma`, `.tenantSettings`), `dn_*` anahtarları. Admin şifre **`ekspertiz2026`**.

**ZATEN VAR (taşımaya gerek yok, gerekirse hizala):**
- ✅ **ProX API** (`proxApi` inline, proxy-mode C4-hardened, `dn_quota`)
- ✅ **EİDS** (eidsFirma/eidsVerify/eidsCanPublish/eidsConnect/eidsSave/eidsBadgeHTML/eidsRenderPublic/Admin, `#eidsPublicBadge`)
- ✅ **White-label** (SERVICE_AREA + `sa*`, makeProvince/applyProvince/rebuildBAZ, `dn_service_area`)
- ✅ **VIP portföy** (= Özel Portföy: rebuildVipFromProx/vipCardsHTML, VIP_TIPS yalı/villa/penthouse/rezidans, `dn_vip_ts`)
- ✅ **Admin SaaS** (openAdminGate/adminLogin→openSaasAdmin, sta-tabs: Marka/SEO/ProX AI/EİDS/Hizmet Alanı/Portföy, saasApplyBrand/saasSaveSEO)
- ✅ **Onboarding** (obSeed/openOnboarding/obFinish, `dn_onboarded`)
- ✅ **SaaS Portal** (openSaasPortal/saasPortalConnect/saasPortalSubmit)
- ✅ **Randevu** (apptModuleHTML/apptSubmit/buildSlots) — gayrimenkul'de YOK, danışmana özgü artı
- ✅ **i18n** (gmLang/_i18nNodes, `dn_lang`), **AI guard** (aiGuard/aiRiskScan), **A/B** (`dn_ab`), **analitik** (`dn_analytics`)
- ✅ **Inline ProX Asistan** ("ProX AI · Danışman Konsiyerj" `.prox-h`, proxScan/proxSend/proxAiQuery/_proxReply/_proxPush)

**EKSİK (taşınacaklar — bkz. Bölüm 3):**
- ❌ DeepSeek anahtarı + `aiChat` yönlendirmesi
- ❌ ProX yeşil-**X** logosu (`.prox-x` #19c37d) — "Px" avatar var ama kurumsal ProX logosu yok
- ❌ Gerçek üyelik (gm_users/session) + tam-ekran ProX Asistan + FAB dahil TAM KAYIT + admin görüşme panosu (tam döküm)
- ❌ Denetim sertleştirmeleri (XSS `_le`, C2 klon garantisi, P1/P3) — doğrulanmalı
- ❔ (opsiyonel) Kurumsal Leaflet harita seçici, mahalle-endeks pasta grafik, blog modülü

---

## 3. BOŞLUK ANALİZİ & ÖNCELİKLİ TAŞIMA PLANI

> Sıra: **önce bu oturumun yeni özellikleri** (kullanıcı bunları istedi), sonra denetim sertleştirme, en son opsiyoneller. Her faz sonunda `bun build danisman/js/app.js` + `bun smoke-test-danisman.mjs` + preview.

### FAZ D1 — DeepSeek anahtarı + aiChat yönlendirmesi ⭐ (en yüksek öncelik)
1. `SAAS_CONFIG` (veya danışman AICFG karşılığı) → `aiPrompt/dsKey/dsModel` alanları ekle.
2. `aiChat(body,opts)` + `_deepseekChat` + `_dsMessages` + `_dsKey/_dsModel` fonksiyonlarını app.js'e **port et** (birebir mantık; `AICFG` yerine danışmanın config nesnesinden oku).
3. Admin "ProX AI" sekmesine `dn_dskey` (password) + model seçimi + "Bağlan & Test Et" (`aiDsTest`) + durum rozeti ekle; `saasSaveProxPrompt`'a dsKey kaydını dahil et.
4. Danışmanın TÜM YZ çağrılarını (`proxAiQuery`, `_proxReply`, `proxSend`, gmLang translate, varsa blog/rapor) `aiChat`'ten geçir.
5. **Doğrula:** anahtar yok→ProX, anahtar var→`api.deepseek.com` Bearer (fetch-mock testi).

### FAZ D2 — ProX yeşil-X logosu (kurumsal kimlik altın kuralı) ⭐
1. `danisman/css/base.css`'e `.prox-logo`/`.prox-x` kurallarını ekle (#19c37d) — lüks temayla uyum için altın zemin DEĞİL, ProX yeşili korunur (marka ortaklığı işareti).
2. "ProX AI · Danışman Konsiyerj" başlığındaki "Px" avatarını + footer "Powered by ProX"u gerçek `Pro<span class="prox-x">X</span>` ile değiştir.
3. Statik `hakkimizda.html`/`sss.html`'de de birebir (gsc-static deseni).

### FAZ D3 — Üyelik + tam-ekran ProX Asistan + TAM KAYIT ⭐
1. **Modül yaklaşımı:** gayrimenkul `uyelik-asistan.js`'i danışmana **uyarla** (yeni `danisman/js/uyelik-asistan.js`): `gm_*`→`dn_*` anahtarlar, açık→altın tema sabitleri, marka "Selin Meridyen", nav "ProX Asistan" linki.
2. Gerçek üyelik (SHA-256+salt, `dn_users`/`dn_session`), favoriler (`dn_fav_*`), tam-ekran asistan (`openProxAsistanPage` + PA_STORE `dn_asistan_convos`).
3. **FAB/inline asistanı da** aynı depoya kaydet (`_fabLog` deseni) — danışmanın mevcut `proxSend` sohbetini `dn_asistan_convos`'a yaz.
4. Admin'e "💬 Görüşmeler & Teklifler" panosu (`renderGorusmeler` uyarlaması): tam döküm + geri-arama + teklif + üye.
5. İletişim/randevu formları `pushLead`+`proxSubmitLead` → admin "Gelen Talepler".

### FAZ D4 — Denetim sertleştirme (kalite/güvenlik)
1. XSS: danışman render yollarında (vipCardsHTML/listingCardsHTML/contactHTML/eids*) kullanıcı verisini `_leD` ile escape et (danışman zaten `_leD` var — TÜM enjeksiyon noktalarına yay).
2. C2: `makeProvince` klon garantisi (IZMIR_PROVINCE mutasyon koruması).
3. C4: rotate notu (danışman tenant anahtarı da git geçmişinde ise) + proxy-mode zaten var → doğrula.
4. P3: null guard'lar, setTheme guard, reset `dn_*` temizliği, export/import paritesi (varsa).

### FAZ D5 — Opsiyonel zenginleştirme
- Kurumsal Leaflet harita seçici (kurumsal-sayfalar.js deseni) → iletişim/randevu için ofis konumu.
- Mahalle-endeks pasta grafik (mahalle-endeks.js) → VIP portföy mahalle detayında.
- Blog modülü (BLOGS + DeepSeek AI makale).

---

## 4. İSİM / MODEL EŞLEŞTİRME TABLOSU (taşırken çevir)

| Gayrimenkul | → Danışman |
|---|---|
| `meridyenGM_v1` (monolitik) | `SAAS_CONFIG` + `dn_*` (mevcut modele uy) |
| `gm_users_v1` / `gm_session_v1` | `dn_users` / `dn_session` |
| `prox_asistan_gm_convos_v1` | `dn_asistan_convos` |
| `gm_fav_*`, `gm_quotes_*` | `dn_fav_*`, `dn_quotes_*` |
| `wl_ozel_ts`, `wl_bolge`, `wl_lang` | `dn_vip_ts`, `dn_bolge`, `dn_lang` (mevcut) |
| `OZEL` / "Özel Portföy" / ozCardHTML | `VIP` / "VIP Portföy" / vipCardsHTML |
| Admin şifre `1234` | `_ADMIN_PASS='ekspertiz2026'` |
| `AICFG.dsKey/dsModel` | danışman config'inde eşdeğer alan |
| `_le`/`_be` (escape) | `_leD` (mevcut) — her yere yay |
| Kurumsal mavi tema | Altın/şampanya lüks tema (ProX yeşili #19c37d KORUNUR) |
| `mountSaaSMenu`/`SITE_NAV` | danışmanın kendi nav mount'u |

---

## 5. ALTIN KURALLAR / RİSKLER (taşırken UNUTMA)

1. **Mevcuda zarar verme:** Danışman zaten çalışan bir SaaS — özellikleri **ekle/uyarla**, silme/bozma. Her fazda smoke + preview.
2. **ProX logosu = kurumsal kimlik:** yeşil-X **#19c37d** (Google yeşili #34a853 DEĞİL). Lüks temada bile ProX işareti bu renkte kalır (marka ortaklığı).
3. **ProX = VERİTABANI, yapay zeka DEĞİL:** asistan metinleri "ProX'un doğrulanmış emlak verisine dayanır" der; kesin fiyat/garanti getiri UYDURMAZ (aiGuard).
4. **Admin şifresi görünür alana YAZILMAZ** (demo değeri kodda sabit; UI'da gösterme).
5. **Anahtar güvenliği:** DeepSeek/ProX anahtarları admin girince istemcide (localStorage). Yayında proxy-mode zorunlu (danışmanda zaten var). Sızan demo anahtarları KULLANICI rotate eder.
6. **Cache-bust:** danışman app.js'e `?v=N` ekli DEĞİL (şu an `js/app.js` düz). Taşımada sürüm sorgusu ekle (`?v=1`) ki güncellemeler görünsün.
7. **Çeviri/dil:** danışman `dn_lang` + gmLang zaten var; DeepSeek çevirisini de `aiChat`'e bağla.
8. **VIP ≠ OZEL sadece isim:** VIP modeli lüks tipler (yalı/penthouse/rezidans) ve "davet usulü" dili kullanır — Özel Portföy mantığı aynı ama sunum lüks.

---

## 6. HIZLI BAŞLANGIÇ KOMUTLARI
```sh
# Önizleme
python3 -m http.server 8799   # → http://localhost:8799/danisman/

# Doğrulama
bun build danisman/js/app.js --target=browser   # sözdizimi
bun smoke-test-danisman.mjs                       # danışman smoke
bun smoke-test.mjs                                # gayrimenkul (regresyon)
```

---
*Bu belge migrasyon boyunca güncel tutulur. Her faz bitince ilgili satır ✅ işaretlenir ve commit edilir.*
