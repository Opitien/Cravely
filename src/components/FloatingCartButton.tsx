import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatePresence, MotiView } from 'moti';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Icon, Pressable, Text, useReduceMotion } from '../ui';

/** The bag icon wiggles every time the item count goes up. */
export function AnimatedBag({ count, color, size = 18 }: { count: number; color: string; size?: number }) {
  const reduce = useReduceMotion();
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current && !reduce) {
      rotate.value = withSequence(withTiming(-14, { duration: 60 }), withTiming(12, { duration: 90 }), withTiming(-6, { duration: 80 }), withSpring(0, { damping: 10 }));
      scale.value = withSequence(withTiming(1.25, { duration: 90 }), withSpring(1, { damping: 10 }));
    }
    prev.current = count;
  }, [count, reduce, rotate, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Icon name="bag-handle" size={size} color={color} animation="bounce" animationKey={count} weight="semibold" />
    </Animated.View>
  );
}

/** Sticky "View cart" bar shown over browse screens while the cart has items (slides in/out). */
export default function FloatingCartButton({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const { totalItems, subtotal, restaurant } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <MotiView
          key="cart-bar"
          from={reduce ? { opacity: 0 } : { opacity: 0, translateY: 80 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, translateY: 80 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          style={[styles.container, { bottom: bottomOffset + Math.max(insets.bottom, 12) }]}
        >
          <Pressable
            onPress={() => router.push('/cart')}
            accessibilityRole="button"
            accessibilityLabel={`View cart, ${totalItems} items, ${formatNaira(subtotal)}`}
            pressScale={0.98}
            style={styles.button}
          >
            <View style={styles.badge}>
              <AnimatedBag count={totalItems} color={t.colors.textOnPrimary} />
              <MotiView key={totalItems} from={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} style={styles.count}>
                <Text variant="caption2" style={styles.countText}>
                  {totalItems}
                </Text>
              </MotiView>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headline" tone="inverse">
                View cart
              </Text>
              {restaurant && (
                <Text variant="footnote" style={styles.subtle} numberOfLines={1}>
                  {restaurant.name}
                </Text>
              )}
            </View>
            <Text variant="headline" tone="inverse">
              {formatNaira(subtotal)}
            </Text>
          </Pressable>
        </MotiView>
      )}
    </AnimatePresence>
  );
}

const useStyles = makeStyles((t) => ({
  container: { position: 'absolute', left: t.spacing.lg, right: t.spacing.lg, zIndex: 100 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    backgroundColor: t.colors.primary,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
    borderRadius: t.radius.lg,
    shadowColor: t.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: t.colors.primary, ...t.weight.bold },
  subtle: { color: 'rgba(255,255,255,0.85)' },
}));
