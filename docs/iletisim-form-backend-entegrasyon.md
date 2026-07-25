# İletişim Formları → Sunucu / emlakekspertizi.com İletişim Merkezi Entegrasyonu

> **Kime:** Sunucu tarafı (backend) Claude ajanına devir notu.
> **Amaç:** NADAS statik sitesindeki 3 formu, emlakekspertizi.com iletişim merkezine
> (ticket/CRM + e-posta) **gerçekten** iletecek bir backend uca bağlamak.
> **Bugünkü durum:** Formlar yalnızca istemci-tarafı **stub** — doğrulama yapıp
> "✓ Talebiniz alındı" gösteriyor ama **veriyi hiçbir yere göndermiyor.** Kurumsal
> talepler şu an sessizce kayboluyor. Bu, kapatılması gereken bir güven açığıdır.

---

## 1. Formların envanteri

Statik site: `nadas/*.html`. Her form ayrı bir stub handler'a sahip; hepsi backend'e
`fetch POST` edecek şekilde güncellenecek. **Alan id'leri sabit** — bunlara göre kontrat yaz.

### A) Ana iletişim / kurumsal talep formu — `nadas/iletisim.html`
Handler: `il-send` click (dosyada `/* ===== FORM GÖNDER ===== */` bloğu).

| Alan | id / kaynak | Zorunlu | Not |
|---|---|---|---|
| Ad Soyad | `il-name` | ✓ | |
| Şirket/Kurum | (isimsiz `input[type=text]`, opsiyonel) | – | ikinci text input |
| E-posta | `il-email` | ✓ | regex doğrulanıyor |
| Telefon | (isimsiz `input[type=tel]`, opsiyonel) | – | "Sizi arayalım" |
| Sizi arayalım | (isimsiz `checkbox`, default checked) | – | geri-arama isteği |
| Konu kapsamı | `il-subject` (`<select>`) | ✓ | **yönlendirme anahtarı** (bkz. §3) |
| Mesaj | `il-msg` | ✓ | ≥10 karakter |
| KVKK onayı | `il-kvkk` (checkbox) | ✓ | onaysız gönderilemez |
| Durum satırı | `il-status` | – | yanıt burada gösterilir |

**Konu seçenekleri (`il-subject`):** `Kurumsal API · entegrasyon`, `White-label platform teklifi`,
`Veri lisansı (il/ilçe bazlı)`, `Toplu SPK ekspertiz hizmeti`, `Investor / Corporate üyelik`,
`Demo / pilot proje talebi`, `Basın · medya · röportaj`, `Research aboneliği · rapor talebi`,
`İK · kariyer · staj`, `Diğer · genel sorular`.

### B) Kurumsal teklif formu — `nadas/cozumler.html`
Handler: `cz-submit`. Alanlar: `cz-name` (varsa), `cz-email`, `cz-status`.
Kod yorumu zaten hedefi söylüyor: *"backend bağlanınca /api'ye POST"*. `form_type = "kurumsal_teklif"`.

### C) Research bülten aboneliği — `nadas/research.html`
Handler: `rs-submit`. Alanlar: `rs-email`, `rs-status`. `form_type = "research_abonelik"`.
(Bu bir **abonelik** akışı — çift-opt-in maili önerilir, ticket değil.)

---

## 2. Backend API sözleşmesi (frontend bunu çağıracak)

Tek uç, tüm formlar için:

```
POST https://www.emlakekspertizi.com/api/v1/iletisim
Content-Type: application/json
X-Tenant-Id: nadas
Origin: https://www.nadas.com.tr   (ve demo hostları)
```

