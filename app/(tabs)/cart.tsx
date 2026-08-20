import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../src/context/CartContext';
import CartItemCard from '../../src/components/CartItemCard';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

export default function CartScreen() {
  const { items, cartTotal, clearCart, totalItems } = useCart();
  const router = useRouter();

  // Calculate delivery fee (Let's make it flat ₦1000 for simplicity if cart isn't empty)
  const deliveryFee = cartTotal > 10000 ? 0 : 1000;

  const finalTotal = cartTotal + deliveryFee;

  // Empty state view
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.browseButtonText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // The bottom summary area (Receipt)
  const renderFooter = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>₦{cartTotal.toLocaleString()}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₦{finalTotal.toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearCart}
      >
        <Text style={styles.clearButtonText}>Clear Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => router.push('/checkout')} // Placeholder for checkout screen
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.medium,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  browseButtonText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },

  // Summary Styles
  summaryContainer: {
    marginTop: 24,
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 16,
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

  clearButton: {
    borderColor: Colors.light.primary,
    borderWidth: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  clearButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
  },

  checkoutButton: {
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
  },
});
