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

## 5. Custom auth emails (Resend)

By default Supabase sends confirmation/reset emails from its own shared mailer (low rate limit, generic
template, and genuinely not meant for production). Point it at [Resend](https://resend.com) instead and
use the branded templates in `supabase/email-templates/`:

1. **Fix the localhost redirect first.** Supabase → **Authentication → URL Configuration → Site URL** is
   probably still the default `http://localhost:3000` — that's why confirmation links land on localhost.
   Set it to `https://getcravely.vercel.app` (or your custom domain), and make sure **Redirect URLs**
   includes `cravely://**`, `exp://**`, and that same web URL.
2. **Resend account.** Sign up at resend.com. Without a verified domain you can still send, but only to
   the email address you signed up with (Resend's test-mode restriction) — fine for trying this out, but
   real users' confirmation emails won't arrive until you verify a domain (Domains → Add Domain → add the
   DNS records it gives you). Any domain works, it doesn't need to match the app.
3. **Get an API key.** Resend dashboard → API Keys → Create API Key.
4. **Point Supabase's SMTP at Resend.** Supabase → Authentication → **SMTP Settings** → enable custom SMTP:
   - Host: `smtp.resend.com`
   - Port: `465` (or `587`)
   - Username: `resend`
   - Password: the API key from step 3
   - Sender email: an address on your verified domain (e.g. `cravely@yourdomain.com`); until a domain is
     verified, Resend only accepts `onboarding@resend.dev` as the sender.
5. **Swap in the branded templates.** Supabase → Authentication → **Email Templates**:
   - **Confirm signup** → paste `supabase/email-templates/confirm-signup.html`
   - **Reset password** → paste `supabase/email-templates/reset-password.html`

   Both use Supabase's own `{{ .ConfirmationURL }}` / `{{ .Email }}` variables, so no other config changes.

## 6. Push notifications (Firebase)

The app already does everything on its side — permission + token registration (`src/lib/notifications.ts`),
token storage (`push_tokens` table), and a database trigger that calls the Expo Push API whenever an
order's status changes (`supabase/migrations/20261115000000_maps_and_push.sql`). All that's missing is
Firebase credentials, because Expo's push service delivers Android notifications through FCM:

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com) (free).
2. **Add an Android app** to it with package name `com.cravely.app` (matches `app.json` → `android.package`).
   Download the generated **`google-services.json`** and drop it in the project root — `app.config.js`
   picks it up automatically if it exists.
3. **Enable the Cloud Messaging API (V1)**: Firebase project → ⚙️ Project settings → Cloud Messaging —
   turn it on if it isn't already.
4. **Create a service account key** for FCM: Google Cloud Console → IAM & Admin → Service Accounts →
   the Firebase-generated one → Keys → Add key → JSON. This is what EAS needs to send pushes on your behalf.
5. **Upload it to EAS**: `eas credentials` → Android → select your profile → Google Service Account →
   upload the JSON from step 4.
6. Rebuild with `eas build --profile production` (a Firebase-less build silently falls back to
   `{ status: 'error' }` from `registerForPushAsync`, which is what you're seeing until this is done).

Apply the `maps_and_push` migration if you haven't (`supabase db push`, or paste it in the SQL editor) —
that's what creates `push_tokens` and the order-status trigger.

## Operating the restaurant side

There is no restaurant dashboard yet. Until there is, manage data in the Supabase Table Editor:

- **Menus / opening hours:** edit `restaurants` (`is_open`, `delivery_fee`, `min_order`) and `menu_items`
  (`price`, `is_available`).
- **Order progress:** set `orders.status` to `preparing` → `on_the_way` → `delivered`.
  Customers see the change live on the Orders screen.
- **Refunds:** a cancelled order with `payment_status = 'paid'` needs a refund — issue it from the
  Paystack dashboard, then set `payment_status` to `refunded`.
