// Web build: lottie-react-native needs a native host, so show the platform spinner instead.
import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type LottieName = 'loader';

export function LottieIcon({ size = 64, style }: { name: LottieName; size?: number; loop?: boolean; autoPlay?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <ActivityIndicator size={size > 40 ? 'large' : 'small'} color={t.colors.primary} style={style} />;
}
