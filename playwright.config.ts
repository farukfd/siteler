import { defineConfig, devices } from '@playwright/test';

// NOT: Bu ortamda node/npm yok; gerçek QA `bun tools/visual-qa.mjs` ile koşuldu.
// node + @playwright/test kurulduğunda bu config ile `npx playwright test` çalışır.
export default defineConfig({
  testDir: 'tests/visual',
  timeout: 60_000,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'tests/reports/playwright-html', open: 'never' }]],
  outputDir: 'tests/reports/artifacts',
  use: {
    baseURL: 'http://localhost:8765',
    screenshot: 'on',
    trace: 'retain-on-failure',
    deviceScaleFactor: 1,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'python3 -m http.server 8765',
    url: 'http://localhost:8765/degerleme.html',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
