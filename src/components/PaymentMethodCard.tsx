import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod } from '../types';
import { makeStyles, useTheme } from '../theme';
import { Text } from '../ui';

export const PAYMENT_METHOD_DETAILS: Record<
  PaymentMethod,
  { title: string; icon: 'card' | 'cash'; description: string }
> = {
  paystack: {
    title: 'Pay online',
    icon: 'card',
    description: 'Card, bank transfer or USSD · secured by Paystack',
  },
  cash: {
    title: 'Cash on delivery',
    icon: 'cash',
    description: 'Pay your rider when the food arrives',
  },
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const details = PAYMENT_METHOD_DETAILS[method];

  return (
    <Pressable
      onPress={() => onSelect(method)}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [styles.card, isSelected && styles.selected, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.icon, isSelected && { backgroundColor: t.colors.primary }]}>
        <Ionicons name={details.icon} size={20} color={isSelected ? t.colors.textOnPrimary : t.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong">{details.title}</Text>
        <Text variant="caption" tone="secondary">
          {details.description}
        </Text>
      </View>
      <Ionicons
        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={isSelected ? t.colors.primary : t.colors.borderStrong}
      />
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.lg,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    marginBottom: t.spacing.md,
  },
  selected: { borderColor: t.colors.primary, backgroundColor: t.colors.primarySoft },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
