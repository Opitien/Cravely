-- ─────────────────────────────────────────────────────────────
-- DEMO ONLY: automatically moves orders through the delivery flow
-- until there is a real restaurant/rider side to do it.
--
--   placed ──20s──▶ preparing ──40s──▶ on_the_way ──40s──▶ delivered
--
-- Timings are measured from the order's last change (updated_at).
-- Cash orders are marked paid when they're delivered.
-- Orders awaiting online payment and cancelled orders are never touched.
--
-- Run in Supabase → SQL Editor. Kept outside migrations/ on purpose so it
-- never reaches production. To turn it off, run the block at the bottom.
-- ─────────────────────────────────────────────────────────────

create extension if not exists pg_cron;

create or replace function public.demo_advance_orders()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.orders
     set status = case status
                    when 'placed' then 'preparing'::public.order_status
                    when 'preparing' then 'on_the_way'::public.order_status
                    when 'on_the_way' then 'delivered'::public.order_status
                  end,
         payment_status = case
                            when status = 'on_the_way' and payment_method = 'cash'
                              then 'paid'::public.payment_status
                            else payment_status
                          end,
         paid_at = case
                     when status = 'on_the_way' and payment_method = 'cash' then now()
                     else paid_at
                   end
   where (status = 'placed'     and updated_at < now() - interval '20 seconds')
      or (status = 'preparing'  and updated_at < now() - interval '40 seconds')
      or (status = 'on_the_way' and updated_at < now() - interval '40 seconds');
$$;

-- Only the scheduler may run it, never app users.
revoke execute on function public.demo_advance_orders() from public, anon, authenticated;

-- Run every 10 seconds (re-running this file just updates the schedule).
select cron.schedule('demo-advance-orders', '10 seconds', 'select public.demo_advance_orders()');


-- ─── TURN OFF (run these two lines when you no longer want it) ───
-- select cron.unschedule('demo-advance-orders');
-- drop function if exists public.demo_advance_orders();
