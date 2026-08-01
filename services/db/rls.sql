-- ============================================================================
-- ROW-LEVEL SECURITY — REFERANS (PostgreSQL)  (#5)
-- ----------------------------------------------------------------------------
-- DURUM: REFERANS iskelet — çalıştırılmadı/test edilmedi. Backend deploy eder.
--
-- MODEL: Uygulama, her istek başında oturumdan çözülen tenant'ı GUC ile set eder:
--        SET LOCAL app.tenant_id = '<uuid>';   (istek sonunda otomatik düşer)
--        Böylece bir kiracının bağlantısı YALNIZ kendi satırlarını görür.
--
-- ⚠️ RLS TEK BAŞINA YETMEZ: uygulama katmanında da rol/işlem yetkisi kontrol
--    edilmeli (danışman finans göremez, editör anahtar göremez — #17).
--    Ayrıca kayıt ID'sini değiştirerek erişim (/api/leads/123) RLS + uygulama
--    ile İKİ katmanda engellenmeli.
-- ============================================================================

-- Yardımcı: geçerli istek tenant'ı
create or replace function current_tenant() returns uuid
  language sql stable as $$ select nullif(current_setting('app.tenant_id', true),'')::uuid $$;

-- Her kiracıya-ait tabloya uygula (örnek: listings, leads, private_portfolios, …)
alter table listings            enable row level security;
alter table leads               enable row level security;
alter table private_portfolios  enable row level security;
alter table consents            enable row level security;
alter table api_keys            enable row level security;
alter table users               enable row level security;

-- FORCE: tablo sahibi/superuser bile RLS'i baypas etmesin (uygulama rolü ayrı olmalı)
alter table listings            force row level security;
alter table leads               force row level security;
alter table private_portfolios  force row level security;
alter table api_keys            force row level security;

-- Politika deseni (her tablo için tekrarla): yalnız kendi tenant satırları
create policy tenant_isolation_listings on listings
  using (tenant_id = current_tenant())
  with check (tenant_id = current_tenant());

create policy tenant_isolation_leads on leads
  using (tenant_id = current_tenant())
  with check (tenant_id = current_tenant());

create policy tenant_isolation_pp on private_portfolios
  using (tenant_id = current_tenant())
  with check (tenant_id = current_tenant());

create policy tenant_isolation_consents on consents
  using (tenant_id = current_tenant())
  with check (tenant_id = current_tenant());

create policy tenant_isolation_apikeys on api_keys
  using (tenant_id = current_tenant())
  with check (tenant_id = current_tenant());

-- users: kullanıcı yalnız kendi tenant'ının kullanıcılarını görür
create policy tenant_isolation_users on users
  using (tenant_id = current_tenant())
  with check (tenant_id = current_tenant());

-- Kalan tüm kiracı tabloları AYNI desenle: enable+force RLS + tenant_id politikası.
-- Otomatik test (spec #47): A tenant bağlantısı B tenant kaydını GÖRMEMELİ/DEĞİŞTİRMEMELİ.
