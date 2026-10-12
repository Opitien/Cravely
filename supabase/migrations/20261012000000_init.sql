-- Cravely: initial schema
-- Money is stored as whole Naira (integer). Paystack amounts are converted to kobo (x100) server-side.

-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────
create type public.order_status as enum (
  'pending_payment', -- created, waiting for online payment
  'placed',          -- confirmed (paid online, or cash on delivery)
  'preparing',
  'on_the_way',
  'delivered',
  'cancelled'
);

create type public.payment_method as enum ('paystack', 'cash');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null,
  sort_order int not null default 0
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  cuisine text not null,                      -- display label e.g. "Chicken • Fast Food"
  tags text[] not null default '{}',          -- lowercase, matched against categories.slug
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  delivery_min_minutes int not null default 20,
  delivery_max_minutes int not null default 40,
  delivery_fee int not null default 0 check (delivery_fee >= 0),
  min_order int not null default 0 check (min_order >= 0),
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  description text not null default '',
  price int not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index menu_items_restaurant_idx on public.menu_items (restaurant_id);

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, restaurant_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  line1 text not null check (length(trim(line1)) > 0),
  city text not null check (length(trim(city)) > 0),
  state text not null check (length(trim(state)) > 0),
  phone text not null check (length(trim(phone)) >= 7),
  instructions text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_user_idx on public.addresses (user_id);
-- At most one default address per user
create unique index addresses_one_default_idx on public.addresses (user_id) where is_default;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique
    default ('CRV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id),
  restaurant_name text not null,
  restaurant_image_url text,
  delivery_address jsonb not null,            -- snapshot, so later address edits don't rewrite history
  notes text,
  subtotal int not null check (subtotal >= 0),
  delivery_fee int not null check (delivery_fee >= 0),
  total int not null check (total >= 0),
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pending',
  paystack_reference text unique,
  paid_at timestamptz,
  status public.order_status not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_created_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name text not null,
  unit_price int not null check (unit_price >= 0),
  quantity int not null check (quantity between 1 and 50),
  line_total int not null check (line_total >= 0)
);
create index order_items_order_idx on public.order_items (order_id);

-- ─────────────────────────────────────────────────────────────
-- Triggers
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- Create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.favorites enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Catalogue is public read-only
create policy "categories are public" on public.categories for select using (true);
create policy "restaurants are public" on public.restaurants for select using (true);
create policy "menu items are public" on public.menu_items for select using (true);

-- Profiles: own row only
create policy "read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Favorites: own rows only
create policy "read own favorites" on public.favorites
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "add own favorites" on public.favorites
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "remove own favorites" on public.favorites
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Addresses: own rows only
create policy "read own addresses" on public.addresses
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "add own addresses" on public.addresses
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own addresses" on public.addresses
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own addresses" on public.addresses
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Orders: clients may only READ their own. Writes go through place_order / cancel_order
-- (security definer) and the Paystack edge functions (service role).
create policy "read own orders" on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "read own order items" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
  );

