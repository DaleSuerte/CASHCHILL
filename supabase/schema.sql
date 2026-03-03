-- CashChill waitlist schema
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  stage text not null check (stage in ('uni', 'trabajo')),
  frequency text not null check (frequency in ('casi-nunca', 'semanal', 'varias-veces')),
  whatsapp text,
  source text not null default 'landing'
);

alter table public.waitlist enable row level security;

-- Avoid duplicates by email
create unique index if not exists waitlist_email_unique_idx on public.waitlist (lower(email));

-- Public can only insert into waitlist (for landing form)
drop policy if exists "waitlist_public_insert" on public.waitlist;
create policy "waitlist_public_insert"
on public.waitlist
for insert
to anon
with check (true);

-- No public read access (admin must use service role server-side)
drop policy if exists "waitlist_no_public_select" on public.waitlist;
create policy "waitlist_no_public_select"
on public.waitlist
for select
to anon
using (false);

-- Optional helper view for exports
create or replace view public.waitlist_export as
select
  id,
  created_at,
  name,
  email,
  stage,
  frequency,
  coalesce(whatsapp, '') as whatsapp,
  source
from public.waitlist
order by created_at desc;
