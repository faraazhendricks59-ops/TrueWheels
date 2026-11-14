create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type lead_status as enum ('new', 'contacted', 'test_drive', 'negotiation', 'sold', 'lost');
create type garage_status as enum ('current', 'past', 'dream');

create table if not exists dealerships (
  id uuid primary key default gen_random_uuid(), owner_id uuid references profiles(id), business_name text not null,
  registration_number text unique, tax_id text, is_verified boolean not null default false,
  subscription_tier text not null default 'basic' check (subscription_tier in ('basic', 'premium', 'enterprise')),
  created_at timestamptz not null default now()
);
create table if not exists dealership_staff (
  id uuid primary key default gen_random_uuid(), dealership_id uuid not null references dealerships(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade, role text not null check (role in ('principal', 'manager', 'salesperson')),
  unique (dealership_id, user_id)
);
create table if not exists leads (
  id uuid primary key default gen_random_uuid(), listing_id uuid references listings(id), buyer_id uuid references profiles(id),
  dealership_id uuid references dealerships(id) on delete cascade, assigned_staff_id uuid references dealership_staff(id),
  status lead_status not null default 'new', notes text, created_at timestamptz not null default now()
);
create table if not exists digital_garage (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade,
  vehicle_id uuid references vehicles(id), custom_make text, custom_model text, custom_year int, status garage_status not null,
  acquired_date date, sold_date date, created_at timestamptz not null default now(),
  check (vehicle_id is not null or (custom_make is not null and custom_model is not null))
);
create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade,
  filters jsonb not null default '{}'::jsonb, is_active boolean not null default true, last_notified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table dealerships enable row level security;
alter table dealership_staff enable row level security;
alter table leads enable row level security;
alter table digital_garage enable row level security;
alter table saved_searches enable row level security;

create policy "dealership members can read dealership" on dealerships for select using (owner_id = auth.uid() or exists (select 1 from dealership_staff s where s.dealership_id = dealerships.id and s.user_id = auth.uid()));
create policy "users can read own staff membership" on dealership_staff for select using (user_id = auth.uid());
create policy "staff can read dealership leads" on leads for select using (buyer_id = auth.uid() or exists (select 1 from dealership_staff s where s.dealership_id = leads.dealership_id and s.user_id = auth.uid()));
create policy "users can read own garage" on digital_garage for select using (user_id = auth.uid());
create policy "users can insert own garage" on digital_garage for insert with check (user_id = auth.uid());
create policy "users can update own garage" on digital_garage for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users can manage own saved searches" on saved_searches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists listings_search_idx on listings using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));
create index if not exists listings_title_trgm_idx on listings using gin (title gin_trgm_ops);
create index if not exists saved_searches_active_idx on saved_searches (is_active, created_at);
