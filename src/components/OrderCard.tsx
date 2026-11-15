import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Order } from '../types';
import { ORDER_STATUS_LABEL, formatDate, formatNaira, orderStatusStyle } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Card, Icon, Pill, Text } from '../ui';

export default function OrderCard({ order, onPress, index = 0 }: { order: Order; onPress: () => void; index?: number }) {
  const t = useTheme();
  const styles = useStyles();
  const status = orderStatusStyle(order.status, t.colors);
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card onPress={onPress} animated index={index} accessibilityLabel={`${order.restaurantName} order, ${ORDER_STATUS_LABEL[order.status]}`}>
      <View style={styles.top}>
        {order.restaurantImageUrl ? (
          <Image source={{ uri: order.restaurantImageUrl }} style={styles.image} transition={200} />
        ) : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline" numberOfLines={1}>
            {order.restaurantName}
          </Text>
          <Text variant="footnote" tone="secondary">
            {formatDate(order.createdAt)} · {order.orderNumber}
          </Text>
        </View>
        <Icon name="chevron-forward" size={14} color={t.colors.tertiaryLabel} weight="semibold" />
      </View>

      <Text variant="footnote" tone="secondary" numberOfLines={1} style={styles.items}>
        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(' · ')}
      </Text>

      <View style={styles.bottom}>
        <Pill label={ORDER_STATUS_LABEL[order.status]} icon={status.icon} color={status.color} background={status.background} />
        <Text variant="subheadlineStrong">
          {formatNaira(order.total)}
          <Text variant="footnote" tone="secondary">
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
    borderTopWidth: t.hairline,
    borderTopColor: t.colors.separator,
  },
}));
