#!/usr/bin/env bun
/* ============================================================================
   qa/run.mjs — Kırık link (linkinator) + SEO/Lighthouse (Unlighthouse) fazları.
   Statik sunucuyu bir kez ayağa kaldırır, qa.config.json'daki her siteyi tarar.
   Kullanım:  bun qa/run.mjs            (tüm siteler)
              bun qa/run.mjs danisman   (tek site)
              bun qa/run.mjs --links    (yalnız link fazı)
              bun qa/run.mjs --seo      (yalnız SEO fazı)
   Node.js gerektirir (linkinator + unlighthouse-ci npx ile). Yoksa nazikçe atlar.
   ========================================================================== */
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const cfg = JSON.parse(readFileSync(join(HERE, "qa.config.json"), "utf8"));
const PORT = cfg.port || 8765;
const BASE = cfg.baseUrl || `http://localhost:${PORT}`;
const SERVE_CWD = join(ROOT, cfg.serveDir || ".");

const args = process.argv.slice(2);
const only = args.find((a) => !a.startsWith("-"));
const wantLinks = !args.includes("--seo");
const wantSeo = !args.includes("--links");
const sites = cfg.sites.filter((s) => !only || s.name === only);

function have(cmd) {
  return spawnSync("which", [cmd], { stdio: "ignore" }).status === 0;
}
function sh(cmd, list) {
  console.log(`\x1b[2m$ ${cmd} ${list.join(" ")}\x1b[0m`);
  return spawnSync(cmd, list, { stdio: "inherit", cwd: ROOT }).status ?? 1;
}
async function waitFor(url, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try { const r = await fetch(url); if (r.status < 500) return true; } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

const runner = have("npx") ? "npx" : have("bunx") ? "bunx" : null;
if (!runner) {
  console.error("\x1b[33m⚠ npx/bunx bulunamadı — Node.js kurulu değil. Link + SEO fazları atlanıyor.\x1b[0m");
  console.error("  Node.js kur (nvm/brew) veya:  bun add -d linkinator unlighthouse  sonra tekrar dene.");
  process.exit(0);
}

// ---- statik sunucu ----
const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: SERVE_CWD, stdio: "ignore" });
const cleanup = () => { try { srv.kill(); } catch {} };
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });

if (!(await waitFor(BASE))) { console.error("\x1b[31m✗ Sunucu ayağa kalkmadı:", BASE, "\x1b[0m"); cleanup(); process.exit(2); }
console.log(`\x1b[32m✓ Statik sunucu:\x1b[0m ${BASE}  \x1b[2m(cwd: ${SERVE_CWD})\x1b[0m`);

let fail = 0;
const skip = (cfg.linkIgnore || []).flatMap((s) => ["--skip", s]);

if (wantLinks) {
  for (const site of sites) {
    const entry = BASE + site.pages[0];
    console.log(`\n\x1b[1m🔗 Kırık link taraması — ${site.name}\x1b[0m  \x1b[2m(${entry}, recurse)\x1b[0m`);
    if (sh(runner, ["-y", "linkinator", entry, "--recurse", "--verbosity", "error", ...skip])) fail++;
  }
}

if (wantSeo) {
  const budget = Math.round(((cfg.seo && cfg.seo.minLighthouse) || 0.75) * 100);
  for (const site of sites) {
    const entry = BASE + site.pages[0];
    console.log(`\n\x1b[1m⚡ SEO / Lighthouse denetimi — ${site.name}\x1b[0m  \x1b[2m(bütçe ≥${budget})\x1b[0m`);
    if (sh(runner, ["-y", "unlighthouse-ci", "--site", entry, "--budget", String(budget)])) fail++;
  }
}

cleanup();
console.log(fail ? `\n\x1b[31m✗ ${fail} faz başarısız\x1b[0m` : `\n\x1b[32m✓ Link + SEO fazları geçti\x1b[0m`);
process.exit(fail ? 1 : 0);
