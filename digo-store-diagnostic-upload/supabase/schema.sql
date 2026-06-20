create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null check (price_cents > 0),
  currency text not null default 'usd',
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  customer_email text,
  amount_total integer not null default 0,
  currency text not null default 'usd',
  status text not null default 'paid',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "Products are publicly readable"
  on public.products
  for select
  using (active = true);

create policy "Orders are service-role only"
  on public.orders
  for all
  using (false)
  with check (false);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Product images are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'product-images');
