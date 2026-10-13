// Paystack → Supabase webhook. Configure in the Paystack dashboard:
//   https://<project-ref>.supabase.co/functions/v1/paystack-webhook
// Deployed with verify_jwt = false (see supabase/config.toml); authenticity is
// checked with the HMAC-SHA512 signature instead.
import { reconcilePayment } from '../_shared/paystack.ts';

const SECRET = Deno.env.get('PAYSTACK_SECRET_KEY')!;

async function hmacSha512Hex(key: string, message: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const raw = await req.text();
  const signature = req.headers.get('x-paystack-signature') ?? '';
  if (!timingSafeEqual(await hmacSha512Hex(SECRET, raw), signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(raw);
  try {
    if (event.event === 'charge.success' && event.data?.reference) {
      // Re-verify with Paystack rather than trusting the payload alone.
      await reconcilePayment(event.data.reference);
    }
  } catch (e) {
    // Unknown references (stale retries, other apps on the same account) are ignored.
    console.error('Webhook handling failed', e);
  }
  return new Response('ok', { status: 200 });
});
