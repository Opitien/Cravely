import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import { makeStyles } from '../theme';
import { Text } from '../ui';
import QuantityStepper from './QuantityStepper';

export default function CartItemCard({ item, last }: { item: CartItem; last?: boolean }) {
  const styles = useStyles();
  const { increaseQuantity, decreaseQuantity } = useCart();

  return (
    <View style={[styles.row, !last && styles.divider]}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} transition={200} /> : null}
      <View style={styles.details}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {item.name}
        </Text>
        <Text variant="caption" tone="muted">
          {formatNaira(item.price)} each
        </Text>
        <Text variant="bodyStrong" tone="primary" style={{ marginTop: 4 }}>
          {formatNaira(item.price * item.quantity)}
        </Text>
      </View>
      <QuantityStepper
        size="sm"
        quantity={item.quantity}
        onIncrease={() => increaseQuantity(item.menuItemId)}
        onDecrease={() => decreaseQuantity(item.menuItemId)}
      />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, paddingVertical: t.spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: t.colors.border },
  image: { width: 64, height: 64, borderRadius: t.radius.md, backgroundColor: t.colors.skeleton },
  details: { flex: 1, gap: 2 },
}));
