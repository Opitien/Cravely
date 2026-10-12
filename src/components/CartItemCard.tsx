import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CartItem } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import QuantityStepper from './QuantityStepper';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { increaseQuantity, decreaseQuantity } = useCart();

  return (
    <View style={styles.card}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.unitPrice}>{formatNaira(item.price)} each</Text>
        <Text style={styles.price}>{formatNaira(item.price * item.quantity)}</Text>
      </View>

      <QuantityStepper
        quantity={item.quantity}
        onIncrease={() => increaseQuantity(item.menuItemId)}
        onDecrease={() => decreaseQuantity(item.menuItemId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  name: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: Typography.sizes.small,
    color: '#888',
    marginBottom: 6,
  },
  price: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
});
