// Autodesk APS (Forge) proxy — SIFIR bağımlılık, bun ile çalışır.
// Çalıştırma:  APS_CLIENT_ID=xxx APS_CLIENT_SECRET=yyy bun aps-proxy.mjs
// Panelde 3 endpoint:
//   Token:  http://localhost:3000/aps/token
//   Yükle:  http://localhost:3000/aps/upload
//   Durum:  http://localhost:3000/aps/status
const ID = process.env.APS_CLIENT_ID, SECRET = process.env.APS_CLIENT_SECRET;
const PORT = +(process.env.PORT || 3000);
const B = 'https://developer.api.autodesk.com';
const BUCKET = ((ID || 'meridyen') + '-arch').toLowerCase().replace(/[^a-z0-9\-_.]/g, '');

if (!ID || !SECRET) { console.error('❌ APS_CLIENT_ID / APS_CLIENT_SECRET gerekli (env).'); process.exit(1); }

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json', ...CORS } });

async function auth(scope) {
  const r = await fetch(B + '/authentication/v2/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(ID + ':' + SECRET), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope })
  });
  if (!r.ok) throw new Error('auth ' + r.status + ' ' + await r.text());
  return (await r.json()).access_token;
}
const b64url = (s) => Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function handleUpload(req) {
  const form = await req.formData();
  const file = form.get('file');
  if (!file) return json({ error: 'file yok' }, 400);
  const t = await auth('data:read data:write data:create bucket:create bucket:read');
  const H = { Authorization: 'Bearer ' + t };
  // bucket (varsa 409 → geç)
  await fetch(B + '/oss/v2/buckets', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ bucketKey: BUCKET, policyKey: 'transient' }) });
  const key = Date.now() + '-' + (file.name || 'model.dwg').replace(/[^\w.\-]/g, '_');
  const ek = encodeURIComponent(key);
  // signed S3 upload (tek parça)
  const s1 = await fetch(`${B}/oss/v2/buckets/${BUCKET}/objects/${ek}/signeds3upload`, { headers: H });
  if (!s1.ok) return json({ error: 'signeds3upload GET ' + s1.status + ' ' + await s1.text() }, 500);
  const s1j = await s1.json();
  const put = await fetch(s1j.urls[0], { method: 'PUT', body: await file.arrayBuffer() });
  if (!put.ok) return json({ error: 'S3 PUT ' + put.status }, 500);
  const s2 = await fetch(`${B}/oss/v2/buckets/${BUCKET}/objects/${ek}/signeds3upload`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ uploadKey: s1j.uploadKey }) });
  if (!s2.ok) return json({ error: 'complete ' + s2.status + ' ' + await s2.text() }, 500);
  const objectId = (await s2.json()).objectId;
  const urn = b64url(objectId);
  // çeviri işi (svf2, 2d+3d)
  const job = await fetch(B + '/modelderivative/v2/designdata/job', {
    method: 'POST', headers: { ...H, 'Content-Type': 'application/json', 'x-ads-force': 'true' },
    body: JSON.stringify({ input: { urn }, output: { formats: [{ type: 'svf2', views: ['2d', '3d'] }] } })
  });
  if (!job.ok) return json({ error: 'job ' + job.status + ' ' + await job.text() }, 500);
  console.log('✅ yüklendi + çeviri başladı:', key);
  return json({ urn });
}

async function handleStatus(urn) {
  const t = await auth('viewables:read');
  const m = await fetch(`${B}/modelderivative/v2/designdata/${urn}/manifest`, { headers: { Authorization: 'Bearer ' + t } });
  if (m.status === 404) return json({ status: 'inprogress', progress: 'kuyruğa alınıyor' });
  const j = await m.json();
  return json({ status: j.status, progress: j.progress });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    try {
      if (url.pathname === '/aps/token') return json({ access_token: await auth('viewables:read'), expires_in: 1800 });
      if (url.pathname === '/aps/upload' && req.method === 'POST') return await handleUpload(req);
      if (url.pathname === '/aps/status') return await handleStatus(url.searchParams.get('urn') || '');
      return json({ ok: true, service: 'aps-proxy', endpoints: ['/aps/token', '/aps/upload', '/aps/status'] });
    } catch (e) { console.error(e); return json({ error: '' + (e && e.message || e) }, 500); }
  }
});
console.log(`🚀 APS proxy → http://localhost:${PORT}  (bucket: ${BUCKET})`);
