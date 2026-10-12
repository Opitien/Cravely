import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../../src/hooks/queries';
import { PAYMENT_METHOD_DETAILS } from '../../src/components/PaymentMethodCard';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { formatNaira } from '../../src/lib/format';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order } = useOrder(orderId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={100} color={Colors.light.primary} />
        </View>

        <Text style={styles.title}>Order Placed!</Text>
        {order && <Text style={styles.orderId}>Order {order.orderNumber} confirmed</Text>}

        {order && (
          <View style={styles.receiptBox}>
            <Text style={styles.receiptLabel}>{order.paymentStatus === 'paid' ? 'Amount Paid' : 'Amount Due'}</Text>
            <Text style={styles.receiptValue}>{formatNaira(order.total)}</Text>

            <Text style={[styles.receiptLabel, { marginTop: 12 }]}>Payment Method</Text>
            <Text style={styles.receiptValue}>{PAYMENT_METHOD_DETAILS[order.paymentMethod].title}</Text>

            <Text style={[styles.receiptLabel, { marginTop: 12 }]}>From</Text>
            <Text style={styles.receiptValue}>{order.restaurantName}</Text>
          </View>
        )}

        <Text style={styles.subtitle}>
          {order?.paymentMethod === 'cash'
            ? 'Please have the exact amount ready when your rider arrives.'
            : 'The restaurant has received your order and will start preparing it shortly.'}
        </Text>

        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace(`/orders/${orderId}`)}>
          <Text style={styles.homeButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trackButton} onPress={() => router.dismissTo('/')}>
          <Text style={styles.trackButtonText}>Back to Home</Text>
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
  orderId: {
    fontSize: Typography.sizes.medium,
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    marginBottom: 12,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  receiptLabel: {
    fontSize: Typography.sizes.small,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  receiptValue: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: '#111',
  },
});
