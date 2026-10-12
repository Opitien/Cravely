import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCart } from '../../src/context/CartContext';
import CartItemCard from '../../src/components/CartItemCard';
import { EmptyState } from '../../src/components/ScreenState';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { formatNaira } from '../../src/lib/format';

export default function CartScreen() {
  const { items, restaurant, subtotal, clearCart } = useCart();
  const router = useRouter();

  if (items.length === 0 || !restaurant) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          subtitle="Looks like you haven't added anything yet."
          actionLabel="Browse Restaurants"
          onAction={() => router.navigate('/')}
        />
      </SafeAreaView>
    );
  }

  // Display estimate only — the server recalculates every amount when the order is placed.
  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + deliveryFee;
  const belowMinimum = subtotal < restaurant.minOrder;

  const confirmClear = () => {
    Alert.alert('Clear cart?', 'This removes every item from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  const renderHeader = () => (
    <TouchableOpacity
      style={styles.restaurantRow}
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.restaurantLabel}>Ordering from</Text>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
      </View>
      <Text style={styles.addMore}>Add more</Text>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatNaira(subtotal)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Free' : formatNaira(deliveryFee)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatNaira(total)}</Text>
      </View>

      {belowMinimum && (
        <Text style={styles.minOrderWarning}>
          Add {formatNaira(restaurant.minOrder - subtotal)} more to reach the {formatNaira(restaurant.minOrder)} minimum
          order.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.checkoutButton, belowMinimum && styles.buttonDisabled]}
        onPress={() => router.push('/checkout')}
        disabled={belowMinimum}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={confirmClear}>
        <Text style={styles.clearButtonText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={styles.screenTitle}>Your Cart</Text>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => item.menuItemId}
        renderItem={({ item }) => <CartItemCard item={item} />}
        ListHeaderComponent={renderHeader}
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
  },
  screenTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  restaurantImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  restaurantLabel: {
    fontSize: Typography.sizes.small,
    color: '#888',
  },
  restaurantName: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  addMore: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: 13,
  },
  summaryContainer: {
    marginTop: 8,
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
  minOrderWarning: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.light.danger,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
  },
  clearButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  clearButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
