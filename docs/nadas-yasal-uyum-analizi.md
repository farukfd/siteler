# NADAS — Yasal Uyum & Eksik Sayfa Analizi

> **Uyarı:** Bu belge genel bilgilendirmedir, **hukuki danışmanlık değildir**. VERBİS/ETBİS/İYS kayıtları ve sözleşme metinleri için bir **KVKK/bilişim hukuku uzmanına** danışılmalıdır. Aşağıdaki bulgular, mevcut site yapısının taranması ve Türkiye mevzuatının web araştırmasıyla oluşturulmuştur (kaynaklar en altta).

Tarih: 2026-07-25 · Kapsam: nadas.com.tr (kurumsal/B2B veri & yazılım sitesi). Not: satış/işlem akışları büyük ölçüde **emlakekspertizi.com** (tüketici platformu) üzerinde; bazı yükümlülükler asıl o siteyi ilgilendirir.

---

## 1) Mevcut Yapı (envanter)

**Toplam 18 HTML sayfası.** İçerik: index, veri-altyapisi, cozumler, prox, research, hakkimizda, iletisim, white-label, crm, kurumsal-api, veri-lisansi, web-yazilim, yapay-zeka.

**Mevcut yasal sayfalar (4) — footer'da bağlı:**
- `kvkk.html` — KVKK Aydınlatma Metni. **Dolu ve düzgün:** Veri Sorumlusu kimliği (MERSİS **0627045662400013**, adres Arnavutköy/İstanbul, e-posta), işlenen veri kategorileri, amaçlar, hukuki sebepler, aktarım, toplama yöntemi, **İlgili Kişi Hakları (m.11)**, başvuru yöntemi, değişiklikler.
- `gizlilik.html` — Gizlilik Politikası.
- `cerez.html` — Çerez (Cookie) Politikası (metin var).
- `kullanim-kosullari.html` — Kullanım Koşulları + Fikri Mülkiyet Hakları.

**Güçlü yanlar:** KVKK metni kapsamlı; MERSİS no mevcut; şirket ünvanı/adres tutarlı; footer'da 4 yasal link; SEO/OG düzgün; determinist ProX / İçerik Asistanı ayrımı ve "veri lisanslanır" çerçevesi dürüst kurulmuş.

**Eksik izler (tarama):** VERBİS (0), ETBİS (0), İYS/ticari ileti onayı (0), çerez rıza banner'ı (**yok**), Erişilebilirlik Beyanı (0), 5378 (0), ayrı Künye sayfası (yok), ticaret sicil no & vergi no (yok), iletişim formunda **yalnız KVKK onayı** var (ticari ileti opt-in yok).

---

## 2) Türkiye Mevzuatı — İlgili Yükümlülükler

| Mevzuat | Ne gerektirir | NADAS'a etkisi |
|---|---|---|
| **6698 KVKK** | Aydınlatma metni (var), **VERBİS kayıt** (eşik aşılırsa), **çerez rızası**, **yurt dışı aktarım (m.9)** | Aydınlatma ✓. VERBİS/çerez/yurt-dışı → **eksik** |
| **KVKK Çerez Rehberi + İlke Kararları** | İlk girişte **çerez rıza banner'ı**, opt-in, "Reddet", varsayılan işaretli kutu **yasak**; reklam/hedefleme çerezine açık rıza | **Banner yok → kritik** |
| **KVKK Yurt Dışı Aktarım Yön. (10.07.2024)** | Yurt dışına aktarımda standart sözleşme / taahhütname / (arızi) açık rıza | **Yapay Zeka sayfası:** ticari LLM API'leri (Claude/GPT/Gemini) = yurt dışına aktarım → **madde gerekli** |
| **6563 E-Ticaret + ETBİS** | Hizmet sağlayıcı tanıtıcı bilgileri (künye) sunar; çevrimiçi satış/sipariş varsa **ETBİS kayıt** | Künye **eksik**; ETBİS esas emlakekspertizi.com |
| **Ticari İleti Yön. + İYS** | Bülten/pazarlama e-postası/SMS için **İYS kayıt + açık rıza**; ret hakkı | Research aboneliği/bülten varsa → **opt-in ve İYS eksik** |
| **TTK m.1524** | **Denetime tabi** sermaye şirketlerine internet sitesi + ilan bölümü | Ltd. Şti muhtemelen **kapsam dışı**, ama künye/MERSİS yine beklenir |
| **6502 Tüketici / Mesafeli Sözleşmeler** | Çevrimiçi satış: Ön Bilgilendirme Formu + Mesafeli Satış Sözleşmesi + **cayma hakkı** | Esas **emlakekspertizi.com** (üyelik/abonelik); nadas teklif-bazlı B2B |
| **5378 Engelliler + 2025/10 Genelge** | Web/mobil **erişilebilirlik (WCAG 2.2 A min)**, izleme, yaptırım | **Erişilebilirlik Beyanı yok**; teknik uyum güçlendirilmeli |
| **FSEK (ek m.8 sui generis)** | Veri tabanı koruması | ✓ veri-lisansi.html'de dürüst işlendi |

