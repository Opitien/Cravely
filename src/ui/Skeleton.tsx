import React, { useEffect } from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { useReduceMotion } from './motion';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/** Loading placeholder with an iOS-style diagonal shimmer (transform-only, runs on the UI thread). */
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
  const reduce = useReduceMotion();
  const x = useSharedValue(-1);

  useEffect(() => {
    if (reduce) return;
    x.value = -1;
    x.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, [reduce, x]);

  const shimmer = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 320 }] }));
  const highlight = t.dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: t.colors.skeleton, overflow: 'hidden' }, style]}
    >
      {!reduce && (
        <AnimatedGradient
          colors={['transparent', highlight, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[{ position: 'absolute', top: 0, bottom: 0, width: 320, left: 0 }, shimmer]}
        />
      )}
    </View>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
      <Skeleton height={190} radius={14} />
      <Skeleton width="60%" height={18} style={{ marginTop: 14 }} />
      <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
    </View>
  );
}

export function ListRowSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 16, alignItems: 'center' }}>
      <Skeleton width={56} height={56} radius={12} />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="70%" height={16} />
        <Skeleton width="45%" height={12} />
      </View>
    </View>
  );
}
