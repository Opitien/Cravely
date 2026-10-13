import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCart } from '../../src/context/CartContext';
import { useAddresses } from '../../src/hooks/queries';
import { placeOrder } from '../../src/services/api';
import AddressCard from '../../src/components/AddressCard';
import PaymentMethodCard from '../../src/components/PaymentMethodCard';
import { PaymentMethod } from '../../src/types';
import { formatNaira, getErrorMessage } from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import {
  BottomBar,
  Button,
  Card,
  Divider,
  EmptyState,
  SectionHeader,
  Skeleton,
  SummaryRow,
  Text,
  TextField,
} from '../../src/ui';

const PAYMENT_METHODS: PaymentMethod[] = ['paystack', 'cash'];

export default function CheckoutScreen() {
  const t = useTheme();
  const styles = useStyles();
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
      router.replace({
        pathname: paymentMethod === 'paystack' ? '/checkout/payment' : '/checkout/success',
        params: { orderId: created.id },
      });
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
        title="Nothing to check out"
        actionLabel="Browse restaurants"
        onAction={() => router.navigate('/')}
      />
    );
  }

  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!addressId) {
      Alert.alert('Add a delivery address', 'We need to know where to bring your food.');
      return;
    }
    order.mutate({ restaurantId: restaurant.id, addressId, items, paymentMethod, notes });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Delivery address"
          action={addresses.data?.length ? 'Add new' : undefined}
          onAction={() => router.push('/user-profile/address-new')}
          style={styles.sectionHeader}
        />
        {addresses.isLoading ? (
          <Skeleton height={84} radius={16} />
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
          <Pressable
            style={({ pressed }) => [styles.addAddress, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/user-profile/address-new')}
            accessibilityRole="button"
          >
            <Ionicons name="add-circle" size={22} color={t.colors.primary} />
            <Text variant="bodyStrong" tone="primary">
              Add a delivery address
            </Text>
          </Pressable>
        )}

        <SectionHeader title="Payment" style={styles.sectionHeader} />
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard key={method} method={method} isSelected={paymentMethod === method} onSelect={setPaymentMethod} />
        ))}

        <SectionHeader title="Note for the restaurant" style={styles.sectionHeader} />
        <TextField
          placeholder="Allergies, extra pepper, no onions…"
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={300}
        />

        <SectionHeader title="Order summary" style={styles.sectionHeader} />
        <Card>
          <Text variant="label" tone="muted" style={{ marginBottom: t.spacing.md }}>
            {restaurant.name}
          </Text>
          {items.map((item) => (
            <SummaryRow key={item.menuItemId} label={`${item.quantity}×  ${item.name}`} value={formatNaira(item.price * item.quantity)} />
          ))}
          <Divider style={{ marginVertical: t.spacing.md }} />
          <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
          <SummaryRow label="Delivery fee" value={deliveryFee === 0 ? 'Free' : formatNaira(deliveryFee)} />
          <Divider style={{ marginVertical: t.spacing.md }} />
          <SummaryRow label="Total" value={formatNaira(total)} strong />
        </Card>

        <View style={styles.secure}>
          <Ionicons name="lock-closed" size={13} color={t.colors.textMuted} />
          <Text variant="caption" tone="muted">
            Payments are processed securely by Paystack
          </Text>
        </View>
      </ScrollView>

      <BottomBar>
        <Button
          title={paymentMethod === 'paystack' ? 'Pay now' : 'Place order'}
          trailing={formatNaira(total)}
          icon={paymentMethod === 'paystack' ? 'lock-closed' : undefined}
          onPress={handlePlaceOrder}
          loading={order.isPending}
          disabled={!addressId}
        />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl, paddingTop: t.spacing.sm, paddingBottom: t.spacing.xxxl },
  sectionHeader: { paddingHorizontal: 0, marginTop: t.spacing.xl },
  addAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.sm,
    paddingVertical: t.spacing.xl,
    borderRadius: t.radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: t.colors.primary,
    backgroundColor: t.colors.primarySoft,
  },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: t.spacing.xl,
  },
}));
