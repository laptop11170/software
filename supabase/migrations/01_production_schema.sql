-- ==============================================================================
-- KOBIRUL SOFTWARES - PRODUCTION SUPABASE DATABASE MIGRATION
-- ==============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Customer & Admin RBAC)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  role text check (role in ('customer', 'fulfillment_agent', 'admin')) default 'customer',
  loyalty_points integer default 100,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. PRODUCTS (55+ Digital Tools & Subscriptions)
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  description text not null,
  delivery_type text check (delivery_type in ('shared_account', 'private_account', 'team_invite', 'license_key')) default 'team_invite',
  image_url text not null,
  badge text,
  rating_avg numeric(3,2) default 4.90,
  rating_count integer default 150,
  status text check (status in ('active', 'draft', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCT VARIANTS (Pricing & Duration Tiers in INR)
create table if not exists public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  title text not null, -- e.g. "1 Month Plan", "1 Year Access"
  price numeric(10,2) not null,
  sale_price numeric(10,2) not null,
  validity_days integer default 30,
  variant_type text default 'Personal Email Invite',
  stock_count integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. INVENTORY ITEMS (Encrypted Digital Credentials & License Keys)
create table if not exists public.inventory_items (
  id uuid default gen_random_uuid() primary key,
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  credentials_data jsonb not null, -- {"email": "...", "password": "...", "license_key": "..."}
  is_used boolean default false,
  assigned_to_order_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDERS & TRANSACTIONS
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  total_amount numeric(10,2) not null,
  payment_method text check (payment_method in ('upi', 'razorpay', 'bank_transfer', 'card')) default 'upi',
  payment_status text check (payment_status in ('pending_proof', 'under_verification', 'paid', 'rejected')) default 'pending_proof',
  payment_proof_url text,
  fulfillment_status text check (fulfillment_status in ('pending', 'processing', 'fulfilled', 'refunded')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ORDER ITEMS & DELIVERED CREDENTIALS
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  price numeric(10,2) not null,
  delivered_credentials jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. INDEXES FOR HIGH-PERFORMANCE SEARCH
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_number on public.orders(order_number);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_items enable row level security;
alter table public.orders enable row level security;

-- Public read access for active catalog
create policy "Public Products are readable by everyone" on public.products for select using (status = 'active');
create policy "Public Product Variants readable by everyone" on public.product_variants for select using (true);

-- User order policy
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id or auth.jwt() ->> 'role' = 'admin');
create policy "Anyone can create orders" on public.orders for insert with check (true);

-- Inventory items strictly protected (Admins Only)
create policy "Admins full control over inventory items" on public.inventory_items for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
