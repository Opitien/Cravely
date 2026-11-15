/**
 * LottieIcon — small looping Lottie animations (lottie-react-native). Bundled sources live in ./lottie.
 * Falls back to an ActivityIndicator when motion is reduced. Web uses LottieIcon.web.tsx.
 */
import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../theme';
import { useReduceMotion } from './motion';

const SOURCES = {
  loader: require('./lottie/loader.json'),
} as const;

export type LottieName = keyof typeof SOURCES;

export function LottieIcon({
  name,
  size = 64,
  loop = true,
  autoPlay = true,
  style,
}: {
  name: LottieName;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const reduce = useReduceMotion();
  if (reduce) return <ActivityIndicator size="large" color={t.colors.primary} style={style} />;
  return (
    <LottieView
      source={SOURCES[name]}
      autoPlay={autoPlay}
      loop={loop}
      style={[{ width: size, height: size }, style]}
      colorFilters={[
        { keypath: 'dot1', color: t.colors.primary },
        { keypath: 'dot2', color: t.colors.primary },
        { keypath: 'dot3', color: t.colors.primary },
      ]}
    />
  );
}
