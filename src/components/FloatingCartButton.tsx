import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { Ionicons } from '@expo/vector-icons';

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
      <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>

        <Text style={styles.buttonText}>View Cart</Text>

        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={18} color="white" />
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
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 32, // Pill shape
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
  buttonText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginRight: 12,
  },
  priceText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
