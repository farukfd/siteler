/* ============================================================================
   qa/tests/site.spec.js — her sayfa için: yükleme + konsol/JS hatası + a11y (axe) + görsel
   qa.config.json'daki tüm site/sayfaları otomatik gezer. Tek dosya, tüm siteler.
   Etiketler:  --grep @visual  → yalnız görsel regresyon
               --grep-invert @visual → görseli atla (hızlı kapı)
   ========================================================================== */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(HERE, "..", "qa.config.json"), "utf8"));
const FAIL_ON = new Set((cfg.a11y && cfg.a11y.failOn) || ["critical", "serious"]);

// 3. parti gürültüsü (analytics, harita karoları, CDN) gerçek hata değildir
const NOISE = /gtag|googletag|google-analytics|doubleclick|tile\.|unpkg\.com|openstreetmap|favicon\.ico|ERR_BLOCKED_BY_CLIENT/i;

for (const site of cfg.sites) {
  for (const path of site.pages) {
    test.describe(`${site.name} · ${path}`, () => {

      test("yüklenir · konsol/JS hatası yok · başlık var", async ({ page }) => {
        const errors = [];
        page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
        page.on("pageerror", (e) => errors.push(String(e && e.message || e)));
        const resp = await page.goto(path, { waitUntil: "networkidle" });
        expect(resp && resp.status(), `HTTP durumu (${path})`).toBeLessThan(400);
        await expect(page).toHaveTitle(/.{5,}/);
        const real = errors.filter((e) => !NOISE.test(e));
        expect(real, `Konsol/JS hataları:\n${real.join("\n")}`).toEqual([]);
      });

      test("erişilebilirlik (axe · WCAG 2 A/AA)", async ({ page }) => {
        await page.goto(path, { waitUntil: "networkidle" });
        // Scroll-reveal sayfalarını gerçek kullanıcı gibi baştan sona kaydırarak
        // her IntersectionObserver reveal'ini DOĞAL yoldan tetikle → hepsi görünür
        // son duruma (opacity 1) gelsin. WCAG kontrastı yalnız bu dinlenme durumuna
        // bakar; ara animasyon karesindeki düşük opaklık yanlış-pozitiftir.
        await page.evaluate(async () => {
          const h = document.documentElement.scrollHeight;
          for (let y = 0; y <= h; y += 500) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(900); // reveal geçişleri otursun
        // Kalan animasyon/geçişleri dondur (yeniden tetiklenmesin)
        await page.addStyleTag({
          content: `*,*::before,*::after{animation:none!important;transition:none!important}`,
        });
        await page.waitForTimeout(100);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const blocking = violations.filter((v) => FAIL_ON.has(v.impact));
        const report = blocking
          .map((v) => `• [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} düğüm)`)
          .join("\n");
        expect(blocking, `Engelleyici a11y ihlalleri:\n${report}`).toEqual([]);
      });

      test("görsel regresyon @visual", async ({ page }) => {
        await page.goto(path, { waitUntil: "networkidle" });
        // Animasyon/canvas/imleç kaynaklı kararsızlığı dondur
        await page.addStyleTag({
          content: `*,*::before,*::after{animation:none!important;transition:none!important;
            scroll-behavior:auto!important;caret-color:transparent!important}
            canvas,video,.pf-hero__grain,.hero-canvas{visibility:hidden!important}`,
        });
        await page.waitForTimeout(400);
        const name = `${site.name}${path.replace(/[\/]/g, "_").replace(/\.html$/, "")}.png`;
        await expect(page).toHaveScreenshot(name, { fullPage: true });
      });
    });
  }
}
