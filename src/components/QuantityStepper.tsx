import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { makeStyles, useTheme } from '../theme';
import { Text } from '../ui';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

export default function QuantityStepper({ quantity, onIncrease, onDecrease, size = 'md' }: QuantityStepperProps) {
  const t = useTheme();
  const styles = useStyles();
  const button = size === 'sm' ? 28 : 32;

  const tap = (fn: () => void) => () => {
    Haptics.selectionAsync().catch(() => undefined);
    fn();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={tap(onDecrease)}
        hitSlop={6}
        accessibilityLabel={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
        style={({ pressed }) => [styles.button, { width: button, height: button }, pressed && styles.pressed]}
      >
        <Ionicons name={quantity === 1 ? 'trash-outline' : 'remove'} size={16} color={t.colors.primary} />
      </Pressable>
      <Text variant="bodyStrong" style={styles.quantity} accessibilityLabel={`Quantity ${quantity}`}>
        {quantity}
      </Text>
      <Pressable
        onPress={tap(onIncrease)}
        hitSlop={6}
        accessibilityLabel="Increase quantity"
        style={({ pressed }) => [styles.button, styles.plus, { width: button, height: button }, pressed && styles.pressed]}
      >
        <Ionicons name="add" size={18} color={t.colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.surfaceMuted,
    borderRadius: t.radius.pill,
    padding: 3,
  },
  button: {
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { backgroundColor: t.colors.primary },
  pressed: { transform: [{ scale: 0.9 }] },
  quantity: { minWidth: 28, textAlign: 'center' },
}));
