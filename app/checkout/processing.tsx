import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

// Payment takes 2.5 seconds, then succeeds 80% of the time
const PROCESSING_DELAY = 2500;
const SUCCESS_RATE = 0.8;

type PaymentState = 'processing' | 'success' | 'failed';

export default function ProcessingScreen() {
  const router = useRouter();
  // We pass the total through the URL so this screen can display it
  const { total, method } = useLocalSearchParams<{ total: string; method: string }>();

  const [paymentState, setPaymentState] = useState<PaymentState>('processing');

  // Animated value for the pulsing ring
  const pulse = useRef(new Animated.Value(1)).current;
  // Animated value for the icon fade-in
  const iconOpacity = useRef(new Animated.Value(0)).current;

  // Start the pulsing animation loop
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  // Fade in the success/fail icon
  const fadeInIcon = () => {
    Animated.timing(iconOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const processPayment = () => {
    setPaymentState('processing');
    pulse.setValue(1);
    iconOpacity.setValue(0);
    startPulse();

    setTimeout(() => {
      // Stop the pulse animation
      pulse.stopAnimation();

      const succeeded = Math.random() < SUCCESS_RATE;
      if (succeeded) {
        setPaymentState('success');
        fadeInIcon();
        // After showing success for 1.2s, navigate to the success screen
        setTimeout(() => {
          router.replace('/checkout/success');
        }, 1200);
      } else {
        setPaymentState('failed');
        fadeInIcon();
      }
    }, PROCESSING_DELAY);
  };

  // Run payment when screen first mounts
  useEffect(() => {
    processPayment();
  }, []);

  // ── CONTENT based on payment state ──
  const isProcessing = paymentState === 'processing';
  const isSuccess = paymentState === 'success';

  const ringColor = isProcessing
    ? Colors.light.primary
    : isSuccess
    ? '#22C55E'
    : '#EF4444';

  const iconName = isSuccess ? 'checkmark' : 'close';
  const iconColor = isSuccess ? '#22C55E' : '#EF4444';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Amount */}
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amount}>₦{Number(total).toLocaleString()}</Text>
        <Text style={styles.method}>{method ?? 'card'}</Text>

        {/* Animated ring + icon */}
        <View style={styles.circleWrapper}>
          {/* Outer pulsing ring — only animates during processing */}
          <Animated.View
            style={[
              styles.pulseRing,
              { borderColor: ringColor + '40' },
              isProcessing ? { transform: [{ scale: pulse }] } : {},
            ]}
          />

          {/* Inner circle */}
          <View style={[styles.innerCircle, { borderColor: ringColor }]}>
            {isProcessing ? (
              // Spinner dots (simulated with rotating icon)
              <Animated.View style={{ transform: [{ scale: pulse }] }}>
                <Ionicons name="card-outline" size={52} color={Colors.light.primary} />
              </Animated.View>
            ) : (
              <Animated.View style={{ opacity: iconOpacity }}>
                <Ionicons name={iconName} size={56} color={iconColor} />
              </Animated.View>
            )}
          </View>
        </View>

        {/* Status text */}
        <Text style={[styles.statusTitle, !isProcessing && { color: iconColor }]}>
          {isProcessing ? 'Processing Payment…' : isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </Text>
        <Text style={styles.statusSub}>
          {isProcessing
            ? 'Please wait while we confirm your payment'
            : isSuccess
            ? 'Redirecting to your order…'
            : 'Your payment could not be processed. Please try again.'}
        </Text>

        {/* Retry button — only shown on failure */}
        {paymentState === 'failed' && (
          <TouchableOpacity style={styles.retryButton} onPress={processPayment}>
            <Ionicons name="refresh" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {paymentState === 'failed' && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Go Back to Checkout</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },

  amountLabel: {
    fontSize: Typography.sizes.medium,
    color: '#999',
    marginBottom: 2,
  },
  amount: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111',
    letterSpacing: -1,
  },
  method: {
    fontSize: Typography.sizes.medium,
    color: '#aaa',
    textTransform: 'capitalize',
    marginBottom: 32,
  },

  // Animated ring
  circleWrapper: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  statusTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#111',
    textAlign: 'center',
  },
  statusSub: {
    fontSize: Typography.sizes.medium,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: 'white',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#999',
    fontSize: Typography.sizes.medium,
  },
});
