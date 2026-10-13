import React, { useState } from 'react';
import { Alert, RefreshControl, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, useCancelOrder, useOrder } from '../../src/hooks/queries';
import { getRestaurantById } from '../../src/services/api';
import { useCart } from '../../src/context/CartContext';
import { PAYMENT_METHOD_DETAILS } from '../../src/components/PaymentMethodCard';
import { CartItem, Order, OrderStatus } from '../../src/types';
import {
  ORDER_STATUS_DESCRIPTION,
  ORDER_STATUS_LABEL,
  formatDate,
  formatNaira,
  getErrorMessage,
  orderStatusStyle,
} from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import { Button, Card, Divider, EmptyState, ErrorState, LoadingState, SummaryRow, Text } from '../../src/ui';

const STEPS: { status: OrderStatus; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { status: 'placed', label: 'Order confirmed', icon: 'receipt' },
  { status: 'preparing', label: 'Preparing your food', icon: 'flame' },
  { status: 'on_the_way', label: 'Rider on the way', icon: 'bicycle' },
  { status: 'delivered', label: 'Delivered', icon: 'checkmark' },
];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { loadCart, items: cartItems } = useCart();
  const { data: order, isLoading, error, refetch, isRefetching } = useOrder(id);
  const cancel = useCancelOrder();
  const [isReordering, setIsReordering] = useState(false);

  if (isLoading) return <LoadingState />;
  if (error && !order) return <ErrorState message={getErrorMessage(error, 'Could not load this order.')} onRetry={refetch} />;
  if (!order) return <EmptyState emoji="🧾" title="Order not found" />;

  const status = orderStatusStyle(order.status, t.colors);
  const canCancel = order.status === 'pending_payment' || order.status === 'placed';
  const needsPayment =
    order.status === 'pending_payment' && order.paymentMethod === 'paystack' && order.paymentStatus !== 'paid';

  const confirmCancel = () =>
    Alert.alert(
      'Cancel this order?',
      order.paymentStatus === 'paid'
        ? 'Your payment will be refunded to your original payment method.'
        : 'The restaurant will not prepare this order.',
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: () => cancel.mutate(order.id, { onError: (e) => Alert.alert('Could not cancel', getErrorMessage(e)) }),
        },
      ]
    );

  const reorder = async () => {
    setIsReordering(true);
    try {
      const restaurant = await queryClient.fetchQuery({
        queryKey: queryKeys.restaurant(order.restaurantId),
        queryFn: () => getRestaurantById(order.restaurantId),
      });
      if (!restaurant || !restaurant.isOpen) {
        Alert.alert('Unavailable', `${order.restaurantName} isn't taking orders right now.`);
        return;
      }
      // Use today's menu prices; skip anything no longer sold.
      const items: CartItem[] = order.items.flatMap((line) => {
        const m = restaurant.menu.find((x) => x.id === line.menuItemId && x.isAvailable);
        return m ? [{ menuItemId: m.id, name: m.name, price: m.price, imageUrl: m.imageUrl, quantity: line.quantity }] : [];
      });
      if (items.length === 0) {
        Alert.alert('Unavailable', 'None of these items are available any more.');
        return;
      }
      const apply = () => {
        loadCart(restaurant, items);
        router.navigate('/cart');
      };
      if (cartItems.length > 0) {
        Alert.alert('Replace your cart?', 'Reordering will replace the items currently in your cart.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace', style: 'destructive', onPress: apply },
        ]);
      } else {
        apply();
      }
    } catch (e) {
      Alert.alert('Could not reorder', getErrorMessage(e));
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={t.colors.primary} colors={[t.colors.primary]} />}
    >
      {/* Status hero */}
      <Card style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: status.background }]}>
          <Ionicons name={status.icon} size={30} color={status.color} />
        </View>
        <Text variant="title" center style={{ marginTop: t.spacing.md }}>
          {ORDER_STATUS_LABEL[order.status]}
        </Text>
        <Text tone="secondary" center style={{ marginTop: 4 }}>
          {ORDER_STATUS_DESCRIPTION[order.status]}
        </Text>
        <Text variant="caption" tone="muted" center style={{ marginTop: t.spacing.sm }}>
          {order.orderNumber} · {formatDate(order.createdAt)}
        </Text>
        {needsPayment && (
          <Button
            title="Complete payment"
            trailing={formatNaira(order.total)}
            onPress={() => router.push({ pathname: '/checkout/payment', params: { orderId: order.id } })}
            style={{ marginTop: t.spacing.xl, alignSelf: 'stretch' }}
          />
        )}
      </Card>

      {order.status !== 'cancelled' && order.status !== 'pending_payment' && <Timeline order={order} />}

      {/* Items */}
      <Card>
        <Text variant="subheading" style={{ marginBottom: t.spacing.md }}>
          {order.restaurantName}
        </Text>
        {order.items.map((item) => (
          <SummaryRow key={item.id} label={`${item.quantity}×  ${item.name}`} value={formatNaira(item.lineTotal)} />
        ))}
        <Divider style={{ marginVertical: t.spacing.md }} />
        <SummaryRow label="Subtotal" value={formatNaira(order.subtotal)} />
        <SummaryRow label="Delivery fee" value={order.deliveryFee === 0 ? 'Free' : formatNaira(order.deliveryFee)} />
        <Divider style={{ marginVertical: t.spacing.md }} />
        <SummaryRow label="Total" value={formatNaira(order.total)} strong />
      </Card>

      {/* Delivery + payment */}
      <Card style={{ gap: t.spacing.lg }}>
        <InfoLine icon="location" title={order.deliveryAddress.label} lines={[
          `${order.deliveryAddress.line1}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}`,
          order.deliveryAddress.phone,
          order.deliveryAddress.instructions ?? '',
        ]} />
        {order.notes ? <InfoLine icon="chatbubble-ellipses" title="Note for restaurant" lines={[order.notes]} /> : null}
        <InfoLine
          icon={PAYMENT_METHOD_DETAILS[order.paymentMethod].icon}
          title={PAYMENT_METHOD_DETAILS[order.paymentMethod].title}
          lines={[paymentStatusText(order)]}
        />
      </Card>

      {(order.status === 'delivered' || order.status === 'cancelled') && (
        <Button title="Reorder" icon="repeat" variant="secondary" onPress={reorder} loading={isReordering} />
      )}
      {canCancel && (
        <Button title="Cancel order" variant="ghost" onPress={confirmCancel} loading={cancel.isPending} style={{ marginTop: -4 }} />
      )}
    </ScrollView>
  );
}

