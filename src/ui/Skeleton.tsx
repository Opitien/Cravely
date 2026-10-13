import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

/** Pulsing placeholder shown while content loads. */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: t.colors.skeleton, opacity }, style]}
    />
  );
}

export function RestaurantCardSkeleton() {
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
      <Skeleton height={190} radius={20} />
      <Skeleton width="60%" height={18} style={{ marginTop: 14 }} />
      <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
    </View>
  );
}

export function ListRowSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16, alignItems: 'center' }}>
      <Skeleton width={56} height={56} radius={14} />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="45%" height={12} />
      </View>
    </View>
  );
}
