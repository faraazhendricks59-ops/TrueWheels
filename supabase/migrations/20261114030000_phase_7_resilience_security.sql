create type if not exists moderation_status as enum ('live', 'pending_approval', 'under_review', 'archived', 'shadowbanned', 'rejected');

alter table listings add column if not exists moderation_status moderation_status not null default 'live';
alter table listings add column if not exists average_market_price numeric;
alter table listings add column if not exists image_hash text;
alter table profiles add column if not exists is_deleted boolean not null default false;
alter table profiles add column if not exists last_login_at timestamptz;
alter table profiles add column if not exists fraud_strikes integer not null default 0;

create table if not exists auction_bids (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  bidder_id uuid not null references profiles(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'accepted' check (status in ('accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now()
);
create table if not exists listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  reporter_id uuid references profiles(id),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);
create table if not exists offline_action_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  action_type text not null,
  idempotency_key text not null unique,
  payload jsonb not null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table auction_bids enable row level security;
alter table listing_reports enable row level security;
alter table offline_action_log enable row level security;
create policy "users read own bids" on auction_bids for select using (bidder_id = auth.uid());
create policy "users report listings" on listing_reports for insert with check (reporter_id = auth.uid());
create policy "users manage own offline actions" on offline_action_log for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists listings_moderation_status_idx on listings(moderation_status, created_at desc);
create index if not exists listings_image_hash_idx on listings(image_hash) where image_hash is not null;
create index if not exists auction_bids_listing_amount_idx on auction_bids(listing_id, amount_cents desc);
create index if not exists listing_reports_open_idx on listing_reports(status, created_at);

-- Requires pg_cron to be enabled in the Supabase dashboard.
-- SELECT cron.schedule('archive-old-listings', '0 2 * * *', $$UPDATE listings SET moderation_status = 'archived' WHERE moderation_status = 'live' AND created_at < NOW() - INTERVAL '90 days';$$);
-- SELECT cron.schedule('expire-boosts', '0 3 * * *', $$UPDATE listings SET boost_expires_at = NULL WHERE boost_expires_at < NOW();$$);
-- SELECT cron.schedule('clean-notifications', '0 4 * * *', $$DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days';$$);
