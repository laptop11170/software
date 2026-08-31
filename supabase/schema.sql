-- ==============================================================================
-- DSRQ DIGITALS - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Customer & Multi-Admin RBAC)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  role text check (role in ('customer', 'fulfillment_agent', 'admin')) default 'customer',
  loyalty_points integer default 0,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS (Digital Tools & Subscriptions)
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  description text not null,
  delivery_type text check (delivery_type in ('shared_account', 'private_account', 'team_invite', 'license_key')) default 'team_invite',
  image_url text,
  badge text,
  rating_avg numeric(3,2) default 4.85,
  rating_count integer default 50,
  status text check (status in ('active', 'draft', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCT VARIANTS (Pricing & Duration Tiers)
create table if not exists public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  title text not null, -- e.g., "1 Month Access", "1 Year Subscription"
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  validity_days integer default 30,
  variant_type text default 'Standard', -- 'Shared Profile', 'Personal Invite', etc.
  stock_count integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. INVENTORY ITEMS (Encrypted Digital Credentials & License Keys)
create table if not exists public.inventory_items (
  id uuid default gen_random_uuid() primary key,
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  credentials_data jsonb not null, -- {"email": "...", "password": "...", "license_key": "..."}
  is_used boolean default false,
  assigned_to_order_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BUNDLES (Multi-Product Packs)
create table if not exists public.bundles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text not null,
  price numeric(10,2) not null,
  sale_price numeric(10,2) not null,
  badge text default 'Value Pack',
  image_url text,
  status text default 'active',
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
  payment_method text check (payment_method in ('easypaisa', 'jazzcash', 'bank_transfer', 'card', 'crypto')) not null,
  payment_status text check (payment_status in ('pending_proof', 'under_verification', 'paid', 'rejected')) default 'pending_proof',
  payment_proof_url text,
  fulfillment_status text check (fulfillment_status in ('pending', 'processing', 'fulfilled', 'refunded')) default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ORDER ITEMS & ASSIGNED DELIVERIES
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  price numeric(10,2) not null,
  delivered_credentials jsonb, -- Copy of assigned inventory item details for customer viewing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. COUPONS
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')) default 'percentage',
  discount_value numeric(10,2) not null,
  max_uses integer default 100,
  used_count integer default 0,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. FINANCIAL & AD SPEND EXPENSES
create table if not exists public.financial_records (
  id uuid default gen_random_uuid() primary key,
  record_date date not null,
  platform text not null, -- 'Meta Ads', 'Google Ads', 'Procurement'
  amount_spent numeric(10,2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read access for active catalog & variants
create policy "Public Products are readable by everyone" on public.products for select using (status = 'active');
create policy "Public Product Variants readable by everyone" on public.product_variants for select using (true);
create policy "Public Bundles readable by everyone" on public.bundles for select using (status = 'active');

-- Orders readable by order owner or admins
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id or auth.jwt() ->> 'role' = 'admin');
create policy "Users can create orders" on public.orders for insert with check (true);

-- Inventory items ONLY readable/manageable by Admins (Security Critical!)
create policy "Admins full control over inventory credentials" on public.inventory_items for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
