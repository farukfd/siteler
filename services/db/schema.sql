-- ============================================================================
-- ÇOK-KİRACILI ŞEMA — REFERANS / BAŞLANGIÇ (PostgreSQL)  (#5, #7, #17)
-- ----------------------------------------------------------------------------
-- DURUM: Bu bir REFERANS iskelettir — backend ekibi uyarlayıp deploy eder.
--        Statik repoda ÇALIŞTIRILMADI/TEST EDİLMEDİ. Migration aracınıza taşıyın.
-- İLKE: Her kiracıya-ait tabloda ZORUNLU `tenant_id` + RLS (bkz. rls.sql) +
--        UYGULAMA katmanında ayrıca yetki (RLS tek başına yeterli değildir).
-- ============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- ---- Kiracı & alan adı çözümleme (#5) -------------------------------------
create table tenants (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,            -- 'emlaktahadimkoy_com'
  legal_name    text not null,
  status        text not null default 'trial',   -- trial|active|suspended|closed
  package_code  text not null default 'PRO',
  created_at    timestamptz not null default now()
);

create table tenant_domains (               -- Host → tenant (doğrulanmış)
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  domain       text unique not null,             -- 'www.emlaktahadimkoy.com'
  verified_at  timestamptz,                       -- DNS/TLS doğrulaması yapılınca
  is_primary   boolean not null default false
);

create table subscriptions (               -- aktif abonelik & özellikler
  tenant_id    uuid primary key references tenants(id) on delete cascade,
  active       boolean not null default true,
  features     jsonb not null default '[]',
  renews_at    timestamptz
);

-- ---- Kimlik & yetki (#2, #17, #43) ----------------------------------------
create table users (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  email         text not null,
  pass_hash     text not null,                    -- argon2id / bcrypt — DÜZ METİN ASLA
  mfa_secret    text,                             -- TOTP (şifreli saklanır)
  status        text not null default 'active',
  created_at    timestamptz not null default now(),
  unique (tenant_id, email)
);

create table roles (                        -- Super Admin, Tenant Owner, Office Manager,
  id    text primary key,                    -- Consultant, Content Editor, Finance User,
  label text not null                        -- Read Only, Support
);

create table user_roles (
  user_id  uuid not null references users(id) on delete cascade,
  role_id  text not null references roles(id),
  primary key (user_id, role_id)
);

-- ---- İçerik/CRM — HEPSİ tenant_id'li (localStorage'dan buraya, #7) ---------
create table listings (                     -- ilanlar
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  title      text, op text, tip text, price numeric, m2 numeric,
  il text, ilce text, mahalle text,
  eids_status text not null default 'pending',   -- pending|verified — KOD UYDURULMAZ (#10)
  eids_ref    text,
  status      text not null default 'draft',
  created_at  timestamptz not null default now()
);

create table private_portfolios (          -- Özel Portföy (kapalı)
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  invite_token text, expires_at timestamptz
);

create table leads (                        -- iletişim/talep — KİŞİSEL VERİ
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  domain text, form_type text, source_url text,
  name text, phone text, email text, message text,
  consent_version text, utm jsonb,
  assigned_consultant uuid references users(id),
  created_at timestamptz not null default now()
);

create table consents (                     -- KVKK/çerez rıza kaydı (#12,#14)
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  anon_id text, policy_version text, categories jsonb,
  created_at timestamptz not null default now()
);

create table api_keys (                     -- gizli anahtar İSTEMCİDE DEĞİL — burada (#8)
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  provider text not null,                    -- 'prox' | 'deepseek'
  secret_ref text not null,                  -- secret-manager referansı (ham anahtar DB'de değil)
  last4 text, quota_max int, created_at timestamptz not null default now()
);

create table audit_logs (                   -- değiştirilemez (#44)
  id bigserial primary key,
  tenant_id uuid, actor uuid, action text, target text,
  ip inet, created_at timestamptz not null default now()
  -- parola/TCKN/anahtar İÇERMEZ
);

-- AYNI DESENLE eklenecek (spec #5 tablo listesi): contacts, properties, contracts,
-- appointments, tasks, commissions, payments, messages, notifications, consultants,
-- reports, uploaded_files, integrations, analytics — HEPSİ tenant_id + RLS.

create index on listings(tenant_id);
create index on leads(tenant_id);
create index on private_portfolios(tenant_id);
create index on api_keys(tenant_id);
create index on audit_logs(tenant_id);
