import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

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

/** iOS-style filled / tinted / plain buttons (50pt tall, 14pt corners). */
export function Button({ title, onPress, variant = 'primary', size = 'lg', icon, trailing, loading, disabled, style }: ButtonProps) {
  const t = useTheme();
  const styles = useStyles();
  const isDisabled = disabled || loading;

  const fg =
    variant === 'primary' || variant === 'danger'
      ? t.colors.textOnPrimary
      : variant === 'secondary'
        ? t.colors.primary
        : t.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      feedback={variant === 'ghost' ? 'opacity' : 'scale'}
      pressScale={0.98}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={[styles.base, size === 'lg' ? styles.lg : styles.md, styles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.content}>
          {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} color={fg} weight="semibold" />}
          <Text variant={size === 'lg' ? 'headline' : 'subheadlineStrong'} style={{ color: fg, flexShrink: 1 }} numberOfLines={1}>
            {title}
          </Text>
          {trailing ? (
            <>
              <View style={{ flex: 1 }} />
              <Text variant="headline" style={{ color: fg }}>
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
  lg: { minHeight: 50 },
  md: { minHeight: 40, borderRadius: t.radius.md, paddingHorizontal: t.spacing.lg },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  primary: { backgroundColor: t.colors.primary },
  secondary: { backgroundColor: t.colors.primarySoft },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: t.colors.danger },
  disabled: { opacity: 0.4 },
}));
