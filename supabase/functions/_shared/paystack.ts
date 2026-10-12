import { admin } from './supabase.ts';

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!;
const PAYSTACK_API = 'https://api.paystack.co';

// deno-lint-ignore no-explicit-any
export async function paystack<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json();
  if (!res.ok || body.status === false) {
    throw new Error(body.message ?? `Paystack request failed (${res.status})`);
  }
  return body;
}

/**
 * Ask Paystack for the transaction's real state and, if it was paid in full,
 * mark the order paid. Safe to call repeatedly (from the app and the webhook).
 * Returns the order's payment_status after reconciliation.
 */
export async function reconcilePayment(reference: string): Promise<'pending' | 'paid' | 'failed'> {
  const { data: order, error } = await admin
    .from('orders')
    .select('id, total, payment_status, status')
    .eq('paystack_reference', reference)
    .single();
  if (error || !order) throw new Error('Order not found for reference');
  if (order.payment_status === 'paid') return 'paid';

  const { data: tx } = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);

  if (tx.status === 'success') {
    // Never trust amounts from the client: compare against what the DB says the order costs.
    if (tx.currency !== 'NGN' || tx.amount !== order.total * 100) {
      console.error('Amount mismatch', { reference, expected: order.total * 100, got: tx.amount });
      await admin.from('orders').update({ payment_status: 'failed' }).eq('id', order.id);
      return 'failed';
    }
    await admin
      .from('orders')
      .update({
        payment_status: 'paid',
        paid_at: tx.paid_at ?? new Date().toISOString(),
        // A user may have cancelled while paying; don't resurrect a cancelled order.
        ...(order.status === 'pending_payment' ? { status: 'placed' } : {}),
      })
      .eq('id', order.id)
      .neq('payment_status', 'paid');
    return 'paid';
  }

  if (tx.status === 'failed' || tx.status === 'abandoned' || tx.status === 'reversed') {
    if (order.payment_status === 'pending') {
      await admin.from('orders').update({ payment_status: 'failed' }).eq('id', order.id);
    }
    return 'failed';
  }

  return 'pending'; // ongoing / processing / queued
}
