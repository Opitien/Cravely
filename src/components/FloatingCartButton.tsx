import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { formatNaira } from '../lib/format';

export default function FloatingCartButton() {
  const { totalItems, subtotal, restaurant } = useCart();
  const router = useRouter();

  if (totalItems === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cart')}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${totalItems} items, ${formatNaira(subtotal)}`}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>View Cart</Text>
          {restaurant && (
            <Text style={styles.restaurantText} numberOfLines={1}>
              {restaurant.name}
            </Text>
          )}
        </View>

        <Text style={styles.priceText}>{formatNaira(subtotal)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  button: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 32,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  restaurantText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 1,
  },
  priceText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
