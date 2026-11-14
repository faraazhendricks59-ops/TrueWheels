create type if not exists payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id), stripe_payment_intent_id text unique,
  amount_cents integer not null check (amount_cents >= 0), description text, status payment_status not null default 'pending',
  created_at timestamptz not null default now()
);
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(), listing_id uuid references listings(id), buyer_id uuid references profiles(id),
  seller_id uuid references profiles(id), last_message_at timestamptz not null default now(), is_archived boolean not null default false,
  unique(listing_id, buyer_id, seller_id), check (buyer_id is not null and seller_id is not null and buyer_id <> seller_id)
);
create table if not exists messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id), content text not null check (length(trim(content)) between 1 and 4000),
  is_read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('new_message', 'bid_placed', 'search_match')), title text not null, body text not null,
  is_read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references profiles(id), action text not null,
  target_type text not null, target_id uuid, reason text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

alter table invoices enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

create policy "users read own invoices" on invoices for select using (user_id = auth.uid());
create policy "participants read conversations" on conversations for select using (buyer_id = auth.uid() or seller_id = auth.uid());
create policy "participants create conversations" on conversations for insert with check (buyer_id = auth.uid() or seller_id = auth.uid());
create policy "participants read messages" on messages for select using (exists (select 1 from conversations c where c.id = messages.conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())));
create policy "participants send messages" on messages for insert with check (sender_id = auth.uid() and exists (select 1 from conversations c where c.id = messages.conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())));
create policy "users manage own notifications" on notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists messages_conversation_created_idx on messages(conversation_id, created_at);
create index if not exists notifications_user_unread_idx on notifications(user_id, is_read, created_at);
create index if not exists audit_logs_created_idx on audit_logs(created_at desc);
