import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOrder } from '../../src/hooks/queries';
import { PAYMENT_METHOD_DETAILS } from '../../src/components/PaymentMethodCard';
import { formatNaira } from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import { Button, Card, Divider, Screen, SummaryRow, Text } from '../../src/ui';

export default function OrderSuccessScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order } = useOrder(orderId);
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [pop]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View style={[styles.badge, { transform: [{ scale: pop }] }]}>
          <Ionicons name="checkmark" size={64} color={t.colors.textOnPrimary} />
        </Animated.View>

        <Text variant="title" center>
          Order placed!
        </Text>
        <Text tone="secondary" center style={styles.subtitle}>
          {order?.paymentMethod === 'cash'
            ? 'Please have the exact amount ready when your rider arrives.'
            : 'The restaurant has your order and will start preparing it shortly.'}
        </Text>

        {order && (
          <Card style={styles.receipt}>
            <SummaryRow label="Order" value={order.orderNumber} />
            <SummaryRow label="From" value={order.restaurantName} />
            <SummaryRow label="Payment" value={PAYMENT_METHOD_DETAILS[order.paymentMethod].title} />
            <Divider style={{ marginVertical: t.spacing.md }} />
            <SummaryRow label={order.paymentStatus === 'paid' ? 'Paid' : 'To pay'} value={formatNaira(order.total)} strong />
          </Card>
        )}
      </View>

      <View style={styles.actions}>
        <Button title="Track order" icon="navigate" onPress={() => router.replace(`/orders/${orderId}`)} />
        <Button title="Back to home" variant="ghost" onPress={() => router.dismissTo('/')} />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing.xl },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: t.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.spacing.xxl,
    borderWidth: 10,
    borderColor: t.colors.successSoft,
  },
  subtitle: { marginTop: t.spacing.sm, maxWidth: 320 },
  receipt: { alignSelf: 'stretch', marginTop: t.spacing.xxl },
  actions: { paddingHorizontal: t.spacing.xl, paddingBottom: t.spacing.lg, gap: t.spacing.sm },
}));
