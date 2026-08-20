import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../src/context/CartContext';
import AddressCard from '../../src/components/AddressCard';
import PaymentMethodCard, { PaymentMethod } from '../../src/components/PaymentMethodCard';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartTotal, totalItems } = useCart();

  // Local state for the selected payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Same logic as cart screen
  const deliveryFee = cartTotal > 10000 ? 0 : 1000;
  const finalTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    // In a real app, you would send the order to your backend here
    // For now, we'll just navigate to the success screen
    router.push('/checkout/success');
  };

  // If the user somehow gets here with an empty cart, return them
  if (totalItems === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nothing to checkout</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Section: Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery to</Text>
          <AddressCard
            name="Opitien Ejiroghene"
            address="123 Ikenegbu layout, Owerri, Imo"
          />
        </View>

        {/* Section: Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <PaymentMethodCard
            method="card"
            isSelected={paymentMethod === 'card'}
            onSelect={setPaymentMethod}
          />
          <PaymentMethodCard
            method="transfer"
            isSelected={paymentMethod === 'transfer'}
            onSelect={setPaymentMethod}
          />
          <PaymentMethodCard
            method="cash"
            isSelected={paymentMethod === 'cash'}
            onSelect={setPaymentMethod}
          />
        </View>

        {/* Section: Order Summary (Reused from Cart) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₦{cartTotal.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₦{finalTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order (₦{finalTotal.toLocaleString()})</Text>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 12,
  },
  summaryContainer: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: Typography.sizes.medium,
    color: '#666',
  },
  summaryValue: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  placeOrderButton: {
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Typography.sizes.large,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
