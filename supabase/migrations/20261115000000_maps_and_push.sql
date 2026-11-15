-- Cravely: map coordinates + push notifications
--
-- 1. Restaurants and delivery addresses get a location (WGS84 lat/lng).
-- 2. place_order snapshots the address coordinates into orders.delivery_address.
-- 3. push_tokens stores each signed-in device's Expo push token.
-- 4. A trigger on orders calls the Expo Push API (via pg_net) whenever an order's status changes,
--    so the customer gets a notification in the phone's notification bar even with the app closed.

-- ─────────────────────────────────────────────────────────────
-- Coordinates
-- ─────────────────────────────────────────────────────────────
alter table public.restaurants
  add column if not exists lat double precision check (lat between -90 and 90),
  add column if not exists lng double precision check (lng between -180 and 180),
  add column if not exists address text;

alter table public.addresses
  add column if not exists lat double precision check (lat between -90 and 90),
  add column if not exists lng double precision check (lng between -180 and 180);

-- Seed locations for the starter restaurants (Lagos, Nigeria)
update public.restaurants set lat = 6.4474, lng = 3.4739, address = 'Admiralty Way, Lekki Phase 1' where name = 'Chicken Republic' and lat is null;
update public.restaurants set lat = 6.4305, lng = 3.4322, address = 'Ozumba Mbadiwe Ave, Victoria Island' where name = 'Domino''s Pizza' and lat is null;
update public.restaurants set lat = 6.4372, lng = 3.4870, address = 'Freedom Way, Lekki Phase 1' where name = 'Mega Chicken' and lat is null;
update public.restaurants set lat = 6.4289, lng = 3.4219, address = 'Adeola Odeku St, Victoria Island' where name = 'Cold Stone Creamery' and lat is null;
update public.restaurants set lat = 6.4507, lng = 3.4680, address = 'Admiralty Way, Lekki Phase 1' where name = 'The Place Restaurant' and lat is null;
update public.restaurants set lat = 6.4396, lng = 3.4486, address = 'Akin Adesola St, Victoria Island' where name = 'Burger King' and lat is null;
update public.restaurants set lat = 6.4551, lng = 3.3841, address = 'Awolowo Rd, Ikoyi' where name = 'Kilimanjaro' and lat is null;
update public.restaurants set lat = 6.4235, lng = 3.4150, address = 'Ahmadu Bello Way, Victoria Island' where name = 'McDonald''s' and lat is null;

-- Snapshot the coordinates on new orders too
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
      'state', v_address.state, 'phone', v_address.phone, 'instructions', v_address.instructions,
      'lat', v_address.lat, 'lng', v_address.lng
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

-- ─────────────────────────────────────────────────────────────
-- Push tokens (one row per device)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.push_tokens (
  token text primary key,                       -- ExponentPushToken[xxxxxxxx]
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('ios', 'android', 'web')),
  device_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists push_tokens_user_idx on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

drop policy if exists "read own push tokens" on public.push_tokens;
create policy "read own push tokens" on public.push_tokens
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "register own push token" on public.push_tokens;
create policy "register own push token" on public.push_tokens
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "update own push token" on public.push_tokens;
create policy "update own push token" on public.push_tokens
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "remove own push token" on public.push_tokens;
create policy "remove own push token" on public.push_tokens
  for delete to authenticated using ((select auth.uid()) = user_id);

drop trigger if exists push_tokens_updated_at on public.push_tokens;
create trigger push_tokens_updated_at before update on public.push_tokens
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Order status → push notification (Expo Push API over pg_net)
-- ─────────────────────────────────────────────────────────────
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_order_status()
returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_tokens text[];
  v_title text;
  v_body text;
  v_messages jsonb;
begin
  -- Only when the status actually changes (or an online payment is confirmed)
  if tg_op = 'UPDATE'
     and new.status = old.status
     and not (new.payment_status = 'paid' and old.payment_status <> 'paid') then
    return new;
  end if;

  select array_agg(token) into v_tokens from public.push_tokens where user_id = new.user_id;
  if v_tokens is null or array_length(v_tokens, 1) = 0 then
    return new;
  end if;

  v_title := new.restaurant_name;
  v_body := case new.status
    when 'placed'      then 'Order ' || new.order_number || ' confirmed. The kitchen has it! 🧾'
    when 'preparing'   then 'Your food is being prepared 🔥'
    when 'on_the_way'  then 'Your rider is on the way 🛵'
    when 'delivered'   then 'Delivered. Enjoy your meal! 🎉'
    when 'cancelled'   then 'Order ' || new.order_number || ' was cancelled.'
    when 'pending_payment' then 'Order ' || new.order_number || ' is waiting for payment.'
  end;
  if v_body is null then
    return new;
  end if;

  select jsonb_agg(jsonb_build_object(
      'to', t,
      'title', v_title,
      'body', v_body,
      'sound', 'default',
      'channelId', 'orders',
      'priority', 'high',
      'data', jsonb_build_object('orderId', new.id, 'status', new.status, 'url', '/orders/' || new.id)
    ))
    into v_messages
  from unnest(v_tokens) t;

  perform net.http_post(
    url := 'https://exp.host/--/api/v2/push/send',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Accept', 'application/json'),
    body := v_messages,
    timeout_milliseconds := 5000
  );
  return new;
end;
$$;

drop trigger if exists orders_notify_status on public.orders;
create trigger orders_notify_status
  after insert or update of status, payment_status on public.orders
  for each row execute function public.notify_order_status();

-- Realtime should carry the new columns too (table is already in the publication)
