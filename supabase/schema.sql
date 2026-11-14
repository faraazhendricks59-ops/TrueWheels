-- TrueWheels consolidated master schema
-- Apply to a fresh Supabase project. Existing phased migrations remain available for history.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type if not exists payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');
create type if not exists lead_status as enum ('new', 'contacted', 'test_drive', 'negotiation', 'sold', 'lost');
create type if not exists garage_status as enum ('current', 'past', 'dream');
create type if not exists moderation_status as enum ('live', 'pending_approval', 'under_review', 'archived', 'shadowbanned', 'rejected');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  cover_image_url text,
  intents jsonb not null default '[]'::jsonb,
  is_admin boolean not null default false,
  is_owner boolean not null default false,
  is_verified boolean not null default false,
  is_suspended boolean not null default false,
  is_deleted boolean not null default false,
  fraud_strikes integer not null default 0 check (fraud_strikes >= 0),
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(), vin text unique,
  make text not null, model text not null, trim text, year integer not null check (year between 1886 and 2200),
  body_type text, engine text, fuel_type text, transmission text, created_at timestamptz not null default now()
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(), seller_id uuid not null references profiles(id) on delete cascade,
  dealership_id uuid, vehicle_id uuid references vehicles(id), title text not null, description text,
  make text not null, model text not null, year integer not null check (year between 1886 and 2200),
  mileage_km integer not null check (mileage_km >= 0), price_cents integer not null check (price_cents >= 0),
  status text not null default 'live' check (status in ('draft', 'pending_approval', 'live', 'sold', 'archived', 'rejected')),
  moderation_status moderation_status not null default 'live', boost_expires_at timestamptz,
  average_market_price numeric, image_hash text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists listing_images (
  id uuid primary key default gen_random_uuid(), listing_id uuid not null references listings(id) on delete cascade,
  storage_path text not null, sort_order integer not null default 0, width integer, height integer, blur_score numeric,
  created_at timestamptz not null default now(), unique(listing_id, storage_path)
);

create table if not exists dealerships (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references profiles(id) on delete cascade,
  business_name text not null, registration_number text unique, tax_id text, is_verified boolean not null default false,
  subscription_tier text not null default 'basic' check (subscription_tier in ('basic', 'starter', 'professional', 'enterprise')),
  created_at timestamptz not null default now()
);
alter table listings add constraint listings_dealership_fk foreign key (dealership_id) references dealerships(id) on delete set null;

create table if not exists dealership_staff (
  id uuid primary key default gen_random_uuid(), dealership_id uuid not null references dealerships(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade, role text not null check (role in ('principal', 'manager', 'salesperson')),
  unique (dealership_id, user_id)
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(), listing_id uuid references listings(id) on delete set null, buyer_id uuid references profiles(id) on delete set null,
  dealership_id uuid references dealerships(id) on delete cascade, assigned_staff_id uuid references dealership_staff(id) on delete set null,
  status lead_status not null default 'new', notes text, created_at timestamptz not null default now()
);

create table if not exists digital_garage (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade,
  vehicle_id uuid references vehicles(id), custom_make text, custom_model text, custom_year integer, status garage_status not null,
  acquired_date date, sold_date date, created_at timestamptz not null default now(),
  check (vehicle_id is not null or (custom_make is not null and custom_model is not null))
);

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade,
  filters jsonb not null default '{}'::jsonb, is_active boolean not null default true, last_notified_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete set null,
  stripe_payment_intent_id text unique, amount_cents integer not null check (amount_cents >= 0), description text,
  status payment_status not null default 'pending', created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(), listing_id uuid references listings(id) on delete set null,
  buyer_id uuid not null references profiles(id) on delete cascade, seller_id uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz not null default now(), is_archived boolean not null default false,
  check (buyer_id <> seller_id), unique(listing_id, buyer_id, seller_id)
);
create table if not exists messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade, content text not null check (length(trim(content)) between 1 and 4000),
  is_read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('new_message', 'bid_placed', 'search_match')), title text not null, body text not null,
  is_read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references profiles(id) on delete set null, action text not null,
  target_type text not null, target_id uuid, reason text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists auction_bids (
  id uuid primary key default gen_random_uuid(), listing_id uuid not null references listings(id) on delete cascade,
  bidder_id uuid not null references profiles(id) on delete cascade, amount_cents integer not null check (amount_cents > 0),
  status text not null default 'accepted' check (status in ('accepted', 'rejected', 'withdrawn')), created_at timestamptz not null default now()
);
create table if not exists listing_reports (
  id uuid primary key default gen_random_uuid(), listing_id uuid not null references listings(id) on delete cascade,
  reporter_id uuid references profiles(id) on delete set null, reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')), created_at timestamptz not null default now()
);
create table if not exists offline_action_log (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, action_type text not null,
  idempotency_key text not null unique, payload jsonb not null, status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  attempts integer not null default 0, last_error text, created_at timestamptz not null default now(), processed_at timestamptz
);

alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table listings enable row level security;
alter table listing_images enable row level security;
alter table dealerships enable row level security;
alter table dealership_staff enable row level security;
alter table leads enable row level security;
alter table digital_garage enable row level security;
alter table saved_searches enable row level security;
alter table invoices enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table auction_bids enable row level security;
alter table listing_reports enable row level security;
alter table offline_action_log enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from profiles where id = auth.uid() and (is_admin or is_owner) and not is_suspended and not is_deleted); $$;
create or replace function public.is_owner() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from profiles where id = auth.uid() and is_owner and not is_suspended and not is_deleted); $$;

create policy "public can read live listings" on listings for select using (status = 'live' and moderation_status = 'live' and not exists(select 1 from profiles p where p.id = listings.seller_id and (p.is_suspended or p.is_deleted)) or seller_id = auth.uid() or public.is_admin());
create policy "users create own listings" on listings for insert with check (seller_id = auth.uid());
create policy "owners update own listings" on listings for update using (seller_id = auth.uid() or public.is_admin()) with check (seller_id = auth.uid() or public.is_admin());
create policy "public profiles readable" on profiles for select using (true);
create policy "users update own profile" on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users read own invoices" on invoices for select using (user_id = auth.uid() or public.is_admin());
create policy "participants read conversations" on conversations for select using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "participants create conversations" on conversations for insert with check (buyer_id = auth.uid() or seller_id = auth.uid());
create policy "participants read messages" on messages for select using (exists(select 1 from conversations c where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())) or public.is_admin());
create policy "participants send messages" on messages for insert with check (sender_id = auth.uid() and exists(select 1 from conversations c where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())));
create policy "users manage own notifications" on notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users read own bids" on auction_bids for select using (bidder_id = auth.uid() or public.is_admin());
create policy "users report listings" on listing_reports for insert with check (reporter_id = auth.uid());
create policy "admins manage reports" on listing_reports for all using (public.is_admin()) with check (public.is_admin());
create policy "owners manage audit logs" on audit_logs for select using (public.is_owner());
create policy "users manage own offline actions" on offline_action_log for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own garage" on digital_garage for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own saved searches" on saved_searches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists profiles_username_idx on profiles(lower(username));
create index if not exists listings_search_idx on listings using gin(to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));
create index if not exists listings_boost_sort_idx on listings((boost_expires_at is not null and boost_expires_at > now()), created_at desc);
create index if not exists listings_moderation_idx on listings(moderation_status, created_at desc);
create index if not exists listing_images_hash_idx on listing_images(listing_id);
create index if not exists auction_bids_idx on auction_bids(listing_id, amount_cents desc);
create index if not exists messages_conversation_idx on messages(conversation_id, created_at);
create index if not exists notifications_unread_idx on notifications(user_id, is_read, created_at);
create index if not exists audit_logs_created_idx on audit_logs(created_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, username, display_name, intents) values(new.id, coalesce(nullif(new.raw_user_meta_data->>'username', ''), 'user_' || substring(new.id::text, 1, 8)), coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'TrueWheels user'), '@', 1)), coalesce(new.raw_user_meta_data->'intents', '[]'::jsonb)) on conflict(id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Enable pg_cron in Supabase before running these jobs:
-- select cron.schedule('expire-boosts', '0 3 * * *', $$update listings set boost_expires_at = null where boost_expires_at < now();$$);
-- select cron.schedule('clean-notifications', '0 4 * * *', $$delete from notifications where created_at < now() - interval '30 days';$$);
-- select cron.schedule('archive-old-listings', '0 2 * * *', $$update listings set status = 'archived', moderation_status = 'archived' where status = 'live' and created_at < now() - interval '90 days';$$);
