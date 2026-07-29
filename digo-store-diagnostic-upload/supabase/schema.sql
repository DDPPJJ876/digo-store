create extension if not exists pgcrypto;

-- Core products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null check (price_cents > 0),
  currency text not null default 'usd',
  image_url text,
  hero_video_url text,
  fabric_story text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Product variants: size/color/inventory
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  color text not null,
  size text not null,
  sku text unique,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

-- Product media: images, videos, 360 assets
create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  type text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Fabric Intelligence foundation for Digital Twin
create table if not exists public.fabric_data (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  softness integer,
  stretch integer,
  weight text,
  thickness text,
  drape text,
  texture text,
  description text,
  created_at timestamptz not null default now()
);

-- Size recommendation foundation
create table if not exists public.size_guides (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  size text not null,
  bust_min integer,
  bust_max integer,
  waist_min integer,
  waist_max integer
);

-- Customer body profile foundation for future AI fit
create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  height integer,
  weight integer,
  bust integer,
  waist integer,
  created_at timestamptz not null default now()
);

-- Reviews become future fit training data
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  customer_email text,
  rating integer check (rating between 1 and 5),
  comment text,
  height integer,
  weight integer,
  size text,
  image_url text,
  created_at timestamptz not null default now()
);

-- Wishlist
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Orders
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

-- Enable security
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_media enable row level security;
alter table public.fabric_data enable row level security;
alter table public.size_guides enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;
alter table public.orders enable row level security;

-- Public product browsing
create policy "Products are publicly readable"
  on public.products
  for select
  using (active = true);

create policy "Variants are publicly readable"
  on public.product_variants
  for select
  using (true);

create policy "Media are publicly readable"
  on public.product_media
  for select
  using (true);

create policy "Fabric data publicly readable"
  on public.fabric_data
  for select
  using (true);

create policy "Size guides publicly readable"
  on public.size_guides
  for select
  using (true);

create policy "Reviews publicly readable"
  on public.reviews
  for select
  using (true);

create policy "Orders are service-role only"
  on public.orders
  for all
  using (false)
  with check (false);

-- Storage
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Product images are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'product-images');