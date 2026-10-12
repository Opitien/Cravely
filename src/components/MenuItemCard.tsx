import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { MenuItem, RestaurantWithMenu } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import QuantityStepper from './QuantityStepper';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: RestaurantWithMenu;
}

// A single menu item row. Shows "+" until it's in the cart, then a quantity stepper.
export default function MenuItemCard({ item, restaurant }: MenuItemCardProps) {
  const { addToCart, replaceCart, increaseQuantity, decreaseQuantity, quantityOf, restaurant: cartRestaurant } =
    useCart();
  const quantity = quantityOf(item.id);
  const canOrder = restaurant.isOpen && item.isAvailable;

  const handleAdd = () => {
    const result = addToCart(item, restaurant);
    if (result === 'different_restaurant') {
      Alert.alert(
        'Start a new cart?',
        `Your cart has items from ${cartRestaurant?.name}. Clear it and add items from ${restaurant.name} instead?`,
        [
          { text: 'Keep current cart', style: 'cancel' },
          { text: 'Start new cart', style: 'destructive', onPress: () => replaceCart(item, restaurant) },
        ]
      );
    }
  };

  return (
    <View style={[styles.card, !canOrder && styles.cardDisabled]}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatNaira(item.price)}</Text>
          {!item.isAvailable ? (
            <Text style={styles.soldOut}>Sold out</Text>
          ) : !restaurant.isOpen ? null : quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              onIncrease={() => increaseQuantity(item.id)}
              onDecrease={() => decreaseQuantity(item.id)}
            />
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
              accessibilityLabel={`Add ${item.name} to cart`}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  soldOut: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.danger,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
});
