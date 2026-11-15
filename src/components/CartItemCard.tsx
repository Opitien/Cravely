import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import { makeStyles } from '../theme';
import { Text, enter, useReduceMotion } from '../ui';
import QuantityStepper from './QuantityStepper';

export default function CartItemCard({ item, last, index = 0 }: { item: CartItem; last?: boolean; index?: number }) {
  const styles = useStyles();
  const reduce = useReduceMotion();
  const { increaseQuantity, decreaseQuantity } = useCart();

  return (
    <MotiView {...enter(index, reduce)} style={[styles.row, !last && styles.divider]}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} transition={200} /> : null}
      <View style={styles.details}>
        <Text variant="subheadlineStrong" numberOfLines={2}>
          {item.name}
        </Text>
        <Text variant="footnote" tone="secondary">
          {formatNaira(item.price)} each
        </Text>
        <Text variant="subheadlineStrong" tone="primary" style={{ marginTop: 4 }}>
          {formatNaira(item.price * item.quantity)}
        </Text>
      </View>
      <QuantityStepper
        size="sm"
        quantity={item.quantity}
        onIncrease={() => increaseQuantity(item.menuItemId)}
        onDecrease={() => decreaseQuantity(item.menuItemId)}
      />
    </MotiView>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, paddingVertical: t.spacing.md },
  divider: { borderBottomWidth: t.hairline, borderBottomColor: t.colors.separator },
  image: { width: 60, height: 60, borderRadius: t.radius.md, backgroundColor: t.colors.skeleton },
  details: { flex: 1, gap: 2 },
}));
