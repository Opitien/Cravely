import { OrderStatus } from '../types';

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

export const ORDER_STATUS_STYLE: Record<
  OrderStatus,
  { color: string; icon: 'time-outline' | 'receipt-outline' | 'flame-outline' | 'bicycle-outline' | 'checkmark-circle-outline' | 'close-circle-outline' }
> = {
  pending_payment: { color: '#9CA3AF', icon: 'time-outline' },
  placed: { color: '#8B5CF6', icon: 'receipt-outline' },
  preparing: { color: '#F59E0B', icon: 'flame-outline' },
  on_the_way: { color: '#3B82F6', icon: 'bicycle-outline' },
  delivered: { color: '#22C55E', icon: 'checkmark-circle-outline' },
  cancelled: { color: '#EF4444', icon: 'close-circle-outline' },
};

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
