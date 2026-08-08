/**
 * YEREL TEST PROXY — Cloudflare Worker (cloudflare-worker/worker.js) mantığının node kopyası.
 * Amaç: Cloudflare olmadan, proxy modunu (X-Tenant-Key istemciden GİTMEZ) yerelde kanıtlamak.
 * Çalıştır:  node scripts/prox-proxy-local.mjs   → http://localhost:8790
 * İstemci:   admin → Firma → proxyUrl = http://localhost:8790  (veya konsoldan SAAS_CONFIG.firma.proxyUrl)
 * NOT: Bu dosya SADECE yerel testtir; üretimde Cloudflare Worker + secret store kullanılır.
 */
import http from "node:http";

const UPSTREAM = "https://www.emlakekspertizi.com";
const ALLOW_PREFIX = "/api/v1/tenant/";
const PORT = 8790;
const DEV_ORIGIN = "http://localhost:8799";

/* GÜVENLİK: Anahtarlar REPOYA GİRMEZ. scripts/prox-keys.local.json (gitignore'lu) veya
   PROX_KEY_<TENANT> ortam değişkeninden okunur. Örnek: prox-keys.local.json.example.
   NOT: Eski anahtarlar git geçmişinde kaldı → emlakekspertizi.com'da ROTATE edilmeli. */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dir = dirname(fileURLToPath(import.meta.url));
let KEYS = {};
try { KEYS = JSON.parse(readFileSync(join(__dir, "prox-keys.local.json"), "utf8")); }
catch (e) { console.warn("prox-keys.local.json yok — PROX_KEY_* env değişkenlerine bakılıyor."); }
for (const [k, v] of Object.entries(process.env)) {
  const m = k.match(/^PROX_KEY_(.+)$/); if (m && v) KEYS[m[1].toLowerCase()] = v;
}
const safeId = (id) => (typeof id === "string" && /^[a-z0-9_.-]{2,64}$/i.test(id) ? id : null);

function cors(res, status) {
  res.setHeader("Access-Control-Allow-Origin", DEV_ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Tenant-Id");
  if (status) res.statusCode = status;
}
const send = (res, status, obj) => { cors(res, status); res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "OPTIONS") { cors(res, 204); return res.end(); }
  if (!url.pathname.startsWith(ALLOW_PREFIX)) return send(res, 403, { error: "forbidden path" });

  const id = safeId(req.headers["x-tenant-id"]);
  if (!id) return send(res, 400, { error: "missing/invalid X-Tenant-Id" });
  const secret = KEYS[id];
  if (!secret) return send(res, 403, { error: "unknown tenant" });
  if (!["GET", "POST"].includes(req.method)) return send(res, 405, { error: "method not allowed" });

  // gövdeyi topla (POST)
  let body = "";
  if (req.method === "POST") { for await (const c of req) body += c; }

  const h = { "X-Tenant-Id": id, "X-Tenant-Key": secret };   // anahtar SUNUCUDA eklenir
  if (req.headers["content-type"]) h["Content-Type"] = req.headers["content-type"];

  try {
    const up = await fetch(UPSTREAM + url.pathname + url.search, {
      method: req.method, headers: h, body: req.method === "POST" ? body : undefined,
    });
    const txt = await up.text();
    cors(res, up.status);
    res.setHeader("Content-Type", up.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(txt);
  } catch (e) {
    send(res, 502, { error: "upstream unreachable", detail: String(e).slice(0, 80) });
  }
}).listen(PORT, "127.0.0.1", () => console.log("prox-proxy-local → http://localhost:" + PORT + "  (upstream " + UPSTREAM + ")"));
