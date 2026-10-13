import { OrderStatus } from '../types';
import type { Theme } from '../theme';

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatDeliveryTime(min: number, max: number) {
  return `${min}-${max} min`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting payment',
  placed: 'Order placed',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

type StatusIcon =
  | 'time-outline'
  | 'receipt-outline'
  | 'flame-outline'
  | 'bicycle-outline'
  | 'checkmark-circle-outline'
  | 'close-circle-outline';

/** Colours and icon for an order status, taken from the active theme. */
export function orderStatusStyle(
  status: OrderStatus,
  c: Theme['colors']
): { color: string; background: string; icon: StatusIcon } {
  switch (status) {
    case 'pending_payment':
      return { color: c.textSecondary, background: c.surfaceMuted, icon: 'time-outline' };
    case 'placed':
      return { color: c.violet, background: c.violetSoft, icon: 'receipt-outline' };
    case 'preparing':
      return { color: c.warning, background: c.warningSoft, icon: 'flame-outline' };
    case 'on_the_way':
      return { color: c.info, background: c.infoSoft, icon: 'bicycle-outline' };
    case 'delivered':
      return { color: c.success, background: c.successSoft, icon: 'checkmark-circle-outline' };
    case 'cancelled':
      return { color: c.danger, background: c.dangerSoft, icon: 'close-circle-outline' };
  }
}

/** One-line description shown under the status on the tracking screen. */
export const ORDER_STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  pending_payment: 'Complete payment to send your order to the restaurant.',
  placed: 'The restaurant has received your order.',
  preparing: 'Your food is being prepared.',
  on_the_way: 'Your rider is on the way to you.',
  delivered: 'Enjoy your meal!',
  cancelled: 'This order was cancelled.',
};

export function isActiveOrder(status: OrderStatus) {
  return status === 'pending_payment' || status === 'placed' || status === 'preparing' || status === 'on_the_way';
}

// Turns Supabase/Postgres/network errors into something a customer can read.
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  const message =
    typeof error === 'string'
      ? error
      : typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string'
        ? (error as any).message
        : '';
  if (!message) return fallback;
  if (/network request failed|failed to fetch/i.test(message)) {
    return 'No internet connection. Please check your network and try again.';
  }
  return message;
}
