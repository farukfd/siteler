# Autodesk APS (Forge) — Backend Sözleşmesi

Admin → 🏗️ **3D Proje Üretici** → **📐 .dwg Mimari Yükle · Autodesk APS** paneli, DWG/DXF/RVT/IFC
dosyalarını Autodesk bulutunda çevirip **Forge Viewer** ile tam BIM 3B (bağımsız bölümler dahil)
gösterir. Tarayıcıda **client_secret tutulamayacağı** için token + yükleme/çeviri küçük bir backend
proxy üzerinden yapılır. Bu proxy ProX / emlakekspertizi backend'ine veya bağımsız bir servise konabilir.

Panelde 3 endpoint girilir (localStorage `insaat_aps`): `tokenUrl`, `uploadUrl`, `statusUrl`.

## Ön koşul
[aps.autodesk.com](https://aps.autodesk.com) → uygulama oluştur → `APS_CLIENT_ID`, `APS_CLIENT_SECRET`.

## Endpoint sözleşmesi (frontend'in beklediği)

### 1) `GET {tokenUrl}` → görüntüleyici token'ı
2-legged OAuth, **yalnız** `viewables:read` kapsamı (istemciye verilir, güvenli).
```json
{ "access_token": "eyJ...", "expires_in": 1800 }
```

### 2) `POST {uploadUrl}`  (multipart/form-data; alan adı: `file`)
Dosyayı OSS'e yükler ve Model Derivative çeviri işini başlatır. Döner:
```json
{ "urn": "dXJuOmFkc2sub2JqZWN0cz..." }   // base64url(objectId), 'urn:' önekSİZ
```

### 3) `GET {statusUrl}?urn=<urn>` → çeviri durumu
```json
{ "status": "inprogress|success|failed", "progress": "%50" }
```
Frontend `success` olunca Forge Viewer'da `urn`'yi yükler. `statusUrl` boşsa yükleme sonrası
doğrudan görüntülemeyi dener.

## Örnek proxy (Node.js / Express)
```js
// npm i express multer axios cors
const express=require('express'), multer=require('multer'), axios=require('axios'), cors=require('cors');
const app=express(); app.use(cors()); const up=multer();
const ID=process.env.APS_CLIENT_ID, SECRET=process.env.APS_CLIENT_SECRET, BUCKET=(ID+'-arch').toLowerCase();
const B='https://developer.api.autodesk.com';

async function auth(scope){ const b=new URLSearchParams({grant_type:'client_credentials',scope});
  const r=await axios.post(B+'/authentication/v2/token', b, {auth:{username:ID,password:SECRET}}); return r.data.access_token; }

app.get('/aps/token', async (_,res)=>{ try{ const t=await auth('viewables:read');
  res.json({access_token:t, expires_in:1800}); }catch(e){res.status(500).json({error:''+e});} });

app.post('/aps/upload', up.single('file'), async (req,res)=>{ try{
  const t=await auth('data:read data:write data:create bucket:create bucket:read');
  const H={Authorization:'Bearer '+t};
  await axios.post(B+'/oss/v2/buckets',{bucketKey:BUCKET,policyKey:'transient'},{headers:H}).catch(()=>{}); // varsa geç
  const key=Date.now()+'-'+req.file.originalname.replace(/[^\w.\-]/g,'_');
  // signed S3 upload (tek parça)
  const s=await axios.get(`${B}/oss/v2/buckets/${BUCKET}/objects/${encodeURIComponent(key)}/signeds3upload`,{headers:H});
  await axios.put(s.data.urls[0], req.file.buffer);
  const done=await axios.post(`${B}/oss/v2/buckets/${BUCKET}/objects/${encodeURIComponent(key)}/signeds3upload`,{uploadKey:s.data.uploadKey},{headers:H});
  const urn=Buffer.from(done.data.objectId).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  await axios.post(B+'/modelderivative/v2/designdata/job',
    {input:{urn}, output:{formats:[{type:'svf2', views:['2d','3d']}]}},
    {headers:{...H,'Content-Type':'application/json'}});
  res.json({urn});
}catch(e){res.status(500).json({error:e.response?.data||''+e});} });

app.get('/aps/status', async (req,res)=>{ try{
  const t=await auth('viewables:read');
  const m=await axios.get(`${B}/modelderivative/v2/designdata/${req.query.urn}/manifest`,{headers:{Authorization:'Bearer '+t}});
  res.json({status:m.data.status, progress:m.data.progress});
}catch(e){res.json({status:'inprogress',progress:'başlıyor'});} });

app.listen(3000, ()=>console.log('APS proxy :3000'));
```

## Hızlı demo (backend olmadan)
Elinizde çevrilmiş bir model + geçerli `viewables:read` token varsa: panelde **⚙️ APS Bağlantı & Demo**
→ token endpoint'i (token dönen basit bir URL) girin, **hazır URN**'yi yapıştırıp **👁️ URN'yi Görüntüle**
ile Forge Viewer'ı anında test edin.

## Notlar
- Desteklenen girdi: DWG, DXF, RVT, IFC, NWD/NWC (Model Derivative'in desteklediği tüm formatlar).
- "Bağımsız bölümler" ancak DWG/RVT içinde nesne/blok/oda olarak modellenmişse ağaçta ayrı görünür;
  salt 2D çizim çizgilerden ibaretse ağaç sınırlı olur (mimardan 3B/BIM model istenmesi önerilir).
- Güvenlik: `client_secret` **yalnız** backend'de. `uploadUrl`'e yetkilendirme/oran sınırı ekleyin.
