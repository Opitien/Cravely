import React from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AnimatePresence, MotiView } from 'moti';
import { makeStyles, useTheme } from '../theme';
import { Icon, Pressable, Text, useReduceMotion } from '../ui';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

/** iOS stepper look: pill track, round buttons, number that rolls up/down as it changes. */
export default function QuantityStepper({ quantity, onIncrease, onDecrease, size = 'md' }: QuantityStepperProps) {
  const t = useTheme();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const button = size === 'sm' ? 28 : 32;
  const dir = React.useRef(1);
  const prev = React.useRef(quantity);
  if (quantity !== prev.current) {
    dir.current = quantity > prev.current ? 1 : -1;
    prev.current = quantity;
  }

  const tap = (fn: () => void) => () => {
    Haptics.selectionAsync().catch(() => undefined);
    fn();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={tap(onDecrease)}
        hitSlop={6}
        pressScale={0.88}
        accessibilityRole="button"
        accessibilityLabel={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
        style={[styles.button, { width: button, height: button }]}
      >
        <Icon name={quantity === 1 ? 'trash-outline' : 'remove'} size={15} color={t.colors.primary} weight="bold" />
      </Pressable>
      <View style={styles.quantityWrap} accessibilityLabel={`Quantity ${quantity}`}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={quantity}
            from={reduce ? { opacity: 0 } : { opacity: 0, translateY: 10 * dir.current }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, translateY: -10 * dir.current }}
            transition={{ type: 'timing', duration: 120 }}
          >
            <Text variant="subheadlineStrong" style={styles.quantity}>
              {quantity}
            </Text>
          </MotiView>
        </AnimatePresence>
      </View>
      <Pressable
        onPress={tap(onIncrease)}
        hitSlop={6}
        pressScale={0.88}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={[styles.button, styles.plus, { width: button, height: button }]}
      >
        <Icon name="add" size={17} color={t.colors.textOnPrimary} weight="bold" />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.tertiaryFill,
    borderRadius: t.radius.pill,
    padding: 3,
  },
  button: {
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.secondaryGroupedBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { backgroundColor: t.colors.primary },
  quantityWrap: { minWidth: 28, alignItems: 'center', overflow: 'hidden' },
  quantity: { textAlign: 'center' },
}));
