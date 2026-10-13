import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Text } from '../ui';

/** Sticky "View cart" bar shown over browse screens while the cart has items. */
export default function FloatingCartButton({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { totalItems, subtotal, restaurant } = useCart();
  const slide = useRef(new Animated.Value(totalItems > 0 ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slide, { toValue: totalItems > 0 ? 1 : 0, useNativeDriver: true, friction: 8 }).start();
  }, [totalItems, slide]);

  if (totalItems === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: bottomOffset + Math.max(insets.bottom, 12) },
        { opacity: slide, transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }] },
      ]}
    >
      <Pressable
        onPress={() => router.push('/cart')}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${totalItems} items, ${formatNaira(subtotal)}`}
        style={({ pressed }) => [styles.button, pressed && { backgroundColor: t.colors.primaryPressed }]}
      >
        <View style={styles.badge}>
          <Ionicons name="bag-handle" size={18} color={t.colors.textOnPrimary} />
          <View style={styles.count}>
            <Text variant="caption" style={styles.countText}>
              {totalItems}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="subheading" tone="inverse">
            View cart
          </Text>
          {restaurant && (
            <Text variant="caption" style={styles.subtle} numberOfLines={1}>
              {restaurant.name}
            </Text>
          )}
        </View>
        <Text variant="subheading" tone="inverse">
          {formatNaira(subtotal)}
        </Text>
      </Pressable>
    </Animated.View>
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
    borderRadius: t.radius.xl,
    shadowColor: t.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
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
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: t.colors.primary, fontFamily: t.fonts.extrabold },
  subtle: { color: 'rgba(255,255,255,0.85)' },
}));
