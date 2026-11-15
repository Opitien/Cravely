import React from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { PaymentMethod } from '../types';
import { makeStyles, useTheme } from '../theme';
import { Icon, Pressable, Text } from '../ui';

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

/** Radio-style grouped row with an animated tinted selection ring. */
export default function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const details = PAYMENT_METHOD_DETAILS[method];

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onSelect(method);
      }}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      pressScale={0.985}
    >
      <MotiView
        animate={{ borderColor: isSelected ? t.colors.primary : 'rgba(0,0,0,0)', backgroundColor: isSelected ? t.colors.primarySoft : t.colors.secondaryGroupedBackground }}
        transition={{ type: 'timing', duration: 160 }}
        style={styles.card}
      >
        <MotiView animate={{ backgroundColor: isSelected ? t.colors.primary : t.colors.primarySoft }} transition={{ type: 'timing', duration: 160 }} style={styles.icon}>
          <Icon name={details.icon} size={18} color={isSelected ? t.colors.textOnPrimary : t.colors.primary} weight="semibold" />
        </MotiView>
        <View style={{ flex: 1 }}>
          <Text variant="headline">{details.title}</Text>
          <Text variant="footnote" tone="secondary">
            {details.description}
          </Text>
        </View>
        <Icon
          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isSelected ? t.colors.primary : t.colors.tertiaryLabel}
          animation="bounce"
          animationKey={isSelected}
        />
      </MotiView>
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
    borderWidth: 1.5,
    marginBottom: t.spacing.md,
    ...t.shadow(1),
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
