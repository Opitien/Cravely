import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCart } from '../../src/context/CartContext';
import { useAddresses } from '../../src/hooks/queries';
import { placeOrder } from '../../src/services/api';
import AddressCard from '../../src/components/AddressCard';
import PaymentMethodCard from '../../src/components/PaymentMethodCard';
import { EmptyState, LoadingState } from '../../src/components/ScreenState';
import { PaymentMethod } from '../../src/types';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { formatNaira, getErrorMessage } from '../../src/lib/format';

const PAYMENT_METHODS: PaymentMethod[] = ['paystack', 'cash'];

export default function CheckoutScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { items, restaurant, subtotal, clearCart } = useCart();
  const addresses = useAddresses();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [notes, setNotes] = useState('');

  // Pre-select the default address once addresses load (or the newest one after adding).
  useEffect(() => {
    const list = addresses.data;
    if (!list || list.length === 0) return;
    if (!addressId || !list.some((a) => a.id === addressId)) {
      setAddressId((list.find((a) => a.isDefault) ?? list[0]).id);
    }
  }, [addresses.data, addressId]);

  const order = useMutation({
    mutationFn: placeOrder,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // The order now exists on the server; an unpaid one can be paid later from Orders.
      clearCart();
      if (paymentMethod === 'paystack') {
        router.replace({ pathname: '/checkout/payment', params: { orderId: created.id } });
      } else {
        router.replace({ pathname: '/checkout/success', params: { orderId: created.id } });
      }
    },
    onError: (error) => {
      // Prices or availability may have changed; refresh the menu so the cart can be reviewed.
      if (restaurant) queryClient.invalidateQueries({ queryKey: ['restaurant', restaurant.id] });
      Alert.alert('Could not place order', getErrorMessage(error));
    },
  });

  if (items.length === 0 || !restaurant) {
    return (
      <EmptyState
        emoji="🛒"
        title="Nothing to checkout"
        actionLabel="Browse Restaurants"
        onAction={() => router.navigate('/')}
        style={styles.safeArea}
      />
    );
  }

  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!addressId) {
      Alert.alert('Delivery address needed', 'Please add an address so we know where to deliver.');
      return;
    }
    order.mutate({
      restaurantId: restaurant.id,
      addressId,
      items,
      paymentMethod,
      notes,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Delivery address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deliver to</Text>
            {addresses.data && addresses.data.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/user-profile/address-new')}>
                <Text style={styles.link}>+ New address</Text>
              </TouchableOpacity>
            )}
          </View>

          {addresses.isLoading ? (
            <LoadingState style={{ paddingVertical: 24 }} />
          ) : addresses.data && addresses.data.length > 0 ? (
            addresses.data.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={address.id === addressId}
                onPress={() => setAddressId(address.id)}
              />
            ))
          ) : (
            <TouchableOpacity style={styles.addAddress} onPress={() => router.push('/user-profile/address-new')}>
              <Text style={styles.addAddressText}>+ Add a delivery address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <PaymentMethodCard
              key={method}
              method={method}
              isSelected={paymentMethod === method}
              onSelect={setPaymentMethod}
            />
          ))}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note for the restaurant</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. No onions, extra pepper"
            placeholderTextColor="#bbb"
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={300}
          />
        </View>

        {/* Order summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {items.map((item) => (
              <View key={item.menuItemId} style={styles.summaryRow}>
                <Text style={styles.summaryLabel} numberOfLines={1}>
                  {item.quantity}× {item.name}
                </Text>
                <Text style={styles.summaryValue}>{formatNaira(item.price * item.quantity)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
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
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, (order.isPending || !addressId) && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={order.isPending}
          accessibilityRole="button"
        >
          {order.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.placeOrderText}>
              {paymentMethod === 'paystack' ? 'Pay' : 'Place Order'} · {formatNaira(total)}
            </Text>
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 12,
  },
  link: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    marginBottom: 12,
  },
  addAddress: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.light.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  addAddressText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 12,
    minHeight: 72,
    fontSize: 15,
    color: Colors.light.text,
    textAlignVertical: 'top',
  },
  summaryContainer: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
  },
  restaurantName: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  summaryLabel: {
    flex: 1,
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
    flex: 1,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    color: 'white',
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
  },
});
