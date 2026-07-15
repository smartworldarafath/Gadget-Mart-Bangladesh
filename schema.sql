-- Schema for Gadget Mart Bangladesh (GMB)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    icon_url text,
    image_url text,
    parent_id uuid references public.categories(id) on delete set null,
    display_order integer default 0,
    is_featured boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    description text,
    short_description text,
    category_id uuid references public.categories(id) on delete set null,
    price decimal(12,2) not null default 0.00,
    original_price decimal(12,2),
    discount_amount decimal(12,2) generated always as (coalesce(original_price - price, 0.00)) stored,
    discount_percent decimal(5,2) generated always as (case when coalesce(original_price, 0.00) > 0 then round((coalesce(original_price - price, 0.00) / original_price) * 100, 2) else 0.00 end) stored,
    stock_quantity integer default 0,
    sku text,
    brand text default 'Generic',
    model text,
    color text,
    storage text,
    ram text,
    specifications jsonb default '{}'::jsonb,
    images text[] default array['/placeholder.jpg']::text[],
    thumbnail_url text default '/placeholder.jpg',
    is_featured boolean default false,
    is_exclusive_deal boolean default false,
    is_best_deal boolean default false,
    is_top_selling boolean default false,
    is_new_arrival boolean default false,
    is_active boolean default true,
    meta_title text,
    meta_description text,
    views_count integer default 0,
    sales_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CUSTOMERS TABLE (Profiles linked with Supabase Auth users)
create table public.customers (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name text,
    phone text,
    email text,
    address text,
    city text default 'Dhaka',
    district text,
    avatar_url text,
    is_admin boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. BANNERS TABLE
create table public.banners (
    id uuid default uuid_generate_v4() primary key,
    title text,
    image_url text not null,
    mobile_image_url text,
    link_url text,
    display_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDERS TABLE
create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    order_number text not null unique,
    customer_id uuid references public.customers(id) on delete set null,
    customer_name text not null,
    customer_phone text not null,
    customer_email text,
    shipping_address text not null,
    shipping_city text not null,
    shipping_district text not null,
    payment_method text not null default 'cash_on_delivery',
    payment_status text not null default 'pending', -- pending, paid, failed, refunded
    order_status text not null default 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled, returned
    subtotal decimal(12,2) not null default 0.00,
    shipping_charge decimal(12,2) not null default 0.00,
    discount decimal(12,2) not null default 0.00,
    total_amount decimal(12,2) not null default 0.00,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDER ITEMS TABLE
create table public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    product_image text,
    quantity integer not null default 1,
    unit_price decimal(12,2) not null default 0.00,
    total_price decimal(12,2) not null default 0.00
);

-- 7. WISHLIST TABLE
create table public.wishlist (
    id uuid default uuid_generate_v4() primary key,
    customer_id uuid references public.customers(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(customer_id, product_id)
);

-- 8. COUPONS TABLE
create table public.coupons (
    id uuid default uuid_generate_v4() primary key,
    code text not null unique,
    discount_type text not null default 'percent', -- percent, flat
    discount_value decimal(12,2) not null default 0.00,
    min_order_amount decimal(12,2) not null default 0.00,
    max_uses integer,
    used_count integer default 0,
    expires_at timestamp with time zone,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. REVIEWS TABLE
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete set null,
    customer_name text,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    is_approved boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set public read-access RLS policies
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;

-- Setup RLS Rules
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read products" on public.products for select using (true);
create policy "Allow public read banners" on public.banners for select using (true);
create policy "Allow public read coupons" on public.coupons for select using (true);
create policy "Allow public read reviews" on public.reviews for select using (true);

-- Category admin write rules
create policy "Admin categories access" on public.categories for all using (
    exists (select 1 from public.customers where id = auth.uid() and is_admin = true)
);
-- Product admin write rules
create policy "Admin products access" on public.products for all using (
    exists (select 1 from public.customers where id = auth.uid() and is_admin = true)
);

-- Customer profile rule
create policy "User profile access" on public.customers for all using (
    auth.uid() = id or exists (select 1 from public.customers where id = auth.uid() and is_admin = true)
);

-- Order check rule
create policy "User orders access" on public.orders for all using (
    customer_id = auth.uid() or exists (select 1 from public.customers where id = auth.uid() and is_admin = true)
);
create policy "Allow guest insert orders" on public.orders for insert with check (true);

-- Order items check rule
create policy "User order items access" on public.order_items for all using (
    exists (select 1 from public.orders where id = order_id and (customer_id = auth.uid() or exists (select 1 from public.customers where id = auth.uid() and is_admin = true)))
);
create policy "Allow guest insert order items" on public.order_items for insert with check (true);

-- Wishlist check rule
create policy "User wishlist access" on public.wishlist for all using (
    customer_id = auth.uid()
);
