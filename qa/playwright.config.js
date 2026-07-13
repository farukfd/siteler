/* ============================================================================
   qa/playwright.config.js — E2E + a11y + görsel regresyon
   qa.config.json'dan beslenir (baseUrl/port/serveDir). Statik siteyi kendisi servis eder.
   Taşınabilir: yeni projede yalnız qa.config.json düzenle.
   Çalıştır:  bun run qa:e2e            (test)
              bun run qa:e2e:update      (görsel baseline güncelle)
   ========================================================================== */
import { defineConfig, devices } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(HERE, "qa.config.json"), "utf8"));
const PORT = cfg.port || 8765;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: join(HERE, "tests"),
  snapshotDir: join(HERE, "__snapshots__"),
  outputDir: join(HERE, ".artifacts"),
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI
    ? [["github"], ["html", { open: "never", outputFolder: join(HERE, ".report") }]]
    : [["list"], ["html", { open: "never", outputFolder: join(HERE, ".report") }]],
  use: {
    baseURL: cfg.baseUrl || `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Görsel diff toleransı: fontkerning/anti-alias için küçük pay
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" } },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Statik dosyaları kendisi servis eder (repo/proje kökü = serveDir)
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    cwd: join(HERE, "..", cfg.serveDir || "."),
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 30_000,
  },
});
