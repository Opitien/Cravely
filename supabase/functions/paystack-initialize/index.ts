// Starts a Paystack checkout for one of the caller's orders.
// Body: { order_id: string, callback_url?: string }
import { corsHeaders, json } from '../_shared/cors.ts';
import { admin, getUser } from '../_shared/supabase.ts';
import { paystack, reconcilePayment } from '../_shared/paystack.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: 'Not authenticated' }, 401);

  try {
    const { order_id, callback_url } = await req.json();
    if (!order_id) return json({ error: 'order_id is required' }, 400);

    const { data: order } = await admin
      .from('orders')
      .select('id, user_id, total, status, payment_method, payment_status, paystack_reference, order_number')
      .eq('id', order_id)
      .single();

    if (!order || order.user_id !== user.id) return json({ error: 'Order not found' }, 404);
    if (order.payment_method !== 'paystack' || !order.paystack_reference) {
      return json({ error: 'This order is not paid online' }, 400);
    }
    if (order.payment_status === 'paid') return json({ error: 'Order is already paid' }, 409);
    if (order.status !== 'pending_payment') return json({ error: 'Order can no longer be paid' }, 409);

    // A previous attempt may have succeeded without the webhook landing yet.
    try {
      if ((await reconcilePayment(order.paystack_reference)) === 'paid') {
        return json({ error: 'Order is already paid' }, 409);
      }
    } catch {
      // Reference never reached Paystack (first attempt) — nothing to reconcile.
    }

    // Paystack references are single-use, so every attempt gets a fresh one.
    // The webhook/verify flow looks orders up by the current reference.
    const reference = `CRV_${crypto.randomUUID().replaceAll('-', '')}`;
    await admin
      .from('orders')
      .update({ paystack_reference: reference, payment_status: 'pending' })
      .eq('id', order.id)
      .neq('payment_status', 'paid');

    const { data } = await paystack('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: user.email,
        amount: order.total * 100, // kobo
        currency: 'NGN',
        reference,
        callback_url,
        metadata: { order_id: order.id, order_number: order.order_number, user_id: user.id },
      }),
    });

    return json({ authorization_url: data.authorization_url, reference: data.reference });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
