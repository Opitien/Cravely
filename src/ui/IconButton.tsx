import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  /** solid = surface circle with shadow; glass = translucent over photos; plain = no background */
  variant?: 'solid' | 'glass' | 'plain' | 'soft';
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'solid',
  color,
  size = 40,
  style,
}: IconButtonProps) {
  const t = useTheme();
  const styles = useStyles();
  const iconColor = color ?? (variant === 'glass' ? '#FFFFFF' : variant === 'soft' ? t.colors.primary : t.colors.text);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        styles[variant],
        pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
        style,
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.5)} color={iconColor} />
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  base: { alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: t.colors.surface, ...t.shadow(1) },
  glass: { backgroundColor: 'rgba(0,0,0,0.35)' },
  soft: { backgroundColor: t.colors.primarySoft },
  plain: { backgroundColor: 'transparent' },
}));