function paymentStatusText(order: Order) {
  if (order.paymentStatus === 'paid') return 'Paid';
  if (order.paymentStatus === 'refunded') return 'Refunded';
  if (order.paymentMethod === 'cash') return 'Pay your rider on delivery';
  if (order.paymentStatus === 'failed') return 'Payment failed';
  return 'Awaiting payment';
}

function Timeline({ order }: { order: Order }) {
  const t = useTheme();
  const styles = useStyles();
  const current = STEPS.findIndex((s) => s.status === order.status);

  return (
    <Card>
      {STEPS.map((step, i) => {
        const done = i <= current;
        const isCurrent = i === current;
        const last = i === STEPS.length - 1;
        return (
          <View key={step.status} style={styles.step}>
            <View style={styles.stepRail}>
              <View style={[styles.stepDot, done && styles.stepDotDone, isCurrent && styles.stepDotCurrent]}>
                <Ionicons name={done ? step.icon : 'ellipse'} size={done ? 14 : 6} color={done ? t.colors.textOnPrimary : t.colors.borderStrong} />
              </View>
              {!last && <View style={[styles.stepLine, i < current && styles.stepLineDone]} />}
            </View>
            <View style={[styles.stepText, last && { paddingBottom: 0 }]}>
              <Text variant={isCurrent ? 'bodyStrong' : 'body'} tone={done ? 'default' : 'muted'}>
                {step.label}
              </Text>
              {isCurrent && order.status !== 'delivered' && (
                <Text variant="caption" tone="primary">
                  In progress
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function InfoLine({ icon, title, lines }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; lines: string[] }) {
  const t = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.infoLine}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={t.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong">{title}</Text>
        {lines.filter(Boolean).map((line) => (
          <Text key={line} variant="caption" tone="secondary">
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl, paddingTop: t.spacing.sm, gap: t.spacing.lg, paddingBottom: 48 },
  hero: { alignItems: 'center', paddingVertical: t.spacing.xxl },
  heroIcon: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  step: { flexDirection: 'row', gap: t.spacing.md },
  stepRail: { alignItems: 'center', width: 28 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: t.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: t.colors.success },
  stepDotCurrent: { backgroundColor: t.colors.primary, borderWidth: 4, borderColor: t.colors.primarySoft, width: 32, height: 32, borderRadius: 16, marginHorizontal: -2 },
  stepLine: { flex: 1, width: 2, minHeight: 18, backgroundColor: t.colors.border, marginVertical: 2 },
  stepLineDone: { backgroundColor: t.colors.success },
  stepText: { flex: 1, paddingTop: 4, paddingBottom: t.spacing.lg },
  infoLine: { flexDirection: 'row', gap: t.spacing.md },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
