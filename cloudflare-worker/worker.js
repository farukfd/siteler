/**
 * NADAS / emlakekspertizi.com ProX — Edge Proxy (Cloudflare Worker)
 * ------------------------------------------------------------------
 * AMAÇ: Gizli ProX `X-Tenant-Key`'i istemciden GİZLE. İstemci proxy modunda
 * yalnız public `X-Tenant-Id` gönderir; gizli anahtar burada (Worker secret)
 * eklenir. Böylece anahtar view-source / Network sekmesinde görünmez.
 *
 * İstemci sözleşmesi (sites app.js / proxApi):
 *   proxyUrl = <bu Worker'ın origin'i>   (ör. https://prox.emlaktahadimkoy.com)
 *   İstek    = fetch(proxyUrl + "/api/v1/tenant/<...>", { headers:{ "X-Tenant-Id": <id> } })
 *   Proxy modunda istemci "X-Tenant-Key" GÖNDERMEZ.
 *
 * Bu Worker:
 *   1) Sadece /api/v1/tenant/* yollarına izin verir (allow-list).
 *   2) X-Tenant-Id → o kiracının gizli anahtarını secret store'dan ekler (TENANT_KEY_<id>).
 *   3) İstemcinin gönderdiği herhangi bir X-Tenant-Key'i YOK SAYAR (güvenilmez).
 *   4) upstream'e (emlakekspertizi.com) iletir; yanıtı per-tenant CORS ile döndürür.
 *   5) Anahtarı asla yanıtta echo'lamaz.
 */

const UPSTREAM = "https://www.emlakekspertizi.com";
const ALLOW_PREFIX = "/api/v1/tenant/";

/* Kiracı id doğrulama: yalnız [a-z0-9_.-] (secret adı enjeksiyonunu önle) */
function safeTenantId(id) {
  return typeof id === "string" && /^[a-z0-9_.-]{2,64}$/i.test(id) ? id : null;
}

/* Bu kiracı için izinli origin (CORS). ENV: ORIGIN_<id> = "https://musteri.com"
   (birden çok origin virgülle). Yoksa isteğin Origin'i yansıtılmaz → CORS reddi. */
function allowedOrigin(env, id, reqOrigin) {
  const raw = (env["ORIGIN_" + id] || "").trim();
  if (!raw) return null;
  const list = raw.split(",").map(s => s.trim()).filter(Boolean);
  if (list.includes("*")) return reqOrigin || "*";
  if (reqOrigin && list.includes(reqOrigin)) return reqOrigin;
  return list[0] || null;
}

function corsHeaders(origin) {
  const h = new Headers();
  if (origin) {
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Vary", "Origin");
    h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    h.set("Access-Control-Allow-Headers", "Content-Type,X-Tenant-Id");
    h.set("Access-Control-Max-Age", "86400");
  }
  return h;
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const reqOrigin = req.headers.get("Origin") || "";
    const id = safeTenantId(req.headers.get("X-Tenant-Id"));

    // --- CORS preflight ---
    if (req.method === "OPTIONS") {
      const origin = id ? allowedOrigin(env, id, reqOrigin) : null;
      return new Response(null, { status: origin ? 204 : 403, headers: corsHeaders(origin) });
    }

    // --- Yol allow-list ---
    if (!url.pathname.startsWith(ALLOW_PREFIX)) {
      return new Response(JSON.stringify({ error: "forbidden path" }), {
        status: 403, headers: { "Content-Type": "application/json" }
      });
    }

    // --- Kiracı + gizli anahtar ---
    if (!id) return json(400, { error: "missing/invalid X-Tenant-Id" }, corsHeaders(null));
    const secret = env["TENANT_KEY_" + id];
    const origin = allowedOrigin(env, id, reqOrigin);
    if (!secret) return json(403, { error: "unknown tenant" }, corsHeaders(origin));
    if (reqOrigin && !origin) return json(403, { error: "origin not allowed" }, corsHeaders(null));

    // --- Yalnız güvenli method ---
    if (!["GET", "POST"].includes(req.method))
      return json(405, { error: "method not allowed" }, corsHeaders(origin));

    // --- upstream'e ilet (anahtarı SUNUCUDA ekle; istemci anahtarını yok say) ---
    const target = UPSTREAM + url.pathname + url.search;
    const h = new Headers();
    h.set("X-Tenant-Id", id);
    h.set("X-Tenant-Key", secret);                 // gizli anahtar yalnız burada
    const ct = req.headers.get("Content-Type");
    if (ct) h.set("Content-Type", ct);

    let body = undefined;
    if (req.method === "POST") body = await req.text();

    let up;
    try {
      up = await fetch(target, { method: req.method, headers: h, body });
    } catch (e) {
      return json(502, { error: "upstream unreachable" }, corsHeaders(origin));
    }

    // --- yanıtı CORS ile döndür; anahtar/upstream secret header'larını sızdırma ---
    const out = corsHeaders(origin);
    const upCt = up.headers.get("Content-Type");
    if (upCt) out.set("Content-Type", upCt);
    out.set("Cache-Control", "no-store");
    return new Response(up.body, { status: up.status, headers: out });
  }
};

function json(status, obj, headers) {
  const h = new Headers(headers || {});
  h.set("Content-Type", "application/json");
  return new Response(JSON.stringify(obj), { status, headers: h });
}
