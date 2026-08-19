import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export default function FloatingCartButton() {
  const { totalItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // If the cart is empty, don't show the button at all
  if (totalItems === 0) {
    return null;
  }

  const handlePress = () => {
    // Navigate to the cart tab
    router.push('/(tabs)/cart');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>

        <Text style={styles.buttonText}>View Cart</Text>

        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.buttonText}>Clear Cart</Text>
        </TouchableOpacity>

        <Text style={styles.priceText}>₦{cartTotal.toLocaleString()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24, // Floats above the bottom of the screen
    left: 16,
    right: 16,
    zIndex: 100, // Make sure it stays on top of lists
  },
  button: {
    backgroundColor: '#FF0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
  buttonText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  priceText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
