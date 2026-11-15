import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconAnimation, IconName } from './Icon';
import { Pressable } from './Pressable';

interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  /** solid = surface circle with shadow; glass = translucent over photos; plain = no background; soft = tinted fill */
  variant?: 'solid' | 'glass' | 'plain' | 'soft';
  color?: string;
  size?: number;
  /** SF Symbol effect (iOS) re-triggered when `animationKey` changes. */
  animation?: IconAnimation;
  animationKey?: string | number | boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'solid',
  color,
  size = 40,
  animation,
  animationKey,
  style,
}: IconButtonProps) {
  const t = useTheme();
  const styles = useStyles();
  const iconColor = color ?? (variant === 'glass' ? '#FFFFFF' : variant === 'soft' ? t.colors.primary : t.colors.label);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      pressScale={0.9}
      feedback={variant === 'plain' ? 'opacity' : 'scale'}
      style={[styles.base, { width: size, height: size, borderRadius: size / 2 }, styles[variant], style]}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} color={iconColor} animation={animation} animationKey={animationKey} weight="semibold" />
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  base: { alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: t.colors.secondaryGroupedBackground, ...t.shadow(1) },
  glass: { backgroundColor: 'rgba(0,0,0,0.32)' },
  soft: { backgroundColor: t.colors.primarySoft },
  plain: { backgroundColor: 'transparent' },
}));
