import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { initializePayment, verifyPayment } from '../../src/services/api';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { getErrorMessage } from '../../src/lib/format';

type Phase = 'opening' | 'verifying' | 'failed' | 'pending';

const VERIFY_ATTEMPTS = 5;
const VERIFY_INTERVAL_MS = 2000;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Online payment: open Paystack's hosted checkout, then ask our server to verify
 * the transaction with Paystack. The app never decides on its own that a payment succeeded.
 */
export default function PaymentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [phase, setPhase] = useState<Phase>('opening');
  const [message, setMessage] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const verify = useCallback(async () => {
    setPhase('verifying');
    setMessage(null);
    try {
      // The webhook may land a moment after the browser closes, so poll briefly.
      for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt++) {
        const result = await verifyPayment(orderId);
        if (!isMounted.current) return;
        if (result.payment_status === 'paid') {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          router.replace({ pathname: '/checkout/success', params: { orderId } });
          return;
        }
        if (result.payment_status === 'failed') {
          setPhase('failed');
          setMessage('The payment was not completed. You have not been charged.');
          return;
        }
        await wait(VERIFY_INTERVAL_MS);
      }
      setPhase('pending');
    } catch (e) {
      if (!isMounted.current) return;
      setPhase('failed');
      setMessage(getErrorMessage(e));
    }
  }, [orderId, queryClient, router]);

  const startPayment = useCallback(async () => {
    setPhase('opening');
    setMessage(null);
    try {
      const callbackUrl = Linking.createURL('checkout/callback');
      const { authorization_url } = await initializePayment(orderId, callbackUrl);
      if (!isMounted.current) return;
      // Resolves when Paystack redirects to callbackUrl, or when the user closes the browser.
      await WebBrowser.openAuthSessionAsync(authorization_url, callbackUrl);
      if (!isMounted.current) return;
      await verify();
    } catch (e) {
      if (!isMounted.current) return;
      const text = getErrorMessage(e);
      if (/already paid/i.test(text)) {
        router.replace({ pathname: '/checkout/success', params: { orderId } });
        return;
      }
      setPhase('failed');
      setMessage(text);
    }
  }, [orderId, router, verify]);

  useEffect(() => {
    if (orderId) startPayment();
    // Run once per order
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const goToOrder = () => router.replace(`/orders/${orderId}`);

  const busy = phase === 'opening' || phase === 'verifying';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.circle, { borderColor: busy ? Colors.light.primary : phase === 'pending' ? '#F59E0B' : Colors.light.danger }]}>
          {busy ? (
            <ActivityIndicator size="large" color={Colors.light.primary} />
          ) : (
            <Ionicons
              name={phase === 'pending' ? 'time-outline' : 'close'}
              size={56}
              color={phase === 'pending' ? '#F59E0B' : Colors.light.danger}
            />
          )}
        </View>

        <Text style={styles.title}>
          {phase === 'opening'
            ? 'Opening secure checkout…'
            : phase === 'verifying'
              ? 'Confirming your payment…'
              : phase === 'pending'
                ? 'Payment still processing'
                : 'Payment not completed'}
        </Text>
        <Text style={styles.subtitle}>
          {phase === 'opening'
            ? 'You will pay on Paystack’s secure page.'
            : phase === 'verifying'
              ? 'This only takes a moment.'
              : phase === 'pending'
                ? 'Your bank hasn’t confirmed the payment yet. We’ll update your order automatically once it does.'
                : (message ?? 'Something went wrong.')}
        </Text>

        {phase === 'failed' && (
          <TouchableOpacity style={styles.primaryButton} onPress={startPayment}>
            <Ionicons name="refresh" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.primaryText}>Try Again</Text>
          </TouchableOpacity>
        )}
        {phase === 'pending' && (
          <TouchableOpacity style={styles.primaryButton} onPress={verify}>
            <Text style={styles.primaryText}>Check Again</Text>
          </TouchableOpacity>
        )}
        {!busy && (
          <TouchableOpacity style={styles.secondaryButton} onPress={goToOrder}>
            <Text style={styles.secondaryText}>View Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    marginTop: 40,
  },
  primaryText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  secondaryText: {
    color: Colors.light.primary,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
