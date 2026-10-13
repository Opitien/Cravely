import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';
import { ORDER_STATUS_LABEL, formatDate, formatNaira, orderStatusStyle } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Card, Pill, Text } from '../ui';

export default function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const t = useTheme();
  const styles = useStyles();
  const status = orderStatusStyle(order.status, t.colors);
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card onPress={onPress} accessibilityLabel={`${order.restaurantName} order, ${ORDER_STATUS_LABEL[order.status]}`}>
      <View style={styles.top}>
        {order.restaurantImageUrl ? (
          <Image source={{ uri: order.restaurantImageUrl }} style={styles.image} transition={200} />
        ) : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="subheading" numberOfLines={1}>
            {order.restaurantName}
          </Text>
          <Text variant="caption" tone="muted">
            {formatDate(order.createdAt)} · {order.orderNumber}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} />
      </View>

      <Text variant="caption" tone="secondary" numberOfLines={1} style={styles.items}>
        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(' · ')}
      </Text>

      <View style={styles.bottom}>
        <Pill label={ORDER_STATUS_LABEL[order.status]} icon={status.icon} color={status.color} background={status.background} />
        <Text variant="bodyStrong">
          {formatNaira(order.total)}
          <Text variant="caption" tone="muted">
            {'  '}
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </Text>
        </Text>
      </View>
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  top: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  image: { width: 52, height: 52, borderRadius: t.radius.md, backgroundColor: t.colors.skeleton },
  items: { marginTop: t.spacing.md },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: t.spacing.md,
    paddingTop: t.spacing.md,
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
  },
}));
