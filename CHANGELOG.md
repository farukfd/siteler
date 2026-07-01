# Changelog

## [2.1] — Meridyen Değerleme (amiral) · SPK Lisanslı Değerleme

`degerleme/` — çok dosyalı, tek-kaynak (header/footer altın kural), CSS/JS inline, 2026 tasarım.

### Çok dillilik
- TR (kaynak) + EN + RU + ZH + AR (Arapça RTL) — `assets/i18n/*.json`, ~2039 dize tam kapsama.
- Çalışma anında metin-düğümü değişimi (anahtar = Türkçe kaynak); üst menüde dil seçici; çerez bandı da çevrilebilir.

### Marka & Tema
- **Powered by ProX** footer rozeti (Pro beyaz · X yeşil) → nadas.com.tr; admin markası **ProX CRM**.
- **6 tam-palet tema** (Lacivert · Antrasit · Bordo · Yeşil · Mor · Okyanus) `[data-theme]` ile hero/footer/CTA/buton dahil tüm sayfaya uygulanır; admin'de görsel swatch seçici.
- Logo (üst/alt menü) admin'den yüklenir; logo varken marka metni gizlenir (üstte yalnız logo, altta logo + açıklama).

### Yönetim (ProX CRM · admin.html)
- Tek tema · çok kiracı; kodsuz yönetim. SEO & Reklam (GA4/GTM/Ads/AdSense/doğrulama/robots/özel head kodu), WhatsApp merkezi, SPK Lisans No, API anahtarları (ProX + DeepSeek yedek; `degAi` ProX→DeepSeek fallback).
- **Yayınla → site-config.json**: ayarlar tüm ziyaretçilerde canlı; gizli anahtarlar dosyaya yazılmaz.
- `tools/apply-config.mjs`: ayarları ham HTML `<head>`'ine gömer (crawler-grade SEO).

### İçerik & Animasyon
- Hero: canlı SPK süreç animasyonu + 81 il canlı konut m² endeksi (gerçek veri, yıllık %değişim).
- Ana sayfa: "Canlı Konut Endeksi" kayan şerit + özet; sayfa geneli scroll-reveal.
- Metodoloji: 6 adım süreç, üç yaklaşım (animasyonlu SVG), değer türleri, uzlaştırma diyagramı, standartlar — SPK-yasal dil (`scripts/check-spk-legal.mjs` PASS).

### Mobil
- Sabit alt menü (Hizmetlerimiz · Neden Biz · Talep · WhatsApp); 320–390px yatay kayma yok; RTL uyumlu.
