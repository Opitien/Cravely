# Cravely

Food delivery app for iOS, Android and web — Expo (React Native) + Supabase + Paystack.

## Architecture

```
app/                      Screens (expo-router: one file = one route)
  _layout.tsx             Providers, auth guard (Stack.Protected), splash, error boundary
  (tabs)/                 Home · Orders · Cart · Favourites
  auth/                   Login · Sign up · Forgot password
  restaurant/[id].tsx     Menu
  checkout/               Checkout → Paystack payment → Success
  orders/[id].tsx         Live order tracking, pay now, cancel, reorder
  user-profile/           Profile, edit, addresses, change password, delete account
src/
  lib/supabase.ts         Supabase client (session persisted in AsyncStorage)
  services/api.ts         Every backend call (the only place that talks to Supabase)
  hooks/queries.ts        React Query hooks: caching, retries, optimistic favourites, realtime orders
  context/                AuthContext (session) · CartContext (persisted, single-restaurant cart)
supabase/
  migrations/             Schema, row-level security, place_order / cancel_order RPCs
  seed.sql                Starter restaurants and menus
  functions/              Edge functions: paystack-initialize, paystack-verify, paystack-webhook, delete-account
```

**Money is never trusted from the app.** `place_order` recomputes every price from the database, and
an order is only marked paid after the server verifies the transaction with Paystack (amount and currency
checked), either from the app returning or from the signed webhook.

## 1. Supabase setup

1. Create a project at <https://supabase.com>.
2. Apply the schema and seed data, either:
   - **SQL editor:** paste `supabase/migrations/20261012000000_init.sql`, run; then `supabase/seed.sql`, run.
   - **CLI:** `npx supabase login`, `npx supabase link --project-ref <ref>`, `npx supabase db push`, then run `seed.sql` in the SQL editor.
3. **Authentication → URL Configuration → Redirect URLs**, add:
   - `cravely://**` (installed app)
   - `exp://**` (Expo Go during development)
   - your web domain, e.g. `https://cravely.app/**`
4. **Authentication → Providers → Email:** keep "Confirm email" on for production. Configure a custom SMTP
   server (Authentication → Emails) — Supabase's built-in mailer is rate-limited and not meant for production.

## 2. Paystack setup

1. Get your secret key from Paystack → Settings → API Keys & Webhooks (use the **test** key first).
2. Deploy the edge functions and set secrets:
   ```sh
   npx supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx
   npx supabase functions deploy paystack-initialize
   npx supabase functions deploy paystack-verify
   npx supabase functions deploy paystack-webhook --no-verify-jwt
   npx supabase functions deploy delete-account
   ```
3. In Paystack → Settings → API Keys & Webhooks, set the **Webhook URL** to
   `https://<project-ref>.supabase.co/functions/v1/paystack-webhook`.

Test cards: <https://paystack.com/docs/payments/test-payments>.

## 3. Run the app

```sh
cp .env.example .env      # fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
npm start
```

## 4. Release

- **Mobile:** `npm i -g eas-cli`, `eas login`, `eas init`, add the two `EXPO_PUBLIC_*` variables as EAS
  environment variables (`eas env:create`), then `eas build --profile production` and `eas submit`.
- **Web:** Vercel runs `npm run build` (see `vercel.json`); add the two `EXPO_PUBLIC_*` variables in the
  Vercel project settings.
- Before submitting to the stores, replace the URLs in `src/constants/Links.ts` with your real
  privacy policy, terms and support email.

## Operating the restaurant side

There is no restaurant dashboard yet. Until there is, manage data in the Supabase Table Editor:

- **Menus / opening hours:** edit `restaurants` (`is_open`, `delivery_fee`, `min_order`) and `menu_items`
  (`price`, `is_available`).
- **Order progress:** set `orders.status` to `preparing` → `on_the_way` → `delivered`.
  Customers see the change live on the Orders screen.
- **Refunds:** a cancelled order with `payment_status = 'paid'` needs a refund — issue it from the
  Paystack dashboard, then set `payment_status` to `refunded`.