-- ─────────────────────────────────────────────────────────────
-- RPC: place_order — prices are always computed from the database
-- p_items: [{ "menu_item_id": uuid, "quantity": int }, ...]
-- ─────────────────────────────────────────────────────────────
create or replace function public.place_order(
  p_restaurant_id uuid,
  p_address_id uuid,
  p_items jsonb,
  p_payment_method public.payment_method,
  p_notes text default null
)
returns public.orders
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_restaurant public.restaurants;
  v_address public.addresses;
  v_order public.orders;
  v_subtotal int := 0;
  v_item record;
  v_count int := 0;
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty';
  end if;

  select * into v_restaurant from public.restaurants where id = p_restaurant_id;
  if not found then
    raise exception 'Restaurant not found';
  end if;
  if not v_restaurant.is_open then
    raise exception '% is currently closed', v_restaurant.name;
  end if;

  select * into v_address from public.addresses where id = p_address_id and user_id = v_user;
  if not found then
    raise exception 'Please choose a delivery address';
  end if;

  -- Validate every line against the live menu
  for v_item in
    select (e ->> 'menu_item_id')::uuid as menu_item_id, (e ->> 'quantity')::int as quantity
    from jsonb_array_elements(p_items) e
  loop
    if v_item.quantity is null or v_item.quantity < 1 or v_item.quantity > 50 then
      raise exception 'Invalid quantity';
    end if;
    perform 1 from public.menu_items m
      where m.id = v_item.menu_item_id and m.restaurant_id = p_restaurant_id and m.is_available;
    if not found then
      raise exception 'An item in your cart is no longer available. Please review your cart.';
    end if;
  end loop;

  select coalesce(sum(m.price * l.quantity), 0)::int, count(*)
    into v_subtotal, v_count
  from (
    select (e ->> 'menu_item_id')::uuid as menu_item_id, sum((e ->> 'quantity')::int) as quantity
    from jsonb_array_elements(p_items) e group by 1
  ) l
  join public.menu_items m on m.id = l.menu_item_id;

  if v_subtotal < v_restaurant.min_order then
    raise exception 'Minimum order for % is ₦%', v_restaurant.name, v_restaurant.min_order;
  end if;

  insert into public.orders (
    user_id, restaurant_id, restaurant_name, restaurant_image_url, delivery_address, notes,
    subtotal, delivery_fee, total, payment_method, payment_status, paystack_reference, status
  ) values (
    v_user, v_restaurant.id, v_restaurant.name, v_restaurant.image_url,
    jsonb_build_object(
      'label', v_address.label, 'line1', v_address.line1, 'city', v_address.city,
      'state', v_address.state, 'phone', v_address.phone, 'instructions', v_address.instructions
    ),
    nullif(trim(p_notes), ''),
    v_subtotal, v_restaurant.delivery_fee, v_subtotal + v_restaurant.delivery_fee,
    p_payment_method, 'pending'::public.payment_status,
    case when p_payment_method = 'paystack'
      then 'CRV_' || replace(gen_random_uuid()::text, '-', '') end,
    case when p_payment_method = 'paystack'
      then 'pending_payment'::public.order_status
      else 'placed'::public.order_status end
  )
  returning * into v_order;

  insert into public.order_items (order_id, menu_item_id, name, unit_price, quantity, line_total)
  select v_order.id, m.id, m.name, m.price, l.quantity, m.price * l.quantity
  from (
    select (e ->> 'menu_item_id')::uuid as menu_item_id, sum((e ->> 'quantity')::int)::int as quantity
    from jsonb_array_elements(p_items) e group by 1
  ) l
  join public.menu_items m on m.id = l.menu_item_id;

  return v_order;
end;
$$;

-- RPC: cancel_order — only before the restaurant starts preparing
create or replace function public.cancel_order(p_order_id uuid)
returns public.orders
language plpgsql security definer set search_path = '' as $$
declare
  v_order public.orders;
begin
  update public.orders
     set status = 'cancelled'::public.order_status,
         -- A paid order keeps 'paid' so it shows up for refunding.
         payment_status = case when payment_status = 'paid'
                            then 'paid'::public.payment_status
                            else 'failed'::public.payment_status end
   where id = p_order_id
     and user_id = auth.uid()
     and status in ('pending_payment', 'placed')
  returning * into v_order;

  if not found then
    raise exception 'This order can no longer be cancelled';
  end if;
  return v_order;
end;
$$;

revoke all on function public.place_order(uuid, uuid, jsonb, public.payment_method, text) from public, anon;
grant execute on function public.place_order(uuid, uuid, jsonb, public.payment_method, text) to authenticated;
revoke all on function public.cancel_order(uuid) from public, anon;
grant execute on function public.cancel_order(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Realtime: live order status updates
-- ─────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.orders;
