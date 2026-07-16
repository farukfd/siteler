# STITCH DÖNÜŞÜM KOMUTU — danisman/ tüm sayfalar

> Otorite belge. Her sayfa dönüşümü bu spec'e BİREBİR uyar. Referans uygulama:
> `danisman/ozel-portfoy.html` (zaten Stitch) + `~/Desktop/stitch_prox_turkish_property_analytics/DESIGN.md`
> ("Aegean Heritage Wealth" · Modern Corporate / Luxury Editorial).

## 0) AMAÇ
`ozel-portfoy.html` dışındaki 12 sayfayı **aynı Stitch görsel diline** taşımak.
Sayfa sayfa; **ana sayfa (index) EN SON**. Her sayfa: dönüştür → tarayıcı doğrula
(masaüstü+mobil, konsol temiz, yatay taşma yok, ekran görüntüsü) → yerel commit.

## 1) TASARIM TOKENLARI (ozel-portfoy'dan birebir)
```
--st-bg:        #f9f9f8   /* sayfa zemini (cool near-white) */
--st-card:      #ffffff   /* kart/tile zemini */
--st-hair:      #e1e3e2   /* 1px hairline sınır */
--st-hair-2:    #eceeed   /* daha yumuşak ayraç */
--st-ink:       #191c1c   /* ana metin */
--st-ink-var:   #3f4942   /* ikincil metin/label */
--st-muted:     #707972   /* soluk not */
--st-em:        #00452b   /* PRIMARY deep emerald (başlık, değer, buton) */
--st-em-cont:   #0e5e3e   /* emerald container/hero gradient ucu */
--st-em-act:    #14805a   /* aktif/ikincil veri emerald */
--st-gold:      #c39b45   /* accent — VIP/premium/CTA vurgu */
--st-gold-deep: #795901   /* koyu gold — ikincil buton metni/çizgi */
--st-gold-cont: #fed175   /* açık gold — hero eyebrow/rozet */
--st-mint:      #96f6c7   /* hero vurgu metni (koyu zeminde) */
--st-error:     #ba1a1a
--st-prox:      #19c37d   /* PROX YEŞİLİ — SADECE ProX öğeleri, ASLA değişmez */
```
- **Tipografi:** başlık/hero-KPI/fiyat/isim = **Playfair Display** (`,Georgia,serif`);
  gövde/veri/label = **IBM Plex Sans** (`,system-ui,sans-serif`). Rakamlar hizalı →
  `font-variant-numeric:tabular-nums`. Küçük label = `11-12px + uppercase + letter-spacing:.05em + weight 600`.
- **Köşe:** buton/input/KPI = **4px**; kart/modal/görsel = **8px**; pill = 999px.
- **Yükseklik/gölge:** **GÖLGE YOK**. Derinlik = `1px #e1e3e2` hairline + tonal katman.
  Hover = sınır emerald'e döner (**yükselme/translateY YOK**). Modal = beyaz + üstte
  `2px #00452b` çizgi + yalnız modalda çok yumuşak `0 12px 24px rgba(0,0,0,.05)`.
- **Buton:** primary = `#00452b` zemin + beyaz metin + 4px; secondary = beyaz zemin +
  `1px #00452b` sınır + emerald metin + 4px; gold-CTA = `#c39b45` zemin + `#00311e` metin.
- **Kart:** beyaz + `1px #e1e3e2`; fiyat/isim Playfair; konum/spec IBM Plex; hover → emerald sınır.
- **Yüzey ritmi:** 8px skala (8/16/24/32/48/64), 24px gutter, 1200-1440 max-width.

## 2) KORUNACAKLAR (ASLA DOKUNMA)
1. **Üst nav + footer** — birebir (altın kural). base.css nav/footer kuralları değişmez.
2. **ProX yeşili `#19c37d`** — yalnız ProX öğelerinde; asla yeniden renklendirilmez.
3. **Tüm işlevsellik** — JS, formlar, onclick, veri akışı, lead funnel, EİDS, ProX API, carousel.
4. **Kancalar** — `brandName/brandMark`, `js/a11y.js`, `js/lead.js`, `dn_content` CMS `[data-cms]`.
5. **Kurallar** — "mülk"→gayrimenkul; prox-asistan'da "yapay zeka"/"AI" YASAK; admin şifresi görünmez.
6. **ilanlar↔ozel-portfoy funnel bandı** (.ilx-*), EİDS rozetleri, ProX-X logosu.

## 3) YÖNTEM (her sayfa)
1. Font linkine **IBM Plex Sans** ekle (yoksa): `&family=IBM+Plex+Sans:wght@300;400;500;600;700`.
2. Sayfanın **scoped bileşen CSS'ini** Stitch'e taşı (yalnız o sayfanın sınıfları:
   `.hz-* .hk-* .ct-* .ba-* .ilh-* .pf-* .ild-* .lg-* .pa-*` vb.). base.css'e dokunma;
   gerekiyorsa scoped inline `<style>` override kullan (ozel-portfoy'un `#ozF1Style` deseni).
3. Krem/koyu zemin → `#f9f9f8`; gradient-border/gölge/16-26px köşe → hairline + 4-8px + gölgesiz.
   Cormorant/Jost başlıklar → Playfair; gövde → IBM Plex. Altın conic/parlak süsler → sakin gold accent.
4. Hover: translateY/glow → emerald sınır. Segmented control: açık gri track + beyaz pill.
5. **CSS sürümünü bump et** (base.css veya portfoy.css veya ilgili). Cache-bust.
6. **Doğrula:** dev sunucu, masaüstü 1280 + mobil 375; konsol hatası yok; yatay taşma yok;
   ProX yeşili yerinde; ekran görüntüsü. **Sonra yerel commit** (`sadece yerel`).

## 4) SAYFA SIRASI (index EN SON)
1. **ilanlar.html** — vitrin; ozel-portfoy ile aynı dile (hero + filtre + kartlar + detay overlay).
2. **hizmetlerimiz.html** — 14 servis kartı + miras masası.
3. **bolge-analizi.html** — canlı ProX konsolu (ısı-şerit/kadran/mahalle ızgara/SEO makaleler).
4. **hakkimizda.html** — danışman hikâyesi.
5. **iletisim.html** — form zaten Stitch; hero/kart/harita hizala + `.lg-*` yasal-shell.
6. **sss.html** — 273 SSS accordion.
7. **prox-asistan.html** — kilitli sohbet (chip/bubble/composer; ProX yeşili korunur).
8. **kvkk.html · cerez.html · kullanim.html** — yasal (ortak `.lg-*`, tek geçişte batch).
9. **404.html** — koyu tema → açık Stitch.
10. **index.html** — EN SON. SPA ana sayfa (hero/kartlar/intel-band/süreç/referans/CTA).

## 5) KABUL KRİTERİ (her sayfa)
- [ ] Görsel dil ozel-portfoy ile tutarlı (near-white, hairline, gölgesiz, 4-8px, Playfair+IBM Plex).
- [ ] Nav+footer birebir korundu; ProX yeşili yerinde.
- [ ] Tüm işlev çalışıyor (form/onclick/veri/carousel/overlay); konsol temiz.
- [ ] Mobil (375) + masaüstü (1280) düzgün; yatay taşma yok.
- [ ] CSS sürüm bump; ekran görüntüsü; yerel commit.

---
_Bu belge repo kökünde; her Stitch commit'i buna atıf yapar. İlişkili: danisman-tema-overhaul, danisman-denetim-backlog (hafıza)._
