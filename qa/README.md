# QA Kiti — Taşınabilir Uçtan Uca Test + SEO Denetimi

Statik / vanilla (framework'süz) çok-sayfalı HTML siteler için **tek klasör, tek config** test altyapısı.
Bu repoda `danisman/` için kurulu; **başka projelerde de aynen kullanılır** — `qa/` klasörünü kopyala, `qa.config.json`'ı düzenle, bitti.

Araç seçimleri GitHub'daki en güncel/en çok yıldızlı açık kaynak araçlara dayanan derin araştırmayla belirlendi (Temmuz 2026).

---

## Ne test eder? (3 katman)

| Katman | Araç | Ne | Gereksinim |
|---|---|---|---|
| **1 · Statik** | `static-check.mjs` (kendi yazımımız) | SEO meta (title/description/canonical/OG), JSON-LD schema **geçerlilik**, `<h1>`, viewport, `alt` | **yalnız bun** — tarayıcısız, saniyeler |
| **2 · Tarayıcı** | **Playwright** + **@axe-core/playwright** | E2E yükleme, konsol/JS hatası, **a11y (WCAG 2 A/AA)**, **görsel regresyon** (screenshot diff) | Node + Chromium |
| **3 · Link + SEO** | **linkinator** + **Unlighthouse** | Kırık link taraması (recurse), tüm-site Lighthouse (SEO/CWV/perf) | Node |

> **Kaçınılanlar** (araştırma bulgusu): *Lost Pixel* (Nis 2026 arşivlendi), *broken-link-checker/blc* (~2019'dan atıl). Görsel regresyon Playwright'ın dahili `toHaveScreenshot`'una verildi → sıfır ek bağımlılık.

---

## Kurulum (bir kez)

```sh
bun install              # devDependencies: @playwright/test, @axe-core/playwright, linkinator, unlighthouse
bun run qa:setup         # Playwright Chromium indir (playwright install --with-deps chromium)
```

## Çalıştırma

```sh
bun run qa:static        # ① Tarayıcısız SEO/schema kapısı — HER ZAMAN çalışır, anında
bun run qa:e2e           # ② E2E + a11y + görsel (ilk çalıştırma görsel baseline üretir)
bun run qa:e2e:fast      # ② görseli atla (hızlı PR kapısı)
bun run qa:web           # ③ Kırık link + Unlighthouse SEO
bun run qa:site          # ①+②(fast)+③ hepsi

bun run qa:e2e:update    # görsel tasarım BİLEREK değiştiyse baseline'ları yenile
bun run qa:e2e:report    # son Playwright HTML raporunu aç
bun run qa:links         # yalnız link fazı
bun run qa:seo           # yalnız SEO/Lighthouse fazı
```

Tek site hedefle: `bun qa/static-check.mjs danisman` · `bun qa/run.mjs danisman`

---

## Config — `qa.config.json` (düzenlenecek TEK dosya)

```jsonc
{
  "serveDir": ".",                     // statik kök (scriptlerin çalıştığı yer)
  "port": 8765,
  "baseUrl": "http://localhost:8765",
  "sites": [
    { "name": "danisman", "pages": ["/danisman/index.html", "/danisman/ilanlar.html", ...] }
  ],
  "seo": { "titleMax": 70, "descMin": 60, "descMax": 165, "minLighthouse": 0.75 },
  "a11y": { "failOn": ["critical", "serious"] },   // bu şiddetler testi kırar
  "linkIgnore": ["wa.me", "instagram.com", ...]     // link taramasında atlanır
}
```

Yeni sayfa eklemek = `pages`'e satır eklemek. Yeni site = `sites`'e nesne eklemek.

---

## Başka projede kullanmak (taşınabilirlik)

1. `qa/` klasörünü yeni projeye kopyala.
2. `package.json`'a `qa:*` scriptlerini ve devDependencies'i ekle (bu repodakinden kopyalanabilir).
3. `.github/workflows/qa.yml`'i kopyala.
4. **Yalnız `qa/qa.config.json`'ı düzenle** — `sites`/`pages`/`baseUrl`.
5. `bun install && bun run qa:setup && bun run qa:site`.

Kod dosyalarına (`static-check.mjs`, `playwright.config.js`, `tests/`, `run.mjs`) dokunmaya gerek yok — hepsi config'ten beslenir.

---

## Görsel baseline'lar

- İlk `qa:e2e` çalıştırması `qa/__snapshots__/` altında referans PNG'ler üretir — bunları **commit'le**.
- Görsel diff **tarayıcı+platform** bazlıdır (`...-chromium-darwin.png` vs `-linux`). CI Linux'ta çalışıyorsa baseline'ları da CI/Docker'da üret ki eşleşsin (`mcr.microsoft.com/playwright`), yoksa yerel-macOS baseline CI'da çakışır.
- Tasarımı bilerek değiştirdiğinde: `bun run qa:e2e:update`.

## Boşluklar (dürüst not)
- **JSON-LD schema:** aktif tek bir OSS doğrulayıcı yok → `static-check.mjs` içinde kendi geçerlilik+tip kontrolümüz var (Google Rich Results ile manuel teyit önerilir).
- **SERP/sıralama takibi:** güçlü OSS yok; gerekiyorsa self-hosted [serpbear](https://github.com/towfiqi/serpbear) (ayrı uygulama, CI testi değil).
