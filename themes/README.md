# Tema Kütüphanesi (white-label SaaS)

Bu klasör, satılan her sitenin **tasarımını** barındırır. Kural: **tasarım = veri.**
Motor (`gayrimenkul/js/app.js`, `gayrimenkul/css/base.css`) hiçbir zaman forklanmaz;
her tenant yalnızca bir **tema dosyası** seçer + kendi markasını (config/admin) girer.

## Yapı

```
themes/
└─ gayrimenkul/
   ├─ meridyen.css   ← varsayılan (lacivert-mavi)
   ├─ sahil.css      ← turkuaz-kum
   ├─ altin-lux.css  ← antrasit-altın (üst segment)
   └─ gece-mor.css   ← indigo-menekşe
```

Her tema dosyası SADECE `:root{}` tasarım token'larından oluşur
(renk / gradyan / font / radius / shadow). Yapısal CSS `base.css`'te; token'lar
`var(--x)` ile tüketilir → tema dosyasını değiştirmek tüm siteyi restyle eder,
`base.css`/`app.js` DEĞİŞMEZ.

## Yeni tema üretmek (tasarımcı)

1. `meridyen.css`'i kopyala → `themes/gayrimenkul/<tema-adi>.css`.
2. Sadece `:root` token'larını değiştir (renk/font/radius). Yapıya dokunma.
3. Değişken ADLARINI koru (silme/ekleme yok) — `base.css` bunları bekler.

Anahtar token'lar: `--accent` (ana vurgu), `--grad-hero` (hero/footer zemini),
`--grad-cta` (yeşil buton), `--ink`/`--muted`/`--surface` (metin/zemin),
`--head`/`--body`/`--num` (fontlar), `--radius*`, `--shadow*`.

## Yeni satılan site kurmak

1. Tenant kabuğu = `gayrimenkul/index.html` (ince kabuk; içerik + linkler).
2. `<head>` içinde tema linkini tenant'ın temasına çevir:
   `<link rel="stylesheet" href="../themes/gayrimenkul/<tema>.css">`
3. Markayı gir: kabuk içi per-tenant config (`window.EMLAK_TENANT`) + admin
   panelinden Firma Adı/İl/Logo (runtime white-label motoru markayı+ili+ProX'i
   uygular; logo `FIRMA.logo` ile üst menü+footer'a).
4. Admin renk seçici (SAAS_THEMES) isterse tema üzerine runtime override koyar.

> Not: `initSaaSTheme` yalnızca AÇIK bir tema seçimi (admin) varsa token'ları
> inline yazar; yoksa link'lenen tema dosyası yönetir (tema = dosya takası).
