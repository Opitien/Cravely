import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { initializePayment, verifyPayment } from '../../src/services/api';
import { getErrorMessage } from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import { Button, Screen, Text } from '../../src/ui';

type Phase = 'opening' | 'verifying' | 'failed' | 'pending';

const VERIFY_ATTEMPTS = 5;
const VERIFY_INTERVAL_MS = 2000;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const COPY: Record<Phase, { title: string; body: string }> = {
  opening: { title: 'Opening secure checkout', body: 'You’ll complete payment on Paystack’s secure page.' },
  verifying: { title: 'Confirming payment', body: 'Hang tight, this only takes a moment.' },
  pending: {
    title: 'Still processing',
    body: 'Your bank hasn’t confirmed the payment yet. We’ll update your order automatically once it does.',
  },
  failed: { title: 'Payment not completed', body: 'You haven’t been charged.' },
};

/**
 * Online payment: open Paystack's hosted checkout, then ask our server to verify
 * the transaction with Paystack. The app never decides on its own that a payment succeeded.
 */
export default function PaymentScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [phase, setPhase] = useState<Phase>('opening');
  const [message, setMessage] = useState<string | null>(null);
  const isMounted = useRef(true);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    isMounted.current = true;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => {
      isMounted.current = false;
      loop.stop();
    };
  }, [pulse]);

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

  const busy = phase === 'opening' || phase === 'verifying';
  const tone =
    phase === 'failed'
      ? { color: t.colors.danger, bg: t.colors.dangerSoft, icon: 'close' as const }
      : phase === 'pending'
        ? { color: t.colors.warning, bg: t.colors.warningSoft, icon: 'time' as const }
        : { color: t.colors.primary, bg: t.colors.primarySoft, icon: 'card' as const };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View style={[styles.circle, { backgroundColor: tone.bg }, busy && { transform: [{ scale: pulse }] }]}>
          {busy ? <ActivityIndicator size="large" color={tone.color} /> : <Ionicons name={tone.icon} size={52} color={tone.color} />}
        </Animated.View>
        <Text variant="title" center>
          {COPY[phase].title}
        </Text>
        <Text tone="secondary" center style={styles.body}>
          {phase === 'failed' && message ? message : COPY[phase].body}
        </Text>
      </View>

      {!busy && (
        <View style={styles.actions}>
          {phase === 'failed' && <Button title="Try again" icon="refresh" onPress={startPayment} />}
          {phase === 'pending' && <Button title="Check again" onPress={verify} />}
          <Button title="View order" variant="ghost" onPress={() => router.replace(`/orders/${orderId}`)} />
        </View>
      )}
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing.xxxl },
  circle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.spacing.xxxl,
  },
  body: { marginTop: t.spacing.sm, maxWidth: 320 },
  actions: { paddingHorizontal: t.spacing.xl, paddingBottom: t.spacing.lg, gap: t.spacing.sm },
}));
