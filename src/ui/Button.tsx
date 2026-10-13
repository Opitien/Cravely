import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: IconName;
  /** Shown on the right edge, e.g. a price on a checkout bar. */
  trailing?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  trailing,
  loading,
  disabled,
  style,
}: ButtonProps) {
  const t = useTheme();
  const styles = useStyles();
  const isDisabled = disabled || loading;

  const fg =
    variant === 'primary' || variant === 'danger'
      ? t.colors.textOnPrimary
      : variant === 'secondary'
        ? t.colors.primary
        : t.colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        styles[variant],
        pressed && !isDisabled && (variant === 'primary' ? styles.primaryPressed : styles.pressed),
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={size === 'lg' ? 20 : 18} color={fg} />}
          <Text variant={size === 'lg' ? 'subheading' : 'label'} style={{ color: fg, flexShrink: 1 }} numberOfLines={1}>
            {title}
          </Text>
          {trailing ? (
            <>
              <View style={{ flex: 1 }} />
              <Text variant="subheading" style={{ color: fg }}>
                {trailing}
              </Text>
            </>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.spacing.xl,
  },
  lg: { minHeight: 56 },
  md: { minHeight: 44, borderRadius: t.radius.md, paddingHorizontal: t.spacing.lg },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  primary: { backgroundColor: t.colors.primary },
  primaryPressed: { backgroundColor: t.colors.primaryPressed },
  secondary: { backgroundColor: t.colors.primarySoft },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: t.colors.danger },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
}));
