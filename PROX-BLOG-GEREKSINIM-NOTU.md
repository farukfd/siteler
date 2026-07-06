# ProX API — Blog Akışı Ucu Gereksinimi (SUNUCU EKİBİNE)

> **Durum:** İstemci (gayrimenkul.html /blog sayfası) bu ucu ÇAĞIRIYOR ama uç şu an **404**. Uç eklenince site otomatik olarak emlakekspertizi.com blog yazılarını gösterir — istemcide ek değişiklik gerekmez.

## Amaç
`/blog` sayfası iki kaynağı birleştirir:
1. **Firma yazıları** — kullanıcının admin'den (ProX AI destekli) oluşturduğu makaleler (yerel, çalışıyor ✅).
2. **ProX blog akışı** — emlakekspertizi.com/blog güncel sektör haberleri (bu uç ile gelecek).

## İstenen Uç
```
GET /api/v1/tenant/blog/feed
Header: X-Tenant-Id, X-Tenant-Key   (mevcut auth ile aynı)
```
**Başarılı yanıt (200):**
```json
{
  "success": true,
  "posts": [
    {
      "id": 101,
      "title": "2026'da konut piyasasında beklentiler",
      "category": "Piyasa",
      "summary": "Kısa özet (140-160 karakter).",
      "body": "Tam makale gövdesi. Paragraflar \n\n ile ayrılır.",
      "date": "2026-07-01"
    }
  ]
}
```
- İstemcinin kabul ettiği esnek anahtarlar: dizi kökü `posts` | `data` | `items` (veya doğrudan dizi).
- Alan eşlemesi (esnek): `title|baslik`, `category|cat|kategori`, `summary|ozet|excerpt`, `body|content|icerik`, `date|published`.
- Türkçe imla doğru; `body` düz metin (paragraflar `\n\n`).

## İstemci tarafı (hazır)
```js
async function proxBlogFeed(){ var r=await proxApi('/api/v1/tenant/blog/feed');
  if(r && !r.fallback){ var arr=r.posts||r.data||r.items; /* normalize → {title,cat,sum,body,date,src:'prox'} */ } }
```
Uç canlıya geçince: `blogAllPosts()` firma yazıları + ProX yazılarını birleştirir; `/blog` sayfası ve ana sayfa "Bilgi Merkezi" bölümü otomatik dolar. **İstemcide değişiklik gerekmez.**

## Not
AI makale üretimi (`/api/v1/tenant/prox/ai`) zaten CANLI ve çalışıyor — kullanıcı ProX AI ile tam makale oluşturup yayınlayabiliyor. Bu uç yalnızca **merkezi emlakekspertizi.com blog** yazılarını siteye taşımak içindir.

## Öncelik
**Orta** — firma kendi AI içeriğini şimdiden üretebiliyor; bu uç merkezi editoryal içeriği tüm bayilere dağıtmak için.
