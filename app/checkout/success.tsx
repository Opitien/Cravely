import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { clearCart } = useCart();

  // Clear the cart as soon as the user lands on the success screen
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Celebration Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={100} color={Colors.light.primary} />
        </View>

        {/* Success Text */}
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your delicious food is being prepared and will be delivered to you shortly.
        </Text>

        {/* Back to Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => Alert.alert('Track Order', 'Your food will arrive in 20 minutes!')}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    marginBottom: 24,
    // Add a subtle glow behind the checkmark
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Typography.sizes.medium,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  homeButtonText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  trackButton: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  trackButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