**Request gövdesi:**
```json
{
  "form_type": "iletisim | kurumsal_teklif | research_abonelik",
  "source_page": "iletisim.html",
  "name": "Ad Soyad",
  "company": "Kurum (ops.)",
  "email": "adres@kurum.com.tr",
  "phone": "+90 5xx ... (ops.)",
  "callback_requested": true,
  "subject": "Kurumsal API · entegrasyon",
  "message": "…",
  "kvkk_consent": true,
  "consent_ts": "2026-07-25T10:00:00+03:00",
  "hp": "",                         // honeypot — dolu ise sessizce başarı dön, işleme
  "meta": { "ua": "...", "ref": "...", "utm": {} }
}
```

**Başarılı yanıt (200):**
```json
{ "ok": true, "ticket_id": "NADAS-2026-000123", "channel": "bilgi@emlakekspertizi.com",
  "sla_hours": 24, "message": "Talebiniz alındı." }
```
**Hata yanıtı (4xx/5xx):**
```json
{ "ok": false, "error": "validation | rate_limit | server", "message": "İnsan-okunur mesaj" }
```

> Frontend bu kontratı bekliyor: `ok:true` → yeşil "✓ Talebiniz alındı · {ticket_id}",
> `ok:false` → kırmızı `{message}`, ağ hatası → "Bağlantı hatası, e-posta ile yazın".

---

## 3. Konu → kanal yönlendirmesi (sunucuda)

3 gerçek e-posta kanalı var; `subject`'e göre yönlendir + ilgili ekibe ticket aç:

| subject / form_type | Hedef kanal | Ekip |
|---|---|---|
| Kurumsal API, White-label, Veri lisansı, Demo/pilot, Investor/Corporate, `kurumsal_teklif` | **bilgi@emlakekspertizi.com** | Satış / Kurumsal |
| Toplu SPK ekspertiz, müşteri/sipariş | **destek@emlakekspertizi.com** | Müşteri Desteği |
| Basın, İK/kariyer, Diğer/genel, `research_abonelik` | **destek@nadas.com.tr** | Genel / Editör |

---

## 4. Sunucu tarafı işlem akışı (yapılacaklar)

