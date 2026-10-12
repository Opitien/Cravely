import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';
import Typography from '../constants/Typography';
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, formatDate, formatNaira } from '../lib/format';
import { PAYMENT_METHOD_DETAILS } from './PaymentMethodCard';

export default function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const statusStyle = ORDER_STATUS_STYLE[order.status];
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
      <View style={styles.cardTop}>
        {order.restaurantImageUrl ? (
          <Image source={{ uri: order.restaurantImageUrl }} style={styles.restaurantImage} />
        ) : null}
        <View style={styles.cardInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>{order.restaurantName}</Text>
          <Text style={styles.orderMeta}>{formatDate(order.createdAt)}</Text>
          <Text style={styles.orderMeta}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} · {formatNaira(order.total)}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.color + '20' }]}>
          <Ionicons name={statusStyle.icon} size={14} color={statusStyle.color} />
          <Text style={[styles.statusText, { color: statusStyle.color }]}>{ORDER_STATUS_LABEL[order.status]}</Text>
        </View>
      </View>

      <View style={styles.itemsRow}>
        <Text style={styles.itemsPreview} numberOfLines={1}>
          {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#ccc" />
      </View>

      <View style={styles.paymentRow}>
        <Ionicons name="card-outline" size={14} color="#999" />
        <Text style={styles.paymentText}>{PAYMENT_METHOD_DETAILS[order.paymentMethod].title}</Text>
        <Text style={styles.orderId}>{order.orderNumber}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: '#111',
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: Typography.sizes.small,
    color: '#888',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  itemsPreview: {
    flex: 1,
    fontSize: Typography.sizes.small,
    color: '#666',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  paymentText: {
    fontSize: Typography.sizes.small,
    color: '#999',
    flex: 1,
  },
  orderId: {
    fontSize: Typography.sizes.small,
    color: '#bbb',
    fontWeight: Typography.weights.bold,
  },
});