**İdari para cezası aralıkları (2025, gösterge):** aydınlatma ihlali ~9K–180K TL · VERBİS'e kayıtsızlık ~36K–1,8M TL · ETBİS ihlali ~79K–396K TL.

---

## 3) Gap Analizi — Önceliklendirilmiş Eksikler

### 🔴 KRİTİK (yüksek risk / hızlı yapılmalı)
1. **Çerez rıza banner'ı yok.** İlk girişte bilgilendirme + "Kabul Et / Reddet / Tercihleri Yönet"; zorunlu-olmayan çerezler onaya kadar çalışmamalı. → `core.js`'e global banner + tercih saklama. **(Site içi — biz yapabiliriz.)**
2. **Yurt dışına veri aktarımı (KVKK m.9).** Yapay Zeka hizmetinde ticari LLM API'leri yurt dışına aktarımdır. KVKK aydınlatma metnine **yurt dışı aktarım maddesi** + Yapay Zeka sayfasına "ticari model = yurt dışına aktarım, uygun güvence/açık rıza gerekir" notu. **(Metin — biz yapabiliriz; kayıt/taahhütname hukukçu.)**
3. **VERBİS kaydı & referansı.** Kayıt eşiği aşılıyorsa zorunlu; KVKK metnine VERBİS kayıt bilgisi eklenir. **(Kayıt = operasyonel/hukuki; siteye referans = biz.)**

### 🟠 YÜKSEK
4. **Künye / Yasal Bilgiler sayfası yok.** Ticaret ünvanı, MERSİS, **ticaret sicil no**, **vergi dairesi/no**, adres, **KEP**, telefon/e-posta, yetkili/temsilci. Ayrı `kunye.html` + footer linki. (6563 tanıtıcı bilgi + MERSİS künye zorunluluğu.)
5. **Ticari elektronik ileti / İYS.** Bülten/research aboneliği/pazarlama gönderiliyorsa: formlara **KVKK onayından ayrı** "ticari ileti almak istiyorum" opt-in + İYS kayıt + abonelikten çıkış. **(Form = biz; İYS kayıt = operasyonel.)**
6. **ETBİS (koşullu).** nadas.com.tr üzerinden çevrimiçi satış/sipariş varsa gerekli; yoksa gerekmeyebilir — **hukukçu teyidi.** (emlakekspertizi.com için büyük olasılıkla gerekli.)

### 🟡 ORTA
7. **Erişilebilirlik Beyanı sayfası yok.** 5378 + 2025/10 Genelge (WCAG 2.2 A). `erisilebilirlik.html` beyanı + footer linki + teknik iyileştirme taahhüdü.
8. **KVKK Başvuru Formu.** İlgili kişi başvurusu için indirilebilir/çevrimiçi form (`kvkk-basvuru`).
9. **Mesafeli Satış / Ön Bilgilendirme / Cayma Hakkı.** Çevrimiçi üyelik/abonelik satışı varsa (esas emlakekspertizi.com) — o platformda ele alınmalı.