1. **Girdi doğrulama (server-side, zorunlu):** name, geçerli email (RFC), subject beyaz-liste
   (yalnızca §1'deki seçenekler), message uzunluk 10–5000, `kvkk_consent === true`. İstemci
   doğrulaması güvenlik değildir — sunucuda tekrar doğrula.
2. **Spam/abuse:** honeypot (`hp` doluysa 200 dön ama drop) + IP + email başına **rate-limit**
   (örn. 5/saat) + opsiyonel captcha (yalnız eşik aşılınca). Bot imzalarını logla.
3. **Sanitizasyon:** e-posta gövdesine/HTML'e koymadan önce kaçış uygula; **başlık enjeksiyonuna**
   dikkat (name/subject içindeki `\r\n` temizlensin). JSON dışında hiçbir alanı `eval`/şablon-enjekte etme.
4. **KVKK kaydı:** `kvkk_consent`, `consent_ts`, IP, form metnini denetlenebilir biçimde sakla
   (aydınlatma metni sürümüyle). Saklama süresi + silme politikası tanımla.
5. **İletişim merkezine iletim:** ticket aç (CRM/helpdesk) **ve** §3 kanalına e-posta gönder;
   `Reply-To: {email}` ayarla ki ekip doğrudan yanıtlayabilsin. Ticket-id üret ve yanıtta dön.
6. **Otomatik onay maili:** başvurana `{email}` adresine "Talebiniz alındı · {ticket_id} · 24 saat"
   maili at (yanıtlar aynı thread'de kalsın). `research_abonelik` için **çift-opt-in** doğrulama maili.
7. **Geri-arama:** `callback_requested && phone` ise ticket'a "SİZİ ARAYALIM" etiketi ekle; telefon
   çağrısı özeti sonradan aynı thread'e e-postayla işlensin (sitenin vaadi bu).
8. **Gözlemlenebilirlik:** her başvuruyu (form_type, channel, ticket_id, sonuç) logla; başarısız
   iletimde retry + ölü-mektup kuyruğu (lead asla düşmesin).

---

## 5. Güvenlik gereksinimleri (backend)

- **CORS:** yalnız `https://www.nadas.com.tr` + tanımlı demo hostları `Origin` allowlist.
- **CSRF:** state-değiştiren uç; ya double-submit token ya da Origin/Referer kontrolü + rate-limit.
- **Tenant anahtarı ayrımı:** iletişim ucu, canlı-endeks `X-Tenant-Key` ile **aynı yetkiyi paylaşmasın**;
  yazma uçları için ayrı, dar kapsamlı kimlik kullan. (Ayrıca: endeks tenant_key'i istemcide görünür —
  onu Origin/Referer-kısıtlı + salt-okunur + rate-limited yapmak ayrı bir iş; bkz. güvenlik denetimi.)
- **PII:** e-posta/telefon/mesaj kişisel veridir; taşımada TLS, dinlenimde şifreleme, erişim logu.
- Yanıtta **stack trace / iç hata sızdırma**; jenerik `error` kodları dön.

---

## 6. Frontend'de yapılacak değişiklik (backend hazır olunca — NADAS tarafı)

Her handler'daki "başarı göster ama gönderme" bloğu, `fetch` POST ile değişecek. Örnek (`iletisim.html`):

```js
btn.disabled = true; status.textContent = "Gönderiliyor…";
try {
  var r = await fetch("https://www.emlakekspertizi.com/api/v1/iletisim", {
    method: "POST", mode: "cors",
    headers: { "Content-Type": "application/json", "X-Tenant-Id": "nadas" },
    body: JSON.stringify({ form_type:"iletisim", source_page:"iletisim.html",
      name, company, email, phone, callback_requested, subject, message: msg,
      kvkk_consent: kvkk, consent_ts: new Date().toISOString(), hp: "" })
  });
  var j = await r.json();
  if (j.ok) { status.style.color = C.accent;
    status.textContent = "✓ Talebiniz alındı · " + j.ticket_id + " · " + j.sla_hours + " saat içinde yanıt."; }
  else { throw new Error(j.message || "Gönderilemedi."); }
} catch (e) {
  btn.disabled = false;
  status.style.color = C.danger;
  status.textContent = "⚠ " + (e.message || "Bağlantı hatası — lütfen destek@nadas.com.tr'ye yazın.");
}
```

Notlar:
- Honeypot: forma gizli `input` (`hp`, `display:none`, `tabindex=-1`, `autocomplete=off`) eklenecek.
- Buton çift-tık koruması + gönderim sırasında `disabled`.
- `file://` (yerel önizleme) veya CORS reddinde **fail-safe**: "e-posta ile yazın" mesajı; asla sahte başarı.
- Aynı desen `cozumler.html` (`cz-submit`) ve `research.html` (`rs-submit`) için uygulanacak.

---

## 7. Kabul kriterleri (test)

- [ ] Geçerli gönderim → 200 + ticket_id; ilgili kanala e-posta düşüyor; başvurana onay maili gidiyor.
- [ ] Eksik/geçersiz alan → 4xx `validation`; frontend kırmızı mesaj gösteriyor; ticket **açılmıyor**.
- [ ] KVKK onaysız → reddediliyor.
- [ ] Honeypot dolu → 200 görünüyor ama ticket açılmıyor (sessiz drop).
- [ ] Rate-limit aşımı → 429; frontend nazik mesaj.
- [ ] Yanlış Origin → CORS reddi.
- [ ] `callback_requested` → ticket'ta "SİZİ ARAYALIM" etiketi.
- [ ] Sunucu hatası → lead ölü-mektup kuyruğuna; kaybolmuyor.

---

*Bu notlar NADAS statik sitesindeki mevcut form yapısına göre yazıldı (2026-07). Alan id'leri
değişirse §1 tablosunu güncelle. Backend uç canlı olduğunda §6'daki frontend değişikliğini NADAS
deposunda uygula.*
