// Called by the app after the Paystack checkout closes.
// Body: { order_id: string }  →  { payment_status, status }
import { corsHeaders, json } from '../_shared/cors.ts';
import { admin, getUser } from '../_shared/supabase.ts';
import { reconcilePayment } from '../_shared/paystack.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: 'Not authenticated' }, 401);

  try {
    const { order_id } = await req.json();
    const { data: order } = await admin
      .from('orders')
      .select('id, user_id, paystack_reference')
      .eq('id', order_id)
      .single();
    if (!order || order.user_id !== user.id || !order.paystack_reference) {
      return json({ error: 'Order not found' }, 404);
    }

    const payment_status = await reconcilePayment(order.paystack_reference);
    const { data: fresh } = await admin.from('orders').select('status').eq('id', order.id).single();
    return json({ payment_status, status: fresh?.status });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
