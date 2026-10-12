import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useCancelOrder, useOrder, queryKeys } from '../../src/hooks/queries';
import { getRestaurantById } from '../../src/services/api';
import { useCart } from '../../src/context/CartContext';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ScreenState';
import { PAYMENT_METHOD_DETAILS } from '../../src/components/PaymentMethodCard';
import { CartItem, OrderStatus } from '../../src/types';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, formatDate, formatNaira, getErrorMessage } from '../../src/lib/format';

const PROGRESS: OrderStatus[] = ['placed', 'preparing', 'on_the_way', 'delivered'];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { loadCart, items: cartItems } = useCart();
  const { data: order, isLoading, error, refetch, isRefetching } = useOrder(id);
  const cancel = useCancelOrder();
  const [isReordering, setIsReordering] = useState(false);

  if (isLoading) return <LoadingState style={styles.screen} />;
  if (error && !order) {
    return <ErrorState message={getErrorMessage(error, 'Could not load this order.')} onRetry={refetch} style={styles.screen} />;
  }
  if (!order) return <EmptyState emoji="🧾" title="Order not found" style={styles.screen} />;

  const statusStyle = ORDER_STATUS_STYLE[order.status];
  const canCancel = order.status === 'pending_payment' || order.status === 'placed';
  const needsPayment =
    order.status === 'pending_payment' && order.paymentMethod === 'paystack' && order.paymentStatus !== 'paid';
  const currentStep = PROGRESS.indexOf(order.status);

  const confirmCancel = () => {
    Alert.alert(
      'Cancel order?',
      order.paymentStatus === 'paid'
        ? 'Your payment will be refunded to your original payment method.'
        : 'The restaurant will not prepare this order.',
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: () =>
            cancel.mutate(order.id, {
              onError: (e) => Alert.alert('Could not cancel', getErrorMessage(e)),
            }),
        },
      ]
    );
  };

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
        const menuItem = restaurant.menu.find((m) => m.id === line.menuItemId && m.isAvailable);
        return menuItem
          ? [{ menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, imageUrl: menuItem.imageUrl, quantity: line.quantity }]
          : [];
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
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.light.primary} colors={[Colors.light.primary]} />
      }
    >
      {/* Status */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.meta}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.color + '20' }]}>
            <Ionicons name={statusStyle.icon} size={14} color={statusStyle.color} />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{ORDER_STATUS_LABEL[order.status]}</Text>
          </View>
        </View>

        {currentStep >= 0 && (
          <View style={styles.progress}>
            {PROGRESS.map((step, index) => {
              const done = index <= currentStep;
              return (
                <View key={step} style={styles.progressStep}>
                  <View style={[styles.progressDot, done && styles.progressDotDone]}>
                    {done && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                  <Text style={[styles.progressLabel, done && styles.progressLabelDone]}>{ORDER_STATUS_LABEL[step]}</Text>
                </View>
              );
            })}
          </View>
        )}

        {needsPayment && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push({ pathname: '/checkout/payment', params: { orderId: order.id } })}
          >
            <Text style={styles.primaryText}>Complete Payment · {formatNaira(order.total)}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{order.restaurantName}</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.rowBetween}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.quantity}× {item.name}
            </Text>
            <Text style={styles.value}>{formatNaira(item.lineTotal)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatNaira(order.subtotal)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Delivery fee</Text>
          <Text style={styles.value}>{order.deliveryFee === 0 ? 'Free' : formatNaira(order.deliveryFee)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatNaira(order.total)}</Text>
        </View>
      </View>

      {/* Delivery & payment */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery</Text>
        <Text style={styles.body}>{order.deliveryAddress.line1}</Text>
        <Text style={styles.meta}>
          {order.deliveryAddress.city}, {order.deliveryAddress.state} · {order.deliveryAddress.phone}
        </Text>
        {order.deliveryAddress.instructions ? <Text style={styles.meta}>{order.deliveryAddress.instructions}</Text> : null}
        {order.notes ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Note</Text>
            <Text style={styles.body}>{order.notes}</Text>
          </>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Payment</Text>
        <Text style={styles.body}>
          {PAYMENT_METHOD_DETAILS[order.paymentMethod].title} ·{' '}
          {order.paymentStatus === 'paid'
            ? 'Paid'
            : order.paymentStatus === 'refunded'
              ? 'Refunded'
              : order.paymentMethod === 'cash'
                ? 'Pay on delivery'
                : order.paymentStatus === 'failed'
                  ? 'Payment failed'
                  : 'Awaiting payment'}
        </Text>
      </View>

      {/* Actions */}
      {(order.status === 'delivered' || order.status === 'cancelled') && (
        <TouchableOpacity style={styles.outlineButton} onPress={reorder} disabled={isReordering}>
          {isReordering ? <ActivityIndicator color={Colors.light.primary} /> : <Text style={styles.outlineText}>Reorder</Text>}
        </TouchableOpacity>
      )}
      {canCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={confirmCancel} disabled={cancel.isPending}>
          {cancel.isPending ? <ActivityIndicator color={Colors.light.danger} /> : <Text style={styles.cancelText}>Cancel Order</Text>}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  orderNumber: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  meta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  progress: {
    flexDirection: 'row',
    marginTop: 16,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
  },
  progressDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  progressDotDone: {
    backgroundColor: Colors.light.success,
  },
  progressLabel: {
    fontSize: 11,
    color: '#AAA',
    textAlign: 'center',
  },
  progressLabelDone: {
    color: Colors.light.text,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  totalLabel: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  totalValue: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 8,
  },
  body: {
    fontSize: 15,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryText: {
    color: 'white',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  outlineText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.light.danger,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },
});