### ⚪ DÜŞÜK / İyileştirme
10. Künyeye ticaret sicil no + vergi no + KEP netleştir.
11. Yasal sayfalara **son güncelleme tarihi + versiyon** ekle.
12. Çerez politikasını çerez tablosu (ad, amaç, süre, taraf) ile detaylandır (banner tercih merkeziyle uyumlu).

---

## 4) Önerilen Aksiyon Sırası (site tarafı, bizim yapabileceğimiz)

1. **Çerez rıza banner'ı** (core.js global) + çerez tercih merkezi — 🔴
2. **Künye / Yasal Bilgiler** sayfası + footer linki — 🟠
3. **KVKK metni güncelleme:** yurt dışı aktarım (m.9) + VERBİS referansı — 🔴/🟠
4. **Formlara ticari ileti opt-in** (KVKK onayından ayrı) + Yapay Zeka sayfası yurt-dışı notu — 🟠
5. **Erişilebilirlik Beyanı** + **KVKK Başvuru Formu** sayfaları — 🟡

**Hukukçu/operasyon gerektirenler (biz kod yazamayız, karar sizin):** VERBİS kaydı, ETBİS kaydı, İYS kaydı, standart sözleşme/taahhütname, mesafeli satış sözleşme metinlerinin hukuki onayı, künyedeki resmi numaraların (ticaret sicil, vergi no, KEP) doğrulanması.

---

## Kaynaklar (web araştırması)
- KVKK / çerez / VERBİS: [Hukuki Haber — Çerez Yönetimi 2025](https://www.hukukihaber.net/cerez-cookie-yonetimi-2025-acik-riza-banner-tasarimi-ve-kotuiyi-uygulamalar) · [Mondaq — KVKK Çerez Rehberi Yol Haritası](https://www.mondaq.com/turkey/data-protection/1667572/) · [Sayoğlu — KVKK Uyum 2025](https://serkansayoglu.com/adim-adim-sirketler-icin-kvkk-uyum-sureci-rehberi-2025-guncel/)
- E-Ticaret / ETBİS: [Ticaret Bakanlığı — ETBİS Kayıt](https://ticaret.gov.tr/duyurular/elektronik-ticaret-bilgi-sistemine-etbis-kayit-ve-bildirim-esaslari) · [Kanun 6563 (mevzuat.gov.tr)](https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6563.pdf)
- İYS / ticari ileti: [İYS — Kanun](https://iys.org.tr/iys/kanun) · [Lebib Yalkın — İYS Değerlendirme](https://lebibyalkin.com.tr/makale/ticari-elektronik-ileti-yonetim-sistemi-iys-hakkinda-degerlendirmeler)
- TTK 1524 / MERSİS künye: [Erdem&Erdem — TTK 1524](https://www.erdem-erdem.av.tr/bilgi-bankasi/turk-ticaret-kanunu-uyarinca-sermaye-sirketlerinin-internet-sitesi-kurma-yukumlulugu) · [Ticaret Bakanlığı — MERSİS](https://ticaret.gov.tr/ic-ticaret/bilgi-sistemleri/merkezi-sicil-kayit-sistemi-mersis)
- Yurt dışı aktarım / AI: [KVKK — Yurt Dışına Aktarım Rehberi](https://www.kvkk.gov.tr/Icerik/8142/Kisisel-Verilerin-Yurt-Disina-Aktarilmasi-Rehberi) · [Bilişim ve Hukuk — Yapay Zeka & KVKK](https://www.bilisimvehukuk.net/icerik/yapay-zeka-kullanirken-kvkk-uyumu-nasil-saglanir)
- Erişilebilirlik: [2025/10 Genelge (Resmî Gazete/AA)](https://www.aa.com.tr/tr/gundem/web-siteleri-ve-mobil-uygulamalarin-erisilebilirligi-konulu-genelge-resmi-gazetede/3606609) · [Aile Bakanlığı — Erişilebilirlik](https://www.aile.gov.tr/sss/engelli-ve-yasli-hizmetleri-genel-mudurlugu/erisilebilirlik/)
- Mesafeli satış: [Ticaret Bakanlığı — Mesafeli Sözleşmeler](https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme)
